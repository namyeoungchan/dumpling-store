// 사진이 없는 팀원의 기본 프로필 — 이름에 따라 표정과 색이 달라지는 미니 만두
const SKINS = [
  { bg: "#f6ead9", body: "#f5ecd7", line: "#c9a86a" },
  { bg: "#eaf0e2", body: "#f2f5e8", line: "#93a67c" },
  { bg: "#fbe8dd", body: "#faf0e4", line: "#d99a6e" },
  { bg: "#eee9f5", body: "#f5f1f8", line: "#a294b8" },
  { bg: "#e5eff2", body: "#f0f6f7", line: "#84a7b0" },
  { bg: "#f9e9ec", body: "#f9f0f1", line: "#c98a97" },
];

function hashOf(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function ManduAvatar({ seed = "", className = "" }) {
  const h = hashOf(String(seed) || "mandu");
  const skin = SKINS[h % SKINS.length];
  const face = h % 3; // 0: 초롱초롱, 1: 방긋, 2: 윙크
  const flip = h % 2 === 1;

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ backgroundColor: skin.bg }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-[82%] w-[82%] translate-y-[8%]">
        {/* 몸통 */}
        <path
          d="M6 32 C6 20 14 13 24 13 C34 13 42 20 42 32 C42 37 34 39 24 39 C14 39 6 37 6 32 Z"
          fill={skin.body}
          stroke={skin.line}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* 주름 */}
        <path
          d="M10 27 Q14 20 18 24 M18 24 Q21 17 24 23 M24 23 Q27 17 30 24 M30 24 Q34 20 38 27"
          fill="none"
          stroke={skin.line}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* 볼터치 */}
        <ellipse cx="14.5" cy="31" rx="3" ry="1.9" fill="#f0b9a0" opacity="0.85" />
        <ellipse cx="33.5" cy="31" rx="3" ry="1.9" fill="#f0b9a0" opacity="0.85" />
        {/* 표정 */}
        {face === 0 && (
          <>
            <circle cx="19" cy="28.5" r="1.9" fill="#423d38" />
            <circle cx="29" cy="28.5" r="1.9" fill="#423d38" />
            <path d="M22 33 q2 2 4 0" stroke="#423d38" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </>
        )}
        {face === 1 && (
          <>
            <path d="M16.5 28.5 q2.5 2.6 5 0" stroke="#423d38" strokeWidth="1.9" strokeLinecap="round" fill="none" />
            <path d="M26.5 28.5 q2.5 2.6 5 0" stroke="#423d38" strokeWidth="1.9" strokeLinecap="round" fill="none" />
            <path d="M21.5 33 q2.5 3 5 0" stroke="#423d38" strokeWidth="1.9" strokeLinecap="round" fill="none" />
          </>
        )}
        {face === 2 && (
          <>
            {flip ? (
              <>
                <path d="M16.5 28.5 q2.5 2.4 5 0" stroke="#423d38" strokeWidth="1.9" strokeLinecap="round" fill="none" />
                <circle cx="29" cy="28.5" r="1.9" fill="#423d38" />
              </>
            ) : (
              <>
                <circle cx="19" cy="28.5" r="1.9" fill="#423d38" />
                <path d="M26.5 28.5 q2.5 2.4 5 0" stroke="#423d38" strokeWidth="1.9" strokeLinecap="round" fill="none" />
              </>
            )}
            <ellipse cx="24" cy="33.5" rx="2" ry="1.5" fill="#7a4a35" />
          </>
        )}
      </svg>
    </span>
  );
}
