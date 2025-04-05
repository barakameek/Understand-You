
// js/gameLogic.js - Application Logic

import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as UI from './ui.js';
// Import specific data structures needed
import {
    elementDetails, elementKeyToFullName, elementNameToKey, concepts,
    questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals,
    milestones, focusRituals, sceneBlueprints, alchemicalExperiments,
    elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames,
    elementInteractionThemes, cardTypeThemes, onboardingTasks // Import tasks
} from '../data.js';

console.log("gameLogic.js loading...");

// --- Temporary State ---
let currentlyDisplayedConceptId = null;
let currentReflectionContext = null;
let reflectionTargetConceptId = null;
let currentReflectionCategory = null;
let currentPromptId = null;
let reflectionCooldownTimeout = null;

// --- Tapestry Analysis Cache ---
let currentTapestryAnalysis = null;

// --- Task System State ---
let currentTasks = [];


// --- Initialization & Core State ---
export function clearPopupState() {
    currentlyDisplayedConceptId = null;
    currentReflectionContext = null;
    reflectionTargetConceptId = null;
    currentReflectionCategory = null;
    currentPromptId = null;
}
export function setCurrentPopupConcept(conceptId) { currentlyDisplayedConceptId = conceptId; }
export function getCurrentPopupConceptId() { return currentlyDisplayedConceptId; } // Exported for UI use


// --- Insight & Attunement Management ---
 function gainInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount === 0) return;
    const changed = State.changeInsight(amount);
    if (changed) {
        const action = amount > 0 ? "Gained" : "Spent";
        const currentInsight = State.getInsight();
        console.log(`${action} ${Math.abs(amount).toFixed(1)} Insight from ${source}. New total: ${currentInsight.toFixed(1)}`);
        UI.updateInsightDisplays();
        // No need to save here, State.changeInsight handles it
    }
}

 function spendInsight(amount, source = "Unknown") {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return false;
    if (State.getInsight() >= amount) {
        gainInsight(-amount, source); // gainInsight calls State.changeInsight which saves
        return true;
    } else {
        UI.showTemporaryMessage(`Not enough Insight! Need ${amount.toFixed(1)}.`, 3000);
        return false;
    }
}

 function gainAttunementForAction(actionType, elementKey = null, amount = 0.5) {
    let targetKeys = [];
    let baseAmount = amount;

    // Determine target elements based on action and context
    if (elementKey && elementKey !== 'All' && State.getAttunement().hasOwnProperty(elementKey)) {
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
             console.warn(`Could not determine target element for reflection context: ${currentReflectionContext}, category: ${currentReflectionCategory}, prompt: ${currentPromptId}. Applying small bonus to all.`);
             targetKeys = Object.keys(State.getAttunement());
             baseAmount = 0.1; // Smaller bonus if specific element unknown
         }

    } else if (['generic', 'completeReflectionGeneric', 'scoreNudge', 'ritual', 'milestone', 'experimentSuccess', 'artEvolve', 'addToGrimoire', 'discover', 'markFocus', 'contemplation', 'researchSuccess', 'researchFail', 'researchSpecial'].includes(actionType) || elementKey === 'All') {
        targetKeys = Object.keys(State.getAttunement());
        if (actionType === 'scoreNudge') baseAmount = (0.5 / (targetKeys.length || 1));
        else if (actionType === 'completeReflectionGeneric') baseAmount = 0.2;
        else if (actionType === 'generic') baseAmount = 0.1;
        else if (actionType === 'contemplation' && elementKey === 'All') baseAmount = 0.1;
        else if (actionType === 'contemplation' && elementKey !== 'All') baseAmount = 0.4;
        else if (actionType === 'researchSuccess') baseAmount = 0.8;
        else if (actionType === 'researchFail') baseAmount = 0.2;
        else if (actionType === 'researchSpecial') baseAmount = 1.0;
    } else {
        console.warn(`gainAttunementForAction called with unhandled action/context: action=${actionType}, key=${elementKey}, context=${currentReflectionContext}, category=${currentReflectionCategory}`);
        return; // Don't proceed if we don't know what to do
    }

    let changed = false;
    targetKeys.forEach(key => {
        if (State.updateAttunement(key, baseAmount)) { // State.updateAttunement now handles saving
            changed = true;
            // Trigger milestone checks after state change
            updateMilestoneProgress('elementAttunement', { [key]: State.getAttunement()[key] }); // Pass specific value
            updateMilestoneProgress('elementAttunement', State.getAttunement()); // Pass whole object for 'all'/'any' checks
        }
    });

    if (changed) {
        console.log(`Attunement updated (${actionType}, Key(s): ${targetKeys.join(',') || 'All'}) by ${baseAmount.toFixed(2)} per element.`);
        if (document.getElementById('personaScreen')?.classList.contains('current')) {
           UI.displayElementAttunement(); // Update UI if relevant screen is visible
       }
    }
}


// --- Questionnaire Logic ---
 export function handleQuestionnaireInputChange(event) { // Needs to be exported for UI listener
    console.log("Input change detected:", event.target.id, event.target.value);
    const input = event.target;
    const type = input.dataset.type;
    const currentState = State.getState();

    if (currentState.currentElementIndex < 0 || currentState.currentElementIndex >= elementNames.length) {
        console.warn(`Questionnaire input change outside valid index (${currentState.currentElementIndex}). Ignoring.`);
        return;
    }
    const elementName = elementNames[currentState.currentElementIndex];

    const currentAnswers = UI.getQuestionnaireAnswers();
    State.updateAnswers(elementName, currentAnswers); // Update state (doesn't save immediately)

    if (type === 'slider') {
        const sliderElement = document.getElementById(input.id);
        if(sliderElement) {
             UI.updateSliderFeedbackText(sliderElement, elementName);
        } else {
            console.warn(`Could not find slider element ${input.id} to update feedback.`);
        }
    }
    UI.updateDynamicFeedback(elementName, currentAnswers); // Update UI immediately
    console.log(`Handled input change for ${elementName} with answers:`, currentAnswers);
}

 export function handleCheckboxChange(event) { // Needs to be exported for UI listener
     const checkbox = event.target; const name = checkbox.name; const maxChoices = parseInt(checkbox.dataset.maxChoices || 2);
     const container = checkbox.closest('.checkbox-options'); if (!container) return;
     const checkedBoxes = container.querySelectorAll(`input[name="${name}"]:checked`);
     if (checkedBoxes.length > maxChoices) {
        UI.showTemporaryMessage(`Max ${maxChoices} options.`, 2500);
        checkbox.checked = false;
        // Do NOT trigger handleQuestionnaireInputChange here directly, let the 'change' event finish
        // Instead, re-collect answers and update state/UI if necessary, but better to just prevent check
     } else {
        handleQuestionnaireInputChange(event); // Trigger normal update if within limits
     }
}

 export function calculateElementScore(elementName, answersForElement) { // Exported for UI feedback
    const questions = questionnaireGuided[elementName] || []; let score = 5.0;
    questions.forEach(q => {
        const answer = answersForElement[q.qId]; let pointsToAdd = 0; const weight = q.scoreWeight || 1.0;
        if (q.type === 'slider') {
            const value = (answer !== undefined && !isNaN(parseFloat(answer))) ? parseFloat(answer) : q.defaultValue;
            const baseValue = q.defaultValue !== undefined ? q.defaultValue : 5;
            pointsToAdd = (value - baseValue) * weight;
        }
        else if (q.type === 'radio') {
            const opt = q.options.find(o => o.value === answer);
            pointsToAdd = opt ? (opt.points || 0) * weight : 0;
        }
        else if (q.type === 'checkbox' && Array.isArray(answer)) {
            answer.forEach(val => {
                const opt = q.options.find(o => o.value === val);
                pointsToAdd += opt ? (opt.points || 0) * weight : 0;
            });
        }
        score += pointsToAdd;
    });
    return Math.max(0, Math.min(10, score)); // Clamp
}

 export function goToNextElement() { // Exported for UI listener
    const currentState = State.getState();
    const currentAnswers = UI.getQuestionnaireAnswers(); // Get latest answers from UI

    if (currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) {
        const elementName = elementNames[currentState.currentElementIndex];
        State.updateAnswers(elementName, currentAnswers); // Save answers for the *current* element
        console.log(`Saved answers for ${elementName} before moving next:`, currentAnswers);
    } else {
        console.warn("goToNextElement called with invalid index:", currentState.currentElementIndex);
    }

    const nextIndex = currentState.currentElementIndex + 1;
    if (nextIndex >= elementNames.length) {
         finalizeQuestionnaire(); // This handles final saving and state update
    } else {
        State.updateElementIndex(nextIndex); // Update index in state
        UI.displayElementQuestions(nextIndex); // Show next set of questions
    }
}

 export function goToPrevElement() { // Exported for UI listener
    const currentState = State.getState();

    if (currentState.currentElementIndex > 0) {
        // Save answers for current element before going back (optional, but good practice)
        const currentAnswers = UI.getQuestionnaireAnswers();
        if (currentState.currentElementIndex < elementNames.length) {
             const elementName = elementNames[currentState.currentElementIndex];
             State.updateAnswers(elementName, currentAnswers);
             console.log(`Saved answers for ${elementName} before going back.`);
        }

        const prevIndex = currentState.currentElementIndex - 1;
        State.updateElementIndex(prevIndex); // Update index in state
        UI.displayElementQuestions(prevIndex); // Display previous questions
    } else {
        console.log("Already at the first element.");
    }
}

 export function finalizeQuestionnaire() { // Exported for UI calls
    console.log("Finalizing scores...");
    const finalScores = {};
    const allAnswers = State.getState().userAnswers; // Get all answers stored in state

    elementNames.forEach(elementName => {
        const score = calculateElementScore(elementName, allAnswers[elementName] || {});
        const key = elementNameToKey[elementName];
        if (key) {
            finalScores[key] = score;
        } else {
            console.warn(`No key found for element name: ${elementName}`);
        }
    });

    State.updateScores(finalScores); // Update scores in state (triggers save)
    State.setQuestionnaireComplete(); // Mark as complete, advance phase (triggers save)
    // State.saveAllAnswers(allAnswers); // No longer needed, State handles saving relevant parts

    determineStarterHandAndEssence(); // Add initial cards
    updateMilestoneProgress('completeQuestionnaire', 1); // Check completion milestone
    checkForDailyLogin(); // Perform daily check
    updateAvailableTasks(); // Check for tasks now available

    // Prepare UI Data BEFORE showing screens
    UI.updateInsightDisplays();
    UI.updateFocusSlotsDisplay();
    UI.updateGrimoireCounter();
    UI.populateGrimoireFilters();
    UI.displayDailyRituals();
    UI.refreshGrimoireDisplay(); // Populate Grimoire based on starter hand
    calculateTapestryNarrative(true); // Force initial narrative calculation
    UI.displayPersonaSummary(); // Generate summary text

    UI.applyOnboardingPhaseUI(State.getOnboardingPhase()); // Ensure UI matches phase
    console.log("Final User Scores:", State.getScores());

    UI.showScreen('personaScreen'); // Transition to Persona screen
    UI.showTemporaryMessage("Experiment Complete! Explore your results.", 4000);
}

