import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// DM Sans + DM Serif Display (SIL OFL), bundled locally so renders never
// depend on Google Fonts being reachable.
for (const weight of ["400", "500", "600", "700"]) {
  loadFont({
    family: "DM Sans",
    url: staticFile(`fonts/dm-sans-latin-${weight}-normal.woff2`),
    weight,
  });
}

loadFont({
  family: "DM Sans",
  url: staticFile("fonts/dm-sans-latin-400-italic.woff2"),
  weight: "400",
  style: "italic",
});

loadFont({
  family: "DM Serif Display",
  url: staticFile("fonts/dm-serif-display-latin-400-normal.woff2"),
  weight: "400",
});
