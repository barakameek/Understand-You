

```javascript
// js/ui.js - Handles DOM Manipulation and UI Updates
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js'; // Needed for button actions, finalizing etc.
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
const tutorialModal = document.getElementById('tutorialModal');
const tutorialTitle = document.getElementById('tutorialTitle');
const tutorialText = document.getElementById('tutorialText');
const tutorialNextButton = document.getElementById('tutorialNextButton');
const closeTutorialButton = tutorialModal?.querySelector('.close-button');
const startingNebulaModal = document.getElementById('startingNebulaModal');
const nebulaModalContent = document.getElementById('nebulaModalContent');
const viewStarCatalogButton = document.getElementById('viewStarCatalogButton');
const closeStartingNebulaButton = startingNebulaModal?.querySelector('.close-button');

// --- Tutorial Step Definitions ---
// Maps step IDs (from Config.TUTORIAL_STEP) to their content and targets
const tutorialSteps = {
    [Config.TUTORIAL_STEP.GRIMOIRE_INTRO]: { // <--- Around line 192 might be here
        title: "The Grand Grimoire",
        text: "Welcome to your Grimoire! This is where all the Concept Cards you discover are stored. Take a look around.",
        targetElementId: 'grimoireScreen',
        nextStepId: Config.TUTORIAL_STEP.CONCEPT_POPUP_INTRO
    },
    [Config.TUTORIAL_STEP.CONCEPT_POPUP_INTRO]: {
        title: "Concept Details",
        text: "Click a Concept Card to see details, elemental resonance, related concepts, and actions like 'Mark as Focus'. Try clicking one!",
        targetElementId: 'grimoireContent',
        nextStepId: Config.TUTORIAL_STEP.FOCUS_INTRO,
        waitForAction: true // Wait for user to click a card
    },
     [Config.TUTORIAL_STEP.FOCUS_INTRO]: {
        title: "Focusing Concepts",
        text: "The 'Persona' screen shows your profile. In the 'Focus' area (on the right), you can 'Mark as Focus' Concepts from your Grimoire (via the popup) to shape your Tapestry Narrative.",
        targetElementId: 'tapestryArea', // Highlight the focus grid area
        nextStepId: Config.TUTORIAL_STEP.STUDY_INTRO,
        waitForAction: true // Wait for user to actually focus a concept
    },
     [Config.TUTORIAL_STEP.STUDY_INTRO]: {
        title: "The Alchemist's Study",
        text: "'Insight' <i class=\"fas fa-brain insight-icon\"></i> fuels discovery. Spend it in the Study to 'Conduct Research' on Elements and find new Concepts or insights.",
        targetElementId: 'studyScreen',
        nextStepId: Config.TUTORIAL_STEP.SELL_INTRO
    },
    [Config.TUTORIAL_STEP.SELL_INTRO]: {
        title: "Managing Concepts",
        text: "Found Concepts appear in 'Research Notes'. You can 'Add' them to your Grimoire or 'Sell' unwanted ones (here or in the Grimoire) for Insight.",
        targetElementId: 'researchOutput', // Highlight research results area
        nextStepId: Config.TUTORIAL_STEP.REFLECTION_INTRO
    },
    [Config.TUTORIAL_STEP.REFLECTION_INTRO]: {
        title: "Moments for Reflection",
        text: "Discoveries may prompt a 'Moment for Reflection'. Engaging grants Insight and Attunement. Check the Study screen for Rituals too.",
        targetElementId: 'studyScreen', // Broad context
        nextStepId: Config.TUTORIAL_STEP.REPOSITORY_INTRO
    },
    [Config.TUTORIAL_STEP.REPOSITORY_INTRO]: {
        title: "The Repository",
        text: "The Repository (unlocked later) holds special finds: Scene Blueprints, Experiments, unique Insights, and tracks Milestones.",
        targetElementId: 'repositoryScreen', // Highlight nav button or screen
        nextStepId: Config.TUTORIAL_STEP.COMPLETE
    },
};

// --- Tutorial UI Functions ---
let highlightedElement = null;
let currentTutorialScreenTarget = null;

function temporaryHighlight(elementId) {
    removeHighlight();
    const target = document.getElementById(elementId);
    if (target) {
        target.classList.add('highlight-feature-onboarding');
        highlightedElement = target;
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    } else {
        console.warn(`Tutorial highlight: Element with ID '${elementId}' not found.`);
    }
}

function removeHighlight() {
    if (highlightedElement) {
        highlightedElement.classList.remove('highlight-feature-onboarding');
        highlightedElement = null;
    }
}

export function showTutorialStep(stepId) {
    console.log(`UI: Showing tutorial step '${stepId}'`);
    const stepData = tutorialSteps[stepId];

    if (!stepData || !tutorialModal || !tutorialTitle || !tutorialText || !tutorialNextButton || !popupOverlay) {
        console.error(`Tutorial step data or modal elements missing for step ID: ${stepId}. Failsafe: Completing tutorial.`);
        State.setOnboardingTutorialStep(Config.TUTORIAL_STEP.COMPLETE);
        if (currentTutorialScreenTarget) {
            showScreen(currentTutorialScreenTarget, true);
        } else {
            if(State.isQuestionnaireComplete()){ showScreen('personaScreen', true); }
            else { showScreen('welcomeScreen', true); }
        }
        return;
    }

    tutorialTitle.textContent = stepData.title;
    tutorialText.innerHTML = stepData.text;

    if (stepData.nextStepId && !stepData.waitForAction) {
        tutorialNextButton.textContent = "Next";
        tutorialNextButton.onclick = () => hideTutorialStep(stepId, stepData.nextStepId);
        tutorialNextButton.classList.remove('hidden');
    } else if (stepData.waitForAction) {
        tutorialNextButton.textContent = "Got It";
        tutorialNextButton.onclick = () => hideTutorialStep(stepId, stepId);
        tutorialNextButton.classList.remove('hidden');
    } else { // Final step
        tutorialNextButton.textContent = "Begin Exploring";
        tutorialNextButton.onclick = () => hideTutorialStep(stepId, Config.TUTORIAL_STEP.COMPLETE);
        tutorialNextButton.classList.remove('hidden');
    }

    temporaryHighlight(stepData.targetElementId || stepData.targetElementIdFallback);

    tutorialModal.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');
}

export function hideTutorialStep(currentStepId = null, nextStepId = null) {
    console.log(`UI: Hiding tutorial step. Current: ${currentStepId}, Next: ${nextStepId}`);
    if (tutorialModal) tutorialModal.classList.add('hidden');
    removeHighlight();

    const stepToSet = (nextStepId && nextStepId !== currentStepId) ? nextStepId : State.getOnboardingTutorialStep();
    const tutorialComplete = stepToSet === Config.TUTORIAL_STEP.COMPLETE;

    if (stepToSet !== State.getOnboardingTutorialStep()) {
        State.setOnboardingTutorialStep(stepToSet);
    }

    const currentStepData = currentStepId ? tutorialSteps[currentStepId] : null;
    const shouldShowNextStepImmediately = !tutorialComplete && tutorialSteps[stepToSet] && !currentStepData?.waitForAction && stepToSet !== currentStepId;

    if (shouldShowNextStepImmediately) {
        const nextTargetScreen = getTutorialTargetScreen(stepToSet);
        const targetScreenElement = nextTargetScreen ? document.getElementById(nextTargetScreen) : null;
        const isTargetScreenVisible = targetScreenElement && !targetScreenElement.classList.contains('hidden');

        if (nextTargetScreen && !isTargetScreenVisible) {
            console.log(`UI: Target screen ${nextTargetScreen} for next step ${stepToSet} is hidden. Showing screen first.`);
            showScreen(nextTargetScreen);
            setTimeout(() => showTutorialStep(stepToSet), 150);
        } else {
            showTutorialStep(stepToSet);
        }
    } else if (currentTutorialScreenTarget) {
        console.log(`UI: Tutorial step hidden/wait complete/finished. Proceeding to target screen: ${currentTutorialScreenTarget}`);
        showScreen(currentTutorialScreenTarget, true);
        currentTutorialScreenTarget = null;
        if (tutorialComplete) {
            popupOverlay?.classList.add('hidden');
            applyOnboardingPhaseUI(State.getOnboardingPhase());
        }
    } else if (tutorialComplete) {
         console.log("UI: Tutorial complete. Hiding overlay and applying phase UI.");
         popupOverlay?.classList.add('hidden');
         applyOnboardingPhaseUI(State.getOnboardingPhase());
         if (!document.querySelector('.screen.current')) {
             showScreen('personaScreen', true);
         }
    } else {
         console.log("UI: 'Got It' clicked, waiting for user action.");
         // Keep overlay visible for waitForAction steps
         // popupOverlay?.classList.add('hidden'); // Don't hide overlay here
    }
}


// --- Screen Management (MODIFIED FOR TUTORIAL) ---
export function showScreen(screenId, forceShow = false) {
    console.log(`UI: Request to show screen '${screenId}'. Force: ${forceShow}`);
    const tutorialStep = State.getOnboardingTutorialStep();

    // --- Tutorial Interception Logic ---
    if (tutorialStep !== Config.TUTORIAL_STEP.COMPLETE && !forceShow) {
        const tutorialTriggers = {
            'grimoireScreen': Config.TUTORIAL_STEP.GRIMOIRE_INTRO,
            'personaScreen': Config.TUTORIAL_STEP.FOCUS_INTRO,
            'studyScreen': Config.TUTORIAL_STEP.STUDY_INTRO,
            'repositoryScreen': Config.TUTORIAL_STEP.REPOSITORY_INTRO,
        };
        const requiredStep = tutorialTriggers[screenId];

        if (requiredStep && tutorialSteps[requiredStep]) {
             const stepOrder = Object.values(Config.TUTORIAL_STEP);
             const currentStepIndex = stepOrder.indexOf(tutorialStep);
             const requiredStepIndex = stepOrder.indexOf(requiredStep);

             if (currentStepIndex < requiredStepIndex) {
                console.log(`UI: Intercepting screen '${screenId}'. Current step '${tutorialStep}' < Required step '${requiredStep}'. Showing tutorial.`);
                currentTutorialScreenTarget = screenId;
                showTutorialStep(requiredStep);
                return;
            }
        }
    }
    // --- End Tutorial Interception ---

    console.log(`UI: Proceeding to show screen '${screenId}'.`);
    const currentState = State.getState();
    const isPostQuestionnaire = currentState.questionnaireCompleted;
    const isTutorialComplete = currentState.onboardingTutorialStep === Config.TUTORIAL_STEP.COMPLETE;

    screens.forEach(screen => {
        screen?.classList.toggle('current', screen.id === screenId);
        screen?.classList.toggle('hidden', screen.id !== screenId);
    });

    if (mainNavBar) {
        const showNav = isPostQuestionnaire && isTutorialComplete;
        mainNavBar.classList.toggle('hidden', !showNav || screenId === 'welcomeScreen' || screenId === 'questionnaireScreen');
    }

    navButtons.forEach(button => {
        if (button) button.classList.toggle('active', button.dataset.target === screenId);
    });

    if (isPostQuestionnaire || screenId === 'questionnaireScreen') {
         if (screenId === 'personaScreen') GameLogic.displayPersonaScreenLogic();
         else if (screenId === 'studyScreen') GameLogic.displayStudyScreenLogic();
         else if (screenId === 'grimoireScreen') refreshGrimoireDisplay();
         else if (screenId === 'repositoryScreen') displayRepositoryContent();
    }

    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
    applyOnboardingPhaseUI(State.getOnboardingPhase());
}

// --- Post-Questionnaire "Starting Nebula" Modal ---
export function showStartingNebulaModal(finalScores, starterConcepts) {
    console.log("UI: Showing Starting Nebula Modal");
    if (!startingNebulaModal || !nebulaModalContent || !viewStarCatalogButton || !popupOverlay) {
        console.error("Starting Nebula Modal elements missing! Skipping.");
        State.setOnboardingTutorialStep(Config.TUTORIAL_STEP.GRIMOIRE_INTRO); showScreen('grimoireScreen'); return;
    }
    let contentHTML = `<h2>Initial Analysis Complete!</h2><p>Your core elemental balance:</p><div class="nebula-scores">`;
    if (elementDetails && elementNameToKey) { elementNames.forEach(elName => { const key = elementNameToKey[elName]; const score = finalScores[key]; const scoreLabel = Utils.getScoreLabel(score); const color = Utils.getElementColor(elName); const barWidth = score ? (score / 10) * 100 : 0; contentHTML += `<div class="nebula-score-item"><strong>${elementDetails[elName]?.name || elName}:</strong><span>${score?.toFixed(1) ?? '?'}</span> <span class="score-label">(${scoreLabel})</span><div class="score-bar-container"><div style="width: ${barWidth}%; background-color: ${color};"></div></div></div>`; }); }
    else { contentHTML += "<p>Error displaying scores.</p>"; } contentHTML += `</div><hr><p>Initial resonant Concepts added to Grimoire:</p><div class="nebula-concepts"><ul>`; starterConcepts.forEach(concept => { contentHTML += `<li><i class="${Utils.getCardTypeIcon(concept.cardType)}"></i> ${concept.name} (${concept.rarity})</li>`; }); contentHTML += `</ul></div>`; nebulaModalContent.innerHTML = contentHTML;
    viewStarCatalogButton.onclick = () => { hideStartingNebulaModal(); State.setOnboardingTutorialStep(Config.TUTORIAL_STEP.GRIMOIRE_INTRO); showScreen('grimoireScreen'); };
    if (closeStartingNebulaButton) { closeStartingNebulaButton.onclick = () => { hideStartingNebulaModal(); State.setOnboardingTutorialStep(Config.TUTORIAL_STEP.GRIMOIRE_INTRO); showScreen('grimoireScreen'); }; }
    startingNebulaModal.classList.remove('hidden'); popupOverlay.classList.remove('hidden');
}

function hideStartingNebulaModal() {
    if (startingNebulaModal) startingNebulaModal.classList.add('hidden');
    // Keep overlay visible if tutorial modal follows immediately
}

// --- Utility UI Functions ---
export function showTemporaryMessage(message, duration = 3000) {
    if (!toastElement || !toastMessageElement) { console.warn("Toast elements missing:", message); return; } console.info(`Toast: ${message}`); toastMessageElement.textContent = message; if (toastTimeout) { clearTimeout(toastTimeout); } toastElement.classList.remove('hidden', 'visible'); void toastElement.offsetWidth; toastElement.classList.add('visible'); toastElement.classList.remove('hidden'); toastTimeout = setTimeout(() => { toastElement.classList.remove('visible'); setTimeout(() => { if (!toastElement.classList.contains('visible')) { toastElement.classList.add('hidden'); } }, 500); toastTimeout = null; }, duration);
}

export function showMilestoneAlert(text) {
    if (!milestoneAlert || !milestoneAlertText) return; milestoneAlertText.textContent = `Milestone: ${text}`; milestoneAlert.classList.remove('hidden'); if (milestoneTimeout) clearTimeout(milestoneTimeout); milestoneTimeout = setTimeout(hideMilestoneAlert, 5000);
}
export function hideMilestoneAlert() {
    if (milestoneAlert) milestoneAlert.classList.add('hidden'); if (milestoneTimeout) clearTimeout(milestoneTimeout); milestoneTimeout = null;
}
export function hidePopups() {
    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (settingsPopup) settingsPopup.classList.add('hidden');
    if (tapestryDeepDiveModal) tapestryDeepDiveModal.classList.add('hidden');
    if (startingNebulaModal) startingNebulaModal.classList.add('hidden');
    if (tutorialModal) tutorialModal.classList.add('hidden');
    if (popupOverlay) popupOverlay.classList.add('hidden');
    GameLogic.clearPopupState();
    removeHighlight();
}

// --- Onboarding UI Adjustments ---
export function applyOnboardingPhaseUI(phase) {
    console.log(`UI: Applying onboarding phase ${phase} visibility rules`);
    const tutorialComplete = State.getOnboardingTutorialStep() === Config.TUTORIAL_STEP.COMPLETE;
    const canSeeFocus = phase >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; const canSeeStudy = phase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT; const canSeeSell = phase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT; const canSeeReflection = phase >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS; const canSeeRituals = phase >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS; const canSeeAdvanced = phase >= Config.ONBOARDING_PHASE.ADVANCED;
    navButtons.forEach(button => { if (!button) return; const target = button.dataset.target; let hide = false; if (target === 'studyScreen' && !canSeeStudy && tutorialComplete) hide = true; else if (target === 'repositoryScreen' && !canSeeAdvanced && tutorialComplete) hide = true; button.classList.toggle('hidden-by-flow', hide); });
    const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container'); deepDiveContainers?.forEach(container => container.classList.toggle('hidden', !canSeeAdvanced));
    if (grimoireFilterControls) grimoireFilterControls.classList.toggle('hidden-by-flow', !canSeeStudy && tutorialComplete);
    if (seekGuidanceButton) seekGuidanceButton.classList.toggle('hidden-by-flow', !canSeeReflection && tutorialComplete); const ritualsAlcove = studyScreen?.querySelector('.rituals-alcove'); if (ritualsAlcove) ritualsAlcove.classList.toggle('hidden-by-flow', !canSeeRituals && tutorialComplete);
    const popupConceptId = GameLogic.getCurrentPopupConceptId(); if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) { const discoveredData = State.getDiscoveredConceptData(popupConceptId); const concept = concepts.find(c => c.id === popupConceptId); const inResearch = !discoveredData && researchOutput?.querySelector(`.research-result-item[data-concept-id="${popupConceptId}"]`); updateFocusButtonStatus(popupConceptId); updatePopupSellButton(popupConceptId, concept, !!discoveredData, !!inResearch); if (myNotesSection) myNotesSection.classList.toggle('hidden', !canSeeSell || !discoveredData); if (popupEvolutionSection) popupEvolutionSection.classList.toggle('hidden', !canSeeAdvanced || !discoveredData || !concept?.canUnlockArt || discoveredData?.artUnlocked); if(concept && discoveredData && canSeeAdvanced) displayEvolutionSection(concept, discoveredData); }
    updateTapestryDeepDiveButton(); updateSuggestSceneButtonState();
}

// --- Insight Display ---
export function updateInsightDisplays() {
    const insight = State.getInsight().toFixed(1); if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight; if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = insight; displayResearchButtons(); if (seekGuidanceButton) seekGuidanceButton.disabled = State.getInsight() < Config.GUIDED_REFLECTION_COST; if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
    if (personaScreen?.classList.contains('current') && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED) { const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container'); deepDiveContainers?.forEach(container => { const elementKey = container.dataset.elementKey; if (elementKey) { const targetContainer = personaElementDetailsDiv?.querySelector(`.element-deep-dive-container[data-element-key="${elementKey}"]`); if(targetContainer) displayElementDeepDive(elementKey, targetContainer); } }); }
    if (repositoryScreen && repositoryScreen.classList.contains('current')) { displayRepositoryContent(); } const popupConceptId = GameLogic.getCurrentPopupConceptId(); if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) { const concept = concepts.find(c => c.id === popupConceptId); const discoveredData = State.getDiscoveredConceptData(popupConceptId); if(concept && discoveredData) displayEvolutionSection(concept, discoveredData); } updateContemplationButtonState(); updateSuggestSceneButtonState();
}

// --- Questionnaire UI ---
export function initializeQuestionnaireUI() { /* ... keep existing ... */
    updateElementProgressHeader(-1); displayElementQuestions(0); if (mainNavBar) mainNavBar.classList.add('hidden'); if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none';
}
export function updateElementProgressHeader(activeIndex) { /* ... keep existing ... */
    if (!elementProgressHeader) return; elementProgressHeader.innerHTML = ''; elementNames.forEach((name, index) => { const tab = document.createElement('div'); tab.classList.add('element-tab'); const elementData = elementDetails[name] || {}; tab.textContent = elementData.name || name; tab.title = elementData.name || name; tab.classList.toggle('completed', index < activeIndex); tab.classList.toggle('active', index === activeIndex); elementProgressHeader.appendChild(tab); });
}
export function displayElementQuestions(index) {
    // Moved State update to the top to fix timing issue
    State.updateElementIndex(index);

    const currentState = State.getState();
    if (index >= elementNames.length) { const lastElementIndex = elementNames.length - 1; if (lastElementIndex >= 0) { const finalAnswers = getQuestionnaireAnswers(); State.updateAnswers(elementNames[lastElementIndex], finalAnswers); } GameLogic.finalizeQuestionnaire(); return; }
    const elementName = elementNames[index]; const elementData = elementDetails[elementName] || {}; const questions = questionnaireGuided[elementName] || []; if (!questionContent) { console.error("questionContent element missing!"); return; } const elementAnswers = currentState.userAnswers?.[elementName] || {}; console.log(`UI: Displaying questions for Index ${index} (${elementName}). Initial answers from state:`, JSON.parse(JSON.stringify(elementAnswers)));
    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`; let questionsHTML = '';
    questions.forEach(q => { let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`; const savedAnswer = elementAnswers[q.qId]; if (q.type === "slider") { const val = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${val}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(val).toFixed(1)}</span></p><p class="slider-feedback" id="feedback_${q.qId}"></p></div>`; } else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const checked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; } else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; } inputHTML += `</div></div>`; questionsHTML += inputHTML; }); if(questions.length === 0) questionsHTML = '<p><em>(No questions for this element)</em></p>';
    questionContent.innerHTML = introHTML; const introDiv = questionContent.querySelector('.element-intro'); if (introDiv) introDiv.insertAdjacentHTML('afterend', questionsHTML); else questionContent.innerHTML += questionsHTML;
    questionContent.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange); input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange); }); questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => { checkbox.removeEventListener('change', GameLogic.handleCheckboxChange); checkbox.addEventListener('change', GameLogic.handleCheckboxChange); });
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block'; questionContent.querySelectorAll('.slider.q-input').forEach(slider => { updateSliderFeedbackText(slider, elementName); }); updateDynamicFeedback(elementName, elementAnswers); updateElementProgressHeader(index); if (progressText) progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || elementName}`; if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; if (nextElementButton) nextElementButton.textContent = (index === elementNames.length - 1) ? "View Results" : "Next Element";
}

