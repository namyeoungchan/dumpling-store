"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DataProvider, useData } from "./store";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import CompleteScreen from "./screens/CompleteScreen";
import AdminScreen from "./screens/AdminScreen";

/** Firebase 첫 응답 전 로딩 화면 (미설정 시 바로 통과) */
function CloudGate({ children }) {
  const { cloud } = useData();
  if (cloud.ready) return children;
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        className="h-14 w-16 rounded-[50%] border-4 border-dough-400 bg-dough-100"
      />
      <p className="font-display text-charcoal-600">가게 문 여는 중...</p>
    </div>
  );
}

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
      <CloudGate>
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
      </CloudGate>
    </DataProvider>
  );
}
