// --- Global State ---
let currentQuestionIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
let network = null;
let allNodesDataSet = null; // Use this as the single source of truth for nodes in the graph
let allEdgesDataSet = null; // Use this for edges
let fullMatchedConceptsList = []; // Store the full sorted list after calculation

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
        screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden');
        screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current');
    });
     // Special handling for map screen to ensure vis.js redraws correctly if needed
     if (screenId === 'mapScreen' && network) {
         // Delay slightly to ensure DOM is visible
         setTimeout(() => network.redraw(), 50);
    }
}


function displayQuestion(index) {
    if (index >= questionnaire.length) {
        calculateAndShowProfile();
        return;
    }

    const q = questionnaire[index];
    progressText.textContent = `Question ${index + 1} / ${questionnaire.length}`;
    let inputHTML = `<h3 class="question-title">${q.text}</h3><div class="input-container">`;

    // Slider Input
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
    }
    // Radio Input
    else if (q.type === "radio") {
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
    }
    // Checkbox Input
    else if (q.type === "checkbox") {
        inputHTML += `<div class="checkbox-options">`;
         q.options.forEach(opt => {
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

    // Add event listeners
    if (q.type === "slider") {
        const sliderInput = document.getElementById(`q${q.questionId}`);
        const displaySpan = document.getElementById(`sliderValueDisplay_q${q.questionId}`);
        sliderInput.addEventListener('input', () => { displaySpan.textContent = sliderInput.value; });
    }
    if (q.type === "checkbox") {
        const checkboxes = questionContent.querySelectorAll(`input[name="q${q.questionId}"]`);
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (event) => enforceMaxChoices(cb.name, parseInt(cb.dataset.maxChoices || 2), event)); // Pass event
        });
    }
}

// Modified enforceMaxChoices to use event target
function enforceMaxChoices(name, max, event) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        if (event && event.target) {
            event.target.checked = false; // Uncheck the one just clicked
        }
    }
}

// Modified processAnswer to correctly handle score adjustments
function processAnswer(index) {
    if (index >= questionnaire.length) return;

    const q = questionnaire[index];
    const elementToUpdate = q.element;
    let pointsToAdd = 0;
    let answerValue = null;

    // Get previous total points for this question's element contribution
    let previousPointsContribution = 0;
    const prevAnswer = userAnswers[q.questionId];
    if (q.type === "slider" && prevAnswer !== undefined) {
        previousPointsContribution = (prevAnswer - q.defaultValue);
    } else if (q.type === "radio" && prevAnswer) {
        const prevOption = q.options.find(opt => opt.value === prevAnswer);
        previousPointsContribution = prevOption ? prevOption.points : 0;
    } else if (q.type === "checkbox" && prevAnswer) {
        prevAnswer.forEach(prevVal => {
             const prevOption = q.options.find(opt => opt.value === prevVal);
             previousPointsContribution += prevOption ? prevOption.points : 0;
         });
    }

    // Get current answer and points
    let currentPointsContribution = 0;
     if (q.type === "slider") {
        const sliderInput = document.getElementById(`q${q.questionId}`);
        answerValue = parseInt(sliderInput.value);
        currentPointsContribution = (answerValue - q.defaultValue);
        userAnswers[q.questionId] = answerValue;
    } else if (q.type === "radio") {
        const selectedRadio = document.querySelector(`input[name="q${q.questionId}"]:checked`);
        if (selectedRadio) {
            answerValue = selectedRadio.value;
            const selectedOption = q.options.find(opt => opt.value === answerValue);
            currentPointsContribution = selectedOption ? selectedOption.points : 0;
            userAnswers[q.questionId] = answerValue;
        } else {
            userAnswers[q.questionId] = null; // Store null if nothing selected
            currentPointsContribution = 0; // No points if nothing selected
        }
    } else if (q.type === "checkbox") {
         const selectedCheckboxes = document.querySelectorAll(`input[name="q${q.questionId}"]:checked`);
         answerValue = [];
         selectedCheckboxes.forEach(cb => {
             const optionValue = cb.value;
             answerValue.push(optionValue);
             const selectedOption = q.options.find(opt => opt.value === optionValue);
             currentPointsContribution += selectedOption ? selectedOption.points : 0;
         });
         userAnswers[q.questionId] = answerValue;
    }

    // Calculate the difference to add/subtract from the main score
    pointsToAdd = currentPointsContribution - previousPointsContribution;

    // Update the score
    if (elementToUpdate && pointsToAdd !== 0) {
        userScores[elementToUpdate] = Math.max(0, Math.min(10, userScores[elementToUpdate] + pointsToAdd));
         console.log(`Updated ${elementToUpdate}: ${userScores[elementToUpdate].toFixed(1)} (changed by ${pointsToAdd.toFixed(1)})`);
    } else if (!elementToUpdate) {
        // Store answer even if it doesn't directly map to a score (might be used later)
         userAnswers[q.questionId] = answerValue;
    }
}


