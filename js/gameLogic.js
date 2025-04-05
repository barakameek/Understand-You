// --- START OF FILE gameLogic.js --- (Corrected - Final Version)

// js/gameLogic.js - Application Logic
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as UI from './ui.js';
// Import specific data structures needed
import { elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals, sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames, elementInteractionThemes, cardTypeThemes } from '../data.js'; // Adjusted path

console.log("gameLogic.js loading...");

// --- Temporary State ---
let currentlyDisplayedConceptId = null;
let currentReflectionContext = null;
let reflectionTargetConceptId = null;
let currentReflectionCategory = null;
let currentPromptId = null;
let reflectionCooldownTimeout = null; // Used for reflection prompt cooldown

// --- Tapestry Analysis Cache ---
let currentTapestryAnalysis = null; // Stores the detailed breakdown


// --- Initialization & Core State ---
 function clearPopupState() {
    currentlyDisplayedConceptId = null;
    currentReflectionContext = null;
    reflectionTargetConceptId = null;
    currentReflectionCategory = null;
    currentPromptId = null;
    // Don't clear currentTapestryAnalysis here, it's linked to focus set
}
 function setCurrentPopupConcept(conceptId) { currentlyDisplayedConceptId = conceptId; }
 function getCurrentPopupConceptId() { return currentlyDisplayedConceptId; }


// --- Insight & Attunement Management ---
 function gainInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount === 0) return;
    const changed = State.changeInsight(amount);
    if (changed) {
        const action = amount > 0 ? "Gained" : "Spent";
        const currentInsight = State.getInsight();
        console.log(`${action} ${Math.abs(amount).toFixed(1)} Insight from ${source}. New total: ${currentInsight.toFixed(1)}`);
        UI.updateInsightDisplays(); // Update UI whenever insight changes
    }
}

 function spendInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return false;
    if (State.getInsight() >= amount) {
        gainInsight(-amount, source); // Will trigger UI update via gainInsight
        return true;
    } else {
        UI.showTemporaryMessage(`Not enough Insight! Need ${amount.toFixed(1)}.`, 3000);
        return false;
    }
}

 function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) {
    let targetKeys = [];
    let baseAmount = amount;

    // Determine target element(s) based on action type and context
    if (elementKey && State.getAttunement().hasOwnProperty(elementKey) && elementKey !== 'All') {
        targetKeys.push(elementKey);
    } else if (actionType === 'completeReflection' && ['Standard', 'SceneMeditation', 'RareConcept'].includes(currentReflectionContext)) {
        let keyFromContext = null;
        if (currentReflectionContext === 'Standard' && currentReflectionCategory) {
             keyFromContext = elementNameToKey[currentReflectionCategory];
        } else if (currentReflectionContext === 'SceneMeditation') {
             const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId);
             keyFromContext = scene?.element || null;
        } else if (currentReflectionContext === 'RareConcept') {
             const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId);
             keyFromContext = cEntry ? cEntry[1].concept.primaryElement : null;
        }

        if (keyFromContext && State.getAttunement().hasOwnProperty(keyFromContext)) {
             targetKeys.push(keyFromContext);
        } else {
            // Fallback if context doesn't provide a valid key
            console.warn(`Could not determine target element for reflection context: ${currentReflectionContext}`);
            targetKeys = Object.keys(State.getAttunement()); // Fallback to all elements
            baseAmount = 0.1; // Reduced gain for generic fallback
        }
    } else { // Handle actions affecting all elements or where key is 'All' or irrelevant
        targetKeys = Object.keys(State.getAttunement());
        // Adjust baseAmount based on specific 'all' actions
        if (actionType === 'scoreNudge') baseAmount = (0.5 / (targetKeys.length || 1));
        else if (actionType === 'completeReflectionGeneric') baseAmount = 0.2;
        else if (actionType === 'generic') baseAmount = 0.1;
        else if (actionType === 'contemplation' && elementKey === 'All') baseAmount = 0.1;
         // Specific adjustments for research actions
         else if (actionType === 'researchSuccess') baseAmount = 0.8; // Keep specific amounts
         else if (actionType === 'researchFail') baseAmount = 0.2;
         else if (actionType === 'researchSpecial') baseAmount = 1.0;
        // Keep other multi-element gains as passed (e.g., milestone rewards)
    }

    // Apply attunement gain and update milestones
    let changed = false;
    targetKeys.forEach(key => {
        if (State.updateAttunement(key, baseAmount)) {
            changed = true;
            // Trigger milestone checks related to attunement
            updateMilestoneProgress('elementAttunement', { [key]: State.getAttunement()[key] }); // Check specific element
            updateMilestoneProgress('elementAttunement', State.getAttunement()); // Check aggregate conditions (any/all)
        }
    });

    if (changed) {
        console.log(`Attunement updated (${actionType}, Key(s): ${targetKeys.join(',') || 'All'}) by ${baseAmount.toFixed(2)} per element.`);
        // Update Persona screen attunement display if it's the current screen
        const personaScreen = document.getElementById('personaScreen'); // Check existence
        if (personaScreen?.classList.contains('current')) {
           UI.displayElementAttunement();
       }
    }
}


// --- Questionnaire Logic ---
 function handleQuestionnaireInputChange(event) {
    // console.log("Input change detected:", event.target.id, event.target.value); // Reduce noise
    const input = event.target;
    const currentState = State.getState();

    if (currentState.currentElementIndex < 0 || currentState.currentElementIndex >= elementNames.length) {
        console.warn(`Questionnaire input change outside valid index (${currentState.currentElementIndex}). Ignoring.`);
        return;
    }
    const elementName = elementNames[currentState.currentElementIndex];

    const currentAnswers = UI.getQuestionnaireAnswers();
    State.updateAnswers(elementName, currentAnswers);

    if (input.dataset.type === 'slider') {
        UI.updateSliderFeedbackText(input, elementName);
    }
    UI.updateDynamicFeedback(elementName, currentAnswers);
}

 function handleCheckboxChange(event) {
     const checkbox = event.target;
     const name = checkbox.name;
     const maxChoices = parseInt(checkbox.dataset.maxChoices || 2);
     const container = checkbox.closest('.checkbox-options');
     if (!container) return;
     const checkedBoxes = container.querySelectorAll(`input[name="${name}"]:checked`);

     if (checkedBoxes.length > maxChoices) {
        UI.showTemporaryMessage(`Max ${maxChoices} options.`, 2500);
        checkbox.checked = false;
     }
     handleQuestionnaireInputChange(event);
}

 function calculateElementScore(elementName, answersForElement) {
    const questions = questionnaireGuided[elementName] || [];
    let score = 5.0;
    questions.forEach(q => {
        const answer = answersForElement[q.qId];
        let pointsToAdd = 0;
        const weight = q.scoreWeight || 1.0;

        if (q.type === 'slider') {
            const value = (answer !== undefined && !isNaN(parseFloat(answer))) ? parseFloat(answer) : q.defaultValue;
            const baseValue = q.defaultValue !== undefined ? q.defaultValue : 5;
            pointsToAdd = (value - baseValue) * weight;
        } else if (q.type === 'radio') {
            const opt = q.options.find(o => o.value === answer);
            pointsToAdd = opt ? (opt.points || 0) * weight : 0;
        } else if (q.type === 'checkbox' && Array.isArray(answer)) {
            answer.forEach(val => {
                const opt = q.options.find(o => o.value === val);
                pointsToAdd += opt ? (opt.points || 0) * weight : 0;
            });
        }
        score += pointsToAdd;
    });
    return Math.max(0, Math.min(10, score));
}

 function goToNextElement() {
    const currentState = State.getState();
    const currentAnswers = UI.getQuestionnaireAnswers();

    if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) {
        const elementName = elementNames[currentState.currentElementIndex];
        State.updateAnswers(elementName, currentAnswers);
        console.log(`Saved answers for ${elementName}:`, currentAnswers);
    } else {
        console.warn("goToNextElement called with invalid index:", currentState.currentElementIndex);
    }

    const nextIndex = currentState.currentElementIndex + 1;
    State.updateElementIndex(nextIndex);

    if (nextIndex >= elementNames.length) {
         finalizeQuestionnaire();
    } else {
        UI.displayElementQuestions(nextIndex);
    }
}

 function goToPrevElement() {
    const currentState = State.getState();
    if (currentState.currentElementIndex > 0) {
        const currentAnswers = UI.getQuestionnaireAnswers();
        if (currentState.currentElementIndex < elementNames.length) {
             const elementName = elementNames[currentState.currentElementIndex];
             State.updateAnswers(elementName, currentAnswers);
             console.log(`Saved answers for ${elementName} before going back.`);
        }
        const prevIndex = currentState.currentElementIndex - 1;
        State.updateElementIndex(prevIndex);
        UI.displayElementQuestions(prevIndex);
    } else {
        console.log("Already at the first element.");
    }
}

 function finalizeQuestionnaire() {
    console.log("Finalizing questionnaire and calculating scores...");
    const finalScores = {};
    const allAnswers = State.getState().userAnswers;

    elementNames.forEach(elementName => {
        const score = calculateElementScore(elementName, allAnswers[elementName] || {});
        const key = elementNameToKey[elementName];
        if (key) finalScores[key] = score;
        else console.warn(`No key found for element name: ${elementName}`);
    });

    State.updateScores(finalScores);
    State.setQuestionnaireComplete(); // Advances phase to PERSONA_GRIMOIRE
    State.saveAllAnswers(allAnswers);

    updateMilestoneProgress('completeQuestionnaire', 1);
    checkForDailyLogin();

    // Prepare minimal UI Data needed before showing Study Discovery
    UI.updateInsightDisplays();
    UI.updateGrimoireCounter();
    UI.populateGrimoireFilters();

    UI.applyOnboardingPhaseUI(State.getOnboardingPhase());
    console.log("Final User Scores:", State.getScores());

    // Transition to Study Screen in Discovery Mode
    UI.showScreen('studyScreen');
    UI.showTemporaryMessage("Questionnaire Complete! Discover your first Concepts.", 4000, true);
}


// --- Core Actions (Research, Reflection, Focus, etc.) ---

