// js/config.js - Constants and Configuration

console.log("config.js loading...");

// --- Core Game Mechanics ---
export const SAVE_KEY = 'personaAlchemyLabSaveData_v14_scenes'; // Keep existing key unless a major state change requires invalidating old saves
export const MAX_ATTUNEMENT = 100;
export const BASE_RESEARCH_COST = 15;
export const ART_EVOLVE_COST = 20;
export const GUIDED_REFLECTION_COST = 10;
export const SCENE_MEDITATION_BASE_COST = 8;
export const EXPERIMENT_BASE_COST = 30;
export const DISSONANCE_THRESHOLD = 6.5;
export const SCORE_NUDGE_AMOUNT = 0.15;
export const SELL_INSIGHT_FACTOR = 0.5;
export const MAX_FOCUS_SLOTS = 12;
export const INITIAL_FOCUS_SLOTS = 5;
export const INITIAL_INSIGHT = 10;
export const CONTEMPLATION_COST = 3;
export const CONTEMPLATION_COOLDOWN = 2 * 60 * 1000; // 2 minutes
export const SCENE_SUGGESTION_COST = 12;
export const SYNERGY_INSIGHT_BONUS = 1.0;
export const SYNERGY_DISCOVERY_CHANCE = 0.15; // 15% chance

// --- Feature Unlock Phases (Post-Tutorial Progression) ---
// These phases control access to features *after* the initial guided tutorial is complete.
export const ONBOARDING_PHASE = {
    START: 0,             // Initial state before questionnaire
    // Note: Phases below might be reached *during* or *after* the tutorial,
    // depending on which features the tutorial introduces and when.
    // The tutorial itself uses ONBOARDING_TUTORIAL_STEP.
    PERSONA_GRIMOIRE: 1,  // Can see Persona & Grimoire, learn Focus (Introduced in Tutorial)
    STUDY_INSIGHT: 2,     // Can use Study, Research, Sell (Introduced in Tutorial)
    REFLECTION_RITUALS: 3,// Can use Reflection, Rituals (Introduced in Tutorial)
    ADVANCED: 4           // Can use Repository, Library, Evolve Art (Introduced in Tutorial / Post-Tutorial)
};

// --- NEW: Onboarding Tutorial Steps (Initial Guided Flow) ---
// String constants for the guided tutorial steps managed in state.js
export const TUTORIAL_STEP = {
    START: 'start',                     // App loaded, before questionnaire
    RESULTS_MODAL: 'results_modal',     // Post-questionnaire modal needs to be shown
    GRIMOIRE_INTRO: 'grimoire_intro',   // Introduce the Grimoire screen
    CONCEPT_POPUP_INTRO: 'concept_popup_intro', // Explain the concept detail popup (first time clicking a card)
    FOCUS_INTRO: 'focus_intro',         // Introduce the Focus mechanic on Persona screen
    STUDY_INTRO: 'study_intro',         // Introduce the Study screen and Research
    SELL_INTRO: 'sell_intro',           // Introduce selling concepts (maybe after first research result?)
    REFLECTION_INTRO: 'reflection_intro',// Introduce Reflection modal (triggered first time)
    REPOSITORY_INTRO: 'repository_intro', // Introduce Repository (when first relevant item appears or phase allows)
    COMPLETE: 'complete'                // Guided tutorial finished, normal gameplay resumes
};
// Add more steps here as needed for finer control (e.g., 'research_results_intro', 'attunement_intro', 'deep_dive_intro')


// --- Concept Discovery Insight Values ---
export const CONCEPT_DISCOVERY_INSIGHT = {
    common: 2.0,
    uncommon: 4.0,
    rare: 8.0,
    default: 2.0 // Fallback for concepts missing rarity
};

console.log("config.js loaded.");
