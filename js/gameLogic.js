import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as UI from './ui.js'; // Import UI module to trigger updates
import { elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals, sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames } from '../data.js'; // Import all necessary data

console.log("gameLogic.js loading...");

// --- Temporary State (for popups, etc.) ---
let currentlyDisplayedConceptId = null;
let currentReflectionContext = null;
let reflectionTargetConceptId = null;
let currentReflectionCategory = null; // For Guided/Dissonance/Rare category label
let currentPromptId = null; // ID of the currently displayed prompt
let reflectionCooldownTimeout = null;

export function clearPopupState() {
    currentlyDisplayedConceptId = null;
    currentReflectionContext = null;
    reflectionTargetConceptId = null;
    currentReflectionCategory = null;
    currentPromptId = null;
}
export function setCurrentPopupConcept(conceptId) {
    currentlyDisplayedConceptId = conceptId;
}
export function getCurrentPopupConceptId() {
     return currentlyDisplayedConceptId;
}


// --- Insight & Attunement Management ---
export function gainInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount === 0) return;
    const changed = State.changeInsight(amount);
    if (changed) {
        const action = amount > 0 ? "Gained" : "Spent";
        const currentInsight = State.getInsight();
        console.log(`${action} ${Math.abs(amount).toFixed(1)} Insight from ${source}. New total: ${currentInsight.toFixed(1)}`);
        UI.updateInsightDisplays(); // Update UI after state change
    }
}

export function spendInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return false;
    if (State.getInsight() >= amount) {
        gainInsight(-amount, source); // Use gainInsight with negative value
        return true;
    } else {
        UI.showTemporaryMessage(`Not enough Insight! Need ${amount.toFixed(1)}.`, 3000);
        return false;
    }
}

export function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) {
    let targetKeys = [];
    let baseAmount = amount; // Store the original amount

    if (elementKey && State.getAttunement().hasOwnProperty(elementKey)) {
        targetKeys.push(elementKey);
    } else if (actionType === 'completeReflection' && currentReflectionContext === 'Standard' && elementKey) {
         // Find the key for the element name stored in currentReflectionCategory
         const keyFromCategory = elementNameToKey[currentReflectionCategory];
         if (keyFromCategory && State.getAttunement().hasOwnProperty(keyFromCategory)) {
             targetKeys.push(keyFromCategory);
         } else if (elementKey && State.getAttunement().hasOwnProperty(elementKey)) {
             // Fallback to elementKey if category mapping fails but key provided
             targetKeys.push(elementKey);
         }
    } else if (['generic', 'completeReflectionGeneric', 'scoreNudge', 'ritual', 'milestone', 'experimentSuccess', 'artEvolve'].includes(actionType) || elementKey === 'All') {
        targetKeys = Object.keys(State.getAttunement());
        // Adjust amount per key for 'All' actions
        if (actionType === 'scoreNudge') baseAmount = (0.5 / (targetKeys.length || 1)); // Prevent division by zero
        else if (actionType === 'completeReflectionGeneric') baseAmount = 0.2;
        else if (actionType === 'generic') baseAmount = 0.1;
        // Use passed amount directly per element for ritual, milestone, etc.
    } else {
        console.warn(`gainAttunement called with invalid parameters: action=${actionType}, key=${elementKey}`);
        return;
    }

    let changed = false;
    targetKeys.forEach(key => {
        if (State.updateAttunement(key, baseAmount)) {
            changed = true;
            updateMilestoneProgress('elementAttunement', State.getAttunement());
        }
    });

    if (changed) {
        console.log(`Attunement updated (${actionType}, Key: ${elementKey || currentReflectionCategory || 'Multi'}) by ${baseAmount.toFixed(2)} per element.`);
        // UI.displayElementAttunement(); // <--- REMOVED DIRECT UI CALL
    }
}


// --- Questionnaire Logic ---
export function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const type = input.dataset.type;
    const currentState = State.getState();
    if (currentState.currentElementIndex < 0 || currentState.currentElementIndex >= elementNames.length) return;
    const elementName = elementNames[currentState.currentElementIndex];
    if (type === 'slider') UI.updateSliderFeedbackText(input);
    const currentAnswers = UI.getQuestionnaireAnswers();
    State.updateAnswers(elementName, currentAnswers);
    UI.updateDynamicFeedback(elementName, currentAnswers);
}
export function handleCheckboxChange(event) {
     const checkbox = event.target; const name = checkbox.name; const maxChoices = parseInt(checkbox.dataset.maxChoices || 2);
     const container = checkbox.closest('.checkbox-options'); if (!container) return;
     const checkedBoxes = container.querySelectorAll(`input[name="${name}"]:checked`);
     if (checkedBoxes.length > maxChoices) { UI.showTemporaryMessage(`Max ${maxChoices} options.`, 2500); checkbox.checked = false; }
     handleQuestionnaireInputChange(event); // Call the general handler to update state and feedback
}
export function calculateElementScore(elementName, answersForElement) {
    const questions = questionnaireGuided[elementName] || []; let score = 5.0;
    questions.forEach(q => {
        const answer = answersForElement[q.qId]; let pointsToAdd = 0; const weight = q.scoreWeight || 1.0;
        if (q.type === 'slider') { const value = (answer !== undefined && !isNaN(answer)) ? parseFloat(answer) : q.defaultValue; const baseValue = q.defaultValue !== undefined ? q.defaultValue : 5; pointsToAdd = (value - baseValue) * weight; }
        else if (q.type === 'radio') { const opt = q.options.find(o => o.value === answer); pointsToAdd = opt ? (opt.points || 0) * weight : 0; }
        else if (q.type === 'checkbox' && Array.isArray(answer)) { answer.forEach(val => { const opt = q.options.find(o => o.value === val); pointsToAdd += opt ? (opt.points || 0) * weight : 0; }); }
        score += pointsToAdd;
    }); return Math.max(0, Math.min(10, score));
}
export function goToNextElement() {
    const currentState = State.getState(); const currentAnswers = UI.getQuestionnaireAnswers();
    if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) State.updateAnswers(elementNames[currentState.currentElementIndex], currentAnswers);
    const nextIndex = currentState.currentElementIndex + 1;
    if (nextIndex >= elementNames.length) finalizeQuestionnaire();
    else { State.updateElementIndex(nextIndex); UI.displayElementQuestions(nextIndex); }
}
export function goToPrevElement() {
    const currentState = State.getState();
    if (currentState.currentElementIndex > 0) {
        const currentAnswers = UI.getQuestionnaireAnswers();
        if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) State.updateAnswers(elementNames[currentState.currentElementIndex], currentAnswers);
        const prevIndex = currentState.currentElementIndex - 1;
        State.updateElementIndex(prevIndex); UI.displayElementQuestions(prevIndex);
    }
}
export function finalizeQuestionnaire() {
    console.log("Finalizing scores..."); const finalScores = {}; const allAnswers = State.getState().userAnswers;
    elementNames.forEach(elementName => { const score = calculateElementScore(elementName, allAnswers[elementName] || {}); const key = elementNameToKey[elementName]; if (key) finalScores[key] = score; else console.warn(`No key for ${elementName}`); });
    State.updateScores(finalScores); State.setQuestionnaireComplete(); State.saveAllAnswers(allAnswers);
    determineStarterHandAndEssence();
    updateMilestoneProgress('completeQuestionnaire', 1); checkForDailyLogin();
    UI.updateInsightDisplays(); UI.updateFocusSlotsDisplay(); UI.updateGrimoireCounter(); UI.populateGrimoireFilters(); UI.displayDailyRituals(); UI.refreshGrimoireDisplay(); UI.applyOnboardingPhaseUI(State.getOnboardingPhase());
    console.log("Final User Scores:", State.getScores()); UI.showScreen('personaScreen'); UI.showTemporaryMessage("Experiment Complete! Explore results.", 4000);
}

