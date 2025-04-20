// --- START OF FILE ui.js ---

// js/ui.js - User Interface Logic (Enhanced v4.10 + Drawer/Accordion/Layout Fixes)
// DEDUPLICATED VERSION + FIX for updateSuggestSceneButtonState scope

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

console.log("ui.js loading... (Enhanced v4.10 + Drawer/Accordion/Layout Fixes)");

// --- Helper Function for Image Errors ---
function handleImageError(imgElement) {
    console.warn(`Image failed to load: ${imgElement?.src}. Displaying placeholder.`);
    if (imgElement) {
        imgElement.style.display = 'none'; // Hide broken img
        const placeholder = imgElement.closest('.card-visual')?.querySelector('.card-visual-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex'; // Ensure placeholder is visible (flex for centering icon)
            placeholder.title = `Art Placeholder (Load Failed: ${imgElement.src?.split('/')?.pop() || 'unknown'})`;
        }
         // Also hide parent if it's just the image inside popupVisualContainer
         if(imgElement.parentElement?.id === 'popupVisualContainer') {
              const popupPlaceholder = imgElement.parentElement.querySelector('.card-visual-placeholder');
              if(popupPlaceholder) popupPlaceholder.style.display = 'flex';
         }
    }
}
window.handleImageError = handleImageError; // Make accessible globally for onerror


// --- DOM Element References ---
const getElement = (id) => document.getElementById(id);

// General UI
const saveIndicator = getElement('saveIndicator');
const screens = document.querySelectorAll('.screen');
const popupOverlay = getElement('popupOverlay');
const milestoneAlert = getElement('milestoneAlert');
const milestoneAlertText = getElement('milestoneAlertText');
const toastElement = getElement('toastNotification');
const toastMessageElement = getElement('toastMessage');

// Drawer Navigation
const drawerToggle = getElement('drawerToggle');
const sideDrawer = getElement('sideDrawer');
const drawerSettingsButton = getElement('drawerSettings');
const drawerThemeToggle = getElement('drawerThemeToggle');
const drawerGrimoireCountSpan = getElement('drawerGrimoireCount'); // Drawer specific count

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
const grimoireFilterControls = grimoireControlsWorkshop?.querySelector('.filter-controls');
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
    // console.log("UI: hidePopups called"); // Reduce noise
    let researchPopupIsOpenAndPending = false;
    // Check if research popup is open and has unprocessed items
    if (researchResultsPopup && !researchResultsPopup.classList.contains('hidden')) {
        const pendingItems = researchPopupContent?.querySelectorAll('.research-result-item[data-processed="false"], .research-result-item[data-choice-made="pending_dissonance"]');
        if (pendingItems && pendingItems.length > 0) {
            researchPopupIsOpenAndPending = true;
            // console.log(`UI: Keeping research results popup open (${pendingItems.length} items pending).`); // Reduce noise
        }
    }

    // Hide all popups unless it's the research popup and it's pending, or it's the onboarding popup
    document.querySelectorAll('.popup:not(.onboarding-popup)').forEach(popup => {
        if (!(popup.id === 'researchResultsPopup' && researchPopupIsOpenAndPending)) {
            popup.classList.add('hidden');
        }
    });

    // Check if any general popups are still visible OR if onboarding is active
    const anyGeneralPopupVisible = document.querySelector('.popup:not(.hidden):not(.onboarding-popup)');
    const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible'); // Check visibility class

    // Hide the main overlay ONLY if no general popups are visible AND onboarding is NOT active
    if (!anyGeneralPopupVisible && popupOverlay && !onboardingActive) {
        popupOverlay.classList.add('hidden');
        // Clear temporary game logic state associated with popups
        if (typeof GameLogic !== 'undefined' && GameLogic.clearPopupState) {
            GameLogic.clearPopupState();
            // console.log("UI: All general popups hidden, cleared popup logic state."); // Reduce noise
        }
    } else if (anyGeneralPopupVisible) {
         // console.log("UI: Some general popups remain visible, overlay kept."); // Reduce noise
    } else if (onboardingActive) {
         // console.log("UI: Onboarding is visible, keeping popup overlay potentially active."); // Reduce noise
         // Ensure the main overlay IS hidden if onboarding is handling its own overlay
         if (onboardingOverlay && popupOverlay) {
             popupOverlay.classList.add('hidden'); // Ensure standard overlay hidden when onboarding has its own
         }
    }
}


/** Shows the generic info popup with a specific message. */
export function showInfoPopup(message) {
    if (infoPopupElement && infoPopupContent) {
        infoPopupContent.textContent = message;
        infoPopupElement.classList.remove('hidden');
        // Show the main overlay if onboarding isn't active
        const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible');
        if (popupOverlay && !onboardingActive) {
            popupOverlay.classList.remove('hidden');
        }
    } else {
        console.error("Info popup elements (#infoPopup, #infoPopupContent) not found.");
        showTemporaryMessage("Error displaying information.", 2000); // Fallback
    }
}


// --- Screen Management ---

// FIX 4: Helper function to update drawer link visibility
function updateDrawerLinks() {
  const done = State.getState().questionnaireCompleted;
  const drawer = getElement('sideDrawer');
  if(drawer) {
      drawer.querySelectorAll('.drawer-link.hidden-by-flow')
        .forEach(btn => btn.classList.toggle('hidden', !done));
  }
}


