// --- START OF FILE main.js ---

// js/main.js - Application Entry Point & Event Listener Setup (Enhanced v4.1 + Drawer - Fixed)

import * as UI from './js/ui.js';
import * as State from './js/state.js';
import * as GameLogic from './js/gameLogic.js';
import * as Utils from './js/utils.js';
import * as Config from './js/config.js';
import { onboardingTasks, elementKeyToFullName } from './data.js'; // Import onboarding tasks & element map

console.log("main.js loading... (Enhanced v4.1 + Drawer - Fixed)");

// --- Helper Function ---
// Define getElement locally for use in this module
const getElement = (id) => document.getElementById(id);

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab (v4.1 - Fixed)...");
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
                // Found the screen the highlighted element is on
                requiredScreen = screenElement.id;

                // Check if this screen is accessible based on game state
                if (!questionnaireComplete && ['personaScreen', 'workshopScreen', 'repositoryScreen'].includes(requiredScreen)) {
                    // If Q not done, can only be on welcome or questionnaire
                    requiredScreen = (currentQuestionnaireIndex > -1) ? 'questionnaireScreen' : 'welcomeScreen';
                    console.warn(`Onboarding task ${currentTask.id} requires screen ${screenElement.id}, but questionnaire not complete. Forcing ${requiredScreen}.`);
                } else if (questionnaireComplete && requiredScreen === 'questionnaireScreen') {
                    // Can't be on questionnaire if it's already done
                    requiredScreen = 'personaScreen';
                    console.warn(`Onboarding task ${currentTask.id} requires questionnaireScreen, but questionnaire complete. Forcing personaScreen.`);
                }
            }
        }
        // If no highlight target, determine screen based on phase/state
        else if (onboardingPhase >= 6) { // Phases requiring persona/repo assume Q done
            requiredScreen = questionnaireComplete ? 'personaScreen' : 'welcomeScreen';
        } else if (onboardingPhase >= 2) { // Phases requiring workshop assume Q done
             requiredScreen = questionnaireComplete ? 'workshopScreen' : 'welcomeScreen';
        } else { // Phase 1
            requiredScreen = 'welcomeScreen';
        }

        initialScreenId = requiredScreen;
        UI.showScreen(initialScreenId); // Show the screen needed for context FIRST
        UI.showOnboarding(onboardingPhase); // Then show the onboarding overlay/highlight

    } else if (loaded && questionnaireComplete) {
        // Standard load: Questionnaire done, show Persona screen
        initialScreenId = 'personaScreen';
        console.log("Loaded completed state. Showing Persona screen.");
        UI.showScreen(initialScreenId);
        if (typeof GameLogic !== 'undefined' && GameLogic.checkForDailyLogin) {
             GameLogic.checkForDailyLogin(); // Check daily login after loading state
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
        // If onboarding is enabled and should start (phase 1), trigger it
        if (Config.ONBOARDING_ENABLED && !onboardingComplete && onboardingPhase === 1) {
             console.log("Starting onboarding automatically from phase 1.");
             UI.showOnboarding(1); // Show onboarding overlay
        }
    }

    // Setup General Event Listeners (always needed)
    setupGlobalEventListeners();
    setupWelcomeScreenListeners(); // Setup welcome screen listeners regardless of initial screen
    setupDrawerListeners(); // Setup listeners for the drawer navigation
    setupPopupInteractionListeners();
    setupQuestionnaireListeners();
    setupPersonaScreenListeners();
    setupWorkshopScreenListeners();
    setupRepositoryListeners();
    setupOnboardingListeners(); // Add listeners for onboarding controls

    // Initial UI updates based on loaded/initial state (some might be redundant if called within showScreen)
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter();

    console.log("Initialization complete. Initial screen:", initialScreenId);
}

