// --- START OF FILE main.js ---

// js/main.js - Application Entry Point & Event Listener Setup (Enhanced v4.1)

import * as UI from './js/ui.js';
import * as State from './js/state.js';
import * as GameLogic from './js/gameLogic.js';
import * as Utils from './js/utils.js';
import * as Config from './js/config.js';
import { onboardingTasks } from './data.js'; // Import onboarding tasks definitions

console.log("main.js loading... (Enhanced v4.1 - Onboarding, Debounce)");

// --- Initialization ---
function initializeApp() {
    console.log("Initializing Persona Alchemy Lab (v4.1)...");
    const loaded = State.loadGameState(); // Load state first
    UI.setupInitialUI(); // Sets initial screen visibility, nav state, theme etc.

    // Determine starting screen based on loaded state and onboarding status
    const currentState = State.getState();
    const onboardingPhase = currentState.onboardingPhase;
    const onboardingComplete = currentState.onboardingComplete;

    console.log(`Initial State: Onboarding Phase ${onboardingPhase}, Complete: ${onboardingComplete}, Questionnaire Complete: ${currentState.questionnaireCompleted}`);

    if (Config.ONBOARDING_ENABLED && !onboardingComplete && onboardingPhase > 0 && onboardingPhase <= Config.MAX_ONBOARDING_PHASE) {
        // Resume onboarding if it's enabled, incomplete, and within valid phase range
        console.log(`Resuming onboarding at phase ${onboardingPhase}.`);
        UI.showOnboarding(onboardingPhase);
        // Don't show main screen yet, onboarding overlay takes precedence
    } else if (loaded && currentState.questionnaireCompleted) {
        // Standard load: Questionnaire done, show Persona screen
        console.log("Loaded completed state. Showing Persona screen.");
        UI.showScreen('personaScreen'); // Show the screen first
        GameLogic.checkForDailyLogin(); // Check daily login after loading state
        UI.populateGrimoireFilters(); // Populate filters based on loaded concepts
        UI.displayMilestones(); // Display achieved milestones
        UI.displayDailyRituals(); // Display current rituals
        UI.updateInsightDisplays(); // Show current insight
        UI.updateFocusSlotsDisplay(); // Show focus slots
        UI.updateGrimoireCounter(); // Update counter
        UI.displayInsightLog(); // Display log if visible
    } else if (loaded && !currentState.questionnaireCompleted && currentState.currentElementIndex > -1) {
        // Loaded incomplete questionnaire state
        console.log("Loaded incomplete questionnaire state. Resuming questionnaire.");
        UI.showScreen('questionnaireScreen'); // UI.showScreen calls displayElementQuestions
    } else {
        // No saved state or starting completely fresh.
        console.log("No saved state or starting fresh. Showing welcome screen.");
        UI.showScreen('welcomeScreen');
        // If onboarding is enabled and hasn't started (phase 0 or 1 is default), trigger phase 1
        if (Config.ONBOARDING_ENABLED && !onboardingComplete && onboardingPhase === 1) {
             console.log("Starting onboarding automatically from phase 1.");
             UI.showOnboarding(1);
        }
    }

    // Setup General Event Listeners (always needed)
    setupGlobalEventListeners();
    setupNavigationListeners();
    setupPopupInteractionListeners();
    setupQuestionnaireListeners();
    setupPersonaScreenListeners();
    setupWorkshopScreenListeners();
    setupRepositoryListeners();
    setupOnboardingListeners(); // Add listeners for onboarding controls

    // Initial UI updates based on loaded/initial state
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter(); // Update counter on nav bar

    console.log("Initialization complete.");
}

