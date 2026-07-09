# 타임교육 만두가게 — 현장지원 본부 만두 빚기

가짜 재료 사이에서 진짜 속재료(팀명)를 모두 골라 「현장지원 본부」 만두를 완성하는 웹게임입니다.
정답을 맞추면 해당 팀의 소개와 팀원이 나오고, 전부 찾으면 만두가 완성됩니다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 배포용 빌드 → dist/ 폴더
```

`dist/` 폴더를 Netlify, Vercel, GitHub Pages 등 아무 정적 호스팅에 올리면
스마트폰에서도 바로 플레이할 수 있습니다 (반응형 지원).

## 관리자 모드

- 첫 화면 오른쪽 위 톱니바퀴 아이콘 → PIN 입력 (기본값 **1234**, 관리자 화면에서 변경 가능)
- 수정할 수 있는 것:
  - 만두가게 이름 / 만두 이름(본부명)
  - 팀(정답 속재료): 팀명, 슬로건, 팀 소개, 팀원(이름·직책·한 줄 소개)
  - 가짜 재료(오답 함정)
  - 관리자 PIN

## 수정 내용을 모두에게 반영하기 — Firebase 실시간 연동

`src/firebase-config.js`에 Firebase 설정값을 넣으면, 관리자가
**"저장하고 모두에게 반영하기"** 버튼을 눌렀을 때 게임에 접속한 모든 사람에게
즉시 반영됩니다.

### Firebase 설정 방법 (약 5분, 무료)

1. https://console.firebase.google.com 접속 → **프로젝트 추가** (이름 아무거나, 애널리틱스 꺼도 됨)
2. 왼쪽 메뉴 **빌드 > Firestore Database > 데이터베이스 만들기**
   - 위치: `asia-northeast3 (서울)` 권장, **프로덕션 모드**로 시작
3. **규칙** 탭에서 아래 규칙을 붙여넣고 게시:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /config/gameData {
         allow read, write: if true;
       }
       match /results/{resultId} {
         allow read, write: if true;
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
4. **프로젝트 설정(톱니바퀴) > 내 앱 > 웹 앱 추가(`</>`)** → 등록 후 나오는
   `firebaseConfig` 값을 복사
5. 이 저장소의 `src/firebase-config.js`에 값을 붙여넣고 커밋·푸시 → 자동 재배포

> 참고: 위 규칙은 게임 데이터 문서 하나만 누구나 읽고 쓸 수 있게 엽니다.
> 사내 이벤트용으로는 충분하지만, 관리자 PIN은 화면 잠금일 뿐 보안 장치는
> 아니라는 점을 알아두세요.

### Firebase 없이 쓰는 경우 (설정값이 비어 있을 때)

관리자 수정 내용은 그 기기의 브라우저에만 저장되며, 관리자 화면의
**"게임 공유 링크 복사"** 버튼으로 만든 링크(데이터가 주소에 담김)를
공유하는 방식으로 동작합니다.
