// --- START OF FILE ui.js ---

// js/ui.js - User Interface Logic (Enhanced v4.10 + Progress Bar/Accordion)

import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js';
import {
    elementDetails, elementKeyToFullName,
    concepts, questionnaireGuided,
    reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals,
    sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks,
    cardTypeKeys, elementNames, // Includes RoleFocus ("Attraction", etc.)
    grimoireShelves, elementalDilemmas, onboardingTasks
} from '../data.js';

console.log("ui.js loading... (Enhanced v4.10 + Progress Bar/Accordion)");

// --- Helper Function for Image Errors ---
// Made globally accessible for inline onerror handlers
function handleImageError(imgElement) {
    console.warn(`Image failed to load: ${imgElement?.src}. Displaying placeholder.`);
    if (imgElement) {
        imgElement.style.display = 'none'; // Hide broken img
        const placeholder = imgElement.parentElement?.querySelector('.card-visual-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex'; // Ensure placeholder is visible (flex for centering icon)
            placeholder.title = `Art Placeholder (Load Failed: ${imgElement.src?.split('/')?.pop() || 'unknown'})`;
        }
    }
}
window.handleImageError = handleImageError;


// --- DOM Element References ---
const getElement = (id) => document.getElementById(id);

// General UI
const saveIndicator = getElement('saveIndicator');
const screens = document.querySelectorAll('.screen');
const mainNavBar = getElement('mainNavBar');
const settingsButton = getElement('settingsButton');
const popupOverlay = getElement('popupOverlay');
const milestoneAlert = getElement('milestoneAlert');
const milestoneAlertText = getElement('milestoneAlertText');
const toastElement = getElement('toastNotification');
const toastMessageElement = getElement('toastMessage');
const grimoireCountSpan = getElement('grimoireCount');

// Welcome Screen
const welcomeScreen = getElement('welcomeScreen');
const loadButton = getElement('loadButton');
const startGuidedButton = getElement('startGuidedButton');

// Questionnaire Screen
const questionnaireScreen = getElement('questionnaireScreen');
const elementProgressHeader = getElement('elementProgressHeader');
const questionContent = getElement('questionContent');
const progressText = getElement('progressText');
const dynamicScoreFeedback = getElement('dynamicScoreFeedback');
const feedbackElementSpan = getElement('feedbackElement');
const feedbackScoreSpan = getElement('feedbackScore');
const feedbackScoreBar = getElement('feedbackScoreBar');
const prevElementButton = getElement('prevElementButton');
const nextElementButton = getElement('nextElementButton');

// Persona Screen
const personaScreen = getElement('personaScreen');
const personaDetailedView = getElement('personaDetailedView');
const personaSummaryView = getElement('personaSummaryView');
const showDetailedViewBtn = getElement('showDetailedViewBtn');
const showSummaryViewBtn = getElement('showSummaryViewBtn');
const personaElementDetailsDiv = getElement('personaElementDetails');
const userInsightDisplayPersona = getElement('userInsightDisplayPersona');
const insightLogContainer = getElement('insightLogContainer');
const focusedConceptsDisplay = getElement('focusedConceptsDisplay');
const focusedConceptsHeader = getElement('focusedConceptsHeader');
const tapestryNarrativeP = getElement('tapestryNarrative');
const personaThemesList = getElement('personaThemesList');
const summaryContentDiv = getElement('summaryContent');
const summaryCoreEssenceTextDiv = getElement('summaryCoreEssenceText');
const summaryTapestryInfoDiv = getElement('summaryTapestryInfo');
const personaScoreChartCanvas = getElement('personaScoreChartCanvas');
const addInsightButton = getElement('addInsightButton');
const elementalDilemmaButton = getElement('elementalDilemmaButton');
const exploreSynergyButton = getElement('exploreSynergyButton');
const suggestSceneButton = getElement('suggestSceneButton');
const sceneSuggestCostDisplay = getElement('sceneSuggestCostDisplay');
const deepDiveTriggerButton = getElement('deepDiveTriggerButton');
const sceneSuggestionOutput = getElement('sceneSuggestionOutput');
const suggestedSceneContent = getElement('suggestedSceneContent');

// Workshop Screen
const workshopScreen = getElement('workshopScreen');
const userInsightDisplayWorkshop = getElement('userInsightDisplayWorkshop');
const researchArea = getElement('workshop-research-area');
const elementResearchButtonsContainer = getElement('element-research-buttons');
const dailyActionsContainer = getElement('daily-actions');
const freeResearchButtonWorkshop = getElement('freeResearchButtonWorkshop');
const seekGuidanceButtonWorkshop = getElement('seekGuidanceButtonWorkshop');
const guidedReflectionCostDisplayWorkshop = getElement('guidedReflectionCostDisplayWorkshop');
const grimoireLibraryContainer = getElement('workshop-library-area');
const grimoireControlsWorkshop = getElement('grimoire-controls-workshop');
const grimoireFilterControls = grimoireControlsWorkshop?.querySelector('.filter-controls'); // Assuming it's nested
const grimoireTypeFilterWorkshop = getElement('grimoireTypeFilterWorkshop');
const grimoireElementFilterWorkshop = getElement('grimoireElementFilterWorkshop');
const grimoireRarityFilterWorkshop = getElement('grimoireRarityFilterWorkshop');
const grimoireSortOrderWorkshop = getElement('grimoireSortOrderWorkshop');
const grimoireSearchInputWorkshop = getElement('grimoireSearchInputWorkshop');
const grimoireFocusFilterWorkshop = getElement('grimoireFocusFilterWorkshop');
const grimoireShelvesWorkshop = getElement('grimoire-shelves-workshop');
const grimoireGridWorkshop = getElement('grimoire-grid-workshop');

// Repository Screen
const repositoryScreen = getElement('repositoryScreen');
const repositoryFocusUnlocksDiv = getElement('repositoryFocusUnlocks')?.querySelector('.repo-list');
const repositoryScenesDiv = getElement('repositoryScenes')?.querySelector('.repo-list');
const repositoryExperimentsDiv = getElement('repositoryExperiments')?.querySelector('.repo-list');
const repositoryInsightsDiv = getElement('repositoryInsights')?.querySelector('.repo-list');
const milestonesDisplay = getElement('milestonesDisplay');
const dailyRitualsDisplayRepo = getElement('dailyRitualsDisplayRepo');

// Concept Detail Popup
const conceptDetailPopup = getElement('conceptDetailPopup');
const popupCardTypeIcon = getElement('popupCardTypeIcon');
const popupConceptName = getElement('popupConceptName');
const popupConceptType = getElement('popupConceptType');
const popupVisualContainer = getElement('popupVisualContainer');
const popupBriefDescription = getElement('popupBriefDescription');
const popupDetailedDescription = getElement('popupDetailedDescription');
const popupResonanceGaugeContainer = getElement('popupResonanceGaugeContainer');
const popupResonanceGaugeBar = getElement('popupResonanceGaugeBar');
const popupResonanceGaugeLabel = getElement('popupResonanceGaugeLabel');
const popupResonanceGaugeText = getElement('popupResonanceGaugeText');
const popupRelatedConceptsTags = getElement('popupRelatedConceptsTags');
const popupLoreSection = getElement('popupLoreSection');
const popupLoreContent = getElement('popupLoreContent');
const popupRecipeDetailsSection = getElement('popupRecipeDetails');
const popupComparisonHighlights = getElement('popupComparisonHighlights');
const popupConceptProfile = getElement('popupConceptProfile');
const popupUserComparisonProfile = getElement('popupUserComparisonProfile');
const myNotesSection = getElement('myNotesSection');
const myNotesTextarea = getElement('myNotesTextarea');
const saveMyNoteButton = getElement('saveMyNoteButton');
const noteSaveStatusSpan = getElement('noteSaveStatus');
const addToGrimoireButton = getElement('addToGrimoireButton');
const markAsFocusButton = getElement('markAsFocusButton');

// Research Results Popup
const researchResultsPopup = getElement('researchResultsPopup');
const researchPopupContent = getElement('researchPopupContent');
const closeResearchResultsPopupButton = getElement('closeResearchResultsPopupButton');
const researchPopupStatus = getElement('researchPopupStatus');
const confirmResearchChoicesButton = getElement('confirmResearchChoicesButton');

// Reflection Modal
const reflectionModal = getElement('reflectionModal');
const reflectionModalTitle = getElement('reflectionModalTitle');
const closeReflectionModalButton = getElement('closeReflectionModalButton');
const reflectionElement = getElement('reflectionElement');
const reflectionPromptText = getElement('reflectionPromptText');
const reflectionCheckbox = getElement('reflectionCheckbox');
const scoreNudgeCheckbox = getElement('scoreNudgeCheckbox');
const scoreNudgeLabel = getElement('scoreNudgeLabel');
const confirmReflectionButton = getElement('confirmReflectionButton');
const reflectionRewardAmount = getElement('reflectionRewardAmount');

// Settings Popup
const settingsPopup = getElement('settingsPopup');
const closeSettingsPopupButton = getElement('closeSettingsPopupButton');
const forceSaveButton = getElement('forceSaveButton');
const resetAppButton = getElement('resetAppButton');

// Tapestry Deep Dive Modal
const tapestryDeepDiveModal = getElement('tapestryDeepDiveModal');
const deepDiveTitle = getElement('deepDiveTitle');
const closeDeepDiveButton = getElement('closeDeepDiveButton');
const deepDiveNarrativeP = getElement('deepDiveNarrativeP');
const deepDiveFocusIcons = getElement('deepDiveFocusIcons');
const deepDiveAnalysisNodesContainer = getElement('deepDiveAnalysisNodes');
const deepDiveDetailContent = getElement('deepDiveDetailContent');
const contemplationNodeButton = getElement('contemplationNode');

// Dilemma Modal
const dilemmaModal = getElement('dilemmaModal');
const closeDilemmaModalButton = getElement('closeDilemmaModalButton');
const dilemmaSituationText = getElement('dilemmaSituationText');
const dilemmaQuestionText = getElement('dilemmaQuestionText');
const dilemmaSlider = getElement('dilemmaSlider');
const dilemmaSliderMinLabel = getElement('dilemmaSliderMinLabel');
const dilemmaSliderMaxLabel = getElement('dilemmaSliderMaxLabel');
const dilemmaSliderValueDisplay = getElement('dilemmaSliderValueDisplay');
const dilemmaNudgeCheckbox = getElement('dilemmaNudgeCheckbox');
const confirmDilemmaButton = getElement('confirmDilemmaButton');

// Info Popup
const infoPopupElement = getElement('infoPopup');
const infoPopupContent = getElement('infoPopupContent');
const closeInfoPopupButton = getElement('closeInfoPopupButton');
const confirmInfoPopupButton = getElement('confirmInfoPopupButton');

// Onboarding Elements
const onboardingOverlay = getElement('onboardingOverlay');
const onboardingPopup = getElement('onboardingPopup');
const onboardingContent = getElement('onboardingContent');
const onboardingProgressSpan = getElement('onboardingProgress');
const onboardingPrevButton = getElement('onboardingPrevButton');
const onboardingNextButton = getElement('onboardingNextButton');
const onboardingSkipButton = getElement('onboardingSkipButton');
const onboardingHighlight = getElement('onboardingHighlight');

// --- Module-level Variables ---
let personaChartInstance = null; // To store the Chart.js instance
let toastTimeout = null; // For clearing toast timeouts
let milestoneTimeout = null; // For clearing milestone timeouts
let insightBoostTimeoutId = null; // For insight boost cooldown timer
let previousScreenId = 'welcomeScreen'; // Track previously active screen

// --- Utility UI Functions ---

/** Displays a short notification message (toast). */
export function showTemporaryMessage(message, duration = Config.TOAST_DURATION, isGuidance = false) {
    if (!toastElement || !toastMessageElement) { console.warn("Toast elements missing:", message); return; }
    console.info(`Toast: ${message}`); // Log message for debugging
    toastMessageElement.textContent = message;
    toastElement.classList.toggle('guidance-toast', isGuidance); // Optional different style

    // Clear previous timeout and reset classes for animation replay
    if (toastTimeout) clearTimeout(toastTimeout);
    toastElement.classList.remove('hidden', 'visible'); // Remove classes
    void toastElement.offsetWidth; // Trigger reflow to restart animation

    // Show the toast
    toastElement.classList.add('visible');
    toastElement.classList.remove('hidden'); // Ensure hidden is removed

    // Set timeout to hide the toast
    toastTimeout = setTimeout(() => {
        toastElement.classList.remove('visible');
        // Add hidden back after transition ends (approx 0.5s based on typical CSS)
        setTimeout(() => {
            if (toastElement && !toastElement.classList.contains('visible')) { // Check again in case another toast triggered
                 toastElement.classList.add('hidden');
            }
        }, 500); // Adjust delay based on CSS transition duration
        toastTimeout = null;
    }, duration);
}

/** Displays a milestone achievement alert. */
export function showMilestoneAlert(text) {
    if (!milestoneAlert || !milestoneAlertText) { console.warn("Milestone alert elements missing."); return; }
    milestoneAlertText.textContent = `Milestone: ${text}`;
    milestoneAlert.classList.remove('hidden');
    if (milestoneTimeout) clearTimeout(milestoneTimeout);
    milestoneTimeout = setTimeout(hideMilestoneAlert, Config.MILESTONE_ALERT_DURATION);
}

/** Hides the milestone alert. */
export function hideMilestoneAlert() {
    if (milestoneAlert) milestoneAlert.classList.add('hidden');
    if (milestoneTimeout) { clearTimeout(milestoneTimeout); milestoneTimeout = null; }
}

/** Hides all popups and the overlay, except for pending research or active onboarding. */
export function hidePopups() {
    console.log("UI: hidePopups called");
    let researchPopupIsOpenAndPending = false;
    // Check if research popup is open and has unprocessed items
    if (researchResultsPopup && !researchResultsPopup.classList.contains('hidden')) {
        const pendingItems = researchPopupContent?.querySelectorAll('.research-result-item[data-processed="false"], .research-result-item[data-choice-made="pending_dissonance"]');
        if (pendingItems && pendingItems.length > 0) {
            researchPopupIsOpenAndPending = true;
            console.log(`UI: Keeping research results popup open (${pendingItems.length} items pending).`);
        }
    }

    // Hide all popups unless it's the research popup and it's pending
    document.querySelectorAll('.popup:not(.onboarding-popup)').forEach(popup => {
        if (!(popup.id === 'researchResultsPopup' && researchPopupIsOpenAndPending)) {
            popup.classList.add('hidden');
        }
    });

    // Check if any general popups are still visible OR if onboarding is active
    const anyGeneralPopupVisible = document.querySelector('.popup:not(.hidden):not(.onboarding-popup)');
    const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');

    // Hide the main overlay ONLY if no general popups are visible AND onboarding is NOT active
    if (!anyGeneralPopupVisible && popupOverlay && !onboardingActive) {
        popupOverlay.classList.add('hidden');
        // Clear temporary game logic state associated with popups
        if (typeof GameLogic !== 'undefined' && GameLogic.clearPopupState) {
            GameLogic.clearPopupState();
            console.log("UI: All general popups hidden, cleared popup logic state.");
        }
    } else if (anyGeneralPopupVisible) {
        console.log("UI: Some general popups remain visible, overlay kept.");
    } else if (onboardingActive) {
        console.log("UI: Onboarding is visible, main popup overlay remains hidden.");
        popupOverlay?.classList.add('hidden'); // Ensure main overlay hidden if onboarding is up
    }
}

/** Shows the generic info popup with a specific message. */
export function showInfoPopup(message) {
    if (infoPopupElement && infoPopupContent) {
        infoPopupContent.textContent = message;
        infoPopupElement.classList.remove('hidden');
        // Show the main overlay if onboarding isn't active
        const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');
        if (popupOverlay && !onboardingActive) {
            popupOverlay.classList.remove('hidden');
        }
    } else {
        console.error("Info popup elements (#infoPopup, #infoPopupContent) not found.");
        showTemporaryMessage("Error displaying information.", 2000); // Fallback
    }
}


// --- Screen Management ---

