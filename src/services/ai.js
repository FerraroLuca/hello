import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Recupero Chiave
const API_KEY = import.meta.env.VITE_GEMINI_KEY;

// 2. Inizializzazione Client
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// 3. Inizializzazione Modello (Usiamo solo il nome del modello senza fronzoli)
const model = genAI ? genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
}) : null;

/**
 * Funzione di utilità per pulire e validare il JSON
 */
function parseResponse(text) {
  try {
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Errore parsing:", e);
    return {
      narrative: "L'oscurità avvolge i tuoi sensi... (Errore di generazione)",
      stats: { hp: 100, maxHp: 100, level: 1, inventory: [], location: "Limbo", class: "Eroe" },
      isGameOver: false, isVictory: false
    };
  }
}

export async function initGame(theme) {
  if (!model) throw new Error("API Key mancante");
  
  const prompt = `Sei un Master GDR. Inizia avventura tema ${theme}. 
  Rispondi SOLO JSON: {"narrative": "...", "stats": {"hp":100, "maxHp":100, "level":1, "inventory":[], "location":"Inizio", "class":"Viandante"}, "isGameOver":false, "isVictory":false}`;

  try {
    const result = await model.generateContent(prompt);
    return parseResponse(result.response.text());
  } catch (error) {
    console.error("Dettaglio Errore Google:", error);
    throw error;
  }
}

export async function sendAction(actionText) {
  if (!model) throw new Error("API Key mancante");

  const prompt = `Il giocatore fa: ${actionText}. Continua la storia. Rispondi SOLO JSON con stessa struttura.`;

  try {
    const result = await model.generateContent(prompt);
    return parseResponse(result.response.text());
  } catch (error) {
    console.error("Dettaglio Errore Google:", error);
    throw error;
  }
}

export default genAI;