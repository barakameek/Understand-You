// --- Global State ---
let currentQuestionIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {}; // Stores answers to main questionnaire
let network = null;
let allNodesDataSet = null;
let allEdgesDataSet = null;
let fullMatchedConceptsList = [];
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
let isWhatIfMode = false;
let tempScores = { ...userScores }; // For What If mode
let currentRefinementElement = null; // Track which element is being refined
let currentlyDisplayedConceptId = null; // Track concept in popup

// --- DOM Elements ---
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startButton');
const questionnaireScreen = document.getElementById('questionnaireScreen');
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const nextQButton = document.getElementById('nextQButton');
const profileAndMapScreen = document.getElementById('profileAndMapScreen');
const profileScoresDiv = document.getElementById('profileScores');
// const showMapButton = document.getElementById('showMapButton'); // Removed, integrated
const networkContainer = document.getElementById('network');
const restartButton = document.getElementById('restartButton');
// Popups & Overlay
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const closePopupButton = document.getElementById('closePopupButton');
const findSimilarButton = document.getElementById('findSimilarButton');
// Refinement Modal
const refinementModal = document.getElementById('refinementModal');
const closeRefinementButton = document.getElementById('closeRefinementButton');
const refinementTitle = document.getElementById('refinementTitle');
const refinementQuestionContent = document.getElementById('refinementQuestionContent');
const submitRefinementButton = document.getElementById('submitRefinementButton');
// What If Controls
const toggleWhatIfButton = document.getElementById('toggleWhatIfButton');
const whatIfSlidersDiv = document.getElementById('whatIfSliders');
const resetWhatIfButton = document.getElementById('resetWhatIfButton');


// --- Functions ---

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden');
        screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current');
    });
    if (screenId === 'profileAndMapScreen' && network) {
        setTimeout(() => { if (network) { network.redraw(); network.fit();} }, 100);
    }
}

// displayQuestion, enforceMaxChoices, processAnswer (Same as previous version)
function displayQuestion(index) { /* ... From previous full code ... */
    if (index >= questionnaire.length) {
        calculateAndShowProfileAndMap(); return; // Go directly to combined screen
    }
    const q = questionnaire[index]; progressText.textContent = `Question ${index + 1} / ${questionnaire.length}`;
    let inputHTML = `<h3 class="question-title">${q.text}</h3><div class="input-container">`;
    if (q.type === "slider") { const currentValue = userAnswers[q.questionId] !== undefined ? userAnswers[q.questionId] : q.defaultValue; inputHTML += `<div class="slider-container"><input type="range" id="q${q.questionId}" class="slider" min="${q.minValue}" max="${q.maxValue}" step="1" value="${currentValue}"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected Value: <span id="sliderValueDisplay_q${q.questionId}">${currentValue}</span></p></div>`; }
    else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const isChecked = userAnswers[q.questionId] === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="q${q.questionId}_${opt.value}" name="q${q.questionId}" value="${opt.value}" ${isChecked}><label for="q${q.questionId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
    else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const isChecked = userAnswers[q.questionId]?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="q${q.questionId}_${opt.value}" name="q${q.questionId}" value="${opt.value}" ${isChecked} data-max-choices="${q.maxChoices || 2}"><label for="q${q.questionId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
    inputHTML += `</div>`; questionContent.innerHTML = inputHTML;
    if (q.type === "slider") { const sliderInput = document.getElementById(`q${q.questionId}`); const displaySpan = document.getElementById(`sliderValueDisplay_q${q.questionId}`); sliderInput.addEventListener('input', () => { displaySpan.textContent = sliderInput.value; }); }
    if (q.type === "checkbox") { const checkboxes = questionContent.querySelectorAll(`input[name="q${q.questionId}"]`); checkboxes.forEach(cb => { cb.addEventListener('change', (event) => enforceMaxChoices(cb.name, parseInt(cb.dataset.maxChoices || 2), event)); }); }
 }
