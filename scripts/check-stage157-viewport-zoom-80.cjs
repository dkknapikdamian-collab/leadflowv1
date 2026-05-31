/* CLOSEFLOW_STAGE157_VIEWPORT_ZOOM_80_GUARD */
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
  if (exists(rel)) throw new Error(`${rel} must not exist after Stage157`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';");
mustInclude('src/App.tsx', "import './styles/closeflow-viewport-zoom-80-source-truth-stage157.css';");
mustNotInclude('src/App.tsx', "import './styles/closeflow-panel-zoom-density-stage153.css';");
mustNotInclude('src/App.tsx', "import './styles/closeflow-revert-global-zoom-keep-card-density-stage154.css';");
mustNotInclude('src/App.tsx', "import './styles/closeflow-main-panel-density-scale-stage155.css';");
mustNotInclude('src/components/Layout.tsx', 'cf155-main-density-frame');

[
  'src/styles/closeflow-panel-zoom-density-stage153.css',
  'src/styles/closeflow-revert-global-zoom-keep-card-density-stage154.css',
  'src/styles/closeflow-main-panel-density-scale-stage155.css',
].forEach(mustNotExist);

const css = 'src/styles/closeflow-viewport-zoom-80-source-truth-stage157.css';
[
  'CLOSEFLOW_STAGE157_VIEWPORT_ZOOM_80_SOURCE_TRUTH',
  '--closeflow-stage157-viewport-zoom-80-source-truth: "active"',
  '--cf157-page-zoom: 0.80',
  '--cf157-page-zoom-inverse: 1.25',
  '--cf157-layout-width: calc(100vw * var(--cf157-page-zoom-inverse))',
  'zoom: var(--cf157-page-zoom) !important',
  'width: var(--cf157-layout-width) !important',
  'min-width: var(--cf157-layout-width) !important',
  'grid-template-columns: var(--cf149-sidebar-width, 240px) minmax(0, 1fr) !important',
  '#root > .app.closeflow-visual-stage01.cf-html-shell',
  'overflow-x: hidden !important',
].forEach((marker) => mustInclude(css, marker));

mustNotInclude(css, '--cf153');
mustNotInclude(css, '--cf154');
mustNotInclude(css, '--cf155-main-panel-scale');

mustInclude('docs/ui/CLOSEFLOW_STAGE157_VIEWPORT_ZOOM_80_SOURCE_TRUTH.md', 'viewport-compensated page zoom');
mustInclude('_project/STAGE157_VIEWPORT_ZOOM_80_SOURCE_TRUTH_REPORT.md', 'browser 80%');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage157 viewport zoom 80 source truth.md', 'Stage157');

console.log('OK: Stage157 viewport zoom 80 source truth guard passed.');
