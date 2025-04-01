// js/ui.js - Handles DOM Manipulation and UI Updates
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js'; // Needed for button actions in popups etc.
import * as Data from '../data.js'; // Import data for details

console.log("ui.js loading...");

// --- DOM Element References ---
// It's often better to group these in an object or get them on demand,
// but for simplicity in this refactor, we'll list them here.
const saveIndicator = document.getElementById('saveIndicator');
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startGuidedButton');
const loadButton = document.getElementById('loadButton');
const welcomeScreen = document.getElementById('welcomeScreen');
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
const grimoireControls = document.getElementById('grimoireControls'); // Container for filters
const grimoireFilterControls = grimoireControls?.querySelector('.filter-controls'); // Span containing filters
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
const milestonesDisplay = document.getElementById('milestonesDisplay'); // In Repository HTML now
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

// --- Utility UI Functions ---
let toastTimeout = null;
export function showTemporaryMessage(message, duration = 3000) {
    if (!toastElement || !toastMessageElement) {
        console.warn("Toast elements not found, logging message to console:", message);
        return;
    }
    console.info(`Toast: ${message}`); // Keep console log for debugging
    toastMessageElement.textContent = message;
    if (toastTimeout) { clearTimeout(toastTimeout); }
    toastElement.classList.remove('hidden', 'visible'); // Reset classes
    void toastElement.offsetWidth; // Trigger reflow
    toastElement.classList.add('visible');
    toastElement.classList.remove('hidden'); // Make visible *after* adding class

    toastTimeout = setTimeout(() => {
        toastElement.classList.remove('visible');
        // Add hidden back after transition ends (optional, depends on CSS)
         setTimeout(() => {
            if (!toastElement.classList.contains('visible')) { // Check if another toast started
                 toastElement.classList.add('hidden');
            }
         }, 500); // Match CSS transition duration
        toastTimeout = null;
    }, duration);
}

let milestoneTimeout = null;
export function showMilestoneAlert(text) {
    if (!milestoneAlert || !milestoneAlertText) return;
    milestoneAlertText.textContent = `Milestone: ${text}`;
    milestoneAlert.classList.remove('hidden');
    if (milestoneTimeout) clearTimeout(milestoneTimeout); // Clear previous timer
    milestoneTimeout = setTimeout(hideMilestoneAlert, 5000);
}

export function hideMilestoneAlert() {
    if (milestoneAlert) milestoneAlert.classList.add('hidden');
    if (milestoneTimeout) clearTimeout(milestoneTimeout);
    milestoneTimeout = null;
}

export function hidePopups() {
    if (conceptDetailPopup) conceptDetailPopup.classList.add('hidden');
    if (reflectionModal) reflectionModal.classList.add('hidden');
    if (settingsPopup) settingsPopup.classList.add('hidden');
    if (popupOverlay) popupOverlay.classList.add('hidden');
    GameLogic.clearPopupState(); // Tell logic module to clear relevant temp state
}

// --- Screen Management ---
export function showScreen(screenId) {
    console.log("UI: Showing screen:", screenId);
    const currentState = State.getState(); // Get current state if needed for logic
    const isPostQuestionnaire = currentState.questionnaireCompleted;

    screens.forEach(screen => {
        screen.classList.toggle('current', screen.id === screenId);
        screen.classList.toggle('hidden', screen.id !== screenId);
    });

    // Handle Nav Bar Visibility based on state, not just target screen
    if (mainNavBar) {
        mainNavBar.classList.toggle('hidden', !isPostQuestionnaire || screenId === 'welcomeScreen' || screenId === 'questionnaireScreen');
    }
    // Update Nav Button active state
    navButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.target === screenId);
    });

    // Specific screen update calls (moved from direct calls in old script.js)
    if (isPostQuestionnaire) {
        if (screenId === 'personaScreen') {
            displayPersonaScreen(); // Refresh data
        } else if (screenId === 'studyScreen') {
            displayStudyScreenContent(); // Refresh data
        } else if (screenId === 'grimoireScreen') {
            refreshGrimoireDisplay(); // Use current filters
        } else if (screenId === 'repositoryScreen') {
            displayRepositoryContent(); // Refresh data
        }
    }

    // Scroll to top for main screens
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
        const target = button.dataset.target;
        if (target === 'studyScreen') button.classList.toggle('hidden-by-flow', !isPhase2);
        else if (target === 'repositoryScreen') button.classList.toggle('hidden-by-flow', !isPhase4);
    });

    // --- Persona Screen ---
    // Focus button in popup (handled in showConceptDetailPopup)
    if(elementLibraryDiv) elementLibraryDiv.classList.toggle('hidden-by-flow', !isPhase4);

    // --- Grimoire Screen ---
    // Focus button in popup (handled in showConceptDetailPopup)
    if(grimoireFilterControls) grimoireFilterControls.classList.toggle('hidden-by-flow', !isPhase2); // Show filters later
    if(markAsFocusButton) markAsFocusButton.classList.toggle('hidden-by-flow', !isPhase1); // Show Focus button earlier

    // --- Study Screen ---
    if(seekGuidanceButton) seekGuidanceButton.classList.toggle('hidden-by-flow', !isPhase3);
    const ritualsSection = studyScreen?.querySelector('.rituals-section');
    if(ritualsSection) ritualsSection.classList.toggle('hidden-by-flow', !isPhase3);

    // --- Concept Popup ---
    if (myNotesSection) myNotesSection.classList.toggle('hidden', !isPhase2); // Show notes earlier
    if (popupEvolutionSection) popupEvolutionSection.classList.toggle('hidden', !isPhase4); // Show evolution later
}

// --- Insight Display ---
export function updateInsightDisplays() {
    const insight = State.getInsight().toFixed(1);
    if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight;
    if (userInsightDisplayStudy) userInsightDisplayStudy.textContent = insight;
    // Update button disabled states based on cost
    displayResearchButtons(); // Research buttons depend on insight
    if (seekGuidanceButton) seekGuidanceButton.disabled = State.getInsight() < Config.GUIDED_REFLECTION_COST;
    if (guidedReflectionCostDisplay) guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
    // Update library costs if library is visible
    // Update experiment costs if repository is visible
    // Update evolve button if popup is visible
}

// --- Questionnaire UI ---
export function initializeQuestionnaireUI() {
    if (!Utils.isDataReady()) return;
    updateElementProgressHeader(-1); // Start fresh
    displayElementQuestions(0); // Display first element
    // showScreen('questionnaireScreen'); // Called from main.js
    if (mainNavBar) mainNavBar.classList.add('hidden');
    if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; // Hide initially
}

export function updateElementProgressHeader(activeIndex) {
    if (!Utils.isDataReady() || !elementProgressHeader) return;
    elementProgressHeader.innerHTML = '';
    Data.elementNames.forEach((name, index) => {
        const tab = document.createElement('div');
        tab.classList.add('element-tab');
        const elementData = Data.elementDetails[name] || {};
        tab.textContent = elementData.name || name;
        tab.title = elementData.name || name;
        tab.classList.toggle('completed', index < activeIndex);
        tab.classList.toggle('active', index === activeIndex);
        elementProgressHeader.appendChild(tab);
    });
}

export function displayElementQuestions(index) {
    if (!Utils.isDataReady()) {
        console.error("Data not ready for displaying questions");
        return;
    }
    const currentState = State.getState();
    if (index >= Data.elementNames.length) {
        // Should be handled by gameLogic to finalize
        console.log("Questionnaire complete, attempting to finalize.");
        GameLogic.finalizeQuestionnaire();
        return;
    }

    const elementName = Data.elementNames[index];
    const elementData = Data.elementDetails[elementName] || {};
    const questions = Data.questionnaireGuided[elementName] || [];

    if (!questionContent) { console.error("questionContent element not found!"); return; }

    let introHTML = `<div class="element-intro"><h2>${elementData.name || elementName}</h2><p><em>${elementData.coreQuestion || ''}</em></p><p>${elementData.coreConcept || 'Loading...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`;
    questionContent.innerHTML = introHTML;

    // Get saved answers for this element for defaulting inputs
    const elementAnswers = currentState.userAnswers?.[elementName] || {};

    let questionsHTML = '';
    if (questions && questions.length > 0) {
        questions.forEach(q => {
            let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
            const savedAnswer = elementAnswers[q.qId];

            if (q.type === "slider") {
                const val = savedAnswer !== undefined ? savedAnswer : q.defaultValue;
                inputHTML += `
                    <div class="slider-container">
                        <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${val}" data-question-id="${q.qId}" data-type="slider">
                        <div class="label-container">
                            <span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span>
                        </div>
                        <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(val).toFixed(1)}</span></p>
                        <p class="slider-feedback" id="feedback_${q.qId}"></p>
                    </div>`;
            } else if (q.type === "radio") {
                inputHTML += `<div class="radio-options">`;
                q.options.forEach(opt => {
                    const checked = savedAnswer === opt.value ? 'checked' : '';
                    inputHTML += `<div><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`;
                });
                inputHTML += `</div>`;
            } else if (q.type === "checkbox") {
                inputHTML += `<div class="checkbox-options">`;
                q.options.forEach(opt => {
                    const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : '';
                    inputHTML += `<div><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><label for="${q.qId}_${opt.value}">${opt.value}</label></div>`;
                });
                inputHTML += `</div>`;
            }
            inputHTML += `</div></div>`;
            questionsHTML += inputHTML;
        });
    } else {
        questionsHTML = '<p><em>(No questions defined for this element)</em></p>';
    }

    const introDiv = questionContent.querySelector('.element-intro');
    if (introDiv) {
        introDiv.insertAdjacentHTML('afterend', questionsHTML);
    } else {
        questionContent.innerHTML += questionsHTML; // Fallback
    }

    // Add event listeners AFTER injecting HTML
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.removeEventListener(eventType, GameLogic.handleQuestionnaireInputChange); // Remove old listener first
        input.addEventListener(eventType, GameLogic.handleQuestionnaireInputChange);
    });
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.removeEventListener('change', GameLogic.handleCheckboxChange); // Remove old listener
        checkbox.addEventListener('change', GameLogic.handleCheckboxChange);
    });
    questionContent.querySelectorAll('.slider.q-input').forEach(slider => {
        updateSliderFeedbackText(slider); // Update initial feedback
    });

    // Update header/footer
    updateElementProgressHeader(index);
    if (progressText) progressText.textContent = `Element ${index + 1} / ${Data.elementNames.length}: ${elementData.name || elementName}`;
    updateDynamicFeedback(elementName, elementAnswers); // Update feedback based on saved/default answers
    if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'block';
    if (prevElementButton) prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden';
    if (nextElementButton) nextElementButton.textContent = (index === Data.elementNames.length - 1) ? "View My Persona" : "Next Element";
}


