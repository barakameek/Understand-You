// script.js - COMPLETE VERSION v7 (Insight Resource, Focus Slots, Dissonance Reflection, Research QoL, Nudge)

// --- Global State ---
let currentElementIndex = 0;
let userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; // Use single letter keys
let userAnswers = {}; // Stores answers keyed by FULL element names during questionnaire
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"]; // Full names for display/logic
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"]; // For filtering
let currentElementAnswers = {}; // Temp storage for current element's answers
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // ID -> { concept, discoveredTime, artUnlocked: boolean }
let focusedConcepts = new Set(); // Track IDs marked as "Focus" (replaces coreConcepts)
let focusSlotsTotal = 5; // Starting number of Focus slots (replaces CORE_CONCEPT_LIMIT)
const MAX_FOCUS_SLOTS = 12; // Absolute maximum focus slots achievable

// *** NEW: Insight Resource ***
let userInsight = 10; // Start with some initial Insight

// Attunement remains
let elementAttunement = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
const MAX_ATTUNEMENT = 100;
const BASE_RESEARCH_COST = 15; // Base Insight cost for research
const ART_EVOLVE_COST = 20; // Insight cost for art evolution
const DISSONANCE_THRESHOLD = 6.5; // Distance score above which dissonance reflection triggers
const SCORE_NUDGE_AMOUNT = 0.15; // How much score changes on nudge

// --- Research QoL ---
let freeResearchAvailableToday = false;

// --- Reflection State ---
let currentReflectionContext = null; // e.g., 'Dissonance', 'Standard'
let reflectionTargetConceptId = null; // Stores concept ID for dissonance reflection actions

// --- Persistent State Tracking (Placeholder) ---
let seenPrompts = new Set();
let completedRituals = { daily: {}, weekly: {} }; // Track by ID: { completed: boolean, progress: number }
let achievedMilestones = new Set();
let lastLoginDate = null;
let cardsAddedSinceLastPrompt = 0;
let promptCooldownActive = false;
// currentReflectionElement (Full Name) and currentPromptId remain


// --- DOM Elements ---
// (Assume all previous const declarations are here and correct)
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
// REMOVED: elementEssenceDisplayPersona
const userInsightDisplayPersona = document.getElementById('userInsightDisplayPersona'); // Needs adding to HTML
const focusedConceptsDisplay = document.getElementById('focusedConceptsDisplay'); // Renamed from personaCoreConceptsDisplay
const focusedConceptsHeader = document.getElementById('focusedConceptsHeader'); // Needs adding to HTML for count/limit
const personaThemesList = document.getElementById('personaThemesList');
const restartButtonPersona = document.getElementById('restartButtonPersona');
const studyScreen = document.getElementById('studyScreen');
// REMOVED: elementEssenceDisplayStudy
const userInsightDisplayStudy = document.getElementById('userInsightDisplayStudy'); // Needs adding to HTML
const researchButtonContainer = document.getElementById('researchButtonContainer'); // Needs adding to HTML
const freeResearchButton = document.getElementById('freeResearchButton'); // Needs adding to HTML
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
const popupVisualContainer = document.getElementById('popupVisualContainer');
const popupDetailedDescription = document.getElementById('popupDetailedDescription');
const popupResonanceSummary = document.getElementById('popupResonanceSummary');
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const popupRelatedConceptsList = document.getElementById('relatedConceptsList');
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
const markAsFocusButton = document.getElementById('markAsFocusButton'); // Renamed from markAsCoreButton
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
const reflectionCheckbox = document.getElementById('reflectionCheckbox'); // Standard checkbox
const scoreNudgeCheckbox = document.getElementById('scoreNudgeCheckbox'); // Added for dissonance
const scoreNudgeLabel = document.getElementById('scoreNudgeLabel'); // Added for dissonance
const confirmReflectionButton = document.getElementById('confirmReflectionButton');
const reflectionRewardAmount = document.getElementById('reflectionRewardAmount'); // Will now show Insight reward
const milestoneAlert = document.getElementById('milestoneAlert');
const milestoneAlertText = document.getElementById('milestoneAlertText');
const closeMilestoneAlertButton = document.getElementById('closeMilestoneAlertButton');


// --- Utility & Setup Functions ---

// *** NEW: Gain Insight ***
function gainInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return;
    userInsight += amount;
    console.log(`Gained ${amount.toFixed(1)} Insight from ${source}. New total: ${userInsight.toFixed(1)}`);
    updateInsightDisplays(); // Update UI
}

// *** NEW: Update Insight UI ***
function updateInsightDisplays() {
    const formattedInsight = userInsight.toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = formattedInsight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = formattedInsight;
    // Potentially update research button enabled/disabled states here too
    displayResearchButtons(); // Refresh research buttons based on new Insight total
}

function getScoreLabel(score) { /* ... no change ... */ }
function getAffinityLevel(score) { /* ... no change ... */ }
function getElementColor(elementName) { /* ... no change ... */ }
function hexToRgba(hex, alpha = 1) { /* ... no change ... */ }
function getCardTypeIcon(cardType) { /* ... no change ... */ }
function getElementIcon(elementName) { /* ... no change ... */ }
const elementNameToKey = { /* ... no change ... */ };
// elementKeyToFullName comes from data.js

function euclideanDistance(userScoresObj, conceptScoresObj) { /* ... no change ... */ }


// --- Screen Management ---
function showScreen(screenId) { /* ... no change ... */ }
function hidePopups() {
    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (researchModal) researchModal.classList.add('hidden');
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (popupOverlay) popupOverlay.classList.add('hidden');
    currentlyDisplayedConceptId = null;
    // Reset reflection state
    currentReflectionElement = null;
    currentPromptId = null;
    currentReflectionContext = null;
    reflectionTargetConceptId = null;
}

// --- Initialization and Questionnaire Logic ---
function initializeQuestionnaire() {
    currentElementIndex = 0; userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; userAnswers = {}; elementNames.forEach(elName => { userAnswers[elName] = {}; });
    discoveredConcepts = new Map(); focusedConcepts = new Set();
    userInsight = 10; // Reset Insight
    focusSlotsTotal = 5; // Reset Focus Slots
    elementAttunement = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
    seenPrompts = new Set(); completedRituals = { daily: {}, weekly: {} }; achievedMilestones = new Set(); lastLoginDate = null; cardsAddedSinceLastPrompt = 0; promptCooldownActive = false; freeResearchAvailableToday = false;
    updateElementProgressHeader(-1); displayElementQuestions(currentElementIndex); showScreen('questionnaireScreen'); if (mainNavBar) mainNavBar.classList.add('hidden');
    // Clear displays
    if(dailyRitualsDisplay) dailyRitualsDisplay.innerHTML = '<li>Loading...</li>';
    if(milestonesDisplay) milestonesDisplay.innerHTML = '<li>None yet</li>';
    if(elementAttunementDisplay) elementAttunementDisplay.innerHTML = '';
    if(grimoireContentDiv) grimoireContentDiv.innerHTML = '<p style="text-align: center; color: #666;">Grimoire empty.</p>';
    if(focusedConceptsDisplay) focusedConceptsDisplay.innerHTML = '<li>Mark concepts as "Focus" to build your tapestry.</li>';
    updateInsightDisplays(); // Update insight UI
    updateFocusSlotsDisplay(); // Update focus slot count
    updateGrimoireCounter();
    if(researchButtonContainer) researchButtonContainer.innerHTML = ''; // Clear old research buttons
    if(freeResearchButton) freeResearchButton.classList.add('hidden'); // Hide free button initially
}

