// --- START OF FILE ui.js ---
// js/ui.js - UI Rendering & Interactions (Enhanced v4.10 + XP/Leveling v1.0)

import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js';
import {
    elementDetails, elementKeyToFullName,
    concepts, questionnaireGuided,
    reflectionPrompts, elementDeepDive, dailyRituals, milestones, focusRituals,
    sceneBlueprints, alchemicalExperiments, elementalInsights, focusDrivenUnlocks,
    cardTypeKeys, elementNames,
    grimoireShelves, elementalDilemmas,
    onboardingWelcomeIntro, onboardingWorkshopIntro, onboardingRepositoryIntro,
    elementInteractionThemes, cardTypeThemes
} from '../data.js';

console.log("ui.js loading... (Enhanced v4.10 + XP/Leveling v1.0)");

// --- Helper Function for Image Errors ---
function handleImageError(imgElement) { if (imgElement) { imgElement.style.display = 'none'; const visualContainer = imgElement.closest('.card-visual, .popup-visual'); const placeholder = visualContainer?.querySelector('.card-visual-placeholder'); if (placeholder) { placeholder.style.display = 'flex'; placeholder.title = `Art Placeholder (Load Failed: ${imgElement.src?.split('/')?.pop() || 'unknown'})`; } } }
window.handleImageError = handleImageError;

// --- DOM Element References ---
const getElement = (id) => document.getElementById(id);

// General UI
const saveIndicator = getElement('saveIndicator');
const screens = document.querySelectorAll('.screen');
const popupOverlay = getElement('popupOverlay');
const milestoneAlert = getElement('milestoneAlert');
const milestoneAlertText = getElement('milestoneAlertText');
const toastElement = getElement('toastNotification');
const toastMessageElement = getElement('toastMessage');

// Drawer Navigation
const drawerToggle = getElement('drawerToggle');
const sideDrawer = getElement('sideDrawer');
const drawerSettingsButton = getElement('drawerSettings');
const drawerThemeToggle = getElement('drawerThemeToggle');
const drawerGrimoireCountSpan = getElement('drawerGrimoireCount');
const helpBtn = getElement('helpBtn');

// Welcome Screen
const welcomeScreen = getElement('welcomeScreen');
const loadButton = getElement('loadButton');
const startGuidedButton = getElement('startGuidedButton');

// Questionnaire Screen
const questionnaireScreen = getElement('questionnaireScreen');
const elementProgressHeader = getElement('elementProgressHeader');
const questionContent = getElement('questionContent');
const progressText = getElement('progressText');
const dynamicScoreFeedback = getElement('dynamicScoreFeedback');
const feedbackElementSpan = getElement('feedbackElement');
const feedbackScoreSpan = getElement('feedbackScore');
const feedbackScoreBar = getElement('feedbackScoreBar');
const prevElementButton = getElement('prevElementButton');
const nextElementButton = getElement('nextElementButton');

// Persona Screen
const personaScreen = getElement('personaScreen');
const personaDetailedView = getElement('personaDetailedView');
const personaSummaryView = getElement('personaSummaryView');
const showDetailedViewBtn = getElement('showDetailedViewBtn');
const showSummaryViewBtn = getElement('showSummaryViewBtn');
const personaElementDetailsDiv = getElement('personaElementDetails');
const userInsightDisplayPersona = getElement('userInsightDisplayPersona');
const insightLogContainer = getElement('insightLogContainer');
const focusedConceptsDisplay = getElement('focusedConceptsDisplay');
const focusedConceptsHeader = getElement('focusedConceptsHeader');
const tapestryNarrativeP = getElement('tapestryNarrative');
const personaThemesList = getElement('personaThemesList');
const summaryContentDiv = getElement('summaryContent');
const summaryCoreEssenceTextDiv = getElement('summaryCoreEssenceText');
const summaryTapestryInfoDiv = getElement('summaryTapestryInfo');
const personaScoreChartCanvas = getElement('personaScoreChartCanvas');
const addInsightButton = getElement('addInsightButton');
const elementalDilemmaButton = getElement('elementalDilemmaButton');
const exploreSynergyButton = getElement('exploreSynergyButton');
const suggestSceneButton = getElement('suggestSceneButton');
const sceneSuggestCostDisplay = getElement('sceneSuggestCostDisplay');
const deepDiveTriggerButton = getElement('deepDiveTriggerButton');
const sceneSuggestionOutput = getElement('sceneSuggestionOutput');
const suggestedSceneContent = getElement('suggestedSceneContent');
// **NEW**: XP Bar and Token Button
const xpFill = getElement('xpFill');
const tokenCountSpan = getElement('tokenCount');
const openSanctumBtn = getElement('openSanctumBtn');

// Workshop Screen
const workshopScreen = getElement('workshopScreen');
const userInsightDisplayWorkshop = getElement('userInsightDisplayWorkshop');
const researchBenchArea = getElement('workshop-research-area');
const elementResearchButtonsContainer = getElement('element-research-buttons');
const dailyActionsContainer = getElement('daily-actions');
const freeResearchButtonWorkshop = getElement('freeResearchButtonWorkshop');
const seekGuidanceButtonWorkshop = getElement('seekGuidanceButtonWorkshop');
const guidedReflectionCostDisplayWorkshop = getElement('guidedReflectionCostDisplayWorkshop');
const grimoireLibraryContainer = getElement('workshop-library-area');
const grimoireControlsWorkshop = getElement('grimoire-controls-workshop');
const grimoireFilterControls = grimoireControlsWorkshop?.querySelector('.filter-controls');
const grimoireTypeFilterWorkshop = getElement('grimoireTypeFilterWorkshop');
const grimoireElementFilterWorkshop = getElement('grimoireElementFilterWorkshop');
const grimoireRarityFilterWorkshop = getElement('grimoireRarityFilterWorkshop');
const grimoireSortOrderWorkshop = getElement('grimoireSortOrderWorkshop');
const grimoireSearchInputWorkshop = getElement('grimoireSearchInputWorkshop');
const grimoireFocusFilterWorkshop = getElement('grimoireFocusFilterWorkshop');
const grimoireShelvesWorkshop = getElement('grimoire-shelves-workshop');
const grimoireGridWorkshop = getElement('grimoire-grid-workshop');

// Repository Screen
const repositoryScreen = getElement('repositoryScreen');
const repositoryFocusUnlocksDiv = getElement('repositoryFocusUnlocks')?.querySelector('.repo-list');
const repositoryScenesDiv = getElement('repositoryScenes')?.querySelector('.repo-list');
const repositoryExperimentsDiv = getElement('repositoryExperiments')?.querySelector('.repo-list');
const repositoryInsightsDiv = getElement('repositoryInsights')?.querySelector('.repo-list');
const milestonesDisplay = getElement('milestonesDisplay');
const dailyRitualsDisplayRepo = getElement('dailyRitualsDisplayRepo');

// Concept Detail Popup
const conceptDetailPopup = getElement('conceptDetailPopup');
const popupCardTypeIcon = getElement('popupCardTypeIcon');
const popupConceptName = getElement('popupConceptName');
const popupConceptType = getElement('popupConceptType');
const popupVisualContainer = getElement('popupVisualContainer');
const popupBriefDescription = getElement('popupBriefDescription');
const popupDetailedDescription = getElement('popupDetailedDescription');
const popupResonanceGaugeSection = getElement('popupResonanceGaugeSection');
const popupResonanceGaugeContainer = getElement('popupResonanceGaugeContainer');
const popupResonanceGaugeBar = getElement('popupResonanceGaugeBar');
const popupResonanceGaugeLabel = getElement('popupResonanceGaugeLabel');
const popupResonanceGaugeText = getElement('popupResonanceGaugeText');
const popupRelatedConceptsTags = getElement('popupRelatedConceptsTags');
const popupLoreSection = getElement('popupLoreSection'); // Legacy Lore
const popupCardUnlocksSection = getElement('popupCardUnlocksSection'); // **NEW** Area for new unlocks
const popupCardUnlocksContent = getElement('popupCardUnlocksContent'); // **NEW** Container for unlock buttons
const popupRecipeDetailsSection = getElement('popupRecipeDetails');
const popupComparisonHighlights = getElement('popupComparisonHighlights');
const popupConceptProfile = getElement('popupConceptProfile');
const popupUserComparisonProfile = getElement('popupUserComparisonProfile');
const myNotesSection = getElement('myNotesSection');
const myNotesTextarea = getElement('myNotesTextarea');
const saveMyNoteButton = getElement('saveMyNoteButton');
const noteSaveStatusSpan = getElement('noteSaveStatus');
const addToGrimoireButton = getElement('addToGrimoireButton');
const markAsFocusButton = getElement('markAsFocusButton');

// Research Results Popup
const researchResultsPopup = getElement('researchResultsPopup');
const researchPopupContent = getElement('researchPopupContent');
const closeResearchResultsPopupButton = getElement('closeResearchResultsPopupButton');
const researchPopupStatus = getElement('researchPopupStatus');
const confirmResearchChoicesButton = getElement('confirmResearchChoicesButton');

// Reflection Modal
const reflectionModal = getElement('reflectionModal');
const reflectionModalTitle = getElement('reflectionModalTitle');
const closeReflectionModalButton = getElement('closeReflectionModalButton');
const reflectionElement = getElement('reflectionElement');
const reflectionPromptText = getElement('reflectionPromptText');
const reflectionCheckbox = getElement('reflectionCheckbox');
const scoreNudgeCheckbox = getElement('scoreNudgeCheckbox');
const scoreNudgeLabel = getElement('scoreNudgeLabel');
const confirmReflectionButton = getElement('confirmReflectionButton');
const reflectionRewardAmount = getElement('reflectionRewardAmount');

// Settings Popup
const settingsPopup = getElement('settingsPopup');
const closeSettingsPopupButton = getElement('closeSettingsPopupButton');
const forceSaveButton = getElement('forceSaveButton');
const resetAppButton = getElement('resetAppButton');

// Tapestry Deep Dive Modal
const tapestryDeepDiveModal = getElement('tapestryDeepDiveModal');
const deepDiveTitle = getElement('deepDiveTitle');
const closeDeepDiveButton = getElement('closeDeepDiveButton');
const deepDiveNarrativeP = getElement('deepDiveNarrativeP');
const deepDiveFocusIcons = getElement('deepDiveFocusIcons');
const deepDiveAnalysisNodesContainer = getElement('deepDiveAnalysisNodes');
const deepDiveDetailContent = getElement('deepDiveDetailContent');
const contemplationNodeButton = getElement('contemplationNode');

// Dilemma Modal
const dilemmaModal = getElement('dilemmaModal');
const closeDilemmaModalButton = getElement('closeDilemmaModalButton');
const dilemmaSituationText = getElement('dilemmaSituationText');
const dilemmaQuestionText = getElement('dilemmaQuestionText');
const dilemmaSlider = getElement('dilemmaSlider');
const dilemmaSliderMinLabel = getElement('dilemmaSliderMinLabel');
const dilemmaSliderMaxLabel = getElement('dilemmaSliderMaxLabel');
const dilemmaSliderValueDisplay = getElement('dilemmaSliderValueDisplay');
const dilemmaNudgeCheckbox = getElement('dilemmaNudgeCheckbox');
const confirmDilemmaButton = getElement('confirmDilemmaButton');

// Info Popup
const infoPopupElement = getElement('infoPopup');
const infoPopupContent = getElement('infoPopupContent');
const closeInfoPopupButton = getElement('closeInfoPopupButton');
const confirmInfoPopupButton = getElement('confirmInfoPopupButton');

// Onboarding Elements
const onboardingOverlay = getElement('onboardingOverlay');
const onboardingPopup = getElement('onboardingPopup');
const onboardingContent = getElement('onboardingContent');
const onboardingProgressSpan = getElement('onboardingProgress'); // Tour progress 1/N
const onboardingTitle = getElement('onboarding-heading'); // Tour title
const onboardingPrevButton = getElement('onboardingPrevButton');
const onboardingNextButton = getElement('onboardingNextButton');
const onboardingSkipButton = getElement('onboardingSkipButton'); // Skip ALL button
const skipTourBtn = getElement('skipTourBtn'); // Skip CURRENT tour button
const onboardingHighlight = getElement('onboardingHighlight');

// **NEW**: Element Sanctum Modal
const sanctumModal = getElement('sanctumModal');
const sanctumGrid = getElement('sanctumGrid');
const closeSanctumBtn = getElement('closeSanctumBtn');

// --- Module-level Variables ---
let personaChartInstance = null;
let toastTimeout = null;
let milestoneTimeout = null;
let insightBoostTimeoutId = null;
let contemplationTimeoutId = null;
let previousScreenId = 'welcomeScreen';

// --- Replicate Helper from main.js ---
function getTourForScreen(screenId){ switch(screenId){ case 'workshopScreen': return onboardingWorkshopIntro; case 'repositoryScreen': return onboardingRepositoryIntro; case 'welcomeScreen': case 'questionnaireScreen': case 'personaScreen': default: return onboardingWelcomeIntro; } }

