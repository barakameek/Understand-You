// --- START OF FULL main.js --- (Adding D&D, Shelf Click, Lore Unlock, Synergy Button Listeners)

// js/main.js - Application Entry Point, Event Listeners, Initialization
import * as State from './state.js';
import * as UI from './ui.js';
import * as GameLogic from './gameLogic.js';
import * as Config from './config.js';
import { elementNames } from '../data.js'; // Import if needed

console.log("main.js loading...");

// --- Drag & Drop State ---
let draggedCardId = null; // Keep track of the card being dragged

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
             GameLogic.checkSynergyTensionStatus(); // ** Set initial synergy button state **
             UI.updateFocusSlotsDisplay();
             // Refresh Grimoire with potentially loaded category filter
             const activeShelf = document.querySelector('.grimoire-shelf.active-shelf'); // Check if UI already rendered a filter
             const initialCategory = activeShelf ? activeShelf.dataset.categoryId : 'All';
             UI.refreshGrimoireDisplay({ filterCategory: initialCategory }); // Populate grimoire
             UI.showScreen('personaScreen'); // Start on Persona screen
             UI.hidePopups(); // Ensure no popups are open on load
        } else {
             console.log("Loaded state incomplete (Questionnaire not finished). Restarting questionnaire.");
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
    const grimoireContent = document.getElementById('grimoireContent'); // Card Area
    const grimoireShelvesContainer = document.getElementById('grimoireShelvesContainer'); // Shelves Area
    const studyScreenElement = document.getElementById('studyScreen');
    const studyResearchDiscoveriesArea = document.getElementById('studyResearchDiscoveries');
    const repositoryContainer = document.getElementById('repositoryScreen');
    const settingsPopupElem = document.getElementById('settingsPopup');
    const personaScreenDiv = document.getElementById('personaScreen');
    const tapestryDeepDiveModalElem = document.getElementById('tapestryDeepDiveModal');
    const conceptDetailPopupElem = document.getElementById('conceptDetailPopup');
    const infoPopupElem = document.getElementById('infoPopup');

    // --- Welcome Screen ---
    if (startButton) startButton.addEventListener('click', () => {
        State.clearGameState();
        UI.initializeQuestionnaireUI();
        UI.showScreen('questionnaireScreen');
        if(loadButton) loadButton.classList.add('hidden');
    });
    if (loadButton) loadButton.addEventListener('click', initializeApp);

    // --- Questionnaire Navigation ---
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // --- Main Navigation & Popups (Delegation on Body/Nav) ---
    if (mainNavBar) { mainNavBar.addEventListener('click', (event) => { const button = event.target.closest('.nav-button'); if (!button) return; if (button.id === 'settingsButton') UI.showSettings(); else { const target = button.dataset.target; if (target) UI.showScreen(target); } }); }
    document.body.addEventListener('click', (event) => { if (event.target.matches('#closePopupButton, #closeReflectionModalButton, #closeSettingsPopupButton, #closeDeepDiveButton, #closeInfoPopupButton, #confirmInfoPopupButton')) UI.hidePopups(); if (event.target.matches('#closeMilestoneAlertButton')) UI.hideMilestoneAlert(); });
    if (popupOverlay) popupOverlay.addEventListener('click', UI.hidePopups);

    // --- Study Screen Actions (Delegation on Study Screen) ---
    if (studyScreenElement) {
        studyScreenElement.addEventListener('click', (event) => {
            const discoveryElement = event.target.closest('.initial-discovery-element.clickable');
            if (discoveryElement) {
                 const freeResearchLeft = State.getInitialFreeResearchRemaining();
                 const isFreeClick = State.getOnboardingPhase() === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE && freeResearchLeft > 0;
                 GameLogic.handleResearchClick({ currentTarget: discoveryElement, isFree: isFreeClick }); return;
            }
            if (event.target.matches('#freeResearchButton')) { GameLogic.handleFreeResearchClick(); return; }
            if (event.target.matches('#seekGuidanceButton')) { GameLogic.triggerGuidedReflection(); return; }
        });
    } else { console.error("Study Screen element not found for listener attachment."); }

    // --- Study Screen Research Discoveries Actions (Delegation on Specific Area) ---
    if (studyResearchDiscoveriesArea) {
        studyResearchDiscoveriesArea.addEventListener('click', (event) => {
             const actionButton = event.target.closest('button.add-button, button.sell-button');
             if (actionButton) {
                  event.stopPropagation();
                  const conceptIdStr = actionButton.dataset.conceptId;
                  if (conceptIdStr) { const conceptId = parseInt(conceptIdStr); if (!isNaN(conceptId)) { if (actionButton.classList.contains('add-button')) { GameLogic.addConceptToGrimoireById(conceptId, actionButton); } else if (actionButton.classList.contains('sell-button')) { GameLogic.handleSellConcept(event); } } else { console.error("Invalid conceptId:", conceptIdStr); } } else { console.error("Button missing conceptId:", actionButton); }
             } else { // Handle Card Click
                const card = event.target.closest('.concept-card');
                if (card) { const conceptIdStr = card.dataset.conceptId; if (conceptIdStr) { const conceptId = parseInt(conceptIdStr); if (!isNaN(conceptId)) { UI.showConceptDetailPopup(conceptId); } } }
             }
        });
    } else { console.error("#studyResearchDiscoveries element not found for listener attachment."); }


    // --- Grimoire Actions (Filters, Cards, Shelves) ---
    const grimoireControlsElem = document.getElementById('grimoireControls');
    if (grimoireControlsElem) {
        grimoireControlsElem.addEventListener('change', () => UI.refreshGrimoireDisplay());
        grimoireControlsElem.addEventListener('input', (event) => { if (event.target.id === 'grimoireSearchInput') UI.refreshGrimoireDisplay(); });
    }
    // ** Event Delegation for Grimoire Card Area **
    if (grimoireContent) {
        // Buttons within cards
        grimoireContent.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button.card-sell-button, button.card-focus-button');
            if (!targetButton) return;
            event.stopPropagation();
            const conceptIdStr = targetButton.dataset.conceptId;
            if (conceptIdStr) { const conceptId = parseInt(conceptIdStr); if (!isNaN(conceptId)) { if (targetButton.classList.contains('card-sell-button')) { GameLogic.handleSellConcept(event); } else if (targetButton.classList.contains('card-focus-button')) { GameLogic.handleCardFocusToggle(conceptId); } } }
        });
        // Card itself (for popup)
         grimoireContent.addEventListener('click', (event) => {
             if (event.target.closest('button')) return;
             const card = event.target.closest('.concept-card');
             if (card) { const conceptId = parseInt(card.dataset.conceptId); if (!isNaN(conceptId)) { UI.showConceptDetailPopup(conceptId); } }
         });
         // ** UPDATED: Drag Start Listener for Cards **
         grimoireContent.addEventListener('dragstart', (event) => {
             const card = event.target.closest('.concept-card');
             // Only allow dragging if phase allows categorization
             if (card && card.draggable && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
                 event.dataTransfer.setData('text/plain', card.dataset.conceptId);
                 event.dataTransfer.effectAllowed = 'move';
                 card.classList.add('dragging');
                 draggedCardId = parseInt(card.dataset.conceptId); // Store ID being dragged
                 console.log(`Dragging card: ${draggedCardId}`);
             } else {
                 event.preventDefault(); // Prevent dragging if not allowed
             }
         });
         // ** Drag End Listener for Cards **
         grimoireContent.addEventListener('dragend', (event) => {
             const card = event.target.closest('.concept-card');
             if (card) {
                 card.classList.remove('dragging');
             }
             draggedCardId = null; // Clear stored ID
             document.querySelectorAll('.grimoire-shelf.drag-over').forEach(shelf => shelf.classList.remove('drag-over'));
         });
    }
    // ** Event Delegation for Grimoire Shelves Container **
    if (grimoireShelvesContainer) {
        // Shelf Click for Filtering
        grimoireShelvesContainer.addEventListener('click', (event) => {
            const shelf = event.target.closest('.grimoire-shelf');
            if (shelf) {
                 const categoryId = shelf.classList.contains('show-all-shelf') ? 'All' : shelf.dataset.categoryId;
                 if (categoryId) {
                    grimoireShelvesContainer.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('active-shelf'));
                    shelf.classList.add('active-shelf');
                    UI.refreshGrimoireDisplay({ filterCategory: categoryId }); // Trigger refresh with category
                 }
            }
        });
        // Drag Over Shelf
        grimoireShelvesContainer.addEventListener('dragover', (event) => {
             event.preventDefault(); // Allow drop
             const shelf = event.target.closest('.grimoire-shelf:not(.show-all-shelf)'); // Exclude 'Show All'
             document.querySelectorAll('.grimoire-shelf.drag-over').forEach(s => s.classList.remove('drag-over')); // Clear previous
             if (shelf && draggedCardId !== null) { // Only highlight if dragging a card
                 event.dataTransfer.dropEffect = 'move';
                 shelf.classList.add('drag-over');
             } else {
                 event.dataTransfer.dropEffect = 'none'; // Indicate cannot drop here
             }
        });
        // Drag Leave Shelf
        grimoireShelvesContainer.addEventListener('dragleave', (event) => {
             const shelf = event.target.closest('.grimoire-shelf');
             // Check if the relatedTarget (where the mouse moved to) is still within the shelf
             if (shelf && !shelf.contains(event.relatedTarget)) {
                 shelf.classList.remove('drag-over');
             }
             // If leaving the container entirely, remove all drag-over
             if (!grimoireShelvesContainer.contains(event.relatedTarget)) {
                 document.querySelectorAll('.grimoire-shelf.drag-over').forEach(s => s.classList.remove('drag-over'));
             }
        });
        // Drop on Shelf
        grimoireShelvesContainer.addEventListener('drop', (event) => {
            event.preventDefault();
            const shelf = event.target.closest('.grimoire-shelf:not(.show-all-shelf)'); // Ensure drop on valid shelf
            document.querySelectorAll('.grimoire-shelf.drag-over').forEach(s => s.classList.remove('drag-over')); // Clear hover effect
            if (shelf && draggedCardId !== null) {
                const categoryId = shelf.dataset.categoryId;
                if (categoryId) {
                     console.log(`Attempting drop: Card ${draggedCardId} onto Shelf ${categoryId}`);
                     GameLogic.handleCategorizeCard(draggedCardId, categoryId); // Call logic handler
                }
            }
            // Always clear dragged ID after drop attempt, successful or not
            draggedCardId = null;
        });
    }

    // --- Persona Screen Actions (Delegation) ---
    if (personaScreenDiv) {
         const detailedViewBtn = document.getElementById('showDetailedViewBtn'); const summaryViewBtn = document.getElementById('showSummaryViewBtn'); const personaDetailedDiv = document.getElementById('personaDetailedView'); const personaSummaryDiv = document.getElementById('personaSummaryView');
         if (detailedViewBtn && summaryViewBtn && personaDetailedDiv && personaSummaryDiv) { detailedViewBtn.addEventListener('click', () => { personaDetailedDiv.classList.add('current'); personaDetailedDiv.classList.remove('hidden'); personaSummaryDiv.classList.add('hidden'); personaSummaryDiv.classList.remove('current'); detailedViewBtn.classList.add('active'); summaryViewBtn.classList.remove('active'); }); summaryViewBtn.addEventListener('click', () => { personaSummaryDiv.classList.add('current'); personaSummaryDiv.classList.remove('hidden'); personaDetailedDiv.classList.add('hidden'); personaDetailedDiv.classList.remove('current'); summaryViewBtn.classList.add('active'); detailedViewBtn.classList.remove('active'); UI.displayPersonaSummary(); }); }
         // Listener for unlocking deep dive levels (delegated)
         const personaElementDetails = document.getElementById('personaElementDetails');
         if (personaElementDetails) { personaElementDetails.addEventListener('click', (event) => { if (event.target.matches('.unlock-button')) GameLogic.handleUnlockLibraryLevel(event); }); }
         // Listener for Explore/Suggest/Synergy buttons
         personaScreenDiv.addEventListener('click', (event) => {
             if (event.target.matches('#exploreTapestryButton')) GameLogic.showTapestryDeepDive();
             else if (event.target.matches('#suggestSceneButton')) GameLogic.handleSuggestSceneClick();
             // ** UPDATED Synergy/Tension Button Listener **
             else if (event.target.matches('#exploreSynergyButton')) GameLogic.handleExploreSynergyClick();
         });
    }

    // --- Concept Detail Popup Actions (Delegation) ---
    if (conceptDetailPopupElem) {
        conceptDetailPopupElem.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return; // Ignore clicks not on buttons

            const conceptId = GameLogic.getCurrentPopupConceptId();
            if (conceptId === null) return; // Ignore if no concept popup is active

            if (button.id === 'addToGrimoireButton') { GameLogic.addConceptToGrimoireById(conceptId, button); }
            else if (button.id === 'markAsFocusButton') { GameLogic.handleToggleFocusConcept(); }
            else if (button.classList.contains('popup-sell-button')) { GameLogic.handleSellConcept(event); }
            else if (button.id === 'evolveArtButton') { GameLogic.attemptArtEvolution(); }
            else if (button.id === 'saveMyNoteButton') { GameLogic.handleSaveNote(); }
            // ** UPDATED: Lore Unlock Button Listener **
            else if (button.classList.contains('unlock-lore-button')) {
                const levelToUnlock = parseInt(button.dataset.loreLevel);
                const cost = parseFloat(button.dataset.cost);
                if (!isNaN(levelToUnlock) && !isNaN(cost)) {
                    GameLogic.handleUnlockLore(conceptId, levelToUnlock, cost);
                } else { console.error("Invalid lore level or cost data on button."); }
            }
        });
    }

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
     document.body.addEventListener('click', (event) => {
         const infoIcon = event.target.closest('.info-icon');
         if (infoIcon) {
             event.preventDefault();
             event.stopPropagation();
             const message = infoIcon.getAttribute('title');
             const infoPopupContentElem = document.getElementById('infoPopupContent');
             const infoPopup = document.getElementById('infoPopup');
             const overlay = document.getElementById('popupOverlay');
             // Use the dedicated info popup
             if (message && infoPopup && overlay && infoPopupContentElem) {
                 infoPopupContentElem.textContent = message;
                 infoPopup.classList.remove('hidden');
                 overlay.classList.remove('hidden');
             } else if (message) {
                 // Fallback to toast if popup elements aren't found
                 UI.showTemporaryMessage(message, 4000);
             }
         }
     });

    console.log("All event listeners attached.");
}

// --- Start the App ---
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initializeApp); }
else { initializeApp(); }

console.log("main.js loaded.");

// --- END OF FULL main.js ---
