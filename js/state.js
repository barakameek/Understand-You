
// --- START OF FILE state.js ---
// js/state.js - Manages Application State and Persistence (Enhanced v4.1 + XP/Leveling v1.0)
import * as Config from './config.js';
// Import elementNames for structure initialization and concepts for loading enrichment
import { elementNames, concepts } from '../data.js';
import { formatTimestamp } from './utils.js'; // For Insight Log timestamp
import * as UI from './ui.js'; // Needed for checkElementLevelUp UI feedback

console.log("state.js loading... (Enhanced v4.1 + XP/Leveling v1.0)");

// Default game state structure (now includes XP, Element Levels, Tokens, card unlocks)
const createInitialGameState = () => {
    const initial = {
        // --- Core Gameplay ---
        userScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5, RF: 5 }, // Element scores (0-10)
        userAnswers: {}, // Questionnaire answers { [elementNameKey]: { qId: answer } }
        discoveredConcepts: new Map(), // Map<conceptId, { concept: object, discoveredTime: number, notes: string, unlockedLoreLevel: number, userCategory: string, newLoreAvailable: boolean, unlocks: object }>
        focusedConcepts: new Set(), // Set<conceptId>
        focusSlotsTotal: Config.INITIAL_FOCUS_SLOTS,
        userInsight: Config.INITIAL_INSIGHT,
        elementAttunement: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0, RF: 0 }, // Element attunement (0-100)
        unlockedDeepDiveLevels: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0, RF: 0 }, // Element Library levels (0-3)

        // --- Progress & Meta ---
        achievedMilestones: new Set(), // Set<milestoneId>
        completedRituals: { daily: {}, weekly: {} }, // { [ritualId]: { completed: boolean, progress: number } }
        lastLoginDate: null, // string | null
        freeResearchAvailableToday: true,
        initialFreeResearchRemaining: Config.INITIAL_FREE_RESEARCH_COUNT,
        seenPrompts: new Set(), // Set<promptId>
        currentElementIndex: -1, // Questionnaire index
        questionnaireCompleted: false,
        cardsAddedSinceLastPrompt: 0, // Counter for reflection trigger
        promptCooldownActive: false,
        discoveredRepositoryItems: { scenes: new Set(), experiments: new Set(), insights: new Set() },
        pendingRarePrompts: [], // Array<promptId>
        unlockedFocusItems: new Set(), // Set<focusUnlockId> (From focus synergy)
        currentFocusSetHash: '', // Cache for tapestry calculation
        contemplationCooldownEnd: null, // timestamp | null
        insightBoostCooldownEnd: null, // timestamp | null

        // --- Onboarding ---
        onboardingPhase: 0, // 0 = not started, 1-N = current step, 99 = skipped
        onboardingComplete: false,

        // --- Logs & UI State ---
        insightLog: [], // Array<{ timestamp: string, amount: number, source: string, newTotal: number }>

        // --- XP & Level System (NEW v1.0) ---
        elementXP: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0, RF: 0 }, // Current XP for each element
        elementLevel: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0, RF: 0 }, // Current Level (0-3) for each element
        levelTokens: 0, // Currency earned by leveling up elements
        dailyXPLog: { date: null, totalEarned: 0 } // Tracks daily XP gain to enforce cap
    };
    // Initialize userAnswers structure for all elements using elementNames from data.js
    elementNames.forEach(name => {
        initial.userAnswers[name] = {};
    });
    return initial;
};

// --- Default Card Unlock Structure ---
const createDefaultCardUnlockState = () => ({
    microStory: { unlocked: false },
    sceneSeed: { unlocked: false },
    deepLore: { unlocked: false },
    crossover: { unlocked: false, completed: false }, // Track completion separately
    secretScene: { unlocked: false },
    altSkin: { unlocked: false, selectedSkin: 0 }, // 0 = default, 1/2 = alt skins
    perk: { unlocked: false, choice: null } // choice: 'insightBonus' or 'researchDiscount'
});

let gameState = createInitialGameState();

// --- Internal Helper ---
// Calculates a simple hash based on sorted focused concept IDs.
function _calculateFocusSetHash() {
    if (!(gameState.focusedConcepts instanceof Set) || gameState.focusedConcepts.size === 0) {
        return '';
    }
    const sortedIds = Array.from(gameState.focusedConcepts).map(Number).sort((a, b) => a - b);
    return sortedIds.join(',');
}

// --- Saving & Loading ---
let saveTimeout = null;
const SAVE_DELAY = 1200; // Milliseconds

