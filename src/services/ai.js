// Usiamo l'importazione specifica per il web se disponibile
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;

// Verifichiamo se la classe esiste prima di usarla
let genAI = null;

if (API_KEY) {
  try {
    // Nota: La classe si chiama spesso GoogleGenerativeAI, non GoogleGenAI
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log("AI Inizializzata correttamente");
  } catch (e) {
    console.error("Errore inizializzazione AI:", e);
  }
} else {
  console.error("Chiave API mancante! Controlla VITE_GEMINI_KEY su Netlify.");
}

export default genAI;