// --- Utility UI Functions ---
export function showTemporaryMessage(message, duration = Config.TOAST_DURATION, isGuidance = false) { if (!toastElement || !toastMessageElement) return; toastMessageElement.textContent = message; toastElement.classList.toggle('guidance-toast', isGuidance); if (toastTimeout) clearTimeout(toastTimeout); toastElement.classList.remove('hidden', 'visible'); void toastElement.offsetWidth; toastElement.classList.add('visible'); toastElement.classList.remove('hidden'); toastTimeout = setTimeout(() => { toastElement.classList.remove('visible'); setTimeout(() => { if (toastElement && !toastElement.classList.contains('visible')) toastElement.classList.add('hidden'); }, 500); toastTimeout = null; }, duration); }
export function showMilestoneAlert(text) { if (!milestoneAlert || !milestoneAlertText) return; milestoneAlertText.textContent = `Milestone: ${text}`; milestoneAlert.classList.remove('hidden'); if (milestoneTimeout) clearTimeout(milestoneTimeout); milestoneTimeout = setTimeout(hideMilestoneAlert, Config.MILESTONE_ALERT_DURATION); }
export function hideMilestoneAlert() { if (milestoneAlert) milestoneAlert.classList.add('hidden'); if (milestoneTimeout) { clearTimeout(milestoneTimeout); milestoneTimeout = null; } }
export function hidePopups() { let researchPopupIsOpenAndPending = false; if (researchResultsPopup && !researchResultsPopup.classList.contains('hidden')) { const pendingItems = researchPopupContent?.querySelectorAll('.research-result-item[data-processed="false"], .research-result-item[data-choice-made="pending_dissonance"]'); if (pendingItems && pendingItems.length > 0) researchPopupIsOpenAndPending = true; } document.querySelectorAll('.popup:not(.onboarding-popup)').forEach(popup => { if (!(popup.id === 'researchResultsPopup' && researchPopupIsOpenAndPending)) popup.classList.add('hidden'); }); const anyGeneralPopupVisible = document.querySelector('.popup:not(.hidden):not(.onboarding-popup)'); const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible'); if (!anyGeneralPopupVisible && popupOverlay && !onboardingActive) { popupOverlay.classList.add('hidden'); if (typeof GameLogic !== 'undefined' && GameLogic.clearPopupState) GameLogic.clearPopupState(); } else if (!anyGeneralPopupVisible && !onboardingActive && popupOverlay) { popupOverlay.classList.add('hidden'); } }
export function showInfoPopup(message) { if (infoPopupElement && infoPopupContent) { infoPopupContent.textContent = message; infoPopupElement.classList.remove('hidden'); const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible'); if (popupOverlay && !onboardingActive) popupOverlay.classList.remove('hidden'); } else { showTemporaryMessage("Error displaying info.", 2000); } }

// --- Screen Management ---
export function updateDrawerLinks() { const done = State.getState().questionnaireCompleted; if(sideDrawer) sideDrawer.querySelectorAll('.drawer-link.hidden-by-flow').forEach(btn => btn.classList.toggle('hidden', !done)); }
export function showScreen(screenId) { const currentState = State.getState(); const isPostQuestionnaire = currentState.questionnaireCompleted; const targetScreenElement = getElement(screenId); if (!targetScreenElement) { screens.forEach(screen => screen?.classList.add('hidden', 'current')); const welcomeEl = getElement('welcomeScreen'); if(welcomeEl) { welcomeEl.classList.remove('hidden'); welcomeEl.classList.add('current'); } screenId = 'welcomeScreen'; } else { screens.forEach(screen => { if (screen) { screen.classList.add('hidden'); screen.classList.remove('current'); } }); targetScreenElement.classList.remove('hidden'); targetScreenElement.classList.add('current'); } updateDrawerLinks(); if (sideDrawer) sideDrawer.querySelectorAll('.drawer-link[data-target]').forEach(button => button?.classList.toggle('active', button.dataset.target === screenId)); try { switch (screenId) { case 'personaScreen': if (isPostQuestionnaire) { const justFinishedQuestionnaire = previousScreenId === 'questionnaireScreen'; const showDetailed = personaDetailedView?.classList.contains('current') ?? true; if (justFinishedQuestionnaire) togglePersonaView(false); else { if (showDetailed) GameLogic.displayPersonaScreenLogic(); else displayPersonaSummary(); } displayInsightLog(); updateXPDisplay(); // **NEW**: Update XP on showing Persona screen } else { showScreen('welcomeScreen'); return; } break; case 'workshopScreen': if (isPostQuestionnaire) { displayWorkshopScreenContent(); refreshGrimoireDisplay(); showHintOnce('freeResearch', '#freeResearchButtonWorkshop', '<b>Free research!</b><br>Click once per day to draw new cards.'); } else { showScreen('welcomeScreen'); return; } break; case 'repositoryScreen': if (isPostQuestionnaire) displayRepositoryContent(); else { showScreen('welcomeScreen'); return; } break; case 'questionnaireScreen': if (!isPostQuestionnaire) { const index = State.getState().currentElementIndex; if (index >= 0 && index < elementNames.length) displayElementQuestions(index); else initializeQuestionnaireUI(); } else { showScreen('personaScreen'); return; } break; case 'welcomeScreen': updateDrawerLinks(); break; } } catch (error) { console.error(`Error during display logic for screen ${screenId}:`, error); } if (['questionnaireScreen', 'workshopScreen', 'personaScreen', 'repositoryScreen'].includes(screenId)) window.scrollTo(0, 0); previousScreenId = screenId; }
export function toggleDrawer () { if (!sideDrawer || !drawerToggle) return; const willOpen = !sideDrawer.classList.contains('open'); if (willOpen) { sideDrawer.classList.add('open'); drawerToggle.setAttribute('aria-expanded', 'true'); sideDrawer.setAttribute('aria-hidden', 'false'); } else { drawerToggle.focus(); sideDrawer.classList.remove('open'); drawerToggle.setAttribute('aria-expanded', 'false'); sideDrawer.setAttribute('aria-hidden', 'true'); } const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible'); if (popupOverlay && !onboardingActive) popupOverlay.classList.toggle('hidden', willOpen === false); }

// --- Insight & XP Display ---
export function updateInsightDisplays() { const insightValue = State.getInsight(); const insight = insightValue.toFixed(1); if (userInsightDisplayPersona) userInsightDisplayPersona.textContent = insight; if (userInsightDisplayWorkshop) userInsightDisplayWorkshop.textContent = insight; updateInsightBoostButtonState(); updateDependentUI(); if (personaScreen?.classList.contains('current') && insightLogContainer && !insightLogContainer.classList.contains('log-hidden')) displayInsightLog(); }
function updateDependentUI() { const insightValue = State.getInsight(); const researchBtnsContainer = getElement('element-research-buttons'); if (researchBtnsContainer) { researchBtnsContainer.querySelectorAll('.initial-discovery-element').forEach(buttonCard => { const cost = parseFloat(buttonCard.dataset.cost); const canAfford = insightValue >= cost; const isFree = buttonCard.dataset.isFree === 'true'; const key = buttonCard.dataset.elementKey; const shortName = key && elementKeyToFullName?.[key] ? Utils.getElementShortName(elementKeyToFullName[key]) : 'Element'; const shouldBeDisabled = !isFree && !canAfford; buttonCard.classList.toggle('disabled', shouldBeDisabled); buttonCard.classList.toggle('clickable', !shouldBeDisabled); const actionDiv = buttonCard.querySelector('.element-action'); if (actionDiv) actionDiv.classList.toggle('disabled', shouldBeDisabled); if (isFree) { const freeLeft = State.getInitialFreeResearchRemaining(); buttonCard.title = `Conduct FREE research on ${shortName}. (${freeLeft} left total)`; } else if (shouldBeDisabled) buttonCard.title = `Research ${shortName} (Requires ${cost.toFixed(1)} Insight)`; else buttonCard.title = `Research ${shortName} (Cost: ${cost.toFixed(1)} Insight)`; }); } if (seekGuidanceButtonWorkshop && guidedReflectionCostDisplayWorkshop) { const cost = Config.GUIDED_REFLECTION_COST; const canAfford = insightValue >= cost; seekGuidanceButtonWorkshop.disabled = !canAfford; seekGuidanceButtonWorkshop.title = canAfford ? `Spend ${cost.toFixed(1)} Insight for Guided Reflection.` : `Requires ${cost.toFixed(1)} Insight.`; } if (personaScreen?.classList.contains('current')) { personaElementDetailsDiv?.querySelectorAll('.element-deep-dive-container .unlock-button').forEach(button => { const cost = parseFloat(button.dataset.cost); const canAfford = insightValue >= cost; button.disabled = !canAfford; button.title = canAfford ? `Unlock for ${cost.toFixed(1)} Insight` : `Requires ${cost.toFixed(1)} Insight`; const errorMsg = button.parentElement?.querySelector('.unlock-error'); if (errorMsg) errorMsg.style.display = canAfford ? 'none' : 'block'; }); updateSuggestSceneButtonState(); } if (repositoryScreen?.classList.contains('current')) { repositoryScreen.querySelectorAll('.repo-actions button').forEach(button => { const sceneId = button.dataset.sceneId; const experimentId = button.dataset.experimentId; let cost = 0; let baseTitle = ""; let actionLabel = ""; if (sceneId) { const scene = sceneBlueprints.find(s => s.id === sceneId); cost = scene?.meditationCost || Config.SCENE_MEDITATION_BASE_COST; baseTitle = `Meditate on ${scene?.name || 'Scene'}`; actionLabel = `Meditate (${cost.toFixed(1)})`; button.disabled = insightValue < cost; button.title = insightValue >= cost ? baseTitle : `${baseTitle} (Requires ${cost.toFixed(1)} Insight)`; } else if (experimentId) { const experiment = alchemicalExperiments.find(e => e.id === experimentId); cost = experiment?.insightCost || Config.EXPERIMENT_BASE_COST; baseTitle = `Attempt ${experiment?.name || 'Experiment'}`; actionLabel = `Attempt (${cost.toFixed(1)})`; const otherReqsMet = button.title ? !button.title.toLowerCase().includes('requires:') : true; if (otherReqsMet) { button.disabled = insightValue < cost; button.title = (insightValue >= cost) ? baseTitle : `${baseTitle} (Requires ${cost.toFixed(1)} Insight)`; } } else return; const icon = button.querySelector('i'); if(icon) button.innerHTML = `<i class="${icon.className}"></i> ${actionLabel}`; else button.textContent = actionLabel; }); } updateContemplationButtonState(); if (conceptDetailPopup && !conceptDetailPopup.classList.contains('hidden')) { // Update legacy lore buttons popupLoreContent?.querySelectorAll('.unlock-lore-button').forEach(button => { const cost = parseFloat(button.dataset.cost); const canAfford = insightValue >= cost; button.disabled = !canAfford; button.title = canAfford ? `Unlock for ${cost.toFixed(1)} Insight` : `Requires ${cost.toFixed(1)} Insight`; }); // Update NEW unlock buttons popupCardUnlocksContent?.querySelectorAll('.card-unlock-button').forEach(button => { const cost = parseFloat(button.dataset.cost); const canAfford = insightValue >= cost; button.disabled = !canAfford; button.title = canAfford ? `Unlock for ${cost.toFixed(1)} Insight` : `Requires ${cost.toFixed(1)} Insight`; }); } }
export function displayInsightLog() { if (!insightLogContainer) return; const logEntries = State.getInsightLog(); insightLogContainer.innerHTML = '<h5>Recent Insight Changes:</h5>'; if (!insightLogContainer.hasAttribute('aria-live')) insightLogContainer.setAttribute('aria-live', 'polite'); if (logEntries.length === 0) { insightLogContainer.innerHTML += '<p><i>No recent changes logged.</i></p>'; return; } logEntries.slice().reverse().forEach(entry => { const entryDiv = document.createElement('div'); entryDiv.classList.add('insight-log-entry'); const amountClass = entry.amount > 0 ? 'log-amount-gain' : 'log-amount-loss'; const sign = entry.amount > 0 ? '+' : ''; const sourceText = entry.source?.replace(/</g, "&lt;").replace(/>/g, "&gt;") || 'Unknown Source'; entryDiv.innerHTML = `<span class="log-timestamp">${entry.timestamp}</span><span class="log-source">${sourceText}</span><span class="log-amount ${amountClass}">${sign}${entry.amount.toFixed(1)}</span>`; insightLogContainer.appendChild(entryDiv); }); }
export function updateInsightBoostButtonState() { const btn = getElement('addInsightButton'); if (!btn) return; const cooldownEnd = State.getInsightBoostCooldownEnd(); const now = Date.now(); if (insightBoostTimeoutId) { clearTimeout(insightBoostTimeoutId); insightBoostTimeoutId = null; } if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); btn.disabled = true; btn.innerHTML = `<i class="fas fa-hourglass-half"></i> ${remaining}s`; btn.title = `Boost available in ${remaining} seconds.`; insightBoostTimeoutId = setTimeout(updateInsightBoostButtonState, 1000); } else { btn.disabled = false; btn.innerHTML = `<i class="fas fa-plus"></i> <span class="visually-hidden">Add Insight</span>`; btn.title = `Get Insight boost (${Config.INSIGHT_BOOST_AMOUNT}, ${Config.INSIGHT_BOOST_COOLDOWN / 60000} min cooldown)`; } }
// **NEW**: Update XP Bar and Token Count/Button State
export function updateXPDisplay(){
   if (!xpFill || !tokenCountSpan || !openSanctumBtn) return; // Exit if elements not found

   // Use a simplified total XP for the bar (could be refined later)
   const elementXP = State.getElementXP();
   const currentLevelXP = Object.values(elementXP).reduce((sum, xp) => sum + xp, 0); // Simple sum for now

   // Find the *next* level threshold across *all* elements for a rough progress idea
   // This isn't perfect but gives a sense of overall progress towards *any* token
   let totalNeededForNextToken = Infinity;
   const elementLevels = State.getElementLevel(); // This is an object {A: 0, I: 1, ...}
   for (const key in elementLevels) {
       const currentLevel = elementLevels[key];
       if (currentLevel < Config.MAX_ELEMENT_LEVEL) {
           const neededForThisElement = Config.XP_LEVEL_THRESHOLDS[currentLevel + 1] ?? Infinity;
           // Calculate XP *remaining* for this element
           const remainingXP = Math.max(0, neededForThisElement - (elementXP[key] || 0));
           totalNeededForNextToken = Math.min(totalNeededForNextToken, remainingXP);
       }
   }
   // Rough percentage calculation (this needs refinement for better accuracy/feel)
   // Using a fixed arbitrary 'total XP for next token' might be better UI feel
   const arbitraryNextLevelTotal = 100; // Let's just use 100 for the bar length always
   const displayXP = currentLevelXP % arbitraryNextLevelTotal; // Show progress within the current 100 block
   const percentage = (displayXP / arbitraryNextLevelTotal) * 100;

   xpFill.style.width = `${Math.min(100, percentage)}%`; // Cap at 100% visually

   // Update token count and button state
   const tokenCount = State.getLevelTokens();
   tokenCountSpan.textContent = tokenCount;
   openSanctumBtn.disabled = (tokenCount <= 0);
   openSanctumBtn.title = tokenCount > 0 ? `Spend ${tokenCount} Level Token(s)` : "Earn XP to gain Level Tokens";
   openSanctumBtn.classList.toggle('blinking', tokenCount > 0); // Add blinking class if tokens available
}

// --- Questionnaire UI ---
export function initializeQuestionnaireUI() { State.updateElementIndex(0); displayElementQuestions(0); if (dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; document.documentElement.style.setProperty('--progress-pct', `${(1 / Config.MAX_ONBOARDING_PHASE) * 100}%`); }
export function updateElementProgressHeader(activeIndex) { if (!elementProgressHeader) return; elementProgressHeader.innerHTML = ''; elementNames.forEach((elementNameKey, index) => { const stepDiv = document.createElement('div'); stepDiv.classList.add('step'); const elementData = elementDetails[elementNameKey] || {}; const fullName = elementData.name || elementNameKey; const shortName = Utils.getElementShortName(fullName); stepDiv.textContent = shortName; stepDiv.title = fullName; stepDiv.classList.toggle('completed', index < activeIndex); stepDiv.classList.toggle('active', index === activeIndex); elementProgressHeader.appendChild(stepDiv); }); }
export function displayElementQuestions(index) { const actualIndex = State.getState().currentElementIndex; const displayIndex = (actualIndex >= 0 && actualIndex < elementNames.length) ? actualIndex : index; if (displayIndex >= elementNames.length) { GameLogic.finalizeQuestionnaire(); return; } const elementNameKey = elementNames[displayIndex]; const elementData = elementDetails[elementNameKey] || {}; const fullName = elementData.name || elementNameKey; const questions = questionnaireGuided[elementNameKey] || []; if (!questionContent) return; const elementAnswers = State.getState().userAnswers?.[elementNameKey] || {}; questionContent.innerHTML = `<div class="element-intro"><h2>${fullName}</h2><p><em>${elementData.coreQuestion || '...'}</em></p><p>${elementData.coreConcept || '...'}</p><p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p></div>`; let questionsHTML = ''; if (questions.length > 0) { questions.forEach(q => { questionsHTML += `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`; const savedAnswer = elementAnswers[q.qId]; if (q.type === "slider") { const sliderValue = (savedAnswer !== undefined && !isNaN(parseFloat(savedAnswer))) ? parseFloat(savedAnswer) : q.defaultValue; questionsHTML += `<div class="slider-container"><label for="${q.qId}" class="visually-hidden">${q.text}</label><input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${sliderValue}" data-question-id="${q.qId}" data-type="slider"><div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div><p class="value-text" aria-live="polite">Selected: <span id="display_${q.qId}">${parseFloat(sliderValue).toFixed(1)}</span></p><p class="slider-feedback" id="feedback_${q.qId}"></p></div>`; } else if (q.type === "radio") { questionsHTML += `<fieldset class="radio-options"><legend class="visually-hidden">${q.text}</legend>`; q.options.forEach(opt => { const checked = savedAnswer === opt.value ? 'checked' : ''; questionsHTML += `<label class="form-group ${checked}" for="${q.qId}_${opt.value}"><input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-type="radio"><span>${opt.value}</span></label>`; }); questionsHTML += `</fieldset>`; } else if (q.type === "checkbox") { questionsHTML += `<fieldset class="checkbox-options"><legend class="visually-hidden">${q.text} (Max ${q.maxChoices || 2})</legend>`; q.options.forEach(opt => { const checked = Array.isArray(savedAnswer) && savedAnswer.includes(opt.value) ? 'checked' : ''; questionsHTML += `<label class="form-group ${checked}" for="${q.qId}_${opt.value}"><input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${checked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox"><span>${opt.value}</span></label>`; }); questionsHTML += `</fieldset>`; } questionsHTML += `</div></div>`; }); } else { questionsHTML = '<p><i>(Assessment based on general understanding.)</i></p>'; } questionContent.innerHTML += questionsHTML; questionContent.querySelectorAll('.q-input').forEach(input => { const eventType = (input.type === 'range') ? 'input' : 'change'; input.removeEventListener(eventType, handleQuestionnaireInput); input.addEventListener(eventType, handleQuestionnaireInput); }); questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => { checkbox.removeEventListener('change', handleCheckboxInput); checkbox.addEventListener('change', handleCheckboxInput); }); questionContent.querySelectorAll('.radio-options label.form-group, .checkbox-options label.form-group').forEach(label => { const input = label.querySelector('input'); if (input) { const updateLabelClass = () => { if (input.type === 'radio') { const fieldset = label.closest('fieldset'); fieldset?.querySelectorAll('label.form-group').forEach(l => l.classList.remove('checked')); } label.classList.toggle('checked', input.checked); }; input.removeEventListener('change', updateLabelClass); input.addEventListener('change', updateLabelClass); label.classList.toggle('checked', input.checked); } }); questionContent.querySelectorAll('.slider.q-input').forEach(slider => updateSliderFeedbackText(slider, elementNameKey)); updateDynamicFeedback(elementNameKey, elementAnswers); updateElementProgressHeader(displayIndex); if (progressText) progressText.textContent = `Element ${displayIndex + 1} / ${elementNames.length}: ${fullName}`; if (prevElementButton) prevElementButton.style.visibility = (displayIndex > 0) ? 'visible' : 'hidden'; if (nextElementButton) nextElementButton.textContent = (displayIndex === elementNames.length - 1) ? "View Initial Discoveries" : "Next Element"; const pct = ((displayIndex + 1) / elementNames.length) * 100; document.documentElement.style.setProperty('--progress-pct', `${pct}%`); }
function handleQuestionnaireInput(event) { GameLogic.handleQuestionnaireInputChange(event); } function handleCheckboxInput(event) { GameLogic.handleCheckboxChange(event); }
export function updateSliderFeedbackText(sliderElement, elementNameKey) { if (!sliderElement || sliderElement.type !== 'range') return; const qId = sliderElement.dataset.questionId; const feedbackElement = getElement(`feedback_${qId}`); const display = getElement(`display_${qId}`); if (!feedbackElement || !display) return; const currentValue = parseFloat(sliderElement.value); display.textContent = currentValue.toFixed(1); const elementData = elementDetails?.[elementNameKey]; if (!elementData?.scoreInterpretations) { feedbackElement.textContent = `(Score: ${currentValue.toFixed(1)})`; return; } const interpretations = elementData.scoreInterpretations; const scoreLabel = Utils.getScoreLabel(currentValue); const interpretationText = interpretations[scoreLabel] || `...`; feedbackElement.textContent = interpretationText; feedbackElement.title = `Meaning of score ${currentValue.toFixed(1)} (${scoreLabel})`; }
export function updateDynamicFeedback(elementNameKey, currentAnswers) { if (!dynamicScoreFeedback || !feedbackElementSpan || !feedbackScoreSpan || !feedbackScoreBar) { if(dynamicScoreFeedback) dynamicScoreFeedback.style.display = 'none'; return; } const elementData = elementDetails?.[elementNameKey]; if (!elementData || !GameLogic.calculateElementScore) { dynamicScoreFeedback.style.display = 'none'; return; } const tempScore = GameLogic.calculateElementScore(elementNameKey, currentAnswers); const scoreLabel = Utils.getScoreLabel(tempScore); const shortName = Utils.getElementShortName(elementData.name || elementNameKey); feedbackElementSpan.textContent = shortName; feedbackScoreSpan.textContent = tempScore.toFixed(1); let labelSpan = feedbackScoreSpan.nextElementSibling; if (!labelSpan || !labelSpan.classList.contains('score-label')) { labelSpan = dynamicScoreFeedback.querySelector('.score-label'); if (!labelSpan) { labelSpan = document.createElement('span'); labelSpan.classList.add('score-label'); feedbackScoreSpan.parentNode?.insertBefore(labelSpan, feedbackScoreSpan.nextSibling); } } if (labelSpan) labelSpan.textContent = ` (${scoreLabel})`; feedbackScoreBar.style.width = `${Math.max(0, Math.min(100, tempScore * 10))}%`; dynamicScoreFeedback.style.display = 'block'; }
export function getQuestionnaireAnswers() { const answers = {}; if (!questionContent) return answers; const inputs = questionContent.querySelectorAll('.q-input'); inputs.forEach(input => { const qId = input.dataset.questionId; const type = input.dataset.type; if (!qId) return; if (type === 'slider') answers[qId] = parseFloat(input.value); else if (type === 'radio') { if (input.checked) answers[qId] = input.value; } else if (type === 'checkbox') { if (!answers[qId]) answers[qId] = []; if (input.checked) answers[qId].push(input.value); } }); questionContent.querySelectorAll('.checkbox-options').forEach(container => { const name = container.querySelector('input[type="checkbox"]')?.name; if(name && !answers[name]) answers[name] = []; }); return answers; }

// --- Persona Action Buttons ---
export function updateElementalDilemmaButtonState() { const btn = getElement('elementalDilemmaButton'); if (!btn) return; const questionnaireCompleted = State.getState().questionnaireCompleted; btn.disabled = !questionnaireCompleted; btn.title = btn.disabled ? "Complete Experimentation first" : "Engage with Dilemma for Insight."; }
export function updateExploreSynergyButtonStatus(status) { const btn = getElement('exploreSynergyButton'); if (!btn) return; const hasFocus = State.getFocusedConcepts().size >= 2; btn.disabled = !hasFocus; btn.classList.remove('highlight-synergy', 'highlight-tension'); btn.textContent = "Explore Synergy"; if (!hasFocus) btn.title = "Focus at least 2 concepts"; else { btn.title = "Explore synergies/tensions"; if (status === 'synergy') { btn.classList.add('highlight-synergy'); btn.title += " (Synergy detected!)"; btn.textContent = "Explore Synergy ✨"; } else if (status === 'tension') { btn.classList.add('highlight-tension'); btn.title += " (Tension detected!)"; btn.textContent = "Explore Synergy ⚡"; } else if (status === 'both') { btn.classList.add('highlight-synergy', 'highlight-tension'); btn.title += " (Synergy & Tension detected!)"; btn.textContent = "Explore Synergy 💥"; } } }
export function updateSuggestSceneButtonState() { const btn = getElement('suggestSceneButton'); if (!btn) return; const costDisplay = getElement('sceneSuggestCostDisplay'); const hasFocus = State.getFocusedConcepts().size > 0; const canAfford = State.getInsight() >= Config.SCENE_SUGGESTION_COST; btn.disabled = !hasFocus || !canAfford; if (!hasFocus) btn.title = "Focus concepts first"; else if (!canAfford) btn.title = `Requires ${Config.SCENE_SUGGESTION_COST.toFixed(1)} Insight`; else btn.title = `Suggest scenes (${Config.SCENE_SUGGESTION_COST.toFixed(1)} Insight)`; if(costDisplay) costDisplay.textContent = Config.SCENE_SUGGESTION_COST.toFixed(1); }

// --- Persona Screen UI ---
export function togglePersonaView(showDetailed) { if (personaDetailedView && personaSummaryView && showDetailedViewBtn && showSummaryViewBtn) { const detailedIsCurrent = personaDetailedView.classList.contains('current'); if (showDetailed && !detailedIsCurrent) { personaDetailedView.classList.remove('hidden'); personaDetailedView.classList.add('current'); personaSummaryView.classList.add('hidden'); personaSummaryView.classList.remove('current'); showDetailedViewBtn.classList.add('active'); showDetailedViewBtn.setAttribute('aria-pressed', 'true'); showSummaryViewBtn.classList.remove('active'); showSummaryViewBtn.setAttribute('aria-pressed', 'false'); GameLogic.displayPersonaScreenLogic(); displayInsightLog(); } else if (!showDetailed && detailedIsCurrent) { personaDetailedView.classList.add('hidden'); personaDetailedView.classList.remove('current'); personaSummaryView.classList.remove('hidden'); personaSummaryView.classList.add('current'); showDetailedViewBtn.classList.remove('active'); showDetailedViewBtn.setAttribute('aria-pressed', 'false'); showSummaryViewBtn.classList.add('active'); showSummaryViewBtn.setAttribute('aria-pressed', 'true'); displayPersonaSummary(); } } }
export function displayPersonaScreen() { if (!personaElementDetailsDiv) return; personaElementDetailsDiv.innerHTML = ''; const scores = State.getScores(); const showDeepDiveContainer = State.getState().questionnaireCompleted; elementNames.forEach(elementNameKey => { const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elementNameKey); const elementData = elementDetails[elementNameKey]; if (!key || !elementData) return; const score = (scores[key] !== undefined && typeof scores[key] === 'number' && !isNaN(scores[key])) ? scores[key] : 5.0; const scoreLabel = Utils.getScoreLabel(score); const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "..."; const barWidth = Math.max(0, Math.min(100, score * 10)); const color = Utils.getElementColor(elementNameKey); const iconClass = Utils.getElementIcon(elementNameKey); const fullName = elementData.name || elementNameKey; const elementNameShort = Utils.getElementShortName(fullName); const accordionItemDiv = document.createElement('div'); accordionItemDiv.classList.add('accordion-item'); accordionItemDiv.dataset.elementKey = key; accordionItemDiv.style.setProperty('--element-color', color); const button = document.createElement('button'); button.classList.add('accordion-header'); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', `accordion-body-${key}`); button.id = `accordion-header-${key}`; button.innerHTML = `<span class="element-summary-header"><i class="${iconClass} element-icon-indicator" style="color: ${color};" title="${fullName}"></i><strong>${elementNameShort}:</strong><span>${score.toFixed(1)}</span><span class="score-label">(${scoreLabel})</span></span><span class="score-bar-container" title="Score: ${score.toFixed(1)}/10 (${scoreLabel})"><div style="width: ${barWidth}%; background-color: ${color};"></div></span>`; const body = document.createElement('div'); body.classList.add('accordion-body'); body.id = `accordion-body-${key}`; body.setAttribute('role', 'region'); body.setAttribute('aria-labelledby', `accordion-header-${key}`); body.innerHTML = `<div class="element-description"><p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p><details class="element-elaboration"><summary>Elaboration & Examples</summary><div class="collapsible-content"><p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p><p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p></div></details><hr class="content-hr"><p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p><hr class="attunement-hr"><div class="attunement-placeholder"></div><div class="element-deep-dive-container ${showDeepDiveContainer ? '' : 'hidden'}" data-element-key="${key}"></div></div>`; accordionItemDiv.appendChild(button); accordionItemDiv.appendChild(body); personaElementDetailsDiv.appendChild(accordionItemDiv); button.addEventListener('click', () => { const isExpanded = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', !isExpanded); accordionItemDiv.classList.toggle('open', !isExpanded); }); if (showDeepDiveContainer) { const deepDiveContainer = body.querySelector('.element-deep-dive-container'); if(deepDiveContainer) displayElementDeepDive(key, deepDiveContainer); } }); displayElementAttunement(); updateInsightDisplays(); displayFocusedConceptsPersona(); generateTapestryNarrative(); synthesizeAndDisplayThemesPersona(); updateElementalDilemmaButtonState(); updateSuggestSceneButtonState(); GameLogic.checkSynergyTensionStatus(); }
export function displayElementAttunement() { if (!personaElementDetailsDiv) return; const attunement = State.getAttunement(); Object.entries(attunement).forEach(([key, attunementValue]) => { const value = attunementValue || 0; const percentage = Math.max(0, Math.min(100, (value / Config.MAX_ATTUNEMENT) * 100)); const elementNameKey = elementKeyToFullName[key]; if (!elementNameKey) return; const color = Utils.getElementColor(elementNameKey); const targetAccordion = personaElementDetailsDiv.querySelector(`.accordion-item[data-element-key="${key}"]`); const placeholder = targetAccordion?.querySelector('.attunement-placeholder'); if (!placeholder) return; let attunementDisplay = placeholder.querySelector('.attunement-display'); if (!attunementDisplay) { attunementDisplay = document.createElement('div'); attunementDisplay.classList.add('attunement-display'); attunementDisplay.innerHTML = `<div class="attunement-item"><span class="attunement-name">Attunement:</span><div class="attunement-bar-container" title=""><div class="attunement-bar" style="background-color: ${color};"></div></div><i class="fas fa-info-circle info-icon" title="Grows via Research, Reflection, Focusing. High Attunement may unlock content or reduce costs."></i></div>`; placeholder.innerHTML = ''; placeholder.appendChild(attunementDisplay); } const bar = attunementDisplay.querySelector('.attunement-bar'); const container = attunementDisplay.querySelector('.attunement-bar-container'); if (bar) bar.style.width = `${percentage}%`; if (container) container.title = `Current Attunement: ${value.toFixed(1)} / ${Config.MAX_ATTUNEMENT}`; }); }
export function updateFocusSlotsDisplay() { const focused = State.getFocusedConcepts(); const totalSlots = State.getFocusSlots(); if (focusedConceptsHeader) focusedConceptsHeader.innerHTML = `Focused Concepts (${focused.size} / ${totalSlots}) <i class="fas fa-info-circle info-icon" title="Concepts marked as Focus (${focused.size}) out of your available slots (${totalSlots}). Slots increase via Milestones."></i>`; }
export function displayFocusedConceptsPersona() { if (!focusedConceptsDisplay) return; focusedConceptsDisplay.innerHTML = ''; updateFocusSlotsDisplay(); const focused = State.getFocusedConcepts(); const discovered = State.getDiscoveredConcepts(); if (focused.size === 0) { focusedConceptsDisplay.innerHTML = `<div class="focus-placeholder">Focus Concepts from your Workshop Library (tap the ☆)</div>`; return; } focused.forEach(conceptId => { const conceptData = discovered.get(conceptId); if (conceptData?.concept) { const concept = conceptData.concept; const item = document.createElement('div'); item.classList.add('focus-concept-item'); item.dataset.conceptId = concept.id; item.title = `View Details: ${concept.name}`; item.style.cursor = 'pointer'; let backgroundStyle = ''; let imgErrorPlaceholder = ''; if (concept.visualHandle) { const handle = concept.visualHandle; const extension = Config.UNLOCKED_ART_EXTENSION || '.jpg'; const fileName = handle.includes('.') ? handle : `${handle}${extension}`; const imageUrl = `placeholder_art/${fileName}`; backgroundStyle = `background-image: url('${imageUrl}');`; item.classList.add('has-background-image'); imgErrorPlaceholder = `<img src="${imageUrl}" alt="" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none;" onerror="window.handleImageError(this)">`; } item.style = backgroundStyle; let iconClass = Utils.getCardTypeIcon(concept.cardType); let iconColor = 'var(--text-muted-color)'; let iconTitle = concept.cardType; if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement] && elementDetails) { const elementNameKey = elementKeyToFullName[concept.primaryElement]; iconClass = Utils.getElementIcon(elementNameKey); iconColor = Utils.getElementColor(elementNameKey); iconTitle = Utils.getElementShortName(elementDetails[elementNameKey]?.name || elementNameKey); } item.innerHTML = `<i class="${iconClass}" style="color: ${iconColor};" title="${iconTitle}"></i><span class="name">${concept.name}</span><span class="type">(${concept.cardType})</span>${imgErrorPlaceholder}`; focusedConceptsDisplay.appendChild(item); } else { const item = document.createElement('div'); item.classList.add('focus-concept-item', 'missing'); item.textContent = `Error: ID ${conceptId}`; focusedConceptsDisplay.appendChild(item); } }); updateSuggestSceneButtonState(); }
export function generateTapestryNarrative() { if (!tapestryNarrativeP) return; const narrativeHTML = GameLogic.calculateTapestryNarrative(); tapestryNarrativeP.innerHTML = narrativeHTML || 'Mark concepts as "Focus" to generate narrative...'; if (!tapestryNarrativeP.hasAttribute('aria-live')) tapestryNarrativeP.setAttribute('aria-live', 'polite'); }
export function synthesizeAndDisplayThemesPersona() { if (!personaThemesList) return; personaThemesList.innerHTML = ''; if (!personaThemesList.hasAttribute('aria-live')) personaThemesList.setAttribute('aria-live', 'polite'); const themes = GameLogic.calculateFocusThemes(); if (themes.length === 0) { const placeholderText = State.getFocusedConcepts().size > 0 ? 'Focus is currently balanced.' : 'Mark Focused Concepts...'; personaThemesList.innerHTML = `<li>${placeholderText}</li>`; return; } themes.slice(0, 3).forEach((theme, index) => { const li = document.createElement('li'); const elementNameKey = elementKeyToFullName?.[theme.key]; if (!elementNameKey) return; const color = Utils.getElementColor(elementNameKey); const icon = Utils.getElementIcon(elementNameKey); let emphasis = "Influenced by"; if (index === 0 && theme.count >= 3) emphasis = "Strongly Focused on"; else if (index === 0) emphasis = "Primarily Focused on"; li.innerHTML = `<i class="${icon}" style="color: ${color}; margin-right: 5px;" title="${theme.name}"></i> ${emphasis} <strong>${theme.name}</strong> (${theme.count})`; li.style.borderLeft = `3px solid ${color}`; li.style.paddingLeft = '8px'; li.style.marginBottom = '4px'; personaThemesList.appendChild(li); }); }
export function drawPersonaChart(scores) { if (!personaScoreChartCanvas) return; const ctx = personaScoreChartCanvas.getContext('2d'); if (!ctx) return; const computedStyle = getComputedStyle(document.documentElement); const pointLabelFont = computedStyle.fontFamily || 'Arial, sans-serif'; const pointLabelColor = computedStyle.getPropertyValue('--text-muted-color').trim() || '#6c757d'; const tickColor = computedStyle.getPropertyValue('--text-color').trim() || '#333'; const gridColor = Utils.hexToRgba(computedStyle.getPropertyValue('--border-color-dark').trim() || '#adb5bd', 0.3); const chartBackgroundColor = Utils.hexToRgba(computedStyle.getPropertyValue('--background-light').trim() || '#f8f9fa', 0.8); const labels = elementNames.map(nameKey => Utils.getElementShortName(elementDetails[nameKey]?.name || nameKey)); const dataPoints = elementNames.map(nameKey => { const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === nameKey); return scores[key] ?? 0; }); const borderColors = elementNames.map(nameKey => { let colorVar = `--${nameKey.toLowerCase()}-color`; let adaptedColor = computedStyle.getPropertyValue(colorVar).trim(); if (!adaptedColor || !/^#[0-9A-F]{6}$/i.test(adaptedColor)) adaptedColor = Utils.getElementColor(nameKey); return adaptedColor; }); const backgroundColors = borderColors.map(color => Utils.hexToRgba(color, 0.4)); const chartData = { labels: labels, datasets: [{ label: 'Elemental Scores', data: dataPoints, backgroundColor: backgroundColors, borderColor: borderColors, borderWidth: 2, pointBackgroundColor: borderColors, pointBorderColor: chartBackgroundColor, pointHoverBackgroundColor: chartBackgroundColor, pointHoverBorderColor: borderColors, pointRadius: 4, pointHoverRadius: 6 }] }; const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { r: { angleLines: { display: true, color: gridColor }, grid: { color: gridColor }, pointLabels: { font: { size: 11, family: pointLabelFont, weight: 'bold' }, color: pointLabelColor }, suggestedMin: 0, suggestedMax: 10, ticks: { stepSize: 2, backdropColor: chartBackgroundColor, color: tickColor, font: { weight: 'bold' } } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { family: pointLabelFont, weight: 'bold' }, bodyFont: { family: pointLabelFont }, padding: 10, borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, displayColors: false, callbacks: { label: function(context) { let label = context.dataset.label || ''; if (context.label) label = context.label; const score = context.parsed.r; if (score !== null) label += `: ${score.toFixed(1)} (${Utils.getScoreLabel(score)})`; return label; } } } } }; if (personaChartInstance) personaChartInstance.destroy(); try { personaChartInstance = new Chart(ctx, { type: 'radar', data: chartData, options: chartOptions }); } catch (error) { console.error("Error creating Chart.js instance:", error); ctx.clearRect(0, 0, personaScoreChartCanvas.width, personaScoreChartCanvas.height); ctx.fillStyle = 'red'; ctx.font = '14px Arial'; ctx.textAlign = 'center'; ctx.fillText('Error rendering chart.', personaScoreChartCanvas.width / 2, personaScoreChartCanvas.height / 2); } }
export function displayPersonaSummary() { if (!summaryContentDiv || !summaryCoreEssenceTextDiv || !summaryTapestryInfoDiv) { if(summaryContentDiv) summaryContentDiv.innerHTML = '<p>Error loading summary elements.</p>'; return; } summaryCoreEssenceTextDiv.innerHTML = ''; summaryTapestryInfoDiv.innerHTML = ''; const scores = State.getScores(); const focused = State.getFocusedConcepts(); const narrativeHTML = GameLogic.calculateTapestryNarrative(); const themes = GameLogic.calculateFocusThemes(); let coreEssenceHTML = ''; if (elementDetails && elementKeyToFullName) { elementNames.forEach(elNameKey => { const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elNameKey); if (!key) { coreEssenceHTML += `<p><strong>${Utils.getElementShortName(elementDetails[elNameKey]?.name || elNameKey)}:</strong> Error.</p>`; return; } const score = scores[key]; if (typeof score === 'number') { const label = Utils.getScoreLabel(score); const elementData = elementDetails[elNameKey] || {}; const fullName = elementData.name || elNameKey; const interpretation = elementData.scoreInterpretations?.[label] || "..."; coreEssenceHTML += `<p><strong>${Utils.getElementShortName(fullName)} (${score.toFixed(1)} - ${label}):</strong> ${interpretation}</p>`; } else { const fullName = elementDetails[elNameKey]?.name || elNameKey; coreEssenceHTML += `<p><strong>${Utils.getElementShortName(fullName)}:</strong> Score N/A.</p>`; } }); } else { coreEssenceHTML += "<p>Error: Element details not loaded.</p>"; } summaryCoreEssenceTextDiv.innerHTML = coreEssenceHTML; let tapestryHTML = ''; if (focused.size > 0) { tapestryHTML += `<p><em>${narrativeHTML || "..."}</em></p><strong>Focused Concepts:</strong><ul>`; const discovered = State.getDiscoveredConcepts(); focused.forEach(id => { const name = discovered.get(id)?.concept?.name || `ID ${id}`; tapestryHTML += `<li>${name}</li>`; }); tapestryHTML += '</ul>'; if (themes.length > 0) { tapestryHTML += '<strong>Dominant Themes:</strong><ul>'; themes.slice(0, 3).forEach(theme => { const elementNameKey = elementKeyToFullName[theme.key]; if (!elementNameKey) return; const color = Utils.getElementColor(elementNameKey); tapestryHTML += `<li style="border-left: 3px solid ${color}; padding-left: 5px;">${theme.name} Focus (${theme.count} concept${theme.count > 1 ? 's' : ''})</li>`; }); tapestryHTML += '</ul>'; } else { tapestryHTML += '<strong>Dominant Themes:</strong><p>No strong themes detected.</p>'; } } else { tapestryHTML += '<p>Focus Concepts in Workshop!</p>'; } summaryTapestryInfoDiv.innerHTML = tapestryHTML; drawPersonaChart(scores); }

// --- Workshop Screen UI ---
export function displayWorkshopScreenContent() { if (!workshopScreen) return; if (userInsightDisplayWorkshop) userInsightDisplayWorkshop.textContent = State.getInsight().toFixed(1); if (elementResearchButtonsContainer) { elementResearchButtonsContainer.innerHTML = ''; const scores = State.getScores(); const freeResearchLeft = State.getInitialFreeResearchRemaining(); const insight = State.getInsight(); elementNames.forEach(elementNameKey => { const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elementNameKey); if (!key || !elementDetails[elementNameKey]) return; const elementData = elementDetails[elementNameKey]; const score = scores[key] ?? 5.0; const scoreLabel = Utils.getScoreLabel(score); const fullName = elementData.name || elementNameKey; const color = Utils.getElementColor(elementNameKey); const iconClass = Utils.getElementIcon(elementNameKey); const shortName = Utils.getElementShortName(fullName); const elementDiv = document.createElement('div'); elementDiv.classList.add('initial-discovery-element'); elementDiv.dataset.elementKey = key; let costText = ""; let isDisabled = false; let titleText = ""; let isFreeClick = false; const researchCost = Config.BASE_RESEARCH_COST; if (freeResearchLeft > 0) { costText = `Use 1 FREE ★`; titleText = `FREE research on ${shortName}. (${freeResearchLeft} left)`; isFreeClick = true; isDisabled = false; } else { costText = `${researchCost.toFixed(1)} <i class="fas fa-brain insight-icon"></i>`; if (insight < researchCost) { isDisabled = true; titleText = `Requires ${researchCost.toFixed(1)} Insight`; } else { isDisabled = false; titleText = `Research ${shortName} (Cost: ${researchCost.toFixed(1)} Insight)`; } isFreeClick = false; } elementDiv.dataset.cost = researchCost; elementDiv.dataset.isFree = isFreeClick; let rarityCountsHTML = ''; try { const rarityCounts = GameLogic.countUndiscoveredByRarity(key); rarityCountsHTML = `<div class="rarity-counts-display" title="Undiscovered Concepts (Primary: ${shortName})"><span class="rarity-count common" title="${rarityCounts.common} Common"><i class="fas fa-circle"></i> ${rarityCounts.common}</span><span class="rarity-count uncommon" title="${rarityCounts.uncommon} Uncommon"><i class="fas fa-square"></i> ${rarityCounts.uncommon}</span><span class="rarity-count rare" title="${rarityCounts.rare} Rare"><i class="fas fa-star"></i> ${rarityCounts.rare}</span></div>`; } catch (error) { rarityCountsHTML = '<div class="rarity-counts-display error">Counts N/A</div>'; } elementDiv.innerHTML = `<div class="element-header"><i class="${iconClass}" style="color: ${color};"></i><span class="element-name">${shortName}</span></div><div class="element-score-display">${score.toFixed(1)} (${scoreLabel})</div><p class="element-concept">${elementData.coreConcept || '...'}</p>${rarityCountsHTML}<div class="element-action ${isDisabled ? 'disabled' : ''}"><span class="element-cost">${costText}</span></div>${isFreeClick ? `<span class="free-indicator" title="Free Research Available!">★</span>` : ''}`; elementDiv.title = titleText; elementDiv.classList.toggle('disabled', isDisabled); elementDiv.classList.toggle('clickable', !isDisabled); elementResearchButtonsContainer.appendChild(elementDiv); }); } if (freeResearchButtonWorkshop) { const freeAvailable = State.isFreeResearchAvailable(); freeResearchButtonWorkshop.disabled = !freeAvailable; freeResearchButtonWorkshop.innerHTML = freeAvailable ? "Perform Daily Meditation ☆" : "Meditation Performed Today"; freeResearchButtonWorkshop.title = freeAvailable ? "Free research on least attuned element." : "Daily meditation done."; } if (seekGuidanceButtonWorkshop && guidedReflectionCostDisplayWorkshop) { const cost = Config.GUIDED_REFLECTION_COST; const canAfford = State.getInsight() >= cost; seekGuidanceButtonWorkshop.disabled = !canAfford; seekGuidanceButtonWorkshop.title = canAfford ? `Spend ${cost.toFixed(1)} Insight for Guided Reflection.` : `Requires ${cost.toFixed(1)} Insight.`; guidedReflectionCostDisplayWorkshop.textContent = cost.toFixed(1); } }

// --- Grimoire UI ---
export function updateGrimoireCounter() { const count = State.getDiscoveredConcepts().size; if (drawerGrimoireCountSpan) drawerGrimoireCountSpan.textContent = count; }
export function populateGrimoireFilters() { if (grimoireTypeFilterWorkshop) { grimoireTypeFilterWorkshop.innerHTML = '<option value="All">All Types</option>'; cardTypeKeys.forEach(type => { const option = document.createElement('option'); option.value = type; option.textContent = type; grimoireTypeFilterWorkshop.appendChild(option); }); } if (grimoireElementFilterWorkshop) { grimoireElementFilterWorkshop.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(elementNameKey => { const elementData = elementDetails[elementNameKey] || {}; const fullName = elementData.name || elementNameKey; const shortName = Utils.getElementShortName(fullName); const option = document.createElement('option'); option.value = elementNameKey; option.textContent = shortName; option.title = fullName; grimoireElementFilterWorkshop.appendChild(option); }); } if (grimoireRarityFilterWorkshop) { grimoireRarityFilterWorkshop.innerHTML = `<option value="All">All Rarities</option><option value="common">Common</option><option value="uncommon">Uncommon</option><option value="rare">Rare</option>`; } }
function updateShelfCounts() { if (!grimoireShelvesWorkshop) return; const conceptData = Array.from(State.getDiscoveredConcepts().values()); grimoireShelves.forEach(shelfDef => { const shelfElem = grimoireShelvesWorkshop.querySelector(`.grimoire-shelf[data-category-id="${shelfDef.id}"] .shelf-count`); if (shelfElem) { const count = conceptData.filter(data => (data.userCategory || 'uncategorized') === shelfDef.id).length; shelfElem.textContent = `(${count})`; } }); const showAllShelfCount = grimoireShelvesWorkshop.querySelector(`.show-all-shelf .shelf-count`); if (showAllShelfCount) showAllShelfCount.textContent = `(${conceptData.length})`; }
export function displayGrimoire(filterParams = {}) { const { filterType = "All", filterElement = "All", sortBy = "discovered", filterRarity = "All", searchTerm = "", filterFocus = "All", filterCategory = "All" } = filterParams; if (grimoireShelvesWorkshop) { grimoireShelvesWorkshop.innerHTML = ''; const showAllDiv = document.createElement('div'); showAllDiv.classList.add('grimoire-shelf', 'show-all-shelf'); if (filterCategory === 'All') showAllDiv.classList.add('active-shelf'); showAllDiv.innerHTML = `<h4>Show All Cards</h4><span class="shelf-count">(?)</span>`; showAllDiv.dataset.categoryId = 'All'; grimoireShelvesWorkshop.appendChild(showAllDiv); grimoireShelves.forEach(shelf => { const shelfDiv = document.createElement('div'); shelfDiv.classList.add('grimoire-shelf'); shelfDiv.dataset.categoryId = shelf.id; if (filterCategory === shelf.id) shelfDiv.classList.add('active-shelf'); shelfDiv.style.backgroundColor = `var(--category-${shelf.id}-bg, transparent)`; shelfDiv.style.border = `1px solid var(--category-${shelf.id}-border, var(--border-color-light))`; shelfDiv.innerHTML = `<h4>${shelf.name} <i class="fas fa-info-circle info-icon" title="${shelf.description || ''}"></i></h4><span class="shelf-count">(?)</span>`; grimoireShelvesWorkshop.appendChild(shelfDiv); }); } const targetCardContainer = grimoireGridWorkshop; if (!targetCardContainer) return; targetCardContainer.innerHTML = ''; const discoveredMap = State.getDiscoveredConcepts(); if (discoveredMap.size === 0) { targetCardContainer.innerHTML = '<p>Grimoire Library is empty... Discover Concepts via Research!</p>'; updateShelfCounts(); return; } const userScores = State.getScores(); const focusedSet = State.getFocusedConcepts(); let discoveredArray = Array.from(discoveredMap.values()); const searchTermLower = searchTerm.toLowerCase().trim(); const conceptsToDisplay = discoveredArray.filter(data => { if (!data?.concept) return false; const concept = data.concept; const userCategory = data.userCategory || 'uncategorized'; const typeMatch = (filterType === "All") || (concept.cardType === filterType); let elementMatch = (filterElement === "All"); if (!elementMatch) { const filterLetterKey = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === filterElement); elementMatch = (concept.primaryElement === filterLetterKey); } const rarityMatch = (filterRarity === "All") || (concept.rarity === filterRarity); const focusMatch = (filterFocus === 'All') || (filterFocus === 'Focused' && focusedSet.has(concept.id)) || (filterFocus === 'Not Focused' && !focusedSet.has(concept.id)); const searchMatch = !searchTermLower || (concept.name?.toLowerCase().includes(searchTermLower)) || (concept.keywords && concept.keywords.some(k => k.toLowerCase().includes(searchTermLower))) || (concept.briefDescription?.toLowerCase().includes(searchTermLower)); const categoryMatch = (filterCategory === 'All') || (userCategory === filterCategory); return typeMatch && elementMatch && rarityMatch && focusMatch && searchMatch && categoryMatch; }); const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3 }; conceptsToDisplay.sort((a, b) => { if (!a?.concept || !b?.concept) return 0; const conceptA = a.concept; const conceptB = b.concept; switch (sortBy) { case 'name': return conceptA.name.localeCompare(conceptB.name); case 'type': return (cardTypeKeys.indexOf(conceptA.cardType) - cardTypeKeys.indexOf(conceptB.cardType)) || conceptA.name.localeCompare(conceptB.name); case 'rarity': return (rarityOrder[conceptB.rarity] || 0) - (rarityOrder[conceptA.rarity] || 0) || conceptA.name.localeCompare(conceptB.name); case 'resonance': const scoresAValid = conceptA.elementScores && Object.keys(conceptA.elementScores).length === elementNames.length; const scoresBValid = conceptB.elementScores && Object.keys(conceptB.elementScores).length === elementNames.length; const distA = scoresAValid ? (a.distance ?? Utils.euclideanDistance(userScores, conceptA.elementScores, conceptA.name)) : Infinity; const distB = scoresBValid ? (b.distance ?? Utils.euclideanDistance(userScores, conceptB.elementScores, conceptB.name)) : Infinity; a.distance = distA; b.distance = distB; if (distA === Infinity && distB !== Infinity) return 1; if (distA !== Infinity && distB === Infinity) return -1; if (distA === Infinity && distB === Infinity) return conceptA.name.localeCompare(conceptB.name); return distA - distB || conceptA.name.localeCompare(conceptB.name); default: return (b.discoveredTime || 0) - (a.discoveredTime || 0) || conceptA.name.localeCompare(conceptB.name); } }); if (conceptsToDisplay.length === 0) { const shelfName = filterCategory !== 'All' ? `'${grimoireShelves.find(s=>s.id===filterCategory)?.name || filterCategory}' shelf` : ''; targetCardContainer.innerHTML = `<p>No concepts match filters${searchTerm ? ' or search' : ''}${shelfName ? ` on ${shelfName}` : ''}.</p>`; } else { conceptsToDisplay.forEach(data => { const cardElement = renderCard(data.concept, 'grimoire', data); if (cardElement) { cardElement.draggable = true; cardElement.dataset.conceptId = data.concept.id; targetCardContainer.appendChild(cardElement); } }); } const libGrid = document.getElementById('grimoire-grid-workshop'); if (libGrid){ libGrid.querySelectorAll('img').forEach(img=>{ if (img.complete) return; img.addEventListener('load', ()=>{ libGrid.style.columnGap = '1px'; libGrid.offsetHeight; libGrid.style.columnGap = ''; }); }); } updateShelfCounts(); }
export function refreshGrimoireDisplay(overrideFilters = {}) { if (workshopScreen && !workshopScreen.classList.contains('hidden')) { const currentFilters = { filterType: grimoireTypeFilterWorkshop?.value || "All", filterElement: grimoireElementFilterWorkshop?.value || "All", sortBy: grimoireSortOrderWorkshop?.value || "discovered", filterRarity: grimoireRarityFilterWorkshop?.value || "All", searchTerm: grimoireSearchInputWorkshop?.value || "", filterFocus: grimoireFocusFilterWorkshop?.value || "All", filterCategory: overrideFilters.filterCategory !== undefined ? overrideFilters.filterCategory : document.querySelector('#grimoire-shelves-workshop .grimoire-shelf.active-shelf')?.dataset.categoryId || "All" }; const finalFilters = { ...currentFilters, ...overrideFilters }; displayGrimoire(finalFilters); } }

/** Renders a single concept card element, now including unlock buttons. */
export function renderCard(concept, context = 'grimoire', discoveredData = null) {
    if (!concept || typeof concept.id === 'undefined') { const eDiv = document.createElement('div'); eDiv.textContent = "Error: Invalid Concept Data"; eDiv.classList.add('concept-card', 'error'); return eDiv; }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('concept-card', `rarity-${concept.rarity || 'common'}`);
    cardDiv.dataset.conceptId = concept.id;
    cardDiv.title = (context === 'grimoire') ? `View Details: ${concept.name}` : concept.name;

    const isDiscovered = context === 'grimoire' && !!discoveredData;
    const isFocused = isDiscovered && State.getFocusedConcepts().has(concept.id);
    // const hasNewLore = isDiscovered && (discoveredData?.newLoreAvailable || false); // Legacy lore check
    const userCategory = isDiscovered ? (discoveredData?.userCategory || 'uncategorized') : 'uncategorized';
    const unlockState = isDiscovered ? discoveredData.unlocks : null; // Get unlock state if discovered
    const elementLevel = isDiscovered ? State.getElementLevel(concept.primaryElement) : 0; // Get level of primary element

    // Visual Content
    let visualContentHTML = '';
    if (context === 'grimoire' || context === 'popup-result') {
        const placeholderIconHTML = `<i class="fas fa-image card-visual-placeholder" title="Visual Placeholder"></i>`;
        if (concept.visualHandle) {
            // **NEW**: Check for Alt Skin selection
            let skinSuffix = '';
            if(unlockState?.altSkin?.selectedSkin === 1) skinSuffix = '_alt1';
            else if (unlockState?.altSkin?.selectedSkin === 2) skinSuffix = '_alt2';

            const handle = concept.visualHandle.replace('.jpg','').replace('.png',''); // Ensure no extension first
            const extension = Config.UNLOCKED_ART_EXTENSION || '.jpg';
            const fileName = `${handle}${skinSuffix}${extension}`;
            const imageUrl = `placeholder_art/${fileName}`;
            visualContentHTML = `<img src="${imageUrl}" alt="${concept.name} Art${skinSuffix ? ' (Alt)' : ''}" class="card-art-image" loading="lazy" onerror="window.handleImageError(this)"> <i class="fas fa-image card-visual-placeholder" style="display: none;" title="Art Placeholder"></i>`;
        } else { visualContentHTML = placeholderIconHTML; }
        visualContentHTML = `<div class="card-visual">${visualContentHTML}</div>`;
    }

    // Stamps (Focus, **NEW Unlock Indicators**)
    let unlockIndicatorsHTML = '';
    if(isDiscovered && unlockState) {
        if(unlockState.microStory?.unlocked) unlockIndicatorsHTML += `<i class="fas fa-feather-alt unlock-stamp" title="Micro-Story Unlocked"></i>`;
        if(unlockState.sceneSeed?.unlocked) unlockIndicatorsHTML += `<i class="fas fa-seedling unlock-stamp" title="Scene Seed Unlocked"></i>`;
        if(unlockState.deepLore?.unlocked) unlockIndicatorsHTML += `<i class="fas fa-book-open unlock-stamp" title="Deep Lore Unlocked"></i>`;
        if(unlockState.crossover?.unlocked && !unlockState.crossover?.completed) unlockIndicatorsHTML += `<i class="fas fa-tasks unlock-stamp glowing" title="Crossover Challenge Active!"></i>`;
        if(unlockState.secretScene?.unlocked) unlockIndicatorsHTML += `<i class="fas fa-scroll unlock-stamp" title="Secret Scene Unlocked"></i>`;
        if(unlockState.altSkin?.unlocked) unlockIndicatorsHTML += `<i class="fas fa-palette unlock-stamp" title="Alt Art Available"></i>`;
        if(unlockState.perk?.unlocked) unlockIndicatorsHTML += `<i class="fas fa-star-of-life unlock-stamp" title="Perk Chosen"></i>`;
    }
    const focusStampHTML = (context === 'grimoire' && isFocused) ? '<span class="focus-indicator" title="Focused Concept">★</span>' : '';
    const cardStampsHTML = `<span class="card-stamps">${focusStampHTML}${unlockIndicatorsHTML}</span>`;

    // Rarity, Header, Element Display (mostly unchanged)
    let rarityText = concept.rarity ? concept.rarity.charAt(0).toUpperCase() + concept.rarity.slice(1) : 'Common'; let rarityClass = `rarity-indicator-${concept.rarity || 'common'}`; const rarityIndicatorHTML = `<span class="card-rarity ${rarityClass}" title="Rarity: ${rarityText}">${rarityText}</span>`; const cardHeaderRightHTML = `<span class="card-header-right">${rarityIndicatorHTML}${cardStampsHTML}</span>`;
    let primaryElementHTML = '<small class="no-element">No Primary Element</small>'; if (concept.primaryElement && elementKeyToFullName?.[concept.primaryElement]) { const primaryKey = concept.primaryElement; const elementNameKey = elementKeyToFullName[primaryKey]; const elementData = elementDetails?.[elementNameKey] || {}; const descriptiveName = elementData.name || elementNameKey; const color = Utils.getElementColor(elementNameKey); const icon = Utils.getElementIcon(elementNameKey); const nameShort = Utils.getElementShortName(descriptiveName); primaryElementHTML = `<span class="primary-element-display" style="color: ${color}; border-color: ${Utils.hexToRgba(color, 0.5)}; background-color: ${Utils.hexToRgba(color, 0.1)};" title="Primary Element: ${descriptiveName}"><i class="${icon}"></i> ${nameShort}</span>`; }

    // Card Actions (Grimoire Context Only - now includes Unlock buttons)
    let actionButtonsHTML = '';
    if (context === 'grimoire' && isDiscovered) {
        actionButtonsHTML += '<div class="card-actions card-main-actions">'; // Main actions (Focus, Sell)
        const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused;
        const buttonClass = isFocused ? 'marked' : '';
        const buttonIcon = isFocused ? 'fa-star' : 'fa-regular fa-star';
        const buttonTitle = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove Focus' : 'Mark as Focus');
        actionButtonsHTML += `<button class="button tiny-button card-focus-button ${buttonClass} btn" data-concept-id="${concept.id}" title="${buttonTitle}" ${slotsFull ? 'disabled' : ''}><i class="fas ${buttonIcon}"></i></button>`;
        let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const baseSellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR; let unlockRefund = 0; if (unlockState) { for (const key in unlockState) { if (unlockState[key]?.unlocked && Config.UNLOCK_COSTS[key]) unlockRefund += Config.UNLOCK_COSTS[key] * Config.SELL_UNLOCK_REFUND_FACTOR; } } const totalSellValue = baseSellValue + unlockRefund;
        actionButtonsHTML += `<button class="button tiny-button secondary-button sell-button card-sell-button btn" data-concept-id="${concept.id}" data-context="grimoire" title="Sell (${totalSellValue.toFixed(1)} Insight)"><i class="fas fa-dollar-sign"></i></button>`;
        actionButtonsHTML += '</div>';

        // **NEW**: Unlock Actions Area
        actionButtonsHTML += '<div class="card-actions card-unlock-actions">';
        const insight = State.getInsight();
        // Check and add buttons based on element level and unlock state
        if (elementLevel >= 1 && !unlockState?.microStory?.unlocked) {
            const cost = Config.UNLOCK_COSTS.microStory; const canAfford = insight >= cost;
            actionButtonsHTML += `<button class="button tiny-button unlock-button card-unlock-button btn" data-unlock-key="microStory" data-concept-id="${concept.id}" data-cost="${cost}" ${!canAfford ? 'disabled' : ''} title="Unlock Micro-Story (${cost} Insight)"><i class="fas fa-feather-alt"></i></button>`;
        }
        if (elementLevel >= 1 && !unlockState?.sceneSeed?.unlocked) {
            const cost = Config.UNLOCK_COSTS.sceneSeed; const canAfford = insight >= cost;
            actionButtonsHTML += `<button class="button tiny-button unlock-button card-unlock-button btn" data-unlock-key="sceneSeed" data-concept-id="${concept.id}" data-cost="${cost}" ${!canAfford ? 'disabled' : ''} title="Unlock Scene Seed (${cost} Insight)"><i class="fas fa-seedling"></i></button>`;
        }
        // Add checks for Level 2 unlocks (deepLore, crossover)
        if (elementLevel >= 2 && !unlockState?.deepLore?.unlocked) {
            const cost = Config.UNLOCK_COSTS.deepLore; const canAfford = insight >= cost;
            actionButtonsHTML += `<button class="button tiny-button unlock-button card-unlock-button btn" data-unlock-key="deepLore" data-concept-id="${concept.id}" data-cost="${cost}" ${!canAfford ? 'disabled' : ''} title="Unlock Deep Lore (${cost} Insight)"><i class="fas fa-book-open"></i></button>`;
        }
        if (elementLevel >= 2 && !unlockState?.crossover?.unlocked) {
            const cost = Config.UNLOCK_COSTS.crossover; const canAfford = insight >= cost;
            actionButtonsHTML += `<button class="button tiny-button unlock-button card-unlock-button btn" data-unlock-key="crossover" data-concept-id="${concept.id}" data-cost="${cost}" ${!canAfford ? 'disabled' : ''} title="Unlock Crossover Challenge (${cost} Insight)"><i class="fas fa-tasks"></i></button>`;
        }
        // Add checks for Level 3 unlocks (secretScene, altSkin, perk)
         if (elementLevel >= 3 && !unlockState?.secretScene?.unlocked) {
            const cost = Config.UNLOCK_COSTS.secretScene; const canAfford = insight >= cost;
            actionButtonsHTML += `<button class="button tiny-button unlock-button card-unlock-button btn" data-unlock-key="secretScene" data-concept-id="${concept.id}" data-cost="${cost}" ${!canAfford ? 'disabled' : ''} title="Unlock Secret Scene (${cost} Insight)"><i class="fas fa-scroll"></i></button>`;
        }
         if (elementLevel >= 3 && !unlockState?.altSkin?.unlocked) {
            const cost = Config.UNLOCK_COSTS.altSkin; const canAfford = insight >= cost;
            actionButtonsHTML += `<button class="button tiny-button unlock-button card-unlock-button btn" data-unlock-key="altSkin" data-concept-id="${concept.id}" data-cost="${cost}" ${!canAfford ? 'disabled' : ''} title="Unlock Alt Art (${cost} Insight)"><i class="fas fa-palette"></i></button>`;
        }
         if (elementLevel >= 3 && !unlockState?.perk?.unlocked) {
            const cost = Config.UNLOCK_COSTS.perk; const canAfford = insight >= cost;
            actionButtonsHTML += `<button class="button tiny-button unlock-button card-unlock-button btn" data-unlock-key="perk" data-concept-id="${concept.id}" data-cost="${cost}" ${!canAfford ? 'disabled' : ''} title="Choose Perk (${cost} Insight)"><i class="fas fa-star-of-life"></i></button>`;
        }

        actionButtonsHTML += '</div>';
    }

    // Assemble Card HTML
    cardDiv.innerHTML = `
        <div class="card-header">
            <span class="card-type-icon-area"><i class="${Utils.getCardTypeIcon(concept.cardType)}" title="${concept.cardType}"></i></span>
            <span class="card-name">${concept.name}</span>
            ${cardHeaderRightHTML}
        </div>
        ${visualContentHTML}
        <div class="card-footer">
            <div class="card-affinities">${primaryElementHTML}</div>
            <p class="card-brief-desc">${concept.briefDescription || '...'}</p>
            ${actionButtonsHTML}
        </div>
    `;

    if (context === 'grimoire') cardDiv.classList.add(`category-${userCategory}`);
    if (context === 'popup-result') { cardDiv.classList.add('popup-result-card'); const footer = cardDiv.querySelector('.card-footer'); const briefDesc = cardDiv.querySelector('.card-brief-desc'); const affinities = cardDiv.querySelector('.card-affinities'); if(footer) footer.style.paddingBottom = '0px'; if(briefDesc) { briefDesc.style.display = 'block'; briefDesc.style.minHeight = 'calc(1.4em * 1)'; } if(affinities) affinities.style.marginBottom = '5px'; }

    return cardDiv;
}

// --- Concept Detail Popup UI ---
export function showConceptDetailPopup(conceptId) {
    if (!conceptDetailPopup) return;
    const discoveredData = State.getDiscoveredConceptData(conceptId);
    const concept = discoveredData?.concept;
    if (!concept) { showTemporaryMessage(`Error: Cannot display details for Concept ID ${conceptId}.`, 3000); return; }
    GameLogic.setCurrentPopupConcept(conceptId);

    if (popupCardTypeIcon) popupCardTypeIcon.className = `card-type-icon ${Utils.getCardTypeIcon(concept.cardType)}`;
    if (popupConceptName) popupConceptName.textContent = concept.name;
    if (popupConceptType) popupConceptType.textContent = concept.cardType;
    if (popupBriefDescription) popupBriefDescription.textContent = concept.briefDescription || '...';
    if (popupDetailedDescription) popupDetailedDescription.textContent = concept.detailedDescription || '...';

    // Visual
    if (popupVisualContainer) {
        popupVisualContainer.innerHTML = '';
        popupVisualContainer.setAttribute('aria-label', `${concept.name} Art`);
        const placeholder = document.createElement('i');
        placeholder.className = 'fas fa-image card-visual-placeholder';
        placeholder.title = 'Visual Placeholder';
        placeholder.style.display = 'none';
        popupVisualContainer.appendChild(placeholder);
        // **NEW**: Check Alt Skin
        let skinSuffix = '';
        if(discoveredData?.unlocks?.altSkin?.selectedSkin === 1) skinSuffix = '_alt1';
        else if (discoveredData?.unlocks?.altSkin?.selectedSkin === 2) skinSuffix = '_alt2';

        if (concept.visualHandle) {
            const handle = concept.visualHandle.replace('.jpg','').replace('.png','');
            const extension = Config.UNLOCKED_ART_EXTENSION || '.jpg';
            const fileName = `${handle}${skinSuffix}${extension}`;
            const imageUrl = `placeholder_art/${fileName}`;
            const img = document.createElement('img');
            img.src = imageUrl; img.alt = `${concept.name} Art${skinSuffix?' (Alt)':''}`; img.loading = 'lazy'; img.onerror = () => handleImageError(img); img.onload = () => { placeholder.style.display = 'none'; img.style.display = 'block'; }; img.style.display = 'block'; placeholder.style.display = 'none'; popupVisualContainer.appendChild(img);
        } else { placeholder.style.display = 'flex'; }
    }

    // Resonance
    const userScores = State.getScores(); const conceptScores = concept.elementScores; const expectedKeys = Object.keys(elementKeyToFullName); const scoresValid = conceptScores && typeof conceptScores === 'object' && expectedKeys.length === Object.keys(conceptScores).length && expectedKeys.every(key => conceptScores.hasOwnProperty(key) && typeof conceptScores[key] === 'number' && !isNaN(conceptScores[key]));
    if (scoresValid) { const distance = Utils.euclideanDistance(userScores, conceptScores, concept.name); const maxPossibleDistance = Math.sqrt(elementNames.length * Math.pow(10, 2)); const similarity = Math.max(0, 1 - (distance / maxPossibleDistance)); const resonanceScore = similarity * 10; displayPopupResonanceGauge(resonanceScore); if (popupResonanceGaugeSection) popupResonanceGaugeSection.classList.remove('hidden'); } else { if (popupResonanceGaugeSection) popupResonanceGaugeSection.classList.add('hidden'); }
    displayPopupRelatedConceptsTags(concept.relatedIds);
    displayPopupRecipeComparison(conceptScores, userScores);

    // **NEW**: Display Card Unlocks section
    displayPopupCardUnlocks(conceptId, discoveredData);

    // Legacy Lore Section (can be removed if fully replaced by new system)
    displayPopupLore(conceptId, concept.lore, discoveredData.unlockedLoreLevel);
    // Decide whether to hide legacy lore if new system exists
    if (popupCardUnlocksSection && !popupCardUnlocksSection.classList.contains('hidden')) {
        if (popupLoreSection) popupLoreSection.classList.add('hidden'); // Hide old lore section
    }

    if (myNotesSection) { myNotesSection.classList.remove('hidden'); if (myNotesTextarea) myNotesTextarea.value = discoveredData.notes || ""; if (noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; }
    updateGrimoireButtonStatus(conceptId); updateFocusButtonStatus(conceptId);
    conceptDetailPopup.classList.remove('hidden');
    if (popupOverlay && !(onboardingOverlay && onboardingOverlay.classList.contains('visible'))) popupOverlay.classList.remove('hidden');
}

function displayPopupResonanceGauge(score) { if (!popupResonanceGaugeBar || !popupResonanceGaugeLabel || !popupResonanceGaugeText) return; const clampedScore = Math.max(0, Math.min(10, score)); const percentage = (clampedScore / 10) * 100; const scoreLabel = Utils.getScoreLabel(clampedScore); let resonanceText = "Some similarities."; let barClass = 'resonance-medium'; if (clampedScore >= 8) { resonanceText = "Strong alignment!"; barClass = 'resonance-high'; } else if (clampedScore < 4) { resonanceText = "Significant differences."; barClass = 'resonance-low'; } popupResonanceGaugeBar.style.width = `${percentage}%`; popupResonanceGaugeLabel.textContent = scoreLabel; popupResonanceGaugeText.textContent = resonanceText; popupResonanceGaugeBar.className = 'popup-resonance-gauge-bar'; popupResonanceGaugeBar.classList.add(barClass); popupResonanceGaugeLabel.className = 'popup-resonance-gauge-label'; popupResonanceGaugeLabel.classList.add(barClass); if (popupResonanceGaugeContainer) { popupResonanceGaugeContainer.setAttribute('aria-valuenow', clampedScore.toFixed(1)); popupResonanceGaugeContainer.setAttribute('aria-valuetext', `${scoreLabel}: ${resonanceText}`); } }
function displayPopupRelatedConceptsTags(relatedIds) { if (!popupRelatedConceptsTags) return; popupRelatedConceptsTags.innerHTML = ''; if (!relatedIds || relatedIds.length === 0) { popupRelatedConceptsTags.innerHTML = '<p><i>None specified.</i></p>'; return; } const discoveredMap = State.getDiscoveredConcepts(); relatedIds.forEach(id => { const conceptData = discoveredMap.get(id)?.concept; const name = conceptData?.name || `ID ${id}`; const tagSpan = document.createElement('span'); tagSpan.classList.add('related-concept-tag'); tagSpan.textContent = name; if (conceptData) { tagSpan.title = `View details for ${name}`; tagSpan.style.cursor = 'pointer'; tagSpan.addEventListener('click', () => showConceptDetailPopup(id)); } else { tagSpan.title = `ID ${id} (Not discovered)`; tagSpan.style.opacity = '0.7'; } popupRelatedConceptsTags.appendChild(tagSpan); }); }
function displayPopupRecipeComparison(conceptScores, userScores) { if (!popupConceptProfile || !popupUserComparisonProfile || !popupComparisonHighlights) return; const renderProfile = (scores, container) => { container.innerHTML = ''; elementNames.forEach(elNameKey => { const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elNameKey); const score = (scores && typeof scores[key] === 'number') ? scores[key] : NaN; const name = Utils.getElementShortName(elementDetails?.[elNameKey]?.name || elNameKey); const color = Utils.getElementColor(elNameKey); const barWidth = isNaN(score) ? 0 : Math.max(0, Math.min(100, score * 10)); const scoreText = isNaN(score) ? 'N/A' : score.toFixed(1); container.innerHTML += `<div><strong>${name}:</strong> ${scoreText} <div class="score-bar-container"><div style="width: ${barWidth}%; background-color:${color};"></div></div></div>`; }); }; renderProfile(conceptScores, popupConceptProfile); renderProfile(userScores, popupUserComparisonProfile); let highlightsHTML = ''; const expectedKeys = Object.keys(elementKeyToFullName); const scoresValid = conceptScores && typeof conceptScores === 'object' && expectedKeys.length === Object.keys(conceptScores).length && expectedKeys.every(key => conceptScores.hasOwnProperty(key) && typeof conceptScores[key] === 'number' && !isNaN(conceptScores[key])); if (!scoresValid) { highlightsHTML = "<p><em>Concept score data incomplete.</em></p>"; } else { elementNames.forEach(elNameKey => { const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elNameKey); const cScore = conceptScores[key]; const uScore = userScores[key]; const diff = Math.abs(cScore - uScore); if (diff <= 1.5) highlightsHTML += `<p class="match"><i class="fas fa-check"></i> ${Utils.getElementShortName(elementDetails?.[elNameKey]?.name || elNameKey)}: Close alignment.</p>`; else if (diff >= 4.0) highlightsHTML += `<p class="mismatch"><i class="fas fa-times"></i> ${Utils.getElementShortName(elementDetails?.[elNameKey]?.name || elNameKey)}: Significant difference.</p>`; }); } popupComparisonHighlights.innerHTML = highlightsHTML || "<p><em>Differences are moderate.</em></p>"; }
export function displayPopupLore(conceptId, loreData, unlockedLevel) { if (!popupLoreSection || !popupLoreContent) return; popupLoreContent.innerHTML = ''; if (!loreData || !Array.isArray(loreData) || loreData.length === 0) { popupLoreSection.classList.add('hidden'); return; } popupLoreSection.classList.remove('hidden'); let canUnlockMore = false; loreData.forEach(entry => { if (entry.level <= unlockedLevel) { const entryDiv = document.createElement('div'); entryDiv.classList.add('lore-entry'); entryDiv.innerHTML = `<h6><i class="fas fa-scroll"></i> Level ${entry.level}</h6><p>${entry.text}</p>`; popupLoreContent.appendChild(entryDiv); } else if (entry.level === unlockedLevel + 1) { canUnlockMore = true; const unlockDiv = document.createElement('div'); unlockDiv.classList.add('lore-unlock'); const cost = entry.insightCost || Config.LORE_UNLOCK_COSTS[`level${entry.level}`] || 999; const canAfford = State.getInsight() >= cost; const errorMsg = canAfford ? '' : `<span class="unlock-error">Requires ${cost.toFixed(1)} Insight</span>`; unlockDiv.innerHTML = `<button class="button small-button unlock-lore-button btn" data-concept-id="${conceptId}" data-lore-level="${entry.level}" data-cost="${cost}" ${canAfford ? '' : 'disabled'} title="${canAfford ? `Unlock for ${cost.toFixed(1)} Insight` : `Requires ${cost.toFixed(1)} Insight`}">Unlock Level ${entry.level} Lore (${cost.toFixed(1)} <i class="fas fa-brain insight-icon"></i>)</button>${errorMsg}`; popupLoreContent.appendChild(unlockDiv); } }); if (!canUnlockMore && unlockedLevel >= loreData.length) popupLoreContent.innerHTML += '<p><i>All legacy lore unlocked.</i></p>'; if (State.isNewLoreAvailable(conceptId)) State.markLoreAsSeen(conceptId); }

