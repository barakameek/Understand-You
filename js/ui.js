// js/ui.js - Handles DOM Manipulation and UI Updates
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js'; // Needed for button actions in popups etc.
import { elementDetails, elementKeyToFullName, elementNameToKey, concepts, questionnaireGuided, reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals, sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks, cardTypeKeys, elementNames } from '../data.js'; // Import all necessary data

console.log("ui.js loading...");

// --- DOM Element References ---
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
const personaScreen = document.getElementById('personaScreen');
const personaDetailedView = document.getElementById('personaDetailedView');
const personaSummaryView = document.getElementById('personaSummaryView');
const showDetailedViewBtn = document.getElementById('showDetailedViewBtn');
const showSummaryViewBtn = document.getElementById('showSummaryViewBtn');
const personaElementDetailsDiv = document.getElementById('personaElementDetails');
const userInsightDisplayPersona = document.getElementById('userInsightDisplayPersona');
const focusedConceptsDisplay = document.getElementById('focusedConceptsDisplay');
const focusedConceptsHeader = document.getElementById('focusedConceptsHeader');
const focusResonanceBarsContainer = document.getElementById('focusResonanceBars');
const tapestryNarrativeP = document.getElementById('tapestryNarrative');
const personaThemesList = document.getElementById('personaThemesList');
const summaryContentDiv = document.getElementById('summaryContent');
const elementLibraryDiv = document.getElementById('elementLibrary');
const elementLibraryButtonsDiv = document.getElementById('elementLibraryButtons');
const elementLibraryContentDiv = document.getElementById('elementLibraryContent');
const studyScreen = document.getElementById('studyScreen');
const userInsightDisplayStudy = document.getElementById('userInsightDisplayStudy');
const researchButtonContainer = document.getElementById('researchButtonContainer');
const freeResearchButton = document.getElementById('freeResearchButton');
const seekGuidanceButton = document.getElementById('seekGuidanceButton');
const researchStatus = document.getElementById('researchStatus');
const researchOutput = document.getElementById('researchOutput');
const dailyRitualsDisplay = document.getElementById('dailyRitualsDisplay');
const guidedReflectionCostDisplay = document.getElementById('guidedReflectionCostDisplay');
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const grimoireControls = document.getElementById('grimoireControls');
const grimoireFilterControls = grimoireControls?.querySelector('.filter-controls');
const grimoireTypeFilter = document.getElementById('grimoireTypeFilter');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireRarityFilter = document.getElementById('grimoireRarityFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireContentDiv = document.getElementById('grimoireContent');
const repositoryScreen = document.getElementById('repositoryScreen');
const repositoryFocusUnlocksDiv = document.getElementById('repositoryFocusUnlocks')?.querySelector('.repo-list');
const repositoryScenesDiv = document.getElementById('repositoryScenes')?.querySelector('.repo-list');
const repositoryExperimentsDiv = document.getElementById('repositoryExperiments')?.querySelector('.repo-list');
const repositoryInsightsDiv = document.getElementById('repositoryInsights')?.querySelector('.repo-list');
const milestonesDisplay = document.getElementById('milestonesDisplay');
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupCardTypeIcon = document.getElementById('popupCardTypeIcon');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupVisualContainer = document.getElementById('popupVisualContainer');
const popupDetailedDescription = document.getElementById('popupDetailedDescription');
const popupResonanceSummary = document.getElementById('popupResonanceSummary');
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const popupRelatedConcepts = document.getElementById('popupRelatedConcepts');
const myNotesSection = document.getElementById('myNotesSection');
const myNotesTextarea = document.getElementById('myNotesTextarea');
const saveMyNoteButton = document.getElementById('saveMyNoteButton');
const noteSaveStatusSpan = document.getElementById('noteSaveStatus');
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
const markAsFocusButton = document.getElementById('markAsFocusButton');
const popupEvolutionSection = document.getElementById('popupEvolutionSection');
const evolveArtButton = document.getElementById('evolveArtButton');
const evolveCostSpan = document.getElementById('evolveCost');
const evolveEligibility = document.getElementById('evolveEligibility');
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
const exploreTapestryButton = document.getElementById('exploreTapestryButton'); // Reference for enable/disable

// *** ADD References for Deep Dive Modal ***
const tapestryDeepDiveModal = document.getElementById('tapestryDeepDiveModal');
const closeDeepDiveButton = document.getElementById('closeDeepDiveButton'); // Listener added in main.js
const deepDiveFocusIcons = document.getElementById('deepDiveFocusIcons');
const deepDiveNarrativeP = document.getElementById('deepDiveNarrative');
const deepDiveAnalysisNodes = document.getElementById('deepDiveAnalysisNodes'); // Container for delegation
const deepDiveDetailContent = document.getElementById('deepDiveDetailContent');
const contemplationNodeButton = document.getElementById('contemplationNode'); // Specific button for cost/cooldown

// --- Utility UI Functions ---
let toastTimeout = null;
export function showTemporaryMessage(message, duration = 3000) {
    if (!toastElement || !toastMessageElement) { console.warn("Toast elements missing:", message); return; }
    console.info(`Toast: ${message}`);
    toastMessageElement.textContent = message;
    if (toastTimeout) { clearTimeout(toastTimeout); }
    toastElement.classList.remove('hidden', 'visible');
    void toastElement.offsetWidth; // Trigger reflow needed for animation restart
    toastElement.classList.add('visible');
    toastElement.classList.remove('hidden');

    toastTimeout = setTimeout(() => {
        toastElement.classList.remove('visible');
         // Add a slight delay before adding hidden class for fade-out transition
         setTimeout(() => { if (!toastElement.classList.contains('visible')) { toastElement.classList.add('hidden'); } }, 500);
        toastTimeout = null;
    }, duration);
}

let milestoneTimeout = null;
export function showMilestoneAlert(text) {
    if (!milestoneAlert || !milestoneAlertText) return;
    milestoneAlertText.textContent = `Milestone: ${text}`;
    milestoneAlert.classList.remove('hidden');
    if (milestoneTimeout) clearTimeout(milestoneTimeout);
    milestoneTimeout = setTimeout(hideMilestoneAlert, 5000);
}

export function hideMilestoneAlert() {
    if (milestoneAlert) milestoneAlert.classList.add('hidden');
    if (milestoneTimeout) clearTimeout(milestoneTimeout);
    milestoneTimeout = null;
}

// Modify hidePopups to include the deep dive modal
export function hidePopups() {
    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (settingsPopup) settingsPopup.classList.add('hidden');
    if (tapestryDeepDiveModal) tapestryDeepDiveModal.classList.add('hidden'); // *** ADD THIS LINE ***
    if (popupOverlay) popupOverlay.classList.add('hidden');
    GameLogic.clearPopupState(); // Clear temp state associated with popups
}

// --- Screen Management ---
export function showScreen(screenId) {
    console.log("UI: Showing screen:", screenId);
    const currentState = State.getState();
    const isPostQuestionnaire = currentState.questionnaireCompleted;

    screens.forEach(screen => {
        screen?.classList.toggle('current', screen.id === screenId);
        screen?.classList.toggle('hidden', screen.id !== screenId);
    });

    if (mainNavBar) {
        mainNavBar.classList.toggle('hidden', !isPostQuestionnaire || screenId === 'welcomeScreen' || screenId === 'questionnaireScreen');
    }
    navButtons.forEach(button => {
        if(button) button.classList.toggle('active', button.dataset.target === screenId);
    });

    // Refresh data on screen load *if* past questionnaire
    if (isPostQuestionnaire) {
        // Use the logic wrappers to ensure dependent calculations happen first
        if (screenId === 'personaScreen') GameLogic.displayPersonaScreenLogic();
        else if (screenId === 'studyScreen') GameLogic.displayStudyScreenLogic();
        // Grimoire and Repo can be refreshed directly by UI if needed, or have wrappers too
        else if (screenId === 'grimoireScreen') refreshGrimoireDisplay();
        else if (screenId === 'repositoryScreen') displayRepositoryContent();
    }

    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen', 'studyScreen', 'repositoryScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
}


// --- Onboarding UI Adjustments ---
export function applyOnboardingPhaseUI(phase) {
    console.log(`UI: Applying onboarding phase ${phase}`);
    const isPhase1 = phase >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const isPhase2 = phase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    const isPhase3 = phase >= Config.ONBOARDING_PHASE.REFLECTION_RITUALS;
    const isPhase4 = phase >= Config.ONBOARDING_PHASE.ADVANCED;

    // --- Nav Bar ---
    navButtons.forEach(button => {
        if (!button) return;
        const target = button.dataset.target;
        let hide = false;
        if (target === 'studyScreen' && !isPhase2) hide = true;
        else if (target === 'repositoryScreen' && !isPhase4) hide = true;
        button.classList.toggle('hidden-by-flow', hide);
    });

    // --- Persona Screen ---
    if (elementLibraryDiv) elementLibraryDiv.classList.toggle('hidden-by-flow', !isPhase4);
    // Hide explore tapestry button in early phases
    if (exploreTapestryButton) exploreTapestryButton.classList.toggle('hidden-by-flow', !isPhase1); // Show once focus is possible

    // --- Grimoire Screen ---
    if (grimoireFilterControls) grimoireFilterControls.classList.toggle('hidden-by-flow', !isPhase2);
    // Focus button visibility on popup is handled by updateFocusButtonStatus

    // --- Study Screen ---
    if (seekGuidanceButton) seekGuidanceButton.classList.toggle('hidden-by-flow', !isPhase3);
    const ritualsSection = studyScreen?.querySelector('.rituals-section');
    if (ritualsSection) ritualsSection.classList.toggle('hidden-by-flow', !isPhase3);

    // --- Concept Popup ---
    // Note: Visibility based on *current* phase, actual display depends on context (inGrimoire etc)
    if (myNotesSection) myNotesSection.classList.toggle('hidden', !isPhase2 || !State.getDiscoveredConceptData(GameLogic.getCurrentPopupConceptId()));
    if (popupEvolutionSection) popupEvolutionSection.classList.toggle('hidden', !isPhase4 || !State.getDiscoveredConceptData(GameLogic.getCurrentPopupConceptId()));


     // Update popup buttons if open, as phase change might affect them
     const popupConceptId = GameLogic.getCurrentPopupConceptId();
     if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
          updateFocusButtonStatus(popupConceptId);
          const discoveredData = State.getDiscoveredConceptData(popupConceptId);
          const concept = concepts.find(c => c.id === popupConceptId);
          const inResearch = !discoveredData && researchOutput?.querySelector(`.research-result-item[data-concept-id="${popupConceptId}"]`);
          updateGrimoireButtonStatus(popupConceptId, !!inResearch);
          updatePopupSellButton(popupConceptId, concept, !!discoveredData, !!inResearch);
          if(concept && discoveredData) displayEvolutionSection(concept, discoveredData);
          // Re-apply hidden class based on phase for notes/evolution within popup
          if (myNotesSection) myNotesSection.classList.toggle('hidden', !isPhase2 || !discoveredData);
          if (popupEvolutionSection) popupEvolutionSection.classList.toggle('hidden', !isPhase4 || !discoveredData || !concept?.canUnlockArt || discoveredData?.artUnlocked);
     }
}


