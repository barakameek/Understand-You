// js/state.js - Manages Application State and Persistence
import * as Config from './config.js';
// Assuming elementNames might still be needed elsewhere, keeping import for now.
// If not used AT ALL in this file after refactor, it can be removed later.
import { elementNames } from '../data.js';

console.log("state.js loading...");

// Default game state structure
const createInitialGameState = () => {
    const initial = {
        userScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 },
        userAnswers: {}, // Initialize as empty object
        discoveredConcepts: new Map(),
        focusedConcepts: new Set(),
        focusSlotsTotal: Config.INITIAL_FOCUS_SLOTS,
        userInsight: Config.INITIAL_INSIGHT,
        elementAttunement: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
        unlockedDeepDiveLevels: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
        achievedMilestones: new Set(),
        completedRituals: { daily: {}, weekly: {} },
        lastLoginDate: null,
        freeResearchAvailableToday: false,
        seenPrompts: new Set(),
        currentElementIndex: -1, // Tracks progress through questionnaire
        questionnaireCompleted: false, // Tracks if the questionnaire/charting phase is done
        cardsAddedSinceLastPrompt: 0, // Tracks reflection triggers
        promptCooldownActive: false, // Tracks reflection cooldown
        discoveredRepositoryItems: { scenes: new Set(), experiments: new Set(), insights: new Set() },
        pendingRarePrompts: [], // Queue for unique concept reflections
        unlockedFocusItems: new Set(), // Tracks items unlocked via focus combinations
        currentFocusSetHash: '', // For efficient tapestry checks
        contemplationCooldownEnd: null, // Timestamp for deep dive contemplation
        onboardingPhase: Config.ONBOARDING_PHASE.START, // Tracks overall game progression for feature unlocks
        // --- NEW: Tutorial State ---
        onboardingTutorialStep: 'start', // Tracks the current step in the *initial* guided tutorial
                                         // Possible values defined in config.js (e.g., 'start', 'results_modal', 'grimoire_intro', 'focus_intro', 'study_intro', 'reflection_intro', 'repository_intro', 'complete')
    };
    // Explicitly initialize userAnswers sub-objects if elementNames is still relevant
    if (elementNames && Array.isArray(elementNames)) {
        elementNames.forEach(name => {
            initial.userAnswers[name] = {};
        });
    } else {
        console.warn("state.js: elementNames not available or not an array during initialization. User answers might not be structured correctly if questionnaire relies on it.");
    }
    return initial;
};

// Initialize current state using the function
let gameState = createInitialGameState();

// --- Internal Helper ---
function _calculateFocusSetHash() {
    if (!gameState.focusedConcepts || gameState.focusedConcepts.size === 0) { return ''; }
    // Ensure IDs are numbers for correct sorting if they aren't already
    const sortedIds = Array.from(gameState.focusedConcepts)
                          .map(id => typeof id === 'string' ? parseInt(id, 10) : id) // Convert to number if string
                          .filter(id => !isNaN(id)) // Filter out any potential NaNs
                          .sort((a, b) => a - b);
    return sortedIds.join(',');
}


// --- Saving & Loading ---
let saveTimeout = null;
const SAVE_DELAY = 1000; // Keep save delay

function _triggerSave() {
     const saveIndicator = document.getElementById('saveIndicator');
     if (saveIndicator) saveIndicator.classList.remove('hidden');
     if (saveTimeout) clearTimeout(saveTimeout);
     saveTimeout = setTimeout(() => {
         try {
             // Prepare state for JSON stringification
             const stateToSave = {
                 ...gameState,
                 // Convert Sets and Maps to Arrays
                 discoveredConcepts: Array.from(gameState.discoveredConcepts.entries()),
                 focusedConcepts: Array.from(gameState.focusedConcepts),
                 achievedMilestones: Array.from(gameState.achievedMilestones),
                 seenPrompts: Array.from(gameState.seenPrompts),
                 discoveredRepositoryItems: {
                     scenes: Array.from(gameState.discoveredRepositoryItems.scenes),
                     experiments: Array.from(gameState.discoveredRepositoryItems.experiments),
                     insights: Array.from(gameState.discoveredRepositoryItems.insights),
                 },
                 unlockedFocusItems: Array.from(gameState.unlockedFocusItems)
             };
             localStorage.setItem(Config.SAVE_KEY, JSON.stringify(stateToSave));
             // console.log("State saved."); // Optional: for debugging
         } catch (error) {
              console.error("Error saving game state:", error);
              // Optionally, show a persistent error message to the user via UI
              const uiModule = await import('./ui.js'); // Dynamic import for error
              uiModule.showTemporaryMessage("SAVE FAILED!", 5000);
          }
         finally {
             if (saveIndicator) saveIndicator.classList.add('hidden');
             saveTimeout = null;
         }
     }, SAVE_DELAY);
}

