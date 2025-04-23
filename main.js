// --- START OF FILE main.js ---
// js/main.js - Application Entry Point & Event Listener Setup (XP/Leveling v1.0)

 import * as UI from './js/ui.js';
 import * as State from './js/state.js';
 import * as GameLogic from './js/gameLogic.js';
 import * as Utils from './js/utils.js';
 import * as Config from './js/config.js';
 import {
   onboardingWelcomeIntro, onboardingWorkshopIntro, onboardingRepositoryIntro,
   elementKeyToFullName, elementDetails,
 } from './data.js';

console.log("main.js loading... (XP/Leveling v1.0)");

// --- Helper Function ---
const getElement = (id) => document.getElementById(id);

// --- Utility to pick the correct onboarding tour based on screen ---
function getTourForScreen(screenId){
    switch(screenId){
        case 'workshopScreen':   return onboardingWorkshopIntro;
        case 'repositoryScreen': return onboardingRepositoryIntro;
        case 'welcomeScreen':
        case 'questionnaireScreen':
        case 'personaScreen':
        default:                 return onboardingWelcomeIntro;
    }
}

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab (XP/Leveling v1.0)...");
    const loaded = State.loadGameState(); // Load state first
    UI.setupInitialUI(); // Sets initial screen visibility, theme etc. BEFORE showing content

    // Determine starting screen based on loaded state and onboarding status
    const currentState = State.getState();
    const onboardingPhase = currentState.onboardingPhase;
    const onboardingComplete = State.isOnboardingComplete();
    const questionnaireComplete = currentState.questionnaireCompleted;
    const currentQuestionnaireIndex = currentState.currentElementIndex;

    console.log(`Initial State: Onboarding Phase ${onboardingPhase}, Onboarding Complete: ${onboardingComplete}, Questionnaire Complete: ${questionnaireComplete}, Q Index: ${currentQuestionnaireIndex}`);

    let initialScreenId = 'welcomeScreen'; // Default

    // Check if onboarding is active
    const tours = [onboardingWelcomeIntro, onboardingWorkshopIntro, onboardingRepositoryIntro];
    const maxTotalPhases = tours.reduce((sum, tour) => sum + tour.length, 0); // Calculate total steps across tours
    if (Config.ONBOARDING_ENABLED && !onboardingComplete && onboardingPhase >= 1) {
         console.log(`Resuming onboarding at phase ${onboardingPhase}.`);
         let requiredScreen = 'welcomeScreen'; // Default assumption

         // Simple phase-to-screen mapping (adjust if phases aren't linear across tours)
         if (onboardingPhase <= onboardingWelcomeIntro.length) {
             requiredScreen = 'welcomeScreen'; // Or potentially questionnaire/persona based on internal logic
             if (questionnaireComplete) requiredScreen = 'personaScreen';
             else if (currentQuestionnaireIndex > -1) requiredScreen = 'questionnaireScreen';
         } else if (onboardingPhase <= (onboardingWelcomeIntro.length + onboardingWorkshopIntro.length)) {
             requiredScreen = questionnaireComplete ? 'workshopScreen' : 'welcomeScreen'; // Need Q done for workshop
         } else {
             requiredScreen = questionnaireComplete ? 'repositoryScreen' : 'welcomeScreen'; // Need Q done for repo
         }

        // More robust check based on highlight element's screen (if applicable)
        // This part is complex and might need adjustment based on exact task definitions
        // For now, relying on the simpler phase mapping above.

        initialScreenId = requiredScreen;
        UI.showScreen(initialScreenId); // Show context screen FIRST
        UI.showOnboarding(onboardingPhase, initialScreenId); // Pass screen ID

    } else if (loaded && questionnaireComplete) {
        initialScreenId = 'personaScreen';
        UI.showScreen(initialScreenId);
        UI.updateDrawerLinks();
        GameLogic.checkForDailyLogin();

    } else if (loaded && !questionnaireComplete && currentQuestionnaireIndex > -1) {
        initialScreenId = 'questionnaireScreen';
        UI.showScreen(initialScreenId);

    } else { // Fresh start
        initialScreenId = 'welcomeScreen';
        UI.showScreen(initialScreenId);
        if (Config.ONBOARDING_ENABLED && !onboardingComplete && onboardingPhase === 1) {
             UI.showOnboarding(1, initialScreenId); // Start Welcome Tour Phase 1
        }
    }

    // Setup General Event Listeners
    setupGlobalEventListeners();
    setupWelcomeScreenListeners();
    setupDrawerListeners();
    setupPopupInteractionListeners();
    setupQuestionnaireListeners();
    setupPersonaScreenListeners();
    setupWorkshopScreenListeners(); // Includes Grimoire listeners
    setupRepositoryListeners();
    setupOnboardingListeners();
    setupSanctumModalListeners(); // **NEW**: Listener for Sanctum modal buttons

    // Initial UI updates based on loaded/initial state
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter();
    UI.updateXPDisplay(); // **NEW**: Update XP bar on initial load

    console.log("Initialization complete. Initial screen:", initialScreenId);
}

