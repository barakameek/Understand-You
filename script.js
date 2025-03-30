// --- Global State ---
let currentQuestionIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
let network = null;
let allNodesDataSet = null; // Holds nodes currently on graph
let allEdgesDataSet = null; // Holds edges currently on graph
let fullMatchedConceptsList = []; // Holds ALL concepts sorted by distance
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"]; // For easy access

// --- DOM Elements ---
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startButton');
const questionnaireScreen = document.getElementById('questionnaireScreen');
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const nextQButton = document.getElementById('nextQButton');
const profileAndMapScreen = document.getElementById('profileAndMapScreen'); // Combined screen
const profileScoresDiv = document.getElementById('profileScores');
const showMapButton = document.getElementById('showMapButton'); // Now triggers combined screen display
const networkContainer = document.getElementById('network');
const restartButton = document.getElementById('restartButton'); // Now on combined screen
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const closePopupButton = document.getElementById('closePopupButton');

// --- Functions ---

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden');
        screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current');
    });
     if (screenId === 'profileAndMapScreen' && network) {
         setTimeout(() => { network.redraw(); network.fit(); }, 100); // Fit network when shown
    }
}

// displayQuestion, enforceMaxChoices, processAnswer (Mostly same as previous version)
function displayQuestion(index) { /* ... Same as previous full code ... */
    if (index >= questionnaire.length) {
        calculateAndShowProfileAndMap(); // Go directly to combined screen
        return;
    }
    const q = questionnaire[index];
    progressText.textContent = `Question ${index + 1} / ${questionnaire.length}`;
    let inputHTML = `<h3 class="question-title">${q.text}</h3><div class="input-container">`;
    // ... (rest of input generation logic) ...
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
    // Add listeners
    if (q.type === "slider") {
        const sliderInput = document.getElementById(`q${q.questionId}`);
        const displaySpan = document.getElementById(`sliderValueDisplay_q${q.questionId}`);
        sliderInput.addEventListener('input', () => { displaySpan.textContent = sliderInput.value; });
    }
    if (q.type === "checkbox") {
        const checkboxes = questionContent.querySelectorAll(`input[name="q${q.questionId}"]`);
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (event) => enforceMaxChoices(cb.name, parseInt(cb.dataset.maxChoices || 2), event));
        });
    }
}
function enforceMaxChoices(name, max, event) { /* ... Same as previous full code ... */
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        if (event && event.target) event.target.checked = false;
    }
 }
function processAnswer(index) { /* ... Same as previous full code ... */
     if (index >= questionnaire.length) return;
    const q = questionnaire[index];
    const elementToUpdate = q.element;
    let pointsToAdd = 0;
    let answerValue = null;
    let previousPointsContribution = 0;
    const prevAnswer = userAnswers[q.questionId];
    if (q.type === "slider" && prevAnswer !== undefined) { previousPointsContribution = (prevAnswer - q.defaultValue); }
    else if (q.type === "radio" && prevAnswer) { const prevOption = q.options.find(opt => opt.value === prevAnswer); previousPointsContribution = prevOption ? prevOption.points : 0; }
    else if (q.type === "checkbox" && prevAnswer) { prevAnswer.forEach(prevVal => { const prevOption = q.options.find(opt => opt.value === prevVal); previousPointsContribution += prevOption ? prevOption.points : 0; }); }
    let currentPointsContribution = 0;
     if (q.type === "slider") { const sliderInput = document.getElementById(`q${q.questionId}`); answerValue = parseInt(sliderInput.value); currentPointsContribution = (answerValue - q.defaultValue); userAnswers[q.questionId] = answerValue; }
     else if (q.type === "radio") { const selectedRadio = document.querySelector(`input[name="q${q.questionId}"]:checked`); if (selectedRadio) { answerValue = selectedRadio.value; const selectedOption = q.options.find(opt => opt.value === answerValue); currentPointsContribution = selectedOption ? selectedOption.points : 0; userAnswers[q.questionId] = answerValue; } else { userAnswers[q.questionId] = null; currentPointsContribution = 0; } }
     else if (q.type === "checkbox") { const selectedCheckboxes = document.querySelectorAll(`input[name="q${q.questionId}"]:checked`); answerValue = []; selectedCheckboxes.forEach(cb => { const optionValue = cb.value; answerValue.push(optionValue); const selectedOption = q.options.find(opt => opt.value === optionValue); currentPointsContribution += selectedOption ? selectedOption.points : 0; }); userAnswers[q.questionId] = answerValue; }
    pointsToAdd = currentPointsContribution - previousPointsContribution;
    if (elementToUpdate && pointsToAdd !== 0) { userScores[elementToUpdate] = Math.max(0, Math.min(10, userScores[elementToUpdate] + pointsToAdd)); console.log(`Updated ${elementToUpdate}: ${userScores[elementToUpdate].toFixed(1)} (changed by ${pointsToAdd.toFixed(1)})`); }
    else if (!elementToUpdate) { userAnswers[q.questionId] = answerValue; }
}