export function saveGameState() { _triggerSave(); }

export function loadGameState() {
    console.log("Attempting to load game state from:", Config.SAVE_KEY);
    const savedData = localStorage.getItem(Config.SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found, attempting to merge...");

            // Create a fresh default state first
            const defaultState = createInitialGameState();

            // Merge loaded data carefully, using defaults as fallbacks
            gameState.userScores = typeof loadedState.userScores === 'object' && loadedState.userScores !== null ? { ...defaultState.userScores, ...loadedState.userScores } : defaultState.userScores;

            // Load userAnswers, ensuring structure
            gameState.userAnswers = typeof loadedState.userAnswers === 'object' && loadedState.userAnswers !== null ? loadedState.userAnswers : defaultState.userAnswers;
            if (elementNames && Array.isArray(elementNames)) {
                 elementNames.forEach(name => {
                     if (!gameState.userAnswers[name]) {
                         gameState.userAnswers[name] = {}; // Ensure sub-object exists
                     }
                 });
            }


            gameState.discoveredConcepts = new Map(Array.isArray(loadedState.discoveredConcepts) ? loadedState.discoveredConcepts : defaultState.discoveredConcepts);
            gameState.focusedConcepts = new Set(Array.isArray(loadedState.focusedConcepts) ? loadedState.focusedConcepts : defaultState.focusedConcepts);
            gameState.focusSlotsTotal = typeof loadedState.focusSlotsTotal === 'number' ? loadedState.focusSlotsTotal : defaultState.focusSlotsTotal;
            gameState.userInsight = typeof loadedState.userInsight === 'number' ? loadedState.userInsight : defaultState.userInsight;
            gameState.elementAttunement = typeof loadedState.elementAttunement === 'object' && loadedState.elementAttunement !== null ? { ...defaultState.elementAttunement, ...loadedState.elementAttunement } : defaultState.elementAttunement;
            gameState.unlockedDeepDiveLevels = typeof loadedState.unlockedDeepDiveLevels === 'object' && loadedState.unlockedDeepDiveLevels !== null ? { ...defaultState.unlockedDeepDiveLevels, ...loadedState.unlockedDeepDiveLevels } : defaultState.unlockedDeepDiveLevels;
            gameState.achievedMilestones = new Set(Array.isArray(loadedState.achievedMilestones) ? loadedState.achievedMilestones : defaultState.achievedMilestones);
            gameState.completedRituals = typeof loadedState.completedRituals === 'object' && loadedState.completedRituals !== null ? loadedState.completedRituals : defaultState.completedRituals;
            gameState.lastLoginDate = typeof loadedState.lastLoginDate === 'string' ? loadedState.lastLoginDate : defaultState.lastLoginDate;
            gameState.freeResearchAvailableToday = typeof loadedState.freeResearchAvailableToday === 'boolean' ? loadedState.freeResearchAvailableToday : defaultState.freeResearchAvailableToday;
            gameState.seenPrompts = new Set(Array.isArray(loadedState.seenPrompts) ? loadedState.seenPrompts : defaultState.seenPrompts);
            gameState.currentElementIndex = typeof loadedState.currentElementIndex === 'number' ? loadedState.currentElementIndex : defaultState.currentElementIndex;
            gameState.questionnaireCompleted = typeof loadedState.questionnaireCompleted === 'boolean' ? loadedState.questionnaireCompleted : defaultState.questionnaireCompleted;
            gameState.cardsAddedSinceLastPrompt = typeof loadedState.cardsAddedSinceLastPrompt === 'number' ? loadedState.cardsAddedSinceLastPrompt : defaultState.cardsAddedSinceLastPrompt;
            gameState.promptCooldownActive = typeof loadedState.promptCooldownActive === 'boolean' ? loadedState.promptCooldownActive : defaultState.promptCooldownActive;

            // Load Repository Items carefully
            const loadedRepo = loadedState.discoveredRepositoryItems;
            gameState.discoveredRepositoryItems = {
                scenes: new Set(Array.isArray(loadedRepo?.scenes) ? loadedRepo.scenes : defaultState.discoveredRepositoryItems.scenes),
                experiments: new Set(Array.isArray(loadedRepo?.experiments) ? loadedRepo.experiments : defaultState.discoveredRepositoryItems.experiments),
                insights: new Set(Array.isArray(loadedRepo?.insights) ? loadedRepo.insights : defaultState.discoveredRepositoryItems.insights),
            };

            gameState.pendingRarePrompts = Array.isArray(loadedState.pendingRarePrompts) ? loadedState.pendingRarePrompts : defaultState.pendingRarePrompts;
            gameState.unlockedFocusItems = new Set(Array.isArray(loadedState.unlockedFocusItems) ? loadedState.unlockedFocusItems : defaultState.unlockedFocusItems);
            gameState.contemplationCooldownEnd = typeof loadedState.contemplationCooldownEnd === 'number' ? loadedState.contemplationCooldownEnd : defaultState.contemplationCooldownEnd;
            gameState.onboardingPhase = typeof loadedState.onboardingPhase === 'number' ? loadedState.onboardingPhase : defaultState.onboardingPhase;

            // --- NEW: Load Tutorial Step ---
            gameState.onboardingTutorialStep = typeof loadedState.onboardingTutorialStep === 'string' ? loadedState.onboardingTutorialStep : defaultState.onboardingTutorialStep;

            // Recalculate hash after loading
            gameState.currentFocusSetHash = _calculateFocusSetHash();

            // --- Post-load validation/cleanup ---
            // Ensure focus slots are within bounds
            gameState.focusSlotsTotal = Math.max(Config.INITIAL_FOCUS_SLOTS, Math.min(Config.MAX_FOCUS_SLOTS, gameState.focusSlotsTotal));
            // Ensure Insight is not negative
            gameState.userInsight = Math.max(0, gameState.userInsight);
            // Ensure attunement/levels are valid numbers
            for (const key in gameState.elementAttunement) {
                gameState.elementAttunement[key] = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, Number(gameState.elementAttunement[key]) || 0));
            }
             for (const key in gameState.unlockedDeepDiveLevels) {
                gameState.unlockedDeepDiveLevels[key] = Math.max(0, Number(gameState.unlockedDeepDiveLevels[key]) || 0);
            }

            console.log("Game state loaded and merged successfully.");
            return true;
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(Config.SAVE_KEY); // Clear corrupted data
            gameState = createInitialGameState(); // Reset to default
            return false;
        }
    } else {
        console.log("No saved game state found.");
        gameState = createInitialGameState(); // Ensure default state
        return false;
    }
}

