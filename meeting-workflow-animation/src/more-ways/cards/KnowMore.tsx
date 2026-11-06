import React from "react";
import { Icon, Skeleton } from "../Bits";
import { C, DM, FONT, MEDIUM } from "../theme";

// 02 · Know more than they expect (700×294). The prospect card (Figma), which
// runs off the bottom: the prospect's documents drop in and are read, the
// card fills in, scrolls to the opportunities worth raising and the first
// meeting's agenda, and "Create opportunity" adds Taylor to the CRM.
export type KnowState = {
  readonly files?: number; // 0–1: the three documents dropping in (before reading)
  readonly reading?: number; // 0–1: progress reading them
  readonly filled?: number; // 0–4: stat tiles filled in
  readonly named?: boolean; // the header shows Taylor Smith (else "New prospect")
  readonly scroll?: number; // px the card content scrolls up
  readonly added?: boolean; // "Added to CRM"
  readonly press?: number;
};

const W = 700;
const H = 294;
const CARD = { x: (W - 626.046) / 2, y: 29, w: 626.046, h: 520 };
const GRID = { x: 23.04, y: 93.26, w: 578.438, h: 178.53 };
const TILES = [
  { value: "$3.2M", label: "Estimated investable assets" },
  { value: "Tech Executive", label: "Occupation" },
  { value: "2", label: "Related households" },
  { value: "Warm", label: "Source" },
];
const FILES = [
  { name: "Brokerage statements", meta: "PDF · 6 pages" },
  { name: "Tax return", meta: "Form 1040" },
  { name: "Financial plan from previous advisor", meta: "PDF · 18 pages" },
];
const OPPORTUNITIES = ["Concentrated stock in employer RSUs", "Roth conversion before RSUs vest", "529 plans for both children"];
const AGENDA = ["Goals and timeline", "Equity compensation plan", "Next steps and onboarding"];

const FileRow: React.FC<{ readonly name: string; readonly meta: string; readonly p: number }> = ({ name, meta, p }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, height: 50, padding: "0 14px", borderRadius: 8.33, background: C.tile }}>
    <div style={{ width: 30, height: 30, borderRadius: 15, background: C.greenIcon, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="file-text" w={16} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: DM, fontWeight: 600, fontSize: 12.5, color: C.ink }}>{name}</div>
      <div style={{ fontFamily: DM, fontSize: 11, color: C.sub2, marginTop: 2 }}>{meta}</div>
    </div>
    <div style={{ width: 96, height: 4, borderRadius: 2, background: "#e6e9ed", overflow: "hidden" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: C.green2 }} />
    </div>
  </div>
);