function enforceMaxChoices(name, max, event) { /* ... From previous full code ... */
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        if (event && event.target) event.target.checked = false;
    }
}
function processAnswer(index) { /* ... From previous full code, including refined score updates ... */
    if (index >= questionnaire.length) return;
    const q = questionnaire[index]; const elementToUpdate = q.element; let pointsToAdd = 0; let answerValue = null; let previousPointsContribution = 0; const prevAnswer = userAnswers[q.questionId];
    if (q.type === "slider" && prevAnswer !== undefined) { previousPointsContribution = (prevAnswer - q.defaultValue); } else if (q.type === "radio" && prevAnswer) { const prevOption = q.options.find(opt => opt.value === prevAnswer); previousPointsContribution = prevOption ? prevOption.points : 0; } else if (q.type === "checkbox" && prevAnswer) { prevAnswer.forEach(prevVal => { const prevOption = q.options.find(opt => opt.value === prevVal); previousPointsContribution += prevOption ? prevOption.points : 0; }); }
    let currentPointsContribution = 0;
     if (q.type === "slider") { const sliderInput = document.getElementById(`q${q.questionId}`); answerValue = parseInt(sliderInput.value); currentPointsContribution = (answerValue - q.defaultValue); userAnswers[q.questionId] = answerValue; }
     else if (q.type === "radio") { const selectedRadio = document.querySelector(`input[name="q${q.questionId}"]:checked`); if (selectedRadio) { answerValue = selectedRadio.value; const selectedOption = q.options.find(opt => opt.value === answerValue); currentPointsContribution = selectedOption ? selectedOption.points : 0; userAnswers[q.questionId] = answerValue; } else { userAnswers[q.questionId] = null; currentPointsContribution = 0; } }
     else if (q.type === "checkbox") { const selectedCheckboxes = document.querySelectorAll(`input[name="q${q.questionId}"]:checked`); answerValue = []; selectedCheckboxes.forEach(cb => { const optionValue = cb.value; answerValue.push(optionValue); const selectedOption = q.options.find(opt => opt.value === optionValue); currentPointsContribution += selectedOption ? selectedOption.points : 0; }); userAnswers[q.questionId] = answerValue; }
    pointsToAdd = currentPointsContribution - previousPointsContribution;
    if (elementToUpdate && pointsToAdd !== 0) { userScores[elementToUpdate] = Math.max(0, Math.min(10, userScores[elementToUpdate] + pointsToAdd)); console.log(`Updated ${elementToUpdate}: ${userScores[elementToUpdate].toFixed(1)} (changed by ${pointsToAdd.toFixed(1)})`); }
    else if (!elementToUpdate) { userAnswers[q.questionId] = answerValue; }
}

function euclideanDistance(profile1, profile2) { /* ... Same as previous full code ... */
    let sum = 0; const elements = elementNames;
    for (let i = 0; i < elements.length; i++) { const key = elements[i]; const score1 = profile1[key] ?? profile1[i] ?? 5; const score2 = profile2[key] ?? profile2[i] ?? 5; sum += Math.pow(score1 - score2, 2); } // Handle array or object input
    return Math.sqrt(sum);
}

// --- Calculate Profile, Calculate Map, Display Both ---
function calculateAndShowProfileAndMap() {
    console.log("Final Scores:", userScores);
    tempScores = { ...userScores }; // Initialize temp scores for What If
    displayProfileScores();
    setupWhatIfSliders();
    createOrUpdateMap(); // Use a function that can update map
    showScreen('profileAndMapScreen');
}

// --- Display Profile Scores & Add Refine Buttons ---
function displayProfileScores(scoresToShow = userScores) {
    profileScoresDiv.innerHTML = '';
    elementNames.forEach(element => {
        const score = scoresToShow[element];
        const scoreElement = document.createElement('div');
        // Add refine button if not in What If mode
        const refineButtonHTML = !isWhatIfMode ? `<button class="refine-button" data-element="${element}">Refine</button>` : '';
        scoreElement.innerHTML = `
            <strong data-element="${element}">${element}:</strong>
            <span>${score.toFixed(1)}</span>
            ${refineButtonHTML}
        `;
        profileScoresDiv.appendChild(scoreElement);

        // Add click listener to element name (strong tag)
        scoreElement.querySelector('strong').addEventListener('click', () => {
            if (!isWhatIfMode) handleElementClick(element);
        });
        // Add click listener to refine button
        if (!isWhatIfMode) {
            scoreElement.querySelector('.refine-button')?.addEventListener('click', (e) => {
                 e.stopPropagation(); // Prevent element name click
                 showRefinementModal(element);
            });
        }
    });
}