function calculateAndShowProfile() {
    console.log("Final Scores:", userScores);
    profileScoresDiv.innerHTML = '';
    for (const element in userScores) {
        profileScoresDiv.innerHTML += `<div><strong>${element}:</strong> ${userScores[element].toFixed(1)}</div>`;
    }
    showScreen('profileScreen');
}

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

// --- Calculate and Show Initial Map ---
function calculateAndShowMap() {
    console.log("Calculating initial map based on scores:", userScores);

    // Calculate distances and sort all concepts
    fullMatchedConceptsList = concepts.map(concept => { // Store full sorted list globally
        if (!concept.profile || concept.profile.length !== 6) return { ...concept, distance: Infinity };
        const distance = euclideanDistance(userScores, concept.profile);
        return { ...concept, distance: distance };
    }).filter(c => c.distance !== Infinity);
    fullMatchedConceptsList.sort((a, b) => a.distance - b.distance);

    const initialNodesArray = [];
    const initialEdgesArray = [];
    const initialTopN = 7; // Show fewer initially

    const typeColors = { /* ... same colors as before ... */
        "Orientation": "#87CEEB", "Relationship Style": "#98FB98", "Identity/Role": "#FFD700",
        "Practice": "#FFA07A", "Kink": "#FF6347", "Fetish": "#FFB6C1", "Framework": "#DDA0DD",
        "Goal/Concept": "#B0E0E6", "Approach": "#F0E68C", "Default": "#D3D3D3"
    };

    // Add "Me" node
    initialNodesArray.push({
        id: 0, label: "You", color: { background:'#ff69b4', border:'#ff1493' },
        size: 30, shape: 'star', font: { size: 16 }, fixed: true // Fix "You" node
    });

    // Add initial Top N concept nodes
    fullMatchedConceptsList.slice(0, initialTopN).forEach(concept => {
        const nodeColor = typeColors[concept.type] || typeColors["Default"];
        initialNodesArray.push({
            id: concept.id, label: concept.name,
            title: `${concept.name} (${concept.type})\nMatch Score: ${concept.distance.toFixed(2)}`,
            size: 20, // Standard initial size
            color: nodeColor,
            originalColor: nodeColor,
            font: { size: 12 }
        });
        // Initial edges connect only to "You"
        initialEdgesArray.push({ from: 0, to: concept.id, length: 150 + concept.distance * 10, dashes: true, color: '#e0e0e0' });
    });

    // Create datasets
    allNodesDataSet = new vis.DataSet(initialNodesArray);
    allEdgesDataSet = new vis.DataSet(initialEdgesArray);

    const data = { nodes: allNodesDataSet, edges: allEdgesDataSet };
    const options = { /* ... same options as before ... */
         nodes: { shape: "dot", borderWidth: 2, font: { color: '#343434', size: 14, face: 'arial'} },
         edges: { width: 1, color: { color: "#cccccc", highlight: "#8A2BE2", hover: "#b39ddb", inherit: false }, smooth: { enabled: true, type: 'dynamic' } },
         physics: { enabled: true, solver: 'forceAtlas2Based', forceAtlas2Based: { gravitationalConstant: -50, centralGravity: 0.015, springLength: 150, springConstant: 0.05, damping: 0.4 }, stabilization: { iterations: 200, fit: true } },
         interaction: { dragNodes: true, dragView: true, hover: true, zoomView: true, tooltipDelay: 200 },
         layout: { hierarchical: false }
    };

    if (network) { network.destroy(); }
    network = new vis.Network(networkContainer, data, options);

    network.on('click', handleNetworkClick); // Add click listener

    showScreen('mapScreen');
}

// --- Handle clicks on the network ---
function handleNetworkClick(params) {
    const clickedNodeIds = params.nodes;

    // Always reset visual styles first
    resetNodeAndEdgeStyles();

    if (clickedNodeIds.length > 0) {
        const nodeId = clickedNodeIds[0];
        if (nodeId !== 0) { // Clicked on a concept node
            const selectedNodeData = concepts.find(c => c.id === nodeId);
            if (selectedNodeData) {
                // Ask for confirmation
                const confirmExplore = confirm(`Explore concepts related to "${selectedNodeData.name}"?`);
                if (confirmExplore) {
                    revealRelatedNodes(nodeId);
                    highlightClickedAndRelated(nodeId); // Highlight after revealing
                } else {
                     highlightSingleNode(nodeId); // Just highlight the clicked node if not exploring
                }
            }
        }
        // Clicking "Me" or background implicitly resets via resetNodeAndEdgeStyles
    }
}