/** Shows the specified screen and hides others, updating navigation state. */
export function showScreen(screenId) {
    console.log(`UI: Attempting to show screen: ${screenId}`);
    const currentState = State.getState();
    const isPostQuestionnaire = currentState.questionnaireCompleted;

    const targetScreenElement = getElement(screenId);
    if (!targetScreenElement) {
        console.error(`UI Error: Screen element with ID '${screenId}' not found! Falling back to welcome.`);
        screens.forEach(screen => screen?.classList.add('hidden')); // Hide all
        getElement('welcomeScreen')?.classList.remove('hidden');
        getElement('welcomeScreen')?.classList.add('current');
        screenId = 'welcomeScreen'; // Update screenId to reflect fallback
    } else {
        // Hide all screens, then show the target
        screens.forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
                screen.classList.remove('current');
            }
        });
        targetScreenElement.classList.remove('hidden');
        targetScreenElement.classList.add('current');
        console.log(`UI: Screen ${screenId} activated.`);
    }

    // Update Navigation Bar visibility and button states
    if (mainNavBar) {
        const showNav = isPostQuestionnaire && screenId !== 'welcomeScreen' && screenId !== 'questionnaireScreen';
        mainNavBar.classList.toggle('hidden', !showNav);
        if (showNav) {
            // Update active state for nav buttons
            mainNavBar.querySelectorAll('.nav-button').forEach(button => {
                if (button) {
                    button.classList.toggle('active', button.dataset?.target === screenId);
                    // Show/hide Workshop/Repo buttons based on questionnaire completion
                    const alwaysShow = button.id === 'settingsButton';
                    const isCoreNav = ['workshopScreen', 'repositoryScreen'].includes(button.dataset?.target);
                    button.classList.toggle('hidden-by-flow', !isPostQuestionnaire && isCoreNav && !alwaysShow);
                }
            });
            // Ensure theme toggle is visible when nav is visible
            document.getElementById('themeToggle')?.classList.remove('hidden-by-flow');
        }
    }

    // Call specific display logic AFTER the screen is made visible
    try {
        switch (screenId) {
            case 'personaScreen':
                if (isPostQuestionnaire) {
                    const justFinishedQuestionnaire = previousScreenId === 'questionnaireScreen';
                    // Show summary view first time after questionnaire
                    if (justFinishedQuestionnaire && personaSummaryView && personaDetailedView) {
                        togglePersonaView(false); // This calls displayPersonaSummary
                    } else {
                        // Otherwise, refresh based on the currently active view
                        if (personaSummaryView?.classList.contains('current')) {
                            displayPersonaSummary();
                        } else {
                            GameLogic.displayPersonaScreenLogic(); // Handles detailed view logic + narrative etc.
                        }
                    }
                    displayInsightLog(); // Ensure log is rendered if toggled open
                }
                break;
            case 'workshopScreen':
                if (isPostQuestionnaire) {
                    displayWorkshopScreenContent();
                    refreshGrimoireDisplay(); // Ensure library is up-to-date
                }
                break;
            case 'repositoryScreen':
                if (isPostQuestionnaire) {
                    displayRepositoryContent();
                }
                break;
            case 'questionnaireScreen':
                if (!isPostQuestionnaire) {
                    const index = State.getState().currentElementIndex;
                    if (index >= 0 && index < elementNames.length) {
                        displayElementQuestions(index); // Display current question
                    } else {
                        console.warn("Questionnaire screen shown but index is invalid:", index);
                        initializeQuestionnaireUI(); // Start from beginning if index invalid
                    }
                } else {
                    // Should not happen if navigation logic is correct
                    console.warn("Attempted to show questionnaire screen after completion.");
                    showScreen('personaScreen'); // Redirect
                }
                break;
            case 'welcomeScreen':
                // No specific display logic needed here, just ensure it's shown
                break;
        }
    } catch (error) {
        console.error(`Error during display logic for screen ${screenId}:`, error);
        // Optionally show an error message to the user
    }


    // Scroll to top for main content screens
    if (['questionnaireScreen', 'workshopScreen', 'personaScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
    previousScreenId = screenId; // Track the last shown screen
}


// --- Insight Display & Log ---

/** Updates all Insight display elements across the UI. */
export function updateInsightDisplays() {
    const insightValue = State.getInsight();
    const insight = insightValue.toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight;
    if (userInsightDisplayWorkshop) userInsightDisplayWorkshop.textContent = insight;
    updateInsightBoostButtonState(); // Update cooldown button state
    updateDependentUI(); // Update UI elements dependent on insight amount

    // Refresh insight log only if it's currently potentially visible
    if (personaScreen?.classList.contains('current') && insightLogContainer && !insightLogContainer.classList.contains('log-hidden')) {
        displayInsightLog();
    }
}

/** Updates UI elements whose state depends on the current Insight amount. */
function updateDependentUI() {
    const insightValue = State.getInsight();

    // Workshop Research Buttons (Cost check)
    if (elementResearchButtonsContainer) {
        elementResearchButtonsContainer.querySelectorAll('.initial-discovery-element').forEach(buttonCard => {
            // Only check non-free research buttons
            if (!buttonCard.dataset.isFree || buttonCard.dataset.isFree === 'false') {
                const cost = parseFloat(buttonCard.dataset.cost);
                const canAfford = insightValue >= cost;
                buttonCard.classList.toggle('disabled', !canAfford);
                buttonCard.classList.toggle('clickable', canAfford); // Ensure clickable class is managed
                const actionDiv = buttonCard.querySelector('.element-action');
                if(actionDiv) actionDiv.classList.toggle('disabled', !canAfford);
                buttonCard.title = canAfford ? `Research ${Utils.getElementShortName(elementKeyToFullName[buttonCard.dataset.elementKey])} (Cost: ${cost})` : `Requires ${cost} Insight`;
            } else {
                 // Ensure free buttons are always clickable (unless used up)
                 buttonCard.classList.remove('disabled');
                 buttonCard.classList.add('clickable');
                 const actionDiv = buttonCard.querySelector('.element-action');
                 if(actionDiv) actionDiv.classList.remove('disabled');
            }
        });
    }

    // Workshop Seek Guidance Button
    if (seekGuidanceButtonWorkshop && guidedReflectionCostDisplayWorkshop) {
        const cost = Config.GUIDED_REFLECTION_COST;
        const canAfford = insightValue >= cost;
        seekGuidanceButtonWorkshop.disabled = !canAfford;
        seekGuidanceButtonWorkshop.title = canAfford ? `Spend ${cost} Insight for a Guided Reflection.` : `Requires ${cost} Insight.`;
    }

    // Persona Screen - Deep Dive Unlock Buttons
    if (personaScreen?.classList.contains('current')) {
        personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container .unlock-button').forEach(button => {
            const cost = parseFloat(button.dataset.cost);
            const canAfford = insightValue >= cost;
            button.disabled = !canAfford;
            button.title = canAfford ? `Unlock for ${cost} Insight` : `Requires ${cost} Insight`;
        });
        // Update other Persona buttons dependent on insight
        updateSuggestSceneButtonState();
    }

    // Repository - Meditate/Attempt Buttons
    if (repositoryScreen?.classList.contains('current')) {
        repositoryScreen.querySelectorAll('.repo-actions button').forEach(button => {
             if (button.dataset.sceneId) {
                 const scene = sceneBlueprints.find(s => s.id === button.dataset.sceneId);
                 const cost = scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
                 button.disabled = insightValue < cost;
                 button.title = insightValue >= cost ? `Meditate on ${scene?.name}` : `Requires ${cost} Insight`;
             } else if (button.dataset.experimentId) {
                 const experiment = alchemicalExperiments.find(e => e.id === button.dataset.experimentId);
                 const cost = experiment?.insightCost || Config.EXPERIMENT_BASE_COST;
                  // Button disabled state also depends on other requirements, checked elsewhere.
                  // Only update title based on insight here if not already disabled for other reasons.
                  if (!button.disabled || button.title.includes("Insight")) { // Avoid overriding other requirement messages
                        button.title = insightValue >= cost ? `Attempt ${experiment?.name}` : `Requires ${cost} Insight`;
                        // Re-check full disable state if needed here, though renderRepositoryItem should handle it
                  }
             }
        });
    }

    // Deep Dive Contemplation Button
    updateContemplationButtonState();

    // Concept Detail Popup - Lore Unlock Buttons
    if (conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
        popupLoreContent?.querySelectorAll('.unlock-lore-button').forEach(button => {
            const cost = parseFloat(button.dataset.cost);
            const canAfford = insightValue >= cost;
            button.disabled = !canAfford;
            button.title = canAfford ? `Unlock for ${cost} Insight` : `Requires ${cost} Insight`;
        });
    }
}

/** Renders the recent insight log entries. */
export function displayInsightLog() {
    if (!insightLogContainer) return;
    const logEntries = State.getInsightLog(); // Gets a copy
    insightLogContainer.innerHTML = '<h5>Recent Insight Changes:</h5>'; // Clear and add header

    if (logEntries.length === 0) {
        insightLogContainer.innerHTML += '<p><i>No recent changes logged.</i></p>';
        return;
    }

    // Display newest entries first
    logEntries.slice().reverse().forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('insight-log-entry');
        const amountClass = entry.amount > 0 ? 'log-amount-gain' : 'log-amount-loss';
        const sign = entry.amount > 0 ? '+' : '';
        // Sanitize source string slightly (basic)
        const sourceText = entry.source?.replace(/</g, "&lt;").replace(/>/g, "&gt;") || 'Unknown Source';

        entryDiv.innerHTML = `
            <span class="log-timestamp">${entry.timestamp}</span>
            <span class="log-source">${sourceText}</span>
            <span class="log-amount ${amountClass}">${sign}${entry.amount.toFixed(1)}</span>
        `;
        insightLogContainer.appendChild(entryDiv);
    });
}

/** Updates the state of the Insight Boost button (cooldown timer). */
export function updateInsightBoostButtonState() {
    const btn = getElement('addInsightButton');
    if (!btn) return;

    const cooldownEnd = State.getInsightBoostCooldownEnd();
    const now = Date.now();

    if (insightBoostTimeoutId) { clearTimeout(insightBoostTimeoutId); insightBoostTimeoutId = null; }

    if (cooldownEnd && now < cooldownEnd) {
        const remaining = Math.ceil((cooldownEnd - now) / 1000);
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-hourglass-half"></i> ${remaining}s`;
        btn.title = `Insight boost available in ${remaining} seconds.`;
        // Set timeout to update again after 1 second
        insightBoostTimeoutId = setTimeout(updateInsightBoostButtonState, 1000);
    } else {
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-plus"></i> <span class="visually-hidden">Add Insight</span>`; // Keep accessible text
        btn.title = `Get an Insight boost (${Config.INSIGHT_BOOST_AMOUNT} Insight, ${Config.INSIGHT_BOOST_COOLDOWN / 60000} min cooldown)`;
    }
}

// --- Questionnaire UI ---

/** Sets up the UI for starting the questionnaire. */
export function initializeQuestionnaireUI() {
    console.log("UI: Initializing Questionnaire UI for 7 Elements");
    State.updateElementIndex(0); // Reset index in state
    updateElementProgressHeader(-1); // Clear header initially
    displayElementQuestions(0); // Display first element's questions
    if (mainNavBar) mainNavBar.classList.add('hidden'); // Hide nav during questionnaire
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; // Hide dynamic score preview initially
    // Set initial progress bar width to 0%
    document.documentElement.style.setProperty('--progress-pct', '0%');
    console.log("UI: Questionnaire UI initialized.");
}

/** Updates the progress header with steps for each element. */
export function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) { console.error("Element progress header not found."); return; }
    elementProgressHeader.innerHTML = ''; // Clear previous steps

    // Iterate through element names ("Attraction", "Interaction", etc.)
    elementNames.forEach((elementNameKey, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.classList.add('step'); // Class for styling steps

        const elementData = elementDetails[elementNameKey] || {}; // Get data using the name key
        const fullName = elementData.name || elementNameKey;
        const shortName = Utils.getElementShortName(fullName);

        stepDiv.textContent = shortName; // Display short name
        stepDiv.title = fullName; // Full name on hover

        // Add classes based on progress state
        stepDiv.classList.toggle('completed', index < activeIndex);
        stepDiv.classList.toggle('active', index === activeIndex);

        elementProgressHeader.appendChild(stepDiv);
    });
}

/** Displays the questions for the element at the given index. */
export function displayElementQuestions(index) {
    const actualIndex = State.getState().currentElementIndex;
    // Use index from state if valid, otherwise use the passed index (e.g., for initialization)
    const displayIndex = (actualIndex >= 0 && actualIndex < elementNames.length) ? actualIndex : index;
    console.log(`UI: Displaying Qs for index ${displayIndex}`);

    if (displayIndex >= elementNames.length) {
        // Should not happen if navigation is correct, but finalize as fallback
        console.warn(`displayElementQuestions called with index ${displayIndex} >= element count ${elementNames.length}. Finalizing.`);
        GameLogic.finalizeQuestionnaire();
        return;
    }

    const elementNameKey = elementNames[displayIndex]; // "Attraction", etc.
    const elementData = elementDetails[elementNameKey] || {};
    const fullName = elementData.name || elementNameKey;
    const questions = questionnaireGuided[elementNameKey] || [];

    if (!questionContent) { console.error("Question content area #questionContent missing!"); return; }

    // Get saved answers for this element, if any
    const elementAnswers = State.getState().userAnswers?.[elementNameKey] || {};

    // --- Build HTML ---
    // Clear previous content and add intro section
    questionContent.innerHTML = `
        <div class="element-intro">
            <h2>${fullName}</h2>
            <p><em>${elementData.coreQuestion || 'Exploring this element...'}</em></p>
            <p>${elementData.coreConcept || 'Loading details...'}</p>
            <p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p>
        </div>`;

    // Build and append questions HTML
    let questionsHTML = '';
    if (questions.length > 0) {
        questions.forEach(q => {
            // Add a container block for each question
            questionsHTML += `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
            const savedAnswer = elementAnswers[q.qId];

            // Generate input based on type
            if (q.type === "slider") {
                const sliderValue = (savedAnswer !== undefined && !isNaN(parseFloat(savedAnswer))) ? parseFloat(savedAnswer) : q.defaultValue;
                questionsHTML += `
                    <div class="slider-container">
                        <label for="${q.qId}" class="visually-hidden">${q.text}</label>
                        <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${sliderValue}" data-question-id="${q.qId}" data-type="slider">
                        <div class="label-container">
                            <span class="label-text">${q.minLabel}</span>
                            <span class="label-text">${q.maxLabel}</span>
                        </div>
                        <p class="value-text" aria-live="polite">Selected: <span id="display_${q.qId}">${parseFloat(sliderValue).toFixed(1)}</span></p>
                        <p class="slider-feedback" id="feedback_${q.qId}"></p>
                    </div>`;
            } else if (q.type === "radio") {
                questionsHTML += `<fieldset class="radio-options"><legend class="visually-hidden">${q.text}</legend>`; // Use fieldset for grouping radios
                q.options.forEach(opt => {
                    const checked = savedAnswer === opt.value ? 'checked' : '';
                    questionsHTML += `<div class="form-group"><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`;
                });
                questionsHTML += `</fieldset>`;
            } else if (q.type === "checkbox") {
                questionsHTML += `<fieldset class="checkbox-options"><legend class="visually-hidden">${q.text} (Max ${q.maxChoices || 2})</legend>`; // Use fieldset
                q.options.forEach(opt => {
                    const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : '';
                    questionsHTML += `<div class="form-group"><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`;
                });
                questionsHTML += `</fieldset>`;
            }
            questionsHTML += `</div></div>`; // Close input-container and question-block
        });
    } else {
        // Handle elements with no specific questions (e.g., relying only on general understanding or future logic)
        questionsHTML = '<p><i>(No specific questions required for this element assessment.)</i></p>';
    }

    questionContent.innerHTML += questionsHTML; // Append questions to intro

    // --- Add Event Listeners ---
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change'; // Use 'input' for sliders for real-time updates
        input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange); // Prevent duplicates if re-rendering
        input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
    });
    // Specific listener for checkboxes to handle maxChoices logic
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.removeEventListener('change', GameLogic.handleCheckboxChange);
        checkbox.addEventListener('change', GameLogic.handleCheckboxChange);
    });
    // Initialize slider feedback text
    questionContent.querySelectorAll('.slider.q-input').forEach(slider => {
        updateSliderFeedbackText(slider, elementNameKey);
    });

    // --- Update Surrounding UI ---
    updateDynamicFeedback(elementNameKey, elementAnswers); // Update score preview
    updateElementProgressHeader(displayIndex); // Update header steps styling
    if (progressText) progressText.textContent = `Element ${displayIndex + 1} / ${elementNames.length}: ${fullName}`;
    if (prevElementButton) prevElementButton.style.visibility = (displayIndex > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (displayIndex === elementNames.length - 1) ? "View Initial Discoveries" : "Next Element";

    // Update progress bar percentage
    const pct = ((displayIndex + 1) / elementNames.length) * 100;
    document.documentElement.style.setProperty('--progress-pct', pct + '%');

    console.log(`UI: Finished displaying questions for ${elementNameKey} at index ${displayIndex}`);
}

/** Updates the descriptive text below a slider based on its value. */
export function updateSliderFeedbackText(sliderElement, elementNameKey) {
    if (!sliderElement || sliderElement.type !== 'range') return;
    const qId = sliderElement.dataset.questionId;
    const feedbackElement = getElement(`feedback_${qId}`);
    if (!feedbackElement) { console.warn(`Feedback element missing for slider ${qId}`); return; }

    const currentValue = parseFloat(sliderElement.value);
    const display = getElement(`display_${qId}`);
    if(display) display.textContent = currentValue.toFixed(1); // Update numeric display

    const elementData = elementDetails?.[elementNameKey];
    if (!elementData?.scoreInterpretations) {
        console.warn(`Interpretations missing for element: ${elementNameKey}`);
        feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; // Basic fallback
        return;
    }
    const interpretations = elementData.scoreInterpretations;
    const scoreLabel = Utils.getScoreLabel(currentValue);
    const interpretationText = interpretations[scoreLabel] || `Interpretation for "${scoreLabel}" not found.`;

    feedbackElement.textContent = interpretationText;
    feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`;
}

/** Updates the dynamic score preview area during the questionnaire. */
export function updateDynamicFeedback(elementNameKey, currentAnswers) {
    const elementData = elementDetails?.[elementNameKey];
    if (!elementData || !dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) {
        if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none';
        return; // Hide if elements missing
    }

    // Calculate temporary score based on current answers
    const tempScore = GameLogic.calculateElementScore(elementNameKey, currentAnswers);
    const scoreLabel = Utils.getScoreLabel(tempScore);
    const shortName = Utils.getElementShortName(elementData.name || elementNameKey);

    feedbackElementSpan.textContent = shortName;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);

    // Ensure the label span exists and update it
    let scoreParent = feedbackScoreSpan?.parentNode;
    let labelSpan = scoreParent?.querySelector('.score-label');
    if (!labelSpan && scoreParent) { // Create if missing
        labelSpan = document.createElement('span');
        labelSpan.classList.add('score-label');
        // Insert after the score span
        feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling);
    }
    if (labelSpan) {
        labelSpan.textContent = ` (${scoreLabel})`;
    }

    // Update the progress bar width
    feedbackScoreBar.style.width = `${tempScore * 10}%`;
    dynamicScoreFeedback.style.display = 'block'; // Ensure it's visible
}

/** Reads and returns the current answers from the questionnaire UI. */
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
            // Initialize array if it's the first checkbox for this question
            if (!answers[qId]) {
                answers[qId] = [];
            }
            // Add value if checked
            if (input.checked) {
                answers[qId].push(input.value);
            }
        }
    });
    // Ensure checkboxes always have an array (even if empty) in the result
    questionContent?.querySelectorAll('.checkbox-options').forEach(container => {
        const name = container.querySelector('input[type="checkbox"]')?.name;
        if(name && !answers[name]) {
            answers[name] = []; // Ensure empty array if no boxes checked for this question
        }
    });
    return answers;
}


// --- Persona Screen UI ---

