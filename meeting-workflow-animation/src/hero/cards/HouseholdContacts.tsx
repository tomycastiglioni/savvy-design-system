import React from "react";
import { Icon, Pointer } from "../../more-ways/Bits";
import { C, MEDIUM } from "../../more-ways/theme";
import { c01, Frame, Head, Initials, Label, Panel } from "../Bits";

// Household contact summaries. Everyone around the Chans in one place, the
// family and their professionals; pick a contact and their summary opens:
// how they like to be reached, the last contact, what's coming up, and what
// to remember. Kept current by Savvy Intelligence after every meeting.
export type ContactsState = {
  readonly selected?: number; // the contact shown
  readonly open?: number; // 0–1 the summary filling in
  readonly pointer?: { x: number; y: number; o: number };
};

type Tone = "green" | "blue" | "violet" | "amber" | "grey";
const CONTACTS: readonly { name: string; role: string; initials: string; tone: Tone; fields: readonly [string, string][] }[] = [
  {
    name: "Allison Chan",
    role: "Primary · 62",
    initials: "AC",
    tone: "green",
    fields: [
      ["Prefers", "Email, afternoons"],
      ["Last contact", "Quarterly Review, Oct 14"],
      ["Coming up", "Birthday, Mar 3"],
      ["Remember", "Leads on Ellie’s college planning"],
    ],
  },
  {
    name: "Frank Chan",
    role: "Spouse · 64",
    initials: "FC",
    tone: "green",
    fields: [
      ["Prefers", "Phone, mornings"],
      ["Last contact", "Quarterly Review, Oct 14"],
      ["Coming up", "RMDs start next year · Birthday, Dec 2"],
      ["Remember", "Asked about Social Security timing"],
    ],
  },
  { name: "Ellie Chan", role: "Daughter · 17", initials: "EC", tone: "blue", fields: [] },
  {
    name: "Mark Lee",
    role: "CPA",
    initials: "ML",
    tone: "violet",
    fields: [
      ["Prefers", "Email"],
      ["Last contact", "Shared last year’s return, Sep 30"],
      ["Coming up", "Tax projection review, January"],
      ["Remember", "Coordinating the Roth conversion"],
    ],
  },
  { name: "Diane Ortiz", role: "Estate attorney", initials: "DO", tone: "amber", fields: [] },
];
const LIST = { x: 14, top: 74, h: 42, gap: 4, w: 196 };
export const contactAt = (i: number) => ({ x: 20 + LIST.x + 150, y: 14 + LIST.top + i * (LIST.h + LIST.gap) + LIST.h / 2 }); // frame px
const DETAIL = { x: 224, y: 74, w: 342, h: 220 };

export const HouseholdContacts: React.FC<{ readonly s: ContactsState }> = ({ s }) => {
  const { selected = 1, open = 1, pointer } = s;
  const c = CONTACTS[selected];
  return (
    <Frame>
      <Panel>
        <Head lead={<Initials text="AC" />} title="Chan household" sub="5 contacts · family and professionals" />
        {/* everyone around the household */}
        {CONTACTS.map((p, i) => {
          const on = i === selected;
          return (
            <div
              key={p.name}
              style={{
                position: "absolute",
                left: LIST.x,
                top: LIST.top + i * (LIST.h + LIST.gap),
                width: LIST.w,
                height: LIST.h,
                boxSizing: "border-box",
                padding: "0 9px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: on ? "rgba(222,243,220,0.6)" : "transparent",
                boxShadow: on ? "inset 0 0 0 1px rgba(8,107,78,0.25)" : undefined,
              }}
            >
              <Initials text={p.initials} size={26} tone={p.tone} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: on ? MEDIUM : 400, color: C.ink, whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 9.5, color: C.muted, marginTop: 1, whiteSpace: "nowrap" }}>{p.role}</div>
              </div>
            </div>
          );
        })}

        {/* the selected contact's summary */}
        <div style={{ position: "absolute", left: DETAIL.x, top: DETAIL.y, width: DETAIL.w, height: DETAIL.h, borderRadius: 9, background: C.tile, padding: "14px 16px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Initials text={c.initials} size={34} tone={c.tone} />
            <div>
              <div style={{ fontWeight: MEDIUM, fontSize: 14, color: C.ink }}>{c.name}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{c.role}</div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
            {c.fields.map(([k, v], i) => {
              const on = c01(open * 4.5 - i);
              return (
                <div key={k} style={{ display: "flex", gap: 12, opacity: on, translate: `0px ${(1 - on) * 4}px` }}>
                  <Label style={{ width: 74, paddingTop: 2 }}>{k}</Label>
                  <div style={{ fontSize: 11.5, color: C.text }}>{v}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position: "absolute", left: DETAIL.x, top: DETAIL.y + DETAIL.h + 12, display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: C.sub2 }}>
          <Icon name="savvy-mark" w={12} /> Updated by Savvy Intelligence after every meeting
        </div>
      </Panel>
      {pointer && pointer.o > 0 ? (
        <div style={{ opacity: pointer.o }}>
          <Pointer x={pointer.x} y={pointer.y} />
        </div>
      ) : null}
    </Frame>
  );
};

export const CONTACTS_FRAMES: readonly { s: ContactsState; title: string; caption: string }[] = [
  { s: { selected: 0 }, title: "The whole household", caption: "Everyone around the Chans in one place: Allison, Frank, Ellie, their CPA and their estate attorney. Allison’s summary is open." },
  { s: { selected: 1, open: 0.55, pointer: { ...contactAt(1), o: 1 } }, title: "Before you dial Frank", caption: "Pick Frank and his summary fills in: phone, mornings; RMDs start next year; he asked about Social Security timing." },
  { s: { selected: 3, pointer: { ...contactAt(3), o: 1 } }, title: "Their professionals too", caption: "Mark Lee, their CPA: last year’s return shared Sep 30, a tax projection review in January, coordinating the Roth conversion." },
];