// --- Helper to potentially advance onboarding after an action ---
// This function seems less relevant now as specific onboarding tasks are tied to button clicks within the tours.
// Keeping it for potential future use or complex tracking, but removing direct calls for now.
/*
function triggerActionAndCheckOnboarding(actionFn, actionName, targetPhase, actionValue = null, currentScreenId = null) {
    // ... (existing code, might need adjustments based on new tour structure) ...
}
*/

// --- Event Listener Setup Functions ---

function setupGlobalEventListeners() {
    const closeSettingsBtn = getElement('closeSettingsPopupButton');
    const forceSaveBtn = getElement('forceSaveButton');
    const resetBtn = getElement('resetAppButton');

    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (forceSaveBtn) forceSaveBtn.addEventListener('click', () => { State.saveGameState(true); UI.showTemporaryMessage("Game Saved!", 1500); });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (confirm("Are you SURE you want to reset all progress? This cannot be undone!")) {
            GameLogic.clearPopupState();
            State.clearGameState();
            window.location.reload(); // Reload after clearing
        }
    });

    const closeMilestoneBtn = getElement('closeMilestoneAlertButton');
    if (closeMilestoneBtn) closeMilestoneBtn.addEventListener('click', UI.hideMilestoneAlert);

    const overlay = getElement('popupOverlay');
    if (overlay) {
        overlay.addEventListener('click', (event) => {
            const onboardingOverlay = getElement('onboardingOverlay');
            const onboardingPopup = getElement('onboardingPopup');
            const sideDrawerElement = getElement('sideDrawer');
            const sanctumModal = getElement('sanctumModal'); // **NEW**

            const isClickInsideOnboardingPopup = onboardingPopup?.contains(event.target);
            const isClickInsideDrawer = sideDrawerElement?.contains(event.target);
            const isClickInsideSanctum = sanctumModal?.contains(event.target); // **NEW**

            if (onboardingOverlay?.classList.contains('visible') && !isClickInsideOnboardingPopup) return;
            else if (sideDrawerElement?.classList.contains('open') && !isClickInsideDrawer) UI.toggleDrawer();
            else if (sanctumModal && !sanctumModal.classList.contains('hidden') && !isClickInsideSanctum) UI.hideSanctumModal(); // **NEW**
            else if (!onboardingOverlay?.classList.contains('visible') && !sideDrawerElement?.classList.contains('open') && (!sanctumModal || sanctumModal.classList.contains('hidden'))) {
                 UI.hidePopups(); // Only hide general popups if others aren't active
            }
        });
    }

     const closeInfoBtn = getElement('closeInfoPopupButton');
     const confirmInfoBtn = getElement('confirmInfoPopupButton');
     if (closeInfoBtn) closeInfoBtn.addEventListener('click', UI.hidePopups);
     if (confirmInfoBtn) confirmInfoBtn.addEventListener('click', UI.hidePopups);

    const addInsightBtn = getElement('addInsightButton');
    if(addInsightBtn) addInsightBtn.addEventListener('click', GameLogic.handleInsightBoostClick);

    document.body.addEventListener('click', (event) => {
        const target = event.target.closest('.info-icon');
        if (target?.title) { event.preventDefault(); event.stopPropagation(); UI.showInfoPopup(target.title); }
    });
}

