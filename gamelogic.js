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
    const elementName = Data.elementNames[currentState.currentElementIndex];

    if (type === 'slider') {
        UI.updateSliderFeedbackText(input);
    }

    const currentAnswers = UI.getQuestionnaireAnswers();
    State.updateAnswers(elementName, currentAnswers); // Update state (doesn't save yet)
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
     handleQuestionnaireInputChange(event); // Update feedback after potential change
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
    State.updateAnswers(Data.elementNames[currentState.currentElementIndex], currentAnswers);

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
        State.updateAnswers(Data.elementNames[currentState.currentElementIndex], currentAnswers);

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
    State.setQuestionnaireComplete(); // Marks complete and advances phase
    State.saveAllAnswers(allAnswers); // Explicitly save all collected answers

    determineStarterHandAndEssence();

    updateMilestoneProgress('completeQuestionnaire', 1);
    checkForDailyLogin();

    // Update UI elements that depend on final state
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter();
    UI.populateGrimoireFilters();
    UI.displayDailyRituals();
    // UI.displayPersonaScreen(); // Handled by showScreen
    // UI.displayRepositoryContent(); // Handled by showScreen
    UI.refreshGrimoireDisplay(); // Load initial grimoire view
    UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); // Apply UI changes for the new phase


    console.log("Final User Scores:", State.getScores());
    UI.showScreen('personaScreen'); // Go to Persona screen
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
        checkAndUpdateRituals('conductResearch');
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
    UI.displayResearchButtons(); // Update button state
    conductResearch(targetKey);
    updateMilestoneProgress('freeResearch', 1);
    checkAndUpdateRituals('freeResearch');
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

    if (canFindRareItem && discoveryRoll < sceneDiscoveryChance && Data.sceneBlueprints.length > 0) {
        const availableScenes = Data.sceneBlueprints.filter(s => !discoveredRepoItems.scenes.has(s.id));
        if (availableScenes.length > 0) {
            const foundScene = availableScenes[Math.floor(Math.random() * availableScenes.length)];
            if (State.addRepositoryItem('scenes', foundScene.id)) {
                 rareItemFound = true;
                 foundRepoItem = {type: 'scene', ...foundScene};
                 UI.showTemporaryMessage("Scene Blueprint Discovered!", 4000);
                 if(repositoryScreen && repositoryScreen.classList.contains('current')) UI.displayRepositoryContent();
            }
        }
    } else if (canFindRareItem && discoveryRoll < (sceneDiscoveryChance + insightDiscoveryChance) && Data.elementalInsights.length > 0) {
        const relevantInsights = Data.elementalInsights.filter(i => i.element === elementKeyToResearch);
        const unseenRelevant = relevantInsights.filter(i => !discoveredRepoItems.insights.has(i.id));
        const anyUnseen = Data.elementalInsights.filter(i => !discoveredRepoItems.insights.has(i.id));
        const poolToUse = unseenRelevant.length > 0 ? unseenRelevant : (anyUnseen.length > 0 ? anyUnseen : relevantInsights);
        if (poolToUse.length > 0) {
            const foundInsight = poolToUse[Math.floor(Math.random() * poolToUse.length)];
             if (State.addRepositoryItem('insights', foundInsight.id)) {
                 rareItemFound = true;
                 foundRepoItem = {type: 'insight', ...foundInsight};
                 UI.showTemporaryMessage("Elemental Insight Fragment Found!", 3500);
                 updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                 if(repositoryScreen && repositoryScreen.classList.contains('current')) UI.displayRepositoryContent();
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
        const pools = [
            { pool: priorityPool, weightMultiplier: 3.5 + (currentAttunement / 30) },
            { pool: secondaryPool, weightMultiplier: 1.5 + (currentAttunement / 60) },
            { pool: tertiaryPool, weightMultiplier: 0.8 }
        ];
        let combinedWeightedPool = []; let totalWeight = 0;
        const attunementFactor = 1 + (currentAttunement / (Config.MAX_ATTUNEMENT * 1.2));

        pools.forEach(({ pool, weightMultiplier }) => {
            pool.forEach(card => {
                let weight = 1.0 * weightMultiplier;
                if (card.rarity === 'uncommon') weight *= (1.3 * attunementFactor);
                else if (card.rarity === 'rare') weight *= (0.6 * attunementFactor);
                else weight *= (1.0 * attunementFactor);
                weight = Math.max(0.1, weight);
                totalWeight += weight;
                combinedWeightedPool.push({ card, weight });
            });
        });
        if (combinedWeightedPool.length === 0) return null;
        let randomPick = Math.random() * totalWeight;
        for (let i = 0; i < combinedWeightedPool.length; i++) {
            const chosenItem = combinedWeightedPool[i];
            if (randomPick < chosenItem.weight) {
                [priorityPool, secondaryPool, tertiaryPool].forEach(p => {
                    const index = p.findIndex(c => c.id === chosenItem.card.id);
                    if (index > -1) p.splice(index, 1);
                });
                return chosenItem.card;
            }
            randomPick -= chosenItem.weight;
        }
         // Fallback
         const flatPool = [...priorityPool, ...secondaryPool, ...tertiaryPool];
         if (flatPool.length > 0) {
              const fallbackIndex = Math.floor(Math.random() * flatPool.length);
              const chosenCard = flatPool[fallbackIndex];
               [priorityPool, secondaryPool, tertiaryPool].forEach(p => {
                  const index = p.findIndex(c => c.id === chosenCard.id);
                  if (index > -1) p.splice(index, 1);
              });
              console.warn("Weighted selection failed, using fallback.");
              return chosenCard;
         }
         return null;
    };

    let attempts = 0;
    const maxAttempts = numberOfResults * 4;
    while (selectedForOutput.length < numberOfResults && attempts < maxAttempts && (priorityPool.length > 0 || secondaryPool.length > 0 || tertiaryPool.length > 0)) {
        attempts++;
        let potentialCard = selectWeightedRandomFromPools();
        if (potentialCard) {
             if (discoveredIds.has(potentialCard.id)) {
                 gainInsight(1.0, `Duplicate Research (${potentialCard.name})`);
                 duplicateInsightGain += 1.0;
             } else {
                 if (!selectedForOutput.some(c => c.id === potentialCard.id)) {
                     selectedForOutput.push(potentialCard);
                 }
             }
        } else { break; }
    }

    let resultMessage = "";
    if (selectedForOutput.length > 0) {
        resultMessage = `Discovered ${selectedForOutput.length} new potential concept(s)! `;
        UI.displayResearchResults({ concepts: selectedForOutput, repositoryItems: [], duplicateInsightGain: duplicateInsightGain });
        gainAttunementForAction('researchSuccess', elementKeyToResearch, 0.8);
        if (selectedForOutput.some(c => c.rarity === 'rare')) {
            updateMilestoneProgress('discoverRareCard', 1);
        }
    } else {
        resultMessage = "No new concepts discovered this time. ";
        UI.displayResearchResults({ concepts: [], repositoryItems: [], duplicateInsightGain: duplicateInsightGain });
        gainAttunementForAction('researchFail', elementKeyToResearch, 0.2);
    }
    if (duplicateInsightGain > 0 && selectedForOutput.length === 0) {
        resultMessage += ` Gained ${duplicateInsightGain.toFixed(0)} Insight from echoes.`;
    }
    UI.displayResearchStatus(resultMessage.trim());
}


export function addConceptToGrimoireById(conceptId, buttonElement = null) {
    if (!Utils.isDataReady()) return;
    if (State.getDiscoveredConcepts().has(conceptId)) {
        UI.showTemporaryMessage("Already in Grimoire.", 2500);
        if (buttonElement) UI.updateResearchButtonAfterAction(conceptId, 'add'); // Update UI correctly
        return;
    }

    const concept = Data.concepts.find(c => c.id === conceptId);
    if (!concept) {
        console.error("Cannot add concept: Not found in base data. ID:", conceptId);
        UI.showTemporaryMessage("Error: Concept data not found.", 3000);
        return;
    }

    const distance = Utils.euclideanDistance(State.getScores(), concept.elementScores);

    if (distance > Config.DISSONANCE_THRESHOLD && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS) { // Only trigger dissonance if reflections unlocked
        console.log(`Dissonance detected for ${concept.name}. Triggering reflection.`);
        triggerReflectionPrompt('Dissonance', concept.id);
    } else {
        addConceptToGrimoireInternal(conceptId);
    }

     // Update the specific button in Research Notes immediately after attempting add
     UI.updateResearchButtonAfterAction(conceptId, 'add');
}


// Internal function to handle the actual addition after checks/reflection
export function addConceptToGrimoireInternal(conceptId) {
     if (!Utils.isDataReady()) return;
     const concept = Data.concepts.find(c => c.id === conceptId);
     if (!concept) { console.error("Internal add failed: Concept not found for ID:", conceptId); return; }
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

         // Update Popup if open
         if (currentlyDisplayedConceptId === conceptId) {
             UI.updateGrimoireButtonStatus(conceptId, false);
             UI.updateFocusButtonStatus(conceptId);
             UI.updatePopupSellButton(conceptId, concept, true, false);
             if(myNotesSection && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) myNotesSection.classList.remove('hidden');
             if(popupEvolutionSection && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED) {
                  UI.displayEvolutionSection(concept, State.getDiscoveredConcepts().get(conceptId));
             }
         }

          // Update Research Notes UI again (to remove sell button etc.)
          UI.updateResearchButtonAfterAction(conceptId, 'add');

         checkTriggerReflectionPrompt('add');
         updateMilestoneProgress('addToGrimoire', 1);
         updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size);
         checkAndUpdateRituals('addToGrimoire');
         UI.refreshGrimoireDisplay();
         UI.showTemporaryMessage(`${concept.name} added to Grimoire!`, 3000);
     } else {
          console.warn(`State update failed when adding ${concept.name} internally.`);
          UI.showTemporaryMessage(`Error adding ${concept.name} to Grimoire.`, 3000);
     }
}