export const KnowMore: React.FC<{ readonly s: KnowState }> = ({ s }) => {
  const { files = 1, reading = 1, filled = 4, named = true, scroll = 0, added = false, press = 0 } = s;
  const docsView = filled === 0;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          background: "#ffffff",
          border: `0.769px solid ${C.border}`,
          borderRadius: 10.5,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, translate: `0px ${-scroll}px` }}>
          {/* header */}
          <div style={{ position: "absolute", left: 23.04, top: 21.84, display: "flex", alignItems: "center", gap: 12.746 }}>
            <div style={{ width: 41.354, height: 41.354, borderRadius: "50%", background: C.greenSoft, position: "relative" }}>
              {named ? <Icon name="ts-initials" w={22.016} h={13.564} style={{ position: "absolute", left: 9.67, top: 13.9 }} /> : null}
            </div>
            <div>
              <div style={{ fontWeight: MEDIUM, fontSize: 14.81, lineHeight: "20.364px", color: C.ink }}>{named ? "Taylor Smith" : "New prospect"}</div>
              <div style={{ fontSize: 10.845, color: C.muted }}>{named ? "Prospect · High potential" : `Reading ${FILES.length} documents…`}</div>
            </div>
          </div>
          <div style={{ position: "absolute", right: 23.04, top: 24.82, display: "flex", gap: 11.902 }}>
            <div
              style={{
                height: 35.706,
                boxSizing: "border-box",
                padding: "0 14.282px",
                borderRadius: 5.951,
                display: "flex",
                alignItems: "center",
                gap: 7.141,
                background: added ? C.greenBg : C.green,
                border: `1.19px solid ${added ? C.greenBg : C.green}`,
                color: added ? C.greenInk : "#ffffff",
                fontWeight: MEDIUM,
                fontSize: 11.902,
                opacity: named ? 1 : 0.35,
                scale: 1 - 0.05 * press,
              }}
            >
              {added ? <Icon name="check-dark" w={11} /> : null}
              {added ? "Added to CRM" : "Create opportunity"}
              {added ? null : <Icon name="arrow-up-right" w={14.137} />}
            </div>
            <div style={{ width: 35.706, height: 35.706, boxSizing: "border-box", border: "0.98px solid #c6c6c6", borderRadius: 5.951, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="dots" w={17.489} h={3.449} />
            </div>
          </div>

          {docsView ? (
            // the documents the prospect shared, being read
            <div style={{ position: "absolute", left: GRID.x, top: GRID.y - 6, width: GRID.w, display: "flex", flexDirection: "column", gap: 9 }}>
              {FILES.map((f, i) => (
                <div key={f.name} style={{ opacity: Math.min(1, Math.max(0, files * 3 - i)), translate: `0px ${(1 - Math.min(1, Math.max(0, files * 3 - i))) * -24}px` }}>
                  <FileRow name={f.name} meta={f.meta} p={Math.min(1, Math.max(0, reading * 1.6 - i * 0.3))} />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                left: GRID.x,
                top: GRID.y,
                width: GRID.w,
                height: GRID.h,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                columnGap: 11.902,
                rowGap: 10.712,
              }}
            >
              {TILES.map((t, i) => (
                <div key={t.label} style={{ background: C.tile, borderRadius: 8.331, padding: 23.804, display: "flex", flexDirection: "column", justifyContent: "center", gap: 7.141 }}>
                  {i < filled ? (
                    <>
                      <div style={{ fontFamily: DM, fontWeight: 600, fontSize: 19.043, lineHeight: "22.255px", color: C.ink }}>{t.value}</div>
                      <div style={{ fontFamily: DM, fontSize: 11.902, lineHeight: "14.837px", color: C.sub2 }}>{t.label}</div>
                    </>
                  ) : (
                    <>
                      <Skeleton w={90} h={14} />
                      <Skeleton w={150} h={8} style={{ marginTop: 4 }} />
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* below the stats: what to raise, and the first meeting */}
          <div style={{ position: "absolute", left: GRID.x, top: GRID.y + GRID.h + 24, width: GRID.w, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 11.902 }}>
            <div>
              <div style={{ fontWeight: MEDIUM, fontSize: 12.5, color: C.ink, marginBottom: 10 }}>Opportunities worth raising</div>
              {OPPORTUNITIES.map((o) => (
                <div key={o} style={{ display: "flex", alignItems: "center", gap: 9, height: 34, padding: "0 12px", marginBottom: 6, borderRadius: 7, background: C.tile, fontFamily: DM, fontSize: 11.5, color: C.ink }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: C.green2 }} />
                  {o}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: MEDIUM, fontSize: 12.5, color: C.ink, marginBottom: 10 }}>First meeting agenda</div>
              {AGENDA.map((a, i) => (
                <div key={a} style={{ display: "flex", alignItems: "center", gap: 9, height: 34, padding: "0 12px", marginBottom: 6, borderRadius: 7, background: C.tile, fontFamily: DM, fontSize: 11.5, color: C.ink }}>
                  <div style={{ width: 18, height: 18, borderRadius: 9, background: C.greenIcon, color: C.green, fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {added ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 18,
            translate: "-50% 0px",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 16px",
            borderRadius: 10,
            background: "#0f2a35",
            color: "#ffffff",
            fontSize: 12.5,
            boxShadow: "0 16px 30px -12px rgba(0,0,0,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check-green" w={9} />
          </div>
          Taylor Smith added to your CRM
        </div>
      ) : null}
    </div>
  );
};

export const KNOW_FRAMES: readonly { s: KnowState; title: string; caption: string }[] = [
  { s: { named: false, filled: 0, files: 0.62, reading: 0 }, title: "What they shared", caption: "A new prospect. Their brokerage statements, tax return and old plan drop onto the card." },
  { s: { named: false, filled: 0, files: 1, reading: 0.55 }, title: "Read", caption: "Savvy reads all three; each document's bar fills." },
  { s: { named: true, filled: 4 }, title: "Their situation", caption: "The summary fills in tile by tile: Taylor Smith, $3.2M investable, Tech Executive, two households, warm source." },
  { s: { named: true, filled: 4, scroll: 196 }, title: "Opportunities and agenda", caption: "The card scrolls to the planning opportunities worth raising and the first meeting's agenda." },
  { s: { named: true, filled: 4, added: true }, title: "Added to your CRM", caption: "Back up, the details confirmed: “Create opportunity” turns to “Added to CRM”, with a toast." },
];