/** Toggles between the detailed and summary views on the Persona screen. */
export function togglePersonaView(showDetailed) {
    if (personaDetailedView && personaSummaryView && showDetailedViewBtn && showSummaryViewBtn) {
        const detailedIsCurrent = personaDetailedView.classList.contains('current');
        if (showDetailed && !detailedIsCurrent) {
            // Switch to Detailed View
            personaDetailedView.classList.remove('hidden'); personaDetailedView.classList.add('current');
            personaSummaryView.classList.add('hidden'); personaSummaryView.classList.remove('current');
            showDetailedViewBtn.classList.add('active'); showDetailedViewBtn.classList.remove('active');
            showDetailedViewBtn.setAttribute('aria-pressed', 'true');
            showSummaryViewBtn.setAttribute('aria-pressed', 'false');
            GameLogic.displayPersonaScreenLogic(); // Refresh detailed view content
            displayInsightLog(); // Render log if visible
        } else if (!showDetailed && detailedIsCurrent) {
            // Switch to Summary View
            personaSummaryView.classList.remove('hidden'); personaSummaryView.classList.add('current');
            personaDetailedView.classList.add('hidden'); personaDetailedView.classList.remove('current');
            showSummaryViewBtn.classList.add('active'); showDetailedViewBtn.classList.remove('active');
            showSummaryViewBtn.setAttribute('aria-pressed', 'true');
            showDetailedViewBtn.setAttribute('aria-pressed', 'false');
            displayPersonaSummary(); // Render summary view content
        }
        // If already on the desired view, do nothing
    } else {
        console.error("Persona view toggle elements missing.");
    }
}

/** Renders the detailed view of the Persona screen. */
export function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona element details div not found!"); return; }
    console.log("UI: Displaying Persona Screen (Detailed View - 7 Elements)");
    personaElementDetailsDiv.innerHTML = ''; // Clear previous details
    const scores = State.getScores();
    const showDeepDiveContainer = State.getState().questionnaireCompleted; // Deep Dive only available post-Q

    // Iterate through element names ("Attraction", "Interaction", etc.)
    elementNames.forEach(elementNameKey => {
        // Find the single letter key ('A', 'I', etc.) corresponding to the name key
        const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elementNameKey);
        const elementData = elementDetails[elementNameKey];

        if (!key || !elementData) {
            console.warn(`UI displayPersonaScreen: Could not find key or data for element name key: ${elementNameKey}`);
            return; // Skip rendering this element if data is missing
        }

        const fullName = elementData.name || elementNameKey;
        const score = (scores[key] !== undefined && typeof scores[key] === 'number' && !isNaN(scores[key])) ? scores[key] : 5.0; // Default to 5 if score missing/invalid
        const scoreLabel = Utils.getScoreLabel(score);
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation not available.";
        const barWidth = Math.max(0, Math.min(100, score * 10)); // Clamp 0-100
        const color = Utils.getElementColor(elementNameKey);
        const iconClass = Utils.getElementIcon(elementNameKey);
        const elementNameShort = Utils.getElementShortName(fullName);

        // Create the main <details> element for the accordion
        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        details.dataset.elementKey = key;
        details.style.setProperty('--element-color', color); // For potential CSS use

        // Create the summary element (the clickable header)
        const summary = document.createElement('summary');
        summary.classList.add('element-detail-header');
        summary.innerHTML = `
            <div>
                <i class="${iconClass} element-icon-indicator" style="color: ${color};" title="${fullName}"></i>
                <strong>${elementNameShort}:</strong>
                <span>${score.toFixed(1)}</span>
                <span class="score-label">(${scoreLabel})</span>
            </div>
            <div class="score-bar-container" title="Score: ${score.toFixed(1)}/10 (${scoreLabel})">
                <div style="width: ${barWidth}%; background-color: ${color};"></div>
            </div>
        `;

        // Create the content div for inside the details element
        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('element-description');

        // Add Core Concept and Interpretation
        descriptionDiv.innerHTML = `
            <p><strong>Core Concept:</strong> ${elementData.coreConcept || 'No description available.'}</p>
            <details class="element-elaboration">
                <summary>Elaboration & Examples</summary>
                <div class="collapsible-content">
                    <p><strong>Elaboration:</strong> ${elementData.elaboration || 'No elaboration available.'}</p>
                    <p><small><strong>Examples:</strong> ${elementData.examples || 'No examples provided.'}</small></p>
                </div>
            </details>
            <hr class="content-hr">
            <p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p>
            <hr class="attunement-hr">
        `;

        // Add placeholder for Attunement (filled by displayElementAttunement)
        const attunementPlaceholder = document.createElement('div');
        attunementPlaceholder.className = 'attunement-placeholder'; // Placeholder marker
        descriptionDiv.appendChild(attunementPlaceholder);

        // Add container for Deep Dive content (initially hidden, populated later)
        const deepDiveContainer = document.createElement('div');
        deepDiveContainer.classList.add('element-deep-dive-container', 'hidden');
        deepDiveContainer.dataset.elementKey = key; // Link to the element key
        descriptionDiv.appendChild(deepDiveContainer);

        // Assemble the accordion entry
        details.appendChild(summary);
        details.appendChild(descriptionDiv);
        personaElementDetailsDiv.appendChild(details);

        // Populate deep dive content if ready
        if (showDeepDiveContainer) {
            displayElementDeepDive(key, deepDiveContainer); // Populate the container
            deepDiveContainer.classList.remove('hidden'); // Make it visible
        }
    });

    // Populate other dynamic parts of the detailed view
    displayElementAttunement(); // Populate all attunement bars
    updateInsightDisplays(); // Update insight numbers
    displayFocusedConceptsPersona(); // Render focused concepts grid
    generateTapestryNarrative(); // Generate and display narrative text
    synthesizeAndDisplayThemesPersona(); // Generate and display dominant themes list
    updateElementalDilemmaButtonState(); // Update button states
    updateSuggestSceneButtonState();
    GameLogic.checkSynergyTensionStatus(); // Update synergy button based on current focus
}

/** Updates the attunement bars within the element detail accordions. */
export function displayElementAttunement() {
    if (!personaElementDetailsDiv) return;
    const attunement = State.getAttunement(); // { A: val, ..., RF: val }

    Object.entries(attunement).forEach(([key, attunementValue]) => {
        const value = attunementValue || 0;
        const percentage = Math.max(0, Math.min(100, (value / Config.MAX_ATTUNEMENT) * 100)); // Clamp 0-100
        const elementNameKey = elementKeyToFullName[key]; // "Attraction", etc.

        if (!elementNameKey) {
            console.warn(`UI displayElementAttunement: Element name key not found for key: ${key}`);
            return;
        }
        const color = Utils.getElementColor(elementNameKey);

        // Find the correct accordion details element
        const targetDetails = personaElementDetailsDiv.querySelector(`.element-detail-entry[data-element-key="${key}"]`);
        if (!targetDetails) {
            // Might not be rendered yet, this is okay
            // console.warn(`UI displayElementAttunement: Target details container not found for key ${key}.`);
            return;
        }

        const descriptionDiv = targetDetails.querySelector('.element-description');
        if (!descriptionDiv) { console.warn(`No .element-description found for ${key}`); return; }

        // Find or create the attunement display container
        let attunementDisplay = descriptionDiv.querySelector('.attunement-display');
        if (!attunementDisplay) {
            attunementDisplay = document.createElement('div');
            attunementDisplay.classList.add('attunement-display');
            attunementDisplay.innerHTML = `
                <div class="attunement-item">
                    <span class="attunement-name">Attunement:</span>
                    <div class="attunement-bar-container" title="">
                        <div class="attunement-bar" style="background-color: ${color};"></div>
                    </div>
                    <i class="fas fa-info-circle info-icon" title="Attunement reflects affinity/experience with this Element. Grows via Research, Reflection, Focusing concepts. High Attunement may unlock content or reduce costs."></i>
                </div>`;
            // Insert after the attunement HR marker
            const hr = descriptionDiv.querySelector('hr.attunement-hr');
            if (hr) {
                hr.insertAdjacentElement('afterend', attunementDisplay);
            } else {
                // Fallback: insert before deep dive container if HR missing
                descriptionDiv.insertBefore(attunementDisplay, descriptionDiv.querySelector('.element-deep-dive-container'));
            }
        }

        // Update the bar width and title
        const bar = attunementDisplay.querySelector('.attunement-bar');
        const container = attunementDisplay.querySelector('.attunement-bar-container');
        if (bar) bar.style.width = `${percentage}%`;
        if (container) container.title = `Current Attunement: ${value.toFixed(1)} / ${Config.MAX_ATTUNEMENT}`;
    });
}

/** Updates the display showing focused concepts count / total slots. */
export function updateFocusSlotsDisplay() {
    const focused = State.getFocusedConcepts();
    const totalSlots = State.getFocusSlots();
    if (focusedConceptsHeader) {
        // Update header text
        focusedConceptsHeader.innerHTML = `Focused Concepts (${focused.size} / ${totalSlots}) <i class="fas fa-info-circle info-icon"></i>`;
        // Update title attribute of the info icon
        const icon = focusedConceptsHeader.querySelector('.info-icon');
        if (icon) {
            icon.title = `Concepts marked as Focus (${focused.size}) out of your available slots (${totalSlots}). Slots increase via Milestones.`;
        }
    }
}

/** Renders the grid of currently focused concepts on the Persona screen. */
export function displayFocusedConceptsPersona() {
    if (!focusedConceptsDisplay) { console.error("Focused concepts display area not found."); return; }
    focusedConceptsDisplay.innerHTML = ''; // Clear previous
    updateFocusSlotsDisplay(); // Update the header count

    const focused = State.getFocusedConcepts(); // Set of IDs
    const discovered = State.getDiscoveredConcepts(); // Map of ID -> { concept, ... }

    if (focused.size === 0) {
        focusedConceptsDisplay.innerHTML = `<div class="focus-placeholder">Focus Concepts from your Workshop Library (tap the ☆)</div>`;
        return;
    }

    focused.forEach(conceptId => {
        const conceptData = discovered.get(conceptId);
        if (conceptData?.concept) {
            const concept = conceptData.concept;
            const item = document.createElement('div');
            // Use class that matches Grimoire grid for potential shared styling via concept-grid
            item.classList.add('focus-concept-item');
            item.dataset.conceptId = concept.id;
            item.title = `View Details: ${concept.name}`;
            item.style.cursor = 'pointer'; // Indicate clickable

            // Attempt to set background image if visualHandle exists
            let backgroundStyle = '';
            let imgErrorPlaceholder = ''; // Placeholder added if image fails
            if (concept.visualHandle) {
                const handle = concept.visualHandle;
                // Assume extension is defined in config or default to .jpg
                const extension = Config.UNLOCKED_ART_EXTENSION || '.jpg';
                const fileName = handle.includes('.') ? handle : `${handle}${extension}`;
                const imageUrl = `placeholder_art/${fileName}`;
                // Set background style and add class for potential overlay/blur effects
                backgroundStyle = `background-image: url('${imageUrl}');`;
                item.classList.add('has-background-image');
                // Add hidden img tag solely for onerror handling
                imgErrorPlaceholder = `<img src="${imageUrl}" alt="" style="display:none;" onerror="handleImageError(this.parentElement)">`;
            }
            item.style = backgroundStyle; // Apply background image style

            // Determine icon and color (prefer element, fallback to type)
            let iconClass = Utils.getCardTypeIcon(concept.cardType); // Default to type icon
            let iconColor = 'var(--text-muted-color)'; // Default color
            let iconTitle = concept.cardType;
            if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement]) {
                const elementNameKey = elementKeyToFullName[concept.primaryElement];
                iconClass = Utils.getElementIcon(elementNameKey);
                iconColor = Utils.getElementColor(elementNameKey);
                iconTitle = Utils.getElementShortName(elementNameKey);
            }

            item.innerHTML = `
                <i class="${iconClass}" style="color: ${iconColor};" title="${iconTitle}"></i>
                <span class="name">${concept.name}</span>
                <span class="type">(${concept.cardType})</span>
                ${imgErrorPlaceholder}
            `;
            // Add click listener to show detail popup (handled by delegation in setup)
            focusedConceptsDisplay.appendChild(item);
        } else {
            // Handle case where focused concept ID isn't found in discovered map
            console.warn(`Focused concept ID ${conceptId} not found in discovered concepts map.`);
            const item = document.createElement('div');
            item.classList.add('focus-concept-item', 'missing');
            item.textContent = `Error: Concept ID ${conceptId} not found`;
            focusedConceptsDisplay.appendChild(item);
        }
    });
    updateSuggestSceneButtonState(); // Update button state based on focus count
}

/** Calls game logic to calculate and then displays the tapestry narrative. */
export function generateTapestryNarrative() {
    if (!tapestryNarrativeP) return;
    const narrativeHTML = GameLogic.calculateTapestryNarrative(); // Logic handles calculation/caching
    tapestryNarrativeP.innerHTML = narrativeHTML || 'Mark concepts as "Focus" to generate narrative...';
}

/** Calculates and displays the dominant themes based on focused concepts. */
export function synthesizeAndDisplayThemesPersona() {
    if (!personaThemesList) { console.error("Persona themes list element not found."); return; }
    personaThemesList.innerHTML = ''; // Clear previous themes
    const themes = GameLogic.calculateFocusThemes(); // Gets sorted array: [{ key, name, count }]

    if (themes.length === 0) {
        const placeholderText = State.getFocusedConcepts().size > 0 ? 'Focus is currently balanced across elements.' : 'Mark Focused Concepts to see dominant themes...';
        personaThemesList.innerHTML = `<li>${placeholderText}</li>`;
        return;
    }

    // Display top themes (e.g., top 3)
    themes.slice(0, 3).forEach((theme, index) => {
        const li = document.createElement('li');
        const elementNameKey = elementKeyToFullName[theme.key]; // "Attraction", etc.
        const color = Utils.getElementColor(elementNameKey);
        const icon = Utils.getElementIcon(elementNameKey);
        let emphasis = "Influenced by"; // Default emphasis
        if (index === 0 && theme.count >= 3) emphasis = "Strongly Focused on";
        else if (index === 0) emphasis = "Primarily Focused on";

        li.innerHTML = `<i class="${icon}" style="color: ${color}; margin-right: 5px;" title="${theme.name}"></i> ${emphasis} ${theme.name} (${theme.count})`;
        li.style.borderLeft = `3px solid ${color}`;
        li.style.paddingLeft = '8px';
        li.style.marginBottom = '4px'; // Add some spacing
        personaThemesList.appendChild(li);
    });
}

/** Draws the radar chart for persona scores. */
export function drawPersonaChart(scores) { // scores object: { A: val, ..., RF: val }
    const canvas = personaScoreChartCanvas;
    if (!canvas) { console.error("Persona score chart canvas not found!"); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { console.error("Could not get canvas context for chart!"); return; }

    // Get colors and fonts from CSS variables for theme consistency
    const computedStyle = getComputedStyle(document.documentElement);
    const pointLabelFont = computedStyle.fontFamily || 'Arial, sans-serif';
    const pointLabelColor = computedStyle.getPropertyValue('--text-muted-color').trim() || '#6c757d';
    const tickColor = computedStyle.getPropertyValue('--text-color').trim() || '#333';
    const gridColor = Utils.hexToRgba(computedStyle.getPropertyValue('--border-color-dark').trim() || '#adb5bd', 0.3); // Use border color for grid
    const chartBackgroundColor = Utils.hexToRgba(computedStyle.getPropertyValue('--background-light').trim() || '#f8f9fa', 0.8); // For tick backdrop

    // Prepare labels and data points based on the 7 elements
    const labels = elementNames.map(nameKey => Utils.getElementShortName(elementDetails[nameKey]?.name || nameKey));
    const dataPoints = elementNames.map(nameKey => {
        // Map name key ("Attraction") back to score key ('A')
        const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === nameKey);
        return scores[key] ?? 0; // Default to 0 if score is missing
    });

    // Get element colors, potentially adapted for dark mode by CSS variables
    const borderColors = elementNames.map(nameKey => {
        // Look for a specific CSS variable first (e.g., --attraction-color)
        let colorVar = `--${nameKey.toLowerCase()}-color`; // Matches CSS variable naming convention
        let adaptedColor = computedStyle.getPropertyValue(colorVar).trim();
        // If variable not found or empty, use the utility function fallback
        return adaptedColor || Utils.getElementColor(nameKey);
    });
    const backgroundColors = borderColors.map(color => Utils.hexToRgba(color, 0.4)); // 40% alpha


    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Elemental Scores',
            data: dataPoints,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            pointBackgroundColor: borderColors,
            pointBorderColor: chartBackgroundColor, // Use chart background for contrast
            pointHoverBackgroundColor: chartBackgroundColor,
            pointHoverBorderColor: borderColors,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: { // Radial axis configuration
                angleLines: { display: true, color: gridColor }, // Lines from center to labels
                grid: { color: gridColor }, // Concentric grid lines
                pointLabels: { // Labels around the edge (A, I, S...)
                     font: { size: 11, family: pointLabelFont, weight: 'bold' },
                     color: pointLabelColor
                },
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: { // Numerical labels on the axis (0, 2, 4...)
                     stepSize: 2,
                     backdropColor: chartBackgroundColor, // Background for ticks
                     color: tickColor, // Tick number color
                     font: { weight: 'bold' }
                }
            }
        },
        plugins: {
            legend: { display: false }, // Hide the dataset legend
            tooltip: { // Customize tooltips on hover
                backgroundColor: 'rgba(0,0,0,0.8)', // Darker tooltip background
                titleFont: { family: pointLabelFont, weight: 'bold' },
                bodyFont: { family: pointLabelFont },
                padding: 10,
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                displayColors: false, // Don't show color box in tooltip
                callbacks: {
                     // Format tooltip label
                     label: function(context) {
                         let label = context.label || ''; // Element name
                         if (label) { label += ': '; }
                         const score = context.parsed.r;
                         if (score !== null) {
                             label += `${score.toFixed(1)} (${Utils.getScoreLabel(score)})`; // Add score and label
                         }
                         return label;
                     }
                }
            }
        }
    };

    // Destroy previous chart instance if it exists to prevent memory leaks/ghosting
    if (personaChartInstance) {
        personaChartInstance.destroy();
    }
    // Create the new chart
    personaChartInstance = new Chart(ctx, { type: 'radar', data: chartData, options: chartOptions });
}

