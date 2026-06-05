const fs = require('fs');

function fail(message) {
  console.error(`STAGE212N_GUARD_FAIL: ${message}`);
  process.exit(1);
}

function read(path) {
  if (!fs.existsSync(path)) fail(`missing file: ${path}`);
  return fs.readFileSync(path, 'utf8');
}

function realLines(text) {
  return text
    .replaceAll('\r', '')
    .split('\n')
    .map((line, index) => ({ line, trim: line.trim(), number: index + 1 }))
    .filter((entry) => entry.trim && !entry.trim.startsWith('/*') && !entry.trim.startsWith('*') && !entry.trim.startsWith('//'));
}

const index = read('src/index.css');
const layout = read('src/components/Layout.tsx');
const visualCss = read('src/styles/closeflow-visual-foundation-stage212m.css');
const adminCss = read('src/styles/admin-tools.css');
const shellCss = read('src/styles/visual-stage01-shell.css');

const lines = realLines(index);
if (!lines.length) fail('src/index.css has no real lines');

if (lines[0].trim !== '@import "tailwindcss";') {
  fail(`first real index.css line must be @import "tailwindcss"; got line ${lines[0].number}: ${lines[0].trim}`);
}

let seenNonImport = false;
for (const entry of lines) {
  if (entry.trim.startsWith('@import ')) {
    if (seenNonImport) {
      fail(`found @import after non-import CSS block at line ${entry.number}: ${entry.trim}`);
    }
  } else {
    seenNonImport = true;
  }
}

if (!index.includes('closeflow-visual-foundation-stage212m.css')) {
  fail('index.css missing closeflow-visual-foundation-stage212m.css import');
}

const forbiddenOldImports = [
  'closeflow-canvas-layer-source-truth-stage211h.css',
  'closeflow-canvas-runtime-source-truth-stage211j.css',
  'closeflow-canvas-final-source-truth-stage211k.css',
  'closeflow-visual-foundation-stage212b.css',
  'closeflow-visual-foundation-stage212g.css'
];

for (const marker of forbiddenOldImports) {
  if (index.includes(marker)) fail(`legacy visual import remains in index.css: ${marker}`);
}

if (!layout.includes('VisualFoundationRuntimeStage212M')) {
  fail('Layout.tsx missing VisualFoundationRuntimeStage212M');
}

for (const marker of ['VisualFoundationRuntimeStage212B', 'VisualFoundationRuntimeStage212G']) {
  if (layout.includes(marker)) fail(`legacy visual runtime remains in Layout.tsx: ${marker}`);
}

if (layout.includes('STAGE16M_LAYOUT_AI_DRAFTS_COMPAT')) {
  fail('Layout.tsx still contains unfinished STAGE16M_LAYOUT_AI_DRAFTS_COMPAT tail marker');
}

const mojibakePattern = /Å|\u00C4|\u0139|\u00C2|Ã|\uFFFD|Ð|¤|œ|¼|º|³|ÔÇ|┼|├/;
const mojibakeFiles = [
  'src/components/Layout.tsx',
  'src/pages/Today.tsx',
  'src/pages/TasksStable.tsx'
];

for (const file of mojibakeFiles) {
  const text = read(file);
  const fileLines = text.replaceAll('\r', '').split('\n');
  for (let i = 0; i < fileLines.length; i += 1) {
    if (mojibakePattern.test(fileLines[i])) {
      fail(`mojibake marker remains in ${file} line ${i + 1}: ${fileLines[i].trim().slice(0, 120)}`);
    }
  }
}

for (const token of ['--cf-canvas', '#f1f5f9', '--cf-surface', '#ffffff', '--cf-surface-soft', '#f8fafc', '--cf-border', '#e2e8f0']) {
  if (!visualCss.includes(token)) fail(`visual foundation missing token/value: ${token}`);
}

for (const selector of [
  '.admin-debug-toolbar',
  '.admin-debug-toolbar > button',
  '.admin-tool-popover',
  '.admin-tool-dialog'
]) {
  if (!adminCss.includes(selector)) fail(`admin-tools.css missing selector: ${selector}`);
}

if (!adminCss.includes('background: rgba(15, 23, 42')) {
  fail('admin toolbar dark background source truth missing');
}

if (shellCss.includes('.nav-btn.active .nav-ico') && shellCss.includes('background: #fff')) {
  fail('sidebar active icon still uses white square background');
}

if (visualCss.includes('#today-section-ai-drafts') === false) {
  fail('visual foundation missing today-section-ai-drafts background source truth');
}

console.log('STAGE212N_GUARD_PASS');
