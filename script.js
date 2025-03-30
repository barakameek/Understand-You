// --- Global State ---
let currentElementIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
let currentElementAnswers = {};
let selectedElements = [];
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Set();
let elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };

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
const mainNavBar = document.getElementById('mainNavBar');
const navButtons = document.querySelectorAll('.nav-button');
const personaScreen = document.getElementById('personaScreen');
const personaProfileScoresDiv = document.getElementById('personaProfileScores');
const personaThemesList = document.getElementById('personaThemesList');
const personaCoreConceptsList = document.getElementById('personaCoreConceptsList');
const restartButtonPersona = document.getElementById('restartButtonPersona'); // Only this restart button exists now
const labScreen = document.getElementById('labScreen');
const grimoireCountSpan = document.getElementById('grimoireCount'); // Moved access here
const elementVialsDiv = document.getElementById('elementVials');
const clearSelectionButton = document.getElementById('clearSelectionButton');
const resultsBenchDiv = document.getElementById('conceptResults');
const mixingStatusDiv = document.getElementById('mixingStatus');
// const restartButtonLab = document.getElementById('restartButton'); // REMOVED - No longer exists
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireContentDiv = document.getElementById('grimoireContent');
// Popup elements
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupResonanceSummary = document.getElementById('popupResonanceSummary');
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupRelatedConceptsList = document.getElementById('relatedConceptsList');
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');

// --- Core Functions ---

function showScreen(screenId) { /* ... Same ... */
    let targetIsMain = ['personaScreen', 'labScreen', 'grimoireScreen'].includes(screenId);
    screens.forEach(screen => {
        screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden');
        screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current');
    });
    mainNavBar.classList.toggle('hidden', !targetIsMain);
     navButtons.forEach(button => {
         button.classList.toggle('active', button.dataset.target === screenId);
     });
    if (screenId === 'questionnaireScreen' || screenId === 'grimoireScreen') { window.scrollTo(0, 0); }
}

function initializeQuestionnaire() { /* ... Same ... */
    currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; elementNames.forEach(el => userAnswers[el] = {}); discoveredConcepts = new Set(); elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; updateElementProgressHeader(-1); displayElementQuestions(currentElementIndex); showScreen('questionnaireScreen'); mainNavBar.classList.add('hidden'); // Hide nav during questionnaire
}

function updateElementProgressHeader(activeIndex) { /* ... Same ... */
    elementProgressHeader.innerHTML = ''; elementNames.forEach((name, index) => { const tab = document.createElement('div'); tab.classList.add('element-tab'); tab.textContent = name.substring(0, 3).toUpperCase(); tab.title = name; if (index < activeIndex) tab.classList.add('completed'); else if (index === activeIndex) tab.classList.add('active'); elementProgressHeader.appendChild(tab); });
}

function enforceMaxChoices(name, max, event) { /* ... Same ... */
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`); if (checkboxes.length > max) { alert(`You can only select up to ${max} options.`); if (event && event.target && event.target.checked) event.target.checked = false; }
}

function displayElementQuestions(index) { /* ... Same ... */
     if (index >= elementNames.length) { finalizeScoresAndShowPersona(); return; } const element = elementNames[index]; const questions = questionnaireGuided[element] || []; updateElementProgressHeader(index); progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${element}`; questionContent.innerHTML = `<div class="element-intro"><h2>${element}</h2><p>${elementExplanations[element]}</p></div>`; currentElementAnswers = { ...(userAnswers[element] || {}) };
    questions.forEach(q => { let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`; const savedAnswer = currentElementAnswers[q.qId];
    if (q.type === "slider") { const currentValue = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"> <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${currentValue}" data-question-id="${q.qId}" data-type="slider"> <div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div> <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(currentValue).toFixed(1)}</span></p> </div>`; }
    else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const isChecked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
    else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const isChecked = savedAnswer?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
    inputHTML += `</div></div>`; questionContent.innerHTML += inputHTML; });
    questionContent.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.addEventListener(eventType, handleQuestionnaireInputChange); }); updateDynamicFeedback(element); dynamicScoreFeedback.style.display = 'block'; prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}

function handleQuestionnaireInputChange(event) { /* ... Same ... */
     const input = event.target; const qId = input.dataset.questionId; const type = input.dataset.type; const element = elementNames[currentElementIndex];
    if (type === 'checkbox') { enforceMaxChoices(input.name, parseInt(input.dataset.maxChoices || 2), event); } if (type === 'slider') { document.getElementById(`display_${qId}`).textContent = parseFloat(input.value).toFixed(1); } collectCurrentElementAnswers(); updateDynamicFeedback(element);
}

