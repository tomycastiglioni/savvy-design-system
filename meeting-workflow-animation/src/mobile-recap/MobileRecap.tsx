import "../mobile-prep/fonts";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { HomeIndicator, StatusBar } from "../mobile-prep/components/SystemUI";
import { C, FONT, H, SCALE, W } from "../mobile-prep/layout";
import { RecapScreen } from "./screens/RecapScreen";
import { MobileRecapSfx } from "./Sfx";

// iPhone screen recording, 1080×2348: the recap of the Dave R. review fills
// in, then the follow-up is sent. No visible touches, as in a real recording.
export const MobileRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, scale: SCALE, transformOrigin: "0 0", overflow: "hidden", fontFamily: FONT.sans }}>
        <RecapScreen t={frame / fps} fps={fps} />
        <StatusBar />
        <HomeIndicator />
      </div>
      <MobileRecapSfx />
    </AbsoluteFill>
  );
};
