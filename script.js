// --- Global State ---
let currentElementIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
let currentElementAnswers = {};
let selectedElements = []; // Track selected elements for mixing
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Set(); // Track discovered concept IDs for Grimoire
let elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; // Track interaction count

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
const viewGrimoireButton = document.getElementById('viewGrimoireButton');
const grimoireCountSpan = document.getElementById('grimoireCount');
const elementVialsDiv = document.getElementById('elementVials');
const clearSelectionButton = document.getElementById('clearSelectionButton');
const resultsBenchDiv = document.getElementById('conceptResults');
const mixingStatusDiv = document.getElementById('mixingStatus'); // Mixing status display
const resultsInstructionP = document.getElementById('resultsInstruction'); // Removed - replaced by mixingStatus
const restartButton = document.getElementById('restartButton');
const grimoireScreen = document.getElementById('grimoireScreen'); // Grimoire Screen
const closeGrimoireButton = document.getElementById('closeGrimoireButton');
const grimoireContentDiv = document.getElementById('grimoireContent');
// Popup elements
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile'); // Added for comparison
const popupRelatedConceptsList = document.getElementById('relatedConceptsList'); // Added for related
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton'); // Add to Grimoire button

// --- Core Functions ---

function showScreen(screenId) { /* ... Same as before ... */
    screens.forEach(screen => { screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden'); screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current'); });
    if (screenId === 'questionnaireScreen' || screenId === 'grimoireScreen') { window.scrollTo(0, 0); }
}

function initializeQuestionnaire() { /* ... Same as before ... */
    currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; elementNames.forEach(el => userAnswers[el] = {}); discoveredConcepts = new Set(); elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; updateElementProgressHeader(-1); displayElementQuestions(currentElementIndex); showScreen('questionnaireScreen');
}

function updateElementProgressHeader(activeIndex) { /* ... Same as before ... */
    elementProgressHeader.innerHTML = ''; elementNames.forEach((name, index) => { const tab = document.createElement('div'); tab.classList.add('element-tab'); tab.textContent = name.substring(0, 3).toUpperCase(); tab.title = name; if (index < activeIndex) tab.classList.add('completed'); else if (index === activeIndex) tab.classList.add('active'); elementProgressHeader.appendChild(tab); });
}