// --- Insight Display ---
export function updateInsightDisplays() {
    const insight = State.getInsight().toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = insight;
    displayResearchButtons(); // Update research buttons based on cost/insight
    if (seekGuidanceButton) seekGuidanceButton.disabled = State.getInsight() < Config.GUIDED_REFLECTION_COST;
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
    // Update library costs if library is visible and an element is selected
    if (elementLibraryContentDiv && !elementLibraryDiv?.classList.contains('hidden-by-flow') && elementLibraryContentDiv.dataset.selectedElement) {
        displayElementDeepDive(elementLibraryContentDiv.dataset.selectedElement);
    }
     // Update experiment costs if repository is visible
     if (repositoryScreen && repositoryScreen.classList.contains('current')) {
          displayRepositoryContent(); // Re-rendering repo handles button states
     }
     // Update evolve button if popup is visible
     const popupConceptId = GameLogic.getCurrentPopupConceptId();
      if (popupConceptId !== null && conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) {
            const concept = concepts.find(c => c.id === popupConceptId);
            const discoveredData = State.getDiscoveredConceptData(popupConceptId);
            if(concept && discoveredData) displayEvolutionSection(concept, discoveredData);
      }
      // Update contemplation button cost/state if modal were open (or handle on modal open)
      // updateContemplationButtonState(); // Add this if needed
}

// --- Questionnaire UI ---
export function initializeQuestionnaireUI() {
    updateElementProgressHeader(-1); // Show all tabs initially
    displayElementQuestions(0); // Display first element's questions
    if (mainNavBar) mainNavBar.classList.add('hidden'); // Hide main nav during questionnaire
    if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; // Hide dynamic feedback initially
}

export function updateElementProgressHeader(activeIndex) {
    if (!elementProgressHeader) return;
    elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div');
        tab.classList.add('element-tab');
        const elementData = elementDetails[name] || {};
        tab.textContent = elementData.name || name;
        tab.title = elementData.name || name;
        tab.classList.toggle('completed', index < activeIndex);
        tab.classList.toggle('active', index === activeIndex);
        elementProgressHeader.appendChild(tab);
    });
}