// --- NEW FUNCTION: Reveal related nodes ---
function revealRelatedNodes(sourceNodeId) {
    const sourceNodeData = concepts.find(c => c.id === sourceNodeId);
    if (!sourceNodeData || !sourceNodeData.relatedIds) return;

    const nodesToAdd = [];
    const edgesToAdd = [];
    const maxNodesToAddPerClick = 5; // Limit how many new nodes appear at once
    let addedCount = 0;

    const typeColors = { /* ... same colors as before ... */
        "Orientation": "#87CEEB", "Relationship Style": "#98FB98", "Identity/Role": "#FFD700",
        "Practice": "#FFA07A", "Kink": "#FF6347", "Fetish": "#FFB6C1", "Framework": "#DDA0DD",
        "Goal/Concept": "#B0E0E6", "Approach": "#F0E68C", "Default": "#D3D3D3"
    };

    sourceNodeData.relatedIds.forEach(relatedId => {
        if (addedCount >= maxNodesToAddPerClick) return;

        // Check if node ALREADY exists in the dataset
        if (!allNodesDataSet.get(relatedId)) {
            const relatedConceptData = concepts.find(c => c.id === relatedId);
            // Also check full list for distance score (optional relevance filter)
            const matchedData = fullMatchedConceptsList.find(c => c.id === relatedId);
            const distance = matchedData ? matchedData.distance : 999; // Get pre-calculated distance

            // Optional: Add a threshold to only reveal somewhat relevant related concepts
            const relevanceThreshold = 25; // Example threshold, adjust as needed
            if (relatedConceptData && distance < relevanceThreshold) {
                 const nodeColor = typeColors[relatedConceptData.type] || typeColors["Default"];
                 nodesToAdd.push({
                     id: relatedConceptData.id,
                     label: relatedConceptData.name,
                     title: `${relatedConceptData.name} (${relatedConceptData.type})\nMatch Score: ${distance.toFixed(2)}`,
                     size: 15, // Start smaller?
                     color: nodeColor,
                     originalColor: nodeColor,
                     font: { size: 12 }
                 });
                 // Add edge connecting to the node that was clicked (sourceNodeId)
                 edgesToAdd.push({
                     from: sourceNodeId,
                     to: relatedConceptData.id,
                     length: 100 + distance * 5, // Shorter edge for closer related items
                     color: '#a9a9a9', // Different color for exploration edges?
                     dashes: false
                 });
                 addedCount++;
            }
        } else {
             // Node exists, maybe add edge if one doesn't exist?
             const existingEdge = allEdgesDataSet.get({
                 filter: edge => (edge.from === sourceNodeId && edge.to === relatedId) || (edge.from === relatedId && edge.to === sourceNodeId)
             });
             if (existingEdge.length === 0 && sourceNodeId !== 0 && relatedId !== 0) { // Avoid adding edges back to "You" node explicitly here
                  const matchedData = fullMatchedConceptsList.find(c => c.id === relatedId);
                  const distance = matchedData ? matchedData.distance : 999;
                   edgesToAdd.push({
                         from: sourceNodeId,
                         to: relatedId,
                         length: 100 + distance * 5,
                         color: '#a9a9a9',
                         dashes: false
                     });
             }
        }
    });

    if (nodesToAdd.length > 0) {
        allNodesDataSet.add(nodesToAdd);
    }
    if (edgesToAdd.length > 0) {
        allEdgesDataSet.add(edgesToAdd);
    }
     // Optional: Briefly stabilize physics after adding nodes/edges
     if ((nodesToAdd.length > 0 || edgesToAdd.length > 0) && network) {
        network.stabilize(100); // Stabilize for 100 iterations
    }
}


// --- NEW FUNCTION: Highlight just the clicked node and its direct new edges ---
function highlightSingleNode(selectedNodeId) {
     if (!allNodesDataSet) return;
     const updates = [];
     allNodesDataSet.forEach(node => {
         let nodeUpdate = { id: node.id };
         if(node.id === selectedNodeId){
            nodeUpdate.borderWidth = 4;
            nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 3, y: 3 };
            nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) };
         } else {
             // Ensure others are reset if previously highlighted
              let resetColor = node.originalColor;
              if(node.id === 0) resetColor = { background:'#ff69b4', border:'#ff1493' };
               nodeUpdate.color = (typeof resetColor === 'string' || !resetColor) ? resetColor : { background: resetColor, border: darkenColor(resetColor) };
               nodeUpdate.borderWidth = 2;
               nodeUpdate.shadow = false;
               nodeUpdate.font = { color: '#343434', size: (node.id === 0 ? 16 : 12) };
         }
         updates.push(nodeUpdate);
     });
     allNodesDataSet.update(updates);
}

