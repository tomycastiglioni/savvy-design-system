// Usage: PW=$(npm root -g)/playwright node export-pdf.js /abs/path/edition.html /abs/out/dir
// Writes out.pdf (16:9, one page per section page) plus pNN.png page previews.
const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1328, height: 800 }, deviceScaleFactor: 1 });
  const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto('file://' + process.argv[2], { waitUntil: 'load' });
  await p.waitForTimeout(500); await p.addStyleTag({content:".bar{display:none!important}"});
  const n = await p.$$eval('.page', a => a.length);
  const pages = await p.$$('.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: `${process.argv[3]}/p${String(i+1).padStart(2,'0')}.png` });
  // overflow check: any element inside .body extending past body bottom
  const ov = await p.$$eval('.page', ps => ps.map((pg,i) => { const b = pg.querySelector('.body'); if (!b) return null; const br = b.getBoundingClientRect(); let max = 0; b.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.height) max = Math.max(max, r.bottom); }); return [i+1, Math.round(max - br.bottom)]; }).filter(Boolean));
  console.log('pages', n, 'overflow(px past body bottom, >0 bad):', JSON.stringify(ov));
  await p.emulateMedia({ media: 'print' });
  await p.pdf({ path: process.argv[3] + '/out.pdf', width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true });
  console.log('errors', errs);
  await b.close();
})();
