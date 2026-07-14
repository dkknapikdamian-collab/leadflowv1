const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const APP_INPUT_HEAD = '1212a3b64f5a306621c510b800936e9a12580800';
const OBSIDIAN_INPUT_BASELINE = process.env.G15_R1_OBSIDIAN_INPUT_HEAD || '';
const STAGE = 'LF-PROD-SOT-G15-R1_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT';
const NEXT_STAGE = 'LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION';
const PASS_TOKEN = 'PASS_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT';
const PROJECT_ROOT = '10_PROJEKTY/CloseFlow_Lead_App';
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs && node --test tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs';

if (!/^[0-9a-f]{40}$/i.test(OBSIDIAN_INPUT_BASELINE)) {
  throw new Error('G15_R1_OBSIDIAN_INPUT_HEAD_REQUIRED');
}

const rel = {
  package: 'package.json',
  guard: 'scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs',
  test: 'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',
  appReport: `_project/runs/${STAGE}.md`,
  contract: `${PROJECT_ROOT}/STAGES/${STAGE}.md`,
  obsReport: `${PROJECT_ROOT}/90_RAPORTY/${STAGE}_REPORT.md`,
  current: `${PROJECT_ROOT}/02_AKTUALNY_STAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  decisions: `${PROJECT_ROOT}/03_AKTYWNE_DECYZJE - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  queue: `${PROJECT_ROOT}/04_KIERUNEK_DO_WDROZENIA.md`,
  history: `${PROJECT_ROOT}/08_HISTORIA_ZMIAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  testsLedger: `${PROJECT_ROOT}/09_TESTY_DO_WYKONANIA_I_WYNIKI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  delivery: `${PROJECT_ROOT}/10_ZIPY_WDROZENIA_PUSH - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  risks: `${PROJECT_ROOT}/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  stageIndex: `${PROJECT_ROOT}/STAGES/README.md`,
  task: 'src/server/task-route-stage124f.ts',
  event: 'src/server/event-route-stage124f.ts',
  requestScope: 'src/server/_request-scope.ts',
  snapshot: 'src/server/google-calendar-mutation-snapshot.ts',
  marker: 'src/server/google-calendar-mutation-sync-state-marker.ts',
  outbound: 'src/server/google-calendar-outbound.ts',
  inbound: 'src/server/google-calendar-inbound.ts',
  supabase: 'src/server/_supabase.ts',
  g14Guard: 'scripts/guards/verify-lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
  g15Guard: 'scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs',
};

const allowedApp = new Set([
  'package.json',
  'scripts/guards/verify-lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
  'scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs',
  rel.guard,
  rel.test,
  rel.appReport,
]);

const allowedVault = new Set([
  rel.contract,
  rel.obsReport,
  rel.current,
  rel.decisions,
  rel.queue,
  rel.history,
  rel.testsLedger,
  rel.delivery,
  rel.risks,
  rel.stageIndex,
]);

function sh(cwd, args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function read(base, file) {
  const full = path.join(base, file);
  if (!fs.existsSync(full)) throw new Error(`MISSING_REQUIRED_FILE:${file}`);
  return fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
}

function lines(value) {
  return String(value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function changedFiles(repo, inputHead, scopePrefix = '') {
  const files = new Set();
  for (const args of [
    ['diff', '--name-only', `${inputHead}..HEAD`],
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
  ]) {
    for (const file of lines(sh(repo, args))) {
      const normalized = file.replaceAll('\\', '/');
      if (!scopePrefix || normalized === scopePrefix || normalized.startsWith(`${scopePrefix}/`)) files.add(normalized);
    }
  }
  const status = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], {
    cwd: repo,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  for (const raw of String(status || '').split(/\r?\n/).filter(Boolean)) {
    let file = raw.slice(3).trim().replace(/^"|"$/g, '');
    if (file.includes(' -> ')) file = file.split(' -> ').at(-1);
    file = file.replaceAll('\\', '/');
    if (!scopePrefix || file === scopePrefix || file.startsWith(`${scopePrefix}/`)) files.add(file);
  }
  return [...files];
}

function assertAllowed(files, allowed, label) {
  for (const file of files) {
    if (file.startsWith('src/')) throw new Error(`${label}_SRC_CHANGE:${file}`);
    if (!allowed.has(file)) throw new Error(`${label}_OUT_OF_SCOPE:${file}`);
  }
}

function assertAncestor(repo, commit, label) {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', commit, 'HEAD'], {
    cwd: repo,
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`${label}_NOT_ANCESTOR`);
}

function must(text, token, label = token) {
  if (!text.includes(token)) throw new Error(`MISSING_TOKEN:${label}`);
}

function mustNot(text, token, label = token) {
  if (text.includes(token)) throw new Error(`FORBIDDEN_TOKEN:${label}`);
}

function section(text, start, end) {
  const a = text.indexOf(start);
  const b = text.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`MISSING_SECTION:${start}`);
  return text.slice(a, b);
}

function assertNoFutureArtifact() {
  const roots = [
    [root, '_project/runs'],
    [root, 'scripts/guards'],
    [root, 'tests'],
    [vault, `${PROJECT_ROOT}/STAGES`],
    [vault, `${PROJECT_ROOT}/90_RAPORTY`],
  ];
  for (const [base, relDir] of roots) {
    const dir = path.join(base, relDir);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (/LF-PROD-SOT-G15-R2_|lf-prod-sot-g15-r2_|LF-PROD-SOT-G16_|lf-prod-sot-g16_/i.test(entry.name)) {
        throw new Error(`FUTURE_ARTIFACT_CREATED:${path.join(relDir, entry.name)}`);
      }
    }
  }
}

