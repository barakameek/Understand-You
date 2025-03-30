// --- Global State ---
// ... (Same)

// --- DOM Elements ---
// ... (Same)
// Add check for personaElementDetailsDiv
const personaElementDetailsDiv = document.getElementById('personaElementDetails');
// ... (Rest of DOM elements)

// --- Utility & Setup Functions ---
// ... (Keep getScoreLabel, getScoreInterpretation, showScreen, initializeQuestionnaire, updateElementProgressHeader, enforceMaxChoices, displayElementQuestions, handleQuestionnaireInputChange, collectCurrentElementAnswers, updateDynamicFeedback, calculateElementScore, finalizeScoresAndShowPersona, nextElement, prevElement) ...

// --- Display Persona Screen (with check) ---
function displayPersonaScreen() {
    // personaProfileScoresDiv.innerHTML = ''; // Clear simple scores div - No longer needed

    // *** ADD CHECK for existence ***
    if (!personaElementDetailsDiv) {
        console.error("ERROR: Cannot find personaElementDetailsDiv in the DOM!");
        return; // Exit function if element not found
    }
    personaElementDetailsDiv.innerHTML = ''; // Clear details div FIRST

    elementNames.forEach(element => {
        const score = userScores[element];
        const scoreLabel = getScoreLabel(score);
        const interpretation = getScoreInterpretation(element, score);
        const barWidth = score * 10;

        const details = document.createElement('details');
        details.classList.add('element-detail-entry');
        // Ensure class names match CSS
        details.innerHTML = `
            <summary class="element-detail-header">
                 <div>
                    <strong>${element}:</strong>
                    <span>${score.toFixed(1)}</span>
                    <span class="score-label">(${scoreLabel})</span>
                 </div>
                 <div class="score-bar-container" style="height: 10px; max-width: 100px;">
                    <div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div>
                 </div>
            </summary>
            <div class="element-description">
                 <p><strong>Meaning:</strong> ${elementExplanations[element]}</p>
                 <p><strong>Your Score Interpretation (${scoreLabel}):</strong> ${interpretation}</p>
            </div>
        `;
        personaElementDetailsDiv.appendChild(details); // Append to the checked element
    });

    displayElementEssence();
    synthesizeAndDisplayThemes();
    displayCoreConcepts();
}


// --- Display Element Essence ---
// ... (Same)
function displayElementEssence() { elementEssenceDisplay.innerHTML = '<h4>Collected Essence</h4>'; elementNames.forEach(el => { const essenceValue = elementEssence[el].toFixed(1); elementEssenceDisplay.innerHTML += `<div class="essence-item"><span class="essence-icon" style="background-color: ${getElementColor(el)};"></span><span class="essence-name">${el}:</span><span class="essence-value">${essenceValue}</span></div>`; }); }

// --- Synthesize Themes ---
// ... (Same)
function synthesizeAndDisplayThemes() { personaThemesList.innerHTML = ''; if (discoveredConcepts.size === 0) { personaThemesList.innerHTML = '<li>Explore the Lab to reveal themes.</li>'; return; } const elementCounts = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; const threshold = 7.0; discoveredConcepts.forEach((data, id) => { const concept = data.concept; if (concept && concept.elementScores) { elementNames.forEach(el => { if (concept.elementScores[el] >= threshold) { elementCounts[el]++; } }); } }); const sortedThemes = Object.entries(elementCounts).filter(([el, count]) => count > 0).sort(([, countA], [, countB]) => countB - countA); if (sortedThemes.length === 0) { personaThemesList.innerHTML = '<li>No strong elemental themes identified yet.</li>'; return; } sortedThemes.slice(0, 3).forEach(([element, count]) => { const li = document.createElement('li'); li.textContent = `${element} Focus (from ${count} concepts)`; personaThemesList.appendChild(li); }); }

// --- Display Core Concepts ---
// ... (Same)
function displayCoreConcepts() { personaCoreConceptsList.innerHTML = ''; if (coreConcepts.size === 0) { personaCoreConceptsList.innerHTML = '<li>Mark concepts as "Core".</li>'; return; } coreConcepts.forEach(conceptId => { const concept = concepts.find(c => c.id === conceptId); if (concept) { const li = document.createElement('li'); li.textContent = `${concept.name} (${concept.type})`; personaCoreConceptsList.appendChild(li); } }); }


