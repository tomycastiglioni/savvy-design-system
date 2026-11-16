"""Turn the investment team's copy doc (.docx) into the Markdown copy doc that build_blog.py reads.

Usage (from the repo root):
    python3 portfolio-perspectives/blog/docx_to_copy.py "Savvy Portfolio Perspectives | Month YYYY.docx" \
        portfolio-perspectives/copy/YYYY-MM-report.md

The DOCX is the source of truth for the blog (not the PDF, which is a separate deliverable with the same content
laid out differently). Needs pandoc. The text is kept word for word; this only normalises the Markdown so
build_blog.py can read it: HTML tables become pipe tables, blank lines between list items are removed, and the
colour-dot glyphs at the start of the Portfolio stance bullets are dropped (the blog cannot show their colour).
"""
import pathlib, re, subprocess, sys
from bs4 import BeautifulSoup

md = subprocess.run(['pandoc', '-f', 'docx', '-t', 'gfm', '--wrap=none', sys.argv[1]],
                    check=True, capture_output=True, text=True).stdout


def html_table(m):
    soup = BeautifulSoup(m.group(0), 'html.parser')
    out = []
    for tr in soup.find_all('tr'):
        cells = tr.find_all(['th', 'td'])
        if len(cells) == 1 and cells[0].get('colspan'):           # group row, e.g. "Growth"
            out.append(f'| **{cells[0].get_text(" ", strip=True)}** |  |  |')
            continue
        row = []
        for c in cells:
            paras = c.find_all('p') or [c]
            parts = []
            for p in paras:
                t = p.get_text(' ', strip=True)
                parts.append(f'*{t}*' if p.find('em') and p.find('em').get_text(strip=True) == t else t)
            row.append(' '.join(parts).replace('|', '\\|'))
        out.append('| ' + ' | '.join(row) + ' |')
        if tr.find('th'):
            out.append('| ' + ' | '.join(':----' for _ in cells) + ' |')
    return '\n'.join(out)


md = re.sub(r'<table>.*?</table>', html_table, md, flags=re.S)
lines = [ln for ln in md.splitlines() if ln.replace('​', '').replace('\xa0', '').strip() or ln == '']
md = '\n'.join(lines)
md = re.sub(r'^(- .+)\n\n(?=- )', r'\1\n', md, flags=re.M)          # keep each list together
md = re.sub(r'^(- .+)\n\n(?=- )', r'\1\n', md, flags=re.M)
md = re.sub(r'^- ●\s*', '- ', md, flags=re.M)                       # colour dots in Portfolio stance
md = re.sub(r'\n{3,}', '\n\n', md)
pathlib.Path(sys.argv[2]).write_text(md.strip() + '\n')
print(f'Wrote {sys.argv[2]}')
