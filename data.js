// data.js

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
    }, // Comma BETWEEN elements
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
    }, // Comma BETWEEN elements
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
    }, // Comma BETWEEN elements
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
    }, // Comma BETWEEN elements
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
    }, // Comma BETWEEN elements
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
    } // NO Comma after the LAST element's closing brace
}; // Semicolon to end the const elementDetails statement

// --- Concepts Data (Card Structure - Expanded) ---
const concepts = [
    // --- Common Concepts ---
    { id: 1, name: "Vanilla Sex", cardType: "Practice/Kink", visualHandle: "vis_practice_vanilla", primaryElement: "S", elementScores: { A: 5, I: 5, S: 3, P: 4, C: 3, R: 4 }, briefDescription: "Conventional sexual activity without specific kink elements.", detailedDescription: "Refers to sexual expression generally considered within conventional norms...", relatedIds: [2, 3], rarity: 'common', canUnlockArt: false },
    { id: 2, name: "Sensual Touch", cardType: "Practice/Kink", visualHandle: "vis_practice_sensual", primaryElement: "S", elementScores: { A: 4, I: 4, S: 4, P: 5, C: 2, R: 4 }, briefDescription: "Emphasizing gentle, affectionate, and pleasurable touch.", detailedDescription: "Focus on gentle, affectionate, and pleasurable touch, emphasizing connection...", relatedIds: [1, 15, 3], rarity: 'common', canUnlockArt: true, visualHandleUnlocked: "vis_practice_sensual_art" },
    { id: 3, name: "Passionate Kissing", cardType: "Practice/Kink", visualHandle: "vis_practice_kissing", primaryElement: "S", elementScores: { A: 6, I: 5, S: 5, P: 6, C: 3, R: 5 }, briefDescription: "Intense and emotionally charged kissing as a primary connection.", detailedDescription: "Intense and emotionally charged kissing as a primary form of connection...", relatedIds: [1, 2, 15], rarity: 'common', canUnlockArt: false },
    { id: 22, name: "Monogamy", cardType: "Relationship Style", visualHandle: "vis_rel_mono", primaryElement: "R", elementScores: { A: 5, I: 5, S: 5, P: 6, C: 5, R: 2 }, briefDescription: "Preference for having only one sexual/romantic partner at a time.", detailedDescription: "The practice or preference for having only one sexual and/or romantic partner...", relatedIds: [23, 15, 29], rarity: 'common', canUnlockArt: true, visualHandleUnlocked: "vis_rel_mono_art" },
    { id: 23, name: "Serial Monogamy", cardType: "Relationship Style", visualHandle: "vis_rel_serialmono", primaryElement: "R", elementScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 3 }, briefDescription: "Engaging in a sequence of exclusive relationships over time.", detailedDescription: "The pattern of engaging in sequential monogamous relationships...", relatedIds: [22, 24], rarity: 'common', canUnlockArt: false },
    { id: 24, name: "Casual Sex / Hookups", cardType: "Relationship Style", visualHandle: "vis_rel_casual", primaryElement: "R", elementScores: { A: 6, I: 4, S: 6, P: 3, C: 3, R: 5 }, briefDescription: "Sexual activity without expectation of commitment or deep intimacy.", detailedDescription: "Sexual encounters that occur outside of a committed romantic relationship...", relatedIds: [23, 26], rarity: 'common', canUnlockArt: false },
    { id: 31, name: "Cuddling / Affection", cardType: "Practice/Kink", visualHandle: "vis_practice_cuddle", primaryElement: "P", elementScores: { A: 3, I: 3, S: 3, P: 6, C: 2, R: 4 }, briefDescription: "Non-sexual physical closeness emphasizing comfort and warmth.", detailedDescription: "Sharing physical closeness through hugging, holding, or lying together without explicit sexual intent, focusing on comfort, security, and platonic or romantic affection.", relatedIds: [2, 15], rarity: 'common', canUnlockArt: false },
    { id: 32, name: "Dirty Talk", cardType: "Practice/Kink", visualHandle: "vis_practice_dirtytalk", primaryElement: "C", elementScores: { A: 5, I: 6, S: 3, P: 5, C: 7, R: 5 }, briefDescription: "Using explicit or suggestive language to enhance arousal.", detailedDescription: "Verbally expressing desires, fantasies, commands, or descriptions of acts during sexual activity to increase arousal and connection.", relatedIds: [13, 11, 4, 5], rarity: 'common', canUnlockArt: false },
    { id: 33, name: "Mutual Masturbation", cardType: "Practice/Kink", visualHandle: "vis_practice_mutual", primaryElement: "I", elementScores: { A: 5, I: 5, S: 6, P: 4, C: 4, R: 5 }, briefDescription: "Partners masturbating alongside or stimulating each other manually.", detailedDescription: "Two or more partners engaging in simultaneous masturbation, potentially watching or manually stimulating each other to orgasm.", relatedIds: [1, 18, 19], rarity: 'common', canUnlockArt: false },

    // --- Uncommon Concepts ---
    { id: 4, name: "Dominance (Psychological)", cardType: "Identity/Role", visualHandle: "vis_role_dom", primaryElement: "I", elementScores: { A: 6, I: 9, S: 5, P: 8, C: 7, R: 6 }, briefDescription: "Taking psychological control, guiding interactions, commanding.", detailedDescription: "Focuses on the mental and emotional aspects of control within a dynamic...", relatedIds: [5, 6, 10, 11, 30], rarity: 'uncommon', canUnlockArt: true, visualHandleUnlocked: "vis_role_dom_art" },
    { id: 5, name: "Submission (Psychological)", cardType: "Identity/Role", visualHandle: "vis_role_sub", primaryElement: "I", elementScores: { A: 6, I: 1, S: 5, P: 8, C: 5, R: 6 }, briefDescription: "Yielding psychological control, following directions, obeying.", detailedDescription: "Focuses on the mental and emotional aspects of yielding control...", relatedIds: [4, 6, 10, 12, 17], rarity: 'uncommon', canUnlockArt: true, visualHandleUnlocked: "vis_role_sub_art" },
    { id: 6, name: "Switching", cardType: "Identity/Role", visualHandle: "vis_role_switch", primaryElement: "I", elementScores: { A: 6, I: 5, S: 6, P: 7, C: 6, R: 6 }, briefDescription: "Enjoying and moving between both dominant and submissive roles.", detailedDescription: "Describes the ability and desire to fluidly shift between dominant...", relatedIds: [4, 5], rarity: 'uncommon', canUnlockArt: false },
    { id: 7, name: "Impact Play (Light)", cardType: "Practice/Kink", visualHandle: "vis_kink_impact_light", primaryElement: "S", elementScores: { A: 5, I: 6, S: 6, P: 5, C: 4, R: 5 }, briefDescription: "Using hands or light implements for pleasurable stinging.", detailedDescription: "Involves activities like spanking, slapping, or using paddles/floggers lightly...", relatedIds: [8, 9, 4, 5], rarity: 'uncommon', canUnlockArt: true, visualHandleUnlocked: "vis_kink_impact_light_art" },
    { id: 13, name: "Role-Playing (Scenario)", cardType: "Practice/Kink", visualHandle: "vis_kink_roleplay", primaryElement: "C", elementScores: { A: 6, I: 6, S: 5, P: 6, C: 8, R: 6 }, briefDescription: "Adopting specific characters or personas to create a narrative.", detailedDescription: "Involves adopting specific character archetypes (e.g., doctor/patient...)", relatedIds: [14, 30, 21], rarity: 'uncommon', canUnlockArt: true, visualHandleUnlocked: "vis_kink_roleplay_art" },
    { id: 15, name: "Deep Emotional Intimacy", cardType: "Psychological/Goal", visualHandle: "vis_goal_intimacy", primaryElement: "P", elementScores: { A: 7, I: 5, S: 4, P: 9, C: 5, R: 7 }, briefDescription: "Seeking profound connection and vulnerability through sex.", detailedDescription: "Places a high value on using sexual expression as a way to build and deepen...", relatedIds: [2, 3, 22, 29], rarity: 'uncommon', canUnlockArt: true, visualHandleUnlocked: "vis_goal_intimacy_art" },
    { id: 18, name: "Exhibitionism", cardType: "Identity/Role", visualHandle: "vis_role_exhibit", primaryElement: "I", elementScores: { A: 6, I: 7, S: 5, P: 7, C: 6, R: 5 }, briefDescription: "Deriving pleasure from being watched during sexual activity.", detailedDescription: "Finding sexual arousal and pleasure in the act of being watched by others...", relatedIds: [19, 12, 34], rarity: 'uncommon', canUnlockArt: false },
    { id: 19, name: "Voyeurism", cardType: "Identity/Role", visualHandle: "vis_role_voyeur", primaryElement: "A", elementScores: { A: 7, I: 2, S: 3, P: 6, C: 5, R: 3 }, briefDescription: "Deriving pleasure from watching others engage in sexual activity.", detailedDescription: "Finding sexual arousal and pleasure primarily from the act of watching...", relatedIds: [18, 12, 34], rarity: 'uncommon', canUnlockArt: false },
    { id: 26, name: "Open Relationship", cardType: "Relationship Style", visualHandle: "vis_rel_open", primaryElement: "R", elementScores: { A: 6, I: 5, S: 6, P: 5, C: 5, R: 7 }, briefDescription: "A primary couple agrees one/both can have outside sexual partners.", detailedDescription: "A relationship structure, typically involving a primary couple...", relatedIds: [24, 25, 27, 35], rarity: 'uncommon', canUnlockArt: false },
    { id: 28, name: "Asexuality", cardType: "Orientation", visualHandle: "vis_ori_ace", primaryElement: "A", elementScores: { A: 0, I: 3, S: 2, P: 3, C: 3, R: 4 }, briefDescription: "Experiencing little or no sexual attraction towards others.", detailedDescription: "Characterized by a persistent lack of sexual attraction towards any gender...", relatedIds: [29, 36], rarity: 'uncommon', canUnlockArt: false },
    { id: 29, name: "Demisexuality", cardType: "Orientation", visualHandle: "vis_ori_demi", primaryElement: "A", elementScores: { A: 3, I: 4, S: 4, P: 8, C: 5, R: 5 }, briefDescription: "Experiencing sexual attraction only after forming a strong emotional bond.", detailedDescription: "A sexual orientation where an individual only develops sexual attraction...", relatedIds: [15, 28, 22], rarity: 'uncommon', canUnlockArt: false },
    { id: 34, name: "Group Sex", cardType: "Practice/Kink", visualHandle: "vis_practice_group", primaryElement: "R", elementScores: { A: 6, I: 6, S: 7, P: 5, C: 4, R: 8 }, briefDescription: "Sexual activity involving more than two participants.", detailedDescription: "Engaging in sexual acts with three or more people simultaneously. Dynamics can vary widely from casual encounters to structured orgies or polyamorous group play.", relatedIds: [18, 19, 25, 26, 27], rarity: 'uncommon', canUnlockArt: false },
    { id: 35, name: "Swinging", cardType: "Relationship Style", visualHandle: "vis_rel_swing", primaryElement: "R", elementScores: { A: 5, I: 5, S: 6, P: 4, C: 4, R: 7 }, briefDescription: "Committed couples engaging in recreational sex with other couples/individuals.", detailedDescription: "A lifestyle where committed couples consensually engage in sexual activities with other couples or individuals, often at parties or planned events, typically with an emphasis on sex over deep emotional connection with outside partners.", relatedIds: [26, 24, 34], rarity: 'uncommon', canUnlockArt: false },
    { id: 36, name: "Aromanticism", cardType: "Orientation", visualHandle: "vis_ori_aro", primaryElement: "A", elementScores: { A: 2, I: 3, S: 3, P: 4, C: 4, R: 3 }, briefDescription: "Experiencing little or no romantic attraction towards others.", detailedDescription: "Characterized by a lack of romantic attraction. Aromantic individuals may still experience sexual attraction (allosexual) or not (aro/ace), and may desire platonic partnerships or other relationship structures.", relatedIds: [28, 27], rarity: 'uncommon', canUnlockArt: false },
    { id: 37, name: "Sensory Deprivation", cardType: "Practice/Kink", visualHandle: "vis_kink_sensorydep", primaryElement: "S", elementScores: { A: 4, I: 3, S: 8, P: 7, C: 6, R: 5 }, briefDescription: "Intentionally reducing or eliminating sensory input (sight, sound).", detailedDescription: "Using blindfolds, hoods, earplugs, or other methods to significantly reduce or eliminate one or more senses, often heightening remaining senses, increasing vulnerability, or creating a specific psychological state.", relatedIds: [9, 17, 5], rarity: 'uncommon', canUnlockArt: false },
    { id: 38, name: "Teasing & Denial", cardType: "Practice/Kink", visualHandle: "vis_kink_denial", primaryElement: "P", elementScores: { A: 6, I: 7, S: 7, P: 8, C: 7, R: 6 }, briefDescription: "Building arousal intensely while withholding or delaying orgasm.", detailedDescription: "A form of psychological play and power exchange where one partner intentionally builds the other's arousal close to orgasm but repeatedly denies release, often increasing desperation and reinforcing control dynamics.", relatedIds: [4, 5, 11, 9], rarity: 'uncommon', canUnlockArt: false },
    { id: 39, name: "Age Play", cardType: "Practice/Kink", visualHandle: "vis_kink_ageplay", primaryElement: "C", elementScores: { A: 5, I: 6, S: 4, P: 7, C: 8, R: 6 }, briefDescription: "Role-playing scenarios involving significantly different perceived ages.", detailedDescription: "Consensual role-playing where participants adopt personas and behaviors associated with ages different from their own (e.g., caregiver/little, teacher/student). Focus is typically on the dynamic and psychological state, not actual age differences.", relatedIds: [13, 4, 5, 10], rarity: 'uncommon', canUnlockArt: false },
    { id: 40, name: "Primal Play", cardType: "Practice/Kink", visualHandle: "vis_kink_primal", primaryElement: "I", elementScores: { A: 5, I: 8, S: 7, P: 6, C: 3, R: 5 }, briefDescription: "Engaging in instinctive, non-verbal, animalistic interactions.", detailedDescription: "A style of play involving raw, instinctive, and often non-verbal interaction, tapping into animalistic urges like chasing, biting, growling, nuzzling, or struggling. Can range from playful to intense.", relatedIds: [4, 5, 9], rarity: 'uncommon', canUnlockArt: false },


    // --- Rare Concepts ---
    { id: 8, name: "Impact Play (Heavy)", cardType: "Practice/Kink", visualHandle: "vis_kink_impact_heavy", primaryElement: "S", elementScores: { A: 5, I: 7, S: 9, P: 7, C: 4, R: 6 }, briefDescription: "Using implements for intense sensations, potentially causing pain/marks.", detailedDescription: "Utilizes implements like canes, whips, heavy paddles, or fists to deliver strong...", relatedIds: [7, 9, 4, 5], rarity: 'rare', canUnlockArt: true, visualHandleUnlocked: "vis_kink_impact_heavy_art" },
    { id: 9, name: "Pain Play (Non-Impact)", cardType: "Practice/Kink", visualHandle: "vis_kink_pain", primaryElement: "S", elementScores: { A: 4, I: 6, S: 8, P: 7, C: 5, R: 6 }, briefDescription: "Using pinching, biting, wax, needles etc. for intense sensation.", detailedDescription: "Focuses on creating intense sensations through means other than direct impact...", relatedIds: [7, 8, 16, 17, 37], rarity: 'rare', canUnlockArt: true, visualHandleUnlocked: "vis_kink_pain_art" },
    { id: 11, name: "Command/Control Dynamics", cardType: "Psychological/Goal", visualHandle: "vis_goal_control", primaryElement: "I", elementScores: { A: 6, I: 9, S: 5, P: 8, C: 8, R: 6 }, briefDescription: "Structured dynamic involving explicit orders given and obeyed.", detailedDescription: "A power dynamic characterized by one partner giving clear commands...", relatedIds: [4, 5, 10, 30, 38], rarity: 'rare', canUnlockArt: true, visualHandleUnlocked: "vis_goal_control_art" },
    { id: 12, name: "Objectification", cardType: "Psychological/Goal", visualHandle: "vis_goal_object", primaryElement: "P", elementScores: { A: 7, I: 4, S: 6, P: 8, C: 6, R: 5 }, briefDescription: "Treating or being treated as a sexual object, focusing on the body.", detailedDescription: "Involves focusing on a person's body or specific body parts as the primary...", relatedIds: [4, 5, 20, 18, 19], rarity: 'rare', canUnlockArt: false }, // Contentious, maybe no art unlock?
    { id: 14, name: "Fantasy Immersion", cardType: "Cognitive", visualHandle: "vis_cog_fantasy", primaryElement: "C", elementScores: { A: 5, I: 3, S: 4, P: 7, C: 9, R: 3 }, briefDescription: "Focusing heavily on internal mental narratives during sex.", detailedDescription: "Prioritizes internal mental experience over external reality...", relatedIds: [13, 29, 41], rarity: 'rare', canUnlockArt: true, visualHandleUnlocked: "vis_cog_fantasy_art" },
    { id: 16, name: "Rope Bondage (Shibari/Kinbaku)", cardType: "Practice/Kink", visualHandle: "vis_kink_rope", primaryElement: "S", elementScores: { A: 6, I: 7, S: 8, P: 7, C: 6, R: 6 }, briefDescription: "Using rope for aesthetic patterns, restriction, and sensation.", detailedDescription: "An art form and practice involving tying a partner with rope...", relatedIds: [9, 17, 4, 5], rarity: 'rare', canUnlockArt: true, visualHandleUnlocked: "vis_kink_rope_art" },
    { id: 17, name: "Restriction/Helplessness", cardType: "Psychological/Goal", visualHandle: "vis_goal_restrict", primaryElement: "S", elementScores: { A: 5, I: 3, S: 7, P: 8, C: 5, R: 5 }, briefDescription: "Arousal from being physically restrained and psychological surrender.", detailedDescription: "Deriving arousal from the sensation of being physically restrained...", relatedIds: [16, 5, 9, 37], rarity: 'rare', canUnlockArt: false },
    { id: 20, name: "Latex/Material Fetish", cardType: "Orientation", visualHandle: "vis_ori_latex", primaryElement: "A", elementScores: { A: 9, I: 5, S: 8, P: 6, C: 5, R: 4 }, briefDescription: "Strong attraction focused on specific materials (latex, leather, etc.).", detailedDescription: "A specific fetish where sexual arousal is strongly triggered by the sight, feel, sound...", relatedIds: [12, 21, 42], rarity: 'rare', canUnlockArt: false },
    { id: 21, name: "Uniform/Clothing Fetish", cardType: "Orientation", visualHandle: "vis_ori_uniform", primaryElement: "A", elementScores: { A: 8, I: 6, S: 4, P: 6, C: 6, R: 5 }, briefDescription: "Specific clothing (uniforms, costumes) as primary arousal trigger.", detailedDescription: "A fetish where sexual arousal is significantly triggered by specific types...", relatedIds: [13, 20, 12], rarity: 'rare', canUnlockArt: false },
    { id: 25, name: "Polyamory", cardType: "Relationship Style", visualHandle: "vis_rel_poly", primaryElement: "R", elementScores: { A: 6, I: 6, S: 5, P: 7, C: 6, R: 8 }, briefDescription: "Maintaining multiple loving relationships simultaneously.", detailedDescription: "The practice of, or desire for, intimate relationships with more than one partner...", relatedIds: [15, 26, 27, 34], rarity: 'rare', canUnlockArt: true, visualHandleUnlocked: "vis_rel_poly_art" },
    { id: 27, name: "Relationship Anarchy", cardType: "Relationship Style", visualHandle: "vis_rel_ra", primaryElement: "R", elementScores: { A: 6, I: 5, S: 5, P: 6, C: 7, R: 9 }, briefDescription: "Rejects relationship rules/hierarchies, emphasizes autonomy.", detailedDescription: "A philosophy and relationship style that rejects societal norms...", relatedIds: [25, 26], rarity: 'rare', canUnlockArt: false },
    { id: 30, name: "High Protocol D/s", cardType: "Practice/Kink", visualHandle: "vis_kink_protocol", primaryElement: "I", elementScores: { A: 6, I: 8, S: 6, P: 8, C: 9, R: 7 }, briefDescription: "Highly structured power exchange with formal rules/rituals.", detailedDescription: "A style of Dominance and submission characterized by significant structure...", relatedIds: [4, 5, 11, 13, 38], rarity: 'rare', canUnlockArt: true, visualHandleUnlocked: "vis_kink_protocol_art" },
    { id: 41, name: "Erotic Hypnosis / Mind Control", cardType: "Practice/Kink", visualHandle: "vis_kink_hypno", primaryElement: "C", elementScores: { A: 5, I: 7, S: 3, P: 8, C: 9, R: 6 }, briefDescription: "Using hypnotic suggestion or perceived control over thoughts/actions for arousal.", detailedDescription: "Consensual play involving altered states of consciousness, hypnotic suggestion, triggers, or the illusion of one partner controlling the other's mind or actions for erotic purposes.", relatedIds: [14, 4, 5, 11], rarity: 'rare', canUnlockArt: false },
    { id: 42, name: "Transformation Fetish", cardType: "Orientation", visualHandle: "vis_ori_transform", primaryElement: "C", elementScores: { A: 7, I: 4, S: 5, P: 7, C: 8, R: 4 }, briefDescription: "Arousal from the idea or depiction of physical/mental transformation.", detailedDescription: "A fetish centered on the concept of transformation, which can include physical changes (e.g., into animals, objects, different genders), mental changes (e.g., bimbofication, personality alteration), or forced changes within a power dynamic.", relatedIds: [20, 21, 12, 41], rarity: 'rare', canUnlockArt: false },
    { id: 43, name: "Medical Play", cardType: "Practice/Kink", visualHandle: "vis_kink_medical", primaryElement: "C", elementScores: { A: 5, I: 6, S: 7, P: 7, C: 7, R: 6 }, briefDescription: "Role-playing medical scenarios, potentially involving exams or implements.", detailedDescription: "Consensual role-playing involving medical themes, settings, or equipment. Can range from simple doctor/patient scenarios to more clinical interactions involving mock examinations, implements (speculums, needles - potentially real/blunt), restraints, or power dynamics inherent in medical settings.", relatedIds: [13, 9, 17, 4, 5], rarity: 'rare', canUnlockArt: false },
    { id: 44, name: "Edge Play", cardType: "Practice/Kink", visualHandle: "vis_kink_edge", primaryElement: "S", elementScores: { A: 5, I: 6, S: 9, P: 8, C: 5, R: 6 }, briefDescription: "Pushing boundaries of intensity, risk, or sensation close to limits.", detailedDescription: "Activities that intentionally push physical, psychological, or emotional boundaries close to perceived limits. Often involves negotiation, high trust, and managing real or perceived risk (e.g., breath play, knife play, extreme sensation). Requires significant caution and expertise.", relatedIds: [8, 9, 16, 17, 37, 38], rarity: 'rare', canUnlockArt: false },
    { id: 45, name: "Humiliation / Degradation", cardType: "Psychological/Goal", visualHandle: "vis_goal_humil", primaryElement: "P", elementScores: { A: 5, I: 7, S: 4, P: 9, C: 6, R: 6 }, briefDescription: "Deriving pleasure from acts or words intended to be embarrassing or degrading.", detailedDescription: "Consensual play where one partner derives pleasure from performing or receiving acts or words intended to cause embarrassment, shame, or degradation. Can range from light teasing to intense psychological scenarios.", relatedIds: [4, 5, 10, 11, 12, 38], rarity: 'rare', canUnlockArt: false },
    // ... Add maybe 10-20 more concepts across rarity levels ...
];


