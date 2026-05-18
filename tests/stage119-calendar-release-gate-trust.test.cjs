const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const releaseGatePath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');
const stage98Path = path.join(root, 'tests', 'stage98-polish-mojibake-calendar-guard.test.cjs');
const packagePath = path.join(root, 'package.json');
const stage98TestPath = 'tests/stage98-polish-mojibake-calendar-guard.test.cjs';
const stage119TestPath = 'tests/stage119-calendar-release-gate-trust.test.cjs';

function count(text, needle) {
  return (text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

function extractRequiredTestsArray(text) {
  const match = text.match(/const\s+requiredTests\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(match, 'Missing requiredTests array.');
  return match[1];
}

function extractStage119Preflight(text) {
  const start = '// STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_START';
  const end = '// STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_END';
  assert.equal(count(text, start), 1, 'Expected exactly one Stage119 preflight start marker.');
  assert.equal(count(text, end), 1, 'Expected exactly one Stage119 preflight end marker.');
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end);
  assert.ok(startIndex !== -1 && endIndex !== -1 && startIndex < endIndex, 'Invalid Stage119 preflight block markers.');
  return text.slice(startIndex, endIndex + end.length);
}

test('Stage119 keeps one trusted Stage98 calendar preflight before production build', () => {
  const text = fs.readFileSync(releaseGatePath, 'utf8');
  const preflightBlock = extractStage119Preflight(text);
  const requiredTests = extractRequiredTestsArray(text);

  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_V22_START'), false);
  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_V20_START'), false);
  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_QUIET_GATE'), false);
  assert.equal(text.includes('CLOSEFLOW_STAGE98B_MOJIBAKE_PREFLIGHT'), false);

  const preflightIndex = text.indexOf('STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_START');
  const buildIndex = text.indexOf('production build');
  assert.ok(buildIndex !== -1, 'missing production build run');
  assert.ok(preflightIndex < buildIndex, 'Stage98 preflight must run before production build');

  assert.equal(count(preflightBlock, stage98TestPath), 1, 'Expected exactly one Stage98 preflight command.');
  assert.equal(count(requiredTests, stage98TestPath), 1, 'Expected exactly one Stage98 requiredTests entry.');
  assert.equal(count(requiredTests, stage119TestPath), 1, 'Expected exactly one Stage119 requiredTests entry.');
});

test('Stage98 hard gate scans active code/test/script sources, not historical _project reports', () => {
  const text = fs.readFileSync(stage98Path, 'utf8');
  assert.match(text, /const roots = \['src', 'tests', 'scripts'\]/);
  assert.equal(text.includes("'src', 'tests', 'scripts', '_project'"), false);
  assert.equal(text.includes("roots.includes('_project')"), true);
});

test('Stage119 guard is registered in package scripts', () => {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  assert.equal(pkg.scripts['test:stage119-calendar-release-gate-trust'], 'node --test tests/stage119-calendar-release-gate-trust.test.cjs');
});