// Screen Logic Wrappers
 function displayPersonaScreenLogic() {
    calculateTapestryNarrative(true);
    UI.displayPersonaScreen();
}
 function displayStudyScreenLogic() {
    const currentPhase = State.getOnboardingPhase();
    // This function is called when the study screen is shown.
    // The UI function will handle rendering the correct mode based on phase.
    UI.displayStudyScreenContent();
}

// Research Actions
 function handleResearchClick(event) {
    const button = event.currentTarget;
    const elementKey = button.dataset.elementKey;
    const isFreeAttempt = event.isFree;
    let cost = 0;

    if (!elementKey) { console.error("Research action missing element key."); return; }

    if (isFreeAttempt) {
        if (State.getInitialFreeResearchRemaining() <= 0) {
             UI.showTemporaryMessage("Initial free research used. Use Insight now.", 3000);
             return;
        }
        if (State.useInitialFreeResearch()) {
            console.log(`Used initial free research on ${elementKey}. ${State.getInitialFreeResearchRemaining()} left.`);
            const studyScreen = document.getElementById('studyScreen'); // Check existence
            if (studyScreen?.classList.contains('current')) UI.displayStudyScreenContent(); // Refresh study UI
        } else {
            console.warn("Failed to use initial free research despite check.");
            return;
        }
    } else {
        cost = parseFloat(button.dataset.cost || Config.BASE_RESEARCH_COST);
        if (isNaN(cost)) cost = Config.BASE_RESEARCH_COST;

        if (!spendInsight(cost, `Research: ${elementKeyToFullName[elementKey]}`)) {
            return;
        }
        console.log(`Spent ${cost} Insight researching ${elementKey}.`);
    }

    conductResearch(elementKey);
    updateMilestoneProgress('conductResearch', 1);
    checkAndUpdateRituals('conductResearch');
}

 function handleFreeResearchClick() { // For DAILY free research button
    if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.STUDY_INSIGHT) return;
    if (!State.isFreeResearchAvailable()) { UI.showTemporaryMessage("Daily meditation already performed.", 3000); return; }

    const attunement = State.getAttunement(); let targetKey = 'A'; let minAtt = Config.MAX_ATTUNEMENT + 1;
    for (const key in attunement) { if (attunement[key] < minAtt) { minAtt = attunement[key]; targetKey = key; } }

    console.log(`Performing daily free meditation on ${targetKey} (${elementKeyToFullName[targetKey]})`);
    State.setFreeResearchUsed();

    const studyScreen = document.getElementById('studyScreen'); // Check existence
    if (studyScreen?.classList.contains('current')) UI.displayStudyScreenContent(); // Refresh study UI

    conductResearch(targetKey);
    updateMilestoneProgress('freeResearch', 1);
    checkAndUpdateRituals('freeResearch');
}

function conductResearch(elementKeyToResearch) {
    const elementFullName = elementKeyToFullName[elementKeyToResearch]; if (!elementFullName) { console.error(`Invalid key: ${elementKeyToResearch}`); return; }
    const targetContainerId = 'studyResearchDiscoveries'; // Always use the unified container ID

    console.log(`Researching: ${elementFullName}`);
    // No separate status line in the unified view, rely on guidance text / results area

    const discoveredIds = new Set(State.getDiscoveredConcepts().keys());
    const discoveredRepo = State.getRepositoryItems();
    const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));
    let rareFound = false; const roll = Math.random();
    const insightChance = 0.12; const sceneChance = 0.08;
    const researchContainerElem = document.getElementById(targetContainerId);
    const canFindRare = researchContainerElem && (researchContainerElem.children.length === 0 || researchContainerElem.querySelector('p > i'));
    let foundRepoItem = null;

    // Check for Scene Blueprint
     if (!rareFound && canFindRare && roll < sceneChance && sceneBlueprints.length > 0) {
         const availableScenes = sceneBlueprints.filter(s => !discoveredRepo.scenes.has(s.id));
         if (availableScenes.length > 0) {
             const foundScene = availableScenes[Math.floor(Math.random() * availableScenes.length)];
             if (State.addRepositoryItem('scenes', foundScene.id)) {
                 rareFound = true; foundRepoItem = { type: 'scene', ...foundScene };
                 UI.showTemporaryMessage("Scene Blueprint Discovered!", 4000);
                 updateMilestoneProgress('repositoryContents', null);
                 if(document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent();
             }
         }
     }
     // Check for Insight fragment
     else if (!rareFound && canFindRare && roll < (sceneChance + insightChance) && elementalInsights.length > 0) {
         const relevant = elementalInsights.filter(i => i.element === elementKeyToResearch);
         const unseenRel = relevant.filter(i => !discoveredRepo.insights.has(i.id));
         const anyUnseen = elementalInsights.filter(i => !discoveredRepo.insights.has(i.id));
         const pool = unseenRel.length > 0 ? unseenRel : (anyUnseen.length > 0 ? anyUnseen : relevant);
         if (pool.length > 0) {
             const found = pool[Math.floor(Math.random() * pool.length)];
             if (State.addRepositoryItem('insights', found.id)) {
                 rareFound = true; foundRepoItem = { type: 'insight', ...found };
                 UI.showTemporaryMessage("Insight Fragment Found!", 3500);
                 updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                 updateMilestoneProgress('repositoryContents', null);
                 if(document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent();
             }
         }
     }

    if (rareFound && foundRepoItem) {
        UI.displayResearchResults({ concepts: [], repositoryItems: [foundRepoItem], duplicateInsightGain: 0 }, targetContainerId);
        gainAttunementForAction('researchSpecial', elementKeyToResearch, 1.0);
        return;
    }

    // --- NORMAL CONCEPT DISCOVERY ---
    if (undiscoveredPool.length === 0) {
         if (researchContainerElem && (researchContainerElem.children.length === 0 || researchContainerElem.querySelector('p > i'))) {
             researchContainerElem.innerHTML = '<p><i>The library holds all known concepts.</i></p>';
         }
         gainInsight(5.0, "All Concepts Discovered Bonus");
         return;
    }

    const currentAtt = State.getAttunement()[elementKeyToResearch] || 0;
    const priorityP = []; const secondaryP = []; const tertiaryP = [];
    undiscoveredPool.forEach(c => {
        const score = c.elementScores?.[elementKeyToResearch] || 0; const isPri = c.primaryElement === elementKeyToResearch;
        if (isPri || score >= 7.5) priorityP.push({...c}); else if (score >= 4.5) secondaryP.push({...c}); else tertiaryP.push({...c});
    });
    const selectedOut = []; let dupeGain = 0; const numResults = 3;

    const selectWeighted = () => {
        const pools = [ { pool: priorityP, mult: 3.5 + (currentAtt / 30) }, { pool: secondaryP, mult: 1.5 + (currentAtt / 60) }, { pool: tertiaryP, mult: 0.8 } ];
        let combined = []; let totalW = 0; const attFactor = 1 + (currentAtt / (Config.MAX_ATTUNEMENT * 1.2));
        pools.forEach(({ pool, mult }) => { pool.forEach(card => { let w = 1.0 * mult; if (card.rarity === 'uncommon') w *= (1.3 * attFactor); else if (card.rarity === 'rare') w *= (0.6 * attFactor); else w *= (1.0 * attFactor); w = Math.max(0.1, w); totalW += w; combined.push({ card, w }); }); });
        if (combined.length === 0) return null; let pick = Math.random() * totalW;
        for (let i = 0; i < combined.length; i++) { const item = combined[i]; if (pick < item.w) { [priorityP, secondaryP, tertiaryP].forEach(p => { const idx = p.findIndex(c => c.id === item.card.id); if (idx > -1) p.splice(idx, 1); }); return item.card; } pick -= item.w; }
        const flatP = [...priorityP, ...secondaryP, ...tertiaryP]; if (flatP.length > 0) { const idx = Math.floor(Math.random() * flatP.length); const card = flatP[idx]; [priorityP, secondaryP, tertiaryP].forEach(p => { const i = p.findIndex(c => c.id === card.id); if (i > -1) p.splice(i, 1); }); console.warn("Weighted selection failed, using fallback."); return card; } return null;
    };

    let attempts = 0; const maxAtt = numResults * 4;
    while (selectedOut.length < numResults && attempts < maxAtt && (priorityP.length > 0 || secondaryP.length > 0 || tertiaryP.length > 0)) {
        attempts++; let potential = selectWeighted();
        if (potential) { if (discoveredIds.has(potential.id)) { gainInsight(1.0, `Dupe Research (${potential.name})`); dupeGain += 1.0; } else { if (!selectedOut.some(c => c.id === potential.id)) selectedOut.push(potential); } } else break;
    }

    // Display results
    let msg = ""; // For logging
    if (selectedOut.length > 0) {
        msg = `Discovered ${selectedOut.length} new potential concept(s)! `;
        UI.displayResearchResults({ concepts: selectedOut, repositoryItems: [], duplicateInsightGain: dupeGain }, targetContainerId);
        gainAttunementForAction('researchSuccess', elementKeyToResearch);
        if (selectedOut.some(c => c.rarity === 'rare')) updateMilestoneProgress('discoverRareCard', 1);
    } else {
        msg = "No new concepts found this time. ";
        UI.displayResearchResults({ concepts: [], repositoryItems: [], duplicateInsightGain: dupeGain }, targetContainerId);
        gainAttunementForAction('researchFail', elementKeyToResearch);
    }
    if (dupeGain > 0) msg += ` Gained ${dupeGain.toFixed(0)} Insight from echoes.`;
    console.log(`Research Result: ${msg.trim()}`);
}


// Grimoire Actions
 function addConceptToGrimoireById(conceptId, buttonElement = null) {
    if (State.getDiscoveredConcepts().has(conceptId)) {
        UI.showTemporaryMessage("Already in Grimoire.", 2500);
        if (buttonElement) UI.updateResearchButtonAfterAction(conceptId, 'add');
        return;
    }
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) { console.error("Cannot add concept: Not found. ID:", conceptId); UI.showTemporaryMessage("Error: Concept not found.", 3000); return; }

    const distance = Utils.euclideanDistance(State.getScores(), concept.elementScores);
    if (distance > Config.DISSONANCE_THRESHOLD && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
        console.log(`Dissonance on ${concept.name}. Triggering reflection.`);
        triggerReflectionPrompt('Dissonance', concept.id);
    } else {
        addConceptToGrimoireInternal(conceptId);
    }
 }

