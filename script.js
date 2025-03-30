// script.js - Expanded Version

// --- Global State ---
let currentElementIndex = 0;
let userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; // Use single letter keys
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"];
let currentElementAnswers = {};
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // ID -> { concept, discoveredTime, artUnlocked: boolean }
let coreConcepts = new Set();
// Use full names as keys for easier lookup from UI events/data
let elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
let elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
const MAX_ATTUNEMENT = 100; // Example max level
const RESEARCH_COST = 5;
const ART_EVOLVE_COST = 5; // Example cost

// --- Persistent State Tracking (Requires Saving/Loading, e.g., to LocalStorage - not implemented here) ---
let seenPrompts = new Set();
let completedRituals = { daily: {}, weekly: {} }; // Store completed ritual IDs for the period
let achievedMilestones = new Set();
let lastLoginDate = null; // Store YYYY-MM-DD

// --- DOM Elements ---
// (Ensure all const declarations from previous script version are here)
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startGuidedButton');
// ... (all other const declarations) ...
const elementAttunementDisplay = document.getElementById('elementAttunementDisplay');
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay');
const milestonesDisplay = document.getElementById('milestonesDisplay');
const grimoireRarityFilter = document.getElementById('grimoireRarityFilter'); // New filter
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
// getScoreLabel, getAffinityLevel, getElementColor, hexToRgba,
// getCardTypeIcon, getElementIcon, elementNameToKey, elementKeyToFullName
// ... (Keep these functions as defined in the previous correct script) ...

// *** Corrected euclideanDistance function ***
function euclideanDistance(userScoresObj, conceptScoresObj) {
    // ... (Keep the version from the previous fix that uses keys A, I, S...) ...
     let sumOfSquares = 0; let validDimensions = 0; let issueFound = false; if (!userScoresObj || typeof userScoresObj !== 'object') { console.error("Invalid user scores:", userScoresObj); return Infinity; } if (!conceptScoresObj || typeof conceptScoresObj !== 'object') { return Infinity; } const expectedDimensions = Object.keys(userScoresObj).length; for (const key of Object.keys(userScoresObj)) { const s1 = userScoresObj[key]; const s2 = conceptScoresObj[key]; const s1Valid = typeof s1 === 'number' && !isNaN(s1); const s2Valid = typeof s2 === 'number' && !isNaN(s2); if (s1Valid && s2Valid) { sumOfSquares += Math.pow(s1 - s2, 2); validDimensions++; } else { if (!s2Valid) { console.warn(`Invalid CONCEPT score for element key ${key}. Concept Score: ${s2}. Concept ID: ${conceptScoresObj.id || '(unknown)'} Concept Scores:`, conceptScoresObj); } issueFound = true; return Infinity; } } if (validDimensions !== expectedDimensions) { console.warn(`Dimension mismatch (${validDimensions}/${expectedDimensions})`, userScoresObj, conceptScoresObj); issueFound = true; } return (validDimensions === expectedDimensions && !issueFound) ? Math.sqrt(sumOfSquares) : Infinity;
}

// --- Screen Management ---
function showScreen(screenId) { /* ... (same as before) ... */ }
function hidePopups() { /* ... (same, ensures all modals hide) ... */ }

// --- Initialization and Questionnaire Logic ---
function initializeQuestionnaire() { /* ... (same as before, resets new state too) ... */
    currentElementIndex = 0; userScores = { A: 5, I: 5, S: 5, P: 5, C: 5, R: 5 }; userAnswers = {}; elementNames.forEach(elName => { userAnswers[elName] = {}; }); discoveredConcepts = new Map(); coreConcepts = new Set(); elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; seenPrompts = new Set(); completedRituals = { daily: {}, weekly: {} }; achievedMilestones = new Set(); lastLoginDate = null; // TODO: Load from storage later
    updateElementProgressHeader(-1); displayElementQuestions(currentElementIndex); showScreen('questionnaireScreen'); if(mainNavBar) mainNavBar.classList.add('hidden');
    // Clear persistent displays
    if(dailyRitualsDisplay) dailyRitualsDisplay.innerHTML = '<li>Loading...</li>';
    if(milestonesDisplay) milestonesDisplay.innerHTML = '<li>None yet</li>';
    if(elementAttunementDisplay) elementAttunementDisplay.innerHTML = '';
}

// updateElementProgressHeader, displayElementQuestions, handleQuestionnaireInputChange,
// enforceMaxChoices, collectCurrentElementAnswers, updateDynamicFeedback,
// calculateElementScore, nextElement, prevElement
// --- (Keep these questionnaire functions same as previous version) ---

