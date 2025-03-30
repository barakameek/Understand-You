// --- Global State ---
let currentElementIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
let currentElementAnswers = {};
let selectedElements = [];
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Set();
let coreConcepts = new Set();
let elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
let elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };

// --- DOM Elements ---
// ... (Same as previous version - full list) ...
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startGuidedButton');
const questionnaireScreen = document.getElementById('questionnaireScreen');
const elementProgressHeader = document.getElementById('elementProgressHeader');
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const dynamicScoreFeedback = document.getElementById('dynamicScoreFeedback');
const feedbackElementSpan = document.getElementById('feedbackElement');
const feedbackScoreSpan = document.getElementById('feedbackScore');
// const feedbackScoreLabel = dynamicScoreFeedback.querySelector('.score-label'); // Get dynamically
const feedbackScoreBar = document.getElementById('feedbackScoreBar');
const prevElementButton = document.getElementById('prevElementButton');
const nextElementButton = document.getElementById('nextElementButton');
const mainNavBar = document.getElementById('mainNavBar');
const navButtons = document.querySelectorAll('.nav-button');
const personaScreen = document.getElementById('personaScreen');
const personaProfileScoresDiv = document.getElementById('personaProfileScores');
const elementEssenceDisplay = document.getElementById('elementEssenceDisplay');
const personaThemesList = document.getElementById('personaThemesList');
const personaCoreConceptsList = document.getElementById('personaCoreConceptsList');
const restartButtonPersona = document.getElementById('restartButtonPersona');
const labScreen = document.getElementById('labScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const elementVialsDiv = document.getElementById('elementVials');
const clearSelectionButton = document.getElementById('clearSelectionButton');
const resultsBenchDiv = document.getElementById('conceptResults');
const mixingStatusDiv = document.getElementById('mixingStatus');
const restartButtonLab = document.getElementById('restartButton'); // Now exists on lab screen too via persona restart button ID
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireContentDiv = document.getElementById('grimoireContent');
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
const markAsCoreButton = document.getElementById('markAsCoreButton');


// --- Utility & Setup Functions ---

// *** ADDED euclideanDistance function ***
function euclideanDistance(profile1, profile2) {
    let sum = 0;
    for (let i = 0; i < elementNames.length; i++) {
        const key = elementNames[i];
        // Use ?? 5 to provide a default score if a key is missing in either profile object
        const score1 = profile1[key] ?? 5;
        const score2 = profile2[key] ?? 5;
        sum += Math.pow(score1 - score2, 2);
    }
    return Math.sqrt(sum);
}

function getScoreLabel(score) { /* ... */ if (score >= 9) return "Very High"; if (score >= 7) return "High"; if (score >= 5) return "Moderate"; if (score >= 3) return "Low"; return "Very Low"; }
function showScreen(screenId) { /* ... */ let targetIsMain = ['personaScreen', 'labScreen', 'grimoireScreen'].includes(screenId); screens.forEach(screen => { screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden'); screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current'); }); mainNavBar.classList.toggle('hidden', !targetIsMain); navButtons.forEach(button => { button.classList.toggle('active', button.dataset.target === screenId); }); if (screenId === 'questionnaireScreen' || screenId === 'grimoireScreen') { window.scrollTo(0, 0); } }
function initializeQuestionnaire() { /* ... */ currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; elementNames.forEach(el => userAnswers[el] = {}); discoveredConcepts = new Set(); coreConcepts = new Set(); elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; updateElementProgressHeader(-1); displayElementQuestions(currentElementIndex); showScreen('questionnaireScreen'); mainNavBar.classList.add('hidden'); }
function updateElementProgressHeader(activeIndex) { /* ... */ elementProgressHeader.innerHTML = ''; elementNames.forEach((name, index) => { const tab = document.createElement('div'); tab.classList.add('element-tab'); tab.textContent = name.substring(0, 3).toUpperCase(); tab.title = name; if (index < activeIndex) tab.classList.add('completed'); else if (index === activeIndex) tab.classList.add('active'); elementProgressHeader.appendChild(tab); }); }
function enforceMaxChoices(name, max, event) { /* ... */ const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`); if (checkboxes.length > max) { alert(`You can only select up to ${max} options.`); if (event && event.target && event.target.checked) event.target.checked = false; } }

function displayElementQuestions(index) { /* ... Same logic using getScoreLabel in feedback ... */
     if (index >= elementNames.length) { finalizeScoresAndShowPersona(); return; } const element = elementNames[index]; const questions = questionnaireGuided[element] || []; updateElementProgressHeader(index); progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${element}`; questionContent.innerHTML = `<div class="element-intro"><h2>${element}</h2><p>${elementExplanations[element]}</p></div>`; currentElementAnswers = { ...(userAnswers[element] || {}) };
    questions.forEach(q => { let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`; const savedAnswer = currentElementAnswers[q.qId];
    if (q.type === "slider") { const currentValue = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"> <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${currentValue}" data-question-id="${q.qId}" data-type="slider"> <div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div> <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(currentValue).toFixed(1)}</span></p> </div>`; }
    else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const isChecked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
    else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const isChecked = savedAnswer?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
    inputHTML += `</div></div>`; questionContent.innerHTML += inputHTML; });
    questionContent.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.addEventListener(eventType, handleQuestionnaireInputChange); });
    updateDynamicFeedback(element); // Initial update
    dynamicScoreFeedback.style.display = 'block'; prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}

