// --- START OF FILE state.js ---

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
        currentElementIndex: -1, // Start at -1, set to 0 on questionnaire init
        questionnaireCompleted: false,
        cardsAddedSinceLastPrompt: 0,
        promptCooldownActive: false,
        discoveredRepositoryItems: { scenes: new Set(), experiments: new Set(), insights: new Set() },
        pendingRarePrompts: [],
        unlockedFocusItems: new Set(),
        currentFocusSetHash: '',
        contemplationCooldownEnd: null,
        onboardingPhase: Config.ONBOARDING_PHASE.START,
        completedTasks: new Set(), // Track completed onboarding/guidance tasks
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
// Calculates a simple hash based on sorted focused concept IDs
function _calculateFocusSetHash() {
    if (!gameState.focusedConcepts || gameState.focusedConcepts.size === 0) { return ''; }
    const sortedIds = Array.from(gameState.focusedConcepts).sort((a, b) => a - b);
    return sortedIds.join(',');
}

// --- Saving & Loading ---
let saveTimeout = null;
const SAVE_DELAY = 1000; // Delay between triggering save and actually saving

// Triggers a save operation after a short delay, debouncing multiple calls
function _triggerSave() {
     const saveIndicator = document.getElementById('saveIndicator');
     if(saveIndicator) saveIndicator.classList.remove('hidden'); // Show indicator
     if (saveTimeout) clearTimeout(saveTimeout); // Clear previous timeout if exists
     saveTimeout = setTimeout(() => {
         try {
             // Prepare state for JSON serialization (convert Map/Set to Array)
             const stateToSave = {
                 ...gameState, // Copy all basic properties
                 discoveredConcepts: Array.from(gameState.discoveredConcepts.entries()),
                 focusedConcepts: Array.from(gameState.focusedConcepts),
                 achievedMilestones: Array.from(gameState.achievedMilestones),
                 seenPrompts: Array.from(gameState.seenPrompts),
                 discoveredRepositoryItems: {
                     scenes: Array.from(gameState.discoveredRepositoryItems.scenes),
                     experiments: Array.from(gameState.discoveredRepositoryItems.experiments),
                     insights: Array.from(gameState.discoveredRepositoryItems.insights),
                 },
                 unlockedFocusItems: Array.from(gameState.unlockedFocusItems),
                 completedTasks: Array.from(gameState.completedTasks) // Save tasks
             };
             localStorage.setItem(Config.SAVE_KEY, JSON.stringify(stateToSave));
             // console.log("Game state saved."); // Optional: confirmation log
         } catch (error) {
            console.error("Error saving game state:", error);
            // Optionally show an error message to the user via UI
            // UI.showTemporaryMessage("Error: Could not save progress!", 4000);
         } finally {
            if(saveIndicator) saveIndicator.classList.add('hidden'); // Hide indicator
            saveTimeout = null; // Clear timeout ID
         }
     }, SAVE_DELAY);
}

// Public function to request a save
export function saveGameState() {
    _triggerSave();
}