function setupDrawerListeners() {
    const drawerToggle = getElement('drawerToggle');
    const sideDrawer = getElement('sideDrawer');
    const drawerSettingsButton = getElement('drawerSettings');
    const drawerThemeToggle = getElement('drawerThemeToggle');
    const helpBtn = getElement('helpBtn'); // Help button next to drawer

    if (drawerToggle) drawerToggle.addEventListener('click', UI.toggleDrawer);
    if (sideDrawer) sideDrawer.addEventListener('click', handleDrawerNavClick);
    if (drawerSettingsButton) drawerSettingsButton.addEventListener('click', () => { UI.showSettings(); UI.toggleDrawer(); });
    if (drawerThemeToggle) drawerThemeToggle.addEventListener('click', UI.toggleTheme);
    if (helpBtn) helpBtn.addEventListener('click', () => {
        const currentScreenId = document.querySelector('.screen.current')?.id || 'welcomeScreen';
        State.setOnboardingPhase(1); // Restart relevant tour
        UI.showOnboarding(1, currentScreenId);
    });
}

function handleDrawerNavClick(event) {
    const button = event.target.closest('.drawer-link[data-target]');
    if (!button) return;
    const targetScreenId = button.dataset.target;
    if (!targetScreenId) return;
    const isPostQuestionnaire = State.getState().questionnaireCompleted;
    const canNavigate = ['welcomeScreen', 'personaScreen'].includes(targetScreenId) || isPostQuestionnaire;

    if (canNavigate) {
         // Removed automatic onboarding restart on navigation
         UI.showScreen(targetScreenId); // Show the screen
         UI.toggleDrawer(); // Close drawer
    } else {
        UI.showTemporaryMessage("Complete the initial Experimentation first!", 2500);
        UI.toggleDrawer();
    }
}

function setupWelcomeScreenListeners() {
    const startBtn = getElement('startGuidedButton');
    const loadBtn = getElement('loadButton');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const currentState = State.getState();
            const onboardingComplete = State.isOnboardingComplete();
            const questionnaireComplete = currentState.questionnaireCompleted;
            if (!questionnaireComplete) {
                if (Config.ONBOARDING_ENABLED && !onboardingComplete) {
                    State.setOnboardingPhase(1); // Start Welcome Tour
                    UI.showOnboarding(1, 'welcomeScreen'); // Explicitly show phase 1
                } else {
                    UI.initializeQuestionnaireUI();
                    UI.showScreen('questionnaireScreen');
                }
            } else {
                 UI.showScreen('personaScreen');
                 UI.showTemporaryMessage("Experimentation already complete.", 2500);
            }
        });
    }
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            if (State.loadGameState()) {
                initializeApp(); // Re-initialize completely
                UI.showTemporaryMessage("Session Loaded.", 2000);
            } else {
                 UI.showTemporaryMessage("Failed to load session.", 3000);
                 UI.showScreen('welcomeScreen');
            }
        });
    }
}

function setupQuestionnaireListeners() {
    const nextBtn = getElement('nextElementButton');
    const prevBtn = getElement('prevElementButton');

    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);
    if (nextBtn) {
         nextBtn.addEventListener('click', () => {
             GameLogic.goToNextElement(); // Logic handles state update/finalization
             // Check state *after* logic function
             const state = State.getState();
             if (state.questionnaireCompleted && getElement('questionnaireScreen')?.classList.contains('current')) {
                 // If logic completed Q and we are still on Q screen, transition
                 console.log("Questionnaire complete triggered, transitioning to Persona screen.");
                 const targetScreenId = 'personaScreen';
                 UI.showScreen(targetScreenId);
                 // Onboarding phase 1 for Workshop starts *after* first research action
             }
         });
     }
    // Input listeners added dynamically by UI.displayElementQuestions
}

