const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-data-contract-stage-a1.cjs');
const dataContract = fs.readFileSync(path.join(root, 'src/lib/data-contract.ts'), 'utf8');
const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
const emergencyCss = fs.readFileSync(path.join(root, 'src/styles/emergency/emergency-hotfixes.css'), 'utf8');
const guard = fs.readFileSync(guardPath, 'utf8');

test('reconciled Stage A1 guard passes against current data and CSS sources', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /reconciled with the current CSS import-layer source truth/);
});

test('data contract normalizers and scheduling fields remain present', () => {
  for (const required of [
    'normalizeTaskContract',
    'normalizeEventContract',
    'normalizeLeadContract',
    'normalizeCaseContract',
    'normalizeTaskListContract',
    'normalizeEventListContract',
    'normalizeLeadListContract',
    'normalizeCaseListContract',
    'scheduledAt',
    'reminderAt',
    'recurrenceRule',
    'linkedCaseId',
    'completenessPercent',
  ]) assert.match(dataContract, new RegExp(required));
});

test('index.css routes emergency fixes instead of owning the historical selector', () => {
  assert.match(indexCss, /@import '\.\/styles\/emergency\/emergency-hotfixes\.css';/);
  assert.doesNotMatch(indexCss, /#root \.border-amber-200\.bg-amber-50:has\(> svg:only-child\)/);
});

test('emergency layer preserves the narrowed empty-warning-strip hotfix and lifecycle metadata', () => {
  assert.match(emergencyCss, /reason: hide empty client warning strip that only renders an icon\./);
  assert.match(emergencyCss, /scope: client panel empty amber warning strip only; real alerts with text\/actions stay visible\./);
  assert.match(emergencyCss, /remove_after_stage: after client warning strip rendering is fixed in JSX\./);
  assert.match(emergencyCss, /#root \.border-amber-200\.bg-amber-50:has\(> svg:only-child\)/);
  assert.match(emergencyCss, /display: none !important;/);
});

test('guard follows the CSS import-layer contract and no longer requires the removed marker', () => {
  assert.match(guard, /emergency-hotfixes\.css/);
  assert.match(guard, /index\.css nie dubluje selektora/);
  assert.match(guard, /warstwa emergency dokumentuje przyczynę/);
  assert.doesNotMatch(guard, /CLIENT_PANEL_EMPTY_WARNING_STRIP_FIX_STAGE_A1/);
});