// --- Helper to potentially advance onboarding after an action ---
// actionFn: The main game logic function to execute (can be null if only checking).
// actionName: A string identifier for the action (must match onboardingTasks[phase].track.action).
// targetPhase: The onboarding phase this action is expected to complete.
// actionValue: Optional value associated with the action (must match onboardingTasks[phase].track.value).
// Returns the result of actionFn if it was called, otherwise null.
function triggerActionAndCheckOnboarding(actionFn, actionName, targetPhase, actionValue = null) {
    console.log(`Action Triggered: '${actionName}' (Target Phase: ${targetPhase}, Value: ${actionValue})`);

    let actionResult = null;
    // Execute the primary game action if provided
    if (actionFn && typeof actionFn === 'function') {
        try {
            actionResult = actionFn(); // Store the result if needed
        } catch (error) {
            console.error(`Error executing action function for '${actionName}':`, error);
            // Decide if onboarding check should still proceed or not
            // return actionResult; // Option: Stop if the action failed, return potential partial result
        }
    }

    // Check onboarding status AFTER the action (or if no actionFn)
    const currentPhase = State.getOnboardingPhase();
    const onboardingComplete = State.isOnboardingComplete();

    // Only proceed if onboarding is active, not complete, and matches the target phase
    if (Config.ONBOARDING_ENABLED && !onboardingComplete && currentPhase === targetPhase) {
        const task = onboardingTasks.find(t => t.phaseRequired === targetPhase);

        if (!task) {
            console.warn(`Onboarding task definition missing for phase ${targetPhase}. Cannot check trigger conditions.`);
            return actionResult; // Return action result even if task definition missing
        }

        let meetsCondition = false;
        // Check if the specific action condition is met (if provided in the task's track object)
        if (task.track) {
            if (task.track.action === actionName) {
                 // Condition met if action names match AND either no value is tracked,
                 // or the tracked value matches the provided actionValue.
                 meetsCondition = (task.track.value === undefined || task.track.value === actionValue);
                 console.log(`Onboarding Check: Action '${actionName}' matches task action. Value check needed: ${task.track.value !== undefined}. Provided: ${actionValue}. Condition met: ${meetsCondition}`);
            }
            // TODO: Add checks for task.track.state here if needed later
            // else if (task.track.state === ...) { meetsCondition = ...; }
        } else {
            // If no track object in data, assume the action itself is the trigger (less specific)
            console.log(`Onboarding Check: No specific track conditions for phase ${targetPhase}. Assuming action '${actionName}' is the trigger.`);
            meetsCondition = true;
        }

        if (meetsCondition) {
             console.log(`Action '${actionName}' meets criteria for phase ${targetPhase}. Advancing onboarding.`);
             const nextPhase = State.advanceOnboardingPhase(); // Advance state (returns new phase)
             UI.showOnboarding(nextPhase); // Show the next onboarding step UI
        } else {
             console.log(`Action '${actionName}' triggered, but condition not met for phase ${targetPhase}. Onboarding not advanced.`);
        }
    } else if (Config.ONBOARDING_ENABLED && !onboardingComplete && currentPhase !== targetPhase){
        // Log if the action happened but wasn't for the current phase
        // console.log(`Action '${actionName}' triggered, but current onboarding phase (${currentPhase}) doesn't match target (${targetPhase}).`);
    }
    return actionResult; // Return the result of the original action function
}


// --- Event Listener Setup Functions ---

function setupGlobalEventListeners() {
    // Now uses the locally defined getElement
    const closeSettingsBtn = getElement('closeSettingsPopupButton');
    const forceSaveBtn = getElement('forceSaveButton');
    const resetBtn = getElement('resetAppButton');

    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (forceSaveBtn) forceSaveBtn.addEventListener('click', () => { State.saveGameState(true); UI.showTemporaryMessage("Game Saved!", 1500); });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (confirm("Are you SURE you want to reset all progress? This cannot be undone!")) {
            // Check if GameLogic is loaded before calling
            if (typeof GameLogic !== 'undefined' && GameLogic.clearPopupState) {
                 GameLogic.clearPopupState(); // Clear any lingering temp logic state
            } else { console.error("GameLogic or clearPopupState not available."); }
            State.clearGameState(); // Wipes state and localStorage
            // Reload the page after clearing state for a truly fresh start
            window.location.reload();
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

            // Check if the click target or any of its parents is the onboarding popup or the side drawer
            const isClickInsideOnboardingPopup = onboardingPopup?.contains(event.target);
            const isClickInsideDrawer = sideDrawerElement?.contains(event.target);

            if (onboardingOverlay?.classList.contains('visible') && !isClickInsideOnboardingPopup) {
                // Onboarding visible, click outside its popup, do nothing (don't close anything)
                return;
            } else if (sideDrawerElement?.classList.contains('open') && !isClickInsideDrawer) {
                 // Drawer open, click outside drawer, close drawer
                 UI.toggleDrawer();
            } else if (!onboardingOverlay?.classList.contains('visible') && !sideDrawerElement?.classList.contains('open')) {
                 // Neither onboarding nor drawer is open, hide general popups
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
             // Check if GameLogic is loaded before calling
             if (typeof GameLogic !== 'undefined' && GameLogic.handleInsightBoostClick) {
                  GameLogic.handleInsightBoostClick();
             } else { console.error("GameLogic or handleInsightBoostClick not available."); }
        });
    } else { console.warn("Add Insight button not found."); }

    // Global listener for info icons
    document.body.addEventListener('click', (event) => {
        const target = event.target.closest('.info-icon');
        if (target?.title) {
            event.preventDefault();
            event.stopPropagation(); // Prevent other listeners (like card click)
            UI.showInfoPopup(target.title);
        }
    });
}

// Setup listeners for Drawer navigation and theme toggle
function setupDrawerListeners() {
    const drawerToggle = getElement('drawerToggle');
    const sideDrawer = getElement('sideDrawer');
    const drawerSettingsButton = getElement('drawerSettings');
    const drawerThemeToggle = getElement('drawerThemeToggle');

    if (drawerToggle) {
        drawerToggle.addEventListener('click', UI.toggleDrawer);
    } else { console.warn("Drawer toggle button not found."); }

    if (sideDrawer) {
        sideDrawer.addEventListener('click', handleDrawerNavClick); // Use delegation
    } else { console.warn("Side drawer element not found."); }

    // Specific buttons inside drawer
    if (drawerSettingsButton) {
        drawerSettingsButton.addEventListener('click', () => {
            UI.showSettings(); // Calls UI function to display settings popup
            UI.toggleDrawer(); // Close drawer after opening settings
        });
    }
    if (drawerThemeToggle) {
         drawerThemeToggle.addEventListener('click', UI.toggleTheme);
         // No need to close drawer for theme toggle
    }
}

