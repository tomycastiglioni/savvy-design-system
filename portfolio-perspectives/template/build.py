"""Build a self-contained Portfolio Perspectives HTML file (report or carousel) from a source template.

Usage (from the repo root):
    python3 portfolio-perspectives/template/build.py SOURCE.html OUTPUT.html [--white-label]

--white-label hides every Savvy logo (cover, page headers, back cover) and keeps its space
empty, so client marketing can drop an advisor's logo in the same spot. It also removes the
"Independence, reinvented." tagline (back cover and page headers).

Inlines the logo, section icons and author headshots from portfolio-perspectives/assets
as data URIs, so the output is a single file you can open, share or print to PDF.
"""
import base64, pathlib, sys

ASSETS = pathlib.Path(__file__).resolve().parent.parent / 'assets'

def data_uri(name, mime):
    return f'data:{mime};base64,' + base64.b64encode((ASSETS / name).read_bytes()).decode()

PLACEHOLDERS = {
    '%%WORDMARK%%': ('logo-black.svg', 'image/svg+xml'),
    '%%WORDMARK_WHITE%%': ('logo-white.svg', 'image/svg+xml'),
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
    if key in html:
        html = html.replace(key, data_uri(name, mime))
# embed Inter so the file renders the same offline (replaces the Google Fonts link)
font = ASSETS / 'fonts' / 'inter-variable.woff2'
if font.exists():
    face = ("<style>@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;"
            "src:url(data:font/woff2;base64," + base64.b64encode(font.read_bytes()).decode() + ") format('woff2')}</style>")
    lines = [l for l in html.split('\n') if 'fonts.googleapis.com' not in l and 'fonts.gstatic.com' not in l]
    html = '\n'.join(lines).replace('</head>', face + '\n</head>', 1)
# ABC Diatype is the brand face. Its licensed files live in assets/fonts (OTF, WOFF2 or WOFF, e.g.
# ABCDiatype-Light.otf); they are git-ignored because the repo is public and ship only in the private skill
# zip. Any found here are embedded. Without them the CSS stack falls back to the embedded Inter (never
# Helvetica Neue: its 300 is Thin and sets too tight).
WEIGHTS = {'thin': 100, 'light': 300, 'regular': 400, 'medium': 500, 'bold': 700}
FMT = {'.woff2': ('font/woff2', 'woff2'), '.woff': ('font/woff', 'woff'), '.otf': ('font/otf', 'opentype')}
for f in sorted((ASSETS / 'fonts').glob('*Diatype*')):
    if f.suffix.lower() not in FMT:
        continue
    mime, fmt = FMT[f.suffix.lower()]
    w = next((v for k, v in WEIGHTS.items() if k in f.stem.lower()), 400)
    html = html.replace('</head>', "<style>@font-face{font-family:'ABC Diatype';font-style:normal;"
                        f"font-weight:{w};font-display:block;src:url(data:{mime};base64,"
                        + base64.b64encode(f.read_bytes()).decode() + f") format('{fmt}')}}</style>\n</head>", 1)
if '%%' in html:
    i = html.index('%%')
    sys.exit(f'Unknown placeholder left in {src}: ' + html[i:i + 30])
if white_label:
    html = html.replace('</style>', '/* white label: Savvy logo removed, space kept for an advisor logo */\n.wordmark{visibility:hidden!important}\n.back .tg,.tagline{display:none!important}\n</style>', 1)
    html = html.replace('<title>Portfolio Perspectives — ', '<title>Portfolio Perspectives (white label) — ', 1)
pathlib.Path(out).write_text(html)
print(f'Wrote {out}')
