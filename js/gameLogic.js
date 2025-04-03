import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as UI from './ui.js';
// Import specific data structures needed
import { elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals, sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames, elementInteractionThemes, cardTypeThemes } from '../data.js';

console.log("gameLogic.js loading...");

// --- Temporary State ---
let currentlyDisplayedConceptId = null;
let currentReflectionContext = null;
let reflectionTargetConceptId = null;
let currentReflectionCategory = null;
let currentPromptId = null;
let reflectionCooldownTimeout = null; // Used for *reflection* prompt cooldown, not contemplation

// --- Tapestry Analysis Cache ---
let currentTapestryAnalysis = null; // Stores the detailed breakdown from calculateTapestryNarrative

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

// Helper to check if an action is allowed in the current phase
function isActionAllowed(requiredPhase) {
    const currentPhase = State.getOnboardingPhase();
    if (currentPhase >= requiredPhase) {
        return true;
    } else {
        console.warn(`Action blocked: Requires phase ${requiredPhase}, currently in phase ${currentPhase}.`);
        // Optionally show a message, but be careful not to spam
        // UI.showTemporaryMessage("Unlock this feature by progressing further.", 2500);
        return false;
    }
}

// --- Insight & Attunement Management ---
function gainInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount === 0) return;
    const changed = State.changeInsight(amount);
    if (changed) {
        const action = amount > 0 ? "Gained" : "Spent";
        const currentInsight = State.getInsight();
        console.log(`${action} ${Math.abs(amount).toFixed(1)} Insight from ${source}. New total: ${currentInsight.toFixed(1)}`);
        UI.updateInsightDisplays(); // Update UI after insight change
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

    if (elementKey && State.getAttunement().hasOwnProperty(elementKey)) {
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
         } else if (elementKey && State.getAttunement().hasOwnProperty(elementKey)) {
              targetKeys.push(elementKey); // Fallback
         } else {
             console.warn(`Could not determine target element for reflection context: ${currentReflectionContext}, category: ${currentReflectionCategory}, prompt: ${currentPromptId}`);
             targetKeys = Object.keys(State.getAttunement()); // Fallback to all elements with reduced gain
             baseAmount = 0.1;
         }

    } else if (['generic', 'completeReflectionGeneric', 'scoreNudge', 'ritual', 'milestone', 'experimentSuccess', 'artEvolve', 'addToGrimoire', 'discover', 'markFocus', 'contemplation', 'researchSuccess', 'researchFail', 'researchSpecial'].includes(actionType) || elementKey === 'All') {
        targetKeys = Object.keys(State.getAttunement());
        // Adjust base amount based on action type for 'All' elements scenarios
        if (actionType === 'scoreNudge') baseAmount = (0.5 / (targetKeys.length || 1));
        else if (actionType === 'completeReflectionGeneric') baseAmount = 0.2;
        else if (actionType === 'generic') baseAmount = 0.1;
        else if (actionType === 'contemplation' && elementKey === 'All') baseAmount = 0.1;
        else if (actionType === 'contemplation' && elementKey !== 'All') baseAmount = 0.4; // Higher specific gain
        else if (actionType === 'researchSuccess') baseAmount = 0.8;
        else if (actionType === 'researchFail') baseAmount = 0.2;
        else if (actionType === 'researchSpecial') baseAmount = 1.0;
        // Keep default baseAmount for others like 'ritual', 'milestone', 'artEvolve', etc.
    } else {
        console.warn(`gainAttunement called with invalid parameters or context: action=${actionType}, key=${elementKey}, context=${currentReflectionContext}, category=${currentReflectionCategory}`);
        return;
    }

    let changed = false;
    targetKeys.forEach(key => {
        if (State.updateAttunement(key, baseAmount)) {
            changed = true;
            updateMilestoneProgress('elementAttunement', { [key]: State.getAttunement()[key] }); // Specific element update
            updateMilestoneProgress('elementAttunement', State.getAttunement()); // Generic check for 'all' or 'any' milestones
        }
    });

    if (changed) {
        console.log(`Attunement updated (${actionType}, Key(s): ${targetKeys.join(',') || 'None'}) by ${baseAmount.toFixed(2)} per element.`);
        // Update Persona screen attunement display if it's the current screen
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

    if (type === 'slider') {
        UI.updateSliderFeedbackText(input, elementName); // Pass element name
    }
    // Get answers *after* slider feedback is updated but *before* saving state
    const currentAnswers = UI.getQuestionnaireAnswers();
    State.updateAnswers(elementName, currentAnswers); // Save to state (no auto-save)
    UI.updateDynamicFeedback(elementName, currentAnswers); // Update dynamic score display
}
function handleCheckboxChange(event) {
     const checkbox = event.target; const name = checkbox.name; const maxChoices = parseInt(checkbox.dataset.maxChoices || 2);
     const container = checkbox.closest('.checkbox-options'); if (!container) return;
     const checkedBoxes = container.querySelectorAll(`input[name="${name}"]:checked`);
     if (checkedBoxes.length > maxChoices) { UI.showTemporaryMessage(`Max ${maxChoices} options.`, 2500); checkbox.checked = false; }
     handleQuestionnaireInputChange(event); // Update state and feedback
}
function calculateElementScore(elementName, answersForElement) {
    const questions = questionnaireGuided[elementName] || []; let score = 5.0;
    questions.forEach(q => {
        const answer = answersForElement[q.qId]; let pointsToAdd = 0; const weight = q.scoreWeight || 1.0;
        if (q.type === 'slider') { const value = (answer !== undefined && !isNaN(answer)) ? parseFloat(answer) : q.defaultValue; const baseValue = q.defaultValue !== undefined ? q.defaultValue : 5; pointsToAdd = (value - baseValue) * weight; }
        else if (q.type === 'radio') { const opt = q.options.find(o => o.value === answer); pointsToAdd = opt ? (opt.points || 0) * weight : 0; }
        else if (q.type === 'checkbox' && Array.isArray(answer)) { answer.forEach(val => { const opt = q.options.find(o => o.value === val); pointsToAdd += opt ? (opt.points || 0) * weight : 0; }); }
        score += pointsToAdd;
    }); return Math.max(0, Math.min(10, score)); // Clamp
}
function goToNextElement() {
    const currentState = State.getState();
    const currentAnswers = UI.getQuestionnaireAnswers(); // Get answers from UI first
    if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) {
        State.updateAnswers(elementNames[currentState.currentElementIndex], currentAnswers); // Save answers for current element
    }
    const nextIndex = currentState.currentElementIndex + 1;
    if (nextIndex >= elementNames.length) {
         finalizeQuestionnaire(); // Handles final save and state transition
    } else {
        State.updateElementIndex(nextIndex); UI.displayElementQuestions(nextIndex);
    }
}
function goToPrevElement() {
    const currentState = State.getState();
    if (currentState.currentElementIndex > 0) {
        const currentAnswers = UI.getQuestionnaireAnswers(); // Get current answers
        if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) {
             State.updateAnswers(elementNames[currentState.currentElementIndex], currentAnswers); // Save current element's answers
        }
        const prevIndex = currentState.currentElementIndex - 1;
        State.updateElementIndex(prevIndex); UI.displayElementQuestions(prevIndex);
    }
}
function finalizeQuestionnaire() {
    console.log("Finalizing questionnaire...");
    // 1. Save final answers (should be done by goToNextElement call)
    // 2. Calculate final scores
    const finalScores = {};
    const allAnswers = State.getState().userAnswers;
    elementNames.forEach(elementName => {
        const score = calculateElementScore(elementName, allAnswers[elementName] || {});
        const key = elementNameToKey[elementName];
        if (key) finalScores[key] = score; else console.warn(`No key for ${elementName}`);
    });
    State.updateScores(finalScores);
    State.saveAllAnswers(allAnswers); // Explicitly save all collected answers
    // 3. Set questionnaire complete and advance phase
    State.setQuestionnaireComplete(); // This advances to Phase 1
    // 4. Determine starter hand
    determineStarterHandAndEssence();
    // 5. Update milestones and check login
    updateMilestoneProgress('completeQuestionnaire', 1);
    checkForDailyLogin(); // Check daily login status

    // 6. Prepare UI Data *before* showing screens
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter();
    UI.populateGrimoireFilters();
    UI.displayDailyRituals(); // Display initial state (likely empty/locked)
    UI.refreshGrimoireDisplay(); // Render grimoire content
    calculateTapestryNarrative(true); // Calculate initial narrative
    UI.displayPersonaSummary(); // Prepare summary view
    // --- End Prepare UI Data ---

    // 7. Apply phase UI and show the initial screen
    UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); // Apply Phase 1 UI
    console.log("Final User Scores:", State.getScores());
    UI.showScreen('personaScreen'); // LAND ON PERSONA SCREEN
    UI.showTemporaryMessage("Experiment Complete! View your Persona & Grimoire.", 4000);
    // Suggest next action via tooltip or message
    UI.showTemporaryMessage("Hint: Explore the Grimoire and 'Focus' on concepts that resonate!", 6000);
}

// --- Starter Hand ---
function determineStarterHandAndEssence() {
    console.log("Determining starter hand...");
    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) { console.error("Concepts missing."); return; }
    const userScores = State.getScores();
    let conceptsWithDistance = concepts.map(c => ({ ...c, distance: Utils.euclideanDistance(userScores, c.elementScores) })).filter(c => c.distance !== Infinity && !isNaN(c.distance));
    if (conceptsWithDistance.length === 0) { console.error("Distance calculation failed or no valid concepts."); const defaultStarters = concepts.slice(0, 5); defaultStarters.forEach(c => { if (State.addDiscoveredConcept(c.id, c)) gainAttunementForAction('discover', c.primaryElement, 0.3); }); console.warn("Granted default starter concepts."); UI.updateGrimoireCounter(); return; }
    conceptsWithDistance.sort((a, b) => a.distance - b.distance);
    const candidates = conceptsWithDistance.slice(0, 25); const starterHand = []; const starterHandIds = new Set(); const targetHandSize = 7; const elementRepTarget = 4; const representedElements = new Set();
    // Prioritize closest matches first
    for (const c of candidates) { if (starterHand.length >= 4) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } }
    // Ensure some elemental diversity if needed
    for (const c of candidates) { if (starterHand.length >= targetHandSize) break; if (starterHandIds.has(c.id)) continue; const needsRep = c.primaryElement && representedElements.size < elementRepTarget && !representedElements.has(c.primaryElement); if (needsRep || starterHand.length < 5) { starterHand.push(c); starterHandIds.add(c.id); if (c.primaryElement) representedElements.add(c.primaryElement); } }
    // Fill remaining slots with closest available
    for (const c of candidates) { if (starterHand.length >= targetHandSize) break; if (!starterHandIds.has(c.id)) { starterHand.push(c); starterHandIds.add(c.id); } }
    console.log("Starter Hand Selected:", starterHand.map(c => c.name));
    starterHand.forEach(c => { if (State.addDiscoveredConcept(c.id, c)) gainAttunementForAction('discover', c.primaryElement, 0.3); });
    updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size); UI.updateGrimoireCounter();
}


