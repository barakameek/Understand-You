// js/utils.js - Utility Functions
import { elementDetails, elementKeyToFullName, elementNameToKey } from '../data.js';

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
    return null;
}

export function getElementColor(elementName) {
    // Using fallback colors directly for simplicity now.
    // You could enhance this by reading from elementDetails if defined there.
    const fallbackColors = { Attraction: '#FF6347', Interaction: '#4682B4', Sensory: '#32CD32', Psychological: '#FFD700', Cognitive: '#8A2BE2', Relational: '#FF8C00' };
    return fallbackColors[elementName] || '#CCCCCC';
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
         case "Practice/Kink": return "fa-solid fa-gear";
         case "Psychological/Goal": return "fa-solid fa-brain";
         case "Relationship Style": return "fa-solid fa-heart";
         default: return "fa-solid fa-question-circle";
     }
}

export function getElementIcon(elementName) {
     // Using fallback icons directly.
     switch (elementName) {
         case "Attraction": return "fa-solid fa-magnet";
         case "Interaction": return "fa-solid fa-users";
         case "Sensory": return "fa-solid fa-hand-sparkles";
         case "Psychological": return "fa-solid fa-comment-dots";
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
     // Use elementNameToKey mapping if available, otherwise assume keys match
     const keysToCompare = elementNameToKey ? Object.values(elementNameToKey) : Object.keys(userScoresObj);
     if (keysToCompare.length === 0) {
         console.warn("Could not determine keys for comparison in euclideanDistance");
         return Infinity;
     }
     for (const key of keysToCompare) {
         const s1 = userScoresObj[key];
         const s2 = conceptScoresObj[key];
         const s1Valid = typeof s1 === 'number' && !isNaN(s1);
         const s2Valid = conceptScoresObj.hasOwnProperty(key) && typeof s2 === 'number' && !isNaN(s2);
         if (s1Valid && s2Valid) {
             sumOfSquares += Math.pow(s1 - s2, 2);
             validDimensions++;
         }
     }
     if (validDimensions === 0) {
         console.warn("No valid dimensions found for comparison in euclideanDistance");
         return Infinity;
     }
     return Math.sqrt(sumOfSquares);
}

console.log("utils.js loaded.");
