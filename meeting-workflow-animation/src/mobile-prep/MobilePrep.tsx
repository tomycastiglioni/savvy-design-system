import "./fonts";
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Banner } from "./components/Banner";
import { HomeIndicator, StatusBar } from "./components/SystemUI";
import { FONT, H, SCALE, W } from "./layout";
import { PrepScreen } from "./screens/PrepScreen";
import { TodayScreen } from "./screens/TodayScreen";
import { T } from "./timeline";

// iPhone screen recording, 1080×2348: the "prep ready" notification arrives
// over the advisor's day and opens the prep. No touches; the phone plays itself.
export const MobilePrep: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
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
        <TodayScreen />
        <Sequence from={Math.round(T.push * fps)} layout="none">
          <PrepScreen />
        </Sequence>
        <StatusBar />
        <Banner />
        <HomeIndicator />
      </div>
    </AbsoluteFill>
  );
};