export function handleToggleFocusConcept() { // Renamed from toggleFocusConcept to avoid conflict
    if (currentlyDisplayedConceptId === null) return;
    const conceptId = currentlyDisplayedConceptId;
    const result = State.toggleFocusConcept(conceptId);

    if (result === 'not_discovered') {
         UI.showTemporaryMessage("Cannot focus undiscovered concept.", 3000);
    } else if (result === 'slots_full') {
         UI.showTemporaryMessage(`Focus slots full (${State.getFocusSlots()}).`, 3000);
    } else if (result === 'removed') {
         const conceptName = State.getDiscoveredConcepts().get(conceptId)?.concept?.name || `Concept ${conceptId}`;
         UI.showTemporaryMessage(`${conceptName} removed from Focus.`, 2500);
         checkAndUpdateRituals('removeFocus');
         // UI updates
         UI.updateFocusButtonStatus(conceptId);
         UI.displayFocusedConceptsPersona();
         UI.updateFocusElementalResonance();
         UI.generateTapestryNarrative();
         UI.synthesizeAndDisplayThemesPersona();
         checkForFocusUnlocks(); // Re-check unlocks
         UI.refreshGrimoireDisplay(); // Update card stamp in grimoire view
    } else if (result === 'added') {
         const conceptName = State.getDiscoveredConcepts().get(conceptId)?.concept?.name || `Concept ${conceptId}`;
         UI.showTemporaryMessage(`${conceptName} marked as Focus!`, 2500);
         // Rewards
         gainInsight(1.0, `Focused on ${conceptName}`);
         const concept = State.getDiscoveredConcepts().get(conceptId)?.concept;
         if (concept?.primaryElement) {
             gainAttunementForAction('markFocus', concept.primaryElement, 1.0);
         }
         // Milestones & Rituals
         updateMilestoneProgress('markFocus', 1);
         updateMilestoneProgress('focusedConcepts.size', State.getFocusedConcepts().size);
         checkAndUpdateRituals('markFocus');
         // UI updates
         UI.updateFocusButtonStatus(conceptId);
         UI.displayFocusedConceptsPersona();
         UI.updateFocusElementalResonance();
         UI.generateTapestryNarrative();
         UI.synthesizeAndDisplayThemesPersona();
         checkForFocusUnlocks(); // Check for unlocks
         UI.refreshGrimoireDisplay(); // Update card stamp in grimoire view
    }
}


// --- Reflection Logic ---
function checkTriggerReflectionPrompt(triggerAction = 'other') {
    const currentState = State.getState();
    // Don't trigger reflections before phase 3
    if (currentState.currentOnboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) return;

    if (currentState.promptCooldownActive) return;

    if (triggerAction === 'add') { State.incrementReflectionTrigger(); }
    if (triggerAction === 'completeQuestionnaire') {
        State.incrementReflectionTrigger(); State.incrementReflectionTrigger(); State.incrementReflectionTrigger(); // Trigger after questionnaire
    }

    const cardsAdded = currentState.cardsAddedSinceLastPrompt;
    const triggerThreshold = 3;
    const hasPendingRare = currentState.pendingRarePrompts.length > 0;

    // Prioritize Rare prompts
    if (hasPendingRare) {
        console.log("Pending rare prompt found, triggering reflection.");
        triggerReflectionPrompt('RareConcept'); // Let triggerReflectionPrompt handle getting the ID
        State.resetReflectionTrigger(true);
        startReflectionCooldown();
    } else if (cardsAdded >= triggerThreshold) {
        console.log("Reflection trigger threshold met.");
        triggerReflectionPrompt('Standard');
        State.resetReflectionTrigger(true);
        startReflectionCooldown();
    }
}

function startReflectionCooldown() {
    if (reflectionCooldownTimeout) clearTimeout(reflectionCooldownTimeout);
    reflectionCooldownTimeout = setTimeout(() => {
        State.clearReflectionCooldown();
        console.log("Reflection cooldown ended.");
        reflectionCooldownTimeout = null;
    }, 1000 * 60 * 3); // 3 minute cooldown
}