// --- Helper to potentially advance onboarding after an action ---
// actionFn: The main game logic function to execute (can be null if only checking).
// actionName: A string identifier for the action (must match onboardingTasks[phase].track.action).
// targetPhase: The onboarding phase this action is expected to complete.
// actionValue: Optional value associated with the action (must match onboardingTasks[phase].track.value).
function triggerActionAndCheckOnboarding(actionFn, actionName, targetPhase, actionValue = null) {
    console.log(`Action Triggered: '${actionName}' (Target Phase: ${targetPhase}, Value: ${actionValue})`);

    // Execute the primary game action if provided
    if (actionFn) {
        try {
            actionFn();
        } catch (error) {
            console.error(`Error executing action function for '${actionName}':`, error);
            // Decide if onboarding check should still proceed or not
            // return; // Option: Stop if the action failed
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
            return;
        }

        let meetsCondition = false;
        // Check if the specific action condition is met (if provided in the task's track object)
        if (task.track) {
            if (task.track.action === actionName) {
                 // Condition met if action names match AND either no value is tracked,
                 // or the tracked value matches the provided actionValue.
                 meetsCondition = (!task.track.value || task.track.value === actionValue);
                 console.log(`Onboarding Check: Action '${actionName}' matches task action. Value check needed: ${!!task.track.value}. Provided: ${actionValue}. Condition met: ${meetsCondition}`);
            }
            // Could add checks for task.track.state here if needed later
            // else if (task.track.state === ...) { meetsCondition = ...; }
        } else {
            // If no track object, assume the action itself is the trigger (less specific)
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
}


// --- Event Listener Setup Functions ---

function setupGlobalEventListeners() {
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', UI.showSettings);
    } else { console.warn("Settings button not found."); }

    const closeSettingsBtn = document.getElementById('closeSettingsPopupButton');
    const forceSaveBtn = document.getElementById('forceSaveButton');
    const resetBtn = document.getElementById('resetAppButton');

    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (forceSaveBtn) forceSaveBtn.addEventListener('click', () => { State.saveGameState(true); UI.showTemporaryMessage("Game Saved!", 1500); });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (confirm("Are you SURE you want to reset all progress? This cannot be undone!")) {
            GameLogic.clearPopupState(); // Clear any lingering temp logic state
            State.clearGameState(); // Wipes state and localStorage
            initializeApp(); // Re-initialize the app state and UI
            UI.hidePopups(); // Ensure popups are hidden after reset
            UI.showTemporaryMessage("Progress Reset.", 2000);
        }
    });

    const closeMilestoneBtn = document.getElementById('closeMilestoneAlertButton');
    if (closeMilestoneBtn) closeMilestoneBtn.addEventListener('click', UI.hideMilestoneAlert);

    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.addEventListener('click', (event) => {
            // Prevent closing general popups if onboarding overlay is active and click is outside onboarding popup
            const onboardingOverlay = document.getElementById('onboardingOverlay');
            const onboardingPopup = document.getElementById('onboardingPopup');
            const isClickInsideOnboardingPopup = onboardingPopup && onboardingPopup.contains(event.target);

            if (onboardingOverlay?.classList.contains('visible') && !isClickInsideOnboardingPopup) {
                // If onboarding is visible and click is outside its popup, do nothing (don't close general popups)
                return;
            } else if (!onboardingOverlay?.classList.contains('visible')) {
                 // If onboarding is not visible, standard behavior: hide general popups
                 UI.hidePopups();
            }
        });
    }

     const closeInfoBtn = document.getElementById('closeInfoPopupButton');
     const confirmInfoBtn = document.getElementById('confirmInfoPopupButton');
     if (closeInfoBtn) closeInfoBtn.addEventListener('click', UI.hidePopups);
     if (confirmInfoBtn) confirmInfoBtn.addEventListener('click', UI.hidePopups);

    const addInsightBtn = document.getElementById('addInsightButton');
    if(addInsightBtn) {
        addInsightBtn.addEventListener('click', GameLogic.handleInsightBoostClick);
    } else { console.warn("Add Insight button not found."); }

    // Global listener for info icons
    document.body.addEventListener('click', (event) => {
        const target = event.target.closest('.info-icon');
        if (target?.title) {
            event.preventDefault(); // Prevent default tooltip potentially
            UI.showInfoPopup(target.title);
        }
    });
}

