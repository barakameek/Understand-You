// --- MVP Concepts Data (Same as before with relatedIds) ---
const concepts = [
    // ... (Full list from previous version) ...
    { id: 1, name: "Heterosexual", type: "Orientation", profile: [5, 5, 5, 5, 5, 5], relatedIds: [7, 39] },
    { id: 2, name: "Homosexual", type: "Orientation", profile: [5, 5, 5, 5, 5, 5], relatedIds: [7, 19, 39] },
    { id: 3, name: "Bisexual", type: "Orientation", profile: [7, 5, 5, 5, 5, 5], relatedIds: [4, 8, 9] },
    { id: 4, name: "Pansexual", type: "Orientation", profile: [8, 5, 5, 5, 5, 5], relatedIds: [3, 8, 9] },
    { id: 5, name: "Asexual", type: "Orientation", profile: [1, 5, 5, 5, 5, 5], relatedIds: [6, 41, 40] },
    { id: 6, name: "Demisexual", type: "Orientation", profile: [3, 5, 5, 7, 5, 6], relatedIds: [5, 41, 34, 35] },
    { id: 7, name: "Monogamy", type: "Relationship Style", profile: [5, 5, 5, 7, 5, 2], relatedIds: [1, 2, 34, 35, 41] },
    { id: 8, name: "Polyamory", type: "Relationship Style", profile: [6, 6, 5, 7, 6, 8], relatedIds: [3, 4, 9, 34, 35] },
    { id: 9, name: "Open Relationship", type: "Relationship Style", profile: [6, 5, 5, 6, 5, 7], relatedIds: [3, 4, 8, 10] },
    { id: 10, name: "Casual Dating", type: "Relationship Style", profile: [6, 5, 6, 3, 4, 6], relatedIds: [9, 11, 38] },
    { id: 11, name: "Solo Sexuality", type: "Relationship Style", profile: [5, 5, 6, 5, 5, 1], relatedIds: [10] },
    { id: 12, name: "Dominant", type: "Identity/Role", profile: [5, 9, 6, 7, 6, 5], relatedIds: [13, 14, 20, 21, 36, 22, 24] },
    { id: 13, name: "Submissive", type: "Identity/Role", profile: [5, 2, 6, 7, 5, 5], relatedIds: [12, 14, 20, 21, 37, 22, 24] },
    { id: 14, name: "Switch", type: "Identity/Role", profile: [5, 5, 6, 6, 6, 5], relatedIds: [12, 13, 20, 38] },
    { id: 17, name: "Vanilla", type: "Identity/Role", profile: [5, 5, 4, 6, 4, 5], relatedIds: [39, 40, 41] },
    { id: 18, name: "Kinky", type: "Identity/Role", profile: [6, 6, 7, 7, 7, 6], relatedIds: [20, 27, 28, 29, 31, 32] },
    { id: 20, name: "BDSM", type: "Framework", profile: [6, 7, 7, 7, 7, 6], relatedIds: [12, 13, 14, 18, 21, 22, 23, 24, 25, 35] },
    { id: 21, name: "Power Exchange", type: "Practice", profile: [5, 8, 6, 8, 7, 6], relatedIds: [12, 13, 20, 36, 37, 35] },
    { id: 22, name: "Spanking", type: "Practice", profile: [5, 7, 8, 6, 4, 5], relatedIds: [20, 12, 13, 36, 37] },
    { id: 23, name: "Blindfolds", type: "Practice", profile: [5, 6, 7, 6, 5, 5], relatedIds: [20, 24] },
    { id: 24, name: "Handcuffs/Restraints", type: "Practice", profile: [5, 7, 7, 7, 5, 5], relatedIds: [20, 12, 13, 25, 23] },
    { id: 25, name: "Rope Play", type: "Practice", profile: [5, 7, 7, 7, 6, 5], relatedIds: [20, 24, 35] },
    { id: 27, name: "Latex/Leather Fetish", type: "Fetish", profile: [7, 5, 7, 5, 6, 5], relatedIds: [18, 28] },
    { id: 28, name: "Foot Fetish", type: "Fetish", profile: [7, 5, 6, 5, 4, 5], relatedIds: [18, 27] },
    { id: 29, name: "Role Playing", type: "Practice", profile: [6, 6, 5, 6, 9, 6], relatedIds: [18, 30, 38] },
    { id: 30, name: "Age Play (Theme)", type: "Practice", profile: [6, 7, 5, 7, 8, 6], relatedIds: [29, 12, 13, 38] },
    { id: 31, name: "Exhibitionism", type: "Practice", profile: [6, 7, 6, 7, 5, 6], relatedIds: [18, 32] },
    { id: 32, name: "Voyeurism", type: "Practice", profile: [6, 3, 6, 6, 5, 6], relatedIds: [18, 31] },
    { id: 33, name: "Dirty Talk", type: "Practice", profile: [5, 6, 7, 6, 6, 5], relatedIds: [12, 13] },
    { id: 34, name: "Intimacy", type: "Goal/Concept", profile: [5, 4, 5, 9, 5, 4], relatedIds: [6, 7, 8, 35, 40, 41] },
    { id: 35, name: "Trust", type: "Goal/Concept", profile: [5, 5, 5, 9, 5, 4], relatedIds: [6, 7, 8, 13, 21, 25, 34] },
    { id: 36, name: "Power (Goal)", type: "Goal/Concept", profile: [5, 8, 6, 8, 6, 5], relatedIds: [12, 20, 21, 22] },
    { id: 37, name: "Surrender (Goal)", type: "Goal/Concept", profile: [5, 3, 6, 8, 5, 5], relatedIds: [13, 20, 21, 22] },
    { id: 38, name: "Playfulness", type: "Goal/Concept", profile: [6, 7, 6, 7, 6, 6], relatedIds: [10, 14, 29, 30] },
    { id: 39, name: "Romantic Kissing", type: "Practice", profile: [5, 4, 6, 7, 3, 4], relatedIds: [17, 34, 40] },
    { id: 40, name: "Cuddling/Affection", type: "Practice", profile: [5, 3, 6, 8, 3, 3], relatedIds: [5, 17, 34, 39, 41] },
    { id: 41, name: "Emotional Connection Focus", type: "Approach", profile: [5, 4, 4, 9, 5, 4], relatedIds: [5, 6, 7, 17, 34, 40] },
];

