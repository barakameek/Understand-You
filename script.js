let currentElementIndex = 0;
let userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; // Use single letter keys
let userAnswers = {}; // Stores answers keyed by FULL element names during questionnaire
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"]; // Full names for display/logic
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"]; // For filtering
let currentElementAnswers = {}; // Temp storage for current element's answers
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // ID -> { concept, discoveredTime, artUnlocked: boolean }
let coreConcepts = new Set(); // Track IDs marked as core
// *** Use single letter keys for consistency ***
let elementEssence = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
let elementAttunement = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
const MAX_ATTUNEMENT = 100;
const RESEARCH_COST = 5;
const ART_EVOLVE_COST = 5;

// --- Persistent State Tracking (Placeholder) ---
let seenPrompts = new Set();
let completedRituals = { daily: {}, weekly: {} };
let achievedMilestones = new Set();
let lastLoginDate = null;
let cardsAddedSinceLastPrompt = 0;
let promptCooldownActive = false;
let currentReflectionElement = null; // Store the FULL NAME of the element for reflection
let currentPromptId = null; // Store the ID of the prompt shown

// --- DOM Elements ---
// (Keep all DOM element const declarations as they were)
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startGuidedButton');
const questionnaireScreen = document.getElementById('questionnaireScreen');
const elementProgressHeader = document.getElementById('elementProgressHeader');
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const dynamicScoreFeedback = document.getElementById('dynamicScoreFeedback');
const feedbackElementSpan = document.getElementById('feedbackElement');
const feedbackScoreSpan = document.getElementById('feedbackScore');
const feedbackScoreBar = document.getElementById('feedbackScoreBar');
const prevElementButton = document.getElementById('prevElementButton');
const nextElementButton = document.getElementById('nextElementButton');
const mainNavBar = document.getElementById('mainNavBar');
const navButtons = document.querySelectorAll('.nav-button');
const personaScreen = document.getElementById('personaScreen');
const personaElementDetailsDiv = document.getElementById('personaElementDetails');
const elementEssenceDisplayPersona = document.getElementById('elementEssenceDisplayPersona');
const personaCoreConceptsDisplay = document.getElementById('personaCoreConceptsDisplay');
const personaThemesList = document.getElementById('personaThemesList');
const restartButtonPersona = document.getElementById('restartButtonPersona');
const studyScreen = document.getElementById('studyScreen');
const elementEssenceDisplayStudy = document.getElementById('elementEssenceDisplayStudy');
const researchStatus = document.getElementById('researchStatus');
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const grimoireTypeFilter = document.getElementById('grimoireTypeFilter');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireRarityFilter = document.getElementById('grimoireRarityFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireContentDiv = document.getElementById('grimoireContent');
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupCardTypeIcon = document.getElementById('popupCardTypeIcon');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupCardVisual = document.getElementById('popupCardVisual');
const popupDetailedDescription = document.getElementById('popupDetailedDescription');
const popupResonanceSummary = document.getElementById('popupResonanceSummary');
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const popupRelatedConceptsList = document.getElementById('relatedConceptsList');
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
const markAsCoreButton = document.getElementById('markAsCoreButton');
const researchModal = document.getElementById('researchModal');
const researchModalContent = document.getElementById('researchModalContent');
const researchModalStatus = document.getElementById('researchModalStatus');
const closeResearchModalButton = document.getElementById('closeResearchModalButton');
const elementAttunementDisplay = document.getElementById('elementAttunementDisplay');
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay');
const milestonesDisplay = document.getElementById('milestonesDisplay');
const popupEvolutionSection = document.getElementById('popupEvolutionSection');
const evolveArtButton = document.getElementById('evolveArtButton');
const evolveCostSpan = document.getElementById('evolveCost');
const evolveEligibility = document.getElementById('evolveEligibility');
const reflectionModal = document.getElementById('reflectionModal');
const closeReflectionModalButton = document.getElementById('closeReflectionModalButton');
const reflectionElement = document.getElementById('reflectionElement');
const reflectionPromptText = document.getElementById('reflectionPromptText');
const reflectionCheckbox = document.getElementById('reflectionCheckbox');
const confirmReflectionButton = document.getElementById('confirmReflectionButton');
const reflectionRewardAmount = document.getElementById('reflectionRewardAmount');
const milestoneAlert = document.getElementById('milestoneAlert');
const milestoneAlertText = document.getElementById('milestoneAlertText');
const closeMilestoneAlertButton = document.getElementById('closeMilestoneAlertButton');


// --- Utility & Setup Functions ---

function getScoreLabel(score) {
    if (typeof score !== 'number' || isNaN(score)) return "N/A";
    if (score >= 9) return "Very High";
    if (score >= 7) return "High";
    if (score >= 5) return "Moderate";
    if (score >= 3) return "Low";
    return "Very Low";
}

function getAffinityLevel(score) {
    if (typeof score !== 'number' || isNaN(score)) return null;
    if (score >= 8) return "High";
    if (score >= 5) return "Moderate";
    return null; // Return null for low affinity, simplifies checks
}

function getElementColor(elementName) { // Expects full name
    const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' };
    return colors[elementName] || '#CCCCCC';
}

function hexToRgba(hex, alpha = 1) {
     if (!hex || typeof hex !== 'string') return `rgba(128,128,128, ${alpha})`;
     hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
     const bigint = parseInt(hex, 16); if (isNaN(bigint)) return `rgba(128,128,128, ${alpha})`;
     const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255;
     return `rgba(${r},${g},${b},${alpha})`;
}

function getCardTypeIcon(cardType) {
    switch (cardType) { case "Orientation": return "fa-solid fa-compass"; case "Identity/Role": return "fa-solid fa-mask"; case "Practice/Kink": return "fa-solid fa-gear"; case "Psychological/Goal": return "fa-solid fa-brain"; case "Relationship Style": return "fa-solid fa-heart"; default: return "fa-solid fa-question-circle"; }
}

function getElementIcon(elementName) { // Expects full name
     switch (elementName) { case "Attraction": return "fa-solid fa-magnet"; case "Interaction": return "fa-solid fa-users"; case "Sensory": return "fa-solid fa-hand-sparkles"; case "Psychological": return "fa-solid fa-comment-dots"; case "Cognitive": return "fa-solid fa-lightbulb"; case "Relational": return "fa-solid fa-link"; default: return "fa-solid fa-atom"; }
}

// --- Utility Maps ---
const elementNameToKey = { "Attraction": "A", "Interaction": "I", "Sensory": "S", "Psychological": "P", "Cognitive": "C", "Relational": "R" };
// *** FIX: Re-add elementKeyToFullName map ***
const elementKeyToFullName = { A: "Attraction", I: "Interaction", S: "Sensory", P: "Psychological", C: "Cognitive", R: "Relational" };


// *** Corrected euclideanDistance function (Keep as is) ***
function euclideanDistance(userScoresObj, conceptScoresObj) {
    let sumOfSquares = 0; let validDimensions = 0; let issueFound = false;
    if (!userScoresObj || typeof userScoresObj !== 'object') { console.error("Invalid user scores:", userScoresObj); return Infinity; }
    if (!conceptScoresObj || typeof conceptScoresObj !== 'object') { console.warn(`Invalid concept scores object for ID ${conceptScoresObj?.id || '?'}`); return Infinity; } // Added ID log
    const expectedKeys = Object.keys(userScoresObj); const expectedDimensions = expectedKeys.length;
    if (expectedDimensions === 0) { console.warn("User scores object is empty."); return Infinity; }

    for (const key of expectedKeys) {
        const s1 = userScoresObj[key]; const s2 = conceptScoresObj[key];
        const s1Valid = typeof s1 === 'number' && !isNaN(s1); const s2Valid = conceptScoresObj.hasOwnProperty(key) && typeof s2 === 'number' && !isNaN(s2);

        if (s1Valid && s2Valid) {
            sumOfSquares += Math.pow(s1 - s2, 2); validDimensions++;
        } else {
            // Only log if the concept score is the problem, assume user score is valid at this point
            if (!s2Valid) { console.warn(`Invalid/Missing CONCEPT score for key ${key}. Concept ID: ${conceptScoresObj.id || '?'}`); }
            issueFound = true; // Mark issue if any dimension fails
            // No need to return Infinity immediately, let's check all dimensions first
        }
    }
    // Check for issues after the loop
    if (validDimensions !== expectedDimensions) {
        console.warn(`Dimension mismatch or invalid data. Expected ${expectedDimensions}, got ${validDimensions} valid. Concept ID: ${conceptScoresObj.id || '?'}`, userScoresObj, conceptScoresObj);
        issueFound = true;
    }

    return !issueFound ? Math.sqrt(sumOfSquares) : Infinity;
}


// --- Screen Management ---
function showScreen(screenId) {
    console.log("Showing screen:", screenId);
    let targetIsMain = ['personaScreen', 'studyScreen', 'grimoireScreen'].includes(screenId);
    screens.forEach(screen => { screen.classList.toggle('current', screen.id === screenId); screen.classList.toggle('hidden', screen.id !== screenId); });
    if (mainNavBar) mainNavBar.classList.toggle('hidden', !targetIsMain); else console.warn("mainNavBar not found");
    navButtons.forEach(button => { button.classList.toggle('active', button.dataset.target === screenId); });
    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen'].includes(screenId)) { window.scrollTo(0, 0); }
}

function hidePopups() {
    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (researchModal) researchModal.classList.add('hidden');
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (popupOverlay) popupOverlay.classList.add('hidden');
    currentlyDisplayedConceptId = null; currentReflectionElement = null; currentPromptId = null;
}

// --- Initialization and Questionnaire Logic ---
function initializeQuestionnaire() {
    currentElementIndex = 0; userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; userAnswers = {}; elementNames.forEach(elName => { userAnswers[elName] = {}; });
    discoveredConcepts = new Map(); coreConcepts = new Set(); elementEssence = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; elementAttunement = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
    seenPrompts = new Set(); completedRituals = { daily: {}, weekly: {} }; achievedMilestones = new Set(); lastLoginDate = null; cardsAddedSinceLastPrompt = 0; promptCooldownActive = false;
    updateElementProgressHeader(-1); displayElementQuestions(currentElementIndex); showScreen('questionnaireScreen'); if (mainNavBar) mainNavBar.classList.add('hidden');
    // Clear displays explicitly
    if(dailyRitualsDisplay) dailyRitualsDisplay.innerHTML = '<li>Loading...</li>';
    if(milestonesDisplay) milestonesDisplay.innerHTML = '<li>None yet</li>';
    if(elementAttunementDisplay) elementAttunementDisplay.innerHTML = '';
    if(grimoireContentDiv) grimoireContentDiv.innerHTML = '<p style="text-align: center; color: #666;">Grimoire empty.</p>';
    if(personaCoreConceptsDisplay) personaCoreConceptsDisplay.innerHTML = '<li>Mark concepts as "Core" to build your tapestry.</li>';
    if(elementEssenceDisplayPersona) elementEssenceDisplayPersona.innerHTML = '<p style="font-size: 0.85em; text-align: left; color: #777;"><i>No Essence.</i></p>';
    if(elementEssenceDisplayStudy) elementEssenceDisplayStudy.innerHTML = ''; // Will be populated later
    updateGrimoireCounter(); // Should show 0
}

// --- Questionnaire Display/Logic Functions (Keep as is) ---
function updateElementProgressHeader(activeIndex) { /* ... no changes needed ... */
    if (!elementProgressHeader) return; elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => { const tab = document.createElement('div'); tab.classList.add('element-tab'); const elementData = elementDetails[name] || {}; tab.textContent = (elementData.name || name).substring(0, 3).toUpperCase(); tab.title = elementData.name || name; tab.classList.toggle('completed', index < activeIndex); tab.classList.toggle('active', index === activeIndex); elementProgressHeader.appendChild(tab); });
}
function displayElementQuestions(index) { /* ... no changes needed ... */
    if (index >= elementNames.length) { finalizeScoresAndShowPersona(); return; }
    const elementName = elementNames[index]; const elementData = elementDetails[elementName] || {}; const questions = questionnaireGuided[elementName] || [];
    const questionContentElement = document.getElementById('questionContent'); if (!questionContentElement) { console.error("!!! questionContent element not found !!!"); return; }
    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`; questionContentElement.innerHTML = introHTML;
    currentElementAnswers = { ...(userAnswers[elementName] || {}) }; let questionsHTML = '';
    if (questions && questions.length > 0) {
        questions.forEach(q => {
            let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`; const savedAnswer = currentElementAnswers[q.qId];
            if (q.type === "slider") { const val = savedAnswer !== undefined ? savedAnswer : q.defaultValue; inputHTML += `<div class="slider-container"><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${val}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(val).toFixed(1)}</span></p></div>`; }
            else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const checked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
            else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const checked = savedAnswer?.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; }
            inputHTML += `</div></div>`; questionsHTML += inputHTML;
        });
    } else { console.warn(`[displayElementQuestions] No questions found for element: ${elementName}`); questionsHTML = '<p><em>(No questions defined)</em></p>'; }
    const introDiv = questionContentElement.querySelector('.element-intro'); if (introDiv) { introDiv.insertAdjacentHTML('afterend', questionsHTML); } else { questionContentElement.innerHTML += questionsHTML; }
    questionContentElement.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.addEventListener(eventType, handleQuestionnaireInputChange); });
    questionContentElement.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => { checkbox.addEventListener('change', (event) => enforceMaxChoices(checkbox.name, parseInt(checkbox.dataset.maxChoices || 2), event)); });
    updateElementProgressHeader(index); if (progressText) progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || elementName}`; updateDynamicFeedback(elementName); if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block'; if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; if (nextElementButton) nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}
function handleQuestionnaireInputChange(event) { /* ... no changes needed ... */
    const input = event.target; const type = input.dataset.type; const elementName = elementNames[currentElementIndex];
    if (type === 'slider') { const qId = input.dataset.questionId; const display = document.getElementById(`display_${qId}`); if (display) display.textContent = parseFloat(input.value).toFixed(1); }
    collectCurrentElementAnswers(); updateDynamicFeedback(elementName);
}
function enforceMaxChoices(name, max, event) { /* ... no changes needed ... */
     const checkboxes = questionContent?.querySelectorAll(`input[name="${name}"]:checked`); if (!checkboxes) return;
     if (checkboxes.length > max) { alert(`Max ${max} options.`); if (event?.target?.checked) { event.target.checked = false; collectCurrentElementAnswers(); updateDynamicFeedback(elementNames[currentElementIndex]); } }
}
function collectCurrentElementAnswers() { /* ... no changes needed ... */
    const elementName = elementNames[currentElementIndex]; const questions = questionnaireGuided[elementName] || []; currentElementAnswers = {};
    questions.forEach(q => { const qId = q.qId; const container = questionContent || document; if (q.type === 'slider') { const input = container.querySelector(`#${qId}.q-input`); if (input) currentElementAnswers[qId] = parseFloat(input.value); } else if (q.type === 'radio') { const checked = container.querySelector(`input[name="${qId}"]:checked`); if (checked) currentElementAnswers[qId] = checked.value; } else if (q.type === 'checkbox') { const checked = container.querySelectorAll(`input[name="${qId}"]:checked`); currentElementAnswers[qId] = Array.from(checked).map(cb => cb.value); } });
    userAnswers[elementName] = { ...currentElementAnswers };
}
function updateDynamicFeedback(elementName) { /* ... no changes needed ... */
    if (!dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) return; const tempScore = calculateElementScore(elementName, currentElementAnswers); feedbackElementSpan.textContent = elementDetails[elementName]?.name || elementName; feedbackScoreSpan.textContent = tempScore.toFixed(1); let labelSpan = dynamicScoreFeedback.querySelector('.score-label'); if (!labelSpan) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode.insertBefore(document.createTextNode(' '), feedbackScoreSpan.nextSibling); feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling.nextSibling); } labelSpan.textContent = `(${getScoreLabel(tempScore)})`; feedbackScoreBar.style.width = `${tempScore * 10}%`;
}
function calculateElementScore(elementName, answersForElement) { /* ... no changes needed ... */
    const questions = questionnaireGuided[elementName] || []; let score = 5.0;
    questions.forEach(q => { const answer = answersForElement[q.qId]; let pointsToAdd = 0; if (q.type === 'slider') { const value = (answer !== undefined) ? answer : q.defaultValue; pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0); } else if (q.type === 'radio') { const opt = q.options.find(o => o.value === answer); pointsToAdd = opt ? (opt.points || 0) * (q.scoreWeight || 1.0) : 0; } else if (q.type === 'checkbox' && Array.isArray(answer)) { answer.forEach(val => { const opt = q.options.find(o => o.value === val); pointsToAdd += opt ? (opt.points || 0) * (q.scoreWeight || 1.0) : 0; }); } score += pointsToAdd; });
    return Math.max(0, Math.min(10, score));
}
function nextElement() { /* ... no changes needed ... */
    collectCurrentElementAnswers(); currentElementIndex++; displayElementQuestions(currentElementIndex);
}
function prevElement() { /* ... no changes needed ... */
     collectCurrentElementAnswers(); currentElementIndex--; displayElementQuestions(currentElementIndex);
}


