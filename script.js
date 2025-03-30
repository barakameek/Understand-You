// --- Global State ---
let currentElementIndex = 0; // Now track elements, not questions
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {}; // Stores answers grouped by element: { Attraction: { qId1: value, qId2: value }, ... }
let network = null;
let allNodesDataSet = null;
let allEdgesDataSet = null;
let fullMatchedConceptsList = [];
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
let selectedFlow = null; // 'direct' or 'guided'
let isWhatIfMode = false;
let tempScores = { ...userScores };
let currentRefinementElement = null;
let currentlyDisplayedConceptId = null;
let currentElementAnswers = {}; // Temp store answers for the current element in Guided Flow

// --- DOM Elements ---
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('continueToChoiceButton'); // Updated ID
const flowChoiceScreen = document.getElementById('flowChoiceScreen');
const chooseDirectFlowButton = document.getElementById('chooseDirectFlowButton');
const chooseGuidedFlowButton = document.getElementById('chooseGuidedFlowButton');
const questionnaireScreen = document.getElementById('questionnaireScreen');
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const dynamicScoreFeedback = document.getElementById('dynamicScoreFeedback'); // Feedback Area
const feedbackElementSpan = document.getElementById('feedbackElement');
const feedbackScoreSpan = document.getElementById('feedbackScore');
const feedbackScoreBar = document.getElementById('feedbackScoreBar');
const prevElementButton = document.getElementById('prevElementButton'); // Added Back button
const nextElementButton = document.getElementById('nextElementButton'); // Changed ID
const profileAndMapScreen = document.getElementById('profileAndMapScreen');
const profileScoresDiv = document.getElementById('profileScores');
const networkContainer = document.getElementById('network');
const restartButton = document.getElementById('restartButton');
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const closePopupButton = document.getElementById('closePopupButton');
const findSimilarButton = document.getElementById('findSimilarButton');
const refinementModal = document.getElementById('refinementModal');
const closeRefinementButton = document.getElementById('closeRefinementButton');
const refinementTitle = document.getElementById('refinementTitle');
const refinementQuestionContent = document.getElementById('refinementQuestionContent');
const submitRefinementButton = document.getElementById('submitRefinementButton');
const toggleWhatIfButton = document.getElementById('toggleWhatIfButton');
const whatIfSlidersDiv = document.getElementById('whatIfSliders');
const resetWhatIfButton = document.getElementById('resetWhatIfButton');

// --- Core Functions ---

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden');
        screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current');
    });
    if (screenId === 'profileAndMapScreen' && network) {
        setTimeout(() => { if (network) { network.redraw(); network.fit();} }, 100);
    }
     // Reset scroll for questionnaire
     if (screenId === 'questionnaireScreen') {
        window.scrollTo(0, 0);
    }
}

function initializeQuestionnaire(flow) {
    selectedFlow = flow;
    currentElementIndex = 0;
    // Reset scores and answers
    userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
    userAnswers = {};
    elementNames.forEach(el => userAnswers[el] = {}); // Initialize answer structure
    displayElementQuestions(currentElementIndex);
    showScreen('questionnaireScreen');
}

