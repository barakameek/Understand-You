// --- START OF COMPLETE ui.js (Phase Removed, Corrected Full File) ---

// js/ui.js - Handles DOM Manipulation and UI Updates
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js'; // Needed for button actions
import {
    elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided,
    reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals,
    sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks,
    cardTypeKeys, elementNames, grimoireShelves
} from '../data.js';



console.log("ui.js loading...");

// --- DOM Element References ---
// Get elements needed across multiple functions once
const saveIndicator = document.getElementById('saveIndicator');
const screens = document.querySelectorAll('.screen');
const welcomeScreen = document.getElementById('welcomeScreen');
const loadButton = document.getElementById('loadButton');
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
const settingsButton = document.getElementById('settingsButton');
// Persona Screen
const personaScreen = document.getElementById('personaScreen');
const personaDetailedView = document.getElementById('personaDetailedView');
const personaSummaryView = document.getElementById('personaSummaryView');
const showDetailedViewBtn = document.getElementById('showDetailedViewBtn');
const showSummaryViewBtn = document.getElementById('showSummaryViewBtn');
const personaElementDetailsDiv = document.getElementById('personaElementDetails');
const userInsightDisplayPersona = document.getElementById('userInsightDisplayPersona');
const focusedConceptsDisplay = document.getElementById('focusedConceptsDisplay');
const focusedConceptsHeader = document.getElementById('focusedConceptsHeader');
const tapestryNarrativeP = document.getElementById('tapestryNarrative');
const personaThemesList = document.getElementById('personaThemesList');
const summaryContentDiv = document.getElementById('summaryContent');
// Persona Summary Specific Divs
const summaryCoreEssenceTextDiv = document.getElementById('summaryCoreEssenceText');
const summaryTapestryInfoDiv = document.getElementById('summaryTapestryInfo');