function finalizeScoresAndShowPersona() {
     console.log("Finalizing scores..."); const finalScores = {}; elementNames.forEach(elementName => { const score = calculateElementScore(elementName, userAnswers[elementName] || {}); const key = elementNameToKey[elementName]; if (key) { finalScores[key] = score; } }); userScores = finalScores; console.log("Final User Scores:", userScores);

     // Run starter hand selection
     determineStarterHandAndEssence();

     // Update Milestones *after* starter hand potentially adds concepts
     updateMilestoneProgress('completeQuestionnaire', 1);

     // Update UI elements *AFTER* data should be populated
     displayPersonaScreen(); // Includes essence, attunement, core concepts
     displayElementEssenceStudy(); // Update study screen essence
     displayDailyRituals(); // Update rituals (if dependent on state)
     displayMilestones(); // Update milestone display
     populateGrimoireFilters(); // Populate filter dropdowns
     updateGrimoireCounter(); // Update count based on discoveredConcepts
     displayGrimoire(); // Try displaying the grimoire initially

     checkForDailyLogin(); // Check login status

     // Show the main screen
     showScreen('personaScreen'); // Start on persona screen
     setTimeout(() => { alert("Experiment Complete! Explore your Persona Tapestry, Grimoire, and The Study."); }, 100);
}

