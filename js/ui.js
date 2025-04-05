// --- START OF FILE ui.js ---

// js/ui.js - Handles DOM Manipulation and UI Updates
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js'; // Needed for button actions
import { elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals, sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames } from '../data.js'; // Adjusted path assuming data.js is in parent

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
// REMOVED: const focusResonanceBarsContainer = document.getElementById('focusResonanceBars'); // Removed in previous step
const tapestryNarrativeP = document.getElementById('tapestryNarrative');
const personaThemesList = document.getElementById('personaThemesList');
const summaryContentDiv = document.getElementById('summaryContent');
// Study Screen (Split Structure)
const studyScreen = document.getElementById('studyScreen');
const studyScreenDiscoveryMode = document.getElementById('studyScreenDiscoveryMode'); // NEW: Initial discovery view container
const initialDiscoveryGuidance = document.getElementById('initialDiscoveryGuidance'); // NEW: Text area in discovery mode
const initialDiscoveryElements = document.getElementById('initialDiscoveryElements'); // NEW: Container for 6 elements in discovery mode
const initialResearchDiscoveries = document.getElementById('initialResearchDiscoveries'); // NEW: Results area for discovery mode
const studyScreenStandardMode = document.getElementById('studyScreenStandardMode'); // NEW: Container for standard layout
const userInsightDisplayStudy = document.getElementById('userInsightDisplayStudy'); // Used in both standard mode and potentially shared/duplicated for discovery
const researchButtonContainer = document.getElementById('researchButtonContainer'); // Standard mode research buttons
const freeResearchButton = document.getElementById('freeResearchButton'); // Daily free research button (standard mode)
const seekGuidanceButton = document.getElementById('seekGuidanceButton'); // Standard mode
const researchStatus = document.getElementById('researchStatus'); // Standard mode status display
const researchOutput = document.getElementById('researchOutput'); // Standard mode results area
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay'); // Standard mode rituals display
const guidedReflectionCostDisplay = document.getElementById('guidedReflectionCostDisplay'); // Standard mode cost span for guidance
const ritualsAlcove = studyScreenStandardMode?.querySelector('.rituals-alcove'); // Reference within standard mode for visibility toggle
// Grimoire Screen
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
    toastElement.classList.toggle('guidance-toast', isGuidance); // Optional styling hook
    if (toastTimeout) { clearTimeout(toastTimeout); }
    toastElement.classList.remove('hidden', 'visible');
    void toastElement.offsetWidth; // Trigger reflow for animation
    toastElement.classList.add('visible');
    toastElement.classList.remove('hidden');
    toastTimeout = setTimeout(() => {
        toastElement.classList.remove('visible');
         // Add a delay before adding 'hidden' to allow fade-out animation
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
    milestoneTimeout = setTimeout(hideMilestoneAlert, 5000); // Auto-hide after 5 seconds
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
    if (infoPopupElement) infoPopupElement.classList.add('hidden'); // Close info popup too

    // Only hide overlay if ALL popups are hidden
    const anyPopupVisible = document.querySelector('.popup:not(.hidden)');
    if (!anyPopupVisible && popupOverlay) popupOverlay.classList.add('hidden');

    GameLogic.clearPopupState(); // Clear temporary logic state associated with popups
}

// --- Screen Management ---
let previousScreenId = 'welcomeScreen'; // Track previous screen for context

export function showScreen(screenId) {
    console.log("UI: Showing screen:", screenId);
    const currentState = State.getState();
    const currentPhase = currentState.onboardingPhase;
    const isPostQuestionnaire = currentState.questionnaireCompleted;

    screens.forEach(screen => {
        screen?.classList.toggle('current', screen.id === screenId);
        screen?.classList.toggle('hidden', screen.id !== screenId);
    });

    // Navigation Bar visibility
    if (mainNavBar) {
        mainNavBar.classList.toggle('hidden', !isPostQuestionnaire || screenId === 'welcomeScreen' || screenId === 'questionnaireScreen');
    }
    navButtons.forEach(button => {
        if (button) button.classList.toggle('active', button.dataset.target === screenId);
    });

    // Specific screen setup logic
    if (isPostQuestionnaire) {
        if (screenId === 'studyScreen') {
            // Check if we are in the initial discovery phase
            const isInDiscoveryMode = currentPhase === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
            if (studyScreenDiscoveryMode) studyScreenDiscoveryMode.classList.toggle('hidden', !isInDiscoveryMode);
            if (studyScreenStandardMode) studyScreenStandardMode.classList.toggle('hidden', isInDiscoveryMode);

            if (isInDiscoveryMode) {
                displayStudyScreen_DiscoveryMode(); // Render discovery layout
            } else {
                displayStudyScreen_StandardMode(); // Render standard layout
            }
        } else if (screenId === 'personaScreen') {
             // Default to summary view ONLY on the very first transition from questionnaire
             const justFinishedQuestionnaire = previousScreenId === 'questionnaireScreen';
             if (justFinishedQuestionnaire && personaSummaryView && personaDetailedView && showSummaryViewBtn && showDetailedViewBtn) {
                 personaSummaryView.classList.remove('hidden');
                 personaSummaryView.classList.add('current');
                 personaDetailedView.classList.add('hidden');
                 personaDetailedView.classList.remove('current');
                 showSummaryViewBtn.classList.add('active');
                 showDetailedViewBtn.classList.remove('active');
                 displayPersonaSummary(); // Ensure summary content is up-to-date
             } else {
                  // Otherwise, default to detailed view if neither is explicitly current
                 if (!personaDetailedView?.classList.contains('current') && !personaSummaryView?.classList.contains('current')) {
                      personaDetailedView?.classList.remove('hidden');
                      personaDetailedView?.classList.add('current');
                      showDetailedViewBtn?.classList.add('active');
                      personaSummaryView?.classList.add('hidden');
                      personaSummaryView?.classList.remove('current');
                      showSummaryViewBtn?.classList.remove('active');
                 }
             }
             // Always update Persona screen content regardless of view mode
             GameLogic.displayPersonaScreenLogic();
        } else if (screenId === 'grimoireScreen') {
            refreshGrimoireDisplay(); // Update Grimoire content
        } else if (screenId === 'repositoryScreen') {
            displayRepositoryContent(); // Update Repository content
        }
    } else if (screenId === 'questionnaireScreen') {
         // Ensure questionnaire UI is properly displayed if navigating back during testing
         if (currentState.currentElementIndex < elementNames.length && currentState.currentElementIndex >= 0) {
             displayElementQuestions(currentState.currentElementIndex);
         }
    }

    // Scroll to top for main content screens
    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }

    // Update previous screen tracker AFTER processing
    previousScreenId = screenId;
}

// --- Onboarding UI Adjustments ---
export function applyOnboardingPhaseUI(phase) {
    console.log(`UI: Applying onboarding phase ${phase}`);
    const isPhase_Start = phase === Config.ONBOARDING_PHASE.START;
    const isPhase_Questionnaire = phase === Config.ONBOARDING_PHASE.QUESTIONNAIRE;
    const isPhase_PersonaGrimoire = phase >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const isPhase_StudyInsight = phase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    const isPhase_ReflectionRituals = phase >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS;
    const isPhase_Advanced = phase >= Config.ONBOARDING_PHASE.ADVANCED;

    // --- Navigation Bar ---
    navButtons.forEach(button => {
        if (!button) return; const target = button.dataset.target; let hide = false;
        // Hide nav entirely before questionnaire is done
        if (!isPhase_PersonaGrimoire) hide = true;
        else { // After questionnaire
             if (target === 'studyScreen' && !isPhase_PersonaGrimoire) hide = true; // Actually always visible from PersonaGrimoire phase
             if (target === 'grimoireScreen' && !isPhase_PersonaGrimoire) hide = true; // Visible from PersonaGrimoire phase
             if (target === 'repositoryScreen' && !isPhase_Advanced) hide = true; // Repo visible only in Advanced
        }
        button.classList.toggle('hidden-by-flow', hide);
    });
    // Ensure mainNavBar itself is handled correctly by showScreen

    // --- Study Screen Elements (Standard Mode) ---
    if (studyScreenStandardMode) {
        // Daily free research button only appears in standard mode, check phase
        if (freeResearchButton) freeResearchButton.classList.toggle('hidden-by-flow', !isPhase_StudyInsight);
        // Rituals Alcove visibility
        if (ritualsAlcove) ritualsAlcove.classList.toggle('hidden-by-flow', !isPhase_ReflectionRituals);
        // Seek Guidance button visibility
        if (seekGuidanceButton) seekGuidanceButton.classList.toggle('hidden-by-flow', !isPhase_ReflectionRituals);
    }
    // Note: Visibility *between* Discovery and Standard mode is handled by showScreen

    // --- Grimoire Filters ---
    if (grimoireFilterControls) grimoireFilterControls.classList.toggle('hidden-by-flow', !isPhase_StudyInsight);

    // --- Persona Screen Elements ---
    if (personaScreen) {
         // Deep Dive containers are shown early, but unlock button within is gated later
         const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container');
         deepDiveContainers?.forEach(container => {
              container.classList.toggle('hidden', !isPhase_PersonaGrimoire);
              // Refresh content if visible to update unlock button state
              if (!container.classList.contains('hidden')) {
                   const key = container.dataset.elementKey;
                   if (key) displayElementDeepDive(key, container);
              }
         });
         // Action buttons visibility
         if (exploreTapestryButton) exploreTapestryButton.classList.toggle('hidden-by-flow', !isPhase_PersonaGrimoire);
         if (suggestSceneButton) suggestSceneButton.classList.toggle('hidden-by-flow', !isPhase_PersonaGrimoire);
    }

    // --- Popup Elements --- Update based on current phase
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
        const discoveredData = State.getDiscoveredConceptData(popupConceptId);
        const concept = concepts.find(c => c.id === popupConceptId);
        // Check research notes based on the *correct* container ID depending on phase
        const researchNotesAreaId = (phase < Config.ONBOARDING_PHASE.STUDY_INSIGHT) ? 'initialResearchDiscoveries' : 'researchOutput';
        const researchNotesArea = document.querySelector(`#${researchNotesAreaId}`);
        const inResearch = !discoveredData && researchNotesArea?.querySelector(`.research-result-item[data-concept-id="${popupConceptId}"]`);

        // Update buttons within the popup
        updateFocusButtonStatus(popupConceptId); // Depends on Discovery & Phase (implicitly handles phase via `isDiscovered`)
        updateGrimoireButtonStatus(popupConceptId, !!inResearch); // Always shown, state changes
        updatePopupSellButton(popupConceptId, concept, !!discoveredData, !!inResearch); // Sell enabled in Phase STUDY_INSIGHT
        if (myNotesSection) myNotesSection.classList.toggle('hidden', !isPhase_StudyInsight || !discoveredData);
        if (popupEvolutionSection) {
            // Evolution section only visible in Advanced phase AND if concept allows it
            const showEvo = isPhase_Advanced && discoveredData && concept?.canUnlockArt && !discoveredData?.artUnlocked;
            popupEvolutionSection.classList.toggle('hidden', !showEvo);
            if (showEvo) displayEvolutionSection(concept, discoveredData); // Refresh button state if shown
         }
    }

    // --- Repository Screen --- Container visibility handled by showScreen
    if (repositoryScreen) repositoryScreen.classList.toggle('hidden-by-flow', !isPhase_Advanced);

    // Ensure button states reflect current phase capabilities
    updateTapestryDeepDiveButton();
    updateSuggestSceneButtonState();
}


