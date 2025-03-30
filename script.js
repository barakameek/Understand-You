
let currentElementIndex = 0;
let userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; // Use single letter keys
let userAnswers = {}; // Stores answers keyed by FULL element names during questionnaire
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"]; // Full names for display/logic
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"]; // For filtering
let currentElementAnswers = {}; // Temp storage for current element's answers
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // ID -> { concept, discoveredTime, artUnlocked: boolean }
let coreConcepts = new Set(); // Track IDs marked as core
// Use full names as keys for easier lookup from UI events/data, maps used for conversion
let elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
let elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
const MAX_ATTUNEMENT = 100; // Example max level
const RESEARCH_COST = 5;
const ART_EVOLVE_COST = 5; // Example cost

// --- Persistent State Tracking (Placeholder - Requires Saving/Loading implementation) ---
let seenPrompts = new Set();
let completedRituals = { daily: {}, weekly: {} }; // Store completed ritual IDs for the period
let achievedMilestones = new Set();
let lastLoginDate = null; // Store YYYY-MM-DD

// --- DOM Elements (Defensive Checks Added in Listeners) ---
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
const grimoireRarityFilter = document.getElementById('grimoireRarityFilter');
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
const elementAttunementDisplay = document.getElementById('elementAttunementDisplay');
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay');
const milestonesDisplay = document.getElementById('milestonesDisplay');
const popupEvolutionSection = document.getElementById('popupEvolutionSection');
const evolveArtButton = document.getElementById('evolveArtButton');
const evolveCostSpan = document.getElementById('evolveCost');
const evolveEligibility = document.getElementById('evolveEligibility');
const reflectionModal = document.getElementById('reflectionModal');
const closeReflectionModalButton = document.getElementById('closeReflectionModalButton');
const reflectionElement = document.getElementById('reflectionElement');
const reflectionPromptText = document.getElementById('reflectionPromptText');
const reflectionCheckbox = document.getElementById('reflectionCheckbox');
const confirmReflectionButton = document.getElementById('confirmReflectionButton');
const reflectionRewardAmount = document.getElementById('reflectionRewardAmount');
const milestoneAlert = document.getElementById('milestoneAlert');
const milestoneAlertText = document.getElementById('milestoneAlertText');
const closeMilestoneAlertButton = document.getElementById('closeMilestoneAlertButton');

// --- Utility & Setup Functions ---

function getScoreLabel(score) {
    if (typeof score !== 'number' || isNaN(score)) return "N/A"; // Handle invalid input
    if (score >= 9) return "Very High";
    if (score >= 7) return "High";
    if (score >= 5) return "Moderate";
    if (score >= 3) return "Low";
    return "Very Low";
}

function getAffinityLevel(score) {
    if (typeof score !== 'number' || isNaN(score)) return null;
    if (score >= 8) return "High";
    if (score >= 5) return "Moderate";
    return null;
}

