// js/state.js - Manages Game State Variables and Persistence
import * as Config from './config.js';
import { showTemporaryMessage } from './ui.js'; // Import UI function for messages

console.log("state.js loading...");

// --- Default State ---
const getDefaultState = () => ({
    currentOnboardingPhase: Config.ONBOARDING_PHASE.START,
    questionnaireCompleted: false,
    currentElementIndex: 0,
    userScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 },
    userAnswers: {}, // Will be populated: { Attraction: {a1: val, ...}, ... }
    discoveredConcepts: new Map(), // ID -> { concept, discoveredTime, artUnlocked: boolean, notes: string }
    focusedConcepts: new Set(), // Set of concept IDs
    focusSlotsTotal: Config.INITIAL_FOCUS_SLOTS,
    userInsight: Config.INITIAL_INSIGHT,
    elementAttunement: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
    unlockedDeepDiveLevels: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
    seenPrompts: new Set(), // Set of prompt IDs
    completedRituals: { daily: {}, weekly: {} }, // { ritualId: { completed: bool, progress: num } }
    achievedMilestones: new Set(), // Set of milestone IDs
    lastLoginDate: null, // Stores Date().toDateString()
    freeResearchAvailableToday: false,
    cardsAddedSinceLastPrompt: 0, // Counter for reflection trigger
    promptCooldownActive: false, // Timer flag for reflection cooldown
    // --- Repository State ---
    discoveredRepositoryItems: {
        scenes: new Set(), // Set of scene IDs
        experiments: new Set(), // Set of *completed* experiment IDs
        insights: new Set() // Set of insight IDs
    },
    pendingRarePrompts: [], // Array of uniquePromptIds (from rare concepts)
    unlockedFocusItems: new Set() // Set of focusDrivenUnlock IDs
});

// --- Game State Variable ---
// We use let here so loadGameState can reassign it.
let gameState = getDefaultState();

// --- State Accessors (Getters) ---
export const getState = () => ({ ...gameState }); // Return a copy to prevent direct mutation
export const getScores = () => ({ ...gameState.userScores });
export const getDiscoveredConcepts = () => new Map(gameState.discoveredConcepts);
export const getFocusedConcepts = () => new Set(gameState.focusedConcepts);
export const getInsight = () => gameState.userInsight;
export const getAttunement = () => ({ ...gameState.elementAttunement });
export const getFocusSlots = () => gameState.focusSlotsTotal;
export const getOnboardingPhase = () => gameState.currentOnboardingPhase;
export const checkMilestone = (id) => gameState.achievedMilestones.has(id);
export const getRepositoryItems = () => ({
    scenes: new Set(gameState.discoveredRepositoryItems.scenes),
    experiments: new Set(gameState.discoveredRepositoryItems.experiments),
    insights: new Set(gameState.discoveredRepositoryItems.insights)
});
export const getUnlockedFocusItems = () => new Set(gameState.unlockedFocusItems);
export const isFreeResearchAvailable = () => gameState.freeResearchAvailableToday;

// --- State Mutators (Setters/Updaters) ---
// Note: These functions encapsulate state changes and trigger saving.

export function setQuestionnaireComplete() {
    gameState.questionnaireCompleted = true;
    gameState.currentElementIndex = Data.elementNames.length; // Ensure index is past the end
    advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE); // Move to next phase
    saveGameState();
}

export function updateScores(newScores) {
    // Basic validation
    if (typeof newScores === 'object' && newScores !== null) {
        let updated = false;
        for (const key in newScores) {
            if (gameState.userScores.hasOwnProperty(key) && typeof newScores[key] === 'number') {
                gameState.userScores[key] = Math.max(0, Math.min(10, newScores[key]));
                updated = true;
            }
        }
        if (updated) saveGameState();
    } else {
        console.warn("Invalid scores object passed to updateScores:", newScores);
    }
}

export function updateSingleScore(elementKey, score) {
     if (gameState.userScores.hasOwnProperty(elementKey) && typeof score === 'number') {
         gameState.userScores[elementKey] = Math.max(0, Math.min(10, score));
         saveGameState();
     }
}

