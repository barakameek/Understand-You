
import * as State from './state.js';
import * as Config from './config.js';
import * as Utils from './utils.js';
import * as GameLogic from './gameLogic.js'; // GameLogic reference might be circular, but needed for some UI updates based on its state/calculations
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

console.log("ui.js loading... (Corrected Exports - XP/Leveling v1.0)");

// --- Helper Function for Image Errors ---
function handleImageError(imgElement) { if (imgElement) { imgElement.style.display = 'none'; const visualContainer = imgElement.closest('.card-visual, .popup-visual'); const placeholder = visualContainer?.querySelector('.card-visual-placeholder'); if (placeholder) { placeholder.style.display = 'flex'; placeholder.title = `Art Placeholder (Load Failed: ${imgElement.src?.split('/')?.pop() || 'unknown'})`; } } }
window.handleImageError = handleImageError; // Make accessible globally if needed by onerror attribute

// --- DOM Element References ---
const getElement = (id) => document.getElementById(id);
// ... (Keep ALL const declarations for elements as they were in the previous correct ui.js)
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
const popupLoreSection = getElement('popupLoreSection');
const popupCardUnlocksSection = getElement('popupCardUnlocksSection');
const popupCardUnlocksContent = getElement('popupCardUnlocksContent');
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
const onboardingProgressSpan = getElement('onboardingProgress');
const onboardingTitle = getElement('onboarding-heading');
const onboardingPrevButton = getElement('onboardingPrevButton');
const onboardingNextButton = getElement('onboardingNextButton');
const onboardingSkipButton = getElement('onboardingSkipButton');
const skipTourBtn = getElement('skipTourBtn');
const onboardingHighlight = getElement('onboardingHighlight');
// Element Sanctum Modal
const sanctumModal = getElement('sanctumModal');
const sanctumGrid = getElement('sanctumGrid');
const closeSanctumBtn = getElement('closeSanctumBtn');
const sanctumTokenCountSpan = getElement('sanctumTokenCount'); // Reference for token count inside Sanctum

// --- Module-level Variables ---
let personaChartInstance = null;
let toastTimeout = null;
let milestoneTimeout = null;
let insightBoostTimeoutId = null;
let contemplationTimeoutId = null;
let previousScreenId = 'welcomeScreen';

