// js/state.js - Manages Application State and Persistence
import * as Config from './config.js';
import { elementNames } from '../data.js'; // Only import needed data

console.log("state.js loading...");

// Default game state structure
const initialGameState = {
    userScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 },
    userAnswers: {}, // {elementName: {qId: answer, ...}}
    discoveredConcepts: new Map(), // ID -> { concept, discoveredTime, artUnlocked: boolean, notes: string }
    focusedConcepts: new Set(), // Set of Concept IDs
    focusSlotsTotal: Config.INITIAL_FOCUS_SLOTS,
    userInsight: Config.INITIAL_INSIGHT,
    elementAttunement: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
    unlockedDeepDiveLevels: { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 },
    achievedMilestones: new Set(), // Set of milestone IDs
    completedRituals: { daily: {}, weekly: {} }, // { ritualId: { completed: boolean, progress: number } }
    lastLoginDate: null,
    freeResearchAvailableToday: false,
    seenPrompts: new Set(), // Set of reflection prompt IDs seen
    currentElementIndex: -1, // For questionnaire state
    questionnaireCompleted: false,
    cardsAddedSinceLastPrompt: 0,
    promptCooldownActive: false, // For standard/rare reflection triggering
    discoveredRepositoryItems: {
        scenes: new Set(), // IDs of discovered SceneBlueprints
        experiments: new Set(), // IDs of COMPLETED AlchemicalExperiments
        insights: new Set() // IDs of discovered ElementalInsights
    },
    pendingRarePrompts: [], // Array of rare prompt IDs queued for reflection
    unlockedFocusItems: new Set(), // IDs of focusDrivenUnlocks definitions activated
    currentFocusSetHash: '', // Hash of the current focused concept IDs
    contemplationCooldownEnd: null, // Timestamp when cooldown ends *** ADDED ***
    onboardingPhase: Config.ONBOARDING_PHASE.START, // *** ADDED ***
};

// Initialize current state
let gameState = JSON.parse(JSON.stringify(initialGameState)); // Deep copy initial state

// --- Internal Helper ---
function _calculateFocusSetHash() {
    if (!gameState.focusedConcepts || gameState.focusedConcepts.size === 0) {
        return '';
    }
    const sortedIds = Array.from(gameState.focusedConcepts).sort((a, b) => a - b);
    return sortedIds.join(',');
}

// --- Saving & Loading ---
let saveTimeout = null;
const SAVE_DELAY = 1000; // Save 1 second after the last change