export function clearGameState() {
    localStorage.removeItem(Config.SAVE_KEY);
    gameState = createInitialGameState(); // Reset to default using the function
    console.log("Game state cleared and reset.");
    // No save needed here, clearing is the action
}

// --- Getters ---
// Provide read-only access to state properties
export function getState() { return { ...gameState }; } // Return a shallow copy
export function getScores() { return { ...gameState.userScores }; }
export function getAttunement() { return { ...gameState.elementAttunement }; }
export function getInsight() { return gameState.userInsight; }
export function getDiscoveredConcepts() { return gameState.discoveredConcepts; } // Map is mutable, be careful
export function getDiscoveredConceptData(conceptId) {
    const data = gameState.discoveredConcepts.get(conceptId);
    return data ? { ...data } : undefined; // Return copy of data if found
}
export function getFocusedConcepts() { return gameState.focusedConcepts; } // Set is mutable
export function getFocusSlots() { return gameState.focusSlotsTotal; }
export function getRepositoryItems() { return gameState.discoveredRepositoryItems; } // Object containing Sets (mutable)
export function getUnlockedFocusItems() { return gameState.unlockedFocusItems; } // Set is mutable
export function getCurrentFocusSetHash() { return gameState.currentFocusSetHash; }
export function getContemplationCooldownEnd() { return gameState.contemplationCooldownEnd; }
export function getOnboardingPhase() { return gameState.onboardingPhase; }
export function isFreeResearchAvailable() { return gameState.freeResearchAvailableToday; }
export function getCurrentElementIndex() { return gameState.currentElementIndex; }
export function isQuestionnaireComplete() { return gameState.questionnaireCompleted; }
// --- NEW: Tutorial Step Getter ---
export function getOnboardingTutorialStep() { return gameState.onboardingTutorialStep; }

