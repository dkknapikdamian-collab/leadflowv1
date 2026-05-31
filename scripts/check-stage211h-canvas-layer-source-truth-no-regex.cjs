#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repo = process.cwd();
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function fail(message) { console.error('STAGE211H_CANVAS_LAYER_SOURCE_TRUTH_NO_REGEX_GUARD_FAIL: ' + message); process.exit(1); }
const css = read('src/styles/closeflow-canvas-layer-source-truth-stage211h.css');
const indexCss = read('src/index.css');
const layout = read('src/components/Layout.tsx');
const operator = read('src/styles/closeflow-operator-top-trim-source-truth.css');
const requiredCssMarkers = [
  'STAGE211H_CANVAS_LAYER_SOURCE_TRUTH_NO_REGEX',
  '--cf-canvas-bg: #f8fafc',
  '--cf-operator-bg: var(--cf-canvas-bg)',
  '--cf-operator-bg-soft: var(--cf-canvas-bg)',
  '#root .cf-html-shell [data-shell-main="true"]',
  '#root .cf-html-shell [data-shell-content="true"]',
  '#root .cf-html-shell .view.active',
  '#root .cf-html-shell [class*="-vnext-page"]',
  '#root .cf-html-shell [class*="main-"][class*="-html"]',
  'background-image: none !important',
];
for (const marker of requiredCssMarkers) {
  if (!css.includes(marker)) fail('source truth CSS missing marker: ' + marker);
}
if (!indexCss.includes("@import './styles/closeflow-canvas-layer-source-truth-stage211h.css';")) fail('index.css missing stage211h import');
if (!layout.includes("import '../styles/closeflow-canvas-layer-source-truth-stage211h.css';")) fail('Layout.tsx missing stage211h import');
if (operator.includes('--cf-operator-bg: #f3f6fb;')) fail('old operator bg #f3f6fb remains');
if (operator.includes('--cf-operator-bg-soft: #eef3fa;')) fail('old operator soft bg #eef3fa remains');
if (!operator.includes('--cf-operator-bg: var(--cf-canvas-bg, #f8fafc);')) fail('operator bg not tied to canvas token');
if (!operator.includes('--cf-operator-bg-soft: var(--cf-canvas-bg, #f8fafc);')) fail('operator soft bg not tied to canvas token');
console.log('STAGE211H_CANVAS_LAYER_SOURCE_TRUTH_NO_REGEX_GUARD_PASS');
