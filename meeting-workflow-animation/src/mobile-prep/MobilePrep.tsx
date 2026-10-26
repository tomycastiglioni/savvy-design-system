import "./fonts";
import React from "react";
import { AbsoluteFill } from "remotion";
import { HomeIndicator, StatusBar } from "./components/SystemUI";
import { FONT, H, SCALE, W } from "./layout";
import { MorningScreen } from "./screens/MorningScreen";

// iPhone screen recording, 1080×2348: the morning screen loads the next
// meeting's prep and shows it in four short rows. No touches; the phone plays
// itself.
export const MobilePrep: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: H,
        scale: SCALE,
        transformOrigin: "0 0",
        overflow: "hidden",
        fontFamily: FONT.sans,
      }}
    >
      <MorningScreen />
      <StatusBar />
      <HomeIndicator />
    </div>
  </AbsoluteFill>
);