// **NEW**: Function to display the new card unlocks in the detail popup
function displayPopupCardUnlocks(conceptId, discoveredData) {
    if (!popupCardUnlocksSection || !popupCardUnlocksContent || !discoveredData || !discoveredData.concept) {
        if(popupCardUnlocksSection) popupCardUnlocksSection.classList.add('hidden');
        return;
    }
    const concept = discoveredData.concept;
    const unlockState = discoveredData.unlocks || createDefaultCardUnlockState();
    const elementLevel = State.getElementLevel(concept.primaryElement);
    const insight = State.getInsight();
    let contentHTML = '';
    let sectionVisible = false;

    const createButtonHTML = (key, icon, name, levelReq) => {
        if (elementLevel >= levelReq && !unlockState[key]?.unlocked) {
            sectionVisible = true;
            const cost = Config.UNLOCK_COSTS[key] ?? 999;
            const canAfford = insight >= cost;
            return `<button class="button small-button unlock-button card-unlock-button btn"
                        data-unlock-key="${key}" data-concept-id="${conceptId}" data-cost="${cost}"
                        ${!canAfford ? 'disabled' : ''}
                        title="${canAfford ? `Unlock ${name} (${cost} Insight)` : `Requires ${cost} Insight`}">
                    <i class="fas ${icon}"></i> Unlock ${name} (${cost})
                </button>`;
        } else if (unlockState[key]?.unlocked) {
            sectionVisible = true; // Show section if anything is unlocked
            // Special display for unlocked items
            switch(key) {
                case 'microStory': return `<button class="button small-button unlocked-item-btn" data-action="readMicroStory" data-concept-id="${conceptId}"><i class="fas fa-feather-alt"></i> Read Micro-Story</button>`;
                case 'sceneSeed': return `<button class="button small-button unlocked-item-btn" data-action="viewSceneSeed" data-concept-id="${conceptId}"><i class="fas fa-seedling"></i> View Scene Seed</button>`;
                case 'deepLore': return `<button class="button small-button unlocked-item-btn" data-action="viewDeepLore" data-concept-id="${conceptId}"><i class="fas fa-book-open"></i> View Deep Lore</button>`;
                case 'crossover':
                    return unlockState[key].completed
                       ? `<span class="unlocked-item completed"><i class="fas fa-check-circle"></i> Crossover Challenge Complete!</span>`
                       : `<button class="button small-button attention-button crossover-complete-btn btn" data-action="completeCrossover" data-concept-id="${conceptId}" title="Mark 24h challenge as completed"><i class="fas fa-tasks"></i> Complete Challenge</button>`;
                 case 'secretScene': return `<button class="button small-button unlocked-item-btn" data-action="viewSecretScene" data-concept-id="${conceptId}"><i class="fas fa-scroll"></i> View Secret Scene</button>`;
                case 'altSkin':
                     // Add logic for skin selection later if needed
                     return `<span class="unlocked-item"><i class="fas fa-palette"></i> Alt Art Unlocked (Skin ${unlockState[key].selectedSkin || 0})</span>`;
                case 'perk':
                     // Add logic for perk selection later
                     return `<span class="unlocked-item"><i class="fas fa-star-of-life"></i> Perk Chosen: ${unlockState[key].choice || 'None'}</span>`;
                default: return `<span class="unlocked-item"><i class="fas fa-check"></i> ${name} Unlocked</span>`;
            }
        }
        return ''; // Don't show button if level requirement not met
    };

    // Level 1 Unlocks
    contentHTML += createButtonHTML('microStory', 'fa-feather-alt', 'Micro-Story', 1);
    contentHTML += createButtonHTML('sceneSeed', 'fa-seedling', 'Scene Seed', 1);
    // Level 2 Unlocks
    contentHTML += createButtonHTML('deepLore', 'fa-book-open', 'Deep Lore', 2);
    contentHTML += createButtonHTML('crossover', 'fa-tasks', 'Crossover Token', 2);
    // Level 3 Unlocks
    contentHTML += createButtonHTML('secretScene', 'fa-scroll', 'Secret Scene', 3);
    contentHTML += createButtonHTML('altSkin', 'fa-palette', 'Alt Art', 3);
    contentHTML += createButtonHTML('perk', 'fa-star-of-life', 'Perk', 3);

    if (sectionVisible) {
        popupCardUnlocksContent.innerHTML = contentHTML || '<p><i>No unlocks currently available or all purchased.</i></p>';
        popupCardUnlocksSection.classList.remove('hidden');
    } else {
        popupCardUnlocksSection.classList.add('hidden');
    }
}

