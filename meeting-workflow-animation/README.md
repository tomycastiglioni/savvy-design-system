# Meeting workflow animation

Landing-page product animations for the Savvy Intelligence meeting workflow,
built with [Remotion](https://www.remotion.dev). Output: 1300×900, 60 fps.
Plus the Savvy Intelligence 2.0 launch video (`Launch`, 1920×1080, 60 fps)
and iPhone screen recordings of mobile prep (`MobilePrep`), the household
summary (`MobileHousehold`) and the meeting recap (`MobileRecap`), all
1080×2348, 60 fps.

## Compositions

| ID | Workflow | Length | Poster frame |
| --- | --- | --- | --- |
| `MeetingPrep` | 01 · Meeting prep — "Prepared before you ask" | 12 s | 153 (2.55 s) |
| `Delivery` | 02 · Delivery — live charts and what-ifs | 12 s | 240 (4.0 s) |
| `Capture` | 03 · Meeting capture — "Every conversation, on the record" | 12 s | 90 (1.5 s) |
| `Recap` | 04 · Recap & follow-through — "The meeting ends. The follow-up doesn't wait." | 16 s | 505 (8.4 s) |
| `Launch` | Savvy Intelligence 2.0 launch video, 1920×1080 | 44 s | 1080 (18.0 s) |
| `MobilePrep` | iPhone screen recording, 1080×2348 — morning prep for the Dave R. review | 3.5 s | 150 (2.5 s) |
| `MobileHousehold` | iPhone screen recording, 1080×2348 — the Dave R. household summary and agenda | 3 s | 150 (2.5 s) |
| `MobileRecap` | iPhone screen recording, 1080×2348 — the Dave R. review recap, follow-up sent | 3 s | 110 (1.83 s) |

Each workflow sits on its section's gradient (`BG` in `src/shared/theme.ts`,
the same gradients as the launch video): Meeting prep is cream, Delivery is
mint, Capture is gold and Recap is blue.

`MeetingPrep` beats: home "For your review" card → click "Review prep document"
→ loading household → Household context → Meeting agenda (from the Quarterly
Review template) → Outstanding tasks.

`Delivery` beats: Graphs with one chart (Account breakdown) and one "Add graph"
slot → the click builds Retirement projection → "Present" on it goes full screen → what-if controls slide in; dragging
contributions, expected return and inflation redraws the projection live.

`Capture` beats: vector iPhone recording the meeting (32:03 → 32:05) → tap
Stop → Transcribing → tap "Stop and get recap" → Writing your recap → notes
(Summary, Transcription, Summary) → the phone grows into the desktop recap
(same panel as the 01 prep document: title and meeting line, then the summary)
and scrolls.

`Recap` beats: opens on `Capture`'s last frame (identical apart from the
background) → keeps scrolling into the topic summary and four suggested tasks →
"Create client document" → editor + live preview with the firm's logo (add the
Retirement projection graph, the preview scrolls back to the top, save; the
document stays in Sans) → "Draft client email" → "Analyzing your writing
style…" with the advisor's style tags → the email opens with its greeting and
first line written and writes the rest from "As agreed…" → Send → "Email sent".

`MobilePrep` beats (a plain screen recording: no phone frame, no touches, no
notification; the phone plays itself): Peter's "Good morning" screen with the
next meeting's card loading (shimmer placeholders, "Preparing…") → "Prep
ready" → four short rows fill in top to bottom (Summary, Task, Flagged,
Agenda) → "Open prep". Text is a few words per row so it reads in 3.5 s. All
layout is in iOS points (360×782.67) and scaled ×3; beats are in
`src/mobile-prep/timeline.ts`, copy in `src/mobile-prep/content.ts`. Sounds
(`src/mobile-prep/Sfx.tsx`, ElevenLabs takes in `public/audio/mobile-prep/`): a
soft rise while it loads, a chime on "Prep ready", and a pluck per row that
climbs a pentatonic step each time.

`MobileHousehold` beats (the screen behind "Open prep", same style and sounds):
the header rises in → the assets card → $2.4M counts up while the growth line
draws → "+6.1%" pops as the number lands → the three agenda items fill in →
hold. Beats in `src/mobile-household/timeline.ts`, copy in
`src/mobile-household/content.ts` ($2.4M and the four accounts are placeholder
figures). `MobileHouseholdOptions` keeps the three static directions that were
reviewed (A, the one built, plus B · cards and C · brief).

`MobileRecap` beats (after the meeting, same style and sounds): "Recorded ·
42 min" and "Review recap" rise in → the summary card's three points check in →
the drafted follow-up email and "Send follow-up" → Send is pressed → "Sent to
Dave". Option A of `MobileRecapOptions` with option C's header; beats in
`src/mobile-recap/timeline.ts`, copy in `src/mobile-recap/content.ts` (the
Dec 10 date and the 42 min length are placeholders).

