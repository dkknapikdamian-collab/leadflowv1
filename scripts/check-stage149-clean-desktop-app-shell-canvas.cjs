/* CLOSEFLOW_STAGE149_CLEAN_DESKTOP_APP_SHELL_CANVAS_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
function mustNotInclude(rel, marker) {
  const content = read(rel);
  if (content.includes(marker)) throw new Error(`${rel} must not include marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';");
[
  'closeflow-desktop-wide-content-stage136.css',
  'closeflow-desktop-content-shell-stage137.css',
  'closeflow-desktop-left-anchor-content-stage138.css',
  'closeflow-unified-desktop-canvas-stage139.css',
  'closeflow-unified-desktop-work-width-stage140.css',
  'closeflow-shared-work-width-frame-stage141.css',
  'closeflow-repair-shared-work-width-frame-stage142.css',
  'closeflow-hard-work-frame-width-stage143.css',
  'closeflow-shell-content-width-source-truth-stage144.css',
  'closeflow-route-root-width-normalization-stage145.css',
  'closeflow-fluid-work-surface-stage146.css',
  'closeflow-shell-overflow-work-surface-stage147.css',
  'closeflow-scaled-desktop-shell-stage148.css',
].forEach((marker) => mustNotInclude('src/App.tsx', marker));

mustNotInclude('src/components/Layout.tsx', 'ShellDesktopViewportRuntime');
mustInclude('src/components/Layout.tsx', 'data-shell-sidebar="true"');
mustInclude('src/components/Layout.tsx', 'data-shell-main="true"');
mustInclude('src/components/Layout.tsx', 'data-shell-content="true"');

const css = 'src/styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';
[
  'CLOSEFLOW_STAGE149_CLEAN_DESKTOP_APP_SHELL_CANVAS',
  '--closeflow-stage149-clean-desktop-app-shell-canvas: "active"',
  '--cf149-min-canvas-width: 1280px',
  'grid-template-columns: var(--cf149-sidebar-width) minmax(0, 1fr)',
  'min-width: var(--cf149-min-canvas-width) !important',
  'transform: none !important',
  '.view.active[data-shell-content="true"]',
  '.main-leads-html',
  '.main-clients-html',
  '.main-cases-html',
  '[data-p0-today-stable-rebuild="true"]',
  '[data-p0-tasks-stable-rebuild="true"]',
  '.activity-vnext-shell',
].forEach((marker) => mustInclude(css, marker));

mustInclude('_project/STAGE149_CLEAN_DESKTOP_APP_SHELL_CANVAS_REPORT.md', 'clean desktop app shell');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage149 clean desktop app shell canvas.md', 'Stage149');

console.log('OK: Stage149 clean desktop app shell canvas guard passed.');
