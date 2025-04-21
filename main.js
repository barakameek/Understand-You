// --- START OF FILE main.js ---

// js/main.js - Application Entry Point & Event Listener Setup (Enhanced v4.1 + Drawer - Fixed v2)

import * as UI from './js/ui.js';
import * as State from './js/state.js';
import * as GameLogic from './js/gameLogic.js';
import * as Utils from './js/utils.js';
import * as Config from './js/config.js';
import { elementNames, concepts } from './data.js';
//import { onboardingTasks, elementKeyToFullName } from './data.js'; // Import onboarding tasks & element map

console.log("main.js loading... (Enhanced v4.1 + Drawer - Fixed v2)");

// --- Helper Function ---
const getElement = (id) => document.getElementById(id);

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab (v4.1 - Fixed v2)...");
    const loaded = State.loadGameState(); // Load state first
    UI.setupInitialUI(); // Sets initial screen visibility, theme etc. BEFORE showing content

    // Determine starting screen based on loaded state and onboarding status
    const currentState = State.getState();
    const onboardingPhase = currentState.onboardingPhase;
    const onboardingComplete = currentState.onboardingComplete;
    const questionnaireComplete = currentState.questionnaireCompleted;
    const currentQuestionnaireIndex = currentState.currentElementIndex;

    console.log(`Initial State: Onboarding Phase ${onboardingPhase}, Onboarding Complete: ${onboardingComplete}, Questionnaire Complete: ${questionnaireComplete}, Q Index: ${currentQuestionnaireIndex}`);

    let initialScreenId = 'welcomeScreen'; // Default

    if (Config.ONBOARDING_ENABLED && !onboardingComplete && onboardingPhase >= 1 && onboardingPhase <= Config.MAX_ONBOARDING_PHASE) {
        // Resume onboarding
        console.log(`Resuming onboarding at phase ${onboardingPhase}.`);
        const currentTask = onboardingTasks.find(t => t.phaseRequired === onboardingPhase);
        let requiredScreen = 'welcomeScreen'; // Default for onboarding phase

        if (currentTask?.highlightElementId) {
            const targetElement = getElement(currentTask.highlightElementId);
            const screenElement = targetElement?.closest('.screen');
            if (screenElement?.id) {
                requiredScreen = screenElement.id;
                // Accessibility check
                if (!questionnaireComplete && ['personaScreen', 'workshopScreen', 'repositoryScreen'].includes(requiredScreen)) {
                    requiredScreen = (currentQuestionnaireIndex > -1) ? 'questionnaireScreen' : 'welcomeScreen';
                    console.warn(`Onboarding task ${currentTask.id} requires screen ${screenElement.id}, but questionnaire not complete. Forcing ${requiredScreen}.`);
                } else if (questionnaireComplete && requiredScreen === 'questionnaireScreen') {
                    requiredScreen = 'personaScreen';
                    console.warn(`Onboarding task ${currentTask.id} requires questionnaireScreen, but questionnaire complete. Forcing personaScreen.`);
                }
            }
        } else { // Determine screen based on phase if no specific highlight target
             if (onboardingPhase >= 8) requiredScreen = questionnaireComplete ? 'repositoryScreen' : 'welcomeScreen';
             else if (onboardingPhase >= 6) requiredScreen = questionnaireComplete ? 'personaScreen' : 'welcomeScreen';
             else if (onboardingPhase >= 2) requiredScreen = questionnaireComplete ? 'workshopScreen' : 'welcomeScreen';
             else requiredScreen = 'welcomeScreen';
        }

        initialScreenId = requiredScreen;
        UI.showScreen(initialScreenId); // Show context screen FIRST
        UI.showOnboarding(onboardingPhase); // Then show onboarding overlay

    } else if (loaded && questionnaireComplete) {
        // Standard load: Questionnaire done, show Persona screen
        initialScreenId = 'personaScreen';
        console.log("Loaded completed state. Showing Persona screen.");
        UI.showScreen(initialScreenId);
        // Explicitly update drawer links after showing screen based on loaded state
        UI.updateDrawerLinks(); // Ensure links are correct after loading completed state
        if (typeof GameLogic !== 'undefined' && GameLogic.checkForDailyLogin) {
             GameLogic.checkForDailyLogin();
        } else { console.error("GameLogic or checkForDailyLogin not available yet!"); }

    } else if (loaded && !questionnaireComplete && currentQuestionnaireIndex > -1) {
        // Loaded incomplete questionnaire state
        initialScreenId = 'questionnaireScreen';
        console.log("Loaded incomplete questionnaire state. Resuming questionnaire.");
        UI.showScreen(initialScreenId);

    } else {
        // No saved state or starting completely fresh.
        initialScreenId = 'welcomeScreen';
        console.log("No saved state or starting fresh. Showing welcome screen.");
        UI.showScreen(initialScreenId);
        if (Config.ONBOARDING_ENABLED && !onboardingComplete && onboardingPhase === 1) {
             console.log("Starting onboarding automatically from phase 1.");
             UI.showOnboarding(1);
        }
    }

    // Setup General Event Listeners (always needed)
    setupGlobalEventListeners();
    setupWelcomeScreenListeners();
    setupDrawerListeners();
    setupPopupInteractionListeners();
    setupQuestionnaireListeners(); // Setup listeners AFTER initial screen is determined
    setupPersonaScreenListeners();
    setupWorkshopScreenListeners();
    setupRepositoryListeners();
    setupOnboardingListeners();

    // Initial UI updates based on loaded/initial state
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter();

    console.log("Initialization complete. Initial screen:", initialScreenId);
}