if (sh(root, ['branch', '--show-current']) !== 'dev-rollout-freeze') throw new Error('WRONG_APP_BRANCH');
if (!fs.existsSync(path.join(vault, '.git'))) throw new Error('MISSING_OBSIDIAN_REPO');
if (sh(vault, ['branch', '--show-current']) !== 'main') throw new Error('WRONG_OBSIDIAN_BRANCH');
assertAncestor(root, APP_INPUT_HEAD, 'APP_INPUT_HEAD');
assertAncestor(vault, OBSIDIAN_INPUT_BASELINE, 'OBSIDIAN_INPUT_BASELINE');
assertAllowed(changedFiles(root, APP_INPUT_HEAD), allowedApp, 'APP');
assertAllowed(changedFiles(vault, OBSIDIAN_INPUT_BASELINE, PROJECT_ROOT), allowedVault, 'OBSIDIAN');

const pkg = JSON.parse(read(root, rel.package));
if (pkg.scripts?.['verify:lf-prod-sot-g15-r1'] !== exactAlias) throw new Error('PACKAGE_ALIAS_MISMATCH');

const appReport = read(root, rel.appReport);
const contract = read(vault, rel.contract);
const obsReport = read(vault, rel.obsReport);
const current = read(vault, rel.current);
const decisions = read(vault, rel.decisions);
const queue = read(vault, rel.queue);
const history = read(vault, rel.history);
const testsLedger = read(vault, rel.testsLedger);
const delivery = read(vault, rel.delivery);
const risks = read(vault, rel.risks);
const stageIndex = read(vault, rel.stageIndex);
const task = read(root, rel.task);
const event = read(root, rel.event);
const requestScope = read(root, rel.requestScope);
const snapshot = read(root, rel.snapshot);
const marker = read(root, rel.marker);
const outbound = read(root, rel.outbound);
const inbound = read(root, rel.inbound);
const supabase = read(root, rel.supabase);
const g14Guard = read(root, rel.g14Guard);
const g15Guard = read(root, rel.g15Guard);

for (const [label, text] of [
  ['app report', appReport],
  ['stage contract', contract],
  ['execution report', obsReport],
]) {
  must(text, PASS_TOKEN, `${label} status`);
  must(text, 'VERIFIED_SUPABASE_USER_ID_ONLY', `${label} owner source`);
  must(text, 'LEGACY_WORKSPACE_NULL_OWNER_MATCH', `${label} legacy owner match`);
  must(text, 'FAIL_CLOSED_403_UNCHANGED', `${label} legacy fail closed`);
  must(text, 'LEGACY_WORKSPACE_CLAIM_ALLOWED', `${label} no claim`);
  must(text, 'LEGACY_REMOTE_DELETE_ALLOWED', `${label} no remote`);
  must(text, NEXT_STAGE, `${label} next stage`);
  must(text, 'G16_ARTIFACT_CREATED:', `${label} no G16`);
  must(text, 'NO', `${label} no token`);
}

