let currentElementIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
const cardTypeKeys = ["Orientation", "Identity/Role", "Practice/Kink", "Psychological/Goal", "Relationship Style"]; // For filtering
let currentElementAnswers = {};
// let selectedElements = []; // REMOVED - No longer mixing vials
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // Use Map: ID -> { concept, discoveredTime }
let coreConcepts = new Set(); // Track IDs marked as core
let elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; // Track collected essence
const RESEARCH_COST = 5; // Cost to Research an element

// --- DOM Elements ---
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
const elementEssenceDisplayPersona = document.getElementById('elementEssenceDisplayPersona'); // On Persona
const personaCoreConceptsDisplay = document.getElementById('personaCoreConceptsDisplay'); // Core Cards Grid
const personaThemesList = document.getElementById('personaThemesList'); // Themes list (future use)
const restartButtonPersona = document.getElementById('restartButtonPersona');
const studyScreen = document.getElementById('studyScreen'); // Renamed
const elementEssenceDisplayStudy = document.getElementById('elementEssenceDisplayStudy'); // On Study
const researchStatus = document.getElementById('researchStatus');
// const researchOutput = document.getElementById('researchOutput'); // Output now in modal
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const grimoireTypeFilter = document.getElementById('grimoireTypeFilter'); // New Filter
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
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


// --- Utility & Setup Functions ---

function getScoreLabel(score) {
    if (score >= 9) return "Very High";
    if (score >= 7) return "High";
    if (score >= 5) return "Moderate";
    if (score >= 3) return "Low";
    return "Very Low";
}

// Function to get Affinity level string based on score
function getAffinityLevel(score) {
    if (score >= 8) return "High";
    if (score >= 5) return "Moderate";
    return null; // Low affinity is not shown on card face
}

function showScreen(screenId) {
    console.log("Showing screen:", screenId);
    let targetIsMain = ['personaScreen', 'studyScreen', 'grimoireScreen'].includes(screenId);
    screens.forEach(screen => {
        screen.classList.toggle('current', screen.id === screenId);
        screen.classList.toggle('hidden', screen.id !== screenId);
    });
    mainNavBar.classList.toggle('hidden', !targetIsMain);
    navButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.target === screenId);
    });
    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
}

function initializeQuestionnaire() {
    // Reset state (same as before)
    currentElementIndex = 0;
    userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
    userAnswers = {};
    elementNames.forEach(el => userAnswers[el] = {});
    discoveredConcepts = new Map();
    coreConcepts = new Set();
    elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };

    updateElementProgressHeader(-1);
    displayElementQuestions(currentElementIndex);
    showScreen('questionnaireScreen');
    mainNavBar.classList.add('hidden');
}

// updateElementProgressHeader, enforceMaxChoices, displayElementQuestions,
// handleQuestionnaireInputChange, collectCurrentElementAnswers, updateDynamicFeedback,
// calculateElementScore, nextElement, prevElement
// --- These questionnaire functions remain largely the same as the previous version ---
// (Make sure displayElementQuestions uses elementDetails for intro text)
function updateElementProgressHeader(activeIndex) { /* ... Same ... */ }
function enforceMaxChoices(name, max, event) { /* ... Same ... */ }
function displayElementQuestions(index) { /* ... Same as previous version using elementDetails ... */ }
function handleQuestionnaireInputChange(event) { /* ... Same ... */ }
function collectCurrentElementAnswers() { /* ... Same ... */ }
function updateDynamicFeedback(element) { /* ... Same using elementDetails[element].name ... */ }
function calculateElementScore(element, answersForElement) { /* ... Same ... */ }
function nextElement() { /* ... Same ... */ }
function prevElement() { /* ... Same ... */ }


function finalizeScoresAndShowPersona() {
    console.log("Finalizing scores...");
    elementNames.forEach(element => {
        userScores[element] = calculateElementScore(element, userAnswers[element] || {});
    });
    console.log("Final User Scores:", userScores);

    // Determine Starter Hand and Initial Essence
    determineStarterHandAndEssence();

    // Populate Persona Screen content *before* showing it
    displayPersonaScreen();
    // Setup Study screen content (Essence display)
    displayElementEssenceStudy();
    // Setup Grimoire filters
    populateGrimoireFilters();
    updateGrimoireCounter(); // Update count after starter hand

    // Show Persona Screen FIRST after setup
    showScreen('personaScreen');
    alert("Experiment Complete!\n\nYour initial scores have been calculated. You've been granted a 'Starter Hand' of 7 concepts added to your Grimoire, plus some initial Element Essence based on them.\n\nExplore your Persona Tapestry, check your Grimoire, or visit The Study to Research new concepts!");
}

