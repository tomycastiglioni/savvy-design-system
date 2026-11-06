import "./shared/fonts";
import { adFrames, ADS, MeetingStepAd } from "./ads/MeetingStepAd";
import { FORMATS } from "./ads/layout";
import { Composition, Folder, Still } from "remotion";
import { Capture } from "./capture/Capture";
import { Delivery } from "./delivery/Delivery";
import { Launch } from "./launch/Launch";
import { DURATION } from "./launch/timeline";
import { CLIENT_LIST_SIZE, ClientListStill } from "./launch30/frames/Clients";
import { FORMATS as LAUNCH30_FORMATS, Launch30Format } from "./launch30/Formats";
import { BOARD_KEYS as MORE_WAYS_BOARDS, boardSize as moreWaysBoardSize, MoreWaysStoryboard } from "./more-ways/Storyboard";
import { Launch30 } from "./launch30/Launch30";
import { Launch30Peek } from "./launch30/Peek";
import { FRAMES as LAUNCH30_FRAMES, Launch30Storyboard } from "./launch30/Storyboard";
import { durationOf, PEEK_TIMELINE, TIMELINE as LAUNCH30_TIMELINE } from "./launch30/timeline";
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
      {(["4x5", "1x1", "9x16"] as const).map((format) => (
        <Folder key={format} name={`Ads-${format}`}>
          {(
            [
              ["AdPrep", ADS.prep, 12],
              ["AdMeet", ADS.meet, 12],
              ["AdCapture", ADS.capture, 12],
              ["AdDeliver", ADS.deliver, 16],
            ] as const
          ).map(([id, spec, seconds]) => (
            <Composition
              key={id}
              id={`${id}${format}`}
              component={MeetingStepAd}
              defaultProps={{ ...spec, format }}
              durationInFrames={adFrames(spec, seconds)}
              fps={60}
              width={FORMATS[format].w}
              height={FORMATS[format].h}
            />
          ))}
        </Folder>
      ))}
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
        durationInFrames={durationOf(LAUNCH30_TIMELINE)}
        fps={60}
        width={1920}
        height={1080}
      />
      <Folder name="MoreWays-storyboards">
        {MORE_WAYS_BOARDS.map((card) => (
          <Still key={card} id={`MoreWays-board-${card}`} component={MoreWaysStoryboard} defaultProps={{ card }} width={moreWaysBoardSize(card).w} height={moreWaysBoardSize(card).h} />
        ))}
      </Folder>
      <Folder name="Launch30-formats">
        {(["4x5", "1x1", "9x16"] as const).map((format) => (
          <Composition
            key={format}
            id={`Launch30-${format}`}
            component={Launch30Format}
            defaultProps={{ format }}
            durationInFrames={durationOf(LAUNCH30_TIMELINE)}
            fps={60}
            width={LAUNCH30_FORMATS[format].w}
            height={LAUNCH30_FORMATS[format].h}
          />
        ))}
      </Folder>
      <Composition
        id="Launch30Peek"
        component={Launch30Peek}
        durationInFrames={durationOf(PEEK_TIMELINE)}
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
