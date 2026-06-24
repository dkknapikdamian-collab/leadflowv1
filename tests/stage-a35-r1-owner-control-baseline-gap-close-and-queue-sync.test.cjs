const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const baseline = fs.readFileSync('src/lib/owner-control/owner-control-baseline.ts', 'utf8');
const today = fs.readFileSync('src/pages/TodayStable.tsx', 'utf8');

test('A35 keeps Owner Control as gap-close, not new Today redesign', () => {
  assert.match(baseline, /STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC/);
  assert.match(today, /STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC/);
  assert.match(today, /const actionRequiredRows = useMemo\(\(\) => ownerControlBaseline\.items/);
  assert.doesNotMatch(today, /STAGE-A35.*new tile/i);
});

test('A35 adds ownerless lead and case control signal', () => {
  assert.match(baseline, /function isOwnerlessOperationalRecord/);
  assert.match(baseline, /ownerId'.*owner_id'.*ownerEmail'.*owner_email/s);
  assert.match(baseline, /pushSignal\(signals, 'Brak odpowiedzialnego'\)/);
  assert.match(baseline, /statusLabel = 'Bez odpowiedzialnego'/);
  assert.match(baseline, /gapCloseKind: ownerless \? 'ownerless' : undefined/);
});

test('A35 adds note without task or follow-up rows through the same baseline source', () => {
  assert.match(baseline, /export function buildNoteWithoutFollowUpOwnerControlItems/);
  assert.match(baseline, /normalized\.type !== 'note'/);
  assert.match(baseline, /hasOpenPlannedActionForNoteSource/);
  assert.match(baseline, /normalized\.type === 'note'\) return null/);
  assert.match(baseline, /\.\.\.buildNoteWithoutFollowUpOwnerControlItems\(\{ items: workItems, now \}\)/);
});

test('A35 routes source entities without SQL or new client fetch', () => {
  assert.match(baseline, /return `\/leads\/\$\{encodedId\}`/);
  assert.match(baseline, /return `\/case\/\$\{encodedId\}`/);
  assert.match(baseline, /return `\/clients\/\$\{encodedId\}`/);
  assert.doesNotMatch(baseline, /case_items/);
  assert.doesNotMatch(baseline, /from\(['"]clients['"]\)/);
  assert.equal(fs.existsSync('supabase/migrations/STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC.sql'), false);
});
