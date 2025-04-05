// --- START OF FILE main.js --- (Corrected - Final Version)

// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
import * as Config from './config.js'; // Ensure Config is imported for save key etc.

console.log("main.js loading...");

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab (Flow Refactor)...");
    const loaded = State.loadGameState();
    UI.updateInsightDisplays();
    UI.updateGrimoireCounter();
    UI.populateGrimoireFilters(); // Populate dropdowns
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
             UI.showScreen('personaScreen'); // Default to Persona screen after load
             UI.hidePopups(); // Ensure no popups stuck
        } else {
             console.log("Loaded state incomplete (Questionnaire not finished).");
             if (currentState.currentElementIndex < 0 || currentState.currentElementIndex >= elementNames.length) { State.updateElementIndex(0); } // Reset index if invalid
             UI.initializeQuestionnaireUI(); // Setup questionnaire UI
             UI.showScreen('questionnaireScreen');
        }
        const loadBtn = document.getElementById('loadButton');
        if (loadBtn) loadBtn.classList.add('hidden'); // Hide load button after successful load
    } else { // No valid save found
        console.log("No valid saved session. Starting fresh.");
        UI.setupInitialUI(); // Setup welcome screen, ensure load button hidden etc.
        if (localStorage.getItem(Config.SAVE_KEY)) { UI.showTemporaryMessage("Error loading previous session. Starting fresh.", 4000); localStorage.removeItem(Config.SAVE_KEY); } // Clear potentially corrupted data
    }
    console.log("Initialization complete. Attaching event listeners.");
    attachEventListeners();
    console.log("Application ready.");
}

