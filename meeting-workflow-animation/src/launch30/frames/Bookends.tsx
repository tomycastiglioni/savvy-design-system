import React from "react";
import { Logo } from "../../launch/components/Logo";
import { Bg, HouseholdChip } from "../components/Bits";
import { PhaseMap } from "../components/Tracker";
import { DIATYPE, TRI_GRADIENT } from "../theme";

const Lockup: React.FC<{ readonly h: number; readonly lead?: string }> = ({ h, lead }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: h * 0.3,
      fontFamily: DIATYPE,
      fontSize: h * 0.72,
      color: "#000000",
    }}
  >
    {lead ? <span>{lead}</span> : null}
    <Logo h={h} style={{ translate: `0px ${h * 0.06}px` }} />
    <span>Intelligence 2.0</span>
  </div>
);

const Title: React.FC<{ readonly top: number; readonly size?: number; readonly children: React.ReactNode }> = ({ top, size = 64, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: DIATYPE, fontSize: size, color: "#000000" }}>{children}</div>
);

// F1 · 0:00 — title card.
export const F01Intro: React.FC = () => (
  <>
    <Bg bg="cream" />
    <Lockup h={64} lead="Introducing" />
  </>
);

// F2 · 0:02 — the map: one meeting, three phases, the household we follow.
export const F02Map: React.FC = () => (
  <>
    <Bg bg="cream" />
    <Title top={250}>One client meeting, start to finish</Title>
    <PhaseMap top={420} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 744, display: "flex", justifyContent: "center" }}>
      <HouseholdChip size={22} style={{ background: "rgba(255, 255, 255, 0.75)" }} />
    </div>
  </>
);

// F13 · 0:26 — the whole story, completed.
export const F13Recap: React.FC = () => (
  <>
    <Bg bg={TRI_GRADIENT} />
    <Title top={250} size={80}>
      Prep. Communicate. Deliver.
    </Title>
    <PhaseMap top={440} done />
  </>
);

// F14 · 0:28 — wordmark.
export const F14Logo: React.FC = () => (
  <>
    <Bg bg={TRI_GRADIENT} />
    <Lockup h={84} />
  </>
);