function handleQuestionnaireInputChange(event) { /* ... Same ... */ const input = event.target; const qId = input.dataset.questionId; const type = input.dataset.type; const element = elementNames[currentElementIndex]; if (type === 'checkbox') { enforceMaxChoices(input.name, parseInt(input.dataset.maxChoices || 2), event); } if (type === 'slider') { document.getElementById(`display_${qId}`).textContent = parseFloat(input.value).toFixed(1); } collectCurrentElementAnswers(); updateDynamicFeedback(element); }
function collectCurrentElementAnswers() { /* ... Same ... */ const element = elementNames[currentElementIndex]; const questions = questionnaireGuided[element] || []; currentElementAnswers = {}; questions.forEach(q => { if (q.type === 'slider') { const input = document.getElementById(q.qId); if (input) currentElementAnswers[q.qId] = parseFloat(input.value); } else if (q.type === 'radio') { const checked = document.querySelector(`input[name="${q.qId}"]:checked`); if (checked) currentElementAnswers[q.qId] = checked.value; } else if (q.type === 'checkbox') { const checked = document.querySelectorAll(`input[name="${q.qId}"]:checked`); currentElementAnswers[q.qId] = Array.from(checked).map(cb => cb.value); } }); userAnswers[element] = { ...currentElementAnswers }; }

// Update Dynamic Feedback includes label now
function updateDynamicFeedback(element) {
    const tempScore = calculateElementScore(element, currentElementAnswers);
    feedbackElementSpan.textContent = element;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);
    let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
    if (!labelSpan) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling); feedbackScoreSpan.parentNode.insertBefore(document.createTextNode(' '), labelSpan); }
    labelSpan.textContent = `(${getScoreLabel(tempScore)})`;
    feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

