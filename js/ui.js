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
const suggestSceneButton = document.getElementById('suggestSceneButton');
const tapestryDeepDiveModal = document.getElementById('tapestryDeepDiveModal');
const closeDeepDiveButton = document.getElementById('closeDeepDiveButton');
const deepDiveFocusIcons = document.getElementById('deepDiveFocusIcons');
const deepDiveNarrativeP = document.getElementById('deepDiveNarrative');
const deepDiveAnalysisNodes = document.getElementById('deepDiveAnalysisNodes');
const deepDiveDetailContent = document.getElementById('deepDiveDetailContent');
const contemplationNodeButton = document.getElementById('contemplationNode');
// New Results Modal Refs
const experimentResultsModal = document.getElementById('experimentResultsModal');
const resultsScoresDisplay = document.getElementById('resultsScoresDisplay');
const resultsInterpretation = document.getElementById('resultsInterpretation');
const resultsStarterHandDisplay = document.getElementById('resultsStarterHandDisplay');
const goToGrimoireButton = document.getElementById('goToGrimoireButton');
const closeResultsModalButton = document.getElementById('closeResultsModalButton');


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
export function showMilestoneAlert(text, milestoneId = null) { // Added milestoneId
    if (!milestoneAlert || !milestoneAlertText) return;

    // --- Add Introduction for Repository/Library ---
    // *** REPLACE THESE WITH YOUR ACTUAL MILESTONE IDs DEFINED IN data.js ***
    const REPOSITORY_UNLOCK_MILESTONE_ID = 'ms73'; // Example: Using 'Repository Explorer' ID
    const LIBRARY_UNLOCK_MILESTONE_ID = 'ms60';    // Example: Using 'Budding Scholar' ID

    if (milestoneId === REPOSITORY_UNLOCK_MILESTONE_ID && State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) {
         showTemporaryMessage("The Repository is now accessible! Find rare items there.", 5000);
         const repoNav = document.querySelector('.nav-button[data-target="repositoryScreen"]');
         // Use dataset target as fallback identifier for highlighting
         if(repoNav) temporaryHighlight(repoNav); // Highlight the nav button itself
    }
    // Add similar logic for Library/Deep Dive if needed
    // if (milestoneId === LIBRARY_UNLOCK_MILESTONE_ID && State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) {
    //      showTemporaryMessage("Element Insights are now available in the Persona screen!", 5000);
    // }
    // --- End Introduction ---

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
    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (settingsPopup) settingsPopup.classList.add('hidden');
    if (tapestryDeepDiveModal) tapestryDeepDiveModal.classList.add('hidden');
    if (experimentResultsModal) experimentResultsModal.classList.add('hidden'); // Hide results modal too
    // Hide overlay only if ALL popups are hidden
    if (popupOverlay && conceptDetailPopup?.classList.contains('hidden') &&
        reflectionModal?.classList.contains('hidden') &&
        settingsPopup?.classList.contains('hidden') &&
        tapestryDeepDiveModal?.classList.contains('hidden') &&
        experimentResultsModal?.classList.contains('hidden'))
    {
        popupOverlay.classList.add('hidden');
    }
    GameLogic.clearPopupState(); // Clear temporary state when any popup closes
}


// --- Onboarding Tutorial Helper ---
let highlightTimeouts = {}; // Use object to manage multiple timeouts
function temporaryHighlight(elementIdOrElement, duration = 3000, highlightClass = 'highlight-feature-onboarding') {
    const element = (typeof elementIdOrElement === 'string') ? document.getElementById(elementIdOrElement) : elementIdOrElement;
    // Try to get an ID even if an element object was passed
    const elementId = element?.id || element?.dataset?.target || `highlight-${Math.random().toString(36).substring(2, 9)}`; // Generate temp ID if needed

    if (!element) {
        console.warn(`Cannot highlight missing element:`, elementIdOrElement);
        return;
    }
     // Assign temporary ID if needed for tracking
     if (!element.id) { element.id = elementId; }

    console.log(`Highlighting: ${elementId}`);
    element.classList.add(highlightClass);

    // Clear any existing timeout for this specific element
    if (highlightTimeouts[elementId]) {
        clearTimeout(highlightTimeouts[elementId]);
    }

    highlightTimeouts[elementId] = setTimeout(() => {
        element.classList.remove(highlightClass);
        delete highlightTimeouts[elementId]; // Remove cleared timeout
        // Remove temporary ID if we added it
        if (elementId.startsWith('highlight-')) {
            element.removeAttribute('id');
        }
    }, duration);
}


// --- Experiment Results Modal ---
export function showExperimentResultsModal(scores, starterHandConcepts) {
    if (!experimentResultsModal || !resultsScoresDisplay || !resultsInterpretation || !resultsStarterHandDisplay) {
        console.error("Results modal elements missing!");
        return;
    }
    console.log("UI: Showing Experiment Results Modal");

    // Populate Scores
    resultsScoresDisplay.innerHTML = '';
    let highestScore = -1;
    let lowestScore = 11;
    let highestElement = '';
    let lowestElement = '';
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const score = scores[key];
        if (typeof score !== 'number' || isNaN(score)) return;
        if (score > highestScore) { highestScore = score; highestElement = elName; }
        if (score < lowestScore) { lowestScore = score; lowestElement = elName; }
        const scoreLabel = Utils.getScoreLabel(score);
        const item = document.createElement('div');
        item.classList.add('results-score-item');
        item.innerHTML = `
            <span class="element-name">${elementDetails[elName]?.name || elName}</span>
            <span class="score-value">${score.toFixed(1)}</span>
            <span class="score-label">(${scoreLabel})</span>
        `;
        resultsScoresDisplay.appendChild(item);
    });

    // Populate Interpretation
    if(resultsInterpretation) resultsInterpretation.textContent = `Your scores suggest a primary resonance with ${elementDetails[highestElement]?.name || highestElement} and perhaps less emphasis on ${elementDetails[lowestElement]?.name || lowestElement}.`;

    // Populate Starter Hand
    resultsStarterHandDisplay.innerHTML = '';
    if (starterHandConcepts && starterHandConcepts.length > 0) {
        starterHandConcepts.forEach(concept => {
            // Render a non-clickable, condensed card
            const cardElement = renderCard(concept, 'no-click'); // Use 'no-click' context
            if(cardElement) resultsStarterHandDisplay.appendChild(cardElement);
        });
    } else {
        resultsStarterHandDisplay.innerHTML = '<p><i>No initial concepts distilled.</i></p>';
    }

    experimentResultsModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
    State.setHasSeenResultsModal(true); // Mark as seen
}

