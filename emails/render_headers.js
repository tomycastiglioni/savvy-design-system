// Renders header-N.html -> assets/header-N.png at 2x. Usage: node render_headers.js 2 3 4 5 6
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();
for(const n of process.argv.slice(2)){
  const p=await b.newPage({viewport:{width:600,height:400},deviceScaleFactor:2});
  await p.goto('file://'+path.join(__dirname,`header-${n}.html`));await p.waitForTimeout(400);
  const w=await p.evaluate(()=>Math.max(...[...document.querySelectorAll('.left > *')].map(e=>e.getBoundingClientRect().right)));
  const r=await p.evaluate(()=>{const c=(document.querySelector('.right > *')||document.querySelector('.art')).getBoundingClientRect();const h=document.querySelector('#hdr').getBoundingClientRect();return [c.left,c.top,c.bottom,h.height]});
  console.log(n,'left text right edge',w.toFixed(0),'| graphic left',r[0].toFixed(0),'top',r[1].toFixed(0),'bottom',r[2].toFixed(0),'of',r[3]);
  await (await p.$('#hdr')).screenshot({path:path.join(__dirname,'assets',`header-${n}.png`)});
}
await b.close()})()
