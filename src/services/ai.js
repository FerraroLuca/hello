import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Recupero la chiave (Vite usa import.meta.env)
const API_KEY = import.meta.env.VITE_GEMINI_KEY;

// 2. Inizializzazione Client
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// 3. Inizializzazione Modello - NOTA: non aggiungiamo altre opzioni qui per ora
const model = genAI ? genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
}) : null;

/**
 * Funzione per pulire e trasformare la risposta in JSON
 */
function parseResponse(text) {
  try {
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Errore parsing JSON:", e);
    return {
      narrative: "L'avventura prosegue in modo inaspettato...",
      stats: { hp: 100, maxHp: 100, level: 1, inventory: [], location: "Sconosciuta", class: "Eroe" },
      isGameOver: false, isVictory: false
    };
  }
}

export async function initGame(theme) {
  if (!model) throw new Error("API Key non trovata o non valida");
  
  const prompt = `Sei un Master GDR. Inizia avventura tema ${theme}. 
  Rispondi SOLO JSON: {"narrative": "...", "stats": {"hp":100, "maxHp":100, "level":1, "inventory":[], "location":"Inizio", "class":"Viandante"}, "isGameOver":false, "isVictory":false}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseResponse(response.text());
  } catch (error) {
    console.error("Dettaglio Errore Google:", error);
    throw error;
  }
}

export async function sendAction(actionText) {
  if (!model) throw new Error("API Key non trovata");

  const prompt = `Il giocatore fa: ${actionText}. Continua la storia. Rispondi SOLO JSON con stessa struttura.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseResponse(response.text());
  } catch (error) {
    console.error("Dettaglio Errore Google:", error);
    throw error;
  }
}

export default genAI;