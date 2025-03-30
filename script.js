let currentElementIndex = 0;
let userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; // Use single letter keys
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"]; // Full names for display/logic
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"]; // For filtering
let currentElementAnswers = {};
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // ID -> { concept, discoveredTime, artUnlocked: boolean }
let coreConcepts = new Set(); // Track IDs marked as core
// Use full names as keys for easier lookup from UI events/data
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
    if (score >= 9) return "Very High";
    if (score >= 7) return "High";
    if (score >= 5) return "Moderate";
    if (score >= 3) return "Low";
    return "Very Low";
}

function getAffinityLevel(score) {
    if (score >= 8) return "High";
    if (score >= 5) return "Moderate";
    return null;
}

function getElementColor(elementName) {
    const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' };
    return colors[elementName] || '#CCCCCC';
}

function hexToRgba(hex, alpha = 1) {
     if (!hex || typeof hex !== 'string') return `rgba(128,128,128, ${alpha})`; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return `rgba(128,128,128, ${alpha})`; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `rgba(${r},${g},${b},${alpha})`;
}

function getCardTypeIcon(cardType) {
    switch (cardType) { case "Orientation": return "fa-solid fa-compass"; case "Identity/Role": return "fa-solid fa-mask"; case "Practice/Kink": return "fa-solid fa-gear"; case "Psychological/Goal": return "fa-solid fa-brain"; case "Relationship Style": return "fa-solid fa-heart"; default: return "fa-solid fa-question-circle"; }
}

function getElementIcon(elementName) {
     switch (elementName) { case "Attraction": return "fa-solid fa-magnet"; case "Interaction": return "fa-solid fa-users"; case "Sensory": return "fa-solid fa-hand-sparkles"; case "Psychological": return "fa-solid fa-comment-dots"; case "Cognitive": return "fa-solid fa-lightbulb"; case "Relational": return "fa-solid fa-link"; default: return "fa-solid fa-atom"; }
}

// --- Utility Maps ---
const elementNameToKey = {
    "Attraction": "A", "Interaction": "I", "Sensory": "S",
    "Psychological": "P", "Cognitive": "C", "Relational": "R"
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
        return Infinity; // Cannot calculate distance
    }

    const expectedDimensions = Object.keys(userScoresObj).length;
    for (const key of Object.keys(userScoresObj)) {
        const s1 = userScoresObj[key];
        const s2 = conceptScoresObj[key];

        const s1Valid = typeof s1 === 'number' && !isNaN(s1);
        const s2Valid = typeof s2 === 'number' && !isNaN(s2);

        if (s1Valid && s2Valid) {
            sumOfSquares += Math.pow(s1 - s2, 2);
            validDimensions++;
        } else {
            if (!s2Valid) {
                 console.warn(`Invalid CONCEPT score for element key ${key}. Concept Score: ${s2}. Concept ID: ${conceptScoresObj.id || '(unknown)'} Concept Scores:`, conceptScoresObj);
            }
            issueFound = true;
            return Infinity;
        }
    }

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
    if (reflectionModal) reflectionModal.classList.add('hidden'); // Hide reflection modal too
    if (popupOverlay) popupOverlay.classList.add('hidden');
    currentlyDisplayedConceptId = null;
    currentReflectionElement = null; // Reset reflection state on close
    currentPromptId = null;
}

// --- Initialization and Questionnaire Logic ---
function initializeQuestionnaire() {
    currentElementIndex = 0;
    userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 };
    userAnswers = {};
    elementNames.forEach(elName => { userAnswers[elName] = {}; });
    discoveredConcepts = new Map();
    coreConcepts = new Set();
    elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
    elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
    seenPrompts = new Set();
    completedRituals = { daily: {}, weekly: {} };
    achievedMilestones = new Set();
    lastLoginDate = null;

    updateElementProgressHeader(-1);
    displayElementQuestions(currentElementIndex);
    showScreen('questionnaireScreen');
    if (mainNavBar) mainNavBar.classList.add('hidden');

    // Clear persistent displays
    if(dailyRitualsDisplay) dailyRitualsDisplay.innerHTML = '<li>Loading...</li>';
    if(milestonesDisplay) milestonesDisplay.innerHTML = '<li>None yet</li>';
    if(elementAttunementDisplay) elementAttunementDisplay.innerHTML = '';
}