`Launch30` is the 30 s launch re-cut (1920×1080, 60 fps, with sound): one
client meeting followed through Prep → Meet → Deliver. It opens on "Deliver
more for your clients with Savvy Intelligence", scrolls into the advisor's
client list and picks Allison & Frank Chan, whose row becomes the prep card. Beats are in
`src/launch30/timeline.ts`; scenes in `src/launch30/scenes/` reuse the
storyboard frames' pieces, so the video and the stills stay in sync. The
tracker's active step has a ring that fills with the time left in its phase
(no connector lines). The cursor picks the client, clicks Review prep, then
"Retirement plan" in the agenda, which lifts out and is presented; its
projection draws in from left to right as it lands. The client then asks
"What if we save $15K more a year?" in a chat bubble that writes itself out,
and the contributions slider answers it live. While the phone records, the
client's CRM profile sits beside it with its meeting notes filling in
("Syncing" → "Synced"). After Send, the email folds into an "Email sent"
banner and a "Sent to your team" card hands each approved task to one person
(placeholder names; photos in `public/launch30/team/`). Sound cues are in
`src/launch30/Sfx.tsx`, kept soft and warm: a short swish on text reveals, a
rounded whoosh on the big moves, plucks as the question arrives, as the notes
sync and as each task reaches the team, a two-note
chime when the phone starts recording, a rising shimmer as it starts writing
the recap (`public/audio/launch30/`, ElevenLabs text to sound, trimmed,
filtered and peak-normalized; levels are set in `Sfx.tsx`), and the launch
kit's click and sent chime. The logo end card has no sound effect.
Jeremy B.'s voiceover (ElevenLabs v4, `public/audio/launch30/vo-jeremy.mp3`,
timed to the beats) and the licensed track "Slaptastic" (Steven Beddall,
`src/launch30/Music.tsx`) play under them: the music dips under each VO line,
its break falls on the meeting capture and its final hit on the logo. Export
with 4 dB of gain and a limiter (`-af "volume=4dB,alimiter=limit=0.89:level=false"`).

`Launch30Peek` is the website sneak peek: the same scenes with no text (no
opening line, headlines or client question), no tracker and no sound, the
product UI slid to the centre of the frame as each card comes in
(`src/launch30/Peek.tsx`). `scripts/launch30-peek.sh` turns a render of
0:02–0:18.7 into two 10 s loops (MP4 and GIF): `2colors` (beige → green, normal
speed, to the phone landing) and `3colors` (beige → green → blue, 1.425×, to
the recap). Both skip stretches where nothing moves and crossfade into their
own first frame, so they loop without a seam.