// --- Starter Hand & Initial Essence ---
function determineStarterHandAndEssence() {
    console.log("Determining starter hand...");
    discoveredConcepts = new Map(); // Ensure clean start
    elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; // Reset

    // 1. Calculate Resonance for all concepts
    let conceptsWithDistance = concepts.map(c => ({
        ...c,
        distance: euclideanDistance(userScores, c.elementScores || {})
    })).filter(c => c.distance !== Infinity);

    // 2. Sort by Resonance (closest first)
    conceptsWithDistance.sort((a, b) => a.distance - b.distance);

    // 3. Select Top 15 Candidates
    const candidates = conceptsWithDistance.slice(0, 15);

    // 4. Ensure Variety & Select Final 7
    const starterHand = [];
    const representedElements = new Set();
    const starterHandIds = new Set();

    // Add first 4 closest, tracking primary elements
    for (const candidate of candidates) {
        if (starterHand.length < 4 && !starterHandIds.has(candidate.id)) {
            starterHand.push(candidate);
            starterHandIds.add(candidate.id);
            if (candidate.primaryElement) representedElements.add(candidate.primaryElement);
        }
        if (starterHand.length >= 4) break;
    }

    // Add remaining 3, prioritizing element variety
    for (const candidate of candidates) {
        if (starterHand.length >= 7) break;
        if (starterHandIds.has(candidate.id)) continue; // Skip if already added

        // Add if it brings a new primary element, OR if we have to fill slots anyway
        if (!representedElements.has(candidate.primaryElement) || starterHand.length < 7) {
             starterHand.push(candidate);
             starterHandIds.add(candidate.id);
             if (candidate.primaryElement) representedElements.add(candidate.primaryElement);
        }
    }
     // If still less than 7 (unlikely with 15 candidates), fill with remaining closest
     for (const candidate of candidates) {
         if (starterHand.length >= 7) break;
         if (!starterHandIds.has(candidate.id)) {
              starterHand.push(candidate);
              starterHandIds.add(candidate.id);
         }
     }


    // 5. Add to Grimoire & 6. Grant Initial Essence
    console.log("Starter Hand Selected:", starterHand.map(c => c.name));
    starterHand.forEach(concept => {
        discoveredConcepts.set(concept.id, { concept: concept, discoveredTime: Date.now() });
        grantEssenceForConcept(concept, 0.5); // Grant slightly less essence for starter hand
    });

    console.log("Initial Essence Granted:", elementEssence);
}

// --- Persona Screen Functions ---

function displayPersonaScreen() {
    console.log("Running displayPersonaScreen...");
    if (!personaElementDetailsDiv) { console.error("Persona details div (#personaElementDetails) not found!"); return; }
    personaElementDetailsDiv.innerHTML = ''; // Clear

    elementNames.forEach(element => {
        // ... (Logic to display element details remains the same as previous version using elementDetails) ...
        const score = userScores[element];
        const scoreLabel = getScoreLabel(score);
        const elementData = elementDetails[element] || {};
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation not available.";
        const barWidth = score * 10;
        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        details.innerHTML = `...`; // Same detailed HTML as before
        personaElementDetailsDiv.appendChild(details);
    });
    console.log("Element details populated.");

    displayElementEssencePersona(); // Display essence totals on Persona screen
    displayCoreConceptsPersona(); // Display core cards on Persona screen
    synthesizeAndDisplayThemesPersona(); // Display themes (MVP: placeholder or simple list)
    console.log("Persona sub-sections populated.");
}