function calculateElementScore(element, answersForElement) { /* ... Same ... */ const questions = questionnaireGuided[element] || []; let score = 5.0; questions.forEach(q => { const answer = answersForElement[q.qId]; let pointsToAdd = 0; if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); } else if (q.type === 'radio') { const selectedOption = q.options.find(opt => opt.value === answer); pointsToAdd = selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; } else if (q.type === 'checkbox' && answer) { answer.forEach(val => { const selectedOption = q.options.find(opt => opt.value === val); pointsToAdd += selectedOption ? selectedOption.points * (q.scoreWeight || 1.0) : 0; }); } score += pointsToAdd; }); return Math.max(0, Math.min(10, score)); }
function finalizeScoresAndShowPersona() { /* ... Same ... */ console.log("Finalizing scores..."); elementNames.forEach(element => { userScores[element] = calculateElementScore(element, userAnswers[element] || {}); }); console.log("Final User Scores:", userScores); displayPersonaScreen(); displayElementVials(); filterAndDisplayConcepts(); updateGrimoireCounter(); populateGrimoireFilter(); showScreen('personaScreen'); }
function nextElement() { /* ... */ collectCurrentElementAnswers(); currentElementIndex++; displayElementQuestions(currentElementIndex); }
function prevElement() { /* ... */ collectCurrentElementAnswers(); currentElementIndex--; displayElementQuestions(currentElementIndex); }

// --- Display Persona Screen ---
function displayPersonaScreen() { /* ... Includes qualitative labels and essence ... */
    personaProfileScoresDiv.innerHTML = ''; elementNames.forEach(element => { const score = userScores[element]; const barWidth = score * 10; personaProfileScoresDiv.innerHTML += `<div><strong>${element}:</strong><span>${score.toFixed(1)}</span><span class="score-label">(${getScoreLabel(score)})</span><div class="score-bar-container" style="height: 10px; max-width: 120px; display: inline-block; margin-left: 10px; vertical-align: middle;"><div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div></div></div>`; });
    displayElementEssence(); synthesizeAndDisplayThemes(); displayCoreConcepts();
}

// --- Display Element Essence ---
function displayElementEssence() { /* ... Same ... */
    elementEssenceDisplay.innerHTML = '<h4>Collected Essence</h4>'; elementNames.forEach(el => { const essenceValue = elementEssence[el].toFixed(1); elementEssenceDisplay.innerHTML += `<div class="essence-item"><span class="essence-icon" style="background-color: ${getElementColor(el)};"></span><span class="essence-name">${el}:</span><span class="essence-value">${essenceValue}</span></div>`; });
}

// --- Synthesize Themes ---
function synthesizeAndDisplayThemes() { /* ... Same ... */
     personaThemesList.innerHTML = ''; if (discoveredConcepts.size === 0) { personaThemesList.innerHTML = '<li>Explore the Lab and add discoveries to your Grimoire.</li>'; return; } const elementCounts = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; const threshold = 7.0; discoveredConcepts.forEach(id => { const concept = concepts.find(c => c.id === id); if (concept && concept.elementScores) { elementNames.forEach(el => { if (concept.elementScores[el] >= threshold) { elementCounts[el]++; } }); } }); const sortedThemes = Object.entries(elementCounts).filter(([el, count]) => count > 0).sort(([, countA], [, countB]) => countB - countA); if (sortedThemes.length === 0) { personaThemesList.innerHTML = '<li>No strong elemental themes identified yet.</li>'; return; } sortedThemes.slice(0, 3).forEach(([element, count]) => { const li = document.createElement('li'); li.textContent = `${element} Focus (from ${count} concepts)`; personaThemesList.appendChild(li); });
}

// --- Display Core Concepts ---
function displayCoreConcepts() { /* ... Same ... */
     personaCoreConceptsList.innerHTML = ''; if (coreConcepts.size === 0) { personaCoreConceptsList.innerHTML = '<li>Mark concepts as "Core" in their detail view.</li>'; return; } coreConcepts.forEach(conceptId => { const concept = concepts.find(c => c.id === conceptId); if (concept) { const li = document.createElement('li'); li.textContent = `${concept.name} (${concept.type})`; personaCoreConceptsList.appendChild(li); } });
}

