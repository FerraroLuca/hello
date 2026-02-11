import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Configurazione del modello con istruzioni di sistema per rispondere sempre in JSON
const model = genAI ? genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
  systemInstruction: `Sei un Master di un GDR Fantasy. 
  Rispondi SEMPRE in formato JSON con questa struttura:
  {
    "narrative": "descrizione della storia",
    "stats": { "hp": 100, "maxHp": 100, "level": 1, "inventory": [], "location": "Nome Posto", "class": "Classe" },
    "isGameOver": false,
    "gameOverReason": "",
    "isVictory": false,
    "victoryReason": ""
  }`
}) : null;

/**
 * Inizia la partita (chiamata da handleStartGame in App.jsx)
 */
export async function initGame(theme) {
  if (!model) throw new Error("API Key mancante");

  const prompt = `Inizia un'avventura con tema: ${theme}. 
  Crea l'introduzione e le statistiche iniziali per il giocatore.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

/**
 * Invia l'azione (chiamata da handleAction in App.jsx)
 */
export async function sendAction(actionText) {
  if (!model) throw new Error("API Key mancante");

  // Qui passiamo l'azione al modello
  const result = await model.generateContent(`Il giocatore fa: ${actionText}. Continua la storia e aggiorna le statistiche.`);
  const response = await result.response;
  return JSON.parse(response.text());
}

// Esportazione di default per compatibilità
export default genAI;