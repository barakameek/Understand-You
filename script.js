// --- Global State ---
let currentElementIndex = 0;
let userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; // Use single letter keys
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"]; // Full names for display/logic
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"]; // For filtering
let currentElementAnswers = {};
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // Use Map: ID -> { concept, discoveredTime }
let coreConcepts = new Set(); // Track IDs marked as core
let elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; // Track collected essence (use full names for keys here for consistency elsewhere if needed, or could use letters)
const RESEARCH_COST = 5; // Cost to Research an element

// --- DOM Elements ---
// Ensure these IDs match your index.html exactly
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
const personaElementDetailsDiv = document.getElementById('personaElementDetails');
const elementEssenceDisplayPersona = document.getElementById('elementEssenceDisplayPersona');
const personaCoreConceptsDisplay = document.getElementById('personaCoreConceptsDisplay');
const personaThemesList = document.getElementById('personaThemesList');
const restartButtonPersona = document.getElementById('restartButtonPersona');
const studyScreen = document.getElementById('studyScreen');
const elementEssenceDisplayStudy = document.getElementById('elementEssenceDisplayStudy');
const researchStatus = document.getElementById('researchStatus');
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const grimoireTypeFilter = document.getElementById('grimoireTypeFilter');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireContentDiv = document.getElementById('grimoireContent');
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupCardTypeIcon = document.getElementById('popupCardTypeIcon');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupCardVisual = document.getElementById('popupCardVisual');
const popupDetailedDescription = document.getElementById('popupDetailedDescription');
const popupResonanceSummary = document.getElementById('popupResonanceSummary');
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const popupRelatedConceptsList = document.getElementById('relatedConceptsList');
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
const markAsCoreButton = document.getElementById('markAsCoreButton');
const researchModal = document.getElementById('researchModal');
const researchModalContent = document.getElementById('researchModalContent');
const researchModalStatus = document.getElementById('researchModalStatus');
const closeResearchModalButton = document.getElementById('closeResearchModalButton');

// --- Utility & Setup Functions ---

function getScoreLabel(score) {
    if (score >= 9) return "Very High";
    if (score >= 7) return "High";
    if (score >= 5) return "Moderate";
    if (score >= 3) return "Low";
    return "Very Low";
}

function getAffinityLevel(score) {
    if (score >= 8) return "High";
    if (score >= 5) return "Moderate";
    return null; // Low affinity is not shown on card face
}

function getElementColor(elementName) {
    // Use full element names as keys here, consistent with elementNames array
    const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' };
    return colors[elementName] || '#CCCCCC'; // Default grey
}

function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string') return `rgba(128,128,128, ${alpha})`;
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const bigint = parseInt(hex, 16);
    if (isNaN(bigint)) return `rgba(128,128,128, ${alpha})`;
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

function getCardTypeIcon(cardType) {
    switch (cardType) {
        case "Orientation": return "fa-solid fa-compass";
        case "Identity/Role": return "fa-solid fa-mask";
        case "Practice/Kink": return "fa-solid fa-gear";
        case "Psychological/Goal": return "fa-solid fa-brain";
        case "Relationship Style": return "fa-solid fa-heart";
        default: return "fa-solid fa-question-circle";
    }
}

function getElementIcon(elementName) {
     // Use full element names here
     switch (elementName) {
        case "Attraction": return "fa-solid fa-magnet";
        case "Interaction": return "fa-solid fa-users";
        case "Sensory": return "fa-solid fa-hand-sparkles";
        case "Psychological": return "fa-solid fa-comment-dots";
        case "Cognitive": return "fa-solid fa-lightbulb";
        case "Relational": return "fa-solid fa-link";
        default: return "fa-solid fa-atom";
     }
}

// --- Utility Maps ---
const elementNameToKey = {
    "Attraction": "A", "Interaction": "I", "Sensory": "S",
    "Psychological": "P", "Cognitive": "C", "Relational": "R"
};
// Reverse map needed if elementEssence uses full names but concept scores use keys
const elementKeyToFullName = {
    A: "Attraction", I: "Interaction", S: "Sensory",
    P: "Psychological", C: "Cognitive", R: "Relational"
};


// *** Corrected euclideanDistance function ***
function euclideanDistance(userScoresObj, conceptScoresObj) {
    let sumOfSquares = 0;
    let validDimensions = 0;
    let issueFound = false; // Flag if any issue occurs

    if (!userScoresObj || typeof userScoresObj !== 'object') {
        console.error("Invalid user scores object provided to euclideanDistance:", userScoresObj);
        return Infinity;
    }
     if (!conceptScoresObj || typeof conceptScoresObj !== 'object') {
        // Don't log an error for every concept, maybe just return infinity quietly
        // console.error("Invalid concept scores object provided to euclideanDistance:", conceptScoresObj);
        return Infinity; // Cannot calculate distance
    }

    for (const key of Object.keys(userScoresObj)) { // Loop through keys A, I, S... in userScores
        const s1 = userScoresObj[key]; // User score using key
        const s2 = conceptScoresObj[key]; // Concept score using the same key

        const s1Valid = typeof s1 === 'number' && !isNaN(s1);
        const s2Valid = typeof s2 === 'number' && !isNaN(s2);

        if (s1Valid && s2Valid) {
            sumOfSquares += Math.pow(s1 - s2, 2);
            validDimensions++;
        } else {
            // Log only if a concept score is invalid, user score should always be valid
            if (!s2Valid) {
                 console.warn(`Invalid CONCEPT score for element key ${key}. Concept Score: ${s2}. Concept Object:`, conceptScoresObj);
            }
             // If *any* dimension is invalid, the distance is unreliable for sorting starter hand
            issueFound = true;
            return Infinity;
        }
    }

    // Ensure we compared all expected dimensions
    const expectedDimensions = Object.keys(userScoresObj).length;
    if (validDimensions !== expectedDimensions) {
         console.warn(`Mismatch in valid dimensions (${validDimensions}/${expectedDimensions}) during distance calc. Scores:`, userScoresObj, conceptScoresObj);
         issueFound = true; // Treat dimension mismatch as an issue
    }

    return (validDimensions === expectedDimensions && !issueFound) ? Math.sqrt(sumOfSquares) : Infinity;
}