function addConceptToGrimoireInternal(conceptId) {
     const conceptToAdd = concepts.find(c => c.id === conceptId);
     if (!conceptToAdd) { console.error("Internal add fail: Not found. ID:", conceptId); return; }
     if (State.getDiscoveredConcepts().has(conceptId)) return;

     console.log(`Adding ${conceptToAdd.name} internally.`);

     if (State.addDiscoveredConcept(conceptId, conceptToAdd)) { // Handles phase check
         let insightReward = Config.CONCEPT_DISCOVERY_INSIGHT[conceptToAdd.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
         let bonusInsight = 0; let synergyMessageShown = false;

         // Synergy Checks
         if (conceptToAdd.relatedIds?.length > 0) {
             const discoveredMap = State.getDiscoveredConcepts();
             const undiscoveredRelated = conceptToAdd.relatedIds.filter(id => !discoveredMap.has(id));
             // Insight Bonus
             for (const relatedId of conceptToAdd.relatedIds) {
                 if (discoveredMap.has(relatedId)) {
                     bonusInsight += Config.SYNERGY_INSIGHT_BONUS;
                     if (!synergyMessageShown) { const relatedConcept = discoveredMap.get(relatedId)?.concept; UI.showTemporaryMessage(`Synergy Bonus: +${Config.SYNERGY_INSIGHT_BONUS.toFixed(1)} Insight (Related to ${relatedConcept?.name || 'known concept'})`, 3500); synergyMessageShown = true; }
                 }
             }
             // Discovery Chance
             if (undiscoveredRelated.length > 0 && Math.random() < Config.SYNERGY_DISCOVERY_CHANCE) {
                 const relatedIdToDiscover = undiscoveredRelated[Math.floor(Math.random() * undiscoveredRelated.length)];
                 const relatedConceptData = concepts.find(c => c.id === relatedIdToDiscover);
                 if (relatedConceptData) { UI.displayResearchResults({ concepts: [relatedConceptData], repositoryItems: [], duplicateInsightGain: 0 }, 'studyResearchDiscoveries'); UI.showTemporaryMessage(`Synergy Resonance: ${conceptToAdd.name} illuminated ${relatedConceptData.name}! Check Discoveries.`, 5000); console.log(`Synergy discovery: Revealed ${relatedConceptData.name}`); }
             }
         }

         insightReward += bonusInsight;
         gainInsight(insightReward, `Discovered ${conceptToAdd.rarity} ${conceptToAdd.name}${bonusInsight > 0 ? ' (Synergy)' : ''}`);
         gainAttunementForAction('addToGrimoire', conceptToAdd.primaryElement, 0.6);
         UI.updateGrimoireCounter();

         // Queue rare prompt
         if (conceptToAdd.rarity === 'rare' && conceptToAdd.uniquePromptId && reflectionPrompts.RareConcept?.[conceptToAdd.uniquePromptId]) {
             if (State.addPendingRarePrompt(conceptToAdd.uniquePromptId)) console.log(`Queued rare prompt ${conceptToAdd.uniquePromptId}`);
         }

         // Update Popup if open
         if (currentlyDisplayedConceptId === conceptId) {
             UI.updateGrimoireButtonStatus(conceptId, false);
             UI.updateFocusButtonStatus(conceptId);
             const discoveredData = State.getDiscoveredConceptData(conceptId);
             UI.updatePopupSellButton(conceptId, conceptToAdd, true, false);
             const currentPhase = State.getOnboardingPhase();
             if (myNotesSection && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) myNotesSection.classList.remove('hidden');
             if (popupEvolutionSection && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED) UI.displayEvolutionSection(conceptToAdd, discoveredData);
         }

         UI.updateResearchButtonAfterAction(conceptId, 'add'); // Remove from Discoveries UI

         // Trigger game systems
         checkTriggerReflectionPrompt('add');
         updateMilestoneProgress('addToGrimoire', 1);
         updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size);
         checkAndUpdateRituals('addToGrimoire');
         UI.refreshGrimoireDisplay();
         UI.showTemporaryMessage(`${conceptToAdd.name} added to Grimoire!`, 3000);

         // Update Study guidance text if still in initial phase
         if (State.getOnboardingPhase() === Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE && studyScreen?.classList.contains('current')) {
              UI.displayStudyScreenContent();
         }
     } else { console.warn(`State addDiscoveredConcept failed for ${conceptToAdd.name}.`); UI.showTemporaryMessage(`Error adding ${conceptToAdd.name}.`, 3000); }
 }

 function handleToggleFocusConcept() { // From Popup
    if (currentlyDisplayedConceptId === null) return;
    const conceptId = currentlyDisplayedConceptId;
    if (!State.getDiscoveredConcepts().has(conceptId)) { UI.showTemporaryMessage("Add to Grimoire before Focusing.", 3000); return; }
    const result = State.toggleFocusConcept(conceptId); // Handles state, save, phase check
    handleFocusToggleResult(result, conceptId);
    UI.updateFocusButtonStatus(conceptId); // Update popup button state
}

 function handleCardFocusToggle(conceptId) { // From Card
    if (isNaN(conceptId)) return;
    const result = State.toggleFocusConcept(conceptId); // Handles state, save, phase check
    handleFocusToggleResult(result, conceptId);
}

function handleFocusToggleResult(result, conceptId) {
    const conceptName = State.getDiscoveredConceptData(conceptId)?.concept?.name || `ID ${conceptId}`;
    if (result === 'not_discovered') { UI.showTemporaryMessage("Concept not in Grimoire.", 3000); }
    else if (result === 'slots_full') { UI.showTemporaryMessage(`Focus slots full (${State.getFocusSlots()}).`, 3000); }
    else { // 'added' or 'removed'
        if (result === 'removed') { UI.showTemporaryMessage(`${conceptName} removed from Focus.`, 2500); checkAndUpdateRituals('removeFocus'); }
        else { // added
            UI.showTemporaryMessage(`${conceptName} marked as Focus!`, 2500); gainInsight(1.0, `Focused on ${conceptName}`);
            const concept = State.getDiscoveredConceptData(conceptId)?.concept; if (concept?.primaryElement) gainAttunementForAction('markFocus', concept.primaryElement, 1.0);
            updateMilestoneProgress('markFocus', 1); updateMilestoneProgress('focusedConcepts.size', State.getFocusedConcepts().size); checkAndUpdateRituals('markFocus');
            // Check phase AFTER toggleFocusConcept advances it
            if (State.getOnboardingPhase() === Config.ONBOARDING_PHASE.REFLECTION_RITUALS && State.getFocusedConcepts().size === 1) { UI.showTemporaryMessage("Focus Set! Visit the Persona screen to see your Tapestry.", 4000, true); }
        }
        // Update relevant UI sections
        UI.refreshGrimoireDisplay(); UI.displayFocusedConceptsPersona(); calculateTapestryNarrative(true); UI.generateTapestryNarrative(); UI.synthesizeAndDisplayThemesPersona(); checkForFocusUnlocks(); UI.updateTapestryDeepDiveButton(); UI.updateSuggestSceneButtonState();
        // Update popup button if this concept's popup is open
        if (currentlyDisplayedConceptId === conceptId) UI.updateFocusButtonStatus(conceptId);
    }
}

 function handleSellConcept(event) {
     const button = event.target.closest('button'); if (!button) return;
     const conceptId = parseInt(button.dataset.conceptId); const context = button.dataset.context; // 'grimoire', 'research', 'discovery'
     if (isNaN(conceptId) || !context) { console.error("Invalid sell data:", button.dataset); return; }
     sellConcept(conceptId, context);
}

function sellConcept(conceptId, context) {
    if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.STUDY_INSIGHT) { UI.showTemporaryMessage("Unlock Selling later in progression.", 3000); return; }
    const discovered = State.getDiscoveredConceptData(conceptId); const concept = discovered?.concept || concepts.find(c => c.id === conceptId);
    if (!concept) { console.error(`Sell fail: Not found ${conceptId}`); UI.showTemporaryMessage("Error selling.", 3000); return; }
    let val = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellVal = val * Config.SELL_INSIGHT_FACTOR; const sourceLoc = context === 'grimoire' ? 'Grimoire' : 'Research Notes';
    if (confirm(`Sell '${concept.name}' (${concept.rarity}) from ${sourceLoc} for ${sellVal.toFixed(1)} Insight?`)) {
        gainInsight(sellVal, `Sold: ${concept.name}`); updateMilestoneProgress('sellConcept', 1);
        let focusChanged = false;
        if (context === 'grimoire') { focusChanged = State.getFocusedConcepts().has(conceptId); if(!State.removeDiscoveredConcept(conceptId)) console.warn(`Failed to remove ${conceptId} from state during sell.`); UI.updateGrimoireCounter(); UI.refreshGrimoireDisplay(); }
        else if (context === 'research' || context === 'discovery') { UI.updateResearchButtonAfterAction(conceptId, 'sell'); }
        if (focusChanged) { UI.displayFocusedConceptsPersona(); calculateTapestryNarrative(true); UI.generateTapestryNarrative(); UI.synthesizeAndDisplayThemesPersona(); checkForFocusUnlocks(); UI.updateTapestryDeepDiveButton(); UI.updateSuggestSceneButtonState(); }
        UI.showTemporaryMessage(`Sold ${concept.name} for ${sellVal.toFixed(1)} Insight.`, 2500);
        if (currentlyDisplayedConceptId === conceptId) UI.hidePopups();
    }
}

// --- Reflection Logic ---
 function checkTriggerReflectionPrompt(triggerAction = 'other') {
    const currentState = State.getState();
    if (currentState.promptCooldownActive) return;
    // Reflection only triggers after phase allows it
    if (currentState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) return;

    if (triggerAction === 'add') State.incrementReflectionTrigger();

    const cardsAdded = currentState.cardsAddedSinceLastPrompt;
    const triggerThresh = 3;
    const hasPending = currentState.pendingRarePrompts.length > 0;

    if (hasPending) {
        console.log("Pending rare prompt found.");
        triggerReflectionPrompt('RareConcept'); // Let trigger handle getting the ID
        State.resetReflectionTrigger(true); // Reset count, start cooldown
        startReflectionCooldown();
    }
    else if (cardsAdded >= triggerThresh) {
        console.log("Reflection trigger threshold met.");
        triggerReflectionPrompt('Standard');
        State.resetReflectionTrigger(true); // Reset count, start cooldown
        startReflectionCooldown();
    }
}