function collectCurrentElementAnswers() { /* ... Same ... */
    const element = elementNames[currentElementIndex]; const questions = questionnaireGuided[element] || []; currentElementAnswers = {};
    questions.forEach(q => { if (q.type === 'slider') { const input = document.getElementById(q.qId); if (input) currentElementAnswers[q.qId] = parseFloat(input.value); } else if (q.type === 'radio') { const checked = document.querySelector(`input[name="${q.qId}"]:checked`); if (checked) currentElementAnswers[q.qId] = checked.value; } else if (q.type === 'checkbox') { const checked = document.querySelectorAll(`input[name="${q.qId}"]:checked`); currentElementAnswers[q.qId] = Array.from(checked).map(cb => cb.value); } });
    userAnswers[element] = { ...currentElementAnswers };
}

function updateDynamicFeedback(element) { /* ... Same ... */
    const tempScore = calculateElementScore(element, currentElementAnswers); feedbackElementSpan.textContent = element; feedbackScoreSpan.textContent = tempScore.toFixed(1); feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

function calculateElementScore(element, answersForElement) { /* ... Same ... */
    const questions = questionnaireGuided[element] || []; let score = 5.0;
    questions.forEach(q => { const answer = answersForElement[q.qId]; let pointsToAdd = 0; if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); } else if (q.type === 'radio') { const selectedOption = q.options.find(opt => opt.value === answer); pointsToAdd = selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; } else if (q.type === 'checkbox' && answer) { answer.forEach(val => { const selectedOption = q.options.find(opt => opt.value === val); pointsToAdd += selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; }); } score += pointsToAdd; });
    return Math.max(0, Math.min(10, score));
}

// --- Finalize and Show PERSONA screen first ---
function finalizeScoresAndShowPersona() { /* ... Same as before ... */
     console.log("Finalizing scores..."); elementNames.forEach(element => { userScores[element] = calculateElementScore(element, userAnswers[element] || {}); }); console.log("Final User Scores:", userScores);
     displayPersonaScreen(); // Display the persona screen contents
     displayElementVials(); // Prepare vials for lab screen (can be done later too)
     filterAndDisplayConcepts(); // Prepare initial lab results (can be done later too)
     updateGrimoireCounter(); populateGrimoireFilter();
     showScreen('personaScreen'); // Show Persona Screen FIRST
}

function nextElement() { collectCurrentElementAnswers(); currentElementIndex++; displayElementQuestions(currentElementIndex); }
function prevElement() { collectCurrentElementAnswers(); currentElementIndex--; displayElementQuestions(currentElementIndex); }

// --- Display Persona Screen ---
function displayPersonaScreen() { /* ... Same as before ... */
    personaProfileScoresDiv.innerHTML = ''; elementNames.forEach(element => { const score = userScores[element]; const barWidth = score * 10; personaProfileScoresDiv.innerHTML += `<div><strong>${element}:</strong><span>${score.toFixed(1)}</span><div class="score-bar-container" style="height: 10px; max-width: 150px; display: inline-block; margin-left: 10px; vertical-align: middle;"><div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div></div></div>`; });
    synthesizeAndDisplayThemes(); personaCoreConceptsList.innerHTML = '<li>Mark concepts in the Grimoire as "Core" (Feature coming soon!)</li>';
}

// --- Synthesize Themes ---
function synthesizeAndDisplayThemes() { /* ... Same as before ... */
     personaThemesList.innerHTML = ''; if (discoveredConcepts.size === 0) { personaThemesList.innerHTML = '<li>Explore the Lab and add discoveries to your Grimoire to see themes here.</li>'; return; }
     const elementCounts = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; const threshold = 7.0;
     discoveredConcepts.forEach(conceptId => { const concept = concepts.find(c => c.id === conceptId); if (concept && concept.elementScores) { elementNames.forEach(el => { if (concept.elementScores[el] >= threshold) { elementCounts[el]++; } }); } });
     const sortedThemes = Object.entries(elementCounts).filter(([el, count]) => count > 0).sort(([, countA], [, countB]) => countB - countA);
    if (sortedThemes.length === 0) { personaThemesList.innerHTML = '<li>No strong elemental themes identified in your Grimoire yet.</li>'; return; }
     sortedThemes.slice(0, 3).forEach(([element, count]) => { const li = document.createElement('li'); li.textContent = `Prominent Theme: ${element} (Found in ${count} discovered concepts)`; personaThemesList.appendChild(li); });
}

