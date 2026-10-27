import React from "react";
import { FONT } from "../layout";

const NAVY = "#1E3A5F";

// Placeholder logo for the advisor's wealth firm (fictional), shown on the
// client document so it reads as the firm's own material.
export const FirmLogo: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: FONT.sans }}>
    <svg width={30} height={30} viewBox="0 0 30 30" style={{ display: "block", flexShrink: 0 }}>
      <rect width={30} height={30} rx={7} fill={NAVY} />
      <path d="M6 21.5 11.8 11.5 15.6 17.6 18.6 13.2 24 21.5Z" fill="#FFFFFF" />
    </svg>
    <div style={{ lineHeight: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: NAVY }}>HALDEN &amp; ROWE</div>
      <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: "0.2em", color: "#5B6B80", marginTop: 4 }}>WEALTH PARTNERS</div>
    </div>
  </div>
);