// --- Starter Hand ---
function determineStarterHandAndEssence() {
    console.log("Determining starter hand...");
    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) { console.error("Concepts missing."); return; }
    const userScores = State.getScores();
    let conceptsWithDistance = concepts
        .map(c => ({ ...c, distance: Utils.euclideanDistance(userScores, c.elementScores) }))
        .filter(c => c.distance !== Infinity && !isNaN(c.distance)); // Ensure distance is valid

    if (conceptsWithDistance.length === 0) {
        console.error("Distance calculation failed or no valid concepts.");
        // Fallback: grant first few concepts if calculations fail
        const defaultStarters = concepts.slice(0, 5);
        defaultStarters.forEach(c => {
            if (State.addDiscoveredConcept(c.id, c)) {
                gainAttunementForAction('discover', c.primaryElement, 0.3);
            }
        });
        console.warn("Granted default starter concepts due to error.");
        UI.updateGrimoireCounter();
        return;
    }

    conceptsWithDistance.sort((a, b) => a.distance - b.distance); // Sort by closeness

    const candidates = conceptsWithDistance.slice(0, 25); // Consider top 25 closest
    const starterHand = [];
    const starterHandIds = new Set();
    const targetHandSize = 7;
    const elementRepTarget = 4; // Try to get at least 4 different primary elements represented
    const representedElements = new Set();

    // Phase 1: Add top 4 closest unique concepts
    for (const c of candidates) {
        if (starterHand.length >= 4) break;
        if (!starterHandIds.has(c.id)) {
            starterHand.push(c);
            starterHandIds.add(c.id);
            if (c.primaryElement) representedElements.add(c.primaryElement);
        }
    }

    // Phase 2: Add more concepts prioritizing element representation, up to 5 total
    for (const c of candidates) {
        if (starterHand.length >= 5) break; // Target 5 here
        if (starterHandIds.has(c.id)) continue; // Skip if already added

        const needsRep = c.primaryElement && representedElements.size < elementRepTarget && !representedElements.has(c.primaryElement);
        if (needsRep) {
            starterHand.push(c);
            starterHandIds.add(c.id);
            if (c.primaryElement) representedElements.add(c.primaryElement);
        }
    }

    // Phase 3: Fill remaining slots up to target size with closest remaining unique candidates
    for (const c of candidates) {
        if (starterHand.length >= targetHandSize) break;
        if (!starterHandIds.has(c.id)) {
            starterHand.push(c);
            starterHandIds.add(c.id);
            // No need to track element representation here, just filling slots
        }
    }

    console.log("Starter Hand Selected:", starterHand.map(c => c.name));
    starterHand.forEach(c => {
        if (State.addDiscoveredConcept(c.id, c)) { // addDiscoveredConcept triggers save
            gainAttunementForAction('discover', c.primaryElement, 0.3);
        }
    });

    updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size); // Check milestones related to count
    UI.updateGrimoireCounter(); // Update UI counter
}


// --- Core Actions (Research, Reflection, Focus, etc.) ---
// Screen Logic Wrappers
 export function displayPersonaScreenLogic() { // Exported for UI
    calculateTapestryNarrative(true); // Recalculate narrative on screen show
    UI.displayPersonaScreen();
    UI.updateTapestryDeepDiveButton();
    UI.updateSuggestSceneButtonState();
    checkTaskCompletion('showScreen', 'personaScreen'); // Check tasks related to showing screen
}
 export function displayStudyScreenLogic() { // Exported for UI
    UI.displayStudyScreenContent(); // Refresh study screen elements
    checkTaskCompletion('showScreen', 'studyScreen'); // Check tasks
}

// Research Actions
 export function handleResearchClick(event) { // Exported for UI listener
    const button = event.currentTarget; const elementKey = button.dataset.elementKey; const cost = parseFloat(button.dataset.cost);
    if (!elementKey || isNaN(cost) || button.disabled) return;
    if (spendInsight(cost, `Research: ${elementKeyToFullName[elementKey]}`)) {
        console.log(`Spent ${cost} Insight on ${elementKey}.`);
        conductResearch(elementKey);
    }
}
 export function handleFreeResearchClick() { // Exported for UI listener
    if (!State.isFreeResearchAvailable()) { UI.showTemporaryMessage("Daily meditation done.", 3000); return; }
    const attunement = State.getAttunement(); let targetKey = 'A'; let minAtt = Config.MAX_ATTUNEMENT + 1;
    // Find element with lowest attunement
    for (const key in attunement) { if (attunement[key] < minAtt) { minAtt = attunement[key]; targetKey = key; } }
    console.log(`Free meditation on ${targetKey} (${elementKeyToFullName[targetKey]})`);
    State.setFreeResearchUsed(); // Mark as used (triggers save)
    UI.displayResearchButtons(); // Update button state
    conductResearch(targetKey);
    checkTaskCompletion('freeResearch');
    checkAndUpdateRituals('freeResearch'); // Check daily ritual completion
}