// --- Lab Screen Functions ---
// ... (Keep displayElementVials, getElementColor, handleVialClick, updateVialStates, updateMixingStatus, clearElementSelection, filterAndDisplayConcepts, euclideanDistance) ...
function displayElementVials() { elementVialsDiv.innerHTML = ''; elementNames.forEach(element => { const score = userScores[element]; const vial = document.createElement('div'); vial.classList.add('vial'); vial.dataset.element = element; vial.title = elementExplanations[element] || element; if (selectedElements.includes(element)) { vial.classList.add('selected', 'resonating'); } vial.innerHTML = ` <div class="vial-icon"><div class="vial-liquid" style="height: ${score * 10}%; background-color: ${getElementColor(element)};"></div></div> <div class="vial-label"><span class="vial-name">${element}</span> <span class="vial-score">Score: ${score.toFixed(1)}</span></div> `; vial.addEventListener('click', handleVialClick); elementVialsDiv.appendChild(vial); }); clearSelectionButton.classList.toggle('hidden', selectedElements.length === 0); }
function getElementColor(elementName) { const colors={Attraction:'#FF6347',Interaction:'#4682B4',Sensory:'#32CD32',Psychological:'#FFD700',Cognitive:'#8A2BE2',Relational:'#FF8C00'};return colors[elementName]||'#CCC'; }
function handleVialClick(event) { const clickedVial = event.currentTarget; const element = clickedVial.dataset.element; elementAttunement[element]++; console.log(`Attunement for ${element}: ${elementAttunement[element]}`); clickedVial.classList.add('resonating'); setTimeout(() => { if (!selectedElements.includes(element)) { clickedVial.classList.remove('resonating'); } }, 1500); if (selectedElements.includes(element)) { selectedElements = selectedElements.filter(el => el !== element); clickedVial.classList.remove('selected', 'resonating'); } else if (selectedElements.length < 2) { selectedElements.push(element); clickedVial.classList.add('selected'); } else { alert("Max 2 elements."); clickedVial.classList.remove('resonating'); return; } updateVialStates(); updateMixingStatus(); filterAndDisplayConcepts(); clearSelectionButton.classList.toggle('hidden', selectedElements.length === 0); }
function updateVialStates() { const vials = elementVialsDiv.querySelectorAll('.vial'); const maxSelected = selectedElements.length >= 2; vials.forEach(vial => { const isSelected = vial.classList.contains('selected'); vial.classList.toggle('disabled', maxSelected && !isSelected); if (!isSelected) vial.classList.remove('resonating'); }); }
function updateMixingStatus() { let statusHTML = "<strong>Mixing:</strong> "; if (selectedElements.length === 0) { statusHTML += "<i>None Selected - Showing Top Overall Matches</i>"; } else { statusHTML += selectedElements.map(el => `<span class="status-element" style="border-color:${getElementColor(el)}; color:${getElementColor(el)}; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid ${getElementColor(el)}; margin:0 5px;">${el}</span>`).join(' + '); } mixingStatusDiv.innerHTML = statusHTML; }
function clearElementSelection() { selectedElements = []; updateVialStates(); updateMixingStatus(); filterAndDisplayConcepts(); clearSelectionButton.classList.add('hidden'); elementVialsDiv.querySelectorAll('.vial.selected, .vial.resonating').forEach(v => v.classList.remove('selected', 'resonating')); }
function filterAndDisplayConcepts() { resultsBenchDiv.innerHTML = ''; let filteredConcepts = []; const scoreThreshold = 5.5; const userRelevanceWeight = 0.3; let conceptsWithDistance = concepts.map(c => ({ ...c, distance: euclideanDistance(userScores, c.elementScores || {}) })).filter(c => c.distance !== Infinity); if (selectedElements.length === 0) { filteredConcepts = conceptsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 15); } else if (selectedElements.length === 1) { const el1 = selectedElements[0]; filteredConcepts = conceptsWithDistance.filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold).sort((a, b) => { const scoreA = a.elementScores[el1]; const scoreB = b.elementScores[el1]; if (scoreB !== scoreA) return scoreB - scoreA; return a.distance - b.distance; }); } else if (selectedElements.length === 2) { const el1 = selectedElements[0]; const el2 = selectedElements[1]; filteredConcepts = conceptsWithDistance.filter(c => c.elementScores && c.elementScores[el1] >= scoreThreshold && c.elementScores[el2] >= scoreThreshold).sort((a, b) => { const scoreA = (a.elementScores[el1] + a.elementScores[el2]) * (1 - userRelevanceWeight) + (30 - a.distance) * userRelevanceWeight; const scoreB = (b.elementScores[el1] + b.elementScores[el2]) * (1 - userRelevanceWeight) + (30 - b.distance) * userRelevanceWeight; return scoreB - scoreA; }); } updateMixingStatus(); if (filteredConcepts.length === 0) { resultsBenchDiv.innerHTML = selectedElements.length > 0 ? '<p>No concepts strongly match combo.</p>' : '<p>Select elements.</p>'; } else { filteredConcepts.slice(0, 24).forEach(concept => { const potionCard = document.createElement('div'); potionCard.classList.add('potion-card'); potionCard.dataset.conceptId = concept.id; let resonanceClass = 'resonance-low'; let resonanceText = 'Low'; if (concept.distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'High'; } else if (concept.distance < 16) { resonanceClass = 'resonance-medium'; resonanceText = 'Mid'; } const grimoireStampHTML = discoveredConcepts.has(concept.id) ? '<span class="grimoire-stamp" title="In Grimoire"><i class="fas fa-book-open"></i></span>' : ''; potionCard.innerHTML = `${grimoireStampHTML}<span class="resonance-indicator ${resonanceClass}" title="Overall match">${resonanceText}</span> <h4>${concept.name}</h4> <p class="concept-type">(${concept.type})</p> `; potionCard.addEventListener('click', () => showConceptDetailPopup(concept.id)); resultsBenchDiv.appendChild(potionCard); }); } }

