/* CLOSEFLOW_STAGE152_DENSE_CARDS_80_PERCENT_TARGET_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';");
mustInclude('src/App.tsx', "import './styles/closeflow-dense-cards-80-percent-target-stage152.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-compact-cards-source-truth-stage151.css")) {
  if (app.indexOf("closeflow-dense-cards-80-percent-target-stage152.css") < app.indexOf("closeflow-compact-cards-source-truth-stage151.css")) {
    throw new Error('Stage152 CSS import must be after Stage151 CSS import.');
  }
}

const css = 'src/styles/closeflow-dense-cards-80-percent-target-stage152.css';
[
  'CLOSEFLOW_STAGE152_DENSE_CARDS_80_PERCENT_TARGET',
  '--closeflow-stage152-dense-cards-80-percent-target: "active"',
  '--cf152-density-target: "80-percent-visual-density-without-browser-zoom"',
  '--cf152-card-pad-y: 8px',
  '--cf152-card-pad-x: 14px',
  '--cf152-card-gap: 10px',
  '--cf152-kpi-min-height: 46px',
  '--cf152-panel-min-height: 44px',
  '--cf152-list-row-min-height: 52px',
  '--cf152-side-card-min-height: 40px',
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

mustInclude('docs/ui/CLOSEFLOW_STAGE152_DENSE_CARDS_80_PERCENT_TARGET.md', 'Stage152 targets the 70-80% browser zoom density without using browser zoom');
mustInclude('_project/STAGE152_DENSE_CARDS_80_PERCENT_TARGET_REPORT.md', 'stronger compactness pass');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage152 dense cards 80 percent target.md', 'Stage152');

console.log('OK: Stage152 dense cards 80 percent target guard passed.');
