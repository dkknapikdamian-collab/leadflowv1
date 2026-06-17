const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const activityTruth = fs.readFileSync('src/lib/owner-control/activity-truth.ts', 'utf8');
const supabaseFallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');

test('R1 stamps lastContactAt when lead patch means Kontakt wykonany / Skontaktowany', () => {
  assert.match(supabaseFallback, /stage232dPrepareLeadContactDonePatch/);
  assert.match(supabaseFallback, /payload\.lastContactAt = contactAt/);
  assert.match(supabaseFallback, /stage232dIsContactDoneLeadPatch/);
});

test('R1 writes an entity-scoped manual_contact_done activity for the same lead', () => {
  assert.match(supabaseFallback, /eventType: 'manual_contact_done'/);
  assert.match(supabaseFallback, /leadId: String\(payload\.id \|\| ''\)/);
  assert.match(supabaseFallback, /source: 'manual_contact_done'/);
});

test('R1 activity truth treats Skontaktowany as contact truth', () => {
  assert.match(activityTruth, /isStage232dContactDoneStatus/);
  assert.match(activityTruth, /skontaktowan/);
  assert.match(activityTruth, /kontakt wykonany/);
  assert.match(activityTruth, /manual_contact_done/);
  assert.match(activityTruth, /stage232dStatusContactAt/);
});

test('R1 keeps future follow-up dates from pretending to be contact', () => {
  assert.match(activityTruth, /stage232dPastOrNowDate/);
  assert.match(activityTruth, /parsed\.getTime\(\) > now\.getTime\(\)/);
});