// --- Screen Management ---
function showScreen(screenId) {
    console.log("Showing screen:", screenId);
    let targetIsMain = ['personaScreen', 'studyScreen', 'grimoireScreen'].includes(screenId);
    screens.forEach(screen => {
        screen.classList.toggle('current', screen.id === screenId);
        screen.classList.toggle('hidden', screen.id !== screenId);
    });
    if (mainNavBar) mainNavBar.classList.toggle('hidden', !targetIsMain);
    navButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.target === screenId);
    });
    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
}

function hidePopups() {
    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (researchModal) researchModal.classList.add('hidden');
    if (popupOverlay) popupOverlay.classList.add('hidden');
    currentlyDisplayedConceptId = null;
}

// --- Initialization and Questionnaire Logic ---
function initializeQuestionnaire() {
    currentElementIndex = 0;
    // Use single letter keys for userScores to match concepts data
    userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 };
    userAnswers = {};
    elementNames.forEach(elName => { // Use full names for looping through questionnaire sections
        userAnswers[elName] = {};
    });
    discoveredConcepts = new Map();
    coreConcepts = new Set();
    // Keep full names for Essence keys if that's more intuitive elsewhere
    elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };

    updateElementProgressHeader(-1);
    displayElementQuestions(currentElementIndex);
    showScreen('questionnaireScreen');
    if (mainNavBar) mainNavBar.classList.add('hidden');
}

function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) return;
    elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div');
        tab.classList.add('element-tab');
        const elementData = elementDetails[name] || {};
        tab.textContent = (elementData.name || name).substring(0, 3).toUpperCase();
        tab.title = elementData.name || name;
        if (index < activeIndex) tab.classList.add('completed');
        else if (index === activeIndex) tab.classList.add('active');
        elementProgressHeader.appendChild(tab);
    });
}

function displayElementQuestions(index) {
    if (index >= elementNames.length) {
        finalizeScoresAndShowPersona();
        return;
    }
    const elementName = elementNames[index]; // Full name like "Attraction"
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || []; // Use full name to get questions

    const questionContentElement = document.getElementById('questionContent');
    if (!questionContentElement) { console.error("!!! questionContent element not found !!!"); return; }

    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    questionContentElement.innerHTML = introHTML;

    currentElementAnswers = { ...(userAnswers[elementName] || {}) }; // Use full name for answers key
    let questionsHTML = '';
    if (questions && questions.length > 0) {
        questions.forEach(q => {
            let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
            const savedAnswer = currentElementAnswers[q.qId];
            // Correctly generates slider, radio, checkbox HTML (same as previous correct version)
            if (q.type === "slider") { const currentValue = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${currentValue}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(currentValue).toFixed(1)}</span></p></div>`; }
            else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const isChecked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
            else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const isChecked = savedAnswer?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
            inputHTML += `</div></div>`; questionsHTML += inputHTML;
        });
    } else { questionsHTML = '<p><em>(No questions defined)</em></p>'; }

    const introDiv = questionContentElement.querySelector('.element-intro');
    if (introDiv) { introDiv.insertAdjacentHTML('afterend', questionsHTML); } else { questionContentElement.innerHTML += questionsHTML; }

    questionContentElement.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.addEventListener(eventType, handleQuestionnaireInputChange); });
    questionContentElement.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => { checkbox.addEventListener('change', (event) => enforceMaxChoices(checkbox.name, parseInt(checkbox.dataset.maxChoices || 2), event)); });

    updateElementProgressHeader(index);
    if (progressText) progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || elementName}`;
    updateDynamicFeedback(elementName); // Pass full name
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block';
    if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}


function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const type = input.dataset.type;
    const elementName = elementNames[currentElementIndex]; // Get full name
    if (type === 'slider') {
        const qId = input.dataset.questionId;
        const display = document.getElementById(`display_${qId}`);
        if (display) display.textContent = parseFloat(input.value).toFixed(1);
    }
    collectCurrentElementAnswers();
    updateDynamicFeedback(elementName); // Pass full name
}

function enforceMaxChoices(name, max, event) {
     const checkboxes = questionContent?.querySelectorAll(`input[name="${name}"]:checked`); // Add optional chaining
     if (!checkboxes) return;
     if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        if (event && event.target && event.target.checked) {
            event.target.checked = false;
            collectCurrentElementAnswers();
            updateDynamicFeedback(elementNames[currentElementIndex]); // Pass full name
        }
    }
}

function collectCurrentElementAnswers() {
    const elementName = elementNames[currentElementIndex]; // Full name
    const questions = questionnaireGuided[elementName] || [];
    currentElementAnswers = {};
    questions.forEach(q => {
        const qId = q.qId;
        const container = questionContent || document; // Fallback to document if needed, though questionContent should exist
        if (q.type === 'slider') {
            const input = container.querySelector(`#${qId}.q-input`);
            if (input) currentElementAnswers[qId] = parseFloat(input.value);
        } else if (q.type === 'radio') {
            const checked = container.querySelector(`input[name="${qId}"]:checked`);
            if (checked) currentElementAnswers[qId] = checked.value;
        } else if (q.type === 'checkbox') {
            const checked = container.querySelectorAll(`input[name="${qId}"]:checked`);
            currentElementAnswers[qId] = Array.from(checked).map(cb => cb.value);
        }
    });
    userAnswers[elementName] = { ...currentElementAnswers }; // Use full name as key
}

function updateDynamicFeedback(elementName) { // Accepts full name
    if (!dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) return;
    const tempScore = calculateElementScore(elementName, currentElementAnswers); // Pass full name
    feedbackElementSpan.textContent = elementDetails[elementName]?.name || elementName;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);
    let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
    if (!labelSpan) {
        labelSpan = document.createElement('span'); labelSpan.classList.add('score-label');
        feedbackScoreSpan.parentNode.insertBefore(document.createTextNode(' '), feedbackScoreSpan.nextSibling);
        feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling.nextSibling);
    }
    labelSpan.textContent = `(${getScoreLabel(tempScore)})`;
    feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

