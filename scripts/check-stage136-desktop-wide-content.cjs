/* CLOSEFLOW_STAGE136_DESKTOP_WIDE_CONTENT_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-desktop-wide-content-stage136.css';");
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', 'CLOSEFLOW_STAGE136_DESKTOP_WIDE_CONTENT_SOURCE_TRUTH');
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', '@media (min-width: 1280px)');
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', '--cf136-desktop-content-max: 1640px');
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', '.main-clients-html');
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', '.main-leads-html');
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', '.main-cases-html');
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', '.main-calendar-html');
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', '.activity-vnext-page');
mustInclude('src/styles/closeflow-desktop-wide-content-stage136.css', 'grid-template-columns: minmax(0, 1fr) minmax(300px, var(--cf136-desktop-rail-width))');

mustInclude('_project/STAGE136_DESKTOP_WIDE_CONTENT_REPORT.md', 'desktop-wide');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage136 desktop wide content.md', 'Stage136');

console.log('OK: Stage136 desktop wide content guard passed.');
