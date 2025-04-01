<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Persona Alchemy Lab</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Stylesheet -->
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="data:,"> <!-- Prevent favicon error -->
</head>
<body>
    <div class="app-container study-theme">

        <!-- === Saving Indicator === -->
        <div id="saveIndicator" class="save-indicator hidden"><i class="fas fa-save"></i> Saving...</div>

        <!-- === Welcome Screen === -->
        <div id="welcomeScreen" class="screen current">
             <h1>Welcome to the Persona Alchemy Lab! <i class="fas fa-info-circle info-icon" title="This is the entry point to the application. Start a new 'Experiment' (questionnaire) or load your previous session."></i></h1>
             <p>Discover Concept Cards that resonate with your essence and curate your unique Persona Tapestry.</p>
             <button id="startGuidedButton" class="button">Begin Experimentation</button>
             <button id="loadButton" class="button secondary-button hidden">Load Previous Session</button>
        </div>

        <!-- === Questionnaire Screen === -->
        <div id="questionnaireScreen" class="screen hidden">
             <header>
                 <div id="elementProgressHeader"></div>
                 <p id="progressText"></p>
                 <div id="dynamicScoreFeedback">
                    Current <span id="feedbackElement">Element</span> Score: <span id="feedbackScore">5.0</span> (<span class="score-label">Moderate</span>)
                    <i class="fas fa-info-circle info-icon" title="This shows your approximate score for the current element based on your answers so far. It helps visualize how your choices influence the outcome. Final scores are calculated at the end."></i>
                    <div class="score-bar-container">
                        <div id="feedbackScoreBar" style="width: 50%;"></div>
                    </div>
                 </div>
             </header>
             <main id="questionContent"></main>
             <footer>
                 <button id="prevElementButton" class="button back-button hidden">Previous</button>
                 <button id="nextElementButton" class="button next-button">Next / View Persona</button>
             </footer>
        </div>

        <!-- === Navigation Bar === -->
        <nav id="mainNavBar" class="main-nav hidden">
             <button class="nav-button active" data-target="personaScreen">Persona Tapestry</button>
             <!-- Swapped Grimoire and Study -->
             <button class="nav-button" data-target="grimoireScreen">Grimoire (<span id="grimoireCount">0</span>)</button>
             <button class="nav-button" data-target="studyScreen">The Study</button>
             <button class="nav-button" data-target="repositoryScreen">Repository</button>
             <button id="settingsButton" class="nav-button settings-button" title="Settings & Save/Load Options"><i class="fas fa-cog"></i></button>
        </nav>

        <!-- === My Persona Screen ("Persona Tapestry") === -->
        <div id="personaScreen" class="screen hidden persona-screen">
             <div class="persona-header">
                 <h1>My Persona Tapestry <i class="fas fa-info-circle info-icon" title="This screen summarizes your calculated persona based on the questionnaire and provides tools to refine it by focusing on specific Concepts."></i></h1>
                 <div class="view-toggle-buttons">
                     <button id="showDetailedViewBtn" class="button small-button view-toggle-btn active">Detailed View</button>
                     <button id="showSummaryViewBtn" class="button small-button view-toggle-btn">Summary View</button>
                 </div>
             </div>

             <!-- Detailed View -->
             <div id="personaDetailedView" class="persona-view current">
                 <div class="persona-overview">
                     <div class="persona-elements-detailed">
                         <h2>Core Foundation <i class="fas fa-info-circle info-icon" title="Your scores across the 6 core elements, based on the initial questionnaire. Expand each for details, interpretations, and your current Attunement level."></i></h2>
                         <p>Your fundamental attributes and elemental attunement. Expand each element.</p>
                         <div id="personaElementDetails">
                            <!-- Element details with integrated attunement bars will be injected here -->
                         </div>
                         <hr>
                         <h2>Resources <i class="fas fa-info-circle info-icon" title="Insight is the primary currency, earned through discovery, reflection, and rituals. Spend it in The Study to research new Concepts or unlock deeper knowledge."></i></h2>
                         <p>Gain Insight <i class="fas fa-brain insight-icon"></i> through discovery and reflection. Spend it in The Study.</p>
                         <p>Current Insight: <strong id="userInsightDisplayPersona">0.0</strong> <i class="fas fa-brain insight-icon"></i></p>

                         <!-- MOVED: Element Library Section -->
                         <div id="elementLibrary" class="element-library">
                              <h2>Element Library <i class="fas fa-info-circle info-icon" title="Unlock deeper written insights about each core element by spending Insight. Higher levels reveal more complex nuances."></i></h2>
                              <p>Unlock deeper knowledge about each core element.</p>
                              <div id="elementLibraryButtons" class="library-buttons"></div>
                              <div id="elementLibraryContent" class="library-content">
                                  <p>Select an Element above to view its deep dive content.</p>
                              </div>
                         </div>
                     </div>

                     <div class="persona-constellation">
                          <h2>Persona Tapestry - Focus <i class="fas fa-info-circle info-icon" title="Mark Concepts from your Grimoire as 'Focus' here. This shapes your Tapestry Narrative, influences Focus Resonance, and may unlock unique content based on combinations."></i></h2>
                          <p>Curate concepts to shape your active Persona.</p>
                          <div class="tapestry-area" id="tapestryArea">
                               <h4 id="focusedConceptsHeader">Focused Concepts (0 / 5) <i class="fas fa-info-circle info-icon" title="The number of Concepts currently marked as Focus out of your total available slots. Slots can be increased via Milestones."></i></h4>
                               <div id="focusedConceptsDisplay" class="focus-concepts-grid"></div>
                          </div>
                          <div id="focusElementalResonance" class="focus-resonance-section">
                               <h3>Focus Resonance <i class="fas fa-info-circle info-icon" title="Shows the average elemental scores calculated ONLY from the Concepts currently marked as 'Focus'. This reflects the overall elemental balance of your curated Tapestry."></i></h3>
                               <p>Average elemental scores of your focused concepts.</p>
                               <div id="focusResonanceBars"></div>
                          </div>
                          <div class="tapestry-narrative-section">
                              <h3>Tapestry Narrative <i class="fas fa-info-circle info-icon" title="A dynamically generated interpretation based on your Focused Concepts, highlighting dominant elements and potential synergies between them."></i></h3>
                              <p id="tapestryNarrative">Mark concepts as "Focus" to generate narrative...</p>
                          </div>
                          <div class="grimoire-insights">
                              <h3>Focus Themes <i class="fas fa-info-circle info-icon" title="Identifies the dominant Elements (those with high scores) appearing most frequently among your Focused Concepts."></i></h3>
                              <p>Themes emerging from your focused concepts.</p>
                              <ul id="personaThemesList"></ul>
                          </div>
                          <!-- MOVED: Milestones Section Removed -->
                     </div>
                 </div>
             </div>

             <!-- Summary View -->
             <div id="personaSummaryView" class="persona-view hidden">
                  <h2>Persona Summary <i class="fas fa-info-circle info-icon" title="A concise text overview combining your Core Foundation scores, Tapestry Narrative, and Focus Themes."></i></h2>
                  <div id="summaryContent">
                      <p>Generating summary...</p>
                  </div>
             </div>
        </div>

         <!-- === Grimoire Screen === -->
         <div id="grimoireScreen" class="screen hidden grimoire-screen">
              <h1>The Grand Grimoire <i class="fas fa-info-circle info-icon" title="Your personal collection of discovered Concept Cards. Filter, sort, view details, mark Concepts for Focus, or sell unwanted Concepts for Insight."></i></h1>
              <div id="grimoireControls">
                  <label for="grimoireTypeFilter">Type:</label>
                  <select id="grimoireTypeFilter"><option value="All">All Types</option></select>
                  <label for="grimoireElementFilter">Element:</label>
                  <select id="grimoireElementFilter"><option value="All">All Elements</option></select>
                   <label for="grimoireRarityFilter">Rarity:</label>
                  <select id="grimoireRarityFilter">
                      <option value="All">All Rarities</option>
                      <option value="common">Common</option>
                      <option value="uncommon">Uncommon</option>
                      <option value="rare">Rare</option>
                  </select>
                  <label for="grimoireSortOrder">Sort:</label>
                  <select id="grimoireSortOrder">
                      <option value="discovered">Date Added</option>
                      <option value="name">Name</option>
                      <option value="type">Type</option>
                      <option value="rarity">Rarity</option>
                  </select>
                  <i class="fas fa-info-circle info-icon" title="Use these controls to filter and sort the Concepts displayed in your Grimoire below."></i>
              </div>
              <div id="grimoireContent" class="card-grid"></div>
         </div>


        <!-- === Main Study Screen === -->
        <div id="studyScreen" class="screen hidden study-screen">
             <!-- Layout container adjusted for only two columns now -->
             <div class="study-layout-container">
                 <!-- Left Column: Resources & Actions -->
                 <div class="study-column-left study-resources"> <!-- Combined class -->
                      <h2>Resources & Actions <i class="fas fa-info-circle info-icon" title="Manage your Insight and perform core actions like Researching specific Elements, taking Guided Reflections, or performing your free Daily Meditation."></i></h2>
                      <p>Current Insight: <strong id="userInsightDisplayStudy">0.0</strong> <i class="fas fa-brain insight-icon"></i></p>
                      <hr>
                      <p>Focus your Insight <i class="fas fa-brain insight-icon"></i> to deepen understanding:</p>
                      <button id="freeResearchButton" class="button free-research-button hidden" title="Once per day, perform research on your least attuned element for free.">Perform Daily Meditation</button>
                      <div id="researchButtonContainer" class="research-buttons" title="Spend Insight to research a specific Element, potentially discovering new Concepts or Repository items. Cost may decrease slightly with high Attunement in that Element."></div>
                      <button id="seekGuidanceButton" class="button guidance-button" title="Spend Insight for a randomly selected Guided Reflection prompt, offering deeper insights or exploring specific themes.">Seek Guided Reflection (Cost: <span id="guidedReflectionCostDisplay">10</span> <i class="fas fa-brain insight-icon"></i>)</button>
                      <hr>
                      <div class="rituals-section">
                          <h3>Daily Rituals <i class="fas fa-info-circle info-icon" title="Complete these tasks each day for bonus Insight or Attunement. They reset daily. Special Focus Rituals appear here when their required Concepts are focused."></i></h3>
                          <ul id="dailyRitualsDisplay"><li>Loading...</li></ul>
                      </div>
                 </div>

                 <!-- MOVED: Element Library Removed -->

                 <!-- Right Column: Research Bench -->
                 <div class="study-column-right research-bench">
                     <h2>Research Notes <i class="fas fa-info-circle info-icon" title="Results from your Research appear here. Concepts remain until you Add them to your Grimoire or Sell them for Insight. You might also find Repository items here."></i></h2>
                     <div id="researchStatus">Select an Element or perform Meditation...</div>
                     <div id="researchOutput" class="research-output-area card-grid">
                        <p><i>Research results will appear here.</i></p>
                     </div>
                 </div>
             </div>
        </div>


         <!-- === Repository Screen === -->
         <div id="repositoryScreen" class="screen hidden repository-screen">
             <h1>Repository <i class="fas fa-info-circle info-icon" title="A collection of rare discoveries beyond standard Concepts: Scene Blueprints for meditation, Alchemical Experiments requiring high Attunement, collected Elemental Insight fragments, and special unlocks driven by your Focused Concepts. Milestones are also tracked here."></i></h1>
             <p>A collection of rare discoveries, focus-driven unlocks, and achieved milestones.</p>
             <div class="repository-layout">
                 <section id="repositoryFocusUnlocks" class="repository-section">
                     <h2><i class="fas fa-link"></i> Focus-Driven Discoveries <i class="fas fa-info-circle info-icon" title="Special items (Scenes, Insights, Experiments) unlocked automatically by having specific combinations of Concepts marked as 'Focus' on your Persona Tapestry."></i></h2>
                     <div class="repo-list focus-unlocks-list">
                         <p>Focus on synergistic combinations of Concepts to unlock special items here.</p>
                         <!-- Focus unlock items injected here -->
                     </div>
                 </section>
                 <hr>
                 <section id="repositoryScenes" class="repository-section">
                     <h2><i class="fas fa-scroll"></i> Scene Blueprints <i class="fas fa-info-circle info-icon" title="Rare textual scenarios found during Research. Meditate on them (costs Insight) to trigger unique Reflection prompts and gain deeper understanding."></i></h2>
                     <div class="repo-list">
                         <p>Conduct research for a chance to discover scene blueprints.</p>
                         <!-- Scene items injected here -->
                     </div>
                 </section>
                 <hr>
                 <section id="repositoryExperiments" class="repository-section">
                     <h2><i class="fas fa-flask"></i> Alchemical Experiments <i class="fas fa-info-circle info-icon" title="Challenging procedures unlocked by high Attunement in specific Elements. Attempting them costs Insight and may require specific Focused Concepts. Success yields rewards, failure may have minor consequences."></i></h2>
                     <div class="repo-list">
                         <p>Achieve high Attunement in elements to unlock challenging experiments.</p>
                         <!-- Experiment items injected here -->
                     </div>
                 </section>
                 <hr>
                 <section id="repositoryInsights" class="repository-section">
                     <h2><i class="fas fa-lightbulb"></i> Elemental Insights <i class="fas fa-info-circle info-icon" title="Short, evocative text fragments related to specific Elements, occasionally discovered during Research. They offer flavor and deepen the lore."></i></h2>
                     <div class="repo-list">
                         <p>Rare fragments of knowledge occasionally found during research.</p>
                         <!-- Insight items injected here -->
                     </div>
                 </section>
                 <hr>
                  <!-- MOVED: Milestones Section -->
                 <section id="milestonesSection" class="repository-section">
                      <h2><i class="fas fa-award"></i> Milestones Achieved <i class="fas fa-info-circle info-icon" title="Significant accomplishments tracked throughout your journey. Achieving milestones often grants rewards like Insight or increased Focus Slots."></i></h2>
                      <ul id="milestonesDisplay"><li>None yet</li></ul>
                 </section>
             </div>
         </div>


        <!-- === Concept Detail Pop-up === -->
        <div id="conceptDetailPopup" class="popup hidden card-popup">
              <button id="closePopupButton" class="close-button">×</button>
              <div class="popup-header">
                  <span id="popupCardTypeIcon" class="card-type-icon"></span>
                  <h3 id="popupConceptName">Concept Name</h3>
                  <p id="popupConceptType">Card Type</p>
              </div>
              <div class="popup-content">
                  <div id="popupVisualContainer" class="popup-visual">
                      <i id="popupCardVisual" class="card-visual-placeholder fa-solid fa-image"></i>
                  </div>
                  <div class="popup-details">
                      <p id="popupDetailedDescription" class="detailed-description">Detailed description...</p>
                       <hr class="popup-hr">
                      <div class="resonance-summary" id="popupResonanceSummary">Resonance info... <i class="fas fa-info-circle info-icon" title="How closely this Concept's elemental scores align with your current Core Foundation scores. High resonance suggests strong alignment, Dissonant suggests significant divergence."></i></div>
                      <div class="recipe-view">
                          <h4>Resonance Analysis <i class="fas fa-info-circle info-icon" title="A deeper look at the alignment between this Concept's elemental 'recipe' and your own, highlighting key similarities and differences."></i></h4>
                          <div id="popupComparisonHighlights">Highlights...</div>
                          <details class="element-details">
                              <summary>View Full Recipe Comparison</summary>
                              <div class="profile-comparison">
                                  <div class="profile-column"><h5>Concept</h5><div id="popupConceptProfile"></div></div>
                                  <div class="profile-column"><h5>You</h5><div id="popupUserComparisonProfile"></div></div>
                              </div>
                          </details>
                      </div>
                       <hr class="popup-hr">
                       <!-- Updated Related Concepts to Details/Summary -->
                       <div id="popupRelatedConcepts" class="related-concepts">
                            <!-- Content generated by JS -->
                       </div>
                       <div id="myNotesSection" class="my-notes-section hidden">
                            <hr class="popup-hr">
                           <h4>My Notes <i class="fas fa-info-circle info-icon" title="Your personal space to jot down thoughts, reflections, or interpretations related to this Concept. Saved automatically."></i></h4>
                           <textarea id="myNotesTextarea" rows="3" placeholder="Add your personal reflections here..."></textarea>
                           <button id="saveMyNoteButton" class="button small-button">Save Note</button>
                           <span id="noteSaveStatus" class="note-status"></span>
                       </div>
                      <div id="popupEvolutionSection" class="evolution-section hidden">
                          <hr class="popup-hr">
                          <h4>Deepen Understanding <i class="fas fa-info-circle info-icon" title="Unlock enhanced art for this Concept by meeting the requirements (Focusing it, having Reflected, sufficient Insight)."></i></h4>
                          <button id="evolveArtButton" class="button small-button evolve-button" disabled>Unlock Enhanced Art (Cost: <span id="evolveCost">?</span>)</button>
                          <p id="evolveEligibility" class="evolve-eligibility-text"></p>
                      </div>
                  </div>
              </div>
              <div class="popup-actions">
                  <button id="addToGrimoireButton" class="button small-button add-grimoire-button" title="Add this Concept to your permanent Grimoire collection.">Add to Grimoire</button>
                  <button id="markAsFocusButton" class="button small-button focus-button hidden" title="Toggle whether this Concept contributes to your Persona Tapestry.">Mark as Focus</button>
                  <!-- Sell button added dynamically by renderCard if applicable -->
              </div>
        </div>

         <!-- === Reflection Prompt Modal === -->
         <div id="reflectionModal" class="popup hidden reflection-modal">
             <button id="closeReflectionModalButton" class="close-button">×</button>
             <h3 id="reflectionModalTitle">Moment for Reflection <i class="fas fa-info-circle info-icon" title="Pause and consider the presented prompt. Check the box once you've genuinely reflected. Confirming grants Insight and potentially Attunement."></i></h3>
             <p>Regarding <strong id="reflectionElement">Element/Concept</strong>:</p>
             <p id="reflectionPromptText" class="prompt-text">Prompt text...</p>
             <div class="reflection-confirm">
                 <input type="checkbox" id="reflectionCheckbox">
                 <label for="reflectionCheckbox">I have taken a moment to reflect on this.</label>
                 <br>
                 <input type="checkbox" id="scoreNudgeCheckbox" class="hidden">
                 <label for="scoreNudgeCheckbox" id="scoreNudgeLabel" class="hidden score-nudge-label" title="If checked (only available for Dissonance reflections), completing this reflection may slightly adjust your Core Foundation scores towards this Concept's profile.">Allow this reflection to potentially nudge your core understanding?</label>
             </div>
             <button id="confirmReflectionButton" class="button small-button" disabled>Confirm Reflection (+<span id="reflectionRewardAmount">?</span>)</button>
         </div>

         <!-- === Settings Popup === -->
         <div id="settingsPopup" class="popup hidden settings-popup">
             <button id="closeSettingsPopupButton" class="close-button">×</button>
             <h3>Settings <i class="fas fa-info-circle info-icon" title="Manage your session data. 'Force Save' manually triggers saving. 'Reset All Progress' completely wipes your saved data (use with caution!)."></i></h3>
             <div class="settings-content">
                  <p>Manage your session data.</p>
                  <button id="forceSaveButton" class="button small-button">Force Save</button>
                  <button id="resetAppButton" class="button small-button back-button">Reset All Progress</button>
                  <p class="reset-warning"><strong>Warning:</strong> Resetting will erase all scores, discovered concepts, insight, and progress permanently.</p>
             </div>
         </div>

          <!-- === Milestone Alert === -->
         <div id="milestoneAlert" class="milestone-alert hidden">
             <span id="milestoneAlertText">Milestone Reached!</span>
             <button id="closeMilestoneAlertButton">×</button>
         </div>

         <!-- === Temporary Message / Toast Notification === -->
         <div id="toastNotification" class="toast hidden">
             <span id="toastMessage">Message text here</span>
         </div>

         <!-- Overlay for Popups -->
         <div id="popupOverlay" class="overlay hidden"></div>

    </div> <!-- End app-container -->

    <!-- SCRIPTS AT THE END (with defer) -->
    <script src="data.js" defer></script>
    <script src="script.js" defer></script>
</body>
</html>
