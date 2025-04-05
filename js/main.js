// --- START OF FILE main.js ---

// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
import * as Config from './config.js'; // Ensure Config is imported for save key etc.

console.log("main.js loading...");

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab (Flow Refactor)...");

    // 1. Attempt to load game state
    const loaded = State.loadGameState();

    // 2. Update essential UI elements immediately based on loaded/initial state
    UI.updateInsightDisplays();
    UI.updateGrimoireCounter();
    UI.populateGrimoireFilters(); // Populate dropdowns

    // 3. Determine initial screen and setup based on loaded state
    if (loaded) {
        console.log("Existing session data found.");
        const currentState = State.getState();
        if (currentState.questionnaireCompleted) {
             console.log("Continuing session post-questionnaire...");
             GameLogic.checkForDailyLogin(); // Handle daily reset logic
             UI.applyOnboardingPhaseUI(currentState.onboardingPhase); // Set UI visibility
             GameLogic.calculateTapestryNarrative(true); // Ensure analysis is ready for potential Persona view
             UI.updateFocusSlotsDisplay();
             UI.refreshGrimoireDisplay(); // Prepare Grimoire data if navigated to
             // UI.setupInitialUI(); // Less needed here, focus on showing correct screen
             UI.showScreen('personaScreen'); // Default to Persona screen after load
             UI.hidePopups(); // Ensure no popups stuck
        } else {
             console.log("Loaded state incomplete (Questionnaire not finished).");
             // State loaded, but need to continue questionnaire
             if (currentState.currentElementIndex < 0 || currentState.currentElementIndex >= elementNames.length) {
                 State.updateElementIndex(0); // Reset index if invalid
             }
             UI.initializeQuestionnaireUI(); // Setup questionnaire UI
             UI.showScreen('questionnaireScreen');
        }
        // Hide load button after successful load
        const loadBtn = document.getElementById('loadButton');
        if (loadBtn) loadBtn.classList.add('hidden');

    } else { // No valid save found
        console.log("No valid saved session. Starting fresh.");
        // State is already reset by loadGameState failure or initial load
        UI.setupInitialUI(); // Setup welcome screen, ensure load button hidden etc.
        if (localStorage.getItem(Config.SAVE_KEY)) { // Check if there *was* data but it failed
            UI.showTemporaryMessage("Error loading previous session. Starting fresh.", 4000);
            localStorage.removeItem(Config.SAVE_KEY); // Clear potentially corrupted data
        }
    }

    console.log("Initialization complete. Attaching event listeners.");
    attachEventListeners();
    console.log("Application ready.");
}