// --- Study Screen UI (No Changes Needed) ---
export function displayStudyScreenContent() { /* ... keep existing ... */
    console.log("UI: Displaying Study Screen Content");
    updateInsightDisplays(); displayDailyRituals(); applyOnboardingPhaseUI(State.getOnboardingPhase());
}
export function displayResearchButtons() { /* ... keep existing ... */
    if (!researchButtonContainer) return; researchButtonContainer.innerHTML = '';
    const insight = State.getInsight(); const attunement = State.getAttunement();
    if (freeResearchButton) { const available = State.isFreeResearchAvailable(); const showFreeResearch = available && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT; freeResearchButton.classList.toggle('hidden', !showFreeResearch); freeResearchButton.disabled = !available; freeResearchButton.textContent = available ? "Perform Daily Meditation (Free Research)" : "Daily Meditation Performed"; if (!available && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) freeResearchButton.classList.remove('hidden'); }
    elementNames.forEach(elName => { const key = elementNameToKey[elName]; const currentAttunement = attunement[key] || 0; let currentCost = Config.BASE_RESEARCH_COST; if (currentAttunement > 80) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 5); else if (currentAttunement > 50) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 3); const canAfford = insight >= currentCost; const fullName = elementDetails[elName]?.name || elName; const button = document.createElement('button'); button.classList.add('button', 'research-button'); button.dataset.elementKey = key; button.dataset.cost = currentCost; button.disabled = !canAfford; button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`; button.innerHTML = `<span class="research-el-icon" style="color: ${Utils.getElementColor(elName)};"><i class="${Utils.getElementIcon(fullName)}"></i></span><span class="research-el-name">${fullName}</span><span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span>`; researchButtonContainer.appendChild(button); });
    if (seekGuidanceButton) seekGuidanceButton.disabled = insight < Config.GUIDED_REFLECTION_COST; if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
}
export function displayDailyRituals() { /* ... keep existing ... */
     if (!dailyRitualsDisplay) return; dailyRitualsDisplay.innerHTML = '';
     const completed = State.getState().completedRituals.daily || {}; const focused = State.getFocusedConcepts();
     let activeRituals = [...dailyRituals]; if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFocused = true; for (const id of reqIds) { if (!focused.has(id)) { allFocused = false; break; } } if (allFocused) activeRituals.push({ ...ritual, isFocusRitual: true }); }); }
     if(State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) { dailyRitualsDisplay.innerHTML = '<li>Unlock rituals by progressing.</li>'; return; }
     if (activeRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No daily rituals currently active.</li>'; return; }
     activeRituals.forEach(ritual => { const completedData = completed[ritual.id] || { completed: false, progress: 0 }; const isCompleted = completedData.completed; const li = document.createElement('li'); li.classList.toggle('completed', isCompleted); if(ritual.isFocusRitual) li.classList.add('focus-ritual'); let rewardText = ''; if (ritual.reward) { if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`; else if (ritual.reward.type === 'attunement') { const elName = ritual.reward.element === 'All' ? 'All' : (elementKeyToFullName[ritual.reward.element] || ritual.reward.element); rewardText = `(+${ritual.reward.amount} ${elName} Attun.)`; } else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`; } li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`; dailyRitualsDisplay.appendChild(li); });
}
export function displayResearchStatus(message) { /* ... keep existing ... */
 if (researchStatus) researchStatus.textContent = message; }
