import { Users } from "lucide-react";
import React from "react";
import { C } from "../theme";

export const Avatar: React.FC<{
  readonly size: number;
  readonly initials?: string;
  readonly team?: boolean;
}> = ({ size, initials, team = false }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: team ? C.borderSoft : C.green50,
        color: team ? C.muted : C.green,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 600,
        letterSpacing: "0.02em",
        boxShadow: `0 0 0 ${Math.max(1, size / 28)}px ${C.white}, 0 0 0 ${Math.max(2, size / 14)}px ${C.borderSoft}`,
      }}
    >
      {team ? <Users size={size * 0.55} strokeWidth={2} /> : initials}
    </div>
  );
};
