import React, { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile } from "remotion";
import "../../shared/fonts";
import { DataHuntLoop, HUNT_SECONDS } from "../../more-ways/cards/DataHunt";
import { EveryReportLoop, REPORT_SECONDS } from "../../more-ways/cards/EveryReport";
import { JustSayLoop, SAY_SECONDS } from "../../more-ways/cards/JustSay";
import { KNOW_SECONDS, KnowMoreLoop } from "../../more-ways/cards/KnowMore";
import { MONITOR_SECONDS, MonitorLoop } from "../../more-ways/cards/Monitor";
import { DAY_SECONDS, StartDayLoop } from "../../more-ways/cards/StartDay";
import { CARDS, CardKey } from "../../more-ways/theme";
import { loadAdFonts } from "../fonts";

// Innovation Campaign · "03 — Feature bento (4x5) v3" (Figma): Savvy logo,
// Diatype Light headline and body copy, white on the dark-teal background,
// with the website's bento card animation (src/more-ways/cards/) playing
// under the copy: left edge on the text margin, sized to the room left. A
// graphic that fits ends with its own edge; one that doesn't runs off the
// bottom. One loop per ad, so the ads loop seamlessly. 4:5 is the Figma
// layout; 1:1 and 9:16 re-fit it.

export type BentoFormat = "4x5" | "1x1" | "9x16";
type Spec = {
  readonly w: number;
  readonly h: number;
  readonly textTop: number; // where the logo starts
  readonly textScale: number;
  readonly column: number; // the text column, × the ad's Figma column
  readonly gap: number; // copy → graphic
  readonly safeBottom: number; // what must be seen stays above this
  readonly fitBottom: number; // a graphic that ends above this is shown whole
  readonly center: boolean; // centre copy + a whole graphic between textTop and fitBottom
  readonly balance: boolean; // even headline lines (1:1's full-width column)
};
export const BENTO_FORMATS: Record<BentoFormat, Spec> = {
  "4x5": { w: 1080, h: 1350, textTop: 86, textScale: 1, column: 1, gap: 80, safeBottom: 1350, fitBottom: 1290, center: false, balance: false },
  // the copy at 75%, across the full width, so headlines take fewer lines
  "1x1": { w: 1080, h: 1080, textTop: 74.57, textScale: 0.75, column: 2, gap: 56, safeBottom: 1080, fitBottom: 1020, center: false, balance: true },
  // key content stays clear of the story/reel overlays at the top and bottom
  "9x16": { w: 1080, h: 1920, textTop: 250, textScale: 1, column: 1, gap: 96, safeBottom: 1650, fitBottom: 1650, center: true, balance: false },
};
const MARGIN = 75;
const INNER = 1080 - 2 * MARGIN;
const BG = "#0a2b3b";

// Where each card's graphic sits in its frame (website card px): the part
// aligned to the margin and sized to fit (its top at its highest); `full` is
// its whole height and `essential` how much of it must be seen. The cards
// that take `h` run on past a frame taller than their own end, so a graphic
// that doesn't fit gets a frame down to the ad's bottom edge.
type Graphic = {
  readonly Loop: React.FC<{ readonly h?: number }>;
  readonly seconds: number;
  readonly box: { readonly x: number; readonly y: number; readonly w: number };
  readonly full: number;
  readonly essential: number;
  readonly maxScale: number;
};
const END_PAD = 4; // frame px kept under a whole graphic (its border)
const GRAPHICS: Partial<Record<CardKey, Graphic>> = {
  // the box lifts 22 px when the chips land under it
  say: { Loop: JustSayLoop, seconds: SAY_SECONDS, box: { x: 65, y: 40.5, w: 404 }, full: 240, essential: 240, maxScale: 2.3 },
  know: { Loop: KnowMoreLoop, seconds: KNOW_SECONDS, box: { x: 37, y: 29, w: 626 }, full: 520, essential: 300, maxScale: 1.6 },
  report: { Loop: EveryReportLoop, seconds: REPORT_SECONDS, box: { x: 60, y: 12, w: 580 }, full: 376, essential: 330, maxScale: 1.6 },
  day: { Loop: StartDayLoop, seconds: DAY_SECONDS, box: { x: 34, y: 26.27, w: 466 }, full: 284, essential: 284, maxScale: 2 },
  monitor: { Loop: MonitorLoop, seconds: MONITOR_SECONDS, box: { x: 35, y: 21.5, w: 336 }, full: 213, essential: 213, maxScale: 2.8 },
  hunt: { Loop: DataHuntLoop, seconds: HUNT_SECONDS, box: { x: 40.8, y: 22.77, w: 334 }, full: 392.5, essential: 345, maxScale: 2.6 },
};