/** Renders the content for the Persona Summary view. */
export function displayPersonaSummary() {
    if (!summaryContentDiv || !summaryCoreEssenceTextDiv || !summaryTapestryInfoDiv) {
        console.error("Summary view content divs not found!");
        if(summaryContentDiv) summaryContentDiv.innerHTML = '<p>Error loading summary content elements.</p>';
        return;
    }
    console.log("UI: Displaying Persona Summary");

    summaryCoreEssenceTextDiv.innerHTML = ''; // Clear previous
    summaryTapestryInfoDiv.innerHTML = ''; // Clear previous

    const scores = State.getScores(); // { A: val, ..., RF: val }
    const focused = State.getFocusedConcepts();
    const narrativeHTML = GameLogic.calculateTapestryNarrative(); // Get cached or recalculated narrative
    const themes = GameLogic.calculateFocusThemes(); // Get dominant themes

    // Core Essence Section
    let coreEssenceHTML = '';
    if (elementDetails && elementKeyToFullName) {
        elementNames.forEach(elNameKey => { // "Attraction", "Interaction", ...
            const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elNameKey); // 'A', 'I', ...
            if (!key) {
                console.warn(`UI displayPersonaSummary: Could not find score key for element name: ${elNameKey}`);
                coreEssenceHTML += `<p><strong>${Utils.getElementShortName(elementDetails[elNameKey]?.name || elNameKey)}:</strong> Score lookup error.</p>`;
                return;
            }

            const score = scores[key];
            if (typeof score === 'number') {
                const label = Utils.getScoreLabel(score);
                const elementData = elementDetails[elNameKey] || {};
                const fullName = elementData.name || elNameKey;
                const interpretation = elementData.scoreInterpretations?.[label] || "N/A";
                coreEssenceHTML += `<p><strong>${Utils.getElementShortName(fullName)} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`;
            } else {
                // Handle missing score gracefully
                const fullName = elementDetails[elNameKey]?.name || elNameKey;
                coreEssenceHTML += `<p><strong>${Utils.getElementShortName(fullName)}:</strong> Score not available.</p>`;
            }
        });
    } else {
        coreEssenceHTML += "<p>Error: Element details not loaded.</p>";
    }
    summaryCoreEssenceTextDiv.innerHTML = coreEssenceHTML;

    // Focused Tapestry Section
    let tapestryHTML = '';
    if (focused.size > 0) {
        tapestryHTML += `<p><em>${narrativeHTML || "No narrative generated."}</em></p>`; // Display narrative
        tapestryHTML += '<strong>Focused Concepts:</strong><ul>';
        const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => {
            const name = discovered.get(id)?.concept?.name || `ID ${id}`;
            tapestryHTML += `<li>${name}</li>`;
        });
        tapestryHTML += '</ul>';

        // Display Dominant Themes
        if (themes.length > 0) {
            tapestryHTML += '<strong>Dominant Themes:</strong><ul>';
            themes.slice(0, 3).forEach(theme => { // Show top 3 themes
                 const elementNameKey = elementKeyToFullName[theme.key];
                 const color = Utils.getElementColor(elementNameKey);
                tapestryHTML += `<li style="border-left: 3px solid ${color}; padding-left: 5px;">${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})</li>`;
            });
            tapestryHTML += '</ul>';
        } else {
            tapestryHTML += '<strong>Dominant Themes:</strong><p>No strong themes detected from current focus.</p>';
        }
    } else {
        tapestryHTML += '<p>No concepts are currently focused. Add focus in the Workshop to weave your Tapestry!</p>';
    }
    summaryTapestryInfoDiv.innerHTML = tapestryHTML;

    // Draw/Update the Radar Chart
    drawPersonaChart(scores);
}

// --- Workshop Screen UI ---

/** Populates the Workshop screen, including research buttons and daily actions. */
export function displayWorkshopScreenContent() {
    if (!workshopScreen) return;
    console.log(`UI: Populating Workshop Screen Content`);

    // Update insight display
    if (userInsightDisplayWorkshop) {
        userInsightDisplayWorkshop.textContent = State.getInsight().toFixed(1);
    }

    // Populate Research Bench Buttons
    if (elementResearchButtonsContainer) {
        elementResearchButtonsContainer.innerHTML = ''; // Clear previous buttons
        const scores = State.getScores();
        const freeResearchLeft = State.getInitialFreeResearchRemaining();
        const insight = State.getInsight();

        elementNames.forEach(elementNameKey => { // "Attraction", "Interaction", ...
            const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elementNameKey); // 'A', 'I', ...
            if (!key || !elementDetails[elementNameKey]) {
                 console.warn(`UI displayWorkshopScreenContent: Could not find key or data for element name: ${elementNameKey}`);
                 return;
            }
            const elementData = elementDetails[elementNameKey];
            const score = scores[key] ?? 5.0;
            const scoreLabel = Utils.getScoreLabel(score);
            const fullName = elementData.name || elementNameKey;
            const color = Utils.getElementColor(elementNameKey);
            const iconClass = Utils.getElementIcon(elementNameKey);
            const shortName = Utils.getElementShortName(fullName);

            // Create the button card element
            const elementDiv = document.createElement('div');
            elementDiv.classList.add('initial-discovery-element'); // Base class
            elementDiv.dataset.elementKey = key;

            let costText = "";
            let isDisabled = false;
            let titleText = "";
            let isFreeClick = false;
            const researchCost = Config.BASE_RESEARCH_COST;

            // Determine button state (Free, Cost, Disabled)
            if (freeResearchLeft > 0) {
                costText = `Use 1 FREE ★`; // Indicate free attempt
                titleText = `Conduct FREE research on ${shortName}. (${freeResearchLeft} left total)`;
                isFreeClick = true;
                isDisabled = false; // Free attempts are always enabled if available
            } else {
                costText = `${researchCost} <i class="fas fa-brain insight-icon"></i>`; // Show cost
                if (insight < researchCost) {
                    isDisabled = true; // Disable if cannot afford
                    titleText = `Research ${shortName} (Requires ${researchCost} Insight)`;
                } else {
                    isDisabled = false; // Enable if can afford
                    titleText = `Research ${shortName} (Cost: ${researchCost} Insight)`;
                }
                isFreeClick = false;
            }
            elementDiv.dataset.cost = researchCost;
            elementDiv.dataset.isFree = isFreeClick; // Store free status

            // Get rarity counts for undiscovered concepts
            let rarityCountsHTML = '';
            try {
                const rarityCounts = GameLogic.countUndiscoveredByRarity(key);
                rarityCountsHTML = `
                    <div class="rarity-counts-display" title="Undiscovered Concepts (Primary Element: ${shortName})">
                        <span class="rarity-count common" title="${rarityCounts.common} Common"><i class="fas fa-circle"></i> ${rarityCounts.common}</span>
                        <span class="rarity-count uncommon" title="${rarityCounts.uncommon} Uncommon"><i class="fas fa-square"></i> ${rarityCounts.uncommon}</span>
                        <span class="rarity-count rare" title="${rarityCounts.rare} Rare"><i class="fas fa-star"></i> ${rarityCounts.rare}</span>
                    </div>`;
            } catch (error) {
                console.error(`Error getting rarity counts for ${key}:`, error);
                rarityCountsHTML = '<div class="rarity-counts-display error">Counts N/A</div>';
            }

            // Populate the button card content
            elementDiv.innerHTML = `
                <div class="element-header">
                    <i class="${iconClass}" style="color: ${color};"></i>
                    <span class="element-name">${shortName}</span>
                </div>
                <div class="element-score-display">
                    ${score.toFixed(1)} (${scoreLabel})
                </div>
                <p class="element-concept">${elementData.coreConcept || 'Loading...'}</p>
                ${rarityCountsHTML}
                <div class="element-action ${isDisabled ? 'disabled' : ''}">
                    <span class="element-cost">${costText}</span>
                </div>
                 ${isFreeClick ? `<span class="free-indicator" title="Free Research Available!">★</span>` : ''}
            `;
            elementDiv.title = titleText; // Set tooltip

            // Add classes for interaction state
            elementDiv.classList.toggle('disabled', isDisabled);
            elementDiv.classList.toggle('clickable', !isDisabled);

            elementResearchButtonsContainer.appendChild(elementDiv);
        });
    } else {
        console.error("Element research buttons container #element-research-buttons not found!");
    }

    // Update Daily Action Buttons state
    if (freeResearchButtonWorkshop) {
        const freeAvailable = State.isFreeResearchAvailable();
        freeResearchButtonWorkshop.disabled = !freeAvailable;
        freeResearchButtonWorkshop.textContent = freeAvailable ? "Perform Daily Meditation ☆" : "Meditation Performed Today";
        freeResearchButtonWorkshop.title = freeAvailable ? "Once per day, perform free research on your least attuned element." : "Daily free meditation already completed.";
    }
    if (seekGuidanceButtonWorkshop && guidedReflectionCostDisplayWorkshop) {
        const cost = Config.GUIDED_REFLECTION_COST;
        const canAfford = State.getInsight() >= cost;
        seekGuidanceButtonWorkshop.disabled = !canAfford;
        seekGuidanceButtonWorkshop.title = canAfford ? `Spend ${cost} Insight for a Guided Reflection.` : `Requires ${cost} Insight.`;
        guidedReflectionCostDisplayWorkshop.textContent = cost;
    }
}


// --- Grimoire UI ---

/** Updates the Grimoire count in the main navigation. */
export function updateGrimoireCounter() {
     if (grimoireCountSpan) {
         grimoireCountSpan.textContent = State.getDiscoveredConcepts().size;
     }
}

/** Populates the filter dropdowns in the Grimoire controls. */
export function populateGrimoireFilters() {
    // Populate Type Filter
    if (grimoireTypeFilterWorkshop) {
        grimoireTypeFilterWorkshop.innerHTML = '<option value="All">All Types</option>'; // Reset
        cardTypeKeys.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            grimoireTypeFilterWorkshop.appendChild(option);
        });
    }
    // Populate Element Filter
    if (grimoireElementFilterWorkshop) {
        grimoireElementFilterWorkshop.innerHTML = '<option value="All">All Elements</option>'; // Reset
        elementNames.forEach(elementNameKey => { // "Attraction", ...
            const elementData = elementDetails[elementNameKey] || {};
            const fullName = elementData.name || elementNameKey;
            const shortName = Utils.getElementShortName(fullName);
            const option = document.createElement('option');
            option.value = elementNameKey; // Use the name key ("Attraction") as value
            option.textContent = shortName;
            option.title = fullName;
            grimoireElementFilterWorkshop.appendChild(option);
        });
    }
    // Rarity and Focus filters are static and defined in HTML
}

/** Updates the count display on each Grimoire shelf. */
function updateShelfCounts() {
    if (!grimoireShelvesWorkshop) return;
    const conceptData = Array.from(State.getDiscoveredConcepts().values()); // Get array of { concept, notes, etc. }

    // Update count for each defined shelf
    grimoireShelves.forEach(shelf => {
        const shelfElem = grimoireShelvesWorkshop.querySelector(`.grimoire-shelf[data-category-id="${shelf.id}"] .shelf-count`);
        if (shelfElem) {
            const count = conceptData.filter(data => (data.userCategory || 'uncategorized') === shelf.id).length;
            shelfElem.textContent = `(${count})`;
        }
    });
     // Update count for the "Show All" shelf
     const showAllShelfCount = grimoireShelvesWorkshop.querySelector(`.show-all-shelf .shelf-count`);
     if (showAllShelfCount) {
          showAllShelfCount.textContent = `(${conceptData.length})`;
     }
}

/** Displays the Grimoire library content based on filters and sorting. */
export function displayGrimoire(filterParams = {}) {
    const {
        filterType = "All",
        filterElement = "All", // Expects element name key like "Attraction"
        sortBy = "discovered",
        filterRarity = "All",
        searchTerm = "",
        filterFocus = "All",
        filterCategory = "All" // Expects shelf ID like "uncategorized"
    } = filterParams;

    // Render Shelves
    if (grimoireShelvesWorkshop) {
        grimoireShelvesWorkshop.innerHTML = ''; // Clear previous
        // Render "Show All" shelf first
        const showAllDiv = document.createElement('div');
        showAllDiv.classList.add('grimoire-shelf', 'show-all-shelf');
        if (filterCategory === 'All') { showAllDiv.classList.add('active-shelf'); }
        showAllDiv.innerHTML = `<h4>Show All Cards</h4><span class="shelf-count">(?)</span>`;
        showAllDiv.dataset.categoryId = 'All';
        grimoireShelvesWorkshop.appendChild(showAllDiv);
        // Render category shelves
        grimoireShelves.forEach(shelf => {
            const shelfDiv = document.createElement('div');
            shelfDiv.classList.add('grimoire-shelf');
            shelfDiv.dataset.categoryId = shelf.id;
            if (filterCategory === shelf.id) { shelfDiv.classList.add('active-shelf'); }
            // Set background/border based on category ID
            shelfDiv.style.backgroundColor = `var(--category-${shelf.id}-bg, transparent)`;
            shelfDiv.style.border = `1px solid var(--category-${shelf.id}-border, var(--border-color-light))`;
            shelfDiv.innerHTML = `<h4>${shelf.name} <i class="fas fa-info-circle info-icon" title="${shelf.description || ''}"></i></h4><span class="shelf-count">(?)</span>`;
            grimoireShelvesWorkshop.appendChild(shelfDiv);
        });
    } else { console.error("Grimoire shelves container #grimoire-shelves-workshop not found."); }

    // Get and Filter Concepts
    const targetCardContainer = grimoireGridWorkshop;
    if (!targetCardContainer) { console.error("#grimoire-grid-workshop element not found for cards."); return; }
    targetCardContainer.innerHTML = ''; // Clear previous cards

    const discoveredMap = State.getDiscoveredConcepts();
    if (discoveredMap.size === 0) {
        targetCardContainer.innerHTML = '<p>Your Grimoire Library is empty... Discover Concepts using the Research Bench!</p>';
        updateShelfCounts(); // Update counts (will show 0)
        return;
    }

    const userScores = State.getScores();
    const focusedSet = State.getFocusedConcepts();
    let discoveredArray = Array.from(discoveredMap.values()); // Array of { concept, notes, etc. }

    // --- Filtering Logic ---
    const searchTermLower = searchTerm.toLowerCase().trim();
    const conceptsToDisplay = discoveredArray.filter(data => {
        if (!data?.concept) return false; // Skip if concept data missing
        const concept = data.concept;
        const userCategory = data.userCategory || 'uncategorized';

        // Type filter
        const typeMatch = (filterType === "All") || (concept.cardType === filterType);
        // Element filter (match concept's primary element letter key with the name key from filter)
        let elementMatch = (filterElement === "All");
        if (!elementMatch) {
             // Convert filter name key ("Attraction") to letter key ('A')
             const filterLetterKey = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === filterElement);
             elementMatch = (concept.primaryElement === filterLetterKey);
        }
        // Rarity filter
        const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);
        // Focus filter
        const focusMatch = (filterFocus === 'All') ||
                           (filterFocus === 'Focused' && focusedSet.has(concept.id)) ||
                           (filterFocus === 'Not Focused' && !focusedSet.has(concept.id));
        // Search term filter (check name, keywords, description)
        const searchMatch = !searchTermLower ||
                            (concept.name.toLowerCase().includes(searchTermLower)) ||
                            (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTermLower))) ||
                            (concept.briefDescription?.toLowerCase().includes(searchTermLower));
        // Category filter
        const categoryMatch = (filterCategory === 'All') || (userCategory === filterCategory);

        return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch && categoryMatch;
    });

    // --- Sorting Logic ---
    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
    conceptsToDisplay.sort((a, b) => {
        // Ensure concept data exists for sorting
        if (!a?.concept || !b?.concept) return 0;
        const conceptA = a.concept;
        const conceptB = b.concept;

        switch (sortBy) {
            case 'name':
                return conceptA.name.localeCompare(conceptB.name);
            case 'type':
                // Sort by type index, then name
                return (cardTypeKeys.indexOf(conceptA.cardType) - cardTypeKeys.indexOf(conceptB.cardType)) || conceptA.name.localeCompare(conceptB.name);
            case 'rarity':
                // Sort by rarity descending (rare first), then name
                return (rarityOrder[conceptB.rarity] || 0) - (rarityOrder[conceptA.rarity] || 0) || conceptA.name.localeCompare(conceptB.name);
            case 'resonance':
                // Calculate distance if not already cached on the object
                const distA = a.distance ?? Utils.euclideanDistance(userScores, conceptA.elementScores, conceptA.name);
                const distB = b.distance ?? Utils.euclideanDistance(userScores, conceptB.elementScores, conceptB.name);
                a.distance = distA; // Cache distance for potential reuse
                b.distance = distB;
                // Sort by distance ascending (closest first), then name
                return distA - distB || conceptA.name.localeCompare(conceptB.name);
            case 'discovered': // Default sort
            default:
                // Sort by discovery time descending (newest first), then name
                return (b.discoveredTime || 0) - (a.discoveredTime || 0) || conceptA.name.localeCompare(conceptB.name);
        }
    });

    // --- Rendering ---
    if (conceptsToDisplay.length === 0) {
        const shelfName = filterCategory !== 'All' ? `'${grimoireShelves.find(s=>s.id===filterCategory)?.name || filterCategory}' shelf` : '';
        targetCardContainer.innerHTML = `<p>No discovered concepts match the current filters${searchTerm ? ' or search term' : ''}${shelfName ? ` on the ${shelfName}` : ''}.</p>`;
    } else {
        conceptsToDisplay.forEach(data => {
            const cardElement = renderCard(data.concept, 'grimoire', data); // Pass full data for context
            if (cardElement) {
                 cardElement.draggable = true; // Make cards draggable
                 cardElement.dataset.conceptId = data.concept.id; // Ensure ID is set
                // Add category class based on saved data
                 cardElement.classList.add(`category-${data.userCategory || 'uncategorized'}`);
                 targetCardContainer.appendChild(cardElement);
            }
        });
    }
    updateShelfCounts(); // Update shelf counts after rendering
}

