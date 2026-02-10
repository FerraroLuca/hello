import React, { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen, VictoryScreen } from './components/EndScreens';
import { initGame, sendAction } from './services/ai';

const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY'
};

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [endData, setEndData] = useState(null);
  const [currentImage, setCurrentImage] = useState(undefined);
  const [stats, setStats] = useState({ hp: 100, maxHp: 100, level: 1, inventory: [], location: "Unknown", class: "Loading..." });

  const handleStartGame = async (theme) => {
    setIsLoading(true);
    setMessages([]);
    setCurrentImage(undefined);
    try {
      const data = await initGame(theme);
      setMessages([{ role: "model", text: data.narrative }]);
      setStats(data.stats);
      if (data.imageUrl) setCurrentImage(data.imageUrl);
      setGameState(GAME_STATES.PLAYING);
    } catch (error) {
      alert("Errore di connessione con Gemini. Verifica la API KEY.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionText) => {
    setMessages(prev => [...prev, { role: "user", text: actionText }]);
    setIsLoading(true);
    try {
      const data = await sendAction(actionText);
      setStats(data.stats);
      if (data.imageUrl) setCurrentImage(data.imageUrl);
      setMessages(prev => [...prev, { role: "model", text: data.narrative }]);

      if (data.isGameOver) {
        setEndData({ stats: data.stats, endReason: data.gameOverReason });
        setTimeout(() => setGameState(GAME_STATES.GAME_OVER), 2500);
      } else if (data.isVictory) {
        setEndData({ stats: data.stats, endReason: data.victoryReason });
        setTimeout(() => setGameState(GAME_STATES.VICTORY), 2500);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "model", text: "(Errore di connessione. Riprova.)" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setMessages([]);
    setEndData(null);
    setCurrentImage(undefined);
    setGameState(GAME_STATES.MENU);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 w-full h-full">
        {gameState === GAME_STATES.MENU && <StartScreen onStartGame={handleStartGame} isLoading={isLoading} />}
        {gameState === GAME_STATES.PLAYING && <GameScreen initialStory={messages[0]?.text || ""} initialStats={stats} onAction={handleAction} isLoading={isLoading} messages={messages} currentImage={currentImage} />}
        {gameState === GAME_STATES.GAME_OVER && <GameOverScreen reason={endData?.endReason} onRestart={resetGame} />}
        {gameState === GAME_STATES.VICTORY && <VictoryScreen reason={endData?.endReason} onRestart={resetGame} />}
      </div>
    </div>
  );
}

export default App;