// Handle clicks within the drawer nav
function handleDrawerNavClick(event) {
    const button = event.target.closest('.drawer-link[data-target]');
    if (!button) return; // Ignore clicks not on actual nav links with targets

    const targetScreen = button.dataset.target;
    if (!targetScreen) {
         console.warn("Drawer link clicked without target screen:", button);
         return;
    }

    const isPostQuestionnaire = State.getState().questionnaireCompleted;
    // Allow access only if questionnaire complete OR target is persona (always accessible after Q)
    // Note: Welcome screen is generally not linked from drawer
    const canNavigate = targetScreen === 'personaScreen' || isPostQuestionnaire;

    if (canNavigate) {
         // Determine onboarding phase target based on the screen
         let phaseTarget = -1; // Default: no specific phase target
         if(targetScreen === 'personaScreen') phaseTarget = 6; // Phase 6 involves returning to Persona
         else if(targetScreen === 'workshopScreen') phaseTarget = 2; // Phase 2 is visiting Workshop
         else if(targetScreen === 'repositoryScreen') phaseTarget = 8; // Phase 8 is visiting Repository

         triggerActionAndCheckOnboarding(
             () => UI.showScreen(targetScreen), // Action: Show the screen
             'showScreen', // Action name used for tracking
             phaseTarget, // Target phase or -1 if none explicitly linked
             targetScreen // Pass screen ID as value for potential finer tracking
         );
         UI.toggleDrawer(); // Close drawer after navigation initiated
    } else {
        // Navigation blocked
        console.log("Navigation blocked: Questionnaire not complete.");
        UI.showTemporaryMessage("Complete the initial Experimentation first!", 2500);
        UI.toggleDrawer(); // Close drawer even if navigation fails
    }
}


function setupWelcomeScreenListeners() {
     // Welcome Screen Buttons
    const startBtn = getElement('startGuidedButton');
    const loadBtn = getElement('loadButton');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            const onboardingComplete = State.isOnboardingComplete();
            const questionnaireComplete = State.getState().questionnaireCompleted;

            // Can only start questionnaire if it's not already done AND onboarding is complete/disabled/bypassed
             if (!questionnaireComplete && (!Config.ONBOARDING_ENABLED || onboardingComplete || currentPhase > Config.MAX_ONBOARDING_PHASE)) {
                 UI.initializeQuestionnaireUI();
                 UI.showScreen('questionnaireScreen');
             } else if (questionnaireComplete) {
                 // If Q already done, maybe go to Persona instead?
                 UI.showScreen('personaScreen');
                 UI.showTemporaryMessage("Experimentation already complete. Welcome back!", 2500);
             } else {
                  // If onboarding isn't finished, prompt user to finish it
                  UI.showOnboarding(currentPhase); // Ensure current onboarding step is visible
                  UI.showTemporaryMessage("Let's finish the quick orientation first!", Config.TOAST_DURATION);
             }
        });
    } else { console.warn("Start button not found."); }

    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            if (State.loadGameState()) { // loadGameState returns true/false
                 // Re-run initialization to setup UI based on loaded state
                 // This avoids potential stale UI if load fails partially
                 initializeApp();
                 UI.showTemporaryMessage("Session Loaded.", 2000);
            } else {
                // Load failed (error likely logged in State.loadGameState)
                UI.showTemporaryMessage("Failed to load session. Starting fresh.", 3000);
                 // Ensure welcome screen is shown after failed load
                 UI.showScreen('welcomeScreen');
            }
        });
    } else { console.warn("Load button not found."); }
}


function setupQuestionnaireListeners() {
    const nextBtn = getElement('nextElementButton');
    const prevBtn = getElement('prevElementButton');
    const questionnaireContent = getElement('questionContent'); // For dynamic listener attachment

    // Check if GameLogic is loaded before adding listeners that call it
    if (typeof GameLogic !== 'undefined' && GameLogic.goToNextElement && GameLogic.goToPrevElement) {
         if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
         else { console.warn("Questionnaire next button not found."); }

         if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);
         else { console.warn("Questionnaire previous button not found."); }
    } else {
         console.error("GameLogic not available for questionnaire button listeners.");
    }
    // Input listeners are added dynamically by UI.displayElementQuestions when questions are rendered
    // No need to add listeners here for dynamically added inputs
}

