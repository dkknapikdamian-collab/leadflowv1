const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel){ return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function fail(msg){ console.error('STAGE212H_FINAL_MOJIBAKE_SWEEP_AND_BUILD_REPAIR_GUARD_FAIL: ' + msg); process.exit(1); }

const index = read('src/index.css').replace(/^\uFEFF/, '');
const lines = index.split(/\r?\n/);
let firstNonEmpty = lines.findIndex(l => l.trim() !== '');
if (firstNonEmpty < 0) fail('src/index.css is empty');
if (!/^@import\s+["']tailwindcss["'];/.test(lines[firstNonEmpty].trim())) {
  fail('first non-empty line must be @import "tailwindcss"; got: ' + lines[firstNonEmpty]);
}
let seenNonImport = false;
for (let i = 0; i < lines.length; i++) {
  const t = lines[i].trim();
  if (!t) continue;
  if (/^@import\b/.test(t)) {
    if (seenNonImport) fail('found @import after non-import CSS block at line ' + (i + 1) + ': ' + t);
  } else {
    seenNonImport = true;
  }
}
if (!index.includes("@import './styles/closeflow-visual-foundation-stage212g.css';")) fail('missing Stage212G visual foundation CSS import');
if (/stage211|stage212a|stage212b|stage212c|stage212d|stage212e|stage212f/.test(index)) fail('stale Stage211/212A-F marker remains in index.css');

const keyFiles = [
  'src/components/Layout.tsx',
  'src/pages/Today.tsx',
  'src/pages/TasksStable.tsx',
  'src/components/VisualFoundationRuntimeStage212G.tsx',
  'src/styles/visual-stage01-shell.css'
];
const mojibake = /Å|Ä|Ĺ|Â|Ã|�|Ð|¤|œ|¼|º|³|┼|├|ÔÇ|â€¢/;
for (const rel of keyFiles) {
  const text = read(rel);
  const hit = text.split(/\r?\n/).findIndex(line => mojibake.test(line));
  if (hit >= 0) fail('mojibake marker remains in ' + rel + ' line ' + (hit + 1));
}
const layout = read('src/components/Layout.tsx');
for (const label of ['Dziś','Aktywność','Inbox szkiców','Zgłoszenia','Użytkownik','Najważniejsze zakładki']) {
  if (!layout.includes(label)) fail('missing Polish label in Layout.tsx: ' + label);
}
if (!layout.includes('VisualFoundationRuntimeStage212G')) fail('Layout.tsx missing VisualFoundationRuntimeStage212G');
if (/VisualFoundationRuntimeStage212B|<VisualFoundationRuntime\s*\/>/.test(layout)) fail('old visual runtime remains in Layout.tsx');
if (layout.includes('#f3f6fb')) fail('Layout.tsx still contains stale #f3f6fb');

const sidebar = read('src/styles/visual-stage01-shell.css');
if (/\.nav-btn\.active\s+\.nav-ico\s*\{[^}]*background:\s*#fff/i.test(sidebar)) fail('active sidebar nav icon still has white background source');
const runtime = read('src/components/VisualFoundationRuntimeStage212G.tsx');
for (const token of ['--cf-canvas: #f1f5f9','--cf-surface: #ffffff','--cf-surface-soft: #f8fafc']) {
  if (!runtime.includes(token)) fail('runtime missing visual token: ' + token);
}
console.log('STAGE212H_FINAL_MOJIBAKE_SWEEP_AND_BUILD_REPAIR_GUARD_PASS');
