const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const casePath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');
const packagePath = path.join(repoRoot, 'package.json');

function read(file) { return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); }
function getBlock() {
  const source = read(casePath);
  const start = source.indexOf('function getActivityText(activity: CaseActivity) {');
  const end = source.indexOf('function sortCaseItems', start);
  assert.ok(start >= 0, 'missing getActivityText');
  assert.ok(end > start, 'missing sortCaseItems boundary');
  return source.slice(start, end);
}

test('STAGE68P: case history copy is clean UTF-8 passive Polish', () => {
  const block = getBlock();
  assert.match(block, /Dodano brak: \$\{title\}/);
  assert.match(block, /Dodano decyzję: \$\{title\}/);
  assert.match(block, /Dodano notatkę/);
  assert.match(block, /Przełożono zadanie/);
  assert.match(block, /Rozpoczęto realizację sprawy/);
  assert.doesNotMatch(block, /â|Ä|Ĺ|Ă|ď|�/);
  assert.doesNotMatch(block, /\$\{actor\}|Ty dodał|Ty podjął/);
});

test('STAGE68P: package.json is machine-safe and verify uses only final Stage68 guard', () => {
  const bytes = fs.readFileSync(packagePath);
  assert.notDeepStrictEqual(Array.from(bytes.slice(0, 3)), [0xef, 0xbb, 0xbf]);
  const raw = bytes.toString('utf8');
  assert.ok(!raw.includes('\\u0026'));
  const pkg = JSON.parse(raw);
  assert.strictEqual(pkg.scripts['check:stage68p-case-history-package-final'], 'node scripts/check-stage68p-case-history-package-final.cjs');
  const matches = String(pkg.scripts['verify:case-operational-ui']).match(/check:stage68[a-z0-9-]*/gi) || [];
  assert.deepStrictEqual(matches, ['check:stage68p-case-history-package-final']);
});