// --- Setup "What If?" Sliders ---
function setupWhatIfSliders() {
    whatIfSlidersDiv.innerHTML = '<p>Adjust sliders to simulate changes:</p>'; // Clear existing
    elementNames.forEach(element => {
        const score = tempScores[element]; // Use temp scores
        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('slider-container');
        sliderContainer.innerHTML = `
            <label for="whatif_${element}" class="label-text">${element}</label>
            <input type="range" id="whatif_${element}" class="slider" min="0" max="10" step="0.5" value="${score}">
            <p class="value-text">Value: <span id="whatifValue_${element}">${score.toFixed(1)}</span></p>
        `;
        whatIfSlidersDiv.appendChild(sliderContainer);

        // Add listener to update temp score and map on CHANGE (release)
        const sliderInput = sliderContainer.querySelector(`#whatif_${element}`);
        sliderInput.addEventListener('input', () => { // Update display live
             document.getElementById(`whatifValue_${element}`).textContent = parseFloat(sliderInput.value).toFixed(1);
        });
         sliderInput.addEventListener('change', () => { // Update map on release
            tempScores[element] = parseFloat(sliderInput.value);
             console.log("What If Update:", tempScores);
             createOrUpdateMap(tempScores); // Update map with temp scores
        });
    });
}

// --- Toggle "What If?" Mode ---
function toggleWhatIfMode() {
    isWhatIfMode = !isWhatIfMode;
    if (isWhatIfMode) {
        tempScores = { ...userScores }; // Reset temp scores to actual
        setupWhatIfSliders(); // Ensure sliders reflect current actual scores
        whatIfSlidersDiv.classList.remove('hidden');
        toggleWhatIfButton.textContent = "Disable 'What If?' Mode";
        toggleWhatIfButton.style.backgroundColor = '#5a6268';
        resetNodeAndEdgeStyles(); // Reset any element highlighting
        createOrUpdateMap(tempScores); // Show map based on initial temp scores
        // Disable element name clicking
        profileScoresDiv.querySelectorAll('strong').forEach(el => el.style.cursor = 'default');
        profileScoresDiv.querySelectorAll('.refine-button').forEach(btn => btn.classList.add('hidden'));
    } else {
        whatIfSlidersDiv.classList.add('hidden');
        toggleWhatIfButton.textContent = "Enable 'What If?' Mode";
        toggleWhatIfButton.style.backgroundColor = '#6c757d';
        createOrUpdateMap(userScores); // Revert map to actual scores
        // Re-enable element name clicking
        displayProfileScores(); // Redraw to show refine buttons and add listeners
    }
}

// --- Reset "What If?" Sliders to Actual Profile ---
function resetWhatIfSliders() {
    if (!isWhatIfMode) return;
    tempScores = { ...userScores };
    setupWhatIfSliders(); // Redraw sliders with correct values
    createOrUpdateMap(tempScores); // Update map
}