function calculateElementScore(elementName, answersForElement) { // Accepts full name
    const questions = questionnaireGuided[elementName] || []; // Use full name
    let score = 5.0;
    questions.forEach(q => {
        const answer = answersForElement[q.qId];
        let pointsToAdd = 0;
        // Score calculation logic remains the same
        if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); }
        else if (q.type === 'radio') { const selectedOption = q.options.find(opt => opt.value === answer); pointsToAdd = selectedOption ? (selectedOption.points || 0) * (q.scoreWeight || 1.0) : 0; }
        else if (q.type === 'checkbox' && answer && Array.isArray(answer)) { answer.forEach(val => { const selectedOption = q.options.find(opt => opt.value === val); pointsToAdd += selectedOption ? (selectedOption.points || 0) * (q.scoreWeight || 1.0) : 0; }); }
        score += pointsToAdd;
    });
    return Math.max(0, Math.min(10, score));
}

function nextElement() {
    collectCurrentElementAnswers();
    currentElementIndex++;
    displayElementQuestions(currentElementIndex);
}
function prevElement() {
     collectCurrentElementAnswers();
     currentElementIndex--;
     displayElementQuestions(currentElementIndex);
}

function finalizeScoresAndShowPersona() {
     console.log("Finalizing scores...");
     // Calculate final scores using full names and store using single-letter keys
     const finalScores = {};
     elementNames.forEach(elementName => {
         const score = calculateElementScore(elementName, userAnswers[elementName] || {});
         const key = elementNameToKey[elementName]; // Convert full name to key
         if (key) {
             finalScores[key] = score;
         } else {
             console.error(`Could not find key for element: ${elementName}`);
         }
     });
     userScores = finalScores; // Assign the object with single-letter keys
     console.log("Final User Scores:", userScores);

     determineStarterHandAndEssence(); // This uses userScores (with letter keys) internally
     displayPersonaScreen(); // This displays using userScores (letter keys) and elementDetails (full name keys)
     displayElementEssenceStudy(); // Displays essence (full name keys)
     populateGrimoireFilters();
     updateGrimoireCounter();

     showScreen('personaScreen');
     setTimeout(() => {
        alert("Experiment Complete!\n\nYour initial scores have been calculated. You've been granted a 'Starter Hand' of concepts added to your Grimoire, plus some initial Element Essence.\n\nExplore your Persona Tapestry, check your Grimoire, or visit The Study to Research new concepts!");
     }, 100);
}

// --- Starter Hand & Initial Essence ---
function determineStarterHandAndEssence() {
    console.log("Determining starter hand...");
    discoveredConcepts = new Map();
    // Reset essence (use full names as keys consistently here)
    elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };

    // Calculate distances using userScores (which now has keys A, I, S...)
    let conceptsWithDistance = concepts.map(c => ({
        ...c,
        // Pass userScores (A,I,S...) and concept.elementScores (A,I,S...)
        distance: euclideanDistance(userScores, c.elementScores || {})
    })).filter(c => c.distance !== Infinity);

    if (conceptsWithDistance.length === 0) {
        console.error("No concepts had valid distances! Cannot select starter hand. Check concept score data.");
        return; // Stop if no concepts are comparable
    }

    conceptsWithDistance.sort((a, b) => a.distance - b.distance);
    console.log("Concepts sorted by distance:", conceptsWithDistance.slice(0,15).map(c => `${c.name} (Dist: ${c.distance.toFixed(2)})`)); // Log sorted candidates

    const candidates = conceptsWithDistance.slice(0, 15);
    const starterHand = [];
    const representedElements = new Set(); // Use primaryElement keys (A, I, S...)
    const starterHandIds = new Set();

    // Select first 4 closest
    for (const candidate of candidates) {
        if (starterHand.length >= 4) break;
        if (!starterHandIds.has(candidate.id)) {
            starterHand.push(candidate);
            starterHandIds.add(candidate.id);
            if (candidate.primaryElement) representedElements.add(candidate.primaryElement);
        }
    }
     // Select remaining up to 7, prioritizing variety
    for (const candidate of candidates) {
        if (starterHand.length >= 7) break;
        if (starterHandIds.has(candidate.id)) continue;
        if (!representedElements.has(candidate.primaryElement) || candidates.slice(candidates.indexOf(candidate)).every(rem => representedElements.has(rem.primaryElement))) {
             starterHand.push(candidate);
             starterHandIds.add(candidate.id);
             if (candidate.primaryElement) representedElements.add(candidate.primaryElement);
        }
    }
     // Fill remaining slots if needed (unlikely but safe)
     for (const candidate of candidates) {
         if (starterHand.length >= 7) break;
         if (!starterHandIds.has(candidate.id)) {
              starterHand.push(candidate);
              starterHandIds.add(candidate.id);
         }
     }

    console.log("Starter Hand Selected:", starterHand.map(c => c.name));
    starterHand.forEach(concept => {
        discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now() });
        grantEssenceForConcept(concept, 0.5); // Grant half essence for starter hand
    });
    console.log("Initial Essence Granted:", elementEssence);
}


