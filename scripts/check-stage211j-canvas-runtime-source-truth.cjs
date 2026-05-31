const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (msg) => { console.error('STAGE211J_CANVAS_RUNTIME_SOURCE_TRUTH_GUARD_FAIL: ' + msg); process.exit(1); };
const cssRel = 'src/styles/closeflow-canvas-runtime-source-truth-stage211j.css';
if (!exists(cssRel)) fail('missing source truth css');
const css = read(cssRel);
for (const marker of [
  '--cf-canvas-bg: #f8fafc',
  '--cf-operator-bg: var(--cf-canvas-bg)',
  '#root .cf-html-shell .main',
  '#root .cf-html-shell .view.active',
  '[data-shell-content="true"]',
  'data-stage16ai-today-tiles-match-lists',
  'STAGE211J_CANVAS_RUNTIME_SOURCE_TRUTH_GUARD'
]) {
  if (!css.includes(marker)) fail('missing css marker: ' + marker);
}
const layout = read('src/components/Layout.tsx');
if (!layout.includes("closeflow-canvas-runtime-source-truth-stage211j.css")) fail('Layout does not import source truth css');
const index = read('src/index.css');
if (!index.includes("closeflow-canvas-runtime-source-truth-stage211j.css")) fail('index.css does not import source truth css');
const top = read('src/styles/closeflow-operator-top-trim-source-truth.css');
if (top.includes('--cf-operator-bg: #f3f6fb') || top.includes('--cf-operator-bg-soft: #eef3fa')) fail('old operator canvas tokens remain');
const pages = ['src/pages/TodayStable.tsx','src/pages/Calendar.tsx','src/pages/Activity.tsx','src/pages/AiDrafts.tsx','src/pages/NotificationsCenter.tsx','src/pages/Billing.tsx','src/pages/SupportCenter.tsx','src/pages/Settings.tsx'];
for (const rel of pages) {
  if (exists(rel) && !read(rel).includes('closeflow-canvas-runtime-source-truth-stage211j.css')) fail('page missing source truth import: ' + rel);
}
console.log('STAGE211J_CANVAS_RUNTIME_SOURCE_TRUTH_GUARD_PASS');