function setupPersonaScreenListeners() {
    // View Toggle Buttons
    const detailedViewBtn = getElement('showDetailedViewBtn');
    const summaryViewBtn = getElement('showSummaryViewBtn');
    if (detailedViewBtn && summaryViewBtn) {
        detailedViewBtn.addEventListener('click', () => UI.togglePersonaView(true));
        summaryViewBtn.addEventListener('click', () => UI.togglePersonaView(false));
    } else { console.warn("Persona view toggle buttons not found."); }

    // Event Delegation for Element Details (Accordion Toggles, Unlock Buttons)
    const personaElementsContainer = getElement('personaElementDetails');
    if (personaElementsContainer) {
        personaElementsContainer.addEventListener('click', (event) => {
            const unlockButton = event.target.closest('.unlock-button');
            const headerButton = event.target.closest('.accordion-header'); // Target the accordion button

            if (unlockButton) {
                // Prevent accordion toggle when clicking unlock button
                 event.stopPropagation();
                 const elementKey = unlockButton.dataset.elementKey;
                 const level = parseInt(unlockButton.dataset.level);
                 const cost = parseFloat(unlockButton.dataset.cost);

                 if (elementKey && !isNaN(level) && !isNaN(cost)) {
                     // Check if GameLogic is loaded before calling
                     if (typeof GameLogic !== 'undefined' && GameLogic.handleUnlockLibraryLevel) {
                         triggerActionAndCheckOnboarding(
                             () => GameLogic.handleUnlockLibraryLevel(event), // Pass event for internal handling
                             'unlockLibrary', // Action name
                             6 // Target phase for first unlock (Verify this phase in onboardingTasks)
                         );
                     } else { console.error("GameLogic or handleUnlockLibraryLevel not available."); }
                 }
            } else if (headerButton) {
                 // Accordion toggle logic is handled within the button's listener in UI.js
                 // Check if this specific interaction completes an onboarding step
                 const accordionItem = headerButton.closest('.accordion-item');
                 const elementKey = accordionItem?.dataset.elementKey;
                 // Example: Check if opening the 'Attraction' details completes phase 1
                 // Phase 1: Visit Persona Screen (handled by drawer nav), maybe opening first element is confirmation?
                 if (elementKey === 'A') { // Assuming 'A' is the key for Attraction
                      triggerActionAndCheckOnboarding(null, 'openElementDetails', 1, elementKey); // Pass elementKey as value
                 }
                 // Add checks for other phases if needed
            }
        });
    } else { console.warn("Persona element details container not found."); }

    // Event Delegation for Focused Concepts (Click to view details)
    const focusedConceptsContainer = getElement('focusedConceptsDisplay');
    if (focusedConceptsContainer) {
        focusedConceptsContainer.addEventListener('click', (event) => {
            const targetItem = event.target.closest('.focus-concept-item[data-concept-id]');
            if (targetItem) {
                const conceptId = parseInt(targetItem.dataset.conceptId);
                if (!isNaN(conceptId)) {
                    UI.showConceptDetailPopup(conceptId);
                }
            }
        });
    } else { console.warn("Focused concepts display container not found."); }

     // Insight Log Toggle
     const insightLogContainer = getElement('insightLogContainer');
     if (insightLogContainer) {
         // Target the "Resources" H2 more reliably
         const resourceHeader = personaElementsContainer?.parentNode?.querySelector('h2[title*="Insight"]');
         if (resourceHeader) {
             resourceHeader.style.cursor = 'pointer'; // Already set in CSS, but reinforce here
             resourceHeader.addEventListener('click', () => {
                 const isHidden = insightLogContainer.classList.toggle('log-hidden');
                 // Update display based on class - needed because class alone might not trigger style update if !important is used elsewhere potentially
                 insightLogContainer.style.display = isHidden ? 'none' : 'block';
             });
             // Ensure correct initial display based on class
             insightLogContainer.style.display = insightLogContainer.classList.contains('log-hidden') ? 'none' : 'block';
         } else { console.warn("Could not find 'Resources' header to attach Insight Log toggle."); }
     } else { console.warn("Insight log container not found."); }


    // Persona Action Buttons
    const dilemmaBtn = getElement('elementalDilemmaButton');
    const synergyBtn = getElement('exploreSynergyButton');
    const suggestSceneBtn = getElement('suggestSceneButton');
    const deepDiveBtn = getElement('deepDiveTriggerButton');

     // Check if GameLogic is loaded before adding listeners
     if (typeof GameLogic !== 'undefined') {
         if (dilemmaBtn && GameLogic.handleElementalDilemmaClick) dilemmaBtn.addEventListener('click', GameLogic.handleElementalDilemmaClick);
         else if (dilemmaBtn) console.warn("Dilemma button found, but handler missing in GameLogic.");

         if (synergyBtn && GameLogic.handleExploreSynergyClick) synergyBtn.addEventListener('click', GameLogic.handleExploreSynergyClick);
         else if (synergyBtn) console.warn("Synergy button found, but handler missing in GameLogic.");

         if (suggestSceneBtn && GameLogic.handleSuggestSceneClick) suggestSceneBtn.addEventListener('click', GameLogic.handleSuggestSceneClick);
         else if (suggestSceneBtn) console.warn("Suggest Scene button found, but handler missing in GameLogic.");

         if (deepDiveBtn && GameLogic.showTapestryDeepDive) deepDiveBtn.addEventListener('click', GameLogic.showTapestryDeepDive);
         else if (deepDiveBtn) console.warn("Deep Dive button found, but handler missing in GameLogic.");

     } else {
         console.error("GameLogic not available for persona action button listeners.");
     }


    // Event Delegation for Suggested Scene Meditate Button
    const suggestedSceneContainer = getElement('suggestedSceneContent');
     if (suggestedSceneContainer) {
         suggestedSceneContainer.addEventListener('click', (event) => {
            const meditateButton = event.target.closest('.button[data-scene-id]');
             if (meditateButton && !meditateButton.disabled) {
                 // Check if GameLogic is loaded before calling
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleMeditateScene) {
                      GameLogic.handleMeditateScene(event);
                 } else { console.error("GameLogic or handleMeditateScene not available."); }
             }
         });
     } else { console.warn("Suggested scene content container not found."); }
}