// --- Concept Detail Pop-up ---
function showConceptDetailPopup(conceptId) { /* ... Same logic ... */ currentlyDisplayedConceptId = conceptId; const conceptData = concepts.find(c => c.id === conceptId); if (!conceptData || !conceptData.elementScores) return; popupConceptName.textContent = conceptData.name; popupConceptType.textContent = conceptData.type; popupComparisonHighlights.innerHTML = ''; popupConceptProfile.innerHTML = ''; popupRelatedConceptsList.innerHTML = ''; const distance = euclideanDistance(userScores, conceptData.elementScores); let resonanceClass = 'resonance-low'; let resonanceText = 'Low Match'; if (distance < 10) { resonanceClass = 'resonance-high'; resonanceText = 'Good Match'; } else if (distance < 16) { resonanceClass = 'resonance-medium'; resonanceText = 'Okay Match'; } popupResonanceSummary.innerHTML = `Overall Match: <span class="resonance-indicator ${resonanceClass}">${resonanceText}</span>`; let highlightsHTML = ''; const diffThreshold = 3.0; const alignThreshold = 1.5; let matches = []; let mismatches = []; elementNames.forEach((element) => { const cScore = conceptData.elementScores[element]; const uScore = userScores[element]; const diff = uScore - cScore; if (Math.abs(diff) <= alignThreshold) { matches.push(`**${element}** (${getScoreLabel(uScore)})`); } else if (Math.abs(diff) >= diffThreshold) { const comparison = diff > 0 ? `higher than concept's ${getScoreLabel(cScore)}` : `lower than concept's ${getScoreLabel(cScore)}`; mismatches.push({ element: element, diff: diff, text: `for **${element}**, your ${getScoreLabel(uScore)} is ${comparison}` }); } const barWidth = (cScore / 10) * 100; popupConceptProfile.innerHTML += `<div><strong>${element}:</strong><span>${cScore.toFixed(1)} (${getScoreLabel(cScore)})</span><div class="score-bar-container" style="/* styles */"><div style="width: ${barWidth}%; height: 100%; background-color: ${getElementColor(element)}; border-radius: 3px;"></div></div></div>`; }); if (matches.length > 0) { highlightsHTML += `<p><strong class="match">Aligns Well With:</strong> Your ${matches.join(', ')} preference(s).</p>`; } if (mismatches.length > 0) { mismatches.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)); highlightsHTML += `<p><strong class="mismatch">Key Difference:</strong> Notably, ${mismatches[0].text}.</p>`; if(mismatches.length > 1) { highlightsHTML += `<p><small>(Other differences noted in ${mismatches.slice(1).map(m => m.element).join(', ')}.)</small></p>`; } } if (!highlightsHTML) highlightsHTML = "<p>Moderate alignment across elements.</p>"; popupComparisonHighlights.innerHTML = highlightsHTML; if (conceptData.relatedIds && conceptData.relatedIds.length > 0) { conceptData.relatedIds.forEach(relId => { const relatedConcept = concepts.find(c => c.id === relId); if (relatedConcept) { const li = document.createElement('li'); li.textContent = relatedConcept.name; li.dataset.conceptId = relId; li.addEventListener('click', handleRelatedConceptClick); popupRelatedConceptsList.appendChild(li); } }); } else { popupRelatedConceptsList.innerHTML = '<li>None specified</li>'; } updateGrimoireButtonStatus(conceptId); updateCoreButtonStatus(conceptId); popupOverlay.classList.remove('hidden'); conceptDetailPopup.classList.remove('hidden'); recordElementAttunementFromConcept(conceptData.elementScores); }
function hideConceptDetailPopup() { /* ... */ conceptDetailPopup.classList.add('hidden'); popupOverlay.classList.add('hidden'); currentlyDisplayedConceptId = null; }
function handleRelatedConceptClick(event) { /* ... */ const newConceptId = parseInt(event.target.dataset.conceptId); if (newConceptId) { hideConceptDetailPopup(); setTimeout(() => showConceptDetailPopup(newConceptId), 50); } }