// --- Display questions for a specific element ---
function displayElementQuestions(index) {
    if (index >= elementNames.length) {
        finalizeScoresAndShowMap(); // Finished all elements
        return;
    }

    const element = elementNames[index];
    const questionnaireData = selectedFlow === 'direct' ? questionnaireDirect : questionnaireGuided;
    const questions = questionnaireData[element] || [];

    progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${element}`;
    questionContent.innerHTML = `<h2>${element}</h2><p>${elementExplanations[element]}</p>`; // Show explanation
    currentElementAnswers = { ...(userAnswers[element] || {}) }; // Load previous answers for this element

    questions.forEach(q => {
        let inputHTML = `<div class="question-block" id="block_${q.qId}">`; // Wrap each question
        inputHTML += `<h3 class="question-title">${q.text}</h3><div class="input-container">`;
        const savedAnswer = currentElementAnswers[q.qId];

        if (q.type === "slider") {
            const currentValue = savedAnswer !== undefined ? savedAnswer : q.defaultValue;
            inputHTML += `<div class="slider-container"> <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${currentValue}" data-question-id="${q.qId}" data-type="slider"> <div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div> <p class="value-text">Selected: <span id="display_${q.qId}">${currentValue.toFixed(1)}</span></p> </div>`;
        } else if (q.type === "radio") {
            inputHTML += `<div class="radio-options">`;
            q.options.forEach(opt => {
                const isChecked = savedAnswer === opt.value ? 'checked' : '';
                inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`;
            });
            inputHTML += `</div>`;
        } else if (q.type === "checkbox") {
            inputHTML += `<div class="checkbox-options">`;
            q.options.forEach(opt => {
                const isChecked = savedAnswer?.includes(opt.value) ? 'checked' : '';
                inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`;
            });
            inputHTML += `</div>`;
        }
        inputHTML += `</div></div>`; // Close input-container and question-block
        questionContent.innerHTML += inputHTML;
    });

    // Add listeners AFTER content is in DOM
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.addEventListener(eventType, handleQuestionnaireInputChange);
    });

    // Update dynamic feedback for Guided Flow
    updateDynamicFeedback(element);
    dynamicScoreFeedback.style.display = (selectedFlow === 'guided') ? 'block' : 'none';

    // Show/Hide Prev button
    prevElementButton.style.display = (index > 0) ? 'inline-block' : 'none';
}

// --- Handle input changes during questionnaire (especially for Guided Flow) ---
function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const qId = input.dataset.questionId;
    const type = input.dataset.type;
    const element = elementNames[currentElementIndex];

    // Enforce max choices for checkboxes immediately
    if (type === 'checkbox') {
        enforceMaxChoices(input.name, parseInt(input.dataset.maxChoices || 2), event);
    }
    // Update slider display value
    if (type === 'slider') {
        document.getElementById(`display_${qId}`).textContent = parseFloat(input.value).toFixed(1);
    }

    // Update temporary answers for the current element
    collectCurrentElementAnswers();

    // Update dynamic score feedback for Guided flow
    if (selectedFlow === 'guided') {
        updateDynamicFeedback(element);
    }
}

// --- Collect answers from the current element's screen ---
function collectCurrentElementAnswers() {
     const element = elementNames[currentElementIndex];
     const questionnaireData = selectedFlow === 'direct' ? questionnaireDirect : questionnaireGuided;
     const questions = questionnaireData[element] || [];
     currentElementAnswers = {}; // Reset before collecting

     questions.forEach(q => {
         if (q.type === 'slider') {
             const input = document.getElementById(q.qId);
             if (input) currentElementAnswers[q.qId] = parseFloat(input.value);
         } else if (q.type === 'radio') {
             const checked = document.querySelector(`input[name="${q.qId}"]:checked`);
             if (checked) currentElementAnswers[q.qId] = checked.value;
         } else if (q.type === 'checkbox') {
             const checked = document.querySelectorAll(`input[name="${q.qId}"]:checked`);
             currentElementAnswers[q.qId] = Array.from(checked).map(cb => cb.value);
         }
     });
     // Store collected answers into the main userAnswers object
     userAnswers[element] = { ...currentElementAnswers };
}


// --- Update dynamic score feedback bar (Guided Flow) ---
function updateDynamicFeedback(element) {
    if (selectedFlow !== 'guided') return;

    const tempScore = calculateElementScore(element, currentElementAnswers); // Calculate based on current inputs
    feedbackElementSpan.textContent = element;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);
    feedbackScoreBar.style.width = `${tempScore * 10}%`; // Update bar width
}