export function displayResearchResults(results) { /* ... keep existing ... */
    if (!researchOutput) return; const { concepts: foundConcepts, repositoryItems, duplicateInsightGain } = results;
    if (foundConcepts.length > 0 || repositoryItems.length > 0) { const placeholder = researchOutput.querySelector('p > i'); if(placeholder && placeholder.parentElement.children.length === 1) placeholder.parentElement.innerHTML = ''; }
    if (duplicateInsightGain > 0) { const dupeMsg = document.createElement('p'); dupeMsg.classList.add('duplicate-message'); dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate research echoes.`; researchOutput.prepend(dupeMsg); setTimeout(() => dupeMsg.remove(), 5000); }
    foundConcepts.forEach(concept => { if (!researchOutput.querySelector(`.research-result-item[data-concept-id="${concept.id}"]`)) { const resultItemDiv = document.createElement('div'); resultItemDiv.classList.add('research-result-item'); resultItemDiv.dataset.conceptId = concept.id; const cardElement = renderCard(concept, 'research-output'); resultItemDiv.appendChild(cardElement); const actionDiv = document.createElement('div'); actionDiv.classList.add('research-actions'); const addButton = document.createElement('button'); addButton.textContent = "Add to Grimoire"; addButton.classList.add('button', 'small-button', 'research-action-button', 'add-button'); addButton.dataset.conceptId = concept.id; let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR; const sellButton = document.createElement('button'); sellButton.textContent = `Sell (${sellValue.toFixed(1)}) `; sellButton.innerHTML += `<i class="fas fa-brain insight-icon"></i>`; sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button'); sellButton.dataset.conceptId = concept.id; sellButton.dataset.context = 'research'; sellButton.title = `Sell for ${sellValue.toFixed(1)} Insight.`; actionDiv.appendChild(addButton); actionDiv.appendChild(sellButton); resultItemDiv.appendChild(actionDiv); researchOutput.appendChild(resultItemDiv); } });
    repositoryItems.forEach(item => { if (researchOutput.querySelector(`[data-repo-id="${item.id}"]`)) return; const itemDiv = document.createElement('div'); itemDiv.classList.add('repository-item-discovery'); itemDiv.dataset.repoId = item.id; let iconClass = 'fa-question-circle'; let typeName = 'Item'; if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; } else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; } itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered '${item.name}'. View it in the Repository.`}</p>`; researchOutput.prepend(itemDiv); setTimeout(() => itemDiv.remove(), 7000); });
    if (researchOutput.children.length === 0 && foundConcepts.length === 0 && repositoryItems.length === 0) { researchOutput.innerHTML = '<p><i>Familiar thoughts echo...</i></p>'; }
}
export function updateResearchButtonAfterAction(conceptId, action) { /* ... keep existing ... */
    const itemDiv = researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`); if (!itemDiv) return;
    if (action === 'add' || action === 'sell') { itemDiv.remove(); if (researchOutput && researchOutput.children.length === 0) { researchOutput.innerHTML = '<p><i>Research results cleared.</i></p>'; if (action === 'sell' && researchStatus) { researchStatus.textContent = "Ready for new research."; } } }
}