export function updateAnswers(elementName, answersForElement) {
    if (!gameState.userAnswers) gameState.userAnswers = {}; // Initialize if needed
    gameState.userAnswers[elementName] = { ...(answersForElement || {}) };
    // Only save when moving between elements or finishing questionnaire
}

export function saveAllAnswers(allAnswers) {
    gameState.userAnswers = { ...(allAnswers || {}) };
    saveGameState(); // Save all answers at the end
}


export function updateElementIndex(index) {
    gameState.currentElementIndex = index;
    // Don't save here, save implicitly when navigating or finalizing
}

export function addDiscoveredConcept(conceptId, conceptData) {
    if (!gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.set(conceptId, {
            concept: conceptData,
            discoveredTime: Date.now(),
            artUnlocked: false,
            notes: ""
        });
        saveGameState();
        return true; // Indicate added
    }
    return false; // Indicate already existed
}

export function removeDiscoveredConcept(conceptId) {
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        // Also remove from focus if it was focused
        if (gameState.focusedConcepts.has(conceptId)) {
            gameState.focusedConcepts.delete(conceptId);
        }
        saveGameState();
        return true; // Indicate removed
    }
    return false; // Indicate not found
}

export function toggleFocusConcept(conceptId) {
    if (!gameState.discoveredConcepts.has(conceptId)) return 'not_discovered'; // Not in grimoire

    if (gameState.focusedConcepts.has(conceptId)) {
        gameState.focusedConcepts.delete(conceptId);
        saveGameState();
        return 'removed';
    } else {
        if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) {
            return 'slots_full';
        }
        gameState.focusedConcepts.add(conceptId);
        // Check if this is the first time focusing
        if (getOnboardingPhase() === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE && gameState.focusedConcepts.size === 1){
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        }
        saveGameState();
        return 'added';
    }
}

export function updateNotes(conceptId, notes) {
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data) {
        data.notes = notes;
        gameState.discoveredConcepts.set(conceptId, data);
        saveGameState();
        return true;
    }
    return false;
}

export function unlockArt(conceptId) {
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data && !data.artUnlocked) {
        data.artUnlocked = true;
        gameState.discoveredConcepts.set(conceptId, data);
        saveGameState();
        return true;
    }
    return false;
}

export function changeInsight(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return false;
    const previousInsight = gameState.userInsight;
    gameState.userInsight = Math.max(0, previousInsight + amount);
    const actualChange = gameState.userInsight - previousInsight;
    if (actualChange !== 0) {
        saveGameState();
        return true; // Indicate change occurred
    }
    return false; // Indicate no change
}

export function updateAttunement(elementKey, amount) {
    if (!gameState.elementAttunement.hasOwnProperty(elementKey) || typeof amount !== 'number' || isNaN(amount)) {
        return false;
    }
    const current = gameState.elementAttunement[elementKey];
    const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
    if (newValue !== current) {
        gameState.elementAttunement[elementKey] = newValue;
        saveGameState();
        // Potentially trigger onboarding phase for experiments/library later
        if (newValue >= 20 && getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) {
            // Maybe trigger phase advance here or in gameLogic based on milestones
        }
        return true;
    }
    return false;
}

export function updateAllAttunement(amount) {
    let changed = false;
    for (const key in gameState.elementAttunement) {
        if (updateAttunement(key, amount)) {
            changed = true;
        }
    }
    // Save game state is handled by individual updateAttunement calls
    return changed;
}

export function unlockLibraryLevel(elementKey, level) {
    if (gameState.unlockedDeepDiveLevels.hasOwnProperty(elementKey) && level > gameState.unlockedDeepDiveLevels[elementKey]) {
        gameState.unlockedDeepDiveLevels[elementKey] = level;
        saveGameState();
        return true;
    }
    return false;
}

export function addSeenPrompt(promptId) {
    if (!gameState.seenPrompts.has(promptId)) {
        gameState.seenPrompts.add(promptId);
        saveGameState();
    }
}

export function completeRitualProgress(ritualId, period = 'daily') {
     if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
     if (!gameState.completedRituals[period][ritualId]) gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 };

     const ritualData = gameState.completedRituals[period][ritualId];
     if (!ritualData.completed) {
          ritualData.progress++;
          // Completion check will happen in gameLogic
          saveGameState();
          return ritualData.progress;
     }
     return ritualData.progress; // Return current progress even if completed
}

