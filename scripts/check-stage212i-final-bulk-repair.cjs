/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg) { console.error('STAGE212I_FINAL_BULK_REPAIR_GUARD_FAIL: ' + msg); process.exit(1); }

const index = read('src/index.css');
const lines = index.split(/\r?\n/);
let seenNonImport = false;
for (let i = 0; i < lines.length; i += 1) {
  const trim = lines[i].trim();
  if (!trim) continue;
  if (trim.startsWith('@import')) {
    if (seenNonImport) fail('found @import after non-import CSS block at line ' + (i + 1));
  } else {
    seenNonImport = true;
  }
}
if (lines.find((line) => line.trim()).trim() !== '@import "tailwindcss";') fail('tailwind import is not the first real line');
if (!index.includes("@import './styles/closeflow-visual-foundation-stage212g.css';")) fail('missing stage212g visual foundation import');

const layout = read('src/components/Layout.tsx');
['Dziś', 'Aktywność', 'Inbox szkiców', 'Zgłoszenia', 'Użytkownik', 'Najważniejsze zakładki'].forEach((label) => {
  if (!layout.includes(label)) fail('missing Polish label in Layout.tsx: ' + label);
});
if (!layout.includes('VisualFoundationRuntimeStage212G')) fail('Layout missing Stage212G runtime');
if (/VisualFoundationRuntimeStage212B|<VisualFoundationRuntimes*/>/.test(layout)) fail('legacy visual runtime remains in Layout.tsx');
if (layout.includes('#f3f6fb')) fail('old #f3f6fb background remains in Layout.tsx');

const runtime = read('src/components/VisualFoundationRuntimeStage212G.tsx');
if (!runtime.includes('--cf-canvas: #f1f5f9')) fail('runtime missing #f1f5f9 canvas token');
if (!runtime.includes('data-stage212i-visual-foundation-runtime')) fail('runtime marker missing');

const sidebar = read('src/styles/visual-stage01-shell.css');
if (/.nav-btn.actives+.nav-icos*{[sS]{0,160}?background:s*#fff/.test(sidebar)) fail('sidebar active nav icon still uses #fff background');

const mojibake = /Å|Ä|Ĺ|Â|Ã|�|Ð|¤|œ|¼|º|³|┼|Ô|Ç|├|â€¢|â€“|â€”|â€¦/;
const scanRoots = ['src/components/Layout.tsx', 'src/pages/Today.tsx', 'src/pages/TasksStable.tsx'];
for (const rel of scanRoots) {
  const text = read(rel);
  const badLine = text.split(/\r?\n/).findIndex((line) => mojibake.test(line));
  if (badLine >= 0) fail('mojibake marker remains in ' + rel + ' line ' + (badLine + 1));
}
console.log('STAGE212I_FINAL_BULK_REPAIR_GUARD_PASS');
