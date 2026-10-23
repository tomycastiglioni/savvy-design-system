import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

let requested = false;

// ABC Diatype (Dinamo) is licensed by Savvy, so it is not committed to this
// public repo. Put ABCDiatype-Regular.otf and ABCDiatype-Bold.otf in
// public/fonts/ to render the launch video. Loaded from the Launch component
// so the other compositions never depend on these files.
export const loadDiatype = () => {
  if (requested) {
    return;
  }
  requested = true;
  loadFont({ family: "ABC Diatype", url: staticFile("fonts/ABCDiatype-Regular.otf"), weight: "400" });
  loadFont({ family: "ABC Diatype", url: staticFile("fonts/ABCDiatype-Bold.otf"), weight: "700" });
};