export function hideExperimentResultsModal() {
    if (experimentResultsModal) experimentResultsModal.classList.add('hidden');
    // Keep overlay if other popups might be open, hide if it's the only one
    if (popupOverlay && conceptDetailPopup?.classList.contains('hidden') &&
        reflectionModal?.classList.contains('hidden') &&
        settingsPopup?.classList.contains('hidden') &&
        tapestryDeepDiveModal?.classList.contains('hidden')) {
        popupOverlay.classList.add('hidden');
    }
}


// --- Screen Management & Tutorials ---
export function showScreen(screenId) {
    console.log("UI: Showing screen:", screenId);
    const currentState = State.getState();
    const isPostQuestionnaire = currentState.questionnaireCompleted;

    // --- Tutorial Checks & Triggers ---
    let tutorialTriggered = false;
    if (screenId === 'grimoireScreen' && isPostQuestionnaire && !State.getHasSeenGrimoireTutorial()) {
        triggerGrimoireTutorial();
        tutorialTriggered = true;
    } else if (screenId === 'personaScreen' && isPostQuestionnaire && State.getFocusedConcepts().size > 0 && !State.getHasSeenFocusTutorial()) {
        // Trigger Persona tutorial only if focus concepts exist and tutorial not seen
        triggerPersonaFocusTutorial();
        tutorialTriggered = true;
    } else if (screenId === 'studyScreen' && currentState.onboardingPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT && !State.getHasSeenStudyTutorial()) {
        triggerStudyTutorial();
        tutorialTriggered = true;
    }
    // --- End Tutorial Checks ---

    screens.forEach(screen => {
        screen?.classList.toggle('current', screen.id === screenId);
        screen?.classList.toggle('hidden', screen.id !== screenId);
    });

    // Show/Hide Nav Bar based on whether the *results modal* has been seen (implies questionnaire is complete)
    if (mainNavBar) {
        const showNav = State.getHasSeenResultsModal();
         mainNavBar.classList.toggle('hidden', !showNav || screenId === 'welcomeScreen' || screenId === 'questionnaireScreen');
    }
    navButtons.forEach(button => {
        if(button) {
            button.classList.toggle('active', button.dataset.target === screenId);
            // Assign ID dynamically if needed for highlighting, ensure it's unique
            if (!button.id && button.dataset.target) {
                button.id = `navButton-${button.dataset.target}`;
            }
        }
    });

    // Apply onboarding phase UI AFTER toggling screen visibility
    applyOnboardingPhaseUI(State.getOnboardingPhase());

    // Refresh content for relevant screens *after* tutorials might have run
    if (isPostQuestionnaire) {
        if (screenId === 'personaScreen') GameLogic.displayPersonaScreenLogic(); // Recalculates narrative etc.
        else if (screenId === 'studyScreen') GameLogic.displayStudyScreenLogic();
        else if (screenId === 'grimoireScreen') refreshGrimoireDisplay();
        else if (screenId === 'repositoryScreen') displayRepositoryContent();
    }

    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
}

// --- Onboarding UI Adjustments ---
export function applyOnboardingPhaseUI(phase) {
    console.log(`UI: Applying onboarding phase ${phase}`);
    const isPhase1 = phase >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; // View Persona/Grimoire
    const isPhase2 = phase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT; // Unlock Study
    const isPhase3 = phase >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS; // Unlock Reflection/Rituals
    const isPhase4 = phase >= Config.ONBOARDING_PHASE.ADVANCED; // Unlock Repo/Library

    navButtons.forEach(button => { // Nav Bar
        if (!button) return; const target = button.dataset.target; let hide = false;
        if (target === 'studyScreen' && !isPhase2) hide = true;
        else if (target === 'repositoryScreen' && !isPhase4) hide = true;
        button.classList.toggle('hidden-by-flow', hide);
    });

    // Toggle visibility for Deep Dive sections within Persona details
    const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container');
    deepDiveContainers?.forEach(container => container.classList.toggle('hidden-by-flow', !isPhase4)); // Use flow class

    if (grimoireFilterControls) grimoireFilterControls.classList.toggle('hidden-by-flow', !isPhase2); // Grimoire Filters
    if (seekGuidanceButton) seekGuidanceButton.classList.toggle('hidden-by-flow', !isPhase3); // Study - Guidance
    const ritualsSection = studyScreen?.querySelector('.rituals-alcove'); // Use new class
    if (ritualsSection) ritualsSection.classList.toggle('hidden-by-flow', !isPhase3); // Study - Rituals

    // Update popup elements based on phase
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
         updateFocusButtonStatus(popupConceptId); // Depends on Phase 1/discovery
         const discoveredData = State.getDiscoveredConceptData(popupConceptId);
         const concept = concepts.find(c => c.id === popupConceptId);
         const inResearch = !discoveredData && researchOutput?.querySelector(`.research-result-item[data-concept-id="${popupConceptId}"]`);
         updateGrimoireButtonStatus(popupConceptId, !!inResearch); // Always relevant
         updatePopupSellButton(popupConceptId, concept, !!discoveredData, !!inResearch); // Depends on Phase 2
         if (myNotesSection) myNotesSection.classList.toggle('hidden', !isPhase2 || !discoveredData); // Note: show only if discovered
         if (popupEvolutionSection) popupEvolutionSection.classList.toggle('hidden', !isPhase4 || !discoveredData || !concept?.canUnlockArt || discoveredData?.artUnlocked);
         if(concept && discoveredData) displayEvolutionSection(concept, discoveredData); // Handles internal phase check
    }

    updateTapestryDeepDiveButton(); // Depends on Phase 1/focus
    updateSuggestSceneButtonState(); // Depends on Phase 1/focus/insight
}