function startReflectionCooldown() {
    if (reflectionCooldownTimeout) clearTimeout(reflectionCooldownTimeout);
    State.setPromptCooldownActive(true); // Mark cooldown active in state
    reflectionCooldownTimeout = setTimeout(() => {
        State.clearReflectionCooldown(); // Mark cooldown ended in state (triggers save)
        console.log("Reflection cooldown ended.");
        reflectionCooldownTimeout = null;
    }, 1000 * 60 * 3); // 3 minute cooldown
 }

 function triggerReflectionPrompt(context = 'Standard', targetId = null, category = null) {
    // Reset temp state for this reflection instance
    currentReflectionContext = context;
    reflectionTargetConceptId = (context === 'Dissonance') ? targetId : null;
    currentReflectionCategory = category; // Used for Standard/Guided context
    currentPromptId = null; // Will be set if prompt is found

    let promptPool = [];
    let title = "Moment for Reflection";
    let promptCatLabel = "General"; // Display label for the prompt source
    let selPrompt = null;
    let showNudge = false;
    let reward = 5.0; // Default reward

    console.log(`Trigger reflection: Context=${context}, Target=${targetId}, Category=${category}`);

    // 1. Check for pending Rare prompts first (unless Dissonance/Scene)
    if (context !== 'Dissonance' && context !== 'SceneMeditation') {
        const nextRareId = State.getNextRarePrompt(); // Removes from state if found
        if (nextRareId) {
            selPrompt = reflectionPrompts.RareConcept?.[nextRareId];
            if (selPrompt) {
                currentReflectionContext = 'RareConcept'; // Override context
                title = "Rare Concept Reflection";
                const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === nextRareId);
                promptCatLabel = cEntry ? cEntry[1].concept.name : "Rare Concept";
                currentPromptId = selPrompt.id;
                reward = 7.0;
                console.log(`Displaying Rare reflection: ${nextRareId}`);
            } else { console.warn(`Rare prompt text missing: ${nextRareId}`); currentReflectionContext = 'Standard'; } // Fallback
        }
    }

    // 2. If no rare prompt selected, determine pool based on context
    if (!selPrompt) {
        if (context === 'Dissonance' && targetId) {
            title = "Dissonance Reflection";
            const concept = concepts.find(c => c.id === targetId);
            promptCatLabel = concept ? concept.name : "Dissonant";
            promptPool = reflectionPrompts.Dissonance || [];
            showNudge = true;
        } else if (context === 'Guided' && category) {
            title = "Guided Reflection";
            promptCatLabel = category; // Use passed category
            promptPool = reflectionPrompts.Guided?.[category] || [];
            reward = Config.GUIDED_REFLECTION_COST + 2;
        } else if (context === 'SceneMeditation' && targetId) { // TargetId here is the sceneId
            const scene = sceneBlueprints.find(s => s.id === targetId);
            if (scene?.reflectionPromptId) {
                selPrompt = reflectionPrompts.SceneMeditation?.[scene.reflectionPromptId]; // Select scene prompt *directly*
                if (selPrompt) {
                    title = "Scene Meditation"; promptCatLabel = scene.name; currentPromptId = selPrompt.id;
                    reward = (scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5;
                } else { console.warn(`Scene prompt ${scene.reflectionPromptId} missing.`); currentReflectionContext = 'Standard'; } // Fallback
            } else { console.warn(`Scene ${targetId} or prompt ID missing.`); currentReflectionContext = 'Standard'; } // Fallback
        }
        else { // Standard context (or fallback from other contexts)
             currentReflectionContext = 'Standard'; // Ensure context is set
             title = "Standard Reflection";
             const attune = State.getAttunement();
             const validElements = Object.entries(attune).filter(([k, v]) => v > 0).sort(([,a], [,b]) => b - a);
             if (validElements.length > 0) {
                 const topTier = validElements.slice(0, Math.ceil(validElements.length / 2));
                 const poolToChooseFrom = topTier.length > 0 ? topTier : validElements;
                 const [selKey] = poolToChooseFrom[Math.floor(Math.random() * poolToChooseFrom.length)];
                 const selName = elementKeyToFullName[selKey];
                 promptPool = reflectionPrompts[selName] || [];
                 promptCatLabel = elementDetails[selName]?.name || selName;
                 currentReflectionCategory = selName; // Store the selected category for Standard
             } else { promptPool = []; console.warn("No attunement > 0 for Standard reflection."); }
        }
    }

    // 3. Select from pool if needed (Standard, Guided, Dissonance)
    if (!selPrompt && promptPool.length > 0) {
        const seen = State.getState().seenPrompts;
        const available = promptPool.filter(p => !seen.has(p.id));
        selPrompt = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : promptPool[Math.floor(Math.random() * promptPool.length)];
        currentPromptId = selPrompt.id; // Set prompt ID here
    }

    // 4. Display or handle failure
    if (selPrompt && currentPromptId) {
        const pData = { title, category: promptCatLabel, prompt: selPrompt, showNudge, reward };
        UI.displayReflectionPrompt(pData, currentReflectionContext);
    } else {
        // Error handling moved inside displayReflectionPrompt to handle Dissonance fallback
        UI.displayReflectionPrompt(null, context); // Call with null data to trigger fallback
        clearPopupState(); // Ensure temp state is cleared on failure
    }
}

 function handleConfirmReflection(nudgeAllowed) {
    const checkbox = document.getElementById('reflectionCheckbox'); // Get checkbox state directly
    if (!currentPromptId || !checkbox || !checkbox.checked) {
         console.error("Reflection not confirmed or prompt ID missing."); return;
    }

    console.log(`Reflection confirmed: Context=${currentReflectionContext}, Prompt=${currentPromptId}, Nudge=${nudgeAllowed}`);
    State.addSeenPrompt(currentPromptId); // Mark prompt as seen

    // Determine Reward and Attunement gain based on context
    let rewardAmt = 5.0; let attuneKey = null; let attuneAmt = 1.0; let milestoneAct = 'completeReflection';
    if (currentReflectionContext === 'Guided') rewardAmt = Config.GUIDED_REFLECTION_COST + 2;
    else if (currentReflectionContext === 'RareConcept') rewardAmt = 7.0;
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); rewardAmt = (scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; }

    // Handle Dissonance specific logic (Score Nudge & Concept Addition)
    if (currentReflectionContext === 'Dissonance') {
        milestoneAct = 'completeReflectionDissonance'; attuneAmt = 0.5; // Possibly reduced gain
        if (nudgeAllowed && reflectionTargetConceptId) {
             console.log("Processing score nudge for Dissonance...");
             const concept = concepts.find(c => c.id === reflectionTargetConceptId);
             const scores = State.getScores(); let nudged = false;
             if (concept?.elementScores) {
                 const newScores = { ...scores };
                 for (const key in scores) {
                     if (scores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) {
                         const uScore = scores[key]; const cScore = concept.elementScores[key];
                         const diff = cScore - uScore;
                         if (Math.abs(diff) > 1.5) { // Nudge only if difference is significant
                             const nudgeVal = Math.sign(diff) * Config.SCORE_NUDGE_AMOUNT;
                             newScores[key] = Math.max(0, Math.min(10, uScore + nudgeVal));
                             if (newScores[key] !== uScore) nudged = true;
                         }
                     }
                 }
                 if (nudged) {
                     State.updateScores(newScores); // Update scores in state
                     console.log("Nudged Scores:", State.getScores());
                     UI.displayPersonaScreen(); // Refresh Persona screen if visible
                     UI.showTemporaryMessage("Core understanding shifted slightly.", 3500);
                     gainAttunementForAction('scoreNudge', 'All', 0.5);
                     updateMilestoneProgress('scoreNudgeApplied', 1);
                 }
             } else { console.warn(`Cannot apply nudge, concept data missing for ID ${reflectionTargetConceptId}`); }
         }
         // Add the concept AFTER reflection is confirmed
         if (reflectionTargetConceptId) {
             addConceptToGrimoireInternal(reflectionTargetConceptId);
         }
    }

    // Grant Insight
    gainInsight(rewardAmt, `Reflection (${currentReflectionContext || 'Unknown'})`);

    // Determine Attunement Key based on context
    if (currentReflectionContext === 'Standard' && currentReflectionCategory) { attuneKey = elementNameToKey[currentReflectionCategory]; }
    else if (currentReflectionContext === 'RareConcept') { const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId); attuneKey = cEntry ? cEntry[1].concept.primaryElement : null; }
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); attuneKey = scene?.element || null; }
    // 'Guided' and 'Dissonance' fall through to generic gain unless key determined above

    // Grant Attunement
    if (attuneKey) gainAttunementForAction('completeReflection', attuneKey, attuneAmt);
    else gainAttunementForAction('completeReflectionGeneric', 'All', 0.2); // Generic gain

    // Update Milestones & Rituals
    updateMilestoneProgress(milestoneAct, 1);
    checkAndUpdateRituals('completeReflection'); // General check
    // Check for rituals specific to this prompt
    const ritualCtxMatch = `${currentReflectionContext}_${currentPromptId}`;
    checkAndUpdateRituals('completeReflection', { contextMatch: ritualCtxMatch });

    // Clean up UI
    UI.hidePopups();
    UI.showTemporaryMessage("Reflection complete! Insight gained.", 3000);
    clearPopupState(); // Clear temporary reflection state
    // Cooldown was started when prompt was initially shown
}

 function triggerGuidedReflection() {
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
         UI.showTemporaryMessage("Unlock Reflection first.", 3000); return;
     }
     if (spendInsight(Config.GUIDED_REFLECTION_COST, "Guided Reflection")) {
         const cats = Object.keys(reflectionPrompts.Guided || {});
         if (cats.length > 0) {
             const cat = cats[Math.floor(Math.random() * cats.length)];
             console.log(`Triggering guided reflection: ${cat}`);
             triggerReflectionPrompt('Guided', null, cat); // Trigger with category
         } else {
             console.warn("No guided reflection categories defined.");
             gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompts");
             UI.showTemporaryMessage("No guided reflections available currently.", 3000);
         }
     }
}