// --- Helper to potentially advance onboarding after an action ---
// (Keep the existing triggerActionAndCheckOnboarding function as is)
function triggerActionAndCheckOnboarding(actionFn, actionName, targetPhase, actionValue = null) {
    console.log(`Action Triggered: '${actionName}' (Target Phase: ${targetPhase}, Value: ${actionValue})`);

    let actionResult = null;
    if (actionFn && typeof actionFn === 'function') {
        try {
            actionResult = actionFn();
        } catch (error) {
            console.error(`Error executing action function for '${actionName}':`, error);
        }
    }

    const currentPhase = State.getOnboardingPhase();
    const onboardingComplete = State.isOnboardingComplete();

    if (Config.ONBOARDING_ENABLED && !onboardingComplete && currentPhase === targetPhase) {
        const task = onboardingTasks.find(t => t.phaseRequired === targetPhase);
        if (!task) {
            console.warn(`Onboarding task definition missing for phase ${targetPhase}. Cannot check trigger conditions.`);
            return actionResult;
        }

        let meetsCondition = false;
        if (task.track) {
            if (task.track.action === actionName) {
                 meetsCondition = (task.track.value === undefined || task.track.value === actionValue);
                 console.log(`Onboarding Check: Action '${actionName}' matches task action. Value check needed: ${task.track.value !== undefined}. Provided: ${actionValue}. Condition met: ${meetsCondition}`);
            }
        } else {
            console.log(`Onboarding Check: No specific track conditions for phase ${targetPhase}. Assuming action '${actionName}' is the trigger.`);
            meetsCondition = true;
        }

        if (meetsCondition) {
             console.log(`Action '${actionName}' meets criteria for phase ${targetPhase}. Advancing onboarding.`);
             const nextPhase = State.advanceOnboardingPhase();
             UI.showOnboarding(nextPhase);
        } else {
             console.log(`Action '${actionName}' triggered, but condition not met for phase ${targetPhase}. Onboarding not advanced.`);
        }
    } else if (Config.ONBOARDING_ENABLED && !onboardingComplete && currentPhase !== targetPhase){
         // console.log(`Action '${actionName}' triggered, but current onboarding phase (${currentPhase}) doesn't match target (${targetPhase}).`);
    }
    return actionResult;
}


// --- Event Listener Setup Functions ---

function setupGlobalEventListeners() {
    const closeSettingsBtn = getElement('closeSettingsPopupButton');
    const forceSaveBtn = getElement('forceSaveButton');
    const resetBtn = getElement('resetAppButton');

    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (forceSaveBtn) forceSaveBtn.addEventListener('click', () => { State.saveGameState(true); UI.showTemporaryMessage("Game Saved!", 1500); });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (confirm("Are you SURE you want to reset all progress? This cannot be undone!")) {
            if (typeof GameLogic !== 'undefined' && GameLogic.clearPopupState) {
                 GameLogic.clearPopupState();
            } else { console.error("GameLogic or clearPopupState not available."); }
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

            const isClickInsideOnboardingPopup = onboardingPopup?.contains(event.target);
            const isClickInsideDrawer = sideDrawerElement?.contains(event.target);

            if (onboardingOverlay?.classList.contains('visible') && !isClickInsideOnboardingPopup) {
                return;
            } else if (sideDrawerElement?.classList.contains('open') && !isClickInsideDrawer) {
                 UI.toggleDrawer();
            } else if (!onboardingOverlay?.classList.contains('visible') && !sideDrawerElement?.classList.contains('open')) {
                 UI.hidePopups();
            }
        });
    } else { console.warn("Popup overlay element not found."); }

     const closeInfoBtn = getElement('closeInfoPopupButton');
     const confirmInfoBtn = getElement('confirmInfoPopupButton');
     if (closeInfoBtn) closeInfoBtn.addEventListener('click', UI.hidePopups);
     if (confirmInfoBtn) confirmInfoBtn.addEventListener('click', UI.hidePopups);

    const addInsightBtn = getElement('addInsightButton');
    if(addInsightBtn) {
        addInsightBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.handleInsightBoostClick) {
                  GameLogic.handleInsightBoostClick();
             } else { console.error("GameLogic or handleInsightBoostClick not available."); }
        });
    } else { console.warn("Add Insight button not found."); }

    document.body.addEventListener('click', (event) => {
        const target = event.target.closest('.info-icon');
        if (target?.title) {
            event.preventDefault();
            event.stopPropagation();
            UI.showInfoPopup(target.title);
        }
    });
}