// --- Core Actions (Research, Reflection, Focus, etc.) ---
// Screen Logic Wrappers
function displayPersonaScreenLogic() {
    if (!isActionAllowed(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE)) return;
    calculateTapestryNarrative(true); // Ensure data is fresh
    UI.displayPersonaScreen(); // Render the screen content
    // Button state updates handled within displayPersonaScreen/applyOnboardingPhaseUI
}
function displayStudyScreenLogic() {
    if (!isActionAllowed(Config.ONBOARDING_PHASE.STUDY_INSIGHT)) return;
    UI.displayStudyScreenContent();
}

// Research Actions
function handleResearchClick(event) {
    if (!isActionAllowed(Config.ONBOARDING_PHASE.STUDY_INSIGHT)) return;
    const button = event.currentTarget; const elementKey = button.dataset.elementKey; const cost = parseFloat(button.dataset.cost);
    if (!elementKey || isNaN(cost) || button.disabled) return;
    if (spendInsight(cost, `Research: ${elementKeyToFullName[elementKey]}`)) {
        console.log(`Spent ${cost} Insight on ${elementKey}.`);
        conductResearch(elementKey);
        updateMilestoneProgress('conductResearch', 1);
        checkAndUpdateRituals('conductResearch');
        // ---- NEW FLOW TRIGGER: First paid research -> Phase 3 ----
        if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
             State.advanceOnboardingPhase(Config.ONBOARDING_PHASE.REFLECTION_RITUALS);
             UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); // Update UI for new phase
             UI.showTemporaryMessage("Reflection & Rituals Unlocked!", 3500);
        }
        // ---- END NEW FLOW TRIGGER ----
    }
}
function handleFreeResearchClick() {
    // Allow free research even if Study isn't fully unlocked? Let's tie it to Study unlock for simplicity.
    if (!isActionAllowed(Config.ONBOARDING_PHASE.STUDY_INSIGHT)) return;
    if (!State.isFreeResearchAvailable()) { UI.showTemporaryMessage("Daily meditation done.", 3000); return; }
    const attunement = State.getAttunement(); let targetKey = 'A'; let minAtt = Config.MAX_ATTUNEMENT + 1;
    for (const key in attunement) { if (attunement[key] < minAtt) { minAtt = attunement[key]; targetKey = key; } }
    console.log(`Free meditation on ${targetKey} (${elementKeyToFullName[targetKey]})`);
    State.setFreeResearchUsed();
    UI.displayResearchButtons(); // Update button state
    conductResearch(targetKey);
    updateMilestoneProgress('freeResearch', 1);
    checkAndUpdateRituals('freeResearch');
}
function conductResearch(elementKeyToResearch) {
    // No phase check needed here, called by actions that *are* phase-checked
    const elementFullName = elementKeyToFullName[elementKeyToResearch]; if (!elementFullName) { console.error(`Invalid key: ${elementKeyToResearch}`); return; }
    console.log(`Researching: ${elementFullName}`); UI.displayResearchStatus(`Reviewing ${elementDetails[elementFullName]?.name || elementFullName}...`);
    const discoveredIds = new Set(State.getDiscoveredConcepts().keys()); const discoveredRepo = State.getRepositoryItems(); const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));
    let rareFound = false; const roll = Math.random();
    const insightChance = 0.12; // Probability of finding an insight fragment
    const researchOutElem = document.getElementById('researchOutput');
    // Only allow finding rare REPO items if phase allows Repository access
    const canFindRareRepoItem = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED && researchOutElem && (researchOutElem.children.length === 0 || researchOutElem.querySelector('p > i'));
    let foundRepoItem = null;

    // Repository Insight check (Requires Phase 4)
    if (!rareFound && canFindRareRepoItem && roll < insightChance && elementalInsights.length > 0) {
        const relevant = elementalInsights.filter(i => i.element === elementKeyToResearch);
        const unseenRel = relevant.filter(i => !discoveredRepo.insights.has(i.id));
        const anyUnseen = elementalInsights.filter(i => !discoveredRepo.insights.has(i.id));
        const pool = unseenRel.length > 0 ? unseenRel : (anyUnseen.length > 0 ? anyUnseen : relevant);
        if (pool.length > 0) { const found = pool[Math.floor(Math.random() * pool.length)]; if (State.addRepositoryItem('insights', found.id)) { rareFound = true; foundRepoItem = {type: 'insight', ...found}; UI.showTemporaryMessage("Insight Fragment Found!", 3500); updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); if(document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent(); } }
    }
     // Add checks for finding Scenes or Experiments here if desired, also gated by canFindRareRepoItem

    if (rareFound && foundRepoItem) {
        UI.displayResearchResults({ concepts: [], repositoryItems: [foundRepoItem], duplicateInsightGain: 0 });
        UI.displayResearchStatus("Unique insight unearthed!");
        gainAttunementForAction('researchSpecial', elementKeyToResearch); // Use default amount or specify
        return;
    }

    // Concept discovery (Always possible if Study is unlocked)
    if (undiscoveredPool.length === 0) { UI.displayResearchStatus("No more concepts to discover."); if (researchOutElem && researchOutElem.children.length === 0) researchOutElem.innerHTML = '<p><i>Library holds all known concepts.</i></p>'; gainInsight(5.0, "All Concepts Bonus"); return; }
    const currentAtt = State.getAttunement()[elementKeyToResearch] || 0; const priorityP = []; const secondaryP = []; const tertiaryP = [];
    undiscoveredPool.forEach(c => { const score = c.elementScores?.[elementKeyToResearch] || 0; const isPri = c.primaryElement === elementKeyToResearch; if (isPri || score >= 7.5) priorityP.push({...c}); else if (score >= 4.5) secondaryP.push({...c}); else tertiaryP.push({...c}); });
    const selectedOut = []; let dupeGain = 0; const numResults = 3;
    const selectWeighted = () => { /* ... (selectWeighted logic remains the same) ... */
        const pools = [ { pool: priorityP, mult: 3.5 + (currentAtt / 30) }, { pool: secondaryP, mult: 1.5 + (currentAtt / 60) }, { pool: tertiaryP, mult: 0.8 } ];
        let combined = []; let totalW = 0; const attFactor = 1 + (currentAtt / (Config.MAX_ATTUNEMENT * 1.2));
        pools.forEach(({ pool, mult }) => { pool.forEach(card => { let w = 1.0 * mult; if (card.rarity === 'uncommon') w *= (1.3 * attFactor); else if (card.rarity === 'rare') w *= (0.6 * attFactor); else w *= (1.0 * attFactor); w = Math.max(0.1, w); totalW += w; combined.push({ card, w }); }); });
        if (combined.length === 0) return null; let pick = Math.random() * totalW;
        for (let i = 0; i < combined.length; i++) { const item = combined[i]; if (pick < item.w) { [priorityP, secondaryP, tertiaryP].forEach(p => { const idx = p.findIndex(c => c.id === item.card.id); if (idx > -1) p.splice(idx, 1); }); return item.card; } pick -= item.w; }
         const flatP = [...priorityP, ...secondaryP, ...tertiaryP]; if (flatP.length > 0) { const idx = Math.floor(Math.random() * flatP.length); const card = flatP[idx]; [priorityP, secondaryP, tertiaryP].forEach(p => { const i = p.findIndex(c => c.id === card.id); if (i > -1) p.splice(i, 1); }); console.warn("Weighted selection failed, falling back to flat random."); return card; } return null;
    };
    let attempts = 0; const maxAtt = numResults * 4;
    while (selectedOut.length < numResults && attempts < maxAtt && (priorityP.length > 0 || secondaryP.length > 0 || tertiaryP.length > 0)) {
        attempts++; let potential = selectWeighted();
        if (potential) { if (discoveredIds.has(potential.id)) { gainInsight(1.0, `Dupe (${potential.name})`); dupeGain += 1.0; } else { if (!selectedOut.some(c => c.id === potential.id)) selectedOut.push(potential); } } else break;
    }
    let msg = "";
    if (selectedOut.length > 0) { msg = `Discovered ${selectedOut.length} new concept(s)! `; UI.displayResearchResults({ concepts: selectedOut, repositoryItems: [], duplicateInsightGain: dupeGain }); gainAttunementForAction('researchSuccess', elementKeyToResearch); if (selectedOut.some(c => c.rarity === 'rare')) updateMilestoneProgress('discoverRareCard', 1); }
    else { msg = "No new concepts found. "; UI.displayResearchResults({ concepts: [], repositoryItems: [], duplicateInsightGain: dupeGain }); gainAttunementForAction('researchFail', elementKeyToResearch); }
    if (dupeGain > 0 && selectedOut.length === 0) msg += ` Gained ${dupeGain.toFixed(0)} Insight from echoes.`;
    UI.displayResearchStatus(msg.trim());
}