function setupWorkshopScreenListeners() {
    const workshopScreen = getElement('workshopScreen');
    if (!workshopScreen) return;

    // --- Research Bench --- (Event Delegation for Element Buttons)
    const researchBench = getElement('workshop-research-area'); // Target the panel
    if (researchBench) {
        researchBench.addEventListener('click', (event) => {
            // Target the clickable element card
            const buttonCard = event.target.closest('.initial-discovery-element.clickable');
            if (buttonCard?.dataset.elementKey) {
                const isFreeClick = buttonCard.dataset.isFree === 'true';
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleResearchClick) {
                      triggerActionAndCheckOnboarding(
                          () => GameLogic.handleResearchClick({ currentTarget: buttonCard, isFree: isFreeClick }),
                          'conductResearch', // Action name matches onboarding task
                          3 // Target phase (Verify in onboardingTasks)
                      );
                 } else { console.error("GameLogic or handleResearchClick not available."); }
            }
        });
    } else { console.warn("Workshop research bench area not found."); }

    // --- Daily Actions (Direct Listeners) ---
    const freeResearchBtn = getElement('freeResearchButtonWorkshop');
    const seekGuidanceBtn = getElement('seekGuidanceButtonWorkshop');
    if (freeResearchBtn) {
        freeResearchBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.handleFreeResearchClick) {
                 // Free research counts towards the 'conductResearch' onboarding step too
                 triggerActionAndCheckOnboarding(GameLogic.handleFreeResearchClick, 'conductResearch', 3);
             } else { console.error("GameLogic or handleFreeResearchClick not available."); }
        });
    } else { console.warn("Free research button not found."); }
    if (seekGuidanceBtn) {
        seekGuidanceBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.triggerGuidedReflection) {
                  // Guided reflection counts towards the 'triggerReflection' onboarding step
                  triggerActionAndCheckOnboarding(GameLogic.triggerGuidedReflection, 'triggerReflection', 7); // Phase 7 is reflection
             } else { console.error("GameLogic or triggerGuidedReflection not available."); }
        });
    } else { console.warn("Seek guidance button not found."); }

    // --- Library Area ---
    const libraryArea = getElement('workshop-library-area');
    const controls = getElement('grimoire-controls-workshop');
    const shelves = getElement('grimoire-shelves-workshop');
    const grid = getElement('grimoire-grid-workshop');

    if (!libraryArea || !controls || !shelves || !grid) {
        console.error("One or more Workshop library components not found.");
        return; // Stop setting up library listeners if essential parts are missing
    }

    // Filter/Sort Controls
    const searchInput = getElement('grimoireSearchInputWorkshop');
    if (searchInput) {
         const debouncedRefresh = Utils.debounce(() => UI.refreshGrimoireDisplay(), 350);
         searchInput.addEventListener('input', debouncedRefresh);
    }
    // Refresh immediately on other control changes (select dropdowns)
    controls.addEventListener('change', (event) => {
         if (event.target.tagName === 'SELECT') {
             UI.refreshGrimoireDisplay();
         }
    });

    // Shelf Clicks (Filtering)
    shelves.addEventListener('click', (event) => {
        const shelf = event.target.closest('.grimoire-shelf');
        if (shelf?.dataset.categoryId) {
            // Visually activate the clicked shelf
            shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('active-shelf'));
            shelf.classList.add('active-shelf');
            // Refresh the display filtered by this category
            UI.refreshGrimoireDisplay({ filterCategory: shelf.dataset.categoryId });
            // Onboarding: Check if clicking a specific shelf (e.g., Core Identity) is a step
            // triggerActionAndCheckOnboarding(null, 'selectShelf', DESIRED_PHASE, shelf.dataset.categoryId);
        }
    });

    // Grimoire Grid Interactions (Details, Focus, Sell, Drag/Drop) - Using Event Delegation
    // Click Actions
    grid.addEventListener('click', (event) => {
        const focusButton = event.target.closest('.card-focus-button');
        const sellButton = event.target.closest('.card-sell-button');
        const card = event.target.closest('.concept-card');

        if (focusButton?.dataset.conceptId && !focusButton.disabled) {
            event.stopPropagation(); // Prevent card click from firing
            const conceptId = parseInt(focusButton.dataset.conceptId);
             if (typeof GameLogic !== 'undefined' && GameLogic.handleCardFocusToggle) {
                  triggerActionAndCheckOnboarding(() => {
                      // Check if toggle was successful before updating UI
                      if(GameLogic.handleCardFocusToggle(conceptId)) {
                          const isFocused = State.getFocusedConcepts().has(conceptId);
                          focusButton.classList.toggle('marked', isFocused);
                          focusButton.innerHTML = `<i class="fas ${isFocused ? 'fa-star' : 'fa-regular fa-star'}"></i>`;
                          focusButton.title = isFocused ? 'Remove Focus' : 'Mark as Focus';
                      }
                  }, 'markFocus', 5); // Phase 5 is Mark Focus
             } else { console.error("GameLogic or handleCardFocusToggle not available."); }
        } else if (sellButton?.dataset.conceptId) {
             event.stopPropagation(); // Prevent card click
              if (typeof GameLogic !== 'undefined' && GameLogic.handleSellConcept) {
                   GameLogic.handleSellConcept(event); // Sell logic handles confirmation etc.
              } else { console.error("GameLogic or handleSellConcept not available."); }
        } else if (card?.dataset.conceptId && !event.target.closest('button')) {
            // If the click was on the card itself, not a button inside
             UI.showConceptDetailPopup(parseInt(card.dataset.conceptId));
        }
    });

    // Drag and Drop Logic
    let draggedCardId = null;
    grid.addEventListener('dragstart', (event) => {
        const card = event.target.closest('.concept-card[draggable="true"]');
        if (card?.dataset.conceptId) {
            draggedCardId = parseInt(card.dataset.conceptId);
            event.dataTransfer.effectAllowed = 'move';
            try { event.dataTransfer.setData('text/plain', draggedCardId.toString()); } catch (e) { try { event.dataTransfer.setData('Text', draggedCardId.toString()); } catch (e2) { console.error("Drag/Drop setData failed:", e2); } }
            // Add dragging class slightly later to ensure it applies
            setTimeout(() => card.classList.add('dragging'), 0);
        } else {
            event.preventDefault(); // Prevent dragging if not a valid card
        }
    });

    grid.addEventListener('dragend', (event) => {
        // Use event.target which is the element that was dragged
        const card = event.target.closest('.concept-card');
        if (card) { card.classList.remove('dragging'); }
        draggedCardId = null;
        shelves?.querySelectorAll('.grimoire-shelf').forEach(shelf => shelf.classList.remove('drag-over'));
    });

    // Shelf Drag Listeners (for dropping cards onto shelves)
    shelves.addEventListener('dragover', (event) => {
        event.preventDefault(); // Necessary to allow dropping
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
         // Only remove 'drag-over' if leaving the shelf element itself *or* leaving the container entirely
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
        // Use the ID from dataTransfer if available, otherwise fallback to the one stored during dragstart
        const finalCardId = !isNaN(droppedCardIdFromData) ? droppedCardIdFromData : draggedCardId;

        if (shelf?.dataset.categoryId && finalCardId !== null) {
            const categoryId = shelf.dataset.categoryId;
            if (typeof GameLogic !== 'undefined' && GameLogic.handleCategorizeCard) {
                 triggerActionAndCheckOnboarding(
                     () => GameLogic.handleCategorizeCard(finalCardId, categoryId),
                     'categorizeCard',
                     5 // Phase 5 is Focus/Categorize (Verify in onboardingTasks)
                 );
            } else { console.error("GameLogic or handleCategorizeCard not available."); }
        } else {
            console.log("Drop failed: Invalid target shelf or missing card ID.");
        }
        draggedCardId = null; // Reset dragged ID after drop attempt
    });
}