// Triggers a debounced save to localStorage
function _triggerSave() {
     const saveIndicator = document.getElementById('saveIndicator');
     if (saveIndicator) {
         saveIndicator.classList.remove('hidden'); // Show saving indicator
     }

     if (saveTimeout) clearTimeout(saveTimeout); // Clear existing timeout if any

     saveTimeout = setTimeout(() => {
         try {
             // Prepare state for saving: Convert Sets/Maps to Arrays/plain objects
             const stateToSave = {
                 ...gameState, // Spread basic properties (scores, insight, flags, cooldowns, XP/Levels/Tokens etc.)
                 // --- Convert complex types ---
                 discoveredConcepts: Array.from(gameState.discoveredConcepts.entries()).map(([id, data]) => [id, {
                    // Save only necessary metadata, not the full concept object
                    discoveredTime: data.discoveredTime,
                    notes: data.notes,
                    unlockedLoreLevel: data.unlockedLoreLevel, // Still keep this for legacy lore? Review if needed.
                    userCategory: data.userCategory,
                    newLoreAvailable: data.newLoreAvailable,
                    unlocks: data.unlocks // **NEW**: Save the unlock state object directly
                 }]),
                 focusedConcepts: Array.from(gameState.focusedConcepts),
                 achievedMilestones: Array.from(gameState.achievedMilestones),
                 seenPrompts: Array.from(gameState.seenPrompts),
                 discoveredRepositoryItems: {
                     scenes: Array.from(gameState.discoveredRepositoryItems.scenes),
                     experiments: Array.from(gameState.discoveredRepositoryItems.experiments),
                     insights: Array.from(gameState.discoveredRepositoryItems.insights),
                 },
                 unlockedFocusItems: Array.from(gameState.unlockedFocusItems),
                 insightLog: gameState.insightLog, // Already serializable
                 // UserAnswers, Attunement, DeepDiveLevels, ElementXP, ElementLevel are plain objects
                 completedRituals: gameState.completedRituals, // Already serializable
                 dailyXPLog: gameState.dailyXPLog // Already serializable
             };
             localStorage.setItem(Config.SAVE_KEY, JSON.stringify(stateToSave));
             // console.log(`Game state saved at ${new Date().toLocaleTimeString()}`);
         } catch (error) {
            console.error("Error saving game state:", error);
            // Optionally show error to user UI.showTemporaryMessage("Save Failed!", 3000);
         }
         finally {
            if (saveIndicator) {
                saveIndicator.classList.add('hidden'); // Hide indicator
            }
            saveTimeout = null;
         }
     }, SAVE_DELAY);
}

// Public function to trigger save
export function saveGameState(forceImmediate = false) {
    if (forceImmediate) {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = null;
        _triggerSave(); // This still has the internal delay, but avoids debounce queue
    } else {
        _triggerSave(); // Trigger debounced save
    }
}

// Helper to merge element-keyed objects ensuring all 7 keys (A-RF) exist
const mergeElementObject = (target, source, defaultValue) => {
    let result = { ...target }; // Start with default structure (A...RF keys)
    if (typeof source === 'object' && source !== null) {
        for (const key in source) {
            if (result.hasOwnProperty(key)) { // Only merge known keys
                if (typeof source[key] === typeof defaultValue || defaultValue === null) {
                    result[key] = source[key];
                } else {
                    console.warn(`Load Warning: Type mismatch for key "${key}" in saved object. Expected ${typeof defaultValue}, got ${typeof source[key]}. Using default.`);
                    result[key] = defaultValue;
                }
            } else {
                console.warn(`Load Warning: Ignoring unknown key "${key}" found in saved element object.`);
            }
        }
    }
    // Ensure all expected keys exist with a default value if missing or invalid
    elementNames.forEach(nameKey => {
         const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === nameKey);
         if (key && (result[key] === undefined || typeof result[key] !== typeof defaultValue)) {
             result[key] = defaultValue;
             // console.log(`Load Info: Element key ${key} missing or invalid, set to default: ${defaultValue}`);
         }
    });
    return result;
};