function setupNavigationListeners() {
    // Main Navigation Buttons (excluding theme toggle and settings)
    const navButtons = document.querySelectorAll('.main-nav .nav-button[data-target]');
    navButtons.forEach(button => {
        // No need to remove/re-add for static nav, just add once
        button.addEventListener('click', handleNavClick);
    });

    // Welcome Screen Buttons
    const startBtn = document.getElementById('startGuidedButton');
    const loadBtn = document.getElementById('loadButton');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            const onboardingComplete = State.isOnboardingComplete();
             // Start questionnaire only if onboarding is done or disabled, or past max phase
             if (!Config.ONBOARDING_ENABLED || onboardingComplete || currentPhase > Config.MAX_ONBOARDING_PHASE) {
                 UI.initializeQuestionnaireUI();
                 UI.showScreen('questionnaireScreen');
             } else {
                  // If onboarding isn't finished, prompt user to finish it
                  UI.showOnboarding(currentPhase); // Ensure current onboarding step is visible
                  UI.showTemporaryMessage("Let's finish the quick orientation first!", Config.TOAST_DURATION);
             }
        });
    }
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            if (State.loadGameState()) { // loadGameState returns true/false
                 initializeApp(); // Re-run initialization to show correct screen based on loaded state
                 UI.showTemporaryMessage("Session Loaded.", 2000);
            } else {
                // Load failed (error likely logged in State.loadGameState)
                UI.showTemporaryMessage("Failed to load session. Starting fresh.", 3000);
            }
        });
    }
}

function handleNavClick(event) {
    const button = event.target.closest('.nav-button[data-target]');
    if (!button) return; // Ignore clicks not on actual nav buttons with targets

    const targetScreen = button.dataset.target;
    if (!targetScreen) {
         console.warn("Nav button clicked without target screen:", button);
         return;
    }

    const isPostQuestionnaire = State.getState().questionnaireCompleted;
    const canNavigate = isPostQuestionnaire || ['welcomeScreen', 'questionnaireScreen'].includes(targetScreen); // Allow access to welcome/Q anytime

    if (canNavigate) {
         // Show the target screen immediately
         UI.showScreen(targetScreen);

         // Check if this screen change corresponds to an onboarding step completion
         let phaseTarget = null;
         if(targetScreen === 'personaScreen') phaseTarget = 1; // Target phase 1 (view Persona)
         else if(targetScreen === 'workshopScreen') phaseTarget = 2; // Target phase 2 (view Workshop)
         else if(targetScreen === 'repositoryScreen') phaseTarget = 8; // Target phase 8 (view Repository)

         if(phaseTarget !== null) {
              // Use the helper function - pass null actionFn as screen change is the trigger
              triggerActionAndCheckOnboarding(null, 'showScreen', phaseTarget, targetScreen);
         }

    } else {
        // Navigation blocked (likely trying to access Workshop/Repo before questionnaire)
        console.log("Navigation blocked: Questionnaire not complete.");
        UI.showTemporaryMessage("Complete the initial Experimentation first!", 2500);
    }
}

function setupQuestionnaireListeners() {
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);
    // Input listeners are added dynamically by UI.displayElementQuestions
}