// --- Lab Screen Functions ---
function displayElementVials() { /* ... Same logic, includes title attribute ... */
    elementVialsDiv.innerHTML = ''; selectedElements = []; clearSelectionButton.classList.add('hidden');
    elementNames.forEach(element => { const score = userScores[element]; const vial = document.createElement('div'); vial.classList.add('vial'); vial.dataset.element = element; vial.title = elementExplanations[element] || element; vial.innerHTML = ` <div class="vial-icon"><div class="vial-liquid" style="height: ${score * 10}%; background-color: ${getElementColor(element)};"></div></div> <div class="vial-label"><span class="vial-name">${element}</span> <span class="vial-score">Score: ${score.toFixed(1)}</span></div> `; vial.addEventListener('click', handleVialClick); elementVialsDiv.appendChild(vial); });
}
function getElementColor(elementName) { /* ... */ const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' }; return colors[elementName] || '#CCCCCC'; }
function handleVialClick(event) { /* ... Includes Attunement log ... */
    const clickedVial = event.currentTarget; const element = clickedVial.dataset.element; elementAttunement[element]++; console.log(`Attunement for ${element}: ${elementAttunement[element]}`); if (selectedElements.includes(element)) { selectedElements = selectedElements.filter(el => el !== element); clickedVial.classList.remove('selected'); } else if (selectedElements.length < 2) { selectedElements.push(element); clickedVial.classList.add('selected'); } else { alert("You can only select up to two elements to combine."); return; } updateVialStates(); updateMixingStatus(); filterAndDisplayConcepts(); clearSelectionButton.classList.toggle('hidden', selectedElements.length === 0);
}
function updateVialStates() { /* ... */ const vials = elementVialsDiv.querySelectorAll('.vial'); const maxSelected = selectedElements.length >= 2; vials.forEach(vial => { const isSelected = vial.classList.contains('selected'); vial.classList.toggle('disabled', maxSelected && !isSelected); }); }
function updateMixingStatus() { /* ... */ let statusHTML = "<strong>Mixing:</strong> "; if (selectedElements.length === 0) { statusHTML += "<i>None Selected - Showing Top Overall Matches</i>"; } else { statusHTML += selectedElements.map(el => `<span class="status-element" style="border-color:${getElementColor(el)}; color:${getElementColor(el)}; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid ${getElementColor(el)}; margin:0 5px;">${el}</span>`).join(' + '); } mixingStatusDiv.innerHTML = statusHTML; }
function clearElementSelection() { /* ... */ selectedElements = []; updateVialStates(); updateMixingStatus(); filterAndDisplayConcepts(); clearSelectionButton.classList.add('hidden'); elementVialsDiv.querySelectorAll('.vial.selected').forEach(v => v.classList.remove('selected')); }
function filterAndDisplayConcepts() { /* ... Includes weighted sorting and resonance indicator */
    resultsBenchDiv.innerHTML = ''; let filteredConcepts = []; const scoreThreshold = 5.5; const userRelevanceWeight = 0.3; let conceptsWithDistance = concepts.map(c => ({ ...c, distance: euclideanDistance(userScores, c.elementScores || {}) })).filter(c => c.distance !== Infinity);
    if (selectedElements.length === 0) { filteredConcepts = conceptsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 15); }
    else if (selectedElements.length === 1) { const el1 = selectedElements[0]; filteredConcepts = conceptsWithDistance.filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold).sort((a, b) => { const scoreA = a.elementScores[el1]; const scoreB = b.elementScores[el1]; if (scoreB !== scoreA) return scoreB - scoreA; return a.distance - b.distance; }); }
    else if (selectedElements.length === 2) { const el1 = selectedElements[0]; const el2 = selectedElements[1]; filteredConcepts = conceptsWithDistance.filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold && c.elementScores[el2] >= scoreThreshold).sort((a, b) => { const scoreA = (a.elementScores[el1] + a.elementScores[el2]) * (1 - userRelevanceWeight) + (30 - a.distance) * userRelevanceWeight; const scoreB = (b.elementScores[el1] + b.elementScores[el2]) * (1 - userRelevanceWeight) + (30 - b.distance) * userRelevanceWeight; return scoreB - scoreA; }); }
    updateMixingStatus(); // Ensure status is updated
    if (filteredConcepts.length === 0) { resultsBenchDiv.innerHTML = selectedElements.length > 0 ? '<p>No concepts strongly match this specific combination.</p>' : '<p>Select elements to begin discovering concepts.</p>'; }
    else { filteredConcepts.slice(0, 24).forEach(concept => { const potionCard = document.createElement('div'); potionCard.classList.add('potion-card'); potionCard.dataset.conceptId = concept.id; let resonanceClass = 'resonance-low'; let resonanceText = 'Low'; if (concept.distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'High'; } else if (concept.distance < 16) { resonanceClass = 'resonance-medium'; resonanceText = 'Mid'; } potionCard.innerHTML = `<span class="resonance-indicator ${resonanceClass}" title="Overall match to your profile">${resonanceText}</span> <h4>${concept.name}</h4> <p class="concept-type">(${concept.type})</p> `; potionCard.addEventListener('click', () => showConceptDetailPopup(concept.id)); resultsBenchDiv.appendChild(potionCard); }); }
}
function euclideanDistance(profile1, profile2) { /* ... */ let sum = 0; for (let i = 0; i < elementNames.length; i++) { const key = elementNames[i]; const score1 = profile1[key] ?? 5; const score2 = profile2[key] ?? 5; sum += Math.pow(score1 - score2, 2); } return Math.sqrt(sum); }