// Central function to select and display a prompt
export function triggerReflectionPrompt(context = 'Standard', targetId = null, category = null) {
    if (!Utils.isDataReady()) return;

    currentReflectionContext = context;
    reflectionTargetConceptId = (context === 'Dissonance' || context === 'RareConcept' || context === 'SceneMeditation') ? targetId : null;
    currentReflectionCategory = category; // Store guided category or concept name

    let promptPool = [];
    let title = "Moment for Reflection";
    let promptCategoryLabel = "General"; // Used for display in the modal
    let selectedPrompt = null;
    let showNudge = false;
    let reward = 5.0; // Default insight reward

    console.log(`Attempting to trigger reflection. Context: ${context}, TargetID: ${targetId}, Category: ${category}`);

    // --- Determine Prompt Pool and Context ---

    // 1. Check for Rare Concept context explicitly or from pending queue
    if (context === 'RareConcept' || (context !== 'Dissonance' && State.getState().pendingRarePrompts.length > 0)) {
        let rarePromptIdToUse = null;
        if (context === 'RareConcept' && targetId) {
             // Might be triggered directly with a concept ID known to have a unique prompt
             const concept = State.getDiscoveredConcepts().get(targetId)?.concept;
             if (concept?.uniquePromptId && Data.reflectionPrompts.RareConcept?.[concept.uniquePromptId]) {
                  rarePromptIdToUse = concept.uniquePromptId;
                  // Remove from pending if it was there
                  const pendingIndex = State.getState().pendingRarePrompts.indexOf(rarePromptIdToUse);
                  if(pendingIndex > -1) State.getState().pendingRarePrompts.splice(pendingIndex, 1); // TODO: Need a state function for this
                  State.saveGameState(); // Save removal
             }
        } else {
             rarePromptIdToUse = State.getNextRarePrompt(); // Gets and removes from state queue
        }

        if (rarePromptIdToUse) {
            selectedPrompt = Data.reflectionPrompts.RareConcept?.[rarePromptIdToUse];
            if (selectedPrompt) {
                currentReflectionContext = 'RareConcept'; // Ensure context is correct
                title = "Rare Concept Reflection";
                const conceptEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === rarePromptIdToUse);
                promptCategoryLabel = conceptEntry ? conceptEntry[1].concept.name : "Rare Concept";
                currentPromptId = selectedPrompt.id; // Store the actual prompt ID (e.g., rP08)
                reward = 7.0; // Higher reward for rare
                console.log(`Displaying Rare Concept reflection: ${rarePromptIdToUse}`);
            } else {
                 console.warn(`Could not find prompt text for rare prompt ID: ${rarePromptIdToUse}`);
                 currentReflectionContext = 'Standard'; // Fallback to standard if prompt missing
            }
        }
         // If no rare prompt was selected, proceed to other contexts
    }

    // 2. Handle Dissonance (if no rare prompt was selected)
    if (!selectedPrompt && context === 'Dissonance' && targetId) {
        title = "Dissonance Reflection";
        const concept = Data.concepts.find(c => c.id === targetId);
        promptCategoryLabel = concept ? concept.name : "Dissonant Concept";
        promptPool = Data.reflectionPrompts.Dissonance || [];
        showNudge = true; // Enable nudge for Dissonance
        // Reward remains default 5.0, potentially modified by nudge later?
         console.log(`Looking for Dissonance prompt for ${promptCategoryLabel}`);
    }
    // 3. Handle Guided (if no rare prompt was selected)
    else if (!selectedPrompt && context === 'Guided' && category) {
        title = "Guided Reflection";
        promptCategoryLabel = category; // Use the category passed in
        promptPool = Data.reflectionPrompts.Guided?.[category] || [];
        reward = Config.GUIDED_REFLECTION_COST + 2; // Refund cost + bonus
         console.log(`Looking for Guided prompt in category ${category}`);
    }
    // 4. Handle Scene Meditation (if no rare prompt was selected)
     else if (!selectedPrompt && context === 'SceneMeditation' && targetId) {
         const scene = Data.sceneBlueprints.find(s => s.id === targetId);
         if (scene && scene.reflectionPromptId) {
             selectedPrompt = Data.reflectionPrompts.SceneMeditation?.[scene.reflectionPromptId];
             if (selectedPrompt) {
                  title = "Scene Meditation";
                  promptCategoryLabel = scene.name;
                  currentPromptId = selectedPrompt.id; // Use the scene's prompt ID
                  reward = (scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; // Refund + bonus
                  console.log(`Displaying Scene Meditation prompt: ${currentPromptId}`);
             } else {
                  console.warn(`Scene Meditation prompt ${scene.reflectionPromptId} not found.`);
                  currentReflectionContext = 'Standard'; // Fallback
             }
         } else {
              console.warn(`Scene ${targetId} or its reflection prompt not found.`);
              currentReflectionContext = 'Standard'; // Fallback
         }
     }


    // 5. Handle Standard (if no other context matched or selected a prompt)
    if (!selectedPrompt && currentReflectionContext === 'Standard') { // Check context again after potential fallbacks
        title = "Standard Reflection";
        const attunement = State.getAttunement();
        // Pick an element with *some* attunement, preferring higher attunement slightly
        const validElements = Object.entries(attunement)
                                   .filter(([key, value]) => value > 0)
                                   .sort(([,a], [,b]) => b - a); // Sort descending by attunement

        if (validElements.length > 0) {
             // Simple random pick for now, could add weighting later
             const [selectedKey] = validElements[Math.floor(Math.random() * validElements.length)];
             const selectedElementName = Data.elementKeyToFullName[selectedKey];
             promptPool = Data.reflectionPrompts[selectedElementName] || [];
             promptCategoryLabel = Data.elementDetails[selectedElementName]?.name || selectedElementName; // Use formatted name
             console.log(`Looking for Standard prompt for element ${promptCategoryLabel}`);
        } else {
             promptPool = []; // No valid elements to reflect on
             console.warn("No elements with attunement > 0 found for Standard reflection.");
        }
    }

    // --- Select Prompt from Pool (if not already selected) ---
    if (!selectedPrompt && promptPool.length > 0) {
        const seen = State.getState().seenPrompts;
        const availablePrompts = promptPool.filter(p => !seen.has(p.id));
        if (availablePrompts.length > 0) {
            selectedPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
            console.log("Selected unseen prompt:", selectedPrompt.id);
        } else {
            // If all seen, pick a random one from the pool
            selectedPrompt = promptPool[Math.floor(Math.random() * promptPool.length)];
            console.log("All prompts seen, reusing:", selectedPrompt.id);
        }
        currentPromptId = selectedPrompt.id; // Store the selected prompt ID
    }

    // --- Display or Handle Failure ---
    if (selectedPrompt) {
        const promptData = {
            title: title,
            category: promptCategoryLabel,
            prompt: selectedPrompt, // Pass the whole prompt object {id, text}
            showNudge: showNudge,
            reward: reward
        };
        UI.displayReflectionPrompt(promptData, currentReflectionContext); // Call UI function
    } else {
        console.error(`Could not select a reflection prompt for context: ${context}`);
        // If Dissonance fails, add the concept directly
        if (context === 'Dissonance' && reflectionTargetConceptId !== null) {
            console.warn("Dissonance reflection failed, adding concept directly.");
            addConceptToGrimoireInternal(reflectionTargetConceptId);
            UI.hidePopups(); // Ensure modal is hidden
            UI.showTemporaryMessage("Reflection unavailable, concept added directly.", 3500);
        } else {
             // Optionally refund insight if it was a paid action like Guided?
             if (context === 'Guided') {
                  gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt found");
             }
             UI.showTemporaryMessage("Could not find a suitable reflection prompt.", 3000);
        }
        clearPopupState(); // Clear context state on failure
    }
}


