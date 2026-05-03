const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) problems.push(message);
}

const requiredFiles = [
  'api/google-calendar.ts',
  'src/server/google-calendar-sync.ts',
  'supabase/migrations/20260503_google_calendar_sync_v1_stage01_foundation.sql',
  'docs/release/GOOGLE_CALENDAR_SYNC_V1_STAGE01_FOUNDATION_2026-05-03.md',
  'docs/integrations/GOOGLE_CALENDAR_SYNC_V1_SCOPE_2026-05-03.md',
];

for (const file of requiredFiles) assert(exists(file), 'missing file: ' + file);

const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-sync-v1-foundation']), 'missing package script check:google-calendar-sync-v1-foundation');

const server = exists('src/server/google-calendar-sync.ts') ? read('src/server/google-calendar-sync.ts') : '';
for (const marker of [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'GOOGLE_TOKEN_ENCRYPTION_KEY',
  'GOOGLE_OAUTH_STATE_SECRET',
  'calendar.events',
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'deleteGoogleCalendarEvent',
]) {
  assert(server.includes(marker), 'google calendar server helper missing marker: ' + marker);
}
assert(server.includes('aes-256-gcm'), 'google tokens must be encrypted with aes-256-gcm');
assert(!server.includes('VITE_GOOGLE_CLIENT_SECRET'), 'server must not use VITE Google client secret');

const api = exists('api/google-calendar.ts') ? read('api/google-calendar.ts') : '';
for (const marker of [
  "action === 'callback'",
  "action === 'connect'",
  "action === 'status'",
  "action === 'disconnect'",
  'assertWorkspaceWriteAccess',
  'resolveRequestWorkspaceId',
]) {
  assert(api.includes(marker), 'api/google-calendar.ts missing marker: ' + marker);
}

const sql = exists('supabase/migrations/20260503_google_calendar_sync_v1_stage01_foundation.sql')
  ? read('supabase/migrations/20260503_google_calendar_sync_v1_stage01_foundation.sql')
  : '';
for (const marker of [
  'create table if not exists public.google_calendar_connections',
  'access_token_ciphertext',
  'refresh_token_ciphertext',
  'google_calendar_event_id',
  'google_calendar_reminders',
  'enable row level security',
]) {
  assert(sql.includes(marker), 'migration missing marker: ' + marker);
}

const truth = exists('src/lib/product-truth.ts') ? read('src/lib/product-truth.ts') : '';
const googleIndex = truth.indexOf("key: 'google_calendar'");
const googleSlice = googleIndex >= 0 ? truth.slice(googleIndex, googleIndex + 700) : '';
assert(googleSlice.includes("status: 'coming_soon'"), 'foundation stage must not claim Google Calendar as active yet');

if (problems.length) {
  console.error('Google Calendar Sync V1 Stage 01 foundation guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Sync V1 Stage 01 foundation');
