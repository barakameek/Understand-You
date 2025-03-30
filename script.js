// --- Global State ---
let currentQuestionIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
let network = null; // Store Vis.js Network instance
let allNodesDataSet = null; // Store the original nodes dataset

// --- DOM Elements ---
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startButton');
const questionnaireScreen = document.getElementById('questionnaireScreen');
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const nextQButton = document.getElementById('nextQButton');
const profileScreen = document.getElementById('profileScreen');
const profileScoresDiv = document.getElementById('profileScores');
const showMapButton = document.getElementById('showMapButton');
const mapScreen = document.getElementById('mapScreen');
const networkContainer = document.getElementById('network');
const restartButton = document.getElementById('restartButton');

// --- Functions ---

function showScreen(screenId) {
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.remove('hidden');
            screen.classList.add('current');
        } else {
            screen.classList.add('hidden');
            screen.classList.remove('current');
        }
    });
}

function displayQuestion(index) {
    if (index >= questionnaire.length) {
        calculateAndShowProfile();
        return;
    }

    const q = questionnaire[index];
    progressText.textContent = `Question ${index + 1} / ${questionnaire.length}`;
    let inputHTML = `<h3 class="question-title">${q.text}</h3><div class="input-container">`;

    if (q.type === "slider") {
        const currentValue = userAnswers[q.questionId] !== undefined ? userAnswers[q.questionId] : q.defaultValue;
        inputHTML += `
            <div class="slider-container">
                <input type="range" id="q${q.questionId}" class="slider"
                       min="${q.minValue}" max="${q.maxValue}" step="1" value="${currentValue}">
                <div class="label-container">
                    <span class="label-text">${q.minLabel}</span>
                    <span class="label-text">${q.maxLabel}</span>
                </div>
                <p class="value-text">Selected Value: <span id="sliderValueDisplay_q${q.questionId}">${currentValue}</span></p>
            </div>
        `;
    } else if (q.type === "radio") {
        inputHTML += `<div class="radio-options">`;
        q.options.forEach(opt => {
            const isChecked = userAnswers[q.questionId] === opt.value ? 'checked' : '';
            inputHTML += `
                <div>
                    <input type="radio" id="q${q.questionId}_${opt.value}" name="q${q.questionId}" value="${opt.value}" ${isChecked}>
                    <label for="q${q.questionId}_${opt.value}">${opt.value}</label>
                </div>
            `;
        });
        inputHTML += `</div>`;
    } else if (q.type === "checkbox") {
        inputHTML += `<div class="checkbox-options">`;
         q.options.forEach(opt => {
            // Check if this option was previously selected
            const isChecked = userAnswers[q.questionId]?.includes(opt.value) ? 'checked' : '';
             inputHTML += `
                <div>
                     <input type="checkbox" id="q${q.questionId}_${opt.value}" name="q${q.questionId}" value="${opt.value}" ${isChecked} data-max-choices="2">
                     <label for="q${q.questionId}_${opt.value}">${opt.value}</label>
                 </div>
             `;
         });
         inputHTML += `</div>`;
    }

    inputHTML += `</div>`;
    questionContent.innerHTML = inputHTML;

    // Add event listeners for dynamic inputs
    if (q.type === "slider") {
        const sliderInput = document.getElementById(`q${q.questionId}`);
        const displaySpan = document.getElementById(`sliderValueDisplay_q${q.questionId}`);
        // Update display immediately on input
        sliderInput.addEventListener('input', () => {
            displaySpan.textContent = sliderInput.value;
        });
    }
    if (q.type === "checkbox") {
        const checkboxes = questionContent.querySelectorAll(`input[name="q${q.questionId}"]`);
        checkboxes.forEach(cb => {
            // Add listener to enforce max choices when checkbox state changes
            cb.addEventListener('change', () => enforceMaxChoices(cb.name, parseInt(cb.dataset.maxChoices || 2))); // Default max 2 if not set
        });
    }
}

function enforceMaxChoices(name, max) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        // Find which checkbox was just checked to cause the excess and uncheck it
        // This requires knowing the event target, which we don't have here directly.
        // A simpler approach for now: just alert and maybe disable further checks,
        // or force the user to uncheck one. Let's stick to the alert for MVP simplicity.
        // Ideally, you'd find the last checked item and revert its state.
        event.target.checked = false; // Attempt to uncheck the one just clicked (might need event passed)
    }
}


