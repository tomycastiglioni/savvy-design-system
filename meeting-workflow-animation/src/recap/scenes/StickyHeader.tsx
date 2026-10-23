import { Check, FilePlus2, Send } from "lucide-react";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OutlineButton, Swap, useClick } from "../components/Bits";
import { C, CLAMP, CREATE_BTN, DOC_PANEL, DRAFT_BTN, EASE_OUT, STICKY_H } from "../layout";
import { T } from "../timeline";

// Panel-local position of a canvas rect (inside the panel's 1px border).
const local = (r: { x: number; y: number }) => ({ left: r.x - DOC_PANEL.x - 1, top: r.y - DOC_PANEL.y - 1 });

// Slides into the top of the recap while scrolling, keeping the actions in reach.
export const StickyHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const enter = interpolate(t, [T.stickyIn, T.stickyIn + 0.4], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const create = useClick(T.clickCreate);
  const draft = useClick(T.clickDraft);
  const created = interpolate(t, [T.toRecap + 0.3, T.toRecap + 0.6], [0, 1], CLAMP);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: DOC_PANEL.w - 2,
        height: STICKY_H,
        background: C.white,
        borderBottom: "1px solid #EEF0F2",
        opacity: enter,
        translate: `0px ${(1 - enter) * -STICKY_H}px`,
      }}
    >
      <div style={{ position: "absolute", left: 52, top: 21, fontSize: 16, fontWeight: 600, color: C.ink }}>
        Quarterly Review recap <span style={{ fontWeight: 400, color: C.muted }}>· Jul 31, 2026</span>
      </div>

      <div style={{ position: "absolute", ...local(CREATE_BTN) }}>
        <OutlineButton w={CREATE_BTN.w} h={CREATE_BTN.h} hover={t < T.toRecap ? create.hover : 0} press={create.press}>
          <Swap
            p={created}
            a={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FilePlus2 size={15} strokeWidth={1.9} /> Create client document
              </span>
            }
            b={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={15} strokeWidth={2.4} color={C.green} /> View client document
              </span>
            }
          />
        </OutlineButton>
      </div>

      <div style={{ position: "absolute", ...local(DRAFT_BTN), opacity: t >= T.loadStart ? 0 : 1 }}>
        <OutlineButton w={DRAFT_BTN.w} h={DRAFT_BTN.h} hover={draft.hover} press={draft.press}>
          <Send size={15} strokeWidth={1.9} /> Draft client email
        </OutlineButton>
      </div>
    </div>
  );
};