export function displayElementQuestions(index) {
    const currentState = State.getState(); // Get latest state for answers
    if (index >= elementNames.length) {
        GameLogic.finalizeQuestionnaire(); return; // Exit if questionnaire finished
    }
    const elementName = elementNames[index];
    const elementData = elementDetails[elementName] || {};
    const questions = questionnaireGuided[elementName] || [];
    if (!questionContent) { console.error("questionContent element missing!"); return; }

    // Create intro block
    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    questionContent.innerHTML = introHTML; // Set intro first
    const elementAnswers = currentState.userAnswers?.[elementName] || {}; // Get saved answers for this element
    let questionsHTML = '';

    // Build HTML for each question
    questions.forEach(q => {
        let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
        const savedAnswer = elementAnswers[q.qId]; // Use potentially saved answer

        if (q.type === "slider") {
            const val = savedAnswer !== undefined ? savedAnswer : q.defaultValue;
            inputHTML += `<div class="slider-container"><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${val}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(val).toFixed(1)}</span></p><p class="slider-feedback" id="feedback_${q.qId}"></p></div>`;
        } else if (q.type === "radio") {
            inputHTML += `<div class="radio-options">`;
            q.options.forEach(opt => { const checked = savedAnswer === opt.value ? 'checked' : ''; inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; });
            inputHTML += `</div>`;
        } else if (q.type === "checkbox") {
            inputHTML += `<div class="checkbox-options">`;
            q.options.forEach(opt => { const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : ''; inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`; });
            inputHTML += `</div>`;
        }
        inputHTML += `</div></div>`; questionsHTML += inputHTML;
    });
    if(questions.length === 0) questionsHTML = '<p><em>(No questions for this element)</em></p>';

    // Insert question HTML after the intro block
    const introDiv = questionContent.querySelector('.element-intro');
    if (introDiv) introDiv.insertAdjacentHTML('afterend', questionsHTML);
    else questionContent.innerHTML += questionsHTML; // Fallback if intro div not found

    // Add event listeners (ensure they call GameLogic)
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange); // Prevent duplicates
        input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
    });
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.removeEventListener('change', GameLogic.handleCheckboxChange); // Prevent duplicates
        checkbox.addEventListener('change', GameLogic.handleCheckboxChange);
    });
    questionContent.querySelectorAll('.slider.q-input').forEach(slider => { updateSliderFeedbackText(slider); }); // Update slider text initially

    // Update header/footer UI elements
    updateElementProgressHeader(index);
    if (progressText) progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || elementName}`;
    updateDynamicFeedback(elementName, elementAnswers); // Show feedback for current state
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block';
    if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}

export function updateSliderFeedbackText(sliderElement) {
    if (!sliderElement || sliderElement.type !== 'range') return;
    const qId = sliderElement.dataset.questionId;
    const feedbackElement = document.getElementById(`feedback_${qId}`);
    if (!feedbackElement) return;
    const currentValue = parseFloat(sliderElement.value);
    const display = document.getElementById(`display_${qId}`);
    if(display) display.textContent = currentValue.toFixed(1); // Update the displayed value

    // Find the currently active element name to get the correct interpretations
    const activeTab = elementProgressHeader?.querySelector('.element-tab.active');
    // Find element name based on tab text content (more robust than index if structure changes)
    let currentElementName = null;
    if (activeTab) {
        currentElementName = elementNames.find(name => (elementDetails[name]?.name || name) === activeTab.textContent);
    }
    // Fallback using current index if tab isn't found (shouldn't happen)
    if (!currentElementName) {
        const currentIndex = State.getState().currentElementIndex;
        if (currentIndex >= 0 && currentIndex < elementNames.length) {
             currentElementName = elementNames[currentIndex];
        }
    }

    if (!currentElementName) {
         feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`;
         return;
    } // Bail if element name cannot be determined

    const interpretations = elementDetails?.[currentElementName]?.scoreInterpretations;
    if (!interpretations) { feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; return; }
    const scoreLabel = Utils.getScoreLabel(currentValue);
    const interpretationText = interpretations[scoreLabel] || `Interpretation for "${scoreLabel}" not found.`;
    feedbackElement.textContent = interpretationText;
    feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`;
}

export function updateDynamicFeedback(elementName, currentAnswers) {
     const elementData = elementDetails?.[elementName];
     if (!elementData || !dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) {
        if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; // Hide if elements are missing
        return;
     }
     const tempScore = GameLogic.calculateElementScore(elementName, currentAnswers);
     const scoreLabel = Utils.getScoreLabel(tempScore);
     feedbackElementSpan.textContent = elementData.name || elementName;
     feedbackScoreSpan.textContent = tempScore.toFixed(1);
     let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
     // Create the span if it doesn't exist and parent exists
     if(!labelSpan && feedbackScoreSpan?.parentNode) {
         labelSpan = document.createElement('span');
         labelSpan.classList.add('score-label');
         feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling);
     }
     if (labelSpan) labelSpan.textContent = ` (${scoreLabel})`; // Add space before label
     feedbackScoreBar.style.width = `${tempScore * 10}%`;
     dynamicScoreFeedback.style.display = 'block'; // Ensure it's visible
}

export function getQuestionnaireAnswers() {
     const answers = {};
     const inputs = questionContent?.querySelectorAll('.q-input');
     if (!inputs) return answers;
     inputs.forEach(input => {
         const qId = input.dataset.questionId; const type = input.dataset.type; if (!qId) return;
         if (type === 'slider') answers[qId] = parseFloat(input.value);
         else if (type === 'radio') { if (input.checked) answers[qId] = input.value; }
         else if (type === 'checkbox') { if (!answers[qId]) answers[qId] = []; if (input.checked) answers[qId].push(input.value); }
     });
     return answers;
}

// --- Persona Screen UI ---
export function displayPersonaScreen() {
    if (!personaElementDetailsDiv) { console.error("Persona element details div not found!"); return; }
    console.log("UI: Displaying Persona Screen");
    personaElementDetailsDiv.innerHTML = ''; // Clear previous details
    const scores = State.getScores();

    elementNames.forEach(elementName => {
        const key = elementNameToKey[elementName];
        const score = scores[key] !== undefined ? scores[key] : 5; // Default score if missing
        const scoreLabel = Utils.getScoreLabel(score);
        const elementData = elementDetails[elementName] || {};
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A";
        const barWidth = score ? (score / 10) * 100 : 0;
        const color = Utils.getElementColor(elementName);
        const details = document.createElement('details');
        details.classList.add('element-detail-entry'); details.dataset.elementKey = key; details.style.setProperty('--element-color', color);
        details.innerHTML = `
            <summary class="element-detail-header">
                <div>
                    <strong>${elementData.name || elementName}:</strong>
                    <span>${score?.toFixed(1) ?? '?'}</span>
                    <span class="score-label">(${scoreLabel})</span>
                </div>
                <div class="score-bar-container">
                    <div style="width: ${barWidth}%; background-color: ${color};"></div>
                </div>
            </summary>
            <div class="element-description">
                <p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p>
                <p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p>
                <hr>
                <p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p>
                <p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>
            </div>`;
        personaElementDetailsDiv.appendChild(details);
    });
    displayElementAttunement(); // Display attunement below element details
    updateInsightDisplays();
    displayFocusedConceptsPersona();
    updateFocusElementalResonance();
    generateTapestryNarrative(); // Calls GameLogic, which then calls back here to update P tag
    synthesizeAndDisplayThemesPersona();
    displayElementLibrary(); // Display library section
    displayPersonaSummary(); // Update summary view content
    applyOnboardingPhaseUI(State.getOnboardingPhase()); // Ensure UI elements match phase
    updateTapestryDeepDiveButton(); // Ensure button state is correct
}

export function displayElementAttunement() {
    // Check if the target container exists and has children to modify
    if (!personaElementDetailsDiv || personaElementDetailsDiv.children.length === 0) {
        // console.log("Skipping attunement display: Persona details not rendered yet.");
        return; // Exit if the target divs aren't populated
    }

    const attunement = State.getAttunement();
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const attunementValue = attunement[key] || 0; const percentage = (attunementValue / Config.MAX_ATTUNEMENT) * 100; const color = Utils.getElementColor(elName);
        const targetDetails = personaElementDetailsDiv.querySelector(`.element-detail-entry[data-element-key="${key}"]`);
        if (targetDetails) {
            let descriptionDiv = targetDetails.querySelector('.element-description');
            if (descriptionDiv) {
                // Remove previous attunement display if exists
                descriptionDiv.querySelector('.attunement-display')?.remove();
                descriptionDiv.querySelector('.attunement-hr')?.remove(); // Remove old hr too

                const hr = document.createElement('hr'); hr.className = 'attunement-hr'; descriptionDiv.appendChild(hr);
                const attunementDiv = document.createElement('div'); attunementDiv.classList.add('attunement-display');
                attunementDiv.innerHTML = `
                    <div class="attunement-item">
                        <span class="attunement-name">Attunement:</span>
                        <div class="attunement-bar-container" title="Current Attunement: ${attunementValue.toFixed(1)} / ${Config.MAX_ATTUNEMENT}">
                            <div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div>
                        </div>
                         <i class="fas fa-info-circle info-icon" title="Attunement reflects your affinity and experience with this Element. It grows through related actions like Research, Reflection, and focusing on relevant Concepts. High Attunement may unlock Experiments or reduce Research costs."></i>
                    </div>`;
                descriptionDiv.appendChild(attunementDiv);
            } else { console.warn(`Element description div not found for key ${key}`); }
        } else { /* console.warn(`Element detail entry not found for key ${key}`); */ } // Silence warning as it can fire before elements are fully rendered
    });
}

export function updateFocusSlotsDisplay() {
    const focused = State.getFocusedConcepts(); const totalSlots = State.getFocusSlots();
    if (focusedConceptsHeader) {
        focusedConceptsHeader.textContent = `Focused Concepts (${focused.size} / ${totalSlots})`;
        const icon = focusedConceptsHeader.querySelector('.info-icon');
        if(icon) icon.title = `The number of Concepts currently marked as Focus out of your total available slots (${totalSlots}). Slots can be increased via Milestones.`;
    }
}

export function displayFocusedConceptsPersona() {
    if (!focusedConceptsDisplay) return;
    focusedConceptsDisplay.innerHTML = ''; updateFocusSlotsDisplay();
    const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts();
    if (focused.size === 0) { focusedConceptsDisplay.innerHTML = `<li class="focus-placeholder">Focus Concepts from your Grimoire</li>`; return; }

    focused.forEach(conceptId => {
        const conceptData = discovered.get(conceptId);
        if (conceptData?.concept) {
            const concept = conceptData.concept;
            const item = document.createElement('div'); item.classList.add('focus-concept-item'); item.dataset.conceptId = concept.id; item.title = `View ${concept.name}`;
            item.innerHTML = `<i class="${Utils.getCardTypeIcon(concept.cardType)}"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>`;
            item.addEventListener('click', () => showConceptDetailPopup(concept.id)); // Use UI function
            focusedConceptsDisplay.appendChild(item);
        } else {
            console.warn(`Focused concept ID ${conceptId} not found.`);
            const item = document.createElement('div'); item.classList.add('focus-concept-item', 'missing'); item.textContent = `Error: ID ${conceptId}`; focusedConceptsDisplay.appendChild(item);
        }
    });
}

export function updateFocusElementalResonance() {
     if (!focusResonanceBarsContainer) return;
     focusResonanceBarsContainer.innerHTML = '';
     const { focusScores } = GameLogic.calculateFocusScores(); // Use GameLogic to get scores
     elementNames.forEach(elName => {
         const key = elementNameToKey[elName]; const avgScore = focusScores[key] || 0; const percentage = Math.max(0, Math.min(100, (avgScore / 10) * 100));
         const color = Utils.getElementColor(elName); const name = elementDetails[elName]?.name || elName;
         const item = document.createElement('div'); item.classList.add('focus-resonance-item');
         item.innerHTML = `<span class="focus-resonance-name">${name}:</span><div class="focus-resonance-bar-container" title="${avgScore.toFixed(1)} Avg Score"><div class="focus-resonance-bar" style="width: ${percentage}%; background-color: ${color};"></div></div>`;
         focusResonanceBarsContainer.appendChild(item);
     });
}

// Modified to explicitly update the #tapestryNarrative paragraph
export function generateTapestryNarrative() {
     if (!tapestryNarrativeP) return;
     const narrative = GameLogic.calculateTapestryNarrative(); // Use GameLogic (gets potentially cached or recalculated analysis)
     tapestryNarrativeP.innerHTML = narrative || 'Mark concepts as "Focus" to generate narrative...'; // Update the P tag
     console.log("UI: Updated Detailed View Tapestry Narrative paragraph.");
}


export function synthesizeAndDisplayThemesPersona() {
     if (!personaThemesList) return;
     personaThemesList.innerHTML = '';
     const themes = GameLogic.calculateFocusThemes(); // Use GameLogic
     if (themes.length === 0) { personaThemesList.innerHTML = `<li>${State.getFocusedConcepts().size > 0 ? 'No strong themes detected.' : 'Mark Focused Concepts to reveal dominant themes.'}</li>`; return; }
     themes.slice(0, 3).forEach(theme => { const li = document.createElement('li'); li.textContent = `${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})`; personaThemesList.appendChild(li); });
}

// Modified to log more details and handle data loading issues
// In ui.js
export function displayPersonaSummary() {
    if (!summaryContentDiv) return;
    summaryContentDiv.innerHTML = '<p>Generating summary...</p>'; // Show loading state
    console.log("UI: displayPersonaSummary called."); // Log entry

    const scores = State.getScores();
    const focused = State.getFocusedConcepts();
    console.log("UI: Summary View - Focused Count:", focused.size); // Log focus count

    const narrative = GameLogic.calculateTapestryNarrative(); // Recalculates narrative if needed
    const themes = GameLogic.calculateFocusThemes();
    console.log("UI: Summary View - Narrative:", narrative); // Log narrative
    console.log("UI: Summary View - Themes:", themes); // Log themes

    let html = '<h3>Core Essence</h3><div class="summary-section">';
    // Core Essence Part
    if (elementDetails && elementNameToKey && elementKeyToFullName) {
        elementNames.forEach(elName => {
            const key = elementNameToKey[elName];
            const score = scores[key];
            if (typeof score === 'number') {
                const label = Utils.getScoreLabel(score);
                const interpretation = elementDetails[elName]?.scoreInterpretations?.[label] || "N/A";
                html += `<p><strong>${elementDetails[elName]?.name || elName} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`;
            } else {
                html += `<p><strong>${elementDetails[elName]?.name || elName}:</strong> Score not available.</p>`;
                console.warn(`UI: Score for element ${elName} (key: ${key}) is missing or not a number.`);
            }
        });
    } else {
        html += "<p>Error: Element details not loaded.</p>";
        console.error("UI: Cannot generate Core Essence summary - elementDetails/maps missing.");
    }
    // --- Make sure the div closes correctly ---
    html += '</div>'; // Close summary-section for Core Essence
    html += '<hr><h3>Focused Tapestry</h3><div class="summary-section">'; // Start new section for Tapestry

    // Focused Tapestry Part
    if (focused.size > 0) {
        html += `<p><em>${narrative || "No narrative generated."}</em></p>`; // Display narrative

        // Explicitly add Focused Concepts list
        html += '<strong>Focused Concepts:</strong><ul>'; // Open UL
        const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => {
            const name = discovered.get(id)?.concept?.name || `ID ${id}`;
            html += `<li>${name}</li>`; // Add LI
        });
        html += '</ul>'; // Close UL for Concepts

        // Add Themes
        if (themes.length > 0) {
            html += '<strong>Dominant Themes:</strong><ul>'; // Open UL
            themes.slice(0, 3).forEach(theme => { html += `<li>${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})</li>`; }); // Add LI
            html += '</ul>'; // Close UL for Themes
        } else { html += '<strong>Dominant Themes:</strong><p>No strong themes detected.</p>'; }
    } else { html += '<p>No concepts are currently focused.</p>'; }
    // --- Make sure the div closes correctly ---
    html += '</div>'; // Close summary-section for Tapestry

    console.log("UI: Summary View - Final HTML being set.");
    summaryContentDiv.innerHTML = html;
}


// --- Study Screen UI ---
export function displayStudyScreenContent() {
    console.log("UI: Displaying Study Screen Content");
    updateInsightDisplays();
    displayDailyRituals(); // Display rituals based on state
    applyOnboardingPhaseUI(State.getOnboardingPhase()); // Ensure correct elements visible
}

export function displayResearchButtons() {
    if (!researchButtonContainer) return;
    researchButtonContainer.innerHTML = '';
    const insight = State.getInsight(); const attunement = State.getAttunement();

    // Handle Free Research Button Visibility/State
    if (freeResearchButton) {
        const available = State.isFreeResearchAvailable();
        // Toggle visibility based on availability AND onboarding phase
        const showFreeResearch = available && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
        freeResearchButton.classList.toggle('hidden', !showFreeResearch);
        freeResearchButton.disabled = !available; // Still disable if used, even if hidden by phase later
        freeResearchButton.textContent = available ? "Perform Daily Meditation (Free Research)" : "Daily Meditation Performed";
        // Show disabled but visible if phase allows but already used
        if (!available && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
             freeResearchButton.classList.remove('hidden');
        }
    }

    // Paid Research Buttons
    elementNames.forEach(elName => {
        const key = elementNameToKey[elName]; const currentAttunement = attunement[key] || 0;
        let currentCost = Config.BASE_RESEARCH_COST;
        if (currentAttunement > 80) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 5);
        else if (currentAttunement > 50) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 3);
        const canAfford = insight >= currentCost; const fullName = elementDetails[elName]?.name || elName;
        const button = document.createElement('button'); button.classList.add('button', 'research-button');
        button.dataset.elementKey = key; button.dataset.cost = currentCost; button.disabled = !canAfford;
        button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`;
        button.innerHTML = `<span class="research-el-icon" style="color: ${Utils.getElementColor(elName)};"><i class="${Utils.getElementIcon(fullName)}"></i></span><span class="research-el-name">${fullName}</span><span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span>`;
        researchButtonContainer.appendChild(button);
    });

    // Guided Reflection Button State
    if (seekGuidanceButton) seekGuidanceButton.disabled = insight < Config.GUIDED_REFLECTION_COST;
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
}

export function displayDailyRituals() {
     if (!dailyRitualsDisplay) return;
     dailyRitualsDisplay.innerHTML = '';
     const completed = State.getState().completedRituals.daily || {}; const focused = State.getFocusedConcepts();
     let activeRituals = [...dailyRituals]; // Start with base daily rituals

     // Add focus rituals if requirements met
     if (focusRituals) {
         focusRituals.forEach(ritual => {
             if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return;
             const requiredIds = new Set(ritual.requiredFocusIds); let allFocused = true;
             for (const id of requiredIds) { if (!focused.has(id)) { allFocused = false; break; } }
             if (allFocused) activeRituals.push({ ...ritual, isFocusRitual: true });
         });
     }

      // Only display if onboarding phase allows
     if(State.getOnboardingPhase() < Config.ONBOARDING_PHASE.REFLECTION_RITUALS) {
          dailyRitualsDisplay.innerHTML = '<li>Unlock rituals by progressing.</li>';
          return;
     }


     if (activeRituals.length === 0) { dailyRitualsDisplay.innerHTML = '<li>No daily rituals currently active.</li>'; return; }

     activeRituals.forEach(ritual => {
         const completedData = completed[ritual.id] || { completed: false, progress: 0 }; const isCompleted = completedData.completed;
         const li = document.createElement('li'); li.classList.toggle('completed', isCompleted); if(ritual.isFocusRitual) li.classList.add('focus-ritual');
         let rewardText = '';
         if (ritual.reward) {
             if (ritual.reward.type === 'insight') rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`;
             else if (ritual.reward.type === 'attunement') { const elName = ritual.reward.element === 'All' ? 'All' : (elementKeyToFullName[ritual.reward.element] || ritual.reward.element); rewardText = `(+${ritual.reward.amount} ${elName} Attun.)`; }
             else if (ritual.reward.type === 'token') rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`;
         }
         li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`;
         dailyRitualsDisplay.appendChild(li);
     });
}

