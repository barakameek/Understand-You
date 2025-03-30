let currentElementIndex = 0;
let userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
let userAnswers = {};
const elementNames = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
let currentElementAnswers = {};
let selectedElements = []; // Track selected elements for mixing
let currentlyDisplayedConceptId = null;
let discoveredConcepts = new Map(); // Use Map to store ID -> { concept, discoveredTime }
let coreConcepts = new Set(); // Track IDs marked as core
let elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; // Track interaction count
let elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; // Track collected essence

// --- DOM Elements ---
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startGuidedButton');
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
const personaScreen = document.getElementById('personaScreen');
const personaElementDetailsDiv = document.getElementById('personaElementDetails'); // For element details
const elementEssenceDisplay = document.getElementById('elementEssenceDisplay'); // For essence
const personaThemesList = document.getElementById('personaThemesList'); // For themes
const personaCoreConceptsList = document.getElementById('personaCoreConceptsList'); // For core concepts
const restartButtonPersona = document.getElementById('restartButtonPersona');
const labScreen = document.getElementById('labScreen');
const grimoireCountSpan = document.getElementById('grimoireCount');
const elementVialsDiv = document.getElementById('elementVials');
const clearSelectionButton = document.getElementById('clearSelectionButton');
const resultsBenchDiv = document.getElementById('conceptResults');
const mixingStatusDiv = document.getElementById('mixingStatus');
const grimoireScreen = document.getElementById('grimoireScreen');
const grimoireElementFilter = document.getElementById('grimoireElementFilter');
const grimoireSortOrder = document.getElementById('grimoireSortOrder');
const grimoireContentDiv = document.getElementById('grimoireContent');
const conceptDetailPopup = document.getElementById('conceptDetailPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupConceptName = document.getElementById('popupConceptName');
const popupConceptType = document.getElementById('popupConceptType');
const popupResonanceSummary = document.getElementById('popupResonanceSummary');
const popupComparisonHighlights = document.getElementById('popupComparisonHighlights');
const popupConceptProfile = document.getElementById('popupConceptProfile');
const popupUserComparisonProfile = document.getElementById('popupUserComparisonProfile');
const popupRelatedConceptsList = document.getElementById('relatedConceptsList');
const closePopupButton = document.getElementById('closePopupButton');
const addToGrimoireButton = document.getElementById('addToGrimoireButton');
const markAsCoreButton = document.getElementById('markAsCoreButton');


// --- Utility & Setup Functions ---

function getScoreLabel(score) {
    // Keep this function as its logic aligns with the new 0-10 ranges and data structure
    if (score >= 9) return "Very High";
    if (score >= 7) return "High";
    if (score >= 5) return "Moderate";
    if (score >= 3) return "Low";
    return "Very Low";
}

// getScoreInterpretation function is REMOVED

function showScreen(screenId) {
    console.log("Showing screen:", screenId); // Debug log
    let targetIsMain = ['personaScreen', 'labScreen', 'grimoireScreen'].includes(screenId);
    screens.forEach(screen => {
        screen.id === screenId ? screen.classList.add('current') : screen.classList.add('hidden');
        screen.id === screenId ? screen.classList.remove('hidden') : screen.classList.remove('current');
    });
    mainNavBar.classList.toggle('hidden', !targetIsMain);
    navButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.target === screenId);
    });
    // Scroll to top for specific screens
    if (['questionnaireScreen', 'grimoireScreen', 'personaScreen'].includes(screenId)) {
        window.scrollTo(0, 0);
    }
}

function initializeQuestionnaire() {
    currentElementIndex = 0;
    userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
    userAnswers = {};
    elementNames.forEach(el => userAnswers[el] = {});
    discoveredConcepts = new Map();
    coreConcepts = new Set();
    elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
    elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
    updateElementProgressHeader(-1); // Show all tabs initially non-completed
    displayElementQuestions(currentElementIndex);
    showScreen('questionnaireScreen');
    mainNavBar.classList.add('hidden');
}

function updateElementProgressHeader(activeIndex) {
    elementProgressHeader.innerHTML = '';
    elementNames.forEach((name, index) => {
        const tab = document.createElement('div');
        tab.classList.add('element-tab');
        const elementData = elementDetails[name] || {};
        tab.textContent = (elementData.name || name).substring(0, 3).toUpperCase();
        tab.title = elementData.name || name;
        if (index < activeIndex) tab.classList.add('completed');
        else if (index === activeIndex) tab.classList.add('active');
        elementProgressHeader.appendChild(tab);
    });
}

function enforceMaxChoices(name, max, event) {
    const checkboxes = questionContent.querySelectorAll(`input[name="${name}"]:checked`); // Scope search
    if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        if (event && event.target && event.target.checked) {
            event.target.checked = false;
        }
    }
}

