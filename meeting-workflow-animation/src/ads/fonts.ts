import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { loadDiatype } from "../launch/fonts";

let ready: Promise<unknown> | null = null;

// The ads' headlines are ABC Diatype Light (licensed, not committed: put
// ABCDiatype-Light.otf in public/fonts/ next to Regular and Bold). Resolves
// once every face is in, so the bento ads can measure their copy.
export const loadAdFonts = () => {
  ready ??= Promise.all([loadDiatype(), loadFont({ family: "ABC Diatype", url: staticFile("fonts/ABCDiatype-Light.otf"), weight: "300" })]);
  return ready;
};
