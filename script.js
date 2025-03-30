// --- Global State ---
let currentElementIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
let network = null;
let allNodesDataSet = new vis.DataSet();
let allEdgesDataSet = new vis.DataSet();
let fullMatchedConceptsList = [];
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
const elementNodeIds = { Attraction: 1001, Interaction: 1002, Sensory: 1003, Psychological: 1004, Cognitive: 1005, Relational: 1006 };
let activeQuest = null;

// --- DOM Elements ---
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startGuidedButton');
const questionnaireScreen = document.getElementById('questionnaireScreen');
const elementProgressHeader = document.getElementById('elementProgressHeader');
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const dynamicScoreFeedback = document.getElementById('dynamicScoreFeedback');
const feedbackElementSpan = document.getElementById('feedbackElement');
const feedbackScoreSpan = document.getElementById('feedbackScore');
const feedbackScoreBar = document.getElementById('feedbackScoreBar');
const prevElementButton = document.getElementById('prevElementButton');
const nextElementButton = document.getElementById('nextElementButton');
const explorationScreen = document.getElementById('explorationScreen');
const profileScoresDiv = document.getElementById('profileScores');
const networkContainer = document.getElementById('network');
const restartButton = document.getElementById('restartButton');
const questButtons = document.querySelectorAll('.quest-button');

// --- Functions ---

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden');
        screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current');
    });
     if (screenId === 'explorationScreen' && network) {
         setTimeout(() => { if (network) { network.redraw(); network.fit();} }, 100);
    }
     if (screenId === 'questionnaireScreen') { window.scrollTo(0, 0); }
}

function initializeQuestionnaire() {
    currentElementIndex = 0;
    userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
    userAnswers = {};
    elementNames.forEach(el => userAnswers[el] = {});
    updateElementProgressHeader(-1);
    displayElementQuestions(currentElementIndex);
    showScreen('questionnaireScreen');
}

function updateElementProgressHeader(activeIndex) {
    elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div');
        tab.classList.add('element-tab');
        tab.textContent = name.substring(0, 3).toUpperCase();
        tab.title = name;
        if (index < activeIndex) tab.classList.add('completed');
        else if (index === activeIndex) tab.classList.add('active');
        elementProgressHeader.appendChild(tab);
    });
}

// *** ADDED MISSING FUNCTION ***
function enforceMaxChoices(name, max, event) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        // Attempt to uncheck the box that was just clicked to trigger this
        if (event && event.target && event.target.checked) {
            event.target.checked = false;
        } else if (checkboxes.length > 0) {
             // Fallback: uncheck the last one in the NodeList if event target is unclear
             checkboxes[checkboxes.length -1].checked = false;
        }
    }
}

function displayElementQuestions(index) {
    if (index >= elementNames.length) {
        finalizeScoresAndShowExploration();
        return;
    }
    const element = elementNames[index];
    const questions = questionnaireGuided[element] || [];
    updateElementProgressHeader(index);
    progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${element}`;
    questionContent.innerHTML = `<div class="element-intro"><h2>${element}</h2><p>${elementExplanations[element]}</p></div>`;
    currentElementAnswers = { ...(userAnswers[element] || {}) };

    questions.forEach(q => {
        let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
        const savedAnswer = currentElementAnswers[q.qId];
        // Generate inputs... (Slider, Radio, Checkbox logic remains the same)
        if (q.type === "slider") { const currentValue = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"> <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${currentValue}" data-question-id="${q.qId}" data-type="slider"> <div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div> <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(currentValue).toFixed(1)}</span></p> </div>`; }
        else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const isChecked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
        else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const isChecked = savedAnswer?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
        inputHTML += `</div></div>`;
        questionContent.innerHTML += inputHTML;
    });

    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.addEventListener(eventType, handleQuestionnaireInputChange);
    });
    updateDynamicFeedback(element);
    dynamicScoreFeedback.style.display = 'block';
    prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden';
    nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Constellation" : "Next Element";
}

