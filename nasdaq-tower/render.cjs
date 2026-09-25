// Frame-accurate export of the tower animation.
//
//   node render.cjs stills 2,6,10,16        → frames/still-XX.png
//   node render.cjs video tower.mp4         → H.264 MP4, 1568×2000, 30 fps (needs ffmpeg on PATH or FFMPEG=/path)
//
// Needs Playwright (npm i -g playwright, or NODE_PATH pointing at a global install).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const ROOT = __dirname;
const FPS = 30;
const DURATION = 24;
const TYPES = { '.html': 'text/html', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript' };

function serve() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
      if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, () => resolve(server));
  });
}

async function frame(page, t) {
  const dataUrl = await page.evaluate(t => {
    window.renderAt(t);
    return document.getElementById('stage').toDataURL('image/png');
  }, t);
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

(async () => {
  const [mode = 'stills', arg = '2,6,10,16'] = process.argv.slice(2);
  const server = await serve();
  const browser = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 1400 } });
  await page.goto(`http://localhost:${server.address().port}/index.html`);
  await page.evaluate(() => window.towerReady);

  if (mode === 'stills') {
    fs.mkdirSync(path.join(ROOT, 'frames'), { recursive: true });
    for (const t of arg.split(',').map(Number)) {
      const out = path.join(ROOT, 'frames', `still-${String(t).padStart(2, '0')}.png`);
      fs.writeFileSync(out, await frame(page, t));
      console.log(out);
    }
  } else {
    const ffmpeg = spawn(process.env.FFMPEG || 'ffmpeg', [
      '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
      path.resolve(arg),
    ], { stdio: ['pipe', 'inherit', 'inherit'] });
    const total = FPS * DURATION;
    for (let i = 0; i < total; i++) {
      const buf = await frame(page, i / FPS);
      if (!ffmpeg.stdin.write(buf)) await new Promise(r => ffmpeg.stdin.once('drain', r));
      if (i % FPS === 0) process.stdout.write(`\r${i / FPS}/${DURATION} s`);
    }
    ffmpeg.stdin.end();
    await new Promise(r => ffmpeg.on('close', r));
    console.log(`\nwrote ${arg}`);
  }
  await browser.close();
  server.close();
})();