export function handleConfirmReflection(nudgeAllowed) {
    if (!currentPromptId) {
        console.error("Cannot confirm reflection: No current prompt ID.");
        UI.hidePopups();
        return;
    }
    console.log(`Reflection confirmed: Context=${currentReflectionContext}, Prompt=${currentPromptId}, Nudge=${nudgeAllowed}`);

    State.addSeenPrompt(currentPromptId); // Mark prompt as seen in state

    // Determine Reward and Attunement Element
    let rewardAmount = 5.0; // Default
    let attunementKey = null;
    let attunementAmount = 1.0;
    let milestoneAction = 'completeReflection';

    if (currentReflectionContext === 'Dissonance') {
        milestoneAction = 'completeReflectionDissonance';
        attunementAmount = 0.5; // Less attunement for dissonance? Or maybe more diverse? Let's keep it standard for now.
        // Nudge logic:
        if (nudgeAllowed && reflectionTargetConceptId) {
             console.log("Processing score nudge...");
             const concept = Data.concepts.find(c => c.id === reflectionTargetConceptId);
             const scores = State.getScores();
             let scoreNudged = false;
             if (concept?.elementScores) {
                 const newScores = { ...scores }; // Work on a copy
                 for (const key in scores) {
                     if (scores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) {
                         const userScore = scores[key];
                         const conceptScore = concept.elementScores[key];
                         const diff = conceptScore - userScore;
                         // Apply nudge only if difference is significant enough
                         if (Math.abs(diff) > 1.5) { // Threshold for nudging
                              // Nudge amount could be fixed or proportional? Let's use fixed.
                             const nudge = Math.sign(diff) * Config.SCORE_NUDGE_AMOUNT;
                             newScores[key] = Math.max(0, Math.min(10, userScore + nudge));
                             if (newScores[key] !== userScore) scoreNudged = true;
                         }
                     }
                 }
                 if (scoreNudged) {
                     State.updateScores(newScores); // Update state with nudged scores
                     console.log("Updated User Scores after nudge:", State.getScores());
                     UI.displayPersonaScreen(); // Refresh persona screen UI
                     UI.showTemporaryMessage("Core understanding shifted slightly.", 3500);
                     gainAttunementForAction('scoreNudge', 'All', 0.5); // Small attunement boost across all
                     updateMilestoneProgress('scoreNudgeApplied', 1);
                 }
             }
         }
         // Add the concept to the grimoire *after* processing reflection/nudge
         if (reflectionTargetConceptId) {
              addConceptToGrimoireInternal(reflectionTargetConceptId);
         }

    } else if (currentReflectionContext === 'Guided') {
        rewardAmount = Config.GUIDED_REFLECTION_COST + 2;
        // Guided reflections might grant 'All' attunement or be specific based on category - using generic for now
        attunementKey = null; // Target all elements
    } else if (currentReflectionContext === 'RareConcept') {
        rewardAmount = 7.0;
        // Try to get element from the rare concept itself
        const conceptEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId);
        attunementKey = conceptEntry ? conceptEntry[1].concept.primaryElement : null;
    } else if (currentReflectionContext === 'SceneMeditation') {
         const scene = Data.sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId);
         rewardAmount = (scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5;
         attunementKey = scene?.element || null; // Use scene's element if specified
    } else if (currentReflectionContext === 'Standard') {
        // Find the element name corresponding to the prompt ID (might need better mapping)
        // For now, assume currentReflectionCategory holds the Element Name correctly
        attunementKey = Data.elementNameToKey[currentReflectionCategory] || null;
         if (!attunementKey) console.warn(`Could not determine element key for standard reflection category: ${currentReflectionCategory}`);
    }

    // Grant Insight
    gainInsight(rewardAmount, `Reflection (${currentReflectionContext || 'Unknown'})`);

    // Grant Attunement
    if (attunementKey) {
        gainAttunementForAction('completeReflection', attunementKey, attunementAmount);
    } else {
        // Generic gain if no specific key determined (e.g., Guided, fallback)
        gainAttunementForAction('completeReflectionGeneric', 'All', 0.2);
    }

    // Update Milestones & Rituals
    updateMilestoneProgress(milestoneAction, 1); // Use specific action type if needed
    checkAndUpdateRituals('completeReflection'); // Check generic ritual trigger

     // Check context-specific rituals (if any defined with contextMatch)
     if (currentReflectionContext && currentPromptId) {
          const focusRitual = Data.focusRituals.find(r => r.track.contextMatch === currentReflectionContext + '_' + currentPromptId);
          if(focusRitual) checkAndUpdateRituals(focusRitual.track.action, { contextMatch: focusRitual.track.contextMatch });
     }


    UI.hidePopups(); // Close the modal
    UI.showTemporaryMessage("Reflection complete! Insight gained.", 3000);
    clearPopupState(); // Reset reflection state variables
    // State saving handled by gainInsight, gainAttunement, addSeenPrompt etc.
}

export function triggerGuidedReflection() {
     if (!Utils.isDataReady()) return;
     if (spendInsight(Config.GUIDED_REFLECTION_COST, "Guided Reflection")) {
         const availableCategories = Object.keys(Data.reflectionPrompts.Guided || {});
         if (availableCategories.length > 0) {
             // Maybe weight towards lower attunement elements? Or pure random?
             // Simple random for now:
             const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
             console.log(`Triggering guided reflection for category: ${category}`);
             triggerReflectionPrompt('Guided', null, category); // Use central trigger
         } else {
             console.warn("No guided reflection categories defined.");
             gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided reflections"); // Refund if none available
              UI.showTemporaryMessage("No guided reflections currently available.", 3000);
         }
     }
}


// --- Art Evolution ---
export function attemptArtEvolution() {
    if (!Utils.isDataReady() || currentlyDisplayedConceptId === null) return;
    const conceptId = currentlyDisplayedConceptId;
    const discoveredData = State.getDiscoveredConcepts().get(conceptId);
    if (!discoveredData || !discoveredData.concept || discoveredData.artUnlocked) {
        UI.showTemporaryMessage("Evolution failed: Concept state error.", 3000);
        return;
    }
    const concept = discoveredData.concept;
    if (!concept.canUnlockArt) return;

    const cost = Config.ART_EVOLVE_COST;
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const hasReflected = State.getState().seenPrompts.size > 0;
    const currentPhase = State.getOnboardingPhase();

    if (currentPhase < Config.ONBOARDING_PHASE.ADVANCED) {
        UI.showTemporaryMessage("Unlock the Repository first to delve deeper.", 3000);
        return;
    }

    // Re-check conditions before spending insight
    if (isFocused && hasReflected && spendInsight(cost, `Evolve Art: ${concept.name}`)) {
        if (State.unlockArt(conceptId)) { // Update state
            console.log(`Art unlocked for ${concept.name}!`);
            UI.showTemporaryMessage(`Enhanced Art Unlocked for ${concept.name}!`, 3500);

            // Update UI elements
            if (currentlyDisplayedConceptId === conceptId) { // Update popup if still open
                UI.displayEvolutionSection(concept, State.getDiscoveredConcepts().get(conceptId)); // Pass updated data
                UI.showConceptDetailPopup(conceptId); // Refresh popup content (incl. visual)
            }
            UI.refreshGrimoireDisplay(); // Refresh grimoire view for updated card visual

            // Grant rewards
            gainAttunementForAction('artEvolve', concept.primaryElement, 1.5);
            updateMilestoneProgress('evolveArt', 1);
            checkAndUpdateRituals('evolveArt'); // If there's a ritual for evolving art
            // State saved by State.unlockArt and gainAttunement
        } else {
             console.error(`State update failed during art evolution for ${concept.name}`);
             gainInsight(cost, `Refund: Art evolution state error ${concept.name}`); // Refund if state update fails
             UI.showTemporaryMessage("Error updating art state.", 3000);
        }
    } else if (!isFocused || !hasReflected) {
        UI.showTemporaryMessage("Cannot unlock art yet. Check requirements.", 3000);
    }
     // No 'else' needed for insufficient insight, spendInsight handles the message
}

// --- Notes Logic ---
export function handleSaveNote() {
    if (currentlyDisplayedConceptId === null) return;
    const notesTextArea = document.getElementById('myNotesTextarea'); // Get fresh reference
    if (!notesTextArea) return;
    const noteText = notesTextArea.value.trim();
    if (State.updateNotes(currentlyDisplayedConceptId, noteText)) {
        const statusSpan = document.getElementById('noteSaveStatus');
        if (statusSpan) {
            statusSpan.textContent = "Note Saved!";
            statusSpan.classList.remove('error');
            setTimeout(() => { statusSpan.textContent = ""; }, 2000);
        }
    } else {
         const statusSpan = document.getElementById('noteSaveStatus');
         if (statusSpan) {
            statusSpan.textContent = "Error: Concept not found.";
            statusSpan.classList.add('error');
         }
    }
}

// --- Sell Logic ---
export function handleSellConcept(event) {
     const button = event.target.closest('button'); // Ensure we get the button
     if (!button) return;
     const conceptId = parseInt(button.dataset.conceptId);
     const context = button.dataset.context; // 'grimoire' or 'research'

     if (isNaN(conceptId)) {
          console.error("Invalid concept ID for selling:", button.dataset.conceptId);
          return;
     }

     sellConcept(conceptId, context); // Call the main sell logic
}

