// --- START OF FILE ui.js ---

// ... (Imports, DOM Element References, Utility UI Functions, Screen Management, Onboarding UI, Insight Display, Questionnaire UI) ...
// --- START OF FILE ui.js ---

// js/ui.js - Handles DOM Manipulation and UI Updates
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js'; // Needed for button actions
import { elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals, sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames } from '../data.js';

console.log("ui.js loading...");

// --- DOM Element References ---
const saveIndicator = document.getElementById('saveIndicator');
const screens = document.querySelectorAll('.screen');
const welcomeScreen = document.getElementById('welcomeScreen');
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
const navButtons = document.querySelectorAll('.nav-button');
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
// REMOVED: focusResonanceBarsContainer
const tapestryNarrativeP = document.getElementById('tapestryNarrative');
const personaThemesList = document.getElementById('personaThemesList');
const summaryContentDiv = document.getElementById('summaryContent');
const studyScreen = document.getElementById('studyScreen');
const userInsightDisplayStudy = document.getElementById('userInsightDisplayStudy');
const researchButtonContainer = document.getElementById('researchButtonContainer');
const freeResearchButton = document.getElementById('freeResearchButton');
const seekGuidanceButton = document.getElementById('seekGuidanceButton'); // Still needed for listener, though moved
const researchStatus = document.getElementById('researchStatus');
const researchOutput = document.getElementById('researchOutput');
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay');
const guidedReflectionCostDisplay = document.getElementById('guidedReflectionCostDisplay');
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const grimoireControls = document.getElementById('grimoireControls');
const grimoireFilterControls = grimoireControls?.querySelector('.filter-controls');
const grimoireTypeFilter = document.getElementById('grimoireTypeFilter');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireRarityFilter = document.getElementById('grimoireRarityFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireSearchInput = document.getElementById('grimoireSearchInput');
const grimoireFocusFilter = document.getElementById('grimoireFocusFilter');
const grimoireContentDiv = document.getElementById('grimoireContent');
const repositoryScreen = document.getElementById('repositoryScreen');
const repositoryFocusUnlocksDiv = document.getElementById('repositoryFocusUnlocks')?.querySelector('.repo-list');
const repositoryScenesDiv = document.getElementById('repositoryScenes')?.querySelector('.repo-list');
const repositoryExperimentsDiv = document.getElementById('repositoryExperiments')?.querySelector('.repo-list');
const repositoryInsightsDiv = document.getElementById('repositoryInsights')?.querySelector('.repo-list');
const milestonesDisplay = document.getElementById('milestonesDisplay');
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
const popupRelatedConcepts = document.getElementById('popupRelatedConcepts');
const myNotesSection = document.getElementById('myNotesSection');
const myNotesTextarea = document.getElementById('myNotesTextarea');
const saveMyNoteButton = document.getElementById('saveMyNoteButton');
const noteSaveStatusSpan = document.getElementById('noteSaveStatus');
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
const markAsFocusButton = document.getElementById('markAsFocusButton');
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
const exploreTapestryButton = document.getElementById('exploreTapestryButton');
// Suggest Scene button already declared
// const suggestSceneButton = document.getElementById('suggestSceneButton');
const tapestryDeepDiveModal = document.getElementById('tapestryDeepDiveModal');
const closeDeepDiveButton = document.getElementById('closeDeepDiveButton');
const deepDiveFocusIcons = document.getElementById('deepDiveFocusIcons');
const deepDiveNarrativeP = document.getElementById('deepDiveNarrative');
const deepDiveAnalysisNodes = document.getElementById('deepDiveAnalysisNodes');
const deepDiveDetailContent = document.getElementById('deepDiveDetailContent');
const contemplationNodeButton = document.getElementById('contemplationNode');
const taskNotificationArea = document.getElementById('taskNotificationArea');
const taskNotificationText = document.getElementById('taskNotificationText');
const taskDismissButton = document.getElementById('taskDismissButton');


// --- Utility UI Functions ---
let toastTimeout = null;
export function showTemporaryMessage(message, duration = 3000) {
    if (!toastElement || !toastMessageElement) { console.warn("Toast elements missing:", message); return; }
    console.info(`Toast: ${message}`);
    toastMessageElement.textContent = message;
    if (toastTimeout) { clearTimeout(toastTimeout); }
    toastElement.classList.remove('hidden', 'visible');
    void toastElement.offsetWidth; // Trigger reflow
    toastElement.classList.add('visible');
    toastElement.classList.remove('hidden');
    toastTimeout = setTimeout(() => {
        toastElement.classList.remove('visible');
         setTimeout(() => { if (!toastElement.classList.contains('visible')) { toastElement.classList.add('hidden'); } }, 500);
        toastTimeout = null;
    }, duration);
}

let milestoneTimeout = null;
export function showMilestoneAlert(text) {
    if (!milestoneAlert || !milestoneAlertText) return;
    milestoneAlertText.textContent = `Milestone: ${text}`;
    milestoneAlert.classList.remove('hidden');
    if (milestoneTimeout) clearTimeout(milestoneTimeout);
    milestoneTimeout = setTimeout(hideMilestoneAlert, 5000);
}
export function hideMilestoneAlert() {
    if (milestoneAlert) milestoneAlert.classList.add('hidden');
    if (milestoneTimeout) clearTimeout(milestoneTimeout);
    milestoneTimeout = null;
}
export function hidePopups() {
    // Also hide info popup if open
    const infoPopupElement = document.getElementById('infoPopup');
    if (infoPopupElement) infoPopupElement.classList.add('hidden');

    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (settingsPopup) settingsPopup.classList.add('hidden');
    if (tapestryDeepDiveModal) tapestryDeepDiveModal.classList.add('hidden');
    if (popupOverlay) popupOverlay.classList.add('hidden'); // Hide overlay when any main popup closes
    GameLogic.clearPopupState();
}

// --- Screen Management ---
export function showScreen(screenId) {
    console.log("UI: Showing screen:", screenId);
    const currentState = State.getState();
    const isPostQuestionnaire = currentState.questionnaireCompleted;

    screens.forEach(screen => {
        screen?.classList.toggle('current', screen.id === screenId);
        screen?.classList.toggle('hidden', screen.id !== screenId);
    });

    if (mainNavBar) {
        mainNavBar.classList.toggle('hidden', !isPostQuestionnaire || screenId === 'welcomeScreen' || screenId === 'questionnaireScreen');
    }
    navButtons.forEach(button => {
        if(button) button.classList.toggle('active', button.dataset.target === screenId);
    });

    // Call logic handlers AFTER showing the screen
    if (isPostQuestionnaire) {
        if (screenId === 'personaScreen') GameLogic.displayPersonaScreenLogic();
        else if (screenId === 'studyScreen') GameLogic.displayStudyScreenLogic();
        else if (screenId === 'grimoireScreen') refreshGrimoireDisplay();
        else if (screenId === 'repositoryScreen') displayRepositoryContent();

        // Check tasks whenever a main screen is shown post-questionnaire
        if (['personaScreen', 'studyScreen', 'grimoireScreen', 'repositoryScreen'].includes(screenId)) {
            GameLogic.checkTaskCompletion('showScreen', screenId);
        }
    }

    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
}


// --- Onboarding UI Adjustments ---
// Stores elements currently highlighted
let highlightedElements = [];

// Function to remove highlight after a delay
function removeHighlight(element) {
    if (element) {
        element.classList.remove('new-feature-highlight');
    }
}

// Function to add highlight and schedule its removal
function addTemporaryHighlight(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        // Remove any existing highlight timeout for this element
        const existingTimeout = element.dataset.highlightTimeout;
        if (existingTimeout) {
            clearTimeout(parseInt(existingTimeout));
        }
        // Add highlight and set new timeout
        element.classList.add('new-feature-highlight');
        const timeoutId = setTimeout(() => removeHighlight(element), 6000); // Highlight for 6 seconds
        element.dataset.highlightTimeout = timeoutId.toString();
        highlightedElements.push(element); // Track highlighted elements
    });
}

export function applyOnboardingPhaseUI(phase) {
    console.log(`UI: Applying onboarding phase ${phase}`);

    // --- Clear Previous Highlights ---
    highlightedElements.forEach(element => {
        if (!element) return; // Add null check
        const timeoutId = element.dataset.highlightTimeout;
        if (timeoutId) {
            clearTimeout(parseInt(timeoutId));
        }
        removeHighlight(element); // Remove immediately
        delete element.dataset.highlightTimeout;
    });
    highlightedElements = []; // Reset tracked elements
    // --- End Clear Highlights ---

    // --- Toggle Phase Visibility ---
    const phases = Config.ONBOARDING_PHASE;
    document.querySelectorAll('[class*="feature-phase-"]').forEach(el => {
        const isPhase1Hidden = el.classList.contains('feature-phase-1-hidden') && phase < phases.PERSONA_GRIMOIRE;
        const isPhase2Hidden = el.classList.contains('feature-phase-2-hidden') && phase < phases.STUDY_INSIGHT;
        const isPhase3Hidden = el.classList.contains('feature-phase-3-hidden') && phase < phases.REFLECTION_RITUALS;
        const isPhase4Hidden = el.classList.contains('feature-phase-4-hidden') && phase < phases.ADVANCED;

        // Hide if *any* of its phase requirements are not met
        el.classList.toggle('hidden', isPhase1Hidden || isPhase2Hidden || isPhase3Hidden || isPhase4Hidden);
    });

    // --- Apply Temporary Highlights for Newly Unlocked Features ---
    // Determine previous phase more reliably if needed (e.g., store previousPhase in state)
    // For now, assume linear progression for highlighting
    const justReachedPhase1 = phase === phases.PERSONA_GRIMOIRE;
    const justReachedPhase2 = phase === phases.STUDY_INSIGHT;
    const justReachedPhase3 = phase === phases.REFLECTION_RITUALS;
    const justReachedPhase4 = phase === phases.ADVANCED;

    if (justReachedPhase1) {
        addTemporaryHighlight('.nav-button[data-target="grimoireScreen"]');
        addTemporaryHighlight('#personaScreen .persona-constellation');
        addTemporaryHighlight('.card-focus-button'); // Highlight example on cards
        addTemporaryHighlight('#markAsFocusButton'); // Highlight button in popup
        addTemporaryHighlight('#exploreTapestryButton');
        addTemporaryHighlight('#suggestSceneButton');
    } else if (justReachedPhase2) {
        addTemporaryHighlight('.nav-button[data-target="studyScreen"]');
        addTemporaryHighlight('#researchButtonContainer');
        addTemporaryHighlight('.filter-controls');
        addTemporaryHighlight('.card-sell-button'); // Sell buttons on cards
        // popup-sell-button highlight handled when popup opens? Or highlight here if visible?
        addTemporaryHighlight('#myNotesSection');
    } else if (justReachedPhase3) {
        addTemporaryHighlight('#seekGuidanceButton');
        addTemporaryHighlight('.rituals-alcove');
    } else if (justReachedPhase4) {
        addTemporaryHighlight('.nav-button[data-target="repositoryScreen"]');
        addTemporaryHighlight('.element-deep-dive-container .unlock-button');
        addTemporaryHighlight('#popupEvolutionSection');
    }

    // --- Update specific popup elements based on phase ---
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
         const isDiscovered = !!State.getDiscoveredConceptData(popupConceptId);
         const concept = concepts.find(c => c.id === popupConceptId);
         const inResearch = !isDiscovered && researchOutput?.querySelector(`.research-result-item[data-concept-id="${popupConceptId}"]`);

         updateFocusButtonStatus(popupConceptId); // Handles Phase 1 check internally
         updateGrimoireButtonStatus(popupConceptId, !!inResearch); // No phase check needed
         updatePopupSellButton(popupConceptId, concept, isDiscovered, !!inResearch); // Handles Phase 2 check internally

         if (myNotesSection) myNotesSection.classList.toggle('hidden', phase < phases.STUDY_INSIGHT || !isDiscovered);
         if (popupEvolutionSection) {
            const showEvo = phase >= phases.ADVANCED && isDiscovered && concept?.canUnlockArt && !State.getDiscoveredConceptData(popupConceptId)?.artUnlocked;
            popupEvolutionSection.classList.toggle('hidden', !showEvo);
            if (showEvo) displayEvolutionSection(concept, State.getDiscoveredConceptData(popupConceptId));
         }
    }
    // --- End Update specific popup elements ---

} // <<< End of applyOnboardingPhaseUI

// --- Insight Display ---
export function updateInsightDisplays() {
    const insight = State.getInsight().toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = insight;
    displayResearchButtons();
    // Ensure guidance button exists before trying to access properties
    if (seekGuidanceButton) seekGuidanceButton.disabled = State.getInsight() < Config.GUIDED_REFLECTION_COST;
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;

    // Refresh Deep Dive unlock buttons if Persona screen is visible
    if (personaScreen?.classList.contains('current')) {
        const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container');
        deepDiveContainers?.forEach(container => {
            const elementKey = container.dataset.elementKey;
            if (elementKey) {
                 displayElementDeepDive(elementKey, container); // Refresh unlock button states
            }
        });
    }

    if (repositoryScreen && repositoryScreen.classList.contains('current')) { displayRepositoryContent(); }
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
          const concept = concepts.find(c => c.id === popupConceptId); const discoveredData = State.getDiscoveredConceptData(popupConceptId);
          if(concept && discoveredData) displayEvolutionSection(concept, discoveredData); // Update Evolve button state
    }
    updateContemplationButtonState();
    updateSuggestSceneButtonState();
}