function setupPersonaScreenListeners() {
    // View Toggle Buttons
    const detailedViewBtn = document.getElementById('showDetailedViewBtn');
    const summaryViewBtn = document.getElementById('showSummaryViewBtn');
    if (detailedViewBtn && summaryViewBtn) {
        detailedViewBtn.addEventListener('click', () => UI.togglePersonaView(true));
        summaryViewBtn.addEventListener('click', () => UI.togglePersonaView(false));
    }

    // Event Delegation for Element Details (Accordion Toggles, Unlock Buttons)
    const personaElementsContainer = document.getElementById('personaElementDetails');
    if (personaElementsContainer) {
        personaElementsContainer.addEventListener('click', (event) => {
            const unlockButton = event.target.closest('.unlock-button');
            const detailsToggle = event.target.closest('details.element-detail-entry > summary.element-detail-header'); // Target direct child summary
            const elaborationToggle = event.target.closest('.element-elaboration summary'); // Target elaboration summary

            if (unlockButton) {
                 // Use helper for onboarding check - target phase 6 for unlocking library
                triggerActionAndCheckOnboarding(() => GameLogic.handleUnlockLibraryLevel(event), 'unlockLibrary', 6);
            } else if (detailsToggle) {
                 // Check if opening phase 1 task element (Persona Screen exploration)
                 // We only advance if the *Persona screen* itself was the target (Phase 1)
                 const parentDetails = detailsToggle.closest('details.element-detail-entry');
                 if(parentDetails) {
                      // No specific actionFn needed, just check if opening satisfies the phase
                      triggerActionAndCheckOnboarding(null, 'openElementDetails', 1);
                 }
            } else if (elaborationToggle) {
                 // Optional: Track opening elaboration if needed for future onboarding
                 // console.log('Elaboration toggled');
            }
        });
    }

    // Event Delegation for Focused Concepts (Click to view details)
    const focusedConceptsContainer = document.getElementById('focusedConceptsDisplay');
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
    }

     // Insight Log Toggle
     const insightLogContainer = document.getElementById('insightLogContainer');
     if (insightLogContainer) {
         // Target the "Resources" H2 more reliably
         const header = document.querySelector('#personaDetailedView .persona-elements-detailed h2:nth-of-type(2)');
         if (header && header.textContent.includes("Resources")) {
             header.style.cursor = 'pointer';
             header.title = 'Click to toggle Insight Log';
             header.addEventListener('click', () => {
                 insightLogContainer.classList.toggle('log-hidden');
                 // Update header style slightly when open? (optional)
                 // header.classList.toggle('log-toggled-open', !insightLogContainer.classList.contains('log-hidden'));
             });
             // Ensure it's hidden initially if the class is present
             if (insightLogContainer.classList.contains('log-hidden')) {
                 // Ensure display is none if hidden by class initially
                 insightLogContainer.style.display = 'none';
             }
             // Add listener to toggle display style along with class
             const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const isHidden = insightLogContainer.classList.contains('log-hidden');
                        insightLogContainer.style.display = isHidden ? 'none' : 'block';
                    }
                });
             });
             observer.observe(insightLogContainer, { attributes: true });

         } else { console.warn("Could not find 'Resources' header to attach Insight Log toggle."); }
     }

    // Persona Action Buttons
    const dilemmaBtn = document.getElementById('elementalDilemmaButton');
    const synergyBtn = document.getElementById('exploreSynergyButton');
    const suggestSceneBtn = document.getElementById('suggestSceneButton');
    const deepDiveBtn = document.getElementById('deepDiveTriggerButton');

    if (dilemmaBtn) dilemmaBtn.addEventListener('click', GameLogic.handleElementalDilemmaClick);
    if (synergyBtn) synergyBtn.addEventListener('click', GameLogic.handleExploreSynergyClick);
    if (suggestSceneBtn) suggestSceneBtn.addEventListener('click', GameLogic.handleSuggestSceneClick);
    if (deepDiveBtn) deepDiveBtn.addEventListener('click', GameLogic.showTapestryDeepDive);

    // Event Delegation for Suggested Scene Meditate Button
    const suggestedSceneContainer = document.getElementById('suggestedSceneContent');
     if (suggestedSceneContainer) {
         suggestedSceneContainer.addEventListener('click', (event) => {
            const meditateButton = event.target.closest('.button[data-scene-id]');
             if (meditateButton && !meditateButton.disabled) {
                 GameLogic.handleMeditateScene(event);
             }
         });
     }
}