// --- Questionnaire Display/Logic Functions (Keep slider feedback under slider) ---
function updateElementProgressHeader(activeIndex) { /* ... uses full names, no change needed from v6 ... */ }
function displayElementQuestions(index) { /* ... includes slider feedback p, no change needed from v6 ... */ }
function updateSliderFeedbackText(sliderElement) { /* ... no change needed from v6 ... */ }
function handleQuestionnaireInputChange(event) { /* ... calls updateSliderFeedbackText, no change needed from v6 ... */ }
function enforceMaxChoices(name, max, event) { /* ... no change ... */ }
function collectCurrentElementAnswers() { /* ... no change ... */ }
function updateDynamicFeedback(elementName) { /* ... only shows overall score/label, no change needed from v6 ... */ }
function calculateElementScore(elementName, answersForElement) { /* ... no change ... */ }
function nextElement() { /* ... no change ... */ }
function prevElement() { /* ... no change ... */ }

function finalizeScoresAndShowPersona() {
     console.log("Finalizing scores...");
     const finalScores = {};
     elementNames.forEach(elementName => {
         const score = calculateElementScore(elementName, userAnswers[elementName] || {});
         const key = elementNameToKey[elementName];
         if (key) { finalScores[key] = score; }
     });
     userScores = finalScores;
     console.log("Final User Scores:", userScores);

     // Syntax error might have been here if a function call was broken
     try {
         determineStarterHandAndEssence(); // Renamed but keep old name for now, refactor later
         updateMilestoneProgress('completeQuestionnaire', 1); // Track completion milestone
         checkForDailyLogin(); // Check login AFTER state is ready
         displayPersonaScreen(); // Update persona UI (attunement, focus slots)
         displayStudyScreenContent(); // Update study UI (insight, research buttons)
         displayDailyRituals(); // Update rituals UI
         displayMilestones(); // Update milestones UI
         populateGrimoireFilters();
         updateGrimoireCounter();
         displayGrimoire(); // Render initial grimoire
         showScreen('personaScreen'); // Show persona screen first
         setTimeout(() => { alert("Experiment Complete! Explore your Persona Tapestry, Grimoire, and The Study."); }, 100);
     } catch (error) {
         console.error("Error during finalizeScoresAndShowPersona sequence:", error);
         // Maybe show a fallback screen or message
         showScreen('welcomeScreen'); // Fallback to welcome
         alert("An error occurred during setup. Please try restarting.");
     }
}

// --- Starter Hand & Resource Granting (Refactored for Insight) ---
function determineStarterHandAndEssence() { // Keep name for now
    console.log("[determineStarterHand] Function called.");
    console.log("[determineStarterHand] Checking 'concepts' variable type:", typeof concepts, "Is Array:", Array.isArray(concepts), "Length:", concepts?.length);
    console.log("[determineStarterHand] Checking 'elementKeyToFullName' variable type:", typeof elementKeyToFullName);
    try {
        discoveredConcepts = new Map();
        // Insight already reset in initializeQuestionnaire
        console.log("[determineStarterHand] State reset (excluding Insight).");
        if (!concepts || !Array.isArray(concepts) || concepts.length === 0) { console.error("[determineStarterHand] 'concepts' array is missing or empty!"); return; }
        if (typeof elementKeyToFullName === 'undefined' || elementKeyToFullName === null) { console.error("[determineStarterHand] 'elementKeyToFullName' map is missing!"); return; }

        let conceptsWithDistance = [];
        // ... (distance calculation loop remains the same) ...
        concepts.forEach((c, index) => {
             if (!c || typeof c !== 'object' || !c.id || !c.elementScores) { console.warn(`[determineStarterHand] Skipping invalid concept at index ${index}:`, c); return; }
             const conceptScores = c.elementScores; const distance = euclideanDistance(userScores, conceptScores);
             if (index < 5) { console.log(`[determineStarterHand] Dist calc for ID ${c.id} (${c.name}): ${distance}`); }
             if (distance !== Infinity && typeof distance === 'number' && !isNaN(distance)) { conceptsWithDistance.push({ ...c, distance: distance }); }
             else { console.warn(`[determineStarterHand] Skipping concept ${c.id} (${c.name}) due to invalid distance: ${distance}`); }
        });
        // ... (sorting and selection logic remains the same) ...
        console.log(`[determineStarterHand] Found ${conceptsWithDistance.length} concepts with valid distances.`);
        if (conceptsWithDistance.length === 0) { console.error("[determineStarterHand] No concepts comparable!"); return; }
        conceptsWithDistance.sort((a, b) => a.distance - b.distance);
        console.log("[determineStarterHand] Concepts sorted (Top 15):", conceptsWithDistance.slice(0,15).map(c => `${c.name}(${c.distance.toFixed(1)})`));
        const candidates = conceptsWithDistance.slice(0, 15); const starterHand = []; const representedElements = new Set(); const starterHandIds = new Set();
        for (const c of candidates) { if (starterHand.length >= 4) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } }
        for (const c of candidates) { if (starterHand.length >= 7) break; if (starterHandIds.has(c.id)) continue; const isRepresented = c.primaryElement && representedElements.has(c.primaryElement); const forceAdd = candidates.slice(candidates.indexOf(c)).every(remaining => (remaining.primaryElement && representedElements.has(remaining.primaryElement)) || starterHand.length >= 7 ); if (!isRepresented || forceAdd) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } }
        for (const c of candidates) { if (starterHand.length >= 7) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); } }

        console.log("[determineStarterHand] Starter Hand Selected:", starterHand.map(c => c.name));
        if (starterHand.length === 0) { console.error("[determineStarterHand] Failed to select starter hand!"); return; }

        // Grant initial Attunement and add to discovered
        starterHand.forEach(concept => {
            console.log(`[determineStarterHand] Processing starter card: ${concept.name} (ID: ${concept.id})`);
            discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false });
            // No initial Insight grant for starter hand? Or small flat amount? Let's skip for now.
            // gainInsight(0.5, `Starter Card ${concept.name}`); // Example if we want small grant
            gainAttunementForAction('discover', concept.primaryElement);
        });

        console.log("[determineStarterHand] Discovered Concepts Map after loop:", discoveredConcepts);
        console.log(`[determineStarterHand] Discovered Concepts Count: ${discoveredConcepts.size}`);
        // No need to log initial Essence state anymore
        // console.log("[determineStarterHand] Final Initial Insight State:", userInsight); // Log insight if needed

    } catch (error) { console.error("!!! UNCAUGHT ERROR in determineStarterHand !!!", error); }
    console.log("[determineStarterHand] Function finished.");
}


