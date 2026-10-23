import { FilePlus2, Send } from "lucide-react";
import React from "react";
import {
  Easing,
  interpolate,
  interpolateColors,
  Sequence,
  useVideoConfig,
} from "remotion";
import { RecapContent } from "../../capture/screens/DesktopRecap";
import { OutlineButton } from "../../recap/components/Bits";
import {
  center,
  CREATE_BTN,
  DOC_PANEL,
  DRAFT_BTN,
  EDITOR,
  editorPoint,
  PREVIEW,
  ROW,
  ROWS,
  SAVE_BTN,
  SEGMENT,
  STICKY_H,
} from "../../recap/layout";
import { EditorPanel } from "../../recap/scenes/EditorPanel";
import { PreviewDoc } from "../../recap/scenes/PreviewDoc";
import { RecapExtra } from "../../recap/scenes/RecapExtra";
import { Headline } from "../components/Headline";
import { Remap, timeMap } from "../components/Remap";
import { camAt, Stage } from "../components/Stage";
import {
  C,
  CLAMP,
  EASE_IN_OUT,
  EASE_MORPH,
  EASE_OUT,
  EYEBROW,
  rectViaCam,
  TEXT_X,
  viaCam,
} from "../theme";
import { CAM, L, useT } from "../timeline";
import { RECAP_REVEAL_AT_HANDOFF } from "./CaptureChapter";

// Scroll that brings "Key financial numbers" under the header (F17).
const F17_SCROLL = -279;

// Launch time → 04 · Recap time for the editor and preview: click Create,
// add the graph, switch to serif, then the primary button (now "Draft email
// to client") at 04's Save moment, where it freezes.
export const EDITOR_TIME = timeMap([
  [L.createClick, 4.55],
  [L.createClick + 0.75, 5.3],
  [L.createClick + 1.45, 6.35],
  [L.createClick + 2.35, 7.45],
  [L.draftClick, 8.55],
]);

export const CREATE_POINT = viaCam(CAM.desktopRight, center(CREATE_BTN));
export const GRAPH_POINT = viaCam(
  CAM.editor,
  editorPoint(ROW.x + 23, ROWS.graphRetirement + ROW.h / 2 + 2),
);
export const SERIF_POINT = viaCam(
  CAM.editor,
  editorPoint(SEGMENT.x + SEGMENT.w * 0.75, SEGMENT.y + SEGMENT.h / 2 + 2),
);
export const DRAFT_POINT = viaCam(
  CAM.editor,
  editorPoint(SAVE_BTN.x + SAVE_BTN.w / 2, SAVE_BTN.y + SAVE_BTN.h / 2 + 2),
);
// The editor's primary button, in launch px (start of the follow-up morph).
export const DRAFT_BTN_RECT = rectViaCam(CAM.editor, {
  x: EDITOR.x + SAVE_BTN.x,
  y: EDITOR.y + SAVE_BTN.y,
  w: SAVE_BTN.w,
  h: SAVE_BTN.h,
});

const local = (r: { x: number; y: number }) => ({
  left: r.x - DOC_PANEL.x - 1,
  top: r.y - DOC_PANEL.y - 1,
});