// --- Starter Hand ---
function determineStarterHandAndEssence() {
    console.log("Determining starter hand...");
    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) { console.error("Concepts missing."); return; }
    const userScores = State.getScores();
    let conceptsWithDistance = concepts.map(c => ({ ...c, distance: Utils.euclideanDistance(userScores, c.elementScores) })).filter(c => c.distance !== Infinity && !isNaN(c.distance));
    if (conceptsWithDistance.length === 0) {
         console.error("Distance calculation failed or no valid concepts."); const defaultStarters = concepts.slice(0, 5);
         defaultStarters.forEach(c => { if (State.addDiscoveredConcept(c.id, c)) gainAttunementForAction('discover', c.primaryElement); });
         console.warn("Granted default starter concepts."); UI.updateGrimoireCounter(); return;
    }
    conceptsWithDistance.sort((a, b) => a.distance - b.distance);
    const candidates = conceptsWithDistance.slice(0, 25); const starterHand = []; const starterHandIds = new Set(); const targetHandSize = 7; const elementRepTarget = 4; const representedElements = new Set();
    for (const c of candidates) { if (starterHand.length >= 4) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } }
    for (const c of candidates) { if (starterHand.length >= targetHandSize) break; if (starterHandIds.has(c.id)) continue; const needsRep = c.primaryElement && representedElements.size < elementRepTarget && !representedElements.has(c.primaryElement); if (needsRep || starterHand.length < 5) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } }
    for (const c of candidates) { if (starterHand.length >= targetHandSize) break; if (!starterHandIds.has(c.id)) starterHand.push(c); starterHandIds.add(c.id); }
    console.log("Starter Hand Selected:", starterHand.map(c => c.name));
    starterHand.forEach(c => { if (State.addDiscoveredConcept(c.id, c)) gainAttunementForAction('discover', c.primaryElement, 0.3); });
    updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size); UI.updateGrimoireCounter();
}

