const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) {
  console.error('STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE_FAIL');
  console.error('- ' + message);
  process.exit(1);
}
function expect(src, needle, label) {
  if (!src.includes(needle)) fail(label + ': missing ' + needle);
}
function before(src, a, b, label) {
  const ai = src.indexOf(a);
  const bi = src.indexOf(b);
  if (ai < 0 || bi < 0 || ai >= bi) fail(label + ': expected "' + a + '" before "' + b + '"');
}
function functionBody(src, name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) fail('missing function ' + name);
  const next = src.indexOf('\nfunction ', start + 1);
  const nextAsync = src.indexOf('\nasync function ', start + 1);
  const candidates = [next, nextAsync].filter((value) => value > start);
  const end = candidates.length ? Math.min(...candidates) : src.length;
  return src.slice(start, end);
}

const inbound = read('src/server/google-calendar-inbound.ts');
const calendar = read('src/pages/Calendar.tsx');
const eventRoute = read('src/server/event-route-stage124f.ts');
const taskRoute = read('src/server/task-route-stage124f.ts');

expect(inbound, 'STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE', 'inbound stage marker');
expect(inbound, 'GOOGLE_INBOUND_LOCAL_DELETE_TOMBSTONE_STATUSES_STAGE232G_R6', 'local tombstone statuses set');
expect(inbound, 'isLocalDeletedGoogleCalendarWorkItemStage232GR6', 'inbound local delete detector');
expect(inbound, "action: 'skipped_local_deleted'", 'inbound skipped local deleted action');
expect(inbound, "reason: 'local_delete_tombstone'", 'inbound skip reason');

const applyIndex = inbound.indexOf('async function applyGoogleEvent');
if (applyIndex < 0) fail('missing applyGoogleEvent');
const apply = inbound.slice(applyIndex);
before(apply, 'isLocalDeletedGoogleCalendarWorkItemStage232GR6(existing)', 'const payload = basePayload(workspaceId, userId, googleEvent, existing, conflicts);', 'local tombstone skip must happen before active Google payload patch');
before(apply, "action: 'skipped_local_deleted'", 'safePatchWorkItem(existingId, payload)', 'skip must happen before existing row patch');

const helper = functionBody(inbound, 'isLocalDeletedGoogleCalendarWorkItemStage232GR6');
expect(helper, 'deleted_at', 'helper recognizes deleted_at');
expect(helper, 'local_deleted_at', 'helper recognizes local_deleted_at');
expect(helper, 'source_deleted_at', 'helper recognizes source_deleted_at');
expect(helper, 'show_in_calendar', 'helper checks show_in_calendar');
expect(helper, 'show_in_tasks', 'helper checks show_in_tasks');
expect(helper, 'source_external_id', 'helper checks source external id');
expect(helper, 'google_calendar_event_id', 'helper checks Google event id');

expect(inbound, "show_in_calendar: true", 'inbound active payload can show calendar, so tombstone guard is required');
expect(eventRoute, "status: 'deleted'", 'event delete route sets deleted status');
expect(eventRoute, 'show_in_calendar: false', 'event delete route hides calendar');
expect(eventRoute, 'show_in_tasks: false', 'event delete route hides tasks');
expect(taskRoute, "status: 'deleted'", 'task delete route sets deleted status');
expect(taskRoute, 'show_in_calendar: false', 'task delete route hides calendar');
expect(taskRoute, 'show_in_tasks: false', 'task delete route hides tasks');
expect(calendar, 'deleteEventFromSupabase(sourceId)', 'Calendar delete event uses local delete');
expect(calendar, 'deleteTaskFromSupabase(sourceId)', 'Calendar delete task uses local delete');
expect(calendar, 'refreshSupabaseBundle()', 'Calendar refresh can reveal resurrection if inbound reactivates row');

console.log(JSON.stringify({
  stage: 'STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE',
  ok: true,
  scope: 'Google inbound sync skips local deleted/tombstoned Google-linked rows instead of resurrecting them.'
}, null, 2));
