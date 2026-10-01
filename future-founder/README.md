# Future Founder landing page

CalHacks recruiting campaign page for Savvy's **Technical Staff — Future Founder** role.
Open `index.html` directly in a browser (no build step).

Built from the *Landing Page* frame in the CLAUDE-TESTING Figma file (`QJAJaS7qru79fTrIq73NHt`, node `5174:464`, page EPD).

Motion:
- Hero: the cap, terminal, bagel and subway-6 objects are looping transparent VP9 videos (`assets/video/`); the pixel squares pulse their opacity slowly.
- `$14T`: canvas pixel field drawn from JetBrains Mono. Cursor scatters the pixels, springs pull them back, halo pixels twinkle.
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
- `assets/video/*.webm`: the hero loops, downscaled to 400px and with the magenta key spill removed (the originals had a pink halo/shadow). Safari can't render VP9 alpha, so it gets the `poster-*.png` stills instead.
- `assets/img/nyc-*.jpg`: Savvy brand photography; Chalamet and Succession stills come from the Figma file
- `assets/img/hero-glow.jpg`: green glow behind the builders band

## To swap before launch

- Marker text uses Marck Script as a stand-in for Lumios Marker (not on Google Fonts). Self-host Lumios to match Figma exactly.
- Fernando Marques' post card uses a monogram; add `assets/img/av-fernando.jpg` and set it in the `posts` array.
- The LinkedIn icons on the team polaroids open a LinkedIn people search; swap in the real profile URLs.
- Nav and footer links point at savvywealth.com root/about/careers. Replace them with the real paths.
