import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

let ready: Promise<unknown> | null = null;

// ABC Diatype (Dinamo) is licensed by Savvy, so it is not committed to this
// public repo. Put ABCDiatype-Regular.otf and ABCDiatype-Bold.otf in
// public/fonts/ to render the launch video. Loaded from the Launch component
// so the other compositions never depend on these files. Resolves once both
// faces are in (for layouts that measure text).
export const loadDiatype = () => {
  ready ??= Promise.all([
    loadFont({ family: "ABC Diatype", url: staticFile("fonts/ABCDiatype-Regular.otf"), weight: "400" }),
    loadFont({ family: "ABC Diatype", url: staticFile("fonts/ABCDiatype-Bold.otf"), weight: "700" }),
  ]);
  return ready;
};