function displayElementQuestions(index) {
    if (index >= elementNames.length) {
        finalizeScoresAndShowPersona();
        return;
    }
    const element = elementNames[index];
    const elementData = elementDetails[element] || {}; // Get data from new structure
    const questions = questionnaireGuided[element] || [];

    updateElementProgressHeader(index);
    progressText.textContent = `Element ${index + 1} / ${elementNames.length}: ${elementData.name || element}`;

    // Use new data for the intro - include Persona Connection
    questionContent.innerHTML = `
        <div class="element-intro">
            <h2>${elementData.name || element}</h2>
            <p><em>${elementData.coreQuestion || ''}</em></p>
            <p>${elementData.coreConcept || 'Loading description...'}</p>
             <p><small><strong>Persona Connection:</strong> ${elementData.personaConnection || ''}</small></p>
        </div>`;

    currentElementAnswers = { ...(userAnswers[element] || {}) };

    let questionsHTML = ''; // Build HTML string first
    questions.forEach(q => {
        let inputHTML = `<div class="question-block" id="block_${q.qId}"><h3 class="question-title">${q.text}</h3><div class="input-container">`;
        const savedAnswer = currentElementAnswers[q.qId];

        if (q.type === "slider") {
            const currentValue = savedAnswer !== undefined ? savedAnswer : q.defaultValue;
            inputHTML += `<div class="slider-container">
                           <input type="range" id="${q.qId}" class="slider q-input" min="${q.minValue}" max="${q.maxValue}" step="${q.step || 0.5}" value="${currentValue}" data-question-id="${q.qId}" data-type="slider">
                           <div class="label-container"><span class="label-text">${q.minLabel}</span><span class="label-text">${q.maxLabel}</span></div>
                           <p class="value-text">Selected: <span id="display_${q.qId}">${parseFloat(currentValue).toFixed(1)}</span></p>
                         </div>`;
        } else if (q.type === "radio") {
            inputHTML += `<div class="radio-options">`;
            q.options.forEach(opt => {
                const isChecked = savedAnswer === opt.value ? 'checked' : '';
                // Wrap input and label together for better accessibility and click handling
                inputHTML += `<div>
                               <input type="radio" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-type="radio">
                               <label for="${q.qId}_${opt.value}">${opt.value}</label>
                             </div>`;
            });
            inputHTML += `</div>`;
        } else if (q.type === "checkbox") {
            inputHTML += `<div class="checkbox-options">`;
            q.options.forEach(opt => {
                const isChecked = savedAnswer?.includes(opt.value) ? 'checked' : '';
                 // Wrap input and label together
                inputHTML += `<div>
                               <input type="checkbox" id="${q.qId}_${opt.value}" class="q-input" name="${q.qId}" value="${opt.value}" ${isChecked} data-question-id="${q.qId}" data-max-choices="${q.maxChoices || 2}" data-type="checkbox">
                               <label for="${q.qId}_${opt.value}">${opt.value}</label>
                             </div>`;
            });
            inputHTML += `</div>`;
        }
        inputHTML += `</div></div>`; // Close input-container and question-block
        questionsHTML += inputHTML; // Append question block HTML
    });
    // Append all questions at once AFTER the intro
    questionContent.innerHTML += questionsHTML;

    // Add listeners AFTER content is in DOM
    questionContent.querySelectorAll('.q-input').forEach(input => {
        const eventType = (input.type === 'range') ? 'input' : 'change';
        input.addEventListener(eventType, handleQuestionnaireInputChange);
    });

    // Ensure checkbox listeners for maxChoices are added correctly
    questionContent.querySelectorAll('input[type="checkbox"].q-input').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => enforceMaxChoices(checkbox.name, parseInt(checkbox.dataset.maxChoices || 2), event));
    });


    updateDynamicFeedback(element);
    dynamicScoreFeedback.style.display = 'block';
    prevElementButton.style.visibility = (index > 0) ? 'visible' : 'hidden'; // Use visibility
    nextElementButton.textContent = (index === elementNames.length - 1) ? "View My Persona" : "Next Element";
}


function handleQuestionnaireInputChange(event) {
    const input = event.target;
    const qId = input.dataset.questionId;
    const type = input.dataset.type;
    const element = elementNames[currentElementIndex];

    // Max choices are handled by separate listener now
    // if (type === 'checkbox') { enforceMaxChoices(input.name, parseInt(input.dataset.maxChoices || 2), event); }

    if (type === 'slider') {
        const display = document.getElementById(`display_${qId}`);
        if(display) display.textContent = parseFloat(input.value).toFixed(1);
    }
    collectCurrentElementAnswers(); // Collect answers immediately on any change
    updateDynamicFeedback(element); // Update score feedback immediately
}

function collectCurrentElementAnswers() {
    const element = elementNames[currentElementIndex];
    const questions = questionnaireGuided[element] || [];
    currentElementAnswers = {}; // Reset for this element

    questions.forEach(q => {
        const qId = q.qId;
        if (q.type === 'slider') {
            const input = questionContent.querySelector(`#${qId}.q-input`); // Scope search
            if (input) currentElementAnswers[qId] = parseFloat(input.value);
        } else if (q.type === 'radio') {
            const checked = questionContent.querySelector(`input[name="${qId}"]:checked`); // Scope search
            if (checked) currentElementAnswers[qId] = checked.value;
        } else if (q.type === 'checkbox') {
            const checked = questionContent.querySelectorAll(`input[name="${qId}"]:checked`); // Scope search
            currentElementAnswers[qId] = Array.from(checked).map(cb => cb.value);
        }
    });
    userAnswers[element] = { ...currentElementAnswers }; // Save snapshot for the element
}


function updateDynamicFeedback(element) {
    const tempScore = calculateElementScore(element, currentElementAnswers);
    feedbackElementSpan.textContent = elementDetails[element]?.name || element; // Use proper name
    feedbackScoreSpan.textContent = tempScore.toFixed(1);
    let labelSpan = dynamicScoreFeedback.querySelector('.score-label');
    // This check might be overly complex, simplify if needed
    if (!labelSpan) {
        // Find the feedbackScore span, insert the label span after it
        const scoreSpanParent = feedbackScoreSpan.parentNode;
        labelSpan = document.createElement('span');
        labelSpan.classList.add('score-label');
        // Insert space and then the label
        scoreSpanParent.insertBefore(document.createTextNode(' '), feedbackScoreSpan.nextSibling);
        scoreSpanParent.insertBefore(labelSpan, feedbackScoreSpan.nextSibling.nextSibling);
    }
    labelSpan.textContent = `(${getScoreLabel(tempScore)})`;
    feedbackScoreBar.style.width = `${tempScore * 10}%`;
}

function calculateElementScore(element, answersForElement) {
    const questions = questionnaireGuided[element] || [];
    let score = 5.0; // Start at baseline

    questions.forEach(q => {
        const answer = answersForElement[q.qId];
        let pointsToAdd = 0;

        if (q.type === 'slider') {
            const value = (answer !== undefined) ? answer : q.defaultValue;
            // Slider points are relative to the default value
            pointsToAdd = (value - q.defaultValue) * (q.scoreWeight || 1.0);
        } else if (q.type === 'radio') {
            const selectedOption = q.options.find(opt => opt.value === answer);
            // Radio/Checkbox points are absolute additions/subtractions
            pointsToAdd = selectedOption ? (selectedOption.points || 0) * (q.scoreWeight || 1.0) : 0;
        } else if (q.type === 'checkbox' && answer && Array.isArray(answer)) {
            answer.forEach(val => {
                const selectedOption = q.options.find(opt => opt.value === val);
                pointsToAdd += selectedOption ? (selectedOption.points || 0) * (q.scoreWeight || 1.0) : 0;
            });
        }
        score += pointsToAdd;
    });

    return Math.max(0, Math.min(10, score)); // Clamp score between 0 and 10
}


