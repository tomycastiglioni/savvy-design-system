import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Capture } from "../../capture/Capture";
import { DOC_PANEL, PHONE, TABS_BAR } from "../../capture/layout";
import { T } from "../../capture/timeline";
import { Card } from "../../launch30/components/Bits";
import { ProfileCardContent } from "../../launch30/frames/Communicate";
import { CLAMP, EASE_IN_OUT, EASE_OUT, FONT } from "../../shared/theme";
import { anchor, Camera, CameraKey, viewAt } from "../Camera";
import { AdLayout, byFormat, MARGIN_X, useAdLayout } from "../layout";

// Ad 03 · Capture: the workflow video through a camera. While the phone
// records, transcribes and writes the recap (1.15× in 4:5, on the right margin, 30 px
// under the graphic line, its screen content moved up 30 px), the client's CRM
// profile sits on the text margin overlapping it, as in the launch video: its
// meeting notes fill in and "Syncing" turns to "Synced" when the notes open on
// the phone. It leaves as the phone grows into the desktop recap, where the
// camera moves to 1.2× with the recap's tab bar on the text margin.
// The CRM profile card (the launch video's, a little narrower) is centred on
// the visible part of the phone and overlaps only its frame (at most 1.1×). It
// is in before the ad's first frame, so the opening shows both.
const PROFILE = { w: 480, h: 238 };
const SYNC = { in: 0.1, notes: [0.6, 4.6] as const, synced: T.toNotes, out: T.growStart - 0.35 };

const captureLayout = (lay: AdLayout) => {
  const phoneS = byFormat(lay.format, { "4x5": 1.15, "1x1": 0.95, "9x16": 1.3 });
  const phoneTop = lay.top + 30;
  const PHONE_VIEW = { x: lay.w - MARGIN_X - (PHONE.x + PHONE.w) * phoneS, y: phoneTop - PHONE.y * phoneS, s: phoneS };
  const DESK_VIEW = anchor(DOC_PANEL.x, TABS_BAR.y, MARGIN_X, lay.top, byFormat(lay.format, { "4x5": 1.2, "1x1": 1.05, "9x16": 1.35 }));
  const KEYS: CameraKey[] = [
    { t: 0, ...PHONE_VIEW },
    { t: T.growStart, ...PHONE_VIEW },
    { t: T.growEnd, ...DESK_VIEW },
  ];
  const phoneLeft = lay.w - MARGIN_X - PHONE.w * phoneS;
  const profileS = Math.min(1.1, (phoneLeft + 28 - MARGIN_X) / PROFILE.w);
  const visibleBottom = Math.min(lay.safeBottom, phoneTop + PHONE.h * phoneS);
  const profileY = (phoneTop + visibleBottom) / 2 - (PROFILE.h * profileS) / 2;
  return { KEYS, profileS, profileY };
};
const useCaptureLayout = () => {
  const lay = useAdLayout("capture");
  return useMemo(() => captureLayout(lay), [lay.format]); // eslint-disable-line react-hooks/exhaustive-deps
};

const Profile: React.FC<{ readonly t: number }> = ({ t }) => {
  const { profileS, profileY } = useCaptureLayout();
  const rise = interpolate(t, [SYNC.in, SYNC.in + 0.45], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const gone = interpolate(t, [SYNC.out, SYNC.out + 0.3], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  if (rise <= 0 || gone >= 1) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN_X,
        top: profileY,
        width: PROFILE.w,
        height: PROFILE.h,
        scale: profileS,
        transformOrigin: "0 0",
        fontFamily: FONT.sans,
        opacity: interpolate(t, [SYNC.in, SYNC.in + 0.25], [0, 1], { ...CLAMP, easing: Easing.linear }) * (1 - gone),
        translate: `0px ${(1 - rise) * 36}px`,
        filter: gone > 0 ? `blur(${gone * 6}px)` : undefined,
      }}
    >
      <Card style={{ left: 0, top: 0, width: PROFILE.w, height: PROFILE.h, borderRadius: 18 }}>
        <ProfileCardContent
          notes={interpolate(t, [...SYNC.notes], [0, 1], { ...CLAMP, easing: Easing.linear })}
          synced={interpolate(t, [SYNC.synced, SYNC.synced + 0.3], [0, 1], { ...CLAMP, easing: Easing.linear })}
          spin={(t - SYNC.in) * 300}
        />
      </Card>
    </div>
  );
};

export const AdCapture: React.FC = () => {
  const { KEYS } = useCaptureLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <>
      <Camera view={viewAt(KEYS, t)}>
        <Capture transparent screenShift={30} />
      </Camera>
      <Profile t={t} />
    </>
  );
};
