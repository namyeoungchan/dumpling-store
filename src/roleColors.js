// 직책 라벨 색 팔레트 — 관리자에서 팀원마다 선택
export const ROLE_COLORS = {
  leaf: { label: "초록", bg: "var(--role-leaf-bg)", text: "var(--role-leaf-text)" },
  persimmon: { label: "주황", bg: "var(--role-persimmon-bg)", text: "var(--role-persimmon-text)" },
  gold: { label: "황금", bg: "var(--role-gold-bg)", text: "var(--role-gold-text)" },
  blue: { label: "파랑", bg: "var(--role-blue-bg)", text: "var(--role-blue-text)" },
  rose: { label: "장미", bg: "var(--role-rose-bg)", text: "var(--role-rose-text)" },
  charcoal: { label: "차콜", bg: "var(--role-charcoal-bg)", text: "var(--role-charcoal-text)" },
};

export const ROLE_COLOR_KEYS = Object.keys(ROLE_COLORS);
export const DEFAULT_ROLE_COLOR = "leaf";

export function roleStyle(key) {
  const c = ROLE_COLORS[key] ?? ROLE_COLORS[DEFAULT_ROLE_COLOR];
  return { backgroundColor: c.bg, color: c.text };
}
