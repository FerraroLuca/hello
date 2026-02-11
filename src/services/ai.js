import { GoogleGenerativeAI } from "@google/generative-ai";

// Configurazione Iniziale
const API_KEY = import.meta.env.VITE_GEMINI_KEY;

// Specifichiamo la versione API "v1" per evitare il 404 della v1beta
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Inizializzazione del modello 1.5 Flash
const model = genAI ? genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
}) : null;

/**
 * Funzione per pulire la risposta e convertirla in JSON
 */
function parseGeminiResponse(responseText) {
  try {
    const cleanText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Errore parsing JSON:", e, "Testo:", responseText);
    // Ritorna un oggetto di fallback per non crashare l'app
    return {
      narrative: "L'oracolo ha parlato in modo confuso... (Errore nei dati)",
      stats: { hp: 100, maxHp: 100, level: 1, inventory: [], location: "Limbo", class: "Eroe" },
      isGameOver: false, isVictory: false
    };
  }
}

export async function initGame(theme) {
  if (!model) throw new Error("API Key mancante su Netlify");

  const prompt = `Sei un Master GDR. Inizia avventura tema ${theme}. 
  Rispondi SOLO in JSON: {"narrative": "...", "stats": {"hp":100, "maxHp":100, "level":1, "inventory":[], "location":"Inizio", "class":"Viandante"}, "isGameOver":false, "isVictory":false}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Dettaglio Errore Google:", error);
    throw error;
  }
}

export async function sendAction(actionText) {
  if (!model) throw new Error("API Key mancante");

  const prompt = `Il giocatore fa: ${actionText}. Continua la storia. Rispondi SOLO JSON con struttura identica alla precedente.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Dettaglio Errore Google:", error);
    throw error;
  }
}

export default genAI;