// js/state.js - Manages Game State Variables and Persistence
import * as Config from './config.js';
// Import UI only for showing messages during load/save errors
import { showTemporaryMessage } from './ui.js'; // Be cautious with UI imports here

console.log("state.js loading...");

// --- Default State ---
const getDefaultState = () => ({
    currentOnboardingPhase: Config.ONBOARDING_PHASE.START,
    questionnaireCompleted: false,
    currentElementIndex: 0,
    userScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 },
    userAnswers: {}, // Stores answers per element { elementName: { qId: answer, ... } }
    discoveredConcepts: new Map(), // conceptId -> { concept: {}, discoveredTime: timestamp, artUnlocked: bool, notes: string }
    focusedConcepts: new Set(), // conceptId
    focusSlotsTotal: Config.INITIAL_FOCUS_SLOTS,
    userInsight: Config.INITIAL_INSIGHT,
    elementAttunement: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
    unlockedDeepDiveLevels: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
    seenPrompts: new Set(), // promptId
    completedRituals: { daily: {}, weekly: {} }, // { ritualId: { completed: bool, progress: number } }
    achievedMilestones: new Set(), // milestoneId
    lastLoginDate: null, // Stores result of new Date().toDateString()
    freeResearchAvailableToday: false, // Tracks if daily free research is used
    cardsAddedSinceLastPrompt: 0, // Counter for triggering standard reflections
    promptCooldownActive: false, // Flag to prevent reflection triggers during cooldown
    discoveredRepositoryItems: { scenes: new Set(), experiments: new Set(), insights: new Set() }, // Stores IDs
    pendingRarePrompts: [], // Array of rare prompt IDs queued for display
    unlockedFocusItems: new Set(), // Stores IDs of focusDrivenUnlocks definitions that have been achieved

    // *** NEW: State for Tapestry Deep Dive ***
    deepDiveViewedNodes: new Set(), // Stores node IDs viewed *for the current focus set* (e.g., 'elemental', 'archetype') - Resets on focus change.
    contemplationCooldownEnd: null, // Timestamp when the next Focused Contemplation is available.
    currentFocusSetHash: null // Hash representing the current set of focused concept IDs, used to detect changes.
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
    // Return copies to prevent direct mutation of state Sets
    scenes: new Set(gameState.discoveredRepositoryItems.scenes),
    experiments: new Set(gameState.discoveredRepositoryItems.experiments),
    insights: new Set(gameState.discoveredRepositoryItems.insights)
});
export const getUnlockedFocusItems = () => new Set(gameState.unlockedFocusItems);
export const isFreeResearchAvailable = () => gameState.freeResearchAvailableToday;
export const getPendingRarePrompts = () => [...gameState.pendingRarePrompts]; // Return copy

// *** NEW: Deep Dive Getters ***
export const getDeepDiveViewedNodes = () => new Set(gameState.deepDiveViewedNodes);
export const getContemplationCooldownEnd = () => gameState.contemplationCooldownEnd;
export const getCurrentFocusSetHash = () => gameState.currentFocusSetHash;


// --- State Mutators (Setters/Updaters) ---

// Helper function to generate a hash from the focused concepts set
function generateFocusSetHash(focusedSet) {
    if (!focusedSet || focusedSet.size === 0) return null;
    // Sort IDs to ensure consistent hash regardless of insertion order
    const sortedIds = Array.from(focusedSet).sort((a, b) => a - b);
    return sortedIds.join(','); // Simple comma-separated string as hash
}

// Fallback function in case dynamic import fails during questionnaire completion
function fallbackSetQuestionnaireComplete() {
    console.warn("Using fallback for questionnaire completion.");
    gameState.questionnaireCompleted = true;
    gameState.currentElementIndex = 6; // Assume 6 elements
    advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE); // Use internal function
    saveGameState();
}

export function setQuestionnaireComplete() {
    gameState.questionnaireCompleted = true;
    // Ensure index reflects completion, attempting to get length dynamically
    try {
        import('../data.js').then(Data => {
            const elementCount = (Data && Data.elementNames) ? Data.elementNames.length : 6;
            gameState.currentElementIndex = elementCount;
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
            saveGameState();
        }).catch(e => {
            console.error("Error getting elementNames length in setQuestionnaireComplete, falling back:", e);
            fallbackSetQuestionnaireComplete();
        });
    } catch (e) {
        console.error("Error setting questionnaire complete state (synchronous catch):", e);
        fallbackSetQuestionnaireComplete();
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
    } else { console.warn("Invalid scores object passed to updateScores:", newScores); }
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
    // Saving deferred
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
    let focusChanged = false;
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        if (gameState.focusedConcepts.has(conceptId)) {
            gameState.focusedConcepts.delete(conceptId);
            focusChanged = true; // Mark that focus changed
        }
        // *** NEW: Check and potentially reset Deep Dive state if focus changed ***
        if (focusChanged) {
            checkAndResetDeepDiveState();
        }
        saveGameState();
        return true;
    }
    return false;
}