/** Shows the specified screen and hides others, updating drawer state. */
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

    // Update Drawer Link States & Visibility
    updateDrawerLinks(); // FIX 4: Call the helper
    if (sideDrawer) {
        sideDrawer.querySelectorAll('.drawer-link').forEach(button => {
            button?.classList.toggle('active', button.dataset?.target === screenId);
        });
    }


    // Call specific display logic AFTER the screen is made visible
    try {
        switch (screenId) {
            case 'personaScreen':
                if (isPostQuestionnaire) {
                    const justFinishedQuestionnaire = previousScreenId === 'questionnaireScreen';
                    if (justFinishedQuestionnaire && personaSummaryView && personaDetailedView) {
                        togglePersonaView(false); // Show summary view first time after questionnaire
                    } else {
                        // Ensure the correct view's content is refreshed
                        if (personaSummaryView?.classList.contains('current')) {
                            displayPersonaSummary();
                        } else {
                            GameLogic.displayPersonaScreenLogic(); // Handles detailed view logic
                        }
                    }
                    displayInsightLog(); // Ensure log is rendered if toggled open
                } else {
                    // If trying to access persona before Q is done, redirect
                    console.warn("Attempted to access Persona screen before questionnaire completion. Redirecting.");
                    showScreen('welcomeScreen');
                    return; // Stop further processing for this invalid state
                }
                break;
            case 'workshopScreen':
                if (isPostQuestionnaire) {
                    displayWorkshopScreenContent(); // Populate buttons etc.
                    refreshGrimoireDisplay(); // Display cards
                } else {
                    console.warn("Attempted to access Workshop screen before questionnaire completion. Redirecting.");
                    showScreen('welcomeScreen');
                    return;
                }
                break;
            case 'repositoryScreen':
                if (isPostQuestionnaire) {
                    displayRepositoryContent(); // Populate lists
                } else {
                     console.warn("Attempted to access Repository screen before questionnaire completion. Redirecting.");
                     showScreen('welcomeScreen');
                     return;
                }
                break;
            case 'questionnaireScreen':
                if (!isPostQuestionnaire) {
                    const index = State.getState().currentElementIndex;
                    if (index >= 0 && index < elementNames.length) {
                        displayElementQuestions(index); // Display current question
                    } else {
                        console.warn("Questionnaire screen shown but index is invalid:", index);
                        initializeQuestionnaireUI(); // Reset to start if index bad
                    }
                } else {
                    console.warn("Attempted to show questionnaire screen after completion.");
                    showScreen('personaScreen'); // Redirect
                    return;
                }
                break;
            case 'welcomeScreen':
                // Ensure hidden-by-flow buttons are hidden on welcome
                updateDrawerLinks(); // Call helper to hide unavailable links
                break;
        }
    } catch (error) {
        console.error(`Error during display logic for screen ${screenId}:`, error);
    }

    // Scroll to top for main content screens
    if (['questionnaireScreen', 'workshopScreen', 'personaScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
    previousScreenId = screenId; // Track the last shown screen
}

/** Toggles the side drawer open/closed */
export function toggleDrawer() { // Exported for use in main.js
    if(!sideDrawer || !drawerToggle) return;
    const isOpen = sideDrawer.classList.toggle('open');
    drawerToggle.setAttribute('aria-expanded', isOpen);
    sideDrawer.setAttribute('aria-hidden', !isOpen);
    // Toggle overlay based on drawer state only if onboarding is not active
    const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible');
    if (popupOverlay && !onboardingActive) {
        popupOverlay.classList.toggle('hidden', !isOpen); // Show overlay when drawer is open
    }
}


// --- Insight Display & Log ---

/** Updates all Insight display elements across the UI. */
export function updateInsightDisplays() {
    const insightValue = State.getInsight();
    const insight = insightValue.toFixed(1);
    if (userInsightDisplayPersona) {
        userInsightDisplayPersona.textContent = insight;
        if (!userInsightDisplayPersona.hasAttribute('aria-live')) {
             userInsightDisplayPersona.setAttribute('aria-live', 'polite'); // Add for screen readers
        }
    }
    if (userInsightDisplayWorkshop) {
         userInsightDisplayWorkshop.textContent = insight;
         if (!userInsightDisplayWorkshop.hasAttribute('aria-live')) {
              userInsightDisplayWorkshop.setAttribute('aria-live', 'polite');
         }
    }
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
            const cost = parseFloat(buttonCard.dataset.cost);
            const canAfford = insightValue >= cost;
            const isFree = buttonCard.dataset.isFree === 'true'; // Check if it's a free attempt button

            // Disable only if NOT free AND cannot afford
            const shouldBeDisabled = !isFree && !canAfford;
            buttonCard.classList.toggle('disabled', shouldBeDisabled);
            buttonCard.classList.toggle('clickable', !shouldBeDisabled); // Clickable if free OR affordable

            const actionDiv = buttonCard.querySelector('.element-action');
            if (actionDiv) actionDiv.classList.toggle('disabled', shouldBeDisabled);

            // Update title based on state
            if (isFree) {
                buttonCard.title = `Conduct FREE research on ${Utils.getElementShortName(elementKeyToFullName[buttonCard.dataset.elementKey])}. (${State.getInitialFreeResearchRemaining()} left total)`;
            } else if (shouldBeDisabled) {
                buttonCard.title = `Research ${Utils.getElementShortName(elementKeyToFullName[buttonCard.dataset.elementKey])} (Requires ${cost} Insight)`;
            } else {
                buttonCard.title = `Research ${Utils.getElementShortName(elementKeyToFullName[buttonCard.dataset.elementKey])} (Cost: ${cost} Insight)`;
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
            // Update error message visibility if present
            const errorMsg = button.parentElement?.querySelector('.unlock-error');
            if (errorMsg) errorMsg.style.display = canAfford ? 'none' : 'block';
        });
        updateSuggestSceneButtonState(); // Update Suggest Scene button state
    }

    // Repository - Meditate/Attempt Buttons
    if (repositoryScreen?.classList.contains('current')) {
        repositoryScreen.querySelectorAll('.repo-actions button').forEach(button => {
             const sceneId = button.dataset.sceneId;
             const experimentId = button.dataset.experimentId;
             let cost = 0;
             let baseTitle = "";

             if (sceneId) {
                 const scene = sceneBlueprints.find(s => s.id === sceneId);
                 cost = scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
                 baseTitle = `Meditate on ${scene?.name || 'Scene'}`;
             } else if (experimentId) {
                  const experiment = alchemicalExperiments.find(e => e.id === experimentId);
                  cost = experiment?.insightCost || Config.EXPERIMENT_BASE_COST;
                  baseTitle = `Attempt ${experiment?.name || 'Experiment'}`;
                  // Don't update experiment button disabled state solely on insight here,
                  // as other requirements (attunement, focus) also matter.
                  // Re-rendering the item in displayRepositoryContent handles this better.
                  // Just update the title part related to cost.
                  button.title = (insightValue >= cost) ? baseTitle : `${baseTitle} (Requires ${cost} Insight)`;
                  // Also update disabled based *only* on cost if other reqs were met
                  const otherReqsMet = !button.title.includes('Requirements not met'); // Simple check
                  if(otherReqsMet) {
                      button.disabled = insightValue < cost;
                  }
                  return; // Skip further updates for experiments
             }

             button.disabled = insightValue < cost;
             button.title = insightValue >= cost ? baseTitle : `${baseTitle} (Requires ${cost} Insight)`;
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
    if (!insightLogContainer.hasAttribute('aria-live')) insightLogContainer.setAttribute('aria-live', 'polite');

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
        // Basic sanitization for display
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
        insightBoostTimeoutId = setTimeout(updateInsightBoostButtonState, 1000); // Schedule next update
    } else {
        btn.disabled = false;
        // Ensure visually hidden text is present for accessibility
        btn.innerHTML = `<i class="fas fa-plus"></i> <span class="visually-hidden">Add Insight</span>`;
        btn.title = `Get an Insight boost (${Config.INSIGHT_BOOST_AMOUNT} Insight, ${Config.INSIGHT_BOOST_COOLDOWN / 60000} min cooldown)`;
    }
}

// --- Questionnaire UI ---

/** Sets up the UI for starting the questionnaire. */
export function initializeQuestionnaireUI() {
    console.log("UI: Initializing Questionnaire UI");
    State.updateElementIndex(0); // Ensure state starts at index 0
    displayElementQuestions(0); // Display first set of questions
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; // Hide feedback initially
    document.documentElement.style.setProperty('--progress-pct', `${(1 / elementNames.length) * 100}%`); // Set initial progress
    console.log("UI: Questionnaire UI initialized.");
}

/** Updates the progress header with steps for each element. */
export function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) { console.error("Element progress header not found."); return; }
    elementProgressHeader.innerHTML = '';
    elementNames.forEach((elementNameKey, index) => { // Includes RF
        const stepDiv = document.createElement('div');
        stepDiv.classList.add('step');
        const elementData = elementDetails[elementNameKey] || {};
        const fullName = elementData.name || elementNameKey;
        const shortName = Utils.getElementShortName(fullName);
        stepDiv.textContent = shortName;
        stepDiv.title = fullName;
        stepDiv.classList.toggle('completed', index < activeIndex);
        stepDiv.classList.toggle('active', index === activeIndex);
        elementProgressHeader.appendChild(stepDiv);
    });
}