// --- Other Actions ---
 function attemptArtEvolution() {
    if (currentlyDisplayedConceptId === null) return;
    const conceptId = currentlyDisplayedConceptId;
    const discovered = State.getDiscoveredConceptData(conceptId);
    if (!discovered?.concept || discovered.artUnlocked) { UI.showTemporaryMessage("Evolution fail: State error.", 3000); return; }
    const concept = discovered.concept; if (!concept.canUnlockArt) return;

    // Check Phase
    if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) {
         UI.showTemporaryMessage("Unlock the Repository first to enable Evolution.", 3000); return;
    }
    // Check Requirements
    const cost = Config.ART_EVOLVE_COST; const isFocused = State.getFocusedConcepts().has(conceptId); const hasReflected = State.getState().seenPrompts.size > 0;
    if (!isFocused || !hasReflected) { UI.showTemporaryMessage("Check requirements (Focus + Reflection).", 3000); return; }

    if (spendInsight(cost, `Evolve Art: ${concept.name}`)) {
        if (State.unlockArt(conceptId)) { // Handles state update, save, and phase check
            console.log(`Art unlocked for ${concept.name}!`); UI.showTemporaryMessage(`Enhanced Art Unlocked for ${concept.name}!`, 3500);
            if (currentlyDisplayedConceptId === conceptId) UI.showConceptDetailPopup(conceptId); // Refresh popup
            UI.refreshGrimoireDisplay(); // Refresh grimoire card
            gainAttunementForAction('artEvolve', concept.primaryElement, 1.5);
            updateMilestoneProgress('evolveArt', 1); checkAndUpdateRituals('artEvolve');
        } else { console.error(`State unlockArt fail ${concept.name}`); gainInsight(cost, `Refund: Art evolution error`); UI.showTemporaryMessage("Error updating art state.", 3000); }
    }
}

 function handleSaveNote() {
    if (currentlyDisplayedConceptId === null) return;
    const notesTA = document.getElementById('myNotesTextarea'); if (!notesTA) return;
    const noteText = notesTA.value.trim();
    if (State.updateNotes(currentlyDisplayedConceptId, noteText)) { // Handles save
        const status = document.getElementById('noteSaveStatus');
        if (status) { status.textContent = "Saved!"; status.classList.remove('error'); setTimeout(() => { status.textContent = ""; }, 2000); }
    } else {
        const status = document.getElementById('noteSaveStatus');
        if (status) { status.textContent = "Error saving note."; status.classList.add('error'); }
    }
}

 function handleUnlockLibraryLevel(event) {
     const button = event.target.closest('button'); if (!button || button.disabled) return;
     const key = button.dataset.elementKey; const level = parseInt(button.dataset.level);
     if (!key || isNaN(level)) { console.error("Invalid library unlock data"); return; }
     unlockDeepDiveLevel(key, level); // Call the internal logic function
}

// Internal function to handle the unlock logic
function unlockDeepDiveLevel(elementKey, levelToUnlock) {
    const deepDiveData = elementDeepDive[elementKey] || [];
    const levelData = deepDiveData.find(l => l.level === levelToUnlock);
    const currentLevel = State.getState().unlockedDeepDiveLevels[elementKey] || 0;

    if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) { UI.showTemporaryMessage("Unlock the Repository first.", 3000); return; }
    if (!levelData || levelToUnlock !== currentLevel + 1) { console.warn(`Library unlock fail: Invalid level/seq.`); return; }
    const cost = levelData.insightCost || 0;
    if (spendInsight(cost, `Unlock Library: ${elementKeyToFullName[elementKey]} Lv ${levelToUnlock}`)) {
        if (State.unlockLibraryLevel(elementKey, levelToUnlock)) { // Handles state update, save, phase check
            console.log(`Unlocked ${elementKeyToFullName[elementKey]} level ${levelToUnlock}`);
            const targetContainer = document.querySelector(`#personaElementDetails .element-deep-dive-container[data-element-key="${elementKey}"]`);
            if (targetContainer) UI.displayElementDeepDive(elementKey, targetContainer); // Refresh UI section
            else console.warn(`Could not find container ${elementKey} to refresh UI.`);
            UI.showTemporaryMessage(`${elementKeyToFullName[elementKey]} Insight Lv ${levelToUnlock} Unlocked!`, 3000);
            updateMilestoneProgress('unlockLibrary', levelToUnlock); updateMilestoneProgress('unlockedDeepDiveLevels', State.getState().unlockedDeepDiveLevels); checkAndUpdateRituals('unlockLibrary');
        } else { console.error(`State failed unlock library ${elementKey} Lv ${levelToUnlock}`); gainInsight(cost, `Refund: Library unlock error`); }
    }
}

 function handleMeditateScene(event) {
     const button = event.target.closest('button'); if (!button || button.disabled) return;
     const sceneId = button.dataset.sceneId; if (!sceneId) return;
     meditateOnScene(sceneId); // Call internal logic function
}

// Internal logic function for scene meditation
function meditateOnScene(sceneId) {
    const scene = sceneBlueprints.find(s => s.id === sceneId); if (!scene) { console.error(`Scene not found: ${sceneId}`); return; }
    if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) { UI.showTemporaryMessage("Unlock the Repository first.", 3000); return; }
    const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
    if (spendInsight(cost, `Meditate: ${scene.name}`)) {
        if (scene.reflectionPromptId) {
            console.log(`Triggering Scene Meditation: ${scene.name}`);
            triggerReflectionPrompt('SceneMeditation', sceneId); // Pass sceneId as target for context
            updateMilestoneProgress('meditateScene', 1);
        } else { console.error(`Prompt ID missing for scene ${sceneId}`); gainInsight(cost, `Refund: Missing scene prompt`); UI.showTemporaryMessage("Meditation fail: Reflection prompt not found.", 3000); }
    }
}

 function handleAttemptExperiment(event) {
     const button = event.target.closest('button'); if (!button || button.disabled) return;
     const expId = button.dataset.experimentId; if (!expId) return;
     attemptExperiment(expId); // Call internal logic
}

// Internal logic for attempting experiments
function attemptExperiment(experimentId) {
     const exp = alchemicalExperiments.find(e => e.id === experimentId); if (!exp) { console.warn(`Experiment ${experimentId} not found.`); return; }
     if (State.getRepositoryItems().experiments.has(experimentId)) { UI.showTemporaryMessage("Experiment already completed.", 2500); return; }
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) { UI.showTemporaryMessage("Unlock the Repository first.", 3000); return; }

     // Check Requirements
     const attune = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();
     if (attune[exp.requiredElement] < exp.requiredAttunement) { UI.showTemporaryMessage("Attunement too low.", 3000); return; }
     let canAttempt = true; let unmetReqs = [];
     if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } }
     if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let met = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { met = true; break; } } if (!met) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } }
     if (!canAttempt) { UI.showTemporaryMessage(`Requires Focus: ${unmetReqs.join(', ')}`, 3000); return; }

     // Attempt Spend
     const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST;
     if (!spendInsight(cost, `Attempt Exp: ${exp.name}`)) return;

     // --- Experiment Attempt ---
     console.log(`Attempting experiment: ${exp.name}`); updateMilestoneProgress('attemptExperiment', 1); const roll = Math.random(); const success = roll < (exp.successRate || 0.5);
     if (success) {
         console.log("Exp Success!"); UI.showTemporaryMessage(`Success! '${exp.name}' yielded results.`, 4000);
         State.addRepositoryItem('experiments', exp.id); // Mark as completed
         if (exp.successReward) {
             if (exp.successReward.type === 'insight') gainInsight(exp.successReward.amount, `Exp Success: ${exp.name}`);
             if (exp.successReward.type === 'attunement') gainAttunementForAction('experimentSuccess', exp.successReward.element || 'All', exp.successReward.amount);
             if (exp.successReward.type === 'insightFragment') {
                 if (State.addRepositoryItem('insights', exp.successReward.id)) { console.log(`Exp reward: Insight ${exp.successReward.id}`); updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); }
             }
         }
         updateMilestoneProgress('repositoryContents', null); // Check aggregate milestone
     } else { // Failure
         console.log("Exp Failed."); UI.showTemporaryMessage(`Experiment '${exp.name}' failed... ${exp.failureConsequence || "No lasting effects."}`, 4000);
         if (exp.failureConsequence?.includes("Insight loss")) { const loss = parseFloat(exp.failureConsequence.match(/(\d+(\.\d+)?)/)?.[0] || 1); gainInsight(-loss, `Exp Failure: ${exp.name}`); }
         else if (exp.failureConsequence?.includes("attunement decrease")) { const key = exp.requiredElement; if (key) { if(State.updateAttunement(key, -1.0)) UI.displayElementAttunement(); } }
     }
     UI.displayRepositoryContent(); // Refresh Repo UI
}

