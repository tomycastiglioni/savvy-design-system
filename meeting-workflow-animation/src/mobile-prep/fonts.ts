import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter (SIL OFL) stands in for SF Pro in the iOS status bar. The app itself
// uses DM Sans like the other videos.
for (const weight of ["400", "500", "600", "700"]) {
  loadFont({
    family: "Inter",
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}
