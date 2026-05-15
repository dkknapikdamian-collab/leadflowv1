const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const allowed = new Set(['OperatorSideCard', 'SimpleFiltersCard', 'TopValueRecordsCard']);
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp, out);
    else if (/\.(tsx?|jsx?|cjs|mjs)$/.test(entry.name)) out.push(fp);
  }
  return out;
}
function normalize(s) { return s.replace(/;\s*import\s+/g, ';\nimport '); }
function named(spec) {
  const m = spec.match(/\{([\s\S]*?)\}/);
  if (!m) return [];
  return m[1].split(',').map((x) => x.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim()).filter(Boolean);
}
test('operator rail barrel imports only rail card components', () => {
  const hits = [];
  for (const file of ['src','tests','scripts'].flatMap((d) => walk(path.join(root, d)))) {
    const text = normalize(fs.readFileSync(file, 'utf8'));
    const re = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]\s*;/g;
    let match;
    while ((match = re.exec(text))) {
      if (!/operator-rail(?:\/index)?$/.test(match[2])) continue;
      for (const sym of named(match[1])) if (!allowed.has(sym)) hits.push(path.relative(root, file) + ' :: ' + sym);
    }
  }
  assert.deepEqual(hits, []);
});
