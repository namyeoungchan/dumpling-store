// 직책 라벨 색 팔레트 — 관리자에서 팀원마다 선택
export const ROLE_COLORS = {
  leaf: { label: "초록", bg: "rgba(94, 125, 79, 0.12)", text: "#4c6740" },
  persimmon: { label: "주황", bg: "rgba(208, 90, 36, 0.12)", text: "#b34a1b" },
  gold: { label: "황금", bg: "rgba(201, 168, 106, 0.2)", text: "#8a6d3b" },
  blue: { label: "파랑", bg: "rgba(91, 127, 166, 0.14)", text: "#46647f" },
  rose: { label: "장미", bg: "rgba(176, 90, 110, 0.13)", text: "#96485c" },
  charcoal: { label: "차콜", bg: "rgba(66, 61, 56, 0.1)", text: "#57504a" },
};

export const ROLE_COLOR_KEYS = Object.keys(ROLE_COLORS);
export const DEFAULT_ROLE_COLOR = "leaf";

export function roleStyle(key) {
  const c = ROLE_COLORS[key] ?? ROLE_COLORS[DEFAULT_ROLE_COLOR];
  return { backgroundColor: c.bg, color: c.text };
}
