// --- MVP Concepts Data ---
// Simplified profiles with 6 scores [Attr, Inter, Sens, Psych, Cog, Rel] (0-10)
// Attr = Attraction Focus, Inter = Interaction Style, Sens = Sensory Emphasis,
// Psych = Psychological Driver, Cog = Cognitive Engagement, Rel = Relational Context
const concepts = [
    // Orientations
    { id: 1, name: "Heterosexual", type: "Orientation", profile: [5, 5, 5, 5, 5, 5] }, // Baseline example
    { id: 2, name: "Homosexual", type: "Orientation", profile: [5, 5, 5, 5, 5, 5] }, // Similar baseline
    { id: 3, name: "Bisexual", type: "Orientation", profile: [7, 5, 5, 5, 5, 5] }, // Higher attraction breadth assumed
    { id: 4, name: "Pansexual", type: "Orientation", profile: [8, 5, 5, 5, 5, 5] }, // Even broader assumed
    { id: 5, name: "Asexual", type: "Orientation", profile: [1, 5, 5, 5, 5, 5] }, // Low attraction score
    { id: 6, name: "Demisexual", type: "Orientation", profile: [3, 5, 5, 7, 5, 6] }, // Lower initial attr, needs psych connect
    // Relationship Styles
    { id: 7, name: "Monogamy", type: "Relationship Style", profile: [5, 5, 5, 7, 5, 2] }, // High Psych (intimacy?), Low Rel context score (exclusive)
    { id: 8, name: "Polyamory", type: "Relationship Style", profile: [6, 6, 5, 7, 6, 8] }, // Higher Rel score, communication (Cog?)
    { id: 9, name: "Open Relationship", type: "Relationship Style", profile: [6, 5, 5, 6, 5, 7] }, // Mid Rel score
    { id: 10, name: "Casual Dating", type: "Relationship Style", profile: [6, 5, 6, 3, 4, 6] }, // Lower Psych need for deep intimacy?
    { id: 11, name: "Solo Sexuality", type: "Relationship Style", profile: [5, 5, 6, 5, 5, 1] }, // Lowest Rel score
    // Core Identities/Roles
    { id: 12, name: "Dominant", type: "Identity/Role", profile: [5, 9, 6, 7, 6, 5] }, // High Interaction (leading)
    { id: 13, name: "Submissive", type: "Identity/Role", profile: [5, 2, 6, 7, 5, 5] }, // Low Interaction (following)
    { id: 14, name: "Switch", type: "Identity/Role", profile: [5, 5, 6, 6, 6, 5] }, // Mid Interaction
    { id: 17, name: "Vanilla", type: "Identity/Role", profile: [5, 5, 4, 6, 4, 5] }, // Lower Sensory/Cognitive engagement assumed
    { id: 18, name: "Kinky", type: "Identity/Role", profile: [6, 6, 7, 7, 7, 6] }, // Higher scores generally assumed
    // Practices & Kinks
    { id: 20, name: "BDSM", type: "Framework", profile: [6, 7, 7, 7, 7, 6] }, // General high scores
    { id: 21, name: "Power Exchange", type: "Practice", profile: [5, 8, 6, 8, 7, 6] }, // High Interaction, Psych, Cognitive
    { id: 22, name: "Spanking", type: "Practice", profile: [5, 7, 8, 6, 4, 5] }, // High Sensory (impact), Interaction (D/s)
    { id: 23, name: "Blindfolds", type: "Practice", profile: [5, 6, 7, 6, 5, 5] }, // High Sensory (deprivation)
    { id: 24, name: "Handcuffs/Restraints", type: "Practice", profile: [5, 7, 7, 7, 5, 5] }, // High Sensory (restriction), Interaction
    { id: 27, name: "Latex/Leather Fetish", type: "Fetish", profile: [7, 5, 7, 5, 6, 5] }, // High Attr (object), Sensory (visual/tactile)
    { id: 28, name: "Foot Fetish", type: "Fetish", profile: [7, 5, 6, 5, 4, 5] }, // High Attr (object)
    { id: 29, name: "Role Playing", type: "Practice", profile: [6, 6, 5, 6, 9, 6] }, // High Cognitive
    { id: 31, name: "Exhibitionism", type: "Practice", profile: [6, 7, 6, 7, 5, 6] }, // High Interaction (performance), Psych (validation?)
    { id: 32, name: "Voyeurism", type: "Practice", profile: [6, 3, 6, 6, 5, 6] }, // Low Interaction (observational)
    { id: 33, name: "Dirty Talk", type: "Practice", profile: [5, 6, 7, 6, 6, 5] }, // High Sensory (auditory), Cognitive?
    // Emotional/Psychological
    { id: 34, name: "Intimacy", type: "Goal/Concept", profile: [5, 4, 5, 9, 5, 4] }, // High Psych
    { id: 35, name: "Trust", type: "Goal/Concept", profile: [5, 5, 5, 9, 5, 4] }, // High Psych
    { id: 36, name: "Power (Goal)", type: "Goal/Concept", profile: [5, 8, 6, 8, 6, 5] }, // High Psych, Interaction
    { id: 37, name: "Surrender (Goal)", type: "Goal/Concept", profile: [5, 3, 6, 8, 5, 5] }, // High Psych, low Interaction
    { id: 38, name: "Playfulness", type: "Goal/Concept", profile: [6, 7, 6, 7, 6, 6] }, // High Interaction, Psych
    // Commonplace
    { id: 39, name: "Romantic Kissing", type: "Practice", profile: [5, 4, 6, 7, 3, 4] }, // High Sensory, Psych (intimacy)
    { id: 40, name: "Cuddling/Affection", type: "Practice", profile: [5, 3, 6, 8, 3, 3] }, // High Psych, Sensory, low Rel (dyad focus)
    { id: 41, name: "Emotional Connection Focus", type: "Approach", profile: [5, 4, 4, 9, 5, 4] }, // High Psych

    // NOTE: The remaining ~10 MVP concepts are omitted for brevity but would follow the same structure.
    // NOTE: These profiles are HUGE simplifications for demo purposes!
];