must(contract, 'typ: kontrakt_etapu');
must(contract, 'project_id: closeflow_lead_app');
must(contract, '## FAKT');
must(contract, '## DECYZJA');
must(contract, '## HIPOTEZA');
must(contract, '## DO POTWIERDZENIA');
must(contract, 'EXACT_WORKSPACE_OWNER_MISSING:');
must(contract, 'LOCAL_TOMBSTONE_ONLY_NO_REMOTE_DELETE');
must(contract, 'EXACT_WORKSPACE_OWNER_MISMATCH:');
must(contract, 'NON_NULL_WORKSPACE_MISMATCH:');
must(contract, 'FAIL_CLOSED_409_UNCHANGED');
must(contract, 'LEGACY_WORKSPACE_NULL_OWNER_MISSING:');
must(contract, 'LEGACY_WORKSPACE_NULL_OWNER_MISMATCH:');
must(contract, 'LEGACY_PENDING_DELETE_ALLOWED:');
must(contract, 'IMPORTED_GOOGLE_EVENT_REMOTE_DELETE:');
must(contract, 'The 403 response for owner missing and owner mismatch is intentionally identical');
must(contract, 'TASK_DELETE_RUNTIME:');
must(contract, 'EVENT_DELETE_RUNTIME:');
must(contract, 'NOT_AUTHORIZED');

for (const [label, text] of [
  ['current', current],
  ['decisions', decisions],
  ['queue', queue],
  ['history', history],
  ['tests ledger', testsLedger],
  ['delivery', delivery],
  ['risks', risks],
  ['stage index', stageIndex],
]) {
  must(text, STAGE, `${label} stage routing`);
  must(text, NEXT_STAGE, `${label} next routing`);
}
must(stageIndex, `[[${STAGE}]]`, 'stage index link');
must(testsLedger, 'G15_R1_TESTS:');
must(testsLedger, '24 PASS / 0 FAIL');
must(delivery, 'docs(closeflow): decide G15-R1 legacy owner evidence');
must(risks, 'LEGACY_NULL_OWNER_EVIDENCE_RUNTIME_NOT_WIRED');

const taskDelete = section(task, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const eventDelete = section(event, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
for (const [name, text] of [['task', taskDelete], ['event', eventDelete]]) {
  must(text, 'withWorkspaceFilter(selectPathStage228R23, workspaceId)', `${name} exact workspace read`);
  must(text, 'selectFirstAvailable([selectPathStage228R23])', `${name} id-only fallback`);
  must(text, "updateById('work_items', id, payloadStage228R23)", `${name} legacy unscoped write`);
  mustNot(text, 'created_by_user_id', `${name} owner evidence absent`);
  mustNot(text, 'markGoogleCalendarMutationSyncState({', `${name} G9 unwired`);
}
must(requestScope, 'const context = await requireSupabaseRequestContext(req)');
must(requestScope, 'userId: asText(context.userId) || null');
must(requestScope, "throw new RequestAuthError(401, 'REQUEST_IDENTITY_REQUIRED')");
must(snapshot, "+ '&workspace_id=eq.'");
must(marker, 'updateByIdScoped');
mustNot(marker, 'updateById(', 'marker unscoped writer');
must(outbound, "'work_items?workspace_id=eq.'");
must(inbound, 'isLocalDeletedGoogleCalendarWorkItemStage232GR6');
must(supabase, 'export async function updateById(');
must(supabase, 'export async function updateByIdScoped(');

must(g14Guard, rel.appReport, 'G14 exact R1 app report allowlist');
must(g14Guard, rel.guard, 'G14 exact R1 guard allowlist');
must(g14Guard, rel.test, 'G14 exact R1 test allowlist');
must(g15Guard, rel.appReport, 'G15 exact R1 app report allowlist');
must(g15Guard, rel.guard, 'G15 exact R1 guard allowlist');
must(g15Guard, rel.test, 'G15 exact R1 test allowlist');
must(g15Guard, rel.contract, 'G15 exact R1 contract allowlist');
must(g15Guard, rel.obsReport, 'G15 exact R1 report allowlist');
must(g15Guard, 'LF-PROD-SOT-G15-R2_', 'G15 R2 future block');
must(g15Guard, 'LF-PROD-SOT-G16_', 'G15 G16 future block');

assertNoFutureArtifact();

console.log('G15_R1_GUARD: PASS');
console.log('G15_R1_OWNER_EVIDENCE: VERIFIED_SUPABASE_USER_ID_ONLY');
console.log('G15_R1_LEGACY_OWNER_MATCH: LOCAL_TOMBSTONE_ONLY');
console.log('G15_R1_LEGACY_OWNER_MISSING: FAIL_CLOSED_403_UNCHANGED');
console.log('G15_R1_LEGACY_OWNER_MISMATCH: FAIL_CLOSED_403_UNCHANGED');
console.log('G15_R1_RUNTIME_CHANGED: NO');
console.log('G15_R1_NEXT_STAGE: ' + NEXT_STAGE);
console.log('G16_ARTIFACT_CREATED: NO');