/** Refreshes the Grimoire display based on current filter/sort control values. */
export function refreshGrimoireDisplay(overrideFilters = {}) {
    // Only refresh if the workshop screen is actually visible
    if (workshopScreen && !workshopScreen.classList.contains('hidden')) {
        const currentFilters = {
            filterType: grimoireTypeFilterWorkshop?.value || "All",
            filterElement: grimoireElementFilterWorkshop?.value || "All", // Value is "Attraction", etc.
            sortBy: grimoireSortOrderWorkshop?.value || "discovered",
            filterRarity: grimoireRarityFilterWorkshop?.value || "All",
            searchTerm: grimoireSearchInputWorkshop?.value || "",
            filterFocus: grimoireFocusFilterWorkshop?.value || "All",
            // Use override category if provided (e.g., from shelf click), else use current active shelf
            filterCategory: overrideFilters.filterCategory !== undefined
                            ? overrideFilters.filterCategory
                            : document.querySelector('#grimoire-shelves-workshop .grimoire-shelf.active-shelf')?.dataset.categoryId || "All"
        };
        // Combine base filters with any overrides passed in
        const finalFilters = { ...currentFilters, ...overrideFilters };
        console.log("Refreshing Grimoire with filters:", finalFilters);
        displayGrimoire(finalFilters);
    }
}

/**
 * Renders a single concept card element.
 * @param {object} concept - The concept data object from `concepts`.
 * @param {string} context - Where the card is being rendered ('grimoire', 'popup-result').
 * @param {object | null} discoveredData - The corresponding entry from `State.getDiscoveredConcepts()` if context is 'grimoire'.
 * @returns {HTMLElement | null} The rendered card element or null on error.
 */
export function renderCard(concept, context = 'grimoire', discoveredData = null) {
    if (!concept || typeof concept.id === 'undefined') {
        console.warn("renderCard called with invalid concept:", concept);
        const eDiv = document.createElement('div');
        eDiv.textContent = "Error: Invalid Concept Data";
        eDiv.classList.add('concept-card', 'error');
        return eDiv;
    }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card', `rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = (context === 'grimoire') ? `View Details: ${concept.name}` : concept.name;

    // Determine state based on context and discoveredData
    const isDiscovered = context === 'grimoire' && !!discoveredData;
    const isFocused = isDiscovered && State.getFocusedConcepts().has(concept.id);
    const hasNewLore = isDiscovered && (discoveredData?.newLoreAvailable || false);
    const userCategory = isDiscovered ? (discoveredData?.userCategory || 'uncategorized') : 'uncategorized';

    // Visual Content (Image or Placeholder)
    let visualContentHTML = '';
    if (context === 'grimoire') { // Only show full visual in grimoire
        if (concept.visualHandle) {
            const handle = concept.visualHandle;
            const fileName = handle.includes('.') ? handle : `${handle}${Config.UNLOCKED_ART_EXTENSION || '.jpg'}`;
            const imageUrl = `placeholder_art/${fileName}`;
            // Use hidden img for error handling, rely on CSS for background display if needed
            visualContentHTML = `
                <img src="${imageUrl}" alt="${concept.name} Art" class="card-art-image" loading="lazy" onerror="handleImageError(this)">
                <i class="fas fa-image card-visual-placeholder" style="display: none;" title="Art Placeholder (Load Failed)"></i>`;
        } else {
            // Default placeholder if no visual handle
            visualContentHTML = `<i class="fas fa-image card-visual-placeholder" title="Visual Placeholder"></i>`;
        }
        visualContentHTML = `<div class="card-visual">${visualContentHTML}</div>`;
    }

    // Header Stamps (Focus, Lore)
    const focusStampHTML = (context === 'grimoire' && isFocused) ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const loreStampHTML = (context === 'grimoire' && hasNewLore) ? '<span class="lore-indicator" title="New Lore Unlocked!"><i class="fas fa-scroll"></i></span>' : '';
    const cardStampsHTML = `<span class="card-stamps">${focusStampHTML}${loreStampHTML}</span>`;

    // Rarity Indicator
    let rarityText = concept.rarity ? concept.rarity.charAt(0).toUpperCase() + concept.rarity.slice(1) : 'Common';
    let rarityClass = `rarity-indicator-${concept.rarity || 'common'}`;
    const rarityIndicatorHTML = `<span class="card-rarity ${rarityClass}" title="Rarity: ${rarityText}">${rarityText}</span>`;

    // Primary Element Display
    let primaryElementHTML = '<small class="no-element">No Primary Element</small>';
    if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement]) {
        const primaryKey = concept.primaryElement; // 'A', 'I', etc.
        const elementNameKey = elementKeyToFullName[primaryKey]; // "Attraction", etc.
        const elementData = elementDetails[elementNameKey] || {};
        const descriptiveName = elementData.name || elementNameKey;
        const color = Utils.getElementColor(elementNameKey);
        const icon = Utils.getElementIcon(elementNameKey);
        const nameShort = Utils.getElementShortName(descriptiveName);
        primaryElementHTML = `<span class="primary-element-display" style="color: ${color}; border-color: ${Utils.hexToRgba(color, 0.5)}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="Primary Element: ${descriptiveName}"><i class="${icon}"></i> ${nameShort}</span>`;
    }

    // Action Buttons (Focus, Sell) - Only for Grimoire context
    let actionButtonsHTML = '';
    if (context === 'grimoire') {
        actionButtonsHTML += '<div class="card-actions">';
        let hasActions = false;
        const showSellButtonOnCard = isDiscovered;
        const showFocusButtonOnCard = isDiscovered;

        // Sell Button
        if (showSellButtonOnCard) {
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
            const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            actionButtonsHTML += `<button class="button tiny-button secondary-button sell-button card-sell-button btn" data-concept-id="${concept.id}" data-context="grimoire" title="Sell (${sellValue.toFixed(1)} Insight)"><i class="fas fa-dollar-sign"></i></button>`;
            hasActions = true;
        }

        // Focus Button
        if (showFocusButtonOnCard) {
            const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
            const buttonClass = isFocused ? 'marked' : '';
            const buttonIcon = isFocused ? 'fa-star' : 'fa-regular fa-star';
            const buttonTitle = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove Focus' : 'Mark as Focus');
            actionButtonsHTML += `<button class="button tiny-button card-focus-button ${buttonClass} btn" data-concept-id="${concept.id}" title="${buttonTitle}" ${slotsFull ? 'disabled' : ''}><i class="fas ${buttonIcon}"></i></button>`;
            hasActions = true;
        }

        actionButtonsHTML += '</div>';
        if (!hasActions) actionButtonsHTML = ''; // Clear div if no actions added
    }

     // Assemble Card HTML
     cardDiv.innerHTML = `
         <div class="card-header">
             <span class="card-type-icon-area"><i class="${Utils.getCardTypeIcon(concept.cardType)}" title="${concept.cardType}"></i></span>
             <span class="card-name">${concept.name}</span>
             <span class="card-header-right">
                 ${rarityIndicatorHTML}
                 ${cardStampsHTML}
             </span>
         </div>
         ${visualContentHTML}
         <div class="card-footer">
             <div class="card-affinities">${primaryElementHTML}</div>
             <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
             ${actionButtonsHTML}
         </div>`;

    // Add category class if relevant
    if (context === 'grimoire') {
        cardDiv.classList.add(`category-${userCategory}`);
    }

    // Add specific class for popup results context if needed
    if (context === 'popup-result') {
         cardDiv.classList.add('popup-result-card');
         // Adjust styles slightly for popup context if needed via CSS or inline
         cardDiv.querySelector('.card-footer').style.paddingBottom = '0px';
         cardDiv.querySelector('.card-brief-desc').style.display = 'block';
         cardDiv.querySelector('.card-brief-desc').style.minHeight = 'calc(1.4em * 1)';
         cardDiv.querySelector('.card-affinities').style.marginBottom = '5px';
    }

    return cardDiv;
}

// --- Concept Detail Popup UI ---

/** Shows the detailed popup for a given concept ID. */
export function showConceptDetailPopup(conceptId) {
     console.log(`--- UI: Opening Popup for Concept ID: ${conceptId} ---`);
     const conceptData = concepts.find(c => c.id === conceptId);
     if (!conceptData) { console.error("Concept data missing for ID:", conceptId); showTemporaryMessage("Error: Concept not found.", 3000); return; }

     const discoveredData = State.getDiscoveredConceptData(conceptId); // { concept, notes, etc. } or undefined
     const inGrimoire = !!discoveredData;
     GameLogic.setCurrentPopupConcept(conceptId); // Store ID for actions

     // --- Populate Header ---
     if (popupConceptName) popupConceptName.textContent = conceptData.name;
     let subHeaderText = conceptData.cardType || "Unknown Type";
     let primaryElementIconHTML = '';
     // Add primary element info to subheader
     if (conceptData.primaryElement && elementKeyToFullName?.[conceptData.primaryElement]) {
          const primaryKey = conceptData.primaryElement;
          const elementNameKey = elementKeyToFullName[primaryKey];
          const elementData = elementDetails[elementNameKey] || {};
          const fullName = elementData.name || elementNameKey;
          const primaryColor = Utils.getElementColor(elementNameKey);
          const primaryIcon = Utils.getElementIcon(elementNameKey);
          const primaryNameDisplay = Utils.getElementShortName(fullName);
          subHeaderText += ` | Element: ${primaryNameDisplay}`;
          primaryElementIconHTML = `<i class="${primaryIcon} popup-element-icon" style="color: ${primaryColor}; margin-left: 8px;" title="Primary Element: ${fullName}"></i>`;
     }
     if (popupConceptType) popupConceptType.innerHTML = subHeaderText + primaryElementIconHTML;
     if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;

     // --- Populate Visual Area ---
     if (popupVisualContainer) {
         popupVisualContainer.innerHTML = ''; // Clear previous
         const placeholderIcon = `<i class="fas fa-image card-visual-placeholder" style="display: flex;" title="Art Placeholder"></i>`; // Default placeholder
         if (conceptData.visualHandle) {
             const handle = conceptData.visualHandle;
             const fileName = handle.includes('.') ? handle : `${handle}${Config.UNLOCKED_ART_EXTENSION || '.jpg'}`;
             const imageUrl = `placeholder_art/${fileName}`;
             // Create img tag with error handler
             const content = document.createElement('img');
             content.src = imageUrl;
             content.alt = `${conceptData.name} Art`;
             content.classList.add('card-art-image');
             content.onerror = function() { handleImageError(this); }; // Call global error handler
             // Add placeholder initially, image will overlay it if loaded successfully
             popupVisualContainer.innerHTML = placeholderIcon;
             popupVisualContainer.appendChild(content);
         } else {
             popupVisualContainer.innerHTML = placeholderIcon; // Show placeholder if no handle
         }
     }

     // --- Populate Info Area ---
     if (popupBriefDescription) popupBriefDescription.textContent = conceptData.briefDescription || '';
     if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No detailed description available.";

     // Calculate and Display Resonance Gauge
     const scores = State.getScores();
     const distance = Utils.euclideanDistance(scores, conceptData.elementScores || {}, conceptData.name); // Pass empty object if scores missing
     displayPopupResonanceGauge(distance);

     // Display Related Concepts Tags
     displayPopupRelatedConceptsTags(conceptData);

     // --- Populate Collapsible Areas ---

     // Recipe Comparison
     if(popupRecipeDetailsSection) {
          displayPopupRecipeComparison(conceptData, scores); // Pass current scores
     }

     // Lore Section
     if (popupLoreSection && popupLoreContent) {
         const hasLoreDefined = conceptData.lore && Array.isArray(conceptData.lore) && conceptData.lore.length > 0;
         // Show section only if in Grimoire AND lore is defined
         popupLoreSection.classList.toggle('hidden', !inGrimoire || !hasLoreDefined);
         popupLoreContent.innerHTML = ''; // Clear previous lore

         if (inGrimoire && hasLoreDefined) {
             const unlockedLevel = State.getUnlockedLoreLevel(conceptId);
             conceptData.lore.sort((a, b) => a.level - b.level).forEach((loreEntry, index) => {
                 // Basic validation of lore entry structure
                 if (!loreEntry || typeof loreEntry.level !== 'number' || typeof loreEntry.text !== 'string') {
                     console.warn(`Invalid lore entry at index ${index} for concept ${conceptId}. Skipping.`);
                     return;
                 }
                 const loreDiv = document.createElement('div');
                 loreDiv.classList.add('lore-entry');
                 loreDiv.dataset.loreLevel = loreEntry.level;

                 if (loreEntry.level <= unlockedLevel) {
                     // Display unlocked lore
                     loreDiv.innerHTML = `<h5 class="lore-level-title">Level ${loreEntry.level} Insight:</h5><p class="lore-text">${loreEntry.text}</p>`;
                 } else {
                     // Display locked lore with unlock button
                     loreDiv.innerHTML = `<h5 class="lore-level-title">Level ${loreEntry.level} Insight: [Locked]</h5>`;
                     const cost = Config.LORE_UNLOCK_COSTS[`level${loreEntry.level}`] || 999; // Get cost from config
                     const currentInsight = State.getInsight();
                     const canAfford = currentInsight >= cost;
                     const unlockButton = document.createElement('button');
                     unlockButton.className = 'button tiny-button unlock-lore-button btn';
                     unlockButton.dataset.conceptId = conceptId;
                     unlockButton.dataset.loreLevel = loreEntry.level;
                     unlockButton.dataset.cost = cost;
                     unlockButton.title = canAfford ? `Unlock for ${cost} Insight` : `Requires ${cost} Insight`;
                     unlockButton.disabled = !canAfford;
                     unlockButton.innerHTML = `Unlock (${cost} <i class="fas fa-brain insight-icon"></i>)`;
                     loreDiv.appendChild(unlockButton);
                 }
                 popupLoreContent.appendChild(loreDiv);
                 // Add separator except after the last entry
                 if (index < conceptData.lore.length - 1) {
                     popupLoreContent.appendChild(document.createElement('hr'));
                 }
             });
             // Auto-open lore section if new lore was available
             popupLoreSection.open = (discoveredData?.newLoreAvailable) || false;
         } else if (inGrimoire && !hasLoreDefined) {
              popupLoreContent.innerHTML = '<p><i>No specific lore recorded for this concept.</i></p>';
         }

         // Mark lore as seen if it was newly available
         if (inGrimoire && discoveredData?.newLoreAvailable) {
             State.markLoreAsSeen(conceptId); // Update state (saves)
             // Remove indicator from card in Grimoire grid if visible
             const cardElemIndicator = document.querySelector(`#grimoire-grid-workshop .concept-card[data-concept-id="${conceptId}"] .lore-indicator`);
             cardElemIndicator?.remove();
             console.log(`UI: Marked lore seen for concept ${conceptId}.`);
         }
     } else { console.error("Lore UI elements (#popupLoreSection, #popupLoreContent) missing!"); }

     // Notes Section
     const showNotes = inGrimoire;
     if (myNotesSection) {
         myNotesSection.classList.toggle('hidden', !showNotes);
         if (showNotes && discoveredData) {
             if(myNotesTextarea) myNotesTextarea.value = discoveredData.notes || "";
             if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; // Clear previous status
             myNotesSection.open = false; // Keep notes closed by default
         }
     }

     // --- Update Action Buttons ---
     updateGrimoireButtonStatus(conceptId); // Show/hide Add to Grimoire button
     updateFocusButtonStatus(conceptId); // Update Focus button state
     updatePopupSellButton(conceptId, conceptData, inGrimoire); // Add/update Sell button

     // --- Show Popup ---
     if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
     // Show overlay if onboarding isn't active
     const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');
     if (popupOverlay && !onboardingActive) {
         popupOverlay.classList.remove('hidden');
     }
     console.log(`--- UI: Finished Opening Popup for Concept ID: ${conceptId} ---`);
}

/** Displays the resonance gauge in the concept detail popup. */
function displayPopupResonanceGauge(distance) {
    // Use specific IDs for gauge elements
    const gaugeBar = getElement('popupResonanceGaugeBar');
    const gaugeLabel = getElement('popupResonanceGaugeLabel');
    const gaugeText = getElement('popupResonanceGaugeText');

    if (!gaugeBar || !gaugeLabel || !gaugeText) { console.error("Resonance gauge elements not found!"); return; }

    let resonanceLabel, resonanceClass, message, widthPercent;

    if (distance === Infinity || isNaN(distance)) {
        // Handle error case
        resonanceLabel = "N/A";
        resonanceClass = "resonance-error"; // Add specific class for error styling
        message = "(Score comparison error)";
        widthPercent = 0;
    } else if (distance < 2.5) {
        resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strong alignment."; widthPercent = 95; // Adjust width mapping
    } else if (distance < 4.0) {
        resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares significant common ground."; widthPercent = 75;
    } else if (distance < 6.0) {
        resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities, some differences."; widthPercent = 50;
    } else if (distance <= Config.DISSONANCE_THRESHOLD) {
        resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence."; widthPercent = 25;
    } else { // Dissonant
        resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significant divergence. Reflection advised."; widthPercent = 10;
    }

    // Apply styles and text
    widthPercent = Math.max(5, Math.min(95, widthPercent)); // Ensure width is within bounds
    gaugeBar.style.width = `${widthPercent}%`;
    gaugeBar.className = 'popup-resonance-gauge-bar'; // Reset classes
    if (resonanceClass) gaugeBar.classList.add(resonanceClass); // Add specific class

    gaugeLabel.textContent = resonanceLabel;
    gaugeLabel.className = 'popup-resonance-gauge-label'; // Reset classes
    if (resonanceClass) gaugeLabel.classList.add(resonanceClass);

    gaugeText.textContent = `${message} (Dist: ${distance === Infinity || isNaN(distance) ? 'N/A' : distance.toFixed(1)})`;
}

