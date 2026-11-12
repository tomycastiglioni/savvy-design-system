"""Export a built Portfolio Perspectives HTML file (report or carousel) to PDF and PNG page previews.

Usage:
    python3 export_pdf.py BUILT.html OUT_DIR

Writes OUT_DIR/<name>.pdf (one PDF page per .page or .slide, at its own size) and OUT_DIR/<name>-pNN.png
previews, and prints any page whose content runs past its body area (report only).

Needs Playwright for Python with Chromium:
    pip install playwright && python3 -m playwright install chromium
If that cannot be installed, open the built HTML in Chrome → Print → Save as PDF,
Margins None, Background graphics on. The page size is set by the file.
"""
import os, pathlib, sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit('Playwright is not installed. Run: pip install playwright && python3 -m playwright install chromium\n'
             '(Set CHROME_PATH to use an installed Chrome.) Or open the HTML in Chrome → Print → Save as PDF (Margins None, Background graphics on).')

src = pathlib.Path(sys.argv[1]).resolve()
out = pathlib.Path(sys.argv[2]).resolve()
out.mkdir(parents=True, exist_ok=True)
stem = src.stem

OVERFLOW_JS = """() => [...document.querySelectorAll('.page')].map((pg, i) => {
  const b = pg.querySelector('.body'); if (!b) return null;
  const br = b.getBoundingClientRect(); let max = 0;
  b.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.height) max = Math.max(max, r.bottom); });
  return [i + 1, Math.round(max - br.bottom)];
}).filter(Boolean)"""

CLIP_JS = """() => [...document.querySelectorAll('.page')].flatMap((pg, i) =>
  [...pg.querySelectorAll('td,th')].filter(c => getComputedStyle(c).overflow === 'hidden' && c.scrollWidth > c.clientWidth + 0.5)
    .map(c => [i + 1, c.textContent.trim().slice(0, 40)]))"""

with sync_playwright() as p:
    exe = os.environ.get('CHROME_PATH')  # optional: an existing Chrome/Chromium binary
    browser = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
    page = browser.new_page(viewport={'width': 1300, 'height': 1500})
    page.goto(src.as_uri(), wait_until='load')
    page.wait_for_timeout(600)
    if page.query_selector('.banner'):  # email banner: one 2× PNG, no PDF
        hi = browser.new_page(viewport={'width': 1300, 'height': 400}, device_scale_factor=2)
        hi.goto(src.as_uri(), wait_until='load')
        hi.wait_for_timeout(600)
        hi.query_selector('.banner').screenshot(path=str(out / f'{stem}.png'), omit_background=True)
        browser.close()
        print(f'Wrote {out / (stem + ".png")} (2×)')
        sys.exit(0)
    page.add_style_tag(content='.bar,.tip{display:none!important}')
    over = [(n, px) for n, px in page.evaluate(OVERFLOW_JS) if px > 0]
    clipped = page.evaluate(CLIP_JS)
    sel = '.page' if page.query_selector('.page') else '.slide'
    nodes = page.query_selector_all(sel)
    for i, n in enumerate(nodes, 1):
        n.screenshot(path=str(out / f'{stem}-p{i:02d}.png'))
    w, h = page.eval_on_selector(sel, 'el => [el.offsetWidth, el.offsetHeight]')
    page.emulate_media(media='print')
    page.pdf(path=str(out / f'{stem}.pdf'), width=f'{w}px', height=f'{h}px', print_background=True, prefer_css_page_size=True)
    browser.close()

print(f'Wrote {out / (stem + ".pdf")} ({len(nodes)} pages) and PNG previews')
if clipped:
    print('CLIPPED — table cells cut off (page, text):', clipped)
if over:
    print('OVERFLOW — these pages run past the footer (page, px):', over)
    sys.exit(2)
if clipped:
    sys.exit(2)
print('All pages fit.')
