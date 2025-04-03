// js/state.js - Manages Application State and Persistence
import * as Config from './config.js';
import { elementNames } from '../data.js'; // Only import needed data

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
        currentElementIndex: -1, // Start before questionnaire
        questionnaireCompleted: false,
        cardsAddedSinceLastPrompt: 0,
        promptCooldownActive: false,
        discoveredRepositoryItems: { scenes: new Set(), experiments: new Set(), insights: new Set() },
        pendingRarePrompts: [],
        unlockedFocusItems: new Set(),
        currentFocusSetHash: '',
        contemplationCooldownEnd: null,
        onboardingPhase: Config.ONBOARDING_PHASE.START, // Start at phase 0
    };
    // Explicitly initialize userAnswers sub-objects
    elementNames.forEach(name => {
        initial.userAnswers[name] = {};
    });
    return initial;
};

// Initialize current state using the function
let gameState = createInitialGameState();

// --- Internal Helper ---
function _calculateFocusSetHash() {
    if (!gameState.focusedConcepts || gameState.focusedConcepts.size === 0) { return ''; }
    const sortedIds = Array.from(gameState.focusedConcepts).sort((a, b) => a - b);
    return sortedIds.join(',');
}

// --- Saving & Loading ---
let saveTimeout = null;
const SAVE_DELAY = 1000; // 1 second debounce for saving

function _triggerSave() {
     const saveIndicator = document.getElementById('saveIndicator');
     if(saveIndicator) saveIndicator.classList.remove('hidden');
     if (saveTimeout) clearTimeout(saveTimeout);
     saveTimeout = setTimeout(() => {
         try {
             // Create a serializable version of the state
             const stateToSave = {
                 ...gameState,
                 // Convert Maps and Sets to Arrays for JSON compatibility
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
                 // userAnswers is already a plain object
                 // completedRituals is already a plain object
             };
             localStorage.setItem(Config.SAVE_KEY, JSON.stringify(stateToSave));
             // console.log("Game state saved."); // Optional: Reduce console noise
         } catch (error) { console.error("Error saving game state:", error); }
         finally { if(saveIndicator) saveIndicator.classList.add('hidden'); saveTimeout = null; }
     }, SAVE_DELAY);
}

export function saveGameState() { _triggerSave(); }