// --- Questionnaire UI ---
export function initializeQuestionnaireUI() {
    console.log("UI: Initializing Questionnaire UI");
    State.updateElementIndex(0); // Explicitly set state index to 0
    updateElementProgressHeader(-1); // Show no progress initially
    displayElementQuestions(0); // Display the first set of questions

    if (mainNavBar) mainNavBar.classList.add('hidden');
    // Dynamic feedback visibility handled within updateDynamicFeedback
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none';
    console.log("UI: Questionnaire UI initialized, index set to 0.");
}

export function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) return; elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div'); tab.classList.add('element-tab');
        const elementData = elementDetails[name] || {};
        tab.textContent = elementData.name || name; tab.title = elementData.name || name;
        tab.classList.toggle('completed', index < activeIndex); tab.classList.toggle('active', index === activeIndex);
        elementProgressHeader.appendChild(tab);
    });
}

export function displayElementQuestions(index) {
    // Get index from state *inside* the function
    const actualIndex = State.getState().currentElementIndex;
    const displayIndex = (actualIndex >= 0 && actualIndex < elementNames.length) ? actualIndex : index;

    console.log(`UI: Displaying questions requested for index ${index}, using actual state index ${displayIndex}`);

    if (displayIndex >= elementNames.length) {
        const lastElementIndex = elementNames.length - 1;
        if (lastElementIndex >= 0) {
            const finalAnswers = getQuestionnaireAnswers();
            if (Object.keys(finalAnswers).length > 0) {
                 State.updateAnswers(elementNames[lastElementIndex], finalAnswers);
            }
        }
        GameLogic.finalizeQuestionnaire();
        return;
    }

    const elementName = elementNames[displayIndex];
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || [];
    if (!questionContent) { console.error("questionContent element missing!"); return; }

    const elementAnswers = State.getState().userAnswers?.[elementName] || {};
    console.log(`UI: Answers for ${elementName} (Index ${displayIndex}):`, JSON.parse(JSON.stringify(elementAnswers)));

    // Generate HTML
    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    let questionsHTML = '';
    questions.forEach(q => {
        let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
        const savedAnswer = elementAnswers[q.qId];
        let sliderValue = q.defaultValue;
        if (q.type === "slider") {
             sliderValue = (savedAnswer !== undefined && !isNaN(parseFloat(savedAnswer))) ? parseFloat(savedAnswer) : q.defaultValue;
             inputHTML += `<div class="slider-container"><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${sliderValue}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(sliderValue).toFixed(1)}</span></p><p class="slider-feedback" id="feedback_${q.qId}"></p></div>`;
        } else if (q.type === "radio") {
             inputHTML += `<div class="radio-options">`;
             q.options.forEach(opt => { const checked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; });
             inputHTML += `</div>`;
        } else if (q.type === "checkbox") {
             inputHTML += `<div class="checkbox-options">`;
             q.options.forEach(opt => { const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; });
             inputHTML += `</div>`;
        }
        inputHTML += `</div></div>`; questionsHTML += inputHTML;
    });
    if (questions.length === 0) questionsHTML = '<p><em>(No questions for this element)</em></p>';

    // Insert HTML
    questionContent.innerHTML = introHTML;
    const introDiv = questionContent.querySelector('.element-intro');
    if (introDiv) introDiv.insertAdjacentHTML('afterend', questionsHTML);
    else questionContent.innerHTML += questionsHTML;

    // Attach Listeners
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
        input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
    });
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.removeEventListener('change', GameLogic.handleCheckboxChange);
        checkbox.addEventListener('change', GameLogic.handleCheckboxChange);
    });

    // Initial UI Updates
    questionContent.querySelectorAll('.slider.q-input').forEach(slider => {
        updateSliderFeedbackText(slider, elementName);
    });
    updateDynamicFeedback(elementName, elementAnswers); // Handles making feedback visible

    // Update Progress/Buttons
    updateElementProgressHeader(displayIndex);
    if (progressText) progressText.textContent = `Element ${displayIndex + 1} / ${elementNames.length}: ${elementData.name || elementName}`;
    if (prevElementButton) prevElementButton.style.visibility = (displayIndex > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (displayIndex === elementNames.length - 1) ? "View My Persona" : "Next Element";

    console.log(`UI: Finished displaying questions for ${elementName} at index ${displayIndex}`);
}

export function updateSliderFeedbackText(sliderElement, elementName) {
    if (!sliderElement || sliderElement.type !== 'range') return;
    const qId = sliderElement.dataset.questionId;
    const feedbackElement = document.getElementById(`feedback_${qId}`);
    if (!feedbackElement) return;
    const currentValue = parseFloat(sliderElement.value);
    const display = document.getElementById(`display_${qId}`);
    if(display) display.textContent = currentValue.toFixed(1);

    if (!elementName) {
         console.warn("updateSliderFeedbackText called without elementName!");
         feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`;
         return;
    }

    const interpretations = elementDetails?.[elementName]?.scoreInterpretations;
    if (!interpretations) { feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; return; }
    const scoreLabel = Utils.getScoreLabel(currentValue);
    const interpretationText = interpretations[scoreLabel] || `Interpretation for "${scoreLabel}" not found.`;
    feedbackElement.textContent = interpretationText;
    feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`;
}
export function updateDynamicFeedback(elementName, currentAnswers) {
     const elementData = elementDetails?.[elementName];
     if (!elementData || !dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) {
         if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; // Hide if elements missing
         return;
     }
     const tempScore = GameLogic.calculateElementScore(elementName, currentAnswers);
     const scoreLabel = Utils.getScoreLabel(tempScore);
     feedbackElementSpan.textContent = elementData.name || elementName;
     feedbackScoreSpan.textContent = tempScore.toFixed(1);
     let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
     if(!labelSpan && feedbackScoreSpan?.parentNode) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling); }
     if (labelSpan) labelSpan.textContent = ` (${scoreLabel})`;
     feedbackScoreBar.style.width = `${tempScore * 10}%`;
     dynamicScoreFeedback.style.display = 'block'; // Make visible *here* after update
}
export function getQuestionnaireAnswers() {
     const answers = {}; const inputs = questionContent?.querySelectorAll('.q-input'); if (!inputs) return answers;
     inputs.forEach(input => {
         const qId = input.dataset.questionId; const type = input.dataset.type; if (!qId) return;
         if (type === 'slider') answers[qId] = parseFloat(input.value);
         else if (type === 'radio') { if (input.checked) answers[qId] = input.value; }
         else if (type === 'checkbox') { if (!answers[qId]) answers[qId] = []; if (input.checked) answers[qId].push(input.value); }
     }); return answers;
}

// --- Persona Screen UI ---
export function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona element details div not found!"); return; }
    console.log("UI: Displaying Persona Screen");
    personaElementDetailsDiv.innerHTML = '';
    const scores = State.getScores();
    const showDeepDiveContainer = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;

    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName];
        const score = (typeof scores[key] === 'number' && !isNaN(scores[key])) ? scores[key] : 5.0;
        const scoreLabel = Utils.getScoreLabel(score);
        const elementData = elementDetails[elementName] || {};
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A";
        const barWidth = score ? (score / 10) * 100 : 0;
        const color = Utils.getElementColor(elementName);
        const iconClass = Utils.getElementIcon(elementName);

        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        details.dataset.elementKey = key;
        details.style.setProperty('--element-color', color);

        const deepDiveContainer = document.createElement('div');
        deepDiveContainer.classList.add('element-deep-dive-container');
        deepDiveContainer.dataset.elementKey = key;
        deepDiveContainer.classList.toggle('hidden', !showDeepDiveContainer);

        // Build innerHTML string - Corrected comments
        details.innerHTML = `
            <summary class="element-detail-header">
                 <div>
                    <i class="${iconClass} element-icon-indicator" style="color: ${color};" title="${elementData.name || elementName}"></i>
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

        const descriptionDiv = details.querySelector('.element-description');
        if (descriptionDiv) {
            descriptionDiv.appendChild(deepDiveContainer); // Append container structure
        }

        personaElementDetailsDiv.appendChild(details);

        if (showDeepDiveContainer) {
            displayElementDeepDive(key, deepDiveContainer); // Populate the container
        }
    });

    displayElementAttunement();
    updateInsightDisplays();
    displayFocusedConceptsPersona();
    generateTapestryNarrative();
    synthesizeAndDisplayThemesPersona();
    displayPersonaSummary();
    applyOnboardingPhaseUI(State.getOnboardingPhase());
    updateTapestryDeepDiveButton();
    updateSuggestSceneButtonState();
}


export function displayElementAttunement() {
    if (!personaElementDetailsDiv || personaElementDetailsDiv.children.length === 0) return;
    const attunement = State.getAttunement();
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const attunementValue = attunement[key] || 0; const percentage = (attunementValue / Config.MAX_ATTUNEMENT) * 100; const color = Utils.getElementColor(elName);
        const targetDetails = personaElementDetailsDiv.querySelector(`.element-detail-entry[data-element-key="${key}"]`);
        if (targetDetails) {
            let descriptionDiv = targetDetails.querySelector('.element-description');
            if (descriptionDiv) {
                const deepDiveContainer = descriptionDiv.querySelector('.element-deep-dive-container');
                descriptionDiv.querySelector('.attunement-display')?.remove();
                descriptionDiv.querySelector('.attunement-hr')?.remove();

                const hr = document.createElement('hr'); hr.className = 'attunement-hr';
                const attunementDiv = document.createElement('div'); attunementDiv.classList.add('attunement-display');
                attunementDiv.innerHTML = `<div class="attunement-item"><span class="attunement-name">Attunement:</span><div class="attunement-bar-container" title="Current Attunement: ${attunementValue.toFixed(1)} / ${Config.MAX_ATTUNEMENT}"><div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div></div><i class="fas fa-info-circle info-icon" title="Attunement reflects your affinity and experience with this Element. It grows through related actions like Research, Reflection, and focusing on relevant Concepts. High Attunement may unlock Experiments or reduce Research costs."></i></div>`;

                if (deepDiveContainer) {
                     descriptionDiv.insertBefore(hr, deepDiveContainer);
                     descriptionDiv.insertBefore(attunementDiv, deepDiveContainer);
                } else {
                     descriptionDiv.appendChild(hr);
                     descriptionDiv.appendChild(attunementDiv);
                }
            }
        }
    });
}
export function updateFocusSlotsDisplay() {
    const focused = State.getFocusedConcepts(); const totalSlots = State.getFocusSlots();
    if (focusedConceptsHeader) { focusedConceptsHeader.textContent = `Focused Concepts (${focused.size} / ${totalSlots})`; const icon = focusedConceptsHeader.querySelector('.info-icon'); if(icon) icon.title = `The number of Concepts currently marked as Focus out of your total available slots (${totalSlots}). Slots can be increased via Milestones.`; }
}
export function displayFocusedConceptsPersona() {
    if (!focusedConceptsDisplay) return; focusedConceptsDisplay.innerHTML = ''; updateFocusSlotsDisplay();
    const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts();
    if (focused.size === 0) { focusedConceptsDisplay.innerHTML = `<li class="focus-placeholder">Focus Concepts from your Grimoire</li>`; return; }
    focused.forEach(conceptId => {
        const conceptData = discovered.get(conceptId);
        if (conceptData?.concept) {
            const concept = conceptData.concept;
            const item = document.createElement('div'); item.classList.add('focus-concept-item'); item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`;

            let iconClass = Utils.getCardTypeIcon(concept.cardType);
            let iconColor = '#b8860b';
            if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) {
                const fullElementName = elementKeyToFullName[concept.primaryElement];
                iconClass = Utils.getElementIcon(fullElementName);
                iconColor = Utils.getElementColor(fullElementName);
            } else { console.warn(`Concept ${concept.name} missing valid primaryElement for focus icon.`); }

            item.innerHTML = `<i class="${iconClass}" style="color: ${iconColor};"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`;

            item.addEventListener('click', () => showConceptDetailPopup(concept.id));
            focusedConceptsDisplay.appendChild(item);
        } else { console.warn(`Focused concept ID ${conceptId} not found.`); const item = document.createElement('div'); item.classList.add('focus-concept-item', 'missing'); item.textContent = `Error: ID ${conceptId}`; focusedConceptsDisplay.appendChild(item); }
    });
    updateSuggestSceneButtonState();
}