function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) return;
    elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div'); tab.classList.add('element-tab');
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
    const elementName = elementNames[index];
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || [];
    const questionContentElement = document.getElementById('questionContent');
    if (!questionContentElement) { console.error("!!! questionContent element not found !!!"); return; }

    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    questionContentElement.innerHTML = introHTML;

    currentElementAnswers = { ...(userAnswers[elementName] || {}) };
    let questionsHTML = '';
    if (questions && questions.length > 0) {
        questions.forEach(q => {
            let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
            const savedAnswer = currentElementAnswers[q.qId];
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
        if (event && event.target && event.target.checked) {
            event.target.checked = false;
            collectCurrentElementAnswers();
            updateDynamicFeedback(elementNames[currentElementIndex]);
        }
    }
}

function collectCurrentElementAnswers() {
    const elementName = elementNames[currentElementIndex];
    const questions = questionnaireGuided[elementName] || [];
    currentElementAnswers = {};
    questions.forEach(q => {
        const qId = q.qId;
        const container = questionContent || document;
        if (q.type === 'slider') { const input = container.querySelector(`#${qId}.q-input`); if (input) currentElementAnswers[qId] = parseFloat(input.value); }
        else if (q.type === 'radio') { const checked = container.querySelector(`input[name="${qId}"]:checked`); if (checked) currentElementAnswers[qId] = checked.value; }
        else if (q.type === 'checkbox') { const checked = container.querySelectorAll(`input[name="${qId}"]:checked`); currentElementAnswers[qId] = Array.from(checked).map(cb => cb.value); }
    });
    userAnswers[elementName] = { ...currentElementAnswers };
}

function updateDynamicFeedback(elementName) {
    if (!dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) return;
    const tempScore = calculateElementScore(elementName, currentElementAnswers);
    feedbackElementSpan.textContent = elementDetails[elementName]?.name || elementName;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);
    let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
    if (!labelSpan) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode.insertBefore(document.createTextNode(' '), feedbackScoreSpan.nextSibling); feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling.nextSibling); }
    labelSpan.textContent = `(${getScoreLabel(tempScore)})`;
    feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

function calculateElementScore(elementName, answersForElement) {
    const questions = questionnaireGuided[elementName] || [];
    let score = 5.0;
    questions.forEach(q => {
        const answer = answersForElement[q.qId];
        let pointsToAdd = 0;
        if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); }
        else if (q.type === 'radio') { const selectedOption = q.options.find(opt => opt.value === answer); pointsToAdd = selectedOption ? (selectedOption.points || 0) * (q.scoreWeight || 1.0) : 0; }
        else if (q.type === 'checkbox' && answer && Array.isArray(answer)) { answer.forEach(val => { const selectedOption = q.options.find(opt => opt.value === val); pointsToAdd += selectedOption ? (selectedOption.points || 0) * (q.scoreWeight || 1.0) : 0; }); }
        score += pointsToAdd;
    });
    return Math.max(0, Math.min(10, score));
}

// *** MUST BE DEFINED BEFORE finalizeScoresAndShowPersona or event listeners ***
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
     const finalScores = {};
     elementNames.forEach(elementName => {
         const score = calculateElementScore(elementName, userAnswers[elementName] || {});
         const key = elementNameToKey[elementName];
         if (key) { finalScores[key] = score; }
     });
     userScores = finalScores;
     console.log("Final User Scores:", userScores);

     determineStarterHandAndEssence();
     updateMilestoneProgress('completeQuestionnaire', 1);
     displayPersonaScreen();
     displayElementEssenceStudy();
     displayDailyRituals();
     displayMilestones();
     populateGrimoireFilters();
     updateGrimoireCounter();
     checkForDailyLogin();
     showScreen('personaScreen');
     setTimeout(() => { alert("Experiment Complete! Your initial profile is ready. You've received a Starter Hand, Essence, and Daily Rituals. Explore!"); }, 100);
}

