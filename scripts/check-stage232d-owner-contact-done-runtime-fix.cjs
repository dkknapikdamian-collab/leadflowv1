const fs = require('fs');
const assert = require('assert');

const activityTruth = fs.readFileSync('src/lib/owner-control/activity-truth.ts', 'utf8');
const supabaseFallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(activityTruth, 'STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX', 'activity truth stage marker');
must(activityTruth, 'isStage232dContactDoneStatus', 'contact done status detector');
must(activityTruth, 'stage232dContactStatusAt', 'status-to-contact date helper');
must(activityTruth, 'stage232dStatusContactAt', 'status contact candidate');
must(activityTruth, 'stage232dPastOrNowDate', 'future date guard');
must(activityTruth, 'parsed.getTime() > now.getTime()', 'future date must not reset contact silence');

must(supabaseFallback, 'stage232dPrepareLeadContactDonePatch', 'lead patch prepare helper');
must(supabaseFallback, 'stage232dIsContactDoneLeadPatch', 'lead contact done detector');
must(supabaseFallback, 'payload.lastContactAt = contactAt', 'lastContactAt stamp');
must(supabaseFallback, "eventType: 'manual_contact_done'", 'manual_contact_done activity');
must(supabaseFallback, "leadId: String(payload.id || '')", 'entity-scoped leadId activity');
must(supabaseFallback, '/api/leads', 'lead PATCH endpoint');
must(supabaseFallback, '/api/activities', 'activity POST endpoint');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX',
  guard: 'check-stage232d-owner-contact-done-runtime-fix'
}, null, 2));