// Attempts to load game state from localStorage
export function loadGameState() {
    console.log("Attempting to load game state from key:", Config.SAVE_KEY);
    const savedData = localStorage.getItem(Config.SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found. Merging into fresh state...");

            gameState = createInitialGameState(); // Start fresh

            // --- Merge Core State (Scores, Attunement, Deep Dive, XP, Levels) ---
            gameState.userScores = mergeElementObject(gameState.userScores, loadedState.userScores, 5.0);
            gameState.elementAttunement = mergeElementObject(gameState.elementAttunement, loadedState.elementAttunement, 0);
            gameState.unlockedDeepDiveLevels = mergeElementObject(gameState.unlockedDeepDiveLevels, loadedState.unlockedDeepDiveLevels, 0);
            // **NEW**: Merge XP and Level data
            gameState.elementXP = mergeElementObject(gameState.elementXP, loadedState.elementXP, 0);
            gameState.elementLevel = mergeElementObject(gameState.elementLevel, loadedState.elementLevel, 0);
            gameState.levelTokens = typeof loadedState.levelTokens === 'number' ? loadedState.levelTokens : 0;

            // --- Merge User Answers ---
             if (typeof loadedState.userAnswers === 'object' && loadedState.userAnswers !== null) {
                gameState.userAnswers = loadedState.userAnswers;
                elementNames.forEach(name => { if (!gameState.userAnswers[name]) gameState.userAnswers[name] = {}; });
            } else { elementNames.forEach(name => gameState.userAnswers[name] = {}); }

            // --- Restore Collections (Maps & Sets) ---
            // Rehydrate discoveredConcepts Map carefully, including the new 'unlocks' structure
            if (Array.isArray(loadedState.discoveredConcepts)) {
                 const rehydratedMap = new Map();
                 loadedState.discoveredConcepts.forEach(([id, savedConceptData]) => {
                    if (typeof id !== 'number' || typeof savedConceptData !== 'object' || savedConceptData === null) {
                         console.warn(`Load Warning: Invalid entry format in discoveredConcepts array for ID ${id}. Skipping.`); return;
                    }
                    const conceptDataFromSource = concepts.find(c => c.id === id);
                    if (!conceptDataFromSource) {
                        console.warn(`Load Warning: Concept data for saved ID ${id} not found in current data.js. Skipping.`); return;
                    }
                    // **NEW**: Rehydrate unlock state, merging with default if missing/invalid
                    let cardUnlocks = createDefaultCardUnlockState(); // Start with default
                    if(savedConceptData.unlocks && typeof savedConceptData.unlocks === 'object'){
                        // Merge saved unlocks over default, ensuring all keys exist
                        for(const key in cardUnlocks){
                            if(savedConceptData.unlocks.hasOwnProperty(key) && typeof savedConceptData.unlocks[key] === typeof cardUnlocks[key]){
                                // Basic type check before assignment
                                cardUnlocks[key] = savedConceptData.unlocks[key];
                            } else if(savedConceptData.unlocks.hasOwnProperty(key)) {
                                console.warn(`Load Warning: Type mismatch or invalid data for unlock key '${key}' on concept ${id}. Using default.`);
                            }
                        }
                    } else if(savedConceptData.unlocks !== undefined) {
                         console.warn(`Load Warning: Invalid 'unlocks' data for concept ${id}. Initializing defaults.`);
                    }

                    rehydratedMap.set(id, {
                       concept: conceptDataFromSource,
                       discoveredTime: savedConceptData.discoveredTime || Date.now(),
                       notes: savedConceptData.notes || "",
                       unlockedLoreLevel: savedConceptData.unlockedLoreLevel || 0, // Keep for now
                       userCategory: savedConceptData.userCategory || 'uncategorized',
                       newLoreAvailable: savedConceptData.newLoreAvailable || false,
                       unlocks: cardUnlocks // Set the hydrated/defaulted unlocks object
                   });
                });
                gameState.discoveredConcepts = rehydratedMap;
            } else { gameState.discoveredConcepts = new Map(); }

            // Helper to restore Sets safely
            const restoreSet = (key, defaultSet = new Set(), sourceObj = loadedState) => {
                 if (sourceObj && Array.isArray(sourceObj[key])) {
                     try {
                         const validItems = sourceObj[key].filter(item => typeof item === 'number' || typeof item === 'string');
                         return new Set(validItems);
                     } catch (e) { return defaultSet; }
                 } return defaultSet;
            };
            gameState.focusedConcepts = restoreSet('focusedConcepts', gameState.focusedConcepts);
            gameState.achievedMilestones = restoreSet('achievedMilestones', gameState.achievedMilestones);
            gameState.seenPrompts = restoreSet('seenPrompts', gameState.seenPrompts);
            gameState.unlockedFocusItems = restoreSet('unlockedFocusItems', gameState.unlockedFocusItems);
            gameState.discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() };
            if (typeof loadedState.discoveredRepositoryItems === 'object' && loadedState.discoveredRepositoryItems !== null) {
                gameState.discoveredRepositoryItems.scenes = restoreSet('scenes', gameState.discoveredRepositoryItems.scenes, loadedState.discoveredRepositoryItems);
                gameState.discoveredRepositoryItems.experiments = restoreSet('experiments', gameState.discoveredRepositoryItems.experiments, loadedState.discoveredRepositoryItems);
                gameState.discoveredRepositoryItems.insights = restoreSet('insights', gameState.discoveredRepositoryItems.insights, loadedState.discoveredRepositoryItems);
            }

            // --- Merge Primitive/Simple Object Types (with defaults) ---
            const mergeSimple = (key, defaultValue) => {
                 const loadedValue = loadedState ? loadedState[key] : undefined;
                 return (loadedValue !== undefined && loadedValue !== null && (typeof loadedValue === typeof defaultValue || defaultValue === null)) ? loadedValue : defaultValue;
            };

            gameState.focusSlotsTotal = mergeSimple('focusSlotsTotal', Config.INITIAL_FOCUS_SLOTS);
            gameState.userInsight = mergeSimple('userInsight', Config.INITIAL_INSIGHT);
            gameState.completedRituals = mergeSimple('completedRituals', { daily: {}, weekly: {} });
            gameState.lastLoginDate = mergeSimple('lastLoginDate', null);
            gameState.freeResearchAvailableToday = mergeSimple('freeResearchAvailableToday', true);
            gameState.initialFreeResearchRemaining = mergeSimple('initialFreeResearchRemaining', Config.INITIAL_FREE_RESEARCH_COUNT);
            gameState.currentElementIndex = mergeSimple('currentElementIndex', -1);
            gameState.questionnaireCompleted = mergeSimple('questionnaireCompleted', false);
            gameState.cardsAddedSinceLastPrompt = mergeSimple('cardsAddedSinceLastPrompt', 0);
            gameState.promptCooldownActive = mergeSimple('promptCooldownActive', false);
            gameState.contemplationCooldownEnd = mergeSimple('contemplationCooldownEnd', null);
            gameState.insightBoostCooldownEnd = mergeSimple('insightBoostCooldownEnd', null);
            gameState.pendingRarePrompts = Array.isArray(loadedState?.pendingRarePrompts) ? loadedState.pendingRarePrompts : [];
            gameState.onboardingPhase = mergeSimple('onboardingPhase', 0);
            const loadedOnboardingComplete = mergeSimple('onboardingComplete', false);
            gameState.onboardingComplete = loadedOnboardingComplete || gameState.questionnaireCompleted || gameState.onboardingPhase === 99;
            gameState.insightLog = Array.isArray(loadedState?.insightLog) ? loadedState.insightLog.slice(-Config.INSIGHT_LOG_MAX_ENTRIES) : [];
            // **NEW**: Load daily XP log
            gameState.dailyXPLog = mergeSimple('dailyXPLog', { date: null, totalEarned: 0 });

            // Ensure onboarding flags are consistent
             if (!loadedOnboardingComplete && gameState.questionnaireCompleted && gameState.onboardingPhase !== 99) {
                 gameState.onboardingPhase = 99; // Mark explicitly skipped/done if Q done but onboarding wasn't tracked
                 gameState.onboardingComplete = true;
             }

             gameState.currentFocusSetHash = _calculateFocusSetHash();

             console.log("Game state loaded successfully.");
            return true;
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            clearGameState();
            return false;
        }
    } else {
        console.log("No saved game state found. Initializing fresh state.");
        gameState = createInitialGameState();
        if (Config.ONBOARDING_ENABLED) gameState.onboardingPhase = 1;
        return false;
    }
}


