const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const baseline = fs.readFileSync('src/lib/owner-control/owner-control-baseline.ts', 'utf8');
const r1Test = fs.readFileSync('tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs', 'utf8');
const r2Guard = fs.readFileSync('scripts/check-stage-a35-r2-remove-single-user-ownerless-noise.cjs', 'utf8');

test('A35 R2 removes ownerless noise from single-user Owner Control runtime', () => {
  assert.doesNotMatch(baseline, /isOwnerlessOperationalRecord/);
  assert.doesNotMatch(baseline, /Brak odpowiedzialnego/);
  assert.doesNotMatch(baseline, /Bez odpowiedzialnego/);
  assert.doesNotMatch(baseline, /gapCloseKind: ownerless/);
  assert.doesNotMatch(baseline, /gapCloseKind\?: 'ownerless'/);
});

test('A35 R2 keeps note without follow-up as the only gap-close source', () => {
  assert.match(baseline, /gapCloseKind\?: 'note_without_followup';/);
  assert.match(baseline, /Notatka bez follow-upu/);
  assert.match(baseline, /gapCloseKind: 'note_without_followup'/);
  assert.match(baseline, /buildNoteWithoutFollowUpOwnerControlItems/);
});

test('A35 R1 test contract no longer expects positive ownerless rows', () => {
  assert.doesNotMatch(r1Test, /A35 adds ownerless lead and case control signal/);
  assert.match(r1Test, /A35 does not add ownerless rows in single-user mode/);
  assert.match(r2Guard, /ownerless_absent_from_runtime_note_followup_kept/);
});

test('A35 R2 does not add SQL, owner fetches, or client table fetches', () => {
  assert.doesNotMatch(baseline, /case_items/);
  assert.doesNotMatch(baseline, /from\(['"]clients['"]\)/);
  assert.equal(fs.existsSync('supabase/migrations/STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE.sql'), false);
});