// --- Core Actions (Research, Reflection, Focus, etc.) ---
export function handleResearchClick(event) {
    const button = event.currentTarget; const elementKey = button.dataset.elementKey; const cost = parseFloat(button.dataset.cost);
    if (!elementKey || isNaN(cost) || button.disabled) return;
    if (spendInsight(cost, `Research: ${elementKeyToFullName[elementKey]}`)) { console.log(`Spent ${cost} Insight on ${elementKey}.`); conductResearch(elementKey); updateMilestoneProgress('conductResearch', 1); checkAndUpdateRituals('conductResearch'); }
}
export function handleFreeResearchClick() {
    if (!State.isFreeResearchAvailable()) { UI.showTemporaryMessage("Daily meditation done.", 3000); return; }
    const attunement = State.getAttunement(); let targetKey = 'A'; let minAtt = Config.MAX_ATTUNEMENT + 1;
    for (const key in attunement) { if (attunement[key] < minAtt) { minAtt = attunement[key]; targetKey = key; } }
    console.log(`Free meditation on ${targetKey} (${elementKeyToFullName[targetKey]})`); State.setFreeResearchUsed(); UI.displayResearchButtons();
    conductResearch(targetKey); updateMilestoneProgress('freeResearch', 1); checkAndUpdateRituals('freeResearch');
}
export function conductResearch(elementKeyToResearch) {
    const elementFullName = elementKeyToFullName[elementKeyToResearch]; if (!elementFullName) { console.error(`Invalid key: ${elementKeyToResearch}`); return; }
    console.log(`Researching: ${elementFullName}`); UI.displayResearchStatus(`Reviewing ${elementDetails[elementFullName]?.name || elementFullName}...`);
    const discoveredIds = new Set(State.getDiscoveredConcepts().keys()); const discoveredRepo = State.getRepositoryItems(); const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));
    let rareFound = false; const roll = Math.random(); const sceneChance = 0.06; const insightChance = 0.12;
    const researchOutElem = document.getElementById('researchOutput'); const canFindRare = researchOutElem && (researchOutElem.children.length === 0 || researchOutElem.querySelector('p > i'));
    let foundRepoItem = null;
    if (!rareFound && canFindRare && roll < sceneChance && sceneBlueprints.length > 0) {
        const available = sceneBlueprints.filter(s => !discoveredRepo.scenes.has(s.id));
        if (available.length > 0) { const found = available[Math.floor(Math.random() * available.length)]; if (State.addRepositoryItem('scenes', found.id)) { rareFound = true; foundRepoItem = {type: 'scene', ...found}; UI.showTemporaryMessage("Scene Blueprint Discovered!", 4000); if(document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent(); } }
    }
    if (!rareFound && canFindRare && roll < (sceneChance + insightChance) && elementalInsights.length > 0) {
        const relevant = elementalInsights.filter(i => i.element === elementKeyToResearch); const unseenRel = relevant.filter(i => !discoveredRepo.insights.has(i.id));
        const anyUnseen = elementalInsights.filter(i => !discoveredRepo.insights.has(i.id)); const pool = unseenRel.length > 0 ? unseenRel : (anyUnseen.length > 0 ? anyUnseen : relevant); // Prioritize relevant unseen, then any unseen, then relevant seen
        if (pool.length > 0) { const found = pool[Math.floor(Math.random() * pool.length)]; if (State.addRepositoryItem('insights', found.id)) { rareFound = true; foundRepoItem = {type: 'insight', ...found}; UI.showTemporaryMessage("Insight Fragment Found!", 3500); updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); if(document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent(); } }
    }
    if (rareFound && foundRepoItem) { UI.displayResearchResults({ concepts: [], repositoryItems: [foundRepoItem], duplicateInsightGain: 0 }); UI.displayResearchStatus("Unique insight unearthed!"); gainAttunementForAction('researchSpecial', elementKeyToResearch, 1.0); return; }
    if (undiscoveredPool.length === 0) { UI.displayResearchStatus("No more concepts to discover."); if (researchOutElem && researchOutElem.children.length === 0) researchOutElem.innerHTML = '<p><i>Library holds all known concepts.</i></p>'; gainInsight(5.0, "All Concepts Bonus"); return; }
    const currentAtt = State.getAttunement()[elementKeyToResearch] || 0; const priorityP = []; const secondaryP = []; const tertiaryP = [];
    undiscoveredPool.forEach(c => { const score = c.elementScores?.[elementKeyToResearch] || 0; const isPri = c.primaryElement === elementKeyToResearch; if (isPri || score >= 7.5) priorityP.push({...c}); else if (score >= 4.5) secondaryP.push({...c}); else tertiaryP.push({...c}); });
    const selectedOut = []; let dupeGain = 0; const numResults = 3;
    const selectWeighted = () => {
        const pools = [ { pool: priorityP, mult: 3.5 + (currentAtt / 30) }, { pool: secondaryP, mult: 1.5 + (currentAtt / 60) }, { pool: tertiaryP, mult: 0.8 } ];
        let combined = []; let totalW = 0; const attFactor = 1 + (currentAtt / (Config.MAX_ATTUNEMENT * 1.2));
        pools.forEach(({ pool, mult }) => { pool.forEach(card => { let w = 1.0 * mult; if (card.rarity === 'uncommon') w *= (1.3 * attFactor); else if (card.rarity === 'rare') w *= (0.6 * attFactor); else w *= (1.0 * attFactor); w = Math.max(0.1, w); totalW += w; combined.push({ card, w }); }); });
        if (combined.length === 0) return null; let pick = Math.random() * totalW;
        for (let i = 0; i < combined.length; i++) { const item = combined[i]; if (pick < item.w) { [priorityP, secondaryP, tertiaryP].forEach(p => { const idx = p.findIndex(c => c.id === item.card.id); if (idx > -1) p.splice(idx, 1); }); return item.card; } pick -= item.w; }
         const flatP = [...priorityP, ...secondaryP, ...tertiaryP]; if (flatP.length > 0) { const idx = Math.floor(Math.random() * flatP.length); const card = flatP[idx]; [priorityP, secondaryP, tertiaryP].forEach(p => { const i = p.findIndex(c => c.id === card.id); if (i > -1) p.splice(i, 1); }); console.warn("Weighted fail, fallback."); return card; } return null;
    };
    let attempts = 0; const maxAtt = numResults * 4;
    while (selectedOut.length < numResults && attempts < maxAtt && (priorityP.length > 0 || secondaryP.length > 0 || tertiaryP.length > 0)) {
        attempts++; let potential = selectWeighted();
        if (potential) { if (discoveredIds.has(potential.id)) { gainInsight(1.0, `Dupe (${potential.name})`); dupeGain += 1.0; } else { if (!selectedOut.some(c => c.id === potential.id)) selectedOut.push(potential); } } else break;
    }
    let msg = "";
    if (selectedOut.length > 0) { msg = `Discovered ${selectedOut.length} new concept(s)! `; UI.displayResearchResults({ concepts: selectedOut, repositoryItems: [], duplicateInsightGain: dupeGain }); gainAttunementForAction('researchSuccess', elementKeyToResearch, 0.8); if (selectedOut.some(c => c.rarity === 'rare')) updateMilestoneProgress('discoverRareCard', 1); }
    else { msg = "No new concepts found. "; UI.displayResearchResults({ concepts: [], repositoryItems: [], duplicateInsightGain: dupeGain }); gainAttunementForAction('researchFail', elementKeyToResearch, 0.2); }
    if (dupeGain > 0 && selectedOut.length === 0) msg += ` Gained ${dupeGain.toFixed(0)} Insight from echoes.`; // Only add dupe message if no new concepts were found
    UI.displayResearchStatus(msg.trim());
}
export function addConceptToGrimoireById(conceptId, buttonElement = null) {
    if (State.getDiscoveredConcepts().has(conceptId)) { UI.showTemporaryMessage("Already in Grimoire.", 2500); if (buttonElement) UI.updateResearchButtonAfterAction(conceptId, 'add'); return; }
    const concept = concepts.find(c => c.id === conceptId); if (!concept) { console.error("Cannot add concept: Not found. ID:", conceptId); UI.showTemporaryMessage("Error: Concept not found.", 3000); return; }
    const distance = Utils.euclideanDistance(State.getScores(), concept.elementScores);
    // Trigger dissonance reflection only if phase allows
    if (distance > Config.DISSONANCE_THRESHOLD && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS) { console.log(`Dissonance on ${concept.name}. Triggering reflection.`); triggerReflectionPrompt('Dissonance', concept.id); }
    else { addConceptToGrimoireInternal(conceptId); }
     UI.updateResearchButtonAfterAction(conceptId, 'add'); // Update UI regardless of reflection
}
export function addConceptToGrimoireInternal(conceptId) {
     const concept = concepts.find(c => c.id === conceptId); if (!concept) { console.error("Internal add fail: Not found. ID:", conceptId); return; } if (State.getDiscoveredConcepts().has(conceptId)) return; // Already added
     console.log(`Adding ${concept.name} internally.`);
     if (State.addDiscoveredConcept(concept.id, concept)) {
         let insightRwd = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; gainInsight(insightRwd, `Discovered ${concept.rarity} ${concept.name}`);
         gainAttunementForAction('addToGrimoire', concept.primaryElement, 0.6); UI.updateGrimoireCounter();
         // Queue rare prompt if applicable
         if (concept.rarity === 'rare' && concept.uniquePromptId && reflectionPrompts.RareConcept?.[concept.uniquePromptId]) { State.addPendingRarePrompt(concept.uniquePromptId); console.log(`Queued rare prompt ${concept.uniquePromptId}`); }
         // Update Popup if open
         if (currentlyDisplayedConceptId === conceptId) {
             UI.updateGrimoireButtonStatus(conceptId, false); UI.updateFocusButtonStatus(conceptId);
             const discoveredData = State.getDiscoveredConceptData(conceptId); // Get data after adding
             UI.updatePopupSellButton(conceptId, concept, true, false); // Update sell button context
             const notesSect = document.getElementById('myNotesSection'); if(notesSect && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) notesSect.classList.remove('hidden');
             const evoSec = document.getElementById('popupEvolutionSection'); if(evoSec && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED) UI.displayEvolutionSection(concept, discoveredData);
         }
          UI.updateResearchButtonAfterAction(conceptId, 'add'); // Update research notes UI
         checkTriggerReflectionPrompt('add'); updateMilestoneProgress('addToGrimoire', 1); updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size);
         checkAndUpdateRituals('addToGrimoire'); UI.refreshGrimoireDisplay(); UI.showTemporaryMessage(`${concept.name} added to Grimoire!`, 3000);
     } else { console.warn(`State add fail ${concept.name}.`); UI.showTemporaryMessage(`Error adding ${concept.name}.`, 3000); }
}
export function handleToggleFocusConcept() {
    if (currentlyDisplayedConceptId === null) return; const conceptId = currentlyDisplayedConceptId; const result = State.toggleFocusConcept(conceptId);
    const conceptName = State.getDiscoveredConceptData(conceptId)?.concept?.name || `ID ${conceptId}`;
    if (result === 'not_discovered') { UI.showTemporaryMessage("Cannot focus undiscovered.", 3000); }
    else if (result === 'slots_full') { UI.showTemporaryMessage(`Focus slots full (${State.getFocusSlots()}).`, 3000); }
    else if (result === 'removed') {
         UI.showTemporaryMessage(`${conceptName} removed from Focus.`, 2500); checkAndUpdateRituals('removeFocus');
         UI.updateFocusButtonStatus(conceptId); UI.displayFocusedConceptsPersona(); UI.updateFocusElementalResonance(); UI.generateTapestryNarrative(); UI.synthesizeAndDisplayThemesPersona(); checkForFocusUnlocks(); UI.refreshGrimoireDisplay();
    } else if (result === 'added') {
         UI.showTemporaryMessage(`${conceptName} marked as Focus!`, 2500); gainInsight(1.0, `Focused on ${conceptName}`);
         const concept = State.getDiscoveredConceptData(conceptId)?.concept; if (concept?.primaryElement) gainAttunementForAction('markFocus', concept.primaryElement, 1.0);
         updateMilestoneProgress('markFocus', 1); updateMilestoneProgress('focusedConcepts.size', State.getFocusedConcepts().size); checkAndUpdateRituals('markFocus');
         UI.updateFocusButtonStatus(conceptId); UI.displayFocusedConceptsPersona(); UI.updateFocusElementalResonance(); UI.generateTapestryNarrative(); UI.synthesizeAndDisplayThemesPersona(); checkForFocusUnlocks(); UI.refreshGrimoireDisplay();
    }
}

