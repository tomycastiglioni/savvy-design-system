// Renders icons/*.svg -> assets/icon-*.png (144x144, transparent). Usage: node render_icons.js
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:144,height:144},deviceScaleFactor:1});
for(const f of fs.readdirSync(path.join(__dirname,'icons')).filter(f=>f.endsWith('.svg'))){
  const svg=fs.readFileSync(path.join(__dirname,'icons',f),'utf8');
  await p.setContent(`<body style="margin:0;background:transparent">${svg}</body>`);
  await p.screenshot({path:path.join(__dirname,'assets',f.replace('.svg','.png')),omitBackground:true,clip:{x:0,y:0,width:144,height:144}});
}
await b.close()})()
