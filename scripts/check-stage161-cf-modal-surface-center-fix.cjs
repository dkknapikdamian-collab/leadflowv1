const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
mustInclude('src/App.tsx', "import './styles/closeflow-cf-modal-surface-center-fix-stage161.css';");
const css = 'src/styles/closeflow-cf-modal-surface-center-fix-stage161.css';
[
  'CLOSEFLOW_STAGE161_CF_MODAL_SURFACE_CENTER_FIX',
  '--closeflow-stage161-cf-modal-surface-center-fix: "active"',
  '--cf161-modal-z: 2147483600',
  '--cf161-modal-visual-width: 680px',
  '--cf161-modal-logical-center-x',
  'body .cf-modal-surface[role="dialog"]',
  'left: var(--cf161-modal-logical-center-x) !important',
  'top: var(--cf161-modal-logical-center-y) !important',
  'transform: translate(-50%, -50%) !important',
  '.event-form-vnext',
  '.cf-modal-footer',
  '.event-form-footer'
].forEach((m) => mustInclude(css, m));
mustInclude('docs/ui/CLOSEFLOW_STAGE161_CF_MODAL_SURFACE_CENTER_FIX.md', 'cf-modal-surface');
mustInclude('_project/STAGE161_CF_MODAL_SURFACE_CENTER_FIX_REPORT.md', 'left: -104');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage161 cf modal surface center fix.md', 'Stage161');
console.log('OK: Stage161 cf-modal-surface center fix guard passed.');
