// --- MVP Concepts Data ---
// Using elementScores object and primaryElement key
const concepts = [
    // Orientations
    { id: 1, name: "Heterosexual", type: "Orientation", primaryElement: "A", elementScores: {Attraction:5, Interaction:5, Sensory:5, Psychological:5, Cognitive:5, Relational:5}, relatedIds: [7, 39] },
    { id: 2, name: "Homosexual", type: "Orientation", primaryElement: "A", elementScores: {Attraction:5, Interaction:5, Sensory:5, Psychological:5, Cognitive:5, Relational:5}, relatedIds: [7, 19, 39] },
    { id: 3, name: "Bisexual", type: "Orientation", primaryElement: "A", elementScores: {Attraction:7, Interaction:5, Sensory:5, Psychological:5, Cognitive:5, Relational:5}, relatedIds: [4, 8, 9] },
    { id: 4, name: "Pansexual", type: "Orientation", primaryElement: "A", elementScores: {Attraction:8, Interaction:5, Sensory:5, Psychological:5, Cognitive:5, Relational:5}, relatedIds: [3, 8, 9] },
    { id: 5, name: "Asexual", type: "Orientation", primaryElement: "A", elementScores: {Attraction:1, Interaction:5, Sensory:5, Psychological:5, Cognitive:5, Relational:5}, relatedIds: [6, 41, 40] },
    { id: 6, name: "Demisexual", type: "Orientation", primaryElement: "A", elementScores: {Attraction:3, Interaction:5, Sensory:5, Psychological:7, Cognitive:5, Relational:6}, relatedIds: [5, 41, 34, 35] },
    // Relationship Styles
    { id: 7, name: "Monogamy", type: "Relationship Style", primaryElement: "R", elementScores: {Attraction:5, Interaction:5, Sensory:5, Psychological:7, Cognitive:5, Relational:2}, relatedIds: [1, 2, 34, 35, 41] },
    { id: 8, name: "Polyamory", type: "Relationship Style", primaryElement: "R", elementScores: {Attraction:6, Interaction:6, Sensory:5, Psychological:7, Cognitive:6, Relational:8}, relatedIds: [3, 4, 9, 34, 35] },
    { id: 9, name: "Open Relationship", type: "Relationship Style", primaryElement: "R", elementScores: {Attraction:6, Interaction:5, Sensory:5, Psychological:6, Cognitive:5, Relational:7}, relatedIds: [3, 4, 8, 10] },
    { id: 10, name: "Casual Dating", type: "Relationship Style", primaryElement: "R", elementScores: {Attraction:6, Interaction:5, Sensory:6, Psychological:3, Cognitive:4, Relational:6}, relatedIds: [9, 11, 38] },
    { id: 11, name: "Solo Sexuality", type: "Relationship Style", primaryElement: "R", elementScores: {Attraction:5, Interaction:5, Sensory:6, Psychological:5, Cognitive:5, Relational:1}, relatedIds: [10] },
    // Core Identities/Roles
    { id: 12, name: "Dominant", type: "Identity/Role", primaryElement: "I", elementScores: {Attraction:5, Interaction:9, Sensory:6, Psychological:7, Cognitive:6, Relational:5}, relatedIds: [13, 14, 20, 21, 36, 22, 24] },
    { id: 13, name: "Submissive", type: "Identity/Role", primaryElement: "I", elementScores: {Attraction:5, Interaction:2, Sensory:6, Psychological:7, Cognitive:5, Relational:5}, relatedIds: [12, 14, 20, 21, 37, 22, 24] },
    { id: 14, name: "Switch", type: "Identity/Role", primaryElement: "I", elementScores: {Attraction:5, Interaction:5, Sensory:6, Psychological:6, Cognitive:6, Relational:5}, relatedIds: [12, 13, 20, 38] },
    { id: 17, name: "Vanilla", type: "Identity/Role", primaryElement: "P", elementScores: {Attraction:5, Interaction:5, Sensory:4, Psychological:6, Cognitive:4, Relational:5}, relatedIds: [39, 40, 41] },
    { id: 18, name: "Kinky", type: "Identity/Role", primaryElement: "P", elementScores: {Attraction:6, Interaction:6, Sensory:7, Psychological:7, Cognitive:7, Relational:6}, relatedIds: [20, 27, 28, 29, 31, 32] },
    // Practices & Kinks
    { id: 20, name: "BDSM", type: "Framework", primaryElement: "I", elementScores: {Attraction:6, Interaction:7, Sensory:7, Psychological:7, Cognitive:7, Relational:6}, relatedIds: [12, 13, 14, 18, 21, 22, 23, 24, 25, 35] },
    { id: 21, name: "Power Exchange", type: "Practice", primaryElement: "I", elementScores: {Attraction:5, Interaction:8, Sensory:6, Psychological:8, Cognitive:7, Relational:6}, relatedIds: [12, 13, 20, 36, 37, 35] },
    { id: 22, name: "Spanking", type: "Practice", primaryElement: "S", elementScores: {Attraction:5, Interaction:7, Sensory:8, Psychological:6, Cognitive:4, Relational:5}, relatedIds: [20, 12, 13, 36, 37] },
    { id: 23, name: "Blindfolds", type: "Practice", primaryElement: "S", elementScores: {Attraction:5, Interaction:6, Sensory:7, Psychological:6, Cognitive:5, Relational:5}, relatedIds: [20, 24] },
    { id: 24, name: "Handcuffs/Restraints", type: "Practice", primaryElement: "S", elementScores: {Attraction:5, Interaction:7, Sensory:7, Psychological:7, Cognitive:5, Relational:5}, relatedIds: [20, 12, 13, 25, 23] },
    { id: 25, name: "Rope Play", type: "Practice", primaryElement: "S", elementScores: {Attraction:5, Interaction:7, Sensory:7, Psychological:7, Cognitive:6, Relational:5}, relatedIds: [20, 24, 35] },
    { id: 27, name: "Latex/Leather Fetish", type: "Fetish", primaryElement: "A", elementScores: {Attraction:7, Interaction:5, Sensory:7, Psychological:5, Cognitive:6, Relational:5}, relatedIds: [18, 28] },
    { id: 28, name: "Foot Fetish", type: "Fetish", primaryElement: "A", elementScores: {Attraction:7, Interaction:5, Sensory:6, Psychological:5, Cognitive:4, Relational:5}, relatedIds: [18, 27] },
    { id: 29, name: "Role Playing", type: "Practice", primaryElement: "C", elementScores: {Attraction:6, Interaction:6, Sensory:5, Psychological:6, Cognitive:9, Relational:6}, relatedIds: [18, 30, 38] },
    { id: 30, name: "Age Play (Theme)", type: "Practice", primaryElement: "C", elementScores: {Attraction:6, Interaction:7, Sensory:5, Psychological:7, Cognitive:8, Relational:6}, relatedIds: [29, 12, 13, 38] },
    { id: 31, name: "Exhibitionism", type: "Practice", primaryElement: "P", elementScores: {Attraction:6, Interaction:7, Sensory:6, Psychological:7, Cognitive:5, Relational:6}, relatedIds: [18, 32] },
    { id: 32, name: "Voyeurism", type: "Practice", primaryElement: "P", elementScores: {Attraction:6, Interaction:3, Sensory:6, Psychological:6, Cognitive:5, Relational:6}, relatedIds: [18, 31] },
    { id: 33, name: "Dirty Talk", type: "Practice", primaryElement: "S", elementScores: {Attraction:5, Interaction:6, Sensory:7, Psychological:6, Cognitive:6, Relational:5}, relatedIds: [12, 13] },
    // Emotional/Psychological
    { id: 34, name: "Intimacy", type: "Goal/Concept", primaryElement: "P", elementScores: {Attraction:5, Interaction:4, Sensory:5, Psychological:9, Cognitive:5, Relational:4}, relatedIds: [6, 7, 8, 35, 40, 41] },
    { id: 35, name: "Trust", type: "Goal/Concept", primaryElement: "P", elementScores: {Attraction:5, Interaction:5, Sensory:5, Psychological:9, Cognitive:5, Relational:4}, relatedIds: [6, 7, 8, 13, 21, 25, 34] },
    { id: 36, name: "Power (Goal)", type: "Goal/Concept", primaryElement: "P", elementScores: {Attraction:5, Interaction:8, Sensory:6, Psychological:8, Cognitive:6, Relational:5}, relatedIds: [12, 20, 21, 22] },
    { id: 37, name: "Surrender (Goal)", type: "Goal/Concept", primaryElement: "P", elementScores: {Attraction:5, Interaction:3, Sensory:6, Psychological:8, Cognitive:5, Relational:5}, relatedIds: [13, 20, 21, 22] },
    { id: 38, name: "Playfulness", type: "Goal/Concept", primaryElement: "P", elementScores: {Attraction:6, Interaction:7, Sensory:6, Psychological:7, Cognitive:6, Relational:6}, relatedIds: [10, 14, 29, 30] },
    // Commonplace
    { id: 39, name: "Romantic Kissing", type: "Practice", primaryElement: "S", elementScores: {Attraction:5, Interaction:4, Sensory:6, Psychological:7, Cognitive:3, Relational:4}, relatedIds: [17, 34, 40] },
    { id: 40, name: "Cuddling/Affection", type: "Practice", primaryElement: "P", elementScores: {Attraction:5, Interaction:3, Sensory:6, Psychological:8, Cognitive:3, Relational:3}, relatedIds: [5, 17, 34, 39, 41] },
    { id: 41, name: "Emotional Connection Focus", type: "Approach", primaryElement: "P", elementScores: {Attraction:5, Interaction:4, Sensory:4, Psychological:9, Cognitive:5, Relational:4}, relatedIds: [5, 6, 7, 17, 34, 40] },
];