// --- Create or Update the Network Map ---
// Takes optional scores argument for "What If?" mode
function createOrUpdateMap(scoresToUse = userScores) {
    console.log("Creating/Updating map with scores:", scoresToUse);

    // Calculate distances based on scoresToUse
    fullMatchedConceptsList = concepts.map(concept => {
        if (!concept.profile || concept.profile.length !== 6) return { ...concept, distance: Infinity };
        // IMPORTANT: Use scoresToUse for the user's profile in distance calculation
        const distance = euclideanDistance(scoresToUse, concept.profile);
        return { ...concept, distance: distance };
    }).filter(c => c.distance !== Infinity);
    fullMatchedConceptsList.sort((a, b) => a.distance - b.distance);

    const nodesArray = [];
    const edgesArray = [];
    const initialTopN = 12;
    const conceptIdsOnGraph = new Set();

    const maxRefDistance = fullMatchedConceptsList[initialTopN - 1]?.distance || 20;

    const typeColors = { /* ... same colors ... */
         "Orientation": "#87CEEB", "Relationship Style": "#98FB98", "Identity/Role": "#FFD700", "Practice": "#FFA07A", "Kink": "#FF6347", "Fetish": "#FFB6C1", "Framework": "#DDA0DD", "Goal/Concept": "#B0E0E6", "Approach": "#F0E68C", "Default": "#D3D3D3"
    };

    // Add "Me" node
    nodesArray.push({
        id: 0, label: "You", color: { background:'#ff69b4', border:'#ff1493' },
        size: 30, shape: 'star', font: { size: 16 }, fixed: false
    });
    conceptIdsOnGraph.add(0);

    // Add initial Top N concept nodes
    fullMatchedConceptsList.slice(0, initialTopN).forEach(concept => {
        if(conceptIdsOnGraph.has(concept.id)) return;
        const nodeColor = typeColors[concept.type] || typeColors["Default"];
        const relevance = Math.max(0.1, 1 - (concept.distance / (maxRefDistance * 1.5)));
        const nodeSize = 15 + relevance * 10; // Slightly adjust size scaling

        nodesArray.push({
            id: concept.id, label: concept.name,
            title: `${concept.name} (${concept.type})\nMatch Score: ${concept.distance.toFixed(2)}`,
            size: nodeSize, color: nodeColor, originalColor: nodeColor,
            font: { size: 12 }, elementScores: concept.profile
        });
        conceptIdsOnGraph.add(concept.id);
        edgesArray.push({ from: 0, to: concept.id, length: 120 + concept.distance * 12, dashes: true, color: '#e0e0e0' }); // Adjusted length scaling
    });

    // If network exists, update datasets; otherwise, create new
    if (network && allNodesDataSet && allEdgesDataSet) {
         console.log("Updating existing network datasets");
         // Get IDs of nodes currently on graph
         const currentNodes = allNodesDataSet.get({ fields: ['id'] }).map(n => n.id);
         // Get IDs of nodes that SHOULD be on graph
         const newNodesIds = new Set(nodesArray.map(n => n.id));

         // Nodes to remove: current nodes not in the new set
         const nodesToRemove = currentNodes.filter(id => !newNodesIds.has(id));
         // Nodes to add: new nodes not in the current set
         const nodesToAdd = nodesArray.filter(node => !currentNodes.includes(node.id));
         // Nodes to update: new nodes that were already present (update potentially changed properties like size)
         const nodesToUpdate = nodesArray.filter(node => currentNodes.includes(node.id));

         if (nodesToRemove.length > 0) allNodesDataSet.remove(nodesToRemove);
         if (nodesToAdd.length > 0) allNodesDataSet.add(nodesToAdd);
         if (nodesToUpdate.length > 0) allNodesDataSet.update(nodesToUpdate); // Update existing nodes

         // Edges are simpler for now: remove all and add new ones from "You"
         allEdgesDataSet.clear();
         allEdgesDataSet.add(edgesArray);

         // Optional: brief stabilization after updates
         network.stabilize(50);

    } else {
        console.log("Creating new network instance");
        allNodesDataSet = new vis.DataSet(nodesArray);
        allEdgesDataSet = new vis.DataSet(edgesArray);
        const data = { nodes: allNodesDataSet, edges: allEdgesDataSet };
        const options = { /* ... same options ... */
             nodes: { shape: "dot", borderWidth: 2, font: { color: '#343434', size: 14, face: 'arial'} },
             edges: { width: 1, color: { color: "#cccccc", highlight: "#8A2BE2", hover: "#b39ddb", inherit: false }, smooth: { enabled: true, type: 'dynamic' } },
             physics: { enabled: true, solver: 'forceAtlas2Based', forceAtlas2Based: { gravitationalConstant: -45, centralGravity: 0.01, springLength: 120, springConstant: 0.06, damping: 0.5 }, stabilization: { iterations: 250, fit: true } },
             interaction: { dragNodes: true, dragView: true, hover: true, zoomView: true, tooltipDelay: 200 },
             layout: { hierarchical: false }
        };
        if (network) { network.destroy(); }
        network = new vis.Network(networkContainer, data, options);
        network.on('click', handleNetworkNodeClick);
        network.on('deselectNode', resetNodeAndEdgeStyles);
    }
     resetNodeAndEdgeStyles(); // Ensure clean slate visually
}