// --- Insight Display ---
export function updateInsightDisplays() {
    const insight = State.getInsight().toFixed(1);
    // Update displays on Persona and potentially shared Study display
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = insight;

    const currentPhase = State.getOnboardingPhase();
    const isStudyScreenVisible = studyScreen?.classList.contains('current');

    // Update UI elements based on current phase and if study screen is active
    if (isStudyScreenVisible) {
        if (currentPhase === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) {
            // Re-render Discovery Mode to update button costs/availability/free count
            displayStudyScreen_DiscoveryMode();
        } else if (currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
            // Update Standard Study Mode elements
            displayResearchButtons(); // Handles standard research button costs/disabled state
            if (seekGuidanceButton) seekGuidanceButton.disabled = State.getInsight() < Config.GUIDED_REFLECTION_COST;
            if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
        }
    }

    // Refresh Deep Dive unlock buttons if Persona screen is visible
    if (personaScreen?.classList.contains('current')) {
        const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container');
        deepDiveContainers?.forEach(container => {
            const elementKey = container.dataset.elementKey;
            if (elementKey) {
                 displayElementDeepDive(elementKey, container); // Refresh unlock button states based on insight
            }
        });
    }

    // Refresh Repository content if visible (handles experiment/scene costs)
    if (repositoryScreen && repositoryScreen.classList.contains('current')) {
        displayRepositoryContent();
    }

    // Refresh popup evolution section if open
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
          const concept = concepts.find(c => c.id === popupConceptId);
          const discoveredData = State.getDiscoveredConceptData(popupConceptId);
          // Check phase before displaying evolution details
          if(concept && discoveredData && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED) {
              displayEvolutionSection(concept, discoveredData); // Update Evolve button state
          }
    }

    // Update other insight-dependent buttons
    updateContemplationButtonState(); // In Deep Dive Modal
    updateSuggestSceneButtonState(); // On Persona Screen
}

// --- Questionnaire UI ---
export function initializeQuestionnaireUI() {
    console.log("UI: Initializing Questionnaire UI");
    // State index is managed by GameLogic/State now
    State.updateElementIndex(0); // Ensure state index is explicitly set to 0
    updateElementProgressHeader(-1); // Show no progress initially
    displayElementQuestions(0); // Display the first element's questions

    if (mainNavBar) mainNavBar.classList.add('hidden');
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; // Hide dynamic score initially
    console.log("UI: Questionnaire UI initialized.");
}

export function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) return; elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div'); tab.classList.add('element-tab');
        const elementData = elementDetails[name] || {};
        tab.textContent = elementData.name || name; tab.title = elementData.name || name;
        // Apply classes based on active/completed state
        tab.classList.toggle('completed', index < activeIndex);
        tab.classList.toggle('active', index === activeIndex);
        elementProgressHeader.appendChild(tab);
    });
}

export function displayElementQuestions(index) {
    const actualIndex = State.getState().currentElementIndex; // Get index from state *inside*
    const displayIndex = (actualIndex >= 0 && actualIndex < elementNames.length) ? actualIndex : index;
    console.log(`UI: Displaying Qs requested index ${index}, using state index ${displayIndex}`);

    if (displayIndex >= elementNames.length) {
        // If index is out of bounds, trigger finalization (handled by GameLogic)
        console.log("UI: All elements displayed, calling finalizeQuestionnaire logic.");
        GameLogic.finalizeQuestionnaire(); // Let GameLogic handle score calc and transition
        return;
    }

    const elementName = elementNames[displayIndex];
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || [];
    if (!questionContent) { console.error("questionContent element missing!"); return; }

    // Get current answers for this element from state to pre-populate
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
             inputHTML += `<div class="slider-container">
                             <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${sliderValue}" data-question-id="${q.qId}" data-type="slider">
                             <div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div>
                             <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(sliderValue).toFixed(1)}</span></p>
                             <p class="slider-feedback" id="feedback_${q.qId}"></p>
                          </div>`;
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
    else questionContent.innerHTML += questionsHTML; // Fallback if intro fails

    // Attach Listeners (using delegation could be more efficient but direct is fine here)
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        // Remove listener first to prevent duplicates if called multiple times
        input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
        input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
    });
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.removeEventListener('change', GameLogic.handleCheckboxChange);
        checkbox.addEventListener('change', GameLogic.handleCheckboxChange);
    });

    // Initial UI Updates for this element
    questionContent.querySelectorAll('.slider.q-input').forEach(slider => {
        updateSliderFeedbackText(slider, elementName);
    });
    updateDynamicFeedback(elementName, elementAnswers); // Handles making feedback visible

    // Update Progress Header & Navigation Buttons
    updateElementProgressHeader(displayIndex);
    if (progressText) progressText.textContent = `Element ${displayIndex + 1} / ${elementNames.length}: ${elementData.name || elementName}`;
    if (prevElementButton) prevElementButton.style.visibility = (displayIndex > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (displayIndex === elementNames.length - 1) ? "View Initial Discoveries" : "Next Element"; // Update button text

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

    // Ensure element name is available
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
     // Calculate score based on provided answers
     const tempScore = GameLogic.calculateElementScore(elementName, currentAnswers);
     const scoreLabel = Utils.getScoreLabel(tempScore);

     feedbackElementSpan.textContent = elementData.name || elementName;
     feedbackScoreSpan.textContent = tempScore.toFixed(1);

     // Ensure the label span exists or create it
     let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
     if(!labelSpan && feedbackScoreSpan?.parentNode) {
         labelSpan = document.createElement('span');
         labelSpan.classList.add('score-label');
         feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling);
     }
     if (labelSpan) labelSpan.textContent = ` (${scoreLabel})`;

     feedbackScoreBar.style.width = `${tempScore * 10}%`;
     dynamicScoreFeedback.style.display = 'block'; // Make feedback visible *after* update
}

export function getQuestionnaireAnswers() {
     const answers = {};
     const inputs = questionContent?.querySelectorAll('.q-input');
     if (!inputs) return answers;

     inputs.forEach(input => {
         const qId = input.dataset.questionId;
         const type = input.dataset.type;
         if (!qId) return;

         if (type === 'slider') {
             answers[qId] = parseFloat(input.value);
         } else if (type === 'radio') {
             if (input.checked) {
                 answers[qId] = input.value;
             }
         } else if (type === 'checkbox') {
             if (!answers[qId]) { // Initialize array if it doesn't exist
                 answers[qId] = [];
             }
             if (input.checked) {
                 answers[qId].push(input.value);
             }
         }
     });
     return answers;
}


