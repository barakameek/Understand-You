// --- Global State (No Change) ---
let currentQuestionIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};

// --- DOM Elements (Add network container) ---
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
// const mapResultsList = document.getElementById('mapResultsList'); // Remove list ref
const networkContainer = document.getElementById('network'); // *** ADD Network Container Ref ***
const restartButton = document.getElementById('restartButton');

// --- Functions (showScreen, displayQuestion, enforceMaxChoices, processAnswer, calculateAndShowProfile are mostly unchanged) ---

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
    // ... (Keep existing displayQuestion logic from previous version) ...
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
        sliderInput.addEventListener('input', () => {
            displaySpan.textContent = sliderInput.value;
        });
    }
    if (q.type === "checkbox") {
        const checkboxes = questionContent.querySelectorAll(`input[name="q${q.questionId}"]`);
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => enforceMaxChoices(cb.name, parseInt(cb.dataset.maxChoices)));
        });
    }
}

function enforceMaxChoices(name, max) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        checkboxes[checkboxes.length - 1].checked = false;
    }
}

function processAnswer(index) {
    // ... (Keep existing processAnswer logic from previous version) ...
    const q = questionnaire[index];
    const elementToUpdate = q.element;
    let pointsToAdd = 0;
    let answerValue = null;

    if (q.type === "slider") {
        const sliderInput = document.getElementById(`q${q.questionId}`);
        answerValue = parseInt(sliderInput.value);
        userAnswers[q.questionId] = answerValue;
        pointsToAdd = (answerValue - q.defaultValue);
    } else if (q.type === "radio") {
        const selectedRadio = document.querySelector(`input[name="q${q.questionId}"]:checked`);
        if (selectedRadio) {
            answerValue = selectedRadio.value;
            userAnswers[q.questionId] = answerValue;
            const selectedOption = q.options.find(opt => opt.value === answerValue);
            pointsToAdd = selectedOption ? selectedOption.points : 0;
        } else {
            pointsToAdd = 0;
        }
    } else if (q.type === "checkbox") {
         const selectedCheckboxes = document.querySelectorAll(`input[name="q${q.questionId}"]:checked`);
         answerValue = [];
         selectedCheckboxes.forEach(cb => {
             const optionValue = cb.value;
             answerValue.push(optionValue);
             const selectedOption = q.options.find(opt => opt.value === optionValue);
             pointsToAdd += selectedOption ? selectedOption.points : 0;
         });
         userAnswers[q.questionId] = answerValue;
    }

    if (elementToUpdate) {
        userScores[elementToUpdate] = Math.max(0, Math.min(10, userScores[elementToUpdate] + pointsToAdd));
        console.log(`Updated ${elementToUpdate}: ${userScores[elementToUpdate]} (added ${pointsToAdd})`);
    }
}

function calculateAndShowProfile() {
    console.log("Final Scores:", userScores);
    profileScoresDiv.innerHTML = ''; // Clear previous scores
    for (const element in userScores) {
        // Use Math.round for display if needed, keep raw score for calculations
        profileScoresDiv.innerHTML += `<div><strong>${element}:</strong> ${userScores[element].toFixed(1)}</div>`;
    }
    showScreen('profileScreen');
}

