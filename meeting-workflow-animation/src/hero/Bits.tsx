import React from "react";
import { Icon } from "../more-ways/Bits";
import { C, FONT, MEDIUM } from "../more-ways/theme";

// The website hero's pill graphics (Savvy Intelligence hero): one short
// animated graphic per pill, in the style of the "More ways" bento cards,
// 620×360 (the hero's graphic area, ~1.72:1), transparent to sit on the
// hero's dark teal. Shared pieces.

export const W = 620;
export const H = 360;
export const CARD = { x: 20, y: 14, w: 580, h: 332 };
export const PAGE = "#0b2c3b"; // the hero's background, for previews

export const Frame: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT, color: C.ink }}>{children}</div>
);

// The white UI card, with absolutely placed children in card px.
export const Panel: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      left: CARD.x,
      top: CARD.y,
      width: CARD.w,
      height: CARD.h,
      background: "#ffffff",
      borderRadius: 11,
      border: `0.7px solid ${C.border}`,
      boxShadow: "0 18px 40px -20px rgba(0,0,0,0.45)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Initials: React.FC<{ readonly text: string; readonly size?: number; readonly tone?: "green" | "blue" | "violet" | "amber" | "grey" }> = ({ text, size = 34, tone = "green" }) => {
  const t = { green: [C.greenSoft, C.green], blue: ["#dcecf6", "#1f5c80"], violet: ["#ece3f6", "#5b3d87"], amber: ["#f6e6d9", "#8a4b1f"], grey: ["#eceef1", "#4c5565"] }[tone];
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: t[0], color: t[1], fontSize: size * 0.34, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {text}
    </div>
  );
};

export const MarkAvatar: React.FC<{ readonly size?: number }> = ({ size = 34 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: "#f3f7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon name="savvy-mark" w={size * 0.56} />
  </div>
);

// The card's header row and the rule under it (at y 62).
export const Head: React.FC<{ readonly lead: React.ReactNode; readonly title: string; readonly sub: string; readonly right?: React.ReactNode }> = ({ lead, title, sub, right }) => (
  <>
    <div style={{ position: "absolute", left: 20, top: 15, display: "flex", alignItems: "center", gap: 11 }}>
      {lead}
      <div>
        <div style={{ fontWeight: MEDIUM, fontSize: 15, color: C.ink, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2, whiteSpace: "nowrap" }}>{sub}</div>
      </div>
    </div>
    {right ? <div style={{ position: "absolute", right: 20, top: 20 }}>{right}</div> : null}
    <div style={{ position: "absolute", left: 20, right: 20, top: 62, height: 1, background: C.border }} />
  </>
);

export const Label: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 9.5, fontWeight: MEDIUM, letterSpacing: "0.05em", textTransform: "uppercase", color: C.muted, whiteSpace: "nowrap", ...style }}>{children}</div>
);

export const Done: React.FC<{ readonly size?: number }> = ({ size = 14 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon name="check-dark" w={size * 0.56} />
  </div>
);

export const Button: React.FC<{ readonly children: React.ReactNode; readonly primary?: boolean; readonly press?: number; readonly style?: React.CSSProperties }> = ({ children, primary = true, press = 0, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 30,
      padding: "0 13px",
      borderRadius: 7,
      background: primary ? C.green : "#ffffff",
      border: primary ? undefined : `1px solid ${C.border}`,
      color: primary ? "#ffffff" : C.ink,
      fontWeight: MEDIUM,
      fontSize: 11.5,
      whiteSpace: "nowrap",
      scale: 1 - 0.05 * press,
      ...style,
    }}
  >
    {children}
  </div>
);

// A small switch (0 off → 1 on).
export const Switch: React.FC<{ readonly on: number }> = ({ on }) => (
  <div style={{ position: "relative", width: 26, height: 15, borderRadius: 8, background: on > 0.5 ? C.green2 : "#d7dce2", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 2, left: 2 + 11 * on, width: 11, height: 11, borderRadius: 6, background: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
  </div>
);

export const c01 = (n: number) => Math.min(1, Math.max(0, n));