function _triggerSave() {
     const saveIndicator = document.getElementById('saveIndicator');
     if(saveIndicator) saveIndicator.classList.remove('hidden');

     if (saveTimeout) clearTimeout(saveTimeout);
     saveTimeout = setTimeout(() => {
         try {
             const stateToSave = {
                 ...gameState,
                 // Convert Maps and Sets to Arrays for JSON
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
             // console.log("State saved."); // Can be noisy
         } catch (error) {
             console.error("Error saving game state:", error);
         } finally {
              if(saveIndicator) saveIndicator.classList.add('hidden');
              saveTimeout = null;
         }
     }, SAVE_DELAY);
}

export function saveGameState() {
    _triggerSave();
}

export function loadGameState() {
    console.log("Attempting to load game state...");
    const savedData = localStorage.getItem(Config.SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found.");

            // Create a fresh default state to merge into
            const freshState = JSON.parse(JSON.stringify(initialGameState));

            // Merge loaded data, prioritizing loaded values but falling back to defaults
            // Ensure all properties from initialGameState are included here
            gameState = {
                userScores: typeof loadedState.userScores === 'object' && loadedState.userScores !== null ? { ...freshState.userScores, ...loadedState.userScores } : freshState.userScores,
                userAnswers: typeof loadedState.userAnswers === 'object' && loadedState.userAnswers !== null ? loadedState.userAnswers : freshState.userAnswers,
                discoveredConcepts: new Map(Array.isArray(loadedState.discoveredConcepts) ? loadedState.discoveredConcepts : []),
                focusedConcepts: new Set(Array.isArray(loadedState.focusedConcepts) ? loadedState.focusedConcepts : []),
                focusSlotsTotal: typeof loadedState.focusSlotsTotal === 'number' ? loadedState.focusSlotsTotal : freshState.focusSlotsTotal,
                userInsight: typeof loadedState.userInsight === 'number' ? loadedState.userInsight : freshState.userInsight,
                elementAttunement: typeof loadedState.elementAttunement === 'object' && loadedState.elementAttunement !== null ? { ...freshState.elementAttunement, ...loadedState.elementAttunement } : freshState.elementAttunement,
                unlockedDeepDiveLevels: typeof loadedState.unlockedDeepDiveLevels === 'object' && loadedState.unlockedDeepDiveLevels !== null ? { ...freshState.unlockedDeepDiveLevels, ...loadedState.unlockedDeepDiveLevels } : freshState.unlockedDeepDiveLevels,
                achievedMilestones: new Set(Array.isArray(loadedState.achievedMilestones) ? loadedState.achievedMilestones : []),
                completedRituals: typeof loadedState.completedRituals === 'object' && loadedState.completedRituals !== null ? loadedState.completedRituals : freshState.completedRituals,
                lastLoginDate: typeof loadedState.lastLoginDate === 'string' ? loadedState.lastLoginDate : freshState.lastLoginDate,
                freeResearchAvailableToday: typeof loadedState.freeResearchAvailableToday === 'boolean' ? loadedState.freeResearchAvailableToday : freshState.freeResearchAvailableToday,
                seenPrompts: new Set(Array.isArray(loadedState.seenPrompts) ? loadedState.seenPrompts : []),
                currentElementIndex: typeof loadedState.currentElementIndex === 'number' ? loadedState.currentElementIndex : freshState.currentElementIndex,
                questionnaireCompleted: typeof loadedState.questionnaireCompleted === 'boolean' ? loadedState.questionnaireCompleted : freshState.questionnaireCompleted,
                cardsAddedSinceLastPrompt: typeof loadedState.cardsAddedSinceLastPrompt === 'number' ? loadedState.cardsAddedSinceLastPrompt : freshState.cardsAddedSinceLastPrompt,
                promptCooldownActive: typeof loadedState.promptCooldownActive === 'boolean' ? loadedState.promptCooldownActive : freshState.promptCooldownActive,
                discoveredRepositoryItems: {
                    scenes: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.scenes) ? loadedState.discoveredRepositoryItems.scenes : []),
                    experiments: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.experiments) ? loadedState.discoveredRepositoryItems.experiments : []),
                    insights: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.insights) ? loadedState.discoveredRepositoryItems.insights : []),
                },
                pendingRarePrompts: Array.isArray(loadedState.pendingRarePrompts) ? loadedState.pendingRarePrompts : freshState.pendingRarePrompts,
                unlockedFocusItems: new Set(Array.isArray(loadedState.unlockedFocusItems) ? loadedState.unlockedFocusItems : []),
                contemplationCooldownEnd: typeof loadedState.contemplationCooldownEnd === 'number' ? loadedState.contemplationCooldownEnd : freshState.contemplationCooldownEnd, // *** Correctly Load ***
                onboardingPhase: typeof loadedState.onboardingPhase === 'number' ? loadedState.onboardingPhase : freshState.onboardingPhase, // *** Correctly Load ***
            };

            // Correct hash calculation - should use the just loaded gameState
            gameState.currentFocusSetHash = _calculateFocusSetHash(); // Recalculate hash on load using the updated gameState.focusedConcepts

            console.log("Game state loaded successfully.");
            return true;
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(Config.SAVE_KEY);
            gameState = JSON.parse(JSON.stringify(initialGameState)); // Reset to default on error
            return false;
        }
    } else {
        console.log("No saved game state found.");
        gameState = JSON.parse(JSON.stringify(initialGameState)); // Ensure default state
        gameState.currentFocusSetHash = ''; // Ensure hash is empty initially
        return false;
    }
}

