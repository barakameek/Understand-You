// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
import * as Config from './config.js';
import { elementNames } from '../data.js'; // Import if needed, e.g., for questionnaire length check

console.log("main.js loading...");

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab (Flow Refactor)...");
    const loaded = State.loadGameState(); // Load state first
    // Initial UI setup based on loaded state
    UI.updateInsightDisplays();
    UI.updateGrimoireCounter();
    UI.populateGrimoireFilters();

    if (loaded) {
        console.log("Existing session data found.");
        const currentState = State.getState();
        if (currentState.questionnaireCompleted) {
             console.log("Continuing session post-questionnaire...");
             GameLogic.checkForDailyLogin(); // Check daily login *after* loading
             UI.applyOnboardingPhaseUI(currentState.onboardingPhase); // Apply UI restrictions based on phase
             GameLogic.calculateTapestryNarrative(true); // Calculate initial narrative
             UI.updateFocusSlotsDisplay();
             UI.refreshGrimoireDisplay(); // Populate grimoire
             UI.showScreen('personaScreen'); // Start on Persona screen
             UI.hidePopups(); // Ensure no popups are open on load
        } else {
             console.log("Loaded state incomplete (Questionnaire not finished). Restarting questionnaire.");
             // If questionnaire wasn't finished, reset index and show questionnaire
             State.updateElementIndex(0); // Ensure index is 0
             UI.initializeQuestionnaireUI(); // Setup questionnaire UI
             UI.showScreen('questionnaireScreen'); // Show questionnaire
        }
        const loadBtn = document.getElementById('loadButton');
        if (loadBtn) loadBtn.classList.add('hidden'); // Hide load button after successful load
    } else {
        console.log("No valid saved session. Starting fresh.");
        UI.setupInitialUI(); // Setup for a fresh start (Welcome screen)
        if (localStorage.getItem(Config.SAVE_KEY)) { // Check if there was invalid data
             UI.showTemporaryMessage("Error loading previous session. Starting fresh.", 4000);
             localStorage.removeItem(Config.SAVE_KEY);
        }
    }
    console.log("Initialization complete. Attaching event listeners.");
    attachEventListeners(); // Attach listeners after initial setup
    console.log("Application ready.");
}

