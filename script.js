// --- Global State ---
let currentElementIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
let network = null;
let allNodesDataSet = new vis.DataSet(); // Initialize empty
let allEdgesDataSet = new vis.DataSet(); // Initialize empty
let fullMatchedConceptsList = [];
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
const elementNodeIds = { Attraction: 1001, Interaction: 1002, Sensory: 1003, Psychological: 1004, Cognitive: 1005, Relational: 1006 }; // Unique IDs for hubs
let activeQuest = null; // Track current quest

// --- DOM Elements ---
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startGuidedButton'); // Updated ID
// const flowChoiceScreen = document.getElementById('flowChoiceScreen'); // Removed choice screen
const questionnaireScreen = document.getElementById('questionnaireScreen');
const elementProgressHeader = document.getElementById('elementProgressHeader'); // New
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const dynamicScoreFeedback = document.getElementById('dynamicScoreFeedback');
const feedbackElementSpan = document.getElementById('feedbackElement');
const feedbackScoreSpan = document.getElementById('feedbackScore');
const feedbackScoreBar = document.getElementById('feedbackScoreBar');
const prevElementButton = document.getElementById('prevElementButton');
const nextElementButton = document.getElementById('nextElementButton');
const explorationScreen = document.getElementById('explorationScreen'); // Renamed screen ID
const profileScoresDiv = document.getElementById('profileScores');
const networkContainer = document.getElementById('network');
const restartButton = document.getElementById('restartButton');
const questButtons = document.querySelectorAll('.quest-button'); // Get all quest buttons

// Popups removed for simplicity in this version

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
    // Only Guided flow now
    currentElementIndex = 0;
    userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
    userAnswers = {};
    elementNames.forEach(el => userAnswers[el] = {});
    updateElementProgressHeader(-1); // Initial state
    displayElementQuestions(currentElementIndex);
    showScreen('questionnaireScreen');
}

// --- NEW: Update Element Progress Header ---
function updateElementProgressHeader(activeIndex) {
    elementProgressHeader.innerHTML = ''; // Clear existing
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div');
        tab.classList.add('element-tab');
        tab.textContent = name.substring(0, 3).toUpperCase(); // Abbreviate
        tab.title = name; // Full name on hover
        if (index < activeIndex) {
            tab.classList.add('completed');
        } else if (index === activeIndex) {
            tab.classList.add('active');
        }
        elementProgressHeader.appendChild(tab);
    });
}

// --- Display questions for a specific element ---
function displayElementQuestions(index) {
    if (index >= elementNames.length) {
        finalizeScoresAndShowExploration(); // Finished all elements
        return;
    }

    const element = elementNames[index];
    const questions = questionnaireGuided[element] || []; // Only Guided

    updateElementProgressHeader(index); // Update header highlight
    progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${element}`;
    // Inject element intro + clear previous questions
    questionContent.innerHTML = `
        <div class="element-intro">
            <h2>${element}</h2>
            <p>${elementExplanations[element]}</p>
        </div>
    `;
    currentElementAnswers = { ...(userAnswers[element] || {}) };

    // Add questions for this element
    questions.forEach(q => {
        let inputHTML = `<div class="question-block" id="block_${q.qId}">`;
        inputHTML += `<h3 class="question-title">${q.text}</h3><div class="input-container">`;
        const savedAnswer = currentElementAnswers[q.qId];
        // ... (Generate HTML for slider, radio, checkbox as before) ...
         if (q.type === "slider") { const currentValue = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"> <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${currentValue}" data-question-id="${q.qId}" data-type="slider"> <div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div> <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(currentValue).toFixed(1)}</span></p> </div>`; }
         else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const isChecked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
         else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const isChecked = savedAnswer?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
        inputHTML += `</div></div>`;
        questionContent.innerHTML += inputHTML;
    });

    // Add listeners
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.addEventListener(eventType, handleQuestionnaireInputChange);
    });

    updateDynamicFeedback(element); // Update feedback bar
    dynamicScoreFeedback.style.display = 'block'; // Always show for guided

    prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; // Use visibility
    nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Constellation" : "Next Element";
}

