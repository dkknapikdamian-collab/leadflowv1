const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function fail(message) {
  console.error(`STAGE231F_GOOGLE_CALENDAR_USER_SCOPE_FAIL: ${message}`);
  process.exit(1);
}

function requireFile(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) fail(`Missing file: ${file}`);
  return read(file);
}

function mustInclude(text, needle, label) {
  if (!text.includes(needle)) fail(`Missing ${label}: ${needle}`);
}

function mustMatch(text, pattern, label) {
  if (!pattern.test(text)) fail(`Missing ${label}: ${pattern}`);
}

const helper = requireFile('src/server/google-calendar-user-scope.ts');
const handler = requireFile('src/server/google-calendar-handler.ts');
const sync = requireFile('src/server/google-calendar-sync.ts');
const settings = requireFile('src/pages/Settings.tsx');
const plans = requireFile('src/lib/plans.ts');
const testFile = requireFile('tests/stage231f-google-calendar-user-scope.test.cjs');

mustInclude(helper, 'getGoogleCalendarUserConnection', 'user scoped connection helper');
mustInclude(helper, '`user_id=eq.${encode(user)}`', 'exact user id filter');
mustInclude(helper, 'Never borrow a workspace fallback token', 'fallback protection note');
mustMatch(helper, /current\s*=\s*await getGoogleCalendarUserConnection\(workspaceId, userId\)/, 'exact current connection lookup for upsert');

mustInclude(handler, 'upsertGoogleCalendarUserConnection', 'user scoped callback upsert');
mustInclude(handler, 'decodeGoogleAccountEmailFromIdToken', 'account email extraction');
mustInclude(handler, 'getGoogleCalendarUserConnection(workspaceId, userId)', 'status exact user connection lookup');
mustInclude(handler, 'getGoogleCalendarLegacyWorkspaceConnection(workspaceId, userId)', 'legacy workspace connection detection');
mustInclude(handler, 'connected: Boolean(connection)', 'legacy workspace connection is not reported as connected');
mustInclude(handler, "connectionScope: connection ? 'user' : legacyConnection ? 'workspace_legacy' : 'none'", 'connection scope state');
mustInclude(handler, "reason: 'user_not_connected'", 'no current user connection reason');
mustInclude(handler, "connectionScope: 'none'", 'sync no-connection scope');
mustInclude(handler, 'syncGoogleCalendarInbound', 'inbound sync route still wired');
mustInclude(handler, 'syncGoogleCalendarOutbound', 'outbound sync route still wired');

mustInclude(sync, 'workspaceId: input.workspaceId', 'OAuth state workspaceId');
mustInclude(sync, 'userId: input.userId', 'OAuth state userId');
mustInclude(sync, 'if (!data?.workspaceId || !data?.userId)', 'OAuth state verification requires workspaceId + userId');

mustInclude(settings, 'canUseGoogleCalendarByPlan', 'Settings plan gate');
mustInclude(settings, 'access?.features?.googleCalendar', 'Settings plan feature source');
mustInclude(settings, 'DISABLED_BY_PLAN', 'Settings blocked by plan state');
mustInclude(settings, 'handleConnectGoogleCalendar', 'Settings connect handler');
mustInclude(settings, 'handleDisconnectGoogleCalendar', 'Settings disconnect handler');
mustInclude(settings, 'handleSyncGoogleCalendarOutbound', 'Settings outbound sync handler');
mustInclude(settings, 'Google Calendar wymaga konfiguracji w Vercel', 'server not configured user copy');

mustInclude(plans, 'googleCalendar: PLAN_IDS.pro', 'Google Calendar minimum plan');
mustMatch(plans, /const PRO_FEATURES[\s\S]*googleCalendar:\s*true/, 'Google Calendar enabled in Pro features');
mustMatch(plans, /const BASIC_FEATURES[\s\S]*browserNotifications:\s*true/, 'Basic remains lower than Google Calendar');

mustInclude(testFile, 'legacy_workspace_connection', 'test protects legacy workspace state');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX',
  contract: 'central app setup, per-user consent, user-scoped storage, no silent workspace fallback for ordinary sync routes',
}, null, 2));
