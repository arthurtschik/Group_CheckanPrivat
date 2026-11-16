// Renders the download-page images (logo, favicon, touch icon) from the same artwork as the app icon.
// Usage: node build/site-assets.js docs/assets
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });

const icon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b7bff"/><stop offset="1" stop-color="#2d45d8"/></linearGradient></defs>
  <rect width="100" height="100" rx="22" fill="url(#g)"/>
  <g transform="translate(17.5 19) scale(0.66)">
    <rect x="22" y="14" width="56" height="72" rx="10" fill="#ffffff"/>
    <rect x="36" y="8" width="28" height="14" rx="6" fill="#dfe6ff" stroke="#ffffff" stroke-width="3"/>
    <path d="M34 50 l10 10 l22 -22" fill="none" stroke="#2f4ff0" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="34" y="68" width="32" height="5" rx="2.5" fill="#c9d3ff"/>
  </g>
</svg>`;

const files = { 'logo.png': 256, 'apple-touch-icon.png': 180, 'favicon.png': 64 };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 1 });
  for (const [name, size] of Object.entries(files)) {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<html><body style="margin:0;background:transparent">${icon(size)}</body></html>`);
    await p.screenshot({ path: path.join(out, name), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  }
  await b.close();
})();
