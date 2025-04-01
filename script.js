let currentElementIndex = 0;
let userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 };
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"];
let currentElementAnswers = {};
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // ID -> { concept, discoveredTime, artUnlocked: boolean, notes: string }
let focusedConcepts = new Set();
let focusSlotsTotal = 5;
const MAX_FOCUS_SLOTS = 12;
let userInsight = 10;
let elementAttunement = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
let unlockedDeepDiveLevels = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
const MAX_ATTUNEMENT = 100;
const BASE_RESEARCH_COST = 15;
const ART_EVOLVE_COST = 20;
const GUIDED_REFLECTION_COST = 10; // Increased cost
const DISSONANCE_THRESHOLD = 6.5;
const SCORE_NUDGE_AMOUNT = 0.15;
let freeResearchAvailableToday = false;
let currentReflectionContext = null;
let reflectionTargetConceptId = null;
let seenPrompts = new Set();
let completedRituals = { daily: {}, weekly: {} }; // Focus rituals added dynamically to daily checks
let achievedMilestones = new Set();
let lastLoginDate = null;
let cardsAddedSinceLastPrompt = 0;
let promptCooldownActive = false;
let currentReflectionElement = null; // Element for standard reflection
let currentReflectionCategory = null; // Category for guided/scene/rare reflection
let currentPromptId = null;
let toastTimeout = null;
let saveIndicatorTimeout = null;
// NEW Repository State
let discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() }; // Store IDs
let pendingRarePrompts = []; // Queue for unique prompts from rare cards

// --- Persistence Key ---
const SAVE_KEY = 'personaAlchemyLabSaveData';

// --- DOM Elements (v12 - Includes Repository) ---
const saveIndicator = document.getElementById('saveIndicator');
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startGuidedButton');
const loadButton = document.getElementById('loadButton');
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
const navButtons = document.querySelectorAll('.nav-button'); // Query all, including Repository later
const settingsButton = document.getElementById('settingsButton');
const personaScreen = document.getElementById('personaScreen');
const personaDetailedView = document.getElementById('personaDetailedView');
const personaSummaryView = document.getElementById('personaSummaryView');
const showDetailedViewBtn = document.getElementById('showDetailedViewBtn');
const showSummaryViewBtn = document.getElementById('showSummaryViewBtn');
const personaElementDetailsDiv = document.getElementById('personaElementDetails');
const userInsightDisplayPersona = document.getElementById('userInsightDisplayPersona');
const focusedConceptsDisplay = document.getElementById('focusedConceptsDisplay');
const focusedConceptsHeader = document.getElementById('focusedConceptsHeader');
const focusResonanceBarsContainer = document.getElementById('focusResonanceBars');
const tapestryNarrativeP = document.getElementById('tapestryNarrative');
const personaThemesList = document.getElementById('personaThemesList');
const summaryContentDiv = document.getElementById('summaryContent');
const studyScreen = document.getElementById('studyScreen');
const userInsightDisplayStudy = document.getElementById('userInsightDisplayStudy');
const researchButtonContainer = document.getElementById('researchButtonContainer');
const freeResearchButton = document.getElementById('freeResearchButton');
const seekGuidanceButton = document.getElementById('seekGuidanceButton');
const researchStatus = document.getElementById('researchStatus');
const researchOutput = document.getElementById('researchOutput');
const elementLibraryDiv = document.getElementById('elementLibrary');
const elementLibraryButtonsDiv = document.getElementById('elementLibraryButtons');
const elementLibraryContentDiv = document.getElementById('elementLibraryContent');
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const grimoireTypeFilter = document.getElementById('grimoireTypeFilter');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireRarityFilter = document.getElementById('grimoireRarityFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireContentDiv = document.getElementById('grimoireContent');
const repositoryScreen = document.getElementById('repositoryScreen'); // New Repository Screen
const repositoryScenesDiv = document.getElementById('repositoryScenes'); // Placeholder - Add to HTML if needed
const repositoryExperimentsDiv = document.getElementById('repositoryExperiments'); // Placeholder - Add to HTML if needed
const repositoryInsightsDiv = document.getElementById('repositoryInsights'); // Placeholder - Add to HTML if needed
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
const popupRelatedConceptsList = document.getElementById('relatedConceptsList');
const myNotesSection = document.getElementById('myNotesSection');
const myNotesTextarea = document.getElementById('myNotesTextarea');
const saveMyNoteButton = document.getElementById('saveMyNoteButton');
const noteSaveStatusSpan = document.getElementById('noteSaveStatus');
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
const markAsFocusButton = document.getElementById('markAsFocusButton');
const elementAttunementDisplay = document.getElementById('elementAttunementDisplay');
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay');
const milestonesDisplay = document.getElementById('milestonesDisplay');
const popupEvolutionSection = document.getElementById('popupEvolutionSection');
const evolveArtButton = document.getElementById('evolveArtButton');
const evolveCostSpan = document.getElementById('evolveCost');
const evolveEligibility = document.getElementById('evolveEligibility');
const reflectionModal = document.getElementById('reflectionModal');
const reflectionModalTitle = document.getElementById('reflectionModalTitle');
const closeReflectionModalButton = document.getElementById('closeReflectionModalButton');
const reflectionElement = document.getElementById('reflectionElement');
const reflectionPromptText = document.getElementById('reflectionPromptText');
const reflectionCheckbox = document.getElementById('reflectionCheckbox');
const scoreNudgeCheckbox = document.getElementById('scoreNudgeCheckbox');
const scoreNudgeLabel = document.getElementById('scoreNudgeLabel');
const confirmReflectionButton = document.getElementById('confirmReflectionButton');
const reflectionRewardAmount = document.getElementById('reflectionRewardAmount');
const settingsPopup = document.getElementById('settingsPopup');
const closeSettingsPopupButton = document.getElementById('closeSettingsPopupButton');
const forceSaveButton = document.getElementById('forceSaveButton');
const resetAppButton = document.getElementById('resetAppButton');
const milestoneAlert = document.getElementById('milestoneAlert');
const milestoneAlertText = document.getElementById('milestoneAlertText');
const closeMilestoneAlertButton = document.getElementById('closeMilestoneAlertButton');
const toastElement = document.getElementById('toastNotification');
const toastMessageElement = document.getElementById('toastMessage');


// --- Persistence Functions ---
function showSaveIndicator() { if (!saveIndicator) return; saveIndicator.classList.remove('hidden'); if (saveIndicatorTimeout) clearTimeout(saveIndicatorTimeout); saveIndicatorTimeout = setTimeout(() => { saveIndicator.classList.add('hidden'); saveIndicatorTimeout = null; }, 750); }
function saveGameState() {
    showSaveIndicator();
    try {
        const stateToSave = {
            userScores,
            discoveredConcepts: Array.from(discoveredConcepts.entries()),
            focusedConcepts: Array.from(focusedConcepts),
            userInsight,
            elementAttunement,
            unlockedDeepDiveLevels,
            achievedMilestones: Array.from(achievedMilestones),
            completedRituals, // Includes dynamic focus rituals state implicitly if tracked there
            lastLoginDate,
            focusSlotsTotal,
            seenPrompts: Array.from(seenPrompts),
            freeResearchAvailableToday,
            questionnaireCompleted: currentElementIndex >= elementNames.length,
            userAnswers,
            discoveredRepositoryItems: { // Save repository items
                 scenes: Array.from(discoveredRepositoryItems.scenes),
                 experiments: Array.from(discoveredRepositoryItems.experiments),
                 insights: Array.from(discoveredRepositoryItems.insights)
            },
            pendingRarePrompts // Save prompt queue
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    } catch (error) { console.error("Error saving game state:", error); showTemporaryMessage("Error: Could not save progress!", 4000); }
}
function loadGameState() {
    console.log("Attempting to load game state...");
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found:", loadedState);
            userScores = loadedState.userScores || { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 };
            discoveredConcepts = new Map(loadedState.discoveredConcepts || []);
            focusedConcepts = new Set(loadedState.focusedConcepts || []);
            userInsight = typeof loadedState.userInsight === 'number' ? loadedState.userInsight : 10;
            elementAttunement = loadedState.elementAttunement || { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
            unlockedDeepDiveLevels = loadedState.unlockedDeepDiveLevels || { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
            achievedMilestones = new Set(loadedState.achievedMilestones || []);
            completedRituals = loadedState.completedRituals || { daily: {}, weekly: {} };
            lastLoginDate = loadedState.lastLoginDate || null;
            focusSlotsTotal = typeof loadedState.focusSlotsTotal === 'number' ? loadedState.focusSlotsTotal : 5;
            seenPrompts = new Set(loadedState.seenPrompts || []);
            freeResearchAvailableToday = typeof loadedState.freeResearchAvailableToday === 'boolean' ? loadedState.freeResearchAvailableToday : false;
            userAnswers = loadedState.userAnswers || {};
            currentElementIndex = loadedState.questionnaireCompleted ? elementNames.length : 0;
            // Load repository items
            discoveredRepositoryItems = {
                scenes: new Set(loadedState.discoveredRepositoryItems?.scenes || []),
                experiments: new Set(loadedState.discoveredRepositoryItems?.experiments || []),
                insights: new Set(loadedState.discoveredRepositoryItems?.insights || [])
            };
            pendingRarePrompts = loadedState.pendingRarePrompts || []; // Load prompt queue

            console.log("Game state loaded successfully.");
            showTemporaryMessage("Session Restored", 2000);
            return true;
        } catch (error) { console.error("Error loading or parsing game state:", error); localStorage.removeItem(SAVE_KEY); showTemporaryMessage("Error loading session. Starting fresh.", 4000); return false; }
    } else { console.log("No saved game state found."); if(loadButton) loadButton.classList.add('hidden'); return false; }
}
function clearGameState() { console.log("Clearing saved game state..."); localStorage.removeItem(SAVE_KEY); showTemporaryMessage("Progress Reset!", 3000); if(loadButton) loadButton.classList.add('hidden'); }

// --- Data Availability Check ---
let dataLoaded = false;
function checkDataLoaded() {
    if (!dataLoaded) {
        dataLoaded = typeof elementDetails !== 'undefined' && typeof concepts !== 'undefined' && typeof questionnaireGuided !== 'undefined' && typeof reflectionPrompts !== 'undefined' && typeof elementDeepDive !== 'undefined' && typeof dailyRituals !== 'undefined' && typeof milestones !== 'undefined' && typeof elementKeyToFullName !== 'undefined' && typeof focusRituals !== 'undefined' && typeof sceneBlueprints !== 'undefined' && typeof alchemicalExperiments !== 'undefined' && typeof elementalInsights !== 'undefined'; // Check ALL data
        if (!dataLoaded) { console.error("CRITICAL: Data from data.js not loaded!"); }
    }
    return dataLoaded;
}

// --- Utility Maps ---
const elementNameToKey = { "Attraction": "A", "Interaction": "I", "Sensory": "S", "Psychological": "P", "Cognitive": "C", "Relational": "R" };

// --- Utility & Setup Functions ---
function gainInsight(amount, source = "Unknown") { if (typeof amount !== 'number' || isNaN(amount)) return; if (amount === 0) return; const previousInsight = userInsight; userInsight = Math.max(0, userInsight + amount); const actualChange = userInsight - previousInsight; if (actualChange !== 0) { const action = actualChange > 0 ? "Gained" : "Spent"; console.log(`${action} ${Math.abs(actualChange).toFixed(1)} Insight from ${source}. New total: ${userInsight.toFixed(1)}`); updateInsightDisplays(); if(studyScreen && !studyScreen.classList.contains('hidden')) { displayElementLibrary(); } saveGameState(); } }
function spendInsight(amount, source = "Unknown") { if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return false; if (userInsight >= amount) { gainInsight(-amount, source); return true; } else { showTemporaryMessage(`Not enough Insight! Need ${amount}.`, 3000); return false; } }
function updateInsightDisplays() { const formattedInsight = userInsight.toFixed(1); if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = formattedInsight; if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = formattedInsight; displayResearchButtons(); if (seekGuidanceButton) seekGuidanceButton.disabled = userInsight < GUIDED_REFLECTION_COST; }
function getScoreLabel(score) { if (typeof score !== 'number' || isNaN(score)) return "N/A"; if (score >= 9) return "Very High"; if (score >= 7) return "High"; if (score >= 5) return "Moderate"; if (score >= 3) return "Low"; return "Very Low"; }
function getAffinityLevel(score) { if (typeof score !== 'number' || isNaN(score)) return null; if (score >= 8) return "High"; if (score >= 5) return "Moderate"; return null; }
function getElementColor(elementName) { const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' }; return colors[elementName] || '#CCCCCC'; }
function hexToRgba(hex, alpha = 1) { if (!hex || typeof hex !== 'string') return `rgba(128,128,128, ${alpha})`; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return `rgba(128,128,128, ${alpha})`; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `rgba(${r},${g},${b},${alpha})`; }
function getCardTypeIcon(cardType) { switch (cardType) { case "Orientation": return "fa-solid fa-compass"; case "Identity/Role": return "fa-solid fa-mask"; case "Practice/Kink": return "fa-solid fa-gear"; case "Psychological/Goal": return "fa-solid fa-brain"; case "Relationship Style": return "fa-solid fa-heart"; default: return "fa-solid fa-question-circle"; } }
function getElementIcon(elementName) { switch (elementName) { case "Attraction": return "fa-solid fa-magnet"; case "Interaction": return "fa-solid fa-users"; case "Sensory": return "fa-solid fa-hand-sparkles"; case "Psychological": return "fa-solid fa-comment-dots"; case "Cognitive": return "fa-solid fa-lightbulb"; case "Relational": return "fa-solid fa-link"; default: return "fa-solid fa-atom"; } }
function euclideanDistance(userScoresObj, conceptScoresObj) { let sumOfSquares = 0; let validDimensions = 0; if (!userScoresObj || typeof userScoresObj !== 'object') { return Infinity; } if (!conceptScoresObj || typeof conceptScoresObj !== 'object') { return Infinity; } const expectedKeys = Object.keys(userScoresObj); if (expectedKeys.length === 0) { return Infinity; } for (const key of expectedKeys) { const s1 = userScoresObj[key]; const s2 = conceptScoresObj[key]; const s1Valid = typeof s1 === 'number' && !isNaN(s1); const s2Valid = conceptScoresObj.hasOwnProperty(key) && typeof s2 === 'number' && !isNaN(s2); if (s1Valid && s2Valid) { sumOfSquares += Math.pow(s1 - s2, 2); validDimensions++; } } if (validDimensions === 0) return Infinity; return Math.sqrt(sumOfSquares); }

// --- Screen Management ---
function showScreen(screenId) { console.log("Showing screen:", screenId); let targetIsMain = ['personaScreen', 'studyScreen', 'grimoireScreen', 'repositoryScreen'].includes(screenId); /* Added Repository */ screens.forEach(screen => { screen.classList.toggle('current', screen.id === screenId); screen.classList.toggle('hidden', screen.id !== screenId); }); if (mainNavBar) mainNavBar.classList.toggle('hidden', !targetIsMain); navButtons.forEach(button => { button.classList.toggle('active', button.dataset.target === screenId); }); if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen', 'repositoryScreen'].includes(screenId)) { window.scrollTo(0, 0); } }
function hidePopups() { if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden'); if (reflectionModal) reflectionModal.classList.add('hidden'); if (settingsPopup) settingsPopup.classList.add('hidden'); if (popupOverlay) popupOverlay.classList.add('hidden'); currentlyDisplayedConceptId = null; currentReflectionElement = null; currentPromptId = null; currentReflectionContext = null; reflectionTargetConceptId = null; }

// --- Initialization and Questionnaire Logic ---
function initializeQuestionnaire(forceReset = false) {
    if (!checkDataLoaded()) return;
    console.log(`[initializeQuestionnaire] Called. Force Reset: ${forceReset}`); const isResuming = !forceReset && localStorage.getItem(SAVE_KEY); if (!isResuming) { console.log("[initializeQuestionnaire] Resetting core state variables."); currentElementIndex = 0; userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; userAnswers = {}; elementNames.forEach(elName => { userAnswers[elName] = {}; }); discoveredConcepts = new Map(); focusedConcepts = new Set(); userInsight = 10; focusSlotsTotal = 5; elementAttunement = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; unlockedDeepDiveLevels = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; seenPrompts = new Set(); completedRituals = { daily: {}, weekly: {} }; achievedMilestones = new Set(); lastLoginDate = null; cardsAddedSinceLastPrompt = 0; promptCooldownActive = false; freeResearchAvailableToday = false; discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() }; pendingRarePrompts = []; /* Reset new state */ } else { console.log("[initializeQuestionnaire] Skipping core state reset (resuming or loaded)."); if (currentElementIndex < elementNames.length) { currentElementIndex = 0; userAnswers = {}; elementNames.forEach(elName => { userAnswers[elName] = {}; }); console.log("[initializeQuestionnaire] Restarting questionnaire from element 0."); } }
    updateElementProgressHeader(-1); displayElementQuestions(currentElementIndex); showScreen('questionnaireScreen'); if (mainNavBar) mainNavBar.classList.add('hidden'); if(dailyRitualsDisplay) dailyRitualsDisplay.innerHTML = '<li>Loading...</li>'; if(milestonesDisplay) milestonesDisplay.innerHTML = '<li>None yet</li>'; if(elementAttunementDisplay) elementAttunementDisplay.innerHTML = ''; if(grimoireContentDiv) grimoireContentDiv.innerHTML = '<p>Grimoire empty.</p>'; if(focusedConceptsDisplay) focusedConceptsDisplay.innerHTML = '<li>Mark concepts as "Focus"...</li>'; if(researchButtonContainer) researchButtonContainer.innerHTML = ''; if(freeResearchButton) freeResearchButton.classList.add('hidden'); updateInsightDisplays(); updateFocusSlotsDisplay(); updateGrimoireCounter(); if(personaDetailedView) personaDetailedView.classList.add('current'); if(personaDetailedView) personaDetailedView.classList.remove('hidden'); if(personaSummaryView) personaSummaryView.classList.add('hidden'); if(personaSummaryView) personaSummaryView.classList.remove('current'); if(showDetailedViewBtn) showDetailedViewBtn.classList.add('active'); if(showSummaryViewBtn) showSummaryViewBtn.classList.remove('active');
}
function updateElementProgressHeader(activeIndex) {
    if (!checkDataLoaded() || !elementProgressHeader) return;
    elementProgressHeader.innerHTML = ''; elementNames.forEach((name, index) => { const tab = document.createElement('div'); tab.classList.add('element-tab'); const elementData = elementDetails[name] || {}; tab.textContent = elementData.name || name; tab.title = elementData.name || name; tab.classList.toggle('completed', index < activeIndex); tab.classList.toggle('active', index === activeIndex); elementProgressHeader.appendChild(tab); });
}
function displayElementQuestions(index) {
    if (!checkDataLoaded()) return;
    if (index >= elementNames.length) { finalizeScoresAndShowPersona(); return; } const elementName = elementNames[index]; const elementData = elementDetails[elementName] || {}; const questions = questionnaireGuided[elementName] || []; const questionContentElement = document.getElementById('questionContent'); if (!questionContentElement) { return; } let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`; questionContentElement.innerHTML = introHTML; currentElementAnswers = { ...(userAnswers[elementName] || {}) }; let questionsHTML = '';
    if (questions && questions.length > 0) { questions.forEach(q => { let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`; const savedAnswer = currentElementAnswers[q.qId]; if (q.type === "slider") { const val = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += ` <div class="slider-container"> <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${val}" data-question-id="${q.qId}" data-type="slider"> <div class="label-container"> <span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span> </div> <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(val).toFixed(1)}</span></p> <p class="slider-feedback" id="feedback_${q.qId}"></p> </div>`; } else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const checked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; } else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; } inputHTML += `</div></div>`; questionsHTML += inputHTML; }); } else { questionsHTML = '<p><em>(No questions defined)</em></p>'; }
    const introDiv = questionContentElement.querySelector('.element-intro'); if (introDiv) { introDiv.insertAdjacentHTML('afterend', questionsHTML); } else { questionContentElement.innerHTML += questionsHTML; }
    questionContentElement.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.addEventListener(eventType, handleQuestionnaireInputChange); }); questionContentElement.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => { checkbox.addEventListener('change', (event) => enforceMaxChoices(checkbox.name, parseInt(checkbox.dataset.maxChoices || 2), event)); }); questionContentElement.querySelectorAll('.slider.q-input').forEach(slider => { updateSliderFeedbackText(slider); });
    updateElementProgressHeader(index); if (progressText) progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || elementName}`; updateDynamicFeedback(elementName); if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block'; if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; if (nextElementButton) nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}
function updateSliderFeedbackText(sliderElement) { if (!checkDataLoaded()) return; if (!sliderElement || sliderElement.type !== 'range') return; const qId = sliderElement.dataset.questionId; const feedbackElement = document.getElementById(`feedback_${qId}`); if (!feedbackElement) return; const currentValue = parseFloat(sliderElement.value); const elementName = elementNames[currentElementIndex]; const interpretations = elementDetails?.[elementName]?.scoreInterpretations; if (!interpretations) { feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; return; } const scoreLabel = getScoreLabel(currentValue); const interpretationText = interpretations[scoreLabel] || `Interpretation for "${scoreLabel}" not found.`; feedbackElement.textContent = interpretationText; feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`; }
function handleQuestionnaireInputChange(event) { const input = event.target; const type = input.dataset.type; const elementName = elementNames[currentElementIndex]; if (type === 'slider') { const qId = input.dataset.questionId; const display = document.getElementById(`display_${qId}`); if (display) display.textContent = parseFloat(input.value).toFixed(1); updateSliderFeedbackText(input); } collectCurrentElementAnswers(); updateDynamicFeedback(elementName); }
function enforceMaxChoices(name, max, event) { const checkboxes = questionContent?.querySelectorAll(`input[name="${name}"]:checked`); if (!checkboxes) return; if (checkboxes.length > max) { showTemporaryMessage(`Max ${max} options allowed.`, 2500); if (event?.target?.checked) { event.target.checked = false; collectCurrentElementAnswers(); updateDynamicFeedback(elementNames[currentElementIndex]); } } }
function collectCurrentElementAnswers() { const elementName = elementNames[currentElementIndex]; const questions = questionnaireGuided[elementName] || []; currentElementAnswers = {}; questions.forEach(q => { const qId = q.qId; const container = questionContent || document; if (q.type === 'slider') { const input = container.querySelector(`#${qId}.q-input`); if (input) currentElementAnswers[qId] = parseFloat(input.value); } else if (q.type === 'radio') { const checked = container.querySelector(`input[name="${qId}"]:checked`); if (checked) currentElementAnswers[qId] = checked.value; } else if (q.type === 'checkbox') { const checked = container.querySelectorAll(`input[name="${qId}"]:checked`); currentElementAnswers[qId] = Array.from(checked).map(cb => cb.value); } }); userAnswers[elementName] = { ...currentElementAnswers }; }
function updateDynamicFeedback(elementName) { if (!checkDataLoaded()) return; const elementData = elementDetails?.[elementName]; if (!elementData) return; if (!dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) return; const tempScore = calculateElementScore(elementName, currentElementAnswers); const scoreLabel = getScoreLabel(tempScore); feedbackElementSpan.textContent = elementData.name || elementName; feedbackScoreSpan.textContent = tempScore.toFixed(1); let labelSpan = dynamicScoreFeedback.querySelector('.score-label'); if (labelSpan) { labelSpan.textContent = `(${scoreLabel})`; } feedbackScoreBar.style.width = `${tempScore * 10}%`; }
function calculateElementScore(elementName, answersForElement) { const questions = questionnaireGuided[elementName] || []; let score = 5.0; questions.forEach(q => { const answer = answersForElement[q.qId]; let pointsToAdd = 0; if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); } else if (q.type === 'radio') { const opt = q.options.find(o => o.value === answer); pointsToAdd = opt ? (opt.points || 0) * (q.scoreWeight || 1.0) : 0; } else if (q.type === 'checkbox' && Array.isArray(answer)) { answer.forEach(val => { const opt = q.options.find(o => o.value === val); pointsToAdd += opt ? (opt.points || 0) * (q.scoreWeight || 1.0) : 0; }); } score += pointsToAdd; }); return Math.max(0, Math.min(10, score)); }
function nextElement() { collectCurrentElementAnswers(); currentElementIndex++; displayElementQuestions(currentElementIndex); }
function prevElement() { collectCurrentElementAnswers(); currentElementIndex--; displayElementQuestions(currentElementIndex); }
function finalizeScoresAndShowPersona() { if (!checkDataLoaded()) return; console.log("Finalizing scores..."); const finalScores = {}; try { elementNames.forEach(elementName => { const score = calculateElementScore(elementName, userAnswers[elementName] || {}); const key = elementNameToKey[elementName]; if (key) { finalScores[key] = score; } else { console.warn(`Could not find key for element name: ${elementName}`); } }); userScores = finalScores; console.log("Final User Scores:", userScores); determineStarterHandAndEssence(); updateMilestoneProgress('completeQuestionnaire', 1); checkForDailyLogin(); displayPersonaScreen(); displayStudyScreenContent(); displayDailyRituals(); displayMilestones(); populateGrimoireFilters(); updateGrimoireCounter(); displayGrimoire(); displayRepositoryContent(); saveGameState(); showScreen('personaScreen'); showTemporaryMessage("Experiment Complete! Explore your results.", 4000); } catch (error) { console.error("Error during finalizeScoresAndShowPersona sequence:", error); try { showScreen('welcomeScreen'); alert("An error occurred during setup. Please check console and try restarting."); } catch (fallbackError) { console.error("Error during fallback sequence:", fallbackError); document.body.innerHTML = "<h1>Critical Error</h1><p>Setup failed. Check console (F12) and refresh.</p>"; } } }