// --- Setters / Updaters (Trigger Save) ---
// Functions that modify the state should call saveGameState()

export function updateScores(newScores) {
    // Basic validation: Ensure newScores is an object
    if (typeof newScores !== 'object' || newScores === null) {
        console.error("updateScores received invalid input:", newScores);
        return false;
    }
    // Optional: Validate keys and value types if necessary
    gameState.userScores = { ...newScores };
    saveGameState();
    return true;
}

export function saveAllAnswers(allAnswers) {
     // Basic validation: Ensure allAnswers is an object
    if (typeof allAnswers !== 'object' || allAnswers === null) {
        console.error("saveAllAnswers received invalid input:", allAnswers);
        return false;
    }
    // Use structuredClone for a deep copy if available and needed, otherwise JSON parse/stringify
    try {
        gameState.userAnswers = structuredClone(allAnswers);
    } catch (e) {
        console.warn("structuredClone not available, using JSON fallback for saveAllAnswers.");
        gameState.userAnswers = JSON.parse(JSON.stringify(allAnswers));
    }
    saveGameState();
    return true;
}

export function updateAnswers(elementName, answersForElement) {
    if (!gameState.userAnswers) { gameState.userAnswers = {}; } // Initialize if missing
    if (!gameState.userAnswers[elementName]) { gameState.userAnswers[elementName] = {}; }
    // Shallow copy is usually sufficient here unless answers contain nested objects/arrays
    gameState.userAnswers[elementName] = { ...answersForElement };
    // No save needed here - questionnaire progress saves implicitly via other actions
    return true;
}

export function updateElementIndex(index) {
    if (typeof index !== 'number') return false;
    gameState.currentElementIndex = index;
    // No save here - questionnaire progress saves implicitly
    return true;
}

export function setQuestionnaireComplete() {
    if (!gameState.questionnaireCompleted) {
        gameState.questionnaireCompleted = true;
        // Don't advance onboardingPhase here anymore. Let the tutorial flow handle it.
        // If you *do* want the phase to advance regardless of tutorial, uncomment below:
        // advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
        saveGameState();
        return true;
    }
    return false; // Already complete
}

// --- NEW: Tutorial Step Setter ---
export function setOnboardingTutorialStep(stepId) {
    if (typeof stepId !== 'string' || !stepId) {
        console.error("setOnboardingTutorialStep received invalid stepId:", stepId);
        return false;
    }
    if (gameState.onboardingTutorialStep !== stepId) {
        console.log(`State: Updating tutorial step from '${gameState.onboardingTutorialStep}' to '${stepId}'`);
        gameState.onboardingTutorialStep = stepId;
        // If the tutorial is marked complete, potentially advance the main onboarding phase
        if (stepId === 'complete' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) {
            console.log("Tutorial complete, ensuring onboarding phase is at least ADVANCED.");
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); // Or the appropriate final phase
        }
        saveGameState();
        return true;
    }
    return false; // No change
}