function finalizeScoresAndShowPersona() {
    console.log("Finalizing scores...");
    elementNames.forEach(element => {
        userScores[element] = calculateElementScore(element, userAnswers[element] || {});
    });
    console.log("Final User Scores:", userScores);

    // Populate Persona Screen content *before* showing it
    displayPersonaScreen();
    // Setup Lab screen content (vials, initial results)
    displayElementVials();
    filterAndDisplayConcepts();
    // Update Grimoire related UI
    updateGrimoireCounter();
    populateGrimoireFilter();

    // Finally, switch the view
    showScreen('personaScreen');
}

function nextElement() {
    collectCurrentElementAnswers(); // Ensure current answers are saved
    currentElementIndex++;
    displayElementQuestions(currentElementIndex); // Display next or finalize
}
function prevElement() {
    collectCurrentElementAnswers(); // Ensure current answers are saved
    currentElementIndex--;
    displayElementQuestions(currentElementIndex); // Display previous
}

// --- Persona Screen Functions ---

function displayPersonaScreen() {
    console.log("Running displayPersonaScreen..."); // Debug log

    // Check if the main container div is found *at this time*
    if (!personaElementDetailsDiv) {
        console.error("Persona details div (#personaElementDetails) not found!");
        return; // Stop if the container isn't there
    }
    personaElementDetailsDiv.innerHTML = ''; // Clear previous content

    elementNames.forEach(element => {
        const score = userScores[element];
        const scoreLabel = getScoreLabel(score);
        const elementData = elementDetails[element] || {}; // Get data from new structure

        // Get the specific interpretation based on the score label
        const interpretation = elementData.scoreInterpretations?.[scoreLabel] || "Interpretation not available.";
        const barWidth = score * 10;

        const details = document.createElement('details');
        details.classList.add('element-detail-entry');

        // Use the new structured data for display
        details.innerHTML = `
            <summary class="element-detail-header">
                <div>
                    <strong>${elementData.name || element}:</strong>
                    <span>${score.toFixed(1)}</span>
                    <span class="score-label">(${scoreLabel})</span>
                </div>
                <div class="score-bar-container" style="height: 10px; max-width: 100px;">
                    <div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div>
                </div>
            </summary>
            <div class="element-description">
                <p><strong>Core Concept:</strong> ${elementData.coreConcept || ''}</p>
                <p><strong>Elaboration:</strong> ${elementData.elaboration || ''}</p>
                <hr style="border-top: 1px dashed #c8b89a; margin: 8px 0;">
                <p><strong>Your Score (${scoreLabel}):</strong> ${interpretation}</p> <!-- Use direct interpretation -->
                <p><small><strong>Examples:</strong> ${elementData.examples || ''}</small></p>
            </div>
        `;
        personaElementDetailsDiv.appendChild(details);
    });
    console.log("Element details populated."); // Debug log

    // Call sub-functions to populate other areas
    displayElementEssence();
    synthesizeAndDisplayThemes();
    displayCoreConcepts();
     console.log("Persona sub-sections populated."); // Debug log
}


function displayElementEssence() {
     // Add defensive check
     if (!elementEssenceDisplay) {
         console.error("Essence display div (#elementEssenceDisplay) not found!");
         return;
     }
     elementEssenceDisplay.innerHTML = '<h4>Collected Essence</h4>';
     let hasEssence = false;
     elementNames.forEach(el => {
         const essenceValue = parseFloat(elementEssence[el] || 0);
         if (essenceValue > 0) hasEssence = true;
         elementEssenceDisplay.innerHTML += `
            <div class="essence-item">
                <span class="essence-icon" style="background-color: ${getElementColor(el)};"></span>
                <span class="essence-name">${elementDetails[el]?.name || el}:</span>
                <span class="essence-value">${essenceValue.toFixed(1)}</span>
            </div>`;
     });
     if (!hasEssence) {
         elementEssenceDisplay.innerHTML += '<p style="font-size: 0.85em; text-align: left; color: #777;"><i>Add concepts to your Grimoire to collect Essence.</i></p>';
     }
     console.log("Essence displayed."); // Debug log
 }

function synthesizeAndDisplayThemes() {
     // Add defensive check
     if (!personaThemesList) {
         console.error("Themes list ul (#personaThemesList) not found!");
         return;
     }
     personaThemesList.innerHTML = ''; // Clear previous
     if (discoveredConcepts.size === 0) {
         personaThemesList.innerHTML = '<li>Explore the Lab and add concepts to your Grimoire to reveal potential themes.</li>';
         console.log("Themes: No concepts discovered."); // Debug log
         return;
     }

     const elementCounts = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
     const threshold = 7.0; // Concept score threshold to count towards a theme

     discoveredConcepts.forEach((data, id) => {
         const concept = data.concept;
         if (concept && concept.elementScores) {
             elementNames.forEach(el => {
                 if (concept.elementScores[el] >= threshold) {
                     elementCounts[el]++;
                 }
             });
         }
     });

     // Filter elements with counts > 0 and sort by count descending
     const sortedThemes = Object.entries(elementCounts)
        .filter(([el, count]) => count > 0)
        .sort(([, countA], [, countB]) => countB - countA);

     if (sortedThemes.length === 0) {
         personaThemesList.innerHTML = '<li>No strong elemental themes identified in your Grimoire yet (concepts need high scores in an element).</li>';
         console.log("Themes: No strong themes found."); // Debug log
         return;
     }

     // Display top 3 themes
     sortedThemes.slice(0, 3).forEach(([element, count]) => {
         const li = document.createElement('li');
         li.textContent = `${elementDetails[element]?.name || element} Focus (Prominent in ${count} discovered concepts)`;
         personaThemesList.appendChild(li);
     });
      console.log("Themes displayed:", sortedThemes.slice(0, 3)); // Debug log
}

