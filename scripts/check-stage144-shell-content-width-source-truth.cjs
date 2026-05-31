/* CLOSEFLOW_STAGE144_SHELL_CONTENT_WIDTH_SOURCE_TRUTH_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

const css = 'src/styles/closeflow-shell-content-width-source-truth-stage144.css';

mustInclude('src/App.tsx', "import './styles/closeflow-shell-content-width-source-truth-stage144.css';");
mustInclude('src/components/Layout.tsx', 'data-shell-content="true"');

[
  'CLOSEFLOW_STAGE144_SHELL_CONTENT_WIDTH_SOURCE_TRUTH',
  '--closeflow-stage144-shell-content-width-source-truth: "active"',
  '--cf144-work-width: 1480px',
  '.view.active[data-shell-content="true"]',
  '[data-shell-content="true"]',
  'width: min(',
  'calc(100vw - var(--cf144-sidebar-width)',
  '[data-shell-content="true"] > [data-cf-work-width-frame="true"]',
  '.main-clients-html',
  '.main-leads-html',
  '.main-cases-html',
  '[data-p0-today-stable-rebuild="true"]',
  '[data-p0-tasks-stable-rebuild="true"]',
  '.activity-vnext-shell',
].forEach((marker) => mustInclude(css, marker));

mustInclude('_project/STAGE144_SHELL_CONTENT_WIDTH_SOURCE_TRUTH_REPORT.md', 'width=262');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage144 shell content width source truth.md', 'Stage144');

console.log('OK: Stage144 shell content width source truth guard passed.');
