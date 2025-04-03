// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
import * as Config from './config.js'; // Ensure Config and TUTORIAL_STEP are imported

console.log("main.js loading...");

// --- Helper Function (Maps tutorial steps to their primary screen) ---
// This helps determine where to navigate *before* showing the tutorial modal
function getTutorialTargetScreen(stepId) {
    switch (stepId) {
        case Config.TUTORIAL_STEP.START:
            return 'questionnaireScreen'; // Or 'welcomeScreen' if starting before questionnaire
        case Config.TUTORIAL_STEP.RESULTS_MODAL:
            // This step shows a modal *after* questionnaire, before any main screen
            // The transition happens *from* the modal, so no target screen needed here.
            // We might default to personaScreen conceptually after this modal.
            return 'personaScreen';
        case Config.TUTORIAL_STEP.GRIMOIRE_INTRO:
        case Config.TUTORIAL_STEP.CONCEPT_POPUP_INTRO: // Popup explained when Grimoire is shown
            return 'grimoireScreen';
        case Config.TUTORIAL_STEP.FOCUS_INTRO:
            return 'personaScreen';
        case Config.TUTORIAL_STEP.STUDY_INTRO:
        case Config.TUTORIAL_STEP.SELL_INTRO: // Selling likely introduced via Study/Research results
            return 'studyScreen';
        case Config.TUTORIAL_STEP.REFLECTION_INTRO:
            // Reflection modal appears over other screens, no specific target needed for the *introduction*
            // but might often first occur after Study actions. Let's target study for setup.
            return 'studyScreen';
        case Config.TUTORIAL_STEP.REPOSITORY_INTRO:
            return 'repositoryScreen';
        case Config.TUTORIAL_STEP.COMPLETE:
            return 'personaScreen'; // Default screen after tutorial
        default:
            console.warn(`getTutorialTargetScreen: Unknown stepId '${stepId}', defaulting to personaScreen.`);
            return 'personaScreen';
    }
}


// --- Initialization ---
async function initializeApp() {
    console.log("Initializing Persona Alchemy Lab (v14+ Flow)...");

    const loaded = State.loadGameState(); // Attempt to load game state

    // Update basic displays immediately after state is available
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter();

    if (loaded) {
        console.log("Existing session loaded.");
        const questionnaireComplete = State.isQuestionnaireComplete();
        const tutorialStep = State.getOnboardingTutorialStep();
        const currentPhase = State.getOnboardingPhase();

        if (!questionnaireComplete) {
            console.log("Resuming questionnaire...");
            const currentIdx = State.getCurrentElementIndex();
            // Ensure index is valid for resuming questionnaire
            State.updateElementIndex(currentIdx >= 0 ? currentIdx : 0);
            UI.initializeQuestionnaireUI(); // Setup questionnaire UI
            UI.displayElementQuestions(State.getCurrentElementIndex()); // Display correct questions
            UI.showScreen('questionnaireScreen'); // Show the questionnaire screen
            if(loadButton) loadButton.classList.add('hidden');
        } else {
            // Questionnaire is complete, check tutorial status
            if (tutorialStep !== Config.TUTORIAL_STEP.COMPLETE) {
                console.log(`Resuming tutorial at step: ${tutorialStep}`);
                // Determine the screen context for the current tutorial step
                const targetScreen = getTutorialTargetScreen(tutorialStep);
                console.log(`Tutorial step ${tutorialStep} targets screen: ${targetScreen}`);

                // Pre-load necessary data for the target screen environment
                // (This avoids loading everything if only the Grimoire is needed first)
                 UI.populateGrimoireFilters(); // Needed early
                 if (targetScreen === 'personaScreen' || targetScreen === 'grimoireScreen') {
                    await GameLogic.calculateTapestryNarrative(true); // Ensure analysis is ready if needed
                 }
                 if (targetScreen === 'studyScreen') {
                    UI.displayResearchButtons();
                    UI.displayDailyRituals();
                 }
                 if (targetScreen === 'repositoryScreen') {
                     UI.displayMilestones();
                     UI.displayRepositoryContent(); // Load repo content if starting there
                 }
                 if (targetScreen === 'grimoireScreen') {
                    UI.refreshGrimoireDisplay(); // Render grimoire content if starting there
                 }
                  if (targetScreen === 'personaScreen') {
                     UI.displayPersonaScreen(); // Render persona screen if starting there
                 }

                 // Apply general UI visibility based on the *overall* game phase reached so far
                 UI.applyOnboardingPhaseUI(currentPhase);

                 // CRITICAL: Show the tutorial step INSTEAD of navigating directly
                 UI.showTutorialStep(tutorialStep); // This function will handle showing the modal/highlight

            } else {
                // Tutorial is complete, resume normal gameplay
                console.log("Tutorial complete. Resuming normal gameplay.");
                GameLogic.checkForDailyLogin(); // Check daily login status
                UI.applyOnboardingPhaseUI(currentPhase); // Set UI visibility based on overall phase
                await GameLogic.calculateTapestryNarrative(true); // Ensure analysis is current

                // Ensure all relevant UI data is displayed for the default screen
                UI.populateGrimoireFilters();
                UI.refreshGrimoireDisplay(); // Update Grimoire data (might not be visible)
                UI.displayPersonaScreen();   // Setup Persona Screen content (default view)
                UI.displayStudyScreenContent(); // Setup Study Screen content
                UI.displayRepositoryContent(); // Setup Repository content

                // Explicitly show the default screen AFTER setting up its content
                UI.showScreen('personaScreen');
                UI.hidePopups(); // Ensure no popups are stuck open
            }
             if(loadButton) loadButton.classList.add('hidden'); // Hide load button after successful load/resume
        }

    } else {
        // No valid save data, start fresh
        console.log("No valid saved session found or load error. Starting fresh.");
        // State is already reset by loadGameState failing or clearGameState
        UI.setupInitialUI(); // Setup initial UI for a new game (Welcome Screen)
         if (localStorage.getItem(Config.SAVE_KEY)) { // Check if there *was* corrupt data
             UI.showTemporaryMessage("Error loading session. Starting fresh.", 4000);
             localStorage.removeItem(Config.SAVE_KEY); // Clear corrupt data
         }
    }

    console.log("Initialization complete. Attaching event listeners.");
    attachEventListeners();
    console.log("Application ready.");
}