// Grimoire Actions
function addConceptToGrimoireById(conceptId, buttonElement = null) {
    // No phase check here - adding can happen from research before study is fully "unlocked" visually
    if (State.getDiscoveredConcepts().has(conceptId)) { UI.showTemporaryMessage("Already in Grimoire.", 2500); if (buttonElement) UI.updateResearchButtonAfterAction(conceptId, 'add'); return; }
    const concept = concepts.find(c => c.id === conceptId); if (!concept) { console.error("Cannot add concept: Not found. ID:", conceptId); UI.showTemporaryMessage("Error: Concept not found.", 3000); return; }
    const distance = Utils.euclideanDistance(State.getScores(), concept.elementScores);
    // Dissonance reflection only triggers if reflections are unlocked (Phase 3+)
    if (distance > Config.DISSONANCE_THRESHOLD && isActionAllowed(Config.ONBOARDING_PHASE.REFLECTION_RITUALS)) {
        console.log(`Dissonance on ${concept.name}. Triggering reflection.`);
        triggerReflectionPrompt('Dissonance', concept.id);
    } else {
        addConceptToGrimoireInternal(conceptId);
    }
 }

function addConceptToGrimoireInternal(conceptId) {
     const conceptToAdd = concepts.find(c => c.id === conceptId);
     if (!conceptToAdd) { console.error("Internal add fail: Not found. ID:", conceptId); return; }
     if (State.getDiscoveredConcepts().has(conceptId)) return; // Already added

     console.log(`Adding ${conceptToAdd.name} internally.`);

     if (State.addDiscoveredConcept(conceptId, conceptToAdd)) {
         let insightRwd = Config.CONCEPT_DISCOVERY_INSIGHT[conceptToAdd.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
         let bonusInsight = 0;
         let synergyMessageShown = false;

         // Synergy Checks
         if (conceptToAdd.relatedIds && conceptToAdd.relatedIds.length > 0) {
             const discoveredMap = State.getDiscoveredConcepts();
             const undiscoveredRelated = conceptToAdd.relatedIds.filter(id => !discoveredMap.has(id));
             // Bonus for already discovered
             for (const relatedId of conceptToAdd.relatedIds) {
                 if (discoveredMap.has(relatedId)) {
                     bonusInsight += Config.SYNERGY_INSIGHT_BONUS;
                     if (!synergyMessageShown) {
                         const relatedConcept = discoveredMap.get(relatedId)?.concept;
                         UI.showTemporaryMessage(`Synergy Bonus: +${Config.SYNERGY_INSIGHT_BONUS.toFixed(1)} Insight (Related to ${relatedConcept?.name || 'known concept'})`, 3500);
                         synergyMessageShown = true;
                     }
                 }
             }
             // Chance to discover related (Only if advanced enough? Let's allow it from Phase 2+)
             if (isActionAllowed(Config.ONBOARDING_PHASE.STUDY_INSIGHT) && undiscoveredRelated.length > 0 && Math.random() < Config.SYNERGY_DISCOVERY_CHANCE) {
                 const relatedIdToDiscover = undiscoveredRelated[Math.floor(Math.random() * undiscoveredRelated.length)];
                 const relatedConceptData = concepts.find(c => c.id === relatedIdToDiscover);
                 if (relatedConceptData) {
                      UI.displayResearchResults({ concepts: [relatedConceptData], repositoryItems: [], duplicateInsightGain: 0 });
                      UI.showTemporaryMessage(`Synergy Resonance: ${conceptToAdd.name} illuminated ${relatedConceptData.name}! (Check Notes)`, 5000);
                      console.log(`Synergy discovery: Revealed ${relatedConceptData.name} (ID: ${relatedIdToDiscover})`);
                 }
             }
         }

         insightRwd += bonusInsight;
         gainInsight(insightRwd, `Discovered ${conceptToAdd.rarity} ${conceptToAdd.name}${bonusInsight > 0 ? ' (Synergy)' : ''}`);
         gainAttunementForAction('addToGrimoire', conceptToAdd.primaryElement, 0.6);
         UI.updateGrimoireCounter();

         // Queue rare prompts regardless of phase, they trigger later
         if (conceptToAdd.rarity === 'rare' && conceptToAdd.uniquePromptId && reflectionPrompts.RareConcept?.[conceptToAdd.uniquePromptId]) {
             State.addPendingRarePrompt(conceptToAdd.uniquePromptId);
             console.log(`Queued rare prompt ${conceptToAdd.uniquePromptId}`);
         }

         // Update UI elements if the concept popup is currently open
         if (currentlyDisplayedConceptId === conceptId) {
             const inResearch = !State.getDiscoveredConcepts().has(conceptId) && researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
             UI.updateGrimoireButtonStatus(conceptId, !!inResearch); // Should now be disabled
             UI.updateFocusButtonStatus(conceptId); // Now available
             UI.updatePopupSellButton(conceptId, conceptToAdd, true, false); // Now show Grimoire context sell
             UI.updateNotesSectionVisibility(true); // Show notes if phase allows
             UI.updateEvolutionSectionVisibility(conceptToAdd, State.getDiscoveredConceptData(conceptId)); // Show evo if phase allows
         }

         UI.updateResearchButtonAfterAction(conceptId, 'add'); // Remove from research notes UI

         // Trigger reflection checks only if reflections are unlocked
         if (isActionAllowed(Config.ONBOARDING_PHASE.REFLECTION_RITUALS)) {
            checkTriggerReflectionPrompt('add');
         }
         updateMilestoneProgress('addToGrimoire', 1);
         updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size);
         checkAndUpdateRituals('addToGrimoire'); // Update rituals (might complete one)
         UI.refreshGrimoireDisplay(); // Refresh grimoire view if it's active
         UI.showTemporaryMessage(`${conceptToAdd.name} added to Grimoire!`, 3000);

     } else { console.warn(`State add fail ${conceptToAdd.name}.`); UI.showTemporaryMessage(`Error adding ${conceptToAdd.name}.`, 3000); }
 }

function handleToggleFocusConcept() {
    // Focusing is central to Phase 1
    if (!isActionAllowed(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE)) return;
    if (currentlyDisplayedConceptId === null) return;
    const conceptId = currentlyDisplayedConceptId;
    const result = State.toggleFocusConcept(conceptId); // This now handles the phase 2 trigger internally

    const conceptName = State.getDiscoveredConceptData(conceptId)?.concept?.name || `ID ${conceptId}`;

    if (result === 'not_discovered') { UI.showTemporaryMessage("Cannot focus undiscovered concept.", 3000); }
    else if (result === 'slots_full') { UI.showTemporaryMessage(`Focus slots full (${State.getFocusSlots()}).`, 3000); }
    else {
         if (result === 'removed') {
              UI.showTemporaryMessage(`${conceptName} removed from Focus.`, 2500); checkAndUpdateRituals('removeFocus');
         } else { // added
              UI.showTemporaryMessage(`${conceptName} marked as Focus!`, 2500); gainInsight(1.0, `Focused on ${conceptName}`);
              const concept = State.getDiscoveredConceptData(conceptId)?.concept; if (concept?.primaryElement) gainAttunementForAction('markFocus', concept.primaryElement, 1.0);
              updateMilestoneProgress('markFocus', 1); updateMilestoneProgress('focusedConcepts.size', State.getFocusedConcepts().size); checkAndUpdateRituals('markFocus');
               // If phase advanced to STUDY_INSIGHT, update UI
              if(State.getOnboardingPhase() === Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
                 UI.applyOnboardingPhaseUI(Config.ONBOARDING_PHASE.STUDY_INSIGHT);
                 UI.showTemporaryMessage("Study Unlocked! Research new concepts.", 3500);
              }
         }
         // --- Update UI for both add/remove ---
         UI.updateFocusButtonStatus(conceptId); // Update button in popup
         UI.displayFocusedConceptsPersona(); // Update tapestry display
         UI.updateFocusElementalResonance(); // Update resonance bars
         calculateTapestryNarrative(true); // Recalculate narrative
         UI.generateTapestryNarrative(); // Display narrative
         UI.synthesizeAndDisplayThemesPersona(); // Update themes list
         if (isActionAllowed(Config.ONBOARDING_PHASE.ADVANCED)) {
             checkForFocusUnlocks(); // Check unlocks only if advanced features are available
         }
         UI.refreshGrimoireDisplay(); // Update card stamps in grimoire view
         UI.updateTapestryDeepDiveButton(); // Update state of Explore button
         UI.updateSuggestSceneButtonState(); // Update state of Suggest button
    }
}
function handleSellConcept(event) {
     if (!isActionAllowed(Config.ONBOARDING_PHASE.STUDY_INSIGHT)) return; // Selling requires Phase 2
     const button = event.target.closest('button'); if (!button) return;
     const conceptId = parseInt(button.dataset.conceptId);
     const context = button.dataset.context;
     if (isNaN(conceptId)) { console.error("Invalid sell ID:", button.dataset.conceptId); return; }
     sellConcept(conceptId, context);
}
function sellConcept(conceptId, context) { // Internal logic, assumes phase check done by handler
    const discovered = State.getDiscoveredConceptData(conceptId);
    const concept = discovered?.concept || concepts.find(c => c.id === conceptId);
    if (!concept) { console.error(`Sell fail: Not found ${conceptId}`); UI.showTemporaryMessage("Error selling.", 3000); return; }

    let val = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
    const sellVal = val * Config.SELL_INSIGHT_FACTOR;
    const sourceLoc = context === 'grimoire' ? 'Grimoire' : 'Research Notes';

    if (confirm(`Sell '${concept.name}' (${concept.rarity}) from ${sourceLoc} for ${sellVal.toFixed(1)} Insight?`)) {
        gainInsight(sellVal, `Sold: ${concept.name}`);
        updateMilestoneProgress('sellConcept', 1);

        let focusChanged = false;
        if (context === 'grimoire') {
             focusChanged = State.getFocusedConcepts().has(conceptId);
             if(State.removeDiscoveredConcept(conceptId)) {
                 UI.updateGrimoireCounter();
                 UI.refreshGrimoireDisplay(); // Update Grimoire view immediately
             }
        }
        else if (context === 'research') {
             UI.updateResearchButtonAfterAction(conceptId, 'sell'); // Remove from research notes view
        }

        // If focus changed, update persona screen elements
        if (focusChanged) {
            UI.displayFocusedConceptsPersona();
            UI.updateFocusElementalResonance();
            calculateTapestryNarrative(true);
            UI.generateTapestryNarrative();
            UI.synthesizeAndDisplayThemesPersona();
            if (isActionAllowed(Config.ONBOARDING_PHASE.ADVANCED)) { checkForFocusUnlocks(); }
            UI.updateTapestryDeepDiveButton();
            UI.updateSuggestSceneButtonState();
        }
        UI.showTemporaryMessage(`Sold ${concept.name} for ${sellVal.toFixed(1)} Insight.`, 2500);
        if (currentlyDisplayedConceptId === conceptId) UI.hidePopups(); // Close popup if the sold concept was open
    }
}

