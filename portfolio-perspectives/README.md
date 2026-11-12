# Savvy Portfolio Perspectives — monthly template

The approved template is **November 2026, "Broader, not weaker"** (`2026-11-broader-not-weaker.html` / `.pdf`):
the October 2026 design (logo, fonts, colours, gradients, graphics) set on **vertical US Letter pages**, with the
five-step dot scale. Its source lives in `template/template.html`. Every future edition reuses this file: same
pages, same order, same styling. Only the copy and data change.

The October 2026 16:9 edition is kept for reference in `template/2026-10.html`.

## Files

| Path | What it is |
|---|---|
| `template/template.html` | Source for the report, filled with the November 2026 copy. Duplicate it for each new edition. |
| `template/YYYY-MM.html` | The source of each published edition. |
| `template/build.py` | Inlines the logo, icons and headshots and writes a single self-contained HTML file. |
| `template/carousel.html` | Source for the 7-slide LinkedIn carousel (1080 × 1350), matching the Figma carousel. |
| `template/export_pdf.py` | Renders the PDF and page previews with Playwright (Python) and flags pages that overflow. `export-pdf.js` is the Node version. |
| `skill/` | The Claude skill the investment team uses to build each edition (see below). |
| `assets/` | Logo (black/white SVG), section icons (Verdict, Portfolio stance, Core driver), author headshots, Inter font (embedded at build). |
| `YYYY-MM-<slug>.html` / `.pdf` | Published editions (Savvy-branded report). |
| `YYYY-MM-<slug>-white-label.html` / `.pdf` | Same report with no Savvy logo, for client marketing to add an advisor's logo. |

## House rules from the investment team (2026-11-06, keep them)

The investment team (Ani) runs these templates as the canonical renderer inside their `draft-pp` Claude skill.
Their deliberate changes, now in `template/template.html` and `skill/SKILL.md`:
1. The Macro Dashboard sits on **one page** (Summary + Data).
2. Data rows **never wrap**: widen the column or tighten spacing. The template auto-tightens if a font runs wide,
   and `export_pdf.py` flags any clipped cell.