// --- Calculate score for a single element based on answers ---
// Used for both final scoring and dynamic feedback
function calculateElementScore(element, answersForElement) {
    const questionnaireData = selectedFlow === 'direct' ? questionnaireDirect : questionnaireGuided;
    const questions = questionnaireData[element] || [];
    let score = 5.0; // Start at midpoint

    questions.forEach(q => {
        const answer = answersForElement[q.qId];
        let pointsToAdd = 0;

        if (q.type === 'slider') {
            const value = (answer !== undefined) ? answer : q.defaultValue;
            // Direct Flow: Slider value directly sets score (simplified)
            if (selectedFlow === 'direct') { score = value; return; /* Skip rest */ }
            // Guided Flow: Apply points based on deviation (weighted)
            pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0);
        } else if (q.type === 'radio') {
            const selectedOption = q.options.find(opt => opt.value === answer);
             // Direct Flow: Option score directly sets score (simplified)
             if (selectedFlow === 'direct') { score = selectedOption ? selectedOption.score : q.defaultValue; return; }
            // Guided Flow: Add option's points (weighted)
            pointsToAdd = selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0;
        } else if (q.type === 'checkbox' && answer) {
            // Guided Flow Only (Direct doesn't use checkbox)
            answer.forEach(val => {
                const selectedOption = q.options.find(opt => opt.value === val);
                pointsToAdd += selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0;
            });
        }
         if (selectedFlow === 'guided') {
            score += pointsToAdd;
        }
    });

    return Math.max(0, Math.min(10, score)); // Clamp score
}

// --- Finalize all scores and show map ---
function finalizeScoresAndShowMap() {
     console.log("Finalizing scores...");
     elementNames.forEach(element => {
         userScores[element] = calculateElementScore(element, userAnswers[element] || {});
     });
     console.log("Final User Scores:", userScores);
     calculateAndShowProfileAndMap(); // Display combined screen
}

// --- Navigate questionnaire ---
function nextElement() {
    collectCurrentElementAnswers(); // Save answers for current element
    currentElementIndex++;
    displayElementQuestions(currentElementIndex);
}
function prevElement() {
    collectCurrentElementAnswers(); // Save answers for current element
    currentElementIndex--;
    displayElementQuestions(currentElementIndex);
}


// --- Display Profile Scores (Updates based on userScores) ---
function displayProfileScores(scoresToShow = userScores) {
    profileScoresDiv.innerHTML = '';
    elementNames.forEach(element => {
        const score = scoresToShow[element];
        const scoreElement = document.createElement('div');
        const refineButtonHTML = !isWhatIfMode ? `<button class="refine-button" data-element="${element}">Refine</button>` : '';
        scoreElement.innerHTML = ` <strong data-element="${element}">${element}:</strong> <span>${score.toFixed(1)}</span> ${refineButtonHTML} `;
        profileScoresDiv.appendChild(scoreElement);
        scoreElement.querySelector('strong')?.addEventListener('click', () => { if (!isWhatIfMode) handleElementClick(element); });
        scoreElement.querySelector('.refine-button')?.addEventListener('click', (e) => { e.stopPropagation(); showRefinementModal(element); });
    });
}

// --- Setup/Handle "What If?" Mode ---
function setupWhatIfSliders() {
    whatIfSlidersDiv.innerHTML = '<p>Adjust sliders to simulate changes:</p>'; // Clear existing
    elementNames.forEach(element => {
        const score = tempScores[element];
        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('slider-container');
        sliderContainer.innerHTML = `
            <label for="whatif_${element}">${element}</label>
            <input type="range" id="whatif_${element}" class="slider" min="0" max="10" step="0.5" value="${score}">
            <p class="value-text">Value: <span id="whatifValue_${element}">${score.toFixed(1)}</span></p>
        `;
        whatIfSlidersDiv.appendChild(sliderContainer);
        const sliderInput = sliderContainer.querySelector(`#whatif_${element}`);
        sliderInput.addEventListener('input', () => { document.getElementById(`whatifValue_${element}`).textContent = parseFloat(sliderInput.value).toFixed(1); });
        sliderInput.addEventListener('change', () => { tempScores[element] = parseFloat(sliderInput.value); createOrUpdateMap(tempScores); });
    });
    resetWhatIfButton.classList.remove('hidden'); // Show reset button
}
function toggleWhatIfMode() {
    isWhatIfMode = !isWhatIfMode;
    if (isWhatIfMode) {
        tempScores = { ...userScores }; setupWhatIfSliders(); whatIfSlidersDiv.classList.remove('hidden');
        toggleWhatIfButton.textContent = "Disable 'What If?'"; toggleWhatIfButton.style.backgroundColor = '#5a6268';
        resetNodeAndEdgeStyles(); createOrUpdateMap(tempScores);
        profileScoresDiv.querySelectorAll('strong').forEach(el => el.style.cursor = 'default');
        profileScoresDiv.querySelectorAll('.refine-button').forEach(btn => btn.classList.add('hidden'));
    } else {
        whatIfSlidersDiv.classList.add('hidden'); resetWhatIfButton.classList.add('hidden');
        toggleWhatIfButton.textContent = "Enable 'What If?'"; toggleWhatIfButton.style.backgroundColor = '#6c757d';
        createOrUpdateMap(userScores); displayProfileScores(); // Redraw profile side
    }
}
function resetWhatIfSliders() { if (!isWhatIfMode) return; tempScores = { ...userScores }; setupWhatIfSliders(); createOrUpdateMap(tempScores); }