function setupWorkshopScreenListeners() {
    const workshopScreen = document.getElementById('workshopScreen');
    if (!workshopScreen) return;

    // --- Research Bench --- (Event Delegation)
    const researchButtonsContainer = document.getElementById('element-research-buttons');
    if (researchButtonsContainer) {
        researchButtonsContainer.addEventListener('click', (event) => {
            // Target the clickable element card, not just the button inside
            const buttonCard = event.target.closest('.initial-discovery-element.clickable');
            if (buttonCard?.dataset.elementKey) {
                const isFreeClick = State.getInitialFreeResearchRemaining() > 0;
                 // Use helper for onboarding check - Target phase 3
                 triggerActionAndCheckOnboarding(
                     () => GameLogic.handleResearchClick({ currentTarget: buttonCard, isFree: isFreeClick }),
                     'conductResearch', // Action name matches onboarding task
                     3 // Target phase
                 );
            }
        });
    }

    // --- Daily Actions ---
    const freeResearchBtn = document.getElementById('freeResearchButtonWorkshop');
    const seekGuidanceBtn = document.getElementById('seekGuidanceButtonWorkshop');
    if (freeResearchBtn) {
        freeResearchBtn.addEventListener('click', () => {
            // Daily meditation might also trigger phase 3 if it's the first research
            triggerActionAndCheckOnboarding(GameLogic.handleFreeResearchClick, 'conductResearch', 3);
        });
    }
    if (seekGuidanceBtn) {
        seekGuidanceBtn.addEventListener('click', () => {
             // Use helper for onboarding check - Target phase 7 (Seek Guidance -> Reflection)
            triggerActionAndCheckOnboarding(GameLogic.triggerGuidedReflection, 'triggerReflection', 7);
        });
    }

    // --- Library Area ---
    const controls = document.getElementById('grimoire-controls-workshop');
    const shelves = document.getElementById('grimoire-shelves-workshop');
    const grid = document.getElementById('grimoire-grid-workshop');

    // Filter/Sort Controls
    if (controls) {
        const searchInput = document.getElementById('grimoireSearchInputWorkshop');
        if (searchInput) {
             const debouncedRefresh = Utils.debounce(() => UI.refreshGrimoireDisplay(), 350); // Slightly longer debounce
             searchInput.addEventListener('input', debouncedRefresh);
        }
        // Refresh immediately on other control changes (select dropdowns)
        controls.addEventListener('change', (event) => {
             if (event.target.tagName === 'SELECT') {
                 UI.refreshGrimoireDisplay();
             }
        });
    }

    // Shelf Clicks (Filtering & Potential Onboarding Check for Categorization - handled on drop)
    if (shelves) {
        shelves.addEventListener('click', (event) => {
            const shelf = event.target.closest('.grimoire-shelf');
            if (shelf?.dataset.categoryId) {
                // Visually activate the clicked shelf
                shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('active-shelf'));
                shelf.classList.add('active-shelf');
                // Refresh the display filtered by this category
                UI.refreshGrimoireDisplay({ filterCategory: shelf.dataset.categoryId });
            }
        });
    }

    // Grimoire Grid Interactions (Details, Focus, Sell, Drag/Drop) - Using Event Delegation
    if (grid) {
        // Click Actions
        grid.addEventListener('click', (event) => {
            const focusButton = event.target.closest('.card-focus-button');
            const sellButton = event.target.closest('.card-sell-button');
            const card = event.target.closest('.concept-card');

            if (focusButton?.dataset.conceptId && !focusButton.disabled) {
                event.stopPropagation(); // Prevent card click from firing
                const conceptId = parseInt(focusButton.dataset.conceptId);
                 // Use helper for onboarding check - Target phase 5
                 triggerActionAndCheckOnboarding(() => {
                     // GameLogic handles state, UI update happens after
                     if(GameLogic.handleCardFocusToggle(conceptId)) {
                         // Update button state immediately after successful toggle
                         const isFocused = State.getFocusedConcepts().has(conceptId);
                         focusButton.classList.toggle('marked', isFocused);
                         focusButton.innerHTML = `<i class="fas ${isFocused ? 'fa-star' : 'fa-regular fa-star'}"></i>`;
                         focusButton.title = isFocused ? 'Remove Focus' : 'Mark as Focus';
                     }
                 }, 'markFocus', 5);
            } else if (sellButton?.dataset.conceptId) {
                 event.stopPropagation(); // Prevent card click
                 GameLogic.handleSellConcept(event); // Sell logic handles confirmation etc.
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
                // Use standard text data transfer
                try { event.dataTransfer.setData('text/plain', draggedCardId.toString()); } catch (e) { /* Handle potential IE legacy needs if required */ event.dataTransfer.setData('Text', draggedCardId.toString()); }
                // Add dragging style slightly after drag starts for better visual feedback
                setTimeout(() => card.classList.add('dragging'), 0);
            } else {
                event.preventDefault(); // Prevent dragging if not a valid card
            }
        });

        grid.addEventListener('dragend', (event) => {
            const card = event.target.closest('.concept-card');
            if (card) { card.classList.remove('dragging'); }
            // Clear dragged ID and remove hover states from shelves
            draggedCardId = null;
            shelves?.querySelectorAll('.grimoire-shelf').forEach(shelf => shelf.classList.remove('drag-over'));
        });

        // Shelf Drag Listeners (for dropping cards onto shelves)
        if (shelves) {
            shelves.addEventListener('dragover', (event) => {
                event.preventDefault(); // Necessary to allow dropping
                const shelf = event.target.closest('.grimoire-shelf:not(.show-all-shelf)'); // Can't drop on "Show All"
                if (shelf) {
                    event.dataTransfer.dropEffect = 'move';
                    // Highlight the potential drop target
                    shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over'));
                    shelf.classList.add('drag-over');
                } else {
                    event.dataTransfer.dropEffect = 'none'; // Indicate invalid drop target
                    shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over'));
                }
            });

            shelves.addEventListener('dragleave', (event) => {
                const shelf = event.target.closest('.grimoire-shelf');
                 // Only remove highlight if leaving the shelf element itself or the container entirely
                 if (shelf && !shelf.contains(event.relatedTarget)) { shelf.classList.remove('drag-over'); }
                 if (event.currentTarget === shelves && !shelves.contains(event.relatedTarget)){
                     shelves.querySelectorAll('.grimoire-shelf').forEach(s => s.classList.remove('drag-over'));
                 }
            });

            shelves.addEventListener('drop', (event) => {
                event.preventDefault();
                shelves.querySelectorAll('.grimoire-shelf').forEach(shelf => shelf.classList.remove('drag-over')); // Clear all highlights
                const shelf = event.target.closest('.grimoire-shelf:not(.show-all-shelf)');

                // Retrieve card ID reliably
                let droppedCardIdFromData = null;
                try { droppedCardIdFromData = parseInt(event.dataTransfer.getData('text/plain')); } catch (e) { try { droppedCardIdFromData = parseInt(event.dataTransfer.getData('Text')); } catch (e2) { /* ignore fallback error */ } }
                // Use ID from data transfer if valid, otherwise fallback to the ID stored during dragstart
                const finalCardId = !isNaN(droppedCardIdFromData) ? droppedCardIdFromData : draggedCardId;

                if (shelf?.dataset.categoryId && finalCardId !== null) {
                    const categoryId = shelf.dataset.categoryId;
                    // Use onboarding helper - Check if categorizing fulfills phase 5 (same phase as focus)
                    triggerActionAndCheckOnboarding(
                        () => GameLogic.handleCategorizeCard(finalCardId, categoryId),
                        'categorizeCard',
                        5 // Target phase (Mark Focus/Categorize share a phase target in original logic)
                    );
                } else {
                    console.log("Drop failed: Invalid target shelf or missing card ID.");
                }
                draggedCardId = null; // Reset dragged ID after drop attempt
            });
        }
    }
}

