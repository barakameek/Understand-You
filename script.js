let currentElementIndex = 0;
let userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; // Default scores
let userAnswers = {}; // Stores answers keyed by FULL element names during questionnaire
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"]; // Full names for display/logic
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"]; // For filtering
let currentElementAnswers = {}; // Temp storage for current element's answers
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // ID -> { concept, discoveredTime, artUnlocked: boolean }
let focusedConcepts = new Set(); // Track IDs marked as "Focus"
let focusSlotsTotal = 5; // Starting number of Focus slots
const MAX_FOCUS_SLOTS = 12; // Absolute maximum focus slots achievable
let userInsight = 10; // Start with some initial Insight
let elementAttunement = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; // Default attunement
const MAX_ATTUNEMENT = 100;
const BASE_RESEARCH_COST = 15; // Base Insight cost for research
const ART_EVOLVE_COST = 20; // Insight cost for art evolution
const DISSONANCE_THRESHOLD = 6.5; // Distance score above which dissonance reflection triggers
const SCORE_NUDGE_AMOUNT = 0.15; // How much score changes on nudge
let freeResearchAvailableToday = false;
let currentReflectionContext = null; // e.g., 'Dissonance', 'Standard'
let reflectionTargetConceptId = null; // Stores concept ID for dissonance reflection actions
let seenPrompts = new Set();
let completedRituals = { daily: {}, weekly: {} }; // Track by ID: { completed: boolean, progress: number }
let achievedMilestones = new Set();
let lastLoginDate = null;
let cardsAddedSinceLastPrompt = 0;
let promptCooldownActive = false;
let currentReflectionElement = null; // Store the FULL NAME of the element for reflection
let currentPromptId = null; // Store the ID of the prompt shown
let toastTimeout = null; // For tracking the toast message timeout

// --- Persistence Key ---
const SAVE_KEY = 'personaAlchemyLabSaveData';

// --- DOM Elements (Ensure IDs match index.html v10) ---
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
const userInsightDisplayPersona = document.getElementById('userInsightDisplayPersona');
const focusedConceptsDisplay = document.getElementById('focusedConceptsDisplay');
const focusedConceptsHeader = document.getElementById('focusedConceptsHeader');
const personaThemesList = document.getElementById('personaThemesList');
const restartButtonPersona = document.getElementById('restartButtonPersona');
const studyScreen = document.getElementById('studyScreen');
const userInsightDisplayStudy = document.getElementById('userInsightDisplayStudy');
const researchButtonContainer = document.getElementById('researchButtonContainer');
const freeResearchButton = document.getElementById('freeResearchButton');
const researchStatus = document.getElementById('researchStatus');
const researchOutput = document.getElementById('researchOutput'); // Added for completeness
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
const popupVisualContainer = document.getElementById('popupVisualContainer');
const popupDetailedDescription = document.getElementById('popupDetailedDescription');
const popupResonanceSummary = document.getElementById('popupResonanceSummary');
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const popupRelatedConceptsList = document.getElementById('relatedConceptsList'); // Corrected ID reference
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
const markAsFocusButton = document.getElementById('markAsFocusButton');
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
const scoreNudgeCheckbox = document.getElementById('scoreNudgeCheckbox');
const scoreNudgeLabel = document.getElementById('scoreNudgeLabel');
const confirmReflectionButton = document.getElementById('confirmReflectionButton');
const reflectionRewardAmount = document.getElementById('reflectionRewardAmount');
const milestoneAlert = document.getElementById('milestoneAlert');
const milestoneAlertText = document.getElementById('milestoneAlertText');
const closeMilestoneAlertButton = document.getElementById('closeMilestoneAlertButton');
const toastElement = document.getElementById('toastNotification'); // Toast elements
const toastMessageElement = document.getElementById('toastMessage');

// --- Persistence Functions ---
function saveGameState() {
    console.log("Saving game state...");
    try {
        const stateToSave = {
            userScores,
            discoveredConcepts: Array.from(discoveredConcepts.entries()), // Convert Map to Array
            focusedConcepts: Array.from(focusedConcepts), // Convert Set to Array
            userInsight,
            elementAttunement,
            achievedMilestones: Array.from(achievedMilestones), // Convert Set to Array
            completedRituals,
            lastLoginDate,
            focusSlotsTotal,
            seenPrompts: Array.from(seenPrompts), // Convert Set to Array
            freeResearchAvailableToday,
            questionnaireCompleted: currentElementIndex >= elementNames.length,
            userAnswers, // Save answers just in case
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        console.log("Game state saved successfully.");
    } catch (error) {
        console.error("Error saving game state:", error);
        showTemporaryMessage("Error: Could not save progress!", 4000); // Notify user
    }
}

function loadGameState() {
    console.log("Attempting to load game state...");
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found:", loadedState);

            // Restore state with defaults
            userScores = loadedState.userScores || { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 };
            discoveredConcepts = new Map(loadedState.discoveredConcepts || []);
            focusedConcepts = new Set(loadedState.focusedConcepts || []);
            userInsight = typeof loadedState.userInsight === 'number' ? loadedState.userInsight : 10;
            elementAttunement = loadedState.elementAttunement || { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
            achievedMilestones = new Set(loadedState.achievedMilestones || []);
            completedRituals = loadedState.completedRituals || { daily: {}, weekly: {} };
            lastLoginDate = loadedState.lastLoginDate || null;
            focusSlotsTotal = typeof loadedState.focusSlotsTotal === 'number' ? loadedState.focusSlotsTotal : 5;
            seenPrompts = new Set(loadedState.seenPrompts || []);
            freeResearchAvailableToday = typeof loadedState.freeResearchAvailableToday === 'boolean' ? loadedState.freeResearchAvailableToday : false; // Default false, daily check fixes
            userAnswers = loadedState.userAnswers || {}; // Restore answers

            // Set index based on completion status
            currentElementIndex = loadedState.questionnaireCompleted ? elementNames.length : 0;

            console.log("Game state loaded successfully.");
            return true; // Success
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(SAVE_KEY); // Clear corrupted data
            showTemporaryMessage("Error loading session. Starting fresh.", 4000);
            return false; // Failure
        }
    } else {
        console.log("No saved game state found.");
        return false; // No data
    }
}

function clearGameState() {
    console.log("Clearing saved game state...");
    localStorage.removeItem(SAVE_KEY);
    showTemporaryMessage("Progress Reset!", 3000);
}


// --- Utility & Setup Functions ---
function gainInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return;
    userInsight += amount;
    console.log(`Gained ${amount.toFixed(1)} Insight from ${source}. New total: ${userInsight.toFixed(1)}`);
    updateInsightDisplays();
    saveGameState(); // SAVE STATE
}

function updateInsightDisplays() {
    const formattedInsight = userInsight.toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = formattedInsight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = formattedInsight;
    displayResearchButtons(); // Research buttons depend on insight
}

