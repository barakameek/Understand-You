// --- START OF FILE state.js ---

// js/state.js - Manages Application State and Persistence
import * as Config from './config.js';
import { elementNames } from '../data.js'; // Only import needed data

console.log("state.js loading...");

// Default game state structure
const createInitialGameState = () => {
    const initial = {
        userScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }, // Default scores
        userAnswers: {}, // Initialize as empty object for questionnaire answers
        discoveredConcepts: new Map(), // START EMPTY
        focusedConcepts: new Set(),   // START EMPTY
        focusSlotsTotal: Config.INITIAL_FOCUS_SLOTS,
        userInsight: Config.INITIAL_INSIGHT,
        elementAttunement: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
        unlockedDeepDiveLevels: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
        achievedMilestones: new Set(),
        completedRituals: { daily: {}, weekly: {} },
        lastLoginDate: null,
        freeResearchAvailableToday: false, // Daily free research flag
        initialFreeResearchRemaining: Config.INITIAL_FREE_RESEARCH_COUNT, // NEW: Count for initial free researches
        seenPrompts: new Set(),
        currentElementIndex: -1, // Starts before the first element
        questionnaireCompleted: false,
        cardsAddedSinceLastPrompt: 0,
        promptCooldownActive: false,
        discoveredRepositoryItems: { scenes: new Set(), experiments: new Set(), insights: new Set() },
        pendingRarePrompts: [],
        unlockedFocusItems: new Set(),
        currentFocusSetHash: '', // Hash of focused concepts
        contemplationCooldownEnd: null,
        onboardingPhase: Config.ONBOARDING_PHASE.START, // Start at the very beginning
    };
    // Explicitly initialize userAnswers sub-objects for each element
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
const SAVE_DELAY = 1000; // 1 second delay before saving

