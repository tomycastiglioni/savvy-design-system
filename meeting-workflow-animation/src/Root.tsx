import "./shared/fonts";
import { Composition, Folder } from "remotion";
import { Capture } from "./capture/Capture";
import { Delivery } from "./delivery/Delivery";
import { MeetingPrep } from "./meeting-prep/MeetingPrep";
import { Recap } from "./recap/Recap";

export const RemotionRoot: React.FC = () => {
  return (
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
  );
};