function getScoreLabel(score) { if (typeof score !== 'number' || isNaN(score)) return "N/A"; if (score >= 9) return "Very High"; if (score >= 7) return "High"; if (score >= 5) return "Moderate"; if (score >= 3) return "Low"; return "Very Low"; }
function getAffinityLevel(score) { if (typeof score !== 'number' || isNaN(score)) return null; if (score >= 8) return "High"; if (score >= 5) return "Moderate"; return null; }
function getElementColor(elementName) { const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' }; return colors[elementName] || '#CCCCCC'; }
function hexToRgba(hex, alpha = 1) { if (!hex || typeof hex !== 'string') return `rgba(128,128,128, ${alpha})`; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return `rgba(128,128,128, ${alpha})`; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `rgba(${r},${g},${b},${alpha})`; }
function getCardTypeIcon(cardType) { switch (cardType) { case "Orientation": return "fa-solid fa-compass"; case "Identity/Role": return "fa-solid fa-mask"; case "Practice/Kink": return "fa-solid fa-gear"; case "Psychological/Goal": return "fa-solid fa-brain"; case "Relationship Style": return "fa-solid fa-heart"; default: return "fa-solid fa-question-circle"; } }
function getElementIcon(elementName) { switch (elementName) { case "Attraction": return "fa-solid fa-magnet"; case "Interaction": return "fa-solid fa-users"; case "Sensory": return "fa-solid fa-hand-sparkles"; case "Psychological": return "fa-solid fa-comment-dots"; case "Cognitive": return "fa-solid fa-lightbulb"; case "Relational": return "fa-solid fa-link"; default: return "fa-solid fa-atom"; } }
const elementNameToKey = { "Attraction": "A", "Interaction": "I", "Sensory": "S", "Psychological": "P", "Cognitive": "C", "Relational": "R" };
// elementKeyToFullName comes from data.js

function euclideanDistance(userScoresObj, conceptScoresObj) {
    let sumOfSquares = 0;
    let validDimensions = 0;
    let issueFound = false;
    if (!userScoresObj || typeof userScoresObj !== 'object') { console.error("Invalid user scores:", userScoresObj); return Infinity; }
    if (!conceptScoresObj || typeof conceptScoresObj !== 'object') { console.warn(`Invalid concept scores object for ID ${conceptScoresObj?.id || '?'}`); return Infinity; }
    const expectedKeys = Object.keys(userScoresObj);
    const expectedDimensions = expectedKeys.length;
    if (expectedDimensions === 0) { console.warn("User scores object is empty."); return Infinity; }
    for (const key of expectedKeys) {
        const s1 = userScoresObj[key];
        const s2 = conceptScoresObj[key];
        const s1Valid = typeof s1 === 'number' && !isNaN(s1);
        const s2Valid = conceptScoresObj.hasOwnProperty(key) && typeof s2 === 'number' && !isNaN(s2);
        if (s1Valid && s2Valid) { sumOfSquares += Math.pow(s1 - s2, 2); validDimensions++; }
        else { if (!s2Valid) { /* console.warn(`Invalid/Missing CONCEPT score for key ${key}. Concept ID: ${conceptScoresObj.id || '?'}`); */ } issueFound = true; } // Reduced console noise
    }
    if (validDimensions !== expectedDimensions && validDimensions > 0) { // Allow calculation if some dimensions match
        //console.warn(`Dimension mismatch/invalid data. Expected ${expectedDimensions}, got ${validDimensions}. Concept ID: ${conceptScoresObj.id || '?'}`, userScoresObj, conceptScoresObj);
        issueFound = true;
    }
    if (validDimensions === 0) return Infinity; // Cannot compare if no dimensions match
    return Math.sqrt(sumOfSquares); // Calculate distance based on matching dimensions
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
    else console.warn("mainNavBar not found");

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
    currentReflectionContext = null;
    reflectionTargetConceptId = null;
}

// --- Initialization and Questionnaire Logic ---
// Modified to handle forced resets vs resuming questionnaire start
function initializeQuestionnaire(forceReset = false) {
    console.log(`[initializeQuestionnaire] Called. Force Reset: ${forceReset}`);

    const isResuming = !forceReset && localStorage.getItem(SAVE_KEY); // Check if potentially resuming

    if (!isResuming) { // Only reset state if it's a fresh start or forced reset
        console.log("[initializeQuestionnaire] Resetting core state variables.");
        currentElementIndex = 0;
        userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 };
        userAnswers = {};
        elementNames.forEach(elName => { userAnswers[elName] = {}; });
        discoveredConcepts = new Map();
        focusedConcepts = new Set();
        userInsight = 10;
        focusSlotsTotal = 5;
        elementAttunement = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
        seenPrompts = new Set();
        completedRituals = { daily: {}, weekly: {} };
        achievedMilestones = new Set();
        lastLoginDate = null;
        cardsAddedSinceLastPrompt = 0;
        promptCooldownActive = false;
        freeResearchAvailableToday = false; // Will be set by daily check later
    } else {
         console.log("[initializeQuestionnaire] Skipping core state reset (resuming or loaded).");
         // Ensure questionnaire starts from the beginning if it wasn't completed
         if (currentElementIndex < elementNames.length) {
             currentElementIndex = 0;
             userAnswers = {}; // Clear previous partial answers if restarting questionnaire
             elementNames.forEach(elName => { userAnswers[elName] = {}; });
             console.log("[initializeQuestionnaire] Restarting questionnaire from element 0.");
         }
    }

    // UI Reset / Setup
    updateElementProgressHeader(-1);
    displayElementQuestions(currentElementIndex); // Display first (or current) element
    showScreen('questionnaireScreen');
    if (mainNavBar) mainNavBar.classList.add('hidden');

    // Clear dynamic UI elements not part of core state
    if(dailyRitualsDisplay) dailyRitualsDisplay.innerHTML = '<li>Loading...</li>';
    if(milestonesDisplay) milestonesDisplay.innerHTML = '<li>None yet</li>';
    if(elementAttunementDisplay) elementAttunementDisplay.innerHTML = '';
    if(grimoireContentDiv) grimoireContentDiv.innerHTML = '<p>Grimoire empty.</p>';
    if(focusedConceptsDisplay) focusedConceptsDisplay.innerHTML = '<li>Mark concepts as "Focus"...</li>';
    if(researchButtonContainer) researchButtonContainer.innerHTML = '';
    if(freeResearchButton) freeResearchButton.classList.add('hidden');

    updateInsightDisplays(); // Reflect initial/loaded insight
    updateFocusSlotsDisplay(); // Reflect initial/loaded slots
    updateGrimoireCounter(); // Reflect initial/loaded grimoire

    // No save game state here - happens after questionnaire completion or later actions
}