// --- Starter Hand & Initial Essence ---
function determineStarterHandAndEssence() {
    console.log("[determineStarterHand] Function called.");
     // Verify concepts availability
    console.log("[determineStarterHand] Checking 'concepts' variable type:", typeof concepts, "Is Array:", Array.isArray(concepts), "Length:", concepts?.length);

    try {
        // Reset state (already done in initialize, but safe to repeat)
        discoveredConcepts = new Map();
        elementEssence = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
        console.log("[determineStarterHand] State reset.");

        if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
             console.error("[determineStarterHand] 'concepts' array is missing or empty!");
             return; // Cannot proceed
        }

        let conceptsWithDistance = [];
        console.log(`[determineStarterHand] Processing ${concepts.length} total concepts.`);

        concepts.forEach((c, index) => {
            // Basic check for concept structure
            if (!c || typeof c !== 'object' || !c.id || !c.elementScores) {
                console.warn(`[determineStarterHand] Skipping invalid concept at index ${index}:`, c);
                return; // Skip this iteration
            }

            const conceptScores = c.elementScores;
            // Note: euclideanDistance now logs warnings internally for bad concept scores
            const distance = euclideanDistance(userScores, conceptScores);

            // Log first few calculations for verification
            if (index < 5) {
                 console.log(`[determineStarterHand] Dist calc for ID ${c.id} (${c.name}): ${distance}`);
            }

            if (distance !== Infinity && typeof distance === 'number' && !isNaN(distance)) {
                conceptsWithDistance.push({ ...c, distance: distance });
            } else {
                 // Warning should already be logged by euclideanDistance if conceptScores were bad
                 // Log if distance calc failed for other reasons (e.g., userScores issue)
                 if (distance === Infinity) {
                     console.warn(`[determineStarterHand] Skipping concept ${c.id} (${c.name}) due to Infinity distance (check userScores or conceptScores structure).`);
                 } else {
                    console.warn(`[determineStarterHand] Skipping concept ${c.id} (${c.name}) due to invalid distance result: ${distance}`);
                 }
            }
        });

        console.log(`[determineStarterHand] Found ${conceptsWithDistance.length} concepts with valid distances.`);
        if (conceptsWithDistance.length === 0) {
            console.error("[determineStarterHand] No concepts comparable! Cannot select starter hand.");
            return; // Cannot proceed
        }

        // Sort by distance
        conceptsWithDistance.sort((a, b) => a.distance - b.distance);
        console.log("[determineStarterHand] Concepts sorted (Top 15):", conceptsWithDistance.slice(0,15).map(c => `${c.name}(${c.distance.toFixed(1)})`));

        // Selection Logic (keep as is, seems reasonable)
        const candidates = conceptsWithDistance.slice(0, 15); // Consider top 15 closest
        const starterHand = [];
        const representedElements = new Set();
        const starterHandIds = new Set();

        // 1. Prioritize closest matches (up to 4)
        for (const c of candidates) {
            if (starterHand.length >= 4) break;
            if (!starterHandIds.has(c.id)) { // Avoid duplicates
                starterHand.push(c);
                starterHandIds.add(c.id);
                if (c.primaryElement) representedElements.add(c.primaryElement);
            }
        }

        // 2. Add variety (up to 7 total) - prioritize unrepresented primary elements
        for (const c of candidates) {
             if (starterHand.length >= 7) break;
             if (starterHandIds.has(c.id)) continue; // Skip already added

             const isRepresented = c.primaryElement && representedElements.has(c.primaryElement);
             // Check if all remaining candidates have represented primary elements OR we still need cards
             const forceAdd = candidates.slice(candidates.indexOf(c)).every(remaining =>
                 (remaining.primaryElement && representedElements.has(remaining.primaryElement)) || starterHand.length >= 7
             );

             if (!isRepresented || forceAdd) {
                 starterHand.push(c);
                 starterHandIds.add(c.id);
                 if (c.primaryElement) representedElements.add(c.primaryElement);
             }
        }

         // 3. Fill remaining slots if needed (up to 7) from closest
        for (const c of candidates) {
            if (starterHand.length >= 7) break;
            if (!starterHandIds.has(c.id)) {
                starterHand.push(c);
                starterHandIds.add(c.id);
                // Don't need to track representedElements here anymore
            }
        }


        console.log("[determineStarterHand] Starter Hand Selected:", starterHand.map(c => c.name));
        if (starterHand.length === 0) {
            console.error("[determineStarterHand] Failed to select any starter hand cards!");
            return; // Cannot proceed
        }

        // Process selected starter hand: Add to discovered, grant essence, grant attunement
        starterHand.forEach(concept => {
            console.log(`[determineStarterHand] Processing starter card: ${concept.name} (ID: ${concept.id})`);
            // Add to discovered concepts
            discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false });
            // Grant initial essence (multiplier 0.5)
            grantEssenceForConcept(concept, 0.5); // DEBUG THIS FUNCTION CALL
            // Grant initial attunement
            gainAttunementForAction('discover', concept.primaryElement);
        });

        // *** DEBUG LOG: Check discovered concepts map ***
        console.log("[determineStarterHand] Discovered Concepts Map after loop:", discoveredConcepts);
        console.log(`[determineStarterHand] Discovered Concepts Count: ${discoveredConcepts.size}`);

        // *** DEBUG LOG: Check final essence state ***
        console.log("[determineStarterHand] Final Initial Essence State:", elementEssence); // Check if non-zero now


    } catch (error) {
        console.error("!!! UNCAUGHT ERROR in determineStarterHand !!!", error); // More specific error log
    }
    console.log("[determineStarterHand] Function finished.");
}


// --- Attunement ---
function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) {
    let targetKeys = [];
    const gainAmount = amount; // Use fixed amount passed

    if (elementKey && elementAttunement.hasOwnProperty(elementKey)) {
        targetKeys.push(elementKey);
    } else if (actionType === 'completeReflection' && currentReflectionElement) {
        // Get key from the stored full name
        const key = elementNameToKey[currentReflectionElement];
        if (key && elementAttunement.hasOwnProperty(key)) {
            targetKeys.push(key);
        } else {
             console.warn(`Could not find key for reflection element: ${currentReflectionElement}`);
        }
    } else if (actionType === 'generic' || elementKey === 'All') {
        targetKeys = Object.keys(elementAttunement);
        amount = 0.1; // Override amount for 'All'
    } else {
        // console.warn(`gainAttunement: Invalid elementKey (${elementKey}) or actionType (${actionType}) without key.`);
        return; // No valid target key found
    }

    let changed = false;
    targetKeys.forEach(key => {
        const currentAttunement = elementAttunement[key] || 0;
        const newAttunement = Math.min(MAX_ATTUNEMENT, currentAttunement + gainAmount);
        if (newAttunement > currentAttunement) {
            elementAttunement[key] = newAttunement;
            changed = true;
        }
    });

    if (changed) {
        console.log(`Attunement updated (${actionType}, Key: ${elementKey || 'Multi/None'}):`, elementAttunement);
        displayElementAttunement(); // Update UI if changed
    }
}

function displayElementAttunement() { /* ... no changes needed ... */
    if (!elementAttunementDisplay) return; elementAttunementDisplay.innerHTML = '';
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const attunementValue = elementAttunement[key] || 0; const percentage = (attunementValue / MAX_ATTUNEMENT) * 100;
        elementAttunementDisplay.innerHTML += `<div class="attunement-item"><span class="attunement-name">${elementDetails[elName]?.name || elName}:</span><div class="attunement-bar-container" title="${attunementValue.toFixed(1)} / ${MAX_ATTUNEMENT}"><div class="attunement-bar" style="width: ${percentage}%; background-color: ${getElementColor(elName)};"></div></div></div>`;
    });
}