export function updateSliderFeedbackText(sliderElement) {
    if (!Utils.isDataReady()) return;
    if (!sliderElement || sliderElement.type !== 'range') return;
    const qId = sliderElement.dataset.questionId;
    const feedbackElement = document.getElementById(`feedback_${qId}`);
    if (!feedbackElement) return;

    const currentValue = parseFloat(sliderElement.value);
    const display = document.getElementById(`display_${qId}`);
    if(display) display.textContent = currentValue.toFixed(1);

    // Find the current element name based on the displayed questions
    const activeTab = elementProgressHeader?.querySelector('.element-tab.active');
    const currentElementName = Data.elementNames.find(name => (Data.elementDetails[name]?.name || name) === activeTab?.textContent);

    if (!currentElementName) return; // Element not identified

    const interpretations = Data.elementDetails?.[currentElementName]?.scoreInterpretations;
    if (!interpretations) {
        feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`;
        return;
    }

    const scoreLabel = Utils.getScoreLabel(currentValue); // Assuming score 0-10 maps directly
    const interpretationText = interpretations[scoreLabel] || `Interpretation for "${scoreLabel}" not found.`;
    feedbackElement.textContent = interpretationText;
    feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`;
}


export function updateDynamicFeedback(elementName, currentAnswers) {
     if (!Utils.isDataReady()) return;
     const elementData = Data.elementDetails?.[elementName];
     if (!elementData || !dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) {
        if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none';
        return;
     }

     const tempScore = GameLogic.calculateElementScore(elementName, currentAnswers); // Calculate based on provided answers
     const scoreLabel = Utils.getScoreLabel(tempScore);

     feedbackElementSpan.textContent = elementData.name || elementName;
     feedbackScoreSpan.textContent = tempScore.toFixed(1);
     let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
     if(!labelSpan) { // Create if it doesn't exist
         labelSpan = document.createElement('span');
         labelSpan.classList.add('score-label');
         // Insert after score span
         feedbackScoreSpan.parentNode.insertBefore(labelSpan, feedbackScoreSpan.nextSibling);
     }
     labelSpan.textContent = `(${scoreLabel})`;

     feedbackScoreBar.style.width = `${tempScore * 10}%`;
     dynamicScoreFeedback.style.display = 'block';
}

export function getQuestionnaireAnswers() {
     const answers = {};
     const inputs = questionContent?.querySelectorAll('.q-input');
     if (!inputs) return answers;

     inputs.forEach(input => {
         const qId = input.dataset.questionId;
         const type = input.dataset.type;
         if (!qId) return;

         if (type === 'slider') {
             answers[qId] = parseFloat(input.value);
         } else if (type === 'radio') {
             if (input.checked) {
                 answers[qId] = input.value;
             }
         } else if (type === 'checkbox') {
             if (!answers[qId]) answers[qId] = []; // Initialize array if needed
             if (input.checked) {
                 answers[qId].push(input.value);
             }
         }
     });
     return answers;
}


// --- Persona Screen UI ---
export function displayPersonaScreen() {
    if (!Utils.isDataReady() || !personaElementDetailsDiv) return;
    console.log("UI: Displaying Persona Screen");
    personaElementDetailsDiv.innerHTML = ''; // Clear previous entries
    const scores = State.getScores();
    const attunement = State.getAttunement();

    Data.elementNames.forEach(elementName => {
        const key = Data.elementNameToKey[elementName];
        const score = scores[key];
        const scoreLabel = Utils.getScoreLabel(score);
        const elementData = Data.elementDetails[elementName] || {};
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "N/A";
        const barWidth = score ? (score / 10) * 100 : 0;
        const color = Utils.getElementColor(elementName);

        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        details.dataset.elementKey = key;
        details.style.setProperty('--element-color', color);
        // Initial content
        details.innerHTML = `
            <summary class="element-detail-header">
                <div><strong>${elementData.name || elementName}:</strong><span>${score?.toFixed(1) ?? '?'}</span> <span class="score-label">(${scoreLabel})</span></div>
                <div class="score-bar-container"><div style="width: ${barWidth}%; background-color: ${color};"></div></div>
            </summary>
            <div class="element-description">
                <p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p>
                <p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p>
                <hr>
                <p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p>
                <p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>
                <!-- Attunement will be added here -->
            </div>`;
        personaElementDetailsDiv.appendChild(details);
    });
    displayElementAttunement(); // Add attunement bars
    updateInsightDisplays();
    displayFocusedConceptsPersona();
    updateFocusElementalResonance();
    generateTapestryNarrative();
    synthesizeAndDisplayThemesPersona();
    displayElementLibrary(); // Display library section
    displayPersonaSummary(); // Update summary view content
    applyOnboardingPhaseUI(State.getOnboardingPhase()); // Ensure visibility based on phase
}

export function displayElementAttunement() {
    if (!Utils.isDataReady()) return;
    const attunement = State.getAttunement();

    Data.elementNames.forEach(elName => {
        const key = Data.elementNameToKey[elName];
        const attunementValue = attunement[key] || 0;
        const percentage = (attunementValue / Config.MAX_ATTUNEMENT) * 100;
        const color = Utils.getElementColor(elName);
        const targetDetails = personaElementDetailsDiv?.querySelector(`.element-detail-entry[data-element-key="${key}"]`);

        if (targetDetails) {
            let descriptionDiv = targetDetails.querySelector('.element-description');
            if (descriptionDiv) {
                // Remove old attunement if exists
                descriptionDiv.querySelector('.attunement-display')?.remove();
                 descriptionDiv.querySelector('.attunement-hr')?.remove(); // Remove old hr

                // Add new attunement display
                 const hr = document.createElement('hr'); hr.className = 'attunement-hr';
                 descriptionDiv.appendChild(hr);

                const attunementDiv = document.createElement('div');
                attunementDiv.classList.add('attunement-display');
                attunementDiv.innerHTML = `
                    <div class="attunement-item">
                        <span class="attunement-name">Attunement:</span>
                        <div class="attunement-bar-container" title="Current Attunement: ${attunementValue.toFixed(1)} / ${Config.MAX_ATTUNEMENT}">
                            <div class="attunement-bar" style="width: ${percentage}%; background-color: ${color};"></div>
                        </div>
                         <i class="fas fa-info-circle info-icon" title="Attunement reflects your affinity and experience with this Element. It grows through related actions like Research, Reflection, and focusing on relevant Concepts. High Attunement may unlock Experiments or reduce Research costs."></i>
                    </div>`;
                 descriptionDiv.appendChild(attunementDiv);
            }
        }
    });
}


export function updateFocusSlotsDisplay() {
    const focused = State.getFocusedConcepts();
    const totalSlots = State.getFocusSlots();
    if (focusedConceptsHeader) {
        focusedConceptsHeader.textContent = `Focused Concepts (${focused.size} / ${totalSlots})`;
        const icon = focusedConceptsHeader.querySelector('.info-icon');
        if(icon) icon.title = `The number of Concepts currently marked as Focus out of your total available slots (${totalSlots}). Slots can be increased via Milestones.`;
    }
}

export function displayFocusedConceptsPersona() {
    if (!Utils.isDataReady() || !focusedConceptsDisplay) return;
    focusedConceptsDisplay.innerHTML = ''; // Clear previous
    updateFocusSlotsDisplay();
    const focused = State.getFocusedConcepts();
    const discovered = State.getDiscoveredConcepts();

    if (focused.size === 0) {
        focusedConceptsDisplay.innerHTML = `<li class="focus-placeholder">Focus Concepts from your Grimoire</li>`;
        return;
    }

    focused.forEach(conceptId => {
        const conceptData = discovered.get(conceptId);
        if (conceptData?.concept) {
            const concept = conceptData.concept;
            const item = document.createElement('div');
            item.classList.add('focus-concept-item');
            item.dataset.conceptId = concept.id;
            item.title = `View ${concept.name}`;
            item.innerHTML = `
                <i class="${Utils.getCardTypeIcon(concept.cardType)}"></i>
                <span class="name">${concept.name}</span>
                <span class="type">(${concept.cardType})</span>`;
            item.addEventListener('click', () => showConceptDetailPopup(concept.id)); // Use direct function call
            focusedConceptsDisplay.appendChild(item);
        } else {
            console.warn(`Focused concept ID ${conceptId} not found in discoveredConcepts.`);
            // Optionally display a placeholder for missing focused concepts
            const item = document.createElement('div');
             item.classList.add('focus-concept-item', 'missing');
             item.textContent = `Error: ID ${conceptId}`;
             focusedConceptsDisplay.appendChild(item);
        }
    });
}

export function updateFocusElementalResonance() {
     if (!Utils.isDataReady() || !focusResonanceBarsContainer) return;
     focusResonanceBarsContainer.innerHTML = ''; // Clear previous
     const { focusScores } = GameLogic.calculateFocusScores(); // Get calculated scores

     Data.elementNames.forEach(elName => {
         const key = Data.elementNameToKey[elName];
         const avgScore = focusScores[key] || 0;
         const percentage = Math.max(0, Math.min(100, (avgScore / 10) * 100));
         const color = Utils.getElementColor(elName);
         const name = Data.elementDetails[elName]?.name || elName;

         const item = document.createElement('div');
         item.classList.add('focus-resonance-item');
         item.innerHTML = `
             <span class="focus-resonance-name">${name}:</span>
             <div class="focus-resonance-bar-container" title="${avgScore.toFixed(1)} Avg Score">
                 <div class="focus-resonance-bar" style="width: ${percentage}%; background-color: ${color};"></div>
             </div>`;
         focusResonanceBarsContainer.appendChild(item);
     });
}

export function generateTapestryNarrative() {
     if (!Utils.isDataReady() || !tapestryNarrativeP) return;
     const narrative = GameLogic.calculateTapestryNarrative(); // Get narrative from logic
     tapestryNarrativeP.innerHTML = narrative; // Display it (logic module handles formatting)
}

export function synthesizeAndDisplayThemesPersona() {
     if (!Utils.isDataReady() || !personaThemesList) return;
     personaThemesList.innerHTML = ''; // Clear previous
     const themes = GameLogic.calculateFocusThemes(); // Get themes from logic

     if (themes.length === 0) {
         personaThemesList.innerHTML = `<li>${State.getFocusedConcepts().size > 0 ? 'No strong themes detected.' : 'Mark Focused Concepts to reveal dominant themes.'}</li>`;
         return;
     }

     themes.slice(0, 3).forEach(theme => { // Display top 3
         const li = document.createElement('li');
         li.textContent = `${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})`;
         personaThemesList.appendChild(li);
     });
}

export function displayPersonaSummary() {
    if (!Utils.isDataReady() || !summaryContentDiv) return;
    summaryContentDiv.innerHTML = ''; // Clear previous
    const scores = State.getScores();
    const focused = State.getFocusedConcepts();
    const narrative = GameLogic.calculateTapestryNarrative(); // Recalculate
    const themes = GameLogic.calculateFocusThemes(); // Recalculate

    let html = '<h3>Core Essence</h3><div class="summary-section">';
    Data.elementNames.forEach(elName => {
        const key = Data.elementNameToKey[elName];
        const score = scores[key];
        const label = Utils.getScoreLabel(score);
        const interpretation = Data.elementDetails[elName]?.scoreInterpretations?.[label] || "N/A";
        html += `<p><strong>${Data.elementDetails[elName]?.name || elName} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`;
    });
    html += '</div><hr>'; // End Core Essence

    html += '<h3>Focused Tapestry</h3><div class="summary-section">';
    if (focused.size > 0) {
        html += `<p><em>${narrative || "No narrative generated."}</em></p>`;
        html += '<strong>Focused Concepts:</strong><ul>';
        const discovered = State.getDiscoveredConcepts();
        focused.forEach(id => {
            const name = discovered.get(id)?.concept?.name || `Concept ID ${id}`;
            html += `<li>${name}</li>`;
        });
        html += '</ul>';

        if (themes.length > 0) {
            html += '<strong>Dominant Themes:</strong><ul>';
            themes.slice(0, 3).forEach(theme => {
                html += `<li>${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})</li>`;
            });
             html += '</ul>';
        } else {
             html += '<strong>Dominant Themes:</strong><p>No strong themes detected among focused concepts.</p>';
        }
    } else {
        html += '<p>No concepts are currently focused. Mark concepts in your Grimoire to build your Tapestry.</p>';
    }
    html += '</div>'; // End Focused Tapestry

    summaryContentDiv.innerHTML = html;
}

// --- Study Screen UI ---
export function displayStudyScreenContent() {
    if (!Utils.isDataReady()) return;
    console.log("UI: Displaying Study Screen Content");
    updateInsightDisplays(); // Includes updating research buttons based on cost/insight
    displayDailyRituals();
    applyOnboardingPhaseUI(State.getOnboardingPhase()); // Ensure visibility based on phase
}

export function displayResearchButtons() {
    if (!Utils.isDataReady() || !researchButtonContainer) return;
    researchButtonContainer.innerHTML = ''; // Clear previous
    const insight = State.getInsight();
    const attunement = State.getAttunement();

    // Free Research Button
    if (freeResearchButton) {
        const available = State.isFreeResearchAvailable();
        freeResearchButton.classList.toggle('hidden', !available);
        freeResearchButton.disabled = !available;
        freeResearchButton.textContent = available ? "Perform Daily Meditation (Free Research)" : "Daily Meditation Performed";
        // freeResearchButton.onclick = available ? GameLogic.handleFreeResearchClick : null; // Handled in main.js setup
    }

    // Element Research Buttons
    Data.elementNames.forEach(elName => {
        const key = Data.elementNameToKey[elName];
        const currentAttunement = attunement[key] || 0;
        let currentCost = Config.BASE_RESEARCH_COST; // Calculate cost based on attunement
        if (currentAttunement > 80) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 5);
        else if (currentAttunement > 50) currentCost = Math.max(5, Config.BASE_RESEARCH_COST - 3);

        const canAfford = insight >= currentCost;
        const fullName = Data.elementDetails[elName]?.name || elName;
        const button = document.createElement('button');
        button.classList.add('button', 'research-button');
        button.dataset.elementKey = key;
        button.dataset.cost = currentCost;
        button.disabled = !canAfford;
        button.title = `Focus on ${fullName} (Cost: ${currentCost} Insight)`;
        button.innerHTML = `
            <span class="research-el-icon" style="color: ${Utils.getElementColor(elName)};">
                <i class="${Utils.getElementIcon(fullName)}"></i>
            </span>
            <span class="research-el-name">${fullName}</span>
            <span class="research-el-cost">${currentCost} <i class="fas fa-brain insight-icon"></i></span>`;
        // button.addEventListener('click', GameLogic.handleResearchClick); // Added in main.js
        researchButtonContainer.appendChild(button);
    });

    // Guidance Button Update
    if (seekGuidanceButton) {
        seekGuidanceButton.disabled = insight < Config.GUIDED_REFLECTION_COST;
    }
    if (guidedReflectionCostDisplay) {
        guidedReflectionCostDisplay.textContent = Config.GUIDED_REFLECTION_COST;
    }
}

