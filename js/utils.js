// js/utils.js - Utility Functions (Pure functions, no side effects)
import * as Data from '../data.js'; // Import data to access details if needed

console.log("utils.js loading...");

export function getScoreLabel(score) {
    if (typeof score !== 'number' || isNaN(score)) return "N/A";
    if (score >= 9) return "Very High";
    if (score >= 7) return "High";
    if (score >= 5) return "Moderate";
    if (score >= 3) return "Low";
    return "Very Low";
}

export function getAffinityLevel(score) {
    if (typeof score !== 'number' || isNaN(score)) return null;
    if (score >= 8) return "High";
    if (score >= 5) return "Moderate";
    return null; // Only return High/Moderate for card display
}

export function getElementColor(elementName) {
    // Access elementDetails directly from imported data
    const key = Data.elementNameToKey ? Data.elementNameToKey[elementName] : null;
    // Fallback colors if needed, but ideally defined in data
    const fallbackColors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' };
    // Prefer color defined in data if possible, otherwise use fallback
    // This assumes data.js defines colors or you add them
    // return Data.elementDetails?.[elementName]?.color || fallbackColors[elementName] || '#CCCCCC';
    return fallbackColors[elementName] || '#CCCCCC'; // Using fallback for now
}

export function hexToRgba(hex, alpha = 1) {
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

export function getCardTypeIcon(cardType) {
     switch (cardType) {
         case "Orientation": return "fa-solid fa-compass";
         case "Identity/Role": return "fa-solid fa-mask";
         case "Practice/Kink": return "fa-solid fa-gear"; // Changed from fa-cogs
         case "Psychological/Goal": return "fa-solid fa-brain";
         case "Relationship Style": return "fa-solid fa-heart";
         default: return "fa-solid fa-question-circle";
     }
}

export function getElementIcon(elementName) {
     // Access elementDetails directly from imported data
     // const details = Data.elementDetails?.[elementName];
     // if (details?.icon) return details.icon; // If you add icons to data.js

     // Fallback icons
     switch (elementName) {
         case "Attraction": return "fa-solid fa-magnet";
         case "Interaction": return "fa-solid fa-users";
         case "Sensory": return "fa-solid fa-hand-sparkles";
         case "Psychological": return "fa-solid fa-comment-dots"; // Changed from brain
         case "Cognitive": return "fa-solid fa-lightbulb";
         case "Relational": return "fa-solid fa-link";
         default: return "fa-solid fa-atom";
     }
}

export function euclideanDistance(userScoresObj, conceptScoresObj) {
     let sumOfSquares = 0;
     let validDimensions = 0;

     if (!userScoresObj || typeof userScoresObj !== 'object' || !conceptScoresObj || typeof conceptScoresObj !== 'object') {
         console.warn("Invalid input for euclideanDistance", userScoresObj, conceptScoresObj);
         return Infinity;
     }

     const expectedKeys = Object.keys(userScoresObj);
     if (expectedKeys.length === 0) {
         console.warn("User scores object is empty in euclideanDistance");
         return Infinity;
     }

     for (const key of expectedKeys) {
         const s1 = userScoresObj[key];
         const s2 = conceptScoresObj[key];
         const s1Valid = typeof s1 === 'number' && !isNaN(s1);
         // Check if conceptScoresObj *has* the key, not just if it's defined
         const s2Valid = conceptScoresObj.hasOwnProperty(key) && typeof s2 === 'number' && !isNaN(s2);

         if (s1Valid && s2Valid) {
             sumOfSquares += Math.pow(s1 - s2, 2);
             validDimensions++;
         } else {
            // Optionally log missing keys for debugging data consistency
            // if (!conceptScoresObj.hasOwnProperty(key)) console.log(`Key ${key} missing in concept scores`);
         }
     }

     if (validDimensions === 0) {
         console.warn("No valid dimensions found for comparison in euclideanDistance");
         return Infinity; // Avoid division by zero / sqrt(0)
     }

     // Normalize? No, simple distance is fine here.
     return Math.sqrt(sumOfSquares);
}

// Check if data from data.js is available
export function isDataReady() {
    const ready = typeof Data !== 'undefined' &&
                  Data.elementDetails && Data.concepts && Data.questionnaireGuided &&
                  Data.reflectionPrompts && Data.elementDeepDive && Data.dailyRituals &&
                  Data.milestones && Data.elementKeyToFullName && Data.focusRituals &&
                  Data.sceneBlueprints && Data.alchemicalExperiments && Data.elementalInsights &&
                  Data.focusDrivenUnlocks;
    if (!ready) {
        console.error("CRITICAL: Core data objects from data.js are not available!");
    }
    return ready;
}


console.log("utils.js loaded.");
