const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('R3 Settings shows connect CTA instead of only disabled sync for disconnected users', () => {
  const settings = read('src/pages/Settings.tsx');
  assert.match(settings, /STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP/);
  assert.match(settings, /data-google-calendar-user-onboarding-stage232g-r3/);
  assert.match(settings, /Polacz Google Calendar/);
  assert.match(settings, /Nie poĹ‚Ä…czono\. DokoĹ„cz poĹ‚Ä…czenie Google Calendar/);
  assert.match(settings, /!googleCalendarConnected \? \(/);
});

test('R3 Settings still keeps sync and disconnect controls for connected users', () => {
  const settings = read('src/pages/Settings.tsx');
  assert.match(settings, /Synchronizuj teraz/);
  assert.match(settings, /Polaczono:/);
  assert.match(settings, /Rozlacz/);
  assert.match(settings, /handleDisconnectGoogleCalendar/);
  assert.match(settings, /handleSyncGoogleCalendarOutbound/);
});

test('R3 Calendar OAuth remains consent-based and separate from Supabase Google login', () => {
  const auth = read('src/lib/supabase-auth.ts');
  const sync = read('src/server/google-calendar-sync.ts');
  assert.match(auth, /signInWithGoogle/);
  assert.match(sync, /https:\/\/www\.googleapis\.com\/auth\/calendar\.events/);
  assert.match(sync, /prompt: 'consent'/);
  assert.match(sync, /access_type: 'offline'/);
});

test('R3 outbound remains user-scoped and fail-closed', () => {
  const outbound = read('src/server/google-calendar-outbound.ts');
  assert.match(outbound, /getGoogleCalendarUserConnection\(workspaceId, userId\)/);
  assert.match(outbound, /personalScopeSkipped/);
  assert.match(outbound, /created_by_user_id/);
  assert.equal(outbound.includes('getGoogleCalendarConnection(workspaceId'), false);
});

test('R3 task create stamps authenticated user id for personal-scope outbound sync', () => {
  const task = read('src/server/task-route-stage124f.ts');
  assert.match(task, /requireRequestIdentity/);
  assert.match(task, /requestUserIdStage232GR3/);
  assert.match(task, /created_by_user_id: requestUserIdStage232GR3 \|\| null/);
  assert.equal(task.includes('created_by_user_id: null,'), false);
});

test('R3 event create stamps authenticated user id for personal-scope outbound sync', () => {
  const event = read('src/server/event-route-stage124f.ts');
  assert.match(event, /requireRequestIdentity/);
  assert.match(event, /requestUserIdStage232GR3/);
  assert.match(event, /created_by_user_id: requestUserIdStage232GR3 \|\| null/);
  assert.equal(event.includes('created_by_user_id: null,'), false);
});