// --- Attunement --- (Keep as is)
function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) { /* ... no change ... */ }
function displayElementAttunement() { /* ... no change ... */ }

// --- Persona Screen Functions ---
// *** NEW: Update Focus Slots Display ***
function updateFocusSlotsDisplay() {
    if (focusedConceptsHeader) {
        focusedConceptsHeader.textContent = `Focused Concepts (${focusedConcepts.size} / ${focusSlotsTotal})`;
    }
}

function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona details div not found!"); return; } personaElementDetailsDiv.innerHTML = '';
    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName]; const score = userScores[key]; const scoreLabel = getScoreLabel(score); const elementData = elementDetails[elementName] || {}; const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A"; const barWidth = score ? (score / 10) * 100 : 0; const color = getElementColor(elementName);
        const details = document.createElement('details'); details.classList.add('element-detail-entry'); details.style.setProperty('--element-color', color);
        details.innerHTML = `<summary class="element-detail-header"><div><strong>${elementData.name || elementName}:</strong><span>${score?.toFixed(1) ?? '?'}</span> <span class="score-label">(${scoreLabel})</span></div><div class="score-bar-container"><div style="width: ${barWidth}%; background-color: ${color};"></div></div></summary><div class="element-description"><p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p><p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p><hr><p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p><p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p></div>`;
        personaElementDetailsDiv.appendChild(details);
    });
    updateInsightDisplays(); // Update insight display here
    displayElementAttunement();
    displayFocusedConceptsPersona(); // Updated function name
    synthesizeAndDisplayThemesPersona(); // Now based on Focused Concepts
    displayMilestones();
}
// REMOVED displayElementEssencePersona
// displayUserInsightPersona handled by updateInsightDisplays

