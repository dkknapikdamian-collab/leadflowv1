const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
mustInclude('src/App.tsx', "import './styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css';");
mustInclude('src/components/ui/dialog.tsx', 'data-closeflow-modal-visual-system="true"');
mustInclude('src/components/ui/dialog.tsx', 'cf-modal-surface');
const app = read('src/App.tsx');
if (app.includes("closeflow-modal-unified-event-motif-source-truth-stage165.css")) {
  if (app.indexOf("closeflow-modal-footer-in-flow-no-overlay-stage166.css") < app.indexOf("closeflow-modal-unified-event-motif-source-truth-stage165.css")) {
    throw new Error('Stage166 CSS import must be after Stage165 CSS import.');
  }
}
const css = 'src/styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css';
[
  'CLOSEFLOW_STAGE166_MODAL_FOOTER_IN_FLOW_NO_OVERLAY',
  '--closeflow-stage166-modal-footer-in-flow-no-overlay: "active"',
  '[data-closeflow-modal-visual-system="true"].cf-modal-surface',
  '.cf-modal-footer',
  '.event-form-footer',
  'form > :is(div, section, footer):has(button[type="submit"])',
  'position: static !important',
  'bottom: auto !important',
  'background: transparent !important',
  'box-shadow: none !important'
].forEach((m) => mustInclude(css, m));
mustInclude('docs/ui/CLOSEFLOW_STAGE166_MODAL_FOOTER_IN_FLOW_NO_OVERLAY.md', 'normal document flow');
mustInclude('_project/STAGE166_MODAL_FOOTER_IN_FLOW_NO_OVERLAY_REPORT.md', 'footer/submit row floats');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage166 modal footer in flow no overlay.md', 'Stage166');
console.log('OK: Stage166 modal footer in-flow no-overlay guard passed.');
