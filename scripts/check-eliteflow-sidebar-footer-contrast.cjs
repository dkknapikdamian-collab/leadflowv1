const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const indexCss = read('src/index.css');
const css = read('src/styles/eliteflow-sidebar-footer-contrast-repair.css');

function fail(message) {
  console.error('[eliteflow-sidebar-footer] FAIL: ' + message);
  process.exit(1);
}

const importLine = "@import './styles/eliteflow-sidebar-footer-contrast-repair.css';";
if (!indexCss.includes(importLine)) fail('src/index.css missing sidebar footer contrast import');
if (!indexCss.trim().endsWith(importLine)) fail('sidebar footer contrast import must be the final import in src/index.css');

[
  'ELITEFLOW_SIDEBAR_FOOTER_CONTRAST_REPAIR_2026_05_07',
  '.sidebar[data-shell-sidebar="true"] .sidebar-footer',
  '.user-card[data-shell-user-card="true"]',
  'background-color: rgba(15, 23, 42, 0.72) !important',
  '-webkit-text-fill-color: rgba(255, 255, 255, 0.94) !important',
  '.sidebar-logout',
  '@media (max-width: 1220px)'
].forEach((needle) => {
  if (!css.includes(needle)) fail('CSS missing required marker: ' + needle);
});

console.log('[eliteflow-sidebar-footer] OK: sidebar footer and user card contrast repair is imported last');
