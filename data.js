// --- Core Element Details ---
const elementDetails = {
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

// --- Concepts Data ---
// Using elementScores object, primaryElement key, relatedIds, canEvolve
const concepts = [
    { "id": 1, "name": "Vanilla Sex", "type": "Interaction Style", "primaryElement": "S", "elementScores": { "A": 5, "I": 5, "S": 3, "P": 4, "C": 3, "R": 4 }, "description": "Conventional sexual activity without BDSM, kink, or strong taboo elements.", "relatedIds": [2, 3] },
    { "id": 2, "name": "Sensual Touch", "type": "Sensory Experience", "primaryElement": "S", "elementScores": { "A": 4, "I": 4, "S": 4, "P": 5, "C": 2, "R": 4 }, "description": "Focus on gentle, affectionate, and pleasurable touch, emphasizing connection and warmth over intensity.", "relatedIds": [1, 15] },
    { "id": 3, "name": "Passionate Kissing", "type": "Interaction Style", "primaryElement": "S", "elementScores": { "A": 6, "I": 5, "S": 5, "P": 6, "C": 3, "R": 5 }, "description": "Intense and emotionally charged kissing as a primary form of connection and arousal.", "relatedIds": [1, 2, 15] },
    { "id": 4, "name": "Dominance (Psychological)", "type": "Power Dynamic", "primaryElement": "I", "elementScores": { "A": 6, "I": 9, "S": 5, "P": 8, "C": 7, "R": 6 }, "description": "Taking control of the interaction, making decisions, and guiding the partner(s) through authority and presence.", "relatedIds": [5, 6, 10, 11] },
    { "id": 5, "name": "Submission (Psychological)", "type": "Power Dynamic", "primaryElement": "I", "elementScores": { "A": 6, "I": 1, "S": 5, "P": 8, "C": 5, "R": 6 }, "description": "Yielding control, following directions, finding pleasure or fulfillment in serving or obeying a dominant partner.", "relatedIds": [4, 6, 10, 12] },
    { "id": 6, "name": "Switching", "type": "Power Dynamic", "primaryElement": "I", "elementScores": { "A": 6, "I": 5, "S": 6, "P": 7, "C": 6, "R": 6 }, "description": "Enjoying and moving between both dominant and submissive roles within a dynamic or across different encounters.", "relatedIds": [4, 5] },
    { "id": 7, "name": "Impact Play (Light)", "type": "Sensory Experience", "primaryElement": "S", "elementScores": { "A": 5, "I": 6, "S": 6, "P": 5, "C": 4, "R": 5 }, "description": "Using hands, paddles, or light implements for spanking or slapping to create pleasurable stinging sensations.", "relatedIds": [8, 9, 4, 5] },
    { "id": 8, "name": "Impact Play (Heavy)", "type": "Sensory Experience", "primaryElement": "S", "elementScores": { "A": 5, "I": 7, "S": 9, "P": 7, "C": 4, "R": 6 }, "description": "Using canes, whips, or heavy implements for intense sensations, potentially leading to bruising or significant pain.", "relatedIds": [7, 9, 4, 5] },
    { "id": 9, "name": "Pain Play (Non-Impact)", "type": "Sensory Experience", "primaryElement": "S", "elementScores": { "A": 4, "I": 6, "S": 8, "P": 7, "C": 5, "R": 6 }, "description": "Incorporating sensations like pinching, biting, scratching, wax, or needles for intense, focused pain/pleasure.", "relatedIds": [7, 8, 16, 17] },
    { "id": 10, "name": "Service Submission", "type": "Power Dynamic", "primaryElement": "I", "elementScores": { "A": 5, "I": 2, "S": 3, "P": 7, "C": 4, "R": 5 }, "description": "Finding fulfillment in performing tasks, attending to a partner's needs, or acts of devotion.", "relatedIds": [5, 4, 12] },
    { "id": 11, "name": "Command/Control Dynamics", "type": "Power Dynamic", "primaryElement": "I", "elementScores": { "A": 6, "I": 9, "S": 5, "P": 8, "C": 8, "R": 6 }, "description": "A structured dynamic involving explicit orders given and obeyed, often involving rules and protocols.", "relatedIds": [4, 5, 30] },
    { "id": 12, "name": "Objectification", "type": "Psychological Theme", "primaryElement": "P", "elementScores": { "A": 7, "I": 4, "S": 6, "P": 8, "C": 6, "R": 5 }, "description": "Treating or being treated as a sexual object, focusing on the body or specific parts, potentially dehumanizing.", "relatedIds": [4, 5, 20] },
    { "id": 13, "name": "Role-Playing (Scenario)", "type": "Cognitive Activity", "primaryElement": "C", "elementScores": { "A": 6, "I": 6, "S": 5, "P": 6, "C": 8, "R": 6 }, "description": "Adopting specific characters or personas (e.g., doctor/patient, teacher/student) to create a narrative.", "relatedIds": [14, 30] },
    { "id": 14, "name": "Fantasy Immersion", "type": "Cognitive Activity", "primaryElement": "C", "elementScores": { "A": 5, "I": 3, "S": 4, "P": 7, "C": 9, "R": 3 }, "description": "Focusing heavily on internal mental narratives, detailed fantasies, or imagined scenarios during sex.", "relatedIds": [13, 29] },
    { "id": 15, "name": "Deep Emotional Intimacy", "type": "Psychological Need", "primaryElement": "P", "elementScores": { "A": 7, "I": 5, "S": 4, "P": 9, "C": 5, "R": 7 }, "description": "Seeking profound connection, vulnerability, trust, and emotional bonding through sexual expression.", "relatedIds": [2, 3, 25] },
    { "id": 16, "name": "Rope Bondage (Shibari/Kinbaku)", "type": "Sensory Experience", "primaryElement": "S", "elementScores": { "A": 6, "I": 7, "S": 8, "P": 7, "C": 6, "R": 6 }, "description": "Using rope for aesthetic patterns, restriction, and creating specific pressure points or suspensions.", "relatedIds": [9, 17, 4, 5] },
    { "id": 17, "name": "Restriction/Helplessness", "type": "Sensory/Psychological", "primaryElement": "S", "elementScores": { "A": 5, "I": 3, "S": 7, "P": 8, "C": 5, "R": 5 }, "description": "Finding arousal in being physically restrained, unable to move freely, leading to psychological surrender.", "relatedIds": [16, 5, 9] },
    { "id": 18, "name": "Exhibitionism", "type": "Interaction Style", "primaryElement": "I", "elementScores": { "A": 6, "I": 7, "S": 5, "P": 7, "C": 6, "R": 5 }, "description": "Deriving pleasure from being watched during sexual activity, performing for an audience (partner or others).", "relatedIds": [19] },
    { "id": 19, "name": "Voyeurism", "type": "Interaction Style", "primaryElement": "A", "elementScores": { "A": 7, "I": 2, "S": 3, "P": 6, "C": 5, "R": 3 }, "description": "Deriving pleasure from secretly or openly watching others engage in sexual activity.", "relatedIds": [18] },
    { "id": 20, "name": "Latex/Material Fetish", "type": "Attraction Focus", "primaryElement": "A", "elementScores": { "A": 9, "I": 5, "S": 8, "P": 6, "C": 5, "R": 4 }, "description": "Strong attraction to the look, feel, sound, or smell of specific materials like latex, leather, PVC, etc.", "relatedIds": [12, 21] },
    { "id": 21, "name": "Uniform/Clothing Fetish", "type": "Attraction Focus", "primaryElement": "A", "elementScores": { "A": 8, "I": 6, "S": 4, "P": 6, "C": 6, "R": 5 }, "description": "Specific types of clothing (e.g., uniforms, lingerie, costumes) are a primary trigger for arousal.", "relatedIds": [13, 20] },
    { "id": 22, "name": "Monogamy", "type": "Relational Style", "primaryElement": "R", "elementScores": { "A": 5, "I": 5, "S": 5, "P": 6, "C": 5, "R": 2 }, "description": "Preference for or practice of having only one sexual and/or romantic partner at a time.", "relatedIds": [23, 15] },
    { "id": 23, "name": "Serial Monogamy", "type": "Relational Style", "primaryElement": "R", "elementScores": { "A": 5, "I": 5, "S": 5, "P": 5, "C": 5, "R": 3 }, "description": "Engaging in a sequence of monogamous relationships over time.", "relatedIds": [22, 24] },
    { "id": 24, "name": "Casual Sex / Hookups", "type": "Relational Style", "primaryElement": "R", "elementScores": { "A": 6, "I": 4, "S": 6, "P": 3, "C": 3, "R": 5 }, "description": "Engaging in sexual activity without the expectation of commitment or deep emotional intimacy.", "relatedIds": [23, 26] },
    { "id": 25, "name": "Polyamory (Hierarchical)", "type": "Relational Style", "primaryElement": "R", "elementScores": { "A": 6, "I": 6, "S": 5, "P": 7, "C": 6, "R": 8 }, "description": "Maintaining multiple committed relationships simultaneously, with a primary partnership taking precedence.", "relatedIds": [15, 26, 27] },
    { "id": 26, "name": "Open Relationship", "type": "Relational Style", "primaryElement": "R", "elementScores": { "A": 6, "I": 5, "S": 6, "P": 5, "C": 5, "R": 7 }, "description": "A committed couple agrees to allow one or both partners to have sexual relationships with others.", "relatedIds": [24, 25, 27] },
    { "id": 27, "name": "Relationship Anarchy", "type": "Relational Style", "primaryElement": "R", "elementScores": { "A": 6, "I": 5, "S": 5, "P": 6, "C": 7, "R": 9 }, "description": "Rejects traditional relationship rules and hierarchies, emphasizing autonomy and customizing each connection individually.", "relatedIds": [25, 26] },
    { "id": 28, "name": "Asexuality", "type": "Attraction Focus", "primaryElement": "A", "elementScores": { "A": 0, "I": 3, "S": 2, "P": 3, "C": 3, "R": 4 }, "description": "Lack of sexual attraction towards others. May still experience romantic attraction or desire intimacy.", "relatedIds": [29] },
    { "id": 29, "name": "Demisexuality", "type": "Attraction Focus", "primaryElement": "A", "elementScores": { "A": 3, "I": 4, "S": 4, "P": 8, "C": 5, "R": 5 }, "description": "Experiencing sexual attraction only after forming a strong emotional bond with someone.", "relatedIds": [15, 28, 22] },
    { "id": 30, "name": "High Protocol D/s", "type": "Interaction/Cognitive", "primaryElement": "I", "elementScores": { "A": 6, "I": 8, "S": 6, "P": 8, "C": 9, "R": 7 }, "description": "Highly structured power exchange dynamics involving formal titles, rules, rituals, and predetermined scene structures.", "relatedIds": [4, 5, 11, 13] }
];

// --- Utility Maps ---
const elementKeyToName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };

// --- Questionnaire Data ---
// Using qId, type, text, options (value, points), scoreWeight, etc.
const questionnaireGuided = {
    "Attraction": [
        { qId: "a1", type: "slider", text: "How specific are the triggers for your sexual attraction? (e.g., Very broad vs. Very specific types/situations)", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Very Broad / Few Specifics", maxLabel: "Very Specific / Narrow Focus", scoreWeight: 1.0 },
        { qId: "a2", type: "checkbox", text: "Which factors significantly contribute to your initial attraction? (Select up to 2)", options: [ { value: "Physical Appearance/Body Type", points: 0.5 }, { value: "Gender Identity/Presentation", points: 0.5 }, { value: "Personality/Demeanor", points: 0.0 }, { value: "Intellect/Wit", points: 0.5 }, // Sapiosexual leaning
            { value: "Signs of Power/Confidence", points: 1.0 }, { value: "Signs of Vulnerability/Submissiveness", points: 1.0 }, { value: "Emotional Connection (Pre-existing)", points: -1.0 }, // Demisexual leaning
            { value: "Specific Clothing/Materials", points: 1.5 }, // Fetish leaning
            { value: "Context/Situation (e.g., role-play)", points: 1.0 } ], scoreWeight: 1.0, maxChoices: 2 },
        { qId: "a3", type: "radio", text: "How important is an emotional bond BEFORE feeling sexual attraction?", options: [ { value: "Essential", points: -2.0 }, // Strong Demi
            { value: "Helpful, but not required", points: -0.5 }, { value: "Neutral / Varies", points: 0 }, { value: "Generally unimportant", points: 1.0 } ], scoreWeight: 1.0 }
    ],
    "Interaction": [
         { qId: "i1", type: "slider", text: "In sexual interactions, where do you naturally find yourself on the spectrum of leading vs. following?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Strongly Following / Receiving", maxLabel: "Strongly Leading / Directing", scoreWeight: 1.0 },
         { qId: "i2", type: "checkbox", text: "Which interaction styles or roles feel most appealing? (Select up to 2)", options: [ { value: "Taking Charge / Dominating", points: 1.5 }, { value: "Guiding / Being Attentive (Top/Caregiver)", points: 1.0 }, { value: "Collaborating / Switching Roles", points: 0 }, { value: "Following Directions / Submitting", points: -1.5 }, { value: "Serving / Pleasing Partner", points: -1.0 }, { value: "Performing / Being Watched", points: 0.5 }, // Exhibitionist leaning
            { value: "Playful / Teasing", points: 0.0 } ], scoreWeight: 1.0, maxChoices: 2 },
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