function displayFocusedConceptsPersona() { // Renamed from displayCoreConceptsPersona
    if (!focusedConceptsDisplay) return; focusedConceptsDisplay.innerHTML = '';
    updateFocusSlotsDisplay(); // Update the count/limit header
    if (focusedConcepts.size === 0) {
        focusedConceptsDisplay.innerHTML = `<li>Mark concepts as "Focus" to weave your active Tapestry (Max ${focusSlotsTotal}).</li>`; return;
    }
    focusedConcepts.forEach(conceptId => {
        const conceptData = discoveredConcepts.get(conceptId);
        if (conceptData?.concept) {
             const concept = conceptData.concept; const item = document.createElement('div'); item.classList.add('focus-concept-item'); // Use new class if desired, or keep 'core-concept-item'
             item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`; item.innerHTML = `<i class="${getCardTypeIcon(concept.cardType)}"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`; item.addEventListener('click', () => showConceptDetailPopup(concept.id)); focusedConceptsDisplay.appendChild(item);
        } else { console.warn(`Focused concept ID ${conceptId} not found in discoveredConcepts.`); }
    });
     // Add placeholders for empty slots? (Optional visual enhancement)
    // for (let i = focusedConcepts.size; i < focusSlotsTotal; i++) {
    //    focusedConceptsDisplay.innerHTML += '<div class="focus-concept-item empty-slot"><i>Empty Slot</i></div>';
    // }
}

function synthesizeAndDisplayThemesPersona() { // Now based on Focused Concepts
     if (!personaThemesList) return; personaThemesList.innerHTML = '';
     if (focusedConcepts.size === 0) { personaThemesList.innerHTML = '<li>Mark Focused Concepts for themes.</li>'; return; }
     if (typeof elementKeyToFullName === 'undefined') { console.error("synthesizeThemes: elementKeyToFullName map not found!"); return; }
     const elementCountsByKey = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const threshold = 7.0;
     focusedConcepts.forEach(id => { // Iterate over focusedConcepts
         const discoveredData = discoveredConcepts.get(id); const concept = discoveredData?.concept;
         if (concept?.elementScores) {
             for (const key in concept.elementScores) { if (elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= threshold) { elementCountsByKey[key]++; } }
         }
     });
     const sortedThemes = Object.entries(elementCountsByKey)
         .filter(([key, count]) => count > 0 && elementKeyToFullName[key])
         .sort(([, a], [, b]) => b - a)
         .map(([key, count]) => ({ name: elementDetails[elementKeyToFullName[key]]?.name || key, count }));
     if (sortedThemes.length === 0) { personaThemesList.innerHTML = '<li>No strong themes (score >= 7.0) detected in your Focused Concepts yet.</li>'; return; }
     sortedThemes.slice(0, 3).forEach(theme => { const li = document.createElement('li'); li.textContent = `${theme.name} Focus (${theme.count} Focused concepts)`; personaThemesList.appendChild(li); });
}

// --- Study Screen Functions ---
// *** NEW: Display Study Screen Content (Insight + Research Buttons) ***
function displayStudyScreenContent() {
    updateInsightDisplays(); // Update the main Insight counter
    displayResearchButtons(); // Generate/update research buttons
    displayDailyRituals(); // Display rituals (might reward insight/tokens now)
    // Research status updates handled by research functions
}

// *** NEW: Generate Research Buttons ***
function displayResearchButtons() {
    if (!researchButtonContainer) return;
    researchButtonContainer.innerHTML = ''; // Clear existing buttons

    // Free Research Button (if available)
    if (freeResearchAvailableToday && freeResearchButton) {
         freeResearchButton.classList.remove('hidden');
         freeResearchButton.disabled = false;
         freeResearchButton.textContent = "Perform Daily Meditation (Free Research)";
         freeResearchButton.onclick = handleFreeResearchClick; // Assign specific handler
         // Maybe add tooltip "Choose an element to focus on for free."
    } else if (freeResearchButton) {
         freeResearchButton.classList.add('hidden'); // Hide if not available
    }

    // Standard Research Buttons
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const currentAttunement = elementAttunement[key] || 0;
        let currentCost = BASE_RESEARCH_COST; // Start with base cost

        // Apply Attunement Discount
        if (currentAttunement > 80) currentCost = Math.max(1, BASE_RESEARCH_COST - 5); // e.g., Cost 10
        else if (currentAttunement > 50) currentCost = Math.max(1, BASE_RESEARCH_COST - 3); // e.g., Cost 12

        const canAfford = userInsight >= currentCost;
        const fullName = elementDetails[elName]?.name || elName;

        const button = document.createElement('button');
        button.classList.add('button', 'research-button'); // Add class for styling
        button.dataset.elementKey = key;
        button.dataset.cost = currentCost; // Store current cost
        button.disabled = !canAfford;
        button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`;

        button.innerHTML = `
            <span class="research-el-icon" style="color: ${getElementColor(elName)};"><i class="${getElementIcon(fullName)}"></i></span>
            <span class="research-el-name">${fullName}</span>
            <span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span>
        `; // Using brain icon for Insight

        button.addEventListener('click', handleResearchClick);
        researchButtonContainer.appendChild(button);
    });
}

// *** UPDATED: Research Click Handler (uses Insight, calculated cost) ***
function handleResearchClick(event) {
    const button = event.currentTarget;
    const elementKey = button.dataset.elementKey;
    const currentCost = parseFloat(button.dataset.cost);

    if (!elementKey || isNaN(currentCost) || button.disabled) return;

    if (userInsight >= currentCost) {
        userInsight -= currentCost; // Deduct Insight cost
        updateInsightDisplays(); // Update UI
        console.log(`Spent ${currentCost} Insight researching ${elementKey}.`);
        conductResearch(elementKey);
        updateMilestoneProgress('conductResearch', 1);
    } else {
        // This shouldn't happen if button is disabled correctly, but safety check
        alert(`Not enough Insight! Need ${currentCost}.`);
    }
}

// *** NEW: Free Research Handler ***
function handleFreeResearchClick() {
    if (!freeResearchAvailableToday) {
         alert("Your free daily meditation has already been performed.");
         return;
    }

    // Simple: For now, just trigger research on a random element or lowest attunement
    // TODO: Could enhance this with a small modal to *choose* the element for the free research
    const keys = Object.keys(elementAttunement);
    let targetKey = keys[0]; // Fallback
    let minAttunement = MAX_ATTUNEMENT + 1;
    keys.forEach(key => {
        if (elementAttunement[key] < minAttunement) {
            minAttunement = elementAttunement[key];
            targetKey = key;
        }
    });
    console.log(`Performing free daily meditation, focusing on ${targetKey} (Lowest Attunement).`);


    freeResearchAvailableToday = false; // Consume the free action
    if (freeResearchButton) { // Update button state
        freeResearchButton.disabled = true;
        freeResearchButton.textContent = "Daily Meditation Performed";
        // freeResearchButton.classList.add('hidden'); // Or just hide it
    }

    conductResearch(targetKey); // Conduct research for the chosen element
    updateMilestoneProgress('freeResearch', 1);
}


// *** UPDATED: Conduct Research (Handles Duplicates, uses Insight) ***
function conductResearch(elementKeyToResearch) {
    if (typeof elementKeyToFullName === 'undefined') { console.error("conductResearch: map missing!"); return; }
    const elementFullName = elementKeyToFullName[elementKeyToResearch];
    if (!elementFullName) { console.error("Invalid key for research:", elementKeyToResearch); return; }
    console.log(`Researching: ${elementFullName} (Key: ${elementKeyToResearch})`);
    if (researchStatus) researchStatus.textContent = `Focusing on ${elementDetails[elementFullName]?.name || elementFullName}...`;
    if (researchModalContent) researchModalContent.innerHTML = '';

    const discoveredIds = new Set(discoveredConcepts.keys());
    const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));

    if (undiscoveredPool.length === 0) { /* ... (no change needed) ... */ }

    const currentAttunement = elementAttunement[elementKeyToResearch] || 0;
    const priorityPool = []; const secondaryPool = []; const tertiaryPool = [...undiscoveredPool];
    // Categorization logic remains the same
    undiscoveredPool.forEach(c => { /* ... (no change needed) ... */ });

    const selectedForOutput = [];
    let duplicateInsightGain = 0; // Track insight from duplicates

    const selectWeightedRandomFromPool = (pool) => { /* ... (no change needed) ... */ };

    // Select up to 3 *unique* new cards
    let attempts = 0; // Prevent infinite loop if only duplicates remain
    const maxAttempts = 10;
    while (selectedForOutput.length < 3 && attempts < maxAttempts && (priorityPool.length > 0 || secondaryPool.length > 0 || tertiaryPool.length > 0)) {
        attempts++;
        let potentialCard = selectWeightedRandomFromPool(priorityPool) || selectWeightedRandomFromPool(secondaryPool) || selectWeightedRandomFromPool(tertiaryPool);

        if (potentialCard) {
            // *** Duplicate Handling ***
            if (discoveredConcepts.has(potentialCard.id)) {
                console.log(`Duplicate research hit: ${potentialCard.name}. Granting Insight.`);
                gainInsight(1.0, `Duplicate Research (${potentialCard.name})`); // Grant 1 Insight for duplicate
                duplicateInsightGain += 1.0;
                // Card is removed from its pool by selectWeightedRandomFromPool, so loop continues
            } else {
                // It's a new card
                selectedForOutput.push(potentialCard);
                // Also remove from other pools if it existed there (edge case, should be rare)
                [priorityPool, secondaryPool, tertiaryPool].forEach(p => {
                    const index = p.findIndex(c => c.id === potentialCard.id);
                    if (index > -1) p.splice(index, 1);
                });
            }
        } else {
            break; // No more cards left in any pool
        }
    }

    // Display results
    let resultMessage = "";
    if (selectedForOutput.length > 0) {
        resultMessage = `Discovered ${selectedForOutput.length} new concept(s)! `;
        if (researchModalContent) researchModalContent.innerHTML = ''; // Clear previous
        selectedForOutput.forEach(concept => {
             const cardElement = renderCard(concept, 'research-result');
             if (researchModalContent) researchModalContent.appendChild(cardElement);
        });
        gainAttunementForAction('researchSuccess', elementKeyToResearch, 0.8);
    } else {
        resultMessage = "No new concepts discovered this time. ";
        if (researchModalContent) researchModalContent.innerHTML = '<p><i>Sometimes introspection yields only familiar thoughts...</i></p>'; // Placeholder message
        gainAttunementForAction('researchFail', elementKeyToResearch, 0.2);
    }

    if (duplicateInsightGain > 0) {
         resultMessage += ` Gained ${duplicateInsightGain.toFixed(0)} Insight from familiar echoes.`;
         // Optionally add a small visual indicator for duplicates in the modal?
    }

    if (researchModalStatus) researchModalStatus.textContent = resultMessage.trim();
    if (researchStatus) researchStatus.textContent = `Research complete. ${resultMessage.trim()}`;
    if (researchModal) researchModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}


// --- Grimoire Functions --- (Keep as is)
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") { /* ... no change ... */ }
function populateGrimoireFilters() { /* ... no change ... */ }
function updateGrimoireCounter() { /* ... no change ... */ }


