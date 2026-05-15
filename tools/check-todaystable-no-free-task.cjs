#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const reportOnly = process.argv.includes('--report-only');
const repo = process.cwd();
const file = path.join(repo, 'src', 'pages', 'TodayStable.tsx');
if (!fs.existsSync(file)) { console.error(`Brak pliku: ${file}`); process.exit(reportOnly ? 0 : 2); }
const src = fs.readFileSync(file, 'utf8');
function findMatching(s, openIndex, openChar, closeChar) {
  let depth = 0, quote = null, blockComment = false, lineComment = false;
  for (let i = openIndex; i < s.length; i++) {
    const c = s[i], n = s[i + 1];
    if (lineComment) { if (c === '\n') lineComment = false; continue; }
    if (blockComment) { if (c === '*' && n === '/') { blockComment = false; i++; } continue; }
    if (quote) { if (c === '\\') { i++; continue; } if (c === quote) quote = null; continue; }
    if (c === '/' && n === '/') { lineComment = true; i++; continue; }
    if (c === '/' && n === '*') { blockComment = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === openChar) depth++;
    if (c === closeChar) { depth--; if (depth === 0) return i; }
  }
  return -1;
}
function getMapCallbacks(s) {
  const out = [];
  let pos = 0;
  while (true) {
    const idx = s.indexOf('.map(', pos);
    if (idx < 0) break;
    const open = idx + 4;
    const close = findMatching(s, open, '(', ')');
    if (close < 0) { pos = idx + 5; continue; }
    const inside = s.slice(open + 1, close);
    let m = inside.match(/^\s*\(\s*([A-Za-z_$][\w$]*)\s*(?::[^,)]+)?(?:,\s*[^)]*)?\)\s*=>/s);
    if (!m) m = inside.match(/^\s*([A-Za-z_$][\w$]*)\s*=>/s);
    if (m) out.push({ idx, param: m[1], inside });
    pos = close + 1;
  }
  return out;
}
function hasOwnTaskDeclaration(segment) {
  return /\b(?:const|let|var)\s+task\b/.test(segment) || /function\s+[A-Za-z_$][\w$]*\s*\([^)]*\btask\b/.test(segment);
}
const failures = getMapCallbacks(src)
  .filter(c => c.param !== 'task')
  .filter(c => /\btask\s*(?:\?\.|\.)/.test(c.inside))
  .filter(c => !hasOwnTaskDeclaration(c.inside))
  .map(c => {
    const line = src.slice(0, c.idx).split(/\r?\n/).length;
    const snippet = src.slice(Math.max(0, c.idx - 120), Math.min(src.length, c.idx + 380));
    return { line, param: c.param, snippet };
  });
if (failures.length) {
  console.error(`FAIL: TodayStable ma wolne odwołanie do task w callbacku .map(...): ${failures.length}`);
  failures.forEach((f, i) => console.error(`\n#${i + 1} line=${f.line} mapParam=${f.param}\n${f.snippet}`));
  process.exit(reportOnly ? 0 : 1);
}
console.log('OK: TodayStable nie ma wykrytego wolnego task w callbackach .map(...)');