function setupRepositoryListeners() {
    const repoContainer = getElement('repositoryScreen');
    if (!repoContainer) return;

    // Event delegation for action buttons within repository lists
    repoContainer.addEventListener('click', (event) => {
        const meditateButton = event.target.closest('.button[data-scene-id]');
        const experimentButton = event.target.closest('.button[data-experiment-id]');

        // Check if GameLogic is loaded before calling
        if (typeof GameLogic !== 'undefined') {
             if (meditateButton && !meditateButton.disabled && GameLogic.handleMeditateScene) {
                 // Onboarding check: Meditating might be part of phase 8?
                 triggerActionAndCheckOnboarding(
                     () => GameLogic.handleMeditateScene(event),
                     'meditateScene',
                     8 // Verify phase target
                 );
             }
             else if (experimentButton && !experimentButton.disabled && GameLogic.handleAttemptExperiment) {
                  // Onboarding check: Attempting experiment might be part of phase 8?
                  triggerActionAndCheckOnboarding(
                      () => GameLogic.handleAttemptExperiment(event),
                      'attemptExperiment',
                      8 // Verify phase target
                  );
             }
        } else {
             console.error("GameLogic not available for repository button listeners.");
        }
    });
}

function setupPopupInteractionListeners() {
    // Generic Close Buttons (for all popups except Onboarding)
    document.querySelectorAll('.popup:not(.onboarding-popup) .close-button').forEach(button => {
         button.addEventListener('click', UI.hidePopups);
    });

    // Setup listeners specific to each popup type
    setupConceptDetailPopupListeners();
    setupResearchPopupListeners();
    setupReflectionPopupListeners();
    setupDeepDivePopupListeners();
    setupDilemmaPopupListeners();
    // Settings popup listeners are in setupGlobalEventListeners
    // Info popup listeners are in setupGlobalEventListeners
}