function euclideanDistance(profile1, profile2) { /* ... Same as previous full code ... */
    let sum = 0;
    const elements = elementNames; // Use global list
    for (let i = 0; i < elements.length; i++) {
        const key = elements[i];
        const score1 = profile1[key];
        const score2 = profile2[i];
        sum += Math.pow(score1 - score2, 2);
    }
    return Math.sqrt(sum);
}

// --- Calculate Profile, Calculate Map, Display Both ---
function calculateAndShowProfileAndMap() {
    console.log("Final Scores:", userScores);
    displayProfileScores(); // Update profile display side
    createInitialMap(); // Create the initial network map
    showScreen('profileAndMapScreen'); // Show the combined screen
}

// --- Display Profile Scores and Make Elements Clickable ---
function displayProfileScores() {
    profileScoresDiv.innerHTML = ''; // Clear previous
    elementNames.forEach(element => {
        const score = userScores[element];
        const scoreElement = document.createElement('div');
        // Make the strong tag clickable, passing the element name
        scoreElement.innerHTML = `<strong data-element="${element}">${element}:</strong> <span>${score.toFixed(1)}</span>`;
        profileScoresDiv.appendChild(scoreElement);

        // Add click listener to the strong tag
        scoreElement.querySelector('strong').addEventListener('click', () => {
            handleElementClick(element);
        });
    });
}

// --- Create the Initial Network Map ---
function createInitialMap() {
    console.log("Creating initial map...");

    // Calculate distances and sort
    fullMatchedConceptsList = concepts.map(concept => {
        if (!concept.profile || concept.profile.length !== 6) return { ...concept, distance: Infinity };
        const distance = euclideanDistance(userScores, concept.profile);
        return { ...concept, distance: distance };
    }).filter(c => c.distance !== Infinity);
    fullMatchedConceptsList.sort((a, b) => a.distance - b.distance);

    const initialNodesArray = [];
    const initialEdgesArray = [];
    const initialTopN = 12; // Show a few more initially

    const typeColors = { /* ... same colors as before ... */
        "Orientation": "#87CEEB", "Relationship Style": "#98FB98", "Identity/Role": "#FFD700",
        "Practice": "#FFA07A", "Kink": "#FF6347", "Fetish": "#FFB6C1", "Framework": "#DDA0DD",
        "Goal/Concept": "#B0E0E6", "Approach": "#F0E68C", "Default": "#D3D3D3"
    };

    // Add "Me" node
    initialNodesArray.push({
        id: 0, label: "You", color: { background:'#ff69b4', border:'#ff1493' },
        size: 30, shape: 'star', font: { size: 16 }, fixed: false // Allow physics now
    });

    // Add initial Top N concept nodes
    fullMatchedConceptsList.slice(0, initialTopN).forEach(concept => {
        const nodeColor = typeColors[concept.type] || typeColors["Default"];
        const score = concept.profile[elementNames.indexOf("Sensory")]; // Example: get sensory score

        initialNodesArray.push({
            id: concept.id, label: concept.name,
            title: `${concept.name} (${concept.type})\nMatch Score: ${concept.distance.toFixed(2)}`,
            size: 15 + Math.max(0, 10 - concept.distance), // Size based on closeness
            color: nodeColor,
            originalColor: nodeColor, // Store for reset
            font: { size: 12 },
            // Store element scores on the node data itself for easy access later
            elementScores: concept.profile
        });
        initialEdgesArray.push({ from: 0, to: concept.id, length: 100 + concept.distance * 10, dashes: true, color: '#e0e0e0' });
    });

    // Create datasets
    allNodesDataSet = new vis.DataSet(initialNodesArray);
    allEdgesDataSet = new vis.DataSet(initialEdgesArray);

    const data = { nodes: allNodesDataSet, edges: allEdgesDataSet };
    const options = { /* ... same physics/interaction options as before ... */
         nodes: { shape: "dot", borderWidth: 2, font: { color: '#343434', size: 14, face: 'arial'} },
         edges: { width: 1, color: { color: "#cccccc", highlight: "#8A2BE2", hover: "#b39ddb", inherit: false }, smooth: { enabled: true, type: 'dynamic' } },
         physics: { enabled: true, solver: 'forceAtlas2Based', forceAtlas2Based: { gravitationalConstant: -45, centralGravity: 0.01, springLength: 120, springConstant: 0.06, damping: 0.5 }, stabilization: { iterations: 250, fit: true } }, // Adjusted physics slightly
         interaction: { dragNodes: true, dragView: true, hover: true, zoomView: true, tooltipDelay: 200 },
         layout: { hierarchical: false }
    };

    if (network) { network.destroy(); }
    network = new vis.Network(networkContainer, data, options);

    network.on('click', handleNetworkNodeClick); // Listener for node clicks
    network.on('deselectNode', resetNodeAndEdgeStyles); // Reset on clicking background

}