// --- Tutorial Trigger Functions ---
function triggerGrimoireTutorial() {
    console.log("UI: Triggering Grimoire Tutorial");
    showTemporaryMessage("Welcome to the Grimoire! These are your first Concepts.", 4000);
    setTimeout(() => {
        showTemporaryMessage("Click a card to learn more...", 3500);
        // Highlight for focus button will appear inside the popup itself
    }, 4100);
    State.setHasSeenGrimoireTutorial(true); // Mark as seen
}

function triggerPersonaFocusTutorial() {
    console.log("UI: Triggering Persona Focus Tutorial");
    temporaryHighlight('focusedConceptsDisplay'); // Highlight the grid area
    showTemporaryMessage("The Concepts you 'Focus' appear here.", 4000);
    setTimeout(() => {
        temporaryHighlight('tapestryNarrative'); // Highlight the narrative paragraph
        showTemporaryMessage("See how they shape your Tapestry Narrative?", 4500);
    }, 4100);
     setTimeout(() => {
        showTemporaryMessage("Explore your Grimoire to focus more Concepts!", 4000);
    }, 8700);
    State.setHasSeenFocusTutorial(true); // Mark as seen
}

function triggerStudyTutorial() {
    console.log("UI: Triggering Study Tutorial");
    temporaryHighlight('userInsightDisplayStudy'); // Highlight insight display in study
    showTemporaryMessage("This is Insight - spend it to discover more.", 4000);
    setTimeout(() => {
        temporaryHighlight('researchButtonContainer'); // Highlight the research buttons grid
        showTemporaryMessage("Use Insight here to research Elements...", 4500);
    }, 4100);
    setTimeout(() => {
         temporaryHighlight('researchOutput'); // Highlight the results area
        showTemporaryMessage("...and new discoveries appear here!", 4000);
    }, 8700);
    State.setHasSeenStudyTutorial(true); // Mark as seen
}

// --- Insight Display ---
export function updateInsightDisplays() {
    const insight = State.getInsight().toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = insight;
    displayResearchButtons(); // Update research button disabled states
    if (seekGuidanceButton) seekGuidanceButton.disabled = State.getInsight() < Config.GUIDED_REFLECTION_COST;
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;

    // Refresh Deep Dive unlock buttons if Persona screen is visible and phase allows
    if (personaScreen?.classList.contains('current') && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED) {
        const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container');
        deepDiveContainers?.forEach(container => {
            const elementKey = container.dataset.elementKey;
            if (elementKey) {
                 displayElementDeepDive(elementKey, container); // Refresh unlock button states
            }
        });
    }

    if (repositoryScreen && repositoryScreen.classList.contains('current')) { displayRepositoryContent(); } // Refresh repo costs/reqs

    // Update Evolve button state in popup if open
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
          const concept = concepts.find(c => c.id === popupConceptId);
          const discoveredData = State.getDiscoveredConceptData(popupConceptId);
          if(concept && discoveredData) displayEvolutionSection(concept, discoveredData);
    }
    updateContemplationButtonState(); // Update deep dive contemplation cost/cooldown
    updateSuggestSceneButtonState(); // Update suggest scene cost state
}

