const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const fail = (message) => {
  console.error('STAGE212G_BULK_UI_REPAIR_GUARD_FAIL: ' + message);
  process.exit(1);
};
const read = (rel) => fs.readFileSync(path.join(repo, rel), 'utf8');

const index = read('src/index.css').replace(/^\uFEFF/, '');
const lines = index.split(/\r?\n/);
const firstMeaningful = lines.find((line) => line.trim() && !line.trim().startsWith('/*') && !line.trim().startsWith('*') && !line.trim().startsWith('*/'));
if (firstMeaningful !== '@import "tailwindcss";') {
  fail('index.css first meaningful line must be @import "tailwindcss";');
}
let seenNonImport = false;
for (let i = 0; i < lines.length; i++) {
  const trim = lines[i].trim();
  if (!trim || trim.startsWith('/*') || trim.startsWith('*') || trim.startsWith('*/') || trim.startsWith('//')) continue;
  if (trim.startsWith('@import')) {
    if (seenNonImport) fail('found @import after non-import CSS block at line ' + (i + 1) + ': ' + trim);
  } else {
    seenNonImport = true;
  }
}
if (!index.includes("@import './styles/closeflow-visual-foundation-stage212g.css';")) {
  fail('index.css missing Stage212G visual foundation import');
}

const layout = read('src/components/Layout.tsx');
for (const label of ['Dziś', 'Aktywność', 'Inbox szkiców', 'Powiadomienia', 'Rozliczenia', 'Zgłoszenia', 'Ustawienia', 'Użytkownik', 'Najważniejsze zakładki']) {
  if (!layout.includes(label)) fail('Layout.tsx missing Polish label: ' + label);
}
if (!layout.includes("VisualFoundationRuntimeStage212G")) fail('Layout.tsx missing VisualFoundationRuntimeStage212G');
if (layout.includes("VisualFoundationRuntimeStage212B")) fail('Layout.tsx still references Stage212B runtime');
if (layout.includes("#f3f6fb")) fail('Layout.tsx still contains legacy shell color #f3f6fb');
if (/GlobalQuickActions\s*\n<GlobalQuickActions/.test(layout)) fail('Layout.tsx still contains trailing pasted scratch block');

const runtime = read('src/components/VisualFoundationRuntimeStage212G.tsx');
for (const marker of ['--cf-canvas: #f1f5f9', 'data-stage212g-visual-foundation-runtime', '.nav-btn.active .nav-ico']) {
  if (!runtime.includes(marker)) fail('runtime missing marker: ' + marker);
}

const foundation = read('src/styles/closeflow-visual-foundation-stage212g.css');
for (const marker of ['--cf-canvas: #f1f5f9', '--cf-surface: #ffffff', '.main-leads-html', '.support-vnext-page']) {
  if (!foundation.includes(marker)) fail('foundation css missing marker: ' + marker);
}

const shell = read('src/styles/visual-stage01-shell.css');
const activeIconBlock = shell.match(/\.closeflow-visual-stage01\s+\.nav-btn\.active\s+\.nav-ico\s*\{[\s\S]*?\}/);
if (!activeIconBlock) fail('visual-stage01-shell.css missing active nav icon block');
if (/background:\s*#fff\s*;/.test(activeIconBlock[0])) fail('active nav icon still uses white square background');

const mojibakePattern = /Å|\u00C4|\u0139|\u00C2|Ã|\uFFFD|Ð|¤|œ|¼|º|³|┼|ÔÇ|├/;
for (const rel of ['src/components/Layout.tsx', 'src/pages/Today.tsx', 'src/pages/TasksStable.tsx']) {
  const text = read(rel);
  if (mojibakePattern.test(text)) fail('mojibake marker remains in ' + rel);
}

console.log('STAGE212G_BULK_UI_REPAIR_GUARD_PASS');