function displayElementEssencePersona() {
    if (!elementEssenceDisplayPersona) { console.error("Essence display div (#elementEssenceDisplayPersona) not found!"); return; }
    elementEssenceDisplayPersona.innerHTML = ''; // Clear
    let hasEssence = false;
    elementNames.forEach(el => {
        const essenceValue = parseFloat(elementEssence[el] || 0);
        if (essenceValue > 0) hasEssence = true;
        elementEssenceDisplayPersona.innerHTML += `
           <div class="essence-item">
               <span class="essence-icon" style="background-color: ${getElementColor(el)};"></span>
               <span class="essence-name">${elementDetails[el]?.name || el}:</span>
               <span class="essence-value">${essenceValue.toFixed(1)}</span>
           </div>`;
    });
    if (!hasEssence) {
        elementEssenceDisplayPersona.innerHTML += '<p style="font-size: 0.85em; text-align: left; color: #777;"><i>No Essence collected yet. Add concepts to your Grimoire.</i></p>';
    }
}

function displayCoreConceptsPersona() {
    if (!personaCoreConceptsDisplay) { console.error("Core concepts display div (#personaCoreConceptsDisplay) not found!"); return; }
    personaCoreConceptsDisplay.innerHTML = ''; // Clear previous
    if (coreConcepts.size === 0) {
        personaCoreConceptsDisplay.innerHTML = '<li>Mark concepts as "Core" via their detail pop-up to build your tapestry.</li>';
        console.log("Core Concepts (Persona): None marked.");
        return;
    }

    coreConcepts.forEach(conceptId => {
        const concept = concepts.find(c => c.id === conceptId);
        if (concept) {
            const item = document.createElement('div');
            item.classList.add('core-concept-item');
            item.dataset.conceptId = concept.id;
            // Use Font Awesome question mark as placeholder visual
            item.innerHTML = `
                <i class="${getCardTypeIcon(concept.cardType)} card-visual-placeholder"></i>
                <span class="name">${concept.name}</span>
                <span class="type">(${concept.cardType})</span>
            `;
             item.addEventListener('click', () => showConceptDetailPopup(concept.id)); // Allow clicking from Tapestry
            personaCoreConceptsDisplay.appendChild(item);
        }
    });
    console.log("Core Concepts (Persona) displayed:", coreConcepts);
}

function synthesizeAndDisplayThemesPersona() {
    // MVP: Simple placeholder or based only on core cards
    if (!personaThemesList) { console.error("Themes list ul (#personaThemesList) not found!"); return; }
    personaThemesList.innerHTML = '';

    if (coreConcepts.size === 0) {
        personaThemesList.innerHTML = '<li>Mark Core Concepts to reveal dominant themes.</li>';
        return;
    }

    const elementCounts = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
    const threshold = 7.0; // High score threshold

    coreConcepts.forEach(id => {
        const concept = concepts.find(c => c.id === id);
        if (concept?.elementScores) {
            elementNames.forEach(el => {
                if (concept.elementScores[el] >= threshold) {
                    elementCounts[el]++;
                }
            });
        }
    });

    const sortedThemes = Object.entries(elementCounts)
        .filter(([el, count]) => count > 0)
        .sort(([, countA], [, countB]) => countB - countA);

    if (sortedThemes.length === 0) {
        personaThemesList.innerHTML = '<li>No strong elemental themes identified among Core Concepts yet.</li>';
        return;
    }

    sortedThemes.slice(0, 3).forEach(([element, count]) => {
        const li = document.createElement('li');
        li.textContent = `${elementDetails[element]?.name || element} Focus (from ${count} Core concepts)`;
        personaThemesList.appendChild(li);
    });
}


// --- Study Screen Functions ---

function displayElementEssenceStudy() {
    if (!elementEssenceDisplayStudy) { console.error("Study essence display div (#elementEssenceDisplayStudy) not found!"); return; }
    elementEssenceDisplayStudy.innerHTML = ''; // Clear
    elementNames.forEach(el => {
        const currentEssence = parseFloat(elementEssence[el] || 0);
        const canAfford = currentEssence >= RESEARCH_COST;
        const counter = document.createElement('div');
        counter.classList.add('essence-counter');
        counter.dataset.element = el;
        counter.title = `Click to Research ${elementDetails[el]?.name || el} (Cost: ${RESEARCH_COST})`;
        if (!canAfford) {
            counter.classList.add('disabled');
            counter.title = `Need ${RESEARCH_COST} Essence to Research ${elementDetails[el]?.name || el}`;
        }
        counter.innerHTML = `
            <span class="essence-icon" style="background-color: ${getElementColor(el)};"></span>
            <span class="essence-name">${elementDetails[el]?.name || el}</span>
            <span class="essence-value">${currentEssence.toFixed(1)}</span>
            <div class="essence-cost">Cost: ${RESEARCH_COST}</div>
        `;
        if (canAfford) {
            counter.addEventListener('click', handleResearchClick);
        }
        elementEssenceDisplayStudy.appendChild(counter);
    });
}

