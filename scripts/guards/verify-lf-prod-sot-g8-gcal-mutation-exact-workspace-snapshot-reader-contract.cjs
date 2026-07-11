const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const APP_INPUT_HEAD_G8 = '2655055bbd88f1b240feb88a880f11c59c493a87';
const OBSIDIAN_INPUT_HEAD_G8 = 'fe51ba541e127e211fe05b0494a17fb3ffee68b2';
const OBSIDIAN_SCOPE_PATH_G8 = '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY';
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g8-gcal-mutation-exact-workspace-snapshot-reader-contract.cjs && tsc --noEmit -p tsconfig.g8.json && node --test tests/lf-prod-sot-g8-gcal-mutation-exact-workspace-snapshot-reader-contract.test.cjs';

const rel = {
  package: 'package.json',
  tsconfig: 'tsconfig.g8.json',
  helper: 'src/server/google-calendar-mutation-snapshot.ts',
  guard: 'scripts/guards/verify-lf-prod-sot-g8-gcal-mutation-exact-workspace-snapshot-reader-contract.cjs',
  test: 'tests/lf-prod-sot-g8-gcal-mutation-exact-workspace-snapshot-reader-contract.test.cjs',
  report: '_project/runs/LF-PROD-SOT-G8_GCAL_MUTATION_EXACT_WORKSPACE_SNAPSHOT_READER_CONTRACT.md',
  facade: 'src/lib/google-calendar-mutation-sync-state-decision.ts',
  taskRoute: 'src/server/task-route-stage124f.ts',
  eventRoute: 'src/server/event-route-stage124f.ts',
  outbound: 'src/server/google-calendar-outbound.ts',
  inbound: 'src/server/google-calendar-inbound.ts',
  supabase: 'src/server/_supabase.ts',
  requestScope: 'src/server/_request-scope.ts',
  router: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G8_GCAL_MUTATION_EXACT_WORKSPACE_SNAPSHOT_READER_CONTRACT_MAP.md',
};

const allowedApp = new Set([
  rel.helper,
  rel.guard,
  rel.test,
  rel.report,
  rel.tsconfig,
  rel.package,
]);
const allowedVault = new Set([rel.router, rel.map]);
const protectedApp = [
  rel.facade,
  rel.taskRoute,
  rel.eventRoute,
  rel.outbound,
  rel.inbound,
  rel.supabase,
  rel.requestScope,
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
        ? `STOP_G8_FORBIDDEN_APP_CHANGE: ${file}`
        : `STOP_G8_FORBIDDEN_OBSIDIAN_CHANGE: ${file}`);
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