// --- Suggest Scenes ---
 function handleSuggestSceneClick() {
     const focused = State.getFocusedConcepts();
     const suggestionOutputDiv = document.getElementById('sceneSuggestionOutput');
     const suggestedSceneContentDiv = document.getElementById('suggestedSceneContent');

     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) { UI.showTemporaryMessage("Unlock the main interface first.", 3000); return; }
     if (focused.size === 0) { UI.showTemporaryMessage("Focus on concepts first to suggest relevant scenes.", 3000); return; }
     const cost = Config.SCENE_SUGGESTION_COST;
     if (!spendInsight(cost, "Suggest Scene")) return;

     console.log("Suggesting scenes based on focus...");
     const { focusScores } = calculateFocusScores();
     const discoveredScenes = State.getRepositoryItems().scenes;
     const sortedElements = Object.entries(focusScores).filter(([key, score]) => score > 4.0).sort(([, a], [, b]) => b - a);
     const topElements = sortedElements.slice(0, 2).map(([key]) => key);
     if (topElements.length === 0 && sortedElements.length > 0) topElements.push(sortedElements[0][0]);
     else if (topElements.length === 0) { UI.showTemporaryMessage("Focus is too broad/weak to suggest scenes.", 3000); gainInsight(cost, "Refund: Scene Suggestion Fail"); return; }

     const relevantUndiscovered = sceneBlueprints.filter(scene => topElements.includes(scene.element) && !discoveredScenes.has(scene.id));
     if (relevantUndiscovered.length === 0) { UI.showTemporaryMessage("All relevant scenes for this focus discovered. Check Repository.", 3500); }
     else {
         const selectedScene = relevantUndiscovered[Math.floor(Math.random() * relevantUndiscovered.length)];
         if (State.addRepositoryItem('scenes', selectedScene.id)) { // Handles save & phase check
             console.log(`Suggested Scene: ${selectedScene.name}`);
             if (suggestionOutputDiv) suggestionOutputDiv.classList.add('hidden');
             if (suggestedSceneContentDiv) suggestedSceneContentDiv.innerHTML = '';
             if (suggestionOutputDiv && suggestedSceneContentDiv) {
                  const sceneCost = selectedScene.meditationCost || Config.SCENE_MEDITATION_BASE_COST; const canAfford = State.getInsight() >= sceneCost;
                  const sceneElement = UI.renderRepositoryItem(selectedScene, 'scene', sceneCost, canAfford);
                  suggestedSceneContentDiv.appendChild(sceneElement); suggestionOutputDiv.classList.remove('hidden');
                  UI.showTemporaryMessage(`Scene Suggested: '${selectedScene.name}'! See details below.`, 4000);
             } else { console.error("Scene suggestion UI elements missing!"); }
             if (document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent();
             updateMilestoneProgress('repositoryContents', null);
         } else { console.error(`Failed to add scene ${selectedScene.id} to state.`); gainInsight(cost, "Refund: Scene Suggestion Error"); UI.showTemporaryMessage("Error suggesting scene.", 3000); }
     }
 }

// --- Rituals & Milestones Logic (Helper) ---
 function checkAndUpdateRituals(action, details = {}) {
    let ritualCompletedThisCheck = false;
    const currentState = State.getState();
    if (currentState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) return; // Check phase

    const completedToday = currentState.completedRituals.daily || {};
    const focused = currentState.focusedConcepts;
    let currentRitualPool = [...dailyRituals];
    if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || !Array.isArray(ritual.requiredFocusIds) || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFoc = true; for (const id of reqIds) { if (!focused.has(id)) { allFoc = false; break; } } if (allFoc) currentRitualPool.push({ ...ritual, isFocusRitual: true, period: 'daily' }); }); }

    currentRitualPool.forEach(ritual => {
        const completedData = completedToday[ritual.id] || { completed: false, progress: 0 }; if (completedData.completed) return;
        const actionMatch = ritual.track.action === action;
        const contextMatches = ritual.track.contextMatch ? (details.contextMatch === ritual.track.contextMatch) : false;

        if (actionMatch || contextMatches) {
            const progress = State.completeRitualProgress(ritual.id, 'daily');
            const requiredCount = ritual.track.count || 1;
            if (progress >= requiredCount) {
                console.log(`Ritual Completed: ${ritual.description}`); State.markRitualComplete(ritual.id, 'daily');
                ritualCompletedThisCheck = true;
                if (ritual.reward) {
                    if (ritual.reward.type === 'insight') gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`);
                    else if (ritual.reward.type === 'attunement') gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0);
                    else if (ritual.reward.type === 'token') console.log(`TODO: Grant ${ritual.reward.tokenType || 'Ritual'} token`);
                }
            }
        }
    });
    if (ritualCompletedThisCheck) UI.displayDailyRituals(); // Refresh UI if needed
}

 function updateMilestoneProgress(trackType, currentValue) {
     let milestoneAchievedThisUpdate = false;
     const achievedSet = State.getState().achievedMilestones;
     if (!(achievedSet instanceof Set)) { console.error("CRITICAL ERROR: gameState.achievedMilestones is not a Set!"); return; }

     milestones.forEach(m => {
         if (!achievedSet.has(m.id)) { // Only check unachieved milestones
             let achieved = false; const threshold = m.track.threshold; let checkValue = null;

             // Check based on action count
             if (m.track.action === trackType) {
                 if (typeof currentValue === 'number' && currentValue >= (m.track.count || 1)) achieved = true;
                 else if ((m.track.count === 1 || !m.track.count) && currentValue) achieved = true; // Handle simple flag actions
             }
             // Check based on state value
             else if (m.track.state === trackType) {
                 const att = State.getAttunement(); const lvls = State.getState().unlockedDeepDiveLevels; const discSize = State.getDiscoveredConcepts().size; const focSize = State.getFocusedConcepts().size; const insCount = State.getRepositoryItems().insights.size; const slots = State.getFocusSlots();

                 if (trackType === 'elementAttunement') {
                     // Check specific element threshold if defined in milestone
                     if (m.track.element && att.hasOwnProperty(m.track.element)) {
                          // Check against the specific value passed OR the current state value
                          const valueToCheck = (typeof currentValue === 'object' && currentValue !== null && currentValue.hasOwnProperty(m.track.element)) ? currentValue[m.track.element] : att[m.track.element];
                          if(valueToCheck >= threshold) achieved = true;
                     }
                     // Check aggregate conditions (any/all)
                     else if (m.track.condition === 'any') { achieved = Object.values(att).some(v => v >= threshold); }
                     else if (m.track.condition === 'all') { achieved = Object.values(att).every(v => v >= threshold); }
                 }
                 else if (trackType === 'unlockedDeepDiveLevels') {
                      const levelsToCheck = (typeof currentValue === 'object' && currentValue !== null) ? currentValue : lvls; // Use passed value if obj, else state
                      if (m.track.condition === 'any') achieved = Object.values(levelsToCheck).some(v => v >= threshold);
                      else if (m.track.condition === 'all') achieved = Object.values(levelsToCheck).every(v => v >= threshold);
                 }
                 else if (trackType === 'discoveredConcepts.size') checkValue = discSize;
                 else if (trackType === 'focusedConcepts.size') checkValue = focSize;
                 else if (trackType === 'repositoryInsightsCount') checkValue = insCount;
                 else if (trackType === 'focusSlotsTotal') checkValue = slots;
                 else if (trackType === 'repositoryContents' && m.track.condition === "allTypesPresent") { // Custom check
                      const i = State.getRepositoryItems(); achieved = i.scenes.size > 0 && i.experiments.size > 0 && i.insights.size > 0;
                 }
                 // Check simple threshold if applicable
                 if (!achieved && checkValue !== null && typeof checkValue === 'number' && checkValue >= threshold) achieved = true;
             }

             // Grant reward if achieved
             if (achieved) {
                 if (State.addAchievedMilestone(m.id)) { // Add to state (handles save & phase check)
                     console.log("Milestone Achieved!", m.description); milestoneAchievedThisUpdate = true;
                     UI.displayMilestones(); // Update repository UI if visible
                     UI.showMilestoneAlert(m.description); // Show alert
                     // Grant Reward
                     if (m.reward) {
                         if (m.reward.type === 'insight') gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`);
                         else if (m.reward.type === 'attunement') gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0);
                         else if (m.reward.type === 'increaseFocusSlots') { const inc = m.reward.amount || 1; if (State.increaseFocusSlots(inc)) { UI.updateFocusSlotsDisplay(); updateMilestoneProgress('focusSlotsTotal', State.getFocusSlots()); } } // Trigger check for milestones based on new slot count
                         else if (m.reward.type === 'discoverCard') { const cId = m.reward.cardId; if (cId && !State.getDiscoveredConcepts().has(cId)) { const cDisc = concepts.find(c => c.id === cId); if (cDisc) { addConceptToGrimoireInternal(cId); UI.showTemporaryMessage(`Milestone Reward: Discovered ${cDisc.name}!`, 3500); } } }
                     }
                 }
             }
         }
     });
}

// --- Daily Login ---
 function checkForDailyLogin() {
    const today = new Date().toDateString();
    const last = State.getState().lastLoginDate;
    if (last !== today) {
        console.log("First login of the day detected.");
        State.resetDailyRituals(); // Resets daily rituals, sets flag, updates date (triggers save)
        gainInsight(5.0, "Daily Login Bonus");
        UI.showTemporaryMessage("Daily Rituals Reset. Free Research Available!", 3500);
        UI.displayDailyRituals(); // Refresh ritual display
    } else {
        console.log("Already logged in today.");
    }
    // Refresh buttons that depend on daily state
    if(State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
        UI.displayResearchButtons();
    }
}

