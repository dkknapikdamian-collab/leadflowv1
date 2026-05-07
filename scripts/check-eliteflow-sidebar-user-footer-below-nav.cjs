const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const indexCss = read('src/index.css');
const css = read('src/styles/eliteflow-sidebar-user-footer-below-nav.css');

function fail(message) {
  console.error('[eliteflow-sidebar-user-footer-below-nav] FAIL: ' + message);
  process.exit(1);
}

const importLine = "@import './styles/eliteflow-sidebar-user-footer-below-nav.css';";
if (!indexCss.includes(importLine)) fail('src/index.css missing sidebar user footer below nav import');
if (!indexCss.trim().endsWith(importLine)) fail('sidebar user footer below nav import must be the final import in src/index.css');

[
  'ELITEFLOW_SIDEBAR_USER_FOOTER_BELOW_NAV_2026_05_07',
  '.sidebar[data-shell-sidebar="true"] .nav-scroll',
  'overflow-y: auto !important',
  '.sidebar[data-shell-sidebar="true"] .sidebar-footer',
  'position: static !important',
  '.user-card[data-shell-user-card="true"]',
  'grid-template-columns: 38px minmax(0, 1fr) !important',
  'text-overflow: ellipsis !important',
  '.sidebar-footer::before',
  'content: none !important'
].forEach((needle) => {
  if (!css.includes(needle)) fail('CSS missing marker: ' + needle);
});

console.log('[eliteflow-sidebar-user-footer-below-nav] OK: user card is a normal footer block below sidebar navigation');
