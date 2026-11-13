import "../mobile-prep/fonts";
import { Audio } from "@remotion/media";
import { Camera, Flashlight, Lock } from "lucide-react";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HomeIndicator, StatusBar } from "../mobile-prep/components/SystemUI";
import { H, IOS, SCALE, W } from "../mobile-prep/layout";

// The commercial's lock screen, just before the follow-up: the iPhone is
// locked and a Savvy notification comes in, "Savvy" / "Notification" (the scene
// is under a second, so nothing more). 1080×2348 at 60 fps, the app icon is
// the S mark on white (public/mobile-commercial/savvy-app-icon-mark.png).

export const NOTIFY_T = { arrive: 0.2, end: 2 };
const CLOCK = { time: "11:45", date: "Friday, November 13" };

const Wallpaper: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(165deg, #2a6b57 0%, #16473a 42%, #0b2c24 100%)" }}>
    <div style={{ position: "absolute", left: -90, top: 360, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(164,230,212,0.38) 0%, rgba(164,230,212,0) 70%)" }} />
    <div style={{ position: "absolute", left: 150, top: 80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(211,205,196,0.22) 0%, rgba(211,205,196,0) 70%)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.18) 100%)" }} />
  </AbsoluteFill>
);

const AppIcon: React.FC<{ readonly size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.225, background: "#ffffff", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Img src={staticFile("mobile-commercial/savvy-app-icon-mark.png")} style={{ width: size * 1.05, height: size * 1.05, display: "block" }} />
  </div>
);

const Round: React.FC<{ readonly children: React.ReactNode; readonly left?: number; readonly right?: number }> = ({ children, left, right }) => (
  <div style={{ position: "absolute", left, right, top: 700, width: 50, height: 50, borderRadius: 25, background: "rgba(0,0,0,0.28)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
    {children}
  </div>
);

const Screen: React.FC<{ readonly t: number; readonly fps: number }> = ({ t, fps }) => {
  const p = spring({ frame: Math.max(0, (t - NOTIFY_T.arrive) * fps), fps, config: { damping: 16, stiffness: 190, mass: 0.7 } });
  const shown = t >= NOTIFY_T.arrive;
  return (
    <AbsoluteFill style={{ fontFamily: IOS.font, color: "#ffffff" }}>
      <Wallpaper />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center", opacity: 0.9 }}>
        <Lock size={15} strokeWidth={2.4} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", fontSize: 19, fontWeight: 600, opacity: 0.88 }}>{CLOCK.date}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center", fontSize: 96, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>{CLOCK.time}</div>
      {/* the notification, rising in from the bottom of the stack */}
      {shown ? (
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            top: 604,
            height: 70,
            borderRadius: 24,
            background: "rgba(246,246,246,0.62)",
            backdropFilter: "blur(24px) saturate(1.6)",
            boxShadow: "0 8px 24px -10px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 14px",
            color: "#000000",
            opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
            translate: `0px ${(1 - p) * 46}px`,
            scale: 0.92 + 0.08 * p,
          }}
        >
          <AppIcon size={40} />
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: "-0.01em" }}>Savvy</div>
            <div style={{ fontSize: 15.5, marginTop: 1 }}>Notification</div>
          </div>
        </div>
      ) : null}
      <Round left={44}>
        <Flashlight size={20} strokeWidth={2} />
      </Round>
      <Round right={44}>
        <Camera size={20} strokeWidth={2} />
      </Round>
    </AbsoluteFill>
  );
};

export const CommercialNotification: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // the screen is already lit; a hair of a brighten as the banner lands
  const glow = interpolate(t, [NOTIFY_T.arrive, NOTIFY_T.arrive + 0.15, NOTIFY_T.arrive + 0.6], [0, 0.06, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, scale: SCALE, transformOrigin: "0 0", overflow: "hidden" }}>
        <Screen t={t} fps={fps} />
        <AbsoluteFill style={{ background: "#ffffff", opacity: glow, pointerEvents: "none" }} />
        <StatusBar time="" light />
        <HomeIndicator light />
      </div>
      <Sequence from={Math.round((NOTIFY_T.arrive - 0.02) * fps)} durationInFrames={Math.round(1.2 * fps)} layout="none">
        <Audio src={staticFile("audio/launch/chime.mp3")} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};