// Advance overall game phase (kept for feature unlocking post-tutorial)
export function advanceOnboardingPhase(targetPhase) {
    if (typeof targetPhase !== 'number') return false;
    if (targetPhase > gameState.onboardingPhase) {
        console.log(`State: Advancing onboarding phase from ${gameState.onboardingPhase} to ${targetPhase}`);
        gameState.onboardingPhase = targetPhase;
        saveGameState();
        return true;
    }
    return false; // No change or attempting to go backwards
}

export function changeInsight(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return false;
    const previousInsight = gameState.userInsight;
    gameState.userInsight = Math.max(0, previousInsight + amount);
    if (gameState.userInsight !== previousInsight) {
        saveGameState();
        return true;
    }
    return false; // No change
}

export function updateAttunement(elementKey, amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return false;
    if (gameState.elementAttunement.hasOwnProperty(elementKey)) {
        const current = gameState.elementAttunement[elementKey];
        const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
        if (newValue !== current) {
            gameState.elementAttunement[elementKey] = newValue;
            saveGameState();
            return true;
        }
    } else {
        console.warn(`updateAttunement called with invalid elementKey: ${elementKey}`);
    }
    return false; // No change or invalid key
}

export function addDiscoveredConcept(conceptId, conceptData) {
    // Ensure Map type
    if (!(gameState.discoveredConcepts instanceof Map)) {
        console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map in addDiscoveredConcept!");
        gameState.discoveredConcepts = new Map();
    }
     // Input validation
    if (conceptId === null || typeof conceptId === 'undefined' || !conceptData) {
        console.error("addDiscoveredConcept received invalid input:", conceptId, conceptData);
        return false;
    }

    if (!gameState.discoveredConcepts.has(conceptId)) {
        // Create a structured entry
        const entry = {
            concept: { ...conceptData }, // Shallow copy concept data
            discoveredTime: Date.now(),
            artUnlocked: false,
            notes: ""
        };
        gameState.discoveredConcepts.set(conceptId, entry);

        // Example: Advance phase based on discovery - adjust logic as needed post-tutorial
        // if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.discoveredConcepts.size >= 1) {
        //     advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        // }
        saveGameState();
        return true;
    }
    return false; // Already discovered
}

export function removeDiscoveredConcept(conceptId) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        // Also remove from focus if it was focused
        if (gameState.focusedConcepts.has(conceptId)) {
             gameState.focusedConcepts.delete(conceptId);
             gameState.currentFocusSetHash = _calculateFocusSetHash(); // Update hash immediately
        }
        saveGameState();
        return true;
    }
    return false; // Not found
}

export function toggleFocusConcept(conceptId) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return 'error'; }
    if (!gameState.discoveredConcepts.has(conceptId)) return 'not_discovered';

    let result;
    if (gameState.focusedConcepts.has(conceptId)) {
        gameState.focusedConcepts.delete(conceptId);
        result = 'removed';
    } else {
        if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) {
            return 'slots_full';
        }
        gameState.focusedConcepts.add(conceptId);
        result = 'added';
        // Example: Advance phase based on first focus - adjust logic as needed post-tutorial
        // if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.focusedConcepts.size >= 1) {
        //     advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        // }
    }
    gameState.currentFocusSetHash = _calculateFocusSetHash(); // Update hash
    saveGameState();
    return result;
}

export function increaseFocusSlots(amount = 1) {
    if (typeof amount !== 'number' || amount <= 0) return false;
    const newSlots = Math.min(Config.MAX_FOCUS_SLOTS, gameState.focusSlotsTotal + amount);
    if (newSlots > gameState.focusSlotsTotal) {
        gameState.focusSlotsTotal = newSlots;
        saveGameState();
        return true;
    }
    return false; // No change or already at max
}

export function updateNotes(conceptId, notes) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data) {
        // Avoid saving if notes haven't changed
        if (data.notes !== notes) {
             data.notes = notes;
             // No need to use set, as 'data' is a reference to the object in the map
             // gameState.discoveredConcepts.set(conceptId, data); // This is redundant
             saveGameState();
             return true;
        }
        return false; // Notes were the same
    }
    return false; // Concept not found
}