// --- Reflection Logic ---
function checkTriggerReflectionPrompt(triggerAction = 'other') {
    const currentState = State.getState(); if (currentState.currentOnboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) return; if (currentState.promptCooldownActive) return;
    if (triggerAction === 'add') State.incrementReflectionTrigger(); if (triggerAction === 'completeQuestionnaire') { State.incrementReflectionTrigger(); State.incrementReflectionTrigger(); State.incrementReflectionTrigger(); }
    const cardsAdded = currentState.cardsAddedSinceLastPrompt; const triggerThresh = 3; const hasPending = currentState.pendingRarePrompts.length > 0;
    if (hasPending) { console.log("Pending rare prompt found."); triggerReflectionPrompt('RareConcept'); State.resetReflectionTrigger(true); startReflectionCooldown(); }
    else if (cardsAdded >= triggerThresh) { console.log("Reflection trigger threshold met."); triggerReflectionPrompt('Standard'); State.resetReflectionTrigger(true); startReflectionCooldown(); }
}
function startReflectionCooldown() { if (reflectionCooldownTimeout) clearTimeout(reflectionCooldownTimeout); State.clearReflectionCooldown(); // Clear any existing active flag in state
    State.resetReflectionTrigger(true); // Set cooldown active flag in state
    reflectionCooldownTimeout = setTimeout(() => { State.clearReflectionCooldown(); console.log("Reflection cooldown ended."); reflectionCooldownTimeout = null; }, 1000 * 60 * 3); } // 3 min