function handleResearchClick(event) {
    const element = event.currentTarget.dataset.element;
    if (!element) return;

    const currentEssence = parseFloat(elementEssence[element] || 0);
    if (currentEssence >= RESEARCH_COST) {
        // Deduct cost
        elementEssence[element] = currentEssence - RESEARCH_COST;
        console.log(`Spent ${RESEARCH_COST} ${element} Essence. Remaining: ${elementEssence[element].toFixed(1)}`);
        displayElementEssenceStudy(); // Update display immediately

        // Perform Research
        conductResearch(element);
    } else {
        alert(`Not enough ${elementDetails[element]?.name || element} Essence! Need ${RESEARCH_COST}.`);
    }
}

function conductResearch(elementToResearch) {
    console.log(`Researching Element: ${elementToResearch}`);
    researchStatus.textContent = `Researching ${elementDetails[elementToResearch]?.name || elementToResearch}...`;
    researchModalContent.innerHTML = ''; // Clear previous modal results

    // 1. Identify Undiscovered Pool
    const discoveredIds = new Set(discoveredConcepts.keys());
    const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));

    if (undiscoveredPool.length === 0) {
        researchModalStatus.textContent = "No new concepts left to discover!";
        researchModal.classList.remove('hidden');
        popupOverlay.classList.remove('hidden');
        researchStatus.textContent = "Research complete. No new concepts found.";
        return;
    }

    // 2. Categorize Undiscovered Pool
    const priorityPool = [];
    const secondaryPool = [];
    const tertiaryPool = [...undiscoveredPool]; // Start with all

    undiscoveredPool.forEach(c => {
        const score = c.elementScores?.[elementToResearch] || 0;
        const primary = elementKeyToName[c.primaryElement] === elementToResearch;

        if (primary || score >= 8.0) {
            priorityPool.push(c);
            // Remove from tertiary to avoid duplicates in selection logic
            const index = tertiaryPool.findIndex(tc => tc.id === c.id);
            if (index > -1) tertiaryPool.splice(index, 1);
        } else if (score >= 5.0) {
            secondaryPool.push(c);
            const index = tertiaryPool.findIndex(tc => tc.id === c.id);
            if (index > -1) tertiaryPool.splice(index, 1);
        }
    });
    console.log(`Pools - Priority: ${priorityPool.length}, Secondary: ${secondaryPool.length}, Tertiary: ${tertiaryPool.length}`);


    // 3. Select up to 3 Cards
    const selectedForOutput = [];
    const selectRandomFromPool = (pool) => {
        if (pool.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * pool.length);
        const selected = pool[randomIndex];
        pool.splice(randomIndex, 1); // Remove from pool to avoid re-selection
        return selected;
    };

    for (let i = 0; i < 3; i++) {
        let selectedCard = selectRandomFromPool(priorityPool) || selectRandomFromPool(secondaryPool) || selectRandomFromPool(tertiaryPool);
        if (selectedCard) {
            selectedForOutput.push(selectedCard);
        } else {
            break; // No more cards available in any pool
        }
    }

    // 4. Presentation
    if (selectedForOutput.length > 0) {
        researchModalStatus.textContent = `Discovered ${selectedForOutput.length} new concept(s) related to ${elementDetails[elementToResearch]?.name || elementToResearch}! Click to learn more and add to your Grimoire.`;
        selectedForOutput.forEach(concept => {
            const cardElement = renderCard(concept, 'research-result');
            researchModalContent.appendChild(cardElement);
        });
        researchStatus.textContent = `Research complete. Found ${selectedForOutput.length} new concept(s). Check the results!`;
    } else {
         researchModalStatus.textContent = "No new concepts matching the research criteria were found this time.";
         researchStatus.textContent = "Research complete. No new relevant concepts found.";
    }

    researchModal.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');
}