// --- Persona Screen Functions ---
function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona details div not found!"); return; }
    personaElementDetailsDiv.innerHTML = '';
    // Loop through full names for display order/details lookup
    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName]; // Get key ('A', 'I'...)
        const score = userScores[key]; // Get score using the key
        const scoreLabel = getScoreLabel(score);
        const elementData = elementDetails[elementName] || {}; // Get details using full name
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation unavailable.";
        const barWidth = score * 10;
        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        details.innerHTML = `
            <summary class="element-detail-header">
                <div>
                    <strong>${elementData.name || elementName}:</strong>
                    <span>${score.toFixed(1)}</span> <span class="score-label">(${scoreLabel})</span>
                </div>
                <div class="score-bar-container">
                    <div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(elementName)}; border-radius: 3px;"></div>
                </div>
            </summary>
            <div class="element-description">
                <p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p>
                <p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p>
                <hr style="border-top: 1px dashed #c8b89a; margin: 8px 0;">
                <p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p>
                <p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>
            </div>`;
        personaElementDetailsDiv.appendChild(details);
    });
    displayElementEssencePersona();
    displayCoreConceptsPersona();
    synthesizeAndDisplayThemesPersona();
}

function displayElementEssencePersona() {
    if (!elementEssenceDisplayPersona) return;
    elementEssenceDisplayPersona.innerHTML = '';
    let hasEssence = false;
    // Use elementNames (full names) for display order and labels
    elementNames.forEach(elName => {
        const essenceValue = parseFloat(elementEssence[elName] || 0); // Assumes essence keys are full names
        if (essenceValue > 0) hasEssence = true;
        elementEssenceDisplayPersona.innerHTML += `
           <div class="essence-item">
               <span class="essence-icon" style="background-color: ${getElementColor(elName)};"></span>
               <span class="essence-name">${elementDetails[elName]?.name || elName}:</span>
               <span class="essence-value">${essenceValue.toFixed(1)}</span>
           </div>`;
    });
    if (!hasEssence) {
        elementEssenceDisplayPersona.innerHTML += '<p style="font-size: 0.85em; text-align: left; color: #777;"><i>No Essence collected yet.</i></p>';
    }
}

function displayCoreConceptsPersona() {
    if (!personaCoreConceptsDisplay) return;
    personaCoreConceptsDisplay.innerHTML = '';
    if (coreConcepts.size === 0) {
        personaCoreConceptsDisplay.innerHTML = '<li>Mark concepts as "Core" via their detail pop-up to build your tapestry.</li>';
        return;
    }
    coreConcepts.forEach(conceptId => {
        const concept = concepts.find(c => c.id === conceptId);
        if (concept) {
            const item = document.createElement('div');
            item.classList.add('core-concept-item');
            item.dataset.conceptId = concept.id;
            item.title = `View details for ${concept.name}`;
            item.innerHTML = `
                <i class="${getCardTypeIcon(concept.cardType)}"></i>
                <span class="name">${concept.name}</span>
                <span class="type">(${concept.cardType})</span>
            `;
             item.addEventListener('click', () => showConceptDetailPopup(concept.id));
            personaCoreConceptsDisplay.appendChild(item);
        }
    });
}

function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return;
     personaThemesList.innerHTML = '';
     if (coreConcepts.size === 0) {
         personaThemesList.innerHTML = '<li>Mark Core Concepts to reveal dominant themes.</li>';
         return;
     }
     const elementCounts = {}; // Use full names as keys
     elementNames.forEach(name => { elementCounts[name] = 0; });
     const threshold = 7.0;

     coreConcepts.forEach(id => {
         const concept = concepts.find(c => c.id === id);
         if (concept?.elementScores) {
             // Loop through keys A, I, S... in elementScores
             for (const key in concept.elementScores) {
                 if (concept.elementScores[key] >= threshold) {
                     const fullName = elementKeyToFullName[key]; // Convert key to full name
                     if (fullName) {
                         elementCounts[fullName]++;
                     }
                 }
             }
         }
     });

     const sortedThemes = Object.entries(elementCounts)
         .filter(([_, count]) => count > 0)
         .sort(([, a], [, b]) => b - a);

     if (sortedThemes.length === 0) {
         personaThemesList.innerHTML = '<li>No strong elemental themes identified among Core Concepts yet.</li>';
         return;
     }
     sortedThemes.slice(0, 3).forEach(([elementName, count]) => { // elementName is full name
         const li = document.createElement('li');
         li.textContent = `${elementDetails[elementName]?.name || elementName} Focus (from ${count} Core concepts)`;
         personaThemesList.appendChild(li);
     });
}