// Study Screen (Unified Structure Refs)
const studyScreen = document.getElementById('studyScreen');
const initialDiscoveryGuidance = document.getElementById('initialDiscoveryGuidance');
const initialDiscoveryElements = document.getElementById('initialDiscoveryElements');
const studyResearchDiscoveries = document.getElementById('studyResearchDiscoveries');
const studyActionsArea = studyScreen?.querySelector('.study-actions-area');
const freeResearchButton = document.getElementById('freeResearchButton');
const seekGuidanceButton = document.getElementById('seekGuidanceButton');
const userInsightDisplayStudy = document.getElementById('userInsightDisplayStudy');
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay');
const guidedReflectionCostDisplay = document.getElementById('guidedReflectionCostDisplay');
const ritualsAlcove = studyScreen?.querySelector('.rituals-alcove');
// Grimoire Screen
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const grimoireGuidance = document.getElementById('grimoireGuidance');
const grimoireControls = document.getElementById('grimoireControls');
const grimoireFilterControls = grimoireControls?.querySelector('.filter-controls');
const grimoireTypeFilter = document.getElementById('grimoireTypeFilter');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireRarityFilter = document.getElementById('grimoireRarityFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireSearchInput = document.getElementById('grimoireSearchInput');
const grimoireFocusFilter = document.getElementById('grimoireFocusFilter');
const grimoireContentDiv = document.getElementById('grimoireContent');
const grimoireShelvesContainer = document.getElementById('grimoireShelvesContainer');
const grimoireCardArea = document.getElementById('grimoireContent');

// Repository Screen
const repositoryScreen = document.getElementById('repositoryScreen');
const repositoryFocusUnlocksDiv = document.getElementById('repositoryFocusUnlocks')?.querySelector('.repo-list');
const repositoryScenesDiv = document.getElementById('repositoryScenes')?.querySelector('.repo-list');
const repositoryExperimentsDiv = document.getElementById('repositoryExperiments')?.querySelector('.repo-list');
const repositoryInsightsDiv = document.getElementById('repositoryInsights')?.querySelector('.repo-list');
const milestonesDisplay = document.getElementById('milestonesDisplay');

// --- Concept Detail Popup Elements (NEW STRUCTURE) ---
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const closePopupButton = document.getElementById('closePopupButton');
// Header
const popupCardTypeIcon = document.getElementById('popupCardTypeIcon');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
// Main Content
const popupVisualContainer = document.getElementById('popupVisualContainer');
const popupBriefDescription = document.getElementById('popupBriefDescription'); // New
const popupDetailedDescription = document.getElementById('popupDetailedDescription');
// Resonance Gauge (New)
const popupResonanceGaugeContainer = document.getElementById('popupResonanceGaugeContainer');
const popupResonanceGaugeBar = document.getElementById('popupResonanceGaugeBar');
const popupResonanceGaugeLabel = document.getElementById('popupResonanceGaugeLabel');
const popupResonanceGaugeText = document.getElementById('popupResonanceGaugeText');
// Related Concepts (New Container)
const popupRelatedConceptsTags = document.getElementById('popupRelatedConceptsTags');
// Collapsible Sections
const popupLoreSection = document.getElementById('popupLoreSection');
const popupLoreContent = document.getElementById('popupLoreContent');
const popupRecipeDetailsSection = document.getElementById('popupRecipeDetails'); // Parent details for recipe
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const myNotesSection = document.getElementById('myNotesSection'); // Parent details for notes
const myNotesTextarea = document.getElementById('myNotesTextarea');
const saveMyNoteButton = document.getElementById('saveMyNoteButton');
const noteSaveStatusSpan = document.getElementById('noteSaveStatus');
// Action Buttons Footer
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
// Removed Evolution Elements

// --- Other Popups/Modals/Alerts ---
const reflectionModal = document.getElementById('reflectionModal');
const reflectionModalTitle = document.getElementById('reflectionModalTitle');
const closeReflectionModalButton = document.getElementById('closeReflectionModalButton');
const reflectionElement = document.getElementById('reflectionElement');
const reflectionPromptText = document.getElementById('reflectionPromptText');
const reflectionCheckbox = document.getElementById('reflectionCheckbox');
const scoreNudgeCheckbox = document.getElementById('scoreNudgeCheckbox');
const scoreNudgeLabel = document.getElementById('scoreNudgeLabel');
const confirmReflectionButton = document.getElementById('confirmReflectionButton');
const reflectionRewardAmount = document.getElementById('reflectionRewardAmount');
const settingsPopup = document.getElementById('settingsPopup');
const closeSettingsPopupButton = document.getElementById('closeSettingsPopupButton');
const forceSaveButton = document.getElementById('forceSaveButton');
const resetAppButton = document.getElementById('resetAppButton');
const milestoneAlert = document.getElementById('milestoneAlert');
const milestoneAlertText = document.getElementById('milestoneAlertText');
const closeMilestoneAlertButton = document.getElementById('closeMilestoneAlertButton');
const toastElement = document.getElementById('toastNotification');
const toastMessageElement = document.getElementById('toastMessage');
// Persona Action Buttons
const exploreTapestryButton = document.getElementById('exploreTapestryButton');
const exploreSynergyButton = document.getElementById('exploreSynergyButton');
const suggestSceneButton = document.getElementById('suggestSceneButton');
const sceneSuggestCostDisplay = document.getElementById('sceneSuggestCostDisplay');
// Tapestry Deep Dive Modal
const tapestryDeepDiveModal = document.getElementById('tapestryDeepDiveModal');
const deepDiveTitle = document.getElementById('deepDiveTitle');
const closeDeepDiveButton = document.getElementById('closeDeepDiveButton');
const deepDiveFocusIcons = document.getElementById('deepDiveFocusIcons');
const deepDiveNarrativeP = document.getElementById('deepDiveNarrative');
const deepDiveAnalysisNodes = document.getElementById('deepDiveAnalysisNodes');
const deepDiveDetailContent = document.getElementById('deepDiveDetailContent');
const contemplationNodeButton = document.getElementById('contemplationNode');
// Info Popup
const infoPopupElement = document.getElementById('infoPopup');
const infoPopupContent = document.getElementById('infoPopupContent');
const closeInfoPopupButton = document.getElementById('closeInfoPopupButton');
const confirmInfoPopupButton = document.getElementById('confirmInfoPopupButton');


// --- Utility UI Functions ---
let toastTimeout = null;
export function showTemporaryMessage(message, duration = 3000, isGuidance = false) { if (!toastElement || !toastMessageElement) { console.warn("Toast elements missing:", message); return; } console.info(`Toast: ${message}`); toastMessageElement.textContent = message; toastElement.classList.toggle('guidance-toast', isGuidance); if (toastTimeout) { clearTimeout(toastTimeout); } toastElement.classList.remove('hidden', 'visible'); void toastElement.offsetWidth; toastElement.classList.add('visible'); toastElement.classList.remove('hidden'); toastTimeout = setTimeout(() => { toastElement.classList.remove('visible'); setTimeout(() => { if (toastElement && !toastElement.classList.contains('visible')) { toastElement.classList.add('hidden'); } }, 500); toastTimeout = null; }, duration); }
let milestoneTimeout = null;
export function showMilestoneAlert(text) { if (!milestoneAlert || !milestoneAlertText) return; milestoneAlertText.textContent = `Milestone: ${text}`; milestoneAlert.classList.remove('hidden'); if (milestoneTimeout) clearTimeout(milestoneTimeout); milestoneTimeout = setTimeout(hideMilestoneAlert, 5000); }
export function hideMilestoneAlert() { if (milestoneAlert) milestoneAlert.classList.add('hidden'); if (milestoneTimeout) clearTimeout(milestoneTimeout); milestoneTimeout = null; }
export function hidePopups() { if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden'); if (reflectionModal) reflectionModal.classList.add('hidden'); if (settingsPopup) settingsPopup.classList.add('hidden'); if (tapestryDeepDiveModal) tapestryDeepDiveModal.classList.add('hidden'); if (infoPopupElement) infoPopupElement.classList.add('hidden'); const anyPopupVisible = document.querySelector('.popup:not(.hidden)'); if (!anyPopupVisible && popupOverlay) popupOverlay.classList.add('hidden'); GameLogic.clearPopupState(); }

// --- Screen Management ---
let previousScreenId = 'welcomeScreen';

export function showScreen(screenId) {
    console.log("UI: Showing screen:", screenId);
    const currentState = State.getState();
    const isPostQuestionnaire = currentState.questionnaireCompleted;

    screens.forEach(screen => {
        if(screen) {
             screen.classList.toggle('current', screen.id === screenId);
             screen.classList.toggle('hidden', screen.id !== screenId);
        } else {
            const screenElements = document.querySelectorAll('.screen');
            const missingId = Array.from(screenElements).find(s => !s)?.id || 'unknown';
            console.warn(`UI Warning: Screen element with ID potentially '${missingId}' not found during showScreen.`);
        }
    });

    if (mainNavBar) {
        mainNavBar.classList.toggle('hidden', !isPostQuestionnaire || screenId === 'welcomeScreen' || screenId === 'questionnaireScreen');
    }
    navButtons.forEach(button => {
        if (button) {
             button.classList.toggle('active', button.dataset.target === screenId);
             if (isPostQuestionnaire) {
                 button.classList.remove('hidden-by-flow');
             }
        }
    });

    if (isPostQuestionnaire) {
        if (studyActionsArea) studyActionsArea.classList.remove('hidden-by-flow');
        if (ritualsAlcove) ritualsAlcove.classList.remove('hidden-by-flow');
        if (freeResearchButton) freeResearchButton.classList.remove('hidden-by-flow');
        if (seekGuidanceButton) seekGuidanceButton.classList.remove('hidden-by-flow');
        if (grimoireFilterControls) grimoireFilterControls.classList.remove('hidden-by-flow');
        if (grimoireShelvesContainer) grimoireShelvesContainer.classList.remove('hidden-by-flow');
        if (exploreTapestryButton) exploreTapestryButton.classList.remove('hidden-by-flow');
        if (exploreSynergyButton) exploreSynergyButton.classList.remove('hidden-by-flow');
        if (suggestSceneButton) suggestSceneButton.classList.remove('hidden-by-flow');
        if (repositoryScreen) repositoryScreen.classList.remove('hidden-by-flow');

        if (screenId === 'studyScreen') { displayStudyScreenContent(); }
        else if (screenId === 'personaScreen') {
             const justFinishedQuestionnaire = previousScreenId === 'questionnaireScreen';
             if (justFinishedQuestionnaire && personaSummaryView && personaDetailedView && showSummaryViewBtn && showDetailedViewBtn) {
                 personaSummaryView.classList.remove('hidden'); personaSummaryView.classList.add('current');
                 personaDetailedView.classList.add('hidden'); personaDetailedView.classList.remove('current');
                 showSummaryViewBtn.classList.add('active'); showDetailedViewBtn.classList.remove('active');
                 displayPersonaSummary();
             } else {
                 if (!personaDetailedView?.classList.contains('current') && !personaSummaryView?.classList.contains('current')) {
                      personaDetailedView?.classList.remove('hidden'); personaDetailedView?.classList.add('current');
                      showDetailedViewBtn?.classList.add('active');
                      personaSummaryView?.classList.add('hidden'); personaSummaryView?.classList.remove('current');
                      showSummaryViewBtn?.classList.remove('active');
                 }
             }
             GameLogic.displayPersonaScreenLogic();
        } else if (screenId === 'grimoireScreen') { handleFirstGrimoireVisit(); refreshGrimoireDisplay(); }
        else if (screenId === 'repositoryScreen') { displayRepositoryContent(); }

    } else if (screenId === 'questionnaireScreen') {
         if(currentState.currentElementIndex >= 0 && currentState.currentElementIndex < elementNames.length) {
             displayElementQuestions(currentState.currentElementIndex);
         }
    }

    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
    previousScreenId = screenId;
}

// --- Insight Display ---
export function updateInsightDisplays() {
    const insightValue = State.getInsight();
    const insight = insightValue.toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = insight;
    if (studyScreen?.classList.contains('current')) {
        displayStudyScreenContent(); // Re-render study buttons/costs
    }
    if (personaScreen?.classList.contains('current')) {
        // Refresh deep dive unlock buttons
        const deepDiveContainers = personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container:not(.hidden)');
        deepDiveContainers?.forEach(container => {
            const elementKey = container.dataset.elementKey;
            if (elementKey) displayElementDeepDive(elementKey, container);
        });
        updateSuggestSceneButtonState();
        GameLogic.checkSynergyTensionStatus();
    }
    if (repositoryScreen?.classList.contains('current')) {
        displayRepositoryContent(); // Re-render repo items with current costs
    }
    // Update popup if open
    const popupConceptId = GameLogic.getCurrentPopupConceptId();
    if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
        const concept = concepts.find(c => c.id === popupConceptId);
        if(concept && popupLoreContent) { // Update lore unlock buttons
            popupLoreContent.querySelectorAll('.unlock-lore-button').forEach(button => {
                const cost = parseFloat(button.dataset.cost);
                const canAfford = insightValue >= cost;
                button.disabled = !canAfford;
                button.title = canAfford ? `Unlock for ${cost} Insight` : `Requires ${cost} Insight`;
            });
        }
        // Remove evolution section update
    }
    updateContemplationButtonState(); // Update contemplation button cost/state
}


// --- Questionnaire UI ---
export function initializeQuestionnaireUI() { console.log("UI: Initializing Questionnaire UI"); State.updateElementIndex(0); updateElementProgressHeader(-1); displayElementQuestions(0); if (mainNavBar) mainNavBar.classList.add('hidden'); if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; console.log("UI: Questionnaire UI initialized."); }
export function updateElementProgressHeader(activeIndex) { if (!elementProgressHeader) return; elementProgressHeader.innerHTML = ''; elementNames.forEach((name, index) => { const tab = document.createElement('div'); tab.classList.add('element-tab'); const elementData = elementDetails[name] || {}; tab.textContent = elementData.name || name; tab.title = elementData.name || name; tab.classList.toggle('completed', index < activeIndex); tab.classList.toggle('active', index === activeIndex); elementProgressHeader.appendChild(tab); }); }
export function displayElementQuestions(index) { const actualIndex = State.getState().currentElementIndex; const displayIndex = (actualIndex >= 0 && actualIndex < elementNames.length) ? actualIndex : index; console.log(`UI: Displaying Qs requested index ${index}, using state index ${displayIndex}`); if (displayIndex >= elementNames.length) { GameLogic.finalizeQuestionnaire(); return; } const elementName = elementNames[displayIndex]; const elementData = elementDetails[elementName] || {}; const questions = questionnaireGuided[elementName] || []; if (!questionContent) { console.error("questionContent element missing!"); return; } const elementAnswers = State.getState().userAnswers?.[elementName] || {}; let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`; let questionsHTML = ''; questions.forEach(q => { let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`; const savedAnswer = elementAnswers[q.qId]; let sliderValue = q.defaultValue; if (q.type === "slider") { sliderValue = (savedAnswer !== undefined && !isNaN(parseFloat(savedAnswer))) ? parseFloat(savedAnswer) : q.defaultValue; inputHTML += `<div class="slider-container"><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${sliderValue}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(sliderValue).toFixed(1)}</span></p><p class="slider-feedback" id="feedback_${q.qId}"></p></div>`; } else if (q.type === "radio") { inputHTML += `<div class="radio-options">`; q.options.forEach(opt => { const checked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; } else if (q.type === "checkbox") { inputHTML += `<div class="checkbox-options">`; q.options.forEach(opt => { const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; }); inputHTML += `</div>`; } inputHTML += `</div></div>`; questionsHTML += inputHTML; }); if (questions.length === 0) questionsHTML = '<p><em>(No questions for this element)</em></p>'; questionContent.innerHTML = introHTML; const introDiv = questionContent.querySelector('.element-intro'); if (introDiv) introDiv.insertAdjacentHTML('afterend', questionsHTML); else questionContent.innerHTML += questionsHTML; questionContent.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange); input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange); }); questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => { checkbox.removeEventListener('change', GameLogic.handleCheckboxChange); checkbox.addEventListener('change', GameLogic.handleCheckboxChange); }); questionContent.querySelectorAll('.slider.q-input').forEach(slider => { updateSliderFeedbackText(slider, elementName); }); updateDynamicFeedback(elementName, elementAnswers); updateElementProgressHeader(displayIndex); if (progressText) progressText.textContent = `Element ${displayIndex + 1} / ${elementNames.length}: ${elementData.name || elementName}`; if (prevElementButton) prevElementButton.style.visibility = (displayIndex > 0) ? 'visible' : 'hidden'; if (nextElementButton) nextElementButton.textContent = (displayIndex === elementNames.length - 1) ? "View Initial Discoveries" : "Next Element"; console.log(`UI: Finished displaying questions for ${elementName} at index ${displayIndex}`); }
export function updateSliderFeedbackText(sliderElement, elementName) { if (!sliderElement || sliderElement.type !== 'range') return; const qId = sliderElement.dataset.questionId; const feedbackElement = document.getElementById(`feedback_${qId}`); if (!feedbackElement) return; const currentValue = parseFloat(sliderElement.value); const display = document.getElementById(`display_${qId}`); if(display) display.textContent = currentValue.toFixed(1); if (!elementName) { console.warn("updateSliderFeedbackText called without elementName!"); feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; return; } const interpretations = elementDetails?.[elementName]?.scoreInterpretations; if (!interpretations) { feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; return; } const scoreLabel = Utils.getScoreLabel(currentValue); const interpretationText = interpretations[scoreLabel] || `Interpretation for "${scoreLabel}" not found.`; feedbackElement.textContent = interpretationText; feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`; }
export function updateDynamicFeedback(elementName, currentAnswers) { const elementData = elementDetails?.[elementName]; if (!elementData || !dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) { if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; return; } const tempScore = GameLogic.calculateElementScore(elementName, currentAnswers); const scoreLabel = Utils.getScoreLabel(tempScore); feedbackElementSpan.textContent = elementData.name || elementName; feedbackScoreSpan.textContent = tempScore.toFixed(1); let labelSpan = dynamicScoreFeedback.querySelector('.score-label'); if(!labelSpan && feedbackScoreSpan?.parentNode) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling); } if (labelSpan) labelSpan.textContent = ` (${scoreLabel})`; feedbackScoreBar.style.width = `${tempScore * 10}%`; dynamicScoreFeedback.style.display = 'block'; }
export function getQuestionnaireAnswers() { const answers = {}; const inputs = questionContent?.querySelectorAll('.q-input'); if (!inputs) return answers; inputs.forEach(input => { const qId = input.dataset.questionId; const type = input.dataset.type; if (!qId) return; if (type === 'slider') answers[qId] = parseFloat(input.value); else if (type === 'radio') { if (input.checked) answers[qId] = input.value; } else if (type === 'checkbox') { if (!answers[qId]) answers[qId] = []; if (input.checked) answers[qId].push(input.value); } }); return answers; }

// --- Persona Screen UI ---
export function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona element details div not found!"); return; }
    console.log("UI: Displaying Persona Screen (No Phase Check)");
    personaElementDetailsDiv.innerHTML = ''; const scores = State.getScores();
    const showDeepDiveContainer = State.getState().questionnaireCompleted;

    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName]; const score = (typeof scores[key] === 'number' && !isNaN(scores[key])) ? scores[key] : 5.0; const scoreLabel = Utils.getScoreLabel(score); const elementData = elementDetails[elementName] || {}; const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation not available."; const barWidth = score ? (score / 10) * 100 : 0; const color = Utils.getElementColor(elementName); const iconClass = Utils.getElementIcon(elementName);
        const details = document.createElement('details'); details.classList.add('element-detail-entry'); details.dataset.elementKey = key; details.style.setProperty('--element-color', color);
        const descriptionDiv = document.createElement('div'); descriptionDiv.classList.add('element-description');
        descriptionDiv.innerHTML = `<p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p><p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p><hr><p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p><p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>`;
        const deepDiveContainer = document.createElement('div'); deepDiveContainer.classList.add('element-deep-dive-container'); deepDiveContainer.dataset.elementKey = key;
         deepDiveContainer.classList.remove('hidden'); // Always show container post-questionnaire
        descriptionDiv.appendChild(deepDiveContainer);
        details.innerHTML = `<summary class="element-detail-header"><div><i class="${iconClass} element-icon-indicator" style="color: ${color};" title="${elementData.name || elementName}"></i> <strong>${elementData.name || elementName}:</strong> <span>${score?.toFixed(1) ?? '?'}</span> <span class="score-label">(${scoreLabel})</span></div><div class="score-bar-container"><div style="width: ${barWidth}%; background-color: ${color};"></div></div></summary>`;
        details.appendChild(descriptionDiv);
        personaElementDetailsDiv.appendChild(details);
        if (showDeepDiveContainer) { // Populate only if questionnaire is done
            displayElementDeepDive(key, deepDiveContainer);
        }
    });
    displayElementAttunement(); updateInsightDisplays(); displayFocusedConceptsPersona(); generateTapestryNarrative(); synthesizeAndDisplayThemesPersona(); displayPersonaSummary();
    updateTapestryDeepDiveButton(); updateSuggestSceneButtonState();
    GameLogic.checkSynergyTensionStatus();
}

export function displayElementAttunement() { if (!personaElementDetailsDiv || personaElementDetailsDiv.children.length === 0) return; const attunement = State.getAttunement(); elementNames.forEach(elName => { const key = elementNameToKey[elName]; const attunementValue = attunement[key] || 0; const percentage = (attunementValue / Config.MAX_ATTUNEMENT) * 100; const color = Utils.getElementColor(elName); const targetDetails = personaElementDetailsDiv.querySelector(`.element-detail-entry[data-element-key="${key}"]`); if (targetDetails) { let descriptionDiv = targetDetails.querySelector('.element-description'); if (descriptionDiv) { const deepDiveContainer = descriptionDiv.querySelector('.element-deep-dive-container'); descriptionDiv.querySelector('.attunement-display')?.remove(); descriptionDiv.querySelector('.attunement-hr')?.remove(); const hr = document.createElement('hr'); hr.className = 'attunement-hr'; const attunementDiv = document.createElement('div'); attunementDiv.classList.add('attunement-display'); attunementDiv.innerHTML = `<div class="attunement-item"><span class="attunement-name">Attunement:</span><div class="attunement-bar-container" title="Current Attunement: ${attunementValue.toFixed(1)} / ${Config.MAX_ATTUNEMENT}"><div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div></div><i class="fas fa-info-circle info-icon" title="Attunement reflects affinity/experience with this Element. Grows via Research, Reflection, Focusing concepts. High Attunement may unlock content or reduce costs."></i></div>`; if (deepDiveContainer) { descriptionDiv.insertBefore(hr, deepDiveContainer); descriptionDiv.insertBefore(attunementDiv, deepDiveContainer); } else { descriptionDiv.appendChild(hr); descriptionDiv.appendChild(attunementDiv); } } } }); }
export function updateFocusSlotsDisplay() { const focused = State.getFocusedConcepts(); const totalSlots = State.getFocusSlots(); if (focusedConceptsHeader) { focusedConceptsHeader.textContent = `Focused Concepts (${focused.size} / ${totalSlots})`; const icon = focusedConceptsHeader.querySelector('.info-icon'); if(icon) icon.title = `Concepts marked as Focus (${focused.size}) out of your available slots (${totalSlots}). Slots increase via Milestones.`; } }
export function displayFocusedConceptsPersona() { if (!focusedConceptsDisplay) return; focusedConceptsDisplay.innerHTML = ''; updateFocusSlotsDisplay(); const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts(); if (focused.size === 0) { focusedConceptsDisplay.innerHTML = `<li class="focus-placeholder">Focus Concepts from your Grimoire</li>`; return; } focused.forEach(conceptId => { const conceptData = discovered.get(conceptId); if (conceptData?.concept) { const concept = conceptData.concept; const item = document.createElement('div'); item.classList.add('focus-concept-item'); item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`; let iconClass = Utils.getCardTypeIcon(concept.cardType); let iconColor = '#b8860b'; if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement]) { const fullElementName = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); } else { console.warn(`Concept ${concept.name} missing valid primaryElement for focus icon.`); } item.innerHTML = `<i class="${iconClass}" style="color: ${iconColor};"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`; item.addEventListener('click', () => showConceptDetailPopup(concept.id)); focusedConceptsDisplay.appendChild(item); } else { console.warn(`Focused concept ID ${conceptId} not found.`); const item = document.createElement('div'); item.classList.add('focus-concept-item', 'missing'); item.textContent = `Error: ID ${conceptId}`; focusedConceptsDisplay.appendChild(item); } }); updateSuggestSceneButtonState(); }
export function generateTapestryNarrative() { if (!tapestryNarrativeP) return; const narrativeHTML = GameLogic.calculateTapestryNarrative(); tapestryNarrativeP.innerHTML = narrativeHTML || 'Mark concepts as "Focus" to generate narrative...'; }
export function synthesizeAndDisplayThemesPersona() { if (!personaThemesList) return; personaThemesList.innerHTML = ''; const themes = GameLogic.calculateFocusThemes(); if (themes.length === 0) { personaThemesList.innerHTML = `<li>${State.getFocusedConcepts().size > 0 ? 'Focus is currently balanced.' : 'Mark Focused Concepts...'}</li>`; return; } const topTheme = themes[0]; const li = document.createElement('li'); let emphasis = "Strongly"; if (themes.length > 1 && topTheme.count <= themes[1].count + 1) emphasis = "Primarily"; else if (topTheme.count < 3) emphasis = "Leaning towards"; li.textContent = `${emphasis} focused on ${topTheme.name}`; li.style.borderLeft = `3px solid ${Utils.getElementColor(elementKeyToFullName[topTheme.key])}`; li.style.paddingLeft = '8px'; personaThemesList.appendChild(li); if (themes.length > 1 && topTheme.count <= themes[1].count + 1) { const balanceLi = document.createElement('li'); balanceLi.innerHTML = `<small>(with other influences present)</small>`; balanceLi.style.fontSize = '0.85em'; balanceLi.style.color = '#666'; balanceLi.style.paddingLeft = '20px'; balanceLi.style.borderLeft = 'none'; personaThemesList.appendChild(balanceLi); } }

