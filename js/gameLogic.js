// js/gameLogic.js - Application Logic

import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as UI from './ui.js';
// Import specific data structures needed for generation
import { elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals, sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames, elementInteractionThemes, cardTypeThemes } from '../data.js';

console.log("gameLogic.js loading...");

// --- Temporary State ---
let currentlyDisplayedConceptId = null;
let currentReflectionContext = null;
let reflectionTargetConceptId = null;
let currentReflectionCategory = null;
let currentPromptId = null;
let reflectionCooldownTimeout = null;

// *** NEW: Temporary State for Deep Dive Analysis ***
let currentTapestryAnalysis = null; // Stores the breakdown from calculateTapestryNarrative


export function clearPopupState() {
    currentlyDisplayedConceptId = null;
    currentReflectionContext = null;
    reflectionTargetConceptId = null;
    currentReflectionCategory = null;
    currentPromptId = null;
    // Don't clear currentTapestryAnalysis here, it's linked to focus set
}
export function setCurrentPopupConcept(conceptId) { currentlyDisplayedConceptId = conceptId; }
export function getCurrentPopupConceptId() { return currentlyDisplayedConceptId; }


// --- Insight & Attunement Management ---
export function gainInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount === 0) return;
    const changed = State.changeInsight(amount);
    if (changed) {
        const action = amount > 0 ? "Gained" : "Spent";
        const currentInsight = State.getInsight();
        console.log(`${action} ${Math.abs(amount).toFixed(1)} Insight from ${source}. New total: ${currentInsight.toFixed(1)}`);
        UI.updateInsightDisplays();
    }
}

export function spendInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return false;
    if (State.getInsight() >= amount) {
        gainInsight(-amount, source);
        return true;
    } else {
        UI.showTemporaryMessage(`Not enough Insight! Need ${amount.toFixed(1)}.`, 3000);
        return false;
    }
}

export function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) {
    let targetKeys = [];
    let baseAmount = amount;

    if (elementKey && State.getAttunement().hasOwnProperty(elementKey)) {
        targetKeys.push(elementKey);
    } else if (actionType === 'completeReflection' && ['Standard', 'SceneMeditation', 'RareConcept'].includes(currentReflectionContext)) {
         let keyFromContext = null;
         if (currentReflectionContext === 'Standard' && currentReflectionCategory) keyFromContext = elementNameToKey[currentReflectionCategory];
         else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); keyFromContext = scene?.element || null; }
         else if (currentReflectionContext === 'RareConcept') { const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId); keyFromContext = cEntry ? cEntry[1].concept.primaryElement : null; }
         if (keyFromContext && State.getAttunement().hasOwnProperty(keyFromContext)) targetKeys.push(keyFromContext);
         else if (elementKey && State.getAttunement().hasOwnProperty(elementKey)) targetKeys.push(elementKey);

    } else if (['generic', 'completeReflectionGeneric', 'scoreNudge', 'ritual', 'milestone', 'experimentSuccess', 'artEvolve', 'addToGrimoire', 'discover', 'markFocus', 'contemplation'].includes(actionType) || elementKey === 'All') {
        targetKeys = Object.keys(State.getAttunement());
        if (actionType === 'scoreNudge') baseAmount = (0.5 / (targetKeys.length || 1));
        else if (actionType === 'completeReflectionGeneric') baseAmount = 0.2;
        else if (actionType === 'generic') baseAmount = 0.1;
        // Allow contemplation to pass specific amounts per element if needed later
    } else {
        console.warn(`gainAttunement called with invalid parameters or context: action=${actionType}, key=${elementKey}, context=${currentReflectionContext}, category=${currentReflectionCategory}`);
        return;
    }

    let changed = false;
    targetKeys.forEach(key => {
        if (State.updateAttunement(key, baseAmount)) {
            changed = true;
            // Pass the specific updated key and its new value
            updateMilestoneProgress('elementAttunement', { [key]: State.getAttunement()[key] });
             // Also trigger the generic check for all/any milestones
             updateMilestoneProgress('elementAttunement', State.getAttunement());
        }
    });

    if (changed) {
        console.log(`Attunement updated (${actionType}, Key(s): ${targetKeys.join(',') || 'None'}) by ${baseAmount.toFixed(2)} per element.`);
         // If the Persona screen is active, explicitly update its attunement display
         if (document.getElementById('personaScreen')?.classList.contains('current')) {
            UI.displayElementAttunement();
        }
    }
}


// --- Questionnaire Logic ---
 function handleQuestionnaireInputChange(event) {
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
 function handleCheckboxChange(event) {
     const checkbox = event.target; const name = checkbox.name; const maxChoices = parseInt(checkbox.dataset.maxChoices || 2);
     const container = checkbox.closest('.checkbox-options'); if (!container) return;
     const checkedBoxes = container.querySelectorAll(`input[name="${name}"]:checked`);
     if (checkedBoxes.length > maxChoices) { UI.showTemporaryMessage(`Max ${maxChoices} options.`, 2500); checkbox.checked = false; }
     handleQuestionnaireInputChange(event); // Call the general handler to update state and feedback
}
function calculateElementScore(elementName, answersForElement) {
    const questions = questionnaireGuided[elementName] || []; let score = 5.0;
    questions.forEach(q => {
        const answer = answersForElement[q.qId]; let pointsToAdd = 0; const weight = q.scoreWeight || 1.0;
        if (q.type === 'slider') { const value = (answer !== undefined && !isNaN(answer)) ? parseFloat(answer) : q.defaultValue; const baseValue = q.defaultValue !== undefined ? q.defaultValue : 5; pointsToAdd = (value - baseValue) * weight; }
        else if (q.type === 'radio') { const opt = q.options.find(o => o.value === answer); pointsToAdd = opt ? (opt.points || 0) * weight : 0; }
        else if (q.type === 'checkbox' && Array.isArray(answer)) { answer.forEach(val => { const opt = q.options.find(o => o.value === val); pointsToAdd += opt ? (opt.points || 0) * weight : 0; }); }
        score += pointsToAdd;
    }); return Math.max(0, Math.min(10, score));
}
 function goToNextElement() {
    const currentState = State.getState(); const currentAnswers = UI.getQuestionnaireAnswers();
    if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) State.updateAnswers(elementNames[currentState.currentElementIndex], currentAnswers);
    const nextIndex = currentState.currentElementIndex + 1;
    if (nextIndex >= elementNames.length) finalizeQuestionnaire();
    else { State.updateElementIndex(nextIndex); UI.displayElementQuestions(nextIndex); }
}
 function goToPrevElement() {
    const currentState = State.getState();
    if (currentState.currentElementIndex > 0) {
        const currentAnswers = UI.getQuestionnaireAnswers();
        if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) State.updateAnswers(elementNames[currentState.currentElementIndex], currentAnswers);
        const prevIndex = currentState.currentElementIndex - 1;
        State.updateElementIndex(prevIndex); UI.displayElementQuestions(prevIndex);
    }
}
 function finalizeQuestionnaire() {
    console.log("Finalizing scores..."); const finalScores = {}; const allAnswers = State.getState().userAnswers;
    elementNames.forEach(elementName => { const score = calculateElementScore(elementName, allAnswers[elementName] || {}); const key = elementNameToKey[elementName]; if (key) finalScores[key] = score; else console.warn(`No key for ${elementName}`); });
    State.updateScores(finalScores); State.setQuestionnaireComplete(); State.saveAllAnswers(allAnswers);
    determineStarterHandAndEssence();
    updateMilestoneProgress('completeQuestionnaire', 1); checkForDailyLogin();
    UI.updateInsightDisplays(); UI.updateFocusSlotsDisplay(); UI.updateGrimoireCounter(); UI.populateGrimoireFilters(); UI.displayDailyRituals(); UI.refreshGrimoireDisplay(); UI.applyOnboardingPhaseUI(State.getOnboardingPhase());
    console.log("Final User Scores:", State.getScores());
    displayPersonaScreenLogic(); // Ensure persona screen data is calculated
    UI.showScreen('personaScreen'); UI.showTemporaryMessage("Experiment Complete! Explore results.", 4000);
}


