/* CLOSEFLOW_STAGE156_REAL_DENSITY_TOKENS_NO_ZOOM_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
function mustNotInclude(rel, marker) {
  const content = read(rel);
  if (content.includes(marker)) throw new Error(`${rel} must not include marker: ${marker}`);
}
function mustNotExist(rel) {
  if (exists(rel)) throw new Error(`${rel} must not exist after Stage156`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';");
mustInclude('src/App.tsx', "import './styles/closeflow-real-density-tokens-no-zoom-stage156.css';");
mustNotInclude('src/App.tsx', "import './styles/closeflow-panel-zoom-density-stage153.css';");
mustNotInclude('src/App.tsx', "import './styles/closeflow-revert-global-zoom-keep-card-density-stage154.css';");
mustNotInclude('src/App.tsx', "import './styles/closeflow-main-panel-density-scale-stage155.css';");

mustNotInclude('src/components/Layout.tsx', 'cf155-main-density-frame');
mustInclude('src/components/Layout.tsx', 'data-shell-content="true"');
mustInclude('src/components/Layout.tsx', '{children}');

[
  'src/styles/closeflow-panel-zoom-density-stage153.css',
  'src/styles/closeflow-revert-global-zoom-keep-card-density-stage154.css',
  'src/styles/closeflow-main-panel-density-scale-stage155.css',
].forEach(mustNotExist);

const css = 'src/styles/closeflow-real-density-tokens-no-zoom-stage156.css';
[
  'CLOSEFLOW_STAGE156_REAL_DENSITY_TOKENS_NO_ZOOM',
  '--closeflow-stage156-real-density-tokens-no-zoom: "active"',
  '--cf156-density-source-truth: "real-css-density-tokens-no-zoom"',
  '--cf156-route-pad-y: 18px',
  '--cf156-section-gap: 12px',
  '--cf156-kpi-height: 52px',
  '--cf156-panel-height: 48px',
  '--cf156-row-height: 58px',
  '--cf156-control-height: 32px',
  '--cf156-font-body: 12px',
  'zoom: 1 !important',
  'transform: none !important',
  '#root .view.active[data-shell-content="true"]',
  '.main-leads-html',
  '.main-clients-html',
  '.main-cases-html',
  '[data-p0-today-stable-rebuild="true"]',
  '[data-p0-tasks-stable-rebuild="true"]',
  '.activity-vnext-shell',
].forEach((marker) => mustInclude(css, marker));

if (/zoom:\s*var\(--cf15[3-5]/.test(read(css))) {
  throw new Error('Stage156 must not use rejected zoom variables from Stage153/154/155.');
}
if (/scale\(/.test(read(css))) {
  throw new Error('Stage156 must not use transform scale.');
}

mustInclude('docs/ui/CLOSEFLOW_STAGE156_REAL_DENSITY_TOKENS_NO_ZOOM.md', 'no zoom');
mustInclude('_project/STAGE156_REAL_DENSITY_TOKENS_NO_ZOOM_REPORT.md', 'real density tokens');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage156 real density tokens no zoom.md', 'Stage156');

console.log('OK: Stage156 real density tokens no zoom guard passed.');