export function unlockArt(conceptId) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data && !data.artUnlocked) {
        data.artUnlocked = true;
        // Optional: Advance phase if unlocking art signifies progression
        // if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) {
        //     advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
        // }
        saveGameState();
        return true;
    }
    return false; // Not found or already unlocked
}

export function unlockLibraryLevel(elementKey, level) {
    if (typeof level !== 'number' || level <= 0) return false;
    if (gameState.unlockedDeepDiveLevels.hasOwnProperty(elementKey)) {
        const currentLevel = gameState.unlockedDeepDiveLevels[elementKey];
        if (level === currentLevel + 1) { // Only allow sequential unlocks
            gameState.unlockedDeepDiveLevels[elementKey] = level;
            // Optional: Advance phase based on library progress
            // const anyLevelUnlocked = Object.values(gameState.unlockedDeepDiveLevels).some(l => l >= 1);
            // if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED && anyLevelUnlocked) {
            //     advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
            // }
            saveGameState();
            return true;
        }
    }
    return false; // Invalid key or non-sequential level
}

export function resetDailyRituals() {
    gameState.completedRituals.daily = {}; // Reset only daily rituals
    gameState.freeResearchAvailableToday = true;
    gameState.lastLoginDate = new Date().toDateString();
    saveGameState();
}

export function setFreeResearchUsed() {
    if (gameState.freeResearchAvailableToday) {
        gameState.freeResearchAvailableToday = false;
        saveGameState();
        return true;
    }
    return false; // Already used
}

export function completeRitualProgress(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
    if (!gameState.completedRituals[period][ritualId]) {
        gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 };
    }
    // Increment progress only if not already marked complete for the period
    if (!gameState.completedRituals[period][ritualId].completed) {
        gameState.completedRituals[period][ritualId].progress += 1;
        saveGameState();
    }
    return gameState.completedRituals[period][ritualId].progress;
}

export function markRitualComplete(ritualId, period = 'daily') {
    // Ensure the ritual entry exists
    if (!gameState.completedRituals[period]?.[ritualId]) {
        completeRitualProgress(ritualId, period); // This initializes if needed
    }
    // Mark as complete if it exists
    if (gameState.completedRituals[period]?.[ritualId] && !gameState.completedRituals[period][ritualId].completed) {
        gameState.completedRituals[period][ritualId].completed = true;
        saveGameState();
        return true;
    }
    return false; // Already complete or entry doesn't exist after attempt
}

export function addAchievedMilestone(milestoneId) {
    if (!(gameState.achievedMilestones instanceof Set)) { console.error("CRITICAL ERROR: gameState.achievedMilestones is not a Set!"); gameState.achievedMilestones = new Set(); }
    if (!gameState.achievedMilestones.has(milestoneId)) {
        gameState.achievedMilestones.add(milestoneId);
        // Optional: Phase advancement tied to milestones (adjust as needed post-tutorial)
        // const milestonePhaseMap = {
        //     'ms01': Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE, // Example: First Concept
        //     'ms05': Config.ONBOARDING_PHASE.STUDY_INSIGHT,      // Example: First Research
        //     'ms07': Config.ONBOARDING_PHASE.REFLECTION_RITUALS, // Example: First Reflection
        //     'ms60': Config.ONBOARDING_PHASE.ADVANCED,          // Example: First Library Unlock
        //     'ms70': Config.ONBOARDING_PHASE.ADVANCED,          // Example: First Scene Meditation
        // };
        // if (milestonePhaseMap[milestoneId]) {
        //     advanceOnboardingPhase(milestonePhaseMap[milestoneId]);
        // }
        saveGameState();
        return true;
    }
    return false; // Already achieved
}

export function addSeenPrompt(promptId) {
    if (!(gameState.seenPrompts instanceof Set)) { console.error("CRITICAL ERROR: gameState.seenPrompts is not a Set!"); gameState.seenPrompts = new Set(); }
    if (!gameState.seenPrompts.has(promptId)) {
         gameState.seenPrompts.add(promptId);
         saveGameState();
         return true;
    }
    return false; // Already seen
}