function getElementColor(elementName) {
    // Expects full element name ("Attraction", etc.)
    const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' };
    return colors[elementName] || '#CCCCCC';
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
     // Expects full element name
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
const elementKeyToFullName = {
    A: "Attraction", I: "Interaction", S: "Sensory",
    P: "Psychological", C: "Cognitive", R: "Relational"
};


// *** Corrected euclideanDistance function ***
function euclideanDistance(userScoresObj, conceptScoresObj) {
    let sumOfSquares = 0;
    let validDimensions = 0;
    let issueFound = false;

    if (!userScoresObj || typeof userScoresObj !== 'object') {
        console.error("Invalid user scores object provided to euclideanDistance:", userScoresObj);
        return Infinity;
    }
     if (!conceptScoresObj || typeof conceptScoresObj !== 'object') {
        return Infinity; // Concept scores missing or invalid type
    }

    const expectedKeys = Object.keys(userScoresObj); // Should be ['A', 'I', 'S', 'P', 'C', 'R']
    const expectedDimensions = expectedKeys.length;

    for (const key of expectedKeys) { // Loop through A, I, S...
        const s1 = userScoresObj[key]; // User score
        const s2 = conceptScoresObj[key]; // Concept score

        const s1Valid = typeof s1 === 'number' && !isNaN(s1);
        // Check if concept HAS the key AND the value is valid
        const s2Valid = conceptScoresObj.hasOwnProperty(key) && typeof s2 === 'number' && !isNaN(s2);

        if (s1Valid && s2Valid) {
            sumOfSquares += Math.pow(s1 - s2, 2);
            validDimensions++;
        } else {
            // Only warn if concept score is the problem
            if (!s2Valid) {
                 console.warn(`Invalid/Missing CONCEPT score for element key ${key}. Concept Score: ${s2}. Concept ID: ${conceptScoresObj.id || '(concept obj missing id)'} Concept Scores:`, conceptScoresObj);
            }
            issueFound = true;
            return Infinity; // If any dimension fails, distance is unreliable
        }
    }

    // This check might be redundant if we return Infinity above, but adds safety
    if (validDimensions !== expectedDimensions) {
         console.warn(`Mismatch in valid dimensions (${validDimensions}/${expectedDimensions}) during distance calc. Scores:`, userScoresObj, conceptScoresObj);
         issueFound = true;
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
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (popupOverlay) popupOverlay.classList.add('hidden');
    currentlyDisplayedConceptId = null;
    currentReflectionElement = null;
    currentPromptId = null;
}

// --- Initialization and Questionnaire Logic ---
function initializeQuestionnaire() {
    currentElementIndex = 0;
    userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; // Use keys
    userAnswers = {}; // Use full names
    elementNames.forEach(elName => { userAnswers[elName] = {}; });
    discoveredConcepts = new Map();
    coreConcepts = new Set();
    elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; // Use full names
    elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; // Use full names
    seenPrompts = new Set();
    completedRituals = { daily: {}, weekly: {} };
    achievedMilestones = new Set();
    lastLoginDate = null;

    updateElementProgressHeader(-1);
    displayElementQuestions(currentElementIndex); // Starts questionnaire display
    showScreen('questionnaireScreen');
    if (mainNavBar) mainNavBar.classList.add('hidden');

    // Clear UI elements that might show old data
    if(dailyRitualsDisplay) dailyRitualsDisplay.innerHTML = '<li>Loading...</li>';
    if(milestonesDisplay) milestonesDisplay.innerHTML = '<li>None yet</li>';
    if(elementAttunementDisplay) elementAttunementDisplay.innerHTML = '';
    if(grimoireContentDiv) grimoireContentDiv.innerHTML = ''; // Clear grimoire view
    if(personaCoreConceptsDisplay) personaCoreConceptsDisplay.innerHTML = ''; // Clear core concepts
    updateGrimoireCounter(); // Reset counter display
}

function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) return;
    elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div'); tab.classList.add('element-tab');
        const elementData = elementDetails[name] || {};
        tab.textContent = (elementData.name || name).substring(0, 3).toUpperCase();
        tab.title = elementData.name || name;
        tab.classList.toggle('completed', index < activeIndex);
        tab.classList.toggle('active', index === activeIndex);
        elementProgressHeader.appendChild(tab);
    });
}

function displayElementQuestions(index) {
    if (index >= elementNames.length) {
        finalizeScoresAndShowPersona();
        return;
    }
    const elementName = elementNames[index]; // Full name
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || []; // Use full name

    const questionContentElement = document.getElementById('questionContent');
    if (!questionContentElement) { console.error("!!! questionContent element not found !!!"); return; }

    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    questionContentElement.innerHTML = introHTML; // Set intro, clears previous questions

    currentElementAnswers = { ...(userAnswers[elementName] || {}) };
    let questionsHTML = '';
    if (questions && questions.length > 0) {
        questions.forEach(q => {
            let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
            const savedAnswer = currentElementAnswers[q.qId];
            // Input HTML generation (Slider, Radio, Checkbox)
            if (q.type === "slider") { const val = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${val}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(val).toFixed(1)}</span></p></div>`; }
            else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const checked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
            else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const checked = savedAnswer?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
            inputHTML += `</div></div>`; questionsHTML += inputHTML;
        });
    } else {
        console.warn(`[displayElementQuestions] No questions found for element: ${elementName}`);
        questionsHTML = '<p><em>(No questions defined)</em></p>';
    }

    const introDiv = questionContentElement.querySelector('.element-intro');
    if (introDiv) { introDiv.insertAdjacentHTML('afterend', questionsHTML); }
    else { questionContentElement.innerHTML += questionsHTML; } // Fallback

    // Add Listeners AFTER inserting HTML
    questionContentElement.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.addEventListener(eventType, handleQuestionnaireInputChange); });
    questionContentElement.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => { checkbox.addEventListener('change', (event) => enforceMaxChoices(checkbox.name, parseInt(checkbox.dataset.maxChoices || 2), event)); });

    // Update other UI parts
    updateElementProgressHeader(index);
    if (progressText) progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || elementName}`;
    updateDynamicFeedback(elementName);
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block';
    if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}

function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const type = input.dataset.type;
    const elementName = elementNames[currentElementIndex];
    if (type === 'slider') {
        const qId = input.dataset.questionId;
        const display = document.getElementById(`display_${qId}`);
        if (display) display.textContent = parseFloat(input.value).toFixed(1);
    }
    collectCurrentElementAnswers();
    updateDynamicFeedback(elementName);
}

function enforceMaxChoices(name, max, event) {
     const checkboxes = questionContent?.querySelectorAll(`input[name="${name}"]:checked`);
     if (!checkboxes) return;
     if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        if (event?.target?.checked) { // Optional chaining for safety
            event.target.checked = false;
            collectCurrentElementAnswers();
            updateDynamicFeedback(elementNames[currentElementIndex]);
        }
    }
}

function collectCurrentElementAnswers() {
    const elementName = elementNames[currentElementIndex]; // Full name
    const questions = questionnaireGuided[elementName] || [];
    currentElementAnswers = {};
    questions.forEach(q => {
        const qId = q.qId;
        const container = questionContent || document;
        if (q.type === 'slider') { const input = container.querySelector(`#${qId}.q-input`); if (input) currentElementAnswers[qId] = parseFloat(input.value); }
        else if (q.type === 'radio') { const checked = container.querySelector(`input[name="${qId}"]:checked`); if (checked) currentElementAnswers[qId] = checked.value; }
        else if (q.type === 'checkbox') { const checked = container.querySelectorAll(`input[name="${qId}"]:checked`); currentElementAnswers[qId] = Array.from(checked).map(cb => cb.value); }
    });
    userAnswers[elementName] = { ...currentElementAnswers }; // Store using full name
}

function updateDynamicFeedback(elementName) { // Expects full name
    if (!dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) return;
    const tempScore = calculateElementScore(elementName, currentElementAnswers); // Pass full name
    feedbackElementSpan.textContent = elementDetails[elementName]?.name || elementName;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);
    let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
    if (!labelSpan) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode.insertBefore(document.createTextNode(' '), feedbackScoreSpan.nextSibling); feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling.nextSibling); }
    labelSpan.textContent = `(${getScoreLabel(tempScore)})`;
    feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