// --- Study Screen Functions ---
function displayElementEssenceStudy() {
    if (!elementEssenceDisplayStudy) return;
    elementEssenceDisplayStudy.innerHTML = '';
    // Use elementNames (full names) for display
    elementNames.forEach(elName => {
        const currentEssence = parseFloat(elementEssence[elName] || 0); // Use full name key
        const canAfford = currentEssence >= RESEARCH_COST;
        const counter = document.createElement('div');
        counter.classList.add('essence-counter');
        counter.dataset.element = elName; // Store full name
        counter.title = `Click to Research ${elementDetails[elName]?.name || elName} (Cost: ${RESEARCH_COST})`;
        counter.classList.toggle('disabled', !canAfford);

        counter.innerHTML = `
            <span class="essence-icon" style="background-color: ${getElementColor(elName)};"></span>
            <span class="essence-name">${elementDetails[elName]?.name || elName}</span>
            <span class="essence-value">${currentEssence.toFixed(1)}</span>
            <div class="essence-cost">Cost: ${RESEARCH_COST}</div>
        `;
        if (canAfford) {
            counter.addEventListener('click', handleResearchClick);
        }
        elementEssenceDisplayStudy.appendChild(counter);
    });
}

function handleResearchClick(event) {
    const elementName = event.currentTarget.dataset.element; // Full name
    if (!elementName || event.currentTarget.classList.contains('disabled')) return;

    const currentEssence = parseFloat(elementEssence[elementName] || 0); // Use full name key
    if (currentEssence >= RESEARCH_COST) {
        elementEssence[elementName] = currentEssence - RESEARCH_COST; // Deduct using full name key
        console.log(`Spent ${RESEARCH_COST} ${elementName} Essence. Remaining: ${elementEssence[elementName].toFixed(1)}`);
        displayElementEssenceStudy(); // Update display immediately
        conductResearch(elementName); // Pass full name
    } else {
        alert(`Not enough ${elementDetails[elementName]?.name || elementName} Essence! Need ${RESEARCH_COST}.`);
    }
}

function conductResearch(elementNameToResearch) { // Expects full name
    console.log(`Researching Element: ${elementNameToResearch}`);
    if (researchStatus) researchStatus.textContent = `Researching ${elementDetails[elementNameToResearch]?.name || elementNameToResearch}...`;
    if (researchModalContent) researchModalContent.innerHTML = '';

    const discoveredIds = new Set(discoveredConcepts.keys());
    const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));

    if (undiscoveredPool.length === 0) { /* ... (handle no concepts left) ... */ return; }

    const priorityPool = [];
    const secondaryPool = [];
    const tertiaryPool = [...undiscoveredPool];
    const elementKeyToResearch = elementNameToKey[elementNameToResearch]; // Convert name to key ('A', 'I'...)

    undiscoveredPool.forEach(c => {
        const score = c.elementScores?.[elementKeyToResearch] || 0; // Use key to check score
        const primary = c.primaryElement === elementKeyToResearch; // Check primary using key
        const index = tertiaryPool.findIndex(tc => tc.id === c.id);

        if (primary || score >= 8.0) {
            priorityPool.push(c);
            if (index > -1) tertiaryPool.splice(index, 1);
        } else if (score >= 5.0) {
            secondaryPool.push(c);
            if (index > -1) tertiaryPool.splice(index, 1);
        }
    });
    console.log(`Pools - Priority: ${priorityPool.length}, Secondary: ${secondaryPool.length}, Tertiary: ${tertiaryPool.length}`);

    const selectedForOutput = [];
    const selectRandomFromPool = (pool) => { /* ... (same selection logic) ... */ if (pool.length === 0) return null; const randomIndex = Math.floor(Math.random() * pool.length); const selected = pool[randomIndex]; pool.splice(randomIndex, 1); return selected; };
    for (let i = 0; i < 3; i++) { let selectedCard = selectRandomFromPool(priorityPool) || selectRandomFromPool(secondaryPool) || selectRandomFromPool(tertiaryPool); if (selectedCard) selectedForOutput.push(selectedCard); else break; }

    if (selectedForOutput.length > 0) {
        if (researchModalStatus) researchModalStatus.textContent = `Discovered ${selectedForOutput.length} new concept(s)! Click to learn more and add to Grimoire.`;
        selectedForOutput.forEach(concept => { const cardElement = renderCard(concept, 'research-result'); if (researchModalContent) researchModalContent.appendChild(cardElement); });
        if (researchStatus) researchStatus.textContent = `Research complete. Check the results!`;
    } else { /* ... (handle no concepts found) ... */ if (researchModalStatus) researchModalStatus.textContent = "No new concepts matching the research criteria were found this time."; if (researchStatus) researchStatus.textContent = "Research complete. No new relevant concepts found."; }

    if (researchModal) researchModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}