// --- Grimoire Functions ---
function addToGrimoire() { /* ... Includes essence gain ... */ if (currentlyDisplayedConceptId !== null) { if(!discoveredConcepts.has(currentlyDisplayedConceptId)) { const concept = concepts.find(c => c.id === currentlyDisplayedConceptId); if (concept) { discoveredConcepts.set(currentlyDisplayedConceptId, { concept: concept, discoveredTime: Date.now() }); if(concept.elementScores) { elementNames.forEach(el => { elementEssence[el] += Math.max(0, concept.elementScores[el] - 4) * 0.1; }); console.log("Updated Essence:", elementEssence); displayElementEssence(); } updateGrimoireCounter(); updateGrimoireButtonStatus(currentlyDisplayedConceptId); synthesizeAndDisplayThemes(); filterAndDisplayConcepts(); } } } }
function updateGrimoireCounter() { /* ... */ grimoireCountSpan.textContent = discoveredConcepts.size; }
function displayGrimoire(filterElement = "All", sortBy = "discovered") { /* ... Includes core indicator */ grimoireContentDiv.innerHTML = ''; if (discoveredConcepts.size === 0) { grimoireContentDiv.innerHTML = '<p>No concepts discovered yet.</p>'; showScreen('grimoireScreen'); return; } let discoveredArray = Array.from(discoveredConcepts.values()); const conceptsToDisplay = (filterElement === "All") ? discoveredArray : discoveredArray.filter(data => elementKeyToName[data.concept.primaryElement] === filterElement); if (sortBy === 'name') conceptsToDisplay.sort((a, b) => a.concept.name.localeCompare(b.concept.name)); else if (sortBy === 'type') conceptsToDisplay.sort((a, b) => a.concept.type.localeCompare(b.concept.type) || a.concept.name.localeCompare(b.concept.name)); else { conceptsToDisplay.sort((a,b) => a.discoveredTime - b.discoveredTime); } if (conceptsToDisplay.length === 0) { grimoireContentDiv.innerHTML = `<p>No discovered concepts match filter.</p>`; showScreen('grimoireScreen'); return; } const grouped = {}; elementNames.forEach(el => grouped[el] = []); conceptsToDisplay.forEach(data => { const primaryEl = elementKeyToName[data.concept.primaryElement] || "Other"; if (!grouped[primaryEl]) grouped[primaryEl] = []; grouped[primaryEl].push(data.concept); }); elementNames.forEach(element => { if (grouped[element] && grouped[element].length > 0) { let sectionHTML = `<div class="grimoire-section"><h3>${element} Concepts</h3>`; grouped[element].forEach(concept => { const coreIndicator = coreConcepts.has(concept.id) ? ' <span class="core-indicator" title="Marked as Core">★</span>' : ''; sectionHTML += `<div class="grimoire-entry" data-concept-id="${concept.id}"><strong>${concept.name}</strong> <span>(${concept.type})</span>${coreIndicator}</div>`; }); sectionHTML += `</div>`; grimoireContentDiv.innerHTML += sectionHTML; } }); grimoireContentDiv.querySelectorAll('.grimoire-entry').forEach(entry => { entry.addEventListener('click', () => { const conceptId = parseInt(entry.dataset.conceptId); showConceptDetailPopup(conceptId); }); }); showScreen('grimoireScreen'); }
function updateGrimoireButtonStatus(conceptId) { /* ... */ if (discoveredConcepts.has(conceptId)) { addToGrimoireButton.textContent = "In Grimoire"; addToGrimoireButton.disabled = true; addToGrimoireButton.classList.add('added'); } else { addToGrimoireButton.textContent = "Add to Grimoire"; addToGrimoireButton.disabled = false; addToGrimoireButton.classList.remove('added'); } }
function populateGrimoireFilter() { /* ... */ grimoireElementFilter.innerHTML = '<option value="All">All Elements</option>'; elementNames.forEach(el => { const option = document.createElement('option'); option.value = el; option.textContent = el; grimoireElementFilter.appendChild(option); }); }