function _triggerSave() {
     const saveIndicator = document.getElementById('saveIndicator');
     if(saveIndicator) saveIndicator.classList.remove('hidden');
     if (saveTimeout) clearTimeout(saveTimeout);
     saveTimeout = setTimeout(() => {
         try {
             // Serialize Sets and Maps for JSON storage
             const stateToSave = {
                 ...gameState,
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
             // console.debug("Game state saved."); // Optional: for debugging
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
            // Start fresh but merge known properties carefully
            gameState = createInitialGameState(); // Ensures all defaults are set

            // Merge known properties, validating types where possible
            if (typeof loadedState.userScores === 'object' && loadedState.userScores !== null) gameState.userScores = { ...gameState.userScores, ...loadedState.userScores };
            if (typeof loadedState.userAnswers === 'object' && loadedState.userAnswers !== null) gameState.userAnswers = loadedState.userAnswers;
            // Ensure all element keys exist in loaded userAnswers, initializing if necessary
            elementNames.forEach(name => { if (!gameState.userAnswers[name]) gameState.userAnswers[name] = {}; });

            // Restore Maps and Sets
            if (Array.isArray(loadedState.discoveredConcepts)) gameState.discoveredConcepts = new Map(loadedState.discoveredConcepts);
            if (Array.isArray(loadedState.focusedConcepts)) gameState.focusedConcepts = new Set(loadedState.focusedConcepts);
            if (Array.isArray(loadedState.achievedMilestones)) gameState.achievedMilestones = new Set(loadedState.achievedMilestones);
            if (Array.isArray(loadedState.seenPrompts)) gameState.seenPrompts = new Set(loadedState.seenPrompts);
            if (Array.isArray(loadedState.unlockedFocusItems)) gameState.unlockedFocusItems = new Set(loadedState.unlockedFocusItems);

            // Simple type properties
            if (typeof loadedState.focusSlotsTotal === 'number' && !isNaN(loadedState.focusSlotsTotal)) gameState.focusSlotsTotal = loadedState.focusSlotsTotal;
            if (typeof loadedState.userInsight === 'number' && !isNaN(loadedState.userInsight)) gameState.userInsight = loadedState.userInsight;
            if (typeof loadedState.elementAttunement === 'object' && loadedState.elementAttunement !== null) gameState.elementAttunement = { ...gameState.elementAttunement, ...loadedState.elementAttunement };
            if (typeof loadedState.unlockedDeepDiveLevels === 'object' && loadedState.unlockedDeepDiveLevels !== null) gameState.unlockedDeepDiveLevels = { ...gameState.unlockedDeepDiveLevels, ...loadedState.unlockedDeepDiveLevels };
            if (typeof loadedState.completedRituals === 'object' && loadedState.completedRituals !== null) gameState.completedRituals = loadedState.completedRituals;
            if (typeof loadedState.lastLoginDate === 'string') gameState.lastLoginDate = loadedState.lastLoginDate;
            if (typeof loadedState.freeResearchAvailableToday === 'boolean') gameState.freeResearchAvailableToday = loadedState.freeResearchAvailableToday;
            // NEW: Load initialFreeResearchRemaining
            if (typeof loadedState.initialFreeResearchRemaining === 'number' && !isNaN(loadedState.initialFreeResearchRemaining)) {
                gameState.initialFreeResearchRemaining = loadedState.initialFreeResearchRemaining;
            } else {
                 // If loading from an older save *before* this existed, reset it based on config
                 gameState.initialFreeResearchRemaining = Config.INITIAL_FREE_RESEARCH_COUNT;
                 console.warn("Loaded save lacked 'initialFreeResearchRemaining'. Resetting to default.");
            }
            if (typeof loadedState.currentElementIndex === 'number' && !isNaN(loadedState.currentElementIndex)) gameState.currentElementIndex = loadedState.currentElementIndex;
            if (typeof loadedState.questionnaireCompleted === 'boolean') gameState.questionnaireCompleted = loadedState.questionnaireCompleted;
            if (typeof loadedState.cardsAddedSinceLastPrompt === 'number' && !isNaN(loadedState.cardsAddedSinceLastPrompt)) gameState.cardsAddedSinceLastPrompt = loadedState.cardsAddedSinceLastPrompt;
            if (typeof loadedState.promptCooldownActive === 'boolean') gameState.promptCooldownActive = loadedState.promptCooldownActive;
            if (typeof loadedState.contemplationCooldownEnd === 'number' && !isNaN(loadedState.contemplationCooldownEnd)) gameState.contemplationCooldownEnd = loadedState.contemplationCooldownEnd;
            if (Array.isArray(loadedState.pendingRarePrompts)) gameState.pendingRarePrompts = loadedState.pendingRarePrompts;

            // Load Repository Items carefully, ensuring Sets exist
            gameState.discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() };
             if (typeof loadedState.discoveredRepositoryItems === 'object' && loadedState.discoveredRepositoryItems !== null) {
                 if (Array.isArray(loadedState.discoveredRepositoryItems.scenes)) gameState.discoveredRepositoryItems.scenes = new Set(loadedState.discoveredRepositoryItems.scenes);
                 if (Array.isArray(loadedState.discoveredRepositoryItems.experiments)) gameState.discoveredRepositoryItems.experiments = new Set(loadedState.discoveredRepositoryItems.experiments);
                 if (Array.isArray(loadedState.discoveredRepositoryItems.insights)) gameState.discoveredRepositoryItems.insights = new Set(loadedState.discoveredRepositoryItems.insights);
             }

            // Ensure onboarding phase is valid or default
            gameState.onboardingPhase = (typeof loadedState.onboardingPhase === 'number' && Object.values(Config.ONBOARDING_PHASE).includes(loadedState.onboardingPhase)) ? loadedState.onboardingPhase : Config.ONBOARDING_PHASE.START;

            gameState.currentFocusSetHash = _calculateFocusSetHash(); // Recalculate hash on load

            console.log("Game state loaded successfully.");
            return true;
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(Config.SAVE_KEY); // Clear corrupted save
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
// NEW Getter for initial free research
export function getInitialFreeResearchRemaining() { return gameState.initialFreeResearchRemaining; }

// --- Setters / Updaters (Trigger Save) ---
// These functions modify the gameState and then call saveGameState()

export function updateScores(newScores) {
    gameState.userScores = { ...newScores };
    saveGameState();
    return true;
}
export function saveAllAnswers(allAnswers) {
    gameState.userAnswers = JSON.parse(JSON.stringify(allAnswers)); // Deep copy
    saveGameState();
}
export function updateAnswers(elementName, answersForElement) {
    if (!gameState.userAnswers) gameState.userAnswers = {}; // Initialize if missing
    if (!gameState.userAnswers[elementName]) gameState.userAnswers[elementName] = {};
    // Update only the specific element's answers
    gameState.userAnswers[elementName] = { ...answersForElement };
    // No save here, saved implicitly by finalizeQuestionnaire or other actions
}
export function updateElementIndex(index) {
    gameState.currentElementIndex = index;
    // No save here, questionnaire progress isn't critical to persist mid-way typically
}
export function setQuestionnaireComplete() {
    gameState.currentElementIndex = elementNames.length; // Mark finished state
    if (!gameState.questionnaireCompleted) {
        gameState.questionnaireCompleted = true;
        // Questionnaire completion now ONLY advances to PERSONA_GRIMOIRE phase
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) {
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
        }
    }
    saveGameState(); // Save completion status and phase change
    return true;
}
export function advanceOnboardingPhase(targetPhase) {
    if (targetPhase > gameState.onboardingPhase) {
        console.log(`Advancing onboarding phase from ${gameState.onboardingPhase} to ${targetPhase}`);
        gameState.onboardingPhase = targetPhase;
        saveGameState();
        return true;
    }
    return false;
}
export function changeInsight(amount) {
    const previousInsight = gameState.userInsight;
    gameState.userInsight = Math.max(0, previousInsight + amount);
    if (gameState.userInsight !== previousInsight) { saveGameState(); return true; }
    return false;
}
// NEW function to use initial free research
export function useInitialFreeResearch() {
    if (gameState.initialFreeResearchRemaining > 0) {
        gameState.initialFreeResearchRemaining--;
        saveGameState();
        return true; // Successfully used
    }
    return false; // None remaining
}
export function setFreeResearchUsed() { // For daily free research
    gameState.freeResearchAvailableToday = false; saveGameState();
}
export function updateAttunement(elementKey, amount) {
    if (gameState.elementAttunement.hasOwnProperty(elementKey)) {
        const current = gameState.elementAttunement[elementKey];
        // Apply diminishing returns for large gains? Maybe later.
        const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
        if (newValue !== current) { gameState.elementAttunement[elementKey] = newValue; saveGameState(); return true; }
    }
    return false;
}
export function addDiscoveredConcept(conceptId, conceptData) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); gameState.discoveredConcepts = new Map(); }
    if (!gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.set(conceptId, { concept: conceptData, discoveredTime: Date.now(), artUnlocked: false, notes: "" });
        // ADDING the first concept now triggers STUDY_INSIGHT phase
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.discoveredConcepts.size >= 1) {
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        }
        saveGameState();
        return true;
    }
    return false;
}
export function removeDiscoveredConcept(conceptId) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        // If removed concept was focused, remove from focus too
        if (gameState.focusedConcepts.has(conceptId)) { gameState.focusedConcepts.delete(conceptId); gameState.currentFocusSetHash = _calculateFocusSetHash(); }
        saveGameState();
        return true;
    }
    return false;
}
export function toggleFocusConcept(conceptId) {
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return 'not_discovered'; }
    if (!gameState.discoveredConcepts.has(conceptId)) return 'not_discovered';
    let result;
    if (gameState.focusedConcepts.has(conceptId)) { gameState.focusedConcepts.delete(conceptId); result = 'removed'; }
    else {
        if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) { return 'slots_full'; }
        gameState.focusedConcepts.add(conceptId); result = 'added';
        // FOCUSING the first concept now triggers REFLECTION_RITUALS phase
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS && gameState.focusedConcepts.size >= 1) {
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS);
        }
    }
    gameState.currentFocusSetHash = _calculateFocusSetHash(); // Update hash
    saveGameState();
    return result;
}
export function increaseFocusSlots(amount = 1) {
    const newSlots = Math.min(Config.MAX_FOCUS_SLOTS, gameState.focusSlotsTotal + amount);
    if (newSlots > gameState.focusSlotsTotal) { gameState.focusSlotsTotal = newSlots; saveGameState(); return true; }
    return false;
}
export function updateNotes(conceptId, notes) {
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data) { data.notes = notes; gameState.discoveredConcepts.set(conceptId, data); saveGameState(); return true; }
    return false;
}
export function unlockArt(conceptId) {
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data && !data.artUnlocked) {
        data.artUnlocked = true; gameState.discoveredConcepts.set(conceptId, data);
        // Advance phase based on art unlock *if needed* (kept ADVANCED trigger)
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); }
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
             // Advance phase based on library unlock *if needed* (kept ADVANCED trigger)
            const anyLevelOne = Object.values(gameState.unlockedDeepDiveLevels).some(l => l >= 1);
            if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED && anyLevelOne) {
                advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
            }
            saveGameState();
            return true;
        }
    }
    return false;
}
export function resetDailyRituals() {
    gameState.completedRituals.daily = {}; gameState.freeResearchAvailableToday = true; gameState.lastLoginDate = new Date().toDateString();
    saveGameState();
}
export function completeRitualProgress(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
    if (!gameState.completedRituals[period][ritualId]) gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 };
    // Only increment if not already complete for the period
    if (!gameState.completedRituals[period][ritualId].completed) {
        gameState.completedRituals[period][ritualId].progress += 1;
        saveGameState(); // Save progress update
        return gameState.completedRituals[period][ritualId].progress;
    }
    return gameState.completedRituals[period][ritualId].progress; // Return current progress if already complete
}
export function markRitualComplete(ritualId, period = 'daily') {
    // Ensure the ritual entry exists before marking complete
    if (!gameState.completedRituals[period]?.[ritualId]) {
        if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
        gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 };
    }
    // Mark as complete if it exists
    if (gameState.completedRituals[period]?.[ritualId]) {
         gameState.completedRituals[period][ritualId].completed = true;
         saveGameState();
    }
}
export function addAchievedMilestone(milestoneId) {
    if (!(gameState.achievedMilestones instanceof Set)) { console.error("CRITICAL ERROR: gameState.achievedMilestones is not a Set!"); gameState.achievedMilestones = new Set();}
    if (!gameState.achievedMilestones.has(milestoneId)) {
        gameState.achievedMilestones.add(milestoneId);
        // --- Onboarding Phase Advancement Tied to Milestones ---
        // Adjust triggers based on new flow
        if (milestoneId === 'ms01' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT) advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT); // First Concept Added -> Phase 2
        if (milestoneId === 'ms03' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS); // First Focus -> Phase 3
        // Keep Research/Reflection/Advanced triggers as they might happen independently
        if (milestoneId === 'ms05' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT) advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);     // First Research -> Phase 2
        if (milestoneId === 'ms07' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS); // First Reflection -> Phase 3
        if (['ms60', 'ms70', 'ms71', 'ms11'].includes(milestoneId) && gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); // First Library/Scene/Experiment/Evolve -> Phase 4
        // -------------------------------------------------------
        saveGameState();
        return true;
    }
    return false;
}
export function addSeenPrompt(promptId) {
     if (!(gameState.seenPrompts instanceof Set)) { console.error("CRITICAL ERROR: gameState.seenPrompts is not a Set!"); gameState.seenPrompts = new Set();}
    gameState.seenPrompts.add(promptId); saveGameState();
}
export function incrementReflectionTrigger() {
    gameState.cardsAddedSinceLastPrompt++;
    // No save here, only relevant for triggering
}
export function resetReflectionTrigger(startCooldown = false) {
    gameState.cardsAddedSinceLastPrompt = 0;
    if (startCooldown) { setPromptCooldownActive(true); }
    // Save state handled by cooldown timeout or other actions
}
export function setPromptCooldownActive(isActive) {
    gameState.promptCooldownActive = isActive;
    // Save state handled by cooldown timeout or other actions
}
export function clearReflectionCooldown() {
    gameState.promptCooldownActive = false; saveGameState();
}
export function addRepositoryItem(itemType, itemId) {
    if (!gameState.discoveredRepositoryItems || typeof gameState.discoveredRepositoryItems !== 'object') { console.error(`CRITICAL ERROR: gameState.discoveredRepositoryItems is not an object!`); gameState.discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() };}
    if (!gameState.discoveredRepositoryItems[itemType] || !(gameState.discoveredRepositoryItems[itemType] instanceof Set)) { console.error(`CRITICAL ERROR: gameState.discoveredRepositoryItems.${itemType} is not a Set!`); gameState.discoveredRepositoryItems[itemType] = new Set();}

    if (gameState.discoveredRepositoryItems[itemType] && !gameState.discoveredRepositoryItems[itemType].has(itemId)) {
        gameState.discoveredRepositoryItems[itemType].add(itemId);
        // Advance phase based on repo item *if needed* (kept ADVANCED trigger)
        const repoNotEmpty = Object.values(gameState.discoveredRepositoryItems).some(set => set.size > 0);
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED && repoNotEmpty) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); }
        saveGameState();
        return true;
    }
    return false;
}
export function addPendingRarePrompt(promptId) {
    if (!Array.isArray(gameState.pendingRarePrompts)) {console.error("CRITICAL ERROR: gameState.pendingRarePrompts is not an Array!"); gameState.pendingRarePrompts = [];}
    if (!gameState.pendingRarePrompts.includes(promptId)) { gameState.pendingRarePrompts.push(promptId); saveGameState(); return true; }
    return false;
}
export function getNextRarePrompt() {
    if (!Array.isArray(gameState.pendingRarePrompts)) {console.error("CRITICAL ERROR: gameState.pendingRarePrompts is not an Array!"); gameState.pendingRarePrompts = []; return null;}
    if (gameState.pendingRarePrompts.length > 0) { const promptId = gameState.pendingRarePrompts.shift(); saveGameState(); return promptId; }
    return null;
}
export function addUnlockedFocusItem(unlockId) {
    if (!(gameState.unlockedFocusItems instanceof Set)) { console.error("CRITICAL ERROR: gameState.unlockedFocusItems is not a Set!"); gameState.unlockedFocusItems = new Set();}
    if (!gameState.unlockedFocusItems.has(unlockId)) {
        gameState.unlockedFocusItems.add(unlockId);
        // Advance phase based on focus unlock *if needed* (kept ADVANCED trigger)
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); }
        saveGameState();
        return true;
    }
    return false;
}
export function setContemplationCooldown(endTime) {
    gameState.contemplationCooldownEnd = endTime; saveGameState();
}

console.log("state.js loaded.");
// --- END OF FILE state.js ---