// --- Handle clicks on the network NODE ---
function handleNetworkNodeClick(params) {
    resetNodeAndEdgeStyles(); // Reset visuals first

    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        if (nodeId !== 0) { // Clicked on a concept node
             highlightSingleNode(nodeId); // Highlight the node
             showConceptDetailPopup(nodeId); // Show its profile
        }
        // Clicking "Me" node implicitly resets
    }
     // Clicking background is handled by 'deselectNode' event
}

// --- Handle clicks on ELEMENT NAME in profile ---
function handleElementClick(elementName) {
     console.log("Element clicked:", elementName);
     resetNodeAndEdgeStyles(); // Reset previous highlights

     if (!allNodesDataSet) return;

     const updates = [];
     const elementIndex = elementNames.indexOf(elementName);
     const threshold = 6.5; // Highlight nodes with score above this threshold for the element

     allNodesDataSet.forEach(node => {
         let nodeUpdate = { id: node.id };
         if (node.id !== 0) { // Don't dim "Me" node
             // Check if the node has elementScores and if the specific element score meets threshold
             const nodeElementScore = node.elementScores ? node.elementScores[elementIndex] : -1;

             if (nodeElementScore >= threshold) {
                 // Highlight nodes strong in this element
                 nodeUpdate.borderWidth = 3;
                 nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 };
                 nodeUpdate.color = { background: node.originalColor, border: '#FF8C00' }; // Orange border for element highlight
                 nodeUpdate.font = { color: '#343434' }; // Normal font
             } else {
                 // Dim nodes weak in this element
                 const rgb = hexToRgb(node.originalColor || '#D3D3D3');
                 nodeUpdate.color = { background: `rgba(${rgb}, 0.15)`, border: `rgba(${hexToRgb(darkenColor(node.originalColor || '#D3D3D3'))}, 0.1)` };
                 nodeUpdate.borderWidth = 1;
                 nodeUpdate.shadow = false;
                 nodeUpdate.font = { color: 'rgba(52, 52, 52, 0.2)' }; // Dim font
             }
             updates.push(nodeUpdate);
         } else {
             // Ensure "Me" node is reset correctly
             nodeUpdate.color = { background:'#ff69b4', border:'#ff1493' };
             nodeUpdate.shadow = false;
             nodeUpdate.borderWidth = 2;
             nodeUpdate.font = { color: '#343434', size: 16 };
             updates.push(nodeUpdate);
         }
     });

     allNodesDataSet.update(updates); // Apply visual updates
}

// --- Show Concept Detail Pop-up ---
function showConceptDetailPopup(nodeId) {
    const conceptData = concepts.find(c => c.id === nodeId);
    if (!conceptData || !conceptData.profile) return;

    popupConceptName.textContent = conceptData.name;
    popupConceptType.textContent = conceptData.type;
    popupConceptProfile.innerHTML = ''; // Clear previous profile

    elementNames.forEach((element, index) => {
        const score = conceptData.profile[index];
        popupConceptProfile.innerHTML += `<div><strong>${element}:</strong> ${score.toFixed(1)}</div>`;
    });

    conceptDetailPopup.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');
}

// --- Hide Concept Detail Pop-up ---
function hideConceptDetailPopup() {
    conceptDetailPopup.classList.add('hidden');
    popupOverlay.classList.add('hidden');
}


// --- Highlight just a single clicked node ---
function highlightSingleNode(selectedNodeId) {
     if (!allNodesDataSet) return;
     const updates = [];
     allNodesDataSet.forEach(node => {
         let nodeUpdate = { id: node.id };
         if(node.id === selectedNodeId){
            nodeUpdate.borderWidth = 4;
            nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 3, y: 3 };
            nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) };
             nodeUpdate.font = { color: '#343434' }; // Ensure font is reset
         } else {
             // Only reset if it was potentially highlighted/dimmed before
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

    // Reset edges - Make initial edges visible again
    if (allEdgesDataSet) {
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
     allEdgesDataSet = null;
     fullMatchedConceptsList = [];
     hideConceptDetailPopup(); // Hide popup if open
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
    displayQuestion(currentQuestionIndex); // Will show profile/map screen if done
});

// This button is technically removed/replaced by finishing the questionnaire
// showMapButton.addEventListener('click', createInitialMap);

restartButton.addEventListener('click', resetApp);

// Listener for closing the popup
closePopupButton.addEventListener('click', hideConceptDetailPopup);
popupOverlay.addEventListener('click', hideConceptDetailPopup); // Close on overlay click too


// --- Initial Setup ---
showScreen('welcomeScreen');
