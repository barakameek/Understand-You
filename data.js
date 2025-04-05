// data.js - Centralized Game Data
// Ensure this file is loaded first or its exports are available when needed

console.log("data.js starting..."); // Log for debugging load order

const elementDetails = {
    // ... (Your full elementDetails object with descriptions, etc.) ...
    "Attraction": {
        name: "Attraction Focus",
        coreQuestion: "Who or What sparks your sexual interest and arousal?",
        coreConcept: "This element defines the primary target, nature, or necessary conditions for your sexual attraction. It goes beyond simple gender orientation to include the importance of presentation, specific dynamics, concepts, objects, situations, or the level of emotional connection required.",
        elaboration: "It encompasses traditional orientations (hetero-, homo-, bi-, pan-) but also acknowledges the Asexuality spectrum (lack of attraction) and Demisexuality (attraction requiring an emotional bond). It includes attractions focused on specific aesthetics, personality types, intellectual connection (Sapiosexuality), power dynamics, or even inanimate objects, materials, or scenarios (often termed fetishes or paraphilias, explored here non-judgmentally).",
        scoreInterpretations: {
            "Very Low": "Suggests very little or no specific sexual attraction (aligns strongly with the Asexuality spectrum). Arousal might be absent, rare, or triggered by non-specific stimuli.",
            "Low": "Indicates less emphasis on specific external targets; attraction might be infrequent, require strong emotional bonds first (Demisexual leaning), or be primarily responsive rather than spontaneous.",
            "Moderate": "Represents a common balance. Attraction might be geared towards familiar cues like gender or presentation, potentially broad (Pansexual leaning without intense focus), or require some connection without it being strictly Demisexual.",
            "High": "Suggests a strong focus or pull towards particular targets. This could be specific gender(s)/presentations, specific dynamics (like intelligence or power), or the beginning of significant focus on specific objects, materials, or situations (fetishistic interests).",
            "Very High": "Indicates a very strong, potentially primary, focus on specific triggers. This could be an intense orientation towards a narrow group, or a central role for specific objects, materials, scenarios, or conceptual dynamics in generating arousal (strong fetishistic or paraphilic focus)."
        },
        examples: "Asexuality, Demisexuality, Heterosexuality, Homosexuality, Bisexuality, Pansexuality, Sapiosexuality, Fetishes (e.g., latex, feet, uniforms), attraction to specific body types, attraction based on D/s roles.",
        personaConnection: "Defines the fundamental 'object' or condition of your sexual desire."
    },
    "Interaction": {
        name: "Interaction Style",
        coreQuestion: "How do you prefer to engage and exchange energy during sexual encounters?",
        coreConcept: "This element describes your preferred behavioral dynamics, roles, and energy flow when interacting sexually with others (or even in solo fantasy).",
        elaboration: "It covers the spectrum from leading to following, the desire for collaboration versus power differentials, and specific energetic expressions like nurturing, service, playfulness, or performance. It's strongly linked to identities like Dominant, Submissive, Switch, Top, Bottom, Caregiver, etc.",
        scoreInterpretations: {
            "Very Low": "Strong preference for yielding control, following explicit direction, serving, or being cared for/guided (Strongly Submissive leaning). Comfort in passivity or receiving.",
            "Low": "General comfort or preference for letting others take the lead, supportive roles, receiving attention/sensation more than directing it (Submissive or Bottom leaning).",
            "Moderate": "Prefers collaborative, egalitarian dynamics with mutual give-and-take. May enjoy switching roles (Switch identity) or find balance in playful, reciprocal exchanges.",
            "High": "Enjoys taking initiative, guiding the encounter, providing sensation/care, or being the center of attention (Dominant, Top, or Caregiver leaning).",
            "Very High": "Strong preference or need to be in control, direct the scenario explicitly, command, or embody a significantly Dominant role. May involve performance or intense focus on the other's response."
        },
        examples: "Dominance/submission (D/s), Master/slave (M/s), Top/Bottom/Versatile roles, Primal play (instinctive interaction), Service dynamics, Exhibitionism/Voyeurism (performance/observation roles), Teacher/student roles, Caregiver/Little dynamics (DDlg, MDlb).",
        personaConnection: "Defines your preferred social and power 'dance' within sexuality."
    },
    "Sensory": {
        name: "Sensory Emphasis",
        coreQuestion: "What physical Feelings are most important or sought after?",
        coreConcept: "This element relates to the significance, type, and intensity of physical sensations in your sexual arousal and fulfillment.",
        elaboration: "It encompasses the full range of senses – touch (light, firm, impact), temperature (hot, cold), texture (smooth, rough), pressure (binding, squeezing), vibration, internal sensations, as well as visual, auditory, and olfactory input. It also includes the spectrum from pure pleasure to the integration of pain or intense sensation (Sadomasochism).",
        scoreInterpretations: {
            "Very Low": "Physical sensation is largely secondary or even unimportant compared to emotional connection, psychological needs, or cognitive engagement. Strong aversion to intense stimuli likely.",
            "Low": "Prefers subtle, gentle, affectionate, or 'vanilla' physical sensations. Comfort, warmth, and light touch may be prioritized. Intense sensations are generally avoided.",
            "Moderate": "Enjoys a broad range of pleasurable physical sensations common in conventional sex. May be open to exploring mild intensity (e.g., light spanking, different textures) but it's not a primary driver.",
            "High": "Actively seeks out distinct, strong, or specific types of physical input as a key part of arousal. This could include impact play, temperature, specific textures (latex, rope), light restriction, or intense pleasure focus.",
            "Very High": "Strongly driven by, or requires, intense, specific, or even extreme physical sensations. This includes significant pain/pleasure play (heavy impact, needles, wax), intense restriction/bondage, sensory overload/deprivation, edge play, or a powerful focus on specific sensory triggers (e.g., specific materials against skin)."
        },
        examples: "Gentle massage, passionate kissing, cuddling, BDSM impact play (flogging, caning), wax play, ice play, rope bondage, Shibari, sensory deprivation hoods, electrostimulation, specific material fetishes (focus on the feel).",
        personaConnection: "Defines how your body interfaces with sexuality and what physical input it craves or avoids."
    },
    "Psychological": {
        name: "Psychological Driver",
        coreQuestion: "Why do you engage with sexuality? What underlying needs does it fulfill?",
        coreConcept: "This element explores the core emotional, psychological, or existential motivations, needs, and states that sexuality helps you access, express, or satisfy.",
        elaboration: "This is about the deeper meaning or purpose behind the act. It includes needs for connection (intimacy, trust, vulnerability, belonging), power dynamics (control, dominance, surrender, objectification), self-expression (creativity, validation, exploration), state change (escape, transcendence, catharsis, stress relief), and comfort (security, care).",
        scoreInterpretations: {
            "Very Low": "Sexuality primarily serves physical functions or simple pleasure/recreation. Deep psychological needs are largely met elsewhere or aren't strongly linked to sex.",
            "Low": "Emotional or psychological aspects are present but secondary. Focus might be on fun, physical release, or light connection without significant depth or weight.",
            "Moderate": "A balanced approach where sexuality often fulfills needs like connection, stress relief, fun, and validation in fairly equal measure, integrated with physical pleasure.",
            "High": "Sexuality is a significant and important channel for fulfilling specific, core psychological needs. These needs (e.g., Intimacy, Power, Validation, Catharsis) are consciously or unconsciously sought through sexual expression.",
            "Very High": "Fulfilling one or more profound psychological needs is the primary driver and purpose of sexual engagement. The experience might feel incomplete or unsatisfying if these deep needs (e.g., total surrender, absolute control, deep vulnerability/trust, transcendental escape) are not met."
        },
        examples: "Using sex primarily for stress relief (Low/Moderate), seeking deep emotional intimacy through partnered sex (High), using BDSM for catharsis or power exchange (High/Very High), seeking validation through performance (High), using intense experiences for transcendence (Very High).",
        personaConnection: "Defines the emotional and motivational core of your sexual expression – its deeper purpose for you."
    },
    "Cognitive": {
        name: "Cognitive Engagement",
        coreQuestion: "How important is the Mind – fantasy, intellect, scenarios – in your arousal?",
        coreConcept: "This element measures the degree and style of mental involvement preferred or required during sexual experiences. It contrasts focus on immediate physical/emotional presence with reliance on imagination, narrative, psychological complexity, or intellectual stimulation.",
        elaboration: "Includes everything from being fully 'in the moment' to elaborate fantasy worlds, scripted role-plays, psychological games, intellectual banter, or focusing on the conceptual meaning of dynamics.",
        scoreInterpretations: {
            "Very Low": "Strong preference for being completely present and embodied. Finds elaborate fantasy, role-play, or complex psychological analysis distracting or uninteresting. Focus is purely on the physical and immediate emotional connection.",
            "Low": "Primarily enjoys the immediate experience. Mental constructs are minimal; perhaps light scenarios or appreciating a partner's mindset, but not reliant on internal narratives.",
            "Moderate": "Appreciates a degree of mental engagement. May enjoy occasional role-play, dirty talk that builds a picture, understanding the psychological dynamic, or using fantasy to enhance arousal, but can also enjoy purely present experiences.",
            "High": "Arousal is significantly enhanced or often triggered by mental elements. This includes enjoying detailed fantasies, specific role-playing scenarios, understanding and playing with psychological power dynamics, or engaging in witty/intellectual sexual banter.",
            "Very High": "Deeply reliant on the mind for arousal and fulfillment. This involves intricate, potentially pre-scripted scenarios, complex world-building in fantasy, intense psychological manipulation or analysis (mind games), or finding the conceptual/intellectual aspect paramount. The mental narrative is the core experience."
        },
        examples: "Mindful sensual touch (Low), enjoying descriptions during dirty talk (Moderate), elaborate D/s protocol scenes (High/Very High), historical or fantasy LARP-style sex (High/Very High), writing/reading erotica focused on complex plots (High/Very High), deep psychological edge play (Very High).",
        personaConnection: "Defines how much and in what way your thoughts, imagination, and intellect participate in your sexuality."
    },
    "Relational": {
        name: "Relational Context",
        coreQuestion: "In what Structure or with whom do you ideally express your sexuality?",
        coreConcept: "This element describes your preferred social structure and context for sexual relationships and expression.",
        elaboration: "It considers the number of partners involved, the desired level of commitment and emotional intimacy, the importance of familiarity versus anonymity, and the preference for dyadic versus group interactions. It covers the spectrum from solitary practice through various forms of monogamy and consensual non-monogamy (CNM).",
        scoreInterpretations: {
            "Very Low": "Strong preference for solitary sexual expression or a deeply bonded, strictly exclusive lifelong partnership (Traditional Monogamy). Discomfort with or disinterest in multiple partners or casual encounters.",
            "Low": "Generally prefers and seeks monogamous, committed relationships as the ideal context for sexual expression. Casual sex is less appealing or infrequent.",
            "Moderate": "Comfortable with committed dyads but potentially open to some flexibility (e.g., swinging in specific contexts, dating casually before commitment) or values deep connection without strict long-term exclusivity. Might be exploring CNM or identify as Solo Poly.",
            "High": "Prefers or actively practices structures involving multiple partners or explicit openness, such as Open Relationships or common forms of Polyamory (hierarchical or not). Values communication around multiple connections.",
            "Very High": "Strong preference for highly fluid, non-traditional structures. May identify with Relationship Anarchy, practice non-hierarchical Polyamory with many partners, enjoy group dynamics, or be comfortable with varying levels of commitment and anonymity across different connections. Rejects rigid rules or default exclusivity."
        },
        examples: "Masturbation (Solitary), Serial Monogamy, Lifelong Monogamy, Friends With Benefits (Casual), Open Relationships, Swinging, Triads/Quads, Hierarchical Polyamory, Egalitarian Polyamory, Solo Polyamory, Relationship Anarchy, Group Sex, Anonymous Encounters.",
        personaConnection: "Defines the preferred social constellation or lack thereof for your sexual life."
    }
};

