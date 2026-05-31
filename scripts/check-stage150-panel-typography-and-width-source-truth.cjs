/* CLOSEFLOW_STAGE150_PANEL_TYPOGRAPHY_AND_WIDTH_SOURCE_TRUTH_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';");
mustInclude('src/App.tsx', "import './styles/closeflow-panel-typography-and-width-source-truth-stage150.css';");

const app = read('src/App.tsx');
if (app.indexOf("closeflow-panel-typography-and-width-source-truth-stage150.css") < app.indexOf("closeflow-clean-desktop-app-shell-canvas-stage149.css")) {
  throw new Error('Stage150 CSS import must be after Stage149 CSS import.');
}

const css = 'src/styles/closeflow-panel-typography-and-width-source-truth-stage150.css';
[
  'CLOSEFLOW_STAGE150_PANEL_TYPOGRAPHY_AND_WIDTH_SOURCE_TRUTH',
  '--closeflow-stage150-panel-typography-and-width-source-truth: "active"',
  '--cf150-width-source-truth: "stage149-clean-desktop-app-shell-canvas"',
  '--cf150-text-body: 12.5px',
  '--cf150-text-control: 12px',
  '--cf150-text-card-title: 13px',
  '--cf150-text-kpi-value: 22px',
  '#root .view.active[data-shell-content="true"]',
  '.main-leads-html',
  '.main-clients-html',
  '.main-cases-html',
  '.main-calendar-html',
  '.main-templates-html',
  '.activity-vnext-shell',
].forEach((marker) => mustInclude(css, marker));

mustInclude('docs/ui/CLOSEFLOW_STAGE150_PANEL_VISUAL_SOURCE_TRUTH.md', 'Stage149 is the width source truth');
mustInclude('_project/STAGE150_PANEL_TYPOGRAPHY_AND_WIDTH_SOURCE_TRUTH_REPORT.md', 'single width source truth');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage150 panel typography and width source truth.md', 'Stage150');

console.log('OK: Stage150 panel typography and width source truth guard passed.');