function sellConcept(conceptId, context) {
    if (!Utils.isDataReady()) return;

    const discoveredData = State.getDiscoveredConcepts().get(conceptId);
    // Find concept data either from discovered or base list
    const concept = discoveredData?.concept || Data.concepts.find(c => c.id === conceptId);

    if (!concept) {
        console.error(`Cannot sell concept ID ${conceptId}: Not found.`);
        UI.showTemporaryMessage("Error selling concept.", 3000);
        return;
    }

    let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
    const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
    const sourceLocation = context === 'grimoire' ? 'Grimoire' : 'Research Notes';

    if (confirm(`Sell '${concept.name}' (${concept.rarity}) from ${sourceLocation} for ${sellValue.toFixed(1)} Insight?`)) {
        gainInsight(sellValue, `Sold Concept: ${concept.name}`);
        updateMilestoneProgress('sellConcept', 1); // Track milestone

        let focusChanged = false;
        if (context === 'grimoire') {
            if (State.getFocusedConcepts().has(conceptId)) {
                State.toggleFocusConcept(conceptId); // Remove from focus if selling from grimoire
                focusChanged = true;
            }
            State.removeDiscoveredConcept(conceptId); // Remove from state
            UI.updateGrimoireCounter();
            UI.refreshGrimoireDisplay(); // Update grimoire view
        } else if (context === 'research') {
            // Only needs UI update, state wasn't affected yet
            UI.updateResearchButtonAfterAction(conceptId, 'sell');
        }

        // If focus changed, update relevant Persona UI parts
        if (focusChanged) {
            UI.displayFocusedConceptsPersona();
            UI.updateFocusElementalResonance();
            UI.generateTapestryNarrative();
            UI.synthesizeAndDisplayThemesPersona();
             checkForFocusUnlocks(); // Re-check unlocks after removing focus
        }

        UI.showTemporaryMessage(`Sold ${concept.name} for ${sellValue.toFixed(1)} Insight.`, 2500);

        // If the popup was open for the sold concept, close it
        if (currentlyDisplayedConceptId === conceptId) {
            UI.hidePopups();
        }
        // State saving handled by gainInsight, removeDiscoveredConcept etc.
    }
}


// --- Library Logic ---
export function handleUnlockLibraryLevel(event) {
     const button = event.target.closest('button');
     if (!button || button.disabled) return;
     const elementKey = button.dataset.elementKey;
     const levelToUnlock = parseInt(button.dataset.level);

     if (!elementKey || isNaN(levelToUnlock)) {
          console.error("Invalid data for unlocking library level");
          return;
     }
     unlockDeepDiveLevel(elementKey, levelToUnlock);
}