function setupDrawerListeners() {
    const drawerToggle = getElement('drawerToggle');
    const sideDrawer = getElement('sideDrawer');
    const drawerSettingsButton = getElement('drawerSettings');
    const drawerThemeToggle = getElement('drawerThemeToggle');

    if (drawerToggle) drawerToggle.addEventListener('click', UI.toggleDrawer);
    else console.warn("Drawer toggle button not found.");

    if (sideDrawer) sideDrawer.addEventListener('click', handleDrawerNavClick);
    else console.warn("Side drawer element not found.");

    if (drawerSettingsButton) {
        drawerSettingsButton.addEventListener('click', () => {
            UI.showSettings();
            UI.toggleDrawer();
        });
    }
    if (drawerThemeToggle) drawerThemeToggle.addEventListener('click', UI.toggleTheme);
}

function handleDrawerNavClick(event) {
    const button = event.target.closest('.drawer-link[data-target]');
    if (!button) return;

    const targetScreen = button.dataset.target;
    if (!targetScreen) {
         console.warn("Drawer link clicked without target screen:", button);
         return;
    }

    const isPostQuestionnaire = State.getState().questionnaireCompleted;
    const canNavigate = targetScreen === 'personaScreen' || isPostQuestionnaire;

    if (canNavigate) {
         let phaseTarget = -1;
         if(targetScreen === 'personaScreen') phaseTarget = 6;
         else if(targetScreen === 'workshopScreen') phaseTarget = 2;
         else if(targetScreen === 'repositoryScreen') phaseTarget = 8;

         triggerActionAndCheckOnboarding(
             () => UI.showScreen(targetScreen),
             'showScreen',
             phaseTarget,
             targetScreen
         );
         UI.toggleDrawer();
    } else {
        console.log("Navigation blocked: Questionnaire not complete.");
        UI.showTemporaryMessage("Complete the initial Experimentation first!", 2500);
        UI.toggleDrawer();
    }
}


function setupWelcomeScreenListeners() {
    const startBtn = getElement('startGuidedButton');
    const loadBtn = getElement('loadButton');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            const onboardingComplete = State.isOnboardingComplete();
            const questionnaireComplete = State.getState().questionnaireCompleted;

             if (!questionnaireComplete && (!Config.ONBOARDING_ENABLED || onboardingComplete || currentPhase > Config.MAX_ONBOARDING_PHASE)) {
                 UI.initializeQuestionnaireUI();
                 UI.showScreen('questionnaireScreen');
             } else if (questionnaireComplete) {
                 UI.showScreen('personaScreen');
                 UI.showTemporaryMessage("Experimentation already complete. Welcome back!", 2500);
             } else {
                  UI.showOnboarding(currentPhase);
                  UI.showTemporaryMessage("Let's finish the quick orientation first!", Config.TOAST_DURATION);
             }
        });
    } else { console.warn("Start button not found."); }

    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            if (State.loadGameState()) {
                 initializeApp(); // Re-run initialization
                 UI.showTemporaryMessage("Session Loaded.", 2000);
            } else {
                UI.showTemporaryMessage("Failed to load session. Starting fresh.", 3000);
                 UI.showScreen('welcomeScreen');
            }
        });
    } else { console.warn("Load button not found."); }
}


function setupQuestionnaireListeners() {
    const nextBtn = getElement('nextElementButton');
    const prevBtn = getElement('prevElementButton');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (typeof GameLogic !== 'undefined' && GameLogic.goToPrevElement) {
                 GameLogic.goToPrevElement();
            } else { console.error("GameLogic or goToPrevElement not available."); }
        });
    } else { console.warn("Questionnaire previous button not found."); }

    if (nextBtn) {
         nextBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.goToNextElement) {
                 // Call the logic function first
                 GameLogic.goToNextElement();

                 // Check the state *after* the logic function has potentially updated it
                 const state = State.getState();
                 if (state.questionnaireCompleted && getElement('questionnaireScreen')?.classList.contains('current')) {
                     // If the logic completed the questionnaire and we are still on the Q screen...
                     console.log("Questionnaire complete triggered, transitioning to Persona screen from listener.");
                     // ...then trigger the screen transition.
                     triggerActionAndCheckOnboarding(
                          () => UI.showScreen('personaScreen'),
                          'showScreen', // Action name for screen show
                          -1, // No specific phase target *for showing persona* by default
                          'personaScreen'
                      );
                 }
             } else {
                 console.error("GameLogic or goToNextElement not available.");
             }
         });
     } else { console.warn("Questionnaire next button not found."); }

    // Input listeners are added dynamically by UI.displayElementQuestions
}