function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) return;
    elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div');
        tab.classList.add('element-tab');
        const elementData = elementDetails[name] || {};
        tab.textContent = elementData.name || name;
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

    const elementName = elementNames[index];
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || [];
    const questionContentElement = document.getElementById('questionContent');
    if (!questionContentElement) { console.error("!!! questionContent element not found !!!"); return; }

    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    questionContentElement.innerHTML = introHTML;

    currentElementAnswers = { ...(userAnswers[elementName] || {}) }; // Load existing answers for this element

    let questionsHTML = '';
    if (questions && questions.length > 0) {
        questions.forEach(q => {
            let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
            const savedAnswer = currentElementAnswers[q.qId];

            if (q.type === "slider") {
                const val = savedAnswer !== undefined ? savedAnswer : q.defaultValue;
                inputHTML += ` <div class="slider-container"> <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${val}" data-question-id="${q.qId}" data-type="slider"> <div class="label-container"> <span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span> </div> <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(val).toFixed(1)}</span></p> <p class="slider-feedback" id="feedback_${q.qId}"></p> </div>`;
            } else if (q.type === "radio") {
                inputHTML += `<div class="radio-options">`;
                q.options.forEach(opt => {
                    const checked = savedAnswer === opt.value ? 'checked' : '';
                    inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`;
                });
                inputHTML += `</div>`;
            } else if (q.type === "checkbox") {
                inputHTML += `<div class="checkbox-options">`;
                q.options.forEach(opt => {
                    // Ensure savedAnswer is treated as an array for includes check
                    const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : '';
                    inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`;
                });
                inputHTML += `</div>`;
            }
            inputHTML += `</div></div>`; // Close input-container and question-block
            questionsHTML += inputHTML;
        });
    } else {
        console.warn(`[displayElementQuestions] No questions found for element: ${elementName}`);
        questionsHTML = '<p><em>(No questions defined)</em></p>';
    }

    // Insert questions HTML after the intro div
    const introDiv = questionContentElement.querySelector('.element-intro');
    if (introDiv) {
        introDiv.insertAdjacentHTML('afterend', questionsHTML);
    } else {
        questionContentElement.innerHTML += questionsHTML; // Fallback
    }

    // Add event listeners AFTER HTML is inserted
    questionContentElement.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.addEventListener(eventType, handleQuestionnaireInputChange);
    });
    questionContentElement.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => enforceMaxChoices(checkbox.name, parseInt(checkbox.dataset.maxChoices || 2), event));
    });
    questionContentElement.querySelectorAll('.slider.q-input').forEach(slider => {
        updateSliderFeedbackText(slider); // Initial feedback text
    });

    // Update UI elements
    updateElementProgressHeader(index);
    if (progressText) progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || elementName}`;
    updateDynamicFeedback(elementName); // Update score preview
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block';
    if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; // Use visibility
    if (nextElementButton) nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}


function updateSliderFeedbackText(sliderElement) {
    if (!sliderElement || sliderElement.type !== 'range') return;
    const qId = sliderElement.dataset.questionId;
    const feedbackElement = document.getElementById(`feedback_${qId}`);
    if (!feedbackElement) return;

    const currentValue = parseFloat(sliderElement.value);
    const elementName = elementNames[currentElementIndex];
    const interpretations = elementDetails?.[elementName]?.scoreInterpretations;

    if (!interpretations) {
        console.warn(`Interpretations not found for element: ${elementName}`);
        feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`;
        return;
    }

    const scoreLabel = getScoreLabel(currentValue);
    const interpretationText = interpretations[scoreLabel] || `Interpretation for "${scoreLabel}" not found.`;
    feedbackElement.textContent = interpretationText;
    feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`;
}

function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const type = input.dataset.type;
    const elementName = elementNames[currentElementIndex];

    if (type === 'slider') {
        const qId = input.dataset.questionId;
        const display = document.getElementById(`display_${qId}`);
        if (display) display.textContent = parseFloat(input.value).toFixed(1);
        updateSliderFeedbackText(input); // Update feedback text on slider change
    }
    // For radio/checkbox, changes are handled, just collect and update score preview
    collectCurrentElementAnswers();
    updateDynamicFeedback(elementName);
}

function enforceMaxChoices(name, max, event) {
    const checkboxes = questionContent?.querySelectorAll(`input[name="${name}"]:checked`);
    if (!checkboxes) return;

    if (checkboxes.length > max) {
        alert(`Max ${max} options.`);
        if (event?.target?.checked) { // Only uncheck if the *current* action caused the violation
            event.target.checked = false;
             // Re-collect answers and update feedback after unchecking
            collectCurrentElementAnswers();
            updateDynamicFeedback(elementNames[currentElementIndex]);
        }
    }
}


function collectCurrentElementAnswers() {
    const elementName = elementNames[currentElementIndex];
    const questions = questionnaireGuided[elementName] || [];
    currentElementAnswers = {}; // Reset for collection

    questions.forEach(q => {
        const qId = q.qId;
        const container = questionContent || document; // Use questionnaire screen context

        if (q.type === 'slider') {
            const input = container.querySelector(`#${qId}.q-input`);
            if (input) currentElementAnswers[qId] = parseFloat(input.value);
        } else if (q.type === 'radio') {
            const checked = container.querySelector(`input[name="${qId}"]:checked`);
            if (checked) currentElementAnswers[qId] = checked.value;
        } else if (q.type === 'checkbox') {
            const checked = container.querySelectorAll(`input[name="${qId}"]:checked`);
            currentElementAnswers[qId] = Array.from(checked).map(cb => cb.value); // Store as array
        }
    });
    userAnswers[elementName] = { ...currentElementAnswers }; // Save to main answers object
}

function updateDynamicFeedback(elementName) {
    const elementData = elementDetails?.[elementName];
    if (!elementData) { console.warn(`Element details not found: ${elementName}`); return; }

    if (!dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) {
        console.warn("Dynamic feedback DOM elements missing.");
        return;
    }

    const tempScore = calculateElementScore(elementName, currentElementAnswers); // Use currently collected answers
    const scoreLabel = getScoreLabel(tempScore);

    feedbackElementSpan.textContent = elementData.name || elementName;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);

    let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
    if (labelSpan) {
        labelSpan.textContent = `(${scoreLabel})`;
    }

    feedbackScoreBar.style.width = `${tempScore * 10}%`;

    // Remove old interpretation text if exists (optional, but cleaner)
    let interpretationP = dynamicScoreFeedback.querySelector('.interpretation-text');
    if (interpretationP) { interpretationP.remove(); }
}

function calculateElementScore(elementName, answersForElement) {
    const questions = questionnaireGuided[elementName] || [];
    let score = 5.0; // Start at baseline

    questions.forEach(q => {
        const answer = answersForElement[q.qId];
        let pointsToAdd = 0;

        if (q.type === 'slider') {
            const value = (answer !== undefined) ? answer : q.defaultValue;
            pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0);
        } else if (q.type === 'radio') {
            const opt = q.options.find(o => o.value === answer);
            pointsToAdd = opt ? (opt.points || 0) * (q.scoreWeight || 1.0) : 0;
        } else if (q.type === 'checkbox' && Array.isArray(answer)) {
            answer.forEach(val => {
                const opt = q.options.find(o => o.value === val);
                pointsToAdd += opt ? (opt.points || 0) * (q.scoreWeight || 1.0) : 0;
            });
        }
        score += pointsToAdd;
    });
    return Math.max(0, Math.min(10, score)); // Clamp score between 0 and 10
}

function nextElement() {
    collectCurrentElementAnswers(); // Save answers for current element
    currentElementIndex++;
    displayElementQuestions(currentElementIndex); // Display next or finalize
}

function prevElement() {
    collectCurrentElementAnswers(); // Save answers for current element
    currentElementIndex--;
    displayElementQuestions(currentElementIndex); // Display previous
}

function finalizeScoresAndShowPersona() {
     console.log("Finalizing scores...");
     const finalScores = {};
     try {
         elementNames.forEach(elementName => {
             const score = calculateElementScore(elementName, userAnswers[elementName] || {});
             const key = elementNameToKey[elementName];
             if (key) { finalScores[key] = score; }
             else { console.warn(`Could not find key for element name: ${elementName}`); }
         });

         userScores = finalScores;
         console.log("Final User Scores:", userScores);

         // --- Sequence of actions after scoring ---
         determineStarterHandAndEssence(); // Grants attunement, adds to discovered
         updateMilestoneProgress('completeQuestionnaire', 1);
         checkForDailyLogin(); // Resets daily rituals, grants free research
         displayPersonaScreen(); // Displays scores, attunement, insight, focus slots
         displayStudyScreenContent(); // Displays insight, research buttons
         displayDailyRituals();
         displayMilestones();
         populateGrimoireFilters();
         updateGrimoireCounter(); // Update based on starter hand
         displayGrimoire(); // Render starter hand in grimoire view

         saveGameState(); // *** SAVE STATE AFTER ALL INITIALIZATION IS DONE ***

         showScreen('personaScreen'); // Show persona screen first
         showTemporaryMessage("Experiment Complete! Explore your results.", 4000);

     } catch (error) {
         console.error("Error during finalizeScoresAndShowPersona sequence:", error);
         try {
             showScreen('welcomeScreen'); // Attempt graceful fallback
             alert("An error occurred during setup. Please check the console (F12) and try restarting.");
         } catch (fallbackError) {
             console.error("Error during fallback sequence:", fallbackError);
             document.body.innerHTML = "<h1>Critical Error</h1><p>Setup failed. Check console (F12) and refresh.</p>";
         }
     }
}