// --- Grimoire Functions ---
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered") {
    // Filter element uses full name now, comparison needs to use full name
    if (!grimoireContentDiv) return;
    grimoireContentDiv.innerHTML = '';
    if (discoveredConcepts.size === 0) { /* ... (handle empty grimoire) ... */ grimoireContentDiv.innerHTML = '<p style="text-align: center; color: #666;">Your Grimoire is empty. Visit The Study and Research concepts!</p>'; showScreen('grimoireScreen'); return; }

    let discoveredArray = Array.from(discoveredConcepts.values());
    const conceptsToDisplay = discoveredArray.filter(data => {
        const typeMatch = (filterType === "All") || (data.concept.cardType === filterType);
        // Get the full name for the concept's primary element
        const primaryElFullName = elementKeyToFullName[data.concept.primaryElement];
        const elementMatch = (filterElement === "All") || (primaryElFullName === filterElement);
        return typeMatch && elementMatch;
    });

    // Sorting logic remains the same
    if (sortBy === 'name') conceptsToDisplay.sort((a, b) => a.concept.name.localeCompare(b.concept.name));
    else if (sortBy === 'type') conceptsToDisplay.sort((a, b) => a.concept.cardType.localeCompare(b.concept.cardType) || a.concept.name.localeCompare(b.concept.name));
    else conceptsToDisplay.sort((a,b) => a.discoveredTime - b.discoveredTime);

    if (conceptsToDisplay.length === 0) { /* ... (handle no matches) ... */ grimoireContentDiv.innerHTML = `<p style="text-align: center; color: #666;">No discovered concepts match the current filters.</p>`; }
    else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); grimoireContentDiv.appendChild(cardElement); }); }
    showScreen('grimoireScreen');
}

function populateGrimoireFilters() {
    // ... (same as before, using full names for element filter values) ...
     if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); } if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = name; option.textContent = name; grimoireElementFilter.appendChild(option); }); }
}

function updateGrimoireCounter() {
     if (grimoireCountSpan) grimoireCountSpan.textContent = discoveredConcepts.size;
}


// --- Card Rendering Function ---
function renderCard(concept, context = 'grimoire') {
    // ... (same as before, but uses full element names for affinity title) ...
     const cardDiv = document.createElement('div'); cardDiv.classList.add('concept-card'); cardDiv.dataset.conceptId = concept.id; cardDiv.title = `Click to view details for ${concept.name}`; const isDiscovered = discoveredConcepts.has(concept.id); const isCore = coreConcepts.has(concept.id); const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : ''; const coreStampHTML = isCore ? '<span class="core-indicator" title="Core Concept">★</span>' : ''; const cardTypeIcon = getCardTypeIcon(concept.cardType); let affinitiesHTML = ''; if (concept.elementScores) { Object.entries(concept.elementScores).forEach(([key, score]) => { const level = getAffinityLevel(score); if (level) { const fullName = elementKeyToFullName[key]; const color = getElementColor(fullName); const levelClass = level === "High" ? "affinity-high" : ""; affinitiesHTML += `<span class="affinity ${levelClass}" style="border-color: ${color}; color: ${color}; background-color: ${hexToRgba(color, 0.1)};" title="${elementDetails[fullName]?.name || fullName} Affinity"><i class="${getElementIcon(fullName)}"></i> ${level.substring(0, 3)}</span> `; } }); } cardDiv.innerHTML = `<div class="card-header"><i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i><span class="card-name">${concept.name}</span><span class="card-stamps">${coreStampHTML}${grimoireStampHTML}</span></div><div class="card-visual"><i class="fas fa-question card-visual-placeholder" title="${concept.visualHandle}"></i></div><div class="card-footer"><div class="card-affinities">${affinitiesHTML || '<small style="color:#888;">Low Affinity</small>'}</div><p class="card-brief-desc">${concept.briefDescription || '...'}</p></div>`; if (context !== 'no-click') { cardDiv.addEventListener('click', () => showConceptDetailPopup(concept.id)); } return cardDiv;
}


// --- Concept Detail Pop-up Logic ---
function showConceptDetailPopup(conceptId) {
    // ... (same as before) ...
     currentlyDisplayedConceptId = conceptId; const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData || !conceptData.elementScores) { console.error(`Concept data or scores missing for ID: ${conceptId}`); hidePopups(); return; } if(popupCardTypeIcon) popupCardTypeIcon.className = `${getCardTypeIcon(conceptData.cardType)} card-type-icon`; if(popupConceptName) popupConceptName.textContent = conceptData.name; if(popupConceptType) popupConceptType.textContent = conceptData.cardType; if(popupCardVisual) popupCardVisual.className = `fas fa-question card-visual-placeholder`; if(popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No detailed description."; if(popupComparisonHighlights) popupComparisonHighlights.innerHTML = ''; if(popupConceptProfile) popupConceptProfile.innerHTML = ''; if(popupUserComparisonProfile) popupUserComparisonProfile.innerHTML = ''; if(popupRelatedConceptsList) popupRelatedConceptsList.innerHTML = ''; const distance = euclideanDistance(userScores, conceptData.elementScores); displayPopupResonance(distance); displayPopupRecipeComparison(conceptData); displayPopupRelatedConcepts(conceptData); updateGrimoireButtonStatus(conceptId); updateCoreButtonStatus(conceptId); if (popupOverlay) popupOverlay.classList.remove('hidden'); if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
}

function displayPopupResonance(distance) {
    // ... (same as before) ...
    if (!popupResonanceSummary) return; let resonanceClass = 'resonance-low'; let resonanceText = 'Low Match'; let resonanceDesc = "Significant differences compared to your profile."; if (distance === Infinity) { resonanceText = 'N/A'; resonanceDesc = "Cannot compare."; } else if (distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'High Match'; resonanceDesc = "Strong alignment."; } else if (distance < 16) { resonanceClass = 'resonance-medium'; resonanceText = 'Mid Match'; resonanceDesc = "Some alignment, some differences."; } popupResonanceSummary.innerHTML = `Overall Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceText}</span><p style="font-size:0.85em; color:#666; margin-top: 3px; margin-bottom: 0;">(${resonanceDesc})</p>`;
}