// --- Persona Summary & Chart ---
let personaChartInstance = null;
function drawPersonaChart(scores) { try { if(personaChartInstance){personaChartInstance.destroy();} const canvasContainer = document.querySelector('.chart-container'); const canvasElement = document.getElementById('personaScoreChartCanvas'); if(!canvasElement||!canvasContainer){return;} const ctx=canvasElement.getContext('2d'); if(!ctx){return;} const elementKeys=elementNames.map(name=>elementNameToKey[name]); const labels=elementNames.map(name=>elementDetails[name]?.name||name); const scoreData=elementKeys.map(key=>scores[key]||0); const pointColors=elementNames.map(name=>Utils.getElementColor(name)); const primaryColor=getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()||'#8b4513'; const textColor=getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()||'#4a392c'; const accentColor=getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()||'#ffd700'; const borderColorLight=getComputedStyle(document.documentElement).getPropertyValue('--border-color-light').trim()||'#d3c0a0'; const chartData={labels:labels,datasets:[{label:'Elemental Profile',data:scoreData,backgroundColor:Utils.hexToRgba(primaryColor,0.35),borderColor:primaryColor,borderWidth:2.5,pointBackgroundColor:pointColors,pointBorderColor:Utils.hexToRgba(textColor,0.7),pointRadius:5,pointHoverRadius:7,pointHoverBorderWidth:2,pointHoverBorderColor:accentColor,pointHoverBackgroundColor:'#fff'}]}; const chartOptions={maintainAspectRatio:false,scales:{r:{min:0,max:10,ticks:{stepSize:2,display:true,color:Utils.hexToRgba(textColor,0.8),font:{family:"'Merriweather', serif",size:10},backdropColor:Utils.hexToRgba('#FFF8E7',0.6),backdropPadding:2},angleLines:{color:Utils.hexToRgba(borderColorLight,0.6)},grid:{color:Utils.hexToRgba(borderColorLight,0.4),borderDash:[2,4],lineWidth:0.8},pointLabels:{color:textColor,font:{family:"'Cinzel Decorative', cursive",size:12,weight:'700'},padding:20}}},plugins:{legend:{display:false},tooltip:{enabled:true,backgroundColor:Utils.hexToRgba(textColor,0.9),titleFont:{family:"'Cinzel Decorative', cursive",weight:'bold',size:14},bodyFont:{family:"'Merriweather', serif",size:12},padding:10,cornerRadius:3,displayColors:false,callbacks:{label:function(context){let score=context.parsed.r;return score!==null?`Score: ${score.toFixed(1)} (${Utils.getScoreLabel(score)})`:'';}}}},layout:{padding:25}}; if(canvasContainer)canvasContainer.style.display='block'; personaChartInstance=new Chart(ctx,{type:'radar',data:chartData,options:chartOptions}); console.log("Persona score chart drawn successfully."); } catch(error){ console.error("Error drawing chart:", error); } }
export function displayPersonaSummary() { if (!summaryContentDiv || !summaryCoreEssenceTextDiv || !summaryTapestryInfoDiv) { console.error("Summary view content divs not found!"); if(summaryContentDiv) summaryContentDiv.innerHTML = '<p>Error loading summary content elements.</p>'; return; } summaryCoreEssenceTextDiv.innerHTML = ''; summaryTapestryInfoDiv.innerHTML = ''; const scores = State.getScores(); const focused = State.getFocusedConcepts(); const narrativeHTML = GameLogic.calculateTapestryNarrative(); const themes = GameLogic.calculateFocusThemes(); let coreEssenceHTML = ''; if (elementDetails && elementNameToKey && elementKeyToFullName) { elementNames.forEach(elName => { const key = elementNameToKey[elName]; const score = scores[key]; if (typeof score === 'number') { const label = Utils.getScoreLabel(score); const interpretation = elementDetails[elName]?.scoreInterpretations?.[label] || "N/A"; coreEssenceHTML += `<p><strong>${elementDetails[elName]?.name || elName} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`; } else { coreEssenceHTML += `<p><strong>${elementDetails[elName]?.name || elName}:</strong> Score not available.</p>`; } }); } else { coreEssenceHTML += "<p>Error: Element details not loaded.</p>"; } summaryCoreEssenceTextDiv.innerHTML = coreEssenceHTML; let tapestryHTML = ''; if (focused.size > 0) { tapestryHTML += `<p><em>${narrativeHTML || "No narrative generated."}</em></p>`; tapestryHTML += '<strong>Focused Concepts:</strong><ul>'; const discovered = State.getDiscoveredConcepts(); focused.forEach(id => { const name = discovered.get(id)?.concept?.name || `ID ${id}`; tapestryHTML += `<li>${name}</li>`; }); tapestryHTML += '</ul>'; if (themes.length > 0) { tapestryHTML += '<strong>Dominant Themes:</strong><ul>'; themes.slice(0, 3).forEach(theme => { tapestryHTML += `<li>${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})</li>`; }); tapestryHTML += '</ul>'; } else { tapestryHTML += '<strong>Dominant Themes:</strong><p>No strong themes detected.</p>'; } } else { tapestryHTML += '<p>No concepts are currently focused.</p>'; } summaryTapestryInfoDiv.innerHTML = tapestryHTML; drawPersonaChart(scores); }