export function updateGrimoireButtonStatus(conceptId) { const container = conceptDetailPopup?.querySelector('.popup-actions'); const addBtn = getElement('addToGrimoireButton'); if (!container || !addBtn) return; const existingSellBtn = container.querySelector('.popup-sell-button'); if (existingSellBtn) existingSellBtn.remove(); if (State.getDiscoveredConcepts().has(conceptId)) { addBtn.classList.add('hidden'); const sellButton = document.createElement('button'); const concept = State.getDiscoveredConceptData(conceptId)?.concept; const discoveredData = State.getDiscoveredConceptData(conceptId); if (!concept) return; let discoveryValue = Config.CONCEPT_DISCOVERY_INSIGHT[concept.rarity] || Config.CONCEPT_DISCOVERY_INSIGHT.default; const baseSellValue = discoveryValue * Config.SELL_INSIGHT_FACTOR; let unlockRefund = 0; const unlockState = discoveredData?.unlocks || {}; for (const key in unlockState) { if (unlockState[key]?.unlocked && Config.UNLOCK_COSTS[key]) unlockRefund += Config.UNLOCK_COSTS[key] * Config.SELL_UNLOCK_REFUND_FACTOR; } const totalSellValue = baseSellValue + unlockRefund; sellButton.className = 'button small-button secondary-button sell-button popup-sell-button btn'; sellButton.dataset.conceptId = conceptId; sellButton.dataset.context = 'detailPopup'; sellButton.title = `Sell (${totalSellValue.toFixed(1)} Insight: ${baseSellValue.toFixed(1)} base + ${unlockRefund.toFixed(1)} refund)`; sellButton.innerHTML = `Sell <i class="fas fa-dollar-sign"></i>`; container.appendChild(sellButton); } else { addBtn.classList.remove('hidden'); } }
export function updateFocusButtonStatus(conceptId) { if (!markAsFocusButton) return; if (State.getDiscoveredConcepts().has(conceptId)) { markAsFocusButton.classList.remove('hidden'); const isFocused = State.getFocusedConcepts().has(conceptId); markAsFocusButton.classList.toggle('marked', isFocused); markAsFocusButton.innerHTML = isFocused ? 'Remove Focus <i class="fas fa-star"></i>' : 'Mark as Focus <i class="far fa-star"></i>'; const slotsFull = State.getFocusedConcepts().size >= State.getFocusSlots() && !isFocused; markAsFocusButton.disabled = slotsFull; markAsFocusButton.title = slotsFull ? `Focus Slots Full (${State.getFocusSlots()})` : (isFocused ? 'Remove from Focus' : 'Add to Focus'); } else { markAsFocusButton.classList.add('hidden'); } }