// --- Starter Hand ---
function determineStarterHandAndEssence() {
    console.log("Determining starter hand...");
    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) { console.error("Concepts missing."); return; }
    const userScores = State.getScores();
    let conceptsWithDistance = concepts.map(c => ({ ...c, distance: Utils.euclideanDistance(userScores, c.elementScores) })).filter(c => c.distance !== Infinity && !isNaN(c.distance));
    if (conceptsWithDistance.length === 0) {
         console.error("Distance calculation failed or no valid concepts."); const defaultStarters = concepts.slice(0, 5);
         defaultStarters.forEach(c => { if (State.addDiscoveredConcept(c.id, c)) gainAttunementForAction('discover', c.primaryElement, 0.3); });
         console.warn("Granted default starter concepts."); UI.updateGrimoireCounter(); return;
    }
    conceptsWithDistance.sort((a, b) => a.distance - b.distance);
    const candidates = conceptsWithDistance.slice(0, 25); const starterHand = []; const starterHandIds = new Set(); const targetHandSize = 7; const elementRepTarget = 4; const representedElements = new Set();
    for (const c of candidates) { if (starterHand.length >= 4) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } }
    for (const c of candidates) { if (starterHand.length >= targetHandSize) break; if (starterHandIds.has(c.id)) continue; const needsRep = c.primaryElement && representedElements.size < elementRepTarget && !representedElements.has(c.primaryElement); if (needsRep || starterHand.length < 5) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } }
    for (const c of candidates) { if (starterHand.length >= targetHandSize) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); } }
    console.log("Starter Hand Selected:", starterHand.map(c => c.name));
    starterHand.forEach(c => { if (State.addDiscoveredConcept(c.id, c)) gainAttunementForAction('discover', c.primaryElement, 0.3); });
    updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size); UI.updateGrimoireCounter();
}


