const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const baseline = fs.readFileSync('src/lib/owner-control/owner-control-baseline.ts', 'utf8');
const today = fs.readFileSync('src/pages/TodayStable.tsx', 'utf8');
const cfRuntimeGuard = fs.readFileSync('scripts/check-cf-runtime-00-source-truth.cjs', 'utf8');

test('A35 keeps Owner Control as gap-close, not new Today redesign', () => {
  assert.match(baseline, /STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC/);
  assert.match(today, /STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC/);
  assert.match(today, /const actionRequiredRows = useMemo\(\(\) => ownerControlBaseline\.items/);
});

test('A35 does not add ownerless rows in single-user mode', () => {
  assert.equal(baseline.includes('isOwnerlessOperationalRecord'), false);
  assert.equal(baseline.includes('Brak odpowiedzialnego'), false);
  assert.equal(baseline.includes('Bez odpowiedzialnego'), false);
  assert.equal(baseline.includes("gapCloseKind?: 'ownerless'"), false);
});

test('A35 adds note without task or follow-up rows through the same baseline source', () => {
  assert.match(baseline, /buildNoteWithoutFollowUpOwnerControlItems/);
  assert.match(baseline, /Notatka bez follow-upu/);
  assert.match(baseline, /gapCloseKind: 'note_without_followup'/);
  assert.match(baseline, /hasOpenPlannedActionForNoteSource/);
});

test('A35 routes source entities without SQL or new client fetch', () => {
  assert.doesNotMatch(baseline, /case_items/);
  assert.doesNotMatch(baseline, /from\(['"]clients['"]\)/);
  assert.match(cfRuntimeGuard, /CF_RUNTIME_00_STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_SCOPE_COMPAT/);
});