export function generateTapestryNarrative() {
     if (!tapestryNarrativeP) return;
     const narrative = GameLogic.calculateTapestryNarrative();
     tapestryNarrativeP.innerHTML = narrative || 'Mark concepts as "Focus" to generate narrative...';
     console.log("UI: Updated Detailed View Tapestry Narrative paragraph.");
}
export function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return; personaThemesList.innerHTML = '';
     const themes = GameLogic.calculateFocusThemes(); // Get sorted themes {key, name, count}

     if (themes.length === 0) {
         personaThemesList.innerHTML = `<li>${State.getFocusedConcepts().size > 0 ? 'Focus is currently balanced.' : 'Mark Focused Concepts...'}</li>`;
         return;
     }

     // Display only the top theme
     const topTheme = themes[0];
     const li = document.createElement('li');
     // Customize message based on how dominant it is
     let emphasis = "Strongly";
     if (themes.length > 1 && topTheme.count <= themes[1].count + 1) { // If close to second theme
         emphasis = "Primarily";
     } else if (topTheme.count < 3) { // If only 1 or 2 concepts contribute
         emphasis = "Leaning towards";
     }
     li.textContent = `${emphasis} focused on ${topTheme.name}`;
     li.style.borderLeft = `3px solid ${Utils.getElementColor(elementKeyToFullName[topTheme.key])}`; // Add color indicator
     li.style.paddingLeft = '8px';
     personaThemesList.appendChild(li);

     // Optionally, add a note if balanced despite a top theme
     if (themes.length > 1 && topTheme.count <= themes[1].count + 1) {
         const balanceLi = document.createElement('li');
         balanceLi.innerHTML = `<small>(with other influences present)</small>`;
         balanceLi.style.fontSize = '0.85em';
         balanceLi.style.color = '#666';
         balanceLi.style.paddingLeft = '20px'; // Indent slightly
         personaThemesList.appendChild(balanceLi);
     }
} // <<< Added missing brace here

export function displayPersonaSummary() {
    if (!summaryContentDiv) return;
    summaryContentDiv.innerHTML = '<p>Generating summary...</p>';
    const scores = State.getScores(); const focused = State.getFocusedConcepts();
    const narrative = GameLogic.calculateTapestryNarrative();
    const themes = GameLogic.calculateFocusThemes();

    let html = '<h3>Core Essence</h3><div class="summary-section">';
    if (elementDetails && elementNameToKey && elementKeyToFullName) {
        elementNames.forEach(elName => {
            const key = elementNameToKey[elName]; const score = scores[key];
            if (typeof score === 'number') { const label = Utils.getScoreLabel(score); const interpretation = elementDetails[elName]?.scoreInterpretations?.[label] || "N/A"; html += `<p><strong>${elementDetails[elName]?.name || elName} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`; }
            else { html += `<p><strong>${elementDetails[elName]?.name || elName}:</strong> Score not available.</p>`; }
        });
    } else { html += "<p>Error: Element details not loaded.</p>"; }
    html += '</div><hr><h3>Focused Tapestry</h3><div class="summary-section">';

    if (focused.size > 0) {
        html += `<p><em>${narrative || "No narrative generated."}</em></p>`;
        html += '<strong>Focused Concepts:</strong><ul>';
        const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => { const name = discovered.get(id)?.concept?.name || `ID ${id}`; html += `<li>${name}</li>`; });
        html += '</ul>';
        if (themes.length > 0) { html += '<strong>Dominant Themes:</strong><ul>'; themes.slice(0, 3).forEach(theme => { html += `<li>${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})</li>`; }); html += '</ul>'; }
        else { html += '<strong>Dominant Themes:</strong><p>No strong themes detected.</p>'; }
    } else { html += '<p>No concepts are currently focused.</p>'; }
    html += '</div>';
    summaryContentDiv.innerHTML = html;
} // <<< Added missing brace here


// --- Study Screen UI ---
export function displayStudyScreenContent() {
    console.log("UI: Displaying Study Screen Content");
    updateInsightDisplays();
    displayDailyRituals();
    applyOnboardingPhaseUI(State.getOnboardingPhase());
}

export function displayResearchButtons() {
    if (!researchButtonContainer) return;
    researchButtonContainer.innerHTML = '';
    const insight = State.getInsight(); const attunement = State.getAttunement();

    if (freeResearchButton) {
        const available = State.isFreeResearchAvailable();
        const showFreeResearch = available && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
        freeResearchButton.classList.toggle('hidden', !showFreeResearch);
        freeResearchButton.disabled = !available;
        freeResearchButton.textContent = available ? "Perform Daily Meditation (Free Research)" : "Daily Meditation Performed";
        if (!available && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
             freeResearchButton.classList.remove('hidden');
        }
    }

    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const currentAttunement = attunement[key] || 0;
        let currentCost = Config.BASE_RESEARCH_COST;
        if (currentAttunement > 80) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 5);
        else if (currentAttunement > 50) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 3);
        const canAfford = insight >= currentCost; const fullName = elementDetails[elName]?.name || elName;
        const button = document.createElement('button'); button.classList.add('button', 'research-button');
        button.dataset.elementKey = key; button.dataset.cost = currentCost; button.disabled = !canAfford;
        button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`;
        button.innerHTML = `<span class="research-el-icon" style="color: ${Utils.getElementColor(elName)};"><i class="${Utils.getElementIcon(fullName)}"></i></span><span class="research-el-name">${fullName}</span><span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span>`;
        researchButtonContainer.appendChild(button);
    });

    // Ensure seekGuidanceButton exists before accessing properties
    const guidanceBtn = document.getElementById('seekGuidanceButton'); // Re-get reference just in case
    if (guidanceBtn) guidanceBtn.disabled = insight < Config.GUIDED_REFLECTION_COST;
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
}


export function displayDailyRituals() {
     if (!dailyRitualsDisplay) return; dailyRitualsDisplay.innerHTML = '';
     const completed = State.getState().completedRituals.daily || {}; const focused = State.getFocusedConcepts();
     let activeRituals = [...dailyRituals];
     if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFocused = true; for (const id of reqIds) { if (!focused.has(id)) { allFocused = false; break; } } if (allFocused) activeRituals.push({ ...ritual, isFocusRitual: true }); }); }
     if(State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) { dailyRitualsDisplay.innerHTML = '<li>Unlock rituals by progressing.</li>'; return; }
     if (activeRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No daily rituals currently active.</li>'; return; }
     activeRituals.forEach(ritual => {
         const completedData = completed[ritual.id] || { completed: false, progress: 0 }; const isCompleted = completedData.completed;
         const li = document.createElement('li'); li.classList.toggle('completed', isCompleted); if(ritual.isFocusRitual) li.classList.add('focus-ritual');
         let rewardText = '';
         if (ritual.reward) {
             if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`;
             else if (ritual.reward.type === 'attunement') { const elName = ritual.reward.element === 'All' ? 'All' : (elementKeyToFullName[ritual.reward.element] || ritual.reward.element); rewardText = `(+${ritual.reward.amount} ${elName} Attun.)`; }
             else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`;
         }
         li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`;
         dailyRitualsDisplay.appendChild(li);
     });
}
export function displayResearchStatus(message) { if (researchStatus) researchStatus.textContent = message; }
export function displayResearchResults(results) {
    if (!researchOutput) return; const { concepts: foundConcepts, repositoryItems, duplicateInsightGain } = results;
    if (foundConcepts.length > 0 || repositoryItems.length > 0) { const placeholder = researchOutput.querySelector('p > i'); if(placeholder && placeholder.parentElement.children.length === 1) placeholder.parentElement.innerHTML = ''; }
    if (duplicateInsightGain > 0) { const dupeMsg = document.createElement('p'); dupeMsg.classList.add('duplicate-message'); dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate research echoes.`; researchOutput.prepend(dupeMsg); setTimeout(() => dupeMsg.remove(), 5000); }
    foundConcepts.forEach(concept => {
        if (!researchOutput.querySelector(`.research-result-item[data-concept-id="${concept.id}"]`)) {
            const resultItemDiv = document.createElement('div'); resultItemDiv.classList.add('research-result-item'); resultItemDiv.dataset.conceptId = concept.id;
            const cardElement = renderCard(concept, 'research-output'); resultItemDiv.appendChild(cardElement);
            const actionDiv = document.createElement('div'); actionDiv.classList.add('research-actions');
            const addButton = document.createElement('button'); addButton.textContent = "Add to Grimoire"; addButton.classList.add('button', 'small-button', 'research-action-button', 'add-button'); addButton.dataset.conceptId = concept.id;
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            const sellButton = document.createElement('button'); sellButton.textContent = `Sell (${sellValue.toFixed(1)}) `; sellButton.innerHTML += `<i class="fas fa-brain insight-icon"></i>`; sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button'); sellButton.dataset.conceptId = concept.id; sellButton.dataset.context = 'research'; sellButton.title = `Sell for ${sellValue.toFixed(1)} Insight.`;
            actionDiv.appendChild(addButton); actionDiv.appendChild(sellButton);
            resultItemDiv.appendChild(actionDiv); researchOutput.appendChild(resultItemDiv);
        }
    });
    repositoryItems.forEach(item => {
         if (researchOutput.querySelector(`[data-repo-id="${item.id}"]`)) return;
         const itemDiv = document.createElement('div'); itemDiv.classList.add('repository-item-discovery'); itemDiv.dataset.repoId = item.id;
         let iconClass = 'fa-question-circle'; let typeName = 'Item';
         if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; }
         else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; }
         itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered the '${item.name}'. View it in the Repository.`}</p>`;
         researchOutput.prepend(itemDiv); setTimeout(() => itemDiv.remove(), 7000);
    });
    if (researchOutput.children.length === 0) { researchOutput.innerHTML = '<p><i>Familiar thoughts echo...</i></p>'; }
}
export function updateResearchButtonAfterAction(conceptId, action) {
    const itemDiv = researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`); if (!itemDiv) return;
    if (action === 'add' || action === 'sell') { itemDiv.remove(); if (researchOutput && researchOutput.children.length === 0) { researchOutput.innerHTML = '<p><i>Research results cleared.</i></p>'; if (action === 'sell') { displayResearchStatus("Ready for new research."); } } }
}