// Internal research logic
function conductResearch(elementKeyToResearch) {
    const elementFullName = elementKeyToFullName[elementKeyToResearch]; if (!elementFullName) { console.error(`Invalid key: ${elementKeyToResearch}`); return; }
    console.log(`Researching: ${elementFullName}`); UI.displayResearchStatus(`Reviewing ${elementDetails[elementFullName]?.name || elementFullName}...`);

    const discoveredIds = new Set(State.getDiscoveredConcepts().keys());
    const discoveredRepo = State.getRepositoryItems();
    const undiscoveredPool = concepts.filter(c => !discoveredIds.has(c.id));

    let rareFound = false;
    const roll = Math.random();
    const insightChance = 0.12;
    const researchOutElem = document.getElementById('researchOutput');
    // Check if research output is empty or only has placeholder
    const canFindRare = researchOutElem && (researchOutElem.children.length === 0 || researchOutElem.querySelector('p > i'));
    let foundRepoItem = null;

    // Try finding a Repository Item first (if output area is clear)
    if (!rareFound && canFindRare && roll < insightChance && elementalInsights.length > 0) {
        const relevant = elementalInsights.filter(i => i.element === elementKeyToResearch);
        const unseenRel = relevant.filter(i => !discoveredRepo.insights.has(i.id));
        const anyUnseen = elementalInsights.filter(i => !discoveredRepo.insights.has(i.id));
        const pool = unseenRel.length > 0 ? unseenRel : (anyUnseen.length > 0 ? anyUnseen : relevant); // Prioritize relevant, then any unseen, then any relevant
        if (pool.length > 0) {
            const found = pool[Math.floor(Math.random() * pool.length)];
            if (State.addRepositoryItem('insights', found.id)) { // addRepositoryItem triggers save & phase check
                rareFound = true;
                foundRepoItem = {type: 'insight', ...found};
                UI.showTemporaryMessage("Insight Fragment Found!", 3500);
                updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                if(document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent(); // Update repo if visible
            }
        }
    }
    // Add similar logic for Scene Blueprints if they can be found randomly via research

    // If a rare item was found, display it and stop
    if (rareFound && foundRepoItem) {
        UI.displayResearchResults({ concepts: [], repositoryItems: [foundRepoItem], duplicateInsightGain: 0 });
        UI.displayResearchStatus("Unique insight unearthed!");
        gainAttunementForAction('researchSpecial', elementKeyToResearch); // Grant special attunement
        checkTaskCompletion('conductResearch');
        checkAndUpdateRituals('conductResearch');
        updateMilestoneProgress('conductResearch', 1);
        return; // Stop here, don't look for concepts
    }

    // --- Normal Concept Discovery ---
    if (undiscoveredPool.length === 0) {
        UI.displayResearchStatus("No more concepts to discover.");
        if (researchOutElem && researchOutElem.children.length === 0) researchOutElem.innerHTML = '<p><i>Library holds all known concepts.</i></p>';
        gainInsight(5.0, "All Concepts Bonus"); // Reward for finding everything
        return;
    }

    const currentAtt = State.getAttunement()[elementKeyToResearch] || 0;
    const priorityP = []; const secondaryP = []; const tertiaryP = [];
    // Categorize undiscovered concepts based on relevance to researched element
    undiscoveredPool.forEach(c => {
        const score = c.elementScores?.[elementKeyToResearch] || 0;
        const isPri = c.primaryElement === elementKeyToResearch;
        if (isPri || score >= 7.5) priorityP.push({...c});
        else if (score >= 4.5) secondaryP.push({...c});
        else tertiaryP.push({...c});
    });

    const selectedOut = []; let dupeGain = 0; const numResults = 3;

    // Weighted selection function
    const selectWeighted = () => {
        const pools = [
            { pool: priorityP, mult: 3.5 + (currentAtt / 30) }, // Higher attunement boosts priority pool chance
            { pool: secondaryP, mult: 1.5 + (currentAtt / 60) },
            { pool: tertiaryP, mult: 0.8 }
        ];
        let combined = []; let totalW = 0; const attFactor = 1 + (currentAtt / (Config.MAX_ATTUNEMENT * 1.2));
        // Calculate total weight considering rarity and attunement
        pools.forEach(({ pool, mult }) => {
            pool.forEach(card => {
                let w = 1.0 * mult;
                if (card.rarity === 'uncommon') w *= (1.3 * attFactor);
                else if (card.rarity === 'rare') w *= (0.6 * attFactor); // Lower base chance for rare
                else w *= (1.0 * attFactor); // Common
                w = Math.max(0.1, w); // Ensure minimum weight
                totalW += w;
                combined.push({ card, w });
            });
        });

        if (combined.length === 0) return null;
        let pick = Math.random() * totalW; // Pick a random point within the total weight

        // Find the card corresponding to the random pick
        for (let i = 0; i < combined.length; i++) {
            const item = combined[i];
            if (pick < item.w) {
                // Remove the chosen card from its original pool to prevent re-selection in this research round
                [priorityP, secondaryP, tertiaryP].forEach(p => {
                    const idx = p.findIndex(c => c.id === item.card.id);
                    if (idx > -1) p.splice(idx, 1);
                });
                return item.card;
            }
            pick -= item.w;
        }
         // Fallback (should rarely happen if weights are calculated correctly)
         console.warn("Weighted selection fallback triggered.");
         const flatP = [...priorityP, ...secondaryP, ...tertiaryP];
         if (flatP.length > 0) {
             const idx = Math.floor(Math.random() * flatP.length);
             const card = flatP[idx];
             [priorityP, secondaryP, tertiaryP].forEach(p => {
                 const i = p.findIndex(c => c.id === card.id);
                 if (i > -1) p.splice(i, 1);
             });
             return card;
         }
         return null;
    };

    // Attempt to select results
    let attempts = 0; const maxAtt = numResults * 4; // Limit attempts to prevent infinite loops
    while (selectedOut.length < numResults && attempts < maxAtt && (priorityP.length > 0 || secondaryP.length > 0 || tertiaryP.length > 0)) {
        attempts++;
        let potential = selectWeighted();
        if (potential) {
            if (discoveredIds.has(potential.id)) { // Check if already discovered
                gainInsight(1.0, `Dupe (${potential.name})`); // Small gain for duplicates
                dupeGain += 1.0;
            } else {
                // Ensure unique within this research result set
                if (!selectedOut.some(c => c.id === potential.id)) {
                    selectedOut.push(potential);
                }
            }
        } else {
            break; // Stop if no more cards can be selected
        }
    }

    // Display results and update state
    let msg = "";
    if (selectedOut.length > 0) {
        msg = `Discovered ${selectedOut.length} new concept(s)! `;
        UI.displayResearchResults({ concepts: selectedOut, repositoryItems: [], duplicateInsightGain: dupeGain });
        gainAttunementForAction('researchSuccess', elementKeyToResearch); // Attunement for successful research
        if (selectedOut.some(c => c.rarity === 'rare')) updateMilestoneProgress('discoverRareCard', 1); // Check rare card milestone
    } else {
        msg = "No new concepts found. ";
        UI.displayResearchResults({ concepts: [], repositoryItems: [], duplicateInsightGain: dupeGain });
        gainAttunementForAction('researchFail', elementKeyToResearch); // Smaller attunement for failed research
        // Update placeholder if research yielded nothing *and* no previous results were there
        if (researchOutElem && researchOutElem.children.length === 0 && dupeGain === 0) {
             researchOutElem.innerHTML = '<p><i>Familiar thoughts echo... Perhaps try a different focus?</i></p>';
        }
    }
    if (dupeGain > 0 && selectedOut.length === 0) {
        msg += ` Gained ${dupeGain.toFixed(0)} Insight from echoes.`;
        // Ensure output area isn't empty if only dupes were found
         if (researchOutElem && researchOutElem.children.length === 0) {
             const dupeMsg = document.createElement('p');
             dupeMsg.classList.add('duplicate-message');
             dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${dupeGain.toFixed(0)} Insight from duplicate research echoes.`;
             researchOutElem.appendChild(dupeMsg);
         }
    }
    UI.displayResearchStatus(msg.trim());

    checkTaskCompletion('conductResearch');
    checkAndUpdateRituals('conductResearch');
    updateMilestoneProgress('conductResearch', 1);
}


// Grimoire Actions
 export function addConceptToGrimoireById(conceptId, buttonElement = null) { // Exported for UI
    const context = buttonElement?.dataset?.context || 'popup'; // Determine if from research or popup
    const isFromResearch = context === 'research';

    if (State.getDiscoveredConcepts().has(conceptId)) {
        UI.showTemporaryMessage("Already in Grimoire.", 2500);
        if (isFromResearch) UI.updateResearchButtonAfterAction(conceptId, 'add'); // Update UI if needed
        return;
    }
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) { console.error("Cannot add concept: Not found. ID:", conceptId); UI.showTemporaryMessage("Error: Concept not found.", 3000); return; }

    const distance = Utils.euclideanDistance(State.getScores(), concept.elementScores);
    // Trigger reflection ONLY if Phase 3+ reached AND distance is high
    if (distance > Config.DISSONANCE_THRESHOLD && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
        console.log(`Dissonance on ${concept.name}. Triggering reflection.`);
        triggerReflectionPrompt('Dissonance', concept.id); // Pass target ID
    } else {
        addConceptToGrimoireInternal(conceptId, isFromResearch); // Add directly otherwise
    }
 }

 // Internal function to handle adding the concept after checks/reflection
 export function addConceptToGrimoireInternal(conceptId, fromResearch = false) { // Exported for Dissonance pathway
     const conceptToAdd = concepts.find(c => c.id === conceptId);
     if (!conceptToAdd) { console.error("Internal add fail: Not found. ID:", conceptId); return false; }
     if (State.getDiscoveredConcepts().has(conceptId)) return false; // Double-check already added

     console.log(`Adding ${conceptToAdd.name} internally. From research: ${fromResearch}`);

     if (State.addDiscoveredConcept(conceptId, conceptToAdd)) { // State function handles adding and saving
         let insightRwd = Config.CONCEPT_DISCOVERY_INSIGHT[conceptToAdd.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
         let bonusInsight = 0;
         let synergyMessageShown = false;

         // Check for Synergy Bonus / Discovery
         if (conceptToAdd.relatedIds && conceptToAdd.relatedIds.length > 0) {
             const discoveredMap = State.getDiscoveredConcepts();
             const undiscoveredRelated = conceptToAdd.relatedIds.filter(id => !discoveredMap.has(id));
             // Check for insight bonus from already discovered related concepts
             for (const relatedId of conceptToAdd.relatedIds) {
                 if (discoveredMap.has(relatedId)) {
                     bonusInsight += Config.SYNERGY_INSIGHT_BONUS;
                     if (!synergyMessageShown) {
                         const relatedConcept = discoveredMap.get(relatedId)?.concept;
                         UI.showTemporaryMessage(`Synergy Bonus: +${Config.SYNERGY_INSIGHT_BONUS.toFixed(1)} Insight (Related to ${relatedConcept?.name || 'a known concept'})`, 3500);
                         synergyMessageShown = true; // Show only one synergy message
                     }
                 }
             }
             // Check for chance to reveal an undiscovered related concept
             if (undiscoveredRelated.length > 0 && Math.random() < Config.SYNERGY_DISCOVERY_CHANCE) {
                 const relatedIdToDiscover = undiscoveredRelated[Math.floor(Math.random() * undiscoveredRelated.length)];
                 const relatedConceptData = concepts.find(c => c.id === relatedIdToDiscover);
                 if (relatedConceptData) {
                      // Display the newly revealed concept in the research notes area
                      UI.displayResearchResults({ concepts: [relatedConceptData], repositoryItems: [], duplicateInsightGain: 0 });
                      UI.showTemporaryMessage(`Synergy Resonance: Adding ${conceptToAdd.name} illuminated ${relatedConceptData.name}! Check Research Notes.`, 5000);
                      console.log(`Synergy discovery: Revealed ${relatedConceptData.name} (ID: ${relatedIdToDiscover})`);
                 }
             }
         }

         insightRwd += bonusInsight; // Add synergy bonus if applicable
         gainInsight(insightRwd, `Discovered ${conceptToAdd.rarity} ${conceptToAdd.name}${bonusInsight > 0 ? ' (Synergy)' : ''}`);
         gainAttunementForAction('addToGrimoire', conceptToAdd.primaryElement, 0.6); // Grant attunement
         UI.updateGrimoireCounter(); // Update UI

         // Queue rare prompt if applicable
         if (conceptToAdd.rarity === 'rare' && conceptToAdd.uniquePromptId && reflectionPrompts.RareConcept?.[conceptToAdd.uniquePromptId]) {
             State.addPendingRarePrompt(conceptToAdd.uniquePromptId); // State handles save
             console.log(`Queued rare prompt ${conceptToAdd.uniquePromptId}`);
         }

         // Update UI elements if the popup for this concept is currently open
         if (currentlyDisplayedConceptId === conceptId) {
             UI.updateGrimoireButtonStatus(conceptId, false); // No longer in research notes
             UI.updateFocusButtonStatus(conceptId); // Enable focus button
             const discoveredData = State.getDiscoveredConceptData(conceptId); // Get fresh data
             UI.updatePopupSellButton(conceptId, conceptToAdd, true, false); // Update sell button context
             const notesSect = document.getElementById('myNotesSection'); if(notesSect && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) notesSect.classList.remove('hidden'); // Show notes section
             const evoSec = document.getElementById('popupEvolutionSection'); if(evoSec && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED) UI.displayEvolutionSection(conceptToAdd, discoveredData); // Update evolution section
         }

         // Update research notes UI if added from there
         if (fromResearch) {
            UI.updateResearchButtonAfterAction(conceptId, 'add');
            checkTaskCompletion('addToGrimoireFromResearch');
         }

         checkTaskCompletion('addToGrimoire'); // Check general add task
         checkTriggerReflectionPrompt('add'); // Check if reflection should trigger
         updateMilestoneProgress('addToGrimoire', 1); // Update milestone counts
         updateMilestoneProgress('discoveredConcepts.size', State.getDiscoveredConcepts().size);
         checkAndUpdateRituals('addToGrimoire'); // Check ritual progress
         UI.refreshGrimoireDisplay(); // Update grimoire view if visible
         UI.showTemporaryMessage(`${conceptToAdd.name} added to Grimoire!`, 3000);
         return true; // Indicate success

     } else { console.warn(`State add fail ${conceptToAdd.name}.`); UI.showTemporaryMessage(`Error adding ${conceptToAdd.name}.`, 3000); return false; }
 }

 export function handleToggleFocusConcept() { // Exported for popup button
    if (currentlyDisplayedConceptId === null) return;
    handleCardFocusToggle(currentlyDisplayedConceptId); // Call internal logic
    // Update the focus button *within the popup* specifically
    UI.updateFocusButtonStatus(currentlyDisplayedConceptId);
}

 export function handleCardFocusToggle(conceptId) { // Exported for card button
    if (isNaN(conceptId)) return;
    const result = State.toggleFocusConcept(conceptId); // State handles logic and saving
    const conceptName = State.getDiscoveredConceptData(conceptId)?.concept?.name || `ID ${conceptId}`;

    if (result === 'error') { UI.showTemporaryMessage("Error toggling focus.", 3000); }
    else if (result === 'not_discovered') { UI.showTemporaryMessage("Concept not in Grimoire.", 3000); }
    else if (result === 'slots_full') { UI.showTemporaryMessage(`Focus slots full (${State.getFocusSlots()}).`, 3000); }
    else {
        // Actions on successful toggle
        if (result === 'removed') {
            UI.showTemporaryMessage(`${conceptName} removed from Focus.`, 2500);
            checkAndUpdateRituals('removeFocus'); // Check rituals related to removing focus
        } else { // added
            UI.showTemporaryMessage(`${conceptName} marked as Focus!`, 2500);
            gainInsight(1.0, `Focused on ${conceptName}`); // Small insight gain
            const concept = State.getDiscoveredConceptData(conceptId)?.concept;
            if (concept?.primaryElement) gainAttunementForAction('markFocus', concept.primaryElement, 1.0); // Attunement gain
            updateMilestoneProgress('markFocus', 1); // Milestone for first focus
            updateMilestoneProgress('focusedConcepts.size', State.getFocusedConcepts().size); // Milestone for count
            checkAndUpdateRituals('markFocus'); // Check rituals related to adding focus
            checkTaskCompletion('markFocus'); // Check onboarding task
        }
        // Update relevant UI elements
        UI.refreshGrimoireDisplay(); // Update card focus indicators in Grimoire
        UI.displayFocusedConceptsPersona(); // Update list on Persona screen
        calculateTapestryNarrative(true); // Recalculate tapestry data
        UI.generateTapestryNarrative(); // Update narrative display
        UI.synthesizeAndDisplayThemesPersona(); // Update themes display
        checkForFocusUnlocks(); // Check if new unlocks triggered
        UI.updateTapestryDeepDiveButton(); // Update deep dive button state
        UI.updateSuggestSceneButtonState(); // Update suggest scene button state
        // Update popup button state if the popup for this concept is open
        if (currentlyDisplayedConceptId === conceptId) {
            UI.updateFocusButtonStatus(conceptId);
        }
    }
}

 export function handleSellConcept(event) { // Exported for UI button listeners
     const button = event.target.closest('button'); if (!button) return;
     const conceptId = parseInt(button.dataset.conceptId);
     const context = button.dataset.context; // 'grimoire' or 'research'
     if (isNaN(conceptId)) { console.error("Invalid sell ID:", button.dataset.conceptId); return; }
     sellConcept(conceptId, context); // Call internal logic
}

// Internal logic for selling
function sellConcept(conceptId, context) {
    const discovered = State.getDiscoveredConceptData(conceptId);
    // Find concept data either from discovered state or base data (for research notes)
    const concept = discovered?.concept || concepts.find(c => c.id === conceptId);
    if (!concept) { console.error(`Sell fail: Not found ${conceptId}`); UI.showTemporaryMessage("Error selling.", 3000); return; }

    let val = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
    const sellVal = val * Config.SELL_INSIGHT_FACTOR;
    const sourceLoc = context === 'grimoire' ? 'Grimoire' : 'Research Notes';

    // Confirmation dialog
    if (confirm(`Sell '${concept.name}' (${concept.rarity}) from ${sourceLoc} for ${sellVal.toFixed(1)} Insight?`)) {
        gainInsight(sellVal, `Sold: ${concept.name}`); // Grant insight
        updateMilestoneProgress('sellConcept', 1); // Check sell milestone
        checkTaskCompletion('sellConcept'); // Check sell task

        let focusChanged = false;
        if (context === 'grimoire') {
             const removalResult = State.removeDiscoveredConcept(conceptId); // Remove from state (handles save)
             if (removalResult.removed) {
                 focusChanged = removalResult.focusChanged; // Check if focus was also removed
                 UI.updateGrimoireCounter(); // Update UI count
                 UI.refreshGrimoireDisplay(); // Refresh Grimoire view
             }
        }
        else if (context === 'research') {
             UI.updateResearchButtonAfterAction(conceptId, 'sell'); // Remove from research notes UI
        }

        // If focus state changed, update Persona screen UI
        if (focusChanged) {
            UI.displayFocusedConceptsPersona();
            calculateTapestryNarrative(true);
            UI.generateTapestryNarrative();
            UI.synthesizeAndDisplayThemesPersona();
            checkForFocusUnlocks();
            UI.updateTapestryDeepDiveButton();
            UI.updateSuggestSceneButtonState();
        }
        UI.showTemporaryMessage(`Sold ${concept.name} for ${sellVal.toFixed(1)} Insight.`, 2500);
        // Close popup if the sold concept was being viewed
        if (currentlyDisplayedConceptId === conceptId) UI.hidePopups();
    }
}


// Reflection Logic
 export function checkTriggerReflectionPrompt(triggerAction = 'other') { // Exported
    const currentState = State.getState();
    if (currentState.promptCooldownActive) return; // Don't trigger if on cooldown
    if (currentState.onboardingPhase < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) return; // Don't trigger before unlocked

    if (triggerAction === 'add') State.incrementReflectionTrigger(); // Increment counter when adding card

    const cardsAdded = currentState.cardsAddedSinceLastPrompt;
    const triggerThresh = 3; // Trigger after adding 3 cards
    const hasPending = currentState.pendingRarePrompts.length > 0;

    if (hasPending) { // Prioritize pending rare prompts
        console.log("Pending rare prompt found.");
        triggerReflectionPrompt('RareConcept'); // Trigger specific context
        State.resetReflectionTrigger(true); // Reset counter and start cooldown (State handles save)
        startReflectionCooldown();
    }
    else if (cardsAdded >= triggerThresh) { // Check standard trigger threshold
        console.log("Reflection trigger threshold met.");
        triggerReflectionPrompt('Standard'); // Trigger standard reflection
        State.resetReflectionTrigger(true); // Reset counter and start cooldown (State handles save)
        startReflectionCooldown();
    }
}

function startReflectionCooldown() {
    if (reflectionCooldownTimeout) clearTimeout(reflectionCooldownTimeout);
    State.setPromptCooldownActive(true); // Save handled by State
    const cooldownDuration = 1000 * 60 * 3; // 3 minutes
    reflectionCooldownTimeout = setTimeout(() => {
        State.clearReflectionCooldown(); // Save handled by State
        console.log("Reflection cooldown ended.");
        reflectionCooldownTimeout = null;
    }, cooldownDuration);
 }

 // Selects and displays a prompt
 export function triggerReflectionPrompt(context = 'Standard', targetId = null, category = null) { // Exported
    currentReflectionContext = context;
    reflectionTargetConceptId = (context === 'Dissonance') ? targetId : null;
    currentReflectionCategory = category; // Used for Guided/Dissonance/Scene/Rare title
    currentPromptId = null; // Reset selected prompt ID
    let promptPool = [];
    let title = "Moment for Reflection";
    let promptCatLabel = "General"; // Label shown in the modal
    let selPrompt = null;
    let showNudge = false;
    let reward = 5.0; // Default reward
    console.log(`Trigger reflection: Context=${context}, Target=${targetId}, Category=${category}`);

    // 1. Check for pending Rare prompts first (unless Dissonance/Scene)
    if (context !== 'Dissonance' && context !== 'SceneMeditation') {
        const nextRareId = State.getNextRarePrompt(); // Removes from state and saves
        if (nextRareId) {
            selPrompt = reflectionPrompts.RareConcept?.[nextRareId];
            if (selPrompt) {
                currentReflectionContext = 'RareConcept'; // Update context
                title = "Rare Concept Reflection";
                // Find the concept name associated with this rare prompt
                const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === nextRareId);
                promptCatLabel = cEntry ? cEntry[1].concept.name : "Rare Concept";
                currentPromptId = selPrompt.id; // Store the actual prompt ID (e.g., "rP08")
                reward = 7.0; // Higher reward for rare
                console.log(`Displaying Rare reflection: ${nextRareId}`);
            } else {
                console.warn(`Rare prompt text missing: ${nextRareId}. Falling back.`);
                currentReflectionContext = 'Standard'; // Fallback if text missing
            }
        }
    }

    // 2. Determine prompt pool or specific prompt if a rare one wasn't found/used
    if (!selPrompt) {
        if (context === 'Dissonance' && targetId) {
            title = "Dissonance Reflection";
            const concept = concepts.find(c => c.id === targetId);
            promptCatLabel = concept ? concept.name : "Dissonant Concept";
            promptPool = reflectionPrompts.Dissonance || [];
            showNudge = true; // Allow score nudge for dissonance
            reward = 5.0; // Standard reward
        } else if (context === 'Guided' && category) {
            title = "Guided Reflection";
            promptCatLabel = category; // Use the category provided (e.g., "LowAttunement")
            promptPool = reflectionPrompts.Guided?.[category] || [];
            reward = Config.GUIDED_REFLECTION_COST + 2; // Refund cost + bonus
        } else if (context === 'SceneMeditation' && targetId) {
            const scene = sceneBlueprints.find(s => s.id === targetId);
            if (scene?.reflectionPromptId && reflectionPrompts.SceneMeditation?.[scene.reflectionPromptId]) {
                selPrompt = reflectionPrompts.SceneMeditation[scene.reflectionPromptId]; // Get specific scene prompt
                title = "Scene Meditation"; promptCatLabel = scene.name; currentPromptId = selPrompt.id;
                reward = (scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; // Cost + bonus
                console.log(`Displaying Scene Meditation: ${currentPromptId}`);
            } else {
                console.warn(`Scene ${targetId} or its prompt ${scene?.reflectionPromptId} missing.`);
                currentReflectionContext = 'Standard'; // Fallback
            }
        }
        // Ensure Standard context if nothing else matched or after fallback
        if (currentReflectionContext === 'Standard') {
             title = "Standard Reflection";
             const attune = State.getAttunement();
             // Find elements with some attunement, sort descending
             const validElems = Object.entries(attune).filter(([k, v]) => v > 0).sort(([,a], [,b]) => b - a);
             if (validElems.length > 0) {
                 // Pick randomly from the top half (or all if only 1)
                 const topTier = validElems.slice(0, Math.max(1, Math.ceil(validElems.length / 2)));
                 const [selKey] = topTier[Math.floor(Math.random() * topTier.length)];
                 const selName = elementKeyToFullName[selKey];
                 promptPool = reflectionPrompts[selName] || []; // Get prompts for that element
                 promptCatLabel = elementDetails[selName]?.name || selName;
                 currentReflectionCategory = selName; // Store the element name for attunement gain
                 reward = 5.0; // Standard reward
             } else { promptPool = []; console.warn("No attunement > 0 for Standard reflection."); }
        }
    }


    // 3. Select from pool if needed (i.e., not a specific Scene/Rare prompt)
    if (!selPrompt && promptPool.length > 0) {
        const seen = State.getState().seenPrompts;
        // Prefer unseen prompts
        const available = promptPool.filter(p => !seen.has(p.id));
        // Pick randomly from available, or from all if all seen
        selPrompt = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : promptPool[Math.floor(Math.random() * promptPool.length)];
        currentPromptId = selPrompt.id; // Store the selected prompt's ID
        console.log(`Selected prompt ${currentPromptId} from pool for context ${currentReflectionContext}.`);
    }

    // 4. Display or handle failure
    if (selPrompt && currentPromptId) {
        const pData = { title, category: promptCatLabel, prompt: selPrompt, showNudge, reward };
        UI.displayReflectionPrompt(pData, currentReflectionContext); // Pass data to UI
    } else {
        // Handle cases where no prompt could be displayed
        console.error(`Could not select prompt for context: ${context}`);
        if (context === 'Dissonance' && reflectionTargetConceptId) {
            // If dissonance reflection failed, just add the concept without penalty/bonus
            console.warn("Dissonance reflection prompt failed, adding concept directly.");
            addConceptToGrimoireInternal(reflectionTargetConceptId, false);
            UI.hidePopups(); UI.showTemporaryMessage("Reflection unavailable, concept added.", 3500);
        } else if (context === 'Guided') {
            // Refund insight if guided reflection failed
            gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt"); UI.showTemporaryMessage("No guided reflections available.", 3000);
        } else if (context === 'SceneMeditation') {
             // Refund insight if scene meditation failed
             const scene = sceneBlueprints.find(s => s.id === targetId);
             if(scene) gainInsight(scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST, "Refund: Missing Scene Prompt");
             UI.showTemporaryMessage("Reflection for scene missing.", 3000);
        } else { UI.showTemporaryMessage("No reflection prompt found.", 3000); }
        clearPopupState(); // Clear context state on failure
    }
}

 export function handleConfirmReflection(nudgeAllowed) { // Exported for UI listener
    if (!currentPromptId) { console.error("No current prompt ID."); UI.hidePopups(); return; }
    console.log(`Reflection confirmed: Context=${currentReflectionContext}, Prompt=${currentPromptId}, Nudge=${nudgeAllowed}`);
    State.addSeenPrompt(currentPromptId); // Record prompt as seen (triggers save)

    // Determine reward based on context
    let rewardAmt = 5.0; let attuneKey = null; let attuneAmt = 1.0; let milestoneAct = 'completeReflection';
    if (currentReflectionContext === 'Guided') rewardAmt = Config.GUIDED_REFLECTION_COST + 2;
    else if (currentReflectionContext === 'RareConcept') rewardAmt = 7.0;
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); rewardAmt = (scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST) + 5; }
    else rewardAmt = 5.0; // Standard or Dissonance

    // Apply score nudge if Dissonance context and checkbox checked
    if (currentReflectionContext === 'Dissonance') {
        milestoneAct = 'completeReflectionDissonance'; attuneAmt = 0.5; // Different milestone/attunement for dissonance
        if (nudgeAllowed && reflectionTargetConceptId) {
             const concept = concepts.find(c => c.id === reflectionTargetConceptId); const scores = State.getScores(); let nudged = false;
             if (concept?.elementScores) {
                 const newScores = { ...scores };
                 for (const key in scores) {
                     if (scores.hasOwnProperty(key) && concept.elementScores.hasOwnProperty(key)) {
                         const uScore = scores[key]; const cScore = concept.elementScores[key];
                         const diff = cScore - uScore;
                         // Only nudge if difference is significant enough
                         if (Math.abs(diff) > 1.5) {
                             const nudgeVal = Math.sign(diff) * Config.SCORE_NUDGE_AMOUNT;
                             newScores[key] = Math.max(0, Math.min(10, uScore + nudgeVal)); // Apply nudge and clamp
                             if (newScores[key] !== uScore) nudged = true;
                         }
                     }
                 }
                 if (nudged) {
                     if(State.updateScores(newScores)) { // Update scores in state (triggers save)
                         console.log("Nudged Scores:", State.getScores());
                         if(document.getElementById('personaScreen')?.classList.contains('current')) UI.displayPersonaScreen(); // Refresh Persona UI if open
                         UI.showTemporaryMessage("Core understanding shifted.", 3500);
                         gainAttunementForAction('scoreNudge', 'All', 0.5); // Small attunement bonus for allowing nudge
                         updateMilestoneProgress('scoreNudgeApplied', 1); // Check nudge milestone
                     }
                 }
             } else { console.warn(`Cannot apply nudge, concept data missing for ID ${reflectionTargetConceptId}`); }
         }
         // Add the dissonant concept to the grimoire AFTER reflection is confirmed
         if (reflectionTargetConceptId) {
             addConceptToGrimoireInternal(reflectionTargetConceptId, false);
         }
    }

    gainInsight(rewardAmt, `Reflection (${currentReflectionContext || 'Unknown'})`); // Grant insight reward

    // Determine which element(s) gain attunement
    if (currentReflectionContext === 'Standard' && currentReflectionCategory) { attuneKey = elementNameToKey[currentReflectionCategory]; }
    else if (currentReflectionContext === 'Guided') { attuneKey = null; } // Guided might grant 'All' or be generic
    else if (currentReflectionContext === 'RareConcept') { const cEntry = Array.from(State.getDiscoveredConcepts().entries()).find(([id, data]) => data.concept.uniquePromptId === currentPromptId); attuneKey = cEntry ? cEntry[1].concept.primaryElement : null; }
    else if (currentReflectionContext === 'SceneMeditation') { const scene = sceneBlueprints.find(s => s.reflectionPromptId === currentPromptId); attuneKey = scene?.element || null; }
    // Dissonance attunement handled by gainAttunementForAction logic based on actionType

    if (attuneKey) gainAttunementForAction('completeReflection', attuneKey, attuneAmt); // Specific element
    else gainAttunementForAction('completeReflectionGeneric', 'All', 0.2); // Generic bonus to all

    updateMilestoneProgress(milestoneAct, 1); // Check reflection milestone
    checkAndUpdateRituals('completeReflection'); // Check ritual progress
    checkTaskCompletion('completeReflection'); // Check general reflection task
    checkTaskCompletion(`completeReflection_${currentReflectionContext}`); // Check context-specific task if exists

    UI.hidePopups(); UI.showTemporaryMessage("Reflection complete! Insight gained.", 3000);
    clearPopupState(); // Clear temporary reflection state variables
}

 export function triggerGuidedReflection() { // Exported for UI listener
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) { UI.showTemporaryMessage("Unlock Reflections first.", 3000); return; }
     if (spendInsight(Config.GUIDED_REFLECTION_COST, "Guided Reflection")) {
         const cats = Object.keys(reflectionPrompts.Guided || {}); // Get available guided categories
         if (cats.length > 0) {
             const cat = cats[Math.floor(Math.random() * cats.length)]; // Pick random category
             console.log(`Triggering guided: ${cat}`);
             triggerReflectionPrompt('Guided', null, cat); // Trigger with specific category
         } else {
             console.warn("No guided categories."); gainInsight(Config.GUIDED_REFLECTION_COST, "Refund: No guided prompt"); // Refund if no prompts found
             UI.showTemporaryMessage("No guided reflections available.", 3000);
         }
     }
}

// Other Actions
 export function attemptArtEvolution() { // Exported for UI listener
    if (currentlyDisplayedConceptId === null) return; const conceptId = currentlyDisplayedConceptId;
    const discovered = State.getDiscoveredConceptData(conceptId);
    if (!discovered?.concept || discovered.artUnlocked) { UI.showTemporaryMessage("Evolution fail: State error.", 3000); return; }

    const concept = discovered.concept; if (!concept.canUnlockArt) return; // Check if concept can evolve
    const cost = Config.ART_EVOLVE_COST; const isFocused = State.getFocusedConcepts().has(conceptId); const hasReflected = State.getState().seenPrompts.size > 0; const phaseOK = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;

    // Check requirements
    if (!phaseOK) { UI.showTemporaryMessage("Unlock Repository first.", 3000); return; }
    if (!isFocused || !hasReflected) { UI.showTemporaryMessage("Check requirements (Focus + Reflection).", 3000); return; }

    // Attempt to spend insight and evolve
    if (spendInsight(cost, `Evolve Art: ${concept.name}`)) {
        if (State.unlockArt(conceptId)) { // State handles save and phase check
            console.log(`Art unlocked for ${concept.name}!`); UI.showTemporaryMessage(`Enhanced Art for ${concept.name}!`, 3500);
            // Update UI if popup is still open
            if (currentlyDisplayedConceptId === conceptId) UI.showConceptDetailPopup(conceptId);
            UI.refreshGrimoireDisplay(); // Update Grimoire card visuals
            gainAttunementForAction('artEvolve', concept.primaryElement, 1.5); // Grant attunement
            updateMilestoneProgress('evolveArt', 1); // Check milestone
            checkAndUpdateRituals('artEvolve'); // Check rituals
        } else { console.error(`State unlockArt fail ${concept.name}`); gainInsight(cost, `Refund: Art evolution error`); UI.showTemporaryMessage("Error updating art.", 3000); }
    }
}

 export function handleSaveNote() { // Exported for UI listener
    if (currentlyDisplayedConceptId === null) return; const notesTA = document.getElementById('myNotesTextarea'); if (!notesTA) return;
    const noteText = notesTA.value.trim();
    if (State.updateNotes(currentlyDisplayedConceptId, noteText)) { // State handles save
        const status = document.getElementById('noteSaveStatus');
        if (status) { status.textContent = "Saved!"; status.classList.remove('error'); setTimeout(() => { status.textContent = ""; }, 2000); }
    }
    else { const status = document.getElementById('noteSaveStatus'); if (status) { status.textContent = "Error."; status.classList.add('error'); } }
}

 export function handleUnlockLibraryLevel(event) { // Exported for UI listener
     const button = event.target.closest('button'); if (!button || button.disabled) return;
     const key = button.dataset.elementKey;
     const level = parseInt(button.dataset.level);
     if (!key || isNaN(level)) { console.error("Invalid library unlock data"); return; }
     unlockDeepDiveLevelInternal(key, level); // Call internal logic
}

function unlockDeepDiveLevelInternal(elementKey, levelToUnlock) {
    const dData = elementDeepDive[elementKey] || []; const lData = dData.find(l => l.level === levelToUnlock);
    const curLevel = State.getState().unlockedDeepDiveLevels[elementKey] || 0;
    // Check if this is the next sequential level
    if (!lData || levelToUnlock !== curLevel + 1) { console.warn(`Library unlock fail: Invalid level/seq.`); return; }
    const cost = lData.insightCost || 0;

    if (spendInsight(cost, `Unlock Library: ${elementKeyToFullName[elementKey]} Lv ${levelToUnlock}`)) {
        if (State.unlockLibraryLevel(elementKey, levelToUnlock)) { // State handles save & phase check
            console.log(`Unlocked ${elementKeyToFullName[elementKey]} level ${levelToUnlock}`);
            // Refresh the deep dive UI section for this element
            const targetContainer = document.querySelector(`#personaElementDetails .element-deep-dive-container[data-element-key="${elementKey}"]`);
            if (targetContainer) UI.displayElementDeepDive(elementKey, targetContainer);
            else console.warn(`Could not find container for ${elementKey} to refresh UI after unlock.`);
            UI.showTemporaryMessage(`${elementKeyToFullName[elementKey]} Insight Lv ${levelToUnlock} Unlocked!`, 3000);
            updateMilestoneProgress('unlockLibrary', levelToUnlock); // Check milestones related to level unlocks
            updateMilestoneProgress('unlockedDeepDiveLevels', State.getState().unlockedDeepDiveLevels);
            checkAndUpdateRituals('unlockLibrary'); // Check rituals
            checkTaskCompletion('unlockLibrary'); // Check task
        } else { console.error(`State fail unlock library ${elementKey} Lv ${levelToUnlock}`); gainInsight(cost, `Refund: Library unlock error`); } // Refund if state update failed
    }
}

 export function handleMeditateScene(event) { // Exported for UI listener
     const button = event.target.closest('button'); if (!button || button.disabled) return;
     const sceneId = button.dataset.sceneId; if (!sceneId) return;
     meditateOnSceneInternal(sceneId); // Call internal logic
}

function meditateOnSceneInternal(sceneId) {
    const scene = sceneBlueprints.find(s => s.id === sceneId); if (!scene) { console.error(`Scene not found: ${sceneId}`); return; }
    const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
    if (spendInsight(cost, `Meditate: ${scene.name}`)) {
        if (scene.reflectionPromptId) {
            console.log(`Triggering Scene Meditation: ${scene.name}`);
            triggerReflectionPrompt('SceneMeditation', sceneId); // Trigger reflection with scene context
            updateMilestoneProgress('meditateScene', 1); // Check milestone
            checkTaskCompletion('meditateScene'); // Check task
        } else {
            console.error(`Prompt ID missing for scene ${sceneId}`);
            gainInsight(cost, `Refund: Missing scene prompt`); // Refund if prompt missing
            UI.showTemporaryMessage("Meditation fail: Reflection missing.", 3000);
        }
    }
}

 export function handleAttemptExperiment(event) { // Exported for UI listener
     const button = event.target.closest('button'); if (!button || button.disabled) return; const expId = button.dataset.experimentId; if (!expId) return; attemptExperimentInternal(expId); // Call internal logic
}

function attemptExperimentInternal(experimentId) {
     const exp = alchemicalExperiments.find(e => e.id === experimentId); if (!exp || State.getRepositoryItems().experiments.has(experimentId)) { console.warn(`Exp ${experimentId} not found/completed.`); return; }
     const attune = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();

     // Check Attunement requirement
     if (attune[exp.requiredElement] < exp.requiredAttunement) { UI.showTemporaryMessage("Attunement too low.", 3000); return; }

     // Check Focus requirements
     let canAttempt = true; let unmetReqs = [];
     if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } }
     if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let met = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { met = true; break; } } if (!met) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } }
     if (!canAttempt) { UI.showTemporaryMessage(`Requires Focus: ${unmetReqs.join(', ')}`, 3000); return; }

     const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST; if (!spendInsight(cost, `Attempt Exp: ${exp.name}`)) return; // Check and spend insight

     console.log(`Attempting: ${exp.name}`);
     updateMilestoneProgress('attemptExperiment', 1); // Check milestone
     checkTaskCompletion('attemptExperiment'); // Check task
     const roll = Math.random();

     if (roll < (exp.successRate || 0.5)) { // Success
         console.log("Exp Success!"); UI.showTemporaryMessage(`Success! '${exp.name}' yielded results.`, 4000);
         if (State.addRepositoryItem('experiments', exp.id)) { // Mark as completed (triggers save/phase)
            // Grant rewards
            if (exp.successReward) {
                 if (exp.successReward.type === 'insight') gainInsight(exp.successReward.amount, `Exp Success: ${exp.name}`);
                 if (exp.successReward.type === 'attunement') gainAttunementForAction('experimentSuccess', exp.successReward.element || 'All', exp.successReward.amount);
                 if (exp.successReward.type === 'insightFragment') {
                     if (State.addRepositoryItem('insights', exp.successReward.id)) { // Add insight fragment (triggers save/phase)
                         console.log(`Exp reward: Insight ${exp.successReward.id}`); updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                     }
                 }
            }
         } else { console.warn(`State failed to add completed experiment ${exp.id}`); }
     } else { // Failure
         console.log("Exp Failed."); UI.showTemporaryMessage(`Exp '${exp.name}' failed... ${exp.failureConsequence || "No effect."}`, 4000);
         // Apply consequences
         if (exp.failureConsequence?.includes("Insight loss")) { const loss = parseFloat(exp.failureConsequence.match(/(\d+(\.\d+)?)/)?.[0] || 1); gainInsight(-loss, `Exp Failure: ${exp.name}`); }
         else if (exp.failureConsequence?.includes("attunement decrease")) { const key = exp.requiredElement; if (key) State.updateAttunement(key, -1.0); } // State handles save
     }
     UI.displayRepositoryContent(); // Refresh repository UI
}

