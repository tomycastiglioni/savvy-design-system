# Meeting workflow animation

Landing-page product animation for the Savvy Intelligence meeting workflow,
built with [Remotion](https://www.remotion.dev). Output: 1300×900, 60 fps.

## Compositions

| ID | Workflow | Length |
| --- | --- | --- |
| `MeetingPrep` | 01 · Meeting prep — "Prepared before you ask" | 10 s |

`MeetingPrep` beats: home "For your review" card → click "Review prep document"
→ loading household → Household context (flag highlighted) → Meeting agenda
(from the Quarterly Review template) → Outstanding tasks.

## Where things live

- `src/meeting-prep/timeline.ts` — global timeline (seconds). Change a beat here.
- `src/meeting-prep/theme.ts` — Savvy Kit colors, fonts, easing, canvas geometry.
- `src/meeting-prep/scenes/` — one file per screen.
- `src/meeting-prep/components/` — cursor, Savvy Intelligence mark, avatar, reveal.
- `public/fonts/` — DM Sans + DM Serif Display (SIL OFL), loaded locally.

## Commands

```console
npm i
npm run dev        # Remotion Studio preview
npm run lint       # eslint + tsc
```

## Export for the web

Render a ProRes master, then encode:

```console
npx remotion render MeetingPrep out/master.mov --codec=prores --prores-profile=hq

# Autoplay version
ffmpeg -i out/master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart -an out/export/meeting-prep.mp4

# Scroll-scrub version: a keyframe every 6 frames (0.1 s) so seeking stays smooth
ffmpeg -i out/master.mov -c:v libx264 -preset slow -crf 20 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart -an out/export/meeting-prep-scroll.mp4

# Optional VP9/WebM
ffmpeg -i out/master.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -row-mt 1 -pix_fmt yuv420p -an out/export/meeting-prep.webm

# Poster frame (2.2 s)
npx remotion still MeetingPrep out/export/meeting-prep-poster.png --frame=132
```

Remotion is free for teams of up to 3; see https://www.remotion.pro/license.