// Clears the saved state from localStorage and resets runtime state
export function clearGameState() {
     localStorage.removeItem(Config.SAVE_KEY);
     gameState = createInitialGameState(); // Reset runtime state
     if (Config.ONBOARDING_ENABLED && !gameState.onboardingComplete) gameState.onboardingPhase = 1;
     console.log("Game state cleared and reset to initial state.");
     saveGameState(true); // Save the cleared state immediately
}

// --- Getters ---
export function getState() { return { ...gameState }; }
export function getScores() { return { ...gameState.userScores }; }
export function getAttunement() { return { ...gameState.elementAttunement }; }
export function getInsight() { return gameState.userInsight; }
export function getDiscoveredConcepts() { return gameState.discoveredConcepts; }
export function getDiscoveredConceptData(conceptId) { return gameState.discoveredConcepts.get(conceptId); }
export function getFocusedConcepts() { return gameState.focusedConcepts; }
export function getFocusSlots() { return gameState.focusSlotsTotal; }
export function getRepositoryItems() { return gameState.discoveredRepositoryItems; }
export function getUnlockedFocusItems() { return gameState.unlockedFocusItems; }
export function getContemplationCooldownEnd() { return gameState.contemplationCooldownEnd; }
export function getInsightBoostCooldownEnd() { return gameState.insightBoostCooldownEnd; }
export function isFreeResearchAvailable() { return gameState.freeResearchAvailableToday; }
export function getInitialFreeResearchRemaining() { return gameState.initialFreeResearchRemaining; }
export function getSeenPrompts() { return gameState.seenPrompts; }
export function getCardCategory(conceptId) { return gameState.discoveredConcepts.get(conceptId)?.userCategory || 'uncategorized'; }
export function getUnlockedLoreLevel(conceptId) { return gameState.discoveredConcepts.get(conceptId)?.unlockedLoreLevel || 0; } // Kept for now
export function isNewLoreAvailable(conceptId) { return gameState.discoveredConcepts.get(conceptId)?.newLoreAvailable || false; } // Kept for now
export function getOnboardingPhase() { return gameState.onboardingPhase; }
export function isOnboardingComplete() { return gameState.onboardingComplete || gameState.onboardingPhase === 99; }
export function getInsightLog() { return [...gameState.insightLog]; }
export function getAchievedMilestones(){ return new Set(gameState.achievedMilestones); }
// --- NEW Getters ---
export function getElementLevel(elementKey) { return gameState.elementLevel[elementKey] ?? 0; }
export function getLevelTokens() { return gameState.levelTokens; }
export function getElementXP() { return { ...gameState.elementXP }; }
export function getDailyXPLog() { return { ...gameState.dailyXPLog }; }
export function getCardUnlockState(conceptId) { return gameState.discoveredConcepts.get(conceptId)?.unlocks; } // Get specific card's unlock object

// --- Setters / Updaters ---