export function triggerReflectionPrompt(context = 'Standard', targetId = null, category = null) {
    currentReflectionContext = context; reflectionTargetConceptId = (context === 'Dissonance' || context === 'RareConcept' || context === 'SceneMeditation') ? targetId : null; currentReflectionCategory = category;
    let promptPool = []; let title = "Moment for Reflection"; let promptCatLabel = "General"; let selPrompt = null; let showNudge = false; let reward = 5.0;
    console.log(`Trigger reflection: Context=${context}, Target=${targetId}, Category=${category}`);
    // Prioritize pending rare prompts if not Dissonance context
    if (context !== 'Dissonance') {
        const nextRareId = State.getNextRarePrompt();
        if (nextRareId) { selPrompt = reflectionPrompts.RareConcept?.[nextRareId]; if (selPrompt) { currentReflectionContext = 'RareConcept'; title = "Rare Concept Reflection"; const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === nextRareId); promptCatLabel = cEntry ? cEntry[1].concept.name : "Rare Concept"; currentPromptId = selPrompt.id; reward = 7.0; console.log(`Displaying Rare reflection: ${nextRareId}`); } else { console.warn(`Rare prompt text missing: ${nextRareId}`); currentReflectionContext = 'Standard'; } }
    }
    // Determine prompt pool and settings based on context if no rare prompt was selected
    if (!selPrompt && context === 'Dissonance' && targetId) { title = "Dissonance Reflection"; const concept = concepts.find(c => c.id === targetId); promptCatLabel = concept ? concept.name : "Dissonant"; promptPool = reflectionPrompts.Dissonance || []; showNudge = true; console.log(`Looking for Dissonance prompt for ${promptCatLabel}`); }
    else if (!selPrompt && context === 'Guided' && category) { title = "Guided Reflection"; promptCatLabel = category; promptPool = reflectionPrompts.Guided?.[category] || []; reward = Config.GUIDED_REFLECTION_COST + 2; console.log(`Looking for Guided prompt: ${category}`); }
    else if (!selPrompt && context === 'SceneMeditation' && targetId) { const scene = sceneBlueprints.find(s => s.id === targetId); if (scene?.reflectionPromptId) { selPrompt = reflectionPrompts.SceneMeditation?.[scene.reflectionPromptId]; if (selPrompt) { title = "Scene Meditation"; promptCatLabel = scene.name; currentPromptId = selPrompt.id; reward = (scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; console.log(`Displaying Scene Meditation: ${currentPromptId}`); } else { console.warn(`Scene prompt ${scene.reflectionPromptId} missing.`); currentReflectionContext = 'Standard'; } } else { console.warn(`Scene ${targetId} or prompt ID missing.`); currentReflectionContext = 'Standard'; } }
    // Fallback to Standard if no other context matched or rare/scene prompt missing
    if (!selPrompt && currentReflectionContext === 'Standard') {
        title = "Standard Reflection"; const attune = State.getAttunement(); const validElems = Object.entries(attune).filter(([k, v]) => v > 0).sort(([,a], [,b]) => b - a);
        if (validElems.length > 0) { const [selKey] = validElems[Math.floor(Math.random() * validElems.length)]; const selName = elementKeyToFullName[selKey]; promptPool = reflectionPrompts[selName] || []; promptCatLabel = elementDetails[selName]?.name || selName; currentReflectionCategory = selName; console.log(`Looking for Standard prompt: ${promptCatLabel}`); }
        else { promptPool = []; console.warn("No attunement > 0 for Standard reflection."); }
    }
    // Select from the determined pool if no specific prompt was already chosen
    if (!selPrompt && promptPool.length > 0) { const seen = State.getState().seenPrompts; const available = promptPool.filter(p => !seen.has(p.id)); selPrompt = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : promptPool[Math.floor(Math.random() * promptPool.length)]; currentPromptId = selPrompt.id; console.log(`Selected prompt ${currentPromptId}`); }

    // Display the prompt or handle failure
    if (selPrompt) { const pData = { title, category: promptCatLabel, prompt: selPrompt, showNudge, reward }; UI.displayReflectionPrompt(pData, currentReflectionContext); }
    else { console.error(`Could not select prompt for ${context}`); if (context === 'Dissonance' && reflectionTargetConceptId) { console.warn("Dissonance fail, adding concept."); addConceptToGrimoireInternal(reflectionTargetConceptId); UI.hidePopups(); UI.showTemporaryMessage("Reflection unavailable, added concept.", 3500); } else if (context === 'Guided') gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt"); UI.showTemporaryMessage("No reflection prompt found.", 3000); clearPopupState(); }
}
export function handleConfirmReflection(nudgeAllowed) {
    if (!currentPromptId) { console.error("No current prompt ID."); UI.hidePopups(); return; }
    console.log(`Reflection confirmed: Context=${currentReflectionContext}, Prompt=${currentPromptId}, Nudge=${nudgeAllowed}`);
    State.addSeenPrompt(currentPromptId);
    let rewardAmt = 5.0; let attuneKey = null; let attuneAmt = 1.0; let milestoneAct = 'completeReflection';
    // Calculate base reward based on context BEFORE potential refund
    if (currentReflectionContext === 'Guided') { rewardAmt = Config.GUIDED_REFLECTION_COST + 2; }
    else if (currentReflectionContext === 'RareConcept') { rewardAmt = 7.0; }
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); rewardAmt = (scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; }
    else { rewardAmt = 5.0; } // Standard or Dissonance

    // Process Dissonance context specifics
    if (currentReflectionContext === 'Dissonance') {
        milestoneAct = 'completeReflectionDissonance'; attuneAmt = 0.5; // Dissonance gives slightly less direct attunement
        if (nudgeAllowed && reflectionTargetConceptId) {
             console.log("Processing nudge..."); const concept = concepts.find(c => c.id === reflectionTargetConceptId); const scores = State.getScores(); let nudged = false;
             if (concept?.elementScores) { const newScores = { ...scores }; for (const key in scores) { if (scores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) { const uScore = scores[key]; const cScore = concept.elementScores[key]; const diff = cScore - uScore; if (Math.abs(diff) > 1.5) { const nudgeVal = Math.sign(diff) * Config.SCORE_NUDGE_AMOUNT; newScores[key] = Math.max(0, Math.min(10, uScore + nudgeVal)); if (newScores[key] !== uScore) nudged = true; } } }
                 if (nudged) { State.updateScores(newScores); console.log("Nudged Scores:", State.getScores()); UI.displayPersonaScreen(); UI.showTemporaryMessage("Core understanding shifted.", 3500); gainAttunementForAction('scoreNudge', 'All', 0.5); updateMilestoneProgress('scoreNudgeApplied', 1); }
             } else { console.warn(`Cannot apply nudge, concept data missing for ID ${reflectionTargetConceptId}`); }
         } if (reflectionTargetConceptId) addConceptToGrimoireInternal(reflectionTargetConceptId); // Add concept AFTER processing nudge
    }

    // Grant Insight Reward
    gainInsight(rewardAmt, `Reflection (${currentReflectionContext || 'Unknown'})`);

    // Determine Attunement Key
    if (currentReflectionContext === 'Standard' && currentReflectionCategory) { attuneKey = elementNameToKey[currentReflectionCategory]; }
    else if (currentReflectionContext === 'Guided') { attuneKey = null; /* Guided gives generic attunement */ }
    else if (currentReflectionContext === 'RareConcept') { const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId); attuneKey = cEntry ? cEntry[1].concept.primaryElement : null; }
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); attuneKey = scene?.element || null; }
    // Dissonance attunement handled below

    // Apply Attunement
    if (attuneKey) gainAttunementForAction('completeReflection', attuneKey, attuneAmt);
    else gainAttunementForAction('completeReflectionGeneric', 'All', 0.2); // Generic gain for Guided, Dissonance, or if key not found

    // Update Milestones & Rituals
    updateMilestoneProgress(milestoneAct, 1); checkAndUpdateRituals('completeReflection');
    // Check for focus rituals that might match this reflection
    const ritualCtxMatch = `${currentReflectionContext}_${currentPromptId}`; checkAndUpdateRituals('completeReflection', { contextMatch: ritualCtxMatch });

    // Cleanup
    UI.hidePopups(); UI.showTemporaryMessage("Reflection complete! Insight gained.", 3000); clearPopupState();
}
export function triggerGuidedReflection() {
     if (spendInsight(Config.GUIDED_REFLECTION_COST, "Guided Reflection")) {
         const cats = Object.keys(reflectionPrompts.Guided || {});
         if (cats.length > 0) { const cat = cats[Math.floor(Math.random() * cats.length)]; console.log(`Triggering guided: ${cat}`); triggerReflectionPrompt('Guided', null, cat); }
         else { console.warn("No guided categories."); gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt"); UI.showTemporaryMessage("No guided reflections available.", 3000); }
     }
}

// --- Art Evolution ---
export function attemptArtEvolution() {
    if (currentlyDisplayedConceptId === null) return; const conceptId = currentlyDisplayedConceptId; const discovered = State.getDiscoveredConceptData(conceptId);
    if (!discovered?.concept || discovered.artUnlocked) { UI.showTemporaryMessage("Evolution fail: State error.", 3000); return; }
    const concept = discovered.concept; if (!concept.canUnlockArt) return;
    const cost = Config.ART_EVOLVE_COST; const isFocused = State.getFocusedConcepts().has(conceptId); const hasReflected = State.getState().seenPrompts.size > 0; const phaseOK = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;
    if (!phaseOK) { UI.showTemporaryMessage("Unlock Repository first.", 3000); return; }
    if (!isFocused || !hasReflected) { UI.showTemporaryMessage("Check requirements.", 3000); return; }
    if (spendInsight(cost, `Evolve Art: ${concept.name}`)) {
        if (State.unlockArt(conceptId)) {
            console.log(`Art unlocked for ${concept.name}!`); UI.showTemporaryMessage(`Enhanced Art for ${concept.name}!`, 3500);
            if (currentlyDisplayedConceptId === conceptId) UI.showConceptDetailPopup(conceptId); // Refresh popup
            UI.refreshGrimoireDisplay(); gainAttunementForAction('artEvolve', concept.primaryElement, 1.5);
            updateMilestoneProgress('evolveArt', 1); checkAndUpdateRituals('artEvolve');
        } else { console.error(`State unlockArt fail ${concept.name}`); gainInsight(cost, `Refund: Art evolution error`); UI.showTemporaryMessage("Error updating art.", 3000); }
    }
}

// --- Notes Logic ---
export function handleSaveNote() {
    if (currentlyDisplayedConceptId === null) return; const notesTA = document.getElementById('myNotesTextarea'); if (!notesTA) return;
    const noteText = notesTA.value.trim();
    if (State.updateNotes(currentlyDisplayedConceptId, noteText)) { const status = document.getElementById('noteSaveStatus'); if (status) { status.textContent = "Saved!"; status.classList.remove('error'); setTimeout(() => { status.textContent = ""; }, 2000); } }
    else { const status = document.getElementById('noteSaveStatus'); if (status) { status.textContent = "Error."; status.classList.add('error'); } }
}

// --- Sell Logic ---
export function handleSellConcept(event) {
     const button = event.target.closest('button'); if (!button) return; const conceptId = parseInt(button.dataset.conceptId); const context = button.dataset.context;
     if (isNaN(conceptId)) { console.error("Invalid sell ID:", button.dataset.conceptId); return; }
     sellConcept(conceptId, context);
}
function sellConcept(conceptId, context) {
    const discovered = State.getDiscoveredConceptData(conceptId); const concept = discovered?.concept || concepts.find(c => c.id === conceptId);
    if (!concept) { console.error(`Sell fail: Not found ${conceptId}`); UI.showTemporaryMessage("Error selling.", 3000); return; }
    let val = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellVal = val * Config.SELL_INSIGHT_FACTOR;
    const sourceLoc = context === 'grimoire' ? 'Grimoire' : 'Research Notes';
    if (confirm(`Sell '${concept.name}' (${concept.rarity}) from ${sourceLoc} for ${sellVal.toFixed(1)} Insight?`)) {
        gainInsight(sellVal, `Sold: ${concept.name}`); updateMilestoneProgress('sellConcept', 1);
        let focusChanged = false;
        if (context === 'grimoire') { if (State.removeDiscoveredConcept(conceptId)) { focusChanged = State.getFocusedConcepts().has(conceptId); UI.updateGrimoireCounter(); UI.refreshGrimoireDisplay(); } }
        else if (context === 'research') UI.updateResearchButtonAfterAction(conceptId, 'sell');
        if (focusChanged) { UI.displayFocusedConceptsPersona(); UI.updateFocusElementalResonance(); UI.generateTapestryNarrative(); UI.synthesizeAndDisplayThemesPersona(); checkForFocusUnlocks(); }
        UI.showTemporaryMessage(`Sold ${concept.name} for ${sellVal.toFixed(1)} Insight.`, 2500);
        if (currentlyDisplayedConceptId === conceptId) UI.hidePopups();
    }
}

// --- Library Logic ---
export function handleUnlockLibraryLevel(event) {
     const button = event.target.closest('button'); if (!button || button.disabled) return; const key = button.dataset.elementKey; const level = parseInt(button.dataset.level);
     if (!key || isNaN(level)) { console.error("Invalid library unlock data"); return; }
     unlockDeepDiveLevel(key, level);
}
function unlockDeepDiveLevel(elementKey, levelToUnlock) {
    const dData = elementDeepDive[elementKey] || []; const lData = dData.find(l => l.level === levelToUnlock); const curLevel = State.getState().unlockedDeepDiveLevels[elementKey] || 0;
    if (!lData || levelToUnlock !== curLevel + 1) { console.warn(`Library unlock fail: Invalid level/seq.`); return; }
    const cost = lData.insightCost || 0;
    if (spendInsight(cost, `Unlock Library: ${elementKeyToFullName[elementKey]} Lv ${levelToUnlock}`)) {
        if (State.unlockLibraryLevel(elementKey, levelToUnlock)) {
            console.log(`Unlocked ${elementKeyToFullName[elementKey]} level ${levelToUnlock}`); UI.displayElementDeepDive(elementKey); UI.showTemporaryMessage(`${elementKeyToFullName[elementKey]} Insight Lv ${levelToUnlock} Unlocked!`, 3000);
            updateMilestoneProgress('unlockLibrary', levelToUnlock); updateMilestoneProgress('unlockedDeepDiveLevels', State.getState().unlockedDeepDiveLevels); checkAndUpdateRituals('unlockLibrary');
        } else { console.error(`State fail unlock library ${elementKey} Lv ${levelToUnlock}`); gainInsight(cost, `Refund: Library unlock error`); }
    }
}

// --- Repository Logic ---
export function handleMeditateScene(event) {
     const button = event.target.closest('button'); if (!button || button.disabled) return; const sceneId = button.dataset.sceneId; if (!sceneId) return; meditateOnScene(sceneId);
}
function meditateOnScene(sceneId) {
    const scene = sceneBlueprints.find(s => s.id === sceneId); if (!scene) { console.error(`Scene not found: ${sceneId}`); return; }
    const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
    if (spendInsight(cost, `Meditate: ${scene.name}`)) {
        if (scene.reflectionPromptId) { console.log(`Triggering Scene Meditation: ${scene.name}`); triggerReflectionPrompt('SceneMeditation', sceneId); updateMilestoneProgress('meditateScene', 1); }
        else { console.error(`Prompt ID missing for scene ${sceneId}`); gainInsight(cost, `Refund: Missing scene prompt`); UI.showTemporaryMessage("Meditation fail: Reflection missing.", 3000); }
    }
}
export function handleAttemptExperiment(event) {
     const button = event.target.closest('button'); if (!button || button.disabled) return; const expId = button.dataset.experimentId; if (!expId) return; attemptExperiment(expId);
}
function attemptExperiment(experimentId) {
     const exp = alchemicalExperiments.find(e => e.id === experimentId); if (!exp || State.getRepositoryItems().experiments.has(experimentId)) { console.warn(`Exp ${experimentId} not found/completed.`); return; }
     const attune = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();
     if (attune[exp.requiredElement] < exp.requiredAttunement) { UI.showTemporaryMessage("Attunement too low.", 3000); return; }
     if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { const c = concepts.find(c=>c.id === reqId); UI.showTemporaryMessage(`Requires Focus: ${c?.name || `ID ${reqId}`}`, 3000); return; } } }
     if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let met = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { met = true; break; } } if (!met) { UI.showTemporaryMessage(`Requires Focus Type: ${typeReq}`, 3000); return; } } }
     const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST; if (!spendInsight(cost, `Attempt Exp: ${exp.name}`)) return;
     console.log(`Attempting: ${exp.name}`); updateMilestoneProgress('attemptExperiment', 1); const roll = Math.random();
     if (roll < (exp.successRate || 0.5)) { // SUCCESS
         console.log("Exp Success!"); UI.showTemporaryMessage(`Success! '${exp.name}' yielded results.`, 4000); State.addRepositoryItem('experiments', exp.id);
         if (exp.successReward) { if (exp.successReward.type === 'insight') gainInsight(exp.successReward.amount, `Exp Success: ${exp.name}`); if (exp.successReward.type === 'attunement') gainAttunementForAction('experimentSuccess', exp.successReward.element || 'All', exp.successReward.amount); if (exp.successReward.type === 'insightFragment') { if (State.addRepositoryItem('insights', exp.successReward.id)) { console.log(`Exp reward: Insight ${exp.successReward.id}`); updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); } } }
     } else { // FAILURE
         console.log("Exp Failed."); UI.showTemporaryMessage(`Exp '${exp.name}' failed... ${exp.failureConsequence || "No effect."}`, 4000);
         if (exp.failureConsequence?.includes("Insight loss")) { const loss = parseFloat(exp.failureConsequence.match(/(\d+(\.\d+)?)/)?.[0] || 1); gainInsight(-loss, `Exp Failure: ${exp.name}`); }
     }
     UI.displayRepositoryContent(); // Refresh repo display after attempt
}

