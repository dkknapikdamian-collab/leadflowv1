const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const roots = ['src/pages/Calendar.tsx', 'src/styles', 'tests', '_project'];
const bannedChars = [0x00c4, 0x0139, 0x0102, 0x00c2, 0xfffd].map((code) => String.fromCodePoint(code));
const bannedFragments = ['wpis' + String.fromCodePoint(0x0102), 'dzie' + String.fromCodePoint(0x0139), 'najbli' + String.fromCodePoint(0x0139), 'powi' + String.fromCodePoint(0x00c4), 'Otw' + String.fromCodePoint(0x0102), 'Usu' + String.fromCodePoint(0x0139), 'Przywr' + String.fromCodePoint(0x0102)];

function walk(abs, out = []) {
  if (!fs.existsSync(abs)) return out;
  const stat = fs.statSync(abs);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(abs)) walk(path.join(abs, name), out);
  } else out.push(abs);
  return out;
}
function rel(abs) { return path.relative(repoRoot, abs).split(path.sep).join('/'); }
function shouldScan(relative) {
  if (relative === 'src/pages/Calendar.tsx') return true;
  if (relative.startsWith('src/styles/')) return relative.endsWith('.css') && path.basename(relative).startsWith('closeflow-calendar');
  if (relative.startsWith('tests/')) return relative.endsWith('.cjs') && path.basename(relative).includes('calendar');
  if (relative.startsWith('_project/')) return relative.split('/').length === 2 && relative.endsWith('.md');
  return false;
}

test('Stage98 Polish mojibake is a hard fail in active calendar files', () => {
  const files = roots.flatMap((root) => walk(path.join(repoRoot, root))).map(rel).filter(shouldScan);
  const hits = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(repoRoot, file), 'utf8');
    for (const ch of bannedChars) if (text.includes(ch)) hits.push(file + ': U+' + ch.codePointAt(0).toString(16).toUpperCase());
    for (const fragment of bannedFragments) if (text.includes(fragment)) hits.push(file + ': fragment');
  }
  assert.deepStrictEqual(hits, []);
});
