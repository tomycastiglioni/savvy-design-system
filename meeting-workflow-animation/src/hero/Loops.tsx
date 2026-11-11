import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import "../shared/fonts";
import { loadDiatype } from "../launch/fonts";
import { along, EASE_IN_OUT, LINEAR, press, ramp, useT, window } from "../more-ways/anim";
import { PAGE } from "./Bits";
import { contactAt, ContactsState, HouseholdContacts } from "./cards/HouseholdContacts";
import { MeetingPrep, PrepState } from "./cards/MeetingPrep";
import { MeetingSummaries, sectionAt, SummariesState, templateAt } from "./cards/MeetingSummaries";
import { CREATE_AT, ProspectAnalysis, ProspectState } from "./cards/ProspectAnalysis";
import { dragHandleAt, PUBLISH_AT, ReportBuilder, ReportState, sideAt } from "./cards/ReportBuilder";
import { knobFor, Scenarios } from "./cards/Scenarios";

// The hero's pill graphics as seamless loops (620×360; render at --scale=2),
// transparent to sit on the hero; `preview` puts them on its background.

// The end of a loop easing back into its first frame: the start state is drawn
// underneath, the current state fades out over it (same card, so it stays
// solid).
const Reset: React.FC<{ readonly k: number; readonly start: React.ReactNode; readonly children: React.ReactNode }> = ({ k, start, children }) =>
  k <= 0 ? (
    <>{children}</>
  ) : (
    <>
      <AbsoluteFill>{start}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - k }}>{children}</AbsoluteFill>
    </>
  );
const RESET = (end: number) => [end - 1.3, end - 0.7] as const; // the crossfade, then the start holds

// 01 · Financial planning scenarios (11 s): the retirement age is dragged to
// 63 and the plan dips; annual savings are dragged up $15K and it recovers
// past the plan; then both sliders ease back.
const SCENARIOS_S = 11;
const ScenariosLoop: React.FC = () => {
  const t = useT();
  const back = 1 - ramp(t, 8.8, 9.9, EASE_IN_OUT);
  const retire = ramp(t, 1.9, 2.9, EASE_IN_OUT) * back;
  const save = ramp(t, 4.8, 5.8, EASE_IN_OUT) * back;
  const k0 = knobFor(0, retire, save);
  const k1 = knobFor(1, retire, save);
  const p =
    t < 3.6
      ? along(t, [
          [0.9, k0.x + 140, k0.y + 170],
          [1.6, k0.x + 2, k0.y + 2],
        ])
      : along(t, [
          [3.6, k0.x + 2, k0.y + 2],
          [4.4, k1.x + 2, k1.y + 2],
        ]);
  const onKnob = t >= 1.6 && t < 3.6 ? { x: k0.x + 2, y: k0.y + 2 } : t >= 4.4 ? { x: k1.x + 2, y: k1.y + 2 } : p;
  const hot = t >= 1.75 && t < 3.05 ? 0 : t >= 4.65 && t < 5.95 ? 1 : -1;
  return <Scenarios s={{ retire, save, hot, pointer: { ...onKnob, o: window(t, 0.9, 6.3, 0.3, 0.45) } }} />;
};

// 02 · Automated meeting prep (11 s): the sources are pulled one by one, the
// agenda writes itself, prep ready with its talking point.
const PREP_S = 11;
const PREP_START: PrepState = { pulled: 0, agenda: 0, ready: 0 };
const PrepLoop: React.FC = () => {
  const t = useT();
  const spin = t * 380;
  const s: PrepState = {
    pulled: 4 * ramp(t, 0.5, 3.0, LINEAR),
    agenda: [0, 1, 2, 3].reduce((n, i) => n + ramp(t, 3.2 + 0.45 * i, 3.6 + 0.45 * i), 0),
    ready: ramp(t, 5.3, 5.7),
    spin,
  };
  return (
    <Reset k={ramp(t, ...RESET(PREP_S))} start={<MeetingPrep s={{ ...PREP_START, spin }} />}>
      <MeetingPrep s={s} />
    </Reset>
  );
};

// 03 · Customizable meeting summaries (12 s): advisor notes; the template is
// switched to client recap and it rewrites itself; the next meeting section is
// switched on; saved as default.
const SUMMARIES_S = 12;
const SUMMARIES_START: SummariesState = { template: "notes" };
const SummariesLoop: React.FC = () => {
  const t = useT();
  const opt = templateAt(1);
  const sw = sectionAt(2);
  const p = along(t, [
    [1.3, opt.x + 120, opt.y + 160],
    [2.1, opt.x, opt.y],
    [4.6, opt.x, opt.y],
    [5.4, sw.x, sw.y],
  ]);
  const s: SummariesState = {
    template: t >= 2.35 ? "recap" : "notes",
    swap: t >= 2.35 ? ramp(t, 2.35, 3.05, LINEAR) : 0,
    next: ramp(t, 5.6, 5.9),
    saved: window(t, 6.1, 8.9, 0.4, 0.4),
    pointer: { ...p, o: window(t, 1.3, 6.0, 0.3, 0.45) },
  };
  return (
    <Reset k={ramp(t, ...RESET(SUMMARIES_S))} start={<MeetingSummaries s={SUMMARIES_START} />}>
      <MeetingSummaries s={s} />
    </Reset>
  );
};