// --- Starter Hand & Resource Granting ---
function determineStarterHandAndEssence() { if (!checkDataLoaded()) return; console.log("[determineStarterHand] Function called."); discoveredConcepts = new Map(); if (!concepts || !Array.isArray(concepts) || concepts.length === 0) { return; } if (typeof elementKeyToFullName === 'undefined' || !elementKeyToFullName) { return; } let conceptsWithDistance = []; concepts.forEach((c, index) => { if (!c || typeof c !== 'object' || !c.id || !c.elementScores) { return; } const distance = euclideanDistance(userScores, c.elementScores); if (distance !== Infinity && typeof distance === 'number' && !isNaN(distance)) { conceptsWithDistance.push({ ...c, distance: distance }); } }); if (conceptsWithDistance.length === 0) { return; } conceptsWithDistance.sort((a, b) => a.distance - b.distance); const candidates = conceptsWithDistance.slice(0, 20); const starterHand = []; const representedElements = new Set(); const starterHandIds = new Set(); const targetHandSize = 7; for (const c of candidates) { if (starterHand.length >= 4) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } } for (const c of candidates) { if (starterHand.length >= targetHandSize) break; if (starterHandIds.has(c.id)) continue; const needsRepresentation = c.primaryElement && !representedElements.has(c.primaryElement); if (needsRepresentation || representedElements.size < 4 || starterHand.length < 5) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } } for (const c of candidates) { if (starterHand.length >= targetHandSize) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); } } console.log("[determineStarterHand] Starter Hand Selected:", starterHand.map(c => c.name)); if (starterHand.length === 0) { return; } starterHand.forEach(concept => { if (!discoveredConcepts.has(concept.id)) { discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false, notes: "" }); gainAttunementForAction('discover', concept.primaryElement); } }); console.log(`[determineStarterHand] Discovered Concepts Count: ${discoveredConcepts.size}`); }

