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
        currentElementIndex: -1,
        questionnaireCompleted: false,
        cardsAddedSinceLastPrompt: 0,
        promptCooldownActive: false,
        discoveredRepositoryItems: { scenes: new Set(), experiments: new Set(), insights: new Set() },
        pendingRarePrompts: [],
        unlockedFocusItems: new Set(),
        currentFocusSetHash: '',
        contemplationCooldownEnd: null,
        onboardingPhase: Config.ONBOARDING_PHASE.START,
        // NEW Onboarding step flags:
        hasSeenResultsModal: false,
        hasSeenGrimoireTutorial: false,
        hasSeenFocusTutorial: false,
        hasSeenStudyTutorial: false,
        hasSeenReflectionIntro: false,
    };
    // *** Explicitly initialize userAnswers sub-objects ***
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
const SAVE_DELAY = 1000;

function _triggerSave() {
     const saveIndicator = document.getElementById('saveIndicator');
     if(saveIndicator) saveIndicator.classList.remove('hidden');
     if (saveTimeout) clearTimeout(saveTimeout);
     saveTimeout = setTimeout(() => {
         try {
             // The spread operator (...) correctly copies all top-level properties,
             // including the new boolean onboarding flags.
             const stateToSave = {
                 ...gameState,
                 // Convert Sets and Maps to Arrays for JSON serialization
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
            gameState = createInitialGameState(); // Start fresh

            // Merge loaded data carefully
            gameState.userScores = typeof loadedState.userScores === 'object' && loadedState.userScores !== null ? { ...gameState.userScores, ...loadedState.userScores } : gameState.userScores;
            gameState.userAnswers = typeof loadedState.userAnswers === 'object' && loadedState.userAnswers !== null ? loadedState.userAnswers : {};
            elementNames.forEach(name => { if (!gameState.userAnswers[name]) gameState.userAnswers[name] = {}; });
            gameState.discoveredConcepts = new Map(Array.isArray(loadedState.discoveredConcepts) ? loadedState.discoveredConcepts : []);
            gameState.focusedConcepts = new Set(Array.isArray(loadedState.focusedConcepts) ? loadedState.focusedConcepts : []);
            gameState.focusSlotsTotal = typeof loadedState.focusSlotsTotal === 'number' ? loadedState.focusSlotsTotal : gameState.focusSlotsTotal;
            gameState.userInsight = typeof loadedState.userInsight === 'number' ? loadedState.userInsight : gameState.userInsight;
            gameState.elementAttunement = typeof loadedState.elementAttunement === 'object' && loadedState.elementAttunement !== null ? { ...gameState.elementAttunement, ...loadedState.elementAttunement } : gameState.elementAttunement;
            gameState.unlockedDeepDiveLevels = typeof loadedState.unlockedDeepDiveLevels === 'object' && loadedState.unlockedDeepDiveLevels !== null ? { ...gameState.unlockedDeepDiveLevels, ...loadedState.unlockedDeepDiveLevels } : gameState.unlockedDeepDiveLevels;
            gameState.achievedMilestones = new Set(Array.isArray(loadedState.achievedMilestones) ? loadedState.achievedMilestones : []);
            gameState.completedRituals = typeof loadedState.completedRituals === 'object' && loadedState.completedRituals !== null ? loadedState.completedRituals : gameState.completedRituals;
            gameState.lastLoginDate = typeof loadedState.lastLoginDate === 'string' ? loadedState.lastLoginDate : gameState.lastLoginDate;
            gameState.freeResearchAvailableToday = typeof loadedState.freeResearchAvailableToday === 'boolean' ? loadedState.freeResearchAvailableToday : gameState.freeResearchAvailableToday;
            gameState.seenPrompts = new Set(Array.isArray(loadedState.seenPrompts) ? loadedState.seenPrompts : []);
            gameState.currentElementIndex = typeof loadedState.currentElementIndex === 'number' ? loadedState.currentElementIndex : gameState.currentElementIndex;
            gameState.questionnaireCompleted = typeof loadedState.questionnaireCompleted === 'boolean' ? loadedState.questionnaireCompleted : gameState.questionnaireCompleted;
            gameState.cardsAddedSinceLastPrompt = typeof loadedState.cardsAddedSinceLastPrompt === 'number' ? loadedState.cardsAddedSinceLastPrompt : gameState.cardsAddedSinceLastPrompt;
            gameState.promptCooldownActive = typeof loadedState.promptCooldownActive === 'boolean' ? loadedState.promptCooldownActive : gameState.promptCooldownActive;
            gameState.discoveredRepositoryItems = {
                scenes: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.scenes) ? loadedState.discoveredRepositoryItems.scenes : []),
                experiments: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.experiments) ? loadedState.discoveredRepositoryItems.experiments : []),
                insights: new Set(Array.isArray(loadedState.discoveredRepositoryItems?.insights) ? loadedState.discoveredRepositoryItems.insights : []),
            };
            gameState.pendingRarePrompts = Array.isArray(loadedState.pendingRarePrompts) ? loadedState.pendingRarePrompts : gameState.pendingRarePrompts;
            gameState.unlockedFocusItems = new Set(Array.isArray(loadedState.unlockedFocusItems) ? loadedState.unlockedFocusItems : []);
            gameState.contemplationCooldownEnd = typeof loadedState.contemplationCooldownEnd === 'number' ? loadedState.contemplationCooldownEnd : gameState.contemplationCooldownEnd;

            // Load onboarding phase and flags (provide defaults if missing)
            gameState.onboardingPhase = typeof loadedState.onboardingPhase === 'number' ? loadedState.onboardingPhase : Config.ONBOARDING_PHASE.START;
            gameState.hasSeenResultsModal = typeof loadedState.hasSeenResultsModal === 'boolean' ? loadedState.hasSeenResultsModal : false;
            gameState.hasSeenGrimoireTutorial = typeof loadedState.hasSeenGrimoireTutorial === 'boolean' ? loadedState.hasSeenGrimoireTutorial : false;
            gameState.hasSeenFocusTutorial = typeof loadedState.hasSeenFocusTutorial === 'boolean' ? loadedState.hasSeenFocusTutorial : false;
            gameState.hasSeenStudyTutorial = typeof loadedState.hasSeenStudyTutorial === 'boolean' ? loadedState.hasSeenStudyTutorial : false;
            gameState.hasSeenReflectionIntro = typeof loadedState.hasSeenReflectionIntro === 'boolean' ? loadedState.hasSeenReflectionIntro : false;

            gameState.currentFocusSetHash = _calculateFocusSetHash();

            console.log("Game state loaded successfully.");
            return true;
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(Config.SAVE_KEY);
            gameState = createInitialGameState(); // Reset to default using the function
            return false;
        }
    } else {
        console.log("No saved game state found.");
        gameState = createInitialGameState(); // Ensure default state using the function
        return false;
    }
}