export function displayDailyRituals() {
     if (!Utils.isDataReady() || !dailyRitualsDisplay) return;
     dailyRitualsDisplay.innerHTML = ''; // Clear previous
     const completed = State.getState().completedRituals.daily || {};
     const focused = State.getFocusedConcepts();
     let activeRituals = [...Data.dailyRituals]; // Start with base daily rituals

     // Add applicable focus rituals
     if (Data.focusRituals) {
         Data.focusRituals.forEach(ritual => {
             if (!ritual.requiredFocusIds || ritual.requiredFocusIds.length === 0) return;
             const requiredIds = new Set(ritual.requiredFocusIds);
             let allFocused = true;
             for (const id of requiredIds) {
                 if (!focused.has(id)) {
                     allFocused = false;
                     break;
                 }
             }
             if (allFocused) {
                 activeRituals.push({ ...ritual, isFocusRitual: true });
             }
         });
     }

     if (activeRituals.length === 0) {
         dailyRitualsDisplay.innerHTML = '<li>No daily rituals available.</li>';
         return;
     }

     activeRituals.forEach(ritual => {
         const completedData = completed[ritual.id] || { completed: false, progress: 0 };
         const isCompleted = completedData.completed;
         const li = document.createElement('li');
         li.classList.toggle('completed', isCompleted);
         if(ritual.isFocusRitual) li.classList.add('focus-ritual');

         let rewardText = '';
         if (ritual.reward) {
             if (ritual.reward.type === 'insight') {
                 rewardText = `(+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`;
             } else if (ritual.reward.type === 'attunement') {
                 const elName = ritual.reward.element === 'All' ? 'All' : (Data.elementKeyToFullName[ritual.reward.element] || ritual.reward.element);
                 rewardText = `(+${ritual.reward.amount} ${elName} Attun.)`;
             } else if (ritual.reward.type === 'token') {
                 rewardText = `(+1 ${ritual.reward.tokenType || 'Token'})`;
             }
         }
         li.innerHTML = `${ritual.description} <span class="ritual-reward">${rewardText}</span>`;
         dailyRitualsDisplay.appendChild(li);
     });
}