// --- Attunement ---
function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) { if (!checkDataLoaded()) return; let targetKeys = []; const gainAmount = amount; if (elementKey && elementAttunement.hasOwnProperty(elementKey)) { targetKeys.push(elementKey); } else if (actionType === 'completeReflection' && currentReflectionElement && elementNameToKey[currentReflectionElement]) { const key = elementNameToKey[currentReflectionElement]; if (key && elementAttunement.hasOwnProperty(key)) { targetKeys.push(key); } } else if (['generic', 'completeReflectionGeneric', 'scoreNudge', 'ritual', 'milestone', 'experimentSuccess'].includes(actionType) || elementKey === 'All') { targetKeys = Object.keys(elementAttunement); amount = (actionType === 'generic') ? 0.1 : (actionType === 'completeReflectionGeneric') ? 0.2 : (actionType === 'scoreNudge') ? 0.5 / targetKeys.length : amount; } else { return; } let changed = false; targetKeys.forEach(key => { const currentAttunement = elementAttunement[key] || 0; const newAttunement = Math.min(MAX_ATTUNEMENT, currentAttunement + gainAmount); if (newAttunement > currentAttunement) { elementAttunement[key] = newAttunement; changed = true; updateMilestoneProgress('elementAttunement', { [key]: newAttunement }); updateMilestoneProgress('elementAttunement', elementAttunement); } }); if (changed) { console.log(`Attunement updated (${actionType}, Key: ${elementKey || 'Multi'}) by ${gainAmount.toFixed(1)}`); displayElementAttunement(); saveGameState(); } }
function displayElementAttunement() {
    // Display inside Core Foundation details
    if (!checkDataLoaded()) return;
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const attunementValue = elementAttunement[key] || 0;
        const percentage = (attunementValue / MAX_ATTUNEMENT) * 100;
        const color = getElementColor(elName);
        const targetDetails = personaElementDetailsDiv?.querySelector(`.element-detail-entry[data-element-key="${key}"]`); // Need to add data-element-key to details in displayPersonaScreen
        if (targetDetails) {
            let attunementDiv = targetDetails.querySelector('.attunement-display');
            if (!attunementDiv) {
                attunementDiv = document.createElement('div');
                attunementDiv.classList.add('attunement-display');
                targetDetails.querySelector('.element-description').appendChild(document.createElement('hr')); // Add separator
                targetDetails.querySelector('.element-description').appendChild(attunementDiv);
            }
            attunementDiv.innerHTML = `
                <div class="attunement-item">
                    <span class="attunement-name">Attunement:</span>
                    <div class="attunement-bar-container" title="${attunementValue.toFixed(1)} / ${MAX_ATTUNEMENT}">
                        <div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div>
                    </div>
                     <i id="attunementInfoIcon" class="fas fa-info-circle info-icon" title="Attunement grows through focused actions like research, reflection, and unlocking content related to this element."></i>
                </div>`;
        }
    });
}