// --- Persona Screen UI ---
export function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona element details div not found!"); return; }
    console.log("UI: Displaying Persona Screen");
    personaElementDetailsDiv.innerHTML = ''; // Clear previous entries
    const scores = State.getScores();
    const currentPhase = State.getOnboardingPhase();
    const showDeepDiveContainer = currentPhase >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;

    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName];
        const score = (typeof scores[key] === 'number' && !isNaN(scores[key])) ? scores[key] : 5.0; // Default score if missing
        const scoreLabel = Utils.getScoreLabel(score);
        const elementData = elementDetails[elementName] || {};
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation not available.";
        const barWidth = score ? (score / 10) * 100 : 0;
        const color = Utils.getElementColor(elementName);
        const iconClass = Utils.getElementIcon(elementName);

        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        details.dataset.elementKey = key;
        details.style.setProperty('--element-color', color);

        // Create deep dive container structure
        const deepDiveContainer = document.createElement('div');
        deepDiveContainer.classList.add('element-deep-dive-container');
        deepDiveContainer.dataset.elementKey = key;
        // Hide container based on phase initially
        deepDiveContainer.classList.toggle('hidden', !showDeepDiveContainer);

        // Build innerHTML using template literals for clarity
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
                <!-- Placeholder for Attunement & Deep Dive -->
            </div>`;

        // Append the deep dive container to the description div
        const descriptionDiv = details.querySelector('.element-description');
        if (descriptionDiv) {
            descriptionDiv.appendChild(deepDiveContainer); // Append empty container structure
        } else {
             console.warn(`Could not find description div for ${elementName} to append deep dive.`);
        }


        personaElementDetailsDiv.appendChild(details);

        // If phase allows, populate the deep dive container
        if (showDeepDiveContainer) {
            displayElementDeepDive(key, deepDiveContainer); // Populate the container
        }
    });

    // Populate other sections
    displayElementAttunement(); // Adds attunement bars inside descriptions
    updateInsightDisplays();
    displayFocusedConceptsPersona(); // Updates focus list
    generateTapestryNarrative(); // Updates narrative paragraph
    synthesizeAndDisplayThemesPersona(); // Updates themes list
    displayPersonaSummary(); // Updates summary view content

    // Apply phase-specific UI visibility rules AFTER rendering base content
    applyOnboardingPhaseUI(currentPhase);

    // Update button states based on current game state
    updateTapestryDeepDiveButton();
    updateSuggestSceneButtonState();
}

export function displayElementAttunement() {
    if (!personaElementDetailsDiv || personaElementDetailsDiv.children.length === 0) return;
    const attunement = State.getAttunement();
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const attunementValue = attunement[key] || 0;
        const percentage = (attunementValue / Config.MAX_ATTUNEMENT) * 100;
        const color = Utils.getElementColor(elName);
        // Find the corresponding <details> element
        const targetDetails = personaElementDetailsDiv.querySelector(`.element-detail-entry[data-element-key="${key}"]`);
        if (targetDetails) {
            let descriptionDiv = targetDetails.querySelector('.element-description');
            if (descriptionDiv) {
                // Find the deep dive container within the description
                const deepDiveContainer = descriptionDiv.querySelector('.element-deep-dive-container');

                // Remove previous attunement display if it exists
                descriptionDiv.querySelector('.attunement-display')?.remove();
                descriptionDiv.querySelector('.attunement-hr')?.remove();

                // Create new elements
                const hr = document.createElement('hr');
                hr.className = 'attunement-hr'; // Assign class for potential removal
                const attunementDiv = document.createElement('div');
                attunementDiv.classList.add('attunement-display'); // Assign class
                attunementDiv.innerHTML = `
                    <div class="attunement-item">
                        <span class="attunement-name">Attunement:</span>
                        <div class="attunement-bar-container" title="Current Attunement: ${attunementValue.toFixed(1)} / ${Config.MAX_ATTUNEMENT}">
                            <div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div>
                        </div>
                         <i class="fas fa-info-circle info-icon" title="Attunement reflects your affinity and experience with this Element. It grows through related actions like Research, Reflection, and focusing on relevant Concepts. High Attunement may unlock Experiments or reduce Research costs."></i>
                    </div>`;

                // Insert before the deep dive container if it exists, otherwise append
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
    const focused = State.getFocusedConcepts();
    const totalSlots = State.getFocusSlots();
    if (focusedConceptsHeader) {
        focusedConceptsHeader.textContent = `Focused Concepts (${focused.size} / ${totalSlots})`;
        const icon = focusedConceptsHeader.querySelector('.info-icon');
        if(icon) icon.title = `The number of Concepts currently marked as Focus out of your total available slots (${totalSlots}). Slots can be increased via Milestones.`;
    }
}

export function displayFocusedConceptsPersona() {
    if (!focusedConceptsDisplay) return;
    focusedConceptsDisplay.innerHTML = ''; // Clear previous items
    updateFocusSlotsDisplay(); // Update header count

    const focused = State.getFocusedConcepts();
    const discovered = State.getDiscoveredConcepts();

    if (focused.size === 0) {
        focusedConceptsDisplay.innerHTML = `<li class="focus-placeholder">Focus Concepts from your Grimoire</li>`;
        return;
    }

    focused.forEach(conceptId => {
        const conceptData = discovered.get(conceptId);
        if (conceptData?.concept) {
            const concept = conceptData.concept;
            const item = document.createElement('div'); // Use div instead of li for grid
            item.classList.add('focus-concept-item');
            item.dataset.conceptId = concept.id;
            item.title = `View ${concept.name}`;

            // Determine icon based on primary element first, fallback to card type
            let iconClass = Utils.getCardTypeIcon(concept.cardType); // Fallback icon
            let iconColor = '#b8860b'; // Fallback color

            if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) {
                const fullElementName = elementKeyToFullName[concept.primaryElement];
                iconClass = Utils.getElementIcon(fullElementName); // Get ELEMENT icon
                iconColor = Utils.getElementColor(fullElementName); // Get ELEMENT color
            } else {
                console.warn(`Concept ${concept.name} (ID: ${concept.id}) missing valid primaryElement for focus icon.`);
                // Keep fallback icon/color
            }

            item.innerHTML = `<i class="${iconClass}" style="color: ${iconColor};"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`;

            // Add click listener to show popup
            item.addEventListener('click', () => showConceptDetailPopup(concept.id));
            focusedConceptsDisplay.appendChild(item);
        } else {
            console.warn(`Focused concept ID ${conceptId} not found in discovered concepts.`);
             const item = document.createElement('div'); // Use div for consistency
             item.classList.add('focus-concept-item', 'missing');
             item.textContent = `Error: ID ${conceptId}`;
             focusedConceptsDisplay.appendChild(item);
        }
    });
    // Ensure buttons dependent on focus state are updated
    updateSuggestSceneButtonState();
}

export function generateTapestryNarrative() {
     if (!tapestryNarrativeP) return;
     // Let GameLogic calculate the narrative based on current state
     const narrative = GameLogic.calculateTapestryNarrative();
     // Update the paragraph, using HTML for potential strong tags
     tapestryNarrativeP.innerHTML = narrative || 'Mark concepts as "Focus" to generate narrative...';
     console.log("UI: Updated Detailed View Tapestry Narrative paragraph.");
}

export function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return;
     personaThemesList.innerHTML = ''; // Clear previous list

     const themes = GameLogic.calculateFocusThemes(); // Get sorted themes {key, name, count}

     if (themes.length === 0) {
         // Provide context-dependent placeholder
         personaThemesList.innerHTML = `<li>${State.getFocusedConcepts().size > 0 ? 'Focus is currently balanced.' : 'Mark Focused Concepts...'}</li>`;
         return;
     }

     // Display only the top theme for simplicity
     const topTheme = themes[0];
     const li = document.createElement('li');

     // Customize message based on dominance
     let emphasis = "Strongly";
     if (themes.length > 1 && topTheme.count <= themes[1].count + 1) { // If close to second theme
         emphasis = "Primarily";
     } else if (topTheme.count < 3) { // If only 1 or 2 concepts contribute
         emphasis = "Leaning towards";
     }

     li.textContent = `${emphasis} focused on ${topTheme.name}`;
     // Add a visual indicator using the element color
     li.style.borderLeft = `3px solid ${Utils.getElementColor(elementKeyToFullName[topTheme.key])}`;
     li.style.paddingLeft = '8px'; // Add some padding for the border
     personaThemesList.appendChild(li);

     // Optionally, add a note if balanced despite a top theme
     if (themes.length > 1 && topTheme.count <= themes[1].count + 1) {
         const balanceLi = document.createElement('li');
         balanceLi.innerHTML = `<small>(with other influences present)</small>`;
         balanceLi.style.fontSize = '0.85em';
         balanceLi.style.color = '#666';
         balanceLi.style.paddingLeft = '20px'; // Indent slightly
         balanceLi.style.borderLeft = 'none'; // Remove main border
         personaThemesList.appendChild(balanceLi);
     }
}

export function displayPersonaSummary() {
    if (!summaryContentDiv) return;
    summaryContentDiv.innerHTML = '<p>Generating summary...</p>'; // Placeholder

    const scores = State.getScores();
    const focused = State.getFocusedConcepts();
    const narrative = GameLogic.calculateTapestryNarrative(); // Get current narrative
    const themes = GameLogic.calculateFocusThemes(); // Get current themes

    let html = '<h3>Core Essence</h3><div class="summary-section">';
    if (elementDetails && elementNameToKey && elementKeyToFullName) {
        elementNames.forEach(elName => {
            const key = elementNameToKey[elName];
            const score = scores[key];
            if (typeof score === 'number') {
                const label = Utils.getScoreLabel(score);
                const interpretation = elementDetails[elName]?.scoreInterpretations?.[label] || "N/A";
                html += `<p><strong>${elementDetails[elName]?.name || elName} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`;
            } else {
                html += `<p><strong>${elementDetails[elName]?.name || elName}:</strong> Score not available.</p>`;
            }
        });
    } else {
        html += "<p>Error: Element details not loaded.</p>";
    }
    html += '</div><hr><h3>Focused Tapestry</h3><div class="summary-section">';

    if (focused.size > 0) {
        // Use the generated narrative HTML (which includes <strong> tags)
        html += `<p><em>${narrative || "No narrative generated."}</em></p>`;
        html += '<strong>Focused Concepts:</strong><ul>';
        const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => {
            const name = discovered.get(id)?.concept?.name || `ID ${id}`;
            html += `<li>${name}</li>`;
        });
        html += '</ul>';

        if (themes.length > 0) {
             html += '<strong>Dominant Themes:</strong><ul>';
             // Display top themes (e.g., top 3)
             themes.slice(0, 3).forEach(theme => {
                 html += `<li>${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})</li>`;
             });
             html += '</ul>';
        } else {
             html += '<strong>Dominant Themes:</strong><p>No strong themes detected from current focus.</p>';
        }
    } else {
        html += '<p>No concepts are currently focused. Add concepts to your Focus in the Grimoire.</p>';
    }
    html += '</div>';
    summaryContentDiv.innerHTML = html;
}


// --- Study Screen UI ---

// NEW: Renders the initial discovery mode
export function displayStudyScreen_DiscoveryMode() {
    if (!studyScreenDiscoveryMode || !initialDiscoveryGuidance || !initialDiscoveryElements) {
        console.error("Study Discovery Mode elements missing!");
        return;
    }
    console.log("UI: Displaying Study Screen (Discovery Mode)");

    // Update Insight Display (assuming shared ID or duplicate in HTML)
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = State.getInsight().toFixed(1);

    // Set Guidance Text based on state
    const conceptsAddedCount = State.getDiscoveredConcepts().size;
    const freeResearchLeft = State.getInitialFreeResearchRemaining();
    if (initialDiscoveryGuidance) {
        if (conceptsAddedCount > 0) {
            initialDiscoveryGuidance.innerHTML = `Concept Added! Discover more (using Insight or remaining Free Research), or visit the <strong>Grimoire</strong> to view your collection.`;
        } else if (freeResearchLeft > 0) {
            initialDiscoveryGuidance.innerHTML = `Your questionnaire revealed your core affinities. Use your <strong>${freeResearchLeft} Free Research</strong> attempts on Elements you resonate with strongly to uncover Concepts you connect with.`;
        } else {
             initialDiscoveryGuidance.innerHTML = `Free research used. Spend Insight to research Elements you resonate with strongly and uncover Concepts you connect with.`;
        }
    }

    initialDiscoveryElements.innerHTML = ''; // Clear previous elements
    const scores = State.getScores();
    const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const topTwoKeys = sortedScores.slice(0, 2).map(([key]) => key);

    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName];
        const score = scores[key];
        const scoreLabel = Utils.getScoreLabel(score);
        const elementData = elementDetails[elementName] || {};
        const isTopTwo = topTwoKeys.includes(key);
        const color = Utils.getElementColor(elementName);
        const iconClass = Utils.getElementIcon(elementName);

        const elementDiv = document.createElement('div');
        elementDiv.classList.add('initial-discovery-element');
        if (isTopTwo) elementDiv.classList.add('highlight');
        elementDiv.style.borderColor = color;
        elementDiv.dataset.elementKey = key; // Store key for click handler

        let costText = "";
        let isDisabled = false;
        let clickHandler = null;
        let titleText = "";

        if (freeResearchLeft > 0) {
            costText = `Free Research (${freeResearchLeft} left)`;
            titleText = `Conduct FREE research on ${elementData.name || elementName}.`;
            clickHandler = () => GameLogic.handleResearchClick({ currentTarget: elementDiv, isFree: true });
        } else {
             const cost = Config.BASE_RESEARCH_COST; // Use base cost after free ones
             costText = `${cost} <i class="fas fa-brain insight-icon"></i>`;
             if (State.getInsight() < cost) {
                 isDisabled = true;
                 titleText = `Research ${elementData.name || elementName} (Requires ${cost} Insight)`;
             } else {
                 titleText = `Research ${elementData.name || elementName} (Cost: ${cost} Insight)`;
                 clickHandler = () => GameLogic.handleResearchClick({ currentTarget: elementDiv, isFree: false });
             }
        }

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
            </div>
        `;
        elementDiv.title = titleText; // Set tooltip

        if (!isDisabled) {
            elementDiv.classList.add('clickable');
            elementDiv.addEventListener('click', clickHandler); // Attach specific handler
        } else {
            elementDiv.classList.add('disabled');
        }

        initialDiscoveryElements.appendChild(elementDiv);
    });

    // Ensure discovery results area is visible and has placeholder if empty
    if (initialResearchDiscoveries) {
         initialResearchDiscoveries.classList.remove('hidden');
         const placeholder = initialResearchDiscoveries.querySelector('p > i');
         if (initialResearchDiscoveries.children.length === 1 && placeholder) {
              // Do nothing, placeholder exists
         } else if (initialResearchDiscoveries.children.length === 0) {
              initialResearchDiscoveries.innerHTML = '<p><i>Discoveries will appear here...</i></p>';
         }
    }
    // Ensure standard output area is hidden
    if (researchOutput) researchOutput.classList.add('hidden');
}