// Scores, Answers, Questionnaire Flow
export function updateScores(newScores) { gameState.userScores = { ...gameState.userScores, ...newScores }; saveGameState(); return true; }
export function saveAllAnswers(allAnswers) { if (typeof allAnswers === 'object' && allAnswers !== null) { gameState.userAnswers = JSON.parse(JSON.stringify(allAnswers)); saveGameState(); } else { console.error("saveAllAnswers called with invalid data:", allAnswers); } }
export function updateAnswers(elementName, answersForElement) { if (!gameState.userAnswers) gameState.userAnswers = {}; if (!gameState.userAnswers[elementName]) gameState.userAnswers[elementName] = {}; if (typeof answersForElement === 'object' && answersForElement !== null) { gameState.userAnswers[elementName] = { ...answersForElement }; } /* No save here */ }
export function updateElementIndex(index) { if (typeof index === 'number') gameState.currentElementIndex = index; /* No save here */ }
export function setQuestionnaireComplete() { gameState.currentElementIndex = elementNames.length; if (!gameState.questionnaireCompleted) { gameState.questionnaireCompleted = true; if (!gameState.onboardingComplete && gameState.onboardingPhase !== 99) { gameState.onboardingComplete = true; gameState.onboardingPhase = 99; console.log("Marked onboarding complete/skipped upon questionnaire completion."); } saveGameState(); } return true; }

// Insight & Related Cooldowns/Features
export function changeInsight(amount, source = "Unknown") { const previousInsight = gameState.userInsight; const validAmount = (typeof amount === 'number' && !isNaN(amount)) ? amount : 0; if (validAmount === 0) return false; gameState.userInsight = Math.max(0, previousInsight + validAmount); const actualChange = gameState.userInsight - previousInsight; if (actualChange !== 0) { addInsightLogEntry(actualChange, source, gameState.userInsight); saveGameState(); return true; } return false; }
export function setInsightBoostCooldown(endTime) { if (typeof endTime === 'number' || endTime === null) { gameState.insightBoostCooldownEnd = endTime; saveGameState(); } }
export function setContemplationCooldown(endTime) { if (typeof endTime === 'number' || endTime === null) { gameState.contemplationCooldownEnd = endTime; saveGameState(); } }

// Research & Rituals
export function useInitialFreeResearch() { if (gameState.initialFreeResearchRemaining > 0) { gameState.initialFreeResearchRemaining--; saveGameState(); return true; } return false; }
export function setFreeResearchUsed() { gameState.freeResearchAvailableToday = false; saveGameState(); }
export function resetDailyRituals() { // Modified to include XP log reset
    if (typeof gameState.completedRituals !== 'object' || gameState.completedRituals === null) gameState.completedRituals = {};
    gameState.completedRituals.daily = {};
    gameState.freeResearchAvailableToday = true;
    gameState.lastLoginDate = new Date().toDateString();
    resetDailyXPLog(); // **NEW**: Reset daily XP tracker
    saveGameState();
}
export function completeRitualProgress(ritualId, period = 'daily') { if (!gameState.completedRituals?.[period]) { if (typeof gameState.completedRituals !== 'object' || gameState.completedRituals === null) gameState.completedRituals = {}; gameState.completedRituals[period] = {}; } if (!gameState.completedRituals[period][ritualId]) gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 }; const ritualState = gameState.completedRituals[period][ritualId]; if (!ritualState.completed) { ritualState.progress += 1; saveGameState(); } return ritualState.progress; }
export function markRitualComplete(ritualId, period = 'daily') { if (!gameState.completedRituals?.[period]?.[ritualId]) { if (!gameState.completedRituals?.[period]) { if (typeof gameState.completedRituals !== 'object' || gameState.completedRituals === null) gameState.completedRituals = {}; gameState.completedRituals[period] = {}; } gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 }; } if (gameState.completedRituals[period]?.[ritualId]) { gameState.completedRituals[period][ritualId].completed = true; saveGameState(); } }

// Attunement & Deep Dive
export function updateAttunement(elementKey, amount) { if (gameState.elementAttunement.hasOwnProperty(elementKey)) { const validAmount = (typeof amount === 'number' && !isNaN(amount)) ? amount : 0; if (validAmount === 0) return false; const current = gameState.elementAttunement[elementKey]; const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + validAmount)); if (newValue !== current) { gameState.elementAttunement[elementKey] = newValue; saveGameState(); return true; } } return false; }
export function unlockLibraryLevel(elementKey, level) { if (gameState.unlockedDeepDiveLevels.hasOwnProperty(elementKey)) { const currentLevel = gameState.unlockedDeepDiveLevels[elementKey] || 0; if (typeof level === 'number' && level === currentLevel + 1) { gameState.unlockedDeepDiveLevels[elementKey] = level; saveGameState(); return true; } } return false; }