/** Displays the questions for the element at the given index. */
export function displayElementQuestions(index) {
    const actualIndex = State.getState().currentElementIndex;
    const displayIndex = (actualIndex >= 0 && actualIndex < elementNames.length) ? actualIndex : index;
    console.log(`UI: Displaying Qs for index ${displayIndex}`);

    if (displayIndex >= elementNames.length) {
        console.warn(`displayElementQuestions called with index ${displayIndex} >= element count ${elementNames.length}. Finalizing.`);
        GameLogic.finalizeQuestionnaire();
        return;
    }

    const elementNameKey = elementNames[displayIndex]; // "Attraction", ..., "RoleFocus"
    const elementData = elementDetails[elementNameKey] || {};
    const fullName = elementData.name || elementNameKey;
    const questions = questionnaireGuided[elementNameKey] || [];

    if (!questionContent) { console.error("Question content area #questionContent missing!"); return; }
    const elementAnswers = State.getState().userAnswers?.[elementNameKey] || {};

    // --- Build HTML ---
    questionContent.innerHTML = `
        <div class="element-intro">
            <h2>${fullName}</h2>
            <p><em>${elementData.coreQuestion || 'Exploring this element...'}</em></p>
            <p>${elementData.coreConcept || 'Loading details...'}</p>
            <p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p>
        </div>`;

    let questionsHTML = '';
    if (questions.length > 0) {
        questions.forEach(q => {
            questionsHTML += `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
            const savedAnswer = elementAnswers[q.qId];
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
                questionsHTML += `<fieldset class="radio-options"><legend class="visually-hidden">${q.text}</legend>`;
                q.options.forEach(opt => {
                    const checked = savedAnswer === opt.value ? 'checked' : '';
                    // Wrap input and label text in a label for better clickability
                    questionsHTML += `<label class="form-group ${checked}" for="${q.qId}_${opt.value}"><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><span>${opt.value}</span></label>`;
                });
                questionsHTML += `</fieldset>`;
            } else if (q.type === "checkbox") {
                questionsHTML += `<fieldset class="checkbox-options"><legend class="visually-hidden">${q.text} (Max ${q.maxChoices || 2})</legend>`;
                q.options.forEach(opt => {
                    const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : '';
                    // Wrap input and label text in a label
                    questionsHTML += `<label class="form-group ${checked}" for="${q.qId}_${opt.value}"><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><span>${opt.value}</span></label>`;
                });
                questionsHTML += `</fieldset>`;
            }
            questionsHTML += `</div></div>`;
        });
    } else {
        questionsHTML = '<p><i>(Assessment based on general understanding.)</i></p>';
    }
    questionContent.innerHTML += questionsHTML;

    // --- Add Listeners ---
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.removeEventListener(eventType, handleQuestionnaireInput); // Use named function for removal
        input.addEventListener(eventType, handleQuestionnaireInput); // Use named function
    });
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.removeEventListener('change', handleCheckboxInput); // Use named function
        checkbox.addEventListener('change', handleCheckboxInput); // Use named function
    });
    // Add listeners to radio/checkbox labels to update their own 'checked' class for styling
     questionContent.querySelectorAll('.radio-options label.form-group, .checkbox-options label.form-group').forEach(label => {
         const input = label.querySelector('input'); // Find the input inside the label
         if (input) {
             input.addEventListener('change', () => {
                 // For radio, remove 'checked' from siblings' labels in the same fieldset
                 if (input.type === 'radio') {
                     const fieldset = label.closest('fieldset');
                     fieldset?.querySelectorAll('label.form-group').forEach(l => l.classList.remove('checked'));
                 }
                 // Toggle class on the specific label based on input's checked state
                 label.classList.toggle('checked', input.checked);
             });
             // Initial check state
             label.classList.toggle('checked', input.checked);
         }
     });

    questionContent.querySelectorAll('.slider.q-input').forEach(slider => {
        updateSliderFeedbackText(slider, elementNameKey);
    });

    // --- Update Surrounding UI ---
    updateDynamicFeedback(elementNameKey, elementAnswers);
    updateElementProgressHeader(displayIndex);
    if (progressText) progressText.textContent = `Element ${displayIndex + 1} / ${elementNames.length}: ${fullName}`;
    if (prevElementButton) prevElementButton.style.visibility = (displayIndex > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (displayIndex === elementNames.length - 1) ? "View Initial Discoveries" : "Next Element";

    // Update progress bar
    const pct = ((displayIndex + 1) / elementNames.length) * 100;
    document.documentElement.style.setProperty('--progress-pct', `${pct}%`);

    // console.log(`UI: Finished displaying questions for ${elementNameKey} at index ${displayIndex}`); // Reduce noise
}

// Named handler functions for adding/removing listeners correctly
function handleQuestionnaireInput(event) {
    GameLogic.handleQuestionnaireInputChange(event);
}
function handleCheckboxInput(event) {
    GameLogic.handleCheckboxChange(event);
}


/** Updates the descriptive text below a slider based on its value. */
export function updateSliderFeedbackText(sliderElement, elementNameKey) {
    if (!sliderElement || sliderElement.type !== 'range') return;
    const qId = sliderElement.dataset.questionId;
    const feedbackElement = getElement(`feedback_${qId}`);
    if (!feedbackElement) { console.warn(`Feedback element missing for slider ${qId}`); return; }
    const currentValue = parseFloat(sliderElement.value);
    const display = getElement(`display_${qId}`);
    if(display) display.textContent = currentValue.toFixed(1);
    const elementData = elementDetails?.[elementNameKey];
    if (!elementData?.scoreInterpretations) {
        console.warn(`Interpretations missing for element: ${elementNameKey}`);
        feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`;
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
        return;
    }
    const tempScore = GameLogic.calculateElementScore(elementNameKey, currentAnswers);
    const scoreLabel = Utils.getScoreLabel(tempScore);
    const shortName = Utils.getElementShortName(elementData.name || elementNameKey);
    feedbackElementSpan.textContent = shortName;
    feedbackScoreSpan.textContent = tempScore.toFixed(1);
    let scoreParent = feedbackScoreSpan?.parentNode;
    let labelSpan = scoreParent?.querySelector('.score-label');
    if (!labelSpan && scoreParent) {
        labelSpan = document.createElement('span');
        labelSpan.classList.add('score-label');
        // Insert after the score span
        feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling);
    }
    if (labelSpan) labelSpan.textContent = ` (${scoreLabel})`;
    feedbackScoreBar.style.width = `${Math.max(0, Math.min(100, tempScore * 10))}%`; // Clamp width
    dynamicScoreFeedback.style.display = 'block';
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
        if (type === 'slider') { answers[qId] = parseFloat(input.value); }
        else if (type === 'radio') { if (input.checked) { answers[qId] = input.value; } }
        else if (type === 'checkbox') { if (!answers[qId]) { answers[qId] = []; } if (input.checked) { answers[qId].push(input.value); } }
    });
    // Ensure checkbox arrays exist even if no boxes are checked
    questionContent?.querySelectorAll('.checkbox-options').forEach(container => {
        const name = container.querySelector('input[type="checkbox"]')?.name;
        if(name && !answers[name]) { answers[name] = []; }
    });
    return answers;
}

// --- Persona Action Buttons State ---
// Define these functions in the module scope so they are accessible
export function updateElementalDilemmaButtonState() { const btn = getElement('elementalDilemmaButton'); if (btn) { btn.disabled = !State.getState().questionnaireCompleted; btn.title = btn.disabled ? "Complete questionnaire first" : "Engage with an Elemental Dilemma for Insight."; } else { console.warn("UI: Elemental Dilemma Button not found!"); } }
export function updateExploreSynergyButtonStatus(status) { const btn = getElement('exploreSynergyButton'); if (!btn) return; const hasFocus = State.getFocusedConcepts().size >= 2; btn.disabled = !hasFocus; btn.classList.remove('highlight-synergy', 'highlight-tension'); btn.textContent = "Explore Synergy"; if (!hasFocus) { btn.title = "Focus at least 2 concepts to explore"; } else { btn.title = "Explore synergies and tensions between focused concepts"; if (status === 'synergy') { btn.classList.add('highlight-synergy'); btn.title += " (Synergy detected!)"; btn.textContent = "Explore Synergy ✨"; } else if (status === 'tension') { btn.classList.add('highlight-tension'); btn.title += " (Tension detected!)"; btn.textContent = "Explore Synergy ⚡"; } else if (status === 'both') { btn.classList.add('highlight-synergy', 'highlight-tension'); btn.title += " (Synergy & Tension detected!)"; btn.textContent = "Explore Synergy 💥"; } } }
export function updateSuggestSceneButtonState() { const btn = getElement('suggestSceneButton'); if (!btn) return; const costDisplay = getElement('sceneSuggestCostDisplay'); const hasFocus = State.getFocusedConcepts().size > 0; const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST; btn.disabled = !hasFocus || !canAfford; if (!hasFocus) btn.title = "Focus on concepts first"; else if (!canAfford) btn.title = `Requires ${Config.SCENE_SUGGESTION_COST} Insight`; else btn.title = `Suggest resonant scenes (${Config.SCENE_SUGGESTION_COST} Insight)`; if(costDisplay) costDisplay.textContent = Config.SCENE_SUGGESTION_COST; }

// --- Persona Screen UI ---

/** Toggles between the detailed and summary views on the Persona screen. */
export function togglePersonaView(showDetailed) {
    if (personaDetailedView && personaSummaryView && showDetailedViewBtn && showSummaryViewBtn) {
        const detailedIsTarget = showDetailed;
        const detailedIsCurrent = !personaDetailedView.classList.contains('hidden');

        if (detailedIsTarget !== detailedIsCurrent) { // Only toggle if state needs changing
            personaDetailedView.classList.toggle('hidden', !showDetailed);
            personaDetailedView.classList.toggle('current', showDetailed);
            personaSummaryView.classList.toggle('hidden', showDetailed);
            personaSummaryView.classList.toggle('current', !showDetailed);

            showDetailedViewBtn.classList.toggle('active', showDetailed);
            showDetailedViewBtn.setAttribute('aria-pressed', showDetailed);
            showSummaryViewBtn.classList.toggle('active', !showDetailed);
            showSummaryViewBtn.setAttribute('aria-pressed', !showDetailed);

            // Refresh content of the newly shown view
            if (showDetailed) {
                GameLogic.displayPersonaScreenLogic(); // Refreshes detailed content
                displayInsightLog(); // Ensure log visibility
            } else {
                displayPersonaSummary(); // Refreshes summary content
            }
        }
    } else { console.error("Persona view toggle elements missing."); }
}

