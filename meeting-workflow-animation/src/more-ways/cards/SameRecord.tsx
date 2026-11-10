import { ChartLine, Landmark, Mail, NotebookPen, Receipt } from "lucide-react";
import React from "react";
import { GlassChip, Icon, Skeleton, Spinner } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// v2 · 01 · Every agent works from the same client record (534×264), on the
// dark card. Left, what flows in (accounts, tax, planning, meeting notes,
// client communications); centre, the one client record they fill; right,
// the agents working from it, and a new one that's connected from day 1.
export type RecordState = {
  readonly flow?: number; // 0–5: sources landed in the record (fractional: a pulse on its way)
  readonly kept?: number; // 0–1: "Connections maintained by Savvy"
  readonly agents?: number; // 0–3: agents working from the record (fractional: the pulse on its way)
  readonly fresh?: number; // 0–1: the new agent arriving, connected on day 1
  readonly fade?: number; // 0–1 everything (the loop's reset)
};

const W = 534;
const H = 264;
const STROKE = 1.5;
const glyph = (Glyph: React.FC<{ size?: number; color?: string; strokeWidth?: number }>) => <Glyph size={12.7} color={C.chipIcon} strokeWidth={1.7} />;
const SOURCES = [
  { label: "Accounts", glyph: glyph(Landmark), value: "6 accounts" },
  { label: "Tax", glyph: glyph(Receipt), value: "Last year’s return" },
  { label: "Planning", glyph: glyph(ChartLine), value: "Plan on track" },
  { label: "Meeting notes", glyph: glyph(NotebookPen), value: "12 meetings" },
  { label: "Communications", glyph: glyph(Mail), value: "48 emails" },
];
const AGENTS = ["Prep agent", "Reporting agent", "Email agent"];

const CHIP = 10; // chip size (type px)
const CHIP_H = CHIP * 3.35;
const SRC = { right: 146, top: 30, gap: 9 };
const REC = { x: 178, y: 34, w: 178, h: 196 };
const ROW = { top: REC.y + 58, h: 22 };
const AG = { x: 388, top: 36, gap: 11 };
const srcY = (i: number) => SRC.top + i * (CHIP_H + SRC.gap) + CHIP_H / 2;
const rowY = (i: number) => ROW.top + i * ROW.h + ROW.h / 2;
const agentY = (i: number) => AG.top + i * (CHIP_H + AG.gap) + CHIP_H / 2;
const OUT = { x: REC.x + REC.w, y: REC.y + REC.h / 2 };
const c01 = (n: number) => Math.min(1, Math.max(0, n));

// A connector, and a pulse travelling along it (`p` 0–1, hidden outside).
const inPath = (i: number) => `M ${SRC.right} ${srcY(i)} C ${SRC.right + 18} ${srcY(i)}, ${REC.x - 18} ${rowY(i)}, ${REC.x} ${rowY(i)}`;
const outPath = (y: number) => `M ${OUT.x} ${OUT.y} C ${OUT.x + 18} ${OUT.y}, ${AG.x - 18} ${y}, ${AG.x} ${y}`;
const bez = (p: number, a: number, b: number, c: number, d: number) => (1 - p) ** 3 * a + 3 * (1 - p) ** 2 * p * b + 3 * (1 - p) * p ** 2 * c + p ** 3 * d;
const Pulse: React.FC<{ readonly from: [number, number]; readonly to: [number, number]; readonly p: number }> = ({ from, to, p }) => {
  if (p <= 0 || p >= 1) return null;
  const x = bez(p, from[0], from[0] + 18, to[0] - 18, to[0]);
  const y = bez(p, from[1], from[1], to[1], to[1]);
  return <circle cx={x} cy={y} r={3.2} fill={C.mint} style={{ filter: "drop-shadow(0 0 4px rgba(206,237,205,0.9))" }} />;
};