// --- Suggest Scenes ---
 export function handleSuggestSceneClick() { // Exported for UI listener
     const focused = State.getFocusedConcepts();
     const suggestionOutputDiv = document.getElementById('sceneSuggestionOutput');
     const suggestedSceneContentDiv = document.getElementById('suggestedSceneContent');

     if (focused.size === 0) {
         UI.showTemporaryMessage("Focus on concepts first to suggest relevant scenes.", 3000);
         return; // Don't proceed if no focus
     }
     const cost = Config.SCENE_SUGGESTION_COST;
     if (!spendInsight(cost, "Suggest Scene")) {
         return; // Don't clear previous suggestion if can't afford
     }

     console.log("Suggesting scenes based on focus...");
     const { focusScores } = calculateFocusScores(); // Calculate average scores of focused concepts
     const discoveredScenes = State.getRepositoryItems().scenes; // Get already discovered scenes

     // Find dominant elements in focus
     const sortedElements = Object.entries(focusScores)
         .filter(([key, score]) => score > 4.0) // Consider elements with moderate+ average score
         .sort(([, a], [, b]) => b - a); // Sort descending by score

     // Pick top 1 or 2 dominant elements
     const topElements = sortedElements.slice(0, 2).map(([key]) => key);
     if (topElements.length === 0 && sortedElements.length > 0) {
         topElements.push(sortedElements[0][0]); // Fallback to highest if none above threshold
     } else if (topElements.length === 0) {
          UI.showTemporaryMessage("Focus is too broad to suggest specific scenes.", 3000);
          gainInsight(cost, "Refund: Scene Suggestion Fail (Broad Focus)"); // Refund cost
          return; // Don't clear previous suggestion
     }

     console.log("Dominant focus elements for scene suggestion:", topElements);

     // Find scenes related to dominant elements that haven't been discovered yet
     const relevantUndiscoveredScenes = sceneBlueprints.filter(scene =>
         topElements.includes(scene.element) && !discoveredScenes.has(scene.id)
     );

     if (relevantUndiscoveredScenes.length === 0) {
         UI.showTemporaryMessage("All relevant scenes for this focus have been discovered. Check Repository.", 3500);
         // Don't clear previous suggestion
     } else {
         // Pick a random scene from the relevant pool
         const selectedScene = relevantUndiscoveredScenes[Math.floor(Math.random() * relevantUndiscoveredScenes.length)];
         const added = State.addRepositoryItem('scenes', selectedScene.id); // Add to repository (triggers save/phase)

         if (added) {
             console.log(`Suggested Scene: ${selectedScene.name} (ID: ${selectedScene.id})`);
             // --- Update UI to show the *new* suggestion ---
             if (suggestionOutputDiv && suggestedSceneContentDiv) {
                  suggestedSceneContentDiv.innerHTML = ''; // Clear old content first
                  const sceneCost = selectedScene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
                  const canAfford = State.getInsight() >= sceneCost;
                  // Render the scene item directly into the output area
                  const sceneElement = UI.renderRepositoryItem(selectedScene, 'scene', sceneCost, canAfford);
                  suggestedSceneContentDiv.appendChild(sceneElement);
                  suggestionOutputDiv.classList.remove('hidden'); // Make the output area visible
             } else {
                 console.error("Scene suggestion UI elements not found!");
             }
             UI.showTemporaryMessage(`Scene Suggested: '${selectedScene.name}'! See details below.`, 4000);

             // Refresh repository view if it's currently open
             if (document.getElementById('repositoryScreen')?.classList.contains('current')) {
                 UI.displayRepositoryContent();
             }
             checkTaskCompletion('suggestScene');
         } else {
             // This case should be rare if filtering worked, but handle it
             console.error(`Failed to add scene ${selectedScene.id} to repository state, though it was selected.`);
             gainInsight(cost, "Refund: Scene Suggestion Error (State Add Fail)"); // Refund cost
             UI.showTemporaryMessage("Error suggesting scene.", 3000);
             // Don't clear previous suggestion if state add fails
         }
     }
 }