const elementKeyToName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };

// --- Guided Questionnaire Data (Same as before) ---
const elementExplanations = { /* ... */ "Attraction": "Relates to the 'Who' or 'What' primarily draws your sexual interest...", "Interaction": "Describes the 'How' - your preferred dynamic...", "Sensory": "Focuses on the 'Feel' - the types and intensity of physical sensations...", "Psychological": "Explores the 'Why' - the core emotional or psychological needs...", "Cognitive": "Concerns the 'Mind' - the role and importance of fantasy, intellect...", "Relational": "Defines the 'With Whom' structure - your preferred context..." };
const questionnaireGuided = { /* ... Same structure as before ... */
    "Attraction": [ { qId: "G_Attr1", text: "Is a strong emotional bond necessary before sexual attraction develops?", type: "radio", options: [{ value: "Yes", points: -2 }, { value: "Sometimes", points: 0 }, { value: "No", points: 1 }], scoreWeight: 1.5 }, { qId: "G_Attr2", text: "How broad is the range of genders/presentations you *could* be attracted to?", type: "slider", minLabel: "Very Specific", maxLabel: "Very Broad", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.0 }, { qId: "G_Attr3", text: "Are specific objects, materials, or situations a significant focus of your arousal?", type: "radio", options: [{ value: "Yes", points: 1 }, { value: "Sometimes", points: 0 }, { value: "Rarely/No", points: -1 }], scoreWeight: 0.5 } ],
    "Interaction": [ { qId: "G_Inter1", text: "Preferred dynamic lean:", type: "slider", minLabel: "Submitting/Following", maxLabel: "Dominating/Leading", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 }, { qId: "G_Inter2", text: "Which energies also appeal? (Choose up to 2)", type: "checkbox", options: [{ value: "Playful", points: 0.5 }, { value: "Nurturing/Caring", points: -0.5 }, { value: "Service-Oriented", points: -0.5 }, { value: "Performance/Exhibition", points: 0.5 }], scoreWeight: 1.0, maxChoices: 2 } ],
    "Sensory": [ { qId: "G_Sens1", text: "Importance of intense sensation?", type: "slider", minLabel: "Low", maxLabel: "High", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.0 }, { qId: "G_Sens2", text: "Leaning towards Pleasure vs Pain/Intensity?", type: "radio", options: [{ value: "Strongly Pleasure", points: -2 }, { value: "Mostly Pleasure", points: -1 }, { value: "Mix/Depends", points: 0 }, { value: "Mostly Pain/Intensity", points: 1 }, { value: "Strongly Pain/Intensity", points: 2 }], scoreWeight: 1.0 } ],
    "Psychological": [ { qId: "G_Psych1", text: "Select your top 2 primary emotional drivers:", type: "checkbox", options: [{ value: "Intimacy/Connection", points: 2 }, { value: "Power/Control", points: 1 }, { value: "Surrender/Release", points: 1 }, { value: "Playfulness/Fun", points: 0 }, { value: "Validation/Admiration", points: 0 }, { value: "Comfort/Security", points: -1 }, { value: "Escape/Transcendence", points: 0 }], scoreWeight: 1.5, maxChoices: 2 }, { qId: "G_Psych2", text: "How important is 'Trust' in your sexual experiences?", type: "slider", minLabel: "Not Vital", maxLabel: "Essential", minValue: 0, maxValue: 10, defaultValue: 7, scoreWeight: 0.5 } ],
    "Cognitive": [ { qId: "G_Cog1", text: "Importance of mental stimulation (fantasy, scenarios)?", type: "slider", minLabel: "Low", maxLabel: "High", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 }, { qId: "G_Cog2", text: "Preferred cognitive style?", type: "radio", options: [{ value: "Present/Embodied", points: -1 }, { value: "Fantasy/Scenario Driven", points: 1 }, { value: "Intellectual/Psychological Play", points: 1 }, { value: "Varies Greatly", points: 0 }], scoreWeight: 0.5 } ],
    "Relational": [ { qId: "G_Rel1", text: "Preference for Exclusivity vs Openness?", type: "slider", minLabel: "Strictly Exclusive", maxLabel: "Very Open", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 }, { qId: "G_Rel2", text: "Importance of partner familiarity?", type: "radio", options: [{ value: "Essential (Known Partners)", points: -1 }, { value: "Preferred but Flexible", points: 0 }, { value: "Anonymity/Casual is Fine/Preferred", points: 1 }], scoreWeight: 0.5 } ]
};

// --- Refinement Questions Data (Removed for simplicity in this version) ---
// const refinementQuestions = { /* ... */ };
