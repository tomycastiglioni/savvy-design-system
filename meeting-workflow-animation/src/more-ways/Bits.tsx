import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, MEDIUM } from "./theme";

// Icons exported from Figma (public/more-ways/icons/), at their own size.
export type IconName =
  | "savvy-mark"
  | "savvy-mark-lg"
  | "paperclip"
  | "audio-lines"
  | "send-white"
  | "send-pill"
  | "ts-initials"
  | "arrow-up-right"
  | "dots"
  | "layers"
  | "chart"
  | "square-check"
  | "file-text"
  | "users"
  | "check-dark"
  | "check-small"
  | "check-green"
  | "chevron-up"
  | "file-text-white"
  | "folder-white"
  | "chip-chart"
  | "chip-users"
  | "chip-square-plus"
  | "chip-refresh"
  | "chip-mail"
  | "chip-calendar"
  | "chip-circle-check"
  | "chip-layers";
export const Icon: React.FC<{ readonly name: IconName; readonly w: number; readonly h?: number; readonly style?: React.CSSProperties }> = ({ name, w, h = w, style }) => (
  <Img src={staticFile(`more-ways/icons/${name}.svg`)} style={{ width: w, height: h, display: "block", flexShrink: 0, ...style }} />
);

// Text caret, for typing.
export const Caret: React.FC<{ readonly h: number; readonly color?: string; readonly on?: boolean }> = ({ h, color = "#1d2334", on = true }) => (
  <span style={{ display: "inline-block", width: 1.5, height: h, marginLeft: 1, verticalAlign: "middle", background: color, opacity: on ? 1 : 0 }} />
);

// Status pill (Due soon / Ready / RMD review…).
export const Pill: React.FC<{ readonly tone: "green" | "amber"; readonly size?: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({
  tone,
  size = 12,
  children,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.42,
      padding: `${size * 0.42}px ${size}px`,
      borderRadius: 20,
      background: tone === "green" ? C.greenBg : C.amberBg,
      color: tone === "green" ? C.greenInk : C.amberInk,
      fontFamily: FONT,
      fontWeight: MEDIUM,
      fontSize: size,
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// The light glass chip from "And a whole lot more…", for results shown on the
// dark card (icon + label).
export const GlassChip: React.FC<{
  readonly icon?: IconName;
  readonly label: string;
  readonly size?: number;
  readonly style?: React.CSSProperties;
  readonly lit?: number;
  readonly extra?: React.ReactNode;
}> = ({
  icon,
  label,
  size = 13.893,
  style,
  lit = 0,
  extra,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.667,
      padding: `${size}px ${size * 1.333}px ${size}px ${size * 1.167}px`,
      borderRadius: size * 0.5,
      background: `rgba(255, 255, 255, ${0.13 + 0.12 * lit})`,
      boxShadow: `0 3.47px 9.26px rgba(81, 69, 45, 0.03)${lit > 0 ? `, 0 0 0 1px rgba(206, 237, 205, ${0.45 * lit})` : ""}`,
      fontFamily: FONT,
      fontWeight: MEDIUM,
      fontSize: size,
      lineHeight: 1.35,
      color: "#ffffff",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {icon ? <Icon name={icon} w={size * 1.2665} /> : null}
    {label}
    {extra}
  </div>
);

// A loading bar (skeleton line).
export const Skeleton: React.FC<{ readonly w: number | string; readonly h?: number; readonly style?: React.CSSProperties }> = ({ w, h = 8, style }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: "linear-gradient(90deg, #eceef1, #f5f6f8, #eceef1)", ...style }} />
);

// Arrow cursor (the launch kit's), tip at (x, y).
export const Pointer: React.FC<{ readonly x: number; readonly y: number; readonly scale?: number }> = ({ x, y, scale = 0.9 }) => (
  <Img src={staticFile("images/cursor-arrow.svg")} style={{ position: "absolute", left: x - 9.15 * scale, top: y - 6.03 * scale, width: 31 * scale, height: 33 * scale }} />
);