/** Renders the detailed view of the Persona screen (using accordion logic). */
export function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona element details div not found!"); return; }
    console.log("UI: Displaying Persona Screen (Detailed View - Accordion)");
    personaElementDetailsDiv.innerHTML = ''; // Clear previous content
    const scores = State.getScores();
    const showDeepDiveContainer = State.getState().questionnaireCompleted;

    elementNames.forEach(elementNameKey => { // Includes RF
        const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elementNameKey);
        const elementData = elementDetails[elementNameKey];
        if (!key || !elementData) { console.warn(`UI displayPersonaScreen: Skip render for missing data: ${elementNameKey}`); return; }

        const score = (scores[key] !== undefined && typeof scores[key] === 'number' && !isNaN(scores[key])) ? scores[key] : 5.0;
        const scoreLabel = Utils.getScoreLabel(score);
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation N/A.";
        const barWidth = Math.max(0, Math.min(100, score * 10));
        const color = Utils.getElementColor(elementNameKey);
        const iconClass = Utils.getElementIcon(elementNameKey);
        const fullName = elementData.name || elementNameKey;
        const elementNameShort = Utils.getElementShortName(fullName);

        // Create accordion elements
        const accordionItemDiv = document.createElement('div');
        accordionItemDiv.classList.add('accordion-item');
        accordionItemDiv.dataset.elementKey = key;
        accordionItemDiv.style.setProperty('--element-color', color);

        const button = document.createElement('button');
        button.classList.add('accordion-header');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', `accordion-body-${key}`);
        button.id = `accordion-header-${key}`;
        button.innerHTML = `
            <div class="element-summary-header">
                <i class="${iconClass} element-icon-indicator" style="color: ${color};" title="${fullName}"></i>
                <strong>${elementNameShort}:</strong>
                <span>${score.toFixed(1)}</span>
                <span class="score-label">(${scoreLabel})</span>
            </div>
            <div class="score-bar-container" title="Score: ${score.toFixed(1)}/10 (${scoreLabel})">
                <div style="width: ${barWidth}%; background-color: ${color};"></div>
            </div>
        `;

        const body = document.createElement('div');
        body.classList.add('accordion-body');
        body.id = `accordion-body-${key}`;
        body.setAttribute('role', 'region');
        body.setAttribute('aria-labelledby', `accordion-header-${key}`);
        body.innerHTML = `
            <div class="element-description">
                <p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p>
                <details class="element-elaboration">
                    <summary>Elaboration & Examples</summary>
                    <div class="collapsible-content">
                        <p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p>
                        <p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>
                    </div>
                </details>
                <hr class="content-hr">
                <p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p>
                <hr class="attunement-hr">
                <div class="attunement-placeholder"></div> <!-- Placeholder for attunement bar -->
                <div class="element-deep-dive-container ${showDeepDiveContainer ? '' : 'hidden'}" data-element-key="${key}"></div>
            </div>`;

        accordionItemDiv.appendChild(button);
        accordionItemDiv.appendChild(body);
        personaElementDetailsDiv.appendChild(accordionItemDiv);

        // Add click listener for the button
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
            // Body max-height is controlled by CSS based on [aria-expanded]
        });

        // Populate Deep Dive if applicable
        if (showDeepDiveContainer) {
             const deepDiveContainer = body.querySelector('.element-deep-dive-container');
             if(deepDiveContainer) displayElementDeepDive(key, deepDiveContainer);
        }
    });
    // Update other persona screen elements
    displayElementAttunement();
    updateInsightDisplays();
    displayFocusedConceptsPersona();
    generateTapestryNarrative();
    synthesizeAndDisplayThemesPersona();
    updateElementalDilemmaButtonState();
    updateSuggestSceneButtonState();
    GameLogic.checkSynergyTensionStatus();
}


/** Updates the attunement bars within the element detail accordions. */
export function displayElementAttunement() {
    if (!personaElementDetailsDiv) return;
    const attunement = State.getAttunement(); // Includes RF
    Object.entries(attunement).forEach(([key, attunementValue]) => {
        const value = attunementValue || 0;
        const percentage = Math.max(0, Math.min(100, (value / Config.MAX_ATTUNEMENT) * 100));
        const elementNameKey = elementKeyToFullName[key]; // Convert 'A' -> 'Attraction' etc.
        if (!elementNameKey) { console.warn(`UI displayElementAttunement: Element name key not found for key: ${key}`); return; }
        const color = Utils.getElementColor(elementNameKey);

        // Find the correct accordion item and placeholder
        const targetAccordion = personaElementDetailsDiv.querySelector(`.accordion-item[data-element-key="${key}"]`);
        const placeholder = targetAccordion?.querySelector('.attunement-placeholder');
        if (!placeholder) return; // Might not be rendered yet or structure changed

        let attunementDisplay = placeholder.querySelector('.attunement-display');
        // Create display if it doesn't exist
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
            placeholder.innerHTML = ''; // Clear placeholder text/content
            placeholder.appendChild(attunementDisplay);
        }

        // Update bar width and title
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
        focusedConceptsHeader.innerHTML = `Focused Concepts (${focused.size} / ${totalSlots}) <i class="fas fa-info-circle info-icon" title="Concepts marked as Focus (${focused.size}) out of your available slots (${totalSlots}). Slots increase via Milestones."></i>`;
    }
}

/** Renders the grid of currently focused concepts on the Persona screen. */
export function displayFocusedConceptsPersona() {
    if (!focusedConceptsDisplay) { console.error("Focused concepts display area not found."); return; }
    focusedConceptsDisplay.innerHTML = ''; // Clear previous
    updateFocusSlotsDisplay(); // Update header count
    const focused = State.getFocusedConcepts();
    const discovered = State.getDiscoveredConcepts();

    if (focused.size === 0) {
        focusedConceptsDisplay.innerHTML = `<div class="focus-placeholder">Focus Concepts from your Workshop Library (tap the ☆)</div>`;
        return;
    }

    focused.forEach(conceptId => {
        const conceptData = discovered.get(conceptId);
        if (conceptData?.concept) {
            const concept = conceptData.concept;
            const item = document.createElement('div');
            item.classList.add('focus-concept-item'); // Use generic item class
            item.dataset.conceptId = concept.id;
            item.title = `View Details: ${concept.name}`;
            item.style.cursor = 'pointer';

            let backgroundStyle = '';
            let imgErrorPlaceholder = '';
            if (concept.visualHandle) {
                const handle = concept.visualHandle;
                const extension = Config.UNLOCKED_ART_EXTENSION || '.jpg';
                const fileName = handle.includes('.') ? handle : `${handle}${extension}`;
                const imageUrl = `placeholder_art/${fileName}`;
                backgroundStyle = `background-image: url('${imageUrl}');`;
                item.classList.add('has-background-image');
                // Add hidden image for onerror handler
                imgErrorPlaceholder = `<img src="${imageUrl}" alt="" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none;" onerror="window.handleImageError(this)">`;
            }
            item.style = backgroundStyle;

            // Determine Icon based on Element or Type
            let iconClass = Utils.getCardTypeIcon(concept.cardType); // Default to type icon
            let iconColor = 'var(--text-muted-color)'; // Default color
            let iconTitle = concept.cardType;
            if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement]) {
                const elementNameKey = elementKeyToFullName[concept.primaryElement];
                iconClass = Utils.getElementIcon(elementNameKey); // Override with element icon
                iconColor = Utils.getElementColor(elementNameKey);
                iconTitle = Utils.getElementShortName(elementDetails[elementNameKey]?.name || elementNameKey); // Use short name from details
            }

            item.innerHTML = `
                <i class="${iconClass}" style="color: ${iconColor};" title="${iconTitle}"></i>
                <span class="name">${concept.name}</span>
                <span class="type">(${concept.cardType})</span>
                ${imgErrorPlaceholder}
            `;
            focusedConceptsDisplay.appendChild(item);
        } else {
            console.warn(`Focused concept ID ${conceptId} not found in discovered concepts map.`);
            const item = document.createElement('div');
            item.classList.add('focus-concept-item', 'missing');
            item.textContent = `Error: ID ${conceptId}`;
            focusedConceptsDisplay.appendChild(item);
        }
    });
    updateSuggestSceneButtonState(); // Update dependent buttons
}


