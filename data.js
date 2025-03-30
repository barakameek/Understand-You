// --- MVP Concepts Data ---
// Added primaryElement, elementScores (instead of profile array)
// Primary Element Key: A=Attraction, I=Interaction, S=Sensory, P=Psychological, C=Cognitive, R=Relational
const concepts = [
    // Orientations
    { id: 1, name: "Heterosexual", type: "Orientation", primaryElement: "A", elementScores: {A:5, I:5, S:5, P:5, C:5, R:5}, relatedIds: [7, 39] },
    { id: 2, name: "Homosexual", type: "Orientation", primaryElement: "A", elementScores: {A:5, I:5, S:5, P:5, C:5, R:5}, relatedIds: [7, 19, 39] },
    { id: 3, name: "Bisexual", type: "Orientation", primaryElement: "A", elementScores: {A:7, I:5, S:5, P:5, C:5, R:5}, relatedIds: [4, 8, 9] },
    { id: 4, name: "Pansexual", type: "Orientation", primaryElement: "A", elementScores: {A:8, I:5, S:5, P:5, C:5, R:5}, relatedIds: [3, 8, 9] },
    { id: 5, name: "Asexual", type: "Orientation", primaryElement: "A", elementScores: {A:1, I:5, S:5, P:5, C:5, R:5}, relatedIds: [6, 41, 40] },
    { id: 6, name: "Demisexual", type: "Orientation", primaryElement: "A", elementScores: {A:3, I:5, S:5, P:7, C:5, R:6}, relatedIds: [5, 41, 34, 35] },
    // Relationship Styles
    { id: 7, name: "Monogamy", type: "Relationship Style", primaryElement: "R", elementScores: {A:5, I:5, S:5, P:7, C:5, R:2}, relatedIds: [1, 2, 34, 35, 41] },
    { id: 8, name: "Polyamory", type: "Relationship Style", primaryElement: "R", elementScores: {A:6, I:6, S:5, P:7, C:6, R:8}, relatedIds: [3, 4, 9, 34, 35] },
    { id: 9, name: "Open Relationship", type: "Relationship Style", primaryElement: "R", elementScores: {A:6, I:5, S:5, P:6, C:5, R:7}, relatedIds: [3, 4, 8, 10] },
    { id: 10, name: "Casual Dating", type: "Relationship Style", primaryElement: "R", elementScores: {A:6, I:5, S:6, P:3, C:4, R:6}, relatedIds: [9, 11, 38] },
    { id: 11, name: "Solo Sexuality", type: "Relationship Style", primaryElement: "R", elementScores: {A:5, I:5, S:6, P:5, C:5, R:1}, relatedIds: [10] },
    // Core Identities/Roles
    { id: 12, name: "Dominant", type: "Identity/Role", primaryElement: "I", elementScores: {A:5, I:9, S:6, P:7, C:6, R:5}, relatedIds: [13, 14, 20, 21, 36, 22, 24] },
    { id: 13, name: "Submissive", type: "Identity/Role", primaryElement: "I", elementScores: {A:5, I:2, S:6, P:7, C:5, R:5}, relatedIds: [12, 14, 20, 21, 37, 22, 24] },
    { id: 14, name: "Switch", type: "Identity/Role", primaryElement: "I", elementScores: {A:5, I:5, S:6, P:6, C:6, R:5}, relatedIds: [12, 13, 20, 38] },
    { id: 17, name: "Vanilla", type: "Identity/Role", primaryElement: "P", elementScores: {A:5, I:5, S:4, P:6, C:4, R:5}, relatedIds: [39, 40, 41] },
    { id: 18, name: "Kinky", type: "Identity/Role", primaryElement: "P", elementScores: {A:6, I:6, S:7, P:7, C:7, R:6}, relatedIds: [20, 27, 28, 29, 31, 32] },
    // Practices & Kinks
    { id: 20, name: "BDSM", type: "Framework", primaryElement: "I", elementScores: {A:6, I:7, S:7, P:7, C:7, R:6}, relatedIds: [12, 13, 14, 18, 21, 22, 23, 24, 25, 35] },
    { id: 21, name: "Power Exchange", type: "Practice", primaryElement: "I", elementScores: {A:5, I:8, S:6, P:8, C:7, R:6}, relatedIds: [12, 13, 20, 36, 37, 35] },
    { id: 22, name: "Spanking", type: "Practice", primaryElement: "S", elementScores: {A:5, I:7, S:8, P:6, C:4, R:5}, relatedIds: [20, 12, 13, 36, 37] },
    { id: 23, name: "Blindfolds", type: "Practice", primaryElement: "S", elementScores: {A:5, I:6, S:7, P:6, C:5, R:5}, relatedIds: [20, 24] }, // Sensory Deprivation
    { id: 24, name: "Handcuffs/Restraints", type: "Practice", primaryElement: "S", elementScores: {A:5, I:7, S:7, P:7, C:5, R:5}, relatedIds: [20, 12, 13, 25, 23] }, // Restriction
    { id: 25, name: "Rope Play", type: "Practice", primaryElement: "S", elementScores: {A:5, I:7, S:7, P:7, C:6, R:5}, relatedIds: [20, 24, 35] }, // Restriction, Trust
    { id: 27, name: "Latex/Leather Fetish", type: "Fetish", primaryElement: "A", elementScores: {A:7, I:5, S:7, P:5, C:6, R:5}, relatedIds: [18, 28] }, // Attraction (Object), Sensory
    { id: 28, name: "Foot Fetish", type: "Fetish", primaryElement: "A", elementScores: {A:7, I:5, S:6, P:5, C:4, R:5}, relatedIds: [18, 27] }, // Attraction (Object)
    { id: 29, name: "Role Playing", type: "Practice", primaryElement: "C", elementScores: {A:6, I:6, S:5, P:6, C:9, R:6}, relatedIds: [18, 30, 38] }, // Cognitive
    { id: 30, name: "Age Play (Theme)", type: "Practice", primaryElement: "C", elementScores: {A:6, I:7, S:5, P:7, C:8, R:6}, relatedIds: [29, 12, 13, 38] }, // Cognitive, Interaction, Psych
    { id: 31, name: "Exhibitionism", type: "Practice", primaryElement: "P", elementScores: {A:6, I:7, S:6, P:7, C:5, R:6}, relatedIds: [18, 32] }, // Psychological (Validation?), Interaction
    { id: 32, name: "Voyeurism", type: "Practice", primaryElement: "P", elementScores: {A:6, I:3, S:6, P:6, C:5, R:6}, relatedIds: [18, 31] }, // Psychological, Low Interaction
    { id: 33, name: "Dirty Talk", type: "Practice", primaryElement: "S", elementScores: {A:5, I:6, S:7, P:6, C:6, R:5}, relatedIds: [12, 13] }, // Sensory (Auditory), Cognitive
    // Emotional/Psychological
    { id: 34, name: "Intimacy", type: "Goal/Concept", primaryElement: "P", elementScores: {A:5, I:4, S:5, P:9, C:5, R:4}, relatedIds: [6, 7, 8, 35, 40, 41] }, // Psychological
    { id: 35, name: "Trust", type: "Goal/Concept", primaryElement: "P", elementScores: {A:5, I:5, S:5, P:9, C:5, R:4}, relatedIds: [6, 7, 8, 13, 21, 25, 34] }, // Psychological
    { id: 36, name: "Power (Goal)", type: "Goal/Concept", primaryElement: "P", elementScores: {A:5, I:8, S:6, P:8, C:6, R:5}, relatedIds: [12, 20, 21, 22] }, // Psychological, Interaction
    { id: 37, name: "Surrender (Goal)", type: "Goal/Concept", primaryElement: "P", elementScores: {A:5, I:3, S:6, P:8, C:5, R:5}, relatedIds: [13, 20, 21, 22] }, // Psychological, Interaction
    { id: 38, name: "Playfulness", type: "Goal/Concept", primaryElement: "P", elementScores: {A:6, I:7, S:6, P:7, C:6, R:6}, relatedIds: [10, 14, 29, 30] }, // Psychological, Interaction
    // Commonplace
    { id: 39, name: "Romantic Kissing", type: "Practice", primaryElement: "S", elementScores: {A:5, I:4, S:6, P:7, C:3, R:4}, relatedIds: [17, 34, 40] }, // Sensory, Psychological
    { id: 40, name: "Cuddling/Affection", type: "Practice", primaryElement: "P", elementScores: {A:5, I:3, S:6, P:8, C:3, R:3}, relatedIds: [5, 17, 34, 39, 41] }, // Psychological, Sensory
    { id: 41, name: "Emotional Connection Focus", type: "Approach", primaryElement: "P", elementScores: {A:5, I:4, S:4, P:9, C:5, R:4}, relatedIds: [5, 6, 7, 17, 34, 40] }, // Psychological
];