// --- Setup Persona Screen Listeners (Keep as is) ---
function setupPersonaScreenListeners() {
    const detailedViewBtn = getElement('showDetailedViewBtn');
    const summaryViewBtn = getElement('showSummaryViewBtn');
    if (detailedViewBtn && summaryViewBtn) {
        detailedViewBtn.addEventListener('click', () => UI.togglePersonaView(true));
        summaryViewBtn.addEventListener('click', () => UI.togglePersonaView(false));
    } else { console.warn("Persona view toggle buttons not found."); }

    const personaElementsContainer = getElement('personaElementDetails');
    if (personaElementsContainer) {
        personaElementsContainer.addEventListener('click', (event) => {
            const unlockButton = event.target.closest('.unlock-button');
            const headerButton = event.target.closest('.accordion-header');

            if (unlockButton) {
                 event.stopPropagation();
                 const elementKey = unlockButton.dataset.elementKey;
                 const level = parseInt(unlockButton.dataset.level);
                 const cost = parseFloat(unlockButton.dataset.cost);
                 if (elementKey && !isNaN(level) && !isNaN(cost)) {
                     if (typeof GameLogic !== 'undefined' && GameLogic.handleUnlockLibraryLevel) {
                         triggerActionAndCheckOnboarding(() => GameLogic.handleUnlockLibraryLevel(event), 'unlockLibrary', 6 );
                     } else { console.error("GameLogic or handleUnlockLibraryLevel not available."); }
                 }
            } else if (headerButton) {
                 const accordionItem = headerButton.closest('.accordion-item');
                 const elementKey = accordionItem?.dataset.elementKey;
                 if (elementKey === 'A') { // Check if opening 'Attraction' matches phase 1 goal
                      triggerActionAndCheckOnboarding(null, 'openElementDetails', 1, elementKey);
                 }
            }
        });
    } else { console.warn("Persona element details container not found."); }

    const focusedConceptsContainer = getElement('focusedConceptsDisplay');
    if (focusedConceptsContainer) {
        focusedConceptsContainer.addEventListener('click', (event) => {
            const targetItem = event.target.closest('.focus-concept-item[data-concept-id]');
            if (targetItem) {
                const conceptId = parseInt(targetItem.dataset.conceptId);
                if (!isNaN(conceptId)) { UI.showConceptDetailPopup(conceptId); }
            }
        });
    } else { console.warn("Focused concepts display container not found."); }

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
         } else { console.warn("Could not find 'Resources' header to attach Insight Log toggle."); }
     } else { console.warn("Insight log container not found."); }

    const dilemmaBtn = getElement('elementalDilemmaButton');
    const synergyBtn = getElement('exploreSynergyButton');
    const suggestSceneBtn = getElement('suggestSceneButton');
    const deepDiveBtn = getElement('deepDiveTriggerButton');

     if (typeof GameLogic !== 'undefined') {
         if (dilemmaBtn && GameLogic.handleElementalDilemmaClick) dilemmaBtn.addEventListener('click', GameLogic.handleElementalDilemmaClick);
         else if (dilemmaBtn) console.warn("Dilemma button found, but handler missing in GameLogic.");
         if (synergyBtn && GameLogic.handleExploreSynergyClick) synergyBtn.addEventListener('click', GameLogic.handleExploreSynergyClick);
         else if (synergyBtn) console.warn("Synergy button found, but handler missing in GameLogic.");
         if (suggestSceneBtn && GameLogic.handleSuggestSceneClick) suggestSceneBtn.addEventListener('click', GameLogic.handleSuggestSceneClick);
         else if (suggestSceneBtn) console.warn("Suggest Scene button found, but handler missing in GameLogic.");
         if (deepDiveBtn && GameLogic.showTapestryDeepDive) deepDiveBtn.addEventListener('click', GameLogic.showTapestryDeepDive);
         else if (deepDiveBtn) console.warn("Deep Dive button found, but handler missing in GameLogic.");
     } else { console.error("GameLogic not available for persona action button listeners."); }

    const suggestedSceneContainer = getElement('suggestedSceneContent');
     if (suggestedSceneContainer) {
         suggestedSceneContainer.addEventListener('click', (event) => {
            const meditateButton = event.target.closest('.button[data-scene-id]');
             if (meditateButton && !meditateButton.disabled) {
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleMeditateScene) {
                      GameLogic.handleMeditateScene(event);
                 } else { console.error("GameLogic or handleMeditateScene not available."); }
             }
         });
     } else { console.warn("Suggested scene content container not found."); }
}


