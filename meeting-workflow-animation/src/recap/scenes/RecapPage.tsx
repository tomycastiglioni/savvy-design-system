import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { RECAP_END_SCROLL, RecapContent } from "../../capture/screens/DesktopRecap";
import { DesktopTabs } from "../../capture/screens/DesktopTabs";
import { C, CLAMP, DOC_PANEL, EASE_IN_OUT, EASE_MORPH, PREVIEW } from "../layout";
import { T } from "../timeline";
import { PreviewDoc } from "./PreviewDoc";
import { RecapExtra } from "./RecapExtra";
import { StickyHeader } from "./StickyHeader";

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// Extra scroll past 03's last position: into the topics, then the tasks.
const SCROLL_TOPICS = -478;
const SCROLL_TASKS = -252;

// Opens on 03 · Meeting capture's last frame. The document panel morphs into
// the client-document preview and back; the page exits when the email starts.
export const RecapPage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const scrollY =
    RECAP_END_SCROLL +
    interpolate(t, [...T.scroll1], [0, SCROLL_TOPICS], { ...CLAMP, easing: EASE_IN_OUT }) +
    interpolate(t, [...T.scroll2], [0, SCROLL_TASKS], { ...CLAMP, easing: EASE_IN_OUT });

  // 0 = recap document, 1 = client-document preview.
  const m = interpolate(t, [T.toEditor, T.toEditor + 0.6, T.toRecap, T.toRecap + 0.6], [0, 1, 1, 0], {
    ...CLAMP,
    easing: [EASE_MORPH, Easing.linear, EASE_MORPH],
  });
  const recapVis = interpolate(m, [0, 0.4], [1, 0], CLAMP);
  const previewVis = interpolate(m, [0.45, 1], [0, 1], CLAMP);
  const exit = interpolate(t, [T.loadStart, T.loadStart + 0.4], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, scale: 1 - 0.015 * exit, filter: exit > 0 ? `blur(${exit * 4}px)` : undefined }}>
      {/* Same wrapper and panel styling as 03's final frame */}
      <AbsoluteFill style={{ opacity: 1, translate: "0px 0px", scale: 1 }}>
        <div
          style={{
            position: "absolute",
            left: lerp(DOC_PANEL.x, PREVIEW.x, m),
            top: lerp(DOC_PANEL.y, PREVIEW.y, m),
            width: lerp(DOC_PANEL.w, PREVIEW.w, m),
            height: lerp(DOC_PANEL.h, PREVIEW.h, m),
            borderRadius: lerp(16, 12, m),
            overflow: "hidden",
            background: interpolateColors(m, [0, 1], ["#FFFFFF", C.panel]),
            border: "1px solid rgba(232, 234, 237, 1)",
            boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 40px -12px rgba(16, 24, 40, 0.1)",
            maskImage: "linear-gradient(to bottom, #000 calc(100% - 120px), rgba(0, 0, 0, 0))",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, width: DOC_PANEL.w - 2, height: DOC_PANEL.h - 2, opacity: recapVis }}>
            <RecapContent scrollY={scrollY} topFade={1} built extra={<RecapExtra />} />
            <StickyHeader />
          </div>
          {previewVis > 0 ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: PREVIEW.w - 2, height: PREVIEW.h - 2, opacity: previewVis }}>
              <PreviewDoc />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: recapVis }}>
        <Sequence from={-60}>
          <DesktopTabs />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
