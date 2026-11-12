"""Turn a report source (template/YYYY-MM-<slug>.html) into the Markdown copy doc that build_blog.py reads.

Usage (from the repo root):
    python3 portfolio-perspectives/blog/report_to_copy.py portfolio-perspectives/template/YYYY-MM-<slug>.html \
        portfolio-perspectives/copy/YYYY-MM-report.md

Use it when the month's copy arrives as the investment team's finished report rather than a copy doc. The text is
taken word for word from the report. The only words added are the stance and signal names that the report shows as
dots ("Slight Overweight", "Slight Tailwind"), so the blog's tables can show them as text.
"""
import pathlib, re, sys
from bs4 import BeautifulSoup

POS = {'UW': 'Underweight', 'SUW': 'Slight Underweight', 'N': 'Neutral', 'SOW': 'Slight Overweight', 'OW': 'Overweight'}
SIG = {'UW': 'Headwind', 'SUW': 'Slight Headwind', 'N': 'Neutral', 'SOW': 'Slight Tailwind', 'OW': 'Tailwind'}


def esc(s):
    s = re.sub(r'\s+', ' ', s).strip()
    return s.replace('|', '\\|')


def txt(el):
    return esc(el.get_text(' ')) if el else ''


src = BeautifulSoup(pathlib.Path(sys.argv[1]).read_text(), 'html.parser')
page = lambda i: src.find('section', id=i)
edition = re.search(r"const EDITION = '([^']+)'", str(src)).group(1)
out = [f'**Savvy Portfolio Perspectives | {edition}**', '',
       '*By Anshul Sharma, Chief Investment Officer, and Ani Vedere, Senior Research Analyst*', '',
       f'*{txt(page("cover").find("p", class_="sub"))}*', '',
       f'# **{txt(page("cover").find("h1"))}**', '']

# executive snapshot
s = page('snapshot')
out += ['## **Executive snapshot**', '']
c = s.find(class_='callout')
out += [f'**{txt(c.find(class_="think"))}**', '', txt(c.find('p')), '']
for sec in s.find_all(class_='snap-sec'):
    out += [f'**{txt(sec.find(class_="h3"))}**', '']
    for li in sec.find_all('li'):
        pos = li.find(attrs={'data-pos': True})
        text = txt(li)
        if pos:  # "Equities: <text>" -> "Equities: Slight Overweight. <text>"
            head, _, rest = text.partition(': ')
            text = f'{head}: {POS[pos["data-pos"]]}. {rest}'
        out.append(f'* {text}')
    out.append('')

# every other section, in report order
ORDER = [sec for sec in src.find_all('section', class_='page')
         if sec.get('id') not in ('cover', 'contents', 'questions', 'snapshot', 'back')]
seen = set()
for sec in ORDER:
    sid, kind = sec['id'], sec.get('data-section', '')
    body = sec.find(class_='body')
    title = txt(body.find(class_='h1')) if body.find(class_='h1') else txt(body.find(class_='h2'))
    title = re.sub(r'\s*\(continued\)$', '', title)
    if kind == 'dashboard':
        out += ['## **The Savvy Macro Dashboard**', '']
        for t in body.find_all('table'):
            if 'score-tb' in t['class']:
                out += ['**Summary**', '', '| Category | Signal | Portfolio Signal |', '| :---- | :---- | :---- |']
                for tr in t.find('tbody').find_all('tr'):
                    td = tr.find_all('td')
                    out.append(f'| **{txt(td[1])}** | {SIG[td[2]["data-pos"]]} | {txt(td[3])} |')
            else:
                out += ['', '**Data**', '', '| Indicator | Current | Portfolio Signal |', '| :---- | :---- | :---- |']
                for tr in t.find('tbody').find_all('tr'):
                    td = tr.find_all('td')
                    if 'grp' in (tr.get('class') or []):
                        out.append(f'| **{txt(td[0])}** |  |  |')
                        continue
                    v = td[2]
                    extra = [txt(i) for i in v.find_all('i')]
                    for i in v.find_all('i'):
                        i.extract()
                    value = ' '.join([txt(v)] + [f'*{e}*' for e in extra]).strip()
                    out.append(f'| **{txt(td[1])}** | {value} | {txt(td[3])} |')
        out.append('')
        continue
    if kind == 'qa':
        out += [f'## **{title}**', '']
        for card in body.find_all(class_='card'):
            out += [f'**{txt(card.find(class_="qq"))}**', '']
            out += [x for p in card.find_all('p') for x in (txt(p), '')]
        continue
    if kind == 'positioning':
        out += [f'## **Savvy Total Portfolios: tactical asset allocation positioning**', '']
        lead = body.find('div', style=re.compile('italic'))
        if lead:
            out += [f'**{txt(lead)}**', '']
        rows = body.find('table').find('tbody').find_all('tr')
        out += ['**Asset class views**', '', '| Asset / Class | Positioning | Rationale |', '| :---- | :---- | :---- |']
        for tr in rows:
            td = tr.find_all('td')
            if 'sect' in (tr.get('class') or []):
                out += ['', f'**{txt(td[0])}**', '', '| Sector | Positioning | Rationale |', '| :---- | :---- | :---- |']
                continue
            p = POS[td[1]['data-pos']]
            if 'grp' in (tr.get('class') or []):
                out.append(f'| **{txt(td[0])}** | **{p}** | **{txt(td[2])}** |')
            else:
                out.append(f'| **{txt(td[0])}** | {p} | {txt(td[2])} |')
        out.append('')
        continue
    if kind == 'risks':
        out += [f'## **{title}**', '']
        for r in body.find_all(class_='risk'):
            out += [f'**{txt(r.find(class_="rn"))} {txt(r.find(class_="rt"))}.** {txt(r.find("p"))}', '']
        continue
    if kind == 'closing':
        out += ['## **Closing thoughts**', '']
        left = body.find(class_='close-l') or body
        out += [x for p in left.find_all('p') for x in (txt(p), '')]
        srcs = body.find(id='sources')
        out += ['## **Sources**', ''] + [f'* {txt(li)}' for li in srcs.find_all('li')] + ['']
        continue
    # generic prose sections (event section, core driver, macro thoughts)
    if title not in seen:
        out += [f'## **{title}**', '']
        seen.add(title)
    for el in body.find_all(['div', 'p']):
        cls = el.get('class') or []
        if 'h3' in cls and el.name == 'div':
            out += [f'**{txt(el)}**', '']
        elif el.name == 'p' and 'note' not in cls:
            out += [txt(el), '']

pathlib.Path(sys.argv[2]).write_text('\n'.join(out).rstrip() + '\n')
print(f'Wrote {sys.argv[2]}')