// --- Handle Input Change & Update Dynamic Feedback ---
function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const qId = input.dataset.questionId;
    const type = input.dataset.type;
    const element = elementNames[currentElementIndex];

    if (type === 'checkbox') { enforceMaxChoices(input.name, parseInt(input.dataset.maxChoices || 2), event); }
    if (type === 'slider') { document.getElementById(`display_${qId}`).textContent = parseFloat(input.value).toFixed(1); }

    collectCurrentElementAnswers(); // Update temp answers
    updateDynamicFeedback(element); // Update score display based on temp answers
}

// --- Collect answers for current element ---
function collectCurrentElementAnswers() { /* ... Same as previous ... */
    const element = elementNames[currentElementIndex]; const questions = questionnaireGuided[element] || []; currentElementAnswers = {};
    questions.forEach(q => { if (q.type === 'slider') { const input = document.getElementById(q.qId); if (input) currentElementAnswers[q.qId] = parseFloat(input.value); } else if (q.type === 'radio') { const checked = document.querySelector(`input[name="${q.qId}"]:checked`); if (checked) currentElementAnswers[q.qId] = checked.value; } else if (q.type === 'checkbox') { const checked = document.querySelectorAll(`input[name="${q.qId}"]:checked`); currentElementAnswers[q.qId] = Array.from(checked).map(cb => cb.value); } });
    userAnswers[element] = { ...currentElementAnswers }; // Store in main answers object
 }

// --- Update Dynamic Score Bar ---
function updateDynamicFeedback(element) {
    const tempScore = calculateElementScore(element, currentElementAnswers); // Calc based on current inputs
    feedbackElementSpan.textContent = element;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);
    feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

// --- Calculate single element score ---
function calculateElementScore(element, answersForElement) { /* ... Same logic as before for Guided flow ... */
    const questions = questionnaireGuided[element] || []; let score = 5.0;
    questions.forEach(q => { const answer = answersForElement[q.qId]; let pointsToAdd = 0; if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); } else if (q.type === 'radio') { const selectedOption = q.options.find(opt => opt.value === answer); pointsToAdd = selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; } else if (q.type === 'checkbox' && answer) { answer.forEach(val => { const selectedOption = q.options.find(opt => opt.value === val); pointsToAdd += selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; }); } score += pointsToAdd; });
    return Math.max(0, Math.min(10, score));
}

// --- Finalize scores and show map ---
function finalizeScoresAndShowExploration() {
     console.log("Finalizing scores...");
     elementNames.forEach(element => { userScores[element] = calculateElementScore(element, userAnswers[element] || {}); });
     console.log("Final User Scores:", userScores);
     displayProfileScores(); // Update profile display side
     createInitialTerritoryMap(); // Create the initial map
     showScreen('explorationScreen');
}

// --- Navigate questionnaire ---
function nextElement() {
    collectCurrentElementAnswers(); // Save final answers for current element
    currentElementIndex++;
    displayElementQuestions(currentElementIndex); // Display next or finalize
}
function prevElement() {
    collectCurrentElementAnswers(); // Save answers before going back
    currentElementIndex--;
    displayElementQuestions(currentElementIndex);
}

// --- Display Profile Scores (Side Panel) ---
function displayProfileScores(scoresToShow = userScores) {
    profileScoresDiv.innerHTML = '';
    elementNames.forEach(element => {
        const score = scoresToShow[element];
        const scoreElement = document.createElement('div');
        // No refine button in this simplified version
        scoreElement.innerHTML = ` <strong data-element="${element}">${element}:</strong> <span>${score.toFixed(1)}</span> `;
        profileScoresDiv.appendChild(scoreElement);
        scoreElement.querySelector('strong')?.addEventListener('click', () => { handleElementClick(element); });
    });
}

