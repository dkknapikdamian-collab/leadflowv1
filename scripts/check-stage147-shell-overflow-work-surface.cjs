/* CLOSEFLOW_STAGE147_SHELL_OVERFLOW_AND_WORK_SURFACE_REPAIR_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-shell-overflow-work-surface-stage147.css';");

const css = 'src/styles/closeflow-shell-overflow-work-surface-stage147.css';
[
  'CLOSEFLOW_STAGE147_SHELL_OVERFLOW_AND_WORK_SURFACE_REPAIR',
  '--closeflow-stage147-shell-overflow-and-work-surface-repair: "active"',
  '--cf147-work-overrun',
  'overflow-x: visible !important',
  'clip-path: none !important',
  'contain: none !important',
  'width: calc(100% + var(--cf147-work-overrun)) !important',
  '@media (max-width: 700px) and (hover: hover) and (pointer: fine)',
  '.view.active[data-shell-content="true"]',
  '[data-shell-content="true"][data-cf-shell-content-stage145="true"]',
  '.cf-route-work-root',
  '[data-p0-today-stable-rebuild="true"]',
  '[data-p0-tasks-stable-rebuild="true"]',
  '.main-clients-html',
  '.main-leads-html',
  '.main-cases-html',
  '.main-calendar-html',
  '.main-templates-html',
  '.activity-vnext-shell',
  'grid-template-columns: minmax(0, 1fr) minmax(344px, var(--cf147-right-rail-width))',
].forEach((marker) => mustInclude(css, marker));

mustInclude('_project/STAGE147_SHELL_OVERFLOW_AND_WORK_SURFACE_REPAIR_REPORT.md', 'overflow');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage147 shell overflow and work surface repair.md', 'Stage147');

console.log('OK: Stage147 shell overflow and work surface repair guard passed.');
