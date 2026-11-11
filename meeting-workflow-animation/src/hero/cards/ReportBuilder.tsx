import { ChartLine, ChartPie, PenLine, Table, Target } from "lucide-react";
import React from "react";
import { Icon, Pill, Pointer } from "../../more-ways/Bits";
import { C } from "../../more-ways/theme";
import { Button, c01, Frame, Head, Label, MarkAvatar, Panel } from "../Bits";

// Performance report builder. The Chans' Q4 report: the performance block is
// in; the allocation block is dragged in from the side; the advisor note
// writes itself in the advisor's voice; Publish to portal.
export type ReportState = {
  readonly drag?: number; // 0–1: the allocation block travelling from the side to its place (1: placed)
  readonly note?: number; // 0–1: the advisor note written
  readonly published?: number; // 0–1
  readonly press?: number;
  readonly pointer?: { x: number; y: number; o: number };
};

type G = React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
const BLOCKS: readonly { label: string; Glyph: G }[] = [
  { label: "Performance", Glyph: ChartLine },
  { label: "Allocation", Glyph: ChartPie },
  { label: "Holdings", Glyph: Table },
  { label: "Advisor note", Glyph: PenLine },
  { label: "Goals", Glyph: Target },
];
const SIDE = { x: 14, top: 92, h: 34, gap: 6, w: 132 };
const PAGE = { x: 160, y: 74, w: 406, h: 246 };
const SLOT = { x: PAGE.x + 12, y: PAGE.y + 110, w: PAGE.w - 24, h: 66 }; // the allocation block's place
const NOTE_TEXT = "A steady quarter for you both. We brought the portfolio back to its 70/30 target and fully funded Ellie’s 529.";
export const sideAt = (i: number) => ({ x: 20 + SIDE.x + 34, y: 14 + SIDE.top + i * (SIDE.h + SIDE.gap) + SIDE.h / 2 }); // frame px
export const PUBLISH_AT = { x: 20 + 580 - 20 - 60, y: 14 + 35 };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const Allocation: React.FC = () => (
  <>
    <svg width={44} height={44} viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
      <circle cx={22} cy={22} r={16} fill="none" stroke="#dbe9de" strokeWidth={9} />
      <circle cx={22} cy={22} r={16} fill="none" stroke={C.green2} strokeWidth={9} strokeDasharray={`${0.7 * 100.5} 100.5`} transform="rotate(-90 22 22)" />
    </svg>
    <div>
      <Label>Allocation</Label>
      <div style={{ display: "flex", gap: 14, marginTop: 5, fontSize: 11.5, color: C.ink }}>
        <span>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 2, background: C.green2, marginRight: 5 }} />
          Stocks 70%
        </span>
        <span>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 2, background: "#dbe9de", marginRight: 5 }} />
          Bonds 30%
        </span>
      </div>
      <div style={{ fontSize: 9.5, color: C.muted, marginTop: 3 }}>Back on its 70/30 target</div>
    </div>
  </>
);

