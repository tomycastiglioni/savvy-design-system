import { FileSearch, FileText, Mail, Mic } from "lucide-react";
import React from "react";
import { Icon, Pill } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// v2 · 02 · Ready on day 1, at no added cost (700×350), on the dark card.
// Savvy Intelligence, built in and on from day 1, nothing to install; below,
// the tools an advisor would otherwise pay for, each covered in turn, and the
// added cost counting down to $0.
export type DayOneState = {
  readonly list?: number; // 0–1: the tools coming in
  readonly covered?: number; // 0–4: tools covered by Savvy Intelligence (fractional: the one being covered)
};

const W = 700;
const H = 350;
const CARD = { x: 70, y: 22, w: 560, h: 318 };
const TOOLS = [
  { name: "Meeting notetaker", what: "Records and summarizes meetings", price: 40, Glyph: Mic },
  { name: "Email assistant", what: "Drafts client emails", price: 30, Glyph: Mail },
  { name: "Prospect research", what: "Reads what prospects share", price: 99, Glyph: FileSearch },
  { name: "Report writer", what: "Writes advisor notes", price: 59, Glyph: FileText },
];
const TOTAL = TOOLS.reduce((n, t) => n + t.price, 0);
const ROW = { top: 100, h: 36, gap: 6 };
const c01 = (n: number) => Math.min(1, Math.max(0, n));

export const DayOne: React.FC<{ readonly s: DayOneState }> = ({ s }) => {
  const { list = 1, covered = 4 } = s;
  // the added cost falls as each tool is covered
  const left = TOOLS.reduce((n, t, i) => n + t.price * (1 - c01(covered - i)), 0);
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: "#ffffff", borderRadius: 10, border: `0.7px solid ${C.border}`, overflow: "hidden" }}>
        {/* built in, on from day 1 */}
        <div style={{ position: "absolute", left: 22, top: 20, width: 34, height: 34, borderRadius: 17, background: "#f3f7f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="savvy-mark" w={19} />
        </div>
        <div style={{ position: "absolute", left: 66, top: 19, fontWeight: MEDIUM, fontSize: 16, color: C.ink }}>Savvy Intelligence</div>
        <div style={{ position: "absolute", left: 66, top: 40, fontSize: 11, color: C.muted }}>Built into your Savvy platform</div>
        <div style={{ position: "absolute", right: 22, top: 22, display: "flex", gap: 8 }}>
          <Pill tone="green" size={11}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: C.green2 }} /> On · Ready on day 1
          </Pill>
        </div>
        <div style={{ position: "absolute", right: 22, top: 46, display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.muted }}>
          <Icon name="check-dark" w={8} style={{ opacity: 0.6 }} /> Nothing to install or configure
        </div>
        <div style={{ position: "absolute", left: 22, right: 22, top: 70, height: 1, background: C.border }} />

        {/* what you can drop */}
        <div style={{ position: "absolute", left: 22, right: 22, top: 80, display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.muted, opacity: list }}>
          <span>Tools you can drop</span>
          <span>Monthly cost</span>
        </div>
        {TOOLS.map((t, i) => {
          const inP = c01(list * 4 - i);
          const cov = c01(covered - i);
          return (
            <div
              key={t.name}
              style={{
                position: "absolute",
                left: 22,
                right: 22,
                top: ROW.top + i * (ROW.h + ROW.gap),
                height: ROW.h,
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "0 10px",
                borderRadius: 8,
                background: cov > 0 ? `rgba(222, 243, 220, ${0.55 * cov})` : C.tile,
                opacity: inP,
                translate: `0px ${(1 - inP) * 6}px`,
              }}
            >
              <div style={{ width: 26, height: 26, borderRadius: 7, background: "#ffffff", border: `0.7px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - 0.45 * cov }}>
                <t.Glyph size={13} color={C.sub} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0, opacity: 1 - 0.4 * cov }}>
                <div style={{ fontWeight: MEDIUM, fontSize: 12.5, color: C.ink }}>{t.name}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{t.what}</div>
              </div>
              {cov > 0 ? (
                <Pill tone="green" size={10} style={{ opacity: c01(cov * 2), scale: 0.7 + 0.3 * c01(cov * 1.5) }}>
                  <Icon name="savvy-mark" w={10} /> Included
                </Pill>
              ) : null}
              <div style={{ width: 58, textAlign: "right", fontWeight: MEDIUM, fontSize: 12.5, color: cov > 0.5 ? C.muted : C.ink, fontVariantNumeric: "tabular-nums" }}>
                <span style={{ position: "relative", display: "inline-block" }}>
                  ${t.price}/mo
                  <span style={{ position: "absolute", left: 0, top: "54%", height: 1.3, width: `${c01(cov * 1.4) * 100}%`, background: C.muted }} />
                </span>
              </div>
            </div>
          );
        })}

        {/* the added cost */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 46, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", opacity: list }}>
          <div style={{ fontSize: 11.5, color: C.sub2 }}>
            Added cost <span style={{ color: C.muted }}>· vs. ${TOTAL}/mo in separate tools</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, color: left === 0 ? C.green2 : C.ink, fontVariantNumeric: "tabular-nums" }}>${Math.round(left)}</div>
        </div>
      </div>
    </div>
  );
};

export const DAYONE_FRAMES: readonly { s: DayOneState; title: string; caption: string }[] = [
  { s: { list: 1, covered: 0 }, title: "Built in, on from day 1", caption: "Savvy Intelligence is already on: built into the platform, nothing to install or configure. Below, the tools an advisor might pay for separately." },
  { s: { list: 1, covered: 1.6 }, title: "Covered, one by one", caption: "Each tool turns “Included”: its price strikes through and the added cost counts down." },
  { s: { list: 1, covered: 4 }, title: "$0 added", caption: "All four covered: $0 added cost, against $228/mo in separate tools. Then the list resets." },
];