function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const qId = input.dataset.questionId;
    const type = input.dataset.type;
    const element = elementNames[currentElementIndex];

    if (type === 'checkbox') {
        // *** CALL THE FIXED/ADDED FUNCTION ***
        enforceMaxChoices(input.name, parseInt(input.dataset.maxChoices || 2), event);
    }
    if (type === 'slider') {
        document.getElementById(`display_${qId}`).textContent = parseFloat(input.value).toFixed(1);
    }
    collectCurrentElementAnswers();
    updateDynamicFeedback(element);
}

function collectCurrentElementAnswers() { /* ... Same as previous ... */
    const element = elementNames[currentElementIndex]; const questions = questionnaireGuided[element] || []; currentElementAnswers = {};
    questions.forEach(q => { if (q.type === 'slider') { const input = document.getElementById(q.qId); if (input) currentElementAnswers[q.qId] = parseFloat(input.value); } else if (q.type === 'radio') { const checked = document.querySelector(`input[name="${q.qId}"]:checked`); if (checked) currentElementAnswers[q.qId] = checked.value; } else if (q.type === 'checkbox') { const checked = document.querySelectorAll(`input[name="${q.qId}"]:checked`); currentElementAnswers[q.qId] = Array.from(checked).map(cb => cb.value); } });
    userAnswers[element] = { ...currentElementAnswers };
}

function updateDynamicFeedback(element) { /* ... Same as previous ... */
    const tempScore = calculateElementScore(element, currentElementAnswers); feedbackElementSpan.textContent = element; feedbackScoreSpan.textContent = tempScore.toFixed(1); feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

function calculateElementScore(element, answersForElement) { /* ... Same as previous ... */
    const questions = questionnaireGuided[element] || []; let score = 5.0;
    questions.forEach(q => { const answer = answersForElement[q.qId]; let pointsToAdd = 0; if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); } else if (q.type === 'radio') { const selectedOption = q.options.find(opt => opt.value === answer); pointsToAdd = selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; } else if (q.type === 'checkbox' && answer) { answer.forEach(val => { const selectedOption = q.options.find(opt => opt.value === val); pointsToAdd += selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; }); } score += pointsToAdd; });
    return Math.max(0, Math.min(10, score));
}

function finalizeScoresAndShowExploration() { /* ... Same as previous ... */
     console.log("Finalizing scores..."); elementNames.forEach(element => { userScores[element] = calculateElementScore(element, userAnswers[element] || {}); }); console.log("Final User Scores:", userScores); displayProfileScores(); createInitialTerritoryMap(); showScreen('explorationScreen');
}

function nextElement() { /* ... Same as previous ... */ collectCurrentElementAnswers(); currentElementIndex++; displayElementQuestions(currentElementIndex); }
function prevElement() { /* ... Same as previous ... */ collectCurrentElementAnswers(); currentElementIndex--; displayElementQuestions(currentElementIndex); }