// Reflection Logic
function checkTriggerReflectionPrompt(triggerAction = 'other') {
    // Reflection only active from Phase 3 onwards
    if (!isActionAllowed(Config.ONBOARDING_PHASE.REFLECTION_RITUALS)) return;

    const currentState = State.getState();
    if (currentState.promptCooldownActive) return;
    if (triggerAction === 'add') State.incrementReflectionTrigger();
    // Removed questionnaire trigger, handled separately or not needed

    const cardsAdded = currentState.cardsAddedSinceLastPrompt;
    const triggerThresh = 3;
    const hasPending = currentState.pendingRarePrompts.length > 0;

    if (hasPending) {
        console.log("Pending rare prompt found.");
        triggerReflectionPrompt('RareConcept'); // Trigger rare first
        State.resetReflectionTrigger(true); // Reset counter and start cooldown
        startReflectionCooldown();
    }
    else if (cardsAdded >= triggerThresh) {
        console.log("Reflection trigger threshold met.");
        triggerReflectionPrompt('Standard'); // Trigger standard reflection
        State.resetReflectionTrigger(true); // Reset counter and start cooldown
        startReflectionCooldown();
    }
}
 function startReflectionCooldown() {
    if (reflectionCooldownTimeout) clearTimeout(reflectionCooldownTimeout);
    State.setPromptCooldownActive(true);
    reflectionCooldownTimeout = setTimeout(() => {
        State.clearReflectionCooldown(); // Use state function to clear and save
        console.log("Reflection cooldown ended.");
        reflectionCooldownTimeout = null;
        // No explicit save needed here, State.clearReflectionCooldown handles it
    }, 1000 * 60 * 3); // 3 min cooldown
 }
 function triggerReflectionPrompt(context = 'Standard', targetId = null, category = null) {
    // Assumes phase check was done by caller (checkTriggerReflectionPrompt, triggerGuidedReflection, meditateOnScene)
    currentReflectionContext = context;
    reflectionTargetConceptId = (context === 'Dissonance' || context === 'SceneMeditation') ? targetId : null;
    currentReflectionCategory = category; // Store passed category (for Guided)
    currentPromptId = null;
    let promptPool = [];
    let title = "Moment for Reflection";
    let promptCatLabel = "General"; // Display label for the prompt category
    let selPrompt = null;
    let showNudge = false;
    let reward = 5.0; // Base reward

    console.log(`Trigger reflection: Context=${context}, Target=${targetId}, Category=${category}`);

    // Prioritize Rare prompts if available (and context isn't forced like Dissonance)
    if (context !== 'Dissonance') {
        const nextRareId = State.getNextRarePrompt(); // This removes it from the queue
        if (nextRareId) {
            selPrompt = reflectionPrompts.RareConcept?.[nextRareId];
            if (selPrompt) {
                currentReflectionContext = 'RareConcept'; // Update context
                title = "Rare Concept Reflection";
                const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === nextRareId);
                promptCatLabel = cEntry ? cEntry[1].concept.name : "Rare Concept"; // Set display label
                currentPromptId = selPrompt.id;
                reward = 7.0; // Higher reward for rare
                console.log(`Displaying Rare reflection: ${nextRareId}`);
            } else {
                console.warn(`Rare prompt text missing: ${nextRareId}`);
                // Don't fallback here, let the normal logic try standard/guided
            }
        }
    }

    // If no rare prompt was selected, proceed with the requested context
    if (!selPrompt) {
        if (context === 'Dissonance' && targetId) {
            title = "Dissonance Reflection";
            const concept = concepts.find(c => c.id === targetId);
            promptCatLabel = concept ? concept.name : "Dissonant";
            promptPool = reflectionPrompts.Dissonance || [];
            showNudge = true; // Allow nudge only for Dissonance
            console.log(`Looking for Dissonance prompt for ${promptCatLabel}`);
        } else if (context === 'Guided' && category) {
            title = "Guided Reflection";
            promptCatLabel = category; // Use the passed category for display
            promptPool = reflectionPrompts.Guided?.[category] || [];
            reward = Config.GUIDED_REFLECTION_COST + 2; // Reward includes cost refund + bonus
            console.log(`Looking for Guided prompt: ${category}`);
        } else if (context === 'SceneMeditation' && targetId) {
            const scene = sceneBlueprints.find(s => s.id === targetId);
            if (scene?.reflectionPromptId) {
                selPrompt = reflectionPrompts.SceneMeditation?.[scene.reflectionPromptId];
                if (selPrompt) {
                    title = "Scene Meditation";
                    promptCatLabel = scene.name;
                    currentPromptId = selPrompt.id;
                    reward = (scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5;
                    console.log(`Displaying Scene Meditation: ${currentPromptId}`);
                } else {
                    console.warn(`Scene prompt ${scene.reflectionPromptId} missing.`);
                    // Fallback handled below if selPrompt is still null
                }
            } else {
                console.warn(`Scene ${targetId} or prompt ID missing.`);
                // Fallback handled below if selPrompt is still null
            }
        }
        else { // Default to Standard if no other context matched or rare failed
            currentReflectionContext = 'Standard'; // Ensure context is standard
            title = "Standard Reflection";
            const attune = State.getAttunement();
            const validElems = Object.entries(attune).filter(([k, v]) => v > 0).sort(([,a], [,b]) => b - a);
            if (validElems.length > 0) {
                const topTier = validElems.slice(0, Math.ceil(validElems.length / 2));
                const [selKey] = topTier.length > 0 ? topTier[Math.floor(Math.random() * topTier.length)] : validElems[Math.floor(Math.random() * validElems.length)];
                const selName = elementKeyToFullName[selKey];
                promptPool = reflectionPrompts[selName] || [];
                promptCatLabel = elementDetails[selName]?.name || selName;
                currentReflectionCategory = selName; // Store the element name for potential attunement gain
                console.log(`Looking for Standard prompt: ${promptCatLabel}`);
            } else {
                promptPool = [];
                console.warn("No attunement > 0 for Standard reflection.");
            }
        }
    }


    // Select from the pool if no specific prompt (like Scene/Rare) was already found
    if (!selPrompt && promptPool.length > 0) {
        const seen = State.getState().seenPrompts;
        const available = promptPool.filter(p => !seen.has(p.id));
        selPrompt = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : promptPool[Math.floor(Math.random() * promptPool.length)];
        currentPromptId = selPrompt.id; // Store the selected prompt ID
        console.log(`Selected prompt ${currentPromptId} from pool for context ${currentReflectionContext}`);
    }

    // Display or handle failure
    if (selPrompt) {
        const pData = { title, category: promptCatLabel, prompt: selPrompt, showNudge, reward };
        UI.displayReflectionPrompt(pData, currentReflectionContext); // Pass context for potential UI variations
    } else {
        console.error(`Could not select prompt for context: ${context} (Initial or Fallback)`);
        if (context === 'Dissonance' && reflectionTargetConceptId) {
            console.warn("Dissonance reflection failed, adding concept.");
            addConceptToGrimoireInternal(reflectionTargetConceptId); // Add directly
            UI.hidePopups();
            UI.showTemporaryMessage("Reflection unavailable, added concept.", 3500);
        } else if (context === 'Guided') {
            gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt"); // Refund cost
            UI.showTemporaryMessage("No guided reflections available.", 3000);
        } else {
            UI.showTemporaryMessage("No reflection prompt found.", 3000);
        }
        clearPopupState(); // Clear temporary state if reflection failed
    }
}
function handleConfirmReflection(nudgeAllowed) {
    // Assumes reflection is unlocked (Phase 3+) as prompt wouldn't show otherwise
    if (!currentPromptId) { console.error("No current prompt ID."); UI.hidePopups(); return; }
    console.log(`Reflection confirmed: Context=${currentReflectionContext}, Prompt=${currentPromptId}, Nudge=${nudgeAllowed}`);
    State.addSeenPrompt(currentPromptId); // Mark prompt as seen

    // Determine reward based on context
    let rewardAmt = 5.0; let attuneKey = null; let attuneAmt = 1.0; let milestoneAct = 'completeReflection';
    if (currentReflectionContext === 'Guided') { rewardAmt = Config.GUIDED_REFLECTION_COST + 2; }
    else if (currentReflectionContext === 'RareConcept') { rewardAmt = 7.0; }
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); rewardAmt = (scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; }
    else if (currentReflectionContext === 'Dissonance') { rewardAmt = 5.0; } // Dissonance reward
    else { rewardAmt = 5.0; } // Standard reward

    // Handle Dissonance Nudge
    if (currentReflectionContext === 'Dissonance') {
        milestoneAct = 'completeReflectionDissonance'; attuneAmt = 0.5; // Less attunement for dissonance
        if (nudgeAllowed && reflectionTargetConceptId) {
             console.log("Processing nudge..."); const concept = concepts.find(c => c.id === reflectionTargetConceptId); const scores = State.getScores(); let nudged = false;
             if (concept?.elementScores) { const newScores = { ...scores }; for (const key in scores) { if (scores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) { const uScore = scores[key]; const cScore = concept.elementScores[key]; const diff = cScore - uScore; if (Math.abs(diff) > 1.5) { const nudgeVal = Math.sign(diff) * Config.SCORE_NUDGE_AMOUNT; newScores[key] = Math.max(0, Math.min(10, uScore + nudgeVal)); if (newScores[key] !== uScore) nudged = true; } } }
                 if (nudged) { State.updateScores(newScores); console.log("Nudged Scores:", State.getScores()); UI.displayPersonaScreen(); UI.showTemporaryMessage("Core understanding shifted.", 3500); gainAttunementForAction('scoreNudge', 'All', 0.5); updateMilestoneProgress('scoreNudgeApplied', 1); }
             } else { console.warn(`Cannot apply nudge, concept data missing for ID ${reflectionTargetConceptId}`); }
         }
         if (reflectionTargetConceptId) {
             addConceptToGrimoireInternal(reflectionTargetConceptId); // Add concept after dissonance reflection
         }
    }

    // Grant Insight Reward
    gainInsight(rewardAmt, `Reflection (${currentReflectionContext || 'Unknown'})`);

    // Determine Attunement Key based on context
    if (currentReflectionContext === 'Standard' && currentReflectionCategory) { attuneKey = elementNameToKey[currentReflectionCategory]; }
    else if (currentReflectionContext === 'Guided') { attuneKey = null; } // Guided gives generic attunement
    else if (currentReflectionContext === 'RareConcept') { const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId); attuneKey = cEntry ? cEntry[1].concept.primaryElement : null; }
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); attuneKey = scene?.element || null; }
    // No specific attunement for Dissonance by default, handled by generic below if attuneKey is null

    // Grant Attunement
    if (attuneKey) gainAttunementForAction('completeReflection', attuneKey, attuneAmt);
    else gainAttunementForAction('completeReflectionGeneric', 'All', 0.2); // Generic gain if no key determined

    // Update Milestones & Rituals
    updateMilestoneProgress(milestoneAct, 1);
    checkAndUpdateRituals('completeReflection');
    // If specific focus ritual was completed via reflection context matching
    const ritualCtxMatch = `${currentReflectionContext}_${currentPromptId}`;
    checkAndUpdateRituals('completeReflection', { contextMatch: ritualCtxMatch });

    // Clean up UI
    UI.hidePopups();
    UI.showTemporaryMessage("Reflection complete! Insight gained.", 3000);
    clearPopupState(); // Clear temp state
    // Cooldown is started when prompt is initially triggered
}
function triggerGuidedReflection() {
     if (!isActionAllowed(Config.ONBOARDING_PHASE.REFLECTION_RITUALS)) { UI.showTemporaryMessage("Unlock Reflections first.", 3000); return; }
     if (spendInsight(Config.GUIDED_REFLECTION_COST, "Guided Reflection")) {
         const cats = Object.keys(reflectionPrompts.Guided || {});
         if (cats.length > 0) { const cat = cats[Math.floor(Math.random() * cats.length)]; console.log(`Triggering guided: ${cat}`); triggerReflectionPrompt('Guided', null, cat); }
         else { console.warn("No guided categories."); gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt"); UI.showTemporaryMessage("No guided reflections available.", 3000); }
     }
}

// Other Actions
function attemptArtEvolution() {
    if (!isActionAllowed(Config.ONBOARDING_PHASE.ADVANCED)) { UI.showTemporaryMessage("Unlock Repository first.", 3000); return; }
    if (currentlyDisplayedConceptId === null) return; const conceptId = currentlyDisplayedConceptId; const discovered = State.getDiscoveredConceptData(conceptId);
    if (!discovered?.concept || discovered.artUnlocked) { UI.showTemporaryMessage("Evolution fail: State error.", 3000); return; }
    const concept = discovered.concept; if (!concept.canUnlockArt) return;
    const cost = Config.ART_EVOLVE_COST; const isFocused = State.getFocusedConcepts().has(conceptId); const hasReflected = State.getState().seenPrompts.size > 0; // Check if *any* reflection done
    // Phase check already done above
    if (!isFocused || !hasReflected) { UI.showTemporaryMessage("Check requirements (Focus + Reflection).", 3000); return; }
    if (spendInsight(cost, `Evolve Art: ${concept.name}`)) {
        if (State.unlockArt(conceptId)) {
            console.log(`Art unlocked for ${concept.name}!`); UI.showTemporaryMessage(`Enhanced Art for ${concept.name}!`, 3500);
            if (currentlyDisplayedConceptId === conceptId) UI.showConceptDetailPopup(conceptId); // Refresh popup
            UI.refreshGrimoireDisplay(); // Refresh card in grimoire view
            gainAttunementForAction('artEvolve', concept.primaryElement, 1.5);
            updateMilestoneProgress('evolveArt', 1); checkAndUpdateRituals('artEvolve');
        } else { console.error(`State unlockArt fail ${concept.name}`); gainInsight(cost, `Refund: Art evolution error`); UI.showTemporaryMessage("Error updating art.", 3000); }
    }
}
function handleSaveNote() {
    if (!isActionAllowed(Config.ONBOARDING_PHASE.STUDY_INSIGHT)) { UI.showTemporaryMessage("Unlock Study first.", 3000); return; }
    if (currentlyDisplayedConceptId === null) return; const notesTA = document.getElementById('myNotesTextarea'); if (!notesTA) return;
    const noteText = notesTA.value.trim();
    if (State.updateNotes(currentlyDisplayedConceptId, noteText)) { UI.updateNoteSaveStatus("Saved!"); }
    else { UI.updateNoteSaveStatus("Error.", true); }
}
function handleUnlockLibraryLevel(event) {
     if (!isActionAllowed(Config.ONBOARDING_PHASE.ADVANCED)) { UI.showTemporaryMessage("Unlock Repository first.", 3000); return; }
     const button = event.target.closest('button'); if (!button || button.disabled) return;
     const key = button.dataset.elementKey;
     const level = parseInt(button.dataset.level);
     if (!key || isNaN(level)) { console.error("Invalid library unlock data"); return; }
     unlockDeepDiveLevel(key, level); // Call the core logic function
}
function unlockDeepDiveLevel(elementKey, levelToUnlock) { // Internal function, assumes phase check done by handler
    const dData = elementDeepDive[elementKey] || []; const lData = dData.find(l => l.level === levelToUnlock); const curLevel = State.getState().unlockedDeepDiveLevels[elementKey] || 0;
    if (!lData || levelToUnlock !== curLevel + 1) { console.warn(`Library unlock fail: Invalid level/seq.`); return; }
    const cost = lData.insightCost || 0;
    if (spendInsight(cost, `Unlock Library: ${elementKeyToFullName[elementKey]} Lv ${levelToUnlock}`)) {
        if (State.unlockLibraryLevel(elementKey, levelToUnlock)) { // This now handles the Phase 4 trigger internally
            console.log(`Unlocked ${elementKeyToFullName[elementKey]} level ${levelToUnlock}`);
            // Refresh UI for the specific element's deep dive section
            const targetContainer = document.querySelector(`#personaElementDetails .element-deep-dive-container[data-element-key="${elementKey}"]`);
            if (targetContainer) {
                 UI.displayElementDeepDive(elementKey, targetContainer); // Refresh the specific section
            } else { console.warn(`Could not find container for ${elementKey} to refresh UI.`); }

            UI.showTemporaryMessage(`${elementKeyToFullName[elementKey]} Insight Lv ${levelToUnlock} Unlocked!`, 3000);
            updateMilestoneProgress('unlockLibrary', levelToUnlock); updateMilestoneProgress('unlockedDeepDiveLevels', State.getState().unlockedDeepDiveLevels); checkAndUpdateRituals('unlockLibrary');
            // --- *** ADDED: Explicit UI update on Phase Change *** ---
            const newPhase = State.getOnboardingPhase();
            if (newPhase === Config.ONBOARDING_PHASE.ADVANCED) { // Check if *this* unlock triggered Phase 4
                UI.applyOnboardingPhaseUI(newPhase); // Apply the new phase UI globally
                 UI.showTemporaryMessage("Advanced Features Unlocked!", 3500);
            }
             // --- *** END ADDED *** ---
        } else { console.error(`State fail unlock library ${elementKey} Lv ${levelToUnlock}`); gainInsight(cost, `Refund: Library unlock error`); }
    }

function handleMeditateScene(event) {
     if (!isActionAllowed(Config.ONBOARDING_PHASE.ADVANCED)) { UI.showTemporaryMessage("Unlock Repository first.", 3000); return; }
     const button = event.target.closest('button'); if (!button || button.disabled) return; const sceneId = button.dataset.sceneId; if (!sceneId) return; meditateOnScene(sceneId);
}
 function meditateOnScene(sceneId) { // Internal, assumes phase check done
    const scene = sceneBlueprints.find(s => s.id === sceneId); if (!scene) { console.error(`Scene not found: ${sceneId}`); return; }
    const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
    if (spendInsight(cost, `Meditate: ${scene.name}`)) {
        if (scene.reflectionPromptId) { console.log(`Triggering Scene Meditation: ${scene.name}`); triggerReflectionPrompt('SceneMeditation', sceneId); updateMilestoneProgress('meditateScene', 1); }
        else { console.error(`Prompt ID missing for scene ${sceneId}`); gainInsight(cost, `Refund: Missing scene prompt`); UI.showTemporaryMessage("Meditation fail: Reflection missing.", 3000); }
    }
}
function handleAttemptExperiment(event) {
     if (!isActionAllowed(Config.ONBOARDING_PHASE.ADVANCED)) { UI.showTemporaryMessage("Unlock Repository first.", 3000); return; }
     const button = event.target.closest('button'); if (!button || button.disabled) return; const expId = button.dataset.experimentId; if (!expId) return; attemptExperiment(expId);
}
 function attemptExperiment(experimentId) { // Internal, assumes phase check done
     const exp = alchemicalExperiments.find(e => e.id === experimentId); if (!exp) { console.warn(`Exp ${experimentId} not found.`); return; }
     if (State.getRepositoryItems().experiments.has(experimentId)) { UI.showTemporaryMessage("Experiment already completed.", 3000); return; } // Check if completed
     const attune = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();
     if (attune[exp.requiredElement] < exp.requiredAttunement) { UI.showTemporaryMessage("Attunement too low.", 3000); return; }
     let canAttempt = true; let unmetReqs = [];
     if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } }
     if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let met = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { met = true; break; } } if (!met) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } }
     if (!canAttempt) { UI.showTemporaryMessage(`Requires Focus: ${unmetReqs.join(', ')}`, 3000); return; }

     const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST; if (!spendInsight(cost, `Attempt Exp: ${exp.name}`)) return;
     console.log(`Attempting: ${exp.name}`); updateMilestoneProgress('attemptExperiment', 1); const roll = Math.random();
     if (roll < (exp.successRate || 0.5)) {
         console.log("Exp Success!"); UI.showTemporaryMessage(`Success! '${exp.name}' yielded results.`, 4000); State.addRepositoryItem('experiments', exp.id); // Add to completed set
         if (exp.successReward) {
             if (exp.successReward.type === 'insight') gainInsight(exp.successReward.amount, `Exp Success: ${exp.name}`);
             if (exp.successReward.type === 'attunement') gainAttunementForAction('experimentSuccess', exp.successReward.element || 'All', exp.successReward.amount);
             if (exp.successReward.type === 'insightFragment') {
                 if (State.addRepositoryItem('insights', exp.successReward.id)) {
                     console.log(`Exp reward: Insight ${exp.successReward.id}`); updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                 }
             }
             // Add other reward types here if needed
         }
     } else {
         console.log("Exp Failed."); UI.showTemporaryMessage(`Exp '${exp.name}' failed... ${exp.failureConsequence || "No effect."}`, 4000);
         if (exp.failureConsequence?.includes("Insight loss")) { const loss = parseFloat(exp.failureConsequence.match(/(\d+(\.\d+)?)/)?.[0] || 1); gainInsight(-loss, `Exp Failure: ${exp.name}`); }
         else if (exp.failureConsequence?.includes("attunement decrease")) { const key = exp.requiredElement; if (key) { State.updateAttunement(key, -1.0); UI.displayElementAttunement(); } }
         // Add other failure consequences here
     }
     UI.displayRepositoryContent(); // Refresh repository view to show completion status/new insights
}

