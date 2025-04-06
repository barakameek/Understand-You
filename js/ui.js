// --- START OF FULL ui.js --- (Combined Corrections & Chart Feature)

// js/ui.js - Handles DOM Manipulation and UI Updates
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js'; // Needed for button actions
import { elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals, sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames } from '../data.js'; // Adjusted path

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
// Persona Screen
const personaScreen = document.getElementById('personaScreen');
const personaDetailedView = document.getElementById('personaDetailedView');
const personaSummaryView = document.getElementById('personaSummaryView');
const showDetailedViewBtn = document.getElementById('showDetailedViewBtn');
const showSummaryViewBtn = document.getElementById('showSummaryViewBtn');
const personaElementDetailsDiv = document.getElementById('personaElementDetails');
const userInsightDisplayPersona = document.getElementById('userInsightDisplayPersona');
const focusedConceptsDisplay = document.getElementById('focusedConceptsDisplay');
const focusedConceptsHeader = document.getElementById('focusedConceptsHeader');
const tapestryNarrativeP = document.getElementById('tapestryNarrative');
const personaThemesList = document.getElementById('personaThemesList');
const summaryContentDiv = document.getElementById('summaryContent');
// Persona Summary Specific Divs
const summaryCoreEssenceTextDiv = document.getElementById('summaryCoreEssenceText');
const summaryTapestryInfoDiv = document.getElementById('summaryTapestryInfo');

// Study Screen (Unified Structure Refs)
const studyScreen = document.getElementById('studyScreen');
const initialDiscoveryGuidance = document.getElementById('initialDiscoveryGuidance'); // Guidance text area
const initialDiscoveryElements = document.getElementById('initialDiscoveryElements'); // Container for 6 elements/buttons
const studyResearchDiscoveries = document.getElementById('studyResearchDiscoveries'); // Unified results area
const studyActionsArea = studyScreen?.querySelector('.study-actions-area'); // Container for Daily/Guidance buttons
const freeResearchButton = document.getElementById('freeResearchButton'); // Daily free research button
const seekGuidanceButton = document.getElementById('seekGuidanceButton'); // Seek Guidance button
const userInsightDisplayStudy = document.getElementById('userInsightDisplayStudy'); // Shared Insight display
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay'); // Rituals list
const guidedReflectionCostDisplay = document.getElementById('guidedReflectionCostDisplay'); // Cost span
const ritualsAlcove = studyScreen?.querySelector('.rituals-alcove'); // Rituals container
// Grimoire Screen
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const grimoireGuidance = document.getElementById('grimoireGuidance'); // Guidance Area
const grimoireControls = document.getElementById('grimoireControls');
const grimoireFilterControls = grimoireControls?.querySelector('.filter-controls');
const grimoireTypeFilter = document.getElementById('grimoireTypeFilter');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireRarityFilter = document.getElementById('grimoireRarityFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireSearchInput = document.getElementById('grimoireSearchInput');
const grimoireFocusFilter = document.getElementById('grimoireFocusFilter');
const grimoireContentDiv = document.getElementById('grimoireContent');
// Repository Screen
const repositoryScreen = document.getElementById('repositoryScreen');
const repositoryFocusUnlocksDiv = document.getElementById('repositoryFocusUnlocks')?.querySelector('.repo-list');
const repositoryScenesDiv = document.getElementById('repositoryScenes')?.querySelector('.repo-list');
const repositoryExperimentsDiv = document.getElementById('repositoryExperiments')?.querySelector('.repo-list');
const repositoryInsightsDiv = document.getElementById('repositoryInsights')?.querySelector('.repo-list');
const milestonesDisplay = document.getElementById('milestonesDisplay'); // In Repository HTML
// Popup & Modal Elements
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupCardTypeIcon = document.getElementById('popupCardTypeIcon');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupVisualContainer = document.getElementById('popupVisualContainer');
const popupDetailedDescription = document.getElementById('popupDetailedDescription');
const popupResonanceSummary = document.getElementById('popupResonanceSummary');
// ** Targets for collapsible sections **
const popupRecipeDetailsSection = document.getElementById('popupRecipeDetails');
const popupRelatedDetailsSection = document.getElementById('popupRelatedDetails');
// ** Targets INSIDE collapsible sections **
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const popupRelatedConceptsList = document.querySelector('#popupRelatedDetails .related-concepts-list-dropdown'); // More specific selector

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
// Persona Action Buttons
const exploreTapestryButton = document.getElementById('exploreTapestryButton');
const suggestSceneButton = document.getElementById('suggestSceneButton');
const sceneSuggestCostDisplay = document.getElementById('sceneSuggestCostDisplay');
// Tapestry Deep Dive Modal
const tapestryDeepDiveModal = document.getElementById('tapestryDeepDiveModal');
const closeDeepDiveButton = document.getElementById('closeDeepDiveButton');
const deepDiveFocusIcons = document.getElementById('deepDiveFocusIcons');
const deepDiveNarrativeP = document.getElementById('deepDiveNarrative');
const deepDiveAnalysisNodes = document.getElementById('deepDiveAnalysisNodes');
const deepDiveDetailContent = document.getElementById('deepDiveDetailContent');
const contemplationNodeButton = document.getElementById('contemplationNode');
// Info Popup
const infoPopupElement = document.getElementById('infoPopup');
const infoPopupContent = document.getElementById('infoPopupContent');
const closeInfoPopupButton = document.getElementById('closeInfoPopupButton');
const confirmInfoPopupButton = document.getElementById('confirmInfoPopupButton');


// --- Utility UI Functions ---
let toastTimeout = null;
export function showTemporaryMessage(message, duration = 3000, isGuidance = false) {
    if (!toastElement || !toastMessageElement) { console.warn("Toast elements missing:", message); return; }
    console.info(`Toast: ${message}`);
    toastMessageElement.textContent = message;
    toastElement.classList.toggle('guidance-toast', isGuidance);
    if (toastTimeout) { clearTimeout(toastTimeout); }
    toastElement.classList.remove('hidden', 'visible');
    void toastElement.offsetWidth; // Trigger reflow
    toastElement.classList.add('visible');
    toastElement.classList.remove('hidden');
    toastTimeout = setTimeout(() => {
        toastElement.classList.remove('visible');
         // Add slight delay before adding hidden to allow fade-out animation
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
    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (settingsPopup) settingsPopup.classList.add('hidden');
    if (tapestryDeepDiveModal) tapestryDeepDiveModal.classList.add('hidden');
    if (infoPopupElement) infoPopupElement.classList.add('hidden');

    // Only hide overlay if NO popups are visible
    const anyPopupVisible = document.querySelector('.popup:not(.hidden)');
    if (!anyPopupVisible && popupOverlay) popupOverlay.classList.add('hidden');

    GameLogic.clearPopupState(); // Clear temporary state associated with popups
}

// --- Screen Management ---
let previousScreenId = 'welcomeScreen';

export function showScreen(screenId) {
    console.log("UI: Showing screen:", screenId);
    const currentState = State.getState();
    const currentPhase = currentState.onboardingPhase;
    const isPostQuestionnaire = currentState.questionnaireCompleted;

    screens.forEach(screen => {
        if(screen) { // Add null check for robustness
             screen.classList.toggle('current', screen.id === screenId);
             screen.classList.toggle('hidden', screen.id !== screenId);
        } else {
            // Find the ID for logging if possible
            const screenElements = document.querySelectorAll('.screen');
            const missingId = Array.from(screenElements).find(s => !s)?.id || 'unknown';
            console.warn(`UI Warning: Screen element with ID potentially '${missingId}' not found during showScreen.`);
        }
    });

    if (mainNavBar) {
        mainNavBar.classList.toggle('hidden', !isPostQuestionnaire || screenId === 'welcomeScreen' || screenId === 'questionnaireScreen');
    }
    navButtons.forEach(button => {
        if (button) button.classList.toggle('active', button.dataset.target === screenId);
    });

    // Specific screen setup logic
    if (isPostQuestionnaire) {
        if (screenId === 'studyScreen') {
            displayStudyScreenContent(); // Always call the unified function
        } else if (screenId === 'personaScreen') {
             // Check if we just finished the questionnaire
             const justFinishedQuestionnaire = previousScreenId === 'questionnaireScreen';
             // If just finished, default to summary view
             if (justFinishedQuestionnaire && personaSummaryView && personaDetailedView && showSummaryViewBtn && showDetailedViewBtn) {
                 personaSummaryView.classList.remove('hidden'); personaSummaryView.classList.add('current');
                 personaDetailedView.classList.add('hidden'); personaDetailedView.classList.remove('current');
                 showSummaryViewBtn.classList.add('active'); showDetailedViewBtn.classList.remove('active');
                 displayPersonaSummary(); // Display summary data
             } else {
                 // Otherwise, ensure one view is active (default to detailed if none are)
                 if (!personaDetailedView?.classList.contains('current') && !personaSummaryView?.classList.contains('current')) {
                      personaDetailedView?.classList.remove('hidden'); personaDetailedView?.classList.add('current');
                      showDetailedViewBtn?.classList.add('active');
                      personaSummaryView?.classList.add('hidden'); personaSummaryView?.classList.remove('current');
                      showSummaryViewBtn?.classList.remove('active');
                 }
             }
             // Always refresh the full persona logic when showing the screen
             GameLogic.displayPersonaScreenLogic();
        } else if (screenId === 'grimoireScreen') {
            handleFirstGrimoireVisit();
            refreshGrimoireDisplay();
        } else if (screenId === 'repositoryScreen') {
            displayRepositoryContent();
        }
    } else if (screenId === 'questionnaireScreen') {
         // Ensure questionnaire is displayed correctly if returning to it
         if(currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) {
             displayElementQuestions(currentState.currentElementIndex);
         }
    }

    // Scroll to top for main content screens
    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
    previousScreenId = screenId; // Update previous screen tracking
}

// --- Onboarding UI Adjustments ---
export function applyOnboardingPhaseUI(phase) {
    console.log(`UI: Applying onboarding phase ${phase}`);
    const isPhase_PersonaGrimoire = phase >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const isPhase_StudyInsight = phase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    const isPhase_ReflectionRituals = phase >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS;
    const isPhase_Advanced = phase >= Config.ONBOARDING_PHASE.ADVANCED;

    // --- Navigation Bar ---
    navButtons.forEach(button => {
        if (!button) return; const target = button.dataset.target; let hide = false;
        // Hide everything except Persona initially
        if (!isPhase_PersonaGrimoire && target !== 'personaScreen') hide = true;
        else {
             // Progressively reveal other tabs based on phase
             if (target === 'studyScreen' && !isPhase_PersonaGrimoire) hide = true; // Show Study when Persona is shown
             if (target === 'grimoireScreen' && !isPhase_PersonaGrimoire) hide = true; // Show Grimoire when Persona is shown
             if (target === 'repositoryScreen' && !isPhase_Advanced) hide = true; // Only show Repo in Advanced
        }
        button.classList.toggle('hidden-by-flow', hide);
    });

    // --- Study Screen Elements ---
    if (studyScreen) {
        if (studyActionsArea) studyActionsArea.classList.toggle('hidden-by-flow', !isPhase_StudyInsight);
        if (ritualsAlcove) ritualsAlcove.classList.toggle('hidden-by-flow', !isPhase_ReflectionRituals);
        if (freeResearchButton) freeResearchButton.classList.toggle('hidden-by-flow', !isPhase_StudyInsight);
        if (seekGuidanceButton) seekGuidanceButton.classList.toggle('hidden-by-flow', !isPhase_ReflectionRituals);
    }

    // --- Grimoire Filters ---
    if (grimoireFilterControls) grimoireFilterControls.classList.toggle('hidden-by-flow', !isPhase_StudyInsight);

    // --- Persona Screen Elements ---
    if (personaScreen) {
         // Element Deep Dive visibility (Containers added dynamically)
         const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container');
         deepDiveContainers?.forEach(container => {
              container.classList.toggle('hidden', !isPhase_Advanced); // Show deep dive in ADVANCED phase
              if (!container.classList.contains('hidden')) {
                   const key = container.dataset.elementKey;
                   if (key) displayElementDeepDive(key, container); // Refresh content if visible
              }
         });
         if (exploreTapestryButton) exploreTapestryButton.classList.toggle('hidden-by-flow', !isPhase_PersonaGrimoire);
         if (suggestSceneButton) suggestSceneButton.classList.toggle('hidden-by-flow', !isPhase_PersonaGrimoire);
    }

    // --- Popup Elements Visibility (Based on Phase when Popup is Active) ---
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
        const discoveredData = State.getDiscoveredConceptData(popupConceptId);
        const concept = concepts.find(c => c.id === popupConceptId);
        const researchNotesArea = document.getElementById('studyResearchDiscoveries'); // Unified ID
        const inResearch = !discoveredData && researchNotesArea?.querySelector(`.research-result-item[data-concept-id="${popupConceptId}"]`);

        // Re-evaluate button/section visibility based on current phase
        updateFocusButtonStatus(popupConceptId);
        updateGrimoireButtonStatus(popupConceptId, !!inResearch);
        updatePopupSellButton(popupConceptId, concept, !!discoveredData, !!inResearch);
        if (myNotesSection) myNotesSection.classList.toggle('hidden', !isPhase_StudyInsight || !discoveredData);
        if (popupEvolutionSection) {
            const showEvo = isPhase_Advanced && discoveredData && concept?.canUnlockArt && !discoveredData?.artUnlocked;
            popupEvolutionSection.classList.toggle('hidden', !showEvo);
            if (showEvo) displayEvolutionSection(concept, discoveredData); // Refresh content if visible
         }
    }

    // --- Repository Screen ---
    if (repositoryScreen) repositoryScreen.classList.toggle('hidden-by-flow', !isPhase_Advanced);

    // Update button states potentially affected by phase changes
    updateTapestryDeepDiveButton();
    updateSuggestSceneButtonState();
}


// --- Insight Display ---
export function updateInsightDisplays() {
    const insight = State.getInsight().toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = insight;

    // Refresh button states/costs if relevant screen is visible
    if (studyScreen?.classList.contains('current')) {
        displayStudyScreenContent(); // Re-render study screen elements/buttons
    }
    if (personaScreen?.classList.contains('current')) {
        // Refresh deep dive unlock buttons if visible
        const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container:not(.hidden)');
        deepDiveContainers?.forEach(container => {
            const elementKey = container.dataset.elementKey;
            if (elementKey) displayElementDeepDive(elementKey, container);
        });
        updateSuggestSceneButtonState(); // Refresh suggest scene button cost/state
    }
    if (repositoryScreen?.classList.contains('current')) { displayRepositoryContent(); } // Re-render repo items

    // Refresh evolution button state if popup is open
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
          const concept = concepts.find(c => c.id === popupConceptId);
          const discoveredData = State.getDiscoveredConceptData(popupConceptId);
          if(concept && discoveredData && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED) {
              displayEvolutionSection(concept, discoveredData);
          }
    }
    updateContemplationButtonState(); // Refresh contemplation button state
}

// --- Questionnaire UI ---
export function initializeQuestionnaireUI() {
    console.log("UI: Initializing Questionnaire UI");
    State.updateElementIndex(0); // Reset index in state
    updateElementProgressHeader(-1); // Clear progress header
    displayElementQuestions(0); // Display first set of questions
    if (mainNavBar) mainNavBar.classList.add('hidden'); // Hide main nav during questionnaire
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; // Hide dynamic score initially
    console.log("UI: Questionnaire UI initialized.");
}

export function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) return; elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div'); tab.classList.add('element-tab');
        const elementData = elementDetails[name] || {};
        tab.textContent = elementData.name || name; tab.title = elementData.name || name;
        tab.classList.toggle('completed', index < activeIndex);
        tab.classList.toggle('active', index === activeIndex);
        elementProgressHeader.appendChild(tab);
    });
}