export function displayResearchStatus(message) {
    if (researchStatus) {
        researchStatus.textContent = message;
    }
}

export function displayResearchResults(results) {
    if (!Utils.isDataReady() || !researchOutput) return;

    // Clear placeholder only if there are actual results
    if (results.concepts.length > 0 || results.repositoryItems.length > 0) {
         const placeholder = researchOutput.querySelector('p > i');
         if(placeholder) placeholder.parentNode.remove();
    }

     // Display duplicate message if needed
     if (results.duplicateInsightGain > 0) {
         const dupeMsg = document.createElement('p');
         dupeMsg.classList.add('duplicate-message');
         dupeMsg.innerHTML = `<i class="fas fa-info-circle"></i> Gained ${results.duplicateInsightGain.toFixed(0)} Insight from duplicate research echoes.`;
         // Prepend or append as preferred
         researchOutput.prepend(dupeMsg);
          // Auto-remove after a delay?
         setTimeout(() => dupeMsg.remove(), 5000);
     }

    // Display concepts
    results.concepts.forEach(concept => {
        // Avoid adding duplicates visually if already present from previous research
        if (!researchOutput.querySelector(`.research-result-item[data-concept-id="${concept.id}"]`)) {
            const resultItemDiv = document.createElement('div');
            resultItemDiv.classList.add('research-result-item');
            resultItemDiv.dataset.conceptId = concept.id;

            const cardElement = renderCard(concept, 'research-output'); // Render the card
            resultItemDiv.appendChild(cardElement);

            // Add Action Buttons Container
            const actionDiv = document.createElement('div');
            actionDiv.classList.add('research-actions');

            // Add Button
            const addButton = document.createElement('button');
            addButton.textContent = "Add to Grimoire";
            addButton.classList.add('button', 'small-button', 'research-action-button', 'add-button');
            addButton.dataset.conceptId = concept.id;
            // addButton.onclick assigned in main.js

            // Sell Button
            let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
            const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
            const sellButton = document.createElement('button');
            sellButton.textContent = `Sell (${sellValue.toFixed(1)}) `; // Show value
            sellButton.innerHTML += `<i class="fas fa-brain insight-icon"></i>`; // Add icon
            sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button');
            sellButton.dataset.conceptId = concept.id;
            sellButton.dataset.context = 'research';
            sellButton.title = `Sell this concept for ${sellValue.toFixed(1)} Insight.`;
            // sellButton.onclick assigned in main.js

            actionDiv.appendChild(addButton);
            actionDiv.appendChild(sellButton);
            resultItemDiv.appendChild(actionDiv);

            researchOutput.appendChild(resultItemDiv);
        }
    });

    // Display repository items
    results.repositoryItems.forEach(item => {
         if (researchOutput.querySelector(`[data-repo-id="${item.id}"]`)) return; // Avoid duplicates visually

         const itemDiv = document.createElement('div');
         itemDiv.classList.add('repository-item-discovery');
         itemDiv.dataset.repoId = item.id;
         let iconClass = 'fa-question-circle';
         let typeName = 'Item';
         if (item.type === 'scene') { iconClass = 'fa-scroll'; typeName = 'Scene Blueprint'; }
         else if (item.type === 'insight') { iconClass = 'fa-lightbulb'; typeName = 'Insight Fragment'; }

         itemDiv.innerHTML = `<h4><i class="fas ${iconClass}"></i> ${typeName} Discovered!</h4><p>${item.text || `You've uncovered the '${item.name}'. View it in the Repository.`}</p>`;
         researchOutput.prepend(itemDiv); // Prepend for visibility
         // Auto-remove after delay?
         setTimeout(() => itemDiv.remove(), 7000);
    });

     // If still empty after trying to add results
     if (researchOutput.children.length === 0) {
         researchOutput.innerHTML = '<p><i>Familiar thoughts echo... Perhaps try a different focus or deepen existing knowledge?</i></p>';
     }
}

export function updateResearchButtonAfterAction(conceptId, action) {
    const itemDiv = researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
    if (!itemDiv) return;

    const addButton = itemDiv.querySelector('.add-button');
    const sellButton = itemDiv.querySelector('.sell-button');

    if (action === 'add') {
        if (addButton) {
            addButton.textContent = "In Grimoire";
            addButton.disabled = true;
        }
        if (sellButton) {
            sellButton.remove(); // Remove sell option once added
        }
    } else if (action === 'sell') {
        itemDiv.remove(); // Remove the whole item from research notes
         // Check if research output is now empty
         if (researchOutput && researchOutput.children.length === 0) {
             researchOutput.innerHTML = '<p><i>Research results cleared.</i></p>';
             displayResearchStatus("Ready for new research.");
         }
    }
}


// --- Grimoire Screen UI ---
export function updateGrimoireCounter() {
    if (grimoireCountSpan) {
        grimoireCountSpan.textContent = State.getDiscoveredConcepts().size;
    }
}

export function populateGrimoireFilters() {
    if (!Utils.isDataReady()) return;
    if (grimoireTypeFilter) {
        grimoireTypeFilter.innerHTML = '<option value="All">All Types</option>';
        Data.cardTypeKeys.forEach(type => {
            const option = document.createElement('option');
            option.value = type; option.textContent = type;
            grimoireTypeFilter.appendChild(option);
        });
    }
    if (grimoireElementFilter) {
        grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>';
        Data.elementNames.forEach(fullName => {
            const name = Data.elementDetails[fullName]?.name || fullName;
            const option = document.createElement('option');
            option.value = fullName; option.textContent = name; // Use full name for value matching logic
            grimoireElementFilter.appendChild(option);
        });
    }
}