export function clearGameState() {
    localStorage.removeItem(Config.SAVE_KEY);
    gameState = JSON.parse(JSON.stringify(initialGameState)); // Reset to default
    gameState.currentFocusSetHash = ''; // Ensure hash is empty
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
export function getContemplationCooldownEnd() { return gameState.contemplationCooldownEnd; } // *** Correct Getter ***
export function getOnboardingPhase() { return gameState.onboardingPhase; } // *** Correct Getter ***
export function isFreeResearchAvailable() { return gameState.freeResearchAvailableToday; }

// --- Setters / Updaters (Trigger Save) ---
export function updateScores(newScores) {
    gameState.userScores = { ...newScores };
    saveGameState();
    return true;
}
export function saveAllAnswers(allAnswers) {
    gameState.userAnswers = JSON.parse(JSON.stringify(allAnswers));
    saveGameState();
}
export function updateAnswers(elementName, answersForElement) {
    if (!gameState.userAnswers[elementName]) { gameState.userAnswers[elementName] = {}; }
    gameState.userAnswers[elementName] = { ...answersForElement };
    // No save here, saved implicitly by other actions
}
export function updateElementIndex(index) {
    gameState.currentElementIndex = index;
    // No save here
}
export function setQuestionnaireComplete() {
    gameState.currentElementIndex = elementNames.length; // Use length to mark finished
    if (!gameState.questionnaireCompleted) {
        gameState.questionnaireCompleted = true;
        advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE); // Progress phase
        // Save now handled by finalizeQuestionnaire
    }
    return true;
}
export function advanceOnboardingPhase(targetPhase) { // *** CORRECTED Function ***
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
export function updateAttunement(elementKey, amount) {
    if (gameState.elementAttunement.hasOwnProperty(elementKey)) {
        const current = gameState.elementAttunement[elementKey];
        const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
        if (newValue !== current) { gameState.elementAttunement[elementKey] = newValue; saveGameState(); return true; }
    }
    return false;
}
export function addDiscoveredConcept(conceptId, conceptData) {
    if (!gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.set(conceptId, { concept: conceptData, discoveredTime: Date.now(), artUnlocked: false, notes: "" });
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.discoveredConcepts.size >= 1) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT); }
        saveGameState();
        return true;
    }
    return false;
}
export function removeDiscoveredConcept(conceptId) {
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        if (gameState.focusedConcepts.has(conceptId)) { gameState.focusedConcepts.delete(conceptId); gameState.currentFocusSetHash = _calculateFocusSetHash(); }
        saveGameState();
        return true;
    }
    return false;
}
export function toggleFocusConcept(conceptId) {
    if (!gameState.discoveredConcepts.has(conceptId)) return 'not_discovered';
    let result;
    if (gameState.focusedConcepts.has(conceptId)) { gameState.focusedConcepts.delete(conceptId); result = 'removed'; }
    else {
        if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) { return 'slots_full'; }
        gameState.focusedConcepts.add(conceptId); result = 'added';
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.focusedConcepts.size >= 1) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT); }
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
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data) { data.notes = notes; gameState.discoveredConcepts.set(conceptId, data); saveGameState(); return true; }
    return false;
}
export function unlockArt(conceptId) {
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data && !data.artUnlocked) {
        data.artUnlocked = true; gameState.discoveredConcepts.set(conceptId, data);
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
            if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED && Object.values(gameState.unlockedDeepDiveLevels).some(l => l >= 1)) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); }
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
export function setFreeResearchUsed() {
    gameState.freeResearchAvailableToday = false; saveGameState();
}
export function completeRitualProgress(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {}; if (!gameState.completedRituals[period][ritualId]) gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 };
    gameState.completedRituals[period][ritualId].progress += 1; saveGameState();
    return gameState.completedRituals[period][ritualId].progress;
}
export function markRitualComplete(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]?.[ritualId]) { completeRitualProgress(ritualId, period); } // Ensure progress exists
    if (gameState.completedRituals[period]?.[ritualId]) { gameState.completedRituals[period][ritualId].completed = true; saveGameState(); }
}
export function addAchievedMilestone(milestoneId) {
    if (!gameState.achievedMilestones.has(milestoneId)) {
        gameState.achievedMilestones.add(milestoneId);
        // Auto-advance onboarding phase based on milestones
        if (milestoneId === 'ms01' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
        if (milestoneId === 'ms03' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
        if (milestoneId === 'ms05' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT) advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        if (milestoneId === 'ms07' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS);
        if (['ms60', 'ms70', 'ms71'].includes(milestoneId) && gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
        saveGameState();
        return true;
    }
    return false;
}
export function addSeenPrompt(promptId) {
    gameState.seenPrompts.add(promptId); saveGameState();
}
export function incrementReflectionTrigger() {
    gameState.cardsAddedSinceLastPrompt++; // No save here
}
export function resetReflectionTrigger(startCooldown = false) { // Renamed
    gameState.cardsAddedSinceLastPrompt = 0;
    if (startCooldown) { setPromptCooldownActive(true); } // Call setter
    // No save here
}
export function setPromptCooldownActive(isActive) { // Added separate setter
    gameState.promptCooldownActive = isActive;
    // Save state handled by gameLogic cooldown timeout or other actions
}
export function clearReflectionCooldown() { // Maintained for potential direct use
    gameState.promptCooldownActive = false; saveGameState();
}
export function addRepositoryItem(itemType, itemId) {
    if (gameState.discoveredRepositoryItems[itemType] && !gameState.discoveredRepositoryItems[itemType].has(itemId)) {
        gameState.discoveredRepositoryItems[itemType].add(itemId);
        const repoNotEmpty = Object.values(gameState.discoveredRepositoryItems).some(set => set.size > 0);
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED && repoNotEmpty) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); }
        saveGameState();
        return true;
    }
    return false;
}
export function addPendingRarePrompt(promptId) {
    if (!gameState.pendingRarePrompts.includes(promptId)) { gameState.pendingRarePrompts.push(promptId); saveGameState(); return true; }
    return false;
}
export function getNextRarePrompt() {
    if (gameState.pendingRarePrompts.length > 0) { const promptId = gameState.pendingRarePrompts.shift(); saveGameState(); return promptId; }
    return null;
}
export function addUnlockedFocusItem(unlockId) {
    if (!gameState.unlockedFocusItems.has(unlockId)) {
        gameState.unlockedFocusItems.add(unlockId);
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); }
        saveGameState();
        return true;
    }
    return false;
}
export function setContemplationCooldown(endTime) { // *** CORRECTED Setter ***
    gameState.contemplationCooldownEnd = endTime; saveGameState();
}

console.log("state.js loaded.");
