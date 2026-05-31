/* CLOSEFLOW_STAGE146_FLUID_WORK_SURFACE_GUARD */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-fluid-work-surface-stage146.css';");

const css = 'src/styles/closeflow-fluid-work-surface-stage146.css';
[
  'CLOSEFLOW_STAGE146_FLUID_WORK_SURFACE',
  '--closeflow-stage146-fluid-work-surface: "active"',
  '@media (hover: hover) and (pointer: fine)',
  '--cf146-work-extension',
  'calc(100% + var(--cf146-work-extension))',
  'calc(100vw - var(--cf146-work-left-gutter)',
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
  'grid-template-columns: minmax(0, 1fr) minmax(336px, var(--cf146-right-rail-width))',
].forEach((marker) => mustInclude(css, marker));

mustInclude('_project/STAGE146_FLUID_WORK_SURFACE_REPORT.md', 'fluid work surface');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage146 fluid work surface.md', 'Stage146');

console.log('OK: Stage146 fluid work surface guard passed.');
