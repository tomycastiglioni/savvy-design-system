import React from "react";
import { Img, staticFile } from "remotion";

// Savvy wordmark (public/images/savvy-logo.svg, 281×95 viewBox). Ink starts
// at the image's top-left, so `x`/`y` are the ink edges.
export const LOGO_RATIO = 281 / 95;

export const Logo: React.FC<{
  readonly h: number;
  readonly style?: React.CSSProperties;
}> = ({ h, style }) => (
  <Img
    src={staticFile("images/savvy-logo.svg")}
    style={{ display: "block", height: h, width: h * LOGO_RATIO, ...style }}
  />
);
