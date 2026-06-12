const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('STAGE231F R1 blocks legacy workspace fallback in inbound/outbound sync modules', () => {
  const outbound = read('src/server/google-calendar-outbound.ts');
  const inbound = read('src/server/google-calendar-inbound.ts');

  assert.match(outbound, /getGoogleCalendarUserConnection/);
  assert.doesNotMatch(outbound, /getGoogleCalendarConnection\s*\(/);
  assert.match(inbound, /getGoogleCalendarUserConnection/);
  assert.doesNotMatch(inbound, /getGoogleCalendarConnection\s*\(/);
});

test('STAGE231F R1 outbound cannot sync whole workspace by default', () => {
  const outbound = read('src/server/google-calendar-outbound.ts');
  assert.match(outbound, /GOOGLE_CALENDAR_PERSONAL_SCOPE_USER_FIELDS_STAGE231F_R1/);
  assert.match(outbound, /personalScopeSkipped/);
  assert.match(outbound, /workspaceWideDefault:\s*false/);
  assert.match(outbound, /continue;/);
});

test('STAGE231F R1 inbound marks imported Google events with user scope fields', () => {
  const inbound = read('src/server/google-calendar-inbound.ts');
  assert.match(inbound, /source_user_id:\s*userId/);
  assert.match(inbound, /google_calendar_user_id:\s*userId/);
  assert.match(inbound, /owner_user_id:\s*userId/);
  assert.match(inbound, /connectionScope:\s*'user'/);
});