// --- Setup Workshop Screen Listeners (Keep as is) ---
function setupWorkshopScreenListeners() {
    const workshopScreen = getElement('workshopScreen');
    if (!workshopScreen) return;

    const researchBench = getElement('workshop-research-area');
    if (researchBench) {
        researchBench.addEventListener('click', (event) => {
            const buttonCard = event.target.closest('.initial-discovery-element.clickable');
            if (buttonCard?.dataset.elementKey) {
                const isFreeClick = buttonCard.dataset.isFree === 'true';
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleResearchClick) {
                      triggerActionAndCheckOnboarding(() => GameLogic.handleResearchClick({ currentTarget: buttonCard, isFree: isFreeClick }), 'conductResearch', 3 );
                 } else { console.error("GameLogic or handleResearchClick not available."); }
            }
        });
    } else { console.warn("Workshop research bench area not found."); }

    const freeResearchBtn = getElement('freeResearchButtonWorkshop');
    const seekGuidanceBtn = getElement('seekGuidanceButtonWorkshop');
    if (freeResearchBtn) {
        freeResearchBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.handleFreeResearchClick) {
                 triggerActionAndCheckOnboarding(GameLogic.handleFreeResearchClick, 'conductResearch', 3);
             } else { console.error("GameLogic or handleFreeResearchClick not available."); }
        });
    } else { console.warn("Free research button not found."); }
    if (seekGuidanceBtn) {
        seekGuidanceBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.triggerGuidedReflection) {
                  triggerActionAndCheckOnboarding(GameLogic.triggerGuidedReflection, 'triggerReflection', 7);
             } else { console.error("GameLogic or triggerGuidedReflection not available."); }
        });
    } else { console.warn("Seek guidance button not found."); }

    const libraryArea = getElement('workshop-library-area');
    const controls = getElement('grimoire-controls-workshop');
    const shelves = getElement('grimoire-shelves-workshop');
    const grid = getElement('grimoire-grid-workshop');

    if (!libraryArea || !controls || !shelves || !grid) {
        console.error("One or more Workshop library components not found.");
        return;
    }

    const searchInput = getElement('grimoireSearchInputWorkshop');
    if (searchInput) {
         const debouncedRefresh = Utils.debounce(() => UI.refreshGrimoireDisplay(), 350);
         searchInput.addEventListener('input', debouncedRefresh);
    }
    controls.addEventListener('change', (event) => {
         if (event.target.tagName === 'SELECT') { UI.refreshGrimoireDisplay(); }
    });

    shelves.addEventListener('click', (event) => {
        const shelf = event.target.closest('.grimoire-shelf');
        if (shelf?.dataset.categoryId) {
            shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('active-shelf'));
            shelf.classList.add('active-shelf');
            UI.refreshGrimoireDisplay({ filterCategory: shelf.dataset.categoryId });
        }
    });

    grid.addEventListener('click', (event) => {
        const focusButton = event.target.closest('.card-focus-button');
        const sellButton = event.target.closest('.card-sell-button');
        const card = event.target.closest('.concept-card');

        if (focusButton?.dataset.conceptId && !focusButton.disabled) {
            event.stopPropagation();
            const conceptId = parseInt(focusButton.dataset.conceptId);
             if (typeof GameLogic !== 'undefined' && GameLogic.handleCardFocusToggle) {
                  triggerActionAndCheckOnboarding(() => {
                      if(GameLogic.handleCardFocusToggle(conceptId)) {
                          const isFocused = State.getFocusedConcepts().has(conceptId);
                          focusButton.classList.toggle('marked', isFocused);
                          focusButton.innerHTML = `<i class="fas ${isFocused ? 'fa-star' : 'fa-regular fa-star'}"></i>`;
                          focusButton.title = isFocused ? 'Remove Focus' : 'Mark as Focus';
                      }
                  }, 'markFocus', 5);
             } else { console.error("GameLogic or handleCardFocusToggle not available."); }
        } else if (sellButton?.dataset.conceptId) {
             event.stopPropagation();
              if (typeof GameLogic !== 'undefined' && GameLogic.handleSellConcept) {
                   GameLogic.handleSellConcept(event);
              } else { console.error("GameLogic or handleSellConcept not available."); }
        } else if (card?.dataset.conceptId && !event.target.closest('button')) {
             UI.showConceptDetailPopup(parseInt(card.dataset.conceptId));
        }
    });

    let draggedCardId = null;
    grid.addEventListener('dragstart', (event) => {
        const card = event.target.closest('.concept-card[draggable="true"]');
        if (card?.dataset.conceptId) {
            draggedCardId = parseInt(card.dataset.conceptId);
            event.dataTransfer.effectAllowed = 'move';
            try { event.dataTransfer.setData('text/plain', draggedCardId.toString()); } catch (e) { try { event.dataTransfer.setData('Text', draggedCardId.toString()); } catch (e2) { console.error("Drag/Drop setData failed:", e2); } }
            setTimeout(() => card.classList.add('dragging'), 0);
        } else { event.preventDefault(); }
    });
    grid.addEventListener('dragend', (event) => {
        const card = event.target.closest('.concept-card');
        if (card) { card.classList.remove('dragging'); }
        draggedCardId = null;
        shelves?.querySelectorAll('.grimoire-shelf').forEach(shelf => shelf.classList.remove('drag-over'));
    });

    shelves.addEventListener('dragover', (event) => {
        event.preventDefault();
        const shelf = event.target.closest('.grimoire-shelf:not(.show-all-shelf)');
        if (shelf) {
            event.dataTransfer.dropEffect = 'move';
            shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over'));
            shelf.classList.add('drag-over');
        } else {
            event.dataTransfer.dropEffect = 'none';
            shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over'));
        }
    });
    shelves.addEventListener('dragleave', (event) => {
        const shelf = event.target.closest('.grimoire-shelf');
         if (shelf && !shelf.contains(event.relatedTarget)) { shelf.classList.remove('drag-over'); }
         else if (event.currentTarget === shelves && !shelves.contains(event.relatedTarget)){
             shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over'));
         }
    });
    shelves.addEventListener('drop', (event) => {
        event.preventDefault();
        shelves.querySelectorAll('.grimoire-shelf').forEach(shelf => shelf.classList.remove('drag-over'));
        const shelf = event.target.closest('.grimoire-shelf:not(.show-all-shelf)');
        let droppedCardIdFromData = null;
        try { droppedCardIdFromData = parseInt(event.dataTransfer.getData('text/plain')); } catch (e) { try { droppedCardIdFromData = parseInt(event.dataTransfer.getData('Text')); } catch (e2) { /* ignore */ } }
        const finalCardId = !isNaN(droppedCardIdFromData) ? droppedCardIdFromData : draggedCardId;
        if (shelf?.dataset.categoryId && finalCardId !== null) {
            const categoryId = shelf.dataset.categoryId;
            if (typeof GameLogic !== 'undefined' && GameLogic.handleCategorizeCard) {
                 triggerActionAndCheckOnboarding(() => GameLogic.handleCategorizeCard(finalCardId, categoryId), 'categorizeCard', 5 );
            } else { console.error("GameLogic or handleCategorizeCard not available."); }
        } else { console.log("Drop failed: Invalid target shelf or missing card ID."); }
        draggedCardId = null;
    });
}