// --- Handle clicks on ELEMENT NAME ---
function handleElementClick(elementName) {
     if (isWhatIfMode) return; // Don't highlight when simulating
     console.log("Element clicked:", elementName);
     resetNodeAndEdgeStyles();

     if (!allNodesDataSet) return;
     const updates = []; const elementIndex = elementNames.indexOf(elementName);
     const threshold = 7.0; // Increased threshold slightly

     allNodesDataSet.forEach(node => {
         let nodeUpdate = { id: node.id };
         if (node.id !== 0) {
             const nodeElementScore = node.elementScores ? node.elementScores[elementIndex] : -1;
             if (nodeElementScore >= threshold) {
                 nodeUpdate.borderWidth = 3; nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 };
                 nodeUpdate.color = { background: node.originalColor, border: '#FF8C00' }; nodeUpdate.font = { color: '#343434' };
             } else {
                 const rgb = hexToRgb(node.originalColor || '#D3D3D3'); nodeUpdate.color = { background: `rgba(${rgb}, 0.15)`, border: `rgba(${hexToRgb(darkenColor(node.originalColor || '#D3D3D3'))}, 0.1)` };
                 nodeUpdate.borderWidth = 1; nodeUpdate.shadow = false; nodeUpdate.font = { color: 'rgba(52, 52, 52, 0.2)' };
             }
         } else { nodeUpdate.color = { background:'#ff69b4', border:'#ff1493' }; nodeUpdate.shadow = false; nodeUpdate.borderWidth = 2; nodeUpdate.font = { color: '#343434', size: 16 }; }
         updates.push(nodeUpdate);
     });
     allNodesDataSet.update(updates);
}

// --- Handle clicks on the network NODE ---
function handleNetworkNodeClick(params) {
    if (isWhatIfMode) return; // Disable concept interaction in What If mode
    resetNodeAndEdgeStyles();

    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        currentlyDisplayedConceptId = nodeId; // Store ID for "Find Similar"
        if (nodeId !== 0) {
             highlightSingleNode(nodeId);
             showConceptDetailPopup(nodeId);
        }
    } else {
        currentlyDisplayedConceptId = null; // Clear stored ID if background clicked
    }
}

// --- Show Concept Detail Pop-up (Includes Comparison) ---
function showConceptDetailPopup(nodeId) {
    const conceptData = concepts.find(c => c.id === nodeId);
    if (!conceptData || !conceptData.profile) return;

    popupConceptName.textContent = conceptData.name;
    popupConceptType.textContent = conceptData.type;
    popupConceptProfile.innerHTML = ''; // Clear previous concept profile
    popupUserComparisonProfile.innerHTML = ''; // Clear previous user profile

    // Display Concept's Profile
    elementNames.forEach((element, index) => {
        const score = conceptData.profile[index];
        popupConceptProfile.innerHTML += `<div><strong>${element}:</strong> ${score.toFixed(1)}</div>`;
    });

    // Display User's CURRENT Profile (use tempScores if in What If mode, else userScores)
    const scoresForComparison = isWhatIfMode ? tempScores : userScores;
     elementNames.forEach(element => {
         const score = scoresForComparison[element];
        popupUserComparisonProfile.innerHTML += `<div><strong>${element}:</strong> ${score.toFixed(1)}</div>`;
    });


    popupOverlay.classList.remove('hidden');
    conceptDetailPopup.classList.remove('hidden');
}

// --- Hide Concept Detail Pop-up ---
function hideConceptDetailPopup() {
    conceptDetailPopup.classList.add('hidden');
    popupOverlay.classList.add('hidden');
    currentlyDisplayedConceptId = null; // Clear stored ID
    resetNodeAndEdgeStyles(); // Reset highlighting when popup closes
}

// --- Highlight just a single clicked node ---
function highlightSingleNode(selectedNodeId) { /* ... Same as previous ... */
     if (!allNodesDataSet) return; const updates = [];
     allNodesDataSet.forEach(node => { let nodeUpdate = { id: node.id };
         if(node.id === selectedNodeId){ nodeUpdate.borderWidth = 4; nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 3, y: 3 }; nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) }; nodeUpdate.font = { color: '#343434' }; }
         else { let resetColor = node.originalColor; if(node.id === 0) resetColor = { background:'#ff69b4', border:'#ff1493' }; nodeUpdate.color = (typeof resetColor === 'string' || !resetColor) ? resetColor : { background: resetColor, border: darkenColor(resetColor) }; nodeUpdate.borderWidth = 2; nodeUpdate.shadow = false; nodeUpdate.font = { color: '#343434', size: (node.id === 0 ? 16 : 12) }; }
         updates.push(nodeUpdate);
     }); allNodesDataSet.update(updates);
}

