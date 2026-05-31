/* CLOSEFLOW_STAGE137_DESKTOP_CONTENT_SHELL_FIX_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) {
    throw new Error(`${rel} missing marker: ${marker}`);
  }
}

mustInclude('src/App.tsx', "import './styles/closeflow-desktop-content-shell-stage137.css';");
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', 'CLOSEFLOW_STAGE137_DESKTOP_CONTENT_SHELL_FIX');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '--closeflow-stage137-desktop-content-shell-fix: "active"');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '@media (min-width: 1280px)');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '[data-shell-main]');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '[data-shell-content]');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '.view.active');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '.main-clients-html');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '.main-leads-html');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '.main-cases-html');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '.main-calendar-html');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '.main-templates-html');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '[data-a13-template-style="response-templates-v2"]');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '[data-p0-tasks-stable-rebuild="true"]');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '.activity-vnext-shell');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', '.activity-main-column');
mustInclude('src/styles/closeflow-desktop-content-shell-stage137.css', 'grid-template-columns: minmax(0, 1fr) minmax(320px, var(--cf137-rail-width))');

mustInclude('_project/STAGE137_DESKTOP_CONTENT_SHELL_FIX_REPORT.md', 'Stage136 nie wystarczył');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage137 desktop content shell fix.md', 'Stage137');

console.log('OK: Stage137 desktop content shell fix guard passed.');
