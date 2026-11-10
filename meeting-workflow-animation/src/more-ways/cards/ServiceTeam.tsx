import { ArrowRight } from "lucide-react";
import React from "react";
import { along, LINEAR, press as pressAt, ramp, useT, window } from "../anim";
import { Icon, Pill, Pointer, Spinner } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// v2 · 03 · Backed by your service team at Savvy (700×376), on the dark card.
// Left, the requests that came out of a meeting; the advisor approves one and
// it routes straight to their service team at Savvy (right), where someone
// picks it up and sees it through.
export type ServiceState = {
  readonly approved?: number; // 0–3 requests approved (fractional: the latest one on its way across)
  readonly status?: readonly number[]; // per ticket, 0 received → 1 in progress → 2 done
  readonly press?: number; // the Approve button being pressed
  readonly spin?: number;
  readonly pointer?: { x: number; y: number; o: number };
  readonly clear?: number; // 0–1: back to the start (the loop's reset)
};

const W = 700;
const H = 376;
const L = { x: 34, y: 40, w: 300, h: 296 }; // the meeting's requests
const R = { x: 366, y: 40, w: 300, h: 296 }; // the service team
const REQUESTS = [
  { title: "Open a 529 for Ellie", kind: "New account", who: { name: "Priya Kapoor", initials: "PK" } },
  { title: "Update IRA beneficiary", kind: "Beneficiary change", who: { name: "Marcus Reid", initials: "MR" } },
  { title: "Set up $2K monthly transfer", kind: "Money movement", who: { name: "Dana Whitman", initials: "DW" } },
];
const TEAM = [
  { initials: "PK", bg: "#ece3f6", ink: "#5b3d87" },
  { initials: "MR", bg: "#dcecf6", ink: "#1f5c80" },
  { initials: "DW", bg: "#f6e6d9", ink: "#8a4b1f" },
];
const tone = (initials: string) => TEAM.find((t) => t.initials === initials) ?? TEAM[0];
const REQ = { top: 96, h: 56, gap: 8 }; // rows in the left card
const TIX = { top: 96, h: 56, gap: 8 }; // tickets in the right card
export const APPROVE_AT = (i: number) => ({ x: L.x + L.w - 16 - 34, y: L.y + REQ.top + i * (REQ.h + REQ.gap) + REQ.h / 2 }); // frame px

const Avatar: React.FC<{ readonly initials: string; readonly size: number; readonly style?: React.CSSProperties }> = ({ initials, size, style }) => {
  const t = tone(initials);
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: t.bg, color: t.ink, fontSize: size * 0.38, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 2px #ffffff", ...style }}>
      {initials}
    </div>
  );
};

const Status: React.FC<{ readonly v: number; readonly spin: number }> = ({ v, spin }) =>
  v >= 2 ? (
    <Pill tone="green" size={10}>
      <Icon name="check-dark" w={8} /> Done
    </Pill>
  ) : v >= 1 ? (
    <Pill tone="amber" size={10}>
      <Spinner angle={spin} size={9} dark={false} /> In progress
    </Pill>
  ) : (
    <Pill tone="amber" size={10} style={{ background: "#f1f3f5", color: C.sub2 }}>
      Received
    </Pill>
  );

