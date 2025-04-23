// --- START OF FILE config.js ---
// js/config.js - Constants and Configuration (Inner Cosmos Theme - 7 Elements + Enhancements v4.1 - Fixed + XP/Leveling v1.0)

console.log("config.js loading... (Acknowledging 7 Elements + Enhancements v4.1 + XP/Leveling v1.0)");

// --- Core Settings ---
export const SAVE_KEY = 'innerCosmosSaveData_v3'; // Bumped version due to XP/Level system
export const MAX_ATTUNEMENT = 100; // Max attunement level per element (Applies to all 7, including RF)
export const INITIAL_INSIGHT = 15; // Starting Insight
export const INITIAL_FOCUS_SLOTS = 6; // Starting focus slots
export const MAX_FOCUS_SLOTS = 12; // Maximum focus slots achievable (Increased slightly for 7 elements + complexity)
export const INITIAL_FREE_RESEARCH_COUNT = 3; // Number of free researches after questionnaire

// --- Onboarding/Tutorial ---
export const ONBOARDING_ENABLED = true; // Toggle for the onboarding tutorial
// *** NOTE: This value (8) must match the EXACT number of distinct phases defined across ALL split tours in data.js ***
// Example: Welcome (3 phases) + Workshop (2 phases) + Repository (3 phases) = 8
export const MAX_ONBOARDING_PHASE = 8; // Combined total phases across all tours

// --- Action Costs ---
export const BASE_RESEARCH_COST = 15; // Standard cost (applies to researching RoleFocus too)
export const GUIDED_REFLECTION_COST = 12; // Cost to trigger a guided reflection (Slightly increased)
export const SCENE_MEDITATION_BASE_COST = 8; // Base cost to meditate on a scene
export const EXPERIMENT_BASE_COST = 30; // Base cost to attempt an experiment
export const SCENE_SUGGESTION_COST = 12; // Cost to suggest a scene based on focus
export const CONTEMPLATION_COST = 5; // Cost for Tapestry Deep Dive contemplation
export const LORE_UNLOCK_COSTS = { // Applies to Concept Lore levels (Can be overridden in concept data)
    level1: 3,
    level2: 7,
    level3: 15,
};
// Note: Element Deep Dive Insight costs are defined directly in data.js -> elementDeepDive
export const INSIGHT_BOOST_AMOUNT = 40; // How much insight the boost gives
export const INSIGHT_BOOST_COOLDOWN = 5 * 60 * 1000; // 5 minutes in milliseconds (Slightly increased)

// --- Gameplay Modifiers ---
export const DISSONANCE_THRESHOLD = 6.5; // Score distance triggering Dissonance Reflection
export const SCORE_NUDGE_AMOUNT = 0.15; // How much scores shift during Dissonance/Dilemma Reflection nudge
export const SELL_INSIGHT_FACTOR = 0.4; // % of discovery value gained when selling
export const SELL_UNLOCK_REFUND_FACTOR = 0.5; // % of Insight spent on unlocks refunded when selling card
export const SYNERGY_INSIGHT_BONUS = 1.5; // Insight bonus for adding related concept
export const SYNERGY_DISCOVERY_CHANCE = 0.18; // Chance to auto-discover linked concept during research
export const REFLECTION_TRIGGER_THRESHOLD = 3; // Number of concepts added to trigger a standard reflection
export const REFLECTION_COOLDOWN = 2.5 * 60 * 1000; // 2.5 minutes cooldown for standard/rare reflections
export const CONTEMPLATION_COOLDOWN = 3 * 60 * 1000; // 3 minutes cooldown for Tapestry Deep Dive

// --- Concept Discovery Insight Values ---
// Based on rarity, unchanged by number of elements
export const CONCEPT_DISCOVERY_INSIGHT = {
    common: 2.0,
    uncommon: 4.0,
    rare: 8.0,
    default: 2.0
};

// --- UI Settings ---
export const TOAST_DURATION = 3000; // Default duration for toast messages
export const MILESTONE_ALERT_DURATION = 5000; // Duration for milestone popups
export const INSIGHT_LOG_MAX_ENTRIES = 15; // How many recent Insight changes to show

// --- XP & Level System (NEW) ---
export const XP_LEVEL_THRESHOLDS = [0, 100, 300, 700]; // Total XP needed for Level 1, 2, 3 respectively (index 0 is level 0)
export const MAX_ELEMENT_LEVEL = 3; // Maximum level an element can reach
export const DAILY_XP_CAP = 30; // Max XP earnable per day across all elements

// --- XP Gain Amounts (NEW - Base values, can be modified) ---
export const XP_GAINS = {
    RESEARCH_SUCCESS_COMMON: 1,
    RESEARCH_SUCCESS_UNCOMMON: 2,
    RESEARCH_SUCCESS_RARE: 4,
    RESEARCH_FAIL: 0, // No XP for failed research unless special item found
    RESEARCH_SPECIAL_FIND: 3, // Finding scene/insight
    COMPLETE_REFLECTION_STANDARD: 3,
    COMPLETE_REFLECTION_DISSONANCE: 4,
    COMPLETE_REFLECTION_RARE: 5,
    COMPLETE_REFLECTION_GUIDED: 2, // Lower XP as it costs Insight
    COMPLETE_REFLECTION_SCENE: 3,
    MARK_FOCUS: 2,
    UNLOCK_LIBRARY_LEVEL: 5,
    UNLOCK_LORE_LEVEL_1: 1,
    UNLOCK_LORE_LEVEL_2: 2,
    UNLOCK_LORE_LEVEL_3: 3,
    COMPLETE_CONTEMPLATION: 3,
    COMPLETE_DILEMMA: 2,
    ATTEMPT_EXPERIMENT_SUCCESS: 6,
    ATTEMPT_EXPERIMENT_FAIL: 1,
    UNLOCK_FOCUS_DRIVEN: 5,
    COMPLETE_RITUAL: 1, // Per ritual instance
    COMPLETE_CROSSOVER_TOKEN: 20, // Specific XP reward for Crossover Token
    // Card Unlock XP (Optional - maybe better to grant on purchase action?)
    PURCHASE_MICRO_STORY: 0,
    PURCHASE_SCENE_SEED: 1,
    PURCHASE_DEEP_LORE: 2,
    PURCHASE_CROSSOVER_TOKEN: 1, // Small XP for initiating
    PURCHASE_SECRET_SCENE: 3,
    PURCHASE_ALT_ART: 1,
    PURCHASE_PERK: 4,
};

// --- Card Unlock Costs (NEW - Base values, can be overridden in concept data) ---
export const UNLOCK_COSTS = {
    microStory: 12,
    sceneSeed: 20,
    deepLore: 40,
    crossover: 30,
    secretScene: 80,
    altSkin: 60,
    perk: 100,
    // Specific cost for swapping alt art after initial purchase
    altSkinSwap: 10,
};


// --- Deprecated/Review Items ---
// Note: Art state was removed from save/load, but visualHandle still used for image names.
// Keep for consistency with placeholder image loading, assuming '.jpg' is the common extension.
export const UNLOCKED_ART_EXTENSION = '.jpg';

console.log("config.js loaded successfully. (vXP/Leveling v1.0)");
// --- END OF FILE config.js ---