// --- Concept Detail Pop-up ---
function showConceptDetailPopup(conceptId) {
    currentlyDisplayedConceptId = conceptId;
    const conceptData = concepts.find(c => c.id === conceptId);
    if (!conceptData || !conceptData.elementScores) return;

    popupConceptName.textContent = conceptData.name;
    popupConceptType.textContent = conceptData.type;
    popupComparisonHighlights.innerHTML = '';
    popupConceptProfile.innerHTML = '';
    popupRelatedConceptsList.innerHTML = '';

    // Resonance Summary
    const distance = euclideanDistance(userScores, conceptData.elementScores);
    let resonanceClass = 'resonance-low'; let resonanceText = 'Low Match';
    if (distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'Good Match'; }
    else if (distance < 16) { resonanceClass = 'resonance-medium'; resonanceText = 'Okay Match'; }
    popupResonanceSummary.innerHTML = `Overall Match: <span class="resonance-indicator ${resonanceClass}">${resonanceText}</span>`;

    // Key Alignments / Differences
    let highlightsHTML = ''; const diffThreshold = 2.5; const alignThreshold = 1.5;
    let matches = []; let mismatches = [];
    elementNames.forEach((element) => {
        const cScore = conceptData.elementScores[element]; const uScore = userScores[element]; const diff = uScore - cScore;
        if (Math.abs(diff) <= alignThreshold) matches.push(element);
        else if (Math.abs(diff) >= diffThreshold) mismatches.push({ element: element, diff: diff });
        // Populate full recipe inside details
        const barWidth = (cScore / 10) * 100; popupConceptProfile.innerHTML += `<div><strong>${element}:</strong><span>${cScore.toFixed(1)}</span><div class="score-bar-container" style="height: 8px; max-width: 80px; display: inline-block; margin-left: 8px; vertical-align: middle;"><div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div></div></div>`;
    });
    if (matches.length > 0) highlightsHTML += `<p><strong class="match">Strong Alignment In:</strong> ${matches.join(', ')}</p>`;
    if (mismatches.length > 0) { mismatches.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)); highlightsHTML += `<p><strong class="mismatch">Key Difference In:</strong> ${mismatches[0].element} ${mismatches[0].diff > 0 ? '(Your score higher)' : '(Concept score higher)'}${mismatches.length > 1 ? ', ...' : ''}</p>`; }
    if (!highlightsHTML) highlightsHTML = "<p>Profile alignment is generally moderate.</p>";
    popupComparisonHighlights.innerHTML = highlightsHTML;

    // Display Related Concepts
    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) { conceptData.relatedIds.forEach(relId => { const relatedConcept = concepts.find(c => c.id === relId); if (relatedConcept) { const li = document.createElement('li'); li.textContent = relatedConcept.name; li.dataset.conceptId = relId; li.addEventListener('click', handleRelatedConceptClick); popupRelatedConceptsList.appendChild(li); } }); }
    else { popupRelatedConceptsList.innerHTML = '<li>None specified</li>'; }

    updateGrimoireButtonStatus(conceptId);
    popupOverlay.classList.remove('hidden'); conceptDetailPopup.classList.remove('hidden');
    recordElementAttunementFromConcept(conceptData.elementScores);
}
function hideConceptDetailPopup() { /* ... */ conceptDetailPopup.classList.add('hidden'); popupOverlay.classList.add('hidden'); currentlyDisplayedConceptId = null; }
function handleRelatedConceptClick(event) { /* ... */ const newConceptId = parseInt(event.target.dataset.conceptId); if (newConceptId) { hideConceptDetailPopup(); setTimeout(() => showConceptDetailPopup(newConceptId), 50); } }

