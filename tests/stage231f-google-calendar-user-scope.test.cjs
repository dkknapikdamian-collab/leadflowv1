const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Google Calendar helper fetches only the current workspaceId + userId connection', () => {
  const helper = read('src/server/google-calendar-user-scope.ts');
  assert.match(helper, /getGoogleCalendarUserConnection/);
  assert.match(helper, /workspace_id=eq\.\$\{encode\(workspace\)\}/);
  assert.match(helper, /user_id=eq\.\$\{encode\(user\)\}/);
  assert.match(helper, /isUserScopedGoogleCalendarConnection\(connection, user\)/);
  assert.match(helper, /Never borrow a workspace fallback token/);
});

test('Google Calendar callback stores OAuth tokens under the verified user scope', () => {
  const handler = read('src/server/google-calendar-handler.ts');
  assert.match(handler, /verifyGoogleOAuthState\(state\)/);
  assert.match(handler, /upsertGoogleCalendarUserConnection/);
  assert.match(handler, /workspaceId: verified\.workspaceId/);
  assert.match(handler, /userId: verified\.userId/);
  assert.doesNotMatch(handler, /upsertGoogleCalendarConnection\(/);
});

test('Google Calendar status exposes legacy workspace connection without marking current user connected', () => {
  const handler = read('src/server/google-calendar-handler.ts');
  assert.match(handler, /getGoogleCalendarUserConnection\(workspaceId, userId\)/);
  assert.match(handler, /getGoogleCalendarLegacyWorkspaceConnection\(workspaceId, userId\)/);
  assert.match(handler, /connected:\s*Boolean\(connection\)/);
  assert.match(handler, /connectionScope:\s*connection \? 'user' : legacyConnection \? 'workspace_legacy' : 'none'/);
  assert.match(handler, /reason/);
  assert.match(handler, /legacy_workspace_connection/);
});

test('Google Calendar sync routes stop before sync when the current user has no own connection', () => {
  const handler = read('src/server/google-calendar-handler.ts');
  assert.match(handler, /action === 'sync-inbound'/);
  assert.match(handler, /action === 'sync-outbound'/);
  assert.match(handler, /user_not_connected/);
  assert.match(handler, /connectionScope: 'none'/);
  assert.match(handler, /syncGoogleCalendarInbound/);
  assert.match(handler, /syncGoogleCalendarOutbound/);
});

test('OAuth state still contains workspaceId and userId', () => {
  const sync = read('src/server/google-calendar-sync.ts');
  assert.match(sync, /workspaceId: input\.workspaceId/);
  assert.match(sync, /userId: input\.userId/);
  assert.match(sync, /if \(!data\?\.workspaceId \|\| !data\?\.userId\)/);
});