// --- Setup Repository Listeners (Keep as is) ---
function setupRepositoryListeners() {
    const repoContainer = getElement('repositoryScreen');
    if (!repoContainer) return;

    repoContainer.addEventListener('click', (event) => {
        const meditateButton = event.target.closest('.button[data-scene-id]');
        const experimentButton = event.target.closest('.button[data-experiment-id]');

        if (typeof GameLogic !== 'undefined') {
             if (meditateButton && !meditateButton.disabled && GameLogic.handleMeditateScene) {
                 triggerActionAndCheckOnboarding(() => GameLogic.handleMeditateScene(event), 'meditateScene', 8 );
             }
             else if (experimentButton && !experimentButton.disabled && GameLogic.handleAttemptExperiment) {
                  triggerActionAndCheckOnboarding(() => GameLogic.handleAttemptExperiment(event), 'attemptExperiment', 8 );
             }
        } else { console.error("GameLogic not available for repository button listeners."); }
    });
}

// --- Setup Popup Interaction Listeners (Keep as is) ---
function setupPopupInteractionListeners() {
    document.querySelectorAll('.popup:not(.onboarding-popup) .close-button').forEach(button => {
         button.addEventListener('click', UI.hidePopups);
    });
    setupConceptDetailPopupListeners();
    setupResearchPopupListeners();
    setupReflectionPopupListeners();
    setupDeepDivePopupListeners();
    setupDilemmaPopupListeners();
}