function finalizeScoresAndShowPersona() { /* ... (same as before, calls new functions) ... */
     console.log("Finalizing scores..."); const finalScores = {}; elementNames.forEach(elementName => { const score = calculateElementScore(elementName, userAnswers[elementName] || {}); const key = elementNameToKey[elementName]; if (key) { finalScores[key] = score; } }); userScores = finalScores; console.log("Final User Scores:", userScores);
     determineStarterHandAndEssence();
     updateMilestoneProgress('completeQuestionnaire', 1); // Track completion
     displayPersonaScreen(); // Includes Attunement display now
     displayElementEssenceStudy();
     displayDailyRituals(); // Display initial rituals
     displayMilestones(); // Display initial milestones
     populateGrimoireFilters(); // Includes rarity now
     updateGrimoireCounter();
     checkForDailyLogin(); // Check for login bonus/prompt
     showScreen('personaScreen');
     setTimeout(() => { alert("Experiment Complete! Your initial profile is ready. You've received a Starter Hand of concepts, Essence, and your first Daily Rituals. Explore!"); }, 100);
}

// --- Starter Hand & Initial Essence ---
function determineStarterHandAndEssence() { /* ... (same logic as before) ... */
    console.log("Determining starter hand..."); discoveredConcepts = new Map(); elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; let conceptsWithDistance = concepts.map(c => ({ ...c, distance: euclideanDistance(userScores, c.elementScores || {}) })).filter(c => c.distance !== Infinity); if (conceptsWithDistance.length === 0) { console.error("No concepts comparable for starter hand!"); return; } conceptsWithDistance.sort((a, b) => a.distance - b.distance); console.log("Concepts sorted by distance:", conceptsWithDistance.slice(0,15).map(c => `${c.name} (Dist: ${c.distance.toFixed(2)})`)); const candidates = conceptsWithDistance.slice(0, 15); const starterHand = []; const representedElements = new Set(); const starterHandIds = new Set(); for (const candidate of candidates) { if (starterHand.length >= 4) break; if (!starterHandIds.has(candidate.id)) { starterHand.push(candidate); starterHandIds.add(candidate.id); if (candidate.primaryElement) representedElements.add(candidate.primaryElement); } } for (const candidate of candidates) { if (starterHand.length >= 7) break; if (starterHandIds.has(candidate.id)) continue; if (!representedElements.has(candidate.primaryElement) || candidates.slice(candidates.indexOf(candidate)).every(rem => representedElements.has(rem.primaryElement) || starterHand.length >= 7)) { starterHand.push(candidate); starterHandIds.add(candidate.id); if (candidate.primaryElement) representedElements.add(candidate.primaryElement); } } for (const candidate of candidates) { if (starterHand.length >= 7) break; if (!starterHandIds.has(candidate.id)) { starterHand.push(candidate); starterHandIds.add(candidate.id); } } console.log("Starter Hand Selected:", starterHand.map(c => c.name)); starterHand.forEach(concept => { discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now(), artUnlocked: false }); // Add artUnlocked flag
    grantEssenceForConcept(concept, 0.5); gainAttunementForAction('discover', concept.primaryElement); }); console.log("Initial Essence Granted:", elementEssence);
}

// --- Attunement ---
function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) {
    const gainAmount = amount; // Base amount
    let targetElements = [];

    if (elementKey && elementKeyToFullName[elementKey]) {
        targetElements.push(elementKeyToFullName[elementKey]);
    } else if (actionType === 'completeReflection' && currentReflectionElement) { // Assumes currentReflectionElement is set globally/passed
        targetElements.push(currentReflectionElement);
    } else if (actionType === 'generic' || elementKey === 'All') {
         targetElements = elementNames; // Gain for all elements
         amount = 0.1; // Smaller gain for generic actions
    } else {
        // Gain for a random element? Or no gain?
        // For now, let's skip if no specific element targeted
        return;
    }

    targetElements.forEach(elName => {
        elementAttunement[elName] = Math.min(MAX_ATTUNEMENT, (elementAttunement[elName] || 0) + gainAmount);
    });

    console.log(`Attunement updated (${actionType}):`, elementAttunement);
    displayElementAttunement(); // Update UI if visible
}

function displayElementAttunement() {
    if (!elementAttunementDisplay) return;
    elementAttunementDisplay.innerHTML = '';
    elementNames.forEach(elName => {
        const attunementValue = elementAttunement[elName] || 0;
        const percentage = (attunementValue / MAX_ATTUNEMENT) * 100;
        elementAttunementDisplay.innerHTML += `
            <div class="attunement-item">
                <span class="attunement-name">${elementDetails[elName]?.name || elName}:</span>
                <div class="attunement-bar-container" title="${attunementValue.toFixed(1)} / ${MAX_ATTUNEMENT}">
                    <div class="attunement-bar" style="width: ${percentage}%; background-color: ${getElementColor(elName)};"></div>
                </div>
                <!-- <span class="attunement-level">Lv ?</span> Optional level display -->
            </div>`;
    });
}