export function displayElementQuestions(index) {
    const actualIndex = State.getState().currentElementIndex;
    // Use the index provided unless the state index is valid and different (e.g., on load)
    const displayIndex = (actualIndex >= 0 && actualIndex < elementNames.length) ? actualIndex : index;
    console.log(`UI: Displaying Qs requested index ${index}, using state index ${displayIndex}`);

    if (displayIndex >= elementNames.length) {
        GameLogic.finalizeQuestionnaire(); // Trigger finalization if past last element
        return;
    }

    const elementName = elementNames[displayIndex];
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || [];
    if (!questionContent) { console.error("questionContent element missing!"); return; }

    // Get current answers for this element *from the state* for rendering
    const elementAnswers = State.getState().userAnswers?.[elementName] || {};

    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    let questionsHTML = '';
    questions.forEach(q => {
        let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
        const savedAnswer = elementAnswers[q.qId]; // Use answer from state for rendering
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

    questionContent.innerHTML = introHTML;
    const introDiv = questionContent.querySelector('.element-intro');
    if (introDiv) introDiv.insertAdjacentHTML('afterend', questionsHTML);
    else questionContent.innerHTML += questionsHTML;

    // Attach event listeners *after* content is rendered
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange); // Remove old listener first
        input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
    });
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.removeEventListener('change', GameLogic.handleCheckboxChange); // Remove old listener first
        checkbox.addEventListener('change', GameLogic.handleCheckboxChange);
    });

    // Update UI elements based on current answers
    questionContent.querySelectorAll('.slider.q-input').forEach(slider => { updateSliderFeedbackText(slider, elementName); });
    updateDynamicFeedback(elementName, elementAnswers); // Update feedback using the state answers

    // Update general progress UI
    updateElementProgressHeader(displayIndex);
    if (progressText) progressText.textContent = `Element ${displayIndex + 1} / ${elementNames.length}: ${elementData.name || elementName}`;
    if (prevElementButton) prevElementButton.style.visibility = (displayIndex > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (displayIndex === elementNames.length - 1) ? "View Initial Discoveries" : "Next Element";

    console.log(`UI: Finished displaying questions for ${elementName} at index ${displayIndex}`);
}


export function updateSliderFeedbackText(sliderElement, elementName) {
    if (!sliderElement || sliderElement.type !== 'range') return;
    const qId = sliderElement.dataset.questionId; const feedbackElement = document.getElementById(`feedback_${qId}`); if (!feedbackElement) return;
    const currentValue = parseFloat(sliderElement.value); const display = document.getElementById(`display_${qId}`); if(display) display.textContent = currentValue.toFixed(1);
    if (!elementName) { console.warn("updateSliderFeedbackText called without elementName!"); feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; return; }
    const interpretations = elementDetails?.[elementName]?.scoreInterpretations; if (!interpretations) { feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; return; }
    const scoreLabel = Utils.getScoreLabel(currentValue); const interpretationText = interpretations[scoreLabel] || `Interpretation for "${scoreLabel}" not found.`;
    feedbackElement.textContent = interpretationText; feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`;
}

export function updateDynamicFeedback(elementName, currentAnswers) {
     const elementData = elementDetails?.[elementName]; if (!elementData || !dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) { if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; return; }
     // Calculate score based on provided answers (could be from state or fresh from UI)
     const tempScore = GameLogic.calculateElementScore(elementName, currentAnswers);
     const scoreLabel = Utils.getScoreLabel(tempScore);
     feedbackElementSpan.textContent = elementData.name || elementName; feedbackScoreSpan.textContent = tempScore.toFixed(1);
     let labelSpan = dynamicScoreFeedback.querySelector('.score-label'); if(!labelSpan && feedbackScoreSpan?.parentNode) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling); } if (labelSpan) labelSpan.textContent = ` (${scoreLabel})`;
     feedbackScoreBar.style.width = `${tempScore * 10}%`; dynamicScoreFeedback.style.display = 'block';
}

// Get answers directly from the UI inputs
export function getQuestionnaireAnswers() {
     const answers = {}; const inputs = questionContent?.querySelectorAll('.q-input'); if (!inputs) return answers;
     inputs.forEach(input => { const qId = input.dataset.questionId; const type = input.dataset.type; if (!qId) return; if (type === 'slider') answers[qId] = parseFloat(input.value); else if (type === 'radio') { if (input.checked) answers[qId] = input.value; } else if (type === 'checkbox') { if (!answers[qId]) answers[qId] = []; if (input.checked) answers[qId].push(input.value); } }); return answers;
}

// --- Persona Screen UI ---
export function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona element details div not found!"); return; }
    console.log("UI: Displaying Persona Screen");
    personaElementDetailsDiv.innerHTML = ''; const scores = State.getScores(); const currentPhase = State.getOnboardingPhase();
    // Show deep dive container only in ADVANCED phase
    const showDeepDiveContainer = currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName]; const score = (typeof scores[key] === 'number' && !isNaN(scores[key])) ? scores[key] : 5.0; const scoreLabel = Utils.getScoreLabel(score); const elementData = elementDetails[elementName] || {}; const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation not available."; const barWidth = score ? (score / 10) * 100 : 0; const color = Utils.getElementColor(elementName); const iconClass = Utils.getElementIcon(elementName);
        const details = document.createElement('details'); details.classList.add('element-detail-entry'); details.dataset.elementKey = key; details.style.setProperty('--element-color', color);
        const descriptionDiv = document.createElement('div'); descriptionDiv.classList.add('element-description');
        descriptionDiv.innerHTML = `<p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p><p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p><hr><p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p><p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>`;
        // Create and append Deep Dive container *conditionally*
        const deepDiveContainer = document.createElement('div'); deepDiveContainer.classList.add('element-deep-dive-container'); deepDiveContainer.dataset.elementKey = key; deepDiveContainer.classList.toggle('hidden', !showDeepDiveContainer);
        descriptionDiv.appendChild(deepDiveContainer);
        details.innerHTML = `<summary class="element-detail-header"><div><i class="${iconClass} element-icon-indicator" style="color: ${color};" title="${elementData.name || elementName}"></i> <strong>${elementData.name || elementName}:</strong> <span>${score?.toFixed(1) ?? '?'}</span> <span class="score-label">(${scoreLabel})</span></div><div class="score-bar-container"><div style="width: ${barWidth}%; background-color: ${color};"></div></div></summary>`;
        details.appendChild(descriptionDiv); // Append description div containing deep dive
        personaElementDetailsDiv.appendChild(details);
        if (showDeepDiveContainer) displayElementDeepDive(key, deepDiveContainer); // Populate if visible
    });
    displayElementAttunement(); updateInsightDisplays(); displayFocusedConceptsPersona(); generateTapestryNarrative(); synthesizeAndDisplayThemesPersona(); displayPersonaSummary(); applyOnboardingPhaseUI(currentPhase); updateTapestryDeepDiveButton(); updateSuggestSceneButtonState();
}


export function displayElementAttunement() {
    if (!personaElementDetailsDiv || personaElementDetailsDiv.children.length === 0) return; const attunement = State.getAttunement();
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const attunementValue = attunement[key] || 0; const percentage = (attunementValue / Config.MAX_ATTUNEMENT) * 100; const color = Utils.getElementColor(elName);
        const targetDetails = personaElementDetailsDiv.querySelector(`.element-detail-entry[data-element-key="${key}"]`);
        if (targetDetails) { let descriptionDiv = targetDetails.querySelector('.element-description'); if (descriptionDiv) { const deepDiveContainer = descriptionDiv.querySelector('.element-deep-dive-container'); descriptionDiv.querySelector('.attunement-display')?.remove(); descriptionDiv.querySelector('.attunement-hr')?.remove(); const hr = document.createElement('hr'); hr.className = 'attunement-hr'; const attunementDiv = document.createElement('div'); attunementDiv.classList.add('attunement-display'); attunementDiv.innerHTML = `<div class="attunement-item"><span class="attunement-name">Attunement:</span><div class="attunement-bar-container" title="Current Attunement: ${attunementValue.toFixed(1)} / ${Config.MAX_ATTUNEMENT}"><div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div></div><i class="fas fa-info-circle info-icon" title="Attunement reflects affinity/experience with this Element. Grows via Research, Reflection, Focusing concepts. High Attunement may unlock content or reduce costs."></i></div>`; if (deepDiveContainer) { descriptionDiv.insertBefore(hr, deepDiveContainer); descriptionDiv.insertBefore(attunementDiv, deepDiveContainer); } else { descriptionDiv.appendChild(hr); descriptionDiv.appendChild(attunementDiv); } } }
    });
}

export function updateFocusSlotsDisplay() {
    const focused = State.getFocusedConcepts(); const totalSlots = State.getFocusSlots(); if (focusedConceptsHeader) { focusedConceptsHeader.textContent = `Focused Concepts (${focused.size} / ${totalSlots})`; const icon = focusedConceptsHeader.querySelector('.info-icon'); if(icon) icon.title = `Concepts marked as Focus (${focused.size}) out of your available slots (${totalSlots}). Slots increase via Milestones.`; }
}

export function displayFocusedConceptsPersona() {
    if (!focusedConceptsDisplay) return; focusedConceptsDisplay.innerHTML = ''; updateFocusSlotsDisplay();
    const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts();
    if (focused.size === 0) { focusedConceptsDisplay.innerHTML = `<li class="focus-placeholder">Focus Concepts from your Grimoire</li>`; return; }
    focused.forEach(conceptId => {
        const conceptData = discovered.get(conceptId);
        if (conceptData?.concept) { const concept = conceptData.concept; const item = document.createElement('div'); item.classList.add('focus-concept-item'); item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`; let iconClass = Utils.getCardTypeIcon(concept.cardType); let iconColor = '#b8860b'; if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement]) { const fullElementName = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); } else { console.warn(`Concept ${concept.name} missing valid primaryElement for focus icon.`); } item.innerHTML = `<i class="${iconClass}" style="color: ${iconColor};"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`; item.addEventListener('click', () => showConceptDetailPopup(concept.id)); focusedConceptsDisplay.appendChild(item); }
        else { console.warn(`Focused concept ID ${conceptId} not found.`); const item = document.createElement('div'); item.classList.add('focus-concept-item', 'missing'); item.textContent = `Error: ID ${conceptId}`; focusedConceptsDisplay.appendChild(item); }
    });
    updateSuggestSceneButtonState(); // Update button state after display
}


