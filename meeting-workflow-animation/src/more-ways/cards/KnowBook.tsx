import { ChartLine, Landmark, Receipt } from "lucide-react";
import React from "react";
import { ramp, useT } from "../anim";
import { Icon, Pill, Spinner } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// v2 · 05 · Know more than they expect (617×350), on the dark card. Savvy
// Intelligence reads every household's accounts, tax returns and plans (one
// record), household after household; it stops on what's worth raising: a
// Roth window that reopened, an upcoming RMD, portfolio drift. Each finding
// opens with its evidence and the part of the record it came from.
export type KnowBookState = {
  readonly scan?: number; // 0–5 rows checked (fractional: the row being checked)
  readonly clear?: number; // 0–1: back to the start (the loop's reset)
  readonly spin?: number;
};

const W = 617;
const H = 350;
const CARD = { x: 24, y: 20, w: 569, h: 344 };
const BOOK = 142; // households on the book
type Source = "Accounts" | "Tax return" | "Plan";
type Finding = { readonly label: string; readonly tone: "green" | "amber"; readonly evidence: string; readonly sources: readonly Source[] };
const HOUSEHOLDS: readonly { name: string; initials: string; aum: string; finding?: Finding }[] = [
  { name: "Alan Ashby", initials: "AA", aum: "$1.8M" },
  {
    name: "Allison & Frank Chan",
    initials: "AC",
    aum: "$9.36M",
    finding: { label: "Roth window reopened", tone: "green", evidence: "Lower income this year leaves room to convert about $48K at 22%", sources: ["Tax return", "Plan"] },
  },
  { name: "Dan Bishop", initials: "DB", aum: "$688K" },
  {
    name: "Ruth Ellis",
    initials: "RE",
    aum: "$2.4M",
    finding: { label: "Upcoming RMD", tone: "amber", evidence: "$12,480 still to take from her inherited IRA by Dec 31", sources: ["Accounts"] },
  },
  {
    name: "Anita & Raj Patel",
    initials: "AP",
    aum: "$4.1M",
    finding: { label: "Portfolio drift", tone: "amber", evidence: "Equities at 66% against the plan’s 60% target", sources: ["Accounts", "Plan"] },
  },
];
const FOUND = HOUSEHOLDS.filter((h) => h.finding).length;
const ROWS = { top: 66, h: 34, open: 58, gap: 5 };
const c01 = (n: number) => Math.min(1, Math.max(0, n));
const SOURCE_GLYPH: Record<Source, React.FC<{ size?: number; color?: string; strokeWidth?: number }>> = { Accounts: Landmark, "Tax return": Receipt, Plan: ChartLine };

const SourceTag: React.FC<{ readonly source: Source }> = ({ source }) => {
  const Glyph = SOURCE_GLYPH[source];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 7px", borderRadius: 5, background: "#ffffff", border: `0.7px solid ${C.border}`, fontSize: 9.5, color: C.sub2, whiteSpace: "nowrap" }}>
      <Glyph size={10} color={C.sub} strokeWidth={1.9} /> {source}
    </span>
  );
};

