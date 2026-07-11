const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { TextDecoder } = require('node:util');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const APP_INPUT_HEAD_G9 = 'ae2cd28d10ed74760487e98f891f23d0098b6a64';
const OBSIDIAN_INPUT_HEAD_G9 = '349192d84009ab7062780ef96c710b1040f10d22';
const OBSIDIAN_SCOPE = '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY';
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g9-gcal-mutation-scoped-sync-state-marker-contract.cjs && tsc --noEmit -p tsconfig.g9.json && node --test tests/lf-prod-sot-g9-gcal-mutation-scoped-sync-state-marker-contract.test.cjs';

const rel = {
  package: 'package.json',
  tsconfig: 'tsconfig.g9.json',
  marker: 'src/server/google-calendar-mutation-sync-state-marker.ts',
  guard: 'scripts/guards/verify-lf-prod-sot-g9-gcal-mutation-scoped-sync-state-marker-contract.cjs',
  test: 'tests/lf-prod-sot-g9-gcal-mutation-scoped-sync-state-marker-contract.test.cjs',
  report: '_project/runs/LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT.md',
  snapshot: 'src/server/google-calendar-mutation-snapshot.ts',
  facade: 'src/lib/google-calendar-mutation-sync-state-decision.ts',
  taskRoute: 'src/server/task-route-stage124f.ts',
  eventRoute: 'src/server/event-route-stage124f.ts',
  outbound: 'src/server/google-calendar-outbound.ts',
  inbound: 'src/server/google-calendar-inbound.ts',
  supabase: 'src/server/_supabase.ts',
  requestScope: 'src/server/_request-scope.ts',
  router: `${OBSIDIAN_SCOPE}/00_MAPY_I_ZALEZNOSCI_SOT.md`,
  map: `${OBSIDIAN_SCOPE}/LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT_MAP.md`,
};

const allowedApp = new Set([
  rel.marker,
  rel.guard,
  rel.test,
  rel.report,
  rel.tsconfig,
  rel.package,
]);
const allowedVault = new Set([rel.router, rel.map]);
const protectedApp = [
  rel.snapshot,
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

function readUtf8(base, file) {
  const full = path.join(base, file);
  if (!fs.existsSync(full)) throw new Error(`MISSING_REQUIRED_FILE: ${file}`);
  const bytes = fs.readFileSync(full);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`INVALID_UTF8: ${file}`);
  }
}

function must(text, token, label = token) {
  if (!text.includes(token)) throw new Error(`MISSING_CONTRACT_TOKEN: ${label}`);
}

function mustNot(text, token, label = token) {
  if (text.includes(token)) throw new Error(`FORBIDDEN_TOKEN: ${label}`);
}

