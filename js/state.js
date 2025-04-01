// js/state.js - Manages Game State Variables and Persistence
import * as Config from './config.js';
// Import UI only for showing messages during load/save errors
import { showTemporaryMessage } from './ui.js';

console.log("state.js loading...");

// --- Default State ---
const getDefaultState = () => ({
    currentOnboardingPhase: Config.ONBOARDING_PHASE.START,
    questionnaireCompleted: false,
    currentElementIndex: 0,
    userScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 },
    userAnswers: {},
    discoveredConcepts: new Map(),
    focusedConcepts: new Set(),
    focusSlotsTotal: Config.INITIAL_FOCUS_SLOTS,
    userInsight: Config.INITIAL_INSIGHT,
    elementAttunement: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
    unlockedDeepDiveLevels: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
    seenPrompts: new Set(),
    completedRituals: { daily: {}, weekly: {} },
    achievedMilestones: new Set(),
    lastLoginDate: null,
    freeResearchAvailableToday: false,
    cardsAddedSinceLastPrompt: 0,
    promptCooldownActive: false,
    discoveredRepositoryItems: { scenes: new Set(), experiments: new Set(), insights: new Set() },
    pendingRarePrompts: [],
    unlockedFocusItems: new Set()
});

// --- Game State Variable ---
let gameState = getDefaultState();

// --- State Accessors (Getters) ---
export const getState = () => ({ ...gameState }); // Shallow copy is usually fine
export const getScores = () => ({ ...gameState.userScores });
export const getDiscoveredConcepts = () => new Map(gameState.discoveredConcepts);
export const getDiscoveredConceptData = (id) => gameState.discoveredConcepts.get(id); // Direct access if needed
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
export const getPendingRarePrompts = () => [...gameState.pendingRarePrompts]; // Return copy

// --- State Mutators (Setters/Updaters) ---
export function setQuestionnaireComplete() {
    gameState.questionnaireCompleted = true;
    // Ensure index reflects completion, assuming Data is loaded correctly by now
    try {
        // Dynamically import Data just for this length check if needed, or pass it
         import('../data.js').then(Data => {
            gameState.currentElementIndex = Data.elementNames.length;
            // Advance onboarding phase *after* questionnaire is truly marked complete
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
            saveGameState();
         }).catch(e => console.error("Error getting elementNames length in setQuestionnaireComplete", e));
    } catch(e) {
         console.error("Error setting questionnaire complete state", e);
         // Fallback if dynamic import fails
         gameState.currentElementIndex = 6; // Assume 6 elements
         advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
         saveGameState();
    }
}

export function updateScores(newScores) {
    if (typeof newScores === 'object' && newScores !== null) {
        let updated = false;
        for (const key in newScores) {
            if (gameState.userScores.hasOwnProperty(key) && typeof newScores[key] === 'number') {
                const clampedScore = Math.max(0, Math.min(10, newScores[key]));
                if (gameState.userScores[key] !== clampedScore) {
                    gameState.userScores[key] = clampedScore;
                    updated = true;
                }
            }
        }
        if (updated) saveGameState();
    } else { console.warn("Invalid scores object:", newScores); }
}

export function updateSingleScore(elementKey, score) {
     if (gameState.userScores.hasOwnProperty(elementKey) && typeof score === 'number') {
         const clampedScore = Math.max(0, Math.min(10, score));
         if (gameState.userScores[elementKey] !== clampedScore) {
             gameState.userScores[elementKey] = clampedScore;
             saveGameState();
         }
     }
}

export function updateAnswers(elementName, answersForElement) {
    if (!gameState.userAnswers) gameState.userAnswers = {};
    gameState.userAnswers[elementName] = { ...(answersForElement || {}) };
    // Saving deferred until nav/finalize
}

export function saveAllAnswers(allAnswers) {
    gameState.userAnswers = { ...(allAnswers || {}) };
    saveGameState();
}

export function updateElementIndex(index) {
    gameState.currentElementIndex = index;
    // Saving deferred
}

