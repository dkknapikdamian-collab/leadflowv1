const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const APP_INPUT_HEAD_G9 = 'ae2cd28d10ed74760487e98f891f23d0098b6a64';
const OBSIDIAN_INPUT_HEAD_G9 = '349192d84009ab7062780ef96c710b1040f10d22';
const OBSIDIAN_SCOPE_PATH_G9 = '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY';
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
  router: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT_MAP.md',
};

const allowedApp = new Set([
  rel.marker,
  rel.guard,
  rel.test,
  rel.report,
  rel.tsconfig,
  rel.package,
]);

const allowedVault = new Set([
  rel.router,
  rel.map,
]);

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
  return String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function changedFilesSince(repo, inputHead) {
  const files = new Set();

  for (const args of [
    ['diff', '--name-only', `${inputHead}..HEAD`],
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
  ]) {
    for (const file of listLines(sh(repo, args))) {
      files.add(file.replaceAll('\\', '/'));
    }
  }

  const status = execFileSync(
    'git',
    ['status', '--porcelain', '--untracked-files=all'],
    {
      cwd: repo,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

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
    for (const file of listLines(sh(repo, args))) {
      files.add(file.replaceAll('\\', '/'));
    }
  }

  const status = execFileSync(
    'git',
    ['status', '--porcelain', '--untracked-files=all'],
    {
      cwd: repo,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  for (const line of String(status || '').split(/\r?\n/).filter(Boolean)) {
    let file = line.slice(3).trim();
    if (file.includes(' -> ')) file = file.split(' -> ').at(-1);
    file = file.replaceAll('\\', '/');
    if (file === pathspec || file.startsWith(`${pathspec}/`)) {
      files.add(file);
    }
  }

  return [...files];
}

function assertAllowed(files, allowed, kind) {
  for (const file of files) {
    if (!allowed.has(file)) {
      throw new Error(
        kind === 'app'
          ? `STOP_G9_FORBIDDEN_APP_CHANGE: ${file}`
          : `STOP_G9_FORBIDDEN_OBSIDIAN_CHANGE: ${file}`,
      );
    }
  }
}

function assertAncestor(repo, inputHead, label) {
  const result = spawnSync(
    'git',
    ['merge-base', '--is-ancestor', inputHead, 'HEAD'],
    {
      cwd: repo,
      encoding: 'utf8',
    },
  );

  if (result.status !== 0) {
    throw new Error(`${label}_NOT_ANCESTOR_OF_HEAD`);
  }
}

function assertUnchangedFromInput(file) {
  const result = spawnSync(
    'git',
    ['diff', '--quiet', APP_INPUT_HEAD_G9, '--', file],
    {
      cwd: root,
      encoding: 'utf8',
    },
  );

  if (result.status !== 0) {
    throw new Error(`G9_PROTECTED_FILE_CHANGED: ${file}`);
  }
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, stable(value[key])]),
  );
}

function walkFiles(base, relative = '') {
  const full = path.join(base, relative);
  if (!fs.existsSync(full)) return [];

  const files = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(base, next));
    if (entry.isFile()) files.push(next.replaceAll('\\', '/'));
  }
  return files;
}

function assertG10Absent() {
  const roots = [
    [root, '_project/runs'],
    [root, 'scripts/guards'],
    [root, 'tests'],
    [vault, OBSIDIAN_SCOPE_PATH_G9],
  ];

  for (const [base, dirName] of roots) {
    const dir = path.join(base, dirName);
    for (const file of walkFiles(dir)) {
      if (/LF-PROD-SOT-G10[_-]|lf-prod-sot-g10[_-]/i.test(file)) {
        throw new Error(`G10_CREATED_FORBIDDEN: ${path.join(dirName, file)}`);
      }
    }
  }
}

const appBranch = sh(root, ['branch', '--show-current']);
if (appBranch !== 'dev-rollout-freeze') {
  throw new Error(`STOP_APP_BRANCH_MISMATCH: ${appBranch}`);
}

if (!fs.existsSync(path.join(vault, '.git'))) {
  throw new Error(`STOP_MISSING_OBSIDIAN_REPO: ${vault}`);
}

const vaultBranch = sh(vault, ['branch', '--show-current']);
if (vaultBranch !== 'main') {
  throw new Error(`STOP_OBSIDIAN_BRANCH_MISMATCH: ${vaultBranch}`);
}

assertAncestor(root, APP_INPUT_HEAD_G9, 'APP_INPUT_HEAD_G9');
assertAncestor(vault, OBSIDIAN_INPUT_HEAD_G9, 'OBSIDIAN_INPUT_HEAD_G9');

assertAllowed(
  changedFilesSince(root, APP_INPUT_HEAD_G9),
  allowedApp,
  'app',
);
assertAllowed(
  changedFilesSinceScoped(
    vault,
    OBSIDIAN_INPUT_HEAD_G9,
    OBSIDIAN_SCOPE_PATH_G9,
  ),
  allowedVault,
  'vault',
);