// --- Setup Concept Detail Listeners (Keep as is) ---
function setupConceptDetailPopupListeners() {
    const popup = getElement('conceptDetailPopup');
    if (!popup) { console.warn("Concept detail popup not found."); return; }

    const addBtn = getElement('addToGrimoireButton');
    const focusBtn = getElement('markAsFocusButton');
    const saveNoteBtn = getElement('saveMyNoteButton');
    const loreContent = getElement('popupLoreContent');
    const actionsContainer = popup.querySelector('.popup-actions');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (typeof GameLogic !== 'undefined' && GameLogic.getCurrentPopupConceptId && GameLogic.addConceptToGrimoireById) {
                const conceptId = GameLogic.getCurrentPopupConceptId();
                if (conceptId !== null) {
                    triggerActionAndCheckOnboarding(() => GameLogic.addConceptToGrimoireById(conceptId, addBtn), 'addToGrimoire', 4 );
                }
            } else { console.error("GameLogic functions for AddToGrimoire not available."); }
        });
    } else { console.warn("Add to Grimoire button not found in popup."); }

    if (focusBtn) {
        focusBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.handleToggleFocusConcept) {
                 triggerActionAndCheckOnboarding(() => GameLogic.handleToggleFocusConcept(), 'markFocus', 5 );
             } else { console.error("GameLogic function handleToggleFocusConcept not available."); }
        });
    } else { console.warn("Mark as Focus button not found in popup."); }

    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.handleSaveNote) {
                  GameLogic.handleSaveNote();
             } else { console.error("GameLogic function handleSaveNote not available."); }
        });
    } else { console.warn("Save Note button not found in popup."); }

    if (loreContent) {
        loreContent.addEventListener('click', (event) => {
            const button = event.target.closest('.unlock-lore-button');
            if (button?.dataset.conceptId && button.dataset.loreLevel && button.dataset.cost && !button.disabled) {
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleUnlockLore) {
                      triggerActionAndCheckOnboarding(() => GameLogic.handleUnlockLore(parseInt(button.dataset.conceptId), parseInt(button.dataset.loreLevel), parseFloat(button.dataset.cost)), 'unlockLore', 6 );
                 } else { console.error("GameLogic function handleUnlockLore not available."); }
            }
        });
    } else { console.warn("Lore content container not found in popup."); }

    if (actionsContainer) {
        actionsContainer.addEventListener('click', (event) => {
            const sellButton = event.target.closest('.popup-sell-button');
            if (sellButton?.dataset.conceptId) {
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleSellConcept) {
                      GameLogic.handleSellConcept(event);
                 } else { console.error("GameLogic function handleSellConcept not available."); }
            }
        });
    } else { console.warn("Popup actions container not found."); }
}

// --- Setup Research Popup Listeners (Keep as is) ---
function setupResearchPopupListeners() {
    const popup = getElement('researchResultsPopup');
    if (!popup) { console.warn("Research results popup not found."); return; }

    const closeBtn = getElement('closeResearchResultsPopupButton');
    const confirmBtn = getElement('confirmResearchChoicesButton');
    const contentArea = getElement('researchPopupContent');

    if (closeBtn) closeBtn.addEventListener('click', UI.hidePopups);
    else { console.warn("Research results close button not found."); }

    if (confirmBtn) confirmBtn.addEventListener('click', UI.hidePopups);
    else { console.warn("Research results confirm button not found."); }

    if (contentArea) {
        contentArea.addEventListener('click', (event) => {
            const actionButton = event.target.closest('.card-actions .button[data-action]');
            if (actionButton?.dataset.conceptId) {
                const conceptId = parseInt(actionButton.dataset.conceptId);
                const action = actionButton.dataset.action;
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleResearchPopupChoice) {
                      if (action === 'keep') {
                          triggerActionAndCheckOnboarding(() => GameLogic.handleResearchPopupChoice(conceptId, action), 'addToGrimoire', 4 );
                      } else {
                           GameLogic.handleResearchPopupChoice(conceptId, action);
                      }
                 } else { console.error("GameLogic function handleResearchPopupChoice not available."); }
            }
        });
    } else { console.warn("Research popup content area not found."); }
}

// --- Setup Reflection Popup Listeners (Keep as is) ---
function setupReflectionPopupListeners() {
    const popup = getElement('reflectionModal');
    if (!popup) { console.warn("Reflection modal not found."); return; }

    const reflectionCheck = getElement('reflectionCheckbox');
    const confirmBtn = getElement('confirmReflectionButton');
    const nudgeCheck = getElement('scoreNudgeCheckbox');

    if (reflectionCheck && confirmBtn) {
        reflectionCheck.addEventListener('change', () => { confirmBtn.disabled = !reflectionCheck.checked; });
        confirmBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.handleConfirmReflection) {
                  triggerActionAndCheckOnboarding(() => GameLogic.handleConfirmReflection(nudgeCheck?.checked || false), 'completeReflection', 7 );
             } else { console.error("GameLogic function handleConfirmReflection not available."); }
        });
    } else { console.warn("Reflection checkbox or confirm button not found."); }
}

