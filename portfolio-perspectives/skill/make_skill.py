"""Package the Portfolio Perspectives Claude skill as a zip to upload in Claude (Settings › Capabilities › Skills).

Usage (from the repo root):
    python3 portfolio-perspectives/skill/make_skill.py

Writes portfolio-perspectives/skill/savvy-portfolio-perspectives.zip from the current template, scripts, assets and
the latest example PDFs. Re-run it whenever the template changes, then share the new zip.
"""
import pathlib, zipfile

PP = pathlib.Path(__file__).resolve().parent.parent
NAME = 'savvy-portfolio-perspectives'
FILES = {
    'SKILL.md': PP / 'skill' / 'SKILL.md',
    'templates/report.html': PP / 'template' / 'template.html',
    'templates/carousel.html': PP / 'template' / 'carousel.html',
    'scripts/build.py': PP / 'template' / 'build.py',
    'scripts/export_pdf.py': PP / 'template' / 'export_pdf.py',
    'examples/2026-11-broader-not-weaker.pdf': PP / '2026-11-broader-not-weaker.pdf',
    'examples/2026-11-broader-not-weaker-white-label.pdf': PP / '2026-11-broader-not-weaker-white-label.pdf',
    'examples/2026-11-broader-not-weaker-carousel.pdf': PP / 'carousel' / '2026-11-broader-not-weaker-carousel.pdf',
}
for f in sorted((PP / 'assets').rglob('*')):
    if f.is_file():
        FILES['assets/' + f.relative_to(PP / 'assets').as_posix()] = f

out = PP / 'skill' / f'{NAME}.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for arc, src in FILES.items():
        z.write(src, f'{NAME}/{arc}')
print(f'Wrote {out} ({len(FILES)} files, {out.stat().st_size // 1024} KB)')