export function generateTapestryNarrative() {
     if (!tapestryNarrativeP) return;
     // Use the GameLogic function to get the calculated narrative HTML
     const narrativeHTML = GameLogic.calculateTapestryNarrative();
     tapestryNarrativeP.innerHTML = narrativeHTML || 'Mark concepts as "Focus" to generate narrative...';
}

export function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return; personaThemesList.innerHTML = '';
     // Use GameLogic function to calculate themes
     const themes = GameLogic.calculateFocusThemes();
     if (themes.length === 0) { personaThemesList.innerHTML = `<li>${State.getFocusedConcepts().size > 0 ? 'Focus is currently balanced.' : 'Mark Focused Concepts...'}</li>`; return; }
     const topTheme = themes[0]; const li = document.createElement('li'); let emphasis = "Strongly"; if (themes.length > 1 && topTheme.count <= themes[1].count + 1) emphasis = "Primarily"; else if (topTheme.count < 3) emphasis = "Leaning towards";
     li.textContent = `${emphasis} focused on ${topTheme.name}`; li.style.borderLeft = `3px solid ${Utils.getElementColor(elementKeyToFullName[topTheme.key])}`; li.style.paddingLeft = '8px'; personaThemesList.appendChild(li);
     if (themes.length > 1 && topTheme.count <= themes[1].count + 1) { const balanceLi = document.createElement('li'); balanceLi.innerHTML = `<small>(with other influences present)</small>`; balanceLi.style.fontSize = '0.85em'; balanceLi.style.color = '#666'; balanceLi.style.paddingLeft = '20px'; balanceLi.style.borderLeft = 'none'; personaThemesList.appendChild(balanceLi); }
}

// --- ** NEW FUNCTION: Draw Persona Chart ** ---
// --- START OF ui.js CHANGES ---

// ... other imports and code ...

// --- ** REVISED FUNCTION: Draw Persona Chart ** ---
let personaChartInstance = null; // Keep track of the chart instance

function drawPersonaChart(scores) {
    const canvasContainer = document.querySelector('.chart-container'); // Get the container div
    const canvasElement = document.getElementById('personaScoreChartCanvas');
    if (!canvasElement || !canvasContainer) {
        console.error("Persona chart canvas element or container not found!");
        return;
    }
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
        console.error("Failed to get canvas context for persona chart!");
        return;
    }

    // Destroy existing chart instance if it exists
    if (personaChartInstance) {
        personaChartInstance.destroy();
        personaChartInstance = null;
    }

    // Prepare data for Chart.js
    const elementKeys = elementNames.map(name => elementNameToKey[name]); // Get keys in order
    const labels = elementNames.map(name => elementDetails[name]?.name || name); // Full names for labels
    const scoreData = elementKeys.map(key => scores[key] || 0); // Get scores using ordered keys
    const pointColors = elementNames.map(name => Utils.getElementColor(name)); // Get colors for each point
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    const borderColorLight = getComputedStyle(document.documentElement).getPropertyValue('--border-color-light').trim();

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Elemental Profile', // Changed label
            data: scoreData,
            // Use primary color for fill and line, but make fill more transparent
            backgroundColor: Utils.hexToRgba(primaryColor, 0.35), // More transparency
            borderColor: primaryColor, // Solid line in primary color
            borderWidth: 2.5, // Slightly thicker line for definition
            // Color each point individually
            pointBackgroundColor: pointColors, // Array of colors for points
            pointBorderColor: Utils.hexToRgba(textColor, 0.7), // Subtle dark border
            pointRadius: 5, // Make points slightly larger
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointHoverBorderColor: accentColor, // Gold hover border
            pointHoverBackgroundColor: '#fff' // White fill on hover
        }]
    };

    // Chart Configuration Options - Themed
    const chartOptions = {
        maintainAspectRatio: false, // Allow resizing based on container
        scales: {
            r: { // Radial axis configuration (The 'Spokes')
                min: 0,
                max: 10, // Scale from 0 to 10
                ticks: {
                    stepSize: 2, // Steps of 2 (0, 2, 4, 6, 8, 10)
                    display: true, // Show numeric ticks
                    // Style the tick labels (0, 2, 4...)
                    color: Utils.hexToRgba(textColor, 0.8),
                    font: { family: "'Merriweather', serif", size: 10 },
                    // Add a subtle backdrop to make ticks more readable over grid/fill
                    backdropColor: Utils.hexToRgba('#FFF8E7', 0.6), // Light beige backdrop
                    backdropPadding: 2
                },
                angleLines: { // Lines from center to labels
                    color: Utils.hexToRgba(borderColorLight, 0.6) // Lighter, less obtrusive lines
                },
                grid: { // Concentric circles
                    color: Utils.hexToRgba(borderColorLight, 0.4), // Even lighter grid
                    borderDash: [2, 4], // Finer dash pattern
                    lineWidth: 0.8
                },
                pointLabels: { // Element Names (Attraction, Interaction, etc.)
                    color: textColor,
                    font: {
                        family: "'Cinzel Decorative', cursive", // Use decorative font
                        size: 13, // Slightly larger
                        weight: '700' // Bold
                    },
                    // backdropColor: Utils.hexToRgba('#FFF8E7', 0.5), // Optional backdrop for labels
                    // backdropPadding: 3
                }
            }
        },
        plugins: {
            legend: {
                 display: false // Hide the default legend - the points are colored
            },
            tooltip: { // Customize tooltips
                 enabled: true,
                 backgroundColor: Utils.hexToRgba(textColor, 0.9), // Darker tooltip
                 titleFont: { family: "'Cinzel Decorative', cursive", weight: 'bold', size: 14 },
                 bodyFont: { family: "'Merriweather', serif", size: 11 },
                 padding: 15,
                 cornerRadius: 3,
                 displayColors: false, // Don't show the little color box
                 callbacks: {
                     label: function(context) {
                         // Label is already set to Element Name by Chart.js for radar charts
                         let score = context.parsed.r;
                         if (score !== null) {
                             return `Score: ${score.toFixed(1)} (${Utils.getScoreLabel(score)})`;
                         }
                         return '';
                     }
                 }
            }
        },
        // Removes the container border by default, rely on CSS for container styling
        layout: {
             padding: 20 // Add a little padding inside the canvas area
        }
    };

    // Create the chart
    try {
         // Ensure canvas container is visible before drawing
         if(canvasContainer) canvasContainer.style.display = 'block';

         personaChartInstance = new Chart(ctx, {
            type: 'radar',
            data: chartData,
            options: chartOptions
        });
        console.log("Persona score chart drawn successfully.");
    } catch (error) {
        console.error("Error creating persona score chart:", error);
        if(canvasContainer) canvasContainer.innerHTML = '<p style="color: red; text-align: center;">Error loading chart.</p>';
    }
}
// --- ** END REVISED FUNCTION ** ---


