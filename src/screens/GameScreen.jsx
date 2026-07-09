"use client";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Timer } from "@phosphor-icons/react";
import { fmtTime } from "../results";

/** 진행 시간 배지 — 매초 갱신이 게임 화면 전체를 리렌더하지 않도록 격리 */
const TimerBadge = memo(function TimerBadge({ startAt }) {
  const [now, setNow] = useState(startAt);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="flex items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1.5 font-mono text-sm font-semibold text-charcoal-600">
      <Timer size={15} weight="bold" />
      {fmtTime(now - startAt)}
    </span>
  );
});
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
  const [startAt] = useState(() => Date.now());
  const [foundIds, setFoundIds] = useState([]);
  const [wrongPicks, setWrongPicks] = useState([]);
  const [missCount, setMissCount] = useState(0);
  const [shake, setShake] = useState(0);
  const [openTeam, setOpenTeam] = useState(null);
  const [toast, setToast] = useState(null);
  // 재료 먹기 연출: 날아가는 재료 → 냠냠 + 반짝이 → 팀 소개
  const [flying, setFlying] = useState(null); // {label, from:{x,y}, to:{x,y}}
  const [eating, setEating] = useState(false);
  const [eatBurst, setEatBurst] = useState(0);
  const manduRef = useRef(null);
  const pendingTeam = useRef(null);

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

  const pick = (chip, e) => {
    if (chip.team) {
      if (foundIds.includes(chip.key) || flying || eating) return;
      setFoundIds((f) => [...f, chip.key]);
      pendingTeam.current = chip.team;
      // 1) 재료가 만두를 향해 날아간다 (만두가 화면 밖이면 먼저 스크롤)
      const el = e.currentTarget;
      const beginFly = () => {
        const rect = el.getBoundingClientRect();
        const m = manduRef.current?.getBoundingClientRect();
        const from = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const to = m
          ? { x: m.left + m.width / 2, y: m.top + m.height * 0.6 }
          : from;
        setFlying({ label: chip.label, from, to });
      };
      const m = manduRef.current?.getBoundingClientRect();
      const manduVisible =
        m && m.top >= 60 && m.bottom <= window.innerHeight * 0.95;
      if (manduVisible) {
        beginFly();
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(beginFly, 400);
      }
    } else {
      if (wrongPicks.includes(chip.key)) return;
      setWrongPicks((w) => [...w, chip.key]);
      setMissCount((c) => c + 1);
      setShake((s) => s + 1);
      setToast(`"${chip.label}"은(는) 우리 만두 재료가 아니에요!`);
      setTimeout(() => setToast(null), 1800);
    }
  };

  // 2) 도착하면 만두가 냠냠 + 반짝이, 3) 그 다음 팀 소개
  const onFlyArrive = () => {
    setFlying(null);
    setEating(true);
    setEatBurst((b) => b + 1);
    setTimeout(() => {
      setEating(false);
      setOpenTeam(pendingTeam.current);
      pendingTeam.current = null;
    }, 700);
  };

  const closeModal = () => {
    setOpenTeam(null);
    if (found === total && total > 0) {
      const timeMs = Date.now() - startAt;
      setTimeout(() => onComplete({ missCount, timeMs }), 350);
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
          <TimerBadge startAt={startAt} />
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
        <div className="mt-4" ref={manduRef}>
          <Mandu
            fill={progress}
            shake={shake}
            eating={eating}
            burst={eatBurst}
          />
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
                  onClick={(e) => pick(chip, e)}
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

      {/* 날아가는 재료 */}
      <AnimatePresence>
        {flying && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-50"
            initial={{ x: flying.from.x, y: flying.from.y, scale: 1 }}
            animate={{
              x: flying.to.x,
              y: [flying.from.y, flying.to.y - 90, flying.to.y],
              scale: [1, 1.15, 0.35],
              rotate: [0, -12, 8],
            }}
            transition={{ duration: 0.55, ease: [0.3, 0, 0.4, 1] }}
            onAnimationComplete={onFlyArrive}
          >
            <span className="font-display block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-leaf-500 px-4 py-2 text-sm text-white shadow-lg">
              {flying.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