function setupPersonaScreenListeners() {
    const detailedViewBtn = getElement('showDetailedViewBtn');
    const summaryViewBtn = getElement('showSummaryViewBtn');
    if (detailedViewBtn && summaryViewBtn) {
        detailedViewBtn.addEventListener('click', () => UI.togglePersonaView(true));
        summaryViewBtn.addEventListener('click', () => UI.togglePersonaView(false));
    }

    const personaElementsContainer = getElement('personaElementDetails');
    if (personaElementsContainer) {
        personaElementsContainer.addEventListener('click', (event) => {
            const unlockButton = event.target.closest('.unlock-button');
            const headerButton = event.target.closest('.accordion-header');
            if (unlockButton) {
                 event.stopPropagation();
                 GameLogic.handleUnlockLibraryLevel(event); // Handles Insight cost, state update, XP grant
            } else if (headerButton) {
                 // Accordion toggle logic handled in UI.displayPersonaScreen
            }
        });
    }

    const focusedConceptsContainer = getElement('focusedConceptsDisplay');
    if (focusedConceptsContainer) {
        focusedConceptsContainer.addEventListener('click', (event) => {
            const targetItem = event.target.closest('.focus-concept-item[data-concept-id]');
            if (targetItem) { const conceptId = parseInt(targetItem.dataset.conceptId); if (!isNaN(conceptId)) UI.showConceptDetailPopup(conceptId); }
        });
    }

     const insightLogContainer = getElement('insightLogContainer');
     if (insightLogContainer) {
         const resourceHeader = personaElementsContainer?.parentNode?.querySelector('h2[title*="Insight"]');
         if (resourceHeader) {
             resourceHeader.style.cursor = 'pointer';
             resourceHeader.addEventListener('click', () => {
                 const isHidden = insightLogContainer.classList.toggle('log-hidden');
                 insightLogContainer.style.display = isHidden ? 'none' : 'block';
             });
             insightLogContainer.style.display = insightLogContainer.classList.contains('log-hidden') ? 'none' : 'block';
         }
     }

    const dilemmaBtn = getElement('elementalDilemmaButton');
    const synergyBtn = getElement('exploreSynergyButton');
    const suggestSceneBtn = getElement('suggestSceneButton');
    const deepDiveBtn = getElement('deepDiveTriggerButton');
    const openSanctumBtn = getElement('openSanctumBtn'); // **NEW**

    if (dilemmaBtn) dilemmaBtn.addEventListener('click', GameLogic.handleElementalDilemmaClick);
    if (synergyBtn) synergyBtn.addEventListener('click', GameLogic.handleExploreSynergyClick);
    if (suggestSceneBtn) suggestSceneBtn.addEventListener('click', GameLogic.handleSuggestSceneClick);
    if (deepDiveBtn) deepDiveBtn.addEventListener('click', GameLogic.showTapestryDeepDive);
    if (openSanctumBtn) openSanctumBtn.addEventListener('click', UI.showSanctumModal); // **NEW**

    const suggestedSceneContainer = getElement('suggestedSceneContent');
    if (suggestedSceneContainer) {
         suggestedSceneContainer.addEventListener('click', (event) => {
            const meditateButton = event.target.closest('.button[data-scene-id]');
             if (meditateButton && !meditateButton.disabled) GameLogic.handleMeditateScene(event);
         });
     }
}

