"""Build the Webflow blog post for a Portfolio Perspectives edition from the copy doc.

Usage (from the repo root):
    python3 portfolio-perspectives/blog/build_blog.py COPY.md SUPPORTING.txt OUT_DIR

COPY.md        the report copy doc exported as Markdown (Google Docs: File > Download > Markdown)
SUPPORTING.txt the supporting-resources doc as text (only the "Blog meta description" is used)
OUT_DIR        where blog.json (CMS field values) and preview.html are written

The copy is used word for word. Structure and table embeds match the September 2026
post in the Webflow "Blog Posts" collection; embed CSS lives in embed-styles.json.
"""
import html, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
STYLES = json.loads((HERE / 'embed-styles.json').read_text())
SPACER = '<p>‍</p>'
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December']


def clean(s):
    """Markdown escapes -> text, then inline bold/italic -> HTML."""
    s = re.sub(r'\\([\\`*_{}\[\]()#+\-.!$&|~<>])', r'\1', s)
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\*)', r'<em>\1</em>', s)
    return s.strip()


def plain(s):
    return re.sub(r'<[^>]+>', '', clean(s))


def bold_only(line):
    m = re.fullmatch(r'\*\*(.+?)\*\*', line.strip())
    return m.group(1) if m else None


def parse(md):
    """Return title, byline lines, and ordered sections {name: [blocks]}."""
    lines = md.splitlines()
    title, sections, cur = None, [], None
    for ln in lines:
        if ln.startswith('# '):
            title = plain(ln[2:])
        elif ln.startswith('## '):
            cur = (plain(ln[3:]), [])
            sections.append(cur)
        elif cur is not None:
            cur[1].append(ln)
    return title, sections


def blocks(lines):
    """Group raw lines into ('table', rows) / ('ul', items) / ('p', text) blocks."""
    out, i = [], 0
    while i < len(lines):
        ln = lines[i].rstrip()
        if ln.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', c) for c in cells):
                    rows.append(cells)
                i += 1
            out.append(('table', rows))
            continue
        if re.match(r'^\s*[*-] ', ln):
            items = []
            while i < len(lines) and re.match(r'^\s*[*-] ', lines[i]):
                items.append(re.sub(r'^\s*[*-] ', '', lines[i]).strip())
                i += 1
            out.append(('ul', items))
            continue
        if ln.strip():
            out.append(('p', ln.strip()))
        i += 1
    return out


def embed(kind, inner):
    return f"<div data-rt-embed-type='true'>{STYLES[kind]}\n{inner}</div>"


def summary_table(rows):
    head, body = rows[0], rows[1:]
    cells = ''.join(f'      <div class="regime-summary-table__head">{plain(c)}</div>\n' for c in head)
    for n, r in enumerate(body):
        tone = 'row--white' if n % 2 == 0 else 'row--alt'
        last = plain(r[2]) if len(r) > 2 else ''
        bold = ' style="font-weight:700;"' if '**' in (r[2] if len(r) > 2 else '') else ''
        cells += (f'\n      <div class="regime-summary-table__cell cat-strong {tone}">{plain(r[0])}</div>\n'
                  f'      <div class="regime-summary-table__cell {tone}">{plain(r[1])}</div>\n'
                  f'      <div class="regime-summary-table__cell {tone} col-last"{bold}>{last}</div>\n')
    return embed('regime-summary', '<div class="regime-summary-wrap">\n  <div class="regime-summary-table">\n'
                 f'    <div class="regime-summary-table__grid">\n{cells}    </div>\n  </div>\n</div>')


