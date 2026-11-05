import "./shared/fonts";
import { Composition, Folder, Still } from "remotion";
import { Capture } from "./capture/Capture";
import { Delivery } from "./delivery/Delivery";
import { Launch } from "./launch/Launch";
import { DURATION } from "./launch/timeline";
import { CLIENT_LIST_SIZE, ClientListStill } from "./launch30/frames/Clients";
import { Launch30 } from "./launch30/Launch30";
import { Launch30Peek } from "./launch30/Peek";
import { FRAMES as LAUNCH30_FRAMES, Launch30Storyboard } from "./launch30/Storyboard";
import { DURATION as LAUNCH30_DURATION } from "./launch30/timeline";
import { MeetingPrep } from "./meeting-prep/MeetingPrep";
import { MobileHousehold } from "./mobile-household/MobileHousehold";
import { MobileHouseholdOptions, OPTIONS as MOBILE_HOUSEHOLD_OPTIONS } from "./mobile-household/Options";
import { DURATION as MOBILE_HOUSEHOLD_DURATION } from "./mobile-household/timeline";
import { MobilePrep } from "./mobile-prep/MobilePrep";
import { MobileRecap } from "./mobile-recap/MobileRecap";
import { MobileRecapOptions, OPTIONS as MOBILE_RECAP_OPTIONS } from "./mobile-recap/Options";
import { DURATION as MOBILE_RECAP_DURATION } from "./mobile-recap/timeline";
import { DURATION as MOBILE_PREP_DURATION } from "./mobile-prep/timeline";
import { Recap } from "./recap/Recap";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Meeting-workflow">
        <Composition
          id="MeetingPrep"
          component={MeetingPrep}
          durationInFrames={720}
          fps={60}
          width={1300}
          height={900}
        />
        <Composition
          id="Delivery"
          component={Delivery}
          durationInFrames={720}
          fps={60}
          width={1300}
          height={900}
        />
        <Composition
          id="Capture"
          component={Capture}
          durationInFrames={720}
          fps={60}
          width={1300}
          height={900}
        />
        <Composition
          id="Recap"
          component={Recap}
          durationInFrames={960}
          fps={60}
          width={1300}
          height={900}
        />
      </Folder>
      <Composition
        id="Launch"
        component={Launch}
        durationInFrames={DURATION}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="Launch30"
        component={Launch30}
        durationInFrames={LAUNCH30_DURATION}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="Launch30Peek"
        component={Launch30Peek}
        durationInFrames={LAUNCH30_DURATION}
        fps={60}
        width={1920}
        height={1080}
      />
      <Still
        id="Launch30ClientList"
        component={ClientListStill}
        width={CLIENT_LIST_SIZE.w}
        height={CLIENT_LIST_SIZE.h}
      />
      <Composition
        id="Launch30Storyboard"
        component={Launch30Storyboard}
        durationInFrames={LAUNCH30_FRAMES.length}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MobilePrep"
        component={MobilePrep}
        durationInFrames={MOBILE_PREP_DURATION}
        fps={60}
        width={1080}
        height={2348}
      />
      <Composition
        id="MobileHousehold"
        component={MobileHousehold}
        durationInFrames={MOBILE_HOUSEHOLD_DURATION}
        fps={60}
        width={1080}
        height={2348}
      />
      <Composition
        id="MobileHouseholdOptions"
        component={MobileHouseholdOptions}
        durationInFrames={MOBILE_HOUSEHOLD_OPTIONS.length}
        fps={30}
        width={1080}
        height={2348}
      />
      <Composition
        id="MobileRecap"
        component={MobileRecap}
        durationInFrames={MOBILE_RECAP_DURATION}
        fps={60}
        width={1080}
        height={2348}
      />
      <Composition
        id="MobileRecapOptions"
        component={MobileRecapOptions}
        durationInFrames={MOBILE_RECAP_OPTIONS.length}
        fps={30}
        width={1080}
        height={2348}
      />
    </>
  );
};