// --- Persona Summary Display (Ensure it calls the chart function) ---
export function displayPersonaSummary() {
    // Ensure the target divs exist before populating
    if (!summaryContentDiv || !summaryCoreEssenceTextDiv || !summaryTapestryInfoDiv) {
        console.error("Summary view content divs not found!");
        if(summaryContentDiv) summaryContentDiv.innerHTML = '<p>Error loading summary content elements.</p>';
        return;
    }

    summaryCoreEssenceTextDiv.innerHTML = ''; // Clear previous text content
    summaryTapestryInfoDiv.innerHTML = ''; // Clear previous tapestry content

    const scores = State.getScores();
    const focused = State.getFocusedConcepts();
    const narrativeHTML = GameLogic.calculateTapestryNarrative(); // Get narrative
    const themes = GameLogic.calculateFocusThemes(); // Get themes

    // Build Core Essence Text
    let coreEssenceHTML = '';
    if (elementDetails && elementNameToKey && elementKeyToFullName) {
        elementNames.forEach(elName => {
            const key = elementNameToKey[elName];
            const score = scores[key];
            if (typeof score === 'number') {
                const label = Utils.getScoreLabel(score);
                const interpretation = elementDetails[elName]?.scoreInterpretations?.[label] || "N/A";
                coreEssenceHTML += `<p><strong>${elementDetails[elName]?.name || elName} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`;
            } else {
                coreEssenceHTML += `<p><strong>${elementDetails[elName]?.name || elName}:</strong> Score not available.</p>`;
            }
        });
    } else {
        coreEssenceHTML += "<p>Error: Element details not loaded.</p>";
    }
    summaryCoreEssenceTextDiv.innerHTML = coreEssenceHTML;

    // Build Tapestry Info Text
    let tapestryHTML = '';
    if (focused.size > 0) {
        tapestryHTML += `<p><em>${narrativeHTML || "No narrative generated."}</em></p>`;
        tapestryHTML += '<strong>Focused Concepts:</strong><ul>';
        const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => {
            const name = discovered.get(id)?.concept?.name || `ID ${id}`;
            tapestryHTML += `<li>${name}</li>`;
        });
        tapestryHTML += '</ul>';
        if (themes.length > 0) {
            tapestryHTML += '<strong>Dominant Themes:</strong><ul>';
            themes.slice(0, 3).forEach(theme => {
                tapestryHTML += `<li>${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})</li>`;
            });
            tapestryHTML += '</ul>';
        } else {
            tapestryHTML += '<strong>Dominant Themes:</strong><p>No strong themes detected.</p>';
        }
    } else {
        tapestryHTML += '<p>No concepts are currently focused.</p>';
    }
    summaryTapestryInfoDiv.innerHTML = tapestryHTML;

    // ** Call the function to draw the chart **
    drawPersonaChart(scores);
}

// ... rest of ui.js (make sure no syntax errors) ...

console.log("ui.js loaded.");

// --- END OF ui.js CHANGES ---

// --- Study Screen UI (Unified Function) ---
export function displayStudyScreenContent() {
    if (!studyScreen) return;
    const currentPhase = State.getOnboardingPhase();
    console.log(`UI: Displaying Study Screen Content (Phase: ${currentPhase})`);
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = State.getInsight().toFixed(1);

    // --- Render Core Elements / Research Buttons ---
    if (initialDiscoveryElements) {
        initialDiscoveryElements.innerHTML = ''; // Clear existing elements
        const scores = State.getScores();
        const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
        const topTwoKeys = sortedScores.slice(0, 2).map(([key]) => key);
        const freeResearchLeft = State.getInitialFreeResearchRemaining();
        const insight = State.getInsight();

        elementNames.forEach(elementName => {
            const key = elementNameToKey[elementName];
            const score = scores[key];
            const scoreLabel = Utils.getScoreLabel(score);
            const elementData = elementDetails[elementName] || {};
            const isTopTwo = topTwoKeys.includes(key) && currentPhase === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
            const color = Utils.getElementColor(elementName);
            const iconClass = Utils.getElementIcon(elementName);
            const elementDiv = document.createElement('div');
            elementDiv.classList.add('initial-discovery-element');
            if (isTopTwo) elementDiv.classList.add('highlight');
            elementDiv.style.borderColor = color; // Use border color for theme
            elementDiv.dataset.elementKey = key; // Store key for click handler

            let costText = "";
            let isDisabled = false;
            let clickHandler = null; // Defined inside loop
            let titleText = "";
            let isFreeClick = false;
            const researchCost = Config.BASE_RESEARCH_COST; // Always use base cost here

            // Determine button state based on phase and resources
            if (currentPhase === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE && freeResearchLeft > 0) {
                 costText = `Free Research (${freeResearchLeft} left)`;
                 titleText = `Conduct FREE research on ${elementData.name || elementName}.`;
                 isFreeClick = true;
                 isDisabled = false; // Free research is always possible if available
            } else {
                 costText = `${researchCost} <i class="fas fa-brain insight-icon"></i>`;
                 if (insight < researchCost) {
                     isDisabled = true;
                     titleText = `Research ${elementData.name || elementName} (Requires ${researchCost} Insight)`;
                 } else {
                     isDisabled = false;
                     titleText = `Research ${elementData.name || elementName} (Cost: ${researchCost} Insight)`;
                 }
                 isFreeClick = false;
            }
            elementDiv.dataset.cost = researchCost; // Store base cost regardless

            // Set inner HTML
            elementDiv.innerHTML = `
                <div class="element-header">
                    <i class="${iconClass}" style="color: ${color};"></i>
                    <span class="element-name">${elementData.name || elementName}</span>
                    <span class="element-score">${score.toFixed(1)} (${scoreLabel})</span>
                </div>
                <p class="element-concept">${elementData.coreConcept || 'Loading...'}</p>
                <div class="element-action ${isDisabled ? 'disabled' : ''}">
                    ${isTopTwo ? '<span class="highlight-label">Strongest Affinity</span>' : ''}
                    <span class="element-cost">${costText}</span>
                </div>`;
            elementDiv.title = titleText;

            // Add click listener only if not disabled
            if (!isDisabled) {
                 elementDiv.classList.add('clickable');
                 // Use an anonymous function to pass the correct `isFree` flag
                 clickHandler = () => GameLogic.handleResearchClick({
                     currentTarget: elementDiv,
                     isFree: isFreeClick // Pass whether this click uses free research
                 });
                 elementDiv.addEventListener('click', clickHandler);
            } else {
                 elementDiv.classList.add('disabled');
            }

            initialDiscoveryElements.appendChild(elementDiv);
        });
    }

    // --- Update Guidance Text ---
    if (initialDiscoveryGuidance) {
        const conceptsAddedCount = State.getDiscoveredConcepts().size;
        const freeResearchLeft = State.getInitialFreeResearchRemaining();
        if (currentPhase === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) {
            if (conceptsAddedCount > 0) {
                initialDiscoveryGuidance.innerHTML = `Concept Added! Discover more (using Insight or Free Research), or visit the <strong>Grimoire</strong> to view/focus Concepts.`;
            } else if (freeResearchLeft > 0) {
                initialDiscoveryGuidance.innerHTML = `Use your <strong>${freeResearchLeft} Free Research</strong> attempts on Elements you resonate with (higher scores are highlighted).`;
            } else {
                initialDiscoveryGuidance.innerHTML = `Free research used. Spend Insight to research Elements and uncover Concepts. Add discoveries to your Grimoire below.`;
            }
        } else {
             initialDiscoveryGuidance.textContent = "Research Elements to discover Concepts, complete Rituals, or Seek Guidance.";
        }
    }

    // --- Update Daily/Guidance Buttons State ---
    if (freeResearchButton) {
        const freeAvailable = State.isFreeResearchAvailable();
        freeResearchButton.disabled = !freeAvailable;
        freeResearchButton.textContent = freeAvailable ? "Perform Daily Meditation" : "Meditation Performed Today";
        freeResearchButton.title = freeAvailable ? "Once per day, perform free research on your least attuned element." : "Daily free meditation already completed.";
    }
    if (seekGuidanceButton && guidedReflectionCostDisplay) {
        const cost = Config.GUIDED_REFLECTION_COST;
        const canAfford = State.getInsight() >= cost;
        seekGuidanceButton.disabled = !canAfford;
        seekGuidanceButton.title = canAfford ? `Spend ${cost} Insight for a Guided Reflection.` : `Requires ${cost} Insight.`;
        guidedReflectionCostDisplay.textContent = cost;
    }

    // --- Update Results Area Placeholder ---
    if (studyResearchDiscoveries) {
        const placeholder = studyResearchDiscoveries.querySelector('p > i');
        // Show placeholder only if the container is truly empty
        if (studyResearchDiscoveries.children.length === 0) {
             studyResearchDiscoveries.innerHTML = '<p><i>Discoveries will appear here...</i></p>';
        } else if (placeholder && studyResearchDiscoveries.children.length > 1) {
            // Remove placeholder if results have been added
            placeholder.parentElement.remove();
        }
    }

    // --- Render Rituals ---
    displayDailyRituals();

    // --- Apply Phase Visibility ---
    applyOnboardingPhaseUI(currentPhase);
}