for (const file of protectedApp) {
  assertUnchangedFromInput(file);
}

const pkg = JSON.parse(readAt(root, rel.package));
const basePkg = JSON.parse(
  sh(root, ['show', `${APP_INPUT_HEAD_G9}:${rel.package}`]),
);

if (pkg.scripts?.['verify:lf-prod-sot-g9'] !== exactAlias) {
  throw new Error('G9_PACKAGE_ALIAS_MISMATCH');
}

if (!pkg.scripts?.['verify:lf-prod-sot-g8']) {
  throw new Error('G8_PACKAGE_ALIAS_REMOVED');
}

if (pkg.scripts?.['verify:lf-prod-sot-g10']) {
  throw new Error('G10_PACKAGE_ALIAS_FORBIDDEN');
}

const pkgWithoutG9 = structuredClone(pkg);
delete pkgWithoutG9.scripts['verify:lf-prod-sot-g9'];

if (
  JSON.stringify(stable(pkgWithoutG9))
  !== JSON.stringify(stable(basePkg))
) {
  throw new Error('G9_PACKAGE_NON_ALIAS_CHANGE');
}

const g9Tsconfig = JSON.parse(readAt(root, rel.tsconfig));
if (g9Tsconfig.extends !== './tsconfig.json') {
  throw new Error('G9_TSCONFIG_EXTENDS_MISMATCH');
}
if (g9Tsconfig.compilerOptions?.allowJs !== false) {
  throw new Error('G9_TSCONFIG_ALLOW_JS_MUST_BE_FALSE');
}
if (g9Tsconfig.compilerOptions?.noEmit !== true) {
  throw new Error('G9_TSCONFIG_NO_EMIT_MUST_BE_TRUE');
}

const expectedInclude = [
  'src/server/google-calendar-mutation-sync-state-marker.ts',
  'src/server/google-calendar-mutation-snapshot.ts',
  'src/server/_supabase.ts',
  'src/lib/google-calendar-mutation-sync-state-decision.ts',
];

if (JSON.stringify(g9Tsconfig.include) !== JSON.stringify(expectedInclude)) {
  throw new Error('G9_TSCONFIG_SCOPE_MISMATCH');
}

for (const requiredExclude of [
  'node_modules',
  'dist',
  '_project',
  '_local_backups',
  'backups',
  'bisect',
  'scripts',
  'tools',
]) {
  if (
    !Array.isArray(g9Tsconfig.exclude)
    || !g9Tsconfig.exclude.includes(requiredExclude)
  ) {
    throw new Error(`G9_TSCONFIG_EXCLUDE_MISSING: ${requiredExclude}`);
  }
}

const marker = readAt(root, rel.marker);
const testSource = readAt(root, rel.test);
const report = readAt(root, rel.report);
const map = readAt(vault, rel.map);
const router = readAt(vault, rel.router);
const taskRoute = readAt(root, rel.taskRoute);
const eventRoute = readAt(root, rel.eventRoute);

for (const token of [
  "import { updateByIdScoped } from './_supabase.js';",
  'readGoogleCalendarMutationSnapshot',
  'decideGoogleCalendarMutationSyncState',
  'markGoogleCalendarMutationSyncStateWithDependencies',
  'markGoogleCalendarMutationSyncState',
  'GoogleCalendarMutationSyncStateMarkerDependencies',
  'GoogleCalendarMutationSyncStateMarkerResult',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WORK_ITEM_ID_REQUIRED',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WORKSPACE_ID_REQUIRED',
  'GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_WRITE_RESPONSE',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED',
  'GCAL_MUTATION_SYNC_STATE_MARKER_MULTIPLE_ROWS_UPDATED',
  'GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_UPDATED_ROW',
  'GCAL_MUTATION_SYNC_STATE_MARKER_ID_MISMATCH',
  'GCAL_MUTATION_SYNC_STATE_MARKER_WORKSPACE_MISMATCH',
  'GCAL_MUTATION_SYNC_STATE_MARKER_STATUS_MISMATCH',
  'GCAL_MUTATION_SYNC_STATE_MARKER_UNSUPPORTED_STATUS',
  "'work_items'",
  'google_calendar_sync_status',
  "'pending'",
  "'pending_delete'",
]) {
  must(marker, token);
}

must(
  marker,
  `dependencies.updateScoped(
    'work_items',
    workItemId,
    workspaceId,
    {
      google_calendar_sync_status: decision.nextSyncStatus,
    },
  );`,
  'exact_scoped_update_call',
);

for (const token of [
  'updated_at',
  'google_calendar_sync_error',
  'google_calendar_event_id',
  'google_calendar_id',
  'google_calendar_synced_at',
  'source_provider',
  'source_external_id',
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'deleteGoogleCalendarEvent',
  'fetch(',
  'process.env',
  'console.',
  'Date(',
  'new Date',
  '.catch(',
]) {
  mustNot(marker, token, `marker_forbidden:${token}`);
}

