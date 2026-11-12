---
name: savvy-portfolio-perspectives
description: Builds the monthly Savvy Portfolio Perspectives deliverables from that month's copy — the vertical (US Letter) PDF report, its white-label version (no Savvy logo), the 7-slide LinkedIn carousel — using Savvy's approved templates. Use whenever someone asks to make, build, update or fix a Portfolio Perspectives report, white label or carousel for any month, or shares a Portfolio Perspectives copy doc, content.json or published issue to turn into those files.
---

# Savvy Portfolio Perspectives — monthly report, white label and carousel

This skill turns one month's approved copy into three files, all in Savvy's approved design (from the November 2026
edition):

| Deliverable | Template | Size |
|---|---|---|
| Report | `templates/report.html` | US Letter portrait, 816 × 1056 px pages, ~14–15 pages |
| White label | same template, built with `--white-label` | same |
| LinkedIn carousel | `templates/carousel.html` | 7 slides, 1080 × 1350 px |
| Email banner | `templates/email-banner.html` | 600 × 150 px, exported as a 1200 × 300 PNG (2×) |

Examples of the finished November 2026 files are in `examples/`. Look at them before starting.

## House rules (investment team, 2026-11-06 — keep in every future version)

1. **The Macro Dashboard sits on one page** so advisers see the whole picture at once.
2. **Data rows never wrap.** If a value is long, widen the column or tighten spacing; never wrap. The template
   does the tightening itself if a typeface runs wide: padding, then letter-spacing, then type size in 0.2px
   steps (never below 8.6px). `export_pdf.py` reports any cell that still clips.
3. **Every data row has its own icon**, unique within its table.
4. **Typeface: ABC Diatype** (brand guidelines). The licensed files are included in `assets/fonts/`
   (`ABCDiatype-Light/Regular/Medium/Bold.otf`) and `build.py` embeds them. If they are ever missing, the embedded
   **Inter** is the fallback. Never let it fall to Helvetica Neue: its 300 weight is Thin and it sets tighter, which
   makes the body copy look too light and tight. Don't use `tabular-nums` with Diatype: it switches the figures to
   a monospaced style. The font files are licensed to Savvy: keep this skill internal and never upload the fonts or
   the built HTML (which embeds them) anywhere public.
5. Following from these: Contents, Find the answer and nav page references fill automatically, and the nav
   highlights the section you're on (Closing also lights Sources).
6. **Optional event section** (e.g. Nov 2026: midterm results and the Nov 5 sell-off): its own page after the
   Executive snapshot, with its own nav pill and Contents row. Edit the rest of the issue around it so nothing repeats.

## The one rule that matters most

**Use the month's copy word for word.** Do not add sentences, labels, captions, charts, summaries or "helpful"
context, and do not rewrite or shorten anything. The design is fixed: change copy, numbers and dot levels only. Do
not change fonts, colours, spacing, page order or styling. If the copy doesn't fit, follow "When copy doesn't fit"
below. Never edit the words to make them fit.

## Inputs to ask for (if they weren't provided)

1. **The month's report copy.** This can be the copy doc (Word, Google Doc export, PDF or Markdown), the published
   issue, or the PP Design Kit's `inputs/YYYY-MM/YYYY-MM-content.json` with its positioning ledger.
2. **Positioning levels** for every row (asset classes, sub-classes, sectors) and the five dashboard signals.
   They are usually in the copy doc or the positioning ledger. If any are missing, ask; never guess a level.
3. **Carousel copy.** These are the carousel fields of the supporting doc: subline, core, the three numbers with
   captions, the question-of-the-month preview and the CTA. If there are none, use the report copy as described under
   Carousel below.

## Workflow

Work in a scratch folder. Keep the skill files untouched.

```bash
SK=<path to this skill>; W=<scratch folder>; mkdir -p "$W"
cp "$SK/templates/report.html" "$W/YYYY-MM.html"
cp "$SK/templates/carousel.html" "$W/YYYY-MM-carousel.html"
```

### 1. Report: replace the copy page by page

Open `$W/YYYY-MM.html`. Every page is a `<section class="page">`, in this fixed order:

