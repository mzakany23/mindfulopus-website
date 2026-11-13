// Requires Playwright and its Chromium/WebKit browsers. Start the local site first.
// BASE_URL=http://localhost:8877 node tests/testimonials-browser.cjs
const { spawnSync } = require('node:child_process');
const path = require('node:path');
for (const file of ['testimonials-lan.cjs', 'testimonials-lan-modes.cjs', 'testimonials-webkit-touch.cjs']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, file)], { stdio: 'inherit', env: process.env });
  if (result.status !== 0) process.exit(result.status || 1);
}