// --- Core Actions (Research, Reflection, Focus, etc.) ---
// Wrappers for triggering screen display logic (called from main.js nav)
 function displayPersonaScreenLogic() {
    generateTapestryNarrative(true); // Ensure analysis is current
    UI.displayPersonaScreen();
    UI.updateTapestryDeepDiveButton(); // Update button state
}
 function displayStudyScreenLogic() {
    UI.displayStudyScreenContent();
}
 function handleResearchClick(event) {
    const button = event.currentTarget; const elementKey = button.dataset.elementKey; const cost = parseFloat(button.dataset.cost);
    if (!elementKey || isNaN(cost) || button.disabled) return;
    if (spendInsight(cost, `Research: ${elementKeyToFullName[elementKey]}`)) { console.log(`Spent ${cost} Insight on ${elementKey}.`); conductResearch(elementKey); updateMilestoneProgress('conductResearch', 1); checkAndUpdateRituals('conductResearch'); }
}
 function handleFreeResearchClick() {
    if (!State.isFreeResearchAvailable()) { UI.showTemporaryMessage("Daily meditation done.", 3000); return; }
    const attunement = State.getAttunement(); let targetKey = 'A'; let minAtt = Config.MAX_ATTUNEMENT + 1;
    for (const key in attunement) { if (attunement[key] < minAtt) { minAtt = attunement[key]; targetKey = key; } }
    console.log(`Free meditation on ${targetKey} (${elementKeyToFullName[targetKey]})`); State.setFreeResearchUsed(); UI.displayResearchButtons();
    conductResearch(targetKey); updateMilestoneProgress('freeResearch', 1); checkAndUpdateRituals('freeResearch');
}
 function conductResearch(elementKeyToResearch) {
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
        const anyUnseen = elementalInsights.filter(i => !discoveredRepo.insights.has(i.id)); const pool = unseenRel.length > 0 ? unseenRel : (anyUnseen.length > 0 ? anyUnseen : relevant);
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
    if (dupeGain > 0 && selectedOut.length === 0) msg += ` Gained ${dupeGain.toFixed(0)} Insight from echoes.`;
    UI.displayResearchStatus(msg.trim());
}
 function addConceptToGrimoireById(conceptId, buttonElement = null) {
    if (State.getDiscoveredConcepts().has(conceptId)) { UI.showTemporaryMessage("Already in Grimoire.", 2500); if (buttonElement) UI.updateResearchButtonAfterAction(conceptId, 'add'); return; }
    const concept = concepts.find(c => c.id === conceptId); if (!concept) { console.error("Cannot add concept: Not found. ID:", conceptId); UI.showTemporaryMessage("Error: Concept not found.", 3000); return; }
    const distance = Utils.euclideanDistance(State.getScores(), concept.elementScores);
    if (distance > Config.DISSONANCE_THRESHOLD && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS) { console.log(`Dissonance on ${concept.name}. Triggering reflection.`); triggerReflectionPrompt('Dissonance', concept.id); }
    else { addConceptToGrimoireInternal(conceptId); }
     if (buttonElement) UI.updateResearchButtonAfterAction(conceptId, 'add');
}
 function addConceptToGrimoireInternal(conceptId) {
     const concept = concepts.find(c => c.id === conceptId); if (!concept) { console.error("Internal add fail: Not found. ID:", conceptId); return; } if (State.getDiscoveredConcepts().has(conceptId)) return;
     console.log(`Adding ${concept.name} internally.`);
     if (State.addDiscoveredConcept(concept.id, concept)) {
         let insightRwd = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; gainInsight(insightRwd, `Discovered ${concept.rarity} ${concept.name}`);
         gainAttunementForAction('addToGrimoire', concept.primaryElement, 0.6); UI.updateGrimoireCounter();
         if (concept.rarity === 'rare' && concept.uniquePromptId && reflectionPrompts.RareConcept?.[concept.uniquePromptId]) { State.addPendingRarePrompt(concept.uniquePromptId); console.log(`Queued rare prompt ${concept.uniquePromptId}`); }
         if (currentlyDisplayedConceptId === conceptId) {
             UI.updateGrimoireButtonStatus(conceptId, false); UI.updateFocusButtonStatus(conceptId);
             const discoveredData = State.getDiscoveredConceptData(conceptId);
             UI.updatePopupSellButton(conceptId, concept, true, false);
             const notesSect = document.getElementById('myNotesSection'); if(notesSect && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) notesSect.classList.remove('hidden');
             const evoSec = document.getElementById('popupEvolutionSection'); if(evoSec && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED) UI.displayEvolutionSection(concept, discoveredData);
         }
          UI.updateResearchButtonAfterAction(conceptId, 'add');
         checkTriggerReflectionPrompt('add'); updateMilestoneProgress('addToGrimoire', 1); updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size);
         checkAndUpdateRituals('addToGrimoire'); UI.refreshGrimoireDisplay(); UI.showTemporaryMessage(`${concept.name} added to Grimoire!`, 3000);
     } else { console.warn(`State add fail ${concept.name}.`); UI.showTemporaryMessage(`Error adding ${concept.name}.`, 3000); }
}
 function handleToggleFocusConcept() {
    if (currentlyDisplayedConceptId === null) return;
    const conceptId = currentlyDisplayedConceptId;
    const result = State.toggleFocusConcept(conceptId); // State handles logic, saving, and Deep Dive state reset check

    const conceptName = State.getDiscoveredConceptData(conceptId)?.concept?.name || `ID ${conceptId}`;

    if (result === 'not_discovered') { UI.showTemporaryMessage("Cannot focus undiscovered concept.", 3000); }
    else if (result === 'slots_full') { UI.showTemporaryMessage(`Focus slots full (${State.getFocusSlots()}).`, 3000); }
    else { // 'added' or 'removed'
         if (result === 'removed') {
              UI.showTemporaryMessage(`${conceptName} removed from Focus.`, 2500); checkAndUpdateRituals('removeFocus');
         } else { // added
              UI.showTemporaryMessage(`${conceptName} marked as Focus!`, 2500); gainInsight(1.0, `Focused on ${conceptName}`);
              const concept = State.getDiscoveredConceptData(conceptId)?.concept; if (concept?.primaryElement) gainAttunementForAction('markFocus', concept.primaryElement, 1.0);
              updateMilestoneProgress('markFocus', 1); updateMilestoneProgress('focusedConcepts.size', State.getFocusedConcepts().size); checkAndUpdateRituals('markFocus');
         }
         // Update UI for both add/remove
         UI.updateFocusButtonStatus(conceptId);
         UI.displayFocusedConceptsPersona();
         updateFocusElementalResonance(); // Recalculate resonance
         generateTapestryNarrative(true); // Recalculate narrative & store analysis
         UI.synthesizeAndDisplayThemesPersona();
         checkForFocusUnlocks();
         UI.refreshGrimoireDisplay();
         UI.updateTapestryDeepDiveButton(); // Update Deep Dive button state
    }
}
function checkTriggerReflectionPrompt(triggerAction = 'other') {
    const currentState = State.getState(); if (currentState.currentOnboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) return; if (currentState.promptCooldownActive) return;
    if (triggerAction === 'add') State.incrementReflectionTrigger(); if (triggerAction === 'completeQuestionnaire') { State.incrementReflectionTrigger(); State.incrementReflectionTrigger(); State.incrementReflectionTrigger(); }
    const cardsAdded = currentState.cardsAddedSinceLastPrompt; const triggerThresh = 3; const hasPending = currentState.pendingRarePrompts.length > 0;
    if (hasPending) { console.log("Pending rare prompt found."); triggerReflectionPrompt('RareConcept'); State.resetReflectionTrigger(true); startReflectionCooldown(); }
    else if (cardsAdded >= triggerThresh) { console.log("Reflection trigger threshold met."); triggerReflectionPrompt('Standard'); State.resetReflectionTrigger(true); startReflectionCooldown(); }
}
function startReflectionCooldown() { if (reflectionCooldownTimeout) clearTimeout(reflectionCooldownTimeout); State.clearReflectionCooldown();
    State.resetReflectionTrigger(true);
    reflectionCooldownTimeout = setTimeout(() => { State.clearReflectionCooldown(); console.log("Reflection cooldown ended."); reflectionCooldownTimeout = null; }, 1000 * 60 * 3); } // 3 min
 function triggerReflectionPrompt(context = 'Standard', targetId = null, category = null) {
    currentReflectionContext = context; reflectionTargetConceptId = (context === 'Dissonance' || context === 'RareConcept' || context === 'SceneMeditation') ? targetId : null; currentReflectionCategory = category;
    let promptPool = []; let title = "Moment for Reflection"; let promptCatLabel = "General"; let selPrompt = null; let showNudge = false; let reward = 5.0;
    console.log(`Trigger reflection: Context=${context}, Target=${targetId}, Category=${category}`);
    if (context !== 'Dissonance') {
        const nextRareId = State.getNextRarePrompt();
        if (nextRareId) { selPrompt = reflectionPrompts.RareConcept?.[nextRareId]; if (selPrompt) { currentReflectionContext = 'RareConcept'; title = "Rare Concept Reflection"; const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === nextRareId); promptCatLabel = cEntry ? cEntry[1].concept.name : "Rare Concept"; currentPromptId = selPrompt.id; reward = 7.0; console.log(`Displaying Rare reflection: ${nextRareId}`); } else { console.warn(`Rare prompt text missing: ${nextRareId}`); currentReflectionContext = 'Standard'; } }
    }
    if (!selPrompt && context === 'Dissonance' && targetId) { title = "Dissonance Reflection"; const concept = concepts.find(c => c.id === targetId); promptCatLabel = concept ? concept.name : "Dissonant"; promptPool = reflectionPrompts.Dissonance || []; showNudge = true; console.log(`Looking for Dissonance prompt for ${promptCatLabel}`); }
    else if (!selPrompt && context === 'Guided' && category) { title = "Guided Reflection"; promptCatLabel = category; promptPool = reflectionPrompts.Guided?.[category] || []; reward = Config.GUIDED_REFLECTION_COST + 2; console.log(`Looking for Guided prompt: ${category}`); }
    else if (!selPrompt && context === 'SceneMeditation' && targetId) { const scene = sceneBlueprints.find(s => s.id === targetId); if (scene?.reflectionPromptId) { selPrompt = reflectionPrompts.SceneMeditation?.[scene.reflectionPromptId]; if (selPrompt) { title = "Scene Meditation"; promptCatLabel = scene.name; currentPromptId = selPrompt.id; reward = (scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; console.log(`Displaying Scene Meditation: ${currentPromptId}`); } else { console.warn(`Scene prompt ${scene.reflectionPromptId} missing.`); currentReflectionContext = 'Standard'; } } else { console.warn(`Scene ${targetId} or prompt ID missing.`); currentReflectionContext = 'Standard'; } }
    if (!selPrompt && currentReflectionContext === 'Standard') {
        title = "Standard Reflection"; const attune = State.getAttunement(); const validElems = Object.entries(attune).filter(([k, v]) => v > 0).sort(([,a], [,b]) => b - a);
        if (validElems.length > 0) { const [selKey] = validElems[Math.floor(Math.random() * validElems.length)]; const selName = elementKeyToFullName[selKey]; promptPool = reflectionPrompts[selName] || []; promptCatLabel = elementDetails[selName]?.name || selName; currentReflectionCategory = selName; console.log(`Looking for Standard prompt: ${promptCatLabel}`); }
        else { promptPool = []; console.warn("No attunement > 0 for Standard reflection."); }
    }
    if (!selPrompt && promptPool.length > 0) { const seen = State.getState().seenPrompts; const available = promptPool.filter(p => !seen.has(p.id)); selPrompt = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : promptPool[Math.floor(Math.random() * promptPool.length)]; currentPromptId = selPrompt.id; console.log(`Selected prompt ${currentPromptId}`); }
    if (selPrompt) { const pData = { title, category: promptCatLabel, prompt: selPrompt, showNudge, reward }; UI.displayReflectionPrompt(pData, currentReflectionContext); }
    else { console.error(`Could not select prompt for ${context}`); if (context === 'Dissonance' && reflectionTargetConceptId) { console.warn("Dissonance fail, adding concept."); addConceptToGrimoireInternal(reflectionTargetConceptId); UI.hidePopups(); UI.showTemporaryMessage("Reflection unavailable, added concept.", 3500); } else if (context === 'Guided') gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt"); UI.showTemporaryMessage("No reflection prompt found.", 3000); clearPopupState(); }
}
 function handleConfirmReflection(nudgeAllowed) {
    if (!currentPromptId) { console.error("No current prompt ID."); UI.hidePopups(); return; }
    console.log(`Reflection confirmed: Context=${currentReflectionContext}, Prompt=${currentPromptId}, Nudge=${nudgeAllowed}`);
    State.addSeenPrompt(currentPromptId);
    let rewardAmt = 5.0; let attuneKey = null; let attuneAmt = 1.0; let milestoneAct = 'completeReflection';
    if (currentReflectionContext === 'Guided') { rewardAmt = Config.GUIDED_REFLECTION_COST + 2; }
    else if (currentReflectionContext === 'RareConcept') { rewardAmt = 7.0; }
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); rewardAmt = (scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; }
    else { rewardAmt = 5.0; }
    if (currentReflectionContext === 'Dissonance') {
        milestoneAct = 'completeReflectionDissonance'; attuneAmt = 0.5;
        if (nudgeAllowed && reflectionTargetConceptId) {
             console.log("Processing nudge..."); const concept = concepts.find(c => c.id === reflectionTargetConceptId); const scores = State.getScores(); let nudged = false;
             if (concept?.elementScores) { const newScores = { ...scores }; for (const key in scores) { if (scores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) { const uScore = scores[key]; const cScore = concept.elementScores[key]; const diff = cScore - uScore; if (Math.abs(diff) > 1.5) { const nudgeVal = Math.sign(diff) * Config.SCORE_NUDGE_AMOUNT; newScores[key] = Math.max(0, Math.min(10, uScore + nudgeVal)); if (newScores[key] !== uScore) nudged = true; } } }
                 if (nudged) { State.updateScores(newScores); console.log("Nudged Scores:", State.getScores()); UI.displayPersonaScreen(); UI.showTemporaryMessage("Core understanding shifted.", 3500); gainAttunementForAction('scoreNudge', 'All', 0.5); updateMilestoneProgress('scoreNudgeApplied', 1); }
             } else { console.warn(`Cannot apply nudge, concept data missing for ID ${reflectionTargetConceptId}`); }
         } if (reflectionTargetConceptId) addConceptToGrimoireInternal(reflectionTargetConceptId);
    }
    gainInsight(rewardAmt, `Reflection (${currentReflectionContext || 'Unknown'})`);
    if (currentReflectionContext === 'Standard' && currentReflectionCategory) { attuneKey = elementNameToKey[currentReflectionCategory]; }
    else if (currentReflectionContext === 'Guided') { attuneKey = null; }
    else if (currentReflectionContext === 'RareConcept') { const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId); attuneKey = cEntry ? cEntry[1].concept.primaryElement : null; }
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); attuneKey = scene?.element || null; }
    if (attuneKey) gainAttunementForAction('completeReflection', attuneKey, attuneAmt);
    else gainAttunementForAction('completeReflectionGeneric', 'All', 0.2);
    updateMilestoneProgress(milestoneAct, 1); checkAndUpdateRituals('completeReflection');
    const ritualCtxMatch = `${currentReflectionContext}_${currentPromptId}`; checkAndUpdateRituals('completeReflection', { contextMatch: ritualCtxMatch });
    UI.hidePopups(); UI.showTemporaryMessage("Reflection complete! Insight gained.", 3000); clearPopupState();
}
 function triggerGuidedReflection() {
     if (spendInsight(Config.GUIDED_REFLECTION_COST, "Guided Reflection")) {
         const cats = Object.keys(reflectionPrompts.Guided || {});
         if (cats.length > 0) { const cat = cats[Math.floor(Math.random() * cats.length)]; console.log(`Triggering guided: ${cat}`); triggerReflectionPrompt('Guided', null, cat); }
         else { console.warn("No guided categories."); gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt"); UI.showTemporaryMessage("No guided reflections available.", 3000); }
     }
}
 function attemptArtEvolution() {
    if (currentlyDisplayedConceptId === null) return; const conceptId = currentlyDisplayedConceptId; const discovered = State.getDiscoveredConceptData(conceptId);
    if (!discovered?.concept || discovered.artUnlocked) { UI.showTemporaryMessage("Evolution fail: State error.", 3000); return; }
    const concept = discovered.concept; if (!concept.canUnlockArt) return;
    const cost = Config.ART_EVOLVE_COST; const isFocused = State.getFocusedConcepts().has(conceptId); const hasReflected = State.getState().seenPrompts.size > 0; const phaseOK = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;
    if (!phaseOK) { UI.showTemporaryMessage("Unlock Repository first.", 3000); return; }
    if (!isFocused || !hasReflected) { UI.showTemporaryMessage("Check requirements.", 3000); return; }
    if (spendInsight(cost, `Evolve Art: ${concept.name}`)) {
        if (State.unlockArt(conceptId)) {
            console.log(`Art unlocked for ${concept.name}!`); UI.showTemporaryMessage(`Enhanced Art for ${concept.name}!`, 3500);
            if (currentlyDisplayedConceptId === conceptId) UI.showConceptDetailPopup(conceptId);
            UI.refreshGrimoireDisplay(); gainAttunementForAction('artEvolve', concept.primaryElement, 1.5);
            updateMilestoneProgress('evolveArt', 1); checkAndUpdateRituals('artEvolve');
        } else { console.error(`State unlockArt fail ${concept.name}`); gainInsight(cost, `Refund: Art evolution error`); UI.showTemporaryMessage("Error updating art.", 3000); }
    }
}
 function handleSaveNote() {
    if (currentlyDisplayedConceptId === null) return; const notesTA = document.getElementById('myNotesTextarea'); if (!notesTA) return;
    const noteText = notesTA.value.trim();
    if (State.updateNotes(currentlyDisplayedConceptId, noteText)) { const status = document.getElementById('noteSaveStatus'); if (status) { status.textContent = "Saved!"; status.classList.remove('error'); setTimeout(() => { status.textContent = ""; }, 2000); } }
    else { const status = document.getElementById('noteSaveStatus'); if (status) { status.textContent = "Error."; status.classList.add('error'); } }
}
 function handleSellConcept(event) {
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
        if (context === 'grimoire') {
             focusChanged = State.getFocusedConcepts().has(conceptId); // Check focus before removing
             if(State.removeDiscoveredConcept(conceptId)) {
                 UI.updateGrimoireCounter();
                 UI.refreshGrimoireDisplay();
                 // Deep dive state reset is handled within State.removeDiscoveredConcept if focus changed
             }
        }
        else if (context === 'research') UI.updateResearchButtonAfterAction(conceptId, 'sell');
        if (focusChanged) {
            UI.displayFocusedConceptsPersona();
            updateFocusElementalResonance(); // Use internal logic function
            generateTapestryNarrative(true); // Use internal logic function, recalculate analysis
            UI.synthesizeAndDisplayThemesPersona();
            checkForFocusUnlocks();
            UI.updateTapestryDeepDiveButton(); // Update button state
        }
        UI.showTemporaryMessage(`Sold ${concept.name} for ${sellVal.toFixed(1)} Insight.`, 2500);
        if (currentlyDisplayedConceptId === conceptId) UI.hidePopups();
    }
}
 function handleUnlockLibraryLevel(event) {
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
 function handleMeditateScene(event) {
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
 function handleAttemptExperiment(event) {
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
     if (roll < (exp.successRate || 0.5)) {
         console.log("Exp Success!"); UI.showTemporaryMessage(`Success! '${exp.name}' yielded results.`, 4000); State.addRepositoryItem('experiments', exp.id);
         if (exp.successReward) { if (exp.successReward.type === 'insight') gainInsight(exp.successReward.amount, `Exp Success: ${exp.name}`); if (exp.successReward.type === 'attunement') gainAttunementForAction('experimentSuccess', exp.successReward.element || 'All', exp.successReward.amount); if (exp.successReward.type === 'insightFragment') { if (State.addRepositoryItem('insights', exp.successReward.id)) { console.log(`Exp reward: Insight ${exp.successReward.id}`); updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); } } }
     } else {
         console.log("Exp Failed."); UI.showTemporaryMessage(`Exp '${exp.name}' failed... ${exp.failureConsequence || "No effect."}`, 4000);
         if (exp.failureConsequence?.includes("Insight loss")) { const loss = parseFloat(exp.failureConsequence.match(/(\d+(\.\d+)?)/)?.[0] || 1); gainInsight(-loss, `Exp Failure: ${exp.name}`); }
     }
     UI.displayRepositoryContent();
}

// --- Rituals & Milestones Logic (Helper) ---
 function checkAndUpdateRituals(action, details = {}) {
    let ritualCompletedThisCheck = false;
    const currentState = State.getState(); const completedToday = currentState.completedRituals.daily || {}; const focused = currentState.focusedConcepts;
    let currentRitualPool = [...dailyRituals];
    if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFoc = true; for (const id of reqIds) { if (!focused.has(id)) { allFoc = false; break; } } if (allFoc) currentRitualPool.push({ ...ritual, isFocusRitual: true, period: 'daily' }); }); }
    currentRitualPool.forEach(ritual => {
        const completedData = completedToday[ritual.id] || { completed: false, progress: 0 }; if (completedData.completed) return;
        const actionMatch = ritual.track.action === action;
        const contextMatches = ritual.track.contextMatch && details.contextMatch === ritual.track.contextMatch;
        if (actionMatch || contextMatches) {
            const progress = State.completeRitualProgress(ritual.id, 'daily');
            const requiredCount = ritual.track.count || 1;
            if (progress >= requiredCount) {
                console.log(`Ritual Completed: ${ritual.description}`); State.markRitualComplete(ritual.id, 'daily'); ritualCompletedThisCheck = true;
                if (ritual.reward) { if (ritual.reward.type === 'insight') gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`); else if (ritual.reward.type === 'attunement') gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0); else if (ritual.reward.type === 'token') console.log(`TODO: Grant ${ritual.reward.tokenType || 'Research'} token`); }
            }
        }
    });
    if (ritualCompletedThisCheck) UI.displayDailyRituals();
}
function updateMilestoneProgress(trackType, currentValue) {
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
                 if (!achieved && checkValue !== null && typeof checkValue === 'number' && checkValue >= threshold) achieved = true;
             }
             if (achieved) {
                 if (State.addAchievedMilestone(m.id)) {
                     console.log("Milestone Achieved!", m.description); milestoneAchievedThisUpdate = true; UI.displayMilestones(); UI.showMilestoneAlert(m.description);
                     if (m.reward) { if (m.reward.type === 'insight') gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`); else if (m.reward.type === 'attunement') gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0); else if (m.reward.type === 'increaseFocusSlots') { const inc = m.reward.amount || 1; if (State.increaseFocusSlots(inc)) { UI.updateFocusSlotsDisplay(); updateMilestoneProgress('focusSlotsTotal', State.getFocusSlots()); } } else if (m.reward.type === 'discoverCard') { const cId = m.reward.cardId; if (cId && !State.getDiscoveredConcepts().has(cId)) { const cDisc = concepts.find(c => c.id === cId); if (cDisc) { addConceptToGrimoireInternal(cId); UI.showTemporaryMessage(`Milestone Reward: Discovered ${cDisc.name}!`, 3500); } } } }
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
        console.log("First login today.");
        State.resetDailyRituals(); // Resets rituals, grants free research, sets date, saves state
        gainInsight(5.0, "Daily Bonus");
        UI.showTemporaryMessage("Rituals Reset. Free Research Available!", 3500);
        UI.displayDailyRituals();
        UI.displayResearchButtons(); // Update button states
    } else {
        console.log("Already logged in today.");
        UI.displayResearchButtons(); // Refresh button state even if not first login
    }
}

