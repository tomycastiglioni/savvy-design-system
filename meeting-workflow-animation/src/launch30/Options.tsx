import React, { useState } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadDiatype } from "../launch/fonts";
import { F01Title } from "./frames/Clients";
import { CaptureFrame } from "./frames/Communicate";
import { F10Recap, SentTeamA, SentTeamB } from "./frames/Deliver";
import { C, FONT } from "./theme";

// Static frames for the team's third round, one per frame: the new opening
// line, the two options for the CRM sync indicator at 0:14 (A · status in the
// recording app, B · the client's profile filling in beside the phone), the
// recap with the new headline and "Approve & send to team", and the two
// options for the tasks going to the team at 0:22 (A · faces on the tasks
// line, B · a "Sent to your team" card). Render with `remotion still`.
const CaptureSync: React.FC = () => <CaptureFrame sync />;
const CaptureProfile: React.FC = () => <CaptureFrame profile />;

export const OPTIONS: readonly React.FC[] = [F01Title, CaptureSync, CaptureProfile, F10Recap, SentTeamA, SentTeamB];

export const Launch30Options: React.FC = () => {
  useState(loadDiatype);
  const Frame = OPTIONS[Math.min(useCurrentFrame(), OPTIONS.length - 1)];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink, overflow: "hidden" }}>
      <style>{"*{box-sizing:border-box;}"}</style>
      <Frame />
    </AbsoluteFill>
  );
};