// --- *** ADDED handleElementClick Definition *** ---
function handleElementClick(elementName) {
     if (activeQuest) { // Don't allow element highlighting during a quest for simplicity
          alert("Finish or reset the current quest before highlighting elements.");
          return;
     }
     console.log("Element clicked:", elementName);
     resetMapVisuals(); // Reset previous highlights

     if (!allNodesDataSet) return;

     const updates = [];
     const elementIndex = elementNames.indexOf(elementName);
     const elementHubId = elementNodeIds[elementName];
     const threshold = 7.0; // Score threshold to be considered "strong" in this element

     // Highlight the hub
     updates.push({ id: elementHubId, shadow: { enabled: true, size: 15, color: 'rgba(255,140,0,0.5)' } }); // Orange highlight

     allNodesDataSet.forEach(node => {
         if (node.isHub && node.id !== elementHubId) { // Dim other hubs
              updates.push({ id: node.id, opacity: 0.3 });
         } else if (!node.isHub && !node.hidden) { // Process visible concept nodes
             const nodeElementScore = node.elementScores ? node.elementScores[elementName] : -1; // Use full element name
             if (nodeElementScore >= threshold) {
                 // Highlight concepts strong in this element
                  updates.push({
                     id: node.id,
                     borderWidth: 3,
                     opacity: 1.0,
                     color: { background: node.originalColor, border: '#FF8C00' }, // Orange border
                     font: { color: '#343434' }, // Ensure font is visible
                     shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5 }
                 });
             } else {
                 // Dim concepts weak in this element
                  const rgb = hexToRgb(node.originalColor || '#D3D3D3');
                  updates.push({
                     id: node.id,
                     opacity: 0.2, // Dim further
                     color: { background: `rgba(${rgb}, 0.15)`, border: `rgba(${hexToRgb(darkenColor(node.originalColor || '#D3D3D3'))}, 0.1)` },
                     borderWidth: 1,
                     shadow: false,
                     font: { color: 'rgba(52, 52, 52, 0.2)' }
                 });
             }
         }
         // Keep the clicked hub highlighted (already handled above)
         // Hidden nodes remain hidden/dim
     });

     if (updates.length > 0) allNodesDataSet.update(updates);
}


// --- Display Profile Scores ---
function displayProfileScores(scoresToShow = userScores) {
    profileScoresDiv.innerHTML = '';
    elementNames.forEach(element => {
        const score = scoresToShow[element];
        const scoreElement = document.createElement('div');
        // Make element name clickable
        scoreElement.innerHTML = ` <strong data-element="${element}">${element}:</strong> <span>${score.toFixed(1)}</span> `;
        profileScoresDiv.appendChild(scoreElement);
        // *** Ensure listener is correctly added ***
        const strongEl = scoreElement.querySelector('strong');
        if (strongEl) {
             strongEl.addEventListener('click', () => {
                 // Check if What If mode is active before handling
                 if (!isWhatIfMode) {
                    handleElementClick(element); // Use the function directly
                 }
             });
        }
    });
}

// --- What If Mode (Removed for this version to simplify focus) ---
// function setupWhatIfSliders() { /* ... */ }
// function toggleWhatIfMode() { /* ... */ }
// function resetWhatIfSliders() { /* ... */ }


function euclideanDistance(profile1, profile2) { /* ... Same as previous ... */
    let sum = 0; const elements = elementNames;
    for (let i = 0; i < elements.length; i++) { const key = elements[i]; const score1 = profile1[key] ?? 5; const score2 = profile2[key] ?? 5; sum += Math.pow(score1 - score2, 2); } return Math.sqrt(sum);
}