function displayCoreConcepts() {
     // Add defensive check
     if (!personaCoreConceptsList) {
          console.error("Core concepts list ul (#personaCoreConceptsList) not found!");
          return;
     }
     personaCoreConceptsList.innerHTML = ''; // Clear previous
     if (coreConcepts.size === 0) {
         personaCoreConceptsList.innerHTML = '<li>Mark concepts as "Core" via the Lab results pop-up to build your constellation.</li>';
         console.log("Core Concepts: None marked."); // Debug log
         return;
     }

     coreConcepts.forEach(conceptId => {
         // Find concept using the ID (ensure concepts array is accessible)
         const concept = concepts.find(c => c.id === conceptId);
         if (concept) {
             const li = document.createElement('li');
             li.textContent = `${concept.name} (${concept.type})`;
             // Optional: Add click handler to re-open popup from here?
             // li.dataset.conceptId = concept.id;
             // li.style.cursor = 'pointer';
             // li.addEventListener('click', () => showConceptDetailPopup(concept.id));
             personaCoreConceptsList.appendChild(li);
         } else {
             console.warn(`Core concept ID ${conceptId} not found in concepts data.`);
         }
     });
     console.log("Core Concepts displayed:", coreConcepts); // Debug log
}


// --- Lab Screen Functions ---

function displayElementVials() {
    elementVialsDiv.innerHTML = '';
    elementNames.forEach(element => {
        const score = userScores[element];
        const elementData = elementDetails[element] || {}; // Get data from new structure
        const vial = document.createElement('div');
        vial.classList.add('vial');
        vial.dataset.element = element;
        // Update title using new data (e.g., Core Question or Persona Connection)
        vial.title = `${elementData.name || element}: ${elementData.personaConnection || elementData.coreQuestion || 'Click to select...'}`;
        if (selectedElements.includes(element)) {
            vial.classList.add('selected'); // Add 'selected' class if in the array
            // Keep resonating logic separate in handleVialClick for click feedback
        }
        vial.innerHTML = `
            <div class="vial-icon">
                <div class="vial-liquid" style="height: ${score * 10}%; background-color: ${getElementColor(element)};"></div>
            </div>
            <div class="vial-label">
                <span class="vial-name">${elementData.name || element}</span>
                <span class="vial-score">Score: ${score.toFixed(1)}</span>
            </div>
        `;
        vial.addEventListener('click', handleVialClick);
        elementVialsDiv.appendChild(vial);
    });
    // Update disabled state and clear button visibility based on initial selectedElements
    updateVialStates();
    clearSelectionButton.classList.toggle('hidden', selectedElements.length === 0);
}

function getElementColor(elementName) {
    const colors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' };
    return colors[elementName] || '#CCCCCC'; // Default grey
}

function handleVialClick(event) {
    const clickedVial = event.currentTarget;
    const element = clickedVial.dataset.element;

    // Track interaction for potential future use (Attunement)
    elementAttunement[element]++;
    console.log(`Attunement for ${element}: ${elementAttunement[element]}`);

    // Visual feedback for click
    clickedVial.classList.add('resonating');
    setTimeout(() => {
        // Remove glow only if it's NOT currently selected (otherwise keep glow via 'selected' styles potentially)
        if (!selectedElements.includes(element)) {
             clickedVial.classList.remove('resonating');
        }
    }, 1500); // Match pulse animation duration

    // Toggle selection logic
    if (selectedElements.includes(element)) {
        // Deselect
        selectedElements = selectedElements.filter(el => el !== element);
        clickedVial.classList.remove('selected', 'resonating'); // Ensure resonating is removed on deselect
    } else if (selectedElements.length < 2) {
        // Select (if less than 2 already selected)
        selectedElements.push(element);
        clickedVial.classList.add('selected');
    } else {
        // Max 2 selected, don't add this one
        alert("You can only mix up to 2 elements at a time. Clear selection or deselect one first.");
        clickedVial.classList.remove('resonating'); // Remove click feedback if selection failed
        return; // Stop further processing
    }

    updateVialStates(); // Update enabled/disabled states of all vials
    updateMixingStatus(); // Update text display of mixed elements
    filterAndDisplayConcepts(); // Re-filter results based on new selection
    clearSelectionButton.classList.toggle('hidden', selectedElements.length === 0); // Show/hide clear button
}

function updateVialStates() {
    const vials = elementVialsDiv.querySelectorAll('.vial');
    const maxSelected = selectedElements.length >= 2;
    vials.forEach(vial => {
        const isSelected = selectedElements.includes(vial.dataset.element);
        vial.classList.toggle('selected', isSelected); // Ensure class matches state
        vial.classList.toggle('disabled', maxSelected && !isSelected); // Disable if max reached and not selected
        if (!isSelected) {
            vial.classList.remove('resonating'); // Remove glow if not selected
        }
    });
}

function updateMixingStatus() {
    let statusHTML = "<strong>Mixing Status:</strong> ";
    if (selectedElements.length === 0) {
        statusHTML += "<i>Showing Top Overall Matches</i>";
    } else {
        statusHTML += selectedElements.map(el => {
            const color = getElementColor(el);
            const name = elementDetails[el]?.name || el;
            return `<span class="status-element" style="border-color:${color}; color:${color}; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid ${color}; margin:0 5px; background-color: ${hexToRgba(color, 0.1)};">${name}</span>`;
        }).join(' + ');
    }
    mixingStatusDiv.innerHTML = statusHTML;
}

function clearElementSelection() {
    selectedElements = [];
    updateVialStates();
    updateMixingStatus();
    filterAndDisplayConcepts();
    clearSelectionButton.classList.add('hidden');
    // Explicitly remove resonating from all vials
    elementVialsDiv.querySelectorAll('.vial.resonating').forEach(v => v.classList.remove('resonating'));
}


