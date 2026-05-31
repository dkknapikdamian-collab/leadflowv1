/* CLOSEFLOW_STAGE151_COMPACT_CARDS_SOURCE_TRUTH_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';");
mustInclude('src/App.tsx', "import './styles/closeflow-compact-cards-source-truth-stage151.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-panel-typography-and-width-source-truth-stage150.css")) {
  if (app.indexOf("closeflow-compact-cards-source-truth-stage151.css") < app.indexOf("closeflow-panel-typography-and-width-source-truth-stage150.css")) {
    throw new Error('Stage151 CSS import must be after Stage150 CSS import.');
  }
} else if (app.indexOf("closeflow-compact-cards-source-truth-stage151.css") < app.indexOf("closeflow-clean-desktop-app-shell-canvas-stage149.css")) {
  throw new Error('Stage151 CSS import must be after Stage149 CSS import.');
}

const css = 'src/styles/closeflow-compact-cards-source-truth-stage151.css';
[
  'CLOSEFLOW_STAGE151_COMPACT_CARDS_SOURCE_TRUTH',
  '--closeflow-stage151-compact-cards-source-truth: "active"',
  '--cf151-card-source-truth: "global-panel-cards"',
  '--cf151-card-pad-y: 12px',
  '--cf151-card-pad-x: 18px',
  '--cf151-kpi-min-height: 58px',
  '--cf151-panel-min-height: 54px',
  '--cf151-list-row-min-height: 64px',
  '#root .view.active[data-shell-content="true"]',
  '.main-leads-html',
  '.main-clients-html',
  '.main-cases-html',
  '[data-p0-today-stable-rebuild="true"]',
  '[data-p0-tasks-stable-rebuild="true"]',
  '.lead-right-rail',
  '.clients-right-rail',
  '.cases-right-rail',
].forEach((marker) => mustInclude(css, marker));

mustInclude('docs/ui/CLOSEFLOW_STAGE151_COMPACT_CARDS_SOURCE_TRUTH.md', 'Every card-size correction must have its own guard');
mustInclude('_project/STAGE151_COMPACT_CARDS_SOURCE_TRUTH_REPORT.md', 'compact all cards');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage151 compact cards source truth.md', 'Stage151');

console.log('OK: Stage151 compact cards source truth guard passed.');