// --- Starter Hand & Resource Granting ---
function determineStarterHandAndEssence() {
    console.log("[determineStarterHand] Function called.");
    discoveredConcepts = new Map(); // Clear previous discoveries if re-running questionnaire

    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) { console.error("[determineStarterHand] 'concepts' array is missing!"); return; }
    if (typeof elementKeyToFullName === 'undefined' || elementKeyToFullName === null) { console.error("[determineStarterHand] 'elementKeyToFullName' map is missing!"); return; }

    let conceptsWithDistance = [];
    console.log(`[determineStarterHand] Processing ${concepts.length} total concepts.`);
    concepts.forEach((c, index) => {
        if (!c || typeof c !== 'object' || !c.id || !c.elementScores) {
            console.warn(`[determineStarterHand] Skipping invalid concept at index ${index}:`, c);
            return;
        }
        const conceptScores = c.elementScores;
        const distance = euclideanDistance(userScores, conceptScores);

        if (distance !== Infinity && typeof distance === 'number' && !isNaN(distance)) {
            conceptsWithDistance.push({ ...c, distance: distance });
        } else {
            // console.warn(`[determineStarterHand] Skipping concept ${c.id} (${c.name}) due to invalid distance: ${distance}`); // Reduce noise
        }
    });
    console.log(`[determineStarterHand] Found ${conceptsWithDistance.length} concepts with valid distances.`);
    if (conceptsWithDistance.length === 0) { console.error("[determineStarterHand] No concepts comparable!"); return; }

    conceptsWithDistance.sort((a, b) => a.distance - b.distance);
    console.log("[determineStarterHand] Concepts sorted by distance (Top 15):", conceptsWithDistance.slice(0,15).map(c => `${c.name}(${c.distance.toFixed(1)})`));

    const candidates = conceptsWithDistance.slice(0, 15); // Pool of closest concepts
    const starterHand = [];
    const representedElements = new Set();
    const starterHandIds = new Set();
    const targetHandSize = 7; // Aim for 7 starter cards

    // Prioritize closest unique concepts
    for (const c of candidates) {
        if (starterHand.length >= 4) break; // Get a few closest first
        if (!starterHandIds.has(c.id)) {
            starterHand.push(c);
            starterHandIds.add(c.id);
            if (c.primaryElement) representedElements.add(c.primaryElement);
        }
    }

    // Try to add diversity of elements from remaining candidates
    for (const c of candidates) {
        if (starterHand.length >= targetHandSize) break;
        if (starterHandIds.has(c.id)) continue;

        const needsRepresentation = c.primaryElement && !representedElements.has(c.primaryElement);
        // Heuristic: If few elements represented OR few cards selected OR this card is diverse, add it
        if (needsRepresentation || representedElements.size < 4 || starterHand.length < 5) {
             starterHand.push(c);
             starterHandIds.add(c.id);
             if (c.primaryElement) representedElements.add(c.primaryElement);
        }
    }

    // Fill remaining slots with closest available
    for (const c of candidates) {
        if (starterHand.length >= targetHandSize) break;
        if (!starterHandIds.has(c.id)) {
            starterHand.push(c);
            starterHandIds.add(c.id);
        }
    }

    console.log("[determineStarterHand] Starter Hand Selected:", starterHand.map(c => c.name));
    if (starterHand.length === 0) { console.error("[determineStarterHand] Failed to select starter hand!"); return; }

    // Add starter hand to discovered concepts and grant attunement
    starterHand.forEach(concept => {
        console.log(`[determineStarterHand] Adding starter card to discovered: ${concept.name} (ID: ${concept.id})`);
        if (!discoveredConcepts.has(concept.id)) { // Ensure no duplicates if logic changes
             discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false });
             gainAttunementForAction('discover', concept.primaryElement); // gainAttunement calls saveGameState
        }
    });

    console.log(`[determineStarterHand] Discovered Concepts Count after starter hand: ${discoveredConcepts.size}`);
    // No saveGameState needed here, gainAttunementForAction handles it
}

// --- Attunement ---
function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) {
    let targetKeys = [];
    const gainAmount = amount;

    if (elementKey && elementAttunement.hasOwnProperty(elementKey)) {
        targetKeys.push(elementKey);
    } else if (actionType === 'completeReflection' && currentReflectionElement) {
        const key = elementNameToKey[currentReflectionElement];
        if (key && elementAttunement.hasOwnProperty(key)) { targetKeys.push(key); }
        else { console.warn(`Could not find key for reflection element: ${currentReflectionElement}`); }
    } else if (actionType === 'generic' || elementKey === 'All' || actionType === 'completeReflectionGeneric' || actionType === 'scoreNudge' || actionType === 'ritual' || actionType === 'milestone') {
        targetKeys = Object.keys(elementAttunement);
        // Adjust amount based on generic type if needed
        amount = (actionType === 'generic') ? 0.1 :
                 (actionType === 'completeReflectionGeneric') ? 0.2 :
                 (actionType === 'scoreNudge') ? 0.5 / targetKeys.length : // Distribute nudge attunement
                 amount; // Use provided amount for ritual/milestone 'All'
    } else {
        // No valid target key(s) found for specific actions
        // console.log(`Attunement gain skipped: Invalid action/key combination (${actionType}, ${elementKey})`);
        return;
    }

    let changed = false;
    targetKeys.forEach(key => {
        const currentAttunement = elementAttunement[key] || 0;
        const newAttunement = Math.min(MAX_ATTUNEMENT, currentAttunement + gainAmount);
        if (newAttunement > currentAttunement) {
            elementAttunement[key] = newAttunement;
            changed = true;
            // Check milestones related to attunement levels
            updateMilestoneProgress('elementAttunement', { [key]: newAttunement }); // Pass specific change
            updateMilestoneProgress('elementAttunement', elementAttunement); // Pass full state for 'all' conditions
        }
    });

    if (changed) {
        const displayKey = elementKey || (targetKeys.length > 1 ? 'Multi' : 'None');
        let logMessage = `Attunement updated (${actionType}, Key: ${displayKey}`;
        if (typeof elementKeyToFullName !== 'undefined' && elementKeyToFullName?.[elementKey]) {
             logMessage += ` - ${elementKeyToFullName[elementKey]}`;
        }
        console.log(logMessage + ` by ${gainAmount.toFixed(1)}):`, elementAttunement);
        displayElementAttunement();
        saveGameState(); // SAVE STATE
    }
}

function displayElementAttunement() {
    if (!elementAttunementDisplay) return;
    elementAttunementDisplay.innerHTML = '';
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const attunementValue = elementAttunement[key] || 0;
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
function updateFocusSlotsDisplay() {
    if (focusedConceptsHeader) {
        focusedConceptsHeader.textContent = `Focused Concepts (${focusedConcepts.size} / ${focusSlotsTotal})`;
    }
}

function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona details div not found!"); return; }
    personaElementDetailsDiv.innerHTML = '';
    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName];
        const score = userScores[key];
        const scoreLabel = getScoreLabel(score);
        const elementData = elementDetails[elementName] || {};
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A";
        const barWidth = score ? (score / 10) * 100 : 0;
        const color = getElementColor(elementName);

        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        details.style.setProperty('--element-color', color);
        details.innerHTML = `
            <summary class="element-detail-header">
                <div>
                    <strong>${elementData.name || elementName}:</strong>
                    <span>${score?.toFixed(1) ?? '?'}</span>
                    <span class="score-label">(${scoreLabel})</span>
                </div>
                <div class="score-bar-container">
                    <div style="width: ${barWidth}%; background-color: ${color};"></div>
                </div>
            </summary>
            <div class="element-description">
                <p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p>
                <p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p>
                <hr>
                <p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p>
                <p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>
            </div>`;
        personaElementDetailsDiv.appendChild(details);
    });

    updateInsightDisplays(); // Ensure insight shown is current
    displayElementAttunement();
    displayFocusedConceptsPersona();
    synthesizeAndDisplayThemesPersona();
    displayMilestones();
}

function displayFocusedConceptsPersona() {
    if (!focusedConceptsDisplay) return;
    focusedConceptsDisplay.innerHTML = '';
    updateFocusSlotsDisplay(); // Update header count

    if (focusedConcepts.size === 0) {
        focusedConceptsDisplay.innerHTML = `<li>Mark concepts as "Focus" to weave your active Tapestry (Max ${focusSlotsTotal}).</li>`;
        return;
    }

    focusedConcepts.forEach(conceptId => {
        const conceptData = discoveredConcepts.get(conceptId);
        if (conceptData?.concept) {
            const concept = conceptData.concept;
            const item = document.createElement('div');
            item.classList.add('focus-concept-item');
            item.dataset.conceptId = concept.id;
            item.title = `View ${concept.name}`;
            item.innerHTML = `
                <i class="${getCardTypeIcon(concept.cardType)}"></i>
                <span class="name">${concept.name}</span>
                <span class="type">(${concept.cardType})</span>`;
            item.addEventListener('click', () => showConceptDetailPopup(concept.id));
            focusedConceptsDisplay.appendChild(item);
        } else {
            console.warn(`Focused concept ID ${conceptId} not found in discoveredConcepts.`);
            // Optionally remove the ID from focusedConcepts if it's invalid?
            // focusedConcepts.delete(conceptId);
            // saveGameState(); // If modifying the set
        }
    });
}