// --- Study Screen UI ---
export function displayStudyScreenContent() {
    if (!studyScreen) return;
    console.log(`UI: Displaying Study Screen Content (No Phase Check)`);
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = State.getInsight().toFixed(1);

    // --- Render Core Elements / Research Buttons ---
    if (initialDiscoveryElements) {
        initialDiscoveryElements.innerHTML = '';
        const scores = State.getScores();
        const freeResearchLeft = State.getInitialFreeResearchRemaining();
        const insight = State.getInsight();

        elementNames.forEach(elementName => {
            const key = elementNameToKey[elementName]; const score = scores[key] || 5.0; const scoreLabel = Utils.getScoreLabel(score); const elementData = elementDetails[elementName] || {};
            const color = Utils.getElementColor(elementName); const iconClass = Utils.getElementIcon(elementName);
            const elementDiv = document.createElement('div'); elementDiv.classList.add('initial-discovery-element');
            elementDiv.style.borderColor = color; elementDiv.dataset.elementKey = key;
            let costText = ""; let isDisabled = false; let titleText = ""; let isFreeClick = false;
            const researchCost = Config.BASE_RESEARCH_COST;
            if (freeResearchLeft > 0) { costText = `Free Research (${freeResearchLeft} left)`; titleText = `Conduct FREE research on ${elementData.name || elementName}.`; isFreeClick = true; isDisabled = false; }
            else { costText = `${researchCost} <i class="fas fa-brain insight-icon"></i>`; if (insight < researchCost) { isDisabled = true; titleText = `Research ${elementData.name || elementName} (Requires ${researchCost} Insight)`; } else { isDisabled = false; titleText = `Research ${elementData.name || elementName} (Cost: ${researchCost} Insight)`; } isFreeClick = false; }
            elementDiv.dataset.cost = researchCost;
            elementDiv.innerHTML = ` <div class="element-header"> <i class="${iconClass}" style="color: ${color};"></i> <span class="element-name">${elementData.name || elementName}</span> <span class="element-score">${score.toFixed(1)} (${scoreLabel})</span> </div> <p class="element-concept">${elementData.coreConcept || 'Loading...'}</p> <div class="element-action ${isDisabled ? 'disabled' : ''}"> <span class="element-cost">${costText}</span> </div>`;
            elementDiv.title = titleText; if (!isDisabled) { elementDiv.classList.add('clickable'); } else { elementDiv.classList.add('disabled'); }
            initialDiscoveryElements.appendChild(elementDiv);
        });
    }

    // --- Update Guidance Text (Simplified) ---
    if (initialDiscoveryGuidance) { initialDiscoveryGuidance.textContent = "Research Elements to discover Concepts, complete Rituals, or Seek Guidance."; }

    // --- Update Daily/Guidance Buttons State ---
    if (freeResearchButton) { const freeAvailable = State.isFreeResearchAvailable(); freeResearchButton.disabled = !freeAvailable; freeResearchButton.textContent = freeAvailable ? "Perform Daily Meditation" : "Meditation Performed Today"; freeResearchButton.title = freeAvailable ? "Once per day, perform free research on your least attuned element." : "Daily free meditation already completed."; }
    if (seekGuidanceButton && guidedReflectionCostDisplay) { const cost = Config.GUIDED_REFLECTION_COST; const canAfford = State.getInsight() >= cost; seekGuidanceButton.disabled = !canAfford; seekGuidanceButton.title = canAfford ? `Spend ${cost} Insight for a Guided Reflection.` : `Requires ${cost} Insight.`; guidedReflectionCostDisplay.textContent = cost; }

    // --- Update Results Area Placeholder ---
     if (studyResearchDiscoveries) { const placeholder = studyResearchDiscoveries.querySelector('p > i'); if (placeholder && studyResearchDiscoveries.children.length > 1) { placeholder.parentElement.remove(); } else if (!placeholder && studyResearchDiscoveries.children.length === 0) { studyResearchDiscoveries.innerHTML = '<p><i>Discoveries will appear here...</i></p>'; } }

    // --- Render Rituals ---
    displayDailyRituals();
}