// Concept Management (Discovered, Focus, Notes, Lore, Category, **Unlocks**)
export function addDiscoveredConcept(conceptId, conceptData) {
    if (!(gameState.discoveredConcepts instanceof Map)) { gameState.discoveredConcepts = new Map(); }
    if (typeof conceptId !== 'number' || typeof conceptData !== 'object' || conceptData === null) return false;

    if (!gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.set(conceptId, {
            concept: conceptData,
            discoveredTime: Date.now(),
            notes: "",
            unlockedLoreLevel: 0, // Keep for legacy system? Review if needed.
            userCategory: 'uncategorized',
            newLoreAvailable: false, // Keep for legacy system? Review if needed.
            unlocks: createDefaultCardUnlockState() // **NEW**: Initialize unlock structure
        });
        saveGameState();
        return true;
    }
    return false;
}
export function removeDiscoveredConcept(conceptId) { if (!(gameState.discoveredConcepts instanceof Map)) return false; if (gameState.discoveredConcepts.has(conceptId)) { gameState.discoveredConcepts.delete(conceptId); if (gameState.focusedConcepts instanceof Set && gameState.focusedConcepts.has(conceptId)) { gameState.focusedConcepts.delete(conceptId); gameState.currentFocusSetHash = _calculateFocusSetHash(); } saveGameState(); return true; } return false; }
export function toggleFocusConcept(conceptId) { if (!(gameState.discoveredConcepts instanceof Map)) return 'not_discovered'; if (!(gameState.focusedConcepts instanceof Set)) gameState.focusedConcepts = new Set(); if (!gameState.discoveredConcepts.has(conceptId)) return 'not_discovered'; let result; if (gameState.focusedConcepts.has(conceptId)) { gameState.focusedConcepts.delete(conceptId); result = 'removed'; } else { if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) return 'slots_full'; gameState.focusedConcepts.add(conceptId); result = 'added'; } gameState.currentFocusSetHash = _calculateFocusSetHash(); saveGameState(); return result; }
export function increaseFocusSlots(amount = 1) { const validAmount = (typeof amount === 'number' && amount > 0) ? Math.floor(amount) : 0; if (validAmount === 0) return false; const newSlots = Math.min(Config.MAX_FOCUS_SLOTS, gameState.focusSlotsTotal + validAmount); if (newSlots > gameState.focusSlotsTotal) { gameState.focusSlotsTotal = newSlots; saveGameState(); return true; } return false; }
export function updateNotes(conceptId, notes) { if (!(gameState.discoveredConcepts instanceof Map)) return false; const data = gameState.discoveredConcepts.get(conceptId); if (data) { const newNotes = (typeof notes === 'string') ? notes : ''; if (data.notes !== newNotes) { data.notes = newNotes; gameState.discoveredConcepts.set(conceptId, data); saveGameState(); } return true; } return false; }
export function setCardCategory(conceptId, categoryId) { if (!(gameState.discoveredConcepts instanceof Map)) return false; const data = gameState.discoveredConcepts.get(conceptId); if (data) { const newCategory = (typeof categoryId === 'string' && categoryId) ? categoryId : 'uncategorized'; if (data.userCategory !== newCategory) { data.userCategory = newCategory; gameState.discoveredConcepts.set(conceptId, data); saveGameState(); return true; } } return false; }
export function unlockLoreLevel(conceptId, level) { if (!(gameState.discoveredConcepts instanceof Map)) return false; const data = gameState.discoveredConcepts.get(conceptId); if (data) { const currentLevel = data.unlockedLoreLevel || 0; if (typeof level === 'number' && level > currentLevel) { data.unlockedLoreLevel = level; data.newLoreAvailable = true; gameState.discoveredConcepts.set(conceptId, data); saveGameState(); return true; } } return false; }
export function markLoreAsSeen(conceptId) { if (!(gameState.discoveredConcepts instanceof Map)) return false; const data = gameState.discoveredConcepts.get(conceptId); if (data && data.newLoreAvailable) { data.newLoreAvailable = false; gameState.discoveredConcepts.set(conceptId, data); saveGameState(); return true; } return false; }
// **NEW**: Function to update the unlock state for a specific card
export function updateCardUnlockState(conceptId, unlockKey, value) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("Cannot update unlock: discoveredConcepts is not Map."); return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data && data.unlocks && data.unlocks.hasOwnProperty(unlockKey)) {
        // Check if the value structure matches (simple boolean or object like {unlocked: bool, completed: bool})
        if (typeof value === 'object' && typeof data.unlocks[unlockKey] === 'object') {
            // Merge object properties (e.g., for crossover token)
            data.unlocks[unlockKey] = { ...data.unlocks[unlockKey], ...value };
        } else if (typeof value === typeof data.unlocks[unlockKey] || (typeof data.unlocks[unlockKey] === 'object' && typeof value === 'boolean' && data.unlocks[unlockKey].hasOwnProperty('unlocked'))) {
            // Handle direct boolean unlock or updating the 'unlocked' property of an object
             if(typeof data.unlocks[unlockKey] === 'object'){
                 data.unlocks[unlockKey].unlocked = value;
             } else {
                 data.unlocks[unlockKey] = value;
             }
        } else {
            console.error(`Type mismatch or invalid structure for unlock key '${unlockKey}' on concept ${conceptId}. Expected similar to ${JSON.stringify(data.unlocks[unlockKey])}, got ${JSON.stringify(value)}`);
            return false;
        }
        gameState.discoveredConcepts.set(conceptId, data); // Update map entry
        saveGameState(); // Save the change
        return true;
    } else {
        console.error(`Cannot update unlock state: Concept ${conceptId} or unlock key '${unlockKey}' not found or invalid.`);
    }
    return false;
}