// RENAMED: Renders the standard study mode
export function displayStudyScreen_StandardMode() {
    if (!studyScreenStandardMode) {
        console.error("Standard Study Mode container missing!");
        return;
    }
    console.log("UI: Displaying Study Screen (Standard Mode)");
    updateInsightDisplays(); // Updates cost displays and button states for standard mode
    displayResearchButtons(); // Renders the standard grid of research buttons
    displayDailyRituals(); // Renders rituals
    applyOnboardingPhaseUI(State.getOnboardingPhase()); // Ensure visibility based on phase

    // Ensure discovery results area is hidden and standard results are visible/have placeholder
    if (initialResearchDiscoveries) initialResearchDiscoveries.classList.add('hidden');
    if (researchOutput) {
         researchOutput.classList.remove('hidden');
         const placeholder = researchOutput.querySelector('p > i');
         if (researchOutput.children.length === 1 && placeholder) {
             // Placeholder exists, do nothing
         } else if (researchOutput.children.length === 0) {
             researchOutput.innerHTML = '<p><i>Research results will appear here.</i></p>';
         }
    }
}

export function displayResearchButtons() { // For Standard Study Mode
    if (!researchButtonContainer) return;
    researchButtonContainer.innerHTML = ''; // Clear previous buttons
    const insight = State.getInsight();
    const attunement = State.getAttunement();
    const dailyFreeAvailable = State.isFreeResearchAvailable();
    const currentPhase = State.getOnboardingPhase();

    // Daily Free Research Button (only if phase allows)
    if (freeResearchButton) {
        const showFree = dailyFreeAvailable && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
        freeResearchButton.classList.toggle('hidden', !showFree);
        freeResearchButton.disabled = !dailyFreeAvailable;
        freeResearchButton.textContent = dailyFreeAvailable ? "Perform Daily Meditation (Free Research)" : "Daily Meditation Performed";
        // Show disabled button if phase is right but it's used up
        if (!dailyFreeAvailable && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
             freeResearchButton.classList.remove('hidden');
        }
    }

    // Paid Research Buttons
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const currentAtt = attunement[key] || 0;
        let currentCost = Config.BASE_RESEARCH_COST;
        // Apply potential cost reduction based on attunement (example)
        if (currentAtt > 80) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 5);
        else if (currentAtt > 50) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 3);

        const canAfford = insight >= currentCost;
        const fullName = elementDetails[elName]?.name || elName;
        const button = document.createElement('button');
        button.classList.add('button', 'research-button');
        button.dataset.elementKey = key;
        button.dataset.cost = currentCost;
        button.disabled = !canAfford;
        button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`;
        button.innerHTML = `
            <span class="research-el-icon" style="color: ${Utils.getElementColor(elName)};"><i class="${Utils.getElementIcon(fullName)}"></i></span>
            <span class="research-el-name">${fullName}</span>
            <span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span>
        `;
        // Click listener handled by delegation in main.js
        researchButtonContainer.appendChild(button);
    });

    // Update Guidance button state
    if (seekGuidanceButton) {
        seekGuidanceButton.disabled = insight < Config.GUIDED_REFLECTION_COST;
        seekGuidanceButton.classList.toggle('hidden-by-flow', currentPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS);
    }
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
}

export function displayDailyRituals() {
     if (!dailyRitualsDisplay) return;
     dailyRitualsDisplay.innerHTML = ''; // Clear previous list

     // Check if Rituals are unlocked by phase
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
         dailyRitualsDisplay.innerHTML = '<li>Unlock rituals by progressing further.</li>';
         return;
     }

     const completed = State.getState().completedRituals.daily || {};
     const focused = State.getFocusedConcepts();
     let activeRituals = [...dailyRituals]; // Start with base daily rituals

     // Add active Focus Rituals
     if (focusRituals) {
         focusRituals.forEach(ritual => {
             // Ensure requiredFocusIds exists and is an array
             if (!ritual.requiredFocusIds || !Array.isArray(ritual.requiredFocusIds) || ritual.requiredFocusIds.length === 0) return;
             const reqIds = new Set(ritual.requiredFocusIds);
             let allFocused = true;
             for (const id of reqIds) {
                 if (!focused.has(id)) {
                     allFocused = false;
                     break;
                 }
             }
             if (allFocused) {
                 activeRituals.push({ ...ritual, isFocusRitual: true }); // Mark as focus ritual
             }
         });
     }

     if (activeRituals.length === 0) {
         dailyRitualsDisplay.innerHTML = '<li>No daily rituals currently active.</li>';
         return;
     }

     activeRituals.forEach(ritual => {
         const completedData = completed[ritual.id] || { completed: false, progress: 0 };
         const isCompleted = completedData.completed;
         const li = document.createElement('li');
         li.classList.toggle('completed', isCompleted);
         if(ritual.isFocusRitual) li.classList.add('focus-ritual'); // Add class for styling

         let rewardText = '';
         if (ritual.reward) {
             if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`;
             else if (ritual.reward.type === 'attunement') {
                 const elName = ritual.reward.element === 'All' ? 'All' : (elementKeyToFullName[ritual.reward.element] || ritual.reward.element);
                 rewardText = `(+${ritual.reward.amount} ${elName} Attun.)`;
             }
             else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`;
         }
         li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`;
         dailyRitualsDisplay.appendChild(li);
     });
}

export function displayResearchStatus(message) {
    // Only relevant for standard study mode
    if (researchStatus) researchStatus.textContent = message;
}