// --- Persona Screen Functions ---
function displayPersonaScreen() { /* ... no changes needed ... */
    if (!personaElementDetailsDiv) { console.error("Persona details div not found!"); return; } personaElementDetailsDiv.innerHTML = '';
    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName]; const score = userScores[key]; const scoreLabel = getScoreLabel(score); const elementData = elementDetails[elementName] || {}; const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A"; const barWidth = score ? (score / 10) * 100 : 0; // Handle potential undefined score
        const details = document.createElement('details'); details.classList.add('element-detail-entry');
        details.innerHTML = `<summary class="element-detail-header"><div><strong>${elementData.name || elementName}:</strong><span>${score?.toFixed(1) ?? '?'}</span> <span class="score-label">(${scoreLabel})</span></div><div class="score-bar-container"><div style="width: ${barWidth}%; background-color: ${getElementColor(elementName)};"></div></div></summary><div class="element-description"><p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p><p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p><hr><p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p><p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p></div>`;
        personaElementDetailsDiv.appendChild(details);
    });
    displayElementEssencePersona(); displayElementAttunement(); displayCoreConceptsPersona(); synthesizeAndDisplayThemesPersona(); displayMilestones();
}
function displayElementEssencePersona() { /* ... no changes needed ... */
    if (!elementEssenceDisplayPersona) return; elementEssenceDisplayPersona.innerHTML = ''; let hasEssence = false;
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const essenceValue = parseFloat(elementEssence[key] || 0); if (essenceValue > 0.001) hasEssence = true; // Use small threshold
        elementEssenceDisplayPersona.innerHTML += `<div class="essence-item"><span class="essence-icon" style="background-color: ${getElementColor(elName)};"></span><span class="essence-name">${elementDetails[elName]?.name || elName}:</span><span class="essence-value">${essenceValue.toFixed(1)}</span></div>`;
    });
    if (!hasEssence) { elementEssenceDisplayPersona.innerHTML += '<p style="font-size: 0.85em; text-align: left; color: #777;"><i>No Essence. Discover or reflect to gain some.</i></p>'; }
}
function displayCoreConceptsPersona() { /* ... no changes needed ... */
    if (!personaCoreConceptsDisplay) return; personaCoreConceptsDisplay.innerHTML = '';
    if (coreConcepts.size === 0) { personaCoreConceptsDisplay.innerHTML = '<li>Mark concepts as "Core" from the Grimoire or detail view to build your tapestry.</li>'; return; }
    coreConcepts.forEach(conceptId => { const conceptData = discoveredConcepts.get(conceptId); if (conceptData?.concept) { const concept = conceptData.concept; const item = document.createElement('div'); item.classList.add('core-concept-item'); item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`; item.innerHTML = `<i class="${getCardTypeIcon(concept.cardType)}"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`; item.addEventListener('click', () => showConceptDetailPopup(concept.id)); personaCoreConceptsDisplay.appendChild(item); } else { console.warn(`Core concept ID ${conceptId} not found in discoveredConcepts.`); } });
}
// *** FIX: Use elementKeyToFullName map ***
function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return; personaThemesList.innerHTML = '';
     if (coreConcepts.size === 0) { personaThemesList.innerHTML = '<li>Mark Core Concepts for themes.</li>'; return; }
     const elementCountsByKey = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const threshold = 7.0;
     coreConcepts.forEach(id => {
         const discoveredData = discoveredConcepts.get(id); // Get from discovered map
         const concept = discoveredData?.concept; // Extract concept
         if (concept?.elementScores) {
             for (const key in concept.elementScores) {
                 // Use hasOwnProperty on the key map for safety
                 if (elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= threshold) {
                    elementCountsByKey[key]++;
                 }
             }
         }
     });
     // Use elementKeyToFullName here
     const sortedThemes = Object.entries(elementCountsByKey)
         .filter(([key, count]) => count > 0 && elementKeyToFullName[key]) // Ensure key exists in map
         .sort(([, a], [, b]) => b - a)
         .map(([key, count]) => ({ name: elementDetails[elementKeyToFullName[key]]?.name || key, count })); // Use map

     if (sortedThemes.length === 0) { personaThemesList.innerHTML = '<li>No strong themes (score >= 7.0) detected in your Core Concepts yet.</li>'; return; }
     sortedThemes.slice(0, 3).forEach(theme => { const li = document.createElement('li'); li.textContent = `${theme.name} Focus (${theme.count} Core concepts)`; personaThemesList.appendChild(li); });
}


// --- Study Screen Functions ---
function displayElementEssenceStudy() { /* ... no changes needed ... */
     if (!elementEssenceDisplayStudy) return; elementEssenceDisplayStudy.innerHTML = '';
     elementNames.forEach(elName => {
         const key = elementNameToKey[elName]; const currentEssence = parseFloat(elementEssence[key] || 0); const canAfford = currentEssence >= RESEARCH_COST;
         const counter = document.createElement('div'); counter.classList.add('essence-counter'); counter.dataset.elementKey = key; // Use KEY in dataset
         counter.title = `Research ${elementDetails[elName]?.name || elName} (Cost: ${RESEARCH_COST})`; counter.classList.toggle('disabled', !canAfford);
         counter.innerHTML = `<span class="essence-icon" style="background-color: ${getElementColor(elName)};"></span><span class="essence-name">${elementDetails[elName]?.name || elName}</span><span class="essence-value">${currentEssence.toFixed(1)}</span><div class="essence-cost">Cost: ${RESEARCH_COST}</div>`;
         if (canAfford) { counter.addEventListener('click', handleResearchClick); } elementEssenceDisplayStudy.appendChild(counter);
     });
}
function handleResearchClick(event) { /* ... no changes needed ... */
    const elementKey = event.currentTarget.dataset.elementKey; // Get KEY
    if (!elementKey || event.currentTarget.classList.contains('disabled')) return;
    const currentEssence = parseFloat(elementEssence[elementKey] || 0);
    if (currentEssence >= RESEARCH_COST) { elementEssence[elementKey] = currentEssence - RESEARCH_COST; console.log(`Spent ${RESEARCH_COST} ${elementKey} Essence.`); displayElementEssenceStudy(); conductResearch(elementKey); updateMilestoneProgress('conductResearch', 1); }
    else { alert(`Not enough ${elementDetails[elementKeyToFullName[elementKey]]?.name || elementKey} Essence! Need ${RESEARCH_COST}.`); } // Improved alert
}
// *** FIX: Use elementKeyToFullName map ***
function conductResearch(elementKeyToResearch) { // Expects KEY
    const elementFullName = elementKeyToFullName[elementKeyToResearch]; // Use map
    if (!elementFullName) { console.error("Invalid key for research:", elementKeyToResearch); return; }
    console.log(`Researching: ${elementFullName} (Key: ${elementKeyToResearch})`); if (researchStatus) researchStatus.textContent = `Researching ${elementDetails[elementFullName]?.name || elementFullName}...`; if (researchModalContent) researchModalContent.innerHTML = '';
    const discoveredIds = new Set(discoveredConcepts.keys()); const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));
    if (undiscoveredPool.length === 0) {
        if (researchModalStatus) researchModalStatus.textContent = "All concepts have been discovered!";
        if (researchStatus) researchStatus.textContent = "Research complete. No more concepts to find.";
        if (researchModal) researchModal.classList.remove('hidden');
        if (popupOverlay) popupOverlay.classList.remove('hidden');
        return;
    }
    const currentAttunement = elementAttunement[elementKeyToResearch] || 0; // Use KEY for attunement check
    const priorityPool = []; const secondaryPool = []; const tertiaryPool = [...undiscoveredPool]; // Clone for modification

    // Categorize based on affinity to the researched element
    undiscoveredPool.forEach(c => {
        const score = c.elementScores?.[elementKeyToResearch] || 0;
        const primary = c.primaryElement === elementKeyToResearch;
        const indexInTertiary = tertiaryPool.findIndex(tc => tc.id === c.id); // Find in the clone

        if (primary || score >= 8.0) { // High affinity or primary element
            priorityPool.push(c);
            if (indexInTertiary > -1) tertiaryPool.splice(indexInTertiary, 1); // Remove from tertiary
        } else if (score >= 5.0) { // Moderate affinity
            secondaryPool.push(c);
             if (indexInTertiary > -1) tertiaryPool.splice(indexInTertiary, 1); // Remove from tertiary
        }
        // Else: leave in tertiaryPool (low affinity)
    });

    const selectedForOutput = [];
    const selectWeightedRandomFromPool = (pool) => { /* ... (Weighted selection logic unchanged - looks okay) ... */
        if (pool.length === 0) return null; let totalWeight = 0;
        const weightedPool = pool.map(card => { let weight = 1.0;
             // Rarity bonus scales with attunement (more likely to get rarer cards at higher attunement)
            const rarityBonus = 1 + (currentAttunement / MAX_ATTUNEMENT); // Simple linear scaling 1x to 2x
            if (card.rarity === 'uncommon') weight *= (1.5 * rarityBonus);
            if (card.rarity === 'rare') weight *= (2.0 * rarityBonus);
            totalWeight += weight; return { card, weight };
        });
        let randomPick = Math.random() * totalWeight; let chosenCard = null;
        for (let i = 0; i < weightedPool.length; i++) {
            const item = weightedPool[i];
            if (randomPick < item.weight) {
                chosenCard = item.card;
                // IMPORTANT: Remove the chosen card from the original pool array it came from
                const originalIndex = pool.findIndex(c => c.id === chosenCard.id);
                if (originalIndex > -1) pool.splice(originalIndex, 1);
                break;
            }
            randomPick -= item.weight;
        }
         // Fallback if weights/random fails somehow
        if (!chosenCard && pool.length > 0) {
            console.warn("Weighted selection fallback triggered.");
            const fallbackIndex = Math.floor(Math.random() * pool.length);
            chosenCard = pool[fallbackIndex];
            pool.splice(fallbackIndex, 1); // Remove from pool
        }
        return chosenCard;
    };

    // Select up to 3 cards, prioritizing pools
    for (let i = 0; i < 3; i++) {
         let selectedCard = selectWeightedRandomFromPool(priorityPool) || selectWeightedRandomFromPool(secondaryPool) || selectWeightedRandomFromPool(tertiaryPool);
         if (selectedCard) { selectedForOutput.push(selectedCard); } else { break; } // Stop if no more cards in any pool
    }

    if (selectedForOutput.length > 0) {
        if (researchModalStatus) researchModalStatus.textContent = `Discovered ${selectedForOutput.length} new concept(s)! Click card to view & add.`;
        if (researchModalContent) researchModalContent.innerHTML = ''; // Clear previous results
        selectedForOutput.forEach(concept => {
             // Render card in 'research-result' context (might need specific styling/click behavior)
             // For now, reuse standard renderCard, click will open detail popup
            const cardElement = renderCard(concept, 'research-result'); // Context allows potential specific handling
            if (researchModalContent) researchModalContent.appendChild(cardElement);
        });
        if (researchStatus) researchStatus.textContent = `Research complete. ${selectedForOutput.length} new concept(s) found! Check results.`;
        gainAttunementForAction('researchSuccess', elementKeyToResearch, 0.8); // Grant slightly more attunement for success
    }
    else {
        if (researchModalStatus) researchModalStatus.textContent = "No new concepts found this time.";
        if (researchStatus) researchStatus.textContent = "Research complete. No new concepts discovered.";
         gainAttunementForAction('researchFail', elementKeyToResearch, 0.2); // Grant tiny attunement even on failure
    }
    if (researchModal) researchModal.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}


// --- Grimoire Functions ---
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") {
     if (!grimoireContentDiv) return; grimoireContentDiv.innerHTML = '';
     if (discoveredConcepts.size === 0) { grimoireContentDiv.innerHTML = '<p style="text-align: center; color: #666;">Your Grimoire is empty. Discover concepts through Research in The Study.</p>'; /* Removed showScreen call here */ return; } // Don't switch screen here

     let discoveredArray = Array.from(discoveredConcepts.values()); // Get array of { concept, discoveredTime, artUnlocked }

     const conceptsToDisplay = discoveredArray.filter(data => {
         if (!data || !data.concept) return false; // Safety check
         const concept = data.concept;
         const typeMatch = (filterType === "All") || (concept.cardType === filterType);
         // FilterElement uses FULL NAME from dropdown value
         const elementMatch = (filterElement === "All") || (concept.primaryElement === elementNameToKey[filterElement]); // Compare primary KEY with converted filter name
         const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);
         return typeMatch && elementMatch && rarityMatch;
     });

     // Sorting logic (seems okay)
     if (sortBy === 'name') conceptsToDisplay.sort((a, b) => a.concept.name.localeCompare(b.concept.name));
     else if (sortBy === 'type') conceptsToDisplay.sort((a, b) => a.concept.cardType.localeCompare(b.concept.cardType) || a.concept.name.localeCompare(b.concept.name));
     else if (sortBy === 'rarity') { const order = { 'common': 1, 'uncommon': 2, 'rare': 3 }; conceptsToDisplay.sort((a, b) => (order[a.concept.rarity] || 0) - (order[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name)); }
     else conceptsToDisplay.sort((a,b) => a.discoveredTime - b.discoveredTime); // Default sort by discovered time

     if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p style="text-align: center; color: #666;">No discovered concepts match the current filters.</p>`; }
     else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); grimoireContentDiv.appendChild(cardElement); }); }
     // Removed showScreen call from here, it's handled by the nav button listener
}