`AdPrep4x5`, `AdMeet4x5`, `AdCapture4x5` and `AdDeliver4x5` (1080×1350,
60 fps, no sound) are the Innovation Campaign ads "01 — Meeting steps (4x5)
v3" from Figma, animated: the v3 layout (Savvy logo, ABC Diatype Light
headline, body copy, the step's gradient) with that step's workflow laid out
for the 4:5 frame (`src/ads/`, copy and sizes as in Figma): bigger than on the
website, left edge on the text margin, free to run off the right and bottom.
Prep has its own home screen (stats as a 2×2 grid, the review card under them)
and a larger prep document; Meet is one card (the "Add graph" slot, then the
Retirement projection, a blinking "Presenting" pill once it is presented)
with two what-if controls under the chart (contributions, and the retirement
age down to 63, the ad's question; in the ad it moves the projection); Capture
and Deliver are the workflow videos seen through a camera (`src/ads/Camera.tsx`)
that keeps each step on the margin and every clicked button in frame (the
loading and writing-style cards centred between the copy and the bottom).
Graphics start 80 px under the copy. Prep,
Meet and Capture start 0.6 s in so the first frame already shows the UI.
Render with
`npx remotion render AdPrep4x5 out/ads/ad-01-prep-4x5.mp4 --codec=h264 --crf=18 --muted`.

`Launch30Storyboard` (19 static frames, 1920×1080, in order F01 … F15 with F07
in two steps and F13 in three) is the storyboard for the 30 s re-cut: the
client list, then one client meeting followed through Prep → Meet → Deliver,
with a phase tracker on top, beige / green / blue backgrounds per phase and
abstract UI (body copy as grey lines). Frames live in `src/launch30/frames/`;
render them with
`npx remotion still Launch30Storyboard out/storyboard/f01.png --frame=0` (etc.).

Notes for the 30 s video (team feedback):

- Text effect: lines rise in from below out of a blur, one after another,
  landing in their final positions. F01 does "Run better meetings with" then
  "Savvy Intelligence"; F13 does "Prep.", "Meet.", "Deliver."; F14 does "Your
  whole practice," then "working for you".
- F01 → F03: the page scrolls up into the client list (layout from the team's
  mock-up), the list scrolls to Allison & Frank Chan and their row morphs
  into the Prep ready card.
- Tracker: a ring around the active step's number fills over that phase
  (Prep 0:03.5–0:09.5, Meet 0:09.5–0:17.5, Deliver 0:17.5–0:24), then pops to
  done. The time saved in the intro went to the recap.
- Cursors only at F03 (picking the client), F03–F05 (Review prep, then
  Retirement plan in the agenda), F07 (what-if drag) and F11 (Send).

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
plays the original scenes on their own clock. The launch keeps the workflows'
earlier versions where they have since changed (linked-documents line, serif
switch, no firm logo, smaller "Email sent") through props on the shared scenes. All beats are in
`src/launch/timeline.ts`; the sound cues in `src/launch/Sfx.tsx` follow them.

**Fonts:** headlines use ABC Diatype (Dinamo), which Savvy licenses. It is not
committed because this repo is public: put `ABCDiatype-Regular.otf` and
`ABCDiatype-Bold.otf` in `public/fonts/` before rendering `Launch`.

The ads also need `ABCDiatype-Light.otf` in `public/fonts/` (same license).

**Music:** `Launch30` uses "Slaptastic" (Steven Beddall, Creative Cut · Beat),
which Savvy licenses, so it is not committed either. Build the cut with
`scripts/launch30-music.sh <original.mp3>`; it writes
`public/audio/launch30/music-slaptastic.mp3`.

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
- `public/images/` — AI Savvy icon (`ai-icon.svg`, cropped to the mark), cursors (arrow + tap) and Heather's avatar.
- `src/recap/components/FirmLogo.tsx` — placeholder logo for the advisor's wealth firm (fictional) on the client document.
- `public/fonts/` — DM Sans (incl. italic) + DM Serif Display (SIL OFL), loaded locally;
  Inter (SIL OFL) stands in for SF Pro in `MobilePrep`'s iOS status bar.
- `src/mobile-prep/` — the iPhone video: `screens/MorningScreen.tsx`, plus the
  iOS status bar and home indicator (`components/SystemUI.tsx`).
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

Static thumbnails (no cursor or taps, 2× for sharp display), one per workflow:

```console
npx remotion still MeetingPrep out/export/meeting-prep-thumbnail.png --frame=146 --scale=2 --props='{"hideCursor":true}'
npx remotion still Delivery out/export/delivery-thumbnail.png --frame=240 --scale=2 --props='{"hideCursor":true}'
npx remotion still Capture out/export/capture-thumbnail.png --frame=90 --scale=2 --props='{"hideCursor":true}'
npx remotion still Recap out/export/recap-thumbnail.png --frame=505 --scale=2 --props='{"hideCursor":true}'
```

For `MobilePrep` (with sound, poster on the finished card):

```console
npx remotion render MobilePrep out/mobile-prep-master.mov --codec=prores --prores-profile=hq
ffmpeg -i out/mobile-prep-master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/export/mobile-prep.mp4
npx remotion still MobilePrep out/export/mobile-prep-poster.png --frame=150
```

For `MobileHousehold` (with sound, poster on the finished screen):

```console
npx remotion render MobileHousehold out/mobile-household-master.mov --codec=prores --prores-profile=hq
ffmpeg -i out/mobile-household-master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/export/mobile-household.mp4
npx remotion still MobileHousehold out/export/mobile-household-poster.png --frame=150
```

For `MobileRecap` (with sound, poster before Send is pressed):

```console
npx remotion render MobileRecap out/mobile-recap-master.mov --codec=prores --prores-profile=hq
ffmpeg -i out/mobile-recap-master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/export/mobile-recap.mp4
npx remotion still MobileRecap out/export/mobile-recap-poster.png --frame=110
```

For `Launch30` (with sound):

```console
npx remotion render Launch30 out/launch30-master.mov --codec=prores --prores-profile=hq
ffmpeg -i out/launch30-master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/export/launch30.mp4
```

For `Launch`, render the master with audio and encode with AAC instead of `-an`:

```console
npx remotion render Launch out/launch-master.mov --codec=prores --prores-profile=hq
ffmpeg -i out/launch-master.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/export/launch.mp4
npx remotion still Launch out/export/launch-poster.png --frame=1080
```

Remotion is free for teams of up to 3; see https://www.remotion.pro/license.
