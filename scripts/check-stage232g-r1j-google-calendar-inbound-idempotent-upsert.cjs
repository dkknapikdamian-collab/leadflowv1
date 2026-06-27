const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) {
  console.error('STAGE232G_R1J_GOOGLE_CALENDAR_INBOUND_SYNC_IDEMPOTENT_UPSERT_FAIL');
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
const reportPath = '_project/runs/STAGE232G_R1J_GOOGLE_CALENDAR_INBOUND_SYNC_IDEMPOTENT_UPSERT.md';
const report = fs.existsSync(path.join(root, reportPath)) ? read(reportPath) : '';

expect(inbound, 'STAGE232G_R1J_GOOGLE_CALENDAR_INBOUND_SYNC_IDEMPOTENT_UPSERT', 'R1J marker');
expect(system, "if (kind === 'google-calendar')", 'system route');
expect(handler, "action === 'sync-inbound'", 'sync-inbound route');
expect(handler, 'syncGoogleCalendarInbound', 'sync-inbound source of truth');

expect(inbound, 'findExistingGoogleCalendarWorkItemByCanonicalKey', 'canonical key helper');
expect(inbound, 'workspace_id=eq.${encode(workspaceId)}&source_provider=eq.google_calendar&source_external_id=eq.${encode(googleEventId)}', 'workspace-aware canonical select');
expect(inbound, 'const canonicalExisting = googleId ? await findExistingGoogleCalendarWorkItemByCanonicalKey(workspaceId, googleId) : null;', 'canonical lookup before broader identity');
expect(inbound, 'if (canonicalExisting) return canonicalExisting;', 'canonical row wins');
expect(inbound, 'const identityExisting = googleId ? await findExistingGoogleCalendarWorkItemByAnyIdentityStage232GR7A(workspaceId, userId, googleId) : null;', 'broader identity fallback remains');
expect(inbound, "source_provider: 'google_calendar'", 'provider payload');
expect(inbound, 'source_external_id: googleId', 'external id payload');

expect(inbound, 'if (existingId) {', 'existing update path');
expect(inbound, 'safePatchWorkItem(existingId, payload)', 'existing update uses patch');
expect(inbound, 'safeInsertWorkItem(payload)', 'missing row create path');
expect(inbound, 'isGoogleInboundDuplicateKeyError', 'duplicate-key classifier');
expect(inbound, '23505', 'Postgres duplicate code');
expect(inbound, 'idx_work_items_google_calendar_source_external', 'unique index name');
expect(inbound, 'safePatchWorkItem(existingAfterRaceId, dedupePayload)', 'duplicate-key fallback updates existing row');
expect(inbound, "action: 'deduped'", 'duplicate-key controlled result');
expect(inbound, "if (!googleId) return { action: 'skipped', reason: 'missing_external_id'", 'missing external id skip');
expect(inbound, "googleEvent.status === 'cancelled'", 'cancelled/deleted branch');

forbid(inbound, 'ALTER TABLE', 'no SQL migration in runtime');
forbid(inbound, 'DROP INDEX', 'must not drop unique index');
forbid(inbound, 'DROP CONSTRAINT', 'must not drop unique constraint');
forbid(inbound, 'catch (error) {\n    return', 'must not catch-and-ignore duplicate errors');
forbid(inbound, 'owner-control', 'finance/owner-control out of scope');
forbid(inbound, 'commission', 'commission out of scope');
forbid(inbound, 'billing', 'billing out of scope');

if (!report) fail('run report missing: ' + reportPath);
expect(report, 'INBOUND_SYNC_SOURCE_OF_TRUTH', 'run report source-of-truth section');
expect(report, 'MANUAL_GOOGLE_SYNC_NOT_EXECUTED', 'manual Google sync status');

const status = execFileSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' });
if (/00_OBSIDIAN_VAULT|obsidian_updates/i.test(status)) fail('Obsidian files must not be touched in repo status');

console.log(JSON.stringify({
  stage: 'STAGE232G_R1J_GOOGLE_CALENDAR_INBOUND_SYNC_IDEMPOTENT_UPSERT',
  ok: true,
  scope: 'Inbound sync updates canonical workspace/provider/external-id rows before broader Google identity matches and keeps duplicate-key fallback non-500.'
}, null, 2));
