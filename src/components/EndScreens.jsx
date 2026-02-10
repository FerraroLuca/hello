import React from 'react';
import { Skull, RefreshCw, Trophy, House } from 'lucide-react';

export const GameOverScreen = ({ reason, onRestart }) => (
  <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-center p-6 animate-fadeIn">
    <div className="mb-8 relative">
      <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 rounded-full" />
      <Skull className="w-32 h-32 text-red-600 relative z-10 animate-pulse" />
    </div>
    <h1 className="text-6xl md:text-8xl font-serif font-bold text-red-700 mb-2 tracking-widest uppercase">Game Over</h1>
    <div className="max-w-xl mx-auto bg-slate-900/50 p-6 rounded-lg border border-red-900/30 backdrop-blur-sm mb-10">
      <h3 className="text-red-400 font-bold mb-2 uppercase text-sm">Causa del decesso</h3>
      <p className="text-slate-300 text-lg font-serif italic">"{reason || "Il tuo viaggio è giunto a una fine..."}"</p>
    </div>
    <button onClick={onRestart} className="group flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-slate-700 hover:border-white text-slate-400 hover:text-white rounded-full transition-all hover:bg-slate-900">
      <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
      <span className="font-bold tracking-wider uppercase">Ritorna al Menù</span>
    </button>
  </div>
);

export const VictoryScreen = ({ reason, onRestart }) => (
  <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-950 text-center p-6 animate-fadeIn">
    <div className="mb-8 relative">
      <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-30 rounded-full" />
      <Trophy className="w-32 h-32 text-amber-400 relative z-10 animate-bounce" />
    </div>
    <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-4 tracking-widest uppercase">Vittoria!</h1>
    <div className="max-w-xl mx-auto bg-slate-900/80 p-8 rounded-xl border border-amber-500/30 backdrop-blur-sm mb-12">
      <h3 className="text-amber-500 font-bold mb-4 uppercase text-sm flex items-center justify-center gap-2"><Trophy className="w-4 h-4" /> Missione Compiuta</h3>
      <p className="text-slate-200 text-lg font-serif italic">"{reason || "Hai trionfato."}"</p>
    </div>
    <button onClick={onRestart} className="group flex items-center gap-3 px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all shadow-lg hover:-translate-y-1 font-bold tracking-wider uppercase">
      <House className="w-5 h-5" />
      <span>Ritorna al Menù</span>
    </button>
  </div>
);