// --- Calculate Euclidean Distance (User Profile Object vs Concept Profile Object) ---
function euclideanDistance(profile1, profile2) {
    let sum = 0;
    for (let i = 0; i < elementNames.length; i++) {
        const key = elementNames[i];
        const score1 = profile1[key] ?? 5; // Default to 5 if missing
        const score2 = profile2[key] ?? 5; // Default to 5 if missing
        sum += Math.pow(score1 - score2, 2);
    }
    return Math.sqrt(sum);
}

// --- Create the Initial Element Territory Map ---
function createInitialTerritoryMap() {
    console.log("Creating territory map...");

    // 1. Calculate relevance (distance) for all concepts
    fullMatchedConceptsList = concepts.map(concept => {
        if (!concept.elementScores) return { ...concept, distance: Infinity }; // Use elementScores now
        const distance = euclideanDistance(userScores, concept.elementScores);
        return { ...concept, distance: distance };
    }).filter(c => c.distance !== Infinity);
    fullMatchedConceptsList.sort((a, b) => a.distance - b.distance);

    // 2. Prepare Nodes
    const nodesArray = [];
    const elementAnchors = {}; // To store positions
    const angleStep = (2 * Math.PI) / 6;
    const radius = 250; // Radius for placing element anchors

    // Add Element Anchor Nodes (Styled based on user score - Constellation Shaping)
    elementNames.forEach((name, index) => {
        const elementId = elementNodeIds[name];
        const score = userScores[name];
        const size = 15 + score * 1.5; // Size based on score
        const opacity = 0.5 + score * 0.05; // Opacity based on score
        const color = `rgba(138, 43, 226, ${opacity})`; // BlueViolet with opacity
        const x = radius * Math.cos(angleStep * index - Math.PI / 2); // Position anchors
        const y = radius * Math.sin(angleStep * index - Math.PI / 2);
        elementAnchors[name] = { x, y }; // Store position

        nodesArray.push({
            id: elementId,
            label: name,
            x: x, y: y, // Fix position
            fixed: true,
            size: size,
            shape: 'ellipse',
            color: { background: color, border: darkenColor(color, 40), highlight: { background: color, border: '#FF0000' }, hover:{ background: color, border: '#FF0000' } },
            font: { size: 14, color: '#FFFFFF', strokeWidth: 2, strokeColor: '#333333' },
            // Allow dragging hubs slightly? Maybe not fixed? Let's try fixed first.
            physics: false, // Disable physics for anchor hubs
             isHub: true // Custom property
        });
    });

    // Add Concept Nodes (Initially Dimmed - Unfogging)
    const conceptsToShowInitially = 10; // Show a few relevant ones clearly first
    const initialVisibleIds = new Set(fullMatchedConceptsList.slice(0, conceptsToShowInitially).map(c => c.id));
    initialVisibleIds.add(0); // Always add "You" if we were using it (not needed here)
     elementNames.forEach(name => initialVisibleIds.add(elementNodeIds[name])); // Hubs always visible

    concepts.forEach(concept => {
        const isVisible = initialVisibleIds.has(concept.id);
        const primaryElName = elementKeyToName[concept.primaryElement];
        const anchorPos = elementAnchors[primaryElName] || { x: 0, y: 0 };

        nodesArray.push({
            id: concept.id,
            label: concept.name,
            title: `${concept.name} (${concept.type})`, // Tooltip
            size: isVisible ? 12 : 4, // Smaller if hidden
            color: { background: isVisible ? '#FFA07A' : '#E0E0E0', border: isVisible ? darkenColor('#FFA07A') : '#CCCCCC' }, // Dim if hidden
            originalColor: '#FFA07A', // Store base color
            font: { size: 10, color: isVisible ? '#333' : '#AAA' },
            hidden: !isVisible, // Vis.js doesn't have built-in fog, use hidden/styling
            opacity: isVisible ? 1.0 : 0.1, // Use opacity for fog effect
             isHub: false, // Custom property
             primaryElement: concept.primaryElement // Store primary element for physics/filtering
            // Start near primary element anchor - physics will adjust
            // x: anchorPos.x + (Math.random() - 0.5) * 50,
            // y: anchorPos.y + (Math.random() - 0.5) * 50
        });
    });

    // 3. Prepare Edges (Initially None, or only between related visible nodes?)
    // Let's start with NO concept edges initially, only implicit clustering.
    allNodesDataSet = new vis.DataSet(nodesArray);
    allEdgesDataSet = new vis.DataSet([]); // Start with no edges between concepts

    // 4. Setup Vis.js Network
    const data = { nodes: allNodesDataSet, edges: allEdgesDataSet };
    const options = {
        nodes: { borderWidth: 1, font: { face: 'arial'} },
        edges: { width: 0.5, color: { color: "#ddd", inherit: false }, smooth: { enabled: false } }, // Less smooth edges
        physics: {
            enabled: true,
            solver: 'barnesHut', // Good for clustering
            barnesHut: {
                gravitationalConstant: -8000, // Repel nodes more strongly
                centralGravity: 0.1, // Weak pull to center
                springLength: 120,
                springConstant: 0.02,
                damping: 0.3, // Dampen faster
                avoidOverlap: 0.3 // Try to prevent overlap
            },
             stabilization: { iterations: 300, fit: true } // More iterations
        },
        interaction: { dragNodes: true, dragView: true, hover: true, zoomView: true, tooltipDelay: 200 },
        layout: { hierarchical: false }
    };

     // Custom physics forces to pull concepts towards their element hub (APPROXIMATION)
     options.physics.centralGravity = 0; // Turn off default central gravity
     network = new vis.Network(networkContainer, data, options);

     // Apply custom forces AFTER network is initialized (more complex)
     // For simplicity, we'll rely on initial placement + standard physics for now.
     // True territory simulation requires more advanced physics configuration or layout algorithms.

    network.on('click', handleTerritoryMapClick);
    // network.on('deselectNode', resetMapVisuals); // Reset on background click
}