// --- Rituals Display ---
export function displayDailyRituals() {
    if (!dailyRitualsDisplay) return; dailyRitualsDisplay.innerHTML = '';
    // Rituals are only visible from a certain phase onwards
    if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) return;

    const completed = State.getState().completedRituals.daily || {}; const focused = State.getFocusedConcepts(); let activeRituals = [...dailyRituals];
    // Add focus rituals if requirements are met
    if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || !Array.isArray(ritual.requiredFocusIds) || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFocused = true; for (const id of reqIds) { if (!focused.has(id)) { allFocused = false; break; } } if (allFocused) activeRituals.push({ ...ritual, isFocusRitual: true }); }); }
    if (activeRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No daily rituals currently active.</li>'; return; }
    activeRituals.forEach(ritual => { const completedData = completed[ritual.id] || { completed: false, progress: 0 }; const isCompleted = completedData.completed; const li = document.createElement('li'); li.classList.toggle('completed', isCompleted); if(ritual.isFocusRitual) li.classList.add('focus-ritual'); let rewardText = ''; if (ritual.reward) { if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`; else if (ritual.reward.type === 'attunement') { const elName = ritual.reward.element === 'All' ? 'All' : (elementKeyToFullName[ritual.reward.element] || ritual.reward.element); rewardText = `(+${ritual.reward.amount} ${elName} Attun.)`; } else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`; } li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`; dailyRitualsDisplay.appendChild(li); });
}

// --- Research Results & Update Button ---
/** Displays research results (concepts, repo items, dupe messages) in the study area. */
export function displayResearchResults(results) {
    const container = document.getElementById('studyResearchDiscoveries'); // Use the unified ID
    if (!container) { console.error(`Research results container #studyResearchDiscoveries not found!`); return; }
    const { concepts: foundConcepts, repositoryItems, duplicateInsightGain } = results;

    const placeholder = container.querySelector('p > i');
    // Clear placeholder only if we're adding results AND it's the only thing there
    if ((foundConcepts.length > 0 || repositoryItems.length > 0) && placeholder && container.children.length === 1) {
         container.innerHTML = '';
    } else if ((foundConcepts.length > 0 || repositoryItems.length > 0) && !placeholder && container.children.length > 0 && !container.querySelector('.research-result-item')) {
         // Also clear if container has non-result content (like old dupe msg) and we're adding results
         container.innerHTML = '';
    }

    // Display duplicate message if applicable (prepend)
    if (duplicateInsightGain > 0) {
        const existingDupeMsg = container.querySelector('.duplicate-message');
        if(existingDupeMsg) existingDupeMsg.remove(); // Remove old one first
        const dupeMsg = document.createElement('p');
        dupeMsg.classList.add('duplicate-message');
        dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate echoes.`;
        container.prepend(dupeMsg);
        // Optional: Auto-remove after a delay
        // setTimeout(() => dupeMsg.remove(), 5000);
    }

    // Display Repository Items First (Prepended)
    repositoryItems.forEach(item => {
        if (container.querySelector(`[data-repo-id="${item.id}"]`)) return; // Avoid duplicates
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('repository-item-discovery');
        itemDiv.dataset.repoId = item.id; // Add data attribute
        let iconClass = 'fa-question-circle'; let typeName = 'Item';
        if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; }
        else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; }
        itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered the '${item.name}'. View it in the Repository.`}</p>`;
        container.prepend(itemDiv); // Prepend repo items
        // Optional: Auto-remove after a delay
        // setTimeout(() => itemDiv.remove(), 7000);
    });

    // Display Concept Cards (Appended)
    foundConcepts.forEach(concept => {
        if (!container.querySelector(`.research-result-item[data-concept-id="${concept.id}"]`)) {
            const resultItemDiv = document.createElement('div'); resultItemDiv.classList.add('research-result-item'); resultItemDiv.dataset.conceptId = concept.id;
            // Use 'discovery-note' context for rendering
            const cardElement = renderCard(concept, 'discovery-note');
            if (!cardElement) return;
            resultItemDiv.appendChild(cardElement);
            const actionDiv = document.createElement('div'); actionDiv.classList.add('research-actions');
            // Add "Add to Grimoire" Button
            const addButton = document.createElement('button'); addButton.textContent = "Add to Grimoire"; addButton.classList.add('button', 'small-button', 'add-button'); addButton.dataset.conceptId = concept.id; actionDiv.appendChild(addButton);
            // Add "Sell" Button (conditionally based on phase)
            if (State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
                const sellButton = document.createElement('button');
                let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
                const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
                sellButton.textContent = `Sell (${sellValue.toFixed(1)}) `; sellButton.innerHTML += `<i class="fas fa-brain insight-icon"></i>`;
                sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button');
                sellButton.dataset.conceptId = concept.id;
                sellButton.dataset.context = 'discovery'; // Set context for logic
                sellButton.title = `Sell for ${sellValue.toFixed(1)} Insight.`;
                actionDiv.appendChild(sellButton);
            }
            resultItemDiv.appendChild(actionDiv); container.appendChild(resultItemDiv); // Append concepts
        }
    });

    // If after adding everything, container is still empty (e.g., only got dupe insight), show placeholder
    const hasContent = container.querySelector('.research-result-item, .repository-item-discovery');
    if (!hasContent) {
        container.querySelector('.duplicate-message')?.remove(); // Remove dupe message if it's the only thing
        container.innerHTML = '<p><i>Discoveries will appear here...</i></p>';
    }
}


/** Removes a concept card from the research results area or updates its state */
export function updateResearchButtonAfterAction(conceptId, action) {
     const container = document.getElementById('studyResearchDiscoveries');
     const itemDiv = container?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
     if (!itemDiv || !container) return;

     if (action === 'add' || action === 'sell') {
         itemDiv.remove(); // Remove the whole item
         // Check if container is now empty (excluding potential dupe message)
         const hasContent = container.querySelector('.research-result-item, .repository-item-discovery');
         if (!hasContent) {
             container.querySelector('.duplicate-message')?.remove(); // Remove dupe if it's alone
             container.innerHTML = '<p><i>Discoveries will appear here...</i></p>'; // Restore placeholder
         }
     }
}

// --- Grimoire Screen UI ---
export function updateGrimoireCounter() { if (grimoireCountSpan) grimoireCountSpan.textContent = State.getDiscoveredConcepts().size; }
export function populateGrimoireFilters() { if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); } if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = fullName; option.textContent = name; grimoireElementFilter.appendChild(option); }); } }
export function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All", searchTerm = "", filterFocus = "All") { if (!grimoireContentDiv) return; grimoireContentDiv.innerHTML = ''; const discoveredMap = State.getDiscoveredConcepts(); if (discoveredMap.size === 0) { grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty... Discover Concepts in the Study!</p>'; return; } const userScores = State.getScores(); const focusedSet = State.getFocusedConcepts(); let discoveredArray = Array.from(discoveredMap.values()); filterType = filterType || "All"; filterElement = filterElement || "All"; sortBy = sortBy || "discovered"; filterRarity = filterRarity || "All"; searchTerm = searchTerm ? searchTerm.toLowerCase().trim() : ""; filterFocus = filterFocus || "All"; const conceptsToDisplay = discoveredArray.filter(data => { if (!data?.concept) return false; const concept = data.concept; const typeMatch = (filterType === "All") || (concept.cardType === filterType); let elementMatch = (filterElement === "All"); if (!elementMatch && elementNameToKey && filterElement !== "All") { const elementKey = elementNameToKey[filterElement]; if (elementKey) elementMatch = (concept.primaryElement === elementKey); else { console.warn(`UI: Could not find key for filterElement '${filterElement}'.`); elementMatch = false; } } else if (!elementNameToKey && filterElement !== "All") { console.error("UI Error: elementNameToKey map unavailable."); return false; } const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity); const focusMatch = (filterFocus === 'All') || (filterFocus === 'Focused' && focusedSet.has(concept.id)) || (filterFocus === 'Not Focused' && !focusedSet.has(concept.id)); const searchMatch = !searchTerm || (concept.name.toLowerCase().includes(searchTerm)) || (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTerm))); return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch; }); const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 }; conceptsToDisplay.sort((a, b) => { if (!a.concept || !b.concept) return 0; const conceptA = a.concept; const conceptB = b.concept; switch (sortBy) { case 'name': return conceptA.name.localeCompare(conceptB.name); case 'type': return (cardTypeKeys.indexOf(conceptA.cardType) - cardTypeKeys.indexOf(conceptB.cardType)) || conceptA.name.localeCompare(conceptB.name); case 'rarity': return (rarityOrder[conceptA.rarity] || 0) - (rarityOrder[conceptB.rarity] || 0) || conceptA.name.localeCompare(conceptB.name); case 'resonance': const distA = Utils.euclideanDistance(userScores, conceptA.elementScores); const distB = Utils.euclideanDistance(userScores, conceptB.elementScores); return distA - distB || conceptA.name.localeCompare(conceptB.name); default: return (a.discoveredTime || 0) - (b.discoveredTime || 0) || conceptA.name.localeCompare(conceptB.name); } }); if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters${searchTerm ? ' or search term' : ''}.</p>`; } else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); if (cardElement) { /* Add hover listeners if desired */ cardElement.addEventListener('mouseover', (event) => { /* ... */ }); cardElement.addEventListener('mouseout', (event) => { /* ... */ }); grimoireContentDiv.appendChild(cardElement); } }); } }
export function refreshGrimoireDisplay() { if (grimoireScreen && !grimoireScreen.classList.contains('hidden')) { const typeValue = grimoireTypeFilter?.value || "All"; const elementValue = grimoireElementFilter?.value || "All"; const sortValue = grimoireSortOrder?.value || "discovered"; const rarityValue = grimoireRarityFilter?.value || "All"; const searchValue = grimoireSearchInput?.value || ""; const focusValue = grimoireFocusFilter?.value || "All"; displayGrimoire(typeValue, elementValue, sortValue, rarityValue, searchValue, focusValue); } }
function handleFirstGrimoireVisit() { const visited = State.getState().grimoireFirstVisitDone; const hasConcepts = State.getDiscoveredConcepts().size > 0; const phaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; if (!visited && hasConcepts && phaseReady && grimoireGuidance) { grimoireGuidance.innerHTML = `Welcome to your Grimoire! Click the <i class="fa-regular fa-star"></i> on a card to 'Focus' it, adding it to your Persona Tapestry.`; grimoireGuidance.classList.remove('hidden'); State.markGrimoireVisited(); // Mark as visited in state
 setTimeout(() => { if (grimoireGuidance) grimoireGuidance.classList.add('hidden'); }, 8000); } else if (grimoireGuidance) { grimoireGuidance.classList.add('hidden'); } }