// --- Rituals & Milestones Logic ---
 export function checkAndUpdateRituals(action, details = {}) { // Exported
    let ritualCompletedThisCheck = false;
    const currentState = State.getState(); const completedToday = currentState.completedRituals.daily || {}; const focused = currentState.focusedConcepts;
    let currentRitualPool = [...dailyRituals]; // Start with standard daily rituals

    // Add active focus rituals to the pool
    if (focusRituals) {
        focusRituals.forEach(ritual => {
            if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return;
            const reqIds = new Set(ritual.requiredFocusIds); let allFoc = true;
            for (const id of reqIds) { if (!focused.has(id)) { allFoc = false; break; } }
            if (allFoc) currentRitualPool.push({ ...ritual, isFocusRitual: true, period: 'daily' }); // Add focus rituals
        });
    }

    currentRitualPool.forEach(ritual => {
        const completedData = completedToday[ritual.id] || { completed: false, progress: 0 };
        if (completedData.completed) return; // Skip already completed rituals

        const actionMatch = ritual.track.action === action;
        // Check if the ritual requires a specific context and if that context matches the current action details
        const contextMatches = ritual.track.contextMatch && details?.contextMatch === ritual.track.contextMatch;

        // If the action OR the context matches, update progress
        if (actionMatch || contextMatches) {
            const progress = State.completeRitualProgress(ritual.id, 'daily'); // Update progress in state (saves)
            const requiredCount = ritual.track.count || 1;

            // Check if progress meets requirement
            if (progress >= requiredCount) {
                if (!completedData.completed) { // Ensure we only complete it once per check cycle
                    console.log(`Ritual Completed: ${ritual.description}`);
                    State.markRitualComplete(ritual.id, 'daily'); // Mark as complete in state (saves)
                    ritualCompletedThisCheck = true;
                    // Grant rewards
                    if (ritual.reward) {
                        if (ritual.reward.type === 'insight') gainInsight(ritual.reward.amount || 0, `Ritual: ${ritual.description}`);
                        else if (ritual.reward.type === 'attunement') gainAttunementForAction('ritual', ritual.reward.element || 'All', ritual.reward.amount || 0);
                        else if (ritual.reward.type === 'token') console.log(`TODO: Grant ${ritual.reward.tokenType || 'Research'} token`); // Placeholder for token reward
                    }
                }
            }
        }
    });
    // Refresh UI only if a ritual was actually completed during this check
    if (ritualCompletedThisCheck) UI.displayDailyRituals();
}