export const ServiceTeam: React.FC<{ readonly s: ServiceState }> = ({ s }) => {
  const { approved = 2, status = [2, 1], press = 0, spin = 0, pointer, clear = 0 } = s;
  const swap = clear > 0 ? Math.abs(1 - 2 * clear) : 1; // Approved → Approve, crossing at the middle
  const landed = Math.floor(approved);
  const flying = approved - landed > 0 && landed < REQUESTS.length ? approved - landed : 0;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      {/* the meeting's requests */}
      <div style={{ position: "absolute", left: L.x, top: L.y, width: L.w, height: L.h, background: "#ffffff", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 16, top: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: C.muted }}>
          <Icon name="savvy-mark" w={11} /> From your meeting
        </div>
        <div style={{ position: "absolute", left: 16, top: 34, fontWeight: MEDIUM, fontSize: 14, color: C.ink }}>Quarterly Review</div>
        <div style={{ position: "absolute", left: 16, top: 54, fontSize: 10.5, color: C.muted }}>Allison &amp; Frank Chan</div>
        <div style={{ position: "absolute", left: 16, right: 16, top: 80, height: 1, background: C.border }} />
        {REQUESTS.map((r, i) => {
          const done = approved > i && clear < 0.5;
          const pressing = !done && i === landed ? press : 0;
          return (
            <div
              key={r.title}
              style={{
                position: "absolute",
                left: 12,
                right: 12,
                top: REQ.top + i * (REQ.h + REQ.gap),
                height: REQ.h,
                padding: "0 10px",
                borderRadius: 8,
                background: C.tile,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: MEDIUM, fontSize: 12, color: C.ink, whiteSpace: "nowrap" }}>{r.title}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{r.kind}</div>
              </div>
              {done ? (
                <Pill tone="green" size={10} style={{ opacity: swap }}>
                  <Icon name="check-dark" w={8} /> Approved
                </Pill>
              ) : (
                <div style={{ padding: "6px 11px", borderRadius: 6, background: C.green, color: "#ffffff", fontWeight: MEDIUM, fontSize: 10.5, scale: 1 - 0.06 * pressing, opacity: approved > i ? swap : 1 }}>Approve</div>
              )}
            </div>
          );
        })}
      </div>

      {/* straight to the team */}
      <div style={{ position: "absolute", left: L.x + L.w + 6, top: L.y + L.h / 2 - 10, width: R.x - L.x - L.w - 12, display: "flex", justifyContent: "center", opacity: 0.55 }}>
        <ArrowRight size={18} color="#ffffff" strokeWidth={1.6} />
      </div>

      {/* your service team at Savvy */}
      <div style={{ position: "absolute", left: R.x, top: R.y, width: R.w, height: R.h, background: "#ffffff", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 16, top: 16, fontSize: 10, color: C.muted }}>Savvy</div>
        <div style={{ position: "absolute", left: 16, top: 34, fontWeight: MEDIUM, fontSize: 14, color: C.ink }}>Your service team</div>
        <div style={{ position: "absolute", left: 16, top: 54, fontSize: 10.5, color: C.muted }}>Takes it from there</div>
        <div style={{ position: "absolute", right: 16, top: 30, display: "flex" }}>
          {TEAM.map((t, i) => (
            <Avatar key={t.initials} initials={t.initials} size={27} style={{ marginLeft: i ? -3 : 0 }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 16, right: 16, top: 80, height: 1, background: C.border }} />
        {(landed === 0 && !flying) || clear > 0 ? (
          <div style={{ position: "absolute", left: 12, right: 12, top: TIX.top, height: TIX.h, borderRadius: 8, border: "1.2px dashed #d5dbd7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, color: C.muted, opacity: landed === 0 && !flying ? 1 : clear }}>
            Requests you approve land here
          </div>
        ) : null}
        {REQUESTS.slice(0, landed).map((r, i) => (
          <div
            key={r.title}
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              top: TIX.top + i * (TIX.h + TIX.gap),
              height: TIX.h,
              padding: "0 10px",
              borderRadius: 8,
              background: C.tile,
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: 1 - clear,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: MEDIUM, fontSize: 12, color: C.ink, whiteSpace: "nowrap" }}>{r.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3, fontSize: 10, color: C.muted }}>
                <Avatar initials={r.who.initials} size={15} style={{ boxShadow: "none" }} /> {r.who.name}
              </div>
            </div>
            <Status v={status[i] ?? 0} spin={spin} />
          </div>
        ))}
      </div>

      {/* the request on its way across */}
      {flying > 0
        ? (() => {
            const from = { x: L.x + 12, y: L.y + REQ.top + landed * (REQ.h + REQ.gap) };
            const to = { x: R.x + 12, y: R.y + TIX.top + landed * (TIX.h + TIX.gap) };
            const p = flying;
            const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
            return (
              <div
                style={{
                  position: "absolute",
                  left: from.x + (to.x - from.x) * e,
                  top: from.y + (to.y - from.y) * e - Math.sin(Math.PI * e) * 22,
                  width: L.w - 24,
                  height: REQ.h,
                  padding: "0 10px",
                  borderRadius: 8,
                  background: "#ffffff",
                  boxShadow: "0 16px 30px -12px rgba(0,0,0,0.45), 0 0 0 1px rgba(206,237,205,0.8)",
                  display: "flex",
                  alignItems: "center",
                  scale: 1 + 0.04 * Math.sin(Math.PI * e),
                }}
              >
                <div>
                  <div style={{ fontWeight: MEDIUM, fontSize: 12, color: C.ink, whiteSpace: "nowrap" }}>{REQUESTS[landed].title}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{REQUESTS[landed].kind}</div>
                </div>
              </div>
            );
          })()
        : null}

      {pointer && pointer.o > 0 ? (
        <div style={{ opacity: pointer.o }}>
          <Pointer x={pointer.x} y={pointer.y} />
        </div>
      ) : null}
    </div>
  );
};