// --- Rituals Display ---
export function displayDailyRituals() { if (!dailyRitualsDisplay) return; dailyRitualsDisplay.innerHTML = ''; const completed = State.getState().completedRituals.daily || {}; const focused = State.getFocusedConcepts(); let activeRituals = [...dailyRituals]; if (focusRituals) { focusRituals.forEach(ritual => { if (!ritual.requiredFocusIds || !Array.isArray(ritual.requiredFocusIds) || ritual.requiredFocusIds.length === 0) return; const reqIds = new Set(ritual.requiredFocusIds); let allFocused = true; for (const id of reqIds) { if (!focused.has(id)) { allFocused = false; break; } } if (allFocused) activeRituals.push({ ...ritual, isFocusRitual: true }); }); } if (activeRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No daily rituals currently active.</li>'; return; } activeRituals.forEach(ritual => { const completedData = completed[ritual.id] || { completed: false, progress: 0 }; const isCompleted = completedData.completed; const li = document.createElement('li'); li.classList.toggle('completed', isCompleted); if(ritual.isFocusRitual) li.classList.add('focus-ritual'); let rewardText = ''; if (ritual.reward) { if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`; else if (ritual.reward.type === 'attunement') { const elName = ritual.reward.element === 'All' ? 'All' : (elementKeyToFullName[ritual.reward.element] || ritual.reward.element); rewardText = `(+${ritual.reward.amount} ${elName} Attun.)`; } else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`; } li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`; dailyRitualsDisplay.appendChild(li); }); }

// --- Research Results & Update Button ---
export function displayResearchResults(results) { const container = document.getElementById('studyResearchDiscoveries'); if (!container) { console.error(`Research results container #studyResearchDiscoveries not found!`); return; } const { concepts: foundConcepts, repositoryItems, duplicateInsightGain } = results; const placeholder = container.querySelector('p > i'); if ((foundConcepts.length > 0 || repositoryItems.length > 0) && placeholder && container.children.length === 1) { container.innerHTML = ''; } else if ((foundConcepts.length > 0 || repositoryItems.length > 0) && !placeholder && container.children.length > 0 && !container.querySelector('.research-result-item, .repository-item-discovery')) { container.innerHTML = ''; } if (duplicateInsightGain > 0) { const existingDupeMsg = container.querySelector('.duplicate-message'); if(existingDupeMsg) existingDupeMsg.remove(); const dupeMsg = document.createElement('p'); dupeMsg.classList.add('duplicate-message'); dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate echoes.`; container.prepend(dupeMsg); } repositoryItems.forEach(item => { if (container.querySelector(`[data-repo-id="${item.id}"]`)) return; const itemDiv = document.createElement('div'); itemDiv.classList.add('repository-item-discovery'); itemDiv.dataset.repoId = item.id; let iconClass = 'fa-question-circle'; let typeName = 'Item'; if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; } else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; } itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered the '${item.name}'. View it in the Repository.`}</p>`; container.appendChild(itemDiv); }); foundConcepts.forEach(concept => { if (!container.querySelector(`.research-result-item[data-concept-id="${concept.id}"]`)) { const resultItemDiv = document.createElement('div'); resultItemDiv.classList.add('research-result-item'); resultItemDiv.dataset.conceptId = concept.id; const cardElement = renderCard(concept, 'discovery-note'); if (!cardElement) return; resultItemDiv.appendChild(cardElement); const actionDiv = document.createElement('div'); actionDiv.classList.add('research-actions'); const addButton = document.createElement('button'); addButton.textContent = "Add to Grimoire"; addButton.classList.add('button', 'small-button', 'add-button'); addButton.dataset.conceptId = concept.id; actionDiv.appendChild(addButton); const sellButton = document.createElement('button'); let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR; sellButton.textContent = `Sell (${sellValue.toFixed(1)}) `; sellButton.innerHTML += `<i class="fas fa-brain insight-icon"></i>`; sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button'); sellButton.dataset.conceptId = concept.id; sellButton.dataset.context = 'discovery'; sellButton.title = `Sell for ${sellValue.toFixed(1)} Insight.`; actionDiv.appendChild(sellButton); resultItemDiv.appendChild(actionDiv); container.appendChild(resultItemDiv); } }); const hasContent = container.querySelector('.research-result-item, .repository-item-discovery'); if (!hasContent && container.children.length <= 1) { container.querySelector('.duplicate-message')?.remove(); container.innerHTML = '<p><i>Discoveries will appear here...</i></p>'; } }
export function updateResearchButtonAfterAction(conceptId, action) { const container = document.getElementById('studyResearchDiscoveries'); const itemDiv = container?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`); if (!itemDiv || !container) return; if (action === 'add' || action === 'sell') { itemDiv.remove(); const hasContent = container.querySelector('.research-result-item, .repository-item-discovery'); if (!hasContent && container.children.length <= 1) { container.querySelector('.duplicate-message')?.remove(); container.innerHTML = '<p><i>Discoveries will appear here...</i></p>'; } } }

// --- Grimoire Screen UI ---
export function updateGrimoireCounter() { if (grimoireCountSpan) grimoireCountSpan.textContent = State.getDiscoveredConcepts().size; }
export function populateGrimoireFilters() { if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); } if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = fullName; option.textContent = name; grimoireElementFilter.appendChild(option); }); } }
function updateShelfCounts() { if (!grimoireShelvesContainer) return; const conceptData = Array.from(State.getDiscoveredConcepts().values()); grimoireShelves.forEach(shelf => { const shelfElem = grimoireShelvesContainer.querySelector(`.grimoire-shelf[data-category-id="${shelf.id}"] .shelf-count`); if (shelfElem) { const count = conceptData.filter(data => (data.userCategory || 'uncategorized') === shelf.id).length; shelfElem.textContent = `(${count})`; } }); }
export function displayGrimoire(filterParams = {}) { const { filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All", searchTerm = "", filterFocus = "All", filterCategory = "All" } = filterParams; if (grimoireShelvesContainer) { grimoireShelvesContainer.innerHTML = ''; grimoireShelves.forEach(shelf => { const shelfDiv = document.createElement('div'); shelfDiv.classList.add('grimoire-shelf'); shelfDiv.dataset.categoryId = shelf.id; if (filterCategory === shelf.id) { shelfDiv.classList.add('active-shelf'); } shelfDiv.innerHTML = `<h4>${shelf.name} <i class="fas fa-info-circle info-icon" title="${shelf.description || ''}"></i></h4><span class="shelf-count">(0)</span>`; grimoireShelvesContainer.appendChild(shelfDiv); }); const showAllDiv = document.createElement('div'); showAllDiv.classList.add('grimoire-shelf', 'show-all-shelf'); if (filterCategory === 'All') { showAllDiv.classList.add('active-shelf'); } showAllDiv.innerHTML = `<h4>Show All Cards</h4>`; showAllDiv.dataset.categoryId = 'All'; grimoireShelvesContainer.appendChild(showAllDiv); } else { console.error("Grimoire shelves container not found."); } const targetCardContainer = grimoireContentDiv; if (!targetCardContainer) { console.error("#grimoireContent element not found for cards."); return; } targetCardContainer.innerHTML = ''; const discoveredMap = State.getDiscoveredConcepts(); if (discoveredMap.size === 0) { targetCardContainer.innerHTML = '<p>Your Grimoire is empty... Discover Concepts in the Study!</p>'; updateShelfCounts(); return; } const userScores = State.getScores(); const focusedSet = State.getFocusedConcepts(); let discoveredArray = Array.from(discoveredMap.values()); const searchTermLower = searchTerm.toLowerCase().trim(); const conceptsToDisplay = discoveredArray.filter(data => { if (!data?.concept) return false; const concept = data.concept; const userCategory = data.userCategory || 'uncategorized'; const typeMatch = (filterType === "All") || (concept.cardType === filterType); let elementMatch = (filterElement === "All"); if (!elementMatch && elementNameToKey && filterElement !== "All") { const elementKey = elementNameToKey[filterElement]; if (elementKey) elementMatch = (concept.primaryElement === elementKey); } const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity); const focusMatch = (filterFocus === 'All') || (filterFocus === 'Focused' && focusedSet.has(concept.id)) || (filterFocus === 'Not Focused' && !focusedSet.has(concept.id)); const searchMatch = !searchTermLower || (concept.name.toLowerCase().includes(searchTermLower)) || (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTermLower))); const categoryMatch = (filterCategory === 'All') || (userCategory === filterCategory); return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch && categoryMatch; }); const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 }; conceptsToDisplay.sort((a, b) => { if (!a.concept || !b.concept) return 0; const conceptA = a.concept; const conceptB = b.concept; switch (sortBy) { case 'name': return conceptA.name.localeCompare(conceptB.name); case 'type': return (cardTypeKeys.indexOf(conceptA.cardType) - cardTypeKeys.indexOf(conceptB.cardType)) || conceptA.name.localeCompare(conceptB.name); case 'rarity': return (rarityOrder[conceptA.rarity] || 0) - (rarityOrder[conceptB.rarity] || 0) || conceptA.name.localeCompare(conceptB.name); case 'resonance': const distA = Utils.euclideanDistance(userScores, conceptA.elementScores); const distB = Utils.euclideanDistance(userScores, conceptB.elementScores); return distA - distB || conceptA.name.localeCompare(conceptB.name); default: return (a.discoveredTime || 0) - (b.discoveredTime || 0) || conceptA.name.localeCompare(conceptB.name); } }); if (conceptsToDisplay.length === 0) { targetCardContainer.innerHTML = `<p>No discovered concepts match the current filters${searchTerm ? ' or search term' : ''}.</p>`; } else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire'); if (cardElement) { cardElement.draggable = true; cardElement.dataset.conceptId = data.concept.id; cardElement.classList.add(`category-${data.userCategory || 'uncategorized'}`); targetCardContainer.appendChild(cardElement); } }); } updateShelfCounts(); }
export function refreshGrimoireDisplay(overrideFilters = {}) { if (grimoireScreen && !grimoireScreen.classList.contains('hidden')) { const currentFilters = { filterType: grimoireTypeFilter?.value || "All", filterElement: grimoireElementFilter?.value || "All", sortBy: grimoireSortOrder?.value || "discovered", filterRarity: grimoireRarityFilter?.value || "All", searchTerm: grimoireSearchInput?.value || "", filterFocus: grimoireFocusFilter?.value || "All", filterCategory: overrideFilters.filterCategory !== undefined ? overrideFilters.filterCategory : document.querySelector('.grimoire-shelf.active-shelf')?.dataset.categoryId || "All" }; const finalFilters = { ...currentFilters, ...overrideFilters }; displayGrimoire(finalFilters); } }
function handleFirstGrimoireVisit() { if (!State.getState().grimoireFirstVisitDone) { if (grimoireGuidance) { grimoireGuidance.innerHTML = `<i class="fas fa-info-circle"></i> Welcome to your Grimoire! Drag & Drop Concept cards onto the shelves above to categorize them. Click cards for details.`; grimoireGuidance.classList.remove('hidden'); } State.markGrimoireVisited(); } else { if (grimoireGuidance) grimoireGuidance.classList.add('hidden'); } }

// --- Card Rendering ---
export function renderCard(concept, context = 'grimoire') {
    // --- Basic Validation ---
    if (!concept || typeof concept.id === 'undefined') {
        console.warn("renderCard called with invalid concept:", concept);
        const eDiv = document.createElement('div');
        eDiv.textContent = "Error: Invalid Concept Data";
        return eDiv;
    }

    // --- Create Card Element ---
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `View Details: ${concept.name}`;

    // --- Get State Data ---
    const discoveredData = State.getDiscoveredConceptData(concept.id);
    const isDiscovered = !!discoveredData;
    const isFocused = State.getFocusedConcepts().has(concept.id);
    const hasNewLore = discoveredData?.newLoreAvailable || false;

    // --- Generate Stamps ---
    const focusStampHTML = isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const noteStampHTML = (!isDiscovered && (context === 'discovery-note' || context === 'research-output')) ? '<span class="note-stamp" title="Research Note"><i class="fa-regular fa-clipboard"></i></span>' : '';
    const loreStampHTML = (isDiscovered && hasNewLore) ? '<span class="lore-indicator" title="New Lore Unlocked!"><i class="fas fa-scroll"></i></span>' : '';

    // --- Generate Header Elements ---
    const cardTypeIcon = Utils.getCardTypeIcon(concept.cardType);
    let rarityText = concept.rarity ? concept.rarity.charAt(0).toUpperCase() + concept.rarity.slice(1) : 'Common';
    let rarityClass = `rarity-indicator-${concept.rarity || 'common'}`;
    const rarityIndicatorHTML = `<span class="card-rarity ${rarityClass}" title="Rarity: ${rarityText}">${rarityText}</span>`;

    // --- Generate Primary Element Display ---
    let primaryElementHTML = '<small style="color:#888; font-style: italic;">Basic Affinity</small>';
    if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) {
        const primaryKey = concept.primaryElement;
        const primaryFullName = elementKeyToFullName[primaryKey];
        const primaryColor = Utils.getElementColor(primaryFullName);
        const primaryIcon = Utils.getElementIcon(primaryFullName);
        const primaryName = elementDetails[primaryFullName]?.name || primaryFullName;
        primaryElementHTML = `<span class="primary-element-display" style="color: ${primaryColor};" title="Primary Element: ${primaryName}">
                                 <i class="${primaryIcon}"></i> ${primaryName.split(':')[0]}
                              </span>`;
    }

    // --- Generate Visual Content (IMAGE or ICON) ---
    let visualContentHTML = '';
  if (concept.visualHandle) {
    visualContentHTML = `
        <img src="placeholder_art/${concept.visualHandle}" alt="${concept.name} Art" class="card-art-image"
             onerror="this.style.display='none'; this.parentElement.querySelector('.card-visual-placeholder')?.style.display='block';">
        <i class="fas fa-image card-visual-placeholder" style="display: none;" title="Art Placeholder (Load Failed)"></i>`;
    } else {
        visualContentHTML = `<i class="fas fa-question card-visual-placeholder" title="Visual Placeholder"></i>`;
    }
    // --- END Visual Content Generation ---

    // --- Generate Action Buttons (Grimoire Context Only) ---
    let actionButtonsHTML = '';
    const showFocusButtonOnCard = context === 'grimoire' && isDiscovered;
    const showSellButtonOnCard = context === 'grimoire' && isDiscovered;
    let hasActions = false;

    if (context === 'grimoire') {
        actionButtonsHTML = '<div class="card-actions">';
        if (showSellButtonOnCard) {
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
            const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            actionButtonsHTML += `<button class="button tiny-button secondary-button sell-button card-sell-button" data-concept-id="${concept.id}" data-context="grimoire" title="Sell (${sellValue.toFixed(1)} Insight)"><i class="fas fa-dollar-sign"></i></button>`;
            hasActions = true;
        }
        if (showFocusButtonOnCard) {
            const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
            const buttonClass = isFocused ? 'marked' : '';
            const buttonIcon = isFocused ? 'fa-star' : 'fa-regular fa-star';
            const buttonTitle = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove Focus' : 'Mark as Focus');
            actionButtonsHTML += `<button class="button tiny-button card-focus-button ${buttonClass}" data-concept-id="${concept.id}" title="${buttonTitle}" ${slotsFull ? 'disabled' : ''}><i class="fas ${buttonIcon}"></i></button>`;
            hasActions = true;
        }
        actionButtonsHTML += '</div>';
        if (!hasActions) actionButtonsHTML = '';
    }

    // --- Assemble Final Card HTML ---
    cardDiv.innerHTML = `
        <div class="card-header">
            <span class="card-type-icon-area"><i class="${cardTypeIcon}" title="${concept.cardType}"></i></span>
            <span class="card-name">${concept.name}</span>
            <span class="card-header-right">
                 ${rarityIndicatorHTML}
                 <span class="card-stamps">${focusStampHTML}${noteStampHTML}${loreStampHTML}</span>
            </span>
        </div>
        <div class="card-visual">${visualContentHTML}</div> 
        <div class="card-footer">
            <div class="card-affinities">${primaryElementHTML}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
            ${actionButtonsHTML}
        </div>`;

    // --- Add Contextual Info/Classes ---
    if (context === 'research-output' || context === 'discovery-note') {
        cardDiv.title = `Click to view details for ${concept.name} (Not yet in Grimoire)`;
        cardDiv.classList.add('research-note-card');
    }
    if (isDiscovered) {
        cardDiv.classList.add(`category-${discoveredData.userCategory || 'uncategorized'}`);
    }

    return cardDiv;
}

// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    console.log(`--- Opening Popup for Concept ID: ${conceptId} ---`);

    const conceptData = concepts.find(c => c.id === conceptId);
    if (!conceptData) { console.error("Concept data missing:", conceptId); return; }

    const discoveredData = State.getDiscoveredConceptData(conceptId);
    const inGrimoire = !!discoveredData;
    const researchNotesArea = document.getElementById('studyResearchDiscoveries');
    const inResearchNotes = !inGrimoire && researchNotesArea?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);

    console.log(`   - In Grimoire (Discovered): ${inGrimoire}`);
    console.log(`   - Is in Research Notes: ${!!inResearchNotes}`);

    GameLogic.setCurrentPopupConcept(conceptId);

    // --- Populate Header ---
    if (popupConceptName) popupConceptName.textContent = conceptData.name;
    let subHeaderText = conceptData.cardType || "Unknown Type";
    let primaryElementIconHTML = '';
    if (conceptData.primaryElement && elementKeyToFullName?.[conceptData.primaryElement]) {
        const primaryKey = conceptData.primaryElement;
        const primaryFullName = elementKeyToFullName[primaryKey];
        const primaryColor = Utils.getElementColor(primaryFullName);
        const primaryIcon = Utils.getElementIcon(primaryFullName);
        const primaryName = elementDetails[primaryFullName]?.name || primaryFullName;
        subHeaderText += ` | Element: ${primaryName.split(':')[0]}`;
        primaryElementIconHTML = `<i class="${primaryIcon} popup-element-icon" style="color: ${primaryColor}; margin-left: 8px;" title="Primary Element: ${primaryName}"></i>`;
    }
    if (popupConceptType) popupConceptType.innerHTML = subHeaderText + primaryElementIconHTML;
    if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;

    // --- Populate Visual ---
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = '';
        let content;
      if (conceptData.visualHandle) {
    content = document.createElement('img');
    content.src = `placeholder_art/${conceptData.visualHandle}`; // <-- ONLY visualHandle
    content.alt = `${conceptData.name} Art`;
            content.classList.add('card-art-image');
            content.onerror = function() {
                this.style.display='none';
                const icon = document.createElement('i');
                icon.className = `fas fa-image card-visual-placeholder`;
                icon.title = "Art Placeholder (Load Failed)";
                popupVisualContainer.appendChild(icon);
             };
        } else {
            content = document.createElement('i');
            content.className = `fas fa-question card-visual-placeholder`;
            content.title = "Visual Placeholder";
        }
        popupVisualContainer.appendChild(content);
    }

    // --- Populate Info Area ---
    if (popupBriefDescription) {
        popupBriefDescription.textContent = conceptData.briefDescription || '';
    }
    if (popupDetailedDescription) {
        popupDetailedDescription.textContent = conceptData.detailedDescription || "No description.";
    }

    const scores = State.getScores();
    const distance = Utils.euclideanDistance(scores, conceptData.elementScores);
    displayPopupResonanceGauge(distance); // Call NEW Gauge function
    displayPopupRelatedConceptsTags(conceptData); // Call NEW Tags function

    // --- Populate Collapsible Sections ---
    if(popupRecipeDetailsSection) displayPopupRecipeComparison(conceptData, scores); // Keep this

    // Lore
    if (popupLoreSection && popupLoreContent) {
        const hasLoreDefined = conceptData.lore && conceptData.lore.length > 0;
        console.log(`   - Lore Check: In Grimoire=${inGrimoire}, Has Lore Defined=${hasLoreDefined}`);
        popupLoreSection.classList.toggle('hidden', !inGrimoire || !hasLoreDefined);
        popupLoreContent.innerHTML = ''; // Clear previous entries
        if (inGrimoire && hasLoreDefined) {
            const unlockedLevel = State.getUnlockedLoreLevel(conceptId);
            console.log(`   - Currently Unlocked Lore Level for ${conceptId}: ${unlockedLevel}`);
            conceptData.lore.forEach((loreEntry, index) => {
                const loreDiv = document.createElement('div');
                loreDiv.classList.add('lore-entry');
                loreDiv.dataset.loreLevel = loreEntry.level; // Add data attribute

                if (loreEntry.level <= unlockedLevel) {
                    console.log(`      -> UNLOCKED. Adding text: "${loreEntry.text.substring(0, 20)}..."`);
                    loreDiv.innerHTML = `<h5 class="lore-level-title">Level ${loreEntry.level} Insight:</h5><p class="lore-text">${loreEntry.text}</p>`;
                } else {
                    console.log(`      -> LOCKED.`);
                    loreDiv.innerHTML = `<h5 class="lore-level-title">Level ${loreEntry.level} Insight: [Locked]</h5>`;
                    const cost = Config.LORE_UNLOCK_COSTS[`level${loreEntry.level}`] || 999;
                    const currentInsight = State.getInsight();
                    const canAfford = currentInsight >= cost;
                    console.log(`         -> Cost: ${cost}, Have: ${currentInsight.toFixed(1)}, Can Afford: ${canAfford}`);
                    const unlockButton = document.createElement('button');
                    unlockButton.className = 'button tiny-button unlock-lore-button';
                    unlockButton.dataset.conceptId = conceptId;
                    unlockButton.dataset.loreLevel = loreEntry.level;
                    unlockButton.dataset.cost = cost;
                    unlockButton.title = canAfford ? `Unlock for ${cost} Insight` : `Requires ${cost} Insight`;
                    unlockButton.disabled = !canAfford;
                    unlockButton.innerHTML = `Unlock (${cost} <i class="fas fa-brain insight-icon"></i>)`;
                    loreDiv.appendChild(unlockButton);
                    console.log(`         -> Added unlock button.`);
                }
                popupLoreContent.appendChild(loreDiv);
                if (index < conceptData.lore.length - 1) popupLoreContent.appendChild(document.createElement('hr'));
            });
            // Set open state based on whether there's new unseen lore
            popupLoreSection.open = (discoveredData?.newLoreAvailable) || false;
        } else if (inGrimoire && !hasLoreDefined) {
             console.log(`   - No lore defined for ${conceptData.name} in data.js.`);
             popupLoreContent.innerHTML = '<p><i>No lore recorded.</i></p>';
        } else {
             console.log(`   - Lore section not populated (Not in Grimoire or no lore defined).`);
        }
        // Mark lore as seen if it was new
        if (inGrimoire && discoveredData?.newLoreAvailable) {
             State.markLoreAsSeen(conceptId);
             const cardElemIndicator = document.querySelector(`#grimoireContent .concept-card[data-concept-id="${conceptId}"] .lore-indicator`);
             cardElemIndicator?.remove();
             console.log(`Marked lore seen: ${conceptId}`);
        }
    } else { console.error("Lore elements missing!"); }

    // Notes
    const showNotes = inGrimoire;
    if (myNotesSection) { // Target the parent details element
         myNotesSection.classList.toggle('hidden', !showNotes);
         if (showNotes && discoveredData) {
             if(myNotesTextarea) myNotesTextarea.value = discoveredData.notes || "";
             if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = "";
             myNotesSection.open = false; // Start closed
         }
    }

    // --- Remove Evolution Display Logic ---

    // --- Update Action Buttons ---
    updateGrimoireButtonStatus(conceptId, !!inResearchNotes);
    updateFocusButtonStatus(conceptId);
    updatePopupSellButton(conceptId, conceptData, inGrimoire, !!inResearchNotes);

    // --- Show Popup ---
    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
     console.log(`--- Finished Opening Popup for Concept ID: ${conceptId} ---`);
}