// --- Utility Maps ---
const elementKeyToName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };
const elementKeyToFullName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };


// --- Questionnaire Data ---
const questionnaireGuided = {
    "Attraction": [ /* ... All Attraction questions ... */ ],
    "Interaction": [ /* ... All Interaction questions ... */ ],
    "Sensory": [ /* ... All Sensory questions ... */ ],
    "Psychological": [ /* ... All Psychological questions ... */ ],
    "Cognitive": [ /* ... All Cognitive questions ... */ ],
    "Relational": [ /* ... All Relational questions ... */ ]
    // Ensure all questions from previous steps are filled in here
};

// --- Reflection Prompts ---
const reflectionPrompts = {
    "Attraction": [
        { id: "pA1", text: "Think about someone or something you found intensely attractive recently. What specific qualities (physical, personality, dynamic) drew you in the most?" },
        { id: "pA2", text: "When has attraction felt confusing or unexpected for you? What did you learn from that experience?" },
        { id: "pA3", text: "Does your level of emotional connection to someone strongly influence your sexual attraction? How so?" },
        // ... more prompts ...
    ],
    "Interaction": [
        { id: "pI1", text: "Describe a time you felt most comfortable in a sexual interaction. Were you leading, following, or collaborating? What made it comfortable?" },
        { id: "pI2", text: "Imagine an ideal sexual encounter. What kind of energy exchange are you looking for (playful, intense, nurturing, commanding, yielding)?" },
        { id: "pI3", text: "How important is verbal communication vs non-verbal cues in your preferred interaction style?" },
        // ... more prompts ...
    ],
    "Sensory": [
        { id: "pS1", text: "What type of physical touch (light, firm, rough, specific texture) feels most arousing or connecting to you, separate from orgasm?" },
        { id: "pS2", text: "Are there any specific sensations (temperature, pressure, pain, specific sounds/smells) that strongly enhance or detract from your arousal?" },
        { id: "pS3", text: "How does your desire for sensory input change depending on your mood or partner?" },
        // ... more prompts ...
    ],
    "Psychological": [
        { id: "pP1", text: "Beyond physical pleasure, what core emotional need (e.g., connection, validation, control, escape) does sexuality most often fulfill for you?" },
        { id: "pP2", text: "Think about a time sex felt psychologically fulfilling. What underlying needs were met?" },
        { id: "pP3", text: "Conversely, when has sex felt psychologically unfulfilling, even if physically pleasurable? What might have been missing?" },
        // ... more prompts ...
    ],
    "Cognitive": [
        { id: "pC1", text: "How much do you rely on fantasy or specific scenarios to become aroused? Are you more 'in your head' or 'in the moment'?" },
        { id: "pC2", text: "Describe a fantasy or scenario (even vaguely) that you find particularly potent. What elements make it work for you?" },
        { id: "pC3", text: "Does the intellectual or psychological aspect of a dynamic (e.g., power plays, witty banter, understanding motivations) contribute significantly to your arousal?" },
        // ... more prompts ...
    ],
    "Relational": [
        { id: "pR1", text: "In what context do you feel most free to express your sexuality (e.g., alone, committed partner, casual encounter, group setting)?" },
        { id: "pR2", text: "How important are explicit agreements, rules, or boundaries regarding exclusivity or openness in your ideal sexual relationships?" },
        { id: "pR3", text: "What level of emotional intimacy do you typically prefer or require in your sexual connections?" },
        // ... more prompts ...
    ]
};

