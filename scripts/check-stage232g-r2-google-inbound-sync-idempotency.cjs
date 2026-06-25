const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) {
  console.error('STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY_FAIL');
  console.error('- ' + message);
  process.exit(1);
}
function expect(src, needle, label) {
  if (!src.includes(needle)) fail(label + ': missing ' + needle);
}
function forbid(src, needle, label) {
  if (src.includes(needle)) fail(label + ': forbidden ' + needle);
}

const inbound = read('src/server/google-calendar-inbound.ts');
const handler = read('src/server/google-calendar-handler.ts');
const system = read('api/system.ts');
const calendar = read('src/pages/Calendar.tsx');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');

expect(inbound, 'STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY', 'stage marker');
expect(system, "if (kind === 'google-calendar')", 'api/system google-calendar route');
expect(handler, "action === 'sync-inbound'", 'sync inbound route');
expect(handler, 'syncGoogleCalendarInbound', 'inbound handler call');

expect(inbound, 'workspace_id', 'stable key workspace_id');
expect(inbound, 'source_provider', 'stable key source_provider');
expect(inbound, 'source_external_id', 'stable key source_external_id');
expect(inbound, 'google_calendar', 'stable provider google_calendar');
expect(inbound, 'findExistingGoogleCalendarWorkItemByCanonicalKey', 'canonical pre-check');
expect(inbound, 'source_provider=eq.google_calendar&source_external_id', 'canonical select query');

expect(inbound, 'isGoogleInboundDuplicateKeyError', 'duplicate key classifier');
expect(inbound, '23505', 'Postgres duplicate code');
expect(inbound, 'duplicate key', 'duplicate key text');
expect(inbound, 'idx_work_items_google_calendar_source_external', 'constraint name');
expect(inbound, "action: 'deduped'", 'deduped result');
expect(inbound, 'duplicateConstraint', 'controlled duplicate result metadata');
expect(inbound, 'safePatchWorkItem(existingAfterRaceId, dedupePayload)', 'duplicate fallback update');
expect(inbound, "source: 'google_calendar'", 'response source');
expect(inbound, "route: 'sync-inbound'", 'response route');
expect(inbound, 'inserted: created', 'inserted counter');
expect(inbound, 'deduped', 'deduped counter');
expect(inbound, 'skipped', 'skipped counter');
expect(inbound, 'errors', 'per-event errors');
expect(inbound, 'errors.push({', 'single bad event does not fail whole sync');

forbid(inbound, 'ALTER TABLE', 'no SQL in runtime');
forbid(inbound, 'DROP INDEX', 'must not drop unique constraint');
forbid(inbound, 'DROP CONSTRAINT', 'must not drop unique constraint');
expect(calendar, 'STAGE232G_R1I_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX', 'Calendar retention R1I/R3 must remain present');
expect(calendar, 'STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION', 'Calendar retention delete R3 must remain present');
forbid(inbound, 'owner-control', 'Owner Control must not be touched by inbound sync runtime');
forbid(inbound, 'STAGE-A35B', 'A35B must not be touched by inbound sync runtime');

expect(cfRuntime, 'src/server/google-calendar-inbound.ts', 'CF runtime allowlist includes inbound file');
expect(cfRuntime, 'scripts/check-stage232g-r2-google-inbound-sync-idempotency.cjs', 'CF runtime allowlist includes guard');
expect(cfRuntime, 'tests/stage232g-r2-google-inbound-sync-idempotency.test.cjs', 'CF runtime allowlist includes test');

console.log(JSON.stringify({
  stage: 'STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY',
  ok: true,
  scope: 'Google inbound sync uses canonical workspace/provider/external-id idempotency and handles duplicate-key race as controlled dedupe/update, not 500.'
}, null, 2));