def data_table(rows):
    head, body = rows[0], rows[1:]
    cells = ''.join(f'      <div class="market-table__head">{plain(c)}</div>\n' for c in head)
    n = 0
    for r in body:
        if not plain(r[1]) and not plain(r[2]):
            cells += f'\n      <div class="market-table__category">{plain(r[0])}</div>\n'
            n = 0
            continue
        tone = 'row--white' if n % 2 == 0 else 'row--alt'
        n += 1
        # "Aug 3.4% *Sep 3.6%* *Oct 3.6%*" -> line breaks before each italic nowcast
        value = re.sub(r'\s*<em>', '<br><em>', clean(r[1]))
        cells += (f'\n      <div class="market-table__cell cat-strong {tone}">{plain(r[0])}</div>\n'
                  f'      <div class="market-table__cell {tone}">{value}</div>\n'
                  f'      <div class="market-table__cell {tone} col-last">{plain(r[2])}</div>\n')
    return embed('market-table', '<div class="market-table-wrap">\n  <div class="market-table">\n'
                 f'    <div class="market-table__grid">\n{cells}\n    </div>\n  </div>\n</div>')


def positioning_table(rows):
    head, body = rows[0], rows[1:]
    cells = ''.join(f'      <div class="positioning-table__head">{plain(c)}</div>\n' for c in head)
    for r in body:
        if r[0].startswith('**') and r[2].startswith('**'):   # sleeve (parent) row
            cells += (f'\n      <div class="positioning-table__parent-name">{plain(r[0])}</div>\n'
                      f'      <div class="positioning-table__parent-mid">{plain(r[1])}</div>\n'
                      f'      <div class="positioning-table__parent-rationale">{plain(r[2])}</div>\n')
        else:
            cells += (f'\n      <div class="positioning-table__cell positioning-table__cell--name">{plain(r[0])}</div>\n'
                      f'      <div class="positioning-table__cell positioning-table__cell--mid">{plain(r[1])}</div>\n'
                      f'      <div class="positioning-table__cell">{plain(r[2])}</div>\n')
    return embed('positioning-table', '<div class="positioning-table-wrap">\n  <div class="positioning-table">\n'
                 f'    <div class="positioning-table__grid">\n{cells}    </div>\n  </div>\n</div>')


def sector_table(rows):
    head, body = rows[0], rows[1:]
    cells = ''.join(f'      <div class="sector-table__head">{plain(c)}</div>\n' for c in head)
    for n, r in enumerate(body):
        tone = 'row--alt' if n % 2 == 0 else 'row--white'
        cells += (f'\n      <div class="sector-table__cell sec-strong {tone}">{plain(r[0])}</div>\n'
                  f'      <div class="sector-table__cell {tone}">{plain(r[1])}</div>\n'
                  f'      <div class="sector-table__cell {tone} col-last">{plain(r[2])}</div>\n')
    return embed('sector-table', '<div class="sector-table-wrap">\n  <div class="sector-table">\n'
                 f'    <div class="sector-table__grid">\n{cells}    </div>\n  </div>\n</div>')


def change_table(rows):
    """Months with positioning changes: Asset / Class | Action | Previous | Current | Rationale."""
    head, body = rows[0], rows[1:]
    cells = ''.join(f'      <div class="rebalance-table__head">{plain(c)}</div>\n' for c in head)
    for n, r in enumerate(body):
        tone = 'row--alt' if n % 2 == 0 else 'row--white'
        cells += f'\n      <div class="rebalance-table__cell rbt-strong {tone}">{plain(r[0])}</div>\n'
        cells += ''.join(f'      <div class="rebalance-table__cell {tone}{" col-last" if i == len(r) - 2 else ""}">{plain(c)}</div>\n'
                         for i, c in enumerate(r[1:]))
    return embed('rebalance-table', '<div class="rebalance-table-wrap">\n  <div class="rebalance-table">\n'
                 f'    <div class="rebalance-table__grid">\n{cells}    </div>\n  </div>\n</div>')


def render_generic(bl, sub='h3'):
    """Paragraphs; a paragraph that is only bold text becomes a sub-heading."""
    out = []
    for kind, val in bl:
        if kind == 'p':
            b = bold_only(val)
            if b:
                if out:
                    out.append(SPACER)
                out.append(f'<{sub}>{plain(b)}</{sub}>')
            else:
                out.append(f'<p>{clean(val)}</p>')
        elif kind == 'ul':
            out.append('<ul>' + ''.join(f'<li>{clean(x)}</li>' for x in val) + '</ul>')
    return out


