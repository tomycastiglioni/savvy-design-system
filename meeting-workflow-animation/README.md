# Meeting workflow animation

Landing-page product animations for the Savvy Intelligence meeting workflow,
built with [Remotion](https://www.remotion.dev). Output: 1300×900, 60 fps.

## Compositions

| ID | Workflow | Length | Poster frame |
| --- | --- | --- | --- |
| `MeetingPrep` | 01 · Meeting prep — "Prepared before you ask" | 12 s | 153 (2.55 s) |
| `Delivery` | 02 · Delivery — live charts and what-ifs | 12 s | 240 (4.0 s) |
| `Capture` | 03 · Meeting capture — "Every conversation, on the record" | 12 s | 90 (1.5 s) |

`MeetingPrep` beats: home "For your review" card → click "Review prep document"
→ loading household → Household context → Meeting agenda (from the Quarterly
Review template) → Outstanding tasks.

`Delivery` beats: Graphs with two charts and two "Add graph" slots → each click
builds a chart (Retirement projection, Allocation vs. target) → "Present" on
Retirement projection goes full screen → what-if controls slide in; dragging
contributions, expected return and inflation redraws the projection live.

`Capture` beats: vector iPhone recording the meeting (32:03 → 32:05) → tap
Stop → Transcribing → tap "Stop and get recap" → Writing your recap → notes
(Summary, Transcription, Summary) → the phone grows into the desktop recap
(same panel as the 01 prep document) and scrolls.

## Where things live

- `src/shared/` — used by every video so they stay identical: Savvy Kit tokens
  and chart series colors (`theme.ts`), fonts, the cursor (`CursorLayer`), AI
  icon, avatar, reveal.
- `src/<workflow>/timeline.ts` — that video's timeline (seconds). Change a beat here.
- `src/meeting-prep/`, `src/delivery/`, `src/capture/` — per-video geometry, scenes and charts.
- `src/capture/content.ts` — recap text shown on both the phone and the desktop.
- `src/capture/components/Phone.tsx` — the vector iPhone (frame, island, status bar).
- `src/delivery/whatif.ts` — slider definitions, drags and the projection model.
- `public/images/` — official AI icon, cursors (arrow + tap) and Heather's avatar.
- `public/fonts/` — DM Sans (incl. italic) + DM Serif Display (SIL OFL), loaded locally.

Chart colors: Savvy green `#175242`, then golden yellow `#D79F32` and mauve
`#C06F74` from Savvy Kit `color/chart`. Validated colorblind-safe across all
pairs; keep charts to three series (green and deep blue are too close to share one).

## Commands

```console
npm i
npm run dev        # Remotion Studio preview
npm run lint       # eslint + tsc
```

## Export for the web

Render a ProRes master, then encode (shown for `Delivery`; swap the ID, names
and poster frame for `MeetingPrep`):

```console
npx remotion render Delivery out/delivery-master.mov --codec=prores --prores-profile=hq

# Autoplay version
ffmpeg -i out/delivery-master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart -an out/export/delivery.mp4

# Scroll-scrub version: a keyframe every 6 frames (0.1 s) so seeking stays smooth
ffmpeg -i out/delivery-master.mov -c:v libx264 -preset slow -crf 20 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart -an out/export/delivery-scroll.mp4

# Optional VP9/WebM
ffmpeg -i out/delivery-master.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -row-mt 1 -pix_fmt yuv420p -an out/export/delivery.webm

# Poster frame
npx remotion still Delivery out/export/delivery-poster.png --frame=240
```

Remotion is free for teams of up to 3; see https://www.remotion.pro/license.
