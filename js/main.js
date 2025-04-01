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
              GameLogic.generateTapestryNarrative(true); // Calculate initial narrative analysis
              UI.showScreen('personaScreen'); // Default to Persona screen after load
              UI.hidePopups(); // Ensure no popups are stuck open
         } else {
              console.log("Loaded state incomplete. Restarting questionnaire.");
              State.updateElementIndex(0);
              UI.initializeQuestionnaireUI();
               UI.showScreen('questionnaireScreen');
         }
         const loadBtn = document.getElementById('loadButton');
         if(loadBtn) loadBtn.classList.add('hidden');

    } else {
        console.log("No valid saved session found or load error. Starting fresh.");
        UI.setupInitialUI();
         if (localStorage.getItem(State.SAVE_KEY)) {
             UI.showTemporaryMessage("Error loading session. Starting fresh.", 4000);
         }
    }
    UI.updateInsightDisplays(); // Update displays regardless of load state
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
    if (startButton) startButton.addEventListener('click', () => { State.clearGameState(); UI.initializeQuestionnaireUI(); UI.showScreen('questionnaireScreen'); if(loadButton) loadButton.classList.add('hidden'); });
    if (loadButton && !loadButton.classList.contains('hidden')) { loadButton.addEventListener('click', () => { if(State.loadGameState()){ if (State.getState().questionnaireCompleted) { GameLogic.checkForDailyLogin(); UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); GameLogic.generateTapestryNarrative(true); UI.showScreen('personaScreen'); } else { UI.initializeQuestionnaireUI(); UI.showScreen('questionnaireScreen'); } loadButton.classList.add('hidden'); } else { UI.showTemporaryMessage("Load failed. Starting new.", 3000); State.clearGameState(); UI.initializeQuestionnaireUI(); UI.showScreen('questionnaireScreen'); loadButton.classList.add('hidden'); } }); }

    // Questionnaire Navigation
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // Main Navigation
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => { if(!button.classList.contains('settings-button')) { button.addEventListener('click', () => { const target = button.dataset.target; if (target) { const currentScreen = document.querySelector('.screen.current'); if (!currentScreen || currentScreen.id !== target) { if (target === 'personaScreen') GameLogic.displayPersonaScreenLogic(); else if (target === 'studyScreen') GameLogic.displayStudyScreenLogic(); else if (target === 'grimoireScreen') UI.refreshGrimoireDisplay(); else if (target === 'repositoryScreen') UI.displayRepositoryContent(); UI.showScreen(target); } } }); } });
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) settingsBtn.addEventListener('click', UI.showSettings);

    // Popups & Modals Close Buttons
    const closePopupBtn = document.getElementById('closePopupButton');
    const overlay = document.getElementById('popupOverlay');
    const closeReflectionBtn = document.getElementById('closeReflectionModalButton');
    const closeSettingsBtn = document.getElementById('closeSettingsPopupButton');
    const closeMilestoneBtn = document.getElementById('closeMilestoneAlertButton');
    const closeDeepDiveBtn = document.getElementById('closeDeepDiveButton'); // *** NEW ***
    if (closePopupBtn) closePopupBtn.addEventListener('click', UI.hidePopups);
    if (overlay) overlay.addEventListener('click', UI.hidePopups);
    if (closeReflectionBtn) closeReflectionBtn.addEventListener('click', UI.hidePopups);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (closeMilestoneBtn) closeMilestoneBtn.addEventListener('click', UI.hideMilestoneAlert);
    if (closeDeepDiveBtn) closeDeepDiveBtn.addEventListener('click', UI.hidePopups); // *** NEW ***

    // Concept Detail Popup Actions (Delegation)
    const popupActionsDiv = document.querySelector('#conceptDetailPopup .popup-actions');
    if (popupActionsDiv) { popupActionsDiv.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; const conceptId = GameLogic.getCurrentPopupConceptId(); if (conceptId === null) { console.warn("Popup action clicked but no concept ID stored."); return; } if (button.id === 'addToGrimoireButton') { GameLogic.addConceptToGrimoireById(conceptId, button); } else if (button.id === 'markAsFocusButton') { GameLogic.handleToggleFocusConcept(); } else if (button.classList.contains('popup-sell-button')) { GameLogic.handleSellConcept(event); } }); }
    const evolveBtn = document.getElementById('evolveArtButton'); if (evolveBtn) evolveBtn.addEventListener('click', GameLogic.attemptArtEvolution);
    const saveNoteBtn = document.getElementById('saveMyNoteButton'); if (saveNoteBtn) saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);

    // Grimoire Filters & Card Interaction (Delegation)
    const grimoireControls = document.getElementById('grimoireControls'); if (grimoireControls) { grimoireControls.addEventListener('change', UI.refreshGrimoireDisplay); }
    const grimoireContent = document.getElementById('grimoireContent'); if (grimoireContent) { grimoireContent.addEventListener('click', (event) => { if (event.target.matches('.card-sell-button')) { event.stopPropagation(); GameLogic.handleSellConcept(event); } }); }

    // Reflection Modal
    const reflectionCheck = document.getElementById('reflectionCheckbox'); const confirmReflectionBtn = document.getElementById('confirmReflectionButton'); if (reflectionCheck) reflectionCheck.addEventListener('change', () => { if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked; }); if (confirmReflectionBtn) confirmReflectionBtn.addEventListener('click', () => { const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox'); GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false); });

    // Study Actions (Delegation)
    const researchContainer = document.getElementById('researchButtonContainer'); const freeResearchBtn = document.getElementById('freeResearchButton'); const guidanceBtn = document.getElementById('seekGuidanceButton');
    if (researchContainer) { researchContainer.addEventListener('click', (event) => { const button = event.target.closest('.research-button'); if (button) GameLogic.handleResearchClick({ currentTarget: button }); }); }
    if (freeResearchBtn) freeResearchBtn.addEventListener('click', GameLogic.handleFreeResearchClick);
    if (guidanceBtn) guidanceBtn.addEventListener('click', GameLogic.triggerGuidedReflection);
    const researchOutputArea = document.getElementById('researchOutput'); if (researchOutputArea) { researchOutputArea.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; const conceptIdStr = button.dataset.conceptId; if (!conceptIdStr) return; const conceptId = parseInt(conceptIdStr); if (isNaN(conceptId)) return; if (button.classList.contains('add-button')) GameLogic.addConceptToGrimoireById(conceptId, button); else if (button.classList.contains('sell-button')) GameLogic.handleSellConcept(event); }); }

     // Element Library (Delegation)
     const libraryButtonsContainer = document.getElementById('elementLibraryButtons'); if (libraryButtonsContainer) { libraryButtonsContainer.addEventListener('click', (event) => { const button = event.target.closest('button'); if (button && button.dataset.elementKey) { libraryButtonsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active')); button.classList.add('active'); UI.displayElementDeepDive(button.dataset.elementKey); } }); }
     const libraryContentContainer = document.getElementById('elementLibraryContent'); if (libraryContentContainer) { libraryContentContainer.addEventListener('click', (event) => { if (event.target.matches('.unlock-button')) GameLogic.handleUnlockLibraryLevel(event); }); }

     // Repository Actions (Delegation)
     const repositoryContainer = document.getElementById('repositoryScreen'); if (repositoryContainer) { repositoryContainer.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; if (button.dataset.sceneId) GameLogic.handleMeditateScene(event); else if (button.dataset.experimentId) GameLogic.handleAttemptExperiment(event); }); }

    // Settings Popup Actions
    const forceSaveBtn = document.getElementById('forceSaveButton'); const resetBtn = document.getElementById('resetAppButton'); if (forceSaveBtn) forceSaveBtn.addEventListener('click', () => { State.saveGameState(); UI.showTemporaryMessage("Game Saved!", 1500); }); if (resetBtn) resetBtn.addEventListener('click', () => { if (confirm("Reset ALL progress? This cannot be undone.")) { console.log("Resetting application..."); State.clearGameState(); UI.setupInitialUI(); UI.hidePopups(); UI.showTemporaryMessage("Progress Reset!", 3000); const loadBtn = document.getElementById('loadButton'); if(loadBtn) loadBtn.classList.add('hidden'); } });

     // Persona View Toggle Buttons
     const detailedViewBtn = document.getElementById('showDetailedViewBtn'); const summaryViewBtn = document.getElementById('showSummaryViewBtn'); const personaDetailedDiv = document.getElementById('personaDetailedView'); const personaSummaryDiv = document.getElementById('personaSummaryView'); if(detailedViewBtn && summaryViewBtn && personaDetailedDiv && personaSummaryDiv) { detailedViewBtn.addEventListener('click', () => { personaDetailedDiv.classList.add('current'); personaDetailedDiv.classList.remove('hidden'); personaSummaryDiv.classList.add('hidden'); personaSummaryDiv.classList.remove('current'); detailedViewBtn.classList.add('active'); summaryViewBtn.classList.remove('active'); }); summaryViewBtn.addEventListener('click', () => { personaSummaryDiv.classList.add('current'); personaSummaryDiv.classList.remove('hidden'); personaDetailedDiv.classList.add('hidden'); personaDetailedDiv.classList.remove('current'); summaryViewBtn.classList.add('active'); detailedViewBtn.classList.remove('active'); UI.displayPersonaSummary(); }); }

    // *** NEW: Tapestry Deep Dive Listeners ***
    const exploreTapestryBtn = document.getElementById('exploreTapestryButton');
    if (exploreTapestryBtn) exploreTapestryBtn.addEventListener('click', GameLogic.showTapestryDeepDive);

    const deepDiveNodesContainer = document.getElementById('deepDiveAnalysisNodes');
    if (deepDiveNodesContainer) {
        deepDiveNodesContainer.addEventListener('click', (event) => {
             const button = event.target.closest('.deep-dive-node');
             if (button && button.dataset.nodeId) {
                 if (button.dataset.nodeId === 'contemplation') {
                     GameLogic.handleContemplationNodeClick();
                 } else {
                     GameLogic.handleDeepDiveNodeClick(button.dataset.nodeId);
                 }
             }
        });
    }
     // Listener for dynamically added "Complete Contemplation" button
     const deepDiveDetailArea = document.getElementById('deepDiveDetailContent');
     if (deepDiveDetailArea) {
          deepDiveDetailArea.addEventListener('click', (event) => {
               const button = event.target.closest('.complete-contemplation-button');
               if (button && button.dataset.task) {
                    try {
                         const taskData = JSON.parse(button.dataset.task);
                         GameLogic.handleCompleteContemplation(taskData);
                    } catch (e) {
                         console.error("Error parsing contemplation task data:", e);
                    }
               }
          });
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
