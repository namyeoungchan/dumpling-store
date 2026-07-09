"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "@phosphor-icons/react";

const PLAYER_KEY = "mando-player-v1";

export function loadPlayer() {
  try {
    return JSON.parse(localStorage.getItem(PLAYER_KEY)) ?? null;
  } catch {
    return null;
  }
}

/** 게임 시작 전 참가자 정보(소속·이름) 입력 */
export default function PlayerScreen({ onSubmit, onBack }) {
  const saved = loadPlayer();
  const [affiliation, setAffiliation] = useState(saved?.affiliation ?? "");
  const [name, setName] = useState(saved?.name ?? "");
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!affiliation.trim()) next.affiliation = "소속을 입력해 주세요";
    if (!name.trim()) next.name = "이름을 입력해 주세요";
    setErrors(next);
    if (Object.keys(next).length) return;
    const player = { affiliation: affiliation.trim(), name: name.trim() };
    try {
      localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
    } catch {
      /* 저장 실패해도 진행 */
    }
    onSubmit(player);
  };

  const field =
    "w-full rounded-xl border bg-white px-3.5 py-3 text-[16px] text-charcoal-800 outline-none transition placeholder:text-charcoal-600/30 focus:ring-2";

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pb-10 pt-6">
      <div>
        <button
          onClick={onBack}
          aria-label="뒤로"
          className="-ml-2 rounded-full p-2 text-charcoal-600 transition hover:bg-cream-200 active:scale-95"
        >
          <ArrowLeft size={22} weight="bold" />
        </button>
      </div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 16 }}
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center"
      >
        <p className="font-display text-lg text-persimmon-500">
          만두 빚기 전에,
        </p>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-charcoal-800">
          누구신지 알려주세요
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-600/80">
          걸린 시간과 헛손질 횟수로 순위가 매겨져요.
          <br />
          기록은 순위표에만 사용됩니다.
        </p>

        <div className="mt-8 space-y-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-charcoal-700">
              소속
            </span>
            <input
              value={affiliation}
              onChange={(e) => {
                setAffiliation(e.target.value);
                setErrors((x) => ({ ...x, affiliation: undefined }));
              }}
              placeholder="예: 교육기획팀"
              className={`${field} ${
                errors.affiliation
                  ? "border-persimmon-500 focus:ring-persimmon-400/25"
                  : "border-dough-300 focus:border-persimmon-400 focus:ring-persimmon-400/20"
              }`}
            />
            {errors.affiliation && (
              <span className="text-xs font-medium text-persimmon-600">
                {errors.affiliation}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-charcoal-700">
              이름
            </span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((x) => ({ ...x, name: undefined }));
              }}
              placeholder="예: 김만두"
              className={`${field} ${
                errors.name
                  ? "border-persimmon-500 focus:ring-persimmon-400/25"
                  : "border-dough-300 focus:border-persimmon-400 focus:ring-persimmon-400/20"
              }`}
            />
            {errors.name && (
              <span className="text-xs font-medium text-persimmon-600">
                {errors.name}
              </span>
            )}
          </label>
        </div>

        <button
          type="submit"
          className="font-display mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-persimmon-500 py-4 text-xl text-white shadow-[0_8px_0_#b34a1b] transition active:translate-y-[3px] active:shadow-[0_5px_0_#b34a1b]"
        >
          <Play size={22} weight="fill" />
          시작! (타이머가 돌아가요)
        </button>
      </motion.form>
    </div>
  );
}
