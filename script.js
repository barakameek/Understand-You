// --- Global State ---
let currentQuestionIndex = 0;
let userScores = {
    Attraction: 5, // Start at midpoint 5
    Interaction: 5,
    Sensory: 5,
    Psychological: 5,
    Cognitive: 5,
    Relational: 5
};
let userAnswers = {}; // Store raw answers if needed

// --- DOM Elements ---
const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('startButton');
const questionnaireScreen = document.getElementById('questionnaireScreen');
const questionContent = document.getElementById('questionContent');
const progressText = document.getElementById('progressText');
const nextQButton = document.getElementById('nextQButton');
const profileScreen = document.getElementById('profileScreen');
const profileScoresDiv = document.getElementById('profileScores');
const showMapButton = document.getElementById('showMapButton');
const mapScreen = document.getElementById('mapScreen');
const mapResultsList = document.getElementById('mapResultsList');
const restartButton = document.getElementById('restartButton');

// --- Functions ---

function showScreen(screenId) {
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.remove('hidden');
            screen.classList.add('current');
        } else {
            screen.classList.add('hidden');
            screen.classList.remove('current');
        }
    });
}

function displayQuestion(index) {
    if (index >= questionnaire.length) {
        // End of questionnaire
        calculateAndShowProfile();
        return;
    }

    const q = questionnaire[index];
    progressText.textContent = `Question ${index + 1} / ${questionnaire.length}`;
    let inputHTML = `<h3 class="question-title">${q.text}</h3><div class="input-container">`;

    if (q.type === "slider") {
        const currentValue = userAnswers[q.questionId] !== undefined ? userAnswers[q.questionId] : q.defaultValue;
        inputHTML += `
            <div class="slider-container">
                <input type="range" id="q${q.questionId}" class="slider"
                       min="${q.minValue}" max="${q.maxValue}" step="1" value="${currentValue}">
                <div class="label-container">
                    <span class="label-text">${q.minLabel}</span>
                    <span class="label-text">${q.maxLabel}</span>
                </div>
                <p class="value-text">Selected Value: <span id="sliderValueDisplay_q${q.questionId}">${currentValue}</span></p>
            </div>
        `;
    } else if (q.type === "radio") {
        inputHTML += `<div class="radio-options">`;
        q.options.forEach(opt => {
            const isChecked = userAnswers[q.questionId] === opt.value ? 'checked' : '';
            inputHTML += `
                <div>
                    <input type="radio" id="q${q.questionId}_${opt.value}" name="q${q.questionId}" value="${opt.value}" ${isChecked}>
                    <label for="q${q.questionId}_${opt.value}">${opt.value}</label>
                </div>
            `;
        });
        inputHTML += `</div>`;
    } else if (q.type === "checkbox") {
        inputHTML += `<div class="checkbox-options">`;
         q.options.forEach(opt => {
            const isChecked = userAnswers[q.questionId]?.includes(opt.value) ? 'checked' : '';
             inputHTML += `
                <div>
                     <input type="checkbox" id="q${q.questionId}_${opt.value}" name="q${q.questionId}" value="${opt.value}" ${isChecked} data-max-choices="2">
                     <label for="q${q.questionId}_${opt.value}">${opt.value}</label>
                 </div>
             `;
         });
         inputHTML += `</div>`;
    }

    inputHTML += `</div>`;
    questionContent.innerHTML = inputHTML;

    // Add event listeners for dynamic inputs
    if (q.type === "slider") {
        const sliderInput = document.getElementById(`q${q.questionId}`);
        const displaySpan = document.getElementById(`sliderValueDisplay_q${q.questionId}`);
        sliderInput.addEventListener('input', () => {
            displaySpan.textContent = sliderInput.value;
        });
    }
    // Add listeners for checkboxes to enforce max choices
    if (q.type === "checkbox") {
        const checkboxes = questionContent.querySelectorAll(`input[name="q${q.questionId}"]`);
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => enforceMaxChoices(cb.name, parseInt(cb.dataset.maxChoices)));
        });
    }
}

function enforceMaxChoices(name, max) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    if (checkboxes.length > max) {
        alert(`You can only select up to ${max} options.`);
        // Find the last checked one and uncheck it (simple approach)
        checkboxes[checkboxes.length - 1].checked = false;
    }
}