export const SERVICE_FRAMES: readonly { s: ServiceState; title: string; caption: string }[] = [
  {
    s: { approved: 0, status: [], pointer: { ...APPROVE_AT(0), o: 1 } },
    title: "Requests from the meeting",
    caption: "After the Chans’ Quarterly Review: three requests, each waiting on the advisor’s OK. The cursor moves to “Approve”.",
  },
  { s: { approved: 0.5, status: [] }, title: "Approved, routed", caption: "Approved: the request lifts out and travels straight to the service team at Savvy." },
  { s: { approved: 1, status: [1], spin: 120 }, title: "They take it from there", caption: "It lands with the team: Priya Kapoor has it, “In progress”." },
  { s: { approved: 2, status: [2, 1], spin: 220 }, title: "Seen through", caption: "The 529 is done; the next approval is already with Marcus. Then the loop starts over." },
];

// The loop (13 s): the cursor approves the first request, which travels to
// the team and lands as "Received"; Priya picks it up ("In progress"). The
// second is approved and goes to Marcus. Both are seen through ("Done"),
// then everything fades back to the start.
export const SERVICE_SECONDS = 13;
export const ServiceTeamLoop: React.FC = () => {
  const t = useT();
  if (t >= 12.2) return <ServiceTeam s={{ approved: 0, status: [], spin: t * 360 }} />;
  const a0 = APPROVE_AT(0);
  const a1 = APPROVE_AT(1);
  const second = t >= 3.0;
  const p = second
    ? along(t, [
        [3.6, 610, 360],
        [4.3, a1.x + 4, a1.y + 4],
        [4.75, a1.x + 4, a1.y + 4],
        [5.35, 580, 350],
      ])
    : along(t, [
        [0.5, 610, 360],
        [1.2, a0.x + 4, a0.y + 4],
        [1.65, a0.x + 4, a0.y + 4],
        [2.25, 580, 350],
      ]);
  const o = second ? window(t, 3.6, 4.85, 0.25, 0.35) : window(t, 0.5, 1.75, 0.25, 0.35);
  return (
    <ServiceTeam
      s={{
        approved: ramp(t, 1.55, 2.45, LINEAR) + ramp(t, 4.65, 5.55, LINEAR),
        status: [t >= 6.6 ? 2 : t >= 3.2 ? 1 : 0, t >= 9.6 ? 2 : t >= 6.2 ? 1 : 0],
        press: second ? pressAt(t, 4.5) : pressAt(t, 1.4),
        spin: t * 360,
        pointer: { ...p, o },
        clear: ramp(t, 11.3, 12.2),
      }}
    />
  );
};
