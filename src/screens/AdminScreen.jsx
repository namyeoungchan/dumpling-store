"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash,
  CaretDown,
  LinkSimple,
  ArrowCounterClockwise,
  ArrowsClockwise,
  LockKey,
  Check,
  Trophy,
  Camera,
  X,
} from "@phosphor-icons/react";
import { useData, encodeData } from "../store";
import { fetchResults, clearResults, rankSort, scoreOf, fmtTime } from "../results";
import { fileToAvatar } from "../imageUtil";
import { ROLE_COLORS, ROLE_COLOR_KEYS, roleStyle } from "../roleColors";

/** 팀원 프로필 사진 선택 버튼 (선택 즉시 128px로 압축 저장) */
function MemberPhoto({ member, onChange }) {
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToAvatar(file));
    } catch {
      window.alert("사진을 읽지 못했어요. 다른 사진으로 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative shrink-0">
      <label
        className={`flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition active:scale-95 ${
          member.photo
            ? "border-dough-300"
            : "border-dashed border-dough-400 bg-white text-dough-400"
        } ${busy ? "animate-pulse" : ""}`}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={`${member.name || "팀원"} 사진`}
            className="h-full w-full object-cover"
          />
        ) : (
          <Camera size={20} weight="duotone" />
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pick}
        />
      </label>
      {member.photo && (
        <button
          onClick={() => onChange("")}
          aria-label="사진 삭제"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal-800 text-cream-50 active:scale-90"
        >
          <X size={11} weight="bold" />
        </button>
      )}
    </div>
  );
}

const uid = (p) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

function Field({ label, value, onChange, placeholder, textarea }) {
  const Cmp = textarea ? "textarea" : "input";
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold tracking-wide text-charcoal-600">
        {label}
      </span>
      <Cmp
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={textarea ? 3 : undefined}
        className="w-full rounded-xl border border-dough-300 bg-white px-3.5 py-2.5 text-[15px] text-charcoal-800 outline-none transition placeholder:text-charcoal-600/30 focus:border-persimmon-400 focus:ring-2 focus:ring-persimmon-400/20"
      />
    </label>
  );
}

/* ---------- PIN 잠금 화면 ---------- */
function PinGate({ pin, onPass, onBack }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (input === pin) onPass();
    else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-xs text-center">
        <LockKey size={40} weight="duotone" className="mx-auto text-dough-400" />
        <h1 className="font-display mt-3 text-2xl text-charcoal-800">
          관리자 확인
        </h1>
        <p className="mt-1 text-sm text-charcoal-600/70">
          PIN 번호를 입력해 주세요 (기본값 1234)
        </p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          className={[
            "font-display mt-5 w-full rounded-2xl border-2 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none transition",
            error
              ? "border-persimmon-500 text-persimmon-600"
              : "border-dough-300 text-charcoal-800 focus:border-persimmon-400",
          ].join(" ")}
        />
        {error && (
          <p className="mt-2 text-sm font-medium text-persimmon-600">
            PIN이 올바르지 않습니다
          </p>
        )}
        <button
          type="submit"
          className="font-display mt-5 w-full rounded-2xl bg-charcoal-800 py-3 text-lg text-cream-50 transition active:scale-[0.98]"
        >
          들어가기
        </button>
        <button
          type="button"
          onClick={onBack}
          className="mt-3 text-sm text-charcoal-600/60 underline underline-offset-4"
        >
          게임으로 돌아가기
        </button>
      </form>
    </div>
  );
}

