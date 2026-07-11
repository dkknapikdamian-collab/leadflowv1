const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const APP_INPUT_HEAD_G6 = 'a5578df347aa195c2d7a47647b7899d86305e7c1';
const OBSIDIAN_INPUT_HEAD_G6 = '95d3b47e7c073b3592b36f91587a9665ef427ed1';
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g6-gcal-first-safe-contract-guard.cjs && node --test tests/lf-prod-sot-g6-gcal-first-safe-contract-guard.test.cjs';

const rel = {
  package: 'package.json',
  guard: 'scripts/guards/verify-lf-prod-sot-g6-gcal-first-safe-contract-guard.cjs',
  test: 'tests/lf-prod-sot-g6-gcal-first-safe-contract-guard.test.cjs',
  report: '_project/runs/LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD.md',
  g5Report: '_project/runs/LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md',
  g5r1Report: '_project/runs/LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION.md',
  g5r1r1Report: '_project/runs/LF-PROD-SOT-G5-R1-R1_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING.md',
  taskRoute: 'src/server/task-route-stage124f.ts',
  eventRoute: 'src/server/event-route-stage124f.ts',
  outbound: 'src/server/google-calendar-outbound.ts',
  inbound: 'src/server/google-calendar-inbound.ts',
  handler: 'src/server/google-calendar-handler.ts',
  userScope: 'src/server/google-calendar-user-scope.ts',
  reminder: 'src/lib/google-calendar-reminder-preferences.ts',
  timezone: 'src/lib/calendar-timezone-contract.ts',
  router: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  g5Map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md',
  g5r1Map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION_MAP.md',
  g5r1r1Map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G5-R1-R1_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING_MAP.md',
  map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD_MAP.md',
};

const allowedApp = new Set([rel.package, rel.guard, rel.test, rel.report]);
const allowedVault = new Set([rel.router, rel.map]);
const forbiddenRouteCalls = [
  'syncGoogleCalendarOutbound',
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'deleteGoogleCalendarEvent',
];
const snapshotFields = [
  'id', 'workspace_id', 'record_type', 'type', 'status', 'show_in_calendar',
  'scheduled_at', 'due_at', 'start_at', 'created_by_user_id', 'source_provider',
  'source_external_id', 'google_calendar_event_id', 'google_calendar_sync_status',
];

function sh(cwd, args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
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
  if (text.includes(token)) throw new Error(`FORBIDDEN_TOKEN: ${label}`);
}

function section(text, startToken, endToken) {
  const start = text.indexOf(startToken);
  const end = text.indexOf(endToken, start + startToken.length);
  if (start < 0 || end < 0) throw new Error(`MISSING_SECTION: ${startToken}`);
  return text.slice(start, end);
}

