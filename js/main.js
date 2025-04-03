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

    // Setup initial UI based on whether state was loaded and questionnaire status
    if (loaded) {
        console.log("Existing session loaded.");
        if (State.getQuestionnaireCompletedStatus()) {
             console.log("Continuing session...");
             GameLogic.checkForDailyLogin(); // Handle daily reset logic
             GameLogic.calculateTapestryNarrative(true); // Ensure analysis is current
             // UI Setup for continuing users
             UI.setupInitialUI(); // Applies phase UI, sets button states
             UI.updateInsightDisplays();
             UI.updateFocusSlotsDisplay();
             UI.updateGrimoireCounter();
             UI.populateGrimoireFilters();
             UI.refreshGrimoireDisplay(); // Refresh Grimoire if needed
             UI.showScreen('personaScreen'); // Default to Persona screen
             UI.hidePopups();
        } else {
             console.log("Loaded state incomplete. Restarting questionnaire.");
             State.updateElementIndex(0); // Ensure it starts at 0 if loading incomplete state
             UI.initializeQuestionnaireUI(); // Setup questionnaire UI
             UI.showScreen('questionnaireScreen');
        }
        const loadBtn = document.getElementById('loadButton');
        if(loadBtn) loadBtn.classList.add('hidden'); // Hide load button after trying to load

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
        State.clearGameState(); // Clears state and initializes correctly
        UI.initializeQuestionnaireUI();
        UI.showScreen('questionnaireScreen');
        if(loadButton) loadButton.classList.add('hidden');
    });
    // Load button click handled by initializeApp checking localStorage

    // Questionnaire Navigation
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // Main Navigation (Event delegation recommended for future)
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        if(!button.classList.contains('settings-button')) { // Exclude settings button
            button.addEventListener('click', () => {
                const target = button.dataset.target;
                if (target) { UI.showScreen(target); } // showScreen handles phase checks and logic calls
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

    // Concept Detail Popup Actions (Event Delegation)
    const popupActionsDiv = document.querySelector('#conceptDetailPopup .popup-actions');
    if (popupActionsDiv) {
         popupActionsDiv.addEventListener('click', (event) => {
               const button = event.target.closest('button'); if (!button) return;
               const conceptId = GameLogic.getCurrentPopupConceptId(); // Get ID from temp state
               if (conceptId === null) return; // Do nothing if no concept selected

               if (button.id === 'addToGrimoireButton') GameLogic.addConceptToGrimoireById(conceptId, button);
               else if (button.id === 'markAsFocusButton') GameLogic.handleToggleFocusConcept(); // Assumes conceptId is implicitly handled
               else if (button.classList.contains('popup-sell-button')) GameLogic.handleSellConcept(event); // Let sell handler get ID from button dataset
         });
    }

    // Evolve Button
    const evolveBtn = document.getElementById('evolveArtButton');
    if (evolveBtn) evolveBtn.addEventListener('click', GameLogic.attemptArtEvolution);

    // Save Note Button
    const saveNoteBtn = document.getElementById('saveMyNoteButton');
    if (saveNoteBtn) saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);

    // Grimoire Filters & Card Interaction
    const grimoireControls = document.getElementById('grimoireControls');
    if (grimoireControls) {
        grimoireControls.querySelectorAll('select').forEach(select => {
             select.addEventListener('change', UI.refreshGrimoireDisplay);
        });
        const searchInput = document.getElementById('grimoireSearchInput');
        if (searchInput) {
             searchInput.addEventListener('input', UI.refreshGrimoireDisplay);
        }
    }
    const grimoireContent = document.getElementById('grimoireContent');
    if (grimoireContent) {
        // Use event delegation for sell buttons within grimoire cards
        grimoireContent.addEventListener('click', (event) => {
            const sellButton = event.target.closest('.card-sell-button');
            if (sellButton) {
                event.stopPropagation(); // Prevent card click from firing
                GameLogic.handleSellConcept(event); // Pass the event to the handler
            }
        });
    }

    // Reflection Modal
    const reflectionCheck = document.getElementById('reflectionCheckbox');
    const confirmReflectionBtn = document.getElementById('confirmReflectionButton');
    if (reflectionCheck) reflectionCheck.addEventListener('change', () => { if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked; });
    if (confirmReflectionBtn) confirmReflectionBtn.addEventListener('click', () => { const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox'); GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false); });

    // Study Actions (Delegation for research buttons)
    const researchContainer = document.getElementById('researchButtonContainer');
    const freeResearchBtn = document.getElementById('freeResearchButton');
    const guidanceBtn = document.getElementById('seekGuidanceButton');
    if (researchContainer) { researchContainer.addEventListener('click', (event) => { const button = event.target.closest('.research-button'); if (button) GameLogic.handleResearchClick({ currentTarget: button }); }); }
    if (freeResearchBtn) freeResearchBtn.addEventListener('click', GameLogic.handleFreeResearchClick);
    if (guidanceBtn) guidanceBtn.addEventListener('click', GameLogic.triggerGuidedReflection);

    // Research Output Actions (Delegation for Add/Sell)
    const researchOutputArea = document.getElementById('researchOutput');
    if (researchOutputArea) {
        researchOutputArea.addEventListener('click', (event) => {
            const button = event.target.closest('button.research-action-button, button.sell-button'); // Target specific buttons
            if (!button) return;
            const conceptIdStr = button.dataset.conceptId; if (!conceptIdStr) return;
            const conceptId = parseInt(conceptIdStr); if (isNaN(conceptId)) return;

            if (button.classList.contains('add-button')) {
                 GameLogic.addConceptToGrimoireById(conceptId, button);
            } else if (button.classList.contains('sell-button')) {
                 GameLogic.handleSellConcept(event); // Let handler get details from event/button dataset
            }
        });
    }


    // Integrated Deep Dive Unlock Buttons (Delegation)
    const personaDetailsContainer = document.getElementById('personaElementDetails');
    if (personaDetailsContainer) {
         personaDetailsContainer.addEventListener('click', (event) => {
             const button = event.target.closest('.unlock-button');
             // Ensure it's the library unlock button
             if (button && button.closest('.element-deep-dive-container')) {
                 GameLogic.handleUnlockLibraryLevel(event); // Pass event for handler
             }
         });
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