// --- Grimoire Screen UI ---
export function updateGrimoireCounter() { if (grimoireCountSpan) grimoireCountSpan.textContent = State.getDiscoveredConcepts().size; }
export function populateGrimoireFilters() {
    if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); }
    if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = fullName; option.textContent = name; grimoireElementFilter.appendChild(option); }); }
}
export function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All", searchTerm = "", filterFocus = "All") {
    if (!grimoireContentDiv) return; grimoireContentDiv.innerHTML = '';
    const discoveredMap = State.getDiscoveredConcepts(); if (discoveredMap.size === 0) { grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty...</p>'; return; }
    const userScores = State.getScores();
    const focusedSet = State.getFocusedConcepts();

    let discoveredArray = Array.from(discoveredMap.values());
    if (filterElement !== "All" && typeof elementNameToKey === 'undefined') { console.error("UI Error: elementNameToKey map unavailable."); return; }

    const searchTermLower = searchTerm.toLowerCase().trim();

    const conceptsToDisplay = discoveredArray.filter(data => {
        if (!data?.concept) return false; const concept = data.concept;
        const typeMatch = (filterType === "All") || (concept.cardType === filterType);
        const elementKey = (filterElement !== "All" && elementNameToKey) ? elementNameToKey[filterElement] : "All";
        if (filterElement !== "All" && !elementKey) { console.warn(`UI: Could not find key for filterElement '${filterElement}'.`); }
        const elementMatch = (elementKey === "All") || (concept.primaryElement === elementKey);
        const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);
        const focusMatch = (filterFocus === 'All') ||
                           (filterFocus === 'Focused' && focusedSet.has(concept.id)) ||
                           (filterFocus === 'Not Focused' && !focusedSet.has(concept.id));
        const searchMatch = !searchTermLower ||
                           (concept.name.toLowerCase().includes(searchTermLower)) ||
                           (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTermLower)));

        return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch;
    });

    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
    conceptsToDisplay.sort((a, b) => {
        if (!a.concept || !b.concept) return 0;
        switch (sortBy) {
            case 'name': return a.concept.name.localeCompare(b.concept.name);
            case 'type': return (cardTypeKeys.indexOf(a.concept.cardType) - cardTypeKeys.indexOf(b.concept.cardType)) || a.concept.name.localeCompare(b.concept.name);
            case 'rarity': return (rarityOrder[a.concept.rarity] || 0) - (rarityOrder[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name);
            case 'resonance':
                 const distA = Utils.euclideanDistance(userScores, a.concept.elementScores);
                 const distB = Utils.euclideanDistance(userScores, b.concept.elementScores);
                 return distA - distB || a.concept.name.localeCompare(b.concept.name);
            default: return (a.discoveredTime || 0) - (b.discoveredTime || 0) || a.concept.name.localeCompare(b.concept.name);
        }
    });

    if (conceptsToDisplay.length === 0) {
        grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters${searchTermLower ? ' or search term' : ''}.</p>`;
    }
    else {
        conceptsToDisplay.forEach(data => {
            const cardElement = renderCard(data.concept, 'grimoire');
            if (cardElement) {
                cardElement.addEventListener('mouseover', (event) => {
                    const currentCard = event.currentTarget;
                    const conceptId = parseInt(currentCard.dataset.conceptId);
                    const conceptData = State.getDiscoveredConceptData(conceptId)?.concept;
                    if (!conceptData || !conceptData.relatedIds) return;
                    currentCard.classList.add('hover-highlight');
                    const allCards = grimoireContentDiv.querySelectorAll('.concept-card');
                    allCards.forEach(card => {
                        const cardId = parseInt(card.dataset.conceptId);
                        if (conceptData.relatedIds.includes(cardId) && card !== currentCard) {
                            card.classList.add('related-highlight');
                        }
                    });
                });
                cardElement.addEventListener('mouseout', (event) => {
                    const currentCard = event.currentTarget;
                    currentCard.classList.remove('hover-highlight');
                    const allCards = grimoireContentDiv.querySelectorAll('.concept-card');
                    allCards.forEach(card => card.classList.remove('related-highlight'));
                });
                grimoireContentDiv.appendChild(cardElement);
            }
        });
    }
}

export function refreshGrimoireDisplay() {
     if (grimoireScreen && !grimoireScreen.classList.contains('hidden')) {
         const typeValue = grimoireTypeFilter?.value || "All";
         const elementValue = grimoireElementFilter?.value || "All";
         const sortValue = grimoireSortOrder?.value || "discovered";
         const rarityValue = grimoireRarityFilter?.value || "All";
         const searchValue = grimoireSearchInput?.value || "";
         const focusValue = grimoireFocusFilter?.value || "All";
         displayGrimoire(typeValue, elementValue, sortValue, rarityValue, searchValue, focusValue);
     }
}

// --- Card Rendering (Cleaned) ---
export function renderCard(concept, context = 'grimoire') {
    if (!concept || typeof concept.id === 'undefined') {
        console.warn("renderCard invalid concept:", concept);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = "Error rendering card";
        errorDiv.style.color = 'red'; errorDiv.style.padding = '10px'; errorDiv.style.border = '1px solid red';
        return errorDiv;
    }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `View Details: ${concept.name}`;

    const discoveredData = State.getDiscoveredConceptData(concept.id);
    const isDiscovered = !!discoveredData;
    const isFocused = State.getFocusedConcepts().has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false;
    const phaseAllowsFocus = isDiscovered && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const phaseAllowsSell = isDiscovered && context === 'grimoire' && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;

    const focusStampHTML = isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const cardTypeIcon = Utils.getCardTypeIcon(concept.cardType);

    let affinitiesHTML = '';
    if (concept.elementScores && elementKeyToFullName) {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
            const level = Utils.getAffinityLevel(score);
            if (level && elementKeyToFullName[key]) {
                const fullName = elementKeyToFullName[key]; const color = Utils.getElementColor(fullName); const iconClass = Utils.getElementIcon(fullName); const elementNameDetail = elementDetails[fullName]?.name || fullName;
                affinitiesHTML += `<span class="affinity affinity-${level.toLowerCase()}" style="border-color: ${color}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="${elementNameDetail} Affinity: ${level} (${score.toFixed(1)})"><i class="${iconClass}" style="color: ${color};"></i></span> `;
            }
        });
    }

    let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder";
    if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; }
    else if (concept.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; }
    const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;

    // Action Buttons
    let actionButtonsHTML = '<div class="card-actions">';
    if (phaseAllowsSell) {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        actionButtonsHTML += `<button class="button tiny-button secondary-button sell-button card-sell-button" data-concept-id="${concept.id}" data-context="grimoire" title="Sell (${sellValue.toFixed(1)} Insight)"><i class="fas fa-dollar-sign"></i></button>`;
    }
    if (phaseAllowsFocus) {
        const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
        const buttonClass = isFocused ? 'marked' : '';
        const buttonIcon = isFocused ? 'fa-star' : 'fa-regular fa-star';
        const buttonTitle = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove Focus' : 'Mark as Focus');
        actionButtonsHTML += `<button class="button tiny-button card-focus-button ${buttonClass}" data-concept-id="${concept.id}" title="${buttonTitle}" ${slotsFull ? 'disabled' : ''}><i class="fas ${buttonIcon}"></i></button>`;
    }
    actionButtonsHTML += '</div>';

    // Assemble Card HTML
    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${focusStampHTML}</span>
        </div>
        <div class="card-visual">
            ${visualContent}
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
            ${actionButtonsHTML}
        </div>`;

    // Add main click listener for popup (excluding action button clicks)
    if (context !== 'no-click') {
        cardDiv.addEventListener('click', (event) => {
            if (event.target.closest('.card-actions button')) {
                console.log("Card action button clicked, preventing popup.");
                return;
            }
             console.log("Card body clicked, showing popup for ID:", concept.id);
            showConceptDetailPopup(concept.id);
        });
    }

    if (context === 'research-output') {
        cardDiv.title = `Click to view details (Not in Grimoire)`;
        cardDiv.querySelector('.card-actions')?.remove(); // No actions on research cards
    }

    return cardDiv;
}


// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData) { console.error("Concept data missing:", conceptId); return; }
    const discoveredData = State.getDiscoveredConceptData(conceptId); const inGrimoire = !!discoveredData;
    const inResearchNotes = !inGrimoire && researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
    const currentPhase = State.getOnboardingPhase();
    GameLogic.setCurrentPopupConcept(conceptId);

    if (popupConceptName) popupConceptName.textContent = conceptData.name;
    if (popupConceptType) popupConceptType.textContent = conceptData.cardType;
    if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;
    if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No description.";

    const artUnlocked = discoveredData?.artUnlocked || false;
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = '';
        let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder";
        if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; }
        else if (conceptData.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; }
        const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;
        popupVisualContainer.innerHTML = visualContent;
    }

    const scores = State.getScores(); const distance = Utils.euclideanDistance(scores, conceptData.elementScores);
    displayPopupResonance(distance); displayPopupRecipeComparison(conceptData, scores); displayPopupRelatedConcepts(conceptData);

    const showNotes = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    if (myNotesSection && myNotesTextarea && saveMyNoteButton) {
        myNotesSection.classList.toggle('hidden', !showNotes);
        if (showNotes) { myNotesTextarea.value = discoveredData.notes || ""; if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; }
    }
    const showEvolution = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
    if (popupEvolutionSection) {
        popupEvolutionSection.classList.toggle('hidden', !showEvolution);
        if (showEvolution) displayEvolutionSection(conceptData, discoveredData);
    }

    updateGrimoireButtonStatus(conceptId, !!inResearchNotes);
    updateFocusButtonStatus(conceptId); // Still used for the popup's focus button
    updatePopupSellButton(conceptId, conceptData, inGrimoire, !!inResearchNotes);

    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}
export function displayPopupResonance(distance) {
    if (!popupResonanceSummary) return; let resonanceLabel, resonanceClass, message;
    if (distance === Infinity || isNaN(distance)) { resonanceLabel = "N/A"; resonanceClass = ""; message = "(Cannot compare)"; }
    else if (distance < 2.5) { resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strongly aligns."; }
    else if (distance < 4.0) { resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares common ground."; }
    else if (distance < 6.0) { resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities."; }
    else if (distance <= Config.DISSONANCE_THRESHOLD) { resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence."; }
    else { resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significant divergence."; }
    popupResonanceSummary.innerHTML = `Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> <small>(Dist: ${distance.toFixed(1)})</small><br><small>${message}</small> <i class="fas fa-info-circle info-icon" title="How closely this Concept's elemental scores align with your Core Foundation scores. High resonance suggests strong alignment, Dissonant suggests significant divergence."></i>`;
}
export function displayPopupRecipeComparison(conceptData, userCompScores) {
     if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return;
     popupConceptProfile.innerHTML = ''; popupUserComparisonProfile.innerHTML = ''; popupComparisonHighlights.innerHTML = '';
     let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>'; let hasHighlights = false; const conceptScores = conceptData.elementScores || {};
     elementNames.forEach(elName => {
         const key = elementNameToKey[elName]; const fullName = elementKeyToFullName[key]; if (!fullName) return;
         const conceptScore = conceptScores[key]; const userScore = userCompScores[key];
         const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore); const userScoreValid = typeof userScore === 'number' && !isNaN(userScore);
         const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?'; const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';
         const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A'; const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A';
         const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0; const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0;
         const color = Utils.getElementColor(fullName); const elementNameShort = elementDetails[fullName]?.name.substring(0, 11) || elName;
         popupConceptProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${conceptDisplay}</span> <div class="score-bar-container" title="${conceptLabel}"><div style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`;
         popupUserComparisonProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${userDisplay}</span> <div class="score-bar-container" title="${userLabel}"><div style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`;
         if (conceptScoreValid && userScoreValid) {
             const diff = Math.abs(conceptScore - userScore); const elementNameDisplay = elementDetails[fullName]?.name || elName;
             if (conceptScore >= 7 && userScore >= 7) { highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true; }
             else if (conceptScore <= 3 && userScore <= 3) { highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true; }
             else if (diff >= 4) { highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept: ${conceptLabel}, You: ${userLabel})</p>`; hasHighlights = true; }
         }
     });
     if (!hasHighlights) highlightsHTML += '<p><em>No strong alignments or
// --- Persona Screen UI ---
export function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona element details div not found!"); return; }
    console.log("UI: Displaying Persona Screen");
    personaElementDetailsDiv.innerHTML = '';
    const scores = State.getScores();
    const showDeepDiveContainer = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;

    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName];
        const score = (typeof scores[key] === 'number' && !isNaN(scores[key])) ? scores[key] : 5.0;
        const scoreLabel = Utils.getScoreLabel(score);
        const elementData = elementDetails[elementName] || {};
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A";
        const barWidth = score ? (score / 10) * 100 : 0;
        const color = Utils.getElementColor(elementName);
        const iconClass = Utils.getElementIcon(elementName);

        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        details.dataset.elementKey = key;
        details.style.setProperty('--element-color', color);

        const deepDiveContainer = document.createElement('div');
        deepDiveContainer.classList.add('element-deep-dive-container');
        deepDiveContainer.dataset.elementKey = key;
        deepDiveContainer.classList.toggle('hidden', !showDeepDiveContainer);

        // Build innerHTML string - Corrected comments
        details.innerHTML = `
            <summary class="element-detail-header">
                 <div>
                    <i class="${iconClass} element-icon-indicator" style="color: ${color};" title="${elementData.name || elementName}"></i>
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

        const descriptionDiv = details.querySelector('.element-description');
        if (descriptionDiv) {
            descriptionDiv.appendChild(deepDiveContainer); // Append container structure
        }

        personaElementDetailsDiv.appendChild(details);

        if (showDeepDiveContainer) {
            displayElementDeepDive(key, deepDiveContainer); // Populate the container
        }
    });

    displayElementAttunement();
    updateInsightDisplays();
    displayFocusedConceptsPersona();
    generateTapestryNarrative();
    synthesizeAndDisplayThemesPersona();
    displayPersonaSummary();
    applyOnboardingPhaseUI(State.getOnboardingPhase());
    updateTapestryDeepDiveButton();
    updateSuggestSceneButtonState();
}


export function displayElementAttunement() {
    if (!personaElementDetailsDiv || personaElementDetailsDiv.children.length === 0) return;
    const attunement = State.getAttunement();
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const attunementValue = attunement[key] || 0; const percentage = (attunementValue / Config.MAX_ATTUNEMENT) * 100; const color = Utils.getElementColor(elName);
        const targetDetails = personaElementDetailsDiv.querySelector(`.element-detail-entry[data-element-key="${key}"]`);
        if (targetDetails) {
            let descriptionDiv = targetDetails.querySelector('.element-description');
            if (descriptionDiv) {
                const deepDiveContainer = descriptionDiv.querySelector('.element-deep-dive-container');
                descriptionDiv.querySelector('.attunement-display')?.remove();
                descriptionDiv.querySelector('.attunement-hr')?.remove();

                const hr = document.createElement('hr'); hr.className = 'attunement-hr';
                const attunementDiv = document.createElement('div'); attunementDiv.classList.add('attunement-display');
                attunementDiv.innerHTML = `<div class="attunement-item"><span class="attunement-name">Attunement:</span><div class="attunement-bar-container" title="Current Attunement: ${attunementValue.toFixed(1)} / ${Config.MAX_ATTUNEMENT}"><div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div></div><i class="fas fa-info-circle info-icon" title="Attunement reflects your affinity and experience with this Element. It grows through related actions like Research, Reflection, and focusing on relevant Concepts. High Attunement may unlock Experiments or reduce Research costs."></i></div>`;

                if (deepDiveContainer) {
                     descriptionDiv.insertBefore(hr, deepDiveContainer);
                     descriptionDiv.insertBefore(attunementDiv, deepDiveContainer);
                } else {
                     descriptionDiv.appendChild(hr);
                     descriptionDiv.appendChild(attunementDiv);
                }
            }
        }
    });
}
export function updateFocusSlotsDisplay() {
    const focused = State.getFocusedConcepts(); const totalSlots = State.getFocusSlots();
    if (focusedConceptsHeader) { focusedConceptsHeader.textContent = `Focused Concepts (${focused.size} / ${totalSlots})`; const icon = focusedConceptsHeader.querySelector('.info-icon'); if(icon) icon.title = `The number of Concepts currently marked as Focus out of your total available slots (${totalSlots}). Slots can be increased via Milestones.`; }
}
export function displayFocusedConceptsPersona() {
    if (!focusedConceptsDisplay) return; focusedConceptsDisplay.innerHTML = ''; updateFocusSlotsDisplay();
    const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts();
    if (focused.size === 0) { focusedConceptsDisplay.innerHTML = `<li class="focus-placeholder">Focus Concepts from your Grimoire</li>`; return; }
    focused.forEach(conceptId => {
        const conceptData = discovered.get(conceptId);
        if (conceptData?.concept) {
            const concept = conceptData.concept;
            const item = document.createElement('div'); item.classList.add('focus-concept-item'); item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`;

            let iconClass = Utils.getCardTypeIcon(concept.cardType);
            let iconColor = '#b8860b';
            if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) {
                const fullElementName = elementKeyToFullName[concept.primaryElement];
                iconClass = Utils.getElementIcon(fullElementName);
                iconColor = Utils.getElementColor(fullElementName);
            } else { console.warn(`Concept ${concept.name} missing valid primaryElement for focus icon.`); }

            item.innerHTML = `<i class="${iconClass}" style="color: ${iconColor};"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`;

            item.addEventListener('click', () => showConceptDetailPopup(concept.id));
            focusedConceptsDisplay.appendChild(item);
        } else { console.warn(`Focused concept ID ${conceptId} not found.`); const item = document.createElement('div'); item.classList.add('focus-concept-item', 'missing'); item.textContent = `Error: ID ${conceptId}`; focusedConceptsDisplay.appendChild(item); }
    });
    updateSuggestSceneButtonState();
}