3. **Every data row has its own icon.**
4. Typeface **ABC Diatype**. The licensed `ABCDiatype-*.otf` files go in `assets/fonts/`. They're **git-ignored
   because this repo is public**: keep them locally and they ship only inside the private skill zip.
   `build.py` embeds them (no `tabular-nums`: Diatype's tabular figures are monospaced). The embedded Inter is the
   fallback, never Helvetica Neue. Don't commit HTML built with Diatype either, because it embeds the full fonts.
5. Page numbers in Contents, Find the answer and nav fill automatically. The nav highlights the current section.
6. Optional **event section** after the Executive snapshot (November 2026: midterms and the November 5 sell-off).

The published November 2026 edition is `2026-11-pace-not-demand.*`. `2026-11-broader-not-weaker.*` was the
first cut, before the event section.

## Fixed structure (portrait, 816 × 1056 px = 8.5 × 11 in pages)

1. Cover — eyebrow, title, subtitle, authors
2. Contents — clickable
3. Find the answer — the four advisor questions, each with a short answer and a link
4. Executive snapshot — callout, Verdict, Core driver, Portfolio stance (with dots)
5. Core driver
6. Core driver (continued) — Equities / Fixed income / Real assets, in two balanced columns
7. Macro thoughts — Growth, Inflation, Financial conditions and the Fed
8. Macro thoughts (continued) — Earnings and valuation, Geopolitics
   (both pages: one two-column flow, subheads stacked down column 1, then column 2)
9. The Savvy Macro Dashboard — Summary (signal dots, Headwind → Tailwind legend)
10. The Savvy Macro Dashboard (continued) — Data
11. Question of the month
12. Positioning — asset class + sector views (dots, Underweight → Overweight legend)
13. Risks we’re watching — 2-column grid
14. Closing thoughts, with Sources below (one column; disclosures live in every page footer)
15. Back cover

The order follows the monthly content doc. Page numbers in the contents and on the Find the answer page are
typed by hand, so check them if a section grows to a new page.

## Dot scale

Positioning and dashboard signals use one five-step scale. All dots are the same size; only the active dot is
coloured, the others are a light teal. Colours are set as `--s0` … `--s4` at the top of the template:

| Step | Positioning | Dashboard | Colour |
|---|---|---|---|
| `UW` | Underweight | Headwind | dark red |
| `SUW` | Slight underweight | Slight headwind | light red |
| `N` | Neutral | Neutral | gray |
| `SOW` | Slight overweight | Slight tailwind | light green |
| `OW` | Overweight | Tailwind | dark green |

Put `data-pos="UW|SUW|N|SOW|OW"` on the cell; the script draws the dots. No stance words next to the dots.

## Typography

- No widows or orphans: paragraphs use `text-wrap: pretty`, headings `text-wrap: balance`, and columns keep at
  least three lines together. If a month's copy still leaves a single word on a line, adjust the column width or
  page split, never the copy.

## Content rules

- **Use the copy doc word for word.** No added sentences, labels, captions, charts, calendars or summaries.
- Find the answer page: answers quote the doc — Q1 the positioning-change answer, Q2 the three asset-class dots,
  Q3 the macro answer, Q4 the risk titles.
- Months with positioning changes: put the change table on the Positioning page under the
  "No changes…" line it replaces, and update Q1.

## Making a new edition

1. Copy `template/template.html` to `template/YYYY-MM.html`.
2. Replace the copy page by page from the doc. Also update:
   - `<title>`, the cover eyebrow and title, and `const EDITION = '…'` in the script (drives every footer)
   - the Find the answer cards and the contents page numbers
3. Build:
   ```
   python3 portfolio-perspectives/template/build.py portfolio-perspectives/template/YYYY-MM.html portfolio-perspectives/YYYY-MM-<slug>.html
   ```
   Then build the white-label version (no Savvy logo; the logo spots stay empty for an advisor's logo):
   ```
   python3 portfolio-perspectives/template/build.py portfolio-perspectives/template/YYYY-MM.html portfolio-perspectives/YYYY-MM-<slug>-white-label.html --white-label
   ```
4. Export a PDF of each (report and white label): open the built HTML in **Chrome** → **Save as PDF** (or Cmd/Ctrl + P) → Margins **None**,
   **Background graphics** on, Scale **Default**. The page size (Letter, portrait) is set by the file.
5. Check that every page fits above the footer (long months may need a section split onto a "(continued)" page).

## Blog post (Webflow CMS)

Each edition also goes on savvywealth.com as a draft item in the **Blog Posts** collection.

1. Save the copy doc as Markdown to `copy/YYYY-MM-report.md` and the supporting resources doc as text to
   `copy/YYYY-MM-supporting.txt` (only the "Blog meta description" is read from it).
2. Build the CMS fields:
   ```
   python3 portfolio-perspectives/blog/build_blog.py portfolio-perspectives/copy/YYYY-MM-report.md portfolio-perspectives/copy/YYYY-MM-supporting.txt portfolio-perspectives/blog/YYYY-MM
   ```
   This writes `blog.json` (title, slug, SEO title, meta description, body, sources) and `preview.html`.
   The body uses the copy word for word, in the same structure and table embeds as previous posts
   (`blog/embed-styles.json`).
3. With the Webflow connector, Claude uploads the month's thumbnail (used for both Thumbnail and Main image)
   and creates the item as a **draft**, copying authors, bios, photos and category from the previous post.
   A person reviews and publishes it in Webflow.

## Carousel (HTML)

`template/carousel.html` is the LinkedIn carousel as an HTML template, matching the Figma slides (file
`QJAJaS7qru79fTrIq73NHt`, page "PORTFOLIO PERSPECTIVES OCTOBER", "November 2026_Slide 1–7"). Edit the lines marked
`<!-- EDIT -->`, then:
```
python3 portfolio-perspectives/template/build.py portfolio-perspectives/template/carousel.html OUT-carousel.html
python3 portfolio-perspectives/template/export_pdf.py OUT-carousel.html OUT_DIR
```

## Sharing with the investment team (Claude skill)

From December 2026 the investment team builds the report, white label and carousel in their own Claude with the
skill in `skill/`. `skill/SKILL.md` holds the instructions Claude follows: the page-by-page copy map, dot levels,
overflow rules and carousel slots.

- Package it: `python3 portfolio-perspectives/skill/make_skill.py` → `skill/savvy-portfolio-perspectives.zip`.
- Install it in Claude: **Settings › Capabilities › Skills › Upload skill**, with code execution turned on.
- Re-run `make_skill.py` and share the new zip whenever the template, the scripts or SKILL.md change.

## Email banner

`template/email-banner.html` is the monthly email header (600 × 150, Figma `XYp5xl61nCXvKUjuc4jLEL` node
`32544:195`). Change the month, build, then `export_pdf.py` writes a 1200 × 300 PNG. Outputs live in `email/`.

## Blog thumbnail

`template/blog-thumbnail.html` is the Webflow blog Thumbnail and Main image (548 × 210, Figma `XYp5xl61nCXvKUjuc4jLEL`
node `32544:204`). Change the month, build, then `export_pdf.py` writes a 1096 × 420 PNG.

## Blog from a finished report

When the month's copy arrives as the investment team's finished report, run
`blog/report_to_copy.py template/YYYY-MM-<slug>.html copy/YYYY-MM-report.md` to make the copy doc, then
`build_blog.py` as above. It keeps the October blog style: dots become stance and signal names, and the positioning
heading is "Savvy Total Portfolios: tactical asset allocation positioning".
