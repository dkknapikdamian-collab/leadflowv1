const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const gatePath = path.join(repoRoot, 'scripts', 'closeflow-release-check-quiet.cjs');
const stage98 = 'tests/stage98-polish-mojibake-calendar-guard.test.cjs';
const stage119 = 'tests/stage119-calendar-release-gate-trust.test.cjs';

function readGate() {
  return fs.readFileSync(gatePath, 'utf8');
}

function extractRequiredTests(text) {
  const match = text.match(/const\s+requiredTests\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(match, 'requiredTests array must exist.');
  return Array.from(match[1].matchAll(/['"]([^'"]+\.test\.cjs)['"]/g)).map((entry) => entry[1]);
}

function count(list, value) {
  return list.filter((item) => item === value).length;
}

function duplicates(list) {
  const seen = new Set();
  const dupes = [];
  for (const item of list) {
    if (seen.has(item) && !dupes.includes(item)) dupes.push(item);
    seen.add(item);
  }
  return dupes;
}

test('Stage119 V5 gate harness has one Stage98 preflight before build and no duplicate requiredTests', () => {
  const text = readGate();
  const requiredTests = extractRequiredTests(text);
  const dupes = duplicates(requiredTests);

  assert.deepStrictEqual(dupes, [], 'requiredTests duplicate paths: ' + dupes.join(', '));
  assert.equal(count(requiredTests, stage98), 1, 'Expected exactly one Stage98 requiredTests entry.');
  assert.equal(count(requiredTests, stage119), 1, 'Expected exactly one Stage119 requiredTests entry.');

  const preflightStarts = (text.match(/STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_START/g) || []).length;
  const preflightEnds = (text.match(/STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_END/g) || []).length;
  assert.equal(preflightStarts, 1, 'Expected exactly one Stage119 preflight start marker.');
  assert.equal(preflightEnds, 1, 'Expected exactly one Stage119 preflight end marker.');

  const preflightStart = text.indexOf('// STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_START');
  const preflightEnd = text.indexOf('// STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_END');
  const buildIndex = text.indexOf("runQuiet('production build'");

  assert.ok(preflightStart !== -1, 'Stage119 preflight start marker must exist.');
  assert.ok(preflightEnd > preflightStart, 'Stage119 preflight end marker must follow start marker.');
  assert.ok(buildIndex > preflightEnd, 'Production build must run after Stage98 calendar preflight.');

  const preflightBlock = text.slice(preflightStart, preflightEnd);
  assert.match(preflightBlock, /stage98 calendar mojibake hard gate preflight/);
  assert.match(preflightBlock, /tests\/stage98-polish-mojibake-calendar-guard\.test\.cjs/);

  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_V22_START'), false);
  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_V20_START'), false);
  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_QUIET_GATE'), false);
  assert.equal(text.includes('CLOSEFLOW_STAGE98B_MOJIBAKE_PREFLIGHT'), false);
});

test('Stage119 V5 requiredTests preflight reports all missing tests before quiet gate', () => {
  const text = readGate();
  const requiredTests = extractRequiredTests(text);
  const missing = requiredTests.filter((relativePath) => !fs.existsSync(path.join(repoRoot, relativePath)));
  assert.deepStrictEqual(missing, [], 'Missing requiredTests files: ' + missing.join(', '));
});

test('Stage98 hard gate scans runtime source and current release guards, not historical _project reports', () => {
  const guard = fs.readFileSync(path.join(repoRoot, stage98), 'utf8');

  assert.match(guard, /STAGE98_RUNTIME_SOURCE_AND_CURRENT_GUARDS/);
  assert.match(guard, /const currentGuardFiles = new Set\(\[/);
  assert.match(guard, /function shouldScan\(rel\)/);
  assert.match(guard, /rel\.startsWith\('src\/'\)/);
  assert.match(guard, /walk\('src'\)/);
  assert.match(guard, /tests\/stage98-polish-mojibake-calendar-guard\.test\.cjs/);

  assert.doesNotMatch(guard, /const roots = \['src', 'tests', 'scripts', '_project'\]/);
  assert.doesNotMatch(guard, /walk\('_project'\)|walk\("_project"\)/);
  assert.doesNotMatch(guard, /\.\.\.walk\('tests'\)/);
  assert.doesNotMatch(guard, /\.\.\.walk\('scripts'\)/);
});

test('Stage119 guard is registered in package scripts', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['test:stage119-calendar-release-gate-trust'], 'node --test tests/stage119-calendar-release-gate-trust.test.cjs');
});
