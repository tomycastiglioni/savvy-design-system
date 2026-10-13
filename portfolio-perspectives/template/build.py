"""Build a self-contained Portfolio Perspectives HTML file from a source template.

Usage (from the repo root):
    python3 portfolio-perspectives/template/build.py SOURCE.html OUTPUT.html [--white-label]

--white-label hides every Savvy logo (cover, page headers, back cover) and keeps its space
empty, so client marketing can drop an advisor's logo in the same spot.

Inlines the logo, section icons and author headshots from portfolio-perspectives/assets
as data URIs, so the output is a single file you can open, share or print to PDF.
"""
import base64, pathlib, sys

ASSETS = pathlib.Path(__file__).resolve().parent.parent / 'assets'

def data_uri(name, mime):
    return f'data:{mime};base64,' + base64.b64encode((ASSETS / name).read_bytes()).decode()

PLACEHOLDERS = {
    '%%WORDMARK%%': ('logo-black.svg', 'image/svg+xml'),
    '%%ICON_VERDICT%%': ('icon-verdict.svg', 'image/svg+xml'),
    '%%ICON_STANCE%%': ('icon-portfolio-stance.svg', 'image/svg+xml'),
    '%%ICON_CORE%%': ('icon-core-driver.svg', 'image/svg+xml'),
    '%%ANSHUL%%': ('headshot-anshul-sharma.png', 'image/png'),
    '%%ANI%%': ('headshot-ani-vedere.png', 'image/png'),
}

args = [a for a in sys.argv[1:] if not a.startswith('--')]
white_label = '--white-label' in sys.argv
src, out = args[0], args[1]
html = pathlib.Path(src).read_text()
for key, (name, mime) in PLACEHOLDERS.items():
    if key not in html:
        sys.exit(f'Missing placeholder {key} in {src}')
    html = html.replace(key, data_uri(name, mime))
if white_label:
    html = html.replace('</style>', '/* white label: Savvy logo removed, space kept for an advisor logo */\n.wordmark{visibility:hidden!important}\n</style>', 1)
    html = html.replace('<title>Portfolio Perspectives — ', '<title>Portfolio Perspectives (white label) — ', 1)
pathlib.Path(out).write_text(html)
print(f'Wrote {out}')