// --- Rituals & Milestones Logic (Helper) ---
export function checkAndUpdateRituals(action, details = {}) {
    let ritualCompletedThisCheck = false;
    const currentState = State.getState(); const completedToday = currentState.completedRituals.daily || {}; const focused = currentState.focusedConcepts;
    let currentRitualPool = [...dailyRituals];
    if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFoc = true; for (const id of reqIds) { if (!focused.has(id)) { allFoc = false; break; } } if (allFoc) currentRitualPool.push({ ...ritual, isFocusRitual: true }); }); }
    currentRitualPool.forEach(ritual => {
        const completedData = completedToday[ritual.id] || { completed: false, progress: 0 }; if (completedData.completed) return;
        const actionMatch = ritual.track.action === action;
        // Ensure contextMatch logic correctly compares
        const contextMatches = ritual.track.contextMatch && details.contextMatch === ritual.track.contextMatch;

        if (actionMatch || contextMatches) {
            const progress = State.completeRitualProgress(ritual.id, 'daily');
            const requiredCount = ritual.track.count || 1; // Get required count
            if (progress >= requiredCount) {
                console.log(`Ritual Completed: ${ritual.description}`); State.markRitualComplete(ritual.id, 'daily'); ritualCompletedThisCheck = true;
                if (ritual.reward) { if (ritual.reward.type === 'insight') gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`); else if (ritual.reward.type === 'attunement') gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0); else if (ritual.reward.type === 'token') console.log(`TODO: Grant ${ritual.reward.tokenType || 'Research'} token`); }
            }
        }
    });
    if (ritualCompletedThisCheck) UI.displayDailyRituals();
}
export function updateMilestoneProgress(trackType, currentValue) {
     let milestoneAchievedThisUpdate = false; const achievedSet = State.getState().achievedMilestones;
     milestones.forEach(m => {
         if (!achievedSet.has(m.id)) {
             let achieved = false; const threshold = m.track.threshold; let checkValue = null;
             if (m.track.action === trackType) { if (typeof currentValue === 'number' && currentValue >= (m.track.count || 1)) achieved = true; else if ((m.track.count === 1 || !m.track.count) && currentValue) achieved = true; }
             else if (m.track.state === trackType) {
                 const att = State.getAttunement(); const lvls = State.getState().unlockedDeepDiveLevels; const discSize = State.getDiscoveredConcepts().size; const focSize = State.getFocusedConcepts().size; const insCount = State.getRepositoryItems().insights.size; const slots = State.getFocusSlots();
                 if (trackType === 'elementAttunement') { if (m.track.element && att.hasOwnProperty(m.track.element)) checkValue = att[m.track.element]; else if (m.track.condition === 'any') achieved = Object.values(att).some(v => v >= threshold); else if (m.track.condition === 'all') achieved = Object.values(att).every(v => v >= threshold); }
                 else if (trackType === 'unlockedDeepDiveLevels') { if (m.track.condition === 'any') achieved = Object.values(lvls).some(v => v >= threshold); else if (m.track.condition === 'all') achieved = Object.values(lvls).every(v => v >= threshold); }
                 else if (trackType === 'discoveredConcepts.size') checkValue = discSize; else if (trackType === 'focusedConcepts.size') checkValue = focSize; else if (trackType === 'repositoryInsightsCount') checkValue = insCount; else if (trackType === 'focusSlotsTotal') checkValue = slots;
                 else if (trackType === 'repositoryContents' && m.track.condition === "allTypesPresent") { const i = State.getRepositoryItems(); achieved = i.scenes.size > 0 && i.experiments.size > 0 && i.insights.size > 0; }
                 if (!achieved && checkValue !== null && typeof checkValue === 'number' && checkValue >= threshold) achieved = true; // Check simple threshold if complex conditions didn't match
             }
             if (achieved) {
                 if (State.addAchievedMilestone(m.id)) {
                     console.log("Milestone Achieved!", m.description); milestoneAchievedThisUpdate = true; UI.displayMilestones(); UI.showMilestoneAlert(m.description);
                     if (m.reward) { if (m.reward.type === 'insight') gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`); else if (m.reward.type === 'attunement') gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0); else if (m.reward.type === 'increaseFocusSlots') { const inc = m.reward.amount || 1; if (State.increaseFocusSlots(inc)) { UI.updateFocusSlotsDisplay(); updateMilestoneProgress('focusSlotsTotal', State.getFocusSlots()); } } else if (m.reward.type === 'discoverCard') { const cId = m.reward.cardId; if (cId && !State.getDiscoveredConcepts().has(cId)) { const cDisc = concepts.find(c => c.id === cId); if (cDisc) { addConceptToGrimoireInternal(cId); UI.showTemporaryMessage(`Milestone Reward: Discovered ${cDisc.name}!`, 3500); } } } }
                 }
             }
         }
     });
     // Save if any milestone was achieved during this update cycle
     // if (milestoneAchievedThisUpdate) State.saveGameState(); // Saving is handled by individual state mutators now
}