// --- Grimoire Screen UI (No Changes Needed) ---
export function updateGrimoireCounter() { /* ... keep existing ... */
 if (grimoireCountSpan) grimoireCountSpan.textContent = State.getDiscoveredConcepts().size; }
export function populateGrimoireFilters() { /* ... keep existing ... */
    if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); }
    if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = fullName; option.textContent = name; grimoireElementFilter.appendChild(option); }); }
}
export function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All", searchTerm = "", filterFocus = "All") { /* ... keep existing ... */
    if (!grimoireContentDiv) return; grimoireContentDiv.innerHTML = ''; const discoveredMap = State.getDiscoveredConcepts(); if (discoveredMap.size === 0) { grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty...</p>'; return; } const userScores = State.getScores(); const focusedSet = State.getFocusedConcepts(); let discoveredArray = Array.from(discoveredMap.values()); if (filterElement !== "All" && typeof elementNameToKey === 'undefined') { console.error("UI Error: elementNameToKey map unavailable."); return; } const searchTermLower = searchTerm.toLowerCase().trim(); const conceptsToDisplay = discoveredArray.filter(data => { if (!data?.concept) return false; const concept = data.concept; const typeMatch = (filterType === "All") || (concept.cardType === filterType); const elementKey = (filterElement !== "All" && elementNameToKey) ? elementNameToKey[filterElement] : "All"; if (filterElement !== "All" && !elementKey) { console.warn(`UI: Could not find key for filterElement '${filterElement}'.`); } const elementMatch = (elementKey === "All") || (concept.primaryElement === elementKey); const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity); const focusMatch = (filterFocus === 'All') || (filterFocus === 'Focused' && focusedSet.has(concept.id)) || (filterFocus === 'Not Focused' && !focusedSet.has(concept.id)); const searchMatch = !searchTermLower || (concept.name.toLowerCase().includes(searchTermLower)) || (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTermLower))); return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch; }); const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 }; conceptsToDisplay.sort((a, b) => { if (!a.concept || !b.concept) return 0; switch (sortBy) { case 'name': return a.concept.name.localeCompare(b.concept.name); case 'type': return (cardTypeKeys.indexOf(a.concept.cardType) - cardTypeKeys.indexOf(b.concept.cardType)) || a.concept.name.localeCompare(b.concept.name); case 'rarity': return (rarityOrder[a.concept.rarity] || 0) - (rarityOrder[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name); case 'resonance': const distA = Utils.euclideanDistance(userScores, a.concept.elementScores); const distB = Utils.euclideanDistance(userScores, b.concept.elementScores); return distA - distB || a.concept.name.localeCompare(b.concept.name); default: return (a.discoveredTime || 0) - (b.discoveredTime || 0) || a.concept.name.localeCompare(b.concept.name); } }); if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p>No discovered concepts match filters${searchTermLower ? ' or search' : ''}.</p>`; } else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); if (cardElement) { cardElement.addEventListener('mouseover', (event) => { const currentCard = event.currentTarget; const conceptId = parseInt(currentCard.dataset.conceptId); const conceptData = State.getDiscoveredConceptData(conceptId)?.concept; if (!conceptData || !conceptData.relatedIds) return; currentCard.classList.add('hover-highlight'); const allCards = grimoireContentDiv.querySelectorAll('.concept-card'); allCards.forEach(card => { const cardId = parseInt(card.dataset.conceptId); if (conceptData.relatedIds.includes(cardId) && card !== currentCard) card.classList.add('related-highlight'); }); }); cardElement.addEventListener('mouseout', (event) => { event.currentTarget.classList.remove('hover-highlight'); grimoireContentDiv.querySelectorAll('.concept-card').forEach(card => card.classList.remove('related-highlight')); }); grimoireContentDiv.appendChild(cardElement); } }); }
}
export function refreshGrimoireDisplay() { /* ... keep existing ... */
     if (grimoireScreen && !grimoireScreen.classList.contains('hidden')) { const typeValue = grimoireTypeFilter?.value || "All"; const elementValue = grimoireElementFilter?.value || "All"; const sortValue = grimoireSortOrder?.value || "discovered"; const rarityValue = grimoireRarityFilter?.value || "All"; const searchValue = grimoireSearchInput?.value || ""; const focusValue = grimoireFocusFilter?.value || "All"; displayGrimoire(typeValue, elementValue, sortValue, rarityValue, searchValue, focusValue); }
}

