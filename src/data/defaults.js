// 기본 데이터 — 관리자 화면에서 자유롭게 수정할 수 있습니다.
// 팀명/팀원은 아직 확정 전이므로 예시 값으로 채워져 있습니다.

export const DEFAULT_DATA = {
  version: 1,
  shopName: "타임교육",
  manduName: "현장지원 본부",
  adminPin: "1234",
  teams: [
    {
      id: "team-a",
      name: "학습운영팀",
      tagline: "배움의 현장을 매끄럽게",
      description:
        "교육 현장의 운영 전반을 책임지는 팀입니다. 관리자 화면에서 실제 팀 소개로 수정해 주세요.",
      members: [
        { id: "m-a1", name: "홍길동", role: "팀장", note: "팀 총괄" },
        { id: "m-a2", name: "김샘플", role: "매니저", note: "현장 운영" },
      ],
    },
    {
      id: "team-b",
      name: "고객지원팀",
      tagline: "가장 가까운 곳에서 돕습니다",
      description:
        "고객의 목소리를 가장 먼저 듣는 팀입니다. 관리자 화면에서 실제 팀 소개로 수정해 주세요.",
      members: [
        { id: "m-b1", name: "이예시", role: "팀장", note: "" },
      ],
    },
    {
      id: "team-c",
      name: "물류지원팀",
      tagline: "제때, 제자리에",
      description:
        "교재와 물품이 제때 도착하도록 움직이는 팀입니다. 관리자 화면에서 실제 팀 소개로 수정해 주세요.",
      members: [
        { id: "m-c1", name: "박보기", role: "팀장", note: "" },
      ],
    },
    {
      id: "team-d",
      name: "시스템운영팀",
      tagline: "보이지 않는 곳의 든든함",
      description:
        "현장이 멈추지 않도록 시스템을 지키는 팀입니다. 관리자 화면에서 실제 팀 소개로 수정해 주세요.",
      members: [
        { id: "m-d1", name: "최데모", role: "팀장", note: "" },
      ],
    },
  ],
  decoys: [
    "야근방지팀",
    "회식기획팀",
    "만두연구팀",
    "우주개발팀",
    "낮잠보장팀",
    "간식조달팀",
  ],
};

export const STORAGE_KEY = "mando-data-v1";