export function loadGameState() {
    console.log("Attempting to load game state...");
    const savedData = localStorage.getItem(Config.SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found.");
            // Reset to initial state BEFORE merging loaded data
            gameState = createInitialGameState();

            // Merge loaded data carefully, preserving defaults if keys are missing
            // Use || gameState.propertyName to keep default if loaded is undefined/null
            gameState.userScores = (typeof loadedState.userScores === 'object' && loadedState.userScores !== null) ? { ...gameState.userScores, ...loadedState.userScores } : gameState.userScores;
            gameState.userAnswers = (typeof loadedState.userAnswers === 'object' && loadedState.userAnswers !== null) ? loadedState.userAnswers : gameState.userAnswers; // Keep default empty objects if loaded is null/undefined
            // Ensure all element keys exist in loaded userAnswers AFTER loading
            elementNames.forEach(name => {
                if (!gameState.userAnswers[name]) { gameState.userAnswers[name] = {}; }
            });
            gameState.discoveredConcepts = new Map(Array.isArray(loadedState.discoveredConcepts) ? loadedState.discoveredConcepts : []);
            gameState.focusedConcepts = new Set(Array.isArray(loadedState.focusedConcepts) ? loadedState.focusedConcepts : []);
            gameState.focusSlotsTotal = typeof loadedState.focusSlotsTotal === 'number' ? loadedState.focusSlotsTotal : gameState.focusSlotsTotal;
            gameState.userInsight = typeof loadedState.userInsight === 'number' ? loadedState.userInsight : gameState.userInsight;
            gameState.elementAttunement = (typeof loadedState.elementAttunement === 'object' && loadedState.elementAttunement !== null) ? { ...gameState.elementAttunement, ...loadedState.elementAttunement } : gameState.elementAttunement;
            gameState.unlockedDeepDiveLevels = (typeof loadedState.unlockedDeepDiveLevels === 'object' && loadedState.unlockedDeepDiveLevels !== null) ? { ...gameState.unlockedDeepDiveLevels, ...loadedState.unlockedDeepDiveLevels } : gameState.unlockedDeepDiveLevels;
            gameState.achievedMilestones = new Set(Array.isArray(loadedState.achievedMilestones) ? loadedState.achievedMilestones : []);
            gameState.completedRituals = (typeof loadedState.completedRituals === 'object' && loadedState.completedRituals !== null) ? loadedState.completedRituals : gameState.completedRituals; // Keep default empty obj if null
            gameState.lastLoginDate = typeof loadedState.lastLoginDate === 'string' ? loadedState.lastLoginDate : gameState.lastLoginDate;
            gameState.freeResearchAvailableToday = typeof loadedState.freeResearchAvailableToday === 'boolean' ? loadedState.freeResearchAvailableToday : gameState.freeResearchAvailableToday;
            gameState.seenPrompts = new Set(Array.isArray(loadedState.seenPrompts) ? loadedState.seenPrompts : []);
            gameState.currentElementIndex = typeof loadedState.currentElementIndex === 'number' ? loadedState.currentElementIndex : gameState.currentElementIndex; // Keep default -1
            gameState.questionnaireCompleted = typeof loadedState.questionnaireCompleted === 'boolean' ? loadedState.questionnaireCompleted : gameState.questionnaireCompleted;
            gameState.cardsAddedSinceLastPrompt = typeof loadedState.cardsAddedSinceLastPrompt === 'number' ? loadedState.cardsAddedSinceLastPrompt : gameState.cardsAddedSinceLastPrompt;
            gameState.promptCooldownActive = typeof loadedState.promptCooldownActive === 'boolean' ? loadedState.promptCooldownActive : gameState.promptCooldownActive;
            // Load Repository Items carefully
             gameState.discoveredRepositoryItems = {
                 scenes: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.scenes) ? loadedState.discoveredRepositoryItems.scenes : []),
                 experiments: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.experiments) ? loadedState.discoveredRepositoryItems.experiments : []),
                 insights: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.insights) ? loadedState.discoveredRepositoryItems.insights : []),
             };
            gameState.pendingRarePrompts = Array.isArray(loadedState.pendingRarePrompts) ? loadedState.pendingRarePrompts : gameState.pendingRarePrompts;
            gameState.unlockedFocusItems = new Set(Array.isArray(loadedState.unlockedFocusItems) ? loadedState.unlockedFocusItems : []);
            gameState.contemplationCooldownEnd = typeof loadedState.contemplationCooldownEnd === 'number' ? loadedState.contemplationCooldownEnd : gameState.contemplationCooldownEnd;
            // Load onboarding phase, default to START if invalid/missing
            gameState.onboardingPhase = (typeof loadedState.onboardingPhase === 'number' && loadedState.onboardingPhase >= 0) ? loadedState.onboardingPhase : Config.ONBOARDING_PHASE.START;

            // Recalculate derived state
            gameState.currentFocusSetHash = _calculateFocusSetHash();

            console.log("Game state loaded successfully. Current Phase:", gameState.onboardingPhase);
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
    gameState = createInitialGameState(); // Reset to default
    console.log("Game state cleared and reset.");
    // No save trigger here, clearing is immediate
}

// --- Getters ---
export function getState() { return gameState; }
export function getScores() { return gameState.userScores; }
export function getAttunement() { return gameState.elementAttunement; }
export function getInsight() { return gameState.userInsight; }
export function getDiscoveredConcepts() { return gameState.discoveredConcepts; }
export function getDiscoveredConceptData(conceptId) { return gameState.discoveredConcepts.get(conceptId); }
export function getFocusedConcepts() { return gameState.focusedConcepts; }
export function getFocusSlots() { return gameState.focusSlotsTotal; }
export function getRepositoryItems() { return gameState.discoveredRepositoryItems; }
export function getUnlockedFocusItems() { return gameState.unlockedFocusItems; }
export function getCurrentFocusSetHash() { return gameState.currentFocusSetHash; }
export function getContemplationCooldownEnd() { return gameState.contemplationCooldownEnd; }
export function getOnboardingPhase() { return gameState.onboardingPhase; }
export function isFreeResearchAvailable() { return gameState.freeResearchAvailableToday; }
export function getQuestionnaireCompletedStatus() { return gameState.questionnaireCompleted; }


// --- Setters / Updaters (Trigger Save where appropriate) ---

// Call this function to attempt advancing the phase.
// It centralizes the logic and prevents skipping phases.
export function advanceOnboardingPhase(targetPhase) {
    // Only advance if the target is the *next* logical phase
    if (targetPhase === gameState.onboardingPhase + 1) {
        console.log(`Advancing onboarding phase from ${gameState.onboardingPhase} to ${targetPhase}`);
        gameState.onboardingPhase = targetPhase;
        saveGameState(); // Save phase changes
        return true;
    } else if (targetPhase <= gameState.onboardingPhase) {
        // console.log(`Attempted to advance to phase ${targetPhase}, but already at or past phase ${gameState.onboardingPhase}.`);
        return false; // Already at or past this phase
    } else {
        console.warn(`Attempted to skip onboarding phases. Target: ${targetPhase}, Current: ${gameState.onboardingPhase}. Advancement blocked.`);
        return false; // Tried to skip phases
    }
}