// --- Questionnaire UI ---
export function initializeQuestionnaireUI() {
    updateElementProgressHeader(-1); // Show no progress initially
    displayElementQuestions(0); // Display the first set of questions
    if (mainNavBar) mainNavBar.classList.add('hidden');
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none';
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
    const currentState = State.getState();
    if (index >= elementNames.length) {
        const lastElementIndex = elementNames.length - 1;
        if (lastElementIndex >= 0) {
            const finalAnswers = getQuestionnaireAnswers(); // Get final answers before finalizing
            State.updateAnswers(elementNames[lastElementIndex], finalAnswers);
        }
        GameLogic.finalizeQuestionnaire();
        return;
    }
    const elementName = elementNames[index];
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || [];
    if (!questionContent) { console.error("questionContent element missing!"); return; }
    const elementAnswers = currentState.userAnswers?.[elementName] || {};
    console.log(`UI: Displaying questions for Index ${index} (${elementName}). Initial answers from state:`, JSON.parse(JSON.stringify(elementAnswers)));
    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    let questionsHTML = '';
    questions.forEach(q => {
        let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
        const savedAnswer = elementAnswers[q.qId];
        if (q.type === "slider") {
            const val = savedAnswer !== undefined ? savedAnswer : q.defaultValue;
            inputHTML += `<div class="slider-container"><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${val}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(val).toFixed(1)}</span></p><p class="slider-feedback" id="feedback_${q.qId}"></p></div>`;
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
    if(questions.length === 0) questionsHTML = '<p><em>(No questions for this element)</em></p>';
    questionContent.innerHTML = introHTML;
    const introDiv = questionContent.querySelector('.element-intro');
    if (introDiv) introDiv.insertAdjacentHTML('afterend', questionsHTML);
    else questionContent.innerHTML += questionsHTML;
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
        input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
    });
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.removeEventListener('change', GameLogic.handleCheckboxChange);
        checkbox.addEventListener('change', GameLogic.handleCheckboxChange);
    });
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block';
    // Explicitly update feedback for the initial display
    const initialAnswers = currentState.userAnswers?.[elementName] || {};
    updateDynamicFeedback(elementName, initialAnswers); // Update score display
    questionContent.querySelectorAll('.slider.q-input').forEach(slider => { // Update all slider text
        updateSliderFeedbackText(slider, elementName);
    });
    updateElementProgressHeader(index);
    if (progressText) progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || elementName}`;
    if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (index === elementNames.length - 1) ? "Analyze Results" : "Next Element"; // Updated text
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
     if (!elementData || !dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) { if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; return; }
     const tempScore = GameLogic.calculateElementScore(elementName, currentAnswers);
     const scoreLabel = Utils.getScoreLabel(tempScore);
     feedbackElementSpan.textContent = elementData.name || elementName;
     feedbackScoreSpan.textContent = tempScore.toFixed(1);
     let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
     if(!labelSpan && feedbackScoreSpan?.parentNode) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling); }
     if (labelSpan) labelSpan.textContent = ` (${scoreLabel})`;
     feedbackScoreBar.style.width = `${tempScore * 10}%`;
     dynamicScoreFeedback.style.display = 'block';
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
    const showDeepDive = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;

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
        deepDiveContainer.classList.toggle('hidden-by-flow', !showDeepDive); // Use flow class

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
                <hr class="popup-hr">
                <p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p>
                <p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>
                {/* Attunement and Deep Dive will be added below */}
            </div>`;

        const descriptionDiv = details.querySelector('.element-description');
        if (descriptionDiv) {
            // Append deep dive container before potential attunement display logic
            descriptionDiv.appendChild(deepDiveContainer);
        }

        personaElementDetailsDiv.appendChild(details);

        if (showDeepDive) {
            displayElementDeepDive(key, deepDiveContainer);
        }
    });

    displayElementAttunement(); // This will add attunement after description, before deep dive if logic is correct
    updateInsightDisplays();
    displayFocusedConceptsPersona();
    updateFocusElementalResonance();
    generateTapestryNarrative();
    synthesizeAndDisplayThemesPersona();
    displayPersonaSummary();
    // applyOnboardingPhaseUI is called by showScreen now
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
                const deepDiveContainer = descriptionDiv.querySelector('.element-deep-dive-container'); // Find deep dive container
                descriptionDiv.querySelector('.attunement-display')?.remove(); // Remove existing
                descriptionDiv.querySelector('.attunement-hr')?.remove(); // Remove existing hr

                const hr = document.createElement('hr'); hr.className = 'attunement-hr popup-hr'; // Add popup-hr class
                const attunementDiv = document.createElement('div'); attunementDiv.classList.add('attunement-display');
                attunementDiv.innerHTML = `<div class="attunement-item"><span class="attunement-name">Attunement:</span><div class="attunement-bar-container" title="Current Attunement: ${attunementValue.toFixed(1)} / ${Config.MAX_ATTUNEMENT}"><div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div></div><i class="fas fa-info-circle info-icon" title="Attunement reflects your affinity and experience with this Element. It grows through related actions like Research, Reflection, and focusing on relevant Concepts. High Attunement may unlock Experiments or reduce Research costs."></i></div>`;

                // Insert HR and Attunement BEFORE the deep dive container if it exists
                if (deepDiveContainer) {
                     descriptionDiv.insertBefore(hr, deepDiveContainer);
                     descriptionDiv.insertBefore(attunementDiv, deepDiveContainer);
                } else { // Otherwise, append to the end
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
            let iconClass = Utils.getCardTypeIcon(concept.cardType); let iconColor = '#b8860b';
            if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) { const fullElementName = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); } else { console.warn(`Concept ${concept.name} missing valid primaryElement for focus icon.`); }
            item.innerHTML = `<i class="${iconClass}" style="color: ${iconColor};"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`;
            item.addEventListener('click', () => showConceptDetailPopup(concept.id));
            focusedConceptsDisplay.appendChild(item);
        } else { console.warn(`Focused concept ID ${conceptId} not found.`); const item = document.createElement('div'); item.classList.add('focus-concept-item', 'missing'); item.textContent = `Error: ID ${conceptId}`; focusedConceptsDisplay.appendChild(item); }
    });
    updateSuggestSceneButtonState();
}
export function updateFocusElementalResonance() {
     if (!focusResonanceBarsContainer) return; focusResonanceBarsContainer.innerHTML = '';
     const { focusScores } = GameLogic.calculateFocusScores();
     elementNames.forEach(elName => {
         const key = elementNameToKey[elName]; const avgScore = focusScores[key] || 0; const percentage = Math.max(0, Math.min(100, (avgScore / 10) * 100));
         const color = Utils.getElementColor(elName); const name = elementDetails[elName]?.name || elName;
         const item = document.createElement('div'); item.classList.add('focus-resonance-item');
         item.innerHTML = `<span class="focus-resonance-name">${name}:</span><div class="focus-resonance-bar-container" title="${avgScore.toFixed(1)} Avg Score"><div class="focus-resonance-bar" style="width: ${percentage}%; background-color: ${color};"></div></div>`;
         focusResonanceBarsContainer.appendChild(item);
     });
}
export function generateTapestryNarrative() {
     if (!tapestryNarrativeP) return;
     const narrative = GameLogic.calculateTapestryNarrative();
     tapestryNarrativeP.innerHTML = narrative || 'Mark concepts as "Focus" to generate narrative...';
     console.log("UI: Updated Detailed View Tapestry Narrative paragraph.");
}
export function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return; personaThemesList.innerHTML = '';
     const themes = GameLogic.calculateFocusThemes();
     if (themes.length === 0) { personaThemesList.innerHTML = `<li>${State.getFocusedConcepts().size > 0 ? 'No strong themes detected.' : 'Mark Focused Concepts...'}</li>`; return; }
     themes.slice(0, 3).forEach(theme => { const li = document.createElement('li'); li.textContent = `${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})`; personaThemesList.appendChild(li); });
}
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
    html += '</div><hr class="popup-hr"><h3>Focused Tapestry</h3><div class="summary-section">'; // Use popup-hr for consistency?
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
}