function processAnswer(index) {
    if (index >= questionnaire.length) return; // Avoid processing beyond last question

    const q = questionnaire[index];
    const elementToUpdate = q.element;
    let pointsToAdd = 0;
    let answerValue = null;

    if (q.type === "slider") {
        const sliderInput = document.getElementById(`q${q.questionId}`);
        answerValue = parseInt(sliderInput.value);
        // Compare current answer to previous answer for this question if it exists
        const previousAnswer = userAnswers[q.questionId] !== undefined ? userAnswers[q.questionId] : q.defaultValue;
        const previousPoints = (previousAnswer - q.defaultValue);
        const currentPoints = (answerValue - q.defaultValue);
        pointsToAdd = currentPoints - previousPoints; // Add the difference
        userAnswers[q.questionId] = answerValue;

    } else if (q.type === "radio") {
        const selectedRadio = document.querySelector(`input[name="q${q.questionId}"]:checked`);
        const previousAnswer = userAnswers[q.questionId];
        let previousPoints = 0;
        if (previousAnswer) {
             const prevOption = q.options.find(opt => opt.value === previousAnswer);
             previousPoints = prevOption ? prevOption.points : 0;
        }

        if (selectedRadio) {
            answerValue = selectedRadio.value;
            userAnswers[q.questionId] = answerValue;
            const selectedOption = q.options.find(opt => opt.value === answerValue);
            const currentPoints = selectedOption ? selectedOption.points : 0;
            pointsToAdd = currentPoints - previousPoints; // Add the difference
        } else {
            userAnswers[q.questionId] = null; // Store null if nothing selected
            pointsToAdd = 0 - previousPoints; // Revert effect if selection removed
        }
    } else if (q.type === "checkbox") {
         const selectedCheckboxes = document.querySelectorAll(`input[name="q${q.questionId}"]:checked`);
         const previousAnswerArray = userAnswers[q.questionId] || [];
         let previousPoints = 0;
         previousAnswerArray.forEach(prevVal => {
             const prevOption = q.options.find(opt => opt.value === prevVal);
             previousPoints += prevOption ? prevOption.points : 0;
         });

         answerValue = [];
         let currentPoints = 0;
         selectedCheckboxes.forEach(cb => {
             const optionValue = cb.value;
             answerValue.push(optionValue);
             const selectedOption = q.options.find(opt => opt.value === optionValue);
             currentPoints += selectedOption ? selectedOption.points : 0;
         });
         userAnswers[q.questionId] = answerValue; // Store array of selected values
         pointsToAdd = currentPoints - previousPoints; // Add the difference
    }

    // Update the score (ensure it stays within 0-10)
    if (elementToUpdate && pointsToAdd !== 0) { // Only update if there's a change
        userScores[elementToUpdate] = Math.max(0, Math.min(10, userScores[elementToUpdate] + pointsToAdd));
         console.log(`Updated ${elementToUpdate}: ${userScores[elementToUpdate].toFixed(1)} (changed by ${pointsToAdd.toFixed(1)})`);
    }
}

function calculateAndShowProfile() {
    console.log("Final Scores:", userScores);
    profileScoresDiv.innerHTML = ''; // Clear previous scores
    for (const element in userScores) {
        profileScoresDiv.innerHTML += `<div><strong>${element}:</strong> ${userScores[element].toFixed(1)}</div>`;
    }
    showScreen('profileScreen');
}

// Simplified Euclidean Distance Calculation
function euclideanDistance(profile1, profile2) {
    let sum = 0;
    const elements = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
    for (let i = 0; i < elements.length; i++) {
        const key = elements[i];
        const score1 = profile1[key];
        const score2 = profile2[i];
        sum += Math.pow(score1 - score2, 2);
    }
    return Math.sqrt(sum);
}