function listLines(value) {
  return String(value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function changedFilesSince(repo, inputHead) {
  const files = new Set();
  for (const args of [
    ['diff', '--name-only', `${inputHead}..HEAD`],
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
  ]) {
    for (const file of listLines(sh(repo, args))) files.add(file.replaceAll('\\', '/'));
  }
  const status = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], {
    cwd: repo,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  for (const line of String(status || '').split(/\r?\n/).filter(Boolean)) {
    let file = line.slice(3).trim();
    if (file.includes(' -> ')) file = file.split(' -> ').at(-1);
    if (file) files.add(file.replaceAll('\\', '/'));
  }
  return [...files];
}

function assertAllowed(files, allowed, kind) {
  for (const file of files) {
    if (file.startsWith('src/')) throw new Error(`STOP_G6_SRC_CHANGE: ${file}`);
    if (!allowed.has(file)) {
      throw new Error(kind === 'app'
        ? `G6_FORBIDDEN_APP_CHANGE: ${file}`
        : `G6_FORBIDDEN_OBSIDIAN_CHANGE: ${file}`);
    }
  }
}

function assertAncestor(repo, inputHead, label) {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', inputHead, 'HEAD'], {
    cwd: repo,
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`${label}_NOT_ANCESTOR_OF_HEAD`);
}

function assertMissingFields(selectText, fields, label) {
  for (const field of fields) {
    if (new RegExp(`(^|[,?=&])${field}([,?=&]|$)`).test(selectText)) {
      throw new Error(`${label}_UNEXPECTED_FIELD: ${field}`);
    }
  }
}

function assertG7Absent() {
  const roots = [
    [root, '_project/runs'],
    [root, 'scripts/guards'],
    [root, 'tests'],
    [vault, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY'],
  ];
  for (const [base, dirName] of roots) {
    const dir = path.join(base, dirName);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (/LF-PROD-SOT-G7[_-]|lf-prod-sot-g7[_-]/i.test(entry.name)) {
        throw new Error(`G7_CREATED_FORBIDDEN: ${path.join(dirName, entry.name)}`);
      }
    }
  }
}

const appBranch = sh(root, ['branch', '--show-current']);
if (appBranch !== 'dev-rollout-freeze') throw new Error(`STOP_BRANCH_MISMATCH: ${appBranch}`);
if (!fs.existsSync(path.join(vault, '.git'))) throw new Error(`STOP_MISSING_OBSIDIAN_REPO: ${vault}`);
const vaultBranch = sh(vault, ['branch', '--show-current']);
if (vaultBranch !== 'main') throw new Error(`STOP_OBSIDIAN_BRANCH_MISMATCH: ${vaultBranch}`);
assertAncestor(root, APP_INPUT_HEAD_G6, 'APP_INPUT_HEAD_G6');
assertAncestor(vault, OBSIDIAN_INPUT_HEAD_G6, 'OBSIDIAN_INPUT_HEAD_G6');

const pkg = JSON.parse(readAt(root, rel.package));
if (pkg.scripts?.['verify:lf-prod-sot-g6'] !== exactAlias) throw new Error('G6_PACKAGE_ALIAS_MISMATCH');
if (pkg.scripts?.['verify:lf-prod-sot-g7']) throw new Error('G7_PACKAGE_ALIAS_FORBIDDEN');

const g5Report = readAt(root, rel.g5Report);
const g5r1Report = readAt(root, rel.g5r1Report);
const g5r1r1Report = readAt(root, rel.g5r1r1Report);
const report = readAt(root, rel.report);
const taskRoute = readAt(root, rel.taskRoute);
const eventRoute = readAt(root, rel.eventRoute);
const outbound = readAt(root, rel.outbound);
const inbound = readAt(root, rel.inbound);
const handler = readAt(root, rel.handler);
const userScope = readAt(root, rel.userScope);
const reminder = readAt(root, rel.reminder);
const timezone = readAt(root, rel.timezone);
const router = readAt(vault, rel.router);
const g5Map = readAt(vault, rel.g5Map);
const g5r1Map = readAt(vault, rel.g5r1Map);
const g5r1r1Map = readAt(vault, rel.g5r1r1Map);
const map = readAt(vault, rel.map);

must(g5Report, 'G5_FINAL_STATUS: PASS_GCAL_CALENDAR_BOUNDARY_GAP_MAP');
must(g5r1Report, 'G5_R1_FINAL_STATUS: PASS_GCAL_CONTRACT_DECISION');
must(g5r1r1Report, 'G5_R1_R1_FINAL_STATUS: PASS_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING');
must(g5Map, 'G5_FINAL_STATUS: PASS_GCAL_CALENDAR_BOUNDARY_GAP_MAP');
must(g5r1Map, 'G5_R1_FINAL_STATUS: PASS_GCAL_CONTRACT_DECISION');
must(g5r1r1Map, 'G5_R1_R1_FINAL_STATUS: PASS_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING');

for (const [name, source] of [['task', taskRoute], ['event', eventRoute]]) {
  for (const call of forbiddenRouteCalls) mustNot(source, call, `${name}:${call}`);
  mustNot(source, 'google_calendar_sync_status', `${name}:sync_status_transition`);
  must(source, 'created_by_user_id', `${name}:owner_stamp`);
  must(source, 'show_in_calendar: true', `${name}:show_in_calendar`);
}
must(taskRoute, "record_type: 'task'");
must(eventRoute, "record_type: 'event'");
must(taskRoute, ': null;', 'task_nullable_calendar_time');
must(eventRoute, 'const startAt = body.startAt ? normalizeCloseFlowDateTimeToUtcIso(body.startAt) || nowIso : nowIso');

must(outbound, "type GoogleCalendarOutboundMode = 'pending' | 'failed' | 'all'");
must(outbound, "modeRaw === 'failed' || modeRaw === 'all'");
must(outbound, "googleSyncStatusFrom(row) === 'pending_delete'");
must(outbound, 'getGoogleCalendarUserConnection(workspaceId, userId)');
must(outbound, 'if (!personalScope.matched)');
must(handler, 'getGoogleCalendarUserConnection(workspaceId, userId)');
must(userScope, '`workspace_id=eq.${encode(workspace)}`');
must(userScope, '`user_id=eq.${encode(user)}`');
must(inbound, 'source_provider=eq.google_calendar');
must(inbound, 'source_external_id');
must(inbound, 'Duplicate titles are allowed');
must(inbound, 'isLocalDeletedGoogleCalendarWorkItemStage232GR6');

must(outbound, "source_provider: googleEventId ? 'google_calendar' : null");
must(outbound, 'source_external_id: googleEventId');
must(inbound, "source_provider: 'google_calendar'");
must(inbound, "'external_google_event'");
must(outbound, "type === 'external_google_event' || sourceProvider === 'google_calendar'");
must(inbound, "type === 'external_google_event' || sourceProvider === 'google_calendar'");

const taskPatch = section(taskRoute, "if (req.method === 'PATCH')", "if (req.method === 'DELETE')");
const eventPatch = section(eventRoute, "if (req.method === 'PATCH')", "if (req.method === 'DELETE')");
const taskDelete = section(taskRoute, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const eventDelete = section(eventRoute, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const taskPatchSelect = 'work_items?select=id,scheduled_at,due_at,start_at,time,status,show_in_tasks,show_in_calendar';
must(taskPatch, taskPatchSelect, 'task_patch_partial_snapshot');
assertMissingFields(taskPatchSelect, ['type', 'source_provider', 'created_by_user_id', 'google_calendar_event_id', 'google_calendar_sync_status'], 'TASK_PATCH_SNAPSHOT');
mustNot(eventPatch, 'work_items?select=', 'event_patch_existing_row_read');
for (const [label, text] of [['TASK_DELETE', taskDelete], ['EVENT_DELETE', eventDelete]]) {
  must(text, 'work_items?select=id,workspace_id,lead_id,client_id,case_id,record_type,type,status,title,show_in_tasks,show_in_calendar');
  for (const field of ['source_provider', 'created_by_user_id', 'google_calendar_event_id']) mustNot(text, field, `${label}:${field}`);
  must(text, 'selectFirstAvailable([selectPathStage228R23])', `${label}:unscoped_fallback_current_reality`);
}

must(reminder, "'default' | 'popup' | 'email' | 'popup_email'");
must(reminder, 'Math.max(0, Math.min(40320');
must(timezone, "CLOSEFLOW_DEFAULT_TIMEZONE = 'Europe/Warsaw'");
must(inbound, 'googleEventIsAllDay');
must(inbound, 'googleDateTimeToUtcIso');

const requiredDecisionTokens = [
  `APP_INPUT_HEAD_G6: ${APP_INPUT_HEAD_G6}`,
  `OBSIDIAN_INPUT_HEAD_G6: ${OBSIDIAN_INPUT_HEAD_G6}`,
  'G6_GATE_ORDER: G5_R1_PRECHECK_BEFORE_G6_ARTIFACTS_ONLY',
  'POST_G6_OLD_G5_R1_GUARD: NOT_RERUN_BY_DESIGN',
  'G6_FINAL_STATUS: PASS_FIRST_SAFE_CONTRACT_GUARD_WITH_PROVENANCE_CLARIFICATION',
  'GCAL_PROVENANCE_COLLISION_FOUND: YES',
  'SOURCE_PROVIDER_ROLE: REMOTE_ASSOCIATION_NOT_ORIGIN',
  'TYPE_EXTERNAL_GOOGLE_EVENT_ROLE: IMPORTED_NEW_EVENT_ORIGIN_MARKER',
  'SOURCE_PROVIDER_GOOGLE_CALENDAR_ALONE_EXCLUDES_OUTBOUND: NO',
  'IMPORTED_GOOGLE_EVENT_RUNTIME_PREDICATE: type === external_google_event',
  'LOCAL_EXPORTED_TASK_OR_EVENT_REMAINS_OUTBOUND_ELIGIBLE: YES',
  'SOURCE_EXTERNAL_ID_ROLE: REMOTE_CANONICAL_IDENTITY',
  'MUTATION_EXISTING_ROW_SNAPSHOT_REQUIRED: YES',
  'MUTATION_PENDING_DECISION_WITH_CURRENT_ROUTE_SNAPSHOT: UNSAFE',
  'UNSCOPED_ROW_FALLBACK_FOR_GCAL_PENDING_DECISION: FORBIDDEN',
  'EXACT_WORKSPACE_ROW_REQUIRED: YES',
  'PURE_DECISION_OUTPUT:',
  '- pending_delete',
  '- skip_imported',
  '- skip_no_owner',
  '- skip_no_calendar_time',
  'LOCAL_WRITE_POLICY: LOCAL_FIRST_NON_BLOCKING',
  'REMOTE_GOOGLE_CALL_INSIDE_TASK_EVENT_MUTATION: FORBIDDEN',
  'LOCAL_WRITE_ROLLBACK_ON_GOOGLE_FAILURE: FORBIDDEN',
  'REMOTE_PROCESSOR_OWNER: src/server/google-calendar-outbound.ts',
  'PRIMARY_OUTBOUND_MODE: pending',
  'MANUAL_MODE_ALL: OPERATOR_FALLBACK_ONLY',
  'INBOUND_CHANGED: NO',
  'LOCAL_DELETE_TOMBSTONE_WINS: YES',
  'TIMEZONE_OWNER: src/lib/calendar-timezone-contract.ts',
  'DEFAULT_TIMEZONE: Europe/Warsaw',
  'G7_FIRST_SAFE_CANDIDATE: PURE_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE',
  'NEXT_STAGE_SELECTED: LF-PROD-SOT-G7_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT',
  'G7_CREATED: NO',
  'RUNTIME_CHANGED:',
  'SRC_CHANGED:',
  'SQL_API_SUPABASE_CHANGED:',
  'GCAL_REMOTE_CALL_CHANGED:',
];
for (const token of requiredDecisionTokens) {
  must(report, token, `report:${token}`);
  must(map, token, `map:${token}`);
}
for (const field of snapshotFields) {
  must(report, `- ${field}`, `report:snapshot:${field}`);
  must(map, `- ${field}`, `map:snapshot:${field}`);
}

const g6Router = section(router, '<!-- LF-PROD-SOT-G6 START -->', '<!-- LF-PROD-SOT-G6 END -->');
for (const token of [
  'SOT_ROUTER_MATRIX_UPDATED_THROUGH_G6',
  'SOT_ROUTER_UPDATED_THROUGH_G6',
  '* G5-R1-R1 -> G6',
  '* G6 -> G7',
  'G6_FINAL_STATUS:',
  'PASS_FIRST_SAFE_CONTRACT_GUARD_WITH_PROVENANCE_CLARIFICATION',
  'GCAL_PROVENANCE_COLLISION_FOUND:',
  'YES',
  'SOURCE_PROVIDER_ROLE:',
  'REMOTE_ASSOCIATION_NOT_ORIGIN',
  'G7_FIRST_SAFE_CANDIDATE:',
  'PURE_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE',
  'NEXT_STAGE_SELECTED:',
  'LF-PROD-SOT-G7_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT',
  'G7_CREATED:',
  'NO',
  'RUNTIME_CHANGED:',
  'SRC_CHANGED:',
  'SQL_API_SUPABASE_CHANGED:',
  'GCAL_REMOTE_CALL_CHANGED:',
]) must(g6Router, token, `router:${token}`);

assertAllowed(changedFilesSince(root, APP_INPUT_HEAD_G6), allowedApp, 'app');
assertAllowed(changedFilesSince(vault, OBSIDIAN_INPUT_HEAD_G6), allowedVault, 'vault');
assertG7Absent();

console.log('G6_FINAL_STATUS: PASS_FIRST_SAFE_CONTRACT_GUARD_WITH_PROVENANCE_CLARIFICATION');
console.log(`APP_INPUT_HEAD_G6: ${APP_INPUT_HEAD_G6}`);
console.log(`OBSIDIAN_INPUT_HEAD_G6: ${OBSIDIAN_INPUT_HEAD_G6}`);
console.log('GCAL_PROVENANCE_COLLISION_FOUND: YES');
console.log('SOURCE_PROVIDER_ROLE: REMOTE_ASSOCIATION_NOT_ORIGIN');
console.log('IMPORTED_GOOGLE_EVENT_RUNTIME_PREDICATE: type === external_google_event');
console.log('MUTATION_EXISTING_ROW_SNAPSHOT_REQUIRED: YES');
console.log('G7_FIRST_SAFE_CANDIDATE: PURE_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE');
console.log('RUNTIME_CHANGED: NO');
console.log('SRC_CHANGED: NO');
console.log('GCAL_REMOTE_CALL_CHANGED: NO');
console.log('G7_CREATED: NO');
