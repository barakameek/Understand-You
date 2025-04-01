// js/gameLogic.js - Core Game Actions and Logic
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as UI from './ui.js'; // Import UI module to trigger updates
import * as Data from '../data.js'; // Import data for lookups

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
    if (!Utils.isDataReady()) return;
    let targetKeys = [];
    let baseAmount = amount; // Store the original amount

    if (elementKey && State.getAttunement().hasOwnProperty(elementKey)) {
        targetKeys.push(elementKey);
    } else if (actionType === 'completeReflection' && currentReflectionContext === 'Standard' && elementKey) {
         if (State.getAttunement().hasOwnProperty(elementKey)) {
              targetKeys.push(elementKey);
         }
    } else if (['generic', 'completeReflectionGeneric', 'scoreNudge', 'ritual', 'milestone', 'experimentSuccess', 'artEvolve'].includes(actionType) || elementKey === 'All') {
        targetKeys = Object.keys(State.getAttunement());
        // Adjust amount per key for 'All' actions
        if (actionType === 'scoreNudge') baseAmount = (0.5 / targetKeys.length); // Spread small amount
        else if (actionType === 'completeReflectionGeneric') baseAmount = 0.2; // Small fixed amount per element
        else if (actionType === 'generic') baseAmount = 0.1; // Very small fixed amount
        // Use passed amount directly per element for ritual, milestone, experimentSuccess, artEvolve
    } else {
        console.warn(`gainAttunement called with invalid parameters: action=${actionType}, key=${elementKey}`);
        return;
    }

    let changed = false;
    targetKeys.forEach(key => {
        // Pass the potentially adjusted baseAmount
        if (State.updateAttunement(key, baseAmount)) {
            changed = true;
            updateMilestoneProgress('elementAttunement', State.getAttunement());
        }
    });

    if (changed) {
        console.log(`Attunement updated (${actionType}, Key: ${elementKey || 'Multi'}) by ${baseAmount.toFixed(1)} per element.`);
        UI.displayElementAttunement();
    }
}


// --- Questionnaire Logic ---
export function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const type = input.dataset.type;
    const currentState = State.getState();
    // Ensure index is valid before accessing element name
    if (currentState.currentElementIndex < 0 || currentState.currentElementIndex >= Data.elementNames.length) return;
    const elementName = Data.elementNames[currentState.currentElementIndex];

    if (type === 'slider') {
        UI.updateSliderFeedbackText(input);
    }

    const currentAnswers = UI.getQuestionnaireAnswers();
    State.updateAnswers(elementName, currentAnswers);
    UI.updateDynamicFeedback(elementName, currentAnswers);
}

export function handleCheckboxChange(event) {
     const checkbox = event.target;
     const name = checkbox.name;
     const maxChoices = parseInt(checkbox.dataset.maxChoices || 2);
     const container = checkbox.closest('.checkbox-options');
     if (!container) return;

     const checkedBoxes = container.querySelectorAll(`input[name="${name}"]:checked`);

     if (checkedBoxes.length > maxChoices) {
         UI.showTemporaryMessage(`Max ${maxChoices} options allowed.`, 2500);
         checkbox.checked = false;
     }
     handleQuestionnaireInputChange(event);
}

