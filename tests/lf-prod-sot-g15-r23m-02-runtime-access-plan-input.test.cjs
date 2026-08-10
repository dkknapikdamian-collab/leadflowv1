const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/lib/closeflow-runtime-source-truth.ts';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-02-runtime-access-plan-input.cjs';
const baseSha = 'd075c76292eee3ce263c8045c3f164c3fd446fab';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-02 guard passes on the explicit input boundary', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-02/);
});

test('A2-02 replaces only the implicit empty-object signature', () => {
  const base = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const current = read(sourcePath);
  const oldBlock = [
    'export function buildRuntimeAccessPlanTruth(input = {}) {',
    '  const rawPlanId = normalizePlanToken(input.planId);',
    "  const rawSubscriptionStatus = normalizeRuntimeStatus(input.subscriptionStatus || 'inactive');",
  ].join('\n');
  const newBlock = [
    'export function buildRuntimeAccessPlanTruth(',
    "  { planId = '', subscriptionStatus: rawSubscriptionStatusInput = '' } = {},",
    ') {',
    '  const rawPlanId = normalizePlanToken(planId);',
    "  const rawSubscriptionStatus = normalizeRuntimeStatus(rawSubscriptionStatusInput || 'inactive');",
  ].join('\n');

  assert.ok(base.includes(oldBlock));
  assert.equal(current, base.replace(oldBlock, newBlock));
  assert.equal(current.includes(oldBlock), false);
});

test('A2-02 preserves runtime access-plan fallback decisions', () => {
  const current = read(sourcePath);
  assert.match(current, /planSource: 'fallback_status'/);
  assert.match(current, /requiresPlanIdConfirmation: true/);
  assert.match(current, /hasSafeFallback: true/);
});
