import React from "react";
import { Img, staticFile } from "remotion";
import { C } from "../theme";

// Official Savvy Intelligence mark (public/images/ai-icon.svg).
export const AIIcon: React.FC<{
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ size, style }) => (
  <Img
    src={staticFile("images/ai-icon.svg")}
    style={{ width: size, height: size, display: "block", flexShrink: 0, ...style }}
  />
);

// The mark on its mint circle, as used for Savvy Intelligence notifications.
export const AIIconAvatar: React.FC<{ readonly size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: C.green100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <AIIcon size={size * 0.6} />
  </div>
);