| # | Page (section id) | What goes there |
|---|---|---|
| 1 | Cover (`cover`) | eyebrow `Portfolio Perspectives · Month YYYY`, title, subtitle. Authors stay unless told otherwise |
| 2 | Contents (`contents`) | section list. Page numbers fill automatically (`data-page-of`) |
| 3 | Find the answer (`questions`) | 4 cards. Q1 the positioning-change answer · Q2 three asset-class dots (Equities, Fixed Income, Alternatives) · Q3 the macro answer · Q4 the risk titles. Each links to its page; page numbers fill automatically |
| 4 | Executive snapshot (`snapshot`) | callout headline + short paragraph, then Verdict, Core driver and Portfolio stance bullets (stance rows carry dots) |
| 5 | Core driver (`core-driver`) | the core driver body paragraphs, two columns |
| 6 | Core driver (continued) (`core-driver-book`) | Equities / Fixed income / Real assets sub-sections |
| 7 | Macro thoughts (`macro`) | the first macro sub-sections (h3 + paragraphs), in one two-column flow |
| 8 | Macro thoughts (continued) (`macro-2`) | the remaining macro sub-sections |
| 9 | The Savvy Macro Dashboard (`dashboard`) | **One page** (house rule): Summary table (icon, category, signal dots, portfolio signal) and Data table (icon, indicator, current value, portfolio signal, grouped by pillar) plus the source/date note. **Every row is one line and has its own icon** |
| 11 | Question of the month (`qa`) | question + answer (add a second `.card` only if the month has two questions) |
| 12 | Positioning (`positioning`) | the "No changes…" line (or the change text), legend, table of asset classes, sub-classes, then Sector views |
| 13 | Risks we're watching (`risks`) | numbered risks, title + paragraph, 2-column grid |
| 14 | Closing thoughts and sources (`closing`) | closing paragraphs, then the Sources card |
| 15 | Back cover (`back`) | no change |

Also update:
- `<title>` and `const EDITION = 'Month YYYY'` in the script. EDITION drives every footer.
- Section ids used by links (`#growth`, `#inflation`, `#financial-conditions`, `#earnings`, `#geopolitics`) stay on
  the matching macro sub-sections. If a month's macro headings differ, keep the ids on the closest match and keep
  the dashboard rows' `data-href` pointing at them.
- Escape `&` as `&amp;`. Use typographic quotes and apostrophes (’ “ ”) as the copy does.

**Dots.** Put `data-pos="UW|SUW|N|SOW|OW"` on the cell or span; the script draws five same-size dots with only the
active one coloured:

| Code | Positioning | Dashboard signal | Colour |
|---|---|---|---|
| `UW` | Underweight | Headwind | dark red |
| `SUW` | Slight underweight | Slight headwind | light red |
| `N` | Neutral | Neutral | gray |
| `SOW` | Slight overweight | Slight tailwind | light green |
| `OW` | Overweight | Tailwind | dark green |

Never write the stance words next to the dots.

**Positioning changes.** If the month has changes, replace the italic "No changes to positioning this month." line
with the copy's change text (and a small table in the existing `.tb` style if the copy has one). Update Find the
answer Q1 with the copy's answer.

### 2. Build and check the report

```bash
python3 "$SK/scripts/build.py" "$W/YYYY-MM.html" "$W/YYYY-MM-<slug>.html"
python3 "$SK/scripts/build.py" "$W/YYYY-MM.html" "$W/YYYY-MM-<slug>-white-label.html" --white-label
python3 "$SK/scripts/export_pdf.py" "$W/YYYY-MM-<slug>.html" "$W/out"
python3 "$SK/scripts/export_pdf.py" "$W/YYYY-MM-<slug>-white-label.html" "$W/out"
```

