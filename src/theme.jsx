"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const THEME_KEY = "mandu-theme"; // "light" | "dark"
const ThemeContext = createContext(null);

/** 브라우저 주소창 색까지 모드에 맞춰 바꿔줌 */
const BAR_COLOR = { light: "#faf6ef", dark: "#1c1814" };

export function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", BAR_COLOR[theme] ?? BAR_COLOR.light);
}

/** 저장값 → 없으면 OS 설정 */
export function resolveInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* 프라이빗 모드 등에서 접근 실패해도 무시 */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  // index.html의 사전 스크립트가 이미 클래스를 붙여둠 — 그 상태를 그대로 읽어옴
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // 사용자가 직접 고르기 전까지는 OS 설정 변화를 따라감
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e) => {
      let saved = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch {
        /* 무시 */
      }
      if (!saved) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* 저장 실패해도 이번 세션은 정상 동작 */
      }
      // 첫 전환부터 배경색이 부드럽게 넘어가도록
      document.documentElement.classList.add("theme-anim");
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", toggle, setTheme }),
    [theme, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme는 ThemeProvider 안에서만 사용하세요");
  return ctx;
}
