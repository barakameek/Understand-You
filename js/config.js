// js/config.js - Constants and Configuration

console.log("config.js loading...");

export const SAVE_KEY = 'personaAlchemyLabSaveData_v13_modular'; // Updated key
export const MAX_ATTUNEMENT = 100;
export const BASE_RESEARCH_COST = 15;
export const ART_EVOLVE_COST = 20;
export const GUIDED_REFLECTION_COST = 10;
export const SCENE_MEDITATION_BASE_COST = 8;
export const EXPERIMENT_BASE_COST = 30;
export const DISSONANCE_THRESHOLD = 6.5;
export const SCORE_NUDGE_AMOUNT = 0.15;
export const SELL_INSIGHT_FACTOR = 0.5; // Gain 50% of discovery value when selling
export const MAX_FOCUS_SLOTS = 12;
export const INITIAL_FOCUS_SLOTS = 5;
export const INITIAL_INSIGHT = 10;

// Onboarding Phases
export const ONBOARDING_PHASE = {
    START: 0, // Questionnaire
    PERSONA_GRIMOIRE: 1, // View Persona, Grimoire, Learn Focus
    STUDY_INSIGHT: 2, // Unlock Study, Learn Research/Insight
    REFLECTION_RITUALS: 3, // Unlock Reflection, Rituals
    ADVANCED: 4 // Unlock Repository, Library etc.
};

// Concept discovery values
export const CONCEPT_DISCOVERY_INSIGHT = {
    common: 2.0,
    uncommon: 4.0,
    rare: 8.0,
    default: 2.0
};

console.log("config.js loaded.");