function synthesizeAndDisplayThemesPersona() {
    if (!personaThemesList) return;
    personaThemesList.innerHTML = '';

    if (focusedConcepts.size === 0) {
        personaThemesList.innerHTML = '<li>Mark Focused Concepts to reveal dominant themes.</li>';
        return;
    }

    if (typeof elementKeyToFullName === 'undefined') { console.error("synthesizeThemes: elementKeyToFullName map missing!"); return; }

    const elementCountsByKey = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
    const themeThreshold = 7.0; // Score threshold for a concept to contribute to a theme

    focusedConcepts.forEach(id => {
        const discoveredData = discoveredConcepts.get(id);
        const concept = discoveredData?.concept;
        if (concept?.elementScores) {
            for (const key in concept.elementScores) {
                if (elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= themeThreshold) {
                    elementCountsByKey[key]++;
                }
            }
        }
    });

    const sortedThemes = Object.entries(elementCountsByKey)
        .filter(([key, count]) => count > 0 && elementDetails[elementKeyToFullName[key]]) // Ensure element exists
        .sort(([, a], [, b]) => b - a) // Sort by count descending
        .map(([key, count]) => ({
            name: elementDetails[elementKeyToFullName[key]]?.name || key, // Get full name
            count
        }));

    if (sortedThemes.length === 0) {
        personaThemesList.innerHTML = `<li>No strong themes (element score >= ${themeThreshold.toFixed(1)}) detected in Focused Concepts.</li>`;
        return;
    }

    // Display top 3 themes
    sortedThemes.slice(0, 3).forEach(theme => {
        const li = document.createElement('li');
        li.textContent = `${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})`;
        personaThemesList.appendChild(li);
    });
}

// --- Study Screen Functions ---
function displayStudyScreenContent() {
    updateInsightDisplays();
    displayResearchButtons();
    displayDailyRituals();
}

