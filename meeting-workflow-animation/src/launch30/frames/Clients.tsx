import { ChevronRight } from "lucide-react";
import React from "react";
import { Bg, CenteredLine, Cursor, HEAD } from "../components/Bits";
import { lerp, Rect } from "../components/Motion";
import { C, CY, FONT } from "../theme";

// The opening: "Deliver more for your clients with Savvy Intelligence", then the
// advisor's whole client list (the CRM, by last name), scrolled a long way
// down to Allison & Frank Chan, who get picked. The other names are made up. Layout from the team's mock-up (1920×1080).

export const TITLE_LINES = ["Deliver more for your clients", "with Savvy Intelligence"];
// Two lines centred on the middle line; when the list comes up the page
// scrolls so the title's cap top sits at 143.
export const TITLE_CAP = CY - (HEAD.lh + 0.7 * HEAD.size) / 2;
export const PAGE_UP = 143 - TITLE_CAP;

export type Client = { readonly name: string; readonly members: string; readonly aum: string };
export const CLIENTS: readonly Client[] = [
  { name: "Alan Ashby", members: "Alan Ashby", aum: "$567K" },
  { name: "Adeel Bakshi", members: "Adeel Bakshi", aum: "$430K" },
  { name: "Diana Barlow", members: "Diana Barlow", aum: "$1.12M" },
  { name: "Dan Bishop", members: "Dan Bishop", aum: "$686K" },
  { name: "Chris Calder", members: "Chris Calder", aum: "$322K" },
  { name: "Alice Carver & Jackie Lowell", members: "Alice Carver & Jackie Lowell", aum: "$4.54M" },
  { name: "Allison & Frank Chan", members: "Allison Chan & Frank Chan", aum: "$9.36M" },
  { name: "Elena & Mark Prescott", members: "Elena Prescott & Mark Prescott", aum: "$2.07M" },
  { name: "Grace & Tom Sutter", members: "Grace Sutter & Tom Sutter", aum: "$3.18M" },
  { name: "Henry Wexler", members: "Henry Wexler", aum: "$845K" },
];
// Allison & Frank Chan, the household the video follows.
export const SELECTED = 6;

// The list once the page has scrolled up (frame 2). `scroll` moves the rows on
// past that; the header sticks at STICK.
export const LIST = { x: 451, w: 1017, header: 460, top: 541, rowH: 125, gap: 20 };
export const STICK = 138;
// Far enough that the selected row sits mid-frame (frame 3): six rows down.
export const LIST_SCROLL = 825;
export const rowRect = (i: number, scroll: number): Rect => ({ x: LIST.x, y: LIST.top + i * (LIST.rowH + LIST.gap) - scroll, w: LIST.w, h: LIST.rowH });
export const headerTop = (scroll: number) => Math.max(STICK, LIST.header - scroll);

// One client row's content, laid out in its LIST.w × LIST.rowH card.
export const ClientRowContent: React.FC<{ readonly client: Client }> = ({ client }) => (
  <>
    <div style={{ position: "absolute", left: 31, top: 30, fontSize: 26, fontWeight: 500, color: C.ink, whiteSpace: "nowrap" }}>{client.name}</div>
    <div style={{ position: "absolute", left: 31, top: 70, fontSize: 22, color: C.muted, whiteSpace: "nowrap" }}>{client.members} · Client</div>
    <div style={{ position: "absolute", right: 31, top: 0, bottom: 0, display: "flex", alignItems: "center", fontSize: 26, color: C.body, fontVariantNumeric: "tabular-nums" }}>
      {client.aum}
    </div>
  </>
);

export const rowCard = (r: Rect, hover = 0): React.CSSProperties => ({
  position: "absolute",
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
  borderRadius: 10,
  background: C.white,
  border: `1.5px solid ${hover > 0 ? `rgba(103, 189, 141, ${hover})` : "#E3E6EA"}`,
  boxShadow: `0 1px 2px rgba(16, 24, 40, 0.04), 0 ${18 * hover}px ${40 * hover}px -18px rgba(16, 24, 40, ${0.28 * hover})`,
  scale: 1 + 0.012 * hover,
});

