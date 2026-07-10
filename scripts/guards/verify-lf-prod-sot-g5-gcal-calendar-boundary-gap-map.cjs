const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const mapBase = path.join(vault, '10_PROJEKTY', 'CloseFlow_Lead_App', '04_NAPRAWA_ZRODLA_PRAWDY');

const APP_INPUT_HEAD = 'fa44c9aed16be191915b38ffd184605aa8be0deb';
const VAULT_INPUT_HEAD = 'da61c4bb8f7765ae58c95756f549b2fdeb76318c';
const NEXT_STAGE = 'LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION';

const rel = {
  report: '_project/runs/LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md',
  guard: 'scripts/guards/verify-lf-prod-sot-g5-gcal-calendar-boundary-gap-map.cjs',
  test: 'tests/lf-prod-sot-g5-gcal-calendar-boundary-gap-map.test.cjs',
  map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md',
  router: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  g3r1Report: '_project/runs/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE.md',
  g3r1Map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE_MAP.md',
  g1Map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G1_GLOBAL_CODE_REALITY_PRECHECK_AND_SOT_ROUTER_MAP.md',
};

const files = {
  calendarItems: path.join(root, 'src', 'lib', 'calendar-items.ts'),
  calendarPage: path.join(root, 'src', 'pages', 'Calendar.tsx'),
  settings: path.join(root, 'src', 'pages', 'Settings.tsx'),
  supabaseFallback: path.join(root, 'src', 'lib', 'supabase-fallback.ts'),
  reminderPrefs: path.join(root, 'src', 'lib', 'google-calendar-reminder-preferences.ts'),
  vercel: path.join(root, 'vercel.json'),
  apiSystem: path.join(root, 'api', 'system.ts'),
  handler: path.join(root, 'src', 'server', 'google-calendar-handler.ts'),
  userScope: path.join(root, 'src', 'server', 'google-calendar-user-scope.ts'),
  sync: path.join(root, 'src', 'server', 'google-calendar-sync.ts'),
  inbound: path.join(root, 'src', 'server', 'google-calendar-inbound.ts'),
  outbound: path.join(root, 'src', 'server', 'google-calendar-outbound.ts'),
  taskRoute: path.join(root, 'src', 'server', 'task-route-stage124f.ts'),
  eventRoute: path.join(root, 'src', 'server', 'event-route-stage124f.ts'),
  timezone: path.join(root, 'src', 'lib', 'calendar-timezone-contract.ts'),
  readonlyDate: path.join(root, 'src', 'lib', 'source-of-truth', 'calendar-date-time-boundary-readonly-runtime.ts'),
  readonlyStatus: path.join(root, 'src', 'lib', 'source-of-truth', 'calendar-status-date-readonly-runtime.ts'),
  operational: path.join(root, 'src', 'lib', 'calendar-operational-entry-contract.ts'),
};

