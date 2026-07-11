const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const rel = {
  package: 'package.json',
  g5Report: '_project/runs/LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md',
  report: '_project/runs/LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION.md',
  repairReport: '_project/runs/LF-PROD-SOT-G5-R1-R1_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING.md',
  guard: 'scripts/guards/verify-lf-prod-sot-g5-r1-gcal-contract-decision.cjs',
  test: 'tests/lf-prod-sot-g5-r1-gcal-contract-decision.test.cjs',
  taskRoute: 'src/server/task-route-stage124f.ts',
  eventRoute: 'src/server/event-route-stage124f.ts',
  outbound: 'src/server/google-calendar-outbound.ts',
  inbound: 'src/server/google-calendar-inbound.ts',
  handler: 'src/server/google-calendar-handler.ts',
  reminder: 'src/lib/google-calendar-reminder-preferences.ts',
  timezone: 'src/lib/calendar-timezone-contract.ts',
  map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION_MAP.md',
  repairMap: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G5-R1-R1_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING_MAP.md',
  router: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
};

const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g5-r1-gcal-contract-decision.cjs && node --test tests/lf-prod-sot-g5-r1-gcal-contract-decision.test.cjs';
const allowedApp = new Set([rel.package, rel.guard, rel.test, rel.report, rel.repairReport]);
const allowedVault = new Set([rel.map, rel.repairMap, rel.router]);