// --- NEW FUNCTION: Highlight clicked, related, and dim others ---
function highlightClickedAndRelated(selectedNodeId) {
    if (!allNodesDataSet) return;

    const updates = [];
    const selectedNodeData = concepts.find(c => c.id === selectedNodeId);
    const relatedIds = selectedNodeData?.relatedIds || [];
    const highlightColor = '#8A2BE2'; // Violet for related borders

    // Make sure related nodes actually exist in the current dataset
    const currentRelatedIds = relatedIds.filter(id => allNodesDataSet.get(id));

    allNodesDataSet.forEach(node => {
        let nodeUpdate = { id: node.id }; // Start with just ID

        if (node.id === 0) { // "Me" node
            nodeUpdate.color = { background:'#ff69b4', border:'#ff1493' };
            nodeUpdate.shadow = false;
            nodeUpdate.borderWidth = 2;
            nodeUpdate.font = { color: '#343434', size: 16 }; // Reset font
        } else if (node.id === selectedNodeId) {
            // Strongly highlight the selected node
            nodeUpdate.borderWidth = 4;
            nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 3, y: 3 };
            nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) };
            nodeUpdate.font = { color: '#343434', size: 12 }; // Reset font
        } else if (currentRelatedIds.includes(node.id)) {
            // Highlight related nodes currently on graph
            nodeUpdate.borderWidth = 3;
            nodeUpdate.shadow = false;
            nodeUpdate.color = { background: node.originalColor, border: highlightColor };
            nodeUpdate.font = { color: '#343434', size: 12 }; // Reset font
        } else {
            // Dim non-related nodes (using opacity via RGBA)
            const rgb = hexToRgb(node.originalColor || '#D3D3D3'); // Use default if originalColor missing
            nodeUpdate.color = { background: `rgba(${rgb}, 0.2)`, border: `rgba(${hexToRgb(darkenColor(node.originalColor || '#D3D3D3'))}, 0.1)` };
            nodeUpdate.borderWidth = 1;
            nodeUpdate.shadow = false;
            // Dim label color too
            nodeUpdate.font = { color: 'rgba(52, 52, 52, 0.3)' };
        }
        updates.push(nodeUpdate);
    });

    allNodesDataSet.update(updates); // Update node visuals
}


// --- Reset node and edge visual styles ---
function resetNodeAndEdgeStyles() {
    if (!allNodesDataSet) return;
    const nodeUpdates = [];
    allNodesDataSet.forEach(node => {
        let resetColor = node.originalColor;
        if (node.id === 0) {
             resetColor = { background:'#ff69b4', border:'#ff1493' };
        }
        nodeUpdates.push({
            id: node.id,
            color: (typeof resetColor === 'string' || !resetColor) ? resetColor : { background: resetColor, border: darkenColor(resetColor) },
            borderWidth: 2,
            shadow: false,
            font: { color: '#343434', size: (node.id === 0 ? 16 : 12) }
        });
    });
    allNodesDataSet.update(nodeUpdates);

    // Reset dynamic edges (can be improved to reset color/width instead of removing)
    if (allEdgesDataSet) {
        const dynamicEdges = allEdgesDataSet.get({ filter: edge => edge.dynamic === true });
        if (dynamicEdges.length > 0) {
            allEdgesDataSet.remove(dynamicEdges.map(e => e.id));
        }
        // Could also update original edges from "You" node back to default style if needed
        const initialEdges = allEdgesDataSet.get({ filter: edge => edge.from === 0 });
        allEdgesDataSet.update(initialEdges.map(e => ({ id: e.id, color: '#e0e0e0', width: 1, dashes: true })));

    }
}


// --- Utility functions for color manipulation ---
function hexToRgb(hex) { /* ... same as before ... */
    if (!hex || typeof hex !== 'string') return '128,128,128';
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const bigint = parseInt(hex, 16);
    if (isNaN(bigint)) return '128,128,128';
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
 }
function darkenColor(hex, amount = 30) { /* ... same as before ... */
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
     userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
     userAnswers = {};
     if (network) {
         network.destroy();
         network = null;
     }
     allNodesDataSet = null;
     allEdgesDataSet = null; // Clear edges dataset too
     fullMatchedConceptsList = []; // Clear sorted list
     showScreen('welcomeScreen');
}


// --- Event Listeners ---
startButton.addEventListener('click', () => {
    displayQuestion(currentQuestionIndex);
    showScreen('questionnaireScreen');
});

nextQButton.addEventListener('click', () => {
    processAnswer(currentQuestionIndex);
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
});

showMapButton.addEventListener('click', calculateAndShowMap);

restartButton.addEventListener('click', resetApp);


// --- Initial Setup ---
showScreen('welcomeScreen');