function displayResearchButtons() {
    if (!researchButtonContainer) return;
    researchButtonContainer.innerHTML = ''; // Clear existing

    // Free Research Button
    if (freeResearchAvailableToday && freeResearchButton) {
        freeResearchButton.classList.remove('hidden');
        freeResearchButton.disabled = false;
        freeResearchButton.textContent = "Perform Daily Meditation (Free Research)";
        freeResearchButton.onclick = handleFreeResearchClick;
    } else if (freeResearchButton) {
         freeResearchButton.disabled = true; // Ensure it's disabled if not available
         freeResearchButton.textContent = freeResearchAvailableToday === false ? "Daily Meditation Performed" : "Perform Daily Meditation"; // Update text if performed
        // Keep hidden state managed by daily check potentially
    }

    // Paid Research Buttons
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const currentAttunement = elementAttunement[key] || 0;

        // Calculate cost based on attunement (example)
        let currentCost = BASE_RESEARCH_COST;
        if (currentAttunement > 80) currentCost = Math.max(5, BASE_RESEARCH_COST - 5); // Min cost 5
        else if (currentAttunement > 50) currentCost = Math.max(5, BASE_RESEARCH_COST - 3);

        const canAfford = userInsight >= currentCost;
        const fullName = elementDetails[elName]?.name || elName;

        const button = document.createElement('button');
        button.classList.add('button', 'research-button'); // Use base button class too
        button.dataset.elementKey = key;
        button.dataset.cost = currentCost;
        button.disabled = !canAfford;
        button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`;
        button.innerHTML = `
            <span class="research-el-icon" style="color: ${getElementColor(elName)};"><i class="${getElementIcon(fullName)}"></i></span>
            <span class="research-el-name">${fullName}</span>
            <span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span>
        `;
        button.addEventListener('click', handleResearchClick);
        researchButtonContainer.appendChild(button);
    });
}

function handleResearchClick(event) {
    const button = event.currentTarget;
    const elementKey = button.dataset.elementKey;
    const currentCost = parseFloat(button.dataset.cost);

    if (!elementKey || isNaN(currentCost) || button.disabled) return;

    if (userInsight >= currentCost) {
        userInsight -= currentCost; // Spend insight BEFORE potential gainInsight call inside conductResearch
        updateInsightDisplays(); // Update display immediately
        console.log(`Spent ${currentCost} Insight researching ${elementKey}.`);
        conductResearch(elementKey);
        updateMilestoneProgress('conductResearch', 1); // Track paid research
        checkAndUpdateRituals('conductResearch');
        saveGameState(); // SAVE STATE after spending insight and initiating research
    } else {
        showTemporaryMessage(`Not enough Insight! Need ${currentCost}.`, 3000);
    }
}

function handleFreeResearchClick() {
    if (!freeResearchAvailableToday) {
        showTemporaryMessage("Daily meditation already performed today.", 3000);
        return;
    }

    // Find element with lowest attunement
    const keys = Object.keys(elementAttunement);
    let targetKey = keys[0];
    let minAttunement = MAX_ATTUNEMENT + 1;
    keys.forEach(key => {
        if (elementAttunement[key] < minAttunement) {
            minAttunement = elementAttunement[key];
            targetKey = key;
        }
    });

    console.log(`Performing free daily meditation on ${targetKey} (Key: ${elementKeyToFullName[targetKey]})`);
    freeResearchAvailableToday = false; // Mark as used

    if (freeResearchButton) {
        freeResearchButton.disabled = true;
        freeResearchButton.textContent = "Daily Meditation Performed";
    }

    conductResearch(targetKey); // Conduct the research
    updateMilestoneProgress('freeResearch', 1);
    checkAndUpdateRituals('freeResearch');
    saveGameState(); // SAVE STATE after using free research
}

function conductResearch(elementKeyToResearch) {
    if (typeof elementKeyToFullName === 'undefined') { console.error("conductResearch: map missing!"); return; }
    const elementFullName = elementKeyToFullName[elementKeyToResearch];
    if (!elementFullName) { console.error("Invalid key for research:", elementKeyToResearch); return; }

    console.log(`Researching: ${elementFullName} (Key: ${elementKeyToResearch})`);
    if (researchStatus) researchStatus.textContent = `Focusing on ${elementDetails[elementFullName]?.name || elementFullName}...`;
    if (researchModalContent) researchModalContent.innerHTML = '';

    const discoveredIds = new Set(discoveredConcepts.keys());
    const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));

    if (undiscoveredPool.length === 0) {
        if (researchModalStatus) researchModalStatus.textContent = "All concepts discovered!";
        if (researchStatus) researchStatus.textContent = "Research complete. No more concepts to discover.";
        if (researchModal) researchModal.classList.remove('hidden');
        if (popupOverlay) popupOverlay.classList.remove('hidden');
        gainInsight(5.0, "All Concepts Discovered Bonus"); // Reward for completion
        return;
    }

    const currentAttunement = elementAttunement[elementKeyToResearch] || 0;
    const priorityPool = []; // Concepts primary to this element OR high score
    const secondaryPool = []; // Concepts with moderate score in this element
    const tertiaryPool = []; // All remaining undiscovered concepts

    undiscoveredPool.forEach(c => {
        const score = c.elementScores?.[elementKeyToResearch] || 0;
        const isPrimary = c.primaryElement === elementKeyToResearch;

        if (isPrimary || score >= 7.5) { priorityPool.push(c); }
        else if (score >= 4.5) { secondaryPool.push(c); }
        else { tertiaryPool.push(c); }
    });

    const selectedForOutput = [];
    let duplicateInsightGain = 0;
    const numberOfResults = 3; // Number of cards to show in results

    // Weighted Selection Function (Prioritizes rarity and pools)
    const selectWeightedRandomFromPools = () => {
        const pools = [
            { pool: priorityPool, weightMultiplier: 3.0 },
            { pool: secondaryPool, weightMultiplier: 1.5 },
            { pool: tertiaryPool, weightMultiplier: 1.0 }
        ];
        let combinedWeightedPool = [];
        let totalWeight = 0;

        pools.forEach(({ pool, weightMultiplier }) => {
            pool.forEach(card => {
                let weight = 1.0 * weightMultiplier;
                // Rarity bonus based on attunement
                const rarityBonus = 1 + (currentAttunement / MAX_ATTUNEMENT); // Max bonus of 2x
                if (card.rarity === 'uncommon') weight *= (1.5 * rarityBonus);
                if (card.rarity === 'rare') weight *= (2.0 * rarityBonus);
                totalWeight += weight;
                combinedWeightedPool.push({ card, weight });
            });
        });

        if (combinedWeightedPool.length === 0) return null;

        let randomPick = Math.random() * totalWeight;
        let chosenItem = null;

        for (let i = 0; i < combinedWeightedPool.length; i++) {
             chosenItem = combinedWeightedPool[i];
            if (randomPick < chosenItem.weight) {
                // Remove from original pools to prevent re-selection in this research batch
                [priorityPool, secondaryPool, tertiaryPool].forEach(p => {
                     const index = p.findIndex(c => c.id === chosenItem.card.id);
                     if (index > -1) p.splice(index, 1);
                });
                return chosenItem.card; // Return the chosen card
            }
            randomPick -= chosenItem.weight;
        }

        // Fallback if something goes wrong (should be rare)
        console.warn("Weighted selection fallback triggered.");
        const flatPool = [...priorityPool, ...secondaryPool, ...tertiaryPool];
        if (flatPool.length > 0) {
             const fallbackIndex = Math.floor(Math.random() * flatPool.length);
             const chosenCard = flatPool[fallbackIndex];
             // Remove from original pools
             [priorityPool, secondaryPool, tertiaryPool].forEach(p => {
                 const index = p.findIndex(c => c.id === chosenCard.id);
                 if (index > -1) p.splice(index, 1);
             });
             return chosenCard;
        }
        return null; // No cards left
    };

    // Select results
    let attempts = 0;
    const maxAttempts = numberOfResults * 3; // Allow some duplicates before giving up
    while (selectedForOutput.length < numberOfResults && attempts < maxAttempts && (priorityPool.length > 0 || secondaryPool.length > 0 || tertiaryPool.length > 0)) {
        attempts++;
        let potentialCard = selectWeightedRandomFromPools();

        if (potentialCard) {
            if (discoveredConcepts.has(potentialCard.id)) {
                console.log(`Duplicate research hit: ${potentialCard.name}. Granting Insight.`);
                gainInsight(1.0, `Duplicate Research (${potentialCard.name})`); // gainInsight calls save
                duplicateInsightGain += 1.0;
            } else {
                selectedForOutput.push(potentialCard);
                // Card already removed from pools by selectWeightedRandomFromPools
            }
        } else {
            break; // No more cards selectable
        }
    }

    // Process and display results
    let resultMessage = "";
    if (selectedForOutput.length > 0) {
        resultMessage = `Discovered ${selectedForOutput.length} new concept(s)! `;
        if (researchModalContent) researchModalContent.innerHTML = '';
        selectedForOutput.forEach(concept => {
            const cardElement = renderCard(concept, 'research-result'); // Special context for styling?
            if (researchModalContent) researchModalContent.appendChild(cardElement);
            // Add to discovered concepts AFTER showing results (user clicks add in popup)
        });
        gainAttunementForAction('researchSuccess', elementKeyToResearch, 0.8); // Attunement gain calls save
        // Check for rare card discovery milestone
        if (selectedForOutput.some(c => c.rarity === 'rare')) {
            updateMilestoneProgress('discoverRareCard', 1);
        }

    } else {
        resultMessage = "No new concepts discovered this time. ";
        if (researchModalContent) researchModalContent.innerHTML = '<p><i>Familiar thoughts echo... Perhaps try a different focus?</i></p>';
        gainAttunementForAction('researchFail', elementKeyToResearch, 0.2); // Attunement gain calls save
    }

    if (duplicateInsightGain > 0) {
        resultMessage += ` Gained ${duplicateInsightGain.toFixed(0)} Insight from echoes.`;
    }

    if (researchModalStatus) researchModalStatus.textContent = resultMessage.trim();
    if (researchStatus) researchStatus.textContent = `Research complete. ${resultMessage.trim()}`;

    if (researchModal) researchModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
    // Final save state handled by gainInsight / gainAttunement calls within
}


// --- Grimoire Functions ---
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") {
    if (!grimoireContentDiv) return;
    grimoireContentDiv.innerHTML = ''; // Clear previous content

    if (discoveredConcepts.size === 0) {
        grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty. Conduct Research to discover Concepts!</p>';
        return;
    }

    let discoveredArray = Array.from(discoveredConcepts.values()); // Get array of { concept, discoveredTime, artUnlocked }

    // Filter
    const conceptsToDisplay = discoveredArray.filter(data => {
        if (!data || !data.concept) return false;
        const concept = data.concept;
        const typeMatch = (filterType === "All") || (concept.cardType === filterType);
        // Ensure filtering by full element name from dropdown matches key
        const elementKey = filterElement !== "All" ? elementNameToKey[filterElement] : "All";
        const elementMatch = (elementKey === "All") || (concept.primaryElement === elementKey);
        const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);
        return typeMatch && elementMatch && rarityMatch;
    });

    // Sort
    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
    conceptsToDisplay.sort((a, b) => {
        if (!a.concept || !b.concept) return 0; // Safety check
        switch (sortBy) {
            case 'name': return a.concept.name.localeCompare(b.concept.name);
            case 'type': return a.concept.cardType.localeCompare(b.concept.cardType) || a.concept.name.localeCompare(b.concept.name);
            case 'rarity': return (rarityOrder[a.concept.rarity] || 0) - (rarityOrder[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name);
            case 'discovered': // Default
            default: return a.discoveredTime - b.discoveredTime;
        }
    });

    // Render
    if (conceptsToDisplay.length === 0) {
        grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters.</p>`;
    } else {
        conceptsToDisplay.forEach(data => {
            const cardElement = renderCard(data.concept, 'grimoire'); // Pass concept object
            grimoireContentDiv.appendChild(cardElement);
        });
    }
}

function populateGrimoireFilters() {
    // Populate Type Filter
    if (grimoireTypeFilter) {
        grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; // Reset
        cardTypeKeys.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            grimoireTypeFilter.appendChild(option);
        });
    }
    // Populate Element Filter
    if (grimoireElementFilter) {
        grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; // Reset
        elementNames.forEach(fullName => { // Use the canonical list of full names
            const name = elementDetails[fullName]?.name || fullName; // Get display name
            const option = document.createElement('option');
            option.value = fullName; // Use full name as value for filtering logic
            option.textContent = name; // Display friendly name
            grimoireElementFilter.appendChild(option);
        });
    }
    // Rarity and Sort filters are static HTML
}

function updateGrimoireCounter() {
    if (grimoireCountSpan) grimoireCountSpan.textContent = discoveredConcepts.size;
}

