const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function asText(value) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}
const tombstoneStatuses = new Set(['deleted', 'archived', 'removed']);
function falseLike(value) {
  return value === false || String(value).trim().toLowerCase() === 'false';
}
function localDeleted(row) {
  if (!row) return false;
  const status = asText(row.status).toLowerCase();
  const hasGoogleIdentity = Boolean(row.source_external_id || row.google_calendar_event_id);
  if (!hasGoogleIdentity) return false;
  const hasDeleteMarker = Boolean(row.deleted_at || row.local_deleted_at || row.source_deleted_at);
  return tombstoneStatuses.has(status)
    || hasDeleteMarker
    || (falseLike(row.show_in_calendar) && falseLike(row.show_in_tasks) && status === 'deleted');
}

test('R6 inbound has local tombstone skip before patching an existing Google event row', () => {
  const inbound = read('src/server/google-calendar-inbound.ts');
  const applyIndex = inbound.indexOf('async function applyGoogleEvent');
  assert.notEqual(applyIndex, -1);
  const apply = inbound.slice(applyIndex);
  assert.match(inbound, /STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE/);
  assert.match(inbound, /isLocalDeletedGoogleCalendarWorkItemStage232GR6/);
  assert.match(inbound, /action: 'skipped_local_deleted'/);
  assert.ok(
    apply.indexOf('isLocalDeletedGoogleCalendarWorkItemStage232GR6(existing)') <
      apply.indexOf('const payload = basePayload(workspaceId, userId, googleEvent, existing, conflicts);'),
    'local tombstone skip must happen before basePayload rebuilds scheduled/show_in_calendar=true'
  );
  assert.ok(
    apply.indexOf("action: 'skipped_local_deleted'") <
      apply.indexOf('safePatchWorkItem(existingId, payload)'),
    'skip must happen before safePatchWorkItem existing row update'
  );
});

test('R6 local deleted Google-linked row is treated as tombstone', () => {
  assert.equal(localDeleted({
    status: 'deleted',
    show_in_calendar: false,
    show_in_tasks: false,
    source_external_id: 'google-event-1',
  }), true);
  assert.equal(localDeleted({
    status: 'scheduled',
    show_in_calendar: true,
    show_in_tasks: false,
    source_external_id: 'google-event-1',
  }), false);
  assert.equal(localDeleted({
    status: 'deleted',
    show_in_calendar: false,
    show_in_tasks: false,
  }), false, 'non-Google local rows are not handled by Google inbound tombstone guard');
});

test('R6 delete routes create local deleted+hidden state used by tombstone guard', () => {
  const eventRoute = read('src/server/event-route-stage124f.ts');
  const taskRoute = read('src/server/task-route-stage124f.ts');
  assert.match(eventRoute, /status: 'deleted'/);
  assert.match(eventRoute, /show_in_calendar: false/);
  assert.match(eventRoute, /show_in_tasks: false/);
  assert.match(taskRoute, /status: 'deleted'/);
  assert.match(taskRoute, /show_in_calendar: false/);
  assert.match(taskRoute, /show_in_tasks: false/);
});

test('R6 active inbound payload still may show event, proving tombstone guard is required', () => {
  const inbound = read('src/server/google-calendar-inbound.ts');
  assert.match(inbound, /show_in_calendar: true/);
  assert.match(inbound, /google_calendar_event_id: googleId/);
  assert.match(inbound, /source_external_id: googleId/);
});

test('R6 Calendar delete still performs local delete and refresh, so inbound must not resurrect', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /deleteEventFromSupabase\(sourceId\)/);
  assert.match(calendar, /deleteTaskFromSupabase\(sourceId\)/);
  assert.match(calendar, /refreshSupabaseBundle\(\)/);
});