function setupRepositoryListeners() {
    const repoContainer = document.getElementById('repositoryScreen');
    if (!repoContainer) return;

    // Event delegation for action buttons within repository lists
    repoContainer.addEventListener('click', (event) => {
        const meditateButton = event.target.closest('.button[data-scene-id]');
        const experimentButton = event.target.closest('.button[data-experiment-id]');

        if (meditateButton && !meditateButton.disabled) {
            GameLogic.handleMeditateScene(event);
        }
        else if (experimentButton && !experimentButton.disabled) {
            GameLogic.handleAttemptExperiment(event);
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
    const popup = document.getElementById('conceptDetailPopup');
    if (!popup) return;

    const addBtn = document.getElementById('addToGrimoireButton');
    const focusBtn = document.getElementById('markAsFocusButton');
    const saveNoteBtn = document.getElementById('saveMyNoteButton');
    const loreContent = document.getElementById('popupLoreContent');
    const actionsContainer = popup.querySelector('.popup-actions'); // For sell button delegation

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const conceptId = GameLogic.getCurrentPopupConceptId();
            if (conceptId !== null) {
                // Pass action to helper for onboarding check - Target phase 4
                triggerActionAndCheckOnboarding(
                    () => GameLogic.addConceptToGrimoireById(conceptId, addBtn), // Pass button to update UI
                    'addToGrimoire',
                    4
                );
            }
        });
    }

    if (focusBtn) {
        focusBtn.addEventListener('click', () => {
            // Pass action to helper for onboarding check - Target phase 5
            triggerActionAndCheckOnboarding(
                () => GameLogic.handleToggleFocusConcept(), // Calls logic which updates state and UI
                'markFocus',
                5
            );
        });
    }

    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);
    }

    // Event delegation for Unlock Lore buttons
    if (loreContent) {
        loreContent.addEventListener('click', (event) => {
            const button = event.target.closest('.unlock-lore-button');
            if (button?.dataset.conceptId && button.dataset.loreLevel && button.dataset.cost && !button.disabled) {
                 // Check onboarding phase 6 for unlocking lore
                triggerActionAndCheckOnboarding(
                     () => GameLogic.handleUnlockLore(parseInt(button.dataset.conceptId), parseInt(button.dataset.loreLevel), parseFloat(button.dataset.cost)),
                     'unlockLore',
                     6
                 );
            }
        });
    }

    // Event delegation for dynamically added Sell button
    if (actionsContainer) {
        actionsContainer.addEventListener('click', (event) => {
            const sellButton = event.target.closest('.popup-sell-button');
            if (sellButton?.dataset.conceptId) {
                GameLogic.handleSellConcept(event); // Sell logic handles confirmation
            }
        });
    }
}


