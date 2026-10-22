import React from "react";
import { C } from "../theme";

// Savvy Intelligence mark, redrawn as four pinwheeled petals. Swap for the
// official SVG when available.
const PETAL = "M0 0 C 10.5 -4, 10.5 -16.5, 0 -20.5 C -10.5 -16.5, -10.5 -4, 0 0 Z";

export const SIMark: React.FC<{
  readonly size: number;
  readonly stroke?: string;
  readonly fill?: string;
  readonly strokeWidth?: number;
}> = ({ size, stroke = C.green, fill = C.green100, strokeWidth = 2 }) => {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48">
      {[45, 135, 225, 315].map((r) => (
        <path
          key={r}
          d={PETAL}
          transform={`rotate(${r}) translate(4.5 0)`}
          fill={fill}
          fillOpacity={0.55}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};