// --- Research Popup ---
export function displayResearchResults(results) { if (!researchResultsPopup || !researchPopupContent) return; researchPopupContent.innerHTML = ''; const { concepts: foundConcepts, duplicateInsightGain } = results; if (foundConcepts.length === 0 && duplicateInsightGain <= 0) { researchPopupContent.innerHTML = '<p>No new discoveries.</p>'; } else { if (duplicateInsightGain > 0) researchPopupContent.innerHTML += `<p class="duplicate-insight-info">Gained ${duplicateInsightGain.toFixed(1)} Insight from Research Echoes!</p>`; foundConcepts.forEach(concept => { const itemDiv = document.createElement('div'); itemDiv.classList.add('research-result-item'); itemDiv.dataset.conceptId = concept.id; itemDiv.dataset.processed = "false"; const cardElement = renderCard(concept, 'popup-result'); if(cardElement) itemDiv.appendChild(cardElement); const actionsDiv = document.createElement('div'); actionsDiv.classList.add('card-actions'); actionsDiv.innerHTML = ` <button class="button tiny-button add-grimoire-button btn" data-action="keep" data-concept-id="${concept.id}" title="Keep Concept">Keep <i class="fas fa-plus"></i></button> <button class="button tiny-button sell-button btn" data-action="sell" data-concept-id="${concept.id}" title="Sell for Insight">Sell <i class="fas fa-dollar-sign"></i></button> <span class="action-feedback"></span> `; itemDiv.appendChild(actionsDiv); researchPopupContent.appendChild(itemDiv); }); } updateResearchPopupState(); researchResultsPopup.classList.remove('hidden'); if (popupOverlay && !(onboardingOverlay && onboardingOverlay.classList.contains('visible'))) popupOverlay.classList.remove('hidden'); }
export function handleResearchPopupAction(conceptId, actionResult) { const item = researchPopupContent?.querySelector(`.research-result-item[data-concept-id="${conceptId}"]`); if (!item) return; const feedbackSpan = item.querySelector('.action-feedback'); const buttons = item.querySelectorAll('.card-actions button'); buttons.forEach(btn => btn.disabled = true); item.dataset.processed = "true"; item.dataset.choiceMade = actionResult; let feedbackText = ""; switch (actionResult) { case 'kept': feedbackText = "Kept!"; item.classList.add('kept'); break; case 'sold': feedbackText = "Sold!"; item.classList.add('sold'); break; case 'pending_dissonance': feedbackText = "Dissonance! Reflect..."; item.classList.add('pending'); break; case 'kept_after_dissonance': feedbackText = "Kept (Reflected)."; item.classList.add('kept'); break; case 'kept_after_dissonance_fail': feedbackText = "Kept (Reflect Error)"; item.classList.add('kept'); break; case 'error_adding': feedbackText = "Error adding!"; item.classList.add('error'); break; default: feedbackText = "Error."; item.classList.add('error'); break; } if (feedbackSpan) feedbackSpan.textContent = feedbackText; updateResearchPopupState(); }
function updateResearchPopupState() { if (!researchPopupContent) return; const items = researchPopupContent.querySelectorAll('.research-result-item'); const duplicateInsightGain = parseFloat(researchPopupContent.querySelector('.duplicate-insight-info')?.textContent.match(/gained ([\d.]+)/)?.[1] || '0'); if (!items || items.length === 0) { if(researchPopupStatus) researchPopupStatus.textContent = duplicateInsightGain > 0 ? "Insight gained." : "No discoveries."; if(closeResearchResultsPopupButton) closeResearchResultsPopupButton.disabled = false; if(confirmResearchChoicesButton) confirmResearchChoicesButton.classList.add('hidden'); return; } const unprocessedItems = Array.from(items).filter(item => item.dataset.processed === "false" || item.dataset.choiceMade === "pending_dissonance"); const allProcessed = unprocessedItems.length === 0; if(researchPopupStatus) researchPopupStatus.textContent = allProcessed ? "All processed." : `Choose for remaining ${unprocessedItems.length} finding(s).`; if(closeResearchResultsPopupButton) closeResearchResultsPopupButton.disabled = !allProcessed; if(confirmResearchChoicesButton) confirmResearchChoicesButton.classList.toggle('hidden', !allProcessed); }