// --- Study Screen UI ---
export function displayStudyScreenContent() {
    console.log("UI: Displaying Study Screen Content");
    updateInsightDisplays(); // Refreshes costs/availability
    displayDailyRituals();
    // applyOnboardingPhaseUI called by showScreen
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
        // Ensure button shows if phase allows, even if disabled
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

    if (seekGuidanceButton) seekGuidanceButton.disabled = insight < Config.GUIDED_REFLECTION_COST;
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
}
export function displayDailyRituals() {
     if (!dailyRitualsDisplay) return; dailyRitualsDisplay.innerHTML = '';
     // Only display if phase allows
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
         dailyRitualsDisplay.innerHTML = '<li>Unlock rituals by progressing.</li>';
         return;
     }
     const completed = State.getState().completedRituals.daily || {}; const focused = State.getFocusedConcepts();
     let activeRituals = [...dailyRituals];
     if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFocused = true; for (const id of reqIds) { if (!focused.has(id)) { allFocused = false; break; } } if (allFocused) activeRituals.push({ ...ritual, isFocusRitual: true }); }); }
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
    const placeholder = researchOutput.querySelector('p > i');
    // Clear placeholder only if we actually found something new
    if ((foundConcepts.length > 0 || repositoryItems.length > 0) && placeholder && researchOutput.children.length === 1) {
         placeholder.parentElement.innerHTML = '';
    }
    // Display duplicate message if applicable
    if (duplicateInsightGain > 0) { const dupeMsg = document.createElement('p'); dupeMsg.classList.add('duplicate-message'); dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate research echoes.`; researchOutput.prepend(dupeMsg); setTimeout(() => dupeMsg.remove(), 5000); }
    // Add new concept cards
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
    // Display repository item discoveries temporarily
    repositoryItems.forEach(item => {
         if (researchOutput.querySelector(`[data-repo-id="${item.id}"]`)) return; // Avoid duplicates if somehow possible
         const itemDiv = document.createElement('div'); itemDiv.classList.add('repository-item-discovery'); itemDiv.dataset.repoId = item.id;
         let iconClass = 'fa-question-circle'; let typeName = 'Item';
         if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; }
         else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; }
         // Add other types if needed (e.g., experiment)
         itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered the '${item.name}'. View it in the Repository.`}</p>`;
         researchOutput.prepend(itemDiv); setTimeout(() => itemDiv.remove(), 7000); // Remove after 7 seconds
    });
    // If, after adding everything, the output is still empty (e.g., only duplicates found)
    if (researchOutput.children.length === 0 && !placeholder) {
        researchOutput.innerHTML = '<p><i>Familiar thoughts echo...</i></p>';
    }
}
export function updateResearchButtonAfterAction(conceptId, action) {
    const itemDiv = researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`); if (!itemDiv) return;
    if (action === 'add' || action === 'sell') {
        itemDiv.remove();
        // If removing the last item, show the placeholder again
        if (researchOutput && researchOutput.children.length === 0) {
            researchOutput.innerHTML = '<p><i>Research results cleared.</i></p>';
            if (action === 'sell' && researchStatus) {
                displayResearchStatus("Ready for new research.");
            }
        }
    }
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
        const focusMatch = (filterFocus === 'All') || (filterFocus === 'Focused' && focusedSet.has(concept.id)) || (filterFocus === 'Not Focused' && !focusedSet.has(concept.id));
        const searchMatch = !searchTermLower || (concept.name.toLowerCase().includes(searchTermLower)) || (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTermLower)));
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
    if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters${searchTermLower ? ' or search term' : ''}.</p>`; }
    else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); if (cardElement) { grimoireContentDiv.appendChild(cardElement); } }); }
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

// --- Card Rendering (Includes Icon Changes) ---
export function renderCard(concept, context = 'grimoire') {
    if (!concept || typeof concept.id === 'undefined') { console.warn("renderCard invalid concept:", concept); const d = document.createElement('div'); d.textContent = "Error"; return d; }
    const cardDiv = document.createElement('div'); cardDiv.classList.add('concept-card'); cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`); cardDiv.dataset.conceptId = concept.id; cardDiv.title = `View ${concept.name}`;
    const discoveredData = State.getDiscoveredConceptData(concept.id); const isDiscovered = !!discoveredData; const isFocused = State.getFocusedConcepts().has(concept.id); const artUnlocked = discoveredData?.artUnlocked || false;
    const showFocusStar = isFocused && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    const focusStampHTML = showFocusStar ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
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
    let sellButtonHTML = '';
    if (context === 'grimoire' && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        sellButtonHTML = `<button class="button small-button secondary-button sell-button card-sell-button" data-concept-id="${concept.id}" data-context="grimoire" title="Sell for ${sellValue.toFixed(1)} Insight.">Sell <i class="fas fa-brain insight-icon"></i>${sellValue.toFixed(1)}</button>`;
    }
    cardDiv.innerHTML = `<div class="card-header"><i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i><span class="card-name">${concept.name}</span><span class="card-stamps">${focusStampHTML}${grimoireStampHTML}</span></div><div class="card-visual">${visualContent}</div><div class="card-footer"><div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div><p class="card-brief-desc">${concept.briefDescription || '...'}</p>${sellButtonHTML}</div>`;
    if (context !== 'no-click') { cardDiv.addEventListener('click', (event) => { if (event.target.closest('button')) return; showConceptDetailPopup(concept.id); }); }
    if (context === 'research-output') { cardDiv.title = `Click to view details (Not in Grimoire)`; cardDiv.querySelector('.card-footer .sell-button')?.remove(); }
    return cardDiv;
}


// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    console.log(`UI: Attempting to show popup for conceptId: ${conceptId}`); // Log the ID
    if (!conceptDetailPopup || !popupOverlay) {
        console.error("Popup container or overlay missing!");
        return;
    }

    // Check essential DOM elements *before* trying to use them
    if (!popupConceptName || !popupConceptType || !popupCardTypeIcon || !popupDetailedDescription || !popupVisualContainer || !popupResonanceSummary || !popupComparisonHighlights || !popupConceptProfile || !popupUserComparisonProfile || !popupRelatedConcepts || !myNotesSection || !popupEvolutionSection || !addToGrimoireButton || !markAsFocusButton) {
         console.error("One or more critical elements inside the conceptDetailPopup are missing! Check HTML IDs.");
         UI.showTemporaryMessage("Error displaying concept details.", 3000);
         return; // Stop execution if essential elements are missing
    }

    const conceptData = concepts.find(c => c.id === conceptId);
    if (!conceptData) {
        console.error("Concept data missing for ID:", conceptId);
        UI.showTemporaryMessage("Error: Concept data not found.", 3000);
        return;
    }
    console.log(`UI: Found concept data for "${conceptData.name}"`);

    const discoveredData = State.getDiscoveredConceptData(conceptId);
    const inGrimoire = !!discoveredData;
    const inResearchNotes = !inGrimoire && researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
    const currentPhase = State.getOnboardingPhase();
    GameLogic.setCurrentPopupConcept(conceptId);

    // --- Populate Basic Info ---
    console.log("UI: Populating basic info...");
    popupConceptName.textContent = conceptData.name;
    popupConceptType.textContent = conceptData.cardType;
    popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;
    popupDetailedDescription.textContent = conceptData.detailedDescription || "No description.";

    // --- Populate Visuals ---
    console.log("UI: Populating visual...");
    const artUnlocked = discoveredData?.artUnlocked || false;
    // const currentVisualHandle = artUnlocked ? (conceptData.visualHandleUnlocked || conceptData.visualHandle) : conceptData.visualHandle; // This logic is complex, let's simplify for logging
    popupVisualContainer.innerHTML = ''; // Clear previous
    let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder";
    if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; }
    else if (conceptData.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; }
    const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;
    popupVisualContainer.innerHTML = visualContent;

    // --- Populate Analysis ---
    console.log("UI: Populating analysis sections...");
    const scores = State.getScores();
    const distance = Utils.euclideanDistance(scores, conceptData.elementScores);
    displayPopupResonance(distance);
    displayPopupRecipeComparison(conceptData, scores); // Pass scores explicitly
    displayPopupRelatedConcepts(conceptData);

    // --- Notes Section ---
    console.log("UI: Handling Notes section...");
    const showNotes = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    if (myNotesSection && myNotesTextarea && saveMyNoteButton) {
        myNotesSection.classList.toggle('hidden', !showNotes);
        if (showNotes) {
             myNotesTextarea.value = discoveredData.notes || "";
             if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = "";
             // Use event listener defined in main.js via delegation now
             // saveMyNoteButton.onclick = () => GameLogic.handleSaveNote();
        }
        // else { saveMyNoteButton.onclick = null; } // Listener removed via delegation if needed
    }

    // --- Evolution Section ---
    console.log("UI: Handling Evolution section...");
    const showEvolution = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
    if (popupEvolutionSection) {
        popupEvolutionSection.classList.toggle('hidden', !showEvolution);
        if (showEvolution) displayEvolutionSection(conceptData, discoveredData);
    }

    // --- Update Action Buttons ---
    console.log("UI: Updating action buttons...");
    updateGrimoireButtonStatus(conceptId, !!inResearchNotes);
    updateFocusButtonStatus(conceptId);
    updatePopupSellButton(conceptId, conceptData, inGrimoire, !!inResearchNotes);

    // --- Tutorial Highlight Check ---
    // Show highlight ONLY if Grimoire tutorial seen BUT Focus tutorial *not* seen,
    // AND this is the first concept being viewed after focusing is possible.
    const showFocusTutorialHighlight = inGrimoire &&
                                       State.getHasSeenGrimoireTutorial() &&
                                       !State.getHasSeenFocusTutorial() &&
                                       State.getFocusedConcepts().size === 0;
       if (showFocusTutorialHighlight && markAsFocusButton && !markAsFocusButton.classList.contains('hidden')) {
        console.log("UI: Triggering focus button highlight.");
        // *** CHANGE THIS LINE ***
        // temporaryHighlight(markAsFocusButton, 5000, 'highlight-feature-onboarding popup-highlight');
        // *** TO THIS (Add classes separately): ***
        temporaryHighlight(markAsFocusButton, 5000, 'highlight-feature-onboarding');
        temporaryHighlight(markAsFocusButton, 5000, 'popup-highlight'); // Call again for the second class
        // *** END CHANGE ***

        setTimeout(() => showTemporaryMessage("Focusing adds this to your Persona Tapestry!", 4000), 500);
        // We DON'T set hasSeenFocusTutorial here. That happens when they see the Persona screen update.
    }

    // --- Show Popup ---
    console.log("UI: Displaying popup.");
    conceptDetailPopup.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');
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
export function displayPopupRecipeComparison(conceptData, userCompScores = State.getScores()) {
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
     if (!hasHighlights) highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>';
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
    addToGrimoireButton.classList.toggle('hidden', isDiscovered); // Hide if in grimoire
    addToGrimoireButton.disabled = false; // Enable if visible (means not discovered)
    addToGrimoireButton.textContent = "Add to Grimoire";
    addToGrimoireButton.classList.remove('added'); // Ensure 'added' class is removed if somehow present
}
export function updateFocusButtonStatus(conceptId) {
    if (!markAsFocusButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots();
    const phaseAllowsFocus = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const showButton = isDiscovered && phaseAllowsFocus; // Must be discovered AND phase must allow focus
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
    popupActions.querySelector('.popup-sell-button')?.remove(); // Remove existing first
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
        // Append after focus button if visible, otherwise after add button if visible, else at end
        if (markAsFocusButton && !markAsFocusButton.classList.contains('hidden')) { markAsFocusButton.insertAdjacentElement('afterend', sellButton); }
        else if (addToGrimoireButton && !addToGrimoireButton.classList.contains('hidden')) { addToGrimoireButton.insertAdjacentElement('afterend', sellButton); }
        else { popupActions.appendChild(sellButton); }
    }
}