// --- Original Questionnaire Data ---
const questionnaire = [
    { questionId: 1, text: "How important is intense physical sensation (pleasure or pain) for your sexual satisfaction?", type: "slider", element: "Sensory", minLabel: "Not Important", maxLabel: "Essential", minValue: 0, maxValue: 10, defaultValue: 5 },
    { questionId: 2, text: "In sexual dynamics, which role feels most appealing?", type: "radio", element: "Interaction", options: [ { value: "Dominant", points: 4 }, { value: "Submissive", points: -4 }, { value: "Equal/Collaborative", points: 0 }, { value: "It Varies (Switch)", points: 0 } ], defaultValue: null },
    { questionId: 3, text: "What are your primary emotional drivers or needs met through sexuality? (Choose up to 2)", type: "checkbox", element: "Psychological", options: [ { value: "Intimacy/Connection", points: 2 }, { value: "Power/Control", points: 2 }, { value: "Surrender/Release", points: 2 }, { value: "Playfulness/Fun", points: 1 }, { value: "Validation/Admiration", points: 1 }, { value: "Escape/Transcendence", points: 1 } ], defaultValue: [], maxChoices: 2 },
    { questionId: 4, text: "How important is elaborate fantasy or role-playing scenarios for your arousal?", type: "slider", element: "Cognitive", minLabel: "Not Important", maxLabel: "Very Important", minValue: 0, maxValue: 10, defaultValue: 5 },
    { questionId: 5, text: "Which relationship structure feels most aligned with how you express your sexuality?", type: "radio", element: "Relational", options: [ { value: "Exclusive/Monogamous", points: -3 }, { value: "Open/Non-Monogamous", points: 3 }, { value: "Primarily Solo", points: -5 }, { value: "Varies Greatly", points: 0 } ], defaultValue: null },
    { questionId: 6, text: "Is a strong emotional bond necessary before you feel sexual attraction?", type: "radio", element: "Attraction", options: [ { value: "Yes (Demisexual leaning)", points: -2 }, { value: "No", points: 1 }, { value: "Sometimes", points: 0 } ], defaultValue: null }
];

// --- *** NEW: Refinement Questions Data *** ---
const refinementQuestions = {
    "Sensory": [
        {
            questionId: "refine_sensory_1", // Unique ID
            text: "Within Sensory experiences, do you lean more towards Pleasure or Pain?",
            type: "radio",
            element: "Sensory", // Still affects Sensory overall
            options: [
                 // Adjust points based on how much this refines the score
                { value: "Strongly Pleasure-Focused", points: -2 },
                { value: "Mostly Pleasure", points: -1 },
                { value: "Balanced Mix / Depends", points: 0 },
                { value: "Mostly Pain", points: 1 },
                { value: "Strongly Pain-Focused", points: 2 }
            ]
        }
    ],
    "Interaction": [ /* Add questions for Interaction later */ ],
    // Add refinement questions for other elements as needed
};