// Checks milestones based on actions or state changes
 export function updateMilestoneProgress(trackType, currentValue) { // Exported
     let milestoneAchievedThisUpdate = false;
     const achievedSet = State.getState().achievedMilestones;
     if (!(achievedSet instanceof Set)) { console.error("CRITICAL ERROR: gameState.achievedMilestones is not a Set!"); return; }

     milestones.forEach(m => {
         if (achievedSet.has(m.id)) return; // Skip already achieved

         let achieved = false;
         const threshold = m.track.threshold;
         let checkValue = null;

         // Check based on Action Count
         if (m.track.action === trackType) {
             // Simple count check (e.g., first time action happens)
             if ((m.track.count === 1 || !m.track.count) && currentValue) achieved = true;
             // Specific count threshold check
             else if (typeof currentValue === 'number' && currentValue >= (m.track.count || 1)) achieved = true;
         }
         // Check based on State Value
         else if (m.track.state === trackType) {
             // Get current state values
             const att = State.getAttunement(); const lvls = State.getState().unlockedDeepDiveLevels; const discSize = State.getDiscoveredConcepts().size; const focSize = State.getFocusedConcepts().size; const insCount = State.getRepositoryItems().insights.size; const slots = State.getFocusSlots();

             // Determine which value to check based on trackType
             if (trackType === 'elementAttunement') {
                 const currentAttunement = State.getAttunement(); // Get the full attunement object
                 if (m.track.element && currentAttunement.hasOwnProperty(m.track.element)) {
                     // Check specific element attunement
                     checkValue = currentAttunement[m.track.element];
                 } else if (m.track.condition === 'any') {
                     // Check if *any* element meets threshold
                     achieved = Object.values(currentAttunement).some(v => v >= threshold);
                 } else if (m.track.condition === 'all') {
                     // Check if *all* elements meet threshold
                     achieved = Object.values(currentAttunement).every(v => v >= threshold);
                 }
             }
             else if (trackType === 'unlockedDeepDiveLevels') { const levelsToCheck = State.getState().unlockedDeepDiveLevels; if (m.track.condition === 'any') achieved = Object.values(levelsToCheck).some(v => v >= threshold); else if (m.track.condition === 'all') achieved = Object.values(levelsToCheck).every(v => v >= threshold); }
             else if (trackType === 'discoveredConcepts.size') checkValue = discSize;
             else if (trackType === 'focusedConcepts.size') checkValue = focSize;
             else if (trackType === 'repositoryInsightsCount') checkValue = insCount;
             else if (trackType === 'focusSlotsTotal') checkValue = slots;
             else if (trackType === 'repositoryContents' && m.track.condition === "allTypesPresent") {
                 // Custom check for having at least one of each repo item type
                 const i = State.getRepositoryItems();
                 achieved = i.scenes.size > 0 && i.experiments.size > 0 && i.insights.size > 0;
             }

             // Standard threshold check if value was determined and not already achieved by condition
             if (!achieved && checkValue !== null && typeof checkValue === 'number' && checkValue >= threshold) {
                 achieved = true;
             }
         }

         // If milestone achieved, update state and grant rewards
         if (achieved) {
             if (State.addAchievedMilestone(m.id)) { // State handles adding and saving
                 console.log("Milestone Achieved!", m.description); milestoneAchievedThisUpdate = true;
                 if (document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayMilestones(); // Update milestone display if visible
                 UI.showMilestoneAlert(m.description); // Show alert

                 // Grant rewards
                 if (m.reward) {
                     if (m.reward.type === 'insight') gainInsight(m.reward.amount || 0, `Milestone: ${m.description}`);
                     else if (m.reward.type === 'attunement') gainAttunementForAction('milestone', m.reward.element || 'All', m.reward.amount || 0);
                     else if (m.reward.type === 'increaseFocusSlots') {
                         const inc = m.reward.amount || 1;
                         if (State.increaseFocusSlots(inc)) { // State handles increase and save
                              UI.updateFocusSlotsDisplay(); // Update UI display
                              // Trigger recursive check in case this unlock enables other slot-based milestones
                              updateMilestoneProgress('focusSlotsTotal', State.getFocusSlots());
                         }
                     }
                     else if (m.reward.type === 'discoverCard') {
                         const cId = m.reward.cardId;
                         if (cId && !State.getDiscoveredConcepts().has(cId)) { // Check if card exists and isn't already discovered
                             const cDisc = concepts.find(c => c.id === cId);
                             if (cDisc) {
                                  addConceptToGrimoireInternal(cId, false); // Add card (handles save/attunement etc.)
                                  UI.showTemporaryMessage(`Milestone Reward: Discovered ${cDisc.name}!`, 3500);
                             }
                         }
                     }
                 }
                 updateAvailableTasks(); // Check if new tasks are available
             }
         }
     });
     // No need for extra saveGameState() here as State functions handle their own saves
}


// --- Daily Login ---
// *** THIS IS THE ONLY DEFINITION OF checkForDailyLogin TO KEEP ***
 function checkForDailyLogin() {
    const today = new Date().toDateString();
    const last = State.getState().lastLoginDate; // Get last login from state
    if (last !== today) {
        console.log("First login today.");
        State.resetDailyRituals(); // Reset daily state (triggers save)
        gainInsight(5.0, "Daily Bonus"); // Grant bonus insight
        UI.showTemporaryMessage("Rituals Reset. Free Research Available!", 3500);
        UI.displayDailyRituals(); // Refresh ritual display
        UI.displayResearchButtons(); // Ensure buttons reflect free research state
        checkTaskCompletion('dailyLogin'); // Check task completion
    } else {
        console.log("Already logged in today.");
        UI.displayResearchButtons(); // Still update buttons in case insight changed
    }
}
// *** THE SECOND DEFINITION OF checkForDailyLogin AROUND LINE 1306 MUST BE DELETED ***


// --- Persona Calculation Logic Helpers ---
 // Calculates average scores based on currently focused concepts
 export function calculateFocusScores() { // Exported
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
         // Average the scores
         for (const key in scores) {
             scores[key] /= count;
         }
     }
     return { focusScores: scores, focusCount: count };
}

 // Generates narrative text based on focus, caches result
 export function calculateTapestryNarrative(forceRecalculate = false) { // Exported
    const currentHash = State.getCurrentFocusSetHash(); // Get hash of current focus set
    const stateHash = State.getState().currentFocusSetHash; // Get hash saved in state

    // Use cached analysis if focus hasn't changed and not forced
    if (currentTapestryAnalysis && !forceRecalculate && currentHash === stateHash) {
        return currentTapestryAnalysis.fullNarrativeHTML;
    }

    const focused = State.getFocusedConcepts(); const focusCount = focused.size;
    if (focusCount === 0) { currentTapestryAnalysis = null; return 'Mark concepts as "Focus" from the Grimoire to weave your narrative.'; }

    const disc = State.getDiscoveredConcepts();
    const { focusScores } = calculateFocusScores(); // Get average scores

    // Prepare analysis object
    const analysis = {
        dominantElements: [], elementThemes: [], dominantCardTypes: [], cardTypeThemes: [],
        synergies: [], tensions: [], essenceTitle: "Balanced", balanceComment: "",
        fullNarrativeRaw: "", fullNarrativeHTML: ""
    };

    // Analyze Dominant Elements
    const sortedElements = Object.entries(focusScores)
        .filter(([k, s]) => s > 3.5) // Consider elements with > 3.5 average score
        .sort(([, a], [, b]) => b - a); // Sort descending

    if (sortedElements.length > 0) {
        analysis.dominantElements = sortedElements.map(([key, score]) => ({
            key: key, name: elementDetails[elementKeyToFullName[key]]?.name || key, score: score
        }));
        // Find interaction theme based on top 1-3 elements
        const topElementKeys = analysis.dominantElements.slice(0, 3).map(e => e.key).sort().join('');
        const themeKey = topElementKeys.length > 1 ? topElementKeys : (topElementKeys.length === 1 ? analysis.dominantElements[0].key : null);
        if (themeKey && elementInteractionThemes && elementInteractionThemes[themeKey]) {
             analysis.elementThemes.push(elementInteractionThemes[themeKey]);
        } else if (analysis.dominantElements.length > 0) {
            // Fallback theme if no specific interaction defined
            analysis.elementThemes.push(`a strong emphasis on **${analysis.dominantElements[0].name}**.`);
        }
        // Determine Essence Title based on dominance
        if (analysis.dominantElements.length >= 2 && analysis.dominantElements[0].score > 6.5 && analysis.dominantElements[1].score > 5.5) {
            analysis.essenceTitle = `${analysis.dominantElements[0].name}/${analysis.dominantElements[1].name} Blend`;
        } else if (analysis.dominantElements.length >= 1 && analysis.dominantElements[0].score > 6.5) {
            analysis.essenceTitle = `${analysis.dominantElements[0].name} Focus`;
        } else {
            analysis.essenceTitle = "Developing"; // Less strong focus
        }
    } else {
        analysis.essenceTitle = "Balanced"; // No elements strongly dominant
    }

    // Analyze Dominant Card Types
    const typeCounts = {}; cardTypeKeys.forEach(type => typeCounts[type] = 0);
    focused.forEach(id => {
        const type = disc.get(id)?.concept?.cardType;
        if (type && typeCounts.hasOwnProperty(type)) { typeCounts[type]++; }
    });
    analysis.dominantCardTypes = Object.entries(typeCounts)
        .filter(([type, count]) => count > 0)
        .sort(([, a], [, b]) => b - a) // Sort by count descending
        .map(([type, count]) => ({ type, count }));
    // Add theme text for the most dominant card type
    if (analysis.dominantCardTypes.length > 0) {
        const topType = analysis.dominantCardTypes[0].type;
        if (cardTypeThemes && cardTypeThemes[topType]) { analysis.cardTypeThemes.push(cardTypeThemes[topType]); }
    }

    // Analyze Synergies (Connections between focused concepts)
    const checkedPairs = new Set();
    focused.forEach(idA => {
        const conceptA = disc.get(idA)?.concept; if (!conceptA?.relatedIds) return;
        focused.forEach(idB => {
            if (idA === idB) return; // Don't compare a concept to itself
            const pairKey = [idA, idB].sort().join('-'); // Create unique key for pair
            if (checkedPairs.has(pairKey)) return; // Skip if already checked
            if (conceptA.relatedIds.includes(idB)) { // Check if related
                const conceptB = disc.get(idB)?.concept;
                if (conceptB) {
                    analysis.synergies.push({ concepts: [conceptA.name, conceptB.name], text: `The connection between **${conceptA.name}** and **${conceptB.name}** suggests a reinforcing dynamic.` });
                }
            }
            checkedPairs.add(pairKey);
        });
    });

    // Analyze Tensions (High and Low scores for the same element within focus)
    const highThreshold = 7.0; const lowThreshold = 3.0;
    const focusConceptsData = Array.from(focused).map(id => disc.get(id)?.concept).filter(Boolean);
    if (focusConceptsData.length >= 2) {
         for (const key of Object.keys(elementNameToKey)) {
               const elementName = elementKeyToFullName[key];
               let hasHigh = focusConceptsData.some(c => c.elementScores?.[key] >= highThreshold);
               let hasLow = focusConceptsData.some(c => c.elementScores?.[key] <= lowThreshold);
               if (hasHigh && hasLow) { // If both high and low scoring concepts exist for this element
                   const highConcepts = focusConceptsData.filter(c => c.elementScores?.[key] >= highThreshold).map(c => c.name);
                   const lowConcepts = focusConceptsData.filter(c => c.elementScores?.[key] <= lowThreshold).map(c => c.name);
                   analysis.tensions.push({ element: elementName, text: `A potential tension exists within **${elementName}**: concepts like **${highConcepts.join(', ')}** lean high, while **${lowConcepts.join(', ')}** lean low.` });
               }
         }
    }

    // Add Balance Comment based on score range
    const scores = Object.values(focusScores); const minScore = Math.min(...scores); const maxScore = Math.max(...scores); const range = maxScore - minScore;
    if (range <= 2.5 && focusCount > 2) analysis.balanceComment = "The focused elements present a relatively balanced profile.";
    else if (range >= 5.0 && focusCount > 2) analysis.balanceComment = "There's a notable range in elemental emphasis within your focus.";

    // Assemble the final narrative string
    let narrative = `Current Essence: **${analysis.essenceTitle}**. `;
    if (analysis.dominantElements.length > 0) { narrative += `Your tapestry currently resonates with ${analysis.elementThemes.join(' ')} `; } else { narrative += "Your focus presents a unique and subtle balance. "; }
    if (analysis.dominantCardTypes.length > 0) { narrative += `The lean towards ${analysis.cardTypeThemes.join(' ')} shapes the expression. `; }
    if (analysis.balanceComment) narrative += analysis.balanceComment + " ";
    analysis.synergies.forEach(syn => { narrative += syn.text + " "; }); analysis.tensions.forEach(ten => { narrative += ten.text + " "; });
    analysis.fullNarrativeRaw = narrative.trim();
    // Convert markdown bold to HTML strong tags
    analysis.fullNarrativeHTML = analysis.fullNarrativeRaw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Cache the result
    currentTapestryAnalysis = analysis;
    console.log("Recalculated Tapestry Analysis:", currentTapestryAnalysis);
    return analysis.fullNarrativeHTML; // Return HTML version for display
 }

 // Calculates dominant themes based on high scores in focused concepts
 export function calculateFocusThemes() { // Exported
     const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); if (focused.size === 0) return [];
     const counts = { A: 0, I: 0, S: 0, P: 0, C: 0, R: 0 }; const thresh = 7.0; // Threshold for counting as "high"
     // Count how many focused concepts have a high score in each element
     focused.forEach(id => {
         const concept = disc.get(id)?.concept;
         if (concept?.elementScores) {
             for (const key in concept.elementScores) {
                 if (elementKeyToFullName.hasOwnProperty(key) && concept.elementScores[key] >= thresh) {
                     counts[key]++;
                 }
             }
         }
     });
     // Filter out elements with zero count, sort descending, map to objects
     const sorted = Object.entries(counts)
        .filter(([k, c]) => c > 0 && elementDetails[elementKeyToFullName[k]])
        .sort(([, a], [, b]) => b - a)
        .map(([k, c]) => ({ key: k, name: elementDetails[elementKeyToFullName[k]]?.name || k, count: c }));
     return sorted;
}