// --- Reflection Modal UI ---
export function displayReflectionPrompt(promptData, context) {
    // --- Add Introduction Check ---
    // Check phase as well, only show intro if reflections are actually enabled
    if (!State.getHasSeenReflectionIntro() && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
        showTemporaryMessage("Reflection Opportunity! Pausing to reflect grants Insight.", 4500);
        State.setHasSeenReflectionIntro(true); // Mark as seen once
    }
    // --- End Introduction Check ---

    if (!reflectionModal || !promptData || !promptData.prompt) {
         console.error("Reflection modal or prompt data/text missing.", promptData);
         if (context === 'Dissonance') {
             const conceptId = GameLogic.getCurrentPopupConceptId();
             if (conceptId) { console.warn("Reflection prompt missing for Dissonance, adding concept directly."); GameLogic.addConceptToGrimoireInternal(conceptId); hidePopups(); showTemporaryMessage("Reflection unavailable, concept added.", 3500); }
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
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)} Insight`; // Add units
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
     const showDeepDive = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;

     targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${elementDetails[elementName]?.name || elementName} Insights</h5>`;

     if (!showDeepDive) {
         targetContainerElement.innerHTML += '<p><i>Unlock the Repository to delve deeper.</i></p>';
         return;
     }

     if (deepDiveData.length === 0) { targetContainerElement.innerHTML += '<p>No deep dive content available.</p>'; return; }

     let displayedContent = false;
     deepDiveData.forEach(levelData => {
         if (levelData.level <= currentLevel) {
             targetContainerElement.innerHTML += `<div class="library-level"><h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5><div class="level-content">${levelData.content}</div></div><hr class="popup-hr">`;
             displayedContent = true;
         }
     });

     // Clear the initial title if content was displayed, otherwise keep it.
     if (displayedContent) {
         targetContainerElement.querySelector('h5.deep-dive-section-title').remove();
     } else if (currentLevel === 0) {
         targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${elementDetails[elementName]?.name || elementName} Insights</h5>`; // Re-add title if nothing displayed
         targetContainerElement.innerHTML += '<p>Unlock the first level to begin exploring.</p>'; // Add prompt
     }

     const nextLevel = currentLevel + 1;
     const nextLevelData = deepDiveData.find(l => l.level === nextLevel);

     if (nextLevelData) {
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
     } else if (displayedContent) { // Only show "All Unlocked" if some content was actually displayed
         targetContainerElement.innerHTML += '<p class="all-unlocked-message"><i>All insights unlocked for this element.</i></p>';
     } else if (!displayedContent && currentLevel > 0) {
          // This case should ideally not happen if levels are sequential
          targetContainerElement.innerHTML += '<p><i>Error displaying content.</i></p>';
     }
}


// --- Repository UI ---
export function displayRepositoryContent() {
     const showRepository = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;
     if (repositoryScreen) repositoryScreen.classList.toggle('hidden-by-flow', !showRepository); if(!showRepository) return;
     if (!repositoryFocusUnlocksDiv || !repositoryScenesDiv || !repositoryExperimentsDiv || !repositoryInsightsDiv) { console.error("Repo list containers missing!"); return; }
     console.log("UI: Displaying Repository Content");
     repositoryFocusUnlocksDiv.innerHTML = ''; repositoryScenesDiv.innerHTML = ''; repositoryExperimentsDiv.innerHTML = ''; repositoryInsightsDiv.innerHTML = '';
     const repoItems = State.getRepositoryItems(); const unlockedFocusData = State.getUnlockedFocusItems(); const attunement = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();

     if (unlockedFocusData.size > 0) { unlockedFocusData.forEach(unlockId => { const unlockData = focusDrivenUnlocks.find(u => u.id === unlockId); if (unlockData?.unlocks) { const item = unlockData.unlocks; const div = document.createElement('div'); div.classList.add('repository-item', 'focus-unlock-item'); let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`; if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`; if (item.type === 'insightFragment') { const iData = elementalInsights.find(i => i.id === item.id); itemHTML += `<p><em>"${iData?.text || item.text || "..."}"</em></p>`; } else itemHTML += `<p>Details below.</p>`; div.innerHTML = itemHTML; repositoryFocusUnlocksDiv.appendChild(div); } }); }
     else { repositoryFocusUnlocksDiv.innerHTML = '<p>Focus on synergistic combinations of Concepts to unlock items.</p>'; }

     if (repoItems.scenes.size > 0) { repoItems.scenes.forEach(sceneId => { const scene = sceneBlueprints.find(s => s.id === sceneId); if (scene) { const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST; const canAfford = insight >= cost; repositoryScenesDiv.appendChild(renderRepositoryItem(scene, 'scene', cost, canAfford)); } else { console.warn(`Scene ID ${sceneId} not found.`); } }); }
     else { repositoryScenesDiv.innerHTML = '<p>No Scene Blueprints discovered.</p>'; }

     let experimentsDisplayed = 0;
     alchemicalExperiments.forEach(exp => {
         const isUnlockedByAttunement = attunement[exp.requiredElement] >= exp.requiredAttunement;
         const alreadyCompleted = repoItems.experiments.has(exp.id);
         // Only display if attunement is met (completed or not)
         if (isUnlockedByAttunement) {
             let canAttempt = true; let unmetReqs = [];
             if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } }
             if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let typeMet = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { typeMet = true; break; } } if (!typeMet) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } }
             const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST; const canAfford = insight >= cost; if (!canAfford) unmetReqs.push("Insight");
             repositoryExperimentsDiv.appendChild(renderRepositoryItem(exp, 'experiment', cost, canAfford && canAttempt && !alreadyCompleted, alreadyCompleted, unmetReqs)); experimentsDisplayed++;
         }
     });
     if (experimentsDisplayed === 0) { repositoryExperimentsDiv.innerHTML = '<p>Increase Attunement to unlock Experiments.</p>'; }

     if (repoItems.insights.size > 0) {
         const insightsByElement = {}; elementNames.forEach(elName => insightsByElement[elementNameToKey[elName]] = []);
         repoItems.insights.forEach(insightId => { const insight = elementalInsights.find(i => i.id === insightId); if (insight) { if (!insightsByElement[insight.element]) insightsByElement[insight.element] = []; insightsByElement[insight.element].push(insight); } else { console.warn(`Insight ID ${insightId} not found.`); } });
         let insightsHTML = '';
         for (const key in insightsByElement) { if (insightsByElement[key].length > 0) { insightsHTML += `<h5>${elementDetails[elementKeyToFullName[key]]?.name || key} Insights:</h5><ul>`; insightsByElement[key].sort((a, b) => a.id.localeCompare(b.id)).forEach(insight => { insightsHTML += `<li>"${insight.text}"</li>`; }); insightsHTML += `</ul>`; } }
         repositoryInsightsDiv.innerHTML = insightsHTML || '<p>No Elemental Insights collected.</p>';
     } else { repositoryInsightsDiv.innerHTML = '<p>No Elemental Insights collected.</p>'; }

     displayMilestones(); // Display milestones at the end
     // GameLogic.updateMilestoneProgress('repositoryContents', null); // Triggered by displayRepositoryContent
 }
export function renderRepositoryItem(item, type, cost, canAfford, completed = false, unmetReqs = []) {
     const div = document.createElement('div'); div.classList.add('repository-item', `repo-item-${type}`); if (completed) div.classList.add('completed');
     let actionsHTML = '';
     let buttonDisabled = false; let buttonTitle = ''; let buttonText = '';

     if (type === 'scene') {
          buttonDisabled = !canAfford;
          buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`;
          if (!canAfford) buttonTitle = `Requires ${cost} Insight`;
          actionsHTML = `<button class="button small-button" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
     } else if (type === 'experiment') {
          buttonDisabled = (!canAfford || completed || unmetReqs.length > 0);
          buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`;
          if (completed) buttonTitle = "Completed";
          else if (unmetReqs.length > 0 && unmetReqs.includes("Insight")) buttonTitle = `Requires ${cost} Insight & ${unmetReqs.filter(r=>r!=="Insight").join(', ')}`;
          else if (unmetReqs.length > 0) buttonTitle = `Requires Focus: ${unmetReqs.join(', ')}`;
          else if (!canAfford) buttonTitle = `Requires ${cost} Insight`;
          actionsHTML = `<button class="button small-button" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
          if (completed) actionsHTML += ` <span class="completed-text">(Completed)</span>`;
          else if (unmetReqs.length > 0 && unmetReqs.includes("Insight")) actionsHTML += ` <small class="req-missing">(Insufficient Insight & Focus)</small>`;
          else if (unmetReqs.length > 0) actionsHTML += ` <small class="req-missing">(Requires Focus: ${unmetReqs.join(', ')})</small>`;
          else if (!canAfford) actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`;
     }

     div.innerHTML = `<h4>${item.name} ${type === 'experiment' ? `(Req: ${item.requiredAttunement} ${elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4><p>${item.description}</p><div class="repo-actions">${actionsHTML}</div>`;
     return div;
 }

// --- Milestones UI ---
export function displayMilestones() {
    if (!milestonesDisplay) return; milestonesDisplay.innerHTML = '';
    const achieved = State.getState().achievedMilestones;
    if (achieved.size === 0) { milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>'; return; }
    // Sort achieved milestones according to their order in the milestones array
    const sortedAchievedIds = milestones.filter(m => achieved.has(m.id)).map(m => m.id);
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
        deepDiveFocusIcons.innerHTML = ''; // Clear previous icons
        const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => {
            const concept = discovered.get(id)?.concept;
            if (concept) {
                let iconClass = Utils.getElementIcon("Default"); let iconColor = '#CCCCCC'; let iconTitle = concept.name;
                if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) { const fullElementName = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); iconTitle = `${concept.name} (${elementDetails[fullElementName]?.name || fullElementName})`; } else { console.warn(`Concept ${concept.name} missing valid primaryElement for deep dive icon.`); iconClass = Utils.getCardTypeIcon(concept.cardType); }
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
    let html = `<h4>Contemplation Task</h4><p>${task.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`; // Apply basic formatting
    if (task.requiresCompletionButton) {
         const rewardText = task.reward.type === 'insight' ? `${task.reward.amount} <i class="fas fa-brain insight-icon"></i>` : `${task.reward.amount} Attun.`;
         html += `<button id="completeContemplationBtn" class="button small-button">Mark Complete (+${rewardText})</button>`;
    }
    deepDiveDetailContent.innerHTML = html;
    // Listener for complete button is handled in main.js delegation
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
        btn.classList.toggle('hidden-by-flow', !isPhaseReady);
        btn.disabled = !isPhaseReady || !hasFocus;
        btn.title = !isPhaseReady ? "Progress further..." : (!hasFocus ? "Focus on concepts first..." : "Explore a deeper analysis of your focused tapestry.");
    } else { console.warn("UI: updateTapestryDeepDiveButton - Button not found!"); }
}

// --- Suggest Scene Button UI ---
export function updateSuggestSceneButtonState() {
    if (!suggestSceneButton) return;
    const hasFocus = State.getFocusedConcepts().size > 0;
    const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST;
    const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;

    suggestSceneButton.classList.toggle('hidden-by-flow', !isPhaseReady);

    if (isPhaseReady) {
        suggestSceneButton.disabled = !hasFocus || !canAfford;
        if (!hasFocus) { suggestSceneButton.title = "Focus on concepts first"; }
        else if (!canAfford) { suggestSceneButton.title = `Requires ${Config.SCENE_SUGGESTION_COST} Insight`; }
        else { suggestSceneButton.title = `Suggest resonant scenes (${Config.SCENE_SUGGESTION_COST} Insight)`; }
        suggestSceneButton.innerHTML = `Suggest Scenes (${Config.SCENE_SUGGESTION_COST} <i class="fas fa-brain insight-icon"></i>)`;
    } else {
        suggestSceneButton.disabled = true;
        suggestSceneButton.title = "Progress further...";
    }
}

// --- Initial UI Setup Helper ---
export function setupInitialUI() {
    console.log("UI: Setting up initial UI state...");
    applyOnboardingPhaseUI(Config.ONBOARDING_PHASE.START); // Apply base phase
    if(mainNavBar) mainNavBar.classList.add('hidden'); // Ensure nav hidden initially
    // showScreen('welcomeScreen'); // Called by initializeApp in main.js now
    if(loadButton) loadButton.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY));
    updateSuggestSceneButtonState(); // Ensure buttons are in correct initial state
    updateTapestryDeepDiveButton();
}


console.log("ui.js loaded.");
