import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "./components/Phone";
import { Touch } from "./components/Touch";
import { bgGradient, C, CLAMP, DOC_PANEL, EASE_MORPH, EASE_OUT, FONT, MOBILE, SCREEN, SCREEN_RADIUS, screenPoint } from "./layout";
import { DesktopRecap } from "./screens/DesktopRecap";
import { DesktopTabs } from "./screens/DesktopTabs";
import { NotesScreen } from "./screens/NotesScreen";
import { RecordingFlow } from "./screens/RecordingFlow";
import { T } from "./timeline";

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const TAPS = [
  { at: T.tapStop, ...screenPoint(SCREEN.w / 2, MOBILE.stopY + MOBILE.buttonH / 2) },
  { at: T.tapRecap, ...screenPoint(SCREEN.w / 2, MOBILE.stopY + MOBILE.buttonH / 2) },
  { at: T.tapTranscript, ...screenPoint(16 + (SCREEN.w - 32) * 0.75, MOBILE.tabsY + 13) },
  { at: T.tapSummary, ...screenPoint(16 + (SCREEN.w - 32) * 0.25, MOBILE.tabsY + 13) },
];

// Workflow 03 · Meeting capture — "Every conversation, on the record".
// Recording on the phone → transcribing → writing the recap → notes, then the
// phone grows into the desktop document with the same recap.
// `transparent` drops the background, `tabs` the desktop tab bar and
// `linkedDocs` keeps the recap's linked-documents line, for reuse inside the
// launch video. `hideCursor` drops the tap indicators for clean stills.
export const Capture: React.FC<{
  readonly transparent?: boolean;
  readonly tabs?: boolean;
  readonly linkedDocs?: boolean;
  readonly hideCursor?: boolean;
}> = ({ transparent = false, tabs = true, linkedDocs = false, hideCursor = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const enter = interpolate(t, [0, 0.6], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const push = interpolate(t, [T.toNotes, T.toNotes + 0.5], [0, 1], { ...CLAMP, easing: EASE_MORPH });
  const grow = interpolate(t, [T.growStart, T.growEnd], [0, 1], { ...CLAMP, easing: EASE_MORPH });

  const screen = {
    x: lerp(SCREEN.x, DOC_PANEL.x, grow),
    y: lerp(SCREEN.y, DOC_PANEL.y, grow),
    w: lerp(SCREEN.w, DOC_PANEL.w, grow),
    h: lerp(SCREEN.h, DOC_PANEL.h, grow),
  };
  const zoom = screen.w / SCREEN.w;
  // Phone content zooms with the screen and hands over to the desktop recap,
  // which starts arriving before it has fully gone (no empty frame).
  const mobile = interpolate(grow, [0.3, 0.75], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ background: transparent ? undefined : bgGradient("gold"), fontFamily: FONT.sans, color: C.ink }}>
      <style>{"*{box-sizing:border-box;}"}</style>

      <AbsoluteFill style={{ opacity: enter, translate: `0px ${(1 - enter) * 40}px`, scale: 0.96 + 0.04 * enter }}>
        <Phone
          screen={screen}
          radius={lerp(SCREEN_RADIUS, 16, grow)}
          frame={interpolate(grow, [0.15, 0.6], [1, 0], CLAMP)}
          chrome={interpolate(grow, [0, 0.3], [1, 0], CLAMP)}
          screenStyle={{
            border: `1px solid rgba(232, 234, 237, ${grow})`,
            boxShadow: `0 1px 2px rgba(16, 24, 40, ${0.05 * grow}), 0 16px 40px -12px rgba(16, 24, 40, ${0.1 * grow})`,
            maskImage: `linear-gradient(to bottom, #000 calc(100% - 120px), rgba(0, 0, 0, ${1 - grow}))`,
          }}
        >
          {/* Phone screens, zoomed with the growing screen while they fade out */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: SCREEN.w,
              height: SCREEN.h,
              scale: zoom,
              transformOrigin: "0px 0px",
              opacity: mobile,
            }}
          >
            <Sequence name="Recording → recap" durationInFrames={Math.round((T.toNotes + 0.6) * fps)}>
              <AbsoluteFill style={{ translate: `${-0.3 * SCREEN.w * push}px 0px`, opacity: 1 - 0.5 * push }}>
                <RecordingFlow />
              </AbsoluteFill>
            </Sequence>
            <Sequence name="Notes" from={Math.round(T.toNotes * fps)}>
              <AbsoluteFill
                style={{
                  translate: `${(1 - push) * SCREEN.w}px 0px`,
                  boxShadow: `-16px 0 32px rgba(16, 24, 40, ${0.12 * (1 - push)})`,
                }}
              >
                <NotesScreen />
              </AbsoluteFill>
            </Sequence>
          </div>

          <Sequence name="Desktop recap" from={Math.round(T.desktopReveal * fps)}>
            <DesktopRecap linkedDocs={linkedDocs} />
          </Sequence>
        </Phone>
      </AbsoluteFill>

      {tabs ? (
        <Sequence name="Desktop tabs" from={Math.round((T.growEnd - 0.1) * fps)}>
        <DesktopTabs />
      </Sequence>
      ) : null}

      {hideCursor ? null : (
        <Sequence name="Taps">
          {TAPS.map((tap) => (
            <Touch key={tap.at} {...tap} />
          ))}
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