function assertUnchangedFromInput(file) {
  const result = spawnSync('git', ['diff', '--quiet', APP_INPUT_HEAD_G8, '--', file], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`G8_PROTECTED_FILE_CHANGED: ${file}`);
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

function assertG9Absent() {
  const roots = [
    [root, '_project/runs'],
    [root, 'scripts/guards'],
    [root, 'tests'],
    [vault, OBSIDIAN_SCOPE_PATH_G8],
  ];
  for (const [base, dirName] of roots) {
    const dir = path.join(base, dirName);
    for (const file of walkFiles(dir)) {
      if (/LF-PROD-SOT-G9[_-]|lf-prod-sot-g9[_-]/i.test(file)) {
        throw new Error(`G9_CREATED_FORBIDDEN: ${path.join(dirName, file)}`);
      }
    }
  }
}

const appBranch = sh(root, ['branch', '--show-current']);
if (appBranch !== 'dev-rollout-freeze') throw new Error(`STOP_BRANCH_MISMATCH: ${appBranch}`);
if (!fs.existsSync(path.join(vault, '.git'))) throw new Error(`STOP_MISSING_OBSIDIAN_REPO: ${vault}`);
const vaultBranch = sh(vault, ['branch', '--show-current']);
if (vaultBranch !== 'main') throw new Error(`STOP_OBSIDIAN_BRANCH_MISMATCH: ${vaultBranch}`);
assertAncestor(root, APP_INPUT_HEAD_G8, 'APP_INPUT_HEAD_G8');
assertAncestor(vault, OBSIDIAN_INPUT_HEAD_G8, 'OBSIDIAN_INPUT_HEAD_G8');

assertAllowed(changedFilesSince(root, APP_INPUT_HEAD_G8), allowedApp, 'app');
assertAllowed(changedFilesSinceScoped(vault, OBSIDIAN_INPUT_HEAD_G8, OBSIDIAN_SCOPE_PATH_G8), allowedVault, 'vault');
for (const file of protectedApp) assertUnchangedFromInput(file);

const pkg = JSON.parse(readAt(root, rel.package));
const basePkg = JSON.parse(sh(root, ['show', `${APP_INPUT_HEAD_G8}:${rel.package}`]));
if (pkg.scripts?.['verify:lf-prod-sot-g8'] !== exactAlias) throw new Error('G8_PACKAGE_ALIAS_MISMATCH');
if (!pkg.scripts?.['verify:lf-prod-sot-g7']) throw new Error('G7_PACKAGE_ALIAS_REMOVED');
if (pkg.scripts?.['verify:lf-prod-sot-g9']) throw new Error('G9_PACKAGE_ALIAS_FORBIDDEN');
const pkgWithoutG8 = structuredClone(pkg);
delete pkgWithoutG8.scripts['verify:lf-prod-sot-g8'];
if (JSON.stringify(stable(pkgWithoutG8)) !== JSON.stringify(stable(basePkg))) {
  throw new Error('G8_PACKAGE_NON_ALIAS_CHANGE');
}

const g8Tsconfig = JSON.parse(readAt(root, rel.tsconfig));
if (g8Tsconfig.extends !== './tsconfig.json') throw new Error('G8_TSCONFIG_EXTENDS_MISMATCH');
if (g8Tsconfig.compilerOptions?.allowJs !== false) throw new Error('G8_TSCONFIG_ALLOW_JS_MUST_BE_FALSE');
if (g8Tsconfig.compilerOptions?.noEmit !== true) throw new Error('G8_TSCONFIG_NO_EMIT_MUST_BE_TRUE');
const expectedInclude = [
  'src/server/google-calendar-mutation-snapshot.ts',
  'src/server/_supabase.ts',
  'src/lib/google-calendar-mutation-sync-state-decision.ts',
];
if (JSON.stringify(g8Tsconfig.include) !== JSON.stringify(expectedInclude)) {
  throw new Error('G8_TSCONFIG_SCOPE_MISMATCH');
}
for (const requiredExclude of ['node_modules', 'dist', '_project', '_local_backups', 'backups', 'bisect', 'scripts', 'tools']) {
  if (!Array.isArray(g8Tsconfig.exclude) || !g8Tsconfig.exclude.includes(requiredExclude)) {
    throw new Error(`G8_TSCONFIG_EXCLUDE_MISSING: ${requiredExclude}`);
  }
}

const helper = readAt(root, rel.helper);
const testSource = readAt(root, rel.test);
const report = readAt(root, rel.report);
const map = readAt(vault, rel.map);
const router = readAt(vault, rel.router);
const taskRoute = readAt(root, rel.taskRoute);
const eventRoute = readAt(root, rel.eventRoute);

must(helper, "import { selectFirstAvailable } from './_supabase.js';");
must(helper, "from '../lib/google-calendar-mutation-sync-state-decision.js';");
must(helper, 'export interface GoogleCalendarMutationSnapshotReadInput');
must(helper, "Omit<GoogleCalendarMutationSyncStateInput, 'mutationKind'>");
must(helper, 'export const GOOGLE_CALENDAR_MUTATION_SNAPSHOT_SELECT');
must(helper, 'export function buildGoogleCalendarMutationSnapshotQuery');
must(helper, 'export function normalizeGoogleCalendarMutationSnapshot');
must(helper, 'export async function readGoogleCalendarMutationSnapshotWithSelect');
must(helper, 'export async function readGoogleCalendarMutationSnapshot');
must(helper, 'select([query])');
must(helper, 'id=eq.');
must(helper, 'workspace_id=eq.');
must(helper, 'limit=1');
must(helper, 'GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE');
must(helper, 'GCAL_MUTATION_SNAPSHOT_ID_MISMATCH');
must(helper, 'GCAL_MUTATION_SNAPSHOT_WORKSPACE_MISMATCH');
for (const field of [
  "'id'",
  "'workspace_id'",
  "'record_type'",
  "'type'",
  "'status'",
  "'show_in_calendar'",
  "'start_at'",
  "'scheduled_at'",
  "'due_at'",
  "'created_by_user_id'",
  "'google_calendar_event_id'",
  "'google_calendar_sync_status'",
]) must(helper, field, `explicit_select:${field}`);
for (const token of [
  'select=*',
  'source_provider',
  'source_external_id',
  'google_calendar_user_id',
  'updateById',
  'updateByIdScoped',
  'updateByWorkspaceAndId',
  'insertWithVariants',
  'supabaseRequest',
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'deleteGoogleCalendarEvent',
  'fetch(',
  'process.env',
  'console.',
  '.catch(',
]) mustNot(helper, token, `helper_forbidden:${token}`);

for (const route of [taskRoute, eventRoute]) {
  mustNot(route, 'google-calendar-mutation-snapshot', 'G8_ROUTE_IMPORT_FORBIDDEN');
  mustNot(route, 'readGoogleCalendarMutationSnapshot', 'G8_ROUTE_CALL_FORBIDDEN');
  mustNot(route, 'decideGoogleCalendarMutationSyncState', 'G7_FACADE_ROUTE_CALL_FORBIDDEN');
}

if ((testSource.match(/\btest\s*\(/g) || []).length < 24) {
  throw new Error('G8_MINIMUM_24_TESTS_REQUIRED');
}
must(testSource, "require('typescript')");
must(testSource, 'ts.transpileModule');
mustNot(testSource, 'function readGoogleCalendarMutationSnapshotWithSelect', 'G8_TEST_DUPLICATE_IMPLEMENTATION');

for (const text of [report, map]) {
  must(text, 'STAGE:');
  must(text, 'LF-PROD-SOT-G8_GCAL_MUTATION_EXACT_WORKSPACE_SNAPSHOT_READER_CONTRACT');
  must(text, 'G7_PRECHECK_BEFORE_G8: PASS');
  must(text, 'G7_PRECHECK_TESTS: 26 PASS / 0 FAIL');
  must(text, 'READER_IS_WORKSPACE_SCOPED: YES');
  must(text, 'READER_USES_EXPLICIT_SELECT: YES');
  must(text, 'READER_QUERY_COUNT: 1');
  must(text, 'READER_HAS_UNSCOPED_FALLBACK: NO');
  must(text, 'READ_ERROR_DISTINGUISHED_FROM_NOT_FOUND: YES');
  must(text, 'SOURCE_PROVIDER_USED_AS_ORIGIN: NO');
  must(text, 'TASK_ROUTE_WIRED_TO_G8: NO');
  must(text, 'EVENT_ROUTE_WIRED_TO_G8: NO');
  must(text, 'DATABASE_WRITE_CHANGED: NO');
  must(text, 'GOOGLE_REMOTE_CALL_CHANGED: NO');
  must(text, 'RUNTIME_BEHAVIOR_CHANGED: NO');
  must(text, 'G9_CREATED: NO');
}

must(router, '<!-- LF-PROD-SOT-G8 START -->');
must(router, '<!-- LF-PROD-SOT-G8 END -->');
must(router, 'LF-PROD-SOT-G8_GCAL_MUTATION_EXACT_WORKSPACE_SNAPSHOT_READER_CONTRACT');
must(router, 'LF-PROD-SOT-G8_GCAL_MUTATION_EXACT_WORKSPACE_SNAPSHOT_READER_CONTRACT_MAP.md');

assertG9Absent();

console.log('G8_FINAL_STATUS: PASS_GCAL_MUTATION_EXACT_WORKSPACE_SNAPSHOT_READER_CONTRACT');
console.log(`APP_INPUT_HEAD_G8: ${APP_INPUT_HEAD_G8}`);
console.log(`OBSIDIAN_INPUT_HEAD_G8: ${OBSIDIAN_INPUT_HEAD_G8}`);
console.log('READER_EXACT_WORKSPACE_SCOPE: PASS');
console.log('READER_USES_EXPLICIT_SELECT: YES');
console.log('READER_QUERY_COUNT: 1');
console.log('UNSCOPED_FALLBACK: NO');
console.log('READ_ERROR_DISTINGUISHED_FROM_NOT_FOUND: YES');
console.log('TASK_ROUTE_WIRED_TO_G8: NO');
console.log('EVENT_ROUTE_WIRED_TO_G8: NO');
console.log('RUNTIME_BEHAVIOR_CHANGED: NO');
console.log('G9_CREATED: NO');
console.log('PASS_GCAL_MUTATION_EXACT_WORKSPACE_SNAPSHOT_READER_CONTRACT');
