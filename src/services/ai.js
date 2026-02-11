import { GoogleGenAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;

// Funzione di utilità per inizializzare l'AI solo quando serve
const getGenAI = () => {
  if (!API_KEY) {
    console.error("ERRORE: VITE_GEMINI_KEY non trovata!");
    return null;
  }
  
  try {
    // Verifichiamo se GoogleGenAI esiste prima di usarlo come costruttore
    if (typeof GoogleGenAI !== 'undefined') {
      return new GoogleGenAI(API_KEY);
    } else {
      console.error("GoogleGenAI è undefined. Errore di importazione.");
      return null;
    }
  } catch (e) {
    console.error("Errore durante l'inizializzazione di GoogleGenAI:", e);
    return null;
  }
};

const genAI = getGenAI();
export default genAI;