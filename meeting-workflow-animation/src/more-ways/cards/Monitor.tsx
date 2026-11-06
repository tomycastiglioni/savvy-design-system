import React from "react";
import { Icon } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// 05 · Monitor across your book (406×256). The household card (Figma): Savvy
// runs through the book, household after household on track, until the Ellis
// household needs attention: two RMDs still to take. Flagged, then picked up.
export type MonitorState = {
  readonly household?: "chan" | "patel" | "ellis";
  readonly rows?: number; // 0–4 table rows filled
  readonly scan?: number; // 0–1 scan line down the card (-1 none)
  readonly status?: "ontrack" | "flag" | "review";
  readonly glow?: number; // 0–1 on the amber balances
};

const W = 406;
const H = 256;
const CARD = { x: 35, y: 21.5, w: 336, h: 213 };
type Row = { account: string; required: string; taken: string; remaining: string; due: boolean; withholding: string };
const done = (account: string, amount: string, withholding: string): Row => ({ account, required: amount, taken: amount, remaining: "$0", due: false, withholding });
const HOUSEHOLDS: Record<"chan" | "patel" | "ellis", { name: string; sub: string; rows: readonly Row[] }> = {
  chan: {
    name: "Chan Household",
    sub: "4 accounts · RMDs this year",
    rows: [done("Traditional IRA", "$18,240", "$3,648 (20%)"), done("Roth IRA", "$0", "—"), done("Rollover IRA", "$6,105", "$1,221 (20%)"), done("SEP IRA", "$2,870", "$574 (20%)")],
  },
  patel: {
    name: "Patel Household",
    sub: "4 accounts · RMDs this year",
    rows: [done("Traditional IRA", "$31,020", "$6,204 (20%)"), done("Inherited IRA", "$4,412", "$882 (20%)"), done("Rollover IRA", "$11,650", "$2,330 (20%)"), done("403(b)", "$7,380", "$1,476 (20%)")],
  },
  ellis: {
    name: "Ellis Household",
    sub: "4 accounts · RMDs this year",
    rows: [
      done("Traditional IRA", "$24,637", "$4,927 (20%)"),
      { account: "Inherited IRA", required: "$12,480", taken: "$0", remaining: "$12,480", due: true, withholding: "$2,496 (20%)" },
      done("Rollover IRA", "$8,913", "$1,783 (20%)"),
      { account: "SEP IRA", required: "$5,200", taken: "$2,000", remaining: "$3,200", due: true, withholding: "$640 (20%)" },
    ],
  },
};
// Right edges of the numeric columns (Figma).
const COLS = { required: 142.49, taken: 189.52, remaining: 246.52, withholding: 313.49 };
const num: React.CSSProperties = { position: "absolute", fontSize: 8.193, color: C.text, textAlign: "right", whiteSpace: "nowrap" };

