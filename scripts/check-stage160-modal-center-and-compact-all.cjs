/* CLOSEFLOW_STAGE160_MODAL_CENTER_AND_COMPACT_ALL_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-modal-center-and-compact-all-stage160.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-overlay-real-density-and-footer-stage159.css")) {
  if (app.indexOf("closeflow-modal-center-and-compact-all-stage160.css") < app.indexOf("closeflow-overlay-real-density-and-footer-stage159.css")) {
    throw new Error('Stage160 CSS import must be after Stage159 CSS import.');
  }
}

const css = 'src/styles/closeflow-modal-center-and-compact-all-stage160.css';
[
  'CLOSEFLOW_STAGE160_MODAL_CENTER_AND_COMPACT_ALL',
  '--closeflow-stage160-modal-center-and-compact-all: "active"',
  '--cf160-modal-visual-width: 720px',
  '--cf160-modal-logical-center-x: calc(50vw * var(--cf157-page-zoom-inverse, 1.25))',
  '--cf160-modal-logical-center-y: calc(50vh * var(--cf157-page-zoom-inverse, 1.25))',
  '#root > .app.closeflow-visual-stage01.cf-html-shell :is(',
  'left: var(--cf160-modal-logical-center-x) !important',
  'top: var(--cf160-modal-logical-center-y) !important',
  'body > :not(#root) :is(',
  'left: 50vw !important',
  'top: 50vh !important',
  'transform: translate(-50%, -50%) !important',
  'width: min(var(--cf160-modal-logical-width), var(--cf160-modal-logical-max-width)) !important',
  'width: min(var(--cf160-modal-visual-width), var(--cf160-modal-visual-max-width)) !important',
  'form > :is(div, section, footer):has(button[type="submit"])',
  'position: sticky !important',
  '[role="dialog"]',
  '[data-radix-dialog-content]',
  '[data-radix-alert-dialog-content]',
].forEach((marker) => mustInclude(css, marker));

mustInclude('docs/ui/CLOSEFLOW_STAGE160_MODAL_CENTER_AND_COMPACT_ALL.md', 'inside Stage157 zoomed app');
mustInclude('_project/STAGE160_MODAL_CENTER_AND_COMPACT_ALL_REPORT.md', 'mniejsze i na środku');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage160 modal center and compact all.md', 'Stage160');

console.log('OK: Stage160 modal center and compact all guard passed.');