// 04's sticky header, on the launch clock.
const Header: React.FC<{ readonly t: number }> = ({ t }) => {
  const enter = interpolate(t, [L.scroll[0] + 0.2, L.scroll[0] + 0.6], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const hover = interpolate(
    t,
    [L.createClick - 0.32, L.createClick - 0.2],
    [0, 1],
    CLAMP,
  );
  const press = interpolate(
    t,
    [L.createClick - 0.03, L.createClick + 0.05, L.createClick + 0.18],
    [0, 1, 0],
    CLAMP,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: DOC_PANEL.w - 2,
        height: STICKY_H,
        background: C.white,
        borderBottom: "1px solid #EEF0F2",
        opacity: Math.min(1, enter * 4), // solid while it slides, so it covers the title
        translate: `0px ${(1 - enter) * -STICKY_H}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 21,
          fontSize: 16,
          fontWeight: 600,
          color: C.ink,
        }}
      >
        Quarterly Review recap{" "}
        <span style={{ fontWeight: 400, color: C.muted }}>· Jul 31, 2026</span>
      </div>
      <div style={{ position: "absolute", ...local(CREATE_BTN) }}>
        <OutlineButton
          w={CREATE_BTN.w}
          h={CREATE_BTN.h}
          hover={hover}
          press={press}
        >
          <FilePlus2 size={15} strokeWidth={1.9} /> Create client document
        </OutlineButton>
      </div>
      <div style={{ position: "absolute", ...local(DRAFT_BTN) }}>
        <OutlineButton w={DRAFT_BTN.w} h={DRAFT_BTN.h}>
          <Send size={15} strokeWidth={1.9} /> Draft client email
        </OutlineButton>
      </div>
    </div>
  );
};

// F16 → F19: the recap scrolls under its header, slides right for the
// headline, then "Create client document" opens the editor and live preview.
export const Materials: React.FC = () => {
  const t = useT();
  const { fps } = useVideoConfig();
  if (t < L.materialsIn || t > L.loaderMorph + 0.6) {
    return null;
  }
  const cam = camAt(t, [
    { t: L.materialsPan, cam: CAM.desktop },
    { t: L.materialsPan + 0.65, cam: CAM.desktopRight },
    { t: L.createClick + 0.07, cam: CAM.desktopRight, ease: Easing.linear },
    { t: L.createClick + 0.7, cam: CAM.editor, ease: EASE_MORPH },
  ]);
  const sigma = EDITOR_TIME(t);
  const scrolled = interpolate(t, [...L.scroll], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const m = interpolate(sigma, [4.65, 5.25], [0, 1], {
    ...CLAMP,
    easing: EASE_MORPH,
  });
  const recapVis = interpolate(m, [0, 0.4], [1, 0], CLAMP);
  const previewVis = interpolate(m, [0.45, 1], [0, 1], CLAMP);
  const exit = interpolate(t, [L.loaderMorph, L.loaderMorph + 0.4], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const lerp = (a: number, b: number) => a + (b - a) * m;
  // Continue 03's recap reveal on its own clock, so the hand-off is seamless.
  const recapFrom = Math.round((L.materialsIn - RECAP_REVEAL_AT_HANDOFF) * fps);

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - exit,
          scale: 1 - 0.015 * exit,
          filter: exit > 0 ? `blur(${exit * 4}px)` : undefined,
        }}
      >
        <Stage cam={cam}>
          <div
            style={{
              position: "absolute",
              left: lerp(DOC_PANEL.x, PREVIEW.x),
              top: lerp(DOC_PANEL.y, PREVIEW.y),
              width: lerp(DOC_PANEL.w, PREVIEW.w),
              height: lerp(DOC_PANEL.h, PREVIEW.h),
              borderRadius: lerp(16, 12),
              overflow: "hidden",
              background: interpolateColors(m, [0, 1], ["#FFFFFF", C.panel]),
              border: "1px solid rgba(232, 234, 237, 1)",
              boxShadow:
                "0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 40px -12px rgba(16, 24, 40, 0.1)",
              maskImage:
                "linear-gradient(to bottom, #000 calc(100% - 120px), rgba(0, 0, 0, 0))",
            }}
          >
            {recapVis > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: DOC_PANEL.w - 2,
                  height: DOC_PANEL.h - 2,
                  opacity: recapVis,
                }}
              >
                <Sequence from={recapFrom} layout="none">
                  <RecapContent
                    scrollY={F17_SCROLL * scrolled}
                    topFade={scrolled}
                    extra={<RecapExtra />}
                  />
                </Sequence>
                <Header t={t} />
              </div>
            ) : null}
            {previewVis > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: PREVIEW.w - 2,
                  height: PREVIEW.h - 2,
                  opacity: previewVis,
                }}
              >
                <Remap to={EDITOR_TIME}>
                  <PreviewDoc />
                </Remap>
              </div>
            ) : null}
          </div>
          {t >= L.createClick ? (
            <Remap to={EDITOR_TIME}>
              <EditorPanel primary="draft" />
            </Remap>
          ) : null}
        </Stage>
      </div>
      <Headline
        eyebrow="Client materials"
        color={EYEBROW.materials}
        lines={["Create the", "experience", "you want"]}
        x={TEXT_X}
        inAt={L.materialsText}
        outAt={L.loaderMorph}
      />
    </>
  );
};