// --- Starter Hand & Initial Essence ---
// --- Starter Hand & Initial Essence (Revised for Debugging) ---
function determineStarterHandAndEssence() {
    console.log("[determineStarterHand] Function called."); // Log entry
    try { // Add a try...catch block to catch unexpected errors
        discoveredConcepts = new Map();
        // Reset essence using full names as keys
        elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
        console.log("[determineStarterHand] State reset.");

        let conceptsWithDistance = [];
        console.log(`[determineStarterHand] Processing ${concepts.length} total concepts.`);

        concepts.forEach((c, index) => {
            // Explicitly check if elementScores exists and is an object
            const conceptScores = c.elementScores;
            if (!conceptScores || typeof conceptScores !== 'object') {
                console.warn(`[determineStarterHand] Concept ID ${c.id} (${c.name}) has missing or invalid elementScores:`, conceptScores);
                return; // Skip this concept if scores are bad
            }

            // Pass userScores (keys A,I,S...) & conceptScores (keys A,I,S...)
            const distance = euclideanDistance(userScores, conceptScores);

            // Log distance calculation for first few concepts
            if (index < 15) { // Log more examples
                console.log(`[determineStarterHand] Dist calc for ID ${c.id} (${c.name}): ${distance}`);
            }

            if (distance !== Infinity && typeof distance === 'number' && !isNaN(distance)) {
                conceptsWithDistance.push({ ...c, distance: distance });
            } else {
                 console.warn(`[determineStarterHand] Skipping concept ${c.id} (${c.name}) due to invalid distance: ${distance}`);
            }
        });

        console.log(`[determineStarterHand] Found ${conceptsWithDistance.length} concepts with valid distances.`);

        if (conceptsWithDistance.length === 0) {
            console.error("[determineStarterHand] No concepts had valid distances! Cannot select starter hand. Check concept score data in data.js and userScores:", userScores);
            alert("Error: Could not determine initial concept suggestions. Please check console (F12)."); // Alert user
            return;
        }

        conceptsWithDistance.sort((a, b) => a.distance - b.distance);
         console.log("[determineStarterHand] Concepts sorted by distance (Top 15 shown):", conceptsWithDistance.slice(0,15).map(c => `${c.name} (Dist: ${c.distance.toFixed(2)})`));

        const candidates = conceptsWithDistance.slice(0, 15);
        const starterHand = [];
        const representedElements = new Set(); // Use primaryElement keys (A, I, S...)
        const starterHandIds = new Set();

        // Selection logic (same as before)
        for (const candidate of candidates) { if (starterHand.length >= 4) break; if (!starterHandIds.has(candidate.id)) { starterHand.push(candidate); starterHandIds.add(candidate.id); if (candidate.primaryElement) representedElements.add(candidate.primaryElement); } }
        for (const candidate of candidates) { if (starterHand.length >= 7) break; if (starterHandIds.has(candidate.id)) continue; if (!representedElements.has(candidate.primaryElement) || candidates.slice(candidates.indexOf(candidate)).every(rem => representedElements.has(rem.primaryElement) || starterHand.length >= 7)) { starterHand.push(candidate); starterHandIds.add(candidate.id); if (candidate.primaryElement) representedElements.add(candidate.primaryElement); } }
        for (const candidate of candidates) { if (starterHand.length >= 7) break; if (!starterHandIds.has(candidate.id)) { starterHand.push(candidate); starterHandIds.add(candidate.id); } }

        console.log("[determineStarterHand] Starter Hand Selected:", starterHand.map(c => c.name));

        if (starterHand.length === 0) {
             console.error("[determineStarterHand] Failed to select any cards for starter hand despite valid distances!");
             return; // Avoid errors if selection failed
        }

        starterHand.forEach(concept => {
            discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false }); // Add artUnlocked flag
            grantEssenceForConcept(concept, 0.5); // Grant half essence for starter hand
            gainAttunementForAction('discover', concept.primaryElement); // Gain attunement
        });
        console.log("[determineStarterHand] Initial Essence Granted:", elementEssence);

    } catch (error) {
        console.error("!!! CRITICAL ERROR within determineStarterHandAndEssence !!!", error);
        alert("An unexpected error occurred while generating initial concepts. Please check the console (F12).");
    }
     console.log("[determineStarterHand] Function finished."); // Log exit
} // <<<<---- THIS IS THE END OF THE FUNCTION TO PASTE

// --- Attunement ---
function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) { /* ... (same logic as before) ... */ }
function displayElementAttunement() { /* ... (same logic as before) ... */ }

// --- Persona Screen Functions ---
function displayPersonaScreen() { /* ... (same logic as before) ... */ }
function displayElementEssencePersona() { /* ... (same logic as before) ... */ }
function displayCoreConceptsPersona() { /* ... (same logic as before) ... */ }
function synthesizeAndDisplayThemesPersona() { /* ... (same logic as before) ... */ }

