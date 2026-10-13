# Future Founder landing page

CalHacks recruiting campaign page for Savvy's **Technical Staff — Future Founder** role.
Open `index.html` directly in a browser (no build step).

Built from the *Landing Page_V2* frame in the CLAUDE-TESTING Figma file (`QJAJaS7qru79fTrIq73NHt`, node `5203:166`, page EPD): a dark NYC paper-collage design. The previous pixel-art version (V1, node `5174:464`) is in git history (commit `7b9c9e0`).

Motion:
- Collages (Why Savvy, NYC, team polaroids) fade up as they scroll into view; polaroids straighten on hover.
- `$14T` tilts and grows slightly on hover.
- Ticker scrolls; builders band post cards scroll vertically (pauses on hover); the button uses a letter-roll hover.
- All of it stops under `prefers-reduced-motion`.

## Fonts

ABC Diatype is licensed, so it is **not committed** (`assets/fonts/` is git-ignored).
Drop `ABCDiatype-Regular.otf`, `ABCDiatype-Medium.otf` and `ABCDiatype-Bold.otf` into `future-founder/assets/fonts/` to render with the real type. Without them the page falls back to Inter.

## Assets

All exported from the Figma frame:
- `hero-collage.webp`, `why-collage.webp`, `fourteen.webp`, `pol-*.webp` at 2×; `nyc-collage.webp` at 1.5×. Each collage is flattened with its blend modes baked in, so edit it in Figma and re-export.
- `pol-*.webp`: the polaroids without their text; names, roles and bios are live HTML on top.
- `hl-a.webp` / `hl-b.webp`: the torn mint paper behind highlighted words (`.hl` / `.hl.b`).
- `bg-hero.jpg`, `bg-14t.jpg`, `bg-cta.jpg`: the section backgrounds (dollar-bill and plaster textures).
- Icons, check marks, scribble, underline and burst doodles.
- `hero-glow.jpg` and `av-*.jpg`: builders band, carried over from V1.

## To swap before launch

- Fernando Marques' post card uses a monogram; add `assets/img/av-fernando.jpg` and set it in the `posts` array.
- The LinkedIn icons on the team polaroids open a LinkedIn people search; swap in the real profile URLs.
- Nav and footer links point at savvywealth.com root/about/careers. Replace them with the real paths.

## Deploying to Vercel

Deploy this folder as its **own** Vercel project (e.g. `savvy-future-founder`). Don't link it to any existing project.
All config lives in `future-founder/vercel.json`; nothing at the repo root changes, so other projects built from this repo are unaffected.

- **CLI** (run inside `future-founder/`, with the licensed font files present in `assets/fonts/`):
  `npx vercel deploy --prod --yes --name savvy-future-founder`
  The CLI uploads the local font files, so the page renders in Diatype.
- **Git import**: in Vercel, *Add New → Project*, pick this repo, set **Root Directory** to `future-founder`, framework *Other*, no build command.
  The fonts are git-ignored, so a Git deploy falls back to Inter unless the fonts are committed (only do that if the repo is private).