// --- Persona Screen Functions ---
function displayPersonaScreen() { /* ... (Calls displayElementAttunement) ... */
    if (!personaElementDetailsDiv) { console.error("Persona details div not found!"); return; }
    personaElementDetailsDiv.innerHTML = ''; elementNames.forEach(elementName => { const key = elementNameToKey[elementName]; const score = userScores[key]; const scoreLabel = getScoreLabel(score); const elementData = elementDetails[elementName] || {}; const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation unavailable."; const barWidth = score * 10; const details = document.createElement('details'); details.classList.add('element-detail-entry'); details.innerHTML = `<summary class="element-detail-header"><div><strong>${elementData.name || elementName}:</strong><span>${score.toFixed(1)}</span> <span class="score-label">(${scoreLabel})</span></div><div class="score-bar-container"><div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(elementName)}; border-radius: 3px;"></div></div></summary><div class="element-description"><p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p><p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p><hr style="border-top: 1px dashed #c8b89a; margin: 8px 0;"><p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p><p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p></div>`; personaElementDetailsDiv.appendChild(details); });
    displayElementEssencePersona();
    displayElementAttunement(); // Display attunement bars
    displayCoreConceptsPersona();
    synthesizeAndDisplayThemesPersona();
    displayMilestones(); // Also show milestones here
}

// displayElementEssencePersona, displayCoreConceptsPersona, synthesizeAndDisplayThemesPersona
// --- (Keep these as defined in the previous script) ---

// --- Study Screen Functions ---
function displayElementEssenceStudy() { /* ... (same as before) ... */ }
function handleResearchClick(event) { /* ... (same as before) ... */ }

function conductResearch(elementNameToResearch) { // Expects full name
    console.log(`Researching Element: ${elementNameToResearch}`);
    if (researchStatus) researchStatus.textContent = `Researching ${elementDetails[elementNameToResearch]?.name || elementNameToResearch}...`;
    if (researchModalContent) researchModalContent.innerHTML = '';

    const discoveredIds = new Set(discoveredConcepts.keys());
    const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));
    if (undiscoveredPool.length === 0) { /* ... (handle no concepts left) ... */ return; }

    const elementKeyToResearch = elementNameToKey[elementNameToResearch];
    const currentAttunement = elementAttunement[elementNameToResearch] || 0;

    // Categorize pools (same logic)
    const priorityPool = [], secondaryPool = [], tertiaryPool = [...undiscoveredPool];
    // ... (same pool categorization logic as before using elementKeyToResearch) ...
     undiscoveredPool.forEach(c => { const score = c.elementScores?.[elementKeyToResearch] || 0; const primary = c.primaryElement === elementKeyToResearch; const index = tertiaryPool.findIndex(tc => tc.id === c.id); if (primary || score >= 8.0) { priorityPool.push(c); if (index > -1) tertiaryPool.splice(index, 1); } else if (score >= 5.0) { secondaryPool.push(c); if (index > -1) tertiaryPool.splice(index, 1); } });

    const selectedForOutput = [];

    // --- Weighted Random Selection Function ---
    const selectWeightedRandomFromPool = (pool) => {
        if (pool.length === 0) return null;

        // Assign weights based on rarity and attunement
        let totalWeight = 0;
        const weightedPool = pool.map(card => {
            let weight = 1.0; // Base weight
            // Rarity bonus (higher attunement makes rares slightly more likely)
            const rarityBonus = Math.max(1, (currentAttunement / MAX_ATTUNEMENT) * 2); // Scale bonus 1x to 2x
            if (card.rarity === 'uncommon') weight *= (1.5 * rarityBonus); // Uncommon slightly boosted
            if (card.rarity === 'rare') weight *= (2.0 * rarityBonus); // Rare boosted more
            // Optional: Add resonance boost? (closer distance = higher weight)
            // const distance = euclideanDistance(userScores, card.elementScores);
            // if(distance !== Infinity) weight *= Math.max(0.1, 30 - distance) / 15; // Scale inverse distance

            totalWeight += weight;
            return { card, weight };
        });

        // Select based on weight
        let randomPick = Math.random() * totalWeight;
        let chosenCard = null;
        for (let i = 0; i < weightedPool.length; i++) {
            const item = weightedPool[i];
            if (randomPick < item.weight) {
                chosenCard = item.card;
                // Remove the chosen card from the original pool array to prevent re-selection
                const originalIndex = pool.findIndex(c => c.id === chosenCard.id);
                if (originalIndex > -1) pool.splice(originalIndex, 1);
                break;
            }
            randomPick -= item.weight;
        }
        // Fallback if weighting logic fails somehow
        if (!chosenCard && pool.length > 0) {
             console.warn("Weighted selection fallback triggered.");
             const fallbackIndex = Math.floor(Math.random() * pool.length);
             chosenCard = pool[fallbackIndex];
             pool.splice(fallbackIndex, 1);
        }
        return chosenCard;
    };

    // Select up to 3 cards using weighted random selection
    for (let i = 0; i < 3; i++) {
        let selectedCard = selectWeightedRandomFromPool(priorityPool) ||
                           selectWeightedRandomFromPool(secondaryPool) ||
                           selectWeightedRandomFromPool(tertiaryPool);
        if (selectedCard) selectedForOutput.push(selectedCard);
        else break;
    }

     // Update UI (same presentation logic)
     // ... (show researchModal, populate status/content, update researchStatus) ...
     if (selectedForOutput.length > 0) { /* ... */ } else { /* ... */ }
     if (researchModal) researchModal.classList.remove('hidden');
     if (popupOverlay) popupOverlay.classList.remove('hidden');
}


// --- Grimoire Functions ---
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") { // Added rarity filter
    if (!grimoireContentDiv) return;
    grimoireContentDiv.innerHTML = '';
    if (discoveredConcepts.size === 0) { /* ... */ return; }

    let discoveredArray = Array.from(discoveredConcepts.values());
    const conceptsToDisplay = discoveredArray.filter(data => {
        const typeMatch = (filterType === "All") || (data.concept.cardType === filterType);
        const primaryElFullName = elementKeyToFullName[data.concept.primaryElement];
        const elementMatch = (filterElement === "All") || (primaryElFullName === filterElement);
        const rarityMatch = (filterRarity === "All") || (data.concept.rarity === filterRarity); // Filter by rarity
        return typeMatch && elementMatch && rarityMatch;
    });

    // Add rarity sort option
    if (sortBy === 'name') conceptsToDisplay.sort((a, b) => a.concept.name.localeCompare(b.concept.name));
    else if (sortBy === 'type') conceptsToDisplay.sort((a, b) => a.concept.cardType.localeCompare(b.concept.cardType) || a.concept.name.localeCompare(b.concept.name));
    else if (sortBy === 'rarity') {
         const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
         conceptsToDisplay.sort((a, b) => (rarityOrder[a.concept.rarity] || 0) - (rarityOrder[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name));
    }
    else conceptsToDisplay.sort((a,b) => a.discoveredTime - b.discoveredTime);

    if (conceptsToDisplay.length === 0) { /* ... */ }
    else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); grimoireContentDiv.appendChild(cardElement); }); }
    showScreen('grimoireScreen');
}

function populateGrimoireFilters() { /* ... (Add rarity filter population if needed, or keep manual options) ... */ }
function updateGrimoireCounter() { /* ... (same as before) ... */ }

// --- Card Rendering Function ---
function renderCard(concept, context = 'grimoire') {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`); // Add rarity class
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `Click to view details for ${concept.name}`;

    const discoveredData = discoveredConcepts.get(concept.id);
    const isDiscovered = !!discoveredData;
    const isCore = coreConcepts.has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false; // Get art unlock status

    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    const coreStampHTML = isCore ? '<span class="core-indicator" title="Core Concept">★</span>' : '';
    const cardTypeIcon = getCardTypeIcon(concept.cardType);

    let affinitiesHTML = '';
    if (concept.elementScores) { /* ... (same affinity rendering logic) ... */ }

    // Determine visual handle (base or unlocked)
    const currentVisualHandle = artUnlocked ? (concept.visualHandleUnlocked || concept.visualHandle) : concept.visualHandle;
    // Use placeholder for now, ideally replace class based on handle
    const visualClass = artUnlocked ? "fas fa-star card-art-unlocked" : "fas fa-question card-visual-placeholder";

    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${coreStampHTML}${grimoireStampHTML}</span>
        </div>
        <div class="card-visual">
            <i class="${visualClass}" title="${currentVisualHandle}"></i> {/* Use current handle */}
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888;">Low Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
        </div>
    `;

    if (context !== 'no-click') {
         cardDiv.addEventListener('click', () => showConceptDetailPopup(concept.id));
    }
    return cardDiv;
}


// --- Concept Detail Pop-up Logic ---
function showConceptDetailPopup(conceptId) { /* ... (Needs update for Evolution section) ... */
     currentlyDisplayedConceptId = conceptId; const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData || !conceptData.elementScores) { /*...*/ hidePopups(); return; }
     // ... (Populate header, visual, description, resonance, recipe, related - same as before) ...
     if(popupCardTypeIcon) popupCardTypeIcon.className = `${getCardTypeIcon(conceptData.cardType)} card-type-icon`; if(popupConceptName) popupConceptName.textContent = conceptData.name; if(popupConceptType) popupConceptType.textContent = conceptData.cardType;
     const discoveredData = discoveredConcepts.get(conceptId);
     const artUnlocked = discoveredData?.artUnlocked || false;
     const currentVisualHandle = artUnlocked ? (conceptData.visualHandleUnlocked || conceptData.visualHandle) : conceptData.visualHandle;
     if(popupCardVisual) popupCardVisual.className = `fas ${artUnlocked ? 'fa-star card-art-unlocked' : 'fa-question card-visual-placeholder'}`; // Update visual based on state
     if(popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No detailed description."; if(popupComparisonHighlights) popupComparisonHighlights.innerHTML = ''; if(popupConceptProfile) popupConceptProfile.innerHTML = ''; if(popupUserComparisonProfile) popupUserComparisonProfile.innerHTML = ''; if(popupRelatedConceptsList) popupRelatedConceptsList.innerHTML = ''; const distance = euclideanDistance(userScores, conceptData.elementScores); displayPopupResonance(distance); displayPopupRecipeComparison(conceptData); displayPopupRelatedConcepts(conceptData);

     // --- Handle Evolution Section ---
     displayEvolutionSection(conceptData, discoveredData);

     updateGrimoireButtonStatus(conceptId); updateCoreButtonStatus(conceptId);
     if (popupOverlay) popupOverlay.classList.remove('hidden'); if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
}

// displayPopupResonance, displayPopupRecipeComparison, displayPopupRelatedConcepts, handleRelatedConceptClick
// --- (Keep these functions same as previous version) ---

function displayEvolutionSection(conceptData, discoveredData) {
    if (!popupEvolutionSection || !evolveArtButton || !evolveCostSpan || !evolveEligibility) return;

    const artUnlocked = discoveredData?.artUnlocked || false;
    const canEvolveArt = conceptData.canUnlockArt === true;

    if (canEvolveArt && !artUnlocked) {
        popupEvolutionSection.classList.remove('hidden');
        const primaryElementKey = conceptData.primaryElement;
        const primaryElementName = elementKeyToFullName[primaryElementKey];
        const requiredEssence = ART_EVOLVE_COST;
        const currentEssence = elementEssence[primaryElementName] || 0;
        const hasEnoughEssence = currentEssence >= requiredEssence;
        const isCore = coreConcepts.has(conceptData.id);
        // Check reflection condition - simplified: just check if *any* prompt for the primary element was seen
        const hasReflected = [...seenPrompts].some(promptId => promptId.startsWith('p' + primaryElementKey)); // e.g., pA1, pA2...

        evolveCostSpan.textContent = `${requiredEssence} ${primaryElementName} Essence`;
        evolveArtButton.disabled = !(isCore && hasReflected && hasEnoughEssence);

        let eligibilityText = [];
        if (!isCore) eligibilityText.push("Mark as Core");
        if (!hasReflected) eligibilityText.push(`Reflect on ${primaryElementName}`);
        if (!hasEnoughEssence) eligibilityText.push("Collect more Essence");

        if (eligibilityText.length > 0) {
            evolveEligibility.textContent = `Requires: ${eligibilityText.join(', ')}`;
            evolveEligibility.classList.remove('hidden');
        } else {
            evolveEligibility.classList.add('hidden');
        }

        // Add listener if not already added (simple way)
        evolveArtButton.onclick = () => attemptArtEvolution(conceptData.id, primaryElementName, requiredEssence);

    } else {
        popupEvolutionSection.classList.add('hidden'); // Hide section if cannot evolve or already evolved
    }
}

function attemptArtEvolution(conceptId, essenceElement, cost) {
    if (elementEssence[essenceElement] >= cost) {
        // Deduct cost
        elementEssence[essenceElement] -= cost;
        // Update state in discoveredConcepts Map
        const currentData = discoveredConcepts.get(conceptId);
        if (currentData) {
            discoveredConcepts.set(conceptId, { ...currentData, artUnlocked: true });
            console.log(`Art unlocked for Concept ID: ${conceptId}`);
            // Update UI immediately
            displayElementEssenceStudy();
            displayElementEssencePersona();
            // Re-render popup section
             const conceptData = concepts.find(c => c.id === conceptId);
             const discoveredData = discoveredConcepts.get(conceptId);
            displayEvolutionSection(conceptData, discoveredData);
             // Update card visual in popup
             const currentVisualHandle = conceptData.visualHandleUnlocked || conceptData.visualHandle;
             if(popupCardVisual) popupCardVisual.className = `fas fa-star card-art-unlocked`; // Assume unlocked visual
             // Refresh Grimoire if visible
            if (grimoireScreen.classList.contains('current')) {
                displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value);
            }
             // Add Attunement?
             gainAttunementForAction('evolveArt', conceptData.primaryElement, 1.0); // Slightly more attunement
        } else {
            console.error("Cannot evolve art, concept not found in discovered map:", conceptId);
        }
    } else {
        alert(`Not enough ${essenceElement} Essence!`);
    }
}


// --- Grimoire/Core Button & State Logic ---
function grantEssenceForConcept(concept, multiplier = 1.0) { /* ... (same as before) ... */ }

function addToGrimoire() {
    if (currentlyDisplayedConceptId !== null && !discoveredConcepts.has(currentlyDisplayedConceptId)) {
        const concept = concepts.find(c => c.id === currentlyDisplayedConceptId);
        if (concept) {
            discoveredConcepts.set(currentlyDisplayedConceptId, { concept: concept, discoveredTime: Date.now(), artUnlocked: false }); // Init artUnlocked
            const gained = grantEssenceForConcept(concept, 1.0);
            const synergyBonus = checkAndApplySynergyBonus(concept, 'add'); // Check synergy
            gainAttunementForAction('addToGrimoire', concept.primaryElement); // Gain attunement
            updateMilestoneProgress('discoveredConcepts.size', discoveredConcepts.size); // Update milestone

            updateGrimoireCounter(); updateGrimoireButtonStatus(currentlyDisplayedConceptId); updateCoreButtonStatus(currentlyDisplayedConceptId);
            if(gained || synergyBonus > 0) { displayElementEssenceStudy(); displayElementEssencePersona(); }
            synthesizeAndDisplayThemesPersona();
            if (grimoireScreen.classList.contains('current')) { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); }
            checkTriggerReflectionPrompt('add'); // Check if prompt should trigger
            checkAndUpdateRituals('addToGrimoire', 1); // Update rituals
        }
    }
}

function toggleCoreConcept() {
     if (currentlyDisplayedConceptId === null || !discoveredConcepts.has(currentlyDisplayedConceptId)) return;
     let essenceMultiplier = 0; let action = '';
     if (coreConcepts.has(currentlyDisplayedConceptId)) { coreConcepts.delete(currentlyDisplayedConceptId); essenceMultiplier = -0.5; action = 'removeCore'; }
     else { if (coreConcepts.size >= 7) { alert("Max 7 Core Concepts."); return; } coreConcepts.add(currentlyDisplayedConceptId); essenceMultiplier = 0.5; action = 'addCore'; }

     const concept = concepts.find(c => c.id === currentlyDisplayedConceptId);
     const changedEssence = grantEssenceForConcept(concept, essenceMultiplier);
     const synergyBonus = checkAndApplySynergyBonus(concept, action); // Check synergy
     gainAttunementForAction(action, concept.primaryElement); // Gain/lose attunement? Maybe only gain on add.
     updateMilestoneProgress('coreConcepts.size', coreConcepts.size); // Update milestone

     updateCoreButtonStatus(currentlyDisplayedConceptId); displayCoreConceptsPersona();
     if(changedEssence || synergyBonus > 0) { displayElementEssenceStudy(); displayElementEssencePersona(); }
     synthesizeAndDisplayThemesPersona();
     // Re-check evolution eligibility in popup if open
     if(!conceptDetailPopup.classList.contains('hidden')){
          const discoveredData = discoveredConcepts.get(currentlyDisplayedConceptId);
          displayEvolutionSection(concept, discoveredData);
     }
     if (grimoireScreen.classList.contains('current')) { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); }
     checkAndUpdateRituals(action, 1); // Update rituals
}

function checkAndApplySynergyBonus(concept, action) {
    if (!concept || !concept.relatedIds || action === 'removeCore') return 0; // Only on add/addCore

    let synergyCount = 0;
    concept.relatedIds.forEach(relId => {
        if (coreConcepts.has(relId)) { // Check if related concept is Core
            synergyCount++;
        }
    });

    if (synergyCount > 0) {
        const bonusAmount = synergyCount * 0.5; // Example: 0.5 bonus Essence per synergy
        const bonusElement = elementKeyToFullName[concept.primaryElement] || elementNames[Math.floor(Math.random() * elementNames.length)]; // Reward essence of primary element or random
        elementEssence[bonusElement] = (elementEssence[bonusElement] || 0) + bonusAmount;
        console.log(`Synergy Bonus! +${bonusAmount.toFixed(1)} ${bonusElement} Essence for ${action} ${concept.name} (found ${synergyCount} core relations).`);
        // TODO: Add temporary visual feedback to user about synergy bonus
        showTemporaryMessage(`Synergy Bonus! +${bonusAmount.toFixed(1)} ${bonusElement} Essence.`);
        return bonusAmount;
    }
    return 0;
}

// updateGrimoireButtonStatus, updateCoreButtonStatus
// --- (Keep these functions same as previous version) ---

// --- Reflection Prompts ---
let cardsAddedSinceLastPrompt = 0;
let promptCooldownActive = false;
let currentReflectionElement = null; // Store element for reward
let currentPromptId = null;

function checkTriggerReflectionPrompt(triggerAction = 'other') {
    if (promptCooldownActive) return; // Don't show prompts too close together

    const today = new Date().toISOString().slice(0, 10);
    let shouldTrigger = false;

    // Daily Check
    if (lastLoginDate !== today) {
        shouldTrigger = true;
        console.log("Triggering daily reflection prompt check.");
    }

    // Usage Check
    if (triggerAction === 'add') {
        cardsAddedSinceLastPrompt++;
        // Random threshold 3-5
        const threshold = 3 + Math.floor(Math.random() * 3);
        if (cardsAddedSinceLastPrompt >= threshold) {
            shouldTrigger = true;
            console.log(`Triggering usage-based reflection prompt check (threshold: ${threshold}).`);
            cardsAddedSinceLastPrompt = 0; // Reset counter
        }
    }

    if (shouldTrigger) {
        displayReflectionPrompt();
        // Set cooldown
        promptCooldownActive = true;
        setTimeout(() => { promptCooldownActive = false; }, 60000 * 5); // 5 minute cooldown
    }
}

function displayReflectionPrompt() {
    let availablePrompts = [];
    // Flatten prompts and filter out seen ones
    elementNames.forEach(elName => {
        const promptsForElement = reflectionPrompts[elName] || [];
        promptsForElement.forEach(p => {
            if (!seenPrompts.has(p.id)) {
                availablePrompts.push({ ...p, element: elName });
            }
        });
    });

    if (availablePrompts.length === 0) {
        console.log("No unseen reflection prompts available.");
        // Optional: Reset seenPrompts if all have been shown?
        // seenPrompts.clear();
        return;
    }

    // Select a random prompt from the available ones
    const randomIndex = Math.floor(Math.random() * availablePrompts.length);
    const selectedPrompt = availablePrompts[randomIndex];

    currentReflectionElement = selectedPrompt.element;
    currentPromptId = selectedPrompt.id;
    const rewardAmount = 3; // Example reward

    // Populate and show modal
    if (reflectionElement) reflectionElement.textContent = elementDetails[currentReflectionElement]?.name || currentReflectionElement;
    if (reflectionPromptText) reflectionPromptText.textContent = selectedPrompt.text;
    if (reflectionCheckbox) reflectionCheckbox.checked = false;
    if (confirmReflectionButton) confirmReflectionButton.disabled = true;
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = rewardAmount;

    if (reflectionModal) reflectionModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}

function handleConfirmReflection() {
    if (!currentReflectionElement || !currentPromptId) return;

    const rewardAmount = 3; // Must match amount shown
    // Grant Essence
    elementEssence[currentReflectionElement] = (elementEssence[currentReflectionElement] || 0) + rewardAmount;
    // Grant Attunement
    gainAttunementForAction('completeReflection', elementNameToKey[currentReflectionElement], 1.0); // More attunement for reflection
    // Mark as seen
    seenPrompts.add(currentPromptId);
    // Update UI
    displayElementEssenceStudy();
    displayElementEssencePersona();
    showTemporaryMessage(`Reflection Confirmed! +${rewardAmount} ${currentReflectionElement} Essence.`);
    // Update Rituals
     checkAndUpdateRituals('completeReflection', 1);

    // Reset state and hide modal
    currentReflectionElement = null;
    currentPromptId = null;
    hidePopups(); // Hide reflection modal and overlay
}

// --- Rituals & Milestones ---
function displayDailyRituals() {
    if (!dailyRitualsDisplay) return;
    // TODO: Implement logic to check completion status from completedRituals based on date
    dailyRitualsDisplay.innerHTML = ''; // Clear
    dailyRituals.forEach(ritual => {
        // Check if ritual is completed for today (needs date logic)
        const isCompleted = false; // Placeholder
        const li = document.createElement('li');
        li.classList.toggle('completed', isCompleted);
        li.innerHTML = `${ritual.description} <span class="ritual-reward">(+${ritual.reward.amount} ${ritual.reward.element} ${ritual.reward.type})</span>`;
        dailyRitualsDisplay.appendChild(li);
    });
}

function checkAndUpdateRituals(action, count = 1) {
    // TODO: Check dailyRituals array if 'action' matches, update progress,
    // grant reward if complete, mark as completed for the day.
    console.log(`Ritual Check Triggered by action: ${action}, count: ${count}`);
    // This needs more robust implementation with date checking and state saving.
    // For now, just log. Call displayDailyRituals() if progress changes.
}

function displayMilestones() {
    if (!milestonesDisplay) return;
    milestonesDisplay.innerHTML = ''; // Clear
    let displayedCount = 0;
    milestones.forEach(ms => {
        if (achievedMilestones.has(ms.id)) {
            const li = document.createElement('li');
            li.textContent = `✓ ${ms.description}`;
            milestonesDisplay.appendChild(li);
            displayedCount++;
        }
    });
    if (displayedCount === 0) {
         milestonesDisplay.innerHTML = '<li>Explore more to unlock milestones!</li>';
    }
}

function updateMilestoneProgress(trackType, currentValue) {
    milestones.forEach(ms => {
        // Check if already achieved
        if (achievedMilestones.has(ms.id)) return;

        let conditionMet = false;
        if (ms.track.state && trackType === ms.track.state) {
            // State-based tracking (e.g., "discoveredConcepts.size")
            if (currentValue >= ms.track.threshold) {
                conditionMet = true;
            }
        } else if (ms.track.action && trackType === ms.track.action) {
             // Action-based tracking (e.g., "conductResearch") - simple count for now
             // Needs more complex tracking if milestones require multiple actions
            if(currentValue >= ms.track.count){ // Assuming currentValue is the count for action milestones
                 conditionMet = true;
            }
        } else if (ms.track.state && ms.track.state === 'elementAttunement' && trackType === 'attunementUpdate'){
             // Special handling for attunement milestones
             if(ms.track.condition === 'any') {
                 conditionMet = Object.values(elementAttunement).some(val => val >= ms.track.threshold);
             } // Add checks for specific element if needed
        }

        if (conditionMet) {
            console.log(`Milestone Achieved: ${ms.description}`);
            achievedMilestones.add(ms.id);
            // Grant reward
            if (ms.reward.type === 'essence') {
                if (ms.reward.element === 'All') {
                    elementNames.forEach(elName => { elementEssence[elName] = (elementEssence[elName] || 0) + ms.reward.amount; });
                } else if (ms.reward.element === 'Random') {
                    const randEl = elementNames[Math.floor(Math.random() * elementNames.length)];
                    elementEssence[randEl] = (elementEssence[randEl] || 0) + ms.reward.amount;
                } else { // Specific element
                    elementEssence[ms.reward.element] = (elementEssence[ms.reward.element] || 0) + ms.reward.amount;
                }
                displayElementEssenceStudy(); // Update displays
                displayElementEssencePersona();
            } else if (ms.reward.type === 'attunement') {
                 gainAttunementForAction('milestone', ms.reward.element, ms.reward.amount); // 'All' or specific key possible
            }
            // Show alert
            showMilestoneAlert(ms.description);
            displayMilestones(); // Update list
        }
    });
     // Also trigger attunement check if action was attunement related
     if(trackType.startsWith('attunement')) {
         updateMilestoneProgress('attunementUpdate', null);
     }
}

function showMilestoneAlert(text) {
    if (!milestoneAlert || !milestoneAlertText) return;
    milestoneAlertText.textContent = `Milestone Reached: ${text}`;
    milestoneAlert.classList.remove('hidden');
    // Optional: Auto-hide after a few seconds
    // setTimeout(hideMilestoneAlert, 5000);
}

function hideMilestoneAlert() {
     if (milestoneAlert) milestoneAlert.classList.add('hidden');
}

function showTemporaryMessage(message, duration = 3000) {
     // Simple alert for now, could be a nicer overlay later
     alert(message);
     console.log("Feedback:", message);
}


// --- Reset App ---
function resetApp() { /* ... (same as before) ... */ }

// --- Event Listeners (within DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Card Concept Expanded...");
    // Attach ALL listeners (Start, Next, Prev, Nav, Restart, Popups, Grimoire Filters, Card Buttons, Reflection Confirm, Milestone Alert Close)
    // ... (Ensure all listeners from previous version are present and attached to correct elements) ...
    if (startButton) startButton.addEventListener('click', initializeQuestionnaire); else console.error("Start button not found!");
    if (nextElementButton) nextElementButton.addEventListener('click', nextElement); else console.error("Next button not found!");
    if (prevElementButton) prevElementButton.addEventListener('click', prevElement); else console.error("Prev button not found!");
    if (restartButtonPersona) restartButtonPersona.addEventListener('click', resetApp); else console.error("Restart button not found!");
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopups); else console.error("Close Popup button not found!");
    if (popupOverlay) popupOverlay.addEventListener('click', hidePopups); else console.error("Popup Overlay not found!");
    if (closeResearchModalButton) closeResearchModalButton.addEventListener('click', hidePopups); else console.error("Close Research Modal button not found!");
    if (closeReflectionModalButton) closeReflectionModalButton.addEventListener('click', hidePopups); else console.error("Close Reflection Modal button not found!");
    if (closeMilestoneAlertButton) closeMilestoneAlertButton.addEventListener('click', hideMilestoneAlert); else console.error("Close Milestone Alert button not found!");
    if (addToGrimoireButton) addToGrimoireButton.addEventListener('click', addToGrimoire); else console.error("Add to Grimoire button not found!");
    if (markAsCoreButton) markAsCoreButton.addEventListener('click', toggleCoreConcept); else console.error("Mark as Core button not found!");
    // Note: Evolve button listener added dynamically in displayEvolutionSection
    if (grimoireTypeFilter) grimoireTypeFilter.addEventListener('change', (e) => displayGrimoire(e.target.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value)); else console.error("Grimoire Type filter not found!");
    if (grimoireElementFilter) grimoireElementFilter.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, e.target.value, grimoireSortOrder.value, grimoireRarityFilter.value)); else console.error("Grimoire Element filter not found!");
    if (grimoireRarityFilter) grimoireRarityFilter.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, e.target.value)); else console.error("Grimoire Rarity filter not found!");
    if (grimoireSortOrder) grimoireSortOrder.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, e.target.value, grimoireRarityFilter.value)); else console.error("Grimoire Sort order not found!");
    if (reflectionCheckbox) reflectionCheckbox.addEventListener('change', () => { if(confirmReflectionButton) confirmReflectionButton.disabled = !reflectionCheckbox.checked; }); else console.error("Reflection checkbox not found!");
    if (confirmReflectionButton) confirmReflectionButton.addEventListener('click', handleConfirmReflection); else console.error("Confirm Reflection button not found!");

    navButtons.forEach(button => { button.addEventListener('click', () => { const targetScreen = button.dataset.target; if(!document.getElementById(targetScreen)) { console.error(`Target screen #${targetScreen} not found!`); return; } if (targetScreen === 'personaScreen') { displayPersonaScreen(); } if (targetScreen === 'studyScreen') { displayElementEssenceStudy(); displayDailyRituals(); } if (targetScreen === 'grimoireScreen') { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value, grimoireRarityFilter.value); } showScreen(targetScreen); }); });

    // --- Initial Setup ---
    // TODO: Load state from LocalStorage here (discoveredConcepts, coreConcepts, essence, attunement, seenPrompts, completedRituals, achievedMilestones, lastLoginDate)
    showScreen('welcomeScreen');
    console.log("Initial screen set to Welcome.");
}); // End DOMContentLoaded

// --- Daily Login Check ---
function checkForDailyLogin() {
    const today = new Date().toISOString().slice(0, 10);
    if (lastLoginDate !== today) {
        console.log("First login of the day detected.");
        // Grant daily login bonus?
        // gainAttunementForAction('login', 'All', 0.1); // Small attunement boost
        // showTemporaryMessage("Welcome back! Daily login bonus applied.");
        checkTriggerReflectionPrompt('login'); // Trigger daily prompt check
        lastLoginDate = today;
        // TODO: Reset daily ritual completion status here
        // TODO: Save lastLoginDate to LocalStorage
    }
}
