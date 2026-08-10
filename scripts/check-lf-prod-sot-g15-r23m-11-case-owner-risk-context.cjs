const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = '622f34f6';
const sourcePath = 'src/pages/Cases.tsx';
const unsupportedPropertyPattern = /\n {24}(?:lifecycle|nearestCaseAction|nextActionLabel|statusLabel|compactLifecycleLabel|compactLifecyclePill|percent|updatedAt),\n/g;

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

assert((base.match(unsupportedPropertyPattern) || []).length === 8, 'base must contain exactly eight unsupported UI-only owner-risk properties');
assert(current === base.replace(unsupportedPropertyPattern, ''), 'current source must equal base with only unsupported owner-risk UI metadata removed');
const callStart = current.indexOf('getCaseOwnerRiskBadges(record, {');
const callEnd = current.indexOf('\n                      });', callStart);
assert(callStart >= 0 && callEnd > callStart, 'owner-risk call must remain present');
const context = current.slice(callStart, callEnd);
for (const token of ['settings: ownerRiskSettings,']) assert(context.includes(token), `owner-risk context lost supported field: ${token}`);
for (const token of ['lifecycle,', 'nearestCaseAction,', 'nextActionLabel,', 'statusLabel,', 'compactLifecycleLabel,', 'compactLifecyclePill,', 'percent,', 'updatedAt,']) assert(!context.includes(token), `owner-risk context still passes unsupported field: ${token}`);
assert(current.includes('const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);'), 'Cases row lifecycle derivation must remain canonical for UI');

console.log('PASS: A2-11 keeps OwnerRiskContext canonical and removes unsupported UI-only metadata.');