// --- Lab Screen Functions ---
function displayElementVials() { /* ... Same, includes title attribute and resonance check ... */
    elementVialsDiv.innerHTML = ''; elementNames.forEach(element => { const score = userScores[element]; const vial = document.createElement('div'); vial.classList.add('vial'); vial.dataset.element = element; vial.title = elementExplanations[element] || element; if (selectedElements.includes(element)) { vial.classList.add('selected', 'resonating'); } vial.innerHTML = ` <div class="vial-icon"><div class="vial-liquid" style="height: ${score * 10}%; background-color: ${getElementColor(element)};"></div></div> <div class="vial-label"><span class="vial-name">${element}</span> <span class="vial-score">Score: ${score.toFixed(1)}</span></div> `; vial.addEventListener('click', handleVialClick); elementVialsDiv.appendChild(vial); });
}
function getElementColor(elementName) { /* ... */ const colors={Attraction:'#FF6347',Interaction:'#4682B4',Sensory:'#32CD32',Psychological:'#FFD700',Cognitive:'#8A2BE2',Relational:'#FF8C00'};return colors[elementName]||'#CCC'; }
function handleVialClick(event) { /* ... Includes Resonance/Attunement ... */
    const clickedVial = event.currentTarget; const element = clickedVial.dataset.element; elementAttunement[element]++; console.log(`Attunement for ${element}: ${elementAttunement[element]}`); clickedVial.classList.add('resonating'); setTimeout(() => { if (!selectedElements.includes(element)) { clickedVial.classList.remove('resonating'); } }, 1500); if (selectedElements.includes(element)) { selectedElements = selectedElements.filter(el => el !== element); clickedVial.classList.remove('selected', 'resonating'); } else if (selectedElements.length < 2) { selectedElements.push(element); clickedVial.classList.add('selected'); } else { alert("You can only select up to two elements to combine."); clickedVial.classList.remove('resonating'); return; } updateVialStates(); updateMixingStatus(); filterAndDisplayConcepts(); clearSelectionButton.classList.toggle('hidden', selectedElements.length === 0);
}
function updateVialStates() { /* ... Includes resonance handling ... */ const vials = elementVialsDiv.querySelectorAll('.vial'); const maxSelected = selectedElements.length >= 2; vials.forEach(vial => { const isSelected = vial.classList.contains('selected'); vial.classList.toggle('disabled', maxSelected && !isSelected); if (!isSelected) vial.classList.remove('resonating'); }); }
function updateMixingStatus() { /* ... Same ... */ let statusHTML = "<strong>Mixing:</strong> "; if (selectedElements.length === 0) { statusHTML += "<i>None Selected - Showing Top Overall Matches</i>"; } else { statusHTML += selectedElements.map(el => `<span class="status-element" style="border-color:${getElementColor(el)}; color:${getElementColor(el)}; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid ${getElementColor(el)}; margin:0 5px;">${el}</span>`).join(' + '); } mixingStatusDiv.innerHTML = statusHTML; }
function clearElementSelection() { /* ... Includes resonance reset ... */ selectedElements = []; updateVialStates(); updateMixingStatus(); filterAndDisplayConcepts(); clearSelectionButton.classList.add('hidden'); elementVialsDiv.querySelectorAll('.vial.selected, .vial.resonating').forEach(v => v.classList.remove('selected', 'resonating')); }
function filterAndDisplayConcepts() { /* ... Same weighted logic ... */
    resultsBenchDiv.innerHTML = ''; let filteredConcepts = []; const scoreThreshold = 5.5; const userRelevanceWeight = 0.3; let conceptsWithDistance = concepts.map(c => ({ ...c, distance: euclideanDistance(userScores, c.elementScores || {}) })).filter(c => c.distance !== Infinity);
    if (selectedElements.length === 0) { filteredConcepts = conceptsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 15); }
    else if (selectedElements.length === 1) { const el1 = selectedElements[0]; filteredConcepts = conceptsWithDistance.filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold).sort((a, b) => { const scoreA = a.elementScores[el1]; const scoreB = b.elementScores[el1]; if (scoreB !== scoreA) return scoreB - scoreA; return a.distance - b.distance; }); }
    else if (selectedElements.length === 2) { const el1 = selectedElements[0]; const el2 = selectedElements[1]; filteredConcepts = conceptsWithDistance.filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold && c.elementScores[el2] >= scoreThreshold).sort((a, b) => { const scoreA = (a.elementScores[el1] + a.elementScores[el2]) * (1 - userRelevanceWeight) + (30 - a.distance) * userRelevanceWeight; const scoreB = (b.elementScores[el1] + b.elementScores[el2]) * (1 - userRelevanceWeight) + (30 - b.distance) * userRelevanceWeight; return scoreB - scoreA; }); }
    updateMixingStatus();
    if (filteredConcepts.length === 0) { resultsBenchDiv.innerHTML = selectedElements.length > 0 ? '<p>No concepts strongly match this specific combination.</p>' : '<p>Select elements to begin discovering concepts.</p>'; }
    else { filteredConcepts.slice(0, 24).forEach(concept => { const potionCard = document.createElement('div'); potionCard.classList.add('potion-card'); potionCard.dataset.conceptId = concept.id; let resonanceClass = 'resonance-low'; let resonanceText = 'Low'; if (concept.distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'High'; } else if (concept.distance < 16) { resonanceClass = 'resonance-medium'; resonanceText = 'Mid'; } potionCard.innerHTML = `<span class="resonance-indicator ${resonanceClass}" title="Overall match to your profile">${resonanceText}</span> <h4>${concept.name}</h4> <p class="concept-type">(${concept.type})</p> `; potionCard.addEventListener('click', () => showConceptDetailPopup(concept.id)); resultsBenchDiv.appendChild(potionCard); }); }
}

