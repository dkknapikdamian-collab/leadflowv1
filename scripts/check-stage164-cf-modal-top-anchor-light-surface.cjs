const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-cf-modal-main-center-tall-compact-stage163.css")) {
  if (app.indexOf("closeflow-cf-modal-top-anchor-light-surface-stage164.css") < app.indexOf("closeflow-cf-modal-main-center-tall-compact-stage163.css")) {
    throw new Error('Stage164 CSS import must be after Stage163 CSS import.');
  }
}

const css = 'src/styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css';
[
  'CLOSEFLOW_STAGE164_CF_MODAL_TOP_ANCHOR_LIGHT_SURFACE',
  '--closeflow-stage164-cf-modal-top-anchor-light-surface: "active"',
  '--cf164-modal-top-offset: 86px',
  '--cf164-modal-bg: #ffffff',
  '--cf164-modal-logical-top',
  'transform: translateX(-50%) !important',
  'body .cf-modal-surface[role="dialog"]',
  'top: var(--cf164-modal-logical-top) !important',
  'background: var(--cf164-modal-bg) !important',
  'color: var(--cf164-modal-fg) !important',
  ':has(.event-form-vnext)',
  'height: min(var(--cf164-event-logical-height)',
  '.cf-modal-footer',
  '.event-form-footer'
].forEach((m) => mustInclude(css, m));

mustInclude('docs/ui/CLOSEFLOW_STAGE164_CF_MODAL_TOP_ANCHOR_LIGHT_SURFACE.md', 'top-anchored');
mustInclude('_project/STAGE164_CF_MODAL_TOP_ANCHOR_LIGHT_SURFACE_REPORT.md', 'czarne tło');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage164 cf modal top anchor light surface.md', 'Stage164');

console.log('OK: Stage164 cf-modal top-anchor light-surface guard passed.');