export function displayGrimoire(filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All") {
    if (!Utils.isDataReady() || !grimoireContentDiv) return;
    grimoireContentDiv.innerHTML = ''; // Clear previous
    const discoveredMap = State.getDiscoveredConcepts();

    if (discoveredMap.size === 0) {
        grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty. Conduct Research to discover Concepts!</p>';
        return;
    }

    let discoveredArray = Array.from(discoveredMap.values());

    // Filtering
    const conceptsToDisplay = discoveredArray.filter(data => {
        if (!data || !data.concept) return false;
        const concept = data.concept;
        const typeMatch = (filterType === "All") || (concept.cardType === filterType);
        // Handle element filtering carefully - filterElement is the Full Name
        const elementKey = filterElement !== "All" ? Data.elementNameToKey[filterElement] : "All";
        const elementMatch = (elementKey === "All") || (concept.primaryElement === elementKey);
        const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity);
        return typeMatch && elementMatch && rarityMatch;
    });

    // Sorting
    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 };
    conceptsToDisplay.sort((a, b) => {
        if (!a.concept || !b.concept) return 0;
        switch (sortBy) {
            case 'name': return a.concept.name.localeCompare(b.concept.name);
            case 'type': return (Data.cardTypeKeys.indexOf(a.concept.cardType) - Data.cardTypeKeys.indexOf(b.concept.cardType)) || a.concept.name.localeCompare(b.concept.name); // Sort by predefined order
            case 'rarity': return (rarityOrder[a.concept.rarity] || 0) - (rarityOrder[b.concept.rarity] || 0) || a.concept.name.localeCompare(b.concept.name);
            default: return a.discoveredTime - b.discoveredTime; // discovered (default)
        }
    });

    if (conceptsToDisplay.length === 0) {
        grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filters.</p>`;
    } else {
        conceptsToDisplay.forEach(data => {
            const cardElement = renderCard(data.concept, 'grimoire'); // Render card for grimoire context
            grimoireContentDiv.appendChild(cardElement);
        });
    }
}

// Helper to refresh grimoire based on current filters
export function refreshGrimoireDisplay() {
     if (grimoireScreen && !grimoireScreen.classList.contains('hidden')) {
         displayGrimoire(
             grimoireTypeFilter?.value || "All",
             grimoireElementFilter?.value || "All",
             grimoireSortOrder?.value || "discovered",
             grimoireRarityFilter?.value || "All"
         );
     }
}


// --- Card Rendering ---
export function renderCard(concept, context = 'grimoire') {
    if (!Utils.isDataReady()) return document.createElement('div');
    if (!concept || typeof concept.id === 'undefined') {
        console.warn("renderCard called with invalid concept:", concept);
        const errDiv = document.createElement('div'); errDiv.textContent = "Error rendering card"; errDiv.style.color = 'red'; return errDiv;
    }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card');
    cardDiv.classList.add(`rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = `View ${concept.name}`;

    const discoveredData = State.getDiscoveredConcepts().get(concept.id);
    const isDiscovered = !!discoveredData;
    const isFocused = State.getFocusedConcepts().has(concept.id);
    const artUnlocked = discoveredData?.artUnlocked || false;
    const isOnboardingPhase1 = State.getOnboardingPhase() <= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;

    const grimoireStampHTML = isDiscovered ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : '';
    // Only show focus stamp if focus is unlocked (Phase 2+) and concept is focused
    const focusStampHTML = !isOnboardingPhase1 && isFocused ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const cardTypeIcon = Utils.getCardTypeIcon(concept.cardType);

    let affinitiesHTML = '';
    if (concept.elementScores && Data.elementKeyToFullName) {
        Object.entries(concept.elementScores).forEach(([key, score]) => {
            const level = Utils.getAffinityLevel(score);
            if (level && Data.elementKeyToFullName[key]) {
                const fullName = Data.elementKeyToFullName[key];
                const color = Utils.getElementColor(fullName); // Use full name
                const levelClass = level === "High" ? "affinity-high" : "";
                const iconClass = Utils.getElementIcon(fullName); // Use full name
                const elementNameDetail = Data.elementDetails[fullName]?.name || fullName;
                affinitiesHTML += `<span class="affinity ${levelClass}" style="border-color: ${color}; color: ${color}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="${elementNameDetail} Affinity: ${level} (${score.toFixed(1)})"><i class="${iconClass}"></i>${level.substring(0,1)}</span> `;
            }
        });
    }

    // Visuals: Prioritize unlocked art, then base visual handle, then placeholder icon
    let visualContent = '';
    const unlockedVisual = artUnlocked ? (concept.visualHandleUnlocked || concept.visualHandle) : null;
    const baseVisual = concept.visualHandle;

    if (unlockedVisual) {
        visualContent = `<img src="placeholder_art/${unlockedVisual}.png" alt="${concept.name} Art" class="card-art-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"> <i class="fas fa-star card-visual-placeholder card-art-unlocked" style="display: none;" title="Enhanced Art Placeholder"></i>`;
    } else if (baseVisual) {
         // Assume base visual is also an image for consistency, or adjust logic if it can be an icon
         visualContent = `<img src="placeholder_art/${baseVisual}.png" alt="${concept.name}" class="card-art-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"> <i class="fas fa-image card-visual-placeholder" style="display: none;" title="Art Placeholder"></i>`;
         // If baseVisual can be icon: visualContent = `<i class="fas fa-${baseVisual} card-visual-placeholder" title="Visual Placeholder"></i>`;
    }
     else {
        visualContent = `<i class="fas fa-question card-visual-placeholder" title="Visual Placeholder"></i>`;
    }


    // Sell button HTML (Only for Grimoire context)
    let sellButtonHTML = '';
    if (context === 'grimoire') {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;
        sellButtonHTML = `<button class="button small-button secondary-button sell-button card-sell-button"
                                  data-concept-id="${concept.id}"
                                  data-context="grimoire"
                                  title="Sell this concept for ${sellValue.toFixed(1)} Insight."
                                  > {/* onclick assigned in main.js */}
                             Sell <i class="fas fa-brain insight-icon"></i>${sellValue.toFixed(1)}
                          </button>`;
    }

    cardDiv.innerHTML = `
        <div class="card-header">
            <i class="${cardTypeIcon} card-type-icon" title="${concept.cardType}"></i>
            <span class="card-name">${concept.name}</span>
            <span class="card-stamps">${focusStampHTML}${grimoireStampHTML}</span>
        </div>
        <div class="card-visual">
            ${visualContent}
        </div>
        <div class="card-footer">
            <div class="card-affinities">${affinitiesHTML || '<small style="color:#888; font-style: italic;">Basic Affinity</small>'}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
            ${sellButtonHTML} {/* Inject sell button HTML */}
        </div>`;

    // Add main click listener for popup (excluding sell button clicks)
    if (context !== 'no-click') {
        cardDiv.addEventListener('click', (event) => {
            // Prevent opening popup if a button inside the card was clicked
            if (event.target.closest('button')) {
                return;
            }
            showConceptDetailPopup(concept.id); // Use direct function call
        });
    }

    if (context === 'research-output') {
        cardDiv.title = `Click to view details for ${concept.name} (Not yet in Grimoire)`;
        // Remove potential duplicate sell button added by innerHTML if logic flaw exists
        cardDiv.querySelector('.card-footer .sell-button')?.remove(); // Sell handled by research notes buttons
    } else if (context === 'grimoire') {
        // Ensure the sell button's onclick is correctly assigned via main.js event delegation
    }

    return cardDiv;
}


// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    if (!Utils.isDataReady()) return;
    // Find concept in base data first
    const conceptData = Data.concepts.find(c => c.id === conceptId);
    if (!conceptData) {
        console.error("Concept data not found for ID:", conceptId);
        return;
    }

    const discoveredData = State.getDiscoveredConcepts().get(conceptId);
    const inGrimoire = !!discoveredData;
    // Check if it's currently in the research output (even if not in grimoire)
    const inResearchNotes = !inGrimoire && researchOutput?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`);
    const currentPhase = State.getOnboardingPhase();

    GameLogic.setCurrentPopupConcept(conceptId); // Inform logic module

    // --- Populate Basic Info ---
    if (popupConceptName) popupConceptName.textContent = conceptData.name;
    if (popupConceptType) popupConceptType.textContent = conceptData.cardType;
    if (popupCardTypeIcon) popupCardTypeIcon.className = `${Utils.getCardTypeIcon(conceptData.cardType)} card-type-icon`;
    if (popupDetailedDescription) popupDetailedDescription.textContent = conceptData.detailedDescription || "No detailed description available.";

    // --- Populate Visual ---
    const artUnlocked = discoveredData?.artUnlocked || false;
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = ''; // Clear previous
        let visualContent = '';
        const unlockedVisual = artUnlocked ? (conceptData.visualHandleUnlocked || conceptData.visualHandle) : null;
        const baseVisual = conceptData.visualHandle;

        if (unlockedVisual) {
             visualContent = `<img src="placeholder_art/${unlockedVisual}.png" alt="${conceptData.name} Art" class="card-art-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"> <i class="fas fa-star card-visual-placeholder card-art-unlocked" style="display: none;" title="Enhanced Art Placeholder"></i>`;
        } else if (baseVisual) {
             visualContent = `<img src="placeholder_art/${baseVisual}.png" alt="${conceptData.name}" class="card-art-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"> <i class="fas fa-image card-visual-placeholder" style="display: none;" title="Art Placeholder"></i>`;
        } else {
             visualContent = `<i class="fas fa-question card-visual-placeholder" title="Visual Placeholder"></i>`;
        }
        popupVisualContainer.innerHTML = visualContent;
    }


    // --- Populate Analysis ---
    const scores = State.getScores();
    const distance = Utils.euclideanDistance(scores, conceptData.elementScores);
    displayPopupResonance(distance);
    displayPopupRecipeComparison(conceptData, scores); // Pass user scores
    displayPopupRelatedConcepts(conceptData);

    // --- Notes (Only if in Grimoire and past phase 1) ---
    const showNotes = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.STUDY_INSIGHT;
    if (myNotesSection && myNotesTextarea && saveMyNoteButton) {
        myNotesSection.classList.toggle('hidden', !showNotes);
        if (showNotes) {
            myNotesTextarea.value = discoveredData.notes || "";
            noteSaveStatusSpan.textContent = "";
            // saveMyNoteButton.onclick assigned in main.js setup
        }
    }

    // --- Evolution (Only if in Grimoire and past phase 3) ---
    const showEvolution = inGrimoire && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;
    if (popupEvolutionSection) {
        popupEvolutionSection.classList.toggle('hidden', !showEvolution);
        if (showEvolution) {
            displayEvolutionSection(conceptData, discoveredData); // discoveredData passed
        }
    }


    // --- Action Buttons ---
    updateGrimoireButtonStatus(conceptId, inResearchNotes);
    updateFocusButtonStatus(conceptId); // Handles own visibility based on grimoire status & phase
    updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes); // Pass grimoire status


    // --- Show Popup ---
    if (conceptDetailPopup) conceptDetailPopup.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}


function displayPopupResonance(distance) {
    if (!popupResonanceSummary) return;
    let resonanceLabel, resonanceClass, message;

    if (distance === Infinity || isNaN(distance)) {
        resonanceLabel = "N/A";
        resonanceClass = "";
        message = "(Cannot compare profiles)";
    } else if (distance < 2.5) {
        resonanceLabel = "Very High"; resonanceClass = "resonance-high";
        message = "Strongly aligns with your core profile.";
    } else if (distance < 4.0) {
        resonanceLabel = "High"; resonanceClass = "resonance-high";
        message = "Shares significant common ground.";
    } else if (distance < 6.0) {
        resonanceLabel = "Moderate"; resonanceClass = "resonance-medium";
        message = "Some similarities and differences noted.";
    } else if (distance <= Config.DISSONANCE_THRESHOLD) {
        resonanceLabel = "Low"; resonanceClass = "resonance-low";
        message = "Notable divergence from your profile.";
    } else {
        resonanceLabel = "Dissonant"; resonanceClass = "resonance-low";
        message = "Significantly diverges. Reflection suggested if added.";
    }
    popupResonanceSummary.innerHTML = `Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceLabel}</span> <small>(Dist: ${distance.toFixed(1)})</small><br><small>${message}</small> <i class="fas fa-info-circle info-icon" title="How closely this Concept's elemental scores align with your current Core Foundation scores. High resonance suggests strong alignment, Dissonant suggests significant divergence."></i>`;
}


function displayPopupRecipeComparison(conceptData, userCompScores) {
     if (!Utils.isDataReady() || !popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return;
     popupConceptProfile.innerHTML = '';
     popupUserComparisonProfile.innerHTML = '';
     popupComparisonHighlights.innerHTML = '';

     let highlightsHTML = '<p><strong>Key Alignments & Differences:</strong></p>';
     let hasHighlights = false;
     const conceptScores = conceptData.elementScores || {};

     Data.elementNames.forEach(elName => {
         const key = Data.elementNameToKey[elName];
         const fullName = Data.elementKeyToFullName[key];
         if (!fullName) return; // Should not happen if data is consistent

         const conceptScore = conceptScores[key];
         const userScore = userCompScores[key]; // Use passed user scores

         const conceptScoreValid = typeof conceptScore === 'number' && !isNaN(conceptScore);
         const userScoreValid = typeof userScore === 'number' && !isNaN(userScore);

         const conceptDisplay = conceptScoreValid ? conceptScore.toFixed(1) : '?';
         const userDisplay = userScoreValid ? userScore.toFixed(1) : '?';
         const conceptLabel = conceptScoreValid ? Utils.getScoreLabel(conceptScore) : 'N/A';
         const userLabel = userScoreValid ? Utils.getScoreLabel(userScore) : 'N/A';

         const conceptBarWidth = conceptScoreValid ? (conceptScore / 10) * 100 : 0;
         const userBarWidth = userScoreValid ? (userScore / 10) * 100 : 0;
         const color = Utils.getElementColor(fullName); // Use full name
         const elementNameShort = Data.elementDetails[fullName]?.name.substring(0, 11) || elName; // Use full name from details

         // Populate profile columns
         popupConceptProfile.innerHTML += `
             <div>
                 <strong>${elementNameShort}:</strong>
                 <span>${conceptDisplay}</span>
                 <div class="score-bar-container" title="${conceptLabel}">
                     <div style="width: ${conceptBarWidth}%; background-color: ${color};"></div>
                 </div>
             </div>`;
         popupUserComparisonProfile.innerHTML += `
             <div>
                 <strong>${elementNameShort}:</strong>
                 <span>${userDisplay}</span>
                 <div class="score-bar-container" title="${userLabel}">
                     <div style="width: ${userBarWidth}%; background-color: ${color};"></div>
                 </div>
             </div>`;

         // Determine highlights
         if (conceptScoreValid && userScoreValid) {
             const diff = Math.abs(conceptScore - userScore);
             const elementNameDisplay = Data.elementDetails[fullName]?.name || elName; // Use full name

             if (conceptScore >= 7 && userScore >= 7) {
                 highlightsHTML += `<p>• <strong class="match">Strong Alignment</strong> in ${elementNameDisplay} (Both ${conceptLabel} / ${userLabel})</p>`;
                 hasHighlights = true;
             } else if (conceptScore <= 3 && userScore <= 3) {
                 highlightsHTML += `<p>• <strong class="match">Shared Low Emphasis</strong> in ${elementNameDisplay} (Both ${conceptLabel} / ${userLabel})</p>`;
                 hasHighlights = true;
             } else if (diff >= 4) {
                 highlightsHTML += `<p>• <strong class="mismatch">Notable Difference</strong> in ${elementNameDisplay} (Concept is ${conceptLabel}, You are ${userLabel})</p>`;
                 hasHighlights = true;
             }
         }
     });

     if (!hasHighlights) {
         highlightsHTML += '<p><em>No strong alignments or major differences identified.</em></p>';
     }
     popupComparisonHighlights.innerHTML = highlightsHTML;
}

function displayPopupRelatedConcepts(conceptData) {
     if (!Utils.isDataReady() || !popupRelatedConcepts) return;
     popupRelatedConcepts.innerHTML = ''; // Clear previous

     if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
         const details = document.createElement('details');
         details.classList.add('related-concepts-details');

         const summary = document.createElement('summary');
         summary.innerHTML = `Synergies / Related (${conceptData.relatedIds.length}) <i class="fas fa-info-circle info-icon" title="Concepts that have a thematic or functional relationship with this one. Focusing on synergistic concepts together may unlock unique insights or content."></i>`;
         details.appendChild(summary);

         const listDiv = document.createElement('div');
         listDiv.classList.add('related-concepts-list-dropdown');

         let foundCount = 0;
         conceptData.relatedIds.forEach(relatedId => {
             // Find the related concept in the master list
             const relatedConcept = Data.concepts.find(c => c.id === relatedId);
             if (relatedConcept) {
                 const span = document.createElement('span');
                 span.textContent = relatedConcept.name;
                 span.classList.add('related-concept-item');
                 span.title = `Related to: ${relatedConcept.name}`; // Add title for hover info
                 listDiv.appendChild(span);
                 foundCount++;
             } else {
                 console.warn(`Related concept ID ${relatedId} mentioned in concept ${conceptData.id} not found in master list.`);
             }
         });

         if (foundCount > 0) {
             details.appendChild(listDiv);
             popupRelatedConcepts.appendChild(details);
         } else {
             // If relatedIds were listed but none found (data error)
              popupRelatedConcepts.innerHTML = `<p>No specified related concepts found.</p>`;
         }

     } else {
         // If no relatedIds array or it's empty
          popupRelatedConcepts.innerHTML = `<p>No synergies specified for this concept.</p>`;
     }
}


function displayEvolutionSection(conceptData, discoveredData) {
     if (!Utils.isDataReady() || !popupEvolutionSection || !evolveArtButton || !evolveEligibility || !evolveCostSpan) return;

     const isDiscovered = !!discoveredData;
     const canUnlockArt = conceptData.canUnlockArt;
     const alreadyUnlocked = discoveredData?.artUnlocked || false;
     const isFocused = State.getFocusedConcepts().has(conceptData.id);
     const requiredElement = conceptData.primaryElement;
     const hasEnoughInsight = State.getInsight() >= Config.ART_EVOLVE_COST;
     // Check if *any* reflection has been seen
     const hasReflected = State.getState().seenPrompts.size > 0;
     const currentPhase = State.getOnboardingPhase();

     // Check conditions for showing the section at all
     const showSection = isDiscovered && canUnlockArt && !alreadyUnlocked && currentPhase >= Config.ONBOARDING_PHASE.ADVANCED;

     popupEvolutionSection.classList.toggle('hidden', !showSection);
     if (!showSection) {
        evolveArtButton.disabled = true;
        evolveEligibility.classList.add('hidden');
        return; // Don't process further if section is hidden
     }

     // If section is shown, determine eligibility
     evolveCostSpan.textContent = `${Config.ART_EVOLVE_COST}`;
     let eligibilityText = '';
     let canEvolve = true;

     if (!isFocused) {
         eligibilityText += '<li>Requires: Mark as Focus Concept</li>';
         canEvolve = false;
     } else {
         eligibilityText += '<li><i class="fas fa-check"></i> Focused Concept</li>';
     }

     if (!hasReflected) {
         eligibilityText += '<li>Requires: Engage in Reflection (any)</li>';
         canEvolve = false;
     } else {
         eligibilityText += '<li><i class="fas fa-check"></i> Reflection Engaged</li>';
     }

     if (!hasEnoughInsight) {
         eligibilityText += `<li>Requires: ${Config.ART_EVOLVE_COST} Insight (Have ${State.getInsight().toFixed(1)})</li>`;
         canEvolve = false;
     } else {
         eligibilityText += `<li><i class="fas fa-check"></i> Sufficient Insight</li>`;
     }

     evolveEligibility.innerHTML = `<ul>${eligibilityText}</ul>`;
     evolveEligibility.classList.remove('hidden');
     evolveArtButton.disabled = !canEvolve;
     // evolveArtButton.onclick assigned in main.js setup
}


export function updateGrimoireButtonStatus(conceptId, inResearchNotes = false) {
    if (!addToGrimoireButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    addToGrimoireButton.disabled = isDiscovered;
    addToGrimoireButton.textContent = isDiscovered ? "In Grimoire" : "Add to Grimoire";
    addToGrimoireButton.classList.toggle('added', isDiscovered);
    // Visibility depends on whether it's *not* discovered AND available (in research or popup)
    addToGrimoireButton.classList.toggle('hidden', isDiscovered);
}

export function updateFocusButtonStatus(conceptId) {
    if (!markAsFocusButton) return;
    const isDiscovered = State.getDiscoveredConcepts().has(conceptId);
    const isFocused = State.getFocusedConcepts().has(conceptId);
    const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots();
    const phaseAllowsFocus = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.PERSONA_GRIMOIRE;

    const showButton = isDiscovered && phaseAllowsFocus;
    markAsFocusButton.classList.toggle('hidden', !showButton);

    if (showButton) {
        markAsFocusButton.textContent = isFocused ? "Remove Focus" : "Mark as Focus";
        markAsFocusButton.disabled = (slotsFull && !isFocused);
        markAsFocusButton.classList.toggle('marked', isFocused);
        if (markAsFocusButton.disabled && !isFocused) {
            markAsFocusButton.title = `Focus slots full (${State.getFocusSlots()})`;
        } else {
            markAsFocusButton.title = isFocused ? "Remove from Focused Concepts" : "Add to Focused Concepts";
        }
    }
}


export function updatePopupSellButton(conceptId, conceptData, inGrimoire, inResearchNotes) {
    const popupActions = conceptDetailPopup?.querySelector('.popup-actions');
    if (!popupActions || !conceptData) return;

    // Remove existing sell button first
    popupActions.querySelector('.popup-sell-button')?.remove();

    const context = inGrimoire ? 'grimoire' : (inResearchNotes ? 'research' : 'none');

    if (context !== 'none') {
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[conceptData.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default;
        const sellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR;

        const sellButton = document.createElement('button');
        sellButton.classList.add('button', 'small-button', 'secondary-button', 'sell-button', 'popup-sell-button');
        sellButton.textContent = `Sell (${sellValue.toFixed(1)})`;
        sellButton.innerHTML += ` <i class="fas fa-brain insight-icon"></i>`;
        sellButton.dataset.conceptId = conceptId;
        sellButton.dataset.context = context;
        sellButton.title = `Sell this concept from ${context === 'grimoire' ? 'Grimoire' : 'Research Notes'} for ${sellValue.toFixed(1)} Insight.`;
        // sellButton.onclick assigned in main.js

        // Append after focus button if it exists and is visible, otherwise at the end
        if (markAsFocusButton && !markAsFocusButton.classList.contains('hidden')) {
            markAsFocusButton.insertAdjacentElement('afterend', sellButton);
        } else {
            // Append after add button if focus hidden but add is shown
            if (addToGrimoireButton && !addToGrimoireButton.classList.contains('hidden')) {
                 addToGrimoireButton.insertAdjacentElement('afterend', sellButton);
            } else {
                 // Fallback: append to end
                 popupActions.appendChild(sellButton);
            }
        }
    }
}

// --- Reflection Modal UI ---
export function displayReflectionPrompt(promptData, context) {
    if (!reflectionModal || !promptData) {
        console.error("Reflection modal or prompt data missing.");
        return;
    }
    const { title, category, prompt, showNudge, reward } = promptData;

    if (reflectionModalTitle) reflectionModalTitle.textContent = title || "Moment for Reflection";
    if (reflectionElement) reflectionElement.textContent = category || "General";
    if (reflectionPromptText) reflectionPromptText.textContent = prompt.text || "Reflection needed...";
    if (reflectionCheckbox) reflectionCheckbox.checked = false;
    if (scoreNudgeCheckbox && scoreNudgeLabel) {
        scoreNudgeCheckbox.checked = false;
        scoreNudgeCheckbox.classList.toggle('hidden', !showNudge);
        scoreNudgeLabel.classList.toggle('hidden', !showNudge);
    }
    if (confirmReflectionButton) confirmReflectionButton.disabled = true;
    if (reflectionRewardAmount) reflectionRewardAmount.textContent = `${reward.toFixed(1)} Insight`;

    reflectionModal.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Element Library UI ---
export function displayElementLibrary() {
     if (!Utils.isDataReady() || !elementLibraryButtonsDiv || !elementLibraryContentDiv) {
         console.warn("Element Library elements not found, skipping display.");
         return;
     }

     // Check onboarding phase - Hide if not phase 4+
     const showLibrary = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;
     if(elementLibraryDiv) elementLibraryDiv.classList.toggle('hidden-by-flow', !showLibrary);
     if(!showLibrary) return; // Don't populate if hidden

     elementLibraryButtonsDiv.innerHTML = ''; // Clear buttons
     Data.elementNames.forEach(elName => {
         const key = Data.elementNameToKey[elName];
         const button = document.createElement('button');
         button.classList.add('button', 'small-button');
         button.textContent = Data.elementDetails[elName]?.name || elName;
         button.style.borderColor = Utils.getElementColor(elName);
         // button.onclick assigned in main.js setup
         button.dataset.elementKey = key; // Add key for listener
         elementLibraryButtonsDiv.appendChild(button);
     });

     // Clear content area initially or if no element selected yet
     if (!elementLibraryContentDiv.dataset.selectedElement) {
        elementLibraryContentDiv.innerHTML = '<p>Select an Element above to view its deep dive content.</p>';
     } else {
        // If an element was previously selected, redisplay its content
        displayElementDeepDive(elementLibraryContentDiv.dataset.selectedElement);
     }
}

export function displayElementDeepDive(elementKey) {
     if (!Utils.isDataReady() || !elementLibraryContentDiv) return;
     elementLibraryContentDiv.dataset.selectedElement = elementKey; // Store selection

     const deepDiveData = Data.elementDeepDive[elementKey] || [];
     const unlockedLevels = State.getState().unlockedDeepDiveLevels;
     const currentLevel = unlockedLevels[elementKey] || 0;
     const elementName = Data.elementKeyToFullName[elementKey] || elementKey;
     const insight = State.getInsight();

     elementLibraryContentDiv.innerHTML = `<h4>${Data.elementDetails[elementName]?.name || elementName} - Insights</h4>`;

     if (deepDiveData.length === 0) {
         elementLibraryContentDiv.innerHTML += '<p>No deep dive content available.</p>';
         return;
     }

     let displayedContent = false;
     deepDiveData.forEach(levelData => {
         if (levelData.level <= currentLevel) {
             elementLibraryContentDiv.innerHTML += `
                 <div class="library-level">
                     <h5 class="level-title">${levelData.title} (Level ${levelData.level})</h5>
                     <div class="level-content">${levelData.content}</div>
                 </div><hr class="popup-hr">`;
             displayedContent = true;
         }
     });

     if (!displayedContent) {
         elementLibraryContentDiv.innerHTML += '<p>Unlock the first level to begin exploring.</p>';
     }

     const nextLevel = currentLevel + 1;
     const nextLevelData = deepDiveData.find(l => l.level === nextLevel);

     if (nextLevelData) {
         const cost = nextLevelData.insightCost || 0;
         const canAfford = insight >= cost;
         const requirementsMet = true; // Add other checks here if needed later

         elementLibraryContentDiv.innerHTML += `
             <div class="library-unlock">
                 <h5>Next: ${nextLevelData.title} (Level ${nextLevelData.level})</h5>
                 <button class="button small-button unlock-button"
                         data-element-key="${elementKey}"
                         data-level="${nextLevelData.level}"
                         ${!canAfford || !requirementsMet ? 'disabled' : ''}
                         title="${!canAfford ? `Requires ${cost} Insight` : !requirementsMet ? 'Requirements not met' : `Unlock for ${cost} Insight`}">
                     Unlock (Cost: ${cost} <i class="fas fa-brain insight-icon"></i>)
                 </button>
                 ${!canAfford ? `<p class='unlock-error'>Insufficient Insight (${insight.toFixed(1)}/${cost})</p>` : ''}
                 ${!requirementsMet && canAfford ? `<p class='unlock-error'>Other requirements not met.</p>` : ''}
             </div>`;
     } else if (displayedContent) {
         elementLibraryContentDiv.innerHTML += '<p><i>You have unlocked all available insights for this element.</i></p>';
     }
     // Attach listener in main.js for unlock buttons
}

// --- Repository UI ---
export function displayRepositoryContent() {
     if (!Utils.isDataReady()) return;

     // Check onboarding phase
      const showRepository = State.getOnboardingPhase() >= Config.ONBOARDING_PHASE.ADVANCED;
      if (repositoryScreen) repositoryScreen.classList.toggle('hidden-by-flow', !showRepository);
      if(!showRepository) return; // Don't populate if hidden


     const focusUnlocksContainer = repositoryFocusUnlocksDiv;
     const scenesContainer = repositoryScenesDiv;
     const experimentsContainer = repositoryExperimentsDiv;
     const insightsContainer = repositoryInsightsDiv;

     if (!repositoryScreen || !focusUnlocksContainer || !scenesContainer || !experimentsContainer || !insightsContainer) {
         console.error("One or more repository list containers not found!");
         return;
     }
     console.log("UI: Displaying Repository Content");

     focusUnlocksContainer.innerHTML = ''; scenesContainer.innerHTML = ''; experimentsContainer.innerHTML = ''; insightsContainer.innerHTML = '';

     const repoItems = State.getRepositoryItems();
     const unlockedFocusData = State.getUnlockedFocusItems();
     const attunement = State.getAttunement();
     const focused = State.getFocusedConcepts();
     const insight = State.getInsight();

     // Display Focus-Driven Unlocks
     if (unlockedFocusData.size > 0) {
         unlockedFocusData.forEach(unlockId => {
             const unlockData = Data.focusDrivenUnlocks.find(u => u.id === unlockId);
             if (unlockData?.unlocks) {
                 const item = unlockData.unlocks;
                 const div = document.createElement('div');
                 div.classList.add('repository-item', 'focus-unlock-item');
                 let itemHTML = `<h4>${item.name || `Unlock: ${unlockData.id}`} (${item.type})</h4>`;
                 if (unlockData.description) itemHTML += `<p><em>Source: ${unlockData.description}</em></p>`;

                 if (item.type === 'insightFragment') {
                     const insightData = Data.elementalInsights.find(i => i.id === item.id);
                     itemHTML += `<p><em>"${insightData?.text || item.text || "Insight text missing."}"</em></p>`;
                 } else {
                     itemHTML += `<p>Details may be found in the relevant section below.</p>`;
                 }
                 div.innerHTML = itemHTML;
                 focusUnlocksContainer.appendChild(div);
             }
         });
     } else {
         focusUnlocksContainer.innerHTML = '<p>Focus on synergistic combinations of Concepts to unlock special items here.</p>';
     }

     // Display Scene Blueprints
     if (repoItems.scenes.size > 0) {
         repoItems.scenes.forEach(sceneId => {
             const scene = Data.sceneBlueprints.find(s => s.id === sceneId);
             if (scene) {
                  const cost = scene.meditationCost || Config.SCENE_MEDITATION_BASE_COST;
                  const canAfford = insight >= cost;
                  scenesContainer.appendChild(renderRepositoryItem(scene, 'scene', cost, canAfford));
             }
         });
     } else {
         scenesContainer.innerHTML = '<p>No Scene Blueprints discovered yet. Conduct Research.</p>';
     }

     // Display Alchemical Experiments
     let experimentsDisplayed = 0;
     Data.alchemicalExperiments.forEach(exp => {
         const isUnlockedByAttunement = attunement[exp.requiredElement] >= exp.requiredAttunement;
         const alreadyCompleted = repoItems.experiments.has(exp.id); // Check *completed* list

         if (isUnlockedByAttunement) {
             let canAttempt = true;
             let unmetReqs = [];
             // Check focus concepts (IDs)
             if (exp.requiredFocusConceptIds && exp.requiredFocusConceptIds.length > 0) {
                 exp.requiredFocusConceptIds.forEach(reqId => {
                     if (!focused.has(reqId)) {
                         canAttempt = false;
                         const concept = Data.concepts.find(c => c.id === reqId);
                         unmetReqs.push(concept ? concept.name : `ID ${reqId}`);
                     }
                 });
             }
             // Check focus concepts (Types)
             if (exp.requiredFocusConceptTypes && exp.requiredFocusConceptTypes.length > 0) {
                 exp.requiredFocusConceptTypes.forEach(typeReq => {
                     let typeMet = false;
                     const discoveredConceptsMap = State.getDiscoveredConcepts();
                     for (const focusId of focused) {
                         const concept = discoveredConceptsMap.get(focusId)?.concept;
                         if (concept && concept.cardType === typeReq) {
                             typeMet = true;
                             break;
                         }
                     }
                     if (!typeMet) {
                         canAttempt = false;
                         unmetReqs.push(`Type: ${typeReq}`);
                     }
                 });
             }
             // Check insight cost
             const cost = exp.insightCost || Config.EXPERIMENT_BASE_COST;
             const canAfford = insight >= cost;
             if (!canAfford) unmetReqs.push("Insufficient Insight");

              // Only render if unlocked by attunement
             experimentsContainer.appendChild(
                 renderRepositoryItem(exp, 'experiment', cost, canAfford && canAttempt, alreadyCompleted, unmetReqs)
             );
             experimentsDisplayed++;
         }
     });
      if (experimentsDisplayed === 0) {
          experimentsContainer.innerHTML = '<p>Increase Element Attunement to unlock Experiments.</p>';
      }


     // Display Elemental Insights
     if (repoItems.insights.size > 0) {
         const insightsByElement = {};
         Data.elementNames.forEach(elName => insightsByElement[Data.elementNameToKey[elName]] = []);
         repoItems.insights.forEach(insightId => {
             const insight = Data.elementalInsights.find(i => i.id === insightId);
             if (insight && insightsByElement[insight.element]) {
                 insightsByElement[insight.element].push(insight);
             } else if (insight) {
                  // Handle insights unlocked via experiments if not predefined
                  if (!insightsByElement[insight.element]) insightsByElement[insight.element] = [];
                  insightsByElement[insight.element].push(insight);
             }
         });
         let insightsHTML = '';
         for (const key in insightsByElement) {
             if (insightsByElement[key].length > 0) {
                 insightsHTML += `<h5>${Data.elementDetails[Data.elementKeyToFullName[key]]?.name || key} Insights:</h5><ul>`;
                 insightsByElement[key].sort((a, b) => a.id.localeCompare(b.id)).forEach(insight => {
                     insightsHTML += `<li>"${insight.text}"</li>`;
                 });
                 insightsHTML += `</ul>`;
             }
         }
         insightsContainer.innerHTML = insightsHTML || '<p>No Elemental Insights collected yet. Conduct Research.</p>';
     } else {
         insightsContainer.innerHTML = '<p>No Elemental Insights collected yet. Conduct Research.</p>';
     }

     // Display Milestones
     displayMilestones();
 }

function renderRepositoryItem(item, type, cost, canAfford, completed = false, unmetReqs = []) {
     const div = document.createElement('div');
     div.classList.add('repository-item', `repo-item-${type}`);
     if (completed) div.classList.add('completed');

     let actionsHTML = '';
     let buttonDisabled = !canAfford || completed;
     let buttonTitle = '';
     let buttonText = '';

     if (type === 'scene') {
         buttonText = `Meditate (${cost} <i class="fas fa-brain insight-icon"></i>)`;
         if (!canAfford) buttonTitle = `Requires ${cost} Insight`;
         actionsHTML = `<button class="button small-button" data-scene-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
     } else if (type === 'experiment') {
         buttonText = `Attempt (${cost} <i class="fas fa-brain insight-icon"></i>)`;
         if (completed) {
             buttonTitle = "Already Completed";
             buttonDisabled = true;
         } else if (unmetReqs.length > 0) {
             buttonTitle = `Requires: ${unmetReqs.join(', ')}`;
             buttonDisabled = true; // Disable if requirements not met
         } else if (!canAfford) {
             buttonTitle = `Requires ${cost} Insight`;
             buttonDisabled = true;
         }
         actionsHTML = `<button class="button small-button" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}">${buttonText}</button>`;
          if (completed) actionsHTML += ` <span class="completed-text">(Completed)</span>`;
          else if (unmetReqs.length > 0) actionsHTML += ` <small class="req-missing">(Requires: ${unmetReqs.join(', ')})</small>`;
          else if (!canAfford) actionsHTML += ` <small class="req-missing">(Insufficient Insight)</small>`;

     }

     div.innerHTML = `
         <h4>${item.name} ${type === 'experiment' ? `(Req: ${item.requiredAttunement} ${Data.elementKeyToFullName[item.requiredElement]} Attun.)` : ''}</h4>
         <p>${item.description}</p>
         <div class="repo-actions">${actionsHTML}</div>`;
     return div;
 }