export function generateTapestryNarrative() {
     if (!tapestryNarrativeP) return;
     const narrative = GameLogic.calculateTapestryNarrative();
     tapestryNarrativeP.innerHTML = narrative || 'Mark concepts as "Focus" to generate narrative...';
     console.log("UI: Updated Detailed View Tapestry Narrative paragraph.");
}
export function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return; personaThemesList.innerHTML = '';
     const themes = GameLogic.calculateFocusThemes(); // Get sorted themes {key, name, count}

     if (themes.length === 0) {
         personaThemesList.innerHTML = `<li>${State.getFocusedConcepts().size > 0 ? 'Focus is currently balanced.' : 'Mark Focused Concepts...'}</li>`;
         return;
     }

     // Display only the top theme
     const topTheme = themes[0];
     const li = document.createElement('li');
     // Customize message based on how dominant it is
     let emphasis = "Strongly";
     if (themes.length > 1 && topTheme.count <= themes[1].count + 1) { // If close to second theme
         emphasis = "Primarily";
     } else if (topTheme.count < 3) { // If only 1 or 2 concepts contribute
         emphasis = "Leaning towards";
     }
     li.textContent = `${emphasis} focused on ${topTheme.name}`;
     li.style.borderLeft = `3px solid ${Utils.getElementColor(elementKeyToFullName[topTheme.key])}`; // Add color indicator
     li.style.paddingLeft = '8px';
     personaThemesList.appendChild(li);

     // Optionally, add a note if balanced despite a top theme
     if (themes.length > 1 && topTheme.count <= themes[1].count + 1) {
         const balanceLi = document.createElement('li');
         balanceLi.innerHTML = `<small>(with other influences present)</small>`;
         balanceLi.style.fontSize = '0.85em';
         balanceLi.style.color = '#666';
         balanceLi.style.paddingLeft = '20px'; // Indent slightly
         personaThemesList.appendChild(balanceLi);
     }
} // <<< Added missing brace here previously

export function displayPersonaSummary() {
    if (!summaryContentDiv) return;
    summaryContentDiv.innerHTML = '<p>Generating summary...</p>';
    const scores = State.getScores(); const focused = State.getFocusedConcepts();
    const narrative = GameLogic.calculateTapestryNarrative();
    const themes = GameLogic.calculateFocusThemes();

    let html = '<h3>Core Essence</h3><div class="summary-section">';
    if (elementDetails && elementNameToKey && elementKeyToFullName) {
        elementNames.forEach(elName => {
            const key = elementNameToKey[elName]; const score = scores[key];
            if (typeof score === 'number') { const label = Utils.getScoreLabel(score); const interpretation = elementDetails[elName]?.scoreInterpretations?.[label] || "N/A"; html += `<p><strong>${elementDetails[elName]?.name || elName} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`; }
            else { html += `<p><strong>${elementDetails[elName]?.name || elName}:</strong> Score not available.</p>`; }
        });
    } else { html += "<p>Error: Element details not loaded.</p>"; }
    html += '</div><hr><h3>Focused Tapestry</h3><div class="summary-section">';

    if (focused.size > 0) {
        html += `<p><em>${narrative || "No narrative generated."}</em></p>`;
        html += '<strong>Focused Concepts:</strong><ul>';
        const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => { const name = discovered.get(id)?.concept?.name || `ID ${id}`; html += `<li>${name}</li>`; });
        html += '</ul>';
        // Use themes calculated above
        if (themes.length > 0) {
            html += '<strong>Dominant Themes:</strong><ul>';
            // Show only top theme as per synthesizeAndDisplayThemesPersona logic
             const topTheme = themes[0];
             let emphasis = "Strongly";
             if (themes.length > 1 && topTheme.count <= themes[1].count + 1) emphasis = "Primarily";
             else if (topTheme.count < 3) emphasis = "Leaning towards";
             html += `<li>${emphasis} focused on ${topTheme.name}</li>`;
             if (themes.length > 1 && topTheme.count <= themes[1].count + 1) {
                html += `<li style="font-size: 0.85em; color: #666; list-style: none; margin-left: -10px;"><small>(with other influences present)</small></li>`;
             }
            html += '</ul>';
        } else {
             html += '<strong>Dominant Themes:</strong><p>Focus is currently balanced.</p>';
        }
    } else { html += '<p>No concepts are currently focused.</p>'; }
    html += '</div>';
    summaryContentDiv.innerHTML = html;
} // <<< Added missing brace here previously


// --- Study Screen UI ---
export function displayStudyScreenContent() {
    console.log("UI: Displaying Study Screen Content");
    updateInsightDisplays();
    displayDailyRituals();
    applyOnboardingPhaseUI(State.getOnboardingPhase());
}

export function displayResearchButtons() {
    if (!researchButtonContainer) return;
    researchButtonContainer.innerHTML = '';
    const insight = State.getInsight(); const attunement = State.getAttunement();

    if (freeResearchButton) {
        const available = State.isFreeResearchAvailable();
        // Show button only if Phase 2+ reached
        const showFreeResearchButtonOverall = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
        freeResearchButton.classList.toggle('hidden', !showFreeResearchButtonOverall);
        if(showFreeResearchButtonOverall) {
            freeResearchButton.disabled = !available;
            freeResearchButton.textContent = available ? "Perform Daily Meditation (Free Research)" : "Daily Meditation Performed";
        }
    }

    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const currentAttunement = attunement[key] || 0;
        let currentCost = Config.BASE_RESEARCH_COST;
        if (currentAttunement > 80) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 5);
        else if (currentAttunement > 50) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 3);
        const canAfford = insight >= currentCost; const fullName = elementDetails[elName]?.name || elName;
        const button = document.createElement('button'); button.classList.add('button', 'research-button');
        button.dataset.elementKey = key; button.dataset.cost = currentCost; button.disabled = !canAfford;
        button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`;
        button.innerHTML = `<span class="research-el-icon" style="color: ${Utils.getElementColor(elName)};"><i class="${Utils.getElementIcon(fullName)}"></i></span><span class="research-el-name">${fullName}</span><span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span>`;
        researchButtonContainer.appendChild(button);
    });

    // Ensure seekGuidanceButton exists before accessing properties (though it moved)
    const guidanceBtn = document.getElementById('seekGuidanceButton');
    if (guidanceBtn) guidanceBtn.disabled = insight < Config.GUIDED_REFLECTION_COST;
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
}


export function displayDailyRituals() {
     if (!dailyRitualsDisplay) return; dailyRitualsDisplay.innerHTML = '';
     const completed = State.getState().completedRituals.daily || {}; const focused = State.getFocusedConcepts();
     let activeRituals = [...dailyRituals];
     if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFocused = true; for (const id of reqIds) { if (!focused.has(id)) { allFocused = false; break; } } if (allFocused) activeRituals.push({ ...ritual, isFocusRitual: true }); }); }
     if(State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) { dailyRitualsDisplay.innerHTML = '<li>Unlock rituals by progressing.</li>'; return; }
     if (activeRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No daily rituals currently active.</li>'; return; }
     activeRituals.forEach(ritual => {
         const completedData = completed[ritual.id] || { completed: false, progress: 0 }; const isCompleted = completedData.completed;
         const li = document.createElement('li'); li.classList.toggle('completed', isCompleted); if(ritual.isFocusRitual) li.classList.add('focus-ritual');
         let rewardText = '';
         if (ritual.reward) {
             if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`;
             else if (ritual.reward.type === 'attunement') { const elName = ritual.reward.element === 'All' ? 'All' : (elementKeyToFullName[ritual.reward.element] || ritual.reward.element); rewardText = `(+${ritual.reward.amount} ${elName} Attun.)`; }
             else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`;
         }
         li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`;
         dailyRitualsDisplay.appendChild(li);
     });
}
export function displayResearchStatus(message) { if (researchStatus) researchStatus.textContent = message; }
export function displayResearchResults(results) {
    if (!researchOutput) return; const { concepts: foundConcepts, repositoryItems, duplicateInsightGain } = results;
    if (foundConcepts.length > 0 || repositoryItems.length > 0) { const placeholder = researchOutput.querySelector('p > i'); if(placeholder && placeholder.parentElement.children.length === 1) placeholder.parentElement.innerHTML = ''; }
    if (duplicateInsightGain > 0) { const dupeMsg = document.createElement('p'); dupeMsg.classList.add('duplicate-message'); dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate research echoes.`; researchOutput.prepend(dupeMsg); setTimeout(() => dupeMsg.remove(), 5000); }
    foundConcepts.forEach(concept => {
        if (!researchOutput.querySelector(`.research-result-item[data-concept-id="${concept.id}"]`)) {
            const resultItemDiv = document.createElement('div'); resultItemDiv.classList.add('research-result-item'); resultItemDiv.dataset.conceptId = concept.id;
            const cardElement = renderCard(concept, 'research-output'); resultItemDiv.appendChild(cardElement);
            const actionDiv = document.createElement('div'); actionDiv.classList.add('research-actions');
            const addButton = document.createElement('button'); addButton.textContent = "Add to Grimoire"; addButton.classList.add('button', 'small-button', 'research-action-button', 'add-button'); addButton.dataset.conceptId = concept.id;
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            const sellButton = document.createElement('button'); sellButton.textContent = `Sell (${sellValue.toFixed(1)}) `; sellButton.innerHTML += `<i class="fas fa-brain insight-icon"></i>`; sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button'); sellButton.dataset.conceptId = concept.id; sellButton.dataset.context = 'research'; sellButton.title = `Sell for ${sellValue.toFixed(1)} Insight.`;
            actionDiv.appendChild(addButton); actionDiv.appendChild(sellButton);
            resultItemDiv.appendChild(actionDiv); researchOutput.appendChild(resultItemDiv);
        }
    });
    repositoryItems.forEach(item => {
         if (researchOutput.querySelector(`[data-repo-id="${item.id}"]`)) return;
         const itemDiv = document.createElement('div'); itemDiv.classList.add('repository-item-discovery'); itemDiv.dataset.repoId = item.id;
         let iconClass = 'fa-question-circle'; let typeName = 'Item';
         if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; }
         else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; }
         itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered the '${item.name}'. View it in the Repository.`}</p>`;
         researchOutput.prepend(itemDiv); setTimeout(() => itemDiv.remove(), 7000);
    });
    if (researchOutput.children.length === 0) { researchOutput.innerHTML = '<p><i>Familiar thoughts echo...</i></p>'; }
}
export function updateResearchButtonAfterAction(conceptId, action) {
    const itemDiv = researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`); if (!itemDiv) return;
    if (action === 'add' || action === 'sell') { itemDiv.remove(); if (researchOutput && researchOutput.children.length === 0) { researchOutput.innerHTML = '<p><i>Research results cleared.</i></p>'; if (action === 'sell') { displayResearchStatus("Ready for new research."); } } }
}