// --- Map Creation and Updates ---
function createOrUpdateMap(scoresToUse = userScores) {
    console.log("Create/Update Map with scores:", scoresToUse);
    // Recalculate distances
    fullMatchedConceptsList = concepts.map(c => ({ ...c, distance: euclideanDistance(scoresToUse, c.profile || []) })).filter(c => c.distance !== Infinity);
    fullMatchedConceptsList.sort((a, b) => a.distance - b.distance);

    const nodesArray = []; const edgesArray = []; const initialTopN = 12;
    const conceptIdsOnGraph = new Set(); const maxRefDistance = fullMatchedConceptsList[initialTopN - 1]?.distance || 20;
    const typeColors = { /* ... colors ... */ "Orientation": "#87CEEB", "Relationship Style": "#98FB98", "Identity/Role": "#FFD700", "Practice": "#FFA07A", "Kink": "#FF6347", "Fetish": "#FFB6C1", "Framework": "#DDA0DD", "Goal/Concept": "#B0E0E6", "Approach": "#F0E68C", "Default": "#D3D3D3" };

    nodesArray.push({ id: 0, label: "You", color: { background:'#ff69b4', border:'#ff1493' }, size: 30, shape: 'star', font: { size: 16 }, fixed: false });
    conceptIdsOnGraph.add(0);

    fullMatchedConceptsList.slice(0, initialTopN).forEach(concept => {
        if(conceptIdsOnGraph.has(concept.id)) return;
        const nodeColor = typeColors[concept.type] || typeColors["Default"]; const relevance = Math.max(0.1, 1 - (concept.distance / (maxRefDistance * 1.5))); const nodeSize = 15 + relevance * 10;
        nodesArray.push({ id: concept.id, label: concept.name, title: `${concept.name} (${concept.type})\nMatch Score: ${concept.distance.toFixed(2)}`, size: nodeSize, color: nodeColor, originalColor: nodeColor, font: { size: 12 }, elementScores: concept.profile });
        conceptIdsOnGraph.add(concept.id);
        edgesArray.push({ from: 0, to: concept.id, length: 120 + concept.distance * 12, dashes: true, color: '#e0e0e0' });
    });

    if (network && allNodesDataSet && allEdgesDataSet) { // Update existing network
        const currentNodes = allNodesDataSet.get({ fields: ['id'] }).map(n => n.id);
        const newNodesIds = new Set(nodesArray.map(n => n.id));
        const nodesToRemove = currentNodes.filter(id => !newNodesIds.has(id));
        const nodesToAdd = nodesArray.filter(node => !currentNodes.includes(node.id));
        const nodesToUpdate = nodesArray.filter(node => currentNodes.includes(node.id));
        if (nodesToRemove.length > 0) allNodesDataSet.remove(nodesToRemove);
        if (nodesToAdd.length > 0) allNodesDataSet.add(nodesToAdd);
        if (nodesToUpdate.length > 0) allNodesDataSet.update(nodesToUpdate);
        allEdgesDataSet.clear(); allEdgesDataSet.add(edgesArray); // Reset edges from "You"
        network.stabilize(50);
    } else { // Create new network
        allNodesDataSet = new vis.DataSet(nodesArray); allEdgesDataSet = new vis.DataSet(edgesArray);
        const data = { nodes: allNodesDataSet, edges: allEdgesDataSet };
        const options = { /* ... options ... */ nodes: { shape: "dot", borderWidth: 2, font: { color: '#343434', size: 14, face: 'arial'} }, edges: { width: 1, color: { color: "#cccccc", highlight: "#8A2BE2", hover: "#b39ddb", inherit: false }, smooth: { enabled: true, type: 'dynamic' } }, physics: { enabled: true, solver: 'forceAtlas2Based', forceAtlas2Based: { gravitationalConstant: -45, centralGravity: 0.01, springLength: 120, springConstant: 0.06, damping: 0.5 }, stabilization: { iterations: 250, fit: true } }, interaction: { dragNodes: true, dragView: true, hover: true, zoomView: true, tooltipDelay: 200 }, layout: { hierarchical: false } };
        if (network) { network.destroy(); }
        network = new vis.Network(networkContainer, data, options);
        network.on('click', handleNetworkNodeClick); network.on('deselectNode', resetNodeAndEdgeStyles);
    }
    resetNodeAndEdgeStyles();
}

