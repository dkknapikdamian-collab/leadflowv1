const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Cases page imports V1 lifecycle resolver and action fetchers', () => {
  const source = read('src/pages/Cases.tsx');

  assert.match(source, /resolveCaseLifecycleV1/);
  assert.match(source, /fetchTasksFromSupabase/);
  assert.match(source, /fetchEventsFromSupabase/);
  assert.match(source, /const \[caseTasks, setCaseTasks\]/);
  assert.match(source, /const \[caseEvents, setCaseEvents\]/);
});

test('Cases page exposes lifecycle command filters', () => {
  const source = read('src/pages/Cases.tsx');

  assert.match(source, /approval/);
  assert.match(source, /needs_next_step/);
  assert.match(source, /Akceptacje/);
  assert.match(source, /Bez kroku/);
  assert.match(source, /stats\.approval/);
  assert.match(source, /stats\.needsNextStep/);
});

test('Cases cards show operator next action and lifecycle counters', () => {
  const source = read('src/pages/Cases.tsx');

  assert.match(source, /lifecycle\.headline/);
  assert.match(source, /lifecycle\.nextOperatorAction/);
  assert.match(source, /lifecycleRiskLabel\(lifecycle\.riskLevel\)/);
  assert.match(source, /lifecycle\.openActionCount/);
  assert.match(source, /lifecycle\.missingRequiredCount/);
  assert.match(source, /lifecycle\.waitingApprovalCount/);
});

test('Cases V1 lifecycle command board documentation exists', () => {
  const doc = read('docs/CASES_V1_LIFECYCLE_COMMAND_BOARD_2026-04-24.md');

  assert.match(doc, /Cases V1 lifecycle command board/);
  assert.match(doc, /Nie dodajemy wykresu/);
  assert.match(doc, /Bez kroku/);
});
