const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('FRT-035 keeps readiness and completeness on the canonical lifecycle resolver', () => {
  const lifecycle = read('src/lib/case-lifecycle-v1.ts');
  const cases = read('src/pages/Cases.tsx');

  assert.match(lifecycle, /completenessPercent\?: number/);
  assert.match(lifecycle, /computeCompleteness\(items, input\.completenessPercent\)/);
  assert.match(lifecycle, /if \(!items\.length\) return clampCompleteness\(persistedCompletenessPercent\)/);
  assert.match(cases, /completenessPercent: record\.completenessPercent/);
  assert.match(cases, /const percent = lifecycle\.completenessPercent/);
  assert.match(cases, /lifecycle\.bucket === 'ready_to_start'/);
});

test('FRT-035 exposes a real start action through one lifecycle transition owner', () => {
  const cases = read('src/pages/Cases.tsx');
  const detail = read('src/pages/CaseDetail.tsx');
  const actions = read('src/lib/case-lifecycle-actions.ts');

  assert.match(cases, /transitionCaseLifecycleStatusV1/);
  assert.match(cases, /data-case-row-start-action="true"/);
  assert.match(cases, /Rozpocznij realizację/);
  assert.match(detail, /transitionCaseLifecycleStatusV1/);
  assert.match(actions, /updateCaseInSupabase/);
  assert.match(actions, /insertActivityToSupabase/);
  assert.match(actions, /case_lifecycle_started/);
});
