const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const STAGE98_ACTIVE_ENCODING_SCOPE = 'STAGE98_RUNTIME_SOURCE_AND_CURRENT_GUARDS_R9';

const currentGuardFiles = new Set([
  'scripts/check-cf-runtime-00-source-truth.cjs',
  'scripts/check-closeflow-case-detail-loading-reference.cjs',
  'scripts/closeflow-release-check-quiet.cjs',
  'tests/cf-runtime-00-source-truth.test.cjs',
  'tests/stage98-polish-mojibake-calendar-guard.test.cjs',
]);

function walk(dir, out = []) {
  const base = path.join(root, dir);
  if (!fs.existsSync(base)) return out;
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, out);
    else if (/\.(ts|tsx|js|jsx|cjs|mjs|css)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function shouldScan(rel) {
  if (rel.startsWith('src/')) return true;
  return currentGuardFiles.has(rel);
}

function describeAt(text, index) {
  const start = Math.max(0, index - 90);
  const end = Math.min(text.length, index + 90);
  return text.slice(start, end).replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}

const badCodepoints = new Set([0x0102, 0x00c4, 0x0139, 0x013d, 0x00c2, 0xfffd]);

function findBad(rel, text) {
  const failures = [];
  if (text.charCodeAt(0) === 0xfeff) failures.push(`${rel}: raw BOM near "${describeAt(text, 0)}"`);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (badCodepoints.has(code)) {
      failures.push(`${rel}: U+${code.toString(16).toUpperCase().padStart(4, '0')} near "${describeAt(text, i)}"`);
    }
    if (code >= 0x80 && code <= 0x9f) {
      failures.push(`${rel}: C1 U+${code.toString(16).toUpperCase().padStart(4, '0')} near "${describeAt(text, i)}"`);
    }
  }
  return failures;
}

test('Stage98B blocks mojibake in runtime source and current release guards', () => {
  assert.ok(STAGE98_ACTIVE_ENCODING_SCOPE.includes('R9'));
  const files = [
    ...walk('src'),
    ...Array.from(currentGuardFiles).filter((rel) => fs.existsSync(path.join(root, rel))),
  ].filter(shouldScan);

  assert.ok(files.includes('src/pages/CaseDetail.tsx'), 'Stage98 must scan CaseDetail source');
  assert.ok(files.includes('src/pages/ClientDetail.tsx'), 'Stage98 must scan ClientDetail source');
  assert.ok(files.includes('tests/stage98-polish-mojibake-calendar-guard.test.cjs'), 'Stage98 must scan itself');

  const failures = [];
  for (const rel of files) failures.push(...findBad(rel, read(rel)));
  assert.deepEqual(failures, []);
});
