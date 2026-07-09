"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DataProvider } from "./store";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import CompleteScreen from "./screens/CompleteScreen";
import AdminScreen from "./screens/AdminScreen";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | game | complete | admin
  const [gameKey, setGameKey] = useState(0); // 다시하기 시 게임 상태 리셋
  const [result, setResult] = useState({ missCount: 0 });

  const startGame = () => {
    setGameKey((k) => k + 1);
    setScreen("game");
  };

  return (
    <DataProvider>
      <div className="grain min-h-[100dvh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {screen === "home" && (
              <HomeScreen
                onStart={startGame}
                onAdmin={() => setScreen("admin")}
              />
            )}
            {screen === "game" && (
              <GameScreen
                key={gameKey}
                onExit={() => setScreen("home")}
                onComplete={(r) => {
                  setResult(r);
                  setScreen("complete");
                }}
              />
            )}
            {screen === "complete" && (
              <CompleteScreen
                missCount={result.missCount}
                onRestart={startGame}
                onHome={() => setScreen("home")}
              />
            )}
            {screen === "admin" && (
              <AdminScreen onBack={() => setScreen("home")} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DataProvider>
  );
}
