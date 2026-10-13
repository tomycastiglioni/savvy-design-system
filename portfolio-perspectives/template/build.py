"""Build a self-contained Portfolio Perspectives HTML file from a source template.

Usage (from the repo root):
    python3 portfolio-perspectives/template/build.py SOURCE.html OUTPUT.html

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

src, out = sys.argv[1], sys.argv[2]
html = pathlib.Path(src).read_text()
for key, (name, mime) in PLACEHOLDERS.items():
    if key not in html:
        sys.exit(f'Missing placeholder {key} in {src}')
    html = html.replace(key, data_uri(name, mime))
pathlib.Path(out).write_text(html)
print(f'Wrote {out}')