function filterAndDisplayConcepts() {
    resultsBenchDiv.innerHTML = ''; // Clear previous results
    let filteredConcepts = [];
    const scoreThreshold = 5.5; // Min score in selected elements
    const userRelevanceWeight = 0.3; // How much overall profile match influences sorting (0 to 1)

    // Calculate distance for all concepts first
    let conceptsWithDistance = concepts.map(c => {
        // Ensure elementScores exists and is an object before calculating distance
        const scores = c.elementScores && typeof c.elementScores === 'object' ? c.elementScores : {};
        return {
            ...c,
            distance: euclideanDistance(userScores, scores)
        };
    }).filter(c => c.distance !== Infinity); // Filter out concepts with invalid scores

    // --- Filtering Logic ---
    if (selectedElements.length === 0) {
        // No selection: Show concepts closest to user profile overall
        filteredConcepts = conceptsWithDistance
            .sort((a, b) => a.distance - b.distance) // Sort by distance (ascending)
            .slice(0, 15); // Limit display
    } else if (selectedElements.length === 1) {
        // One element selected: Filter by score in that element, then sort by score, then distance
        const el1 = selectedElements[0];
        filteredConcepts = conceptsWithDistance
            .filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold) // Must meet threshold in selected element
            .sort((a, b) => {
                const scoreA = a.elementScores[el1];
                const scoreB = b.elementScores[el1];
                if (scoreB !== scoreA) return scoreB - scoreA; // Primary sort: Higher score in selected element
                return a.distance - b.distance; // Secondary sort: Closer overall match
            });
    } else if (selectedElements.length === 2) {
        // Two elements selected: Filter by score in BOTH elements, then sort by combined score + relevance
        const el1 = selectedElements[0];
        const el2 = selectedElements[1];
        filteredConcepts = conceptsWithDistance
            .filter(c => c.elementScores &&
                         c.elementScores[el1] >= scoreThreshold &&
                         c.elementScores[el2] >= scoreThreshold) // Must meet threshold in BOTH elements
            .sort((a, b) => {
                // Weighted score: combination of scores in selected elements and overall distance
                // Max distance is sqrt(6 * 10^2) approx 24.5. We use (30 - distance) for relevance.
                const relevanceA = Math.max(0, 30 - a.distance);
                const relevanceB = Math.max(0, 30 - b.distance);
                const scoreA = (a.elementScores[el1] + a.elementScores[el2]) * (1 - userRelevanceWeight) + relevanceA * userRelevanceWeight;
                const scoreB = (b.elementScores[el1] + b.elementScores[el2]) * (1 - userRelevanceWeight) + relevanceB * userRelevanceWeight;
                return scoreB - scoreA; // Sort by combined weighted score (descending)
            });
    }

    updateMixingStatus(); // Ensure status text is correct

    // --- Display Logic ---
    if (filteredConcepts.length === 0) {
        resultsBenchDiv.innerHTML = selectedElements.length > 0
            ? '<p>No concepts strongly match this combination. Try different elements or clear selection.</p>'
            : '<p>Select 1 or 2 Elements from the shelf to start mixing potions!</p>';
    } else {
        // Use the CSS grid container for layout
        resultsBenchDiv.classList.add('concept-results-grid'); // Add class if not already there
        filteredConcepts.slice(0, 24).forEach(concept => { // Limit displayed results
            const potionCard = document.createElement('div');
            potionCard.classList.add('potion-card');
            potionCard.dataset.conceptId = concept.id;

            // Calculate resonance based on distance
            let resonanceClass = 'resonance-low';
            let resonanceText = 'Low';
            // Adjust thresholds for High/Mid/Low match based on distance
            if (concept.distance < 10) { // Example: Good match
                 resonanceClass = 'resonance-high'; resonanceText = 'High';
            } else if (concept.distance < 16) { // Example: Okay match
                 resonanceClass = 'resonance-medium'; resonanceText = 'Mid';
            }

            const grimoireStampHTML = discoveredConcepts.has(concept.id)
                ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>'
                : '';

            potionCard.innerHTML = `
                ${grimoireStampHTML}
                <span class="resonance-indicator ${resonanceClass}" title="Overall Resonance with your profile">${resonanceText}</span>
                <h4>${concept.name}</h4>
                <p class="concept-type">(${concept.type})</p>
                `;
            // Add Description preview (optional)
            // if (concept.description) {
            //     potionCard.innerHTML += `<p class="concept-desc-preview">${concept.description.substring(0, 50)}...</p>`;
            // }

            potionCard.addEventListener('click', () => showConceptDetailPopup(concept.id));
            resultsBenchDiv.appendChild(potionCard);
        });
    }
}

function euclideanDistance(scores1, scores2) {
    let sumOfSquares = 0;
    let validScores = 0;
    for (const element of elementNames) {
        const s1 = scores1[element];
        const s2 = scores2[element];
        // Only include if both scores are valid numbers
        if (typeof s1 === 'number' && typeof s2 === 'number' && !isNaN(s1) && !isNaN(s2)) {
            sumOfSquares += Math.pow(s1 - s2, 2);
            validScores++;
        } else {
            // Handle missing or invalid scores - you could return Infinity or a large number,
            // or calculate based on available dimensions if desired. Returning Infinity filters it out.
             console.warn(`Invalid score for element ${element} in distance calculation. Scores:`, scores1, scores2);
            return Infinity; // Indicate invalid comparison
        }
    }
     // Return Infinity if no valid scores were found to compare
    return validScores > 0 ? Math.sqrt(sumOfSquares) : Infinity;
}