// --- Create Initial Territory Map ---
function createInitialTerritoryMap() {
    console.log("Creating territory map...");
    fullMatchedConceptsList = concepts.map(c => ({ ...c, distance: euclideanDistance(userScores, c.elementScores || {}) })).filter(c => c.distance !== Infinity);
    fullMatchedConceptsList.sort((a, b) => a.distance - b.distance);

    const nodesArray = []; const elementAnchors = {};
    const angleStep = (2 * Math.PI) / 6; const radius = 350; // Increased radius

    // Add Element Hubs
    elementNames.forEach((name, index) => {
        const elementId = elementNodeIds[name]; const score = userScores[name]; const size = 15 + score * 1.5; const opacity = 0.5 + score * 0.05; const color = `rgba(138, 43, 226, ${opacity})`;
        const x = radius * Math.cos(angleStep * index - Math.PI / 2); const y = radius * Math.sin(angleStep * index - Math.PI / 2); elementAnchors[name] = { x, y };
        nodesArray.push({ id: elementId, label: name, x: x, y: y, fixed: true, size: size, shape: 'ellipse', color: { background: color, border: darkenColor(color, 40) }, originalColor: color, font: { size: 14, color: '#FFFFFF', strokeWidth: 2, strokeColor: '#333333' }, physics: false, isHub: true });
    });

    const conceptsToShowInitially = 10;
    const initialVisibleIds = new Set(fullMatchedConceptsList.slice(0, conceptsToShowInitially).map(c => c.id));
    elementNames.forEach(name => initialVisibleIds.add(elementNodeIds[name])); // Hubs always visible

    // Add Concept Nodes
    const typeColors = { /* ... colors ... */ "Orientation": "#87CEEB", "Relationship Style": "#98FB98", "Identity/Role": "#FFD700", "Practice": "#FFA07A", "Kink": "#FF6347", "Fetish": "#FFB6C1", "Framework": "#DDA0DD", "Goal/Concept": "#B0E0E6", "Approach": "#F0E68C", "Default": "#D3D3D3" };
    concepts.forEach(concept => {
        const isVisible = initialVisibleIds.has(concept.id);
        const primaryElName = elementKeyToName[concept.primaryElement];
        const anchorPos = elementAnchors[primaryElName] || { x: 0, y: 0 };
        const nodeColor = typeColors[concept.type] || typeColors["Default"];
        const initialOpacity = isVisible ? 1.0 : 0.1; // Dim if hidden

        nodesArray.push({
            id: concept.id, label: concept.name, title: `${concept.name} (${concept.type})`,
            size: isVisible ? 12 : 5, // Smaller if hidden
            color: { background: isVisible ? nodeColor : '#E0E0E0', border: isVisible ? darkenColor(nodeColor) : '#CCCCCC' },
            originalColor: nodeColor,
            font: { size: 10, color: isVisible ? '#333' : '#AAA' },
            hidden: false, // Don't actually hide, use opacity
            opacity: initialOpacity,
            isHub: false,
            primaryElement: concept.primaryElement,
            elementScores: concept.elementScores,
            // Start near primary element anchor
            x: anchorPos.x + (Math.random() - 0.5) * 80,
            y: anchorPos.y + (Math.random() - 0.5) * 80
        });
    });

    allNodesDataSet = new vis.DataSet(nodesArray);
    allEdgesDataSet = new vis.DataSet([]); // No initial edges between concepts

    const data = { nodes: allNodesDataSet, edges: allEdgesDataSet };
    // *** CORRECTED Physics Options ***
    const options = {
        nodes: { borderWidth: 1, font: { face: 'arial'} },
        edges: { width: 0.5, color: { color: "#ddd", inherit: false }, smooth: { enabled: false } },
        physics: {
            enabled: true,
            solver: 'barnesHut', // Use barnesHut for better clustering
            barnesHut: {
                gravitationalConstant: -10000, // Repel nodes
                centralGravity: 0.05, // Slight pull to center (affects concepts)
                springLength: 100,
                springConstant: 0.015, // Weaker springs for less structure initially
                damping: 0.2,
                avoidOverlap: 0.2
            },
             stabilization: { iterations: 400, fit: true } // More iterations needed
        },
        interaction: { dragNodes: true, dragView: true, hover: true, zoomView: true, tooltipDelay: 200 },
        layout: { hierarchical: false }
    };

    if (network) { network.destroy(); }
    network = new vis.Network(networkContainer, data, options);
    network.on('click', handleTerritoryMapClick);
}

// --- Handle clicks on the Territory Map ---
function handleTerritoryMapClick(params) { /* ... Same as previous ... */
    resetMapVisuals(); const clickedNodeIds = params.nodes; if (clickedNodeIds.length === 0) return; const nodeId = clickedNodeIds[0]; const nodeData = allNodesDataSet.get(nodeId);
    if (nodeData.isHub) { const clickedElement = nodeData.label; console.log("Clicked Element Hub:", clickedElement); revealConceptsForElement(clickedElement); highlightElementHub(nodeId); }
    else { console.log("Clicked Concept:", nodeData.label); revealRelatedConcepts(nodeId); highlightConceptAndRelatives(nodeId); }
}

