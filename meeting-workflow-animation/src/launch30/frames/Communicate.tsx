import { Mic } from "lucide-react";
import React from "react";
import { Phone } from "../../capture/components/Phone";
import { Waveform } from "../../capture/components/Waveform";
import { AIIcon } from "../../shared/components/AIIcon";
import { Bg, BgSweep, Card, Headline, HouseholdChip } from "../components/Bits";
import { AbstractChart } from "../components/Chart";
import { Tracker } from "../components/Tracker";
import { C, FONT, phase, UI } from "../theme";

const P = phase("communicate");
const RED = "#AD3A35";

const Slider: React.FC<{ readonly label: string; readonly value: string; readonly p: number; readonly hot?: boolean }> = ({ label, value, p, hot = false }) => (
  <div style={{ width: 360 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: C.ink }}>
      <span style={{ fontWeight: 500 }}>{label}</span>
      <span
        style={{
          fontWeight: 700,
          padding: hot ? "1px 8px" : 0,
          borderRadius: 6,
          background: hot ? C.green50 : "transparent",
          color: hot ? C.green : C.ink,
        }}
      >
        {value}
      </span>
    </div>
    <div style={{ position: "relative", height: 6, borderRadius: 3, background: "#E5E7EB", marginTop: 16 }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, borderRadius: 3, background: C.green }} />
      <div
        style={{
          position: "absolute",
          left: `${p * 100}%`,
          top: 3,
          width: 24,
          height: 24,
          translate: "-50% -50%",
          borderRadius: "50%",
          background: C.white,
          border: `3px solid ${C.green}`,
          boxShadow: hot ? "0 0 0 8px rgba(23, 82, 66, 0.15)" : "none",
        }}
      />
    </div>
  </div>
);

// The presented plan: the same chart that left the prep.
const Presentation: React.FC<{ readonly after?: boolean; readonly style?: React.CSSProperties }> = ({ after = false, style }) => (
  <Card style={{ left: UI.x, top: 250, width: UI.w, height: 660, ...style }}>
    <div style={{ position: "absolute", left: 44, top: 40, fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>Retirement plan</div>
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 46,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 14px",
        borderRadius: 999,
        background: C.green50,
        color: C.green,
        fontSize: 16,
        fontWeight: 600,
      }}
    >
      <div style={{ width: 9, height: 9, borderRadius: 5, background: C.green }} /> Presenting
    </div>
    <div style={{ position: "absolute", left: 44, top: 128 }}>
      <AbstractChart w={812} h={330} color={C.green} growth={after ? 1.18 : 0.95} ghost={after ? 0.95 : undefined} endLabel={after ? "$25.1M" : "$22.5M"} years />
    </div>
    <div style={{ position: "absolute", left: 44, right: 44, top: 506, height: 1, background: "#EEF0F2" }} />
    <div style={{ position: "absolute", left: 44, top: 540, display: "flex", gap: 92 }}>
      <Slider label="Contributions" value={after ? "$65K" : "$50K"} p={after ? 0.65 : 0.5} hot={after} />
      <Slider label="Retirement age" value="67" p={0.55} />
    </div>
  </Card>
);

// The recording phone; `writing` shows the recap being written instead.
const RecordingPhone: React.FC<{ readonly x: number; readonly y: number; readonly writing?: boolean }> = ({ x, y, writing = false }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
    <Phone screen={{ x, y, w: 340, h: 700 }} radius={50}>
      {writing ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 250 }}>
          <AIIcon size={84} />
          <div style={{ fontSize: 24, fontWeight: 600, color: C.ink, marginTop: 34 }}>Writing your recap</div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 200, height: 10, borderRadius: 5, background: "#E6E9ED" }} />
            <div style={{ width: 150, height: 10, borderRadius: 5, background: "#E6E9ED" }} />
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 200 }}>
          <div style={{ fontSize: 72, fontWeight: 500, color: C.ink, letterSpacing: "-0.02em" }}>32:05</div>
          <div style={{ marginTop: 26, scale: 1.25 }}>
            <Waveform color={RED} energy={1} />
          </div>
          <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 8, fontSize: 24, fontWeight: 600, color: C.ink }}>
            <Mic size={26} strokeWidth={2.4} color={RED} /> Recording
          </div>
          <div style={{ marginTop: 22, scale: 0.82 }}>
            <HouseholdChip meeting={false} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 64,
              height: 46,
              borderRadius: 23,
              background: "#16473A",
              color: C.white,
              fontSize: 17,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Stop
          </div>
        </div>
      )}
    </Phone>
  </div>
);

const PresentHeadline: React.FC = () => <Headline eyebrow="Live presentation" color={P.accent} lines={["Plan live,", "together"]} />;

// F6 · 0:10 — presenting the plan from the prep.
export const F06Present: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <PresentHeadline />
    <Presentation />
  </>
);

// F7 · 0:12.5 — a what-if, answered live.
export const F07WhatIf: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <PresentHeadline />
    <Presentation after />
  </>
);

// F8 · 0:14.5 — the same meeting, recorded: presentation behind, phone in front.
export const F08Capture: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <Headline eyebrow="Meeting capture" color={P.accent} lines={["Every word,", "on the record"]} />
    <Presentation after style={{ left: 820, top: 270, scale: 0.84, opacity: 0.5, transformOrigin: "0 0" }} />
    <RecordingPhone x={1340} y={210} />
  </>
);

// F9 · 0:17 — hand-off: the recording becomes the recap. Blue sweeps in.
export const F09Writing: React.FC = () => (
  <>
    <BgSweep from="mint" to="blue" at={0.7} />
    <Tracker step={1} toward={0.5} />
    <RecordingPhone x={790} y={210} writing />
  </>
);