// --- Daily Login ---
export function checkForDailyLogin() {
    const today = new Date().toDateString(); const last = State.getState().lastLoginDate;
    if (last !== today) { console.log("First login today."); State.resetDailyRituals(); gainInsight(5.0, "Daily Bonus"); UI.showTemporaryMessage("Rituals Reset. Free Research Available!", 3500); UI.displayDailyRituals(); UI.displayResearchButtons(); }
    else { console.log("Already logged in."); UI.displayResearchButtons(); } // Refresh button state even if not first login
}

// --- Persona Calculation Logic Helpers ---
export function calculateFocusScores() {
     const scores = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); const count = focused.size;
     if (count > 0) { focused.forEach(id => { const data = disc.get(id); if (data?.concept?.elementScores) { for (const key in scores) { if (data.concept.elementScores.hasOwnProperty(key)) scores[key] += data.concept.elementScores[key]; } } }); for (const key in scores) scores[key] /= count; } return { focusScores: scores, focusCount: count };
}
export function calculateTapestryNarrative() {
     const { focusScores, focusCount } = calculateFocusScores(); if (focusCount === 0) return 'Mark concepts as "Focus"...';
     const sorted = Object.entries(focusScores).filter(([k, s]) => s > 0).sort(([, a], [, b]) => b - a); if (sorted.length === 0) return 'Balanced essence.';
     const [topK, topS] = sorted[0]; const topName = elementDetails[elementKeyToFullName[topK]]?.name || topK;
     let topCName = ""; const disc = State.getDiscoveredConcepts(); const focused = State.getFocusedConcepts();
     for (const id of focused) { const data = disc.get(id); if (data?.concept?.primaryElement === topK || (data?.concept?.elementScores[topK] || 0) >= 7) { topCName = data.concept.name; break; } } if (!topCName && focused.size > 0) topCName = disc.get(focused.values().next().value)?.concept?.name || "?";
     let narr = `Strong resonance with **${topName}**`; if (topCName && topCName !== "?") narr += `, reflected in **${topCName}**. `; else narr += ". ";
     if (sorted.length > 1) { const [secK, secS] = sorted[1]; if (secS > 3.5) { const secName = elementDetails[elementKeyToFullName[secK]]?.name || secK; let secCName = ""; for (const id of focused) { const data = disc.get(id); if(data?.concept?.name === topCName) continue; if (data?.concept?.primaryElement === secK || (data?.concept?.elementScores[secK] || 0) >= 6) { secCName = data.concept.name; break; } } narr += `Undercurrents of **${secName}** add complexity`; if(secCName) narr += ` via **${secCName}**.`; else narr += "."; } }
     const { synergyNarrative } = checkForFocusUnlocks(true); if(synergyNarrative) narr += " " + synergyNarrative;
     return narr.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
export function calculateFocusThemes() {
     const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); if (focused.size === 0) return [];
     const counts = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const thresh = 7.0;
     focused.forEach(id => { const concept = disc.get(id)?.concept; if (concept?.elementScores) { for (const key in concept.elementScores) { if (elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= thresh) counts[key]++; } } });
     const sorted = Object.entries(counts).filter(([k, c]) => c > 0 && elementDetails[elementKeyToFullName[k]]).sort(([, a], [, b]) => b - a).map(([k, c]) => ({ key: k, name: elementDetails[elementKeyToFullName[k]]?.name || k, count: c })); return sorted;
}

