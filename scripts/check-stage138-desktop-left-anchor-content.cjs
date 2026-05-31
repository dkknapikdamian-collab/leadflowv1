/* CLOSEFLOW_STAGE138_DESKTOP_LEFT_ANCHOR_CONTENT_GUARD */
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

mustInclude('src/App.tsx', "import './styles/closeflow-desktop-left-anchor-content-stage138.css';");
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', 'CLOSEFLOW_STAGE138_DESKTOP_LEFT_ANCHOR_CONTENT');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '--closeflow-stage138-desktop-left-anchor-content: "active"');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '--cf138-sidebar-width: 240px');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '--cf138-left-gutter: 16px');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '@media (min-width: 1280px) and (hover: hover) and (pointer: fine)');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', 'margin-left: var(--cf138-left-gutter) !important');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', 'margin-right: auto !important');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '[data-shell-content]');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '.view.active');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '.main-clients-html');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '.main-leads-html');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '.main-cases-html');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', '.activity-vnext-shell');
mustInclude('src/styles/closeflow-desktop-left-anchor-content-stage138.css', 'grid-template-columns: minmax(0, 1fr) minmax(326px, var(--cf138-right-rail-width))');

mustInclude('_project/STAGE138_DESKTOP_LEFT_ANCHOR_CONTENT_REPORT.md', 'przy panelu bocznym');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage138 desktop left anchor content.md', 'Stage138');

console.log('OK: Stage138 desktop left anchor content guard passed.');