// --- Card Rendering (Corrected - No onclick attributes AND NO DUPLICATE) ---
export function renderCard(concept, context = 'grimoire') {
    // Basic validation
    if (!concept || typeof concept.id === 'undefined') {
        console.warn("renderCard called with invalid concept:", concept);
        const eDiv = document.createElement('div');
        eDiv.textContent = "Error: Invalid Concept Data";
        eDiv.style.color = 'red';
        eDiv.style.padding = '10px';
        eDiv.style.border = '1px solid red';
        return eDiv; // Return an error element
    }

    // Create card element and set base classes/attributes
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `View Details: ${concept.name}`;

    // Get state needed for rendering variations
    const discoveredData = State.getDiscoveredConceptData(concept.id);
    const isDiscovered = !!discoveredData;
    const isFocused = State.getFocusedConcepts().has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false;
    const currentPhase = State.getOnboardingPhase();

    // Determine button visibility based on context and phase
    const phaseAllowsFocus = currentPhase >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS;
    const showFocusButton = context === 'grimoire' && isDiscovered && phaseAllowsFocus; // Check for phase 3+ for card face button
    const phaseAllowsSellFromGrimoire = currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    const showSellButton = context === 'grimoire' && isDiscovered && phaseAllowsSellFromGrimoire;

    // --- Prepare content parts ---

    // Stamps (Focus and Research Note)
    const focusStampHTML = isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const noteStampHTML = (!isDiscovered && (context === 'discovery-note' || context === 'research-output')) ? '<span class="note-stamp" title="Research Note"><i class="fa-regular fa-clipboard"></i></span>' : '';

    // Icons
    const cardTypeIcon = Utils.getCardTypeIcon(concept.cardType);

    // Affinities
    let affinitiesHTML = '';
    if (concept.elementScores && elementKeyToFullName) {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
            const level = Utils.getAffinityLevel(score);
            if (level && elementKeyToFullName[key]) {
                const fullName = elementKeyToFullName[key];
                const color = Utils.getElementColor(fullName);
                const iconClass = Utils.getElementIcon(fullName);
                const elNameDet = elementDetails[fullName]?.name || fullName;
                affinitiesHTML += `<span class="affinity affinity-${level.toLowerCase()}" style="border-color: ${color}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="${elNameDet} Affinity: ${level} (${score.toFixed(1)})"><i class="${iconClass}" style="color: ${color};"></i></span> `;
            }
        });
    }

    // Visuals (Corrected logic)
    let visualIconClass = "fas fa-question card-visual-placeholder";
    let visualTitle = "Visual Placeholder"; // Default value
    if (artUnlocked) {
        visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked";
        visualTitle = "Enhanced Art Placeholder";
    } else if (concept.visualHandle) {
        visualIconClass = "fas fa-image card-visual-placeholder";
        visualTitle = "Art Placeholder";
    }
    // Construct visualContent *after* variables are set
    const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;


    // Action Buttons (Grimoire context only, no onclick)
    let actionButtonsHTML = '';
    let hasActions = false;
    if (context === 'grimoire') {
        actionButtonsHTML = '<div class="card-actions">';
        if (showSellButton) {
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
            const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            actionButtonsHTML += `<button class="button tiny-button secondary-button sell-button card-sell-button" data-concept-id="${concept.id}" data-context="grimoire" title="Sell (${sellValue.toFixed(1)} Insight)"><i class="fas fa-dollar-sign"></i></button>`;
            hasActions = true;
        }
        if (showFocusButton) { // This correctly uses the phase-checked variable
            const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
            const buttonClass = isFocused ? 'marked' : '';
            const buttonIcon = isFocused ? 'fa-star' : 'fa-regular fa-star';
            const buttonTitle = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove Focus' : 'Mark as Focus');
            actionButtonsHTML += `<button class="button tiny-button card-focus-button ${buttonClass}" data-concept-id="${concept.id}" title="${buttonTitle}" ${slotsFull ? 'disabled' : ''}><i class="fas ${buttonIcon}"></i></button>`;
            hasActions = true;
        }
        actionButtonsHTML += '</div>';
        if (!hasActions) actionButtonsHTML = ''; // Don't add empty div if no buttons shown
    }

    // --- Construct Final innerHTML ---
    // This uses the fully constructed variable strings from above
    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${focusStampHTML}${noteStampHTML}</span>
        </div>
        <div class="card-visual">${visualContent}</div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
            ${actionButtonsHTML}
        </div>`;

    // Add specific class for research notes styling
    if (context === 'research-output' || context === 'discovery-note') {
        cardDiv.title = `Click to view details for ${concept.name} (Not yet in Grimoire)`;
        cardDiv.classList.add('research-note-card');
    }

    // Main card click listener is handled by delegation in main.js

    return cardDiv; // Ensure this return is the LAST line inside the function's braces

} // <<< --- IMPORTANT: This is the closing brace for the renderCard function ---


// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    const conceptData = concepts.find(c => c.id === conceptId);
    if (!conceptData) { console.error("Concept data missing:", conceptId); return; }
    const discoveredData = State.getDiscoveredConceptData(conceptId);
    const inGrimoire = !!discoveredData;
    const currentPhase = State.getOnboardingPhase();
    const researchNotesArea = document.getElementById('studyResearchDiscoveries');
    const inResearchNotes = !inGrimoire && researchNotesArea?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);

    GameLogic.setCurrentPopupConcept(conceptId); // Track which concept is open

    // --- Populate Basic Info ---
    if (popupConceptName) popupConceptName.textContent = conceptData.name;
    if (popupConceptType) popupConceptType.textContent = conceptData.cardType;
    if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;
    if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No description.";

    // --- Populate Visual ---
    const artUnlocked = discoveredData?.artUnlocked || false;
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = ''; // Clear previous
        let visualIconClass = "fas fa-question card-visual-placeholder";
        let visualTitle = "Visual Placeholder";
        if (artUnlocked) {
            visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked";
            visualTitle = "Enhanced Art Placeholder";
        } else if (conceptData.visualHandle) {
            visualIconClass = "fas fa-image card-visual-placeholder";
            visualTitle = "Art Placeholder";
        }
        const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;
        popupVisualContainer.innerHTML = visualContent;
    }

    // --- Populate Analysis Sections ---
    const scores = State.getScores();
    const distance = Utils.euclideanDistance(scores, conceptData.elementScores);
    displayPopupResonance(distance);
    // Ensure details sections exist before trying to populate
    if(popupRecipeDetailsSection) displayPopupRecipeComparison(conceptData, scores);
    if(popupRelatedDetailsSection) displayPopupRelatedConcepts(conceptData);


    // --- Populate Notes Section (Conditional) ---
    const showNotes = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    if (myNotesSection && myNotesTextarea && saveMyNoteButton) {
        myNotesSection.classList.toggle('hidden', !showNotes);
        if (showNotes) {
            myNotesTextarea.value = discoveredData.notes || "";
            if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; // Clear status on open
        }
    }

    // --- Populate Evolution Section (Conditional) ---
    const showEvolution = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED && conceptData.canUnlockArt && !artUnlocked;
    if (popupEvolutionSection) {
        popupEvolutionSection.classList.toggle('hidden', !showEvolution);
        if (showEvolution) {
            displayEvolutionSection(conceptData, discoveredData); // Populate eligibility/button state
        }
    }

    // --- Update Action Buttons ---
    updateGrimoireButtonStatus(conceptId, !!inResearchNotes);
    updateFocusButtonStatus(conceptId); // Corrected visibility handled inside
    updatePopupSellButton(conceptId, conceptData, inGrimoire, !!inResearchNotes);

    // --- Show Popup ---
    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}


export function displayPopupResonance(distance) {
    if (!popupResonanceSummary) return;
    let resonanceLabel, resonanceClass, message;
    if (distance === Infinity || isNaN(distance)) { resonanceLabel = "N/A"; resonanceClass = ""; message = "(Cannot compare profiles)"; }
    else if (distance < 2.5) { resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strongly aligns."; }
    else if (distance < 4.0) { resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares common ground."; }
    else if (distance < 6.0) { resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities."; }
    else if (distance <= Config.DISSONANCE_THRESHOLD) { resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence."; }
    else { resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significant divergence."; }
    popupResonanceSummary.innerHTML = `Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> <small>(Dist: ${distance.toFixed(1)})</small><br><small>${message}</small> <i class="fas fa-info-circle info-icon" title="How closely this Concept's elemental scores align with your Core Foundation scores. High resonance suggests strong alignment, Dissonant suggests significant divergence."></i>`;
}

export function displayPopupRecipeComparison(conceptData, userCompScores) {
    // Target elements *inside* the details section
    const detailsElement = document.getElementById('popupRecipeDetails');
    const conceptProfileContainer = detailsElement?.querySelector('#popupConceptProfile');
    const userProfileContainer = detailsElement?.querySelector('#popupUserComparisonProfile');
    const highlightsContainer = detailsElement?.querySelector('#popupComparisonHighlights');

    if (!conceptProfileContainer || !userProfileContainer || !highlightsContainer || !detailsElement) {
         console.warn("Popup recipe comparison elements not found within #popupRecipeDetails!");
         if(detailsElement) detailsElement.style.display = 'none'; // Hide section if content divs missing
         return;
    }
    detailsElement.style.display = ''; // Ensure section is potentially visible

    conceptProfileContainer.innerHTML = ''; userProfileContainer.innerHTML = ''; highlightsContainer.innerHTML = '';
    let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>';
    let hasHighlights = false;
    const conceptScores = conceptData.elementScores || {};

    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const fullName = elementKeyToFullName[key];
        if (!fullName) return; // Skip if mapping fails

        const conceptScore = conceptScores[key];
        const userScore = userCompScores[key];
        const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore);
        const userScoreValid = typeof userScore === 'number' && !isNaN(userScore);
        const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?';
        const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';
        const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A';
        const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A';
        const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0;
        const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0;
        const color = Utils.getElementColor(fullName);
        const elementNameShort = elementDetails[fullName]?.name.substring(0, 11) || elName; // Abbreviate name

        // Populate profile columns
        conceptProfileContainer.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${conceptDisplay}</span> <div class="score-bar-container" title="${conceptLabel}"><div style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`;
        userProfileContainer.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${userDisplay}</span> <div class="score-bar-container" title="${userLabel}"><div style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`;

        // Generate highlights text
        if (conceptScoreValid && userScoreValid) {
            const diff = Math.abs(conceptScore - userScore);
            const elementNameDisplay = elementDetails[fullName]?.name || elName;
            if (conceptScore >= 7 && userScore >= 7) {
                highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true;
            } else if (conceptScore <= 3 && userScore <= 3) {
                highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true;
            } else if (diff >= 4) {
                highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept: ${conceptLabel}, You: ${userLabel})</p>`; hasHighlights = true;
            }
        }
    });

    if (!hasHighlights) {
        highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>';
    }
    highlightsContainer.innerHTML = highlightsHTML;
    detailsElement.open = false; // Start collapsed
    const nestedDetails = detailsElement.querySelector('.element-details');
    if(nestedDetails) nestedDetails.open = false; // Ensure nested is also collapsed
}

export function displayPopupRelatedConcepts(conceptData) {
    const detailsElement = document.getElementById('popupRelatedDetails');
    if (!detailsElement) { console.warn("Popup related concepts details element #popupRelatedDetails not found!"); return; }

    // Use the more specific selector defined at the top
    const listContainer = popupRelatedConceptsList;
    if (!listContainer) { console.error("Inner list container (.related-concepts-list-dropdown) not found in #popupRelatedDetails!"); detailsElement.style.display = 'none'; return; }

    listContainer.innerHTML = ''; // Clear previous list items
    detailsElement.style.display = ''; // Ensure details section is potentially visible

    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
        let foundCount = 0;
        conceptData.relatedIds.forEach(relatedId => {
            const relatedConcept = concepts.find(c => c.id === relatedId);
            if (relatedConcept) {
                const span = document.createElement('span');
                span.textContent = relatedConcept.name;
                span.classList.add('related-concept-item');
                span.title = `Related: ${relatedConcept.name}`;
                listContainer.appendChild(span); // Append to the inner list container
                foundCount++;
            } else {
                console.warn(`Related concept ID ${relatedId} in concept ${conceptData.id} not found.`);
            }
        });
        if (foundCount === 0) { listContainer.innerHTML = '<p><em>Error: Related concepts specified but not found in data.</em></p>'; }
        detailsElement.open = false; // Start collapsed
    } else {
        listContainer.innerHTML = '<p><em>None specified.</em></p>';
        detailsElement.open = false; // Start collapsed
    }
}

