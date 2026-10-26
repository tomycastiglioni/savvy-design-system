import { CircleCheck, Flag, ListChecks, ListOrdered, TrendingUp } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { BUTTON, GREETING, MEETING, ROWS, type Row } from "../content";
import { BUTTON_BG, C, CLAMP, EASE_OUT, FONT, PAD, SKELETON, TILE } from "../layout";
import { rowAt, T } from "../timeline";

const ICONS = { summary: TrendingUp, task: ListChecks, flagged: Flag, agenda: ListOrdered };
const ROW_H = 66;
const SKELETON_W = [128, 112, 136, 168]; // value bar widths while loading

const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// Grey placeholder with a left-to-right sweep, 1 s per pass.
const Shimmer: React.FC<{ readonly w: number | string; readonly h: number; readonly r: number; readonly style?: React.CSSProperties }> = ({ w, h, r, style }) => {
  const sweep = (useTime() % 1) * 100;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: `linear-gradient(90deg, ${SKELETON.base} 0%, ${SKELETON.highlight} 50%, ${SKELETON.base} 100%)`,
        backgroundSize: "300% 100%",
        backgroundPosition: `${100 - sweep}% 0%`,
        ...style,
      }}
    />
  );
};

// Placeholder out, content in. Both layers share the row, so nothing reflows.
const useResolve = (at: number) => {
  const t = useTime();
  return {
    skeleton: interpolate(t, [at, at + 0.15], [1, 0], CLAMP),
    content: interpolate(t, [at, at + 0.35], [0, 1], { ...CLAMP, easing: EASE_OUT }),
  };
};

const RowView: React.FC<{ readonly row: Row; readonly i: number }> = ({ row, i }) => {
  const { skeleton, content } = useResolve(rowAt(i));
  const Icon = ICONS[row.kind];
  const tile = TILE[row.kind];
  const layer: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 14 };

  return (
    <div style={{ position: "relative", height: ROW_H, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
      <div style={{ ...layer, opacity: skeleton }}>
        <Shimmer w={38} h={38} r={11} />
        <div>
          <Shimmer w={54} h={9} r={4.5} />
          <Shimmer w={SKELETON_W[i]} h={13} r={6.5} style={{ marginTop: 8 }} />
        </div>
      </div>
      <div style={{ ...layer, opacity: content, translate: `0px ${(1 - content) * 6}px` }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: tile.bg,
            color: tile.fg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={19} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>{row.label}</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, marginTop: 2 }}>{row.value}</div>
        </div>
      </div>
    </div>
  );
};

const Chip: React.FC<{ readonly ready: boolean; readonly style?: React.CSSProperties }> = ({ ready, style }) => {
  const t = useTime();
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: -14,
        height: 28,
        padding: "0 11px",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        fontSize: 12.5,
        fontWeight: 600,
        background: ready ? C.green50 : C.tabsBg,
        color: ready ? C.green : C.muted,
        transformOrigin: "100% 50%",
        ...style,
      }}
    >
      {ready ? <CircleCheck size={14} strokeWidth={2.2} /> : <AIIcon size={14} style={{ rotate: `${t * 220}deg` }} />}
      {ready ? "Prep ready" : "Preparing…"}
    </div>
  );
};

// Sequential swap so the two labels never overlap: old chip out, new chip pops in.
const StatusChip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const out = interpolate(t, [T.ready, T.ready + 0.08], [0, 1], CLAMP);
  const ready = interpolate(t, [T.ready + 0.06, T.ready + 0.16], [0, 1], CLAMP);
  const pop = spring({ frame: frame - (T.ready + 0.06) * fps, fps, config: { damping: 11, stiffness: 220 } });

  return (
    <div style={{ position: "relative", width: 1, height: 1 }}>
      <Chip ready={false} style={{ opacity: 1 - out }} />
      <Chip ready style={{ opacity: ready, scale: 0.85 + 0.15 * pop }} />
    </div>
  );
};

const OpenButton: React.FC = () => {
  const { skeleton, content } = useResolve(rowAt(ROWS.length));
  return (
    <div style={{ position: "relative", height: 48 }}>
      <Shimmer w="100%" h={48} r={24} style={{ position: "absolute", inset: 0, opacity: skeleton }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          background: BUTTON_BG,
          color: C.white,
          fontSize: 15.5,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: content,
        }}
      >
        {BUTTON}
      </div>
    </div>
  );
};

// The advisor's morning screen, open from the first frame: the next meeting's
// prep loads in place, then resolves into four short rows.
export const MorningScreen: React.FC = () => (
  <AbsoluteFill style={{ background: C.panel }}>
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 76 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: C.muted }}>{GREETING.date}</div>
      <div style={{ fontFamily: FONT.serif, fontSize: 34, lineHeight: 1.1, color: C.ink, marginTop: 8 }}>{GREETING.hello}</div>
    </div>

    <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 176 }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: C.label, marginLeft: 4 }}>
        {GREETING.section}
      </div>
      <div
        style={{
          marginTop: 10,
          background: C.white,
          border: `1px solid ${C.borderSoft}`,
          borderRadius: 20,
          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 10px 28px -14px rgba(16, 24, 40, 0.14)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 16px" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{MEETING.title}</div>
            <div style={{ fontSize: 13.5, color: C.muted, marginTop: 3 }}>{MEETING.when}</div>
          </div>
          <StatusChip />
        </div>
        <div style={{ height: 1, background: C.borderSoft }} />
        <div style={{ padding: "2px 18px 0" }}>
          {ROWS.map((row, i) => (
            <RowView key={row.kind} row={row} i={i} />
          ))}
        </div>
        <div style={{ padding: "8px 18px 18px" }}>
          <OpenButton />
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
