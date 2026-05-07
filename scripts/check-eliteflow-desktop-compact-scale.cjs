const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function fail(message) {
  console.error('[eliteflow-desktop-compact-scale] FAIL: ' + message);
  process.exit(1);
}

const indexCss = read('src/index.css');
const cssPath = 'src/styles/eliteflow-desktop-compact-scale.css';
const css = read(cssPath);

const importLine = "@import './styles/eliteflow-desktop-compact-scale.css';";
if (!indexCss.includes(importLine)) fail('src/index.css missing desktop compact scale import');
if (!indexCss.trim().endsWith(importLine)) fail('desktop compact scale CSS must be the last import in src/index.css');

[
  'ELITEFLOW_DESKTOP_COMPACT_SCALE_2026_05_07',
  '--eliteflow-desktop-scale: 0.84',
  'transform: scale(var(--eliteflow-desktop-scale)) !important',
  'width: calc(100vw / var(--eliteflow-desktop-scale)) !important',
  '@media (min-width: 1024px) and (min-height: 640px)',
  '@media (max-width: 1023px), (max-height: 639px)',
  'transform: none !important'
].forEach((needle) => {
  if (!css.includes(needle)) fail('scale CSS missing marker: ' + needle);
});

console.log('[eliteflow-desktop-compact-scale] OK: desktop compact scale is imported last and is disabled on mobile/tablet');