// --- Card Rendering (No Changes Needed) ---
export function renderCard(concept, context = 'grimoire') { /* ... keep existing ... */
    if (!concept || typeof concept.id === 'undefined') { console.warn("renderCard invalid concept:", concept); const d = document.createElement('div'); d.textContent = "Error"; return d; }
    const cardDiv = document.createElement('div'); cardDiv.classList.add('concept-card'); cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`); cardDiv.dataset.conceptId = concept.id; cardDiv.title = `View ${concept.name}`;
    const discoveredData = State.getDiscoveredConceptData(concept.id); const isDiscovered = !!discoveredData; const isFocused = State.getFocusedConcepts().has(concept.id); const artUnlocked = discoveredData?.artUnlocked || false; const showFocusStar = isFocused && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : ''; const focusStampHTML = showFocusStar ? '<span class="focus-indicator" title="Focused Concept">★</span>' : ''; const cardTypeIcon = Utils.getCardTypeIcon(concept.cardType); let affinitiesHTML = '';
    if (concept.elementScores && elementKeyToFullName) { Object.entries(concept.elementScores).forEach(([key, score]) => { const level = Utils.getAffinityLevel(score); if (level && elementKeyToFullName[key]) { const fullName = elementKeyToFullName[key]; const color = Utils.getElementColor(fullName); const iconClass = Utils.getElementIcon(fullName); const elementNameDetail = elementDetails[fullName]?.name || fullName; affinitiesHTML += `<span class="affinity affinity-${level.toLowerCase()}" style="border-color: ${color}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="${elementNameDetail} Affinity: ${level} (${score.toFixed(1)})"><i class="${iconClass}" style="color: ${color};"></i></span> `; } }); }
    let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder"; if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; } else if (concept.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; } const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`; let sellButtonHTML = '';
    if (context === 'grimoire' && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) { let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR; sellButtonHTML = `<button class="button small-button secondary-button sell-button card-sell-button" data-concept-id="${concept.id}" data-context="grimoire" title="Sell for ${sellValue.toFixed(1)} Insight.">Sell <i class="fas fa-brain insight-icon"></i>${sellValue.toFixed(1)}</button>`; }
    cardDiv.innerHTML = `<div class="card-header"><i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i><span class="card-name">${concept.name}</span><span class="card-stamps">${focusStampHTML}${grimoireStampHTML}</span></div><div class="card-visual">${visualContent}</div><div class="card-footer"><div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div><p class="card-brief-desc">${concept.briefDescription || '...'}</p>${sellButtonHTML}</div>`;
    if (context !== 'no-click') { cardDiv.addEventListener('click', (event) => { if (event.target.closest('button')) return; showConceptDetailPopup(concept.id); }); }
    if (context === 'research-output') { cardDiv.title = `Click to view details (Not in Grimoire)`; cardDiv.querySelector('.card-footer .sell-button')?.remove(); }
    return cardDiv;
}


// --- Concept Detail Popup UI (No Changes Needed) ---
export function showConceptDetailPopup(conceptId) { /* ... keep existing ... */
    const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData) { console.error("Concept data missing:", conceptId); return; }
    const discoveredData = State.getDiscoveredConceptData(conceptId); const inGrimoire = !!discoveredData;
    const inResearchNotes = !inGrimoire && researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`); const currentPhase = State.getOnboardingPhase(); GameLogic.setCurrentPopupConcept(conceptId);
    if (popupConceptName) popupConceptName.textContent = conceptData.name; if (popupConceptType) popupConceptType.textContent = conceptData.cardType; if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`; if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No description.";
    const artUnlocked = discoveredData?.artUnlocked || false; if (popupVisualContainer) { popupVisualContainer.innerHTML = ''; let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder"; if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; } else if (conceptData.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; } const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`; popupVisualContainer.innerHTML = visualContent; }
    const scores = State.getScores(); const distance = Utils.euclideanDistance(scores, conceptData.elementScores); displayPopupResonance(distance); displayPopupRecipeComparison(conceptData, scores); displayPopupRelatedConcepts(conceptData);
    const showNotes = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT; if (myNotesSection && myNotesTextarea && saveMyNoteButton) { myNotesSection.classList.toggle('hidden', !showNotes); if (showNotes) { myNotesTextarea.value = discoveredData.notes || ""; if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; } }
    const showEvolution = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED; if (popupEvolutionSection) { popupEvolutionSection.classList.toggle('hidden', !showEvolution); if (showEvolution) displayEvolutionSection(conceptData, discoveredData); }
    updateGrimoireButtonStatus(conceptId, !!inResearchNotes); updateFocusButtonStatus(conceptId); updatePopupSellButton(conceptId, conceptData, inGrimoire, !!inResearchNotes);
    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}
