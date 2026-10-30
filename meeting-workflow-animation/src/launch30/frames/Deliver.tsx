import { Check, FileText, Send } from "lucide-react";
import React from "react";
import { FirmLogo } from "../../recap/components/FirmLogo";
import { AIIcon } from "../../shared/components/AIIcon";
import { Bar, Bg, Card, Cursor, Headline, HouseholdChip, Label } from "../components/Bits";
import { AbstractChart } from "../components/Chart";
import { Tracker } from "../components/Tracker";
import { C, centerTop, FONT, MEETING, phase, UI } from "../theme";

const P = phase("deliver");
const TASKS = ["Rebalance to 70/30", "Open Ellis's 529", "Raise 401(k) to 12.5%"];

const DeliverHeadline: React.FC = () => <Headline eyebrow="Recap & follow-up" color={P.accent} lines={["The follow-up", "doesn't wait"]} />;

// F10 · 0:18 — the recap, written from the recording.
export const F10Recap: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={2} />
    <DeliverHeadline />
    <Card style={{ left: UI.x, top: centerTop(660), width: UI.w, height: 660 }}>
      <div style={{ position: "absolute", left: 44, top: 40, fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>{MEETING} recap</div>
      <div style={{ position: "absolute", left: 44, top: 104 }}>
        <HouseholdChip meeting={false} />
      </div>
      <div style={{ position: "absolute", left: 44, top: 176, right: 44 }}>
        <Label>Summary</Label>
        <Bar w="94%" h={14} style={{ marginTop: 18 }} />
        <Bar w="86%" h={14} style={{ marginTop: 14 }} />
        <Bar w="62%" h={14} style={{ marginTop: 14 }} />
      </div>
      <div style={{ position: "absolute", left: 44, top: 340, right: 44 }}>
        <Label>Suggested tasks</Label>
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
            }}
          >
            <AIIcon size={24} />
            <div style={{ fontSize: 21, fontWeight: 500, color: C.ink }}>{task}</div>
            <div style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: 9, background: C.green, color: C.white, fontSize: 15, fontWeight: 600 }}>Create task</div>
          </div>
        ))}
      </div>
    </Card>
  </>
);

// F11 · 0:21 — the client document and the email, in the advisor's voice.
export const F11Email: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={2} />
    <DeliverHeadline />
    <Card style={{ left: 870, top: 190, width: 540, height: 660 }}>
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
    </Card>
    <Card style={{ left: 1130, top: 390, width: 660, height: 500, boxShadow: "0 40px 90px -30px rgba(16, 24, 40, 0.35)" }}>
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
      <div style={{ position: "absolute", left: 36, top: 168, fontSize: 21, color: C.ink }}>Hi Allison and Frank,</div>
      <div style={{ position: "absolute", left: 36, top: 214, right: 36 }}>
        <Bar w="92%" />
        <Bar w="84%" style={{ marginTop: 12 }} />
        <Bar w="58%" style={{ marginTop: 12 }} />
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
        }}
      >
        <Send size={18} strokeWidth={2.2} /> Send
      </div>
    </Card>
    <Cursor x={1706} y={842} />
  </>
);

// F12 · 0:24 — sent, and the loop is closed.
export const F12Sent: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={3} />
    <DeliverHeadline />
    <Card style={{ left: 960, top: centerTop(470), width: 700, height: 470 }}>
      <div
        style={{
          position: "absolute",
          left: 350 - 52,
          top: 54,
          width: 104,
          height: 104,
          borderRadius: "50%",
          background: C.green50,
          color: C.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check size={54} strokeWidth={3} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 186, textAlign: "center", fontSize: 44, fontWeight: 600, color: C.ink }}>Email sent</div>
      <div style={{ position: "absolute", left: 130, top: 278 }}>
        {["Recap shared with Allison & Frank", "Client document attached", "3 tasks created"].map((line, i) => (
          <div key={line} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 21, color: C.body, marginTop: i ? 16 : 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.green, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={17} strokeWidth={3} />
            </div>
            {line}
          </div>
        ))}
      </div>
    </Card>
  </>
);
