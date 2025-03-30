
// Get references to the HTML elements
const slider = document.getElementById('intensitySlider');
const valueDisplay = document.getElementById('sliderValueDisplay');
const nextButton = document.getElementById('nextButton');
const backButton = document.getElementById('backButton');

// --- Event Listener for the Slider ---
slider.addEventListener('input', () => {
    // Update the displayed value whenever the slider moves
    valueDisplay.textContent = slider.value;
});

// --- Event Listener for the Next Button ---
nextButton.addEventListener('click', () => {
    const currentValue = slider.value;
    console.log("Next button clicked!");
    console.log("Selected Intensity Value:", currentValue);

    // --- Placeholder for actual logic ---
    // In a real app, you would:
    // 1. Store the 'currentValue' (e.g., in localStorage, or send to a server)
    // 2. Navigate to the next question page:
    //    window.location.href = 'next-question.html'; // Example navigation
    alert(`Value saved (simulated): ${currentValue}\nNavigating to next question (simulated)...`);
    // ------------------------------------
});

// --- Event Listener for the Back Button ---
backButton.addEventListener('click', () => {
    console.log("Back button clicked!");

    // --- Placeholder for actual logic ---
    // In a real app, you would:
    // 1. Navigate to the previous question page:
    //    window.history.back(); // Simple back navigation
    //    OR window.location.href = 'previous-question.html';
    alert("Navigating back (simulated)...");
    // ------------------------------------
});

// --- Optional: Set initial display value (if different from HTML default) ---
// valueDisplay.textContent = slider.value; // Already set by HTML 'value' attribute
