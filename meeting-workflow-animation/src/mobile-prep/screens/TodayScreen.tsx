import { CircleCheck } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { Avatar } from "../../shared/components/Avatar";
import { MEETINGS, RECAPS, TASKS, TODAY, type Meeting } from "../content";
import { C, CLAMP, FONT, PAD, W } from "../layout";
import { pushAt, T } from "../timeline";

const Section: React.FC<{ readonly top: number; readonly title: string; readonly count: number }> = ({ top, title, count }) => (
  <div style={{ position: "absolute", left: PAD, right: PAD, top, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
    <div style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>
      {title} <span style={{ color: C.faint, fontWeight: 400 }}>({count})</span>
    </div>
    <div style={{ fontSize: 14, fontWeight: 500, color: C.green }}>See all</div>
  </div>
);

const Card: React.FC<{ readonly top: number; readonly children: React.ReactNode }> = ({ top, children }) => (
  <div
    style={{
      position: "absolute",
      left: PAD - 4,
      right: PAD - 4,
      top,
      background: C.white,
      border: `1px solid ${C.borderSoft}`,
      borderRadius: 16,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const Chip: React.FC<{ readonly kind: "ready" | "preparing"; readonly style?: React.CSSProperties }> = ({ kind, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ready = kind === "ready";
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: -13,
        height: 26,
        padding: "0 10px",
        borderRadius: 13,
        display: "flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
        fontSize: 12,
        fontWeight: 600,
        background: ready ? C.green50 : C.tabsBg,
        color: ready ? C.green : C.muted,
        ...style,
      }}
    >
      {ready ? <CircleCheck size={13} strokeWidth={2.2} /> : <AIIcon size={13} style={{ rotate: `${(frame / fps) * 220}deg` }} />}
      {ready ? "Prep ready" : "Preparing…"}
    </div>
  );
};

const MeetingRow: React.FC<{ readonly m: Meeting; readonly first: boolean }> = ({ m, first }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Sequential, so the two labels never overlap: old chip out, new chip pops in.
  const out = interpolate(t, [T.ready, T.ready + 0.08], [0, 1], CLAMP);
  const flip = interpolate(t, [T.ready + 0.06, T.ready + 0.16], [0, 1], CLAMP);
  const pop = spring({ frame: frame - (T.ready + 0.06) * fps, fps, config: { damping: 11, stiffness: 220 } });

  return (
    <div style={{ display: "flex", alignItems: "center", height: 66, padding: "0 14px", borderTop: first ? "none" : `1px solid ${C.borderSoft}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{m.who}</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{m.when}</div>
      </div>
      <div style={{ position: "relative", width: 1, height: 1 }}>
        {m.prep === "ready" ? <Chip kind="ready" /> : null}
        {m.prep === "preparing" ? (
          <>
            <Chip kind="preparing" style={{ opacity: 1 - out }} />
            <Chip kind="ready" style={{ opacity: flip, scale: 0.85 + 0.15 * pop, transformOrigin: "100% 50%" }} />
          </>
        ) : null}
      </div>
    </div>
  );
};

// The advisor's day in the Savvy app. Local time = absolute time (mounted at
// frame 0); slides out under the prep screen when it pushes in.
export const TodayScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = pushAt(frame / fps);
  if (push >= 1) return null;

  return (
    <AbsoluteFill style={{ background: C.panel, translate: `${-0.3 * W * push}px 0px` }}>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 58, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>{TODAY.date}</div>
        <Avatar size={34} person="heather" />
      </div>
      <div style={{ position: "absolute", left: PAD, top: 98, fontFamily: FONT.serif, fontSize: 30, lineHeight: 1.1, color: C.ink }}>{TODAY.greeting}</div>

      <Section top={160} title="Today" count={MEETINGS.length} />
      <Card top={190}>
        {MEETINGS.map((m, i) => (
          <MeetingRow key={m.who} m={m} first={i === 0} />
        ))}
      </Card>

      <Section top={410} title="Tasks" count={TASKS.length} />
      <Card top={440}>
        {TASKS.map((task, i) => (
          <div key={task.title} style={{ display: "flex", alignItems: "center", gap: 12, height: 60, padding: "0 14px", borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, border: `1.5px solid ${C.border}`, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink }}>{task.title}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{task.meta}</div>
            </div>
          </div>
        ))}
      </Card>

      <Section top={660} title="Recaps" count={12} />
      <Card top={690}>
        {RECAPS.map((r) => (
          <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 12, height: 66, padding: "0 14px" }}>
            <AIIcon size={20} />
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink }}>{r.title}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{r.meta}</div>
            </div>
          </div>
        ))}
        <div style={{ height: 60, borderTop: `1px solid ${C.borderSoft}` }} />
      </Card>

      <AbsoluteFill style={{ background: "#000000", opacity: 0.06 * push }} />
    </AbsoluteFill>
  );
};