// *** MAKE SURE KEYWORDS ARE POPULATED FOR ALL CONCEPTS ***
const concepts = [
    { id: 1, name: "Vanilla Sex", cardType: "Practice/Kink", visualHandle: "common_vanilla", primaryElement: "S", elementScores: { A: 5, I: 5, S: 3, P: 4, C: 3, R: 4 }, briefDescription: "Conventional sexual activity.", detailedDescription: "Refers to sexual expression generally considered within conventional norms, often focused on penile-vaginal intercourse or mutual masturbation without specific power dynamics, intense sensations, or elaborate scenarios.", relatedIds: [2, 3, 33], rarity: 'common', canUnlockArt: false, keywords: ['Conventional', 'Physical', 'Simple'] },
    { id: 2, name: "Sensual Touch", cardType: "Practice/Kink", visualHandle: "common_sensual", primaryElement: "S", elementScores: { A: 4, I: 4, S: 4, P: 5, C: 2, R: 4 }, briefDescription: "Gentle, affectionate touch.", detailedDescription: "Focus on gentle, affectionate, and pleasurable touch, emphasizing connection, warmth, and non-goal-oriented physical intimacy. Can include massage, caressing, holding.", relatedIds: [1, 15, 31, 3, 80, 102], rarity: 'common', canUnlockArt: true, visualHandleUnlocked: "common_sensual_art", keywords: ['Gentle', 'Affection', 'Connection', 'Sensation', 'Comfort'] },
    { id: 3, name: "Passionate Kissing", cardType: "Practice/Kink", visualHandle: "common_kissing", primaryElement: "S", elementScores: { A: 6, I: 5, S: 5, P: 6, C: 3, R: 5 }, briefDescription: "Intense, emotional kissing.", detailedDescription: "Intense and emotionally charged kissing as a primary form of connection and arousal. Can range from deep and lingering to urgent and demanding.", relatedIds: [1, 2, 15, 47, 66, 85], rarity: 'common', canUnlockArt: false, keywords: ['Intensity', 'Emotion', 'Connection', 'Sensation', 'Intimacy'] },
    { id: 4, name: "Dominance (Psychological)", cardType: "Identity/Role", visualHandle: "uncommon_dom", primaryElement: "I", elementScores: { A: 6, I: 9, S: 5, P: 8, C: 7, R: 6 }, briefDescription: "Taking psychological control.", detailedDescription: "Focuses on the mental and emotional aspects of control within a dynamic, potentially involving commands, tasks, setting rules, or managing a partner's experience.", relatedIds: [5, 6, 11, 30, 38, 81, 89, 90, 100, 104, 109, 123], rarity: 'uncommon', canUnlockArt: true, visualHandleUnlocked: "uncommon_dom_art", keywords: ['Control', 'Power', 'Leading', 'Psychological', 'Rules', 'Structure'] },
    { id: 5, name: "Submission (Psychological)", cardType: "Identity/Role", visualHandle: "uncommon_sub", primaryElement: "I", elementScores: { A: 6, I: 1, S: 5, P: 8, C: 5, R: 6 }, briefDescription: "Yielding psychological control.", detailedDescription: "Focuses on the mental and emotional aspects of yielding control, finding pleasure or fulfillment in obedience, service, following directions, or surrendering decisions.", relatedIds: [4, 6, 17, 10, 12, 37, 39, 58, 61, 63, 87, 91, 98, 99, 109, 119, 123], rarity: 'uncommon', canUnlockArt: true, visualHandleUnlocked: "uncommon_sub_art", keywords: ['Surrender', 'Power', 'Following', 'Psychological', 'Obedience', 'Trust', 'Vulnerability'] },
    // ... (REST OF YOUR concepts ARRAY with populated keywords) ...
    { id: 125, name: "Breath Control (Advanced)", cardType: "Practice/Kink", visualHandle: "rare_breath_adv", primaryElement: "S", elementScores: { A: 4, I: 7, S: 9, P: 8, C: 4, R: 6 }, briefDescription: "Precise manipulation of breathing.", detailedDescription: "Advanced forms of breath play involving more precise control over inhalation/exhalation, potentially using bags or masks under highly controlled and knowledgeable conditions. Extremely high risk.", relatedIds: [63, 44, 17], rarity: 'rare', canUnlockArt: false, uniquePromptId: "rP125", keywords: ['Breath Play', 'Asphyxiation', 'Risk', 'Edge Play', 'Control', 'Intensity', 'Skill'] },
];

// --- Utility Maps & Arrays ---
const elementKeyToFullName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };
const elementNameToKey = Object.fromEntries(Object.entries(elementKeyToFullName).map(([key, value]) => [value, key]));
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"];
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];

