// --- MVP Concepts Data (Same as before with relatedIds) ---
const concepts = [ /* ... Full list from previous version ... */
    { id: 1, name: "Heterosexual", type: "Orientation", profile: [5, 5, 5, 5, 5, 5], relatedIds: [7, 39] }, { id: 2, name: "Homosexual", type: "Orientation", profile: [5, 5, 5, 5, 5, 5], relatedIds: [7, 19, 39] }, { id: 3, name: "Bisexual", type: "Orientation", profile: [7, 5, 5, 5, 5, 5], relatedIds: [4, 8, 9] }, { id: 4, name: "Pansexual", type: "Orientation", profile: [8, 5, 5, 5, 5, 5], relatedIds: [3, 8, 9] }, { id: 5, name: "Asexual", type: "Orientation", profile: [1, 5, 5, 5, 5, 5], relatedIds: [6, 41, 40] }, { id: 6, name: "Demisexual", type: "Orientation", profile: [3, 5, 5, 7, 5, 6], relatedIds: [5, 41, 34, 35] }, { id: 7, name: "Monogamy", type: "Relationship Style", profile: [5, 5, 5, 7, 5, 2], relatedIds: [1, 2, 34, 35, 41] }, { id: 8, name: "Polyamory", type: "Relationship Style", profile: [6, 6, 5, 7, 6, 8], relatedIds: [3, 4, 9, 34, 35] }, { id: 9, name: "Open Relationship", type: "Relationship Style", profile: [6, 5, 5, 6, 5, 7], relatedIds: [3, 4, 8, 10] }, { id: 10, name: "Casual Dating", type: "Relationship Style", profile: [6, 5, 6, 3, 4, 6], relatedIds: [9, 11, 38] }, { id: 11, name: "Solo Sexuality", type: "Relationship Style", profile: [5, 5, 6, 5, 5, 1], relatedIds: [10] }, { id: 12, name: "Dominant", type: "Identity/Role", profile: [5, 9, 6, 7, 6, 5], relatedIds: [13, 14, 20, 21, 36, 22, 24] }, { id: 13, name: "Submissive", type: "Identity/Role", profile: [5, 2, 6, 7, 5, 5], relatedIds: [12, 14, 20, 21, 37, 22, 24] }, { id: 14, name: "Switch", type: "Identity/Role", profile: [5, 5, 6, 6, 6, 5], relatedIds: [12, 13, 20, 38] }, { id: 17, name: "Vanilla", type: "Identity/Role", profile: [5, 5, 4, 6, 4, 5], relatedIds: [39, 40, 41] }, { id: 18, name: "Kinky", type: "Identity/Role", profile: [6, 6, 7, 7, 7, 6], relatedIds: [20, 27, 28, 29, 31, 32] }, { id: 20, name: "BDSM", type: "Framework", profile: [6, 7, 7, 7, 7, 6], relatedIds: [12, 13, 14, 18, 21, 22, 23, 24, 25, 35] }, { id: 21, name: "Power Exchange", type: "Practice", profile: [5, 8, 6, 8, 7, 6], relatedIds: [12, 13, 20, 36, 37, 35] }, { id: 22, name: "Spanking", type: "Practice", profile: [5, 7, 8, 6, 4, 5], relatedIds: [20, 12, 13, 36, 37] }, { id: 23, name: "Blindfolds", type: "Practice", profile: [5, 6, 7, 6, 5, 5], relatedIds: [20, 24] }, { id: 24, name: "Handcuffs/Restraints", type: "Practice", profile: [5, 7, 7, 7, 5, 5], relatedIds: [20, 12, 13, 25, 23] }, { id: 25, name: "Rope Play", type: "Practice", profile: [5, 7, 7, 7, 6, 5], relatedIds: [20, 24, 35] }, { id: 27, name: "Latex/Leather Fetish", type: "Fetish", profile: [7, 5, 7, 5, 6, 5], relatedIds: [18, 28] }, { id: 28, name: "Foot Fetish", type: "Fetish", profile: [7, 5, 6, 5, 4, 5], relatedIds: [18, 27] }, { id: 29, name: "Role Playing", type: "Practice", profile: [6, 6, 5, 6, 9, 6], relatedIds: [18, 30, 38] }, { id: 30, name: "Age Play (Theme)", type: "Practice", profile: [6, 7, 5, 7, 8, 6], relatedIds: [29, 12, 13, 38] }, { id: 31, name: "Exhibitionism", type: "Practice", profile: [6, 7, 6, 7, 5, 6], relatedIds: [18, 32] }, { id: 32, name: "Voyeurism", type: "Practice", profile: [6, 3, 6, 6, 5, 6], relatedIds: [18, 31] }, { id: 33, name: "Dirty Talk", type: "Practice", profile: [5, 6, 7, 6, 6, 5], relatedIds: [12, 13] }, { id: 34, name: "Intimacy", type: "Goal/Concept", profile: [5, 4, 5, 9, 5, 4], relatedIds: [6, 7, 8, 35, 40, 41] }, { id: 35, name: "Trust", type: "Goal/Concept", profile: [5, 5, 5, 9, 5, 4], relatedIds: [6, 7, 8, 13, 21, 25, 34] }, { id: 36, name: "Power (Goal)", type: "Goal/Concept", profile: [5, 8, 6, 8, 6, 5], relatedIds: [12, 20, 21, 22] }, { id: 37, name: "Surrender (Goal)", type: "Goal/Concept", profile: [5, 3, 6, 8, 5, 5], relatedIds: [13, 20, 21, 22] }, { id: 38, name: "Playfulness", type: "Goal/Concept", profile: [6, 7, 6, 7, 6, 6], relatedIds: [10, 14, 29, 30] }, { id: 39, name: "Romantic Kissing", type: "Practice", profile: [5, 4, 6, 7, 3, 4], relatedIds: [17, 34, 40] }, { id: 40, name: "Cuddling/Affection", type: "Practice", profile: [5, 3, 6, 8, 3, 3], relatedIds: [5, 17, 34, 39, 41] }, { id: 41, name: "Emotional Connection Focus", type: "Approach", profile: [5, 4, 4, 9, 5, 4], relatedIds: [5, 6, 7, 17, 34, 40] }
];

