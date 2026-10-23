import { Mic } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { Waveform } from "../components/Waveform";
import { C, CLAMP, EASE_IN_OUT, M, MOBILE, SCREEN } from "../layout";
import { MEETING } from "../content";
import { T } from "../timeline";

const W = SCREEN.w;

// Screen-relative row geometry for the two status rows ("Recording" and
// "Transcribing") so the AI icon can travel from its row to the center.
const REC_ROW = { iconX: 104, textX: 136 };
const TRANS_ROW = { iconCx: 106, textX: 128 };

// Mounted at frame 0 (local = absolute): Recording → Transcribing → Writing your recap.
export const RecordingFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Each change is sequential: old content leaves (out), shared elements glide
  // (move), then new content arrives (in), so text never ghosts over text.
  const phase = (start: number, from: number, to: number) =>
    interpolate(t, [start + from, start + to], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const toB = phase(T.toTranscribing, 0, 0.45);
  const outB = phase(T.toTranscribing, 0, 0.2);
  const inB = phase(T.toTranscribing, 0.2, 0.45);
  const outC = phase(T.toWriting, 0, 0.22);
  const toC = phase(T.toWriting, 0.05, 0.5);
  const inC = phase(T.toWriting, 0.25, 0.5);
  const press = Math.max(
    ...[T.tapStop, T.tapRecap].map((at) => interpolate(t, [at - 0.04, at + 0.04, at + 0.2], [0, 1, 0], CLAMP)),
  );
  const timer = t < T.tick1 ? "32:03" : t < T.tick2 ? "32:04" : "32:05";

  // Shared AI icon: from the "Transcribing" row to the center of "Writing your recap".
  const iconSize = 24 + (66 - 24) * toC;
  const iconCx = TRANS_ROW.iconCx + (W / 2 - TRANS_ROW.iconCx) * toC;
  const iconCy = MOBILE.statusY + 14 + (MOBILE.iconCenterY - (MOBILE.statusY + 14)) * toC;

  const nameY = MOBILE.nameY + (MOBILE.writingNameY - MOBILE.nameY) * toC;
  const primaryY = MOBILE.stopY + (MOBILE.backY - MOBILE.stopY) * toC;

  const label = (text: string, opacity: number) => (
    <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity }}>{text}</span>
  );

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* Timer + waveform */}
      <div style={{ position: "absolute", left: 0, width: W, top: MOBILE.timerY, opacity: 1 - outC, translate: `0px ${-12 * outC}px` }}>
        <div style={{ textAlign: "center", fontSize: 66, fontWeight: 500, color: C.ink, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
          {timer}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: W, top: MOBILE.waveY - 15, opacity: 1 - outC, translate: `0px ${-12 * outC}px` }}>
        <Waveform color={interpolateColors(toB, [0, 1], [M.red, M.wave])} energy={1 - 0.65 * toB} />
      </div>

      {/* Recording row */}
      <div style={{ position: "absolute", top: MOBILE.statusY, left: REC_ROW.iconX, opacity: 1 - outB, translate: `0px ${-6 * outB}px` }}>
        <Mic size={26} strokeWidth={2.4} color={M.red} />
      </div>
      <div style={{ position: "absolute", top: MOBILE.statusY - 1, left: REC_ROW.textX, fontSize: 22, fontWeight: 600, color: C.ink, opacity: 1 - outB, translate: `0px ${-6 * outB}px` }}>
        Recording
      </div>

      {/* Transcribing row */}
      <div style={{ position: "absolute", top: MOBILE.statusY - 1, left: TRANS_ROW.textX, fontSize: 22, fontWeight: 600, color: C.ink, opacity: inB * (1 - outC), translate: `0px ${6 * (1 - inB)}px` }}>
        Transcribing
      </div>
      <div style={{ position: "absolute", left: iconCx - iconSize / 2, top: iconCy - iconSize / 2, opacity: inB }}>
        <AIIcon size={iconSize} style={{ rotate: `${Math.max(0, t - T.toTranscribing) * 150}deg` }} />
      </div>

      {/* Writing your recap */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          top: MOBILE.writingTitleY,
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          color: C.ink,
          opacity: inC,
          translate: `0px ${(1 - inC) * 10}px`,
        }}
      >
        Writing your recap
      </div>
      <div style={{ position: "absolute", left: 0, width: W, top: nameY, textAlign: "center", fontSize: 15 + 1.5 * toC, color: C.muted }}>
        {MEETING.household}
      </div>

      {/* Buttons */}
      <div
        style={{
          position: "absolute",
          left: MOBILE.buttonX,
          width: W - 2 * MOBILE.buttonX,
          top: MOBILE.pauseY,
          height: MOBILE.buttonH,
          borderRadius: MOBILE.buttonH / 2,
          background: M.buttonMuted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13.5,
          fontWeight: 600,
          color: C.ink,
          opacity: 1 - outB,
          translate: `0px ${10 * outB}px`,
        }}
      >
        Pause
      </div>
      <div
        style={{
          position: "absolute",
          left: MOBILE.buttonX,
          width: W - 2 * MOBILE.buttonX,
          top: primaryY,
          height: MOBILE.buttonH,
          borderRadius: MOBILE.buttonH / 2,
          background: M.button,
          color: C.white,
          fontSize: 13.5,
          fontWeight: 600,
          scale: 1 - 0.03 * press,
          filter: `brightness(${1 - 0.15 * press})`,
        }}
      >
        {label("Stop", 1 - outB)}
        {label("Stop and get recap", inB * (1 - outC))}
        {label("Back to the household", inC)}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          top: MOBILE.discardY,
          textAlign: "center",
          fontSize: 13,
          fontWeight: 600,
          color: interpolateColors(toB, [0, 1], [M.link, M.linkMuted]),
          opacity: 1 - outC,
        }}
      >
        Discard recording
      </div>
    </AbsoluteFill>
  );
};
