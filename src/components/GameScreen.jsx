import React, { useState, useEffect, useRef } from 'react';
import { Send, LoaderCircle } from 'lucide-react';
import { GameHUD } from './GameHUD';

export const GameScreen = ({ initialStory, initialStats, onAction, isLoading, messages, currentImage }) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
  useEffect(() => { if (!isLoading) inputRef.current?.focus(); }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onAction(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-950 overflow-hidden">
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] rounded-2xl p-5 shadow-xl border ${msg.role === "user" ? "bg-slate-800 border-slate-700 text-slate-100 rounded-br-none" : "bg-gradient-to-br from-slate-900 to-slate-900 border-amber-900/30 text-slate-200 rounded-bl-none font-serif leading-relaxed"}`}>
                  {msg.role === "model" && <h4 className="text-amber-600 text-xs font-bold mb-2 uppercase">Dungeon Master</h4>}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="bg-slate-900/50 rounded-2xl p-4 flex items-center gap-3 border border-slate-800">
                  <LoaderCircle className="w-5 h-5 text-amber-500 animate-spin" />
                  <span className="text-slate-400 text-sm animate-pulse">Scrivendo...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-12 pb-6 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Cosa vuoi fare?"
                className="w-full bg-slate-900/90 text-slate-100 border border-slate-700 rounded-xl py-4 pl-5 pr-14 shadow-2xl focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
              />
              <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-2 p-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors disabled:bg-slate-800">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block h-full shadow-2xl z-20">
        <GameHUD stats={initialStats} imageUrl={currentImage} />
      </div>
    </div>
  );
};