if (/\bupdateById\s*\(/.test(marker)) {
  throw new Error('FORBIDDEN_UNSCOPED_UPDATE_BY_ID_CALL');
}
if (/\bupdateByWorkspaceAndId\s*\(/.test(marker)) {
  throw new Error('FORBIDDEN_UPDATE_BY_WORKSPACE_AND_ID_CALL');
}
if (/\bsupabaseRequest\s*\(/.test(marker)) {
  throw new Error('FORBIDDEN_SUPABASE_REQUEST_CALL');
}

const markerImports = marker.match(/^import\s[\s\S]*?;\s*$/gm) || [];
if (markerImports.length !== 3) {
  throw new Error(`G9_IMPORT_COUNT_MISMATCH: ${markerImports.length}`);
}

for (const route of [taskRoute, eventRoute]) {
  mustNot(
    route,
    'google-calendar-mutation-sync-state-marker',
    'G9_ROUTE_IMPORT_FORBIDDEN',
  );
  mustNot(
    route,
    'markGoogleCalendarMutationSyncState',
    'G9_ROUTE_CALL_FORBIDDEN',
  );
  mustNot(
    route,
    'decideGoogleCalendarMutationSyncState',
    'G7_FACADE_ROUTE_CALL_FORBIDDEN',
  );
  mustNot(
    route,
    'google_calendar_sync_status',
    'ROUTE_SYNC_STATUS_WRITE_FORBIDDEN',
  );
}

const testCount = (testSource.match(/\btest\s*\(/g) || []).length;
if (testCount < 40) {
  throw new Error(`G9_TEST_COUNT_TOO_LOW: ${testCount}`);
}

must(testSource, "require('typescript')");
must(testSource, 'ts.transpileModule');
must(testSource, "const Module = require('node:module')");
must(testSource, '._compile(', 'Module._compile');
mustNot(
  testSource,
  'function markGoogleCalendarMutationSyncStateWithDependencies',
  'G9_TEST_DUPLICATE_MARKER_IMPLEMENTATION',
);

for (const text of [report, map]) {
  must(text, 'STAGE:');
  must(
    text,
    'LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT',
  );
  must(text, 'G8_PRECHECK_BEFORE_G9: PASS');
  must(text, 'G8_PRECHECK_TESTS: 26 PASS / 0 FAIL');
  must(text, 'MARKER_USES_G8_READER: YES');
  must(text, 'MARKER_USES_G7_FACADE: YES');
  must(text, 'MARKER_WRITE_IS_WORKSPACE_SCOPED: YES');
  must(text, 'MARKER_ALLOWED_STATUSES:');
  must(text, 'pending / pending_delete');
  must(text, 'MARKER_WRITES_ONLY_SYNC_STATUS: YES');
  must(text, 'WRITE_RESPONSE_CONFIRMED: YES');
  must(text, 'READ_ERROR_PROPAGATED: YES');
  must(text, 'WRITE_ERROR_PROPAGATED: YES');
  must(text, 'UNSCOPED_FALLBACK: NO');
  must(text, 'TASK_ROUTE_WIRED_TO_G9: NO');
  must(text, 'EVENT_ROUTE_WIRED_TO_G9: NO');
  must(text, 'GOOGLE_REMOTE_CALL_CHANGED: NO');
  must(text, 'PRODUCTION_RUNTIME_BEHAVIOR_CHANGED: NO');
  must(text, 'G10_CREATED: NO');
}

must(router, '<!-- LF-PROD-SOT-G9 START -->');
must(router, '<!-- LF-PROD-SOT-G9 END -->');
must(
  router,
  'LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT',
);
must(
  router,
  'LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT_MAP.md',
);

assertG10Absent();

console.log(
  'G9_FINAL_STATUS: PASS_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT',
);
console.log(`APP_INPUT_HEAD_G9: ${APP_INPUT_HEAD_G9}`);
console.log(`OBSIDIAN_INPUT_HEAD_G9: ${OBSIDIAN_INPUT_HEAD_G9}`);
console.log(`G9_TEST_COUNT_DISCOVERED: ${testCount}`);
console.log('MARKER_USES_G8_READER: YES');
console.log('MARKER_USES_G7_FACADE: YES');
console.log('SCOPED_STATUS_WRITE: PASS');
console.log('WRITE_RESPONSE_CONFIRMATION: PASS');
console.log('UNSCOPED_FALLBACK: NO');
console.log('TASK_ROUTE_WIRED_TO_G9: NO');
console.log('EVENT_ROUTE_WIRED_TO_G9: NO');
console.log('PRODUCTION_RUNTIME_BEHAVIOR_CHANGED: NO');
console.log('G10_CREATED: NO');
console.log('PASS_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT');