function processAnswer(index) {
    const q = questionnaire[index];
    const elementToUpdate = q.element;
    let pointsToAdd = 0;
    let answerValue = null;

    if (q.type === "slider") {
        const sliderInput = document.getElementById(`q${q.questionId}`);
        answerValue = parseInt(sliderInput.value);
        userAnswers[q.questionId] = answerValue;
        // Simple scoring: adjust score based on deviation from midpoint (5)
        pointsToAdd = (answerValue - q.defaultValue); // Adjust weight as needed
    } else if (q.type === "radio") {
        const selectedRadio = document.querySelector(`input[name="q${q.questionId}"]:checked`);
        if (selectedRadio) {
            answerValue = selectedRadio.value;
            userAnswers[q.questionId] = answerValue;
            const selectedOption = q.options.find(opt => opt.value === answerValue);
            pointsToAdd = selectedOption ? selectedOption.points : 0;
        } else {
            // Handle case where nothing is selected? Maybe prevent moving next? For MVP, we proceed.
            pointsToAdd = 0;
        }
    } else if (q.type === "checkbox") {
         const selectedCheckboxes = document.querySelectorAll(`input[name="q${q.questionId}"]:checked`);
         answerValue = [];
         selectedCheckboxes.forEach(cb => {
             const optionValue = cb.value;
             answerValue.push(optionValue);
             const selectedOption = q.options.find(opt => opt.value === optionValue);
             pointsToAdd += selectedOption ? selectedOption.points : 0;
         });
         userAnswers[q.questionId] = answerValue; // Store array of selected values
    }

    // Update the score (ensure it stays within 0-10)
    if (elementToUpdate) {
        userScores[elementToUpdate] = Math.max(0, Math.min(10, userScores[elementToUpdate] + pointsToAdd));
         console.log(`Updated ${elementToUpdate}: ${userScores[elementToUpdate]} (added ${pointsToAdd})`);
    }

}

function calculateAndShowProfile() {
    console.log("Final Scores:", userScores);
    profileScoresDiv.innerHTML = ''; // Clear previous scores
    for (const element in userScores) {
        profileScoresDiv.innerHTML += `<div><strong>${element}:</strong> ${userScores[element].toFixed(1)}</div>`;
    }
    showScreen('profileScreen');
}

// Simplified Euclidean Distance Calculation
function euclideanDistance(profile1, profile2) {
    let sum = 0;
    const elements = ["Attraction", "Interaction", "Sensory", "Psychological", "Cognitive", "Relational"];
    for (let i = 0; i < elements.length; i++) {
        const key = elements[i];
        // Use element scores directly for user; use profile array for concept
        const score1 = profile1[key];
        const score2 = profile2[i]; // profile2 is the concept's profile array
        sum += Math.pow(score1 - score2, 2);
    }
    return Math.sqrt(sum);
}


function calculateAndShowMap() {
    console.log("Calculating matches based on scores:", userScores);
    const matchedConcepts = concepts.map(concept => {
        // Handle potential missing profiles just in case
        if (!concept.profile || concept.profile.length !== 6) {
             console.warn(`Concept ${concept.name} missing or invalid profile.`);
             return { ...concept, distance: Infinity }; // Assign high distance
        }
        const distance = euclideanDistance(userScores, concept.profile);
        return { ...concept, distance: distance };
    });

    // Sort by distance (ascending - closer is better)
    matchedConcepts.sort((a, b) => a.distance - b.distance);

    console.log("Sorted Matches:", matchedConcepts);

    mapResultsList.innerHTML = ''; // Clear previous results
    // Display top N results (e.g., top 10-15)
    const topN = 15;
    matchedConcepts.slice(0, topN).forEach(concept => {
        mapResultsList.innerHTML += `
            <li>
                <strong>${concept.name}</strong>
                <span>(${concept.type} / Score: ${concept.distance.toFixed(2)})</span>
            </li>
        `;
    });

    showScreen('mapScreen');
}

function resetApp() {
     currentQuestionIndex = 0;
     userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 };
     userAnswers = {};
     showScreen('welcomeScreen');
}


// --- Event Listeners ---
startButton.addEventListener('click', () => {
    displayQuestion(currentQuestionIndex);
    showScreen('questionnaireScreen');
});

nextQButton.addEventListener('click', () => {
    processAnswer(currentQuestionIndex);
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex); // Will show profile if done
});

showMapButton.addEventListener('click', calculateAndShowMap);

restartButton.addEventListener('click', resetApp);


// --- Initial Setup ---
// Show the welcome screen initially
showScreen('welcomeScreen');