function calculateElementScore(elementName, answersForElement) { // Expects full name
    const questions = questionnaireGuided[elementName] || [];
    let score = 5.0;
    questions.forEach(q => {
        const answer = answersForElement[q.qId];
        let pointsToAdd = 0;
        if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); }
        else if (q.type === 'radio') { const opt = q.options.find(o => o.value === answer); pointsToAdd = opt ? (opt.points || 0) * (q.scoreWeight || 1.0) : 0; }
        else if (q.type === 'checkbox' && answer && Array.isArray(answer)) { answer.forEach(val => { const opt = q.options.find(o => o.value === val); pointsToAdd += opt ? (opt.points || 0) * (q.scoreWeight || 1.0) : 0; }); }
        score += pointsToAdd;
    });
    return Math.max(0, Math.min(10, score)); // Clamp score
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
     const finalScores = {}; // Store with keys A, I, S...
     elementNames.forEach(elementName => { // Loop through full names to calculate
         const score = calculateElementScore(elementName, userAnswers[elementName] || {});
         const key = elementNameToKey[elementName]; // Get key A, I, S...
         if (key) { finalScores[key] = score; }
     });
     userScores = finalScores; // Assign final scores with A, I, S keys
     console.log("Final User Scores:", userScores);

     determineStarterHandAndEssence(); // Calculate starter hand based on final userScores
     updateMilestoneProgress('completeQuestionnaire', 1);

     // Update displays AFTER calculations and state changes
     displayPersonaScreen();
     displayElementEssenceStudy();
     displayDailyRituals();
     displayMilestones();
     populateGrimoireFilters();
     updateGrimoireCounter();
     checkForDailyLogin(); // Check login status

     showScreen('personaScreen'); // Show the final screen
     setTimeout(() => { alert("Experiment Complete! Your initial profile is ready. Explore!"); }, 100);
}