// --- Reflection Modal UI ---
export function displayReflectionPrompt(promptData, context) { if (!reflectionModal || !reflectionModalTitle || !reflectionElement || !reflectionPromptText || !confirmReflectionButton || !reflectionCheckbox || !scoreNudgeCheckbox || !scoreNudgeLabel) return; reflectionCheckbox.checked = false; scoreNudgeCheckbox.checked = false; confirmReflectionButton.disabled = true; scoreNudgeCheckbox.classList.add('hidden'); scoreNudgeLabel.classList.add('hidden'); const { title, category, prompt, showNudge, reward } = promptData; reflectionModalTitle.textContent = title || "Reflection"; reflectionElement.textContent = category || "Your Journey"; reflectionPromptText.innerHTML = prompt?.text || "..."; if (showNudge) { scoreNudgeCheckbox.classList.remove('hidden'); scoreNudgeLabel.classList.remove('hidden'); } if (reflectionRewardAmount) reflectionRewardAmount.textContent = reward?.toFixed(1) || '?'; reflectionModal.classList.remove('hidden'); if (popupOverlay && !(onboardingOverlay && onboardingOverlay.classList.contains('visible'))) popupOverlay.classList.remove('hidden'); }

// --- Repository UI ---
export function displayRepositoryContent() { if (!repositoryScreen || !repositoryScreen.classList.contains('current')) return; if (repositoryFocusUnlocksDiv) { repositoryFocusUnlocksDiv.innerHTML = ''; const unlockedFocus = State.getUnlockedFocusItems(); if (unlockedFocus.size === 0) repositoryFocusUnlocksDiv.innerHTML = '<li>No focus-driven discoveries yet.</li>'; else focusDrivenUnlocks.filter(u => unlockedFocus.has(u.id)).forEach(u => repositoryFocusUnlocksDiv.appendChild(renderRepositoryItem(u, 'focusUnlock'))); } if (repositoryScenesDiv) { repositoryScenesDiv.innerHTML = ''; const scenes = State.getRepositoryItems().scenes; if (scenes.size === 0) repositoryScenesDiv.innerHTML = '<li>No Scene Blueprints acquired.</li>'; else sceneBlueprints.filter(s => scenes.has(s.id)).forEach(s => { const cost = s.meditationCost || Config.SCENE_MEDITATION_BASE_COST; const canAfford = State.getInsight() >= cost; repositoryScenesDiv.appendChild(renderRepositoryItem(s, 'scene', cost, canAfford)); }); } if (repositoryExperimentsDiv) { repositoryExperimentsDiv.innerHTML = ''; const completedExperiments = State.getRepositoryItems().experiments; const userAttunement = State.getAttunement(); const userScores = State.getScores(); const userFocus = State.getFocusedConcepts(); const discoveredMap = State.getDiscoveredConcepts(); const availableExperiments = alchemicalExperiments.filter(e => { if (completedExperiments.has(e.id)) return true; let reqsMet = userAttunement[e.requiredElement] >= e.requiredAttunement; if (e.requiredRoleFocusScore !== undefined && (userScores.RF ?? 0) < e.requiredRoleFocusScore) reqsMet = false; if (e.requiredRoleFocusScoreBelow !== undefined && (userScores.RF ?? 0) >= e.requiredRoleFocusScoreBelow) reqsMet = false; if (e.requiredFocusConceptIds) { for (const reqId of e.requiredFocusConceptIds) if (!userFocus.has(reqId)) reqsMet = false; } if (e.requiredFocusConceptTypes) { for (const typeReq of e.requiredFocusConceptTypes) { let typeMet = false; for (const fId of userFocus) { const c = discoveredMap.get(fId)?.concept; if (c?.cardType === typeReq) { typeMet = true; break; } } if (!typeMet) reqsMet = false; } } return reqsMet; }); if (availableExperiments.length === 0) repositoryExperimentsDiv.innerHTML = '<li>No Alchemical Experiments available.</li>'; else availableExperiments.forEach(e => { const cost = e.insightCost || Config.EXPERIMENT_BASE_COST; const canAfford = State.getInsight() >= cost; const completed = completedExperiments.has(e.id); repositoryExperimentsDiv.appendChild(renderRepositoryItem(e, 'experiment', cost, canAfford, completed)); }); } if (repositoryInsightsDiv) { repositoryInsightsDiv.innerHTML = ''; const insights = State.getRepositoryItems().insights; if (insights.size === 0) repositoryInsightsDiv.innerHTML = '<li>No Elemental Insights uncovered.</li>'; else elementalInsights.filter(i => insights.has(i.id)).forEach(i => repositoryInsightsDiv.appendChild(renderRepositoryItem(i, 'insight'))); } displayMilestones(); displayDailyRituals(); }
export function renderRepositoryItem(item, type, cost = 0, canAfford = false, completed = false) { const li = document.createElement('li'); li.classList.add('repository-item'); li.classList.toggle('completed', completed); const itemElementKey = item.element || item.requiredElement || null; const elementName = itemElementKey ? elementKeyToFullName?.[itemElementKey] : null; const color = elementName ? Utils.getElementColor(elementName) : 'var(--secondary-color)'; li.style.borderLeftColor = completed ? 'var(--success-color)' : color; let actionsHTML = ''; let title = item.name; let description = item.description || ''; let requiresText = ""; switch (type) { case 'scene': title = `<i class="fas fa-scroll" style="color: ${color};"></i> ${item.name}`; if (!completed) { const actionLabel = `Meditate (${cost.toFixed(1)})`; actionsHTML = `<div class="repo-actions"><button class="button tiny-button btn" data-scene-id="${item.id}" ${!canAfford ? 'disabled' : ''} title="${canAfford ? `Meditate on ${item.name}` : `Requires ${cost.toFixed(1)} Insight`}"><i class="fas fa-brain"></i> ${actionLabel}</button></div>`; } break; case 'experiment': title = `<i class="fas fa-flask" style="color: ${color};"></i> ${item.name}`; const userAttunement = State.getAttunement(); const userScores = State.getScores(); const userFocus = State.getFocusedConcepts(); const discoveredMap = State.getDiscoveredConcepts(); let otherReqsMet = true; let reqsList = []; if (userAttunement[item.requiredElement] < item.requiredAttunement) { otherReqsMet = false; reqsList.push(`${item.requiredAttunement} ${Utils.getElementShortName(elementKeyToFullName[item.requiredElement])} Att.`); } if (item.requiredRoleFocusScore !== undefined && (userScores.RF ?? 0) < item.requiredRoleFocusScore) { otherReqsMet = false; reqsList.push(`RF Score ≥ ${item.requiredRoleFocusScore}`); } if (item.requiredRoleFocusScoreBelow !== undefined && (userScores.RF ?? 0) >= item.requiredRoleFocusScoreBelow) { otherReqsMet = false; reqsList.push(`RF Score < ${item.requiredRoleFocusScoreBelow}`); } if (item.requiredFocusConceptIds) { for (const reqId of item.requiredFocusConceptIds) { if (!userFocus.has(reqId)) { otherReqsMet = false; const c = concepts.find(c=>c.id === reqId); reqsList.push(c ? `Focus: ${c.name}` : `Focus: ID ${reqId}`); } } } if (item.requiredFocusConceptTypes) { for (const typeReq of item.requiredFocusConceptTypes) { let typeMet = false; for (const fId of userFocus) { const c = discoveredMap.get(fId)?.concept; if (c?.cardType === typeReq) { typeMet = true; break; } } if (!typeMet) { otherReqsMet = false; reqsList.push(`Focus Type: ${typeReq}`); } } } if (!otherReqsMet) requiresText = `<small class="req-missing">Requires: ${reqsList.join(', ')}</small>`; if (!completed) { const buttonDisabled = !otherReqsMet || !canAfford; const buttonTitle = completed ? "Completed" : (!otherReqsMet ? "Requirements not met" : (!canAfford ? `Requires ${cost.toFixed(1)} Insight` : `Attempt`)); const actionLabel = `Attempt (${cost.toFixed(1)})`; actionsHTML = `<div class="repo-actions">${requiresText}<button class="button tiny-button btn" data-experiment-id="${item.id}" ${buttonDisabled ? 'disabled' : ''} title="${buttonTitle}"><i class="fas fa-vial"></i> ${actionLabel}</button></div>`; } break; case 'insight': title = `<i class="fas fa-lightbulb" style="color: ${color};"></i> Insight (${Utils.getElementShortName(elementKeyToFullName[item.element])})`; description = `<em>"${item.text}"</em>`; break; case 'focusUnlock': title = `<i class="fas fa-link" style="color: ${color};"></i> Focus Discovery: ${item.unlocks?.name || 'Item'}`; description = item.description || ''; break; default: title = item.name || 'Unknown'; } li.innerHTML = `<h4>${title}</h4><p>${description}</p>${actionsHTML}`; return li; }

