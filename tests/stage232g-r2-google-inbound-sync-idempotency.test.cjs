const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const inbound = () => read('src/server/google-calendar-inbound.ts');
const handler = () => read('src/server/google-calendar-handler.ts');
const system = () => read('api/system.ts');
const calendar = () => read('src/pages/Calendar.tsx');

test('R2 routes api/system google-calendar sync-inbound to the real inbound handler', () => {
  assert.match(system(), /if \(kind === 'google-calendar'\)/);
  assert.match(handler(), /action === 'sync-inbound'/);
  assert.match(handler(), /syncGoogleCalendarInbound\(/);
});

test('R2 uses canonical Google event key before insert', () => {
  const src = inbound();
  assert.match(src, /STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY/);
  assert.match(src, /function findExistingGoogleCalendarWorkItemByCanonicalKey\(workspaceId: string, googleEventId: string\)/);
  assert.match(src, /source_provider=eq\.google_calendar&source_external_id=eq\.\$\{encode\(googleEventId\)\}/);
  assert.match(src, /const canonicalExisting = googleId \? await findExistingGoogleCalendarWorkItemByCanonicalKey\(workspaceId, googleId\) : null;/);
});

test('R2 handles duplicate-key race as deduped update, not thrown 500', () => {
  const src = inbound();
  assert.match(src, /function isGoogleInboundDuplicateKeyError\(error: unknown\)/);
  assert.match(src, /23505/);
  assert.match(src, /duplicate key/);
  assert.match(src, /idx_work_items_google_calendar_source_external/);
  assert.match(src, /if \(!isGoogleInboundDuplicateKeyError\(error\)\) throw error;/);
  assert.match(src, /safePatchWorkItem\(existingAfterRaceId, dedupePayload\)/);
  assert.match(src, /action: 'deduped'/);
});

test('R2 endpoint exposes controlled counters and per-event errors', () => {
  const src = inbound();
  assert.match(src, /source: 'google_calendar'/);
  assert.match(src, /route: 'sync-inbound'/);
  assert.match(src, /inserted: created/);
  assert.match(src, /deduped/);
  assert.match(src, /skipped/);
  assert.match(src, /errors\.push\(\{/);
  assert.match(src, /externalId:/);
});

test('R2 preserves manual and existing rows through update instead of blind duplicate insert', () => {
  const src = inbound();
  assert.match(src, /if \(existingId\) \{[\s\S]*safePatchWorkItem\(existingId, payload\)/);
  assert.match(src, /const isExistingTask = asText\(existing\?\.record_type \|\| existing\?\.recordType\)\.toLowerCase\(\) === 'task';/);
  assert.match(src, /record_type: isExistingTask \? 'task' : 'event'/);
});

test('R2 does not touch Calendar retention R1I/R3 or Owner Control/A35B', () => {
  assert.match(calendar(), /STAGE232G_R1I_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX/);
  assert.match(calendar(), /STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION/);
  assert.equal(inbound().includes('owner-control'), false);
  assert.equal(inbound().includes('STAGE-A35B'), false);
});
