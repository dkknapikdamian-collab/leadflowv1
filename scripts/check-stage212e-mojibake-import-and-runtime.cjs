const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function fail(msg) { console.error(`STAGE212E_GUARD_FAIL: ${msg}`); process.exit(1); }

const index = read('src/index.css');
const lines = index.split(/\r?\n/);
let seenNonImport = false;
for (const line of lines) {
  const t = line.trim();
  if (!t || t.startsWith('/*') || t.startsWith('*') || t.endsWith('*/')) continue;
  if (t.startsWith('@import')) {
    if (seenNonImport) fail('found @import after non-import CSS block');
  } else {
    seenNonImport = true;
  }
}
if (!lines.some((line) => line.trim() === '@import "tailwindcss";')) fail('missing @import "tailwindcss";');
const firstImport = lines.find((line) => line.trim().startsWith('@import'))?.trim();
if (firstImport !== '@import "tailwindcss";') fail('tailwind import is not first import');
if (!index.includes("@import './styles/closeflow-visual-foundation-stage212b.css';")) fail('missing visual foundation import');

const layout = read('src/components/Layout.tsx');
const forbidden = ['Dziś', 'Dziś', 'AktywnoÅ', 'Aktywno\u0139', 'ZgÅ', 'Zg\u0139', 'ó', 'ł', 'ś', 'ć', 'ę', 'ą', '\u00C2', '\uFFFD'];
for (const marker of forbidden) {
  if (layout.includes(marker)) fail(`mojibake marker remains in Layout.tsx: ${marker}`);
}
for (const required of ['Dziś', 'Aktywność', 'Inbox szkiców', 'Zgłoszenia', 'Użytkownik']) {
  if (!layout.includes(required)) fail(`required Polish label missing in Layout.tsx: ${required}`);
}
if (!layout.includes("./VisualFoundationRuntimeStage212B")) fail('Layout missing VisualFoundationRuntimeStage212B import');
if (!layout.includes('<VisualFoundationRuntimeStage212B />')) fail('Layout missing VisualFoundationRuntimeStage212B mount');

const runtime = read('src/components/VisualFoundationRuntimeStage212B.tsx');
for (const required of ['--cf-canvas: #f1f5f9', 'closeflow-visual-foundation-stage212b-runtime', '.nav-btn.active .nav-ico', 'background-color: var(--cf-canvas)']) {
  if (!runtime.includes(required)) fail(`runtime missing marker: ${required}`);
}

console.log('STAGE212E_MOJIBAKE_IMPORT_AND_VISUAL_RUNTIME_GUARD_PASS');
