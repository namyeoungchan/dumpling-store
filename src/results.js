// 게임 기록 저장/조회 — Firebase 설정 시 Firestore, 아니면 이 기기(localStorage)에만 저장
import {
  isFirebaseConfigured,
  submitResultRemote,
  fetchResultsRemote,
  deleteAllResultsRemote,
} from "./firebase";

const LOCAL_KEY = "mando-results-v1";

function localGet() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) ?? [];
  } catch {
    return [];
  }
}

export async function submitResult(record) {
  if (isFirebaseConfigured) return submitResultRemote(record);
  const all = localGet();
  all.push({ ...record, id: `local-${Date.now()}` });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
}

export async function fetchResults() {
  if (isFirebaseConfigured) return fetchResultsRemote();
  return localGet();
}

export async function clearResults() {
  if (isFirebaseConfigured) return deleteAllResultsRemote();
  localStorage.removeItem(LOCAL_KEY);
}

/** 기록 점수(초) = 걸린 시간(초) + 헛손질 1회당 10초 패널티. 낮을수록 좋음 */
export const MISS_PENALTY_SEC = 10;

export function scoreOf(r) {
  return Math.round((r.timeMs ?? 0) / 1000) + (r.missCount ?? 0) * MISS_PENALTY_SEC;
}

/** 점수 오름차순 → 시간 → 먼저 플레이한 순 */
export function rankSort(list) {
  return [...list].sort(
    (a, b) =>
      scoreOf(a) - scoreOf(b) ||
      (a.timeMs ?? 0) - (b.timeMs ?? 0) ||
      (a.createdAt ?? 0) - (b.createdAt ?? 0),
  );
}

/** 나보다 좋은 기록 수 + 1 = 내 순위 */
export function rankOf(record, list) {
  const my = scoreOf(record);
  return (
    list.filter(
      (r) =>
        scoreOf(r) < my ||
        (scoreOf(r) === my && (r.timeMs ?? 0) < (record.timeMs ?? 0)),
    ).length + 1
  );
}

export function fmtTime(ms) {
  const s = Math.floor((ms ?? 0) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
