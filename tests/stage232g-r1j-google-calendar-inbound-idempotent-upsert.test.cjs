const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const inbound = () => read('src/server/google-calendar-inbound.ts');
const handler = () => read('src/server/google-calendar-handler.ts');
const system = () => read('api/system.ts');

test('R1J routes sync-inbound through the single Google Calendar handler', () => {
  assert.match(system(), /if \(kind === 'google-calendar'\)/);
  assert.match(handler(), /action === 'sync-inbound'/);
  assert.match(handler(), /syncGoogleCalendarInbound\(/);
});

test('R1J checks canonical workspace/provider/external id before broad identity fallback', () => {
  const src = inbound();
  const canonical = src.indexOf('const canonicalExisting = googleId ? await findExistingGoogleCalendarWorkItemByCanonicalKey(workspaceId, googleId) : null;');
  const broad = src.indexOf('const identityExisting = googleId ? await findExistingGoogleCalendarWorkItemByAnyIdentityStage232GR7A(workspaceId, userId, googleId) : null;');
  assert.notEqual(canonical, -1);
  assert.notEqual(broad, -1);
  assert.ok(canonical < broad, 'canonical dedupe must run before broader identity matching');
  assert.match(src, /if \(canonicalExisting\) return canonicalExisting;/);
  assert.match(src, /source_provider=eq\.google_calendar&source_external_id=eq\.\$\{encode\(googleEventId\)\}/);
});

test('R1J first sync can create, second sync updates instead of creating duplicate', () => {
  const src = inbound();
  assert.match(src, /if \(existingId\) \{[\s\S]*safePatchWorkItem\(existingId, payload\)[\s\S]*action: 'updated'/);
  assert.match(src, /safeInsertWorkItem\(payload\)[\s\S]*action: 'created'/);
  assert.match(src, /source_provider: 'google_calendar'/);
  assert.match(src, /source_external_id: googleId/);
});

test('R1J changed Google event updates existing row fields', () => {
  const src = inbound();
  assert.match(src, /title: asText\(googleEvent\.summary\) \|\|/);
  assert.match(src, /scheduled_at: startAt/);
  assert.match(src, /start_at: isExistingTask \? \(existing\?\.start_at \|\| null\) : startAt/);
  assert.match(src, /end_at: isExistingTask \? \(existing\?\.end_at \|\| null\) : endAt/);
  assert.match(src, /updated_at: nowIso\(\)/);
});

test('R1J duplicate-key 23505 falls back to lookup/update and does not rely on catch-ignore', () => {
  const src = inbound();
  assert.match(src, /function isGoogleInboundDuplicateKeyError\(error: unknown\)/);
  assert.match(src, /23505/);
  assert.match(src, /duplicate key/);
  assert.match(src, /idx_work_items_google_calendar_source_external/);
  assert.match(src, /const existingAfterRace = await findExistingGoogleCalendarWorkItemByCanonicalKey\(workspaceId, googleId\)/);
  assert.match(src, /safePatchWorkItem\(existingAfterRaceId, dedupePayload\)/);
  assert.match(src, /action: 'deduped'/);
});

test('R1J invalid external id and deleted Google event are controlled non-blind-insert paths', () => {
  const src = inbound();
  assert.match(src, /if \(!googleId\) return \{ action: 'skipped', reason: 'missing_external_id'/);
  assert.match(src, /if \(googleEvent\.status === 'cancelled'\)/);
  assert.match(src, /return \{ action: 'skipped_deleted'/);
});