export function clearGameState() {
    localStorage.removeItem(Config.SAVE_KEY);
    gameState = createInitialGameState(); // Reset to default using the function
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
// New flag getters
export function getHasSeenResultsModal() { return gameState.hasSeenResultsModal; }
export function getHasSeenGrimoireTutorial() { return gameState.hasSeenGrimoireTutorial; }
export function getHasSeenFocusTutorial() { return gameState.hasSeenFocusTutorial; }
export function getHasSeenStudyTutorial() { return gameState.hasSeenStudyTutorial; }
export function getHasSeenReflectionIntro() { return gameState.hasSeenReflectionIntro; }

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
    if (!gameState.userAnswers) { gameState.userAnswers = {}; }
    if (!gameState.userAnswers[elementName]) { gameState.userAnswers[elementName] = {}; }
    gameState.userAnswers[elementName] = { ...answersForElement };
    // No save here, saved implicitly by other actions
}
export function updateElementIndex(index) {
    gameState.currentElementIndex = index;
    // No save here
}
export function setQuestionnaireComplete() {
    gameState.currentElementIndex = elementNames.length; // Mark finished
    if (!gameState.questionnaireCompleted) {
        gameState.questionnaireCompleted = true;
        // Onboarding phase advancement is now handled AFTER the results modal
        // advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
    }
    // Save state is handled AFTER showing results modal in gameLogic
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
export function updateAttunement(elementKey, amount) {
    if (gameState.elementAttunement.hasOwnProperty(elementKey)) {
        const current = gameState.elementAttunement[elementKey];
        const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
        if (newValue !== current) { gameState.elementAttunement[elementKey] = newValue; saveGameState(); return true; }
    }
    return false;
}
export function addDiscoveredConcept(conceptId, conceptData) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map in addDiscoveredConcept!"); gameState.discoveredConcepts = new Map(); }
    if (!gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.set(conceptId, { concept: conceptData, discoveredTime: Date.now(), artUnlocked: false, notes: "" });
        // Phase advancement handled by core game loop milestones/actions now
        saveGameState();
        return true;
    }
    return false;
}
export function removeDiscoveredConcept(conceptId) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map in removeDiscoveredConcept!"); return false; }
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        if (gameState.focusedConcepts.has(conceptId)) { gameState.focusedConcepts.delete(conceptId); gameState.currentFocusSetHash = _calculateFocusSetHash(); }
        saveGameState();
        return true;
    }
    return false;
}
export function toggleFocusConcept(conceptId) {
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map in toggleFocusConcept!"); return 'not_discovered'; }
    if (!gameState.discoveredConcepts.has(conceptId)) return 'not_discovered';
    let result;
    if (gameState.focusedConcepts.has(conceptId)) { gameState.focusedConcepts.delete(conceptId); result = 'removed'; }
    else {
        if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) { return 'slots_full'; }
        gameState.focusedConcepts.add(conceptId); result = 'added';
        // Advance phase only if needed and first focus concept added
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.focusedConcepts.size === 1) {
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
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
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map in updateNotes!"); return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data) { data.notes = notes; gameState.discoveredConcepts.set(conceptId, data); saveGameState(); return true; }
    return false;
}
export function unlockArt(conceptId) {
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map in unlockArt!"); return false; }
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
    if (!(gameState.achievedMilestones instanceof Set)) { console.error("CRITICAL ERROR: gameState.achievedMilestones is not a Set!"); gameState.achievedMilestones = new Set();}
    if (!gameState.achievedMilestones.has(milestoneId)) {
        gameState.achievedMilestones.add(milestoneId);
        // Phase advancement based on milestones (adjust as needed)
        // Example: Milestone 'ms_unlock_study' triggers STUDY_INSIGHT phase
        const STUDY_UNLOCK_MILESTONE_ID = 'ms05'; // Example ID
        const REFLECTION_UNLOCK_MILESTONE_ID = 'ms07'; // Example ID
        const REPO_UNLOCK_MILESTONE_ID = 'msXX_REPO_UNLOCK'; // *** REPLACE WITH ACTUAL ID ***

        if (milestoneId === STUDY_UNLOCK_MILESTONE_ID && gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT) advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        if (milestoneId === REFLECTION_UNLOCK_MILESTONE_ID && gameState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS);
        if (milestoneId === REPO_UNLOCK_MILESTONE_ID && gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);
        // Add other relevant milestone triggers

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
    // No save here, triggered by other actions
}
export function resetReflectionTrigger(startCooldown = false) {
    gameState.cardsAddedSinceLastPrompt = 0;
    if (startCooldown) { setPromptCooldownActive(true); }
    // No immediate save, cooldown timeout or other actions will save
}
export function setPromptCooldownActive(isActive) {
    gameState.promptCooldownActive = isActive;
    // Save state handled by gameLogic cooldown timeout or other actions
}
export function clearReflectionCooldown() {
    gameState.promptCooldownActive = false; saveGameState();
}
export function addRepositoryItem(itemType, itemId) {
    if (!gameState.discoveredRepositoryItems[itemType]) { console.error(`Invalid repo item type: ${itemType}`); return false;}
    if (!(gameState.discoveredRepositoryItems[itemType] instanceof Set)) { console.error(`CRITICAL ERROR: gameState.discoveredRepositoryItems.${itemType} is not a Set!`); gameState.discoveredRepositoryItems[itemType] = new Set();}
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
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) { advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); }
        saveGameState();
        return true;
    }
    return false;
}
export function setContemplationCooldown(endTime) {
    gameState.contemplationCooldownEnd = endTime; saveGameState();
}