function lines(value) {
  return String(value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function changedFiles(repo, inputHead, pathspec = null) {
  const files = new Set();
  const suffix = pathspec ? ['--', pathspec] : [];
  for (const args of [
    ['diff', '--name-only', `${inputHead}..HEAD`, ...suffix],
    ['diff', '--name-only', ...suffix],
    ['diff', '--cached', '--name-only', ...suffix],
  ]) {
    for (const file of lines(sh(repo, args))) files.add(file.replaceAll('\\', '/'));
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
    if (!pathspec || file === pathspec || file.startsWith(`${pathspec}/`)) files.add(file);
  }
  return [...files];
}

function assertAllowed(files, allowed, code) {
  for (const file of files) {
    if (!allowed.has(file)) throw new Error(`${code}: ${file}`);
  }
}

function assertAncestor(repo, sha, label) {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', sha, 'HEAD'], { cwd: repo });
  if (result.status !== 0) throw new Error(`${label}_NOT_ANCESTOR_OF_HEAD`);
}

function assertUnchanged(file) {
  const result = spawnSync('git', ['diff', '--quiet', APP_INPUT_HEAD_G9, '--', file], { cwd: root });
  if (result.status !== 0) throw new Error(`G9_PROTECTED_FILE_CHANGED: ${file}`);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

function walk(base, relative = '') {
  const full = path.join(base, relative);
  if (!fs.existsSync(full)) return [];
  const output = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) output.push(...walk(base, next));
    if (entry.isFile()) output.push(next.replaceAll('\\', '/'));
  }
  return output;
}

function assertG10Absent() {
  for (const [base, relative] of [
    [root, '_project/runs'],
    [root, 'scripts/guards'],
    [root, 'tests'],
    [vault, OBSIDIAN_SCOPE],
  ]) {
    for (const file of walk(path.join(base, relative))) {
      if (/LF-PROD-SOT-G10[_-]|lf-prod-sot-g10[_-]/i.test(file)) {
        throw new Error(`G10_CREATED_FORBIDDEN: ${path.join(relative, file)}`);
      }
    }
  }
}

const appBranch = sh(root, ['branch', '--show-current']);
if (appBranch !== 'dev-rollout-freeze') throw new Error(`STOP_BRANCH_MISMATCH: ${appBranch}`);
if (!fs.existsSync(path.join(vault, '.git'))) throw new Error(`STOP_MISSING_OBSIDIAN_REPO: ${vault}`);
const vaultBranch = sh(vault, ['branch', '--show-current']);
if (vaultBranch !== 'main') throw new Error(`STOP_OBSIDIAN_BRANCH_MISMATCH: ${vaultBranch}`);

assertAncestor(root, APP_INPUT_HEAD_G9, 'APP_INPUT_HEAD_G9');
assertAncestor(vault, OBSIDIAN_INPUT_HEAD_G9, 'OBSIDIAN_INPUT_HEAD_G9');
assertAllowed(changedFiles(root, APP_INPUT_HEAD_G9), allowedApp, 'STOP_G9_FORBIDDEN_APP_CHANGE');
assertAllowed(changedFiles(vault, OBSIDIAN_INPUT_HEAD_G9, OBSIDIAN_SCOPE), allowedVault, 'STOP_G9_FORBIDDEN_OBSIDIAN_CHANGE');
for (const file of protectedApp) assertUnchanged(file);

const pkg = JSON.parse(readUtf8(root, rel.package));
const basePkg = JSON.parse(sh(root, ['show', `${APP_INPUT_HEAD_G9}:${rel.package}`]));
if (pkg.scripts?.['verify:lf-prod-sot-g9'] !== exactAlias) throw new Error('G9_PACKAGE_ALIAS_MISMATCH');
if (!pkg.scripts?.['verify:lf-prod-sot-g7']) throw new Error('G7_PACKAGE_ALIAS_REMOVED');
if (!pkg.scripts?.['verify:lf-prod-sot-g8']) throw new Error('G8_PACKAGE_ALIAS_REMOVED');
if (pkg.scripts?.['verify:lf-prod-sot-g10']) throw new Error('G10_PACKAGE_ALIAS_FORBIDDEN');
const pkgWithoutG9 = structuredClone(pkg);
delete pkgWithoutG9.scripts['verify:lf-prod-sot-g9'];
if (JSON.stringify(stable(pkgWithoutG9)) !== JSON.stringify(stable(basePkg))) {
  throw new Error('G9_PACKAGE_NON_ALIAS_CHANGE');
}

const tsconfig = JSON.parse(readUtf8(root, rel.tsconfig));
const exactInclude = [
  rel.marker,
  rel.snapshot,
  rel.facade,
  rel.supabase,
];
const exactExclude = ['node_modules', 'dist', '_project', '_local_backups', 'backups', 'bisect', 'scripts', 'tools'];
if (tsconfig.extends !== './tsconfig.json') throw new Error('G9_TSCONFIG_EXTENDS_MISMATCH');
if (tsconfig.compilerOptions?.allowJs !== false || tsconfig.compilerOptions?.noEmit !== true) {
  throw new Error('G9_TSCONFIG_COMPILER_OPTIONS_MISMATCH');
}
if (JSON.stringify(tsconfig.include) !== JSON.stringify(exactInclude)) throw new Error('G9_TSCONFIG_SCOPE_MISMATCH');
if (JSON.stringify(tsconfig.exclude) !== JSON.stringify(exactExclude)) throw new Error('G9_TSCONFIG_EXCLUDE_MISMATCH');

const marker = readUtf8(root, rel.marker);
const testSource = readUtf8(root, rel.test);
const report = readUtf8(root, rel.report);
const map = readUtf8(vault, rel.map);
const router = readUtf8(vault, rel.router);
const taskRoute = readUtf8(root, rel.taskRoute);
const eventRoute = readUtf8(root, rel.eventRoute);

for (const token of [
  "import { updateByIdScoped } from './_supabase.js';",
  'readGoogleCalendarMutationSnapshot',
  'decideGoogleCalendarMutationSyncState',
  'GoogleCalendarMutationSyncStateMarkerInput',
  'GoogleCalendarMutationSyncStateMarkerDependencies',
  'GoogleCalendarMutationSyncStateMarkerResult',
  'GoogleCalendarMutationSyncStateWriteConfirmation',
  'markGoogleCalendarMutationSyncStateWithDependencies',
  'markGoogleCalendarMutationSyncState',
  'GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_DECISION',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_INVALID_RESPONSE',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_ID_MISMATCH',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_WORKSPACE_MISMATCH',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_STATUS_MISMATCH',
  'found: false',
  'wrote: false',
  'confirmation: null',
  "'work_items'",
  'snapshot.id',
  'snapshot.workspaceId',
  'google_calendar_sync_status: nextSyncStatus',
]) must(marker, token);

for (const token of [
  'updated_at',
  'source_provider',
  'source_external_id',
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'deleteGoogleCalendarEvent',
  'fetch(',
  'process.env',
  'console.',
  'setTimeout',
  'setInterval',
  '.catch(',
  'external_google_event',
  'CLOSED_OR_DELETE_STATUSES',
]) mustNot(marker, token, `marker_forbidden:${token}`);

if (/\bupdateById\s*\(/.test(marker)) throw new Error('FORBIDDEN_UNSCOPED_UPDATE_BY_ID_CALL');
if (/\bupdateByWorkspaceAndId\s*\(/.test(marker)) throw new Error('FORBIDDEN_UPDATE_BY_WORKSPACE_AND_ID_CALL');
if (/\bupdateWhere\s*\(/.test(marker)) throw new Error('FORBIDDEN_UPDATE_WHERE_CALL');
if (/\bsupabaseRequest\s*\(/.test(marker)) throw new Error('FORBIDDEN_SUPABASE_REQUEST_CALL');
if (/\binsertWithVariants\s*\(/.test(marker)) throw new Error('FORBIDDEN_INSERT_WITH_VARIANTS_CALL');

for (const route of [taskRoute, eventRoute]) {
  mustNot(route, 'google-calendar-mutation-sync-state-marker', 'G9_ROUTE_IMPORT_FORBIDDEN');
  mustNot(route, 'markGoogleCalendarMutationSyncState', 'G9_ROUTE_CALL_FORBIDDEN');
}

const testCount = (testSource.match(/\btest\s*\(/g) || []).length;
if (testCount < 42) throw new Error(`G9_TEST_COUNT_TOO_LOW: ${testCount}`);
for (const token of [
  "require('typescript')",
  'ts.transpileModule',
  'decisionPath',
  'realDecide',
  'GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_DECISION',
  'snapshot id',
  'snapshot workspaceId',
]) must(testSource, token);
mustNot(testSource, 'function decideGoogleCalendarMutationSyncState', 'G9_TEST_LOCAL_G7_COPY_FORBIDDEN');
mustNot(testSource, 'function markGoogleCalendarMutationSyncStateWithDependencies', 'G9_TEST_MARKER_COPY_FORBIDDEN');

for (const text of [report, map]) {
  for (const token of [
    'LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT',
    'MARKER_USES_G8_READER: YES',
    'MARKER_USES_G7_FACADE: YES',
    'MARKER_WRITE_IS_WORKSPACE_SCOPED: YES',
    'WRITE_ALLOWED_STATUSES: pending / pending_delete',
    'WRITE_PAYLOAD_FIELDS: google_calendar_sync_status',
    'INVALID_DECISION_IS_HARD_ERROR: YES',
    'WRITE_RESPONSE_HARD_CONFIRMED: YES',
    'TASK_ROUTE_WIRED: NO',
    'EVENT_ROUTE_WIRED: NO',
    'RUNTIME_BEHAVIOR_CHANGED: NO',
    'G10_CREATED: NO',
  ]) must(text, token);
}

must(router, '<!-- LF-PROD-SOT-G9 START -->');
must(router, '<!-- LF-PROD-SOT-G9 END -->');
must(router, 'LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT');
must(map, 'G9_CONTRACT_REPAIR: PASS');
assertG10Absent();

console.log('G9_FINAL_STATUS: PASS_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT');
console.log(`APP_INPUT_HEAD_G9: ${APP_INPUT_HEAD_G9}`);
console.log(`OBSIDIAN_INPUT_HEAD_G9: ${OBSIDIAN_INPUT_HEAD_G9}`);
console.log(`G9_TEST_COUNT_DISCOVERED: ${testCount}`);
console.log('INVALID_DECISION_IS_HARD_ERROR: YES');
console.log('SCOPED_STATUS_WRITE: PASS');
console.log('WRITE_RESPONSE_CONFIRMATION: PASS');
console.log('TASK_ROUTE_WIRED_TO_G9: NO');
console.log('EVENT_ROUTE_WIRED_TO_G9: NO');
console.log('RUNTIME_BEHAVIOR_CHANGED: NO');
console.log('G10_CREATED: NO');
