import { Check, FileText, Send } from "lucide-react";
import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { FirmLogo } from "../../recap/components/FirmLogo";
import { AIIcon } from "../../shared/components/AIIcon";
import { Bar, Bg, Card, Cursor, Headline, HouseholdChip, Label } from "../components/Bits";
import { AbstractChart } from "../components/Chart";
import { Rect } from "../components/Motion";
import { Tracker } from "../components/Tracker";
import { C, centerTop, CLAMP, EASE_OUT, FONT, MEETING, phase, UI } from "../theme";
import { stagger } from "./Prep";

const P = phase("deliver");
const TASKS = ["Rebalance to 70/30", "Open Ellis's 529", "Raise 401(k) to 12.5%"];

export const DELIVER_HEADLINE = { eyebrow: "Follow-up & Deliver", color: P.accent, lines: ["Your next steps", "start themselves"] };
export const RECAP: Rect = { x: UI.x, y: centerTop(660), w: UI.w, h: 660 };
export const DOC: Rect = { x: 870, y: 190, w: 540, h: 660 };
export const EMAIL: Rect = { x: 1130, y: 390, w: 660, h: 500 };
export const SEND_BTN = { x: EMAIL.x + EMAIL.w - 32 - 56, y: EMAIL.y + EMAIL.h - 30 - 24 };

// The recap's content in RECAP's 900×660 box; `reveal` fills it in.
export const RecapContent: React.FC<{ readonly reveal?: number }> = ({ reveal = 1 }) => {
  const s = (i: number) => stagger(reveal, i, 6);
  return (
    <>
      <div style={{ position: "absolute", left: 44, top: 44, fontFamily: FONT.sans, fontWeight: 600, fontSize: 34, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap", ...s(0) }}>{MEETING} recap</div>
      <div style={{ position: "absolute", left: 44, top: 104, ...s(0) }}>
        <HouseholdChip meeting={false} />
      </div>
      <div style={{ position: "absolute", left: 44, top: 176, right: 44, ...s(1) }}>
        <Label>Summary</Label>
        <Bar w="94%" h={14} style={{ marginTop: 18 }} />
        <Bar w="86%" h={14} style={{ marginTop: 14 }} />
        <Bar w="62%" h={14} style={{ marginTop: 14 }} />
      </div>
      <div style={{ position: "absolute", left: 44, top: 340, right: 44 }}>
        <Label style={s(2)}>Suggested tasks</Label>
        {TASKS.map((task, i) => (
          <div
            key={task}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              height: 70,
              marginTop: i ? 12 : 18,
              padding: "0 18px",
              borderRadius: 14,
              background: "#E8F4EE",
              ...s(3 + i * 0.7),
            }}
          >
            <AIIcon size={24} />
            <div style={{ fontSize: 21, fontWeight: 500, color: C.ink }}>{task}</div>
            <div style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: 9, background: C.green, color: C.white, fontSize: 15, fontWeight: 600 }}>Approve &amp; send to team</div>
          </div>
        ))}
      </div>
    </>
  );
};

// The branded client document's content in DOC's 540×660 box.
export const ClientDocContent: React.FC = () => (
  <>
    <div style={{ position: "absolute", right: 36, top: 38, scale: 1.15, transformOrigin: "100% 0" }}>
      <FirmLogo />
    </div>
    <div style={{ position: "absolute", left: 40, top: 100, fontSize: 30, fontWeight: 700, color: C.ink }}>{MEETING}</div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 152, height: 2, background: "#3B4252" }} />
    <div style={{ position: "absolute", left: 40, top: 182, right: 40 }}>
      <Bar w="90%" />
      <Bar w="78%" style={{ marginTop: 12 }} />
      <Bar w="84%" style={{ marginTop: 12 }} />
    </div>
    <div style={{ position: "absolute", left: 40, top: 270 }}>
      <AbstractChart w={420} h={190} color={C.green} growth={1.18} />
    </div>
  </>
);