// --- Grimoire Functions ---
function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered") {
    grimoireContentDiv.innerHTML = ''; // Clear

    if (discoveredConcepts.size === 0) {
        grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty. Explore The Study and Research concepts!</p>';
        showScreen('grimoireScreen');
        return;
    }

    let discoveredArray = Array.from(discoveredConcepts.values());

    // Filter
    const conceptsToDisplay = discoveredArray.filter(data => {
        const typeMatch = (filterType === "All") || (data.concept.cardType === filterType);
        const primaryElName = elementDetails[elementKeyToName[data.concept.primaryElement]]?.name || "Other";
        const elementMatch = (filterElement === "All") || (primaryElName === filterElement);
        return typeMatch && elementMatch;
    });

    // Sort
    if (sortBy === 'name') { conceptsToDisplay.sort((a, b) => a.concept.name.localeCompare(b.concept.name)); }
    else if (sortBy === 'type') { conceptsToDisplay.sort((a, b) => a.concept.cardType.localeCompare(b.concept.cardType) || a.concept.name.localeCompare(b.concept.name)); }
    else { conceptsToDisplay.sort((a,b) => a.discoveredTime - b.discoveredTime); }

    if (conceptsToDisplay.length === 0) {
        grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters.</p>`;
    } else {
        conceptsToDisplay.forEach(data => {
            const cardElement = renderCard(data.concept, 'grimoire');
            grimoireContentDiv.appendChild(cardElement);
        });
    }
    showScreen('grimoireScreen');
}

function populateGrimoireFilters() {
    // Populate Type Filter
    if (!grimoireTypeFilter) return;
    grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>';
    cardTypeKeys.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        grimoireTypeFilter.appendChild(option);
    });

    // Populate Element Filter (using full names)
    if (!grimoireElementFilter) return;
    grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>';
    elementNames.forEach(key => {
        const name = elementDetails[key]?.name || key;
        const option = document.createElement('option');
        option.value = name; // Use full name for value
        option.textContent = name;
        grimoireElementFilter.appendChild(option);
    });
}


// --- Card Rendering Function ---
function renderCard(concept, context = 'grimoire') {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.dataset.conceptId = concept.id;

    const isDiscovered = discoveredConcepts.has(concept.id);
    const isCore = coreConcepts.has(concept.id);

    // Header
    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    const coreStampHTML = isCore ? '<span class="core-stamp" title="Core Concept">★</span>' : ''; // Simple star for now
    const cardTypeIcon = getCardTypeIcon(concept.cardType);

    // Affinities
    let affinitiesHTML = '';
    if (concept.elementScores) {
        elementNames.forEach(el => {
            const level = getAffinityLevel(concept.elementScores[el]);
            if (level) {
                const color = getElementColor(el);
                const levelClass = level === "High" ? "affinity-high" : "";
                affinitiesHTML += `<span class="affinity ${levelClass}" style="border-color: ${color}; color: ${color}; background-color: ${hexToRgba(color, 0.1)};" title="${elementDetails[el]?.name || el} Affinity">
                                     <i class="${getElementIcon(el)}"></i> ${level.substring(0, 3)}</span> `;
            }
        });
    }

    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            ${grimoireStampHTML} ${coreStampHTML}
        </div>
        <div class="card-visual">
            <i class="fas fa-question card-visual-placeholder" title="${concept.visualHandle}"></i> {/* Placeholder */}
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small>No Strong Affinities</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || 'No description.'}</p>
        </div>
    `;

    // Add click listener to open detail popup (unless specified otherwise)
    if (context !== 'no-click') {
         cardDiv.addEventListener('click', () => showConceptDetailPopup(concept.id));
    }

    return cardDiv;
}

// --- Icon Helpers (Placeholders using Font Awesome) ---
function getCardTypeIcon(cardType) {
    switch (cardType) {
        case "Orientation": return "fa-solid fa-compass";
        case "Identity/Role": return "fa-solid fa-mask";
        case "Practice/Kink": return "fa-solid fa-gear";
        case "Psychological/Goal": return "fa-solid fa-brain";
        case "Relationship Style": return "fa-solid fa-heart";
        default: return "fa-solid fa-question-circle";
    }
}

function getElementIcon(elementName) {
     // Placeholder icons
     switch (elementName) {
        case "Attraction": return "fa-solid fa-magnet";
        case "Interaction": return "fa-solid fa-users";
        case "Sensory": return "fa-solid fa-hand-sparkles";
        case "Psychological": return "fa-solid fa-comment-dots";
        case "Cognitive": return "fa-solid fa-lightbulb";
        case "Relational": return "fa-solid fa-link";
        default: return "fa-solid fa-atom";
     }
}