def build(md, meta_description):
    title, sections = parse(md)
    month_year = re.search(r'(%s) (\d{4})' % '|'.join(MONTHS), md).group(0)
    month, year = month_year.split()
    body, bottom = [f'<h1>{title}</h1>', SPACER], ''
    for name, lines in sections:
        bl = blocks(lines)
        low = name.lower()
        if low.startswith('sources'):
            items = next(v for k, v in bl if k == 'ul')
            bottom = '<h4>Sources:</h4><ul>' + ''.join(f'<li>{clean(x)}</li>' for x in items) + '</ul>'
            continue
        if low.startswith('disclosures'):
            continue  # the blog template carries its own site-wide disclosure
        if low.startswith('savvy total portfolios'):
            body.append(f'<h2><strong>{name}</strong></h2>')
            for kind, val in bl:
                if kind == 'p':
                    b = bold_only(val)
                    if b and b.lower().endswith('views'):
                        body += [SPACER, f'<h3>{plain(b)}</h3>']
                    else:
                        body.append(f'<p>{clean(val)}</p>')
                elif kind == 'table':
                    head = [plain(c).lower() for c in val[0]]
                    if 'action' in head:
                        body.append(change_table(val))
                    elif head[0].startswith('sector'):
                        body.append(sector_table(val))
                    else:
                        body.append(positioning_table(val))
            body.append(SPACER)
        elif low.startswith('the savvy macro dashboard'):
            body.append(f'<h2>{name}</h2>')
            for kind, val in bl:
                if kind == 'p' and bold_only(val):
                    if body[-1] != f'<h2>{name}</h2>':
                        body.append(SPACER)
                    body.append(f'<h3>{plain(bold_only(val))}</h3>')
                elif kind == 'table':
                    body.append(summary_table(val) if plain(val[0][0]).lower() == 'category' else data_table(val))
            body.append(SPACER)
        elif low.startswith('question of the month'):
            body.append(f'<h2>{name}</h2>')
            for kind, val in bl:
                b = bold_only(val) if kind == 'p' else None
                if b:
                    body.append(f'<h2>"{plain(b)}"</h2>')
                elif kind == 'p':
                    body += [f'<p>{clean(val)}</p>', SPACER]
        elif low.startswith('risks'):
            body.append(f'<h2>{name}</h2>')
            for kind, val in bl:
                m = re.match(r'\*\*(.+?)\*\*\s*(.*)', val) if kind == 'p' else None
                if m:
                    body += [f'<h4>{plain(m.group(1))}</h4>', f'<p>{clean(m.group(2))}</p>']
            body.append(SPACER)
        else:
            body.append(f'<h2>{name}</h2>')
            body += render_generic(bl)
            body.append(SPACER)
    slug = f'savvy-portfolio-perspectives-{month.lower()}-{year}'
    fields = {
        'name': f'Savvy Portfolio Perspectives | {month} {year}',
        'slug': slug,
        'meta-tags': f'Savvy Portfolio Perspectives – {month} {year}',
        'meta-description': meta_description,
        'blog-post-copy': ''.join(body),
        'blog-post-bottom-line': bottom,
    }
    return fields


def meta_from_supporting(text):
    m = re.search(r'Blog meta description\s*\n.*?\n\s*\n(.+?)\n', text, re.S)
    if not m:
        sys.exit('Could not find the blog meta description in the supporting doc')
    return m.group(1).strip()


if __name__ == '__main__':
    md = pathlib.Path(sys.argv[1]).read_text()
    meta = meta_from_supporting(pathlib.Path(sys.argv[2]).read_text())
    out = pathlib.Path(sys.argv[3]); out.mkdir(parents=True, exist_ok=True)
    fields = build(md, meta)
    (out / 'blog.json').write_text(json.dumps(fields, indent=1, ensure_ascii=False))
    (out / 'preview.html').write_text('<!doctype html><meta charset="utf-8"><title>Blog preview</title>'
                                      '<body style="max-width:860px;margin:40px auto;font-family:Inter,sans-serif">'
                                      + fields['blog-post-copy'] + fields['blog-post-bottom-line'])
    print(f"Wrote {out/'blog.json'} ({len(fields['blog-post-copy'])} chars of body)")
