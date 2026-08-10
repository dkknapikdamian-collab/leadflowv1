const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = 'd075c76292eee3ce263c8045c3f164c3fd446fab';
const sourcePath = 'src/lib/closeflow-runtime-source-truth.ts';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function normalizeEol(value) {
  return value.replace(/\r\n/g, '\n');
}

const current = normalizeEol(fs.readFileSync(path.join(root, sourcePath), 'utf8'));
const base = normalizeEol(execFileSync('git', ['show', `${baseSha}:${sourcePath}`], {
  cwd: root,
  encoding: 'utf8',
}));

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

assert(base.includes(oldBlock), 'base must contain the diagnosed implicit {} input block');
assert(!current.includes(oldBlock), 'current source must not retain the implicit {} input block');
assert(current.includes(newBlock), 'current source must expose the inferred destructured input contract');
assert(current === base.replace(oldBlock, newBlock), 'current source must equal base with only the input boundary replacement');
assert(current.split("planId = ''").length - 1 === 1, 'input contract must default planId exactly once');
assert(current.split("rawSubscriptionStatusInput = ''").length - 1 === 1, 'input contract must default subscription status exactly once');
assert(current.includes("planSource: 'fallback_status'"), 'runtime fallback source must remain unchanged');
assert(current.includes('requiresPlanIdConfirmation: true'), 'paid status without plan id must remain unconfirmed');
assert(!/\bany\b|@ts-ignore|@ts-expect-error/.test(current), 'runtime source must not add a type bypass');

console.log('PASS: A2-02 adds only the explicit runtime access-plan input type boundary.');
