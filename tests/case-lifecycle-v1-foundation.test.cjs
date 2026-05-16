const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Case lifecycle foundation exposes V1 resolver and buckets', () => {
  const source = read('src/lib/case-lifecycle-v1.ts');

  assert.match(source, /export function resolveCaseLifecycleV1/);
  assert.match(source, /blocked/);
  assert.match(source, /waiting_approval/);
  assert.match(source, /ready_to_start/);
  assert.match(source, /in_progress/);
  assert.match(source, /completed/);
  assert.match(source, /needs_next_step/);
});

test('Case lifecycle foundation guards missing required and approval states', () => {
  const source = read('src/lib/case-lifecycle-v1.ts');

  assert.match(source, /countMissingRequired/);
  assert.match(source, /countWaitingApproval/);
  assert.match(source, /missingRequiredCount > 0/);
  assert.match(source, /waitingApprovalCount > 0/);
});

test('Case lifecycle foundation detects missing next step', () => {
  const source = read('src/lib/case-lifecycle-v1.ts');

  assert.match(source, /hasNextStep/);
  assert.match(source, /Brak kolejnego kroku/);
  assert.match(source, /Dodaj zadanie albo wydarzenie/);
});

test('Case lifecycle foundation documentation exists', () => {
  const doc = read('docs/CASE_LIFECYCLE_V1_FOUNDATION_2026-04-24.md');

  assert.match(doc, /Case lifecycle V1 foundation/);
  assert.match(doc, /jedn\u0105 prawd\u0105 operacyjn\u0105/);
  assert.match(doc, /needs_next_step/);
});
