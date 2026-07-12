const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { TextDecoder } = require('node:util');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const APP_INPUT_HEAD_G11 = process.env.G11_APP_INPUT_HEAD || '1036e10e6c2ca734d9a9b61c9eaa1315fcef1ad9';
const OBSIDIAN_INPUT_HEAD_G11 = process.env.G11_OBSIDIAN_INPUT_HEAD || '04042c0a2222c6f6d88d9c62f7fc1d2b4becd178';
const REQUIRED_G10_OBSIDIAN_ANCESTOR = process.env.G11_REQUIRED_G10_ANCESTOR || '2b9f4dad19a4ce9bafca1b6475db8d07e33c3170';
const OBSIDIAN_SCOPE = '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY';
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g11-event-patch-gcal-mutation-scoped-sync-state-marker-runtime-adoption.cjs && tsc --noEmit -p tsconfig.g11.json && node --test tests/lf-prod-sot-g11-event-patch-gcal-mutation-scoped-sync-state-marker-runtime-adoption.test.cjs';

const rel = {
  package: 'package.json',
  tsconfig: 'tsconfig.g11.json',
  taskRoute: 'src/server/task-route-stage124f.ts',
  eventRoute: 'src/server/event-route-stage124f.ts',
  marker: 'src/server/google-calendar-mutation-sync-state-marker.ts',
  snapshot: 'src/server/google-calendar-mutation-snapshot.ts',
  facade: 'src/lib/google-calendar-mutation-sync-state-decision.ts',
  outbound: 'src/server/google-calendar-outbound.ts',
  inbound: 'src/server/google-calendar-inbound.ts',
  supabase: 'src/server/_supabase.ts',
  requestScope: 'src/server/_request-scope.ts',
  dataContract: 'src/lib/data-contract.ts',
  timezone: 'src/lib/calendar-timezone-contract.ts',
  g10Guard: 'scripts/guards/verify-lf-prod-sot-g10-task-patch-gcal-mutation-scoped-sync-state-marker-runtime-adoption.cjs',
  g10Test: 'tests/lf-prod-sot-g10-task-patch-gcal-mutation-scoped-sync-state-marker-runtime-adoption.test.cjs',
  g10Report: '_project/runs/LF-PROD-SOT-G10_TASK_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION.md',
  g10Tsconfig: 'tsconfig.g10.json',
  guard: 'scripts/guards/verify-lf-prod-sot-g11-event-patch-gcal-mutation-scoped-sync-state-marker-runtime-adoption.cjs',
  test: 'tests/lf-prod-sot-g11-event-patch-gcal-mutation-scoped-sync-state-marker-runtime-adoption.test.cjs',
  report: '_project/runs/LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION.md',
  router: `${OBSIDIAN_SCOPE}/00_MAPY_I_ZALEZNOSCI_SOT.md`,
  map: `${OBSIDIAN_SCOPE}/LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION_MAP.md`,
};

const allowedApp = new Set([
  rel.eventRoute,
  rel.guard,
  rel.test,
  rel.report,
  rel.tsconfig,
  rel.package,
]);
const allowedVault = new Set([rel.router, rel.map]);
const protectedApp = [
  rel.taskRoute,
  rel.marker,
  rel.snapshot,
  rel.facade,
  rel.outbound,
  rel.inbound,
  rel.supabase,
  rel.requestScope,
  rel.dataContract,
  rel.timezone,
  rel.g10Guard,
  rel.g10Test,
  rel.g10Report,
  rel.g10Tsconfig,
  'tsconfig.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
];

const exactImport = "import { markGoogleCalendarMutationSyncState } from './google-calendar-mutation-sync-state-marker.js';";
const exactBlock = `      const googleCalendarSyncStateStageG11 =
        await markGoogleCalendarMutationSyncState({
          workItemId: String(body.id),
          workspaceId,
          mutationKind: 'update',
        });

      if (googleCalendarSyncStateStageG11.found === false) {
        throw new Error(
          'EVENT_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND',
        );
      }
`;