// --- Focus Unlocks ---
export function checkForFocusUnlocks(silent = false) {
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) return { synergyNarrative: "" };
     console.log("Checking focus unlocks..."); let newlyUnlocked = false; let synNarr = "";
     const focused = State.getFocusedConcepts(); const unlocked = State.getUnlockedFocusItems();
     focusDrivenUnlocks.forEach(unlock => {
         if (unlocked.has(unlock.id)) return; let met = true; if (!unlock.requiredFocusIds || unlock.requiredFocusIds.length === 0) met = false; else { for (const reqId of unlock.requiredFocusIds) { if (!focused.has(reqId)) { met = false; break; } } }
         if (met) { console.log(`Met reqs for ${unlock.id}`); if (State.addUnlockedFocusItem(unlock.id)) { newlyUnlocked = true; const item = unlock.unlocks; let name = item.name || `ID ${item.id}`; let notif = unlock.description || `Unlocked ${name}`;
                 if (item.type === 'scene') { if (State.addRepositoryItem('scenes', item.id)) { console.log(`Unlocked Scene: ${name}`); notif += ` View in Repo.`; } else notif += ` (Already Discovered)`; } // Clarify if already found via research
                 else if (item.type === 'experiment') { console.log(`Unlocked Exp: ${name}.`); notif += ` Check Repo.`; }
                 else if (item.type === 'insightFragment') { if (State.addRepositoryItem('insights', item.id)) { const iData = elementalInsights.find(i => i.id === item.id); name = iData ? `"${iData.text}"` : `ID ${item.id}`; console.log(`Unlocked Insight: ${item.id}`); notif += ` View in Repo.`; updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); } else notif += ` (Already Discovered)`; } // Clarify
                 const cNames = unlock.requiredFocusIds.map(id => State.getDiscoveredConceptData(id)?.concept?.name || `ID ${id}`); synNarr = `Synergy between **${cNames.join('** & **')}**.`;
                 if (!silent) UI.showTemporaryMessage(`Focus Synergy: ${notif}`, 5000);
             }
         }
     });
     if (newlyUnlocked && !silent) { console.log("New Focus Unlocks:", Array.from(State.getUnlockedFocusItems())); if (document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent(); if (document.getElementById('personaScreen')?.classList.contains('current')) UI.generateTapestryNarrative(); /* Update narrative too */ }
     return { synergyNarrative: synNarr };
}

console.log("gameLogic.js loaded.");