export function toggleFocusConcept(conceptId) {
    if (!gameState.discoveredConcepts.has(conceptId)) {
        console.warn(`Attempted to toggle focus on undiscovered concept ID: ${conceptId}`);
        return 'not_discovered';
    }
    let focusChanged = false;
    let result = '';

    if (gameState.focusedConcepts.has(conceptId)) {
        gameState.focusedConcepts.delete(conceptId);
        focusChanged = true;
        result = 'removed';
    } else {
        if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) {
            return 'slots_full';
        }
        gameState.focusedConcepts.add(conceptId);
        focusChanged = true;
        result = 'added';
        if (getOnboardingPhase() === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE && gameState.focusedConcepts.size >= 1){
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        }
    }

    // *** NEW: Check and potentially reset Deep Dive state if focus changed ***
    if (focusChanged) {
        checkAndResetDeepDiveState();
        saveGameState(); // Save after potential reset
    }

    return result;
}

// *** NEW: Helper to manage Deep Dive state on focus change ***
function checkAndResetDeepDiveState() {
    const newHash = generateFocusSetHash(gameState.focusedConcepts);
    if (newHash !== gameState.currentFocusSetHash) {
        console.log("Focus set changed, resetting Deep Dive viewed nodes.");
        gameState.deepDiveViewedNodes = new Set(); // Reset viewed nodes
        gameState.currentFocusSetHash = newHash; // Update hash
        // Cooldown for contemplation might persist or reset based on design choice. Let's keep it persistent for now.
    }
}


export function updateNotes(conceptId, notes) {
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data) {
        if (data.notes !== notes) {
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
    if (!gameState.elementAttunement.hasOwnProperty(elementKey)) {
        console.warn(`Attempted to update attunement for invalid key: ${elementKey}`);
        return false;
    }
    if (typeof amount !== 'number' || isNaN(amount) || amount === 0) { return false; }
    const current = gameState.elementAttunement[elementKey];
    const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
    if (newValue !== current) {
        gameState.elementAttunement[elementKey] = newValue;
        saveGameState();
        if (newValue >= 10 && getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS);
        }
         else if (newValue >= 25 && getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) {
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
         }
        return true;
    }
    return false;
}

export function updateAllAttunement(amount) {
    let changed = false;
    for (const key in gameState.elementAttunement) {
        if (updateAttunement(key, amount)) { changed = true; }
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
     if (!gameState.completedRituals[period][ritualId]) {
          gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 };
     }
     const ritualData = gameState.completedRituals[period][ritualId];
     if (!ritualData.completed) {
          ritualData.progress++;
          saveGameState();
          return ritualData.progress;
     }
     return ritualData.progress;
}

export function markRitualComplete(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
    const requiredCount = 1; // Assuming count 1 for manual marking
    gameState.completedRituals[period][ritualId] = { completed: true, progress: requiredCount };
    saveGameState();
}