export function calculateElementScore(elementName, answersForElement) {
    if (!Utils.isDataReady()) return 5.0;
    const questions = Data.questionnaireGuided[elementName] || [];
    let score = 5.0;

    questions.forEach(q => {
        const answer = answersForElement[q.qId];
        let pointsToAdd = 0;
        const weight = q.scoreWeight || 1.0;

        if (q.type === 'slider') {
            const value = (answer !== undefined && !isNaN(answer)) ? parseFloat(answer) : q.defaultValue;
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

export function goToNextElement() {
    const currentState = State.getState();
    const currentAnswers = UI.getQuestionnaireAnswers();
    // Ensure index is valid before saving answers
    if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < Data.elementNames.length) {
        State.updateAnswers(Data.elementNames[currentState.currentElementIndex], currentAnswers);
    }

    const nextIndex = currentState.currentElementIndex + 1;
    if (nextIndex >= Data.elementNames.length) {
        finalizeQuestionnaire();
    } else {
        State.updateElementIndex(nextIndex);
        UI.displayElementQuestions(nextIndex);
    }
}

export function goToPrevElement() {
    const currentState = State.getState();
    if (currentState.currentElementIndex > 0) {
        const currentAnswers = UI.getQuestionnaireAnswers();
        // Ensure index is valid before saving answers
        if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < Data.elementNames.length) {
             State.updateAnswers(Data.elementNames[currentState.currentElementIndex], currentAnswers);
        }

        const prevIndex = currentState.currentElementIndex - 1;
        State.updateElementIndex(prevIndex);
        UI.displayElementQuestions(prevIndex);
    }
}

export function finalizeQuestionnaire() {
    if (!Utils.isDataReady()) return;
    console.log("Finalizing scores...");
    const finalScores = {};
    const allAnswers = State.getState().userAnswers;

    Data.elementNames.forEach(elementName => {
        const score = calculateElementScore(elementName, allAnswers[elementName] || {});
        const key = Data.elementNameToKey[elementName];
        if (key) {
            finalScores[key] = score;
        } else {
            console.warn(`Could not find key for element name: ${elementName}`);
        }
    });

    State.updateScores(finalScores);
    State.setQuestionnaireComplete();
    State.saveAllAnswers(allAnswers);

    determineStarterHandAndEssence();

    updateMilestoneProgress('completeQuestionnaire', 1);
    checkForDailyLogin();

    // Update relevant UI elements
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter();
    UI.populateGrimoireFilters();
    UI.displayDailyRituals();
    UI.refreshGrimoireDisplay();
    UI.applyOnboardingPhaseUI(State.getOnboardingPhase());

    console.log("Final User Scores:", State.getScores());
    UI.showScreen('personaScreen');
    UI.showTemporaryMessage("Experiment Complete! Explore your results.", 4000);
}


// --- Starter Hand ---
function determineStarterHandAndEssence() {
    if (!Utils.isDataReady()) return;
    console.log("Determining starter hand...");

    if (!Data.concepts || !Array.isArray(Data.concepts) || Data.concepts.length === 0) {
        console.error("Concepts data is missing or empty."); return;
    }
    const userScores = State.getScores();

    let conceptsWithDistance = Data.concepts
        .map(c => ({ ...c, distance: Utils.euclideanDistance(userScores, c.elementScores) }))
        .filter(c => c.distance !== Infinity && !isNaN(c.distance));

    if (conceptsWithDistance.length === 0) {
         console.error("Could not calculate distances for any concepts.");
         const defaultStarters = Data.concepts.slice(0, 5);
         defaultStarters.forEach(concept => {
              if (State.addDiscoveredConcept(concept.id, concept)) {
                   gainAttunementForAction('discover', concept.primaryElement);
              }
         });
         console.warn("Granted default starter concepts due to calculation error.");
         UI.updateGrimoireCounter();
         return;
    }

    conceptsWithDistance.sort((a, b) => a.distance - b.distance);

    const candidates = conceptsWithDistance.slice(0, 25);
    const starterHand = [];
    const starterHandIds = new Set();
    const targetHandSize = 7;
    const elementRepresentationTarget = 4;
    const representedElements = new Set();

    // Phase 1: Closest unique
    for (const c of candidates) {
        if (starterHand.length >= 4) break;
        if (!starterHandIds.has(c.id)) {
            starterHand.push(c); starterHandIds.add(c.id);
            if (c.primaryElement) representedElements.add(c.primaryElement);
        }
    }
    // Phase 2: Diversity
    for (const c of candidates) {
        if (starterHand.length >= targetHandSize) break;
        if (starterHandIds.has(c.id)) continue;
        const needsRep = c.primaryElement && representedElements.size < elementRepresentationTarget && !representedElements.has(c.primaryElement);
        if (needsRep || starterHand.length < 5) {
            starterHand.push(c); starterHandIds.add(c.id);
            if (c.primaryElement) representedElements.add(c.primaryElement);
        }
    }
    // Phase 3: Fill remaining
    for (const c of candidates) {
        if (starterHand.length >= targetHandSize) break;
        if (!starterHandIds.has(c.id)) {
            starterHand.push(c); starterHandIds.add(c.id);
        }
    }
    console.log("Starter Hand Selected:", starterHand.map(c => c.name));

    // Add to Grimoire state
    starterHand.forEach(concept => {
        if (State.addDiscoveredConcept(concept.id, concept)) {
             gainAttunementForAction('discover', concept.primaryElement, 0.3);
        }
    });
    updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size);
    UI.updateGrimoireCounter();
}


// --- Core Actions (Research, Reflection, Focus, etc.) ---
export function handleResearchClick(event) {
    const button = event.currentTarget;
    const elementKey = button.dataset.elementKey;
    const currentCost = parseFloat(button.dataset.cost);

    if (!elementKey || isNaN(currentCost) || button.disabled) return;

    if (spendInsight(currentCost, `Research: ${Data.elementKeyToFullName[elementKey]}`)) {
        console.log(`Spent ${currentCost} Insight researching ${elementKey}.`);
        conductResearch(elementKey);
        updateMilestoneProgress('conductResearch', 1);
        checkAndUpdateRituals('conductResearch'); // Use the corrected single function
    }
}

export function handleFreeResearchClick() {
    if (!State.isFreeResearchAvailable()) {
        UI.showTemporaryMessage("Daily meditation already performed today.", 3000);
        return;
    }
    const attunement = State.getAttunement();
    let targetKey = 'A'; let minAttunement = Config.MAX_ATTUNEMENT + 1;
    for (const key in attunement) {
        if (attunement[key] < minAttunement) {
            minAttunement = attunement[key]; targetKey = key;
        }
    }
    console.log(`Performing free daily meditation on ${targetKey} (${Data.elementKeyToFullName[targetKey]})`);
    State.setFreeResearchUsed();
    UI.displayResearchButtons();
    conductResearch(targetKey);
    updateMilestoneProgress('freeResearch', 1);
    checkAndUpdateRituals('freeResearch'); // Use the corrected single function
}


export function conductResearch(elementKeyToResearch) {
    if (!Utils.isDataReady()) return;
    const elementFullName = Data.elementKeyToFullName[elementKeyToResearch];
    if (!elementFullName) { console.error(`Invalid element key: ${elementKeyToResearch}`); return; }

    console.log(`Researching: ${elementFullName} (Key: ${elementKeyToResearch})`);
    UI.displayResearchStatus(`Reviewing notes on ${Data.elementDetails[elementFullName]?.name || elementFullName}...`);

    const discoveredConceptsMap = State.getDiscoveredConcepts();
    const discoveredIds = new Set(discoveredConceptsMap.keys());
    const discoveredRepoItems = State.getRepositoryItems();
    const undiscoveredPool = Data.concepts.filter(c => !discoveredIds.has(c.id));

    let rareItemFound = false;
    const discoveryRoll = Math.random();
    const sceneDiscoveryChance = 0.06;
    const insightDiscoveryChance = 0.12;
    const researchOutputElement = document.getElementById('researchOutput');
    const canFindRareItem = researchOutputElement && (researchOutputElement.children.length === 0 || researchOutputElement.querySelector('p > i'));
    let foundRepoItem = null;

    // Check for Scene
    if (!rareItemFound && canFindRareItem && discoveryRoll < sceneDiscoveryChance && Data.sceneBlueprints.length > 0) {
        const availableScenes = Data.sceneBlueprints.filter(s => !discoveredRepoItems.scenes.has(s.id));
        if (availableScenes.length > 0) {
            const foundScene = availableScenes[Math.floor(Math.random() * availableScenes.length)];
            if (State.addRepositoryItem('scenes', foundScene.id)) {
                 rareItemFound = true; foundRepoItem = {type: 'scene', ...foundScene};
                 UI.showTemporaryMessage("Scene Blueprint Discovered!", 4000);
                 if(document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent();
            }
        }
    }
    // Check for Insight (only if Scene not found)
    if (!rareItemFound && canFindRareItem && discoveryRoll < (sceneDiscoveryChance + insightDiscoveryChance) && Data.elementalInsights.length > 0) {
        const relevantInsights = Data.elementalInsights.filter(i => i.element === elementKeyToResearch);
        const unseenRelevant = relevantInsights.filter(i => !discoveredRepoItems.insights.has(i.id));
        const anyUnseen = Data.elementalInsights.filter(i => !discoveredRepoItems.insights.has(i.id));
        const poolToUse = unseenRelevant.length > 0 ? unseenRelevant : (anyUnseen.length > 0 ? anyUnseen : relevantInsights);
        if (poolToUse.length > 0) {
            const foundInsight = poolToUse[Math.floor(Math.random() * poolToUse.length)];
             if (State.addRepositoryItem('insights', foundInsight.id)) {
                 rareItemFound = true; foundRepoItem = {type: 'insight', ...foundInsight};
                 UI.showTemporaryMessage("Elemental Insight Fragment Found!", 3500);
                 updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                 if(document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent();
            }
        }
    }

    if (rareItemFound && foundRepoItem) {
         UI.displayResearchResults({ concepts: [], repositoryItems: [foundRepoItem], duplicateInsightGain: 0 });
        UI.displayResearchStatus("A unique insight unearthed!");
        gainAttunementForAction('researchSpecial', elementKeyToResearch, 1.0);
        return;
    }

    // --- NORMAL CONCEPT DISCOVERY ---
    if (undiscoveredPool.length === 0) {
        UI.displayResearchStatus("Research complete. No more concepts to discover.");
        if (researchOutputElement && researchOutputElement.children.length === 0) {
             researchOutputElement.innerHTML = '<p><i>The library holds all known concepts. Consider exploring the Repository or Element Library.</i></p>';
        }
        gainInsight(5.0, "All Concepts Discovered Bonus");
        return;
    }

    const currentAttunement = State.getAttunement()[elementKeyToResearch] || 0;
    const priorityPool = []; const secondaryPool = []; const tertiaryPool = [];
    undiscoveredPool.forEach(c => {
        const score = c.elementScores?.[elementKeyToResearch] || 0;
        const isPrimary = c.primaryElement === elementKeyToResearch;
        if (isPrimary || score >= 7.5) priorityPool.push({...c});
        else if (score >= 4.5) secondaryPool.push({...c});
        else tertiaryPool.push({...c});
    });

    const selectedForOutput = [];
    let duplicateInsightGain = 0;
    const numberOfResults = 3;

    const selectWeightedRandomFromPools = () => {
        const pools = [ { pool: priorityPool, weightMultiplier: 3.5 + (currentAttunement / 30) }, { pool: secondaryPool, weightMultiplier: 1.5 + (currentAttunement / 60) }, { pool: tertiaryPool, weightMultiplier: 0.8 } ];
        let combinedWeightedPool = []; let totalWeight = 0;
        const attunementFactor = 1 + (currentAttunement / (Config.MAX_ATTUNEMENT * 1.2));
        pools.forEach(({ pool, weightMultiplier }) => {
            pool.forEach(card => {
                let weight = 1.0 * weightMultiplier;
                if (card.rarity === 'uncommon') weight *= (1.3 * attunementFactor);
                else if (card.rarity === 'rare') weight *= (0.6 * attunementFactor);
                else weight *= (1.0 * attunementFactor);
                weight = Math.max(0.1, weight); totalWeight += weight;
                combinedWeightedPool.push({ card, weight });
            });
        });
        if (combinedWeightedPool.length === 0) return null;
        let randomPick = Math.random() * totalWeight;
        for (let i = 0; i < combinedWeightedPool.length; i++) {
            const chosenItem = combinedWeightedPool[i];
            if (randomPick < chosenItem.weight) {
                [priorityPool, secondaryPool, tertiaryPool].forEach(p => { const index = p.findIndex(c => c.id === chosenItem.card.id); if (index > -1) p.splice(index, 1); });
                return chosenItem.card;
            } randomPick -= chosenItem.weight;
        }
         const flatPool = [...priorityPool, ...secondaryPool, ...tertiaryPool];
         if (flatPool.length > 0) {
              const fallbackIndex = Math.floor(Math.random() * flatPool.length); const chosenCard = flatPool[fallbackIndex];
               [priorityPool, secondaryPool, tertiaryPool].forEach(p => { const index = p.findIndex(c => c.id === chosenCard.id); if (index > -1) p.splice(index, 1); });
              console.warn("Weighted selection failed, using fallback."); return chosenCard;
         } return null;
    };

    let attempts = 0; const maxAttempts = numberOfResults * 4;
    while (selectedForOutput.length < numberOfResults && attempts < maxAttempts && (priorityPool.length > 0 || secondaryPool.length > 0 || tertiaryPool.length > 0)) {
        attempts++; let potentialCard = selectWeightedRandomFromPools();
        if (potentialCard) {
             if (discoveredIds.has(potentialCard.id)) {
                 gainInsight(1.0, `Duplicate Research (${potentialCard.name})`); duplicateInsightGain += 1.0;
             } else { if (!selectedForOutput.some(c => c.id === potentialCard.id)) { selectedForOutput.push(potentialCard); } }
        } else { break; }
    }

    let resultMessage = "";
    if (selectedForOutput.length > 0) {
        resultMessage = `Discovered ${selectedForOutput.length} new potential concept(s)! `;
        UI.displayResearchResults({ concepts: selectedForOutput, repositoryItems: [], duplicateInsightGain: duplicateInsightGain });
        gainAttunementForAction('researchSuccess', elementKeyToResearch, 0.8);
        if (selectedForOutput.some(c => c.rarity === 'rare')) { updateMilestoneProgress('discoverRareCard', 1); }
    } else {
        resultMessage = "No new concepts discovered this time. ";
        UI.displayResearchResults({ concepts: [], repositoryItems: [], duplicateInsightGain: duplicateInsightGain });
        gainAttunementForAction('researchFail', elementKeyToResearch, 0.2);
    }
    if (duplicateInsightGain > 0 && selectedForOutput.length === 0) { resultMessage += ` Gained ${duplicateInsightGain.toFixed(0)} Insight from echoes.`; }
    UI.displayResearchStatus(resultMessage.trim());
}


export function addConceptToGrimoireById(conceptId, buttonElement = null) {
    if (!Utils.isDataReady()) return;
    if (State.getDiscoveredConcepts().has(conceptId)) {
        UI.showTemporaryMessage("Already in Grimoire.", 2500);
        if (buttonElement) UI.updateResearchButtonAfterAction(conceptId, 'add');
        return;
    }
    const concept = Data.concepts.find(c => c.id === conceptId);
    if (!concept) { console.error("Cannot add concept: Not found. ID:", conceptId); UI.showTemporaryMessage("Error: Concept data not found.", 3000); return; }

    const distance = Utils.euclideanDistance(State.getScores(), concept.elementScores);
    if (distance > Config.DISSONANCE_THRESHOLD && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
        console.log(`Dissonance detected for ${concept.name}. Triggering reflection.`);
        triggerReflectionPrompt('Dissonance', concept.id);
    } else { addConceptToGrimoireInternal(conceptId); }
     UI.updateResearchButtonAfterAction(conceptId, 'add');
}


export function addConceptToGrimoireInternal(conceptId) {
     if (!Utils.isDataReady()) return;
     const concept = Data.concepts.find(c => c.id === conceptId);
     if (!concept) { console.error("Internal add failed: Concept not found. ID:", conceptId); return; }
     if (State.getDiscoveredConcepts().has(conceptId)) return;

     console.log(`Adding ${concept.name} to Grimoire (Internal).`);
     if (State.addDiscoveredConcept(concept.id, concept)) {
         let insightReward = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
         gainInsight(insightReward, `Discovered ${concept.rarity} ${concept.name}`);
         gainAttunementForAction('addToGrimoire', concept.primaryElement, 0.6);
         UI.updateGrimoireCounter();
         if (concept.rarity === 'rare' && concept.uniquePromptId && Data.reflectionPrompts.RareConcept?.[concept.uniquePromptId]) {
             State.addPendingRarePrompt(concept.uniquePromptId);
             console.log(`Queued unique reflection prompt ${concept.uniquePromptId} for ${concept.name}`);
         }
         if (currentlyDisplayedConceptId === conceptId) {
             UI.updateGrimoireButtonStatus(conceptId, false); UI.updateFocusButtonStatus(conceptId); UI.updatePopupSellButton(conceptId, concept, true, false);
             if(document.getElementById('myNotesSection') && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) document.getElementById('myNotesSection').classList.remove('hidden');
             if(document.getElementById('popupEvolutionSection') && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED) UI.displayEvolutionSection(concept, State.getDiscoveredConcepts().get(conceptId));
         }
          UI.updateResearchButtonAfterAction(conceptId, 'add');
         checkTriggerReflectionPrompt('add');
         updateMilestoneProgress('addToGrimoire', 1); updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size);
         checkAndUpdateRituals('addToGrimoire'); // Use corrected single function
         UI.refreshGrimoireDisplay();
         UI.showTemporaryMessage(`${concept.name} added to Grimoire!`, 3000);
     } else { console.warn(`State update failed adding ${concept.name}.`); UI.showTemporaryMessage(`Error adding ${concept.name} to Grimoire.`, 3000); }
}

export function handleToggleFocusConcept() {
    if (currentlyDisplayedConceptId === null) return;
    const conceptId = currentlyDisplayedConceptId;
    const result = State.toggleFocusConcept(conceptId);
    const conceptName = State.getDiscoveredConcepts().get(conceptId)?.concept?.name || `Concept ${conceptId}`;

    if (result === 'not_discovered') { UI.showTemporaryMessage("Cannot focus undiscovered concept.", 3000); }
    else if (result === 'slots_full') { UI.showTemporaryMessage(`Focus slots full (${State.getFocusSlots()}).`, 3000); }
    else if (result === 'removed') {
         UI.showTemporaryMessage(`${conceptName} removed from Focus.`, 2500);
         checkAndUpdateRituals('removeFocus'); // Use corrected single function
         // UI updates
         UI.updateFocusButtonStatus(conceptId); UI.displayFocusedConceptsPersona(); UI.updateFocusElementalResonance(); UI.generateTapestryNarrative(); UI.synthesizeAndDisplayThemesPersona();
         checkForFocusUnlocks(); UI.refreshGrimoireDisplay();
    } else if (result === 'added') {
         UI.showTemporaryMessage(`${conceptName} marked as Focus!`, 2500);
         gainInsight(1.0, `Focused on ${conceptName}`);
         const concept = State.getDiscoveredConcepts().get(conceptId)?.concept;
         if (concept?.primaryElement) gainAttunementForAction('markFocus', concept.primaryElement, 1.0);
         updateMilestoneProgress('markFocus', 1); updateMilestoneProgress('focusedConcepts.size', State.getFocusedConcepts().size);
         checkAndUpdateRituals('markFocus'); // Use corrected single function
         // UI updates
         UI.updateFocusButtonStatus(conceptId); UI.displayFocusedConceptsPersona(); UI.updateFocusElementalResonance(); UI.generateTapestryNarrative(); UI.synthesizeAndDisplayThemesPersona();
         checkForFocusUnlocks(); UI.refreshGrimoireDisplay();
    }
}


// --- Reflection Logic ---
function checkTriggerReflectionPrompt(triggerAction = 'other') {
    const currentState = State.getState();
    if (currentState.currentOnboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) return;
    if (currentState.promptCooldownActive) return;

    if (triggerAction === 'add') State.incrementReflectionTrigger();
    if (triggerAction === 'completeQuestionnaire') {
        State.incrementReflectionTrigger(); State.incrementReflectionTrigger(); State.incrementReflectionTrigger();
    }

    const cardsAdded = currentState.cardsAddedSinceLastPrompt;
    const triggerThreshold = 3;
    const hasPendingRare = currentState.pendingRarePrompts.length > 0;

    if (hasPendingRare) {
        console.log("Pending rare prompt found, triggering reflection.");
        triggerReflectionPrompt('RareConcept');
        State.resetReflectionTrigger(true); startReflectionCooldown();
    } else if (cardsAdded >= triggerThreshold) {
        console.log("Reflection trigger threshold met.");
        triggerReflectionPrompt('Standard');
        State.resetReflectionTrigger(true); startReflectionCooldown();
    }
}

function startReflectionCooldown() {
    if (reflectionCooldownTimeout) clearTimeout(reflectionCooldownTimeout);
    reflectionCooldownTimeout = setTimeout(() => {
        State.clearReflectionCooldown(); console.log("Reflection cooldown ended."); reflectionCooldownTimeout = null;
    }, 1000 * 60 * 3); // 3 min cooldown
}

export function triggerReflectionPrompt(context = 'Standard', targetId = null, category = null) {
    if (!Utils.isDataReady()) return;

    currentReflectionContext = context;
    reflectionTargetConceptId = (context === 'Dissonance' || context === 'RareConcept' || context === 'SceneMeditation') ? targetId : null;
    currentReflectionCategory = category;

    let promptPool = []; let title = "Moment for Reflection"; let promptCategoryLabel = "General";
    let selectedPrompt = null; let showNudge = false; let reward = 5.0;

    console.log(`Attempting to trigger reflection. Context: ${context}, TargetID: ${targetId}, Category: ${category}`);

    // 1. Prioritize Rare Concept
    if (context === 'RareConcept' || (context !== 'Dissonance' && State.getState().pendingRarePrompts.length > 0)) {
        let rarePromptIdToUse = State.getNextRarePrompt(); // Gets and removes from state
        if (rarePromptIdToUse) {
            selectedPrompt = Data.reflectionPrompts.RareConcept?.[rarePromptIdToUse];
            if (selectedPrompt) {
                currentReflectionContext = 'RareConcept'; title = "Rare Concept Reflection";
                const conceptEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === rarePromptIdToUse);
                promptCategoryLabel = conceptEntry ? conceptEntry[1].concept.name : "Rare Concept";
                currentPromptId = selectedPrompt.id; reward = 7.0;
                console.log(`Displaying Rare Concept reflection: ${rarePromptIdToUse}`);
            } else { console.warn(`Could not find prompt text for rare prompt ID: ${rarePromptIdToUse}`); currentReflectionContext = 'Standard'; }
        }
    }

    // 2. Dissonance
    if (!selectedPrompt && context === 'Dissonance' && targetId) {
        title = "Dissonance Reflection";
        const concept = Data.concepts.find(c => c.id === targetId);
        promptCategoryLabel = concept ? concept.name : "Dissonant Concept";
        promptPool = Data.reflectionPrompts.Dissonance || []; showNudge = true;
        console.log(`Looking for Dissonance prompt for ${promptCategoryLabel}`);
    }
    // 3. Guided
    else if (!selectedPrompt && context === 'Guided' && category) {
        title = "Guided Reflection"; promptCategoryLabel = category;
        promptPool = Data.reflectionPrompts.Guided?.[category] || [];
        reward = Config.GUIDED_REFLECTION_COST + 2;
        console.log(`Looking for Guided prompt in category ${category}`);
    }
    // 4. Scene Meditation
     else if (!selectedPrompt && context === 'SceneMeditation' && targetId) {
         const scene = Data.sceneBlueprints.find(s => s.id === targetId);
         if (scene?.reflectionPromptId) {
             selectedPrompt = Data.reflectionPrompts.SceneMeditation?.[scene.reflectionPromptId];
             if (selectedPrompt) {
                  title = "Scene Meditation"; promptCategoryLabel = scene.name; currentPromptId = selectedPrompt.id;
                  reward = (scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5;
                  console.log(`Displaying Scene Meditation prompt: ${currentPromptId}`);
             } else { console.warn(`Scene Meditation prompt ${scene.reflectionPromptId} not found.`); currentReflectionContext = 'Standard'; }
         } else { console.warn(`Scene ${targetId} or its reflection prompt not found.`); currentReflectionContext = 'Standard'; }
     }

    // 5. Standard
    if (!selectedPrompt && currentReflectionContext === 'Standard') {
        title = "Standard Reflection";
        const attunement = State.getAttunement();
        const validElements = Object.entries(attunement).filter(([key, value]) => value > 0).sort(([,a], [,b]) => b - a);
        if (validElements.length > 0) {
             const [selectedKey] = validElements[Math.floor(Math.random() * validElements.length)];
             const selectedElementName = Data.elementKeyToFullName[selectedKey];
             promptPool = Data.reflectionPrompts[selectedElementName] || [];
             promptCategoryLabel = Data.elementDetails[selectedElementName]?.name || selectedElementName;
             console.log(`Looking for Standard prompt for element ${promptCategoryLabel}`);
             // Store the element name for potential attunement gain
             currentReflectionCategory = selectedElementName; // Store Full Name here for clarity
        } else { promptPool = []; console.warn("No elements with attunement > 0 for Standard reflection."); }
    }

    // --- Select Prompt from Pool ---
    if (!selectedPrompt && promptPool.length > 0) {
        const seen = State.getState().seenPrompts;
        const availablePrompts = promptPool.filter(p => !seen.has(p.id));
        selectedPrompt = availablePrompts.length > 0 ? availablePrompts[Math.floor(Math.random() * availablePrompts.length)] : promptPool[Math.floor(Math.random() * promptPool.length)];
        currentPromptId = selectedPrompt.id;
        console.log(`Selected prompt (ID: ${currentPromptId}): ${selectedPrompt.text}`);
    }

    // --- Display or Handle Failure ---
    if (selectedPrompt) {
        const promptData = { title, category: promptCategoryLabel, prompt: selectedPrompt, showNudge, reward };
        UI.displayReflectionPrompt(promptData, currentReflectionContext);
    } else {
        console.error(`Could not select a reflection prompt for context: ${context}`);
        if (context === 'Dissonance' && reflectionTargetConceptId !== null) {
            console.warn("Dissonance reflection failed, adding concept directly.");
            addConceptToGrimoireInternal(reflectionTargetConceptId);
            UI.hidePopups(); UI.showTemporaryMessage("Reflection unavailable, concept added directly.", 3500);
        } else if (context === 'Guided') { gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt found"); }
        UI.showTemporaryMessage("Could not find a suitable reflection prompt.", 3000);
        clearPopupState();
    }
}


export function handleConfirmReflection(nudgeAllowed) {
    if (!currentPromptId) { console.error("Cannot confirm reflection: No current prompt ID."); UI.hidePopups(); return; }
    console.log(`Reflection confirmed: Context=${currentReflectionContext}, Prompt=${currentPromptId}, Nudge=${nudgeAllowed}`);

    State.addSeenPrompt(currentPromptId);

    let rewardAmount = 5.0; let attunementKey = null; let attunementAmount = 1.0; let milestoneAction = 'completeReflection';

    // Determine reward based on context stored when prompt was displayed
    if (currentReflectionContext === 'Dissonance') {
        milestoneAction = 'completeReflectionDissonance';
        if (nudgeAllowed && reflectionTargetConceptId) {
             console.log("Processing score nudge...");
             const concept = Data.concepts.find(c => c.id === reflectionTargetConceptId);
             const scores = State.getScores(); let scoreNudged = false;
             if (concept?.elementScores) {
                 const newScores = { ...scores };
                 for (const key in scores) {
                     if (scores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) {
                         const userScore = scores[key]; const conceptScore = concept.elementScores[key]; const diff = conceptScore - userScore;
                         if (Math.abs(diff) > 1.5) {
                              const nudge = Math.sign(diff) * Config.SCORE_NUDGE_AMOUNT;
                              newScores[key] = Math.max(0, Math.min(10, userScore + nudge));
                              if (newScores[key] !== userScore) scoreNudged = true;
                         }
                     }
                 }
                 if (scoreNudged) {
                     State.updateScores(newScores); console.log("Updated User Scores after nudge:", State.getScores());
                     UI.displayPersonaScreen(); UI.showTemporaryMessage("Core understanding shifted slightly.", 3500);
                     gainAttunementForAction('scoreNudge', 'All', 0.5); updateMilestoneProgress('scoreNudgeApplied', 1);
                 }
             }
         }
         if (reflectionTargetConceptId) addConceptToGrimoireInternal(reflectionTargetConceptId);
    } else if (currentReflectionContext === 'Guided') {
        rewardAmount = Config.GUIDED_REFLECTION_COST + 2; attunementKey = null; // All elements generic gain
    } else if (currentReflectionContext === 'RareConcept') {
        rewardAmount = 7.0;
        const conceptEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId);
        attunementKey = conceptEntry ? conceptEntry[1].concept.primaryElement : null;
    } else if (currentReflectionContext === 'SceneMeditation') {
         const scene = Data.sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId);
         rewardAmount = (scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5;
         attunementKey = scene?.element || null;
    } else if (currentReflectionContext === 'Standard') {
        // currentReflectionCategory should hold the Full Element Name (e.g., "Attraction")
        attunementKey = Data.elementNameToKey[currentReflectionCategory] || null;
         if (!attunementKey) console.warn(`Could not determine element key for standard reflection category: ${currentReflectionCategory}`);
    }

    gainInsight(rewardAmount, `Reflection (${currentReflectionContext || 'Unknown'})`);
    if (attunementKey) gainAttunementForAction('completeReflection', attunementKey, attunementAmount);
    else gainAttunementForAction('completeReflectionGeneric', 'All', 0.2); // Generic gain if no specific key

    updateMilestoneProgress(milestoneAction, 1);
    checkAndUpdateRituals('completeReflection'); // Use corrected single function
    // Check context-specific rituals
     if (currentReflectionContext && currentPromptId) {
          // Need a way to link ritual track.contextMatch to the prompt/context
          // Example: if a ritual needs context 'FocusRitual_fr01'
          const ritualContextMatch = `${currentReflectionContext}_${currentPromptId}`; // Or map based on prompt ID if needed
           checkAndUpdateRituals('completeReflection', { contextMatch: ritualContextMatch }); // Pass context detail
     }

    UI.hidePopups(); UI.showTemporaryMessage("Reflection complete! Insight gained.", 3000);
    clearPopupState();
}

export function triggerGuidedReflection() {
     if (!Utils.isDataReady()) return;
     if (spendInsight(Config.GUIDED_REFLECTION_COST, "Guided Reflection")) {
         const availableCategories = Object.keys(Data.reflectionPrompts.Guided || {});
         if (availableCategories.length > 0) {
             const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
             console.log(`Triggering guided reflection for category: ${category}`);
             triggerReflectionPrompt('Guided', null, category);
         } else {
             console.warn("No guided reflection categories defined.");
             gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided reflections");
              UI.showTemporaryMessage("No guided reflections currently available.", 3000);
         }
     }
}


// --- Art Evolution ---
export function attemptArtEvolution() {
    if (!Utils.isDataReady() || currentlyDisplayedConceptId === null) return;
    const conceptId = currentlyDisplayedConceptId;
    const discoveredData = State.getDiscoveredConcepts().get(conceptId);
    if (!discoveredData?.concept || discoveredData.artUnlocked) { UI.showTemporaryMessage("Evolution failed: Concept state error.", 3000); return; }
    const concept = discoveredData.concept;
    if (!concept.canUnlockArt) return;

    const cost = Config.ART_EVOLVE_COST;
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const hasReflected = State.getState().seenPrompts.size > 0;
    const currentPhase = State.getOnboardingPhase();

    if (currentPhase < Config.ONBOARDING_PHASE.ADVANCED) { UI.showTemporaryMessage("Unlock the Repository first to delve deeper.", 3000); return; }
    if (!isFocused || !hasReflected) { UI.showTemporaryMessage("Cannot unlock art yet. Check requirements.", 3000); return; }

    if (spendInsight(cost, `Evolve Art: ${concept.name}`)) {
        if (State.unlockArt(conceptId)) {
            console.log(`Art unlocked for ${concept.name}!`);
            UI.showTemporaryMessage(`Enhanced Art Unlocked for ${concept.name}!`, 3500);
            if (currentlyDisplayedConceptId === conceptId) { UI.showConceptDetailPopup(conceptId); } // Refresh popup
            UI.refreshGrimoireDisplay();
            gainAttunementForAction('artEvolve', concept.primaryElement, 1.5);
            updateMilestoneProgress('evolveArt', 1);
            checkAndUpdateRituals('artEvolve'); // Use corrected single function
        } else {
             console.error(`State update failed during art evolution for ${concept.name}`);
             gainInsight(cost, `Refund: Art evolution state error ${concept.name}`);
             UI.showTemporaryMessage("Error updating art state.", 3000);
        }
    }
}

// --- Notes Logic ---
export function handleSaveNote() {
    if (currentlyDisplayedConceptId === null) return;
    const notesTextArea = document.getElementById('myNotesTextarea');
    if (!notesTextArea) return;
    const noteText = notesTextArea.value.trim();
    if (State.updateNotes(currentlyDisplayedConceptId, noteText)) {
        const statusSpan = document.getElementById('noteSaveStatus');
        if (statusSpan) { statusSpan.textContent = "Note Saved!"; statusSpan.classList.remove('error'); setTimeout(() => { statusSpan.textContent = ""; }, 2000); }
    } else {
         const statusSpan = document.getElementById('noteSaveStatus');
         if (statusSpan) { statusSpan.textContent = "Error: Concept not found."; statusSpan.classList.add('error'); }
    }
}

// --- Sell Logic ---
export function handleSellConcept(event) {
     const button = event.target.closest('button');
     if (!button) return;
     const conceptId = parseInt(button.dataset.conceptId);
     const context = button.dataset.context;
     if (isNaN(conceptId)) { console.error("Invalid concept ID for selling:", button.dataset.conceptId); return; }
     sellConcept(conceptId, context);
}

function sellConcept(conceptId, context) {
    if (!Utils.isDataReady()) return;
    const discoveredData = State.getDiscoveredConcepts().get(conceptId);
    const concept = discoveredData?.concept || Data.concepts.find(c => c.id === conceptId);
    if (!concept) { console.error(`Cannot sell concept ID ${conceptId}: Not found.`); UI.showTemporaryMessage("Error selling concept.", 3000); return; }

    let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
    const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
    const sourceLocation = context === 'grimoire' ? 'Grimoire' : 'Research Notes';

    if (confirm(`Sell '${concept.name}' (${concept.rarity}) from ${sourceLocation} for ${sellValue.toFixed(1)} Insight?`)) {
        gainInsight(sellValue, `Sold Concept: ${concept.name}`);
        updateMilestoneProgress('sellConcept', 1);

        let focusChanged = false;
        if (context === 'grimoire') {
             // Remove from state, which also handles removing focus
             if (State.removeDiscoveredConcept(conceptId)) {
                  focusChanged = State.getFocusedConcepts().has(conceptId); // Check if it *was* focused before removal potentially toggled it
                  UI.updateGrimoireCounter();
                  UI.refreshGrimoireDisplay();
             }
        } else if (context === 'research') {
            UI.updateResearchButtonAfterAction(conceptId, 'sell');
        }

        if (focusChanged) { // Update persona UI if focus changed
            UI.displayFocusedConceptsPersona(); UI.updateFocusElementalResonance(); UI.generateTapestryNarrative(); UI.synthesizeAndDisplayThemesPersona();
            checkForFocusUnlocks();
        }
        UI.showTemporaryMessage(`Sold ${concept.name} for ${sellValue.toFixed(1)} Insight.`, 2500);
        if (currentlyDisplayedConceptId === conceptId) UI.hidePopups();
    }
}


// --- Library Logic ---
export function handleUnlockLibraryLevel(event) {
     const button = event.target.closest('button');
     if (!button || button.disabled) return;
     const elementKey = button.dataset.elementKey;
     const levelToUnlock = parseInt(button.dataset.level);
     if (!elementKey || isNaN(levelToUnlock)) { console.error("Invalid data for unlocking library level"); return; }
     unlockDeepDiveLevel(elementKey, levelToUnlock);
}

function unlockDeepDiveLevel(elementKey, levelToUnlock) {
    if (!Utils.isDataReady()) return;
    const deepDiveData = Data.elementDeepDive[elementKey] || [];
    const levelData = deepDiveData.find(l => l.level === levelToUnlock);
    const currentLevel = State.getState().unlockedDeepDiveLevels[elementKey] || 0;
    if (!levelData || levelToUnlock !== currentLevel + 1) { console.warn(`Unlock attempt failed: Invalid level/sequence. Key: ${elementKey}, Target: ${levelToUnlock}, Current: ${currentLevel}`); return; }
    const cost = levelData.insightCost || 0;
    if (spendInsight(cost, `Unlock Library: ${Data.elementKeyToFullName[elementKey]} Lv ${levelToUnlock}`)) {
        if (State.unlockLibraryLevel(elementKey, levelToUnlock)) {
            console.log(`Unlocked ${Data.elementKeyToFullName[elementKey]} deep dive level ${levelToUnlock}`);
            UI.displayElementDeepDive(elementKey); // Refresh UI
            UI.showTemporaryMessage(`${Data.elementKeyToFullName[elementKey]} Insight Level ${levelToUnlock} Unlocked!`, 3000);
            updateMilestoneProgress('unlockLibrary', levelToUnlock);
            updateMilestoneProgress('unlockedDeepDiveLevels', State.getState().unlockedDeepDiveLevels);
            checkAndUpdateRituals('unlockLibrary'); // Use corrected single function
        } else { console.error(`State update failed unlocking library level ${elementKey} Lv ${levelToUnlock}`); gainInsight(cost, `Refund: Library unlock state error`); }
    }
}

// --- Repository Logic ---
export function handleMeditateScene(event) {
     const button = event.target.closest('button');
     if (!button || button.disabled) return;
     const sceneId = button.dataset.sceneId;
     if (!sceneId) return;
     meditateOnScene(sceneId);
}

function meditateOnScene(sceneId) {
    if (!Utils.isDataReady()) return;
    const scene = Data.sceneBlueprints.find(s => s.id === sceneId);
    if (!scene) { console.error(`Scene data not found for ID: ${sceneId}`); return; }
    const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
    if (spendInsight(cost, `Meditate on Scene: ${scene.name}`)) {
        if (scene.reflectionPromptId) {
             console.log(`Triggering Scene Meditation for ${scene.name} (Prompt ID: ${scene.reflectionPromptId})`);
             triggerReflectionPrompt('SceneMeditation', sceneId); // Pass scene ID as target
             updateMilestoneProgress('meditateScene', 1);
        } else { console.error(`Reflection prompt ID missing for scene ${sceneId}`); gainInsight(cost, `Refund: Missing prompt for scene ${sceneId}`); UI.showTemporaryMessage("Meditation failed: Reflection link missing.", 3000); }
    }
}

export function handleAttemptExperiment(event) {
     const button = event.target.closest('button');
     if (!button || button.disabled) return;
     const experimentId = button.dataset.experimentId;
     if (!experimentId) return;
     attemptExperiment(experimentId);
}

function attemptExperiment(experimentId) {
     if (!Utils.isDataReady()) return;
     const experiment = Data.alchemicalExperiments.find(e => e.id === experimentId);
     if (!experiment || State.getRepositoryItems().experiments.has(experimentId)) { console.warn(`Experiment ${experimentId} not found or completed.`); return; }

     const attunement = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();
     if (attunement[experiment.requiredElement] < experiment.requiredAttunement) { UI.showTemporaryMessage("Attunement too low.", 3000); return; }
     if (experiment.requiredFocusConceptIds) { for (const reqId of experiment.requiredFocusConceptIds) { if (!focused.has(reqId)) { const concept = Data.concepts.find(c=>c.id === reqId); UI.showTemporaryMessage(`Requires Concept Focus: ${concept?.name || `ID ${reqId}`}`, 3000); return; } } }
     if (experiment.requiredFocusConceptTypes) { for (const typeReq of experiment.requiredFocusConceptTypes) { let typeMet = false; const discoveredMap = State.getDiscoveredConcepts(); for (const focusId of focused) { const concept = discoveredMap.get(focusId)?.concept; if (concept?.cardType === typeReq) { typeMet = true; break; } } if (!typeMet) { UI.showTemporaryMessage(`Requires Focus of Type: ${typeReq}`, 3000); return; } } }

     const cost = experiment.insightCost || Config.EXPERIMENT_BASE_COST;
     if (!spendInsight(cost, `Attempt Experiment: ${experiment.name}`)) return;

     console.log(`Attempting experiment: ${experiment.name}`);
     updateMilestoneProgress('attemptExperiment', 1);
     const successRoll = Math.random();

     if (successRoll < (experiment.successRate || 0.5)) { // SUCCESS
         console.log("Experiment Successful!"); UI.showTemporaryMessage(`Success! Experiment '${experiment.name}' yielded results.`, 4000);
         State.addRepositoryItem('experiments', experiment.id);
         if (experiment.successReward) {
             if (experiment.successReward.type === 'insight') gainInsight(experiment.successReward.amount, `Experiment Success: ${experiment.name}`);
             if (experiment.successReward.type === 'attunement') gainAttunementForAction('experimentSuccess', experiment.successReward.element || 'All', experiment.successReward.amount);
             if (experiment.successReward.type === 'insightFragment') { if (State.addRepositoryItem('insights', experiment.successReward.id)) { console.log(`Experiment reward: Unlocked Insight ${experiment.successReward.id}`); updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size); } }
         }
     } else { // FAILURE
         console.log("Experiment Failed."); UI.showTemporaryMessage(`Experiment '${experiment.name}' failed... ${experiment.failureConsequence || "No lasting effects."}`, 4000);
         if (experiment.failureConsequence?.includes("Insight loss")) { const lossAmount = parseFloat(experiment.failureConsequence.match(/(\d+(\.\d+)?)/)?.[0] || 1); gainInsight(-lossAmount, `Experiment Failure: ${experiment.name}`); }
     }
     UI.displayRepositoryContent(); // Refresh repository view
}


// --- Daily Login ---
export function checkForDailyLogin() {
    const today = new Date().toDateString();
    const lastLogin = State.getState().lastLoginDate;
    if (lastLogin !== today) {
        console.log("First login of the day detected.");
        State.resetDailyRituals(); gainInsight(5.0, "Daily Login Bonus");
        UI.showTemporaryMessage("Daily Rituals Reset. Free Research Available!", 3500);
        UI.displayDailyRituals(); UI.displayResearchButtons();
    } else {
        console.log("Already logged in today."); UI.displayResearchButtons(); // Ensure button state is correct
    }
}

console.log("gameLogic.js loaded.");