// Manage Reflection Trigger Counter
export function incrementReflectionTrigger() {
    gameState.cardsAddedSinceLastPrompt++;
    // No save needed, transient counter reset by other actions
}

export function resetReflectionTrigger(startCooldown = false) {
    gameState.cardsAddedSinceLastPrompt = 0;
    if (startCooldown) {
        // Cooldown logic is usually handled in gameLogic, but if needed here:
        setPromptCooldownActive(true);
        // Note: Saving might happen via setPromptCooldownActive or related logic
    }
}

// Manage Reflection Cooldown State
export function setPromptCooldownActive(isActive) {
     if (typeof isActive !== 'boolean') return false;
     if (gameState.promptCooldownActive !== isActive) {
         gameState.promptCooldownActive = isActive;
         saveGameState(); // Save when cooldown status changes
         return true;
     }
     return false; // No change
}

// Add item to repository sets
export function addRepositoryItem(itemType, itemId) {
    // Validate itemType
    if (!gameState.discoveredRepositoryItems.hasOwnProperty(itemType)) {
        console.error(`addRepositoryItem: Invalid itemType '${itemType}'`);
        return false;
    }
     // Ensure Set type
    if (!(gameState.discoveredRepositoryItems[itemType] instanceof Set)) {
        console.error(`CRITICAL ERROR: gameState.discoveredRepositoryItems.${itemType} is not a Set!`);
        gameState.discoveredRepositoryItems[itemType] = new Set();
    }

    if (!gameState.discoveredRepositoryItems[itemType].has(itemId)) {
        gameState.discoveredRepositoryItems[itemType].add(itemId);
        // Optional: Phase advancement based on repository discovery
        // const anyRepoItemFound = Object.values(gameState.discoveredRepositoryItems).some(set => set.size > 0);
        // if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED && anyRepoItemFound) {
        //     advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
        // }
        saveGameState();
        return true;
    }
    return false; // Already discovered
}

// Manage Pending Rare Prompts queue
export function addPendingRarePrompt(promptId) {
    if (!Array.isArray(gameState.pendingRarePrompts)) { console.error("CRITICAL ERROR: gameState.pendingRarePrompts is not an Array!"); gameState.pendingRarePrompts = []; }
    if (!gameState.pendingRarePrompts.includes(promptId)) {
        gameState.pendingRarePrompts.push(promptId);
        saveGameState();
        return true;
    }
    return false; // Already pending
}

export function getNextRarePrompt() {
    if (!Array.isArray(gameState.pendingRarePrompts)) { console.error("CRITICAL ERROR: gameState.pendingRarePrompts is not an Array!"); return null; }
    if (gameState.pendingRarePrompts.length > 0) {
        const promptId = gameState.pendingRarePrompts.shift(); // Removes the first element
        saveGameState();
        return promptId;
    }
    return null; // Queue is empty
}

// Manage Focus-Driven Unlocks Set
export function addUnlockedFocusItem(unlockId) {
    if (!(gameState.unlockedFocusItems instanceof Set)) { console.error("CRITICAL ERROR: gameState.unlockedFocusItems is not a Set!"); gameState.unlockedFocusItems = new Set(); }
    if (!gameState.unlockedFocusItems.has(unlockId)) {
        gameState.unlockedFocusItems.add(unlockId);
        // Optional: Phase advancement based on focus unlocks
        // if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) {
        //     advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
        // }
        saveGameState();
        return true;
    }
    return false; // Already unlocked
}

// Manage Contemplation Cooldown
export function setContemplationCooldown(endTime) {
     if (typeof endTime !== 'number' && endTime !== null) return false; // Allow null to clear
     if (gameState.contemplationCooldownEnd !== endTime) {
         gameState.contemplationCooldownEnd = endTime;
         saveGameState();
         return true;
     }
     return false; // No change
}


console.log("state.js loaded.");
