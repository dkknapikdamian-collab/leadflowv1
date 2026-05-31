const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'src', 'index.css');
const css = fs.readFileSync(indexPath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const lines = css.split('\n');

const importLines = [];
const barrierLines = [];
for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  if (/^@import\s+/.test(trimmed)) importLines.push(i + 1);
  if (/^@(theme|layer)\b/.test(trimmed)) barrierLines.push(i + 1);
}

if (!css.includes('@import "tailwindcss";')) {
  console.error('STAGE212D_GUARD_FAIL: missing canonical @import "tailwindcss";');
  process.exit(1);
}

const firstBarrier = barrierLines.length ? Math.min(...barrierLines) : Infinity;
const badImports = importLines.filter((line) => line > firstBarrier);
if (badImports.length) {
  console.error('STAGE212D_GUARD_FAIL: found @import after @theme/@layer block at lines ' + badImports.join(', '));
  process.exit(1);
}

const tailwindLine = lines.findIndex((line) => line.trim() === '@import "tailwindcss";') + 1;
if (!tailwindLine) {
  console.error('STAGE212D_GUARD_FAIL: canonical tailwind import line not found');
  process.exit(1);
}
const earlierImports = importLines.filter((line) => line < tailwindLine);
if (earlierImports.length) {
  console.error('STAGE212D_GUARD_FAIL: tailwind import is not first import');
  process.exit(1);
}

if (!css.includes("@import './styles/closeflow-visual-foundation-stage212b.css';")) {
  console.error('STAGE212D_GUARD_FAIL: missing Stage212B visual foundation import');
  process.exit(1);
}

const mojibake = /[ÅÄĹÂ�]/;
const layoutPath = path.join(process.cwd(), 'src', 'components', 'Layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layout = fs.readFileSync(layoutPath, 'utf8');
  if (mojibake.test(layout)) {
    console.error('STAGE212D_GUARD_FAIL: mojibake marker found in Layout.tsx');
    process.exit(1);
  }
  for (const phrase of ['Dziś', 'Aktywność', 'Zgłoszenia', 'Rozliczenia', 'Powiadomienia']) {
    if (!layout.includes(phrase)) {
      console.error('STAGE212D_GUARD_FAIL: missing Polish sidebar label: ' + phrase);
      process.exit(1);
    }
  }
}

console.log('STAGE212D_INDEX_CSS_IMPORT_ORDER_HARD_REPAIR_GUARD_PASS');