/** Calls game logic to calculate and then displays the tapestry narrative. */
export function generateTapestryNarrative() {
    if (!tapestryNarrativeP) return;
    const narrativeHTML = GameLogic.calculateTapestryNarrative(); // Force recalc handled in logic
    tapestryNarrativeP.innerHTML = narrativeHTML || 'Mark concepts as "Focus" to generate narrative...';
    if (!tapestryNarrativeP.hasAttribute('aria-live')) tapestryNarrativeP.setAttribute('aria-live', 'polite');
}

/** Calculates and displays the dominant themes based on focused concepts. */
export function synthesizeAndDisplayThemesPersona() {
    if (!personaThemesList) { console.error("Persona themes list element not found."); return; }
    personaThemesList.innerHTML = ''; // Clear previous
    if (!personaThemesList.hasAttribute('aria-live')) personaThemesList.setAttribute('aria-live', 'polite');
    const themes = GameLogic.calculateFocusThemes(); // Includes RF

    if (themes.length === 0) {
        const placeholderText = State.getFocusedConcepts().size > 0 ? 'Focus is currently balanced across elements.' : 'Mark Focused Concepts to see dominant themes...';
        personaThemesList.innerHTML = `<li>${placeholderText}</li>`;
        return;
    }

    themes.slice(0, 3).forEach((theme, index) => { // Show top 3 themes
        const li = document.createElement('li');
        // theme.key is 'A'...'RF'
        const elementNameKey = elementKeyToFullName[theme.key]; // Get 'Attraction'...'RoleFocus'
        const color = Utils.getElementColor(elementNameKey);
        const icon = Utils.getElementIcon(elementNameKey);
        let emphasis = "Influenced by";
        if (index === 0 && theme.count >= 3) emphasis = "Strongly Focused on";
        else if (index === 0) emphasis = "Primarily Focused on";

        li.innerHTML = `<i class="${icon}" style="color: ${color}; margin-right: 5px;" title="${theme.name}"></i> ${emphasis} <strong>${theme.name}</strong> (${theme.count})`;
        li.style.borderLeft = `3px solid ${color}`;
        li.style.paddingLeft = '8px';
        li.style.marginBottom = '4px';
        personaThemesList.appendChild(li);
    });
}


/** Draws the radar chart for persona scores (including RF). */
export function drawPersonaChart(scores) {
    const canvas = personaScoreChartCanvas;
    if (!canvas) { console.error("Persona score chart canvas not found!"); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { console.error("Could not get canvas context for chart!"); return; }

    // Get computed styles for dynamic theming
    const computedStyle = getComputedStyle(document.documentElement);
    const pointLabelFont = computedStyle.fontFamily || 'Arial, sans-serif';
    const pointLabelColor = computedStyle.getPropertyValue('--text-muted-color').trim() || '#6c757d';
    const tickColor = computedStyle.getPropertyValue('--text-color').trim() || '#333';
    const gridColor = Utils.hexToRgba(computedStyle.getPropertyValue('--border-color-dark').trim() || '#adb5bd', 0.3);
    const chartBackgroundColor = Utils.hexToRgba(computedStyle.getPropertyValue('--background-light').trim() || '#f8f9fa', 0.8);

    // Prepare data (using elementNames ensures RF is included)
    const labels = elementNames.map(nameKey => Utils.getElementShortName(elementDetails[nameKey]?.name || nameKey));
    const dataPoints = elementNames.map(nameKey => {
        const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === nameKey);
        return scores[key] ?? 0; // Default to 0 if score missing
    });
    const borderColors = elementNames.map(nameKey => {
        // Attempt to get color from CSS variable first
        let colorVar = `--${nameKey.toLowerCase()}-color`;
        let adaptedColor = computedStyle.getPropertyValue(colorVar).trim();
        return adaptedColor || Utils.getElementColor(nameKey); // Fallback to util function
    });
    const backgroundColors = borderColors.map(color => Utils.hexToRgba(color, 0.4));

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Elemental Scores',
            data: dataPoints,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            pointBackgroundColor: borderColors,
            pointBorderColor: chartBackgroundColor, // Use chart bg for point border
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
                angleLines: { display: true, color: gridColor },
                grid: { color: gridColor },
                pointLabels: {
                    font: { size: 11, family: pointLabelFont, weight: 'bold' },
                    color: pointLabelColor
                },
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: {
                    stepSize: 2,
                    backdropColor: chartBackgroundColor, // Background for ticks
                    color: tickColor, // Tick number color
                    font: { weight: 'bold' } // Bold tick numbers
                }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { family: pointLabelFont, weight: 'bold' },
                bodyFont: { family: pointLabelFont },
                padding: 10,
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                displayColors: false, // Don't show color box in tooltip
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) { label += ': '; }
                        const score = context.parsed.r;
                        if (score !== null) {
                            label += `${score.toFixed(1)} (${Utils.getScoreLabel(score)})`;
                        }
                        return label;
                    }
                }
            }
        }
    };

    // Destroy previous chart instance if it exists
    if (personaChartInstance) {
        personaChartInstance.destroy();
    }
    // Create new chart instance
    personaChartInstance = new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: chartOptions
    });
}


/** Renders the content for the Persona Summary view (Includes RF). */
export function displayPersonaSummary() {
    if (!summaryContentDiv || !summaryCoreEssenceTextDiv || !summaryTapestryInfoDiv) { console.error("Summary view content divs not found!"); if(summaryContentDiv) summaryContentDiv.innerHTML = '<p>Error loading summary content elements.</p>'; return; }
    console.log("UI: Displaying Persona Summary");
    summaryCoreEssenceTextDiv.innerHTML = ''; summaryTapestryInfoDiv.innerHTML = '';
    const scores = State.getScores(); const focused = State.getFocusedConcepts(); const narrativeHTML = GameLogic.calculateTapestryNarrative(); const themes = GameLogic.calculateFocusThemes();

    // Core Essence Text (Iterate through all 7 elements)
    let coreEssenceHTML = '';
    if (elementDetails && elementKeyToFullName) {
        elementNames.forEach(elNameKey => { // Includes RF
            const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elNameKey);
            if (!key) { console.warn(`UI displayPersonaSummary: Could not find score key for element name: ${elNameKey}`); coreEssenceHTML += `<p><strong>${Utils.getElementShortName(elementDetails[elNameKey]?.name || elNameKey)}:</strong> Score lookup error.</p>`; return; }
            const score = scores[key];
            if (typeof score === 'number') {
                const label = Utils.getScoreLabel(score);
                const elementData = elementDetails[elNameKey] || {};
                const fullName = elementData.name || elNameKey;
                const interpretation = elementData.scoreInterpretations?.[label] || "N/A";
                coreEssenceHTML += `<p><strong>${Utils.getElementShortName(fullName)} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`;
            } else {
                const fullName = elementDetails[elNameKey]?.name || elNameKey;
                coreEssenceHTML += `<p><strong>${Utils.getElementShortName(fullName)}:</strong> Score not available.</p>`;
            }
        });
    } else { coreEssenceHTML += "<p>Error: Element details not loaded.</p>"; }
    summaryCoreEssenceTextDiv.innerHTML = coreEssenceHTML;

    // Tapestry Info
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
                const elementNameKey = elementKeyToFullName[theme.key]; // Includes RF
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

    // Draw Chart (Includes RF)
    drawPersonaChart(scores);
}


// --- Workshop Screen UI ---