// Loads game state from localStorage
export function loadGameState() {
    console.log("Attempting to load game state...");
    const savedData = localStorage.getItem(Config.SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            console.log("Saved data found.");
            // Start fresh but merge known properties carefully
            gameState = createInitialGameState();

            // Merge known properties, falling back to initial defaults if missing/invalid
            if (typeof loadedState.userScores === 'object' && loadedState.userScores !== null) gameState.userScores = { ...gameState.userScores, ...loadedState.userScores };
            if (typeof loadedState.userAnswers === 'object' && loadedState.userAnswers !== null) gameState.userAnswers = loadedState.userAnswers;
            elementNames.forEach(name => { if (!gameState.userAnswers[name]) gameState.userAnswers[name] = {}; }); // Ensure keys exist

            if (Array.isArray(loadedState.discoveredConcepts)) gameState.discoveredConcepts = new Map(loadedState.discoveredConcepts);
            if (Array.isArray(loadedState.focusedConcepts)) gameState.focusedConcepts = new Set(loadedState.focusedConcepts);
            if (typeof loadedState.focusSlotsTotal === 'number' && !isNaN(loadedState.focusSlotsTotal)) gameState.focusSlotsTotal = loadedState.focusSlotsTotal;
            if (typeof loadedState.userInsight === 'number' && !isNaN(loadedState.userInsight)) gameState.userInsight = loadedState.userInsight;
            if (typeof loadedState.elementAttunement === 'object' && loadedState.elementAttunement !== null) gameState.elementAttunement = { ...gameState.elementAttunement, ...loadedState.elementAttunement };
            if (typeof loadedState.unlockedDeepDiveLevels === 'object' && loadedState.unlockedDeepDiveLevels !== null) gameState.unlockedDeepDiveLevels = { ...gameState.unlockedDeepDiveLevels, ...loadedState.unlockedDeepDiveLevels };
            if (Array.isArray(loadedState.achievedMilestones)) gameState.achievedMilestones = new Set(loadedState.achievedMilestones);
            if (typeof loadedState.completedRituals === 'object' && loadedState.completedRituals !== null) gameState.completedRituals = loadedState.completedRituals;
            if (typeof loadedState.lastLoginDate === 'string') gameState.lastLoginDate = loadedState.lastLoginDate;
            if (typeof loadedState.freeResearchAvailableToday === 'boolean') gameState.freeResearchAvailableToday = loadedState.freeResearchAvailableToday;
            if (Array.isArray(loadedState.seenPrompts)) gameState.seenPrompts = new Set(loadedState.seenPrompts);
            // Careful with index, ensure it reflects completion status
            if (typeof loadedState.questionnaireCompleted === 'boolean') gameState.questionnaireCompleted = loadedState.questionnaireCompleted;
            gameState.currentElementIndex = gameState.questionnaireCompleted ? elementNames.length : (typeof loadedState.currentElementIndex === 'number' ? loadedState.currentElementIndex : -1);
            if (typeof loadedState.cardsAddedSinceLastPrompt === 'number' && !isNaN(loadedState.cardsAddedSinceLastPrompt)) gameState.cardsAddedSinceLastPrompt = loadedState.cardsAddedSinceLastPrompt;
            if (typeof loadedState.promptCooldownActive === 'boolean') gameState.promptCooldownActive = loadedState.promptCooldownActive;

            // Load Repository Items carefully
            gameState.discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() };
             if (typeof loadedState.discoveredRepositoryItems === 'object' && loadedState.discoveredRepositoryItems !== null) {
                 if (Array.isArray(loadedState.discoveredRepositoryItems.scenes)) gameState.discoveredRepositoryItems.scenes = new Set(loadedState.discoveredRepositoryItems.scenes);
                 if (Array.isArray(loadedState.discoveredRepositoryItems.experiments)) gameState.discoveredRepositoryItems.experiments = new Set(loadedState.discoveredRepositoryItems.experiments);
                 if (Array.isArray(loadedState.discoveredRepositoryItems.insights)) gameState.discoveredRepositoryItems.insights = new Set(loadedState.discoveredRepositoryItems.insights);
             }
            if (Array.isArray(loadedState.pendingRarePrompts)) gameState.pendingRarePrompts = loadedState.pendingRarePrompts;
            if (Array.isArray(loadedState.unlockedFocusItems)) gameState.unlockedFocusItems = new Set(loadedState.unlockedFocusItems);
            if (typeof loadedState.contemplationCooldownEnd === 'number' && !isNaN(loadedState.contemplationCooldownEnd)) gameState.contemplationCooldownEnd = loadedState.contemplationCooldownEnd;
            gameState.onboardingPhase = (typeof loadedState.onboardingPhase === 'number' && Object.values(Config.ONBOARDING_PHASE).includes(loadedState.onboardingPhase)) ? loadedState.onboardingPhase : Config.ONBOARDING_PHASE.START;
            if (Array.isArray(loadedState.completedTasks)) gameState.completedTasks = new Set(loadedState.completedTasks); // Load tasks

            gameState.currentFocusSetHash = _calculateFocusSetHash(); // Recalculate hash

            console.log("Game state loaded successfully.");
            return true; // Indicate success
        } catch (error) {
            console.error("Error loading or parsing game state:", error);
            localStorage.removeItem(Config.SAVE_KEY); // Clear corrupted data
            gameState = createInitialGameState(); // Reset to default
            return false; // Indicate failure
        }
    } else {
        console.log("No saved game state found.");
        gameState = createInitialGameState(); // Ensure default state
        return false; // Indicate no data found
    }
}

