const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-cf-modal-surface-lower-smaller-stage162.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-cf-modal-surface-center-fix-stage161.css")) {
  if (app.indexOf("closeflow-cf-modal-surface-lower-smaller-stage162.css") < app.indexOf("closeflow-cf-modal-surface-center-fix-stage161.css")) {
    throw new Error('Stage162 CSS import must be after Stage161 CSS import.');
  }
}

const css = 'src/styles/closeflow-cf-modal-surface-lower-smaller-stage162.css';
[
  'CLOSEFLOW_STAGE162_CF_MODAL_SURFACE_LOWER_SMALLER_SOURCE_TRUTH',
  '--closeflow-stage162-cf-modal-surface-lower-smaller-source-truth: "active"',
  '--cf162-modal-visual-width: 620px',
  '--cf162-modal-visual-max-height: 76vh',
  '--cf162-modal-center-y-vh: 56vh',
  '--cf162-modal-logical-center-y',
  'body .cf-modal-surface[role="dialog"]',
  'left: var(--cf162-modal-logical-center-x) !important',
  'top: var(--cf162-modal-logical-center-y) !important',
  '.event-form-vnext',
  '.cf-modal-footer',
  '.event-form-footer'
].forEach((m) => mustInclude(css, m));

mustInclude('docs/ui/CLOSEFLOW_STAGE162_CF_MODAL_SURFACE_LOWER_SMALLER_SOURCE_TRUTH.md', 'lower and smaller');
mustInclude('_project/STAGE162_CF_MODAL_SURFACE_LOWER_SMALLER_SOURCE_TRUTH_REPORT.md', 'niżej');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage162 cf modal lower smaller source truth.md', 'Stage162');

console.log('OK: Stage162 cf-modal-surface lower smaller source truth guard passed.');