// --- Starter Hand & Initial Essence ---
function determineStarterHandAndEssence() {
    console.log("[determineStarterHand] Function called.");
    try {
        discoveredConcepts = new Map();
        elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
        console.log("[determineStarterHand] State reset.");

        let conceptsWithDistance = [];
        console.log(`[determineStarterHand] Processing ${concepts.length} total concepts.`);

        concepts.forEach((c, index) => {
            const conceptScores = c.elementScores;
            if (!conceptScores || typeof conceptScores !== 'object') {
                console.warn(`[determineStarterHand] Concept ID ${c.id} (${c.name}) missing/invalid elementScores.`);
                return; // Skip
            }
            // Ensure userScores uses keys A,I,S... and conceptScores uses A,I,S...
            const distance = euclideanDistance(userScores, conceptScores);
            if (index < 15) { console.log(`[determineStarterHand] Dist calc for ID ${c.id} (${c.name}): ${distance}`); }
            if (distance !== Infinity && typeof distance === 'number' && !isNaN(distance)) {
                conceptsWithDistance.push({ ...c, distance: distance });
            } else {
                 console.warn(`[determineStarterHand] Skipping concept ${c.id} (${c.name}) due to invalid distance: ${distance}`);
            }
        });

        console.log(`[determineStarterHand] Found ${conceptsWithDistance.length} concepts with valid distances.`);
        if (conceptsWithDistance.length === 0) { console.error("[determineStarterHand] No concepts comparable!"); return; }

        conceptsWithDistance.sort((a, b) => a.distance - b.distance);
        console.log("[determineStarterHand] Concepts sorted by distance (Top 15):", conceptsWithDistance.slice(0,15).map(c => `${c.name}(${c.distance.toFixed(1)})`));

        const candidates = conceptsWithDistance.slice(0, 15);
        const starterHand = [];
        const representedElements = new Set(); // Use primaryElement keys (A, I, S...)
        const starterHandIds = new Set();

        // Selection logic
        for (const candidate of candidates) { if (starterHand.length >= 4) break; if (!starterHandIds.has(candidate.id)) { starterHand.push(candidate); starterHandIds.add(candidate.id); if (candidate.primaryElement) representedElements.add(candidate.primaryElement); } }
        for (const candidate of candidates) { if (starterHand.length >= 7) break; if (starterHandIds.has(candidate.id)) continue; if (!representedElements.has(candidate.primaryElement) || candidates.slice(candidates.indexOf(candidate)).every(rem => representedElements.has(rem.primaryElement) || starterHand.length >= 7)) { starterHand.push(candidate); starterHandIds.add(candidate.id); if (candidate.primaryElement) representedElements.add(candidate.primaryElement); } }
        for (const candidate of candidates) { if (starterHand.length >= 7) break; if (!starterHandIds.has(candidate.id)) { starterHand.push(candidate); starterHandIds.add(candidate.id); } }

        console.log("[determineStarterHand] Starter Hand Selected:", starterHand.map(c => c.name));
        if (starterHand.length === 0) { console.error("[determineStarterHand] Failed to select starter hand!"); return; }

        starterHand.forEach(concept => {
            discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false });
            grantEssenceForConcept(concept, 0.5); // Grant half essence
            gainAttunementForAction('discover', concept.primaryElement); // Gain attunement
        });
        console.log("[determineStarterHand] Initial Essence Granted:", elementEssence);

    } catch (error) { console.error("!!! ERROR in determineStarterHandAndEssence !!!", error); }
    console.log("[determineStarterHand] Function finished.");
}

// --- Attunement ---
function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) {
    let targetElements = []; // Use full names
    const gainAmount = amount;

    if (elementKey && elementKeyToFullName[elementKey]) { targetElements.push(elementKeyToFullName[elementKey]); }
    else if (actionType === 'completeReflection' && currentReflectionElement) { targetElements.push(currentReflectionElement); }
    else if (actionType === 'generic' || elementKey === 'All') { targetElements = elementNames; amount = 0.1; }
    else { return; } // No specific element targeted, do nothing

    targetElements.forEach(elName => {
        elementAttunement[elName] = Math.min(MAX_ATTUNEMENT, (elementAttunement[elName] || 0) + gainAmount);
    });
    console.log(`Attunement updated (${actionType}):`, elementAttunement);
    displayElementAttunement();
}

function displayElementAttunement() {
    if (!elementAttunementDisplay) return;
    elementAttunementDisplay.innerHTML = '';
    elementNames.forEach(elName => { // Loop full names for display
        const attunementValue = elementAttunement[elName] || 0; // Use full name key
        const percentage = (attunementValue / MAX_ATTUNEMENT) * 100;
        elementAttunementDisplay.innerHTML += `
            <div class="attunement-item">
                <span class="attunement-name">${elementDetails[elName]?.name || elName}:</span>
                <div class="attunement-bar-container" title="${attunementValue.toFixed(1)} / ${MAX_ATTUNEMENT}">
                    <div class="attunement-bar" style="width: ${percentage}%; background-color: ${getElementColor(elName)};"></div>
                </div>
            </div>`;
    });
}

// --- Persona Screen Functions ---
function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona details div not found!"); return; }
    personaElementDetailsDiv.innerHTML = '';
    elementNames.forEach(elementName => { // Use full name for display order/details
        const key = elementNameToKey[elementName]; // Get key A,I,S..
        const score = userScores[key]; // Use key to get score
        const scoreLabel = getScoreLabel(score);
        const elementData = elementDetails[elementName] || {}; // Use name for details
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A";
        const barWidth = (score / 10) * 100;
        const details = document.createElement('details'); details.classList.add('element-detail-entry');
        details.innerHTML = `<summary class="element-detail-header"><div><strong>${elementData.name || elementName}:</strong><span>${score?.toFixed(1) ?? '?'}</span> <span class="score-label">(${scoreLabel})</span></div><div class="score-bar-container"><div style="width: ${barWidth}%; background-color: ${getElementColor(elementName)};"></div></div></summary><div class="element-description"><p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p><p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p><hr><p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p><p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p></div>`;
        personaElementDetailsDiv.appendChild(details);
    });
    displayElementEssencePersona();
    displayElementAttunement();
    displayCoreConceptsPersona();
    synthesizeAndDisplayThemesPersona();
    displayMilestones();
}