function populateGrimoireFilters() { /* ... no changes needed ... */
    if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); }
    if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = name; /* Use Full Name for filter value */ option.textContent = name; grimoireElementFilter.appendChild(option); }); }
    // Rarity filter is static HTML
}
function updateGrimoireCounter() { if (grimoireCountSpan) grimoireCountSpan.textContent = discoveredConcepts.size; }


// --- Card Rendering Function ---
// *** FIX: Use elementKeyToFullName map ***
function renderCard(concept, context = 'grimoire') {
    if (!concept || !concept.id) { console.warn("renderCard called with invalid concept:", concept); return document.createElement('div'); } // Basic validation

    const cardDiv = document.createElement('div'); cardDiv.classList.add('concept-card'); cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`); cardDiv.dataset.conceptId = concept.id; cardDiv.title = `View ${concept.name}`;

    // Check discovery status *based on the map*
    const discoveredData = discoveredConcepts.get(concept.id);
    const isDiscovered = !!discoveredData; // Card is in the map
    const isCore = coreConcepts.has(concept.id); // Check core set
    const artUnlocked = discoveredData?.artUnlocked || false; // Check unlocked status from map data

    // Stamps based on current state
    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    const coreStampHTML = isCore ? '<span class="core-indicator" title="Core Concept">★</span>' : '';
    const cardTypeIcon = getCardTypeIcon(concept.cardType);

    // Affinities
    let affinitiesHTML = '';
    if (concept.elementScores) {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
             const level = getAffinityLevel(score); // Returns "High", "Moderate", or null
             if (level && elementKeyToFullName[key]) { // Check if key is valid
                 const fullName = elementKeyToFullName[key]; // Use map
                 const color = getElementColor(fullName);
                 const levelClass = level === "High" ? "affinity-high" : ""; // Only add class for High
                 // Use icons for elements
                 affinitiesHTML += `<span class="affinity ${levelClass}" style="border-color: ${color}; color: ${color}; background-color: ${hexToRgba(color, 0.1)};" title="${elementDetails[fullName]?.name || fullName} Affinity: ${level}">
                                         <i class="${getElementIcon(fullName)}"></i> ${level.substring(0,1)}</span> `; // Show only H or M
             }
        });
    }

    const currentVisualHandle = artUnlocked ? (concept.visualHandleUnlocked || concept.visualHandle) : concept.visualHandle;
    // Use actual unlocked art handle if available, otherwise placeholder
    const visualContent = artUnlocked && concept.visualHandleUnlocked
         ? `<img src="placeholder_art/${concept.visualHandleUnlocked}.png" alt="${concept.name} Art" class="card-art-image">` // Placeholder IMG tag
         : `<i class="fas fa-${artUnlocked ? 'star' : 'question'} card-visual-placeholder ${artUnlocked ? 'card-art-unlocked' : ''}" title="${currentVisualHandle}"></i>`; // Placeholder icon

    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${coreStampHTML}${grimoireStampHTML}</span>
        </div>
        <div class="card-visual">
             ${visualContent}
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
        </div>`;

     // Add click listener unless specified otherwise
     if (context !== 'no-click') {
         cardDiv.addEventListener('click', () => showConceptDetailPopup(concept.id));
     }

     // Special handling for research results? (e.g., make clicking add it)
     if (context === 'research-result') {
         cardDiv.title = `Click to view details for ${concept.name}`;
         // The popup will handle the 'Add to Grimoire' button
     }

    return cardDiv;
}


// --- Concept Detail Pop-up Logic ---
function showConceptDetailPopup(conceptId) {
     const conceptData = concepts.find(c => c.id === conceptId);
     const discoveredData = discoveredConcepts.get(conceptId); // Check if discovered

     if (!conceptData) { console.error(`Concept ${conceptId} not found!`); return; }

     currentlyDisplayedConceptId = conceptId; // Store ID for actions

     // Populate static info
     if (popupConceptName) popupConceptName.textContent = conceptData.name;
     if (popupConceptType) popupConceptType.textContent = conceptData.cardType;
     if (popupCardTypeIcon) popupCardTypeIcon.className = `${getCardTypeIcon(conceptData.cardType)} card-type-icon`; // Update icon class
     if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No detailed description available.";

     // Populate Visual
     const artUnlocked = discoveredData?.artUnlocked || false;
     const currentVisualHandle = artUnlocked ? (conceptData.visualHandleUnlocked || conceptData.visualHandle) : conceptData.visualHandle;
     if (popupCardVisual) {
         popupCardVisual.className = `fa-solid ${artUnlocked ? 'fa-star card-art-unlocked' : 'fa-image card-visual-placeholder'}`; // Use FontAwesome icons or clear for image
         popupCardVisual.title = currentVisualHandle || "Visual representation";
          // Clear previous image if any
         const existingImg = popupCardVisual.parentNode.querySelector('.card-art-image');
         if (existingImg) existingImg.remove();
         // Add image if art is unlocked and handle exists
         if (artUnlocked && conceptData.visualHandleUnlocked) {
            popupCardVisual.className = ''; // Remove icon classes
            const img = document.createElement('img');
            img.src = `placeholder_art/${conceptData.visualHandleUnlocked}.png`; // Use placeholder path
            img.alt = `${conceptData.name} Art`;
            img.classList.add('card-art-image'); // Add class for styling
             popupCardVisual.parentNode.insertBefore(img, popupCardVisual); // Add image before placeholder
         }
     }


     // Calculate and display resonance
     const distance = euclideanDistance(userScores, conceptData.elementScores);
     displayPopupResonance(distance);

     // Display recipe comparison
     displayPopupRecipeComparison(conceptData);

     // Display related concepts
     displayPopupRelatedConcepts(conceptData);

     // Display Evolution section if applicable
     displayEvolutionSection(conceptData, discoveredData);

     // Update button states
     updateGrimoireButtonStatus(conceptId);
     updateCoreButtonStatus(conceptId);


     if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
     if (popupOverlay) popupOverlay.classList.remove('hidden');
 }

