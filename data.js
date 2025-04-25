
// --- START OF FILE data.js (Corrected - v4.5 + XP/Leveling v1.0) ---
// Core Game Data

console.log("data.js loading... (Corrected - v4.5 + XP/Leveling v1.0)");

// --- Element Definitions (Defined ONCE at the top) ---
const elementDetails = {
    "Attraction": { name: "Attraction Focus: The Spark Plug", coreQuestion: "Who/what flips *your* switch?", coreConcept: "Your 'Desire Compass,' reacting to energies, vibes, situations, aesthetics, ideas. More than gender!", elaboration: "Covers Asexuality, Demisexuality, Sapiosexuality, fetishes, power dynamics, aesthetics. What points *your* needle?", scoreInterpretations: { "Very Low": "Asexual vibes resonate; attraction rare or absent.", "Low": "Resonant frequency/context needed; Demisexual lean; responds rather than initiates.", "Moderate": "Versatile; resonates with familiar energies, pan-curious, needs some connection.", "High": "Strong pull towards specific 'true norths' - types, dynamics, objects, situations.", "Very High": "Laser focus; highly specific triggers, essential ingredients, potent fetishes." }, examples: "Asexuality, Demisexuality, Straight, Gay, Bi, Pan, Sapiosexuals, Fetishes (Latex, Feet), attraction to body types, D/s roles, Androgyny.", personaConnection: "Defines the 'who', 'what', 'when', or 'vibe' that first captures attention." },
    "Interaction": { name: "Interaction Leaning: The Role Compass", coreQuestion: "Dominant, Submissive, or Switch?", coreConcept: "Maps your *leaning* within power dynamics: taking charge (Dominant), yielding control (Submissive), or moving between both (Switch).", elaboration: "Direction, not intensity (that's RoleFocus). High=Dominant, Low=Submissive, Middle=Switch/Versatile. Includes Top/Bottom.", scoreInterpretations: { "Very Low": "Strong Submissive Leaning.", "Low": "Moderate Submissive Leaning.", "Moderate": "Switch/Versatile Leaning.", "High": "Moderate Dominant Leaning.", "Very High": "Strong Dominant Leaning." }, examples: "D/s roles (Dom/Sub/Switch), Top/Bottom/Versatile roles, Caregiver/Little guidance/dependence aspects.", personaConnection: "Defines your directional leaning within power dynamics." },
    "Sensory": { name: "Sensory Emphasis: The Feeling Finder", coreQuestion: "What specific physical sensations make you sigh 'Yes!'?", coreConcept: "Your 'Sensitivity Dial,' measuring how crucial *physical feeling* is. Touch, temperature, texture, pressure, sight, sound, smell.", elaboration: "Light touch, firm grip, impact, wax/ice, silk/rope, squeezes, vibrations. Includes pleasure/pain spectrum (BDSM).", scoreInterpretations: { "Very Low": "Feelings are background noise; connects through other channels.", "Low": "Gentle currents preferred; comfort paramount; intense sensations avoided.", "Moderate": "Appreciates classics, varied menu; curious about mild intensity.", "High": "Actively seeks specific, potent, unique sensations; deliberate impact, temps, textures, light bondage.", "Very High": "INTENSITY IS THE LANGUAGE; craves strong, extreme sensations; heavy BDSM, constriction, overload/deprivation." }, examples: "Massage, kissing, cuddles, BDSM impact, wax/ice play, Shibari, blindfolds, e-stim, specific fabrics.", personaConnection: "Defines how your body deciphers pleasure, pain, intensity, sensation." },
    "Psychological": { name: "Psychological Driver: The Heart's Quest", coreQuestion: "*Why* intimacy? What deep need does it satisfy?", coreConcept: "The resonant 'why' *behind* encounters: emotional longings, mental explorations, soul quests. What inner landscape does it illuminate?", elaboration: "Deeper purpose: Connection (trust, vulnerability), Power exploration (control, surrender, service), Self-expression (creativity, validation, being seen), State shifting (escape, catharsis, release), Comfort/Safety.", scoreInterpretations: { "Very Low": "Primarily physical release/fun; deeper needs met elsewhere.", "Low": "Emotional side provides pleasant harmony, not main melody; fun, stress relief, light connection.", "Moderate": "Balanced ecosystem; body/mind intertwine; connection, stress relief, joy, affirmation.", "High": "Key portal for vital inner needs; seek specific dynamics for vulnerability, power exchange, validation, release.", "Very High": "Hitting the core need IS the point; incomplete without total surrender/control/vulnerability/escape." }, examples: "Sex for stress relief, building emotional bonds, BDSM for catharsis/release, seeking validation, chasing flow states.", personaConnection: "Defines the emotional 'why', motivations, core needs driving sexual expression." },
    "Cognitive": { name: "Cognitive Engagement: The Mind Palace", coreQuestion: "How much action happens in your headspace?", coreConcept: "Measures how much your *mind* directs, shapes, participates. Pure presence vs. vivid fantasies, scenarios, analysis, banter, abstract ideas.", elaboration: "Full spectrum: Grounded in sensation (low) to inhabiting fantasy worlds, playing roles, strategic mind games, loving clever language, turned on by the *concept* (high).", scoreInterpretations: { "Very Low": "Headspace clear, focused on now; immersion in feeling/emotion; fantasy feels distracting.", "Low": "Mostly grounded in present; fleeting images okay, but physical/emotional stars.", "Moderate": "Synergy Mind/Body; enjoys presence + mental spice (light role-play, dirty talk, intrigue).", "High": "Brain major erogenous zone; detailed fantasies, specific role-play, mental power dynamics, banter crucial.", "Very High": "Mind Palace primary theater; arousal depends on intricate scenarios, fantasy worlds, psych play, the *idea*." }, examples: "Mindful touch (Low), descriptive dirty talk (Moderate), D/s scenes with rules/roles (High/VH), LARP (High/VH), writing/reading erotica (High/VH), psychological manipulation play (VH).", personaConnection: "Defines how much thoughts, imagination, intellect, narrative drive the action." },
    "Relational": { name: "Relational Context: The Constellation", coreQuestion: "Your ideal celestial setup? Partners, commitment, orbits?", coreConcept: "Preferred 'social map' for sex/intimacy/relationships. Number of partners? Commitment level? Solo, dyad, cluster? Where your intimate self thrives.", elaboration: "Full range: Solo (masturbation), Monogamy, Ethical Non-Monogamy (Polyamory, Open Relationships), Group encounters, Anonymous sparks. Finding authentic structure.", scoreInterpretations: { "Very Low": "Solo or 'Just Us Two'; focused intimacy; prefers deep dyadic bond.", "Low": "Team Monogamy; prefers/seeks exclusive, committed partnerships.", "Moderate": "Flexible orbits; comfy in duo but open (swinging, exploring); values bonds without strict exclusivity.", "High": "More stars, brighter sky; prefers/practices multiple partners (Open, Poly). Communication vital.", "Very High": "Charting own cosmos; Relationship Anarchy, non-hierarchical Poly, group dynamics, diverse commitment levels." }, examples: "Masturbation, Serial Monogamy, Lifelong Monogamy, FWB, Open Relationships, Swinging, Polyamory (Triads, Networks), Solo Polyamory, Relationship Anarchy, Group Sex, Anonymous encounters.", personaConnection: "Defines your ideal 'relationship constellation' – structure, partners, connections where you feel most authentic." },
    "RoleFocus": { name: "Role Focus: The Intensity Dial", coreQuestion: "How important are defined roles/power dynamics (D/s/W) to satisfaction?", coreConcept: "Measures *intensity* or *salience* of power dynamics/role-play. How central is D/s/W vs. sensation or emotion?", elaboration: "Low = less important/egalitarian. Moderate = enjoyment/significance. High = key component. Very High = essential core. Works with Interaction Leaning.", scoreInterpretations: { "Very Low": "Roles? Meh. Prefers egalitarian connections.", "Low": "Light touch. Roles occasional spice, not needed.", "Moderate": "Engaged. Finds roles/dynamics interesting, often incorporates.", "High": "Central Pillar. Playing specific role (D/s/W) key component.", "Very High": "Essential Core. Defined roles/dynamics *are* the point; feels incomplete without." }, examples: "Vanilla/equal partnerships (Low). Occasional D/s scenes (Moderate). Feeling most authentic in D/s/W role (High). Requiring 24/7 TPE (VH).", personaConnection: "Defines the *importance* and *intensity* of power dynamics/roles." }
};

// --- Utility Maps & Arrays (Defined ONCE at the top) ---
const elementKeyToFullName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational", RF: "RoleFocus" };
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"];
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational", "RoleFocus"];

// --- Shelf Definitions (Defined ONCE at the top) ---
const grimoireShelves = [
    { id: "uncategorized", name: "Unsorted Discoveries", description: "Freshly unearthed Concepts land here, shimmering with raw potential like unrefined magical ore. Drag them onto other shelves to categorize them, integrate their energy, and weave them into your Grimoire's evolving story!" },
    { id: "wantToTry", name: "Curious Experiments", description: "Intriguing Concepts whispering tantalizing possibilities, sparking curiosity like nascent spells. What experiments in thought, fantasy, or careful practice might these inspire? Mark your intentions here." },
    { id: "liked", name: "Resonant Echoes", description: "Concepts you've explored and found to harmonize beautifully with your being, like finding a frequency that makes your soul sing. These echoes feel good, affirming, or simply joyful!" },
    { id: "dislikedLimit", name: "Boundaries Drawn", description: "Concepts that strike a discordant note, feel deeply uncomfortable, violate your ethics, or clearly mark the edge of your current map ('Here be dragons!'). Respecting these boundaries is wisdom and self-care." },
    { id: "coreIdentity", name: "Pillars of Self", description: "Concepts feeling absolutely fundamental, like load-bearing pillars in the architecture of your current persona and desires. These feel deeply, undeniably like *you*, shaping how you interact with the world." }
];