export const ReportBuilder: React.FC<{ readonly s: ReportState }> = ({ s }) => {
  const { drag = 1, note = 1, published = 1, press = 0, pointer } = s;
  const placed = drag >= 1;
  const written = NOTE_TEXT.slice(0, Math.round(note * NOTE_TEXT.length));
  // the dragged block, from the sidebar row to its slot
  const from = { x: SIDE.x, y: SIDE.top + (SIDE.h + SIDE.gap) };
  const e = drag < 0.5 ? 2 * drag * drag : 1 - (-2 * drag + 2) ** 2 / 2;
  const fly = { x: lerp(from.x, SLOT.x, e), y: lerp(from.y, SLOT.y, e), w: lerp(SIDE.w, SLOT.w, e), h: lerp(SIDE.h, SLOT.h, e) };
  return (
    <Frame>
      <Panel>
        <Head
          lead={<MarkAvatar />}
          title="Q4 Performance Report"
          sub="Allison & Frank Chan"
          right={
            published > 0.5 ? (
              <Pill tone="green" size={10.5}>
                <Icon name="check-dark" w={8} /> Published to portal
              </Pill>
            ) : (
              <Button press={press} style={{ height: 26, marginTop: -2 }}>
                Publish to portal
              </Button>
            )
          }
        />
        {/* the blocks to add */}
        <Label style={{ position: "absolute", left: SIDE.x + 4, top: 76 }}>Blocks</Label>
        {BLOCKS.map(({ label, Glyph }, i) => (
          <div
            key={label}
            style={{
              position: "absolute",
              left: SIDE.x,
              top: SIDE.top + i * (SIDE.h + SIDE.gap),
              width: SIDE.w,
              height: SIDE.h,
              boxSizing: "border-box",
              padding: "0 10px",
              borderRadius: 7,
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11.5,
              color: C.ink,
              background: "#ffffff",
              opacity: i === 1 && drag > 0 && !placed ? 0.4 : 1,
            }}
          >
            <Glyph size={12} color={C.sub} strokeWidth={1.9} /> {label}
          </div>
        ))}

        {/* the report page */}
        <div style={{ position: "absolute", left: PAGE.x, top: PAGE.y, width: PAGE.w, height: PAGE.h, borderRadius: 9, background: C.tile }} />
        <div style={{ position: "absolute", left: PAGE.x + 12, top: PAGE.y + 12, width: PAGE.w - 24, height: 88, borderRadius: 8, background: "#ffffff", border: `0.7px solid ${C.border}`, padding: "11px 14px", boxSizing: "border-box", display: "flex", justifyContent: "space-between" }}>
          <div>
            <Label>Performance</Label>
            <div style={{ fontWeight: 700, fontSize: 26, color: C.ink, marginTop: 6 }}>+8.4%</div>
            <div style={{ fontSize: 9.5, color: C.muted, marginTop: 2 }}>Year to date · benchmark +6.9%</div>
          </div>
          <svg width={150} height={60} viewBox="0 0 150 60" style={{ marginTop: 6 }}>
            <path d="M0 50 C 20 46, 30 40, 45 42 S 70 30, 85 28 S 115 22, 128 14 S 145 8, 150 6" fill="none" stroke={C.green2} strokeWidth={2} />
            <path d="M0 52 C 25 50, 50 44, 75 40 S 125 30, 150 24" fill="none" stroke="#c7cdd4" strokeWidth={1.4} strokeDasharray="3 3" />
          </svg>
        </div>
        {/* the allocation block's place: a drop zone until it lands */}
        {placed ? (
          <div style={{ position: "absolute", left: SLOT.x, top: SLOT.y, width: SLOT.w, height: SLOT.h, borderRadius: 8, background: "#ffffff", border: `0.7px solid ${C.border}`, padding: "0 14px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 14 }}>
            <Allocation />
          </div>
        ) : (
          <div style={{ position: "absolute", left: SLOT.x, top: SLOT.y, width: SLOT.w, height: SLOT.h, borderRadius: 8, border: `1.3px dashed ${drag > 0.6 ? C.green2 : "#c9d3cc"}`, background: drag > 0.6 ? "rgba(222,243,220,0.45)" : "transparent", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, color: C.muted }}>
            Drop a block here
          </div>
        )}
        {/* the advisor note, in the advisor's voice */}
        <div style={{ position: "absolute", left: PAGE.x + 12, top: SLOT.y + SLOT.h + 10, width: PAGE.w - 24, height: 58, borderRadius: 8, background: "#ffffff", border: `0.7px solid ${C.border}`, padding: "9px 14px", boxSizing: "border-box", opacity: placed ? 1 : 0.5 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Label>Advisor note</Label>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, color: C.muted }}>
              <Icon name="savvy-mark" w={10} /> In your voice
            </span>
          </div>
          <div style={{ fontSize: 10.5, lineHeight: 1.4, color: C.text, marginTop: 4 }}>{written || <span style={{ color: C.muted }}>Writing…</span>}</div>
        </div>
      </Panel>
      {/* the block on its way */}
      {drag > 0 && !placed ? (
        <div
          style={{
            position: "absolute",
            left: 20 + fly.x,
            top: 14 + fly.y,
            width: fly.w,
            height: fly.h,
            borderRadius: 8,
            background: "#ffffff",
            border: `1px solid ${C.border}`,
            boxShadow: "0 18px 34px -14px rgba(0,0,0,0.45)",
            padding: "0 14px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: 14,
            overflow: "hidden",
            rotate: `${Math.sin(Math.PI * c01(drag)) * -2}deg`,
          }}
        >
          {e > 0.45 ? <Allocation /> : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, color: C.ink }}>
              <ChartPie size={12} color={C.sub} strokeWidth={1.9} /> Allocation
            </span>
          )}
        </div>
      ) : null}
      {pointer && pointer.o > 0 ? (
        <div style={{ opacity: pointer.o }}>
          <Pointer x={pointer.x} y={pointer.y} />
        </div>
      ) : null}
    </Frame>
  );
};

export const REPORT_FRAMES: readonly { s: ReportState; title: string; caption: string }[] = [
  { s: { drag: 0, note: 0, published: 0 }, title: "Build the report", caption: "The Chans’ Q4 report: performance is in (+8.4% year to date against a +6.9% benchmark), a place waiting for the next block." },
  {
    s: { drag: 0.62, note: 0, published: 0, pointer: { x: 20 + lerp(14, SLOT.x, 0.7) + 60, y: 14 + lerp(132, SLOT.y, 0.7) + 24, o: 1 } },
    title: "Drag in what matters",
    caption: "“Allocation” is dragged from the blocks into the report; the drop zone lights up and it opens out into the 70/30 chart.",
  },
  { s: { pointer: { ...PUBLISH_AT, o: 1 } }, title: "Your voice, published", caption: "The advisor note writes itself in the advisor’s voice, and the report is published straight to the clients’ portal." },
];