// The client list: sticky header and rows. `scroll` is how far the rows have
// moved past frame 2; `fade` widens the top fade as they slide under the
// header; `hover` lifts the selected row; `hide` skips rows (for the morph).
export const ClientList: React.FC<{
  readonly scroll?: number;
  readonly offset?: number;
  readonly opacity?: number;
  readonly hover?: number;
  readonly hide?: number;
  readonly style?: React.CSSProperties;
}> = ({ scroll = 0, offset = 0, opacity = 1, hover = 0, hide, style }) => {
  const hy = headerTop(scroll) + offset;
  const fade = Math.min(1, Math.max(0, scroll / LIST_SCROLL));
  const topFade = lerp(30, 70, fade);
  const topSolid = lerp(80, 300, fade);
  return (
    <div style={{ position: "absolute", inset: 0, opacity, ...style }}>
      <div style={{ position: "absolute", left: LIST.x, width: LIST.w, top: hy, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>Clients</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, color: C.body }}>
          View all <ChevronRight size={20} strokeWidth={2} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage: `linear-gradient(180deg, transparent ${hy + topFade}px, #000 ${hy + topSolid}px, #000 880px, transparent 1070px)`,
        }}
      >
        {CLIENTS.map((client, i) =>
          i === hide ? null : (
            <div key={client.name} style={rowCard(rowRect(i, scroll - offset), i === SELECTED ? hover : 0)}>
              <ClientRowContent client={client} />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export const Title: React.FC<{ readonly offset?: number; readonly lineStyle?: (i: number) => React.CSSProperties }> = ({ offset = 0, lineStyle = () => ({}) }) => (
  <>
    {TITLE_LINES.map((line, i) => (
      <CenteredLine key={line} capTop={TITLE_CAP + offset + i * HEAD.lh}>
        <span style={lineStyle(i)}>{line}</span>
      </CenteredLine>
    ))}
  </>
);

// The client list on its own, for a transparent still: header and all rows,
// no background and no scroll fade. CLIENT_LIST_SIZE is the canvas it needs
// (LIST.w plus room for the row shadows).
const PAD = 40;
export const CLIENT_LIST_SIZE = {
  w: LIST.w + 2 * PAD,
  h: PAD + (LIST.top - LIST.header) + CLIENTS.length * (LIST.rowH + LIST.gap) - LIST.gap + PAD,
};
export const ClientListStill: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
    <style>{"*{box-sizing:border-box;}"}</style>
    <div style={{ position: "absolute", left: PAD, width: LIST.w, top: PAD, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>Clients</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, color: C.body }}>
        View all <ChevronRight size={20} strokeWidth={2} />
      </div>
    </div>
    {CLIENTS.map((client, i) => (
      <div key={client.name} style={rowCard({ x: PAD, y: PAD + (LIST.top - LIST.header) + i * (LIST.rowH + LIST.gap), w: LIST.w, h: LIST.rowH })}>
        <ClientRowContent client={client} />
      </div>
    ))}
  </div>
);

// Where the cursor rests on the selected row.
export const pickPoint = (scroll: number) => {
  const r = rowRect(SELECTED, scroll);
  return { x: r.x + r.w - 260, y: r.y + r.h / 2 + 4 };
};

// F01 · 0:00 — the line.
export const F01Title: React.FC = () => (
  <>
    <Bg bg="cream" />
    <Title />
  </>
);

// F02 · 0:01.5 — the page scrolls up and the client list comes in under it.
export const F02Clients: React.FC = () => (
  <>
    <Bg bg="cream" />
    <Title offset={PAGE_UP} />
    <ClientList />
  </>
);

// F03 · 0:03 — scrolled to Allison & Frank Chan, who get picked.
export const F03Pick: React.FC = () => (
  <>
    <Bg bg="cream" />
    <ClientList scroll={LIST_SCROLL} hover={1} />
    <Cursor {...pickPoint(LIST_SCROLL)} />
  </>
);