function unlockDeepDiveLevel(elementKey, levelToUnlock) {
    if (!Utils.isDataReady()) return;
    const deepDiveData = Data.elementDeepDive[elementKey] || [];
    const levelData = deepDiveData.find(l => l.level === levelToUnlock);
    const currentLevel = State.getState().unlockedDeepDiveLevels[elementKey] || 0;

    if (!levelData || levelToUnlock !== currentLevel + 1) {
         console.warn(`Unlock attempt failed: Invalid level or sequence. Key: ${elementKey}, Target: ${levelToUnlock}, Current: ${currentLevel}`);
        return; // Prevent unlocking out of order or non-existent levels
    }
    const cost = levelData.insightCost || 0;

    if (spendInsight(cost, `Unlock Library: ${Data.elementKeyToFullName[elementKey]} Lv ${levelToUnlock}`)) {
        if (State.unlockLibraryLevel(elementKey, levelToUnlock)) { // Update state
            console.log(`Unlocked ${Data.elementKeyToFullName[elementKey]} deep dive level ${levelToUnlock}`);
            UI.displayElementDeepDive(elementKey); // Refresh UI for this element
            UI.showTemporaryMessage(`${Data.elementKeyToFullName[elementKey]} Insight Level ${levelToUnlock} Unlocked!`, 3000);
            updateMilestoneProgress('unlockLibrary', levelToUnlock); // Track milestone for any level unlock
            updateMilestoneProgress('unlockedDeepDiveLevels', State.getState().unlockedDeepDiveLevels); // Track specific levels
            checkAndUpdateRituals('unlockLibrary'); // Check rituals
             // State saved by State.unlockLibraryLevel
        } else {
             console.error(`State update failed unlocking library level ${elementKey} Lv ${levelToUnlock}`);
             gainInsight(cost, `Refund: Library unlock state error`); // Refund on failure
        }
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
        // Trigger the specific reflection prompt associated with the scene
        if (scene.reflectionPromptId) {
             console.log(`Triggering Scene Meditation for ${scene.name} (Prompt ID: ${scene.reflectionPromptId})`);
             // Let triggerReflectionPrompt handle finding and displaying
             triggerReflectionPrompt('SceneMeditation', sceneId); // Pass scene ID as target
             updateMilestoneProgress('meditateScene', 1); // Track milestone
        } else {
             console.error(`Reflection prompt ID missing for scene ${sceneId}`);
             gainInsight(cost, `Refund: Missing prompt for scene ${sceneId}`); // Refund if prompt is missing
             UI.showTemporaryMessage("Meditation failed: Reflection link missing.", 3000);
        }
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
     if (!experiment || State.getRepositoryItems().experiments.has(experimentId)) {
          console.warn(`Experiment ${experimentId} not found or already completed.`);
          return; // Don't attempt if not found or completed
     }

     const attunement = State.getAttunement();
     const focused = State.getFocusedConcepts();
     const insight = State.getInsight();

     // Check Attunement
     if (attunement[experiment.requiredElement] < experiment.requiredAttunement) {
         UI.showTemporaryMessage("Attunement too low for this experiment.", 3000); return;
     }
     // Check Focus Concepts (ID)
     if (experiment.requiredFocusConceptIds) {
         for (const reqId of experiment.requiredFocusConceptIds) {
             if (!focused.has(reqId)) {
                 const concept = Data.concepts.find(c=>c.id === reqId);
                 UI.showTemporaryMessage(`Requires Concept Focus: ${concept?.name || `ID ${reqId}`}`, 3000); return;
             }
         }
     }
      // Check Focus Concepts (Type)
     if (experiment.requiredFocusConceptTypes) {
         for (const typeReq of experiment.requiredFocusConceptTypes) {
             let typeMet = false;
             const discoveredMap = State.getDiscoveredConcepts();
             for (const focusId of focused) {
                 const concept = discoveredMap.get(focusId)?.concept;
                 if (concept && concept.cardType === typeReq) { typeMet = true; break; }
             }
             if (!typeMet) {
                 UI.showTemporaryMessage(`Requires Focus of Type: ${typeReq}`, 3000); return;
             }
         }
     }

     // Check Cost
     const cost = experiment.insightCost || Config.EXPERIMENT_BASE_COST;
     if (!spendInsight(cost, `Attempt Experiment: ${experiment.name}`)) {
         return; // spendInsight shows message if failed
     }

     // --- Attempt Experiment ---
     console.log(`Attempting experiment: ${experiment.name}`);
     updateMilestoneProgress('attemptExperiment', 1);
     const successRoll = Math.random();

     if (successRoll < (experiment.successRate || 0.5)) {
         // SUCCESS
         console.log("Experiment Successful!");
         UI.showTemporaryMessage(`Success! Experiment '${experiment.name}' yielded results.`, 4000);
         State.addRepositoryItem('experiments', experiment.id); // Mark as completed

         // Grant Rewards
         if (experiment.successReward) {
             if (experiment.successReward.type === 'insight') {
                 gainInsight(experiment.successReward.amount, `Experiment Success: ${experiment.name}`);
             } else if (experiment.successReward.type === 'attunement') {
                 gainAttunementForAction('experimentSuccess', experiment.successReward.element || 'All', experiment.successReward.amount);
             } else if (experiment.successReward.type === 'insightFragment') {
                  if (State.addRepositoryItem('insights', experiment.successReward.id)) {
                       console.log(`Experiment reward: Unlocked Insight ${experiment.successReward.id}`);
                       updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                  }
             }
         }
     } else {
         // FAILURE
         console.log("Experiment Failed.");
         UI.showTemporaryMessage(`Experiment '${experiment.name}' failed... ${experiment.failureConsequence || "No lasting effects."}`, 4000);
         // Apply Consequences (Example: Insight loss)
         if (experiment.failureConsequence?.includes("Insight loss")) {
             const lossAmount = parseFloat(experiment.failureConsequence.match(/(\d+(\.\d+)?)/)?.[0] || 1);
             gainInsight(-lossAmount, `Experiment Failure: ${experiment.name}`);
         }
         // Add other consequence handlers here (e.g., temporary attunement decrease)
     }

     UI.displayRepositoryContent(); // Refresh repository view
     // State is saved by gainInsight, addRepositoryItem etc.
}


// --- Rituals & Milestones Logic ---
export function checkAndUpdateRituals(action, details = {}) {
    if (!Utils.isDataReady()) return;
    let ritualCompletedThisCheck = false;
    const currentState = State.getState();
    const completedToday = currentState.completedRituals.daily || {};
    const focused = currentState.focusedConcepts;
    let currentRitualPool = [...Data.dailyRituals];

    // Add active focus rituals
    if (Data.focusRituals) {
        Data.focusRituals.forEach(ritual => {
            if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return;
            const requiredIds = new Set(ritual.requiredFocusIds);
            let allFocused = true;
            for (const id of requiredIds) { if (!focused.has(id)) { allFocused = false; break; } }
            if (allFocused) currentRitualPool.push({ ...ritual, isFocusRitual: true });
        });
    }

    currentRitualPool.forEach(ritual => {
        const completedData = completedToday[ritual.id] || { completed: false, progress: 0 };
        if (completedData.completed) return; // Skip already completed

        const actionMatch = ritual.track.action === action;
        // Check context if provided in details AND required by ritual
        const contextMatch = ritual.track.contextMatch && details.contextMatch === ritual.track.contextMatch;

        if (actionMatch || contextMatch) {
            const progress = State.completeRitualProgress(ritual.id, 'daily'); // Increment progress in state

            if (progress >= ritual.track.count) {
                console.log(`Ritual Completed: ${ritual.description}`);
                State.markRitualComplete(ritual.id, 'daily'); // Mark as fully complete in state
                ritualCompletedThisCheck = true;
                // Grant Reward
                if (ritual.reward) {
                    if (ritual.reward.type === 'insight') {
                        gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`);
                    } else if (ritual.reward.type === 'attunement') {
                        gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0);
                    } else if (ritual.reward.type === 'token') {
                        console.log(`TODO: Grant ${ritual.reward.tokenType || 'Research'} token`);
                    }
                }
            }
        }
    });

    if (ritualCompletedThisCheck) {
        UI.displayDailyRituals(); // Update UI if any ritual was completed
    }
     // State saving handled by State functions
}

// Tracks progress towards milestones and grants rewards
export function updateMilestoneProgress(trackType, currentValue) {
     if (!Utils.isDataReady()) return;
     let milestoneAchievedThisUpdate = false;

     Data.milestones.forEach(m => {
         if (!State.checkMilestone(m.id)) { // Check if already achieved using state getter
             let achieved = false;
             const threshold = m.track.threshold;
             let checkValue = null; // The value we're comparing against the threshold

             if (m.track.action === trackType) {
                  // For action-based milestones, currentValue is the count
                  if (typeof currentValue === 'number' && currentValue >= (m.track.count || 1)) { achieved = true; }
                  else if ((m.track.count === 1 || typeof m.track.count === 'undefined') && currentValue) { achieved = true; } // Simple trigger for count 1 actions
             } else if (m.track.state === trackType) {
                 // For state-based milestones
                 if (trackType === 'elementAttunement') {
                      const attunement = State.getAttunement();
                      if (m.track.element && attunement.hasOwnProperty(m.track.element)) { // Specific element check
                           checkValue = attunement[m.track.element];
                      } else if (m.track.condition === 'any') { // Check if any element meets threshold
                           achieved = Object.values(attunement).some(val => val >= threshold);
                      } else if (m.track.condition === 'all') { // Check if all elements meet threshold
                           achieved = Object.values(attunement).every(val => val >= threshold);
                      }
                 } else if (trackType === 'unlockedDeepDiveLevels') {
                      const levels = State.getState().unlockedDeepDiveLevels;
                      if (m.track.condition === 'any') {
                           achieved = Object.values(levels).some(val => val >= threshold);
                      } else if (m.track.condition === 'all') {
                           achieved = Object.values(levels).every(val => val >= threshold);
                      }
                 } else if (trackType === 'discoveredConcepts.size') {
                      checkValue = State.getDiscoveredConcepts().size;
                 } else if (trackType === 'focusedConcepts.size') {
                      checkValue = State.getFocusedConcepts().size;
                 } else if (trackType === 'repositoryInsightsCount') {
                      checkValue = State.getRepositoryItems().insights.size;
                 } else if (trackType === 'repositoryContents' && m.track.condition === "allTypesPresent") {
                      const items = State.getRepositoryItems();
                      achieved = items.scenes.size > 0 && items.experiments.size > 0 && items.insights.size > 0;
                 } else if (trackType === 'focusSlotsTotal') {
                     checkValue = State.getFocusSlots();
                 }

                 // If we determined a specific value to check against a threshold
                 if (checkValue !== null && typeof checkValue === 'number' && checkValue >= threshold) {
                      achieved = true;
                 }
             }

             // Grant reward if achieved
             if (achieved) {
                 console.log("Milestone Achieved!", m.description);
                 if (State.addAchievedMilestone(m.id)) { // Update state
                     milestoneAchievedThisUpdate = true;
                     UI.displayMilestones(); // Update UI immediately
                     UI.showMilestoneAlert(m.description); // Show alert

                     // Grant Reward
                     if (m.reward) {
                         if (m.reward.type === 'insight') {
                             gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`);
                         } else if (m.reward.type === 'attunement') {
                             gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0);
                         } else if (m.reward.type === 'increaseFocusSlots') {
                             const increaseAmount = m.reward.amount || 1;
                             if (State.increaseFocusSlots(increaseAmount)) {
                                 UI.updateFocusSlotsDisplay(); // Update UI for slots
                                 // Trigger check again for milestones dependent on focusSlotsTotal
                                 updateMilestoneProgress('focusSlotsTotal', State.getFocusSlots());
                             }
                         } else if (m.reward.type === 'discoverCard') {
                             const cardIdToDiscover = m.reward.cardId;
                             if (cardIdToDiscover && !State.getDiscoveredConcepts().has(cardIdToDiscover)) {
                                 const conceptToDiscover = Data.concepts.find(c => c.id === cardIdToDiscover);
                                 if (conceptToDiscover) {
                                     addConceptToGrimoireInternal(cardIdToDiscover); // Add it directly
                                     UI.showTemporaryMessage(`Milestone Reward: Discovered ${conceptToDiscover.name}!`, 3500);
                                 }
                             }
                         }
                         // Add other reward types here
                     }
                 } // End if state updated successfully
             } // End if achieved
         } // End if not already achieved
     }); // End forEach milestone

     // State saving handled by State functions (addAchievedMilestone, gainInsight, etc.)
 }