function setupResearchPopupListeners() {
    const popup = document.getElementById('researchResultsPopup');
    if (!popup) return;

    const closeBtn = document.getElementById('closeResearchResultsPopupButton');
    const confirmBtn = document.getElementById('confirmResearchChoicesButton');
    const contentArea = document.getElementById('researchPopupContent');

    if (closeBtn) closeBtn.addEventListener('click', UI.hidePopups);
    if (confirmBtn) confirmBtn.addEventListener('click', UI.hidePopups); // Confirm button just closes if enabled

    // Event delegation for Keep/Sell buttons within the research results
    if (contentArea) {
        contentArea.addEventListener('click', (event) => {
            const actionButton = event.target.closest('.card-actions .button[data-action]');
            if (actionButton?.dataset.conceptId) {
                const conceptId = parseInt(actionButton.dataset.conceptId);
                const action = actionButton.dataset.action; // 'keep' or 'sell'

                 // Wrap the action for onboarding check if it's a 'keep' action - Target phase 4
                 if (action === 'keep') {
                     triggerActionAndCheckOnboarding(
                         () => GameLogic.handleResearchPopupChoice(conceptId, action),
                         'addToGrimoire', // 'keep' action ultimately calls addConceptToGrimoireInternal
                         4
                     );
                 } else {
                      GameLogic.handleResearchPopupChoice(conceptId, action); // Handle sell directly
                 }
            }
        });
    }
}