export type BentoAdSpec = {
  readonly card: CardKey;
  readonly headline: string;
  readonly headlineSize: number; // px (Figma)
  readonly body: string;
  readonly column: number; // text column width (Figma)
  readonly headlineColumn?: number; // a wider headline, where a fixed typo made a word longer
};
// The six ads, copy and sizes as in Figma (three typos fixed: you’re,
// prospect’s, clients’).
export const BENTO_ADS: readonly BentoAdSpec[] = [
  { card: "say", headline: "Like you’re talking to your analyst.", headlineSize: 92.142, body: "Type it or dictate it. Savvy Intelligence takes it from there.", column: 668.027, headlineColumn: 720 /* wider for “you’re” */ },
  {
    card: "know",
    headline: "Know more than they expect. Win more clients.",
    headlineSize: 79.242,
    body: "Upload a prospect’s context, and uncover financial planning opportunities to deliver value, personalized and specific to their needs.",
    column: 840.332,
  },
  {
    card: "report",
    headline: "No one wants an advisor that sounds like AI.",
    headlineSize: 92.142,
    body: "Savvy Intelligence learns your voice from your past emails and drafts the advisor note.",
    column: 864.289,
  },
  {
    card: "day",
    headline: "Your day prepped for you.",
    headlineSize: 92.142,
    body: "Your daily briefing is waiting: account changes, open items and drafts ready for review to run your financial advisory firm.",
    column: 732.925,
  },
  {
    card: "monitor",
    headline: "Don’t miss an opportunity to optimize your clients’ financial plan.",
    headlineSize: 73.713,
    body: "Our AI will find and surface opportunities for you to deliver value across allocations, with holdings and more.",
    column: 788.733,
    headlineColumn: 820, // wider for “clients’”, still three lines
  },
  {
    card: "hunt",
    headline: "Skip the PDF hunt.",
    headlineSize: 92.142,
    body: "Advisors can find beneficiaries, cost basis or last year’s return details without opening a single PDF.",
    column: 732.925,
  },
];
export const bentoSeconds = (card: CardKey) => GRAPHICS[card]?.seconds ?? 10;

// The copy's height is measured once the fonts are in, so the graphic sits
// a fixed gap under it whatever the line breaks.
const useMeasuredHeight = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [handle] = useState(() => delayRender("Measuring the ad copy"));
  useLayoutEffect(() => {
    let done = false;
    // @remotion/fonts adds a face to document.fonts only once it has loaded,
    // so wait on the loaders themselves, not just document.fonts.ready
    const measure = () => {
      if (done) return;
      setHeight(ref.current?.offsetHeight ?? 0);
      continueRender(handle);
    };
    loadAdFonts()
      .then(() => document.fonts.ready)
      .then(measure, measure);
    return () => {
      done = true;
    };
  }, [handle]);
  return { ref, height };
};

export const BentoAd: React.FC<BentoAdSpec & { readonly format?: BentoFormat }> = ({ card, headline, headlineSize, body, column, headlineColumn, format = "4x5" }) => {
  useState(loadAdFonts);
  const f = BENTO_FORMATS[format];
  const g = GRAPHICS[card];
  const { ref, height } = useMeasuredHeight();
  const col = Math.min(column * f.column, INNER / f.textScale);
  const textH = (height ?? 0) * f.textScale;
  let textTop = f.textTop;
  let placed: React.ReactNode = null;
  if (g && height !== null) {
    let graphicTop = f.textTop + textH + f.gap;
    const s = Math.min(g.maxScale, INNER / g.box.w, (f.safeBottom - graphicTop) / g.essential);
    const whole = graphicTop + g.full * s <= f.fitBottom;
    if (whole && f.center) {
      const shift = Math.max(0, (f.fitBottom - f.textTop - (textH + f.gap + g.full * s)) / 2);
      textTop += shift;
      graphicTop += shift;
    }
    const top = graphicTop - g.box.y * s;
    const frameH = whole ? g.box.y + g.full + END_PAD : Math.max(CARDS[card].h, Math.ceil((f.h - top) / s));
    placed = (
      <div style={{ position: "absolute", left: MARGIN - g.box.x * s, top, width: CARDS[card].w, scale: s, transformOrigin: "0 0" }}>
        <g.Loop h={frameH} />
      </div>
    );
  }
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      {/* the Figma background: a blurred overlay on the base colour */}
      <Img src={staticFile("ads/bento/background-4x5.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {placed}
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: MARGIN,
          top: textTop,
          width: col,
          scale: f.textScale,
          transformOrigin: "0 0",
          display: "flex",
          flexDirection: "column",
          gap: 51.599,
          fontFamily: '"ABC Diatype", sans-serif',
          color: "#ffffff",
        }}
      >
        <Img src={staticFile("ads/bento/savvy-logo-white.svg")} style={{ width: 203.273, height: 68.428, display: "block" }} />
        <div
          style={{
            width: headlineColumn ? Math.min(headlineColumn * f.column, INNER / f.textScale) : undefined,
            fontWeight: 300,
            fontSize: headlineSize,
            lineHeight: 1,
            letterSpacing: -0.02 * headlineSize,
            textWrap: f.balance ? "balance" : undefined,
          }}
        >
          {headline}
        </div>
        {/* the resizes avoid a one-word last line; 4:5 keeps Figma's breaks */}
        <div style={{ fontWeight: 400, fontSize: 35.236, lineHeight: 1.35, letterSpacing: 0.005 * 35.236, color: "rgba(255, 255, 255, 0.78)", textWrap: format === "4x5" ? undefined : "pretty" }}>{body}</div>
      </div>
    </AbsoluteFill>
  );
};
