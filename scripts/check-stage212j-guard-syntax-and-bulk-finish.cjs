const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (msg) => { console.error('STAGE212J_GUARD_FAIL: ' + msg); process.exit(1); };

const index = read('src/index.css').replace(/^\uFEFF/, '');
const indexLines = index.split(/\r?\n/);
let firstReal = '';
for (const raw of indexLines) {
  const line = raw.trim();
  if (!line) continue;
  firstReal = line;
  break;
}
if (firstReal !== '@import "tailwindcss";') fail('first real line in src/index.css must be @import "tailwindcss";');
let seenNonImport = false;
for (let i = 0; i < indexLines.length; i += 1) {
  const line = indexLines[i].trim();
  if (!line) continue;
  if (line.startsWith('@import ')) {
    if (seenNonImport) fail('found @import after non-import CSS block at line ' + (i + 1) + ': ' + line);
  } else {
    seenNonImport = true;
  }
}
if (!index.includes("@import './styles/closeflow-visual-foundation-stage212g.css';")) fail('Stage212G visual foundation import missing');
for (const bad of ['stage211', 'stage212a', 'stage212b', 'stage212c', 'stage212d', 'stage212e', 'stage212f']) {
  if (index.toLowerCase().includes(bad)) fail('legacy visual import/comment marker remains in src/index.css: ' + bad);
}

const mojibakeMarkers = ['Å', '\u00C4', '\u0139', '\u00C2', 'Ã', '\uFFFD', 'Ð', '¤', 'œ', '¼', 'º', '³', '┼', '├', 'ÔÇ'];
for (const rel of ['src/components/Layout.tsx', 'src/pages/Today.tsx', 'src/pages/TasksStable.tsx']) {
  if (!exists(rel)) continue;
  const text = read(rel);
  for (const marker of mojibakeMarkers) {
    const idx = text.indexOf(marker);
    if (idx !== -1) {
      const line = text.slice(0, idx).split(/\r?\n/).length;
      fail('mojibake marker remains in ' + rel + ' line ' + line + ': ' + marker);
    }
  }
}

const layout = read('src/components/Layout.tsx');
for (const label of ['Dziś', 'Aktywność', 'Inbox szkiców', 'Zgłoszenia', 'Użytkownik']) {
  if (!layout.includes(label)) fail('Layout.tsx missing required Polish label: ' + label);
}
if (layout.includes('VisualFoundationRuntimeStage212B')) fail('legacy Stage212B visual runtime remains in Layout.tsx');
if (layout.includes("import VisualFoundationRuntime from './VisualFoundationRuntime';")) fail('legacy VisualFoundationRuntime import remains in Layout.tsx');
if (layout.includes('<VisualFoundationRuntime />')) fail('legacy VisualFoundationRuntime tag remains in Layout.tsx');
if (!layout.includes("import VisualFoundationRuntimeStage212G from './VisualFoundationRuntimeStage212G';")) fail('Stage212G runtime import missing in Layout.tsx');
if (!layout.includes('<VisualFoundationRuntimeStage212G />')) fail('Stage212G runtime tag missing in Layout.tsx');
if (layout.includes('#f3f6fb')) fail('old #f3f6fb canvas remains in Layout.tsx');

const runtime = read('src/components/VisualFoundationRuntimeStage212G.tsx');
for (const must of ['--cf-canvas: #f1f5f9', '--cf-surface: #ffffff', 'nav-btn.active .nav-ico', 'rgba(96, 165, 250, 0.18)']) {
  if (!runtime.includes(must)) fail('runtime missing marker: ' + must);
}

const shell = read('src/styles/visual-stage01-shell.css');
const activeIdx = shell.indexOf('.closeflow-visual-stage01 .nav-btn.active .nav-ico');
if (activeIdx === -1) fail('active nav icon selector missing in shell CSS');
const activeSlice = shell.slice(activeIdx, activeIdx + 260);
if (activeSlice.includes('background: #fff') || activeSlice.includes('background-color: #fff')) fail('white active sidebar icon background remains near active nav icon selector');

console.log('STAGE212J_GUARD_PASS');