// --- Suggest Scenes ---
function handleSuggestSceneClick() {
     if (!isActionAllowed(Config.ONBOARDING_PHASE.ADVANCED)) { UI.showTemporaryMessage("Unlock Repository first.", 3000); return; } // Requires advanced phase
     const focused = State.getFocusedConcepts();
     if (focused.size === 0) {
         UI.showTemporaryMessage("Focus on concepts first to suggest relevant scenes.", 3000);
         return;
     }
     const cost = Config.SCENE_SUGGESTION_COST;
     if (!spendInsight(cost, "Suggest Scene")) {
         return;
     }

     console.log("Suggesting scenes based on focus...");
     const { focusScores } = calculateFocusScores();
     const discoveredScenes = State.getRepositoryItems().scenes;

     const sortedElements = Object.entries(focusScores)
         .filter(([key, score]) => score > 4.0) // Consider elements with moderate+ resonance in focus
         .sort(([, a], [, b]) => b - a);

     const topElements = sortedElements.slice(0, 2).map(([key]) => key); // Consider top 1-2 elements
     if (topElements.length === 0 && sortedElements.length > 0) {
         topElements.push(sortedElements[0][0]); // Fallback to the highest if none are above 4.0 but some have resonance
     } else if (topElements.length === 0) {
          UI.showTemporaryMessage("Focus is too broad or weak to suggest specific scenes.", 3000);
          gainInsight(cost, "Refund: Scene Suggestion Fail (Broad Focus)");
          return;
     }

     console.log("Dominant focus elements for scene suggestion:", topElements);

     // Find scenes matching the dominant element(s) that are NOT yet discovered
     const relevantUndiscoveredScenes = sceneBlueprints.filter(scene =>
         topElements.includes(scene.element) && !discoveredScenes.has(scene.id)
     );

     if (relevantUndiscoveredScenes.length === 0) {
         UI.showTemporaryMessage("All relevant scenes for this focus have been discovered.", 3500);
         gainInsight(cost, "Refund: All Relevant Scenes Discovered");
     } else {
         // Select a random scene from the relevant, undiscovered pool
         const selectedScene = relevantUndiscoveredScenes[Math.floor(Math.random() * relevantUndiscoveredScenes.length)];
         const added = State.addRepositoryItem('scenes', selectedScene.id);
         if (added) {
             console.log(`Suggested Scene: ${selectedScene.name} (ID: ${selectedScene.id})`);
             UI.showTemporaryMessage(`Scene Suggested: '${selectedScene.name}' added to Repository!`, 4000);
             // Explicitly refresh repository if it's the current screen
             if (document.getElementById('repositoryScreen')?.classList.contains('current')) {
                 UI.displayRepositoryContent();
             }
         } else {
             console.error(`Failed to add scene ${selectedScene.id} to repository state.`);
             gainInsight(cost, "Refund: Scene Suggestion Error");
             UI.showTemporaryMessage("Error suggesting scene.", 3000);
         }
     }
 }