// --- Milestones UI ---
export function displayMilestones() { if (!milestonesDisplay) return; milestonesDisplay.innerHTML = ''; const achieved = State.getAchievedMilestones(); const allMilestones = milestones; if (!allMilestones) { milestonesDisplay.innerHTML = '<li>Error loading milestones.</li>'; return; } let achievedCount = 0; allMilestones.forEach(m => { if(!m) return; const li = document.createElement('li'); const isAchieved = achieved.has(m.id); li.classList.toggle('completed', isAchieved); li.innerHTML = `<i class="fas ${isAchieved ? 'fa-award' : 'fa-times-circle'}" style="color: ${isAchieved ? 'var(--success-color)' : 'var(--text-muted-color)'}; margin-right: 8px;"></i> ${m.description || `Milestone ${m.id}`}`; if (isAchieved) achievedCount++; milestonesDisplay.appendChild(li); }); if (achievedCount === 0) milestonesDisplay.innerHTML = '<li>No milestones achieved yet.</li>'; }

// --- Rituals Display (Targets Repository) ---
export function displayDailyRituals() { if (!dailyRitualsDisplayRepo) return; const currentState = State.getState(); const completedRitualsData = currentState.completedRituals || { daily: {} }; const completedToday = completedRitualsData.daily || {}; const focused = currentState.focusedConcepts; const scores = currentState.userScores; dailyRitualsDisplayRepo.innerHTML = ''; let displayedRitualCount = 0; if (dailyRituals && Array.isArray(dailyRituals)) { dailyRituals.forEach(ritual => { if (!ritual?.id || !ritual.track) return; const completedData = completedToday[ritual.id] || { completed: false, progress: 0 }; const track = ritual.track; const requiredCount = track.count || 1; const isComplete = completedData.completed || (track.count && completedData.progress >= requiredCount); const li = document.createElement('li'); li.classList.toggle('completed', isComplete); let progressText = ''; if (requiredCount > 1) progressText = ` (${completedData.progress}/${requiredCount})`; let rewardText = ''; if (ritual.reward) { if (ritual.reward.type === 'insight') rewardText = ` (+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`; else if (ritual.reward.type === 'attunement') rewardText = ` (+${ritual.reward.amount} Att.)`; } li.innerHTML = `${ritual.description}${progressText}<span class="ritual-reward">${rewardText}</span>`; dailyRitualsDisplayRepo.appendChild(li); displayedRitualCount++; }); } if (focusRituals && Array.isArray(focusRituals)) { focusRituals.forEach(ritual => { if (!ritual?.id || !ritual.track) return; let focusMet = true; if (ritual.requiredFocusIds) { for (const id of ritual.requiredFocusIds) if (!focused.has(id)) { focusMet = false; break; } } if (focusMet && ritual.requiredRoleFocusScore !== undefined && (scores.RF ?? 0) < ritual.requiredRoleFocusScore) focusMet = false; if (focusMet && ritual.requiredRoleFocusScoreBelow !== undefined && (scores.RF ?? 0) >= ritual.requiredRoleFocusScoreBelow) focusMet = false; if (focusMet) { const completedData = completedToday[ritual.id] || { completed: false, progress: 0 }; const track = ritual.track; const requiredCount = track.count || 1; const isComplete = completedData.completed || (track.count && completedData.progress >= requiredCount); const li = document.createElement('li'); li.classList.add('focus-ritual'); li.classList.toggle('completed', isComplete); let progressText = ''; if (requiredCount > 1) progressText = ` (${completedData.progress}/${requiredCount})`; let rewardText = ''; if (ritual.reward) { if (ritual.reward.type === 'insight') rewardText = ` (+${ritual.reward.amount} <i class="fas fa-brain insight-icon"></i>)`; else if (ritual.reward.type === 'attunement') rewardText = ` (+${ritual.reward.amount} Att.)`; } li.innerHTML = `${ritual.description}${progressText}<span class="ritual-reward">${rewardText}</span>`; dailyRitualsDisplayRepo.appendChild(li); displayedRitualCount++; } }); } if (displayedRitualCount === 0) dailyRitualsDisplayRepo.innerHTML = '<li>No active rituals.</li>'; }