export function updateScores(newScores) {
    gameState.userScores = { ...newScores };
    saveGameState();
    return true;
}

export function saveAllAnswers(allAnswers) {
    // Deep copy to avoid reference issues
    gameState.userAnswers = JSON.parse(JSON.stringify(allAnswers));
    saveGameState();
}

export function updateAnswers(elementName, answersForElement) {
    if (!gameState.userAnswers) { gameState.userAnswers = {}; }
    if (!gameState.userAnswers[elementName]) { gameState.userAnswers[elementName] = {}; }
    gameState.userAnswers[elementName] = { ...answersForElement };
    // No save here, questionnaire progress saved differently
}

export function updateElementIndex(index) {
    gameState.currentElementIndex = index;
    // No save here
}

export function setQuestionnaireComplete() {
    gameState.currentElementIndex = elementNames.length; // Mark questionnaire as finished internally
    if (!gameState.questionnaireCompleted) {
        gameState.questionnaireCompleted = true;
        // Automatically advance to Phase 1 upon questionnaire completion
        advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
        saveGameState(); // Save completion status and phase change
    }
    return true;
}

// Removed advanceOnboardingPhase export, use the internal one with checks.

export function changeInsight(amount) {
    const previousInsight = gameState.userInsight;
    gameState.userInsight = Math.max(0, previousInsight + amount);
    if (gameState.userInsight !== previousInsight) {
        saveGameState(); // Save insight changes
        return true;
    }
    return false;
}

export function updateAttunement(elementKey, amount) {
    if (gameState.elementAttunement.hasOwnProperty(elementKey)) {
        const current = gameState.elementAttunement[elementKey];
        const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
        if (newValue !== current) {
            gameState.elementAttunement[elementKey] = newValue;
            // Check for Phase 4 trigger based on attunement (alternative trigger)
            // if (newValue >= 25 && gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) {
            //     advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
            // }
            saveGameState();
            return true;
        }
    }
    return false;
}

export function addDiscoveredConcept(conceptId, conceptData) {
    if (!(gameState.discoveredConcepts instanceof Map)) { gameState.discoveredConcepts = new Map(); }
    if (!gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.set(conceptId, { concept: conceptData, discoveredTime: Date.now(), artUnlocked: false, notes: "" });
        saveGameState();
        return true;
    }
    return false;
}

export function removeDiscoveredConcept(conceptId) {
    if (!(gameState.discoveredConcepts instanceof Map)) { return false; }
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        if (gameState.focusedConcepts.has(conceptId)) {
             gameState.focusedConcepts.delete(conceptId);
             gameState.currentFocusSetHash = _calculateFocusSetHash(); // Recalculate hash
        }
        saveGameState();
        return true;
    }
    return false;
}

export function toggleFocusConcept(conceptId) {
    if (!(gameState.discoveredConcepts instanceof Map)) { return 'not_discovered'; }
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
        // ---- NEW FLOW TRIGGER: Focus first concept -> Phase 2 ----
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.focusedConcepts.size >= 1) {
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        }
        // ---- END NEW FLOW TRIGGER ----
    }
    gameState.currentFocusSetHash = _calculateFocusSetHash(); // Update hash
    saveGameState();
    return result;
}

export function increaseFocusSlots(amount = 1) {
    const newSlots = Math.min(Config.MAX_FOCUS_SLOTS, gameState.focusSlotsTotal + amount);
    if (newSlots > gameState.focusSlotsTotal) {
        gameState.focusSlotsTotal = newSlots;
        saveGameState();
        return true;
    }
    return false;
}

export function updateNotes(conceptId, notes) {
    if (!(gameState.discoveredConcepts instanceof Map)) { return false; }
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
    if (!(gameState.discoveredConcepts instanceof Map)) { return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data && !data.artUnlocked) {
        data.artUnlocked = true;
        gameState.discoveredConcepts.set(conceptId, data);
        // Removed phase trigger here - Phase 4 unlocked by Library/Attunement
        saveGameState();
        return true;
    }
    return false;
}

