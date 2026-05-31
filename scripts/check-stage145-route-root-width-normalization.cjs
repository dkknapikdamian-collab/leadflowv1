/* CLOSEFLOW_STAGE145_ROUTE_ROOT_WIDTH_NORMALIZATION_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
function mustNotInclude(rel, marker) {
  const content = read(rel);
  if (content.includes(marker)) throw new Error(`${rel} must not include: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-route-root-width-normalization-stage145.css';");
mustInclude('src/components/Layout.tsx', 'data-cf-shell-content-stage145="true"');
mustNotInclude('src/components/Layout.tsx', 'data-cf-work-width-frame="true"');

mustInclude('src/pages/TodayStable.tsx', 'className="cf-route-work-root flex w-full flex-col gap-6 p-4 sm:p-6"');
mustNotInclude('src/pages/TodayStable.tsx', 'className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6"');

mustInclude('src/pages/TasksStable.tsx', 'className="cf-route-work-root flex w-full flex-col gap-5 p-4 sm:p-6"');
mustNotInclude('src/pages/TasksStable.tsx', 'className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 sm:p-6"');

mustInclude('src/pages/ResponseTemplates.tsx', 'cf-html-view cf-route-work-root flex w-full');
mustInclude('src/pages/Templates.tsx', 'cf-html-view main-templates-html cf-route-work-root flex w-full');

const css = 'src/styles/closeflow-route-root-width-normalization-stage145.css';
[
  'CLOSEFLOW_STAGE145_ROUTE_ROOT_WIDTH_NORMALIZATION',
  '--closeflow-stage145-route-root-width-normalization: "active"',
  'grid-template-columns: var(--cf145-sidebar-width) minmax(0, 1fr)',
  'data-cf-shell-content-stage145',
  '.cf-route-work-root',
  '[data-p0-today-stable-rebuild="true"]',
  '[data-p0-tasks-stable-rebuild="true"]',
  '.main-clients-html',
  '.main-leads-html',
  '.main-cases-html',
  '.main-calendar-html',
  '.main-templates-html',
  '.activity-vnext-shell',
].forEach((marker) => mustInclude(css, marker));

mustInclude('_project/STAGE145_ROUTE_ROOT_WIDTH_NORMALIZATION_REPORT.md', 'route-root');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage145 route root width normalization.md', 'Stage145');

console.log('OK: Stage145 route root width normalization guard passed.');
