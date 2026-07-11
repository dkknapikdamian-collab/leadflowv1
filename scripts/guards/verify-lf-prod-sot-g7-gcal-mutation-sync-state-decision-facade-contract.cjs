const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const APP_INPUT_HEAD_G7 = '22ff153ef372670f987318aa373e9ffd49089086';
const OBSIDIAN_INPUT_HEAD_G7 = 'c0fa5f9755b3c0e08ba7620fba984c315704382c';
const OBSIDIAN_SCOPE_PATH_G7 = '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY';
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g7-gcal-mutation-sync-state-decision-facade-contract.cjs && tsc --noEmit -p tsconfig.g7.json && node --test tests/lf-prod-sot-g7-gcal-mutation-sync-state-decision-facade-contract.test.cjs';

const rel = {
  package: 'package.json',
  tsconfig: 'tsconfig.g7.json',
  facade: 'src/lib/google-calendar-mutation-sync-state-decision.ts',
  guard: 'scripts/guards/verify-lf-prod-sot-g7-gcal-mutation-sync-state-decision-facade-contract.cjs',
  test: 'tests/lf-prod-sot-g7-gcal-mutation-sync-state-decision-facade-contract.test.cjs',
  report: '_project/runs/LF-PROD-SOT-G7_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT.md',
  taskRoute: 'src/server/task-route-stage124f.ts',
  eventRoute: 'src/server/event-route-stage124f.ts',
  outbound: 'src/server/google-calendar-outbound.ts',
  inbound: 'src/server/google-calendar-inbound.ts',
  router: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G7_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT_MAP.md',
};

const allowedApp = new Set([rel.facade, rel.guard, rel.test, rel.report, rel.package, rel.tsconfig]);
const allowedVault = new Set([rel.router, rel.map]);
const runtimeFiles = [rel.taskRoute, rel.eventRoute, rel.outbound, rel.inbound];
const forbiddenIoTokens = [
  'fetch(',
  'supabaseRequest',
  'updateById',
  'insert',
  'deleteGoogleCalendarEvent',
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'syncGoogleCalendarOutbound',
  'getGoogleCalendarUserConnection',
  'process.env',
  'console.',
  'Date(',
  'new Date',
  'setTimeout',
  'setInterval',
  'window',
  'document',
];

const forbiddenMojibakeTokens = [
  '\u00e2\u20ac\u201d',
  '\u00e2\u20ac\u201c',
  '\u00c3',
  '\u00c2',
];

const packageJsonRawTextDiffUsedAsAcceptance = false;

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

function assertNoForbiddenMojibake(text, label) {
  for (const token of forbiddenMojibakeTokens) {
    if (text.includes(token)) {
      throw new Error(`FORBIDDEN_MOJIBAKE_TOKEN: ${label}:${JSON.stringify(token)}`);
    }
  }
}

function extractRouterG7CloseoutRegion(text) {
  const startMarker = '<!-- LF-PROD-SOT-G7 START -->';
  const endMarker = '<!-- LF-PROD-SOT-G7-R2-R3 END -->';
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker);
  if (start < 0 || end < start) throw new Error('G7_ROUTER_CLOSEOUT_REGION_MISSING');
  return text.slice(start, end + endMarker.length);
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

