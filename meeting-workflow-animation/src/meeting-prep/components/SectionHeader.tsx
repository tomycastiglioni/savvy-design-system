import { GripVertical } from "lucide-react";
import React from "react";
import { C } from "../theme";

export const SectionHeader: React.FC<{
  readonly title: string;
  readonly count?: string;
}> = ({ title, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: -22 }}>
    <GripVertical size={16} strokeWidth={2} color={C.faint} />
    <div style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>
      {title}
      {count ? <span style={{ color: C.faint, fontWeight: 400 }}> {count}</span> : null}
    </div>
  </div>
);