// --- Interaction Handlers (Element Click, Node Click, Popups, Find Similar, Refinement) ---
function handleElementClick(elementName) { /* ... Same as previous full code ... */
     if (isWhatIfMode) return; console.log("Element clicked:", elementName); resetNodeAndEdgeStyles(); if (!allNodesDataSet) return; const updates = []; const elementIndex = elementNames.indexOf(elementName); const threshold = 7.0;
     allNodesDataSet.forEach(node => { let nodeUpdate = { id: node.id }; if (node.id !== 0) { const nodeElementScore = node.elementScores ? node.elementScores[elementIndex] : -1; if (nodeElementScore >= threshold) { nodeUpdate.borderWidth = 3; nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 }; nodeUpdate.color = { background: node.originalColor, border: '#FF8C00' }; nodeUpdate.font = { color: '#343434' }; } else { const rgb = hexToRgb(node.originalColor || '#D3D3D3'); nodeUpdate.color = { background: `rgba(${rgb}, 0.15)`, border: `rgba(${hexToRgb(darkenColor(node.originalColor || '#D3D3D3'))}, 0.1)` }; nodeUpdate.borderWidth = 1; nodeUpdate.shadow = false; nodeUpdate.font = { color: 'rgba(52, 52, 52, 0.2)' }; } } else { nodeUpdate.color = { background:'#ff69b4', border:'#ff1493' }; nodeUpdate.shadow = false; nodeUpdate.borderWidth = 2; nodeUpdate.font = { color: '#343434', size: 16 }; } updates.push(nodeUpdate); }); allNodesDataSet.update(updates);
}
function handleNetworkNodeClick(params) { /* ... Same as previous full code ... */
    if (isWhatIfMode) return; resetNodeAndEdgeStyles();
    if (params.nodes.length > 0) { const nodeId = params.nodes[0]; currentlyDisplayedConceptId = nodeId; if (nodeId !== 0) { highlightSingleNode(nodeId); showConceptDetailPopup(nodeId); } }
    else { currentlyDisplayedConceptId = null; }
}
function showConceptDetailPopup(nodeId) { /* ... Same as previous full code, displays both profiles ... */
    const conceptData = concepts.find(c => c.id === nodeId); if (!conceptData || !conceptData.profile) return; popupConceptName.textContent = conceptData.name; popupConceptType.textContent = conceptData.type; popupConceptProfile.innerHTML = ''; popupUserComparisonProfile.innerHTML = '';
    elementNames.forEach((element, index) => { const score = conceptData.profile[index]; popupConceptProfile.innerHTML += `<div><strong>${element}:</strong> ${score.toFixed(1)}</div>`; });
    const scoresForComparison = isWhatIfMode ? tempScores : userScores; elementNames.forEach(element => { const score = scoresForComparison[element]; popupUserComparisonProfile.innerHTML += `<div><strong>${element}:</strong> ${score.toFixed(1)}</div>`; });
    popupOverlay.classList.remove('hidden'); conceptDetailPopup.classList.remove('hidden');
}
function hideConceptDetailPopup() { /* ... Same as previous full code ... */ conceptDetailPopup.classList.add('hidden'); popupOverlay.classList.add('hidden'); currentlyDisplayedConceptId = null; resetNodeAndEdgeStyles(); }
function highlightSingleNode(selectedNodeId) { /* ... Same as previous full code ... */
    if (!allNodesDataSet) return; const updates = [];
    allNodesDataSet.forEach(node => { let nodeUpdate = { id: node.id }; if(node.id === selectedNodeId){ nodeUpdate.borderWidth = 4; nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 3, y: 3 }; nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) }; nodeUpdate.font = { color: '#343434' }; } else { let resetColor = node.originalColor; if(node.id === 0) resetColor = { background:'#ff69b4', border:'#ff1493' }; nodeUpdate.color = (typeof resetColor === 'string' || !resetColor) ? resetColor : { background: resetColor, border: darkenColor(resetColor) }; nodeUpdate.borderWidth = 2; nodeUpdate.shadow = false; nodeUpdate.font = { color: '#343434', size: (node.id === 0 ? 16 : 12) }; } updates.push(nodeUpdate); }); allNodesDataSet.update(updates);
}
function resetNodeAndEdgeStyles() { /* ... Same as previous full code ... */
     if (!allNodesDataSet) return; const nodeUpdates = [];
    allNodesDataSet.forEach(node => { let resetColor = node.originalColor; if (node.id === 0) { resetColor = { background:'#ff69b4', border:'#ff1493' }; } nodeUpdates.push({ id: node.id, color: (typeof resetColor === 'string' || !resetColor) ? resetColor : { background: resetColor, border: darkenColor(resetColor) }, borderWidth: 2, shadow: false, font: { color: '#343434', size: (node.id === 0 ? 16 : 12) } }); }); allNodesDataSet.update(nodeUpdates);
    if (allEdgesDataSet) { const initialEdges = allEdgesDataSet.get({ filter: edge => edge.from === 0 }); allEdgesDataSet.update(initialEdges.map(e => ({ id: e.id, color: '#e0e0e0', width: 1, dashes: true }))); }
}
function findAndHighlightSimilarConcepts() { /* ... Same as previous full code ... */
     if (!currentlyDisplayedConceptId || isWhatIfMode) return; const sourceConcept = concepts.find(c => c.id === currentlyDisplayedConceptId); if (!sourceConcept || !sourceConcept.profile) return; console.log(`Finding concepts similar to ${sourceConcept.name}`); resetNodeAndEdgeStyles(); const similarities = []; concepts.forEach(targetConcept => { if (targetConcept.id === sourceConcept.id || !targetConcept.profile) return; const distance = euclideanDistance(sourceConcept.profile, targetConcept.profile); similarities.push({ id: targetConcept.id, distance: distance }); }); similarities.sort((a, b) => a.distance - b.distance); const topSimilarIds = similarities.slice(0, 5).map(s => s.id); console.log("Top similar IDs:", topSimilarIds); const nodeUpdates = [];
    allNodesDataSet.forEach(node => { let nodeUpdate = { id: node.id }; if (node.id === sourceConcept.id) { nodeUpdate.borderWidth = 4; nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 3, y: 3 }; nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) }; nodeUpdate.font = { color: '#343434' }; } else if (topSimilarIds.includes(node.id)) { nodeUpdate.borderWidth = 3; nodeUpdate.shadow = false; nodeUpdate.color = { background: node.originalColor, border: '#17a2b8' }; nodeUpdate.font = { color: '#343434' }; } else if (node.id !== 0) { const rgb = hexToRgb(node.originalColor || '#D3D3D3'); nodeUpdate.color = { background: `rgba(${rgb}, 0.15)`, border: `rgba(${hexToRgb(darkenColor(node.originalColor || '#D3D3D3'))}, 0.1)` }; nodeUpdate.borderWidth = 1; nodeUpdate.shadow = false; nodeUpdate.font = { color: 'rgba(52, 52, 52, 0.2)' }; } else { nodeUpdate.color = { background:'#ff69b4', border:'#ff1493' }; nodeUpdate.shadow = false; nodeUpdate.borderWidth = 2; nodeUpdate.font = { color: '#343434', size: 16 }; } nodeUpdates.push(nodeUpdate); }); allNodesDataSet.update(nodeUpdates); hideConceptDetailPopup();
}