// --- Concept Detail Pop-up Logic ---
function showConceptDetailPopup(conceptId) {
    currentlyDisplayedConceptId = conceptId;
    const conceptData = concepts.find(c => c.id === conceptId);
    if (!conceptData) { console.error(`Concept data not found for ID: ${conceptId}`); return; }
    if (!conceptData.elementScores || typeof conceptData.elementScores !== 'object') { console.error(`Invalid elementScores for concept ID: ${conceptId}`); hidePopups(); return; }

    // Populate Header
    popupCardTypeIcon.className = `${getCardTypeIcon(conceptData.cardType)} card-type-icon`; // Set icon class
    popupConceptName.textContent = conceptData.name;
    popupConceptType.textContent = conceptData.cardType;

    // Populate Content
    popupCardVisual.className = `fas fa-question card-visual-placeholder`; // Placeholder visual
    popupDetailedDescription.textContent = conceptData.detailedDescription || "No detailed description available.";

    // Clear previous dynamic content
    popupComparisonHighlights.innerHTML = '';
    popupConceptProfile.innerHTML = '';
    popupUserComparisonProfile.innerHTML = '';
    popupRelatedConceptsList.innerHTML = '';

    // --- Resonance & Recipe (Similar logic as before, using helper funcs) ---
    const distance = euclideanDistance(userScores, conceptData.elementScores);
    displayPopupResonance(distance);
    displayPopupRecipeComparison(conceptData);
    displayPopupRelatedConcepts(conceptData);

    // Update button states
    updateGrimoireButtonStatus(conceptId);
    updateCoreButtonStatus(conceptId);

    // Show popup
    popupOverlay.classList.remove('hidden');
    conceptDetailPopup.classList.remove('hidden');

    // Optional: Record interaction for potential future attunement?
    // recordElementAttunementFromConcept(conceptData.elementScores);
}

function displayPopupResonance(distance) {
    let resonanceClass = 'resonance-low';
    let resonanceText = 'Low Match';
    let resonanceDesc = "Significant differences compared to your profile.";
    if (distance === Infinity) { resonanceText = 'Cannot Compare'; resonanceDesc = "Missing score data."; }
    else if (distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'High Match'; resonanceDesc = "Strong alignment with your core elements."; }
    else if (distance < 16) { resonanceClass = 'resonance-medium'; resonanceText = 'Mid Match'; resonanceDesc = "Some alignment, some notable differences."; }
    popupResonanceSummary.innerHTML = `Overall Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceText}</span><p style="font-size:0.85em; color:#666; margin-top: 3px; margin-bottom: 0;">(${resonanceDesc})</p>`;
}

function displayPopupRecipeComparison(conceptData) {
    let highlightsHTML = '';
    const diffThreshold = 3.0; const alignThreshold = 1.5;
    let matches = []; let mismatches = [];

    elementNames.forEach((element) => {
        const elementDisplayName = elementDetails[element]?.name || element;
        const cScore = conceptData.elementScores[element];
        const uScore = userScores[element];
        const cScoreLabel = getScoreLabel(cScore);
        const uScoreLabel = getScoreLabel(uScore);
        const diff = uScore - cScore;
        const color = getElementColor(element);

        const renderProfileHTML = (score, label) => {
            const barWidth = (score / 10) * 100;
            return `<span>${score.toFixed(1)} (${label})</span>
                    <div class="score-bar-container">
                        <div style="width: ${barWidth}%; height: 100%; background-color: ${color}; border-radius: 3px;"></div>
                    </div>`;
        };

        popupConceptProfile.innerHTML += `<div><strong>${elementDisplayName}:</strong>${renderProfileHTML(cScore, cScoreLabel)}</div>`;
        popupUserComparisonProfile.innerHTML += `<div><strong>${elementDisplayName}:</strong>${renderProfileHTML(uScore, uScoreLabel)}</div>`;

        // Determine highlights
        if (Math.abs(diff) <= alignThreshold) { matches.push(`<b>${elementDisplayName}</b> (${uScoreLabel})`); }
        else if (Math.abs(diff) >= diffThreshold) { const comparison = diff > 0 ? `notably higher than concept's ${cScoreLabel}` : `notably lower than concept's ${cScoreLabel}`; mismatches.push({ element: elementDisplayName, diff: diff, text: `for <b>${elementDisplayName}</b>, your score (${uScoreLabel}) is ${comparison}` }); }
    });

    if (matches.length > 0) { highlightsHTML += `<p><strong class="match">Aligns Well With:</strong> Your preference(s) for ${matches.join(', ')}.</p>`; }
    if (mismatches.length > 0) { mismatches.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)); highlightsHTML += `<p><strong class="mismatch">Key Difference:</strong> ${mismatches[0].text}.</p>`; if (mismatches.length > 1) { highlightsHTML += `<p><small>(Other notable differences in ${mismatches.slice(1).map(m => m.element).join(', ')}.)</small></p>`; } }
    if (!highlightsHTML) highlightsHTML = "<p>Moderate alignment or difference across most elements.</p>";
    popupComparisonHighlights.innerHTML = highlightsHTML;
}