// --- Reset node and edge visual styles ---
function resetNodeAndEdgeStyles() { /* ... Same as previous ... */
     if (!allNodesDataSet) return; const nodeUpdates = [];
    allNodesDataSet.forEach(node => { let resetColor = node.originalColor; if (node.id === 0) { resetColor = { background:'#ff69b4', border:'#ff1493' }; } nodeUpdates.push({ id: node.id, color: (typeof resetColor === 'string' || !resetColor) ? resetColor : { background: resetColor, border: darkenColor(resetColor) }, borderWidth: 2, shadow: false, font: { color: '#343434', size: (node.id === 0 ? 16 : 12) } }); });
    allNodesDataSet.update(nodeUpdates);
    if (allEdgesDataSet) { const initialEdges = allEdgesDataSet.get({ filter: edge => edge.from === 0 }); allEdgesDataSet.update(initialEdges.map(e => ({ id: e.id, color: '#e0e0e0', width: 1, dashes: true }))); }
}

// --- Find and Highlight Concepts Elementally Similar To... ---
function findAndHighlightSimilarConcepts() {
    if (!currentlyDisplayedConceptId || isWhatIfMode) return; // Only works when popup is open for a concept, not in What If

    const sourceConcept = concepts.find(c => c.id === currentlyDisplayedConceptId);
    if (!sourceConcept || !sourceConcept.profile) return;

    console.log(`Finding concepts similar to ${sourceConcept.name}`);
    resetNodeAndEdgeStyles(); // Reset previous highlights

    const similarities = [];
    // Compare source concept to all OTHER concepts in the main list
    concepts.forEach(targetConcept => {
        if (targetConcept.id === sourceConcept.id || !targetConcept.profile) return; // Skip self and invalid profiles
        const distance = euclideanDistance(sourceConcept.profile, targetConcept.profile); // Compare concept-to-concept
        similarities.push({ id: targetConcept.id, distance: distance });
    });

    similarities.sort((a, b) => a.distance - b.distance);
    const topSimilarIds = similarities.slice(0, 5).map(s => s.id); // Get IDs of top 5 similar

    console.log("Top similar IDs:", topSimilarIds);

    // Highlight nodes on the graph
    const nodeUpdates = [];
    allNodesDataSet.forEach(node => {
        let nodeUpdate = { id: node.id };
        if (node.id === sourceConcept.id) {
            // Keep source node highlighted
            nodeUpdate.borderWidth = 4; nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 3, y: 3 };
            nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) }; nodeUpdate.font = { color: '#343434' };
        } else if (topSimilarIds.includes(node.id)) {
            // Highlight similar nodes
            nodeUpdate.borderWidth = 3; nodeUpdate.shadow = false;
            nodeUpdate.color = { background: node.originalColor, border: '#17a2b8' }; // Teal border for similarity
            nodeUpdate.font = { color: '#343434' };
        } else if (node.id !== 0) { // Dim others, except "Me"
            const rgb = hexToRgb(node.originalColor || '#D3D3D3');
            nodeUpdate.color = { background: `rgba(${rgb}, 0.15)`, border: `rgba(${hexToRgb(darkenColor(node.originalColor || '#D3D3D3'))}, 0.1)` };
            nodeUpdate.borderWidth = 1; nodeUpdate.shadow = false;
            nodeUpdate.font = { color: 'rgba(52, 52, 52, 0.2)' };
        } else { // Reset "Me" node
             nodeUpdate.color = { background:'#ff69b4', border:'#ff1493' }; nodeUpdate.shadow = false; nodeUpdate.borderWidth = 2; nodeUpdate.font = { color: '#343434', size: 16 };
        }
        nodeUpdates.push(nodeUpdate);
    });
    allNodesDataSet.update(nodeUpdates);
    hideConceptDetailPopup(); // Close popup after finding similar
}


