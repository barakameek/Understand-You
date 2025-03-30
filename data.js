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
    } // No comma after the last element's closing brace
}; // Semicolon to end the const elementDetails statement


// --- Concepts Data (Card Structure) ---
const concepts = [
    {
      id: 1, name: "Vanilla Sex", cardType: "Practice/Kink", visualHandle: "icon_practice_default", primaryElement: "S",
      elementScores: { A: 5, I: 5, S: 3, P: 4, C: 3, R: 4 },
      briefDescription: "Conventional sexual activity focusing on common interactions without specific kink elements.",
      detailedDescription: "Refers to sexual expression generally considered within conventional norms, often emphasizing kissing, touching, and intercourse without incorporating BDSM, specific fetishes, or strong power dynamics. Focus tends to be on mutual pleasure and connection within familiar boundaries.",
      relatedIds: [2, 3]
    },
    {
      id: 2, name: "Sensual Touch", cardType: "Practice/Kink", visualHandle: "icon_practice_touch", primaryElement: "S",
      elementScores: { A: 4, I: 4, S: 4, P: 5, C: 2, R: 4 },
      briefDescription: "Emphasizing gentle, affectionate, and pleasurable touch over intensity.",
      detailedDescription: "Focus on gentle, affectionate, and pleasurable touch, emphasizing connection and warmth over intensity. Prioritizes comfort and closeness.",
      relatedIds: [1, 15, 3]
    },
    {
      id: 3, name: "Passionate Kissing", cardType: "Practice/Kink", visualHandle: "icon_practice_kiss", primaryElement: "S",
      elementScores: { A: 6, I: 5, S: 5, P: 6, C: 3, R: 5 },
      briefDescription: "Intense and emotionally charged kissing as a primary form of connection.",
      detailedDescription: "Intense and emotionally charged kissing as a primary form of connection and arousal. Can range from tender to highly passionate.",
      relatedIds: [1, 2, 15]
    },
    {
      id: 4, name: "Dominance (Psychological)", cardType: "Identity/Role", visualHandle: "icon_role_dominant", primaryElement: "I",
      elementScores: { A: 6, I: 9, S: 5, P: 8, C: 7, R: 6 },
      briefDescription: "Taking psychological control, guiding interactions, and potentially commanding a partner.",
      detailedDescription: "Focuses on the mental and emotional aspects of control within a dynamic. This involves asserting authority, making decisions for a partner, setting rules, and potentially using psychological tactics or presence to establish dominance, often independent of specific physical acts.",
      relatedIds: [5, 6, 10, 11]
    },
    {
      id: 5, name: "Submission (Psychological)", cardType: "Identity/Role", visualHandle: "icon_role_submissive", primaryElement: "I",
      elementScores: { A: 6, I: 1, S: 5, P: 8, C: 5, R: 6 },
      briefDescription: "Yielding psychological control, following directions, finding fulfillment in obeying.",
      detailedDescription: "Focuses on the mental and emotional aspects of yielding control. This involves willingly following directions, accepting decisions made by a partner, finding pleasure or fulfillment in serving or obeying, and embracing a mindset of surrender.",
      relatedIds: [4, 6, 10, 12, 17]
    },
     {
      id: 6, name: "Switching", cardType: "Identity/Role", visualHandle: "icon_role_switch", primaryElement: "I",
      elementScores: { A: 6, I: 5, S: 6, P: 7, C: 6, R: 6 },
      briefDescription: "Enjoying and moving between both dominant and submissive roles.",
      detailedDescription: "Describes the ability and desire to fluidly shift between dominant and submissive roles, or leading and following dynamics, depending on the partner, mood, or situation. Values flexibility and range in power expression.",
      relatedIds: [4, 5]
    },
    {
      id: 7, name: "Impact Play (Light)", cardType: "Practice/Kink", visualHandle: "icon_kink_impact_light", primaryElement: "S",
      elementScores: { A: 5, I: 6, S: 6, P: 5, C: 4, R: 5 },
      briefDescription: "Using hands or light implements for pleasurable stinging sensations.",
      detailedDescription: "Involves activities like spanking, slapping, or using paddles/floggers lightly to create sensations ranging from stinging warmth to mild pain, often focused on psychological effect or enhancing pleasure.",
      relatedIds: [8, 9, 4, 5]
    },
    {
      id: 8, name: "Impact Play (Heavy)", cardType: "Practice/Kink", visualHandle: "icon_kink_impact_heavy", primaryElement: "S",
      elementScores: { A: 5, I: 7, S: 9, P: 7, C: 4, R: 6 },
      briefDescription: "Using canes, whips, or heavy implements for intense sensations and potential pain.",
      detailedDescription: "Utilizes implements like canes, whips, heavy paddles, or fists to deliver strong, potentially painful impact. Focus is often on intense physical sensation, endurance, catharsis, or marking the body.",
      relatedIds: [7, 9, 4, 5]
    },
    {
      id: 9, name: "Pain Play (Non-Impact)", cardType: "Practice/Kink", visualHandle: "icon_kink_pain", primaryElement: "S",
      elementScores: { A: 4, I: 6, S: 8, P: 7, C: 5, R: 6 },
      briefDescription: "Incorporating pinching, biting, scratching, wax, or needles for intense sensation.",
      detailedDescription: "Focuses on creating intense sensations through means other than direct impact. Examples include pinching, biting, scratching, hot wax play, needle play, electricity, or intense pressure points.",
      relatedIds: [7, 8, 16, 17]
    },
    {
      id: 10, name: "Service Submission", cardType: "Psychological/Goal", visualHandle: "icon_goal_service", primaryElement: "I",
      elementScores: { A: 5, I: 2, S: 3, P: 7, C: 4, R: 5 },
      briefDescription: "Finding fulfillment in performing tasks or acts of devotion for a partner.",
      detailedDescription: "A form of submission focused on expressing devotion and yielding control through acts of service, such as performing chores, attending to a partner's needs (like foot rubs or preparing drinks), or following specific protocols of servitude.",
      relatedIds: [5, 4, 11]
    },
    {
      id: 11, name: "Command/Control Dynamics", cardType: "Psychological/Goal", visualHandle: "icon_goal_control", primaryElement: "I",
      elementScores: { A: 6, I: 9, S: 5, P: 8, C: 8, R: 6 },
      briefDescription: "Structured dynamic involving explicit orders given and obeyed, often with protocol.",
      detailedDescription: "A power dynamic characterized by one partner giving clear commands or instructions and the other obeying. Often involves specific rules, protocols, or rituals that structure the interaction and reinforce the power difference.",
      relatedIds: [4, 5, 10, 30]
    },
    {
      id: 12, name: "Objectification", cardType: "Psychological/Goal", visualHandle: "icon_goal_objectification", primaryElement: "P",
      elementScores: { A: 7, I: 4, S: 6, P: 8, C: 6, R: 5 },
      briefDescription: "Treating or being treated as a sexual object, focusing on the body or parts.",
      detailedDescription: "Involves focusing on a person's body or specific body parts as the primary source of arousal, potentially reducing their identity to that of a sexual object. Can be consensual and desired within certain dynamics, or harmful if non-consensual.",
      relatedIds: [4, 5, 20, 18, 19] // Added Exhibitionism/Voyeurism
    },
    {
      id: 13, name: "Role-Playing (Scenario)", cardType: "Practice/Kink", visualHandle: "icon_kink_roleplay", primaryElement: "C",
      elementScores: { A: 6, I: 6, S: 5, P: 6, C: 8, R: 6 },
      briefDescription: "Adopting specific characters or personas to create a narrative context for sex.",
      detailedDescription: "Involves adopting specific character archetypes (e.g., doctor/patient, teacher/student, captor/captive) or personas to create a fictional narrative or scenario that shapes the sexual interaction.",
      relatedIds: [14, 30, 21] // Added Uniform Fetish
    },
    {
      id: 14, name: "Fantasy Immersion", cardType: "Cognitive", visualHandle: "icon_cognitive_fantasy", primaryElement: "C", // Renamed Type
      elementScores: { A: 5, I: 3, S: 4, P: 7, C: 9, R: 3 },
      briefDescription: "Focusing heavily on internal mental narratives or imagined scenarios during sex.",
      detailedDescription: "Prioritizes internal mental experience over external reality during sexual activity. Arousal is primarily driven by detailed fantasies, imagined partners or scenarios, or elaborate internal narratives.",
      relatedIds: [13, 29] // Added Demisexuality (often relies on internal bond)
    },
    {
      id: 15, name: "Deep Emotional Intimacy", cardType: "Psychological/Goal", visualHandle: "icon_goal_intimacy", primaryElement: "P",
      elementScores: { A: 7, I: 5, S: 4, P: 9, C: 5, R: 7 },
      briefDescription: "Seeking profound connection, vulnerability, and emotional bonding through sex.",
      detailedDescription: "Places a high value on using sexual expression as a way to build and deepen emotional connection, trust, vulnerability, and mutual understanding with a partner. The psychological bonding is paramount.",
      relatedIds: [2, 3, 22, 29] // Added Monogamy, Demisexuality
    },
     {
      id: 16, name: "Rope Bondage (Shibari/Kinbaku)", cardType: "Practice/Kink", visualHandle: "icon_kink_rope", primaryElement: "S",
      elementScores: { A: 6, I: 7, S: 8, P: 7, C: 6, R: 6 },
      briefDescription: "Using rope for aesthetic patterns, restriction, and creating specific sensations.",
      detailedDescription: "An art form and practice involving tying a partner with rope. Can focus on aesthetic beauty (Shibari), physical restriction, creating specific pressure points, nerve stimulation, or preparing for suspension.",
      relatedIds: [9, 17, 4, 5]
    },
    {
      id: 17, name: "Restriction/Helplessness", cardType: "Psychological/Goal", visualHandle: "icon_goal_restriction", primaryElement: "S", // Sensory is also key
      elementScores: { A: 5, I: 3, S: 7, P: 8, C: 5, R: 5 },
      briefDescription: "Finding arousal in being physically restrained and the associated psychological surrender.",
      detailedDescription: "Deriving arousal from the sensation of being physically restrained (via ropes, cuffs, etc.) and the resulting feeling of helplessness or psychological surrender to a partner or situation.",
      relatedIds: [16, 5, 9]
    },
     {
      id: 18, name: "Exhibitionism", cardType: "Identity/Role", visualHandle: "icon_role_exhibitionist", primaryElement: "I",
      elementScores: { A: 6, I: 7, S: 5, P: 7, C: 6, R: 5 },
      briefDescription: "Deriving pleasure from being watched during sexual activity or exposing oneself.",
      detailedDescription: "Finding sexual arousal and pleasure in the act of being watched by others while engaging in sexual activity, being nude, or deliberately exposing oneself in potentially risky situations.",
      relatedIds: [19, 12] // Added Voyeurism, Objectification
    },
    {
      id: 19, name: "Voyeurism", cardType: "Identity/Role", visualHandle: "icon_role_voyeur", primaryElement: "A", // Attraction to watching
      elementScores: { A: 7, I: 2, S: 3, P: 6, C: 5, R: 3 },
      briefDescription: "Deriving pleasure from watching others engage in sexual activity, often secretly.",
      detailedDescription: "Finding sexual arousal and pleasure primarily from the act of watching others engage in sexual activity or be undressed, often without their knowledge (though consensual voyeurism also exists).",
      relatedIds: [18, 12] // Added Exhibitionism, Objectification
    },
    {
      id: 20, name: "Latex/Material Fetish", cardType: "Orientation", visualHandle: "icon_orientation_material", primaryElement: "A", // Changed type
      elementScores: { A: 9, I: 5, S: 8, P: 6, C: 5, R: 4 },
      briefDescription: "Strong attraction focused on the look, feel, sound, or smell of specific materials.",
      detailedDescription: "A specific fetish where sexual arousal is strongly triggered by the sight, feel, sound, or smell of particular materials like latex, rubber, leather, PVC, spandex, silk, fur, etc. Often involves wearing or seeing others wear garments made of these materials.",
      relatedIds: [12, 21] // Added Objectification, Uniform/Clothing
    },
    {
      id: 21, name: "Uniform/Clothing Fetish", cardType: "Orientation", visualHandle: "icon_orientation_clothing", primaryElement: "A", // Changed type
      elementScores: { A: 8, I: 6, S: 4, P: 6, C: 6, R: 5 },
      briefDescription: "Specific types of clothing (uniforms, lingerie, costumes) are a primary trigger for arousal.",
      detailedDescription: "A fetish where sexual arousal is significantly triggered by specific types of clothing, such as uniforms (military, nurse, school), lingerie, costumes, suits, or specific historical/cultural attire. Can overlap with role-playing.",
      relatedIds: [13, 20, 12] // Added Role-Playing, Material Fetish, Objectification
    },
    {
      id: 22, name: "Monogamy", cardType: "Relationship Style", visualHandle: "icon_relation_mono", primaryElement: "R",
      elementScores: { A: 5, I: 5, S: 5, P: 6, C: 5, R: 2 },
      briefDescription: "Preference for or practice of having only one sexual/romantic partner at a time.",
      detailedDescription: "The practice or preference for having only one sexual and/or romantic partner simultaneously. Often involves expectations of exclusivity and deep pair-bonding.",
      relatedIds: [23, 15] // Added Serial Monogamy, Deep Intimacy
    },
    {
      id: 23, name: "Serial Monogamy", cardType: "Relationship Style", visualHandle: "icon_relation_serialmono", primaryElement: "R",
      elementScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 3 },
      briefDescription: "Engaging in a sequence of exclusive relationships over time.",
      detailedDescription: "The pattern of engaging in sequential monogamous relationships – having only one partner at a time, but moving from one exclusive relationship to another over one's lifetime.",
      relatedIds: [22, 24] // Added Monogamy, Casual Sex
    },
    {
      id: 24, name: "Casual Sex / Hookups", cardType: "Relationship Style", visualHandle: "icon_relation_casual", primaryElement: "R",
      elementScores: { A: 6, I: 4, S: 6, P: 3, C: 3, R: 5 },
      briefDescription: "Engaging in sexual activity without expectation of commitment or deep emotional intimacy.",
      detailedDescription: "Sexual encounters that occur outside of a committed romantic relationship, typically without significant emotional intimacy or long-term expectations. Can range from one-night stands to 'friends with benefits' arrangements.",
      relatedIds: [23, 26] // Added Serial Monogamy, Open Relationship
    },
    {
      id: 25, name: "Polyamory", cardType: "Relationship Style", visualHandle: "icon_relation_poly", primaryElement: "R", // Simplified name
      elementScores: { A: 6, I: 6, S: 5, P: 7, C: 6, R: 8 }, // Kept hierarchical scores as base
      briefDescription: "Maintaining multiple loving and intimate relationships simultaneously with full knowledge.",
      detailedDescription: "The practice of, or desire for, intimate relationships with more than one partner, with the informed consent of all partners involved. Emphasizes emotional connection alongside sexual relationships. Can be hierarchical or non-hierarchical.",
      relatedIds: [15, 26, 27] // Added Intimacy, Open Relationship, RA
    },
    {
      id: 26, name: "Open Relationship", cardType: "Relationship Style", visualHandle: "icon_relation_open", primaryElement: "R",
      elementScores: { A: 6, I: 5, S: 6, P: 5, C: 5, R: 7 },
      briefDescription: "A committed couple agrees one or both partners can have sexual relationships with others.",
      detailedDescription: "A relationship structure, typically involving a primary couple, where partners agree to allow outside sexual relationships, often with rules or boundaries intended to protect the primary connection. Emotional connections with others may or may not be encouraged.",
      relatedIds: [24, 25, 27] // Added Casual, Poly, RA
    },
    {
      id: 27, name: "Relationship Anarchy", cardType: "Relationship Style", visualHandle: "icon_relation_ra", primaryElement: "R",
      elementScores: { A: 6, I: 5, S: 5, P: 6, C: 7, R: 9 },
      briefDescription: "Rejects traditional relationship rules/hierarchies, emphasizing autonomy and customization.",
      detailedDescription: "A philosophy and relationship style that rejects societal norms and predefined rules for relationships. Each connection is defined individually by the people involved based on their needs and desires, without inherent hierarchy or prioritization based on relationship type (e.g., romantic vs. platonic).",
      relatedIds: [25, 26] // Added Poly, Open
    },
    {
      id: 28, name: "Asexuality", cardType: "Orientation", visualHandle: "icon_orientation_ace", primaryElement: "A",
      elementScores: { A: 0, I: 3, S: 2, P: 3, C: 3, R: 4 },
      briefDescription: "Experiencing little or no sexual attraction towards others.",
      detailedDescription: "Characterized by a persistent lack of sexual attraction towards any gender. Asexual individuals may still experience romantic attraction (homoromantic, biromantic, aromantic, etc.), desire emotional intimacy, or engage in sexual activity for various reasons other than innate attraction.",
      relatedIds: [29] // Added Demisexuality
    },
     {
      id: 29, name: "Demisexuality", cardType: "Orientation", visualHandle: "icon_orientation_demi", primaryElement: "A",
      elementScores: { A: 3, I: 4, S: 4, P: 8, C: 5, R: 5 },
      briefDescription: "Experiencing sexual attraction only after forming a strong emotional bond.",
      detailedDescription: "A sexual orientation where an individual only develops sexual attraction to someone after they have formed a significant emotional connection. The bond often precedes the attraction.",
      relatedIds: [15, 28, 22] // Added Intimacy, Asexuality, Monogamy
    },
    {
      id: 30, name: "High Protocol D/s", cardType: "Practice/Kink", visualHandle: "icon_kink_protocol", primaryElement: "I", // Also Cognitive
      elementScores: { A: 6, I: 8, S: 6, P: 8, C: 9, R: 7 },
      briefDescription: "Highly structured power exchange involving formal titles, rules, rituals, and scenes.",
      detailedDescription: "A style of Dominance and submission characterized by significant structure, formality, and adherence to pre-agreed rules and rituals. Often involves specific titles (Sir, Master, slave, pet), detailed etiquette, planned scenes, and potentially punishments or rewards for behavior.",
      relatedIds: [4, 5, 11, 13] // Added Dom, Sub, Command/Control, Role-Playing
    }
]; // Semicolon ending concepts array definition

// --- Utility Maps ---
const elementKeyToName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };

// --- Questionnaire Data ---
// Using qId, type, text, options (value, points), scoreWeight, etc.
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

