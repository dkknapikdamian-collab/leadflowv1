const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-cf-modal-main-center-tall-compact-stage163.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-cf-modal-surface-lower-smaller-stage162.css")) {
  if (app.indexOf("closeflow-cf-modal-main-center-tall-compact-stage163.css") < app.indexOf("closeflow-cf-modal-surface-lower-smaller-stage162.css")) {
    throw new Error('Stage163 CSS import must be after Stage162 CSS import.');
  }
}

const css = 'src/styles/closeflow-cf-modal-main-center-tall-compact-stage163.css';
[
  'CLOSEFLOW_STAGE163_CF_MODAL_MAIN_CENTER_TALL_COMPACT',
  '--closeflow-stage163-cf-modal-main-center-tall-compact: "active"',
  '--cf163-modal-visual-width: 560px',
  '--cf163-modal-main-center-shift-x',
  '--cf163-modal-center-y-vh: 55vh',
  '--cf163-event-visual-height: 84vh',
  '--cf163-modal-logical-center-x: calc((50vw + var(--cf163-modal-main-center-shift-x))',
  'body .cf-modal-surface[role="dialog"]',
  'left: var(--cf163-modal-logical-center-x) !important',
  'top: var(--cf163-modal-logical-center-y) !important',
  ':has(.event-form-vnext)',
  'height: min(var(--cf163-event-logical-height)',
  'padding-bottom: var(--cf163-footer-safe-space) !important',
  '.cf-modal-footer',
  '.event-form-footer'
].forEach((m) => mustInclude(css, m));

mustInclude('docs/ui/CLOSEFLOW_STAGE163_CF_MODAL_MAIN_CENTER_TALL_COMPACT.md', 'work-area center');
mustInclude('_project/STAGE163_CF_MODAL_MAIN_CENTER_TALL_COMPACT_REPORT.md', 'wyższe niż szersze');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage163 cf modal main center tall compact.md', 'Stage163');

console.log('OK: Stage163 cf-modal main-center tall compact guard passed.');
