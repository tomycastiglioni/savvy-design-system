import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { loadDiatype } from "../launch/fonts";

let requested = false;

// The ads' headlines are ABC Diatype Light (licensed, not committed: put
// ABCDiatype-Light.otf in public/fonts/ next to Regular and Bold).
export const loadAdFonts = () => {
  loadDiatype();
  if (requested) {
    return;
  }
  requested = true;
  loadFont({ family: "ABC Diatype", url: staticFile("fonts/ABCDiatype-Light.otf"), weight: "300" });
};