// --- Internal Helper Functions (Not Exported) ---
function getTourForScreen(screenId){ switch(screenId){ case 'workshopScreen': return onboardingWorkshopIntro; case 'repositoryScreen': return onboardingRepositoryIntro; case 'welcomeScreen': case 'questionnaireScreen': case 'personaScreen': default: return onboardingWelcomeIntro; } }
function updateShelfCounts() { if (!grimoireShelvesWorkshop) return; const conceptData = Array.from(State.getDiscoveredConcepts().values()); grimoireShelves.forEach(shelfDef => { const shelfElem = grimoireShelvesWorkshop.querySelector(`.grimoire-shelf[data-category-id="${shelfDef.id}"] .shelf-count`); if (shelfElem) { const count = conceptData.filter(data => (data.userCategory || 'uncategorized') === shelfDef.id).length; shelfElem.textContent = `(${count})`; } }); const showAllShelfCount = grimoireShelvesWorkshop.querySelector(`.show-all-shelf .shelf-count`); if (showAllShelfCount) showAllShelfCount.textContent = `(${conceptData.length})`; }
function updateResearchPopupState() { if (!researchPopupContent) return; const items = researchPopupContent.querySelectorAll('.research-result-item'); const duplicateInsightGain = parseFloat(researchPopupContent.querySelector('.duplicate-insight-info')?.textContent.match(/gained ([\d.]+)/)?.[1] || '0'); if (!items || items.length === 0) { if(researchPopupStatus) researchPopupStatus.textContent = duplicateInsightGain > 0 ? "Insight gained." : "No discoveries."; if(closeResearchResultsPopupButton) closeResearchResultsPopupButton.disabled = false; if(confirmResearchChoicesButton) confirmResearchChoicesButton.classList.add('hidden'); return; } const unprocessedItems = Array.from(items).filter(item => item.dataset.processed === "false" || item.dataset.choiceMade === "pending_dissonance"); const allProcessed = unprocessedItems.length === 0; if(researchPopupStatus) researchPopupStatus.textContent = allProcessed ? "All processed." : `Choose for remaining ${unprocessedItems.length} finding(s).`; if(closeResearchResultsPopupButton) closeResearchResultsPopupButton.disabled = !allProcessed; if(confirmResearchChoicesButton) confirmResearchChoicesButton.classList.toggle('hidden', !allProcessed); }
function updateOnboardingHighlight(elementId) { if (!onboardingHighlight) return; const targetElement = elementId ? getElement(elementId) : null; if (targetElement && targetElement.offsetParent !== null) { const rect = targetElement.getBoundingClientRect(); onboardingHighlight.style.left = `${rect.left - 5 + window.scrollX}px`; onboardingHighlight.style.top = `${rect.top - 5 + window.scrollY}px`; onboardingHighlight.style.width = `${rect.width + 10}px`; onboardingHighlight.style.height = `${rect.height + 10}px`; onboardingHighlight.style.display = 'block'; const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)'); targetElement.scrollIntoView({ behavior: mediaQuery.matches ? 'auto' : 'smooth', block: 'center', inline: 'nearest' }); } else { onboardingHighlight.style.display = 'none'; } }
function displayPopupResonanceGauge(score) { /* ... function body ... */ }
function displayPopupRelatedConceptsTags(relatedIds) { /* ... function body ... */ }
function displayPopupRecipeComparison(conceptScores, userScores) { /* ... function body ... */ }
// This function is now internal as it's only called by showConceptDetailPopup
function displayPopupLore(conceptId, loreData, unlockedLevel) {
     if (!popupLoreSection || !popupLoreContent) { console.warn("Popup lore elements missing."); return; }
     popupLoreContent.innerHTML = ''; // Clear previous content

     if (!loreData || !Array.isArray(loreData) || loreData.length === 0) {
         popupLoreSection.classList.add('hidden'); return;
     }
     popupLoreSection.classList.remove('hidden');

    let canUnlockMore = false;
    loreData.forEach(entry => {
        if (entry.level <= unlockedLevel) {
            const entryDiv = document.createElement('div'); entryDiv.classList.add('lore-entry');
            entryDiv.innerHTML = `<h6><i class="fas fa-scroll"></i> Level ${entry.level}</h6><p>${entry.text}</p>`;
            popupLoreContent.appendChild(entryDiv);
        } else if (entry.level === unlockedLevel + 1) {
            canUnlockMore = true; const unlockDiv = document.createElement('div'); unlockDiv.classList.add('lore-unlock');
            const cost = entry.insightCost || Config.LORE_UNLOCK_COSTS[`level${entry.level}`] || 999;
            const canAfford = State.getInsight() >= cost;
            const errorMsg = canAfford ? '' : `<span class="unlock-error">Requires ${cost.toFixed(1)} Insight</span>`;
            unlockDiv.innerHTML = `<button class="button small-button unlock-lore-button btn" data-concept-id="${conceptId}" data-lore-level="${entry.level}" data-cost="${cost}" ${canAfford ? '' : 'disabled'} title="${canAfford ? `Unlock for ${cost.toFixed(1)} Insight` : `Requires ${cost.toFixed(1)} Insight`}">Unlock Level ${entry.level} Lore (${cost.toFixed(1)} <i class="fas fa-brain insight-icon"></i>)</button>${errorMsg}`;
            popupLoreContent.appendChild(unlockDiv);
        }
    });
    if (!canUnlockMore && unlockedLevel >= loreData.length) popupLoreContent.innerHTML += '<p><i>All legacy lore unlocked.</i></p>';
    if (State.isNewLoreAvailable(conceptId)) State.markLoreAsSeen(conceptId);
}
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
