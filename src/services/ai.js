import { GoogleGenerativeAI } from "@google/generative-ai";

// Configurazione Iniziale
const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Inizializzazione del modello
const model = genAI ? genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  }
}) : null;

/**
 * Funzione interna per pulire la risposta dell'AI e convertirla in oggetto
 */
function parseGeminiResponse(responseText) {
  try {
    // Rimuove eventuali blocchi di codice markdown (```json ... ```)
    const cleanText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Errore nel parsing JSON di Gemini:", e, "Testo ricevuto:", responseText);
    throw new Error("La risposta dell'AI non è in un formato valido.");
  }
}

/**
 * Inizia una nuova avventura
 */
export async function initGame(theme) {
  if (!model) throw new Error("AI non configurata. Verifica la chiave API su Netlify.");

  try {
    const prompt = `Sei un Master di un GDR Fantasy. Inizia un'avventura con tema: ${theme}. 
    Rispondi esclusivamente in formato JSON con questa struttura:
    {
      "narrative": "una descrizione coinvolgente dell'inizio",
      "stats": { "hp": 100, "maxHp": 100, "level": 1, "inventory": [], "location": "Punto di partenza", "class": "Eroe" },
      "isGameOver": false,
      "gameOverReason": "",
      "isVictory": false,
      "victoryReason": ""
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Dettaglio Errore initGame:", error);
    throw error;
  }
}

/**
 * Invia l'azione del giocatore
 */
export async function sendAction(actionText) {
  if (!model) throw new Error("AI non configurata.");

  try {
    const prompt = `Il giocatore compie questa azione: "${actionText}". 
    Continua la narrazione e aggiorna le statistiche se necessario. 
    Rispondi sempre nel formato JSON richiesto precedentemente.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Dettaglio Errore sendAction:", error);
    throw error;
  }
}

export default genAI;