// Map Element Keys to Full Names
const elementKeyToName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };

// --- Questionnaire Structures (Guided Only) ---
const elementExplanations = { /* ... Same as before ... */
    "Attraction": "Relates to the 'Who' or 'What' primarily draws your sexual interest (e.g., gender, presentation, specific concepts, level of connection needed).", "Interaction": "Describes the 'How' - your preferred dynamic or energy exchange during sexual encounters (e.g., leading, following, collaborating, playing).", "Sensory": "Focuses on the 'Feel' - the types and intensity of physical sensations that are most appealing or central to your arousal.", "Psychological": "Explores the 'Why' - the core emotional or psychological needs, motivations, or states sought through sexual expression (e.g., intimacy, power, escape).", "Cognitive": "Concerns the 'Mind' - the role and importance of fantasy, intellect, scenarios, or psychological complexity in your arousal.", "Relational": "Defines the 'With Whom' structure - your preferred context for sexual relationships (e.g., monogamous, polyamorous, casual, solo)."
};

const questionnaireGuided = { /* ... Same questions as before ... */
    "Attraction": [ { qId: "G_Attr1", text: "Is a strong emotional bond necessary before sexual attraction develops?", type: "radio", options: [{ value: "Yes", points: -2 }, { value: "Sometimes", points: 0 }, { value: "No", points: 1 }], scoreWeight: 1.5 }, { qId: "G_Attr2", text: "How broad is the range of genders/presentations you *could* be attracted to?", type: "slider", minLabel: "Very Specific", maxLabel: "Very Broad", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.0 }, { qId: "G_Attr3", text: "Are specific objects, materials, or situations a significant focus of your arousal?", type: "radio", options: [{ value: "Yes", points: 1 }, { value: "Sometimes", points: 0 }, { value: "Rarely/No", points: -1 }], scoreWeight: 0.5 } ],
    "Interaction": [ { qId: "G_Inter1", text: "Preferred dynamic lean:", type: "slider", minLabel: "Submitting/Following", maxLabel: "Dominating/Leading", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 }, { qId: "G_Inter2", text: "Which energies also appeal? (Choose up to 2)", type: "checkbox", options: [{ value: "Playful", points: 0.5 }, { value: "Nurturing/Caring", points: -0.5 }, { value: "Service-Oriented", points: -0.5 }, { value: "Performance/Exhibition", points: 0.5 }], scoreWeight: 1.0, maxChoices: 2 } ],
    "Sensory": [ { qId: "G_Sens1", text: "Importance of intense sensation?", type: "slider", minLabel: "Low", maxLabel: "High", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.0 }, { qId: "G_Sens2", text: "Leaning towards Pleasure vs Pain/Intensity?", type: "radio", options: [{ value: "Strongly Pleasure", points: -2 }, { value: "Mostly Pleasure", points: -1 }, { value: "Mix/Depends", points: 0 }, { value: "Mostly Pain/Intensity", points: 1 }, { value: "Strongly Pain/Intensity", points: 2 }], scoreWeight: 1.0 } ],
    "Psychological": [ { qId: "G_Psych1", text: "Select your top 2 primary emotional drivers:", type: "checkbox", options: [{ value: "Intimacy/Connection", points: 2 }, { value: "Power/Control", points: 1 }, { value: "Surrender/Release", points: 1 }, { value: "Playfulness/Fun", points: 0 }, { value: "Validation/Admiration", points: 0 }, { value: "Comfort/Security", points: -1 }, { value: "Escape/Transcendence", points: 0 }], scoreWeight: 1.5, maxChoices: 2 }, { qId: "G_Psych2", text: "How important is 'Trust' in your sexual experiences?", type: "slider", minLabel: "Not Vital", maxLabel: "Essential", minValue: 0, maxValue: 10, defaultValue: 7, scoreWeight: 0.5 } ],
    "Cognitive": [ { qId: "G_Cog1", text: "Importance of mental stimulation (fantasy, scenarios)?", type: "slider", minLabel: "Low", maxLabel: "High", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 }, { qId: "G_Cog2", text: "Preferred cognitive style?", type: "radio", options: [{ value: "Present/Embodied", points: -1 }, { value: "Fantasy/Scenario Driven", points: 1 }, { value: "Intellectual/Psychological Play", points: 1 }, { value: "Varies Greatly", points: 0 }], scoreWeight: 0.5 } ],
    "Relational": [ { qId: "G_Rel1", text: "Preference for Exclusivity vs Openness?", type: "slider", minLabel: "Strictly Exclusive", maxLabel: "Very Open", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 }, { qId: "G_Rel2", text: "Importance of partner familiarity?", type: "radio", options: [{ value: "Essential (Known Partners)", points: -1 }, { value: "Preferred but Flexible", points: 0 }, { value: "Anonymity/Casual is Fine/Preferred", points: 1 }], scoreWeight: 0.5 } ]
};

// --- *** NEW: Basic Quest Data *** ---
const questData = {
    "exploreSensory": {
        title: "Explore Sensory Preferences",
        startElement: "Sensory", // Element hub to focus initially
        startConcepts: [22, 23, 24, 25, 33], // Example starting concepts (Spanking, Blindfolds, Restraints, Rope, Dirty Talk)
        // Future steps could involve questions and revealing more based on answers
    },
    "exploreInteraction": {
         title: "Explore Interaction Styles",
         startElement: "Interaction",
         startConcepts: [12, 13, 14, 21, 36, 37, 38], // Dom, Sub, Switch, PowerEx, Goals, Playful
     }
    // Add more quests
};
