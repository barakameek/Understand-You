// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
import * as Config from './config.js'; // Ensure Config is imported

console.log("main.js loading...");

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab v14+ (Guided Flow)...");

    // Attempt to load game state first
    const loaded = State.loadGameState(); // This now populates the `gameState` variable

    // Determine initial screen based on loaded state
    let initialScreen = 'welcomeScreen';
    if (loaded) {
        console.log("Existing session loaded.");
        const currentState = State.getState();
        if (currentState.questionnaireCompleted) {
            if (State.getHasSeenResultsModal()) {
                console.log("Continuing session post-results.");
                GameLogic.checkForDailyLogin(); // Check login state
                UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); // Apply UI restrictions
                GameLogic.calculateTapestryNarrative(true); // Ensure analysis is current
                UI.updateInsightDisplays();
                UI.updateFocusSlotsDisplay();
                UI.updateGrimoireCounter();
                UI.populateGrimoireFilters();
                UI.refreshGrimoireDisplay(); // Refresh Grimoire (might not be visible)
                UI.setupInitialUI(); // Sets up button states etc. based on phase
                initialScreen = 'personaScreen'; // Default to Persona screen if fully onboarded
                 // If study/repo is unlocked, maybe default there? Let's stick to persona for now.
            } else {
                console.log("Questionnaire done, but results modal not seen. Showing results.");
                // Need to regenerate starter hand display if modal wasn't saved/loaded properly
                // For now, assume scores are loaded, show modal without starter hand if necessary
                const starterHand = []; // TODO: Potentially regenerate or load starter hand if needed here
                UI.showExperimentResultsModal(State.getScores(), starterHand);
                initialScreen = null; // Modal handles next step, don't show a background screen yet
            }
        } else {
            console.log("Loaded state incomplete (questionnaire not done). Starting questionnaire.");
            State.updateElementIndex(0); // Ensure it starts at 0
            UI.initializeQuestionnaireUI(); // Setup questionnaire UI
            initialScreen = 'questionnaireScreen';
        }
        const loadBtn = document.getElementById('loadButton');
        if (loadBtn) loadBtn.classList.add('hidden'); // Hide load button after successful load attempt

    } else {
        console.log("No valid saved session found or load error. Starting fresh.");
        UI.setupInitialUI(); // Setup initial UI for a new game (Welcome Screen)
         if (localStorage.getItem(Config.SAVE_KEY)) { // Check if there *was* corrupt data
             UI.showTemporaryMessage("Error loading session. Starting fresh.", 4000);
             localStorage.removeItem(Config.SAVE_KEY); // Clear corrupt data
         }
         const loadBtn = document.getElementById('loadButton');
         if (loadBtn) loadBtn.classList.add('hidden'); // Hide load button on fresh start
    }

    // Show the determined initial screen (unless a modal is handling flow)
    if(initialScreen) {
         UI.showScreen(initialScreen);
    }
     // Ensure no popups are stuck open from a bad state
     if (!document.querySelector('.popup:not(.hidden)')) {
        UI.hidePopups();
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
    const loadButton = document.getElementById('loadButton');
    if (startButton) startButton.addEventListener('click', () => {
        State.clearGameState(); // Clears state (index becomes -1)
        State.updateElementIndex(0); // *** ADD THIS LINE: Set state index to 0 ***
        UI.initializeQuestionnaireUI(); // Renders questions for index 0
        UI.showScreen('questionnaireScreen');
        if(loadButton) loadButton.classList.add('hidden');
    });
    // Load button logic is handled during initialization now

    // Questionnaire Navigation
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement); // finalizeQuestionnaire called internally
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // Main Navigation
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        if(!button.classList.contains('settings-button')) {
            button.addEventListener('click', () => {
                const target = button.dataset.target;
                if (target) { UI.showScreen(target); } // Let showScreen handle tutorials/logic calls
            });
        }
    });
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) settingsBtn.addEventListener('click', UI.showSettings);

    // --- Results Modal Listener ---
    const resultsModalBtn = document.getElementById('goToGrimoireButton');
    const closeResultsBtn = document.getElementById('closeResultsModalButton');
    if (resultsModalBtn) {
        resultsModalBtn.addEventListener('click', () => {
            UI.hideExperimentResultsModal();
            UI.showScreen('grimoireScreen'); // Navigate to Grimoire
            // Grimoire tutorial will trigger via showScreen if needed
        });
    } else { console.error("Go To Grimoire button not found!"); }
    if (closeResultsBtn) {
         // Decide if closing should just hide or force grimoire? Let's just hide.
         closeResultsBtn.addEventListener('click', UI.hideExperimentResultsModal);
    }
    // --- End Results Modal Listener ---


    // Popups & Modals Close Buttons (General)
    const closePopupBtn = document.getElementById('closePopupButton'); // Concept Detail
    const overlay = document.getElementById('popupOverlay');
    const closeReflectionBtn = document.getElementById('closeReflectionModalButton');
    const closeSettingsBtn = document.getElementById('closeSettingsPopupButton');
    const closeMilestoneBtn = document.getElementById('closeMilestoneAlertButton');
    const closeDeepDiveBtn = document.getElementById('closeDeepDiveButton');
    if (closePopupBtn) closePopupBtn.addEventListener('click', UI.hidePopups);
    if (overlay) overlay.addEventListener('click', UI.hidePopups); // Click outside closes any popup
    if (closeReflectionBtn) closeReflectionBtn.addEventListener('click', UI.hidePopups);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (closeMilestoneBtn) closeMilestoneBtn.addEventListener('click', UI.hideMilestoneAlert);
    if (closeDeepDiveBtn) closeDeepDiveBtn.addEventListener('click', UI.hidePopups);

    // Concept Detail Popup Actions (Delegation)
    const popupActionsDiv = document.querySelector('#conceptDetailPopup .popup-actions');
    if (popupActionsDiv) {
         popupActionsDiv.addEventListener('click', (event) => {
               const button = event.target.closest('button'); if (!button) return;
               const conceptId = GameLogic.getCurrentPopupConceptId();
               if (button.id === 'addToGrimoireButton' && conceptId !== null) GameLogic.addConceptToGrimoireById(conceptId, button);
               else if (button.id === 'markAsFocusButton' && conceptId !== null) GameLogic.handleToggleFocusConcept();
               else if (button.classList.contains('popup-sell-button') && conceptId !== null) GameLogic.handleSellConcept(event); // Use delegate handler
         });
    }

    // Evolve Button (in Concept Detail Popup)
    const evolveBtn = document.getElementById('evolveArtButton');
    if (evolveBtn) evolveBtn.addEventListener('click', GameLogic.attemptArtEvolution);

    // Save Note Button (in Concept Detail Popup)
    const saveNoteBtn = document.getElementById('saveMyNoteButton');
    if (saveNoteBtn) saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);

    // Grimoire Filters & Card Interaction (Delegation)
    const grimoireControls = document.getElementById('grimoireControls');
    if (grimoireControls) {
        // Listen to changes on selects
        grimoireControls.querySelectorAll('select').forEach(select => {
             select.addEventListener('change', UI.refreshGrimoireDisplay);
        });
        // Listen to input on the search bar
        const searchInput = document.getElementById('grimoireSearchInput');
        if (searchInput) {
             searchInput.addEventListener('input', UI.refreshGrimoireDisplay); // Use 'input' for real-time filtering
        }
    }
    const grimoireContent = document.getElementById('grimoireContent');
    if (grimoireContent) {
        // Delegated listener for sell buttons *within* the grimoire grid cards
        grimoireContent.addEventListener('click', (event) => {
            const sellButton = event.target.closest('.card-sell-button');
            if (sellButton) {
                event.stopPropagation(); // Prevent card click from opening popup
                GameLogic.handleSellConcept(event); // Use delegate handler
            }
            // Could add highlight click handler here if needed
        });
    }

    // Reflection Modal
    const reflectionCheck = document.getElementById('reflectionCheckbox');
    const confirmReflectionBtn = document.getElementById('confirmReflectionButton');
    if (reflectionCheck) reflectionCheck.addEventListener('change', () => { if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked; });
    if (confirmReflectionBtn) confirmReflectionBtn.addEventListener('click', () => { const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox'); GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false); });

    // Study Actions
    const researchContainer = document.getElementById('researchButtonContainer');
    const freeResearchBtn = document.getElementById('freeResearchButton');
    const guidanceBtn = document.getElementById('seekGuidanceButton');
    if (researchContainer) { researchContainer.addEventListener('click', (event) => { const button = event.target.closest('.research-button'); if (button) GameLogic.handleResearchClick({ currentTarget: button }); }); }
    if (freeResearchBtn) freeResearchBtn.addEventListener('click', GameLogic.handleFreeResearchClick);
    if (guidanceBtn) guidanceBtn.addEventListener('click', GameLogic.triggerGuidedReflection);

    // Research Output Actions (Delegation for Add/Sell buttons in results)
    const researchOutputArea = document.getElementById('researchOutput');
    if (researchOutputArea) {
        researchOutputArea.addEventListener('click', (event) => {
            const button = event.target.closest('button'); if (!button) return;
            const conceptIdStr = button.dataset.conceptId; if (!conceptIdStr) return;
            const conceptId = parseInt(conceptIdStr); if (isNaN(conceptId)) return;
            if (button.classList.contains('add-button')) GameLogic.addConceptToGrimoireById(conceptId, button);
            else if (button.classList.contains('sell-button')) GameLogic.handleSellConcept(event); // Use delegate handler
        });
    }

     // Integrated Deep Dive Unlock Buttons (Delegation in Persona Screen)
     const personaDetailsContainer = document.getElementById('personaElementDetails');
     if (personaDetailsContainer) {
         personaDetailsContainer.addEventListener('click', (event) => {
             const button = event.target.closest('.unlock-button');
             // Check if the button is *within* a deep dive container to avoid conflicts
             if (button && button.closest('.element-deep-dive-container')) {
                 GameLogic.handleUnlockLibraryLevel(event); // Use delegate handler
             }
         });
     } else {
         console.error("Persona Element Details container not found for deep dive listener.");
     }

     // Repository Actions (Delegation for Meditate/Experiment buttons)
     const repositoryContainer = document.getElementById('repositoryScreen');
     if (repositoryContainer) { repositoryContainer.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; if (button.dataset.sceneId) GameLogic.handleMeditateScene(event); else if (button.dataset.experimentId) GameLogic.handleAttemptExperiment(event); }); }

    // Settings Popup Actions
    const forceSaveBtn = document.getElementById('forceSaveButton');
    const resetBtn = document.getElementById('resetAppButton');
    if (forceSaveBtn) forceSaveBtn.addEventListener('click', () => { State.saveGameState(); UI.showTemporaryMessage("Game Saved!", 1500); });
    if (resetBtn) resetBtn.addEventListener('click', () => { if (confirm("Reset ALL progress? This cannot be undone.")) { console.log("Resetting application..."); State.clearGameState(); UI.setupInitialUI(); UI.hidePopups(); UI.showTemporaryMessage("Progress Reset!", 3000); const loadBtn = document.getElementById('loadButton'); if(loadBtn) loadBtn.classList.add('hidden'); } });

     // Persona View Toggle Buttons
     const detailedViewBtn = document.getElementById('showDetailedViewBtn');
     const summaryViewBtn = document.getElementById('showSummaryViewBtn');
     const personaDetailedDiv = document.getElementById('personaDetailedView');
     const personaSummaryDiv = document.getElementById('personaSummaryView');
     if(detailedViewBtn && summaryViewBtn && personaDetailedDiv && personaSummaryDiv) {
          detailedViewBtn.addEventListener('click', () => { personaDetailedDiv.classList.add('current'); personaDetailedDiv.classList.remove('hidden'); personaSummaryDiv.classList.add('hidden'); personaSummaryDiv.classList.remove('current'); detailedViewBtn.classList.add('active'); summaryViewBtn.classList.remove('active'); });
          summaryViewBtn.addEventListener('click', () => { personaSummaryDiv.classList.add('current'); personaSummaryDiv.classList.remove('hidden'); personaDetailedDiv.classList.add('hidden'); personaDetailedDiv.classList.remove('current'); summaryViewBtn.classList.add('active'); detailedViewBtn.classList.remove('active'); UI.displayPersonaSummary(); });
     }

    // Persona Screen Specific Button Delegation (Tapestry Actions)
    const personaScreenDiv = document.getElementById('personaScreen');
    if (personaScreenDiv) {
        personaScreenDiv.addEventListener('click', (event) => {
            const button = event.target.closest('button'); if (!button) return;
            if (button.id === 'exploreTapestryButton') GameLogic.showTapestryDeepDive();
            else if (button.id === 'suggestSceneButton') GameLogic.handleSuggestSceneClick();
        });
    } else { console.warn("Persona Screen container not found for button delegation."); }

    // Delegated Listener for Deep Dive Analysis Nodes (in Tapestry Deep Dive Popup)
    const deepDiveNodesContainer = document.getElementById('deepDiveAnalysisNodes');
    if (deepDiveNodesContainer) {
        deepDiveNodesContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.deep-dive-node'); if (!button) return;
            const nodeId = button.dataset.nodeId;
            if (nodeId === 'contemplation') {
                 const now = Date.now(); const cooldownEnd = State.getContemplationCooldownEnd();
                 if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); UI.showTemporaryMessage(`Contemplation available in ${remaining}s.`, 3000); return; }
                 GameLogic.handleContemplationNodeClick();
            } else if (nodeId) { // Ensure nodeId exists
                GameLogic.handleDeepDiveNodeClick(nodeId);
            }
        });
    } else { console.warn("Deep Dive Analysis Nodes Container not found."); }

    // Listener for Contemplation Completion Button (inside Deep Dive Popup)
    const deepDiveDetailArea = document.getElementById('deepDiveDetailContent');
    if(deepDiveDetailArea){
        deepDiveDetailArea.addEventListener('click', (event) => {
             if (event.target && event.target.id === 'completeContemplationBtn'){
                 // The actual task data needs to be retrieved when the button is clicked.
                 // This might require storing the current task in gameLogic state temporarily.
                 // For now, assume gameLogic can retrieve the current task.
                 GameLogic.handleCompleteContemplation(); // Assumes gameLogic knows the task
             }
        });
    }

    console.log("Event listeners attached.");
}

// --- Start the App ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp(); // Already loaded
}

console.log("main.js loaded.");