/** Populates the Workshop screen, including research buttons and daily actions. */
export function displayWorkshopScreenContent() {
    if (!workshopScreen) return;
    // console.log(`UI: Populating Workshop Screen Content`); // Reduce noise
    if (userInsightDisplayWorkshop) { userInsightDisplayWorkshop.textContent = State.getInsight().toFixed(1); }
    if (elementResearchButtonsContainer) {
        elementResearchButtonsContainer.innerHTML = '';
        const scores = State.getScores();
        const freeResearchLeft = State.getInitialFreeResearchRemaining();
        const insight = State.getInsight();
        elementNames.forEach(elementNameKey => { // Includes RF
            const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elementNameKey);
            if (!key || !elementDetails[elementNameKey]) { console.warn(`UI displayWorkshopScreenContent: Skip render for missing data: ${elementNameKey}`); return; }
            const elementData = elementDetails[elementNameKey];
            const score = scores[key] ?? 5.0;
            const scoreLabel = Utils.getScoreLabel(score);
            const fullName = elementData.name || elementNameKey;
            const color = Utils.getElementColor(elementNameKey);
            const iconClass = Utils.getElementIcon(elementNameKey);
            const shortName = Utils.getElementShortName(fullName);

            const elementDiv = document.createElement('div');
            elementDiv.classList.add('initial-discovery-element');
            elementDiv.dataset.elementKey = key;

            let costText = "";
            let isDisabled = false;
            let titleText = "";
            let isFreeClick = false;
            const researchCost = Config.BASE_RESEARCH_COST;

            if (freeResearchLeft > 0) {
                costText = `Use 1 FREE ★`;
                titleText = `Conduct FREE research on ${shortName}. (${freeResearchLeft} left total)`;
                isFreeClick = true;
                isDisabled = false;
            } else {
                costText = `${researchCost} <i class="fas fa-brain insight-icon"></i>`;
                if (insight < researchCost) {
                    isDisabled = true;
                    titleText = `Research ${shortName} (Requires ${researchCost} Insight)`;
                } else {
                    isDisabled = false;
                    titleText = `Research ${shortName} (Cost: ${researchCost} Insight)`;
                }
                isFreeClick = false;
            }
            elementDiv.dataset.cost = researchCost;
            elementDiv.dataset.isFree = isFreeClick;

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

            elementDiv.innerHTML = `
                <div class="element-header">
                    <i class="${iconClass}" style="color: ${color};"></i>
                    <span class="element-name">${shortName}</span>
                </div>
                <div class="element-score-display">${score.toFixed(1)} (${scoreLabel})</div>
                <p class="element-concept">${elementData.coreConcept || '...'}</p>
                ${rarityCountsHTML}
                <div class="element-action ${isDisabled ? 'disabled' : ''}">
                    <span class="element-cost">${costText}</span>
                </div>
                ${isFreeClick ? `<span class="free-indicator" title="Free Research Available!">★</span>` : ''}`;
            elementDiv.title = titleText;
            elementDiv.classList.toggle('disabled', isDisabled);
            elementDiv.classList.toggle('clickable', !isDisabled);
            elementResearchButtonsContainer.appendChild(elementDiv);
        });
    } else { console.error("Element research buttons container #element-research-buttons not found!"); }

    // Update Daily Action buttons
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

/** Updates the Grimoire count in the drawer navigation. */
export function updateGrimoireCounter() {
    const count = State.getDiscoveredConcepts().size;
    // Update drawer count
    if (drawerGrimoireCountSpan) {
        drawerGrimoireCountSpan.textContent = count;
    }
}
/** Populates the filter dropdowns in the Grimoire controls. */
export function populateGrimoireFilters() { if (grimoireTypeFilterWorkshop) { grimoireTypeFilterWorkshop.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilterWorkshop.appendChild(option); }); } if (grimoireElementFilterWorkshop) { grimoireElementFilterWorkshop.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(elementNameKey => { const elementData = elementDetails[elementNameKey] || {}; const fullName = elementData.name || elementNameKey; const shortName = Utils.getElementShortName(fullName); const option = document.createElement('option'); option.value = elementNameKey; option.textContent = shortName; option.title = fullName; grimoireElementFilterWorkshop.appendChild(option); }); } }
/** Updates the count display on each Grimoire shelf. */
function updateShelfCounts() { if (!grimoireShelvesWorkshop) return; const conceptData = Array.from(State.getDiscoveredConcepts().values()); grimoireShelves.forEach(shelf => { const shelfElem = grimoireShelvesWorkshop.querySelector(`.grimoire-shelf[data-category-id="${shelf.id}"] .shelf-count`); if (shelfElem) { const count = conceptData.filter(data => (data.userCategory || 'uncategorized') === shelf.id).length; shelfElem.textContent = `(${count})`; } }); const showAllShelfCount = grimoireShelvesWorkshop.querySelector(`.show-all-shelf .shelf-count`); if (showAllShelfCount) { showAllShelfCount.textContent = `(${conceptData.length})`; } }
/** Displays the Grimoire library content based on filters and sorting. */
export function displayGrimoire(filterParams = {}) {
    const {
        filterType = "All",
        filterElement = "All", // Expects Name Key like "Attraction", "RoleFocus"
        sortBy = "discovered",
        filterRarity = "All",
        searchTerm = "",
        filterFocus = "All",
        filterCategory = "All" // Shelf ID
    } = filterParams;

    // Display Shelves
    if (grimoireShelvesWorkshop) {
        grimoireShelvesWorkshop.innerHTML = ''; // Clear existing
        // Add "Show All" Shelf
        const showAllDiv = document.createElement('div');
        showAllDiv.classList.add('grimoire-shelf', 'show-all-shelf');
        if (filterCategory === 'All') showAllDiv.classList.add('active-shelf');
        showAllDiv.innerHTML = `<h4>Show All Cards</h4><span class="shelf-count">(?)</span>`;
        showAllDiv.dataset.categoryId = 'All';
        grimoireShelvesWorkshop.appendChild(showAllDiv);
        // Add Defined Shelves
        grimoireShelves.forEach(shelf => {
            const shelfDiv = document.createElement('div');
            shelfDiv.classList.add('grimoire-shelf');
            shelfDiv.dataset.categoryId = shelf.id;
            if (filterCategory === shelf.id) shelfDiv.classList.add('active-shelf');
            // Apply styles dynamically based on category ID
            shelfDiv.style.backgroundColor = `var(--category-${shelf.id}-bg, transparent)`;
            shelfDiv.style.border = `1px solid var(--category-${shelf.id}-border, var(--border-color-light))`;
            shelfDiv.innerHTML = `
                <h4>${shelf.name} <i class="fas fa-info-circle info-icon" title="${shelf.description || ''}"></i></h4>
                <span class="shelf-count">(?)</span>`;
            grimoireShelvesWorkshop.appendChild(shelfDiv);
        });
    } else { console.error("Grimoire shelves container #grimoire-shelves-workshop not found."); }

    // Display Cards
    const targetCardContainer = grimoireGridWorkshop;
    if (!targetCardContainer) { console.error("#grimoire-grid-workshop element not found for cards."); return; }
    targetCardContainer.innerHTML = ''; // Clear previous cards

    const discoveredMap = State.getDiscoveredConcepts();
    if (discoveredMap.size === 0) {
        targetCardContainer.innerHTML = '<p>Your Grimoire Library is empty... Discover Concepts using the Research Bench!</p>';
        updateShelfCounts(); // Update counts even if empty
        return;
    }

    const userScores = State.getScores();
    const focusedSet = State.getFocusedConcepts();
    let discoveredArray = Array.from(discoveredMap.values());

    // Filtering
    const searchTermLower = searchTerm.toLowerCase().trim();
    const conceptsToDisplay = discoveredArray.filter(data => {
        if (!data?.concept) return false;
        const concept = data.concept;
        const userCategory = data.userCategory || 'uncategorized';

        const typeMatch = (filterType === "All") || (concept.cardType === filterType);
        // Element filter uses Name Key ("Attraction", "RoleFocus") from dropdown value
        let elementMatch = (filterElement === "All");
        if (!elementMatch) {
            // Convert filter name key ("Attraction") back to single letter key ('A') for comparison
             const filterLetterKey = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === filterElement);
             elementMatch = (concept.primaryElement === filterLetterKey);
        }
        const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);
        const focusMatch = (filterFocus === 'All') || (filterFocus === 'Focused' && focusedSet.has(concept.id)) || (filterFocus === 'Not Focused' && !focusedSet.has(concept.id));
        const searchMatch = !searchTermLower ||
                            (concept.name.toLowerCase().includes(searchTermLower)) ||
                            (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTermLower))) ||
                            (concept.briefDescription?.toLowerCase().includes(searchTermLower));
        const categoryMatch = (filterCategory === 'All') || (userCategory === filterCategory);

        return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch && categoryMatch;
    });

    // Sorting
    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
    conceptsToDisplay.sort((a, b) => {
        if (!a?.concept || !b?.concept) return 0;
        const conceptA = a.concept;
        const conceptB = b.concept;
        switch (sortBy) {
            case 'name': return conceptA.name.localeCompare(conceptB.name);
            case 'type': return (cardTypeKeys.indexOf(conceptA.cardType) - cardTypeKeys.indexOf(conceptB.cardType)) || conceptA.name.localeCompare(conceptB.name);
            case 'rarity': return (rarityOrder[conceptB.rarity] || 0) - (rarityOrder[conceptA.rarity] || 0) || conceptA.name.localeCompare(conceptB.name);
            case 'resonance':
                // Calculate distance only if not already cached on the object (e.g., from previous sort)
                // Ensure elementScores exist before calculating distance
                const distA = (a.concept?.elementScores) ? (a.distance ?? Utils.euclideanDistance(userScores, a.concept.elementScores, a.concept.name)) : Infinity;
                const distB = (b.concept?.elementScores) ? (b.distance ?? Utils.euclideanDistance(userScores, b.concept.elementScores, b.concept.name)) : Infinity;
                a.distance = distA; // Cache distance for potential reuse
                b.distance = distB;
                // Handle Infinity cases (put them last)
                if (distA === Infinity && distB !== Infinity) return 1;
                if (distA !== Infinity && distB === Infinity) return -1;
                if (distA === Infinity && distB === Infinity) return conceptA.name.localeCompare(conceptB.name); // Sort by name if both Infinity
                return distA - distB || conceptA.name.localeCompare(conceptB.name); // Sort by distance ascending
            case 'discovered': // Default
            default:
                return (b.discoveredTime || 0) - (a.discoveredTime || 0) || conceptA.name.localeCompare(conceptB.name); // Sort by time descending
        }
    });


    // Rendering
    if (conceptsToDisplay.length === 0) {
        const shelfName = filterCategory !== 'All' ? `'${grimoireShelves.find(s=>s.id===filterCategory)?.name || filterCategory}' shelf` : '';
        targetCardContainer.innerHTML = `<p>No discovered concepts match the current filters${searchTerm ? ' or search term' : ''}${shelfName ? ` on the ${shelfName}` : ''}.</p>`;
    } else {
        conceptsToDisplay.forEach(data => {
            const cardElement = renderCard(data.concept, 'grimoire', data);
            if (cardElement) {
                cardElement.draggable = true; // Enable dragging for categorization
                cardElement.dataset.conceptId = data.concept.id; // Ensure ID is set for drop logic
                targetCardContainer.appendChild(cardElement);
            }
        });
    }

    updateShelfCounts(); // Update counts after rendering cards
}
/** Refreshes the Grimoire display based on current filter/sort control values. */
export function refreshGrimoireDisplay(overrideFilters = {}) { if (workshopScreen && !workshopScreen.classList.contains('hidden')) { const currentFilters = { filterType: grimoireTypeFilterWorkshop?.value || "All", filterElement: grimoireElementFilterWorkshop?.value || "All", // Value is Name Key ("Attraction")
            sortBy: grimoireSortOrderWorkshop?.value || "discovered", filterRarity: grimoireRarityFilterWorkshop?.value || "All", searchTerm: grimoireSearchInputWorkshop?.value || "", filterFocus: grimoireFocusFilterWorkshop?.value || "All", // Get active shelf ID, default to "All"
            filterCategory: overrideFilters.filterCategory !== undefined ? overrideFilters.filterCategory : document.querySelector('#grimoire-shelves-workshop .grimoire-shelf.active-shelf')?.dataset.categoryId || "All" }; const finalFilters = { ...currentFilters, ...overrideFilters }; console.log("Refreshing Grimoire with filters:", finalFilters); displayGrimoire(finalFilters); } }