// --- Pop-up logic ---
function showConceptDetailPopup(conceptId) {
    currentlyDisplayedConceptId = conceptId;
    const conceptData = concepts.find(c => c.id === conceptId);
    if (!conceptData) { console.error(`Concept data not found for ID: ${conceptId}`); return; }
    if (!conceptData.elementScores || typeof conceptData.elementScores !== 'object') { console.error(`Invalid elementScores for concept ID: ${conceptId}`, conceptData); return; }


    popupConceptName.textContent = conceptData.name;
    popupConceptType.textContent = conceptData.type;
    popupComparisonHighlights.innerHTML = ''; // Clear previous
    popupConceptProfile.innerHTML = ''; // Clear previous
    popupUserComparisonProfile.innerHTML = ''; // Clear previous
    popupRelatedConceptsList.innerHTML = ''; // Clear previous


    // Calculate Resonance / Overall Match
    const distance = euclideanDistance(userScores, conceptData.elementScores);
    let resonanceClass = 'resonance-low';
    let resonanceText = 'Low Match';
    let resonanceDesc = "Significant differences in key elements compared to your profile.";
    if (distance === Infinity) {
         resonanceText = 'Cannot Compare';
         resonanceDesc = "Could not compare due to missing score data.";
         resonanceClass = 'resonance-low'; // Or a specific class
    } else if (distance < 10) {
        resonanceClass = 'resonance-high';
        resonanceText = 'High Match';
        resonanceDesc = "Strong alignment with several of your core element scores.";
    } else if (distance < 16) {
        resonanceClass = 'resonance-medium';
        resonanceText = 'Mid Match';
        resonanceDesc = "Some alignment, but also notable differences in element scores.";
    }
     popupResonanceSummary.innerHTML = `Overall Resonance: <span class="resonance-indicator ${resonanceClass}">${resonanceText}</span><p style="font-size:0.85em; color:#666; margin-top: 3px; margin-bottom: 0;">(${resonanceDesc})</p>`;

    // Generate Comparison Highlights & Full Profiles
    let highlightsHTML = '';
    const diffThreshold = 3.0; // Difference considered 'significant'
    const alignThreshold = 1.5; // Difference considered 'aligned'
    let matches = [];
    let mismatches = [];

    elementNames.forEach((element) => {
        const elementDisplayName = elementDetails[element]?.name || element;
        const cScore = conceptData.elementScores[element];
        const uScore = userScores[element];
        const cScoreLabel = getScoreLabel(cScore);
        const uScoreLabel = getScoreLabel(uScore);
        const diff = uScore - cScore;

        // Build profiles for the <details> section
        const cBarWidth = (cScore / 10) * 100;
        const uBarWidth = (uScore / 10) * 100;
        const color = getElementColor(element);

        popupConceptProfile.innerHTML += `
            <div>
                <strong>${elementDisplayName}:</strong>
                <span>${cScore.toFixed(1)} (${cScoreLabel})</span>
                <div class="score-bar-container" style="height: 8px; max-width: 60px; display: inline-block; vertical-align: middle;">
                    <div style="width: ${cBarWidth}%; height: 100%; background-color: ${color}; border-radius: 3px;"></div>
                </div>
            </div>`;
         popupUserComparisonProfile.innerHTML += `
             <div>
                <strong>${elementDisplayName}:</strong>
                 <span>${uScore.toFixed(1)} (${uScoreLabel})</span>
                 <div class="score-bar-container" style="height: 8px; max-width: 60px; display: inline-block; vertical-align: middle;">
                     <div style="width: ${uBarWidth}%; height: 100%; background-color: ${color}; border-radius: 3px;"></div>
                 </div>
             </div>`;

        // Determine highlights
        if (Math.abs(diff) <= alignThreshold) {
            matches.push(`<b>${elementDisplayName}</b> (${uScoreLabel})`);
        } else if (Math.abs(diff) >= diffThreshold) {
            const comparison = diff > 0 ? `notably higher than concept's ${cScoreLabel}` : `notably lower than concept's ${cScoreLabel}`;
            mismatches.push({ element: elementDisplayName, diff: diff, text: `for <b>${elementDisplayName}</b>, your score (${uScoreLabel}) is ${comparison}` });
        }
    });

    // Build highlights text
    if (matches.length > 0) {
        highlightsHTML += `<p><strong class="match">Aligns Well With:</strong> Your preference(s) for ${matches.join(', ')}.</p>`;
    }
    if (mismatches.length > 0) {
        // Sort mismatches by magnitude of difference
        mismatches.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
        highlightsHTML += `<p><strong class="mismatch">Key Difference:</strong> ${mismatches[0].text}.</p>`;
        if (mismatches.length > 1) {
            highlightsHTML += `<p><small>(Other notable differences in ${mismatches.slice(1).map(m => m.element).join(', ')}.)</small></p>`;
        }
    }
    if (!highlightsHTML) {
         highlightsHTML = "<p>Moderate alignment or difference across most elements.</p>";
    }
    popupComparisonHighlights.innerHTML = highlightsHTML;


    // Populate Related Concepts
    if (conceptData.relatedIds && conceptData.relatedIds.length > 0) {
        conceptData.relatedIds.forEach(relId => {
            const relatedConcept = concepts.find(c => c.id === relId);
            if (relatedConcept) {
                const li = document.createElement('li');
                li.textContent = relatedConcept.name;
                li.dataset.conceptId = relId;
                li.addEventListener('click', handleRelatedConceptClick);
                popupRelatedConceptsList.appendChild(li);
            }
        });
    } else {
        popupRelatedConceptsList.innerHTML = '<li>None specified</li>';
    }

    // Update button states
    updateGrimoireButtonStatus(conceptId);
    updateCoreButtonStatus(conceptId); // Also handles hiding if not in grimoire

    // Show popup
    popupOverlay.classList.remove('hidden');
    conceptDetailPopup.classList.remove('hidden');

    // Record interaction for attunement (after popup is shown)
    recordElementAttunementFromConcept(conceptData.elementScores);
}

function hideConceptDetailPopup() {
    conceptDetailPopup.classList.add('hidden');
    popupOverlay.classList.add('hidden');
    currentlyDisplayedConceptId = null;
}

function handleRelatedConceptClick(event) {
    const newConceptId = parseInt(event.target.dataset.conceptId);
    if (newConceptId && newConceptId !== currentlyDisplayedConceptId) { // Prevent re-clicking same concept
        hideConceptDetailPopup();
        // Short delay allows the old popup to hide before the new one shows
        setTimeout(() => showConceptDetailPopup(newConceptId), 50);
    }
}


// --- Grimoire Functions ---
function addToGrimoire() {
    if (currentlyDisplayedConceptId !== null) {
        if (!discoveredConcepts.has(currentlyDisplayedConceptId)) {
            const concept = concepts.find(c => c.id === currentlyDisplayedConceptId);
            if (concept) {
                discoveredConcepts.set(currentlyDisplayedConceptId, { concept: concept, discoveredTime: Date.now() });

                // Add Element Essence based on the *concept's* scores
                if (concept.elementScores) {
                    let essenceGained = false;
                    elementNames.forEach(el => {
                        // Gain more essence for higher scores in the concept, scaled
                        const gain = Math.max(0, (concept.elementScores[el] || 0) - 4) * 0.1;
                        if (gain > 0) {
                             elementEssence[el] = (elementEssence[el] || 0) + gain;
                             essenceGained = true;
                        }
                    });
                     if (essenceGained) {
                         console.log("Updated Essence:", elementEssence);
                         displayElementEssence(); // Update display on Persona screen (if visible)
                     }
                }

                updateGrimoireCounter();
                updateGrimoireButtonStatus(currentlyDisplayedConceptId); // Update button in popup
                updateCoreButtonStatus(currentlyDisplayedConceptId); // Ensure core button appears now
                synthesizeAndDisplayThemes(); // Update themes on Persona screen
                filterAndDisplayConcepts(); // Re-render lab results to show stamp
                 // Optionally refresh Grimoire if currently viewing it
                 if (grimoireScreen.classList.contains('current')) {
                     displayGrimoire(grimoireElementFilter.value, grimoireSortOrder.value);
                 }
            } else {
                console.error("Concept data not found when trying to add to Grimoire:", currentlyDisplayedConceptId);
            }
        } else {
            console.log("Concept already in Grimoire.");
        }
    }
}