// --- Rituals & Milestones Logic (Helper) ---
function checkAndUpdateRituals(action, details = {}) {
    // Rituals only active from Phase 3 onwards
    if (!isActionAllowed(Config.ONBOARDING_PHASE.REFLECTION_RITUALS)) return;

    let ritualCompletedThisCheck = false;
    const currentState = State.getState(); const completedToday = currentState.completedRituals.daily || {}; const focused = currentState.focusedConcepts;
    let currentRitualPool = [...dailyRituals];

    // Add active Focus Rituals to the pool
    if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFoc = true; for (const id of reqIds) { if (!focused.has(id)) { allFoc = false; break; } } if (allFoc) currentRitualPool.push({ ...ritual, isFocusRitual: true, period: 'daily' }); }); }

    currentRitualPool.forEach(ritual => {
        const completedData = completedToday[ritual.id] || { completed: false, progress: 0 }; if (completedData.completed) return; // Skip if already done today

        const actionMatch = ritual.track.action === action;
        // Context matching (e.g., for specific reflection completions)
        const contextMatches = ritual.track.contextMatch && details.contextMatch === ritual.track.contextMatch;

        if (actionMatch || contextMatches) {
            const progress = State.completeRitualProgress(ritual.id, 'daily'); // Increment progress in state
            const requiredCount = ritual.track.count || 1;
            if (progress >= requiredCount) {
                console.log(`Ritual Completed: ${ritual.description}`); State.markRitualComplete(ritual.id, 'daily'); // Mark complete in state
                ritualCompletedThisCheck = true;
                // Grant Reward
                if (ritual.reward) {
                    if (ritual.reward.type === 'insight') gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`);
                    else if (ritual.reward.type === 'attunement') gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0);
                    else if (ritual.reward.type === 'token') console.log(`TODO: Grant ${ritual.reward.tokenType || 'Research'} token`);
                }
            }
        }
    });
    if (ritualCompletedThisCheck) UI.displayDailyRituals(); // Update UI if any ritual was completed
}
function updateMilestoneProgress(trackType, currentValue) {
     let milestoneAchievedThisUpdate = false;
     const achievedSet = State.getState().achievedMilestones;
     if (!(achievedSet instanceof Set)) { console.error("CRITICAL ERROR: gameState.achievedMilestones is not a Set!"); return; }

     milestones.forEach(m => {
         if (!achievedSet.has(m.id)) { // Only check unachieved milestones
             let achieved = false; const threshold = m.track.threshold; let checkValue = null;
             // Check by Action Count
             if (m.track.action === trackType) {
                  // Simplification: If trackType matches, assume count increases by 1 for now.
                  // More complex counting would require tracking action counts in state.
                  // Let's use a placeholder total count for actions for now.
                  // TODO: Implement proper action count tracking in state if needed.
                  // For now, many count=1 milestones trigger immediately on first action.
                  const currentCount = 1; // Placeholder
                  if (currentCount >= (m.track.count || 1)) achieved = true;
            }
             // Check by State Value
             else if (m.track.state === trackType) {
                 const att = State.getAttunement(); const lvls = State.getState().unlockedDeepDiveLevels; const discSize = State.getDiscoveredConcepts().size; const focSize = State.getFocusedConcepts().size; const insCount = State.getRepositoryItems().insights.size; const slots = State.getFocusSlots();
                 if (trackType === 'elementAttunement') {
                     if (m.track.element && att.hasOwnProperty(m.track.element)) { const valueToCheck = (typeof currentValue === 'object' && currentValue !== null && currentValue.hasOwnProperty(m.track.element)) ? currentValue[m.track.element] : att[m.track.element]; if(valueToCheck >= threshold) achieved = true; }
                     else if (m.track.condition === 'any') { achieved = Object.values(att).some(v => v >= threshold); }
                     else if (m.track.condition === 'all') { achieved = Object.values(att).every(v => v >= threshold); }
                 }
                 else if (trackType === 'unlockedDeepDiveLevels') { const levelsToCheck = (typeof currentValue === 'object' && currentValue !== null) ? currentValue : lvls; if (m.track.condition === 'any') achieved = Object.values(levelsToCheck).some(v => v >= threshold); else if (m.track.condition === 'all') achieved = Object.values(levelsToCheck).every(v => v >= threshold); }
                 else if (trackType === 'discoveredConcepts.size') checkValue = discSize;
                 else if (trackType === 'focusedConcepts.size') checkValue = focSize;
                 else if (trackType === 'repositoryInsightsCount') checkValue = insCount;
                 else if (trackType === 'focusSlotsTotal') checkValue = slots;
                 else if (trackType === 'repositoryContents' && m.track.condition === "allTypesPresent") { const i = State.getRepositoryItems(); achieved = i.scenes.size > 0 && i.experiments.size > 0 && i.insights.size > 0; }
                 if (!achieved && checkValue !== null && typeof checkValue === 'number' && checkValue >= threshold) achieved = true;
             }
             // If Achieved, Grant Reward and Update State
             if (achieved) {
                 if (State.addAchievedMilestone(m.id)) { // Add to state, returns true if newly added
                     console.log("Milestone Achieved!", m.description); milestoneAchievedThisUpdate = true;
                     UI.displayMilestones(); UI.showMilestoneAlert(m.description);
                     if (m.reward) {
                         if (m.reward.type === 'insight') gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`);
                         else if (m.reward.type === 'attunement') gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0);
                         else if (m.reward.type === 'increaseFocusSlots') { const inc = m.reward.amount || 1; if (State.increaseFocusSlots(inc)) { UI.updateFocusSlotsDisplay(); updateMilestoneProgress('focusSlotsTotal', State.getFocusSlots()); } }
                         else if (m.reward.type === 'discoverCard') { const cId = m.reward.cardId; if (cId && !State.getDiscoveredConcepts().has(cId)) { const cDisc = concepts.find(c => c.id === cId); if (cDisc) { addConceptToGrimoireInternal(cId); UI.showTemporaryMessage(`Milestone Reward: Discovered ${cDisc.name}!`, 3500); } } }
                         // Add other reward types here
                     }
                 }
             }
         }
     });
     // No save needed here, handled by State setters within rewards or addAchievedMilestone
}