/** Renders a single concept card element. */
export function renderCard(concept, context = 'grimoire', discoveredData = null) {
    if (!concept || typeof concept.id === 'undefined') { console.warn("renderCard called with invalid concept:", concept); const eDiv = document.createElement('div'); eDiv.textContent = "Error: Invalid Concept Data"; eDiv.classList.add('concept-card', 'error'); return eDiv; }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card', `rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = (context === 'grimoire') ? `View Details: ${concept.name}` : concept.name;

    const isDiscovered = context === 'grimoire' && !!discoveredData;
    const isFocused = isDiscovered && State.getFocusedConcepts().has(concept.id);
    const hasNewLore = isDiscovered && (discoveredData?.newLoreAvailable || false);
    const userCategory = isDiscovered ? (discoveredData?.userCategory || 'uncategorized') : 'uncategorized';

    // Visual Content (Image or Placeholder)
    let visualContentHTML = '';
    if (context === 'grimoire') { // Only show visual in Grimoire context card
        const placeholderIconHTML = `<i class="fas fa-image card-visual-placeholder" title="Visual Placeholder"></i>`;
        if (concept.visualHandle) {
            const handle = concept.visualHandle;
            const fileName = handle.includes('.') ? handle : `${handle}${Config.UNLOCKED_ART_EXTENSION || '.jpg'}`;
            const imageUrl = `placeholder_art/${fileName}`;
            visualContentHTML = `
                <img src="${imageUrl}" alt="${concept.name} Art" class="card-art-image" loading="lazy" onerror="window.handleImageError(this)">
                <i class="fas fa-image card-visual-placeholder" style="display: none;" title="Art Placeholder (Load Failed)"></i>`; // Start placeholder hidden
        } else {
            visualContentHTML = placeholderIconHTML;
        }
        visualContentHTML = `<div class="card-visual">${visualContentHTML}</div>`;
    }

    // Stamps (Focus, Lore)
    const focusStampHTML = (context === 'grimoire' && isFocused) ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const loreStampHTML = (context === 'grimoire' && hasNewLore) ? '<span class="lore-indicator" title="New Lore Unlocked!"><i class="fas fa-scroll"></i></span>' : '';
    const cardStampsHTML = `<span class="card-stamps">${focusStampHTML}${loreStampHTML}</span>`;

    // Rarity Indicator
    let rarityText = concept.rarity ? concept.rarity.charAt(0).toUpperCase() + concept.rarity.slice(1) : 'Common';
    let rarityClass = `rarity-indicator-${concept.rarity || 'common'}`;
    const rarityIndicatorHTML = `<span class="card-rarity ${rarityClass}" title="Rarity: ${rarityText}">${rarityText}</span>`;

    // Card Header Right Area
    const cardHeaderRightHTML = `<span class="card-header-right">${rarityIndicatorHTML}${cardStampsHTML}</span>`;

    // Primary Element Display
    let primaryElementHTML = '<small class="no-element">No Primary Element</small>';
    if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement]) {
        const primaryKey = concept.primaryElement; // 'A'...'RF'
        const elementNameKey = elementKeyToFullName[primaryKey]; // 'Attraction'...'RoleFocus'
        const elementData = elementDetails[elementNameKey] || {};
        const descriptiveName = elementData.name || elementNameKey;
        const color = Utils.getElementColor(elementNameKey);
        const icon = Utils.getElementIcon(elementNameKey);
        const nameShort = Utils.getElementShortName(descriptiveName);
        primaryElementHTML = `<span class="primary-element-display" style="color: ${color}; border-color: ${Utils.hexToRgba(color, 0.5)}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="Primary Element: ${descriptiveName}"><i class="${icon}"></i> ${nameShort}</span>`;
    }

    // Action Buttons (Only in Grimoire context)
    let actionButtonsHTML = '';
    if (context === 'grimoire') {
        actionButtonsHTML += '<div class="card-actions">';
        let hasActions = false;
        const showSellButtonOnCard = isDiscovered;
        const showFocusButtonOnCard = isDiscovered;

        if (showSellButtonOnCard) {
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
            const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            actionButtonsHTML += `<button class="button tiny-button secondary-button sell-button card-sell-button btn" data-concept-id="${concept.id}" data-context="grimoire" title="Sell (${sellValue.toFixed(1)} Insight)"><i class="fas fa-dollar-sign"></i></button>`;
            hasActions = true;
        }
        if (showFocusButtonOnCard) {
            const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
            const buttonClass = isFocused ? 'marked' : '';
            const buttonIcon = isFocused ? 'fa-star' : 'fa-regular fa-star'; // Use filled/regular star
            const buttonTitle = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove Focus' : 'Mark as Focus');
            actionButtonsHTML += `<button class="button tiny-button card-focus-button ${buttonClass} btn" data-concept-id="${concept.id}" title="${buttonTitle}" ${slotsFull ? 'disabled' : ''}><i class="fas ${buttonIcon}"></i></button>`;
            hasActions = true;
        }
        actionButtonsHTML += '</div>';
        if (!hasActions) actionButtonsHTML = ''; // Remove container if no actions
    }

    // Assemble Card HTML
    cardDiv.innerHTML = `
        <div class="card-header">
            <span class="card-type-icon-area"><i class="${Utils.getCardTypeIcon(concept.cardType)}" title="${concept.cardType}"></i></span>
            <span class="card-name">${concept.name}</span>
            ${cardHeaderRightHTML}
        </div>
        ${visualContentHTML}
        <div class="card-footer">
            <div class="card-affinities">${primaryElementHTML}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
            ${actionButtonsHTML}
        </div>
    `;

    // Add category class for styling left border
    if (context === 'grimoire') {
        cardDiv.classList.add(`category-${userCategory}`);
    }
    // Special styling for cards in research popup
    if (context === 'popup-result') {
        cardDiv.classList.add('popup-result-card');
        cardDiv.querySelector('.card-footer').style.paddingBottom = '0px';
        cardDiv.querySelector('.card-brief-desc').style.display = 'block'; // Ensure brief desc is block
        cardDiv.querySelector('.card-brief-desc').style.minHeight = 'calc(1.4em * 1)'; // Adjust min height if needed
        cardDiv.querySelector('.card-affinities').style.marginBottom = '5px';
    }

    return cardDiv;
}