// --- Unfog/Reveal concepts related to element hub ---
function revealConceptsForElement(elementName) { /* ... Same as previous ... */
    const elementKey = Object.keys(elementKeyToName).find(key => elementKeyToName[key] === elementName); if (!elementKey) return; const updates = []; const elementConcepts = concepts.filter(c => c.primaryElement === elementKey); const conceptsToReveal = elementConcepts.slice(0, 10);
    conceptsToReveal.forEach(concept => { const node = allNodesDataSet.get(concept.id); if (node && node.opacity < 1.0) { updates.push({ id: concept.id, opacity: 1.0, size: 12, font: { color: '#333', size: 10 }, color: { background: node.originalColor || '#FFA07A', border: darkenColor(node.originalColor || '#FFA07A') } }); } });
    if (updates.length > 0) { allNodesDataSet.update(updates); network.stabilize(50); console.log(`Revealed ${updates.length} concepts for ${elementName}`); }
}

// --- Unfog/Reveal concepts related to clicked concept ---
function revealRelatedConcepts(sourceNodeId) { /* ... Same as previous ... */
    const sourceConcept = concepts.find(c => c.id === sourceNodeId); if (!sourceConcept || !sourceConcept.relatedIds) return; const updates = []; const edgesToAdd = []; const maxReveal = 5; let revealedCount = 0;
    sourceConcept.relatedIds.forEach(relatedId => { if (revealedCount >= maxReveal) return; const node = allNodesDataSet.get(relatedId); if (node && node.opacity < 1.0) { updates.push({ id: relatedId, opacity: 1.0, size: 12, font: { color: '#333', size: 10 }, color: { background: node.originalColor || '#FFA07A', border: darkenColor(node.originalColor || '#FFA07A') } }); revealedCount++; edgesToAdd.push({ from: sourceNodeId, to: relatedId, length: 150, color: '#b0b0b0', dashes: true, revealed: true }); } else if (node) { const existingEdge = allEdgesDataSet.get({ filter: e => (e.from === sourceNodeId && e.to === relatedId) || (e.from === relatedId && e.to === sourceNodeId) }); if (existingEdge.length === 0 && sourceNodeId !== 0 && relatedId >= 1001) { edgesToAdd.push({ from: sourceNodeId, to: relatedId, length: 150, color: '#b0b0b0', dashes: true, revealed: true }); } } });
    if (updates.length > 0) allNodesDataSet.update(updates); if (edgesToAdd.length > 0) allEdgesDataSet.add(edgesToAdd); if (updates.length > 0 || edgesToAdd.length > 0) network.stabilize(50);
}