// Reflection & Repository Management (No changes needed here for XP system itself)
export function addSeenPrompt(promptId) { if (!(gameState.seenPrompts instanceof Set)) gameState.seenPrompts = new Set(); if (typeof promptId === 'string' || typeof promptId === 'number') { gameState.seenPrompts.add(promptId); saveGameState(); } }
export function incrementReflectionTrigger() { if (typeof gameState.cardsAddedSinceLastPrompt === 'number') gameState.cardsAddedSinceLastPrompt++; else gameState.cardsAddedSinceLastPrompt = 1; }
export function resetReflectionTrigger(startCooldown = false) { gameState.cardsAddedSinceLastPrompt = 0; if (startCooldown) setPromptCooldownActive(true); }
export function setPromptCooldownActive(isActive) { gameState.promptCooldownActive = !!isActive; saveGameState(); }
export function clearReflectionCooldown() { gameState.promptCooldownActive = false; saveGameState(); }
export function addRepositoryItem(itemType, itemId) { if (!gameState.discoveredRepositoryItems || typeof gameState.discoveredRepositoryItems !== 'object') gameState.discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() }; if (!gameState.discoveredRepositoryItems[itemType] || !(gameState.discoveredRepositoryItems[itemType] instanceof Set)) gameState.discoveredRepositoryItems[itemType] = new Set(); if (typeof itemId !== 'string' && typeof itemId !== 'number') return false; if (!gameState.discoveredRepositoryItems[itemType].has(itemId)) { gameState.discoveredRepositoryItems[itemType].add(itemId); saveGameState(); return true; } return false; }
export function addPendingRarePrompt(promptId) { if (!Array.isArray(gameState.pendingRarePrompts)) gameState.pendingRarePrompts = []; if (typeof promptId !== 'string' && typeof promptId !== 'number') return false; if (!gameState.pendingRarePrompts.includes(promptId)) { gameState.pendingRarePrompts.push(promptId); saveGameState(); return true; } return false; }
export function getNextRarePrompt() { if (!Array.isArray(gameState.pendingRarePrompts)) { gameState.pendingRarePrompts = []; return null; } if (gameState.pendingRarePrompts.length > 0) { const promptId = gameState.pendingRarePrompts.shift(); saveGameState(); return promptId; } return null; }
export function addUnlockedFocusItem(unlockId) { if (!(gameState.unlockedFocusItems instanceof Set)) gameState.unlockedFocusItems = new Set(); if (typeof unlockId !== 'string' && typeof unlockId !== 'number') return false; if (!gameState.unlockedFocusItems.has(unlockId)) { gameState.unlockedFocusItems.add(unlockId); saveGameState(); return true; } return false; }

// Milestones & Misc
export function addAchievedMilestone(milestoneId) { if (!(gameState.achievedMilestones instanceof Set)) gameState.achievedMilestones = new Set(Array.isArray(gameState.achievedMilestones) ? gameState.achievedMilestones : []); if (typeof milestoneId !== 'string' && typeof milestoneId !== 'number') return false; if (!gameState.achievedMilestones.has(milestoneId)) { gameState.achievedMilestones.add(milestoneId); saveGameState(); return true; } return false; }

// Onboarding Flow
export function advanceOnboardingPhase() { if (!gameState.onboardingComplete && gameState.onboardingPhase !== 99) { gameState.onboardingPhase++; saveGameState(); return gameState.onboardingPhase; } return gameState.onboardingPhase; }
export function updateOnboardingPhase(newPhase) { if (typeof newPhase === 'number' && newPhase >= 0 && gameState.onboardingPhase !== 99) { gameState.onboardingPhase = newPhase; gameState.onboardingComplete = (newPhase >= Config.MAX_ONBOARDING_PHASE + 1); saveGameState(); return true; } return false; }
export function markOnboardingComplete() { if (!gameState.onboardingComplete && gameState.onboardingPhase !== 99) { gameState.onboardingComplete = true; gameState.onboardingPhase = 99; console.log("State: Onboarding marked as complete/skipped."); saveGameState(); } }
export function setOnboardingPhase(n){ if(typeof n!=='number') return; gameState.onboardingPhase = n; gameState.onboardingComplete = (n === 99); saveGameState(); }

// Insight Log
export function addInsightLogEntry(amount, source, newTotal) { if (!Array.isArray(gameState.insightLog)) gameState.insightLog = []; if (typeof amount !== 'number' || isNaN(amount) || typeof newTotal !== 'number' || isNaN(newTotal)) return; const timestamp = Date.now(); const entry = { timestamp: formatTimestamp(timestamp), amount: parseFloat(amount.toFixed(1)), source: source || "Unknown", newTotal: parseFloat(newTotal.toFixed(1)) }; gameState.insightLog.push(entry); while (gameState.insightLog.length > Config.INSIGHT_LOG_MAX_ENTRIES) gameState.insightLog.shift(); /* Save handled by caller */ }

