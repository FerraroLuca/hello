import React, { useState } from 'react';
import { ThemeIcon } from './Icons';
import { LoaderCircle } from 'lucide-react';

const PRESETS = [
  { id: "fantasy", title: "Il Regno Perduto", description: "Classico fantasy medievale.", icon: "sword", prompt: "Fantasy Medievale Classico." },
  { id: "scifi", title: "Deriva Spaziale", description: "Horror sci-fi su nave abbandonata.", icon: "rocket", prompt: "Sci-Fi Horror." },
  { id: "cyberpunk", title: "Neo-City 2099", description: "Hacker e neon.", icon: "skull", prompt: "Cyberpunk Dystopian." },
  { id: "mystery", title: "L'Oscura Villa", description: "Investigazione lovecraftiana.", icon: "wand", prompt: "Lovecraftian Horror." }
];

export const StartScreen = ({ onStartGame, isLoading }) => {
  const [customInput, setCustomInput] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-4">Chronicles of Mahogany</h1>
        <p className="text-slate-400 text-xl">Scegli il tuo destino.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center animate-pulse">
          <LoaderCircle className="w-16 h-16 text-amber-500 animate-spin mb-4" />
          <p className="text-amber-500 text-xl font-serif">Il Dungeon Master sta preparando il mondo...</p>
        </div>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {PRESETS.map(p => (
              <button key={p.id} onClick={() => onStartGame(p.prompt)} className="group relative flex flex-col p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-left">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40">
                  <ThemeIcon icon={p.icon} className="w-24 h-24 text-amber-500" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{p.title}</h3>
                  <p className="text-slate-400">{p.description}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={customInput} 
              onChange={(e) => setCustomInput(e.target.value)} 
              placeholder="Oppure scrivi la tua avventura..." 
              className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 px-4 py-3 rounded-lg"
            />
            <button 
              onClick={() => customInput.trim() && onStartGame(customInput)} 
              disabled={!customInput.trim()} 
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50"
            >
              Inizia
            </button>
          </div>
        </div>
      )}
    </div>
  );
};