"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, UsersThree, ChatCircleDots } from "@phosphor-icons/react";

/** 이름 첫 글자 — 이모지(조합 이모지 포함)도 깨지지 않게 grapheme 단위로 자름 */
function firstGrapheme(name) {
  if (!name) return "?";
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter("ko", { granularity: "grapheme" })
      .segment(name)
      [Symbol.iterator]()
      .next().value;
    return seg ? seg.segment : "?";
  }
  return Array.from(name)[0] ?? "?";
}

/** 정답을 맞추면 뜨는 팀 소개 시트 */
export default function TeamModal({ team, onClose }) {
  return (
    <AnimatePresence>
      {team && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            layout
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-10 max-h-[86dvh] w-full overflow-y-auto rounded-t-[2rem] bg-cream-50 px-6 pb-10 pt-5 shadow-[0_-20px_60px_rgba(60,40,10,0.25)] sm:max-w-lg sm:rounded-[2rem] sm:pb-8"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-dough-300 sm:hidden" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm text-persimmon-500">
                  정답! 이 재료가 들어갑니다
                </p>
                <h2 className="font-display text-3xl leading-tight text-charcoal-800">
                  {team.name}
                </h2>
                {team.tagline && (
                  <p className="mt-1 text-sm font-medium text-leaf-600">
                    “{team.tagline}”
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="닫기"
                className="rounded-full bg-cream-200 p-2 text-charcoal-600 transition active:scale-95"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {team.description && (
              <div className="mt-5 flex gap-3 rounded-2xl bg-dough-100 p-4">
                <ChatCircleDots
                  size={22}
                  weight="duotone"
                  className="mt-0.5 shrink-0 text-persimmon-500"
                />
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-charcoal-700">
                  {team.description}
                </p>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center gap-2 text-charcoal-600">
                <UsersThree size={20} weight="duotone" />
                <h3 className="font-display text-lg">함께하는 사람들</h3>
              </div>

              {team.members.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-dough-300 p-4 text-sm text-charcoal-600/70">
                  아직 등록된 팀원이 없어요. 관리자 화면에서 추가할 수 있습니다.
                </p>
              ) : (
                <motion.ul
                  className="mt-3 divide-y divide-dough-200"
                  initial="hidden"
                  animate="show"
                  variants={{
                    show: { transition: { staggerChildren: 0.06 } },
                  }}
                >
                  {team.members.map((m) => (
                    <motion.li
                      key={m.id}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className="flex items-center gap-3 py-3"
                    >
                      {m.photo ? (
                        <img
                          src={m.photo}
                          alt={`${m.name} 사진`}
                          className="h-11 w-11 shrink-0 rounded-full border border-dough-200 object-cover"
                        />
                      ) : (
                        <span className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-dough-200 text-lg text-persimmon-600">
                          {firstGrapheme(m.name)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-charcoal-800">
                          {m.name}
                          {m.role && (
                            <span className="ml-2 rounded-full bg-leaf-500/10 px-2 py-0.5 text-xs font-medium text-leaf-600">
                              {m.role}
                            </span>
                          )}
                        </p>
                        {m.note && (
                          <p className="text-sm leading-snug text-charcoal-600/80">
                            {m.note}
                          </p>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>

            <button
              onClick={onClose}
              className="font-display mt-6 w-full rounded-2xl bg-persimmon-500 py-3.5 text-lg text-white shadow-[0_6px_0_#b34a1b] transition active:translate-y-[2px] active:shadow-[0_4px_0_#b34a1b]"
            >
              계속 만두 빚기
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