// --- Rituals & Milestones Data ---
// Structure Example (Needs defining based on tracking capabilities)
const dailyRituals = [
    { id: "dr01", description: "Discover 1 new Concept Card today.", reward: { type: "essence", element: "Random", amount: 1 }, track: { action: "discover", count: 1, period: "daily" } },
    { id: "dr02", description: "Add any Concept to your Grimoire.", reward: { type: "essence", element: "All", amount: 0.5 }, track: { action: "addToGrimoire", count: 1, period: "daily" } },
    { id: "dr03", description: "Complete a Reflection Prompt.", reward: { type: "attunement", element: "PromptElement", amount: 0.5 }, track: { action: "completeReflection", count: 1, period: "daily" } },
];

const milestones = [
    { id: "ms01", description: "First Concept Added!", reward: { type: "essence", element: "All", amount: 2 }, track: { state: "discoveredConcepts.size", threshold: 1 } },
    { id: "ms02", description: "Curator I: Added 10 Concepts", reward: { type: "essence", element: "Random", amount: 5 }, track: { state: "discoveredConcepts.size", threshold: 10 } },
    { id: "ms03", description: "First Core Concept Marked", reward: { type: "essence", element: "All", amount: 3 }, track: { state: "coreConcepts.size", threshold: 1 } },
    { id: "ms04", description: "Tapestry Weaver I: Marked 3 Core Concepts", reward: { type: "attunement", element: "All", amount: 1 }, track: { state: "coreConcepts.size", threshold: 3 } },
    { id: "ms05", description: "First Research Conducted", reward: { type: "essence", element: "Random", amount: 3 }, track: { action: "conductResearch", count: 1 } },
    { id: "ms06", description: "Elementalist: Reached Attunement 5 in one Element", reward: { type: "message", text: "You feel a growing affinity!" }, track: { state: "elementAttunement", threshold: 5, condition: "any" } },
    // ... more milestones ...
];