function setupWorkshopScreenListeners() {
    const workshopScreen = getElement('workshopScreen');
    if (!workshopScreen) return;

    const researchBench = getElement('workshop-research-area');
    if (researchBench) {
        researchBench.addEventListener('click', (event) => {
            const buttonCard = event.target.closest('.initial-discovery-element.clickable:not(.disabled)'); // Ensure clickable and not disabled
            if (buttonCard?.dataset.elementKey) {
                const isFreeClick = buttonCard.dataset.isFree === 'true';
                GameLogic.handleResearchClick({ currentTarget: buttonCard, isFree: isFreeClick });
                // Onboarding check now happens via the UI call in data.js for the tour step
            }
        });
    }

    const freeResearchBtn = getElement('freeResearchButtonWorkshop');
    const seekGuidanceBtn = getElement('seekGuidanceButtonWorkshop');
    if (freeResearchBtn) freeResearchBtn.addEventListener('click', GameLogic.handleFreeResearchClick);
    if (seekGuidanceBtn) seekGuidanceBtn.addEventListener('click', GameLogic.triggerGuidedReflection);

    const libraryArea = getElement('workshop-library-area');
    const controls = getElement('grimoire-controls-workshop');
    const shelves = getElement('grimoire-shelves-workshop');
    const grid = getElement('grimoire-grid-workshop');
    if (!libraryArea || !controls || !shelves || !grid) return;

    const searchInput = getElement('grimoireSearchInputWorkshop');
    if (searchInput) { const debouncedRefresh = Utils.debounce(() => UI.refreshGrimoireDisplay(), 350); searchInput.addEventListener('input', debouncedRefresh); }
    controls.addEventListener('change', (event) => { if (event.target.tagName === 'SELECT') UI.refreshGrimoireDisplay(); });
    shelves.addEventListener('click', (event) => { const shelf = event.target.closest('.grimoire-shelf'); if (shelf?.dataset.categoryId) { shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('active-shelf')); shelf.classList.add('active-shelf'); UI.refreshGrimoireDisplay({ filterCategory: shelf.dataset.categoryId }); } });

    grid.addEventListener('click', (event) => {
        const focusButton = event.target.closest('.card-focus-button');
        const sellButton = event.target.closest('.card-sell-button');
        const card = event.target.closest('.concept-card');
        const unlockButton = event.target.closest('.card-unlock-button'); // **NEW**
        const crossoverCompleteButton = event.target.closest('.crossover-complete-btn'); // **NEW**
        const unlockedItemButton = event.target.closest('.unlocked-item-btn'); // **NEW**

        if (focusButton?.dataset.conceptId && !focusButton.disabled) {
            event.stopPropagation(); GameLogic.handleCardFocusToggle(parseInt(focusButton.dataset.conceptId));
        } else if (sellButton?.dataset.conceptId) {
            event.stopPropagation(); GameLogic.handleSellConcept(event);
        } else if (unlockButton?.dataset.conceptId && !unlockButton.disabled) { // **NEW** Unlock button listener
            event.stopPropagation();
            const conceptId = parseInt(unlockButton.dataset.conceptId);
            const unlockKey = unlockButton.dataset.unlockKey;
            if (!isNaN(conceptId) && unlockKey) {
                GameLogic.handlePurchaseCardUnlock(conceptId, unlockKey);
            }
        } else if (crossoverCompleteButton?.dataset.conceptId) { // **NEW** Crossover complete listener
             event.stopPropagation();
             const conceptId = parseInt(crossoverCompleteButton.dataset.conceptId);
             if (!isNaN(conceptId)) {
                 if (confirm("Mark this Crossover Challenge as completed? This action is final.")) {
                    GameLogic.handleCompleteCrossoverToken(conceptId);
                 }
             }
        } else if (unlockedItemButton?.dataset.conceptId) { // **NEW** Listener for viewing unlocked content
             event.stopPropagation();
             const conceptId = parseInt(unlockedItemButton.dataset.conceptId);
             const action = unlockedItemButton.dataset.action;
             if (!isNaN(conceptId) && action) {
                 if (action === 'readMicroStory') UI.showConceptMicroStory(conceptId);
                 else if (action === 'viewSceneSeed') UI.showConceptSceneSeed(conceptId);
                 else if (action === 'viewDeepLore') UI.showConceptDeepLore(conceptId);
                 else if (action === 'viewSecretScene') UI.showConceptSecretScene(conceptId);
                 // Add more actions as needed (e.g., view alt art, choose perk)
             }
        } else if (card?.dataset.conceptId && !event.target.closest('button')) { // Click card itself
             UI.showConceptDetailPopup(parseInt(card.dataset.conceptId));
        }
    });

    // Drag & Drop Logic (Keep as is)
    let draggedCardId = null;
    grid.addEventListener('dragstart', (event) => { const card = event.target.closest('.concept-card[draggable="true"]'); if (card?.dataset.conceptId) { draggedCardId = parseInt(card.dataset.conceptId); event.dataTransfer.effectAllowed = 'move'; try { event.dataTransfer.setData('text/plain', draggedCardId.toString()); } catch (e) { try { event.dataTransfer.setData('Text', draggedCardId.toString()); } catch (e2) { console.error("Drag/Drop setData failed:", e2); } } setTimeout(() => card.classList.add('dragging'), 0); } else event.preventDefault(); });
    grid.addEventListener('dragend', (event) => { const card = event.target.closest('.concept-card'); if (card) card.classList.remove('dragging'); draggedCardId = null; shelves?.querySelectorAll('.grimoire-shelf').forEach(shelf => shelf.classList.remove('drag-over')); });
    shelves.addEventListener('dragover', (event) => { event.preventDefault(); const shelf = event.target.closest('.grimoire-shelf:not(.show-all-shelf)'); if (shelf) { event.dataTransfer.dropEffect = 'move'; shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over')); shelf.classList.add('drag-over'); } else { event.dataTransfer.dropEffect = 'none'; shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over')); } });
    shelves.addEventListener('dragleave', (event) => { const shelf = event.target.closest('.grimoire-shelf'); if (shelf && !shelf.contains(event.relatedTarget)) shelf.classList.remove('drag-over'); else if (event.currentTarget === shelves && !shelves.contains(event.relatedTarget)) shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over')); });
    shelves.addEventListener('drop', (event) => { event.preventDefault(); shelves.querySelectorAll('.grimoire-shelf').forEach(shelf => shelf.classList.remove('drag-over')); const shelf = event.target.closest('.grimoire-shelf:not(.show-all-shelf)'); let droppedCardIdFromData = null; try { droppedCardIdFromData = parseInt(event.dataTransfer.getData('text/plain')); } catch (e) { try { droppedCardIdFromData = parseInt(event.dataTransfer.getData('Text')); } catch (e2) { /* ignore */ } } const finalCardId = !isNaN(droppedCardIdFromData) ? droppedCardIdFromData : draggedCardId; if (shelf?.dataset.categoryId && finalCardId !== null) { const categoryId = shelf.dataset.categoryId; GameLogic.handleCategorizeCard(finalCardId, categoryId); } draggedCardId = null; });
}

function setupRepositoryListeners() {
    const repoContainer = getElement('repositoryScreen');
    if (!repoContainer) return;
    repoContainer.addEventListener('click', (event) => {
        const meditateButton = event.target.closest('.button[data-scene-id]');
        const experimentButton = event.target.closest('.button[data-experiment-id]');
        if (meditateButton && !meditateButton.disabled) GameLogic.handleMeditateScene(event);
        else if (experimentButton && !experimentButton.disabled) GameLogic.handleAttemptExperiment(event);
    });
}

function setupPopupInteractionListeners() { document.querySelectorAll('.popup:not(.onboarding-popup) .close-button').forEach(button => { button.addEventListener('click', UI.hidePopups); }); setupConceptDetailPopupListeners(); setupResearchPopupListeners(); setupReflectionPopupListeners(); setupDeepDivePopupListeners(); setupDilemmaPopupListeners(); }

function setupConceptDetailPopupListeners() {
    const popup = getElement('conceptDetailPopup'); if (!popup) return;
    const addBtn = getElement('addToGrimoireButton');
    const focusBtn = getElement('markAsFocusButton');
    const saveNoteBtn = getElement('saveMyNoteButton');
    const loreContent = getElement('popupLoreContent'); // Legacy lore
    const unlocksContent = getElement('popupCardUnlocksContent'); // **NEW** Unlocks area
    const actionsContainer = popup.querySelector('.popup-actions');

    if (addBtn) addBtn.addEventListener('click', () => { const conceptId = GameLogic.getCurrentPopupConceptId(); if (conceptId !== null) GameLogic.addConceptToGrimoireById(conceptId, addBtn); });
    if (focusBtn) focusBtn.addEventListener('click', GameLogic.handleToggleFocusConcept);
    if (saveNoteBtn) saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);

    // Legacy Lore unlock listener (can be removed if legacy system removed)
    if (loreContent) loreContent.addEventListener('click', (event) => { const button = event.target.closest('.unlock-lore-button'); if (button?.dataset.conceptId && button.dataset.loreLevel && button.dataset.cost && !button.disabled) GameLogic.handleUnlockLore(parseInt(button.dataset.conceptId), parseInt(button.dataset.loreLevel), parseFloat(button.dataset.cost)); });
    // **NEW**: Listener for new Unlock buttons within popup
    if (unlocksContent) {
        unlocksContent.addEventListener('click', (event) => {
            const unlockButton = event.target.closest('.card-unlock-button');
            const crossoverCompleteButton = event.target.closest('.crossover-complete-btn');
            const unlockedItemButton = event.target.closest('.unlocked-item-btn');

            if (unlockButton?.dataset.conceptId && !unlockButton.disabled) {
                 const conceptId = parseInt(unlockButton.dataset.conceptId);
                 const unlockKey = unlockButton.dataset.unlockKey;
                 if (!isNaN(conceptId) && unlockKey) {
                     GameLogic.handlePurchaseCardUnlock(conceptId, unlockKey);
                 }
            } else if (crossoverCompleteButton?.dataset.conceptId) {
                const conceptId = parseInt(crossoverCompleteButton.dataset.conceptId);
                if (!isNaN(conceptId)) {
                     if (confirm("Mark this Crossover Challenge as completed? This action is final.")) {
                        GameLogic.handleCompleteCrossoverToken(conceptId);
                    }
                }
            } else if (unlockedItemButton?.dataset.conceptId) {
                const conceptId = parseInt(unlockedItemButton.dataset.conceptId);
                const action = unlockedItemButton.dataset.action;
                if (!isNaN(conceptId) && action) {
                     if (action === 'readMicroStory') UI.showConceptMicroStory(conceptId);
                     else if (action === 'viewSceneSeed') UI.showConceptSceneSeed(conceptId);
                     else if (action === 'viewDeepLore') UI.showConceptDeepLore(conceptId);
                     else if (action === 'viewSecretScene') UI.showConceptSecretScene(conceptId);
                     // Add more actions as needed
                }
            }
        });
    }

    if (actionsContainer) actionsContainer.addEventListener('click', (event) => { const sellButton = event.target.closest('.popup-sell-button'); if (sellButton?.dataset.conceptId) GameLogic.handleSellConcept(event); });
}