// --- Questionnaire Data ---
const questionnaireGuided = {
    "Attraction": [
        { qId: "a1", type: "slider", text: "How specific are the triggers for your sexual attraction? (e.g., Very broad vs. Very specific types/situations)", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Very Broad / Few Specifics", maxLabel: "Very Specific / Narrow Focus", scoreWeight: 1.0 },
        { qId: "a2", type: "checkbox", text: "Which factors significantly contribute to your initial attraction? (Select up to 2)", options: [ { value: "Physical Appearance/Body Type", points: 0.5 }, { value: "Gender Identity/Presentation", points: 0.5 }, { value: "Personality/Demeanor", points: 0.0 }, { value: "Intellect/Wit", points: 0.5 }, { value: "Signs of Power/Confidence", points: 1.0 }, { value: "Signs of Vulnerability/Submissiveness", points: 1.0 }, { value: "Emotional Connection (Pre-existing)", points: -1.0 }, { value: "Specific Clothing/Materials", points: 1.5 }, { value: "Context/Situation (e.g., role-play)", points: 1.0 } ], scoreWeight: 1.0, maxChoices: 2 },
        { qId: "a3", type: "radio", text: "How important is an emotional bond BEFORE feeling sexual attraction?", options: [ { value: "Essential", points: -2.0 }, { value: "Helpful, but not required", points: -0.5 }, { value: "Neutral / Varies", points: 0 }, { value: "Generally unimportant", points: 1.0 } ], scoreWeight: 1.0 }
    ],
    "Interaction": [
         { qId: "i1", type: "slider", text: "In sexual interactions, where do you naturally find yourself on the spectrum of leading vs. following?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Strongly Following / Receiving", maxLabel: "Strongly Leading / Directing", scoreWeight: 1.0 },
         { qId: "i2", type: "checkbox", text: "Which interaction styles or roles feel most appealing? (Select up to 2)", options: [ { value: "Taking Charge / Dominating", points: 1.5 }, { value: "Guiding / Being Attentive (Top/Caregiver)", points: 1.0 }, { value: "Collaborating / Switching Roles", points: 0 }, { value: "Following Directions / Submitting", points: -1.5 }, { value: "Serving / Pleasing Partner", points: -1.0 }, { value: "Performing / Being Watched", points: 0.5 }, { value: "Playful / Teasing", points: 0.0 } ], scoreWeight: 1.0, maxChoices: 2 },
         { qId: "i3", type: "radio", text: "Do you prefer clear power dynamics or more equal footing?", options: [ { value: "Clear Power Difference (D/s)", points: 1.5 }, { value: "Subtle Power Dynamics", points: 0.5 }, { value: "Equal Footing / Collaborative", points: -1.0 }, { value: "Varies Greatly / No Preference", points: 0 } ], scoreWeight: 1.0 }
    ],
    "Sensory": [
        { qId: "s1", type: "slider", text: "How important is the intensity and variety of physical sensation to your arousal?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Low Importance / Subtle Preferred", maxLabel: "High Importance / Intensity Craved", scoreWeight: 1.0 },
        { qId: "s2", type: "checkbox", text: "Which types of physical sensations are particularly appealing? (Select up to 2)", options: [ { value: "Gentle Touch / Caressing / Warmth", points: -1.0 }, { value: "Firm Pressure / Massage / Hugging", points: 0.0 }, { value: "Sharp / Stinging (Spanking, Biting)", points: 1.5 }, { value: "Burning / Temperature Play (Wax, Ice)", points: 1.5 }, { value: "Restriction / Binding / Helplessness", points: 1.0 }, { value: "Specific Textures (Latex, Silk, Rope)", points: 1.0 }, { value: "Vibration / Electrostimulation", points: 1.5 } ], scoreWeight: 1.0, maxChoices: 2 },
        { qId: "s3", type: "radio", text: "How do you feel about incorporating pain or extreme sensations?", options: [ { value: "Strongly Drawn To It", points: 2.0 }, { value: "Open To Exploring It", points: 1.0 }, { value: "Neutral / Indifferent", points: 0 }, { value: "Prefer to Avoid It", points: -1.0 }, { value: "Strongly Averse To It", points: -2.0 } ], scoreWeight: 1.0 }
     ],
    "Psychological": [
        { qId: "p1", type: "slider", text: "How much is your sexuality tied to fulfilling deeper emotional or psychological needs (beyond physical pleasure)?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Very Little / Primarily Physical", maxLabel: "Very Much / Primary Driver", scoreWeight: 1.0 },
        { qId: "p2", type: "checkbox", text: "Which psychological needs does sex MOST effectively help you meet? (Select up to 2)", options: [ { value: "Deep Connection / Intimacy / Trust", points: 1.5 }, { value: "Power / Control (Giving or Receiving)", points: 1.5 }, { value: "Validation / Feeling Desired", points: 1.0 }, { value: "Escape / Stress Relief / Forgetting", points: 0.5 }, { value: "Catharsis / Emotional Release", points: 1.0 }, { value: "Self-Exploration / Identity Expression", points: 0.5 }, { value: "Security / Comfort / Nurturing", points: 0.0 }, { value: "Simple Fun / Recreation", points: -1.0 } ], scoreWeight: 1.0, maxChoices: 2 },
        { qId: "p3", type: "radio", text: "Does sex feel incomplete if a specific psychological need isn't addressed?", options: [ { value: "Yes, Often", points: 1.5 }, { value: "Sometimes", points: 0.5 }, { value: "Rarely", points: -0.5 }, { value: "Never", points: -1.5 } ], scoreWeight: 1.0 }
     ],
    "Cognitive": [
        { qId: "c1", type: "slider", text: "How important is mental engagement (fantasy, scenarios, intellect) during sex?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Not Important / Prefer Presence", maxLabel: "Very Important / Mentally Driven", scoreWeight: 1.0 },
        { qId: "c2", type: "checkbox", text: "Which mental aspects significantly enhance your arousal? (Select up to 2)", options: [ { value: "Detailed Internal Fantasies", points: 1.5 }, { value: "Specific Role-Playing Scenarios", points: 1.5 }, { value: "Dirty Talk / Erotic Language", points: 1.0 }, { value: "Intellectual Banter / Mind Games", points: 1.0 }, { value: "Understanding Partner's Psychology", points: 0.5 }, { value: "Anticipation / Pre-Planned Scenes", points: 1.0 }, { value: "Being Fully 'In the Moment'", points: -1.5 } ], scoreWeight: 1.0, maxChoices: 2 },
        { qId: "c3", type: "radio", text: "Do you prefer spontaneous encounters or more planned/scripted ones?", options: [ { value: "Strongly Prefer Planned/Scripted", points: 1.5 }, { value: "Lean Towards Planned", points: 0.5 }, { value: "No Real Preference / Mix", points: 0 }, { value: "Lean Towards Spontaneous", points: -0.5 }, { value: "Strongly Prefer Spontaneous", points: -1.5 } ], scoreWeight: 1.0 }
    ],
    "Relational": [
         { qId: "r1", type: "slider", text: "What is your ideal relationship structure regarding number of partners?", minValue: 0, maxValue: 10, defaultValue: 3, minLabel: "Strictly One (Monogamy) / Solitary", maxLabel: "Multiple Partners / Fluidity", scoreWeight: 1.0 },
         { qId: "r2", type: "checkbox", text: "Which relationship contexts feel most comfortable or desirable? (Select up to 2)", options: [ { value: "Solitary / Self-Exploration", points: -1.5 }, { value: "Deeply Committed Monogamous Pair", points: -1.0 }, { value: "Casual Dating / Friends With Benefits", points: 0.5 }, { value: "Open Relationship (Primary + Others)", points: 1.0 }, { value: "Polyamory (Multiple Equal Relationships)", points: 1.5 }, { value: "Group Sex Scenarios", points: 1.0 }, { value: "Anonymous Encounters", points: 0.5 } ], scoreWeight: 1.0, maxChoices: 2 },
         { qId: "r3", type: "radio", text: "How important is relationship 'hierarchy' (e.g., having a 'primary' partner)?", options: [ { value: "Very Important / Need a Primary", points: -1.0 }, { value: "Somewhat Important / Prefer Hierarchy", points: -0.5 }, { value: "Neutral / Depends on Relationship", points: 0 }, { value: "Prefer Non-Hierarchical", points: 1.0 }, { value: "Strongly Against Hierarchy (Anarchy)", points: 1.5 } ], scoreWeight: 1.0 }
    ]
};

// --- Reflection Prompts ---
const reflectionPrompts = {
    "Attraction": [
        { id: "pA1", text: "Think about someone or something you found intensely attractive recently. What specific qualities (physical, personality, dynamic) drew you in the most?" },
        { id: "pA2", text: "When has attraction felt confusing or unexpected for you? What did you learn from that experience?" },
        { id: "pA3", text: "Does your level of emotional connection to someone strongly influence your sexual attraction? How so?" },
        { id: "pA4", text: "Consider an attraction that faded. What changed? Was it about them, you, or the context?" },
    ],
    "Interaction": [
        { id: "pI1", text: "Describe a time you felt most comfortable in a sexual interaction. Were you leading, following, or collaborating? What made it comfortable?" },
        { id: "pI2", text: "Imagine an ideal sexual encounter. What kind of energy exchange are you looking for (playful, intense, nurturing, commanding, yielding)?" },
        { id: "pI3", text: "How important is verbal communication vs non-verbal cues in your preferred interaction style?" },
        { id: "pI4", text: "If you enjoy power dynamics, what is the appeal of holding power? What is the appeal of yielding it?" },
    ],
    "Sensory": [
        { id: "pS1", text: "What type of physical touch (light, firm, rough, specific texture) feels most arousing or connecting to you, separate from orgasm?" },
        { id: "pS2", text: "Are there any specific sensations (temperature, pressure, pain, specific sounds/smells) that strongly enhance or detract from your arousal?" },
        { id: "pS3", text: "How does your desire for sensory input change depending on your mood or partner?" },
        { id: "pS4", text: "Think about a purely sensory experience (sexual or not) that felt transcendent or deeply satisfying. What were its key elements?" },
    ],
    "Psychological": [
        { id: "pP1", text: "Beyond physical pleasure, what core emotional need (e.g., connection, validation, control, escape) does sexuality most often fulfill for you?" },
        { id: "pP2", text: "Think about a time sex felt psychologically fulfilling. What underlying needs were met?" },
        { id: "pP3", text: "Conversely, when has sex felt psychologically unfulfilling, even if physically pleasurable? What might have been missing?" },
        { id: "pP4", text: "How does vulnerability play a role in your psychologically satisfying sexual experiences?" },
    ],
    "Cognitive": [
        { id: "pC1", text: "How much do you rely on fantasy or specific scenarios to become aroused? Are you more 'in your head' or 'in the moment'?" },
        { id: "pC2", text: "Describe a fantasy or scenario (even vaguely) that you find particularly potent. What elements make it work for you?" },
        { id: "pC3", text: "Does the intellectual or psychological aspect of a dynamic (e.g., power plays, witty banter, understanding motivations) contribute significantly to your arousal?" },
        { id: "pC4", text: "How does anticipation or memory shape your sexual experiences?" },
    ],
    "Relational": [
        { id: "pR1", text: "In what context do you feel most free to express your sexuality (e.g., alone, committed partner, casual encounter, group setting)?" },
        { id: "pR2", text: "How important are explicit agreements, rules, or boundaries regarding exclusivity or openness in your ideal sexual relationships?" },
        { id: "pR3", text: "What level of emotional intimacy do you typically prefer or require in your sexual connections?" },
        { id: "pR4", text: "How do concepts like jealousy or compersion (finding joy in a partner's joy with others) manifest in your relational landscape?" },
    ],
    "Dissonance": [
        { id: "pD1", text: "This concept seems quite different from your current profile. What aspect of it intrigues you or makes you curious, even if it feels unfamiliar?" },
        { id: "pD2", text: "Exploring unfamiliar territory can be revealing. What potential does engaging with this concept hold for you, even if it feels challenging or uncomfortable at first glance?" },
        { id: "pD3", text: "Sometimes, what we resist holds a key. Is there an underlying need or desire this concept touches upon, perhaps indirectly, that you haven't fully acknowledged?" },
        { id: "pD4", text: "How might integrating or simply understanding this concept broaden your perspective on your own sexuality or the diverse experiences of others?" }
    ],
    "Guided": {
        "LowAttunement": [
            { id: "gLA1", text: "You're just beginning your exploration. Which core element feels most intriguing or confusing to you right now, and why?" },
            { id: "gLA2", text: "Consider your initial scores. Was there anything that surprised you? How does it feel to start putting names to these aspects of yourself?" }
        ],
        "HighAttunementElement": [
            { id: "gHE1", text: "You show a strong resonance with [Element Name]. How does this element manifest in your fantasies or experiences? What nuances are emerging?" },
            { id: "gHE2", text: "Where might the 'shadow' or challenge lie within your strong connection to [Element Name]? Are there potential downsides or areas for growth?" }
        ],
        "ConceptSynergy": [
             { id: "gCS1", text: "You're focusing on both [Concept A] and [Concept B], which have potential synergy. How do these concepts interact or influence each other in your mind?" },
             { id: "gCS2", text: "What new possibilities or dynamics emerge when you consider [Concept A] and [Concept B] together? Does their combination create something unique?" }
        ]
    },
    "RareConcept": {
        // ... (Your Rare Concept prompts ...) ...
        "rP08": { id: "rP08", text: "Heavy Impact often involves intense sensation and trust. What draws you to this level of intensity? Is it the physical feeling, the marks, the power exchange, or something else?" },
        "rP09": { id: "rP09", text: "Non-impact pain (needles, wax, clamps) offers different sensations. What specific quality of these sensations appeals to you? Is there a psychological component beyond the physical?" },
        "rP11": { id: "rP11", text: "Following explicit commands requires a specific mindset. What is fulfilling or arousing about giving or receiving direct orders in a D/s dynamic?" },
        "rP12": { id: "rP12", text: "Objectification can be controversial. In a consensual context, what psychological needs or desires might treating/being treated as an object fulfill for you?" },
        "rP14": { id: "rP14", text: "Fantasy Immersion suggests the mental narrative is paramount. What elements make a fantasy world feel 'real' or deeply engaging for you during arousal?" },
        "rP16": { id: "rP16", text: "Shibari blends restriction with aesthetics. Is your interest more in the visual beauty, the feeling of the ropes, the helplessness, or the connection with the rigger?" },
        "rP17": { id: "rP17", text: "The feeling of helplessness can be potent. What emotions or psychological states does being restricted evoke in you? Is it surrender, vulnerability, excitement, or something else?" },
        "rP20": { id: "rP20", text: "Focusing on materials like latex shifts attraction away from the person. What is it about the look, feel, sound, or smell of this material that triggers arousal for you?" },
        "rP21": { id: "rP21", text: "Uniforms carry strong associations. What specific uniform/clothing triggers arousal, and what power, role, or fantasy does it represent for you?" },
        "rP25": { id: "rP25", text: "Polyamory involves managing multiple intimate connections. What are the unique joys or challenges you anticipate or experience in this structure?" },
        "rP27": { id: "rP27", text: "Relationship Anarchy rejects pre-defined rules. How do you navigate building unique relationship agreements based purely on individual desires and consent?" },
        "rP30": { id: "rP30", text: "High Protocol demands structure and precision. What is the appeal of such formality in a D/s dynamic? Is it the clarity, the challenge, or the transformation?" },
        "rP41": { id: "rP41", text: "Playing with perceived control (hypnosis/mind control) taps into deep psychological themes. What boundaries are crucial for you in exploring these states safely?" },
        "rP42": { id: "rP42", text: "Transformation fantasies can be profound. What kind of change (physical, mental, species) is most arousing, and what does that transformation signify?" },
        "rP43": { id: "rP43", text: "Medical Play often involves clinical settings and power dynamics. What aspect is most compelling: the vulnerability, the perceived authority, the specific tools, or the scenario itself?" },
        "rP44": { id: "rP44", text: "Edge play pushes boundaries. What safety measures and communication strategies are non-negotiable for you when exploring activities with heightened perceived risk?" },
        "rP45": { id: "rP45", text: "Humiliation/Degradation can evoke strong emotions. What is the difference for you between playful teasing and potentially harmful degradation, and where do your boundaries lie?" },
        "rP63": { id: "rP63", text: "Breath play significantly alters physical and mental states. What specific sensation or psychological shift are you seeking, and how do you prioritize safety?" },
        "rP64": { id: "rP64", text: "CNC involves simulating non-consent. How do you establish enthusiastic consent beforehand to ensure the simulated scenario remains within safe and desired boundaries?" },
        "rP65": { id: "rP65", text: "Chemsex involves substance use. Reflect on the motivations (enhancing sensation, reducing inhibition, social connection) and potential risks associated with this practice." },
        "rP109": { id: "rP109", text: "The M/s dynamic implies a deep power exchange. How does the concept of 'ownership' or total authority/surrender resonate with you compared to less formal D/s?" },
        "rP111": { id: "rP111", text: "Knife play introduces a sharp visual and psychological edge. What role does the perceived danger or the intense focus required play in its appeal?" },
        "rP112": { id: "rP112", text: "E-stim offers unique, often involuntary sensations. How does the feeling of electricity differ from other types of physical stimulation for you?" },
        "rP113": { id: "rP113", text: "Suspension involves significant trust and technical skill. Is the appeal primarily the visual, the physical strain/sensation, or the profound vulnerability?" },
        "rP114": { id: "rP114", text: "Water sports challenge conventional notions of cleanliness and intimacy. What taboos or psychological barriers does this activity engage with for you?" },
        "rP115": { id: "rP115", text: "Scat play is often considered highly taboo. What deep-seated psychological themes or power dynamics might be involved in finding arousal here? (Consider safety implications.)" },
        "rP116": { id: "rP116", text: "Incorporating blood introduces primal and potentially ritualistic elements. What symbolic meaning or visceral reaction does blood evoke in your erotic landscape? (Prioritize safety.)" },
        "rP117": { id: "rP117", text: "Abduction fantasies often involve fear and powerlessness within a safe structure. What specific elements of the capture/captivity narrative are most potent?" },
        "rP118": { id: "rP118", text: "Somnophilia plays with vulnerability and observation. What ethical considerations are paramount when exploring fantasies involving a sleeping or unaware partner?" },
        "rP119": { id: "rP119", text: "Controlling or forcing orgasm is a direct manipulation of pleasure/release. How does this differ from teasing/denial, and what does it signify about power?" },
        "rP120": { id: "rP120", text: "Psychological 'torture' requires navigating intense emotional landscapes. What kind of aftercare is essential after engaging in play that challenges mental boundaries?" },
        "rP121": { id: "rP121", text: "Furry sexuality blends identity, persona, and often specific community contexts. How does adopting a fursona or engaging within the fandom shape your sexual expression?" },
        "rP122": { id: "rP122", text: "Autassassinophilia links arousal to the staged risk of death. What psychological mechanisms might be at play in finding excitement in this ultimate form of 'danger'?" },
        "rP123": { id: "rP123", text: "Using BDSM for exposure therapy requires careful navigation. How can scene work facilitate processing trauma without re-traumatizing, and what professional support might be needed?" },
        "rP124": { id: "rP124", text: "Sensory overstimulation torture focuses on overwhelming input. Is the goal disorientation, endurance, breaking down defenses, or something else?" },
        "rP125": { id: "rP125", text: "Advanced breath control involves significant risk and trust. What is the allure of playing so close to this particular edge? (Reflect on safety practices if exploring this.)" }
    },
    "SceneMeditation": {
        "scnP001": { id: "scnP001", text: "Meditating on 'The Blindfolded Tasting': Imagine focusing solely on taste and texture without sight. How might this heighten other senses or feelings of vulnerability and trust?" },
        "scnP002": { id: "scnP002", text: "Meditating on 'The Negotiated Power Shift': Consider the process of explicitly discussing and shifting control mid-scene. What communication skills are needed? How might this build intimacy or excitement?" },
        "scnP003": { id: "scnP003", text: "Meditating on 'Sensory Storytelling': Reflect on how linking narrative words to physical sensations could blur the lines between mind and body. What kind of story would be most potent for you?"},
        "scnP004": { id: "scnP004", text: "Meditating on 'Mirror Gazing Intimacy': Focus on the raw connection and vulnerability shared through sustained eye contact. What emotions or thoughts arise in the silence?"},
        "scnP005": { id: "scnP005", text: "Meditating on 'Precision Sensation': Imagine being restricted, unable to anticipate the next touch. How does the focus shift entirely to the point of contact? What emotions arise from this focused vulnerability and precise stimulation?" } // Added prompt for unlocked scene
    }
};

// --- Element Deep Dive Content ---
const elementDeepDive = {
    "A": [
        { level: 1, title: "Foundations of Attraction", insightCost: 10, content: "<p>Explores common attraction patterns like gender and presentation, the role of symmetry and health cues (often subconscious), and introduces the concept of spectrums (e.g., the asexual spectrum).</p><ul><li>Defining Orientation vs. Attraction</li><li>Common Cues: Visual, Auditory, Olfactory</li><li>Introduction to Asexuality and Demisexuality</li></ul>" },
        { level: 2, title: "Beyond Gender: Nuances & Paraphilias", insightCost: 25, content: "<p>Delves into attractions beyond typical gender/presentation, including sapiosexuality (intelligence), attraction to dynamics (power), specific personality types, and introduces paraphilias/fetishes non-judgmentally as specific triggers.</p><ul><li>Sapiosexuality and Intellectual Connection</li><li>Attraction to Power Dynamics (Dominance/Submission Cues)</li><li>Understanding Fetishes: Specific Objects, Materials, Situations</li><li>The Role of Conditioning and Early Experience</li></ul>" },
        { level: 3, title: "The Attraction-Arousal Link", insightCost: 50, content: "<p>Examines the complex relationship between initial attraction and physiological arousal, including factors that enhance or inhibit this connection, responsive vs. spontaneous desire, and the concept of attraction fluidity.</p><ul><li>Spontaneous vs. Responsive Desire Models</li><li>Factors Enhancing Arousal (Context, Mood, Hormones)</li><li>Factors Inhibiting Arousal (Stress, Disconnect, Context)</li><li>Attraction Fluidity and Change Over Time</li></ul>" }
    ],
    "I": [
        { level: 1, title: "Roles & Energy Exchange", insightCost: 10, content: "<p>Introduces common interaction roles (Top/Bottom, Dom/Sub, Switch), discusses the concept of energy flow (leading/following), and examines collaborative vs. hierarchical interaction preferences.</p><ul><li>Defining Top/Bottom/Versatile vs. Dom/Sub/Switch</li><li>Energy Flow: Leading, Following, Mutual Exchange</li><li>Preference for Hierarchy vs. Equality in Interaction</li></ul>" },
        { level: 2, title: "Styles of Power Dynamics", insightCost: 25, content: "<p>Explores different flavors of dominance and submission, such as psychological control, service-oriented submission, primal dynamics, nurturing/caregiver roles, and performance-based interactions (exhibitionism/voyeurism).</p><ul><li>Psychological Dominance vs. Physical Control</li><li>Service, Worship, and Obedience</li><li>Primal Play: Instinct and Non-Verbal Cues</li><li>Caregiver/Little Dynamics (DDlg, MDlb)</li><li>Performance Roles: Exhibitionism & Voyeurism</li></ul>" },
        { level: 3, title: "Communication & Negotiation", insightCost: 50, content: "<p>Focuses on the critical role of communication in establishing and navigating interaction styles, including negotiation of roles/scenes, setting boundaries, using safewords, and providing/receiving feedback (aftercare).</p><ul><li>Negotiation: Defining Desires and Limits</li><li>Safewords: Communication Under Pressure</li><li>Implicit vs. Explicit Communication Styles</li><li>Giving and Receiving Feedback & Aftercare</li></ul>" }
    ],
    "S": [
        { level: 1, title: "The Spectrum of Sensation", insightCost: 10, content: "<p>Maps the basic range of physical sensations relevant to sexuality, from light touch and warmth to firm pressure and vibration, considering different erogenous zones and sensitivity levels.</p><ul><li>Mapping Erogenous Zones</li><li>Light Touch, Pressure, Vibration</li><li>Temperature Basics (Warmth/Coolness)</li><li>Texture Fundamentals (Smooth/Rough)</li></ul>" },
        { level: 2, title: "Intensity, Pain & Pleasure", insightCost: 25, content: "<p>Examines the deliberate use of intense sensations, including impact play (spanking, flogging), non-impact pain (pinching, biting, wax), restriction, and the psychological interplay between pain and pleasure (endorphins, context).</p><ul><li>Impact Play: Stinging, Thudding, Rhythmic</li><li>Non-Impact Pain: Sharp, Burning, Aching</li><li>The Pain/Pleasure Paradox: Endorphins and Context</li><li>Introduction to BDSM Sensation Play</li></ul>" },
        { level: 3, title: "Beyond Touch: Full Sensory Integration", insightCost: 50, content: "<p>Expands beyond touch to include the role of sight (visual triggers, aesthetics), sound (music, voice tone, explicit words), smell (pheromones, scents), taste, and practices like sensory deprivation/overload.</p><ul><li>The Power of Visuals: Aesthetics and Action</li><li>Auditory Input: Voice, Music, Environment</li><li>Olfactory Triggers: Scents and Pheromones</li><li>Taste and Oral Fixation</li><li>Sensory Deprivation and Overload Techniques</li></ul>" }
    ],
    "P": [
        { level: 1, title: "Core Motivations", insightCost: 10, content: "<p>Identifies common underlying psychological drivers for sexuality, such as connection, validation, stress relief, power, self-expression, and simple recreation. How do these manifest differently for individuals?</p><ul><li>Connection & Intimacy Needs</li><li>Validation & Self-Esteem</li><li>Stress Relief & Coping Mechanisms</li><li>Power & Control Needs (Giving/Receiving)</li><li>Play, Fun & Recreation</li></ul>" },
        { level: 2, title: "Vulnerability, Trust & Catharsis", insightCost: 25, content: "<p>Explores the deeper psychological states accessible through sex, including the role of vulnerability in building trust, the potential for emotional release (catharsis), and achieving altered states of consciousness (flow, transcendence).</p><ul><li>Vulnerability as a Bridge to Trust</li><li>Catharsis: Emotional Release Through Intensity</li><li>Sexuality and Altered States (Flow, 'Subspace')</li><li>Building Psychological Safety</li></ul>" },
        { level: 3, title: "Shadow Work & Integration", insightCost: 50, content: "<p>Addresses how sexuality can intersect with 'shadow' aspects of the psyche – unacknowledged desires, fears, or past experiences. Discusses potential for healing, integration, or conversely, compulsive repetition if unexamined. Introduces concepts like using play for exposure (with caution).</p><ul><li>Identifying Shadow Desires and Fears</li><li>Compulsive vs. Conscious Expression</li><li>Potential for Healing and Integration (Caution Required)</li><li>The Role of Therapy and Self-Awareness</li></ul>" }
    ],
    "C": [
        { level: 1, title: "Fantasy & Imagination", insightCost: 10, content: "<p>Explores the function of internal fantasy, common fantasy themes, the difference between fantasy and reality, and the use of imagination to enhance arousal even in partnered encounters.</p><ul><li>The Role of Internal Narrative</li><li>Common Fantasy Archetypes and Themes</li><li>Distinguishing Fantasy from Intent</li><li>Using Imagination to Enhance Presence</li></ul>" },
        { level: 2, title: "Scenarios, Role-Play & Scripting", insightCost: 25, content: "<p>Delves into the practice of creating and enacting specific scenarios, adopting roles, using costumes/props, and the degree of scripting vs. improvisation preferred in cognitive play.</p><ul><li>Common Role-Playing Archetypes (Doctor, Teacher, etc.)</li><li>Costumes, Props, and Setting the Scene</li><li>Scripting vs. Improvisation</li><li>Psychological Depth in Role-Play</li></ul>" },
        { level: 3, title: "Intellect, Meaning & Transcendence", insightCost: 50, content: "<p>Focuses on higher-level cognitive engagement: finding arousal in intellectual banter, understanding complex psychological dynamics (mind games), exploring philosophical or symbolic meaning in sex, and seeking transcendent mental states.</p><ul><li>Sapiosexuality and Intellectual Foreplay</li><li>Mind Games and Psychological Chess</li><li>Symbolism and Ritual in Sexuality</li><li>Seeking Transcendence Through Mental Focus</li></ul>" }
    ],
    "R": [
        { level: 1, title: "Structures & Numbers", insightCost: 10, content: "<p>Defines the basic structures: solitary practice, monogamy (serial vs. lifelong), and introduces the concept of consensual non-monogamy (CNM) as an umbrella term.</p><ul><li>Solitary Practice (Masturbation)</li><li>Monogamy: Definitions and Variations</li><li>Introduction to Consensual Non-Monogamy (CNM)</li><li>Dyads, Triads, Quads, and Moresomes</li></ul>" },
        { level: 2, title: "Commitment, Intimacy & Anonymity", insightCost: 25, content: "<p>Explores the varying levels of emotional intimacy and commitment desired within different structures, from deep bonding in polyamory to the intentional lack of connection in anonymous encounters or casual sex.</p><ul><li>Defining Commitment Beyond Exclusivity</li><li>Emotional Intimacy vs. Sexual Connection</li><li>The Spectrum of Casual Sex (FWB, Hookups)</li><li>Anonymity and Its Appeals/Drawbacks</li></ul>" },
        { level: 3, title: "Hierarchy, Rules & Communication", insightCost: 50, content: "<p>Addresses common practices and philosophies within CNM, such as open relationships vs. polyamory, hierarchical vs. non-hierarchical approaches (Relationship Anarchy), the role of rules vs. agreements, and managing complex communication and emotions like jealousy/compersion.</p><ul><li>Open Relationships vs. Polyamory</li><li>Hierarchy: Primaries, Secondaries, and Non-Hierarchical Models</li><li>Relationship Anarchy Principles</li><li>Rules vs. Agreements & Boundary Setting</li><li>Managing Jealousy & Cultivating Compersion</li></ul>" }
    ]
};

// --- Focus Rituals Data ---
const focusRituals = [
     { id: "fr01", requiredFocusIds: [4], description: "Focus Ritual: Reflect on a time you successfully guided a partner's experience.", reward: { type: "insight", amount: 3 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr01" } },
    { id: "fr02", requiredFocusIds: [5], description: "Focus Ritual: Meditate on the feeling of trust required for surrender.", reward: { type: "insight", amount: 3 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr02" } },
    { id: "fr03", requiredFocusIds: [15], description: "Focus Ritual: Contemplate an act that deepens vulnerability with a partner.", reward: { type: "attunement", element: "P", amount: 0.5 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr03" } },
    { id: "fr04", requiredFocusIds: [16, 17], description: "Focus Ritual: Analyze the interplay between aesthetic form and restricted sensation in rope.", reward: { type: "insight", amount: 5 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr04" } }
];

// --- Repository Item Data ---
const sceneBlueprints = [
    { id: "SCN001", name: "The Blindfolded Tasting", element: "S", description: "One partner is blindfolded and fed various foods/drinks with different textures and temperatures, focusing solely on taste, texture, and the intimacy of being fed.", meditationCost: 10, reflectionPromptId: "scnP001" },
    { id: "SCN002", name: "The Negotiated Power Shift", element: "I", description: "Start a scene with agreed-upon roles (e.g., Dom/sub). Partway through, use a specific safeword or signal to pause and explicitly renegotiate who holds the power for the remainder of the scene.", meditationCost: 10, reflectionPromptId: "scnP002" },
    { id: "SCN003", name: "Sensory Storytelling", element: "C", description: "One partner tells an erotic story while simultaneously providing corresponding light sensory input (e.g., describing wind with a feather, warmth with a warm cloth). Focus on synchronizing narrative and sensation.", meditationCost: 10, reflectionPromptId: "scnP003" },
    { id: "SCN004", name: "Mirror Gazing Intimacy", element: "P", description: "Partners sit facing each other, maintaining eye contact, perhaps while holding hands or with light touch. Focus on observing micromovements and shared vulnerability without speaking.", meditationCost: 8, reflectionPromptId: "scnP004" },
    { id: "SCN005", name: "Precision Sensation Scene", element: "S", description: "A scene focusing on deliberate, controlled application of specific non-impact sensations (e.g., temperature, texture, light pinching) often combined with restriction or sensory deprivation to heighten awareness.", meditationCost: 12, reflectionPromptId: "scnP005"}
];
const alchemicalExperiments = [
    { id: "EXP01", name: "Sensory Amplification", requiredElement: "S", requiredAttunement: 75, insightCost: 30, requiredFocusConceptTypes: ["Practice/Kink"], description: "Attempt to heighten all sensory input through focused meditation and deliberate stimulation, risking temporary overload but potentially achieving heightened awareness.", successReward: { type: "attunement", element: "S", amount: 5 }, failureConsequence: "Slight temporary decrease in Sensory attunement.", successRate: 0.6 },
    { id: "EXP02", name: "Command Resonance", requiredElement: "I", requiredAttunement: 80, insightCost: 40, requiredFocusConceptIds: [11], description: "Channel intense focus into the act of command or obedience, seeking perfect resonance and understanding within a power dynamic.", successReward: { type: "insight", amount: 20 }, failureConsequence: "Temporary inability to focus Interaction concepts.", successRate: 0.5 },
    { id: "EXP03", name: "Intimacy Catalyst", requiredElement: "P", requiredAttunement: 85, insightCost: 50, requiredFocusConceptIds: [15], description: "Attempt a ritualistic sharing of vulnerabilities to rapidly deepen a perceived emotional connection, risking discomfort or misinterpretation.", successReward: { type: "attunement", element: "P", amount: 6 }, failureConsequence: "Increased feeling of psychological dissonance for a time.", successRate: 0.4 },
    { id: "EXP04", name: "Conceptual Weaving", requiredElement: "C", requiredAttunement: 70, insightCost: 35, requiredFocusConceptTypes: ["Cognitive"], description: "Attempt to mentally blend two focused Cognitive concepts into a coherent, novel fantasy scenario, potentially unlocking a new perspective or fragment.", successReward: { type: "insightFragment", id: "IFC01", element: "C", text:"Weaving thoughts yields unexpected threads."}, failureConsequence: "Mental fatigue, slight Insight loss.", successRate: 0.55 },
    { id: "EXP05", name: "Persona Integration Test", requiredElement: "C", requiredAttunement: 70, insightCost: 40, requiredFocusConceptIds: [13, 21], description: "Test the coherence of blending role-play with symbolic attire. Success reinforces Cognitive understanding, failure causes temporary persona fuzziness.", successReward: { type: "attunement", element: "C", amount: 4 }, failureConsequence: "Temporary confusion, slight Cognitive attunement decrease.", successRate: 0.5 }
];

const elementalInsights = [
    { id: "EI_A01", element: "A", text: "Attraction is a compass, not always pointing north." },
    { id: "EI_A02", element: "A", text: "What repels reveals as much as what attracts." },
    { id: "EI_A03", element: "A", text: "Sometimes, the strongest pull is towards the unfamiliar edge." },
    { id: "EI_A04", element: "A", text: "A scent, a glance, a word - the spark can ignite anywhere." },
    { id: "EI_I01", element: "I", text: "Every interaction is a negotiation, spoken or unspoken." },
    { id: "EI_I02", element: "I", text: "Silence, too, is a form of dialogue in the dance." },
    { id: "EI_I03", element: "I", text: "True power lies not in control, but in the consent to be controlled." },
    { id: "EI_I04", element: "I", text: "The rhythm of giving and receiving creates the music." },
    { id: "EI_S01", element: "S", text: "The skin remembers sensations the mind forgets." },
    { id: "EI_S02", element: "S", text: "Pain is but intense sensation; its meaning is chosen." },
    { id: "EI_S03", element: "S", text: "Deprive one sense, and the others awaken hungrily." },
    { id: "EI_S04", element: "S", text: "Contrast sharpens awareness: hot/cold, rough/smooth, tight/loose." },
    { id: "EI_P01", element: "P", text: "Need is the hidden current beneath the waves of desire." },
    { id: "EI_P02", element: "P", text: "Vulnerability offered is strength transformed." },
    { id: "EI_P03", element: "P", text: "Catharsis burns away the dross, leaving purified feeling." },
    { id: "EI_P04", element: "P", text: "Trust is the vessel; intimacy is the elixir." },
    { id: "EI_C01", element: "C", text: "Fantasy is the laboratory where reality is tested." },
    { id: "EI_C02", element: "C", text: "The most intricate scenes are mapped first in the mind." },
    { id: "EI_C03", element: "C", text: "Meaning elevates sensation; intellect sharpens the edge." },
    { id: "EI_C04", element: "C", text: "Anticipation is the sweetest spice." },
    { id: "EI_R01", element: "R", text: "A dyad is a universe, a network a galaxy." },
    { id: "EI_R02", element: "R", text: "Rules bind, agreements connect." },
    { id: "EI_R03", element: "R", text: "Exclusivity is a choice, not a default setting of the heart." },
    { id: "EI_R04", element: "R", text: "Compersion requires seeing beyond the self." },
    { id: "IFC01", element: "C", text:"Weaving thoughts yields unexpected threads."}, // Insight from EXP04
    { id: "EI_P05", element: "P", text: "Binding the body can free the heart, if trust holds the knot." } // Insight from FDU002
];

// --- Focus-Driven Unlocks Data ---
const focusDrivenUnlocks = [
    { id: "FDU001", requiredFocusIds: [4, 9], unlocks: { type: "scene", id: "SCN005", name: "Precision Sensation Scene" }, description: "Focusing on Control and Precise Sensation revealed the 'Precision Sensation Scene' Blueprint!" },
    { id: "FDU002", requiredFocusIds: [15, 16], unlocks: { type: "insightFragment", id: "EI_P05", element: "P", text: "Binding the body can free the heart, if trust holds the knot." }, description: "Focusing on Intimacy and Restriction revealed a Psychological Insight!" },
    { id: "FDU003", requiredFocusIds: [13, 21], unlocks: { type: "experiment", id: "EXP05", name: "Persona Integration Test" }, description: "Focusing on Roles and Attire unlocked the 'Persona Integration Test' Experiment!" }
];

// --- Rituals & Milestones Data ---
const dailyRituals = [
    { id: "dr01", description: "Perform Daily Meditation (Free Research).", reward: { type: "insight", amount: 2 }, track: { action: "freeResearch", count: 1, period: "daily" } },
    { id: "dr02", description: "Add 1 Concept to Grimoire.", reward: { type: "insight", amount: 3 }, track: { action: "addToGrimoire", count: 1, period: "daily" } },
    { id: "dr03", description: "Complete a Reflection Prompt.", reward: { type: "insight", amount: 5 }, track: { action: "completeReflection", count: 1, period: "daily" } },
    { id: "dr04", description: "Focus on a new Concept.", reward: { type: "insight", amount: 4 }, track: { action: "markFocus", count: 1, period: "daily" } },
    { id: "dr05", description: "Conduct paid Research.", reward: { type: "attunement", element: "All", amount: 0.2 }, track: { action: "conductResearch", count: 1, period: "daily" } },
    { id: "dr06", description: "Unlock an Element Library level.", reward: { type: "attunement", element: "All", amount: 0.5 }, track: { action: "unlockLibrary", count: 1, period: "daily"} }
];

const milestones = [
     // Early Game & Discovery
    { id: "ms01", description: "First Concept Added!", reward: { type: "insight", amount: 5 }, track: { state: "discoveredConcepts.size", threshold: 1 } },
    { id: "ms02", description: "Curator I: Added 5 Concepts", reward: { type: "insight", amount: 10 }, track: { state: "discoveredConcepts.size", threshold: 5 } },
    { id: "ms15", description: "Curator II: Added 15 Concepts", reward: { type: "insight", amount: 15 }, track: { state: "discoveredConcepts.size", threshold: 15 } },
    { id: "ms25", description: "Curator III: Added 25 Concepts", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "discoveredConcepts.size", threshold: 25 } },
    { id: "ms40", description: "Curator IV: Added 40 Concepts", reward: { type: "insight", amount: 25 }, track: { state: "discoveredConcepts.size", threshold: 40 } },
    { id: "ms55", description: "Curator V: Added 55 Concepts", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "discoveredConcepts.size", threshold: 55 } },
    { id: "ms75", description: "Grand Curator: Added 75 Concepts", reward: { type: "insight", amount: 40 }, track: { state: "discoveredConcepts.size", threshold: 75 } },
    // Focus & Tapestry
    { id: "ms03", description: "First Focus Concept Marked", reward: { type: "insight", amount: 8 }, track: { state: "focusedConcepts.size", threshold: 1 } },
    { id: "ms04", description: "Tapestry Weaver I: Marked 3 Focus Concepts", reward: { type: "attunement", element: "All", amount: 1 }, track: { state: "focusedConcepts.size", threshold: 3 } },
    { id: "ms08", description: "Tapestry Weaver II: Marked 5 Focus Concepts", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "focusedConcepts.size", threshold: 5 } },
    { id: "ms18", description: "Tapestry Weaver III: Filled 7 Focus Slots", reward: { type: "insight", amount: 25 }, track: { state: "focusedConcepts.size", threshold: 7 } },
    { id: "ms35", description: "Tapestry Weaver IV: Filled 9 Focus Slots", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "focusedConcepts.size", threshold: 9 } },
    { id: "ms48", description: "Tapestry Master: Filled 12 Focus Slots", reward: { type: "insight", amount: 50 }, track: { state: "focusedConcepts.size", threshold: 12 } },
    // Research & Attunement
    { id: "ms05", description: "First Research Conducted", reward: { type: "insight", amount: 5 }, track: { action: "conductResearch", count: 1 } },
    { id: "ms06", description: "Elementalist I: Reached Attunement 10 in one Element", reward: { type: "insight", amount: 15 }, track: { state: "elementAttunement", threshold: 10, condition: "any" } },
    { id: "ms13", description: "Well Rounded I: Attunement 5+ in all Elements", reward: { type: "insight", amount: 20 }, track: { state: "elementAttunement", threshold: 5, condition: "all" } },
    { id: "ms20", description: "Elementalist II: Reached Attunement 50 in one Element", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "elementAttunement", threshold: 50, condition: "any" } },
    { id: "ms30", description: "Elementalist III: Reached Attunement 90 in one Element", reward: { type: "insight", amount: 40 }, track: { state: "elementAttunement", threshold: 90, condition: "any" } },
    { id: "ms45", description: "Well Rounded II: Attunement 25+ in all Elements", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "elementAttunement", threshold: 25, condition: "all" } },
    // Reflection & Growth
    { id: "ms07", description: "First Reflection Completed", reward: { type: "insight", amount: 5 }, track: { action: "completeReflection", count: 1 } },
    { id: "ms12", description: "Dissonance Embraced: Completed a Dissonance Reflection", reward: { type: "attunement", element: "All", amount: 1.5 }, track: { action: "completeReflectionDissonance", count: 1 } },
    { id: "ms22", description: "Self-Awareness: Completed 5 Reflections", reward: { type: "insight", amount: 20 }, track: { action: "completeReflection", count: 5 } },
    { id: "ms23", description: "Growth Mindset: Allowed Score Nudge after Reflection", reward: { type: "insight", amount: 10 }, track: { action: "scoreNudgeApplied", count: 1 } },
    { id: "ms38", description: "Deep Reflection: Completed 10 Reflections", reward: { type: "increaseFocusSlots", amount: 1 }, track: { action: "completeReflection", count: 10 } },
    // Specific Discoveries & Evolution
    { id: "ms09", description: "Attuned to Interaction: Reached Attunement 20 in Interaction", reward: { type: "discoverCard", cardId: 6 }, track: { state: "elementAttunement", element: "I", threshold: 20 } },
    { id: "ms10", description: "Deep Thinker: Reached Attunement 20 in Cognitive", reward: { type: "discoverCard", cardId: 14 }, track: { state: "elementAttunement", element: "C", threshold: 20 } },
    { id: "ms11", description: "First Art Evolution", reward: { type: "insight", amount: 20 }, track: { action: "evolveArt", count: 1 } },
    { id: "ms21", description: "Rare Find: Discovered a Rare Concept Card", reward: { type: "insight", amount: 15 }, track: { action: "discoverRareCard", count: 1 } },
    { id: "ms33", description: "Sensory Seeker: Reached Attunement 30 in Sensory", reward: { type: "discoverCard", cardId: 88 }, track: { state: "elementAttunement", element: "S", threshold: 30 } },
    { id: "ms42", description: "Art Appreciator: Evolved Art for 3 Concepts", reward: { type: "insight", amount: 30 }, track: { action: "evolveArt", count: 3 } },
    // Questionnaire Completion
    { id: "ms50", description: "Initial Experiment Complete", reward: { type: "insight", amount: 10 }, track: { action: "completeQuestionnaire", count: 1 } },
    // Library Milestones
    { id: "ms60", description: "Budding Scholar: Unlocked First Library Level", reward: { type: "insight", amount: 5 }, track: { action: "unlockLibrary", count: 1} },
    { id: "ms61", description: "Elemental Scholar: Unlocked Level 2 in one Element", reward: { type: "insight", amount: 10 }, track: { state: "unlockedDeepDiveLevels", threshold: 2, condition: "any"} },
    { id: "ms62", description: "Dedicated Scholar: Unlocked Level 3 in one Element", reward: { type: "insight", amount: 15 }, track: { state: "unlockedDeepDiveLevels", threshold: 3, condition: "any"} },
    { id: "ms63", description: "Omniscient Scholar: Unlocked Level 1 in all Elements", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "unlockedDeepDiveLevels", threshold: 1, condition: "all"} },
    // Repository Milestones
    { id: "ms70", description: "Scene Contemplated: Meditated on a Scene Blueprint", reward: { type: "insight", amount: 10 }, track: { action: "meditateScene", count: 1 } },
    { id: "ms71", description: "Experiment Attempted: Braved an Alchemical Experiment", reward: { type: "insight", amount: 15 }, track: { action: "attemptExperiment", count: 1 } },
    { id: "ms72", description: "Insight Gatherer: Collected 3 Elemental Insights", reward: { type: "attunement", element: "All", amount: 1.0 }, track: { state: "repositoryInsightsCount", threshold: 3 } },
    { id: "ms73", description: "Repository Explorer: Collected 1 item of each type (Scene, Experiment, Insight)", reward: { type: "insight", amount: 20 }, track: { state: "repositoryContents", condition: "allTypesPresent" } }, // Need custom check
    // NEW: Sell Milestone
    { id: "ms80", description: "Resource Management: Sold a Concept Card", reward: { type: "insight", amount: 5 }, track: { action: "sellConcept", count: 1 } },
];

// *** Data for Tapestry Narrative Generation ***
const elementInteractionThemes = {
    "AI": "a dynamic blend of specific Attraction triggers and a focus on Interaction roles, suggesting interest in how desire plays out in social dynamics.",
    "AS": "a focus where specific Attraction cues are strongly linked to Sensory experiences, emphasizing the physical manifestation of desire.",
    "AP": "an exploration linking Attraction triggers to deeper Psychological needs, perhaps seeking specific dynamics to fulfill emotional goals.",
    "AC": "a combination where Attraction is filtered through a Cognitive lens, suggesting interest in the 'idea' of a person/dynamic or enjoying intellectual sparks.",
    "AR": "a pairing where specific Attractions are considered within defined Relationship structures, exploring how desires fit into commitments or fluid connections.",
    "IS": "a strong emphasis on the physical feeling and flow of Interaction, where Sensory input heavily defines the quality of the power exchange or role-play.",
    "IP": "a focus on the Psychological underpinnings of Interaction styles, exploring the 'why' behind dominance, submission, or collaboration.",
    "IC": "an Interaction style heavily influenced by Cognitive elements like scenarios, rules, or psychological analysis within the dynamic.",
    "IR": "an interest in how different Interaction styles manifest within various Relationship structures, from dyads to groups.",
    "SP": "a deep connection between Sensory experience and Psychological fulfillment, perhaps using sensation for catharsis, grounding, or exploring vulnerability.",
    "SC": "where Sensory experiences are framed or enhanced by Cognitive elements like fantasy, anticipation, or specific mental states.",
    "SR": "exploring how different Sensory preferences play out across various Relationship contexts or numbers of partners.",
    "PC": "a highly introspective focus, blending Psychological drives with Cognitive exploration through fantasy, analysis, or meaning-making.",
    "PR": "where Psychological needs are explored or met through specific Relationship configurations or dynamics.",
    "CR": "a focus on the mental frameworks and structures of Relationships, perhaps enjoying negotiation, defining roles intellectually, or exploring theoretical models.",
    "AIS": "a highly embodied experience focused on the interplay of desire, physical sensation, and interactive roles."
};

const cardTypeThemes = {
    "Orientation": "defining the 'who' or 'what' sparks desire is central to this focus.",
    "Identity/Role": "exploring 'who you are' within intimacy or specific power dynamics seems key.",
    "Practice/Kink": "the 'how' and 'what' of sexual expression, the specific actions and sensations, are prominent.",
    "Psychological/Goal": "understanding the 'why' – the underlying emotional needs and motivations – drives this focus.",
    "Relationship Style": "the 'structure' and context of connection, how relationships are formed and navigated, is a major theme."
};

// --- Onboarding Tasks ---
 const onboardingTasks = [
    { id: 'task01', phaseRequired: 1, description: "View Your Grimoire", reward: { type: 'insight', amount: 1 }, track: { action: 'showScreen', value: 'grimoireScreen' }, hint: "Click the 'Grimoire' tab in the navigation bar." },
    { id: 'task02', phaseRequired: 1, description: "Focus Your First Concept", reward: { type: 'insight', amount: 2 }, track: { action: 'markFocus', count: 1 }, hint: "Open a Concept card (from Grimoire or Research) and click 'Mark as Focus', or use the ☆ button on the card in the Grimoire." },
    { id: 'task03', phaseRequired: 2, description: "Conduct Research", reward: { type: 'insight', amount: 2 }, track: { action: 'conductResearch', count: 1 }, hint: "Go to the 'Study' tab and click one of the Element research buttons (costs Insight)." },
    { id: 'task04', phaseRequired: 2, description: "Add a Concept from Research", reward: { type: 'insight', amount: 1 }, track: { action: 'addToGrimoireFromResearch', count: 1 }, hint: "After Researching, click 'Add to Grimoire' on a resulting Concept card in the 'Research Notes' area." },
    { id: 'task05', phaseRequired: 3, description: "Complete a Reflection", reward: { type: 'insight', amount: 3 }, track: { action: 'completeReflection', count: 1 }, hint: "Reflections trigger automatically sometimes, or use 'Seek Guidance'." },
    { id: 'task06', phaseRequired: 4, description: "Visit the Repository", reward: { type: 'insight', amount: 1 }, track: { action: 'showScreen', value: 'repositoryScreen' }, hint: "Click the 'Repository' tab in the navigation bar." }
];

// --- FINAL EXPORT BLOCK ---
export {
    onboardingTasks,
    elementDetails,
    concepts,
    questionnaireGuided,
    reflectionPrompts,
    elementDeepDive,
    focusRituals,
    sceneBlueprints,
    alchemicalExperiments,
    elementalInsights,
    focusDrivenUnlocks,
    dailyRituals,
    milestones,
    elementKeyToFullName,
    elementNameToKey,
    cardTypeKeys,
    elementNames,
    elementInteractionThemes,
    cardTypeThemes
};

console.log("data.js exports defined.");
console.log("data.js finished.");