function displayPopupResonance(distance) { /* ... no changes needed ... */
    if (!popupResonanceSummary) return;
    let resonanceLabel = "Low"; let resonanceClass = "resonance-low";
    if (distance === Infinity || isNaN(distance)) { resonanceLabel = "N/A"; resonanceClass = ""; }
    else if (distance < 2.5) { resonanceLabel = "Very High"; resonanceClass = "resonance-high"; } // Tighter threshold for Very High
    else if (distance < 4.0) { resonanceLabel = "High"; resonanceClass = "resonance-high"; }
    else if (distance < 6.0) { resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; }
    // Default is Low
    popupResonanceSummary.innerHTML = `Resonance with You: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> (Dist: ${distance.toFixed(1)})`;
}
// *** FIX: Use elementKeyToFullName map ***
function displayPopupRecipeComparison(conceptData) {
    if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return;

    popupConceptProfile.innerHTML = ''; popupUserComparisonProfile.innerHTML = ''; popupComparisonHighlights.innerHTML = '';
    let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>'; let hasHighlights = false;

    const conceptScores = conceptData.elementScores || {};
    const userCompScores = userScores || {}; // Use the global userScores

    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const fullName = elementKeyToFullName[key]; // Use map
        if (!fullName) return; // Skip if key is invalid

        const conceptScore = conceptScores[key];
        const userScore = userCompScores[key];
        const conceptLabel = getScoreLabel(conceptScore);
        const userLabel = getScoreLabel(userScore);

        const conceptBarWidth = conceptScore ? (conceptScore / 10) * 100 : 0;
        const userBarWidth = userScore ? (userScore / 10) * 100 : 0;
        const color = getElementColor(fullName);

        popupConceptProfile.innerHTML += `<div><strong>${elementDetails[fullName]?.name.substring(0, 11) || elName}:</strong> <span>${conceptScore?.toFixed(1) ?? '?'}</span> <div class="score-bar-container"><div style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`;
        popupUserComparisonProfile.innerHTML += `<div><strong>${elementDetails[fullName]?.name.substring(0, 11) || elName}:</strong> <span>${userScore?.toFixed(1) ?? '?'}</span> <div class="score-bar-container"><div style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`;

        // Highlight significant matches or mismatches
        const diff = Math.abs(conceptScore - userScore);
        if (conceptScore >= 7 && userScore >= 7) { // Both high
            highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementDetails[fullName]?.name || elName} (${userLabel})</p>`; hasHighlights = true;
        } else if (conceptScore <= 3 && userScore <= 3) { // Both low
             highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementDetails[fullName]?.name || elName} (${userLabel})</p>`; hasHighlights = true;
        } else if (diff >= 4) { // Significant difference
             const direction = conceptScore > userScore ? "higher" : "lower";
             highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementDetails[fullName]?.name || elName} (Concept is ${conceptLabel}, You are ${userLabel})</p>`; hasHighlights = true;
        }
    });
    if (!hasHighlights) highlightsHTML += '<p><em>No strong alignments or major differences detected.</em></p>';
    popupComparisonHighlights.innerHTML = highlightsHTML;
}
function displayPopupRelatedConcepts(conceptData) { /* ... no changes needed ... */
     if (!popupRelatedConceptsList) return; popupRelatedConceptsList.innerHTML = '';
     if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
         conceptData.relatedIds.forEach(relatedId => { const relatedConcept = concepts.find(c => c.id === relatedId); if (relatedConcept) { const li = document.createElement('li'); li.textContent = relatedConcept.name; li.dataset.conceptId = relatedId; li.addEventListener('click', handleRelatedConceptClick); popupRelatedConceptsList.appendChild(li); } });
     } else { popupRelatedConceptsList.innerHTML = '<li>None specified</li>'; }
}
function handleRelatedConceptClick(event) { /* ... no changes needed ... */
     const conceptId = event.target.dataset.conceptId; if (!conceptId) return;
     const numericId = parseInt(conceptId);
     if (!isNaN(numericId)) { showConceptDetailPopup(numericId); } // Show detail for the clicked related concept
}
// *** FIX: Use elementKeyToFullName map ***
function displayEvolutionSection(conceptData, discoveredData) {
    if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return;

    const isDiscovered = !!discoveredData;
    const canUnlock = conceptData.canUnlockArt;
    const alreadyUnlocked = discoveredData?.artUnlocked || false;
    const isCore = coreConcepts.has(conceptData.id);
    const requiredElement = conceptData.primaryElement; // Use primary element key
    const fullName = elementKeyToFullName[requiredElement]; // Use map
    const currentEssence = elementEssence[requiredElement] || 0;
    const cost = ART_EVOLVE_COST;
    const hasEnoughEssence = currentEssence >= cost;
    // Simplified reflection check: Assume any reflection contributes (Placeholder)
    const hasReflected = seenPrompts.size > 0; // Very basic check

    evolveCostSpan.textContent = cost; // Display cost

    if (isDiscovered && canUnlock && !alreadyUnlocked) {
        popupEvolutionSection.classList.remove('hidden');
        let eligibilityText = ''; let canEvolve = true;

        if (!isCore) { eligibilityText += '<li>Mark as Core Concept</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Marked as Core</li>'; }
        if (!hasReflected) { eligibilityText += '<li>Engage in Reflection</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Reflection Engaged</li>'; }
        if (!hasEnoughEssence) { eligibilityText += `<li>Need ${cost} ${elementDetails[fullName]?.name || requiredElement} Essence (Have ${currentEssence.toFixed(1)})</li>`; canEvolve = false;} else { eligibilityText += `<li><i class="fas fa-check"></i> Enough Essence</li>`; }

        evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`;
        evolveEligibility.classList.remove('hidden');
        evolveArtButton.disabled = !canEvolve;
        // Add listener if not already added (or manage listeners better)
        evolveArtButton.onclick = () => attemptArtEvolution(conceptData.id, requiredElement, cost);

    } else {
        popupEvolutionSection.classList.add('hidden');
        evolveArtButton.disabled = true;
        evolveEligibility.classList.add('hidden');
        evolveArtButton.onclick = null; // Remove listener
    }
}
function attemptArtEvolution(conceptId, essenceElementKey, cost) { /* ... (logic seems okay, uses key) ... */
     console.log(`Attempting art evolution for ${conceptId} using ${essenceElementKey} essence.`);
     const discoveredData = discoveredConcepts.get(conceptId);
     if (!discoveredData || !discoveredData.concept || discoveredData.artUnlocked) { console.error("Cannot evolve: Not discovered or already unlocked."); return; }
     const concept = discoveredData.concept;
     if (!concept.canUnlockArt) { console.error("Cannot evolve: Art is not unlockable for this concept."); return; }

     const isCore = coreConcepts.has(conceptId);
     const hasReflected = seenPrompts.size > 0; // Simplified check
     const currentEssence = elementEssence[essenceElementKey] || 0;

     if (isCore && hasReflected && currentEssence >= cost) {
         // Deduct cost
         elementEssence[essenceElementKey] = currentEssence - cost;
         // Update discovered data
         discoveredData.artUnlocked = true;
         discoveredConcepts.set(conceptId, discoveredData); // Update map entry

         console.log(`Art unlocked for ${concept.name}!`);
         showTemporaryMessage(`Enhanced Art Unlocked for ${concept.name}!`);

         // Update displays
         displayElementEssenceStudy(); // Refresh study essence
         displayElementEssencePersona(); // Refresh persona essence
         if (currentlyDisplayedConceptId === conceptId) {
             displayEvolutionSection(concept, discoveredData); // Refresh evolution section in popup
             // Refresh visual in popup
             const artUnlocked = discoveredData?.artUnlocked || false;
             const currentVisualHandle = artUnlocked ? (concept.visualHandleUnlocked || concept.visualHandle) : concept.visualHandle;
             if (popupCardVisual) {
                 // Clear previous image if any
                 const existingImg = popupCardVisual.parentNode.querySelector('.card-art-image');
                 if (existingImg) existingImg.remove();
                 // Add image if art is unlocked and handle exists
                 if (artUnlocked && concept.visualHandleUnlocked) {
                    popupCardVisual.className = ''; // Remove icon classes
                    const img = document.createElement('img');
                    img.src = `placeholder_art/${concept.visualHandleUnlocked}.png`;
                    img.alt = `${concept.name} Art`;
                    img.classList.add('card-art-image');
                    popupCardVisual.parentNode.insertBefore(img, popupCardVisual);
                 } else {
                     popupCardVisual.className = `fa-solid fa-star card-visual-placeholder card-art-unlocked`; // Fallback icon if no image
                 }
                 popupCardVisual.title = currentVisualHandle || "Visual representation";
             }
         }
         if (grimoireScreen.classList.contains('current')) {
            displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); // Refresh grimoire if open
         }

          gainAttunementForAction('artEvolve', essenceElementKey, 1.5); // Attunement bonus
          updateMilestoneProgress('evolveArt', 1); // Track milestone

     } else {
         console.warn("Evolution conditions not met.");
         alert("Cannot unlock art yet. Check requirements: Core Status, Reflection, Essence.");
     }
}


// --- Grimoire/Core Button & State Logic ---

// *** DEBUG: Add detailed logging to grantEssenceForConcept ***
function grantEssenceForConcept(concept, multiplier = 1.0) {
    if (!concept || !concept.elementScores) {
        console.warn(`[grantEssence] Invalid concept or missing scores for ${concept?.name || 'Unknown Concept'}`);
        return;
    }
    console.log(`[grantEssence] Called for: ${concept.name} (ID: ${concept.id}), Multiplier: ${multiplier}`);
    let grantedAny = false;

    for (const key in concept.elementScores) {
        // Use hasOwnProperty on the elementEssence object itself to ensure the key is valid ('A', 'I', etc.)
        if (elementEssence.hasOwnProperty(key)) {
            const score = concept.elementScores[key];
            if (typeof score !== 'number' || isNaN(score)) {
                console.warn(` -> Invalid score (${score}) for key ${key} in concept ${concept.name}. Skipping.`);
                continue; // Skip this element key if score is invalid
            }

            // Calculate gain (simple scaling based on score, plus multiplier)
            // Base gain even for score 0, scaling up to 0.2 for score 10
            let baseGain = 0.1 + (score / 100.0); // e.g., Score 5 -> 0.15, Score 10 -> 0.2
            let essenceToGrant = baseGain * multiplier;

             // Make sure essenceToGrant is a valid number
             if (isNaN(essenceToGrant)) {
                 console.warn(` -> Calculated essenceToGrant is NaN for key ${key} (Base: ${baseGain}, Mult: ${multiplier}). Skipping.`);
                 continue;
             }

             // Ensure the current value is treated as a number
             let currentVal = parseFloat(elementEssence[key] || 0);
             if (isNaN(currentVal)) {
                 console.warn(` -> Current essence value for key ${key} is NaN. Resetting to 0.`);
                 currentVal = 0;
             }

             // Add the granted essence
             elementEssence[key] = currentVal + essenceToGrant;
             console.log(` -> Granted ${essenceToGrant.toFixed(3)} for key ${key}. New total: ${elementEssence[key].toFixed(3)}`);
             grantedAny = true;

        } else {
             // This case means the concept has an elementScore key (e.g., 'X') that doesn't exist in our elementEssence object
             console.warn(` -> Concept ${concept.name} has score for invalid key: ${key}`);
        }
    }

    if (!grantedAny) {
        console.warn(`[grantEssence] No essence was granted for ${concept.name}. Check element keys and scores.`);
    } else {
         // Optionally, trigger UI update immediately if needed, though usually batched later
         // displayElementEssenceStudy();
         // displayElementEssencePersona();
    }
}

