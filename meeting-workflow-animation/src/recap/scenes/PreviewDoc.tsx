import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../../shared/components/Reveal";
import { MEETING, NEXT_STEPS, QUICK_SUMMARY, SUMMARY_POINTS } from "../../capture/content";
import { Swap } from "../components/Bits";
import { MiniProjection } from "../components/MiniProjection";
import { C, CLAMP, EASE_IN_OUT, FONT } from "../layout";
import { T } from "../timeline";

const GRAPH_H = 250;
const PAGE_SCROLL = -215; // brings the newly added graph into view

// Heading that switches from DM Sans to DM Serif Display with the Typeface control.
const Heading: React.FC<{ readonly p: number; readonly size: number; readonly lh: number; readonly children: React.ReactNode }> = ({ p, size, lh, children }) => (
  <Swap
    p={p}
    a={<div style={{ fontSize: size, lineHeight: `${lh}px`, fontWeight: 700, color: C.ink }}>{children}</div>}
    b={<div style={{ fontFamily: FONT.serif, fontSize: size * 1.18, lineHeight: `${lh}px`, color: C.ink }}>{children}</div>}
  />
);

// The client document as it will be shared, updating live with the editor.
export const PreviewDoc: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const at = (s: number) => T.toEditor + 0.4 + s;

  const serif = interpolate(t, [T.clickSerif + 0.02, T.clickSerif + 0.3], [0, 1], CLAMP);
  const graph = interpolate(t, [T.clickGraph + 0.05, T.clickGraph + 0.5], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const build = interpolate(t, [T.clickGraph + 0.35, T.clickGraph + 1.05], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  // Scroll down to show the new graph, then back up before the typeface change
  // so it lands on the title.
  const scroll = interpolate(
    t,
    [T.clickGraph + 0.05, T.clickGraph + 0.6, T.clickSerif - 0.42, T.clickSerif - 0.05],
    [0, PAGE_SCROLL, PAGE_SCROLL, 0],
    { ...CLAMP, easing: EASE_IN_OUT },
  );

  return (
    <>
      <div style={{ position: "absolute", left: 24, top: 16, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.08em", color: C.muted }}>
        PREVIEW
      </div>
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 44,
          width: 680,
          height: 1100,
          background: C.white,
          border: "1px solid #ECEEF1",
          borderRadius: 10,
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "34px 40px", translate: `0px ${scroll}px` }}>
          <Reveal at={at(0)}>
            <Heading p={serif} size={27} lh={38}>
              Quarterly Review
            </Heading>
            <div style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>{MEETING.household} household · Prepared Aug 1, 2026</div>
          </Reveal>
          <Reveal at={at(0.06)} style={{ height: 2, background: "#3B4252", margin: "20px 0 22px" }} />

          <Reveal at={at(0.12)}>
            <Heading p={serif} size={18} lh={28}>
              Meeting summary
            </Heading>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: C.body, marginTop: 8 }}>{QUICK_SUMMARY}</div>
          </Reveal>
          {SUMMARY_POINTS.map((p, i) => (
            <Reveal key={p} at={at(0.18 + i * 0.05)} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.55, color: C.body, marginTop: 4 }}>
              <span style={{ color: C.faint }}>•</span>
              {p}
            </Reveal>
          ))}

          <Reveal at={at(0.36)} style={{ marginTop: 22 }}>
            <Heading p={serif} size={18} lh={28}>
              Next steps
            </Heading>
          </Reveal>
          {NEXT_STEPS.map((s, i) => (
            <Reveal key={s.title} at={at(0.42 + i * 0.06)} style={{ marginTop: 10 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink }}>{s.title}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
                Owner: {s.owner} · {s.when}
              </div>
            </Reveal>
          ))}

          {/* Added from the editor's Graphs step */}
          <div style={{ height: GRAPH_H * graph, overflow: "hidden", opacity: graph }}>
            <div style={{ paddingTop: 24 }}>
              <Heading p={serif} size={18} lh={28}>
                Retirement projection
              </Heading>
              <div style={{ marginTop: 12 }}>
                <MiniProjection w={600} h={190} build={build} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
