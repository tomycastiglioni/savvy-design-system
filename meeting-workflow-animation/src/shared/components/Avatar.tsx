import { Users } from "lucide-react";
import React from "react";
import { Img, staticFile } from "remotion";
import { C } from "../theme";

// `heather` uses the supplied photo (public/images/heather.png); `team` shows
// the ops team glyph.
export const Avatar: React.FC<{
  readonly size: number;
  readonly person: "heather" | "team";
}> = ({ size, person }) => {
  if (person === "heather") {
    return (
      <Img
        src={staticFile("images/heather.png")}
        style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, display: "block" }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: C.borderSoft,
        color: C.muted,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Users size={size * 0.55} strokeWidth={2} />
    </div>
  );
};
