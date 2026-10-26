import React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NOTIFICATION } from "../content";
import { CLAMP, IOS, W } from "../layout";
import { T } from "../timeline";

const TOP = 46;
const SIDE = 8;
const ICON = 38;
const HIDDEN = -(TOP + 130); // fully above the screen

// iOS notification banner: drops in on a lightly damped spring, holds, then
// slides back up the way it does when tapped.
export const Banner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const drop = spring({ frame: frame - T.bannerIn * fps, fps, config: { damping: 20, stiffness: 170, mass: 0.9 } });
  const out = interpolate(t, [T.bannerOut, T.bannerOut + 0.26], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  if (t < T.bannerIn || out >= 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: SIDE,
        width: W - 2 * SIDE,
        top: TOP,
        translate: `0px ${HIDDEN * (1 - drop) + HIDDEN * out}px`,
        opacity: 1 - 0.4 * out,
        borderRadius: 22,
        background: "rgba(244, 244, 246, 0.96)",
        backdropFilter: "blur(24px) saturate(180%)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(0, 0, 0, 0.05)",
        padding: "13px 16px 14px 14px",
        display: "flex",
        gap: 10,
        fontFamily: IOS.font,
        color: IOS.label,
        letterSpacing: "-0.01em",
      }}
    >
      <Img src={staticFile("images/savvy-app-icon.svg")} style={{ width: ICON, height: ICON, borderRadius: 8.5, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 15, lineHeight: "20px", fontWeight: 600 }}>{NOTIFICATION.app}</div>
          <div style={{ fontSize: 13, color: IOS.secondary }}>now</div>
        </div>
        <div style={{ fontSize: 15, lineHeight: "20px", textWrap: "balance" }}>{NOTIFICATION.body}</div>
      </div>
    </div>
  );
};