// --- Event Listeners ---
function attachEventListeners() {
    console.log("Attaching event listeners...");

    // --- Element References (Keep concise) ---
    const startButton = document.getElementById('startGuidedButton');
    const loadButton = document.getElementById('loadButton');
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    const mainNavBar = document.getElementById('mainNavBar');
    const settingsBtn = document.getElementById('settingsButton');
    const popupOverlay = document.getElementById('popupOverlay');
    const grimoireContent = document.getElementById('grimoireContent');
    const studyScreenElement = document.getElementById('studyScreen'); // For delegation
    const researchOutputArea = document.getElementById('researchOutput'); // Standard results
    const personaElementDetails = document.getElementById('personaElementDetails'); // For deep dive unlock delegation
    const repositoryContainer = document.getElementById('repositoryScreen'); // For repo action delegation
    const settingsPopupElem = document.getElementById('settingsPopup');
    const personaScreenDiv = document.getElementById('personaScreen'); // For button delegation
    const tapestryDeepDiveModalElem = document.getElementById('tapestryDeepDiveModal');
    const conceptDetailPopupElem = document.getElementById('conceptDetailPopup');
    const reflectionModalElem = document.getElementById('reflectionModal');
    const infoPopupElem = document.getElementById('infoPopup');


    // --- Welcome Screen ---
    if (startButton) startButton.addEventListener('click', () => {
        State.clearGameState(); // Clear any residual state
        UI.initializeQuestionnaireUI(); // Set up questionnaire view
        UI.showScreen('questionnaireScreen'); // Show questionnaire
        if (loadButton) loadButton.classList.add('hidden'); // Hide load button
    });
    // Load button listener remains the same as in initializeApp, potentially redundant?
    // Let's keep it minimal here, initializeApp handles the main load logic.
    // if (loadButton && !loadButton.classList.contains('hidden')) { /* Load logic in initializeApp */ }


    // --- Questionnaire Navigation ---
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);


    // --- Main Navigation (Delegation) ---
    if (mainNavBar) {
        mainNavBar.addEventListener('click', (event) => {
            const button = event.target.closest('.nav-button');
            if (!button) return;
            if (button.id === 'settingsButton') {
                UI.showSettings();
            } else {
                const target = button.dataset.target;
                if (target) { UI.showScreen(target); }
            }
        });
    }


    // --- Popups & Overlay ---
    // Close buttons using delegation on a common ancestor or specific listeners
    document.body.addEventListener('click', (event) => { // Delegate common close actions
        if (event.target.matches('#closePopupButton') ||
            event.target.matches('#closeReflectionModalButton') ||
            event.target.matches('#closeSettingsPopupButton') ||
            event.target.matches('#closeDeepDiveButton') ||
            event.target.matches('#closeInfoPopupButton') ||
            event.target.matches('#confirmInfoPopupButton')) {
            UI.hidePopups();
        }
         // Milestone alert close
        if (event.target.matches('#closeMilestoneAlertButton')) {
            UI.hideMilestoneAlert();
        }
    });
    // Overlay click to close all popups
    if (popupOverlay) popupOverlay.addEventListener('click', UI.hidePopups);


    // --- Study Screen Actions (Delegation) ---
    if (studyScreenElement) {
        studyScreenElement.addEventListener('click', (event) => {
            // Discovery Mode Element Click
            const discoveryElement = event.target.closest('.initial-discovery-element.clickable');
            if (discoveryElement) {
                 const freeResearchLeft = State.getInitialFreeResearchRemaining();
                 GameLogic.handleResearchClick({ currentTarget: discoveryElement, isFree: freeResearchLeft > 0 });
                 return; // Prevent other listeners
            }
            // Standard Mode Research Button Click
            const researchButton = event.target.closest('.research-button');
            if (researchButton && !researchButton.closest('#initialDiscoveryElements')) { // Ensure it's not in discovery mode div
                GameLogic.handleResearchClick({ currentTarget: researchButton, isFree: false });
                return;
            }
            // Daily Free Research Button Click
            if (event.target.matches('#freeResearchButton')) {
                GameLogic.handleFreeResearchClick();
                return;
            }
            // Seek Guidance Button Click
            if (event.target.matches('#seekGuidanceButton')) {
                GameLogic.triggerGuidedReflection();
                return;
            }
            // Research Results Area Actions (Add/Sell in Discovery Mode)
             const discoveryResultsArea = event.target.closest('#initialResearchDiscoveries');
             if (discoveryResultsArea) {
                 const actionButton = event.target.closest('button.research-action-button, button.sell-button');
                 if (actionButton) {
                     const conceptIdStr = actionButton.dataset.conceptId;
                     if (conceptIdStr) {
                         const conceptId = parseInt(conceptIdStr);
                         if (!isNaN(conceptId)) {
                             if (actionButton.classList.contains('add-button')) {
                                 GameLogic.addConceptToGrimoireById(conceptId, actionButton);
                             } else if (actionButton.classList.contains('sell-button')) {
                                 GameLogic.handleSellConcept(event); // Pass event for context dataset
                             }
                         }
                     }
                 }
             }
        });
    }

    // Standard Research Output Actions (Add/Sell in Standard Mode - Delegation)
    if (researchOutputArea) {
        researchOutputArea.addEventListener('click', (event) => {
            const button = event.target.closest('button.add-button, button.sell-button');
            if (!button) return;
            const conceptIdStr = button.dataset.conceptId; if (!conceptIdStr) return;
            const conceptId = parseInt(conceptIdStr); if (isNaN(conceptId)) return;

            if (button.classList.contains('add-button')) {
                GameLogic.addConceptToGrimoireById(conceptId, button);
            } else if (button.classList.contains('sell-button')) {
                GameLogic.handleSellConcept(event); // Pass event for context dataset
            }
        });
    }


    // --- Grimoire Actions (Delegation) ---
    const grimoireControls = document.getElementById('grimoireControls');
    if (grimoireControls) {
        // Use 'input' for search field to catch typing, 'change' for selects
        grimoireControls.addEventListener('change', UI.refreshGrimoireDisplay);
        grimoireControls.addEventListener('input', (event) => {
            if (event.target.id === 'grimoireSearchInput') {
                UI.refreshGrimoireDisplay();
            }
        });
    }
    if (grimoireContent) {
        // Delegate Sell/Focus clicks on cards within the Grimoire grid
        grimoireContent.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button.card-sell-button, button.card-focus-button');
            if (!targetButton) return;
            const conceptIdStr = targetButton.dataset.conceptId;
            if (conceptIdStr) {
                const conceptId = parseInt(conceptIdStr);
                if (!isNaN(conceptId)) {
                    if (targetButton.classList.contains('card-sell-button')) {
                        event.stopPropagation(); // Prevent card popup
                        GameLogic.handleSellConcept(event); // Pass event for context
                    } else if (targetButton.classList.contains('card-focus-button')) {
                        event.stopPropagation(); // Prevent card popup
                        GameLogic.handleCardFocusToggle(conceptId);
                    }
                }
            }
        });
    }


    // --- Persona Screen Actions (Delegation) ---
    if (personaScreenDiv) {
         // View Toggle Buttons
         const detailedViewBtn = document.getElementById('showDetailedViewBtn');
         const summaryViewBtn = document.getElementById('showSummaryViewBtn');
         const personaDetailedDiv = document.getElementById('personaDetailedView');
         const personaSummaryDiv = document.getElementById('personaSummaryView');
         if (detailedViewBtn && summaryViewBtn && personaDetailedDiv && personaSummaryDiv) {
              detailedViewBtn.addEventListener('click', () => { personaDetailedDiv.classList.add('current'); personaDetailedDiv.classList.remove('hidden'); personaSummaryDiv.classList.add('hidden'); personaSummaryDiv.classList.remove('current'); detailedViewBtn.classList.add('active'); summaryViewBtn.classList.remove('active'); });
              summaryViewBtn.addEventListener('click', () => { personaSummaryDiv.classList.add('current'); personaSummaryDiv.classList.remove('hidden'); personaDetailedDiv.classList.add('hidden'); personaDetailedDiv.classList.remove('current'); summaryViewBtn.classList.add('active'); detailedViewBtn.classList.remove('active'); UI.displayPersonaSummary(); });
         }

         // Deep Dive Unlock Button (delegated)
         const personaElementDetails = document.getElementById('personaElementDetails');
         if (personaElementDetails) {
             personaElementDetails.addEventListener('click', (event) => {
                 if (event.target.matches('.unlock-button')) {
                     GameLogic.handleUnlockLibraryLevel(event);
                 }
             });
         }

         // Explore Tapestry / Suggest Scene Buttons
         personaScreenDiv.addEventListener('click', (event) => {
            if (event.target.matches('#exploreTapestryButton')) GameLogic.showTapestryDeepDive();
            else if (event.target.matches('#suggestSceneButton')) GameLogic.handleSuggestSceneClick();
         });
    }


    // --- Concept Detail Popup Actions (Delegation) ---
    if (conceptDetailPopupElem) {
        conceptDetailPopupElem.addEventListener('click', (event) => {
             const button = event.target.closest('button'); if (!button) return;
             const conceptId = GameLogic.getCurrentPopupConceptId(); // Get ID from logic state

             if (button.id === 'addToGrimoireButton' && conceptId !== null) GameLogic.addConceptToGrimoireById(conceptId, button);
             else if (button.id === 'markAsFocusButton' && conceptId !== null) GameLogic.handleToggleFocusConcept();
             else if (button.classList.contains('popup-sell-button') && conceptId !== null) GameLogic.handleSellConcept(event); // Pass event for context
             else if (button.id === 'evolveArtButton' && conceptId !== null) GameLogic.attemptArtEvolution();
             else if (button.id === 'saveMyNoteButton' && conceptId !== null) GameLogic.handleSaveNote();
        });
    }


    // --- Reflection Modal ---
    const reflectionCheck = document.getElementById('reflectionCheckbox');
    const confirmReflectionBtn = document.getElementById('confirmReflectionButton');
    if (reflectionCheck) reflectionCheck.addEventListener('change', () => { if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked; });
    if (confirmReflectionBtn) confirmReflectionBtn.addEventListener('click', () => {
        const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox');
        GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false);
    });


    // --- Repository Actions (Delegation) ---
     if (repositoryContainer) {
         repositoryContainer.addEventListener('click', (event) => {
             const button = event.target.closest('button'); if (!button) return;
             if (button.dataset.sceneId) GameLogic.handleMeditateScene(event);
             else if (button.dataset.experimentId) GameLogic.handleAttemptExperiment(event);
         });
     }


    // --- Tapestry Deep Dive Modal Actions (Delegation) ---
    if (tapestryDeepDiveModalElem) {
         const deepDiveNodesContainer = document.getElementById('deepDiveAnalysisNodes');
         if (deepDiveNodesContainer) {
            deepDiveNodesContainer.addEventListener('click', (event) => {
                const button = event.target.closest('.deep-dive-node'); if (!button) return;
                const nodeId = button.dataset.nodeId;
                if (nodeId === 'contemplation') { GameLogic.handleContemplationNodeClick(); }
                else if (nodeId) { GameLogic.handleDeepDiveNodeClick(nodeId); }
            });
         }
         // Completion button listener added dynamically in UI.displayContemplationTask
    }


    // --- Settings Popup Actions ---
    if (settingsPopupElem) {
        settingsPopupElem.addEventListener('click', (event) => {
             if (event.target.matches('#forceSaveButton')) { State.saveGameState(); UI.showTemporaryMessage("Game Saved!", 1500); }
             else if (event.target.matches('#resetAppButton')) { if (confirm("Reset ALL progress? This cannot be undone.")) { console.log("Resetting application..."); State.clearGameState(); UI.setupInitialUI(); UI.hidePopups(); UI.showTemporaryMessage("Progress Reset!", 3000); const loadBtn = document.getElementById('loadButton'); if(loadBtn) loadBtn.classList.add('hidden'); } }
        });
    }

     // --- Info Icon Handling (Delegated to body) ---
     document.body.addEventListener('click', (event) => {
        const infoIcon = event.target.closest('.info-icon');
        if (infoIcon) {
            event.preventDefault(); event.stopPropagation();
            const message = infoIcon.getAttribute('title');
            if (message && infoPopupElem && popupOverlay && infoPopupContent) {
                 infoPopupContent.textContent = message;
                 infoPopupElem.classList.remove('hidden');
                 popupOverlay.classList.remove('hidden');
            } else if (message) { UI.showTemporaryMessage(message, 4000); } // Fallback toast
        }
    });


    console.log("All event listeners attached.");
} // <<< End of attachEventListeners function


// --- Start the App ---
// Wait for the DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp(); // If DOM is already ready
}

console.log("main.js loaded.");
