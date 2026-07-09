"use client";
import { motion } from "framer-motion";
import { GearSix, Play } from "@phosphor-icons/react";
import Mandu from "../components/Mandu";
import { useData } from "../store";

export default function HomeScreen({ onStart, onAdmin }) {
  const { data } = useData();

  return (
    <div className="relative flex min-h-[100dvh] flex-col px-6 pb-10 pt-6">
      {/* 관리자 진입 — 우상단에 조용히 */}
      <div className="flex justify-end">
        <button
          onClick={onAdmin}
          aria-label="관리자"
          className="rounded-full p-2.5 text-dough-400 transition hover:bg-cream-200 hover:text-charcoal-600 active:scale-95"
        >
          <GearSix size={22} weight="duotone" />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
        >
          <p className="font-display text-lg text-persimmon-500">
            어서오세요,
          </p>
          <h1 className="font-display text-[2.6rem] leading-[1.05] tracking-tight text-charcoal-800">
            {data.shopName}
            <br />
            만두가게
          </h1>
          <p className="mt-3 max-w-[34ch] leading-relaxed text-charcoal-600">
            오늘의 특제 만두는{" "}
            <span className="whitespace-nowrap font-semibold text-persimmon-600">
              「{data.manduName}」
            </span>
            <br />
            진짜 <span className="whitespace-nowrap">속재료(팀명)</span>만 골라
            담아 만두를 <span className="whitespace-nowrap">완성해 주세요!</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 90, damping: 14 }}
          className="mt-8"
        >
          <Mandu fill={0.4} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={onStart}
            className="font-display flex w-full items-center justify-center gap-2 rounded-2xl bg-persimmon-500 py-4 text-xl text-white shadow-[0_8px_0_#b34a1b] transition active:translate-y-[3px] active:shadow-[0_5px_0_#b34a1b]"
          >
            <Play size={22} weight="fill" />
            만두 빚으러 가기
          </button>
          <p className="mt-3 text-center text-xs text-charcoal-600/60">
            속재료 {data.teams.length}가지를 모두 찾으면 만두가 완성됩니다
          </p>
        </motion.div>
      </div>
    </div>
  );
}