// !!! NEW FUNCTION: displayPopupResonanceGauge !!!
function displayPopupResonanceGauge(distance) {
    const gaugeBar = document.getElementById('popupResonanceGaugeBar');
    const gaugeLabel = document.getElementById('popupResonanceGaugeLabel');
    const gaugeText = document.getElementById('popupResonanceGaugeText');

    if (!gaugeBar || !gaugeLabel || !gaugeText) {
        console.error("Resonance gauge elements not found!");
        return;
    }

    let resonanceLabel, resonanceClass, message, widthPercent;

    if (distance === Infinity || isNaN(distance)) {
        resonanceLabel = "N/A"; resonanceClass = ""; message = "(Comparison Error)"; widthPercent = 0;
    } else if (distance < 2.5) {
        resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strong alignment."; widthPercent = Math.min(100, Math.max(5, 100 - (distance * 15))); // Scale visually
    } else if (distance < 4.0) {
        resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares common ground."; widthPercent = Math.min(100, Math.max(5, 100 - (distance * 15)));
    } else if (distance < 6.0) {
        resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities."; widthPercent = Math.min(100, Math.max(5, 100 - (distance * 12)));
    } else if (distance <= Config.DISSONANCE_THRESHOLD) {
        resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence."; widthPercent = Math.min(100, Math.max(5, 100 - (distance * 10)));
    } else {
        resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significant divergence."; widthPercent = Math.min(100, Math.max(5, 100 - (distance * 8))); // Lower scaling for dissonance
    }

    // Adjust width to ensure it's visually distinct even for high distance
     widthPercent = Math.max(5, Math.min(95, widthPercent)); // Clamp between 5% and 95%

    gaugeBar.style.width = `${widthPercent}%`;
    gaugeBar.className = ''; // Clear previous classes
    if (resonanceClass) gaugeBar.classList.add(resonanceClass);

    gaugeLabel.textContent = resonanceLabel;
    gaugeLabel.className = ''; // Clear previous classes
    if (resonanceClass) gaugeLabel.classList.add(resonanceClass); // Use class for potential text color changes

    gaugeText.textContent = `${message} (Dist: ${distance.toFixed(1)})`;
}

// !!! REVISED FUNCTION: displayPopupRelatedConceptsTags !!!
function displayPopupRelatedConceptsTags(conceptData) {
    const tagsContainer = document.getElementById('popupRelatedConceptsTags');
    if (!tagsContainer) {
        console.error("Related concepts tags container #popupRelatedConceptsTags not found!");
        return;
    }
    tagsContainer.innerHTML = ''; // Clear previous tags

    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
        let foundCount = 0;
        conceptData.relatedIds.forEach(relatedId => {
            const relatedConcept = concepts.find(c => c.id === relatedId);
            if (relatedConcept) {
                const tag = document.createElement('span');
                tag.textContent = relatedConcept.name;
                tag.classList.add('related-concept-tag');
                tag.title = `Related: ${relatedConcept.name}`;
                // Optional: Add click listener later if needed
                // tag.addEventListener('click', () => { /* Maybe show related concept? */ });
                tagsContainer.appendChild(tag);
                foundCount++;
            } else {
                console.warn(`Related concept ID ${relatedId} in concept ${conceptData.id} not found.`);
            }
        });

        if (foundCount === 0) {
            tagsContainer.innerHTML = '<p><i>None specified or found.</i></p>';
        }
    } else {
        tagsContainer.innerHTML = '<p><i>None specified.</i></p>';
    }
}

