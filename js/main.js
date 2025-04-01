// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
import * as Utils from './utils.js';
import * as Config from './config.js';
// Import Data selectively if needed, or assume it's globally available via data.js script tag loading first
import * as Data from '../data.js';

console.log("main.js loading...");

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab v13+...");

    // Ensure data is ready before proceeding
    if (!Utils.isDataReady()) {
        console.error("Data not ready during initialization. Aborting.");
        // Display a critical error message to the user?
        document.body.innerHTML = "<h1>Error</h1><p>Failed to load core application data. Please refresh or check the console.</p>";
        return;
    }
    console.log("Data check passed.");

    // Attempt to load game state
    const loaded = State.loadGameState();

    if (loaded) {
        console.log("Existing session loaded.");
         // If loaded and questionnaire complete, skip to main app
         if (State.getState().questionnaireCompleted) {
              console.log("Questionnaire already completed, skipping to Persona screen.");
              GameLogic.checkForDailyLogin(); // Check daily login status
              UI.updateInsightDisplays();
              UI.updateFocusSlotsDisplay();
              UI.updateGrimoireCounter();
              UI.populateGrimoireFilters();
              // UI.displayPersonaScreen(); // Called by showScreen
              // UI.displayStudyScreenContent(); // Called by showScreen
              UI.displayDailyRituals();
              // UI.displayRepositoryContent(); // Called by showScreen
              UI.refreshGrimoireDisplay(); // Display initial grimoire
              UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); // Apply UI state based on loaded phase
              UI.showScreen('personaScreen'); // Start on Persona screen
              UI.hidePopups(); // Ensure no popups are open on load
         } else {
              console.log("Loaded state is incomplete (questionnaire not finished). Restarting questionnaire.");
              // Restart questionnaire but keep loaded state where relevant (like insight?)
              // For now, let's just restart questionnaire clean:
              // State.clearGameState(); // Or selectively keep parts? Let's clear for simplicity now.
              // UI.initializeQuestionnaireUI();
              // Instead of full clear, maybe just reset questionnaire part of state?
              State.updateElementIndex(0); // Start questionnaire over
              UI.initializeQuestionnaireUI();
               UI.showScreen('questionnaireScreen');
         }
         if(document.getElementById('loadButton')) document.getElementById('loadButton').classList.add('hidden');
    } else {
        console.log("No valid saved session found. Starting fresh.");
        // Setup initial UI for a new game (Welcome Screen)
        UI.setupInitialUI();
    }

    // Setup common UI elements (like insight display which might be needed even on welcome)
    UI.updateInsightDisplays();

    console.log("Initialization complete. Attaching event listeners.");
    attachEventListeners();
    console.log("Application ready.");
}