function enforceMaxChoices(name, max, event) { /* ... Same as before ... */
     const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`); if (checkboxes.length > max) { alert(`You can only select up to ${max} options.`); if (event && event.target && event.target.checked) event.target.checked = false; }
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
     console.log("Finalizing scores..."); elementNames.forEach(element => { userScores[element] = calculateElementScore(element, userAnswers[element] || {}); }); console.log("Final User Scores:", userScores); displayElementVials(); filterAndDisplayConcepts(); updateGrimoireCounter(); showScreen('labScreen');
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
    // --- Attunement Tracking ---
    elementAttunement[element]++;
    console.log(`Attunement for ${element}: ${elementAttunement[element]}`); // Log attunement increase
    // Check for potential unlocks/feedback based on attunement level here later
    // --- End Attunement Tracking ---
    if (selectedElements.includes(element)) { selectedElements = selectedElements.filter(el => el !== element); clickedVial.classList.remove('selected'); }
    else if (selectedElements.length < 2) { selectedElements.push(element); clickedVial.classList.add('selected'); }
    else { alert("You can only select up to two elements to combine."); return; }
    updateVialStates(); updateMixingStatus(); filterAndDisplayConcepts(); clearSelectionButton.classList.toggle('hidden', selectedElements.length === 0);
}

function updateVialStates() { /* ... Same as before ... */
    const vials = elementVialsDiv.querySelectorAll('.vial'); const maxSelected = selectedElements.length >= 2; vials.forEach(vial => { const isSelected = vial.classList.contains('selected'); vial.classList.toggle('disabled', maxSelected && !isSelected); });
}

// --- NEW: Update Mixing Status Display ---
function updateMixingStatus() {
    let statusHTML = "<strong>Mixing:</strong> ";
    if (selectedElements.length === 0) {
        statusHTML += "<i>None Selected</i>";
    } else {
        statusHTML += selectedElements.map(el => `<span class="status-element" style="border-color:${getElementColor(el)}; color:${getElementColor(el)};">${el}</span>`).join(' + ');
    }
    mixingStatusDiv.innerHTML = statusHTML;
    // Add inline styles for status elements if needed, or use CSS classes
     mixingStatusDiv.querySelectorAll('.status-element').forEach(el => {
         el.style.fontWeight = 'bold';
         el.style.padding = '2px 6px';
         el.style.borderRadius = '4px';
         el.style.border = `1px solid ${el.style.borderColor}`; // Use color for border
         el.style.marginLeft = '5px';
         el.style.marginRight = '5px';
     });
}


function clearElementSelection() { /* ... Same as before ... */
    selectedElements = []; updateVialStates(); updateMixingStatus(); filterAndDisplayConcepts(); clearSelectionButton.classList.add('hidden'); elementVialsDiv.querySelectorAll('.vial.selected').forEach(v => v.classList.remove('selected'));
}

// --- Weighted Filtering and Display ---
function filterAndDisplayConcepts() {
    resultsBenchDiv.innerHTML = '';
    let filteredConcepts = [];
    const scoreThreshold = 5.5; // Lower threshold slightly for weighted approach
    const userRelevanceWeight = 0.3; // How much user's overall profile match matters (0 to 1)

    // Calculate overall distance for all concepts first
    let conceptsWithDistance = concepts.map(c => ({
        ...c,
        distance: euclideanDistance(userScores, c.elementScores || {})
    })).filter(c => c.distance !== Infinity);

    if (selectedElements.length === 0) {
        updateMixingStatus(); // Update status display
        filteredConcepts = conceptsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 15); // Show top 15 overall
    } else if (selectedElements.length === 1) {
        const el1 = selectedElements[0];
        updateMixingStatus();
        filteredConcepts = conceptsWithDistance
            .filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold)
            .sort((a, b) => {
                 // Sort primarily by score in selected element, secondarily by distance
                 const scoreA = a.elementScores[el1];
                 const scoreB = b.elementScores[el1];
                 if (scoreB !== scoreA) return scoreB - scoreA; // Higher score first
                 return a.distance - b.distance; // Then closer overall match
            });
    } else if (selectedElements.length === 2) {
        const el1 = selectedElements[0];
        const el2 = selectedElements[1];
        updateMixingStatus();
        filteredConcepts = conceptsWithDistance
            .filter(c =>
                c.elementScores &&
                c.elementScores[el1] >= scoreThreshold &&
                c.elementScores[el2] >= scoreThreshold
            )
            .sort((a, b) => {
                 // Sort by combined score in selected elements + user relevance
                 const scoreA = (a.elementScores[el1] + a.elementScores[el2]) * (1 - userRelevanceWeight) + (20 - a.distance) * userRelevanceWeight; // Combine element scores and inverse distance
                 const scoreB = (b.elementScores[el1] + b.elementScores[el2]) * (1 - userRelevanceWeight) + (20 - b.distance) * userRelevanceWeight;
                 return scoreB - scoreA; // Higher combined score first
            });
    }

    // Display results
    if (filteredConcepts.length === 0) {
        resultsBenchDiv.innerHTML = '<p>No concepts strongly match this specific combination. Try different elements!</p>';
    } else {
        filteredConcepts.slice(0, 20).forEach(concept => { // Limit display
            const potionCard = document.createElement('div');
            potionCard.classList.add('potion-card');
            potionCard.dataset.conceptId = concept.id;

            // Resonance Indicator Logic
            let resonanceClass = 'resonance-low';
            let resonanceText = 'Low Match';
            if (concept.distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'Good Match'; }
            else if (concept.distance < 15) { resonanceClass = 'resonance-medium'; resonanceText = 'Okay Match'; }

            potionCard.innerHTML = `
                <span class="resonance-indicator ${resonanceClass}" title="Overall match to your profile">${resonanceText}</span>
                <h4>${concept.name}</h4>
                <p class="concept-type">(${concept.type})</p>
            `;
            potionCard.addEventListener('click', () => showConceptDetailPopup(concept.id));
            resultsBenchDiv.appendChild(potionCard);
        });
    }
}

// --- Utility - Euclidean Distance ---
function euclideanDistance(profile1, profile2) { /* ... Same as before ... */
    let sum = 0; for (let i = 0; i < elementNames.length; i++) { const key = elementNames[i]; const score1 = profile1[key] ?? 5; const score2 = profile2[key] ?? 5; sum += Math.pow(score1 - score2, 2); } return Math.sqrt(sum);
}

// --- Concept Detail Pop-up (Recipe View with Comparison & Related) ---
function showConceptDetailPopup(conceptId) {
    currentlyDisplayedConceptId = conceptId;
    const conceptData = concepts.find(c => c.id === conceptId);
    if (!conceptData || !conceptData.elementScores) return;

    popupConceptName.textContent = conceptData.name;
    popupConceptType.textContent = conceptData.type;
    popupConceptProfile.innerHTML = '';
    popupUserComparisonProfile.innerHTML = '';
    popupRelatedConceptsList.innerHTML = ''; // Clear related list

    // Display Concept's & User's Profiles with Comparison
    elementNames.forEach((element) => {
        const cScore = conceptData.elementScores[element];
        const uScore = userScores[element];
        const diff = Math.abs(cScore - uScore);
        let comparisonClass = '';
        if (diff <= 1.5) comparisonClass = 'comparison-match'; // Good match
        else if (diff >= 4) comparisonClass = 'comparison-mismatch'; // Mismatch

        // Concept Profile Side
        const cBarWidth = (cScore / 10) * 100;
        popupConceptProfile.innerHTML += `<div class="${comparisonClass}"><strong>${element}:</strong><span>${cScore.toFixed(1)}</span><div class="score-bar-container" style="height: 8px; max-width: 80px; display: inline-block; margin-left: 8px; vertical-align: middle;"><div style="width: ${cBarWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div></div></div>`;

        // User Profile Side
        const uBarWidth = (uScore / 10) * 100;
         popupUserComparisonProfile.innerHTML += `<div class="${comparisonClass}"><strong>${element}:</strong><span>${uScore.toFixed(1)}</span><div class="score-bar-container" style="height: 8px; max-width: 80px; display: inline-block; margin-left: 8px; vertical-align: middle;"><div style="width: ${uBarWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div></div></div>`;
    });

    // Display Related Concepts
    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
        conceptData.relatedIds.forEach(relId => {
            const relatedConcept = concepts.find(c => c.id === relId);
            if (relatedConcept) {
                const li = document.createElement('li');
                li.textContent = relatedConcept.name;
                li.dataset.conceptId = relId;
                li.addEventListener('click', handleRelatedConceptClick);
                popupRelatedConceptsList.appendChild(li);
            }
        });
    } else {
        popupRelatedConceptsList.innerHTML = '<li>None specified</li>';
    }

    // Update Grimoire Button Status
    updateGrimoireButtonStatus(conceptId);

    popupOverlay.classList.remove('hidden');
    conceptDetailPopup.classList.remove('hidden');

     // Attunement Tracking for viewing details
     recordElementAttunementFromConcept(conceptData.elementScores);
}