export function markRitualComplete(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
    gameState.completedRituals[period][ritualId] = { completed: true, progress: 1 }; // Assume progress is met
    saveGameState();
}

export function resetDailyRituals() {
    gameState.completedRituals.daily = {};
    gameState.freeResearchAvailableToday = true;
    gameState.lastLoginDate = new Date().toDateString();
    console.log("Daily state reset triggered in state.js");
    saveGameState();
}

export function setFreeResearchUsed() {
    gameState.freeResearchAvailableToday = false;
    saveGameState();
}


export function addAchievedMilestone(milestoneId) {
    if (!gameState.achievedMilestones.has(milestoneId)) {
        gameState.achievedMilestones.add(milestoneId);
        saveGameState();
        return true;
    }
    return false;
}

export function increaseFocusSlots(amount = 1) {
    const oldSlots = gameState.focusSlotsTotal;
    gameState.focusSlotsTotal = Math.min(Config.MAX_FOCUS_SLOTS, oldSlots + amount);
    if (gameState.focusSlotsTotal > oldSlots) {
        saveGameState();
        return true;
    }
    return false;
}

export function incrementReflectionTrigger() {
    gameState.cardsAddedSinceLastPrompt++;
    // Don't save here, let the trigger check handle saving if prompt shown
}
export function resetReflectionTrigger(setCooldown = true) {
    gameState.cardsAddedSinceLastPrompt = 0;
    if (setCooldown) {
        gameState.promptCooldownActive = true;
        // Cooldown timer logic will be handled elsewhere (likely main.js or gameLogic)
    }
    saveGameState(); // Save state when cooldown is potentially set
}
export function clearReflectionCooldown() {
    gameState.promptCooldownActive = false;
    saveGameState();
}

export function addRepositoryItem(type, itemId) {
    if (gameState.discoveredRepositoryItems.hasOwnProperty(type)) {
        const itemSet = gameState.discoveredRepositoryItems[type];
        if (!itemSet.has(itemId)) {
            itemSet.add(itemId);
            saveGameState();
            return true;
        }
    } else {
        console.warn(`Attempted to add to unknown repository type: ${type}`);
    }
    return false;
}

export function addPendingRarePrompt(promptId) {
    if (!gameState.pendingRarePrompts.includes(promptId)) {
        gameState.pendingRarePrompts.push(promptId);
        saveGameState();
    }
}

export function getNextRarePrompt() {
    if (gameState.pendingRarePrompts.length > 0) {
        const promptId = gameState.pendingRarePrompts.shift();
        saveGameState();
        return promptId;
    }
    return null;
}

export function addUnlockedFocusItem(unlockId) {
    if (!gameState.unlockedFocusItems.has(unlockId)) {
        gameState.unlockedFocusItems.add(unlockId);
        saveGameState();
        return true;
    }
    return false;
}

export function advanceOnboardingPhase(targetPhase = null) {
    const currentPhase = gameState.currentOnboardingPhase;
    const nextPhase = targetPhase !== null ? targetPhase : currentPhase + 1; // Allow specific jumps

    if (nextPhase > currentPhase && nextPhase <= Config.ONBOARDING_PHASE.ADVANCED) {
        gameState.currentOnboardingPhase = nextPhase;
        console.log(`Advanced onboarding phase to: ${nextPhase}`);
        saveGameState();
        // Trigger UI updates based on the new phase in ui.js
        // Import dynamically or have ui.js check state periodically/on demand
        // For now, rely on the calling function (e.g., in gameLogic) to trigger UI updates
        return true;
    }
    return false;
}

// --- Persistence ---
let saveIndicatorTimeout = null;
function showSaveIndicatorUI() {
    const indicator = document.getElementById('saveIndicator'); // Direct access for simplicity here
    if (!indicator) return;
    indicator.classList.remove('hidden');
    if (saveIndicatorTimeout) clearTimeout(saveIndicatorTimeout);
    saveIndicatorTimeout = setTimeout(() => {
        indicator.classList.add('hidden');
        saveIndicatorTimeout = null;
    }, 750);
}

