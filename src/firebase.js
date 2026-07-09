import { firebaseConfig, isFirebaseConfigured } from "./firebase-config";

let _db = null;
let _fs = null;

/** Firebase가 설정된 경우에만 lazy 초기화 */
async function ensureFirestore() {
  if (!isFirebaseConfigured) return null;
  if (_db) return { db: _db, fs: _fs };
  const [{ initializeApp }, fs] = await Promise.all([
    import("firebase/app"),
    import("firebase/firestore"),
  ]);
  _fs = fs;
  _db = fs.getFirestore(initializeApp(firebaseConfig));
  return { db: _db, fs: _fs };
}

/**
 * 원격 데이터 구독. Firebase 미설정이면 no-op.
 * @returns 구독 해제 함수
 */
export function subscribeGameData(onData, onFirstResult) {
  if (!isFirebaseConfigured) {
    onFirstResult?.();
    return () => {};
  }
  let unsub = () => {};
  let cancelled = false;
  ensureFirestore()
    .then(({ db, fs }) => {
      if (cancelled) return;
      const ref = fs.doc(db, "config", "gameData");
      let first = true;
      unsub = fs.onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) onData(snap.data());
          if (first) {
            first = false;
            onFirstResult?.();
          }
        },
        () => onFirstResult?.(), // 권한 오류 등 — 로컬 데이터로 진행
      );
    })
    .catch(() => onFirstResult?.());
  return () => {
    cancelled = true;
    unsub();
  };
}

/** 관리자 저장 — 전체 데이터를 원격 문서에 게시 */
export async function publishGameData(data) {
  const ctx = await ensureFirestore();
  if (!ctx) throw new Error("Firebase가 설정되지 않았습니다");
  const ref = ctx.fs.doc(ctx.db, "config", "gameData");
  await ctx.fs.setDoc(ref, data);
}

/* ---------- 게임 기록 (results 컬렉션) ---------- */

export async function submitResultRemote(result) {
  const ctx = await ensureFirestore();
  if (!ctx) throw new Error("Firebase가 설정되지 않았습니다");
  await ctx.fs.addDoc(ctx.fs.collection(ctx.db, "results"), result);
}

export async function fetchResultsRemote() {
  const ctx = await ensureFirestore();
  if (!ctx) throw new Error("Firebase가 설정되지 않았습니다");
  const snap = await ctx.fs.getDocs(ctx.fs.collection(ctx.db, "results"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteAllResultsRemote() {
  const ctx = await ensureFirestore();
  if (!ctx) throw new Error("Firebase가 설정되지 않았습니다");
  const snap = await ctx.fs.getDocs(ctx.fs.collection(ctx.db, "results"));
  await Promise.all(snap.docs.map((d) => ctx.fs.deleteDoc(d.ref)));
}

export { isFirebaseConfigured };
