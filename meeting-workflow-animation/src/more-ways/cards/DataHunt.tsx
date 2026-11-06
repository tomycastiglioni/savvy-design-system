import React from "react";
import { Caret, Icon, IconName } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// 06 · Skip the data hunting (406×294), on the dark card (Figma): the
// advisor asks; Savvy checks every source on file, one after another, then
// answers with the figure. Copy without years, so it doesn't date.
export type HuntState = {
  readonly asked?: number; // 0–1 the question bubble
  readonly checked?: number; // 0–4 sources checked (the next one spins); -1: not started
  readonly answer?: number; // 0–1 of the answer written (0: "Checking…")
  readonly spin?: number; // spinner angle
};

const W = 406;
const H = 294;
const QUESTION = "What were last year’s charitable deductions?";
const ANSWER = "Last year’s tax return reported $28,450 in charitable deductions on Schedule A.";
const SOURCES: readonly { icon: IconName; name: string; meta: string }[] = [
  { icon: "file-text-white", name: "Tax return", meta: "(Form 1040)" },
  { icon: "file-text-white", name: "Custodian statement", meta: "(Year-end)" },
  { icon: "file-text-white", name: "Beneficiary form", meta: "(Updated in March)" },
  { icon: "folder-white", name: "Household documents", meta: "(4 files)" },
];

const Spinner: React.FC<{ readonly angle: number }> = ({ angle }) => (
  <div style={{ width: 13, height: 13, borderRadius: "50%", border: "1.6px solid rgba(255,255,255,0.18)", borderTopColor: C.mint, rotate: `${angle}deg`, boxSizing: "border-box" }} />
);

// The answer, with the figure set off once it's there.
const Answer: React.FC<{ readonly p: number }> = ({ p }) => {
  const n = Math.round(p * ANSWER.length);
  const shown = ANSWER.slice(0, n);
  const at = ANSWER.indexOf("$28,450");
  if (n <= at) return <>{shown}</>;
  const fig = shown.slice(at, at + 7);
  return (
    <>
      {shown.slice(0, at)}
      <span style={{ color: C.mint, fontWeight: MEDIUM }}>{fig}</span>
      {shown.slice(at + 7)}
    </>
  );
};

export const DataHunt: React.FC<{ readonly s: HuntState }> = ({ s }) => {
  const { asked = 1, checked = 4, answer = 1, spin = 0 } = s;
  const done = checked >= 4;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT, color: "#ffffff" }}>
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 22.77,
          width: 267,
          boxSizing: "border-box",
          padding: "11px 15px",
          borderRadius: 10,
          background: "#eef5ed",
          color: "#0a2b3b",
          fontSize: 14,
          lineHeight: 1.25,
          opacity: asked,
          translate: `0px ${(1 - asked) * 10}px`,
        }}
      >
        {QUESTION}
      </div>
      {asked >= 1 && checked >= 0 ? (
        <>
          <div style={{ position: "absolute", left: 40.82, top: 99.27, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: "#f3f7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="savvy-mark" w={23.283} />
            </div>
            <div style={{ width: 264, fontSize: 14, lineHeight: 1.25, minHeight: 36, display: "flex", alignItems: "center" }}>
              {answer > 0 ? (
                <span>
                  <Answer p={answer} />
                  {answer < 1 ? <Caret h={15} color="#ffffff" /> : null}
                </span>
              ) : (
                <span style={{ opacity: 0.6 }}>Checking every source on file…</span>
              )}
            </div>
          </div>
          <div style={{ position: "absolute", left: 40.82, top: 173.24, width: 13.05, height: 13.05, borderRadius: 6.868, background: "rgba(206, 237, 205, 0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {done ? <Icon name="check-small" w={7.555} /> : <Spinner angle={spin} />}
          </div>
          <div style={{ position: "absolute", left: 60.65, top: 171.77, fontWeight: MEDIUM, fontSize: 12 }}>
            {done ? `Sources checked (${SOURCES.length})` : `Checking sources (${Math.floor(checked)} of ${SOURCES.length})`}
          </div>
          <Icon name="chevron-up" w={13} style={{ position: "absolute", left: 351.82, top: 173.27 }} />
          <div style={{ position: "absolute", left: 41, top: 202.27, width: 324, display: "flex", flexDirection: "column", gap: 7 }}>
            {SOURCES.map((src, i) => {
              const state = i < checked ? "done" : i === Math.floor(checked) ? "now" : "next";
              return (
                <div
                  key={src.name}
                  style={{
                    height: 48,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    padding: "0 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 10,
                    background: state === "now" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.1)",
                    opacity: state === "next" ? 0.45 : 1,
                  }}
                >
                  <div style={{ width: 29, height: 29, borderRadius: 15, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={src.icon} w={17} />
                  </div>
                  <div style={{ flex: 1, whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: 11.1 }}>{src.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{src.meta}</div>
                  </div>
                  {state === "done" ? (
                    <div style={{ width: 13.05, height: 13.05, borderRadius: 6.868, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="check-green" w={7.555} />
                    </div>
                  ) : state === "now" ? (
                    <Spinner angle={spin} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export const HUNT_FRAMES: readonly { s: HuntState; title: string; caption: string }[] = [
  { s: { asked: 1, checked: -1, answer: 0 }, title: "Asked", caption: "The advisor’s question arrives in plain words; no tabs, no searching." },
  { s: { asked: 1, checked: 2, answer: 0, spin: 140 }, title: "Every source", caption: "Savvy works down the sources on file: each one spins, then ticks. “Checking sources (2 of 4)”." },
  { s: { asked: 1, checked: 4, answer: 0.5 }, title: "Then it answers", caption: "Only once all four are checked does the answer write itself." },
  { s: { asked: 1, checked: 4, answer: 1 }, title: "The figure", caption: "$28,450 from Schedule A, set off in green, with the sources it checked right under it (the design’s state)." },
];