// --- Milestones UI ---
export function displayMilestones() {
    if (!Utils.isDataReady() || !milestonesDisplay) return;
    milestonesDisplay.innerHTML = ''; // Clear previous
    const achieved = State.getState().achievedMilestones;

    if (achieved.size === 0) {
        milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>';
        return;
    }

    // Sort achieved milestones based on the order in the master list
    const sortedAchievedIds = Data.milestones
                                .filter(m => achieved.has(m.id))
                                .map(m => m.id);

    sortedAchievedIds.forEach(milestoneId => {
        const milestone = Data.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            const li = document.createElement('li');
            li.textContent = `✓ ${milestone.description}`;
            milestonesDisplay.appendChild(li);
        }
    });
}

// --- Settings Popup UI ---
export function showSettings() {
    if (settingsPopup) settingsPopup.classList.remove('hidden');
    if (popupOverlay) popupOverlay.classList.remove('hidden');
}

// --- Initial UI Setup Helper ---
export function setupInitialUI() {
    console.log("UI: Setting up initial UI state...");
    // Hide elements meant to be revealed by onboarding
    applyOnboardingPhaseUI(Config.ONBOARDING_PHASE.START);
    // Hide main nav initially
    if(mainNavBar) mainNavBar.classList.add('hidden');
    // Show welcome screen
    showScreen('welcomeScreen');
    // Update load button visibility
    if(loadButton) loadButton.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY));
}

console.log("ui.js loaded.");