// --- Highlighting Functions ---
function highlightElementHub(hubId) { /* ... Same as previous ... */ allNodesDataSet.update([{ id: hubId, shadow: { enabled: true, size: 15, color: 'rgba(255,215,0,0.5)' } }]); }
function highlightConceptAndRelatives(sourceNodeId) { /* ... Same as previous ... */
    const sourceConcept = concepts.find(c => c.id === sourceNodeId); const relatedIds = sourceConcept?.relatedIds || []; const updates = [];
    allNodesDataSet.forEach(node => { let nodeUpdate = { id: node.id }; if (node.id === sourceNodeId) { nodeUpdate.borderWidth = 3; nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.3)', size: 8 }; nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) }; } else if (relatedIds.includes(node.id) && node.opacity > 0.5) { nodeUpdate.borderWidth = 2; nodeUpdate.color = { background: node.originalColor, border: '#8A2BE2' }; nodeUpdate.shadow = false; } updates.push(nodeUpdate); }); allNodesDataSet.update(updates);
}

// --- Reset Map Visuals ---
function resetMapVisuals() { /* ... Same logic as previous, ensure opacity/hidden state resets based on initial reveal */
    console.log("Resetting map visuals"); if (!allNodesDataSet) return; const nodeUpdates = []; const initialVisibleIds = new Set(fullMatchedConceptsList.slice(0, 10).map(c => c.id)); elementNames.forEach(name => initialVisibleIds.add(elementNodeIds[name]));
    allNodesDataSet.forEach(node => { let nodeUpdate = { id: node.id }; let isInitiallyVisible = initialVisibleIds.has(node.id); if (node.isHub) { const score = userScores[node.label]; const size = 15 + score * 1.5; const opacity = 0.5 + score * 0.05; const color = `rgba(138, 43, 226, ${opacity})`; nodeUpdate.color = { background: color, border: darkenColor(color, 40) }; nodeUpdate.size = size; nodeUpdate.shadow = false; nodeUpdate.borderWidth = 3; nodeUpdate.opacity = 1.0; } else { nodeUpdate.opacity = isInitiallyVisible ? 1.0 : 0.1; nodeUpdate.size = isInitiallyVisible ? 12 : 5; nodeUpdate.font = { size: 10, color: isInitiallyVisible ? '#333' : '#AAA' }; nodeUpdate.color = { background: isInitiallyVisible ? (node.originalColor || '#FFA07A') : '#E0E0E0', border: isInitiallyVisible ? darkenColor(node.originalColor || '#FFA07A') : '#CCCCCC' }; nodeUpdate.borderWidth = 1; nodeUpdate.shadow = false; } nodeUpdates.push(nodeUpdate); });
    if(nodeUpdates.length > 0) allNodesDataSet.update(nodeUpdates);
    if(allEdgesDataSet) { const revealedEdges = allEdgesDataSet.get({ filter: edge => edge.revealed === true }); if (revealedEdges.length > 0) allEdgesDataSet.remove(revealedEdges.map(e => e.id)); }
}

// --- Quest Logic ---
function startQuest(questId) { /* ... Same basic logic as previous ... */
    const quest = questData[questId]; if (!quest) return; activeQuest = questId; console.log(`Starting Quest: ${quest.title}`); resetMapVisuals(); const startHubId = elementNodeIds[quest.startElement]; if (startHubId) { allNodesDataSet.update([{ id: startHubId, shadow: { enabled: true, size: 15, color: 'rgba(0,200,0,0.5)' } }]); } const questConceptUpdates = [];
    quest.startConcepts.forEach(conceptId => { const node = allNodesDataSet.get(conceptId); if (node) { let update = { id: conceptId, opacity: 1.0, size: 14, font: { color: '#006400', size: 11, strokeWidth: 1, strokeColor: '#ffffff' }, color: { background: node.originalColor || '#FFA07A', border: '#00FF00' }, shadow: { enabled: true, size: 10, color: 'rgba(200,255,200,0.6)' } }; questConceptUpdates.push(update); } }); if (questConceptUpdates.length > 0) allNodesDataSet.update(questConceptUpdates); alert(`Quest Started: ${quest.title}\nFocus on the ${quest.startElement} territory and look for highlighted concepts.`);
}

// --- Utility functions ---
function hexToRgb(hex) { /* ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }

// --- Reset App ---
function resetApp() { /* ... Same as previous, ensure What If reset */
     currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; if (network) { network.destroy(); network = null; } allNodesDataSet = new vis.DataSet(); allEdgesDataSet = new vis.DataSet(); fullMatchedConceptsList = []; activeQuest = null; /*isWhatIfMode = false;*/ showScreen('welcomeScreen');
}

// --- Event Listeners ---
startButton.addEventListener('click', initializeQuestionnaire); // Use guided flow
nextElementButton.addEventListener('click', nextElement);
prevElementButton.addEventListener('click', prevElement);
restartButton.addEventListener('click', resetApp);
questButtons.forEach(button => button.addEventListener('click', () => startQuest(button.dataset.quest)));
// Removed listeners for popups, find similar, what if, refine

// --- Initial Setup ---
showScreen('welcomeScreen');