// --- Concepts Data (Full Array - Merged and Corrected) ---
const concepts = [
    // --- Concepts 1-40 ---
    {
        id: 1, name: "Vanilla Sex", cardType: "Practice/Kink", visualHandle: "common_vanilla.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 5, S: 3, P: 4, C: 3, R: 4, RF: 1 },
        briefDescription: "The 'classic hits' repertoire of intimacy.",
        detailedDescription: "Often referring to widely accepted forms of sexual expression, commonly centered around penetrative intercourse (vaginal or anal), kissing, mutual masturbation, and oral sex, typically within a familiar emotional context like romance or affection. It's the comfortable baseline for many, the 'common tongue' of intimacy. However, 'vanilla' doesn't inherently mean boring or lacking depth; passionate, connected vanilla sex can be incredibly fulfilling if it genuinely resonates!",
        relatedIds: [2, 3, 33, 67, 71], rarity: 'common', keywords: ['Conventional', 'Physical', 'Simple', 'Mainstream', 'Comfortable', 'Familiar', 'Baseline'],
        lore: [ { level: 1, text: "Foundation Stone: Often the shared starting point, the common ground language learned before exploring more personalized dialects of desire." }, { level: 2, text: "Comfort's Embrace: Its widespread familiarity can offer profound comfort, predictability, and a reassuring sense of shared 'normalcy' in a complex intimate world." }, { level: 3, text: "Hidden Depths & Nuances: Even within 'vanilla' practices, subtle shifts in presence [P], communication [I], sensory focus [S], or emotional intent can transform the experience from routine to sublime ritual." } ],
        microStory: "The quiet comfort of familiar rhythms, skin on skin, a shared sigh. Sometimes, the simplest spells are the most grounding.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 2, name: "Sensual Touch", cardType: "Practice/Kink", visualHandle: "common_sensual_touch.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 4, S: 4, P: 5, C: 2, R: 4, RF: 2 },
        briefDescription: "Gentle, connected touch.",
        detailedDescription: "Slow down and *feel*! Focusing on gentle, deliberate, and mindful touch, often without an immediate goal other than connection, presence, and shared sensation. Can build intimacy, reduce stress, and enhance body awareness.",
        relatedIds: [1, 15, 31, 3, 80, 102, 48], rarity: 'common', keywords: ['Gentle', 'Affection', 'Connection', 'Sensation', 'Comfort', 'Slow', 'Mindful'],
        lore: [ { level: 1, text: "Whispers on Skin: Communicates care, presence, and appreciation beyond words." }, { level: 2, text: "Mindful Moment: Focusing purely on the sensation of touch can be a powerful grounding technique and heighten sensitivity." }, { level: 3, text: "Foundation of Trust: Gentle, attuned touch builds a base of safety [P] crucial for exploring more intense dynamics later." } ],
        microStory: "Fingertips trace constellations on a waiting shoulder blade. No destination, just the quiet magic of being truly present, here, now.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 3, name: "Passionate Kissing", cardType: "Practice/Kink", visualHandle: "common_kissing.jpg", primaryElement: "S",
        elementScores: { A: 6, I: 5, S: 5, P: 6, C: 3, R: 5, RF: 3 },
        briefDescription: "Kissing like you mean it.",
        detailedDescription: "More than just a peck! Involves deeper engagement, often including tongue, variations in pressure, and exploration. Can convey urgency, deep desire, or romantic intensity, blending sensation [S] with emotional connection [P].",
        relatedIds: [1, 2, 15, 47, 66, 85], rarity: 'common', keywords: ['Intensity', 'Emotion', 'Connection', 'Sensation', 'Intimacy', 'Kissing', 'Oral'],
        lore: [ { level: 1, text: "The First Spark: Often the initial gateway to deeper physical and emotional intimacy, setting the energetic tone." }, { level: 2, text: "Dialogue of Lips: A passionate kiss can communicate desire, urgency, tenderness, or even dominance [I] without a single word." }, { level: 3, text: "Taste of Chemistry: The close exchange of saliva, breath, and pheromones creates a unique sensory [S] feedback loop." } ],
        microStory: "The world narrowed to the taste of chapstick and shared breath, a silent conversation where urgency met tenderness. Yes.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 4, name: "Dominance (Psychological)", cardType: "Identity/Role", visualHandle: "uncommon_dom_art.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 9, S: 5, P: 8, C: 7, R: 6, RF: 9 },
        briefDescription: "Leading with your mind & presence.",
        detailedDescription: "Being the 'boss' energetically or mentally. This involves taking charge of the interaction's flow, setting the emotional tone, potentially giving instructions [11], making decisions for a partner, or guiding their experience through presence and intent. It's about embodying authority or leadership within the dynamic.",
        relatedIds: [5, 6, 11, 30, 38, 81, 89, 90, 100, 104, 109, 123, 131, 137, 139], rarity: 'uncommon', keywords: ['Control', 'Power', 'Leading', 'Psychological', 'Rules', 'Structure', 'Dominance', 'Authority', 'Top', 'Presence'],
        lore: [ { level: 1, text: "Fragment: The mind, a powerful instrument... to play upon or be played. Presence shapes reality." }, { level: 2, text: "Alchemist's Query: Is true dominance about unbreakable will, unwavering presence, or deep understanding?" }, { level: 3, text: "The Weight of Responsibility: Ethical dominance requires care, awareness, and honoring the trust given." } ],
        microStory: "A quiet command, a steady gaze that held the room still. No force needed, just the undeniable gravity of intent. They yielded.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 5, name: "Submission (Psychological)", cardType: "Identity/Role", visualHandle: "uncommon_sub_art.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 1, S: 5, P: 8, C: 5, R: 6, RF: 9 },
        briefDescription: "Finding freedom in yielding.",
        detailedDescription: "Finding joy, release, or fulfillment in willingly handing over control, mentally or energetically. Can involve following directions [11], serving [10], trusting another's decisions, focusing on receiving, or simply enjoying the feeling of letting go of responsibility and power.",
        relatedIds: [4, 6, 17, 10, 12, 37, 39, 58, 61, 63, 87, 91, 98, 99, 109, 119, 123, 132], rarity: 'uncommon', keywords: ['Surrender', 'Power Exchange', 'Following', 'Psychological', 'Obedience', 'Trust', 'Vulnerability', 'Submission', 'Yielding', 'Bottom', 'Receiving'],
        lore: [ { level: 1, text: "Reflection: In conscious yielding, sometimes profound strength, focus, or liberation is found." }, { level: 2, text: "Observation: Trust [15] is the essential currency here. It must be earned and maintained." }, { level: 3, text: "Active Choice, Not Weakness: Psychological submission is an active, courageous choice to explore vulnerability." } ],
        microStory: "The delicious exhale of letting go. No decisions needed, just trust and the quiet hum of following. Freedom in surrender.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 6, name: "Switching", cardType: "Identity/Role", visualHandle: "uncommon_switch.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 5, S: 6, P: 7, C: 6, R: 6, RF: 8 },
        briefDescription: "Playing both sides of the power coin.",
        detailedDescription: "Why choose? Switches delight in the fluidity of power, comfortably embodying *both* Dominant [4] and submissive [5] energies or roles, often depending on the partner, mood, or specific scene. Enjoys the versatility and understanding gained from experiencing both perspectives.",
        relatedIds: [4, 5, 89], rarity: 'uncommon', keywords: ['Fluidity', 'Power Exchange', 'Interaction', 'Versatility', 'Role', 'Switch', 'Adaptable', 'Dominant', 'Submissive', 'Top', 'Bottom'],
        lore: [ { level: 1, text: "Maxim: 'Know both sides of the coin to understand its true weight and value.'" }, { level: 2, text: "Dynamic Note: The *shift* itself can be a source of erotic energy, a playful disruption of expectations." }, { level: 3, text: "Requires Communication: Switching often necessitates clear communication about desires and intentions." } ],
        microStory: "One moment commanding the dance, the next yielding to its rhythm. The delightful vertigo of changing perspective mid-spin!",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 7, name: "Impact Play (Light)", cardType: "Practice/Kink", visualHandle: "uncommon_impact_light.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 6, S: 6, P: 5, C: 4, R: 5, RF: 6 },
        briefDescription: "Playful taps and swats.",
        detailedDescription: "Exploring impact with less intensity. Think playful spanking (hand, light paddle), gentle slapping, or using softer implements. Focus is often on rhythmic sensation [S], establishing control [I], playful teasing [38], or introducing impact safely.",
        relatedIds: [8, 9, 4, 5, 40, 57, 93, 96, 97, 139], rarity: 'uncommon', keywords: ['Impact', 'Sensation', 'Physical', 'Playful', 'Rhythm', 'Spanking', 'Slapping', 'Light Impact', 'Teasing'],
        lore: [ { level: 1, text: "Sensory Note: Sometimes a light sting is just the wake-up call the skin, or the dynamic, needs." }, { level: 2, text: "Rhythm Focus: Beyond sensation, the *cadence* of light impact can be hypnotic, grounding, or playfully punitive." }, { level: 3, text: "Gateway to Intensity: Often serves as an entry point for exploring heavier impact [8] or pain play [9]." } ],
        microStory: "The satisfying *smack* of hand on thigh, more punctuation than punishment. A playful sting that brought focus, a shared giggle.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 8, name: "Impact Play (Heavy)", cardType: "Practice/Kink", visualHandle: "rare_impact_heavy.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 7, S: 9, P: 7, C: 4, R: 6, RF: 8 },
        briefDescription: "Intense impact, feeling the oomph.",
        detailedDescription: "Turning up the volume! Using tools like canes, whips, heavy paddles, or even fists for strong, often painful but desired sensations [S]. Can be about testing limits [P], leaving marks [97], intense power dynamics [I], or catharsis.",
        relatedIds: [7, 9, 4, 5, 44, 97, 110, 128, 135, 138, 139], rarity: 'rare', uniquePromptId: "rP08", keywords: ['Impact', 'Pain Play', 'Intensity', 'Sensation', 'Endurance', 'Marking', 'Control', 'BDSM', 'Whip', 'Cane', 'Paddle', 'Heavy Impact'],
        lore: [ { level: 1, text: "Alchemist's Journal: 'The resonance of heavy impact lingers... Is it the echo of pain, or clearing stagnant energy?'" }, { level: 2, text: "Scrawled Note: 'Some seek the mark not as punishment, but as proof. Proof of endurance, trust, being *truly* affected.'" }, { level: 3, text: "Requires Skill & Calibration: Delivering heavy impact safely requires skill, anatomy knowledge, and communication." } ],
        microStory: "The cane whistled, a sharp counterpoint to ragged breath. Each impact a negotiation with limits, answered by a shuddering 'More.'",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 9, name: "Sensation Play (Pain/Intensity Focus)", cardType: "Practice/Kink", visualHandle: "rare_pain.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 6, S: 8, P: 7, C: 5, R: 6, RF: 8 },
        briefDescription: "Ouchies beyond hitting.",
        detailedDescription: "Exploring intense sensations beyond impact. Think pinching, biting [97], scratching, temperature play (wax/ice [88]), clamps, electrostim [112], figging [110], or even careful needle play. Focuses on the pain/pleasure edge [S/P] and requires high trust and safety.",
        relatedIds: [7, 8, 16, 17, 37, 44, 63, 88, 96, 97, 110, 111, 112, 106, 124, 128, 135], rarity: 'rare', uniquePromptId: "rP09", keywords: ['Pain Play', 'Sensation', 'Intensity', 'Focus', 'Edge', 'BDSM', 'Clamps', 'Needles', 'Wax', 'Ice', 'Biting', 'Scratching', 'Temperature'],
        lore: [ { level: 1, text: "Fragment: '...not blunt force, but sharp focus. A single point of awareness crowding out all else. Meditation through fire.'" }, { level: 2, text: "Herbalist's Wisdom: 'Like potent herbs, handle with knowledge. Too little ineffective, too much poisons the well.'" }, { level: 3, text: "Psychological Landscape: Often tied to testing limits, endurance, focus, trust, or achieving altered states [P/C]." } ],
        microStory: "The sudden bite of the clamp, a gasp held tight. Pleasure and pain weren't opposites, just neighbours on a very interesting street.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 10, name: "Service Submission", cardType: "Psychological/Goal", visualHandle: "uncommon_service.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 2, S: 4, P: 7, C: 4, R: 6, RF: 8 },
        briefDescription: "Joy in taking care of someone.",
        detailedDescription: "A flavor of submission [5] where the primary fulfillment comes from performing acts of service for a partner [I/P]. Can range from simple chores to elaborate rituals, driven by devotion or a desire to please.",
        relatedIds: [5, 4, 11, 58, 61, 98, 109, 46, 132], rarity: 'uncommon', keywords: ['Service', 'Submission', 'Psychological', 'Devotion', 'Power Exchange', 'Care', 'Pleasing', 'Obedience', 'Task'],
        lore: [ { level: 1, text: "Devotional Echo: 'My purpose is found in anticipating and fulfilling your need.'" }, { level: 2, text: "Observation: The act of service elevates the Dominant while grounding the Submissive in tangible purpose." }, { level: 3, text: "Requires Clear Expectations: Service works best when tasks and expectations are clearly defined." } ],
        microStory: "Polishing their boots wasn't a chore, it was devotion made tangible. The simple act, a quiet prayer answered with a satisfied nod.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 11, name: "Command / Control Dynamics", cardType: "Psychological/Goal", visualHandle: "rare_control.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 9, S: 5, P: 8, C: 8, R: 6, RF: 10 },
        briefDescription: "Giving/following clear orders.",
        detailedDescription: "This dynamic thrives on explicit instructions and willing obedience. One partner (Dominant [4]) gives direct commands, rules, or instructions, and the other (submissive [5]) derives pleasure or fulfillment from obeying precisely [I/P/C]. Power exchange made manifest through direction.",
        relatedIds: [4, 5, 10, 30, 38, 45, 41, 89, 90, 100, 101, 109, 119, 120, 131, 132, 136], rarity: 'rare', uniquePromptId: "rP11", keywords: ['Control', 'Command', 'Obedience', 'Power Exchange', 'Structure', 'Psychological', 'Interaction', 'D/s', 'Rules', 'Direction', 'Instruction'],
        lore: [ { level: 1, text: "Tattered Scroll: 'The voice that commands shapes reality. The ear that obeys finds its defined place.'" }, { level: 2, text: "Alchemist's Query: Is the thrill in the certainty, the surrender, or the intense shared focus?" }, { level: 3, text: "Foundation of Trust: Requires absolute trust that commands will be ethical and limits respected." } ],
        microStory: "'Kneel.' The word hung in the air, simple, absolute. The immediate compliance wasn't forced, it was chosen. Power flowed.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 12, name: "Objectification Play", cardType: "Psychological/Goal", visualHandle: "rare_object.jpg", primaryElement: "P",
        elementScores: { A: 7, I: 4, S: 6, P: 8, C: 6, R: 5, RF: 8 },
        briefDescription: "Playing with being (or using) a 'thing'.",
        detailedDescription: "A consensual power dynamic [I/P] where someone is treated (or treats someone) more like an object for use, display, or pleasure, focusing on body parts or function rather than the whole person. Explores themes of dehumanization, utility, or intense focus within a safe container.",
        relatedIds: [4, 5, 20, 18, 19, 45, 61, 42, 62, 114], rarity: 'rare', uniquePromptId: "rP12", keywords: ['Objectification', 'Power Exchange', 'Psychological', 'Focus', 'Body', 'Dehumanization', 'Utility', 'Play', 'Reduction', 'Display'],
        lore: [ { level: 1, text: "Fragment: 'To be reduced, consensually, to pure function or sensation... can be strangely liberating.'" }, { level: 2, text: "Warning Label: Requires meticulous negotiation. The line between play and harm is consent." }, { level: 3, text: "Can Be Both Ways: One can enjoy objectifying or being objectified, exploring different facets of power." } ],
        microStory: "Just a mouth, a hand, a surface. Identity dissolved into function. In that reduction, a strange, focused freedom bloomed.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 13, name: "Role-Playing (Scenario)", cardType: "Practice/Kink", visualHandle: "uncommon_roleplay.jpg", primaryElement: "C",
        elementScores: { A: 6, I: 6, S: 5, P: 6, C: 8, R: 6, RF: 5 },
        briefDescription: "Playing characters in scenes.",
        detailedDescription: "Let's pretend! Adopting specific characters, personas, or roles within a defined scenario (e.g., doctor/patient [43], teacher/student, captor/captive [117]). Engages the cognitive [C] and interactional [I] elements heavily, allowing exploration of fantasies or dynamics.",
        relatedIds: [14, 30, 21, 39, 64, 92, 98, 101, 117, 121, 43], rarity: 'uncommon', keywords: ['Role-Play', 'Cognitive', 'Fantasy', 'Scenario', 'Character', 'Pretend', 'Interaction', 'Persona', 'Story'],
        lore: [ { level: 1, text: "Actor's Insight: Stepping into a role allows exploration of desires or facets of self otherwise hidden." }, { level: 2, text: "Narrative Power: The chosen scenario dictates the rules, creating a contained world for playful exploration." }, { level: 3, text: "Improvisation vs. Script: Can range from loose improvisational play to detailed pre-written scripts." } ],
        microStory: "'You're late, Nurse.' The shift in tone was electric. Suddenly, the familiar room was a stage, and the script was thrillingly unknown.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 14, name: "Fantasy Immersion", cardType: "Cognitive", visualHandle: "rare_fantasy.jpg", primaryElement: "C",
        elementScores: { A: 5, I: 3, S: 4, P: 7, C: 9, R: 3, RF: 3 },
        briefDescription: "Living fully in the mind's story.",
        detailedDescription: "Your imagination is the main stage! Getting lost in complex internal fantasy worlds, detailed narratives, or the *idea* of what's happening is central to arousal [C/P]. Physical reality might be secondary to the mental experience.",
        relatedIds: [13, 29, 41, 42, 49], rarity: 'rare', uniquePromptId: "rP14", keywords: ['Fantasy', 'Cognitive', 'Immersion', 'Narrative', 'Mind', 'World-Building', 'Imagination', 'Internal', 'Story'],
        lore: [ { level: 1, text: "Dream Journal: 'The world outside faded. Only the story mattered. Physical sensations merely echoes.'" }, { level: 2, text: "Mapmaker's Note: Some build intricate worlds brick by mental brick, finding arousal in the details." }, { level: 3, text: "Can Be Shared or Solo: Fantasy immersion can be deeply personal or shared through descriptive language [49]." } ],
        microStory: "Sunlight through stained glass, the scent of old parchment... The details bloomed behind closed eyes, more real than reality.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 15, name: "Deep Emotional Intimacy", cardType: "Psychological/Goal", visualHandle: "uncommon_intimacy_art.jpg", primaryElement: "P",
        elementScores: { A: 7, I: 5, S: 4, P: 9, C: 5, R: 7, RF: 2 },
        briefDescription: "Seeking profound soul connection.",
        detailedDescription: "For you, sex is often a powerful pathway to achieving profound emotional closeness, vulnerability, and mutual understanding [P]. The goal is less about pure physical release and more about forging a deep, trusting bond [R].",
        relatedIds: [2, 3, 22, 29, 47, 58, 68, 70, 75, 76, 82, 83, 123, 59, 69, 80], rarity: 'uncommon',
        lore: [ { level: 1, text: "Vulnerability as Strength: Openly sharing deep feelings during intimacy builds profound trust." }, { level: 2, text: "Soul Gazing: The feeling of being truly 'seen,' understood, and accepted is a powerful psychological reward." }, { level: 3, text: "Foundation for Exploration: This deep trust often creates the safety needed to explore other kinks." } ],
        microStory: "Tears mingled with sweat, unspoken fears whispered into the curve of a neck. Not just bodies touching, but souls sighing 'finally.'",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 16, name: "Rope Bondage (Shibari/Kinbaku)", cardType: "Practice/Kink", visualHandle: "rare_rope.jpg", primaryElement: "S",
        elementScores: { A: 6, I: 7, S: 8, P: 7, C: 6, R: 6, RF: 8 },
        briefDescription: "Artful tying & restriction.",
        detailedDescription: "It's functional art you can feel! Using rope (often jute or hemp) to create intricate, often beautiful patterns on the body, applying pressure strategically, restricting movement [17], and exploring the unique mental [P] and physical [S] state it creates. Involves a Rigger [130] and a model [134].",
        relatedIds: [9, 17, 4, 5, 44, 87, 101, 113, 130, 134], rarity: 'rare', uniquePromptId: "rP16", keywords: ['Restriction', 'Sensation', 'Aesthetic', 'Control', 'Trust', 'Helplessness', 'Rope', 'Shibari', 'Kinbaku', 'Bondage', 'Art', 'Skill'],
        lore: [ { level: 1, text: "Rigger's Maxim: 'The rope only holds what the mind allows.' Trust [15] is the first, most essential knot." }, { level: 2, text: "Historical Note: Evolved from samurai restraint, Kinbaku elevated rope into an art exploring patience, focus, beauty." }, { level: 3, text: "Energetic Exchange: Intense focus between Rigger and model creates a unique shared meditative state." } ],
        microStory: "The rough kiss of jute, tracing intricate lines. Not just bound, but adorned. Stillness became a canvas for sensation.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 17, name: "Restriction / Helplessness", cardType: "Psychological/Goal", visualHandle: "rare_restrict.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 3, S: 7, P: 9, C: 5, R: 5, RF: 8 },
        briefDescription: "Arousal from being bound/powerless.",
        detailedDescription: "The psychological *feeling* of being physically restrained (via ropes [16], cuffs [87], etc.) and the resulting mental state of helplessness, surrender [5], or total lack of control is a major turn-on [P]. The focus is often less on the specific tool, more on the internal experience.",
        relatedIds: [16, 5, 9, 37, 44, 63, 64, 87, 99, 113, 117, 118, 125, 43, 134], rarity: 'rare', uniquePromptId: "rP17", keywords: ['Helplessness', 'Surrender', 'Restriction', 'Psychological', 'Power Exchange', 'Vulnerability', 'Bondage', 'Immobility', 'Yielding'],
        lore: [ { level: 1, text: "Inner Monologue: '...can't move...don't *have* to move...just *be*... just feel... just receive...'" }, { level: 2, text: "Philosopher's Query: Is the appeal removal of responsibility, heightened sensory focus, or profound vulnerability?" }, { level: 3, text: "Requires Deep Trust: Feeling safe enough to embrace helplessness requires immense faith in the restrainer." } ],
        microStory: "Arms tied, nowhere to go. The struggle ceased, replaced by a profound quiet. Every touch amplified in the stillness.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 18, name: "Exhibitionism", cardType: "Identity/Role", visualHandle: "uncommon_exhibit.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 7, S: 5, P: 7, C: 6, R: 5, RF: 5 },
        briefDescription: "Loving an audience.",
        detailedDescription: "Getting aroused by the act of being watched during intimate moments [I/P]. Arousal stems from knowing others are seeing you, the vulnerability, the performance aspect, or the potential for validation [50]. Can range from being watched by a partner to more public displays [77, 78].",
        relatedIds: [19, 12, 34, 50, 78, 90, 91, 105, 33], rarity: 'uncommon', keywords: ['Performance', 'Visual', 'Public', 'Arousal', 'Validation', 'Exhibitionist', 'Being Watched', 'Audience', 'Display'],
        lore: [ { level: 1, text: "Performer's Thrill: The gaze of the other transforms the act, adding vulnerability and excitement." }, { level: 2, text: "Mirror Effect: Seeing oneself being seen (literally or metaphorically) can amplify intensity and focus." }, { level: 3, text: "Consent is Key: Non-consensual exhibitionism is illegal; consensual play requires clear agreement." } ],
        microStory: "Knowing eyes were watching, tracing every move. Not shame, but a thrilling current. Vulnerability became performance.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 19, name: "Voyeurism", cardType: "Identity/Role", visualHandle: "uncommon_voyeur.jpg", primaryElement: "A",
        elementScores: { A: 7, I: 2, S: 3, P: 6, C: 5, R: 3, RF: 2 },
        briefDescription: "Loving the view.",
        detailedDescription: "Finding arousal [A] primarily by watching others engage in sexual activity, often without participating directly [Low I]. Can involve watching partners, recorded material, or observing from a distance. The secrecy or detachment can be part of the appeal [P/C].",
        relatedIds: [18, 12, 34, 105, 118, 33], rarity: 'uncommon', keywords: ['Observation', 'Visual', 'Arousal', 'Distance', 'Secret', 'Watching', 'Voyeur', 'Gaze'],
        lore: [ { level: 1, text: "Observer's Paradox: A unique charge in witnessing intimacy from a distance, often unseen." }, { level: 2, text: "Power in Looking: The act of watching, especially if secret, holds its own subtle form of control." }, { level: 3, text: "Consent Matters Here Too: Watching unsuspecting people is unethical. Consensual voyeurism involves agreement." } ],
        microStory: "Shadows danced, framing the scene. Unseen, unheard, the silent observer felt the heat rise, a secret shared only with the dark.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 20, name: "Latex / Material Fetish", cardType: "Orientation", visualHandle: "rare_latex.jpg", primaryElement: "A",
        elementScores: { A: 9, I: 5, S: 8, P: 6, C: 5, R: 4, RF: 5 },
        briefDescription: "Shiny, squeaky, sexy!",
        detailedDescription: "It's all about the material! A strong, primary attraction [A] triggered by the specific sensory qualities (sight, feel, sound, smell [S]) of materials like latex, leather [94], PVC, rubber, silk, etc. The material itself holds inherent erotic power or aesthetic appeal.",
        relatedIds: [12, 21, 42, 94], rarity: 'rare', uniquePromptId: "rP20", keywords: ['Fetish', 'Material', 'Latex', 'Leather', 'PVC', 'Rubber', 'Attraction', 'Sensation', 'Focus', 'Texture', 'Shiny'],
        lore: [ { level: 1, text: "Texture Note: 'Like a second skin, it transforms perception. Engaging senses often ignored.'" }, { level: 2, text: "Alchemist's Insight: The material as potent catalyst, altering perceived essence, unlocking persona [C]." }, { level: 3, text: "Sensory Immersion: Encasing the body can drastically alter sensory input, leading to unique states." } ],
        microStory: "The sharp scent, the gleam under low light, the way it hugged every curve... Not just clothing, but transformation.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 21, name: "Uniform / Clothing Fetish", cardType: "Orientation", visualHandle: "rare_uniform.jpg", primaryElement: "A",
        elementScores: { A: 8, I: 6, S: 4, P: 6, C: 6, R: 5, RF: 5 },
        briefDescription: "Specific clothing as arousal trigger.",
        detailedDescription: "A fetish where sexual arousal [A] is significantly and primarily triggered by specific types of clothing, such as uniforms (military, medical [43], school [104]), costumes, or specific garments (lingerie [95], suits, historical attire). The clothing acts as a powerful symbol [C].",
        relatedIds: [13, 20, 12, 94, 95, 104, 43], rarity: 'rare', uniquePromptId: "rP21", keywords: ['Fetish', 'Clothing', 'Uniform', 'Attraction', 'Role-Play', 'Visual', 'Costume', 'Symbolism', 'Authority', 'Persona'],
        lore: [ { level: 1, text: "Costumer's Thread: 'A uniform is a pre-packaged story worn on the body. The embedded story is the spark.'" }, { level: 2, text: "Psychological Note: Clothing as powerful signifier, invoking roles, power dynamics [I], fantasies [C]." }, { level: 3, text: "Beyond the Look: Often involves the *idea* of the role the uniform represents, not just the visual." } ],
        microStory: "Crisp lines, polished buttons. Not just fabric, but the weight of the role it represented. Instant intrigue.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 22, name: "Monogamy", cardType: "Relationship Style", visualHandle: "common_mono.jpg", primaryElement: "R",
        elementScores: { A: 5, I: 5, S: 5, P: 6, C: 5, R: 2, RF: 1 },
        briefDescription: "One partner at a time.",
        detailedDescription: "The practice or preference for having only one sexual and/or romantic partner at a time [R]. Often involves deep commitment [P] and exclusivity within the dyad.",
        relatedIds: [23, 15, 29, 59, 76], rarity: 'common', keywords: ['Structure', 'Exclusivity', 'Commitment', 'Dyad', 'One-on-One', 'Pair-Bonding', 'Monogamous'],
        lore: [ { level: 1, text: "Focused Flame: Pouring relational energy into a single bond creates intense depth and security." }, { level: 2, text: "Societal Norm: While common, monogamy is a specific choice with its own agreements." }, { level: 3, text: "Requires Communication: Maintaining long-term monogamy often involves ongoing communication." } ],
        microStory: "Building a shared world, brick by brick, just the two of them against the chaos. A focused, steady flame.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 23, name: "Serial Monogamy", cardType: "Relationship Style", visualHandle: "common_serialmono.jpg", primaryElement: "R",
        elementScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 3, RF: 1 },
        briefDescription: "One exclusive relationship after another.",
        detailedDescription: "Engaging in a sequence of monogamous relationships [22], moving from one exclusive partnership to the next over time [R]. Maintains exclusivity *within* each relationship period.",
        relatedIds: [22, 24], rarity: 'common', keywords: ['Structure', 'Exclusivity', 'Sequence', 'Relationship', 'Monogamy', 'Dating', 'Pattern'],
        lore: [ { level: 1, text: "Chapter by Chapter: Exploring deep connections one at a time, learning with each relationship." }, { level: 2, text: "Balancing Act: Blends structure of monogamy with potential for change over time." }, { level: 3, text: "Transition Periods: Often involves periods of being single or dating casually between relationships." } ],
        microStory: "Each relationship a complete story, a world built and lived in fully before moving on. Lessons learned, pages turned.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 24, name: "Casual Sex / Hookups", cardType: "Relationship Style", visualHandle: "common_casual.jpg", primaryElement: "R",
        elementScores: { A: 6, I: 4, S: 6, P: 3, C: 3, R: 5, RF: 2 },
        briefDescription: "Sexy times, no strings attached.",
        detailedDescription: "Engaging in sexual activity without the expectation of romantic commitment or long-term entanglement [R]. Focus is often on physical pleasure [S], exploration [A], or convenience.",
        relatedIds: [23, 26, 35, 56, 65, 79, 84], rarity: 'common', keywords: ['Fleeting', 'Physical', 'Low-Commitment', 'Exploration', 'Casual', 'NSA', 'Hookup', 'One-Night Stand'],
        lore: [ { level: 1, text: "Freedom & Exploration: Allows exploring physical chemistry without deep emotional investment." }, { level: 2, text: "Clarity is Kind: Clear communication about expectations (or lack thereof) is crucial." }, { level: 3, text: "Varying Motivations: Can stem from prioritizing career, healing, or simply enjoying variety." } ],
        microStory: "Ships passing in the night, sharing warmth and friction before sailing on. A delightful, temporary intersection.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 25, name: "Polyamory", cardType: "Relationship Style", visualHandle: "rare_poly.jpg", primaryElement: "R",
        elementScores: { A: 6, I: 6, S: 5, P: 7, C: 6, R: 8, RF: 2 },
        briefDescription: "Loving more than one.",
        detailedDescription: "The practice, desire, or acceptance of having intimate relationships with more than one partner, with the informed consent of all involved [R]. Often involves deep emotional connections [P] alongside sexual intimacy.",
        relatedIds: [15, 26, 27, 34, 59, 84], rarity: 'rare', uniquePromptId: "rP25", keywords: ['Polyamory', 'Non-Monogamy', 'Multiple Partners', 'Intimacy', 'Connection', 'Structure', 'CNM', 'Ethics', 'Consent'],
        lore: [ { level: 1, text: "Core Tenet: Belief that love, intimacy, commitment are not finite resources limited to one." }, { level: 2, text: "Communication is Key: Requires exceptional skills in boundaries, time management, navigating emotions." }, { level: 3, text: "Diverse Structures: Can manifest as hierarchical (primary/secondary) or egalitarian (RA [27])." } ],
        microStory: "A complex, beautiful web of connection. More threads meant more potential warmth, more intricate patterns, more conversations.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
      {
        id: 26, name: "Open Relationship", cardType: "Relationship Style", visualHandle: "uncommon_openrel.jpg", primaryElement: "R",
        elementScores: { A: 6, I: 5, S: 6, P: 5, C: 5, R: 7, RF: 2 },
        briefDescription: "Main couple, outside fun allowed.",
        detailedDescription: "A relationship structure, typically centered around a primary couple, where partners agree that one or both may have sexual relationships with other people [R]. Emotional connections with others may or may not be encouraged, depending on specific agreements.",
        relatedIds: [24, 25, 27, 35], rarity: 'uncommon', keywords: ['Non-Monogamy', 'Structure', 'Rules', 'Openness', 'Dyad', 'CNM', 'Agreement', 'Primary'],
        lore: [ { level: 1, text: "Agreement Atlas: Success hinges on clear, honest communication and mutually agreed-upon boundaries." }, { level: 2, text: "Emotional Equation: Navigating jealousy, security, compersion becomes active part of dynamic." }, { level: 3, text: "Spectrum of Openness: Can range from casual encounters [24] to deeper connections, blurring into poly [25]." } ],
        microStory: "The home base was secure, the anchor held fast. Occasional voyages exploring other shores kept the main journey vibrant.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 27, name: "Relationship Anarchy", cardType: "Relationship Style", visualHandle: "rare_ra.jpg", primaryElement: "R",
        elementScores: { A: 6, I: 5, S: 5, P: 6, C: 7, R: 9, RF: 1 },
        briefDescription: "Rejects rules/hierarchies.",
        detailedDescription: "A philosophy and relationship style that questions and often rejects societal norms and imposed rules regarding relationships [R]. Each connection is defined uniquely by the individuals involved based on their desires and agreements, without inherent hierarchy or prioritizing romantic/sexual bonds over others [C].",
        relatedIds: [25, 26, 36, 59, 84], rarity: 'rare', uniquePromptId: "rP27", keywords: ['Relationship Anarchy', 'Autonomy', 'Fluidity', 'Anti-Hierarchy', 'Structure', 'Philosophy', 'Freedom', 'RA', 'Consent', 'Customization'],
        lore: [ { level: 1, text: "RA Manifesto Snippet: 'Define connections based on trust, communication, consent, not pre-written scripts.'" }, { level: 2, text: "Alchemist's Query: If every relationship is built from scratch, what are essential elements for stability?" }, { level: 3, text: "Radical Responsibility: Places emphasis on individual autonomy and responsibility for communicating needs." } ],
        microStory: "No labels, no escalator, just... connection. Each bond unique, defined only by the people within it. Radical freedom.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 28, name: "Asexuality", cardType: "Orientation", visualHandle: "uncommon_ace.jpg", primaryElement: "A",
        elementScores: { A: 0, I: 3, S: 2, P: 3, C: 3, R: 4, RF: 0 },
        briefDescription: "Little or no sexual pull.",
        detailedDescription: "Experiencing little to no sexual attraction towards anyone, regardless of gender [A]. Asexuality exists on a spectrum, and doesn't preclude romantic attraction [36] or enjoying sensual touch [2] or other forms of intimacy [P].",
        relatedIds: [29, 36], rarity: 'uncommon', keywords: ['Asexuality', 'Orientation', 'Attraction', 'Spectrum', 'Ace', 'Lack of Attraction'],
        lore: [ { level: 1, text: "Spectrum Study: Asexuality isn't monolithic; experiences range from no attraction (Ace) to rare/conditional (Grey-Ace)." }, { level: 2, text: "Beyond the Binary: Intimacy, love, profound connection [P/R] can flourish outside sexual attraction." }, { level: 3, text: "Distinction from Celibacy: Asexuality is lack of attraction, not choosing to abstain (celibacy)." } ],
        microStory: "The 'spark'? More like a quiet hum, sometimes silent. Connection bloomed in shared thoughts, warm tea, comfortable silence.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 29, name: "Demisexuality", cardType: "Orientation", visualHandle: "uncommon_demi.jpg", primaryElement: "A",
        elementScores: { A: 3, I: 4, S: 4, P: 8, C: 5, R: 5, RF: 1 },
        briefDescription: "Connection first, attraction later.",
        detailedDescription: "Only experiencing sexual attraction [A] after a strong emotional bond [P] has formed. The connection acts as a necessary prerequisite or key to unlock desire. Often considered on the Asexuality spectrum [28].",
        relatedIds: [15, 28, 22, 14], rarity: 'uncommon', keywords: ['Demisexuality', 'Attraction', 'Connection', 'Emotion', 'Intimacy', 'Bond', 'Prerequisite', 'Trust'],
        lore: [ { level: 1, text: "Heart's Compass: Emotional intimacy is true north required before sexual attraction can awaken." }, { level: 2, text: "Time and Trust: Building necessary deep emotional bond often requires time and vulnerability." }, { level: 3, text: "Primary vs. Secondary Attraction: Often experience aesthetic/romantic attraction first, sexual much later." } ],
        microStory: "First, shared laughter over spilled coffee. Then, late-night talks revealing hidden scars. Only then, the spark finally flickered.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 30, name: "High Protocol D/s", cardType: "Practice/Kink", visualHandle: "rare_protocol.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 8, S: 6, P: 8, C: 9, R: 7, RF: 10 },
        briefDescription: "Highly structured power exchange.",
        detailedDescription: "A style of Dominance [4] and submission [5] characterized by significant structure, formal rules, specific rituals [101], defined forms of address, and often pre-negotiated expectations for behavior extending beyond scenes [I/C]. Requires high commitment and cognitive engagement.",
        relatedIds: [4, 5, 11, 13, 38, 101, 109, 131, 132, 136], rarity: 'rare', uniquePromptId: "rP30", keywords: ['Protocol', 'Structure', 'Rules', 'Power Exchange', 'Cognitive', 'Ritual', 'D/s', 'Formal', 'Hierarchy', 'Commitment'],
        lore: [ { level: 1, text: "From an Old Text: 'Order illuminates power. Structure provides the sacred chalice for devotion.'" }, { level: 2, text: "Consideration: Does structure enhance power, provide safety, serve as cognitive focus, or become performance?" }, { level: 3, text: "Beyond Scenes: High protocol often integrates dynamic into daily life, blurring lines." } ],
        microStory: "'Address me properly.' The formality wasn't cold, it was the framework holding something exquisitely intense.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
    {
        id: 31, name: "Cuddling / Affection", cardType: "Practice/Kink", visualHandle: "common_cuddle.jpg", primaryElement: "P",
        elementScores: { A: 3, I: 3, S: 3, P: 6, C: 2, R: 4, RF: 1 },
        briefDescription: "Just wanna snuggle.",
        detailedDescription: "Seeking or giving purely physical closeness without immediate sexual pressure or expectation. Focuses on comfort [P], security, warmth [S], and expressing non-sexual affection [R].",
        relatedIds: [2, 15, 48, 69, 80], rarity: 'common', keywords: ['Comfort', 'Affection', 'Security', 'Connection', 'Gentle', 'Cuddle', 'Snuggle', 'Closeness'],
        lore: [ { level: 1, text: "The Human Need for Touch: Satisfies fundamental desire for warmth, safety, connection." }, { level: 2, text: "Silent Language: Cuddling can communicate care, reassurance, presence without words." }, { level: 3, text: "Aftercare Essential: Often key component of basic aftercare [69], helps ground/reconnect." } ],
        microStory: "Rain tapped the window. Inside, just the rhythm of breathing, the weight of an arm draped over a waist. Safe. Enough.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 32, name: "Dirty Talk", cardType: "Practice/Kink", visualHandle: "common_dirtytalk.jpg", primaryElement: "C",
        elementScores: { A: 5, I: 6, S: 3, P: 5, C: 7, R: 5, RF: 4 },
        briefDescription: "Talking the talk.",
        detailedDescription: "Using explicit, suggestive, or evocative language during intimacy to enhance arousal [A], communicate desires [C], direct actions [I], or play with power dynamics.",
        relatedIds: [13, 11, 4, 5, 46, 49, 66, 74, 85], rarity: 'common', keywords: ['Language', 'Cognitive', 'Arousal', 'Expression', 'Fantasy', 'Verbal', 'Communication', 'Erotic Talk'],
        lore: [ { level: 1, text: "Painting Pictures with Words: Can create vivid mental imagery, amplifying arousal." }, { level: 2, text: "Vocal Power: Tone, volume, specific words shape power dynamic [I] and emotional intensity [P]." }, { level: 3, text: "Highly Personal: What constitutes effective 'dirty talk' varies hugely between individuals." } ],
        microStory: "Just whispers in the dark, painting scenarios both wicked and sweet. Words became the most intimate touch.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 33, name: "Mutual Masturbation", cardType: "Practice/Kink", visualHandle: "common_mutualmast.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 5, S: 6, P: 4, C: 4, R: 5, RF: 3 },
        briefDescription: "Getting off together, separately.",
        detailedDescription: "Partners masturbating simultaneously in each other's presence [I]. Can be highly visual [A], offer insights into partner's pleasure [C], and feel both intimate [P] and slightly exhibitionistic [18].",
        relatedIds: [1, 18, 19, 72], rarity: 'common', keywords: ['Shared', 'Physical', 'Visual', 'Sensation', 'Masturbation', 'Exhibitionism', 'Voyeurism', 'Simultaneous'],
        lore: [ { level: 1, text: "Shared Vulnerability: Witnessing partner's self-pleasure can be uniquely intimate." }, { level: 2, text: "Visual Feedback Loop: Watching each other creates cycle of escalating arousal." }, { level: 3, text: "Safe Exploration: Lower-pressure way to explore sexuality or bridge distance." } ],
        microStory: "Eyes locked across the room, hands busy elsewhere. A shared secret, a race to the finish line, fueled by the watching.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 34, name: "Group Sex", cardType: "Practice/Kink", visualHandle: "uncommon_group.jpg", primaryElement: "R",
        elementScores: { A: 6, I: 6, S: 7, P: 5, C: 4, R: 8, RF: 3 },
        briefDescription: "More than two's company!",
        detailedDescription: "Sexual activity involving three or more people simultaneously [R]. Offers diverse interaction dynamics [I], heightened sensory input [S], and can fulfill specific fantasies [C] or relational desires.",
        relatedIds: [18, 19, 25, 26, 27, 35, 65, 105], rarity: 'uncommon', keywords: ['Group', 'Multiple Partners', 'Interaction', 'Shared Experience', 'Threesome', 'Orgy', 'Non-Monogamy', 'Social'],
        lore: [ { level: 1, text: "Network Effect: Energy in group play can be exponentially different, complex web of observation [19]." }, { level: 2, text: "Logistical Labyrinth: Communication, consent, hygiene, dynamics require skill." }, { level: 3, text: "Varying Intent: Casual fun to deep exploration within poly [25] or swinging [35]." } ],
        microStory: "A tangle of limbs, laughter echoing off walls. So many hands, so many possibilities. Shared heat, complex joy.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 35, name: "Swinging", cardType: "Relationship Style", visualHandle: "uncommon_swing.jpg", primaryElement: "R",
        elementScores: { A: 5, I: 5, S: 6, P: 4, C: 4, R: 7, RF: 3 },
        briefDescription: "Couples playing with others.",
        detailedDescription: "A form of non-monogamy [R] where committed couples engage in sexual activities with other couples or individuals, often as a shared recreational activity. Focus is typically on sexual variety rather than deep emotional connection with outside partners.",
        relatedIds: [26, 24, 34], rarity: 'uncommon', keywords: ['Non-Monogamy', 'Recreation', 'Couple', 'Group', 'Social', 'Swinger', 'Partner Swapping', 'Lifestyle'],
        lore: [ { level: 1, text: "Social Spice: Often focused on recreational encounters within specific communities." }, { level: 2, text: "Couple's Contract: Primary couple's bond typically remains central, with clear rules." }, { level: 3, text: "Distinction from Poly: Emphasizes sexual exploration over multiple deep emotional relationships [25]." } ],
        microStory: "The thrill of the swap, the shared secret glance with their partner across the room. Home base was solid, adventures allowed.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 36, name: "Aromanticism", cardType: "Orientation", visualHandle: "uncommon_aro.jpg", primaryElement: "A",
        elementScores: { A: 2, I: 3, S: 3, P: 4, C: 4, R: 3, RF: 0 },
        briefDescription: "Romance? No thanks.",
        detailedDescription: "Experiencing little or no romantic attraction towards others [A/R]. Distinct from sexual orientation [28], an aromantic person can have any sexual orientation (or be asexual). Does not preclude deep platonic bonds [59].",
        relatedIds: [28, 27, 59], rarity: 'uncommon', keywords: ['Aromanticism', 'Orientation', 'Romance', 'Spectrum', 'Aro', 'Lack of Attraction', 'Platonic'],
        lore: [ { level: 1, text: "Diverse Bonds: Strong, committed relationships (QPRs [59]) can exist outside romantic frameworks." }, { level: 2, text: "Attraction Alignment: Specifies lack of *romantic* attraction; sexual attraction can still exist." }, { level: 3, text: "Challenging Norms: Questions assumption that romantic love is highest connection." } ],
        microStory: "Flowers wilted, grand gestures felt hollow. But loyalty, shared projects, quiet understanding? That built empires.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 37, name: "Sensory Deprivation (Light)", cardType: "Practice/Kink", visualHandle: "uncommon_sensdep.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 3, S: 7, P: 6, C: 5, R: 5, RF: 5 },
        briefDescription: "Turning down the senses (blindfolds!).",
        detailedDescription: "Using tools like blindfolds, earplugs, or hoods to temporarily block out one or more senses (usually sight or sound) [S]. Can heighten other senses, increase vulnerability [P], focus the mind [C], or enhance trust [15].",
        relatedIds: [9, 17, 5, 57, 44, 86, 124], rarity: 'uncommon', keywords: ['Sensory Deprivation', 'Sensation', 'Focus', 'Vulnerability', 'Psychological', 'Blindfold', 'Earplugs', 'Hood', 'Heightened Senses'],
        lore: [ { level: 1, text: "Inner Focus: Removing external stimuli turns awareness inward, magnifying internal sensations." }, { level: 2, text: "Trust Amplified: Relying on partner while deprived of key sense deepens required trust." }, { level: 3, text: "Gateway to Overload: Often used in contrast play, making reintroduction of sensation [86] vivid." } ],
        microStory: "Sight vanished, replaced by the rustle of sheets, the amplified sound of breath. Suddenly, every touch was an earthquake.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 38, name: "Tease & Denial", cardType: "Practice/Kink", visualHandle: "rare_teasedenial.jpg", primaryElement: "P",
        elementScores: { A: 6, I: 7, S: 7, P: 8, C: 6, R: 6, RF: 8 },
        briefDescription: "Building anticipation, denying release.", detailedDescription: "A form of psychological [P] and physical [S] play involving bringing a partner close to orgasm repeatedly but denying climax [119]. Builds intense anticipation, frustration, and focus, often used within power dynamics [I].",
        relatedIds: [11, 4, 5, 7, 30, 44, 45, 83, 93, 99, 119, 126, 128, 135], rarity: 'rare', uniquePromptId: "rP38", keywords: ['Tease and Denial', 'Edging', 'Orgasm Control', 'Anticipation', 'Frustration', 'Psychological', 'Power Exchange', 'Control', 'Endurance', 'Denial'],
        lore: [ { level: 1, text: "The Razor's Edge: Holding someone perpetually on the brink creates intense physical/mental tension." }, { level: 2, text: "Power Manifest: Explicitly controlling partner's pleasure cycle potent display of dominance [I]." }, { level: 3, text: "The eventual release (if granted) can feel exponentially more powerful after prolonged denial." } ],
        microStory: "Closer... closer... and then, nothing. A gasp, a frustrated whine. The power wasn't in the touch, but in the withholding.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 39, name: "Age Play", cardType: "Practice/Kink", visualHandle: "uncommon_ageplay.jpg", primaryElement: "C",
        elementScores: { A: 5, I: 6, S: 4, P: 7, C: 8, R: 6, RF: 8 },
        briefDescription: "Playing pretend with age roles.",
        detailedDescription: "Consensual role-play [13] where participants adopt personas of different ages (often one older/Caregiver [58], one younger/Little [127]). Explores themes of nurturing [P], dependence, control [I], innocence, or rebellion within a defined fantasy structure [C].",
        relatedIds: [13, 4, 5, 10, 58, 92, 98, 127], rarity: 'uncommon', keywords: ['Age Play', 'Role-Play', 'Cognitive', 'Psychological', 'Dynamic', 'CGL', 'DDlg', 'MDlb', 'Regression', 'Caregiver', 'Little', 'Persona'],
        lore: [ { level: 1, text: "Persona Portal: Age play can be gateway to exploring different facets of personality or needs." }, { level: 2, text: "Safety Note: Clear communication distinguishing play from real-life ages crucial." }, { level: 3, text: "Spectrum of Play: Ranges from light interactions to deep psychological regression ('littlespace')." } ],
        microStory: "Hand tucked into a larger one, the worries of the world faded. Just juice boxes, bedtime stories, and feeling utterly safe.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 40, name: "Primal Play", cardType: "Practice/Kink", visualHandle: "uncommon_primal_art.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 8, S: 7, P: 6, C: 3, R: 5, RF: 7 },
        briefDescription: "Getting wild and instinctive.",
        detailedDescription: "Tapping into raw, animalistic energy during play [I]. Often involves less talk, more physical action – chasing, wrestling, biting [97], growling, nuzzling. Can be about dominance/submission [RF], instinct, or cathartic release [P].",
        relatedIds: [4, 5, 9, 7, 8, 97, 139], rarity: 'uncommon', keywords: ['Primal', 'Instinct', 'Interaction', 'Physical', 'Animalistic', 'Non-verbal', 'Chase', 'Wrestling', 'Growling', 'Biting', 'Catharsis'],
        lore: [ { level: 1, text: "Body Language: Communication shifts to visceral signals – growls, nips, posture." }, { level: 2, text: "Cathartic Release: Can bypass analytical mind [C], release pent-up energy playfully." }, { level: 3, text: "Predator/Prey Dynamics: Often explores instinctive roles of hunter/hunted." } ],
        microStory: "Words dissolved into low growls, playful nips. The chase was on, instinct taking over. Thought surrendered to tooth and claw.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 41, name: "Erotic Hypnosis / Mind Control Play", cardType: "Practice/Kink", visualHandle: "rare_hypno.jpg", primaryElement: "C",
        elementScores: { A: 5, I: 7, S: 3, P: 8, C: 9, R: 6, RF: 9 },
        briefDescription: "Using suggestion/perceived control.",
        detailedDescription: "Consensual play involving altered states of consciousness, hypnotic suggestion, triggers, or the *illusion* of one partner controlling the other's mind or actions [C/P]. Relies heavily on trust [15] and the power of suggestion within a defined dynamic [I]. Safety and consent are paramount.",
        relatedIds: [14, 4, 5, 11, 45, 42, 120, 44], rarity: 'rare', uniquePromptId: "rP41", keywords: ['Hypnosis', 'Mind Control', 'Cognitive', 'Power Exchange', 'Suggestion', 'Altered State', 'Psychological', 'Consent', 'Triggers', 'Illusion'],
        lore: [ { level: 1, text: "Whispered Secret: 'The seed of suggestion, planted in fertile ground of trust, blossoms...' Creates potent internal reality." }, { level: 2, text: "Ethical Consideration: Perceived power imbalance is immense. Consent must be ongoing, explicit, instantly revocable." }, { level: 3, text: "Requires Skill & Rapport: Effective hypnotic play often involves skill in language, rapport, understanding trance." } ],
        microStory: "Each soft word a key turning in the lock of their mind. Resistance melted, replaced by blissful, suggested obedience.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 42, name: "Transformation Fetish", cardType: "Orientation", visualHandle: "rare_transform.jpg", primaryElement: "C",
        elementScores: { A: 7, I: 4, S: 5, P: 7, C: 8, R: 4, RF: 5 },
        briefDescription: "Arousal from transformation themes.",
        detailedDescription: "A fetish centered on the concept or fantasy of transformation [C]. Can include physical changes (into animals [121], objects [12], different genders [92]), mental changes (personality alteration, bimbofication), or forced changes imposed within a power dynamic [I/P].",
        relatedIds: [20, 21, 12, 41, 14, 121, 92, 98], rarity: 'rare', uniquePromptId: "rP42", keywords: ['Transformation', 'Fetish', 'Cognitive', 'Fantasy', 'Change', 'Identity', 'TF', 'Metamorphosis', 'Role-Play'],
        lore: [ { level: 1, text: "Metaphysical Musings: 'To become *other*... Does it reveal hidden self, offer escape, or explore boundaries?'" }, { level: 2, text: "Symbolic Link: Often touches on identity fluidity, powerlessness/power, wish fulfillment, escaping limitations." }, { level: 3, text: "Manifestation: Can be purely mental [14], involve costumes [21], role-play [13], or body mod fantasies." } ],
        microStory: "Skin prickled, bones reshaped in the mind's eye. The familiar self dissolved, replaced by something sleek, furred, utterly *other*.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
      {
        id: 43, name: "Medical Play", cardType: "Practice/Kink", visualHandle: "rare_medical.jpg", primaryElement: "C",
        elementScores: { A: 5, I: 6, S: 7, P: 7, C: 7, R: 6, RF: 7 },
        briefDescription: "Role-playing medical scenarios.",
        detailedDescription: "Consensual role-playing [13] involving medical themes, settings (clinic, hospital), equipment (speculums, needles, stethoscopes), or roles (doctor, nurse, patient) [C/I]. Can explore power dynamics, vulnerability [P], clinical detachment, or specific sensations [S].",
        relatedIds: [13, 9, 17, 4, 5, 21], rarity: 'rare', uniquePromptId: "rP43", keywords: ['Medical Play', 'Role-Play', 'Scenario', 'Power Exchange', 'Clinical', 'Sensation', 'Exam', 'Doctor', 'Nurse', 'Patient', 'Vulnerability'],
        lore: [ { level: 1, text: "Scenario Note: Clinical setting often heightens feelings of vulnerability, sterility, surrender to authority." }, { level: 2, text: "Safety First: Real medical knowledge beneficial, especially with realistic props. Play safe, play informed." }, { level: 3, text: "Psychological Layers: Can tap into feelings about bodily autonomy, trust in authority, health fears/desires." } ],
        microStory: "The crisp white coat, the cool touch of the stethoscope. Power wasn't in force, but in knowledge, access, implied vulnerability.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
      {
        id: 44, name: "Edge Play", cardType: "Practice/Kink", visualHandle: "rare_edge.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 6, S: 9, P: 8, C: 5, R: 6, RF: 8 },
        briefDescription: "Pushing boundaries near limits.",
        detailedDescription: "Activities that intentionally push physical [S], psychological [P], or emotional boundaries close to perceived limits, often involving real or perceived risk. Examples include breath play [63, 125], knife play [111], extreme sensation [9], fear play [106], suspension [113]. Requires significant caution, expertise, trust [15], and communication [C].",
        relatedIds: [8, 9, 16, 17, 37, 38, 41, 63, 64, 65, 106, 111, 113, 116, 122, 125], rarity: 'rare', uniquePromptId: "rP44", keywords: ['Edge Play', 'Risk', 'Intensity', 'Sensation', 'Psychological', 'Trust', 'Boundary', 'Safety', 'High-Risk', 'Consent', 'Skill'],
        lore: [ { level: 1, text: "Adage: 'The edge is where sensation is sharpest, awareness heightened, trust tested profoundly.'" }, { level: 2, text: "Alchemist's Caution: Not mere thrill-seeking. Demands meticulous planning, partner knowledge, ongoing consent checks." }, { level: 3, text: "Altered States: Pushing limits often induces intense focus, adrenaline rushes, altered consciousness." } ],
        microStory: "Dancing on the razor's edge of sensation, trust the only safety net. Breath held, focus absolute. Alive.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 45, name: "Humiliation / Degradation", cardType: "Psychological/Goal", visualHandle: "rare_humiliation.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 7, S: 4, P: 9, C: 6, R: 6, RF: 9 },
        briefDescription: "Pleasure from embarrassment/degradation.",
        detailedDescription: "Consensual play where one partner derives pleasure [P] from performing or receiving acts or words intended to cause embarrassment, shame, or a feeling of being degraded or lowered in status [I]. Can range from light teasing to intense psychological scenarios [C]. Consent, limits, and aftercare [69] are critical.",
        relatedIds: [4, 5, 10, 11, 12, 38, 41, 99, 100, 114, 115, 120], rarity: 'rare', uniquePromptId: "rP45", keywords: ['Humiliation', 'Degradation', 'Psychological', 'Power Exchange', 'Emotion', 'Shame', 'Taboo', 'Consent', 'Ego Reduction', 'Status Play'],
        lore: [ { level: 1, text: "Observation: Power often lies in shared understanding that 'degradation' is performance within a trusted container." }, { level: 2, text: "Psychological Reflection: Often taps complex feelings about worthiness, control, societal conditioning, confronting taboos." }, { level: 3, text: "Requires Careful Negotiation: Limits are highly personal and essential to define clearly." } ],
        microStory: "Stripped bare, not just of clothes, but of pride. The sharp words, the lowered gaze... yet somehow, strangely freeing.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
    {
        id: 46, name: "Compliments / Praise", cardType: "Practice/Kink", visualHandle: "common_praise.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 5, S: 2, P: 7, C: 4, R: 5, RF: 3 },
        briefDescription: "Words that feel good.",
        detailedDescription: "Using positive verbal affirmation to express appreciation, desire, or approval. Can build confidence, reinforce desired behaviors (in D/s contexts), deepen connection [P], and feel incredibly validating.",
        relatedIds: [32, 15, 50, 10, 58], rarity: 'common', keywords: ['Validation', 'Affirmation', 'Psychological', 'Connection', 'Confidence', 'Praise', 'Verbal'],
        lore: [ { level: 1, text: "Verbal Sunlight: Genuine praise nourishes self-esteem and strengthens bonds." }, { level: 2, text: "Specificity Matters: Praising specific actions or traits often has more impact." }, { level: 3, text: "Power Dynamic Tool: In D/s [I/RF], praise can be a powerful reward or motivator." } ],
        microStory: "'Good girl.' Just two words, whispered soft, but they landed like sunshine, warming places she hadn't known were cold.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 47, name: "Eye Contact", cardType: "Practice/Kink", visualHandle: "common_eyecontact.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 6, S: 2, P: 7, C: 3, R: 6, RF: 4 },
        briefDescription: "That intense gaze.",
        detailedDescription: "Locking eyes during intimate moments. Can create profound feelings of connection, vulnerability, presence, or even challenge/assertion depending on the context and intensity of the gaze [I].",
        relatedIds: [3, 15, 4, 5], rarity: 'common', keywords: ['Intimacy', 'Connection', 'Vulnerability', 'Presence', 'Focus', 'Eyes', 'Non-verbal'],
        lore: [ { level: 1, text: "Windows to the Soul: Sustained eye contact feels like bypassing social masks for direct connection." }, { level: 2, text: "The Unblinking Gaze: Can assert dominance [I], convey unwavering attention, or challenge." }, { level: 3, text: "Breaking the Gaze: Looking away can signal submission, shyness, or need for respite." } ],
        microStory: "Held their gaze across the flickering candles. No words needed, the whole story unfolded in that silent, unwavering look.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 48, name: "Holding Hands", cardType: "Practice/Kink", visualHandle: "common_handholding.jpg", primaryElement: "P",
        elementScores: { A: 3, I: 4, S: 3, P: 5, C: 1, R: 4, RF: 1 },
        briefDescription: "Simple, connected touch.",
        detailedDescription: "Sometimes the simplest things offer the most comfort. Holding hands provides gentle physical connection, reassurance, and a feeling of partnership or safety [P].",
        relatedIds: [2, 31, 77], rarity: 'common', keywords: ['Affection', 'Connection', 'Comfort', 'Simple', 'Touch', 'Partnership'],
        lore: [ { level: 1, text: "Silent Anchor: Conveys partnership, support, 'I'm here' without words." }, { level: 2, text: "Subtle Pulse: Feeling another's pulse through clasped hands can be grounding, intimate." }, { level: 3, text: "Public & Private: Can be subtle public gesture [R] or private moment of quiet intimacy." } ],
        microStory: "Fingers laced together on the park bench. Not exciting, maybe, but solid. A small anchor in the swirling world.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 49, name: "Shared Fantasy Talk", cardType: "Practice/Kink", visualHandle: "common_fantasytalk.jpg", primaryElement: "C",
        elementScores: { A: 5, I: 5, S: 3, P: 6, C: 6, R: 5, RF: 3 },
        briefDescription: "Talking through fantasies together.",
        detailedDescription: "Sharing your secret brain movies! Verbally describing fantasies or desired scenarios to a partner, potentially building arousal [A], deepening connection [P], or exploring interests safely before acting.",
        relatedIds: [32, 14, 13, 74], rarity: 'common', keywords: ['Fantasy', 'Cognitive', 'Sharing', 'Arousal', 'Communication', 'Verbal', 'Exploration'],
        lore: [ { level: 1, text: "Building Worlds Together: Co-creating a fantasy verbally can be as exciting as acting it out." }, { level: 2, text: "Testing the Waters: Allows partners to gauge interest and boundaries around specific themes." }, { level: 3, text: "Vocal Intimacy: Sharing vulnerable fantasies builds unique trust [P] and cognitive connection." } ],
        microStory: "'And then,' she whispered, 'you'd find me waiting...' The words spun a world more vivid than the room around them.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 50, name: "Validation Seeking", cardType: "Psychological/Goal", visualHandle: "common_validation.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 6, S: 5, P: 7, C: 4, R: 5, RF: 4 },
        briefDescription: "Needing to feel desired/good.",
        detailedDescription: "A significant motivator for seeking intimacy might be the need to feel desired, attractive, skilled, or approved of by a partner. Can manifest in performance focus [I] or seeking specific praise [P].",
        relatedIds: [18, 46, 91], rarity: 'common', keywords: ['Validation', 'Psychological', 'Need', 'Desire', 'Performance', 'Approval', 'Self-Esteem'],
        lore: [ { level: 1, text: "Mirror Gazing: Seeking reflection of one's desirability or worthiness in a partner's eyes." }, { level: 2, text: "Double-Edged Sword: Relying heavily on external validation can create dependency." }, { level: 3, text: "Earned Validation: In some dynamics (D/s [RF]), validation might be explicitly earned." } ],
        microStory: "Did they like it? Was I good enough? The questions echoed louder than the pleasure. The answer had to come from outside.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 51, name: "Stress Relief Focus", cardType: "Psychological/Goal", visualHandle: "common_stressrelief.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 4, S: 5, P: 6, C: 3, R: 4, RF: 2 },
        briefDescription: "Sex as a way to unwind.",
        detailedDescription: "Feeling stressed? Sometimes intimacy serves primarily as a tool to release tension, relax, and temporarily forget worldly concerns. The physical release [S] and connection [P] provide effective relief.",
        relatedIds: [1], rarity: 'common', keywords: ['Stress Relief', 'Relaxation', 'Physical', 'Catharsis', 'Coping', 'Unwind'],
        lore: [ { level: 1, text: "The Body's Reset Button: Orgasm triggers relaxing hormones, a natural stress reliever." }, { level: 2, text: "Temporary Escape: Can provide welcome distraction and grounding in the present." }, { level: 3, text: "Potential Pitfall: Relying solely on sex for stress relief can be limiting." } ],
        microStory: "Long day. Needed to melt, forget the deadlines. Warm arms, soft sighs, the sweet oblivion of simple release.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 52, name: "Heterosexuality", cardType: "Orientation", visualHandle: "common_hetero.jpg", primaryElement: "A",
        elementScores: { A: 7, I: 5, S: 5, P: 5, C: 5, R: 5, RF: 1 },
        briefDescription: "Into different gender(s).",
        detailedDescription: "Primarily feeling sexual attraction towards people of a different gender than oneself. This is a common orientation within the broader spectrum of human attraction [A].",
        relatedIds: [53, 54, 55], rarity: 'common', keywords: ['Orientation', 'Gender', 'Attraction', 'Straight', 'Hetero'],
        lore: [ { level: 1, text: "Societal Default?: Often assumed, but a specific point on the attraction spectrum." }, { level: 2, text: "Internal Compass: Represents a consistent pattern of attraction directed towards different genders." }, { level: 3, text: "Diversity Within: Heterosexual desire itself is incredibly varied in its expression." } ],
        microStory: "The familiar pull, the easy recognition across the gender divide. Comfort in the common script, beauty in the difference.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 53, name: "Homosexuality", cardType: "Orientation", visualHandle: "common_homo.jpg", primaryElement: "A",
        elementScores: { A: 7, I: 5, S: 5, P: 5, C: 5, R: 5, RF: 1 },
        briefDescription: "Into the same gender(s).",
        detailedDescription: "Primarily feeling sexual attraction towards people of the same gender as oneself (e.g., gay men, lesbians). Part of the diverse spectrum of human orientation [A].",
        relatedIds: [52, 54, 55], rarity: 'common', keywords: ['Orientation', 'Gender', 'Attraction', 'Gay', 'Lesbian', 'Homo'],
        lore: [ { level: 1, text: "Mirror Attraction: Desire directed towards those who share a similar gender identity/expression." }, { level: 2, text: "Community & Culture: Often associated with specific LGBTQ+ communities and shared experiences." }, { level: 3, text: "Navigating Identity: Embracing this orientation involves journeys of self-discovery." } ],
        microStory: "The spark ignited in recognition, a shared understanding reflected in familiar eyes. Home found in similarity.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 54, name: "Bisexuality", cardType: "Orientation", visualHandle: "common_bi.jpg", primaryElement: "A",
        elementScores: { A: 6, I: 5, S: 5, P: 5, C: 5, R: 5, RF: 1 },
        briefDescription: "Into two or more genders.",
        detailedDescription: "Feeling sexual attraction towards more than one gender. This attraction doesn't have to be simultaneous, equal, or always active to be valid. Bisexuality encompasses a wide range of experiences [A].",
        relatedIds: [52, 53, 55], rarity: 'common', keywords: ['Orientation', 'Gender', 'Attraction', 'Multiple', 'Bi', 'Fluidity'],
        lore: [ { level: 1, text: "Beyond Binary: Attraction isn't limited to just one gender category." }, { level: 2, text: "Fluid Spectrum: Attraction might lean differently towards various genders at different times." }, { level: 3, text: "Visibility & Community: Navigating identity within queer and straight spaces has unique challenges." } ],
        microStory: "The compass needle swung wide, finding true north in different directions depending on the day, the person, the light.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 55, name: "Pansexuality", cardType: "Orientation", visualHandle: "common_pan.jpg", primaryElement: "A",
        elementScores: { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5, RF: 1 },
        briefDescription: "Attraction beyond gender.",
        detailedDescription: "Feeling sexual attraction *regardless* of a person's gender identity or expression. Attraction is often based more on personality, connection, vibe, or other qualities [A/P/C].",
        relatedIds: [52, 53, 54, 103], rarity: 'common', keywords: ['Orientation', 'Attraction', 'Fluidity', 'Personality', 'Pan', 'Gender-Blind'],
        lore: [ { level: 1, text: "Hearts Not Parts: Emphasizes attraction to the person, connection, vibe over gender." }, { level: 2, text: "Expansive View: Opens door to attraction across the full spectrum of gender identities." }, { level: 3, text: "Distinction from Bi: Often explicitly de-emphasizes gender as a factor in attraction." } ],
        microStory: "Labels dissolved. What mattered was the brilliant mind, the shared laugh, the soul humming on the same frequency. Gender was irrelevant.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 56, name: "Quickie", cardType: "Practice/Kink", visualHandle: "common_quickie.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 6, S: 6, P: 3, C: 2, R: 4, RF: 2 },
        briefDescription: "Fast and fun!",
        detailedDescription: "Short, sweet, and to the point! A brief sexual encounter focused primarily on achieving orgasm or quick physical release [S/P], often driven by opportunity or limited time.",
        relatedIds: [1, 24, 79], rarity: 'common', keywords: ['Brief', 'Spontaneous', 'Physical', 'Goal-Oriented', 'Fast', 'Efficient'],
        lore: [ { level: 1, text: "Efficiency Expert: Sometimes the goal is simply release, and time is of the essence." }, { level: 2, text: "Thrill of Speed: The rushed nature itself can add a layer of excitement or urgency." }, { level: 3, text: "Context Dependent: Can be fun change of pace or unsatisfying if deeper connection desired." } ],
        microStory: "Against the wall, whispered urgency, stolen moment. Over before it began, but the echo of heat lingered.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 57, name: "Sensory Enhancement", cardType: "Practice/Kink", visualHandle: "uncommon_sensenh.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 5, S: 7, P: 5, C: 4, R: 5, RF: 4 },
        briefDescription: "Turning up the volume on feelings.",
        detailedDescription: "Using tools, techniques, or substances (safely!) to amplify specific sensations [S]. Examples include focusing tools (floggers, feathers), mild stimulants, or techniques like edging [38] that make eventual release more intense.",
        relatedIds: [2, 37, 7, 9, 86, 88, 102, 112], rarity: 'uncommon', keywords: ['Sensation', 'Focus', 'Enhancement', 'Physical', 'Tools', 'Amplify', 'Intensity', 'Heighten'],
        lore: [ { level: 1, text: "Focus Funnel: Amplifying one sensation draws attention, creating intense focus and presence." }, { level: 2, text: "Contrast Play: Often used alongside sensory deprivation [37] to make reintroduction vivid." }, { level: 3, text: "Individual Variability: What enhances for one might overwhelm another." } ],
        microStory: "The drag of the feather, normally subtle, now felt electric after the blindfold. Every nerve ending awake and singing.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 58, name: "Caregiver/Little Dynamics", cardType: "Psychological/Goal", visualHandle: "uncommon_cglg.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 7, S: 4, P: 8, C: 6, R: 7, RF: 8 },
        briefDescription: "Nurturing/dependent role-play.",
        detailedDescription: "A dynamic often involving Age Play [39] where one person takes on a nurturing, guiding Caregiver role [I/P] (Mommy/Daddy/etc.) and the other embodies a younger, dependent Little persona [127]. Fulfills needs for safety, structure, comfort, or escape from adult responsibility.",
        relatedIds: [39, 4, 5, 10, 15, 82, 127, 129], rarity: 'uncommon', keywords: ['Caregiver', 'Nurturing', 'Dependence', 'Role-Play', 'Psychological', 'Vulnerability', 'CGL', 'DDlg', 'MDlb', 'Age Play', 'Safety', 'Guidance'],
        lore: [ { level: 1, text: "Core Need Fulfillment: Often meets deep needs for safety, unconditional care, structure, freedom." }, { level: 2, text: "Beyond Stereotypes: Expressions vary greatly – strict, playful, therapeutic, sexual, non-sexual." }, { level: 3, text: "Requires Dedication & Trust: Maintaining roles often requires significant emotional investment." } ],
        microStory: "'Drink your juice.' The simple instruction, delivered gently, was a shield against the harsh adult world. Protection found.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 59, name: "Platonic Partnership / QPR", cardType: "Relationship Style", visualHandle: "uncommon_qpr.jpg", primaryElement: "R",
        elementScores: { A: 3, I: 4, S: 3, P: 7, C: 5, R: 6, RF: 1 },
        briefDescription: "Super close, non-romantic bond.",
        detailedDescription: "Queerplatonic Relationships (QPRs) or other deeply committed platonic partnerships that challenge traditional distinctions between romance and friendship [R]. Involve high levels of intimacy [P], commitment, and potentially shared life logistics, but without romantic or sexual elements (or with those elements defined differently).",
        relatedIds: [22, 36, 15, 27, 25], rarity: 'uncommon', keywords: ['Platonic', 'Commitment', 'Intimacy', 'Relationship', 'Non-Romantic', 'QPR', 'Aromantic', 'Friendship', 'Partnership'],
        lore: [ { level: 1, text: "Defining Connection: Challenges assumption that romantic/sexual bonds are inherently more valuable." }, { level: 2, text: "Custom Fit: QPRs are highly individualized, built on specific needs and agreements." }, { level: 3, text: "Spectrum of Intimacy: Can involve deep emotional vulnerability, shared living, co-parenting." } ],
        microStory: "They built a life together, minus the romance. Shared finances, late-night talks, fierce loyalty. A different kind of 'us'.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 60, name: "Sapiosexuality", cardType: "Orientation", visualHandle: "uncommon_sapio.jpg", primaryElement: "A",
        elementScores: { A: 7, I: 5, S: 3, P: 6, C: 8, R: 5, RF: 2 },
        briefDescription: "Brains are sexy!",
        detailedDescription: "Finding intelligence, wit, knowledge, or the way someone thinks to be their most sexually attractive quality [A/C]. The intellectual spark is the primary driver of desire, often more so than physical appearance.",
        relatedIds: [49, 74, 81], rarity: 'uncommon', keywords: ['Sapiosexual', 'Attraction', 'Intelligence', 'Cognitive', 'Mind', 'Brains', 'Wit', 'Intellect'],
        lore: [ { level: 1, text: "Mental Foreplay: Stimulating intellectual conversation or debate can be incredibly arousing." }, { level: 2, text: "More Than IQ: Often it's curiosity, creativity, eloquence, or how someone *uses* their mind." }, { level: 3, text: "Cognitive Connection: Values a meeting of minds as a core component of attraction." } ],
        microStory: "The way they dissected the argument, sharp and elegant... Forget looks, *that* was the moment the knees went weak.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 61, name: "Body Worship", cardType: "Practice/Kink", visualHandle: "uncommon_bodyworship.jpg", primaryElement: "P",
        elementScores: { A: 6, I: 4, S: 6, P: 8, C: 3, R: 6, RF: 6 },
        briefDescription: "Adoring your partner's form.",
        detailedDescription: "Showing reverence, adoration, and focused appreciation for a partner's physical body [P/S]. Can involve kissing, licking, massaging, praising specific parts [46], or treating the body as sacred. Often involves a power dynamic [I].",
        relatedIds: [5, 10, 12, 62, 102], rarity: 'uncommon', keywords: ['Worship', 'Devotion', 'Adoration', 'Psychological', 'Focus', 'Body', 'Appreciation', 'Reverence', 'Massage', 'Kissing'],
        lore: [ { level: 1, text: "Act of Devotion: Can be a powerful way to make a partner feel cherished, seen, beautiful." }, { level: 2, text: "Focus & Presence: Requires intense focus, creating a meditative, reverent atmosphere." }, { level: 3, text: "Power Dynamics: Can be performed by sub [5] worshipping Dom, or vice versa, shifting meaning." } ],
        microStory: "Tracing the curve of their hip with reverent fingertips. Not lust, but awe. Every inch sacred ground.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 62, name: "Foot Fetish / Podophilia", cardType: "Orientation", visualHandle: "uncommon_footfetish.jpg", primaryElement: "A",
        elementScores: { A: 8, I: 4, S: 7, P: 5, C: 3, R: 4, RF: 3 },
        briefDescription: "Feet are fascinating!",
        detailedDescription: "A specific sexual interest where feet trigger significant arousal [A]. Can involve attraction to the appearance, smell, or feel of feet, or enjoying activities like foot massage, kissing, licking, or incorporating feet into other sexual acts [S].",
        relatedIds: [61, 12, 102], rarity: 'uncommon', keywords: ['Fetish', 'Feet', 'Attraction', 'Focus', 'Sensation', 'Podophilia', 'Worship', 'Massage', 'Licking'],
        lore: [ { level: 1, text: "Unexpected Canvas: Feet offer unique textures, shapes, pressure points for sensory exploration." }, { level: 2, text: "Symbolic Weight?: Might symbolize grounding, humility, service [10], power [I], or vulnerability." }, { level: 3, text: "Wide Spectrum: Interest can range from mild appreciation to primary focus of arousal." } ],
        microStory: "The elegant arch, the painted toes... A specific map of desire, leading to unexpected destinations.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 63, name: "Breath Play", cardType: "Practice/Kink", visualHandle: "rare_breath.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 7, S: 9, P: 8, C: 4, R: 6, RF: 9 },
        briefDescription: "Restricting airflow for sensation.",
        detailedDescription: "Consensual practice involving the restriction of airflow (erotic asphyxiation or hypoxia) to create intense physical sensations [S] and altered mental states [P/C]. Carries **significant inherent risks** and requires extreme caution, knowledge, trust [15], and communication.",
        relatedIds: [44, 17, 9, 5, 125], rarity: 'rare', uniquePromptId: "rP63", keywords: ['Breath Play', 'Asphyxiation', 'Risk', 'Edge Play', 'Sensation', 'Altered State', 'Trust', 'Safety', 'Hypoxia', 'Control', 'High-Risk'],
        lore: [ { level: 1, text: "**Safety Advisory:** Inherently risky. Education, communication, never playing alone, immediate release capability paramount." }, { level: 2, text: "Subjective Report: 'World narrows, sensations sharpen... surrender not just of will, but basic drive.'" }, { level: 3, text: "Physiological Effects: Induces oxygen deprivation, leading to lightheadedness, intense sensations, altered states." } ],
        microStory: "Air stolen, focus absolute on the hand covering their mouth. Panic fought trust, sensation screamed. Then, release.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 64, name: "CNC (Consensual Non-Consent)", cardType: "Practice/Kink", visualHandle: "rare_cnc.jpg", primaryElement: "C",
        elementScores: { A: 6, I: 7, S: 7, P: 8, C: 9, R: 6, RF: 9 },
        briefDescription: "Role-playing lack of consent.",
        detailedDescription: "Consensual role-playing scenarios [13] where participants act out a scene involving simulated non-consent, force, or coercion (e.g., rape fantasy, abduction [117]). Relies entirely on enthusiastic, pre-negotiated consent [C/R] and requires meticulous communication, clear boundaries, safewords, and trust [15].",
        relatedIds: [13, 4, 5, 17, 44, 117, 118], rarity: 'rare', uniquePromptId: "rP64", keywords: ['CNC', 'Role-Play', 'Fantasy', 'Cognitive', 'Power Exchange', 'Taboo', 'Consent', 'Safety', 'Negotiation', 'Safeword', 'Rape Fantasy'],
        lore: [ { level: 1, text: "Ethical Imperative: 'Consensual' is everything. Negotiation explicit, boundaries crystal clear, safewords instantly honored." }, { level: 2, text: "Psychological Exploration: Allows safe exploration of taboo fantasies, power dynamics, control themes." }, { level: 3, text: "Requires Intense Aftercare: Processing intense emotions often requires dedicated, sensitive aftercare [69]." } ],
        microStory: "'No,' they cried, meaning 'Yes, more.' The delicious terror, the forbidden thrill, all held safely within pre-drawn lines.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 65, name: "Chemsex / Party & Play (PnP)", cardType: "Practice/Kink", visualHandle: "rare_chemsex.jpg", primaryElement: "S",
        elementScores: { A: 6, I: 6, S: 8, P: 7, C: 3, R: 7, RF: 3 },
        briefDescription: "Using drugs to enhance sex.",
        detailedDescription: "Intentionally combining sexual activity, often group sex [34] or casual encounters [24], with the use of specific psychoactive drugs (commonly stimulants like methamphetamine, or drugs like GHB/GBL, mephedrone) to sustain activity, lower inhibitions, or intensify sensations [S]. Carries significant health risks and potential for addiction [P].",
        relatedIds: [34, 24, 44], rarity: 'rare', uniquePromptId: "rP65", keywords: ['Chemsex', 'PnP', 'Drugs', 'Sensation', 'Endurance', 'Risk', 'Social', 'Party', 'Substance Use', 'Harm Reduction'],
        lore: [ { level: 1, text: "Harm Reduction Note: Carries unique risks (overdose, consent, dehydration, STIs). Awareness, testing, hydration crucial." }, { level: 2, text: "Motivations Vary: Enhanced pleasure, endurance, lowered inhibitions, social bonding." }, { level: 3, text: "Potential Downsides: Addiction risk, health impacts, impaired judgment, consent issues." } ],
        microStory: "Hours blurred into a hazy pulse of bodies and bass. Sensation amplified, caution discarded. Tomorrow would deal with the cost.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
    {
        id: 66, name: "Foreplay Focus", cardType: "Practice/Kink", visualHandle: "common_foreplay.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 6, S: 5, P: 5, C: 4, R: 5, RF: 3 },
        briefDescription: "Loving the warm-up.",
        detailedDescription: "For you, the build-up is essential! Placing significant emphasis on the activities leading up to intercourse or climax, such as kissing [3], touching [2], oral sex [67], or sensual exploration.",
        relatedIds: [1, 2, 3, 32, 67, 83], rarity: 'common', keywords: ['Build-up', 'Arousal', 'Connection', 'Intimacy', 'Anticipation', 'Warm-up', 'Pacing'],
        lore: [ { level: 1, text: "Savoring the Start: Appreciating the journey of building arousal, not just the destination." }, { level: 2, text: "Building the Foundation: Good foreplay sets the stage physically [S] and emotionally [P]." }, { level: 3, text: "Communication Tool: Allows partners to signal desires and gauge responsiveness." } ],
        microStory: "The slow unraveling, the delicious delay. Each touch, each kiss, a promise whispered before the main act began.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 67, name: "Oral Sex (Giving/Receiving)", cardType: "Practice/Kink", visualHandle: "common_oral.jpg", primaryElement: "S",
        elementScores: { A: 6, I: 6, S: 7, P: 5, C: 3, R: 5, RF: 3 },
        briefDescription: "Using your mouth!",
        detailedDescription: "Getting busy with mouths and tongues! Using the mouth, lips, or tongue to stimulate a partner's genitals or other erogenous zones. Can involve giving or receiving pleasure.",
        relatedIds: [1, 66, 73, 107], rarity: 'common', keywords: ['Sensation', 'Physical', 'Focus', 'Giving', 'Receiving', 'Oral', 'Mouth'],
        lore: [ { level: 1, text: "Unique Intimacy: Offers specific focused pleasure and vulnerability." }, { level: 2, text: "Versatile Act: Can be central focus, part of foreplay [66], or climax." }, { level: 3, text: "Skill & Communication: Attunement to partner's preferences (pressure, speed) is key." } ],
        microStory: "A different kind of worship, focused and intent. The gasp, the arching back... success tasted sweet.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 68, name: "Romantic Gestures", cardType: "Psychological/Goal", visualHandle: "common_romantic.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 5, S: 3, P: 7, C: 4, R: 6, RF: 1 },
        briefDescription: "Showing love outside the bedroom.",
        detailedDescription: "Sweet actions that aren't directly sexual but express affection, care, and romantic interest. Examples include gifts, thoughtful acts, quality time, or words of affirmation [P/R].",
        relatedIds: [15, 22, 31, 76], rarity: 'common', keywords: ['Romance', 'Affection', 'Care', 'Relationship', 'Connection', 'Gestures', 'Love Language'],
        lore: [ { level: 1, text: "Nurturing the Bond: Small acts reinforce connection and make partners feel valued." }, { level: 2, text: "Setting the Stage: Romantic atmosphere often enhances feelings of intimacy and desire [A]." }, { level: 3, text: "Love Languages: Gestures resonate differently depending on individuals' preferred ways." } ],
        microStory: "Just a single flower, left on the pillow. A small gesture, a quiet 'I thought of you,' echoing louder than grand pronouncements.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 69, name: "Aftercare (Basic)", cardType: "Practice/Kink", visualHandle: "common_aftercare.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 5, S: 4, P: 6, C: 3, R: 6, RF: 3 },
        briefDescription: "Post-play connection & comfort.",
        detailedDescription: "Checking in after the fun stops! Activities following sex or intense scenes focused on emotional connection, comfort, and physical reassurance. Can include cuddling [31], talking [70], hydration, or simple presence.",
        relatedIds: [31, 15, 70, 80, 123], rarity: 'common', keywords: ['Comfort', 'Connection', 'Care', 'Post-Scene', 'Psychological', 'Aftercare', 'Safety', 'Reassurance'],
        lore: [ { level: 1, text: "Gentle Landing: Helps transition back from heightened states to baseline reality." }, { level: 2, text: "Reinforcing Trust: Demonstrates care for the person beyond the intensity of the scene." }, { level: 3, text: "Varies by Need: Effective aftercare is tailored to the specific needs and experiences involved." } ],
        microStory: "The intensity faded, leaving echoes. A glass of water offered, a soft blanket draped. Simple care, weaving the connection stronger.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 70, name: "Pillow Talk", cardType: "Practice/Kink", visualHandle: "common_pillowtalk.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 4, S: 2, P: 7, C: 4, R: 7, RF: 1 },
        briefDescription: "Cozy chats after sex.",
        detailedDescription: "Those relaxed, intimate, maybe vulnerable conversations that happen after sex, often while lying in bed. A time for sharing feelings, reflections, or simply enjoying closeness [P/R].",
        relatedIds: [69, 15], rarity: 'common', keywords: ['Intimacy', 'Conversation', 'Vulnerability', 'Connection', 'Post-Scene', 'Talk', 'Sharing'],
        lore: [ { level: 1, text: "Heart Opening: Post-coital hormones can lower defenses, making sharing easier." }, { level: 2, text: "Weaving the Narrative: Sharing reflections on the experience strengthens the relational bond [R]." }, { level: 3, text: "Quiet Connection: Sometimes, comfortable silence speaks volumes." } ],
        microStory: "In the drowsy afterglow, secrets whispered like prayers. Walls down, hearts open, weaving the day's threads together.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 71, name: "Shower/Bath Sex", cardType: "Practice/Kink", visualHandle: "common_showersex.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 5, S: 6, P: 4, C: 3, R: 5, RF: 2 },
        briefDescription: "Getting wet 'n' wild.",
        detailedDescription: "Taking the fun into the shower or bath! Adds the unique sensation of water [S], can feel playful or intimate, but often requires navigating slippery surfaces and limited positions.",
        relatedIds: [1], rarity: 'common', keywords: ['Sensation', 'Environment', 'Water', 'Playful', 'Shower', 'Bath', 'Novelty'],
        lore: [ { level: 1, text: "Liquid Sensations: Water adds unique element, changing touch and sound." }, { level: 2, text: "Logistical Fun: Navigating practicalities (soap, grip, temp) can be part of the challenge." }, { level: 3, text: "Intimate Bubble: Enclosed space creates feeling of shared privacy and intimacy." } ],
        microStory: "Steam rising, water slick on skin. A slippery, laughing fumble that was more play than precision. Clean fun, indeed.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 72, name: "Using Sex Toys (Simple)", cardType: "Practice/Kink", visualHandle: "common_toys_simple.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 5, S: 6, P: 4, C: 3, R: 4, RF: 3 },
        briefDescription: "Adding some buzz or bounce.",
        detailedDescription: "Bringing in the basics! Incorporating simple sex toys like vibrators or dildos into solo or partnered play to enhance sensation [S] or explore different types of stimulation.",
        relatedIds: [1, 33, 73, 112], rarity: 'common', keywords: ['Toys', 'Sensation', 'Stimulation', 'Physical', 'Vibrator', 'Dildo', 'Enhancement'],
        lore: [ { level: 1, text: "Targeted Pleasure: Toys allow precise and consistent stimulation of specific areas." }, { level: 2, text: "Expanding Options: Introduces new textures, sensations, shapes, possibilities." }, { level: 3, text: "Communication Aid: Can help partners discover or communicate what feels good." } ],
        microStory: "The steady hum against skin, finding that *exact* spot. Technology, meeting biology, creating delightful sparks.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 73, name: "Lubricant Use", cardType: "Practice/Kink", visualHandle: "common_lube.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 4, S: 5, P: 3, C: 2, R: 4, RF: 1 },
        briefDescription: "Making things slide.",
        detailedDescription: "Using lube to make things more comfortable and pleasurable! Reduces friction during penetrative or manual sex, enhancing sensation [S] and preventing discomfort or injury.",
        relatedIds: [1, 67, 72], rarity: 'common', keywords: ['Comfort', 'Sensation', 'Physical', 'Practical', 'Lube', 'Friction'],
        lore: [ { level: 1, text: "Comfort Enhancer: Reduces friction, increasing comfort, especially for certain acts." }, { level: 2, text: "Sensation Modifier: Different lubes (warming, cooling) can add novel sensory [S] dimensions." }, { level: 3, text: "Essential Tool: Often necessary for specific types of play (anal, toy use)." } ],
        microStory: "A dollop of clear gel, instantly erasing friction. Suddenly, everything glided smoother, easier, more pleasurably.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 74, name: "Flirting / Banter", cardType: "Interaction", visualHandle: "common_flirt.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 7, S: 3, P: 5, C: 6, R: 5, RF: 3 },
        briefDescription: "Playful, witty chat.",
        detailedDescription: "That fun, lighthearted back-and-forth! Using playful conversation, compliments [46], teasing, or wit to build rapport, signal interest [A], and create a spark [I/C].",
        relatedIds: [32, 60, 75, 49], rarity: 'common', keywords: ['Playful', 'Communication', 'Cognitive', 'Attraction', 'Rapport', 'Banter', 'Flirt', 'Interaction'],
        lore: [ { level: 1, text: "Testing the Waters: Low-stakes way to gauge interest and chemistry before escalating." }, { level: 2, text: "The Art of the Tease: Playful banter builds anticipation and creates charged atmosphere." }, { level: 3, text: "Cognitive Chemistry: Connecting through wit and wordplay can be powerful intimacy [P/C]." } ],
        microStory: "A raised eyebrow, a quick retort, a shared laugh. The conversation danced, each playful jab a test, an invitation.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 75, name: "Shared Humor", cardType: "Psychological/Goal", visualHandle: "common_humor.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 6, S: 2, P: 6, C: 5, R: 6, RF: 1 },
        briefDescription: "Laughing together.",
        detailedDescription: "Finding connection through giggles! Sharing jokes, finding humor in situations, or simply enjoying a lighthearted vibe together builds rapport and deepens bonds [P/R].",
        relatedIds: [74, 15], rarity: 'common', keywords: ['Humor', 'Connection', 'Playful', 'Psychological', 'Lightness', 'Laughter', 'Rapport'],
        lore: [ { level: 1, text: "Instant Icebreaker: Laughter diffuses tension, creates immediate shared experience." }, { level: 2, text: "Sign of Compatibility: Sharing humor often indicates aligned values or perspectives." }, { level: 3, text: "Coping Mechanism: Finding humor, even in awkward moments, strengthens resilience." } ],
        microStory: "An absurd joke, a shared snort-laugh that couldn't be contained. In that moment of silliness, connection solidified.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 76, name: "Date Nights", cardType: "Relationship Style", visualHandle: "common_datenight.jpg", primaryElement: "R",
        elementScores: { A: 4, I: 5, S: 4, P: 6, C: 4, R: 5, RF: 1 },
        briefDescription: "Making time for connection.",
        detailedDescription: "Setting aside specific time for a partner or partners, focusing on connection, shared activities, or romance [P]. Helps maintain intimacy and prioritizes the relationship [R] amidst daily life.",
        relatedIds: [68, 15, 22], rarity: 'common', keywords: ['Relationship', 'Connection', 'Ritual', 'Intimacy', 'Date', 'Quality Time', 'Maintenance'],
        lore: [ { level: 1, text: "Intentional Investment: Prioritizing relationship health by consciously dedicating time." }, { level: 2, text: "Creating Shared Memories: Rituals like date nights build history and reinforce the bond." }, { level: 3, text: "Rekindling the Spark: Can help break routine and re-ignite romance [A] or novelty." } ],
        microStory: "Phones off, focus solely on each other. A deliberate island carved out of the week, just for them. Connection recharged.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 77, name: "Public Display Affection (Mild)", cardType: "Practice/Kink", visualHandle: "common_pda.jpg", primaryElement: "R",
        elementScores: { A: 4, I: 5, S: 3, P: 5, C: 2, R: 5, RF: 2 },
        briefDescription: "Subtle affection out and about.",
        detailedDescription: "Showing you're together in public through subtle gestures like holding hands [48], an arm around the shoulder, or a quick peck. Affirms the connection [P] without drawing excessive attention.",
        relatedIds: [48, 3, 78], rarity: 'common', keywords: ['Public', 'Affection', 'Subtle', 'Relationship', 'PDA', 'Gesture', 'Connection'],
        lore: [ { level: 1, text: "Quiet Connection: Small gesture affirming bond, creating shared private moment in public." }, { level: 2, text: "Subtle Signal: Can communicate partnership or belonging to each other and onlookers." }, { level: 3, text: "Comfort Level: Tolerance and enjoyment varies greatly based on personality/culture." } ],
        microStory: "A quick squeeze of the hand while waiting in line. A small, unseen anchor affirming 'us' in the anonymous crowd.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 78, name: "Public Display Affection (Moderate)", cardType: "Practice/Kink", visualHandle: "uncommon_pda_mod.jpg", primaryElement: "R",
        elementScores: { A: 5, I: 6, S: 4, P: 6, C: 3, R: 6, RF: 3 },
        briefDescription: "Getting a little bolder in public.",
        detailedDescription: "Turning up the heat on public affection! More noticeable displays like passionate kissing [3], groping, or making out in semi-public places. Can involve an element of thrill [P] or exhibitionism [18].",
        relatedIds: [77, 18], rarity: 'uncommon', keywords: ['Public', 'Exhibitionism', 'Risk', 'Thrill', 'Affection', 'PDA', 'Kissing', 'Groping', 'Bold'],
        lore: [ { level: 1, text: "Thrill of the Near-Miss: Slight risk of being seen adds edge of excitement." }, { level: 2, text: "Claiming Space: Can be way of publicly affirming relationship or defying social constraints." }, { level: 3, text: "Negotiating Boundaries: Requires checking partner comfort levels and awareness of surroundings." } ],
        microStory: "A lingering kiss in the shadowed alley, heart pounding with the thrill of almost being caught. Deliciously risky.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 79, name: "Spontaneity Seeker", cardType: "Psychological/Goal", visualHandle: "common_spontaneity.jpg", primaryElement: "P",
        elementScores: { A: 6, I: 6, S: 6, P: 5, C: 3, R: 5, RF: 2 },
        briefDescription: "Loving the unexpected!",
        detailedDescription: "Getting a special kick out of unplanned moments! Finds excitement and energy in impulsive decisions, sudden opportunities for intimacy, or breaking from routine [P/A].",
        relatedIds: [56, 24], rarity: 'common', keywords: ['Spontaneous', 'Excitement', 'Unpredictable', 'Impulsive', 'Surprise', 'Novelty'],
        lore: [ { level: 1, text: "The Thrill of Now: Finds excitement in unplanned moments and seizing opportunities." }, { level: 2, text: "Breaking the Script: Resists predictability, seeking energy in the unexpected." }, { level: 3, text: "Balancing Act: Can be exhilarating but may require adaptable partners." } ],
        microStory: "'Forget dinner plans, let's...' The sudden detour, the break from the everyday. Yes! The unexpected tasted like freedom.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 80, name: "Comfort Seeker", cardType: "Psychological/Goal", visualHandle: "common_comfort.jpg", primaryElement: "P",
        elementScores: { A: 3, I: 3, S: 4, P: 7, C: 2, R: 4, RF: 1 },
        briefDescription: "Seeking safety & soothing touch.",
        detailedDescription: "Craving closeness mostly for that feeling of safety, security, and being cared for. Intimacy serves as a way to soothe anxiety, find reassurance, and feel emotionally held [P].",
        relatedIds: [31, 2, 69, 15], rarity: 'common', keywords: ['Comfort', 'Security', 'Psychological', 'Affection', 'Soothing', 'Safe', 'Nurturing', 'Anxiety Relief'],
        lore: [ { level: 1, text: "Safe Harbor: Intimacy provides refuge from external stress or internal turmoil." }, { level: 2, text: "Restorative Touch: Physical closeness regulates nervous system, promotes calm." }, { level: 3, text: "Vulnerability & Trust: Seeking comfort involves allowing vulnerability and trusting partner." } ],
        microStory: "Just needed to curl up, be held without questions. The world outside could wait. Here, in these arms, was sanctuary.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 81, name: "Attraction to Confidence", cardType: "Orientation", visualHandle: "common_attr_conf.jpg", primaryElement: "A",
        elementScores: { A: 7, I: 6, S: 4, P: 6, C: 5, R: 5, RF: 4 },
        briefDescription: "Drawn to self-assuredness.",
        detailedDescription: "Finding someone who knows what they want, carries themselves with assurance, or takes initiative inherently attractive [A]. Confidence often signals competence or leadership potential [I].",
        relatedIds: [4, 60, 104, 131, 137], rarity: 'common', keywords: ['Attraction', 'Confidence', 'Power', 'Personality', 'Assertive', 'Self-Assured'],
        lore: [ { level: 1, text: "Power Signature: Confidence radiates capability and self-possession, which can be magnetic." }, { level: 2, text: "Leading Energy: Often translates into perceived ability to take charge effectively." }, { level: 3, text: "Surface vs. Depth: True confidence differs from arrogance; attraction stems from genuine self-worth." } ],
        microStory: "They walked into the room and owned it, not loudly, just... solidly. That quiet certainty was incredibly attractive.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 82, name: "Attraction to Kindness", cardType: "Orientation", visualHandle: "common_attr_kind.jpg", primaryElement: "A",
        elementScores: { A: 5, I: 4, S: 4, P: 7, C: 4, R: 6, RF: 2 },
        briefDescription: "A kind heart is hot.",
        detailedDescription: "Being drawn to people who are genuinely kind, empathetic, considerate, and caring towards others. This trait signals emotional intelligence and potential for a safe, nurturing connection [A/P].",
        relatedIds: [15, 58, 127, 129], rarity: 'common', keywords: ['Attraction', 'Kindness', 'Empathy', 'Connection', 'Personality', 'Nurturing', 'Caring'],
        lore: [ { level: 1, text: "Sign of Safety: Kindness often signals emotional intelligence, trustworthiness, relational stability." }, { level: 2, text: "Nurturing Resonance: Appeals to desire for care, understanding, gentle approach." }, { level: 3, text: "Action Speaks Louder: True kindness observed in consistent behavior, not just words." } ],
        microStory: "The way they spoke to the waiter, the genuine concern for a friend... That quiet empathy? Unexpectedly sexy.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 83, name: "Slow Burn", cardType: "Practice/Kink", visualHandle: "common_slowburn.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 5, S: 5, P: 7, C: 5, R: 6, RF: 3 },
        briefDescription: "Enjoying the anticipation.",
        detailedDescription: "Loving the journey, not just the destination! Finding pleasure and heightened arousal in deliberately slow pacing, extended foreplay [66], building tension [P], and savoring anticipation.",
        relatedIds: [15, 66, 38], rarity: 'common', keywords: ['Anticipation', 'Intimacy', 'Tension', 'Psychological', 'Pacing', 'Build-up', 'Savoring'],
        lore: [ { level: 1, text: "Savoring the Simmer: Finds pleasure in mounting tension and delayed gratification." }, { level: 2, text: "Deepening the Flavor: Allows time for emotional connection [P] and sensory exploration [S]." }, { level: 3, text: "Cognitive Engagement: Anticipation keeps mind [C] actively involved, heightening release." } ],
        microStory: "Hours felt like minutes, drawn out in delicious tension. Every touch promised more, but held back. Anticipation itself was the drug.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 84, name: "Solo Polyamory", cardType: "Relationship Style", visualHandle: "uncommon_solopoly.jpg", primaryElement: "R",
        elementScores: { A: 5, I: 5, S: 5, P: 6, C: 6, R: 7, RF: 2 },
        briefDescription: "Multiple loves, living single.",
        detailedDescription: "Practicing polyamory [25] (multiple ethical relationships) while choosing to maintain an independent lifestyle, typically living alone and not sharing finances or primary domestic partnership with any partners [R]. Prioritizes autonomy alongside connection [P].",
        relatedIds: [25, 27, 24], rarity: 'uncommon', keywords: ['Polyamory', 'Non-Monogamy', 'Autonomy', 'Independence', 'Structure', 'SoloPoly', 'Relationship', 'Freedom'],
        lore: [ { level: 1, text: "Anchored in Self: Prioritizes personal independence while building meaningful connections." }, { level: 2, text: "Escaping the Escalator: Rejects traditional 'relationship escalator' model as default goal." }, { level: 3, text: "Requires Strong Boundaries: Balancing multiple relationships while maintaining independence requires clarity." } ],
        microStory: "Home base was unequivocally *self*. Love radiated outwards in multiple directions, but the center held, beautifully independent.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 85, name: "Make-up Sex", cardType: "Psychological/Goal", visualHandle: "common_makeupsex.jpg", primaryElement: "P",
        elementScores: { A: 6, I: 6, S: 6, P: 7, C: 3, R: 5, RF: 3 },
        briefDescription: "Post-argument passion.",
        detailedDescription: "Getting it on after a fight! Engaging in passionate sexual activity following a disagreement or conflict. Heightened emotions and the relief of reconciliation can fuel intense arousal [A/S] and a need to reconnect [P].",
        relatedIds: [3], rarity: 'common', keywords: ['Emotion', 'Intensity', 'Reconciliation', 'Catharsis', 'Conflict', 'Passion', 'Reconnection'],
        lore: [ { level: 1, text: "Riding the Emotional Peak & Valley: Heightened emotions from conflict can translate into intense arousal." }, { level: 2, text: "Physically Reaffirming the Bond: Powerful, non-verbal way to reconnect and restore closeness." }, { level: 3, text: "Potential Pitfall: Relying *only* on make-up sex without addressing issues creates unhealthy patterns." } ],
        microStory: "Angry tears still wet, the kiss was bruising, desperate. Reconnection forged in the fire of resolving conflict.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 86, name: "Sensory Overload", cardType: "Practice/Kink", visualHandle: "uncommon_sens_overload.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 6, S: 8, P: 6, C: 4, R: 5, RF: 5 },
        briefDescription: "Too much sensation (in a good way?).",
        detailedDescription: "Intentionally hitting multiple senses at once or providing intense, inescapable input to overwhelm the senses [S]. Can lead to altered states of consciousness [P/C], disorientation, or heightened focus.",
        relatedIds: [37, 57, 8, 124], rarity: 'uncommon', keywords: ['Sensory Overload', 'Intensity', 'Sensation', 'Altered State', 'Psychological', 'Overwhelm', 'Stimulation'],
        lore: [ { level: 1, text: "System Crash: Overwhelming input can short-circuit conscious thought, leading to primal reactions." }, { level: 2, text: "Controlled Chaos: Requires careful calibration by giver [I] to avoid genuine distress." }, { level: 3, text: "Finding Stillness Within: Goal can be finding calm amidst sensory storm." } ],
        microStory: "Too bright, too loud, too much touching *everywhere*. Thought shattered, leaving only pure, overwhelming sensation.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 87, name: "Light Bondage (Cuffs/Silk)", cardType: "Practice/Kink", visualHandle: "uncommon_bond_light.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 5, S: 6, P: 6, C: 4, R: 5, RF: 5 },
        briefDescription: "Simple, playful tying.",
        detailedDescription: "Using easy restraints like handcuffs, fuzzy cuffs, silk scarves, or simple rope ties that restrict movement but aren't overly constrictive or complex. Often used for playful power dynamics [I], aesthetic appeal [A], or mild sensory [S] alteration.",
        relatedIds: [16, 17, 5, 93, 134], rarity: 'uncommon', keywords: ['Bondage', 'Restriction', 'Playful', 'Sensation', 'Power', 'Cuffs', 'Ties', 'Light Bondage', 'Silk'],
        lore: [ { level: 1, text: "Symbolic Surrender: Even light restraint signals shift in power [I], enhances vulnerability [P]." }, { level: 2, text: "Aesthetic Element: Often chosen for visual appeal and ease of use vs intricate rope [16]." }, { level: 3, text: "Heightened Awareness: Limiting movement focuses attention on other sensations [S]." } ],
        microStory: "Wrists tied loosely with silk, more suggestion than serious restraint. Enough to shift the balance, add a playful edge.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 88, name: "Temperature Play (Wax/Ice)", cardType: "Practice/Kink", visualHandle: "uncommon_temp_play.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 6, S: 7, P: 6, C: 3, R: 5, RF: 5 },
        briefDescription: "Hot and cold sensations.",
        detailedDescription: "Playing with safe temperature changes on the skin using items like low-temperature wax, ice cubes, or other tools. Creates sharp sensory [S] contrasts and can be used for teasing, torture [9], or artistic marking.",
        relatedIds: [9, 57], rarity: 'uncommon', keywords: ['Temperature', 'Sensation', 'Contrast', 'Physical', 'Pain Play', 'Wax', 'Ice', 'Heat', 'Cold'],
        lore: [ { level: 1, text: "The Skin's Surprise: Temperature contrast jolts the nervous system, demanding attention." }, { level: 2, text: "Safety Note: Requires specific low-melt wax or care with ice to avoid burns/damage." }, { level: 3, text: "Temporary Art: Wax play can create beautiful, fleeting patterns on the skin." } ],
        microStory: "The shocking cold trail of ice, followed moments later by the warm kiss of wax. Fire and ice, dancing on skin.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 89, name: "Power Play (Subtle)", cardType: "Psychological/Goal", visualHandle: "uncommon_power_subtle.jpg", primaryElement: "P",
        elementScores: { A: 6, I: 7, S: 5, P: 7, C: 7, R: 6, RF: 6 },
        briefDescription: "Enjoying the undercurrents of power.",
        detailedDescription: "Getting a kick out of the subtle shifts in control, influence, or status within an interaction [I/P], often expressed through conversation [C], body language, or psychological games rather than explicit roles.",
        relatedIds: [4, 5, 11, 90, 6], rarity: 'uncommon', keywords: ['Power', 'Subtle', 'Psychological', 'Dynamic', 'Negotiation', 'Cognitive', 'Influence', 'Status', 'Mind Games'],
        lore: [ { level: 1, text: "The Unspoken Dance: Recognizing and playing with influence beneath the surface." }, { level: 2, text: "Constant Negotiation: Power exists in all interactions; subtle play makes it conscious." }, { level: 3, text: "Intellectual Edge: Often involves sharp wit [C] and keen observation." } ],
        microStory: "A slight tilt of the head, a deliberate pause... The shift in power was unspoken, felt only in the sudden tension.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 90, name: "Performance Focus (Top)", cardType: "Identity/Role", visualHandle: "uncommon_perf_top.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 8, S: 6, P: 7, C: 6, R: 5, RF: 7 },
        briefDescription: "Love orchestrating pleasure.",
        detailedDescription: "A Dom/Top style centered on skillfully giving pleasure or orchestrating an experience for the partner. Satisfaction comes from the partner's reaction [P] and the feeling of competent execution [I]. Often involves an element of showing off [18].",
        relatedIds: [4, 11, 18, 89, 129, 131, 136, 137, 138], rarity: 'uncommon', keywords: ['Performance', 'Control', 'Pleasure', 'Skill', 'Validation', 'Leading', 'Top', 'Giving', 'Orchestration'],
        lore: [ { level: 1, text: "The Conductor: Enjoys orchestrating partner's responses, creating sensory/emotional arc." }, { level: 2, text: "Reflected Glory: Satisfaction comes from witnessing positive impact on receiver." }, { level: 3, text: "Requires Attunement: Skillful performance requires deep attention to partner's cues/limits." } ],
        microStory: "Playing their body like a fine instrument, knowing just where to touch, when to pause. The resulting crescendo was pure satisfaction.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 91, name: "Performance Focus (Bottom)", cardType: "Identity/Role", visualHandle: "uncommon_perf_bot.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 3, S: 6, P: 7, C: 5, R: 5, RF: 7 },
        briefDescription: "Love showing your pleasure.",
        detailedDescription: "A Sub/Bottom style where expressing reactions (pleasure, pain, emotion) openly and enthusiastically is a key part of the enjoyment [I/P]. May enjoy being the center of attention [18] or seek validation [50] through reactions.",
        relatedIds: [5, 18, 50, 128, 133, 134, 135], rarity: 'uncommon', keywords: ['Performance', 'Reaction', 'Expression', 'Pleasure', 'Validation', 'Following', 'Bottom', 'Receiving', 'Expressive'],
        lore: [ { level: 1, text: "The Responsive Canvas: Finds joy in being the focus of the Top's attention and actions." }, { level: 2, text: "Amplifying the Scene: Enthusiastic responses heighten Top's satisfaction and overall energy." }, { level: 3, text: "Vulnerability & Authenticity: Performance means allowing genuine reactions to be seen." } ],
        microStory: "Every gasp, every shudder amplified for their audience of one. Their pleasure, reflected back, became the performance.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 92, name: "Gender Play", cardType: "Practice/Kink", visualHandle: "uncommon_genderplay.jpg", primaryElement: "C",
        elementScores: { A: 6, I: 6, S: 4, P: 6, C: 7, R: 5, RF: 4 },
        briefDescription: "Messing with gender roles/looks.",
        detailedDescription: "Consensually playing with or flipping traditional gender roles, appearances, or expressions. Can involve cross-dressing, adopting different mannerisms, or exploring gender fluidity [C/P].",
        relatedIds: [13, 39, 103], rarity: 'uncommon', keywords: ['Gender', 'Role-Play', 'Cognitive', 'Expression', 'Fluidity', 'Cross-dressing', 'Identity', 'Performance'],
        lore: [ { level: 1, text: "Identity Exploration: Way to explore different facets of self or challenge societal norms." }, { level: 2, text: "Power of Presentation: Altering appearance/behavior can profoundly shift perceived identity." }, { level: 3, text: "Beyond Binary: Often explores space outside or between traditional expressions." } ],
        microStory: "The sharp suit felt like armor, the swagger borrowed but thrilling. Tonight, she wasn't 'she'. Tonight, she was powerful.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 93, name: "Tickling (Erotic)", cardType: "Practice/Kink", visualHandle: "uncommon_tickle.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 6, S: 6, P: 5, C: 3, R: 5, RF: 5 },
        briefDescription: "Tickle torture!",
        detailedDescription: "Using tickling not just for laughs but as a form of playful torture, teasing [38], or sensation play [S]. The involuntary reactions and struggle can be part of the appeal [I/P].",
        relatedIds: [7, 38, 87, 126], rarity: 'uncommon', keywords: ['Tickling', 'Playful', 'Sensation', 'Control', 'Teasing', 'Torture', 'Involuntary', 'Laughter'],
        lore: [ { level: 1, text: "Involuntary Response: Uncontrollable laughter/squirming can be frustrating and arousing." }, { level: 2, text: "Intimate Knowledge: Requires knowing partner's ticklish spots and boundaries." }, { level: 3, text: "Lighthearted Power: Often used in less intense D/s [RF] or as playful punishment." } ],
        microStory: "Wriggling, helpless laughter, pleas for mercy ignored. The light touch held surprising power, reducing them to giggles.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 94, name: "Leather Fetish", cardType: "Orientation", visualHandle: "uncommon_leather.jpg", primaryElement: "A",
        elementScores: { A: 8, I: 6, S: 7, P: 6, C: 5, R: 5, RF: 5 },
        briefDescription: "Leather just *does* it.",
        detailedDescription: "A specific turn-on triggered by the look, feel, smell, or sound of leather [A/S]. Often associated with power dynamics [I], subcultures, or specific aesthetics.",
        relatedIds: [20, 21, 4], rarity: 'uncommon', keywords: ['Fetish', 'Leather', 'Material', 'Attraction', 'Sensation', 'Subculture', 'Gear', 'Power'],
        lore: [ { level: 1, text: "Sensory Signature: Unique combination of smell, texture, sound, look is potent." }, { level: 2, text: "Cultural Code: Linked with power, rebellion, BDSM communities, historical aesthetics." }, { level: 3, text: "Transformative Garment: Wearing leather can feel empowering or enhance persona [C]." } ],
        microStory: "The scent hit first, rich and primal. Then the soft creak, the way it hugged form. Instant magnetism.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 95, name: "Lingerie Focus", cardType: "Orientation", visualHandle: "uncommon_lingerie.jpg", primaryElement: "A",
        elementScores: { A: 7, I: 5, S: 5, P: 5, C: 4, R: 4, RF: 3 },
        briefDescription: "Fancy undies = instant arousal.",
        detailedDescription: "Finding specific types of lingerie (lace, silk, intricate designs, etc.) visually [A] or texturally [S] arousing. Can be about aesthetics, revealing/concealing, or associated fantasies [C].",
        relatedIds: [21], rarity: 'uncommon', keywords: ['Lingerie', 'Attraction', 'Visual', 'Clothing', 'Underwear', 'Aesthetic', 'Fabric', 'Fantasy'],
        lore: [ { level: 1, text: "Aesthetic Appeal: Beauty, design, fabric itself can be primary draw." }, { level: 2, text: "The Art of Reveal: Lingerie plays with concealing/revealing, heightening anticipation." }, { level: 3, text: "Feeling vs. Seeing: Can be equally about how it feels to wear it as how it looks." } ],
        microStory: "Black lace against pale skin, a delicate contrast promising hidden delights. Pure visual poetry.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
      {
        id: 96, name: "Hair Pulling", cardType: "Practice/Kink", visualHandle: "uncommon_hairpull.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 7, S: 6, P: 5, C: 2, R: 5, RF: 5 },
        briefDescription: "A little tug for sensation/control.",
        detailedDescription: "Using a consensual pull on the hair for sensation [S], control [I], steering, or adding intensity to an interaction. Can range from gentle guidance to a firm grip.",
        relatedIds: [7, 9, 4], rarity: 'uncommon', keywords: ['Hair Pulling', 'Sensation', 'Control', 'Physical', 'Intensity', 'Guidance', 'Primal'],
        lore: [ { level: 1, text: "Primal Grip: Connects to instinctive ways of asserting dominance or control." }, { level: 2, text: "Scalp Sensation: Pulling sensation on scalp can be uniquely intense or pleasurable." }, { level: 3, text: "Fine Line: Requires communication to distinguish enjoyable intensity from actual pain." } ],
        microStory: "A firm grip tangled in their hair, tilting their head back. A primal assertion, instantly shifting the dynamic.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 97, name: "Biting / Marking", cardType: "Practice/Kink", visualHandle: "uncommon_biting.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 7, S: 7, P: 6, C: 3, R: 5, RF: 6 },
        briefDescription: "Leaving your (love) mark.",
        detailedDescription: "Using teeth for fun! Incorporating biting into play for sensation (sharp pain/pleasure [S]), marking (leaving temporary evidence), expressing primal energy [I], or signaling possession/passion [P].",
        relatedIds: [9, 8, 40], rarity: 'uncommon', keywords: ['Biting', 'Marking', 'Sensation', 'Primal', 'Possession', 'Intensity', 'Hickey', 'Love Bite'],
        lore: [ { level: 1, text: "Primal Instinct: Taps into animalistic urges related to claiming or passion." }, { level: 2, text: "Visible Token: Marks can serve as temporary, visible reminders of intense encounter." }, { level: 3, text: "Consent & Intensity: Needs clear communication about pressure, breaking skin limits." } ],
        microStory: "Teeth grazed collarbone, leaving a faint bloom. Not ownership, exactly, but a temporary claim staked in passion.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
    {
        id: 98, name: "Pet Play", cardType: "Practice/Kink", visualHandle: "uncommon_petplay.jpg", primaryElement: "C",
        elementScores: { A: 5, I: 6, S: 5, P: 7, C: 7, R: 6, RF: 8 },
        briefDescription: "Role-playing as cute critters.",
        detailedDescription: "Consensual role-play where someone takes on the persona and behaviors of an animal (e.g., kitten, puppy, pony), often involving a corresponding 'Owner' or 'Handler' role [I]. Explores themes of submission [5], service [10], non-verbal communication, nurturing [58], or specific species behaviors [C/P].",
        relatedIds: [13, 39, 4, 5, 10, 121, 133], rarity: 'uncommon', keywords: ['Pet Play', 'Role-Play', 'Cognitive', 'Psychological', 'Animalistic', 'Dynamic', 'Kitten', 'Puppy', 'Handler', 'Owner', 'Submission', 'Non-verbal'],
        lore: [ { level: 1, text: "Embodied Persona: Allows exploration of instincts, needs associated with chosen animal." }, { level: 2, text: "Gear & Dynamics: Collars, tails, ears, commands [11] often enhance immersion." }, { level: 3, text: "Headspace Shift: Entering 'petspace' can involve significant psychological shift [P]." } ],
        microStory: "A happy yip, tail wagging (imaginarily). Headbutted their owner's hand for scratches. Simple needs, simple joy.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 99, name: "Masochism (Psychological)", cardType: "Psychological/Goal", visualHandle: "uncommon_maso_psych.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 3, S: 4, P: 8, C: 6, R: 5, RF: 8 },
        briefDescription: "Finding pleasure in mental 'ouch'.",
        detailedDescription: "Getting pleasure or release from experiencing psychologically challenging states like humiliation [45], degradation, fear [106], or emotional distress within a consensual, controlled context [P/C]. This is distinct from enjoying physical pain (though they can overlap).",
        relatedIds: [5, 17, 45, 100, 120, 132, 135], rarity: 'uncommon', keywords: ['Masochism', 'Psychological', 'Emotion', 'Submission', 'Distress', 'Catharsis', 'Humiliation', 'Degradation', 'Fear', 'Endurance'],
        lore: [ { level: 1, text: "The Cathartic Sting: Facing difficult emotions within safe container can be releasing." }, { level: 2, text: "Trust as the Net: Ability to explore these states relies entirely on deep trust [15]." }, { level: 3, text: "Beyond Pain: Focuses on emotional/mental experience, not necessarily physical." } ],
        microStory: "The carefully aimed words landed, stripping away ego. A strange, aching pleasure in the vulnerability, the exposure.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 100, name: "Sadism (Psychological)", cardType: "Psychological/Goal", visualHandle: "uncommon_sad_psych.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 7, S: 4, P: 8, C: 7, R: 5, RF: 8 },
        briefDescription: "Pleasure from causing mental 'ouch'.",
        detailedDescription: "Finding pleasure or satisfaction from causing psychological distress, humiliation [45], fear [106], or emotional challenge in a consensual partner [P/C]. Requires empathy and careful control [I] to distinguish play from harm.",
        relatedIds: [4, 11, 45, 99, 120, 131, 136, 137], rarity: 'uncommon', keywords: ['Sadism', 'Psychological', 'Emotion', 'Control', 'Distress', 'Humiliation', 'Fear', 'Dominance', 'Manipulation'],
        lore: [ { level: 1, text: "The Responsive Spark: Satisfaction often comes from witnessing partner's genuine (consensual) reaction." }, { level: 2, text: "Ethical Edge: Requires careful calibration, communication, understanding limits." }, { level: 3, text: "Beyond Cruelty: Ethical psych sadism focuses on negotiated dynamic, not lasting harm." } ],
        microStory: "Watching them squirm under the weight of the carefully chosen words. A delicate dance of control, pushing just enough.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 101, name: "Ritualistic Play", cardType: "Practice/Kink", visualHandle: "uncommon_ritual.jpg", primaryElement: "C",
        elementScores: { A: 6, I: 7, S: 6, P: 7, C: 8, R: 7, RF: 8 },
        briefDescription: "Adding ceremony to scenes.",
        detailedDescription: "Bringing elements of ritual, structure, and symbolism into BDSM or other intimate encounters [C]. Can involve specific words, actions, attire [21], or settings to enhance the psychological [P] significance or power dynamics [I].",
        relatedIds: [30, 11, 13, 16, 116, 4, 5, 109, 131, 137], rarity: 'uncommon', keywords: ['Ritual', 'Cognitive', 'Structure', 'Symbolism', 'Meaning', 'Power', 'Ceremony', 'Formal', 'Protocol'],
        lore: [ { level: 1, text: "Meaning Making: Ritual elevates actions beyond mundane, imbuing deeper significance." }, { level: 2, text: "Structuring Power: Formalized steps clearly define roles [I], reinforce dynamics [RF]." }, { level: 3, text: "Shared Worlds: Creates unique, shared reality [C], enhancing immersion [P]." } ],
        microStory: "Candlelight, chanted words, specific gestures. The air thickened with intent. This wasn't just play; it was ceremony.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 102, name: "Sensory Focus (Specific Zone)", cardType: "Practice/Kink", visualHandle: "uncommon_sens_zone.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 6, S: 7, P: 5, C: 4, R: 5, RF: 5 },
        briefDescription: "Zooming in on one body part.",
        detailedDescription: "Giving *all* the attention to one specific part of the body (e.g., feet [62], neck, hands, genitals). Heightens awareness [S] of that zone and can create intense localized pleasure or anticipation [P].",
        relatedIds: [57, 2, 61, 62], rarity: 'uncommon', keywords: ['Sensation', 'Focus', 'Body Part', 'Intensity', 'Physical', 'Zone', 'Localized'],
        lore: [ { level: 1, text: "Microcosm of Feeling: Concentrating sensation allows exploration of nuances often missed." }, { level: 2, text: "Anticipation Amplified: Knowing only one area receives attention focuses mind [C]." }, { level: 3, text: "Mapping the Territory: Used to discover or highlight particularly responsive areas." } ],
        microStory: "Just the curve of the earlobe, explored with excruciating slowness. The rest of the body ceased to exist.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 103, name: "Androgyny Attraction", cardType: "Orientation", visualHandle: "uncommon_andro.jpg", primaryElement: "A",
        elementScores: { A: 7, I: 5, S: 5, P: 5, C: 5, R: 5, RF: 1 },
        briefDescription: "Drawn to gender-blendy looks.",
        detailedDescription: "Finding people whose gender presentation is ambiguous, mixes masculine and feminine elements, or exists outside the traditional binary attractive [A]. Appreciates aesthetics that defy easy categorization.",
        relatedIds: [55, 92], rarity: 'uncommon', keywords: ['Attraction', 'Androgyny', 'Gender Presentation', 'Aesthetic', 'Non-binary', 'Gender Fluid', 'Ambiguous'],
        lore: [ { level: 1, text: "Beyond the Binary: Appreciating aesthetics that challenge traditional gender markers." }, { level: 2, text: "Fluidity Embodied: Reflects attraction to ambiguity, creativity [C], freedom from constraints." }, { level: 3, text: "Intrigue of the Unknown: Lack of easy categorization can be source of fascination." } ],
        microStory: "Sharp jawline, soft eyes, clothes that refused simple labels. Impossible to categorize, utterly captivating.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 104, name: "Power Attire", cardType: "Orientation", visualHandle: "uncommon_powerattire.jpg", primaryElement: "A",
        elementScores: { A: 7, I: 6, S: 4, P: 6, C: 5, R: 5, RF: 5 },
        briefDescription: "Authority looks hot.",
        detailedDescription: "Finding clothes linked with power, authority, or high status (e.g., business suits, specific uniforms [21], formal wear) particularly attractive [A]. The clothing signifies confidence [P] or control [I].",
        relatedIds: [21, 4, 81, 131, 137], rarity: 'uncommon', keywords: ['Attraction', 'Clothing', 'Power', 'Authority', 'Uniform', 'Formal', 'Status', 'Aesthetic'],
        lore: [ { level: 1, text: "Visual Shorthand: Specific attire instantly communicates status, role, confidence." }, { level: 2, text: "Borrowed Authority: Clothing itself can lend aura of power or competence." }, { level: 3, text: "Context is Key: Same attire might signify different things depending on context." } ],
        microStory: "The perfectly tailored suit, the crisp collar. Not just clothes, but a declaration of competence. Power personified.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 105, name: "Voyeuristic Exhibitionism", cardType: "Identity/Role", visualHandle: "uncommon_voy_exhib.jpg", primaryElement: "I",
        elementScores: { A: 7, I: 7, S: 5, P: 7, C: 6, R: 6, RF: 4 },
        briefDescription: "Love watching *and* being watched.",
        detailedDescription: "Getting turned on by *both* sides of the gaze! Enjoying the act of watching others [19] while simultaneously enjoying being seen [18]. Often prominent in group sex [34] or swinging [35] scenarios.",
        relatedIds: [18, 19, 34], rarity: 'uncommon', keywords: ['Exhibitionism', 'Voyeurism', 'Visual', 'Performance', 'Shared', 'Group', 'Reciprocal Gaze'],
        lore: [ { level: 1, text: "The Shared Gaze: Dynamic where watching and being watched becomes mutual turn-on." }, { level: 2, text: "Amplified Energy: Presence of multiple perspectives intensifies experience." }, { level: 3, text: "Feedback Loop: Seeing others react to being watched, while being watched, creates layers." } ],
        microStory: "Their eyes met hers across the crowded room as someone else's hands explored. A circuit sparked: watcher, watched, participant.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 106, name: "Fear Play (Mild)", cardType: "Practice/Kink", visualHandle: "uncommon_fear_mild.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 6, S: 6, P: 7, C: 5, R: 5, RF: 6 },
        briefDescription: "Getting thrills from safe scares.",
        detailedDescription: "Using surprise, startle moments, anticipation of (safe) pain [9], or mild threats within a consensual scene to evoke feelings of fear or anxiety [P] for arousal. Distinct from genuine danger.",
        relatedIds: [44, 38, 9, 111, 122], rarity: 'uncommon', keywords: ['Fear', 'Anticipation', 'Thrill', 'Psychological', 'Edge', 'Startle', 'Anxiety', 'Safe Scare'],
        lore: [ { level: 1, text: "Adrenaline Rush: Tapping fight-or-flight response in controlled way can be exciting." }, { level: 2, text: "Power of the Unknown: Anticipation and uncertainty heighten tension." }, { level: 3, text: "Safety Net Required: Requires immense trust [15] that 'threat' is contained." } ],
        microStory: "A sudden noise in the dark, a whispered threat that wasn't real... but the racing heart felt very real indeed.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 107, name: "Tribadism / Scissoring", cardType: "Practice/Kink", visualHandle: "uncommon_tribadism.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 6, S: 7, P: 5, C: 2, R: 5, RF: 2 },
        briefDescription: "Vulva-on-vulva friction.",
        detailedDescription: "A sexual act involving rubbing vulvas together for mutual stimulation [S]. Often involves body-to-body contact, offering closeness [P] and direct clitoral friction.",
        relatedIds: [1, 67], rarity: 'uncommon', keywords: ['Tribadism', 'Scissoring', 'Physical', 'Sensation', 'Friction', 'Lesbian', 'Mutual', 'Vulva'],
        lore: [ { level: 1, text: "Mutual Grounding: Direct, full-body contact offers unique shared intimacy." }, { level: 2, text: "Rhythmic Synergy: Finding shared rhythm creates waves of escalating pleasure." }, { level: 3, text: "Anatomy & Technique: Positioning and pressure preferences vary greatly." } ],
        microStory: "Hipbones pressed together, a shared rhythm building heat. Simple friction, profound connection.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
    {
        id: 108, name: "Intercrural Sex (Frotting)", cardType: "Practice/Kink", visualHandle: "uncommon_frotting.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 6, S: 7, P: 5, C: 2, R: 5, RF: 2 },
        briefDescription: "Penis-on-penis friction.",
        detailedDescription: "A sexual act involving rubbing penises together (intercrural) or against other body parts (frottage) for mutual stimulation [S]. Focuses on friction and direct contact.",
        relatedIds: [1], rarity: 'uncommon', keywords: ['Frotting', 'Intercrural', 'Physical', 'Sensation', 'Friction', 'Gay', 'Mutual', 'Penis'],
        lore: [ { level: 1, text: "Friction Focus: Provides direct stimulation through rubbing, involving body weight." }, { level: 2, text: "Intimate Proximity: Closeness fosters sense of shared physicality and connection." }, { level: 3, text: "Variations: Can involve thigh-sex or rubbing against any body part." } ],
        microStory: "Skin sliding against skin, urgent pressure, shared heat. A direct, uncomplicated friction building towards release.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 109, name: "Master / slave Dynamic (M/s)", cardType: "Relationship Style", visualHandle: "rare_ms.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 9, S: 6, P: 9, C: 8, R: 7, RF: 10 },
        briefDescription: "Total power exchange relationship.",
        detailedDescription: "A specific, high-intensity form of D/s relationship involving a deep level of commitment and power exchange [I/R], often encompassing many aspects of life beyond the bedroom (Total Power Exchange - TPE). Uses specific titles (Master/Mistress [131, 137] and slave [132]) and involves profound psychological shifts [P].",
        relatedIds: [4, 5, 11, 30, 10, 101, 131, 132], rarity: 'rare', uniquePromptId: "rP109", keywords: ['M/s', 'Power Exchange', 'Total Power Exchange', 'TPE', 'Commitment', 'Structure', 'D/s', 'Lifestyle', 'Master', 'Slave', 'Authority', 'Surrender', '24/7'],
        lore: [ { level: 1, text: "Defining Feature: Often distinguished by potential 24/7 nature and concept of 'ownership'." }, { level: 2, text: "Alchemist's Analogy: Forging such bond like creating philosopher's stone – requires dedication, trust, communication." }, { level: 3, text: "Requires Deep Compatibility: Finding partner compatible for this intensity is rare and crucial." } ],
        microStory: "'Yours.' The word wasn't just spoken, it was lived. Every breath, every action, offered in service. A profound, chosen reality.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 110, name: "Figging", cardType: "Practice/Kink", visualHandle: "uncommon_figging.jpg", primaryElement: "S",
        elementScores: { A: 3, I: 6, S: 8, P: 6, C: 3, R: 5, RF: 7 },
        briefDescription: "Ginger root = intense sting!",
        detailedDescription: "An old-school BDSM practice involving inserting a piece of peeled ginger root into the anus or vagina. The gingerol compounds react with body heat and moisture, creating an intense, inescapable internal stinging or burning sensation [S] that builds over time. Requires caution and understanding.",
        relatedIds: [9, 8], rarity: 'uncommon', keywords: ['Figging', 'Sensation', 'Intensity', 'Pain Play', 'BDSM', 'Sting', 'Internal', 'Chemical', 'Historical', 'Ginger'],
        lore: [ { level: 1, text: "Internal Alchemical Heat Reaction: Chemical reaction creates unique, inescapable internal warmth/sting." }, { level: 2, text: "Historical Note & Reclaiming: Modern BDSM use reclaims potent sensation for consensual exploration." }, { level: 3, text: "Requires Preparation & Aftercare: Understanding prep, intensity, duration, removal crucial for safety." } ],
        microStory: "A slow burn starting deep inside, inescapable. Couldn't focus on anything but the growing heat. Intense.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 111, name: "Knife Play / Edge Play (Sharp)", cardType: "Practice/Kink", visualHandle: "rare_knife.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 7, S: 9, P: 8, C: 6, R: 6, RF: 9 },
        briefDescription: "Using blades for sensation/fear.", detailedDescription: "Edge play [44] involving the use of knives or other sharp objects for sensation play [S]. Can range from light tracing/pressure to fear play [106] or symbolic marking. Requires extreme skill, control [I], trust [15], and safety awareness.",
        relatedIds: [44, 9, 106, 4, 116, 138], rarity: 'rare', uniquePromptId: "rP111", keywords: ['Knife Play', 'Edge Play', 'Risk', 'Fear', 'Sensation', 'Control', 'Trust', 'Sharp', 'Safety', 'Blade'],
        lore: [ { level: 1, text: "**Safety Advisory:** Playing with sharps carries inherent risks. Requires expert knowledge, control, safety protocols." }, { level: 2, text: "Symbolic Weight: Blade often represents ultimate power, danger, trust. Presence creates intense psych charge." }, { level: 3, text: "Sensation Spectrum: Cold flat, light tracing, sharp pricks, or psychological thrill of perceived danger." } ],
        microStory: "The cold steel tracing a path, never breaking skin, but promising it could. Breath hitched. Danger, held in exquisite check.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 112, name: "Electrostimulation (E-Stim)", cardType: "Practice/Kink", visualHandle: "rare_estim.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 6, S: 9, P: 6, C: 4, R: 5, RF: 7 },
        briefDescription: "Buzz buzz! Electrical sensations.", detailedDescription: "Using specialized devices (like Violet Wands or TENS units) to deliver electrical currents to the body for unique sensations [S]. Can range from tingling to buzzing to involuntary muscle contractions. Requires knowledge of safe equipment use.",
        relatedIds: [9, 57, 119, 72], rarity: 'rare', uniquePromptId: "rP112", keywords: ['E-Stim', 'Electrostimulation', 'Sensation', 'Intensity', 'Involuntary', 'Technology', 'Violet Wand', 'TENS', 'Zap'],
        lore: [ { level: 1, text: "Techno-Kink Note: Modern marvel of sensation play, offering feelings unlike traditional touch." }, { level: 2, text: "Control Aspect: Involuntary muscle contractions bypass conscious control, adding unique layer to power [I]." }, { level: 3, text: "Safety & Equipment: Understanding pad placement, intensity, using body-safe equipment crucial." } ],
        microStory: "Not pain, not pleasure, just... electric fizz. Muscles danced to a current not their own. Alien, fascinating.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 113, name: "Suspension Bondage", cardType: "Practice/Kink", visualHandle: "rare_suspension.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 7, S: 9, P: 8, C: 6, R: 6, RF: 9 },
        briefDescription: "Hanging out (literally!).", detailedDescription: "A form of bondage [16] where someone is lifted partially or fully off the ground using ropes, chains, or other equipment. Creates intense physical sensations [S], profound helplessness [17], and requires expert rigging knowledge for safety [44].",
        relatedIds: [16, 17, 44, 130, 134], rarity: 'rare', uniquePromptId: "rP113", keywords: ['Suspension', 'Bondage', 'Rope', 'Risk', 'Skill', 'Helplessness', 'Intensity', 'Rigging', 'Shibari', 'Kinbaku', 'Vertical'],
        lore: [ { level: 1, text: "**Safety Advisory:** Suspension rigging complex & dangerous if done incorrectly. Requires extensive training." }, { level: 2, text: "Rigger's Perspective: 'Engineering and art combined – creating beauty while defying gravity.'" }, { level: 3, text: "Model's Experience: Can induce profound altered states [P/C] due to physical stress, vulnerability, trust." } ],
        microStory: "Lifted, floating, held only by rope and trust. Gravity became a suggestion. Body weightless, mind adrift.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 114, name: "Water Sports / Urolagnia", cardType: "Practice/Kink", visualHandle: "rare_watersports.jpg", primaryElement: "S",
        elementScores: { A: 6, I: 6, S: 7, P: 7, C: 4, R: 5, RF: 7 },
        briefDescription: "Playing with pee.", detailedDescription: "Sexual arousal or activity involving urine, such as urinating on a partner, being urinated on, or consuming urine [S]. Often plays with taboo [P], humiliation [45], or power dynamics [I].",
        relatedIds: [45, 12, 115], rarity: 'rare', uniquePromptId: "rP114", keywords: ['Watersports', 'Urolagnia', 'Taboo', 'Humiliation', 'Bodily Fluids', 'Piss Play', 'Golden Shower', 'Degradation'],
        lore: [ { level: 1, text: "Taboo Transgression: Allure often lies in breaking strong societal norms around cleanliness." }, { level: 2, text: "Context Note: Can be incorporated into dynamics of control, submission, marking, degradation." }, { level: 3, text: "Health Considerations: Generally low-risk between healthy partners, hygiene important." } ],
        microStory: "The warm cascade, undeniably intimate, utterly taboo. A shared secret transgression, washing away inhibitions.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 115, name: "Scat Play / Coprophilia", cardType: "Practice/Kink", visualHandle: "rare_scat.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 5, S: 6, P: 8, C: 3, R: 4, RF: 8 },
        briefDescription: "Playing with poo (Extreme!).", detailedDescription: "Sexual arousal or activity involving feces [S]. Considered an extreme taboo [P] by most cultures and carries significant health risks. Often involves themes of extreme degradation [45] or power dynamics [I].",
        relatedIds: [114, 45], rarity: 'rare', uniquePromptId: "rP115", keywords: ['Scat', 'Coprophilia', 'Taboo', 'Extreme', 'Risk', 'Bodily Fluids', 'Degradation', 'Humiliation', 'Feces'],
        lore: [ { level: 1, text: "**Health Warning:** Significant health risks due to bacteria/parasites. Meticulous hygiene paramount." }, { level: 2, text: "Psychological Edge: Often considered ultimate taboo, pushing boundaries of disgust." }, { level: 3, text: "Requires Intense Negotiation: Enthusiastic consent, clear boundaries, risk understanding essential." } ],
        microStory: "(Content Warning: Extreme Taboo) The ultimate boundary pushed, the deepest societal 'ick' embraced. A radical confrontation.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 116, name: "Blood Play (Intentional)", cardType: "Practice/Kink", visualHandle: "rare_bloodplay.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 7, S: 8, P: 8, C: 5, R: 6, RF: 8 },
        briefDescription: "Using blood in scenes (HIGH RISK!).", detailedDescription: "Consensually incorporating *small* amounts of blood into sexual activity, often through superficial cutting [111], needle play [9], or leech therapy. Carries HIGH risks of bloodborne pathogens [44] and requires rigorous safety knowledge.",
        relatedIds: [44, 111, 101, 9], rarity: 'rare', uniquePromptId: "rP116", keywords: ['Blood Play', 'Risk', 'Edge Play', 'Ritual', 'Intensity', 'Taboo', 'Safety', 'Blood', 'Cutting', 'Needle Play'],
        lore: [ { level: 1, text: "**Safety Advisory:** Risk of bloodborne pathogens EXTREMELY high. Requires testing, sterile tools, barriers." }, { level: 2, text: "Symbolic Power: Blood carries deep cultural weight: life, death, sacrifice, primal energy." }, { level: 3, text: "Ritualistic Element: Often incorporated into ritual play [101] for intensity/meaning." } ],
        microStory: "A single, perfect drop welling crimson. Not violence, but offering. Life essence shared in a moment of profound trust.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 117, name: "Abduction / Capture Fantasy", cardType: "Practice/Kink", visualHandle: "rare_abduction.jpg", primaryElement: "C",
        elementScores: { A: 6, I: 7, S: 7, P: 8, C: 9, R: 6, RF: 9 },
        briefDescription: "Playing out being captured.", detailedDescription: "A specific kind of CNC [64] role-play scenario involving one partner 'abducting' or 'capturing' the other against their simulated will. Explores themes of powerlessness [17], fear [106], control [I], and surrender [P] within a pre-negotiated fantasy [C].",
        relatedIds: [64, 13, 17, 44, 122], rarity: 'rare', uniquePromptId: "rP117", keywords: ['Abduction', 'Capture', 'CNC', 'Role-Play', 'Fantasy', 'Fear', 'Power', 'Consent', 'Helplessness', 'Scenario'],
        lore: [ { level: 1, text: "Narrative Core: Explores powerlessness, struggle, thrill of being taken out of ordinary life." }, { level: 2, text: "Psychological Depth: Way to process feelings about control, safety, or explore 'darker' fantasies safely." }, { level: 3, text: "Negotiation is Paramount: Requires detailed discussion of limits, safewords, intensity, aftercare." } ],
        microStory: "Dragged into the waiting car, blindfolded. Heart hammered against ribs – terror and excitement warring within. The game had begun.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 118, name: "Somnophilia / Sleep Play", cardType: "Practice/Kink", visualHandle: "rare_somno.jpg", primaryElement: "C",
        elementScores: { A: 7, I: 3, S: 6, P: 7, C: 7, R: 4, RF: 7 },
        briefDescription: "Arousal around sleep/unawareness.", detailedDescription: "Finding arousal from watching [19] or interacting sexually with someone who is (or appears to be) asleep or unaware [C/P]. Within consensual play, requires careful negotiation and often involves simulating unawareness.",
        relatedIds: [19, 17, 64], rarity: 'rare', uniquePromptId: "rP118", keywords: ['Somnophilia', 'Sleep Play', 'Vulnerability', 'Voyeurism', 'Consent', 'Fantasy', 'Unaware', 'Taboo'],
        lore: [ { level: 1, text: "Ethical Tightrope: Line between fantasy and non-consensual acts absolute. Enthusiastic prior consent essential." }, { level: 2, text: "Core Appeal: Often centers on perceived vulnerability [P] of 'sleeping' partner and power of actor [I]." }, { level: 3, text: "Fantasy vs. Reality: Must remain strictly within negotiated fantasy; acting on genuinely asleep is assault." } ],
        microStory: "Watching the gentle rise and fall of their chest in the moonlight. Utterly unaware, completely vulnerable. A forbidden beauty.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 119, name: "Forced Orgasm / Orgasm Control", cardType: "Practice/Kink", visualHandle: "rare_forceorgasm.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 8, S: 8, P: 8, C: 7, R: 6, RF: 9 },
        briefDescription: "Controlling the Big O.", detailedDescription: "A power dynamic where one partner controls when, how, or even if the other partner orgasms [I/RF]. Can involve bringing someone to the edge repeatedly (edging [38]), demanding orgasm on command, or denying it altogether.",
        relatedIds: [38, 11, 4, 5, 112], rarity: 'rare', uniquePromptId: "rP119", keywords: ['Orgasm Control', 'Forced Orgasm', 'Power', 'Control', 'Denial', 'Pleasure', 'Intensity', 'BDSM', 'Edging', 'Command'],
        lore: [ { level: 1, text: "The Ultimate Control?: Manipulating body's most intense pleasure response is profound display of power [I]." }, { level: 2, text: "Receiver's Experience: Can range from frustrating denial [38] to ecstatic surrender [P]." }, { level: 3, text: "Requires Attunement: Understanding partner's limits, desires, physical responses crucial." } ],
        microStory: "'Come for me. Now.' The command cracked like a whip. Body obeyed, mind surrendered. Pleasure, weaponized.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
     {
        id: 120, name: "Psychological Torture Play", cardType: "Practice/Kink", visualHandle: "rare_psychtorture.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 7, S: 4, P: 9, C: 8, R: 6, RF: 10 },
        briefDescription: "Intense mind games & manipulation.", detailedDescription: "Consensual play using intense mind games, manipulation, gaslighting (within agreed limits), emotional challenges, or exploiting vulnerabilities [P/C] to create psychological distress or disorientation. Requires extreme trust [15] and robust aftercare [69].",
        relatedIds: [45, 41, 100, 99, 11], rarity: 'rare', uniquePromptId: "rP120", keywords: ['Psychological Torture', 'Mind Games', 'Manipulation', 'Emotion', 'Power', 'Edge Play', 'Trust', 'Consent', 'Gaslighting', 'Head Games'],
        lore: [ { level: 1, text: "Mind Maze: Delves deep into psyche, challenging perceptions and emotional resilience." }, { level: 2, text: "Potential Goals: Explore themes of breaking/rebuilding self, testing loyalty, confronting fears." }, { level: 3, text: "Safety & Aftercare Paramount: Requires meticulous negotiation, clear safewords, extensive aftercare." } ],
        microStory: "Reality warped with each sentence, doubt creeping in. Was up down? Was pleasure pain? Lost in the labyrinth of their words.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 121, name: "Furry Fandom Sexuality", cardType: "Identity/Role", visualHandle: "rare_furrysex.jpg", primaryElement: "C",
        elementScores: { A: 6, I: 6, S: 5, P: 6, C: 7, R: 6, RF: 4 },
        briefDescription: "Sexy times with fursonas!", detailedDescription: "Expressing sexuality within the context of the furry fandom, often involving anthropomorphic animal characters (fursonas) [C], specific community norms [R], role-play [13], or appreciation for furry art/media [A].",
        relatedIds: [13, 98, 42], rarity: 'rare', uniquePromptId: "rP121", keywords: ['Furry', 'Fandom', 'Identity', 'Role-Play', 'Community', 'Anthropomorphic', 'Fursona', 'Yiff', 'Character'],
        lore: [ { level: 1, text: "Beyond the Suit: 'Fursona' often allows exploring identity, connection, desires more freely." }, { level: 2, text: "Community Context: Sexuality within fandom exists on wide spectrum, shaped by community." }, { level: 3, text: "Creative Expression: Blends personal identity, fantasy [C], artistic creation." } ],
        microStory: "Paws intertwined, muzzles close. Not human, not animal, but something in between, exploring connection in a world of their own making.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 122, name: "Autassassinophilia", cardType: "Orientation", visualHandle: "rare_autassass.jpg", primaryElement: "P",
        elementScores: { A: 5, I: 2, S: 7, P: 8, C: 6, R: 3, RF: 8 },
        briefDescription: "Arousal from *staged* mortal danger.", detailedDescription: "A specific paraphilia finding arousal from the fantasy or staged scenario of being hunted, stalked, or facing mortal danger [P]. Represents an extreme form of edge play [44] involving fear [106] and perceived risk.",
        relatedIds: [44, 106, 117], rarity: 'rare', uniquePromptId: "rP122", keywords: ['Autassassinophilia', 'Risk', 'Fear', 'Edge Play', 'Fantasy', 'Thrill', 'Paraphilia', 'Danger', 'Stalking', 'Hunt'],
        lore: [ { level: 1, text: "The Ultimate Edge?: Takes risk-play themes to their symbolic extreme." }, { level: 2, text: "Safety is Simulation: Real danger is *not* goal; arousal comes from controlled fantasy of threat." }, { level: 3, text: "Psychological Roots: May connect to adrenaline seeking, confronting mortality, complex power." } ],
        microStory: "Footsteps echoed behind them in the dark woods. Hunter or lover? The line blurred in the exhilarating terror.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 123, name: "Exposure Therapy Play", cardType: "Psychological/Goal", visualHandle: "rare_exposure.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 6, S: 5, P: 8, C: 7, R: 7, RF: 7 },
        briefDescription: "Using scenes to process fears/trauma (Carefully!).", detailedDescription: "Carefully negotiated scenes designed to help someone confront and process past traumas, fears, or anxieties [P] in a controlled, consensual BDSM context. Requires immense trust [15], communication [C], and often, collaboration with a therapist.",
        relatedIds: [15, 69, 4, 5], rarity: 'rare', uniquePromptId: "rP123", keywords: ['Exposure Therapy', 'Trauma', 'Healing', 'Psychological', 'Trust', 'Safety', 'BDSM', 'Therapeutic', 'Processing'],
        lore: [ { level: 1, text: "Disclaimer: *Not* replacement for professional therapy; ideally done with guidance." }, { level: 2, text: "Alchemist's Goal: Use controlled intensity/trust of scene to safely re-approach difficult experiences." }, { level: 3, text: "Reclaiming Agency: Can be way to regain sense of control [I] over past experiences." } ],
        microStory: "Revisiting the old fear, but this time, holding the reins. Scene became crucible, transforming terror into strength.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
     {
        id: 124, name: "Sensory Overstimulation Torture", cardType: "Practice/Kink", visualHandle: "rare_sens_torture.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 7, S: 9, P: 7, C: 5, R: 6, RF: 8 },
        briefDescription: "Intentional sensory overload as 'torture'.", detailedDescription: "Using prolonged, unavoidable, or unpleasant sensory input (loud noise, bright lights, strong smells, multiple simultaneous sensations [86]) as a form of consensual 'torture' play [S/P]. Aims to overwhelm or break down resistance.",
        relatedIds: [86, 37, 9, 44], rarity: 'rare', uniquePromptId: "rP124", keywords: ['Sensory Overload', 'Torture', 'Intensity', 'Sensation', 'Endurance', 'Control', 'Overstimulation', 'Psychological', 'Deprivation'],
        lore: [ { level: 1, text: "The Goal?: Disorientation, pushing endurance, breaking mental defenses via sensory assault." }, { level: 2, text: "Rhythm & Relief: Contrast key; overload often followed by deprivation [37] or quiet." }, { level: 3, text: "Mind Under Siege: Pushes limits of cognitive processing [C], emotional regulation [P]." } ],
        microStory: "White noise screamed, strobe lights flashed, ice traced skin. Nowhere to hide from the onslaught. Thought dissolved.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 125, name: "Breath Control (Advanced)", cardType: "Practice/Kink", visualHandle: "rare_breath_adv.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 7, S: 9, P: 8, C: 4, R: 6, RF: 10 },
        briefDescription: "Precise breathing manipulation (EXTREME RISK!).", detailedDescription: "Advanced, highly technical forms of breath play [63] involving more precise control over inhalation/exhalation cycles, potentially using tools like rebreather bags or masks under extremely controlled, knowledgeable, and vigilant conditions. May involve coaching specific breathing patterns to induce altered states. **Carries extreme and potentially lethal risks.** Requires expert knowledge and safety protocols.",
        relatedIds: [63, 44, 17], rarity: 'rare', uniquePromptId: "rP125", keywords: ['Breath Play', 'Asphyxiation', 'Risk', 'Edge Play', 'Control', 'Intensity', 'Skill', 'Safety', 'Hypoxia', 'Hypercapnia', 'Advanced', 'High-Risk'],
        lore: [ { level: 1, text: "**SAFETY ADVISORY: LETHAL RISKS SEVERE!** Requires expert knowledge, protocols, emergency readiness." }, { level: 2, text: "Allure for Experienced: Represents ultimate edge [44], pushing boundaries of sensation [S], trust [15], surrender [P]." }, { level: 3, text: "Requires Calmness & Expertise Under Pressure: Top must remain hyper-vigilant, knowledgeable [I/C]." } ],
        microStory: "(High Risk Content) Air measured, rationed. Each gasp a gift, each denial a lesson in trust. Floating on the edge of consciousness.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
     },
    {
        id: 126, name: "Brat", cardType: "Identity/Role", visualHandle: "brat.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 7, S: 5, P: 7, C: 6, R: 5, RF: 8 },
        briefDescription: "Enjoys playful defiance...", detailedDescription: "A submissive-leaning [I] role characterized by playful disobedience, testing boundaries, sass, and enjoying the 'taming' process. Relies on negotiated rules and a dominant partner [4] who enjoys the challenge.",
        relatedIds: [5, 7, 93, 38, 136], rarity: 'uncommon', keywords: ['Brat', 'Playful Defiance', 'Teasing', 'Testing Limits', 'Mischief', 'Interaction', 'Submissive', 'Sass', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Playful Defiance, Mischief, Boundary Testing." }, { level: 2, text: "Expression: Ranges from witty banter to elaborate playful resistance." }, { level: 3, text: "Dynamic Note: Requires clear communication and partner who enjoys the 'taming'." } ],
        microStory: "'Make me.' The smirk was practically audible. The fun wasn't in obeying, but in making them work for it.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 127, name: "Little", cardType: "Identity/Role", visualHandle: "little.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 3, S: 3, P: 9, C: 7, R: 6, RF: 7 },
        briefDescription: "Embraces a carefree, childlike spirit...", detailedDescription: "A role within Age Play [39] where an individual embodies a younger, often innocent and dependent persona. Seeks comfort, guidance, and care [P] from a Caregiver [58] figure.",
        relatedIds: [5, 10, 39, 58, 82, 80, 129, 138], rarity: 'uncommon', keywords: ['Little', 'Age Play', 'CGL', 'Regression', 'Innocence', 'Nurturing', 'Caregiver', 'Psychological', 'Comfort', 'DDlg', 'MDlb', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Age Regression Comfort, Need for Guidance, Innocence Seeking." }, { level: 2, text: "Expression: Ranges from occasional comfort seeking to deep 'littlespace'." }, { level: 3, text: "Dynamic Note: Requires immense trust, clear boundaries, dedicated Caregiver." } ],
        microStory: "Curled up with stuffies, world simplified to cartoons and gentle rules. The weight of adulthood lifted, replaced by cozy safety.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 128, name: "Masochist", cardType: "Identity/Role", visualHandle: "masochist.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 4, S: 9, P: 8, C: 4, R: 5, RF: 6 },
        briefDescription: "Finds pleasure/release through pain/intensity.", detailedDescription: "An identity centered on deriving pleasure, catharsis, focus, or psychological release [P] from receiving physical pain [S] or intense sensation within a consensual context. Often, but not always, linked to submissive roles [5].",
        relatedIds: [5, 9, 8, 17, 38, 44, 99, 135, 91], rarity: 'uncommon', keywords: ['Masochism', 'Pain Play', 'Sensation', 'Intensity', 'Endorphins', 'Catharsis', 'Endurance', 'Submissive', 'Bottom', 'Role'],
        lore: [ { level: 1, text: "Core Concepts: Pain Interpretation, Sensation Seeking, Endurance." }, { level: 2, text: "Experience: Ranges from finding focus/release in pain to interpreting it as pleasure." }, { level: 3, text: "Dynamic Note: Effective pain play requires excellent communication of limits/desires." } ],
        microStory: "The sharp intake of breath wasn't *just* pain. It was focus, release, a strange clarity found only on the edge of sensation.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 129, name: "Nurturer", cardType: "Identity/Role", visualHandle: "nurturer.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 7, S: 3, P: 9, C: 5, R: 7, RF: 7 },
        briefDescription: "Focuses on emotional support & care.", detailedDescription: "A dominant-leaning [I] role primarily focused on providing emotional support, comfort [80], guidance, and safety [P] for their partner(s). Patience, empathy, and attentiveness are key traits. Often associated with Caregiver roles [58].",
        relatedIds: [4, 10, 15, 31, 58, 69, 82, 127, 90], rarity: 'uncommon', keywords: ['Nurturer', 'Caregiver', 'Dominant', 'Emotional Support', 'Patience', 'Empathy', 'Guidance', 'Comfort', 'Safety', 'Psychological', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Emotional Support Focus, Patience, Empathy." }, { level: 2, text: "Expression: Ranges from good listener/reassurance to structured guidance/care." }, { level: 3, text: "Dynamic Note: Requires strong self-care boundaries to avoid burnout." } ],
        microStory: "Smoothing back stray hairs, listening without judgment. Holding space for their vulnerability was its own form of quiet strength.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 130, name: "Rigger", cardType: "Identity/Role", visualHandle: "rigger.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 8, S: 8, P: 6, C: 8, R: 6, RF: 7 },
        briefDescription: "Artist of restraint and sensation using rope.", detailedDescription: "A role focused on the technical skill and artistry of tying rope bondage [16]. Involves knowledge of knots, anatomy, safety protocols [44], and often an aesthetic vision [C]. Typically a Dominant-leaning role [I].",
        relatedIds: [4, 16, 17, 44, 87, 101, 113, 134], rarity: 'rare', keywords: ['Rigger', 'Rope Bondage', 'Shibari', 'Kinbaku', 'Dominant', 'Sensory', 'Cognitive', 'Aesthetic', 'Skill', 'Precision', 'Restraint', 'Safety', 'Role'],
        lore: [ { level: 1, text: "Core Skills: Rope Technique Mastery, Aesthetic Vision, Precision Application." }, { level: 2, text: "Progression: Simple functional ties to complex aesthetic patterns, potentially suspension [113]." }, { level: 3, text: "Ethos: Safety through knowledge is paramount. Trust woven with every knot." } ],
        microStory: "Hands moved with practiced grace, rope flowing like ink. Creating patterns, binding form, sculpting sensation.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 131, name: "Master", cardType: "Identity/Role", visualHandle: "master.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 9, S: 5, P: 8, C: 8, R: 7, RF: 9 },
        briefDescription: "Commands with high expectations & deep presence.", detailedDescription: "A Dominant role [4] often implying significant authority, experience, and responsibility within a dynamic, potentially M/s [109]. Characterized by presence, setting high standards, and often a deep understanding of their submissive(s) [P].",
        relatedIds: [4, 11, 30, 109, 10, 81, 100, 132, 137, 136, 139], rarity: 'rare', keywords: ['Master', 'Dominant', 'Authority', 'Control', 'Presence', 'Structure', 'M/s', 'Power Exchange', 'Commitment', 'Leadership', 'TPE', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Expectation Setting, Commanding Presence, Depth of Dominance." }, { level: 2, text: "Expression: Ranges from strong scene authority to seeking/engaging in TPE." }, { level: 3, text: "Foundation: Role often built on immense trust, clear communication, established ethics." } ],
        microStory: "The weight of the title settled comfortably. Responsibility, yes, but also the quiet satisfaction of shaping a shared world.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 132, name: "Slave", cardType: "Identity/Role", visualHandle: "slave.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 1, S: 5, P: 9, C: 6, R: 8, RF: 9 },
        briefDescription: "Finds deep fulfillment in total devotion & service.", detailedDescription: "A Submissive role [5] characterized by deep devotion, surrender of autonomy, and focus on service [10] within an M/s [109] or similar high-commitment dynamic [R]. Often involves a profound psychological [P] shift.",
        relatedIds: [5, 10, 11, 17, 30, 109, 99, 131, 136], rarity: 'rare', keywords: ['Slave', 'M/s', 'Devotion', 'Surrender', 'Service', 'Total Power Exchange', 'TPE', 'Commitment', 'Psychological', 'Submissive', 'Role', 'Obedience'],
        lore: [ { level: 1, text: "Core Traits: Profound Devotion, Deep Surrender Focus, Service Orientation." }, { level: 2, text: "Expression: Ranges from deep scene commitment to identity integrated into daily life (TPE)." }, { level: 3, text: "Dynamic Note: Requires rigorous negotiation, explicit consent, deep trust with compatible Master/Mistress." } ],
        microStory: "No longer 'I', but 'Yours'. The shift was terrifying, exhilarating. Purpose found not in freedom, but in perfect alignment.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 133, name: "Pet", cardType: "Identity/Role", visualHandle: "pet.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 3, S: 6, P: 7, C: 6, R: 6, RF: 7 },
        briefDescription: "Enjoys embodying an animal persona...", detailedDescription: "A role within Pet Play [98] where an individual takes on the characteristics and mindset of a specific animal (e.g., kitten, puppy). Often involves non-verbal communication [I], seeking affection [P], playfulness, and following the direction of an Owner/Handler [4].",
        relatedIds: [5, 10, 39, 98, 80, 91, 127], rarity: 'uncommon', keywords: ['Pet Play', 'Animal Persona', 'Affection', 'Playfulness', 'Validation', 'Non-verbal', 'Submissive', 'Interaction', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Affection Seeking, Playfulness, Non-verbal Expression Focus." }, { level: 2, text: "Expression: Ranges from occasional playful moments to deep immersion in 'petspace'." }, { level: 3, text: "Dynamic Note: Requires Owner/Handler who understands/enjoys engaging with persona." } ],
        microStory: "A soft purr rumbled in their chest, seeking the warmth of a familiar hand. Worries dissolved into simple needs: naps, snacks, headpats.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 134, name: "Rope Bunny", cardType: "Identity/Role", visualHandle: "rope_bunny.jpg", primaryElement: "S",
        elementScores: { A: 5, I: 3, S: 8, P: 7, C: 5, R: 6, RF: 6 },
        briefDescription: "Loves the art and sensation of being tied.", detailedDescription: "Someone who specifically enjoys being tied up, particularly with rope [16]. Appreciates the aesthetic, the sensation of restriction [S], the vulnerability [P], and the trust involved in being tied by a Rigger [130].",
        relatedIds: [5, 16, 17, 87, 113, 2, 9, 130, 91], rarity: 'uncommon', keywords: ['Rope Bunny', 'Rope Bondage', 'Shibari', 'Kinbaku', 'Submissive', 'Bottom', 'Sensory', 'Aesthetic', 'Trust', 'Vulnerability', 'Patience', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Rope Enthusiasm, Patience During Tying, Sensory Receptivity." }, { level: 2, text: "Experience: Ranges from enjoying simple decorative ties to complex suspensions [113]." }, { level: 3, text: "Safety Note: Clear communication about comfort, numbness, circulation vital." } ],
        microStory: "Waiting patiently as the ropes transformed them into living art. Each knot a punctuation mark in a silent conversation.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 135, name: "Painslut", cardType: "Identity/Role", visualHandle: "painslut.jpg", primaryElement: "S",
        elementScores: { A: 4, I: 2, S: 9, P: 8, C: 4, R: 5, RF: 8 },
        briefDescription: "Craves intense sensation & pushes limits.", detailedDescription: "A Masochistic [128] identity characterized by an active craving for intense physical sensation [S], often pushing boundaries [44] and finding validation [P] or release through enduring significant pain. Often associated with bottom/submissive roles [5].",
        relatedIds: [5, 9, 8, 128, 44, 99, 38, 119, 138], rarity: 'rare', keywords: ['Painslut', 'Masochism', 'Pain Seeking', 'Intensity', 'Craving', 'Endurance', 'Sensation', 'Bottom', 'Submissive', 'Edge Play', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Active Pain Seeking, Endurance Display, Sensation Craving." }, { level: 2, text: "Spectrum: Ranges from enthusiastically requesting intense sensations to needing extreme input." }, { level: 3, text: "Safety Imperative: Requires extreme trust, clear limits, experienced partners, diligent aftercare [69]." } ],
        microStory: "Not just enduring the sting, but *asking* for it. Craving the intensity that blurred the line between pain and ecstatic release.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 136, name: "Strict", cardType: "Identity/Role", visualHandle: "strict.jpg", primaryElement: "I",
        elementScores: { A: 3, I: 8, S: 4, P: 7, C: 7, R: 6, RF: 8 },
        briefDescription: "Maintains order through clear rules & discipline.", detailedDescription: "A Dominant-leaning [I] style focused on establishing and enforcing clear rules, protocols [30], or standards of behavior, often involving discipline or consequences for infractions. Requires consistency and fairness.",
        relatedIds: [4, 11, 30, 101, 109, 90, 100, 126, 131], rarity: 'uncommon', keywords: ['Strict', 'Disciplinarian', 'Dominant', 'Rules', 'Structure', 'Order', 'Enforcement', 'Consequences', 'Training', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Rule Enforcement Focus, Discipline Orientation, Consistency." }, { level: 2, text: "Approach: Ranges from consistent guidance/correction to zero-tolerance enforcement." }, { level: 3, text: "Balance: Effective strictness often balances clear expectations with fairness." } ],
        microStory: "Rules weren't suggestions, they were the architecture of their shared world. Precision was expected, deviation corrected.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 137, name: "Mistress", cardType: "Identity/Role", visualHandle: "mistress.jpg", primaryElement: "I",
        elementScores: { A: 6, I: 9, S: 5, P: 7, C: 7, R: 6, RF: 8 },
        briefDescription: "Leads with elegance, authority & high standards.", detailedDescription: "A specific type of female Dominant [4], often characterized by an air of authority, elegance, confidence [81], and expecting high standards of service [10] or obedience [11] from their submissive(s).",
        relatedIds: [4, 11, 21, 104, 81, 90, 100, 101, 131, 129], rarity: 'uncommon', keywords: ['Mistress', 'Dominant', 'Femdom', 'Authority', 'Presence', 'Elegance', 'Control', 'High Standards', 'Creativity', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Expectation Setting, Commanding Presence, Creativity/Elegance." }, { level: 2, text: "Expression: Ranges from setting clear standards to effortless, implicit control." }, { level: 3, text: "Nuance: Style can vary widely – strict [136], nurturing [129], sadistic [138], etc." } ],
        microStory: "A flick of the wrist, a raised eyebrow conveying more than shouted commands. Authority worn lightly, devastatingly effective.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 138, name: "Sadist", cardType: "Identity/Role", visualHandle: "sadist.jpg", primaryElement: "P",
        elementScores: { A: 4, I: 7, S: 8, P: 9, C: 6, R: 5, RF: 7 },
        briefDescription: "Finds pleasure/excitement from partner's pain/distress.", detailedDescription: "An identity centered on deriving pleasure, arousal, or psychological satisfaction [P] from consensually inflicting physical pain [S] or emotional/psychological distress [99] on a partner. Ethical sadism requires empathy and strict adherence to limits.",
        relatedIds: [4, 8, 9, 44, 45, 100, 111, 119, 120, 128, 135, 129, 137], rarity: 'uncommon', keywords: ['Sadist', 'Sadism', 'Dominant', 'Pain Play', 'Intensity', 'Sensation Control', 'Psychological', 'Control', 'Empathy', 'Role'],
        lore: [ { level: 1, text: "Core Elements: Sensation Control, Psychological Focus, Sadism." }, { level: 2, text: "Focus: Ranges from enjoying controlled reactions to playing with physical/emotional limits." }, { level: 3, text: "Ethical Sadism: Requires deep trust, negotiation, empathy, thorough aftercare [69]." } ],
        microStory: "Their whimper was the sweetest music. Not cruelty, but a shared dance where pleasure walked hand-in-hand with precisely dealt pain.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    },
    {
        id: 139, name: "Hunter", cardType: "Identity/Role", visualHandle: "hunter.jpg", primaryElement: "I",
        elementScores: { A: 5, I: 9, S: 7, P: 6, C: 5, R: 5, RF: 7 },
        briefDescription: "Thrives on the thrill of the chase & capture.", detailedDescription: "A Dominant-leaning [I] role focused on the excitement of pursuit, the strategy of the 'hunt,' and the satisfaction of 'capturing' their prey (partner). Often involves primal play [40], chase scenes, or capture fantasies [117].",
        relatedIds: [4, 40, 7, 8, 117, 122, 44, 131], rarity: 'uncommon', keywords: ['Hunter', 'Predator', 'Primal Play', 'Chase', 'Capture', 'Pursuit', 'Dominant', 'Interaction', 'Instinct', 'Adrenaline', 'Role'],
        lore: [ { level: 1, text: "Core Traits: Pursuit Drive, Instinct Reliance, Strategic Boldness." }, { level: 2, text: "Style: Ranges from playful, teasing pursuits to intense, strategic 'hunts'." }, { level: 3, text: "Dynamic Note: Requires clear rules, boundaries, safewords, especially if involving fear [106]." } ],
        microStory: "The scent of fear, the thrill of pursuit. Cornered, finally. The hunt was as satisfying as the capture.",
        sceneSeed: null, deepLore: null, crossover: null, secretScene: null, altSkin: null, perk: null
    }
];

// --- Questionnaire Data ---
const questionnaireGuided = {
    "Attraction": [ { qId: "a1", type: "slider", text: "How specific are triggers?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Very Broad", maxLabel: "Very Specific", scoreWeight: 1.0 }, { qId: "a2", type: "checkbox", text: "Significant factors? (Max 2)", options: [ { value: "Appearance/Body", points: 0.5 }, { value: "Gender", points: 0.5 }, { value: "Personality", points: 0.0 }, { value: "Intellect", points: 0.5 }, { value: "Power/Confidence", points: 1.0 }, { value: "Vulnerability/Submissiveness", points: 1.0 }, { value: "Emotional Bond", points: -1.0 }, { value: "Clothing/Materials", points: 1.5 }, { value: "Context/Role-play", points: 1.0 } ], scoreWeight: 1.0, maxChoices: 2 }, { qId: "a3", type: "radio", text: "Emotional bond required first?", options: [ { value: "Essential", points: -2.0 }, { value: "Helpful", points: -0.5 }, { value: "Neutral", points: 0 }, { value: "Unimportant", points: 1.0 } ], scoreWeight: 1.0 } ],
    "Interaction": [ { qId: "i1", type: "slider", text: "Natural leaning: Directing vs. Yielding?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Strongly Yielding", maxLabel: "Strongly Directing", scoreWeight: 1.0 }, { qId: "i2", type: "checkbox", text: "Appealing directional roles? (Max 2)", options: [ { value: "Taking Charge/Dominating", points: 1.5 }, { value: "Guiding/Attentive Top", points: 1.0 }, { value: "Switching Roles/Adapting", points: 0.0 }, { value: "Following Directions/Submitting", points: -1.5 }, { value: "Serving/Focusing on Partner", points: -1.0 }, { value: "Performing/Being Directed", points: -0.5 } ], scoreWeight: 1.0, maxChoices: 2 }, { qId: "i3", type: "radio", text: "Prefer power difference or equality?", options: [ { value: "Clear Diff (Leading)", points: 1.5 }, { value: "Clear Diff (Following)", points: -1.5 }, { value: "Subtle Dynamics", points: 0.0 }, { value: "Equal Footing", points: 0.0 }, { value: "Depends", points: 0.0 } ], scoreWeight: 1.0 } ],
    "Sensory": [ { qId: "s1", type: "slider", text: "Importance of sensation intensity/variety?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Low/Subtle", maxLabel: "High/Intensity", scoreWeight: 1.0 }, { qId: "s2", type: "checkbox", text: "Appealing sensations? (Max 2)", options: [ { value: "Gentle Touch/Warmth", points: -1.0 }, { value: "Firm Pressure/Massage", points: 0.0 }, { value: "Sharp/Stinging", points: 1.5 }, { value: "Temperature Play", points: 1.5 }, { value: "Restriction/Binding", points: 1.0 }, { value: "Specific Textures", points: 1.0 }, { value: "Vibration/E-Stim", points: 1.5 } ], scoreWeight: 1.0, maxChoices: 2 }, { qId: "s3", type: "radio", text: "How about pain/extreme sensations?", options: [ { value: "Strongly Drawn To", points: 2.0 }, { value: "Open To Explore", points: 1.0 }, { value: "Neutral", points: 0 }, { value: "Prefer Avoid", points: -1.0 }, { value: "Strongly Averse", points: -2.0 } ], scoreWeight: 1.0 } ],
    "Psychological": [ { qId: "p1", type: "slider", text: "Sexuality tied to deeper needs?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Primarily Physical", maxLabel: "Primary Driver", scoreWeight: 1.0 }, { qId: "p2", type: "checkbox", text: "Which needs met MOST via sex? (Max 2)", options: [ { value: "Connection/Intimacy", points: 1.5 }, { value: "Power/Control (Give/Receive)", points: 1.5 }, { value: "Validation/Desired", points: 1.0 }, { value: "Escape/Stress Relief", points: 0.5 }, { value: "Catharsis/Release", points: 1.0 }, { value: "Self-Exploration/Expression", points: 0.5 }, { value: "Security/Comfort", points: 0.0 }, { value: "Fun/Recreation", points: -1.0 } ], scoreWeight: 1.0, maxChoices: 2 }, { qId: "p3", type: "radio", text: "Incomplete if specific need unmet?", options: [ { value: "Yes, Often", points: 1.5 }, { value: "Sometimes", points: 0.5 }, { value: "Rarely", points: -0.5 }, { value: "Never", points: -1.5 } ], scoreWeight: 1.0 } ],
    "Cognitive": [ { qId: "c1", type: "slider", text: "Importance of mental engagement?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Prefer Presence", maxLabel: "Mentally Driven", scoreWeight: 1.0 }, { qId: "c2", type: "checkbox", text: "Which mental aspects enhance arousal? (Max 2)", options: [ { value: "Internal Fantasies", points: 1.5 }, { value: "Role-Playing Scenarios", points: 1.5 }, { value: "Dirty Talk/Language", points: 1.0 }, { value: "Intellectual Banter/Mind Games", points: 1.0 }, { value: "Understanding Partner Psych", points: 0.5 }, { value: "Anticipation/Planning", points: 1.0 }, { value: "Being 'In the Moment'", points: -1.5 } ], scoreWeight: 1.0, maxChoices: 2 }, { qId: "c3", type: "radio", text: "Prefer spontaneous or planned?", options: [ { value: "Strongly Prefer Planned", points: 1.5 }, { value: "Lean Planned", points: 0.5 }, { value: "No Preference", points: 0 }, { value: "Lean Spontaneous", points: -0.5 }, { value: "Strongly Prefer Spontaneous", points: -1.5 } ], scoreWeight: 1.0 } ],
    "Relational": [ { qId: "r1", type: "slider", text: "Ideal number of partners?", minValue: 0, maxValue: 10, defaultValue: 3, minLabel: "Strictly One/Solo", maxLabel: "Multiple/Fluid", scoreWeight: 1.0 }, { qId: "r2", type: "checkbox", text: "Comfortable/Desirable contexts? (Max 2)", options: [ { value: "Solitary", points: -1.5 }, { value: "Committed Monogamy", points: -1.0 }, { value: "Casual/FWB", points: 0.5 }, { value: "Open Relationship", points: 1.0 }, { value: "Polyamory", points: 1.5 }, { value: "Group Sex", points: 1.0 }, { value: "Anonymous", points: 0.5 } ], scoreWeight: 1.0, maxChoices: 2 }, { qId: "r3", type: "radio", text: "Importance of relationship hierarchy?", options: [ { value: "Very Important", points: -1.0 }, { value: "Somewhat Important", points: -0.5 }, { value: "Neutral", points: 0 }, { value: "Prefer Non-Hierarchical", points: 1.0 }, { value: "Strongly Against", points: 1.5 } ], scoreWeight: 1.0 } ],
    "RoleFocus": [ { qId: "rf1", type: "slider", text: "How central are defined roles/dynamics?", minValue: 0, maxValue: 10, defaultValue: 5, minLabel: "Not Important", maxLabel: "Essential Core", scoreWeight: 1.0 }, { qId: "rf2", type: "checkbox", text: "View on power dynamics? (Max 2)", options: [ { value: "Unnecessary/Uncomfortable", points: -1.5 }, { value: "Occasional spice, not needed", points: -0.5 }, { value: "Clear dynamics feel safe/structured", points: 1.0 }, { value: "Exploring power is key part", points: 1.5 }, { value: "Fluid/shifting dynamics exciting", points: 0.5 }, { value: "Feel most myself in specific role", points: 1.5 } ], scoreWeight: 1.0, maxChoices: 2 }, { qId: "rf3", type: "radio", text: "How often desire role-play/power exchange?", options: [ { value: "Rarely/Never", points: -1.5 }, { value: "Occasionally", points: -0.5 }, { value: "Sometimes", points: 0.5 }, { value: "Frequently", points: 1.5 }, { value: "Constantly", points: 2.0 } ], scoreWeight: 1.0 } ]
};

// --- Reflection Prompts ---
const reflectionPrompts = {
    "Attraction": [ { id: "pA1", text: "Recall something recent that sparked 'whoa, hello!' What element caught attention?" }, { id: "pA2", text: "Think of confusing attraction. What insight gleaned from that detour?" }, { id: "pA3", text: "Does emotional closeness impact sexual attraction intensity/frequency?" }, { id: "pA4", text: "Why did a past intense attraction fizzle? Them, you, situation, cycle complete?" } ],
    "Interaction": [ { id: "pI1", text: "Most satisfying dance: Leading, following, improvising? What made it feel right?" }, { id: "pI2", text: "Ideal encounter vibe: Playful? Intense? Tender? Authoritative? Yielding? Describe essence." }, { id: "pI3", text: "Navigating flow: Rely more on words or vibes/intuition?" }, { id: "pI4", text: "Power dynamics: Appeal of being in charge? Appeal/release in letting go?" } ],
    "Sensory": [ { id: "pS1", text: "Beyond orgasm: What pure touch feels amazing? Light? Firm? Rough? Specific fabrics/temps?" }, { id: "pS2", text: "Specific sensations (heat, binding, sting, scent) amplify arousal? Any instant 'no-gos'?" }, { id: "pS3", text: "Does sensory preference change with mood, stress, partner? Flexible or consistent?" }, { id: "pS4", text: "Recall deeply satisfying sensory moment (intimate or not). What ingredients made it potent?" } ],
    "Psychological": [ { id: "pP1", text: "Beyond physical: What core need/longing does intimacy fulfill? Connection? Power? Validation? Escape? Comfort? Catharsis? Expression?" }, { id: "pP2", text: "Profoundly satisfying intimacy: What core need felt truly met/seen/nourished?" }, { id: "pP3", text: "Psychologically 'meh' intimacy: What essential ingredient felt missing?" }, { id: "pP4", text: "How does embracing vulnerability/being seen play into most rewarding experiences?" } ],
    "Cognitive": [ { id: "pC1", text: "Mind theater active? Fantasy? Analysis? Or fully present in sensation/emotion?" }, { id: "pC2", text: "Fantasy/scenario/mental play that reliably sparks desire? Core element?" }, { id: "pC3", text: "Mental game (banter, strategy, psych intrigue) as/more arousing than physical?" }, { id: "pC4", text: "How do anticipation (planning) or memory (replaying) enhance experiences?" } ],
    "Relational": [ { id: "pR1", text: "Where feel most free/authentic expressing sexy self? Solo? Dyad? Casual? Group? Blend?" }, { id: "pR2", text: "Rules vs. Vibes vs. Anarchy: Importance of agreements, exclusivity, hierarchy? Or organic evolution?" }, { id: "pR3", text: "Sweet spot for emotional closeness/vulnerability? Deep always? Light okay? Varies?" }, { id: "pR4", text: "Non-monogamy feelings: How do jealousy/envy show up? Experience/cultivate compersion?" } ],
    "RoleFocus": [ { id: "pRF1", text: "When felt powerfully in charge (any context)? What did confidence feel like?" }, { id: "pRF2", text: "When trustingly followed someone's lead? Emotional quality? Relief, vulnerability, excitement?" }, { id: "pRF3", text: "If Switch: What triggers desire to shift polarity? Internal/external? Enjoyable part of shift?" }, { id: "pRF4", text: "How does preferred Role Focus interact with other elements (e.g., High RF + High Control [I])?" } ],
    "Dissonance": [ { id: "pD1", text: "Concept feels like static... Acknowledge discomfort. What specific part makes you tilt head 'Huh, interesting...'?" }, { id: "pD2", text: "Exploring edges... If leaned in hypothetically (thought/fantasy), what *potential* insight/pleasure offered?" }, { id: "pD3", text: "Mirror to self? Does concept poke at fear, taboo, unacknowledged desire/need?" }, { id: "pD4", text: "How could *understanding* this different view (even if not for you) broaden appreciation of own complexity?" } ],
    "Guided": { "LowAttunement": [ { id: "gLA1", text: "Beginning journey... Which core Element feels most mysterious/intriguing/intimidating now? Ponder." }, { id: "gLA2", text: "Initial scores... any surprises? How feels seeing aspects mapped? Questions?" } ], "HighAttunementElement": [ { id: "gHE1", text: "Strong resonance with [Element Name]! How manifests in daydreams/fantasy/real life? Specific flavors?" }, { id: "gHE2", text: "Strongest affinities have shadows/edges. Where challenge/pitfall/next learning in deep [Element Name] attunement?" } ], "ConceptSynergy": [ { id: "gCS1", text: "Focusing [Concept A] + [Concept B] creates interesting mix! How play together? Harmonize, contrast, amplify, challenge?" }, { id: "gCS2", text: "What new flavor/dynamic/possibility bubbles up blending essence of [Concept A] + [Concept B]?" } ] },
    "RareConcept": {
        "rP08": { id: "rP08", text: "Heavy Impact: What's the core allure? Raw sensation, visual proof, power dynamic, release, or something else?" },
        "rP09": { id: "rP09", text: "Non-Impact Pain: What specific *quality* resonates? Focus demanded, vulnerability created, pleasure contrast, mental game?" },
        "rP11": { id: "rP11", text: "Command & Control: The thrill? Certainty of command, surrender of obedience, or shared focus/structure?" },
        "rP12": { id: "rP12", text: "Objectification Play: Underlying need/fantasy? Focus, power, dehumanization themes, utility, something else?" },
        "rP14": { id: "rP14", text: "Fantasy Immersion: What ingredients make fantasy feel real, captivating, consuming? Narrative, archetypes, emotional tone?" },
        "rP16": { id: "rP16", text: "Rope Bondage: Drawn more to patterns, pressure, restricted stillness, or energetic connection?" },
        "rP17": { id: "rP17", text: "Restriction/Helplessness: What emotions/states surface most strongly? Surrender, excitement, vulnerability, peace, unique cocktail?" },
        "rP20": { id: "rP20", text: "Material Focus: Which sense most engaged? Look, smell, sound, feel? Specific material?" },
        "rP21": { id: "rP21", text: "Uniform/Clothing Fetish: Strongest spark? What story, role, power, archetype invoked?" },
        "rP25": { id: "rP25", text: "Polyamory: Biggest joys/rewards? Trickiest emotional/logistical challenges?" },
        "rP27": { id: "rP27", text: "Relationship Anarchy: How build trust, define commitments, navigate intimacy without traditional rulebook?" },
        "rP30": { id: "rP30", text: "High Protocol D/s: Deep appeal? Clarity, challenge of perfection, transformation of self?" },
        "rP38": { id: "rP38", text: "Tease & Denial: Most potent part? Mounting physical tension, psychological test of will, surrender to control?"},
        "rP41": { id: "rP41", text: "Erotic Hypnosis/Mind Control: What boundaries, protocols, aftercare essential to explore safely?" },
        "rP42": { id: "rP42", text: "Transformation Fetish: What *kind* of transformation most intriguing? What desire/fear/identity exploration represents?" },
        "rP43": { id: "rP43", text: "Medical Play: Core draw? Vulnerability, authority differential, tools/procedures, power dynamic?" },
        "rP44": { id: "rP44", text: "Edge Play: What safety negotiations, check-ins, contingencies non-negotiable?" },
        "rP45": { id: "rP45", text: "Humiliation/Degradation: Where line between fun consensual play and genuine hurt? How communicate/respect boundary?" },
        "rP63": { id: "rP63", text: "Breath Play: Specific physical feeling, mental shift, surrender level sought? How safety *always* top priority?" },
        "rP64": { id: "rP64", text: "CNC: How ensure all feel genuinely safe, informed, empowered with boundaries/safewords *before* scene?" },
        "rP65": { id: "rP65", text: "Chemsex/PnP: Radically honest motivations? Enhanced sensation, lowered inhibition, social connection, endurance? Actively managing risks?" },
        "rP109": { id: "rP109", text: "M/s Dynamic: How concept of 'ownership' or total authority/surrender feel different/more significant than other D/s?" },
        "rP111": { id: "rP111", text: "Knife Play: Thrill from visual threat, sensation, implied danger/vulnerability, or demonstration of trust?" },
        "rP112": { id: "rP112", text: "E-Stim: How involuntary nature compare to other touch/pressure/pain? What makes it intriguing?" },
        "rP113": { id: "rP113", text: "Suspension Bondage: Main appeal: visual aesthetic, physical strain/sensation, vulnerability/surrender, or skill/trust involved?" },
        "rP114": { id: "rP114", text: "Water Sports: What specific taboos, body feelings, power dynamics (marking/humiliation) engaged?" },
        "rP115": { id: "rP115", text: "(Extreme Taboo) Scat Play: If resonates (conceptually), what complex psych themes (degradation, primal connection, taboo breaking) or power dynamics involved?" },
        "rP116": { id: "rP116", text: "(High Risk) Blood Play: What symbolic weight, visceral reaction, cultural association does blood hold?" },
        "rP117": { id: "rP117", text: "Abduction/Capture Fantasy: Most charge? Initial surprise/struggle, captivity/helplessness, dynamic with captor, escape/surrender?" },
        "rP118": { id: "rP118", text: "Somnophilia/Sleep Play: What ethical lines around consent/awareness crucial even within fantasy/role-play?" },
        "rP119": { id: "rP119", text: "Orgasm Control: How feel different from simple tease/denial [38]? What communicate about control, pleasure, surrender, endurance?" },
        "rP120": { id: "rP120", text: "Psychological 'Torture': What specific soothing, reconnection, reality-checking (aftercare) feels essential after?" },
        "rP121": { id: "rP121", text: "Furry Sexuality: How unique blend of identity, role-play, community, fantasy shape desires/expression?" },
        "rP122": { id: "rP122", text: "Autassassinophilia: What deep psych thrill, adrenaline rush, confrontation with mortality found in flirting (safely!) with this ultimate simulated threat?" },
        "rP123": { id: "rP123", text: "Exposure Therapy Play: How controlled intensity/trust potentially facilitate processing without re-traumatizing? Crucial safety/support?" },
        "rP124": { id: "rP124", text: "Sensory Overstimulation 'Torture': Goal disorientation? Pushing endurance? Breaking defenses? Testing control? Altered state?" },
        "rP125": { id: "rP125", text: "(Extreme Risk) Advanced Breath Control: Deeper altered state, profound sensation, ultimate test of trust/surrender sought? Reflect intensely on safety protocols!" }
    },
    "SceneMeditation": {
        "scnP001": { id: "scnP001", text: "Imagine 'Altar of Taste: Blindfolded Offering'... Feel anticipation as sight removed. Sense heightened taste/texture/smell/sound. Unexpected nuances? Feeling of being fed, relinquishing control? Trust involved?" },
        "scnP002": { id: "scnP002", text: "Picture pause within 'Mid-Dance Accord: Negotiated Power Shift'... Specific moment stopping to explicitly discuss roles feel like? Enhance intimacy, disrupt flow, or create charged intentional energy?" },
        "scnP003": { id: "scnP003", text: "Immerse in 'Weaving Worlds: Sensory Storytelling'. Hearing evocative words + related physical touches blurs cognitive/sensory? What narrative, words/touches combined, would captivate imagination/body?" },
        "scnP004": { id: "scnP004", text: "Sink into 'Soul Mirror: Silent Gaze Intimacy'. Eyes meeting, holding connection, masks falling. What flickers of emotion, unspoken thoughts, shared understanding, vulnerability, challenge pass?" },
        "scnP005": { id: "scnP005", text: "Consider 'Focus Point Binding: Precision Sensation'. Lightly bound, waiting... How concentrating awareness on one anticipated contact point alter perception of time, body, vulnerability [P]?" }
    }
};

// --- Element Deep Dive Content ---
const elementDeepDive = {
    "Attraction": [ { level: 1, title: "Deciphering the Spark", insightCost: 10, content: "<p>Observe: What patterns in your *initial* magnetic pull? Common thread?</p>" }, { level: 2, title: "Deeper Magnetic Fields", insightCost: 25, content: "<p>Beneath surface: Sharp mind [60]? Power dynamics [I]? Fetish [20, 21, 62, 94]? Demisexual [29] bond needed first?</p>" }, { level: 3, title: "Cultivating Desire's Fire", insightCost: 50, content: "<p>Attraction = potential, arousal = fire. Bridge the gap? Spontaneous or responsive? Fixed compass or blooms unexpectedly? How *sustaining* differs from spark?</p>" } ],
    "Interaction": [ { level: 1, title: "The Dance of Connection", insightCost: 10, content: "<p>Lead (Dom/Top [4])? Follow (Sub/Bottom [5])? Weave between (Switch [6])? Most satisfying interactions - core energy?</p>" }, { level: 2, title: "Styles of Engagement", insightCost: 25, content: "<p>Flavor beyond lead/follow: Control [11]? Service [10]? Primal [40]? Nurturing [58]? Teasing [38]? Nuances of expressing/receiving energy?</p>" }, { level: 3, title: "Language of Play", insightCost: 50, content: "<p>Communicate desires/boundaries? Verbally? Energetically? Safewords? Aftercare [69] as final step? Ensure safety/respect?</p>" } ],
    "Sensory": [ { level: 1, title: "The Body's Alphabet", insightCost: 10, content: "<p>Skin speaks... Gentle whispers [2]? Firm pronouncements? Temp? Textures? Sensations inherently 'good'/'interesting'?</p>" }, { level: 2, title: "Amplifying Sensation", insightCost: 25, content: "<p>Body craves louder messages: Pinch/bite [9]? Impact [7/8]? Wax [9]? Binding [16, 87]? Cold [88]? E-stim [112]? Negotiating pleasure/pain edge? Overwhelm [86]?" }, { level: 3, title: "Symphony for the Senses", insightCost: 50, content: "<p>Other senses weave in? Scent [A]? Sound [32]? Visuals [21]? Engaging/depriving [37] multiple senses? Truly immersive experience?</p>" } ],
    "Psychological": [ { level: 1, title: "The Heart's Compass", insightCost: 10, content: "<p>Deeper needs pulling you? Vulnerability/trust [15]? Power/control [4/5]? Validation [50]? Escape [51]? Comfort/safety [80]? Primal expression [40]? Catharsis? Name core quest." }, { level: 2, title: "Mapping Emotional Landscapes", insightCost: 25, content: "<p>Vulnerability comfort? Catharsis via intensity? Altered states ('subspace') via psych means? Essential safety net for deep exploration?" }, { level: 3, title: "Inner Alchemy & Healing", insightCost: 50, content: "<p>Intimacy as mirror... reflecting joys, desires, fears, shadows. Crucible for integration, understanding wounds, healing [123]? Repeats old stories? Conscious self-discovery potential?" } ],
    "Cognitive": [ { level: 1, title: "Theater of the Mind", insightCost: 10, content: "<p>Inner world active? Fantasies [14]? Analyzing dynamic? Grounded in sensation [S]? Power of imagination? Populate mental theater?" }, { level: 2, title: "Scripts, Scenarios, Realms", insightCost: 25, content: "<p>Relish stepping into role [13]? Specific scenarios (medical [43], capture [117])? Forbidden encounters? Historical? Power dynamics [4/5]? Fantastical [121]? Is 'story' key ingredient?" }, { level: 3, title: "Intellectual Spark", insightCost: 50, content: "<p>Mind primary erogenous zone? Banter [74]? Motivations [P]? Analyzing interactions [I]? Symbolic actions, complex rules [30], rituals [101]? How thought fuels fire? *Idea* arousing?" } ],
    "Relational": [ { level: 1, title: "Mapping Connections", insightCost: 10, content: "<p>Structure intimate world? Monogamy [22]? Solo? CNM (Poly [25], Open [26])? Swinging [23]? Group [34]? Basic blueprint: partners, connection level feel authentic?" }, { level: 2, title: "Defining the Bonds", insightCost: 25, content: "<p>Beyond number: What *depth* & *type* seek? Deep emotional [15]? Casual fun [24]? Shared interests? Temporary? Commitment factor? Vary between partners?" }, { level: 3, title: "Navigating the Cosmos", insightCost: 50, content: "<p>Multiple connections: Navigate via rules/hierarchy? Or RA [27]? Handling jealousy/compersion? Essential communication skills? Ethical frameworks guide choices?" } ],
    "RoleFocus": [ { level: 1, title: "Sensing the Current", insightCost: 10, content: "<p>Innate energetic leaning in power dynamics? Directing flow (Dom)? Receptive banks (sub)? Eddy between (Switch)? Where energy settles?" }, { level: 2, title: "Embodied Expressions", insightCost: 25, content: "<p>Polarity into action/feeling? Dom: Control [11], guidance, authority? Sub: Obedience [5], service [10], surrender release? Switch: Scenarios invite each pole? Connect RF score to concepts..." }, { level: 3, title: "Alchemy of Exchange", insightCost: 50, content: "<p>How Role Focus interacts with partners' [R]? Seek complementary (Dom/sub)? Similar (Dom/Dom)? Flexible? Communicate needs/boundaries around power [C]? Trust [15] enable exploration?" } ]
};

// --- Focus Rituals Data ---
const focusRituals = [
    { id: "fr01", requiredFocusIds: [4], description: "Focus Ritual: Ponder moment felt ethically in charge. Physical/mental feeling?", reward: { type: "insight", amount: 3 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr01" } },
    { id: "fr02", requiredFocusIds: [5], description: "Focus Ritual: Meditate on vulnerability/release of trusting surrender. Feel in body?", reward: { type: "insight", amount: 3 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr02" } },
    { id: "fr03", requiredFocusIds: [15], description: "Focus Ritual: Identify one small, safe way to be slightly more open/vulnerable today.", reward: { type: "attunement", element: "P", amount: 0.5 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr03" } },
    { id: "fr04", requiredFocusIds: [16, 17], description: "Focus Ritual: Paradox of restriction - external limits create internal freedom/heightened sensation?", reward: { type: "insight", amount: 5 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr04" } },
    { id: "fr05", requiredRoleFocusScore: 8, description: "Focus Ritual (High RF): Reflect on responsibility of wielding power consensually. Balance control/care?", reward: { type: "attunement", element: "RF", amount: 0.5 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr05" }},
    { id: "fr06", requiredRoleFocusScoreBelow: 3, description: "Focus Ritual (Low RF): Reflect on instance trust allowed deeper surrender. What built trust?", reward: { type: "attunement", element: "RF", amount: 0.5 }, track: { action: "completeReflection", count: 1, period: "daily", contextMatch: "FocusRitual_fr06" }},
];

// --- Repository Item Data ---
const sceneBlueprints = [
    { id: "SCN001", name: "Altar of Taste: Blindfolded Offering", element: "S", description: "One partner, blindfolded [37], receives small tastes/textures fed by another. Heightens non-visual senses, builds profound trust [P], explores giving/receiving [I].", meditationCost: 10, reflectionPromptId: "scnP001" },
    { id: "SCN002", name: "Mid-Dance Accord: Negotiated Power Shift", element: "I", description: "Intentionally pause mid-scene to explicitly discuss/negotiate swapping roles (Dom/sub, Top/Bottom) or shifting power dynamic [I]. Explores verbal communication [C], flexibility, conscious choice.", meditationCost: 10, reflectionPromptId: "scnP002" },
    { id: "SCN003", name: "Weaving Worlds: Sensory Storytelling", element: "C", description: "One partner weaves evocative erotic tale [C] while matching physical actions/sensations [S] (e.g., 'cold wind' = cool breath). Blurs mind/body, creates deep immersion.", meditationCost: 10, reflectionPromptId: "scnP003" },
    { id: "SCN004", name: "Soul Mirror: Silent Gaze Intimacy", element: "P", description: "Partners sit close, holding sustained, silent eye contact [47]. Powerful exercise in raw connection, vulnerability, presence, non-verbal communication [P].", meditationCost: 8, reflectionPromptId: "scnP004" },
    { id: "SCN005", name: "Focus Point Binding: Precision Sensation", element: "S", description: "Often involving light bondage [87] or restriction [17], focuses intense, specific sensations (temp, texture, light impact [7, 9]) onto one chosen area, amplifying sensory awareness [S] and vulnerability [P].", meditationCost: 12, reflectionPromptId: "scnP005"}
];
const alchemicalExperiments = [
    { id: "EXP01", name: "Distillation of Sensation: Amplification Brew", requiredElement: "S", requiredAttunement: 75, insightCost: 30, requiredFocusConceptTypes: ["Practice/Kink"], description: "Brew temporary state of heightened sensory acuity [S] via focused meditation/stimulation. Risk: Overload! Reward: Sharpened awareness.", successReward: { type: "attunement", element: "S", amount: 5 }, failureConsequence: "Slight sensory fuzziness.", successRate: 0.6 },
    { id: "EXP02", name: "Axiom of Authority: Command Resonance Field", requiredElement: "I", requiredAttunement: 80, insightCost: 40, requiredFocusConceptIds: [11], requiredRoleFocusScore: 7, description: "Channel will/focus into energetic field between commander/responder [11], seeking synchronous resonance [I]. Requires strong Role Focus [RF]. Success boosts clarity, failure causes temporary 'static'.", successReward: { type: "insight", amount: 20 }, failureConsequence: "Temporary inability to Focus Interaction concepts.", successRate: 0.5 },
    { id: "EXP03", name: "Crucible of Connection: Intimacy Catalyst Ritual", requiredElement: "P", requiredAttunement: 85, insightCost: 50, requiredFocusConceptIds: [15], description: "High-stakes ritual sharing deep vulnerabilities [P] to attempt rapid forging of connection [15]. Success deepens bonds, failure risks emotional fallout.", successReward: { type: "attunement", element: "P", amount: 6 }, failureConsequence: "Increased psychological dissonance.", successRate: 0.4 },
    { id: "EXP04", name: "The Mind Weaver's Loom: Conceptual Synthesis", requiredElement: "C", requiredAttunement: 70, insightCost: 35, requiredFocusConceptTypes: ["Cognitive", "Fantasy"], description: "Mentally attempt to blend essences of two focused Cognitive concepts into novel imaginative thread [C]. May reveal insights or mental knots.", successReward: { type: "insightFragment", id: "IFC01", element: "C", text:"Weaving thoughts yields unexpected threads... and sometimes beautiful tangles."}, failureConsequence: "Mental fatigue, slight Insight loss (1-2 points).", successRate: 0.55 },
    { id: "EXP05", name: "Embodied Archetype: Persona Integration Test", requiredElement: "C", requiredAttunement: 70, insightCost: 40, requiredFocusConceptIds: [13, 21], description: "Seamlessly blend Role-Play persona [13] with symbolic attire [21]? Success clarifies Cognitive links, failure creates identity blur.", successReward: { type: "attunement", element: "C", amount: 4 }, failureConsequence: "Temporary confusion about self/role.", successRate: 0.5 },
    { id: "EXP06", name: "Polarity Resonance Tuning", requiredElement: "RF", requiredAttunement: 60, insightCost: 30, requiredFocusConceptIds: [4, 5], description: "Consciously tune energetic field between Dom [4]/sub [5] roles, seeking clearer polarity [RF]. Success enhances flow, failure creates temporary role confusion.", successReward: { type: "attunement", element: "RF", amount: 4 }, failureConsequence: "Temporary RF score fluctuation (+/- 1.0).", successRate: 0.6 }
];
const elementalInsights = [
    { id: "EI_A01", element: "A", text: "Attraction's compass doesn't always point north; sometimes it spins towards mystery." }, { id: "EI_A02", element: "A", text: "Aversion also defines desire's edge." }, { id: "EI_A03", element: "A", text: "Strongest gravity pulls towards unknown potential." }, { id: "EI_A04", element: "A", text: "Shared glance, haunting scent... universe conspires." }, { id: "EI_A05", element: "A", text: "Absence of attraction: not empty, but different landscape." },
    { id: "EI_I01", element: "I", text: "Every touch, word, silence is a move in interaction's dance." }, { id: "EI_I02", element: "I", text: "Willing stillness speaks volumes of trust/control." }, { id: "EI_I03", element: "I", text: "True power often potent when willingly given." }, { id: "EI_I04", element: "I", text: "Compelling rhythm in shared breath between giving/allowing." }, { id: "EI_I05", element: "I", text: "Switching roles: not indecision, but mastery of spectrum." },
    { id: "EI_S01", element: "S", text: "Skin keeps honest score, remembering sensation." }, { id: "EI_S02", element: "S", text: "Pain: intense sensation knocking; you decide how to answer." }, { id: "EI_S03", element: "S", text: "Muffle one sense, others awaken vibrantly." }, { id: "EI_S04", element: "S", text: "Awareness sharpens on whetstone of sensory contrast." }, { id: "EI_S05", element: "S", text: "Pleasure/pain line: not wall, but shimmering veil." },
    { id: "EI_P01", element: "P", text: "Core need: invisible river carving desire's canyon." }, { id: "EI_P02", element: "P", text: "To be truly seen/accepted in vulnerability: quiet superpower." }, { id: "EI_P03", element: "P", text: "Catharsis via intensity: burn old structures to feel reborn." }, { id: "EI_P04", element: "P", text: "Trust: sacred cup; intimacy: precious wine within." }, { id: "EI_P05", element: "P", text: "Binding body can free heart/mind, if trust holds knot." },
    { id: "EI_C01", element: "C", text: "Mind: ultimate playground, first frontier, final sanctuary." }, { id: "EI_C02", element: "C", text: "Potent scene built twice: first in thought, then embodied." }, { id: "EI_C03", element: "C", text: "Meaning adds spice to sensation; intellect hones interaction's edge." }, { id: "EI_C04", element: "C", text: "Anticipation... savoring the wait... sometimes best part." }, { id: "EI_C05", element: "C", text: "Fantasy allows safe exploration of desires world forbids." },
    { id: "EI_R01", element: "R", text: "Two hearts entwined, universe contained. Many hearts, vast nebula." }, { id: "EI_R02", element: "R", text: "External rules build fences; negotiated agreements build bridges." }, { id: "EI_R03", element: "R", text: "Exclusivity: deliberate choice defining focus, not inherent moral rule." }, { id: "EI_R04", element: "R", text: "Compersion: finding genuine joy in partner's happiness beyond you." }, { id: "EI_R05", element: "R", text: "Relationship Anarchy: radical responsibility of defining connection from scratch."},
    { id: "EI_RF01", element: "RF", text: "Dominance: responsibility worn with confidence; Submission: trust given with courage."}, { id: "EI_RF02", element: "RF", text: "True Switch finds power not in either pole, but in the fluid energy of the dance between them."}, { id: "EI_RF03", element: "RF", text: "Clarity of role can create profound freedom; ambiguity requires constant negotiation."},
    { id: "IFC01", element: "C", text:"Weaving thoughts yields unexpected threads... and sometimes beautiful tangles."}
];

// --- Unlock Mechanisms Data ---
const focusDrivenUnlocks = [
    { id: "FDU001", requiredFocusIds: [4, 9], unlocks: { type: "scene", id: "SCN005", name: "Precision Sensation Scene Blueprint" }, description: "Aha! Dominance [4] & Pain Play [9] focus unlocked 'Precision Sensation' Scene!" },
    { id: "FDU002", requiredFocusIds: [15, 16], unlocks: { type: "insightFragment", id: "EI_P05", element: "P", text: "Binding the body can free the heart, but only if trust holds the knot tight." }, description: "Synergy! Intimacy [15] & Rope [16] focus uncovered Psychological Insight!" },
    { id: "FDU003", requiredFocusIds: [13, 21], unlocks: { type: "experiment", id: "EXP05", name: "Embodied Archetype: Persona Integration Test" }, description: "Combo! Role-Play [13] + Uniform [21] focus unlocked 'Persona Integration Test' Experiment!" },
    { id: "FDU004", requiredFocusIds: [4, 5], requiredRoleFocusScore: 7, unlocks: { type: "experiment", id: "EXP06", name: "Polarity Resonance Tuning Experiment" }, description: "Polarity Focus! Holding Dom [4] & Sub [5] with strong Role Focus [RF] unlocks 'Polarity Tuning' Experiment!" }
];
const categoryDrivenUnlocks = [
    { id: "CDU001", requiredInSameCategory: [16, 17], categoryRequired: "liked", unlocks: { type: "lore", targetConceptId: 16, loreLevelToUnlock: 3 }, description: "Deep Resonance! Liking Rope Bondage [16] & Restriction [17] unlocked deeper lore for Rope!" },
    { id: "CDU002", requiredInSameCategory: [4, 11], categoryRequired: "coreIdentity", unlocks: { type: "insight", amount: 5 }, description: "Pillar Affirmation! Acknowledging Dominance [4] & Command [11] as Core Identity granted 5 Insight!" },
    { id: "CDU003", requiredInSameCategory: [8, 9], categoryRequired: "wantToTry", unlocks: { type: "attunement", element: "S", amount: 2 }, description: "Intriguing Edge! Marking Heavy Impact [8] & Pain Play [9] as Curious Experiments boosted Sensory Attunement!" },
    { id: "CDU004", requiredInSameCategory: [45, 114], categoryRequired: "dislikedLimit", unlocks: { type: "insight", amount: 3 }, description: "Boundary Wisdom! Defining Humiliation [45] & Watersports [114] as Boundaries Drawn granted 3 Insight." }
];

// --- Rituals & Milestones Data ---
const dailyRituals = [
    { id: "dr01", description: "Daily Zen Scribbles: Perform Free Meditation Research (tap ☆ in Workshop).", reward: { type: "insight", amount: 2 }, track: { action: "freeResearch", count: 1, period: "daily" } },
    { id: "dr02", description: "Curate Your Collection: Add 1 newly discovered Concept to Grimoire.", reward: { type: "insight", amount: 3 }, track: { action: "addToGrimoire", count: 1, period: "daily" } },
    { id: "dr03", description: "A Moment's Reflection: Complete any Reflection prompt.", reward: { type: "insight", amount: 5 }, track: { action: "completeReflection", count: 1, period: "daily" } },
    { id: "dr04", description: "Shift Your Focus: Mark a new Concept as a Focus Thread (tap ☆).", reward: { type: "insight", amount: 4 }, track: { action: "markFocus", count: 1, period: "daily" } },
    { id: "dr05", description: "Invest in Knowledge: Conduct Insight-fueled Research in Workshop.", reward: { type: "attunement", element: "All", amount: 0.2 }, track: { action: "conductResearch", count: 1, period: "daily" } },
    { id: "dr06", description: "Deepen Understanding: Unlock an Element Insight Level in Persona Library.", reward: { type: "attunement", element: "All", amount: 0.5 }, track: { action: "unlockLibrary", count: 1, period: "daily"} },
    { id: "dr07", description: "Organize Your Thoughts: Move a Concept to a new Shelf in Grimoire.", reward: { type: "insight", amount: 1 }, track: { action: "categorizeCard", count: 1, period: "daily"} }
];
const milestones = [
    { id: "ms000", description: "Welcome, Alchemist! Completed initial assessment.", reward: { type: "insight", amount: 5 }, track: { action: "completeQuestionnaire", count: 1 } },
    { id: "ms001", description: "First Concept Claimed!", reward: { type: "insight", amount: 5 }, track: { state: "discoveredConcepts.size", threshold: 1 } },
    { id: "ms002", description: "First Focus Thread Chosen!", reward: { type: "insight", amount: 8 }, track: { state: "focusedConcepts.size", threshold: 1 } },
    { id: "ms003", description: "First Reflection Completed!", reward: { type: "insight", amount: 5 }, track: { action: "completeReflection", count: 1 } },
    { id: "ms004", description: "First Insight-fueled Research!", reward: { type: "insight", amount: 5 }, track: { action: "conductResearch", count: 1 } },
    { id: "ms005", description: "Categorized first Concept!", reward: { type: "insight", amount: 2 }, track: { action: "categorizeCard", count: 1 } },
    { id: "ms006", description: "Lore Seeker: Unlocked Level 1 Lore!", reward: { type: "insight", amount: 5 }, track: { action: "unlockLore", condition: "anyLevel", threshold: 1 } }, // Legacy Lore
    { id: "ms010", description: "Budding Curator: 5 Concepts!", reward: { type: "insight", amount: 10 }, track: { state: "discoveredConcepts.size", threshold: 5 } },
    { id: "ms011", description: "Growing Archive: 15 Concepts!", reward: { type: "insight", amount: 15 }, track: { state: "discoveredConcepts.size", threshold: 15 } },
    { id: "ms012", description: "Rare Jewel Unearthed!", reward: { type: "insight", amount: 15 }, track: { action: "discoverRareCard", count: 1 } },
    { id: "ms013", description: "Serious Collector: 25 Concepts! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "discoveredConcepts.size", threshold: 25 } },
    { id: "ms014", description: "Impressive Compendium: 40 Concepts!", reward: { type: "insight", amount: 25 }, track: { state: "discoveredConcepts.size", threshold: 40 } },
    { id: "ms015", description: "Master Curator: 55 Concepts! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "discoveredConcepts.size", threshold: 55 } },
    { id: "ms016", description: "Grand Archive: 75 Concepts!", reward: { type: "insight", amount: 40 }, track: { state: "discoveredConcepts.size", threshold: 75 } },
    { id: "ms017", description: "Librarian of Desire: 100 Concepts! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "discoveredConcepts.size", threshold: 100 } },
    { id: "ms020", description: "Tapestry Weaver: 3 Concepts Focused!", reward: { type: "attunement", element: "All", amount: 1 }, track: { state: "focusedConcepts.size", threshold: 3 } },
    { id: "ms021", description: "Expanding Focus: 5 Concepts Focused! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "focusedConcepts.size", threshold: 5 } },
    { id: "ms022", description: "Intricate Weaving: 7 Focus Slots engaged!", reward: { type: "insight", amount: 25 }, track: { state: "focusedConcepts.size", threshold: 7 } },
    { id: "ms023", description: "Complex Patterns: 9 Focus Slots filled! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "focusedConcepts.size", threshold: 9 } },
    { id: "ms024", description: "Tapestry Master: Max Focus Slots unlocked!", reward: { type: "insight", amount: 50 }, track: { state: "focusSlotsTotal" } },
    { id: "ms030", description: "Elemental Spark: Attunement 10+ in One Element!", reward: { type: "insight", amount: 15 }, track: { state: "elementAttunement", threshold: 10, condition: "any" } },
    { id: "ms031", description: "Balanced Flow: Attunement 5+ in ALL Seven Elements!", reward: { type: "insight", amount: 20 }, track: { state: "elementAttunement", threshold: 5, condition: "all" } },
    { id: "ms032", description: "Deepening Study: Unlocked Level 1 Insight (Element Library).", reward: { type: "insight", amount: 5 }, track: { action: "unlockLibrary", count: 1} },
    { id: "ms033", description: "Elemental Initiate: Reached Level 2 Insight (Element Library).", reward: { type: "insight", amount: 10 }, track: { state: "unlockedDeepDiveLevels", threshold: 2, condition: "any"} },
    { id: "ms034", description: "Elemental Adept: Attunement 50+ in One Element! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "elementAttunement", threshold: 50, condition: "any" } },
    { id: "ms035", description: "Elemental Scholar: Reached Level 3 Insight (Element Library).", reward: { type: "insight", amount: 15 }, track: { state: "unlockedDeepDiveLevels", threshold: 3, condition: "any"} },
    { id: "ms036", description: "Harmonious Core: Attunement 25+ in ALL Elements! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "elementAttunement", threshold: 25, condition: "all" } },
    { id: "ms037", description: "Elemental Master: Attunement 90+ in One Element!", reward: { type: "insight", amount: 40 }, track: { state: "elementAttunement", threshold: 90, condition: "any" } },
    { id: "ms038", description: "Broad Foundations: Unlocked Level 1 Insight for ALL Seven Elements! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "unlockedDeepDiveLevels", threshold: 1, condition: "all"} },
    { id: "ms039", description: "Deep Lore Diver: Unlocked Lore Level 3 (Legacy).", reward: { type: "insight", amount: 15 }, track: { action: "unlockLore", condition: "level3", threshold: 1 } }, // Legacy Lore
    { id: "ms040", description: "Facing Shadows: Embraced Dissonant Reflection!", reward: { type: "attunement", element: "All", amount: 1.5 }, track: { action: "completeReflectionDissonance", count: 1 } },
    { id: "ms041", description: "Introspective Soul: Completed 5 Reflections.", reward: { type: "insight", amount: 20 }, track: { action: "completeReflection", count: 5 } },
    { id: "ms042", description: "Open Mind: Allowed Reflection/Dilemma Score Nudge!", reward: { type: "insight", amount: 10 }, track: { action: "scoreNudgeApplied", count: 1 } },
    { id: "ms043", description: "Seasoned Reflector: Completed 10 Reflections! (+1 Focus Slot!)", reward: { type: "increaseFocusSlots", amount: 1 }, track: { action: "completeReflection", count: 10 } },
    { id: "ms044", description: "Dedicated Delver: Completed 20 Reflections!", reward: { type: "insight", amount: 30 }, track: { action: "completeReflection", count: 20 } },
    { id: "ms050", description: "Scene Scholar: Meditated on Scene Blueprint.", reward: { type: "insight", amount: 10 }, track: { action: "meditateScene", count: 1 } },
    { id: "ms051", description: "Bold Alchemist: Attempted an Experiment!", reward: { type: "insight", amount: 15 }, track: { action: "attemptExperiment", count: 1 } },
    { id: "ms052", description: "Fragment Finder: Collected 3 Elemental Insights!", reward: { type: "attunement", element: "All", amount: 1.0 }, track: { state: "repositoryInsightsCount", threshold: 3 } },
    { id: "ms053", description: "Repository Rummager: Found 1 of Each Item Type!", reward: { type: "insight", amount: 20 }, track: { state: "repositoryContents", condition: "allTypesPresent" } },
    { id: "ms054", description: "Savvy Seller: Sold First Concept Card!", reward: { type: "insight", amount: 5 }, track: { action: "sellConcept", count: 1 } },
    { id: "ms055", description: "Shelf Sorter Supreme: Categorized 10 Concepts!", reward: { type: "insight", amount: 10 }, track: { action: "categorizeCard", count: 10 } },
    { id: "ms056", description: "Synergy Seeker: Unlocked Focus-Driven Discovery!", reward: { type: "insight", amount: 15 }, track: { state: "unlockedFocusItems", threshold: 1 } },
    // **NEW** XP/Level Milestones
    { id: "ms200", description: "Element Awakened: Reached Adept (Level 1) in any Element!", reward: { type: "insight", amount: 10 }, track: { state: "elementLevel", condition: "any", threshold: 1 } },
    { id: "ms201", description: "Broad Awakening: Reached Adept (Level 1) in ALL Elements!", reward: { type: "insight", amount: 25 }, track: { state: "elementLevel", condition: "all", threshold: 1 } },
    { id: "ms202", description: "Element Ascendant: Reached Ascendant (Level 2) in any Element!", reward: { type: "increaseFocusSlots", amount: 1 }, track: { state: "elementLevel", condition: "any", threshold: 2 } },
    { id: "ms203", description: "Elemental Mastery: Reached Mastery (Level 3) in any Element!", reward: { type: "insight", amount: 50 }, track: { state: "elementLevel", condition: "any", threshold: 3 } },
    { id: "ms204", description: "True Alchemist: Reached Mastery (Level 3) in ALL Elements!", reward: { type: "insight", amount: 100 }, track: { state: "elementLevel", condition: "all", threshold: 3 } },
    { id: "ms205", description: "Micro-Story Collector: Unlocked 5 Micro-Stories!", reward: { type: "insight", amount: 10 }, track: { action: "purchaseCardUnlock", condition: "microStory", count: 5 } }, // Needs tracking adjustment in updateMilestoneProgress
    { id: "ms206", description: "Challenge Accepted: Completed a Crossover Token Challenge!", reward: { type: "insight", amount: 15 }, track: { action: "completeCrossoverToken", count: 1 } },
];

// --- Data for Tapestry Narrative Generation ---
const elementInteractionThemes = {
    // 2-way themes
    "AI": "a dynamic blend where specific Attraction triggers strongly influence preferred Interaction roles, suggesting a focus on how desire plays out in explicit social dynamics or power exchanges.",
    "AS": "a focus where specific Attraction cues are powerfully linked to sought-after Sensory experiences, emphasizing the direct physical manifestation and feeling of desire.",
    "AP": "an exploration deeply linking Attraction triggers to fulfilling core Psychological needs, perhaps seeking specific relationship dynamics or partners to achieve emotional goals or security.",
    "AC": "a combination where Attraction is heavily filtered through a Cognitive lens, suggesting fascination with the 'idea' of a person/dynamic, enjoyment of intellectual sparks, or attraction driven by fantasy.",
    "AR": "a pairing where specific Attractions are carefully considered within defined (or desired) Relationship structures, exploring how potent desires fit into commitments, ethics, or fluid connections.",
    "ARF": "an attraction profile keenly aware of Role Focus dynamics, seeking partners or scenarios that match a desired energetic polarity.", // A + RF
    "IS": "a highly embodied focus on the physical feeling, rhythm, and flow of Interaction, where Sensory input (pleasure, pain, texture) heavily defines the quality of the power exchange, role-play, or connection.",
    "IP": "a significant focus on the Psychological underpinnings and motivations behind Interaction styles, exploring the 'why' of dominance, submission, caregiving, or collaboration, seeking emotional depth in the dance.",
    "IC": "an Interaction style heavily influenced and potentially directed by Cognitive elements like detailed scenarios, explicit rules, strategic mind games, or psychological analysis within the dynamic.",
    "IR": "a keen interest in how different Interaction styles (D/s, egalitarian, etc.) manifest, adapt, or are negotiated within various Relationship structures, from monogamous dyads to polyamorous networks or group play.",
    "IRF": "a strong emphasis on how Interaction styles directly map onto specific Role Focus polarities (Dominant, submissive, Switch).", // I + RF
    "SP": "a deep, often intense connection between specific Sensory experiences and Psychological fulfillment, perhaps using sensation for catharsis, grounding, testing trust, achieving release, or exploring vulnerability.",
    "SC": "where potent Sensory experiences are framed, enhanced, anticipated, or interpreted through Cognitive elements like detailed fantasy, specific mental states (subspace), anticipation, or ritualistic meaning.",
    "SR": "exploring how diverse Sensory preferences and practices (kinks, intensity levels) play out, are negotiated, or accommodated across various Relationship contexts, numbers of partners, or community norms.",
    "SRF": "using Sensory input as a primary tool or expression within specific Role Focus dynamics (e.g., sensation for control/submission).", // S + RF
    "PC": "a highly introspective and often complex focus, blending deep Psychological drives and needs with Cognitive exploration through intricate fantasy, self-analysis, meaning-making, or symbolic representation.",
    "PR": "where core Psychological needs (for intimacy, power, validation, security) are primarily sought, explored, or met through specific Relationship configurations, dynamics, or levels of commitment.",
    "PRF": "a deep Psychological need or drive manifesting strongly through a specific Role Focus (e.g., needing control, needing surrender).", // P + RF
    "CR": "a focus on the mental frameworks, agreements, negotiations, and intellectual structures of Relationships, perhaps enjoying defining terms, crafting detailed agreements, exploring theoretical models, or analyzing relational dynamics.",
    "CRF": "using Cognitive tools like rules, scenarios, or analysis to define and explore Role Focus dynamics.", // C + RF
    "RRF": "exploring how different Role Focus expressions (D/s/W) function or are navigated within various Relationship structures.", // R + RF

    // Example 3-way themes (Add more as needed)
    "AIS": "a highly embodied experience where specific Attractions trigger desired Interactions that are deeply felt through intense or specific Sensations.",
    "IPC": "a focus on Interaction dynamics driven by Psychological needs and explored through Cognitive frameworks like role-play or rules.",
    "PSR": "seeking Psychological safety and specific Sensory experiences within carefully chosen Relational structures.",
    // Ensure IRF exists only once (it does)
};

const cardTypeThemes = {
    "Orientation": "defining the fundamental 'who' or 'what' naturally sparks your desire, shaping the initial vector of connection.",
    "Identity/Role": "exploring 'who you become' or 'how you embody energy' within intimacy, revealing core facets of self through dynamic expression.",
    "Practice/Kink": "the 'how' and 'what' of intimate expression – specific actions, techniques, and sensations – forming the vibrant palette of your desires.",
    "Psychological/Goal": "understanding the deeper 'why' – the underlying emotional needs and core motivations – driving your quest for connection and fulfillment.",
    "Relationship Style": "the 'structure' and context of connection – how bonds are formed, defined, and navigated – serving as the architecture of your intimate world."
};

// --- Elemental Dilemmas ---
const elementalDilemmas = [
    { id: "ED_A01", elementFocus: ["A", "P"], situation: "An intense, almost purely physical or fetish-driven attraction sparks towards someone. However, initial interactions suggest a significant lack of compatible values or potential for the deeper psychological connection you typically need to feel truly fulfilled.", question: "Where does your energy naturally flow in deciding whether to pursue this connection further?", sliderMinLabel: "Prioritize Potential for Psychological Depth/Compatibility (Psychological Focus)", sliderMaxLabel: "Follow the Intense, Compelling Attraction Trigger (Attraction Focus)", elementKeyMin: "P", elementKeyMax: "A" },
    { id: "ED_A02", elementFocus: ["A", "R"], situation: "A new person enters your social sphere who strongly matches your specific 'type' or core attraction patterns. Engaging with them, even platonically at first, feels like it could potentially create friction, jealousy, or violate agreements within your existing committed relationship structure.", question: "Your primary internal leaning is towards:", sliderMinLabel: "Prioritizing & Upholding Existing Relationship Stability/Agreements (Relational Focus)", sliderMaxLabel: "Exploring or Acknowledging the Potent New Attraction (Attraction Focus)", elementKeyMin: "R", elementKeyMax: "A" },
    { id: "ED_A03", elementFocus: ["A", "C"], situation: "You connect with someone whose mind is incredibly stimulating – their wit, intelligence, or creativity sets off major Sapiosexual sparks. However, their physical appearance or self-presentation doesn't align with your usual visual attraction patterns or aesthetic preferences.", question: "How likely are you to initiate or pursue potential intimacy based on this?", sliderMinLabel: "Less Likely; Visual Cues/Aesthetics Remain Primary Gatekeepers (Attraction Focus)", sliderMaxLabel: "More Likely; The Powerful Mental/Cognitive Spark Overrides Visual Preferences (Cognitive/Attraction Blend)", elementKeyMin: "A", elementKeyMax: "C" },
    { id: "ED_I01", elementFocus: ["I", "S"], situation: "During an established D/s scene where you are Dominant, your submissive partner requests a specific, intense sensation (e.g., heavier impact, a type of pain play) that you are unfamiliar with or slightly uncomfortable delivering, though it technically fits the dynamic.", question: "Your immediate inclination in that moment is to:", sliderMinLabel: "Prioritize Your Comfort/Familiarity with Delivering the Sensation (Sensory/Self Focus)", sliderMaxLabel: "Fulfill the Role/Dynamic Expectation & Partner's Request (Interaction Focus)", elementKeyMin: "S", elementKeyMax: "I" },
    { id: "ED_I02", elementFocus: ["I", "P"], situation: "You naturally gravitate towards a highly structured, commanding, or protocol-heavy interaction style. However, you sense your current partner deeply needs more overt nurturing, reassurance, and psychological validation in this moment to feel safe and connected.", question: "How do you adapt your interaction style right now?", sliderMinLabel: "Intentionally Shift Towards Nurturing & Providing Reassurance (Psychological Focus)", sliderMaxLabel: "Maintain Your Preferred Interaction Structure/Role Integrity (Interaction Focus)", elementKeyMin: "P", elementKeyMax: "I" },
    { id: "ED_I03", elementFocus: ["I", "RF"], situation: "You strongly identify as a Switch, enjoying fluidity. Your partner expresses a desire for a scene where you commit *fully* to either a Dominant or submissive role for the entire duration, without switching.", question: "Your response leans towards:", sliderMinLabel: "Committing Fully to One Defined Role for the Scene (Role Focus Alignment with Partner)", sliderMaxLabel: "Negotiating for Moments of Fluidity/Switching Within the Scene (Interaction/Self Focus)", elementKeyMin: "RF", elementKeyMax: "I" },
    { id: "ED_S01", elementFocus: ["S", "P"], situation: "You have a strong craving for intense physical sensation, perhaps for stress relief or catharsis. However, your partner is feeling emotionally vulnerable and primarily expresses a need for gentle, comforting touch and psychological safety [High P].", question: "For this specific encounter, you choose to prioritize:", sliderMinLabel: "Providing Gentle Comfort & Prioritizing Partner's Psychological Safety (Psychological Focus)", sliderMaxLabel: "Finding a way (perhaps solo later?) to Seek Your Desired Intense Sensation (Sensory Focus)", elementKeyMin: "P", elementKeyMax: "S" },
    { id: "ED_S02", elementFocus: ["S", "R"], situation: "An exciting opportunity arises for a high-sensation group play scenario (e.g., a BDSM play party) that promises novel sensory experiences. However, participating might push the boundaries of agreements or cause discomfort within your primary relationship(s).", question: "Your decision-making process is most heavily weighted towards:", sliderMinLabel: "Protecting Existing Relationship Harmony & Honoring Agreements (Relational Focus)", sliderMaxLabel: "Pursuing the Novel and Exciting Sensory Experience Opportunity (Sensory Focus)", elementKeyMin: "R", elementKeyMax: "S" },
    { id: "ED_P01", elementFocus: ["P", "RF"], situation: "You harbor a deep psychological need for experiences involving surrender and vulnerability [High P-Sub]. Your partner, while caring, identifies strongly as Dominant but expresses discomfort with scenarios that feel overly 'helpless' or 'infantilizing' for you.", question: "When negotiating scenes, you tend to focus on:", sliderMinLabel: "Finding Surrender Scenarios that Align with Partner's Dominant Comfort Zone (RoleFocus Harmony)", sliderMaxLabel: "Seeking Ways to Explore the Specific Quality of Helplessness You Need (Psychological Focus)", elementKeyMin: "RF", elementKeyMax: "P" },
    { id: "ED_P02", elementFocus: ["P", "C"], situation: "Engaging in a specific, detailed fantasy scenario is crucial for your psychological fulfillment—perhaps it makes you feel truly desired, powerful, or allows exploration of a core theme. Your partner, however, finds deep fantasy immersion difficult, distracting, or prefers staying present.", question: "When seeking satisfaction, the priority becomes:", sliderMinLabel: "Focusing on Shared Reality & Finding Connection in Present Cognitive/Emotional Exchange (Cognitive/Presence Focus)", sliderMaxLabel: "Ensuring Your Core Psychological Need is Met, Likely Through the Fantasy (Psychological Focus)", elementKeyMin: "C", elementKeyMax: "P" },
    { id: "ED_C01", elementFocus: ["C", "S"], situation: "Your intricately planned fantasy or role-play scenario requires specific physical actions, props, or positioning that might be slightly uncomfortable, awkward, or disrupt a smooth, flowing sensory experience for one or both partners.", question: "In executing the scene, you find yourself prioritizing:", sliderMinLabel: "Maintaining Comfortable Sensory Flow, Physical Presence & Adaptability (Sensory Focus)", sliderMaxLabel: "Executing the Cognitive Fantasy Accurately for Maximum Mental Immersion (Cognitive Focus)", elementKeyMin: "S", elementKeyMax: "C" },
    { id: "ED_C02", elementFocus: ["C", "RF"], situation: "You enjoy crafting complex, rule-heavy scenarios. A partner who identifies as submissive expresses feeling overwhelmed by the cognitive load of remembering all the protocols, finding it hinders their ability to relax into the role.", question: "To enhance the experience for both, you are more inclined to:", sliderMinLabel: "Simplify the Rules/Protocols to Facilitate Deeper Role Embodiment (Role Focus Support)", sliderMaxLabel: "Maintain the Cognitive Complexity, Perhaps Offering More Guidance/Reminders (Cognitive Focus)", elementKeyMin: "RF", elementKeyMax: "C" },
    { id: "ED_R01", elementFocus: ["R", "A"], situation: "You are content and committed within a happily monogamous relationship structure. Unexpectedly, you develop a strong, persistent, and potentially disruptive romantic or sexual attraction towards a close friend or colleague.", question: "Your primary internal conflict and focus centers on:", sliderMinLabel: "Understanding & Navigating the Nature of These New Feelings/Attraction Patterns (Attraction Focus)", sliderMaxLabel: "Honoring Your Existing Commitment & Maintaining the Integrity of Your Relationship Structure (Relational Focus)", elementKeyMin: "A", elementKeyMax: "R" },
    { id: "ED_R02", elementFocus: ["R", "I"], situation: "You actively practice Relationship Anarchy, deeply valuing autonomy and rejecting pre-defined roles or hierarchies. However, a partner expresses a strong desire for a more defined, perhaps traditional, D/s dynamic involving specific protocols and titles.", question: "Your response prioritizes finding a path that emphasizes:", sliderMinLabel: "Exploring and Accommodating the Desired Interaction Dynamic Within Your Connection (Interaction Focus)", sliderMaxLabel: "Maintaining Your Core Principles of Relational Autonomy & Resisting Imposed Structures (Relational Focus)", elementKeyMin: "I", elementKeyMax: "R" },
    { id: "ED_RF01", elementFocus: ["RF", "P"], situation: "You strongly identify as Dominant and derive satisfaction from control. A partner expresses a deep psychological need to occasionally challenge your authority playfully ('bratting') to feel engaged and test boundaries.", question: "Your internal reaction to this challenge is primarily:", sliderMinLabel: "Appreciation for the Engagement & Understanding the Partner's Need (Psychological Attunement)", sliderMaxLabel: "Assertion of Authority & Maintaining the Defined Power Structure (Role Focus Integrity)", elementKeyMin: "P", elementKeyMax: "RF" },
    { id: "ED_RF02", elementFocus: ["RF", "S"], situation: "As someone who leans submissive, you find deep release in intense sensation. Your Dominant partner, however, prefers scenes focused more on psychological control, service, or restriction, rather than heavy sensation play.", question: "When negotiating, you find yourself advocating more strongly for:", sliderMinLabel: "Aligning with the Partner's Preferred Dominant Style (Role Focus Alignment)", sliderMaxLabel: "Incorporating the Intense Sensations You Crave (Sensory Focus)", elementKeyMin: "RF", elementKeyMax: "S" }
];

// --- Onboarding Tours ---
const onboardingWelcomeIntro = [
  { id: 'task01', phaseRequired: 1, title: "Step 1: Your Persona", description: "This is your <strong>Persona</strong> screen. It shows your core elemental scores (like Attraction, Interaction) based on the initial Experimentation. These scores reflect your innate tendencies.", hint: "Tap 'Persona' in the top navigation.", highlightElementId: "personaScreen" },
  { id: 'task02', phaseRequired: 2, title: "Step 2: The Workshop", description: "Now, let's visit the <strong>Workshop</strong>. This is your lab! Here you'll manage your discovered <strong>Concepts</strong> (in the Grimoire Library) and conduct <strong>Research</strong> to find new ones.", hint: "Tap 'Workshop' in the top navigation.", highlightElementId: "workshopScreen" },
  { id: 'task03', phaseRequired: 3, title: "Step 3: Research", description: "Under 'Research Bench', click any Element button (like <i class='fa-solid fa-magnet'></i> Attraction) to start. You have <strong>3 FREE</strong> research attempts!", hint: "Click an element button in the 'Research Bench' area.", highlightElementId: "element-research-buttons", track: { action: "conductResearch" } },
];
const onboardingWorkshopIntro = [
  { id: 'task04', phaseRequired: 1, title: "Step 1 (Workshop): Your Grimoire", description: "Research results appear in a popup. Choose 'Keep' to add a Concept to your permanent <strong>Grimoire Library</strong> below. Selling gives you Insight <i class='fas fa-brain insight-icon'></i>, the main currency.", hint: "Click 'Keep' or 'Sell' on a discovered Concept card in the popup.", highlightElementId: "researchResultsPopup", track: { action: "addToGrimoire" } }, // Phase 4 total
  { id: 'task05', phaseRequired: 2, title: "Step 2 (Workshop): Focus Concepts", description: "In the Grimoire Library, click the ☆ star icon on a card (or 'Mark as Focus' in its detail popup) to add it to your <strong>Persona Tapestry</strong>. Focused Concepts shape your narrative.", hint: "Find a card in the 'Grimoire Library' grid and click its star ☆ icon.", highlightElementId: "grimoire-grid-workshop", track: { action: "markFocus" } }, // Phase 5 total
];
const onboardingRepositoryIntro = [
  { id: 'task06', phaseRequired: 1, title: "Step 1 (Repository): Weave Your Tapestry", description: "Return to the <strong>Persona</strong> screen. Notice how your 'Focused Concepts', 'Focus Themes', and 'Tapestry Narrative' have updated based on your choice!", hint: "Tap 'Persona' in the top navigation again.", highlightElementId: "personaScreen" }, // Phase 6 total
  { id: 'task07', phaseRequired: 2, title: "Step 2 (Repository): Seek Insight", description: "Adding concepts and other actions sometimes trigger <strong>Reflections</strong> (like this tutorial!). Confirming reflections grants Insight <i class='fas fa-brain insight-icon'></i> and Attunement. You can also 'Seek Guidance' in the Workshop.", hint: "Reflections appear in popups like this. Confirm when ready.", highlightElementId: "reflectionModal", track: { action: "completeReflection" } }, // Phase 7 total
  { id: 'task08', phaseRequired: 3, title: "Step 3 (Repository): The Repository", description: "The <strong>Repository</strong> tracks Milestones, Daily Rituals, and special discoveries like Scene Blueprints or Experiments. Check back often! You're now ready to explore the Lab!", hint: "Tap 'Repository' in the top navigation.", highlightElementId: "repositoryScreen" } // Phase 8 total
];

// --- FINAL EXPORT BLOCK ---
export {
    // Core Data
    elementDetails, concepts, elementKeyToFullName, cardTypeKeys, elementNames,
    // Gameplay Data
    questionnaireGuided, reflectionPrompts, elementDeepDive, focusRituals, dailyRituals, milestones,
    // Repository Items
    sceneBlueprints, alchemicalExperiments, elementalInsights,
    // Unlock Mechanisms
    focusDrivenUnlocks, categoryDrivenUnlocks,
    // UI/Config Helpers
    elementInteractionThemes, cardTypeThemes, grimoireShelves, elementalDilemmas,
    // Onboarding Tours
    onboardingWelcomeIntro, onboardingWorkshopIntro, onboardingRepositoryIntro
};

console.log("data.js successfully loaded (All Parts Merged - Corrected). (XP/Leveling v1.0)");