// --- Refinement Modal Logic ---
function showRefinementModal(element) { /* ... Same as previous full code ... */
    currentRefinementElement = element; const questions = refinementQuestions[element]; if (!questions || questions.length === 0) { alert(`No refinement questions available for ${element} yet.`); return; } const q = questions[0]; refinementTitle.textContent = `Refine ${element}`; let inputHTML = `<h4 class="question-title">${q.text}</h4><div class="input-container">`;
    if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { inputHTML += `<div><input type="radio" id="${q.questionId}_${opt.value}" name="${q.questionId}" value="${opt.value}" data-points="${opt.points}"><label for="${q.questionId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; } inputHTML += `</div>`; refinementQuestionContent.innerHTML = inputHTML; popupOverlay.classList.remove('hidden'); refinementModal.classList.remove('hidden');
 }
function hideRefinementModal() { /* ... Same as previous full code ... */ refinementModal.classList.add('hidden'); popupOverlay.classList.add('hidden'); currentRefinementElement = null; }
function submitRefinement() { /* ... Same as previous full code ... */
    if (!currentRefinementElement) return; const questions = refinementQuestions[currentRefinementElement]; if (!questions || questions.length === 0) return; const q = questions[0]; let pointsToAdd = 0;
    if (q.type === "radio") { const selectedRadio = refinementQuestionContent.querySelector(`input[name="${q.questionId}"]:checked`); if (selectedRadio) { pointsToAdd = parseFloat(selectedRadio.dataset.points); } else { alert("Please select an option."); return; } }
    userScores[currentRefinementElement] = Math.max(0, Math.min(10, userScores[currentRefinementElement] + pointsToAdd)); console.log(`Refined ${currentRefinementElement}: ${userScores[currentRefinementElement].toFixed(1)} (changed by ${pointsToAdd.toFixed(1)})`);
    displayProfileScores(); createOrUpdateMap(); hideRefinementModal();
}

// --- Utility - Color Manipulation ---
function hexToRgb(hex) { /* ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }

// --- Reset App ---
function resetApp() { /* ... Same as previous full code ... */
     currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; if (network) { network.destroy(); network = null; } allNodesDataSet = null; allEdgesDataSet = null; fullMatchedConceptsList = []; hideConceptDetailPopup(); hideRefinementModal(); isWhatIfMode = false; whatIfSlidersDiv.classList.add('hidden'); toggleWhatIfButton.textContent = "Enable 'What If?'"; toggleWhatIfButton.style.backgroundColor = '#6c757d'; resetWhatIfButton.classList.add('hidden'); selectedFlow = null; showScreen('welcomeScreen');
}

// --- Event Listeners ---
startButton.addEventListener('click', () => showScreen('flowChoiceScreen'));
chooseDirectFlowButton.addEventListener('click', () => initializeQuestionnaire('direct'));
chooseGuidedFlowButton.addEventListener('click', () => initializeQuestionnaire('guided'));
nextElementButton.addEventListener('click', nextElement); // Changed from nextQButton
prevElementButton.addEventListener('click', prevElement); // Added listener
// showMapButton removed
restartButton.addEventListener('click', resetApp);
closePopupButton.addEventListener('click', hideConceptDetailPopup);
popupOverlay.addEventListener('click', () => { hideConceptDetailPopup(); hideRefinementModal(); });
findSimilarButton.addEventListener('click', findAndHighlightSimilarConcepts);
closeRefinementButton.addEventListener('click', hideRefinementModal);
submitRefinementButton.addEventListener('click', submitRefinement);
toggleWhatIfButton.addEventListener('click', toggleWhatIfMode);
resetWhatIfButton.addEventListener('click', resetWhatIfSliders);

// --- Initial Setup ---
showScreen('welcomeScreen');
