// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
// Utils, Config, Data are mostly used by other modules, no direct import needed here usually

console.log("main.js loading...");

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab v13+...");

    // Attempt to load game state first
    const loaded = State.loadGameState();

    if (loaded) {
        console.log("Existing session loaded.");
         if (State.getState().questionnaireCompleted) {
              console.log("Continuing session...");
              GameLogic.checkForDailyLogin(); // Check daily status *after* loading state
              UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); // Apply UI visibility
              UI.updateInsightDisplays(); // Update displays with loaded insight
              UI.updateFocusSlotsDisplay();
              UI.updateGrimoireCounter();
              UI.populateGrimoireFilters(); // Populate filters
              // Initial screen display will be handled by showScreen
              UI.showScreen('personaScreen'); // Default to Persona screen after load
              UI.hidePopups(); // Ensure no popups are stuck open
         } else {
              console.log("Loaded state incomplete. Restarting questionnaire.");
              // Keep loaded state but reset questionnaire progress
              State.updateElementIndex(0);
              UI.initializeQuestionnaireUI();
               UI.showScreen('questionnaireScreen');
         }
         // Hide load button since load was successful
         const loadBtn = document.getElementById('loadButton');
         if(loadBtn) loadBtn.classList.add('hidden');

    } else {
        console.log("No valid saved session found or load error. Starting fresh.");
        // Setup initial UI for a new game (Welcome Screen)
        UI.setupInitialUI();
         // If load failed due to error, show message
         if (localStorage.getItem(State.SAVE_KEY)) { // Check if there *was* data using imported key
             UI.showTemporaryMessage("Error loading session. Starting fresh.", 4000);
         }
    }

    // Setup common UI elements regardless of load state
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
        State.clearGameState(); UI.initializeQuestionnaireUI(); UI.showScreen('questionnaireScreen');
        if(loadButton) loadButton.classList.add('hidden');
    });
    if (loadButton && !loadButton.classList.contains('hidden')) {
        loadButton.addEventListener('click', () => {
            if(State.loadGameState()){
                if (State.getState().questionnaireCompleted) { GameLogic.checkForDailyLogin(); UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); UI.showScreen('personaScreen'); }
                else { UI.initializeQuestionnaireUI(); UI.showScreen('questionnaireScreen'); }
                loadButton.classList.add('hidden');
            } else { UI.showTemporaryMessage("Load failed. Starting new.", 3000); State.clearGameState(); UI.initializeQuestionnaireUI(); UI.showScreen('questionnaireScreen'); loadButton.classList.add('hidden'); }
        });
    }

    // Questionnaire Navigation
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // Main Navigation
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => { if(!button.classList.contains('settings-button')) { button.addEventListener('click', () => { const target = button.dataset.target; if (target) UI.showScreen(target); }); } });
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) settingsBtn.addEventListener('click', UI.showSettings);

    // Popups & Modals Close Buttons
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

    // Concept Detail Popup Actions (Event Delegation on Popup Actions Div)
    const popupActionsDiv = document.querySelector('#conceptDetailPopup .popup-actions');
    if (popupActionsDiv) {
         popupActionsDiv.addEventListener('click', (event) => {
               const button = event.target.closest('button');
               if (!button) return;
               const conceptId = GameLogic.getCurrentPopupConceptId(); // Get ID from logic module

               if (button.id === 'addToGrimoireButton' && conceptId !== null) {
                    GameLogic.addConceptToGrimoireById(conceptId, button);
               } else if (button.id === 'markAsFocusButton' && conceptId !== null) {
                    GameLogic.handleToggleFocusConcept(); // No args needed as it uses current ID
               } else if (button.classList.contains('popup-sell-button') && conceptId !== null) { // Target sell button by class
                    GameLogic.handleSellConcept(event); // Pass event to get context
               }
               // Add other popup button handlers here if needed
         });
    }

    // Evolve Button (separate as it's inside popup details, not actions div)
    const evolveBtn = document.getElementById('evolveArtButton');
    if (evolveBtn) evolveBtn.addEventListener('click', GameLogic.attemptArtEvolution);

    // Save Note Button
    const saveNoteBtn = document.getElementById('saveMyNoteButton');
    if (saveNoteBtn) saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);

    // Grimoire Filters & Card Interaction (Sell Button)
    const grimoireControls = document.getElementById('grimoireControls');
    if (grimoireControls) { grimoireControls.addEventListener('change', UI.refreshGrimoireDisplay); }
    const grimoireContent = document.getElementById('grimoireContent');
    if (grimoireContent) {
        grimoireContent.addEventListener('click', (event) => {
            if (event.target.matches('.card-sell-button')) {
                 event.stopPropagation(); GameLogic.handleSellConcept(event);
            }
            // Card click to open popup is handled directly in UI.renderCard
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

    // Research Output Actions (Add/Sell buttons added dynamically)
    const researchOutputArea = document.getElementById('researchOutput');
    if (researchOutputArea) {
        researchOutputArea.addEventListener('click', (event) => {
            const button = event.target.closest('button'); if (!button) return;
            const conceptIdStr = button.dataset.conceptId; if (!conceptIdStr) return; const conceptId = parseInt(conceptIdStr); if (isNaN(conceptId)) return;
            if (button.classList.contains('add-button')) GameLogic.addConceptToGrimoireById(conceptId, button);
            else if (button.classList.contains('sell-button')) GameLogic.handleSellConcept(event);
        });
    }

     // Element Library (Button clicks to show content)
     const libraryButtonsContainer = document.getElementById('elementLibraryButtons');
     if (libraryButtonsContainer) { libraryButtonsContainer.addEventListener('click', (event) => { const button = event.target.closest('button'); if (button && button.dataset.elementKey) UI.displayElementDeepDive(button.dataset.elementKey); }); }
      // Element Library (Unlock clicks - delegated)
     const libraryContentContainer = document.getElementById('elementLibraryContent');
      if (libraryContentContainer) { libraryContentContainer.addEventListener('click', (event) => { if (event.target.matches('.unlock-button')) GameLogic.handleUnlockLibraryLevel(event); }); }

     // Repository Actions (Delegated)
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

    console.log("Event listeners attached.");
}

// --- Start the App ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log("main.js loaded.");
