function attachEventListeners() {
    console.log("Attaching event listeners...");

    // *** MOVED ALL ELEMENT DECLARATIONS TO THE TOP ***
    const startButton = document.getElementById('startGuidedButton');
    const loadButton = document.getElementById('loadButton');
    const nextBtn = document.getElementById('nextElementButton');
    const prevBtn = document.getElementById('prevElementButton');
    const navButtons = document.querySelectorAll('.nav-button');
    const settingsBtn = document.getElementById('settingsButton');
    const closePopupBtn = document.getElementById('closePopupButton');
    const overlay = document.getElementById('popupOverlay'); // Declared early
    const closeReflectionBtn = document.getElementById('closeReflectionModalButton');
    const closeSettingsBtn = document.getElementById('closeSettingsPopupButton');
    const closeMilestoneBtn = document.getElementById('closeMilestoneAlertButton');
    const closeDeepDiveBtn = document.getElementById('closeDeepDiveButton');
    const popupActionsDiv = document.querySelector('#conceptDetailPopup .popup-actions');
    const evolveBtn = document.getElementById('evolveArtButton');
    const saveNoteBtn = document.getElementById('saveMyNoteButton');
    const grimoireControls = document.getElementById('grimoireControls');
    const grimoireContent = document.getElementById('grimoireContent');
    const reflectionCheck = document.getElementById('reflectionCheckbox');
    const confirmReflectionBtn = document.getElementById('confirmReflectionButton');
    const researchContainer = document.getElementById('researchButtonContainer');
    const freeResearchBtn = document.getElementById('freeResearchButton');
    const guidanceBtn = document.getElementById('seekGuidanceButton');
    const researchOutputArea = document.getElementById('researchOutput');
    const personaElementDetails = document.getElementById('personaElementDetails');
    const repositoryContainer = document.getElementById('repositoryScreen');
    const forceSaveBtn = document.getElementById('forceSaveButton');
    const resetBtn = document.getElementById('resetAppButton');
    const detailedViewBtn = document.getElementById('showDetailedViewBtn');
    const summaryViewBtn = document.getElementById('showSummaryViewBtn');
    const personaDetailedDiv = document.getElementById('personaDetailedView');
    const personaSummaryDiv = document.getElementById('personaSummaryView');
    const personaScreenDiv = document.getElementById('personaScreen');
    const deepDiveNodesContainer = document.getElementById('deepDiveAnalysisNodes');
    const closeInfoBtn = document.getElementById('closeInfoPopupButton'); // Add info popup buttons
    const confirmInfoBtn = document.getElementById('confirmInfoPopupButton');
    const infoPopup = document.getElementById('infoPopup');
    // *** END OF MOVED DECLARATIONS ***


    // --- Delegated Click Listener for Info Icons ---
    document.body.addEventListener('click', (event) => {
        const infoIcon = event.target.closest('.info-icon');
        if (infoIcon) {
            event.preventDefault(); // Prevent any default action if icon is inside a link/button
            event.stopPropagation(); // Stop propagation to avoid unintended side effects
            const message = infoIcon.getAttribute('title');
            // Now infoPopup and overlay are guaranteed to be initialized (if they exist in HTML)
            if (message && infoPopup && overlay) {
                 const infoContent = document.getElementById('infoPopupContent'); // Get content element here
                 if(infoContent){
                    infoContent.textContent = message;
                    infoPopup.classList.remove('hidden');
                    overlay.classList.remove('hidden');
                 } else {
                    console.warn("Info popup content element missing.");
                    UI.showTemporaryMessage(message, 4000); // Fallback
                 }
            } else {
                console.warn("Could not display info popup. Message or elements missing.");
                if(message) UI.showTemporaryMessage(message, 4000); // Fallback to toast if popup fails
            }
        }
    });

    // Add listeners to close the info popup
    const hideInfoPopup = () => {
        if (infoPopup) infoPopup.classList.add('hidden');
        // Check if any *other* popups are open before hiding overlay
        const otherPopups = document.querySelectorAll('.popup:not(#infoPopup):not(.hidden)');
        if (otherPopups.length === 0 && overlay) { // Check overlay exists here
            overlay.classList.add('hidden');
        }
    };

    if (closeInfoBtn) closeInfoBtn.addEventListener('click', hideInfoPopup);
    if (confirmInfoBtn) confirmInfoBtn.addEventListener('click', hideInfoPopup); // OK button also closes
    // --- End Info Icon Handling ---


    // --- Original Event Listeners (Now guaranteed to have elements declared) ---

    // Welcome Screen
    if (startButton) startButton.addEventListener('click', () => {
        State.clearGameState(); // Clears state and initializes userAnswers correctly
        UI.initializeQuestionnaireUI();
        UI.showScreen('questionnaireScreen');
        if(loadButton) loadButton.classList.add('hidden');
    });
    if (loadButton && !loadButton.classList.contains('hidden')) {
        loadButton.addEventListener('click', () => {
            if(State.loadGameState()){ // Reload state
                UI.updateInsightDisplays(); // Update UI after load
                if (State.getState().questionnaireCompleted) {
                    GameLogic.checkForDailyLogin();
                    UI.applyOnboardingPhaseUI(State.getOnboardingPhase());
                    GameLogic.calculateTapestryNarrative(true);
                    UI.updateFocusSlotsDisplay();
                    UI.updateGrimoireCounter();
                    UI.populateGrimoireFilters();
                    UI.refreshGrimoireDisplay();
                    UI.setupInitialUI();
                    UI.showScreen('personaScreen');
                    UI.hidePopups();
                }
                else {
                    State.updateElementIndex(0); // Reset index if questionnaire incomplete
                    UI.initializeQuestionnaireUI();
                    UI.showScreen('questionnaireScreen');
                }
                loadButton.classList.add('hidden');
            } else {
                 UI.showTemporaryMessage("Load failed. Starting new.", 3000);
                 State.clearGameState();
                 UI.initializeQuestionnaireUI();
                 UI.showScreen('questionnaireScreen');
                 loadButton.classList.add('hidden');
             }
        });
    }

    // Questionnaire Navigation
    if (nextBtn) nextBtn.addEventListener('click', GameLogic.goToNextElement);
    if (prevBtn) prevBtn.addEventListener('click', GameLogic.goToPrevElement);

    // Main Navigation
    navButtons.forEach(button => {
        if(!button.classList.contains('settings-button')) {
            button.addEventListener('click', () => {
                const target = button.dataset.target;
                if (target) { UI.showScreen(target); } // Let showScreen handle logic calls
            });
        }
    });
    if (settingsBtn) settingsBtn.addEventListener('click', UI.showSettings);

    // Popups & Modals Close Buttons
    if (closePopupBtn) closePopupBtn.addEventListener('click', UI.hidePopups);
    // *** IMPORTANT: Check overlay *exists* before adding listener ***
    if (overlay) {
        overlay.addEventListener('click', () => {
            // If the info popup is the only one open, close it specifically
             if (infoPopup && !infoPopup.classList.contains('hidden')) {
                 const otherPopups = document.querySelectorAll('.popup:not(#infoPopup):not(.hidden)');
                 if (otherPopups.length === 0) {
                     hideInfoPopup(); // Close info popup if it's the only one
                     return; // Prevent hidePopups from running unnecessarily
                 }
             }
             // Otherwise, let the general hidePopups handle other cases
             UI.hidePopups();
        });
    } else { console.error("Popup Overlay element not found!"); } // Added error log

    if (closeReflectionBtn) closeReflectionBtn.addEventListener('click', UI.hidePopups);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', UI.hidePopups);
    if (closeMilestoneBtn) closeMilestoneBtn.addEventListener('click', UI.hideMilestoneAlert);
    if (closeDeepDiveBtn) closeDeepDiveBtn.addEventListener('click', UI.hidePopups);
    else console.warn("Deep Dive Modal Close Button not found.");

    // Concept Detail Popup Actions (Delegation)
    if (popupActionsDiv) {
         popupActionsDiv.addEventListener('click', (event) => {
               const button = event.target.closest('button'); if (!button) return;
               const conceptId = GameLogic.getCurrentPopupConceptId();
               if (button.id === 'addToGrimoireButton' && conceptId !== null) GameLogic.addConceptToGrimoireById(conceptId, button);
               else if (button.id === 'markAsFocusButton' && conceptId !== null) GameLogic.handleToggleFocusConcept();
               else if (button.classList.contains('popup-sell-button') && conceptId !== null) GameLogic.handleSellConcept(event);
         });
    }

    // Evolve Button
    if (evolveBtn) evolveBtn.addEventListener('click', GameLogic.attemptArtEvolution);

    // Save Note Button
    if (saveNoteBtn) saveNoteBtn.addEventListener('click', GameLogic.handleSaveNote);

    // Grimoire Filters & Card Interaction (Delegation)
    if (grimoireControls) { grimoireControls.addEventListener('change', UI.refreshGrimoireDisplay); grimoireControls.addEventListener('input', UI.refreshGrimoireDisplay); /* Refresh on search input too */ }
    if (grimoireContent) {
        grimoireContent.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button');
            if (!targetButton) return; // Ignore clicks not on buttons

            const conceptIdStr = targetButton.dataset.conceptId;
            if (conceptIdStr) {
                const conceptId = parseInt(conceptIdStr);
                if (!isNaN(conceptId)) {
                    if (targetButton.classList.contains('card-sell-button')) {
                        event.stopPropagation(); // Prevent card click
                        GameLogic.handleSellConcept(event);
                    } else if (targetButton.classList.contains('card-focus-button')) {
                        event.stopPropagation(); // Prevent card click
                        GameLogic.handleCardFocusToggle(conceptId); // Call the new handler
                    }
                }
            }
        });
    }

    // Reflection Modal
    if (reflectionCheck) reflectionCheck.addEventListener('change', () => { if(confirmReflectionBtn) confirmReflectionBtn.disabled = !reflectionCheck.checked; });
    if (confirmReflectionBtn) confirmReflectionBtn.addEventListener('click', () => { const nudgeCheckbox = document.getElementById('scoreNudgeCheckbox'); GameLogic.handleConfirmReflection(nudgeCheckbox ? nudgeCheckbox.checked : false); });

    // Study Actions
    if (researchContainer) { researchContainer.addEventListener('click', (event) => { const button = event.target.closest('.research-button'); if (button) GameLogic.handleResearchClick({ currentTarget: button }); }); }
    if (freeResearchBtn) freeResearchBtn.addEventListener('click', GameLogic.handleFreeResearchClick);
    if (guidanceBtn) guidanceBtn.addEventListener('click', GameLogic.triggerGuidedReflection);

    // Research Output Actions (Delegation)
    if (researchOutputArea) {
        researchOutputArea.addEventListener('click', (event) => {
            const button = event.target.closest('button'); if (!button) return;
            const conceptIdStr = button.dataset.conceptId; if (!conceptIdStr) return; const conceptId = parseInt(conceptIdStr); if (isNaN(conceptId)) return;
            if (button.classList.contains('add-button')) GameLogic.addConceptToGrimoireById(conceptId, button);
            else if (button.classList.contains('sell-button')) GameLogic.handleSellConcept(event);
        });
    }

     // Integrated Element Deep Dive Unlock (Delegation)
     if (personaElementDetails) {
         personaElementDetails.addEventListener('click', (event) => {
             if (event.target.matches('.unlock-button')) {
                 GameLogic.handleUnlockLibraryLevel(event);
             }
         });
     } else { console.warn("Persona Element Details container not found for Deep Dive Unlock delegation."); }

     // Repository Actions (Delegation)
     if (repositoryContainer) {
         repositoryContainer.addEventListener('click', (event) => {
             const button = event.target.closest('button'); if (!button) return;
             if (button.dataset.sceneId) { GameLogic.handleMeditateScene(event); }
             else if (button.dataset.experimentId) { GameLogic.handleAttemptExperiment(event); }
         });
     } else { console.warn("Repository Screen container not found for delegation."); }

    // Settings Popup Actions
    if (forceSaveBtn) forceSaveBtn.addEventListener('click', () => { State.saveGameState(); UI.showTemporaryMessage("Game Saved!", 1500); });
    if (resetBtn) resetBtn.addEventListener('click', () => { if (confirm("Reset ALL progress? This cannot be undone.")) { console.log("Resetting application..."); State.clearGameState(); UI.setupInitialUI(); UI.hidePopups(); UI.showTemporaryMessage("Progress Reset!", 3000); const loadBtn = document.getElementById('loadButton'); if(loadBtn) loadBtn.classList.add('hidden'); } });

     // Persona View Toggle Buttons
     if(detailedViewBtn && summaryViewBtn && personaDetailedDiv && personaSummaryDiv) {
          detailedViewBtn.addEventListener('click', () => { personaDetailedDiv.classList.add('current'); personaDetailedDiv.classList.remove('hidden'); personaSummaryDiv.classList.add('hidden'); personaSummaryDiv.classList.remove('current'); detailedViewBtn.classList.add('active'); summaryViewBtn.classList.remove('active'); });
          summaryViewBtn.addEventListener('click', () => { personaSummaryDiv.classList.add('current'); personaSummaryDiv.classList.remove('hidden'); personaDetailedDiv.classList.add('hidden'); personaDetailedDiv.classList.remove('current'); summaryViewBtn.classList.add('active'); detailedViewBtn.classList.remove('active'); UI.displayPersonaSummary(); });
     }

    // Persona Screen Specific Button Delegation
    if (personaScreenDiv) {
        personaScreenDiv.addEventListener('click', (event) => {
            const button = event.target.closest('button'); if (!button) return;
            if (button.id === 'exploreTapestryButton') GameLogic.showTapestryDeepDive();
            else if (button.id === 'suggestSceneButton') GameLogic.handleSuggestSceneClick();
        });
    } else { console.warn("Persona Screen container not found for button delegation."); }

    // Delegated Listener for Deep Dive Analysis Nodes
    if (deepDiveNodesContainer) {
        deepDiveNodesContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.deep-dive-node'); if (!button) return;
            const nodeId = button.dataset.nodeId;
            if (nodeId === 'contemplation') {
                 const now = Date.now(); const cooldownEnd = State.getContemplationCooldownEnd();
                 if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); UI.showTemporaryMessage(`Contemplation available in ${remaining}s.`, 3000); return; }
                 GameLogic.handleContemplationNodeClick();
            } else if (nodeId && nodeId !== 'keyword') { GameLogic.handleDeepDiveNodeClick(nodeId); }
        });
    } else { console.warn("Deep Dive Analysis Nodes Container not found."); }

    // Final log inside the function
    console.log("Event listeners attached.");

} // <<< Correct closing brace for attachEventListeners

// --- Start the App ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log("main.js loaded.");