`<slug>` is the title in lowercase with hyphens, for example `2026-11-broader-not-weaker`. `build.py` inlines the
logo, icons, headshots and font, so the HTML is a single self-contained file. `--white-label` hides every Savvy logo
(the space stays empty for an advisor's logo) and removes the "Independence, reinvented." tagline.

`export_pdf.py` needs Playwright: `pip install playwright && python3 -m playwright install chromium`. If that can't
be installed, skip it and give the user the HTML files with these instructions: open each in **Chrome** → Print →
Save as PDF, Margins **None**, **Background graphics** on. The page size is set by the file.

Then check:
- `export_pdf.py` prints "All pages fit." If it lists pages that overflow, fix those pages (see below) and rebuild.
- Look at every PNG preview. Check that nothing overlaps or is cut off, and that no line ends with a single word (a widow).
- The contents and Find the answer page numbers match the real pages.

### 3. When copy doesn't fit

In order of preference:
1. (Not for the dashboard, which stays one page.) Move a whole sub-section to the "(continued)" page that already exists (for example, a macro sub-section from page 7 to 8).
2. Add another "(continued)" page: copy the section, give it a new id and the same `data-section`, and title it
   "<Section> <span style="color:var(--ink-3)">(continued)</span>". Page numbers update themselves.
3. Small spacing changes on that page only (table cell padding, gaps). Never smaller than the current type sizes.

Never cut, shorten or rephrase the copy.

### 4. Carousel

Open `$W/YYYY-MM-carousel.html`. Only the lines marked `<!-- EDIT -->` change:

| Slide | Background | Content |
|---|---|---|
| 1 Cover | gradient | eyebrow month, report title with a full stop, carousel subline |
| 2 Core driver | cream | carousel core text |
| 3 What changed this month | teal | headline + one line (e.g. "No trades this month." / the verdict's first sentence; or the change) |
| 4 Where we stand | cream | asset classes then sectors, with stance words. Set `data-dir="up"` for overweight or slight overweight, `"down"` for underweight or slight underweight, `"flat"` for neutral. The marker line updates itself |
| 5 The numbers | cream | three big numbers with their captions (from the carousel numbers + the dashboard values) |
| 6 Question of the month | black | the question in quotes + the short answer |
| 7 What we're watching | gradient | risk titles (any count; the button moves) + "Read the full Month Portfolio Perspectives" |

If there is no carousel copy, take it from the report: the subline and core from the snapshot callout and Core driver
bullets, the numbers from the dashboard data table and the risk titles from Risks. Still don't write new sentences.

Balance line breaks so no line holds a single word. Add a `<br>` at a natural phrase break, as in the
November examples. Then:

```bash
python3 "$SK/scripts/build.py" "$W/YYYY-MM-carousel.html" "$W/YYYY-MM-<slug>-carousel.html"
python3 "$SK/scripts/export_pdf.py" "$W/YYYY-MM-<slug>-carousel.html" "$W/out"
```

LinkedIn takes the PDF as a document post. The PNGs (`…-pNN.png`) are the individual slides.

### 4b. Email banner

The header image for the monthly email. Only the month changes: edit the `<!-- EDIT -->` line in a copy of
`templates/email-banner.html` (e.g. `November 2026`; it is set in capitals by the style), then:

```bash
python3 "$SK/scripts/build.py" "$W/YYYY-MM-email-banner.html" "$W/YYYY-MM-email-banner-src.html"
python3 "$SK/scripts/export_pdf.py" "$W/YYYY-MM-email-banner-src.html" "$W/out"
```

This writes `out/YYYY-MM-email-banner-src.png` at 1200 × 300 (2×, rounded corners on a transparent background).
Rename it to `YYYY-MM-email-banner.png`. Place it in the email at 600 px wide.

### 5. Deliver

Give the user the six files: report PDF, white-label PDF, carousel PDF, email banner PNG and the two report HTMLs (the HTMLs are
interactive, with clickable contents and a page nav). Say which pages, if any, needed a "(continued)" split. Also say
which carousel lines came from the report rather than carousel copy.

## Design reference (don't change)

- Fonts: ABC Diatype (embedded from `assets/fonts/`), with Inter as the fallback. Never Helvetica Neue. The email
  banner's month label is Inter Medium, as in the Figma master.
- Colours: teal `#095972`, cream `#F5F2EC`, ecru `#C7BCA1`, light teal tint `#EEF4F6`; dot scale as above.
- Report: page header with the Savvy logo and section nav; footer with the edition, page number and disclaimer on
  every inner page. The disclaimer is only in the footer, never repeated in the body.
- Typography: paragraphs use `text-wrap: pretty`, headings `text-wrap: balance`. Columns keep at least three lines together.
- Find the answer cards, the cover globe fading out above the authors, and the back-cover rings centred on the logo are fixed.