function displayPopupRecipeComparison(conceptData) {
    // Uses full names for display but accesses scores via keys
     if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return;
     let highlightsHTML = ''; const diffThreshold = 3.0; const alignThreshold = 1.5;
     let matches = []; let mismatches = [];
     popupConceptProfile.innerHTML = ''; popupUserComparisonProfile.innerHTML = '';

     elementNames.forEach((elementName) => { // Loop full names for display order
         const key = elementNameToKey[elementName]; // Get key
         const elementDisplayName = elementDetails[elementName]?.name || elementName;
         const cScore = conceptData.elementScores[key]; // Use key
         const uScore = userScores[key]; // Use key
         const cScoreLabel = getScoreLabel(cScore);
         const uScoreLabel = getScoreLabel(uScore);
         const color = getElementColor(elementName); // Use full name for color

         const renderProfileHTML = (score, label) => {
             const barWidth = Math.max(0, Math.min(100, ((score ?? 0) / 10) * 100)); // Handle potential undefined score
             return `<span>${score?.toFixed(1) ?? '?'} (${label})</span>
                     <div class="score-bar-container">
                         <div style="width: ${barWidth}%; height: 100%; background-color: ${color}; border-radius: 3px;"></div>
                     </div>`;
         };

         popupConceptProfile.innerHTML += `<div><strong>${elementDisplayName}:</strong>${renderProfileHTML(cScore, cScoreLabel)}</div>`;
         popupUserComparisonProfile.innerHTML += `<div><strong>${elementDisplayName}:</strong>${renderProfileHTML(uScore, uScoreLabel)}</div>`;

         if (typeof cScore === 'number' && typeof uScore === 'number') {
             const diff = uScore - cScore;
             if (Math.abs(diff) <= alignThreshold) { matches.push(`<b>${elementDisplayName}</b> (${uScoreLabel})`); }
             else if (Math.abs(diff) >= diffThreshold) { const comp = diff > 0 ? `notably higher than concept's ${cScoreLabel}` : `notably lower than concept's ${cScoreLabel}`; mismatches.push({ element: elementDisplayName, diff: diff, text: `for <b>${elementDisplayName}</b>, your score (${uScoreLabel}) is ${comp}` }); }
         }
     });

     if (matches.length > 0) highlightsHTML += `<p><strong class="match">Aligns Well With:</strong> Your preference(s) for ${matches.join(', ')}.</p>`;
     if (mismatches.length > 0) { mismatches.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)); highlightsHTML += `<p><strong class="mismatch">Key Difference:</strong> ${mismatches[0].text}.</p>`; if (mismatches.length > 1) highlightsHTML += `<p><small>(Other notable differences in ${mismatches.slice(1).map(m => m.element).join(', ')}.)</small></p>`; }
     if (!highlightsHTML) highlightsHTML = "<p>Moderate alignment or difference across most elements.</p>";
     popupComparisonHighlights.innerHTML = highlightsHTML;
}

function displayPopupRelatedConcepts(conceptData) {
    // ... (same as before) ...
    if (!popupRelatedConceptsList) return; popupRelatedConceptsList.innerHTML = ''; if (conceptData.relatedIds && conceptData.relatedIds.length > 0) { conceptData.relatedIds.forEach(relId => { const relatedConcept = concepts.find(c => c.id === relId); if (relatedConcept) { const li = document.createElement('li'); li.textContent = relatedConcept.name; li.dataset.conceptId = relId; li.addEventListener('click', handleRelatedConceptClick); popupRelatedConceptsList.appendChild(li); } }); } else { popupRelatedConceptsList.innerHTML = '<li>None specified</li>'; }
}

function handleRelatedConceptClick(event) {
    // ... (same as before) ...
     const newConceptId = parseInt(event.target.dataset.conceptId); if (newConceptId && newConceptId !== currentlyDisplayedConceptId) { hidePopups(); setTimeout(() => showConceptDetailPopup(newConceptId), 50); }
}

// --- Grimoire/Core Button & State Logic ---
function grantEssenceForConcept(concept, multiplier = 1.0) {
    if (!concept?.elementScores) return false;
    let essenceGained = false;
    // Loop through keys A, I, S... in concept scores
    for (const key in concept.elementScores) {
        const score = concept.elementScores[key];
        const fullName = elementKeyToFullName[key]; // Convert key to full name for essence object
        if (fullName) {
            const gain = Math.max(0, (score || 0) - 4) * 0.1 * multiplier;
            if (gain > 0) {
                elementEssence[fullName] = (elementEssence[fullName] || 0) + gain; // Add using full name key
                essenceGained = true;
            }
        }
    }
    if (essenceGained) console.log("Essence Updated:", elementEssence);
    return essenceGained;
}

function addToGrimoire() {
    // ... (same as before) ...
    if (currentlyDisplayedConceptId !== null && !discoveredConcepts.has(currentlyDisplayedConceptId)) { const concept = concepts.find(c => c.id === currentlyDisplayedConceptId); if (concept) { discoveredConcepts.set(currentlyDisplayedConceptId, { concept: concept, discoveredTime: Date.now() }); const gained = grantEssenceForConcept(concept, 1.0); updateGrimoireCounter(); updateGrimoireButtonStatus(currentlyDisplayedConceptId); updateCoreButtonStatus(currentlyDisplayedConceptId); if(gained) { displayElementEssenceStudy(); displayElementEssencePersona(); } synthesizeAndDisplayThemesPersona(); if (grimoireScreen.classList.contains('current')) { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value); } } }
}