function setupResearchPopupListeners() { const popup = getElement('researchResultsPopup'); if (!popup) return; const closeBtn = getElement('closeResearchResultsPopupButton'); const confirmBtn = getElement('confirmResearchChoicesButton'); const contentArea = getElement('researchPopupContent'); if (closeBtn) closeBtn.addEventListener('click', UI.hidePopups); if (confirmBtn) confirmBtn.addEventListener('click', UI.hidePopups); if (contentArea) { contentArea.addEventListener('click', (event) => { const actionButton = event.target.closest('.card-actions .button[data-action]'); if (actionButton?.dataset.conceptId) { const conceptId = parseInt(actionButton.dataset.conceptId); const action = actionButton.dataset.action; GameLogic.handleResearchPopupChoice(conceptId, action); } }); } }
function setupReflectionPopupListeners() { const popup = getElement('reflectionModal'); if (!popup) return; const reflectionCheck = getElement('reflectionCheckbox'); const confirmBtn = getElement('confirmReflectionButton'); const nudgeCheck = getElement('scoreNudgeCheckbox'); if (reflectionCheck && confirmBtn) { reflectionCheck.addEventListener('change', () => { confirmBtn.disabled = !reflectionCheck.checked; }); confirmBtn.addEventListener('click', () => GameLogic.handleConfirmReflection(nudgeCheck?.checked || false)); } }
function setupDeepDivePopupListeners() { const popup = getElement('tapestryDeepDiveModal'); if (!popup) return; const nodesContainer = getElement('deepDiveAnalysisNodes'); const detailContent = getElement('deepDiveDetailContent'); if (nodesContainer) nodesContainer.addEventListener('click', (event) => { const nodeButton = event.target.closest('.aspect-node[data-node-id]'); if (nodeButton && !nodeButton.disabled) { const nodeId = nodeButton.dataset.nodeId; if (nodeId === 'contemplation') GameLogic.handleContemplationNodeClick(); else GameLogic.handleDeepDiveNodeClick(nodeId); } }); if (detailContent) detailContent.addEventListener('click', (event) => { const completeButton = event.target.closest('#completeContemplationBtn'); if (completeButton) GameLogic.handleCompleteContemplation(); }); }
function setupDilemmaPopupListeners() { const popup = getElement('dilemmaModal'); if (!popup) return; const confirmBtn = getElement('confirmDilemmaButton'); if (confirmBtn) confirmBtn.addEventListener('click', GameLogic.handleConfirmDilemma); const slider = getElement('dilemmaSlider'); const valueDisplay = getElement('dilemmaSliderValueDisplay'); const minLabel = getElement('dilemmaSliderMinLabel'); const maxLabel = getElement('dilemmaSliderMaxLabel'); if (slider && valueDisplay && minLabel && maxLabel) slider.addEventListener('input', () => { const val = parseFloat(slider.value); let leaning; if (val < 1.5) leaning = `Strongly ${minLabel.textContent}`; else if (val < 4.5) leaning = `Towards ${minLabel.textContent}`; else if (val > 8.5) leaning = `Strongly ${maxLabel.textContent}`; else if (val > 5.5) leaning = `Towards ${maxLabel.textContent}`; else leaning = "Balanced"; valueDisplay.textContent = leaning; }); }

