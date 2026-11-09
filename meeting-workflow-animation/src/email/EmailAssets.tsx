import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import { Logo } from "../launch/components/Logo";
import { loadDiatype } from "../launch/fonts";
import { Card } from "../launch30/components/Bits";
import { PresentationContent, QuestionBubble } from "../launch30/frames/Communicate";
import { RecapContent } from "../launch30/frames/Deliver";
import { PrepDocContent } from "../launch30/frames/Prep";
import { C, CARD_SHADOW, DIATYPE, FONT } from "../launch30/theme";

// Email header (600 px wide): "Prep. Meet. Deliver with Savvy Intelligence."
// with the three screens of the 30 s product video, in their final states.
// The screens also render on their own, on transparent backgrounds, for
// building the header in Figma.

export type EmailUI = "prep" | "meet" | "deliver";
export const EMAIL_UIS: Record<EmailUI, { readonly w: number; readonly h: number; readonly Content: React.FC }> = {
  prep: { w: 900, h: 600, Content: () => <PrepDocContent /> }, // Quarterly Review prep
  meet: { w: 780, h: 610, Content: () => <PresentationContent drag={1} /> }, // Retirement plan, what-if answered
  deliver: { w: 900, h: 660, Content: () => <RecapContent /> }, // Quarterly Review recap, suggested tasks
};

// Room for CARD_SHADOW around a card (its blur runs ~76 px below, ~46 to the sides).
export const SHADOW_PAD = { x: 60, top: 40, bottom: 90 };

const Base: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  useState(loadDiatype);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink }}>
      <style>{"*{box-sizing:border-box;}"}</style>
      {children}
    </AbsoluteFill>
  );
};

// One screen, card-sized, no background. `shadow` adds the video's card
// shadow, with room for it.
export const EmailUIStill: React.FC<{ readonly ui: EmailUI; readonly shadow?: boolean }> = ({ ui, shadow = false }) => {
  const { w, h, Content } = EMAIL_UIS[ui];
  return (
    <Base>
      <Card style={{ left: shadow ? SHADOW_PAD.x : 0, top: shadow ? SHADOW_PAD.top : 0, width: w, height: h, boxShadow: shadow ? CARD_SHADOW : "none" }}>
        <Content />
      </Card>
    </Base>
  );
};
export const emailUISize = (ui: EmailUI, shadow: boolean) => ({
  w: EMAIL_UIS[ui].w + (shadow ? 2 * SHADOW_PAD.x : 0),
  h: EMAIL_UIS[ui].h + (shadow ? SHADOW_PAD.top + SHADOW_PAD.bottom : 0),
});

// The client's question from the Meet screen ("What if we save $15K more a
// year?"), on its own; trimmed to its ink after rendering.
export const QUESTION_SIZE = { w: 640, h: 160 };
export const EmailQuestionStill: React.FC = () => (
  <Base>
    <QuestionBubble style={{ left: 30, top: 30 }} />
  </Base>
);

// The header. The three screens step down from left to right in order, each
// in front of the one before, so each keeps its title and what it's about in
// view: the household and agenda (Prep), the projection (Meet), the suggested
// tasks (Deliver).
export const HEADER = { w: 600, h: 838 };
const HEAD_COPY = { top: 92, size: 38, lh: 1.12 };
const S = 0.4; // screen scale
const STEPS_TOP = 214;
const PLACES: readonly { readonly ui: EmailUI; readonly x: number; readonly y: number }[] = [
  { ui: "prep", x: 24, y: STEPS_TOP },
  { ui: "meet", x: 150, y: STEPS_TOP + 160 },
  { ui: "deliver", x: 216, y: STEPS_TOP + 320 },
];
// The video's three phase backgrounds, cream → mint → blue, in one sweep.
const HEADER_BG = "linear-gradient(160deg, #F7F2EA 0%, #EDE6DA 22%, #D5F1E8 52%, #C6EBF5 82%, #B9E2EF 100%)";

export const EmailHeader: React.FC = () => (
  <Base>
    <AbsoluteFill style={{ background: HEADER_BG }} />
    <div style={{ position: "absolute", top: 38, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Logo h={24} />
    </div>
    <div
      style={{
        position: "absolute",
        top: HEAD_COPY.top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: DIATYPE,
        fontSize: HEAD_COPY.size,
        lineHeight: HEAD_COPY.lh,
        letterSpacing: "-0.015em",
        color: "#000000",
      }}
    >
      Prep. Meet. Deliver
      <br />
      with Savvy Intelligence.
    </div>
    {PLACES.map(({ ui, x, y }) => {
      const { w, h, Content } = EMAIL_UIS[ui];
      return (
        <div key={ui} style={{ position: "absolute", left: x, top: y, width: w, height: h, scale: S, transformOrigin: "0 0" }}>
          <Card style={{ left: 0, top: 0, width: w, height: h }}>
            <Content />
          </Card>
        </div>
      );
    })}
  </Base>
);