// --- NEW XP & Level System Functions ---

/**
 * Grants XP to a specific element, checks for level ups, and handles daily cap.
 * @param {number} amount - The base amount of XP to grant.
 * @param {string} elementKey - The single-letter key ('A'...'RF') of the element gaining XP.
 */
export function grantXP(amount, elementKey) {
    if (!gameState.elementXP.hasOwnProperty(elementKey)) {
        console.warn(`grantXP: Invalid element key '${elementKey}'`);
        return;
    }
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        console.warn(`grantXP: Invalid amount '${amount}'`);
        return;
    }

    // Check daily cap
    const today = new Date().toDateString();
    if (gameState.dailyXPLog.date !== today) {
        resetDailyXPLog(); // Reset if it's a new day
    }
    const currentDailyXP = gameState.dailyXPLog.totalEarned;
    const allowedXP = Math.max(0, Config.DAILY_XP_CAP - currentDailyXP);
    const xpToGrant = Math.min(amount, allowedXP); // Grant only up to the cap

    if (xpToGrant <= 0) {
        // console.log(`Daily XP cap reached (${Config.DAILY_XP_CAP} XP). No XP granted for ${elementKey}.`); // Reduce noise
        return; // Cap reached
    }

    gameState.elementXP[elementKey] += xpToGrant;
    gameState.dailyXPLog.totalEarned += xpToGrant;
    console.log(`Logic: Granted ${xpToGrant.toFixed(1)} XP to ${elementKey}. Daily total: ${gameState.dailyXPLog.totalEarned.toFixed(1)}/${Config.DAILY_XP_CAP}`);

    checkElementLevelUp(elementKey); // Check if this XP gain triggers a level up
    saveGameState(); // Save XP and daily log changes
    UI.updateXPDisplay(); // Update the UI bar/token count
}

/**
 * Resets the daily XP log counter.
 */
function resetDailyXPLog() {
    gameState.dailyXPLog.date = new Date().toDateString();
    gameState.dailyXPLog.totalEarned = 0;
    console.log("Logic: Daily XP log reset.");
    // Save handled by caller (resetDailyRituals)
}

/**
 * Checks if an element has enough XP to level up and updates state accordingly.
 * @param {string} key - The single-letter key ('A'...'RF') of the element to check.
 */
function checkElementLevelUp(key) {
    const currentLevel = gameState.elementLevel[key];
    if (currentLevel >= Config.MAX_ELEMENT_LEVEL) return; // Already max level

    const xpNeeded = Config.XP_LEVEL_THRESHOLDS[currentLevel + 1] ?? Infinity;
    const currentXP = gameState.elementXP[key];

    // Note: XP thresholds are TOTAL XP needed, not XP needed for *next* level.
    if (currentXP >= xpNeeded) {
        gameState.levelTokens += 1;
        gameState.elementLevel[key] += 1;
        const elementName = Utils.getElementShortName(elementKeyToFullName[key]);
        console.log(`🎉 Level Up! ${elementName} reached Level ${currentLevel + 1}! Gained 1 Level Token.`);
        UI.showTemporaryMessage(`🎉 ${elementName} reached Level ${currentLevel + 1}! You earned a Level Token.`, 4000);
        // Update milestone checks related to element levels
        updateMilestoneProgress('elementLevel', gameState.elementLevel); // Pass entire object for 'all' check if needed
        // The save is handled by the grantXP function calling this
    }
}

/**
 * Spends a Level Token to increase the level of a specific element.
 * @param {string} elementKey - The single-letter key ('A'...'RF') of the element to level up.
 * @returns {boolean} True if the token was spent successfully, false otherwise.
 */
export function spendLevelToken(elementKey) {
    if (gameState.levelTokens <= 0) {
        console.warn("spendLevelToken: No tokens available.");
        return false;
    }
    if (!gameState.elementLevel.hasOwnProperty(elementKey)) {
        console.warn(`spendLevelToken: Invalid element key '${elementKey}'`);
        return false;
    }
    const currentLevel = gameState.elementLevel[elementKey];
    if (currentLevel >= Config.MAX_ELEMENT_LEVEL) {
        console.warn(`spendLevelToken: Element ${elementKey} already at max level (${Config.MAX_ELEMENT_LEVEL}).`);
        return false;
    }

    // Check if threshold exists for next level (precaution)
    if (currentLevel + 1 >= Config.XP_LEVEL_THRESHOLDS.length) {
        console.error(`Config Error: XP_LEVEL_THRESHOLDS missing entry for level ${currentLevel + 1}`);
        return false;
    }

    gameState.levelTokens -= 1;
    gameState.elementLevel[elementKey] += 1;
    console.log(`Logic: Spent Level Token on ${elementKey}. New Level: ${gameState.elementLevel[elementKey]}. Tokens remaining: ${gameState.levelTokens}`);
    saveGameState();
    UI.updateXPDisplay(); // Update token count display
    return true;
}


console.log("state.js loaded successfully. (XP/Leveling v1.0)");
// --- END OF FILE state.js ---
