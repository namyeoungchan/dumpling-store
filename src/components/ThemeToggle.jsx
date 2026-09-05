"use client";
import { AnimatePresence, motion } from "framer-motion";
import { MoonStars, Sun } from "@phosphor-icons/react";
import { useTheme } from "../theme";

/** 라이트 ↔ 다크 전환 버튼 (관리자 톱니와 같은 결) */
export default function ThemeToggle({ className = "" }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "밝은 모드로 바꾸기" : "어두운 모드로 바꾸기"}
      title={isDark ? "밝은 모드" : "어두운 모드"}
      className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-dough-400 transition hover:bg-cream-200 hover:text-charcoal-600 active:scale-95 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <MoonStars size={22} weight="duotone" />
          ) : (
            <Sun size={22} weight="duotone" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