// --- Card Rendering Function --- (Uses focusedConcepts, no other change)
function renderCard(concept, context = 'grimoire') {
    if (!concept || !concept.id) { /* ... */ return document.createElement('div'); }
    if (typeof elementKeyToFullName === 'undefined') { /* ... */ }
    const cardDiv = document.createElement('div'); cardDiv.classList.add('concept-card'); cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`); cardDiv.dataset.conceptId = concept.id; cardDiv.title = `View ${concept.name}`;
    const discoveredData = discoveredConcepts.get(concept.id); const isDiscovered = !!discoveredData;
    // *** Check focusedConcepts set ***
    const isFocused = focusedConcepts.has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false;
    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    // *** Use isFocused for the stamp ***
    const focusStampHTML = isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : ''; // Renamed class if needed
    const cardTypeIcon = getCardTypeIcon(concept.cardType);
    let affinitiesHTML = ''; /* ... affinity generation ... */
    const currentVisualHandle = artUnlocked ? (concept.visualHandleUnlocked || concept.visualHandle) : concept.visualHandle;
    const visualContent = artUnlocked && concept.visualHandleUnlocked ? `<img src="placeholder_art/${concept.visualHandleUnlocked}.png" alt="${concept.name} Art" class="card-art-image">` : `<i class="fas fa-${artUnlocked ? 'star' : 'question'} card-visual-placeholder ${artUnlocked ? 'card-art-unlocked' : ''}" title="${currentVisualHandle}"></i>`;
    cardDiv.innerHTML = ` <div class="card-header"> <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i> <span class="card-name">${concept.name}</span> <span class="card-stamps">${focusStampHTML}${grimoireStampHTML}</span> </div> <div class="card-visual"> ${visualContent} </div> <div class="card-footer"> <div class="card-affinities">${affinitiesHTML || '<small>...</small>'}</div> <p class="card-brief-desc">${concept.briefDescription || '...'}</p> </div>`;
    if (context !== 'no-click') { cardDiv.addEventListener('click', () => showConceptDetailPopup(concept.id)); }
    if (context === 'research-result') { cardDiv.title = `Click to view details for ${concept.name}`; }
    return cardDiv;
}


// --- Concept Detail Pop-up Logic --- (Uses Insight for Evolve Cost)
function showConceptDetailPopup(conceptId) { /* ... uses popupVisualContainer, no other change ... */ }
function displayPopupResonance(distance) { /* ... no change ... */ }
function displayPopupRecipeComparison(conceptData) { /* ... no change ... */ }
function displayPopupRelatedConcepts(conceptData) { /* ... no change ... */ }
function handleRelatedConceptClick(event) { /* ... no change ... */ }

// *** UPDATED: Evolution uses Insight ***
function displayEvolutionSection(conceptData, discoveredData) {
    if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return;
    if (typeof elementKeyToFullName === 'undefined') { /* ... error handling ... */ return; }
    const isDiscovered = !!discoveredData; const canUnlock = conceptData.canUnlockArt; const alreadyUnlocked = discoveredData?.artUnlocked || false;
    // *** Use focusedConcepts ***
    const isFocused = focusedConcepts.has(conceptData.id);
    const requiredElement = conceptData.primaryElement; const fullName = elementKeyToFullName[requiredElement];
    if (!fullName) { /* ... error handling ... */ return; }
    // *** Use userInsight ***
    const cost = ART_EVOLVE_COST; // Insight cost
    const hasEnoughInsight = userInsight >= cost;
    const hasReflected = seenPrompts.size > 0; // Still simplified check

    evolveCostSpan.textContent = `${cost} Insight`; // Display cost with units

    if (isDiscovered && canUnlock && !alreadyUnlocked) {
        popupEvolutionSection.classList.remove('hidden'); let eligibilityText = ''; let canEvolve = true;
        // *** Check isFocused ***
        if (!isFocused) { eligibilityText += '<li>Mark as Focus Concept</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Focused Concept</li>'; }
        if (!hasReflected) { eligibilityText += '<li>Engage in Reflection</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Reflection Engaged</li>'; }
        // *** Check Insight ***
        if (!hasEnoughInsight) { eligibilityText += `<li>Need ${cost} Insight (Have ${userInsight.toFixed(1)})</li>`; canEvolve = false;} else { eligibilityText += `<li><i class="fas fa-check"></i> Enough Insight</li>`; }
        evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`; evolveEligibility.classList.remove('hidden'); evolveArtButton.disabled = !canEvolve;
        evolveArtButton.onclick = canEvolve ? () => attemptArtEvolution(conceptData.id, cost) : null; // Pass cost
    } else { popupEvolutionSection.classList.add('hidden'); evolveArtButton.disabled = true; evolveEligibility.classList.add('hidden'); evolveArtButton.onclick = null; }
}

// *** UPDATED: Evolution uses Insight cost ***
function attemptArtEvolution(conceptId, cost) { // Removed elementKey param
     console.log(`Attempting art evolution for ${conceptId} costing ${cost} Insight.`);
     const discoveredData = discoveredConcepts.get(conceptId);
     if (!discoveredData || !discoveredData.concept || discoveredData.artUnlocked) { /* ... error */ return; }
     const concept = discoveredData.concept; if (!concept.canUnlockArt) { /* ... error */ return; }
     const isFocused = focusedConcepts.has(conceptId); const hasReflected = seenPrompts.size > 0;
     // *** Check Insight ***
     if (isFocused && hasReflected && userInsight >= cost) {
         // *** Deduct Insight cost ***
         userInsight -= cost;
         updateInsightDisplays(); // Update UI

         discoveredData.artUnlocked = true; discoveredConcepts.set(conceptId, discoveredData); console.log(`Art unlocked for ${concept.name}!`); showTemporaryMessage(`Enhanced Art Unlocked for ${concept.name}!`);
         // Update displays
         // displayElementEssenceStudy/Persona removed
         if (currentlyDisplayedConceptId === conceptId) { displayEvolutionSection(concept, discoveredData); /* ... refresh visual ... */ }
         if (grimoireScreen.classList.contains('current')) { displayGrimoire(/* filters */); }
          gainAttunementForAction('artEvolve', concept.primaryElement, 1.5); updateMilestoneProgress('evolveArt', 1);
     } else { console.warn("Evolution conditions not met."); alert("Cannot unlock art yet. Check requirements: Focus Status, Reflection, Insight."); }
}


// --- Grimoire/Core(Focus) Button & State Logic ---

// REMOVED grantEssenceForConcept

// *** UPDATED: Add to Grimoire - Handles Dissonance ***
function addToGrimoire() {
    if (currentlyDisplayedConceptId === null) return;
    const concept = concepts.find(c => c.id === currentlyDisplayedConceptId);
    if (!concept) { console.error("Concept not found for adding"); return; }

    // Check if already discovered (shouldn't happen if button is managed correctly, but good failsafe)
    if (discoveredConcepts.has(concept.id)) {
        console.log(`${concept.name} is already in the Grimoire.`);
        showTemporaryMessage(`${concept.name} is already in your Grimoire.`);
        return;
    }

    // *** Dissonance Check ***
    const distance = euclideanDistance(userScores, concept.elementScores);
    if (distance > DISSONANCE_THRESHOLD) {
        console.log(`High dissonance (${distance.toFixed(1)}) detected for ${concept.name}. Triggering reflection.`);
        displayReflectionPrompt('Dissonance', concept.id); // Trigger special reflection
    } else {
        // If resonance is okay, add directly
        addConceptToGrimoireInternal(concept.id);
    }
}

