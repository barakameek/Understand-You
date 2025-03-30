// --- Global State ---
let currentElementIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
let currentElementAnswers = {}; // Temp store for guided flow
let selectedElements = []; // Track selected elements for mixing
let currentlyDisplayedConceptId = null; // Track concept in popup
// *** REMOVED Vis.js related variables ***
// let network = null;
// let allNodesDataSet = new vis.DataSet(); // REMOVED
// let allEdgesDataSet = new vis.DataSet(); // REMOVED
// let fullMatchedConceptsList = []; // We might recalculate relevance on the fly or remove this too if not sorting results

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
const labScreen = document.getElementById('labScreen');
const elementVialsDiv = document.getElementById('elementVials');
const clearSelectionButton = document.getElementById('clearSelectionButton');
const resultsBenchDiv = document.getElementById('conceptResults');
const resultsInstructionP = document.getElementById('resultsInstruction');
const restartButton = document.getElementById('restartButton');
// Popup elements
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const closePopupButton = document.getElementById('closePopupButton');

// --- Core Functions ---

function showScreen(screenId) { /* ... Same as before ... */
    screens.forEach(screen => { screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden'); screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current'); });
    if (screenId === 'questionnaireScreen') { window.scrollTo(0, 0); }
}

function initializeQuestionnaire() { /* ... Same as before ... */
    currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; elementNames.forEach(el => userAnswers[el] = {}); updateElementProgressHeader(-1); displayElementQuestions(currentElementIndex); showScreen('questionnaireScreen');
}

function updateElementProgressHeader(activeIndex) { /* ... Same as before ... */
    elementProgressHeader.innerHTML = ''; elementNames.forEach((name, index) => { const tab = document.createElement('div'); tab.classList.add('element-tab'); tab.textContent = name.substring(0, 3).toUpperCase(); tab.title = name; if (index < activeIndex) tab.classList.add('completed'); else if (index === activeIndex) tab.classList.add('active'); elementProgressHeader.appendChild(tab); });
}

function enforceMaxChoices(name, max, event) { /* ... Same as before ... */
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`); if (checkboxes.length > max) { alert(`You can only select up to ${max} options.`); if (event && event.target && event.target.checked) { event.target.checked = false; } }
}

function displayElementQuestions(index) { /* ... Same as before ... */
     if (index >= elementNames.length) { finalizeScoresAndShowLab(); return; } const element = elementNames[index]; const questions = questionnaireGuided[element] || []; updateElementProgressHeader(index); progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${element}`; questionContent.innerHTML = `<div class="element-intro"><h2>${element}</h2><p>${elementExplanations[element]}</p></div>`; currentElementAnswers = { ...(userAnswers[element] || {}) };
    questions.forEach(q => { let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`; const savedAnswer = currentElementAnswers[q.qId];
    if (q.type === "slider") { const currentValue = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"> <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${currentValue}" data-question-id="${q.qId}" data-type="slider"> <div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div> <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(currentValue).toFixed(1)}</span></p> </div>`; }
    else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const isChecked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
    else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const isChecked = savedAnswer?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
    inputHTML += `</div></div>`; questionContent.innerHTML += inputHTML; });
    questionContent.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.addEventListener(eventType, handleQuestionnaireInputChange); }); updateDynamicFeedback(element); dynamicScoreFeedback.style.display = 'block'; prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; nextElementButton.textContent = (index === elementNames.length - 1) ? "Enter the Lab" : "Next Element";
}

function handleQuestionnaireInputChange(event) { /* ... Same as before ... */
     const input = event.target; const qId = input.dataset.questionId; const type = input.dataset.type; const element = elementNames[currentElementIndex];
    if (type === 'checkbox') { enforceMaxChoices(input.name, parseInt(input.dataset.maxChoices || 2), event); } if (type === 'slider') { document.getElementById(`display_${qId}`).textContent = parseFloat(input.value).toFixed(1); } collectCurrentElementAnswers(); updateDynamicFeedback(element);
}

