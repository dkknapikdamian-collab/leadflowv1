/* CLOSEFLOW_STAGE141_SHARED_WORK_WIDTH_FRAME_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

const css = 'src/styles/closeflow-shared-work-width-frame-stage141.css';

mustInclude('src/components/Layout.tsx', 'data-cf-work-width-frame="true"');
mustInclude('src/components/Layout.tsx', 'cf-work-width-frame');
mustInclude('src/components/Layout.tsx', 'data-cf-work-width-section={currentSection}');
mustInclude('src/App.tsx', "import './styles/closeflow-shared-work-width-frame-stage141.css';");

mustInclude(css, 'CLOSEFLOW_STAGE141_SHARED_WORK_WIDTH_FRAME');
mustInclude(css, '--closeflow-stage141-shared-work-width-frame: "active"');
mustInclude(css, '--cf141-work-width: 1440px');
mustInclude(css, '--cf141-work-width-wide: 1480px');
mustInclude(css, '.cf-work-width-frame[data-cf-work-width-frame="true"]');
mustInclude(css, '[data-p0-today-stable-rebuild="true"]');
mustInclude(css, '.main-leads-html');
mustInclude(css, '.main-clients-html');
mustInclude(css, '.main-cases-html');
mustInclude(css, '.main-calendar-html');
mustInclude(css, '.main-templates-html');
mustInclude(css, '[data-p0-tasks-stable-rebuild="true"]');
mustInclude(css, '[data-a13-template-style="response-templates-v2"]');
mustInclude(css, '.activity-vnext-shell');
mustInclude(css, 'grid-template-columns: minmax(0, 1fr) minmax(336px, var(--cf141-right-rail-width))');

mustInclude('_project/STAGE141_SHARED_WORK_WIDTH_FRAME_REPORT.md', 'jeden realny wrapper');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage141 shared work width frame.md', 'Stage141');

console.log('OK: Stage141 shared work width frame guard passed.');