// --- Concept Detail Pop-up (Simplified Comparison) ---
function showConceptDetailPopup(conceptId) { /* ... Same logic with qualitative labels ... */
    currentlyDisplayedConceptId = conceptId; const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData || !conceptData.elementScores) return; popupConceptName.textContent = conceptData.name; popupConceptType.textContent = conceptData.type; popupComparisonHighlights.innerHTML = ''; popupConceptProfile.innerHTML = ''; popupRelatedConceptsList.innerHTML = '';
    const distance = euclideanDistance(userScores, conceptData.elementScores); let resonanceClass = 'resonance-low'; let resonanceText = 'Low Match'; if (distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'Good Match'; } else if (distance < 16) { resonanceClass = 'resonance-medium'; resonanceText = 'Okay Match'; } popupResonanceSummary.innerHTML = `Overall Match: <span class="resonance-indicator ${resonanceClass}">${resonanceText}</span>`;
    let highlightsHTML = ''; const diffThreshold = 3.0; const alignThreshold = 1.5; let matches = []; let mismatches = [];
    elementNames.forEach((element) => { const cScore = conceptData.elementScores[element]; const uScore = userScores[element]; const diff = uScore - cScore; if (Math.abs(diff) <= alignThreshold) { matches.push(`**${element}** (${getScoreLabel(uScore)})`); } else if (Math.abs(diff) >= diffThreshold) { const comparison = diff > 0 ? `higher than concept's ${getScoreLabel(cScore)}` : `lower than concept's ${getScoreLabel(cScore)}`; mismatches.push({ element: element, diff: diff, text: `for **${element}**, your ${getScoreLabel(uScore)} is ${comparison}` }); } const barWidth = (cScore / 10) * 100; popupConceptProfile.innerHTML += `<div><strong>${element}:</strong><span>${cScore.toFixed(1)} (${getScoreLabel(cScore)})</span><div class="score-bar-container" style="/* styles */"><div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div></div></div>`; });
    if (matches.length > 0) highlightsHTML += `<p><strong class="match">Aligns Well With:</strong> Your ${matches.join(', ')} preference(s).</p>`;
    if (mismatches.length > 0) { mismatches.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)); highlightsHTML += `<p><strong class="mismatch">Key Difference:</strong> Notably, ${mismatches[0].text}.</p>`; if(mismatches.length > 1) { highlightsHTML += `<p><small>(Other differences noted in ${mismatches.slice(1).map(m => m.element).join(', ')}.)</small></p>`; } }
    if (!highlightsHTML) highlightsHTML = "<p>This concept has a moderate alignment across your elements.</p>"; popupComparisonHighlights.innerHTML = highlightsHTML;
    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) { conceptData.relatedIds.forEach(relId => { const relatedConcept = concepts.find(c => c.id === relId); if (relatedConcept) { const li = document.createElement('li'); li.textContent = relatedConcept.name; li.dataset.conceptId = relId; li.addEventListener('click', handleRelatedConceptClick); popupRelatedConceptsList.appendChild(li); } }); } else { popupRelatedConceptsList.innerHTML = '<li>None specified</li>'; }
    updateGrimoireButtonStatus(conceptId); updateCoreButtonStatus(conceptId); popupOverlay.classList.remove('hidden'); conceptDetailPopup.classList.remove('hidden'); recordElementAttunementFromConcept(conceptData.elementScores);
}