/** Displays related concept tags in the concept detail popup. */
function displayPopupRelatedConceptsTags(conceptData) {
    const tagsContainer = getElement('popupRelatedConceptsTags');
    if (!tagsContainer) { console.error("Related concepts tags container #popupRelatedConceptsTags not found!"); return; }
    tagsContainer.innerHTML = ''; // Clear previous

    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
        let foundCount = 0;
        conceptData.relatedIds.forEach(relatedId => {
            const relatedConcept = concepts.find(c => c.id === relatedId);
            if (relatedConcept) {
                const tag = document.createElement('span');
                tag.textContent = relatedConcept.name;
                tag.classList.add('related-concept-tag');
                tag.title = `Related: ${relatedConcept.name}.`;

                // Make tag clickable if the related concept is discovered
                if (State.getDiscoveredConcepts().has(relatedId)) {
                    tag.style.cursor = 'pointer';
                    tag.style.textDecoration = 'underline';
                    tag.title += ' Click to view.';
                    tag.addEventListener('click', () => {
                        hidePopups(); // Close current popup
                        // Use setTimeout to allow current popup to close before opening new one
                        setTimeout(() => showConceptDetailPopup(relatedId), 50);
                    });
                } else {
                    tag.style.opacity = '0.7'; // Dim undiscovered tags
                    tag.title += ' (Not Discovered)';
                }
                tagsContainer.appendChild(tag);
                foundCount++;
            } else {
                console.warn(`Related concept ID ${relatedId} referenced by concept ${conceptData.id} (${conceptData.name}) not found in data.js.`);
            }
        });
        if (foundCount === 0) {
            tagsContainer.innerHTML = '<p><i>None specified or related concepts not found in data.</i></p>';
        }
    } else {
        tagsContainer.innerHTML = '<p><i>None specified.</i></p>';
    }
}

/** Displays the recipe comparison section in the concept detail popup. */
export function displayPopupRecipeComparison(conceptData, userCompScores) {
    const detailsElement = getElement('popupRecipeDetails'); // The main <details> tag
    const conceptProfileContainer = getElement('popupConceptProfile');
    const userProfileContainer = getElement('popupUserComparisonProfile');
    const highlightsContainer = getElement('popupComparisonHighlights');

    if (!conceptProfileContainer || !userProfileContainer || !highlightsContainer || !detailsElement) {
        console.warn("Popup recipe comparison elements not found!");
        if(detailsElement) detailsElement.style.display = 'none'; // Hide section if incomplete
        return;
    }

    // Ensure section is visible and clear previous content
    detailsElement.style.display = '';
    conceptProfileContainer.innerHTML = '';
    userProfileContainer.innerHTML = '';
    highlightsContainer.innerHTML = '';

    let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p><ul>';
    let hasHighlights = false;
    const conceptScores = conceptData.elementScores || {}; // Use empty object if scores missing

    // Iterate through all 7 elements
    elementNames.forEach(elNameKey => { // "Attraction", ...
        const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elNameKey); // 'A', ...
        if (!key) return; // Skip if key mapping fails

        const elementData = elementDetails[elNameKey] || {};
        const fullName = elementData.name || elNameKey;
        const elementNameShort = Utils.getElementShortName(fullName);
        const color = Utils.getElementColor(elNameKey);

        const conceptScore = conceptScores[key];
        const userScore = userCompScores[key];

        // Validate scores
        const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore);
        const userScoreValid = typeof userScore === 'number' && !isNaN(userScore);

        const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?';
        const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';
        const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A';
        const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A';
        const conceptBarWidth = conceptScoreValid ? Math.max(0, Math.min(100, conceptScore * 10)) : 0;
        const userBarWidth = userScoreValid ? Math.max(0, Math.min(100, userScore * 10)) : 0;

        // Render score bars for both profiles
        conceptProfileContainer.innerHTML += `<div class="score-entry"><strong title="${fullName}">${elementNameShort}:</strong> <span>${conceptDisplay}</span> <div class="score-bar-container" title="${conceptLabel}"><div class="score-bar" style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`;
        userProfileContainer.innerHTML += `<div class="score-entry"><strong title="${fullName}">${elementNameShort}:</strong> <span>${userDisplay}</span> <div class="score-bar-container" title="${userLabel}"><div class="score-bar" style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`;

        // Add highlights based on score comparison
        if (conceptScoreValid && userScoreValid) {
            const diff = Math.abs(conceptScore - userScore);
            if (conceptScore >= 7 && userScore >= 7) {
                highlightsHTML += `<li><strong class="match" style="color: var(--success-color);">Strong Alignment</strong> in ${elementNameShort} (Both ${conceptLabel}/${userLabel})</li>`; hasHighlights = true;
            } else if (conceptScore <= 3 && userScore <= 3) {
                highlightsHTML += `<li><strong class="match" style="color: var(--info-color);">Shared Low Emphasis</strong> in ${elementNameShort} (Both ${conceptLabel}/${userLabel})</li>`; hasHighlights = true;
            } else if (diff >= 4) { // Threshold for notable difference
                highlightsHTML += `<li><strong class="mismatch" style="color: var(--warning-color);">Notable Difference</strong> in ${elementNameShort} (Concept: ${conceptLabel}, You: ${userLabel})</li>`; hasHighlights = true;
            }
        }
    });

    highlightsHTML += '</ul>'; // Close the highlights list

    if (!hasHighlights) {
        highlightsHTML = '<p><em>No strong alignments or major differences identified based on current scores.</em></p>';
    }
    highlightsContainer.innerHTML = highlightsHTML;

    // Ensure both details sections are closed by default
    detailsElement.open = false;
    const nestedDetails = detailsElement.querySelector('.element-details');
    if(nestedDetails) nestedDetails.open = false;
}

/** Updates the 'Add to Grimoire' button state in the detail popup. */
export function updateGrimoireButtonStatus(conceptId) {
    if (!addToGrimoireButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    addToGrimoireButton.classList.toggle('hidden', isDiscovered);
    // Reset button state if it becomes visible again
    if (!isDiscovered) {
        addToGrimoireButton.disabled = false;
        addToGrimoireButton.textContent = "Add to Grimoire";
        addToGrimoireButton.classList.remove('added'); // Remove any visual 'added' state
    }
}

/** Updates the 'Mark as Focus' button state in the detail popup. */
export function updateFocusButtonStatus(conceptId) {
    const localMarkAsFocusButton = getElement('markAsFocusButton');
    if (!localMarkAsFocusButton) return;

    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const slotsAvailable = State.getFocusedConcepts().size < State.getFocusSlots();

    // Show button only if discovered
    localMarkAsFocusButton.classList.toggle('hidden', !isDiscovered);

    if (isDiscovered) {
        const canFocus = isFocused || slotsAvailable; // Can interact if already focused OR slots are free
        localMarkAsFocusButton.disabled = !canFocus;
        localMarkAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus";
        localMarkAsFocusButton.classList.toggle('marked', isFocused); // Visual state for focus

        // Set title based on state
        if (!canFocus) { // Only happens if not focused AND slots full
            localMarkAsFocusButton.title = `Focus slots full (${State.getFocusSlots()})`;
        } else {
            localMarkAsFocusButton.title = isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts";
        }
    }
}

/** Adds or updates the 'Sell' button in the concept detail popup actions. */
export function updatePopupSellButton(conceptId, conceptData, inGrimoire) {
    const popupActions = conceptDetailPopup?.querySelector('.popup-actions');
    if (!popupActions || !conceptData) return;

    // Remove existing sell button first to prevent duplicates
    popupActions.querySelector('.popup-sell-button')?.remove();

    if (inGrimoire) { // Only show sell button if the concept is in the Grimoire
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[conceptData.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        const sellButton = document.createElement('button');
        sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button', 'popup-sell-button', 'btn');
        sellButton.textContent = `Sell (${sellValue.toFixed(1)})`;
        sellButton.innerHTML += ` <i class="fas fa-brain insight-icon"></i>`;
        sellButton.dataset.conceptId = conceptId;
        sellButton.dataset.context = 'detailPopup'; // Indicate context for potential logic differences
        sellButton.title = `Sell from Grimoire for ${sellValue.toFixed(1)} Insight.`;

        // Insert after the focus button if visible, otherwise append
        const localMarkAsFocusButton = popupActions.querySelector('#markAsFocusButton');
        if (localMarkAsFocusButton && !localMarkAsFocusButton.classList.contains('hidden')) {
             localMarkAsFocusButton.insertAdjacentElement('afterend', sellButton);
        } else {
             popupActions.appendChild(sellButton); // Append if focus button hidden
        }
    }
}


// --- Research Popup ---

/** Displays the research results popup with discovered concepts. */
export function displayResearchResults({ concepts: foundConcepts = [], duplicateInsightGain = 0 }) {
    if (!researchResultsPopup || !researchPopupContent || !confirmResearchChoicesButton) {
        console.error("Research results popup elements missing!"); return;
    }
    researchPopupContent.innerHTML = ''; // Clear previous results
    let allProcessedInitially = true; // Assume all processed unless new cards found
    let hasNewCards = foundConcepts.length > 0;

    if (hasNewCards) {
        allProcessedInitially = false; // New cards need processing
        foundConcepts.forEach(concept => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('research-result-item');
            itemDiv.dataset.conceptId = concept.id;
            itemDiv.dataset.processed = 'false'; // Mark as initially unprocessed
            itemDiv.dataset.choiceMade = 'none'; // Track user choice

            // Render the card in the 'popup-result' context
            const cardElement = renderCard(concept, 'popup-result');
            if (cardElement) itemDiv.appendChild(cardElement);

            // Add action buttons (Keep/Sell)
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('card-actions');
            const discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
            const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            actionsDiv.innerHTML = `
                <button class="button tiny-button keep-button btn" data-concept-id="${concept.id}" data-action="keep" title="Add to Grimoire Library">Keep</button>
                <button class="button tiny-button sell-button btn" data-concept-id="${concept.id}" data-action="sell" title="Sell for ${sellValue.toFixed(1)} Insight">Sell (${sellValue.toFixed(1)} <i class="fas fa-brain insight-icon"></i>)</button>
                <span class="action-feedback" aria-live="polite"></span>`; // For feedback messages
            itemDiv.appendChild(actionsDiv);

            researchPopupContent.appendChild(itemDiv);
        });
    }

    // Add message for duplicate insight gain
    if (duplicateInsightGain > 0) {
        researchPopupContent.innerHTML += `<p class="duplicate-insight-info">Echoes of previous discoveries... +${duplicateInsightGain.toFixed(1)} <i class="fas fa-brain insight-icon"></i> Insight gained.</p>`;
    }

    // Handle case where nothing was found at all
    if (!hasNewCards && duplicateInsightGain <= 0) {
        researchPopupContent.innerHTML = '<p>The currents of inspiration were quiet this time. No new concepts revealed.</p>';
        allProcessedInitially = true; // Nothing to process
    }

    // Set initial state of confirm/close buttons
    confirmResearchChoicesButton.disabled = !allProcessedInitially;
    confirmResearchChoicesButton.classList.toggle('hidden', !hasNewCards); // Hide confirm if no cards
    closeResearchResultsPopupButton.disabled = !allProcessedInitially;
    closeResearchResultsPopupButton.title = allProcessedInitially ? "Close" : "Make a choice for all concepts first";
    researchPopupStatus.textContent = allProcessedInitially ? 'All choices confirmed.' : 'Choose an action for each finding above.';

    // Show the popup
    researchResultsPopup.classList.remove('hidden');
    const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');
    if (popupOverlay && !onboardingActive) { popupOverlay.classList.remove('hidden'); }
}

/** Updates the UI state of a single item in the research results popup after an action. */
export function handleResearchPopupAction(conceptId, action) { // action = 'kept', 'sold', 'pending_dissonance', 'error_adding', etc.
    const item = researchPopupContent?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
    if (!item) { console.warn(`Could not find research result item for concept ${conceptId} to update UI.`); return; }

    const feedbackSpan = item.querySelector('.action-feedback');
    const keepButton = item.querySelector('button[data-action="keep"]');
    const sellButton = item.querySelector('button[data-action="sell"]');

    // Disable buttons and mark as processed (unless pending dissonance)
    if (keepButton) keepButton.disabled = true;
    if (sellButton) sellButton.disabled = true;
    if (action !== 'pending_dissonance') {
        item.dataset.processed = 'true';
    } else {
        item.dataset.processed = 'false'; // Keep as unprocessed if pending reflection
    }
    item.dataset.choiceMade = action; // Store the choice/status

    // Update feedback text and style
    if (feedbackSpan) {
        feedbackSpan.textContent = ''; // Clear previous
        feedbackSpan.className = 'action-feedback'; // Reset style classes
        switch(action) {
            case 'kept': feedbackSpan.textContent = 'Added!'; feedbackSpan.classList.add('feedback-success'); break;
            case 'kept_after_dissonance': feedbackSpan.textContent = 'Added.'; feedbackSpan.classList.add('feedback-success'); break;
            case 'sold': feedbackSpan.textContent = 'Sold!'; feedbackSpan.classList.add('feedback-warning'); break;
            case 'pending_dissonance': feedbackSpan.textContent = 'Reflection Needed...'; feedbackSpan.classList.add('feedback-info'); break;
            case 'error_adding': feedbackSpan.textContent = 'Add Error!'; feedbackSpan.classList.add('feedback-error'); break;
            case 'error_unknown': feedbackSpan.textContent = 'Error!'; feedbackSpan.classList.add('feedback-error'); break;
            case 'kept_after_dissonance_fail': feedbackSpan.textContent = 'Added (Reflection Error)'; feedbackSpan.classList.add('feedback-success'); break; // Indicate success but with issue
            default: break; // No feedback for 'none' or unknown actions
        }
    }

    // Check if all items are now processed
    const allItems = researchPopupContent?.querySelectorAll('.research-result-item');
    const allProcessed = Array.from(allItems).every(i => i.dataset.processed === 'true');

    // Update confirm/close button states
    if (confirmResearchChoicesButton) confirmResearchChoicesButton.disabled = !allProcessed;
    if (closeResearchResultsPopupButton) {
         closeResearchResultsPopupButton.disabled = !allProcessed;
         closeResearchResultsPopupButton.title = allProcessed ? "Close" : "Make a choice for all concepts first";
    }
    if (researchPopupStatus) {
         researchPopupStatus.textContent = allProcessed ? 'All choices confirmed.' : 'Choose an action for each finding.';
    }
}


// --- Reflection Modal UI ---

/** Displays the reflection modal with the given prompt data. */
export function displayReflectionPrompt(promptData, context) {
    if (!reflectionModal || !promptData || !promptData.prompt) {
        console.error("Reflection modal or prompt data/text missing.", promptData);
        // Handle failure case, e.g., if dissonance reflection couldn't be shown
        if (context === 'Dissonance') {
            const conceptId = GameLogic.getCurrentPopupConceptId(); // Should be set during trigger
            if (conceptId !== null) {
                console.warn("Reflection prompt missing for Dissonance, attempting failsafe add.");
                if (typeof GameLogic.addConceptToGrimoireInternal === 'function') {
                    // Add the concept directly and update research popup UI if applicable
                    if (GameLogic.addConceptToGrimoireInternal(conceptId, 'dissonance_reflection_failed')) {
                         UI.handleResearchPopupAction(conceptId, 'kept_after_dissonance_fail');
                    } else {
                         UI.handleResearchPopupAction(conceptId, 'error_adding');
                    }
                    hidePopups();
                    showTemporaryMessage("Reflection unavailable, concept added directly.", 3500);
                } else {
                    console.error("CRITICAL: Cannot add concept - addConceptToGrimoireInternal missing!");
                    showTemporaryMessage("Critical Error: Cannot process reflection.", 4000);
                }
            } else {
                showTemporaryMessage("Error: Could not display reflection or find target concept.", 3000);
            }
        } else {
             showTemporaryMessage("Error: Could not display reflection prompt.", 3000);
        }
        return; // Stop execution if modal or prompt invalid
    }

    const { title, category, prompt, showNudge, reward } = promptData;

    // Populate modal content
    if (reflectionModalTitle) reflectionModalTitle.textContent = title || "Moment for Reflection";
    if (reflectionElement) reflectionElement.textContent = category || "General"; // Display category label
    if (reflectionPromptText) reflectionPromptText.innerHTML = prompt.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Format bold text
    if (reflectionCheckbox) reflectionCheckbox.checked = false; // Ensure checkbox is unchecked initially

    // Show/hide score nudge option
    if (scoreNudgeCheckbox && scoreNudgeLabel) {
        scoreNudgeCheckbox.checked = false; // Default unchecked
        scoreNudgeCheckbox.classList.toggle('hidden', !showNudge);
        scoreNudgeLabel.classList.toggle('hidden', !showNudge);
    }

    // Update confirm button state and reward display
    if (confirmReflectionButton) confirmReflectionButton.disabled = true; // Disabled until checkbox checked
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)}`;

    // Show the modal
    reflectionModal.classList.remove('hidden');
    // Show overlay if onboarding isn't active
    const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');
    if (popupOverlay && !onboardingActive) {
        popupOverlay.classList.remove('hidden');
    }
}


// --- Integrated Element Deep Dive UI (Inside Persona Screen Accordion) ---

/** Renders the deep dive content for a specific element within its accordion. */
export function displayElementDeepDive(elementKey, targetContainerElement) {
    if (!targetContainerElement) {
        // Attempt to find container again if not provided (e.g., on initial persona screen load)
        targetContainerElement = personaElementDetailsDiv?.querySelector(`.element-deep-dive-container[data-element-key="${elementKey}"]`);
        if (!targetContainerElement) {
            console.error(`UI: Could not find target deep dive container for element ${elementKey}`);
            return;
        }
    }

    // Map single letter key ('A') to name key ('Attraction') for data lookup
    const elementNameKey = elementKeyToFullName[elementKey];
    if (!elementNameKey) {
        console.warn(`UI displayElementDeepDive: Could not find element name key for key: ${elementKey}`);
        targetContainerElement.innerHTML = '<p><i>Error loading deep dive data (invalid key).</i></p>';
        return;
    }

    const deepDiveData = elementDeepDive[elementNameKey] || [];
    const unlockedLevels = State.getState().unlockedDeepDiveLevels;
    const currentLevel = unlockedLevels[elementKey] || 0; // Default to 0 if not yet unlocked
    const elementData = elementDetails[elementNameKey] || {};
    const fullName = elementData.name || elementNameKey;
    const insight = State.getInsight(); // Get current insight for cost check

    targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${Utils.getElementShortName(fullName)} Insights</h5>`; // Section title

    if (deepDiveData.length === 0) {
        targetContainerElement.innerHTML += '<p><i>No deep dive content available for this element yet.</i></p>';
        return;
    }

    let displayedContent = false;
    // Display unlocked levels
    deepDiveData.sort((a,b) => a.level - b.level).forEach(levelData => {
        if (levelData.level <= currentLevel) {
            targetContainerElement.innerHTML += `
                <div class="library-level">
                    <h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5>
                    <div class="level-content">${levelData.content || 'Content missing.'}</div>
                </div>
                <hr class="popup-hr">`; // Use popup-hr for consistency
            displayedContent = true;
        }
    });

    // Show placeholder if no levels are unlocked yet
    if (!displayedContent && currentLevel === 0) {
        targetContainerElement.innerHTML += '<p><i>Unlock the first level to begin exploring deeper insights.</i></p>';
    }

    // Display unlock button for the *next* level if available
    const nextLevel = currentLevel + 1;
    const nextLevelData = deepDiveData.find(l => l.level === nextLevel);
    if (nextLevelData) {
        const cost = nextLevelData.insightCost || 0; // Get cost from data
        const canAfford = insight >= cost;
        const isDisabled = !canAfford;
        let buttonTitle = canAfford ? `Unlock for ${cost} Insight` : `Requires ${cost} Insight`;
        let errorMsgHTML = isDisabled ? `<p class='unlock-error'>(Insufficient Insight: ${insight.toFixed(1)}/${cost})</p>` : '';

        const buttonHTML = `
            <button
                class="button small-button unlock-button btn"
                data-element-key="${elementKey}"
                data-level="${nextLevelData.level}"
                ${isDisabled ? 'disabled' : ''}
                title="${buttonTitle.replace(/"/g, '&quot;')}"
            >
                Unlock (${cost} <i class="fas fa-brain insight-icon"></i>)
            </button>`;

        targetContainerElement.innerHTML += `
            <div class="library-unlock">
                <h5>Next: ${nextLevelData.title} (Level ${nextLevelData.level})</h5>
                ${buttonHTML}
                ${errorMsgHTML}
            </div>`;
    } else if (displayedContent) {
        // All levels unlocked for this element
        // Remove the last HR if it exists
        const lastHr = targetContainerElement.querySelector('hr.popup-hr:last-of-type');
        if (lastHr) lastHr.remove();
        targetContainerElement.innerHTML += '<p class="all-unlocked-message"><i>All insights unlocked for this element.</i></p>';
    }
}