// --- Calculate and Show Map function (includes Vis.js setup) ---
function calculateAndShowMap() {
    console.log("Calculating matches for network graph based on scores:", userScores);

    const matchedConcepts = concepts.map(concept => {
        if (!concept.profile || concept.profile.length !== 6) {
             console.warn(`Concept ${concept.name} missing or invalid profile.`);
             return { ...concept, distance: Infinity };
        }
        const distance = euclideanDistance(userScores, concept.profile);
        return { ...concept, distance: distance };
    }).filter(c => c.distance !== Infinity);

    matchedConcepts.sort((a, b) => a.distance - b.distance);

    const nodesArray = [];
    const edges = [];
    const topN = 15;
    const conceptIdsOnGraph = new Set(); // Keep track of IDs added

    // Use distance of Nth item or a fallback max distance for scaling
    const maxRefDistance = matchedConcepts[topN - 1]?.distance || 20;

    const typeColors = {
        "Orientation": "#87CEEB", "Relationship Style": "#98FB98", "Identity/Role": "#FFD700",
        "Practice": "#FFA07A", "Kink": "#FF6347", "Fetish": "#FFB6C1", "Framework": "#DDA0DD",
        "Goal/Concept": "#B0E0E6", "Approach": "#F0E68C", "Default": "#D3D3D3"
    };

    nodesArray.push({
        id: 0, label: "You", color: { background:'#ff69b4', border:'#ff1493' },
        size: 30, shape: 'star', font: { size: 16 }, fixed: true // Fix "You" node in center
    });
    conceptIdsOnGraph.add(0);

    matchedConcepts.slice(0, topN).forEach(concept => {
        if(conceptIdsOnGraph.has(concept.id)) return; // Avoid duplicates if relation brought it in early

        const relevance = Math.max(0.1, 1 - (concept.distance / (maxRefDistance * 1.5)));
        const nodeSize = 15 + relevance * 15;
        const nodeColor = typeColors[concept.type] || typeColors["Default"];

        nodesArray.push({
            id: concept.id, label: concept.name,
            title: `${concept.name} (${concept.type})\nMatch Score (Lower is better): ${concept.distance.toFixed(2)}`,
            size: nodeSize,
            color: nodeColor,
            originalColor: nodeColor,
            font: { size: 12 }
        });
        conceptIdsOnGraph.add(concept.id);

        const edgeLength = 100 + concept.distance * 15;
        edges.push({ from: 0, to: concept.id, length: edgeLength, dashes: true, color: '#e0e0e0' }); // Dashed edges from You
    });

    // Store original nodes dataset
    allNodesDataSet = new vis.DataSet(nodesArray);

    const data = {
        nodes: allNodesDataSet,
        edges: new vis.DataSet(edges), // Start with edges from "You"
    };
    const options = {
         nodes: { shape: "dot", borderWidth: 2, font: { color: '#343434', size: 14, face: 'arial'} },
         edges: { width: 1, color: { color: "#cccccc", highlight: "#8A2BE2", hover: "#b39ddb", inherit: false }, smooth: { enabled: true, type: 'dynamic' } },
         physics: { enabled: true, solver: 'forceAtlas2Based', forceAtlas2Based: { gravitationalConstant: -50, centralGravity: 0.01, springLength: 150, springConstant: 0.05, damping: 0.4 }, stabilization: { iterations: 200, fit: true } }, // Increase iterations
         interaction: { dragNodes: true, dragView: true, hover: true, zoomView: true, tooltipDelay: 200 },
         layout: { hierarchical: false }
    };

    if (network) { network.destroy(); }
    network = new vis.Network(networkContainer, data, options);

    network.on('click', handleNetworkClick);

    showScreen('mapScreen');
}

// --- Handle clicks on the network ---
function handleNetworkClick(params) {
    const clickedNodeIds = params.nodes;
    const edgesToUpdate = []; // To dynamically add/remove edges

    // Get current edge dataset
    const edgeDataSet = network.body.data.edges;

    // Reset previous highlighting and remove dynamic edges
    resetNodeStyles(); // Resets node appearances
    const edgesToRemove = edgeDataSet.get({ filter: edge => edge.dynamic === true }); // Find previous dynamic edges
    if (edgesToRemove.length > 0) {
         edgeDataSet.remove(edgesToRemove.map(e => e.id)); // Remove them
    }


    if (clickedNodeIds.length > 0) {
        const nodeId = clickedNodeIds[0];
        if (nodeId !== 0) { // Clicked on a concept node
            highlightRelatedNodes(nodeId); // Highlight nodes

            // Add dynamic edges between related nodes
            const selectedNodeData = concepts.find(c => c.id === nodeId);
            const relatedIds = selectedNodeData?.relatedIds || [];

            relatedIds.forEach(relatedId => {
                 // Only add edge if the related node is currently visible on the graph
                if (allNodesDataSet.get(relatedId)) {
                    // Check if edge already exists (avoid duplicates) - simple check
                    const existingEdge = edgeDataSet.get({
                        filter: edge => (edge.from === nodeId && edge.to === relatedId) || (edge.from === relatedId && edge.to === nodeId)
                    });

                    if(existingEdge.length === 0) {
                         edgesToUpdate.push({
                             from: nodeId,
                             to: relatedId,
                             color: '#8A2BE2', // Highlight color
                             width: 2,
                             dashes: false,
                             dynamic: true // Mark as dynamic for easy removal later
                         });
                     }
                }
            });
             if (edgesToUpdate.length > 0) {
                 edgeDataSet.add(edgesToUpdate); // Add new dynamic edges
            }
        }
        // Clicking "Me" node implicitly resets via the initial resetNodeStyles call
    }
    // Clicking background implicitly resets via the initial resetNodeStyles call
}