// --- Handle clicks on the Territory Map ---
function handleTerritoryMapClick(params) {
    resetMapVisuals(); // Reset previous highlights

    const clickedNodeIds = params.nodes;
    if (clickedNodeIds.length === 0) return; // Clicked background

    const nodeId = clickedNodeIds[0];
    const nodeData = allNodesDataSet.get(nodeId);

    if (nodeData.isHub) {
        // Clicked an Element Hub
        const clickedElement = nodeData.label;
        console.log("Clicked Element Hub:", clickedElement);
        revealConceptsForElement(clickedElement); // Unfog/highlight concepts for this element
        highlightElementHub(nodeId); // Highlight the hub itself
    } else {
        // Clicked a Concept Node
        console.log("Clicked Concept:", nodeData.label);
        revealRelatedConcepts(nodeId); // Unfog/reveal related concepts
        highlightConceptAndRelatives(nodeId); // Highlight clicked + revealed relatives
    }
}

// --- Unfog/Reveal concepts related to a clicked element hub ---
function revealConceptsForElement(elementName) {
    const elementKey = Object.keys(elementKeyToName).find(key => elementKeyToName[key] === elementName);
    if (!elementKey) return;

    const updates = [];
    // Find concepts primarily associated with this element
    const elementConcepts = concepts.filter(c => c.primaryElement === elementKey);
    const conceptsToReveal = elementConcepts.slice(0, 10); // Limit how many reveal at once

    conceptsToReveal.forEach(concept => {
        const node = allNodesDataSet.get(concept.id);
        if (node && node.hidden) { // Only update if currently hidden/dimmed
            updates.push({
                id: concept.id,
                hidden: false,
                opacity: 1.0,
                size: 12, // Restore size
                font: { color: '#333', size: 10 },
                color: { background: node.originalColor || '#FFA07A', border: darkenColor(node.originalColor || '#FFA07A') }
            });
        }
    });

    if (updates.length > 0) {
        allNodesDataSet.update(updates);
        network.stabilize(50); // Help settle new nodes
        console.log(`Revealed ${updates.length} concepts for ${elementName}`);
    }
}