function addToGrimoire() {
    if (currentlyDisplayedConceptId === null) return;
    const concept = concepts.find(c => c.id === currentlyDisplayedConceptId);
    if (!concept) { console.error("Concept not found for adding to grimoire"); return; }

    if (!discoveredConcepts.has(concept.id)) {
        console.log(`Adding ${concept.name} to Grimoire.`);
        discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false });
        grantEssenceForConcept(concept, 1.0); // Grant full essence on manual add
        gainAttunementForAction('addToGrimoire', concept.primaryElement, 0.6); // Attunement bonus
        updateGrimoireCounter();
        updateGrimoireButtonStatus(concept.id); // Update button in popup
        updateCoreButtonStatus(concept.id); // Show core button now
        displayElementEssenceStudy(); // Update study display
        displayElementEssencePersona(); // Update persona display
        checkAndApplySynergyBonus(concept, 'add'); // Check synergy
         checkTriggerReflectionPrompt('add'); // Check if reflection triggers
         updateMilestoneProgress('addToGrimoire', 1); // Track milestone
         updateMilestoneProgress('discoveredConcepts.size', discoveredConcepts.size); // Update size milestone

        // Optional: Refresh grimoire view if currently open
        if (grimoireScreen.classList.contains('current')) {
             displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value);
        }
         showTemporaryMessage(`${concept.name} added to Grimoire!`);

    } else {
        console.log(`${concept.name} is already in the Grimoire.`);
        showTemporaryMessage(`${concept.name} is already in your Grimoire.`);
    }
}
function toggleCoreConcept() { /* ... (logic seems okay, uses keys internally via grant/attunement) ... */
    if (currentlyDisplayedConceptId === null) return;
    const discoveredData = discoveredConcepts.get(currentlyDisplayedConceptId);
    if (!discoveredData || !discoveredData.concept) { console.error("Concept not found or not discovered."); return; }
    const concept = discoveredData.concept;

    if (coreConcepts.has(concept.id)) {
        coreConcepts.delete(concept.id);
        console.log(`Removed ${concept.name} from Core Concepts.`);
        showTemporaryMessage(`${concept.name} removed from Core.`);
        // No essence penalty for removing? Or small cost? For now, no cost.
    } else {
        coreConcepts.add(concept.id);
        console.log(`Marked ${concept.name} as Core Concept.`);
        showTemporaryMessage(`${concept.name} marked as Core!`);
        grantEssenceForConcept(concept, 0.2); // Small essence bonus for marking core
        gainAttunementForAction('markCore', concept.primaryElement, 1.0); // Attunement bonus
        checkAndApplySynergyBonus(concept, 'core'); // Check synergy
        updateMilestoneProgress('markCore', 1);
        updateMilestoneProgress('coreConcepts.size', coreConcepts.size);
    }
    updateCoreButtonStatus(concept.id); // Update button text/state
    displayCoreConceptsPersona(); // Refresh persona display
    synthesizeAndDisplayThemesPersona(); // Refresh themes
    displayElementEssenceStudy(); // Refresh study essence display
    displayElementEssencePersona(); // Refresh persona essence display
     // Refresh card render if Grimoire is visible
     if (grimoireScreen.classList.contains('current')) {
         displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value);
     }
}
function checkAndApplySynergyBonus(concept, action) { /* ... (logic seems okay, uses keys) ... */
    let synergyFound = false; const bonusMultiplier = 0.2; // Extra essence multiplier
    const messageAction = action === 'add' ? 'added' : 'marked core';
    // Check synergy with CORE concepts only when adding a NEW concept or marking one CORE
    if (action === 'add' || action === 'core') {
         coreConcepts.forEach(coreId => {
             if (coreId === concept.id) return; // Don't compare to self
             const coreConceptData = discoveredConcepts.get(coreId);
             if (!coreConceptData) return;
             const coreConcept = coreConceptData.concept;
             // Check if the new/cored concept is related to an existing core concept
             if (coreConcept.relatedIds && coreConcept.relatedIds.includes(concept.id)) {
                 synergyFound = true;
                 console.log(`Synergy! ${concept.name} relates to Core Concept ${coreConcept.name}. Granting bonus essence.`);
                 grantEssenceForConcept(concept, bonusMultiplier); // Grant bonus based on *new* concept's scores
                 grantEssenceForConcept(coreConcept, bonusMultiplier); // Grant bonus based on *related* core concept's scores
                 gainAttunementForAction('synergy', concept.primaryElement, 0.5);
                 gainAttunementForAction('synergy', coreConcept.primaryElement, 0.5);
             }
             // Check reverse relationship too
              if (concept.relatedIds && concept.relatedIds.includes(coreId)) {
                 synergyFound = true;
                 console.log(`Synergy! ${coreConcept.name} relates to newly ${messageAction} ${concept.name}. Granting bonus essence.`);
                 grantEssenceForConcept(concept, bonusMultiplier);
                 grantEssenceForConcept(coreConcept, bonusMultiplier);
                  gainAttunementForAction('synergy', concept.primaryElement, 0.5);
                  gainAttunementForAction('synergy', coreConcept.primaryElement, 0.5);
             }
         });
         if(synergyFound) showTemporaryMessage("Synergy Bonus! Essence granted.");
    }
}
function updateGrimoireButtonStatus(conceptId) { /* ... no changes needed ... */
    if (!addToGrimoireButton) return;
    const isDiscovered = discoveredConcepts.has(conceptId);
    addToGrimoireButton.disabled = isDiscovered;
    addToGrimoireButton.textContent = isDiscovered ? "In Grimoire" : "Add to Grimoire";
    addToGrimoireButton.classList.toggle('added', isDiscovered);
}
function updateCoreButtonStatus(conceptId) { /* ... no changes needed ... */
    if (!markAsCoreButton) return;
    const isDiscovered = discoveredConcepts.has(conceptId);
    const isCore = coreConcepts.has(conceptId);

    // Only show the button if the concept is actually discovered
    markAsCoreButton.classList.toggle('hidden', !isDiscovered);

    if (isDiscovered) {
        markAsCoreButton.textContent = isCore ? "Remove Core" : "Mark as Core";
        markAsCoreButton.classList.toggle('marked', isCore);
    }
}

// --- Reflection Prompts ---
function checkTriggerReflectionPrompt(triggerAction = 'other') { /* ... (logic seems okay) ... */
    if (promptCooldownActive) return; // Don't trigger if cooling down

    // Trigger on adding 3 unique cards OR completing questionnaire
    if (triggerAction === 'add') cardsAddedSinceLastPrompt++;
    if (triggerAction === 'completeQuestionnaire') cardsAddedSinceLastPrompt = 99; // Force trigger after questionnaire

    const triggerThreshold = 3;
    if (cardsAddedSinceLastPrompt >= triggerThreshold) {
        displayReflectionPrompt();
        cardsAddedSinceLastPrompt = 0; // Reset counter
        promptCooldownActive = true; // Start cooldown
        setTimeout(() => { promptCooldownActive = false; console.log("Reflection cooldown ended."); }, 1000 * 60 * 5); // 5 min cooldown
    }
}
function displayReflectionPrompt() { /* ... (logic seems okay) ... */
    // Find elements with highest attunement OR lowest attunement OR least reflected
    let possibleElements = elementNames.filter(elName => {
         // Basic check: filter out elements with no prompts defined
         return reflectionPrompts[elName] && reflectionPrompts[elName].length > 0;
    });
    if (possibleElements.length === 0) { console.warn("No reflection prompts available for any element."); return; }

    // Simple strategy: pick a random element for now
    const targetElementName = possibleElements[Math.floor(Math.random() * possibleElements.length)];
    const promptsForElement = reflectionPrompts[targetElementName] || [];
    const availablePrompts = promptsForElement.filter(p => !seenPrompts.has(p.id));

    let selectedPrompt;
    if (availablePrompts.length > 0) {
        selectedPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    } else {
        // If all seen for this element, pick a random one again (allow repeats if necessary)
        if (promptsForElement.length > 0) {
             console.log(`All prompts seen for ${targetElementName}, showing random.`);
             selectedPrompt = promptsForElement[Math.floor(Math.random() * promptsForElement.length)];
        } else {
            console.error(`No prompts defined for randomly selected element ${targetElementName}?`);
            return; // Should not happen based on filter above
        }
    }

    if (!selectedPrompt) { console.error("Could not select a reflection prompt."); return; }

    currentReflectionElement = targetElementName; // Store full name
    currentPromptId = selectedPrompt.id;

    if (reflectionElement) reflectionElement.textContent = elementDetails[targetElementName]?.name || targetElementName;
    if (reflectionPromptText) reflectionPromptText.textContent = selectedPrompt.text;
    if (reflectionCheckbox) reflectionCheckbox.checked = false;
    if (confirmReflectionButton) confirmReflectionButton.disabled = true;
    // Calculate reward based on attunement? For now, fixed.
     const rewardAmount = 2.0; // Example fixed reward
     if (reflectionRewardAmount) reflectionRewardAmount.textContent = rewardAmount;


    if (reflectionModal) reflectionModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}
// *** FIX: Use elementNameToKey for essence gain ***
function handleConfirmReflection() {
    if (!currentReflectionElement || !currentPromptId || !reflectionCheckbox || !reflectionCheckbox.checked) return;

    console.log(`Reflection confirmed for ${currentReflectionElement}, prompt ID: ${currentPromptId}`);
    seenPrompts.add(currentPromptId); // Track seen prompt

    // Grant Rewards
    const rewardAmount = parseFloat(document.getElementById('reflectionRewardAmount')?.textContent || 2.0);
    const elementKey = elementNameToKey[currentReflectionElement]; // Use map to get key

    if (elementKey && elementEssence.hasOwnProperty(elementKey)) {
        let currentVal = parseFloat(elementEssence[elementKey] || 0);
        elementEssence[elementKey] = currentVal + rewardAmount;
        console.log(`Granted ${rewardAmount} ${elementKey} Essence for reflection.`);
        displayElementEssenceStudy(); // Update UI
        displayElementEssencePersona();
    } else {
         console.warn(`Could not grant essence reward - invalid key for element: ${currentReflectionElement}`);
    }

    // Grant Attunement (uses currentReflectionElement full name)
    gainAttunementForAction('completeReflection', null, 1.0); // Let gainAttunement handle the key lookup

     updateMilestoneProgress('completeReflection', 1);

    hidePopups(); // Close the modal
    showTemporaryMessage("Reflection complete! Essence & Attunement gained.");
}


