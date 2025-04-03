// js/utils.js - Utility Functions
import { elementDetails, elementKeyToFullName, elementNameToKey } from '../data.js'; // Keep imports if needed by functions

console.log("utils.js loading...");

// Returns a descriptive label based on a 0-10 score
export function getScoreLabel(score) {
    if (typeof score !== 'number' || isNaN(score)) return "N/A";
    if (score >= 9) return "Very High";
    if (score >= 7) return "High";
    if (score >= 5) return "Moderate";
    if (score >= 3) return "Low";
    return "Very Low";
}

// Returns a general affinity level ('High', 'Moderate', null)
export function getAffinityLevel(score) {
    if (typeof score !== 'number' || isNaN(score)) return null;
    if (score >= 8) return "High"; // Stricter threshold for "High" affinity display?
    if (score >= 5) return "Moderate";
    return null; // No distinct affinity level below moderate
}

// Gets the display color associated with an element name
export function getElementColor(elementName) {
    // Using fallback colors directly for reliability.
    const fallbackColors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' };
    return fallbackColors[elementName] || '#CCCCCC'; // Default grey
}

// Converts a hex color code to an rgba string
export function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string') return `rgba(128,128,128, ${alpha})`; // Default grey if invalid input
    hex = hex.replace('#', '');
    // Handle shorthand hex (e.g., #03F)
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    // Parse hex string to integer
    const bigint = parseInt(hex, 16);
    // Check if parsing failed
    if (isNaN(bigint)) return `rgba(128,128,128, ${alpha})`; // Default grey if invalid hex
    // Extract R, G, B components
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // Return formatted rgba string, ensuring alpha is within bounds
    const validAlpha = Math.max(0, Math.min(1, alpha));
    return `rgba(${r},${g},${b},${validAlpha})`;
}

// Gets the Font Awesome icon class for a given card type
export function getCardTypeIcon(cardType) {
     switch (cardType) {
         case "Orientation": return "fa-solid fa-compass";
         case "Identity/Role": return "fa-solid fa-mask";
         case "Practice/Kink": return "fa-solid fa-gear"; // Or fa-wand-sparkles? fa-hand-sparkles?
         case "Psychological/Goal": return "fa-solid fa-brain";
         case "Relationship Style": return "fa-solid fa-heart"; // Or fa-users?
         case "Cognitive": return "fa-solid fa-lightbulb"; // Ensure this type exists if used
         default: return "fa-solid fa-question-circle"; // Default fallback
     }
}

// Gets the Font Awesome icon class for a given element name
export function getElementIcon(elementName) {
     switch (elementName) {
         case "Attraction": return "fa-solid fa-magnet";
         case "Interaction": return "fa-solid fa-users"; // Or fa-people-arrows?
         case "Sensory": return "fa-solid fa-hand-sparkles";
         case "Psychological": return "fa-solid fa-comment-dots"; // Or fa-head-side-virus?
         case "Cognitive": return "fa-solid fa-lightbulb"; // Or fa-brain?
         case "Relational": return "fa-solid fa-link"; // Or fa-people-group?
         default: return "fa-solid fa-atom"; // Default fallback
     }
}

// Calculates the Euclidean distance between two score objects (e.g., user vs concept)
export function euclideanDistance(userScoresObj, conceptScoresObj) {
     let sumOfSquares = 0;
     let validDimensions = 0;
     // Validate inputs are objects
     if (!userScoresObj || typeof userScoresObj !== 'object' || !conceptScoresObj || typeof conceptScoresObj !== 'object') {
         console.warn("Invalid input for euclideanDistance", userScoresObj, conceptScoresObj);
         return Infinity; // Return Infinity for invalid inputs
     }

     // Determine keys to compare (use mapping if available, else assume keys match)
     const keysToCompare = elementNameToKey ? Object.values(elementNameToKey) : Object.keys(userScoresObj);
     if (keysToCompare.length === 0) {
         console.warn("Could not determine keys for comparison in euclideanDistance");
         return Infinity; // Cannot compare if no keys are found
     }

     // Iterate and calculate squared differences
     for (const key of keysToCompare) {
         const s1 = userScoresObj[key];
         const s2 = conceptScoresObj[key];
         // Check if both scores are valid numbers
         const s1Valid = typeof s1 === 'number' && !isNaN(s1);
         const s2Valid = conceptScoresObj.hasOwnProperty(key) && typeof s2 === 'number' && !isNaN(s2);

         if (s1Valid && s2Valid) {
             sumOfSquares += Math.pow(s1 - s2, 2);
             validDimensions++;
         }
         // Optionally log missing keys or invalid scores for debugging:
         // else { console.log(`Skipping dimension ${key}: s1Valid=${s1Valid}, s2Valid=${s2Valid}`); }
     }

     // Check if any valid dimensions were found
     if (validDimensions === 0) {
         console.warn("No valid dimensions found for comparison in euclideanDistance");
         return Infinity; // Cannot calculate distance if no dimensions match
     }

     // Return the square root of the sum of squares
     return Math.sqrt(sumOfSquares);
}

console.log("utils.js loaded.");