// --- Core Concepts ---
function toggleCoreConcept() { /* ... Includes Grimoire refresh */ if (currentlyDisplayedConceptId === null) return; if (coreConcepts.has(currentlyDisplayedConceptId)) { coreConcepts.delete(currentlyDisplayedConceptId); console.log(`Removed ${currentlyDisplayedConceptId}`); } else { if (coreConcepts.size >= 7) { alert("Max 7 Core Concepts."); return; } coreConcepts.add(currentlyDisplayedConceptId); console.log(`Added ${currentlyDisplayedConceptId}`); } updateCoreButtonStatus(currentlyDisplayedConceptId); displayCoreConcepts(); displayGrimoire(grimoireElementFilter.value, grimoireSortOrder.value); } // Refresh Grimoire view
function updateCoreButtonStatus(conceptId) { /* ... Includes hidden toggle */ if (coreConcepts.has(conceptId)) { markAsCoreButton.textContent = "Core Concept ★"; markAsCoreButton.classList.add('marked'); } else { markAsCoreButton.textContent = "Mark as Core"; markAsCoreButton.classList.remove('marked'); } markAsCoreButton.classList.toggle('hidden', !discoveredConcepts.has(conceptId)); }

// --- Element Attunement ---
function recordElementAttunementFromConcept(elementScores) { /* ... Updates Essence Display */ elementNames.forEach(el => { if (elementScores[el] >= 7) { elementAttunement[el] += 0.5; console.log(`Attunement ++ for ${el}: ${elementAttunement[el].toFixed(1)}`); } }); displayElementEssence(); }

// --- Utility functions ---
function hexToRgb(hex) { /* ... */ if (!hex || typeof hex !== 'string') return '128,128,128'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; const bigint = parseInt(hex, 16); if (isNaN(bigint)) return '128,128,128'; const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return `${r},${g},${b}`; }
function darkenColor(hex, amount = 30) { /* ... */ if (!hex || typeof hex !== 'string') return '#808080'; hex = hex.replace('#', ''); if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; let r = parseInt(hex.substring(0,2), 16); let g = parseInt(hex.substring(2,4), 16); let b = parseInt(hex.substring(4,6), 16); if (isNaN(r) || isNaN(g) || isNaN(b)) return '#808080'; r = Math.max(0, r - amount); g = Math.max(0, g - amount); b = Math.max(0, b - amount); return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`; }

// --- Reset App ---
function resetApp() { /* ... includes coreConcepts reset */ currentElementIndex = 0; userScores = { Attraction: 5, Interaction: 5, Sensory: 5, Psychological: 5, Cognitive: 5, Relational: 5 }; userAnswers = {}; selectedElements = []; currentlyDisplayedConceptId = null; discoveredConcepts = new Map(); coreConcepts = new Set(); elementAttunement = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; elementEssence = { Attraction: 0, Interaction: 0, Sensory: 0, Psychological: 0, Cognitive: 0, Relational: 0 }; hideConceptDetailPopup(); showScreen('welcomeScreen'); mainNavBar.classList.add('hidden'); }

// --- Event Listeners ---
startButton.addEventListener('click', initializeQuestionnaire);
nextElementButton.addEventListener('click', nextElement);
prevElementButton.addEventListener('click', prevElement);
navButtons.forEach(button => button.addEventListener('click', () => { if (button.dataset.target === 'personaScreen') displayPersonaScreen(); if (button.dataset.target === 'grimoireScreen') displayGrimoire(grimoireElementFilter.value, grimoireSortOrder.value); showScreen(button.dataset.target); }));
restartButtonPersona.addEventListener('click', resetApp);
closePopupButton.addEventListener('click', hideConceptDetailPopup);
popupOverlay.addEventListener('click', hideConceptDetailPopup);
clearSelectionButton.addEventListener('click', clearElementSelection);
addToGrimoireButton.addEventListener('click', addToGrimoire);
markAsCoreButton.addEventListener('click', toggleCoreConcept);
grimoireElementFilter.addEventListener('change', (e) => displayGrimoire(e.target.value, grimoireSortOrder.value));
grimoireSortOrder.addEventListener('change', (e) => displayGrimoire(grimoireElementFilter.value, e.target.value));
// Removed listeners for What If, Refinement

// --- Initial Setup ---
showScreen('welcomeScreen');
