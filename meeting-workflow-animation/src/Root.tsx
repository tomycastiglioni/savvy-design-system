import "./meeting-prep/fonts";
import { Composition, Folder } from "remotion";
import { MeetingPrep } from "./meeting-prep/MeetingPrep";

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
    </Folder>
  );
};