export const Monitor: React.FC<{ readonly s: MonitorState }> = ({ s }) => {
  const { household = "ellis", rows = 4, scan = -1, status = "review", glow = 0 } = s;
  const h = HOUSEHOLDS[household];
  const pill =
    status === "review"
      ? { bg: C.greenBg, ink: "#004632", label: "RMD review in progress", check: true }
      : status === "flag"
        ? { bg: C.amberBg, ink: C.amberInk, label: "2 RMDs need attention", check: false }
        : { bg: C.greenBg, ink: "#004632", label: "On track", check: true };
  return (
    <div style={{ position: "relative", width: W, height: H, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: "#ffffff", border: `0.646px solid ${C.border}`, borderRadius: 8.822, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 18.59, top: 18.35, width: 27.787, height: 27.787, borderRadius: 13.893, background: "#edf5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="users" w={14.962} />
        </div>
        <div style={{ position: "absolute", left: 54.93, top: 19.78, whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 700, fontSize: 9.975, color: C.text }}>{h.name}</div>
          <div style={{ fontSize: 7.837, color: C.sub, marginTop: 2.137 }}>{h.sub}</div>
        </div>
        <div
          style={{
            position: "absolute",
            right: CARD.w - 317.11,
            top: 18.35,
            height: 21.374,
            padding: "0 6.412px",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            gap: 4.987,
            background: pill.bg,
            color: pill.ink,
            fontWeight: MEDIUM,
            fontSize: 7.837,
            whiteSpace: "nowrap",
          }}
        >
          {pill.check ? <Icon name="check-dark" w={9.262} /> : <div style={{ width: 6, height: 6, borderRadius: 3, background: "#d39b1b" }} />}
          {pill.label}
        </div>
        {/* table */}
        <div style={{ position: "absolute", left: 0, top: 62.45, width: CARD.w, fontWeight: MEDIUM, fontSize: 8.193, color: C.text, height: 11 }}>
          <div style={{ position: "absolute", left: 19.24 }}>Account</div>
          {(Object.keys(COLS) as (keyof typeof COLS)[]).map((k) => (
            <div key={k} style={{ position: "absolute", right: CARD.w - COLS[k] }}>
              {k[0].toUpperCase() + k.slice(1)}
            </div>
          ))}
        </div>
        {h.rows.map((r, i) => {
          const y = 84.11 + i * 31.275;
          const on = i < rows;
          return (
            <React.Fragment key={r.account}>
              {i > 0 ? <div style={{ position: "absolute", left: 18.59, top: y - 8, width: 297.528, height: 0.5, background: "#e6e8ec" }} /> : null}
              {on ? (
                <>
                  <div style={{ ...num, left: 18.59, top: y + 2.14, fontSize: 8.051, textAlign: "left" }}>{r.account}</div>
                  <div style={{ ...num, right: CARD.w - COLS.required, top: y + 2.14 }}>{r.required}</div>
                  <div style={{ ...num, right: CARD.w - COLS.taken, top: y + 2.14 }}>{r.taken}</div>
                  <div
                    style={{
                      position: "absolute",
                      right: CARD.w - COLS.remaining,
                      top: y,
                      padding: "2.137px 5.7px",
                      borderRadius: 10.687,
                      background: r.due ? C.amberBg : C.greenBg,
                      color: r.due ? C.amberInk : C.greenInk,
                      fontWeight: 700,
                      fontSize: 8.193,
                      boxShadow: r.due && glow > 0 ? `0 0 0 ${2 + 2 * glow}px rgba(242, 196, 82, ${0.35 * glow})` : undefined,
                    }}
                  >
                    {r.remaining}
                  </div>
                  <div style={{ ...num, right: CARD.w - COLS.withholding, top: y + 2.14 }}>{r.withholding}</div>
                </>
              ) : (
                <div style={{ position: "absolute", left: 18.59, top: y + 3, width: 297, height: 7, borderRadius: 4, background: "#f0f2f4" }} />
              )}
            </React.Fragment>
          );
        })}
        {scan >= 0 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 56 + scan * 150,
              height: 26,
              background: "linear-gradient(180deg, rgba(8,107,78,0) 0%, rgba(8,107,78,0.10) 85%, rgba(8,107,78,0.35) 100%)",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export const MONITOR_FRAMES: readonly { s: MonitorState; title: string; caption: string }[] = [
  { s: { household: "chan", rows: 4, scan: 0.45, status: "ontrack" }, title: "Watching the book", caption: "A scan line runs down each household’s RMDs; the Chans have taken every one, so they’re on track and it moves on." },
  { s: { household: "patel", rows: 4, scan: 0.8, status: "ontrack" }, title: "On track", caption: "Household after household flicks past, each checked, each “On track”. Nothing for the advisor." },
  { s: { household: "ellis", rows: 4, status: "flag", glow: 1 }, title: "Only what needs you", caption: "It stops on the Ellis household: the RMD table fills in and two balances still to take light up amber." },
  { s: { household: "ellis", rows: 4, status: "review" }, title: "Picked up", caption: "The flag becomes “RMD review in progress” (the design’s state). Then the scan carries on." },
];
