const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/Cases.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-11-case-owner-risk-context.cjs';
const baseSha = '622f34f6';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

function readFromGit(spec) {
  return execFileSync('git', ['show', spec], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
}

test('A2-11 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-11/);
});

test('A2-11 removes the complete unsupported owner-risk UI metadata batch', () => {
  const base = readFromGit(`${baseSha}:${sourcePath}`);
  const current = read(sourcePath);
  const unsupportedPropertyPattern = /\n {24}(?:lifecycle|nearestCaseAction|nextActionLabel|statusLabel|compactLifecycleLabel|compactLifecyclePill|percent|updatedAt),\n/g;
  assert.equal((base.match(unsupportedPropertyPattern) || []).length, 8);
  assert.equal(current, base.replace(unsupportedPropertyPattern, ''));
});

test('A2-11 preserves owner-risk inputs and the separate lifecycle UI derivation', () => {
  const current = read(sourcePath);
  assert.match(current, /getCaseOwnerRiskBadges\(record, \{/);
  assert.match(current, /settings: ownerRiskSettings,/);
  assert.doesNotMatch(current, /getCaseOwnerRiskBadges\(record, \{[\s\S]*?\n\s+(?:lifecycle|nearestCaseAction|nextActionLabel|statusLabel|compactLifecycleLabel|compactLifecyclePill|percent|updatedAt),/);
  assert.match(current, /const lifecycle = resolveCaseListLifecycle\(record, caseTasksByCaseId, caseEventsByCaseId\);/);
});
