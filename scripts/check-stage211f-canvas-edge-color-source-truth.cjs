#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const read = (p) => fs.readFileSync(path.join(repo, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(repo, p));
const fail = (msg) => { console.error(`STAGE211F_CANVAS_EDGE_COLOR_SOURCE_TRUTH_GUARD_FAIL: ${msg}`); process.exit(1); };

const cssPath = 'src/styles/closeflow-canvas-edge-color-source-truth-stage211f.css';
if (!exists(cssPath)) fail(`missing ${cssPath}`);
const css = read(cssPath);
for (const marker of [
  'STAGE211F_CANVAS_EDGE_COLOR_SOURCE_TRUTH',
  '--cf-canvas-bg: #f8fafc',
  '--cf-operator-bg: var(--cf-canvas-bg)',
  '#root .app.closeflow-visual-stage01',
  '#root .cf-html-shell .main',
  '#root .cf-html-shell [data-shell-main="true"]',
  '#root .cf-html-shell .view.active',
  '#root .cf-html-shell [data-shell-content="true"]',
  '#root .cf-html-shell .cf-route-work-root',
  '#root .cf-html-shell .cf-html-view',
  '#root .cf-html-shell .main-calendar-html',
  '#root .cf-html-shell .activity-vnext-page',
  '#root .cf-html-shell .ai-drafts-vnext-page',
  '#root .cf-html-shell .notifications-vnext-page',
  '#root .cf-html-shell .billing-vnext-page',
  '#root .cf-html-shell .support-vnext-page',
  '#root .cf-html-shell .settings-vnext-page',
  'background-image: none !important',
]) {
  if (!css.includes(marker)) fail(`missing CSS marker: ${marker}`);
}

const layout = read('src/components/Layout.tsx');
if (!layout.includes("import '../styles/closeflow-canvas-edge-color-source-truth-stage211f.css';")) fail('Layout.tsx missing Stage211F import');
const index = read('src/index.css');
if (!index.includes("@import './styles/closeflow-canvas-edge-color-source-truth-stage211f.css';")) fail('index.css missing Stage211F import');
const topTrim = read('src/styles/closeflow-operator-top-trim-source-truth.css');
if (topTrim.includes('--cf-operator-bg: #f3f6fb;')) fail('old operator bg literal remains');
if (topTrim.includes('--cf-operator-bg-soft: #eef3fa;')) fail('old operator bg soft literal remains');
if (!topTrim.includes('--cf-operator-bg: var(--cf-canvas-bg, #f8fafc);')) fail('operator bg not bound to canvas token');
if (!topTrim.includes('--cf-operator-bg-soft: var(--cf-canvas-bg, #f8fafc);')) fail('operator bg soft not bound to canvas token');
console.log('STAGE211F_CANVAS_EDGE_COLOR_SOURCE_TRUTH_GUARD_PASS');
