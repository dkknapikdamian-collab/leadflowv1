/* CLOSEFLOW_STAGE158_OVERLAY_PORTAL_DENSITY_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-overlay-portal-density-stage158.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-viewport-zoom-80-source-truth-stage157.css")) {
  if (app.indexOf("closeflow-overlay-portal-density-stage158.css") < app.indexOf("closeflow-viewport-zoom-80-source-truth-stage157.css")) {
    throw new Error('Stage158 CSS import must be after Stage157 CSS import.');
  }
}

const css = 'src/styles/closeflow-overlay-portal-density-stage158.css';
[
  'CLOSEFLOW_STAGE158_OVERLAY_PORTAL_DENSITY_SOURCE_TRUTH',
  '--closeflow-stage158-overlay-portal-density-source-truth: "active"',
  '--cf158-overlay-scale: var(--cf157-page-zoom, 0.80)',
  '--cf158-overlay-inverse-scale: var(--cf157-page-zoom-inverse, 1.25)',
  'body :is(',
  '[role="dialog"]',
  '[data-radix-dialog-content]',
  '[data-radix-alert-dialog-content]',
  '[data-radix-popper-content-wrapper]',
  '[data-radix-popover-content]',
  '[data-radix-dropdown-menu-content]',
  '[data-radix-select-content]',
  '[data-sonner-toast]',
  '.bug-note-recorder',
  '[data-bug-note-recorder]',
  'zoom: var(--cf158-overlay-scale) !important',
  'zoom: 1 !important',
].forEach((marker) => mustInclude(css, marker));

mustInclude('docs/ui/CLOSEFLOW_STAGE158_OVERLAY_PORTAL_DENSITY_SOURCE_TRUTH.md', 'Portaled overlays');
mustInclude('_project/STAGE158_OVERLAY_PORTAL_DENSITY_SOURCE_TRUTH_REPORT.md', 'dialogs/modals/popovers');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage158 overlay portal density source truth.md', 'Stage158');

console.log('OK: Stage158 overlay portal density guard passed.');