// --- Grimoire Functions ---
function addToGrimoire() { /* ... */ if (currentlyDisplayedConceptId !== null) { discoveredConcepts.add(currentlyDisplayedConceptId); console.log(`Added ${currentlyDisplayedConceptId}`); updateGrimoireCounter(); updateGrimoireButtonStatus(currentlyDisplayedConceptId); synthesizeAndDisplayThemes(); } } // Update themes on add
function updateGrimoireCounter() { /* ... */ grimoireCountSpan.textContent = discoveredConcepts.size; }
function displayGrimoire(filterElement = "All") { /* ... Same logic as before ... */
    grimoireContentDiv.innerHTML = ''; if (discoveredConcepts.size === 0) { grimoireContentDiv.innerHTML = '<p>You haven\'t discovered any concepts yet. Explore the lab!</p>'; showScreen('grimoireScreen'); return; }
    const grouped = {}; elementNames.forEach(el => grouped[el] = []); let discoveredArray = []; discoveredConcepts.forEach(id => { const concept = concepts.find(c => c.id === id); if (concept) discoveredArray.push(concept); });
    const conceptsToDisplay = (filterElement === "All") ? discoveredArray : discoveredArray.filter(c => elementKeyToName[c.primaryElement] === filterElement);
     if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p>No discovered concepts match the filter "${filterElement}".</p>`; showScreen('grimoireScreen'); return; }
    conceptsToDisplay.forEach(concept => { const primaryEl = elementKeyToName[concept.primaryElement] || "Other"; if (!grouped[primaryEl]) grouped[primaryEl] = []; grouped[primaryEl].push(concept); });
    elementNames.forEach(element => { if (grouped[element] && grouped[element].length > 0) { let sectionHTML = `<div class="grimoire-section"><h3>${element} Concepts</h3>`; grouped[element].sort((a,b) => a.name.localeCompare(b.name)).forEach(concept => { sectionHTML += `<div class="grimoire-entry"><strong>${concept.name}</strong> <span>(${concept.type})</span></div>`; }); sectionHTML += `</div>`; grimoireContentDiv.innerHTML += sectionHTML; } });
    showScreen('grimoireScreen');
 }
function updateGrimoireButtonStatus(conceptId) { /* ... */ if (discoveredConcepts.has(conceptId)) { addToGrimoireButton.textContent = "In Grimoire"; addToGrimoireButton.disabled = true; addToGrimoireButton.classList.add('added'); } else { addToGrimoireButton.textContent = "Add to Grimoire"; addToGrimoireButton.disabled = false; addToGrimoireButton.classList.remove('added'); } }
function populateGrimoireFilter() { /* ... Same as before ... */
    grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(el => { const option = document.createElement('option'); option.value = el; option.textContent = el; grimoireElementFilter.appendChild(option); });
}

// --- Element Attunement ---
function recordElementAttunementFromConcept(elementScores) { /* ... */ elementNames.forEach(el => { if (elementScores[el] >= 7) { elementAttunement[el] += 0.5; console.log(`Attunement ++ for ${el} via concept: ${elementAttunement[el].toFixed(1)}`); } }); }

// --- Utility functions ---
function hexToRgb(hex) { /* ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }

// --- Reset App ---
function resetApp() { /* ... includes Grimoire/Attunement reset */
     currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; selectedElements = []; currentlyDisplayedConceptId = null; discoveredConcepts = new Set(); elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; hideConceptDetailPopup(); showScreen('welcomeScreen'); mainNavBar.classList.add('hidden');
}

// --- Event Listeners ---
startButton.addEventListener('click', initializeQuestionnaire);
nextElementButton.addEventListener('click', nextElement);
prevElementButton.addEventListener('click', prevElement);
// Nav Bar listeners
navButtons.forEach(button => {
    button.addEventListener('click', () => {
         // Update persona/grimoire data if needed before showing
         if (button.dataset.target === 'personaScreen') displayPersonaScreen();
         if (button.dataset.target === 'grimoireScreen') displayGrimoire(); // Refresh grimoire view
         showScreen(button.dataset.target);
    });
});
restartButtonPersona.addEventListener('click', resetApp); // Restart from Persona screen
// restartButtonLab removed
closePopupButton.addEventListener('click', hideConceptDetailPopup);
popupOverlay.addEventListener('click', hideConceptDetailPopup);
clearSelectionButton.addEventListener('click', clearElementSelection);
addToGrimoireButton.addEventListener('click', addToGrimoire);
grimoireElementFilter.addEventListener('change', (e) => displayGrimoire(e.target.value));
// Removed listeners for map clicks, find similar, what if, refine, quests, closeGrimoireButton

// --- Initial Setup ---
showScreen('welcomeScreen');
