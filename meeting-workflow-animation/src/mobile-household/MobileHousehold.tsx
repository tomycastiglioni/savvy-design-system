import "../mobile-prep/fonts";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { HomeIndicator, StatusBar } from "../mobile-prep/components/SystemUI";
import { C, FONT, H, SCALE, W } from "../mobile-prep/layout";
import { HouseholdScreen } from "./screens/HouseholdScreen";
import { MobileHouseholdSfx } from "./Sfx";

// iPhone screen recording, 1080×2348: the household behind "Open prep" in
// MobilePrep. The summary and agenda fill in, then hold to be read. No touches.
export const MobileHousehold: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, scale: SCALE, transformOrigin: "0 0", overflow: "hidden", fontFamily: FONT.sans }}>
        <HouseholdScreen t={frame / fps} fps={fps} />
        <StatusBar />
        <HomeIndicator />
      </div>
      <MobileHouseholdSfx />
    </AbsoluteFill>
  );
};
