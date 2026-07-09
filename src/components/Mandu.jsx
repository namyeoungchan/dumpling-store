"use client";
import { motion, AnimatePresence } from "framer-motion";

/** 재료를 먹을 때 터지는 반짝이 파티클 */
function Sparkles({ burst }) {
  if (!burst) return null;
  const colors = ["#e2703a", "#c9a86a", "#5e7d4f", "#f0b9a0", "#e2cfa4"];
  return (
    <div
      key={burst}
      className="pointer-events-none absolute left-1/2 top-[52%] z-10"
    >
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const dist = 70 + (i % 3) * 22;
        return (
          <motion.span
            key={`${burst}-${i}`}
            className="absolute block"
            style={{
              width: i % 2 ? 8 : 12,
              height: i % 2 ? 8 : 12,
              borderRadius: i % 3 === 0 ? "2px" : "999px",
              background: colors[i % colors.length],
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist * 0.75,
              scale: [0, 1.2, 0.9],
              opacity: [1, 1, 0],
              rotate: i % 2 ? 180 : -140,
            }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

/**
 * 귀여운 만두 일러스트.
 * fill(0~1)에 따라 통통해지고, eating이면 오물오물 + 반짝이,
 * done이면 김이 모락모락 난다.
 */
export default function Mandu({
  fill = 0,
  done = false,
  shake = 0,
  eating = false,
  burst = 0,
}) {
  const plump = 1 + fill * 0.12;

  return (
    <div className="relative mx-auto w-full max-w-[280px] select-none">
      {/* 김 (완성 시) */}
      {done && (
        <div className="pointer-events-none absolute -top-10 left-1/2 flex -translate-x-1/2 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="steam h-10 w-2.5 rounded-full bg-white/80 blur-[3px]"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </div>
      )}

      {/* 냠! 말풍선 */}
      <AnimatePresence>
        {eating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4, y: 10, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: -8 }}
            exit={{ opacity: 0, scale: 0.6, y: -14 }}
            transition={{ type: "spring", stiffness: 320, damping: 16 }}
            className="font-display pointer-events-none absolute -top-4 right-2 z-10 rounded-2xl bg-persimmon-500 px-4 py-1.5 text-xl text-white shadow-[0_4px_0_#b34a1b]"
          >
            냠!
          </motion.div>
        )}
      </AnimatePresence>

      <Sparkles burst={burst} />

      <motion.svg
        viewBox="0 0 240 190"
        className="w-full drop-shadow-[0_18px_24px_rgba(160,120,60,0.18)]"
        animate={
          shake
            ? { x: [0, -10, 10, -7, 7, -3, 0] }
            : eating
              ? {
                  scale: [plump, plump * 1.1, plump * 0.88, plump * 1.04, plump],
                  y: [0, -10, 4, -2, 0],
                  rotate: [0, -3, 3, -1, 0],
                }
              : { scale: plump, y: done ? [0, -4, 0] : 0 }
        }
        transition={
          shake
            ? { duration: 0.45 }
            : eating
              ? { duration: 0.65, times: [0, 0.25, 0.55, 0.8, 1] }
              : done
                ? { y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" } }
                : { type: "spring", stiffness: 120, damping: 14 }
        }
        key={shake} /* shake 값이 바뀔 때마다 재생 */
      >
        {/* 접시 */}
        <ellipse cx="120" cy="168" rx="96" ry="14" fill="#e9dcc4" />
        <ellipse cx="120" cy="164" rx="96" ry="14" fill="#f3ebdc" />

        {/* 만두 몸통 */}
        <path
          d="M28 132 C28 84 68 52 120 52 C172 52 212 84 212 132 C212 152 172 160 120 160 C68 160 28 152 28 132 Z"
          fill="#f5ecd7"
          stroke="#c9a86a"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* 만두 주름 */}
        <path
          d="M40 108 Q56 76 76 96 M76 96 Q88 66 104 92 M104 92 Q118 62 136 92 M136 92 Q152 66 164 96 M164 96 Q184 76 200 108"
          fill="none"
          stroke="#c9a86a"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* 볼터치 — 먹을 때 더 발그레 */}
        <ellipse
          cx="78"
          cy="128"
          rx={eating ? 12 : 10}
          ry={eating ? 7 : 6}
          fill="#f0b9a0"
          opacity={eating ? 1 : 0.8}
        />
        <ellipse
          cx="162"
          cy="128"
          rx={eating ? 12 : 10}
          ry={eating ? 7 : 6}
          fill="#f0b9a0"
          opacity={eating ? 1 : 0.8}
        />
        {/* 눈 */}
        {done || eating ? (
          <>
            <path
              d="M92 116 q8 8 16 0"
              stroke="#423d38"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M132 116 q8 8 16 0"
              stroke="#423d38"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <circle cx="100" cy="118" r="5.5" fill="#423d38" />
            <circle cx="140" cy="118" r="5.5" fill="#423d38" />
          </>
        )}
        {/* 입 — 먹을 때 크게 벌림 */}
        {eating ? (
          <ellipse
            cx="120"
            cy="136"
            rx="11"
            ry="9"
            fill="#7a4a35"
            stroke="#423d38"
            strokeWidth="3.5"
          />
        ) : (
          <path
            d={done ? "M112 132 q8 10 16 0" : "M114 132 q6 6 12 0"}
            stroke="#423d38"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </motion.svg>
    </div>
  );
}