function setupConceptDetailPopupListeners() {
    const popup = getElement('conceptDetailPopup');
    if (!popup) { console.warn("Concept detail popup not found."); return; }

    const addBtn = getElement('addToGrimoireButton');
    const focusBtn = getElement('markAsFocusButton');
    const saveNoteBtn = getElement('saveMyNoteButton');
    const loreContent = getElement('popupLoreContent');
    const actionsContainer = popup.querySelector('.popup-actions'); // For sell button delegation

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (typeof GameLogic !== 'undefined' && GameLogic.getCurrentPopupConceptId && GameLogic.addConceptToGrimoireById) {
                const conceptId = GameLogic.getCurrentPopupConceptId();
                if (conceptId !== null) {
                    triggerActionAndCheckOnboarding(
                        () => GameLogic.addConceptToGrimoireById(conceptId, addBtn), // Pass button to update UI
                        'addToGrimoire',
                        4 // Phase 4 is adding first concept
                    );
                }
            } else { console.error("GameLogic functions for AddToGrimoire not available."); }
        });
    } else { console.warn("Add to Grimoire button not found in popup."); }

    if (focusBtn) {
        focusBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.handleToggleFocusConcept) {
                 triggerActionAndCheckOnboarding(
                     () => GameLogic.handleToggleFocusConcept(), // Calls logic which updates state and UI
                     'markFocus',
                     5 // Phase 5 is marking focus
                 );
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

    // Event delegation for Unlock Lore buttons
    if (loreContent) {
        loreContent.addEventListener('click', (event) => {
            const button = event.target.closest('.unlock-lore-button');
            if (button?.dataset.conceptId && button.dataset.loreLevel && button.dataset.cost && !button.disabled) {
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleUnlockLore) {
                      triggerActionAndCheckOnboarding(
                          () => GameLogic.handleUnlockLore(parseInt(button.dataset.conceptId), parseInt(button.dataset.loreLevel), parseFloat(button.dataset.cost)),
                          'unlockLore',
                          6 // Phase 6 is returning to Persona (lore might be visible there)
                      );
                 } else { console.error("GameLogic function handleUnlockLore not available."); }
            }
        });
    } else { console.warn("Lore content container not found in popup."); }

    // Event delegation for dynamically added Sell button
    if (actionsContainer) {
        actionsContainer.addEventListener('click', (event) => {
            const sellButton = event.target.closest('.popup-sell-button');
            if (sellButton?.dataset.conceptId) {
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleSellConcept) {
                      GameLogic.handleSellConcept(event); // Sell logic handles confirmation
                 } else { console.error("GameLogic function handleSellConcept not available."); }
            }
        });
    } else { console.warn("Popup actions container not found."); }
}


function setupResearchPopupListeners() {
    const popup = getElement('researchResultsPopup');
    if (!popup) { console.warn("Research results popup not found."); return; }

    const closeBtn = getElement('closeResearchResultsPopupButton');
    const confirmBtn = getElement('confirmResearchChoicesButton');
    const contentArea = getElement('researchPopupContent');

    if (closeBtn) closeBtn.addEventListener('click', UI.hidePopups);
    else { console.warn("Research results close button not found."); }

    if (confirmBtn) confirmBtn.addEventListener('click', UI.hidePopups); // Confirm button just closes if enabled
    else { console.warn("Research results confirm button not found."); }

    // Event delegation for Keep/Sell buttons within the research results
    if (contentArea) {
        contentArea.addEventListener('click', (event) => {
            const actionButton = event.target.closest('.card-actions .button[data-action]');
            if (actionButton?.dataset.conceptId) {
                const conceptId = parseInt(actionButton.dataset.conceptId);
                const action = actionButton.dataset.action; // 'keep' or 'sell'
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleResearchPopupChoice) {
                      if (action === 'keep') {
                          triggerActionAndCheckOnboarding(
                              () => GameLogic.handleResearchPopupChoice(conceptId, action),
                              'addToGrimoire', // 'keep' action ultimately calls addConceptToGrimoireInternal
                              4 // Phase 4 is adding first concept
                          );
                      } else {
                           GameLogic.handleResearchPopupChoice(conceptId, action); // Handle sell directly
                      }
                 } else { console.error("GameLogic function handleResearchPopupChoice not available."); }
            }
        });
    } else { console.warn("Research popup content area not found."); }
}