// --- Refinement Modal Logic ---
function showRefinementModal(element) {
    currentRefinementElement = element;
    const questions = refinementQuestions[element];
    if (!questions || questions.length === 0) {
        alert(`No refinement questions available for ${element} yet.`);
        return;
    }

    // For simplicity, only use the first refinement question for the element
    const q = questions[0];
    refinementTitle.textContent = `Refine ${element}`;
    let inputHTML = `<h4 class="question-title">${q.text}</h4><div class="input-container">`;

    if (q.type === "radio") {
         inputHTML += `<div class="radio-options">`;
         q.options.forEach(opt => {
             // Check if current score aligns with this option? Difficult to map back perfectly. Start unchecked.
             inputHTML += `<div><input type="radio" id="${q.questionId}_${opt.value}" name="${q.questionId}" value="${opt.value}" data-points="${opt.points}"><label for="${q.questionId}_${opt.value}">${opt.value}</label></div>`;
         });
         inputHTML += `</div>`;
    }
    // Add other input types (slider, checkbox) if needed for refinement questions
     inputHTML += `</div>`;
     refinementQuestionContent.innerHTML = inputHTML;

    popupOverlay.classList.remove('hidden');
    refinementModal.classList.remove('hidden');
}

function hideRefinementModal() {
    refinementModal.classList.add('hidden');
    popupOverlay.classList.add('hidden');
    currentRefinementElement = null;
}

function submitRefinement() {
    if (!currentRefinementElement) return;

    const questions = refinementQuestions[currentRefinementElement];
    if (!questions || questions.length === 0) return;
    const q = questions[0]; // Assuming one question for now

    let pointsToAdd = 0;
    if (q.type === "radio") {
        const selectedRadio = refinementQuestionContent.querySelector(`input[name="${q.questionId}"]:checked`);
        if (selectedRadio) {
            pointsToAdd = parseFloat(selectedRadio.dataset.points);
        } else {
             alert("Please select an option.");
             return; // Don't proceed if nothing selected
        }
    }
    // Handle other refinement question types here

    // Update score (apply the adjustment directly)
    userScores[currentRefinementElement] = Math.max(0, Math.min(10, userScores[currentRefinementElement] + pointsToAdd));
    console.log(`Refined ${currentRefinementElement}: ${userScores[currentRefinementElement].toFixed(1)} (changed by ${pointsToAdd.toFixed(1)})`);

    // Update profile display & map
    displayProfileScores();
    createOrUpdateMap(); // Update map with new actual scores
    hideRefinementModal();
}


// --- Utility functions for color manipulation ---
function hexToRgb(hex) { /* ... Same as before ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... Same as before ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }

// --- Reset App function ---
function resetApp() { /* ... Same as before, includes hideRefinementModal ... */
     currentQuestionIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; if (network) { network.destroy(); network = null; } allNodesDataSet = null; allEdgesDataSet = null; fullMatchedConceptsList = []; hideConceptDetailPopup(); hideRefinementModal(); isWhatIfMode = false; // Reset What If state too whatIfSlidersDiv.classList.add('hidden'); toggleWhatIfButton.textContent = "Enable 'What If?' Mode"; toggleWhatIfButton.style.backgroundColor = '#6c757d'; showScreen('welcomeScreen');
}

// --- Event Listeners ---
startButton.addEventListener('click', () => { displayQuestion(currentQuestionIndex); showScreen('questionnaireScreen'); });
nextQButton.addEventListener('click', () => { processAnswer(currentQuestionIndex); currentQuestionIndex++; displayQuestion(currentQuestionIndex); });
// showMapButton removed - now part of finishing questionnaire
restartButton.addEventListener('click', resetApp);
closePopupButton.addEventListener('click', hideConceptDetailPopup);
popupOverlay.addEventListener('click', () => { hideConceptDetailPopup(); hideRefinementModal(); }); // Close any popup
findSimilarButton.addEventListener('click', findAndHighlightSimilarConcepts);
closeRefinementButton.addEventListener('click', hideRefinementModal);
submitRefinementButton.addEventListener('click', submitRefinement);
toggleWhatIfButton.addEventListener('click', toggleWhatIfMode);
resetWhatIfButton.addEventListener('click', resetWhatIfSliders);

// --- Initial Setup ---
showScreen('welcomeScreen');
