import React from 'react';
import { Heart, Briefcase, MapPin, Image as ImageIcon } from 'lucide-react';

export const GameHUD = ({ stats, imageUrl }) => {
  const hpPercent = Math.max(0, Math.min(100, (stats.hp / stats.maxHp) * 100));
  let barColor = "bg-emerald-500";
  if (hpPercent < 30) barColor = "bg-red-600";
  else if (hpPercent < 60) barColor = "bg-yellow-500";

  return (
    <div className="w-full lg:w-96 bg-slate-900/90 border-l border-slate-700 flex flex-col h-full overflow-y-auto">
      <div className="w-full aspect-square relative overflow-hidden border-b border-slate-700">
        {imageUrl ? (
          <img src={imageUrl} alt="Scene" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
            <ImageIcon className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 drop-shadow-md">
          <h2 className="text-amber-500 font-serif text-2xl font-bold">{stats.class || "Avventuriero"}</h2>
          <div className="text-slate-300 text-xs uppercase font-bold">Livello {stats.level}</div>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1">
        <div>
          <div className="flex justify-between items-end mb-2 text-sm">
            <span className="flex items-center gap-2 text-slate-200 font-bold"><Heart className="w-4 h-4 text-red-500" /> Salute</span>
            <span className="text-slate-400 font-mono">{stats.hp} / {stats.maxHp}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${hpPercent}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Posizione</h3>
            <p className="text-indigo-100 text-sm font-medium">{stats.location}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 text-slate-200 font-bold border-b border-slate-800 pb-2">
            <Briefcase className="w-4 h-4 text-amber-500" /> Inventario
          </div>
          {stats.inventory?.length > 0 ? (
            <ul className="space-y-2">
              {stats.inventory.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 bg-amber-500/50 rounded-full"></span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 text-sm italic text-center">Borsa vuota...</p>
          )}
        </div>
      </div>
    </div>
  );
};