export const KnowBook: React.FC<{ readonly s: KnowBookState }> = ({ s }) => {
  const { scan = 5, clear = 0, spin = 0 } = s;
  const keep = 1 - clear;
  const finished = scan >= HOUSEHOLDS.length && clear === 0;
  // (during the reset the scan is complete; the rows close and fade back)
  const checked = Math.min(BOOK, Math.round((BOOK * scan) / HOUSEHOLDS.length));
  let y = ROWS.top;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: "#ffffff", borderRadius: 10, border: `0.7px solid ${C.border}`, overflow: "hidden" }}>
        {/* the whole book, read from one record */}
        <div style={{ position: "absolute", left: 18, top: 14, width: 32, height: 32, borderRadius: 16, background: "#f3f7f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="savvy-mark" w={18} />
        </div>
        <div style={{ position: "absolute", left: 60, top: 13, fontWeight: MEDIUM, fontSize: 15, color: C.ink }}>Across your book</div>
        <div style={{ position: "absolute", left: 60, top: 33, fontSize: 10.5, color: C.muted, whiteSpace: "nowrap" }}>Savvy Intelligence · reading accounts, tax returns and plans</div>
        {/* scanning, then the tally; at the reset the tally gives way to the start */}
        {finished || clear > 0 ? (
          <div style={{ position: "absolute", right: 18, top: 18, opacity: keep }}>
            <Pill tone="green" size={10.5}>
              <Icon name="check-dark" w={8} /> {`${FOUND} to raise · ${BOOK} checked`}
            </Pill>
          </div>
        ) : null}
        {!finished ? (
          <div style={{ position: "absolute", right: 18, top: 18, opacity: clear > 0 ? clear : 1 }}>
            <Pill tone="amber" size={10.5} style={{ background: "#f1f3f5", color: C.sub2 }}>
              <Spinner angle={spin} size={9} dark={false} />
              <span>
                Checking <span style={{ fontVariantNumeric: "tabular-nums" }}>{clear > 0 ? 1 : Math.max(1, checked)}</span> of {BOOK}
              </span>
            </Pill>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 18, right: 18, top: 56, height: 1, background: C.border }} />

        {/* household after household */}
        {HOUSEHOLDS.map((hh, i) => {
          const p = scan - i; // 0–1 while this row is being checked
          const checking = p > 0 && p < 1 && clear === 0;
          const done = p >= 1 || (p > 0.5 && !!hh.finding);
          const open = hh.finding ? c01((p - 0.45) * 2.2) * keep : 0;
          const h = ROWS.h + (ROWS.open - ROWS.h) * open;
          const top = y;
          y += h + ROWS.gap;
          return (
            <div
              key={hh.name}
              style={{
                position: "absolute",
                left: 12,
                right: 12,
                top,
                height: h,
                padding: "0 10px",
                borderRadius: 8,
                overflow: "hidden",
                background: open > 0 ? (hh.finding?.tone === "green" ? `rgba(222,243,220,${0.6 * open})` : `rgba(255,244,206,${0.55 * open})`) : checking ? "rgba(23,82,66,0.06)" : C.tile,
                boxShadow: checking ? "inset 0 0 0 1px rgba(23,82,66,0.18)" : undefined,
              }}
            >
              <div style={{ position: "absolute", left: 10, top: 5, width: 24, height: 24, borderRadius: 12, background: C.greenSoft, color: C.green, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {hh.initials}
              </div>
              <div style={{ position: "absolute", left: 44, top: 9, fontSize: 12, color: C.ink, whiteSpace: "nowrap" }}>
                <span style={{ fontWeight: MEDIUM }}>{hh.name}</span>
                <span style={{ color: C.muted, fontSize: 10.5, marginLeft: 6 }}>{hh.aum}</span>
              </div>
              <div style={{ position: "absolute", right: 10, top: 7 }}>
                {checking && !done ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: C.muted, marginTop: 4 }}>
                    <Spinner angle={spin} size={9} dark={false} /> Checking
                  </span>
                ) : done && hh.finding && keep > 0 ? (
                  <Pill tone={hh.finding.tone} size={10} style={{ opacity: c01(open * 2), scale: 0.7 + 0.3 * c01(open * 1.6) }}>
                    {hh.finding.tone === "green" ? <Icon name="savvy-mark" w={10} /> : null}
                    {hh.finding.label}
                  </Pill>
                ) : done ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: C.muted, marginTop: 4, opacity: keep }}>
                    <Icon name="check-dark" w={8} style={{ opacity: 0.55 }} /> On track
                  </span>
                ) : null}
              </div>
              {hh.finding ? (
                <div style={{ position: "absolute", left: 44, right: 10, top: 32, display: "flex", alignItems: "center", gap: 8, opacity: c01(open * 1.6 - 0.4), translate: `0px ${(1 - open) * 4}px` }}>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 10.5, color: C.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hh.finding.evidence}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {hh.finding.sources.map((src) => (
                      <SourceTag key={src} source={src} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const KNOWBOOK_FRAMES: readonly { s: KnowBookState; title: string; caption: string }[] = [
  { s: { scan: 0.5, spin: 40 }, title: "Every household", caption: "Savvy Intelligence reads each household’s accounts, tax returns and plans, from the one record, household after household (“Checking 14 of 142”)." },
  { s: { scan: 1.95, spin: 120 }, title: "A Roth window reopened", caption: "The Chans: lower income this year leaves room for a Roth conversion. The row opens with the evidence and where it came from (Tax return, Plan)." },
  { s: { scan: 3.95, spin: 200 }, title: "An upcoming RMD", caption: "Ruth Ellis: $12,480 still to take from her inherited IRA by Dec 31 (Accounts). Households with nothing new show “On track”." },
  { s: { scan: 5, spin: 260 }, title: "Portfolio drift", caption: "The Patels: equities at 66% against the plan’s 60% target (Accounts, Plan). “3 to raise · 142 checked”. Then the scan starts over." },
];

// The loop (12 s): the scan runs down the book, briskly past households that
// are on track and pausing on each finding as it opens (the Chans' Roth
// window, Ruth Ellis's RMD, the Patels' drift); the tally holds, then it all
// eases back to the start.
export const KNOWBOOK_SECONDS = 12;
const SCAN: readonly (readonly [number, number])[] = [
  [0.4, 0],
  [1.2, 1], // Ashby, on track
  [2.6, 2], // the Chans' Roth window opens
  [3.5, 2],
  [4.2, 3], // Bishop, on track
  [5.6, 4], // Ruth Ellis's RMD opens
  [6.5, 4],
  [7.9, 5], // the Patels' drift opens
];
const scanAt = (t: number) => {
  if (t <= SCAN[0][0]) return SCAN[0][1];
  for (let i = 1; i < SCAN.length; i++) {
    const [t1, v1] = SCAN[i];
    const [t0, v0] = SCAN[i - 1];
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return SCAN[SCAN.length - 1][1];
};
export const KnowBookLoop: React.FC = () => {
  const t = useT();
  const back = t >= 11.7;
  return <KnowBook s={{ scan: back ? 0 : scanAt(t), clear: back ? 0 : ramp(t, 10.9, 11.7), spin: t * 380 }} />;
};