// --- Daily Login ---
function checkForDailyLogin() {
    const today = new Date().toDateString();
    const last = State.getState().lastLoginDate;
    if (last !== today) {
        console.log("First login today.");
        State.resetDailyRituals(); // Resets rituals, grants free research, updates date
        gainInsight(5.0, "Daily Bonus");
        UI.showTemporaryMessage("Rituals Reset. Free Research Available!", 3500);
        // Update relevant UI sections immediately
        UI.displayDailyRituals();
        UI.displayResearchButtons();
    } else {
        console.log("Already logged in today.");
        // Still refresh button state in case insight changed
        UI.displayResearchButtons();
    }
}

// --- Persona Calculation Logic Helpers ---
function calculateFocusScores() {
     const scores = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); const count = focused.size;
     if (count > 0) { focused.forEach(id => { const data = disc.get(id); if (data?.concept?.elementScores) { for (const key in scores) { if (data.concept.elementScores.hasOwnProperty(key)) scores[key] += data.concept.elementScores[key]; } } }); for (const key in scores) scores[key] /= count; } return { focusScores: scores, focusCount: count };
}
function calculateTapestryNarrative(forceRecalculate = false) {
    const currentHash = State.getCurrentFocusSetHash();
    const stateHash = State.getState().currentFocusSetHash; // Get from state
    // Use cached analysis if hash matches and not forced
    if (currentTapestryAnalysis && !forceRecalculate && currentHash === stateHash) { return currentTapestryAnalysis.fullNarrativeHTML; }
    const focused = State.getFocusedConcepts(); const focusCount = focused.size;
    if (focusCount === 0) { currentTapestryAnalysis = null; return 'Mark concepts as "Focus" from the Grimoire to weave your narrative.'; }
    const disc = State.getDiscoveredConcepts(); const { focusScores } = calculateFocusScores();
    const analysis = { dominantElements: [], elementThemes: [], dominantCardTypes: [], cardTypeThemes: [], synergies: [], tensions: [], essenceTitle: "Balanced", balanceComment: "", fullNarrativeRaw: "", fullNarrativeHTML: "" };
    const sortedElements = Object.entries(focusScores).filter(([k, s]) => s > 3.5).sort(([, a], [, b]) => b - a);
    if (sortedElements.length > 0) {
        analysis.dominantElements = sortedElements.map(([key, score]) => ({ key: key, name: elementDetails[elementKeyToFullName[key]]?.name || key, score: score }));
        const topElementKeys = analysis.dominantElements.slice(0, 3).map(e => e.key).sort().join('');
        const themeKey = topElementKeys.length > 1 ? topElementKeys : (topElementKeys.length === 1 ? analysis.dominantElements[0].key : null);
        if (themeKey && elementInteractionThemes && elementInteractionThemes[themeKey]) { analysis.elementThemes.push(elementInteractionThemes[themeKey]); }
        else if (analysis.dominantElements.length > 0) { analysis.elementThemes.push(`a strong emphasis on **${analysis.dominantElements[0].name}**.`); }
        if (analysis.dominantElements.length >= 2 && analysis.dominantElements[0].score > 6.5 && analysis.dominantElements[1].score > 5.5) { analysis.essenceTitle = `${analysis.dominantElements[0].name}/${analysis.dominantElements[1].name} Blend`; }
        else if (analysis.dominantElements.length >= 1 && analysis.dominantElements[0].score > 6.5) { analysis.essenceTitle = `${analysis.dominantElements[0].name} Focus`; }
        else { analysis.essenceTitle = "Developing"; }
    } else { analysis.essenceTitle = "Balanced"; }
    const typeCounts = {}; cardTypeKeys.forEach(type => typeCounts[type] = 0);
    focused.forEach(id => { const type = disc.get(id)?.concept?.cardType; if (type && typeCounts.hasOwnProperty(type)) { typeCounts[type]++; } });
    analysis.dominantCardTypes = Object.entries(typeCounts).filter(([type, count]) => count > 0).sort(([, a], [, b]) => b - a).map(([type, count]) => ({ type, count }));
    if (analysis.dominantCardTypes.length > 0) { const topType = analysis.dominantCardTypes[0].type; if (cardTypeThemes && cardTypeThemes[topType]) { analysis.cardTypeThemes.push(cardTypeThemes[topType]); } }
    const checkedPairs = new Set();
    focused.forEach(idA => { const conceptA = disc.get(idA)?.concept; if (!conceptA?.relatedIds) return; focused.forEach(idB => { if (idA === idB) return; const pairKey = [idA, idB].sort().join('-'); if (checkedPairs.has(pairKey)) return; if (conceptA.relatedIds.includes(idB)) { const conceptB = disc.get(idB)?.concept; if (conceptB) { analysis.synergies.push({ concepts: [conceptA.name, conceptB.name], text: `The connection between **${conceptA.name}** and **${conceptB.name}** suggests a reinforcing dynamic.` }); } } checkedPairs.add(pairKey); }); });
    const highThreshold = 7.0; const lowThreshold = 3.0; const focusConceptsData = Array.from(focused).map(id => disc.get(id)?.concept).filter(Boolean);
    if (focusConceptsData.length >= 2) {
         for (const key of Object.keys(elementNameToKey)) {
               const elementName = elementKeyToFullName[key];
               let hasHigh = focusConceptsData.some(c => c.elementScores?.[key] >= highThreshold); let hasLow = focusConceptsData.some(c => c.elementScores?.[key] <= lowThreshold);
               if (hasHigh && hasLow) { const highConcepts = focusConceptsData.filter(c => c.elementScores?.[key] >= highThreshold).map(c => c.name); const lowConcepts = focusConceptsData.filter(c => c.elementScores?.[key] <= lowThreshold).map(c => c.name); analysis.tensions.push({ element: elementName, text: `A potential tension exists within **${elementName}**: concepts like **${highConcepts.join(', ')}** lean high, while **${lowConcepts.join(', ')}** lean low.` }); }
         }
    }
    const scores = Object.values(focusScores); const minScore = Math.min(...scores); const maxScore = Math.max(...scores); const range = maxScore - minScore;
    if (range <= 2.5 && focusCount > 2) analysis.balanceComment = "The focused elements present a relatively balanced profile.";
    else if (range >= 5.0 && focusCount > 2) analysis.balanceComment = "There's a notable range in elemental emphasis within your focus.";
    let narrative = `Current Essence: **${analysis.essenceTitle}**. `;
    if (analysis.dominantElements.length > 0) { narrative += `Your tapestry currently resonates with ${analysis.elementThemes.join(' ')} `; } else { narrative += "Your focus presents a unique and subtle balance. "; }
    if (analysis.dominantCardTypes.length > 0) { narrative += `The lean towards ${analysis.cardTypeThemes.join(' ')} shapes the expression. `; }
    if (analysis.balanceComment) narrative += analysis.balanceComment + " ";
    analysis.synergies.forEach(syn => { narrative += syn.text + " "; }); analysis.tensions.forEach(ten => { narrative += ten.text + " "; });
    analysis.fullNarrativeRaw = narrative.trim(); analysis.fullNarrativeHTML = analysis.fullNarrativeRaw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    currentTapestryAnalysis = analysis; // Cache the result
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
function checkForFocusUnlocks(silent = false) {
     // Focus unlocks require Advanced phase
     if (!isActionAllowed(Config.ONBOARDING_PHASE.ADVANCED)) return;
     console.log("Checking focus unlocks..."); let newlyUnlocked = false;
     const focused = State.getFocusedConcepts(); const unlocked = State.getUnlockedFocusItems();
     focusDrivenUnlocks.forEach(unlock => {
         if (unlocked.has(unlock.id)) return; // Skip already unlocked
         let met = true; if (!unlock.requiredFocusIds || unlock.requiredFocusIds.length === 0) met = false; else { for (const reqId of unlock.requiredFocusIds) { if (!focused.has(reqId)) { met = false; break; } } }
         if (met) { console.log(`Met reqs for ${unlock.id}`); if (State.addUnlockedFocusItem(unlock.id)) { // Add to state
                 newlyUnlocked = true; const item = unlock.unlocks; let name = item.name || `ID ${item.id}`; let notif = unlock.description || `Unlocked ${name}`;
                 // Add the unlocked item to the appropriate repository list
                 if (item.type === 'scene') { if (State.addRepositoryItem('scenes', item.id)) { console.log(`Unlocked Scene: ${name}`); notif += ` View in Repo.`; } else notif += ` (Already Discovered)`; }
                 else if (item.type === 'experiment') { console.log(`Unlocked Exp: ${name}.`); notif += ` Check Repo.`; } // Experiments aren't 'discovered' until completed
                 else if (item.type === 'insightFragment') { if (State.addRepositoryItem('insights', item.id)) { const iData = elementalInsights.find(i => i.id === item.id); name = iData ? `"${iData.text}"` : `ID ${item.id}`; console.log(`Unlocked Insight: ${item.id}`); notif += ` View in Repo.`; updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); } else notif += ` (Already Discovered)`; }
                 if (!silent) UI.showTemporaryMessage(`Focus Synergy: ${notif}`, 5000);
             }
         }
     });
     if (newlyUnlocked && !silent) { console.log("New Focus Unlocks:", Array.from(State.getUnlockedFocusItems())); if (document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent(); if (document.getElementById('personaScreen')?.classList.contains('current')) UI.generateTapestryNarrative(); } // Refresh relevant UI
}

// --- Tapestry Deep Dive Logic ---
function showTapestryDeepDive() {
    // Requires at least Phase 1 (Focus available)
    if (!isActionAllowed(Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE)) { UI.showTemporaryMessage("Unlock Focus first.", 3000); return; }
    if (State.getFocusedConcepts().size === 0) { UI.showTemporaryMessage("Focus on concepts first to explore the tapestry.", 3000); return; }
    calculateTapestryNarrative(true); // Ensure analysis is up-to-date
    if (!currentTapestryAnalysis) { console.error("Failed to generate tapestry analysis for Deep Dive."); UI.showTemporaryMessage("Error analyzing Tapestry.", 3000); return; }
    UI.displayTapestryDeepDive(currentTapestryAnalysis);
}
function handleDeepDiveNodeClick(nodeId) {
    if (!currentTapestryAnalysis) { console.error("Deep Dive Node Click: Analysis missing."); UI.updateDeepDiveContent("<p>Error: Analysis data unavailable.</p>", nodeId); return; }
    console.log(`Logic: Handling Deep Dive node click: ${nodeId}`);
    let content = `<p><em>Analysis for '${nodeId}'...</em></p>`;
    try {
        // Generate content based on cached analysis
        switch (nodeId) {
            case 'elemental': content = `<h4>Elemental Resonance Breakdown</h4>`; if(currentTapestryAnalysis.elementThemes.length > 0) { content += `<ul>${currentTapestryAnalysis.elementThemes.map(t => `<li>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p>No specific elemental themes detected.</p>`; } content += `<p><small>Dominant Elements: ${currentTapestryAnalysis.dominantElements.length > 0 ? currentTapestryAnalysis.dominantElements.map(e => `${e.name} (${e.score.toFixed(1)})`).join(', ') : 'None strongly dominant'}</small></p>`; if(currentTapestryAnalysis.balanceComment) content += `<p><small>Balance: ${currentTapestryAnalysis.balanceComment}</small></p>`; break;
            case 'archetype': content = `<h4>Concept Archetype Analysis</h4>`; if (currentTapestryAnalysis.cardTypeThemes.length > 0) { content += `<ul>${currentTapestryAnalysis.cardTypeThemes.map(t => `<li>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p>No specific archetype themes detected.</p>`; } content += `<p><small>Focus Distribution: ${currentTapestryAnalysis.dominantCardTypes.length > 0 ? currentTapestryAnalysis.dominantCardTypes.map(ct => `${ct.type} (${ct.count})`).join(', ') : 'None'}</small></p>`; break;
            case 'synergy': content = `<h4>Synergies & Tensions</h4>`; if (currentTapestryAnalysis.synergies.length > 0) { content += `<h5>Synergies:</h5><ul>${currentTapestryAnalysis.synergies.map(s => `<li>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p><em>No direct synergies detected between focused concepts.</em></p>`; } content += `<br>`; if (currentTapestryAnalysis.tensions.length > 0) { content += `<h5>Tensions:</h5><ul>${currentTapestryAnalysis.tensions.map(t => `<li>${t.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p><em>No significant elemental tensions detected within the focus.</em></p>`; } break;
            default: content = `<p><em>Analysis node '${nodeId}' not recognized.</em></p>`;
        }
    } catch (error) { console.error(`Error generating content for node ${nodeId}:`, error); content = `<p>Error generating analysis for ${nodeId}.</p>`; }
    UI.updateDeepDiveContent(content, nodeId); // Update the UI with generated content
}
function handleContemplationNodeClick() {
     // Contemplation might be considered advanced or tied to reflection
     if (!isActionAllowed(Config.ONBOARDING_PHASE.REFLECTION_RITUALS)) { UI.showTemporaryMessage("Unlock Reflection first.", 3000); return; }
    if (spendInsight(Config.CONTEMPLATION_COST, "Focused Contemplation")) {
        const contemplation = generateFocusedContemplation(); // Generate task based on current analysis
        if (contemplation) { UI.displayContemplationTask(contemplation); State.setContemplationCooldown(Date.now() + Config.CONTEMPLATION_COOLDOWN); UI.updateContemplationButtonState(); }
        else { UI.updateDeepDiveContent("<p><em>Could not generate contemplation task.</em></p>", 'contemplation'); gainInsight(Config.CONTEMPLATION_COST, "Refund: Contemplation Fail"); UI.updateContemplationButtonState(); }
    } else { UI.updateContemplationButtonState(); } // Update state even if failed due to cost
}
function generateFocusedContemplation() { // Logic remains the same, uses cached analysis
    if (!currentTapestryAnalysis) { console.error("Cannot generate contemplation: Tapestry analysis missing."); return null; }
    const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); const focusedConceptsArray = Array.from(focused).map(id => disc.get(id)?.concept).filter(Boolean);
    let task = { type: "Default", text: "Reflect on your current focus.", reward: { type: 'insight', amount: 2 }, requiresCompletionButton: true };
    try {
        const taskOptions = [];
        if (currentTapestryAnalysis.tensions.length > 0) { const tension = currentTapestryAnalysis.tensions[Math.floor(Math.random() * currentTapestryAnalysis.tensions.length)]; taskOptions.push({ type: 'Tension Reflection', text: `Your Tapestry highlights a tension within **${tension.element}**. Reflect on how you reconcile or experience this contrast. Consider adding a note.`, reward: { type: 'insight', amount: 4 }, requiresCompletionButton: true }); }
        if (currentTapestryAnalysis.synergies.length > 0) { const syn = currentTapestryAnalysis.synergies[Math.floor(Math.random() * currentTapestryAnalysis.synergies.length)]; const [nameA, nameB] = syn.concepts; taskOptions.push({ type: 'Synergy Note', text: `Focus links <strong>${nameA}</strong> and <strong>${nameB}</strong>. In the 'My Notes' for <strong>${nameA}</strong>, write one sentence about how <strong>${nameB}</strong> might amplify or alter its expression.`, reward: { type: 'insight', amount: 3 }, requiresCompletionButton: false }); }
        if (currentTapestryAnalysis.dominantElements.length > 0 && currentTapestryAnalysis.dominantElements[0].score > 7.0) { const el = currentTapestryAnalysis.dominantElements[0]; let action = "observe an interaction involving this element"; if (el.key === 'S') action = "mindfully experience one physical sensation related to this element"; else if (el.key === 'P') action = "acknowledge one emotion linked to this element without judgment"; else if (el.key === 'C') action = "analyze one assumption related to this element"; else if (el.key === 'R') action = "consider one relationship boundary influenced by this element"; else if (el.key === 'A') action = "notice one thing that subtly attracts or repels you, related to this element"; taskOptions.push({ type: 'Dominant Element Ritual', text: `Your focus strongly resonates with **${el.name}**. Today's mini-ritual: ${action}.`, attunementReward: { element: el.key, amount: 0.5 }, reward: { type: 'insight', amount: 2 }, requiresCompletionButton: true }); }
         if (focusedConceptsArray.length > 0) { const conceptNames = focusedConceptsArray.map(c => `<strong>${c.name}</strong>`); taskOptions.push({ type: 'Tapestry Resonance', text: `Meditate briefly on the combined energy of your focused concepts: ${conceptNames.join(', ')}. What overall feeling or image emerges?`, attunementReward: { element: 'All', amount: 0.2 }, reward: { type: 'insight', amount: 3 }, requiresCompletionButton: true }); }
        let selectedTaskOption = null; const tensionTask = taskOptions.find(t => t.type === 'Tension Reflection'); const synergyTask = taskOptions.find(t => t.type === 'Synergy Note');
        if (tensionTask && Math.random() < 0.4) { selectedTaskOption = tensionTask; } else if (synergyTask && Math.random() < 0.4) { selectedTaskOption = synergyTask; } else if (taskOptions.length > 0) { selectedTaskOption = taskOptions[Math.floor(Math.random() * taskOptions.length)]; }
        if (selectedTaskOption) { task = selectedTaskOption; if (task.reward?.type === 'insight' && !task.requiresCompletionButton) { gainInsight(task.reward.amount, 'Contemplation Task (Immediate)'); task.reward = { type: 'none' }; } if (task.attunementReward) { gainAttunementForAction('contemplation', task.attunementReward.element, task.attunementReward.amount); delete task.attunementReward; } }
        else { console.log("Using default contemplation task."); }
    } catch (error) { console.error("Error generating contemplation task:", error); return { type: "Error", text: "An error occurred during generation.", reward: { type: 'none' }, requiresCompletionButton: false }; }
    console.log(`Generated contemplation task of type: ${task.type}`); return task;
}
function handleCompleteContemplation(task) {
    // No phase check needed, button only appears when allowed
    if (!task || !task.reward || !task.requiresCompletionButton) return;
    console.log(`Contemplation task completed: ${task.type}`);
    if (task.reward.type === 'insight' && task.reward.amount > 0) { gainInsight(task.reward.amount, `Contemplation Task`); }
    UI.showTemporaryMessage("Contemplation complete!", 2500);
    UI.clearContemplationTask(); // Update UI
}


// --- EXPORTS ---
export {
    // Questionnaire
    handleQuestionnaireInputChange, handleCheckboxChange, calculateElementScore,
    goToNextElement, goToPrevElement, finalizeQuestionnaire,
    // Core Logic & Actions
    gainInsight, spendInsight, gainAttunementForAction,
    addConceptToGrimoireById, addConceptToGrimoireInternal, handleToggleFocusConcept,
    handleResearchClick, handleFreeResearchClick, conductResearch,
    attemptArtEvolution, handleSaveNote, handleSellConcept, sellConcept,
    // Reflection
    checkTriggerReflectionPrompt, triggerReflectionPrompt, handleConfirmReflection,
    triggerGuidedReflection,
    // Library (Integrated)
    handleUnlockLibraryLevel,
    // Repository
    handleMeditateScene,
    handleAttemptExperiment,
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