function hideConceptDetailPopup() { /* ... Same as before ... */
    conceptDetailPopup.classList.add('hidden'); popupOverlay.classList.add('hidden'); currentlyDisplayedConceptId = null;
}

// --- NEW: Handle click on related concept in popup ---
function handleRelatedConceptClick(event) {
    const newConceptId = parseInt(event.target.dataset.conceptId);
    if (newConceptId) {
        hideConceptDetailPopup(); // Close current popup
        // Need a slight delay to ensure it's hidden before showing new one
        setTimeout(() => showConceptDetailPopup(newConceptId), 50);
    }
}

// --- Grimoire Functions ---
function addToGrimoire() {
    if (currentlyDisplayedConceptId !== null) {
        discoveredConcepts.add(currentlyDisplayedConceptId);
        console.log(`Added concept ${currentlyDisplayedConceptId} to Grimoire.`);
        updateGrimoireCounter();
        updateGrimoireButtonStatus(currentlyDisplayedConceptId); // Update button immediately
        // Optionally provide user feedback: alert('Added to Grimoire!');
    }
}

function updateGrimoireCounter() {
    grimoireCountSpan.textContent = discoveredConcepts.size;
}

function displayGrimoire() {
    grimoireContentDiv.innerHTML = ''; // Clear previous
    if (discoveredConcepts.size === 0) {
        grimoireContentDiv.innerHTML = '<p>You haven\'t discovered any concepts yet. Explore the lab!</p>';
    } else {
        // Group by primary element for structure
        const grouped = {};
        elementNames.forEach(el => grouped[el] = []);

        discoveredConcepts.forEach(id => {
            const concept = concepts.find(c => c.id === id);
            if (concept) {
                const primaryEl = elementKeyToName[concept.primaryElement] || "Other";
                 if (!grouped[primaryEl]) grouped[primaryEl] = [];
                grouped[primaryEl].push(concept);
            }
        });

         for (const element in grouped) {
             if (grouped[element].length > 0) {
                 let sectionHTML = `<div class="grimoire-section"><h3>${element} Concepts</h3>`;
                 grouped[element].sort((a,b) => a.name.localeCompare(b.name)).forEach(concept => {
                    sectionHTML += `<div class="grimoire-entry"><strong>${concept.name}</strong> <span>(${concept.type})</span></div>`;
                 });
                 sectionHTML += `</div>`;
                 grimoireContentDiv.innerHTML += sectionHTML;
             }
        }
    }
    showScreen('grimoireScreen');
}

