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
| `template/export-pdf.js` | Optional: renders the PDF and page previews with Playwright, at the page's own size. |
| `assets/` | Logo (black/white SVG), section icons (Verdict, Portfolio stance, Core driver), author headshots. |
| `YYYY-MM-<slug>.html` / `.pdf` | Published editions (Savvy-branded report). |
| `YYYY-MM-<slug>-white-label.html` / `.pdf` | Same report with no Savvy logo, for client marketing to add an advisor's logo. |

## Fixed structure (portrait, 816 × 1056 px = 8.5 × 11 in pages)

1. Cover — eyebrow, title, subtitle, authors
2. Contents — clickable
3. Find the answer — the four advisor questions, each with a short answer and a link
4. Executive snapshot — callout, Verdict, Core driver, Portfolio stance (with dots)
5. Core driver
6. Core driver (continued) — Equities / Fixed income / Real assets
7. Macro thoughts — Growth, Inflation, Financial conditions and the Fed
8. Macro thoughts (continued) — Earnings and valuation, Geopolitics
9. The Savvy Macro Dashboard — Summary (signal dots, Headwind → Tailwind legend)
10. The Savvy Macro Dashboard (continued) — Data
11. Question of the month
12. Positioning — asset class + sector views (dots, Underweight → Overweight legend)
13. Risks we’re watching — 2-column grid
14. Closing thoughts (column 1, with Disclosures) + Sources (column 2)
15. Back cover

The order follows the monthly content doc. Page numbers in the contents and on the Find the answer page are
typed by hand, so check them if a section grows to a new page.

## Dot scale

Positioning and dashboard signals use one five-step scale. Only the active dot is coloured (and slightly
larger); the others are light beige. Colours are set as `--s0` … `--s4` at the top of the template:

| Step | Positioning | Dashboard | Colour |
|---|---|---|---|
| `UW` | Underweight | Headwind | dark red |
| `SUW` | Slight underweight | Slight headwind | light red |
| `N` | Neutral | Neutral | gray |
| `SOW` | Slight overweight | Slight tailwind | light green |
| `OW` | Overweight | Tailwind | dark green |

Put `data-pos="UW|SUW|N|SOW|OW"` on the cell; the script draws the dots. No stance words next to the dots.

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
