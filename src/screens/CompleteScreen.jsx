"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowCounterClockwise, House, Trophy } from "@phosphor-icons/react";
import Mandu from "../components/Mandu";
import TeamModal from "../components/TeamModal";
import { useData } from "../store";
import {
  submitResult,
  fetchResults,
  scoreOf,
  rankOf,
  fmtTime,
  MISS_PENALTY_SEC,
} from "../results";

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

export default function CompleteScreen({
  player,
  result = { missCount: 0, timeMs: 0 },
  onRestart,
  onHome,
}) {
  const { data } = useData();
  const [openTeam, setOpenTeam] = useState(null);
  const [rankInfo, setRankInfo] = useState(null); // {rank, total} | "error"
  const submitted = useRef(false);
  const missCount = result.missCount;
  const record = {
    affiliation: player?.affiliation ?? "",
    name: player?.name ?? "",
    timeMs: result.timeMs,
    missCount: result.missCount,
  };

  // 기록 저장 (1회) 후 내 순위 조회
  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;
    const stamped = { ...record, createdAt: Date.now() };
    submitResult(stamped)
      .then(fetchResults)
      .then((all) =>
        setRankInfo({ rank: rankOf(stamped, all), total: all.length }),
      )
      .catch(() => setRankInfo("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            {player?.name ? `${player.name}님, ` : ""}모든 속재료를
            찾았습니다{missCount === 0 ? " — 한 번에!" : ""}
          </p>
        </motion.div>

        {/* 기록 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-5 rounded-2xl border border-dough-300 bg-white/70 px-4 py-3.5"
        >
          <div className="grid grid-cols-3 divide-x divide-dough-200 text-center">
            <div>
              <p className="text-[11px] font-medium text-charcoal-600/60">
                걸린 시간
              </p>
              <p className="mt-0.5 font-mono text-lg font-bold text-charcoal-800">
                {fmtTime(result.timeMs)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-charcoal-600/60">
                헛손질
              </p>
              <p className="mt-0.5 font-mono text-lg font-bold text-charcoal-800">
                {missCount}회
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-charcoal-600/60">
                최종 기록
              </p>
              <p className="mt-0.5 font-mono text-lg font-bold text-persimmon-600">
                {scoreOf(record)}초
              </p>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-charcoal-600/50">
            기록 = 시간(초) + 헛손질 × {MISS_PENALTY_SEC}초
          </p>
          <div className="mt-2 border-t border-dough-200 pt-2 text-center">
            {rankInfo === null && (
              <p className="text-sm text-charcoal-600/60">순위 집계 중...</p>
            )}
            {rankInfo === "error" && (
              <p className="text-sm text-charcoal-600/60">
                기록 저장에 실패했어요 (순위 제외)
              </p>
            )}
            {rankInfo && rankInfo !== "error" && (
              <p className="font-display flex items-center justify-center gap-1.5 text-lg text-leaf-600">
                <Trophy size={20} weight="duotone" />
                지금까지 {rankInfo.total}명 중 {rankInfo.rank}위!
              </p>
            )}
          </div>
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