export function displayResearchStatus(message) { if (researchStatus) researchStatus.textContent = message; }

export function displayResearchResults(results) {
    if (!researchOutput) return;
    const { concepts: foundConcepts, repositoryItems, duplicateInsightGain } = results;

    // Clear placeholder only if new content is coming
    if (foundConcepts.length > 0 || repositoryItems.length > 0) {
         const placeholder = researchOutput.querySelector('p > i');
         if(placeholder && placeholder.parentElement.children.length === 1) placeholder.parentElement.innerHTML = ''; // Clear only if it's the only thing
    }

    // Display duplicate message temporarily
    if (duplicateInsightGain > 0) {
         const dupeMsg = document.createElement('p'); dupeMsg.classList.add('duplicate-message');
         dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${duplicateInsightGain.toFixed(0)} Insight from duplicate research echoes.`;
         researchOutput.prepend(dupeMsg);
         setTimeout(() => dupeMsg.remove(), 5000); // Remove after 5 seconds
    }

    // Display newly found concepts
    foundConcepts.forEach(concept => {
        // Don't add if already displayed in this batch
        if (!researchOutput.querySelector(`.research-result-item[data-concept-id="${concept.id}"]`)) {
            const resultItemDiv = document.createElement('div'); resultItemDiv.classList.add('research-result-item'); resultItemDiv.dataset.conceptId = concept.id;
            const cardElement = renderCard(concept, 'research-output'); resultItemDiv.appendChild(cardElement);
            const actionDiv = document.createElement('div'); actionDiv.classList.add('research-actions');
            // Add Button
            const addButton = document.createElement('button'); addButton.textContent = "Add to Grimoire"; addButton.classList.add('button', 'small-button', 'research-action-button', 'add-button'); addButton.dataset.conceptId = concept.id;
            // Sell Button
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            const sellButton = document.createElement('button'); sellButton.textContent = `Sell (${sellValue.toFixed(1)}) `; sellButton.innerHTML += `<i class="fas fa-brain insight-icon"></i>`; sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button'); sellButton.dataset.conceptId = concept.id; sellButton.dataset.context = 'research'; sellButton.title = `Sell this concept for ${sellValue.toFixed(1)} Insight.`;
            actionDiv.appendChild(addButton); actionDiv.appendChild(sellButton);
            resultItemDiv.appendChild(actionDiv); researchOutput.appendChild(resultItemDiv);
        }
    });

    // Display newly found repository items temporarily
    repositoryItems.forEach(item => {
         if (researchOutput.querySelector(`[data-repo-id="${item.id}"]`)) return; // Don't show duplicates
         const itemDiv = document.createElement('div'); itemDiv.classList.add('repository-item-discovery'); itemDiv.dataset.repoId = item.id;
         let iconClass = 'fa-question-circle'; let typeName = 'Item';
         if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; }
         else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; }
         itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered the '${item.name}'. View it in the Repository.`}</p>`;
         researchOutput.prepend(itemDiv); // Show at the top
         setTimeout(() => itemDiv.remove(), 7000); // Remove after 7 seconds
    });

    // If after adding/removing messages, the area is empty, show default text
    if (researchOutput.children.length === 0) {
         researchOutput.innerHTML = '<p><i>Familiar thoughts echo... Perhaps try a different focus or deepen existing knowledge?</i></p>';
    }
}

// Updates button states or removes item after Add/Sell from Research Notes
// MODIFIED: Remove card entirely on 'add' as well as 'sell'
export function updateResearchButtonAfterAction(conceptId, action) {
    const itemDiv = researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`); if (!itemDiv) return;

    if (action === 'add' || action === 'sell') { // Combine removal logic
        console.log(`UI: Removing research item ${conceptId} due to action: ${action}`);
        itemDiv.remove(); // Remove the whole card display for both add and sell

        // Check if research area is now empty ONLY after removal
        if (researchOutput && researchOutput.children.length === 0) {
            researchOutput.innerHTML = '<p><i>Research results cleared.</i></p>';
            if (action === 'sell') { // Only update status text if sold, not just added
                displayResearchStatus("Ready for new research.");
            }
        }
    }
}


