// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
import * as Config from './config.js'; // Ensure Config is imported

console.log("main.js loading...");

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab v14+...");

    // Attempt to load game state first
    const loaded = State.loadGameState(); // This now populates the `gameState` variable

    // Update UI *after* state is confirmed loaded or cleared
    UI.updateInsightDisplays();

    if (loaded) {
        console.log("Existing session loaded.");
         if (State.getState().questionnaireCompleted) {
              console.log("Continuing session...");
              GameLogic.checkForDailyLogin();
              UI.applyOnboardingPhaseUI(State.getOnboardingPhase());
              GameLogic.calculateTapestryNarrative(true); // Ensure analysis is current for UI updates
              // Update UI elements that depend on loaded state
              UI.updateFocusSlotsDisplay();
              UI.updateGrimoireCounter();
              UI.populateGrimoireFilters(); // Populate filters before potential display
              UI.refreshGrimoireDisplay(); // Refresh Grimoire if needed (might not be visible yet)
              // Setup initial UI state (button enabled/disabled, etc.)
              UI.setupInitialUI(); // Calls applyOnboardingPhaseUI and sets button states
              UI.showScreen('personaScreen'); // Default to Persona screen after successful load
              UI.hidePopups(); // Ensure no popups are stuck open
         } else {
              console.log("Loaded state incomplete. Restarting questionnaire.");
              // State is loaded, but questionnaire wasn't done. Index should be 0 or less.
              State.updateElementIndex(0); // Ensure it starts at 0
              UI.initializeQuestionnaireUI(); // Setup questionnaire UI
              UI.showScreen('questionnaireScreen');
         }
         const loadBtn = document.getElementById('loadButton');
         if(loadBtn) loadBtn.classList.add('hidden'); // Hide load button after successful load

    } else {
        console.log("No valid saved session found or load error. Starting fresh.");
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
    const loadButton = document.getElementById('loadButton');
    if (startButton) startButton.addEventListener('click', () => {
        State.clearGameState(); // Clears state and initializes userAnswers correctly
        UI.initializeQuestionnaireUI();
        UI.showScreen('questionnaireScreen');
        if(loadButton) loadButton.classList.add('hidden');
    });
    // Load button logic is handled during initialization now

    // Questionnaire Navigation
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // Main Navigation
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        if(!button.classList.contains('settings-button')) {
            button.addEventListener('click', () => {
                const target = button.dataset.target;
                if (target) { UI.showScreen(target); } // Let showScreen handle logic calls
            });
        }
    });
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) settingsBtn.addEventListener('click', UI.showSettings);

    // Popups & Modals Close Buttons
    const closePopupBtn = document.getElementById('closePopupButton');
    const overlay = document.getElementById('popupOverlay');
    const closeReflectionBtn = document.getElementById('closeReflectionModalButton');
    const closeSettingsBtn = document.getElementById('closeSettingsPopupButton');
    const closeMilestoneBtn = document.getElementById('closeMilestoneAlertButton');
    const closeDeepDiveBtn = document.getElementById('closeDeepDiveButton');
    if (closePopupBtn) closePopupBtn.addEventListener('click', UI.hidePopups);
    if (overlay) overlay.addEventListener('click', UI.hidePopups);
    if (closeReflectionBtn) closeReflectionBtn.addEventListener('click', UI.hidePopups);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (closeMilestoneBtn) closeMilestoneBtn.addEventListener('click', UI.hideMilestoneAlert);
    if (closeDeepDiveBtn) closeDeepDiveBtn.addEventListener('click', UI.hidePopups);
    else console.warn("Deep Dive Modal Close Button not found.");

    // Concept Detail Popup Actions (Delegation)
    const popupActionsDiv = document.querySelector('#conceptDetailPopup .popup-actions');
    if (popupActionsDiv) {
         popupActionsDiv.addEventListener('click', (event) => {
               const button = event.target.closest('button'); if (!button) return;
               const conceptId = GameLogic.getCurrentPopupConceptId();
               if (button.id === 'addToGrimoireButton' && conceptId !== null) GameLogic.addConceptToGrimoireById(conceptId, button);
               else if (button.id === 'markAsFocusButton' && conceptId !== null) GameLogic.handleToggleFocusConcept();
               else if (button.classList.contains('popup-sell-button') && conceptId !== null) GameLogic.handleSellConcept(event);
         });
    }

    // Evolve Button
    const evolveBtn = document.getElementById('evolveArtButton');
    if (evolveBtn) evolveBtn.addEventListener('click', GameLogic.attemptArtEvolution);

    // Save Note Button
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
        grimoireContent.addEventListener('click', (event) => {
            const sellButton = event.target.closest('.card-sell-button');
            if (sellButton) { event.stopPropagation(); GameLogic.handleSellConcept(event); }
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

    // Research Output Actions (Delegation)
    const researchOutputArea = document.getElementById('researchOutput');
    if (researchOutputArea) {
        researchOutputArea.addEventListener('click', (event) => {
            const button = event.target.closest('button'); if (!button) return;
            const conceptIdStr = button.dataset.conceptId; if (!conceptIdStr) return; const conceptId = parseInt(conceptIdStr); if (isNaN(conceptId)) return;
            if (button.classList.contains('add-button')) GameLogic.addConceptToGrimoireById(conceptId, button);
            else if (button.classList.contains('sell-button')) GameLogic.handleSellConcept(event);
        });
    }

     // Integrated Deep Dive Unlock Buttons (Delegation)
     const personaDetailsContainer = document.getElementById('personaElementDetails');
     if (personaDetailsContainer) {
         personaDetailsContainer.addEventListener('click', (event) => {
             const button = event.target.closest('.unlock-button');
             // Check if the button is *within* a deep dive container to avoid conflicts
             if (button && button.closest('.element-deep-dive-container')) {
                 GameLogic.handleUnlockLibraryLevel(event);
             }
         });
     } else {
         console.error("Persona Element Details container not found for deep dive listener.");
     }

     // Repository Actions (Delegation)
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

    // Delegated Listener for Deep Dive Analysis Nodes
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

    console.log("Event listeners attached.");
}

// --- Start the App ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp(); // Already loaded
}

console.log("main.js loaded.");
