const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) {
  console.error('STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_OWNER_STAMP_FAIL');
  console.error('- ' + message);
  process.exit(1);
}
function expect(src, needle, label) {
  if (!src.includes(needle)) fail(label + ': missing ' + needle);
}
function forbid(src, needle, label) {
  if (src.includes(needle)) fail(label + ': forbidden ' + needle);
}

const settings = read('src/pages/Settings.tsx');
const task = read('src/server/task-route-stage124f.ts');
const event = read('src/server/event-route-stage124f.ts');
const outbound = read('src/server/google-calendar-outbound.ts');
const sync = read('src/server/google-calendar-sync.ts');
const auth = read('src/lib/supabase-auth.ts');

expect(settings, 'STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP', 'Settings stage marker');
expect(settings, 'data-google-calendar-user-onboarding-stage232g-r3', 'Settings onboarding action row');
expect(settings, 'Polacz Google Calendar', 'Disconnected connect CTA');
expect(settings, 'Nie poĹ‚Ä…czono. DokoĹ„cz poĹ‚Ä…czenie Google Calendar', 'Disconnected explanatory copy');
expect(settings, 'Polaczono:', 'Connected account label');
expect(settings, 'Rozlacz', 'Disconnect action');
expect(settings, 'handleConnectGoogleCalendar', 'connect handler still present');
expect(settings, 'handleDisconnectGoogleCalendar', 'disconnect handler still present');
expect(settings, 'handleSyncGoogleCalendarOutbound', 'sync handler still present');
expect(settings, '!googleCalendarConnected ? (', 'connect-first branch');
expect(settings, 'googleCalendarConnected', 'connected branch');

expect(auth, 'signInWithGoogle', 'Supabase Google auth exists');
expect(sync, 'https://www.googleapis.com/auth/calendar.events', 'Calendar OAuth has calendar scope');
expect(sync, "prompt: 'consent'", 'Calendar OAuth consent remains');
expect(sync, "access_type: 'offline'", 'Calendar OAuth offline refresh remains');

expect(outbound, 'getGoogleCalendarUserConnection(workspaceId, userId)', 'Outbound user-scoped connection remains');
expect(outbound, 'personalScopeSkipped', 'Outbound fail-closed personal scope remains');
expect(outbound, 'created_by_user_id', 'Outbound checks created_by_user_id');

expect(task, 'requireRequestIdentity', 'Task route gets authenticated identity');
expect(task, 'requestUserIdStage232GR3', 'Task route request user marker');
expect(task, 'created_by_user_id: requestUserIdStage232GR3 || null', 'Task POST stamps created_by_user_id');
expect(event, 'requireRequestIdentity', 'Event route gets authenticated identity');
expect(event, 'requestUserIdStage232GR3', 'Event route request user marker');
expect(event, 'created_by_user_id: requestUserIdStage232GR3 || null', 'Event POST stamps created_by_user_id');

forbid(task, 'created_by_user_id: null,', 'Task route must not create new task with null creator');
forbid(event, 'created_by_user_id: null,', 'Event route must not create new event with null creator');
forbid(outbound, 'getGoogleCalendarConnection(workspaceId', 'Outbound must not fall back to workspace Google token for ordinary user');

console.log(JSON.stringify({
  stage: 'STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP',
  ok: true,
  scope: 'Disconnected users get Google Calendar connect CTA; new task/event rows are stamped with request user for user-scoped outbound sync.'
}, null, 2));
