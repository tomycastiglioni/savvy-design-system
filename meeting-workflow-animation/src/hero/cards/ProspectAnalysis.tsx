import React from "react";
import { Icon, Pointer, Skeleton } from "../../more-ways/Bits";
import { C } from "../../more-ways/theme";
import { Button, c01, Done, Frame, Head, Initials, Label, Panel } from "../Bits";

// Prospect analysis. What a prospect shared (statements, a tax return, an
// old plan) is read; their situation comes out as a few numbers, then the
// planning opportunities worth raising; one click adds them to the CRM.
export type ProspectState = {
  readonly read?: number; // 0–3 documents read (fractional: the one in progress)
  readonly tiles?: number; // 0–3 numbers in
  readonly ideas?: number; // 0–3 opportunities in
  readonly added?: number; // 0–1 "Added to CRM"
  readonly press?: number;
  readonly pointer?: { x: number; y: number; o: number };
};

const FILES = [
  { name: "Brokerage statements", meta: "PDF · 6 pages" },
  { name: "Tax return", meta: "Form 1040" },
  { name: "Previous advisor’s plan", meta: "PDF · 18 pages" },
];
const TILES = [
  { value: "$3.2M", label: "Investable assets" },
  { value: "38%", label: "In employer stock" },
  { value: "2", label: "Children, 8 and 11" },
];
const IDEAS = [
  { text: "Diversify the concentrated RSUs", tag: "Investments" },
  { text: "Roth conversion before the RSUs vest", tag: "Tax" },
  { text: "529 plans for both children", tag: "Planning" },
];
const L = { x: 14, top: 92, h: 50, gap: 8, w: 196 };
const R = { x: 226, w: 340 };
export const CREATE_AT = { x: 20 + 580 - 20 - 56, y: 14 + 34 };

export const ProspectAnalysis: React.FC<{ readonly s: ProspectState }> = ({ s }) => {
  const { read = 3, tiles = 3, ideas = 3, added = 1, press = 0, pointer } = s;
  return (
    <Frame>
      <Panel>
        <Head
          lead={<Initials text="TS" tone="blue" />}
          title="Taylor Smith"
          sub="Prospect · Referred by Allison Chan"
          right={
            added > 0.5 ? (
              <Button primary={false} style={{ height: 26, marginTop: -2, color: C.greenInk, background: C.greenBg, border: `1px solid ${C.greenBg}` }}>
                <Icon name="check-dark" w={9} /> Added to CRM
              </Button>
            ) : (
              <Button press={press} style={{ height: 26, marginTop: -2, opacity: 0.4 + 0.6 * c01(ideas - 2) }}>
                Create opportunity
              </Button>
            )
          }
        />
        {/* what they shared, being read */}
        <Label style={{ position: "absolute", left: L.x + 4, top: 76 }}>What they shared</Label>
        {FILES.map((f, i) => {
          const p = c01(read - i);
          return (
            <div key={f.name} style={{ position: "absolute", left: L.x, top: L.top + i * (L.h + L.gap), width: L.w, height: L.h, boxSizing: "border-box", padding: "0 10px", borderRadius: 8, background: C.tile, display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: C.greenIcon, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="file-text" w={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                {p >= 1 ? (
                  <div style={{ fontSize: 9.5, color: C.muted, marginTop: 2 }}>{f.meta}</div>
                ) : (
                  <div style={{ width: 96, height: 4, borderRadius: 2, background: "#e3e7eb", marginTop: 5, overflow: "hidden" }}>
                    <div style={{ width: `${p * 100}%`, height: "100%", background: C.green2 }} />
                  </div>
                )}
              </div>
              {p >= 1 ? <Done /> : null}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: L.x + 4, top: 274, display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: C.sub2, opacity: c01(read - 2) }}>
          <Icon name="savvy-mark" w={12} /> Read by Savvy Intelligence
        </div>

        {/* their situation */}
        <Label style={{ position: "absolute", left: R.x, top: 76 }}>Their situation</Label>
        <div style={{ position: "absolute", left: R.x, top: 92, width: R.w, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {TILES.map((t, i) => {
            const on = c01(tiles - i);
            return (
              <div key={t.label} style={{ position: "relative", height: 62, borderRadius: 8, background: C.tile, padding: "11px 11px", boxSizing: "border-box" }}>
                <div style={{ opacity: on, translate: `0px ${(1 - on) * 4}px` }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: C.ink }}>{t.value}</div>
                  <div style={{ fontSize: 9.5, color: C.muted, marginTop: 4, whiteSpace: "nowrap" }}>{t.label}</div>
                </div>
                {on < 1 ? (
                  <div style={{ position: "absolute", left: 11, top: 14, opacity: 1 - on }}>
                    <Skeleton w={50} h={11} />
                    <Skeleton w={78} h={7} style={{ marginTop: 9 }} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* worth raising */}
        <Label style={{ position: "absolute", left: R.x, top: 168 }}>Worth raising</Label>
        {IDEAS.map((idea, i) => {
          const on = c01(ideas - i);
          return (
            <div key={idea.text} style={{ position: "absolute", left: R.x, top: 184 + i * 42, width: R.w, height: 36, boxSizing: "border-box", padding: "0 11px", borderRadius: 8, background: on > 0 ? "rgba(222,243,220,0.55)" : C.tile, display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ position: "relative", flex: 1, height: 16 }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: C.text, whiteSpace: "nowrap", opacity: on, translate: `0px ${(1 - on) * 4}px` }}>
                  <span style={{ width: 5, height: 5, borderRadius: 3, background: C.green2 }} />
                  {idea.text}
                </div>
                {on < 1 ? <Skeleton w={190 - i * 20} h={8} style={{ position: "absolute", top: 4, opacity: 1 - on }} /> : null}
              </div>
              <div style={{ fontSize: 9.5, color: C.greenInk, padding: "2px 7px", borderRadius: 10, background: "#ffffff", opacity: on }}>{idea.tag}</div>
            </div>
          );
        })}
      </Panel>
      {pointer && pointer.o > 0 ? (
        <div style={{ opacity: pointer.o }}>
          <Pointer x={pointer.x} y={pointer.y} />
        </div>
      ) : null}
    </Frame>
  );
};

export const PROSPECT_FRAMES: readonly { s: ProspectState; title: string; caption: string }[] = [
  { s: { read: 1.55, tiles: 0, ideas: 0, added: 0 }, title: "What they shared", caption: "Taylor Smith, referred by the Chans, shares their statements, tax return and previous advisor’s plan. Savvy reads them, one after another." },
  { s: { read: 3, tiles: 3, ideas: 0.6, added: 0 }, title: "Their situation", caption: "The situation comes out in three numbers: $3.2M investable, 38% in employer stock, two children." },
  { s: { pointer: { ...CREATE_AT, o: 1 } }, title: "Worth raising", caption: "Then the opportunities worth raising (the RSUs, a Roth conversion, 529s), and one click adds Taylor to the CRM." },
];