function read(file, label = file) {
  assert.equal(fs.existsSync(file), true, `missing ${label}: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function must(text, token, label) {
  assert.equal(text.includes(token), true, `${label}: missing ${token}`);
}

function mustNot(text, token, label) {
  assert.equal(text.includes(token), false, `${label}: forbidden ${token}`);
}

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function assertAncestor(cwd, ancestor) {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', ancestor, 'HEAD'], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, `input head is not ancestor: ${ancestor}`);
}

function parseStatus(cwd) {
  const text = execFileSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  if (!text.trim()) return [];
  return text.split(/\r?\n/).filter(Boolean).map((line) => {
    let value = line.slice(3).trim();
    const arrow = value.lastIndexOf(' -> ');
    if (arrow >= 0) value = value.slice(arrow + 4);
    if (value.startsWith('"') && value.endsWith('"')) {
      try { value = JSON.parse(value); } catch {}
    }
    return value.replaceAll('\\', '/');
  });
}

function committedSince(cwd, inputHead) {
  const text = git(cwd, ['diff', '--name-only', `${inputHead}..HEAD`]);
  return text ? text.split(/\r?\n/).filter(Boolean).map((x) => x.replaceAll('\\', '/')) : [];
}

function stagePaths(cwd, inputHead) {
  return [...new Set([...committedSince(cwd, inputHead), ...parseStatus(cwd)])].sort();
}

function assertAllowedScope(cwd, inputHead, allowed, kind) {
  assertAncestor(cwd, inputHead);
  for (const file of stagePaths(cwd, inputHead)) {
    if (kind === 'APP' && file.startsWith('src/')) throw new Error(`STOP_G5_SRC_CHANGE: ${file}`);
    assert.equal(allowed.has(file), true, `G5_FORBIDDEN_${kind}_CHANGE: ${file}`);
  }
}

function assertNoStagePrefix(dir, prefix, label) {
  if (!fs.existsSync(dir)) return;
  const matches = fs.readdirSync(dir).filter((name) => name.startsWith(prefix));
  assert.deepEqual(matches, [], `${label} must not exist: ${matches.join(', ')}`);
}

assert.equal(git(root, ['branch', '--show-current']), 'dev-rollout-freeze', 'STOP_BRANCH_MISMATCH');
assert.equal(git(vault, ['branch', '--show-current']), 'main', 'STOP_OBSIDIAN_BRANCH_MISMATCH');

const appAllowed = new Set([
  'package.json',
  rel.guard,
  rel.test,
  rel.report,
]);
const vaultAllowed = new Set([
  rel.map,
  rel.router,
]);
assertAllowedScope(root, APP_INPUT_HEAD, appAllowed, 'APP');
assertAllowedScope(vault, VAULT_INPUT_HEAD, vaultAllowed, 'OBSIDIAN');

const pkg = JSON.parse(read(path.join(root, 'package.json'), 'package.json'));
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g5-gcal-calendar-boundary-gap-map.cjs && node --test tests/lf-prod-sot-g5-gcal-calendar-boundary-gap-map.test.cjs';
assert.equal(pkg.scripts?.['verify:lf-prod-sot-g5'], exactAlias, 'G5 package alias must be exact');

const g3r1Report = read(path.join(root, rel.g3r1Report), 'G3-R1 app report');
const g3r1Map = read(path.join(vault, rel.g3r1Map), 'G3-R1 map');
const g1Map = read(path.join(vault, rel.g1Map), 'G1 map');
for (const doc of [g3r1Report, g3r1Map]) {
  must(doc, 'PASS_CASEDETAIL_LANE_STOP_CONFIRMED', 'G3-R1 prerequisite');
  must(doc, 'NEXT_STAGE_SELECTED: LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP', 'G3-R1 route');
  must(doc, 'G5_CREATED: NO', 'G3-R1 prerequisite');
}
must(g1Map, '| GCal / Calendar |', 'G1 independent GCal lane');

const code = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file, key)]));

must(code.calendarItems, 'syncGoogleCalendarInboundInSupabase', 'calendar-items inbound import');
must(code.calendarItems, 'const GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_THROTTLE_MS = 60_000', 'calendar-items throttle');
must(code.calendarItems, 'syncGoogleCalendarInboundInSupabase({', 'calendar-items inbound call');
must(code.calendarItems, 'console.warn(\'GOOGLE_CALENDAR_STAGE120_BACKGROUND_INBOUND_PULL_FAILED\'', 'calendar-items weak error channel');
must(code.calendarItems, 'return null;', 'calendar-items null failure result');

must(code.calendarPage, 'syncGoogleCalendarInboundForCalendar', 'Calendar inbound trigger import');
mustNot(code.calendarPage, 'syncGoogleCalendarOutboundInSupabase', 'Calendar no outbound helper');
mustNot(code.calendarPage, 'route=sync-outbound', 'Calendar no outbound API call');

must(code.settings, "fetch('/api/google-calendar?route=sync-outbound'", 'Settings manual outbound');
must(code.settings, "body: JSON.stringify({ mode: 'all', limit: 200, daysBack: 30, daysForward: 365 })", 'Settings manual outbound mode');

must(code.supabaseFallback, 'applyGoogleCalendarReminderPreferenceToEventPayload', 'client reminder payload application');
must(code.supabaseFallback, 'export async function syncGoogleCalendarOutboundInSupabase', 'client outbound helper');
must(code.supabaseFallback, 'export async function syncGoogleCalendarInboundInSupabase', 'client inbound helper');

must(code.reminderPrefs, 'GOOGLE_CALENDAR_REMINDER_METHOD_STORAGE_KEY', 'browser reminder preference storage');
must(code.reminderPrefs, 'googleCalendarReminderMethod: existingMethod || preference.method', 'client reminder method payload');
must(code.reminderPrefs, 'googleCalendarReminderMinutesBefore: existingMinutes ?? preference.minutesBefore', 'client reminder minutes payload');

must(code.vercel, '"source": "/api/google-calendar"', 'Vercel GCal rewrite source');
must(code.vercel, '"destination": "/api/system?kind=google-calendar"', 'Vercel GCal rewrite destination');

must(code.apiSystem, "import googleCalendarHandler from '../src/server/google-calendar-handler.js';", 'API handler import');
must(code.apiSystem, "if (kind === 'google-calendar')", 'API handler dispatch');

must(code.handler, "if (req.method === 'POST' && action === 'sync-inbound')", 'handler inbound route');
must(code.handler, "if (req.method === 'POST' && (action === 'sync-outbound' || action === 'sync-now'))", 'handler outbound route');
must(code.handler, 'getGoogleCalendarUserConnection(workspaceId, userId)', 'handler exact user connection');
must(code.handler, "connectionScope: 'user'", 'handler user scope response');

must(code.userScope, 'export async function getGoogleCalendarUserConnection', 'user connection owner');
must(code.userScope, '`workspace_id=eq.${encode(workspace)}`', 'user scope workspace filter');
must(code.userScope, '`user_id=eq.${encode(user)}`', 'user scope user filter');
must(code.userScope, 'export async function getGoogleCalendarLegacyWorkspaceConnection', 'legacy workspace helper');

must(code.sync, 'export async function getGoogleCalendarConnection', 'legacy lower-level fallback');
must(code.sync, "'sync_enabled=eq.true'", 'legacy workspace fallback branch');

must(code.inbound, 'workspace_id/source_provider/source_external_id idempotency', 'inbound canonical identity marker');
must(code.inbound, 'findExistingGoogleCalendarWorkItemByCanonicalKey', 'inbound canonical identity');
must(code.inbound, 'Duplicate titles are allowed; this intentionally does not match by title.', 'inbound title not identity');
must(code.inbound, 'isLocalDeletedGoogleCalendarWorkItemStage232GR6', 'inbound tombstone');
must(code.inbound, 'listGoogleCalendarEvents(connection', 'inbound remote list');
must(code.inbound, 'nextSyncToken: listed.nextSyncToken || null', 'inbound response token');

must(code.outbound, 'googleCalendarPersonalScopeForRowStage231F', 'outbound personal scope');
must(code.outbound, 'fail closed. Do not push the entire workspace', 'outbound fail closed');
must(code.outbound, "new Set(['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed'])", 'outbound remote delete statuses');
must(code.outbound, 'function shouldIncludeByMode', 'outbound eligibility');
must(code.outbound, 'function normalizeGoogleCalendarEvent', 'outbound mapper');
must(code.outbound, 'export async function syncGoogleCalendarOutbound', 'outbound sync owner');

for (const [label, text] of [['task route', code.taskRoute], ['event route', code.eventRoute]]) {
  must(text, 'created_by_user_id:', `${label} user stamp`);
  mustNot(text, 'syncGoogleCalendarOutbound', `${label} automatic outbound absent`);
  mustNot(text, "google_calendar_sync_status: 'pending'", `${label} pending transition absent`);
}
mustNot(code.eventRoute, 'googleCalendarReminderMethod', 'event route reminder method persistence absent');
mustNot(code.eventRoute, 'googleCalendarReminderMinutesBefore', 'event route reminder minutes persistence absent');
mustNot(code.outbound, 'googleCalendarReminderMethod', 'outbound mapper browser method absent');
mustNot(code.outbound, 'googleCalendarReminderMinutesBefore', 'outbound mapper browser minutes absent');

must(code.timezone, "export const CLOSEFLOW_DEFAULT_TIMEZONE = 'Europe/Warsaw'", 'timezone owner');
must(code.timezone, 'localDateTimeInputToUtcIso', 'timezone local to UTC');
must(code.timezone, 'googleDateTimeToUtcIso', 'timezone Google to UTC');
must(code.timezone, 'assertNoCalendarTimeShift', 'timezone no-shift guard');

for (const text of [code.readonlyDate, code.readonlyStatus]) {
  must(text, "GoogleCalendarSyncChange: 'FORBIDDEN'", 'readonly GCal sync block');
  must(text, "GoogleCalendarMapperChange: 'FORBIDDEN'", 'readonly GCal mapper block');
}
must(code.readonlyDate, "RemoteCalendarBoundaryChange: 'FORBIDDEN'", 'readonly date remote boundary block');
must(code.readonlyStatus, "remoteProviderChange: 'FORBIDDEN'", 'readonly status remote provider block');
must(code.operational, 'no Supabase, no Google sync, no SQL', 'operational contract excludes GCal');

const report = read(path.join(root, rel.report), 'G5 app report');
const map = read(path.join(vault, rel.map), 'G5 map');
const router = read(path.join(vault, rel.router), 'SOT router');

for (const doc of [report, map]) {
  must(doc, 'RECOVERY_PACKAGE: V3_SAFE_VAULT_HEAD_ADVANCE_COMPAT', 'G5 recovery trace');
  must(doc, 'G5_FINAL_STATUS: PASS_GCAL_CALENDAR_BOUNDARY_GAP_MAP', 'G5 result');
  must(doc, 'GCAL_BOUNDARY_REAL_CODE_VERIFY: PASS', 'G5 real code result');
  must(doc, 'GCAL_RUNTIME_DECISION: STOP_NO_SAFE_RUNTIME_CANDIDATE', 'G5 runtime stop');
  must(doc, 'G5_FIRST_SAFE_RUNTIME_CANDIDATE: NONE', 'G5 candidate');
  must(doc, 'AUTOMATIC_OUTBOUND_AFTER_TASK_MUTATION: NO', 'G5 task outbound gap');
  must(doc, 'AUTOMATIC_OUTBOUND_AFTER_EVENT_MUTATION: NO', 'G5 event outbound gap');
  must(doc, 'EVENT_ROUTE_PERSISTS_REMINDER_PREFERENCE_FIELDS: NO', 'G5 reminder gap');
  must(doc, 'DONE_COMPLETED_REMOTE_POLICY: REMOTE_DELETE', 'G5 remote delete semantic');
  must(doc, `NEXT_STAGE_SELECTED: ${NEXT_STAGE}`, 'G5 next decision');
  must(doc, 'G5_R1_CREATED: NO', 'G5-R1 not created');
}

for (const finding of [
  'G5-FINDING-001', 'G5-FINDING-002', 'G5-FINDING-003', 'G5-FINDING-004', 'G5-FINDING-005',
  'G5-FINDING-006', 'G5-FINDING-007', 'G5-FINDING-008', 'G5-FINDING-009', 'G5-FINDING-010',
]) must(map, finding, 'G5 finding');

for (const domain of [
  'CONNECTION_CONFIG_OAUTH', 'USER_SCOPE_CONNECTION', 'CLIENT_ROUTE', 'API_ROUTE_CONSOLIDATION',
  'CALENDAR_LOCAL_READ', 'INBOUND_TRIGGER', 'INBOUND_REMOTE_LIST', 'INBOUND_IDENTITY_DEDUPE',
  'INBOUND_MAPPING', 'INBOUND_DELETE_TOMBSTONE', 'OUTBOUND_TRIGGER', 'OUTBOUND_ELIGIBILITY',
  'OUTBOUND_PERSONAL_SCOPE', 'OUTBOUND_MAPPING', 'OUTBOUND_REMOTE_DELETE', 'TASK_MUTATION',
  'EVENT_MUTATION', 'REMINDER_PREFERENCE', 'TIMEZONE', 'READONLY_SOT_BOUNDARY',
]) must(map, domain, 'G5 domain');

assert.equal((map.match(/^\| G5-\d{2} \|/gm) || []).length, 31, 'G5 boundary row count');

must(router, '<!-- LF-PROD-SOT-G5 START -->', 'G5 router block');
must(router, 'G5 -> CONTRACT_DECISION_GATE', 'G5 router route');
must(router, 'STOP_NO_SAFE_RUNTIME_CANDIDATE', 'G5 router runtime stop');
must(router, NEXT_STAGE, 'G5 router next stage');
must(router, 'G5_R1_CREATED:', 'G5 router no-create label');

for (const doc of [report, map, router]) {
  must(doc, 'RUNTIME_CHANGED: NO', 'G5 no runtime');
  must(doc, 'SRC_CHANGED: NO', 'G5 no src');
  must(doc, 'SQL_API_SUPABASE_CHANGED: NO', 'G5 no API/SQL');
  must(doc, 'GCAL_REMOTE_CALL_CHANGED: NO', 'G5 no remote change');
  for (const bad of ['Ã', 'Å', 'Ä', 'â€“', 'â€”', 'ï¿½']) {
    mustNot(doc, bad, 'G5 UTF-8');
  }
}

assertNoStagePrefix(path.join(root, '_project', 'runs'), 'LF-PROD-SOT-G5-R1_', 'G5-R1 app report');
assertNoStagePrefix(path.join(root, 'scripts', 'guards'), 'verify-lf-prod-sot-g5-r1-', 'G5-R1 app guard');
assertNoStagePrefix(path.join(root, 'tests'), 'lf-prod-sot-g5-r1-', 'G5-R1 app test');
assertNoStagePrefix(mapBase, 'LF-PROD-SOT-G5-R1_', 'G5-R1 Obsidian map');

console.log('LF-PROD-SOT-G5 GCAL CALENDAR BOUNDARY GAP MAP: PASS');