// --- Persona Screen Functions ---
function updateFocusSlotsDisplay() { if (focusedConceptsHeader) { focusedConceptsHeader.textContent = `Focused Concepts (${focusedConcepts.size} / ${focusSlotsTotal})`; } }
function displayPersonaScreen() {
    if (!checkDataLoaded()) return;
    if (!personaElementDetailsDiv) return; personaElementDetailsDiv.innerHTML = '';
    elementNames.forEach(elementName => { const key = elementNameToKey[elementName]; const score = userScores[key]; const scoreLabel = getScoreLabel(score); const elementData = elementDetails[elementName] || {}; const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A"; const barWidth = score ? (score / 10) * 100 : 0; const color = getElementColor(elementName); const details = document.createElement('details'); details.classList.add('element-detail-entry'); details.dataset.elementKey = key; /* ADD KEY FOR ATTUNEMENT TARGETING */ details.style.setProperty('--element-color', color); details.innerHTML = `<summary class="element-detail-header"><div><strong>${elementData.name || elementName}:</strong><span>${score?.toFixed(1) ?? '?'}</span> <span class="score-label">(${scoreLabel})</span></div><div class="score-bar-container"><div style="width: ${barWidth}%; background-color: ${color};"></div></div></summary><div class="element-description"><p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p><p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p><hr><p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p><p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p></div>`; personaElementDetailsDiv.appendChild(details); });
    updateInsightDisplays(); displayElementAttunement(); /* Now renders inside details */ displayFocusedConceptsPersona(); updateFocusElementalResonance(); generateTapestryNarrative(); synthesizeAndDisplayThemesPersona(); displayMilestones(); displayPersonaSummary();
}
function displayFocusedConceptsPersona() { if (!checkDataLoaded() || !focusedConceptsDisplay) return; focusedConceptsDisplay.innerHTML = ''; updateFocusSlotsDisplay(); if (focusedConcepts.size === 0) { focusedConceptsDisplay.innerHTML = `<li>Mark concepts as "Focus" to weave your active Tapestry (Max ${focusSlotsTotal}).</li>`; return; } focusedConcepts.forEach(conceptId => { const conceptData = discoveredConcepts.get(conceptId); if (conceptData?.concept) { const concept = conceptData.concept; const item = document.createElement('div'); item.classList.add('focus-concept-item'); item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`; item.innerHTML = `<i class="${getCardTypeIcon(concept.cardType)}"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`; item.addEventListener('click', () => showConceptDetailPopup(concept.id)); focusedConceptsDisplay.appendChild(item); } else { console.warn(`Focused concept ID ${conceptId} not found in discoveredConcepts.`); } }); }
function synthesizeAndDisplayThemesPersona() {
    if (!checkDataLoaded()) return;
    if (!personaThemesList) return; personaThemesList.innerHTML = ''; if (focusedConcepts.size === 0) { personaThemesList.innerHTML = '<li>Mark Focused Concepts to reveal dominant themes.</li>'; return; } if (typeof elementKeyToFullName === 'undefined') { return; } const elementCountsByKey = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const themeThreshold = 7.0; focusedConcepts.forEach(id => { const discoveredData = discoveredConcepts.get(id); const concept = discoveredData?.concept; if (concept?.elementScores) { for (const key in concept.elementScores) { if (elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= themeThreshold) { elementCountsByKey[key]++; } } } }); const sortedThemes = Object.entries(elementCountsByKey).filter(([key, count]) => count > 0 && elementDetails[elementKeyToFullName[key]]).sort(([, a], [, b]) => b - a).map(([key, count]) => ({ name: elementDetails[elementKeyToFullName[key]]?.name || key, count })); if (sortedThemes.length === 0) { personaThemesList.innerHTML = `<li>No strong themes (element score >= ${themeThreshold.toFixed(1)}) detected.</li>`; return; } sortedThemes.slice(0, 3).forEach(theme => { const li = document.createElement('li'); li.textContent = `${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})`; personaThemesList.appendChild(li); });
}
function updateFocusElementalResonance() {
    if (!checkDataLoaded() || !focusResonanceBarsContainer) return;
    focusResonanceBarsContainer.innerHTML = ''; const focusScores = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; let focusCount = focusedConcepts.size; if (focusCount > 0) { focusedConcepts.forEach(id => { const data = discoveredConcepts.get(id); if (data?.concept?.elementScores) { for (const key in focusScores) { if (data.concept.elementScores.hasOwnProperty(key)) { focusScores[key] += data.concept.elementScores[key]; } } } }); for (const key in focusScores) { focusScores[key] /= focusCount; } } elementNames.forEach(elName => { const key = elementNameToKey[elName]; const avgScore = focusScores[key] || 0; const percentage = Math.max(0, Math.min(100, (avgScore / 10) * 100)); const color = getElementColor(elName); const name = elementDetails[elName]?.name || elName; const item = document.createElement('div'); item.classList.add('focus-resonance-item'); item.innerHTML = ` <span class="focus-resonance-name">${name}:</span> <div class="focus-resonance-bar-container" title="${avgScore.toFixed(1)} Avg Score"> <div class="focus-resonance-bar" style="width: ${percentage}%; background-color: ${color};"></div> </div>`; focusResonanceBarsContainer.appendChild(item); });
}
function generateTapestryNarrative() { // Added Synergy Check
    if (!checkDataLoaded() || !tapestryNarrativeP) return;
    const focusCount = focusedConcepts.size; if (focusCount === 0) { tapestryNarrativeP.textContent = 'Mark concepts as "Focus" to weave your narrative...'; return; } const focusScores = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; focusedConcepts.forEach(id => { const data = discoveredConcepts.get(id); if (data?.concept?.elementScores) { for (const key in focusScores) { if (data.concept.elementScores.hasOwnProperty(key)) { focusScores[key] += data.concept.elementScores[key]; } } } }); for (const key in focusScores) { focusScores[key] /= focusCount; } const sortedElements = Object.entries(focusScores).filter(([key, score]) => score > 0).sort(([, a], [, b]) => b - a); if (sortedElements.length === 0) { tapestryNarrativeP.textContent = 'Your focused concepts show a balanced, subtle essence.'; return; } const [topKey, topScore] = sortedElements[0]; const topElementName = elementDetails[elementKeyToFullName[topKey]]?.name || topKey; let topConceptName = ""; for (const id of focusedConcepts) { const data = discoveredConcepts.get(id); if (data?.concept?.primaryElement === topKey || (data?.concept?.elementScores[topKey] || 0) >= 7) { topConceptName = data.concept.name; break; } } if (!topConceptName && focusedConcepts.size > 0) { topConceptName = discoveredConcepts.get(focusedConcepts.values().next().value)?.concept?.name || "?"; } let narrative = `Your current tapestry resonates strongly with **${topElementName}**`; if (topConceptName) narrative += `, reflected in your focus on **${topConceptName}**. `; else narrative += ". "; if (sortedElements.length > 1) { const [secondKey, secondScore] = sortedElements[1]; if (secondScore > 3.5) { const secondElementName = elementDetails[elementKeyToFullName[secondKey]]?.name || secondKey; let secondConceptName = ""; for (const id of focusedConcepts) { const data = discoveredConcepts.get(id); if(data?.concept?.name === topConceptName) continue; if (data?.concept?.primaryElement === secondKey || (data?.concept?.elementScores[secondKey] || 0) >= 6) { secondConceptName = data.concept.name; break; } } narrative += `Undercurrents of **${secondElementName}** add complexity`; if(secondConceptName) narrative += ` through **${secondConceptName}**.`; else narrative += "."; } }
    // Check for Synergy
    let synergyFound = false; const focusedArray = Array.from(focusedConcepts);
    for (let i = 0; i < focusedArray.length; i++) {
        const conceptAData = discoveredConcepts.get(focusedArray[i]);
        if (!conceptAData || !conceptAData.concept.relatedIds) continue;
        for (let j = i + 1; j < focusedArray.length; j++) {
            const conceptBData = discoveredConcepts.get(focusedArray[j]);
            if (conceptAData.concept.relatedIds.includes(focusedArray[j])) {
                narrative += ` The synergy between **${conceptAData.concept.name}** and **${conceptBData.concept.name}** suggests [potential emergent theme, e.g., 'a dynamic exploration of control' or 'an interest in intense sensation within connection'].`; // Add more specific themes later
                synergyFound = true; break; // Only mention first synergy found for now
            }
        } if (synergyFound) break;
    }
    tapestryNarrativeP.innerHTML = narrative.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
function displayPersonaSummary() {
    if (!checkDataLoaded() || !summaryContentDiv) return;
    summaryContentDiv.innerHTML = ''; let html = '<h3>Core Essence</h3><p>'; elementNames.forEach(elName => { const key = elementNameToKey[elName]; const score = userScores[key]; const label = getScoreLabel(score); const interpretation = elementDetails[elName]?.scoreInterpretations?.[label] || "N/A"; html += `<strong>${elementDetails[elName]?.name || elName} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}<br>`; }); html += '</p><hr>'; html += '<h3>Focused Tapestry</h3>'; if (focusedConcepts.size > 0) { const narrativeText = tapestryNarrativeP.innerHTML; html += `<p><em>${narrativeText || "No narrative generated."}</em></p>`; html += '<strong>Focused Concepts:</strong><ul>'; focusedConcepts.forEach(id => { const name = discoveredConcepts.get(id)?.concept?.name || `Concept ID ${id}`; html += `<li>${name}</li>`; }); html += '</ul>'; const themeItems = personaThemesList.innerHTML; if (themeItems && !themeItems.includes("<li>Mark Focused Concepts")) { html += '<strong>Dominant Themes:</strong><ul>' + themeItems + '</ul>'; } else { html += '<strong>Dominant Themes:</strong><p>Mark concepts with high element scores as "Focus" to see themes here.</p>'; } } else { html += '<p>No concepts are currently focused.</p>'; } html += '<hr>'; html += '<h3>Key Milestones</h3>'; const milestoneItems = milestonesDisplay.innerHTML; if (milestoneItems && !milestoneItems.includes("None yet")) { html += '<ul>' + milestoneItems + '</ul>'; } else { html += '<p>No milestones achieved yet.</p>'; } summaryContentDiv.innerHTML = html;
}

// --- Study Screen Functions ---
function displayStudyScreenContent() { if (!checkDataLoaded()) return; updateInsightDisplays(); displayResearchButtons(); displayDailyRituals(); displayElementLibrary(); }
function displayResearchButtons() {
    if (!checkDataLoaded() || !researchButtonContainer) return;
    researchButtonContainer.innerHTML = ''; if (freeResearchAvailableToday && freeResearchButton) { freeResearchButton.classList.remove('hidden'); freeResearchButton.disabled = false; freeResearchButton.textContent = "Perform Daily Meditation (Free Research)"; freeResearchButton.onclick = handleFreeResearchClick; } else if (freeResearchButton) { freeResearchButton.disabled = true; freeResearchButton.textContent = freeResearchAvailableToday === false ? "Daily Meditation Performed" : "Perform Daily Meditation"; } elementNames.forEach(elName => { const key = elementNameToKey[elName]; const currentAttunement = elementAttunement[key] || 0; let currentCost = BASE_RESEARCH_COST; if (currentAttunement > 80) currentCost = Math.max(5, BASE_RESEARCH_COST - 5); else if (currentAttunement > 50) currentCost = Math.max(5, BASE_RESEARCH_COST - 3); const canAfford = userInsight >= currentCost; const fullName = elementDetails[elName]?.name || elName; const button = document.createElement('button'); button.classList.add('button', 'research-button'); button.dataset.elementKey = key; button.dataset.cost = currentCost; button.disabled = !canAfford; button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`; button.innerHTML = ` <span class="research-el-icon" style="color: ${getElementColor(elName)};"><i class="${getElementIcon(fullName)}"></i></span> <span class="research-el-name">${fullName}</span> <span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span> `; button.addEventListener('click', handleResearchClick); researchButtonContainer.appendChild(button); }); if (seekGuidanceButton) seekGuidanceButton.disabled = userInsight < GUIDED_REFLECTION_COST;
}
function handleResearchClick(event) { const button = event.currentTarget; const elementKey = button.dataset.elementKey; const currentCost = parseFloat(button.dataset.cost); if (!elementKey || isNaN(currentCost) || button.disabled) return; if (spendInsight(currentCost, `Research: ${elementKeyToFullName[elementKey]}`)) { console.log(`Spent ${currentCost} Insight researching ${elementKey}.`); conductResearch(elementKey); updateMilestoneProgress('conductResearch', 1); checkAndUpdateRituals('conductResearch'); } }
function handleFreeResearchClick() { if (!freeResearchAvailableToday) { showTemporaryMessage("Daily meditation already performed today.", 3000); return; } const keys = Object.keys(elementAttunement); let targetKey = keys[0]; let minAttunement = MAX_ATTUNEMENT + 1; keys.forEach(key => { if (elementAttunement[key] < minAttunement) { minAttunement = elementAttunement[key]; targetKey = key; } }); console.log(`Performing free daily meditation on ${targetKey} (${elementKeyToFullName[targetKey]})`); freeResearchAvailableToday = false; if (freeResearchButton) { freeResearchButton.disabled = true; freeResearchButton.textContent = "Daily Meditation Performed"; } conductResearch(targetKey); updateMilestoneProgress('freeResearch', 1); checkAndUpdateRituals('freeResearch'); saveGameState(); }
function conductResearch(elementKeyToResearch) {
    if (!checkDataLoaded()) return;
    if (typeof elementKeyToFullName === 'undefined') return; const elementFullName = elementKeyToFullName[elementKeyToResearch]; if (!elementFullName) return; console.log(`Researching: ${elementFullName} (Key: ${elementKeyToResearch})`); if (researchStatus) researchStatus.textContent = `Reviewing notes on ${elementDetails[elementFullName]?.name || elementFullName}...`; if (researchOutput) researchOutput.innerHTML = ''; const discoveredIds = new Set(discoveredConcepts.keys()); const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));

    // --- RARE DISCOVERY CHECKS (Before concept search) ---
    let rareItemFound = false;
    const discoveryRoll = Math.random();
    const insightDiscoveryChance = 0.015; // 1.5% chance per research for an Elemental Insight fragment
    const sceneDiscoveryChance = 0.008; // 0.8% chance per research for a Scene Blueprint

    if (discoveryRoll < sceneDiscoveryChance && sceneBlueprints.length > 0) {
        const availableScenes = sceneBlueprints.filter(s => !discoveredRepositoryItems.scenes.has(s.id));
        if (availableScenes.length > 0) {
            const foundScene = availableScenes[Math.floor(Math.random() * availableScenes.length)];
            discoveredRepositoryItems.scenes.add(foundScene.id);
            saveGameState();
            researchOutput.innerHTML = `<div class="repository-item-discovery"><h4><i class="fas fa-scroll"></i> Scene Blueprint Discovered!</h4><p>You've uncovered notes detailing the '${foundScene.name}' scenario. View it in the Repository.</p></div>`;
            showTemporaryMessage("Scene Blueprint Discovered!", 4000);
            rareItemFound = true;
        }
    } else if (discoveryRoll < (sceneDiscoveryChance + insightDiscoveryChance) && elementalInsights.length > 0) {
        // Find insights matching the *researched* element, prefer unseen
        const relevantInsights = elementalInsights.filter(i => i.element === elementKeyToResearch);
        const unseenRelevant = relevantInsights.filter(i => !discoveredRepositoryItems.insights.has(i.id));
        const poolToUse = unseenRelevant.length > 0 ? unseenRelevant : relevantInsights; // Fallback to seen if no unseen relevant
        if (poolToUse.length > 0) {
            const foundInsight = poolToUse[Math.floor(Math.random() * poolToUse.length)];
            discoveredRepositoryItems.insights.add(foundInsight.id);
            updateMilestoneProgress('repositoryInsightsCount', discoveredRepositoryItems.insights.size); // Track count
            saveGameState();
            researchOutput.innerHTML = `<div class="repository-item-discovery"><h4><i class="fas fa-lightbulb"></i> Elemental Insight Fragment Found!</h4><p>"${foundInsight.text}"</p><p>This fragment has been added to your Repository.</p></div>`;
            showTemporaryMessage("Elemental Insight Fragment Found!", 3500);
            rareItemFound = true;
        }
    }

    // If a rare item was found, skip normal concept discovery for this research action
    if (rareItemFound) {
        if (researchStatus) researchStatus.textContent = "A unique insight unearthed!";
        gainAttunementForAction('researchSpecial', elementKeyToResearch, 1.0); // Reward for special find
        return;
    }

    // --- NORMAL CONCEPT DISCOVERY ---
    if (undiscoveredPool.length === 0) { if (researchStatus) researchStatus.textContent = "Research complete. No more concepts to discover."; if (researchOutput) researchOutput.innerHTML = '<p><i>The library holds all known concepts.</i></p>'; gainInsight(5.0, "All Concepts Discovered Bonus"); return; }
    const currentAttunement = elementAttunement[elementKeyToResearch] || 0; const priorityPool = []; const secondaryPool = []; const tertiaryPool = []; undiscoveredPool.forEach(c => { const score = c.elementScores?.[elementKeyToResearch] || 0; const isPrimary = c.primaryElement === elementKeyToResearch; if (isPrimary || score >= 7.5) { priorityPool.push(c); } else if (score >= 4.5) { secondaryPool.push(c); } else { tertiaryPool.push(c); } }); const selectedForOutput = []; let duplicateInsightGain = 0; const numberOfResults = 3;
    const selectWeightedRandomFromPools = () => {
        const pools = [ { pool: priorityPool, weightMultiplier: 3.5 }, { pool: secondaryPool, weightMultiplier: 1.5 }, { pool: tertiaryPool, weightMultiplier: 0.8 } ]; let combinedWeightedPool = []; let totalWeight = 0;
        pools.forEach(({ pool, weightMultiplier }) => { pool.forEach(card => { let weight = 1.0 * weightMultiplier; const rarityFactor = 1 + (currentAttunement / (MAX_ATTUNEMENT * 1.5)); if (card.rarity === 'uncommon') weight *= (1.2 * rarityFactor); else if (card.rarity === 'rare') weight *= (0.4 * rarityFactor); /* Lowered Rare chance */ else weight *= rarityFactor; weight = Math.max(0.1, weight); totalWeight += weight; combinedWeightedPool.push({ card, weight }); }); }); if (combinedWeightedPool.length === 0) return null; let randomPick = Math.random() * totalWeight; let chosenItem = null; for (let i = 0; i < combinedWeightedPool.length; i++) { chosenItem = combinedWeightedPool[i]; if (randomPick < chosenItem.weight) { [priorityPool, secondaryPool, tertiaryPool].forEach(p => { const index = p.findIndex(c => c.id === chosenItem.card.id); if (index > -1) p.splice(index, 1); }); return chosenItem.card; } randomPick -= chosenItem.weight; } const flatPool = [...priorityPool, ...secondaryPool, ...tertiaryPool]; if (flatPool.length > 0) { const fallbackIndex = Math.floor(Math.random() * flatPool.length); const chosenCard = flatPool[fallbackIndex]; [priorityPool, secondaryPool, tertiaryPool].forEach(p => { const index = p.findIndex(c => c.id === chosenCard.id); if (index > -1) p.splice(index, 1); }); return chosenCard; } return null;
    };
    let attempts = 0; const maxAttempts = numberOfResults * 3; while (selectedForOutput.length < numberOfResults && attempts < maxAttempts && (priorityPool.length > 0 || secondaryPool.length > 0 || tertiaryPool.length > 0)) { attempts++; let potentialCard = selectWeightedRandomFromPools(); if (potentialCard) { if (discoveredConcepts.has(potentialCard.id)) { gainInsight(1.0, `Duplicate Research (${potentialCard.name})`); duplicateInsightGain += 1.0; } else { selectedForOutput.push(potentialCard); } } else { break; } }
    let resultMessage = ""; if (selectedForOutput.length > 0) { resultMessage = `Discovered ${selectedForOutput.length} new potential concept(s)! `; selectedForOutput.forEach(concept => { const resultItemDiv = document.createElement('div'); resultItemDiv.classList.add('research-result-item'); const cardElement = renderCard(concept, 'research-output'); resultItemDiv.appendChild(cardElement); const addButton = document.createElement('button'); addButton.textContent = "Add to Grimoire"; addButton.classList.add('button', 'small-button', 'research-action-button'); addButton.dataset.conceptId = concept.id; addButton.onclick = (e) => { const btn = e.target; const id = parseInt(btn.dataset.conceptId); if (!isNaN(id)) { addConceptToGrimoireById(id, btn); } }; resultItemDiv.appendChild(addButton); if (researchOutput) researchOutput.appendChild(resultItemDiv); }); gainAttunementForAction('researchSuccess', elementKeyToResearch, 0.8); if (selectedForOutput.some(c => c.rarity === 'rare')) { updateMilestoneProgress('discoverRareCard', 1); } } else { resultMessage = "No new concepts discovered this time. "; if (researchOutput) researchOutput.innerHTML = '<p><i>Familiar thoughts echo... Perhaps try a different focus or deepen existing knowledge?</i></p>'; gainAttunementForAction('researchFail', elementKeyToResearch, 0.2); } if (duplicateInsightGain > 0) { resultMessage += ` Gained ${duplicateInsightGain.toFixed(0)} Insight from echoes.`; if (researchOutput && selectedForOutput.length > 0) { const dupeMsg = document.createElement('p'); dupeMsg.classList.add('duplicate-message'); dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate research echoes.`; researchOutput.prepend(dupeMsg); } } if (researchStatus) researchStatus.textContent = resultMessage.trim();
}

// --- Grimoire Functions ---
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") { if (!checkDataLoaded() || !grimoireContentDiv) return; grimoireContentDiv.innerHTML = ''; if (discoveredConcepts.size === 0) { grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty. Conduct Research to discover Concepts!</p>'; return; } let discoveredArray = Array.from(discoveredConcepts.values()); const conceptsToDisplay = discoveredArray.filter(data => { if (!data || !data.concept) return false; const concept = data.concept; const typeMatch = (filterType === "All") || (concept.cardType === filterType); const elementKey = filterElement !== "All" ? elementNameToKey[filterElement] : "All"; const elementMatch = (elementKey === "All") || (concept.primaryElement === elementKey); const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity); return typeMatch && elementMatch && rarityMatch; }); const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 }; conceptsToDisplay.sort((a, b) => { if (!a.concept || !b.concept) return 0; switch (sortBy) { case 'name': return a.concept.name.localeCompare(b.concept.name); case 'type': return a.concept.cardType.localeCompare(b.concept.cardType) || a.concept.name.localeCompare(b.concept.name); case 'rarity': return (rarityOrder[a.concept.rarity] || 0) - (rarityOrder[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name); default: return a.discoveredTime - b.discoveredTime; } }); if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters.</p>`; } else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); grimoireContentDiv.appendChild(cardElement); }); } }
function populateGrimoireFilters() { if (!checkDataLoaded()) return; if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); } if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = fullName; option.textContent = name; grimoireElementFilter.appendChild(option); }); } }
function updateGrimoireCounter() { if (grimoireCountSpan) grimoireCountSpan.textContent = discoveredConcepts.size; }