// --- Highlight selected node and its relatives ---
function highlightRelatedNodes(selectedNodeId) {
    if (!allNodesDataSet) return;

    const updates = [];
    const selectedNodeData = concepts.find(c => c.id === selectedNodeId);
    const relatedIds = selectedNodeData?.relatedIds || [];
    const highlightColor = '#8A2BE2'; // Violet for related borders

    allNodesDataSet.forEach(node => {
        let nodeUpdate = { id: node.id }; // Start with just ID

        if (node.id === 0) { // "Me" node
            nodeUpdate.color = { background:'#ff69b4', border:'#ff1493' };
            nodeUpdate.shadow = false;
            nodeUpdate.borderWidth = 2;
        } else if (node.id === selectedNodeId) {
            // Strongly highlight the selected node
            nodeUpdate.borderWidth = 4;
            nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 3, y: 3 };
            nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) }; // Darker border
        } else if (relatedIds.includes(node.id)) {
            // Highlight related nodes
            nodeUpdate.borderWidth = 3;
            nodeUpdate.shadow = false;
            nodeUpdate.color = { background: node.originalColor, border: highlightColor }; // Highlight border
        } else {
            // Dim non-related nodes (using opacity via RGBA)
            const rgb = hexToRgb(node.originalColor);
            nodeUpdate.color = { background: `rgba(${rgb}, 0.2)`, border: `rgba(${rgb}, 0.1)` };
            nodeUpdate.borderWidth = 1;
            nodeUpdate.shadow = false;
            // Dim label color too
            nodeUpdate.font = { color: 'rgba(52, 52, 52, 0.3)' }; // Dimmed default font color
        }
        updates.push(nodeUpdate);
    });

    allNodesDataSet.update(updates);
}

// --- Reset all nodes to default styles ---
function resetNodeStyles() {
    if (!allNodesDataSet) return;
    const updates = [];
    allNodesDataSet.forEach(node => {
        let resetColor = node.originalColor;
        if (node.id === 0) {
             resetColor = { background:'#ff69b4', border:'#ff1493' };
        }
        updates.push({
            id: node.id,
            color: (typeof resetColor === 'string' || !resetColor) ? resetColor : { background: resetColor, border: darkenColor(resetColor) },
            borderWidth: 2,
            shadow: false,
            font: { color: '#343434', size: (node.id === 0 ? 16 : 12) } // Reset font color and size
        });
    });
    allNodesDataSet.update(updates);
}

// --- Utility functions for color manipulation ---
function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return '128,128,128';
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; // Handle shorthand hex
    const bigint = parseInt(hex, 16);
    if (isNaN(bigint)) return '128,128,128';
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
}
function darkenColor(hex, amount = 30) {
     if (!hex || typeof hex !== 'string') return '#808080';
     hex = hex.replace('#', '');
     if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
     let r = parseInt(hex.substring(0,2), 16);
     let g = parseInt(hex.substring(2,4), 16);
     let b = parseInt(hex.substring(4,6), 16);
     if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080';
     r = Math.max(0, r - amount);
     g = Math.max(0, g - amount);
     b = Math.max(0, b - amount);
     return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}


// --- Reset App function ---
function resetApp() {
     currentQuestionIndex = 0;
     // Reset scores more carefully
     userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
     userAnswers = {};
     if (network) {
         network.destroy();
         network = null;
     }
     allNodesDataSet = null;
     showScreen('welcomeScreen');
}


// --- Event Listeners ---
startButton.addEventListener('click', () => {
    displayQuestion(currentQuestionIndex);
    showScreen('questionnaireScreen');
});

nextQButton.addEventListener('click', () => {
    processAnswer(currentQuestionIndex); // Process current answer *before* incrementing
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex); // Display next or show profile
});

showMapButton.addEventListener('click', calculateAndShowMap);

restartButton.addEventListener('click', resetApp);


// --- Initial Setup ---
showScreen('welcomeScreen');