// --- Concept Detail Popup UI --- (Includes Resonance Gauge, Related Tags, Recipe Comparison, Lore, Notes, Buttons)
// ... (displayPopupResonanceGauge, displayPopupRelatedConceptsTags, etc. remain the same) ...
// ... (Make sure displayPopupRecipeComparison uses elementNames for iteration) ...
// --- Research Popup ---
// ... (displayResearchResults, handleResearchPopupAction remain the same) ...
// --- Reflection Modal UI ---
// ... (displayReflectionPrompt remains the same) ...
// --- Integrated Element Deep Dive UI (Inside Persona Screen Accordion) ---
// ... (displayElementDeepDive remains the same) ...
// --- Repository UI ---
// ... (displayRepositoryContent, renderRepositoryItem remain the same) ...
// --- Milestones UI ---
// ... (displayMilestones remains the same) ...
// --- Rituals Display (Targets Repository) ---
// ... (displayDailyRituals remains the same) ...
// --- Settings Popup UI ---
// ... (showSettings remains the same) ...
// --- Tapestry Deep Dive / Resonance Chamber UI ---
// ... (displayTapestryDeepDive, displaySynergyTensionInfo, updateContemplationButtonState, updateDeepDiveContent, displayContemplationTask, clearContemplationTask remain the same) ...
// --- Elemental Dilemma Modal Display ---
// ... (displayElementalDilemma remains the same) ...

// --- Initial UI Setup Helper ---
/** Sets up the initial state of the UI on load. */
export function setupInitialUI() { console.log("UI: Setting up initial UI state");
    // Hide screens by default, show welcome or resume Q
    screens.forEach(s => s?.classList.add('hidden'));
    getElement('welcomeScreen')?.classList.remove('hidden', 'current'); // Ensure welcome starts hidden if resuming
    getElement('questionnaireScreen')?.classList.add('hidden');

    // Hide drawer initially
    if (sideDrawer) sideDrawer.setAttribute('aria-hidden', 'true');
    if (drawerToggle) drawerToggle.setAttribute('aria-expanded', 'false');

    // Check for saved game to enable Load button
    if (loadButton) { loadButton.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY)); } else { console.warn("Load button element not found during initial setup."); }

    // Set initial state for Persona action buttons
    updateSuggestSceneButtonState(); // Moved definition to module scope
    updateElementalDilemmaButtonState(); // Moved definition to module scope
    updateExploreSynergyButtonStatus('none'); // Moved definition to module scope
    updateInsightBoostButtonState(); // Already module scope
    populateGrimoireFilters(); // Already module scope
    updateDrawerLinks(); // FIX 4: Ensure drawer links are correct initially

    // Apply theme
    if (localStorage.getItem('theme') === 'dark') { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); }
}


// --- Onboarding UI ---
/** Displays the onboarding popup for a specific phase. */
export function showOnboarding(phase) { if (!onboardingOverlay || !onboardingPopup || !onboardingContent || !onboardingProgressSpan || !onboardingPrevButton || !onboardingNextButton || !onboardingSkipButton) { console.error("Onboarding UI elements missing! Cannot show onboarding."); State.markOnboardingComplete(); hideOnboarding(); return; } if (phase <= 0 || phase > Config.MAX_ONBOARDING_PHASE || State.isOnboardingComplete()) { hideOnboarding(); return; } const task = onboardingTasks.find(t => t.phaseRequired === phase); if (!task) { console.warn(`Onboarding task for phase ${phase} not found. Completing onboarding.`); State.markOnboardingComplete(); hideOnboarding(); return; } console.log(`UI: Showing onboarding phase ${phase}`); const taskText = task.description || task.text || 'Follow the instructions...'; onboardingContent.innerHTML = `<p>${taskText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`; if (task.hint) { onboardingContent.innerHTML += `<p><small><em>Hint: ${task.hint}</em></small></p>`; } onboardingProgressSpan.textContent = `Step ${phase} of ${Config.MAX_ONBOARDING_PHASE}`; onboardingPrevButton.disabled = (phase === 1); onboardingNextButton.textContent = (phase === Config.MAX_ONBOARDING_PHASE) ? "Finish Orientation" : "Next"; onboardingOverlay.classList.add('visible'); onboardingOverlay.classList.remove('hidden'); onboardingPopup.classList.remove('hidden'); onboardingOverlay.removeAttribute('aria-hidden'); popupOverlay?.classList.add('hidden'); // Hide standard overlay
    requestAnimationFrame(() => { updateOnboardingHighlight(task.highlightElementId); }); }
/** Hides the onboarding overlay and popup. */
export function hideOnboarding() { if (onboardingOverlay) { onboardingOverlay.classList.remove('visible'); onboardingOverlay.classList.add('hidden'); onboardingOverlay.setAttribute('aria-hidden', 'true'); } if (onboardingPopup) { onboardingPopup.classList.add('hidden'); } if (onboardingHighlight) { onboardingHighlight.style.display = 'none'; } updateDrawerLinks(); // Ensure correct links shown after onboarding hides
     console.log("UI: Onboarding hidden."); }
/** Updates the position and visibility of the onboarding highlight element. */
function updateOnboardingHighlight(elementId) { if (!onboardingHighlight) { console.warn("Onboarding highlight element missing"); return; } const targetElement = elementId ? getElement(elementId) : null; if (targetElement && targetElement.offsetParent !== null) { const rect = targetElement.getBoundingClientRect(); onboardingHighlight.style.left = `${rect.left - 5 + window.scrollX}px`; onboardingHighlight.style.top = `${rect.top - 5 + window.scrollY}px`; onboardingHighlight.style.width = `${rect.width + 10}px`; onboardingHighlight.style.height = `${rect.height + 10}px`; onboardingHighlight.style.display = 'block'; // Ensure it's block, not flex
    // Smooth scroll with check for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    targetElement.scrollIntoView({ behavior: mediaQuery.matches ? 'auto' : 'smooth', block: 'center', inline: 'nearest' }); console.log(`UI: Highlighting element: #${elementId}`); } else { onboardingHighlight.style.display = 'none'; if(elementId) console.log(`UI: Cannot highlight hidden/missing element: #${elementId}`); } }

// --- Update Note Save Status ---
/** Displays a temporary status message after saving a note. */
export function updateNoteSaveStatus(message, isError = false) { if (noteSaveStatusSpan) { noteSaveStatusSpan.textContent = message; noteSaveStatusSpan.className = 'note-status'; if (isError) noteSaveStatusSpan.classList.add('error'); setTimeout(() => { if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; }, 2500); } }

// --- Theme Toggle ---
/** Handles the theme toggle action */
export function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark');
    const currentTheme = root.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    console.log(`Theme set to: ${currentTheme}`);
    // Redraw chart if visible, as colors change
    if (personaSummaryView?.classList.contains('current')) {
        drawPersonaChart(State.getScores());
    }
}

console.log("ui.js loaded successfully. (Enhanced v4.10 + Drawer/Accordion/Layout Fixes)");
// --- END OF FILE ui.js ---