function displayElementEssencePersona() {
    if (!elementEssenceDisplayPersona) return;
    elementEssenceDisplayPersona.innerHTML = ''; let hasEssence = false;
    elementNames.forEach(elName => { // Use full names for display
        const essenceValue = parseFloat(elementEssence[elName] || 0); // Use full name key
        if (essenceValue > 0) hasEssence = true;
        elementEssenceDisplayPersona.innerHTML += `<div class="essence-item"><span class="essence-icon" style="background-color: ${getElementColor(elName)};"></span><span class="essence-name">${elementDetails[elName]?.name || elName}:</span><span class="essence-value">${essenceValue.toFixed(1)}</span></div>`;
    });
    if (!hasEssence) { elementEssenceDisplayPersona.innerHTML += '<p style="font-size: 0.85em; text-align: left; color: #777;"><i>No Essence collected yet.</i></p>'; }
}

function displayCoreConceptsPersona() {
    if (!personaCoreConceptsDisplay) return;
    personaCoreConceptsDisplay.innerHTML = '';
    if (coreConcepts.size === 0) { personaCoreConceptsDisplay.innerHTML = '<li>Mark concepts as "Core" to build your tapestry.</li>'; return; }
    coreConcepts.forEach(conceptId => {
        const concept = concepts.find(c => c.id === conceptId);
        if (concept) {
            const item = document.createElement('div'); item.classList.add('core-concept-item'); item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`;
            item.innerHTML = `<i class="${getCardTypeIcon(concept.cardType)}"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`;
            item.addEventListener('click', () => showConceptDetailPopup(concept.id)); personaCoreConceptsDisplay.appendChild(item);
        }
    });
}

function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return;
     personaThemesList.innerHTML = '';
     if (coreConcepts.size === 0) { personaThemesList.innerHTML = '<li>Mark Core Concepts to reveal themes.</li>'; return; }
     const elementCounts = {}; elementNames.forEach(name => { elementCounts[name] = 0; }); // Use full names
     const threshold = 7.0;
     coreConcepts.forEach(id => {
         const concept = concepts.find(c => c.id === id);
         if (concept?.elementScores) {
             for (const key in concept.elementScores) { // Loop keys A,I,S...
                 if (concept.elementScores[key] >= threshold) {
                     const fullName = elementKeyToFullName[key]; // Convert key to name
                     if (fullName) elementCounts[fullName]++;
                 }
             }
         }
     });
     const sortedThemes = Object.entries(elementCounts).filter(([_, count]) => count > 0).sort(([, a], [, b]) => b - a);
     if (sortedThemes.length === 0) { personaThemesList.innerHTML = '<li>No strong themes among Core Concepts.</li>'; return; }
     sortedThemes.slice(0, 3).forEach(([elementName, count]) => {
         const li = document.createElement('li'); li.textContent = `${elementDetails[elementName]?.name || elementName} Focus (${count} Core concepts)`; personaThemesList.appendChild(li);
     });
}

// --- Study Screen Functions ---
function displayElementEssenceStudy() {
     if (!elementEssenceDisplayStudy) return;
     elementEssenceDisplayStudy.innerHTML = '';
     elementNames.forEach(elName => { // Use full names for display/interaction
         const currentEssence = parseFloat(elementEssence[elName] || 0); // Use full name key
         const canAfford = currentEssence >= RESEARCH_COST;
         const counter = document.createElement('div'); counter.classList.add('essence-counter'); counter.dataset.element = elName; // Store full name
         counter.title = `Research ${elementDetails[elName]?.name || elName} (Cost: ${RESEARCH_COST})`;
         counter.classList.toggle('disabled', !canAfford);
         counter.innerHTML = `<span class="essence-icon" style="background-color: ${getElementColor(elName)};"></span><span class="essence-name">${elementDetails[elName]?.name || elName}</span><span class="essence-value">${currentEssence.toFixed(1)}</span><div class="essence-cost">Cost: ${RESEARCH_COST}</div>`;
         if (canAfford) { counter.addEventListener('click', handleResearchClick); }
         elementEssenceDisplayStudy.appendChild(counter);
     });
}

function handleResearchClick(event) {
    const elementName = event.currentTarget.dataset.element; // Full name
    if (!elementName || event.currentTarget.classList.contains('disabled')) return;
    const currentEssence = parseFloat(elementEssence[elementName] || 0); // Use full name key
    if (currentEssence >= RESEARCH_COST) {
        elementEssence[elementName] = currentEssence - RESEARCH_COST; // Use full name key
        console.log(`Spent ${RESEARCH_COST} ${elementName} Essence.`);
        displayElementEssenceStudy(); // Update display
        conductResearch(elementName); // Pass full name
        updateMilestoneProgress('conductResearch', 1); // Track action for milestone
    } else { alert(`Not enough ${elementDetails[elementName]?.name || elementName} Essence!`); }
}

function conductResearch(elementNameToResearch) { // Expects full name
    console.log(`Researching Element: ${elementNameToResearch}`);
    if (researchStatus) researchStatus.textContent = `Researching ${elementDetails[elementNameToResearch]?.name || elementNameToResearch}...`;
    if (researchModalContent) researchModalContent.innerHTML = '';

    const discoveredIds = new Set(discoveredConcepts.keys());
    const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));
    if (undiscoveredPool.length === 0) { if(researchModalStatus) researchModalStatus.textContent = "No new concepts left!"; if (researchModal) researchModal.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden'); if (researchStatus) researchStatus.textContent = "Research complete. No new concepts."; return; }

    const elementKeyToResearch = elementNameToKey[elementNameToResearch]; // Key A,I,S...
    const currentAttunement = elementAttunement[elementNameToResearch] || 0; // Use full name for attunement

    const priorityPool = [], secondaryPool = [], tertiaryPool = [...undiscoveredPool];
     undiscoveredPool.forEach(c => { const score = c.elementScores?.[elementKeyToResearch] || 0; const primary = c.primaryElement === elementKeyToResearch; const index = tertiaryPool.findIndex(tc => tc.id === c.id); if (primary || score >= 8.0) { priorityPool.push(c); if (index > -1) tertiaryPool.splice(index, 1); } else if (score >= 5.0) { secondaryPool.push(c); if (index > -1) tertiaryPool.splice(index, 1); } });

    const selectedForOutput = [];
    const selectWeightedRandomFromPool = (pool) => {
        if (pool.length === 0) return null;
        let totalWeight = 0; const weightedPool = pool.map(card => { let weight = 1.0; const rarityBonus = Math.max(1, (currentAttunement / MAX_ATTUNEMENT) * 2); if (card.rarity === 'uncommon') weight *= (1.5 * rarityBonus); if (card.rarity === 'rare') weight *= (2.0 * rarityBonus); totalWeight += weight; return { card, weight }; }); let randomPick = Math.random() * totalWeight; let chosenCard = null; for (let i = 0; i < weightedPool.length; i++) { const item = weightedPool[i]; if (randomPick < item.weight) { chosenCard = item.card; const originalIndex = pool.findIndex(c => c.id === chosenCard.id); if (originalIndex > -1) pool.splice(originalIndex, 1); break; } randomPick -= item.weight; } if (!chosenCard && pool.length > 0) { console.warn("Weighted selection fallback."); const fallbackIndex = Math.floor(Math.random() * pool.length); chosenCard = pool[fallbackIndex]; pool.splice(fallbackIndex, 1); } return chosenCard;
    };

    for (let i = 0; i < 3; i++) { let selectedCard = selectWeightedRandomFromPool(priorityPool) || selectWeightedRandomFromPool(secondaryPool) || selectWeightedRandomFromPool(tertiaryPool); if (selectedCard) selectedForOutput.push(selectedCard); else break; }

    if (selectedForOutput.length > 0) {
        if (researchModalStatus) researchModalStatus.textContent = `Discovered ${selectedForOutput.length} new concept(s)! Click to add to Grimoire.`;
        selectedForOutput.forEach(concept => { const cardElement = renderCard(concept, 'research-result'); if (researchModalContent) researchModalContent.appendChild(cardElement); });
        if (researchStatus) researchStatus.textContent = `Research complete. Check the results!`;
         gainAttunementForAction('researchSuccess', elementKeyToResearch); // Attunement for successful research
    } else { /* ... (handle no concepts found) ... */ }

    if (researchModal) researchModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Grimoire Functions ---
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") {
    if (!grimoireContentDiv) return;
    grimoireContentDiv.innerHTML = '';
    if (discoveredConcepts.size === 0) { grimoireContentDiv.innerHTML = '<p style="text-align: center; color: #666;">Grimoire is empty. Research in The Study!</p>'; showScreen('grimoireScreen'); return; }

    let discoveredArray = Array.from(discoveredConcepts.values());
    const conceptsToDisplay = discoveredArray.filter(data => {
        const typeMatch = (filterType === "All") || (data.concept.cardType === filterType);
        const primaryElFullName = elementKeyToFullName[data.concept.primaryElement];
        const elementMatch = (filterElement === "All") || (primaryElFullName === filterElement);
        const rarityMatch = (filterRarity === "All") || (data.concept.rarity === filterRarity);
        return typeMatch && elementMatch && rarityMatch;
    });

    // Sorting
    if (sortBy === 'name') conceptsToDisplay.sort((a, b) => a.concept.name.localeCompare(b.concept.name));
    else if (sortBy === 'type') conceptsToDisplay.sort((a, b) => a.concept.cardType.localeCompare(b.concept.cardType) || a.concept.name.localeCompare(b.concept.name));
    else if (sortBy === 'rarity') { const order = { 'common': 1, 'uncommon': 2, 'rare': 3 }; conceptsToDisplay.sort((a, b) => (order[a.concept.rarity] || 0) - (order[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name)); }
    else conceptsToDisplay.sort((a,b) => a.discoveredTime - b.discoveredTime);

    if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p style="text-align: center; color: #666;">No concepts match filters.</p>`; }
    else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); grimoireContentDiv.appendChild(cardElement); }); }
    showScreen('grimoireScreen');
}