// --- Persona Calculation Logic Helpers ---
 function calculateFocusScores() {
     const scores = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
     const focused = State.getFocusedConcepts();
     const disc = State.getDiscoveredConcepts();
     const count = focused.size;
     if (count > 0) {
         focused.forEach(id => {
             const data = disc.get(id);
             if (data?.concept?.elementScores) {
                 for (const key in scores) {
                     if (data.concept.elementScores.hasOwnProperty(key)) {
                         scores[key] += data.concept.elementScores[key];
                     }
                 }
             }
         });
         for (const key in scores) { scores[key] /= count; } // Calculate average
     }
     return { focusScores: scores, focusCount: count };
}

 function calculateTapestryNarrative(forceRecalculate = false) {
    const stateHash = State.getCurrentFocusSetHash();
    // Use cached analysis if hash matches and not forced
    if (currentTapestryAnalysis && !forceRecalculate && currentTapestryAnalysis.focusHash === stateHash) {
        return currentTapestryAnalysis.fullNarrativeHTML;
    }

    const focused = State.getFocusedConcepts();
    const focusCount = focused.size;
    if (focusCount === 0) {
        currentTapestryAnalysis = null;
        return 'Mark concepts as "Focus" from the Grimoire to weave your narrative.';
    }

    const disc = State.getDiscoveredConcepts();
    const { focusScores } = calculateFocusScores();
    const analysis = {
        focusHash: stateHash, // Store the hash this analysis is based on
        dominantElements: [], elementThemes: [], dominantCardTypes: [],
        cardTypeThemes: [], synergies: [], tensions: [], essenceTitle: "Balanced",
        balanceComment: "", fullNarrativeRaw: "", fullNarrativeHTML: ""
    };

    // Analyze dominant elements
    const sortedElements = Object.entries(focusScores)
        .filter(([k, s]) => s > 3.5) // Filter elements with significant average score
        .sort(([, a], [, b]) => b - a);

    if (sortedElements.length > 0) {
        analysis.dominantElements = sortedElements.map(([key, score]) => ({ key: key, name: elementDetails[elementKeyToFullName[key]]?.name || key, score: score }));
        // Determine element themes based on top 1-3 elements
        const topElementKeys = analysis.dominantElements.slice(0, 3).map(e => e.key).sort().join('');
        const themeKey = topElementKeys.length > 1 ? topElementKeys : (topElementKeys.length === 1 ? analysis.dominantElements[0].key : null);
        if (themeKey && elementInteractionThemes && elementInteractionThemes[themeKey]) { analysis.elementThemes.push(elementInteractionThemes[themeKey]); }
        else if (analysis.dominantElements.length > 0) { analysis.elementThemes.push(`a strong emphasis on **${analysis.dominantElements[0].name}**.`); }

        // Determine essence title
        if (analysis.dominantElements.length >= 2 && analysis.dominantElements[0].score > 6.5 && analysis.dominantElements[1].score > 5.5) { analysis.essenceTitle = `${analysis.dominantElements[0].name}/${analysis.dominantElements[1].name} Blend`; }
        else if (analysis.dominantElements.length >= 1 && analysis.dominantElements[0].score > 6.5) { analysis.essenceTitle = `${analysis.dominantElements[0].name} Focus`; }
        else { analysis.essenceTitle = "Developing Focus"; }
    } else { analysis.essenceTitle = "Balanced Focus"; }

    // Analyze dominant card types
    const typeCounts = {}; cardTypeKeys.forEach(type => typeCounts[type] = 0);
    focused.forEach(id => { const type = disc.get(id)?.concept?.cardType; if (type && typeCounts.hasOwnProperty(type)) { typeCounts[type]++; } });
    analysis.dominantCardTypes = Object.entries(typeCounts).filter(([type, count]) => count > 0).sort(([, a], [, b]) => b - a).map(([type, count]) => ({ type, count }));
    if (analysis.dominantCardTypes.length > 0) { const topType = analysis.dominantCardTypes[0].type; if (cardTypeThemes && cardTypeThemes[topType]) { analysis.cardTypeThemes.push(cardTypeThemes[topType]); } }

    // Analyze synergies
    const checkedPairs = new Set();
    focused.forEach(idA => {
        const conceptA = disc.get(idA)?.concept; if (!conceptA?.relatedIds) return;
        focused.forEach(idB => {
            if (idA === idB) return; const pairKey = [idA, idB].sort().join('-'); if (checkedPairs.has(pairKey)) return;
            if (conceptA.relatedIds.includes(idB)) { const conceptB = disc.get(idB)?.concept; if (conceptB) { analysis.synergies.push({ concepts: [conceptA.name, conceptB.name], text: `The connection between **${conceptA.name}** and **${conceptB.name}** suggests a reinforcing dynamic.` }); } } checkedPairs.add(pairKey);
        });
    });

    // Analyze tensions
    const highThreshold = 7.0; const lowThreshold = 3.0;
    const focusConceptsData = Array.from(focused).map(id => disc.get(id)?.concept).filter(Boolean);
    if (focusConceptsData.length >= 2) {
         for (const key of Object.keys(elementNameToKey)) {
               const elementName = elementKeyToFullName[key];
               let hasHigh = focusConceptsData.some(c => c.elementScores?.[key] >= highThreshold); let hasLow = focusConceptsData.some(c => c.elementScores?.[key] <= lowThreshold);
               if (hasHigh && hasLow) { const highConcepts = focusConceptsData.filter(c => c.elementScores?.[key] >= highThreshold).map(c => c.name); const lowConcepts = focusConceptsData.filter(c => c.elementScores?.[key] <= lowThreshold).map(c => c.name); analysis.tensions.push({ element: elementName, text: `A potential tension exists within **${elementName}**: concepts like **${highConcepts.join(', ')}** lean high, while **${lowConcepts.join(', ')}** lean low.` }); }
         }
    }

    // Analyze balance
    const scores = Object.values(focusScores); const minScore = Math.min(...scores); const maxScore = Math.max(...scores); const range = maxScore - minScore;
    if (range <= 2.5 && focusCount > 2) analysis.balanceComment = "The focused elements present a relatively balanced profile.";
    else if (range >= 5.0 && focusCount > 2) analysis.balanceComment = "There's a notable range in elemental emphasis within your focus.";

    // Assemble Narrative
    let narrative = `Current Essence: **${analysis.essenceTitle}**. `;
    if (analysis.dominantElements.length > 0) narrative += `Your tapestry currently resonates with ${analysis.elementThemes.join(' ')} `;
    else narrative += "Your focus presents a unique and subtle balance. ";
    if (analysis.dominantCardTypes.length > 0) narrative += `The lean towards ${analysis.cardTypeThemes.join(' ')} shapes the expression. `;
    if (analysis.balanceComment) narrative += analysis.balanceComment + " ";
    analysis.synergies.forEach(syn => { narrative += syn.text + " "; });
    analysis.tensions.forEach(ten => { narrative += ten.text + " "; });

    analysis.fullNarrativeRaw = narrative.trim();
    analysis.fullNarrativeHTML = analysis.fullNarrativeRaw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Cache the result
    currentTapestryAnalysis = analysis;
    console.log("Recalculated Tapestry Analysis:", currentTapestryAnalysis);
    return analysis.fullNarrativeHTML;
 }

 function calculateFocusThemes() { // Used by UI
     const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); if (focused.size === 0) return [];
     const counts = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const thresh = 7.0; // Threshold for counting towards theme
     focused.forEach(id => { const concept = disc.get(id)?.concept; if (concept?.elementScores) { for (const key in concept.elementScores) { if (elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= thresh) counts[key]++; } } });
     // Sort themes by count, descending
     const sorted = Object.entries(counts).filter(([k, c]) => c > 0 && elementDetails[elementKeyToFullName[k]]).sort(([, a], [, b]) => b - a).map(([k, c]) => ({ key: k, name: elementDetails[elementKeyToFullName[k]]?.name || k, count: c })); return sorted;
}

// --- Focus Unlocks ---
 function checkForFocusUnlocks(silent = false) {
     // Only check if phase allows (Repository phase)
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) return;

     console.log("Checking focus unlocks..."); let newlyUnlocked = false;
     const focused = State.getFocusedConcepts(); const unlocked = State.getUnlockedFocusItems();

     focusDrivenUnlocks.forEach(unlock => {
         if (unlocked.has(unlock.id)) return; // Skip already unlocked

         // Check if requirements are met
         let met = true;
         if (!unlock.requiredFocusIds || unlock.requiredFocusIds.length === 0) met = false;
         else { for (const reqId of unlock.requiredFocusIds) { if (!focused.has(reqId)) { met = false; break; } } }

         if (met) {
             console.log(`Met reqs for ${unlock.id}`);
             if (State.addUnlockedFocusItem(unlock.id)) { // Add to state (handles save)
                 newlyUnlocked = true;
                 const item = unlock.unlocks; let name = item.name || `ID ${item.id}`; let notif = unlock.description || `Unlocked ${name}`;

                 // Add item to repository state if applicable
                 if (item.type === 'scene') { if (State.addRepositoryItem('scenes', item.id)) { console.log(`Unlocked Scene: ${name}`); notif += ` View in Repo.`; } else notif += ` (Already Discovered)`; }
                 else if (item.type === 'experiment') { console.log(`Unlocked Exp: ${name}.`); notif += ` Check Repo.`; } // Don't add to completed experiments
                 else if (item.type === 'insightFragment') { if (State.addRepositoryItem('insights', item.id)) { const iData = elementalInsights.find(i => i.id === item.id); name = iData ? `"${iData.text}"` : `ID ${item.id}`; console.log(`Unlocked Insight: ${item.id}`); notif += ` View in Repo.`; updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); } else notif += ` (Already Discovered)`; }

                 if (!silent) UI.showTemporaryMessage(`Focus Synergy: ${notif}`, 5000, true); // Use guidance style toast?
                 updateMilestoneProgress('repositoryContents', null); // Check relevant milestones
             }
         }
     });

     // Refresh UI if unlocks occurred and relevant screen is visible
     if (newlyUnlocked && !silent) {
         console.log("New Focus Unlocks:", Array.from(State.getUnlockedFocusItems()));
         if (document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent();
         if (document.getElementById('personaScreen')?.classList.contains('current')) UI.generateTapestryNarrative(); // Update narrative potentially
     }
}