// --- Study Screen Functions ---
function displayElementEssenceStudy() { /* ... (same logic as before) ... */ }
function handleResearchClick(event) { /* ... (same logic as before) ... */ }
function conductResearch(elementNameToResearch) { /* ... (same logic as before, includes weighted selection) ... */ }

// --- Grimoire Functions ---
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") { /* ... (same logic as before, includes rarity filter) ... */ }
function populateGrimoireFilters() { /* ... (same logic as before) ... */ }
function updateGrimoireCounter() { /* ... (same logic as before) ... */ }

// --- Card Rendering Function ---
function renderCard(concept, context = 'grimoire') { /* ... (same logic as before, includes rarity and art unlock) ... */ }

// --- Concept Detail Pop-up Logic ---
function showConceptDetailPopup(conceptId) { /* ... (same logic as before, calls displayEvolutionSection) ... */ }
function displayPopupResonance(distance) { /* ... (same logic as before) ... */ }
function displayPopupRecipeComparison(conceptData) { /* ... (same logic as before) ... */ }
function displayPopupRelatedConcepts(conceptData) { /* ... (same logic as before) ... */ }
function handleRelatedConceptClick(event) { /* ... (same logic as before) ... */ }
function displayEvolutionSection(conceptData, discoveredData) { /* ... (same logic as before) ... */ }
function attemptArtEvolution(conceptId, essenceElement, cost) { /* ... (same logic as before) ... */ }

// --- Grimoire/Core Button & State Logic ---
function grantEssenceForConcept(concept, multiplier = 1.0) { /* ... (same logic as before) ... */ }
function addToGrimoire() { /* ... (same logic as before, includes synergy, attunement, milestone, reflection trigger, ritual check) ... */ }
function toggleCoreConcept() { /* ... (same logic as before, includes synergy, attunement, milestone, evolution check, ritual check) ... */ }
function checkAndApplySynergyBonus(concept, action) { /* ... (same logic as before) ... */ }
function updateGrimoireButtonStatus(conceptId) { /* ... (same logic as before) ... */ }
function updateCoreButtonStatus(conceptId) { /* ... (same logic as before) ... */ }

// --- Reflection Prompts ---
let cardsAddedSinceLastPrompt = 0; // Moved outside function
let promptCooldownActive = false; // Moved outside function
let currentReflectionElement = null; // Moved outside function
let currentPromptId = null; // Moved outside function
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
function resetApp() { /* ... (same logic as before, ensures all state is reset) ... */ }

// --- Daily Login Check ---
function checkForDailyLogin() { /* ... (same logic as before) ... */ }

// --- Event Listeners (MUST BE AT THE END) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Card Concept Expanded...");

    // Attach ALL listeners
    if (startButton) startButton.addEventListener('click', initializeQuestionnaire); else console.error("Start button not found!");
    console.log('Type of nextElement before attaching listener:', typeof nextElement);
    if (nextElementButton) nextElementButton.addEventListener('click', nextElement); else console.error("Next button not found!"); // Error was here!
    if (prevElementButton) prevElementButton.addEventListener('click', prevElement); else console.error("Prev button not found!");
    if (restartButtonPersona) restartButtonPersona.addEventListener('click', resetApp); else console.error("Restart button not found!");
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopups); else console.error("Close Popup button not found!");
    if (popupOverlay) popupOverlay.addEventListener('click', hidePopups); else console.error("Popup Overlay not found!");
    if (closeResearchModalButton) closeResearchModalButton.addEventListener('click', hidePopups); else console.error("Close Research Modal button not found!");
    if (closeReflectionModalButton) closeReflectionModalButton.addEventListener('click', hidePopups); else console.error("Close Reflection Modal button not found!");
    if (closeMilestoneAlertButton) closeMilestoneAlertButton.addEventListener('click', hideMilestoneAlert); else console.error("Close Milestone Alert button not found!");
    if (addToGrimoireButton) addToGrimoireButton.addEventListener('click', addToGrimoire); else console.error("Add to Grimoire button not found!");
    if (markAsCoreButton) markAsCoreButton.addEventListener('click', toggleCoreConcept); else console.error("Mark as Core button not found!");
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