export const SameRecord: React.FC<{ readonly s: RecordState }> = ({ s }) => {
  const { flow = 5, kept = 1, agents = 3, fresh = 1, fade = 1 } = s;
  const newY = agentY(3);
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT, opacity: fade }}>
      {/* connectors and pulses */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {SOURCES.map((src, i) => (
          <path key={src.label} d={inPath(i)} fill="none" stroke={`rgba(255,255,255,${0.14 + 0.16 * c01(flow - i)})`} strokeWidth={STROKE} />
        ))}
        {AGENTS.map((a, i) => (
          <path key={a} d={outPath(agentY(i))} fill="none" stroke={`rgba(255,255,255,${0.14 + 0.16 * c01(agents - i)})`} strokeWidth={STROKE} />
        ))}
        <path d={outPath(newY)} fill="none" stroke="rgba(206,237,205,0.55)" strokeWidth={STROKE} strokeDasharray="200" strokeDashoffset={200 * (1 - c01(fresh * 1.6 - 0.3))} />
        {SOURCES.map((src, i) => (
          <Pulse key={src.label} from={[SRC.right, srcY(i)]} to={[REC.x, rowY(i)]} p={flow - i} />
        ))}
        {AGENTS.map((a, i) => (
          <Pulse key={a} from={[OUT.x, OUT.y]} to={[AG.x, agentY(i)]} p={agents - i} />
        ))}
        <Pulse from={[OUT.x, OUT.y]} to={[AG.x, newY]} p={fresh * 1.6 - 0.6} />
      </svg>

      {/* what flows in */}
      {SOURCES.map((src, i) => (
        <div key={src.label} style={{ position: "absolute", right: W - SRC.right, top: srcY(i) - CHIP_H / 2 }}>
          <GlassChip glyph={src.glyph} label={src.label} size={CHIP} lit={c01(flow - i) * (1 - c01(flow - i - 1)) * 0.8} />
        </div>
      ))}

      {/* the one client record */}
      <div style={{ position: "absolute", left: REC.x, top: REC.y, width: REC.w, height: REC.h, background: "#ffffff", borderRadius: 9, boxShadow: "0 14px 30px -14px rgba(0,0,0,0.45)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 12, top: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: C.greenSoft, color: C.green, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>AC</div>
          <div>
            <div style={{ fontWeight: MEDIUM, fontSize: 11.5, color: C.ink, whiteSpace: "nowrap" }}>Allison &amp; Frank Chan</div>
            <div style={{ fontSize: 9.5, color: C.muted, marginTop: 1 }}>Client record</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 12, right: 12, top: 50, height: 1, background: C.border }} />
        {SOURCES.map((src, i) => {
          const on = c01((flow - i - 0.85) / 0.15);
          return (
            <div key={src.label} style={{ position: "absolute", left: 12, right: 12, top: ROW.top - REC.y + i * ROW.h, height: ROW.h, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: 3, background: on > 0 ? C.green2 : "#d9dde2", flexShrink: 0 }} />
              <div style={{ fontSize: 9.5, color: C.sub2, width: 62, whiteSpace: "nowrap" }}>{src.label === "Communications" ? "Emails" : src.label === "Meeting notes" ? "Notes" : src.label}</div>
              <div style={{ position: "relative", flex: 1, height: 12 }}>
                <div style={{ position: "absolute", inset: 0, fontWeight: MEDIUM, fontSize: 9.5, color: C.ink, whiteSpace: "nowrap", opacity: on }}>{src.value}</div>
                {on < 1 ? <Skeleton w={58} h={6} style={{ position: "absolute", top: 3, opacity: 1 - on }} /> : null}
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 28, background: C.tile, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", opacity: 0.35 + 0.65 * kept }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: kept > 0.5 ? C.greenBg : "#e6e9ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {kept > 0.5 ? <Icon name="check-dark" w={7} /> : null}
          </div>
          <div style={{ fontSize: 9, color: C.sub2, whiteSpace: "nowrap" }}>Connections maintained by Savvy</div>
        </div>
      </div>

      {/* the agents working from it */}
      {AGENTS.map((a, i) => {
        const on = c01(agents - i);
        const done = agents - i >= 1;
        return (
          <div key={a} style={{ position: "absolute", left: AG.x, top: agentY(i) - CHIP_H / 2, opacity: 0.45 + 0.55 * on }}>
            <GlassChip
              glyph={<Icon name="savvy-mark" w={12.7} style={{ filter: "brightness(1.6) saturate(0.7)" }} />}
              label={a}
              size={CHIP}
              lit={done ? 0.6 : 0}
              extra={done ? <Icon name="check-small" w={8} style={{ marginLeft: 2 }} /> : on > 0 ? <Spinner angle={on * 720} size={10} /> : null}
            />
          </div>
        );
      })}
      {fresh > 0 ? (
        <div style={{ position: "absolute", left: AG.x, top: newY - CHIP_H / 2, opacity: c01(fresh * 2), translate: `${(1 - c01(fresh * 1.4)) * 18}px 0px` }}>
          <GlassChip
            glyph={<Icon name="savvy-mark" w={12.7} style={{ filter: "brightness(1.6) saturate(0.7)" }} />}
            label="New agent"
            size={CHIP}
            lit={c01(fresh * 1.6 - 0.9) * 0.8}
            extra={
              <span style={{ marginLeft: 2, padding: "2px 6px", borderRadius: 10, background: C.mint, color: C.greenInk, fontSize: 8.5, fontWeight: 700 }}>
                Day 1
              </span>
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export const RECORD_FRAMES: readonly { s: RecordState; title: string; caption: string }[] = [
  { s: { flow: 2.5, kept: 0, agents: 0, fresh: 0 }, title: "It all flows in", caption: "Accounts, tax, planning, meeting notes and client communications flow into one client record, each filling its line as it lands." },
  { s: { flow: 5, kept: 1, agents: 0, fresh: 0 }, title: "One client record", caption: "Allison & Frank Chan's record, complete. “Connections maintained by Savvy”: nothing for the advisor to set up." },
  { s: { flow: 5, kept: 1, agents: 1.55, fresh: 0 }, title: "Every agent works from it", caption: "The prep, reporting and email agents light up one by one, each drawing on the same record." },
  { s: { flow: 5, kept: 1, agents: 3, fresh: 1 }, title: "A new agent, day 1", caption: "A new agent slides in and is connected to the same record right away (“Day 1”). Then the loop starts over." },
];
