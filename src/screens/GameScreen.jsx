"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import Mandu from "../components/Mandu";
import TeamModal from "../components/TeamModal";
import { useData } from "../store";

function shuffle(arr, seed) {
  // 시드 기반 셔플 — 게임 한 판 동안 순서 고정
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GameScreen({ onExit, onComplete }) {
  const { data } = useData();
  const [seed] = useState(() => Math.floor(Math.random() * 233280));
  const [foundIds, setFoundIds] = useState([]);
  const [wrongPicks, setWrongPicks] = useState([]);
  const [missCount, setMissCount] = useState(0);
  const [shake, setShake] = useState(0);
  const [openTeam, setOpenTeam] = useState(null);
  const [toast, setToast] = useState(null);

  const chips = useMemo(() => {
    const real = data.teams.map((t) => ({
      key: t.id,
      label: t.name,
      team: t,
    }));
    const fake = data.decoys.map((d, i) => ({
      key: `decoy-${i}`,
      label: d,
      team: null,
    }));
    return shuffle([...real, ...fake], seed);
  }, [data, seed]);

  const total = data.teams.length;
  const found = foundIds.length;
  const progress = total === 0 ? 0 : found / total;

  const pick = (chip) => {
    if (chip.team) {
      if (foundIds.includes(chip.key)) return;
      const next = [...foundIds, chip.key];
      setFoundIds(next);
      setOpenTeam(chip.team);
    } else {
      if (wrongPicks.includes(chip.key)) return;
      setWrongPicks((w) => [...w, chip.key]);
      setMissCount((c) => c + 1);
      setShake((s) => s + 1);
      setToast(`"${chip.label}"은(는) 우리 만두 재료가 아니에요!`);
      setTimeout(() => setToast(null), 1800);
    }
  };

  const closeModal = () => {
    setOpenTeam(null);
    if (found === total && total > 0) {
      setTimeout(() => onComplete({ missCount }), 350);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col pb-8">
      {/* 상단 바 */}
      <header className="sticky top-0 z-30 bg-cream-100/80 px-4 pb-2 pt-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button
            onClick={onExit}
            aria-label="처음으로"
            className="rounded-full p-2 text-charcoal-600 transition hover:bg-cream-200 active:scale-95"
          >
            <ArrowLeft size={22} weight="bold" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-lg leading-none text-charcoal-800">
              「{data.manduName}」 만두
            </p>
            <p className="mt-1 text-xs text-charcoal-600/70">
              진짜 속재료를 모두 찾아 주세요
            </p>
          </div>
          <div className="font-display rounded-full bg-dough-200 px-3 py-1.5 text-sm text-persimmon-600">
            {found} / {total}
          </div>
        </div>
        {/* 진행 바 */}
        <div className="mx-auto mt-3 h-2 max-w-lg overflow-hidden rounded-full bg-dough-200">
          <motion.div
            className="h-full rounded-full bg-persimmon-500"
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5">
        <div className="mt-4">
          <Mandu fill={progress} shake={shake} />
        </div>

        {/* 찾은 재료 뱃지 */}
        <div className="mt-2 flex min-h-8 flex-wrap justify-center gap-1.5">
          <AnimatePresence>
            {data.teams
              .filter((t) => foundIds.includes(t.id))
              .map((t) => (
                <motion.button
                  key={t.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setOpenTeam(t)}
                  className="flex items-center gap-1 rounded-full bg-leaf-500/10 px-2.5 py-1 text-xs font-semibold text-leaf-600 active:scale-95"
                >
                  <CheckCircle size={14} weight="fill" />
                  {t.name}
                </motion.button>
              ))}
          </AnimatePresence>
        </div>

        {/* 재료 선반 */}
        <section className="mt-5">
          <h2 className="font-display mb-3 text-charcoal-600">
            속재료 선반{" "}
            <span className="text-sm font-normal text-charcoal-600/60">
              — 눌러서 만두에 담기
            </span>
          </h2>
          <motion.div
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {chips.map((chip) => {
              const isFound = chip.team && foundIds.includes(chip.key);
              const isWrong = wrongPicks.includes(chip.key);
              const disabled = isFound || isWrong;
              return (
                <motion.button
                  key={chip.key}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 140, damping: 16 }}
                  onClick={() => pick(chip)}
                  disabled={disabled}
                  className={[
                    "font-display relative rounded-2xl border px-3 py-4 text-center text-[15px] leading-snug transition",
                    isFound
                      ? "border-leaf-500/40 bg-leaf-500/10 text-leaf-600"
                      : isWrong
                        ? "border-dough-200 bg-cream-200 text-charcoal-600/35 line-through decoration-2"
                        : "border-dough-300 bg-white text-charcoal-700 shadow-[0_4px_0_#e2cfa4] active:translate-y-[2px] active:shadow-[0_2px_0_#e2cfa4]",
                  ].join(" ")}
                >
                  {chip.label}
                  {isFound && (
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="absolute right-2 top-2 text-leaf-500"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
          {missCount > 0 && (
            <p className="mt-3 text-center text-xs text-charcoal-600/50">
              헛손질 {missCount}번 — 괜찮아요, 만두는 관대합니다
            </p>
          )}
        </section>
      </main>

      {/* 오답 토스트 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-charcoal-800 px-4 py-3 text-center text-sm font-medium text-cream-50 shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <TeamModal team={openTeam} onClose={closeModal} />
    </div>
  );
}
