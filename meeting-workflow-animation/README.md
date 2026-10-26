# Meeting workflow animation

Landing-page product animations for the Savvy Intelligence meeting workflow,
built with [Remotion](https://www.remotion.dev). Output: 1300×900, 60 fps.
Plus the Savvy Intelligence 2.0 launch video (`Launch`, 1920×1080, 60 fps)
and an iPhone screen recording of mobile prep (`MobilePrep`, 1080×2348, 60 fps).

## Compositions

| ID | Workflow | Length | Poster frame |
| --- | --- | --- | --- |
| `MeetingPrep` | 01 · Meeting prep — "Prepared before you ask" | 12 s | 153 (2.55 s) |
| `Delivery` | 02 · Delivery — live charts and what-ifs | 12 s | 240 (4.0 s) |
| `Capture` | 03 · Meeting capture — "Every conversation, on the record" | 12 s | 90 (1.5 s) |
| `Recap` | 04 · Recap & follow-through — "The meeting ends. The follow-up doesn't wait." | 16 s | 470 (7.8 s) |
| `Launch` | Savvy Intelligence 2.0 launch video, 1920×1080 | 44 s | 1080 (18.0 s) |
| `MobilePrep` | iPhone screen recording, 1080×2348 — "Your prep for the Dave R. review is ready." | 3.5 s | 60 (1.0 s) |

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

`Recap` beats: opens on `Capture`'s last frame (pixel-identical) → keeps
scrolling into the topic summary and four suggested tasks → "Create client
document" → editor + live preview (add Retirement projection graph, switch to
serif, save) → "Draft client email" → "Analyzing your writing style…" with the
advisor's style tags → the email writes itself → Send → "Email sent".

`MobilePrep` beats (a plain screen recording: no phone frame, no touches; the
phone plays itself): the advisor's Today screen with Dave R.'s review
"Preparing…" → the iOS notification drops in and the row flips to "Prep ready"
→ the banner leaves and the prep pushes in → household summary (account
changes, one open task, one flagged item) and a four-item agenda fade in. All
layout is in iOS points (360×782.67) and scaled ×3; beats are in
`src/mobile-prep/timeline.ts`, copy in `src/mobile-prep/content.ts`.

`Launch` chapters (from the 25-frame storyboard; chapters start on a 120 BPM
grid of 2 s bars, so a 120 BPM track lines up with every section):

| Time | Chapter | Frames | Built from |
| --- | --- | --- | --- |
| 0–8 s | Intro: title → prompt box → dictated prompt → "Already done" | F1–F5 | new (`scenes/Intro.tsx`) |
| 8–12 s | Meeting prep: loading card → prep document | F6–F7 | 01 (`HouseholdContext`, `DocTabs`) |
| 12–20 s | Live planning: add graph → present → what-ifs | F8–F11 | 02 (charts, graph cards, what-if model) |
| 20–28 s | Meeting capture: phone → desktop recap | F12–F16 | 03, time-remapped (skips the Transcription tab) |
| 28–33.5 s | Client materials: recap → editor + preview | F17–F19 | 04 (`EditorPanel` with a "Draft email to client" button, `PreviewDoc`) |
| 33.5–40 s | Follow-up: writing style → email → sent | F20–F23 | 04 (`WritingStyleLoader`, `EmailDraft`, `EmailSent`) |
| 40–44 s | Tagline → Savvy wordmark | F24–F25 | new (`scenes/Close.tsx`) |

How it fits together: each chapter places a workflow's 1300×900 design space
on the chapter's gradient with a camera (`components/Stage.tsx`, keyframes in
`timeline.ts` → `CAM`). Where the storyboard skips steps, `components/Remap.tsx`
plays the original scenes on their own clock. All beats are in
`src/launch/timeline.ts`; the sound cues in `src/launch/Sfx.tsx` follow them.

**Fonts:** headlines use ABC Diatype (Dinamo), which Savvy licenses. It is not
committed because this repo is public: put `ABCDiatype-Regular.otf` and
`ABCDiatype-Bold.otf` in `public/fonts/` before rendering `Launch`.

**Sound:** effects in `public/audio/launch/`, trimmed and peak-normalized.
`click` and `whoosh` come from ElevenLabs (text to sound); `send`, `chime`,
`mic`, `tick`, `shimmer`, `success` and `sting` are synthesized stand-ins until
their ElevenLabs takes are generated (replace the file, keep the name). There
is no music track yet.

## Where things live

- `src/shared/` — used by every video so they stay identical: Savvy Kit tokens
  and chart series colors (`theme.ts`), fonts, the cursor (`CursorLayer`), AI
  icon, avatar, reveal.
- `src/<workflow>/timeline.ts` — that video's timeline (seconds). Change a beat here.
- `src/meeting-prep/`, `src/delivery/`, `src/capture/`, `src/recap/` — per-video geometry, scenes and charts.
- `src/recap/content.ts` — topics, suggested tasks, writing-style tags and the email text.
- `src/capture/content.ts` — recap text shown on both the phone and the desktop.
- `src/capture/components/Phone.tsx` — the vector iPhone (frame, island, status bar).
- `src/delivery/whatif.ts` — slider definitions, drags and the projection model.
- `public/images/` — official AI icon, cursors (arrow + tap) and Heather's avatar.
- `public/fonts/` — DM Sans (incl. italic) + DM Serif Display (SIL OFL), loaded locally;
  Inter (SIL OFL) stands in for SF Pro in `MobilePrep`'s iOS system UI.
- `src/mobile-prep/` — the iPhone video: `TodayScreen` and `PrepScreen`, plus
  the iOS status bar, home indicator and notification banner (`components/`).
- `public/images/savvy-app-icon.svg` — stand-in Savvy app icon (the logo's S on savvy green), used in the banner.
- `src/launch/` — the launch video: `timeline.ts` (beats, cameras, gradients), `scenes/` (one per chapter), `LaunchCursor.tsx`, `Sfx.tsx`.
- `public/images/savvy-logo.svg` — Savvy wordmark; `public/audio/launch/` — launch sound effects.

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

For `MobilePrep` (no audio, poster on the notification):

```console
npx remotion render MobilePrep out/mobile-prep-master.mov --codec=prores --prores-profile=hq
ffmpeg -i out/mobile-prep-master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart -an out/export/mobile-prep.mp4
npx remotion still MobilePrep out/export/mobile-prep-poster.png --frame=60
```

For `Launch`, render the master with audio and encode with AAC instead of `-an`:

```console
npx remotion render Launch out/launch-master.mov --codec=prores --prores-profile=hq
ffmpeg -i out/launch-master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/export/launch.mp4
npx remotion still Launch out/export/launch-poster.png --frame=1080
```

Remotion is free for teams of up to 3; see https://www.remotion.pro/license.