// 04 · Household contact summaries (12 s): Allison's summary; Frank is picked
// and his fills in; then Mark Lee, their CPA; then back to Allison.
const CONTACTS_S = 12;
const ContactsLoop: React.FC = () => {
  const t = useT();
  const [a, f, m] = [contactAt(0), contactAt(1), contactAt(3)];
  const p = along(t, [
    [1.1, f.x + 60, f.y + 150],
    [1.8, f.x, f.y],
    [4.9, f.x, f.y],
    [5.6, m.x, m.y],
    [9.0, m.x, m.y],
    [9.7, a.x, a.y],
  ]);
  const pick = (at: number) => ramp(t, at + 0.05, at + 0.9, LINEAR);
  const s: ContactsState =
    t < 2.0 ? { selected: 0, open: 1 } : t < 5.8 ? { selected: 1, open: pick(2.0) } : t < 9.9 ? { selected: 3, open: pick(5.8) } : { selected: 0, open: pick(9.9) };
  return <HouseholdContacts s={{ ...s, pointer: { ...p, o: window(t, 1.1, 10.3, 0.3, 0.5) } }} />;
};

// 05 · Performance report builder (12 s): the allocation block is dragged into
// the report, the advisor note writes itself, published to the portal.
const REPORT_S = 12;
const REPORT_START: ReportState = { drag: 0, note: 0, published: 0 };
const ReportLoop: React.FC = () => {
  const t = useT();
  const grab = sideAt(1);
  const drag = ramp(t, 1.7, 3.0, LINEAR);
  const onBlock = dragHandleAt(drag); // the cursor holds the block as it travels
  const p =
    t < 1.7
      ? along(t, [
          [0.8, grab.x + 120, grab.y + 150],
          [1.5, grab.x, grab.y],
        ])
      : t < 3.6
        ? onBlock
        : along(t, [
            [3.6, onBlock.x, onBlock.y],
            [6.0, onBlock.x + 40, onBlock.y + 40],
            [6.6, PUBLISH_AT.x, PUBLISH_AT.y],
          ]);
  const s: ReportState = {
    drag,
    note: ramp(t, 3.4, 5.6, LINEAR),
    published: t >= 6.95 ? 1 : 0,
    press: press(t, 6.85),
    pointer: { ...p, o: window(t, 0.8, 7.4, 0.3, 0.45) },
  };
  return (
    <Reset k={ramp(t, ...RESET(REPORT_S))} start={<ReportBuilder s={REPORT_START} />}>
      <ReportBuilder s={s} />
    </Reset>
  );
};

// 06 · Prospect analysis (12 s): what they shared is read, their situation
// fills in, the opportunities worth raising; added to the CRM.
const PROSPECT_S = 12;
const PROSPECT_START: ProspectState = { read: 0, tiles: 0, ideas: 0, added: 0 };
const ProspectLoop: React.FC = () => {
  const t = useT();
  const p = along(t, [
    [6.4, CREATE_AT.x - 90, CREATE_AT.y + 170],
    [7.1, CREATE_AT.x, CREATE_AT.y],
  ]);
  const s: ProspectState = {
    read: 3 * ramp(t, 0.5, 3.0, LINEAR),
    tiles: [0, 1, 2].reduce((n, i) => n + ramp(t, 3.2 + 0.35 * i, 3.6 + 0.35 * i), 0),
    ideas: [0, 1, 2].reduce((n, i) => n + ramp(t, 4.7 + 0.5 * i, 5.15 + 0.5 * i), 0),
    added: t >= 7.45 ? 1 : 0,
    press: press(t, 7.35),
    pointer: { ...p, o: window(t, 6.4, 8.0, 0.3, 0.45) },
  };
  return (
    <Reset k={ramp(t, ...RESET(PROSPECT_S))} start={<ProspectAnalysis s={PROSPECT_START} />}>
      <ProspectAnalysis s={s} />
    </Reset>
  );
};

export const HERO_LOOPS = {
  scenarios: { seconds: SCENARIOS_S, Loop: ScenariosLoop, file: "hero-01-financial-planning-scenarios" },
  prep: { seconds: PREP_S, Loop: PrepLoop, file: "hero-02-automated-meeting-prep" },
  summaries: { seconds: SUMMARIES_S, Loop: SummariesLoop, file: "hero-03-customizable-meeting-summaries" },
  contacts: { seconds: CONTACTS_S, Loop: ContactsLoop, file: "hero-04-household-contact-summaries" },
  report: { seconds: REPORT_S, Loop: ReportLoop, file: "hero-05-performance-report-builder" },
  prospect: { seconds: PROSPECT_S, Loop: ProspectLoop, file: "hero-06-prospect-analysis" },
} as const;
export type HeroLoopKey = keyof typeof HERO_LOOPS;

export const HeroLoop: React.FC<{ readonly pill: HeroLoopKey; readonly preview?: boolean }> = ({ pill, preview = false }) => {
  useState(loadDiatype);
  const { Loop } = HERO_LOOPS[pill];
  return (
    <AbsoluteFill style={{ background: preview ? PAGE : undefined }}>
      <Loop />
    </AbsoluteFill>
  );
};