function displayPopupRelatedConcepts(conceptData) {
    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
        conceptData.relatedIds.forEach(relId => {
            const relatedConcept = concepts.find(c => c.id === relId);
            if (relatedConcept) {
                const li = document.createElement('li');
                li.textContent = relatedConcept.name;
                li.dataset.conceptId = relId;
                li.addEventListener('click', handleRelatedConceptClick);
                popupRelatedConceptsList.appendChild(li);
            }
        });
    } else {
        popupRelatedConceptsList.innerHTML = '<li>None specified</li>';
    }
}

function hidePopups() {
    // Hide all popups and overlay
    conceptDetailPopup.classList.add('hidden');
    researchModal.classList.add('hidden');
    popupOverlay.classList.add('hidden');
    currentlyDisplayedConceptId = null; // Clear ID when detail popup closes
}

function handleRelatedConceptClick(event) { /* ... Same logic ... */ }


// --- Grimoire/Core Button & State Logic ---

function addToGrimoire() {
    if (currentlyDisplayedConceptId !== null) {
        if (!discoveredConcepts.has(currentlyDisplayedConceptId)) {
            const concept = concepts.find(c => c.id === currentlyDisplayedConceptId);
            if (concept) {
                discoveredConcepts.set(currentlyDisplayedConceptId, { concept: concept, discoveredTime: Date.now() });
                grantEssenceForConcept(concept, 1.0); // Grant full essence on manual add

                updateGrimoireCounter();
                updateGrimoireButtonStatus(currentlyDisplayedConceptId);
                updateCoreButtonStatus(currentlyDisplayedConceptId); // Show core button now
                displayElementEssenceStudy(); // Update study display
                displayElementEssencePersona(); // Update persona display
                synthesizeAndDisplayThemesPersona(); // Update themes (if logic exists)

                // Refresh Grimoire if visible
                if (grimoireScreen.classList.contains('current')) {
                    displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value);
                }
                // Optional: Close research modal if adding from there?
                if (!researchModal.classList.contains('hidden')) {
                    // Maybe remove just this card from the modal? Or simply close it?
                    // For simplicity, let's assume user closes modal manually after adding.
                }

            }
        }
    }
}

function grantEssenceForConcept(concept, multiplier = 1.0) {
    if (concept?.elementScores) {
        let essenceGained = false;
        elementNames.forEach(el => {
            const gain = Math.max(0, (concept.elementScores[el] || 0) - 4) * 0.1 * multiplier; // Base gain logic
            if (gain > 0) {
                elementEssence[el] = (elementEssence[el] || 0) + gain;
                essenceGained = true;
            }
        });
        if (essenceGained) console.log("Essence Updated:", elementEssence);
    }
}