function updateGrimoireButtonStatus(conceptId) {
     if (discoveredConcepts.has(conceptId)) {
         addToGrimoireButton.textContent = "In Grimoire";
         addToGrimoireButton.disabled = true;
         addToGrimoireButton.classList.add('added');
     } else {
         addToGrimoireButton.textContent = "Add to Grimoire";
         addToGrimoireButton.disabled = false;
         addToGrimoireButton.classList.remove('added');
     }
}

// --- Element Attunement Tracking (Basic) ---
function recordElementAttunementFromConcept(elementScores) {
     // Increase attunement slightly for elements the viewed concept is strong in
     elementNames.forEach(el => {
         if (elementScores[el] >= 7) { // If score is 7 or higher
             elementAttunement[el] += 0.5; // Increase less than direct interaction
             console.log(`Attunement ++ for ${el} via concept view: ${elementAttunement[el].toFixed(1)}`);
         }
     });
 }


// --- Utility functions ---
function hexToRgb(hex) { /* ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }

// --- Reset App ---
function resetApp() { /* ... includes Grimoire/Attunement reset */
     currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; selectedElements = []; currentlyDisplayedConceptId = null; discoveredConcepts = new Set(); elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; hideConceptDetailPopup(); showScreen('welcomeScreen');
}

// --- Event Listeners ---
startButton.addEventListener('click', initializeQuestionnaire);
nextElementButton.addEventListener('click', nextElement);
prevElementButton.addEventListener('click', prevElement);
restartButton.addEventListener('click', resetApp);
closePopupButton.addEventListener('click', hideConceptDetailPopup);
popupOverlay.addEventListener('click', hideConceptDetailPopup);
clearSelectionButton.addEventListener('click', clearElementSelection);
addToGrimoireButton.addEventListener('click', addToGrimoire);
viewGrimoireButton.addEventListener('click', displayGrimoire);
closeGrimoireButton.addEventListener('click', () => showScreen('labScreen')); // Go back to lab
// Removed listeners for map clicks, find similar, what if, refine, quests

// --- Initial Setup ---
showScreen('welcomeScreen');