// **NEW**: Listeners for Element Sanctum Modal
function setupSanctumModalListeners() {
    const closeBtn = getElement('closeSanctumBtn');
    const grid = getElement('sanctumGrid');

    if (closeBtn) closeBtn.addEventListener('click', UI.hideSanctumModal);
    // Click events on individual upgrade items are handled directly in UI.showSanctumModal
}


function setupOnboardingListeners() {
    const overlay = getElement('onboardingOverlay'); if (!overlay) return;
    const nextBtn = getElement('onboardingNextButton');
    const prevBtn = getElement('onboardingPrevButton');
    const skipBtn = getElement('onboardingSkipButton'); // Skip ALL
    const skipTourBtn = getElement('skipTourBtn'); // Skip Current Tour

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            const currentScreenId = document.querySelector('.screen.current')?.id || 'welcomeScreen';
            const tasks = getTourForScreen(currentScreenId);
            const maxPhaseForThisTour = tasks.length;
            // Convert currentPhase to be relative to the start of the current tour
            let currentTourPhase = currentPhase;
            if (currentScreenId === 'workshopScreen') currentTourPhase -= onboardingWelcomeIntro.length;
            else if (currentScreenId === 'repositoryScreen') currentTourPhase -= (onboardingWelcomeIntro.length + onboardingWorkshopIntro.length);

            if (currentTourPhase >= maxPhaseForThisTour) {
                // Last step of the current tour
                UI.hideOnboarding();
                 if (currentScreenId === 'welcomeScreen' ) UI.showTemporaryMessage("Orientation Part 1 Complete!", 4000);
                 else if (currentScreenId === 'workshopScreen') UI.showTemporaryMessage("Workshop Tour Complete!", 4000);
                 else if (currentScreenId === 'repositoryScreen') {
                      UI.showTemporaryMessage("Orientation Complete! You're all set.", 4000);
                      State.markOnboardingComplete(); // Mark fully done after last tour step
                 }
            } else {
                 const nextPhase = State.advanceOnboardingPhase();
                 UI.showOnboarding(nextPhase, currentScreenId); // Show next step
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            const currentScreenId = document.querySelector('.screen.current')?.id || 'welcomeScreen';
             // Determine previous tour/screen if needed - this logic might need refinement
             let prevPhase = currentPhase - 1;
             if (prevPhase > 0) { // Simple previous step
                State.updateOnboardingPhase(prevPhase);
                UI.showOnboarding(prevPhase, currentScreenId);
             } else {
                // Potentially handle going back to the previous tour? More complex.
                console.log("Cannot go back further.");
             }
        });
    }

    if (skipBtn) { // Skip ALL
        skipBtn.addEventListener('click', () => {
            if (confirm("Skip the entire orientation? Restart individual tours with (?) help button.")) {
                 State.setOnboardingPhase(99); // Mark as skipped
                 UI.hideOnboarding();
                 UI.showScreen(State.getState().questionnaireCompleted ? 'personaScreen' : 'welcomeScreen');
            }
        });
    }

    if (skipTourBtn) { // Skip CURRENT tour
         skipTourBtn.addEventListener('click', () => {
             UI.hideOnboarding();
             // Mark state as if this tour is done. This is tricky with split tours.
             // Simplest approach: just mark all onboarding as skipped/done.
             State.setOnboardingPhase(99);
         });
     }
}

// --- App Start ---
document.addEventListener('DOMContentLoaded', initializeApp);

console.log("main.js loaded successfully. (XP/Leveling v1.0)");
// --- END OF FILE main.js ---