export function displayPopupResonance(distance) { /* ... keep existing ... */
    if (!popupResonanceSummary) return; let resonanceLabel, resonanceClass, message; if (distance === Infinity || isNaN(distance)) { resonanceLabel = "N/A"; resonanceClass = ""; message = "(Cannot compare)"; } else if (distance < 2.5) { resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strongly aligns."; } else if (distance < 4.0) { resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares common ground."; } else if (distance < 6.0) { resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities."; } else if (distance <= Config.DISSONANCE_THRESHOLD) { resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence."; } else { resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significant divergence."; } popupResonanceSummary.innerHTML = `Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> <small>(Dist: ${distance.toFixed(1)})</small><br><small>${message}</small> <i class="fas fa-info-circle info-icon" title="How closely this Concept's elemental scores align with your Core Foundation scores."></i>`;
}
export function displayPopupRecipeComparison(conceptData, userCompScores) { /* ... keep existing ... */
     if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return; popupConceptProfile.innerHTML = ''; popupUserComparisonProfile.innerHTML = ''; popupComparisonHighlights.innerHTML = ''; let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>'; let hasHighlights = false; const conceptScores = conceptData.elementScores || {};
     elementNames.forEach(elName => { const key = elementNameToKey[elName]; const fullName = elementKeyToFullName[key]; if (!fullName) return; const conceptScore = conceptScores[key]; const userScore = userCompScores[key]; const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore); const userScoreValid = typeof userScore === 'number' && !isNaN(userScore); const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?'; const userDisplay = userScoreValid ? userScore.toFixed(1) : '?'; const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A'; const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A'; const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0; const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0; const color = Utils.getElementColor(fullName); const elementNameShort = elementDetails[fullName]?.name.substring(0, 11) || elName; popupConceptProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${conceptDisplay}</span> <div class="score-bar-container" title="${conceptLabel}"><div style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`; popupUserComparisonProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${userDisplay}</span> <div class="score-bar-container" title="${userLabel}"><div style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`; if (conceptScoreValid && userScoreValid) { const diff = Math.abs(conceptScore - userScore); const elementNameDisplay = elementDetails[fullName]?.name || elName; if (conceptScore >= 7 && userScore >= 7) { highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true; } else if (conceptScore <= 3 && userScore <= 3) { highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true; } else if (diff >= 4) { highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept: ${conceptLabel}, You: ${userLabel})</p>`; hasHighlights = true; } } }); if (!hasHighlights) highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>'; popupComparisonHighlights.innerHTML = highlightsHTML;
}
export function displayPopupRelatedConcepts(conceptData) { /* ... keep existing ... */
     if (!popupRelatedConcepts) return; popupRelatedConcepts.innerHTML = ''; if (conceptData.relatedIds && conceptData.relatedIds.length > 0) { const details = document.createElement('details'); details.classList.add('related-concepts-details'); const summary = document.createElement('summary'); summary.innerHTML = `Synergies / Related (${conceptData.relatedIds.length}) <i class="fas fa-info-circle info-icon" title="Concepts with thematic/functional relationships."></i>`; details.appendChild(summary); const listDiv = document.createElement('div'); listDiv.classList.add('related-concepts-list-dropdown'); let foundCount = 0; conceptData.relatedIds.forEach(relatedId => { const relatedConcept = concepts.find(c => c.id === relatedId); if (relatedConcept) { const span = document.createElement('span'); span.textContent = relatedConcept.name; span.classList.add('related-concept-item'); span.title = `Related: ${relatedConcept.name}`; listDiv.appendChild(span); foundCount++; } else { console.warn(`Related concept ID ${relatedId} in ${conceptData.id} not found.`); } }); if (foundCount > 0) { details.appendChild(listDiv); popupRelatedConcepts.appendChild(details); } else { popupRelatedConcepts.innerHTML = `<details class="related-concepts-details"><summary>Synergies / Related <i class="fas fa-info-circle info-icon" title="..."></i></summary><p>Error: Related concepts not found.</p></details>`; } } else { popupRelatedConcepts.innerHTML = `<details class="related-concepts-details"><summary>Synergies / Related <i class="fas fa-info-circle info-icon" title="..."></i></summary><p>None specified.</p></details>`; }
}
export function displayEvolutionSection(conceptData, discoveredData) { /* ... keep existing ... */
     if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return; const isDiscovered = !!discoveredData; const canUnlockArt = conceptData.canUnlockArt; const alreadyUnlocked = discoveredData?.artUnlocked || false; const isFocused = State.getFocusedConcepts().has(conceptData.id); const hasReflected = State.getState().seenPrompts.size > 0; const hasEnoughInsight = State.getInsight() >= Config.ART_EVOLVE_COST; const currentPhase = State.getOnboardingPhase(); const showSection = isDiscovered && canUnlockArt && !alreadyUnlocked && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED; popupEvolutionSection.classList.toggle('hidden', !showSection); if (!showSection) { evolveArtButton.disabled = true; evolveEligibility.classList.add('hidden'); return; } evolveCostSpan.textContent = `${Config.ART_EVOLVE_COST}`; let eligibilityText = ''; let canEvolve = true; if (!isFocused) { eligibilityText += '<li>Requires: Mark as Focus</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Focused</li>'; } if (!hasReflected) { eligibilityText += '<li>Requires: Engage in Reflection</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Reflected</li>'; } if (!hasEnoughInsight) { eligibilityText += `<li>Requires: ${Config.ART_EVOLVE_COST} Insight</li>`; canEvolve = false;} else { eligibilityText += `<li><i class="fas fa-check"></i> Insight OK</li>`; } evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`; evolveEligibility.classList.remove('hidden'); evolveArtButton.disabled = !canEvolve;
}
export function updateGrimoireButtonStatus(conceptId, inResearchNotes = false) { /* ... keep existing ... */
    if (!addToGrimoireButton) return; const isDiscovered = State.getDiscoveredConcepts().has(conceptId); addToGrimoireButton.classList.toggle('hidden', isDiscovered); addToGrimoireButton.disabled = false; addToGrimoireButton.textContent = "Add to Grimoire"; addToGrimoireButton.classList.remove('added');
}
export function updateFocusButtonStatus(conceptId) { /* ... keep existing ... */
    if (!markAsFocusButton) return; const isDiscovered = State.getDiscoveredConcepts().has(conceptId); const isFocused = State.getFocusedConcepts().has(conceptId); const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots(); const phaseAllowsFocus = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; const showButton = isDiscovered && phaseAllowsFocus; markAsFocusButton.classList.toggle('hidden', !showButton); if (showButton) { markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus"; markAsFocusButton.disabled = (slotsFull && !isFocused); markAsFocusButton.classList.toggle('marked', isFocused); markAsFocusButton.title = markAsFocusButton.disabled && !isFocused ? `Focus slots full (${State.getFocusSlots()})` : (isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts"); }
}
export function updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes) { /* ... keep existing ... */
    const popupActions = conceptDetailPopup?.querySelector('.popup-actions'); if (!popupActions || !conceptData) return; popupActions.querySelector('.popup-sell-button')?.remove(); const context = inGrimoire ? 'grimoire' : (inResearchNotes ? 'research' : 'none'); const phaseAllowsSell = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT; if (context !== 'none' && phaseAllowsSell) { let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[conceptData.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR; const sourceLocation = context === 'grimoire' ? 'Grimoire' : 'Research Notes'; const sellButton = document.createElement('button'); sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button', 'popup-sell-button'); sellButton.textContent = `Sell (${sellValue.toFixed(1)})`; sellButton.innerHTML += ` <i class="fas fa-brain insight-icon"></i>`; sellButton.dataset.conceptId = conceptId; sellButton.dataset.context = context; sellButton.title = `Sell from ${sourceLocation} for ${sellValue.toFixed(1)} Insight.`; if (markAsFocusButton && !markAsFocusButton.classList.contains('hidden')) { markAsFocusButton.insertAdjacentElement('afterend', sellButton); } else if (addToGrimoireButton && !addToGrimoireButton.classList.contains('hidden')) { addToGrimoireButton.insertAdjacentElement('afterend', sellButton); } else { popupActions.appendChild(sellButton); } }
}


// --- Reflection Modal UI (No Changes Needed) ---
export function displayReflectionPrompt(promptData, context) { /* ... keep existing ... */
    if (!reflectionModal || !promptData || !promptData.prompt) { console.error("Reflection modal or prompt data/text missing.", promptData); if (context === 'Dissonance') { const conceptId = GameLogic.getCurrentPopupConceptId(); if (conceptId) { console.warn("Reflection prompt missing for Dissonance, adding concept directly."); GameLogic.addConceptToGrimoireInternal(conceptId); hidePopups(); showTemporaryMessage("Reflection unavailable, concept added.", 3500); } else { showTemporaryMessage("Error: Could not display reflection.", 3000); } } else { showTemporaryMessage("Error: Could not display reflection.", 3000); } return; }
    const { title, category, prompt, showNudge, reward } = promptData; if (reflectionModalTitle) reflectionModalTitle.textContent = title || "Moment for Reflection"; if (reflectionElement) reflectionElement.textContent = category || "General"; if (reflectionPromptText) reflectionPromptText.textContent = prompt.text; if (reflectionCheckbox) reflectionCheckbox.checked = false; if (scoreNudgeCheckbox && scoreNudgeLabel) { scoreNudgeCheckbox.checked = false; scoreNudgeCheckbox.classList.toggle('hidden', !showNudge); scoreNudgeLabel.classList.toggle('hidden', !showNudge); } if (confirmReflectionButton) confirmReflectionButton.disabled = true; if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)}`; reflectionModal.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Integrated Element Deep Dive UI (No Changes Needed) ---
export function displayElementDeepDive(elementKey, targetContainerElement) { /* ... keep existing ... */
     if (!targetContainerElement) { targetContainerElement = personaElementDetailsDiv?.querySelector(`.element-deep-dive-container[data-element-key="${elementKey}"]`); if (!targetContainerElement) { console.error(`UI: Could not find target container for element ${elementKey}`); return; } }
     const deepDiveData = elementDeepDive[elementKey] || []; const unlockedLevels = State.getState().unlockedDeepDiveLevels; const currentLevel = unlockedLevels[elementKey] || 0; const elementName = elementKeyToFullName[elementKey] || elementKey; const insight = State.getInsight(); const showDeepDive = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED; targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${elementDetails[elementName]?.name || elementName} Insights</h5>`; if (!showDeepDive) { targetContainerElement.innerHTML += '<p><i>Unlock the Repository to delve deeper.</i></p>'; return; } if (deepDiveData.length === 0) { targetContainerElement.innerHTML += '<p>No deep dive content available.</p>'; return; } let displayedContent = false;
     deepDiveData.forEach(levelData => { if (levelData.level <= currentLevel) { targetContainerElement.innerHTML += `<div class="library-level"><h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5><div class="level-content">${levelData.content}</div></div><hr class="popup-hr">`; displayedContent = true; } }); if (!displayedContent && currentLevel === 0) targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${elementDetails[elementName]?.name || elementName} Insights</h5>`;
     const nextLevel = currentLevel + 1; const nextLevelData = deepDiveData.find(l => l.level === nextLevel); if (nextLevelData) { const cost = nextLevelData.insightCost || 0; const canAfford = insight >= cost; targetContainerElement.innerHTML += `<div class="library-unlock"><h5>Next: ${nextLevelData.title} (Level ${nextLevelData.level})</h5><button class="button small-button unlock-button" data-element-key="${elementKey}" data-level="${nextLevelData.level}" ${!canAfford ? 'disabled' : ''} title="${!canAfford ? `Requires ${cost} Insight` : `Unlock for ${cost} Insight`}">Unlock (${cost} <i class="fas fa-brain insight-icon"></i>)</button>${!canAfford ? `<p class='unlock-error'>Insufficient Insight (${insight.toFixed(1)}/${cost})</p>` : ''}</div>`; }
     else if (displayedContent) { targetContainerElement.innerHTML += '<p class="all-unlocked-message"><i>All insights unlocked.</i></p>'; } else if (!displayedContent && currentLevel > 0) targetContainerElement.innerHTML += '<p><i>Error displaying content.</i></p>';
}

// --- Repository UI (No Changes Needed) ---
export function displayRepositoryContent() { /* ... keep existing ... */
     const showRepository = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED; if (repositoryScreen) repositoryScreen.classList.toggle('hidden-by-flow', !showRepository); if(!showRepository) return; if (!repositoryFocusUnlocksDiv || !repositoryScenesDiv || !repositoryExperimentsDiv || !repositoryInsightsDiv) { console.error("Repo list containers missing!"); return; } console.log("UI: Displaying Repository Content"); repositoryFocusUnlocksDiv.innerHTML = ''; repositoryScenesDiv.innerHTML = ''; repositoryExperimentsDiv.innerHTML = ''; repositoryInsightsDiv.innerHTML = ''; const repoItems = State.getRepositoryItems(); const unlockedFocusData = State.getUnlockedFocusItems(); const attunement = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();
     if (unlockedFocusData.size > 0) { unlockedFocusData.forEach(unlockId => { const unlockData = focusDrivenUnlocks.find(u => u.id === unlockId); if (unlockData?.unlocks) { const item = unlockData.unlocks; const div = document.createElement('div'); div.classList.add('repository-item', 'focus-unlock-item'); let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`; if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`; if (item.type === 'insightFragment') { const iData = elementalInsights.find(i => i.id === item.id); itemHTML += `<p><em>"${iData?.text || item.text || "..."}"</em></p>`; } else itemHTML += `<p>Details below.</p>`; div.innerHTML = itemHTML; repositoryFocusUnlocksDiv.appendChild(div); } }); } else { repositoryFocusUnlocksDiv.innerHTML = '<p>Focus synergistic Concepts to unlock items.</p>'; }
     if (repoItems.scenes.size > 0) { repoItems.scenes.forEach(sceneId => { const scene = sceneBlueprints.find(s => s.id === sceneId); if (scene) { const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST; const canAfford = insight >= cost; repositoryScenesDiv.appendChild(renderRepositoryItem(scene, 'scene', cost, canAfford)); } else { console.warn(`Scene ID ${sceneId} not found.`); } }); } else { repositoryScenesDiv.innerHTML = '<p>No Scene Blueprints discovered.</p>'; }
     let experimentsDisplayed = 0; alchemicalExperiments.forEach(exp => { const isUnlockedByAttunement = attunement[exp.requiredElement] >= exp.requiredAttunement; const alreadyCompleted = repoItems.experiments.has(exp.id); if (isUnlockedByAttunement) { let canAttempt = true; let unmetReqs = []; if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } } if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let typeMet = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { typeMet = true; break; } } if (!typeMet) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } } const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST; const canAfford = insight >= cost; if (!canAfford) unmetReqs.push("Insight"); repositoryExperimentsDiv.appendChild(renderRepositoryItem(exp, 'experiment', cost, canAfford && canAttempt && !alreadyCompleted, alreadyCompleted, unmetReqs)); experimentsDisplayed++; } }); if (experimentsDisplayed === 0) { repositoryExperimentsDiv.innerHTML = '<p>Increase Attunement to unlock Experiments.</p>'; }
     if (repoItems.insights.size > 0) { const insightsByElement = {}; elementNames.forEach(elName => insightsByElement[elementNameToKey[elName]] = []); repoItems.insights.forEach(insightId => { const insight = elementalInsights.find(i => i.id === insightId); if (insight) { if (!insightsByElement[insight.element]) insightsByElement[insight.element] = []; insightsByElement[insight.element].push(insight); } else { console.warn(`Insight ID ${insightId} not found.`); } }); let insightsHTML = ''; for (const key in insightsByElement) { if (insightsByElement[key].length > 0) { insightsHTML += `<h5>${elementDetails[elementKeyToFullName[key]]?.name || key} Insights:</h5><ul>`; insightsByElement[key].sort((a, b) => a.id.localeCompare(b.id)).forEach(insight => { insightsHTML += `<li>"${insight.text}"</li>`; }); insightsHTML += `</ul>`; } } repositoryInsightsDiv.innerHTML = insightsHTML || '<p>No Elemental Insights collected.</p>'; } else { repositoryInsightsDiv.innerHTML = '<p>No Elemental Insights collected.</p>'; }
     displayMilestones(); GameLogic.updateMilestoneProgress('repositoryContents', null);
 }