// --- Setup Deep Dive Listeners (Keep as is) ---
function setupDeepDivePopupListeners() {
    const popup = getElement('tapestryDeepDiveModal');
    if (!popup) { console.warn("Deep dive modal not found."); return; }

    const nodesContainer = getElement('deepDiveAnalysisNodes');
    const detailContent = getElement('deepDiveDetailContent');

    if (nodesContainer) {
        nodesContainer.addEventListener('click', (event) => {
            const nodeButton = event.target.closest('.aspect-node[data-node-id]');
            if (nodeButton && !nodeButton.disabled) {
                 const nodeId = nodeButton.dataset.nodeId;
                 if (typeof GameLogic !== 'undefined') {
                      if (nodeId === 'contemplation' && GameLogic.handleContemplationNodeClick) GameLogic.handleContemplationNodeClick();
                      else if (GameLogic.handleDeepDiveNodeClick) GameLogic.handleDeepDiveNodeClick(nodeId);
                      else console.error("GameLogic deep dive handlers not available.");
                 } else { console.error("GameLogic not available for deep dive node clicks."); }
            }
        });
    } else { console.warn("Deep dive nodes container not found."); }

     if (detailContent) {
         detailContent.addEventListener('click', (event) => {
             const completeButton = event.target.closest('#completeContemplationBtn');
             if (completeButton) {
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleCompleteContemplation) GameLogic.handleCompleteContemplation();
                 else console.error("GameLogic function handleCompleteContemplation not available.");
             }
         });
     } else { console.warn("Deep dive detail content area not found."); }
}

// --- Setup Dilemma Listeners (Keep as is) ---
function setupDilemmaPopupListeners() {
    const popup = getElement('dilemmaModal');
    if (!popup) { console.warn("Dilemma modal not found."); return; }

    const confirmBtn = getElement('confirmDilemmaButton');
    if (confirmBtn) {
         if (typeof GameLogic !== 'undefined' && GameLogic.handleConfirmDilemma) confirmBtn.addEventListener('click', GameLogic.handleConfirmDilemma);
         else console.error("GameLogic function handleConfirmDilemma not available.");
    } else { console.warn("Dilemma confirm button not found."); }

    const slider = getElement('dilemmaSlider');
    const valueDisplay = getElement('dilemmaSliderValueDisplay');
    const minLabel = getElement('dilemmaSliderMinLabel');
    const maxLabel = getElement('dilemmaSliderMaxLabel');
    if (slider && valueDisplay && minLabel && maxLabel) {
        slider.addEventListener('input', () => {
            const val = parseFloat(slider.value); let leaning;
            if (val < 1.5) leaning = `Strongly ${minLabel.textContent}`;
            else if (val < 4.5) leaning = `Towards ${minLabel.textContent}`;
            else if (val > 8.5) leaning = `Strongly ${maxLabel.textContent}`;
            else if (val > 5.5) leaning = `Towards ${maxLabel.textContent}`;
            else leaning = "Balanced";
            valueDisplay.textContent = leaning;
        });
    } else { console.warn("Dilemma slider components missing."); }
}

// --- Setup Onboarding Listeners (Keep as is) ---
function setupOnboardingListeners() {
    const overlay = getElement('onboardingOverlay');
    if (!overlay) return;

    const nextBtn = getElement('onboardingNextButton');
    const prevBtn = getElement('onboardingPrevButton');
    const skipBtn = getElement('onboardingSkipButton');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            if (currentPhase === Config.MAX_ONBOARDING_PHASE) {
                 console.log("Onboarding: Finishing...");
                 State.markOnboardingComplete();
                 UI.hideOnboarding();
                 UI.showScreen(State.getState().questionnaireCompleted ? 'personaScreen' : 'welcomeScreen');
            } else {
                 const nextPhase = State.advanceOnboardingPhase();
                 UI.showOnboarding(nextPhase);
            }
        });
    } else { console.warn("Onboarding next button not found."); }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            if (currentPhase > 1) {
                 const prevPhase = currentPhase - 1;
                 State.updateOnboardingPhase(prevPhase);
                 UI.showOnboarding(prevPhase);
            }
        });
    } else { console.warn("Onboarding previous button not found."); }

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to skip the rest of the orientation? You can't restart it later.")) {
                 console.log("Onboarding: Skipping...");
                 State.markOnboardingComplete();
                 UI.hideOnboarding();
                  UI.showScreen(State.getState().questionnaireCompleted ? 'personaScreen' : 'welcomeScreen');
            }
        });
    } else { console.warn("Onboarding skip button not found."); }
}


// --- App Start ---
document.addEventListener('DOMContentLoaded', initializeApp);

console.log("main.js loaded successfully. (Enhanced v4.1 + Drawer - Fixed v2)");
// --- END OF FILE main.js ---
