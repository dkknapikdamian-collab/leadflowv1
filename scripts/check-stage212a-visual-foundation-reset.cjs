const fs = require('fs');
const path = require('path');
const root = process.cwd();
const fail = (msg) => { console.error('STAGE212A_VISUAL_FOUNDATION_RESET_GUARD_FAIL: ' + msg); process.exit(1); };
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
if (!exists('src/components/VisualFoundationRuntime.tsx')) fail('missing VisualFoundationRuntime.tsx');
const runtime = read('src/components/VisualFoundationRuntime.tsx');
for (const marker of ['closeflow-visual-foundation-source-truth-stage212a', '--cf-canvas: #f1f5f9', '--cf-surface: #ffffff', '#root .cf-html-shell .view.active', '#root .cf-html-shell .sidebar .nav-btn.active .nav-ico']) {
  if (!runtime.includes(marker)) fail('runtime missing marker: ' + marker);
}
const layout = read('src/components/Layout.tsx');
if (!layout.includes("import VisualFoundationRuntime from './VisualFoundationRuntime';")) fail('Layout missing VisualFoundationRuntime import');
if (!layout.includes('<VisualFoundationRuntime />')) fail('Layout missing VisualFoundationRuntime mount');
for (const good of ['Dziś', 'Aktywność', 'Zgłoszenia', 'Rozliczenia', 'Powiadomienia', 'Inbox szkiców']) {
  if (!layout.includes(good)) fail('Layout missing Polish label: ' + good);
}
for (const token of ['Dziś', 'AktywnoÅ', 'ZgÅ', 'ś', 'ć', 'ł', 'ó', '\u00C2', '\uFFFD']) {
  if (layout.includes(token)) fail('Layout still contains mojibake token: ' + token);
}
if (!exists('src/styles/closeflow-visual-foundation-source-truth-stage212a.css')) fail('missing static visual foundation css');
const css = read('src/styles/closeflow-visual-foundation-source-truth-stage212a.css');
if (!css.includes('--cf-canvas: #f1f5f9')) fail('static css does not define #f1f5f9 canvas');
console.log('STAGE212A_VISUAL_FOUNDATION_RESET_GUARD_PASS');