function sh(cwd, args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function normalize(value) {
  return String(value || '').replace(/\r\n/g, '\n');
}

function readUtf8(base, file) {
  const full = path.join(base, file);
  if (!fs.existsSync(full)) throw new Error(`MISSING_REQUIRED_FILE: ${file}`);
  const bytes = fs.readFileSync(full);
  try {
    return normalize(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
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

function count(text, pattern) {
  return (text.match(pattern) || []).length;
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
  if (!/^[0-9a-f]{40}$/i.test(sha)) throw new Error(`${label}_INVALID_SHA: ${sha}`);
  const result = spawnSync('git', ['merge-base', '--is-ancestor', sha, 'HEAD'], { cwd: repo });
  if (result.status !== 0) throw new Error(`${label}_NOT_ANCESTOR_OF_HEAD`);
}

function assertUnchanged(file) {
  const existsAtBase = spawnSync('git', ['cat-file', '-e', `${APP_INPUT_HEAD_G11}:${file}`], { cwd: root }).status === 0;
  const existsNow = fs.existsSync(path.join(root, file));
  if (!existsAtBase && !existsNow) return;
  if (existsAtBase !== existsNow) throw new Error(`G11_PROTECTED_FILE_EXISTENCE_CHANGED: ${file}`);
  const result = spawnSync('git', ['diff', '--quiet', APP_INPUT_HEAD_G11, '--', file], { cwd: root });
  if (result.status !== 0) throw new Error(`G11_PROTECTED_FILE_CHANGED: ${file}`);
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

function assertG12Absent() {
  for (const [base, relative] of [
    [root, '_project/runs'],
    [root, 'scripts/guards'],
    [root, 'tests'],
    [vault, OBSIDIAN_SCOPE],
  ]) {
    for (const file of walk(path.join(base, relative))) {
      if (/LF-PROD-SOT-G12[_-]|lf-prod-sot-g12[_-]/i.test(file)) {
        throw new Error(`G12_CREATED_FORBIDDEN: ${path.join(relative, file)}`);
      }
    }
  }
  const pkg = JSON.parse(readUtf8(root, rel.package));
  if (pkg.scripts?.['verify:lf-prod-sot-g12']) throw new Error('G12_PACKAGE_ALIAS_FORBIDDEN');
}

const appBranch = sh(root, ['branch', '--show-current']);
if (appBranch !== 'dev-rollout-freeze') throw new Error(`STOP_BRANCH_MISMATCH: ${appBranch}`);
if (!fs.existsSync(path.join(vault, '.git'))) throw new Error(`STOP_MISSING_OBSIDIAN_REPO: ${vault}`);
const vaultBranch = sh(vault, ['branch', '--show-current']);
if (vaultBranch !== 'main') throw new Error(`STOP_OBSIDIAN_BRANCH_MISMATCH: ${vaultBranch}`);

assertAncestor(root, APP_INPUT_HEAD_G11, 'APP_INPUT_HEAD_G11');
assertAncestor(vault, OBSIDIAN_INPUT_HEAD_G11, 'OBSIDIAN_INPUT_HEAD_G11');
assertAncestor(vault, REQUIRED_G10_OBSIDIAN_ANCESTOR, 'REQUIRED_G10_OBSIDIAN_ANCESTOR');
assertAllowed(changedFiles(root, APP_INPUT_HEAD_G11), allowedApp, 'STOP_G11_FORBIDDEN_APP_CHANGE');
assertAllowed(changedFiles(vault, OBSIDIAN_INPUT_HEAD_G11, OBSIDIAN_SCOPE), allowedVault, 'STOP_G11_FORBIDDEN_OBSIDIAN_CHANGE');
for (const file of protectedApp) assertUnchanged(file);

const eventRoute = readUtf8(root, rel.eventRoute);
const taskRoute = readUtf8(root, rel.taskRoute);
const testSource = readUtf8(root, rel.test);
const report = readUtf8(root, rel.report);
const router = readUtf8(vault, rel.router);
const map = readUtf8(vault, rel.map);

if (count(eventRoute, /import \{ markGoogleCalendarMutationSyncState \} from '\.\/google-calendar-mutation-sync-state-marker\.js';/g) !== 1) {
  throw new Error('G11_MARKER_IMPORT_COUNT_MISMATCH');
}
if (count(eventRoute, /\bmarkGoogleCalendarMutationSyncState\s*\(/g) !== 1) {
  throw new Error('G11_MARKER_CALL_COUNT_MISMATCH');
}

const patchStart = eventRoute.indexOf("if (req.method === 'PATCH')");
const deleteStart = eventRoute.indexOf("if (req.method === 'DELETE')");
if (patchStart < 0 || deleteStart < 0 || deleteStart <= patchStart) throw new Error('G11_PATCH_BOUNDARY_NOT_FOUND');
const patchSegment = eventRoute.slice(patchStart, deleteStart);
const outsidePatch = eventRoute.slice(0, patchStart) + eventRoute.slice(deleteStart);

must(patchSegment, "const data = await updateByIdScoped('work_items', String(body.id), workspaceId, payload);");
must(patchSegment, 'if (body.leadId) {');
must(patchSegment, 'await syncLeadNextAction');
must(patchSegment, exactBlock.trimEnd(), 'exact G11 marker block');
must(patchSegment, 'res.status(200).json(normalizeEvent(updated as Record<string, unknown>));');
mustNot(outsidePatch, 'markGoogleCalendarMutationSyncState(', 'G11 call outside event PATCH');

const mainWriteIndex = patchSegment.indexOf("const data = await updateByIdScoped('work_items'");
const leadSyncIndex = patchSegment.indexOf('await syncLeadNextAction');
const markerIndex = patchSegment.indexOf('await markGoogleCalendarMutationSyncState');
const responseIndex = patchSegment.indexOf('res.status(200).json');
if (!(mainWriteIndex < leadSyncIndex && leadSyncIndex < markerIndex && markerIndex < responseIndex)) {
  throw new Error('G11_CALL_ORDER_MISMATCH');
}

const markerToResponse = patchSegment.slice(markerIndex, responseIndex);
must(markerToResponse, 'workItemId: String(body.id)');
must(markerToResponse, 'workspaceId,');
must(markerToResponse, "mutationKind: 'update'");
must(markerToResponse, 'googleCalendarSyncStateStageG11.found === false');
must(markerToResponse, 'EVENT_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND');
mustNot(markerToResponse, '.catch(', 'local marker catch');
mustNot(markerToResponse, 'try {', 'local marker try');

for (const token of [
  'google_calendar_sync_status',
  'fetch(',
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'deleteGoogleCalendarEvent',
]) mustNot(eventRoute, token, `event route direct integration:${token}`);

if (count(taskRoute, /import \{ markGoogleCalendarMutationSyncState \} from '\.\/google-calendar-mutation-sync-state-marker\.js';/g) !== 1) {
  throw new Error('G10_TASK_MARKER_IMPORT_DRIFT');
}
if (count(taskRoute, /\bmarkGoogleCalendarMutationSyncState\s*\(/g) !== 1) {
  throw new Error('G10_TASK_MARKER_CALL_DRIFT');
}

const baseRoute = sh(root, ['show', `${APP_INPUT_HEAD_G11}:${rel.eventRoute}`]);
let strippedRoute = eventRoute;
if (!strippedRoute.includes(exactImport)) throw new Error('G11_IMPORT_STRIP_ANCHOR_MISSING');
strippedRoute = strippedRoute.replace(exactImport + '\n', '');
if (!strippedRoute.includes(exactBlock)) throw new Error('G11_BLOCK_STRIP_ANCHOR_MISSING');
strippedRoute = strippedRoute.replace(exactBlock, '');
if (normalize(strippedRoute).trimEnd() !== normalize(baseRoute).trimEnd()) {
  throw new Error('G11_EVENT_ROUTE_HAS_CHANGES_OUTSIDE_EXACT_IMPORT_AND_BLOCK');
}

const pkg = JSON.parse(readUtf8(root, rel.package));
const basePkg = JSON.parse(sh(root, ['show', `${APP_INPUT_HEAD_G11}:${rel.package}`]));
if (pkg.scripts?.['verify:lf-prod-sot-g11'] !== exactAlias) throw new Error('G11_PACKAGE_ALIAS_MISMATCH');
for (const alias of ['verify:lf-prod-sot-g7', 'verify:lf-prod-sot-g8', 'verify:lf-prod-sot-g9', 'verify:lf-prod-sot-g10']) {
  if (!pkg.scripts?.[alias]) throw new Error(`${alias.toUpperCase().replaceAll(':', '_')}_REMOVED`);
}
const pkgWithoutG11 = structuredClone(pkg);
delete pkgWithoutG11.scripts['verify:lf-prod-sot-g11'];
if (JSON.stringify(stable(pkgWithoutG11)) !== JSON.stringify(stable(basePkg))) {
  throw new Error('G11_PACKAGE_NON_ALIAS_CHANGE');
}

const tsconfig = JSON.parse(readUtf8(root, rel.tsconfig));
const exactInclude = [
  rel.eventRoute,
  rel.taskRoute,
  rel.marker,
  rel.snapshot,
  rel.facade,
  rel.supabase,
  rel.requestScope,
  rel.dataContract,
  rel.timezone,
];
const exactExclude = ['node_modules', 'dist', '_project', '_local_backups', 'backups', 'bisect', 'scripts', 'tools'];
if (tsconfig.extends !== './tsconfig.json') throw new Error('G11_TSCONFIG_EXTENDS_MISMATCH');
if (tsconfig.compilerOptions?.allowJs !== false || tsconfig.compilerOptions?.noEmit !== true) {
  throw new Error('G11_TSCONFIG_COMPILER_OPTIONS_MISMATCH');
}
if (JSON.stringify(tsconfig.include) !== JSON.stringify(exactInclude)) throw new Error('G11_TSCONFIG_SCOPE_MISMATCH');
if (JSON.stringify(tsconfig.exclude) !== JSON.stringify(exactExclude)) throw new Error('G11_TSCONFIG_EXCLUDE_MISMATCH');

const testCount = count(testSource, /^test\s*\(/gm);
if (testCount < 28) throw new Error(`G11_TEST_COUNT_TOO_LOW: ${testCount}`);
for (const token of [
  "require('typescript')",
  'ts.transpileModule',
  'eventRoutePath',
  'loadEventRoute',
  'EVENT_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND',
  'markGoogleCalendarMutationSyncState',
  'UNEXPECTED_TEST_DEPENDENCY_CALL',
  'git show',
]) must(testSource, token);
mustNot(testSource, 'function eventRouteStage124FHandler', 'G11_TEST_LOCAL_HANDLER_COPY_FORBIDDEN');
mustNot(testSource, 'function decideGoogleCalendarMutationSyncState', 'G11_TEST_LOCAL_G7_COPY_FORBIDDEN');
mustNot(testSource, 'function markGoogleCalendarMutationSyncStateWithDependencies', 'G11_TEST_LOCAL_G9_COPY_FORBIDDEN');

for (const text of [report, map]) {
  for (const token of [
    'LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION',
    'TASK_PATCH_WIRED: YES',
    'EVENT_PATCH_WIRED: YES',
    'TASK_POST_WIRED: NO',
    'TASK_DELETE_WIRED: NO',
    'EVENT_POST_WIRED: NO',
    'EVENT_DELETE_WIRED: NO',
    'EVENT_SCOPED_UPDATE -> EXISTING_LEAD_SIDE_EFFECT -> G9_MARKER -> HTTP_200',
    'SNAPSHOT_NOT_FOUND_IS_HARD_ERROR: YES',
    'SUCCESS_RESPONSE_SHAPE_CHANGED: NO',
    'GOOGLE_REMOTE_CALL_CHANGED: NO',
    'SQL_CHANGED: NO',
    'UI_CSS_CHANGED: NO',
    'G12_CREATED: NO',
  ]) must(text, token);
}

must(router, '<!-- LF-PROD-SOT-G11 START -->');
must(router, '<!-- LF-PROD-SOT-G11 END -->');
must(router, 'LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION');
must(router, rel.map);

for (const file of allowedApp) {
  const text = readUtf8(root, file);
  for (const token of ['\uFFFD', '\u00c3', '\u00c2', '\u00e2\u20ac', '\u0000']) mustNot(text, token, `mojibake:${file}:${token}`);
}
for (const file of allowedVault) {
  const text = readUtf8(vault, file);
  for (const token of ['\uFFFD', '\u0000']) mustNot(text, token, `invalid_text:${file}:${token}`);
}

assertG12Absent();

console.log('G11_FINAL_STATUS: PASS_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION');
console.log(`APP_INPUT_HEAD_G11: ${APP_INPUT_HEAD_G11}`);
console.log(`OBSIDIAN_INPUT_HEAD_G11: ${OBSIDIAN_INPUT_HEAD_G11}`);
console.log(`G11_TEST_COUNT_DISCOVERED: ${testCount}`);
console.log('TASK_PATCH_WIRED: YES');
console.log('EVENT_PATCH_MARKER_CALL_COUNT: 1');
console.log('EVENT_PATCH_WIRED: YES');
console.log('TASK_POST_WIRED: NO');
console.log('TASK_DELETE_WIRED: NO');
console.log('EVENT_POST_WIRED: NO');
console.log('EVENT_DELETE_WIRED: NO');
console.log('G12_CREATED: NO');