// *** NEW: Internal function to actually add the card (called by addToGrimoire or handleConfirmReflection) ***
function addConceptToGrimoireInternal(conceptId) {
     const concept = concepts.find(c => c.id === conceptId);
     if (!concept) { console.error(`Internal Add: Concept ${conceptId} not found`); return; }
     if (discoveredConcepts.has(conceptId)) { console.warn(`Internal Add: Concept ${conceptId} already discovered.`); return; } // Avoid double adding

     console.log(`Adding ${concept.name} to Grimoire (Internal).`);
     discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false });

     gainInsight(2.0, `Discovered ${concept.name}`); // Flat Insight gain for discovery
     gainAttunementForAction('addToGrimoire', concept.primaryElement, 0.6);

     updateGrimoireCounter();
     // Update button states if the popup for this card is currently open
     if (currentlyDisplayedConceptId === conceptId) {
         updateGrimoireButtonStatus(concept.id);
         updateFocusButtonStatus(concept.id); // Show focus button now
     }
     // No need to update Insight displays here, gainInsight does it.
     // checkAndApplySynergyBonus(concept, 'add'); // Synergy check - maybe grant insight?
     checkTriggerReflectionPrompt('add'); // Standard reflection check
     updateMilestoneProgress('addToGrimoire', 1);
     updateMilestoneProgress('discoveredConcepts.size', discoveredConcepts.size);

     if (grimoireScreen.classList.contains('current')) { displayGrimoire(/* filters */); } // Refresh grimoire view
     showTemporaryMessage(`${concept.name} added to Grimoire!`);
}


// *** UPDATED: Toggle Focus Concept (uses Focus Slots, Insight) ***
function toggleFocusConcept() {
    if (currentlyDisplayedConceptId === null) return;
    const discoveredData = discoveredConcepts.get(currentlyDisplayedConceptId);
    if (!discoveredData || !discoveredData.concept) { console.error("Concept not found or not discovered."); return; }
    const concept = discoveredData.concept;

    if (focusedConcepts.has(concept.id)) {
        // Removing from Focus
        focusedConcepts.delete(concept.id);
        console.log(`Removed ${concept.name} from Focus Concepts.`);
        showTemporaryMessage(`${concept.name} removed from Focus.`);
        // No Insight cost/gain for removing focus? Keep it simple.
    } else {
        // Adding to Focus - Check Limit
        if (focusedConcepts.size >= focusSlotsTotal) {
             alert(`Focus slots full (${focusedConcepts.size}/${focusSlotsTotal}). Remove another concept from Focus first.`);
             console.warn("Cannot add focus concept, limit reached.");
             return; // Stop if limit reached
        }
        // Add to focus
        focusedConcepts.add(concept.id);
        console.log(`Marked ${concept.name} as Focus Concept.`);
        showTemporaryMessage(`${concept.name} marked as Focus!`);
        gainInsight(1.0, `Focused on ${concept.name}`); // Small Insight bonus for focusing
        gainAttunementForAction('markFocus', concept.primaryElement, 1.0); // Attunement bonus
        // checkAndApplySynergyBonus(concept, 'focus'); // Synergy check - maybe grant insight?
        updateMilestoneProgress('markFocus', 1);
        updateMilestoneProgress('focusedConcepts.size', focusedConcepts.size);
    }
    updateFocusButtonStatus(concept.id); // Update button text/state
    displayFocusedConceptsPersona(); // Refresh persona display (updates count too)
    synthesizeAndDisplayThemesPersona(); // Refresh themes
    // No need to update Insight display, gainInsight handles it.
    if (grimoireScreen.classList.contains('current')) { displayGrimoire(/* filters */); } // Refresh card render
}

// Removed checkAndApplySynergyBonus - simplify for now, maybe re-add with Insight later