// --- Persona Calculation Logic Helpers ---
export function calculateFocusScores() {
     const scores = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); const count = focused.size;
     if (count > 0) { focused.forEach(id => { const data = disc.get(id); if (data?.concept?.elementScores) { for (const key in scores) { if (data.concept.elementScores.hasOwnProperty(key)) scores[key] += data.concept.elementScores[key]; } } }); for (const key in scores) scores[key] /= count; } return { focusScores: scores, focusCount: count };
}

// *** Overhauled Tapestry Narrative Calculation ***
 function calculateTapestryNarrative(forceRecalculate = false) {
    const currentHash = State.getCurrentFocusSetHash();
    const stateHash = State.getState().currentFocusSetHash; // Get hash stored in state

    // If analysis exists, not forced, AND the focus set hasn't changed since last calculation, return stored HTML
    if (currentTapestryAnalysis && !forceRecalculate && currentHash === stateHash) {
        return currentTapestryAnalysis.fullNarrativeHTML;
    }

    const focused = State.getFocusedConcepts();
    const focusCount = focused.size;
    if (focusCount === 0) {
        currentTapestryAnalysis = null; // Clear analysis if no focus
        return 'Mark concepts as "Focus" from the Grimoire to weave your narrative.';
    }

    const disc = State.getDiscoveredConcepts();
    const { focusScores } = calculateFocusScores();

    const analysis = {
        dominantElements: [], elementThemes: [], dominantCardTypes: [],
        cardTypeThemes: [], topKeywords: [], synergies: [], tensions: [],
        fullNarrativeRaw: "", fullNarrativeHTML: ""
    };

    // 1. Analyze Dominant Elements & Themes
    const sortedElements = Object.entries(focusScores).filter(([k, s]) => s > 3.5).sort(([, a], [, b]) => b - a);
    if (sortedElements.length > 0) {
        analysis.dominantElements = sortedElements.map(([key, score]) => ({ key: key, name: elementDetails[elementKeyToFullName[key]]?.name || key, score: score }));
        const topElementKeys = analysis.dominantElements.slice(0, 3).map(e => e.key).sort().join('');
        const themeKey = topElementKeys.length > 1 ? topElementKeys : (topElementKeys.length === 1 ? analysis.dominantElements[0].key : null); // Use single key if only one dominant
        if (themeKey && elementInteractionThemes[themeKey]) { analysis.elementThemes.push(elementInteractionThemes[themeKey]); }
        else if (analysis.dominantElements.length > 0) { analysis.elementThemes.push(`a strong emphasis on **${analysis.dominantElements[0].name}**.`); }
    }

    // 2. Analyze Card Types
    const typeCounts = {}; cardTypeKeys.forEach(type => typeCounts[type] = 0);
    focused.forEach(id => { const type = disc.get(id)?.concept?.cardType; if (type && typeCounts.hasOwnProperty(type)) { typeCounts[type]++; } });
    analysis.dominantCardTypes = Object.entries(typeCounts).filter(([type, count]) => count > 0).sort(([, a], [, b]) => b - a).map(([type, count]) => ({ type, count }));
    if (analysis.dominantCardTypes.length > 0) { const topType = analysis.dominantCardTypes[0].type; if (cardTypeThemes[topType]) { analysis.cardTypeThemes.push(cardTypeThemes[topType]); } }

    // 3. Analyze Keywords
    const keywordCounts = {}; let totalKeywords = 0;
    focused.forEach(id => { const keywords = disc.get(id)?.concept?.keywords; if (keywords && Array.isArray(keywords)) { keywords.forEach(kw => { keywordCounts[kw] = (keywordCounts[kw] || 0) + 1; totalKeywords++; }); } });
    analysis.topKeywords = Object.entries(keywordCounts).filter(([kw, count]) => count > (totalKeywords > 10 ? 1 : 0) ).sort(([, a], [, b]) => b - a).slice(0, 5).map(([keyword, count]) => ({ keyword, count }));

    // 4. Analyze Synergies
    const checkedPairs = new Set();
    focused.forEach(idA => { const conceptA = disc.get(idA)?.concept; if (!conceptA?.relatedIds) return; focused.forEach(idB => { if (idA === idB) return; const pairKey = [idA, idB].sort().join('-'); if (checkedPairs.has(pairKey)) return; if (conceptA.relatedIds.includes(idB)) { const conceptB = disc.get(idB)?.concept; if (conceptB) { analysis.synergies.push({ concepts: [conceptA.name, conceptB.name], text: `The connection between **${conceptA.name}** and **${conceptB.name}** suggests a reinforcing dynamic.` }); } } checkedPairs.add(pairKey); }); });

    // 5. Analyze Tensions (Placeholder)

    // 6. Construct Full Narrative
    let narrative = "";
    if (analysis.dominantElements.length > 0) { narrative += `Your tapestry currently resonates with ${analysis.elementThemes.join(' ')} `; }
    else { narrative += "Your focus presents a unique and subtle balance. "; }
    if (analysis.dominantCardTypes.length > 0) { narrative += `The focus leans towards ${analysis.cardTypeThemes.join(' ')} `; }
    if (analysis.topKeywords.length > 0) { narrative += `Core themes of **'${analysis.topKeywords.map(kw => kw.keyword).join("', '**")}**' emerge strongly. `; }
    analysis.synergies.forEach(syn => { narrative += syn.text + " "; });
    // analysis.tensions.forEach(ten => { narrative += ten.text + " "; });

    analysis.fullNarrativeRaw = narrative.trim();
    analysis.fullNarrativeHTML = analysis.fullNarrativeRaw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    currentTapestryAnalysis = analysis;
    console.log("Recalculated Tapestry Analysis:", currentTapestryAnalysis);

    return analysis.fullNarrativeHTML;
}

 function calculateFocusThemes() {
     const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); if (focused.size === 0) return [];
     const counts = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const thresh = 7.0;
     focused.forEach(id => { const concept = disc.get(id)?.concept; if (concept?.elementScores) { for (const key in concept.elementScores) { if (elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= thresh) counts[key]++; } } });
     const sorted = Object.entries(counts).filter(([k, c]) => c > 0 && elementDetails[elementKeyToFullName[k]]).sort(([, a], [, b]) => b - a).map(([k, c]) => ({ key: k, name: elementDetails[elementKeyToFullName[k]]?.name || k, count: c })); return sorted;
}