function populateGrimoireFilters() {
    // Populate Type Filter
    if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); }
    // Populate Element Filter (using full names)
    if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = name; option.textContent = name; grimoireElementFilter.appendChild(option); }); }
    // Rarity filter is static HTML for now
}

function updateGrimoireCounter() {
     if (grimoireCountSpan) grimoireCountSpan.textContent = discoveredConcepts.size;
}

// --- Card Rendering Function ---
function renderCard(concept, context = 'grimoire') {
    if (!concept) return document.createElement('div'); // Return empty div if concept is invalid
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `Click to view details for ${concept.name}`;

    const discoveredData = discoveredConcepts.get(concept.id);
    const isDiscovered = !!discoveredData;
    const isCore = coreConcepts.has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false;

    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    const coreStampHTML = isCore ? '<span class="core-indicator" title="Core Concept">★</span>' : '';
    const cardTypeIcon = getCardTypeIcon(concept.cardType);

    let affinitiesHTML = '';
    if (concept.elementScores) {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
            const level = getAffinityLevel(score);
            if (level) {
                const fullName = elementKeyToFullName[key];
                const color = getElementColor(fullName);
                const levelClass = level === "High" ? "affinity-high" : "";
                affinitiesHTML += `<span class="affinity ${levelClass}" style="border-color: ${color}; color: ${color}; background-color: ${hexToRgba(color, 0.1)};" title="${elementDetails[fullName]?.name || fullName} Affinity"><i class="${getElementIcon(fullName)}"></i> ${level.substring(0, 3)}</span> `;
            }
        });
    }

    const currentVisualHandle = artUnlocked ? (concept.visualHandleUnlocked || concept.visualHandle) : concept.visualHandle;
    // TODO: Replace icon with actual image/style based on visualHandle
    const visualClass = artUnlocked ? "fas fa-star card-art-unlocked" : "fas fa-question card-visual-placeholder";

    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${coreStampHTML}${grimoireStampHTML}</span>
        </div>
        <div class="card-visual">
            <i class="${visualClass}" title="${currentVisualHandle}"></i>
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888;">Low Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
        </div>
    `;

    if (context !== 'no-click') {
         cardDiv.addEventListener('click', () => showConceptDetailPopup(concept.id));
    }
    return cardDiv;
}


// --- Concept Detail Pop-up Logic ---
function showConceptDetailPopup(conceptId) {
     currentlyDisplayedConceptId = conceptId; const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData || !conceptData.elementScores) { console.error(`Data/scores missing: ${conceptId}`); hidePopups(); return; }
     if(popupCardTypeIcon) popupCardTypeIcon.className = `${getCardTypeIcon(conceptData.cardType)} card-type-icon`; if(popupConceptName) popupConceptName.textContent = conceptData.name; if(popupConceptType) popupConceptType.textContent = conceptData.cardType;
     const discoveredData = discoveredConcepts.get(conceptId); const artUnlocked = discoveredData?.artUnlocked || false; const currentVisualHandle = artUnlocked ? (conceptData.visualHandleUnlocked || conceptData.visualHandle) : conceptData.visualHandle;
     if(popupCardVisual) popupCardVisual.className = `fas ${artUnlocked ? 'fa-star card-art-unlocked' : 'fa-question card-visual-placeholder'}`; // Update visual
     if(popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No details."; if(popupComparisonHighlights) popupComparisonHighlights.innerHTML = ''; if(popupConceptProfile) popupConceptProfile.innerHTML = ''; if(popupUserComparisonProfile) popupUserComparisonProfile.innerHTML = ''; if(popupRelatedConceptsList) popupRelatedConceptsList.innerHTML = '';
     const distance = euclideanDistance(userScores, conceptData.elementScores);
     displayPopupResonance(distance); displayPopupRecipeComparison(conceptData); displayPopupRelatedConcepts(conceptData); displayEvolutionSection(conceptData, discoveredData);
     updateGrimoireButtonStatus(conceptId); updateCoreButtonStatus(conceptId);
     if (popupOverlay) popupOverlay.classList.remove('hidden'); if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
}

function displayPopupResonance(distance) { /* ... (same logic as before) ... */ }
function displayPopupRecipeComparison(conceptData) { /* ... (same logic as before) ... */ }
function displayPopupRelatedConcepts(conceptData) { /* ... (same logic as before) ... */ }
function handleRelatedConceptClick(event) { /* ... (same logic as before) ... */ }
function displayEvolutionSection(conceptData, discoveredData) { /* ... (same logic as before) ... */ }
function attemptArtEvolution(conceptId, essenceElement, cost) { /* ... (same logic as before) ... */ }

// --- Grimoire/Core Button & State Logic ---
function grantEssenceForConcept(concept, multiplier = 1.0) { /* ... (same logic as before, uses elementKeyToFullName) ... */ }
function addToGrimoire() { /* ... (same logic as before) ... */ }
function toggleCoreConcept() { /* ... (same logic as before) ... */ }
function checkAndApplySynergyBonus(concept, action) { /* ... (same logic as before) ... */ }
function updateGrimoireButtonStatus(conceptId) { /* ... (same logic as before) ... */ }
function updateCoreButtonStatus(conceptId) { /* ... (same logic as before) ... */ }

// --- Reflection Prompts ---
let cardsAddedSinceLastPrompt = 0; let promptCooldownActive = false; let currentReflectionElement = null; let currentPromptId = null;
function checkTriggerReflectionPrompt(triggerAction = 'other') { /* ... (same logic as before) ... */ }
function displayReflectionPrompt() { /* ... (same logic as before) ... */ }
function handleConfirmReflection() { /* ... (same logic as before) ... */ }

// --- Rituals & Milestones ---
function displayDailyRituals() { /* ... (same logic as before) ... */ }
function checkAndUpdateRituals(action, count = 1) { /* ... (same logic as before) ... */ }
function displayMilestones() { /* ... (same logic as before) ... */ }
function updateMilestoneProgress(trackType, currentValue) { /* ... (same logic as before) ... */ }
function showMilestoneAlert(text) { /* ... (same logic as before) ... */ }
function hideMilestoneAlert() { /* ... (same logic as before) ... */ }
function showTemporaryMessage(message, duration = 3000) { /* ... (same logic as before) ... */ }

// --- Reset App ---
function resetApp() { /* ... (same logic as before) ... */ }

// --- Daily Login Check ---
function checkForDailyLogin() { /* ... (same logic as before) ... */ }

// --- Event Listeners (MUST BE AT THE END) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Card Concept Expanded...");
    // Attach ALL listeners (Defensive checks included)
    if (startButton) startButton.addEventListener('click', initializeQuestionnaire); else console.error("Start button not found!");
    console.log('Type of nextElement before attaching listener:', typeof nextElement); // Debug log added earlier
    if (nextElementButton) nextElementButton.addEventListener('click', nextElement); else console.error("Next button not found!");
    if (prevElementButton) prevElementButton.addEventListener('click', prevElement); else console.error("Prev button not found!");
    if (restartButtonPersona) restartButtonPersona.addEventListener('click', resetApp); else console.error("Restart button not found!");
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopups); else console.error("Close Popup button not found!");
    if (popupOverlay) popupOverlay.addEventListener('click', hidePopups); else console.error("Popup Overlay not found!");
    if (closeResearchModalButton) closeResearchModalButton.addEventListener('click', hidePopups); else console.error("Close Research Modal button not found!");
    if (closeReflectionModalButton) closeReflectionModalButton.addEventListener('click', hidePopups); else console.error("Close Reflection Modal button not found!");
    if (closeMilestoneAlertButton) closeMilestoneAlertButton.addEventListener('click', hideMilestoneAlert); else console.error("Close Milestone Alert button not found!");
    if (addToGrimoireButton) addToGrimoireButton.addEventListener('click', addToGrimoire); else console.error("Add to Grimoire button not found!");
    if (markAsCoreButton) markAsCoreButton.addEventListener('click', toggleCoreConcept); else console.error("Mark as Core button not found!");
    // Note: Evolve button listener added dynamically in displayEvolutionSection
    if (grimoireTypeFilter) grimoireTypeFilter.addEventListener('change', (e) => displayGrimoire(e.target.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value)); else console.error("Grimoire Type filter not found!");
    if (grimoireElementFilter) grimoireElementFilter.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, e.target.value, grimoireSortOrder.value, grimoireRarityFilter.value)); else console.error("Grimoire Element filter not found!");
    if (grimoireRarityFilter) grimoireRarityFilter.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, e.target.value)); else console.error("Grimoire Rarity filter not found!");
    if (grimoireSortOrder) grimoireSortOrder.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, e.target.value, grimoireRarityFilter.value)); else console.error("Grimoire Sort order not found!");
    if (reflectionCheckbox) reflectionCheckbox.addEventListener('change', () => { if(confirmReflectionButton) confirmReflectionButton.disabled = !reflectionCheckbox.checked; }); else console.error("Reflection checkbox not found!");
    if (confirmReflectionButton) confirmReflectionButton.addEventListener('click', handleConfirmReflection); else console.error("Confirm Reflection button not found!");

    navButtons.forEach(button => { button.addEventListener('click', () => { const targetScreen = button.dataset.target; if(!document.getElementById(targetScreen)) { console.error(`Target screen #${targetScreen} not found!`); return; } if (targetScreen === 'personaScreen') { displayPersonaScreen(); } if (targetScreen === 'studyScreen') { displayElementEssenceStudy(); displayDailyRituals(); } if (targetScreen === 'grimoireScreen') { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); } showScreen(targetScreen); }); });

    // --- Initial Setup ---
    // TODO: Load state from LocalStorage here
    showScreen('welcomeScreen');
    console.log("Initial screen set to Welcome.");
}); // End DOMContentLoaded