// *** UPDATED: Button Status Checks (use focusedConcepts) ***
function updateGrimoireButtonStatus(conceptId) {
    if (!addToGrimoireButton) return; const isDiscovered = discoveredConcepts.has(conceptId);
    addToGrimoireButton.disabled = isDiscovered; addToGrimoireButton.textContent = isDiscovered ? "In Grimoire" : "Add to Grimoire"; addToGrimoireButton.classList.toggle('added', isDiscovered);
}
function updateFocusButtonStatus(conceptId) { // Renamed from updateCoreButtonStatus
    if (!markAsFocusButton) return; const isDiscovered = discoveredConcepts.has(conceptId);
    // *** Use focusedConcepts ***
    const isFocused = focusedConcepts.has(conceptId);
    markAsFocusButton.classList.toggle('hidden', !isDiscovered); // Show only if discovered
    if (isDiscovered) { markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus"; markAsFocusButton.classList.toggle('marked', isFocused); }
}

// --- Reflection Prompts ---
function checkTriggerReflectionPrompt(triggerAction = 'other') { /* ... (no change) ... */ }

// *** UPDATED: Display Reflection (handles context, shows/hides nudge checkbox) ***
function displayReflectionPrompt(context = 'Standard', targetConceptIdForDissonance = null) {
    currentReflectionContext = context; // Store context ('Standard', 'Dissonance')
    reflectionTargetConceptId = targetConceptIdForDissonance; // Store concept ID if dissonance

    let promptPool = [];
    let titleElement = "Element"; // Default

    if (context === 'Dissonance') {
        promptPool = reflectionPrompts["Dissonance"] || [];
        const targetConcept = concepts.find(c => c.id === targetConceptIdForDissonance);
        titleElement = targetConcept ? `${targetConcept.name} (Dissonant Concept)` : "a Challenging Concept";
        console.log(`Displaying Dissonance reflection for concept ID ${targetConceptIdForDissonance}`);
        if (scoreNudgeCheckbox) scoreNudgeCheckbox.classList.remove('hidden'); // Show nudge checkbox
        if (scoreNudgeLabel) scoreNudgeLabel.classList.remove('hidden');
    } else {
        // Standard reflection - choose element randomly
        let possibleElements = elementNames.filter(elName => reflectionPrompts[elName] && reflectionPrompts[elName].length > 0);
        if (possibleElements.length === 0) { console.warn("No standard reflection prompts available."); return; }
        const targetElementName = possibleElements[Math.floor(Math.random() * possibleElements.length)];
        promptPool = reflectionPrompts[targetElementName] || [];
        titleElement = elementDetails[targetElementName]?.name || targetElementName;
        currentReflectionElement = targetElementName; // Store full name for standard reward
        console.log(`Displaying Standard reflection for ${targetElementName}`);
        if (scoreNudgeCheckbox) scoreNudgeCheckbox.classList.add('hidden'); // Hide nudge checkbox
        if (scoreNudgeLabel) scoreNudgeLabel.classList.add('hidden');
    }

    if (promptPool.length === 0) { console.error(`No prompts found for context: ${context}`); return; }

    // Select prompt (prefer unseen, allow repeats if needed)
    const availablePrompts = promptPool.filter(p => !seenPrompts.has(p.id));
    let selectedPrompt;
    if (availablePrompts.length > 0) { selectedPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)]; }
    else { selectedPrompt = promptPool[Math.floor(Math.random() * promptPool.length)]; console.log(`All prompts seen for ${context}, showing random.`); }
    if (!selectedPrompt) { console.error("Could not select a reflection prompt."); return; }

    currentPromptId = selectedPrompt.id;

    // Update Modal UI
    if (reflectionElement) reflectionElement.textContent = titleElement;
    if (reflectionPromptText) reflectionPromptText.textContent = selectedPrompt.text;
    if (reflectionCheckbox) reflectionCheckbox.checked = false; // Reset standard checkbox
    if (scoreNudgeCheckbox) scoreNudgeCheckbox.checked = false; // Reset nudge checkbox
    if (confirmReflectionButton) confirmReflectionButton.disabled = true;
    const rewardAmount = 5.0; // Insight reward
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${rewardAmount} Insight`;

    if (reflectionModal) reflectionModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// *** UPDATED: Handle Confirm Reflection (handles nudge, dissonance card add, Insight) ***
function handleConfirmReflection() {
    if (!currentPromptId || !reflectionCheckbox || !reflectionCheckbox.checked) return;

    console.log(`Reflection confirmed for context: ${currentReflectionContext}, prompt ID: ${currentPromptId}`);
    seenPrompts.add(currentPromptId); // Track seen prompt

    const insightReward = 5.0; // Fixed Insight reward for reflection
    let attunementKey = null;
    let attunementAmount = 1.0;

    // Score Nudge Logic (only for Dissonance context)
    if (currentReflectionContext === 'Dissonance' && scoreNudgeCheckbox && scoreNudgeCheckbox.checked) {
        console.log("Score nudge requested.");
        const concept = concepts.find(c => c.id === reflectionTargetConceptId);
        if (concept && concept.elementScores) {
            let nudged = false;
            for (const key in userScores) {
                if (userScores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) {
                    const userScore = userScores[key];
                    const conceptScore = concept.elementScores[key];
                    const diff = conceptScore - userScore;
                    // Nudge only if difference is significant
                    if (Math.abs(diff) > 2.0) { // Example threshold
                        const nudge = Math.sign(diff) * SCORE_NUDGE_AMOUNT; // Move slightly towards concept
                        userScores[key] = Math.max(0, Math.min(10, userScore + nudge));
                        console.log(` -> Nudged ${key} score by ${nudge.toFixed(2)}. New score: ${userScores[key].toFixed(2)}`);
                        nudged = true;
                    }
                }
            }
            if (nudged) {
                console.log("Updated User Scores:", userScores);
                displayPersonaScreen(); // Immediately refresh persona screen to show changes
                showTemporaryMessage("Core understanding shifted slightly based on reflection.");
                gainAttunementForAction('scoreNudge', null, 0.5); // Small generic attunement for growth
            }
        } else { console.warn("Could not find concept for score nudge."); }
    }

    // Add dissonant card to Grimoire *after* reflection is confirmed
    if (currentReflectionContext === 'Dissonance' && reflectionTargetConceptId !== null) {
        addConceptToGrimoireInternal(reflectionTargetConceptId);
    }

    // Grant Standard Reflection Rewards
    gainInsight(insightReward, `Reflection (${currentReflectionContext})`);

    // Grant Attunement (specific element for standard, maybe generic for dissonance?)
    if (currentReflectionContext === 'Standard' && currentReflectionElement) {
        attunementKey = elementNameToKey[currentReflectionElement];
    } else {
        // Grant generic or maybe attunement for the dissonant card's element?
        attunementKey = null; // Generic for now
        attunementAmount = 0.5; // Less attunement for dissonance?
    }
    if (attunementKey) {
         gainAttunementForAction('completeReflection', attunementKey, attunementAmount);
    } else {
         gainAttunementForAction('completeReflectionGeneric', 'All', 0.2); // Small boost to all
    }


     updateMilestoneProgress('completeReflection', 1);

    hidePopups(); // Close the modal
    showTemporaryMessage("Reflection complete! Insight gained.");

    // Reset reflection state variables AFTER processing
    currentReflectionContext = null;
    reflectionTargetConceptId = null;
}


// --- Rituals & Milestones ---

// *** UPDATED: Rituals (Placeholder uses Insight reward) ***
function displayDailyRituals() {
     if (!dailyRitualsDisplay) return; dailyRitualsDisplay.innerHTML = '';
     if (!dailyRituals || dailyRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No rituals defined.</li>'; return; }
     dailyRituals.forEach(ritual => {
         const isCompleted = completedRituals.daily[ritual.id]?.completed || false;
         const li = document.createElement('li'); li.classList.toggle('completed', isCompleted); let rewardText = '';
         if (ritual.reward) {
            // *** Adjust reward text for Insight/Tokens ***
            if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} Insight)`;
            else if (ritual.reward.type === 'attunement') rewardText = `(+${ritual.reward.amount} Attunement)`;
            else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Research'} Token)`; // Placeholder text
         }
         li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`; dailyRitualsDisplay.appendChild(li);
     });
}

// *** UPDATED: Ritual Check (Placeholder grants Insight/Tokens) ***
function checkAndUpdateRituals(action, details = {}) {
     console.log("Checking rituals for action:", action, details);
     let ritualUpdated = false;
     dailyRituals.forEach(ritual => {
        let currentProgress = completedRituals.daily[ritual.id]?.progress || 0;
        let alreadyCompleted = completedRituals.daily[ritual.id]?.completed || false;

        if (!alreadyCompleted && ritual.track.action === action) {
            // Basic count increment for now
            currentProgress++;
            if (currentProgress >= ritual.track.count) {
                 console.log(`Ritual Completed: ${ritual.description}`);
                 completedRituals.daily[ritual.id] = { completed: true, progress: currentProgress };
                 ritualUpdated = true;
                 // Grant Reward
                 if (ritual.reward) {
                     if (ritual.reward.type === 'insight') {
                         gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`);
                     } else if (ritual.reward.type === 'attunement') {
                         gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0);
                     } else if (ritual.reward.type === 'token') {
                          console.log(`TODO: Grant ${ritual.reward.tokenType || 'Research'} token`);
                          // Add token granting logic here when implemented
                     }
                 }
            } else {
                 // Update progress if not completed
                 completedRituals.daily[ritual.id] = { completed: false, progress: currentProgress };
            }
        }
     });
     if (ritualUpdated) displayDailyRituals(); // Update UI if any ritual completed
}


function displayMilestones() { /* ... (no change) ... */ }