// --- Card Rendering Function ---
function renderCard(concept, context = 'grimoire') {
    if (!checkDataLoaded()) return document.createElement('div');
    if (!concept || !concept.id) { return document.createElement('div'); } if (typeof elementKeyToFullName === 'undefined') { return document.createElement('div');} const cardDiv = document.createElement('div'); cardDiv.classList.add('concept-card'); cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`); cardDiv.dataset.conceptId = concept.id; cardDiv.title = `View ${concept.name}`; const discoveredData = discoveredConcepts.get(concept.id); const isDiscovered = !!discoveredData; const isFocused = focusedConcepts.has(concept.id); const artUnlocked = discoveredData?.artUnlocked || false; const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : ''; const focusStampHTML = isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : ''; const cardTypeIcon = getCardTypeIcon(concept.cardType); let affinitiesHTML = ''; if (concept.elementScores && typeof elementKeyToFullName !== 'undefined') { Object.entries(concept.elementScores).forEach(([key, score]) => { const level = getAffinityLevel(score); if (level && elementKeyToFullName[key]) { const fullName = elementKeyToFullName[key]; const color = getElementColor(fullName); const levelClass = level === "High" ? "affinity-high" : ""; const iconClass = getElementIcon(fullName); affinitiesHTML += `<span class="affinity ${levelClass}" style="border-color: ${color}; color: ${color}; background-color: ${hexToRgba(color, 0.1)};" title="${elementDetails[fullName]?.name || fullName} Affinity: ${level} (${score.toFixed(1)})"><i class="${iconClass}"></i> ${level.substring(0,1)}</span> `; } }); } const currentVisualHandle = artUnlocked ? (concept.visualHandleUnlocked || concept.visualHandle) : concept.visualHandle; const visualContent = artUnlocked && concept.visualHandleUnlocked ? `<img src="placeholder_art/${concept.visualHandleUnlocked}.png" alt="${concept.name} Art" class="card-art-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';"> <i class="fas fa-image card-visual-placeholder" style="display: none;" title="Art Placeholder"></i>` : `<i class="fas fa-${artUnlocked ? 'star' : 'question'} card-visual-placeholder ${artUnlocked ? 'card-art-unlocked' : ''}" title="${currentVisualHandle || 'Visual Placeholder'}"></i>`; cardDiv.innerHTML = ` <div class="card-header"> <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i> <span class="card-name">${concept.name}</span> <span class="card-stamps">${focusStampHTML}${grimoireStampHTML}</span> </div> <div class="card-visual"> ${visualContent} </div> <div class="card-footer"> <div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div> <p class="card-brief-desc">${concept.briefDescription || '...'}</p> </div>`; if (context !== 'no-click') { cardDiv.addEventListener('click', () => showConceptDetailPopup(concept.id)); } if (context === 'research-output') { cardDiv.title = `Click to view details for ${concept.name} (Not yet in Grimoire)`; } return cardDiv;
}

// --- Concept Detail Pop-up Logic ---
function showConceptDetailPopup(conceptId) {
    if (!checkDataLoaded()) return;
    const conceptData = concepts.find(c => c.id === conceptId); const discoveredData = discoveredConcepts.get(conceptId); if (!conceptData) { return; } currentlyDisplayedConceptId = conceptId; if (popupConceptName) popupConceptName.textContent = conceptData.name; if (popupConceptType) popupConceptType.textContent = conceptData.cardType; if (popupCardTypeIcon) popupCardTypeIcon.className = `${getCardTypeIcon(conceptData.cardType)} card-type-icon`; if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No description."; const artUnlocked = discoveredData?.artUnlocked || false; const currentVisualHandle = artUnlocked ? (conceptData.visualHandleUnlocked || concept.visualHandle) : conceptData.visualHandle; if (popupVisualContainer) { popupVisualContainer.innerHTML = ''; if (artUnlocked && conceptData.visualHandleUnlocked) { const img = document.createElement('img'); img.src = `placeholder_art/${conceptData.visualHandleUnlocked}.png`; img.alt = `${conceptData.name} Art`; img.classList.add('card-art-image'); img.onerror = function() { this.style.display='none'; const icon = document.createElement('i'); icon.className = `fas fa-image card-visual-placeholder`; icon.title = "Art Placeholder (Load Failed)"; popupVisualContainer.appendChild(icon); }; popupVisualContainer.appendChild(img); } else { const icon = document.createElement('i'); icon.className = `fas fa-${artUnlocked ? 'star card-art-unlocked' : 'question'} card-visual-placeholder`; icon.title = currentVisualHandle || "Visual Placeholder"; if (artUnlocked) icon.classList.add('card-art-unlocked'); popupVisualContainer.appendChild(icon); } } const distance = euclideanDistance(userScores, conceptData.elementScores); displayPopupResonance(distance); displayPopupRecipeComparison(conceptData); displayPopupRelatedConcepts(conceptData); if (myNotesSection && myNotesTextarea && saveMyNoteButton) { if (discoveredData) { myNotesTextarea.value = discoveredData.notes || ""; myNotesSection.classList.remove('hidden'); noteSaveStatusSpan.textContent = ""; saveMyNoteButton.onclick = () => saveMyNote(conceptId); } else { myNotesSection.classList.add('hidden'); } } displayEvolutionSection(conceptData, discoveredData); updateGrimoireButtonStatus(conceptId); updateFocusButtonStatus(conceptId); if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}
function displayPopupResonance(distance) { if (!popupResonanceSummary) return; let resonanceLabel = "Low"; let resonanceClass = "resonance-low"; let message = ""; if (distance === Infinity || isNaN(distance)) { resonanceLabel = "N/A"; resonanceClass = ""; message = "(Cannot compare profiles)"; } else if (distance < 2.5) { resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strongly aligns with your core profile."; } else if (distance < 4.0) { resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares significant common ground."; } else if (distance < 6.0) { resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities and differences noted."; } else if (distance <= DISSONANCE_THRESHOLD) { resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence from your profile."; } else { resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significantly diverges. Reflection suggested if added."; } popupResonanceSummary.innerHTML = `Resonance with You: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> (Dist: ${distance.toFixed(1)})<br><small>${message}</small>`; }
function displayPopupRecipeComparison(conceptData) {
    if (!checkDataLoaded()) return;
    if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return; if (typeof elementKeyToFullName === 'undefined') return; popupConceptProfile.innerHTML = ''; popupUserComparisonProfile.innerHTML = ''; popupComparisonHighlights.innerHTML = ''; let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>'; let hasHighlights = false; const conceptScores = conceptData.elementScores || {}; const userCompScores = userScores || {}; elementNames.forEach(elName => { const key = elementNameToKey[elName]; const fullName = elementKeyToFullName[key]; if (!fullName) return; const conceptScore = conceptScores[key]; const userScore = userCompScores[key]; const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore); const userScoreValid = typeof userScore === 'number' && !isNaN(userScore); const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?'; const userDisplay = userScoreValid ? userScore.toFixed(1) : '?'; const conceptLabel = conceptScoreValid ? getScoreLabel(conceptScore) : 'N/A'; const userLabel = userScoreValid ? getScoreLabel(userScore) : 'N/A'; const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0; const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0; const color = getElementColor(fullName); const elementNameShort = elementDetails[fullName]?.name.substring(0, 11) || elName; popupConceptProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${conceptDisplay}</span> <div class="score-bar-container" title="${conceptLabel}"><div style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`; popupUserComparisonProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${userDisplay}</span> <div class="score-bar-container" title="${userLabel}"><div style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`; if (conceptScoreValid && userScoreValid) { const diff = Math.abs(conceptScore - userScore); const elementNameDisplay = elementDetails[fullName]?.name || elName; if (conceptScore >= 7 && userScore >= 7) { highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel} / ${userLabel})</p>`; hasHighlights = true; } else if (conceptScore <= 3 && userScore <= 3) { highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel} / ${userLabel})</p>`; hasHighlights = true; } else if (diff >= 4) { highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept is ${conceptLabel}, You are ${userLabel})</p>`; hasHighlights = true; } } }); if (!hasHighlights) highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>'; popupComparisonHighlights.innerHTML = highlightsHTML;
}
function displayPopupRelatedConcepts(conceptData) {
    if (!checkDataLoaded()) return;
    if (!popupRelatedConceptsList) return; popupRelatedConceptsList.innerHTML = ''; if (conceptData.relatedIds && conceptData.relatedIds.length > 0) { conceptData.relatedIds.forEach(relatedId => { const relatedConcept = concepts.find(c => c.id === relatedId); if (relatedConcept) { const li = document.createElement('li'); li.textContent = relatedConcept.name; li.dataset.conceptId = relatedId; li.title = `View ${relatedConcept.name}`; li.addEventListener('click', handleRelatedConceptClick); popupRelatedConceptsList.appendChild(li); } }); } else { popupRelatedConceptsList.innerHTML = '<li>None specified</li>'; }
}
function handleRelatedConceptClick(event) { const conceptId = event.target.dataset.conceptId; if (!conceptId) return; const numericId = parseInt(conceptId); if (!isNaN(numericId)) { showConceptDetailPopup(numericId); } }
function displayEvolutionSection(conceptData, discoveredData) {
    if (!checkDataLoaded()) return;
    if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return; if (typeof elementKeyToFullName === 'undefined') return; const isDiscovered = !!discoveredData; const canUnlock = conceptData.canUnlockArt; const alreadyUnlocked = discoveredData?.artUnlocked || false; const isFocused = focusedConcepts.has(conceptData.id); const requiredElement = conceptData.primaryElement; const fullName = elementKeyToFullName[requiredElement]; if (!fullName) { popupEvolutionSection.classList.add('hidden'); return; } const cost = ART_EVOLVE_COST; const hasEnoughInsight = userInsight >= cost; const hasReflected = seenPrompts.size > 0; evolveCostSpan.textContent = `${cost} Insight`; if (isDiscovered && canUnlock && !alreadyUnlocked) { popupEvolutionSection.classList.remove('hidden'); let eligibilityText = ''; let canEvolve = true; if (!isFocused) { eligibilityText += '<li>Requires: Mark as Focus Concept</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Focused Concept</li>'; } if (!hasReflected) { eligibilityText += '<li>Requires: Engage in Reflection (any)</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Reflection Engaged</li>'; } if (!hasEnoughInsight) { eligibilityText += `<li>Requires: ${cost} Insight (Have ${userInsight.toFixed(1)})</li>`; canEvolve = false;} else { eligibilityText += `<li><i class="fas fa-check"></i> Sufficient Insight</li>`; } evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`; evolveEligibility.classList.remove('hidden'); evolveArtButton.disabled = !canEvolve; evolveArtButton.onclick = canEvolve ? () => attemptArtEvolution(conceptData.id, cost) : null; } else { popupEvolutionSection.classList.add('hidden'); evolveArtButton.disabled = true; evolveEligibility.classList.add('hidden'); evolveArtButton.onclick = null; }
}
function attemptArtEvolution(conceptId, cost) {
    if (!checkDataLoaded()) return;
    const discoveredData = discoveredConcepts.get(conceptId); if (!discoveredData || !discoveredData.concept || discoveredData.artUnlocked) { showTemporaryMessage("Evolution failed: Concept state error.", 3000); return; } const concept = discoveredData.concept; if (!concept.canUnlockArt) { return; } const isFocused = focusedConcepts.has(conceptId); const hasReflected = seenPrompts.size > 0; if (isFocused && hasReflected && spendInsight(cost, `Evolve Art: ${concept.name}`)) { discoveredData.artUnlocked = true; discoveredConcepts.set(conceptId, discoveredData); console.log(`Art unlocked for ${concept.name}!`); showTemporaryMessage(`Enhanced Art Unlocked for ${concept.name}!`, 3500); if (currentlyDisplayedConceptId === conceptId) { displayEvolutionSection(concept, discoveredData); if (popupVisualContainer) { popupVisualContainer.innerHTML = ''; if (discoveredData.artUnlocked && concept.visualHandleUnlocked) { const img = document.createElement('img'); img.src = `placeholder_art/${concept.visualHandleUnlocked}.png`; img.alt = `${concept.name} Art`; img.classList.add('card-art-image'); img.onerror = function() { this.style.display='none'; const icon = document.createElement('i'); icon.className = `fas fa-image card-visual-placeholder`; icon.title = "Art Placeholder (Load Failed)"; popupVisualContainer.appendChild(icon); }; popupVisualContainer.appendChild(img); } else { const icon = document.createElement('i'); icon.className = `fas fa-star card-visual-placeholder card-art-unlocked`; icon.title = concept.visualHandleUnlocked || concept.visualHandle || "Unlocked Visual"; popupVisualContainer.appendChild(icon); } } } if (grimoireScreen.classList.contains('current')) { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); } gainAttunementForAction('artEvolve', concept.primaryElement, 1.5); updateMilestoneProgress('evolveArt', 1); checkAndUpdateRituals('evolveArt'); saveGameState(); } else if (!isFocused || !hasReflected) { showTemporaryMessage("Cannot unlock art yet. Check requirements.", 3000); }
}

// --- Grimoire/Focus Button & State Logic ---
function addConceptToGrimoireById(conceptId, buttonElement) {
    if (!checkDataLoaded()) return;
    if (discoveredConcepts.has(conceptId)) { showTemporaryMessage("Already in Grimoire.", 2500); if(buttonElement) { buttonElement.textContent = "In Grimoire"; buttonElement.disabled = true; } return; } const concept = concepts.find(c => c.id === conceptId); if (!concept) { return; } const distance = euclideanDistance(userScores, concept.elementScores); if (distance > DISSONANCE_THRESHOLD) { console.log(`Dissonance detected for ${concept.name}. Triggering reflection.`); reflectionTargetConceptId = conceptId; displayReflectionPrompt('Dissonance', concept.id); } else { addConceptToGrimoireInternal(conceptId); if(buttonElement) { buttonElement.textContent = "In Grimoire"; buttonElement.disabled = true; } }
}
function addToGrimoire() { if (currentlyDisplayedConceptId === null) return; addConceptToGrimoireById(currentlyDisplayedConceptId, addToGrimoireButton); }
function addConceptToGrimoireInternal(conceptId) {
    if (!checkDataLoaded()) return;
    const concept = concepts.find(c => c.id === conceptId); if (!concept) { return; } if (discoveredConcepts.has(conceptId)) { return; } console.log(`Adding ${concept.name} to Grimoire (Internal).`);
    // Determine Insight reward based on rarity
    let insightReward = 2.0; // Common
    if (concept.rarity === 'uncommon') insightReward = 4.0;
    else if (concept.rarity === 'rare') insightReward = 8.0;

    discoveredConcepts.set(conceptId, { concept: concept, discoveredTime: Date.now(), artUnlocked: false, notes: "" });
    gainInsight(insightReward, `Discovered ${concept.rarity} ${concept.name}`);
    gainAttunementForAction('addToGrimoire', concept.primaryElement, 0.6);
    updateGrimoireCounter();

    // Queue unique prompt if it's a rare card with one defined
    if (concept.rarity === 'rare' && concept.uniquePromptId && reflectionPrompts.RareConcept[concept.uniquePromptId]) {
        if (!pendingRarePrompts.includes(concept.uniquePromptId)) {
            pendingRarePrompts.push(concept.uniquePromptId);
            console.log(`Queued unique reflection prompt ${concept.uniquePromptId} for ${concept.name}`);
            // Maybe a subtle UI indicator that a special reflection is waiting?
        }
    }

    if (currentlyDisplayedConceptId === conceptId) { updateGrimoireButtonStatus(concept.id); updateFocusButtonStatus(concept.id); if(myNotesSection) myNotesSection.classList.remove('hidden'); } checkTriggerReflectionPrompt('add'); updateMilestoneProgress('addToGrimoire', 1); updateMilestoneProgress('discoveredConcepts.size', discoveredConcepts.size); checkAndUpdateRituals('addToGrimoire'); if (grimoireScreen.classList.contains('current')) { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); } if (currentReflectionContext === 'Dissonance' && researchOutput && !researchOutput.classList.contains('hidden')) { const researchButton = researchOutput.querySelector(`.research-action-button[data-concept-id="${conceptId}"]`); if (researchButton) { researchButton.textContent = "In Grimoire"; researchButton.disabled = true; } } showTemporaryMessage(`${concept.name} added to Grimoire!`, 3000); saveGameState();
}
function toggleFocusConcept() {
    if (!checkDataLoaded()) return;
    if (currentlyDisplayedConceptId === null) return; const discoveredData = discoveredConcepts.get(currentlyDisplayedConceptId); if (!discoveredData || !discoveredData.concept) { showTemporaryMessage("Cannot focus undiscovered concept.", 3000); return; } const concept = discoveredData.concept; if (focusedConcepts.has(concept.id)) { focusedConcepts.delete(concept.id); console.log(`Removed ${concept.name} from Focus.`); showTemporaryMessage(`${concept.name} removed from Focus.`, 2500); checkAndUpdateRituals('removeFocus'); } else { if (focusedConcepts.size >= focusSlotsTotal) { showTemporaryMessage(`Focus slots full (${focusedConcepts.size}/${focusSlotsTotal}).`, 3000); return; } focusedConcepts.add(concept.id); console.log(`Marked ${concept.name} as Focus.`); showTemporaryMessage(`${concept.name} marked as Focus!`, 2500); gainInsight(1.0, `Focused on ${concept.name}`); gainAttunementForAction('markFocus', concept.primaryElement, 1.0); updateMilestoneProgress('markFocus', 1); updateMilestoneProgress('focusedConcepts.size', focusedConcepts.size); checkAndUpdateRituals('markFocus'); } updateFocusButtonStatus(concept.id); displayFocusedConceptsPersona(); updateFocusElementalResonance(); generateTapestryNarrative(); synthesizeAndDisplayThemesPersona(); if (grimoireScreen.classList.contains('current')) { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); } saveGameState();
}
function updateGrimoireButtonStatus(conceptId) { if (!addToGrimoireButton) return; const isDiscovered = discoveredConcepts.has(conceptId); addToGrimoireButton.disabled = isDiscovered; addToGrimoireButton.textContent = isDiscovered ? "In Grimoire" : "Add to Grimoire"; addToGrimoireButton.classList.toggle('added', isDiscovered); }
function updateFocusButtonStatus(conceptId) { if (!markAsFocusButton) return; const isDiscovered = discoveredConcepts.has(conceptId); const isFocused = focusedConcepts.has(conceptId); markAsFocusButton.classList.toggle('hidden', !isDiscovered); if (isDiscovered) { markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus"; markAsFocusButton.disabled = !isDiscovered || (focusedConcepts.size >= focusSlotsTotal && !isFocused); markAsFocusButton.classList.toggle('marked', isFocused); if(markAsFocusButton.disabled && !isFocused && isDiscovered) { markAsFocusButton.title = `Focus slots full (${focusSlotsTotal})`; } else if (isDiscovered) { markAsFocusButton.title = isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts"; } else { markAsFocusButton.title = ""; } } }

// --- My Notes ---
function saveMyNote(conceptId) {
    if (!myNotesTextarea || !noteSaveStatusSpan) return; const noteText = myNotesTextarea.value.trim(); const discoveredData = discoveredConcepts.get(conceptId);
    if (discoveredData) { discoveredData.notes = noteText; discoveredConcepts.set(conceptId, discoveredData); saveGameState(); noteSaveStatusSpan.textContent = "Note Saved!"; noteSaveStatusSpan.classList.remove('error'); setTimeout(() => { noteSaveStatusSpan.textContent = ""; }, 2000); }
    else { noteSaveStatusSpan.textContent = "Error: Concept not found."; noteSaveStatusSpan.classList.add('error'); }
}

// --- Reflection Prompts ---
function checkTriggerReflectionPrompt(triggerAction = 'other') { if (promptCooldownActive) return; if (triggerAction === 'add') cardsAddedSinceLastPrompt++; if (triggerAction === 'completeQuestionnaire') cardsAddedSinceLastPrompt = 99; const triggerThreshold = 3; if (cardsAddedSinceLastPrompt >= triggerThreshold && pendingRarePrompts.length === 0) { /* Only trigger standard if no rare prompt waiting */ displayReflectionPrompt('Standard'); cardsAddedSinceLastPrompt = 0; promptCooldownActive = true; setTimeout(() => { promptCooldownActive = false; console.log("Reflection cooldown ended."); }, 1000 * 60 * 5); } else if (pendingRarePrompts.length > 0) { /* Trigger queued rare prompt instead */ displayReflectionPrompt('RareConcept'); cardsAddedSinceLastPrompt = 0; } } // Modified logic
function displayReflectionPrompt(context = 'Standard', targetId = null, promptCategory = null) { // Modified for RareConcept queue
    if (!checkDataLoaded()) return;
    currentReflectionContext = context; reflectionTargetConceptId = (context === 'Dissonance') ? targetId : null; let promptPool = []; let titleElement = "Reflection Topic"; let selectedPrompt = null; const nudgeElements = [scoreNudgeCheckbox, scoreNudgeLabel];

    // Check Rare Prompt Queue FIRST (unless it's specifically a Dissonance prompt)
    if (context !== 'Dissonance' && pendingRarePrompts.length > 0) {
        const rarePromptId = pendingRarePrompts.shift(); // Get and remove first queued prompt
        saveGameState(); // Save updated queue
        selectedPrompt = reflectionPrompts.RareConcept[rarePromptId];
        if (selectedPrompt) {
            context = 'RareConcept'; // Update context
            titleElement = "Rare Concept Reflection";
            // Find concept associated with this prompt for display name? Hard without mapping prompt IDs back.
            const conceptEntry = Array.from(discoveredConcepts.entries()).find(([id, data]) => data.concept.uniquePromptId === rarePromptId);
            currentReflectionCategory = conceptEntry ? conceptEntry[1].concept.name : "Rare Concept"; // Use concept name if found
            nudgeElements.forEach(el => el?.classList.add('hidden'));
            console.log(`Displaying queued Rare Concept reflection: ${rarePromptId}`);
        } else {
            console.warn(`Could not find prompt text for queued rare prompt ID: ${rarePromptId}`);
             // Fall through to standard/guided logic if queued prompt failed
             context = 'Standard'; // Revert context if prompt not found
        }
    }

    // If no rare prompt was displayed, proceed with other contexts
    if (!selectedPrompt) {
        if(context === 'Guided') { /* ... (Guided logic - unchanged) ... */ }
        else if (context === 'Dissonance') { /* ... (Dissonance logic - unchanged) ... */ }
        else { /* ... (Standard logic - unchanged) ... */ }
        // Select standard/dissonance prompt if applicable and none selected yet
        if (!selectedPrompt && promptPool.length > 0) { const availablePrompts = promptPool.filter(p => !seenPrompts.has(p.id)); selectedPrompt = availablePrompts.length > 0 ? availablePrompts[Math.floor(Math.random() * availablePrompts.length)] : promptPool[Math.floor(Math.random() * promptPool.length)]; }
    }

    if (!selectedPrompt) { console.error(`Could not select prompt for context: ${context}`); return; }
    currentPromptId = selectedPrompt.id; if(reflectionModalTitle) reflectionModalTitle.textContent = titleElement; if (reflectionElement) reflectionElement.textContent = (context === 'Dissonance' || context === 'Guided' || context === 'RareConcept') ? currentReflectionCategory || titleElement : currentReflectionElement; if (reflectionPromptText) reflectionPromptText.textContent = selectedPrompt.text; if (reflectionCheckbox) reflectionCheckbox.checked = false; if (scoreNudgeCheckbox) scoreNudgeCheckbox.checked = false; if (confirmReflectionButton) confirmReflectionButton.disabled = true; const rewardAmount = (context === 'Guided') ? GUIDED_REFLECTION_COST + 2 : (context === 'RareConcept') ? 7.0 : 5.0; /* Higher reward for rare */ if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${rewardAmount} Insight`; if (reflectionModal) reflectionModal.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}
function handleConfirmReflection() {
    if (!checkDataLoaded()) return;
    if (!currentPromptId || !reflectionCheckbox || !reflectionCheckbox.checked) return; console.log(`Reflection confirmed: ${currentReflectionContext}, prompt: ${currentPromptId}`); seenPrompts.add(currentPromptId); const insightReward = (currentReflectionContext === 'Guided') ? GUIDED_REFLECTION_COST + 2 : (currentReflectionContext === 'RareConcept') ? 7.0 : 5.0; let attunementKey = null; let attunementAmount = 1.0; let milestoneAction = 'completeReflection'; let scoreNudged = false; if (currentReflectionContext === 'Dissonance' && scoreNudgeCheckbox && scoreNudgeCheckbox.checked) { console.log("Score nudge requested."); const concept = concepts.find(c => c.id === reflectionTargetConceptId); if (concept?.elementScores) { for (const key in userScores) { if (userScores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) { const userScore = userScores[key]; const conceptScore = concept.elementScores[key]; const diff = conceptScore - userScore; if (Math.abs(diff) > 2.0) { const nudge = Math.sign(diff) * SCORE_NUDGE_AMOUNT; userScores[key] = Math.max(0, Math.min(10, userScore + nudge)); scoreNudged = true; } } } if (scoreNudged) { console.log("Updated User Scores:", userScores); displayPersonaScreen(); showTemporaryMessage("Core understanding shifted slightly.", 3500); gainAttunementForAction('scoreNudge', 'All', 0.5); updateMilestoneProgress('scoreNudgeApplied', 1); } } } if (currentReflectionContext === 'Dissonance' && reflectionTargetConceptId !== null) { addConceptToGrimoireInternal(reflectionTargetConceptId); milestoneAction = 'completeReflectionDissonance'; attunementAmount = 0.5; } gainInsight(insightReward, `Reflection (${currentReflectionContext})`); if (currentReflectionContext === 'Standard' && currentReflectionElement) { attunementKey = elementNameToKey[currentReflectionElement]; } else if (['Guided', 'RareConcept', 'SceneMeditation'].includes(currentReflectionContext) && currentReflectionCategory) { // Use category if guided/rare/scene
         // Attempt to find the element key if category is an element name, otherwise null
         attunementKey = elementNameToKey[currentReflectionCategory] || null;
         if (!attunementKey) { // If category wasn't an element (e.g., 'LowAttunement'), check if target concept ID exists
              if(reflectionTargetConceptId) {
                   const concept = discoveredConcepts.get(reflectionTargetConceptId)?.concept;
                   attunementKey = concept?.primaryElement || null;
              }
         }
    } else { attunementKey = null; } if (attunementKey) { gainAttunementForAction('completeReflection', attunementKey, attunementAmount); } else { gainAttunementForAction('completeReflectionGeneric', 'All', 0.2); } updateMilestoneProgress(milestoneAction, 1); checkAndUpdateRituals('completeReflection'); hidePopups(); showTemporaryMessage("Reflection complete! Insight gained.", 3000); currentReflectionContext = null; reflectionTargetConceptId = null; currentReflectionCategory = null; saveGameState();
}
function triggerGuidedReflection() {
    if (!checkDataLoaded()) return;
    if (spendInsight(GUIDED_REFLECTION_COST, "Guided Reflection")) { const availableCategories = Object.keys(reflectionPrompts.Guided || {}); if (availableCategories.length > 0) { const category = availableCategories[Math.floor(Math.random() * availableCategories.length)]; console.log(`Triggering guided reflection for category: ${category}`); displayReflectionPrompt('Guided', null, category); } else { console.warn("No guided reflection categories defined."); gainInsight(GUIDED_REFLECTION_COST, "Refund: No guided reflections"); } }
}

// --- Rituals & Milestones ---
function displayDailyRituals() {
    if (!checkDataLoaded() || !dailyRitualsDisplay) return;
    dailyRitualsDisplay.innerHTML = ''; let activeRituals = [...dailyRituals]; // Start with base daily rituals

    // Add applicable Focus Rituals
    if (typeof focusRituals !== 'undefined') {
        focusRituals.forEach(ritual => {
            const requiredIds = new Set(ritual.requiredFocusIds);
            let allFocused = true;
            if (requiredIds.size === 0) allFocused = false; // Need at least one requirement
            for (const id of requiredIds) {
                if (!focusedConcepts.has(id)) {
                    allFocused = false;
                    break;
                }
            }
            if (allFocused) {
                // Add focus ritual to the list to be displayed IF active
                activeRituals.push({ ...ritual, isFocusRitual: true }); // Mark it
            }
        });
    }

    if (activeRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No daily rituals available.</li>'; return; }

    activeRituals.forEach(ritual => {
        const completedData = completedRituals.daily[ritual.id] || {completed: false, progress: 0};
        const isCompleted = completedData.completed;
        const li = document.createElement('li'); li.classList.toggle('completed', isCompleted);
        let rewardText = '';
        if (ritual.reward) { if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`; else if (ritual.reward.type === 'attunement') rewardText = `(+${ritual.reward.amount} Attun.)`; else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`; }
        li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`;
        if(ritual.isFocusRitual) li.classList.add('focus-ritual'); // Style differently
        dailyRitualsDisplay.appendChild(li);
    });
}
function checkAndUpdateRituals(action, details = {}) {
    if (!checkDataLoaded()) return;
    let ritualUpdated = false;
    let currentRitualPool = [...dailyRituals]; // Check base daily

    // Add active focus rituals to the pool being checked
    if (typeof focusRituals !== 'undefined') {
        focusRituals.forEach(ritual => {
             const requiredIds = new Set(ritual.requiredFocusIds); let allFocused = true; if (requiredIds.size === 0) allFocused = false;
             for (const id of requiredIds) { if (!focusedConcepts.has(id)) { allFocused = false; break; } }
             if (allFocused) { currentRitualPool.push(ritual); }
        });
    }

    currentRitualPool.forEach(ritual => {
        let completedData = completedRituals.daily[ritual.id] || {completed: false, progress: 0};
        // Check if the action matches OR if the ritual tracks specific reflection contexts
        const actionMatch = ritual.track.action === action;
        const contextMatch = ritual.track.contextMatch && currentReflectionContext === ritual.track.contextMatch; // Check context if defined

        if (!completedData.completed && (actionMatch || contextMatch)) {
            completedData.progress++;
            if (completedData.progress >= ritual.track.count) { console.log(`Ritual Completed: ${ritual.description}`); completedData.completed = true; ritualUpdated = true; if (ritual.reward) { if (ritual.reward.type === 'insight') { gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`); } else if (ritual.reward.type === 'attunement') { gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0); } else if (ritual.reward.type === 'token') { console.log(`TODO: Grant ${ritual.reward.tokenType || 'Research'} token`); } } }
            completedRituals.daily[ritual.id] = completedData;
        }
    });
    if (ritualUpdated) { displayDailyRituals(); saveGameState(); }
}
function displayMilestones() {
    if (!checkDataLoaded() || !milestonesDisplay) return;
    milestonesDisplay.innerHTML = ''; if (achievedMilestones.size === 0) { milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>'; return; } const sortedMilestoneIds = Array.from(achievedMilestones).sort((a, b) => { const ma = milestones.find(m => m.id === a); const mb = milestones.find(m => m.id === b); return (ma?.id || '').localeCompare(mb?.id || ''); }); sortedMilestoneIds.forEach(milestoneId => { const milestone = milestones.find(m => m.id === milestoneId); if (milestone) { const li = document.createElement('li'); li.textContent = `✓ ${milestone.description}`; milestonesDisplay.appendChild(li); } });
}
function updateMilestoneProgress(trackType, currentValue) {
    if (!checkDataLoaded()) return;
    let milestoneAchieved = false; milestones.forEach(m => { if (!achievedMilestones.has(m.id)) { let achieved = false; if (m.track.action === trackType) { if (typeof currentValue === 'number' && currentValue >= (m.track.count || 1)) { achieved = true; } else if (m.track.count === 1 && currentValue) { achieved = true; } } else if (m.track.state === trackType) { const threshold = m.track.threshold; let targetObject = null; if (trackType === 'elementAttunement') targetObject = elementAttunement; else if (trackType === 'unlockedDeepDiveLevels') targetObject = unlockedDeepDiveLevels; else if (trackType === 'repositoryInsightsCount') targetObject = discoveredRepositoryItems.insights; /* Handle simple count */ else targetObject = null; if (trackType === 'repositoryInsightsCount') { if (currentValue >= threshold) achieved = true; } else if (m.track.condition === "any") { if (typeof currentValue === 'object' && currentValue !== null && targetObject) { for (const key in currentValue) { if (targetObject.hasOwnProperty(key) && currentValue[key] >= threshold) { achieved = true; break; } } } } else if (m.track.condition === "all") { if (typeof currentValue === 'object' && currentValue !== null && targetObject) { let allMet = true; for (const key in targetObject) { if (!(currentValue.hasOwnProperty(key) && currentValue[key] >= threshold)) { allMet = false; break; } } if (allMet) achieved = true; } } else { if (typeof currentValue === 'number' && currentValue >= threshold) { achieved = true; } } } if (achieved) { console.log("Milestone Achieved!", m.description); achievedMilestones.add(m.id); milestoneAchieved = true; displayMilestones(); showMilestoneAlert(m.description); if (m.reward) { if (m.reward.type === 'insight') { gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`); } else if (m.reward.type === 'attunement') { gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0); } else if (m.reward.type === 'increaseFocusSlots') { const increaseAmount = m.reward.amount || 1; if (focusSlotsTotal < MAX_FOCUS_SLOTS) { focusSlotsTotal = Math.min(MAX_FOCUS_SLOTS, focusSlotsTotal + increaseAmount); console.log(`Focus Slots increased by ${increaseAmount}. New: ${focusSlotsTotal}`); updateFocusSlotsDisplay(); } } else if (m.reward.type === 'discoverCard') { const cardIdToDiscover = m.reward.cardId; if (cardIdToDiscover && !discoveredConcepts.has(cardIdToDiscover)) { const conceptToDiscover = concepts.find(c => c.id === cardIdToDiscover); if (conceptToDiscover) { addConceptToGrimoireInternal(cardIdToDiscover); showTemporaryMessage(`Milestone Reward: Discovered ${conceptToDiscover.name}!`, 3500); } } } } } } }); if (['focusedConcepts.size', 'increaseFocusSlots', 'unlockedDeepDiveLevels'].includes(trackType)) { updateMilestoneProgress('focusSlotsTotal', focusSlotsTotal); } if (milestoneAchieved) { saveGameState(); }
}
function showMilestoneAlert(text) { if (!milestoneAlert || !milestoneAlertText) return; milestoneAlertText.textContent = `Milestone: ${text}`; milestoneAlert.classList.remove('hidden'); setTimeout(hideMilestoneAlert, 5000); }
function hideMilestoneAlert() { if (milestoneAlert) milestoneAlert.classList.add('hidden'); }

// --- Element Deep Dive Library ---
function displayElementLibrary() { if (!checkDataLoaded() || !elementLibraryButtonsDiv || !elementLibraryContentDiv) return; elementLibraryButtonsDiv.innerHTML = ''; elementNames.forEach(elName => { const key = elementNameToKey[elName]; const button = document.createElement('button'); button.classList.add('button', 'small-button'); button.textContent = elementDetails[elName]?.name || elName; button.style.borderColor = getElementColor(elName); button.onclick = () => displayElementDeepDive(key); elementLibraryButtonsDiv.appendChild(button); }); if (!elementLibraryContentDiv.querySelector('.library-level') && !elementLibraryContentDiv.querySelector('.library-unlock')) { elementLibraryContentDiv.innerHTML = '<p>Select an Element above to view its deep dive content.</p>'; } }
function displayElementDeepDive(elementKey) {
    if (!checkDataLoaded() || !elementLibraryContentDiv) return;
    const deepDiveData = elementDeepDive[elementKey] || []; const currentLevel = unlockedDeepDiveLevels[elementKey] || 0; const elementName = elementKeyToFullName[elementKey] || elementKey; elementLibraryContentDiv.innerHTML = `<h4>${elementDetails[elementName]?.name || elementName} - Insights</h4>`; if (deepDiveData.length === 0) { elementLibraryContentDiv.innerHTML += '<p>No deep dive content available.</p>'; return; } let displayedContent = false; deepDiveData.forEach(levelData => { if (levelData.level <= currentLevel) { elementLibraryContentDiv.innerHTML += `<div class="library-level"><h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5><div class="level-content">${levelData.content}</div></div><hr class="popup-hr">`; displayedContent = true; } }); if (!displayedContent) { elementLibraryContentDiv.innerHTML += '<p>Unlock the first level to begin exploring.</p>'; } const nextLevel = currentLevel + 1; const nextLevelData = deepDiveData.find(l => l.level === nextLevel); if (nextLevelData) { const cost = nextLevelData.insightCost || 0; const canAfford = userInsight >= cost; const requirementsMet = true; elementLibraryContentDiv.innerHTML += `<div class="library-unlock"><h5>Next: ${nextLevelData.title} (Level ${nextLevelData.level})</h5><button class="button small-button unlock-button" onclick="unlockDeepDiveLevel('${elementKey}', ${nextLevelData.level})" ${!canAfford || !requirementsMet ? 'disabled' : ''} title="${!canAfford ? `Requires ${cost} Insight` : !requirementsMet ? 'Requirements not met' : `Unlock for ${cost} Insight`}"> Unlock (Cost: ${cost} <i class="fas fa-brain insight-icon"></i>)</button>${!canAfford ? `<p class='unlock-error'>Insufficient Insight (${userInsight.toFixed(1)}/${cost})</p>` : ''}${!requirementsMet && canAfford ? `<p class='unlock-error'>Other requirements not met.</p>` : ''}</div>`; } else if (displayedContent) { elementLibraryContentDiv.innerHTML += '<p><i>You have unlocked all available insights for this element.</i></p>'; }
}
function unlockDeepDiveLevel(elementKey, levelToUnlock) {
    if (!checkDataLoaded()) return;
    const deepDiveData = elementDeepDive[elementKey] || []; const levelData = deepDiveData.find(l => l.level === levelToUnlock); const currentLevel = unlockedDeepDiveLevels[elementKey] || 0; if (!levelData || levelToUnlock !== currentLevel + 1) { return; } const cost = levelData.insightCost || 0; if (spendInsight(cost, `Unlock Library: ${elementKeyToFullName[elementKey]} Lv ${levelToUnlock}`)) { unlockedDeepDiveLevels[elementKey] = levelToUnlock; console.log(`Unlocked ${elementKeyToFullName[elementKey]} deep dive level ${levelToUnlock}`); displayElementDeepDive(elementKey); saveGameState(); showTemporaryMessage(`${elementKeyToFullName[elementKey]} Insight Level ${levelToUnlock} Unlocked!`, 3000); updateMilestoneProgress('unlockLibrary', levelToUnlock); updateMilestoneProgress('unlockedDeepDiveLevels', unlockedDeepDiveLevels); checkAndUpdateRituals('unlockLibrary'); }
}

// --- Repository Functions ---
function displayRepositoryContent() {
    if (!checkDataLoaded()) return;
    // Find or create the target divs if they don't exist in HTML yet
    let scenesContainer = document.getElementById('repositoryScenes');
    let experimentsContainer = document.getElementById('repositoryExperiments');
    let insightsContainer = document.getElementById('repositoryInsights');

    if (!repositoryScreen) return; // Ensure the main screen exists

    // If containers missing, create them (basic structure)
    if (!scenesContainer || !experimentsContainer || !insightsContainer) {
        repositoryScreen.innerHTML = `<h1>Repository</h1>
            <section id="repositoryScenes"><h2>Scene Blueprints</h2><div class="repo-list"></div></section>
            <hr>
            <section id="repositoryExperiments"><h2>Alchemical Experiments</h2><div class="repo-list"></div></section>
            <hr>
            <section id="repositoryInsights"><h2>Elemental Insights</h2><div class="repo-list"></div></section>`;
        scenesContainer = document.getElementById('repositoryScenes').querySelector('.repo-list');
        experimentsContainer = document.getElementById('repositoryExperiments').querySelector('.repo-list');
        insightsContainer = document.getElementById('repositoryInsights').querySelector('.repo-list');
    } else {
        // Clear previous content if divs exist
        scenesContainer.innerHTML = '';
        experimentsContainer.innerHTML = '';
        insightsContainer.innerHTML = '';
    }


    // Display Scene Blueprints
    if (discoveredRepositoryItems.scenes.size > 0) {
        discoveredRepositoryItems.scenes.forEach(sceneId => {
            const scene = sceneBlueprints.find(s => s.id === sceneId);
            if (scene) scenesContainer.appendChild(renderRepositoryItem(scene, 'scene'));
        });
    } else {
        scenesContainer.innerHTML = '<p>No Scene Blueprints discovered yet.</p>';
    }

    // Display Alchemical Experiments (Check unlock conditions)
    let experimentsDisplayed = 0;
    alchemicalExperiments.forEach(exp => {
        const isUnlocked = elementAttunement[exp.requiredElement] >= exp.requiredAttunement;
        const alreadyCompleted = discoveredRepositoryItems.experiments.has(exp.id); // Check if completed
        if (isUnlocked) {
            experimentsContainer.appendChild(renderRepositoryItem(exp, 'experiment', alreadyCompleted));
            experimentsDisplayed++;
        }
    });
     if (experimentsDisplayed === 0) {
         experimentsContainer.innerHTML = '<p>Increase Element Attunement to unlock Experiments.</p>';
     }


    // Display Elemental Insights
    if (discoveredRepositoryItems.insights.size > 0) {
        // Group by element? Or just list? Let's group.
        const insightsByElement = {};
        elementNames.forEach(elName => insightsByElement[elementNameToKey[elName]] = []);

        discoveredRepositoryItems.insights.forEach(insightId => {
             const insight = elementalInsights.find(i => i.id === insightId);
             if (insight && insightsByElement[insight.element]) {
                 insightsByElement[insight.element].push(insight);
             }
        });

        let insightsHTML = '';
        for (const key in insightsByElement) {
            if (insightsByElement[key].length > 0) {
                insightsHTML += `<h5>${elementDetails[elementKeyToFullName[key]]?.name || key} Insights:</h5><ul>`;
                insightsByElement[key].forEach(insight => {
                    insightsHTML += `<li>"${insight.text}"</li>`;
                });
                insightsHTML += `</ul>`;
            }
        }
        insightsContainer.innerHTML = insightsHTML || '<p>No Elemental Insights collected yet.</p>';

    } else {
        insightsContainer.innerHTML = '<p>No Elemental Insights collected yet.</p>';
    }
}

function renderRepositoryItem(item, type, completed = false) {
    const div = document.createElement('div');
    div.classList.add('repository-item', `repo-item-${type}`);
    if (completed) div.classList.add('completed');

    let actionsHTML = '';
    if (type === 'scene') {
        actionsHTML = `<button class="button small-button" onclick="meditateOnScene('${item.id}')" ${userInsight < item.meditationCost ? 'disabled' : ''}>Meditate (${item.meditationCost} <i class="fas fa-brain insight-icon"></i>)</button>`;
    } else if (type === 'experiment') {
        // Check focus requirements
        let canAttempt = true;
        let unmetReqs = [];
        if (item.requiredFocusConceptIds && item.requiredFocusConceptIds.length > 0) {
            item.requiredFocusConceptIds.forEach(reqId => {
                if (!focusedConcepts.has(reqId)) {
                     canAttempt = false;
                     const concept = concepts.find(c=>c.id === reqId);
                     unmetReqs.push(concept ? concept.name : `ID ${reqId}`);
                }
            });
        }
        if (item.requiredFocusConceptTypes && item.requiredFocusConceptTypes.length > 0) {
            let typeMet = false;
             for(const typeReq of item.requiredFocusConceptTypes) {
                 for (const focusId of focusedConcepts) {
                      const concept = discoveredConcepts.get(focusId)?.concept;
                      if(concept && concept.cardType === typeReq) {
                           typeMet = true; break;
                      }
                 }
                 if(!typeMet) {
                     canAttempt = false;
                     unmetReqs.push(`Type: ${typeReq}`);
                 }
             }
        }

        actionsHTML = `<button class="button small-button" onclick="attemptExperiment('${item.id}')" ${userInsight < item.insightCost || !canAttempt || completed ? 'disabled' : ''}>Attempt (${item.insightCost} <i class="fas fa-brain insight-icon"></i>)</button>`;
        if (completed) actionsHTML += ` <span class="completed-text">(Completed)</span>`;
        else if (!canAttempt) actionsHTML += ` <small class="req-missing">(Requires Focus: ${unmetReqs.join(', ')})</small>`;
        else if (userInsight < item.insightCost) actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`;
    }

    div.innerHTML = `
        <h4>${item.name} ${type === 'experiment' ? `(Requires ${item.requiredAttunement} ${elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4>
        <p>${item.description}</p>
        <div class="repo-actions">${actionsHTML}</div>
    `;
    return div;
}

function meditateOnScene(sceneId) {
    if (!checkDataLoaded()) return;
    const scene = sceneBlueprints.find(s => s.id === sceneId);
    if (!scene) return;

    if (spendInsight(scene.meditationCost, `Meditate on Scene: ${scene.name}`)) {
        // Trigger a specific reflection using the scene's prompt ID
        const prompt = reflectionPrompts.SceneMeditation[scene.reflectionPromptId];
        if (prompt) {
            currentReflectionContext = 'SceneMeditation';
            currentReflectionCategory = scene.name; // Use scene name as category for display
            currentPromptId = prompt.id;
            // Directly populate and show modal (bypasses normal displayReflectionPrompt selection)
            if (reflectionModalTitle) reflectionModalTitle.textContent = "Scene Meditation";
            if (reflectionElement) reflectionElement.textContent = scene.name;
            if (reflectionPromptText) reflectionPromptText.textContent = prompt.text;
            if (reflectionCheckbox) reflectionCheckbox.checked = false;
            if (scoreNudgeCheckbox) scoreNudgeCheckbox.classList.add('hidden'); // No nudge for scenes
            if (confirmReflectionButton) confirmReflectionButton.disabled = true;
            const rewardAmount = scene.meditationCost + 5; // Example: Cost + 5 bonus Insight
            if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${rewardAmount} Insight`;
            if (reflectionModal) reflectionModal.classList.remove('hidden');
            if (popupOverlay) popupOverlay.classList.remove('hidden');

            updateMilestoneProgress('meditateScene', 1); // Track milestone
        } else {
            console.error(`Reflection prompt ${scene.reflectionPromptId} not found for scene ${sceneId}`);
            gainInsight(scene.meditationCost, `Refund: Missing prompt for scene ${sceneId}`); // Refund
        }
    }
}

function attemptExperiment(experimentId) {
    if (!checkDataLoaded()) return;
    const experiment = alchemicalExperiments.find(e => e.id === experimentId);
    if (!experiment || discoveredRepositoryItems.experiments.has(experimentId)) return; // Don't re-attempt completed

    // Double check requirements (UI disable might fail)
    if (elementAttunement[experiment.requiredElement] < experiment.requiredAttunement) { showTemporaryMessage("Attunement too low.", 3000); return; }
    // Check focus reqs again
    let canAttempt = true;
    if (experiment.requiredFocusConceptIds) { experiment.requiredFocusConceptIds.forEach(reqId => { if (!focusedConcepts.has(reqId)) canAttempt = false; }); }
    if (experiment.requiredFocusConceptTypes && canAttempt) { /* ... (check type reqs again) ... */ }
    if (!canAttempt) { showTemporaryMessage("Required concepts not focused.", 3000); return; }

    if (spendInsight(experiment.insightCost, `Attempt Experiment: ${experiment.name}`)) {
        console.log(`Attempting experiment: ${experiment.name}`);
        updateMilestoneProgress('attemptExperiment', 1);

        const successRoll = Math.random();
        if (successRoll < (experiment.successRate || 0.5)) {
            // Success!
            console.log("Experiment Successful!");
            showTemporaryMessage(`Success! Experiment '${experiment.name}' yielded results.`, 4000);
            discoveredRepositoryItems.experiments.add(experiment.id); // Mark as completed
            if (experiment.successReward) {
                if (experiment.successReward.type === 'insight') gainInsight(experiment.successReward.amount, `Experiment Success: ${experiment.name}`);
                if (experiment.successReward.type === 'attunement') gainAttunementForAction('experimentSuccess', experiment.successReward.element || 'All', experiment.successReward.amount);
            }
            // Trigger special reflection? Maybe later.
        } else {
            // Failure
            console.log("Experiment Failed.");
            showTemporaryMessage(`Experiment '${experiment.name}' failed... ${experiment.failureConsequence || "No lasting effects."}`, 4000);
            // Apply consequence? (e.g., temporary attunement reduction - tricky to implement well)
        }
        displayRepositoryContent(); // Refresh repository display
        saveGameState();
    }
}


// --- Toast Message Function ---
function showTemporaryMessage(message, duration = 3000) { if (!toastElement || !toastMessageElement) { console.warn("Toast elements not found, logging message to console:", message); return; } console.info(`Toast: ${message}`); toastMessageElement.textContent = message; if (toastTimeout) { clearTimeout(toastTimeout); } toastElement.classList.remove('hidden'); toastElement.classList.add('visible'); toastTimeout = setTimeout(() => { toastElement.classList.remove('visible'); toastElement.classList.add('hidden'); toastTimeout = null; }, duration); }

// --- Reset App ---
function resetApp() { if (confirm("Reset ALL progress, including scores, Grimoire, and unlocked content? This cannot be undone.")) { console.log("Resetting application..."); clearGameState(); initializeQuestionnaire(true); } }

// --- Daily Login Check ---
function checkForDailyLogin() { const today = new Date().toDateString(); let updatedState = false; if (lastLoginDate !== today) { console.log("First login of the day detected."); completedRituals.daily = {}; lastLoginDate = today; freeResearchAvailableToday = true; updatedState = true; console.log("Daily rituals reset. Free daily research granted."); gainInsight(5.0, "Daily Login Bonus"); showTemporaryMessage("Daily Rituals Reset. Free Research Available!", 3500); displayDailyRituals(); } else { console.log("Already logged in today."); if (!freeResearchAvailableToday && freeResearchButton) { freeResearchButton.disabled = true; freeResearchButton.textContent = "Daily Meditation Performed"; } } displayResearchButtons(); if (updatedState) { saveGameState(); } }

// --- Show Settings Popup ---
function showSettings() { if(settingsPopup) settingsPopup.classList.remove('hidden'); if(popupOverlay) popupOverlay.classList.remove('hidden'); }

// --- Event Listeners (v12) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Persona Alchemy Lab v12...");
    if (!checkDataLoaded()) { console.error("Data check failed on DOMContentLoaded. Aborting initialization."); return; }

    // --- Navigation & Core Actions ---
    navButtons.forEach(button => { button.addEventListener('click', () => { const targetScreenId = button.dataset.target; if (!document.getElementById(targetScreenId)) { return; } if (targetScreenId === 'personaScreen') { displayPersonaScreen(); } else if (targetScreenId === 'studyScreen') { displayStudyScreenContent(); } else if (targetScreenId === 'grimoireScreen') { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); } else if (targetScreenId === 'repositoryScreen') { displayRepositoryContent(); } /* Display Repository */ showScreen(targetScreenId); }); });
    if (startButton) { startButton.addEventListener('click', () => { initializeQuestionnaire(true); if(loadButton) loadButton.classList.add('hidden'); }); } else { console.error("Start button not found!"); }
    if (loadButton) { loadButton.onclick = () => { if(loadGameState()){ if (currentElementIndex >= elementNames.length) { console.log("Resuming existing session after load button click."); checkForDailyLogin(); updateInsightDisplays(); updateFocusSlotsDisplay(); updateGrimoireCounter(); populateGrimoireFilters(); displayPersonaScreen(); displayStudyScreenContent(); displayDailyRituals(); displayMilestones(); displayRepositoryContent(); showScreen('personaScreen'); } else { console.log("Saved state incomplete. Restarting setup after load."); initializeQuestionnaire(true); } loadButton.classList.add('hidden'); } }; }
    if (nextElementButton) nextElementButton.addEventListener('click', nextElement); else console.error("Next button not found!");
    if (prevElementButton) prevElementButton.addEventListener('click', prevElement); else console.error("Prev button not found!");
    if (settingsButton) settingsButton.addEventListener('click', showSettings); else console.error("Settings button not found!");

    // --- Popups & Modals ---
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopups); else console.error("Close Popup button not found!");
    if (popupOverlay) popupOverlay.addEventListener('click', hidePopups); else console.error("Popup Overlay not found!");
    if (closeReflectionModalButton) closeReflectionModalButton.addEventListener('click', hidePopups); else console.error("Close Reflection Modal button not found!");
    if (closeSettingsPopupButton) closeSettingsPopupButton.addEventListener('click', hidePopups); else console.error("Close Settings Popup button not found!");
    if (closeMilestoneAlertButton) closeMilestoneAlertButton.addEventListener('click', hideMilestoneAlert); else console.error("Close Milestone Alert button not found!");

    // --- Concept Interaction & Notes ---
    if (addToGrimoireButton) addToGrimoireButton.addEventListener('click', addToGrimoire); else console.error("Add to Grimoire button not found!");
    if (markAsFocusButton) markAsFocusButton.addEventListener('click', toggleFocusConcept); else console.error("Mark as Focus button not found!");

    // --- Grimoire Filters ---
    const grimoireRefresh = () => { if (!grimoireScreen.classList.contains('hidden')) { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); } };
    if (grimoireTypeFilter) grimoireTypeFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Type filter not found!");
    if (grimoireElementFilter) grimoireElementFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Element filter not found!");
    if (grimoireRarityFilter) grimoireRarityFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Rarity filter not found!");
    if (grimoireSortOrder) grimoireSortOrder.addEventListener('change', grimoireRefresh); else console.error("Grimoire Sort order not found!");

    // --- Reflection & Guidance ---
    if (reflectionCheckbox) reflectionCheckbox.addEventListener('change', () => { if(confirmReflectionButton) confirmReflectionButton.disabled = !reflectionCheckbox.checked; }); else console.error("Reflection checkbox not found!");
    if (confirmReflectionButton) confirmReflectionButton.addEventListener('click', handleConfirmReflection); else console.error("Confirm Reflection button not found!");
    if (seekGuidanceButton) seekGuidanceButton.addEventListener('click', triggerGuidedReflection); else console.error("Seek Guidance button not found!");

    // --- Settings Popup Actions ---
    if (forceSaveButton) forceSaveButton.addEventListener('click', () => { saveGameState(); showTemporaryMessage("Game Saved!", 1500); }); else console.error("Force Save button not found!");
    if (resetAppButton) resetAppButton.addEventListener('click', resetApp); else console.error("Reset App button not found!");

    // --- Persona View Toggle ---
    if(showDetailedViewBtn) showDetailedViewBtn.addEventListener('click', () => { personaDetailedView?.classList.add('current'); personaDetailedView?.classList.remove('hidden'); personaSummaryView?.classList.add('hidden'); personaSummaryView?.classList.remove('current'); showDetailedViewBtn.classList.add('active'); showSummaryViewBtn?.classList.remove('active'); });
    if(showSummaryViewBtn) showSummaryViewBtn.addEventListener('click', () => { personaSummaryView?.classList.add('current'); personaSummaryView?.classList.remove('hidden'); personaDetailedView?.classList.add('hidden'); personaDetailedView?.classList.remove('current'); showSummaryViewBtn.classList.add('active'); showDetailedViewBtn?.classList.remove('active'); displayPersonaSummary(); });

    // --- INITIAL LOAD LOGIC ---
    if (localStorage.getItem(SAVE_KEY)) { if(loadButton) loadButton.classList.remove('hidden'); showScreen('welcomeScreen'); }
    else { if(loadButton) loadButton.classList.add('hidden'); showScreen('welcomeScreen'); }
    console.log("Initialization complete. Ready.");

}); // --- END OF DOMContentLoaded ---