// --- Daily Login ---
export function checkForDailyLogin() {
    const today = new Date().toDateString();
    const lastLogin = State.getState().lastLoginDate;

    if (lastLogin !== today) {
        console.log("First login of the day detected.");
        State.resetDailyRituals(); // Resets daily rituals, grants free research, sets date
        gainInsight(5.0, "Daily Login Bonus");
        UI.showTemporaryMessage("Daily Rituals Reset. Free Research Available!", 3500);
        UI.displayDailyRituals(); // Update ritual display
        UI.displayResearchButtons(); // Update free research button state
        // Save game state handled by State.resetDailyRituals
    } else {
        console.log("Already logged in today.");
        // Ensure free research button is correctly disabled if already used
         if (!State.isFreeResearchAvailable()) {
            const freeButton = document.getElementById('freeResearchButton');
             if (freeButton) {
                freeButton.disabled = true;
                freeButton.textContent = "Daily Meditation Performed";
             }
         }
    }
}

// --- Persona Calculation Logic ---
export function calculateFocusScores() {
     const focusScores = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
     const focused = State.getFocusedConcepts();
     const discovered = State.getDiscoveredConcepts();
     const focusCount = focused.size;

     if (focusCount > 0) {
         focused.forEach(id => {
             const data = discovered.get(id);
             if (data?.concept?.elementScores) {
                 for (const key in focusScores) {
                     if (data.concept.elementScores.hasOwnProperty(key)) {
                         focusScores[key] += data.concept.elementScores[key];
                     }
                 }
             }
         });
         // Average the scores
         for (const key in focusScores) {
             focusScores[key] /= focusCount;
         }
     }
     return { focusScores, focusCount };
}

export function calculateTapestryNarrative() {
     if (!Utils.isDataReady()) return 'Narrative generation requires data.';
     const { focusScores, focusCount } = calculateFocusScores();

     if (focusCount === 0) {
         return 'Mark concepts as "Focus" to weave your narrative...';
     }

     const sortedElements = Object.entries(focusScores)
                                 .filter(([key, score]) => score > 0) // Only consider elements with some score
                                 .sort(([, a], [, b]) => b - a); // Sort descending

     if (sortedElements.length === 0) {
         return 'Your focused concepts show a balanced, subtle essence.';
     }

     const [topKey, topScore] = sortedElements[0];
     const topElementName = Data.elementDetails[Data.elementKeyToFullName[topKey]]?.name || topKey;

     // Find a representative concept for the top element
     let topConceptName = "";
     const discovered = State.getDiscoveredConcepts();
     for (const id of State.getFocusedConcepts()) {
         const data = discovered.get(id);
         if (data?.concept?.primaryElement === topKey || (data?.concept?.elementScores[topKey] || 0) >= 7) {
             topConceptName = data.concept.name;
             break;
         }
     }
     // Fallback if no strong representative found
     if (!topConceptName && State.getFocusedConcepts().size > 0) {
          topConceptName = discovered.get(State.getFocusedConcepts().values().next().value)?.concept?.name || "?";
     }


     let narrative = `Your current tapestry resonates strongly with **${topElementName}**`;
     if (topConceptName && topConceptName !== "?") narrative += `, reflected in your focus on **${topConceptName}**. `;
     else narrative += ". ";

     // Add secondary element if significant
     if (sortedElements.length > 1) {
         const [secondKey, secondScore] = sortedElements[1];
         if (secondScore > 3.5) { // Threshold for mentioning secondary
             const secondElementName = Data.elementDetails[Data.elementKeyToFullName[secondKey]]?.name || secondKey;
             let secondConceptName = "";
             for (const id of State.getFocusedConcepts()) {
                 const data = discovered.get(id);
                 if (data?.concept?.name === topConceptName) continue; // Skip the top one
                 if (data?.concept?.primaryElement === secondKey || (data?.concept?.elementScores[secondKey] || 0) >= 6) {
                     secondConceptName = data.concept.name;
                     break;
                 }
             }
             narrative += `Undercurrents of **${secondElementName}** add complexity`;
             if (secondConceptName) narrative += ` through **${secondConceptName}**.`;
             else narrative += ".";
         }
     }

     // Check for Synergy
     const { synergyNarrative } = checkForFocusUnlocks(true); // Call with silent=true
     if(synergyNarrative) {
          narrative += " " + synergyNarrative;
     }


     // Format and return
     return narrative.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export function calculateFocusThemes() {
     if (!Utils.isDataReady()) return [];
     const focused = State.getFocusedConcepts();
     const discovered = State.getDiscoveredConcepts();
     if (focused.size === 0) return [];

     const elementCountsByKey = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 };
     const themeThreshold = 7.0; // Score threshold to count towards a theme

     focused.forEach(id => {
         const concept = discovered.get(id)?.concept;
         if (concept?.elementScores) {
             for (const key in concept.elementScores) {
                 if (Data.elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= themeThreshold) {
                     elementCountsByKey[key]++;
                 }
             }
         }
     });

     const sortedThemes = Object.entries(elementCountsByKey)
                               .filter(([key, count]) => count > 0 && Data.elementDetails[Data.elementKeyToFullName[key]])
                               .sort(([, a], [, b]) => b - a) // Sort by count descending
                               .map(([key, count]) => ({
                                   key: key,
                                   name: Data.elementDetails[Data.elementKeyToFullName[key]]?.name || key,
                                   count: count
                               }));

     return sortedThemes;
}

// --- Focus Unlocks ---
export function checkForFocusUnlocks(silent = false) {
     if (!Utils.isDataReady() || !Data.focusDrivenUnlocks) return { synergyNarrative: "" };
     if(State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) return { synergyNarrative: "" }; // Don't check too early

     console.log("Checking for focus-driven unlocks...");
     let newlyUnlocked = false;
     let synergyNarrative = ""; // To potentially add to tapestry

     const focused = State.getFocusedConcepts();
     const unlockedItems = State.getUnlockedFocusItems(); // Get current unlocks from state

     Data.focusDrivenUnlocks.forEach(unlock => {
         if (unlockedItems.has(unlock.id)) return; // Skip already unlocked

         let requirementsMet = true;
         if (!unlock.requiredFocusIds || unlock.requiredFocusIds.length === 0) {
             requirementsMet = false;
         } else {
             for (const reqId of unlock.requiredFocusIds) {
                 if (!focused.has(reqId)) {
                     requirementsMet = false;
                     break;
                 }
             }
         }

         if (requirementsMet) {
             console.log(`Focus requirements met for Unlock ID: ${unlock.id}`);
             if (State.addUnlockedFocusItem(unlock.id)) { // Update state
                 newlyUnlocked = true;
                 const item = unlock.unlocks;
                 let unlockedItemName = item.name || `Item ${item.id}`;
                 let notificationText = unlock.description || `Unlocked ${unlockedItemName}`;

                 // Handle specific unlock types (e.g., adding to repository)
                 if (item.type === 'scene') {
                      if (State.addRepositoryItem('scenes', item.id)) {
                           console.log(`Unlocked Scene Blueprint: ${unlockedItemName}`);
                           notificationText += ` View Scene in Repository.`;
                      } else { notificationText += ` (Already Discovered)`; } // If scene was somehow found via research first
                 } else if (item.type === 'experiment') {
                      console.log(`Focus Unlock grants access eligibility to Experiment: ${unlockedItemName}. Check Attunement/requirements in Repository.`);
                      notificationText += ` Check Repository for Experiment details.`;
                 } else if (item.type === 'insightFragment') {
                      if (State.addRepositoryItem('insights', item.id)) {
                           const insightData = Data.elementalInsights.find(i => i.id === item.id);
                           unlockedItemName = insightData ? `Insight: "${insightData.text}"` : `Insight ${item.id}`;
                           console.log(`Unlocked Elemental Insight: ${item.id}`);
                           notificationText += ` View Insight in Repository.`;
                           updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                      } else { notificationText += ` (Already Discovered)`; }
                 }

                 // Generate synergy text (simple version for now)
                  const conceptNames = unlock.requiredFocusIds.map(id => State.getDiscoveredConcepts().get(id)?.concept?.name || `ID ${id}`);
                  synergyNarrative = `The synergy between **${conceptNames.join('** and **')}** is notable.`;


                 if (!silent) {
                     UI.showTemporaryMessage(`Focus Synergy: ${notificationText}`, 5000);
                 }
             }
         }
     });

     if (newlyUnlocked && !silent) {
         console.log("Newly unlocked Focus Items:", Array.from(State.getUnlockedFocusItems()));
         // Refresh repository if visible
         if (repositoryScreen && repositoryScreen.classList.contains('current')) {
             UI.displayRepositoryContent();
         }
         // Refresh persona narrative if visible
         if (personaScreen && personaScreen.classList.contains('current')) {
              UI.generateTapestryNarrative();
         }

         // State saved by State.addUnlockedFocusItem and addRepositoryItem
     }
     return { synergyNarrative }; // Return synergy text for tapestry
}