// Setters for new onboarding flags
export function setHasSeenResultsModal(seen = true) {
    if (gameState.hasSeenResultsModal !== seen) {
        gameState.hasSeenResultsModal = seen;
        // If the results modal is seen, advance to the next phase if not already there
        if (seen && gameState.onboardingPhase < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) {
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
        } else {
             saveGameState(); // Save even if phase didn't change
        }
    }
}
export function setHasSeenGrimoireTutorial(seen = true) {
    if (gameState.hasSeenGrimoireTutorial !== seen) { gameState.hasSeenGrimoireTutorial = seen; saveGameState(); }
}
export function setHasSeenFocusTutorial(seen = true) {
    if (gameState.hasSeenFocusTutorial !== seen) {
         gameState.hasSeenFocusTutorial = seen;
          // Seeing the focus tutorial might imply study should be unlocked if not already
          if (seen && gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
               advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
          } else {
               saveGameState();
          }
    }
}
export function setHasSeenStudyTutorial(seen = true) {
    if (gameState.hasSeenStudyTutorial !== seen) {
         gameState.hasSeenStudyTutorial = seen;
         // Seeing study tutorial might unlock reflection phase
         if (seen && gameState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
              advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS);
         } else {
              saveGameState();
         }
    }
}
export function setHasSeenReflectionIntro(seen = true) {
    if (gameState.hasSeenReflectionIntro !== seen) { gameState.hasSeenReflectionIntro = seen; saveGameState(); }
}

console.log("state.js loaded.");