// The email's content in EMAIL's 660×500 box. `write` writes the body in;
// `press` presses Send.
export const EmailContent: React.FC<{ readonly write?: number; readonly press?: number }> = ({ write = 1, press = 0 }) => {
  const line = (i: number) => interpolate(write, [0.12 + i * 0.22, 0.34 + i * 0.22], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const after = interpolate(write, [0.85, 1], [0, 1], CLAMP);
  return (
    <>
      <div style={{ position: "absolute", left: 36, top: 30, fontSize: 21, fontWeight: 600, color: C.ink }}>Email draft</div>
      <div
        style={{
          position: "absolute",
          right: 32,
          top: 26,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 999,
          background: C.green100,
          color: C.green,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        <AIIcon size={18} /> Your writing style
      </div>
      <div style={{ position: "absolute", left: 36, top: 84, display: "flex", alignItems: "center", gap: 10, fontSize: 17, color: C.muted }}>
        To
        {["Allison", "Frank"].map((n) => (
          <span key={n} style={{ padding: "5px 12px", borderRadius: 8, background: "#F1F3F5", color: C.ink }}>
            {n}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 36, right: 36, top: 140, height: 1, background: "#EEF0F2" }} />
      <div style={{ position: "absolute", left: 36, top: 168, fontSize: 21, color: C.ink, opacity: interpolate(write, [0, 0.12], [0, 1], CLAMP) }}>Hi Allison and Frank,</div>
      <div style={{ position: "absolute", left: 36, top: 214, right: 36 }}>
        {["92%", "84%", "58%"].map((w, i) => (
          <div key={w} style={{ width: w, marginTop: i ? 12 : 0 }}>
            <Bar w={`${line(i) * 100}%`} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 36,
          top: 318,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 10,
          border: `1px solid ${C.borderSoft}`,
          fontSize: 16,
          color: C.ink,
          opacity: after,
          scale: 0.9 + 0.1 * after,
          transformOrigin: "0 50%",
        }}
      >
        <FileText size={18} strokeWidth={2} color={C.muted} /> {MEETING}.pdf
      </div>
      <div
        style={{
          position: "absolute",
          right: 32,
          bottom: 30,
          height: 48,
          padding: "0 22px",
          borderRadius: 11,
          background: C.green,
          color: C.white,
          fontSize: 18,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 9,
          scale: 1 - 0.05 * press,
          filter: `brightness(${1 - 0.15 * press})`,
        }}
      >
        <Send size={18} strokeWidth={2.2} /> Send
      </div>
    </>
  );
};

// The advisor's team, who pick up the approved tasks (placeholder names and
// photos, public/launch30/team/), in TASKS order.
export const TEAM = [
  { name: "Marcus Reid", role: "Trading", photo: "launch30/team/marcus.jpg" },
  { name: "Priya Kapoor", role: "Operations", photo: "launch30/team/priya.jpg" },
  { name: "Dana Whitman", role: "Client service", photo: "launch30/team/dana.jpg" },
];

export const Avatar: React.FC<{ readonly photo: string; readonly size?: number }> = ({ photo, size = 36 }) => (
  <Img src={staticFile(photo)} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "#E6E9ED" }} />
);

// 0:22: the email folds into an "Email sent" banner and the approved tasks go
// to the team in a card under it, one person each. The pair is centred on the
// middle line.
const COLUMN = { x: 960, w: 700 };
export const SENT_BANNER: Rect = { x: COLUMN.x, y: centerTop(170 + 24 + 420), w: COLUMN.w, h: 170 };
export const TEAM_CARD: Rect = { x: COLUMN.x, y: SENT_BANNER.y + 170 + 24, w: COLUMN.w, h: 420 };

// The banner's content in SENT_BANNER's 700×170 box; `draw` strokes the check.
export const SentBannerContent: React.FC<{ readonly draw?: number }> = ({ draw = 1 }) => (
  <>
    <div style={{ position: "absolute", left: 40, top: 45, width: 80, height: 80, borderRadius: "50%", background: C.green50, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={44} height={44} viewBox="0 0 24 24">
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={C.green} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      </svg>
    </div>
    <div style={{ position: "absolute", left: 146, top: 44, fontSize: 34, fontWeight: 600, color: C.ink }}>Email sent</div>
    <div style={{ position: "absolute", left: 146, top: 96, fontSize: 19, color: C.body }}>Recap and client document shared with Allison &amp; Frank</div>
  </>
);

// The team card's content in TEAM_CARD's 700×420 box; `rows` brings each task
// in (0–1 each).
export const TeamTasksContent: React.FC<{ readonly rows?: readonly number[] }> = ({ rows = [1, 1, 1] }) => (
  <>
    <div style={{ position: "absolute", left: 34, top: 32, fontSize: 25, fontWeight: 600, color: C.ink }}>Sent to your team</div>
    <div style={{ position: "absolute", left: 34, top: 70, fontSize: 16, color: C.muted }}>3 tasks from {MEETING}</div>
    <div style={{ position: "absolute", left: 26, right: 26, top: 116 }}>
      {TASKS.map((task, i) => (
        <div
          key={task}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            height: 82,
            marginTop: i ? 10 : 0,
            padding: "0 18px",
            borderRadius: 14,
            background: "#F5F7F9",
            opacity: rows[i],
            translate: `0px ${(1 - rows[i]) * 14}px`,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 500, color: C.ink, flex: 1 }}>{task}</div>
          <Avatar photo={TEAM[i].photo} size={42} />
          <div style={{ width: 132 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{TEAM[i].name}</div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 2 }}>{TEAM[i].role}</div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.green, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", scale: 0.6 + 0.4 * rows[i] }}>
            <Check size={17} strokeWidth={3} />
          </div>
        </div>
      ))}
    </div>
  </>
);

const DeliverHeadline: React.FC = () => <Headline {...DELIVER_HEADLINE} />;
const at = (r: Rect, extra?: React.CSSProperties): React.CSSProperties => ({ left: r.x, top: r.y, width: r.w, height: r.h, ...extra });

// F10 · 0:18 — the recap, written from the recording.
export const F10Recap: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={2} />
    <DeliverHeadline />
    <Card style={at(RECAP)}>
      <RecapContent />
    </Card>
  </>
);

// F11 · 0:20 — the client document and the email, in the advisor's voice.
export const F11Email: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={2} />
    <DeliverHeadline />
    <Card style={at(DOC)}>
      <ClientDocContent />
    </Card>
    <Card style={at(EMAIL, { boxShadow: "0 40px 90px -30px rgba(16, 24, 40, 0.35)" })}>
      <EmailContent />
    </Card>
    <Cursor {...SEND_BTN} />
  </>
);

// F12 · 0:22.5 — sent, and the tasks are with the team.
export const F12Sent: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={3} />
    <DeliverHeadline />
    <Card style={at(SENT_BANNER)}>
      <SentBannerContent />
    </Card>
    <Card style={at(TEAM_CARD)}>
      <TeamTasksContent />
    </Card>
  </>
);
