"use client";
import { motion } from "framer-motion";

/**
 * 귀여운 만두 일러스트.
 * fill(0~1)에 따라 만두가 점점 통통해지고, done이면 김이 모락모락 난다.
 */
export default function Mandu({ fill = 0, done = false, shake = 0 }) {
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

      <motion.svg
        viewBox="0 0 240 190"
        className="w-full drop-shadow-[0_18px_24px_rgba(160,120,60,0.18)]"
        animate={
          shake
            ? { x: [0, -10, 10, -7, 7, -3, 0] }
            : { scale: plump, y: done ? [0, -4, 0] : 0 }
        }
        transition={
          shake
            ? { duration: 0.45 }
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
        {/* 볼터치 */}
        <ellipse cx="78" cy="128" rx="10" ry="6" fill="#f0b9a0" opacity="0.8" />
        <ellipse cx="162" cy="128" rx="10" ry="6" fill="#f0b9a0" opacity="0.8" />
        {/* 눈 */}
        {done ? (
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
        {/* 입 */}
        <path
          d={done ? "M112 132 q8 10 16 0" : "M114 132 q6 6 12 0"}
          stroke="#423d38"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
      </motion.svg>
    </div>
  );
}
