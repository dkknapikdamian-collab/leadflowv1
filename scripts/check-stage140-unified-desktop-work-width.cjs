/* CLOSEFLOW_STAGE140_UNIFIED_DESKTOP_WORK_WIDTH_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

const css = 'src/styles/closeflow-unified-desktop-work-width-stage140.css';

mustInclude('src/App.tsx', "import './styles/closeflow-unified-desktop-work-width-stage140.css';");
mustInclude(css, 'CLOSEFLOW_STAGE140_UNIFIED_DESKTOP_WORK_WIDTH');
mustInclude(css, '--closeflow-stage140-unified-desktop-work-width: "active"');
mustInclude(css, '--cf140-unified-work-width: 1440px');
mustInclude(css, '--cf140-wide-work-width: 1480px');
mustInclude(css, '--cf140-left-gutter: 8px');
mustInclude(css, '[data-p0-today-stable-rebuild="true"]');
mustInclude(css, '.main-leads-html');
mustInclude(css, '.main-clients-html');
mustInclude(css, '.main-cases-html');
mustInclude(css, '.main-calendar-html');
mustInclude(css, '.main-templates-html');
mustInclude(css, '[data-a13-template-style="response-templates-v2"]');
mustInclude(css, '[data-p0-tasks-stable-rebuild="true"]');
mustInclude(css, '.activity-vnext-shell');
mustInclude(css, 'margin-left: var(--cf140-left-gutter) !important');
mustInclude(css, 'margin-right: auto !important');
mustInclude(css, 'grid-template-columns: minmax(0, 1fr) minmax(336px, var(--cf140-right-rail-width))');

mustInclude('_project/STAGE140_UNIFIED_DESKTOP_WORK_WIDTH_REPORT.md', 'pod akcję topbara');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage140 unified desktop work width.md', 'Stage140');

console.log('OK: Stage140 unified desktop work width guard passed.');
