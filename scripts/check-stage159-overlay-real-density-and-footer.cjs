/* CLOSEFLOW_STAGE159_OVERLAY_REAL_DENSITY_AND_FOOTER_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-overlay-real-density-and-footer-stage159.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-overlay-portal-density-stage158.css")) {
  if (app.indexOf("closeflow-overlay-real-density-and-footer-stage159.css") < app.indexOf("closeflow-overlay-portal-density-stage158.css")) {
    throw new Error('Stage159 CSS import must be after Stage158 CSS import so it can override Stage158 dialog zoom.');
  }
}

const css = 'src/styles/closeflow-overlay-real-density-and-footer-stage159.css';
[
  'CLOSEFLOW_STAGE159_OVERLAY_REAL_DENSITY_AND_FOOTER_FIX',
  '--closeflow-stage159-overlay-real-density-and-footer-fix: "active"',
  '--cf159-dialog-width: min(860px, calc(100vw - 48px))',
  '--cf159-dialog-max-height: calc(100vh - 44px)',
  '--cf159-control-height: 34px',
  'zoom: 1 !important',
  'position: fixed !important',
  'left: 50% !important',
  'top: 50% !important',
  'transform: translate(-50%, -50%) !important',
  'display: flex !important',
  'flex-direction: column !important',
  'overflow: hidden !important',
  'overflow-y: auto !important',
  'form > :is(div, section, footer):has(button[type="submit"])',
  'order: 999 !important',
  'position: sticky !important',
  'bottom: 0 !important',
  '[role="dialog"]',
  '[data-radix-dialog-content]',
  '[data-radix-alert-dialog-content]',
].forEach((marker) => mustInclude(css, marker));

mustInclude('docs/ui/CLOSEFLOW_STAGE159_OVERLAY_REAL_DENSITY_AND_FOOTER_FIX.md', 'Stage159 intentionally overrides Stage158 dialog zoom');
mustInclude('_project/STAGE159_OVERLAY_REAL_DENSITY_AND_FOOTER_FIX_REPORT.md', 'Nowy lead');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage159 overlay real density and footer fix.md', 'Stage159');

console.log('OK: Stage159 overlay real density and footer guard passed.');