// Modified to accept target container ID
export function displayResearchResults(results, targetContainerId = null) {
    const phase = State.getOnboardingPhase();
    // Determine default container based on phase
    const defaultContainerId = (phase === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) ? 'initialResearchDiscoveries' : 'researchOutput';
    const containerId = targetContainerId || defaultContainerId;
    const container = document.getElementById(containerId);

    if (!container) { console.error(`Research results container #${containerId} not found!`); return; }

    const { concepts: foundConcepts, repositoryItems, duplicateInsightGain } = results;

    // Clear placeholder only if results are coming in and placeholder is the only content
    if (foundConcepts.length > 0 || repositoryItems.length > 0) {
        const placeholder = container.querySelector('p > i');
        if (placeholder && container.children.length === 1) {
            container.innerHTML = '';
        }
    }

    // Display duplicate message (prepend so it's visible first)
    if (duplicateInsightGain > 0) {
        const dupeMsg = document.createElement('p');
        dupeMsg.classList.add('duplicate-message');
        dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate echoes.`;
        container.prepend(dupeMsg);
        setTimeout(() => dupeMsg.remove(), 5000);
    }

    // Display found concepts
    foundConcepts.forEach(concept => {
        // Avoid adding duplicates to the UI if function is called multiple times rapidly
        if (!container.querySelector(`.research-result-item[data-concept-id="${concept.id}"]`)) {
            const resultItemDiv = document.createElement('div');
            resultItemDiv.classList.add('research-result-item');
            resultItemDiv.dataset.conceptId = concept.id;

            // Use different context for rendering based on target container
            const cardContext = (containerId === 'initialResearchDiscoveries') ? 'discovery-note' : 'research-output';
            const cardElement = renderCard(concept, cardContext);
            if (!cardElement) return; // Skip if card render failed

            resultItemDiv.appendChild(cardElement);

            // Add Action Buttons Container
            const actionDiv = document.createElement('div');
            actionDiv.classList.add('research-actions');

            // Add to Grimoire Button (Always shown for new concepts)
            const addButton = document.createElement('button');
            addButton.textContent = "Add to Grimoire";
            addButton.classList.add('button', 'small-button', 'research-action-button', 'add-button');
            addButton.dataset.conceptId = concept.id;
            // Listener handled by delegation in main.js
            actionDiv.appendChild(addButton);

            // Sell Button (Conditional based on phase)
            if (State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
                const sellButton = document.createElement('button');
                let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
                const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
                sellButton.textContent = `Sell (${sellValue.toFixed(1)}) `;
                sellButton.innerHTML += `<i class="fas fa-brain insight-icon"></i>`;
                sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button');
                sellButton.dataset.conceptId = concept.id;
                // Determine context for sell action based on where it's displayed
                sellButton.dataset.context = (containerId === 'initialResearchDiscoveries') ? 'discovery' : 'research';
                sellButton.title = `Sell for ${sellValue.toFixed(1)} Insight.`;
                // Listener handled by delegation in main.js
                actionDiv.appendChild(sellButton);
            }

            resultItemDiv.appendChild(actionDiv);
            container.appendChild(resultItemDiv);
        }
    });

    // Display found repository items (always prepend for visibility)
    repositoryItems.forEach(item => {
         // Avoid duplicates
         if (container.querySelector(`[data-repo-id="${item.id}"]`)) return;
         const itemDiv = document.createElement('div');
         itemDiv.classList.add('repository-item-discovery');
         itemDiv.dataset.repoId = item.id;
         let iconClass = 'fa-question-circle'; let typeName = 'Item';
         if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; }
         else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; }
         // Add other types if needed (e.g., experiment)
         itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered the '${item.name}'. View it in the Repository.`}</p>`;
         container.prepend(itemDiv);
         setTimeout(() => itemDiv.remove(), 7000); // Auto-remove discovery notice
    });

    // If container is still empty after attempting to add results, show appropriate message
    if (container.children.length === 0) {
        const emptyMessage = (containerId === 'initialResearchDiscoveries') ? 'Discoveries will appear here...' : 'Familiar thoughts echo... Try researching a different element?';
        container.innerHTML = `<p><i>${emptyMessage}</i></p>`;
    }
}


// Modified to handle both potential containers
export function updateResearchButtonAfterAction(conceptId, action) {
     const containerDiscovery = document.getElementById('initialResearchDiscoveries');
     const containerStandard = document.getElementById('researchOutput');

     // Find the item in either container
     const itemDivDiscovery = containerDiscovery?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
     const itemDivStandard = containerStandard?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);

     const itemDiv = itemDivDiscovery || itemDivStandard; // The div containing the card
     const container = itemDiv === itemDivDiscovery ? containerDiscovery : containerStandard; // The container it was in

     if (!itemDiv || !container) {
         console.warn(`Could not find research item ${conceptId} to update after action '${action}'.`);
         return;
     }

     if (action === 'add' || action === 'sell') {
         itemDiv.remove(); // Remove the entire item (card + buttons)

         // Update placeholder if container becomes empty
         if (container.children.length === 0 || (container.children.length === 1 && container.querySelector('.duplicate-message'))) {
             // If only a duplicate message remains, or it's truly empty
             container.querySelector('.duplicate-message')?.remove(); // Clear potential lingering dupe message
             const emptyMessage = (container.id === 'initialResearchDiscoveries') ? 'Discoveries will appear here...' : 'Research results will appear here.';
             container.innerHTML = `<p><i>${emptyMessage}</i></p>`;

             // Optionally update status only if action was in standard mode
             if (action === 'sell' && container.id === 'researchOutput' && researchStatus) {
                  researchStatus.textContent = "Ready for new research.";
             }
         }
     }
     // Future: Handle 'update' action if needed (e.g., disable button without removing)
}

// --- Grimoire Screen UI ---
export function updateGrimoireCounter() {
    if (grimoireCountSpan) grimoireCountSpan.textContent = State.getDiscoveredConcepts().size;
}

export function populateGrimoireFilters() {
    if (grimoireTypeFilter) {
        grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>';
        cardTypeKeys.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            grimoireTypeFilter.appendChild(option);
        });
    }
    if (grimoireElementFilter) {
        grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>';
        elementNames.forEach(fullName => {
            const name = elementDetails[fullName]?.name || fullName;
            const option = document.createElement('option');
            option.value = fullName; // Use full name for value/lookup later
            option.textContent = name;
            grimoireElementFilter.appendChild(option);
        });
    }
    // Populate Rarity and Focus filters similarly if needed (HTML suggests they exist)
    if (grimoireRarityFilter && grimoireRarityFilter.options.length <= 1) { // Avoid repopulating
        // Options added directly in HTML are likely sufficient
    }
    if (grimoireFocusFilter && grimoireFocusFilter.options.length <= 1) {
       // Options added directly in HTML
    }
}

export function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All", searchTerm = "", filterFocus = "All") {
    if (!grimoireContentDiv) return;
    grimoireContentDiv.innerHTML = ''; // Clear previous content
    const discoveredMap = State.getDiscoveredConcepts();
    if (discoveredMap.size === 0) {
        grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty... Discover Concepts in the Study!</p>';
        return;
    }

    const userScores = State.getScores();
    const focusedSet = State.getFocusedConcepts();
    let discoveredArray = Array.from(discoveredMap.values());

    // Input validation for filters
    filterType = filterType || "All";
    filterElement = filterElement || "All";
    sortBy = sortBy || "discovered";
    filterRarity = filterRarity || "All";
    searchTerm = searchTerm ? searchTerm.toLowerCase().trim() : "";
    filterFocus = filterFocus || "All";

    // Filtering logic
    const conceptsToDisplay = discoveredArray.filter(data => {
        if (!data?.concept) return false;
        const concept = data.concept;

        // Type Filter
        const typeMatch = (filterType === "All") || (concept.cardType === filterType);

        // Element Filter (Handle potential missing map)
        let elementMatch = (filterElement === "All");
        if (!elementMatch && elementNameToKey && filterElement !== "All") {
            const elementKey = elementNameToKey[filterElement];
            if (elementKey) {
                elementMatch = (concept.primaryElement === elementKey);
            } else {
                console.warn(`UI: Could not find key for filterElement '${filterElement}'.`);
                elementMatch = false; // Treat as no match if key lookup fails
            }
        } else if (!elementNameToKey && filterElement !== "All") {
             console.error("UI Error: elementNameToKey map unavailable for filtering.");
             return false; // Stop filtering if map missing
        }


        // Rarity Filter
        const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);

        // Focus Filter
        const focusMatch = (filterFocus === 'All') ||
                           (filterFocus === 'Focused' && focusedSet.has(concept.id)) ||
                           (filterFocus === 'Not Focused' && !focusedSet.has(concept.id));

        // Search Term Filter (Name and Keywords)
        const searchMatch = !searchTerm ||
                           (concept.name.toLowerCase().includes(searchTerm)) ||
                           (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTerm)));

        return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch;
    });

    // Sorting logic
    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
    conceptsToDisplay.sort((a, b) => {
        if (!a.concept || !b.concept) return 0;
        const conceptA = a.concept;
        const conceptB = b.concept;

        switch (sortBy) {
            case 'name': return conceptA.name.localeCompare(conceptB.name);
            case 'type': return (cardTypeKeys.indexOf(conceptA.cardType) - cardTypeKeys.indexOf(conceptB.cardType)) || conceptA.name.localeCompare(conceptB.name);
            case 'rarity': return (rarityOrder[conceptA.rarity] || 0) - (rarityOrder[conceptB.rarity] || 0) || conceptA.name.localeCompare(conceptB.name);
            case 'resonance':
                 const distA = Utils.euclideanDistance(userScores, conceptA.elementScores);
                 const distB = Utils.euclideanDistance(userScores, conceptB.elementScores);
                 // Sort by *smaller* distance first (higher resonance)
                 return distA - distB || conceptA.name.localeCompare(conceptB.name);
            case 'discovered': // Default
            default: return (a.discoveredTime || 0) - (b.discoveredTime || 0) || conceptA.name.localeCompare(conceptB.name);
        }
    });

    // Render results
    if (conceptsToDisplay.length === 0) {
        grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters${searchTerm ? ' or search term' : ''}.</p>`;
    }
    else {
        conceptsToDisplay.forEach(data => {
            // Use context 'grimoire' for cards displayed here
            const cardElement = renderCard(data.concept, 'grimoire');
            if (cardElement) {
                // Add hover effect for related concepts (optional enhancement)
                cardElement.addEventListener('mouseover', (event) => {
                    const currentCard = event.currentTarget;
                    const conceptId = parseInt(currentCard.dataset.conceptId);
                    const conceptData = State.getDiscoveredConceptData(conceptId)?.concept;
                    if (!conceptData || !conceptData.relatedIds) return;
                    currentCard.classList.add('hover-highlight'); // Style for the card being hovered
                    const allCards = grimoireContentDiv.querySelectorAll('.concept-card');
                    allCards.forEach(card => {
                        const cardId = parseInt(card.dataset.conceptId);
                        if (conceptData.relatedIds.includes(cardId) && card !== currentCard) {
                            card.classList.add('related-highlight'); // Style for related cards
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
     // Only refresh if the grimoire screen is actually visible
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

// --- Card Rendering ---
// Modified renderCard context slightly
export function renderCard(concept, context = 'grimoire') { // Contexts: grimoire, research-output, discovery-note, no-click
    if (!concept || typeof concept.id === 'undefined') { console.warn("renderCard invalid concept:", concept); const eDiv = document.createElement('div'); eDiv.textContent="Error"; eDiv.style.color='red'; eDiv.style.padding='10px'; eDiv.style.border='1px solid red'; return eDiv; }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `View Details: ${concept.name}`;

    const discoveredData = State.getDiscoveredConceptData(concept.id);
    const isDiscovered = !!discoveredData; // Is it fully in the Grimoire?
    const isFocused = State.getFocusedConcepts().has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false;
    const currentPhase = State.getOnboardingPhase();

    // Determine button visibility based on phase and context
    const phaseAllowsFocus = isDiscovered && currentPhase >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS;
    // Sell is allowed from Grimoire context if phase is StudyInsight+
    const phaseAllowsSellFromGrimoire = isDiscovered && context === 'grimoire' && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;

    // Stamps
    const focusStampHTML = isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    // Show note stamp if it's *not* fully discovered (i.e., in research/discovery)
    const noteStampHTML = (!isDiscovered && (context === 'discovery-note' || context === 'research-output')) ? '<span class="note-stamp" title="Research Note"><i class="fa-regular fa-clipboard"></i></span>' : '';
    const cardTypeIcon = Utils.getCardTypeIcon(concept.cardType);

    // Affinities
    let affinitiesHTML = '';
    if (concept.elementScores && elementKeyToFullName) {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
            const level = Utils.getAffinityLevel(score);
            if (level && elementKeyToFullName[key]) {
                const fullName = elementKeyToFullName[key]; const color = Utils.getElementColor(fullName); const iconClass = Utils.getElementIcon(fullName); const elNameDet = elementDetails[fullName]?.name || fullName;
                affinitiesHTML += `<span class="affinity affinity-${level.toLowerCase()}" style="border-color: ${color}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="${elNameDet} Affinity: ${level} (${score.toFixed(1)})"><i class="${iconClass}" style="color: ${color};"></i></span> `;
            }
        });
    }

    // Visuals
    let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder";
    if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; }
    else if (concept.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; }
    const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;

    // Action Buttons (Only render for 'grimoire' context)
    let actionButtonsHTML = '';
    if (context === 'grimoire') {
         actionButtonsHTML = '<div class="card-actions">';
         let hasActions = false;
        if (phaseAllowsSellFromGrimoire) {
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
            const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            actionButtonsHTML += `<button class="button tiny-button secondary-button sell-button card-sell-button" data-concept-id="${concept.id}" data-context="grimoire" title="Sell (${sellValue.toFixed(1)} Insight)"><i class="fas fa-dollar-sign"></i></button>`;
            hasActions = true;
        }
        if (phaseAllowsFocus) {
            const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
            const buttonClass = isFocused ? 'marked' : '';
            const buttonIcon = isFocused ? 'fa-star' : 'fa-regular fa-star';
            const buttonTitle = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove Focus' : 'Mark as Focus');
            actionButtonsHTML += `<button class="button tiny-button card-focus-button ${buttonClass}" data-concept-id="${concept.id}" title="${buttonTitle}" ${slotsFull ? 'disabled' : ''}><i class="fas ${buttonIcon}"></i></button>`;
            hasActions = true;
        }
        actionButtonsHTML += '</div>';
        if (!hasActions) actionButtonsHTML = ''; // Remove div if no actions were added
    } // No actions directly rendered on research/discovery cards

    // Assemble Card HTML
    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${focusStampHTML}${noteStampHTML}</span>
        </div>
        <div class="card-visual">
            ${visualContent}
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
            ${actionButtonsHTML}
        </div>`;

    // Add main click listener for popup (excluding action button clicks if they exist)
    if (context !== 'no-click') {
        cardDiv.addEventListener('click', (event) => {
            if (event.target.closest('.card-actions button')) {
                 // Action button clicked, listener in main.js will handle it via delegation
                 return;
            }
            // Card body clicked, show popup
            console.log("Card body clicked, showing popup for ID:", concept.id);
            showConceptDetailPopup(concept.id);
        });
    }

    // Adjustments for non-grimoire contexts
    if (context === 'research-output' || context === 'discovery-note') {
         cardDiv.title = `Click to view details for ${concept.name} (Not yet in Grimoire)`;
         cardDiv.classList.add('research-note-card'); // Add specific class for styling if needed
    }

    return cardDiv;
}


// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    const conceptData = concepts.find(c => c.id === conceptId);
    if (!conceptData) { console.error("Concept data missing:", conceptId); return; }

    const discoveredData = State.getDiscoveredConceptData(conceptId);
    const inGrimoire = !!discoveredData;
    const currentPhase = State.getOnboardingPhase();

    // Determine correct research area based on phase
    const researchNotesAreaId = (currentPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT) ? 'initialResearchDiscoveries' : 'researchOutput';
    const researchNotesArea = document.querySelector(`#${researchNotesAreaId}`);
    const inResearchNotes = !inGrimoire && researchNotesArea?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);

    GameLogic.setCurrentPopupConcept(conceptId); // Track open popup

    // Populate basic info
    if (popupConceptName) popupConceptName.textContent = conceptData.name;
    if (popupConceptType) popupConceptType.textContent = conceptData.cardType;
    if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;
    if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No description.";

    // Populate visual
    const artUnlocked = discoveredData?.artUnlocked || false;
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = ''; // Clear previous visual
        let visualIconClass = "fas fa-question card-visual-placeholder"; let visualTitle = "Visual Placeholder";
        if (artUnlocked) { visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked"; visualTitle = "Enhanced Art Placeholder"; }
        else if (conceptData.visualHandle) { visualIconClass = "fas fa-image card-visual-placeholder"; visualTitle = "Art Placeholder"; }
        const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;
        popupVisualContainer.innerHTML = visualContent;
    }

    // Populate analysis sections
    const scores = State.getScores();
    const distance = Utils.euclideanDistance(scores, conceptData.elementScores);
    displayPopupResonance(distance);
    displayPopupRecipeComparison(conceptData, scores);
    displayPopupRelatedConcepts(conceptData);

    // Notes Section (Show only if in Grimoire and phase allows)
    const showNotes = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    if (myNotesSection && myNotesTextarea && saveMyNoteButton) {
        myNotesSection.classList.toggle('hidden', !showNotes);
        if (showNotes) {
            myNotesTextarea.value = discoveredData.notes || "";
            if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; // Clear previous save status
        }
    }

    // Evolution Section (Show only if in Grimoire, phase allows, and concept can evolve)
    const showEvolution = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED && conceptData.canUnlockArt && !artUnlocked;
    if (popupEvolutionSection) {
        popupEvolutionSection.classList.toggle('hidden', !showEvolution);
        if (showEvolution) {
            displayEvolutionSection(conceptData, discoveredData);
        }
    }

    // Update Action Buttons
    updateGrimoireButtonStatus(conceptId, !!inResearchNotes); // Handles "Add/In Grimoire" state
    updateFocusButtonStatus(conceptId); // Handles "Focus/Remove Focus" state
    updatePopupSellButton(conceptId, conceptData, inGrimoire, !!inResearchNotes); // Adds/updates Sell button

    // Show Popup
    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}

export function displayPopupResonance(distance) {
    if (!popupResonanceSummary) return;
    let resonanceLabel, resonanceClass, message;
    if (distance === Infinity || isNaN(distance)) {
        resonanceLabel = "N/A"; resonanceClass = ""; message = "(Cannot compare profiles)";
    } else if (distance < 2.5) {
        resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strongly aligns with your core profile.";
    } else if (distance < 4.0) {
        resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares significant common ground.";
    } else if (distance < 6.0) {
        resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities and differences noted.";
    } else if (distance <= Config.DISSONANCE_THRESHOLD) {
        resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence from your profile.";
    } else {
        resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significantly diverges. Reflection suggested if added.";
    }
    // Update HTML, including info icon
    popupResonanceSummary.innerHTML = `Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> <small>(Dist: ${distance.toFixed(1)})</small><br><small>${message}</small> <i class="fas fa-info-circle info-icon" title="How closely this Concept's elemental scores align with your Core Foundation scores. High resonance suggests strong alignment, Dissonant suggests significant divergence."></i>`;
}

export function displayPopupRecipeComparison(conceptData, userCompScores) {
     if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return;
     // Clear previous content
     popupConceptProfile.innerHTML = '';
     popupUserComparisonProfile.innerHTML = '';
     popupComparisonHighlights.innerHTML = '';

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

         // Display values (use '?' for invalid)
         const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?';
         const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';

         // Labels
         const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A';
         const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A';

         // Bar widths
         const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0;
         const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0;

         const color = Utils.getElementColor(fullName);
         // Shorten name if needed for display
         const elementNameShort = elementDetails[fullName]?.name.substring(0, 11) || elName;

         // Add to profile columns
         popupConceptProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${conceptDisplay}</span> <div class="score-bar-container" title="${conceptLabel}"><div style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`;
         popupUserComparisonProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${userDisplay}</span> <div class="score-bar-container" title="${userLabel}"><div style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`;

         // Generate highlights
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

     // Add default message if no highlights found
     if (!hasHighlights) highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>';
     popupComparisonHighlights.innerHTML = highlightsHTML;
}

export function displayPopupRelatedConcepts(conceptData) {
     if (!popupRelatedConcepts) return;
     popupRelatedConcepts.innerHTML = ''; // Clear previous

     if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
         const details = document.createElement('details');
         details.classList.add('related-concepts-details');

         const summary = document.createElement('summary');
         summary.innerHTML = `Synergies / Related (${conceptData.relatedIds.length}) <i class="fas fa-info-circle info-icon" title="Concepts with thematic/functional relationships. Focusing synergistic concepts may unlock content."></i>`;
         details.appendChild(summary);

         const listDiv = document.createElement('div');
         listDiv.classList.add('related-concepts-list-dropdown');
         let foundCount = 0;

         conceptData.relatedIds.forEach(relatedId => {
             // Find the related concept's data from the main concepts array
             const relatedConcept = concepts.find(c => c.id === relatedId);
             if (relatedConcept) {
                 const span = document.createElement('span');
                 span.textContent = relatedConcept.name;
                 span.classList.add('related-concept-item');
                 span.title = `Related: ${relatedConcept.name}`;
                 listDiv.appendChild(span);
                 foundCount++;
             } else {
                 console.warn(`Related concept ID ${relatedId} in ${conceptData.id} not found.`);
             }
         });

         if (foundCount > 0) {
             details.appendChild(listDiv);
             popupRelatedConcepts.appendChild(details);
         } else {
             // Handle case where IDs exist but concepts weren't found
             popupRelatedConcepts.innerHTML = `<details class="related-concepts-details"><summary>Synergies / Related <i class="fas fa-info-circle info-icon" title="..."></i></summary><p>Error: Related concepts not found.</p></details>`;
         }
     } else {
         // Handle case where concept has no related IDs specified
         popupRelatedConcepts.innerHTML = `<details class="related-concepts-details"><summary>Synergies / Related <i class="fas fa-info-circle info-icon" title="..."></i></summary><p>None specified.</p></details>`;
     }
}

export function displayEvolutionSection(conceptData, discoveredData) {
     if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return;

     const isDiscovered = !!discoveredData;
     const canUnlockArt = conceptData.canUnlockArt;
     const alreadyUnlocked = discoveredData?.artUnlocked || false;
     const isFocused = State.getFocusedConcepts().has(conceptData.id);
     const hasReflected = State.getState().seenPrompts.size > 0; // Check if *any* reflection done
     const hasEnoughInsight = State.getInsight() >= Config.ART_EVOLVE_COST;
     const currentPhase = State.getOnboardingPhase();

     // Determine if the section should be shown at all
     const showSection = isDiscovered && canUnlockArt && !alreadyUnlocked && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
     popupEvolutionSection.classList.toggle('hidden', !showSection);

     if (!showSection) {
         evolveArtButton.disabled = true; // Ensure button is disabled if section hidden
         evolveEligibility.classList.add('hidden');
         return;
     }

     // Populate section content if shown
     evolveCostSpan.textContent = `${Config.ART_EVOLVE_COST}`;

     let eligibilityText = '';
     let canEvolve = true;

     // Check individual requirements
     if (!isFocused) { eligibilityText += '<li>Requires: Mark as Focus</li>'; canEvolve = false; }
     else { eligibilityText += '<li><i class="fas fa-check"></i> Focused</li>'; }

     if (!hasReflected) { eligibilityText += '<li>Requires: Engage in Reflection</li>'; canEvolve = false; }
     else { eligibilityText += '<li><i class="fas fa-check"></i> Reflected</li>'; }

     if (!hasEnoughInsight) { eligibilityText += `<li>Requires: ${Config.ART_EVOLVE_COST} Insight</li>`; canEvolve = false;}
     else { eligibilityText += `<li><i class="fas fa-check"></i> Insight OK</li>`; }

     evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`;
     evolveEligibility.classList.remove('hidden');
     evolveArtButton.disabled = !canEvolve; // Enable/disable button based on checks
}

export function updateGrimoireButtonStatus(conceptId, inResearchNotes = false) {
    if (!addToGrimoireButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);

    // Button should be hidden if already discovered (in Grimoire)
    addToGrimoireButton.classList.toggle('hidden', isDiscovered);

    // If not hidden (i.e., not discovered), ensure it's enabled
    if (!isDiscovered) {
        addToGrimoireButton.disabled = false;
        addToGrimoireButton.textContent = "Add to Grimoire";
        addToGrimoireButton.classList.remove('added'); // Ensure 'added' class is removed
    }
}

export function updateFocusButtonStatus(conceptId) {
    if (!markAsFocusButton) return;

    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
    // Focus allowed once REFLECTION_RITUALS phase is reached
    const phaseAllowsFocus = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS;

    // Show button only if discovered AND phase allows focusing
    const showButton = isDiscovered && phaseAllowsFocus;
    markAsFocusButton.classList.toggle('hidden', !showButton);

    if (showButton) {
        markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus";
        markAsFocusButton.disabled = (slotsFull && !isFocused); // Disable only if adding and slots are full
        markAsFocusButton.classList.toggle('marked', isFocused); // Visual state for focused
        // Set tooltip based on state
        markAsFocusButton.title = markAsFocusButton.disabled && !isFocused ? `Focus slots full (${State.getFocusSlots()})` : (isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts");
    }
}

export function updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes) {
    const popupActions = conceptDetailPopup?.querySelector('.popup-actions');
    if (!popupActions || !conceptData) return;

    // Remove existing sell button first to prevent duplicates
    popupActions.querySelector('.popup-sell-button')?.remove();

    // Determine context: where is this concept located right now?
    let context = 'none';
    if (inGrimoire) {
         context = 'grimoire';
    } else if (inResearchNotes) {
         // Determine which research context based on phase
         context = (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.STUDY_INSIGHT) ? 'discovery' : 'research';
    }


    // Check if selling is allowed in the current phase
    const phaseAllowsSell = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;

    // Add sell button only if context is valid and phase allows
    if (context !== 'none' && phaseAllowsSell) {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[conceptData.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        const sourceLocation = context === 'grimoire' ? 'Grimoire' : (context === 'discovery' ? 'Discovery Notes' : 'Research Notes');

        const sellButton = document.createElement('button');
        sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button', 'popup-sell-button');
        sellButton.textContent = `Sell (${sellValue.toFixed(1)})`;
        sellButton.innerHTML += ` <i class="fas fa-brain insight-icon"></i>`;
        sellButton.dataset.conceptId = conceptId;
        sellButton.dataset.context = context; // Pass context for sell logic
        sellButton.title = `Sell from ${sourceLocation} for ${sellValue.toFixed(1)} Insight.`;
        // Listener handled by delegation in main.js

        // Append after focus button or add button if they exist and are visible
        if (markAsFocusButton && !markAsFocusButton.classList.contains('hidden')) {
            markAsFocusButton.insertAdjacentElement('afterend', sellButton);
        } else if (addToGrimoireButton && !addToGrimoireButton.classList.contains('hidden')) {
            addToGrimoireButton.insertAdjacentElement('afterend', sellButton);
        } else {
            // Fallback: append to the end of actions if neither button is visible
            popupActions.appendChild(sellButton);
        }
    }
}

// --- Reflection Modal UI ---
export function displayReflectionPrompt(promptData, context) { // Context added for clarity if needed
    if (!reflectionModal || !promptData || !promptData.prompt) {
         console.error("Reflection modal or prompt data/text missing.", promptData);
         // Handle Dissonance fallback if prompt fails
         if (context === 'Dissonance') {
             const conceptId = GameLogic.getCurrentPopupConceptId(); // Get target ID
             if (conceptId) {
                 console.warn("Reflection prompt missing for Dissonance, adding concept directly.");
                 GameLogic.addConceptToGrimoireInternal(conceptId); // Add directly
                 hidePopups(); // Close the failed reflection attempts
                 showTemporaryMessage("Reflection unavailable, concept added.", 3500);
             } else {
                 showTemporaryMessage("Error: Could not display reflection or find target concept.", 3000);
             }
         } else {
             showTemporaryMessage("Error: Could not display reflection.", 3000);
         }
         return;
    }

    const { title, category, prompt, showNudge, reward } = promptData;

    // Populate modal elements
    if (reflectionModalTitle) reflectionModalTitle.textContent = title || "Moment for Reflection";
    if (reflectionElement) reflectionElement.textContent = category || "General";
    if (reflectionPromptText) reflectionPromptText.textContent = prompt.text; // Prompt object has 'id' and 'text'
    if (reflectionCheckbox) reflectionCheckbox.checked = false; // Reset checkbox
    // Handle score nudge visibility
    if (scoreNudgeCheckbox && scoreNudgeLabel) {
        scoreNudgeCheckbox.checked = false; // Reset nudge checkbox
        scoreNudgeCheckbox.classList.toggle('hidden', !showNudge);
        scoreNudgeLabel.classList.toggle('hidden', !showNudge);
    }
    if (confirmReflectionButton) confirmReflectionButton.disabled = true; // Disable confirm button initially
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)}`; // Display reward amount

    // Show modal and overlay
    reflectionModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Integrated Element Deep Dive UI ---
export function displayElementDeepDive(elementKey, targetContainerElement) {
     // Ensure target container exists
     if (!targetContainerElement) {
         console.warn(`UI: Target container not provided for displayElementDeepDive (${elementKey})`);
         // Attempt to find it dynamically (less reliable)
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
     const currentPhase = State.getOnboardingPhase();
     const insight = State.getInsight();

     // Determine if the *Unlock* button functionality should be available based on phase
     const phaseAllowsUnlocking = currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;

     // Set initial title
     targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${elementDetails[elementName]?.name || elementName} Insights</h5>`;

     if (deepDiveData.length === 0) {
         targetContainerElement.innerHTML += '<p>No deep dive content available.</p>';
         return;
     }

     // Display unlocked levels
     let displayedContent = false;
     deepDiveData.forEach(levelData => {
         if (levelData.level <= currentLevel) {
             targetContainerElement.innerHTML += `
                 <div class="library-level">
                     <h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5>
                     <div class="level-content">${levelData.content}</div>
                 </div>
                 <hr class="popup-hr">`; // Use popup-hr for consistency
             displayedContent = true;
         }
     });

     // Add placeholder text if no levels unlocked yet
     if (!displayedContent && currentLevel === 0) {
         targetContainerElement.innerHTML += '<p><i>Unlock the first level to begin exploring.</i></p>';
     } else if (!displayedContent && currentLevel > 0) {
         // This case suggests an error in data or state
          targetContainerElement.innerHTML += '<p><i>Error displaying unlocked content.</i></p>';
     }

     // Determine next level and display unlock section if applicable
     const nextLevel = currentLevel + 1;
     const nextLevelData = deepDiveData.find(l => l.level === nextLevel);

     if (nextLevelData) {
         const cost = nextLevelData.insightCost || 0;
         const canAfford = insight >= cost;

         // Show unlock section regardless of phase, but disable button if phase not met
         targetContainerElement.innerHTML += `
             <div class="library-unlock">
                 <h5>Next: ${nextLevelData.title} (Level ${nextLevelData.level})</h5>
                 <button class="button small-button unlock-button"
                         data-element-key="${elementKey}"
                         data-level="${nextLevelData.level}"
                         ${!canAfford || !phaseAllowsUnlocking ? 'disabled' : ''}
                         title="${!phaseAllowsUnlocking ? 'Unlock later in progression' : !canAfford ? `Requires ${cost} Insight` : `Unlock for ${cost} Insight`}">
                     Unlock (${cost} <i class="fas fa-brain insight-icon"></i>)
                 </button>
                 ${!canAfford && phaseAllowsUnlocking ? `<p class='unlock-error'>Insufficient Insight (${insight.toFixed(1)}/${cost})</p>` : ''}
                 ${!phaseAllowsUnlocking ? `<p class='unlock-error'>Unlock in later phase</p>` : ''}
             </div>`;
     } else if (displayedContent) {
         // All levels unlocked
         targetContainerElement.innerHTML += '<p class="all-unlocked-message"><i>All insights unlocked for this element.</i></p>';
     }
}


// --- Repository UI ---
export function displayRepositoryContent() {
     const currentPhase = State.getOnboardingPhase();
     const showRepository = currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;

     // Toggle visibility of the entire screen based on phase
     if (repositoryScreen) repositoryScreen.classList.toggle('hidden-by-flow', !showRepository);
     if (!showRepository) return; // Don't proceed if hidden

     // Ensure containers exist before proceeding
     if (!repositoryFocusUnlocksDiv || !repositoryScenesDiv || !repositoryExperimentsDiv || !repositoryInsightsDiv) {
         console.error("Repository list containers missing!");
         return;
     }
     console.log("UI: Displaying Repository Content");

     // Clear previous content
     repositoryFocusUnlocksDiv.innerHTML = '';
     repositoryScenesDiv.innerHTML = '';
     repositoryExperimentsDiv.innerHTML = '';
     repositoryInsightsDiv.innerHTML = '';

     const repoItems = State.getRepositoryItems();
     const unlockedFocusData = State.getUnlockedFocusItems();
     const attunement = State.getAttunement();
     const focused = State.getFocusedConcepts();
     const insight = State.getInsight();

     // Display Focus-Driven Unlocks
     if (unlockedFocusData.size > 0) {
         unlockedFocusData.forEach(unlockId => {
             const unlockData = focusDrivenUnlocks.find(u => u.id === unlockId);
             if (unlockData?.unlocks) {
                 const item = unlockData.unlocks;
                 const div = document.createElement('div');
                 div.classList.add('repository-item', 'focus-unlock-item');
                 let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`;
                 if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`;

                 // Add specific details based on type if needed
                 if (item.type === 'insightFragment') {
                     const iData = elementalInsights.find(i => i.id === item.id);
                     itemHTML += `<p><em>"${iData?.text || item.text || "..."}"</em></p>`;
                 } else {
                      itemHTML += `<p>Details below.</p>`; // If Scene or Experiment
                 }
                 div.innerHTML = itemHTML;
                 repositoryFocusUnlocksDiv.appendChild(div);
             }
         });
     } else {
         repositoryFocusUnlocksDiv.innerHTML = '<p>Focus synergistic Concepts on the Persona screen to unlock items.</p>';
     }

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
     } else {
         repositoryScenesDiv.innerHTML = '<p>No Scene Blueprints discovered. Try using "Suggest Scenes" on the Persona screen.</p>';
     }

     // Display Alchemical Experiments
     let experimentsDisplayed = 0;
     alchemicalExperiments.forEach(exp => {
         // Check if unlocked by attunement
         const isUnlockedByAttunement = attunement[exp.requiredElement] >= exp.requiredAttunement;
         const alreadyCompleted = repoItems.experiments.has(exp.id);

         if (isUnlockedByAttunement) {
             let canAttempt = true;
             let unmetReqs = [];

             // Check focus concept requirements
             if (exp.requiredFocusConceptIds) {
                 for (const reqId of exp.requiredFocusConceptIds) {
                     if (!focused.has(reqId)) {
                         canAttempt = false;
                         const c = concepts.find(c=>c.id === reqId);
                         unmetReqs.push(c ? c.name : `ID ${reqId}`);
                     }
                 }
             }
             // Check focus concept type requirements
             if (exp.requiredFocusConceptTypes) {
                 for (const typeReq of exp.requiredFocusConceptTypes) {
                     let met = false;
                     const dMap = State.getDiscoveredConcepts();
                     for (const fId of focused) {
                         const c = dMap.get(fId)?.concept;
                         if (c?.cardType === typeReq) { met = true; break; }
                     }
                     if (!met) {
                         canAttempt = false;
                         unmetReqs.push(`Type: ${typeReq}`);
                     }
                 }
             }
             // Check insight cost
             const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST;
             const canAfford = insight >= cost;
             if (!canAfford) {
                  unmetReqs.push("Insight"); // Specific flag for insight requirement
             }

             // Render the item with its current status
             repositoryExperimentsDiv.appendChild(renderRepositoryItem(exp, 'experiment', cost, canAfford && canAttempt && !alreadyCompleted, alreadyCompleted, unmetReqs));
             experimentsDisplayed++;
         }
     });
     if (experimentsDisplayed === 0) {
         repositoryExperimentsDiv.innerHTML = '<p>Increase Element Attunement to unlock Experiments.</p>';
     }

     // Display Elemental Insights
     if (repoItems.insights.size > 0) {
         const insightsByElement = {};
         elementNames.forEach(elName => insightsByElement[elementNameToKey[elName]] = []); // Initialize keys

         repoItems.insights.forEach(insightId => {
             const insight = elementalInsights.find(i => i.id === insightId);
             if (insight) {
                 if (!insightsByElement[insight.element]) insightsByElement[insight.element] = []; // Ensure sub-array exists
                 insightsByElement[insight.element].push(insight);
             } else { console.warn(`Insight ID ${insightId} not found.`); }
         });

         let insightsHTML = '';
         // Iterate through elements in defined order for consistency
         elementNames.forEach(elName => {
             const key = elementNameToKey[elName];
             if (insightsByElement[key] && insightsByElement[key].length > 0) {
                 insightsHTML += `<h5>${elementDetails[elName]?.name || elName} Insights:</h5><ul>`;
                 insightsByElement[key].sort((a, b) => a.id.localeCompare(b.id)).forEach(insight => {
                     insightsHTML += `<li>"${insight.text}"</li>`;
                 });
                 insightsHTML += `</ul>`;
             }
         });

         repositoryInsightsDiv.innerHTML = insightsHTML || '<p>No Elemental Insights collected.</p>'; // Fallback if loop produces nothing
     } else {
         repositoryInsightsDiv.innerHTML = '<p>No Elemental Insights collected. Found occasionally during Research.</p>';
     }

     // Display Milestones (always display)
     displayMilestones();

     // Optional: Trigger milestone check related to repository content
     GameLogic.updateMilestoneProgress('repositoryContents', null);
 }

export function renderRepositoryItem(item, type, cost, canAfford, completed = false, unmetReqs = []) {
     const div = document.createElement('div');
     div.classList.add('repository-item', `repo-item-${type}`);
     if (completed) div.classList.add('completed');

     let actionsHTML = '';
     let buttonDisabled = false;
     let buttonTitle = '';
     let buttonText = '';

     if (type === 'scene') {
          buttonDisabled = !canAfford;
          buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`;
          if (buttonDisabled) buttonTitle = `Requires ${cost} Insight`;
          else buttonTitle = `Meditate on ${item.name}`;
          // Add data attribute for event delegation
          actionsHTML = `<button class="button small-button" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
     } else if (type === 'experiment') {
          // Determine disabled state based on multiple factors
          buttonDisabled = completed || !canAfford || unmetReqs.length > 0;
          buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`;

          // Determine tooltip based on reason for being disabled or success
          if (completed) {
               buttonTitle = "Experiment Completed";
          } else if (unmetReqs.length > 0 && unmetReqs.includes("Insight")) {
               buttonTitle = `Requires ${cost} Insight`; // Prioritize insight message
          } else if (unmetReqs.length > 0) {
               buttonTitle = `Requires Focus: ${unmetReqs.join(', ')}`;
          } else if (!canAfford) { // Should be caught by unmetReqs["Insight"] but added as fallback
               buttonTitle = `Requires ${cost} Insight`;
          } else {
               buttonTitle = `Attempt ${item.name}`;
          }

          // Add data attribute for event delegation
          actionsHTML = `<button class="button small-button" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;

          // Add status text after the button
          if (completed) {
               actionsHTML += ` <span class="completed-text">(Completed)</span>`;
          } else if (unmetReqs.length > 0 && unmetReqs.includes("Insight")) {
               actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`;
          } else if (unmetReqs.length > 0) {
               actionsHTML += ` <small class="req-missing">(Requires Focus: ${unmetReqs.join(', ')})</small>`;
          } else if (!canAfford) { // Redundant check, but safe
               actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`;
          }
     }

     // Assemble the item HTML
     div.innerHTML = `
          <h4>${item.name} ${type === 'experiment' ? `(Req: ${item.requiredAttunement} ${elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4>
          <p>${item.description}</p>
          <div class="repo-actions">${actionsHTML}</div>`;
     return div;
 }

// --- Milestones UI ---
export function displayMilestones() {
    if (!milestonesDisplay) return;
    milestonesDisplay.innerHTML = ''; // Clear previous list
    const achieved = State.getState().achievedMilestones;

    if (achieved.size === 0) {
        milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>';
        return;
    }

    // Sort achieved milestones based on the order defined in the data.js milestones array
    const sortedAchievedIds = milestones
        .filter(m => achieved.has(m.id))
        .map(m => m.id); // Get IDs in predefined order

    sortedAchievedIds.forEach(milestoneId => {
        const milestone = milestones.find(m => m.id === milestoneId);
        if (milestone) {
            const li = document.createElement('li');
            li.textContent = `✓ ${milestone.description}`;
            milestonesDisplay.appendChild(li);
        }
    });
}

// --- Settings Popup UI ---
export function showSettings() {
    if (settingsPopup) settingsPopup.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Tapestry Deep Dive UI ---
export function displayTapestryDeepDive(analysisData) {
    if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveNarrativeP || !deepDiveFocusIcons || !deepDiveAnalysisNodes || !deepDiveDetailContent) {
        console.error("Deep Dive Modal elements missing!");
        showTemporaryMessage("Error opening Deep Dive.", 3000);
        return;
    }
    console.log("UI: displayTapestryDeepDive called with analysis:", analysisData);

    // Display narrative
    deepDiveNarrativeP.innerHTML = analysisData.fullNarrativeHTML || "Could not generate narrative.";

    // Display focus icons
    deepDiveFocusIcons.innerHTML = ''; // Clear previous icons
    const focused = State.getFocusedConcepts();
    const discovered = State.getDiscoveredConcepts();
    focused.forEach(id => {
        const concept = discovered.get(id)?.concept;
        if (concept) {
            let iconClass = Utils.getElementIcon("Default"); // Fallback
            let iconColor = '#CCCCCC'; // Fallback color
            let iconTitle = concept.name;

            if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) {
                const fullElementName = elementKeyToFullName[concept.primaryElement];
                iconClass = Utils.getElementIcon(fullElementName); // Get ELEMENT icon
                iconColor = Utils.getElementColor(fullElementName); // Get ELEMENT color
                iconTitle = `${concept.name} (${elementDetails[fullElementName]?.name || fullElementName})`;
            } else {
                console.warn(`Concept ${concept.name} missing valid primaryElement for deep dive icon.`);
                iconClass = Utils.getCardTypeIcon(concept.cardType); // Fallback to type icon
            }

            const icon = document.createElement('i');
            icon.className = `${iconClass}`;
            icon.style.color = iconColor;
            icon.title = iconTitle;
            deepDiveFocusIcons.appendChild(icon);
        }
    });

    // Reset detail content and node selection
    if (deepDiveDetailContent) {
        deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>';
    }
    deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active'));

    // Update contemplation button state (cost/cooldown)
    updateContemplationButtonState();

    // Show modal
    tapestryDeepDiveModal.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');
}

export function updateContemplationButtonState() {
    if (!contemplationNodeButton) return;
    const cooldownEnd = State.getContemplationCooldownEnd();
    const now = Date.now();
    const insight = State.getInsight();
    const cost = Config.CONTEMPLATION_COST;

    let disabled = false;
    let title = `Contemplate your focus (${cost} Insight)`;
    let text = `Contemplate (${cost} <i class="fas fa-brain insight-icon"></i>)`;

    if (cooldownEnd && now < cooldownEnd) {
        const remaining = Math.ceil((cooldownEnd - now) / 1000);
        disabled = true;
        title = `Contemplation available in ${remaining}s`;
        text = `On Cooldown (${remaining}s)`;
    } else if (insight < cost) {
        disabled = true;
        title = `Requires ${cost} Insight`;
    }

    contemplationNodeButton.disabled = disabled;
    contemplationNodeButton.title = title;
    contemplationNodeButton.innerHTML = text;
}

export function updateDeepDiveContent(htmlContent, nodeId) {
    if (!deepDiveDetailContent) return;
    console.log(`UI: Updating deep dive content for node: ${nodeId}`);
    deepDiveDetailContent.innerHTML = htmlContent;
    // Highlight the active node
    deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nodeId === nodeId);
    });
}

export function displayContemplationTask(task) {
    if (!deepDiveDetailContent || !task) return;
    console.log("UI: Displaying contemplation task:", task);
    let html = `<h4>Contemplation Task</h4><p>${task.text}</p>`; // Use provided text

    // Add completion button only if required
    if (task.requiresCompletionButton) {
        const rewardText = task.reward.type === 'insight' ? `<i class="fas fa-brain insight-icon"></i>` : 'Attun.';
        html += `<button id="completeContemplationBtn" class="button small-button">Mark Complete (+${task.reward.amount} ${rewardText})</button>`;
    }

    deepDiveDetailContent.innerHTML = html;

    // Add listener to the completion button if it exists
    const completeBtn = document.getElementById('completeContemplationBtn');
    if (completeBtn) {
         // Use { once: true } to auto-remove listener after one click
         completeBtn.addEventListener('click', () => {
             GameLogic.handleCompleteContemplation(task);
         }, { once: true });
    }

    // Highlight the contemplation node
    deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => {
        btn.classList.toggle('active', btn.id === 'contemplationNode');
    });
}

export function clearContemplationTask() {
     // Show brief confirmation message, then revert to default
     if (deepDiveDetailContent) {
         deepDiveDetailContent.innerHTML = '<p>Contemplation acknowledged.</p>';
         setTimeout(() => {
             // Check if content hasn't been replaced by another node click
             if (deepDiveDetailContent && deepDiveDetailContent.innerHTML === '<p>Contemplation acknowledged.</p>') {
                 deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>';
                 // Deactivate contemplation node button visually
                 deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => {
                      btn.classList.remove('active');
                 });
             }
         }, 1500); // Show message for 1.5 seconds
     }
     // Update cooldown display on the button
     updateContemplationButtonState();
}

export function updateTapestryDeepDiveButton() {
    const btn = document.getElementById('exploreTapestryButton');
    if (btn) {
        // Requires Persona/Grimoire phase AND at least one focused concept
        const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
        const hasFocus = State.getFocusedConcepts().size > 0;
        // Toggle visibility based on phase
        btn.classList.toggle('hidden-by-flow', !isPhaseReady);
        // Enable/disable based on phase AND focus
        btn.disabled = !isPhaseReady || !hasFocus;
        // Update tooltip
        btn.title = !isPhaseReady ? "Unlock later..." : (!hasFocus ? "Focus on concepts first..." : "Explore a deeper analysis of your focused tapestry.");
    } else { console.warn("UI: updateTapestryDeepDiveButton - Button not found!"); }
}

// --- Suggest Scene Button UI ---
export function updateSuggestSceneButtonState() {
    if (!suggestSceneButton) return;

    const hasFocus = State.getFocusedConcepts().size > 0;
    const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST;
    const isPhaseReady = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE; // Suggestion available early

    // Toggle visibility based on phase
    suggestSceneButton.classList.toggle('hidden-by-flow', !isPhaseReady);

    if (isPhaseReady) {
        suggestSceneButton.disabled = !hasFocus || !canAfford;
        // Update tooltip based on why it might be disabled
        if (!hasFocus) { suggestSceneButton.title = "Focus on concepts first"; }
        else if (!canAfford) { suggestSceneButton.title = `Requires ${Config.SCENE_SUGGESTION_COST} Insight`; }
        else { suggestSceneButton.title = `Suggest resonant scenes (${Config.SCENE_SUGGESTION_COST} Insight)`; }
    } else {
        suggestSceneButton.disabled = true;
        suggestSceneButton.title = "Unlock later";
    }

    // Update the cost display span
    if(sceneSuggestCostDisplay) sceneSuggestCostDisplay.textContent = Config.SCENE_SUGGESTION_COST;
}

// --- Initial UI Setup Helper ---
export function setupInitialUI() {
    console.log("UI: Setting up initial UI state...");
    applyOnboardingPhaseUI(Config.ONBOARDING_PHASE.START); // Apply base phase visibility
    if(mainNavBar) mainNavBar.classList.add('hidden'); // Hide nav bar initially
    showScreen('welcomeScreen'); // Show welcome screen by default

    // Show load button ONLY if save data exists
    const loadBtn = document.getElementById('loadButton');
    if (loadBtn) {
        loadBtn.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY));
    } else {
        console.warn("Load button element not found during initial setup.");
    }
    // Initial state update for buttons sensitive to state
    updateSuggestSceneButtonState();
    updateTapestryDeepDiveButton();
}

console.log("ui.js loaded.");