// --- Tapestry Deep Dive Logic ---
 function showTapestryDeepDive() {
    // Check phase
    if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE) { // Requires Phase 1
        UI.showTemporaryMessage("Explore your Persona first.", 3000); return;
    }
    if (State.getFocusedConcepts().size === 0) {
        UI.showTemporaryMessage("Focus on concepts first to explore the tapestry.", 3000); return;
    }
    // Ensure analysis is up-to-date
    calculateTapestryNarrative(true); // Force recalculate
    if (!currentTapestryAnalysis) { console.error("Failed to generate tapestry analysis for Deep Dive."); UI.showTemporaryMessage("Error analyzing Tapestry.", 3000); return; }
    UI.displayTapestryDeepDive(currentTapestryAnalysis);
}

 function handleDeepDiveNodeClick(nodeId) {
    if (!currentTapestryAnalysis) { console.error("Deep Dive Node Click: Analysis missing."); UI.updateDeepDiveContent("<p>Error: Analysis data unavailable.</p>", nodeId); return; }
    console.log(`Logic: Handling Deep Dive node click: ${nodeId}`);
    let content = `<p><em>Analysis for '${nodeId}'...</em></p>`;
    try {
        switch (nodeId) {
            case 'elemental': content = `<h4>Elemental Resonance Breakdown</h4>`; if(currentTapestryAnalysis.elementThemes.length > 0) { content += `<ul>${currentTapestryAnalysis.elementThemes.map(t => `<li>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p>No specific elemental themes detected from current focus.</p>`; } content += `<p><small>Dominant Elements: ${currentTapestryAnalysis.dominantElements.length > 0 ? currentTapestryAnalysis.dominantElements.map(e => `${e.name} (${e.score.toFixed(1)})`).join(', ') : 'None strongly dominant'}</small></p>`; if(currentTapestryAnalysis.balanceComment) content += `<p><small>Balance: ${currentTapestryAnalysis.balanceComment}</small></p>`; break;
            case 'archetype': content = `<h4>Concept Archetype Analysis</h4>`; if (currentTapestryAnalysis.cardTypeThemes.length > 0) { content += `<ul>${currentTapestryAnalysis.cardTypeThemes.map(t => `<li>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p>No specific archetype themes detected from current focus.</p>`; } content += `<p><small>Focus Distribution: ${currentTapestryAnalysis.dominantCardTypes.length > 0 ? currentTapestryAnalysis.dominantCardTypes.map(ct => `${ct.type} (${ct.count})`).join(', ') : 'None'}</small></p>`; break;
            case 'synergy': content = `<h4>Synergies & Tensions</h4>`; if (currentTapestryAnalysis.synergies.length > 0) { content += `<h5>Synergies:</h5><ul>${currentTapestryAnalysis.synergies.map(s => `<li>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p><em>No direct synergies detected between focused concepts.</em></p>`; } content += `<br>`; if (currentTapestryAnalysis.tensions.length > 0) { content += `<h5>Tensions:</h5><ul>${currentTapestryAnalysis.tensions.map(t => `<li>${t.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p><em>No significant elemental tensions detected within the focus.</em></p>`; } break;
            default: content = `<p><em>Analysis node '${nodeId}' not recognized.</em></p>`;
        }
    } catch (error) { console.error(`Error generating content for node ${nodeId}:`, error); content = `<p>Error generating analysis for ${nodeId}.</p>`; }
    UI.updateDeepDiveContent(content, nodeId);
}

 function handleContemplationNodeClick() {
    const now = Date.now(); const cooldownEnd = State.getContemplationCooldownEnd();
    if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); UI.showTemporaryMessage(`Contemplation available in ${remaining}s.`, 3000); return; }
    if (spendInsight(Config.CONTEMPLATION_COST, "Focused Contemplation")) {
        const contemplation = generateFocusedContemplation();
        if (contemplation) {
             UI.displayContemplationTask(contemplation);
             State.setContemplationCooldown(Date.now() + Config.CONTEMPLATION_COOLDOWN); // Set cooldown start
             UI.updateContemplationButtonState(); // Update button immediately
        }
        else { UI.updateDeepDiveContent("<p><em>Could not generate contemplation task.</em></p>", 'contemplation'); gainInsight(Config.CONTEMPLATION_COST, "Refund: Contemplation Fail"); UI.updateContemplationButtonState(); }
    } else { UI.updateContemplationButtonState(); } // Update button state even if failed (e.g., insufficient insight)
}

function generateFocusedContemplation() {
    if (!currentTapestryAnalysis) { console.error("Cannot generate contemplation: Tapestry analysis missing."); return null; }
    const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts();
    const focusedConceptsArray = Array.from(focused).map(id => disc.get(id)?.concept).filter(Boolean);
    let task = { type: "Default", text: "Reflect on the overall feeling emerging from your current focused concepts.", reward: { type: 'insight', amount: 2 }, requiresCompletionButton: true }; // Default task

    try {
        const taskOptions = [];
        // Tension Task
        if (currentTapestryAnalysis.tensions.length > 0) { const tension = currentTapestryAnalysis.tensions[Math.floor(Math.random() * currentTapestryAnalysis.tensions.length)]; taskOptions.push({ type: 'Tension Reflection', text: `Your Tapestry highlights a tension within **${tension.element}**. How do you experience or navigate this contrast in your life or desires? Consider adding a note to a relevant concept.`, reward: { type: 'insight', amount: 4 }, requiresCompletionButton: true }); }
        // Synergy Task (Note-taking)
        if (currentTapestryAnalysis.synergies.length > 0) { const syn = currentTapestryAnalysis.synergies[Math.floor(Math.random() * currentTapestryAnalysis.synergies.length)]; const [nameA, nameB] = syn.concepts; taskOptions.push({ type: 'Synergy Note', text: `Focus links <strong>${nameA}</strong> and <strong>${nameB}</strong>. Visit the Grimoire, open <strong>${nameA}</strong>, and add a note (1-2 sentences) about how <strong>${nameB}</strong> might amplify or alter its expression.`, reward: { type: 'insight', amount: 3 }, requiresCompletionButton: false }); } // No button, reward granted on generation
        // Dominant Element Ritual Task
        if (currentTapestryAnalysis.dominantElements.length > 0 && currentTapestryAnalysis.dominantElements[0].score > 7.0) { const el = currentTapestryAnalysis.dominantElements[0]; let action = "observe an interaction involving this element"; if (el.key === 'S') action = "mindfully experience one physical sensation related to this element"; else if (el.key === 'P') action = "acknowledge one emotion linked to this element without judgment"; else if (el.key === 'C') action = "analyze one assumption related to this element"; else if (el.key === 'R') action = "consider one relationship boundary influenced by this element"; else if (el.key === 'A') action = "notice one thing that subtly attracts or repels you, related to this element"; taskOptions.push({ type: 'Dominant Element Ritual', text: `Your focus strongly resonates with **${el.name}**. Today's mini-ritual: ${action}. Acknowledge its completion mentally.`, attunementReward: { element: el.key, amount: 0.5 }, reward: { type: 'insight', amount: 2 }, requiresCompletionButton: true }); }
        // General Tapestry Resonance Task
        if (focusedConceptsArray.length > 0) { const conceptNames = focusedConceptsArray.map(c => `<strong>${c.name}</strong>`); taskOptions.push({ type: 'Tapestry Resonance', text: `Meditate briefly (30 seconds) on the combined energy of your focused concepts: ${conceptNames.join(', ')}. What overall feeling, image, or single word emerges?`, attunementReward: { element: 'All', amount: 0.2 }, reward: { type: 'insight', amount: 3 }, requiresCompletionButton: true }); }

        // Select a task (prioritize Tension/Synergy slightly?)
        let selectedTaskOption = null;
        const tensionTask = taskOptions.find(t => t.type === 'Tension Reflection');
        const synergyTask = taskOptions.find(t => t.type === 'Synergy Note');
        if (tensionTask && Math.random() < 0.4) { selectedTaskOption = tensionTask; }
        else if (synergyTask && Math.random() < 0.4) { selectedTaskOption = synergyTask; }
        else if (taskOptions.length > 0) { selectedTaskOption = taskOptions[Math.floor(Math.random() * taskOptions.length)]; }

        if (selectedTaskOption) {
            task = selectedTaskOption;
            // Grant immediate rewards if no button needed
            if (task.reward?.type === 'insight' && !task.requiresCompletionButton) { gainInsight(task.reward.amount, 'Contemplation Task (Note)'); task.reward = { type: 'none' }; } // Grant and nullify reward
            if (task.attunementReward) { gainAttunementForAction('contemplation', task.attunementReward.element, task.attunementReward.amount); delete task.attunementReward; } // Grant attunement immediately
        } else { console.log("Using default contemplation task."); } // Use default if no specific option chosen

    } catch (error) { console.error("Error generating contemplation task:", error); return { type: "Error", text: "An error occurred during generation.", reward: { type: 'none' }, requiresCompletionButton: false }; }

    console.log(`Generated contemplation task of type: ${task.type}`);
    // Make sure text uses strong tags correctly for UI
    task.text = task.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return task;
}

 function handleCompleteContemplation(task) {
    if (!task || !task.reward || !task.requiresCompletionButton) return; // Only process tasks needing button click

    console.log(`Contemplation task completed via button: ${task.type}`);
    // Grant reward associated with the button click
    if (task.reward.type === 'insight' && task.reward.amount > 0) {
        gainInsight(task.reward.amount, `Contemplation Task`);
    } else if (task.reward.type === 'attunement' && task.reward.amount > 0) {
        // This shouldn't happen if attunement was granted immediately, but handle just in case
        gainAttunementForAction('contemplation', task.reward.element || 'All', task.reward.amount);
    }

    UI.showTemporaryMessage("Contemplation complete!", 2500);
    UI.clearContemplationTask(); // Update UI after completion
}


export {
    // Questionnaire
    handleQuestionnaireInputChange, handleCheckboxChange, calculateElementScore,
    goToNextElement, goToPrevElement, finalizeQuestionnaire,
    // Core Logic & Actions
    gainInsight, spendInsight, gainAttunementForAction,
    addConceptToGrimoireById, addConceptToGrimoireInternal, handleToggleFocusConcept,
    handleCardFocusToggle,
    handleResearchClick, handleFreeResearchClick, // Includes daily free research
    attemptArtEvolution, handleSaveNote, handleSellConcept, sellConcept,
    // Reflection
    checkTriggerReflectionPrompt, triggerReflectionPrompt, handleConfirmReflection,
    triggerGuidedReflection,
    // Library (Integrated)
    handleUnlockLibraryLevel,
    // Repository
    handleMeditateScene, handleAttemptExperiment,
    // Persona Calculation Helpers
    calculateFocusScores, calculateTapestryNarrative, calculateFocusThemes,
    // Focus Unlocks
    checkForFocusUnlocks,
    // Daily Login
    checkForDailyLogin,
    // Milestones & Rituals
    updateMilestoneProgress, checkAndUpdateRituals,
    // Popup State Management
    clearPopupState, setCurrentPopupConcept, getCurrentPopupConceptId,
    // Screen Logic Wrappers
    displayPersonaScreenLogic, displayStudyScreenLogic,
    // Tapestry Deep Dive
    showTapestryDeepDive, handleDeepDiveNodeClick, handleContemplationNodeClick,
    handleCompleteContemplation,
    // Suggest Scenes
    handleSuggestSceneClick
};

console.log("gameLogic.js loaded.");
// --- END OF FILE gameLogic.js ---
