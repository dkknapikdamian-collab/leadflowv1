const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const APP_INPUT_HEAD = 'ca7a1f0924f7e0d7995cc2cf52a6927c13f758e1';
const OBSIDIAN_BASE_ANCESTOR = '266cc8418f5b687c74f750d9af2221c055599e0d';
const NEXT_STAGE = 'LF-PROD-SOT-G15-R1_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT';
const PASS_TOKEN = 'PASS_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP';
const PROJECT_ROOT = '10_PROJEKTY/CloseFlow_Lead_App';
const exactAlias = "node scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs && node --test tests/lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.test.cjs";

const rel = {
  "package": "package.json",
  "guard": "scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs",
  "test": "tests/lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.test.cjs",
  "appReport": "_project/runs/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP.md",
  "contract": "10_PROJEKTY/CloseFlow_Lead_App/STAGES/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP.md",
  "obsReport": "10_PROJEKTY/CloseFlow_Lead_App/90_RAPORTY/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP_REPORT.md",
  "current": "10_PROJEKTY/CloseFlow_Lead_App/02_AKTUALNY_STAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "decisions": "10_PROJEKTY/CloseFlow_Lead_App/03_AKTYWNE_DECYZJE - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "queue": "10_PROJEKTY/CloseFlow_Lead_App/04_KIERUNEK_DO_WDROZENIA.md",
  "stageRegistry": "10_PROJEKTY/CloseFlow_Lead_App/04_ETAPY_ROZWOJU_APLIKACJI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "history": "10_PROJEKTY/CloseFlow_Lead_App/08_HISTORIA_ZMIAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "testsLedger": "10_PROJEKTY/CloseFlow_Lead_App/09_TESTY_DO_WYKONANIA_I_WYNIKI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "delivery": "10_PROJEKTY/CloseFlow_Lead_App/10_ZIPY_WDROZENIA_PUSH - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "risks": "10_PROJEKTY/CloseFlow_Lead_App/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "stageIndex": "10_PROJEKTY/CloseFlow_Lead_App/STAGES/README.md",
  "task": "src/server/task-route-stage124f.ts",
  "event": "src/server/event-route-stage124f.ts",
  "decision": "src/lib/google-calendar-mutation-sync-state-decision.ts",
  "snapshot": "src/server/google-calendar-mutation-snapshot.ts",
  "marker": "src/server/google-calendar-mutation-sync-state-marker.ts",
  "outbound": "src/server/google-calendar-outbound.ts",
  "inbound": "src/server/google-calendar-inbound.ts",
  "supabase": "src/server/_supabase.ts"
};
const allowedApp = new Set([
  "_project/runs/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP.md",
  "scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs",
  "tests/lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.test.cjs",
  "package.json"
]);
const allowedVault = new Set([
  "10_PROJEKTY/CloseFlow_Lead_App/02_AKTUALNY_STAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "10_PROJEKTY/CloseFlow_Lead_App/03_AKTYWNE_DECYZJE - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "10_PROJEKTY/CloseFlow_Lead_App/04_KIERUNEK_DO_WDROZENIA.md",
  "10_PROJEKTY/CloseFlow_Lead_App/04_ETAPY_ROZWOJU_APLIKACJI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "10_PROJEKTY/CloseFlow_Lead_App/08_HISTORIA_ZMIAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "10_PROJEKTY/CloseFlow_Lead_App/09_TESTY_DO_WYKONANIA_I_WYNIKI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "10_PROJEKTY/CloseFlow_Lead_App/10_ZIPY_WDROZENIA_PUSH - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "10_PROJEKTY/CloseFlow_Lead_App/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - DO_POTWIERDZENIA - CloseFlow LeadFlow.md",
  "10_PROJEKTY/CloseFlow_Lead_App/STAGES/README.md",
  "10_PROJEKTY/CloseFlow_Lead_App/STAGES/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP.md",
  "10_PROJEKTY/CloseFlow_Lead_App/90_RAPORTY/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP_REPORT.md"
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

function listLines(value) {
  return String(value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function changedFiles(repo, inputHead, scopePrefix = '') {
  const files = new Set();
  for (const args of [
    ['diff', '--name-only', `${inputHead}..HEAD`],
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
  ]) {
    for (const file of listLines(sh(repo, args))) {
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
      if (/LF-PROD-SOT-G15-R1_|lf-prod-sot-g15-r1_|LF-PROD-SOT-G16_|lf-prod-sot-g16_/i.test(entry.name)) {
        throw new Error(`FUTURE_ARTIFACT_CREATED:${path.join(relDir, entry.name)}`);
      }
    }
  }
}

if (sh(root, ['branch', '--show-current']) !== 'dev-rollout-freeze') throw new Error('WRONG_APP_BRANCH');
if (!fs.existsSync(path.join(vault, '.git'))) throw new Error('MISSING_OBSIDIAN_REPO');
if (sh(vault, ['branch', '--show-current']) !== 'main') throw new Error('WRONG_OBSIDIAN_BRANCH');
assertAncestor(root, APP_INPUT_HEAD, 'APP_INPUT_HEAD');
assertAncestor(vault, OBSIDIAN_BASE_ANCESTOR, 'OBSIDIAN_BASE_ANCESTOR');
assertAllowed(changedFiles(root, APP_INPUT_HEAD), allowedApp, 'APP');
assertAllowed(changedFiles(vault, OBSIDIAN_BASE_ANCESTOR, PROJECT_ROOT), allowedVault, 'OBSIDIAN');

const pkg = JSON.parse(read(root, rel.package));
if (pkg.scripts?.['verify:lf-prod-sot-g15'] !== exactAlias) throw new Error('PACKAGE_ALIAS_MISMATCH');

const appReport = read(root, rel.appReport);
const contract = read(vault, rel.contract);
const obsReport = read(vault, rel.obsReport);
const current = read(vault, rel.current);
const decisions = read(vault, rel.decisions);
const queue = read(vault, rel.queue);
const stageIndex = read(vault, rel.stageIndex);
const testsLedger = read(vault, rel.testsLedger);
const delivery = read(vault, rel.delivery);
const risks = read(vault, rel.risks);
const task = read(root, rel.task);
const event = read(root, rel.event);
const decision = read(root, rel.decision);
const snapshot = read(root, rel.snapshot);
const marker = read(root, rel.marker);
const outbound = read(root, rel.outbound);
const inbound = read(root, rel.inbound);
const supabase = read(root, rel.supabase);

for (const [label, text] of [
  ['app report', appReport],
  ['stage contract', contract],
  ['execution report', obsReport],
]) {
  must(text, PASS_TOKEN, label + ' status');
  must(text, 'LEGACY_LOCAL_TOMBSTONE_ONLY', label + ' legacy policy');
  must(text, 'USE_EXISTING_CANONICAL', label + ' entity resolution');
  must(text, NEXT_STAGE, label + ' next stage');
}
must(contract, 'typ: kontrakt_etapu');
must(contract, 'project_id: closeflow_lead_app');
must(contract, '## FAKT');
must(contract, '## DECYZJA');
must(contract, '## HIPOTEZA');
must(contract, '## DO POTWIERDZENIA');
must(contract, '17 | inbound misses legacy workspace-null tombstone');
must(contract, 'FIRST_RUNTIME_DELETE_CONSUMER:');
must(contract, 'NOT_AUTHORIZED');
must(obsReport, 'typ: raport_ai');
must(obsReport, '## DOWÓD SKANU');
must(current, NEXT_STAGE);
must(decisions, NEXT_STAGE);
must(queue, NEXT_STAGE);
must(stageIndex, `[[${path.basename(rel.contract, '.md')}]]`, 'relative canonical stage link');
must(testsLedger, 'G15_TESTS:');
must(delivery, 'docs(closeflow): map G15 delete contract');
must(risks, 'WORKSPACE_NULL_OWNER_EVIDENCE_MISSING');

const taskDelete = section(task, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const eventDelete = section(event, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
for (const [name, text] of [['task', taskDelete], ['event', eventDelete]]) {
  must(text, 'withWorkspaceFilter(selectPathStage228R23, workspaceId)', `${name} scoped read`);
  must(text, 'selectFirstAvailable([selectPathStage228R23])', `${name} unscoped fallback`);
  must(text, "status: 'deleted'", `${name} soft delete`);
  must(text, 'show_in_tasks: false', `${name} hidden tasks`);
  must(text, 'show_in_calendar: false', `${name} hidden calendar`);
  mustNot(text, 'markGoogleCalendarMutationSyncState({', `${name} G9 wiring`);
}
must(taskDelete, 'TASK_DELETE_WORKSPACE_MISMATCH');
must(eventDelete, 'EVENT_DELETE_WORKSPACE_MISMATCH');
must(decision, "nextSyncStatus: 'pending_delete'");
must(decision, "return noWrite('unchanged')");
must(decision, "return noWrite('skip_imported')");
must(snapshot, "+ '&workspace_id=eq.'");
must(marker, 'updateByIdScoped');
mustNot(marker, 'updateById(', 'marker unscoped writer');
must(outbound, "'work_items?workspace_id=eq.'");
must(outbound, 'if (!personalScope.matched)');
must(outbound, '/\\b(404|410)\\b|not\\s*found|gone/i');
must(outbound, "google_calendar_sync_status: 'failed'");
must(outbound, "googleSyncStatusFrom(row) === 'pending_delete'");
must(inbound, 'isLocalDeletedGoogleCalendarWorkItemStage232GR6');
must(inbound, "action: 'skipped_local_deleted'");
must(supabase, 'export async function updateById(');
must(supabase, 'export async function updateByIdScoped(');
assertNoFutureArtifact();

console.log('G15_GUARD: PASS');
console.log('G15_OBSIDIAN_ROUTING: CANONICAL_STAGES_AND_02_03_04_09_10_11_90');
console.log('G15_ENTITY_RESOLUTION: USE_EXISTING_CANONICAL');
console.log('G15_POLICY: LEGACY_LOCAL_TOMBSTONE_ONLY');
console.log('G15_SECURITY_BLOCKER: WORKSPACE_NULL_OWNER_EVIDENCE_MISSING');
console.log('G15_RUNTIME_CHANGED: NO');
console.log('G15_SQL_CHANGED: NO');
console.log('G15_REMOTE_GOOGLE_CALL_CHANGED: NO');
console.log('G15_NEXT_STAGE: ' + NEXT_STAGE);
console.log('G16_ARTIFACT_CREATED: NO');