export function saveGameState() {
    showSaveIndicatorUI();
    try {
        // Convert Maps and Sets to Arrays for JSON serialization
        const stateToSave = {
            ...gameState,
            discoveredConcepts: Array.from(gameState.discoveredConcepts.entries()),
            focusedConcepts: Array.from(gameState.focusedConcepts),
            seenPrompts: Array.from(gameState.seenPrompts),
            achievedMilestones: Array.from(gameState.achievedMilestones),
            discoveredRepositoryItems: {
                scenes: Array.from(gameState.discoveredRepositoryItems.scenes),
                experiments: Array.from(gameState.discoveredRepositoryItems.experiments),
                insights: Array.from(gameState.discoveredRepositoryItems.insights)
            },
            unlockedFocusItems: Array.from(gameState.unlockedFocusItems),
        };
        localStorage.setItem(Config.SAVE_KEY, JSON.stringify(stateToSave));
        // console.log("Game state saved."); // Reduce console noise
    } catch (error) {
        console.error("Error saving game state:", error);
        showTemporaryMessage("Error: Could not save progress!", 4000); // Use imported UI function
    }
}

export function loadGameState() {
    console.log("Attempting to load game state...");
    const savedData = localStorage.getItem(Config.SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found, merging with defaults...");

            // Create a new default state
            const newState = getDefaultState();

            // Merge loaded data carefully, converting arrays back to Maps/Sets
            for (const key in loadedState) {
                if (newState.hasOwnProperty(key)) {
                    if (key === 'discoveredConcepts') {
                        newState.discoveredConcepts = new Map(loadedState.discoveredConcepts || []);
                    } else if (key === 'focusedConcepts' || key === 'seenPrompts' || key === 'achievedMilestones' || key === 'unlockedFocusItems') {
                        newState[key] = new Set(loadedState[key] || []);
                    } else if (key === 'discoveredRepositoryItems') {
                         newState.discoveredRepositoryItems = {
                              scenes: new Set(loadedState.discoveredRepositoryItems?.scenes || []),
                              experiments: new Set(loadedState.discoveredRepositoryItems?.experiments || []),
                              insights: new Set(loadedState.discoveredRepositoryItems?.insights || [])
                         };
                    } else if (key === 'completedRituals') {
                         // Ensure structure exists
                         newState.completedRituals = {
                              daily: loadedState.completedRituals?.daily || {},
                              weekly: loadedState.completedRituals?.weekly || {}
                         };
                    }
                    else {
                        // Directly assign other primitive types or plain objects
                        newState[key] = loadedState[key];
                    }
                }
            }

            // Handle potential version mismatches or missing keys by relying on defaults
            gameState = { ...getDefaultState(), ...newState };

            console.log("Game state loaded and merged successfully.");
            return true; // Indicate success
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(Config.SAVE_KEY); // Clear corrupted data
            gameState = getDefaultState(); // Reset to default
             // Need to call UI function, but ui.js might not be fully loaded yet.
             // Defer message or handle in main.js after load attempt.
            // showTemporaryMessage("Error loading session. Starting fresh.", 4000);
            return false; // Indicate failure
        }
    } else {
        console.log("No saved game state found.");
        gameState = getDefaultState(); // Ensure default state is set
        return false; // Indicate no save found
    }
}

export function clearGameState() {
    console.log("Clearing saved game state...");
    localStorage.removeItem(Config.SAVE_KEY);
    gameState = getDefaultState(); // Reset runtime state
    // showTemporaryMessage("Progress Reset!", 3000); // Triggered from UI module
    console.log("Game state reset.");
}


// Initial check on load (can be moved to main.js if preferred)
// loadGameState(); // Load attempt happens in main.js

console.log("state.js loaded.");

// Import Data globally within this module *after* initial setup
// This is slightly unconventional but ensures Data is available to utils
// Needs careful handling of load order. A better pattern might be passing data explicitly.
let Data;
import('../data.js').then(dataModule => {
    Data = dataModule;
    console.log("Data module dynamically loaded in state.js");
}).catch(err => console.error("Failed to load data.js in state.js", err));