function updateGrimoireCounter() {
    grimoireCountSpan.textContent = discoveredConcepts.size;
}

function displayGrimoire(filterElement = "All", sortBy = "discovered") {
    grimoireContentDiv.innerHTML = ''; // Clear previous content

    if (discoveredConcepts.size === 0) {
        grimoireContentDiv.innerHTML = '<p>Your Grimoire is empty. Explore the Lab and add concepts!</p>';
        showScreen('grimoireScreen'); // Ensure screen is shown even if empty
        return;
    }

    // Get concepts from the Map into an array of { concept, discoveredTime } objects
    let discoveredArray = Array.from(discoveredConcepts.values());

    // Filter based on selected element (using the proper name from elementDetails)
    const conceptsToDisplay = (filterElement === "All")
        ? discoveredArray
        : discoveredArray.filter(data => {
            // Find the element key ('A', 'I', etc.) from the concept's primaryElement
            const primaryElKey = data.concept.primaryElement;
            // Get the full name corresponding to that key
            const primaryElName = elementDetails[elementKeyToName[primaryElKey]]?.name || elementKeyToName[primaryElKey];
             // Compare with the filter value (which should be the full name from the dropdown)
            return primaryElName === filterElement;
          });


    // Sort based on selection
    if (sortBy === 'name') {
        conceptsToDisplay.sort((a, b) => a.concept.name.localeCompare(b.concept.name));
    } else if (sortBy === 'type') {
        conceptsToDisplay.sort((a, b) => a.concept.type.localeCompare(b.concept.type) || a.concept.name.localeCompare(b.concept.name)); // Secondary sort by name
    } else { // Default: 'discovered' (by time)
        conceptsToDisplay.sort((a, b) => a.discoveredTime - b.discoveredTime);
    }

    if (conceptsToDisplay.length === 0) {
        grimoireContentDiv.innerHTML = `<p>No discovered concepts match the current filter.</p>`;
        showScreen('grimoireScreen');
        return;
    }

    // Group by primary element for display
    const grouped = {};
     // Use elementDetails keys (full names) for grouping and section headers
     Object.keys(elementDetails).forEach(elName => grouped[elementDetails[elName].name] = []);


    conceptsToDisplay.forEach(data => {
        const primaryElKey = data.concept.primaryElement;
        const primaryElName = elementDetails[elementKeyToName[primaryElKey]]?.name || "Other"; // Fallback category
        if (!grouped[primaryElName]) grouped[primaryElName] = []; // Ensure category exists
        grouped[primaryElName].push(data.concept);
    });

    // Get sorted list of element names based on the order in elementDetails/elementNames
     const sortedElementNamesForDisplay = elementNames.map(key => elementDetails[key]?.name || key);

    // Display sections in consistent order
    sortedElementNamesForDisplay.forEach(elementName => {
        if (grouped[elementName] && grouped[elementName].length > 0) {
            let sectionHTML = `<div class="grimoire-section"><h3>${elementName} Concepts</h3>`;
            grouped[elementName].forEach(concept => {
                const coreIndicator = coreConcepts.has(concept.id) ? ' <span class="core-indicator" title="Marked as Core">★</span>' : '';
                sectionHTML += `
                    <div class="grimoire-entry" data-concept-id="${concept.id}">
                        <strong>${concept.name}</strong> <span>(${concept.type})</span>${coreIndicator}
                    </div>`;
            });
            sectionHTML += `</div>`;
            grimoireContentDiv.innerHTML += sectionHTML;
        }
    });

     // Add click listeners to the newly created entries
    grimoireContentDiv.querySelectorAll('.grimoire-entry').forEach(entry => {
        entry.addEventListener('click', () => {
            const conceptId = parseInt(entry.dataset.conceptId);
            if(conceptId) showConceptDetailPopup(conceptId);
        });
    });

    showScreen('grimoireScreen'); // Ensure screen is visible
}


function updateGrimoireButtonStatus(conceptId) {
    if (!addToGrimoireButton) return; // Safety check
    if (discoveredConcepts.has(conceptId)) {
        addToGrimoireButton.textContent = "In Grimoire";
        addToGrimoireButton.disabled = true;
        addToGrimoireButton.classList.add('added');
    } else {
        addToGrimoireButton.textContent = "Add to Grimoire";
        addToGrimoireButton.disabled = false;
        addToGrimoireButton.classList.remove('added');
    }
}

function populateGrimoireFilter() {
    if (!grimoireElementFilter) return;
    grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; // Reset
     // Populate with full element names from elementDetails
    elementNames.forEach(key => {
        const name = elementDetails[key]?.name || key;
        const option = document.createElement('option');
        option.value = name; // Use the full name as the value for filtering
        option.textContent = name;
        grimoireElementFilter.appendChild(option);
    });
}


// --- Core Concepts ---
function toggleCoreConcept() {
    if (currentlyDisplayedConceptId === null) return;
    if (!discoveredConcepts.has(currentlyDisplayedConceptId)) {
        alert("Concept must be added to Grimoire before marking as Core.");
        return;
    }

    if (coreConcepts.has(currentlyDisplayedConceptId)) {
        // Remove from Core
        coreConcepts.delete(currentlyDisplayedConceptId);
        console.log(`Removed Core Concept: ${currentlyDisplayedConceptId}`);
    } else {
        // Add to Core (check limit)
        if (coreConcepts.size >= 7) { // Example limit
            alert("You can mark a maximum of 7 concepts as Core.");
            return;
        }
        coreConcepts.add(currentlyDisplayedConceptId);
        console.log(`Added Core Concept: ${currentlyDisplayedConceptId}`);
    }
    updateCoreButtonStatus(currentlyDisplayedConceptId); // Update button in popup
    displayCoreConcepts(); // Update list on Persona screen

     // Refresh Grimoire view if currently visible to show/hide star
     if (grimoireScreen.classList.contains('current')) {
         displayGrimoire(grimoireElementFilter.value, grimoireSortOrder.value);
     }
}