// --- Focus Unlocks ---
export function checkForFocusUnlocks(silent = false) {
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) return { synergyNarrative: "" };
     console.log("Checking focus unlocks..."); let newlyUnlocked = false;
     const focused = State.getFocusedConcepts(); const unlocked = State.getUnlockedFocusItems();
     focusDrivenUnlocks.forEach(unlock => {
         if (unlocked.has(unlock.id)) return; let met = true; if (!unlock.requiredFocusIds || unlock.requiredFocusIds.length === 0) met = false; else { for (const reqId of unlock.requiredFocusIds) { if (!focused.has(reqId)) { met = false; break; } } }
         if (met) { console.log(`Met reqs for ${unlock.id}`); if (State.addUnlockedFocusItem(unlock.id)) { newlyUnlocked = true; const item = unlock.unlocks; let name = item.name || `ID ${item.id}`; let notif = unlock.description || `Unlocked ${name}`;
                 if (item.type === 'scene') { if (State.addRepositoryItem('scenes', item.id)) { console.log(`Unlocked Scene: ${name}`); notif += ` View in Repo.`; } else notif += ` (Already Discovered)`; }
                 else if (item.type === 'experiment') { console.log(`Unlocked Exp: ${name}.`); notif += ` Check Repo.`; }
                 else if (item.type === 'insightFragment') { if (State.addRepositoryItem('insights', item.id)) { const iData = elementalInsights.find(i => i.id === item.id); name = iData ? `"${iData.text}"` : `ID ${item.id}`; console.log(`Unlocked Insight: ${item.id}`); notif += ` View in Repo.`; updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); } else notif += ` (Already Discovered)`; }
                 if (!silent) UI.showTemporaryMessage(`Focus Synergy: ${notif}`, 5000);
             }
         }
     });
     if (newlyUnlocked && !silent) { console.log("New Focus Unlocks:", Array.from(State.getUnlockedFocusItems())); if (document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent(); if (document.getElementById('personaScreen')?.classList.contains('current')) generateTapestryNarrative(); } // Regenerate narrative if persona screen active
     return { synergyNarrative: "" }; // Synergy text now part of main narrative
}