// --- Unfog/Reveal concepts related to a clicked concept ---
function revealRelatedConcepts(sourceNodeId) {
    const sourceConcept = concepts.find(c => c.id === sourceNodeId);
    if (!sourceConcept || !sourceConcept.relatedIds) return;

    const updates = [];
    const edgesToAdd = [];
    const maxReveal = 5;
    let revealedCount = 0;

    sourceConcept.relatedIds.forEach(relatedId => {
        if (revealedCount >= maxReveal) return;
        const node = allNodesDataSet.get(relatedId);
        if (node && node.hidden) { // If related node exists but is hidden
            updates.push({
                id: relatedId,
                hidden: false,
                opacity: 1.0,
                size: 12,
                font: { color: '#333', size: 10 },
                color: { background: node.originalColor || '#FFA07A', border: darkenColor(node.originalColor || '#FFA07A') }
            });
            revealedCount++;
             // Add edge connecting to source
             edgesToAdd.push({ from: sourceNodeId, to: relatedId, length: 150, color: '#b0b0b0', dashes: true, revealed: true });
        } else if (node) {
             // Node exists and is visible, ensure edge exists
             const existingEdge = allEdgesDataSet.get({ filter: e => (e.from === sourceNodeId && e.to === relatedId) || (e.from === relatedId && e.to === sourceNodeId) });
             if (existingEdge.length === 0) {
                 edgesToAdd.push({ from: sourceNodeId, to: relatedId, length: 150, color: '#b0b0b0', dashes: true, revealed: true });
             }
        }
    });

    if (updates.length > 0) allNodesDataSet.update(updates);
    if (edgesToAdd.length > 0) allEdgesDataSet.add(edgesToAdd);
    if (updates.length > 0 || edgesToAdd.length > 0) network.stabilize(50);
}

// --- Highlighting Functions (Simplified) ---
function highlightElementHub(hubId) {
    allNodesDataSet.update([{ id: hubId, shadow: { enabled: true, size: 15, color: 'rgba(255,215,0,0.5)' } }]); // Gold shadow
}

function highlightConceptAndRelatives(sourceNodeId) {
    const sourceConcept = concepts.find(c => c.id === sourceNodeId);
    const relatedIds = sourceConcept?.relatedIds || [];
    const updates = [];

    allNodesDataSet.forEach(node => {
        let nodeUpdate = { id: node.id };
        if (node.id === sourceNodeId) {
            nodeUpdate.borderWidth = 3;
            nodeUpdate.shadow = { enabled: true, color: 'rgba(0,0,0,0.3)', size: 8 };
             nodeUpdate.color = { background: node.originalColor, border: darkenColor(node.originalColor, 60) };
        } else if (relatedIds.includes(node.id) && !node.hidden) { // Highlight visible relatives
            nodeUpdate.borderWidth = 2;
             nodeUpdate.color = { background: node.originalColor, border: '#8A2BE2' }; // Violet border
             nodeUpdate.shadow = false;
        }
        // No explicit dimming here, relies on unfogging logic
        updates.push(nodeUpdate);
    });
    allNodesDataSet.update(updates);
}

