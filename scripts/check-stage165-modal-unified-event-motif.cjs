const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-modal-unified-event-motif-source-truth-stage165.css';");
mustInclude('src/components/ui/dialog.tsx', 'data-closeflow-modal-visual-system="true"');
mustInclude('src/components/ui/dialog.tsx', 'cf-modal-surface');

const app = read('src/App.tsx');
if (app.includes("closeflow-cf-modal-top-anchor-light-surface-stage164.css")) {
  if (app.indexOf("closeflow-modal-unified-event-motif-source-truth-stage165.css") < app.indexOf("closeflow-cf-modal-top-anchor-light-surface-stage164.css")) {
    throw new Error('Stage165 CSS import must be after Stage164 CSS import.');
  }
}

const css = 'src/styles/closeflow-modal-unified-event-motif-source-truth-stage165.css';
[
  'CLOSEFLOW_STAGE165_MODAL_UNIFIED_EVENT_MOTIF_SOURCE_TRUTH',
  '--closeflow-stage165-modal-unified-event-motif-source-truth: "active"',
  '--cf165-modal-visual-width: 600px',
  '--cf165-modal-bg: #0b1220',
  '[data-closeflow-modal-visual-system="true"].cf-modal-surface',
  'left: calc(50vw + var(--cf165-modal-work-center-shift-x)) !important',
  'top: var(--cf165-modal-top-offset) !important',
  'transform: translateX(-50%) !important',
  'max-height: var(--cf165-modal-max-height) !important',
  '.cf-modal-header',
  '.cf-modal-footer',
  'form > :is(div, section, footer):has(button[type="submit"])',
  '--cf165-footer-safe-space'
].forEach((m) => mustInclude(css, m));

mustInclude('docs/ui/CLOSEFLOW_STAGE165_MODAL_UNIFIED_EVENT_MOTIF_SOURCE_TRUTH.md', 'data-closeflow-modal-visual-system');
mustInclude('_project/STAGE165_MODAL_UNIFIED_EVENT_MOTIF_SOURCE_TRUTH_REPORT.md', 'każde okienko wygląda inaczej');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage165 modal unified event motif source truth.md', 'Stage165');

console.log('OK: Stage165 modal unified event motif source truth guard passed.');