// --- *** NEW: Questionnaire Structures for Both Flows *** ---
const elementExplanations = {
    "Attraction": "Relates to the 'Who' or 'What' primarily draws your sexual interest (e.g., gender, presentation, specific concepts, level of connection needed).",
    "Interaction": "Describes the 'How' - your preferred dynamic or energy exchange during sexual encounters (e.g., leading, following, collaborating, playing).",
    "Sensory": "Focuses on the 'Feel' - the types and intensity of physical sensations that are most appealing or central to your arousal.",
    "Psychological": "Explores the 'Why' - the core emotional or psychological needs, motivations, or states sought through sexual expression (e.g., intimacy, power, escape).",
    "Cognitive": "Concerns the 'Mind' - the role and importance of fantasy, intellect, scenarios, or psychological complexity in your arousal.",
    "Relational": "Defines the 'With Whom' structure - your preferred context for sexual relationships (e.g., monogamous, polyamorous, casual, solo)."
};

const questionnaireDirect = {
    // One primary question per element
    "Attraction": [
        { qId: "D_Attr1", text: "Is a strong emotional bond typically necessary BEFORE you feel sexual attraction?", type: "radio", options: [{ value: "Yes", score: 3 }, { value: "Sometimes", score: 5 }, { value: "No", score: 7 }], defaultValue: 5 } // Simplified score mapping
    ],
    "Interaction": [
        { qId: "D_Inter1", text: "Generally, do you prefer to Lead, Follow, or Collaborate in sexual dynamics?", type: "radio", options: [{ value: "Lead/Dominate", score: 9 }, { value: "Collaborate/Equal", score: 5 }, { value: "Follow/Submit", score: 1 }], defaultValue: 5 }
    ],
    "Sensory": [
        { qId: "D_Sens1", text: "Overall, how important is focused physical sensation (intensity, specific types) to you?", type: "slider", minLabel: "Low", maxLabel: "High", minValue: 0, maxValue: 10, defaultValue: 5 }
    ],
    "Psychological": [
        { qId: "D_Psych1", text: "Which core need is MOST important for your sexual fulfillment?", type: "radio", options: [{ value: "Intimacy/Connection", score: 9 }, { value: "Power/Control/Surrender", score: 7 }, { value: "Sensation/Release", score: 5 }, { value: "Other/Varies Greatly", score: 5 }], defaultValue: 5 } // Rough mapping
    ],
    "Cognitive": [
        { qId: "D_Cog1", text: "How important is mental stimulation (fantasy, scenarios, psych play) vs. immediate physical presence?", type: "slider", minLabel: "Physical Focus", maxLabel: "Mental Focus", minValue: 0, maxValue: 10, defaultValue: 5 }
    ],
    "Relational": [
        { qId: "D_Rel1", text: "What's your general preference for relationship structure around sexuality?", type: "radio", options: [{ value: "Exclusive/Monogamous", score: 2 }, { value: "Open/Non-Monogamous", score: 8 }, { value: "Solo/Casual Focus", score: 5 }], defaultValue: 5 } // Rough mapping
    ]
};