// --- Repository UI ---

/** Populates the entire Repository screen content. */
export function displayRepositoryContent() {
    const showRepository = State.getState().questionnaireCompleted;
    if (repositoryScreen) repositoryScreen.classList.toggle('hidden', !showRepository);
    if (!showRepository) return; // Don't render if questionnaire incomplete

    // Ensure all target divs exist
    if (!repositoryFocusUnlocksDiv || !repositoryScenesDiv || !repositoryExperimentsDiv || !repositoryInsightsDiv || !milestonesDisplay || !dailyRitualsDisplayRepo) {
        console.error("One or more Repository list container elements are missing!");
        // Optionally display an error message within the repository screen
        if(repositoryScreen) repositoryScreen.innerHTML = "<h1>Repository</h1><p>Error: UI elements missing. Cannot display content.</p>";
        return;
    }
    console.log("UI: Displaying Repository Content");

    // Clear previous content
    repositoryFocusUnlocksDiv.innerHTML = '';
    repositoryScenesDiv.innerHTML = '';
    repositoryExperimentsDiv.innerHTML = '';
    repositoryInsightsDiv.innerHTML = '';
    // Milestones and Rituals are cleared within their display functions

    const repoItems = State.getRepositoryItems(); // { scenes: Set, experiments: Set, insights: Set }
    const unlockedFocusData = State.getUnlockedFocusItems(); // Set<unlockId>
    const attunement = State.getAttunement();
    const focused = State.getFocusedConcepts();
    const insight = State.getInsight();
    const scores = State.getScores();

    // 1. Focus-Driven Discoveries
    if (unlockedFocusData.size > 0) {
        unlockedFocusData.forEach(unlockId => {
            const unlockData = focusDrivenUnlocks.find(u => u.id === unlockId);
            if (unlockData?.unlocks) {
                const item = unlockData.unlocks; // The item that was unlocked
                const div = document.createElement('div');
                div.classList.add('repository-item', 'focus-unlock-item');
                let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`;
                if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`;
                // Add specific details based on item type
                if (item.type === 'insightFragment') {
                    const iData = elementalInsights.find(i => i.id === item.id);
                    itemHTML += `<p class="repo-insight-text"><em>"${iData?.text || item.text || "..."}"</em></p>`;
                } else if (item.type === 'scene' || item.type === 'experiment') {
                    itemHTML += `<p>View details in the relevant section below.</p>`;
                } else {
                    itemHTML += `<p>Unique reward or effect unlocked.</p>`; // Generic for other types
                }
                div.innerHTML = itemHTML;
                repositoryFocusUnlocksDiv.appendChild(div);
            } else { console.warn(`Data missing for focus unlock ID: ${unlockId}`); }
        });
    } else {
        repositoryFocusUnlocksDiv.innerHTML = '<p>Focus on synergistic Concepts on the Persona screen to unlock special items here.</p>';
    }

    // 2. Scene Blueprints
    if (repoItems.scenes.size > 0) {
        // Sort scenes alphabetically for consistent order
        const sortedSceneIds = Array.from(repoItems.scenes).sort();
        sortedSceneIds.forEach(sceneId => {
            const scene = sceneBlueprints.find(s => s.id === sceneId);
            if (scene) {
                const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
                const canAfford = insight >= cost;
                repositoryScenesDiv.appendChild(renderRepositoryItem(scene, 'scene', cost, canAfford));
            } else { console.warn(`Scene ID ${sceneId} from state not found in data.js.`); }
        });
    } else {
        repositoryScenesDiv.innerHTML = '<p>No Scene Blueprints discovered. Try using "Suggest Scenes" on the Persona screen or conducting Research.</p>';
    }

    // 3. Alchemical Experiments
    let experimentsDisplayed = 0;
    // Display all experiments, showing status (available, completed, locked)
    alchemicalExperiments.sort((a,b) => a.requiredAttunement - b.requiredAttunement).forEach(exp => {
        // Check base unlock requirement (attunement)
        const meetsAttunementReq = attunement[exp.requiredElement] >= exp.requiredAttunement;
        const alreadyCompleted = repoItems.experiments.has(exp.id);
        let canAttempt = true; // Assume possible until a requirement fails
        let unmetReqs = [];

        // Check secondary requirements ONLY if base attunement is met
        if (meetsAttunementReq && !alreadyCompleted) {
            // Check RF score requirements
            if (exp.requiredRoleFocusScore !== undefined && (scores.RF || 0) < exp.requiredRoleFocusScore) { canAttempt = false; unmetReqs.push(`RF Score ≥ ${exp.requiredRoleFocusScore}`); }
            if (exp.requiredRoleFocusScoreBelow !== undefined && (scores.RF || 0) >= exp.requiredRoleFocusScoreBelow) { canAttempt = false; unmetReqs.push(`RF Score < ${exp.requiredRoleFocusScoreBelow}`); }
            // Check focused concept requirements
            if (exp.requiredFocusConceptIds) { exp.requiredFocusConceptIds.forEach(reqId => { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? `Focus: ${c.name}` : `Focus: ID ${reqId}`); } }); }
            // Check focused concept type requirements
            if (exp.requiredFocusConceptTypes) { const dMap = State.getDiscoveredConcepts(); exp.requiredFocusConceptTypes.forEach(typeReq => { if (!Array.from(focused).some(fId => dMap.get(fId)?.concept?.cardType === typeReq)) { canAttempt = false; unmetReqs.push(`Focus Type: ${typeReq}`); } }); }
            // Check insight cost
            const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST;
            if (insight < cost) { canAttempt = false; unmetReqs.push(`${cost} Insight`); }
        } else if (!meetsAttunementReq) {
             // If base attunement isn't met, it cannot be attempted
             canAttempt = false;
             unmetReqs.push(`${exp.requiredAttunement} ${Utils.getElementShortName(elementKeyToFullName[exp.requiredElement])} Attun.`);
        }

        // Render the experiment item with its current status
        const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST;
        // Action possible only if attunement met, not completed, and all other reqs met
        const showAttemptButton = meetsAttunementReq && !alreadyCompleted;
        const canPerformAction = showAttemptButton && canAttempt;

        repositoryExperimentsDiv.appendChild(renderRepositoryItem(exp, 'experiment', cost, canPerformAction, alreadyCompleted, unmetReqs, showAttemptButton));
        experimentsDisplayed++; // Count displayed experiments regardless of status

    });
    if (experimentsDisplayed === 0) {
        repositoryExperimentsDiv.innerHTML = '<p>Increase Element Attunement via Research and Reflection to unlock potential Experiments.</p>';
    }

    // 4. Elemental Insights
    if (repoItems.insights.size > 0) {
        // Group insights by element for display
        const insightsByElement = {};
        elementNames.forEach(elNameKey => { // "Attraction", ...
            const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elNameKey); // 'A', ...
            if(key) insightsByElement[key] = []; // Initialize array for each element key
        });

        repoItems.insights.forEach(insightId => {
            const insightData = elementalInsights.find(i => i.id === insightId);
            if (insightData) {
                // Ensure the element exists in our grouping structure
                if (!insightsByElement[insightData.element]) {
                    insightsByElement[insightData.element] = [];
                    console.warn(`Insight ${insightId} belongs to element ${insightData.element} which wasn't pre-initialized.`);
                }
                insightsByElement[insightData.element].push(insightData);
            } else { console.warn(`Insight ID ${insightId} from state not found in data.js.`); }
        });

        let insightsHTML = '';
        // Iterate through elements in defined order to display grouped insights
        elementNames.forEach(elNameKey => {
            const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elNameKey);
            if (key && insightsByElement[key] && insightsByElement[key].length > 0) {
                const elementData = elementDetails[elNameKey] || {};
                const fullName = elementData.name || elNameKey;
                insightsHTML += `<h5>${Utils.getElementShortName(fullName)} Insights:</h5><ul>`;
                // Sort insights alphabetically within each element
                insightsByElement[key].sort((a, b) => a.text.localeCompare(b.text)).forEach(insight => {
                    insightsHTML += `<li>"${insight.text}"</li>`;
                });
                insightsHTML += `</ul>`;
            }
        });
        repositoryInsightsDiv.innerHTML = insightsHTML || '<p>No Elemental Insights collected.</p>'; // Fallback if grouping somehow fails
    } else {
        repositoryInsightsDiv.innerHTML = '<p>No Elemental Insights collected. Found occasionally during Research in the Workshop.</p>';
    }

    // 5. Milestones & Rituals (call dedicated functions)
    displayMilestones();
    displayDailyRituals();

    // Check repository content milestone after rendering
    GameLogic.updateMilestoneProgress('repositoryContents', null);
}

/**
 * Renders a single item (Scene or Experiment) for the Repository screen.
 * @param {object} item - The scene or experiment data object.
 * @param {'scene' | 'experiment'} type - The type of item.
 * @param {number} cost - The Insight cost for the action.
 * @param {boolean} canDoAction - Whether the primary action button should be enabled.
 * @param {boolean} [completed=false] - Whether the item is already completed (for experiments).
 * @param {string[]} [unmetReqs=[]] - List of unmet requirement descriptions (for experiments).
 * @param {boolean} [showActionButton=true] - Whether to show the action button at all.
 * @returns {HTMLElement} The rendered list item element.
 */
export function renderRepositoryItem(item, type, cost, canDoAction, completed = false, unmetReqs = [], showActionButton = true) {
    const div = document.createElement('div');
    div.classList.add('repository-item', `repo-item-${type}`);
    if (completed) div.classList.add('completed');

    let actionsHTML = '';
    let buttonDisabled = !canDoAction;
    let buttonTitle = '';
    let buttonText = '';
    let requirementText = '';

    // Customize button text and title based on type
    if (type === 'scene') {
        buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`;
        buttonTitle = canDoAction ? `Meditate on ${item.name}` : `Requires ${cost} Insight`;
        actionsHTML = `<button class="button small-button btn" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
    } else if (type === 'experiment') {
        buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`;
        if (completed) {
            buttonTitle = "Experiment Completed";
            buttonDisabled = true; // Always disabled if completed
            actionsHTML = `<span class="completed-text">(Completed)</span>`;
        } else if (!showActionButton) {
             // If base requirement (e.g., attunement) not met, don't show button
             actionsHTML = `<small class="req-missing">(Requires: ${unmetReqs.join(', ')})</small>`;
        } else {
             // Base req met, check secondary reqs
            requirementText = unmetReqs.length > 0 ? `<small class="req-missing">(Requires: ${unmetReqs.join(', ')})</small>` : '';
            buttonTitle = canDoAction ? `Attempt ${item.name}` : `Requirements not met: ${unmetReqs.join(', ')}`;
            actionsHTML = `<button class="button small-button btn" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button> ${requirementText}`;
        }
    }

    // Add requirements display for experiments
    let requirementDisplay = '';
    if (type === 'experiment' && item.requiredElement && item.requiredAttunement) {
         const elNameKey = elementKeyToFullName[item.requiredElement];
         requirementDisplay = `(Req: ${item.requiredAttunement} ${Utils.getElementShortName(elNameKey || item.requiredElement)} Attun.)`;
    }

    div.innerHTML = `
        <h4>${item.name} ${requirementDisplay}</h4>
        <p>${item.description || 'No description.'}</p>
        <div class="repo-actions">${actionsHTML}</div>`;
    return div;
}


// --- Milestones UI ---

/** Displays the list of achieved milestones in the Repository. */
export function displayMilestones() {
    if (!milestonesDisplay) {
        // Only log error if the repository screen is actually visible
        if (getElement('repositoryScreen')?.classList.contains('current')) {
            console.error("Milestones display list #milestonesDisplay not found!");
        }
        return;
    }
    milestonesDisplay.innerHTML = ''; // Clear previous list
    const achieved = State.getState().achievedMilestones; // Get Set of achieved IDs

    if (achieved.size === 0) {
        milestonesDisplay.innerHTML = '<li>No milestones achieved yet. Keep exploring!</li>';
        return;
    }

    // Filter and sort all milestones to show only achieved ones in a consistent order
    const allMilestonesSorted = [...milestones].sort((a, b) => a.id.localeCompare(b.id));
    const achievedMilestonesData = allMilestonesSorted.filter(m => achieved.has(m.id));

    achievedMilestonesData.forEach(milestone => {
        const li = document.createElement('li');
        li.classList.add('milestone-achieved');
        // Add checkmark icon for visual cue
        li.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success-color); margin-right: 8px;"></i> ${milestone.description}`;
        milestonesDisplay.appendChild(li);
    });
}


// --- Rituals Display (Targets Repository) ---

