#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function fail(msg) {
  console.error('STAGE212B_VISUAL_FOUNDATION_MAP_AND_SIDEBAR_FIX_GUARD_FAIL: ' + msg);
  process.exit(1);
}

const cssRel = 'src/styles/closeflow-visual-foundation-stage212b.css';
const runtimeRel = 'src/components/VisualFoundationRuntimeStage212B.tsx';
const layoutRel = 'src/components/Layout.tsx';
const indexRel = 'src/index.css';

for (const rel of [cssRel, runtimeRel, layoutRel, indexRel]) {
  if (!fs.existsSync(path.join(repo, rel))) fail('missing required file: ' + rel);
}

const css = read(cssRel);
const runtime = read(runtimeRel);
const layout = read(layoutRel);
const index = read(indexRel);

for (const required of [
  '--cf-canvas: #f1f5f9',
  '--cf-surface: #ffffff',
  '--cf-surface-soft: #f8fafc',
  '#root .cf-html-shell .nav-btn.active .nav-ico',
  'background-color: var(--cf-canvas) !important',
  'background-image: none !important',
  '[data-stage16ai-today-tiles-match-lists="true"]',
  '.activity-stats-grid',
  '.tasks-stage178-grouped-list',
  '.calendar-week-layout',
  '.layout-list'
]) {
  if (!css.includes(required)) fail('CSS missing required source truth marker: ' + required);
}

if (!runtime.includes('VISUAL_FOUNDATION_STAGE212B_CSS')) fail('runtime missing embedded CSS marker');
if (!runtime.includes('MutationObserver')) fail('runtime missing mojibake runtime guard');
if (!layout.includes("import VisualFoundationRuntimeStage212B from './VisualFoundationRuntimeStage212B';")) fail('Layout missing runtime import');
if (!layout.includes('<VisualFoundationRuntimeStage212B />')) fail('Layout missing runtime component');
if (!index.includes("closeflow-visual-foundation-stage212b.css")) fail('index.css missing foundation import');

const mojibakePatterns = ['Dziś', 'Aktywność', 'Zgłoszenia', 'Inbox szkiców'];
for (const bad of mojibakePatterns) {
  if (layout.includes(bad)) fail('Layout still contains mojibake: ' + bad);
}
for (const good of ['Dziś', 'Aktywność', 'Zgłoszenia', 'Inbox szkiców']) {
  if (!layout.includes(good)) fail('Layout missing correct Polish text: ' + good);
}

console.log('STAGE212B_VISUAL_FOUNDATION_MAP_AND_SIDEBAR_FIX_GUARD_PASS');