// --- Rituals & Milestones ---
function displayDailyRituals() { /* ... (placeholder logic seems okay) ... */
     if (!dailyRitualsDisplay) return; dailyRitualsDisplay.innerHTML = '';
     if (!dailyRituals || dailyRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No rituals defined.</li>'; return; }

     dailyRituals.forEach(ritual => {
         const isCompleted = completedRituals.daily[ritual.id] || false; // Check completion status (needs persistence)
         const li = document.createElement('li');
         li.classList.toggle('completed', isCompleted);
         let rewardText = '';
         if (ritual.reward) {
            if (ritual.reward.type === 'essence') rewardText = `(+${ritual.reward.amount} ${ritual.reward.element} Essence)`;
            if (ritual.reward.type === 'attunement') rewardText = `(+${ritual.reward.amount} Attunement)`;
         }
         li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`;
         dailyRitualsDisplay.appendChild(li);
     });
}
function checkAndUpdateRituals(action, details = {}) { /* ... (placeholder logic) ... */
     console.log("Checking rituals for action:", action, details);
     // This needs proper implementation based on tracked actions/state
     // Example (very basic):
     dailyRituals.forEach(ritual => {
        if (!completedRituals.daily[ritual.id]) { // If not already complete today
            if (ritual.track.action === action) {
                 // Increment progress (needs better tracking state)
                 // If progress >= count, mark complete
                 // completedRituals.daily[ritual.id] = true;
                 // displayDailyRituals(); // Update UI
                 // Grant reward...
            }
        }
     });
}
function displayMilestones() { /* ... (logic seems okay) ... */
    if (!milestonesDisplay) return; milestonesDisplay.innerHTML = '';
    if (achievedMilestones.size === 0) { milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>'; return; }
    achievedMilestones.forEach(milestoneId => { const milestone = milestones.find(m => m.id === milestoneId); if (milestone) { const li = document.createElement('li'); li.textContent = `✓ ${milestone.description}`; milestonesDisplay.appendChild(li); } });
}
// *** FIX: Use elementNameToKey for reward key ***
function updateMilestoneProgress(trackType, currentValue) {
     // console.log("Checking Milestones:", trackType, currentValue);
     milestones.forEach(m => {
         if (!achievedMilestones.has(m.id)) { // If not already achieved
             let achieved = false;
             if (m.track.action === trackType) {
                 // Simple count check (needs proper counter state)
                 // Assume currentValue is the total count for now
                 if (currentValue >= m.track.count) achieved = true;
             } else if (m.track.state === trackType) {
                  // State check (e.g., discoveredConcepts.size)
                 if (m.track.condition === "any") {
                     // Check if *any* value in the state object meets threshold
                     if (typeof currentValue === 'object') {
                         for (const key in currentValue) { if (currentValue[key] >= m.track.threshold) { achieved = true; break; } }
                     }
                 } else {
                     // Direct value comparison
                     if (currentValue >= m.track.threshold) achieved = true;
                 }
             }

             if (achieved) {
                 console.log("Milestone Achieved!", m.description);
                 achievedMilestones.add(m.id);
                 displayMilestones(); // Update display
                 showMilestoneAlert(m.description); // Show alert

                 // Grant Reward
                 if (m.reward) {
                     if (m.reward.type === 'essence') {
                         const amount = m.reward.amount || 0;
                         if (m.reward.element === 'All') {
                            Object.keys(elementEssence).forEach(key => elementEssence[key] += amount);
                            console.log(`Granted ${amount} All Essence`);
                         } else if (m.reward.element === 'Random') {
                             const keys = Object.keys(elementEssence);
                             const randomKey = keys[Math.floor(Math.random() * keys.length)];
                             elementEssence[randomKey] += amount;
                              console.log(`Granted ${amount} ${randomKey} Essence`);
                         } else {
                              const key = m.reward.element; // Assume key is provided directly
                              if (elementEssence.hasOwnProperty(key)) {
                                 elementEssence[key] += amount;
                                 console.log(`Granted ${amount} ${key} Essence`);
                              } else { console.warn(`Invalid essence key in milestone reward: ${key}`);}
                         }
                         displayElementEssenceStudy(); // Update UI
                         displayElementEssencePersona();
                     } else if (m.reward.type === 'attunement') {
                          // Grant attunement using gainAttunementForAction
                          gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0);
                     } else if (m.reward.type === 'message') {
                         // Message is shown via alert, nothing more needed here maybe
                     }
                 }
             }
         }
     });
}
function showMilestoneAlert(text) { /* ... (logic seems okay) ... */
     if (!milestoneAlert || !milestoneAlertText) return;
     milestoneAlertText.textContent = `Milestone: ${text}`;
     milestoneAlert.classList.remove('hidden');
     // Auto-hide after a few seconds?
     setTimeout(hideMilestoneAlert, 5000);
}
function hideMilestoneAlert() { /* ... (logic seems okay) ... */
     if (milestoneAlert) milestoneAlert.classList.add('hidden');
}
function showTemporaryMessage(message, duration = 3000) { /* ... (logic seems okay) ... */
     // Simple implementation: use console for now, could be a toast notification
     console.info(`Message: ${message}`);
     // Future: implement a proper toast notification element
}

// --- Reset App ---
function resetApp() { /* ... no changes needed ... */
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
        console.log("Resetting application state...");
        // Clear local storage if implemented
        // Reset global variables
        initializeQuestionnaire(); // This handles resetting most state vars and UI
        // Ensure initial screen is shown
        showScreen('welcomeScreen');
    }
}

// --- Daily Login Check ---
function checkForDailyLogin() { /* ... (placeholder logic seems okay) ... */
     const today = new Date().toDateString();
     if (lastLoginDate !== today) {
         console.log("First login of the day detected.");
         // Reset daily ritual completion status (needs persistence)
         completedRituals.daily = {};
         lastLoginDate = today; // Update last login (needs persistence)
         displayDailyRituals(); // Refresh display

         // Potential daily login bonus?
         // gainAttunementForAction('dailyLogin', 'All', 0.2);
         // grantEssence...
          showTemporaryMessage("Daily rituals reset.");
     }
}

// --- Event Listeners (MUST BE AT THE END) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Card Concept Expanded...");

    // --- Navigation Buttons ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreenId = button.dataset.target;
            if (!document.getElementById(targetScreenId)) {
                console.error(`Target screen #${targetScreenId} not found!`);
                return;
            }
            // Refresh content specific to the target screen *before* showing it
            if (targetScreenId === 'personaScreen') { displayPersonaScreen(); }
            if (targetScreenId === 'studyScreen') { displayElementEssenceStudy(); displayDailyRituals(); }
            if (targetScreenId === 'grimoireScreen') { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); }

            showScreen(targetScreenId); // Switch the visible screen
        });
    });

    // --- Questionnaire Buttons ---
    if (startButton) startButton.addEventListener('click', initializeQuestionnaire); else console.error("Start button not found!");
    if (nextElementButton) nextElementButton.addEventListener('click', nextElement); else console.error("Next button not found!");
    if (prevElementButton) prevElementButton.addEventListener('click', prevElement); else console.error("Prev button not found!");

    // --- Persona Screen Button ---
    if (restartButtonPersona) restartButtonPersona.addEventListener('click', resetApp); else console.error("Restart button (Persona) not found!");

    // --- Popup Close Buttons ---
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopups); else console.error("Close Popup button not found!");
    if (popupOverlay) popupOverlay.addEventListener('click', hidePopups); else console.error("Popup Overlay not found!");
    if (closeResearchModalButton) closeResearchModalButton.addEventListener('click', hidePopups); else console.error("Close Research Modal button not found!");
    if (closeReflectionModalButton) closeReflectionModalButton.addEventListener('click', hidePopups); else console.error("Close Reflection Modal button not found!");
    if (closeMilestoneAlertButton) closeMilestoneAlertButton.addEventListener('click', hideMilestoneAlert); else console.error("Close Milestone Alert button not found!");

    // --- Concept Detail Popup Buttons ---
    if (addToGrimoireButton) addToGrimoireButton.addEventListener('click', addToGrimoire); else console.error("Add to Grimoire button not found!");
    if (markAsCoreButton) markAsCoreButton.addEventListener('click', toggleCoreConcept); else console.error("Mark as Core button not found!");
    // Note: Evolve button listener is added dynamically in displayEvolutionSection

    // --- Grimoire Controls ---
    const grimoireRefresh = () => {
         if (!grimoireScreen.classList.contains('hidden')) { // Only refresh if grimoire is visible
             displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value);
         }
    };
    if (grimoireTypeFilter) grimoireTypeFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Type filter not found!");
    if (grimoireElementFilter) grimoireElementFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Element filter not found!");
    if (grimoireRarityFilter) grimoireRarityFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Rarity filter not found!");
    if (grimoireSortOrder) grimoireSortOrder.addEventListener('change', grimoireRefresh); else console.error("Grimoire Sort order not found!");

    // --- Reflection Modal Controls ---
    if (reflectionCheckbox) reflectionCheckbox.addEventListener('change', () => { if(confirmReflectionButton) confirmReflectionButton.disabled = !reflectionCheckbox.checked; }); else console.error("Reflection checkbox not found!");
    if (confirmReflectionButton) confirmReflectionButton.addEventListener('click', handleConfirmReflection); else console.error("Confirm Reflection button not found!");

    // --- Initial Setup ---
    showScreen('welcomeScreen'); // Start on the welcome screen
    console.log("Initial screen set to Welcome.");
}); // End DOMContentLoaded