export function renderRepositoryItem(item, type, cost, canAfford, completed = false, unmetReqs = []) { /* ... keep existing ... */
     const div = document.createElement('div'); div.classList.add('repository-item', `repo-item-${type}`); if (completed) div.classList.add('completed'); let actionsHTML = ''; let buttonDisabled = (type === 'experiment') ? (!canAfford || completed || unmetReqs.length > 0) : !canAfford; let buttonTitle = ''; let buttonText = '';
     if (type === 'scene') { buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (!canAfford) buttonTitle = `Requires ${cost} Insight`; actionsHTML = `<button class="button small-button" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`; }
     else if (type === 'experiment') { buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (completed) buttonTitle = "Completed"; else if (unmetReqs.length > 0 && unmetReqs[0] === "Insight") buttonTitle = `Requires ${cost} Insight`; else if (unmetReqs.length > 0) buttonTitle = `Requires: ${unmetReqs.join(', ')}`; else if (!canAfford) buttonTitle = `Requires ${cost} Insight`; actionsHTML = `<button class="button small-button" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`; if (completed) actionsHTML += ` <span class="completed-text">(Completed)</span>`; else if (unmetReqs.length > 0 && unmetReqs[0] === "Insight") actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`; else if (unmetReqs.length > 0) actionsHTML += ` <small class="req-missing">(Requires: ${unmetReqs.join(', ')})</small>`; }
     div.innerHTML = `<h4>${item.name} ${type === 'experiment' ? `(Req: ${item.requiredAttunement} ${elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4><p>${item.description}</p><div class="repo-actions">${actionsHTML}</div>`; return div;
 }

// --- Milestones UI (No Changes Needed) ---
export function displayMilestones() { /* ... keep existing ... */
    if (!milestonesDisplay) return; milestonesDisplay.innerHTML = ''; const achieved = State.getState().achievedMilestones; if (achieved.size === 0) { milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>'; return; } const sortedAchievedIds = milestones.filter(m => achieved.has(m.id)).map(m => m.id); sortedAchievedIds.forEach(milestoneId => { const milestone = milestones.find(m => m.id === milestoneId); if (milestone) { const li = document.createElement('li'); li.textContent = `✓ ${milestone.description}`; milestonesDisplay.appendChild(li); } });
}

// --- Settings Popup UI (No Changes Needed) ---
export function showSettings() { /* ... keep existing ... */
    if (settingsPopup) settingsPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Tapestry Deep Dive UI (No Changes Needed) ---
export function displayTapestryDeepDive(analysisData) { /* ... keep existing ... */
    if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveNarrativeP) { console.error("Deep Dive Modal elements missing!"); showTemporaryMessage("Error opening Deep Dive.", 3000); return; } console.log("UI: displayTapestryDeepDive called with analysis:", analysisData); deepDiveNarrativeP.innerHTML = analysisData.fullNarrativeHTML || "Could not generate narrative."; if (deepDiveFocusIcons) { deepDiveFocusIcons.innerHTML = ''; const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts(); focused.forEach(id => { const concept = discovered.get(id)?.concept; if (concept) { let iconClass = Utils.getElementIcon("Default"); let iconColor = '#CCCCCC'; let iconTitle = concept.name; if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) { const fullElementName = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); iconTitle = `${concept.name} (${elementDetails[fullElementName]?.name || fullElementName})`; } else { iconClass = Utils.getCardTypeIcon(concept.cardType); } const icon = document.createElement('i'); icon.className = `${iconClass}`; icon.style.color = iconColor; icon.title = iconTitle; deepDiveFocusIcons.appendChild(icon); } }); } if (deepDiveDetailContent) { deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>'; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active')); } updateContemplationButtonState(); tapestryDeepDiveModal.classList.remove('hidden'); popupOverlay.classList.remove('hidden');
}
export function updateContemplationButtonState() { /* ... keep existing ... */
    if (!contemplationNodeButton) return; const cooldownEnd = State.getContemplationCooldownEnd(); const now = Date.now(); const insight = State.getInsight(); const cost = Config.CONTEMPLATION_COST; let disabled = false; let title = `Contemplate your focus (${cost} Insight)`; let text = `Contemplate (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); disabled = true; title = `Contemplation available in ${remaining}s`; text = `On Cooldown (${remaining}s)`; } else if (insight < cost) { disabled = true; title = `Requires ${cost} Insight`; } contemplationNodeButton.disabled = disabled; contemplationNodeButton.title = title; contemplationNodeButton.innerHTML = text;
}
export function updateDeepDiveContent(htmlContent, nodeId) { /* ... keep existing ... */
    if (!deepDiveDetailContent) return; console.log(`UI: Updating deep dive content for node: ${nodeId}`); deepDiveDetailContent.innerHTML = htmlContent; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.toggle('active', btn.dataset.nodeId === nodeId); });
}
export function displayContemplationTask(task) { /* ... keep existing ... */
    if (!deepDiveDetailContent) return; console.log("UI: Displaying contemplation task:", task); let html = `<h4>Contemplation Task</h4><p>${task.text}</p>`; if (task.requiresCompletionButton) { html += `<button id="completeContemplationBtn" class="button small-button">Mark Complete (+${task.reward.amount} ${task.reward.type === 'insight' ? '<i class="fas fa-brain insight-icon"></i>' : 'Attun.'})</button>`; } deepDiveDetailContent.innerHTML = html; const completeBtn = document.getElementById('completeContemplationBtn'); if (completeBtn) { completeBtn.addEventListener('click', () => { GameLogic.handleCompleteContemplation(task); }, { once: true }); } deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.toggle('active', btn.id === 'contemplationNode'); });
}
export function clearContemplationTask() { /* ... keep existing ... */
     if (deepDiveDetailContent) { deepDiveDetailContent.innerHTML = '<p>Contemplation acknowledged.</p>'; setTimeout(() => { if (deepDiveDetailContent && deepDiveDetailContent.innerHTML === '<p>Contemplation acknowledged.</p>') { deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>'; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active')); } }, 1500); } updateContemplationButtonState();
}
export function updateTapestryDeepDiveButton() { /* ... keep existing ... */
    const btn = document.getElementById('exploreTapestryButton'); if (btn) { const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; const hasFocus = State.getFocusedConcepts().size > 0; btn.classList.toggle('hidden-by-flow', !isPhaseReady); btn.disabled = !isPhaseReady || !hasFocus; btn.title = !isPhaseReady ? "Unlock later..." : (!hasFocus ? "Focus on concepts..." : "Explore a deeper analysis..."); } else { console.warn("UI: updateTapestryDeepDiveButton - Button not found!"); }
}

// --- Suggest Scene Button UI (No Changes Needed) ---
export function updateSuggestSceneButtonState() { /* ... keep existing ... */
    if (!suggestSceneButton) return; const hasFocus = State.getFocusedConcepts().size > 0; const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST; const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; suggestSceneButton.classList.toggle('hidden-by-flow', !isPhaseReady); if (isPhaseReady) { suggestSceneButton.disabled = !hasFocus || !canAfford; if (!hasFocus) { suggestSceneButton.title = "Focus on concepts first"; } else if (!canAfford) { suggestSceneButton.title = `Requires ${Config.SCENE_SUGGESTION_COST} Insight`; } else { suggestSceneButton.title = `Suggest resonant scenes (${Config.SCENE_SUGGESTION_COST} Insight)`; } suggestSceneButton.innerHTML = `Suggest Scenes (${Config.SCENE_SUGGESTION_COST} <i class="fas fa-brain insight-icon"></i>)`; } else { suggestSceneButton.disabled = true; suggestSceneButton.title = "Unlock later"; }
}

// --- Initial UI Setup Helper (No Changes Needed) ---
export function setupInitialUI() { /* ... keep existing ... */
    console.log("UI: Setting up initial UI state..."); applyOnboardingPhaseUI(Config.ONBOARDING_PHASE.START); if(mainNavBar) mainNavBar.classList.add('hidden'); showScreen('welcomeScreen'); if(loadButton) loadButton.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY)); updateSuggestSceneButtonState(); updateTapestryDeepDiveButton();
}


console.log("ui.js loaded.");