/** Displays the list of daily and focus rituals in the Repository. */
export function displayDailyRituals() {
     const targetDisplay = dailyRitualsDisplayRepo; // The <ul> element
     if (!targetDisplay) {
         if (getElement('repositoryScreen')?.classList.contains('current')) {
             console.error("Daily rituals display list #dailyRitualsDisplayRepo not found!");
         }
         return;
     }
     targetDisplay.innerHTML = ''; // Clear previous list

     const completed = State.getState().completedRituals.daily || {}; // Get daily completion status { id: {completed, progress} }
     const focused = State.getFocusedConcepts();
     const scores = State.getScores(); // For RF checks

     // Combine standard daily rituals with currently applicable focus rituals
     let activeRituals = [...dailyRituals];
     if (focusRituals) {
         focusRituals.forEach(ritual => {
             // Check if requirements for this focus ritual are met
             let meetsFocusReq = true;
             if (ritual.requiredFocusIds?.length > 0) { if (!ritual.requiredFocusIds.every(id => focused.has(id))) meetsFocusReq = false; }
             if (meetsFocusReq && ritual.requiredRoleFocusScore !== undefined && (scores.RF || 0) < ritual.requiredRoleFocusScore) meetsFocusReq = false;
             if (meetsFocusReq && ritual.requiredRoleFocusScoreBelow !== undefined && (scores.RF || 0) >= ritual.requiredRoleFocusScoreBelow) meetsFocusReq = false;

             if (meetsFocusReq) {
                 activeRituals.push({ ...ritual, isFocusRitual: true }); // Add if requirements met
             }
         });
     }

     if (activeRituals.length === 0) {
         targetDisplay.innerHTML = '<li>No daily rituals currently active. Check back tomorrow!</li>';
         return;
     }

     // Sort and render active rituals
     activeRituals.sort((a,b) => a.id.localeCompare(b.id)).forEach(ritual => {
         const completedData = completed[ritual.id] || { completed: false, progress: 0 };
         const isCompleted = completedData.completed;
         const requiredCount = ritual.track?.count || 1;
         // Show progress only if required count > 1 and not yet completed
         const progressText = (requiredCount > 1 && !isCompleted) ? ` (${completedData.progress}/${requiredCount})` : '';
         const li = document.createElement('li');
         li.classList.toggle('completed', isCompleted); // Style completed rituals
         if(ritual.isFocusRitual) li.classList.add('focus-ritual'); // Style focus rituals

         // Format reward text
         let rewardText = '';
         if (ritual.reward) {
             if (ritual.reward.type === 'insight') {
                  rewardText = `(+${ritual.reward.amount || '?'} <i class="fas fa-brain insight-icon"></i>)`;
             } else if (ritual.reward.type === 'attunement') {
                  const elKey = ritual.reward.element || 'All';
                  const elName = elKey === 'All' ? 'All' : Utils.getElementShortName(elementKeyToFullName[elKey] || elKey);
                  rewardText = `(+${ritual.reward.amount || '?'} ${elName} Attun.)`;
             } else if (ritual.reward.type === 'token') {
                  rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`;
             }
             // Add more reward types here
         }
         li.innerHTML = `${isCompleted ? '<i class="fas fa-check" style="margin-right: 5px;"></i>' : ''}${ritual.description}${progressText} <span class="ritual-reward">${rewardText}</span>`;
         targetDisplay.appendChild(li);
     });
}

// --- Settings Popup UI ---

/** Shows the settings popup. */
export function showSettings() {
    if (settingsPopup) {
        settingsPopup.classList.remove('hidden');
        // Show overlay if onboarding isn't active
        const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');
        if (popupOverlay && !onboardingActive) {
            popupOverlay.classList.remove('hidden');
        }
    } else { console.error("Settings popup element not found."); }
}

// --- Tapestry Deep Dive / Resonance Chamber UI ---

/** Displays the Resonance Chamber modal with analysis data. */
export function displayTapestryDeepDive(analysisData) {
     if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveNarrativeP || !deepDiveFocusIcons || !deepDiveAnalysisNodesContainer || !deepDiveDetailContent || !deepDiveTitle) {
         console.error("Resonance Chamber Modal elements missing!");
         showTemporaryMessage("Error opening Resonance Chamber.", 3000);
         return;
     }
     console.log("UI: Displaying Resonance Chamber with analysis:", analysisData);

     deepDiveTitle.textContent = "Resonance Chamber";
     // Display the main narrative summary
     deepDiveNarrativeP.innerHTML = analysisData.fullNarrativeHTML || "Could not generate Tapestry narrative.";

     // Display icons for focused concepts
     deepDiveFocusIcons.innerHTML = ''; // Clear previous icons
     const focused = State.getFocusedConcepts();
     const discovered = State.getDiscoveredConcepts();
     focused.forEach(id => {
         const concept = discovered.get(id)?.concept;
         if (concept) {
             // Determine icon and color (prefer element, fallback to type)
             let iconClass = Utils.getCardTypeIcon(concept.cardType);
             let iconColor = 'var(--text-muted-color)';
             let iconTitle = `${concept.name} (${concept.cardType})`;
             if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement]) {
                 const elementNameKey = elementKeyToFullName[concept.primaryElement];
                 iconClass = Utils.getElementIcon(elementNameKey);
                 iconColor = Utils.getElementColor(elementNameKey);
                 iconTitle = `${concept.name} (${Utils.getElementShortName(elementNameKey)})`;
             }
             // Create and append icon
             const icon = document.createElement('i');
             icon.className = `${iconClass} focus-icon`; // Add specific class if needed
             icon.style.color = iconColor;
             icon.title = iconTitle;
             deepDiveFocusIcons.appendChild(icon);
         }
     });

     // Reset detail content and active node
     if (deepDiveDetailContent) deepDiveDetailContent.innerHTML = '<p><i>Select an Aspect to explore...</i></p>';
     deepDiveAnalysisNodesContainer?.querySelectorAll('.aspect-node').forEach(btn => btn.classList.remove('active'));
     updateContemplationButtonState(); // Update contemplation button state/cooldown

     // Show the modal
     tapestryDeepDiveModal.classList.remove('hidden');
     const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');
     if (popupOverlay && !onboardingActive) { popupOverlay.classList.remove('hidden'); }
}

/** Displays synergy and tension info specifically (can be called from Synergy button). */
export function displaySynergyTensionInfo(analysisData) {
    // Re-use the Deep Dive modal structure for this specific info
    if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveDetailContent || !deepDiveTitle) {
        console.error("Resonance Chamber elements missing for Synergy/Tension display!");
        showTemporaryMessage("Error showing synergy details.", 3000);
        return;
    }
    console.log("UI: Displaying Synergy/Tension info in Resonance Chamber");

    // Build content for the detail panel
    let content = '<h4>Synergy & Tensions</h4>';
    if (analysisData.synergies.length > 0) {
        content += `<h5>Synergies Found:</h5><ul>${analysisData.synergies.map(s => `<li>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul><hr class="popup-hr">`;
    } else {
        content += `<p><em>No direct synergies detected between focused concepts.</em></p><hr class="popup-hr">`;
    }
    if (analysisData.tensions.length > 0) {
        content += `<h5>Tensions Noted:</h5><ul>${analysisData.tensions.map(t => `<li>${t.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`;
    } else {
        content += `<p><em>No significant elemental tensions detected within the focus.</em></p>`;
    }

    // Update the detail content and highlight the 'Synergy' node
    if (deepDiveDetailContent) deepDiveDetailContent.innerHTML = content;
    deepDiveAnalysisNodesContainer?.querySelectorAll('.aspect-node').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nodeId === 'synergy');
    });
    // Ensure title is appropriate if opened directly
    if (deepDiveTitle) deepDiveTitle.textContent = "Synergy & Tension Analysis";

    // Show the modal
    tapestryDeepDiveModal.classList.remove('hidden');
    const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');
    if (popupOverlay && !onboardingActive) { popupOverlay.classList.remove('hidden'); }
}

/** Updates the Contemplation button state (cooldown, cost). */
export function updateContemplationButtonState() {
    if (!contemplationNodeButton) return;
    const cooldownEnd = State.getContemplationCooldownEnd();
    const now = Date.now();
    const insight = State.getInsight();
    const cost = Config.CONTEMPLATION_COST;
    let disabled = false;
    let title = `Contemplate your focus (${cost} Insight)`;
    let text = `<i class="fas fa-brain" aria-hidden="true"></i> Focusing Lens (<span class="contemplation-cost">${cost}</span> <i class="fas fa-brain insight-icon"></i>)`;

    if (cooldownEnd && now < cooldownEnd) {
        const remaining = Math.ceil((cooldownEnd - now) / 1000);
        disabled = true;
        title = `Contemplation available in ${remaining}s`;
        text = `<i class="fas fa-hourglass-half" aria-hidden="true"></i> On Cooldown (${remaining}s)`;
    } else if (insight < cost) {
        disabled = true;
        title = `Requires ${cost} Insight`;
        // Keep original text but indicate disabled state via title/style
    }

    contemplationNodeButton.disabled = disabled;
    contemplationNodeButton.title = title;
    contemplationNodeButton.innerHTML = text;
}

/** Updates the main content panel of the Deep Dive modal. */
export function updateDeepDiveContent(htmlContent, nodeId) {
    if (!deepDiveDetailContent) return;
    console.log(`UI: Updating deep dive content for node: ${nodeId}`);
    deepDiveDetailContent.innerHTML = htmlContent;
    // Highlight the active node button
    deepDiveAnalysisNodesContainer?.querySelectorAll('.aspect-node').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nodeId === nodeId);
    });
}

/** Displays the generated contemplation task in the Deep Dive modal. */
export function displayContemplationTask(task) {
    if (!deepDiveDetailContent || !task) {
        console.warn("Cannot display contemplation task: Missing element or task data.");
        updateDeepDiveContent("<p><em>Error displaying contemplation task.</em></p>", 'contemplation');
        return;
    }
    console.log("UI: Displaying contemplation task:", task);
    let html = `<h4>Contemplation Task</h4><p>${task.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;

    // Add completion button if required by the task
    if (task.requiresCompletionButton && task.reward?.type && task.reward?.amount > 0) {
        let rewardText = '';
        if (task.reward.type === 'insight') {
             rewardText = `<i class="fas fa-brain insight-icon"></i>`;
        } else if (task.reward.type === 'attunement') {
             rewardText = 'Attun.'; // Abbreviated
        }
        html += `<button id="completeContemplationBtn" class="button small-button btn">Mark Complete (+${task.reward.amount || '?'} ${rewardText})</button>`;
    } else if (task.requiresCompletionButton) {
         // Button needed but no reward specified? Add generic completion button.
         html += `<button id="completeContemplationBtn" class="button small-button btn">Mark Complete</button>`;
    }
    // If no button required, the task is just informational/passive

    updateDeepDiveContent(html, 'contemplation'); // Update panel and activate node

    // Attach listener dynamically (handled via delegation in setupDeepDivePopupListeners)
}

/** Clears the contemplation task display after completion. */
export function clearContemplationTask() {
    if (deepDiveDetailContent) {
        deepDiveDetailContent.innerHTML = '<p>Contemplation acknowledged. Select another Aspect to explore or close the chamber.</p>';
        deepDiveAnalysisNodesContainer?.querySelector('.aspect-node[data-node-id="contemplation"]')?.classList.remove('active');
    }
    updateContemplationButtonState(); // Update button state (likely showing cooldown)
}


// --- Elemental Dilemma Modal Display ---

/** Displays the Elemental Dilemma modal with data. */
export function displayElementalDilemma(dilemma) {
    const modal = getElement('dilemmaModal');
    const situationEl = getElement('dilemmaSituationText');
    const questionEl = getElement('dilemmaQuestionText');
    const slider = getElement('dilemmaSlider');
    const minLabelEl = getElement('dilemmaSliderMinLabel');
    const maxLabelEl = getElement('dilemmaSliderMaxLabel');
    const valueDisplayEl = getElement('dilemmaSliderValueDisplay');
    const nudgeCheckbox = getElement('dilemmaNudgeCheckbox');

    if (!modal || !situationEl || !questionEl || !slider || !minLabelEl || !maxLabelEl || !valueDisplayEl || !nudgeCheckbox) {
        console.error("Dilemma modal elements missing!");
        showTemporaryMessage("Error displaying dilemma.", 3000);
        return;
    }

    // Populate modal content
    situationEl.textContent = dilemma.situation;
    questionEl.textContent = dilemma.question;
    minLabelEl.textContent = dilemma.sliderMinLabel;
    maxLabelEl.textContent = dilemma.sliderMaxLabel;

    // Reset slider and display
    slider.value = 5; // Default to balanced
    valueDisplayEl.textContent = "Balanced";
    nudgeCheckbox.checked = false; // Default nudge off

    // Update display text when slider moves (listener added in main.js)

    // Store dilemma info for confirmation logic
    modal.dataset.dilemmaId = dilemma.id;
    modal.dataset.keyMin = dilemma.elementKeyMin; // Store keys ('A', 'P', etc.)
    modal.dataset.keyMax = dilemma.elementKeyMax;

    // Show the modal
    modal.classList.remove('hidden');
    const onboardingActive = onboardingOverlay && !onboardingOverlay.classList.contains('hidden');
    if (popupOverlay && !onboardingActive) { popupOverlay.classList.remove('hidden'); }
}

// --- Persona Action Buttons State ---

/** Updates the state of the Elemental Dilemma button. */
export function updateElementalDilemmaButtonState() {
    const btn = getElement('elementalDilemmaButton');
    if (btn) {
        // Enable based on game progression? Or always available post-questionnaire?
        // Assuming always available for now if questionnaire is done.
        btn.disabled = !State.getState().questionnaireCompleted;
        btn.title = btn.disabled ? "Complete questionnaire first" : "Engage with an Elemental Dilemma for Insight.";
    } else { console.warn("UI: Elemental Dilemma Button not found!"); }
}

/** Updates the state and appearance of the Explore Synergy button. */
export function updateExploreSynergyButtonStatus(status) { // status = 'none', 'synergy', 'tension', 'both'
    const btn = getElement('exploreSynergyButton');
    if (!btn) return;
    const hasFocus = State.getFocusedConcepts().size >= 2; // Need at least 2 concepts

    btn.disabled = !hasFocus; // Disable if fewer than 2 focused
    btn.classList.remove('highlight-synergy', 'highlight-tension'); // Reset visual highlights
    btn.textContent = "Explore Synergy"; // Reset text

    if (!hasFocus) {
        btn.title = "Focus at least 2 concepts to explore";
    } else {
        btn.title = "Explore synergies and tensions between focused concepts";
        // Add visual cues based on detected status
        if (status === 'synergy') {
            btn.classList.add('highlight-synergy');
            btn.title += " (Synergy detected!)";
            btn.textContent = "Explore Synergy ✨";
        } else if (status === 'tension') {
            btn.classList.add('highlight-tension');
            btn.title += " (Tension detected!)";
            btn.textContent = "Explore Synergy ⚡";
        } else if (status === 'both') {
            btn.classList.add('highlight-synergy', 'highlight-tension');
            btn.title += " (Synergy & Tension detected!)";
            btn.textContent = "Explore Synergy 💥";
        }
    }
}

/** Updates the state of the Suggest Scene button. */
export function updateSuggestSceneButtonState() {
    const btn = getElement('suggestSceneButton');
    if (!btn) return;
    const costDisplay = getElement('sceneSuggestCostDisplay');
    const hasFocus = State.getFocusedConcepts().size > 0;
    const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST;

    btn.disabled = !hasFocus || !canAfford;

    // Set appropriate title based on why it's disabled (or enabled)
    if (!hasFocus) btn.title = "Focus on concepts first";
    else if (!canAfford) btn.title = `Requires ${Config.SCENE_SUGGESTION_COST} Insight`;
    else btn.title = `Suggest resonant scenes (${Config.SCENE_SUGGESTION_COST} Insight)`;

    // Update cost display
    if(costDisplay) costDisplay.textContent = Config.SCENE_SUGGESTION_COST;
}


// --- Initial UI Setup Helper ---

/** Sets up the initial state of the UI on load. */
export function setupInitialUI() {
    console.log("UI: Setting up initial UI state");
    if(mainNavBar) mainNavBar.classList.add('hidden'); // Hide nav initially
    if (loadButton) {
        // Show load button only if save data exists
        loadButton.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY));
    } else { console.warn("Load button element not found during initial setup."); }

    // Initialize button states that depend on later game state
    updateSuggestSceneButtonState();
    updateElementalDilemmaButtonState();
    updateExploreSynergyButtonStatus('none');
    updateInsightBoostButtonState();
    populateGrimoireFilters(); // Populate static filters early

    // Apply saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
         document.documentElement.classList.add('dark');
    } else {
         document.documentElement.classList.remove('dark');
    }
}


// --- Onboarding UI ---

/** Displays the onboarding popup for a specific phase. */
export function showOnboarding(phase) {
    // Ensure all onboarding elements exist
    if (!onboardingOverlay || !onboardingPopup || !onboardingContent || !onboardingProgressSpan || !onboardingPrevButton || !onboardingNextButton || !onboardingSkipButton) {
        console.error("Onboarding UI elements missing! Cannot show onboarding.");
        State.markOnboardingComplete(); // Mark complete to avoid infinite loops
        hideOnboarding();
        return;
    }

    // Validate phase and check completion status
    if (phase <= 0 || phase > Config.MAX_ONBOARDING_PHASE || State.isOnboardingComplete()) {
        hideOnboarding(); // Hide if phase invalid or already complete
        return;
    }

    const task = onboardingTasks.find(t => t.phaseRequired === phase);
    if (!task) {
        console.warn(`Onboarding task for phase ${phase} not found. Completing onboarding.`);
        State.markOnboardingComplete();
        hideOnboarding();
        return;
    }

    console.log(`UI: Showing onboarding phase ${phase}`);

    // Populate popup content
    const taskText = task.description || task.text || 'Follow the instructions...';
    onboardingContent.innerHTML = `<p>${taskText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
    if (task.hint) { onboardingContent.innerHTML += `<p><small><em>Hint: ${task.hint}</em></small></p>`; }

    // Update progress text and button states
    onboardingProgressSpan.textContent = `Step ${phase} of ${Config.MAX_ONBOARDING_PHASE}`;
    onboardingPrevButton.disabled = (phase === 1);
    onboardingNextButton.textContent = (phase === Config.MAX_ONBOARDING_PHASE) ? "Finish Orientation" : "Next";

    // Show overlay and popup
    onboardingOverlay.classList.add('visible');
    onboardingOverlay.classList.remove('hidden');
    onboardingPopup.classList.remove('hidden');
    onboardingOverlay.removeAttribute('aria-hidden');

    // Hide the main popup overlay if it's somehow visible
    popupOverlay?.classList.add('hidden');

    // Update highlight after a short delay to allow layout shifts
    // Use requestAnimationFrame for smoother updates relative to rendering
    requestAnimationFrame(() => {
        updateOnboardingHighlight(task.highlightElementId);
    });
}

/** Hides the onboarding overlay and popup. */
export function hideOnboarding() {
  if (onboardingOverlay) {
      onboardingOverlay.classList.remove('visible');
      onboardingOverlay.classList.add('hidden'); // Ensure hidden class is added
      onboardingOverlay.setAttribute('aria-hidden', 'true');
  }
  if (onboardingPopup) {
      onboardingPopup.classList.add('hidden');
  }
  if (onboardingHighlight) { // Also hide the highlight
      onboardingHighlight.style.display = 'none';
  }
  // State completion is handled by the logic that calls hideOnboarding (e.g., Skip, Finish)
  // Ensure main nav becomes usable if it was hidden by onboarding
  if (State.getState().questionnaireCompleted) {
        mainNavBar?.classList.remove('hidden');
  }
  console.log("UI: Onboarding hidden.");
}

/** Updates the position and visibility of the onboarding highlight element. */
function updateOnboardingHighlight(elementId) {
    if (!onboardingHighlight) { console.warn("Onboarding highlight element missing"); return; }
    const targetElement = elementId ? getElement(elementId) : null;

    // Check if target exists and is visible in the layout
    if (targetElement && targetElement.offsetParent !== null) {
        const rect = targetElement.getBoundingClientRect();
        // Position highlight relative to viewport, adjusting for scroll
        onboardingHighlight.style.left = `${rect.left - 5 + window.scrollX}px`;
        onboardingHighlight.style.top = `${rect.top - 5 + window.scrollY}px`;
        onboardingHighlight.style.width = `${rect.width + 10}px`;
        onboardingHighlight.style.height = `${rect.height + 10}px`;
        onboardingHighlight.style.display = 'block'; // Make it visible

        // Scroll target into view smoothly
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        console.log(`UI: Highlighting element: #${elementId}`);
    } else {
        // Hide highlight if target doesn't exist or isn't visible
        onboardingHighlight.style.display = 'none';
        if(elementId) console.log(`UI: Cannot highlight hidden/missing element: #${elementId}`);
    }
}

// --- Update Note Save Status ---
/** Displays a temporary status message after saving a note. */
export function updateNoteSaveStatus(message, isError = false) {
    if (noteSaveStatusSpan) {
        noteSaveStatusSpan.textContent = message;
        noteSaveStatusSpan.className = 'note-status'; // Reset class
        if (isError) noteSaveStatusSpan.classList.add('error');
        // Clear message after a delay
        setTimeout(() => {
            if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = "";
        }, 2500);
    }
}

console.log("ui.js loaded successfully. (Enhanced v4.10 + Progress Bar/Accordion)");
// --- END OF FILE ui.js ---
