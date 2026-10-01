# Future Founder landing page

CalHacks recruiting campaign page for Savvy's **Technical Staff — Future Founder** role.
Open `index.html` directly in a browser (no build step).

Built from the *Landing Page* frame in the CLAUDE-TESTING Figma file (`QJAJaS7qru79fTrIq73NHt`, node `5174:464`, page EPD).

Motion:
- Hero: the cap, terminal, bagel and subway-6 objects are looping transparent VP9 videos (`assets/video/`); the pixel squares pulse their opacity slowly.
- `$14T`: canvas pixel field drawn from JetBrains Mono Regular. Clean at rest; near the cursor pixels drift slightly and a faint spray fades in, then settles.
- What happens next: a scan travels along the block progress bar.
- Builders band: post cards scroll vertically (pauses on hover); the button uses a letter-roll hover.
- All of it stops under `prefers-reduced-motion`.

## Fonts

ABC Diatype and Big Caslon are licensed, so they are **not committed** (`assets/fonts/` is git-ignored).
Drop these files into `future-founder/assets/fonts/` to render with the real type:

- `ABCDiatype-Light.otf`, `ABCDiatype-Regular.otf`, `ABCDiatype-Medium.otf`
- `BigCaslon-Regular.otf`, `BigCaslon-Bold.otf`

Without them the page falls back to Inter + Georgia. JetBrains Mono (terminal accents) and Caveat (whiteboard notes) load from Google Fonts.

## Assets

- Pixel-art, icons, team photos, tape/paper, note, Inc. 5000 badge: exported from Figma at 2–3×
- `assets/img/script-*.png`: every Lumios Marker line (NYC captions, Friends card, sticky note, team notes, Q for Monday) exported from Figma at 3×. To edit that copy, update it in Figma and re-export, or self-host a licensed Lumios Marker webfont and switch these back to text.
- `assets/video/*.webm`: the hero loops, downscaled to 400px and with the magenta key spill removed (the originals had a pink halo/shadow). Safari can't render VP9 alpha, so it gets the `poster-*.png` stills instead.
- `assets/img/nyc-*.jpg`: Savvy brand photography; Chalamet and Succession stills come from the Figma file
- `assets/img/hero-glow.jpg`: green glow behind the builders band

## To swap before launch

- Fernando Marques' post card uses a monogram; add `assets/img/av-fernando.jpg` and set it in the `posts` array.
- The LinkedIn icons on the team polaroids open a LinkedIn people search; swap in the real profile URLs.
- Nav and footer links point at savvywealth.com root/about/careers. Replace them with the real paths.

## Deploying to Vercel

Deploy this folder as its **own** Vercel project (e.g. `savvy-future-founder`). Don't link it to any existing project.
All config lives in `future-founder/vercel.json`; nothing at the repo root changes, so other projects built from this repo are unaffected.

- **CLI** (run inside `future-founder/`, with the licensed fonts present in `assets/fonts/`):
  `npx vercel deploy --prod --yes --name savvy-future-founder`
  The CLI uploads the local font files, so the page renders in Diatype / Big Caslon.
- **Git import**: in Vercel, *Add New → Project*, pick this repo, set **Root Directory** to `future-founder`, framework *Other*, no build command.
  The fonts are git-ignored, so a Git deploy falls back to Inter / Georgia unless the fonts are committed (only do that if the repo is private).