/* ---------- 팀 편집 아코디언 ---------- */
function TeamEditor({ team, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const patch = (p) => onChange({ ...team, ...p });

  const patchMember = (id, p) =>
    patch({
      members: team.members.map((m) => (m.id === id ? { ...m, ...p } : m)),
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-dough-300 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left"
      >
        <span className="font-display min-w-0 truncate text-lg text-charcoal-800">
          {team.name || "(이름 없는 팀)"}
          <span className="ml-2 text-sm font-normal text-charcoal-600/50">
            팀원 {team.members.length}명
          </span>
        </span>
        <CaretDown
          size={18}
          weight="bold"
          className={`shrink-0 text-dough-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          >
            <div className="space-y-4 border-t border-dough-200 px-4 py-4">
              <Field
                label="팀명 (속재료 이름)"
                value={team.name}
                onChange={(v) => patch({ name: v })}
                placeholder="예: 학습운영팀"
              />
              <Field
                label="한 줄 슬로건"
                value={team.tagline}
                onChange={(v) => patch({ tagline: v })}
                placeholder="예: 배움의 현장을 매끄럽게"
              />
              <Field
                label="팀 소개"
                value={team.description}
                onChange={(v) => patch({ description: v })}
                placeholder="정답을 맞추면 보여줄 팀 소개"
                textarea
              />

              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide text-charcoal-600">
                  팀원 목록
                </p>
                <div className="space-y-2.5">
                  {team.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex gap-3 rounded-xl bg-cream-100 p-3"
                    >
                      <MemberPhoto
                        member={m}
                        onChange={(photo) => patchMember(m.id, { photo })}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={m.name}
                            onChange={(e) => patchMember(m.id, { name: e.target.value })}
                            placeholder="이름"
                            className="min-w-0 rounded-lg border border-dough-300 bg-white px-3 py-2 text-sm outline-none focus:border-persimmon-400"
                          />
                          <input
                            value={m.role}
                            onChange={(e) => patchMember(m.id, { role: e.target.value })}
                            placeholder="직책 (예: 팀장)"
                            className="min-w-0 rounded-lg border border-dough-300 bg-white px-3 py-2 text-sm outline-none focus:border-persimmon-400"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <input
                            value={m.note}
                            onChange={(e) => patchMember(m.id, { note: e.target.value })}
                            placeholder="한 줄 소개 (선택)"
                            className="min-w-0 flex-1 rounded-lg border border-dough-300 bg-white px-3 py-2 text-sm outline-none focus:border-persimmon-400"
                          />
                          <button
                            onClick={() =>
                              patch({ members: team.members.filter((x) => x.id !== m.id) })
                            }
                            aria-label="팀원 삭제"
                            className="shrink-0 rounded-lg border border-dough-300 bg-white px-2.5 text-charcoal-600/60 transition active:scale-95"
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                        {/* 직책 라벨 색 선택 */}
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={roleStyle(m.roleColor)}
                          >
                            {m.role || "직책 라벨"}
                          </span>
                          <div className="flex gap-1.5">
                            {ROLE_COLOR_KEYS.map((key) => (
                              <button
                                key={key}
                                onClick={() => patchMember(m.id, { roleColor: key })}
                                aria-label={`라벨 색: ${ROLE_COLORS[key].label}`}
                                className={`h-5 w-5 rounded-full transition active:scale-90 ${
                                  (m.roleColor ?? "leaf") === key
                                    ? "ring-2 ring-charcoal-800 ring-offset-1 ring-offset-cream-100"
                                    : ""
                                }`}
                                style={{ backgroundColor: ROLE_COLORS[key].text }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    patch({
                      members: [
                        ...team.members,
                        { id: uid("m"), name: "", role: "", note: "" },
                      ],
                    })
                  }
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-dough-400 py-2.5 text-sm font-semibold text-charcoal-600 transition active:scale-[0.98]"
                >
                  <Plus size={16} weight="bold" /> 팀원 추가
                </button>
              </div>

              <button
                onClick={onDelete}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-persimmon-500/10 py-2.5 text-sm font-semibold text-persimmon-600 transition active:scale-[0.98]"
              >
                <Trash size={16} weight="bold" /> 이 팀 삭제
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 순위표 ---------- */
function Leaderboard() {
  const [records, setRecords] = useState(null); // null=로딩, []=비어있음
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setRecords(null);
    fetchResults()
      .then((all) => setRecords(rankSort(all)))
      .catch(() => setError(true));
  };

  useEffect(load, []);

  const wipe = () => {
    if (!window.confirm("모든 게임 기록을 삭제할까요? 되돌릴 수 없습니다."))
      return;
    clearResults()
      .then(load)
      .catch(() => setError(true));
  };

  const medal = ["text-persimmon-500", "text-dough-400", "text-leaf-500"];

  return (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-display flex items-center gap-1.5 text-lg text-charcoal-700">
          <Trophy size={20} weight="duotone" className="text-persimmon-500" />
          게임 기록 · 순위
        </h2>
        <button
          onClick={load}
          aria-label="새로고침"
          className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-charcoal-600 transition hover:bg-cream-200 active:scale-95"
        >
          <ArrowsClockwise size={14} weight="bold" /> 새로고침
        </button>
      </div>
      <p className="mb-3 text-xs text-charcoal-600/60">
        기록 = 시간(초) + 헛손질 × 10초. 낮을수록 상위.
      </p>

      {error && (
        <p className="rounded-xl bg-persimmon-500/10 p-4 text-sm font-medium text-persimmon-600">
          기록을 불러오지 못했어요. Firebase 규칙에 results 권한이 있는지
          확인해 주세요.
        </p>
      )}

      {!error && records === null && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-cream-200"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {!error && records?.length === 0 && (
        <p className="rounded-xl border border-dashed border-dough-300 p-5 text-center text-sm text-charcoal-600/60">
          아직 기록이 없어요. 첫 만두를 기다리는 중...
        </p>
      )}

      {!error && records?.length > 0 && (
        <>
          <div className="divide-y divide-dough-200 rounded-2xl border border-dough-300 bg-white px-4">
            {records.map((r, i) => (
              <div key={r.id ?? i} className="flex items-center gap-3 py-2.5">
                <span
                  className={`font-display w-7 shrink-0 text-center text-lg ${medal[i] ?? "text-charcoal-600/40"}`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-charcoal-800">
                    {r.name || "이름 없음"}
                  </p>
                  <p className="truncate text-xs text-charcoal-600/60">
                    {r.affiliation || "-"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm font-bold text-persimmon-600">
                    {scoreOf(r)}초
                  </p>
                  <p className="font-mono text-[11px] text-charcoal-600/50">
                    {fmtTime(r.timeMs)} · 헛손질 {r.missCount ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-charcoal-600/50">
              총 {records.length}개 기록
            </span>
            <button
              onClick={wipe}
              className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-persimmon-600 transition hover:bg-persimmon-500/10 active:scale-95"
            >
              <Trash size={13} weight="bold" /> 기록 전체 삭제
            </button>
          </div>
        </>
      )}
    </section>
  );
}

/* ---------- 관리자 메인 ---------- */
export default function AdminScreen({ onBack }) {
  const { data, setData, resetToDefaults, cloud } = useData();
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newDecoy, setNewDecoy] = useState("");
  const [publishState, setPublishState] = useState("idle"); // idle | saving | saved | error

  const publish = async () => {
    // Firestore 문서 한도(1MB) 사전 확인 — 사진이 아주 많을 때 대비
    const bytes = new Blob([JSON.stringify(data)]).size;
    if (bytes > 950_000) {
      window.alert(
        `데이터가 저장 한도에 가깝습니다 (${Math.round(bytes / 1024)}KB / 1024KB).\n팀원 사진 몇 장을 지우고 다시 시도해 주세요.`,
      );
      return;
    }
    setPublishState("saving");
    try {
      await cloud.publish();
      setPublishState("saved");
      setTimeout(() => setPublishState("idle"), 2500);
    } catch {
      setPublishState("error");
      setTimeout(() => setPublishState("idle"), 3500);
    }
  };

  if (!unlocked) {
    return (
      <PinGate pin={data.adminPin} onPass={() => setUnlocked(true)} onBack={onBack} />
    );
  }

  const patchTeam = (id, next) =>
    setData((d) => ({
      ...d,
      teams: d.teams.map((t) => (t.id === id ? next : t)),
    }));

  const copyShareLink = async () => {
    // Firebase 연동 시엔 짧은 주소만으로 충분 (데이터는 서버에서 실시간 로드)
    // 미연동 시엔 데이터를 링크에 담아 공유
    const base = `${window.location.origin}${window.location.pathname}`;
    const url = cloud.enabled ? base : `${base}?d=${encodeData(data)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사하세요:", url);
    }
  };

  return (
    <div className="min-h-[100dvh] pb-16">
      <header className="sticky top-0 z-30 border-b border-dough-200 bg-cream-100/85 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button
            onClick={onBack}
            aria-label="뒤로"
            className="rounded-full p-2 text-charcoal-600 transition hover:bg-cream-200 active:scale-95"
          >
            <ArrowLeft size={22} weight="bold" />
          </button>
          <h1 className="font-display text-xl text-charcoal-800">가게 관리</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-8 px-5 pt-6">
        {/* 기본 정보 */}
        <section className="space-y-4">
          <h2 className="font-display text-lg text-charcoal-700">기본 정보</h2>
          <Field
            label="만두가게 이름"
            value={data.shopName}
            onChange={(v) => setData((d) => ({ ...d, shopName: v }))}
          />
          <Field
            label="만두 이름 (본부명)"
            value={data.manduName}
            onChange={(v) => setData((d) => ({ ...d, manduName: v }))}
          />
          <Field
            label="관리자 PIN"
            value={data.adminPin}
            onChange={(v) => setData((d) => ({ ...d, adminPin: v }))}
            placeholder="숫자 4자리 권장"
          />
        </section>

        {/* 팀 관리 */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg text-charcoal-700">
              팀 (정답 속재료)
            </h2>
            <span className="text-xs text-charcoal-600/60">
              {data.teams.length}개 팀
            </span>
          </div>
          <div className="space-y-3">
            {data.teams.map((t) => (
              <TeamEditor
                key={t.id}
                team={t}
                onChange={(next) => patchTeam(t.id, next)}
                onDelete={() => {
                  if (window.confirm(`"${t.name}" 팀을 삭제할까요?`))
                    setData((d) => ({
                      ...d,
                      teams: d.teams.filter((x) => x.id !== t.id),
                    }));
                }}
              />
            ))}
          </div>
          <button
            onClick={() =>
              setData((d) => ({
                ...d,
                teams: [
                  ...d.teams,
                  {
                    id: uid("team"),
                    name: "새 팀",
                    tagline: "",
                    description: "",
                    members: [],
                  },
                ],
              }))
            }
            className="font-display mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-dough-400 py-3 text-charcoal-600 transition active:scale-[0.98]"
          >
            <Plus size={18} weight="bold" /> 팀 추가
          </button>
        </section>

        {/* 오답 재료 */}
        <section>
          <h2 className="font-display mb-1 text-lg text-charcoal-700">
            가짜 재료 (오답)
          </h2>
          <p className="mb-3 text-xs leading-relaxed text-charcoal-600/60">
            정답 사이에 섞여 나오는 함정 재료입니다. 재미있는 이름일수록 좋아요.
          </p>
          <div className="flex flex-wrap gap-2">
            {data.decoys.map((decoy, i) => (
              <span
                key={`${decoy}-${i}`}
                className="flex items-center gap-1.5 rounded-full border border-dough-300 bg-white py-1.5 pl-3.5 pr-2 text-sm text-charcoal-700"
              >
                {decoy}
                <button
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      decoys: d.decoys.filter((_, j) => j !== i),
                    }))
                  }
                  aria-label={`${decoy} 삭제`}
                  className="rounded-full p-1 text-charcoal-600/50 transition hover:bg-cream-200 active:scale-90"
                >
                  <Trash size={13} weight="bold" />
                </button>
              </span>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = newDecoy.trim();
              if (!v) return;
              setData((d) => ({ ...d, decoys: [...d.decoys, v] }));
              setNewDecoy("");
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={newDecoy}
              onChange={(e) => setNewDecoy(e.target.value)}
              placeholder="예: 야근방지팀"
              className="min-w-0 flex-1 rounded-xl border border-dough-300 bg-white px-3.5 py-2.5 text-[15px] outline-none placeholder:text-charcoal-600/30 focus:border-persimmon-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-charcoal-800 px-4 text-sm font-semibold text-cream-50 transition active:scale-95"
            >
              추가
            </button>
          </form>
        </section>

        {/* 순위표 */}
        <Leaderboard />

        {/* 공유 & 초기화 */}
        <section className="space-y-3 rounded-2xl bg-dough-100 p-4">
          <h2 className="font-display text-lg text-charcoal-700">배포 · 공유</h2>
          {cloud.enabled ? (
            <>
              <p className="text-xs leading-relaxed text-charcoal-600/70">
                아래 버튼을 누르면 수정한 내용이 저장되어{" "}
                <strong>게임에 접속하는 모든 사람에게 즉시 반영</strong>됩니다.
              </p>
              <button
                onClick={publish}
                disabled={publishState === "saving"}
                className={[
                  "font-display flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-lg text-white transition",
                  publishState === "error"
                    ? "bg-persimmon-500 shadow-[0_5px_0_#b34a1b]"
                    : "bg-leaf-500 shadow-[0_5px_0_#4c6740]",
                  publishState === "saving"
                    ? "opacity-70"
                    : "active:translate-y-[2px] active:shadow-none",
                ].join(" ")}
              >
                {publishState === "saving" && "저장하는 중..."}
                {publishState === "saved" && (
                  <>
                    <Check size={20} weight="bold" /> 모두에게 반영 완료!
                  </>
                )}
                {publishState === "error" &&
                  "저장 실패 — 인터넷 연결을 확인해 주세요"}
                {publishState === "idle" && "저장하고 모두에게 반영하기"}
              </button>
            </>
          ) : (
            <p className="text-xs leading-relaxed text-charcoal-600/70">
              수정한 내용은 이 기기(브라우저)에만 저장됩니다. 아래 공유 링크를
              만들어 단톡방 등에 올리면, 링크를 연 모든 사람이 수정된 내용으로
              게임을 하게 됩니다.
            </p>
          )}
          <button
            onClick={copyShareLink}
            className={
              cloud.enabled
                ? "font-display flex w-full items-center justify-center gap-2 rounded-2xl border border-dough-300 bg-white py-3 text-charcoal-700 shadow-[0_4px_0_#e2cfa4] transition active:translate-y-[2px] active:shadow-[0_2px_0_#e2cfa4]"
                : "font-display flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf-500 py-3.5 text-lg text-white shadow-[0_5px_0_#4c6740] transition active:translate-y-[2px] active:shadow-[0_3px_0_#4c6740]"
            }
          >
            {copied ? (
              <>
                <Check size={20} weight="bold" /> 복사 완료!
              </>
            ) : (
              <>
                <LinkSimple size={20} weight="bold" />
                {cloud.enabled ? "게임 주소 복사" : "게임 공유 링크 복사"}
              </>
            )}
          </button>
          <button
            onClick={() => {
              if (window.confirm("모든 내용을 처음 예시 데이터로 되돌릴까요?"))
                resetToDefaults();
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dough-300 bg-white py-3 text-sm font-semibold text-charcoal-600 transition active:scale-[0.98]"
          >
            <ArrowCounterClockwise size={16} weight="bold" /> 기본값으로 초기화
          </button>
        </section>
      </main>
    </div>
  );
}