export function displayEvolutionSection(conceptData, discoveredData) {
    if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return;
    const isDiscovered = !!discoveredData;
    const canUnlockArt = conceptData.canUnlockArt;
    const alreadyUnlocked = discoveredData?.artUnlocked || false;
    const isFocused = State.getFocusedConcepts().has(conceptData.id);
    const hasReflected = State.getSeenPrompts().size > 0; // Check if *any* reflection done
    const hasEnoughInsight = State.getInsight() >= Config.ART_EVOLVE_COST;
    const currentPhase = State.getOnboardingPhase();

    // Section is visible ONLY if discovered, art can be unlocked, not already unlocked, AND in advanced phase
    const showSection = isDiscovered && canUnlockArt && !alreadyUnlocked && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
    popupEvolutionSection.classList.toggle('hidden', !showSection);

    if (!showSection) {
        evolveArtButton.disabled = true;
        evolveEligibility.classList.add('hidden');
        return; // Don't process further if section is hidden
    }

    // If section is shown, update button state
    evolveCostSpan.textContent = `${Config.ART_EVOLVE_COST}`;
    let eligibilityText = '';
    let canEvolve = true;

    if (!isFocused) { eligibilityText += '<li>Requires: Mark as Focus</li>'; canEvolve = false; }
    else { eligibilityText += '<li><i class="fas fa-check"></i> Focused</li>'; }

    if (!hasReflected) { eligibilityText += '<li>Requires: Engage in Reflection (Any)</li>'; canEvolve = false; }
    else { eligibilityText += '<li><i class="fas fa-check"></i> Reflected</li>'; }

    if (!hasEnoughInsight) { eligibilityText += `<li>Requires: ${Config.ART_EVOLVE_COST} Insight</li>`; canEvolve = false;}
    else { eligibilityText += `<li><i class="fas fa-check"></i> Insight OK</li>`; }

    evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`;
    evolveEligibility.classList.remove('hidden');
    evolveArtButton.disabled = !canEvolve;
}

export function updateGrimoireButtonStatus(conceptId, inResearchNotes = false) {
    if (!addToGrimoireButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    // Show the "Add" button ONLY if the concept is NOT discovered
    addToGrimoireButton.classList.toggle('hidden', isDiscovered);
    if (!isDiscovered) {
        // Ensure button is enabled if shown (unless other conditions apply, though none currently do)
        addToGrimoireButton.disabled = false;
        addToGrimoireButton.textContent = "Add to Grimoire";
        addToGrimoireButton.classList.remove('added'); // Ensure 'added' class is removed
    }
}

export function updateFocusButtonStatus(conceptId) {
    if (!markAsFocusButton) return; // Ensure the button element exists

    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
    // const currentPhase = State.getOnboardingPhase(); // Phase check removed for popup visibility

    // Show the POPUP button simply if the concept is discovered (in Grimoire).
    const showButton = isDiscovered;

    markAsFocusButton.classList.toggle('hidden', !showButton);

    if (showButton) {
        markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus";
        // Disable button if slots are full AND user is trying to ADD focus
        markAsFocusButton.disabled = (slotsFull && !isFocused);
        markAsFocusButton.classList.toggle('marked', isFocused);
        markAsFocusButton.title = markAsFocusButton.disabled && !isFocused ? `Focus slots full (${State.getFocusSlots()})` : (isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts");
    }
}


export function updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes) {
    const popupActions = conceptDetailPopup?.querySelector('.popup-actions');
    if (!popupActions || !conceptData) return;
    popupActions.querySelector('.popup-sell-button')?.remove(); // Clear existing sell button

    let context = 'none';
    if (inGrimoire) context = 'grimoire';
    else if (inResearchNotes) context = 'discovery'; // Use 'discovery' for notes context

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
        sellButton.dataset.context = context; // Mark context for gameLogic
        sellButton.title = `Sell from ${sourceLocation} for ${sellValue.toFixed(1)} Insight.`;
        // Event listener is handled by delegation in main.js

        // Add the button to the actions area
        // Insert after Focus button if it's visible, otherwise after Add button if it's visible, else append
        if (markAsFocusButton && !markAsFocusButton.classList.contains('hidden')) {
            markAsFocusButton.insertAdjacentElement('afterend', sellButton);
        } else if (addToGrimoireButton && !addToGrimoireButton.classList.contains('hidden')) {
             addToGrimoireButton.insertAdjacentElement('afterend', sellButton);
        } else {
            popupActions.appendChild(sellButton);
        }
    }
}


// --- Reflection Modal UI ---
export function displayReflectionPrompt(promptData, context) {
    if (!reflectionModal || !promptData || !promptData.prompt) {
        console.error("Reflection modal or prompt data/text missing.", promptData);
        // Attempt to gracefully handle error without stopping execution
        if (context === 'Dissonance') {
            const conceptId = GameLogic.getCurrentPopupConceptId();
            if (conceptId) {
                console.warn("Reflection prompt missing for Dissonance, adding concept directly.");
                // Check if addConceptToGrimoireInternal exists before calling
                if (typeof GameLogic.addConceptToGrimoireInternal === 'function') {
                     GameLogic.addConceptToGrimoireInternal(conceptId);
                     hidePopups();
                     showTemporaryMessage("Reflection unavailable, concept added.", 3500);
                } else {
                    console.error("addConceptToGrimoireInternal is not available!");
                     showTemporaryMessage("Critical Error: Cannot process reflection.", 4000);
                }
            } else {
                showTemporaryMessage("Error: Could not display reflection or find target concept.", 3000);
            }
        } else {
            showTemporaryMessage("Error: Could not display reflection.", 3000);
        }
        return; // Stop further processing of this function
    }
    const { title, category, prompt, showNudge, reward } = promptData;
    if (reflectionModalTitle) reflectionModalTitle.textContent = title || "Moment for Reflection";
    if (reflectionElement) reflectionElement.textContent = category || "General";
    if (reflectionPromptText) reflectionPromptText.textContent = prompt.text;
    if (reflectionCheckbox) reflectionCheckbox.checked = false;
    if (scoreNudgeCheckbox && scoreNudgeLabel) {
        scoreNudgeCheckbox.checked = false;
        scoreNudgeCheckbox.classList.toggle('hidden', !showNudge);
        scoreNudgeLabel.classList.toggle('hidden', !showNudge);
    }
    if (confirmReflectionButton) confirmReflectionButton.disabled = true;
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)}`;
    reflectionModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}


// --- Integrated Element Deep Dive UI ---
export function displayElementDeepDive(elementKey, targetContainerElement) {
    // Ensure target container exists
    if (!targetContainerElement) {
        console.warn(`UI: Target container not provided or found for displayElementDeepDive (${elementKey})`);
        // Attempt to find it again if missing initially
        targetContainerElement = personaElementDetailsDiv?.querySelector(`.element-deep-dive-container[data-element-key="${elementKey}"]`);
        if (!targetContainerElement) {
            console.error(`UI: Still could not find target container for element ${elementKey}`);
            return;
        }
    }

    const deepDiveData = elementDeepDive[elementKey] || [];
    const unlockedLevels = State.getState().unlockedDeepDiveLevels;
    const currentLevel = unlockedLevels[elementKey] || 0;
    const elementName = elementKeyToFullName[elementKey] || elementKey;
    const currentPhase = State.getOnboardingPhase();
    const insight = State.getInsight();
    // Unlocking only possible in advanced phase
    const phaseAllowsUnlocking = currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;

    // Clear previous content and set title
    targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${elementDetails[elementName]?.name || elementName} Insights</h5>`;

    if (deepDiveData.length === 0) {
        targetContainerElement.innerHTML += '<p>No deep dive content available.</p>';
        return;
    }

    let displayedContent = false;
    // Display unlocked levels
    deepDiveData.forEach(levelData => {
        if (levelData.level <= currentLevel) {
            targetContainerElement.innerHTML += `<div class="library-level"><h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5><div class="level-content">${levelData.content}</div></div><hr class="popup-hr">`;
            displayedContent = true;
        }
    });

    // Add placeholder if no levels are unlocked yet
    if (!displayedContent && currentLevel === 0) {
        targetContainerElement.innerHTML += '<p><i>Unlock the first level to begin exploring.</i></p>';
    } else if (!displayedContent && currentLevel > 0) {
        // This case shouldn't happen if state is correct, but good to have fallback
        targetContainerElement.innerHTML += '<p><i>Error displaying unlocked content. Check console.</i></p>';
    }

    // Display unlock button for the next level
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
                        ${!canAfford || !phaseAllowsUnlocking ? 'disabled' : ''}
                        title="${!phaseAllowsUnlocking ? 'Unlock in later phase' : !canAfford ? `Requires ${cost} Insight` : `Unlock for ${cost} Insight`}">
                    Unlock (${cost} <i class="fas fa-brain insight-icon"></i>)
                </button>
                ${!canAfford && phaseAllowsUnlocking ? `<p class='unlock-error'>Insufficient Insight (${insight.toFixed(1)}/${cost})</p>` : ''}
                ${!phaseAllowsUnlocking ? `<p class='unlock-error'>Unlock in later phase</p>` : ''}
            </div>`;
    } else if (displayedContent) {
        // Only show "all unlocked" if some content was actually displayed
        targetContainerElement.innerHTML += '<p class="all-unlocked-message"><i>All insights unlocked for this element.</i></p>';
    }
}


// --- Repository UI ---
export function displayRepositoryContent() {
    const currentPhase = State.getOnboardingPhase();
    const showRepository = currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;

    if (repositoryScreen) repositoryScreen.classList.toggle('hidden-by-flow', !showRepository);
    if (!showRepository) return; // Don't proceed if screen shouldn't be visible

    // Check if containers exist
    if (!repositoryFocusUnlocksDiv || !repositoryScenesDiv || !repositoryExperimentsDiv || !repositoryInsightsDiv) {
        console.error("Repository list containers missing!"); return;
    }

    console.log("UI: Displaying Repository Content");
    // Clear existing content
    repositoryFocusUnlocksDiv.innerHTML = ''; repositoryScenesDiv.innerHTML = ''; repositoryExperimentsDiv.innerHTML = ''; repositoryInsightsDiv.innerHTML = '';

    const repoItems = State.getRepositoryItems();
    const unlockedFocusData = State.getUnlockedFocusItems();
    const attunement = State.getAttunement();
    const focused = State.getFocusedConcepts();
    const insight = State.getInsight();

    // Display Focus Unlocks
    if (unlockedFocusData.size > 0) {
        unlockedFocusData.forEach(unlockId => {
            const unlockData = focusDrivenUnlocks.find(u => u.id === unlockId);
            if (unlockData?.unlocks) {
                const item = unlockData.unlocks;
                const div = document.createElement('div');
                div.classList.add('repository-item', 'focus-unlock-item');
                let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`;
                if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`;
                if (item.type === 'insightFragment') {
                    const iData = elementalInsights.find(i => i.id === item.id);
                    itemHTML += `<p><em>"${iData?.text || item.text || "..."}"</em></p>`;
                } else itemHTML += `<p>Details below.</p>`;
                div.innerHTML = itemHTML;
                repositoryFocusUnlocksDiv.appendChild(div);
            }
        });
    } else { repositoryFocusUnlocksDiv.innerHTML = '<p>Focus on synergistic Concepts on the Persona screen to unlock items.</p>'; }

    // Display Scene Blueprints
    if (repoItems.scenes.size > 0) {
        repoItems.scenes.forEach(sceneId => {
            const scene = sceneBlueprints.find(s => s.id === sceneId);
            if (scene) {
                const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
                const canAfford = insight >= cost;
                repositoryScenesDiv.appendChild(renderRepositoryItem(scene, 'scene', cost, canAfford));
            } else { console.warn(`Scene ID ${sceneId} not found.`); }
        });
    } else { repositoryScenesDiv.innerHTML = '<p>No Scene Blueprints discovered. Try using "Suggest Scenes".</p>'; }

    // Display Experiments
    let experimentsDisplayed = 0;
    alchemicalExperiments.forEach(exp => {
        const isUnlockedByAttunement = attunement[exp.requiredElement] >= exp.requiredAttunement;
        const alreadyCompleted = repoItems.experiments.has(exp.id);
        if (isUnlockedByAttunement) {
            let canAttempt = true; let unmetReqs = [];
            if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } }
            if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let met = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { met = true; break; } } if (!met) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } }
            const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST;
            const canAfford = insight >= cost;
            if (!canAfford) unmetReqs.push("Insight"); // Add Insight to unmet if applicable
            repositoryExperimentsDiv.appendChild(renderRepositoryItem(exp, 'experiment', cost, canAfford && canAttempt && !alreadyCompleted, alreadyCompleted, unmetReqs));
            experimentsDisplayed++;
        }
    });
    if (experimentsDisplayed === 0) { repositoryExperimentsDiv.innerHTML = '<p>Increase Element Attunement to unlock Experiments.</p>'; }

    // Display Insights
    if (repoItems.insights.size > 0) {
        const insightsByElement = {};
        elementNames.forEach(elName => insightsByElement[elementNameToKey[elName]] = []);
        repoItems.insights.forEach(insightId => {
            const insightData = elementalInsights.find(i => i.id === insightId);
            if (insightData) {
                if (!insightsByElement[insightData.element]) insightsByElement[insightData.element] = []; // Ensure array exists
                insightsByElement[insightData.element].push(insightData);
            } else { console.warn(`Insight ID ${insightId} not found.`); }
        });
        let insightsHTML = '';
        elementNames.forEach(elName => { // Iterate in defined order
            const key = elementNameToKey[elName];
            if (insightsByElement[key] && insightsByElement[key].length > 0) {
                insightsHTML += `<h5>${elementDetails[elName]?.name || elName} Insights:</h5><ul>`;
                insightsByElement[key].sort((a, b) => a.id.localeCompare(b.id)).forEach(insight => { insightsHTML += `<li>"${insight.text}"</li>`; });
                insightsHTML += `</ul>`;
            }
        });
        repositoryInsightsDiv.innerHTML = insightsHTML || '<p>No Elemental Insights collected.</p>'; // Fallback if somehow empty
    } else { repositoryInsightsDiv.innerHTML = '<p>No Elemental Insights collected. Found occasionally during Research.</p>'; }

    // Display Milestones
    displayMilestones();

    // Trigger milestone check related to repository contents
    GameLogic.updateMilestoneProgress('repositoryContents', null);
}