// Clears saved data and resets the current game state
export function clearGameState() {
    localStorage.removeItem(Config.SAVE_KEY);
    gameState = createInitialGameState(); // Reset to default using the function
    console.log("Game state cleared and reset.");
    // No save needed here, as we want the cleared state reflected immediately
}

// --- Getters ---
// Provide read-only access to specific parts of the state
export function getState() { return gameState; } // Use sparingly, prefer specific getters
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
export function getCompletedTasks() { return gameState.completedTasks; }


// --- Setters / Updaters (Trigger Save) ---
// Functions to modify the state, usually triggering a save

export function updateScores(newScores) {
    gameState.userScores = { ...gameState.userScores, ...newScores }; // Merge rather than replace?
    saveGameState();
    return true;
}
// Saves the entire userAnswers object - use carefully, prefer updateAnswers
export function saveAllAnswers(allAnswers) {
    // Deep copy to avoid mutation issues if allAnswers is modified elsewhere
    gameState.userAnswers = JSON.parse(JSON.stringify(allAnswers));
    saveGameState();
}
// Updates answers for a single element during the questionnaire
export function updateAnswers(elementName, answersForElement) {
    if (!gameState.userAnswers) { gameState.userAnswers = {}; }
    if (!gameState.userAnswers[elementName]) { gameState.userAnswers[elementName] = {}; }
    gameState.userAnswers[elementName] = { ...answersForElement };
    // No save here - saved by finalizeQuestionnaire or goToNext/Prev logic indirectly
}
// Updates the current index in the questionnaire
export function updateElementIndex(index) {
    // Basic validation
    if (typeof index === 'number' && index >= -1 && index <= elementNames.length) {
         gameState.currentElementIndex = index;
         console.log(`State: currentElementIndex updated to ${index}`);
    } else {
         console.warn(`State: Invalid attempt to update element index to ${index}`);
    }
    // No save here - not critical state usually
}
// Marks the questionnaire as complete and handles phase advancement
export function setQuestionnaireComplete() {
    gameState.currentElementIndex = elementNames.length; // Mark finished index
    if (!gameState.questionnaireCompleted) {
        gameState.questionnaireCompleted = true;
        // Advance phase ONLY if it's currently below the target
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) {
             advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE); // Phase advancement now triggers its own save
        } else {
            saveGameState(); // Save if phase didn't change but completion did
        }
    } else {
        // If already complete, maybe save just in case index was wrong?
        saveGameState();
    }
    return true;
}
// Advances the onboarding phase if the target is higher than current
export function advanceOnboardingPhase(targetPhase) {
    if (targetPhase > gameState.onboardingPhase) {
        console.log(`Advancing onboarding phase from ${gameState.onboardingPhase} to ${targetPhase}`);
        gameState.onboardingPhase = targetPhase;
        saveGameState(); // Save phase change
        // Trigger task update check after phase change
        // Import GameLogic carefully if needed, or handle in main.js/ui.js listener
         // import * as GameLogic from './gameLogic.js'; // CAUTION: Potential circular dependency
         // GameLogic.updateAvailableTasks(); // Ideally call this from where advanceOnboardingPhase is called
        return true;
    }
    return false;
}
// Changes user insight, ensuring it doesn't go below 0
export function changeInsight(amount) {
    const previousInsight = gameState.userInsight;
    gameState.userInsight = Math.max(0, previousInsight + amount);
    if (gameState.userInsight !== previousInsight) { saveGameState(); return true; }
    return false;
}
// Updates attunement for a specific element, clamping values
export function updateAttunement(elementKey, amount) {
    if (gameState.elementAttunement.hasOwnProperty(elementKey)) {
        const current = gameState.elementAttunement[elementKey];
        const newValue = Math.min(Config.MAX_ATTUNEMENT, Math.max(0, current + amount));
        if (newValue !== current) {
            gameState.elementAttunement[elementKey] = newValue;
            saveGameState();
            return true;
        }
    }
    return false;
}
// Adds a concept to the discovered list
export function addDiscoveredConcept(conceptId, conceptData) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); gameState.discoveredConcepts = new Map(); }
    if (!gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.set(conceptId, { concept: conceptData, discoveredTime: Date.now(), artUnlocked: false, notes: "" });
        // Phase advancement logic
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.discoveredConcepts.size >= 1) {
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT); // Phase advancement triggers save
        } else {
            saveGameState(); // Save if phase didn't change
        }
        return true;
    }
    return false;
}
// Removes a concept from the discovered list and focus set if present
export function removeDiscoveredConcept(conceptId) {
    if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    if (gameState.discoveredConcepts.has(conceptId)) {
        gameState.discoveredConcepts.delete(conceptId);
        let focusChanged = false;
        if (gameState.focusedConcepts.has(conceptId)) {
            gameState.focusedConcepts.delete(conceptId);
            gameState.currentFocusSetHash = _calculateFocusSetHash();
            focusChanged = true;
        }
        saveGameState();
        // Return value could indicate if focus also changed, if needed
        return { removed: true, focusChanged: focusChanged };
    }
    return { removed: false, focusChanged: false };
}
// Toggles a concept in the focus set, handling slot limits and phase advancement
export function toggleFocusConcept(conceptId) {
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return 'error'; }
    if (!gameState.discoveredConcepts.has(conceptId)) return 'not_discovered';

    let result;
    if (gameState.focusedConcepts.has(conceptId)) {
        gameState.focusedConcepts.delete(conceptId);
        result = 'removed';
    } else {
        if (gameState.focusedConcepts.size >= gameState.focusSlotsTotal) {
            return 'slots_full'; // Cannot add more
        }
        gameState.focusedConcepts.add(conceptId);
        result = 'added';
        // Phase advancement logic
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.focusedConcepts.size >= 1) {
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT); // Triggers save
        }
    }
    gameState.currentFocusSetHash = _calculateFocusSetHash(); // Update hash
    // Save only if phase didn't already trigger a save
    if (!(result === 'added' && gameState.onboardingPhase === Config.ONBOARDING_PHASE.STUDY_INSIGHT && gameState.focusedConcepts.size === 1)) {
         saveGameState();
    }
    return result;
}
// Increases the total focus slots available
export function increaseFocusSlots(amount = 1) {
    const newSlots = Math.min(Config.MAX_FOCUS_SLOTS, gameState.focusSlotsTotal + amount);
    if (newSlots > gameState.focusSlotsTotal) {
        gameState.focusSlotsTotal = newSlots;
        saveGameState();
        return true;
    }
    return false;
}
// Updates personal notes for a discovered concept
export function updateNotes(conceptId, notes) {
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data) {
        data.notes = notes; // Update notes property directly
        // No need to use set() again unless the structure needs replacing
        // gameState.discoveredConcepts.set(conceptId, data); // This is okay too
        saveGameState();
        return true;
    }
    return false;
}
// Unlocks the enhanced art for a concept
export function unlockArt(conceptId) {
     if (!(gameState.discoveredConcepts instanceof Map)) { console.error("CRITICAL ERROR: gameState.discoveredConcepts is not a Map!"); return false; }
    const data = gameState.discoveredConcepts.get(conceptId);
    if (data && !data.artUnlocked) {
        data.artUnlocked = true;
        // Phase advancement logic
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) {
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); // Triggers save
        } else {
            saveGameState(); // Save if phase didn't change
        }
        return true;
    }
    return false;
}
// Unlocks the next level of deep dive insights for an element
export function unlockLibraryLevel(elementKey, level) {
    if (gameState.unlockedDeepDiveLevels.hasOwnProperty(elementKey)) {
        const currentLevel = gameState.unlockedDeepDiveLevels[elementKey];
        if (level === currentLevel + 1) {
            gameState.unlockedDeepDiveLevels[elementKey] = level;
             // Phase advancement logic
            const anyLevelOne = Object.values(gameState.unlockedDeepDiveLevels).some(l => l >= 1);
            if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED && anyLevelOne) {
                advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); // Triggers save
            } else {
                 saveGameState(); // Save if phase didn't change
            }
            return true;
        }
    }
    return false;
}
// Resets daily progress (rituals, free research) and sets last login
export function resetDailyRituals() {
    gameState.completedRituals.daily = {};
    gameState.freeResearchAvailableToday = true;
    gameState.lastLoginDate = new Date().toDateString();
    saveGameState();
}
// Marks free research as used for the day
export function setFreeResearchUsed() {
    gameState.freeResearchAvailableToday = false;
    saveGameState();
}
// Increments progress for a ritual
export function completeRitualProgress(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]) gameState.completedRituals[period] = {};
    if (!gameState.completedRituals[period][ritualId]) gameState.completedRituals[period][ritualId] = { completed: false, progress: 0 };
    gameState.completedRituals[period][ritualId].progress += 1;
    saveGameState(); // Save progress
    return gameState.completedRituals[period][ritualId].progress;
}
// Marks a ritual as fully completed for the period
export function markRitualComplete(ritualId, period = 'daily') {
    if (!gameState.completedRituals[period]?.[ritualId]) {
        completeRitualProgress(ritualId, period); // Ensure progress exists and save
    }
    // Ensure it exists again after potential creation above
    if (gameState.completedRituals[period]?.[ritualId]) {
        if (!gameState.completedRituals[period][ritualId].completed) {
             gameState.completedRituals[period][ritualId].completed = true;
             saveGameState(); // Save completion only if it changed
        }
    }
}
// Adds a milestone if not already achieved, handles phase advancement
export function addAchievedMilestone(milestoneId) {
    if (!(gameState.achievedMilestones instanceof Set)) { console.error("CRITICAL ERROR: gameState.achievedMilestones is not a Set!"); gameState.achievedMilestones = new Set();}
    if (!gameState.achievedMilestones.has(milestoneId)) {
        gameState.achievedMilestones.add(milestoneId);
        let phaseAdvanced = false;
        // Phase Advancement Logic
        if (milestoneId === 'ms01' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) phaseAdvanced = advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
        if (milestoneId === 'ms03' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) phaseAdvanced = advanceOnboardingPhase(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE);
        if (milestoneId === 'ms05' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.STUDY_INSIGHT) phaseAdvanced = advanceOnboardingPhase(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
        if (milestoneId === 'ms07' && gameState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) phaseAdvanced = advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS);
        if (['ms60', 'ms70', 'ms71'].includes(milestoneId) && gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) phaseAdvanced = advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED);

        if (!phaseAdvanced) { saveGameState(); } // Save if phase logic didn't already
        return true;
    }
    return false;
}
// Adds a prompt ID to the set of seen prompts
export function addSeenPrompt(promptId) {
     if (!(gameState.seenPrompts instanceof Set)) { console.error("CRITICAL ERROR: gameState.seenPrompts is not a Set!"); gameState.seenPrompts = new Set();}
     if (gameState.seenPrompts.has(promptId)) return; // No need to save if already seen
     gameState.seenPrompts.add(promptId);
     saveGameState();
}
// Increments the counter for triggering reflection prompts
export function incrementReflectionTrigger() {
    gameState.cardsAddedSinceLastPrompt++;
    // No save here, this is transient state for triggering
}
// Resets the reflection trigger counter, optionally sets cooldown
export function resetReflectionTrigger(startCooldown = false) {
    gameState.cardsAddedSinceLastPrompt = 0;
    if (startCooldown) {
        setPromptCooldownActive(true); // Cooldown logic handles saving
    } else {
        // Save if just resetting counter without cooldown? Maybe not needed.
    }
}
// Sets the reflection cooldown status
export function setPromptCooldownActive(isActive) {
    if (gameState.promptCooldownActive !== isActive) {
        gameState.promptCooldownActive = isActive;
        saveGameState(); // Save the change in cooldown status
    }
}
// Clears the reflection cooldown
export function clearReflectionCooldown() {
    if (gameState.promptCooldownActive) {
        gameState.promptCooldownActive = false;
        saveGameState();
    }
}
// Adds an item to the repository
export function addRepositoryItem(itemType, itemId) {
    // Ensure structure exists
    if (!gameState.discoveredRepositoryItems || typeof gameState.discoveredRepositoryItems !== 'object') {
        console.error(`CRITICAL ERROR: gameState.discoveredRepositoryItems is not an object!`);
        gameState.discoveredRepositoryItems = { scenes: new Set(), experiments: new Set(), insights: new Set() };
    }
    if (!gameState.discoveredRepositoryItems[itemType] || !(gameState.discoveredRepositoryItems[itemType] instanceof Set)) {
        console.error(`CRITICAL ERROR: gameState.discoveredRepositoryItems.${itemType} is not a Set!`);
        gameState.discoveredRepositoryItems[itemType] = new Set();
    }

    // Add item if not already present
    if (!gameState.discoveredRepositoryItems[itemType].has(itemId)) {
        gameState.discoveredRepositoryItems[itemType].add(itemId);
        // Phase advancement logic
        const repoNotEmpty = Object.values(gameState.discoveredRepositoryItems).some(set => set.size > 0);
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED && repoNotEmpty) {
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); // Triggers save
        } else {
            saveGameState(); // Save if phase didn't change
        }
        return true;
    }
    return false;
}
// Adds a rare prompt ID to the pending queue
export function addPendingRarePrompt(promptId) {
    if (!Array.isArray(gameState.pendingRarePrompts)) {console.error("CRITICAL ERROR: gameState.pendingRarePrompts is not an Array!"); gameState.pendingRarePrompts = [];}
    if (!gameState.pendingRarePrompts.includes(promptId)) {
        gameState.pendingRarePrompts.push(promptId);
        saveGameState();
        return true;
    }
    return false;
}
// Gets and removes the next pending rare prompt
export function getNextRarePrompt() {
    if (!Array.isArray(gameState.pendingRarePrompts)) {console.error("CRITICAL ERROR: gameState.pendingRarePrompts is not an Array!"); gameState.pendingRarePrompts = []; return null;}
    if (gameState.pendingRarePrompts.length > 0) {
        const promptId = gameState.pendingRarePrompts.shift(); // Removes first element
        saveGameState();
        return promptId;
    }
    return null;
}
// Adds a focus-driven unlock ID
export function addUnlockedFocusItem(unlockId) {
    if (!(gameState.unlockedFocusItems instanceof Set)) { console.error("CRITICAL ERROR: gameState.unlockedFocusItems is not a Set!"); gameState.unlockedFocusItems = new Set();}
    if (!gameState.unlockedFocusItems.has(unlockId)) {
        gameState.unlockedFocusItems.add(unlockId);
        // Phase advancement logic
        if (gameState.onboardingPhase < Config.ONBOARDING_PHASE.ADVANCED) {
            advanceOnboardingPhase(Config.ONBOARDING_PHASE.ADVANCED); // Triggers save
        } else {
            saveGameState(); // Save if phase didn't change
        }
        return true;
    }
    return false;
}
// Sets the timestamp for when the contemplation cooldown ends
export function setContemplationCooldown(endTime) {
    if (gameState.contemplationCooldownEnd !== endTime) {
        gameState.contemplationCooldownEnd = endTime;
        saveGameState();
    }
}

// Adds a task ID to the set of completed tasks
export function completeTask(taskId) {
    if (!(gameState.completedTasks instanceof Set)) { console.error("CRITICAL ERROR: gameState.completedTasks is not a Set!"); gameState.completedTasks = new Set();}
    if (!gameState.completedTasks.has(taskId)) {
        gameState.completedTasks.add(taskId);
        console.log(`Task completed: ${taskId}`);
        saveGameState();
        return true;
    }
    return false;
}


console.log("state.js loaded.");