export function unlockLibraryLevel(elementKey, level) {
    if (gameState.unlockedDeepDiveLevels.hasOwnProperty(elementKey)) {
        const currentLevel = gameState.unlockedDeepDiveLevels[elementKey];
        if (level === currentLevel + 1) {
            gameState.unlockedDeepDiveLevels[elementKey] = level;
            // ---- NEW FLOW TRIGGER: Unlock first Library level -> Phase 4 ----
            if (level >= 1 && gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) {
                 advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
            }
            // ---- END NEW FLOW TRIGGER ----
            saveGameState();
            return true;
        }
    }
    return false;
}

export function resetDailyRituals() {
    gameState.completedRituals.daily = {};
    gameState.freeResearchAvailableToday = true;
    gameState.lastLoginDate = new Date().toDateString();
    saveGameState();
}

export function setFreeResearchUsed() {
    gameState.freeResearchAvailableToday = false;
    saveGameState();
}

export function completeRitualProgress(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
    if (!gameState.completedRituals[period][ritualId]) gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 };
    gameState.completedRituals[period][ritualId].progress += 1;
    saveGameState(); // Save progress
    return gameState.completedRituals[period][ritualId].progress;
}

export function markRitualComplete(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]?.[ritualId]) {
        completeRitualProgress(ritualId, period); // Ensure progress exists if directly marking complete
    }
    if (gameState.completedRituals[period]?.[ritualId]) {
        gameState.completedRituals[period][ritualId].completed = true;
        saveGameState(); // Save completion status
    }
}

export function addAchievedMilestone(milestoneId) {
    if (!(gameState.achievedMilestones instanceof Set)) { gameState.achievedMilestones = new Set(); }
    if (!gameState.achievedMilestones.has(milestoneId)) {
        gameState.achievedMilestones.add(milestoneId);
        // Remove specific phase triggers linked to milestones if they are now handled elsewhere
        saveGameState();
        return true;
    }
    return false;
}

export function addSeenPrompt(promptId) {
    if (!(gameState.seenPrompts instanceof Set)) { gameState.seenPrompts = new Set(); }
    gameState.seenPrompts.add(promptId);
    saveGameState();
}

export function incrementReflectionTrigger() {
    gameState.cardsAddedSinceLastPrompt++;
    // No save here, managed by reflection logic
}

export function resetReflectionTrigger(startCooldown = false) {
    gameState.cardsAddedSinceLastPrompt = 0;
    if (startCooldown) { setPromptCooldownActive(true); }
    // No save here, managed by reflection logic
}

export function setPromptCooldownActive(isActive) {
    gameState.promptCooldownActive = isActive;
    saveGameState(); // Save cooldown status change
}

// No clearReflectionCooldown needed as timeout handles it, saved on expiration

export function addRepositoryItem(itemType, itemId) {
    if (!gameState.discoveredRepositoryItems[itemType]) { console.error(`Invalid repository type: ${itemType}`); return false; }
    if (!(gameState.discoveredRepositoryItems[itemType] instanceof Set)) { gameState.discoveredRepositoryItems[itemType] = new Set(); }
    if (!gameState.discoveredRepositoryItems[itemType].has(itemId)) {
        gameState.discoveredRepositoryItems[itemType].add(itemId);
        // Removed phase trigger - Phase 4 unlocked by Library/Attunement
        saveGameState();
        return true;
    }
    return false;
}

export function addPendingRarePrompt(promptId) {
    if (!Array.isArray(gameState.pendingRarePrompts)) { gameState.pendingRarePrompts = []; }
    if (!gameState.pendingRarePrompts.includes(promptId)) {
        gameState.pendingRarePrompts.push(promptId);
        saveGameState();
        return true;
    }
    return false;
}

export function getNextRarePrompt() {
    if (!Array.isArray(gameState.pendingRarePrompts)) { gameState.pendingRarePrompts = []; return null; }
    if (gameState.pendingRarePrompts.length > 0) {
        const promptId = gameState.pendingRarePrompts.shift();
        saveGameState(); // Save the removal from the queue
        return promptId;
    }
    return null;
}

export function addUnlockedFocusItem(unlockId) {
    if (!(gameState.unlockedFocusItems instanceof Set)) { gameState.unlockedFocusItems = new Set(); }
    if (!gameState.unlockedFocusItems.has(unlockId)) {
        gameState.unlockedFocusItems.add(unlockId);
        // Removed phase trigger - Phase 4 unlocked by Library/Attunement
        saveGameState();
        return true;
    }
    return false;
}

export function setContemplationCooldown(endTime) {
    gameState.contemplationCooldownEnd = endTime;
    saveGameState();
}

console.log("state.js loaded.");