// --- Card Rendering Function ---
function renderCard(concept, context = 'grimoire') {
    if (!concept || !concept.id) { console.warn("renderCard received invalid concept data"); return document.createElement('div'); }
    if (typeof elementKeyToFullName === 'undefined') { console.error("renderCard: elementKeyToFullName map missing!"); return document.createElement('div');}

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `View ${concept.name}`;

    const discoveredData = discoveredConcepts.get(concept.id);
    const isDiscovered = !!discoveredData; // Is it in the Grimoire?
    const isFocused = focusedConcepts.has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false; // Check unlock status from Grimoire data

    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    const focusStampHTML = isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';

    const cardTypeIcon = getCardTypeIcon(concept.cardType);

    // Affinities
    let affinitiesHTML = '';
    if (concept.elementScores && typeof elementKeyToFullName !== 'undefined') {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
            const level = getAffinityLevel(score); // Returns "High", "Moderate", or null
            if (level && elementKeyToFullName[key]) { // Only show Moderate or High
                const fullName = elementKeyToFullName[key];
                const color = getElementColor(fullName);
                const levelClass = level === "High" ? "affinity-high" : ""; // Add class for High
                const iconClass = getElementIcon(fullName);
                affinitiesHTML += `
                    <span class="affinity ${levelClass}"
                          style="border-color: ${color}; color: ${color}; background-color: ${hexToRgba(color, 0.1)};"
                          title="${elementDetails[fullName]?.name || fullName} Affinity: ${level} (${score.toFixed(1)})">
                          <i class="${iconClass}"></i> ${level.substring(0,1)}
                    </span> `;
            }
        });
    }

    // Visual Area
    const currentVisualHandle = artUnlocked ? (concept.visualHandleUnlocked || concept.visualHandle) : concept.visualHandle;
    const visualContent = artUnlocked && concept.visualHandleUnlocked
        ? `<img src="placeholder_art/${concept.visualHandleUnlocked}.png" alt="${concept.name} Art" class="card-art-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"> <i class="fas fa-image card-visual-placeholder" style="display: none;"></i>` // Fallback icon if image fails
        : `<i class="fas fa-${artUnlocked ? 'star' : 'question'} card-visual-placeholder ${artUnlocked ? 'card-art-unlocked' : ''}" title="${currentVisualHandle || 'Visual Placeholder'}"></i>`;


    // Assemble Card HTML
    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${focusStampHTML}${grimoireStampHTML}</span>
        </div>
        <div class="card-visual">
            ${visualContent}
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
        </div>`;

    // Add click listener unless explicitly told not to
    if (context !== 'no-click') {
        cardDiv.addEventListener('click', () => showConceptDetailPopup(concept.id));
    }

    if (context === 'research-result') {
        cardDiv.title = `Click to view details for ${concept.name} (Not yet in Grimoire)`;
    }

    return cardDiv;
}


// --- Concept Detail Pop-up Logic ---
function showConceptDetailPopup(conceptId) {
    const conceptData = concepts.find(c => c.id === conceptId); // Find from master list
    const discoveredData = discoveredConcepts.get(conceptId); // Check if in Grimoire

    if (!conceptData) { console.error(`Concept ${conceptId} not found in master list!`); return; }

    currentlyDisplayedConceptId = conceptId; // Track displayed concept

    // Populate Header
    if (popupConceptName) popupConceptName.textContent = conceptData.name;
    if (popupConceptType) popupConceptType.textContent = conceptData.cardType;
    if (popupCardTypeIcon) popupCardTypeIcon.className = `${getCardTypeIcon(conceptData.cardType)} card-type-icon`;

    // Populate Description
    if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No detailed description available.";

    // Populate Visual Area
    const artUnlocked = discoveredData?.artUnlocked || false;
    const currentVisualHandle = artUnlocked ? (conceptData.visualHandleUnlocked || conceptData.visualHandle) : conceptData.visualHandle;
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = ''; // Clear previous
        if (artUnlocked && conceptData.visualHandleUnlocked) {
            const img = document.createElement('img');
            img.src = `placeholder_art/${conceptData.visualHandleUnlocked}.png`;
            img.alt = `${conceptData.name} Art`;
            img.classList.add('card-art-image');
            // Add fallback icon within the container
            img.onerror = function() {
                 this.style.display='none'; // Hide broken image
                 const icon = document.createElement('i');
                 icon.className = `fas fa-image card-visual-placeholder`;
                 icon.title = "Art Placeholder (Load Failed)";
                 popupVisualContainer.appendChild(icon);
            }
            popupVisualContainer.appendChild(img);
        } else {
            // Show placeholder icon if art isn't unlocked or primary visual exists
            const icon = document.createElement('i');
            icon.className = `fas fa-${artUnlocked ? 'star card-art-unlocked' : 'question'} card-visual-placeholder`;
            icon.title = currentVisualHandle || "Visual Placeholder";
            if (artUnlocked) icon.classList.add('card-art-unlocked');
            popupVisualContainer.appendChild(icon);
        }
    } else {
        console.error("popupVisualContainer element not found!");
    }

    // Calculate and Display Resonance
    const distance = euclideanDistance(userScores, conceptData.elementScores);
    displayPopupResonance(distance);

    // Display Recipe Comparison
    displayPopupRecipeComparison(conceptData);

    // Display Related Concepts
    displayPopupRelatedConcepts(conceptData);

    // Display Evolution Section (if applicable)
    displayEvolutionSection(conceptData, discoveredData);

    // Update Action Buttons
    updateGrimoireButtonStatus(conceptId);
    updateFocusButtonStatus(conceptId);

    // Show Popup
    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');

    // Check for Dissonance Reflection Trigger (only if NOT already discovered)
    if (!discoveredData && distance > DISSONANCE_THRESHOLD) {
        console.log(`High dissonance (${distance.toFixed(1)}) for undiscovered concept ${conceptData.name}. Suggesting reflection.`);
        // Consider delaying this slightly or adding a visual cue instead of immediate modal?
        // For now, let addToGrimoire handle the dissonance check upon user click.
    }
}


function displayPopupResonance(distance) {
    if (!popupResonanceSummary) return;
    let resonanceLabel = "Low";
    let resonanceClass = "resonance-low";
    let message = "";

    if (distance === Infinity || isNaN(distance)) {
        resonanceLabel = "N/A";
        resonanceClass = "";
        message = "(Cannot compare profiles)";
    } else if (distance < 2.5) {
        resonanceLabel = "Very High";
        resonanceClass = "resonance-high";
        message = "Strongly aligns with your core profile.";
    } else if (distance < 4.0) {
        resonanceLabel = "High";
        resonanceClass = "resonance-high";
        message = "Shares significant common ground.";
    } else if (distance < 6.0) {
        resonanceLabel = "Moderate";
        resonanceClass = "resonance-medium";
        message = "Some similarities and differences noted.";
    } else if (distance <= DISSONANCE_THRESHOLD) { // Between Moderate and Dissonant
        resonanceLabel = "Low";
        resonanceClass = "resonance-low";
        message = "Notable divergence from your profile.";
    } else { // distance > DISSONANCE_THRESHOLD
        resonanceLabel = "Dissonant";
        resonanceClass = "resonance-low"; // Use low style for dissonant too
        message = "Significantly diverges. Reflection suggested.";
    }
    popupResonanceSummary.innerHTML = `Resonance with You: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> (Dist: ${distance.toFixed(1)})<br><small>${message}</small>`;
}


function displayPopupRecipeComparison(conceptData) {
    if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return;
    if (typeof elementKeyToFullName === 'undefined') { console.error("RecipeComparison: elementKeyToFullName map missing!"); return; }

    popupConceptProfile.innerHTML = '';
    popupUserComparisonProfile.innerHTML = '';
    popupComparisonHighlights.innerHTML = ''; // Clear previous highlights

    let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>';
    let hasHighlights = false;
    const conceptScores = conceptData.elementScores || {};
    const userCompScores = userScores || {};

    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const fullName = elementKeyToFullName[key];
        if (!fullName) return; // Skip if key mapping fails

        const conceptScore = conceptScores[key];
        const userScore = userCompScores[key];

        // Handle cases where score might be missing (though should be rare with defaults)
        const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore);
        const userScoreValid = typeof userScore === 'number' && !isNaN(userScore);

        const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?';
        const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';

        const conceptLabel = conceptScoreValid ? getScoreLabel(conceptScore) : 'N/A';
        const userLabel = userScoreValid ? getScoreLabel(userScore) : 'N/A';

        const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0;
        const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0;
        const color = getElementColor(fullName);
        const elementNameShort = elementDetails[fullName]?.name.substring(0, 11) || elName;

        // Populate profile columns
        popupConceptProfile.innerHTML += `
            <div>
                <strong>${elementNameShort}:</strong>
                <span>${conceptDisplay}</span>
                <div class="score-bar-container" title="${conceptLabel}">
                    <div style="width: ${conceptBarWidth}%; background-color: ${color};"></div>
                </div>
            </div>`;
        popupUserComparisonProfile.innerHTML += `
            <div>
                <strong>${elementNameShort}:</strong>
                <span>${userDisplay}</span>
                <div class="score-bar-container" title="${userLabel}">
                    <div style="width: ${userBarWidth}%; background-color: ${color};"></div>
                </div>
            </div>`;

        // Generate highlights if both scores are valid
        if (conceptScoreValid && userScoreValid) {
            const diff = Math.abs(conceptScore - userScore);
            const elementNameDisplay = elementDetails[fullName]?.name || elName;

            if (conceptScore >= 7 && userScore >= 7) {
                highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel} / ${userLabel})</p>`;
                hasHighlights = true;
            } else if (conceptScore <= 3 && userScore <= 3) {
                highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel} / ${userLabel})</p>`;
                hasHighlights = true;
            } else if (diff >= 4) { // Threshold for notable difference
                const direction = conceptScore > userScore ? "higher" : "lower";
                highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept is ${conceptLabel}, You are ${userLabel})</p>`;
                hasHighlights = true;
            }
        }
    });

    if (!hasHighlights) {
        highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>';
    }
    popupComparisonHighlights.innerHTML = highlightsHTML;
}