// Keep Recipe Comparison Function (adjust targeting if needed)
export function displayPopupRecipeComparison(conceptData, userCompScores) {
    const detailsElement = document.getElementById('popupRecipeDetails'); // Targets the main <details>
    const conceptProfileContainer = document.getElementById('popupConceptProfile'); // Direct ID
    const userProfileContainer = document.getElementById('popupUserComparisonProfile'); // Direct ID
    const highlightsContainer = document.getElementById('popupComparisonHighlights'); // Direct ID

    if (!conceptProfileContainer || !userProfileContainer || !highlightsContainer || !detailsElement) {
        console.warn("Popup recipe comparison elements not found!");
        if(detailsElement) detailsElement.style.display = 'none';
        return;
    }
    detailsElement.style.display = ''; // Ensure parent is visible
    conceptProfileContainer.innerHTML = '';
    userProfileContainer.innerHTML = '';
    highlightsContainer.innerHTML = '';
    let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>';
    let hasHighlights = false;
    const conceptScores = conceptData.elementScores || {};
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName];
        const fullName = elementKeyToFullName[key];
        if (!fullName) return;
        const conceptScore = conceptScores[key];
        const userScore = userCompScores[key];
        const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore);
        const userScoreValid = typeof userScore === 'number' && !isNaN(userScore);
        const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?';
        const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';
        const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A';
        const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A';
        const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0;
        const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0;
        const color = Utils.getElementColor(fullName);
        const elementNameShort = elementDetails[fullName]?.name.substring(0, 11) || elName;
        conceptProfileContainer.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${conceptDisplay}</span> <div class="score-bar-container" title="${conceptLabel}"><div style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`;
        userProfileContainer.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${userDisplay}</span> <div class="score-bar-container" title="${userLabel}"><div style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`;
        if (conceptScoreValid && userScoreValid) {
            const diff = Math.abs(conceptScore - userScore);
            const elementNameDisplay = elementDetails[fullName]?.name || elName;
            if (conceptScore >= 7 && userScore >= 7) {
                highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true;
            } else if (conceptScore <= 3 && userScore <= 3) {
                highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true;
            } else if (diff >= 4) {
                highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept: ${conceptLabel}, You: ${userLabel})</p>`; hasHighlights = true;
            }
        }
    });
    if (!hasHighlights) {
        highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>';
    }
    highlightsContainer.innerHTML = highlightsHTML;
    detailsElement.open = false; // Start closed
    const nestedDetails = detailsElement.querySelector('.element-details');
    if(nestedDetails) nestedDetails.open = false; // Start nested closed too
}


// --- Remove Evolution Section ---
// export function displayEvolutionSection(...) { /* ... REMOVED ... */ }

// --- Update Button Status Functions ---
export function updateGrimoireButtonStatus(conceptId, inResearchNotes = false) { if (!addToGrimoireButton) return; const isDiscovered = State.getDiscoveredConcepts().has(conceptId); addToGrimoireButton.classList.toggle('hidden', isDiscovered); if (!isDiscovered) { addToGrimoireButton.disabled = false; addToGrimoireButton.textContent = "Add to Grimoire"; addToGrimoireButton.classList.remove('added'); } }
export function updateFocusButtonStatus(conceptId) {
    const markAsFocusButton = document.getElementById('markAsFocusButton'); // Get button locally if needed
    if (!markAsFocusButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
    const showButton = isDiscovered;
    markAsFocusButton.classList.toggle('hidden', !showButton);
    if (showButton) { markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus"; markAsFocusButton.disabled = (slotsFull && !isFocused); markAsFocusButton.classList.toggle('marked', isFocused); markAsFocusButton.title = markAsFocusButton.disabled && !isFocused ? `Focus slots full (${State.getFocusSlots()})` : (isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts"); }
}
export function updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes) {
    const popupActions = conceptDetailPopup?.querySelector('.popup-actions'); if (!popupActions || !conceptData) return;
    popupActions.querySelector('.popup-sell-button')?.remove();
    let context = 'none'; if (inGrimoire) context = 'grimoire'; else if (inResearchNotes) context = 'discovery';
    if (context !== 'none') {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[conceptData.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR; const sourceLocation = context === 'grimoire' ? 'Grimoire' : 'Research Notes'; const sellButton = document.createElement('button'); sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button', 'popup-sell-button'); sellButton.textContent = `Sell (${sellValue.toFixed(1)})`; sellButton.innerHTML += ` <i class="fas fa-brain insight-icon"></i>`; sellButton.dataset.conceptId = conceptId; sellButton.dataset.context = context; sellButton.title = `Sell from ${sourceLocation} for ${sellValue.toFixed(1)} Insight.`;
        const localMarkAsFocusButton = document.getElementById('markAsFocusButton');
        if (localMarkAsFocusButton && !localMarkAsFocusButton.classList.contains('hidden')) { localMarkAsFocusButton.insertAdjacentElement('afterend', sellButton); }
        else if (addToGrimoireButton && !addToGrimoireButton.classList.contains('hidden')) { addToGrimoireButton.insertAdjacentElement('afterend', sellButton); }
        else { popupActions.appendChild(sellButton); }
    }
}

// --- Reflection Modal UI ---
export function displayReflectionPrompt(promptData, context) { if (!reflectionModal || !promptData || !promptData.prompt) { console.error("Reflection modal or prompt data/text missing.", promptData); if (context === 'Dissonance') { const conceptId = GameLogic.getCurrentPopupConceptId(); if (conceptId) { console.warn("Reflection prompt missing for Dissonance, adding concept directly."); if (typeof GameLogic.addConceptToGrimoireInternal === 'function') { GameLogic.addConceptToGrimoireInternal(conceptId); hidePopups(); showTemporaryMessage("Reflection unavailable, concept added.", 3500); } else { console.error("addConceptToGrimoireInternal is not available!"); showTemporaryMessage("Critical Error: Cannot process reflection.", 4000); } } else { showTemporaryMessage("Error: Could not display reflection or find target concept.", 3000); } } else { showTemporaryMessage("Error: Could not display reflection.", 3000); } return; } const { title, category, prompt, showNudge, reward } = promptData; if (reflectionModalTitle) reflectionModalTitle.textContent = title || "Moment for Reflection"; if (reflectionElement) reflectionElement.textContent = category || "General"; if (reflectionPromptText) reflectionPromptText.textContent = prompt.text; if (reflectionCheckbox) reflectionCheckbox.checked = false; if (scoreNudgeCheckbox && scoreNudgeLabel) { scoreNudgeCheckbox.checked = false; scoreNudgeCheckbox.classList.toggle('hidden', !showNudge); scoreNudgeLabel.classList.toggle('hidden', !showNudge); } if (confirmReflectionButton) confirmReflectionButton.disabled = true; if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)}`; reflectionModal.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden'); }

// --- Integrated Element Deep Dive UI ---
export function displayElementDeepDive(elementKey, targetContainerElement) {
    if (!targetContainerElement) { targetContainerElement = personaElementDetailsDiv?.querySelector(`.element-deep-dive-container[data-element-key="${elementKey}"]`); if (!targetContainerElement) { console.error(`UI: Still could not find target container for element ${elementKey}`); return; } }
    const deepDiveData = elementDeepDive[elementKey] || []; const unlockedLevels = State.getState().unlockedDeepDiveLevels; const currentLevel = unlockedLevels[elementKey] || 0; const elementName = elementKeyToFullName[elementKey] || elementKey;
    const insight = State.getInsight();
    targetContainerElement.innerHTML = `<h5 class="deep-dive-section-title">${elementDetails[elementName]?.name || elementName} Insights</h5>`;
    if (deepDiveData.length === 0) { targetContainerElement.innerHTML += '<p>No deep dive content available.</p>'; return; }
    let displayedContent = false; deepDiveData.forEach(levelData => { if (levelData.level <= currentLevel) { targetContainerElement.innerHTML += `<div class="library-level"><h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5><div class="level-content">${levelData.content}</div></div><hr class="popup-hr">`; displayedContent = true; } });
    if (!displayedContent && currentLevel === 0) { targetContainerElement.innerHTML += '<p><i>Unlock the first level to begin exploring.</i></p>'; }
    else if (!displayedContent && currentLevel > 0) { targetContainerElement.innerHTML += '<p><i>Error displaying unlocked content. Check console.</i></p>'; }
    const nextLevel = currentLevel + 1; const nextLevelData = deepDiveData.find(l => l.level === nextLevel);
    if (nextLevelData) {
        const cost = nextLevelData.insightCost || 0; const canAfford = insight >= cost;
        const isDisabled = !canAfford;
        let buttonTitle = ''; let errorMsgHTML = '';
        if (!canAfford) { buttonTitle = `Requires ${cost} Insight`; errorMsgHTML = `<p class='unlock-error'>Insufficient Insight (${insight.toFixed(1)}/${cost})</p>`; }
        else { buttonTitle = `Unlock for ${cost} Insight`; }
        const buttonHTML = `<button class="button small-button unlock-button" data-element-key="${elementKey}" data-level="${nextLevelData.level}" ${isDisabled ? 'disabled' : ''} title="${buttonTitle.replace(/"/g, '&quot;')}"> Unlock (${cost} <i class="fas fa-brain insight-icon"></i>)</button>`;
        targetContainerElement.innerHTML += `<div class="library-unlock"><h5>Next: ${nextLevelData.title} (Level ${nextLevelData.level})</h5>${buttonHTML}${errorMsgHTML}</div>`;
    } else if (displayedContent) { const lastHr = targetContainerElement.querySelector('hr.popup-hr:last-of-type'); if (lastHr) lastHr.remove(); targetContainerElement.innerHTML += '<p class="all-unlocked-message"><i>All insights unlocked for this element.</i></p>'; }
}

// --- Repository UI ---
export function displayRepositoryContent() {
    const showRepository = State.getState().questionnaireCompleted;
    if (repositoryScreen) repositoryScreen.classList.toggle('hidden', !showRepository);
    if (!showRepository) return;
    if (!repositoryFocusUnlocksDiv || !repositoryScenesDiv || !repositoryExperimentsDiv || !repositoryInsightsDiv) { console.error("Repository list containers missing!"); return; } console.log("UI: Displaying Repository Content"); repositoryFocusUnlocksDiv.innerHTML = ''; repositoryScenesDiv.innerHTML = ''; repositoryExperimentsDiv.innerHTML = ''; repositoryInsightsDiv.innerHTML = ''; const repoItems = State.getRepositoryItems(); const unlockedFocusData = State.getUnlockedFocusItems(); const attunement = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight(); if (unlockedFocusData.size > 0) { unlockedFocusData.forEach(unlockId => { const unlockData = focusDrivenUnlocks.find(u => u.id === unlockId); if (unlockData?.unlocks) { const item = unlockData.unlocks; const div = document.createElement('div'); div.classList.add('repository-item', 'focus-unlock-item'); let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`; if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`; if (item.type === 'insightFragment') { const iData = elementalInsights.find(i => i.id === item.id); itemHTML += `<p><em>"${iData?.text || item.text || "..."}"</em></p>`; } else itemHTML += `<p>Details below.</p>`; div.innerHTML = itemHTML; repositoryFocusUnlocksDiv.appendChild(div); } }); } else { repositoryFocusUnlocksDiv.innerHTML = '<p>Focus on synergistic Concepts on the Persona screen to unlock items.</p>'; } if (repoItems.scenes.size > 0) { repoItems.scenes.forEach(sceneId => { const scene = sceneBlueprints.find(s => s.id === sceneId); if (scene) { const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST; const canAfford = insight >= cost; repositoryScenesDiv.appendChild(renderRepositoryItem(scene, 'scene', cost, canAfford)); } else { console.warn(`Scene ID ${sceneId} not found.`); } }); } else { repositoryScenesDiv.innerHTML = '<p>No Scene Blueprints discovered. Try using "Suggest Scenes".</p>'; } let experimentsDisplayed = 0; alchemicalExperiments.forEach(exp => { const isUnlockedByAttunement = attunement[exp.requiredElement] >= exp.requiredAttunement; const alreadyCompleted = repoItems.experiments.has(exp.id); if (isUnlockedByAttunement) { let canAttempt = true; let unmetReqs = []; if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } } if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let met = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { met = true; break; } } if (!met) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } } const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST; const canAfford = insight >= cost; if (!canAfford) unmetReqs.push("Insight"); repositoryExperimentsDiv.appendChild(renderRepositoryItem(exp, 'experiment', cost, canAfford && canAttempt && !alreadyCompleted, alreadyCompleted, unmetReqs)); experimentsDisplayed++; } }); if (experimentsDisplayed === 0) { repositoryExperimentsDiv.innerHTML = '<p>Increase Element Attunement to unlock Experiments.</p>'; } if (repoItems.insights.size > 0) { const insightsByElement = {}; elementNames.forEach(elName => insightsByElement[elementNameToKey[elName]] = []); repoItems.insights.forEach(insightId => { const insightData = elementalInsights.find(i => i.id === insightId); if (insightData) { if (!insightsByElement[insightData.element]) insightsByElement[insightData.element] = []; insightsByElement[insightData.element].push(insightData); } else { console.warn(`Insight ID ${insightId} not found.`); } }); let insightsHTML = ''; elementNames.forEach(elName => { const key = elementNameToKey[elName]; if (insightsByElement[key] && insightsByElement[key].length > 0) { insightsHTML += `<h5>${elementDetails[elName]?.name || elName} Insights:</h5><ul>`; insightsByElement[key].sort((a, b) => a.id.localeCompare(b.id)).forEach(insight => { insightsHTML += `<li>"${insight.text}"</li>`; }); insightsHTML += `</ul>`; } }); repositoryInsightsDiv.innerHTML = insightsHTML || '<p>No Elemental Insights collected.</p>'; } else { repositoryInsightsDiv.innerHTML = '<p>No Elemental Insights collected. Found occasionally during Research.</p>'; } displayMilestones(); GameLogic.updateMilestoneProgress('repositoryContents', null);
}
export function renderRepositoryItem(item, type, cost, canDoAction, completed = false, unmetReqs = []) { const div = document.createElement('div'); div.classList.add('repository-item', `repo-item-${type}`); if (completed) div.classList.add('completed'); let actionsHTML = ''; let buttonDisabled = !canDoAction; let buttonTitle = ''; let buttonText = ''; if (type === 'scene') { buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (!canDoAction) buttonTitle = `Requires ${cost} Insight`; else buttonTitle = `Meditate on ${item.name}`; actionsHTML = `<button class="button small-button" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`; } else if (type === 'experiment') { buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (completed) { buttonTitle = "Experiment Completed"; buttonDisabled = true; } else if (!canDoAction && unmetReqs.includes("Insight")) { buttonTitle = `Requires ${cost} Insight`; buttonDisabled = true; } else if (!canDoAction && unmetReqs.length > 0) { buttonTitle = `Requires Focus: ${unmetReqs.join(', ')}`; buttonDisabled = true; } else { buttonTitle = `Attempt ${item.name}`; buttonDisabled = false;} actionsHTML = `<button class="button small-button" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`; if (completed) actionsHTML += ` <span class="completed-text">(Completed)</span>`; else if (!canDoAction && unmetReqs.includes("Insight")) actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`; else if (!canDoAction && unmetReqs.length > 0) actionsHTML += ` <small class="req-missing">(Requires Focus: ${unmetReqs.join(', ')})</small>`; } div.innerHTML = `<h4>${item.name} ${type === 'experiment' ? `(Req: ${item.requiredAttunement} ${elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4><p>${item.description}</p><div class="repo-actions">${actionsHTML}</div>`; return div; }

// --- Milestones UI ---
export function displayMilestones() { if (!milestonesDisplay) return; milestonesDisplay.innerHTML = ''; const achieved = State.getState().achievedMilestones; if (achieved.size === 0) { milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>'; return; } const achievedMilestonesData = milestones.filter(m => achieved.has(m.id)); achievedMilestonesData.forEach(milestone => { const li = document.createElement('li'); li.textContent = `✓ ${milestone.description}`; milestonesDisplay.appendChild(li); }); }

// --- Settings Popup UI ---
export function showSettings() { if (settingsPopup) settingsPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden'); }

// --- Tapestry Deep Dive / Synergy Modal UI ---
export function displayTapestryDeepDive(analysisData) { if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveNarrativeP || !deepDiveFocusIcons || !deepDiveAnalysisNodes || !deepDiveDetailContent || !deepDiveTitle) { console.error("Deep Dive Modal elements missing!"); showTemporaryMessage("Error opening Deep Dive.", 3000); return; } console.log("UI: displayTapestryDeepDive called with analysis:", analysisData); deepDiveTitle.textContent = "Tapestry Deep Dive"; deepDiveAnalysisNodes.classList.remove('hidden'); deepDiveNarrativeP.parentElement.classList.remove('hidden'); deepDiveNarrativeP.innerHTML = analysisData.fullNarrativeHTML || "Could not generate narrative."; deepDiveFocusIcons.innerHTML = ''; const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts(); focused.forEach(id => { const concept = discovered.get(id)?.concept; if (concept) { let iconClass = Utils.getElementIcon("Default"); let iconColor = '#CCCCCC'; let iconTitle = concept.name; if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) { const fullElementName = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); iconTitle = `${concept.name} (${elementDetails[fullElementName]?.name || fullElementName})`; } else { console.warn(`Concept ${concept.name} missing valid primaryElement for deep dive icon.`); iconClass = Utils.getCardTypeIcon(concept.cardType); } const icon = document.createElement('i'); icon.className = `${iconClass}`; icon.style.color = iconColor; icon.title = iconTitle; deepDiveFocusIcons.appendChild(icon); } }); if (deepDiveDetailContent) deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>'; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active')); updateContemplationButtonState(); tapestryDeepDiveModal.classList.remove('hidden'); popupOverlay.classList.remove('hidden'); }
export function displaySynergyTensionInfo(analysisData) { if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveNarrativeP || !deepDiveFocusIcons || !deepDiveAnalysisNodes || !deepDiveDetailContent || !deepDiveTitle) { console.error("Deep Dive Modal elements missing for Synergy/Tension display!"); showTemporaryMessage("Error showing synergy details.", 3000); return; } console.log("UI: Displaying Synergy/Tension info"); deepDiveTitle.textContent = "Synergy & Tension Analysis"; deepDiveNarrativeP.parentElement.classList.add('hidden'); deepDiveAnalysisNodes.classList.add('hidden'); deepDiveFocusIcons.innerHTML = ''; const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts(); focused.forEach(id => { const concept = discovered.get(id)?.concept; if (concept) { let iconClass = Utils.getElementIcon("Default"); let iconColor = '#CCCCCC'; let iconTitle = concept.name; if (concept.primaryElement && elementKeyToFullName && elementKeyToFullName[concept.primaryElement]) { const fullElementName = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(fullElementName); iconColor = Utils.getElementColor(fullElementName); iconTitle = `${concept.name} (${elementDetails[fullElementName]?.name || fullElementName})`; } else { console.warn(`Concept ${concept.name} missing valid primaryElement for deep dive icon.`); iconClass = Utils.getCardTypeIcon(concept.cardType); } const icon = document.createElement('i'); icon.className = `${iconClass}`; icon.style.color = iconColor; icon.title = iconTitle; deepDiveFocusIcons.appendChild(icon); } }); let content = ''; if (analysisData.synergies.length > 0) { content += `<h4>Synergies:</h4><ul>${analysisData.synergies.map(s => `<li>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul><hr class="popup-hr">`; } else { content += `<p><em>No direct synergies detected between focused concepts.</em></p><hr class="popup-hr">`; } if (analysisData.tensions.length > 0) { content += `<h4>Tensions:</h4><ul>${analysisData.tensions.map(t => `<li>${t.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; } else { content += `<p><em>No significant elemental tensions detected within the focus.</em></p>`; } if (deepDiveDetailContent) deepDiveDetailContent.innerHTML = content; tapestryDeepDiveModal.classList.remove('hidden'); popupOverlay.classList.remove('hidden'); }
export function updateContemplationButtonState() { if (!contemplationNodeButton) return; const cooldownEnd = State.getContemplationCooldownEnd(); const now = Date.now(); const insight = State.getInsight(); const cost = Config.CONTEMPLATION_COST; let disabled = false; let title = `Contemplate your focus (${cost} Insight)`; let text = `Contemplate (${cost} <i class="fas fa-brain insight-icon"></i>)`; if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); disabled = true; title = `Contemplation available in ${remaining}s`; text = `On Cooldown (${remaining}s)`; } else if (insight < cost) { disabled = true; title = `Requires ${cost} Insight`; } contemplationNodeButton.disabled = disabled; contemplationNodeButton.title = title; contemplationNodeButton.innerHTML = text; }
export function updateDeepDiveContent(htmlContent, nodeId) { if (!deepDiveDetailContent) return; console.log(`UI: Updating deep dive content for node: ${nodeId}`); deepDiveDetailContent.innerHTML = htmlContent; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.toggle('active', btn.dataset.nodeId === nodeId); }); }
export function displayContemplationTask(task) { if (!deepDiveDetailContent || !task) return; console.log("UI: Displaying contemplation task:", task); let html = `<h4>Contemplation Task</h4><p>${task.text}</p>`; if (task.requiresCompletionButton) { const rewardText = task.reward.type === 'insight' ? `<i class="fas fa-brain insight-icon"></i>` : 'Attun.'; html += `<button id="completeContemplationBtn" class="button small-button">Mark Complete (+${task.reward.amount} ${rewardText})</button>`; } deepDiveDetailContent.innerHTML = html; const completeBtn = document.getElementById('completeContemplationBtn'); if (completeBtn) { completeBtn.addEventListener('click', () => { GameLogic.handleCompleteContemplation(task); }, { once: true }); } deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.toggle('active', btn.id === 'contemplationNode'); }); }
export function clearContemplationTask() { if (deepDiveDetailContent) { deepDiveDetailContent.innerHTML = '<p>Contemplation acknowledged.</p>'; setTimeout(() => { if (deepDiveDetailContent && deepDiveDetailContent.innerHTML === '<p>Contemplation acknowledged.</p>') { deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>'; deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => { btn.classList.remove('active'); }); } }, 1500); } updateContemplationButtonState(); }
export function updateTapestryDeepDiveButton() { const btn = document.getElementById('exploreTapestryButton'); if (btn) { const hasFocus = State.getFocusedConcepts().size > 0; btn.disabled = !hasFocus; btn.title = !hasFocus ? "Focus on concepts first..." : "Explore a deeper analysis..."; } else { console.warn("UI: updateTapestryDeepDiveButton - Button not found!"); } }
export function updateExploreSynergyButtonStatus(status) { if (!exploreSynergyButton) return; const hasFocus = State.getFocusedConcepts().size >= 2; exploreSynergyButton.disabled = !hasFocus; exploreSynergyButton.classList.remove('highlight-synergy', 'highlight-tension'); if (!hasFocus) { exploreSynergyButton.title = "Focus at least 2 concepts"; exploreSynergyButton.textContent = "Explore Synergy"; } else { exploreSynergyButton.title = "Explore synergies and tensions between focused concepts"; exploreSynergyButton.textContent = "Explore Synergy"; if (status === 'synergy') { exploreSynergyButton.classList.add('highlight-synergy'); exploreSynergyButton.title += " (Synergy detected!)"; exploreSynergyButton.textContent = "Explore Synergy ✨"; } else if (status === 'tension') { exploreSynergyButton.classList.add('highlight-tension'); exploreSynergyButton.title += " (Tension detected!)"; exploreSynergyButton.textContent = "Explore Synergy ⚡"; } else if (status === 'both') { exploreSynergyButton.classList.add('highlight-synergy', 'highlight-tension'); exploreSynergyButton.title += " (Synergy & Tension detected!)"; exploreSynergyButton.textContent = "Explore Synergy 💥"; } } }

// --- Suggest Scene Button UI ---
export function updateSuggestSceneButtonState() { if (!suggestSceneButton) return; const hasFocus = State.getFocusedConcepts().size > 0; const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST; suggestSceneButton.disabled = !hasFocus || !canAfford; if (!hasFocus) suggestSceneButton.title = "Focus on concepts first"; else if (!canAfford) suggestSceneButton.title = `Requires ${Config.SCENE_SUGGESTION_COST} Insight`; else suggestSceneButton.title = `Suggest resonant scenes (${Config.SCENE_SUGGESTION_COST} Insight)`; if(sceneSuggestCostDisplay) sceneSuggestCostDisplay.textContent = Config.SCENE_SUGGESTION_COST; }

// --- Display Research Status ---
export function displayResearchStatus(message) { showTemporaryMessage(message, 2000); }

// --- Initial UI Setup Helper ---
export function setupInitialUI() {
    console.log("UI: Setting up initial UI state (No Phases)");
    if(mainNavBar) mainNavBar.classList.add('hidden');
    showScreen('welcomeScreen');
    const loadBtn = document.getElementById('loadButton');
    if (loadBtn) loadBtn.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY));
    else console.warn("Load button element not found during initial setup.");
    updateSuggestSceneButtonState();
    updateTapestryDeepDiveButton();
    updateExploreSynergyButtonStatus('none');
}

console.log("ui.js loaded.");