function toggleCoreConcept() {
    // ... (same as before) ...
    if (currentlyDisplayedConceptId === null || !discoveredConcepts.has(currentlyDisplayedConceptId)) return; let essenceMultiplier = 0; if (coreConcepts.has(currentlyDisplayedConceptId)) { coreConcepts.delete(currentlyDisplayedConceptId); essenceMultiplier = -0.5; } else { if (coreConcepts.size >= 7) { alert("Max 7 Core Concepts."); return; } coreConcepts.add(currentlyDisplayedConceptId); essenceMultiplier = 0.5; } const concept = concepts.find(c => c.id === currentlyDisplayedConceptId); const changedEssence = grantEssenceForConcept(concept, essenceMultiplier); updateCoreButtonStatus(currentlyDisplayedConceptId); displayCoreConceptsPersona(); if(changedEssence) { displayElementEssenceStudy(); displayElementEssencePersona(); } synthesizeAndDisplayThemesPersona(); if (grimoireScreen.classList.contains('current')) { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value); }
}

function updateGrimoireButtonStatus(conceptId) {
    // ... (same as before) ...
    if (!addToGrimoireButton) return; const isInGrimoire = discoveredConcepts.has(conceptId); addToGrimoireButton.textContent = isInGrimoire ? "In Grimoire" : "Add to Grimoire"; addToGrimoireButton.disabled = isInGrimoire; addToGrimoireButton.classList.toggle('added', isInGrimoire);
}

function updateCoreButtonStatus(conceptId) {
    // ... (same as before) ...
     if (!markAsCoreButton) return; const isInGrimoire = discoveredConcepts.has(conceptId); markAsCoreButton.classList.toggle('hidden', !isInGrimoire); if (isInGrimoire) { const isCore = coreConcepts.has(conceptId); markAsCoreButton.textContent = isCore ? "Core Concept ★" : "Mark as Core"; markAsCoreButton.classList.toggle('marked', isCore); }
}

// --- Reset App ---
function resetApp() {
    // ... (same as before) ...
     console.log("Resetting application state..."); currentElementIndex = 0; userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; userAnswers = {}; discoveredConcepts = new Map(); coreConcepts = new Set(); elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; currentlyDisplayedConceptId = null; hidePopups(); if(researchStatus) researchStatus.textContent = 'Select an Essence to begin Research...'; if(grimoireContentDiv) grimoireContentDiv.innerHTML = ''; if(personaCoreConceptsDisplay) personaCoreConceptsDisplay.innerHTML = ''; if(elementEssenceDisplayStudy) elementEssenceDisplayStudy.innerHTML = ''; if(elementEssenceDisplayPersona) elementEssenceDisplayPersona.innerHTML = ''; if(personaElementDetailsDiv) personaElementDetailsDiv.innerHTML = ''; if(personaThemesList) personaThemesList.innerHTML = ''; updateGrimoireCounter(); showScreen('welcomeScreen'); if(mainNavBar) mainNavBar.classList.add('hidden');
}

// --- Event Listeners (within DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Card Concept...");
    // Attach Listeners (includes defensive checks)
    // ... (same listeners as before) ...
    if (startButton) startButton.addEventListener('click', initializeQuestionnaire); else console.error("Start button not found!");
    if (nextElementButton) nextElementButton.addEventListener('click', nextElement); else console.error("Next button not found!");
    if (prevElementButton) prevElementButton.addEventListener('click', prevElement); else console.error("Prev button not found!");
    if (restartButtonPersona) restartButtonPersona.addEventListener('click', resetApp); else console.error("Restart button not found!");
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopups); else console.error("Close Popup button not found!");
    if (popupOverlay) popupOverlay.addEventListener('click', hidePopups); else console.error("Popup Overlay not found!");
    if (closeResearchModalButton) closeResearchModalButton.addEventListener('click', hidePopups); else console.error("Close Research Modal button not found!");
    if (addToGrimoireButton) addToGrimoireButton.addEventListener('click', addToGrimoire); else console.error("Add to Grimoire button not found!");
    if (markAsCoreButton) markAsCoreButton.addEventListener('click', toggleCoreConcept); else console.error("Mark as Core button not found!");
    if (grimoireTypeFilter) grimoireTypeFilter.addEventListener('change', (e) => displayGrimoire(e.target.value, grimoireElementFilter.value, grimoireSortOrder.value)); else console.error("Grimoire Type filter not found!");
    if (grimoireElementFilter) grimoireElementFilter.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, e.target.value, grimoireSortOrder.value)); else console.error("Grimoire Element filter not found!");
    if (grimoireSortOrder) grimoireSortOrder.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, e.target.value)); else console.error("Grimoire Sort order not found!");
    navButtons.forEach(button => { button.addEventListener('click', () => { const targetScreen = button.dataset.target; if(!document.getElementById(targetScreen)) { console.error(`Target screen #${targetScreen} not found!`); return; } if (targetScreen === 'personaScreen') { displayPersonaScreen(); } if (targetScreen === 'studyScreen') { displayElementEssenceStudy(); } if (targetScreen === 'grimoireScreen') { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value); } showScreen(targetScreen); }); });

    // --- Initial Setup ---
    showScreen('welcomeScreen');
    console.log("Initial screen set to Welcome.");
}); // End DOMContentLoaded