export function resetDailyRituals() {
    gameState.completedRituals.daily = {};
    gameState.freeResearchAvailableToday = true;
    gameState.lastLoginDate = new Date().toDateString();
    gameState.contemplationCooldownEnd = null; // Reset contemplation cooldown on new day
    console.log("Daily state reset triggered in state.js (incl. contemplation cooldown)");
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
    // No save here
}
export function resetReflectionTrigger(setCooldown = true) {
    gameState.cardsAddedSinceLastPrompt = 0;
    if (setCooldown) { gameState.promptCooldownActive = true; }
    saveGameState();
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

// *** NEW: Deep Dive Mutators ***
export function addDeepDiveViewedNode(nodeId) {
    if (!gameState.deepDiveViewedNodes.has(nodeId)) {
        gameState.deepDiveViewedNodes.add(nodeId);
        saveGameState(); // Save when a node is viewed for the first time this focus set
        return true;
    }
    return false;
}

export function setContemplationCooldown(durationMillis) {
    gameState.contemplationCooldownEnd = Date.now() + durationMillis;
    saveGameState();
}


// Internal function to handle phase advancement and UI update call
function advanceOnboardingPhase(targetPhase = null) {
    const currentPhase = gameState.currentOnboardingPhase;
    const nextPhase = targetPhase !== null ? Math.max(currentPhase, targetPhase) : currentPhase + 1;
    if (nextPhase > currentPhase && nextPhase <= Config.ONBOARDING_PHASE.ADVANCED) {
        gameState.currentOnboardingPhase = nextPhase;
        console.log(`Advanced onboarding phase to: ${nextPhase}`);
        saveGameState();
        import('./ui.js').then(UI => {
            if (UI && typeof UI.applyOnboardingPhaseUI === 'function') {
                UI.applyOnboardingPhaseUI(nextPhase);
            } else { console.error("UI module or applyOnboardingPhaseUI function not found after import."); }
        }).catch(err => console.error("Failed to import UI for onboarding update:", err));
        return true;
    }
    return false;
}

export function triggerPhaseAdvance(targetPhase) {
    return advanceOnboardingPhase(targetPhase);
}


// --- Persistence ---
let saveIndicatorTimeout = null;
function showSaveIndicatorUI() {
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
        // Ensure hash is up-to-date before saving
        gameState.currentFocusSetHash = generateFocusSetHash(gameState.focusedConcepts);

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
            deepDiveViewedNodes: Array.from(gameState.deepDiveViewedNodes), // Save viewed nodes
        };
        localStorage.setItem(Config.SAVE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
        console.error("Error saving game state:", error);
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
            const newState = getDefaultState();

            for (const key in loadedState) {
                if (newState.hasOwnProperty(key)) {
                    const loadedValue = loadedState[key];
                    const defaultValue = newState[key];

                    if (key === 'discoveredConcepts' && Array.isArray(loadedValue)) { newState.discoveredConcepts = new Map(loadedValue); }
                    else if ((key === 'focusedConcepts' || key === 'seenPrompts' || key === 'achievedMilestones' || key === 'unlockedFocusItems' || key === 'deepDiveViewedNodes') && Array.isArray(loadedValue)) { newState[key] = new Set(loadedValue); } // Load deep dive nodes
                    else if (key === 'discoveredRepositoryItems' && typeof loadedValue === 'object' && loadedValue !== null) { newState.discoveredRepositoryItems = { scenes: new Set(loadedValue.scenes || []), experiments: new Set(loadedValue.experiments || []), insights: new Set(loadedValue.insights || []) }; }
                    else if (key === 'completedRituals' && typeof loadedValue === 'object' && loadedValue !== null) { newState.completedRituals = { daily: loadedValue.daily || {}, weekly: loadedValue.weekly || {} }; }
                    else if (key === 'userAnswers' && typeof loadedValue !== 'object') { console.warn("Loaded userAnswers is not an object, resetting."); newState.userAnswers = {}; }
                    else if (key === 'pendingRarePrompts' && !Array.isArray(loadedValue)){ console.warn("Loaded pendingRarePrompts is not an array, resetting."); newState.pendingRarePrompts = []; }
                    else { if (loadedValue !== undefined && loadedValue !== null) { if (typeof loadedValue === typeof defaultValue || key === 'lastLoginDate' || key === 'contemplationCooldownEnd') { newState[key] = loadedValue; } else { console.warn(`Type mismatch for key "${key}" during load. Loaded: ${typeof loadedValue}, Expected: ${typeof defaultValue}. Using default.`); } } }
                } else { console.warn(`Ignoring unknown key "${key}" from saved data.`); }
            }

            // Ensure essential nested objects/sets exist
            if (!newState.discoveredRepositoryItems) newState.discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() };
            if (!newState.completedRituals) newState.completedRituals = { daily: {}, weekly: {} };
            if (!newState.userAnswers) newState.userAnswers = {};
            if (!newState.pendingRarePrompts) newState.pendingRarePrompts = [];
            if (!newState.unlockedFocusItems) newState.unlockedFocusItems = new Set();
            if (!newState.deepDiveViewedNodes) newState.deepDiveViewedNodes = new Set(); // Ensure exists

            // Recalculate hash on load to ensure consistency
            newState.currentFocusSetHash = generateFocusSetHash(newState.focusedConcepts);

            gameState = newState;
            console.log("Game state loaded and merged successfully.");
            return true;
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(Config.SAVE_KEY);
            gameState = getDefaultState();
            return false;
        }
    } else {
        console.log("No saved game state found.");
        gameState = getDefaultState();
        return false;
    }
}

export function clearGameState() {
    console.log("Clearing saved game state...");
    localStorage.removeItem(Config.SAVE_KEY);
    gameState = getDefaultState(); // Reset runtime state
    console.log("Game state reset.");
}

export const SAVE_KEY = Config.SAVE_KEY;

console.log("state.js loaded.");