export function addDiscoveredConcept(conceptId, conceptData) {
    if (!gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.set(conceptId, {
            concept: conceptData, discoveredTime: Date.now(), artUnlocked: false, notes: ""
        });
        saveGameState();
        return true;
    }
    return false;
}

export function removeDiscoveredConcept(conceptId) {
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        // Remove focus if present
        if (gameState.focusedConcepts.has(conceptId)) {
            gameState.focusedConcepts.delete(conceptId);
        }
        saveGameState();
        return true;
    }
    return false;
}

export function toggleFocusConcept(conceptId) {
    if (!gameState.discoveredConcepts.has(conceptId)) return 'not_discovered';

    if (gameState.focusedConcepts.has(conceptId)) {
        gameState.focusedConcepts.delete(conceptId);
        saveGameState();
        return 'removed';
    } else {
        if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) {
            return 'slots_full';
        }
        gameState.focusedConcepts.add(conceptId);
        // Advance onboarding if this is the first focus
        if (getOnboardingPhase() === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE && gameState.focusedConcepts.size >= 1){
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        }
        saveGameState();
        return 'added';
    }
}

export function updateNotes(conceptId, notes) {
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data) {
        if (data.notes !== notes) { // Only save if changed
            data.notes = notes;
            gameState.discoveredConcepts.set(conceptId, data);
            saveGameState();
        }
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
    if (gameState.userInsight !== previousInsight) {
        saveGameState();
        return true;
    }
    return false;
}

export function updateAttunement(elementKey, amount) {
    if (!gameState.elementAttunement.hasOwnProperty(elementKey) || typeof amount !== 'number' || isNaN(amount) || amount === 0) {
        return false;
    }
    const current = gameState.elementAttunement[elementKey];
    const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
    if (newValue !== current) {
        gameState.elementAttunement[elementKey] = newValue;
        saveGameState();
        // Check for phase advancement triggers related to attunement
        if (newValue >= 20 && getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) {
             // Example trigger - refine as needed
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
        }
        return true;
    }
    return false;
}

export function updateAllAttunement(amount) {
    let changed = false;
    for (const key in gameState.elementAttunement) {
        // Use the single update function which handles saving
        if (updateAttunement(key, amount)) {
            changed = true;
        }
    }
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
          saveGameState(); // Save progress
          return ritualData.progress;
     }
     return ritualData.progress;
}

export function markRitualComplete(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
    // Ensure progress reflects completion state if setting manually
    const requiredCount = 1; // TODO: Get actual count from ritual definition if needed
    gameState.completedRituals[period][ritualId] = { completed: true, progress: requiredCount };
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
    if (gameState.freeResearchAvailableToday) {
        gameState.freeResearchAvailableToday = false;
        saveGameState();
    }
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
    // No save here, done by resetReflectionTrigger
}
export function resetReflectionTrigger(setCooldown = true) {
    gameState.cardsAddedSinceLastPrompt = 0;
    if (setCooldown) {
        gameState.promptCooldownActive = true;
    }
    saveGameState(); // Save state when counter resets/cooldown set
}
export function clearReflectionCooldown() {
    if (gameState.promptCooldownActive) {
        gameState.promptCooldownActive = false;
        saveGameState();
    }
}

export function addRepositoryItem(type, itemId) {
    if (gameState.discoveredRepositoryItems.hasOwnProperty(type)) {
        const itemSet = gameState.discoveredRepositoryItems[type];
        if (!itemSet.has(itemId)) {
            itemSet.add(itemId);
            saveGameState();
            return true;
        }
    } else { console.warn(`Unknown repository type: ${type}`); }
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
    // Allow advancing phase only forwards, or jumping if targetPhase is provided
    const nextPhase = targetPhase !== null ? Math.max(currentPhase, targetPhase) : currentPhase + 1;

    if (nextPhase > currentPhase && nextPhase <= Config.ONBOARDING_PHASE.ADVANCED) {
        gameState.currentOnboardingPhase = nextPhase;
        console.log(`Advanced onboarding phase to: ${nextPhase}`);
        saveGameState();
        return true; // Indicate phase changed
    }
    return false; // Indicate phase did not change
}