// --- Reset Map Visuals (Nodes and Edges) ---
function resetMapVisuals() {
    console.log("Resetting map visuals");
    if (!allNodesDataSet) return;
    const nodeUpdates = [];
    allNodesDataSet.forEach(node => {
        let nodeUpdate = { id: node.id };
        if (node.isHub) {
            // Reset hub style (size/color based on score)
             const score = userScores[node.label];
             const size = 15 + score * 1.5;
             const opacity = 0.5 + score * 0.05;
             const color = `rgba(138, 43, 226, ${opacity})`;
             nodeUpdate.color = { background: color, border: darkenColor(color, 40) };
             nodeUpdate.size = size;
             nodeUpdate.shadow = false;
             nodeUpdate.borderWidth = 3; // Keep hub border thicker
        } else if (!node.hidden) {
            // Reset visible concept nodes
            nodeUpdate.color = { background: node.originalColor || '#FFA07A', border: darkenColor(node.originalColor || '#FFA07A') };
            nodeUpdate.borderWidth = 1;
            nodeUpdate.shadow = false;
             nodeUpdate.font = { size: 10, color: '#333' };
        } else {
             // Keep hidden nodes styled as hidden
             nodeUpdate.color = { background: '#E0E0E0', border: '#CCCCCC' };
             nodeUpdate.opacity = 0.1;
             nodeUpdate.size = 4;
             nodeUpdate.font = { size: 10, color: '#AAA' };
        }
        nodeUpdates.push(nodeUpdate);
    });
    if(nodeUpdates.length > 0) allNodesDataSet.update(nodeUpdates);

     // Remove dynamically added edges ('revealed' edges)
     if(allEdgesDataSet) {
         const revealedEdges = allEdgesDataSet.get({ filter: edge => edge.revealed === true });
         if (revealedEdges.length > 0) allEdgesDataSet.remove(revealedEdges.map(e => e.id));
     }
}

// --- Quest Logic (Basic Start) ---
function startQuest(questId) {
    const quest = questData[questId];
    if (!quest) return;

    activeQuest = questId;
    console.log(`Starting Quest: ${quest.title}`);
    resetMapVisuals(); // Reset map first

    // 1. Highlight the starting element hub
    const startHubId = elementNodeIds[quest.startElement];
    if (startHubId) {
        allNodesDataSet.update([{ id: startHubId, shadow: { enabled: true, size: 15, color: 'rgba(0,200,0,0.5)' } }]); // Green quest shadow
    }

    // 2. Reveal and highlight starting concepts for the quest
    const questConceptUpdates = [];
    quest.startConcepts.forEach(conceptId => {
        const node = allNodesDataSet.get(conceptId);
        if (node) { // Ensure node exists (might not if data mismatch)
            let update = {
                id: conceptId,
                hidden: false,
                opacity: 1.0,
                size: 14, // Make quest nodes slightly larger
                font: { color: '#006400', size: 11, strokeWidth: 1, strokeColor: '#ffffff' }, // Quest font style
                color: { background: node.originalColor || '#FFA07A', border: '#00FF00' }, // Green border
                shadow: { enabled: true, size: 10, color: 'rgba(200,255,200,0.6)' }
            };
            questConceptUpdates.push(update);
        }
    });
    if (questConceptUpdates.length > 0) allNodesDataSet.update(questConceptUpdates);

    alert(`Quest Started: ${quest.title}\nFocus on the ${quest.startElement} territory and look for highlighted concepts.`);
    // Next steps would involve tracking clicks on these nodes and presenting next part of quest...
}


// --- Utility functions ---
function hexToRgb(hex) { /* ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }

// --- Reset App ---
function resetApp() {
     currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; if (network) { network.destroy(); network = null; } allNodesDataSet = new vis.DataSet(); allEdgesDataSet = new vis.DataSet(); fullMatchedConceptsList = []; activeQuest = null; showScreen('welcomeScreen');
}

// --- Event Listeners ---
startButton.addEventListener('click', initializeQuestionnaire); // Only guided now
nextElementButton.addEventListener('click', nextElement);
prevElementButton.addEventListener('click', prevElement);
restartButton.addEventListener('click', resetApp);
questButtons.forEach(button => {
    button.addEventListener('click', () => startQuest(button.dataset.quest));
});
// Removed listeners for popups, find similar, what if, refine

// --- Initial Setup ---
showScreen('welcomeScreen');