// --- Grimoire Screen UI ---
export function updateGrimoireCounter() { if (grimoireCountSpan) grimoireCountSpan.textContent = State.getDiscoveredConcepts().size; }
export function populateGrimoireFilters() {
    if (grimoireTypeFilter) { grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilter.appendChild(option); }); }
    if (grimoireElementFilter) { grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(fullName => { const name = elementDetails[fullName]?.name || fullName; const option = document.createElement('option'); option.value = fullName; option.textContent = name; grimoireElementFilter.appendChild(option); }); }
}
// MODIFIED displayGrimoire with logging and error checking
export function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") {
    if (!grimoireContentDiv) return; grimoireContentDiv.innerHTML = '';
    console.log(`UI: displayGrimoire called. Filters: Type=${filterType}, Element=${filterElement}, Sort=${sortBy}, Rarity=${filterRarity}`); // Logging Point 1
    const discoveredMap = State.getDiscoveredConcepts();
    if (discoveredMap.size === 0) { grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty. Conduct Research!</p>'; return; }
    let discoveredArray = Array.from(discoveredMap.values());
    console.log(`UI: Found ${discoveredArray.length} items in discovered map.`); // Logging Point 2

    // Add a check for elementNameToKey availability, crucial for filtering
    if (filterElement !== "All" && typeof elementNameToKey === 'undefined') {
         console.error("UI Error: elementNameToKey map is not available for filtering! Check data.js load order/exports.");
         grimoireContentDiv.innerHTML = '<p>Error: Cannot apply filters (data loading issue).</p>';
         return;
    }

    const conceptsToDisplay = discoveredArray.filter(data => {
        if (!data?.concept) {
             console.warn("UI: Filtering out item with missing concept data:", data); // Logging Point 3
             return false;
        }
        const concept = data.concept;
        const typeMatch = (filterType === "All") || (concept.cardType === filterType);
        // Check if elementNameToKey is defined before using it
        const elementKey = (filterElement !== "All" && elementNameToKey) ? elementNameToKey[filterElement] : "All";
        if (filterElement !== "All" && !elementKey) {
             console.warn(`UI: Could not find key for filterElement '${filterElement}'. Skipping element filter.`);
             // Optionally allow element match if key is missing, or force no match
        }
        const elementMatch = (elementKey === "All") || (concept.primaryElement === elementKey);
        const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);
        return typeMatch && elementMatch && rarityMatch;
    });
    console.log(`UI: After filtering, ${conceptsToDisplay.length} concepts to display.`); // Logging Point 4

    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
    conceptsToDisplay.sort((a, b) => {
        if (!a.concept || !b.concept) return 0;
        switch (sortBy) {
            case 'name': return a.concept.name.localeCompare(b.concept.name);
            case 'type': return (cardTypeKeys.indexOf(a.concept.cardType) - cardTypeKeys.indexOf(b.concept.cardType)) || a.concept.name.localeCompare(b.concept.name);
            case 'rarity': return (rarityOrder[a.concept.rarity] || 0) - (rarityOrder[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name);
            // default is 'discovered'
            default: return (a.discoveredTime || 0) - (b.discoveredTime || 0) || a.concept.name.localeCompare(b.concept.name); // Add name sort as tie-breaker
        }
    });

    if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters.</p>`; }
    else {
         console.log(`UI: Rendering ${conceptsToDisplay.length} cards...`); // Logging Point 5
         conceptsToDisplay.forEach((data, index) => {
            try { // Add try...catch around renderCard
                // console.log(`UI: Rendering card ${index + 1}: ID ${data.concept.id}, Name: ${data.concept.name}`); // Optional: very verbose
                const cardElement = renderCard(data.concept, 'grimoire');
                if (cardElement) { // Ensure renderCard returned something
                     grimoireContentDiv.appendChild(cardElement);
                } else {
                     console.error(`UI: renderCard returned null/undefined for concept ID ${data?.concept?.id}`);
                }
            } catch (renderError) {
                 console.error(`UI: Error rendering card for concept ID ${data?.concept?.id}:`, renderError);
                 // Optionally append an error placeholder to the UI
                 const errorDiv = document.createElement('div');
                 errorDiv.textContent = `Error rendering card ID ${data?.concept?.id}`;
                 errorDiv.style.color = 'red';
                 errorDiv.style.border = '1px solid red';
                 grimoireContentDiv.appendChild(errorDiv);
            }
         });
     }
}

// MODIFIED refreshGrimoireDisplay to ensure elements exist
export function refreshGrimoireDisplay() {
     if (grimoireScreen && !grimoireScreen.classList.contains('hidden')) {
         // Ensure filter elements exist before trying to read their value
         const typeValue = grimoireTypeFilter?.value || "All";
         const elementValue = grimoireElementFilter?.value || "All";
         const sortValue = grimoireSortOrder?.value || "discovered";
         const rarityValue = grimoireRarityFilter?.value || "All";
         displayGrimoire(typeValue, elementValue, sortValue, rarityValue);
     }
}

// --- Card Rendering ---
// MODIFIED to only use icons, not images
export function renderCard(concept, context = 'grimoire') {
    if (!concept || typeof concept.id === 'undefined') { console.warn("renderCard invalid concept:", concept); const d = document.createElement('div'); d.textContent = "Error"; return d; }
    const cardDiv = document.createElement('div'); cardDiv.classList.add('concept-card'); cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`); cardDiv.dataset.conceptId = concept.id; cardDiv.title = `View ${concept.name}`;
    const discoveredData = State.getDiscoveredConceptData(concept.id); const isDiscovered = !!discoveredData; const isFocused = State.getFocusedConcepts().has(concept.id); const artUnlocked = discoveredData?.artUnlocked || false;
    // Hide Focus star based on onboarding phase
    const showFocusStar = isFocused && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;

    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    const focusStampHTML = showFocusStar ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const cardTypeIcon = Utils.getCardTypeIcon(concept.cardType);
    let affinitiesHTML = '';
    if (concept.elementScores && elementKeyToFullName) {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
            const level = Utils.getAffinityLevel(score);
            if (level && elementKeyToFullName[key]) {
                const fullName = elementKeyToFullName[key]; const color = Utils.getElementColor(fullName); const levelClass = level === "High" ? "affinity-high" : ""; const iconClass = Utils.getElementIcon(fullName); const elementNameDetail = elementDetails[fullName]?.name || fullName;
                affinitiesHTML += `<span class="affinity ${levelClass}" style="border-color: ${color}; color: ${color}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="${elementNameDetail} Affinity: ${level} (${score.toFixed(1)})"><i class="${iconClass}"></i>${level.substring(0,1)}</span> `;
            }
        });
    }

    // --- MODIFIED VISUAL CONTENT ---
    // Always use Font Awesome icons, never attempt to load <img>
    let visualIconClass = "fas fa-question card-visual-placeholder"; // Default placeholder
    let visualTitle = "Visual Placeholder";
    if (artUnlocked) {
        visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked";
        visualTitle = "Enhanced Art Placeholder";
    } else if (concept.visualHandle) {
        // If there *was* a visual handle defined, use a generic image icon
        visualIconClass = "fas fa-image card-visual-placeholder";
        visualTitle = "Art Placeholder";
    }
    const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;
    // --- END MODIFIED VISUAL CONTENT ---

    let sellButtonHTML = '';
    // Only show sell button in Grimoire context AND if phase allows
    if (context === 'grimoire' && State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT) {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        sellButtonHTML = `<button class="button small-button secondary-button sell-button card-sell-button" data-concept-id="${concept.id}" data-context="grimoire" title="Sell for ${sellValue.toFixed(1)} Insight.">Sell <i class="fas fa-brain insight-icon"></i>${sellValue.toFixed(1)}</button>`;
    }

    cardDiv.innerHTML = `<div class="card-header"><i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i><span class="card-name">${concept.name}</span><span class="card-stamps">${focusStampHTML}${grimoireStampHTML}</span></div><div class="card-visual">${visualContent}</div><div class="card-footer"><div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div><p class="card-brief-desc">${concept.briefDescription || '...'}</p>${sellButtonHTML}</div>`;

    // Main card click listener (excludes buttons)
    if (context !== 'no-click') { cardDiv.addEventListener('click', (event) => { if (event.target.closest('button')) return; showConceptDetailPopup(concept.id); }); }

    // Adjust title for research output cards
    if (context === 'research-output') { cardDiv.title = `Click to view details (Not in Grimoire)`; cardDiv.querySelector('.card-footer .sell-button')?.remove(); /* Should be added by displayResearchResults */}
    return cardDiv;
}


// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData) { console.error("Concept data missing:", conceptId); return; }
    const discoveredData = State.getDiscoveredConceptData(conceptId); const inGrimoire = !!discoveredData;
    // Check if the concept exists in the research output area but is NOT in the grimoire
    const inResearchNotes = !inGrimoire && researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
    const currentPhase = State.getOnboardingPhase();
    GameLogic.setCurrentPopupConcept(conceptId); // Track which popup is open

    // Populate basic info
    if (popupConceptName) popupConceptName.textContent = conceptData.name;
    if (popupConceptType) popupConceptType.textContent = conceptData.cardType;
    if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;
    if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No description.";

    // Populate visual
    const artUnlocked = discoveredData?.artUnlocked || false;
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = '';
        // --- MODIFIED VISUAL CONTENT ---
        // Always use Font Awesome icons for the popup as well
        let visualIconClass = "fas fa-question card-visual-placeholder"; // Default placeholder
        let visualTitle = "Visual Placeholder";
        if (artUnlocked) {
            visualIconClass = "fas fa-star card-visual-placeholder card-art-unlocked";
            visualTitle = "Enhanced Art Placeholder";
        } else if (conceptData.visualHandle) {
            visualIconClass = "fas fa-image card-visual-placeholder";
            visualTitle = "Art Placeholder";
        }
        const visualContent = `<i class="${visualIconClass}" title="${visualTitle}"></i>`;
        popupVisualContainer.innerHTML = visualContent;
        // --- END MODIFIED VISUAL CONTENT ---
    }

    // Populate analysis sections
    const scores = State.getScores(); const distance = Utils.euclideanDistance(scores, conceptData.elementScores);
    displayPopupResonance(distance); displayPopupRecipeComparison(conceptData, scores); displayPopupRelatedConcepts(conceptData);

    // Handle Notes section visibility and content
    const showNotes = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    if (myNotesSection && myNotesTextarea && saveMyNoteButton) {
        myNotesSection.classList.toggle('hidden', !showNotes);
        if (showNotes) { myNotesTextarea.value = discoveredData.notes || ""; if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; }
    }
    // Handle Evolution section visibility and content
    const showEvolution = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
    if (popupEvolutionSection) {
        popupEvolutionSection.classList.toggle('hidden', !showEvolution);
        if (showEvolution) displayEvolutionSection(conceptData, discoveredData);
    }

    // Update action buttons based on context and state
    updateGrimoireButtonStatus(conceptId, inResearchNotes);
    updateFocusButtonStatus(conceptId);
    updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes);

    // Show the popup
    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}