export function renderRepositoryItem(item, type, cost, canDoAction, completed = false, unmetReqs = []) {
    const div = document.createElement('div');
    div.classList.add('repository-item', `repo-item-${type}`);
    if (completed) div.classList.add('completed');
    let actionsHTML = ''; let buttonDisabled = !canDoAction; let buttonTitle = ''; let buttonText = '';

    if (type === 'scene') {
        buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`;
        if (!canDoAction) buttonTitle = `Requires ${cost} Insight`; else buttonTitle = `Meditate on ${item.name}`;
        actionsHTML = `<button class="button small-button" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
    } else if (type === 'experiment') {
        buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`;
        if (completed) { buttonTitle = "Experiment Completed"; buttonDisabled = true; } // Ensure disabled if completed
        else if (!canDoAction && unmetReqs.includes("Insight")) { buttonTitle = `Requires ${cost} Insight`; buttonDisabled = true; } // Check unmetReqs first
        else if (!canDoAction && unmetReqs.length > 0) { buttonTitle = `Requires Focus: ${unmetReqs.join(', ')}`; buttonDisabled = true; }
        // else if (!canDoAction) { buttonTitle = `Requires ${cost} Insight`; buttonDisabled = true;} // Removed redundant check, handled by unmetReqs
        else { buttonTitle = `Attempt ${item.name}`; buttonDisabled = false;} // Enable if no unmetReqs and affordable

        actionsHTML = `<button class="button small-button" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
        if (completed) actionsHTML += ` <span class="completed-text">(Completed)</span>`;
        else if (!canDoAction && unmetReqs.includes("Insight")) actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`;
        else if (!canDoAction && unmetReqs.length > 0) actionsHTML += ` <small class="req-missing">(Requires Focus: ${unmetReqs.join(', ')})</small>`;
    }
    div.innerHTML = `<h4>${item.name} ${type === 'experiment' ? `(Req: ${item.requiredAttunement} ${elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4><p>${item.description}</p><div class="repo-actions">${actionsHTML}</div>`;
    return div;
}


// --- Milestones UI ---
export function displayMilestones() {
    if (!milestonesDisplay) return;
    milestonesDisplay.innerHTML = '';
    const achieved = State.getState().achievedMilestones;
    if (achieved.size === 0) {
        milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>';
        return;
    }
    // Filter milestones from data.js based on achieved IDs, maintaining original order
    const achievedMilestonesData = milestones.filter(m => achieved.has(m.id));
    achievedMilestonesData.forEach(milestone => {
        const li = document.createElement('li');
        li.textContent = `✓ ${milestone.description}`;
        milestonesDisplay.appendChild(li);
    });
}

// --- Settings Popup UI ---
export function showSettings() { if (settingsPopup) settingsPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden'); }

// --- Tapestry Deep Dive UI ---
export function displayTapestryDeepDive(analysisData) { if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveNarrativeP || !deepDiveFocusIcons || !deepDiveAnalysisNodes || !deepDiveDetailContent) { console.error("Deep Dive Modal elements missing!"); showTemporaryMessage("Error opening Deep Dive.", 3000); return; } console.log("UI: displayTapestryDeepDive called with analysis:", analysisData); deepDiveNarrativeP.innerHTML = analysisData.fullNarrativeHTML || "Could not generate narrative."; deepDiveFocusIcons.innerHTML = ''; const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts(); focused.forEach(id => { const concept = discovered.get(id)?.concept; if (concept) { let iconClass = Utils.getElementIcon("Default"); let iconColor = '#CCCCCC'; let iconTitle = concept.name; if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) { const fullElementName = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); iconTitle = `${concept.name} (${elementDetails[fullElementName]?.name || fullElementName})`; } else { console.warn(`Concept ${concept.name} missing valid primaryElement for deep dive icon.`); iconClass = Utils.getCardTypeIcon(concept.cardType); } const icon = document.createElement('i'); icon.className = `${iconClass}`; icon.style.color = iconColor; icon.title = iconTitle; deepDiveFocusIcons.appendChild(icon); } }); if (deepDiveDetailContent) deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>'; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active')); updateContemplationButtonState(); tapestryDeepDiveModal.classList.remove('hidden'); popupOverlay.classList.remove('hidden'); }
export function updateContemplationButtonState() { if (!contemplationNodeButton) return; const cooldownEnd = State.getContemplationCooldownEnd(); const now = Date.now(); const insight = State.getInsight(); const cost = Config.CONTEMPLATION_COST; let disabled = false; let title = `Contemplate your focus (${cost} Insight)`; let text = `Contemplate (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); disabled = true; title = `Contemplation available in ${remaining}s`; text = `On Cooldown (${remaining}s)`; } else if (insight < cost) { disabled = true; title = `Requires ${cost} Insight`; } contemplationNodeButton.disabled = disabled; contemplationNodeButton.title = title; contemplationNodeButton.innerHTML = text; }
export function updateDeepDiveContent(htmlContent, nodeId) { if (!deepDiveDetailContent) return; console.log(`UI: Updating deep dive content for node: ${nodeId}`); deepDiveDetailContent.innerHTML = htmlContent; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.toggle('active', btn.dataset.nodeId === nodeId); }); }
export function displayContemplationTask(task) { if (!deepDiveDetailContent || !task) return; console.log("UI: Displaying contemplation task:", task); let html = `<h4>Contemplation Task</h4><p>${task.text}</p>`; if (task.requiresCompletionButton) { const rewardText = task.reward.type === 'insight' ? `<i class="fas fa-brain insight-icon"></i>` : 'Attun.'; html += `<button id="completeContemplationBtn" class="button small-button">Mark Complete (+${task.reward.amount} ${rewardText})</button>`; } deepDiveDetailContent.innerHTML = html; const completeBtn = document.getElementById('completeContemplationBtn'); if (completeBtn) { completeBtn.addEventListener('click', () => { GameLogic.handleCompleteContemplation(task); }, { once: true }); } deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.toggle('active', btn.id === 'contemplationNode'); }); }
export function clearContemplationTask() { if (deepDiveDetailContent) { deepDiveDetailContent.innerHTML = '<p>Contemplation acknowledged.</p>'; setTimeout(() => { if (deepDiveDetailContent && deepDiveDetailContent.innerHTML === '<p>Contemplation acknowledged.</p>') { deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>'; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.remove('active'); }); } }, 1500); } updateContemplationButtonState(); }
export function updateTapestryDeepDiveButton() { const btn = document.getElementById('exploreTapestryButton'); if (btn) { const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; const hasFocus = State.getFocusedConcepts().size > 0; btn.classList.toggle('hidden-by-flow', !isPhaseReady); btn.disabled = !isPhaseReady || !hasFocus; btn.title = !isPhaseReady ? "Unlock later..." : (!hasFocus ? "Focus on concepts first..." : "Explore a deeper analysis..."); } else { console.warn("UI: updateTapestryDeepDiveButton - Button not found!"); } }

// --- Suggest Scene Button UI ---
export function updateSuggestSceneButtonState() { if (!suggestSceneButton) return; const hasFocus = State.getFocusedConcepts().size > 0; const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST; const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; suggestSceneButton.classList.toggle('hidden-by-flow', !isPhaseReady); if (isPhaseReady) { suggestSceneButton.disabled = !hasFocus || !canAfford; if (!hasFocus) suggestSceneButton.title = "Focus on concepts first"; else if (!canAfford) suggestSceneButton.title = `Requires ${Config.SCENE_SUGGESTION_COST} Insight`; else suggestSceneButton.title = `Suggest resonant scenes (${Config.SCENE_SUGGESTION_COST} Insight)`; } else { suggestSceneButton.disabled = true; suggestSceneButton.title = "Unlock later"; } if(sceneSuggestCostDisplay) sceneSuggestCostDisplay.textContent = Config.SCENE_SUGGESTION_COST; }

// --- Display Research Status --- (Replaced usage of missing element)
export function displayResearchStatus(message) {
    showTemporaryMessage(message, 2000); // Use toast notifications for status updates
}

// --- Initial UI Setup Helper ---
export function setupInitialUI() {
    console.log("UI: Setting up initial UI state...");
    applyOnboardingPhaseUI(Config.ONBOARDING_PHASE.START); // Start at phase 0
    if(mainNavBar) mainNavBar.classList.add('hidden'); // Ensure nav hidden
    showScreen('welcomeScreen'); // Show welcome screen
    const loadBtn = document.getElementById('loadButton');
    if (loadBtn) loadBtn.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY)); // Show load button only if save exists
    else console.warn("Load button element not found during initial setup.");
    // Update buttons that depend on state, even if phase 0
    updateSuggestSceneButtonState();
    updateTapestryDeepDiveButton();
}

console.log("ui.js loaded.");

// --- END OF FULL ui.js ---