// --- Event Listeners ---
function attachEventListeners() {
    console.log("Attaching event listeners...");

    // Welcome Screen
    const startButton = document.getElementById('startGuidedButton');
    // Load button logic handled during initialization

    if (startButton) {
        startButton.addEventListener('click', () => {
            State.clearGameState(); // Clears state, resets tutorial step to 'start'
            UI.initializeQuestionnaireUI(); // Set up the questionnaire display
            UI.showScreen('questionnaireScreen'); // Navigate to the questionnaire
            if(loadButton) loadButton.classList.add('hidden');
        });
    } else {
        console.error("Start button not found!");
    }


    // Questionnaire Navigation
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // Main Navigation
    // Now, clicking these buttons might be intercepted by the tutorial flow via UI.showScreen
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        if (!button.classList.contains('settings-button')) {
            button.addEventListener('click', () => {
                const target = button.dataset.target;
                if (target) {
                    // UI.showScreen will now handle potential tutorial interception
                    UI.showScreen(target);
                } else {
                    console.warn("Nav button missing data-target attribute:", button);
                }
            });
        }
    });
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) settingsBtn.addEventListener('click', UI.showSettings);

    // Popups & Modals Close Buttons (Standard ones)
    const closePopupBtn = document.getElementById('closePopupButton'); // Concept Detail
    const overlay = document.getElementById('popupOverlay');
    const closeReflectionBtn = document.getElementById('closeReflectionModalButton');
    const closeSettingsBtn = document.getElementById('closeSettingsPopupButton');
    const closeMilestoneBtn = document.getElementById('closeMilestoneAlertButton');
    const closeDeepDiveBtn = document.getElementById('closeDeepDiveButton');
    // --- NEW: Tutorial Modal Close/Next ---
    const tutorialModal = document.getElementById('tutorialModal');
    const closeTutorialBtn = tutorialModal?.querySelector('.close-button'); // Assuming a standard close button
    const tutorialNextBtn = document.getElementById('tutorialNextButton'); // Specific ID for the 'Next' button

    if (closePopupBtn) closePopupBtn.addEventListener('click', UI.hidePopups);
    if (overlay) overlay.addEventListener('click', () => {
        // Special handling for tutorial overlay click - might advance or just close
        if (tutorialModal && !tutorialModal.classList.contains('hidden')) {
            // Decide if overlay click should advance or just close. Let's assume it just closes for now.
            UI.hideTutorialStep(); // Or a specific function if needed
        } else {
            UI.hidePopups(); // Hide other popups
        }
    });
    if (closeReflectionBtn) closeReflectionBtn.addEventListener('click', UI.hidePopups);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (closeMilestoneBtn) closeMilestoneBtn.addEventListener('click', UI.hideMilestoneAlert);
    if (closeDeepDiveBtn) closeDeepDiveBtn.addEventListener('click', UI.hidePopups);

    // Tutorial Modal Buttons
    if (closeTutorialBtn) {
        closeTutorialBtn.addEventListener('click', () => UI.hideTutorialStep()); // Simple close for 'X'
    } else {
        console.warn("Tutorial Modal Close Button not found.");
    }
    // Note: The 'Next' button's functionality is set dynamically by UI.showTutorialStep

    // Concept Detail Popup Actions (Delegation - Now includes Sell Button)
    const popupActionsDiv = document.querySelector('#conceptDetailPopup .popup-actions');
    if (popupActionsDiv) {
         popupActionsDiv.addEventListener('click', (event) => {
               const button = event.target.closest('button'); if (!button) return;
               const conceptId = GameLogic.getCurrentPopupConceptId();
               if (conceptId === null || isNaN(conceptId)) return; // Ensure valid ID

               if (button.id === 'addToGrimoireButton') GameLogic.addConceptToGrimoireById(conceptId, button);
               else if (button.id === 'markAsFocusButton') GameLogic.handleToggleFocusConcept();
               else if (button.classList.contains('popup-sell-button')) {
                   // Use the specific handler for selling from the popup/button context
                   GameLogic.handleSellConcept(event);
               }
         });
    } else { console.warn("Concept Detail Popup Actions container not found."); }

    // Evolve Button
    const evolveBtn = document.getElementById('evolveArtButton');
    if (evolveBtn) evolveBtn.addEventListener('click', GameLogic.attemptArtEvolution);

    // Save Note Button
    const saveNoteBtn = document.getElementById('saveMyNoteButton');
    if (saveNoteBtn) saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);

    // Grimoire Filters & Card Interaction (Delegation)
    const grimoireControls = document.getElementById('grimoireControls');
    if (grimoireControls) {
        // Listener for all controls within the div
        grimoireControls.addEventListener('change', (event) => {
            if (event.target.matches('select')) {
                 UI.refreshGrimoireDisplay();
            }
        });
        const searchInput = document.getElementById('grimoireSearchInput');
        if (searchInput) {
             searchInput.addEventListener('input', UI.refreshGrimoireDisplay);
        }
    }
    const grimoireContent = document.getElementById('grimoireContent');
    if (grimoireContent) {
        // Delegated listener for clicks within the grimoire content area
        grimoireContent.addEventListener('click', (event) => {
             // --- Handle Card Click for Popup ---
             const card = event.target.closest('.concept-card');
             const sellButton = event.target.closest('.card-sell-button');

             if (sellButton) {
                 // Sell button clicked - Use the specific handler
                 event.stopPropagation(); // Prevent card click from firing
                 GameLogic.handleSellConcept(event);
             } else if (card) {
                  // Card itself clicked (not the sell button)
                  const conceptId = parseInt(card.dataset.conceptId);
                  if (!isNaN(conceptId)) {
                      // Check if this is the first time clicking a card for the tutorial
                      const tutorialStep = State.getOnboardingTutorialStep();
                      if (tutorialStep === Config.TUTORIAL_STEP.GRIMOIRE_INTRO) {
                          // Advance tutorial state *before* showing the popup normally
                          State.setOnboardingTutorialStep(Config.TUTORIAL_STEP.CONCEPT_POPUP_INTRO);
                          UI.showTutorialStep(Config.TUTORIAL_STEP.CONCEPT_POPUP_INTRO); // Show explanation
                          // The tutorial step will then allow the popup to show after dismissal
                      } else {
                           UI.showConceptDetailPopup(conceptId); // Show popup normally
                      }
                  }
             }
        });
    }


    // Reflection Modal Confirmation
    const reflectionCheck = document.getElementById('reflectionCheckbox');
    const confirmReflectionBtn = document.getElementById('confirmReflectionButton');
    if (reflectionCheck) {
        reflectionCheck.addEventListener('change', () => {
            if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked;
        });
    }
    if (confirmReflectionBtn) {
        confirmReflectionBtn.addEventListener('click', () => {
            const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox');
            GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false);
        });
    }

    // Study Actions (Delegation for Research Buttons)
    const researchContainer = document.getElementById('researchButtonContainer');
    const freeResearchBtn = document.getElementById('freeResearchButton');
    const guidanceBtn = document.getElementById('seekGuidanceButton');
    if (researchContainer) {
        researchContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.research-button');
            if (button) {
                // Pass the event object which contains the button reference
                GameLogic.handleResearchClick({ currentTarget: button });
            }
        });
    } else { console.warn("Research Button Container not found."); }
    if (freeResearchBtn) freeResearchBtn.addEventListener('click', GameLogic.handleFreeResearchClick);
    if (guidanceBtn) guidanceBtn.addEventListener('click', GameLogic.triggerGuidedReflection);


    // Research Output Actions (Delegation for Add/Sell within results)
    const researchOutputArea = document.getElementById('researchOutput');
    if (researchOutputArea) {
        researchOutputArea.addEventListener('click', (event) => {
            const button = event.target.closest('button'); if (!button) return;
            const conceptIdStr = button.dataset.conceptId; if (!conceptIdStr) return;
            const conceptId = parseInt(conceptIdStr); if (isNaN(conceptId)) return;

            if (button.classList.contains('add-button')) {
                 GameLogic.addConceptToGrimoireById(conceptId, button);
            } else if (button.classList.contains('sell-button')) {
                 GameLogic.handleSellConcept(event); // Pass the event
            } else {
                 // Could be the card itself within research notes
                 const card = event.target.closest('.concept-card');
                 if (card) {
                     UI.showConceptDetailPopup(conceptId);
                 }
            }
        });
    } else { console.warn("Research Output area not found."); }


     // Integrated Deep Dive Unlock Buttons (Delegation on Persona Screen)
     const personaDetailsContainer = document.getElementById('personaElementDetails');
     if (personaDetailsContainer) {
         personaDetailsContainer.addEventListener('click', (event) => {
             const button = event.target.closest('.unlock-button');
             // Ensure the button is specifically for deep dive unlocks
             if (button && button.closest('.element-deep-dive-container')) {
                 GameLogic.handleUnlockLibraryLevel(event); // Pass the event object
             }
         });
     } else { console.warn("Persona Element Details container not found."); }


     // Repository Actions (Delegation)
     const repositoryContainer = document.getElementById('repositoryScreen');
     if (repositoryContainer) {
         repositoryContainer.addEventListener('click', (event) => {
             const button = event.target.closest('button'); if (!button) return;
             if (button.dataset.sceneId) {
                 GameLogic.handleMeditateScene(event); // Pass event
             } else if (button.dataset.experimentId) {
                 GameLogic.handleAttemptExperiment(event); // Pass event
             }
         });
     } else { console.warn("Repository Screen container not found."); }


    // Settings Popup Actions
    const forceSaveBtn = document.getElementById('forceSaveButton');
    const resetBtn = document.getElementById('resetAppButton');
    if (forceSaveBtn) {
        forceSaveBtn.addEventListener('click', () => {
            State.saveGameState(); // Force save
            UI.showTemporaryMessage("Game Saved!", 1500);
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Reset ALL progress? This cannot be undone.")) {
                console.log("Resetting application...");
                State.clearGameState(); // Clear state
                UI.setupInitialUI(); // Reset UI to welcome screen
                UI.hidePopups(); // Close settings popup
                if(loadButton) loadButton.classList.add('hidden');
            }
        });
    }

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
               // No need to call displayPersonaScreen here, already visible
          });
          summaryViewBtn.addEventListener('click', () => {
               personaSummaryDiv.classList.add('current');
               personaSummaryDiv.classList.remove('hidden');
               personaDetailedDiv.classList.add('hidden');
               personaDetailedDiv.classList.remove('current');
               summaryViewBtn.classList.add('active');
               detailedViewBtn.classList.remove('active');
               UI.displayPersonaSummary(); // Generate/update summary content when switched to
          });
     } else { console.warn("Persona view toggle buttons or divs not found."); }


    // Persona Screen Specific Button Delegation (Tapestry Actions)
    const personaScreenDiv = document.getElementById('personaScreen');
    if (personaScreenDiv) {
        personaScreenDiv.addEventListener('click', (event) => {
            const button = event.target.closest('button'); if (!button) return;
            if (button.id === 'exploreTapestryButton') {
                 GameLogic.showTapestryDeepDive();
            } else if (button.id === 'suggestSceneButton') {
                 GameLogic.handleSuggestSceneClick();
            }
        });
    } else { console.warn("Persona Screen container not found for Tapestry actions."); }


    // Delegated Listener for Deep Dive Analysis Nodes
    const deepDiveNodesContainer = document.getElementById('deepDiveAnalysisNodes');
    if (deepDiveNodesContainer) {
        deepDiveNodesContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.deep-dive-node'); if (!button) return;
            const nodeId = button.dataset.nodeId;

            if (nodeId === 'contemplation') {
                 const now = Date.now();
                 const cooldownEnd = State.getContemplationCooldownEnd();
                 if (cooldownEnd && now < cooldownEnd) {
                     const remaining = Math.ceil((cooldownEnd - now) / 1000);
                     UI.showTemporaryMessage(`Contemplation available in ${remaining}s.`, 3000);
                     return;
                 }
                 GameLogic.handleContemplationNodeClick(); // Call logic to maybe show task
            } else if (nodeId) {
                GameLogic.handleDeepDiveNodeClick(nodeId); // Handle clicks on other nodes
            }
        });
    } else { console.warn("Deep Dive Analysis Nodes Container not found."); }

    // --- END Event Listeners ---
    console.log("Event listeners attached.");
}

// --- Start the App ---
// Use DOMContentLoaded to ensure the DOM is ready before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp(); // DOMContentLoaded has already fired
}

console.log("main.js loaded.");