const questionnaireGuided = {
    // Multiple questions per element
    "Attraction": [
        { qId: "G_Attr1", text: "Is a strong emotional bond necessary before sexual attraction develops?", type: "radio", options: [{ value: "Yes", points: -2 }, { value: "Sometimes", points: 0 }, { value: "No", points: 1 }], scoreWeight: 1.5 },
        { qId: "G_Attr2", text: "How broad is the range of genders/presentations you *could* be attracted to?", type: "slider", minLabel: "Very Specific", maxLabel: "Very Broad", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.0 },
        { qId: "G_Attr3", text: "Are specific objects, materials, or situations a significant focus of your arousal?", type: "radio", options: [{ value: "Yes", points: 1 }, { value: "Sometimes", points: 0 }, { value: "Rarely/No", points: -1 }], scoreWeight: 0.5 } // Lower weight for fetish focus impact on overall score
    ],
    "Interaction": [
        { qId: "G_Inter1", text: "Preferred dynamic lean:", type: "slider", minLabel: "Submitting/Following", maxLabel: "Dominating/Leading", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 }, // 0-4 Sub, 5 Equal, 6-10 Dom
        { qId: "G_Inter2", text: "Which energies also appeal? (Choose up to 2)", type: "checkbox", options: [{ value: "Playful", points: 0.5 }, { value: "Nurturing/Caring", points: -0.5 }, { value: "Service-Oriented", points: -0.5 }, { value: "Performance/Exhibition", points: 0.5 }], scoreWeight: 1.0, maxChoices: 2 } // Adjust score based on selection
    ],
    "Sensory": [
        { qId: "G_Sens1", text: "Importance of intense sensation?", type: "slider", minLabel: "Low", maxLabel: "High", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.0 },
        { qId: "G_Sens2", text: "Leaning towards Pleasure vs Pain/Intensity?", type: "radio", options: [{ value: "Strongly Pleasure", points: -2 }, { value: "Mostly Pleasure", points: -1 }, { value: "Mix/Depends", points: 0 }, { value: "Mostly Pain/Intensity", points: 1 }, { value: "Strongly Pain/Intensity", points: 2 }], scoreWeight: 1.0 }
    ],
    "Psychological": [
        { qId: "G_Psych1", text: "Select your top 2 primary emotional drivers:", type: "checkbox", options: [{ value: "Intimacy/Connection", points: 2 }, { value: "Power/Control", points: 1 }, { value: "Surrender/Release", points: 1 }, { value: "Playfulness/Fun", points: 0 }, { value: "Validation/Admiration", points: 0 }, { value: "Comfort/Security", points: -1 }, { value: "Escape/Transcendence", points: 0 }], scoreWeight: 1.5, maxChoices: 2 }, // Points adjust score up/down
        { qId: "G_Psych2", text: "How important is 'Trust' in your sexual experiences?", type: "slider", minLabel: "Not Vital", maxLabel: "Essential", minValue: 0, maxValue: 10, defaultValue: 7, scoreWeight: 0.5 } // Add points based on slider value > 5?
    ],
    "Cognitive": [
        { qId: "G_Cog1", text: "Importance of mental stimulation (fantasy, scenarios)?", type: "slider", minLabel: "Low", maxLabel: "High", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 },
        { qId: "G_Cog2", text: "Preferred cognitive style?", type: "radio", options: [{ value: "Present/Embodied", points: -1 }, { value: "Fantasy/Scenario Driven", points: 1 }, { value: "Intellectual/Psychological Play", points: 1 }, { value: "Varies Greatly", points: 0 }], scoreWeight: 0.5 }
    ],
    "Relational": [
        { qId: "G_Rel1", text: "Preference for Exclusivity vs Openness?", type: "slider", minLabel: "Strictly Exclusive", maxLabel: "Very Open", minValue: 0, maxValue: 10, defaultValue: 5, scoreWeight: 1.5 }, // High score = more open
        { qId: "G_Rel2", text: "Importance of partner familiarity?", type: "radio", options: [{ value: "Essential (Known Partners)", points: -1 }, { value: "Preferred but Flexible", points: 0 }, { value: "Anonymity/Casual is Fine/Preferred", points: 1 }], scoreWeight: 0.5 } // Adjusts score slightly
    ]
};


// --- Refinement Questions Data (Same as before) ---
const refinementQuestions = {
    "Sensory": [ { questionId: "refine_sensory_1", text: "Within Sensory experiences, do you lean more towards Pleasure or Pain?", type: "radio", element: "Sensory", options: [ { value: "Strongly Pleasure-Focused", points: -2 }, { value: "Mostly Pleasure", points: -1 }, { value: "Balanced Mix / Depends", points: 0 }, { value: "Mostly Pain", points: 1 }, { value: "Strongly Pain-Focused", points: 2 } ] } ],
    "Interaction": [ /* Add questions */ ], "Psychological": [ /* Add */ ], "Cognitive": [ /* Add */ ], "Relational": [ /* Add */ ], "Attraction": [ /* Add */ ],
};
