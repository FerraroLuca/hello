import * as GoogleGenerativeAI from "@google/generative-ai";

// Recupera la chiave dalle variabili d'ambiente (Vite usa import.meta.env)
const API_KEY = import.meta.env.VITE_GEMINI_KEY;

let client = null;
if (API_KEY) {
  // Accediamo alla classe tramite l'oggetto che abbiamo importato sopra
  client = new GoogleGenerativeAI.GoogleGenAI(API_KEY);
} else {
  console.warn("VITE_GEMINI_KEY mancante nelle variabili d'ambiente.");
}

// Definiamo lo schema usando stringhe dirette, che è più stabile tra le versioni
const gameSchema = {
  type: "object",
  properties: {
    narrative: { type: "string" },
    stats: {
      type: "object",
      properties: {
        hp: { type: "integer" },
        maxHp: { type: "integer" },
        level: { type: "integer" },
        inventory: { type: "array", items: { type: "string" } },
        location: { type: "string" },
        class: { type: "string" }
      },
      required: ["hp", "maxHp", "level", "inventory", "location", "class"]
    },
    isGameOver: { type: "boolean" },
    gameOverReason: { type: "string" },
    isVictory: { type: "boolean" },
    victoryReason: { type: "string" }
  },
  required: ["narrative", "stats", "isGameOver", "isVictory"]
};

let chatSession = null;

// Funzione helper per generare immagini
const generateImage = async (prompt) => {
  try {
    const safePrompt = `${prompt.split(".")[0].substring(0, 100).replace(/[^a-zA-Z0-9 ]/g, " ").trim()} fantasy rpg digital art cinematic lighting high resolution`;
    const seed = Math.floor(Math.random() * 999999);
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(safePrompt)}?width=1024&height=768&seed=${seed}&nologo=true&model=flux&enhance=false`;
  } catch (e) {
    console.error("Errore generazione immagine:", e);
    return null;
  }
};

export const initGame = async (theme) => {
  chatSession = client.chats.create({
    model: "gemini-1.5-flash", // O "gemini-2.0-flash" se disponibile
    config: {
      systemInstruction: `
        Sei un Game Master esperto di un Gioco di Ruolo testuale.
        Regole:
        1. Rispondi SOLO JSON seguendo lo schema.
        2. Lingua ITALIANO.
        3. Crea personaggio bilanciato.
        4. HP <= 0 -> isGameOver = true.
      `,
      responseMimeType: "application/json",
      responseSchema: gameSchema
    }
  });

  try {
    const prompt = `Inizia una nuova avventura basata su questo tema: "${theme}".`;
    const response = await chatSession.sendMessage({ message: prompt });
    const text = response.text();
    if (!text) throw new Error("No response");
    
    const data = JSON.parse(text);
    data.imageUrl = await generateImage(data.narrative);
    return data;
  } catch (error) {
    console.error("Error initializing game:", error);
    throw error;
  }
};

export const sendAction = async (action) => {
  if (!chatSession) throw new Error("Session not initialized");
  try {
    const response = await chatSession.sendMessage({ message: action });
    const text = response.text();
    if (!text) throw new Error("No response");
    
    const data = JSON.parse(text);
    data.imageUrl = await generateImage(data.narrative);
    return data;
  } catch (error) {
    console.error("Error sending action:", error);
    throw error;
  }
};