// --- Rituals & Milestones Logic (Helper) ---
// Check and update rituals based on action and details
export function checkAndUpdateRituals(action, details = {}) {
    if (!Utils.isDataReady()) return;
    let ritualCompletedThisCheck = false;
    const currentState = State.getState();
    const completedToday = currentState.completedRituals.daily || {};
    const focused = currentState.focusedConcepts;
    let currentRitualPool = [...Data.dailyRituals];

    // Add active focus rituals
    if (Data.focusRituals) {
        Data.focusRituals.forEach(ritual => {
            if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return;
            const requiredIds = new Set(ritual.requiredFocusIds);
            let allFocused = true;
            for (const id of requiredIds) { if (!focused.has(id)) { allFocused = false; break; } }
            if (allFocused) currentRitualPool.push({ ...ritual, isFocusRitual: true });
        });
    }

    currentRitualPool.forEach(ritual => {
        const completedData = completedToday[ritual.id] || { completed: false, progress: 0 };
        if (completedData.completed) return;

        const actionMatch = ritual.track.action === action;
        const contextMatch = ritual.track.contextMatch && details.contextMatch === ritual.track.contextMatch;

        if (actionMatch || contextMatch) {
            const progress = State.completeRitualProgress(ritual.id, 'daily');

            if (progress >= ritual.track.count) {
                console.log(`Ritual Completed: ${ritual.description}`);
                State.markRitualComplete(ritual.id, 'daily');
                ritualCompletedThisCheck = true;
                // Grant Reward
                if (ritual.reward) {
                    if (ritual.reward.type === 'insight') {
                        gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`);
                    } else if (ritual.reward.type === 'attunement') {
                        gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0);
                    } else if (ritual.reward.type === 'token') {
                        console.log(`TODO: Grant ${ritual.reward.tokenType || 'Research'} token`);
                    }
                }
            }
        }
    });

    if (ritualCompletedThisCheck) {
        UI.displayDailyRituals(); // Update UI
    }
}

// Tracks progress towards milestones and grants rewards
export function updateMilestoneProgress(trackType, currentValue) {
     if (!Utils.isDataReady()) return;
     let milestoneAchievedThisUpdate = false;
     const achievedSet = State.getState().achievedMilestones; // Use current state

     Data.milestones.forEach(m => {
         if (!achievedSet.has(m.id)) { // Check if already achieved
             let achieved = false;
             const threshold = m.track.threshold;
             let checkValue = null;

             if (m.track.action === trackType) {
                  if (typeof currentValue === 'number' && currentValue >= (m.track.count || 1)) { achieved = true; }
                  else if ((m.track.count === 1 || typeof m.track.count === 'undefined') && currentValue) { achieved = true; }
             } else if (m.track.state === trackType) {
                 // Get current state values for comparison
                 const attunement = State.getAttunement();
                 const levels = State.getState().unlockedDeepDiveLevels;
                 const discoveredSize = State.getDiscoveredConcepts().size;
                 const focusedSize = State.getFocusedConcepts().size;
                 const insightsCount = State.getRepositoryItems().insights.size;
                 const currentFocusSlots = State.getFocusSlots();

                 if (trackType === 'elementAttunement') {
                      if (m.track.element && attunement.hasOwnProperty(m.track.element)) {
                           checkValue = attunement[m.track.element];
                      } else if (m.track.condition === 'any') {
                           achieved = Object.values(attunement).some(val => val >= threshold);
                      } else if (m.track.condition === 'all') {
                           achieved = Object.values(attunement).every(val => val >= threshold);
                      }
                 } else if (trackType === 'unlockedDeepDiveLevels') {
                      if (m.track.condition === 'any') {
                           achieved = Object.values(levels).some(val => val >= threshold);
                      } else if (m.track.condition === 'all') {
                           achieved = Object.values(levels).every(val => val >= threshold);
                      }
                 } else if (trackType === 'discoveredConcepts.size') { checkValue = discoveredSize; }
                 else if (trackType === 'focusedConcepts.size') { checkValue = focusedSize; }
                 else if (trackType === 'repositoryInsightsCount') { checkValue = insightsCount; }
                 else if (trackType === 'focusSlotsTotal') { checkValue = currentFocusSlots; } // Check against threshold
                 else if (trackType === 'repositoryContents' && m.track.condition === "allTypesPresent") {
                      const items = State.getRepositoryItems();
                      achieved = items.scenes.size > 0 && items.experiments.size > 0 && items.insights.size > 0;
                 }

                 if (checkValue !== null && typeof checkValue === 'number' && checkValue >= threshold) { achieved = true; }
             }

             // Grant reward if achieved
             if (achieved) {
                 if (State.addAchievedMilestone(m.id)) { // Try to add to state, proceed only if successful
                     console.log("Milestone Achieved!", m.description);
                     milestoneAchievedThisUpdate = true;
                     UI.displayMilestones(); // Update UI
                     UI.showMilestoneAlert(m.description);

                     // Grant Reward logic...
                     if (m.reward) {
                         if (m.reward.type === 'insight') {
                             gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`);
                         } else if (m.reward.type === 'attunement') {
                             gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0);
                         } else if (m.reward.type === 'increaseFocusSlots') {
                             const increaseAmount = m.reward.amount || 1;
                             if (State.increaseFocusSlots(increaseAmount)) {
                                 UI.updateFocusSlotsDisplay();
                                 // Re-check milestones dependent on focusSlotsTotal immediately
                                 updateMilestoneProgress('focusSlotsTotal', State.getFocusSlots());
                             }
                         } else if (m.reward.type === 'discoverCard') {
                             const cardIdToDiscover = m.reward.cardId;
                             if (cardIdToDiscover && !State.getDiscoveredConcepts().has(cardIdToDiscover)) {
                                 const conceptToDiscover = Data.concepts.find(c => c.id === cardIdToDiscover);
                                 if (conceptToDiscover) {
                                     addConceptToGrimoireInternal(cardIdToDiscover);
                                     UI.showTemporaryMessage(`Milestone Reward: Discovered ${conceptToDiscover.name}!`, 3500);
                                 }
                             }
                         }
                     }
                 } // End if state updated
             } // End if achieved
         } // End if not already achieved
     }); // End forEach milestone
}


// --- Daily Login ---
export function checkForDailyLogin() {
    const today = new Date().toDateString();
    const lastLogin = State.getState().lastLoginDate;

    if (lastLogin !== today) {
        console.log("First login of the day detected.");
        State.resetDailyRituals();
        gainInsight(5.0, "Daily Login Bonus");
        UI.showTemporaryMessage("Daily Rituals Reset. Free Research Available!", 3500);
        UI.displayDailyRituals();
        UI.displayResearchButtons();
    } else {
        console.log("Already logged in today.");
         // Ensure free research button reflects correct state on load
         UI.displayResearchButtons();
    }
}

console.log("gameLogic.js loaded.");
