/* CLOSEFLOW_STAGE139_UNIFIED_DESKTOP_CANVAS_AND_RIGHT_STRETCH_GUARD */
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

mustInclude('src/App.tsx', "import './styles/closeflow-unified-desktop-canvas-stage139.css';");
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', 'CLOSEFLOW_STAGE139_UNIFIED_DESKTOP_CANVAS_AND_RIGHT_STRETCH');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '--closeflow-stage139-unified-desktop-canvas-and-right-stretch: "active"');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '--cf139-canvas-bg: #f3f6fb');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '--cf139-left-gutter: 8px');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '--cf139-right-gutter: 10px');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', 'background: var(--cf139-canvas-bg) !important');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', 'width: calc(100vw - var(--cf139-sidebar-width) - var(--cf139-left-gutter) - var(--cf139-right-gutter)) !important');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', 'max-width: none !important');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', 'margin-left: var(--cf139-left-gutter) !important');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', 'margin-right: var(--cf139-right-gutter) !important');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '[data-shell-main]');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '[data-shell-content]');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '.view.active');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '.main-clients-html');
mustInclude('src/styles/closeflow-unified-desktop-canvas-stage139.css', '.activity-vnext-shell');

mustInclude('_project/STAGE139_UNIFIED_DESKTOP_CANVAS_AND_RIGHT_STRETCH_REPORT.md', 'różnica kolorów');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage139 unified desktop canvas and right stretch.md', 'Stage139');

console.log('OK: Stage139 unified desktop canvas and right stretch guard passed.');