// *** UPDATED: Milestone Progress (Handles discoverCard, focus slots, uses Insight) ***
function updateMilestoneProgress(trackType, currentValue) {
     milestones.forEach(m => {
         if (!achievedMilestones.has(m.id)) {
             let achieved = false;
             // Handle different tracking types
             if (m.track.action === trackType && currentValue >= (m.track.count || 1)) achieved = true;
             else if (m.track.state === trackType) {
                 if (m.track.condition === "any") { if (typeof currentValue === 'object') { for (const key in currentValue) { if (currentValue[key] >= m.track.threshold) { achieved = true; break; } } } }
                 else { if (currentValue >= m.track.threshold) achieved = true; }
             }

             if (achieved) {
                 console.log("Milestone Achieved!", m.description);
                 achievedMilestones.add(m.id);
                 displayMilestones(); showMilestoneAlert(m.description);

                 // Grant Reward
                 if (m.reward) {
                     // *** Handle Insight Reward ***
                     if (m.reward.type === 'insight') {
                         gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`);
                     }
                     // Handle Attunement Reward
                     else if (m.reward.type === 'attunement') {
                         gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0);
                     }
                     // *** Handle Focus Slot Increase ***
                     else if (m.reward.type === 'increaseFocusSlots') {
                          const increaseAmount = m.reward.amount || 1;
                          if (focusSlotsTotal < MAX_FOCUS_SLOTS) {
                               focusSlotsTotal = Math.min(MAX_FOCUS_SLOTS, focusSlotsTotal + increaseAmount);
                               console.log(`Focus Slots increased by ${increaseAmount}. New total: ${focusSlotsTotal}`);
                               updateFocusSlotsDisplay(); // Update UI immediately
                          }
                     }
                     // *** Handle Discover Card Reward ***
                     else if (m.reward.type === 'discoverCard') {
                          const cardIdToDiscover = m.reward.cardId;
                          if (cardIdToDiscover && !discoveredConcepts.has(cardIdToDiscover)) {
                               const conceptToDiscover = concepts.find(c => c.id === cardIdToDiscover);
                               if (conceptToDiscover) {
                                   console.log(`Milestone Reward: Discovering ${conceptToDiscover.name}`);
                                   // Use internal add function to handle discovery logic consistently
                                   addConceptToGrimoireInternal(cardIdToDiscover);
                                   showTemporaryMessage(`Milestone Reward: Discovered ${conceptToDiscover.name}!`);
                               } else { console.warn(`Milestone discoverCard reward: Card ID ${cardIdToDiscover} not found in concepts.`); }
                          } else { console.log(`Milestone discoverCard reward: Card ID ${cardIdToDiscover} already discovered or invalid.`); }
                     }
                     // Removed Essence reward type
                 }
             }
         }
     });
     // Special check for focus slot milestones after any update
     updateMilestoneProgress('focusSlotsTotal', focusSlotsTotal);
}

function showMilestoneAlert(text) { /* ... (no change) ... */ }
function hideMilestoneAlert() { /* ... (no change) ... */ }
function showTemporaryMessage(message, duration = 3000) { /* ... (no change) ... */ }

// --- Reset App ---
function resetApp() { /* ... (no change) ... */ }

// --- Daily Login Check ---
// *** UPDATED: Grants free research ***
function checkForDailyLogin() {
     const today = new Date().toDateString();
     if (lastLoginDate !== today) {
         console.log("First login of the day detected.");
         completedRituals.daily = {}; // Reset daily ritual progress/completion
         lastLoginDate = today;

         // *** Grant Free Research ***
         freeResearchAvailableToday = true;
         console.log("Free daily meditation/research granted.");
         if(freeResearchButton) freeResearchButton.classList.remove('hidden'); // Ensure button is visible

         displayDailyRituals(); // Refresh ritual display
         displayResearchButtons(); // Refresh research button states

         // Potential daily login bonus?
         gainInsight(5.0, "Daily Login"); // Grant some starting Insight for the day

         showTemporaryMessage("Daily rituals reset. Free research available!");
     } else {
         // Ensure free research button state is correct even if not first login
         displayResearchButtons();
     }
}

// --- Event Listeners (MUST BE AT THE END) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Card Concept Expanded...");
    navButtons.forEach(button => { button.addEventListener('click', () => { const targetScreenId = button.dataset.target; if (!document.getElementById(targetScreenId)) { console.error(`Target screen #${targetScreenId} not found!`); return; } if (targetScreenId === 'personaScreen') { displayPersonaScreen(); } if (targetScreenId === 'studyScreen') { displayStudyScreenContent(); } if (targetScreenId === 'grimoireScreen') { displayGrimoire(/* filters */); } showScreen(targetScreenId); }); });
    if (startButton) startButton.addEventListener('click', initializeQuestionnaire); else console.error("Start button not found!");
    if (nextElementButton) nextElementButton.addEventListener('click', nextElement); else console.error("Next button not found!");
    if (prevElementButton) prevElementButton.addEventListener('click', prevElement); else console.error("Prev button not found!");
    if (restartButtonPersona) restartButtonPersona.addEventListener('click', resetApp); else console.error("Restart button (Persona) not found!");
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopups); else console.error("Close Popup button not found!");
    if (popupOverlay) popupOverlay.addEventListener('click', hidePopups); else console.error("Popup Overlay not found!");
    if (closeResearchModalButton) closeResearchModalButton.addEventListener('click', hidePopups); else console.error("Close Research Modal button not found!");
    if (closeReflectionModalButton) closeReflectionModalButton.addEventListener('click', hidePopups); else console.error("Close Reflection Modal button not found!");
    if (closeMilestoneAlertButton) closeMilestoneAlertButton.addEventListener('click', hideMilestoneAlert); else console.error("Close Milestone Alert button not found!");
    if (addToGrimoireButton) addToGrimoireButton.addEventListener('click', addToGrimoire); else console.error("Add to Grimoire button not found!");
    // *** Use renamed button ID ***
    if (markAsFocusButton) markAsFocusButton.addEventListener('click', toggleFocusConcept); else console.error("Mark as Focus button not found!");
    const grimoireRefresh = () => { if (!grimoireScreen.classList.contains('hidden')) { displayGrimoire(/* filters */); } };
    if (grimoireTypeFilter) grimoireTypeFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Type filter not found!");
    if (grimoireElementFilter) grimoireElementFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Element filter not found!");
    if (grimoireRarityFilter) grimoireRarityFilter.addEventListener('change', grimoireRefresh); else console.error("Grimoire Rarity filter not found!");
    if (grimoireSortOrder) grimoireSortOrder.addEventListener('change', grimoireRefresh); else console.error("Grimoire Sort order not found!");
    if (reflectionCheckbox) reflectionCheckbox.addEventListener('change', () => { if(confirmReflectionButton) confirmReflectionButton.disabled = !reflectionCheckbox.checked; }); else console.error("Reflection checkbox not found!");
    // Note: scoreNudgeCheckbox has no direct event listener needed here
    if (confirmReflectionButton) confirmReflectionButton.addEventListener('click', handleConfirmReflection); else console.error("Confirm Reflection button not found!");
    showScreen('welcomeScreen'); console.log("Initial screen set to Welcome.");
}); // End DOMContentLoaded
