import { GoogleGenAI, SchemaType } from "@google/genai";

// Recupera la chiave dalle variabili d'ambiente (Vite usa import.meta.env)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY mancante nel file .env");
}

const client = new GoogleGenAI({ apiKey: API_KEY });

const gameSchema = {
  type: SchemaType.OBJECT,
  properties: {
    narrative: { type: SchemaType.STRING, description: "La parte narrativa della storia..." },
    stats: {
      type: SchemaType.OBJECT,
      properties: {
        hp: { type: SchemaType.INTEGER },
        maxHp: { type: SchemaType.INTEGER },
        level: { type: SchemaType.INTEGER },
        inventory: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        location: { type: SchemaType.STRING },
        class: { type: SchemaType.STRING }
      },
      required: ["hp", "maxHp", "level", "inventory", "location", "class"]
    },
    isGameOver: { type: SchemaType.BOOLEAN },
    gameOverReason: { type: SchemaType.STRING },
    isVictory: { type: SchemaType.BOOLEAN },
    victoryReason: { type: SchemaType.STRING }
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