export function displayPopupResonance(distance) {
    if (!popupResonanceSummary) return; let resonanceLabel, resonanceClass, message;
    if (distance === Infinity || isNaN(distance)) { resonanceLabel = "N/A"; resonanceClass = ""; message = "(Cannot compare)"; }
    else if (distance < 2.5) { resonanceLabel = "Very High"; resonanceClass = "resonance-high"; message = "Strongly aligns."; }
    else if (distance < 4.0) { resonanceLabel = "High"; resonanceClass = "resonance-high"; message = "Shares common ground."; }
    else if (distance < 6.0) { resonanceLabel = "Moderate"; resonanceClass = "resonance-medium"; message = "Some similarities."; }
    else if (distance <= Config.DISSONANCE_THRESHOLD) { resonanceLabel = "Low"; resonanceClass = "resonance-low"; message = "Notable divergence."; }
    else { resonanceLabel = "Dissonant"; resonanceClass = "resonance-low"; message = "Significant divergence."; }
    popupResonanceSummary.innerHTML = `Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> <small>(Dist: ${distance.toFixed(1)})</small><br><small>${message}</small> <i class="fas fa-info-circle info-icon" title="How closely this Concept's elemental scores align with your Core Foundation scores. High resonance suggests strong alignment, Dissonant suggests significant divergence."></i>`;
}

export function displayPopupRecipeComparison(conceptData, userCompScores) {
     if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return;
     popupConceptProfile.innerHTML = ''; popupUserComparisonProfile.innerHTML = ''; popupComparisonHighlights.innerHTML = '';
     let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>'; let hasHighlights = false; const conceptScores = conceptData.elementScores || {};
     elementNames.forEach(elName => {
         const key = elementNameToKey[elName]; const fullName = elementKeyToFullName[key]; if (!fullName) return;
         const conceptScore = conceptScores[key]; const userScore = userCompScores[key];
         const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore); const userScoreValid = typeof userScore === 'number' && !isNaN(userScore);
         const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?'; const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';
         const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A'; const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A';
         const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0; const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0;
         const color = Utils.getElementColor(fullName); const elementNameShort = elementDetails[fullName]?.name.substring(0, 11) || elName;
         popupConceptProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${conceptDisplay}</span> <div class="score-bar-container" title="${conceptLabel}"><div style="width: ${conceptBarWidth}%; background-color: ${color};"></div></div></div>`;
         popupUserComparisonProfile.innerHTML += `<div><strong>${elementNameShort}:</strong> <span>${userDisplay}</span> <div class="score-bar-container" title="${userLabel}"><div style="width: ${userBarWidth}%; background-color: ${color};"></div></div></div>`;
         if (conceptScoreValid && userScoreValid) {
             const diff = Math.abs(conceptScore - userScore); const elementNameDisplay = elementDetails[fullName]?.name || elName;
             if (conceptScore >= 7 && userScore >= 7) { highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true; }
             else if (conceptScore <= 3 && userScore <= 3) { highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel}/${userLabel})</p>`; hasHighlights = true; }
             else if (diff >= 4) { highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept: ${conceptLabel}, You: ${userLabel})</p>`; hasHighlights = true; }
         }
     });
     if (!hasHighlights) highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>';
     popupComparisonHighlights.innerHTML = highlightsHTML;
}

export function displayPopupRelatedConcepts(conceptData) {
     if (!popupRelatedConcepts) return; popupRelatedConcepts.innerHTML = '';
     if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
         const details = document.createElement('details'); details.classList.add('related-concepts-details');
         const summary = document.createElement('summary'); summary.innerHTML = `Synergies / Related (${conceptData.relatedIds.length}) <i class="fas fa-info-circle info-icon" title="Concepts with thematic/functional relationships. Focusing synergistic concepts may unlock content."></i>`; details.appendChild(summary);
         const listDiv = document.createElement('div'); listDiv.classList.add('related-concepts-list-dropdown'); let foundCount = 0;
         conceptData.relatedIds.forEach(relatedId => {
             const relatedConcept = concepts.find(c => c.id === relatedId);
             if (relatedConcept) { const span = document.createElement('span'); span.textContent = relatedConcept.name; span.classList.add('related-concept-item'); span.title = `Related: ${relatedConcept.name}`; listDiv.appendChild(span); foundCount++; }
             else { console.warn(`Related concept ID ${relatedId} in ${conceptData.id} not found.`); }
         });
         if (foundCount > 0) { details.appendChild(listDiv); popupRelatedConcepts.appendChild(details); }
         else { // If related IDs exist but none are found in data
            popupRelatedConcepts.innerHTML = `<details class="related-concepts-details"><summary>Synergies / Related <i class="fas fa-info-circle info-icon" title="..."></i></summary><p>Error: Related concepts not found.</p></details>`;
         }
     } else { // If no related IDs are listed
         popupRelatedConcepts.innerHTML = `<details class="related-concepts-details"><summary>Synergies / Related <i class="fas fa-info-circle info-icon" title="..."></i></summary><p>None specified.</p></details>`;
     }
}

export function displayEvolutionSection(conceptData, discoveredData) {
     if (!popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return;
     const isDiscovered = !!discoveredData; const canUnlockArt = conceptData.canUnlockArt; const alreadyUnlocked = discoveredData?.artUnlocked || false;
     const isFocused = State.getFocusedConcepts().has(conceptData.id); const hasReflected = State.getState().seenPrompts.size > 0; const hasEnoughInsight = State.getInsight() >= Config.ART_EVOLVE_COST; const currentPhase = State.getOnboardingPhase();
     const showSection = isDiscovered && canUnlockArt && !alreadyUnlocked && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;

     popupEvolutionSection.classList.toggle('hidden', !showSection); // Toggle visibility based on checks

     if (!showSection) { evolveArtButton.disabled = true; evolveEligibility.classList.add('hidden'); return; } // Exit if not showing

     // Set cost display
     evolveCostSpan.textContent = `${Config.ART_EVOLVE_COST}`;
     let eligibilityText = ''; let canEvolve = true;

     // Check individual requirements
     if (!isFocused) { eligibilityText += '<li>Requires: Mark as Focus</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Focused</li>'; }
     if (!hasReflected) { eligibilityText += '<li>Requires: Engage in Reflection</li>'; canEvolve = false; } else { eligibilityText += '<li><i class="fas fa-check"></i> Reflected</li>'; }
     if (!hasEnoughInsight) { eligibilityText += `<li>Requires: ${Config.ART_EVOLVE_COST} Insight</li>`; canEvolve = false;} else { eligibilityText += `<li><i class="fas fa-check"></i> Insight OK</li>`; }

     // Update UI
     evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`; evolveEligibility.classList.remove('hidden');
     evolveArtButton.disabled = !canEvolve;
}

export function updateGrimoireButtonStatus(conceptId, inResearchNotes = false) {
    if (!addToGrimoireButton) return; const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    // Button should be visible only if NOT discovered (i.e., available to be added)
    addToGrimoireButton.classList.toggle('hidden', isDiscovered);
    // If visible (not discovered), it should be enabled
    addToGrimoireButton.disabled = false;
    addToGrimoireButton.textContent = "Add to Grimoire";
    addToGrimoireButton.classList.remove('added'); // Ensure 'added' class isn't stuck
}