// --- Simplified Questionnaire Structure ---
const questionnaire = [
    {
        questionId: 1,
        text: "How important is intense physical sensation (pleasure or pain) for your sexual satisfaction?",
        type: "slider", // slider | radio | checkbox
        element: "Sensory", // Which element this primarily affects
        options: null, // Not needed for slider
        minLabel: "Not Important",
        maxLabel: "Essential",
        minValue: 0,
        maxValue: 10,
        defaultValue: 5
    },
    {
        questionId: 2,
        text: "In sexual dynamics, which role feels most appealing?",
        type: "radio",
        element: "Interaction",
        options: [
            { value: "Dominant", points: 4 }, // Points to add/subtract from element score
            { value: "Submissive", points: -4 },
            { value: "Equal/Collaborative", points: 0 },
            { value: "It Varies (Switch)", points: 0 } // Or handle separately
        ],
        defaultValue: null
    },
    {
        questionId: 3,
        text: "What are your primary emotional drivers or needs met through sexuality? (Choose up to 2)",
        type: "checkbox", // Max 2 choices in this example
        element: "Psychological",
        options: [
            { value: "Intimacy/Connection", points: 2 },
            { value: "Power/Control", points: 2 },
            { value: "Surrender/Release", points: 2 },
            { value: "Playfulness/Fun", points: 1 },
            { value: "Validation/Admiration", points: 1 },
            { value: "Escape/Transcendence", points: 1 }
        ],
        defaultValue: []
    },
    {
        questionId: 4,
        text: "How important is elaborate fantasy or role-playing scenarios for your arousal?",
        type: "slider",
        element: "Cognitive",
        options: null,
        minLabel: "Not Important",
        maxLabel: "Very Important",
        minValue: 0,
        maxValue: 10,
        defaultValue: 5
    },
     {
        questionId: 5, // Added question for Relational Context
        text: "Which relationship structure feels most aligned with how you express your sexuality?",
        type: "radio",
        element: "Relational",
        options: [
            { value: "Exclusive/Monogamous", points: -3 },
            { value: "Open/Non-Monogamous", points: 3 },
            { value: "Primarily Solo", points: -5 },
            { value: "Varies Greatly", points: 0 }
        ],
        defaultValue: null
    },
     {
        questionId: 6, // Added question for Attraction Focus
        text: "Is a strong emotional bond necessary before you feel sexual attraction?",
        type: "radio",
        element: "Attraction",
        options: [
            { value: "Yes (Demisexual leaning)", points: -2 }, // Lower initial score?
            { value: "No", points: 1 },
            { value: "Sometimes", points: 0 }
        ],
        defaultValue: null
    }
    // Add more questions to cover all elements thoroughly in a real app
];