// --- Persistence ---
let saveIndicatorTimeout = null;
function showSaveIndicatorUI() { // Keep this internal to state.js for now
    const indicator = document.getElementById('saveIndicator');
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
            ...gameState, // Include all properties
            // Overwrite collections with serializable versions
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
        // console.log("Game state saved."); // Less verbose logging
    } catch (error) {
        console.error("Error saving game state:", error);
        // Need UI function for message, imported now
        showTemporaryMessage("Error: Could not save progress!", 4000);
    }
}

export function loadGameState() {
    console.log("Attempting to load game state...");
    const savedData = localStorage.getItem(Config.SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found, merging with defaults...");

            // Create a new default state to merge into
            const newState = getDefaultState();

            // Merge loaded data carefully, converting arrays back to Maps/Sets
            for (const key in loadedState) {
                // Only merge keys that exist in the default state to avoid adding old/invalid keys
                if (newState.hasOwnProperty(key)) {
                    if (key === 'discoveredConcepts' && Array.isArray(loadedState.discoveredConcepts)) {
                        newState.discoveredConcepts = new Map(loadedState.discoveredConcepts);
                    } else if ((key === 'focusedConcepts' || key === 'seenPrompts' || key === 'achievedMilestones' || key === 'unlockedFocusItems') && Array.isArray(loadedState[key])) {
                        newState[key] = new Set(loadedState[key]);
                    } else if (key === 'discoveredRepositoryItems' && typeof loadedState.discoveredRepositoryItems === 'object') {
                         newState.discoveredRepositoryItems = {
                              scenes: new Set(loadedState.discoveredRepositoryItems?.scenes || []),
                              experiments: new Set(loadedState.discoveredRepositoryItems?.experiments || []),
                              insights: new Set(loadedState.discoveredRepositoryItems?.insights || [])
                         };
                    } else if (key === 'completedRituals' && typeof loadedState.completedRituals === 'object') {
                         newState.completedRituals = {
                              daily: loadedState.completedRituals?.daily || {},
                              weekly: loadedState.completedRituals?.weekly || {} // Keep weekly if added later
                         };
                    } else if (key === 'userAnswers' && typeof loadedState.userAnswers !== 'object') {
                         console.warn("Loaded userAnswers is not an object, resetting.");
                         newState.userAnswers = {}; // Reset if invalid type
                    } else if (key === 'pendingRarePrompts' && !Array.isArray(loadedState.pendingRarePrompts)){
                         console.warn("Loaded pendingRarePrompts is not an array, resetting.");
                         newState.pendingRarePrompts = [];
                    }
                     else {
                        // Directly assign other primitive types or plain objects if type matches default
                        // This prevents loading e.g. a string into a number field if save format changed drastically
                         if (typeof loadedState[key] === typeof newState[key]) {
                           newState[key] = loadedState[key];
                         } else {
                            console.warn(`Type mismatch for key "${key}" during load. Loaded: ${typeof loadedState[key]}, Expected: ${typeof newState[key]}. Using default.`);
                         }
                    }
                } else {
                     console.warn(`Ignoring unknown key "${key}" from saved data.`);
                }
            }

            // Ensure essential nested objects exist if somehow missing after load
            if (!newState.discoveredRepositoryItems) newState.discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() };
            if (!newState.completedRituals) newState.completedRituals = { daily: {}, weekly: {} };


            // Assign the merged state back to the main gameState variable
            gameState = newState;

            console.log("Game state loaded and merged successfully.");
            return true;
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(Config.SAVE_KEY);
            gameState = getDefaultState(); // Reset to default on error
            // Can't reliably call UI.showTemporaryMessage here as UI might not be ready
            // The caller (main.js) should handle displaying a message
            return false;
        }
    } else {
        console.log("No saved game state found.");
        gameState = getDefaultState(); // Ensure default state
        return false;
    }
}

export function clearGameState() {
    console.log("Clearing saved game state...");
    localStorage.removeItem(Config.SAVE_KEY);
    gameState = getDefaultState(); // Reset runtime state
    console.log("Game state reset.");
    // UI message handled by caller
}

console.log("state.js loaded.");