function collectCurrentElementAnswers() { /* ... Same as before ... */
    const element = elementNames[currentElementIndex]; const questions = questionnaireGuided[element] || []; currentElementAnswers = {};
    questions.forEach(q => { if (q.type === 'slider') { const input = document.getElementById(q.qId); if (input) currentElementAnswers[q.qId] = parseFloat(input.value); } else if (q.type === 'radio') { const checked = document.querySelector(`input[name="${q.qId}"]:checked`); if (checked) currentElementAnswers[q.qId] = checked.value; } else if (q.type === 'checkbox') { const checked = document.querySelectorAll(`input[name="${q.qId}"]:checked`); currentElementAnswers[q.qId] = Array.from(checked).map(cb => cb.value); } });
    userAnswers[element] = { ...currentElementAnswers };
}

function updateDynamicFeedback(element) { /* ... Same as before ... */
    const tempScore = calculateElementScore(element, currentElementAnswers); feedbackElementSpan.textContent = element; feedbackScoreSpan.textContent = tempScore.toFixed(1); feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

function calculateElementScore(element, answersForElement) { /* ... Same as before ... */
    const questions = questionnaireGuided[element] || []; let score = 5.0;
    questions.forEach(q => { const answer = answersForElement[q.qId]; let pointsToAdd = 0; if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); } else if (q.type === 'radio') { const selectedOption = q.options.find(opt => opt.value === answer); pointsToAdd = selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; } else if (q.type === 'checkbox' && answer) { answer.forEach(val => { const selectedOption = q.options.find(opt => opt.value === val); pointsToAdd += selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; }); } score += pointsToAdd; });
    return Math.max(0, Math.min(10, score));
}

function finalizeScoresAndShowLab() { /* ... Same as before ... */
     console.log("Finalizing scores..."); elementNames.forEach(element => { userScores[element] = calculateElementScore(element, userAnswers[element] || {}); }); console.log("Final User Scores:", userScores); displayElementVials(); filterAndDisplayConcepts(); showScreen('labScreen');
}

function nextElement() { /* ... Same as before ... */ collectCurrentElementAnswers(); currentElementIndex++; displayElementQuestions(currentElementIndex); }
function prevElement() { /* ... Same as before ... */ collectCurrentElementAnswers(); currentElementIndex--; displayElementQuestions(currentElementIndex); }

// --- Lab Screen Functions ---

function displayElementVials() { /* ... Same as before ... */
    elementVialsDiv.innerHTML = ''; selectedElements = []; clearSelectionButton.classList.add('hidden');
    elementNames.forEach(element => { const score = userScores[element]; const vial = document.createElement('div'); vial.classList.add('vial'); vial.dataset.element = element; vial.innerHTML = ` <div class="vial-icon"><div class="vial-liquid" style="height: ${score * 10}%; background-color: ${getElementColor(element)};"></div></div> <div class="vial-label"><span class="vial-name">${element}</span> <span class="vial-score">Score: ${score.toFixed(1)}</span></div> `; vial.addEventListener('click', handleVialClick); elementVialsDiv.appendChild(vial); });
}

function getElementColor(elementName) { /* ... Same as before ... */
    const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' }; return colors[elementName] || '#CCCCCC';
}

function handleVialClick(event) { /* ... Same as before ... */
    const clickedVial = event.currentTarget; const element = clickedVial.dataset.element;
    if (selectedElements.includes(element)) { selectedElements = selectedElements.filter(el => el !== element); clickedVial.classList.remove('selected'); }
    else if (selectedElements.length < 2) { selectedElements.push(element); clickedVial.classList.add('selected'); }
    else { alert("You can only select up to two elements to combine."); return; }
    updateVialStates(); filterAndDisplayConcepts(); clearSelectionButton.classList.toggle('hidden', selectedElements.length === 0);
}

function updateVialStates() { /* ... Same as before ... */
    const vials = elementVialsDiv.querySelectorAll('.vial'); const maxSelected = selectedElements.length >= 2; vials.forEach(vial => { const isSelected = vial.classList.contains('selected'); vial.classList.toggle('disabled', maxSelected && !isSelected); });
}

function clearElementSelection() { /* ... Same as before ... */
    selectedElements = []; updateVialStates(); filterAndDisplayConcepts(); clearSelectionButton.classList.add('hidden'); elementVialsDiv.querySelectorAll('.vial.selected').forEach(v => v.classList.remove('selected'));
}

