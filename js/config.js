// --- START OF FILE config.js --- (Adding Lore Costs)

// js/config.js - Constants and Configuration (Inner Cosmos Theme)

console.log("config.js loading...");

// --- Core Settings ---
export const SAVE_KEY = 'innerCosmosSaveData_v1'; // Keep version consistent
export const MAX_ATTUNEMENT = 100; // Max attunement level per element
export const INITIAL_INSIGHT = 15; // Starting Insight
export const INITIAL_FOCUS_SLOTS = 3; // Starting focus slots
export const MAX_FOCUS_SLOTS = 9; // Maximum focus slots achievable
export const INITIAL_FREE_RESEARCH_COUNT = 3; // Number of free researches after questionnaire

// --- Action Costs ---
export const BASE_RESEARCH_COST = 15; // Standard cost after initial free/discounted
export const GUIDED_REFLECTION_COST = 10; // Cost to trigger a guided reflection
export const SCENE_MEDITATION_BASE_COST = 8; // Base cost to meditate on a scene
export const EXPERIMENT_BASE_COST = 30; // Base cost to attempt an experiment
export const ART_EVOLVE_COST = 25; // Cost to unlock enhanced art
export const SCENE_SUGGESTION_COST = 12; // Cost to suggest a scene based on focus
export const CONTEMPLATION_COST = 5; // Cost for Tapestry Deep Dive contemplation
// ** NEW: Lore Unlock Costs **
export const LORE_UNLOCK_COSTS = {
    level1: 3,  // Cost to unlock the first piece of lore for ANY card
    level2: 7,  // Cost for the second piece
    level3: 15, // Cost for the third piece (if applicable)
    // Add more levels as needed
};
// ** END Lore Costs **

// --- Gameplay Modifiers ---
export const DISSONANCE_THRESHOLD = 6.5; // Score distance triggering Dissonance Reflection
export const SCORE_NUDGE_AMOUNT = 0.15; // How much scores shift during Dissonance Reflection nudge
export const SELL_INSIGHT_FACTOR = 0.4; // % of discovery value gained when selling
export const SYNERGY_INSIGHT_BONUS = 1.5; // Insight bonus for adding related concept
export const SYNERGY_DISCOVERY_CHANCE = 0.18; // Chance to auto-discover linked concept during research
export const CONTEMPLATION_COOLDOWN = 3 * 60 * 1000; // 3 minutes cooldown

// --- Onboarding Phases ---
export const ONBOARDING_PHASE = {
    START: 0,                // Initial state, Welcome Screen
    QUESTIONNAIRE: 0.5,      // Currently doing Questionnaire
    PERSONA_GRIMOIRE: 1,     // Questionnaire done, Study (Discovery Mode), Grimoire basics, Persona Summary/Detailed toggle
    STUDY_INSIGHT: 2,        // First Concept added -> Standard Study Screen, Sell unlocked, User Categories unlocked
    REFLECTION_RITUALS: 3,   // First Concept focused -> Reflection prompts trigger, Rituals visible
    ADVANCED: 4              // First Repo item/Evolve/Library/Lore Lvl 1 -> Repository Screen, Evolution, Library unlocks, Lore Unlocks
};

// --- Concept Discovery Insight Values ---
// Value gained when *first* adding a Concept to the Grimoire. Also base for Sell value.
export const CONCEPT_DISCOVERY_INSIGHT = {
    common: 2.0,
    uncommon: 4.0,
    rare: 8.0,
    default: 2.0
};

console.log("config.js loaded.");
// --- END OF FILE config.js ---