function toggleCoreConcept() {
     if (currentlyDisplayedConceptId === null) return;
     if (!discoveredConcepts.has(currentlyDisplayedConceptId)) { alert("Concept must be in Grimoire first."); return; }

     let essenceMultiplier = 0; // Track essence change factor

     if (coreConcepts.has(currentlyDisplayedConceptId)) {
         coreConcepts.delete(currentlyDisplayedConceptId);
         essenceMultiplier = -0.5; // Remove half the essence gained from making it core
         console.log(`Removed Core Concept: ${currentlyDisplayedConceptId}`);
     } else {
         if (coreConcepts.size >= 7) { alert("Max 7 Core Concepts."); return; }
         coreConcepts.add(currentlyDisplayedConceptId);
         essenceMultiplier = 0.5; // Add half essence amount for making it core
         console.log(`Added Core Concept: ${currentlyDisplayedConceptId}`);
     }

      // Grant/Remove Essence for Core status change
      const concept = concepts.find(c => c.id === currentlyDisplayedConceptId);
      if(concept && essenceMultiplier !== 0) {
          grantEssenceForConcept(concept, essenceMultiplier);
          displayElementEssenceStudy(); // Update study display
          displayElementEssencePersona(); // Update persona display
      }

     updateCoreButtonStatus(currentlyDisplayedConceptId);
     displayCoreConceptsPersona(); // Update Persona Tapestry

     // Refresh Grimoire if visible
     if (grimoireScreen.classList.contains('current')) {
         displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value);
     }
}

function updateGrimoireCounter() { /* ... Same ... */ }
function updateGrimoireButtonStatus(conceptId) { /* ... Same ... */ }
function updateCoreButtonStatus(conceptId) { /* ... Same ... */ }


// --- Other Utility & Reset ---
function euclideanDistance(scores1, scores2) { /* ... Same logic ... */ }
function hexToRgba(hex, alpha = 1) { /* ... Same logic ... */ }
function darkenColor(hex, amount = 30) { /* ... Same logic ... */ }
function getElementColor(elementName) { /* ... Same logic ... */ }

function resetApp() {
    console.log("Resetting application state...");
    // Reset state variables (same as before)
    currentElementIndex = 0; userScores = { /*...*/ }; userAnswers = {};
    discoveredConcepts = new Map(); coreConcepts = new Set();
    elementEssence = { /*...*/ }; currentlyDisplayedConceptId = null;

    // Reset UI elements
    hidePopups();
    if(researchStatus) researchStatus.textContent = 'Select an Essence to begin Research...';
    // ... reset other specific UI elements like Grimoire content, Persona displays ...
    if(grimoireContentDiv) grimoireContentDiv.innerHTML = '';
    if(personaCoreConceptsDisplay) personaCoreConceptsDisplay.innerHTML = '';
    if(elementEssenceDisplayStudy) elementEssenceDisplayStudy.innerHTML = '';
    // ... etc ...
    updateGrimoireCounter();

    showScreen('welcomeScreen');
    mainNavBar.classList.add('hidden');
}

// --- Event Listeners (within DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Card Concept...");

    // Standard listeners (Start, Next, Prev, Nav, Restart, Popup Close)
    if (startButton) startButton.addEventListener('click', initializeQuestionnaire);
    if (nextElementButton) nextElementButton.addEventListener('click', nextElement);
    if (prevElementButton) prevElementButton.addEventListener('click', prevElement);
    if (restartButtonPersona) restartButtonPersona.addEventListener('click', resetApp);
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopups);
    if (popupOverlay) popupOverlay.addEventListener('click', hidePopups);
    if (closeResearchModalButton) closeResearchModalButton.addEventListener('click', hidePopups);

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreen = button.dataset.target;
            // Refresh content when navigating TO these screens
            if (targetScreen === 'personaScreen') { displayPersonaScreen(); }
            if (targetScreen === 'studyScreen') { displayElementEssenceStudy(); } // Refresh essence display
            if (targetScreen === 'grimoireScreen') { displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, grimoireSortOrder.value); }
            showScreen(targetScreen);
        });
    });

    // Card interaction listeners
    if (addToGrimoireButton) addToGrimoireButton.addEventListener('click', addToGrimoire);
    if (markAsCoreButton) markAsCoreButton.addEventListener('click', toggleCoreConcept);

    // Grimoire filter/sort listeners
    if (grimoireTypeFilter) grimoireTypeFilter.addEventListener('change', (e) => displayGrimoire(e.target.value, grimoireElementFilter.value, grimoireSortOrder.value));
    if (grimoireElementFilter) grimoireElementFilter.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, e.target.value, grimoireSortOrder.value));
    if (grimoireSortOrder) grimoireSortOrder.addEventListener('change', (e) => displayGrimoire(grimoireTypeFilter.value, grimoireElementFilter.value, e.target.value));

    // --- Initial Setup ---
    showScreen('welcomeScreen');
    console.log("Initial screen set to Welcome.");
});
