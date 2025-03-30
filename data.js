// --- MVP Concepts Data ---
// Using elementScores object, primaryElement key, relatedIds, canEvolve
const concepts = [ /* ... Same full list as previous version ... */];
const elementKeyToName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };
const elementExplanations = { /* ... Same full explanations ... */
    "Attraction": "Relates to the 'Who' or 'What' primarily draws your sexual interest (e.g., gender, presentation, specific concepts, level of connection needed). A low score might indicate Asexuality or broad attraction, while a high score suggests a strong focus, potentially including specific objects or situations (fetishes).",
    "Interaction": "Describes the 'How' - your preferred dynamic or energy exchange during sexual encounters. Low scores lean towards Following/Submitting, high scores towards Leading/Dominating, and mid-range towards Collaboration/Equality or Switching.",
    "Sensory": "Focuses on the 'Feel' - the types and intensity of physical sensations sought. Low scores suggest preference for subtle or emotional connection over intense physical input, while high scores indicate a desire for strong, specific, or even extreme sensations (pleasure or pain).",
    "Psychological": "Explores the 'Why' - the core emotional or psychological needs met through sexuality. High scores indicate sexuality is deeply tied to fulfilling needs like Intimacy, Power, Escape, Validation, or Catharsis. Low scores suggest a more physical or recreational focus.",
    "Cognitive": "Concerns the 'Mind' - the role of fantasy, intellect, scenarios, or psychological complexity. Low scores indicate a preference for being present and embodied, while high scores suggest arousal is significantly driven by imagination, role-play, mental games, or complex dynamics.",
    "Relational": "Defines the 'With Whom' structure - your preferred context for sexual relationships. Low scores lean towards Solitary experiences or Monogamy, mid-range towards Casual or specific Dyads, and high scores towards various forms of Openness or Polyamory."
};
const questionnaireGuided = { /* ... Same structure as before ... */ };
// Refinement questions removed for simplicity