function setupReflectionPopupListeners() {
    const popup = document.getElementById('reflectionModal');
    if (!popup) return;

    const reflectionCheck = document.getElementById('reflectionCheckbox');
    const confirmBtn = document.getElementById('confirmReflectionButton');
    const nudgeCheck = document.getElementById('scoreNudgeCheckbox');

    if (reflectionCheck && confirmBtn) {
        // Enable confirm button only when the checkbox is checked
        reflectionCheck.addEventListener('change', () => {
            confirmBtn.disabled = !reflectionCheck.checked;
        });

        confirmBtn.addEventListener('click', () => {
             // Wrap for onboarding check - Target phase 7
             triggerActionAndCheckOnboarding(
                 () => GameLogic.handleConfirmReflection(nudgeCheck?.checked || false),
                 'completeReflection',
                 7
             );
        });
    }
}

function setupDeepDivePopupListeners() {
    const popup = document.getElementById('tapestryDeepDiveModal');
    if (!popup) return;

    const nodesContainer = document.getElementById('deepDiveAnalysisNodes');
    const detailContent = document.getElementById('deepDiveDetailContent');

    if (nodesContainer) {
        nodesContainer.addEventListener('click', (event) => {
            const nodeButton = event.target.closest('.aspect-node[data-node-id]');
            if (nodeButton && !nodeButton.disabled) {
                 const nodeId = nodeButton.dataset.nodeId;
                 if (nodeId === 'contemplation') {
                     GameLogic.handleContemplationNodeClick();
                 } else {
                     GameLogic.handleDeepDiveNodeClick(nodeId);
                 }
            }
        });
    }

     // Listener for completing the contemplation task is added dynamically by UI.displayContemplationTask
     if (detailContent) {
         detailContent.addEventListener('click', (event) => {
             const completeButton = event.target.closest('#completeContemplationBtn');
             if (completeButton) {
                 // The task data should be associated with the button or retrieved differently
                 // Assuming GameLogic can retrieve the current task data
                 GameLogic.handleCompleteContemplation(); // Modify this if task data needs passing
             }
         });
     }
}

function setupDilemmaPopupListeners() {
    const popup = document.getElementById('dilemmaModal');
    if (!popup) return;

    const confirmBtn = document.getElementById('confirmDilemmaButton');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', GameLogic.handleConfirmDilemma);
    }

    // Add listener for slider to update display text
    const slider = document.getElementById('dilemmaSlider');
    const valueDisplay = document.getElementById('dilemmaSliderValueDisplay');
    const minLabel = document.getElementById('dilemmaSliderMinLabel');
    const maxLabel = document.getElementById('dilemmaSliderMaxLabel');
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
    }
}

function setupOnboardingListeners() {
    const overlay = document.getElementById('onboardingOverlay');
    if (!overlay) return; // No onboarding elements, no listeners needed

    const nextBtn = document.getElementById('onboardingNextButton');
    const prevBtn = document.getElementById('onboardingPrevButton');
    const skipBtn = document.getElementById('onboardingSkipButton');

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
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentPhase = State.getOnboardingPhase();
            if (currentPhase > 1) { // Can't go back from phase 1
                 const prevPhase = currentPhase - 1;
                 State.updateOnboardingPhase(prevPhase); // Use the function to set specific phase
                 UI.showOnboarding(prevPhase);
            }
        });
    }

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
    }
}


// --- App Start ---
document.addEventListener('DOMContentLoaded', initializeApp);

// --- Dark Mode Persistence & Toggle ---
(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Apply saved theme on initial load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
      root.classList.add('dark');
  } else {
      root.classList.remove('dark'); // Ensure default is light if no setting
  }

  // Set up toggle button listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      const currentTheme = root.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', currentTheme);
       // Redraw chart if visible, as colors change
      if (document.getElementById('personaSummaryView')?.classList.contains('current')) {
        UI.drawPersonaChart(State.getScores());
      }
    });
  } else {
      console.warn("Theme toggle button not found.");
  }
})();


console.log("main.js loaded successfully. (Enhanced v4.1)");
// --- END OF FILE main.js ---