// --- Tapestry Deep Dive Logic ---

const DEEP_DIVE_NODE_COST = 1; // Insight cost to view a node first time
const CONTEMPLATION_COST = 3; // Insight cost for contemplation
const CONTEMPLATION_COOLDOWN = 1000 * 60 * 60 * 4; // 4 hours in milliseconds

export function showTapestryDeepDive() {
    if (State.getFocusedConcepts().size === 0) { UI.showTemporaryMessage("Focus on concepts first to explore the tapestry.", 3000); return; }
    generateTapestryNarrative(true); // Ensure analysis is current
    if (!currentTapestryAnalysis) { console.error("Failed to generate tapestry analysis for Deep Dive."); return; }
    UI.displayTapestryDeepDive(currentTapestryAnalysis);
}

function handleDeepDiveNodeClick(nodeId) {
    if (!currentTapestryAnalysis) return;
    const viewedNodes = State.getDeepDiveViewedNodes();
    let content = null; let costApplied = false;
    if (!viewedNodes.has(nodeId)) { if (spendInsight(DEEP_DIVE_NODE_COST, `Deep Dive: ${nodeId}`)) { State.addDeepDiveViewedNode(nodeId); costApplied = true; } else { return; } }

    switch (nodeId) {
        case 'elemental':
            content = `<h4>Elemental Resonance Breakdown</h4><ul>${currentTapestryAnalysis.elementThemes.map(t => `<li>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`;
            content += `<p><small>Dominant Elements: ${currentTapestryAnalysis.dominantElements.map(e => `${e.name} (${e.score.toFixed(1)})`).join(', ')}</small></p>`;
            break;
        case 'archetype':
            content = `<h4>Concept Archetype Analysis</h4><ul>${currentTapestryAnalysis.cardTypeThemes.map(t => `<li>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`;
            content += `<p><small>Focus Distribution: ${currentTapestryAnalysis.dominantCardTypes.map(ct => `${ct.type} (${ct.count})`).join(', ')}</small></p>`;
            break;
        case 'keyword':
            content = `<h4>Keyword Constellation</h4>`; if (currentTapestryAnalysis.topKeywords.length > 0) { content += `<p>${currentTapestryAnalysis.topKeywords.map(kw => `<span class="keyword-tag">${kw.keyword} (${kw.count})</span>`).join(' ')}</p>`; } else { content += `<p><em>No dominant keywords detected for this focus set.</em></p>`; }
            break;
        case 'synergy':
            content = `<h4>Synergies & Tensions</h4>`; if (currentTapestryAnalysis.synergies.length > 0) { content += `<h5>Synergies:</h5><ul>${currentTapestryAnalysis.synergies.map(s => `<li>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p><em>No direct synergies detected between focused concepts.</em></p>`; }
            break;
        default: content = `<p><em>Analysis for '${nodeId}' not available.</em></p>`;
    }
    UI.updateDeepDiveContent(content, nodeId); if (costApplied) UI.updateInsightDisplays();
}

 function handleContemplationNodeClick() {
    const now = Date.now(); const cooldownEnd = State.getContemplationCooldownEnd();
    if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / (1000 * 60)); UI.showTemporaryMessage(`Contemplation available in ${remaining} minutes.`, 3000); return; }
    if (spendInsight(CONTEMPLATION_COST, "Focused Contemplation")) { const contemplation = generateFocusedContemplation(); if (contemplation) { UI.displayContemplationTask(contemplation); State.setContemplationCooldown(CONTEMPLATION_COOLDOWN); } else { UI.updateDeepDiveContent("<p><em>Could not generate a contemplation task at this time.</em></p>", 'contemplation'); gainInsight(CONTEMPLATION_COST, "Refund: Contemplation Generation Failed"); } }
}

function generateFocusedContemplation() {
    if (!currentTapestryAnalysis) { console.error("Cannot generate contemplation: Tapestry analysis missing."); return null; }
    const contemplationTypes = ['Reflection', 'Mini-Ritual', 'Tapestry Resonance', 'Interaction Task', 'Element Synergy Task'];
    const selectedType = contemplationTypes[Math.floor(Math.random() * contemplationTypes.length)];
    const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); const focusedConceptsArray = Array.from(focused).map(id => disc.get(id)?.concept).filter(Boolean);
    let task = { type: selectedType, text: "Default contemplation text.", reward: { type: 'insight', amount: 2 }, requiresCompletionButton: false };

    try {
        switch (selectedType) {
            case 'Reflection':
                const keywordPool = currentTapestryAnalysis.topKeywords;
                if (keywordPool.length > 0) { const kw = keywordPool[Math.floor(Math.random() * keywordPool.length)].keyword; task.text = `Your focus highlights the theme of **'${kw}'**. Reflect on how this theme manifests in your desires or experiences. Consider adding a note to a relevant concept.`; task.reward = { type: 'insight', amount: 3 }; }
                else { if (focusedConceptsArray.length === 0) break; const randomConcept = focusedConceptsArray[Math.floor(Math.random() * focusedConceptsArray.length)]; task.text = `Reflect deeply on **${randomConcept.name}**. What nuance or hidden aspect emerges when you consider it alongside your other focused concepts?`; task.reward = { type: 'insight', amount: 3 }; }
                task.requiresCompletionButton = true;
                break;
            case 'Mini-Ritual':
                const elementPool = currentTapestryAnalysis.dominantElements;
                if (elementPool.length > 0) { const el = elementPool[Math.floor(Math.random() * elementPool.length)]; let action = "observe an interaction involving this element"; if (el.key === 'S') action = "mindfully experience one physical sensation related to this element"; else if (el.key === 'P') action = "acknowledge one emotion linked to this element without judgment"; else if (el.key === 'C') action = "analyze one assumption related to this element"; else if (el.key === 'R') action = "consider one relationship boundary influenced by this element"; else if (el.key === 'A') action = "notice one thing that subtly attracts or repels you, related to this element"; task.text = `Your focus resonates with **${el.name}**. Today's mini-ritual: ${action}.`; task.reward = { type: 'attunement', element: el.key, amount: 0.5 }; }
                else { task.text = "Today's mini-ritual: Take 60 seconds to consciously breathe and center yourself, acknowledging your current inner state."; task.reward = { type: 'attunement', element: 'All', amount: 0.1 }; }
                task.requiresCompletionButton = true;
                break;
            case 'Tapestry Resonance':
                 if (focusedConceptsArray.length > 0) { const conceptNames = focusedConceptsArray.map(c => `**${c.name}**`); task.text = `Meditate briefly on the combined energy of your focused concepts: ${conceptNames.join(', ')}. What overall feeling or image emerges from this blend?`; task.reward = { type: 'insight', amount: 2 }; gainAttunementForAction('contemplation', 'All', 0.2); }
                 else { task.text = "Meditate on the feeling of potential within your empty focus slots."; task.reward = { type: 'insight', amount: 1 }; }
                 task.requiresCompletionButton = true;
                break;
            case 'Interaction Task':
                 if (currentTapestryAnalysis.synergies.length > 0) { const syn = currentTapestryAnalysis.synergies[Math.floor(Math.random() * currentTapestryAnalysis.synergies.length)]; const [nameA, nameB] = syn.concepts; const conceptA = focusedConceptsArray.find(c => c.name === nameA); task.text = `Focus links **${nameA}** and **${nameB}**. In the 'My Notes' section for **${nameA}**, write one sentence about how **${nameB}** might amplify or alter its expression.`; task.reward = { type: 'insight', amount: 4 }; }
                 else if (focusedConceptsArray.length >= 2) { const [c1, c2] = focusedConceptsArray.sort(() => 0.5 - Math.random()); task.text = `Consider **${c1.name}** and **${c2.name}**. In the 'My Notes' section for one of them, explore how their energies might combine or conflict.`; task.reward = { type: 'insight', amount: 3 }; }
                 else { task.text = "Consider the primary element of your focused concept. How might another concept (even one not focused) interact with it?"; task.reward = { type: 'insight', amount: 2 }; }
                 break; // No completion button needed
            case 'Element Synergy Task':
                 if (currentTapestryAnalysis.dominantElements.length >= 2) { const [el1, el2] = currentTapestryAnalysis.dominantElements; task.text = `Your focus strongly blends **${el1.name}** and **${el2.name}**. Spend a moment contemplating how these two elemental forces interact in your ideal experiences.`; gainAttunementForAction('contemplation', el1.key, 0.3); gainAttunementForAction('contemplation', el2.key, 0.3); task.reward = { type: 'insight', amount: 1 }; }
                 else if (currentTapestryAnalysis.dominantElements.length === 1) { const el1 = currentTapestryAnalysis.dominantElements[0]; task.text = `Your focus heavily emphasizes **${el1.name}**. Contemplate one aspect of this element you'd like to understand more deeply.`; gainAttunementForAction('contemplation', el1.key, 0.4); task.reward = { type: 'insight', amount: 1 }; }
                 else { task.text = "Contemplate the balance between all six elements within yourself."; gainAttunementForAction('contemplation', 'All', 0.1); task.reward = { type: 'insight', amount: 1 }; }
                 task.requiresCompletionButton = true;
                 break;
            default: task.text = "Take a moment to review your focused concepts and the insights gained so far."; task.reward = { type: 'insight', amount: 1 }; task.requiresCompletionButton = true;
        }
    } catch (error) { console.error("Error generating contemplation task:", error); return { type: "Error", text: "An error occurred while generating a contemplation task.", reward: { type: 'none' }, requiresCompletionButton: false }; }
    task.text = task.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return task;
}

 function handleCompleteContemplation(task) {
    if (!task || !task.reward) return;
    console.log(`Contemplation task completed: ${task.type}`);
    if (task.reward.type === 'insight') { gainInsight(task.reward.amount, `Contemplation Task`); }
    else if (task.reward.type === 'attunement') { if (task.type !== 'Mini-Ritual' && task.type !== 'Element Synergy Task') { gainAttunementForAction('contemplation', task.reward.element || 'All', task.reward.amount || 0); } else { console.log("Attunement likely granted during generation for Mini-Ritual/Element Synergy."); } }
    if(task.reward.plusAttunement) { gainAttunementForAction('contemplation', task.reward.plusAttunement.element || 'All', task.reward.plusAttunement.amount || 0); }
    UI.showTemporaryMessage("Contemplation complete!", 2500);
    UI.clearContemplationTask();
}


// *** Ensure ALL necessary functions are exported ***
export {
    // Questionnaire
    handleQuestionnaireInputChange,
    handleCheckboxChange,
    calculateElementScore,
    goToNextElement,
    goToPrevElement,
    finalizeQuestionnaire,
    // Core Logic & Actions
    gainInsight,
    spendInsight,
    gainAttunementForAction,
    addConceptToGrimoireById,
    addConceptToGrimoireInternal,
    handleToggleFocusConcept,
    handleResearchClick,
    handleFreeResearchClick,
    conductResearch,
    attemptArtEvolution,
    handleSaveNote,
    handleSellConcept,
    // Reflection
    checkTriggerReflectionPrompt,
    triggerReflectionPrompt,
    handleConfirmReflection,
    triggerGuidedReflection,
    // Library
    handleUnlockLibraryLevel,
    // Repository
    handleMeditateScene,
    handleAttemptExperiment,
    // Persona Calculation Helpers
    calculateFocusScores,
    calculateTapestryNarrative,
    calculateFocusThemes,
    // Focus Unlocks
    checkForFocusUnlocks,
    // Daily Login
    checkForDailyLogin,
    // Milestones & Rituals
    updateMilestoneProgress,
    checkAndUpdateRituals,
    // Popup State Management
    clearPopupState,
    setCurrentPopupConcept,
    getCurrentPopupConceptId,
    // Screen Logic Wrappers
    displayPersonaScreenLogic,
    displayStudyScreenLogic,
    // Tapestry Deep Dive
    showTapestryDeepDive,
    handleDeepDiveNodeClick,
    handleContemplationNodeClick,
    handleCompleteContemplation // <<< KEEP ONLY ONE ENTRY
    // Expose analysis if needed (usually not)
    // currentTapestryAnalysis
};

console.log("gameLogic.js loaded.");