function euclideanDistance(profile1, profile2) {
    // ... (Keep existing euclideanDistance logic from previous version) ...
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


// --- *** MODIFIED calculateAndShowMap function *** ---
function calculateAndShowMap() {
    console.log("Calculating matches for network graph based on scores:", userScores);

    // 1. Calculate distances (same as before)
    const matchedConcepts = concepts.map(concept => {
        if (!concept.profile || concept.profile.length !== 6) {
             return { ...concept, distance: Infinity };
        }
        const distance = euclideanDistance(userScores, concept.profile);
        return { ...concept, distance: distance };
    }).filter(c => c.distance !== Infinity); // Filter out invalid ones

    // 2. Sort by distance
    matchedConcepts.sort((a, b) => a.distance - b.distance);

    // 3. Prepare data for Vis.js
    const nodes = [];
    const edges = [];
    const topN = 15; // Number of concepts to show on graph
    const maxDistance = matchedConcepts[topN-1]?.distance || 20; // Use distance of Nth item as reference

    // Add "Me" node
    nodes.push({
        id: 0,
        label: "You",
        color: { background:'#ff69b4', border:'#ff1493' }, // Hot pink for distinction
        size: 30,
        shape: 'star', // Make the user node stand out
        font: { size: 16, color: '#333', face: 'Arial' }
    });

    // Define colors for concept types (customize as needed)
    const typeColors = {
        "Orientation": "#87CEEB", // SkyBlue
        "Relationship Style": "#98FB98", // PaleGreen
        "Identity/Role": "#FFD700", // Gold
        "Practice": "#FFA07A", // LightSalmon
        "Kink": "#FF6347", // Tomato (if used)
        "Fetish": "#FFB6C1", // LightPink
        "Framework": "#DDA0DD", // Plum
        "Goal/Concept": "#B0E0E6", // PowderBlue
        "Approach": "#F0E68C", // Khaki
        "Default": "#D3D3D3" // LightGray
    };

    // Add top N concept nodes and edges connecting to "Me"
    matchedConcepts.slice(0, topN).forEach(concept => {
        // Node size based on relevance (inverse of distance) - needs scaling
        const relevance = Math.max(0.1, 1 - (concept.distance / (maxDistance * 1.5))); // Normalize relevance (0 to ~1)
        const nodeSize = 15 + relevance * 15; // Base size + relevance bonus

        nodes.push({
            id: concept.id,
            label: concept.name,
            title: `${concept.name} (${concept.type})\nDistance: ${concept.distance.toFixed(2)}`, // Tooltip
            size: nodeSize,
            color: typeColors[concept.type] || typeColors["Default"],
            font: { size: 12 }
        });

        // Edge length based on distance - shorter means closer
        const edgeLength = 100 + concept.distance * 15; // Base length + distance penalty

        edges.push({
            from: 0, // From "Me" node
            to: concept.id,
            length: edgeLength, // Let physics use this
            // value: relevance, // Optionally influence edge width/physics
            // color: { inherit:'from' } // Edge color matches source node
        });
    });

    // 4. Create Vis.js Network
    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges),
    };
    const options = {
        nodes: {
            shape: "dot", // Default shape
             borderWidth: 2,
             font: {
                 color: '#343434',
                 size: 14, // Default font size
                 face: 'arial'
            }
        },
        edges: {
            width: 1,
            color: {
                color: "#cccccc",
                highlight: "#8A2BE2",
                hover: "#b39ddb",
                inherit: false // Don't inherit color from nodes by default
            },
            smooth: {
                 enabled: true,
                 type: 'dynamic' // Adjusts dynamically
            }
        },
        physics: {
            enabled: true,
            solver: 'forceAtlas2Based', // Or 'barnesHut' etc.
            forceAtlas2Based: {
                gravitationalConstant: -50,
                centralGravity: 0.01,
                springLength: 100, // Default spring length
                springConstant: 0.08,
                damping: 0.4
            },
            stabilization: { // Stabilize faster
                 iterations: 150
            }
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            hover: true,
            zoomView: true,
            tooltipDelay: 200
        },
        layout: {
             hierarchical: false // Ensure physics layout is used
        }
    };

    // Clear previous network if any, before creating a new one
    if (networkContainer.visNetwork) {
         networkContainer.visNetwork.destroy();
     }
    networkContainer.visNetwork = new vis.Network(networkContainer, data, options); // Store network instance if needed later

    // Make sure the correct screen is visible
    showScreen('mapScreen');
}


function resetApp() {
     currentQuestionIndex = 0;
     userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
     userAnswers = {};
     // Destroy network if it exists
     if (networkContainer.visNetwork) {
         networkContainer.visNetwork.destroy();
         networkContainer.visNetwork = null;
     }
     showScreen('welcomeScreen');
}


// --- Event Listeners (No Change) ---
startButton.addEventListener('click', () => {
    displayQuestion(currentQuestionIndex);
    showScreen('questionnaireScreen');
});

nextQButton.addEventListener('click', () => {
    // Save answer before moving
    processAnswer(currentQuestionIndex); // Make sure current answer is processed
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex); // Will show profile if done
});

showMapButton.addEventListener('click', calculateAndShowMap);

restartButton.addEventListener('click', resetApp);


// --- Initial Setup (No Change) ---
showScreen('welcomeScreen');
