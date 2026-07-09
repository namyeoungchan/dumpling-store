// ─────────────────────────────────────────────────────────────
// Firebase 연동 설정
//
// 1) https://console.firebase.google.com 에서 프로젝트 생성
// 2) 빌드 > Firestore Database > 데이터베이스 만들기
// 3) 프로젝트 설정(톱니바퀴) > 내 앱 > 웹 앱 추가 > SDK 구성값 복사
// 4) 아래 값들을 채워 넣고 커밋하면 실시간 연동이 켜집니다.
//
// 값이 비어 있으면 자동으로 기존 방식(기기별 저장 + 공유 링크)으로
// 동작하므로, 비워 두어도 게임은 정상 작동합니다.
// ─────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey: "AIzaSyBhJHjJ9XY17XVXFJObOmv_YdXt-d_nBb0",
  authDomain: "dumpling-d64d3.firebaseapp.com",
  projectId: "dumpling-d64d3",
  storageBucket: "dumpling-d64d3.firebasestorage.app",
  messagingSenderId: "370727172119",
  appId: "1:370727172119:web:ee157211107be7e2a6c452",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);