// --- Tapestry Deep Dive / Resonance Chamber UI ---
export function displayTapestryDeepDive(analysis) { if (!tapestryDeepDiveModal || !deepDiveNarrativeP || !deepDiveFocusIcons || !deepDiveAnalysisNodesContainer || !deepDiveDetailContent) return; const discovered = State.getDiscoveredConcepts(); deepDiveNarrativeP.innerHTML = analysis?.fullNarrativeHTML || "..."; deepDiveFocusIcons.innerHTML = ''; const focused = State.getFocusedConcepts(); focused.forEach(id => { const conceptData = discovered.get(id)?.concept; if (conceptData) { const iconSpan = document.createElement('span'); iconSpan.classList.add('deep-dive-focus-icon'); const elementNameKey = elementKeyToFullName?.[conceptData.primaryElement]; if (!elementNameKey) return; const color = Utils.getElementColor(elementNameKey); const icon = Utils.getElementIcon(elementNameKey); iconSpan.innerHTML = `<i class="${icon}" style="color: ${color};"></i>`; iconSpan.title = `${conceptData.name} (${Utils.getElementShortName(elementDetails?.[elementNameKey]?.name || elementNameKey)})`; deepDiveFocusIcons.appendChild(iconSpan); } }); deepDiveAnalysisNodesContainer.querySelectorAll('.aspect-node').forEach(btn => btn.classList.remove('active')); deepDiveDetailContent.innerHTML = '<p><i>Select an Aspect...</i></p>'; updateContemplationButtonState(); tapestryDeepDiveModal.classList.remove('hidden'); if (popupOverlay && !(onboardingOverlay && onboardingOverlay.classList.contains('visible'))) popupOverlay.classList.remove('hidden'); }
export function displaySynergyTensionInfo(analysis) { if (!tapestryDeepDiveModal || !deepDiveDetailContent || !deepDiveAnalysisNodesContainer) return; if (tapestryDeepDiveModal.classList.contains('hidden')) showTapestryDeepDive(); deepDiveAnalysisNodesContainer.querySelectorAll('.aspect-node').forEach(btn => btn.classList.remove('active')); const synergyNode = deepDiveAnalysisNodesContainer.querySelector('[data-node-id="synergy"]'); if (synergyNode) synergyNode.classList.add('active'); let content = `<h4>Synergy & Tension</h4>`; if (analysis?.synergies?.length > 0) content += `<h5>Synergies:</h5><ul>${analysis.synergies.map(s => `<li>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul><hr class="popup-hr">`; else content += `<p><em>No direct synergies detected.</em></p><hr class="popup-hr">`; if (analysis?.tensions?.length > 0) content += `<h5>Tensions:</h5><ul>${analysis.tensions.map(t => `<li>${t.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`; else content += `<p><em>No significant tensions detected.</em></p>`; deepDiveDetailContent.innerHTML = content; }
export function updateDeepDiveContent(htmlContent, activeNodeId) { if (!deepDiveDetailContent || !deepDiveAnalysisNodesContainer) return; deepDiveDetailContent.innerHTML = htmlContent; deepDiveAnalysisNodesContainer.querySelectorAll('.aspect-node').forEach(btn => btn.classList.toggle('active', btn.dataset.nodeId === activeNodeId)); deepDiveDetailContent.scrollTop = 0; }
export function displayContemplationTask(task) { if (!deepDiveDetailContent || !task) return; let content = `<h4>Focusing Lens</h4><p>${task.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`; if (task.requiresCompletionButton) { let rewardText = ""; if (task.reward?.type === 'insight') rewardText = `+${task.reward.amount || '?'} Insight`; else if (task.reward?.type === 'attunement') rewardText = `+${task.reward.amount || '?'} Attunement`; content += `<button id="completeContemplationBtn" class="button small-button btn">Complete Contemplation (${rewardText})</button>`; } updateDeepDiveContent(content, 'contemplation'); }
export function clearContemplationTask() { if (!deepDiveDetailContent || !deepDiveAnalysisNodesContainer) return; const contemplationNode = deepDiveAnalysisNodesContainer.querySelector('[data-node-id="contemplation"]'); if (contemplationNode?.classList.contains('active')) { deepDiveDetailContent.innerHTML = '<p><i>Select an Aspect...</i></p>'; contemplationNode.classList.remove('active'); } }

// --- Initial UI Setup Helper ---
export function setupInitialUI() { screens.forEach(s => s?.classList.add('hidden', 'current')); getElement('welcomeScreen')?.classList.remove('hidden'); getElement('welcomeScreen')?.classList.add('current'); if (sideDrawer) sideDrawer.setAttribute('aria-hidden', 'true'); if (drawerToggle) drawerToggle.setAttribute('aria-expanded', 'false'); if (loadButton) loadButton.classList.toggle('hidden', !localStorage.getItem(Config.SAVE_KEY)); updateSuggestSceneButtonState(); updateElementalDilemmaButtonState(); updateExploreSynergyButtonStatus('none'); updateInsightBoostButtonState(); populateGrimoireFilters(); updateDrawerLinks(); updateXPDisplay(); // **NEW**: Init XP display if (localStorage.getItem('theme') === 'dark') { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } if (skipTourBtn) skipTourBtn.addEventListener('click', () => { hideOnboarding(); State.setOnboardingPhase(99); }); if (helpBtn) helpBtn.addEventListener('click', () => { const currentScreenId = document.querySelector('.screen.current')?.id || 'welcomeScreen'; State.setOnboardingPhase(1); showOnboarding(1, currentScreenId); }); // **NEW**: Listener for Sanctum modal if (openSanctumBtn) openSanctumBtn.addEventListener('click', showSanctumModal); if (closeSanctumBtn) closeSanctumBtn.addEventListener('click', hideSanctumModal); }

// --- Onboarding UI ---
export function showOnboarding(phase, currentScreenId) { if (!onboardingOverlay || !onboardingPopup || !onboardingContent || !onboardingProgressSpan || !onboardingTitle || !onboardingPrevButton || !onboardingNextButton || !onboardingSkipButton || !skipTourBtn || !onboardingHighlight) { if (typeof State !== 'undefined' && State.markOnboardingComplete) State.markOnboardingComplete(); hideOnboarding(); return; } if (phase <= 0 || State.isOnboardingComplete()) { hideOnboarding(); return; } const tourTasks = getTourForScreen(currentScreenId); const task = tourTasks.find(t => t.phaseRequired === phase); if (!task) { hideOnboarding(); return; } let tourTitle = "Orientation"; if (currentScreenId === 'workshopScreen') tourTitle = "Workshop Tour"; else if (currentScreenId === 'repositoryScreen') tourTitle = "Repository Tour"; if (onboardingTitle) onboardingTitle.textContent = tourTitle; const taskText = task.description || task.text || '...'; onboardingContent.innerHTML = `<p>${taskText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`; if (task.hint) onboardingContent.innerHTML += `<p><small><em>Hint: ${task.hint}</em></small></p>`; const totalStepsInTour = tourTasks.length; onboardingProgressSpan.textContent = `Step ${phase} of ${totalStepsInTour}`; onboardingPrevButton.disabled = (phase === 1); onboardingNextButton.textContent = (phase === totalStepsInTour) ? "Finish Tour" : "Next"; onboardingOverlay.classList.add('visible'); onboardingOverlay.classList.remove('hidden'); onboardingPopup.classList.remove('hidden'); onboardingOverlay.removeAttribute('aria-hidden'); if(popupOverlay) popupOverlay.classList.add('hidden'); requestAnimationFrame(() => updateOnboardingHighlight(task.highlightElementId)); }
export function hideOnboarding() { if (onboardingOverlay) { onboardingOverlay.classList.remove('visible'); onboardingOverlay.classList.add('hidden'); onboardingOverlay.setAttribute('aria-hidden', 'true'); } if (onboardingPopup) onboardingPopup.classList.add('hidden'); if (onboardingHighlight) onboardingHighlight.style.display = 'none'; updateDrawerLinks(); }
function updateOnboardingHighlight(elementId) { if (!onboardingHighlight) return; const targetElement = elementId ? getElement(elementId) : null; if (targetElement && targetElement.offsetParent !== null) { const rect = targetElement.getBoundingClientRect(); onboardingHighlight.style.left = `${rect.left - 5 + window.scrollX}px`; onboardingHighlight.style.top = `${rect.top - 5 + window.scrollY}px`; onboardingHighlight.style.width = `${rect.width + 10}px`; onboardingHighlight.style.height = `${rect.height + 10}px`; onboardingHighlight.style.display = 'block'; const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)'); targetElement.scrollIntoView({ behavior: mediaQuery.matches ? 'auto' : 'smooth', block: 'center', inline: 'nearest' }); } else { onboardingHighlight.style.display = 'none'; } }

// --- Note Save Status ---
export function updateNoteSaveStatus(message, isError = false) { if (noteSaveStatusSpan) { noteSaveStatusSpan.textContent = message; noteSaveStatusSpan.className = 'note-status'; if (isError) noteSaveStatusSpan.classList.add('error'); setTimeout(() => { if(noteSaveStatusSpan) noteSaveStatusSpan.textContent = ""; }, 2500); } }

// --- Theme Toggle ---
export function toggleTheme() { const root = document.documentElement; root.classList.toggle('dark'); const currentTheme = root.classList.contains('dark') ? 'dark' : 'light'; localStorage.setItem('theme', currentTheme); if (personaSummaryView?.classList.contains('current')) drawPersonaChart(State.getScores()); }

// --- Element Deep Dive Display ---
export function displayElementDeepDive(elementKey, container) { if (!container) return; const unlockedLevel = State.getState().unlockedDeepDiveLevels[elementKey] || 0; const elementNameKey = elementKeyToFullName[elementKey]; if (!elementNameKey) { container.innerHTML = '<p><i>Error: Element data not found.</i></p>'; return; } const deepDiveLevels = elementDeepDive[elementNameKey] || []; container.innerHTML = `<h6><i class="fas fa-book-open"></i> Element Insights</h6>`; if (deepDiveLevels.length === 0) { container.innerHTML += '<p><i>No deep dive insights defined.</i></p>'; return; } deepDiveLevels.forEach(levelData => { if (!levelData || typeof levelData.level !== 'number') return; const levelDiv = document.createElement('div'); levelDiv.classList.add('deep-dive-level'); if (levelData.level <= unlockedLevel) { levelDiv.classList.add('unlocked'); levelDiv.innerHTML = `<h6><i class="fas fa-lock-open"></i> Level ${levelData.level}: ${levelData.title || ''}</h6><p>${levelData.content || ''}</p>`; } else if (levelData.level === unlockedLevel + 1) { levelDiv.classList.add('locked'); const cost = levelData.insightCost || Config.LORE_UNLOCK_COSTS[`level${levelData.level}`] || 999; const canAfford = State.getInsight() >= cost; const errorMsg = canAfford ? '' : `<span class="unlock-error">Requires ${cost.toFixed(1)} Insight</span>`; levelDiv.innerHTML = `<h6><i class="fas fa-lock"></i> Level ${levelData.level}: ${levelData.title || 'Next Insight'}</h6><button class="button tiny-button unlock-button btn" data-element-key="${elementKey}" data-level="${levelData.level}" data-cost="${cost}" ${canAfford ? '' : 'disabled'} title="${canAfford ? `Unlock for ${cost.toFixed(1)} Insight` : `Requires ${cost.toFixed(1)} Insight`}">Unlock (${cost.toFixed(1)} <i class="fas fa-brain insight-icon"></i>)</button>${errorMsg}`; } else { levelDiv.classList.add('locked'); levelDiv.innerHTML = `<h6><i class="fas fa-lock"></i> Level ${levelData.level} (Locked)</h6>`; levelDiv.style.opacity = '0.6'; } container.appendChild(levelDiv); }); }

// --- Contemplation Button ---
export function updateContemplationButtonState() { const btn = document.getElementById('contemplationNode'); if (!btn) return; const costDisplay = btn.querySelector('.contemplation-cost'); if (costDisplay) costDisplay.textContent = Config.CONTEMPLATION_COST; const cooldownEnd = State.getContemplationCooldownEnd?.() ?? null; const now = Date.now(); if (contemplationTimeoutId) clearTimeout(contemplationTimeoutId); if (cooldownEnd && now < cooldownEnd) { const remaining = Math.ceil((cooldownEnd - now) / 1000); btn.disabled = true; btn.title = `Contemplation cooling down (${remaining}s)`; const icon = btn.querySelector('i.fa-brain'); if (icon && icon.nextSibling && icon.nextSibling.nodeType === Node.TEXT_NODE) icon.nextSibling.textContent = ` Focusing Lens (${remaining}s)`; contemplationTimeoutId = setTimeout(updateContemplationButtonState, 1000); } else { const canAfford = State.getInsight() >= Config.CONTEMPLATION_COST; btn.disabled = !canAfford; btn.title = canAfford ? `Begin contemplation (Cost: ${Config.CONTEMPLATION_COST} Insight)` : `Requires ${Config.CONTEMPLATION_COST} Insight`; const icon = btn.querySelector('i.fa-brain'); if (icon && icon.nextSibling && icon.nextSibling.nodeType === Node.TEXT_NODE) { const costSpan = btn.querySelector('.contemplation-cost'); const insightIconHTML = '<i class="fas fa-brain insight-icon"></i>'; if (costSpan) btn.innerHTML = `<i class="fas fa-brain" aria-hidden="true"></i> Focusing Lens (${costSpan.outerHTML} ${insightIconHTML})`; else btn.innerHTML = `<i class="fas fa-brain" aria-hidden="true"></i> Focusing Lens (${Config.CONTEMPLATION_COST} ${insightIconHTML})`; } } }

// --- Dilemma Modal ---
export function displayElementalDilemma(dilemmaData) { const situation = getElement('dilemmaSituationText'); const question = getElement('dilemmaQuestionText'); const slider = getElement('dilemmaSlider'); const minLabel = getElement('dilemmaSliderMinLabel'); const maxLabel = getElement('dilemmaSliderMaxLabel'); const valueDisplay = getElement('dilemmaSliderValueDisplay'); const nudgeCheck = getElement('dilemmaNudgeCheckbox'); if (!dilemmaModal || !situation || !question || !slider || !minLabel || !maxLabel || !valueDisplay || !nudgeCheck) return; situation.textContent = dilemmaData?.situation ?? '...'; question.textContent = dilemmaData?.question ?? '...'; minLabel.textContent = dilemmaData?.sliderMinLabel ?? 'A'; maxLabel.textContent = dilemmaData?.sliderMaxLabel ?? 'B'; slider.value = 5; valueDisplay.textContent = 'Balanced'; nudgeCheck.checked = false; dilemmaModal.classList.remove('hidden'); const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible'); if (popupOverlay && !onboardingActive) popupOverlay.classList.remove('hidden'); }

// --- Settings Popup ---
export function showSettings() { if (settingsPopup) { settingsPopup.classList.remove('hidden'); const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible'); if (popupOverlay && !onboardingActive) popupOverlay.classList.remove('hidden'); } }

// --- Hint Bubbles ---
export function showHintOnce(id, targetSelector, html){ if(localStorage.getItem('hint.'+id)) return; const target = document.querySelector(targetSelector); if(!target || target.offsetParent === null) return; document.querySelectorAll('.hint-bubble').forEach(b => b.remove()); const bubble = document.createElement('div'); bubble.className = 'hint-bubble'; bubble.innerHTML = html + '<span class="hint-close" title="Dismiss Hint">✕</span>'; document.body.append(bubble); const r = target.getBoundingClientRect(); bubble.style.top = (r.bottom + 8 + window.scrollY) + 'px'; bubble.style.left = (r.left + window.scrollX) + 'px'; bubble.querySelector('.hint-close').onclick = ()=>bubble.remove(); localStorage.setItem('hint.'+id,'seen'); }

// --- Element Sanctum Modal UI (NEW) ---
export function showSanctumModal(){
    if (!sanctumModal || !sanctumGrid) {
        console.error("Sanctum modal elements not found!");
        return;
    }
    sanctumGrid.innerHTML=''; // Clear previous
    const currentLevels = State.getElementLevel(); // { A: 0, I: 1, ... }
    const tokensAvailable = State.getLevelTokens();

    elementNames.forEach(elementNameKey => { // Iterate through "Attraction", etc.
        const key = Object.keys(elementKeyToFullName).find(k => elementKeyToFullName[k] === elementNameKey); // Get 'A', 'I', etc.
        if (!key) return; // Skip if key mapping fails

        const currentLevel = currentLevels[key] || 0;
        const canUpgrade = tokensAvailable > 0 && currentLevel < Config.MAX_ELEMENT_LEVEL;
        const shortName = Utils.getElementShortName(elementNameKey);
        const nextLevel = Math.min(currentLevel + 1, Config.MAX_ELEMENT_LEVEL);

        const div = document.createElement('div');
        div.className = 'sanctum-item';
        div.classList.toggle('disabled', !canUpgrade);
        div.style.setProperty('--element-color', Utils.getElementColor(elementNameKey)); // For potential styling
        div.innerHTML = `
            <i class="${Utils.getElementIcon(elementNameKey)}"></i>
            <strong>${shortName}</strong><br>
            Level ${currentLevel} → ${nextLevel}
            <small>${Utils.getElementLevelName(currentLevel)}</small>
        `;
        div.title = canUpgrade ? `Spend 1 Token to upgrade ${shortName} to Level ${nextLevel}` : (currentLevel >= Config.MAX_ELEMENT_LEVEL ? "Max Level Reached" : "No Level Tokens available");

        if (canUpgrade) {
            div.onclick = () => GameLogic.handleElementUpgrade(key); // Call game logic to handle upgrade
        }
        sanctumGrid.appendChild(div);
    });

    sanctumModal.classList.remove('hidden');
    if (popupOverlay && !(onboardingOverlay && onboardingOverlay.classList.contains('visible'))) {
         popupOverlay.classList.remove('hidden');
    }
}

export function hideSanctumModal(){
    if (sanctumModal) sanctumModal.classList.add('hidden');
    // Hide overlay only if no other popups are open
    const anyGeneralPopupVisible = document.querySelector('.popup:not(#sanctumModal):not(.hidden):not(.onboarding-popup)');
     const onboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('visible');
     if (!anyGeneralPopupVisible && popupOverlay && !onboardingActive) {
         popupOverlay.classList.add('hidden');
     }
}

// **NEW**: Show Concept Micro-Story (Placeholder)
export function showConceptMicroStory(conceptId) {
   const concept = State.getDiscoveredConceptData(conceptId)?.concept;
   if (!concept) return;
   // Replace alert with a proper modal later
   alert(`Micro-Story: ${concept.name}\n\n“${concept.microStory || 'The ink is still drying on this tale... Check back later!'}”`);
}

// **NEW**: Show Scene Seed (Placeholder)
export function showConceptSceneSeed(conceptId) {
     const concept = State.getDiscoveredConceptData(conceptId)?.concept;
     if (!concept) return;
     // Placeholder - Generate or fetch scene seed content later
     alert(`Scene Seed: ${concept.name}\n\nImagine a scene involving: ${concept.keywords ? concept.keywords.join(', ') : '...'}. Let your imagination fill in the details!`);
}

// **NEW**: Show Deep Lore (Placeholder - could be integrated with existing lore?)
export function showConceptDeepLore(conceptId) {
     const concept = State.getDiscoveredConceptData(conceptId)?.concept;
     if (!concept) return;
     // Placeholder - Fetch deep lore content
     alert(`Deep Lore: ${concept.name}\n\n(Imagine 1-2 paragraphs of richer backstory, philosophy, or connection to other concepts here...)`);
}

// **NEW**: Show Secret Scene (Placeholder)
export function showConceptSecretScene(conceptId) {
     const concept = State.getDiscoveredConceptData(conceptId)?.concept;
     if (!concept) return;
     // Placeholder - Fetch secret scene details
     alert(`Secret Scene Blueprint: ${concept.name}\n\n(Imagine a detailed scene outline here, potentially exportable.)`);
}


console.log("ui.js loaded successfully. (XP/Leveling v1.0)");
// --- END OF FILE ui.js ---