function updateCoreButtonStatus(conceptId) {
     if (!markAsCoreButton) return; // Safety check

     // Button should only be visible if the concept is IN the Grimoire
     const isInGrimoire = discoveredConcepts.has(conceptId);
     markAsCoreButton.classList.toggle('hidden', !isInGrimoire);

     if (isInGrimoire) {
         if (coreConcepts.has(conceptId)) {
             markAsCoreButton.textContent = "Core Concept ★";
             markAsCoreButton.classList.add('marked');
         } else {
             markAsCoreButton.textContent = "Mark as Core";
             markAsCoreButton.classList.remove('marked');
         }
     }
}


// --- Element Attunement & Essence ---
function recordElementAttunementFromConcept(elementScores) {
    if (!elementScores || typeof elementScores !== 'object') return;
    let attunementChanged = false;
    elementNames.forEach(el => {
        // Increase attunement slightly if the concept score is high in that element
        if ((elementScores[el] || 0) >= 7) {
             elementAttunement[el] = (elementAttunement[el] || 0) + 0.5; // Small increment
             attunementChanged = true;
        }
    });
     if (attunementChanged) {
         console.log(`Attunement updated by viewing concept:`, elementAttunement);
         // Note: We don't currently display Attunement directly, but could update Essence here or elsewhere based on it.
         // displayElementEssence(); // Re-display essence if it's derived from attunement
     }
}

// --- Other Utility functions ---
function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string') return `rgba(128,128,128, ${alpha})`;
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const bigint = parseInt(hex, 16);
    if (isNaN(bigint)) return `rgba(128,128,128, ${alpha})`;
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

function darkenColor(hex, amount = 30) {
    if (!hex || typeof hex !== 'string') return '#808080';
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    let r = parseInt(hex.substring(0,2), 16);
    let g = parseInt(hex.substring(2,4), 16);
    let b = parseInt(hex.substring(4,6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080';
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);
    // Pad with '0' if needed
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}`;
}

// --- Reset App ---
function resetApp() {
    console.log("Resetting application state...");
    // Reset all state variables
    currentElementIndex = 0;
    userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
    userAnswers = {};
    selectedElements = [];
    currentlyDisplayedConceptId = null;
    discoveredConcepts = new Map();
    coreConcepts = new Set();
    elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };
    elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 };

    // Reset UI elements
    hideConceptDetailPopup();
    if(mixingStatusDiv) mixingStatusDiv.innerHTML = '';
    if(resultsBenchDiv) resultsBenchDiv.innerHTML = '';
    if(elementVialsDiv) elementVialsDiv.innerHTML = '';
    if(grimoireContentDiv) grimoireContentDiv.innerHTML = '';
    if(grimoireCountSpan) grimoireCountSpan.textContent = '0';
    if(personaElementDetailsDiv) personaElementDetailsDiv.innerHTML = '';
    if(elementEssenceDisplay) elementEssenceDisplay.innerHTML = '';
    if(personaThemesList) personaThemesList.innerHTML = '';
    if(personaCoreConceptsList) personaCoreConceptsList.innerHTML = '';


    // Go back to the beginning
    showScreen('welcomeScreen');
    mainNavBar.classList.add('hidden'); // Hide nav bar on welcome screen
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing...");

    // Ensure elements exist before adding listeners
    if (startButton) {
        startButton.addEventListener('click', initializeQuestionnaire);
    } else { console.error("Start button not found!"); }

    if (nextElementButton) {
        nextElementButton.addEventListener('click', nextElement);
    } else { console.error("Next Element button not found!"); }

    if (prevElementButton) {
        prevElementButton.addEventListener('click', prevElement);
    } else { console.error("Previous Element button not found!"); }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreen = button.dataset.target;
             // Refresh content when navigating TO these screens
            if (targetScreen === 'personaScreen') { displayPersonaScreen(); }
            if (targetScreen === 'labScreen') { /* Lab usually updates on interaction */ }
            if (targetScreen === 'grimoireScreen') { displayGrimoire(grimoireElementFilter.value, grimoireSortOrder.value); }
            showScreen(targetScreen);
        });
    });

    if(restartButtonPersona) {
        restartButtonPersona.addEventListener('click', resetApp);
    } else { console.error("Restart button on Persona screen not found!"); }

    if(closePopupButton) {
        closePopupButton.addEventListener('click', hideConceptDetailPopup);
    } else { console.error("Close Popup button not found!"); }

    if(popupOverlay) {
        popupOverlay.addEventListener('click', hideConceptDetailPopup);
    } else { console.error("Popup Overlay not found!"); }

    if(clearSelectionButton) {
        clearSelectionButton.addEventListener('click', clearElementSelection);
    } else { console.error("Clear Selection button not found!"); }

    if(addToGrimoireButton) {
        addToGrimoireButton.addEventListener('click', addToGrimoire);
    } else { console.error("Add to Grimoire button not found!"); }

     if(markAsCoreButton) {
        markAsCoreButton.addEventListener('click', toggleCoreConcept);
    } else { console.error("Mark as Core button not found!"); }

     if(grimoireElementFilter) {
        grimoireElementFilter.addEventListener('change', (e) => displayGrimoire(e.target.value, grimoireSortOrder.value));
    } else { console.error("Grimoire Element Filter select not found!"); }

     if(grimoireSortOrder) {
        grimoireSortOrder.addEventListener('change', (e) => displayGrimoire(grimoireElementFilter.value, e.target.value));
    } else { console.error("Grimoire Sort Order select not found!"); }

    // --- Initial Setup ---
    showScreen('welcomeScreen'); // Start at the welcome screen
     console.log("Initial screen set to Welcome.");

}); // End DOMContentLoaded listener