// --- Focus Unlocks ---
 export function checkForFocusUnlocks(silent = false) { // Exported
     // Don't check before advanced stage is reached
     if (State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED) return;
     console.log("Checking focus unlocks..."); let newlyUnlocked = false;
     const focused = State.getFocusedConcepts();
     const unlocked = State.getUnlockedFocusItems();

     focusDrivenUnlocks.forEach(unlock => {
         if (unlocked.has(unlock.id)) return; // Skip if already unlocked

         // Check if all required focus IDs are currently focused
         let met = true;
         if (!unlock.requiredFocusIds || unlock.requiredFocusIds.length === 0) met = false; // Need requirements
         else { for (const reqId of unlock.requiredFocusIds) { if (!focused.has(reqId)) { met = false; break; } } }

         if (met) {
             console.log(`Met reqs for ${unlock.id}`);
             if (State.addUnlockedFocusItem(unlock.id)) { // Add to state (handles save/phase)
                 newlyUnlocked = true;
                 const item = unlock.unlocks;
                 let name = item.name || `ID ${item.id}`;
                 let notif = unlock.description || `Unlocked ${name}`;

                 // Handle different unlock types (add to repo if applicable)
                 if (item.type === 'scene') {
                     if (State.addRepositoryItem('scenes', item.id)) { // Add scene (handles save/phase)
                         console.log(`Unlocked Scene: ${name}`); notif += ` View in Repo.`;
                     } else notif += ` (Already Discovered)`;
                 } else if (item.type === 'experiment') {
                     // Experiments aren't "discovered" this way, just made potentially available
                     console.log(`Unlocked Exp eligibility: ${name}. Check Repo Attunement/Focus.`);
                     notif += ` Check Repo.`;
                 } else if (item.type === 'insightFragment') {
                     if (State.addRepositoryItem('insights', item.id)) { // Add insight (handles save/phase)
                         const iData = elementalInsights.find(i => i.id === item.id);
                         name = iData ? `"${iData.text}"` : `ID ${item.id}`;
                         console.log(`Unlocked Insight: ${item.id}`); notif += ` View in Repo.`;
                         updateMilestoneProgress('repositoryInsightsCount', State.getRepositoryItems().insights.size);
                     } else notif += ` (Already Discovered)`;
                 }
                 // Show notification unless silenced
                 if (!silent) UI.showTemporaryMessage(`Focus Synergy: ${notif}`, 5000);
             }
         }
     });

     // Refresh UI if something was unlocked and not silenced
     if (newlyUnlocked && !silent) {
         console.log("New Focus Unlocks:", Array.from(State.getUnlockedFocusItems()));
         if (document.getElementById('repositoryScreen')?.classList.contains('current')) UI.displayRepositoryContent();
         if (document.getElementById('personaScreen')?.classList.contains('current')) UI.generateTapestryNarrative(); // Update narrative which might reflect unlocks
     }
}