function displayPopupRelatedConcepts(conceptData) {
    if (!popupRelatedConceptsList) return;
    popupRelatedConceptsList.innerHTML = ''; // Clear previous

    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
        conceptData.relatedIds.forEach(relatedId => {
            // Find the related concept in the master list
            const relatedConcept = concepts.find(c => c.id === relatedId);
            if (relatedConcept) {
                const li = document.createElement('li');
                li.textContent = relatedConcept.name;
                li.dataset.conceptId = relatedId; // Store ID for click handling
                li.title = `View ${relatedConcept.name}`;
                li.addEventListener('click', handleRelatedConceptClick);
                popupRelatedConceptsList.appendChild(li);
            } else {
                console.warn(`Related concept ID ${relatedId} not found for concept ${conceptData.id}`);
            }
        });
    } else {
        popupRelatedConceptsList.innerHTML = '<li>None specified</li>';
    }
}

function handleRelatedConceptClick(event) {
    const conceptId = event.target.dataset.conceptId;
    if (!conceptId) return;
    const numericId = parseInt(conceptId);
    if (!isNaN(numericId)) {
        showConceptDetailPopup(numericId); // Show detail for the clicked related concept
    }
}

function displayEvolutionSection(conceptData, discoveredData) {
    if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return;
    if (typeof elementKeyToFullName === 'undefined') { console.error("EvolutionSection: elementKeyToFullName map missing!"); return; }

    const isDiscovered = !!discoveredData;
    const canUnlock = conceptData.canUnlockArt;
    const alreadyUnlocked = discoveredData?.artUnlocked || false;
    const isFocused = focusedConcepts.has(conceptData.id);
    const requiredElement = conceptData.primaryElement;
    const fullName = elementKeyToFullName[requiredElement];

    if (!fullName) {
        console.warn(`Evolution: Invalid primary element key ${requiredElement} for concept ${conceptData.id}`);
        popupEvolutionSection.classList.add('hidden');
        return;
    }

    const cost = ART_EVOLVE_COST;
    const hasEnoughInsight = userInsight >= cost;
    // Require at least one reflection completed as a gate
    const hasReflected = seenPrompts.size > 0;

    evolveCostSpan.textContent = `${cost} Insight`;

    if (isDiscovered && canUnlock && !alreadyUnlocked) {
        popupEvolutionSection.classList.remove('hidden');
        let eligibilityText = '';
        let canEvolve = true;

        // Check conditions
        if (!isFocused) { eligibilityText += '<li>Requires: Mark as Focus Concept</li>'; canEvolve = false; }
        else { eligibilityText += '<li><i class="fas fa-check"></i> Focused Concept</li>'; }

        if (!hasReflected) { eligibilityText += '<li>Requires: Engage in Reflection (any)</li>'; canEvolve = false; }
        else { eligibilityText += '<li><i class="fas fa-check"></i> Reflection Engaged</li>'; }

        if (!hasEnoughInsight) { eligibilityText += `<li>Requires: ${cost} Insight (Have ${userInsight.toFixed(1)})</li>`; canEvolve = false;}
        else { eligibilityText += `<li><i class="fas fa-check"></i> Sufficient Insight</li>`; }

        evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`;
        evolveEligibility.classList.remove('hidden');

        evolveArtButton.disabled = !canEvolve;
        evolveArtButton.onclick = canEvolve ? () => attemptArtEvolution(conceptData.id, cost) : null; // Set onclick only if eligible

    } else {
        // Hide section if not discovered, not unlockable, or already unlocked
        popupEvolutionSection.classList.add('hidden');
        evolveArtButton.disabled = true;
        evolveEligibility.classList.add('hidden');
        evolveArtButton.onclick = null; // Clear onclick
    }
}


function attemptArtEvolution(conceptId, cost) {
    console.log(`Attempting art evolution for ${conceptId} costing ${cost} Insight.`);
    const discoveredData = discoveredConcepts.get(conceptId);

    if (!discoveredData || !discoveredData.concept || discoveredData.artUnlocked) {
        console.error("Cannot evolve: Not discovered, concept missing, or already unlocked.");
        showTemporaryMessage("Evolution failed: Concept state error.", 3000);
        return;
    }
    const concept = discoveredData.concept;
    if (!concept.canUnlockArt) { console.error("Cannot evolve: Art not unlockable for this concept."); return; }

    const isFocused = focusedConcepts.has(conceptId);
    const hasReflected = seenPrompts.size > 0; // Re-check condition

    if (isFocused && hasReflected && userInsight >= cost) {
        userInsight -= cost; // Spend Insight FIRST
        updateInsightDisplays(); // Update display

        discoveredData.artUnlocked = true;
        discoveredConcepts.set(conceptId, discoveredData); // Update map entry

        console.log(`Art unlocked for ${concept.name}!`);
        showTemporaryMessage(`Enhanced Art Unlocked for ${concept.name}!`, 3500);

        // Refresh popup if currently viewing this concept
        if (currentlyDisplayedConceptId === conceptId) {
            displayEvolutionSection(concept, discoveredData); // Update evolution section (should hide it now)
             // Update the visual directly in the popup
            if (popupVisualContainer) {
                 popupVisualContainer.innerHTML = ''; // Clear
                 if (discoveredData.artUnlocked && concept.visualHandleUnlocked) {
                     const img = document.createElement('img');
                     img.src = `placeholder_art/${concept.visualHandleUnlocked}.png`;
                     img.alt = `${concept.name} Art`;
                     img.classList.add('card-art-image');
                      img.onerror = function() { this.style.display='none'; this.nextElementSibling.style.display='block'; } // Basic error handling
                     popupVisualContainer.appendChild(img);
                      const icon = document.createElement('i'); // Add hidden fallback icon
                      icon.className = `fas fa-image card-visual-placeholder`;
                      icon.style.display = 'none';
                      popupVisualContainer.appendChild(icon);
                 } else { // Fallback if unlocked but no specific art handle
                      const icon = document.createElement('i');
                      icon.className = `fas fa-star card-visual-placeholder card-art-unlocked`;
                      icon.title = concept.visualHandleUnlocked || concept.visualHandle || "Unlocked Visual";
                      popupVisualContainer.appendChild(icon);
                 }
             }
        }

        // Refresh Grimoire view if currently open
        if (grimoireScreen.classList.contains('current')) {
            displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value);
        }

        gainAttunementForAction('artEvolve', concept.primaryElement, 1.5); // Attunement gain saves state
        updateMilestoneProgress('evolveArt', 1); // Milestone check saves state if achieved
        checkAndUpdateRituals('evolveArt'); // Ritual check saves state if completed

        // Final save just in case attunement/milestone didn't trigger one
        saveGameState(); // SAVE STATE

    } else {
        console.warn("Evolution conditions not met.");
        showTemporaryMessage("Cannot unlock art yet. Check requirements.", 3000);