export function updateFocusButtonStatus(conceptId) {
    if (!markAsFocusButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots();
    const phaseAllowsFocus = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;
    const showButton = isDiscovered && phaseAllowsFocus; // Show only if discovered and phase allows

    markAsFocusButton.classList.toggle('hidden', !showButton);

    if (showButton) {
        markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus";
        markAsFocusButton.disabled = (slotsFull && !isFocused); // Disable only if slots full AND trying to add new focus
        markAsFocusButton.classList.toggle('marked', isFocused);
        markAsFocusButton.title = markAsFocusButton.disabled && !isFocused ? `Focus slots full (${State.getFocusSlots()})` : (isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts");
    }
}

export function updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes) {
    const popupActions = conceptDetailPopup?.querySelector('.popup-actions'); if (!popupActions || !conceptData) return;
    popupActions.querySelector('.popup-sell-button')?.remove(); // Remove old one first

    // Determine context and if selling is allowed based on phase
    const context = inGrimoire ? 'grimoire' : (inResearchNotes ? 'research' : 'none');
    const phaseAllowsSell = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;

    if (context !== 'none' && phaseAllowsSell) {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[conceptData.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        const sourceLocation = context === 'grimoire' ? 'Grimoire' : 'Research Notes';

        const sellButton = document.createElement('button');
        sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button', 'popup-sell-button');
        sellButton.textContent = `Sell (${sellValue.toFixed(1)})`;
        sellButton.innerHTML += ` <i class="fas fa-brain insight-icon"></i>`;
        sellButton.dataset.conceptId = conceptId;
        sellButton.dataset.context = context; // Store context for the handler
        sellButton.title = `Sell from ${sourceLocation} for ${sellValue.toFixed(1)} Insight.`;

        // Append after focus button if visible, else after add button if visible, else at end
        if (markAsFocusButton && !markAsFocusButton.classList.contains('hidden')) {
             markAsFocusButton.insertAdjacentElement('afterend', sellButton);
        } else if (addToGrimoireButton && !addToGrimoireButton.classList.contains('hidden')) {
             addToGrimoireButton.insertAdjacentElement('afterend', sellButton);
        } else {
             popupActions.appendChild(sellButton);
        }
    }
}

// --- Reflection Modal UI ---
export function displayReflectionPrompt(promptData, context) {
    if (!reflectionModal || !promptData || !promptData.prompt) { // Check prompt existence
         console.error("Reflection modal or prompt data/text missing.", promptData);
         // Optionally try to recover or show an error
         if (context === 'Dissonance') {
             const conceptId = GameLogic.getCurrentPopupConceptId(); // Assuming this holds the target
             if (conceptId) {
                 console.warn("Reflection prompt missing for Dissonance, adding concept directly.");
                 GameLogic.addConceptToGrimoireInternal(conceptId);
                 hidePopups();
                 showTemporaryMessage("Reflection unavailable, concept added.", 3500);
             } else {
                 showTemporaryMessage("Error: Could not display reflection.", 3000);
             }
         } else {
             showTemporaryMessage("Error: Could not display reflection.", 3000);
         }
         return;
    }
    const { title, category, prompt, showNudge, reward } = promptData;
    if (reflectionModalTitle) reflectionModalTitle.textContent = title || "Moment for Reflection";
    if (reflectionElement) reflectionElement.textContent = category || "General";
    if (reflectionPromptText) reflectionPromptText.textContent = prompt.text; // Use prompt.text
    if (reflectionCheckbox) reflectionCheckbox.checked = false;
    if (scoreNudgeCheckbox && scoreNudgeLabel) { scoreNudgeCheckbox.checked = false; scoreNudgeCheckbox.classList.toggle('hidden', !showNudge); scoreNudgeLabel.classList.toggle('hidden', !showNudge); }
    if (confirmReflectionButton) confirmReflectionButton.disabled = true;
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)}`; // Display reward without " Insight" suffix, icon implies it
    reflectionModal.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Element Library UI ---
export function displayElementLibrary() {
     if (!elementLibraryButtonsDiv || !elementLibraryContentDiv) { console.warn("Element Library elements missing."); return; }
     const showLibrary = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;
     if(elementLibraryDiv) elementLibraryDiv.classList.toggle('hidden-by-flow', !showLibrary); if(!showLibrary) return;
     elementLibraryButtonsDiv.innerHTML = '';
     elementNames.forEach(elName => {
         const key = elementNameToKey[elName]; const button = document.createElement('button'); button.classList.add('button', 'small-button'); button.textContent = elementDetails[elName]?.name || elName; button.style.borderColor = Utils.getElementColor(elName); button.dataset.elementKey = key;
         // Add click listener to show deep dive content
         button.addEventListener('click', () => displayElementDeepDive(key));
         elementLibraryButtonsDiv.appendChild(button);
     });
     // Clear content area or show initial prompt if no element is selected yet
     if (!elementLibraryContentDiv.dataset.selectedElement) { elementLibraryContentDiv.innerHTML = '<p>Select an Element above to view its deep dive content.</p>'; }
     else { displayElementDeepDive(elementLibraryContentDiv.dataset.selectedElement); /* Refresh if one was selected */ }
}
export function displayElementDeepDive(elementKey) {
     if (!elementLibraryContentDiv) return; elementLibraryContentDiv.dataset.selectedElement = elementKey; // Store selected key
     const deepDiveData = elementDeepDive[elementKey] || []; const unlockedLevels = State.getState().unlockedDeepDiveLevels; const currentLevel = unlockedLevels[elementKey] || 0; const elementName = elementKeyToFullName[elementKey] || elementKey; const insight = State.getInsight();
     elementLibraryContentDiv.innerHTML = `<h4>${elementDetails[elementName]?.name || elementName} - Insights</h4>`;
     if (deepDiveData.length === 0) { elementLibraryContentDiv.innerHTML += '<p>No deep dive content available.</p>'; return; }
     let displayedContent = false;
     deepDiveData.forEach(levelData => {
         if (levelData.level <= currentLevel) { elementLibraryContentDiv.innerHTML += `<div class="library-level"><h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5><div class="level-content">${levelData.content}</div></div><hr class="popup-hr">`; displayedContent = true; }
     });
     if (!displayedContent) elementLibraryContentDiv.innerHTML += '<p>Unlock the first level to begin exploring.</p>';
     const nextLevel = currentLevel + 1; const nextLevelData = deepDiveData.find(l => l.level === nextLevel);
     if (nextLevelData) {
         const cost = nextLevelData.insightCost || 0; const canAfford = insight >= cost; const requirementsMet = true; // Add specific req checks later if needed
         elementLibraryContentDiv.innerHTML += `<div class="library-unlock"><h5>Next: ${nextLevelData.title} (Level ${nextLevelData.level})</h5><button class="button small-button unlock-button" data-element-key="${elementKey}" data-level="${nextLevelData.level}" ${!canAfford || !requirementsMet ? 'disabled' : ''} title="${!canAfford ? `Requires ${cost} Insight` : !requirementsMet ? 'Reqs not met' : `Unlock for ${cost} Insight`}">${'Unlock'} (${cost} <i class="fas fa-brain insight-icon"></i>)</button>${!canAfford ? `<p class='unlock-error'>Insufficient Insight (${insight.toFixed(1)}/${cost})</p>` : ''}${!requirementsMet && canAfford ? `<p class='unlock-error'>Other reqs not met.</p>` : ''}</div>`;
     } else if (displayedContent) elementLibraryContentDiv.innerHTML += '<p><i>All insights unlocked for this element.</i></p>';
}

// --- Repository UI ---
export function displayRepositoryContent() {
     const showRepository = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;
     if (repositoryScreen) repositoryScreen.classList.toggle('hidden-by-flow', !showRepository); if(!showRepository) return; // Hide if phase not reached
     if (!repositoryFocusUnlocksDiv || !repositoryScenesDiv || !repositoryExperimentsDiv || !repositoryInsightsDiv) { console.error("Repo list containers missing!"); return; }
     console.log("UI: Displaying Repository Content");
     repositoryFocusUnlocksDiv.innerHTML = ''; repositoryScenesDiv.innerHTML = ''; repositoryExperimentsDiv.innerHTML = ''; repositoryInsightsDiv.innerHTML = '';
     const repoItems = State.getRepositoryItems(); const unlockedFocusData = State.getUnlockedFocusItems(); const attunement = State.getAttunement(); const focused = State.getFocusedConcepts(); const insight = State.getInsight();

     // 1. Display Focus-Driven Unlocks (based on unlockedFocusItems set)
     if (unlockedFocusData.size > 0) { unlockedFocusData.forEach(unlockId => { const unlockData = focusDrivenUnlocks.find(u => u.id === unlockId); if (unlockData?.unlocks) { const item = unlockData.unlocks; const div = document.createElement('div'); div.classList.add('repository-item', 'focus-unlock-item'); let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`; if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`; if (item.type === 'insightFragment') { const iData = elementalInsights.find(i => i.id === item.id); itemHTML += `<p><em>"${iData?.text || item.text || "..."}"</em></p>`; } else itemHTML += `<p>Details below.</p>`; div.innerHTML = itemHTML; repositoryFocusUnlocksDiv.appendChild(div); } }); }
     else { repositoryFocusUnlocksDiv.innerHTML = '<p>Focus synergistic Concepts to unlock items.</p>'; }

     // 2. Display Scene Blueprints (based on discoveredRepositoryItems.scenes)
     if (repoItems.scenes.size > 0) { repoItems.scenes.forEach(sceneId => { const scene = sceneBlueprints.find(s => s.id === sceneId); if (scene) { const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST; const canAfford = insight >= cost; repositoryScenesDiv.appendChild(renderRepositoryItem(scene, 'scene', cost, canAfford)); } else { console.warn(`Scene ID ${sceneId} in repository not found in sceneBlueprints data.`); } }); }
     else { repositoryScenesDiv.innerHTML = '<p>No Scene Blueprints discovered.</p>'; }

     // 3. Display Alchemical Experiments (based on base data + attunement check)
     let experimentsDisplayed = 0;
     alchemicalExperiments.forEach(exp => {
         const isUnlockedByAttunement = attunement[exp.requiredElement] >= exp.requiredAttunement; const alreadyCompleted = repoItems.experiments.has(exp.id);
         if (isUnlockedByAttunement) { // Only display if attunement requirement is met
             let canAttempt = true; let unmetReqs = [];
             // Check focus requirements
             if (exp.requiredFocusConceptIds) { for (const reqId of exp.requiredFocusConceptIds) { if (!focused.has(reqId)) { canAttempt = false; const c = concepts.find(c=>c.id === reqId); unmetReqs.push(c ? c.name : `ID ${reqId}`); } } }
             if (exp.requiredFocusConceptTypes) { for (const typeReq of exp.requiredFocusConceptTypes) { let typeMet = false; const dMap = State.getDiscoveredConcepts(); for (const fId of focused) { const c = dMap.get(fId)?.concept; if (c?.cardType === typeReq) { typeMet = true; break; } } if (!typeMet) { canAttempt = false; unmetReqs.push(`Type: ${typeReq}`); } } }
             const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST; const canAfford = insight >= cost; if (!canAfford) unmetReqs.push("Insight");
             // Render the experiment item, passing completion status and unmet requirements
             // Corrected: `canAttempt` condition should check `!alreadyCompleted`
             repositoryExperimentsDiv.appendChild(renderRepositoryItem(exp, 'experiment', cost, canAfford && canAttempt && !alreadyCompleted, alreadyCompleted, unmetReqs)); experimentsDisplayed++;
         }
     });
     if (experimentsDisplayed === 0) { repositoryExperimentsDiv.innerHTML = '<p>Increase Attunement to unlock Experiments.</p>'; }

     // 4. Display Elemental Insights (based on discoveredRepositoryItems.insights)
     if (repoItems.insights.size > 0) {
         const insightsByElement = {}; elementNames.forEach(elName => insightsByElement[elementNameToKey[elName]] = []); // Initialize keys
         repoItems.insights.forEach(insightId => { const insight = elementalInsights.find(i => i.id === insightId); if (insight) { if (!insightsByElement[insight.element]) insightsByElement[insight.element] = []; insightsByElement[insight.element].push(insight); } else { console.warn(`Insight ID ${insightId} in repository not found in elementalInsights data.`); } });
         let insightsHTML = '';
         for (const key in insightsByElement) { if (insightsByElement[key].length > 0) { insightsHTML += `<h5>${elementDetails[elementKeyToFullName[key]]?.name || key} Insights:</h5><ul>`; insightsByElement[key].sort((a, b) => a.id.localeCompare(b.id)).forEach(insight => { insightsHTML += `<li>"${insight.text}"</li>`; }); insightsHTML += `</ul>`; } }
         repositoryInsightsDiv.innerHTML = insightsHTML || '<p>No Elemental Insights collected.</p>'; // Fallback
     } else { repositoryInsightsDiv.innerHTML = '<p>No Elemental Insights collected.</p>'; }

     // 5. Display Milestones
     displayMilestones();
     // Update repository content milestone check if necessary
     GameLogic.updateMilestoneProgress('repositoryContents', null);
 }

// Renders a single item for the Repository screen
function renderRepositoryItem(item, type, cost, canAfford, completed = false, unmetReqs = []) {
     const div = document.createElement('div'); div.classList.add('repository-item', `repo-item-${type}`); if (completed) div.classList.add('completed');
     let actionsHTML = '';
     // Determine if the button should be disabled
     // For experiments, button is disabled if !canAfford OR completed OR unmetReqs.length > 0
     // For scenes, button is disabled if !canAfford (no completion state for meditating)
     let buttonDisabled = (type === 'experiment') ? (!canAfford || completed || unmetReqs.length > 0) : !canAfford;

     let buttonTitle = ''; let buttonText = '';

     if (type === 'scene') {
         buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`;
         if (!canAfford) buttonTitle = `Requires ${cost} Insight`;
         actionsHTML = `<button class="button small-button" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
     }
     else if (type === 'experiment') {
         buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`;
         if (completed) buttonTitle = "Completed";
         // Prioritize unmetReqs message over insight if both are issues
         else if (unmetReqs.length > 0 && unmetReqs[0] === "Insight") buttonTitle = `Requires ${cost} Insight`;
         else if (unmetReqs.length > 0) buttonTitle = `Requires: ${unmetReqs.join(', ')}`;
         else if (!canAfford) buttonTitle = `Requires ${cost} Insight`; // Fallback for insight
         actionsHTML = `<button class="button small-button" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
         // Add requirement/completion text *after* the button
         if (completed) actionsHTML += ` <span class="completed-text">(Completed)</span>`;
         else if (unmetReqs.length > 0 && unmetReqs[0] === "Insight") actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`;
         else if (unmetReqs.length > 0) actionsHTML += ` <small class="req-missing">(Requires: ${unmetReqs.join(', ')})</small>`;
         // No need for separate (!canAfford) check here, covered by unmetReqs["Insight"]
     }
     div.innerHTML = `<h4>${item.name} ${type === 'experiment' ? `(Req: ${item.requiredAttunement} ${elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4><p>${item.description}</p><div class="repo-actions">${actionsHTML}</div>`;
     return div;
 }

// --- Milestones UI ---
export function displayMilestones() {
    if (!milestonesDisplay) return; milestonesDisplay.innerHTML = '';
    const achieved = State.getState().achievedMilestones;
    if (achieved.size === 0) { milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>'; return; }
    // Sort achieved milestones based on their order in the original `milestones` array for consistency
    const sortedAchievedIds = milestones.filter(m => achieved.has(m.id)).map(m => m.id);
    sortedAchievedIds.forEach(milestoneId => { const milestone = milestones.find(m => m.id === milestoneId); if (milestone) { const li = document.createElement('li'); li.textContent = `✓ ${milestone.description}`; milestonesDisplay.appendChild(li); } });
}

// --- Settings Popup UI ---
export function showSettings() { if (settingsPopup) settingsPopup.classList.remove('hidden'); if (popupOverlay) popupOverlay.classList.remove('hidden'); }

// --- Tapestry Deep Dive UI ---
export function displayTapestryDeepDive(analysisData) {
    if (!tapestryDeepDiveModal || !popupOverlay || !deepDiveNarrativeP) {
        console.error("Deep Dive Modal elements missing!");
        showTemporaryMessage("Error opening Deep Dive.", 3000);
        return;
    }
    console.log("UI: displayTapestryDeepDive called with analysis:", analysisData);

    // 1. Populate Narrative
    deepDiveNarrativeP.innerHTML = analysisData.fullNarrativeHTML || "Could not generate narrative.";

    // 2. Populate Focus Icons (Optional but nice)
    if (deepDiveFocusIcons) {
        deepDiveFocusIcons.innerHTML = '';
        const focused = State.getFocusedConcepts();
        const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => {
            const concept = discovered.get(id)?.concept;
            if (concept) {
                const icon = document.createElement('i');
                icon.className = `${Utils.getCardTypeIcon(concept.cardType)}`;
                icon.title = concept.name;
                deepDiveFocusIcons.appendChild(icon);
            }
        });
    }

    // 3. Reset Detail Content
    if (deepDiveDetailContent) {
        deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>';
        // Remove active class from all node buttons
        deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active'));
    }

    // 4. Update Contemplate Button (Cost/Cooldown - Placeholder for now)
    if (contemplationNodeButton) {
        const cost = Config.CONTEMPLATION_COST || 3; // Use config or default
        contemplationNodeButton.innerHTML = `Contemplate (${cost} <i class="fas fa-brain insight-icon"></i>)`;
        // TODO: Add cooldown display logic here later if desired
        // Example: Check State.getContemplationCooldownEnd() and disable/update text
    }


    // 5. Show Modal and Overlay
    tapestryDeepDiveModal.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');
}

// Function to show node analysis
export function updateDeepDiveContent(htmlContent, nodeId) {
    if (!deepDiveDetailContent) return;
    console.log(`UI: Updating deep dive content for node: ${nodeId}`);
    deepDiveDetailContent.innerHTML = htmlContent;

    // Highlight active node (optional)
    deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nodeId === nodeId);
    });
}

// Function for contemplation tasks
export function displayContemplationTask(task) {
    if (!deepDiveDetailContent) return;
    console.log("UI: Displaying contemplation task:", task);
    let html = `<h4>Contemplation Task</h4><p>${task.text}</p>`;
    if (task.requiresCompletionButton) {
        html += `<button id="completeContemplationBtn" class="button small-button">Mark Complete (+${task.reward.amount} ${task.reward.type === 'insight' ? '<i class="fas fa-brain insight-icon"></i>' : 'Attun.'})</button>`;
    }
     deepDiveDetailContent.innerHTML = html;

     // Add listener specifically for the complete button IF it was added
     const completeBtn = document.getElementById('completeContemplationBtn');
     if (completeBtn) {
         // Remove previous listener if any (safer)
         // completeBtn.replaceWith(completeBtn.cloneNode(true)); // Simple way to remove old listeners
         // completeBtn = document.getElementById('completeContemplationBtn'); // Re-select

         completeBtn.addEventListener('click', () => {
             GameLogic.handleCompleteContemplation(task); // Pass the task data back
         }, { once: true }); // Listener only runs once
     }

     // Highlight contemplation node
     deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => {
         btn.classList.toggle('active', btn.id === 'contemplationNode');
     });
}

// Function to clear contemplation task UI
export function clearContemplationTask() {
     if (deepDiveDetailContent) {
         // Could reset to default or show completion message briefly
         deepDiveDetailContent.innerHTML = '<p>Contemplation acknowledged.</p>';
         setTimeout(() => {
             if (deepDiveDetailContent && deepDiveDetailContent.innerHTML === '<p>Contemplation acknowledged.</p>') {
                 deepDiveDetailContent.innerHTML = '<p>Select an analysis node above...</p>';
                 // Remove active class from contemplation node
                 deepDiveAnalysisNodes?.querySelectorAll('.deep-dive-node').forEach(btn => btn.classList.remove('active'));
             }
         }, 1500);
     }
}

// Add a function to update the Deep Dive Button state if needed later
export function updateTapestryDeepDiveButton() {
    const btn = document.getElementById('exploreTapestryButton');
    if (btn) {
        btn.disabled = State.getFocusedConcepts().size === 0;
        btn.classList.toggle('hidden-by-flow', State.getOnboardingPhase() < Config.ONBOARDING_PHASE.ADVANCED); // Hide until advanced phase
    }
}

// --- Initial UI Setup Helper ---
export function setupInitialUI() {
    console.log("UI: Setting up initial UI state...");
    applyOnboardingPhaseUI(Config.ONBOARDING_PHASE.START); // Apply phase 0 visibility
    if(mainNavBar) mainNavBar.classList.add('hidden'); // Ensure nav is hidden initially
    showScreen('welcomeScreen'); // Start on the welcome screen
    if(loadButton) loadButton.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY)); // Show load button only if save exists
}


console.log("ui.js loaded.");