// --- Grimoire Screen UI ---
export function updateGrimoireCounter() { if (grimoireCountSpan) grimoireCountSpan.textContent = State.getDiscoveredConcepts().size; }
export function populateGrimoireFilters() {
    if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); }
    if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = fullName; option.textContent = name; grimoireElementFilter.appendChild(option); }); }
}
export function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All", searchTerm = "", filterFocus = "All") {
    if (!grimoireContentDiv) return; grimoireContentDiv.innerHTML = '';
    const discoveredMap = State.getDiscoveredConcepts(); if (discoveredMap.size === 0) { grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty...</p>'; return; }
    const userScores = State.getScores();
    const focusedSet = State.getFocusedConcepts();

    let discoveredArray = Array.from(discoveredMap.values());
    if (filterElement !== "All" && typeof elementNameToKey === 'undefined') { console.error("UI Error: elementNameToKey map unavailable."); return; }

    const searchTermLower = searchTerm.toLowerCase().trim();

    const conceptsToDisplay = discoveredArray.filter(data => {
        if (!data?.concept) return false; const concept = data.concept;
        const typeMatch = (filterType === "All") || (concept.cardType === filterType);
        const elementKey = (filterElement !== "All" && elementNameToKey) ? elementNameToKey[filterElement] : "All";
        if (filterElement !== "All" && !elementKey) { console.warn(`UI: Could not find key for filterElement '${filterElement}'.`); }
        const elementMatch = (elementKey === "All") || (concept.primaryElement === elementKey);
        const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);
        const focusMatch = (filterFocus === 'All') ||
                           (filterFocus === 'Focused' && focusedSet.has(concept.id)) ||
                           (filterFocus === 'Not Focused' && !focusedSet.has(concept.id));
        const searchMatch = !searchTermLower ||
                           (concept.name.toLowerCase().includes(searchTermLower)) ||
                           (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTermLower)));

        return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch;
    });

    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
    conceptsToDisplay.sort((a, b) => {
        if (!a.concept || !b.concept) return 0;
        switch (sortBy) {
            case 'name': return a.concept.name.localeCompare(b.concept.name);
            case 'type': return (cardTypeKeys.indexOf(a.concept.cardType) - cardTypeKeys.indexOf(b.concept.cardType)) || a.concept.name.localeCompare(b.concept.name);
            case 'rarity': return (rarityOrder[a.concept.rarity] || 0) - (rarityOrder[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name);
            case 'resonance':
                 const distA = Utils.euclideanDistance(userScores, a.concept.elementScores);
                 const distB = Utils.euclideanDistance(userScores, b.concept.elementScores);
                 return distA - distB || a.concept.name.localeCompare(b.concept.name);
            default: return (a.discoveredTime || 0) - (b.discoveredTime || 0) || a.concept.name.localeCompare(b.concept.name);
        }
    });

    if (conceptsToDisplay.length === 0) {
        grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters${searchTermLower ? ' or search term' : ''}.</p>`;
    }
    else {
        conceptsToDisplay.forEach(data => {
            const cardElement = renderCard(data.concept, 'grimoire');
            if (cardElement) {
                cardElement.addEventListener('mouseover', (event) => {
                    const currentCard = event.currentTarget;
                    const conceptId = parseInt(currentCard.dataset.conceptId);
                    const conceptData = State.getDiscoveredConceptData(conceptId)?.concept;
                    if (!conceptData || !conceptData.relatedIds) return;
                    currentCard.classList.add('hover-highlight');
                    const allCards = grimoireContentDiv.querySelectorAll('.concept-card');
                    allCards.forEach(card => {
                        const cardId = parseInt(card.dataset.conceptId);
                        if (conceptData.relatedIds.includes(cardId) && card !== currentCard) {
                            card.classList.add('related-highlight');
                        }
                    });
                });
                cardElement.addEventListener('mouseout', (event) => {
                    const currentCard = event.currentTarget;
                    currentCard.classList.remove('hover-highlight');
                    const allCards = grimoireContentDiv.querySelectorAll('.concept-card');
                    allCards.forEach(card => card.classList.remove('related-highlight'));
                });
                grimoireContentDiv.appendChild(cardElement);
            }
        });
    }
}

export function refreshGrimoireDisplay() {
     if (grimoireScreen && !grimoireScreen.classList.contains('hidden')) {
         const typeValue = grimoireTypeFilter?.value || "All";
         const elementValue = grimoireElementFilter?.value || "All";
         const sortValue = grimoireSortOrder?.value || "discovered";
         const rarityValue = grimoireRarityFilter?.value || "All";
         const searchValue = grimoireSearchInput?.value || "";
         const focusValue = grimoireFocusFilter?.value || "All";
         displayGrimoire(typeValue, elementValue, sortValue, rarityValue, searchValue, focusValue);
     }
}

// --- Card Rendering (Cleaned) ---
export function renderCard(concept, context = 'grimoire') {
    if (!concept || typeof concept.id === 'undefined') {
        console.warn("renderCard invalid concept:", concept);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = "Error rendering card";
        errorDiv.style.color = 'red'; errorDiv.style.padding = '10px'; errorDiv.style.border = '1px solid red';
        return errorDiv;
    }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `View Details: ${concept.name}`;

    const discoveredData = State.getDiscoveredConceptData(concept.id);
    const isDiscovered = !!discoveredData;
    const isFocused = State.getFocusedConcepts().has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false;
    const phaseAllowsFocus = isDiscovered && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const phaseAllowsSell = isDiscovered && context === 'grimoire' && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;

    const focusStampHTML = isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const cardTypeIcon = Utils.getCardTypeIcon(concept.cardType);

    let affinitiesHTML = '';
    if (concept.elementScores && elementKeyToFullName) {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
            const level = Utils.getAffinityLevel(score);
            if (level && elementKeyToFullName[key]) {
                const fullName = elementKeyToFullName[key]; const color = Utils.getElementColor(fullName); const iconClass = Utils.getElementIcon(fullName); const elementNameDetail = elementDetails[fullName]?.name || fullName;
                affinitiesHTML += `<span class="affinity affinity-${level.toLowerCase()}" style="border-color: ${color}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="${elementNameDetail} Affinity: ${level} (${score.toFixed(1)})"><i class="${iconClass}" style="color: ${color};"></i></span> `;
            }
        });
    }

    let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder";
    if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; }
    else if (concept.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; }
    const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;

    // Action Buttons
    let actionButtonsHTML = '<div class="card-actions">';
    if (phaseAllowsSell) {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        actionButtonsHTML += `<button class="button tiny-button secondary-button sell-button card-sell-button" data-concept-id="${concept.id}" data-context="grimoire" title="Sell (${sellValue.toFixed(1)} Insight)"><i class="fas fa-dollar-sign"></i></button>`;
    }
    if (phaseAllowsFocus) {
        const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
        const buttonClass = isFocused ? 'marked' : '';
        const buttonIcon = isFocused ? 'fa-star' : 'fa-regular fa-star';
        const buttonTitle = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove Focus' : 'Mark as Focus');
        actionButtonsHTML += `<button class="button tiny-button card-focus-button ${buttonClass}" data-concept-id="${concept.id}" title="${buttonTitle}" ${slotsFull ? 'disabled' : ''}><i class="fas ${buttonIcon}"></i></button>`;
    }
    actionButtonsHTML += '</div>';

    // Assemble Card HTML
    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${focusStampHTML}</span>
        </div>
        <div class="card-visual">
            ${visualContent}
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
            ${actionButtonsHTML}
        </div>`;

    // Add main click listener for popup (excluding action button clicks)
    if (context !== 'no-click') {
        cardDiv.addEventListener('click', (event) => {
            if (event.target.closest('.card-actions button')) {
                // console.log("Card action button clicked, preventing popup."); // Keep for debugging if needed
                return;
            }
             // console.log("Card body clicked, showing popup for ID:", concept.id); // Keep for debugging if needed
            showConceptDetailPopup(concept.id);
        });
    }

    if (context === 'research-output') {
        cardDiv.title = `Click to view details (Not in Grimoire)`;
        cardDiv.querySelector('.card-actions')?.remove(); // No actions on research cards
    }

    return cardDiv;
}


// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData) { console.error("Concept data missing:", conceptId); return; }
    const discoveredData = State.getDiscoveredConceptData(conceptId); const inGrimoire = !!discoveredData;
    const inResearchNotes = !inGrimoire && researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
    const currentPhase = State.getOnboardingPhase();
    GameLogic.setCurrentPopupConcept(conceptId);

    if (popupConceptName) popupConceptName.textContent = conceptData.name;
    if (popupConceptType) popupConceptType.textContent = conceptData.cardType;
    if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;
    if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No description.";

    const artUnlocked = discoveredData?.artUnlocked || false;
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = '';
        let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder";
        if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; }
        else if (conceptData.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; }
        const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;
        popupVisualContainer.innerHTML = visualContent;
    }

    const scores = State.getScores(); const distance = Utils.euclideanDistance(scores, conceptData.elementScores);
    displayPopupResonance(distance); displayPopupRecipeComparison(conceptData, scores); displayPopupRelatedConcepts(conceptData);

    const showNotes = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    if (myNotesSection && myNotesTextarea && saveMyNoteButton) {
        myNotesSection.classList.toggle('hidden', !showNotes);
        if (showNotes) { myNotesTextarea.value = discoveredData.notes || ""; if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; }
    }
    const showEvolution = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
    if (popupEvolutionSection) {
        popupEvolutionSection.classList.toggle('hidden', !showEvolution);
        if (showEvolution) displayEvolutionSection(conceptData, discoveredData);
    }

    updateGrimoireButtonStatus(conceptId, !!inResearchNotes);
    updateFocusButtonStatus(conceptId); // Still used for the popup's focus button
    updatePopupSellButton(conceptId, conceptData, inGrimoire, !!inResearchNotes);

    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}
export function displayPopupResonance(distance) {
    if (!popupResonanceSummary) return; let resonanceLabel, resonanceClass, message;
    if (distance === Infinity || isNaN(distance)) { resonanceLabel = "N/A"; resonanceClass = ""; message = "(Cannot compare)"; }
    else if (distance < 2.5) { resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strongly aligns."; }
    else if (distance < 4.0) { resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares common ground."; }
    else if (distance < 6.0) { resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities."; }
    else if (distance <= Config.DISSONANCE_THRESHOLD) { resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence."; }
    else { resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significant divergence."; }
    popupResonanceSummary.innerHTML = `Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> <small>(Dist: ${distance.toFixed(1)})</small><br><small>${message}</small> <i class="fas fa-info-circle info-icon" title="How closely this Concept's elemental scores align with your Core Foundation scores. High resonance suggests strong alignment, Dissonant suggests significant divergence."></i>`;
}
export function displayPopupRecipeComparison(conceptData, userCompScores) {
     // Ensure necessary elements exist before proceeding
     if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) {
        console.error("Popup comparison elements not found.");
        return; // Exit if elements are missing
     }

     // Clear previous content
     popupConceptProfile.innerHTML = '';
     popupUserComparisonProfile.innerHTML = '';
     popupComparisonHighlights.innerHTML = '';

     let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>';
     let hasHighlights = false;
     const conceptScores = conceptData.elementScores || {}; // Use empty object if scores missing

     // Iterate through defined element names to ensure order and completeness
     elementNames.forEach(elName => {
         const key = elementNameToKey[elName]; // Get the key ('A', 'I', etc.)
         const fullName = elementKeyToFullName[key]; // Get the full name back if needed for details

         // Exit loop iteration if key/name mapping fails (shouldn't happen with good data)
         if (!key || !fullName) {
            console.warn(`Missing key or full name for element: ${elName}`);
            return; // continue to next element in forEach
         }

         const conceptScore = conceptScores[key];
         const userScore = userCompScores[key]; // Assumes userCompScores uses the same keys ('A', 'I', etc.)

         // Validate scores are numbers
         const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore);
         const userScoreValid = typeof userScore === 'number' && !isNaN(userScore);

         // Prepare display values (use '?' for invalid scores)
         const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?';
         const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';

         // Get descriptive labels
         const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A';
         const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A';

         // Calculate bar widths (0% for invalid scores)
         const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0;
         const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0;

         // Get element color and potentially shortened name for display
         const color = Utils.getElementColor(fullName); // Use full name for color lookup
         const elementNameDisplay = elementDetails[fullName]?.name || elName; // Use defined name or fallback
         const elementNameShort = elementNameDisplay.substring(0, 11); // Shorten if needed

         // Append HTML for Concept's profile column
         popupConceptProfile.innerHTML += `
            <div>
                <strong>${elementNameShort}:</strong>
                <span>${conceptDisplay}</span>
                <div class="score-bar-container" title="${conceptLabel} (${conceptDisplay})">
                    <div style="width: ${conceptBarWidth}%; background-color: ${color};"></div>
                </div>
            </div>`;

         // Append HTML for User's profile column
         popupUserComparisonProfile.innerHTML += `
            <div>
                <strong>${elementNameShort}:</strong>
                <span>${userDisplay}</span>
                <div class="score-bar-container" title="${userLabel} (${userDisplay})">
                    <div style="width: ${userBarWidth}%; background-color: ${color};"></div>
                </div>
            </div>`;

         // Generate comparison highlights if both scores are valid
         if (conceptScoreValid && userScoreValid) {
             const diff = Math.abs(conceptScore - userScore);

             if (conceptScore >= 7 && userScore >= 7) { // Strong alignment (both high)
                 highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`;
                 hasHighlights = true;
             } else if (conceptScore <= 3 && userScore <= 3) { // Shared low emphasis
                 highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`;
                 hasHighlights = true;
             } else if (diff >= 4) { // Notable difference
                 highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept: ${conceptLabel}, You: ${userLabel})</p>`;
                 hasHighlights = true;
             }
             // Optionally add moderate alignment/difference checks here if desired
             // else if (diff <= 1.5) { ... moderate alignment ... }
         }
     }); // End of forEach elementNames

     // Add fallback message if no significant highlights found
     if (!hasHighlights) {
         highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>';
     }

     // Set the highlights HTML
     popupComparisonHighlights.innerHTML = highlightsHTML;
}
export function displayPopupRelatedConcepts(conceptData) {
     if (!popupRelatedConcepts) return; popupRelatedConcepts.innerHTML = '';
     if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
         const details = document.createElement('details'); details.classList.add('related-concepts-details');
         const summary = document.createElement('summary'); summary.innerHTML = `Synergies / Related (${conceptData.relatedIds.length}) <i class="fas fa-info-circle info-icon" title="Concepts with thematic/functional relationships. Focusing synergistic concepts may unlock content."></i>`; details.appendChild(summary);
         const listDiv = document.createElement('div'); listDiv.classList.add('related-concepts-list-dropdown'); let foundCount = 0;
         conceptData.relatedIds.forEach(relatedId => {
             const relatedConcept = concepts.find(c => c.id === relatedId);
             if (relatedConcept) { const span = document.createElement('span'); span.textContent = relatedConcept.name; span.classList.add('related-concept-item'); span.title = `Related: ${relatedConcept.name}`; listDiv.appendChild(span); foundCount++; }
             else { console.warn(`Related concept ID ${relatedId} in ${conceptData.id} not found.`); }
         });
         if (foundCount > 0) { details.appendChild(listDiv); popupRelatedConcepts.appendChild(details); }
         else { popupRelatedConcepts.innerHTML = `<details class="related-concepts-details"><summary>Synergies / Related <i class="fas fa-info-circle info-icon" title="..."></i></summary><p>Error: Related concepts not found.</p></details>`; }
     } else { popupRelatedConcepts.innerHTML = `<details class="related-concepts-details"><summary>Synergies / Related <i class="fas fa-info-circle info-icon" title="..."></i></summary><p>None specified.</p></details>`; }
}
export function displayEvolutionSection(conceptData, discoveredData) {
     if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return;
     const isDiscovered = !!discoveredData; const canUnlockArt = conceptData.canUnlockArt; const alreadyUnlocked = discoveredData?.artUnlocked || false;
     const isFocused = State.getFocusedConcepts().has(conceptData.id); const hasReflected = State.getState().seenPrompts.size > 0; const hasEnoughInsight = State.getInsight() >= Config.ART_EVOLVE_COST; const currentPhase = State.getOnboardingPhase();
     const showSection = isDiscovered && canUnlockArt && !alreadyUnlocked && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
     popupEvolutionSection.classList.toggle('hidden', !showSection);
     if (!showSection) { evolveArtButton.disabled = true; evolveEligibility.classList.add('hidden'); return; }
     evolveCostSpan.textContent = `${Config.ART_EVOLVE_COST}`;
     let eligibilityText = ''; let canEvolve = true;
     if (!isFocused) { eligibilityText += '<li>Requires: Mark as Focus</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Focused</li>'; }
     if (!hasReflected) { eligibilityText += '<li>Requires: Engage in Reflection</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Reflected</li>'; }
     if (!hasEnoughInsight) { eligibilityText += `<li>Requires: ${Config.ART_EVOLVE_COST} Insight</li>`; canEvolve = false;} else { eligibilityText += `<li><i class="fas fa-check"></i> Insight OK</li>`; }
     evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`; evolveEligibility.classList.remove('hidden');
     evolveArtButton.disabled = !canEvolve;
}
export function updateGrimoireButtonStatus(conceptId, inResearchNotes = false) {
    if (!addToGrimoireButton) return; const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    addToGrimoireButton.classList.toggle('hidden', isDiscovered);
    addToGrimoireButton.disabled = false; // Ensure it's enabled if shown
    addToGrimoireButton.textContent = "Add to Grimoire";
    addToGrimoireButton.classList.remove('added');
}
export function updateFocusButtonStatus(conceptId) {
    if (!markAsFocusButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
    const phaseAllowsFocus = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const showButton = isDiscovered && phaseAllowsFocus;
    markAsFocusButton.classList.toggle('hidden', !showButton);
    if (showButton) {
        markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus";
        markAsFocusButton.disabled = (slotsFull && !isFocused);
        markAsFocusButton.classList.toggle('marked', isFocused);
        markAsFocusButton.title = markAsFocusButton.disabled && !isFocused ? `Focus slots full (${State.getFocusSlots()})` : (isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts");
    }
}
export function updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes) {
    const popupActions = conceptDetailPopup?.querySelector('.popup-actions'); if (!popupActions || !conceptData) return;
    popupActions.querySelector('.popup-sell-button')?.remove();
    const context = inGrimoire ? 'grimoire' : (inResearchNotes ? 'research' : 'none');
    const phaseAllowsSell = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    if (context !== 'none' && phaseAllowsSell) {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[conceptData.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        const sourceLocation = context === 'grimoire' ? 'Grimoire' : 'Research Notes';
        const sellButton = document.createElement('button');
        sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button', 'popup-sell-button');
        sellButton.textContent = `Sell (${sellValue.toFixed(1)})`;
        sellButton.innerHTML += ` <i class="fas fa-brain insight-icon"></i>`;
        sellButton.dataset.conceptId = conceptId;
        sellButton.dataset.context = context;
        sellButton.title = `Sell from ${sourceLocation} for ${sellValue.toFixed(1)} Insight.`;
        // Logic to place button relative to others
        const focusBtn = popupActions.querySelector('#markAsFocusButton');
        const addBtn = popupActions.querySelector('#addToGrimoireButton');
        if (focusBtn && !focusBtn.classList.contains('hidden')) { focusBtn.insertAdjacentElement('afterend', sellButton); }
        else if (addBtn && !addBtn.classList.contains('hidden')) { addBtn.insertAdjacentElement('afterend', sellButton); }
        else { popupActions.appendChild(sellButton); } // Fallback: append at the end
    }
}

// --- Reflection Modal UI ---
export function displayReflectionPrompt(promptData, context) {
    if (!reflectionModal || !promptData || !promptData.prompt) {
         console.error("Reflection modal or prompt data/text missing.", promptData);
         if (context === 'Dissonance') {
             const conceptId = GameLogic.getCurrentPopupConceptId();
             if (conceptId) { console.warn("Reflection prompt missing for Dissonance, adding concept directly."); GameLogic.addConceptToGrimoireInternal(conceptId, false); hidePopups(); showTemporaryMessage("Reflection unavailable, concept added.", 3500); }
             else { showTemporaryMessage("Error: Could not display reflection.", 3000); }
         } else { showTemporaryMessage("Error: Could not display reflection.", 3000); }
         return;
    }
    const { title, category, prompt, showNudge, reward } = promptData;
    if (reflectionModalTitle) reflectionModalTitle.textContent = title || "Moment for Reflection";
    if (reflectionElement) reflectionElement.textContent = category || "General";
    if (reflectionPromptText) reflectionPromptText.textContent = prompt.text;
    if (reflectionCheckbox) reflectionCheckbox.checked = false;
    if (scoreNudgeCheckbox && scoreNudgeLabel) { scoreNudgeCheckbox.checked = false; scoreNudgeCheckbox.classList.toggle('hidden', !showNudge); scoreNudgeLabel.classList.toggle('hidden', !showNudge); }
    if (confirmReflectionButton) confirmReflectionButton.disabled = true;
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)}`;
    reflectionModal.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Integrated Element Deep Dive UI ---
export function displayElementDeepDive(elementKey, targetContainerElement) {
     if (!targetContainerElement) {
         console.warn(`UI: Target container not provided for displayElementDeepDive (${elementKey})`);
         targetContainerElement = personaElementDetailsDiv?.querySelector(`.element-deep-dive-container[data-element-key="${elementKey}"]`);
         if (!targetContainerElement) {
             console.error(`UI: Could not find target container for element ${elementKey}`);
             return;
         }
     }

     const deepDiveData = elementDeepDive[elementKey] || [];
     const unlockedLevels = State.getState().unlockedDeepDiveLevels;
     const currentLevel = unlockedLevels[elementKey] || 0;
     const elementName = elementKeyToFullName[elementKey] || elementKey;
     const insight = State.getInsight();
     const showUnlockButton = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED; // Gate button by phase

     targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${elementDetails[elementName]?.name || elementName} Insights</h5>`;

     // Show container based on earlier phase (already handled by parent caller)
     if (deepDiveData.length === 0) { targetContainerElement.innerHTML += '<p>No deep dive content available.</p>'; return; }

     let displayedContent = false;
     deepDiveData.forEach(levelData => {
         if (levelData.level <= currentLevel) {
             targetContainerElement.innerHTML += `<div class="library-level"><h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5><div class="level-content">${levelData.content}</div></div><hr class="popup-hr">`;
             displayedContent = true;
         }
     });

     if (!displayedContent && currentLevel === 0) {
         targetContainerElement.innerHTML += '<p><i>Unlock the first level to begin exploring.</i></p>';
     } else if (!displayedContent && currentLevel > 0) {
          targetContainerElement.innerHTML += '<p><i>Error displaying content.</i></p>';
     }


     const nextLevel = currentLevel + 1;
     const nextLevelData = deepDiveData.find(l => l.level === nextLevel);

     if (nextLevelData && showUnlockButton) {
         const cost = nextLevelData.insightCost || 0;
         const canAfford = insight >= cost;
         targetContainerElement.innerHTML += `
             <div class="library-unlock">
                 <h5>Next: ${nextLevelData.title} (Level ${nextLevelData.level})</h5>
                 <button class="button small-button unlock-button"
                         data-element-key="${elementKey}"
                         data-level="${nextLevelData.level}"
                         ${!canAfford ? 'disabled' : ''}
                         title="${!canAfford ? `Requires ${cost} Insight` : `Unlock for ${cost} Insight`}">
                     Unlock (${cost} <i class="fas fa-brain insight-icon"></i>)
                 </button>
                 ${!canAfford ? `<p class='unlock-error'>Insufficient Insight (${insight.toFixed(1)}/${cost})</p>` : ''}
             </div>`;
     } else if (nextLevelData && !showUnlockButton) {
         targetContainerElement.innerHTML += `<div class="library-unlock"><p><i>Further insights available later.</i></p></div>`;
     } else if (displayedContent && !nextLevelData) {
         targetContainerElement.innerHTML += '<p class="all-unlocked-message"><i>All insights unlocked for this element.</i></p>';
     }
}


// --- Repository UI ---
export function displayRepositoryContent() {
     const showRepository = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;
     if (repositoryScreen) repositoryScreen.classList.toggle('hidden', !showRepository); // Use hidden directly
     if(!showRepository) return;

     if (!repositoryFocusUnlocksDiv || !repositoryScenesDiv || !repositoryExperimentsDiv || !repositoryInsightsDiv) { console.error("Repo list containers missing!"); return; }
     console.log("UI: Displaying Repository Content");
     repositoryFocusUnlocksDiv.innerHTML = ''; repositoryScenesDiv.innerHTML = ''; repositoryExperimentsDiv.innerHTML = ''; repositoryInsightsDiv.innerHTML = '';
     const repoItems = State.getRepositoryItems(); const unlockedFocusData = State.getUnlockedFocusItems(); const attunement = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();

     // Display Focus-Driven Unlocks (Seems ok)
     if (unlockedFocusData.size > 0) { unlockedFocusData.forEach(unlockId => { const unlockData = focusDrivenUnlocks.find(u => u.id === unlockId); if (unlockData?.unlocks) { const item = unlockData.unlocks; const div = document.createElement('div'); div.classList.add('repository-item', 'focus-unlock-item'); let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`; if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`; if (item.type === 'insightFragment') { const iData = elementalInsights.find(i => i.id === item.id); itemHTML += `<p><em>"${iData?.text || item.text || "..."}"</em></p>`; } else itemHTML += `<p>Details below.</p>`; div.innerHTML = itemHTML; repositoryFocusUnlocksDiv.appendChild(div); } }); }
     else { repositoryFocusUnlocksDiv.innerHTML = '<p>Focus synergistic Concepts to unlock items.</p>'; }

     // Display Scene Blueprints (Seems ok)
     if (repoItems.scenes.size > 0) { repoItems.scenes.forEach(sceneId => { const scene = sceneBlueprints.find(s => s.id === sceneId); if (scene) { const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST; const canAfford = insight >= cost; repositoryScenesDiv.appendChild(renderRepositoryItem(scene, 'scene', cost, canAfford)); } else { console.warn(`Scene ID ${sceneId} not found.`); } }); }
     else { repositoryScenesDiv.innerHTML = '<p>No Scene Blueprints discovered.</p>'; }

     // Display Alchemical Experiments (Seems ok)
     let experimentsDisplayed = 0;
     alchemicalExperiments.forEach(exp => {
         const isUnlockedByAttunement = attunement[exp.requiredElement] >= exp.requiredAttunement; const alreadyCompleted = repoItems.experiments.has(exp.id);
         if (isUnlockedByAttunement) {
             let canAttempt = true; let unmetReqs = [];
             if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } }
             if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let met = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { met = true; break; } } if (!met) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } }
             const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST; const canAfford = insight >= cost; if (!canAfford) unmetReqs.push("Insight");
             repositoryExperimentsDiv.appendChild(renderRepositoryItem(exp, 'experiment', cost, canAfford && canAttempt && !alreadyCompleted, alreadyCompleted, unmetReqs)); experimentsDisplayed++;
         }
     });
     if (experimentsDisplayed === 0) { repositoryExperimentsDiv.innerHTML = '<p>Increase Attunement to unlock Experiments.</p>'; }

     // Display Elemental Insights (CHECK THIS AREA - Around Line 1068)
    if (repoItems.insights.size > 0) {
         const insightsByElement = {};
         // Initialize structure to hold insights grouped by element
         elementNames.forEach(elName => {
            const key = elementNameToKey[elName];
            if (key) { insightsByElement[key] = []; }
         });

         // Populate the structure
         repoItems.insights.forEach(insightId => {
            const insight = elementalInsights.find(i => i.id === insightId);
            if (insight && insightsByElement[insight.element]) {
                 insightsByElement[insight.element].push(insight);
            } else if (insight) {
                 console.warn(`Insight ${insightId} has unknown element key: ${insight.element}`);
            } else {
                 console.warn(`Insight ID ${insightId} not found in elementalInsights data.`);
            }
         });

         let insightsHTML = ''; // Use this variable name consistently
         // Loop through the organized insights
         for (const key in insightsByElement) {
             if (insightsByElement[key].length > 0) {
                 const fullElementName = elementKeyToFullName[key];
                 const elementNameDisplay = elementDetails[fullElementName]?.name || key;

                 // Build heading separately for clarity
                 insightsHTML += `<h5>${elementNameDisplay} Insights:</h5>`;

                 // Start list
                 insightsHTML += `<ul>`;

                 // Sort and add list items
                 insightsByElement[key].sort((a, b) => a.id.localeCompare(b.id)).forEach(insight => {
                     // Ensure text is properly handled (escape if needed, but likely fine in li)
                     // Use template literal for consistency, although simple concatenation is okay here.
                     insightsHTML += `<li>"${insight.text}"</li>`;
                 });

                 // Close list
                 insightsHTML += `</ul>`;
             }
         } // End for...in loop

         // Set innerHTML only once after building the string
         repositoryInsightsDiv.innerHTML = insightsHTML || '<p>No Elemental Insights collected yet.</p>';

     } else { // If no insights discovered at all
         repositoryInsightsDiv.innerHTML = '<p>No Elemental Insights collected.</p>';
     }
export function renderRepositoryItem(item, type, cost, canAfford, completed = false, unmetReqs = []) {
     const div = document.createElement('div'); div.classList.add('repository-item', `repo-item-${type}`); if (completed) div.classList.add('completed');
     let actionsHTML = '';
     let buttonDisabled = (type === 'experiment') ? (!canAfford || completed || unmetReqs.length > 0) : !canAfford;
     let buttonTitle = ''; let buttonText = '';
     if (type === 'scene') {
         buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (!canAfford) buttonTitle = `Requires ${cost} Insight`;
         actionsHTML = `<button class="button small-button" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
     } else if (type === 'experiment') {
         buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (completed) buttonTitle = "Completed";
         else if (unmetReqs.length > 0 && unmetReqs[0] === "Insight") buttonTitle = `Requires ${cost} Insight`; else if (unmetReqs.length > 0) buttonTitle = `Requires: ${unmetReqs.join(', ')}`; else if (!canAfford) buttonTitle = `Requires ${cost} Insight`;
         actionsHTML = `<button class="button small-button" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
         if (completed) actionsHTML += ` <span class="completed-text">(Completed)</span>`; else if (unmetReqs.length > 0 && unmetReqs[0] === "Insight") actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`; else if (unmetReqs.length > 0) actionsHTML += ` <small class="req-missing">(Requires: ${unmetReqs.join(', ')})</small>`;
     }
     div.innerHTML = `<h4>${item.name} ${type === 'experiment' ? `(Req: ${item.requiredAttunement} ${elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4><p>${item.description}</p><div class="repo-actions">${actionsHTML}</div>`;
     return div;
 }

// --- Milestones UI ---
export function displayMilestones() {
    if (!milestonesDisplay) return; milestonesDisplay.innerHTML = '';
    const achieved = State.getState().achievedMilestones;
    if (achieved.size === 0) { milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>'; return; }
    const sortedAchievedIds = milestones.filter(m => achieved.has(m.id)).map(m => m.id); // Use defined order
    sortedAchievedIds.forEach(milestoneId => { const milestone = milestones.find(m => m.id === milestoneId); if (milestone) { const li = document.createElement('li'); li.textContent = `✓ ${milestone.description}`; milestonesDisplay.appendChild(li); } });
}

// --- Settings Popup UI ---
export function showSettings() {
    if (settingsPopup) settingsPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Tapestry Deep Dive UI ---
export function displayTapestryDeepDive(analysisData) {
    if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveNarrativeP) { console.error("Deep Dive Modal elements missing!"); showTemporaryMessage("Error opening Deep Dive.", 3000); return; }
    console.log("UI: displayTapestryDeepDive called with analysis:", analysisData);
    deepDiveNarrativeP.innerHTML = analysisData.fullNarrativeHTML || "Could not generate narrative.";
    if (deepDiveFocusIcons) {
        deepDiveFocusIcons.innerHTML = '';
        const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => {
            const concept = discovered.get(id)?.concept;
            if (concept) {
                let iconClass = Utils.getElementIcon("Default"); let iconColor = '#CCCCCC'; let iconTitle = concept.name;
                if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) {
                    const fullElementName = elementKeyToFullName[concept.primaryElement];
                    iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); iconTitle = `${concept.name} (${elementDetails[fullElementName]?.name || fullElementName})`;
                } else { iconClass = Utils.getCardTypeIcon(concept.cardType); }
                const icon = document.createElement('i'); icon.className = `${iconClass}`; icon.style.color = iconColor; icon.title = iconTitle;
                deepDiveFocusIcons.appendChild(icon);
            }
        });
    }
    if (deepDiveDetailContent) { deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>'; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active')); }
    updateContemplationButtonState();
    tapestryDeepDiveModal.classList.remove('hidden'); popupOverlay.classList.remove('hidden');
}
export function updateContemplationButtonState() {
    if (!contemplationNodeButton) return;
    const cooldownEnd = State.getContemplationCooldownEnd(); const now = Date.now(); const insight = State.getInsight(); const cost = Config.CONTEMPLATION_COST;
    let disabled = false; let title = `Contemplate your focus (${cost} Insight)`; let text = `Contemplate (${cost} <i class="fas fa-brain insight-icon"></i>)`;
    if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); disabled = true; title = `Contemplation available in ${remaining}s`; text = `On Cooldown (${remaining}s)`; }
    else if (insight < cost) { disabled = true; title = `Requires ${cost} Insight`; }
    contemplationNodeButton.disabled = disabled; contemplationNodeButton.title = title; contemplationNodeButton.innerHTML = text;
}
export function updateDeepDiveContent(htmlContent, nodeId) {
    if (!deepDiveDetailContent) return; console.log(`UI: Updating deep dive content for node: ${nodeId}`);
    deepDiveDetailContent.innerHTML = htmlContent;
    deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.toggle('active', btn.dataset.nodeId === nodeId); });
}
export function displayContemplationTask(task) {
    if (!deepDiveDetailContent) return; console.log("UI: Displaying contemplation task:", task);
    let html = `<h4>Contemplation Task</h4><p>${task.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`; // Render bold text
    if (task.requiresCompletionButton) { html += `<button id="completeContemplationBtn" class="button small-button">Mark Complete (+${task.reward.amount} ${task.reward.type === 'insight' ? '<i class="fas fa-brain insight-icon"></i>' : 'Attun.'})</button>`; }
    deepDiveDetailContent.innerHTML = html;
    const completeBtn = document.getElementById('completeContemplationBtn');
    if (completeBtn) { completeBtn.addEventListener('click', () => { GameLogic.handleCompleteContemplation(task); }, { once: true }); }
    deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.toggle('active', btn.id === 'contemplationNode'); });
}
export function clearContemplationTask() {
     if (deepDiveDetailContent) {
         deepDiveDetailContent.innerHTML = '<p>Contemplation acknowledged.</p>';
         setTimeout(() => {
             if (deepDiveDetailContent && deepDiveDetailContent.innerHTML === '<p>Contemplation acknowledged.</p>') {
                 deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>';
                 deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active'));
             }
         }, 1500);
     }
     updateContemplationButtonState();
}
export function updateTapestryDeepDiveButton() {
    const btn = document.getElementById('exploreTapestryButton');
    if (btn) {
        const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
        const hasFocus = State.getFocusedConcepts().size > 0;
        btn.classList.toggle('hidden', !isPhaseReady); // Use regular hidden, not flow
        btn.disabled = !isPhaseReady || !hasFocus;
        btn.title = !isPhaseReady ? "Unlock later..." : (!hasFocus ? "Focus on concepts..." : "Explore a deeper analysis...");
    } else { console.warn("UI: updateTapestryDeepDiveButton - Button not found!"); }
}

// --- Suggest Scene Button UI ---
export function updateSuggestSceneButtonState() {
    const suggestBtn = document.getElementById('suggestSceneButton'); // Renamed variable
    if (!suggestBtn) return;
    const hasFocus = State.getFocusedConcepts().size > 0;
    const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST;
    const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const costDisplay = document.getElementById('sceneSuggestCostDisplay');

    suggestBtn.classList.toggle('hidden', !isPhaseReady); // Use regular hidden

    if (isPhaseReady) {
        suggestBtn.disabled = !hasFocus || !canAfford;
        if (!hasFocus) { suggestBtn.title = "Focus on concepts first"; }
        else if (!canAfford) { suggestBtn.title = `Requires ${Config.SCENE_SUGGESTION_COST} Insight`; }
        else { suggestBtn.title = `Suggest resonant scenes (${Config.SCENE_SUGGESTION_COST} Insight)`; }
        if(costDisplay) costDisplay.textContent = Config.SCENE_SUGGESTION_COST;
    } else {
        suggestBtn.disabled = true;
        suggestBtn.title = "Unlock later";
        if(costDisplay) costDisplay.textContent = Config.SCENE_SUGGESTION_COST;
    }
}

// --- Initial UI Setup Helper ---
export function setupInitialUI() {
    console.log("UI: Setting up initial UI state...");
    applyOnboardingPhaseUI(Config.ONBOARDING_PHASE.START);
    if(mainNavBar) mainNavBar.classList.add('hidden');
    showScreen('welcomeScreen');

    const loadBtn = document.getElementById('loadButton');
    if (loadBtn) {
        loadBtn.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY));
    } else {
        console.warn("Load button element not found during initial setup.");
    }
    updateSuggestSceneButtonState();
    updateTapestryDeepDiveButton();
}

// --- Task Notification UI ---
let taskNotificationTimeout = null; // Moved timeout ID here

export function showTaskNotification(message) {
    const taskArea = document.getElementById('taskNotificationArea'); // Get elements inside function
    const taskText = document.getElementById('taskNotificationText');
    if (!taskArea || !taskText) return;
    console.log("Showing task notification:", message);
    taskText.textContent = message;
    taskArea.classList.remove('hidden');
    if (taskNotificationTimeout) clearTimeout(taskNotificationTimeout);
    // Auto-hide example (optional)
    // taskNotificationTimeout = setTimeout(hideTaskNotification, 15000);
}

export function hideTaskNotification() {
    const taskArea = document.getElementById('taskNotificationArea');
    if (taskArea) taskArea.classList.add('hidden');
    if (taskNotificationTimeout) clearTimeout(taskNotificationTimeout);
    taskNotificationTimeout = null;
}

// Add listener for dismiss button - This should ideally be in main.js attachEventListeners
// but adding here for completeness of this file's review
const taskDismissBtn = document.getElementById('taskDismissButton');
if (taskDismissBtn) {
    taskDismissBtn.addEventListener('click', hideTaskNotification);
} else {
    console.warn("Task Dismiss Button not found for listener attachment in ui.js.");
}


console.log("ui.js loaded.");