// Modified filter function
function filterAndDisplayConcepts() {
    resultsBenchDiv.innerHTML = ''; // Clear previous results
    let filteredConcepts = [];
    const scoreThreshold = 6.5; // Concept needs >= this score in selected element(s)

    if (selectedElements.length === 0) {
        resultsInstructionP.textContent = "Select 1 or 2 elements on the left to see resulting concepts.";
        // Optional: Show top overall matches initially? Calculate distances first.
         let conceptsWithDistance = concepts
             .map(c => ({ ...c, distance: euclideanDistance(userScores, c.elementScores || {}) }))
             .filter(c => c.distance !== Infinity)
             .sort((a, b) => a.distance - b.distance);
         filteredConcepts = conceptsWithDistance.slice(0, 12); // Show top 12 overall initially
         if(filteredConcepts.length > 0) resultsInstructionP.textContent = "Showing top overall matches. Select elements to filter.";


    } else if (selectedElements.length === 1) {
        const el1 = selectedElements[0];
        resultsInstructionP.textContent = `Showing concepts strong in: ${el1}`;
        filteredConcepts = concepts.filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold);
    } else if (selectedElements.length === 2) {
        const el1 = selectedElements[0];
        const el2 = selectedElements[1];
        resultsInstructionP.textContent = `Showing concepts strong in: ${el1} AND ${el2}`;
        filteredConcepts = concepts.filter(c =>
            c.elementScores &&
            c.elementScores[el1] >= scoreThreshold &&
            c.elementScores[el2] >= scoreThreshold
        );
    }

    // Optional: Sort filtered results by relevance (distance)
    filteredConcepts.sort((a, b) => {
        const distA = euclideanDistance(userScores, a.elementScores || {});
        const distB = euclideanDistance(userScores, b.elementScores || {});
        return distA - distB;
    });

    if (filteredConcepts.length === 0 && selectedElements.length > 0) {
        resultsBenchDiv.innerHTML = '<p>No specific concepts strongly match this combination in the database.</p>';
    } else if (filteredConcepts.length === 0 && selectedElements.length === 0) {
         resultsBenchDiv.innerHTML = '<p>Select elements to begin discovering concepts.</p>'; // Message when no initial concepts shown
    }
    else {
        filteredConcepts.forEach(concept => {
            const potionCard = document.createElement('div');
            potionCard.classList.add('potion-card');
            potionCard.dataset.conceptId = concept.id;
            potionCard.innerHTML = ` <h4>${concept.name}</h4> <p>(${concept.type})</p> `;
            potionCard.addEventListener('click', () => showConceptDetailPopup(concept.id));
            resultsBenchDiv.appendChild(potionCard);
        });
    }
}

// --- Utility - Euclidean Distance (Handle object input) ---
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


// --- Concept Detail Pop-up (Recipe View) ---
function showConceptDetailPopup(conceptId) { /* ... Same as before ... */
     currentlyDisplayedConceptId = conceptId; const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData || !conceptData.elementScores) return; popupConceptName.textContent = conceptData.name; popupConceptType.textContent = conceptData.type; popupConceptProfile.innerHTML = '';
    elementNames.forEach((element) => { const score = conceptData.elementScores[element]; const barWidth = (score / 10) * 100; popupConceptProfile.innerHTML += `<div><strong>${element}:</strong><span>${score.toFixed(1)}</span><div class="score-bar-container" style="height: 10px; max-width: 100px; display: inline-block; margin-left: 10px; vertical-align: middle;"><div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div></div></div>`; });
    popupOverlay.classList.remove('hidden'); conceptDetailPopup.classList.remove('hidden');
}

function hideConceptDetailPopup() { /* ... Same as before ... */
    conceptDetailPopup.classList.add('hidden'); popupOverlay.classList.add('hidden'); currentlyDisplayedConceptId = null;
}

// --- Utility functions for color manipulation ---
function hexToRgb(hex) { /* ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }


// --- Reset App ---
function resetApp() {
     currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; selectedElements = []; currentlyDisplayedConceptId = null; hideConceptDetailPopup();
     showScreen('welcomeScreen');
}

// --- Event Listeners ---
startButton.addEventListener('click', initializeQuestionnaire);
nextElementButton.addEventListener('click', nextElement);
prevElementButton.addEventListener('click', prevElement);
restartButton.addEventListener('click', resetApp);
closePopupButton.addEventListener('click', hideConceptDetailPopup);
popupOverlay.addEventListener('click', hideConceptDetailPopup);
clearSelectionButton.addEventListener('click', clearElementSelection);
// Removed listeners for map, find similar, what if, refine, quests

// --- Initial Setup ---
showScreen('welcomeScreen');