function setupReflectionPopupListeners() {
    const popup = getElement('reflectionModal');
    if (!popup) { console.warn("Reflection modal not found."); return; }

    const reflectionCheck = getElement('reflectionCheckbox');
    const confirmBtn = getElement('confirmReflectionButton');
    const nudgeCheck = getElement('scoreNudgeCheckbox');

    if (reflectionCheck && confirmBtn) {
        // Enable confirm button only when the checkbox is checked
        reflectionCheck.addEventListener('change', () => {
            confirmBtn.disabled = !reflectionCheck.checked;
        });

        confirmBtn.addEventListener('click', () => {
             if (typeof GameLogic !== 'undefined' && GameLogic.handleConfirmReflection) {
                  triggerActionAndCheckOnboarding(
                      () => GameLogic.handleConfirmReflection(nudgeCheck?.checked || false),
                      'completeReflection',
                      7 // Phase 7 is completing first reflection
                  );
             } else { console.error("GameLogic function handleConfirmReflection not available."); }
        });
    } else { console.warn("Reflection checkbox or confirm button not found."); }
}

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
                      if (nodeId === 'contemplation' && GameLogic.handleContemplationNodeClick) {
                          GameLogic.handleContemplationNodeClick();
                      } else if (GameLogic.handleDeepDiveNodeClick) {
                          GameLogic.handleDeepDiveNodeClick(nodeId);
                      } else { console.error("GameLogic deep dive handlers not available."); }
                 } else { console.error("GameLogic not available for deep dive node clicks."); }
            }
        });
    } else { console.warn("Deep dive nodes container not found."); }

     // Listener for dynamically added contemplation completion button
     if (detailContent) {
         detailContent.addEventListener('click', (event) => {
             const completeButton = event.target.closest('#completeContemplationBtn');
             if (completeButton) {
                 if (typeof GameLogic !== 'undefined' && GameLogic.handleCompleteContemplation) {
                     GameLogic.handleCompleteContemplation();
                 } else { console.error("GameLogic function handleCompleteContemplation not available."); }
             }
         });
     } else { console.warn("Deep dive detail content area not found."); }
}

function setupDilemmaPopupListeners() {
    const popup = getElement('dilemmaModal');
    if (!popup) { console.warn("Dilemma modal not found."); return; }

    const confirmBtn = getElement('confirmDilemmaButton');
    if (confirmBtn) {
         if (typeof GameLogic !== 'undefined' && GameLogic.handleConfirmDilemma) {
              confirmBtn.addEventListener('click', GameLogic.handleConfirmDilemma);
         } else { console.error("GameLogic function handleConfirmDilemma not available."); }
    } else { console.warn("Dilemma confirm button not found."); }

    // Add listener for slider to update display text
    const slider = getElement('dilemmaSlider');
    const valueDisplay = getElement('dilemmaSliderValueDisplay');
    const minLabel = getElement('dilemmaSliderMinLabel');
    const maxLabel = getElement('dilemmaSliderMaxLabel');
    if (slider && valueDisplay && minLabel && maxLabel) {
        slider.addEventListener('input', () => {
            const val = parseFloat(slider.value);
            let leaning;
            if (val < 1.5) leaning = `Strongly ${minLabel.textContent}`;
            else if (val < 4.5) leaning = `Towards ${minLabel.textContent}`;
            else if (val > 8.5) leaning = `Strongly ${maxLabel.textContent}`;
            else if (val > 5.5) leaning = `Towards ${maxLabel.textContent}`;
            else leaning = "Balanced";
            valueDisplay.textContent = leaning;
        });
    } else { console.warn("Dilemma slider components missing."); }
}

function setupOnboardingListeners() {
    const overlay = getElement('onboardingOverlay');
    if (!overlay) return; // No onboarding elements, no listeners needed

    const nextBtn = getElement('onboardingNextButton');
    const prevBtn = getElement('onboardingPrevButton');
    const skipBtn = getElement('onboardingSkipButton');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            if (currentPhase === Config.MAX_ONBOARDING_PHASE) {
                 // Last step, finish onboarding
                 console.log("Onboarding: Finishing...");
                 State.markOnboardingComplete();
                 UI.hideOnboarding();
                 // Ensure main UI reflects the now-unlocked state
                 UI.showScreen(State.getState().questionnaireCompleted ? 'personaScreen' : 'welcomeScreen'); // Show appropriate screen
            } else {
                 // Advance to the next phase
                 const nextPhase = State.advanceOnboardingPhase();
                 UI.showOnboarding(nextPhase);
            }
        });
    } else { console.warn("Onboarding next button not found."); }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            if (currentPhase > 1) { // Can't go back from phase 1
                 const prevPhase = currentPhase - 1;
                 State.updateOnboardingPhase(prevPhase); // Use the function to set specific phase
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
                 // Ensure main UI is correctly shown after skipping
                  UI.showScreen(State.getState().questionnaireCompleted ? 'personaScreen' : 'welcomeScreen'); // Show appropriate screen
            }
        });
    } else { console.warn("Onboarding skip button not found."); }
}


// --- App Start ---
document.addEventListener('DOMContentLoaded', initializeApp);

console.log("main.js loaded successfully. (Enhanced v4.1 + Drawer - Fixed)");
// --- END OF FILE main.js ---
