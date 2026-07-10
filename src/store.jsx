import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_DATA, STORAGE_KEY } from "./data/defaults";
import {
  isFirebaseConfigured,
  subscribeGameData,
  publishGameData,
} from "./firebase";

const DataContext = createContext(null);

/* ---------- 직렬화: 공유 링크용 base64(유니코드 안전) ---------- */
export function encodeData(data) {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeData(str) {
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (!parsed || !Array.isArray(parsed.teams)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function sanitize(raw) {
  const d = { ...DEFAULT_DATA, ...raw };
  d.teams = (raw.teams ?? DEFAULT_DATA.teams).map((t, i) => ({
    id: t.id || `team-${i}-${Math.random().toString(36).slice(2, 7)}`,
    name: t.name ?? "",
    tagline: t.tagline ?? "",
    description: t.description ?? "",
    members: (t.members ?? []).map((m, j) => ({
      id: m.id || `m-${i}-${j}-${Math.random().toString(36).slice(2, 7)}`,
      name: m.name ?? "",
      role: m.role ?? "",
      note: m.note ?? "",
      photo: m.photo ?? "",
      roleColor: m.roleColor ?? "leaf",
    })),
  }));
  d.decoys = (raw.decoys ?? DEFAULT_DATA.decoys).filter(
    (x) => typeof x === "string",
  );
  return d;
}

function loadInitial() {
  // 1) 공유 링크(?d=...)가 있으면 그것을 최우선으로 적용하고 저장
  const params = new URLSearchParams(window.location.search);
  const shared = params.get("d");
  if (shared) {
    const decoded = decodeData(shared);
    if (decoded) {
      const clean = sanitize(decoded);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      } catch {
        /* 저장 실패해도 게임은 진행 */
      }
      // 주소창을 깔끔하게 정리
      window.history.replaceState(null, "", window.location.pathname);
      return clean;
    }
  }
  // 2) 로컬 저장본
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return sanitize(JSON.parse(saved));
  } catch {
    /* 손상된 저장본은 무시 */
  }
  // 3) 기본값
  return sanitize(DEFAULT_DATA);
}

export function DataProvider({ children }) {
  const [data, setData] = useState(loadInitial);
  // Firebase 사용 시 첫 원격 응답을 받기 전까지 로딩 표시
  const [cloudReady, setCloudReady] = useState(!isFirebaseConfigured);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* 사파리 시크릿 모드 등에서 실패 가능 — 무시 */
    }
  }, [data]);

  // 원격(Firestore) 데이터 구독 — 관리자가 게시하면 모든 접속자에게 반영
  useEffect(() => {
    const unsub = subscribeGameData(
      (remote) => setData(sanitize(remote)),
      () => setCloudReady(true),
    );
    return unsub;
  }, []);

  const api = useMemo(
    () => ({
      data,
      setData: (next) =>
        setData((prev) =>
          sanitize(typeof next === "function" ? next(prev) : next),
        ),
      resetToDefaults: () => setData(sanitize(DEFAULT_DATA)),
      cloud: {
        enabled: isFirebaseConfigured,
        ready: cloudReady,
        publish: () => publishGameData(data),
      },
    }),
    [data, cloudReady],
  );

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