// --- Event Listeners ---
function attachEventListeners() {
    console.log("Attaching event listeners...");

    // --- Element References ---
    const startButton = document.getElementById('startGuidedButton');
    const loadButton = document.getElementById('loadButton');
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    const mainNavBar = document.getElementById('mainNavBar');
    const popupOverlay = document.getElementById('popupOverlay');
    const grimoireContent = document.getElementById('grimoireContent');
    const studyScreenElement = document.getElementById('studyScreen');
    const studyResearchDiscoveriesArea = document.getElementById('studyResearchDiscoveries'); // Specific listener target
    const repositoryContainer = document.getElementById('repositoryScreen');
    const settingsPopupElem = document.getElementById('settingsPopup');
    const personaScreenDiv = document.getElementById('personaScreen');
    const tapestryDeepDiveModalElem = document.getElementById('tapestryDeepDiveModal');
    const conceptDetailPopupElem = document.getElementById('conceptDetailPopup');
    const infoPopupElem = document.getElementById('infoPopup');

    // --- Welcome Screen ---
    if (startButton) startButton.addEventListener('click', () => {
        State.clearGameState(); // Clear any old state
        UI.initializeQuestionnaireUI(); // Setup the questionnaire
        UI.showScreen('questionnaireScreen'); // Show the questionnaire
        if(loadButton) loadButton.classList.add('hidden'); // Hide load button
    });
    if (loadButton) loadButton.addEventListener('click', initializeApp); // Reloading handles loading state

    // --- Questionnaire Navigation ---
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // --- Main Navigation & Popups (Delegation on Body/Nav) ---
    if (mainNavBar) { mainNavBar.addEventListener('click', (event) => { const button = event.target.closest('.nav-button'); if (!button) return; if (button.id === 'settingsButton') UI.showSettings(); else { const target = button.dataset.target; if (target) UI.showScreen(target); } }); }
    // Close buttons for all popups/modals
    document.body.addEventListener('click', (event) => { if (event.target.matches('#closePopupButton, #closeReflectionModalButton, #closeSettingsPopupButton, #closeDeepDiveButton, #closeInfoPopupButton, #confirmInfoPopupButton')) UI.hidePopups(); if (event.target.matches('#closeMilestoneAlertButton')) UI.hideMilestoneAlert(); });
    if (popupOverlay) popupOverlay.addEventListener('click', UI.hidePopups);

    // --- Study Screen Actions (Delegation on Study Screen) ---
    if (studyScreenElement) {
        studyScreenElement.addEventListener('click', (event) => {
            // 1. Element Research Click
            const discoveryElement = event.target.closest('.initial-discovery-element.clickable');
            if (discoveryElement) {
                 // Determine if this is a free click based on remaining count (state)
                 const freeResearchLeft = State.getInitialFreeResearchRemaining();
                 const isFreeClick = State.getOnboardingPhase() === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE && freeResearchLeft > 0;
                 GameLogic.handleResearchClick({ currentTarget: discoveryElement, isFree: isFreeClick });
                 return; // Prevent other handlers
            }
            // 2. Daily Free Research Button Click
            if (event.target.matches('#freeResearchButton')) {
                GameLogic.handleFreeResearchClick();
                return;
            }
            // 3. Seek Guidance Button Click
            if (event.target.matches('#seekGuidanceButton')) {
                GameLogic.triggerGuidedReflection();
                return;
            }
            // Add/Sell buttons are handled by the specific listener below
        });
    } else { console.error("Study Screen element not found for listener attachment."); }

    // --- Study Screen Research Discoveries Actions (Specific Delegation) ---
    // Listener specifically on the results container
    if (studyResearchDiscoveriesArea) {
        studyResearchDiscoveriesArea.addEventListener('click', (event) => {
             const actionButton = event.target.closest('button.add-button, button.sell-button');
             if (actionButton) {
                  const conceptIdStr = actionButton.dataset.conceptId;
                  if (conceptIdStr) {
                      const conceptId = parseInt(conceptIdStr);
                      if (!isNaN(conceptId)) {
                          if (actionButton.classList.contains('add-button')) {
                              GameLogic.addConceptToGrimoireById(conceptId, actionButton);
                          } else if (actionButton.classList.contains('sell-button')) {
                              GameLogic.handleSellConcept(event); // Pass event for context
                          }
                      } else { console.error("Invalid conceptId:", conceptIdStr); }
                  } else { console.error("Button missing conceptId:", actionButton); }
             }
        });
    } else { console.error("#studyResearchDiscoveries element not found for listener attachment."); }


    // --- Grimoire Actions (Delegation on Controls and Content) ---
    const grimoireControls = document.getElementById('grimoireControls');
    if (grimoireControls) { grimoireControls.addEventListener('change', UI.refreshGrimoireDisplay); grimoireControls.addEventListener('input', (event) => { if (event.target.id === 'grimoireSearchInput') UI.refreshGrimoireDisplay(); }); }
    if (grimoireContent) {
        // Delegated listener for buttons WITHIN grimoire cards
        grimoireContent.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button.card-sell-button, button.card-focus-button');
            if (!targetButton) return; // Ignore clicks not on these buttons
            event.stopPropagation(); // Prevent card click from opening popup
            const conceptIdStr = targetButton.dataset.conceptId;
            if (conceptIdStr) {
                const conceptId = parseInt(conceptIdStr);
                if (!isNaN(conceptId)) {
                    if (targetButton.classList.contains('card-sell-button')) {
                        GameLogic.handleSellConcept(event); // Pass event for context
                    } else if (targetButton.classList.contains('card-focus-button')) {
                        GameLogic.handleCardFocusToggle(conceptId); // Pass ID directly
                    }
                }
            }
        });
        // Listener for clicking the card itself to open popup (ensure it doesn't fire if buttons clicked)
         grimoireContent.addEventListener('click', (event) => {
             if (event.target.closest('button')) return; // Ignore if click was on a button
             const card = event.target.closest('.concept-card');
             if (card) {
                 const conceptId = parseInt(card.dataset.conceptId);
                 if (!isNaN(conceptId)) {
                     UI.showConceptDetailPopup(conceptId);
                 }
             }
         });
    }

    // --- Persona Screen Actions (Delegation) ---
    if (personaScreenDiv) {
         const detailedViewBtn = document.getElementById('showDetailedViewBtn'); const summaryViewBtn = document.getElementById('showSummaryViewBtn'); const personaDetailedDiv = document.getElementById('personaDetailedView'); const personaSummaryDiv = document.getElementById('personaSummaryView');
         if (detailedViewBtn && summaryViewBtn && personaDetailedDiv && personaSummaryDiv) { detailedViewBtn.addEventListener('click', () => { personaDetailedDiv.classList.add('current'); personaDetailedDiv.classList.remove('hidden'); personaSummaryDiv.classList.add('hidden'); personaSummaryDiv.classList.remove('current'); detailedViewBtn.classList.add('active'); summaryViewBtn.classList.remove('active'); }); summaryViewBtn.addEventListener('click', () => { personaSummaryDiv.classList.add('current'); personaSummaryDiv.classList.remove('hidden'); personaDetailedDiv.classList.add('hidden'); personaDetailedDiv.classList.remove('current'); summaryViewBtn.classList.add('active'); detailedViewBtn.classList.remove('active'); UI.displayPersonaSummary(); }); }
         // Listener for unlocking deep dive levels (delegated)
         const personaElementDetails = document.getElementById('personaElementDetails');
         if (personaElementDetails) { personaElementDetails.addEventListener('click', (event) => { if (event.target.matches('.unlock-button')) GameLogic.handleUnlockLibraryLevel(event); }); }
         // Listener for Explore/Suggest buttons
         personaScreenDiv.addEventListener('click', (event) => { if (event.target.matches('#exploreTapestryButton')) GameLogic.showTapestryDeepDive(); else if (event.target.matches('#suggestSceneButton')) GameLogic.handleSuggestSceneClick(); });
    }

    // --- Concept Detail Popup Actions (Delegation) ---
    if (conceptDetailPopupElem) { conceptDetailPopupElem.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; const conceptId = GameLogic.getCurrentPopupConceptId(); if (button.id === 'addToGrimoireButton' && conceptId !== null) GameLogic.addConceptToGrimoireById(conceptId, button); else if (button.id === 'markAsFocusButton' && conceptId !== null) GameLogic.handleToggleFocusConcept(); else if (button.classList.contains('popup-sell-button') && conceptId !== null) GameLogic.handleSellConcept(event); // Pass event for context
 else if (button.id === 'evolveArtButton' && conceptId !== null) GameLogic.attemptArtEvolution(); else if (button.id === 'saveMyNoteButton' && conceptId !== null) GameLogic.handleSaveNote(); }); }

    // --- Reflection Modal ---
    const reflectionCheck = document.getElementById('reflectionCheckbox'); const confirmReflectionBtn = document.getElementById('confirmReflectionButton');
    if (reflectionCheck) reflectionCheck.addEventListener('change', () => { if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked; });
    if (confirmReflectionBtn) confirmReflectionBtn.addEventListener('click', () => { const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox'); GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false); });

    // --- Repository Actions (Delegation) ---
     if (repositoryContainer) { repositoryContainer.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; if (button.dataset.sceneId) GameLogic.handleMeditateScene(event); else if (button.dataset.experimentId) GameLogic.handleAttemptExperiment(event); }); }

    // --- Tapestry Deep Dive Modal Actions (Delegation) ---
    if (tapestryDeepDiveModalElem) { const deepDiveNodesContainer = document.getElementById('deepDiveAnalysisNodes'); if (deepDiveNodesContainer) { deepDiveNodesContainer.addEventListener('click', (event) => { const button = event.target.closest('.deep-dive-node'); if (!button) return; const nodeId = button.dataset.nodeId; if (nodeId === 'contemplation') GameLogic.handleContemplationNodeClick(); else if (nodeId) GameLogic.handleDeepDiveNodeClick(nodeId); }); } // Listener for complete contemplation button is added dynamically in UI.js
 }

    // --- Settings Popup Actions ---
    if (settingsPopupElem) { settingsPopupElem.addEventListener('click', (event) => { if (event.target.matches('#forceSaveButton')) { State.saveGameState(); UI.showTemporaryMessage("Game Saved!", 1500); } else if (event.target.matches('#resetAppButton')) { if (confirm("Reset ALL progress? This cannot be undone.")) { console.log("Resetting application..."); State.clearGameState(); UI.setupInitialUI(); UI.hidePopups(); UI.showTemporaryMessage("Progress Reset!", 3000); const loadBtn = document.getElementById('loadButton'); if(loadBtn) loadBtn.classList.add('hidden'); } } }); }

     // --- Info Icon Handling (Delegated to body) ---
     document.body.addEventListener('click', (event) => { const infoIcon = event.target.closest('.info-icon'); if (infoIcon) { event.preventDefault(); event.stopPropagation(); const message = infoIcon.getAttribute('title'); const infoPopupContentElem = document.getElementById('infoPopupContent'); if (message && infoPopupElem && popupOverlay && infoPopupContentElem) { infoPopupContentElem.textContent = message; infoPopupElem.classList.remove('hidden'); popupOverlay.classList.remove('hidden'); } else if (message) { UI.showTemporaryMessage(message, 4000); } } });

    console.log("All event listeners attached.");
}

// --- Start the App ---
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initializeApp); }
else { initializeApp(); }

console.log("main.js loaded.");