function changedFilesSinceScoped(repo, inputHead, pathspec) {
  const files = new Set();
  for (const args of [
    ['diff', '--name-only', `${inputHead}..HEAD`, '--', pathspec],
    ['diff', '--name-only', '--', pathspec],
    ['diff', '--cached', '--name-only', '--', pathspec],
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
    file = file.replaceAll('\\', '/');
    if (file === pathspec || file.startsWith(`${pathspec}/`)) files.add(file);
  }
  return [...files];
}

function assertAllowed(files, allowed, kind) {
  for (const file of files) {
    if (!allowed.has(file)) {
      throw new Error(kind === 'app'
        ? `STOP_G7_FORBIDDEN_APP_CHANGE: ${file}`
        : `STOP_G7_FORBIDDEN_OBSIDIAN_CHANGE: ${file}`);
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

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

function walkFiles(base, relative = '') {
  const full = path.join(base, relative);
  if (!fs.existsSync(full)) return [];
  const entries = fs.readdirSync(full, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(base, next));
    else if (entry.isFile()) files.push(next.replaceAll('\\', '/'));
  }
  return files;
}

function assertG8Absent() {
  const roots = [
    [root, '_project/runs'],
    [root, 'scripts/guards'],
    [root, 'tests'],
    [vault, OBSIDIAN_SCOPE_PATH_G7],
  ];
  for (const [base, dirName] of roots) {
    const dir = path.join(base, dirName);
    for (const file of walkFiles(dir)) {
      if (/LF-PROD-SOT-G8[_-]|lf-prod-sot-g8[_-]/i.test(file)) {
        throw new Error(`G8_CREATED_FORBIDDEN: ${path.join(dirName, file)}`);
      }
    }
  }
}

const appBranch = sh(root, ['branch', '--show-current']);
if (appBranch !== 'dev-rollout-freeze') throw new Error(`STOP_BRANCH_MISMATCH: ${appBranch}`);
if (!fs.existsSync(path.join(vault, '.git'))) throw new Error(`STOP_MISSING_OBSIDIAN_REPO: ${vault}`);
const vaultBranch = sh(vault, ['branch', '--show-current']);
if (vaultBranch !== 'main') throw new Error(`STOP_OBSIDIAN_BRANCH_MISMATCH: ${vaultBranch}`);
assertAncestor(root, APP_INPUT_HEAD_G7, 'APP_INPUT_HEAD_G7');
assertAncestor(vault, OBSIDIAN_INPUT_HEAD_G7, 'OBSIDIAN_INPUT_HEAD_G7');

assertAllowed(changedFilesSince(root, APP_INPUT_HEAD_G7), allowedApp, 'app');
assertAllowed(changedFilesSinceScoped(vault, OBSIDIAN_INPUT_HEAD_G7, OBSIDIAN_SCOPE_PATH_G7), allowedVault, 'vault');

const pkg = JSON.parse(readAt(root, rel.package));
const basePkg = JSON.parse(sh(root, ['show', `${APP_INPUT_HEAD_G7}:${rel.package}`]));
if (pkg.scripts?.['verify:lf-prod-sot-g7'] !== exactAlias) throw new Error('G7_PACKAGE_ALIAS_MISMATCH');
if (!pkg.scripts?.['verify:lf-prod-sot-g6']) throw new Error('G6_PACKAGE_ALIAS_REMOVED');
if (pkg.scripts?.['verify:lf-prod-sot-g8']) throw new Error('G8_PACKAGE_ALIAS_FORBIDDEN');
const pkgWithoutG7 = structuredClone(pkg);
delete pkgWithoutG7.scripts['verify:lf-prod-sot-g7'];
if (JSON.stringify(stable(pkgWithoutG7)) !== JSON.stringify(stable(basePkg))) {
  throw new Error('G7_PACKAGE_NON_ALIAS_CHANGE');
}

const g7Tsconfig = JSON.parse(readAt(root, rel.tsconfig));
if (g7Tsconfig.extends !== './tsconfig.json') throw new Error('G7_TSCONFIG_EXTENDS_MISMATCH');
if (g7Tsconfig.compilerOptions?.allowJs !== false) throw new Error('G7_TSCONFIG_ALLOW_JS_MUST_BE_FALSE');
if (g7Tsconfig.compilerOptions?.noEmit !== true) throw new Error('G7_TSCONFIG_NO_EMIT_MUST_BE_TRUE');
const expectedG7Include = ['src/lib/google-calendar-mutation-sync-state-decision.ts'];
if (JSON.stringify(g7Tsconfig.include) !== JSON.stringify(expectedG7Include)) {
  throw new Error('G7_TSCONFIG_SCOPE_MISMATCH');
}
for (const requiredExclude of ['node_modules', 'dist', '_project', '_local_backups', '2.closeflow_bisect', 'scripts', 'tools']) {
  if (!Array.isArray(g7Tsconfig.exclude) || !g7Tsconfig.exclude.includes(requiredExclude)) {
    throw new Error(`G7_TSCONFIG_EXCLUDE_MISSING: ${requiredExclude}`);
  }
}
const facade = readAt(root, rel.facade);
const guardSource = readAt(root, rel.guard);
const testSource = readAt(root, rel.test);
const report = readAt(root, rel.report);
const map = readAt(vault, rel.map);
const router = readAt(vault, rel.router);
const routerG7CloseoutRegion = extractRouterG7CloseoutRegion(router);

assertNoForbiddenMojibake(report, 'app_report');
assertNoForbiddenMojibake(map, 'vault_map');
assertNoForbiddenMojibake(routerG7CloseoutRegion, 'vault_router_g7_closeout_region');

if (packageJsonRawTextDiffUsedAsAcceptance !== false) {
  throw new Error('PACKAGE_JSON_RAW_TEXT_DIFF_ACCEPTANCE_FORBIDDEN');
}
for (const token of [
  '--' + 'numstat',
  'PACKAGE_JSON_RAW_TEXT_DIFF_USED_AS_ACCEPTANCE:' + ' YES',
]) {
  mustNot(guardSource, token, `package_raw_diff_acceptance:${token}`);
}

must(facade, 'export type GoogleCalendarMutationKind');
must(facade, 'export type GoogleCalendarMutationSyncStateOutcome');
must(facade, 'export interface GoogleCalendarMutationSyncStateInput');
must(facade, 'export interface GoogleCalendarMutationSyncStateDecision');
must(facade, 'export function decideGoogleCalendarMutationSyncState');
for (const token of [
  "'pending'",
  "'pending_delete'",
  "'unchanged'",
  "'skip_imported'",
  "'skip_no_owner'",
  "'skip_no_calendar_time'",
  'nextSyncStatus',
  'shouldWrite',
  "'external_google_event'",
]) must(facade, token);

if ((facade.match(/export\s+function\s+/g) || []).length !== 1) {
  throw new Error('G7_EXACTLY_ONE_EXPORTED_FUNCTION_REQUIRED');
}
if (/^\s*import\s/m.test(facade)) throw new Error('G7_FACADE_IMPORT_FORBIDDEN');
for (const token of forbiddenIoTokens) mustNot(facade, token, `facade_io:${token}`);
for (const token of ['sourceProvider', 'source_provider', 'sourceExternalId', 'source_external_id']) {
  mustNot(facade, token, `origin_input:${token}`);
}

const inputStart = facade.indexOf('export interface GoogleCalendarMutationSyncStateInput');
const inputEnd = facade.indexOf('export interface GoogleCalendarMutationSyncStateDecision');
if (inputStart < 0 || inputEnd <= inputStart) throw new Error('G7_INPUT_INTERFACE_SECTION_MISSING');
const inputSection = facade.slice(inputStart, inputEnd);
for (const token of ['workspaceId', 'userId', 'connection', 'supabase', 'request', 'response']) {
  if (new RegExp(`\\b${token}\\b`).test(inputSection)) throw new Error(`G7_FORBIDDEN_INPUT_FIELD: ${token}`);
}

const orderedTokens = [
  "if (type === 'external_google_event')",
  "if (recordType !== 'task' && recordType !== 'event')",
  'if (!hasOwner)',
  'if (hasGoogleCalendarEventId && requestsRemoteDelete)',
  'if (!hasGoogleCalendarEventId && requestsRemoteDelete)',
  "if (mutationKind !== 'create' && mutationKind !== 'update')",
  'if (showInCalendar !== true)',
  'if (input.hasCalendarTime !== true)',
  "outcome: 'pending'",
];
let previousIndex = -1;
for (const token of orderedTokens) {
  const index = facade.indexOf(token, previousIndex + 1);
  if (index < 0) throw new Error(`G7_DECISION_RULE_MISSING: ${token}`);
  if (index <= previousIndex) throw new Error(`G7_DECISION_RULE_ORDER_INVALID: ${token}`);
  previousIndex = index;
}
for (const status of ['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed']) {
  must(facade, `'${status}'`, `closed_status:${status}`);
}

for (const file of runtimeFiles) {
  const source = readAt(root, file);
  mustNot(source, 'google-calendar-mutation-sync-state-decision', `${file}:facade_import`);
  mustNot(source, 'decideGoogleCalendarMutationSyncState', `${file}:facade_call`);
}

must(testSource, "require('typescript')", 'behavioral_test_typescript');
must(testSource, 'typescript.transpileModule'.replace('typescript.', 'ts.'), 'behavioral_test_transpile');
must(testSource, 'decideGoogleCalendarMutationSyncState', 'behavioral_test_real_function');
mustNot(testSource, 'function decideGoogleCalendarMutationSyncState', 'behavioral_test_duplicate_implementation');

for (const text of [report, map]) {
  must(text, 'APP_INPUT_HEAD_G7: 22ff153ef372670f987318aa373e9ffd49089086');
  must(text, 'OBSIDIAN_INPUT_HEAD_G7: c0fa5f9755b3c0e08ba7620fba984c315704382c');
  must(text, 'G7_FINAL_STATUS: PASS_PURE_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT');
  must(text, 'FACADE_IS_PURE: YES');
  must(text, 'FACADE_HAS_IO: NO');
  must(text, 'SOURCE_PROVIDER_USED_AS_ORIGIN: NO');
  must(text, 'TASK_ROUTE_WIRED: NO');
  must(text, 'EVENT_ROUTE_WIRED: NO');
  must(text, 'OUTBOUND_WIRED: NO');
  must(text, 'INBOUND_CHANGED: NO');
  must(text, 'SQL_API_SUPABASE_CHANGED: NO');
  must(text, 'GOOGLE_REMOTE_CALL_CHANGED: NO');
  must(text, 'RUNTIME_BEHAVIOR_CHANGED: NO');
  must(text, 'G8_CREATED: NO');
  must(text, 'REPAIR_STAGE: LF-PROD-SOT-G7-R2-R3_MOJIBAKE_GUARD_AND_PACKAGE_DIFF_TRUTH_CLOSEOUT');
  must(text, 'MOJIBAKE_EXECUTABLE_GUARD: PASS');
  must(text, 'PACKAGE_JSON_RAW_TEXT_DIFF_USED_AS_ACCEPTANCE: NO');
  must(text, 'PASS_G7_EXECUTABLE_MOJIBAKE_GUARD_AND_PACKAGE_DIFF_TRUTH');
}

must(router, '<!-- LF-PROD-SOT-G7 START -->');
must(router, '<!-- LF-PROD-SOT-G7 END -->');
must(router, 'SOT_ROUTER_MATRIX_UPDATED_THROUGH_G7');
must(router, 'SOT_ROUTER_UPDATED_THROUGH_G7');
must(router, 'G7_FINAL_STATUS:');
must(router, 'PASS_PURE_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT');
must(router, 'FACADE_IS_PURE:');
must(router, 'TASK_EVENT_ROUTE_WIRING:');
must(router, 'SOURCE_PROVIDER_USED_AS_ORIGIN:');
must(router, 'G8_CREATED:');
must(router, 'NEXT_STAGE_DECISION:');
must(router, 'DO_POTWIERDZENIA_AFTER_G7_VERIFICATION');
must(routerG7CloseoutRegion, '<!-- LF-PROD-SOT-G7-R2-R3 START -->');
must(routerG7CloseoutRegion, 'LF-PROD-SOT-G7-R2-R3_MOJIBAKE_GUARD_AND_PACKAGE_DIFF_TRUTH_CLOSEOUT');
must(routerG7CloseoutRegion, 'MOJIBAKE_EXECUTABLE_GUARD:');
must(routerG7CloseoutRegion, 'PACKAGE_JSON_RAW_TEXT_DIFF_USED_AS_ACCEPTANCE:');
must(routerG7CloseoutRegion, 'PASS_G7_EXECUTABLE_MOJIBAKE_GUARD_AND_PACKAGE_DIFF_TRUTH');

assertG8Absent();

console.log('G7_FINAL_STATUS: PASS_PURE_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT');
console.log(`APP_INPUT_HEAD_G7: ${APP_INPUT_HEAD_G7}`);
console.log(`OBSIDIAN_INPUT_HEAD_G7: ${OBSIDIAN_INPUT_HEAD_G7}`);
console.log('FACADE_IS_PURE: YES');
console.log('FACADE_HAS_IO: NO');
console.log('SOURCE_PROVIDER_USED_AS_ORIGIN: NO');
console.log('TASK_ROUTE_WIRED: NO');
console.log('EVENT_ROUTE_WIRED: NO');
console.log('OUTBOUND_WIRED: NO');
console.log('INBOUND_CHANGED: NO');
console.log('SQL_API_SUPABASE_CHANGED: NO');
console.log('GOOGLE_REMOTE_CALL_CHANGED: NO');
console.log('RUNTIME_BEHAVIOR_CHANGED: NO');
console.log('G8_CREATED: NO');
console.log('MOJIBAKE_EXECUTABLE_GUARD: PASS');
console.log('PACKAGE_JSON_RAW_TEXT_DIFF_USED_AS_ACCEPTANCE: NO');
console.log('G7_R2_R3_FINAL_STATUS: PASS_G7_EXECUTABLE_MOJIBAKE_GUARD_AND_PACKAGE_DIFF_TRUTH');
console.log('PASS_G7_EXECUTABLE_MOJIBAKE_GUARD_AND_PACKAGE_DIFF_TRUTH');