// --- Tapestry Deep Dive Logic ---
 export function showTapestryDeepDive() { // Exported for UI listener
    if (State.getFocusedConcepts().size === 0) { UI.showTemporaryMessage("Focus on concepts first to explore the tapestry.", 3000); return; }
    calculateTapestryNarrative(true); // Ensure analysis is fresh
    if (!currentTapestryAnalysis) { console.error("Failed to generate tapestry analysis for Deep Dive."); UI.showTemporaryMessage("Error analyzing Tapestry.", 3000); return; }
    UI.displayTapestryDeepDive(currentTapestryAnalysis); // Pass analysis data to UI
}

 export function handleDeepDiveNodeClick(nodeId) { // Exported for UI listener
    if (!currentTapestryAnalysis) { console.error("Deep Dive Node Click: Analysis missing."); UI.updateDeepDiveContent("<p>Error: Analysis data unavailable.</p>", nodeId); return; }
    console.log(`Logic: Handling Deep Dive node click: ${nodeId}`);
    let content = `<p><em>Analysis for '${nodeId}'...</em></p>`;
    try {
        // Generate content based on the clicked node ID
        switch (nodeId) {
            case 'elemental':
                content = `<h4>Elemental Resonance Breakdown</h4>`;
                if(currentTapestryAnalysis.elementThemes.length > 0) { content += `<ul>${currentTapestryAnalysis.elementThemes.map(t => `<li>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; }
                else { content += `<p>No specific elemental themes detected based on interaction patterns.</p>`; }
                content += `<p><small>Dominant Elements (Score > 3.5): ${currentTapestryAnalysis.dominantElements.length > 0 ? currentTapestryAnalysis.dominantElements.map(e => `${e.name} (${e.score.toFixed(1)})`).join(', ') : 'None strongly dominant'}</small></p>`;
                if(currentTapestryAnalysis.balanceComment) content += `<p><small>Balance: ${currentTapestryAnalysis.balanceComment}</small></p>`;
                break;
            case 'archetype':
                content = `<h4>Concept Archetype Analysis</h4>`;
                if (currentTapestryAnalysis.cardTypeThemes.length > 0) { content += `<ul>${currentTapestryAnalysis.cardTypeThemes.map(t => `<li>${t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; }
                else { content += `<p>No specific archetype themes detected.</p>`; }
                content += `<p><small>Focus Distribution: ${currentTapestryAnalysis.dominantCardTypes.length > 0 ? currentTapestryAnalysis.dominantCardTypes.map(ct => `${ct.type} (${ct.count})`).join(', ') : 'None'}</small></p>`;
                break;
            case 'synergy':
                content = `<h4>Synergies & Tensions</h4>`;
                if (currentTapestryAnalysis.synergies.length > 0) { content += `<h5>Synergies:</h5><ul>${currentTapestryAnalysis.synergies.map(s => `<li>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; }
                else { content += `<p><em>No direct synergies detected between focused concepts.</em></p>`; }
                content += `<br>`;
                if (currentTapestryAnalysis.tensions.length > 0) { content += `<h5>Tensions:</h5><ul>${currentTapestryAnalysis.tensions.map(t => `<li>${t.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; }
                else { content += `<p><em>No significant elemental tensions detected within the focus.</em></p>`; }
                break;
            default: content = `<p><em>Analysis node '${nodeId}' not recognized.</em></p>`;
        }
    } catch (error) { console.error(`Error generating content for node ${nodeId}:`, error); content = `<p>Error generating analysis for ${nodeId}.</p>`; }
    UI.updateDeepDiveContent(content, nodeId); // Update UI with generated content
}

 export function handleContemplationNodeClick() { // Exported for UI listener
    // Check cooldown first (already done in UI event listener, but good practice)
    const cooldownEnd = State.getContemplationCooldownEnd();
    if (cooldownEnd && Date.now() < cooldownEnd) {
         const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
         UI.showTemporaryMessage(`Contemplation available in ${remaining}s.`, 3000);
         return;
    }
    // Attempt to spend insight
    if (spendInsight(Config.CONTEMPLATION_COST, "Focused Contemplation")) {
        const contemplation = generateFocusedContemplation(); // Generate the task
        if (contemplation) {
            UI.displayContemplationTask(contemplation); // Show task in UI
            // Set cooldown AFTER successful generation and display
            State.setContemplationCooldown(Date.now() + Config.CONTEMPLATION_COOLDOWN); // State handles save
            UI.updateContemplationButtonState(); // Update button state (will show cooldown)
        } else {
            UI.updateDeepDiveContent("<p><em>Could not generate contemplation task.</em></p>", 'contemplation');
            gainInsight(Config.CONTEMPLATION_COST, "Refund: Contemplation Fail"); // Refund if generation failed
            UI.updateContemplationButtonState(); // Update button state (may show error or allow retry)
        }
    } else {
        UI.updateContemplationButtonState(); // Update button state (likely shows insufficient insight)
    }
}

// Generates a dynamic task based on current focus analysis
function generateFocusedContemplation() {
    if (!currentTapestryAnalysis) { console.error("Cannot generate contemplation: Tapestry analysis missing."); return null; }
    const focused = State.getFocusedConcepts(); const disc = State.getDiscoveredConcepts(); const focusedConceptsArray = Array.from(focused).map(id => disc.get(id)?.concept).filter(Boolean);
    // Default task
    let task = { type: "Default", text: "Reflect on the overall feeling of your current focus.", reward: { type: 'insight', amount: 2 }, requiresCompletionButton: true };

    try {
        const taskOptions = []; // Pool of potential tasks

        // Add task based on Tensions
        if (currentTapestryAnalysis.tensions.length > 0) {
             const tension = currentTapestryAnalysis.tensions[Math.floor(Math.random() * currentTapestryAnalysis.tensions.length)];
             taskOptions.push({ type: 'Tension Reflection', text: `Your Tapestry highlights a tension within **${tension.element}**. Reflect on how you reconcile or experience this contrast. Consider adding a note to a related concept.`, reward: { type: 'insight', amount: 4 }, requiresCompletionButton: true });
        }
        // Add task based on Synergies (requires writing a note)
        if (currentTapestryAnalysis.synergies.length > 0) {
            const syn = currentTapestryAnalysis.synergies[Math.floor(Math.random() * currentTapestryAnalysis.synergies.length)];
            const [nameA, nameB] = syn.concepts;
             // Note: This task type doesn't use the completion button, reward granted immediately
            taskOptions.push({ type: 'Synergy Note', text: `Focus links <strong>${nameA}</strong> and <strong>${nameB}</strong>. Add a 'My Note' to <strong>${nameA}</strong> describing how <strong>${nameB}</strong> might amplify or alter its expression. (Reward granted now)`, reward: { type: 'insight', amount: 3 }, requiresCompletionButton: false });
        }
        // Add task based on Dominant Element
        if (currentTapestryAnalysis.dominantElements.length > 0 && currentTapestryAnalysis.dominantElements[0].score > 7.0) {
            const el = currentTapestryAnalysis.dominantElements[0];
            let action = "observe an interaction involving this element"; // Default action
            if (el.key === 'S') action = "mindfully experience one physical sensation related to this element";
            else if (el.key === 'P') action = "acknowledge one emotion linked to this element without judgment";
            else if (el.key === 'C') action = "analyze one assumption related to this element";
            else if (el.key === 'R') action = "consider one relationship boundary influenced by this element";
            else if (el.key === 'A') action = "notice one thing that subtly attracts or repels you, related to this element";
            taskOptions.push({ type: 'Dominant Element Ritual', text: `Your focus strongly resonates with **${el.name}**. Today's mini-ritual: ${action}.`, attunementReward: { element: el.key, amount: 0.5 }, reward: { type: 'insight', amount: 2 }, requiresCompletionButton: true });
        }
        // Generic Tapestry resonance task
        if (focusedConceptsArray.length > 0) {
             const conceptNames = focusedConceptsArray.map(c => `<strong>${c.name}</strong>`);
             taskOptions.push({ type: 'Tapestry Resonance', text: `Meditate briefly on the combined energy of your focused concepts: ${conceptNames.join(', ')}. What overall feeling or image emerges?`, attunementReward: { element: 'All', amount: 0.2 }, reward: { type: 'insight', amount: 3 }, requiresCompletionButton: true });
        }

        // Select a task, prioritizing tension/synergy sometimes
        let selectedTaskOption = null;
        const tensionTask = taskOptions.find(t => t.type === 'Tension Reflection');
        const synergyTask = taskOptions.find(t => t.type === 'Synergy Note');
        if (tensionTask && Math.random() < 0.4) selectedTaskOption = tensionTask;
        else if (synergyTask && Math.random() < 0.4) selectedTaskOption = synergyTask;
        else if (taskOptions.length > 0) selectedTaskOption = taskOptions[Math.floor(Math.random() * taskOptions.length)];

        // If a specific task was selected, use it
        if (selectedTaskOption) {
            task = selectedTaskOption;
            // Grant immediate rewards for tasks without a completion button (like Synergy Note)
            if (task.reward?.type === 'insight' && !task.requiresCompletionButton) {
                gainInsight(task.reward.amount, 'Contemplation Task (Immediate)');
                task.reward = { type: 'none' }; // Clear reward so it's not granted again
            }
            // Grant attunement rewards immediately
            if (task.attunementReward) {
                gainAttunementForAction('contemplation', task.attunementReward.element, task.attunementReward.amount);
                delete task.attunementReward; // Remove so it's not processed again
            }
        } else { console.log("Using default contemplation task."); }

    } catch (error) { console.error("Error generating contemplation task:", error); return { type: "Error", text: "An error occurred during generation.", reward: { type: 'none' }, requiresCompletionButton: false }; }

    console.log(`Generated contemplation task of type: ${task.type}`);
    return task;
}

 export function handleCompleteContemplation(task) { // Exported for UI listener
    if (!task || !task.reward || !task.requiresCompletionButton) return; // Ignore if no button/reward
    console.log(`Contemplation task completed: ${task.type}`);
    // Grant insight reward if applicable
    if (task.reward.type === 'insight' && task.reward.amount > 0) {
        gainInsight(task.reward.amount, `Contemplation Task`);
    }
    // Could add other reward types here if needed

    UI.showTemporaryMessage("Contemplation complete!", 2500);
    UI.clearContemplationTask(); // Update UI to clear task display
    checkTaskCompletion('contemplate'); // Check general contemplation task
    checkTaskCompletion(`contemplate_${task.type}`); // Check task specific to this type
}


// --- Task System Logic ---
// Updates the list of currently available tasks based on phase and completion
 export function updateAvailableTasks() { // Exported
    const currentPhase = State.getOnboardingPhase();
    const completed = State.getCompletedTasks();
    const newlyAvailable = onboardingTasks.filter(task =>
        !completed.has(task.id) && currentPhase >= task.phaseRequired
    );

    const currentIds = new Set(currentTasks.map(t => t.id));
    const newIds = new Set(newlyAvailable.map(t => t.id));
    let changed = false;
    // Basic check if task lists differ in size or content
    if (currentIds.size !== newIds.size) { changed = true; }
    else { for (const id of newIds) { if (!currentIds.has(id)) { changed = true; break; } } }

    // If the list changed AND there are more tasks now, show notification for the newest one
    if (changed && newlyAvailable.length > currentTasks.length) {
        // Find a task in the new list that wasn't in the old list
        const newestTask = newlyAvailable.find(newTask => !currentTasks.some(oldTask => oldTask.id === newTask.id));
        if (newestTask) { UI.showTaskNotification(`New Task: ${newestTask.description}`); }
    }
    currentTasks = newlyAvailable; // Update the internal list of available tasks
    console.log("Available tasks:", currentTasks.map(t => t.id));
}

// Checks if a specific action completes any available tasks
 export function checkTaskCompletion(action, value = null) { // Exported
    const completed = State.getCompletedTasks(); // Get currently completed tasks
    // Filter available tasks to only those matching the triggered action
    const tasksToCheck = currentTasks.filter(task => task.track.action === action);

    tasksToCheck.forEach(task => {
        let shouldComplete = false;
        // Check if task requires a specific value and if it matches
        if (task.track.value !== undefined && value !== null && value === task.track.value) {
            shouldComplete = true;
        }
        // Check if task requires a count of 1 and doesn't need a specific value
        else if (task.track.count === 1 && task.track.value === undefined) {
            shouldComplete = true;
        }
        // Check if task only requires the action itself (no specific value or count > 1)
        else if (task.track.value === undefined && task.track.count === undefined) {
             shouldComplete = true;
        }
        // Add more complex checks here if needed (e.g., count > 1)

        // If conditions met, complete the task
        if (shouldComplete) {
            if (State.completeTask(task.id)) { // State handles adding and saving
                UI.showTemporaryMessage(`Task Complete: ${task.description}!`, 3500);
                // Grant task reward
                if (task.reward && task.reward.type === 'insight') {
                    gainInsight(task.reward.amount, `Task: ${task.description}`);
                }
                updateAvailableTasks(); // Refresh the list of available tasks
            }
        }
    });
}


// --- Final Exports ---
// Group exports at the end for clarity (already done above)

console.log("gameLogic.js loaded.");