function hideConceptDetailPopup() { /* ... */ conceptDetailPopup.classList.add('hidden'); popupOverlay.classList.add('hidden'); currentlyDisplayedConceptId = null; }
function handleRelatedConceptClick(event) { /* ... */ const newConceptId = parseInt(event.target.dataset.conceptId); if (newConceptId) { hideConceptDetailPopup(); setTimeout(() => showConceptDetailPopup(newConceptId), 50); } }

// --- Grimoire Functions ---
function addToGrimoire() { /* ... Includes essence gain ... */ if (currentlyDisplayedConceptId !== null) { if(!discoveredConcepts.has(currentlyDisplayedConceptId)) { discoveredConcepts.add(currentlyDisplayedConceptId); const concept = concepts.find(c => c.id === currentlyDisplayedConceptId); if(concept && concept.elementScores) { elementNames.forEach(el => { elementEssence[el] += Math.max(0, concept.elementScores[el] - 4) * 0.1; }); console.log("Updated Essence:", elementEssence); displayElementEssence(); } updateGrimoireCounter(); updateGrimoireButtonStatus(currentlyDisplayedConceptId); synthesizeAndDisplayThemes(); } } }
function updateGrimoireCounter() { /* ... */ grimoireCountSpan.textContent = discoveredConcepts.size; }
function displayGrimoire(filterElement = "All", sortBy = "discovered") { /* ... Same logic ... */
     grimoireContentDiv.innerHTML = ''; if (discoveredConcepts.size === 0) { grimoireContentDiv.innerHTML = '<p>You haven\'t discovered any concepts yet.</p>'; showScreen('grimoireScreen'); return; } let discoveredArray = []; discoveredConcepts.forEach(id => { const concept = concepts.find(c => c.id === id); if (concept) discoveredArray.push({ ...concept, discoveredTime: Date.now() }); }); const conceptsToDisplay = (filterElement === "All") ? discoveredArray : discoveredArray.filter(c => elementKeyToName[c.primaryElement] === filterElement); if (sortBy === 'name') conceptsToDisplay.sort((a, b) => a.name.localeCompare(b.name)); else if (sortBy === 'type') conceptsToDisplay.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)); if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p>No discovered concepts match filter.</p>`; showScreen('grimoireScreen'); return; } const grouped = {}; elementNames.forEach(el => grouped[el] = []); conceptsToDisplay.forEach(concept => { const primaryEl = elementKeyToName[concept.primaryElement] || "Other"; if (!grouped[primaryEl]) grouped[primaryEl] = []; grouped[primaryEl].push(concept); }); elementNames.forEach(element => { if (grouped[element] && grouped[element].length > 0) { let sectionHTML = `<div class="grimoire-section"><h3>${element} Concepts</h3>`; grouped[element].forEach(concept => { sectionHTML += `<div class="grimoire-entry" data-concept-id="${concept.id}"><strong>${concept.name}</strong> <span>(${concept.type})</span></div>`; }); sectionHTML += `</div>`; grimoireContentDiv.innerHTML += sectionHTML; } }); grimoireContentDiv.querySelectorAll('.grimoire-entry').forEach(entry => { entry.addEventListener('click', () => { const conceptId = parseInt(entry.dataset.conceptId); showConceptDetailPopup(conceptId); }); }); showScreen('grimoireScreen');
}
function updateGrimoireButtonStatus(conceptId) { /* ... */ if (discoveredConcepts.has(conceptId)) { addToGrimoireButton.textContent = "In Grimoire"; addToGrimoireButton.disabled = true; addToGrimoireButton.classList.add('added'); } else { addToGrimoireButton.textContent = "Add to Grimoire"; addToGrimoireButton.disabled = false; addToGrimoireButton.classList.remove('added'); } }
function populateGrimoireFilter() { /* ... */ grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(el => { const option = document.createElement('option'); option.value = el; option.textContent = el; grimoireElementFilter.appendChild(option); }); }

// --- Core Concepts ---
function toggleCoreConcept() { /* ... Same ... */ if (currentlyDisplayedConceptId === null) return; if (coreConcepts.has(currentlyDisplayedConceptId)) { coreConcepts.delete(currentlyDisplayedConceptId); console.log(`Removed ${currentlyDisplayedConceptId}`); } else { if (coreConcepts.size >= 7) { alert("Max 7 Core Concepts."); return; } coreConcepts.add(currentlyDisplayedConceptId); console.log(`Added ${currentlyDisplayedConceptId}`); } updateCoreButtonStatus(currentlyDisplayedConceptId); displayCoreConcepts(); }
function updateCoreButtonStatus(conceptId) { /* ... Same ... */ if (coreConcepts.has(conceptId)) { markAsCoreButton.textContent = "Core Concept ★"; markAsCoreButton.classList.add('marked'); } else { markAsCoreButton.textContent = "Mark as Core"; markAsCoreButton.classList.remove('marked'); } markAsCoreButton.classList.toggle('hidden', !discoveredConcepts.has(conceptId)); }

// --- Element Attunement ---
function recordElementAttunementFromConcept(elementScores) { /* ... Updates Essence Display ... */ elementNames.forEach(el => { if (elementScores[el] >= 7) { elementAttunement[el] += 0.5; console.log(`Attunement ++ for ${el}: ${elementAttunement[el].toFixed(1)}`); } }); displayElementEssence(); }

// --- Utility - Color ---
function hexToRgb(hex) { /* ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }

// --- Reset App ---
function resetApp() { /* ... Includes coreConcepts reset */
     currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; selectedElements = []; currentlyDisplayedConceptId = null; discoveredConcepts = new Set(); coreConcepts = new Set(); elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; hideConceptDetailPopup(); showScreen('welcomeScreen'); mainNavBar.classList.add('hidden');
}

// --- Event Listeners ---
startButton.addEventListener('click', initializeQuestionnaire);
nextElementButton.addEventListener('click', nextElement);
prevElementButton.addEventListener('click', prevElement);
navButtons.forEach(button => button.addEventListener('click', () => { if (button.dataset.target === 'personaScreen') displayPersonaScreen(); if (button.dataset.target === 'grimoireScreen') displayGrimoire(); showScreen(button.dataset.target); }));
restartButtonPersona.addEventListener('click', resetApp);
closePopupButton.addEventListener('click', hideConceptDetailPopup);
popupOverlay.addEventListener('click', hideConceptDetailPopup);
clearSelectionButton.addEventListener('click', clearElementSelection);
addToGrimoireButton.addEventListener('click', addToGrimoire);
markAsCoreButton.addEventListener('click', toggleCoreConcept);
grimoireElementFilter.addEventListener('change', (e) => displayGrimoire(e.target.value, grimoireSortOrder.value));
grimoireSortOrder.addEventListener('change', (e) => displayGrimoire(grimoireElementFilter.value, e.target.value));

// --- Initial Setup ---
showScreen('welcomeScreen');