// --- Event Listeners ---
function attachEventListeners() {
    console.log("Attaching event listeners...");

    // Welcome Screen
    const startButton = document.getElementById('startGuidedButton');
    const loadButton = document.getElementById('loadButton');
    if (startButton) startButton.addEventListener('click', () => {
        State.clearGameState(); // Start fresh
        UI.initializeQuestionnaireUI();
        UI.showScreen('questionnaireScreen');
        if(loadButton) loadButton.classList.add('hidden');
    });
    if (loadButton) loadButton.addEventListener('click', () => {
        // Reload state logic already handled in initializeApp
        // Just need to hide the button if clicked after initial load failed
         if(State.loadGameState()){
            if (State.getState().questionnaireCompleted) {
                 GameLogic.checkForDailyLogin();
                 UI.applyOnboardingPhaseUI(State.getOnboardingPhase());
                 UI.showScreen('personaScreen');
            } else {
                UI.initializeQuestionnaireUI();
                 UI.showScreen('questionnaireScreen');
            }
            loadButton.classList.add('hidden');
         } else {
             // This case should technically not happen if button is hidden on failed initial load
             UI.showTemporaryMessage("Load failed. Starting new session.", 3000);
              State.clearGameState();
              UI.initializeQuestionnaireUI();
              UI.showScreen('questionnaireScreen');
              loadButton.classList.add('hidden');
         }

    });

    // Questionnaire Navigation
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // Main Navigation
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        // Exclude settings button from screen switching
        if(!button.classList.contains('settings-button')) {
             button.addEventListener('click', () => {
                 const targetScreenId = button.dataset.target;
                 if (targetScreenId) UI.showScreen(targetScreenId);
             });
        }
    });
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) settingsBtn.addEventListener('click', UI.showSettings);


    // Popups & Modals
    const closePopupBtn = document.getElementById('closePopupButton');
    const overlay = document.getElementById('popupOverlay');
    const closeReflectionBtn = document.getElementById('closeReflectionModalButton');
    const closeSettingsBtn = document.getElementById('closeSettingsPopupButton');
    const closeMilestoneBtn = document.getElementById('closeMilestoneAlertButton');
    if (closePopupBtn) closePopupBtn.addEventListener('click', UI.hidePopups);
    if (overlay) overlay.addEventListener('click', UI.hidePopups);
    if (closeReflectionBtn) closeReflectionBtn.addEventListener('click', UI.hidePopups);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (closeMilestoneBtn) closeMilestoneBtn.addEventListener('click', UI.hideMilestoneAlert);

    // Concept Detail Popup Actions
    const addGrimoireBtn = document.getElementById('addToGrimoireButton');
    const focusBtn = document.getElementById('markAsFocusButton');
    const evolveBtn = document.getElementById('evolveArtButton');
    const saveNoteBtn = document.getElementById('saveMyNoteButton');
    if (addGrimoireBtn) addGrimoireBtn.addEventListener('click', () => {
        const conceptId = GameLogic.getCurrentPopupConceptId();
        if (conceptId !== null) GameLogic.addConceptToGrimoireById(conceptId, addGrimoireBtn);
    });
    if (focusBtn) focusBtn.addEventListener('click', GameLogic.handleToggleFocusConcept);
    if (evolveBtn) evolveBtn.addEventListener('click', GameLogic.attemptArtEvolution);
    if (saveNoteBtn) saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);

     // Use event delegation for dynamically added sell buttons in popup
     const popupActionsDiv = document.querySelector('#conceptDetailPopup .popup-actions');
     if(popupActionsDiv) {
          popupActionsDiv.addEventListener('click', (event) => {
                if (event.target.matches('.popup-sell-button')) {
                     GameLogic.handleSellConcept(event);
                }
          });
     }


    // Grimoire Filters & Card Interaction (Sell Button)
    const grimoireControls = document.getElementById('grimoireControls');
    if (grimoireControls) {
        grimoireControls.addEventListener('change', UI.refreshGrimoireDisplay);
    }
    const grimoireContent = document.getElementById('grimoireContent');
    if (grimoireContent) {
        // Event delegation for sell buttons on cards within the grimoire
        grimoireContent.addEventListener('click', (event) => {
            if (event.target.matches('.card-sell-button')) {
                 event.stopPropagation(); // Prevent card click popup
                 GameLogic.handleSellConcept(event);
            }
             // Could also delegate card clicks here instead of in renderCard
            // else if (event.target.closest('.concept-card')) {
            //     const card = event.target.closest('.concept-card');
            //     const conceptId = parseInt(card.dataset.conceptId);
            //     if (!isNaN(conceptId)) UI.showConceptDetailPopup(conceptId);
            // }
        });
    }


    // Reflection Modal
    const reflectionCheck = document.getElementById('reflectionCheckbox');
    const confirmReflectionBtn = document.getElementById('confirmReflectionButton');
    if (reflectionCheck) reflectionCheck.addEventListener('change', () => {
        if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked;
    });
    if (confirmReflectionBtn) confirmReflectionBtn.addEventListener('click', () => {
        const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox');
        GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false);
    });

    // Study Actions
    const researchContainer = document.getElementById('researchButtonContainer');
    const freeResearchBtn = document.getElementById('freeResearchButton');
    const guidanceBtn = document.getElementById('seekGuidanceButton');
    if (researchContainer) {
        // Delegate clicks for dynamically added research buttons
        researchContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.research-button');
            if (button) GameLogic.handleResearchClick({ currentTarget: button }); // Pass event-like object
        });
    }
     if (freeResearchBtn) freeResearchBtn.addEventListener('click', GameLogic.handleFreeResearchClick);
     if (guidanceBtn) guidanceBtn.addEventListener('click', GameLogic.triggerGuidedReflection);

    // Research Output Actions (Add/Sell buttons added dynamically)
    const researchOutputArea = document.getElementById('researchOutput');
    if (researchOutputArea) {
        researchOutputArea.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;

            const conceptIdStr = button.dataset.conceptId;
            if (!conceptIdStr) return;
            const conceptId = parseInt(conceptIdStr);
            if (isNaN(conceptId)) return;

            if (button.classList.contains('add-button')) {
                GameLogic.addConceptToGrimoireById(conceptId, button);
            } else if (button.classList.contains('sell-button')) {
                GameLogic.handleSellConcept(event); // Pass event for context
            }
        });
    }

     // Element Library (Button clicks)
     const libraryButtonsContainer = document.getElementById('elementLibraryButtons');
     if (libraryButtonsContainer) {
          libraryButtonsContainer.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (button && button.dataset.elementKey) {
                     UI.displayElementDeepDive(button.dataset.elementKey);
                }
          });
     }
      // Element Library (Unlock clicks - delegated)
     const libraryContentContainer = document.getElementById('elementLibraryContent');
      if (libraryContentContainer) {
           libraryContentContainer.addEventListener('click', (event) => {
                 if (event.target.matches('.unlock-button')) {
                      GameLogic.handleUnlockLibraryLevel(event);
                 }
           });
      }

     // Repository Actions (Delegated)
     const repositoryContainer = document.getElementById('repositoryScreen');
     if (repositoryContainer) {
          repositoryContainer.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (!button) return;

                if (button.dataset.sceneId) {
                     GameLogic.handleMeditateScene(event);
                } else if (button.dataset.experimentId) {
                     GameLogic.handleAttemptExperiment(event);
                }
          });
     }


    // Settings Popup Actions
    const forceSaveBtn = document.getElementById('forceSaveButton');
    const resetBtn = document.getElementById('resetAppButton');
    if (forceSaveBtn) forceSaveBtn.addEventListener('click', () => {
        State.saveGameState();
        UI.showTemporaryMessage("Game Saved!", 1500);
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (confirm("Reset ALL progress, including scores, Grimoire, and unlocked content? This cannot be undone.")) {
             console.log("Resetting application...");
             State.clearGameState();
             // Re-initialize the UI completely
             UI.setupInitialUI();
             // Hide popups just in case
             UI.hidePopups();
             UI.showTemporaryMessage("Progress Reset!", 3000);
             if(document.getElementById('loadButton')) document.getElementById('loadButton').classList.add('hidden');
        }
    });

     // Persona View Toggle Buttons
     const detailedViewBtn = document.getElementById('showDetailedViewBtn');
     const summaryViewBtn = document.getElementById('showSummaryViewBtn');
     const personaDetailedDiv = document.getElementById('personaDetailedView');
     const personaSummaryDiv = document.getElementById('personaSummaryView');

     if(detailedViewBtn && summaryViewBtn && personaDetailedDiv && personaSummaryDiv) {
          detailedViewBtn.addEventListener('click', () => {
                personaDetailedDiv.classList.add('current');
                personaDetailedDiv.classList.remove('hidden');
                personaSummaryDiv.classList.add('hidden');
                personaSummaryDiv.classList.remove('current');
                detailedViewBtn.classList.add('active');
                summaryViewBtn.classList.remove('active');
          });
          summaryViewBtn.addEventListener('click', () => {
                personaSummaryDiv.classList.add('current');
                personaSummaryDiv.classList.remove('hidden');
                personaDetailedDiv.classList.add('hidden');
                personaDetailedDiv.classList.remove('current');
                summaryViewBtn.classList.add('active');
                detailedViewBtn.classList.remove('active');
                UI.displayPersonaSummary(); // Ensure summary content is up-to-date
          });
     }


    console.log("Event listeners attached.");
}

// --- Start the App ---
// Ensure DOM is ready, then initialize. Using DOMContentLoaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp(); // DOM is already ready
}

console.log("main.js loaded.");