// --- Event Listeners ---
function attachEventListeners() {
    console.log("Attaching event listeners...");

    // --- Element References --- (Keep concise)
    const startButton = document.getElementById('startGuidedButton');
    const loadButton = document.getElementById('loadButton');
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    const mainNavBar = document.getElementById('mainNavBar');
    // settingsBtn handled by delegation below
    const popupOverlay = document.getElementById('popupOverlay');
    const grimoireContent = document.getElementById('grimoireContent');
    const studyScreenElement = document.getElementById('studyScreen'); // For delegation
    // REMOVED: const researchOutputArea = document.getElementById('researchOutput'); // No longer needed
    const repositoryContainer = document.getElementById('repositoryScreen'); // For repo action delegation
    const settingsPopupElem = document.getElementById('settingsPopup');
    const personaScreenDiv = document.getElementById('personaScreen'); // For button delegation
    const tapestryDeepDiveModalElem = document.getElementById('tapestryDeepDiveModal');
    const conceptDetailPopupElem = document.getElementById('conceptDetailPopup');
    // reflectionModalElem handled by delegation below
    const infoPopupElem = document.getElementById('infoPopup');
    const infoPopupContent = document.getElementById('infoPopupContent'); // Needed for info icon handler


    // --- Welcome Screen ---
    if (startButton) startButton.addEventListener('click', () => { State.clearGameState(); UI.initializeQuestionnaireUI(); UI.showScreen('questionnaireScreen'); if(loadButton) loadButton.classList.add('hidden'); });
    // Load button logic handled in initializeApp

    // --- Questionnaire Navigation ---
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // --- Main Navigation & Settings (Delegation) ---
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
    // Delegate common close actions to body
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('#closePopupButton') ||
            event.target.matches('#closeReflectionModalButton') ||
            event.target.matches('#closeSettingsPopupButton') ||
            event.target.matches('#closeDeepDiveButton') ||
            event.target.matches('#closeInfoPopupButton') ||
            event.target.matches('#confirmInfoPopupButton')) {
            UI.hidePopups();
        }
        if (event.target.matches('#closeMilestoneAlertButton')) {
            UI.hideMilestoneAlert();
        }
    });
    // Overlay click closes all popups
    if (popupOverlay) popupOverlay.addEventListener('click', UI.hidePopups);

    // --- Study Screen Actions (Delegation for Unified Layout) ---
    if (studyScreenElement) {
        studyScreenElement.addEventListener('click', (event) => {
            // 1. Element Research Click
            const discoveryElement = event.target.closest('.initial-discovery-element.clickable');
            if (discoveryElement) {
                 const freeResearchLeft = State.getInitialFreeResearchRemaining();
                 GameLogic.handleResearchClick({ currentTarget: discoveryElement, isFree: freeResearchLeft > 0 });
                 return;
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
            // 4. Research Discovery Results Actions (Add/Sell)
             const resultsArea = event.target.closest('#studyResearchDiscoveries'); // Use the unified ID
             if (resultsArea) {
                 const actionButton = event.target.closest('button.add-button, button.sell-button'); // Look for specific buttons
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
                         }
                     }
                 }
             }
        });
    }

    // --- Grimoire Actions (Delegation) ---
    const grimoireControls = document.getElementById('grimoireControls');
    if (grimoireControls) { grimoireControls.addEventListener('change', UI.refreshGrimoireDisplay); grimoireControls.addEventListener('input', (event) => { if (event.target.id === 'grimoireSearchInput') UI.refreshGrimoireDisplay(); }); }
    if (grimoireContent) { grimoireContent.addEventListener('click', (event) => { const targetButton = event.target.closest('button.card-sell-button, button.card-focus-button'); if (!targetButton) return; const conceptIdStr = targetButton.dataset.conceptId; if (conceptIdStr) { const conceptId = parseInt(conceptIdStr); if (!isNaN(conceptId)) { if (targetButton.classList.contains('card-sell-button')) { event.stopPropagation(); GameLogic.handleSellConcept(event); } else if (targetButton.classList.contains('card-focus-button')) { event.stopPropagation(); GameLogic.handleCardFocusToggle(conceptId); } } } }); }

    // --- Persona Screen Actions (Delegation) ---
    if (personaScreenDiv) {
         const detailedViewBtn = document.getElementById('showDetailedViewBtn'); const summaryViewBtn = document.getElementById('showSummaryViewBtn'); const personaDetailedDiv = document.getElementById('personaDetailedView'); const personaSummaryDiv = document.getElementById('personaSummaryView');
         if (detailedViewBtn && summaryViewBtn && personaDetailedDiv && personaSummaryDiv) { detailedViewBtn.addEventListener('click', () => { personaDetailedDiv.classList.add('current'); personaDetailedDiv.classList.remove('hidden'); personaSummaryDiv.classList.add('hidden'); personaSummaryDiv.classList.remove('current'); detailedViewBtn.classList.add('active'); summaryViewBtn.classList.remove('active'); }); summaryViewBtn.addEventListener('click', () => { personaSummaryDiv.classList.add('current'); personaSummaryDiv.classList.remove('hidden'); personaDetailedDiv.classList.add('hidden'); personaDetailedDiv.classList.remove('current'); summaryViewBtn.classList.add('active'); detailedViewBtn.classList.remove('active'); UI.displayPersonaSummary(); }); }
         const personaElementDetails = document.getElementById('personaElementDetails');
         if (personaElementDetails) { personaElementDetails.addEventListener('click', (event) => { if (event.target.matches('.unlock-button')) GameLogic.handleUnlockLibraryLevel(event); }); }
         personaScreenDiv.addEventListener('click', (event) => { if (event.target.matches('#exploreTapestryButton')) GameLogic.showTapestryDeepDive(); else if (event.target.matches('#suggestSceneButton')) GameLogic.handleSuggestSceneClick(); });
    }

    // --- Concept Detail Popup Actions (Delegation) ---
    if (conceptDetailPopupElem) { conceptDetailPopupElem.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; const conceptId = GameLogic.getCurrentPopupConceptId(); if (button.id === 'addToGrimoireButton' && conceptId !== null) GameLogic.addConceptToGrimoireById(conceptId, button); else if (button.id === 'markAsFocusButton' && conceptId !== null) GameLogic.handleToggleFocusConcept(); else if (button.classList.contains('popup-sell-button') && conceptId !== null) GameLogic.handleSellConcept(event); else if (button.id === 'evolveArtButton' && conceptId !== null) GameLogic.attemptArtEvolution(); else if (button.id === 'saveMyNoteButton' && conceptId !== null) GameLogic.handleSaveNote(); }); }

    // --- Reflection Modal ---
    const reflectionCheck = document.getElementById('reflectionCheckbox'); const confirmReflectionBtn = document.getElementById('confirmReflectionButton');
    if (reflectionCheck) reflectionCheck.addEventListener('change', () => { if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked; });
    if (confirmReflectionBtn) confirmReflectionBtn.addEventListener('click', () => { const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox'); GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false); });

    // --- Repository Actions (Delegation) ---
     if (repositoryContainer) { repositoryContainer.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; if (button.dataset.sceneId) GameLogic.handleMeditateScene(event); else if (button.dataset.experimentId) GameLogic.handleAttemptExperiment(event); }); }

    // --- Tapestry Deep Dive Modal Actions (Delegation) ---
    if (tapestryDeepDiveModalElem) { const deepDiveNodesContainer = document.getElementById('deepDiveAnalysisNodes'); if (deepDiveNodesContainer) { deepDiveNodesContainer.addEventListener('click', (event) => { const button = event.target.closest('.deep-dive-node'); if (!button) return; const nodeId = button.dataset.nodeId; if (nodeId === 'contemplation') GameLogic.handleContemplationNodeClick(); else if (nodeId) GameLogic.handleDeepDiveNodeClick(nodeId); }); } }

    // --- Settings Popup Actions ---
    if (settingsPopupElem) { settingsPopupElem.addEventListener('click', (event) => { if (event.target.matches('#forceSaveButton')) { State.saveGameState(); UI.showTemporaryMessage("Game Saved!", 1500); } else if (event.target.matches('#resetAppButton')) { if (confirm("Reset ALL progress? This cannot be undone.")) { console.log("Resetting application..."); State.clearGameState(); UI.setupInitialUI(); UI.hidePopups(); UI.showTemporaryMessage("Progress Reset!", 3000); const loadBtn = document.getElementById('loadButton'); if(loadBtn) loadBtn.classList.add('hidden'); } } }); }

     // --- Info Icon Handling (Delegated to body) ---
     document.body.addEventListener('click', (event) => { const infoIcon = event.target.closest('.info-icon'); if (infoIcon) { event.preventDefault(); event.stopPropagation(); const message = infoIcon.getAttribute('title'); if (message && infoPopupElem && popupOverlay && infoPopupContent) { infoPopupContent.textContent = message; infoPopupElem.classList.remove('hidden'); popupOverlay.classList.remove('hidden'); } else if (message) { UI.showTemporaryMessage(message, 4000); } } });

    console.log("All event listeners attached.");
}

// --- Start the App ---
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initializeApp); }
else { initializeApp(); }

console.log("main.js loaded.");
// --- END OF FILE main.js ---