function sh(cwd, args, options = {}) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function readAt(base, file) {
  const full = path.join(base, file);
  if (!fs.existsSync(full)) throw new Error(`MISSING_REQUIRED_FILE: ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function must(text, token, label = token) {
  if (!text.includes(token)) throw new Error(`MISSING_CONTRACT_TOKEN: ${label}`);
}

function mustNot(text, token, label = token) {
  if (text.includes(token)) throw new Error(`FORBIDDEN_RUNTIME_TOKEN: ${label}`);
}

const mojibakeTokens = ['â€”', 'â€“', 'â€™', 'â€œ', 'â€', 'Ã', 'Â', '�'];

function assertNoMojibake(text, label) {
  for (const token of mojibakeTokens) {
    if (text.includes(token)) throw new Error(`UTF8_MOJIBAKE_DETECTED: ${label}: ${token}`);
  }
}

function lines(value) {
  return String(value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function changedFiles(repo) {
  const result = new Set();
  try {
    const status = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: repo, encoding: 'utf8' });
    for (const row of String(status || '').split(/\r?\n/).filter(Boolean)) {
      let file = row.slice(3).trim();
      if (file.includes(' -> ')) file = file.split(' -> ').at(-1);
      if (file) result.add(file.replaceAll('\\', '/'));
    }
  } catch {}
  for (const args of [
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
  ]) {
    try { for (const file of lines(sh(repo, args))) result.add(file.replaceAll('\\', '/')); } catch {}
  }
  if (result.size === 0) {
    try {
      for (const file of lines(sh(repo, ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD']))) {
        result.add(file.replaceAll('\\', '/'));
      }
    } catch {}
  }
  return [...result];
}

function g6ArtifactNames() {
  const checks = [
    [root, '_project/runs'],
    [root, 'scripts/guards'],
    [root, 'tests'],
    [vault, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY'],
  ];
  const out = [];
  for (const [base, relDir] of checks) {
    const dir = path.join(base, relDir);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const relName = path.join(relDir, entry.name).replaceAll('\\', '/');
      if (/(^|\/)LF-PROD-SOT-G6[_-]|(^|\/)lf-prod-sot-g6[_-]/i.test(relName)) out.push(relName);
    }
  }
  return out;
}

function assertAllowed(files, allowed, kind) {
  for (const file of files) {
    if (file.startsWith('src/')) throw new Error('STOP_G5_R1_SRC_CHANGE: ' + file);
    if (kind === 'app' && !allowed.has(file)) throw new Error('G5_R1_FORBIDDEN_APP_CHANGE: ' + file);
    if (kind === 'vault' && !allowed.has(file)) throw new Error('G5_R1_FORBIDDEN_OBSIDIAN_CHANGE: ' + file);
  }
}

const appBranch = sh(root, ['branch', '--show-current']);
if (appBranch !== 'dev-rollout-freeze') throw new Error('STOP_BRANCH_MISMATCH: ' + appBranch);
if (!fs.existsSync(path.join(vault, '.git'))) throw new Error('STOP_MISSING_OBSIDIAN_REPO: ' + vault);
const vaultBranch = sh(vault, ['branch', '--show-current']);
if (vaultBranch !== 'main') throw new Error('STOP_OBSIDIAN_BRANCH_MISMATCH: ' + vaultBranch);

const pkgText = readAt(root, rel.package);
const pkg = JSON.parse(pkgText);
if (pkg.scripts?.['verify:lf-prod-sot-g5-r1'] !== exactAlias) {
  throw new Error('G5_R1_PACKAGE_ALIAS_MISMATCH');
}

const g5Report = readAt(root, rel.g5Report);
must(g5Report, 'G5_FINAL_STATUS: PASS_GCAL_CALENDAR_BOUNDARY_GAP_MAP');
must(g5Report, 'AUTOMATIC_OUTBOUND_AFTER_TASK_MUTATION: NO');
must(g5Report, 'AUTOMATIC_OUTBOUND_AFTER_EVENT_MUTATION: NO');
must(g5Report, 'TASK_EVENT_MUTATIONS_MARK_GCAL_PENDING: NO');

const report = readAt(root, rel.report);
const repairReport = readAt(root, rel.repairReport);
const map = readAt(vault, rel.map);
const repairMap = readAt(vault, rel.repairMap);
const router = readAt(vault, rel.router);
const taskRoute = readAt(root, rel.taskRoute);
const eventRoute = readAt(root, rel.eventRoute);
const outbound = readAt(root, rel.outbound);
const inbound = readAt(root, rel.inbound);
const handler = readAt(root, rel.handler);
const reminder = readAt(root, rel.reminder);
const timezone = readAt(root, rel.timezone);

// Real code prerequisite: mutation routes remain local-first and do not own remote calls or pending transitions.
for (const [name, source] of [['task', taskRoute], ['event', eventRoute]]) {
  mustNot(source, 'syncGoogleCalendarOutbound', `${name}_automatic_outbound`);
  mustNot(source, 'createGoogleCalendarEvent', `${name}_remote_create`);
  mustNot(source, 'updateGoogleCalendarEvent', `${name}_remote_update`);
  mustNot(source, 'deleteGoogleCalendarEvent', `${name}_remote_delete`);
  mustNot(source, 'google_calendar_sync_status', `${name}_pending_transition`);
  must(source, 'created_by_user_id', `${name}_owner_stamp`);
}

mustNot(eventRoute, 'googleCalendarReminderMethod', 'event_route_reminder_method_persistence');
mustNot(eventRoute, 'googleCalendarReminderMinutesBefore', 'event_route_reminder_minutes_persistence');
mustNot(eventRoute, 'google_reminders_use_default', 'event_route_canonical_reminder_default_persistence');
mustNot(eventRoute, 'google_reminders_overrides', 'event_route_canonical_reminder_overrides_persistence');

// Current outbound capabilities and invariants.
must(outbound, "type GoogleCalendarOutboundMode = 'pending' | 'failed' | 'all'");
must(outbound, "modeRaw === 'failed' || modeRaw === 'all'");
must(outbound, "status === 'failed' || status === 'not_connected' || status === 'pending'");
must(outbound, 'getGoogleCalendarUserConnection(workspaceId, userId)');
must(outbound, 'if (!personalScope.matched)');
must(outbound, "new Set(['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed'])");
must(outbound, "googleSyncStatusFrom(row) === 'pending_delete'");
must(outbound, 'isGoogleAlreadyGoneStage229B');
must(outbound, 'google_calendar_sync_status: \'failed\'');
must(outbound, 'google_calendar_sync_status: \'synced\'');
must(outbound, 'google_calendar_sync_status: \'deleted\'');
must(outbound, 'existingGoogleEventId');
must(outbound, 'createGoogleCalendarEvent');
must(outbound, 'updateGoogleCalendarEvent');
must(outbound, 'deleteGoogleCalendarEvent');
must(outbound, "type === 'external_google_event' || sourceProvider === 'google_calendar'");

// Active handler uses exact connection. Legacy workspace lookup remains diagnostic in status only.
must(handler, 'getGoogleCalendarUserConnection(workspaceId, userId)');
must(handler, "action === 'sync-outbound'");
must(handler, 'getGoogleCalendarLegacyWorkspaceConnection');
must(handler, "action === 'status'");
mustNot(handler.slice(handler.indexOf("action === 'sync-outbound'"), handler.indexOf("action === 'status'")), 'getGoogleCalendarLegacyWorkspaceConnection', 'workspace_fallback_inside_active_sync');

// Inbound identity/tombstone/time behavior remains unchanged.
must(inbound, 'source_provider=eq.google_calendar');
must(inbound, 'source_external_id');
must(inbound, 'Duplicate titles are allowed');
must(inbound, 'isLocalDeletedGoogleCalendarWorkItem');
must(inbound, 'googleEventIsAllDay');
must(inbound, 'googleDateTimeToUtcIso');

must(reminder, "'default' | 'popup' | 'email' | 'popup_email'");
must(reminder, 'Math.max(0, Math.min(40320');
must(reminder, 'googleCalendarReminderMethod');
must(reminder, 'googleCalendarReminderMinutesBefore');
must(timezone, 'Europe/Warsaw');

const requiredDecisionTokens = [
  'G5_R1_FINAL_STATUS: PASS_GCAL_CONTRACT_DECISION',
  'G5_PREREQUISITE: PASS_GCAL_CALENDAR_BOUNDARY_GAP_MAP',
  'GCAL_CONTRACT_DECISION: COMPLETE',
  'G5_R1_GATE_ORDER: G5_PRECHECK_BEFORE_G5_R1_ARTIFACTS_ONLY',
  'POST_G5_R1_OLD_G5_GUARD: NOT_RERUN_BY_DESIGN',
  'OUTBOUND_TRIGGER_ARCHITECTURE: DURABLE_WORK_ITEM_SYNC_STATE',
  'LOCAL_WRITE_POLICY: LOCAL_FIRST_NON_BLOCKING',
  'REMOTE_GOOGLE_CALL_INSIDE_TASK_EVENT_MUTATION: FORBIDDEN',
  'MUTATION_SYNC_STATE_OWNER: TASK_AND_EVENT_SERVER_ROUTES',
  'REMOTE_PROCESSOR_OWNER: src/server/google-calendar-outbound.ts',
  'PRIMARY_OUTBOUND_MODE: pending',
  'MANUAL_OUTBOUND_MODE_ALL: RETAIN_AS_OPERATOR_FALLBACK',
  'OUTBOUND_SOURCE_POLICY: LOCAL_CLOSEFLOW_ROWS_ONLY',
  'GOOGLE_INBOUND_ROWS_REOUTBOUND: FORBIDDEN',
  'IMPORTED_GOOGLE_EVENT_REMOTE_DELETE: FORBIDDEN_WITHOUT_EXPLICIT_FUTURE_OWNER_ACTION',
  'CONNECTION_SCOPE: EXACT_WORKSPACE_ID_PLUS_USER_ID',
  'ROW_OWNER_SCOPE: EXACT_CREATED_BY_USER_ID_MATCH',
  'WORKSPACE_TOKEN_FALLBACK_FOR_ACTIVE_SYNC: FORBIDDEN',
  'OUTBOUND_SCOPE_FAILURE: FAIL_CLOSED_SKIP_ROW',
  'TITLE_AS_IDENTITY: FORBIDDEN',
  'OUTBOUND_LOCAL_IDENTITY: workspace_id + work_item.id + created_by_user_id',
  'OUTBOUND_REMOTE_IDENTITY: google_calendar_event_id',
  'INBOUND_REMOTE_IDENTITY: workspace_id + source_provider + source_external_id',
  'LOCAL_WRITE_ROLLBACK_ON_GOOGLE_FAILURE: FORBIDDEN',
  'OUTBOUND_FAILURE_STATE: failed',
  'RETRY_INPUT_STATES: pending + failed + pending_delete',
  'REMINDER_PERSISTENCE_OWNER: TASK_AND_EVENT_SERVER_ROUTES',
  'REMINDER_OUTBOUND_OWNER: src/server/google-calendar-outbound.ts',
  'CANONICAL_STORED_FIELDS: google_reminders_use_default + google_reminders_overrides',
  'DONE_COMPLETED_REMOTE_POLICY: REMOTE_DELETE',
  'LOCAL_COMMIT_BEFORE_REMOTE_DELETE: REQUIRED',
  'REMOTE_DELETE_BEFORE_LOCAL_COMMIT: FORBIDDEN',
  'TIMEZONE_OWNER: src/lib/calendar-timezone-contract.ts',
  'DEFAULT_TIMEZONE: Europe/Warsaw',
  'GOOGLE_ALL_DAY_FIELDS_PRESERVED: REQUIRED',
  'G6_FIRST_CONTRACT_TARGET: TASK_EVENT_MUTATION_TO_GCAL_PENDING_STATE_CONTRACT_GUARD',
  'NEXT_STAGE_SELECTED: LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD',
  'G6_CREATED: NO',
  'RUNTIME_CHANGED: NO',
  'SRC_CHANGED: NO',
  'GCAL_REMOTE_CALL_CHANGED: NO',
];
for (const token of requiredDecisionTokens) {
  must(report, token, `report:${token}`);
  must(map, token, `map:${token}`);
}

for (const token of [
  'SOT_ROUTER_MATRIX_UPDATED_THROUGH_G5_R1',
  'SOT_ROUTER_UPDATED_THROUGH_G5_R1',
  'G5 -> G5-R1',
  'G5-R1 -> G6',
  'PASS_GCAL_CONTRACT_DECISION',
  'TASK_EVENT_MUTATION_TO_GCAL_PENDING_STATE_CONTRACT_GUARD',
  'LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD',
  'G6_CREATED: NO',
]) must(router, token, `router:${token}`);

for (const token of [
  'G6_EXACT_OBSIDIAN_MAP_INPUTS:',
  'LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md',
  'LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION_MAP.md',
  'G6_EXACT_APP_REPORT_INPUTS:',
  '_project/runs/LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md',
  '_project/runs/LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION.md',
]) {
  must(map, token, `map:${token}`);
  must(router, token, `router:${token}`);
}

const g5r1RouterStart = '<!-- LF-PROD-SOT-G5-R1 START -->';
const g5r1RouterEnd = '<!-- LF-PROD-SOT-G5-R1 END -->';
const routerStartIndex = router.indexOf(g5r1RouterStart);
const routerEndIndex = router.indexOf(g5r1RouterEnd);
if (routerStartIndex < 0 || routerEndIndex < routerStartIndex) {
  throw new Error('MISSING_G5_R1_ROUTER_BLOCK');
}
const g5r1RouterBlock = router.slice(routerStartIndex, routerEndIndex + g5r1RouterEnd.length);

must(
  g5r1RouterBlock,
  '## LF-PROD-SOT-G5-R1 — GCal Outbound Trigger, Reminder and Delete Contract Decision',
  'router:utf8_heading',
);

for (const [label, text] of [
  ['g5-r1-report', report],
  ['g5-r1-map', map],
  ['g5-r1-router-block', g5r1RouterBlock],
  ['g5-r1-r1-report', repairReport],
  ['g5-r1-r1-map', repairMap],
]) {
  assertNoMojibake(text, label);
}

for (const token of [
  'G5_R1_R1_FINAL_STATUS: PASS_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING',
  'UTF8_ROUTER_HEADING: CLEAN_EM_DASH',
  'MOJIBAKE_GUARD_HARDENED: YES',
  'NEXT_STAGE_SELECTED: LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD',
  'G6_CREATED: NO',
  'RUNTIME_CHANGED: NO',
  'SRC_CHANGED: NO',
]) {
  must(repairReport, token, `repairReport:${token}`);
  must(repairMap, token, `repairMap:${token}`);
}

assertAllowed(changedFiles(root), allowedApp, 'app');
assertAllowed(changedFiles(vault), allowedVault, 'vault');

const forbiddenG6Artifacts = g6ArtifactNames();
if (forbiddenG6Artifacts.length) throw new Error('G6_CREATED_FORBIDDEN: ' + forbiddenG6Artifacts.join(', '));

console.log('LF-PROD-SOT-G5-R1 GCAL CONTRACT DECISION: PASS');
console.log('AUTOMATIC_OUTBOUND_AFTER_TASK_MUTATION: NO');
console.log('AUTOMATIC_OUTBOUND_AFTER_EVENT_MUTATION: NO');
console.log('TASK_EVENT_MUTATIONS_MARK_GCAL_PENDING: NO');
console.log('EVENT_ROUTE_PERSISTS_REMINDER_METHOD: NO');
console.log('EVENT_ROUTE_PERSISTS_REMINDER_MINUTES: NO');
console.log('OUTBOUND_TRIGGER_ARCHITECTURE: DURABLE_WORK_ITEM_SYNC_STATE');
console.log('CONNECTION_SCOPE: EXACT_WORKSPACE_ID_PLUS_USER_ID');
console.log('DONE_COMPLETED_REMOTE_POLICY: REMOTE_DELETE');
console.log('G6_CREATED: NO');
console.log('UTF8_ROUTER_HEADING: CLEAN_EM_DASH');
console.log('MOJIBAKE_GUARD_HARDENED: YES');
console.log('G5_R1_R1_FINAL_STATUS: PASS_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING');
