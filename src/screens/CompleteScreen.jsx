"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowCounterClockwise, House } from "@phosphor-icons/react";
import Mandu from "../components/Mandu";
import TeamModal from "../components/TeamModal";
import { useData } from "../store";

/** 완성 축하 파티클 — 밀가루/참깨 느낌의 점들이 흩날림 */
function Confetti() {
  const dots = Array.from({ length: 22 }, (_, i) => i);
  const colors = ["#e2703a", "#c9a86a", "#5e7d4f", "#f0e3c8"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: `${(i * 41) % 100}%`,
            top: "-4%",
            background: colors[i % colors.length],
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: "108vh", opacity: [0, 1, 1, 0.6], rotate: 360 }}
          transition={{
            duration: 3.2 + (i % 5) * 0.5,
            delay: (i % 7) * 0.25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function CompleteScreen({ missCount = 0, onRestart, onHome }) {
  const { data } = useData();
  const [openTeam, setOpenTeam] = useState(null);

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden px-6 pb-10 pt-10">
      <Confetti />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 15 }}
          className="text-center"
        >
          <p className="font-display text-lg text-leaf-600">주문 완료!</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-charcoal-800">
            「{data.manduName}」
            <br />
            만두 완성
          </h1>
          <p className="mt-2 text-sm text-charcoal-600/80">
            {data.shopName} 만두가게의 모든 속재료를 찾았습니다
            {missCount > 0 ? ` (헛손질 ${missCount}번)` : " — 한 번에!"}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 12 }}
          className="mt-6"
        >
          <Mandu fill={1} done />
        </motion.div>

        {/* 팀 다시 보기 */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
          className="mt-8"
        >
          <p className="mb-2 text-center text-xs font-medium tracking-wide text-charcoal-600/60">
            속재료를 눌러 팀 소개를 다시 볼 수 있어요
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {data.teams.map((t) => (
              <motion.button
                key={t.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: { opacity: 1, scale: 1 },
                }}
                onClick={() => setOpenTeam(t)}
                className="font-display rounded-full border border-dough-300 bg-white px-4 py-2 text-sm text-charcoal-700 shadow-[0_3px_0_#e2cfa4] transition active:translate-y-[2px] active:shadow-none"
              >
                {t.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 grid grid-cols-2 gap-3"
        >
          <button
            onClick={onRestart}
            className="font-display flex items-center justify-center gap-2 rounded-2xl bg-persimmon-500 py-3.5 text-lg text-white shadow-[0_6px_0_#b34a1b] transition active:translate-y-[2px] active:shadow-[0_4px_0_#b34a1b]"
          >
            <ArrowCounterClockwise size={20} weight="bold" />
            다시 빚기
          </button>
          <button
            onClick={onHome}
            className="font-display flex items-center justify-center gap-2 rounded-2xl border border-dough-300 bg-white py-3.5 text-lg text-charcoal-700 shadow-[0_6px_0_#e2cfa4] transition active:translate-y-[2px] active:shadow-[0_4px_0_#e2cfa4]"
          >
            <House size={20} weight="duotone" />
            처음으로
          </button>
        </motion.div>
      </div>

      <TeamModal team={openTeam} onClose={() => setOpenTeam(null)} />
    </div>
  );
}
