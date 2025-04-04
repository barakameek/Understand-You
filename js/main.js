// --- START OF FILE main.js ---

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

    // **Crucially, update UI *after* state is confirmed loaded or cleared**
    UI.updateInsightDisplays(); // Update displays with potentially loaded insight

    if (loaded) {
        console.log("Existing session loaded.");
         if (State.getState().questionnaireCompleted) {
              console.log("Continuing session...");
              GameLogic.checkForDailyLogin(); // Check daily status *after* loading state
              UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); // Apply UI visibility
              GameLogic.calculateTapestryNarrative(true); // Ensure analysis is current for UI updates
              // Update other UI elements that depend on loaded state
              UI.updateFocusSlotsDisplay();
              UI.updateGrimoireCounter();
              UI.populateGrimoireFilters();
              UI.refreshGrimoireDisplay(); // Prepare Grimoire display data
              UI.setupInitialUI(); // Ensure button states are correct after load
              UI.showScreen('personaScreen'); // Default to Persona screen after load
              UI.hidePopups(); // Ensure no popups are stuck open
         } else {
              console.log("Loaded state incomplete. Restarting questionnaire.");
              // State is loaded, but questionnaire wasn't done. Reset index.
              State.updateElementIndex(0); // Reset index only
              // ** Ensure userAnswers is ready **
              // This is handled by loadGameState ensuring all element keys exist
              UI.initializeQuestionnaireUI(); // Setup questionnaire UI
              UI.showScreen('questionnaireScreen');
         }
         const loadBtn = document.getElementById('loadButton');
         if(loadBtn) loadBtn.classList.add('hidden'); // Hide load button

    } else {
        console.log("No valid saved session found or load error. Starting fresh.");
        // State.clearGameState() was already called implicitly by loadGameState failing
        // or explicitly if needed depending on error handling preference
        UI.setupInitialUI(); // Setup initial UI for a new game (Welcome Screen)
         if (localStorage.getItem(Config.SAVE_KEY)) {
             UI.showTemporaryMessage("Error loading session. Starting fresh.", 4000);
         }
    }

    console.log("Initialization complete. Attaching event listeners.");
    attachEventListeners();
    console.log("Application ready.");
}

// --- Event Listeners ---

function attachEventListeners() {
    console.log("Attaching event listeners...");

    // ... (keep all existing listeners) ...

    // --- NEW: Delegated Click Listener for Info Icons ---
    document.body.addEventListener('click', (event) => {
        const infoIcon = event.target.closest('.info-icon');
        if (infoIcon) {
            event.preventDefault(); // Prevent any default action if icon is inside a link/button
            event.stopPropagation(); // Stop propagation to avoid unintended side effects
            const message = infoIcon.getAttribute('title');
            if (message) {
                // Use a slightly longer duration for info tooltips
                UI.showTemporaryMessage(message, 4500);
            }
        }
    });
    // --- End NEW Listener ---


    // ... (rest of the attachEventListeners function) ...

    console.log("Event listeners attached.");
}

    // Welcome Screen
    const startButton = document.getElementById('startGuidedButton');
    const loadButton = document.getElementById('loadButton');
    if (startButton) startButton.addEventListener('click', () => {
        State.clearGameState(); // Clears state and initializes userAnswers correctly
        UI.initializeQuestionnaireUI();
        UI.showScreen('questionnaireScreen');
        if(loadButton) loadButton.classList.add('hidden');
    });
    if (loadButton && !loadButton.classList.contains('hidden')) {
        loadButton.addEventListener('click', () => {
            if(State.loadGameState()){ // Reload state
                UI.updateInsightDisplays(); // Update UI after load
                if (State.getState().questionnaireCompleted) {
                    GameLogic.checkForDailyLogin();
                    UI.applyOnboardingPhaseUI(State.getOnboardingPhase());
                    GameLogic.calculateTapestryNarrative(true);
                    UI.updateFocusSlotsDisplay();
                    UI.updateGrimoireCounter();
                    UI.populateGrimoireFilters();
                    UI.refreshGrimoireDisplay();
                    UI.setupInitialUI();
                    UI.showScreen('personaScreen');
                    UI.hidePopups();
                }
                else {
                    State.updateElementIndex(0); // Reset index if questionnaire incomplete
                    UI.initializeQuestionnaireUI();
                    UI.showScreen('questionnaireScreen');
                }
                loadButton.classList.add('hidden');
            } else {
                 UI.showTemporaryMessage("Load failed. Starting new.", 3000);
                 State.clearGameState();
                 UI.initializeQuestionnaireUI();
                 UI.showScreen('questionnaireScreen');
                 loadButton.classList.add('hidden');
             }
        });
    }

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
    if (grimoireControls) { grimoireControls.addEventListener('change', UI.refreshGrimoireDisplay); grimoireControls.addEventListener('input', UI.refreshGrimoireDisplay); /* Refresh on search input too */ }
    const grimoireContent = document.getElementById('grimoireContent');
    if (grimoireContent) {
        grimoireContent.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button');
            if (!targetButton) return; // Ignore clicks not on buttons

            const conceptIdStr = targetButton.dataset.conceptId;
            if (conceptIdStr) {
                const conceptId = parseInt(conceptIdStr);
                if (!isNaN(conceptId)) {
                    if (targetButton.classList.contains('card-sell-button')) {
                        event.stopPropagation(); // Prevent card click
                        GameLogic.handleSellConcept(event);
                    } else if (targetButton.classList.contains('card-focus-button')) {
                        event.stopPropagation(); // Prevent card click
                        GameLogic.handleCardFocusToggle(conceptId); // Call the new handler
                    }
                }
            }
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

     // Integrated Element Deep Dive Unlock (Delegation)
     const personaElementDetails = document.getElementById('personaElementDetails');
     if (personaElementDetails) {
         personaElementDetails.addEventListener('click', (event) => {
             if (event.target.matches('.unlock-button')) {
                 GameLogic.handleUnlockLibraryLevel(event);
             }
         });
     } else { console.warn("Persona Element Details container not found for Deep Dive Unlock delegation."); }

     // Repository Actions (Delegation)
     const repositoryContainer = document.getElementById('repositoryScreen');
     if (repositoryContainer) {
         repositoryContainer.addEventListener('click', (event) => {
             const button = event.target.closest('button'); if (!button) return;
             if (button.dataset.sceneId) { GameLogic.handleMeditateScene(event); }
             else if (button.dataset.experimentId) { GameLogic.handleAttemptExperiment(event); }
         });
     } else { console.warn("Repository Screen container not found for delegation."); }

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

    // Persona Screen Specific Button Delegation
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
            } else if (nodeId && nodeId !== 'keyword') { GameLogic.handleDeepDiveNodeClick(nodeId); }
        });
    } else { console.warn("Deep Dive Analysis Nodes Container not found."); }

    console.log("Event listeners attached.");
}

// --- Start the App ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log("main.js loaded.");
