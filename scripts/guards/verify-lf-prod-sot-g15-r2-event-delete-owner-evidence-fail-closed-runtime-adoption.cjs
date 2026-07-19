const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const INPUT_HEAD = '6acc65b22f6fd467019da5973682aa03cc9cbe65';
const STAGE = 'LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION';
const PASS_TOKEN = 'PASS_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION';
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs && node --test tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs';

const rel = {
  event: 'src/server/event-route-stage124f.ts',
  task: 'src/server/task-route-stage124f.ts',
  package: 'package.json',
  guard: 'scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs',
  test: 'tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs',
  report: `_project/runs/${STAGE}.md`,
};

const allowed = new Set([
  rel.event,
  rel.package,
  rel.guard,
  rel.test,
  rel.report,
  'scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs',
  'tests/lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.test.cjs',
  'scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs',
  'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',
]);

function sh(args, options = {}) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', ...options }).trim();
}
function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`MISSING_REQUIRED_FILE:${file}`);
  return fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
}
function lines(value) {
  return String(value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}
function section(text, start, end) {
  const a = text.indexOf(start);
  const b = text.indexOf(end, a + start.length);
  if (a < 0 || b <= a) throw new Error(`MISSING_SECTION:${start}`);
  return text.slice(a, b);
}
function must(text, token, label = token) {
  if (!text.includes(token)) throw new Error(`MISSING_TOKEN:${label}`);
}
function mustNot(text, token, label = token) {
  if (text.includes(token)) throw new Error(`FORBIDDEN_TOKEN:${label}`);
}
function changedFiles() {
  const files = new Set();
  for (const args of [
    ['diff', '--name-only', `${INPUT_HEAD}..HEAD`],
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
  ]) {
    for (const file of lines(sh(args))) files.add(file.replaceAll('\\', '/'));
  }
  const status = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  });
  for (const raw of String(status || '').split(/\r?\n/).filter(Boolean)) {
    let file = raw.slice(3).trim().replace(/^"|"$/g, '');
    if (file.includes(' -> ')) file = file.split(' -> ').at(-1);
    files.add(file.replaceAll('\\', '/'));
  }
  return [...files];
}

if (sh(['branch', '--show-current']) !== 'dev-rollout-freeze') throw new Error('WRONG_BRANCH');
const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', INPUT_HEAD, 'HEAD'], { cwd: root });
if (ancestor.status !== 0) throw new Error('INPUT_HEAD_NOT_ANCESTOR');
for (const file of changedFiles()) {
  if (!allowed.has(file)) throw new Error(`OUT_OF_SCOPE:${file}`);
  if (/^(supabase\/|migrations\/|sql\/|src\/server\/task-route-stage124f\.ts$)/i.test(file)) {
    throw new Error(`FORBIDDEN_SCOPE:${file}`);
  }
}

const event = read(rel.event);
const task = read(rel.task);
const pkg = JSON.parse(read(rel.package));
const report = read(rel.report);
const eventDelete = section(event, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const taskDelete = section(task, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");

if (pkg.scripts?.['verify:lf-prod-sot-g15-r2'] !== exactAlias) throw new Error('PACKAGE_ALIAS_MISMATCH');

must(eventDelete, 'created_by_user_id', 'owner select');
must(eventDelete, 'verifiedRequestUserIdStageG15R2', 'verified user comparison');
must(eventDelete, "error: 'EVENT_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED'", 'identical legacy 403');
must(eventDelete, "error: 'EVENT_DELETE_WORKSPACE_MISMATCH'", 'workspace mismatch 409');
must(eventDelete, 'workspace_id=is.null&created_by_user_id=eq.', 'legacy race-safe filter');
must(eventDelete, 'await updateWhere(legacyOwnerScopedUpdatePathStageG15R2, payloadStage228R23)', 'legacy local writer');
must(eventDelete, "await updateByIdScoped('work_items', id, workspaceId, payloadStage228R23)", 'exact workspace writer');
must(eventDelete, 'alreadyMissing: true', 'idempotent missing');
mustNot(eventDelete, "updateById('work_items'", 'unscoped writer');
mustNot(eventDelete, 'pending_delete', 'legacy pending delete');
mustNot(eventDelete, 'markGoogleCalendarMutationSyncState({', 'route Google mutation marker');
mustNot(eventDelete, 'fetch(', 'route remote call');

must(taskDelete, "updateById('work_items', id, payloadStage228R23)", 'Task DELETE remains untouched');
mustNot(taskDelete, 'created_by_user_id', 'Task owner adoption not authorized');

must(report, PASS_TOKEN, 'report status');
must(report, 'TASK_DELETE_NOT_TOUCHED: YES');
must(report, 'SQL_NOT_TOUCHED: YES');
must(report, 'REMOTE_GOOGLE_NOT_CALLED: YES');

console.log('G15_R2_GUARD: PASS');
console.log('G15_R2_OWNER_EVIDENCE: VERIFIED_SUPABASE_USER_ID_ONLY');
console.log('G15_R2_LEGACY_OWNER_MATCH: LOCAL_TOMBSTONE_ONLY');
console.log('G15_R2_LEGACY_OWNER_MISSING_OR_MISMATCH: FAIL_CLOSED_403_UNCHANGED');
console.log('G15_R2_WORKSPACE_MISMATCH: 409_UNCHANGED');
console.log('G15_R2_TASK_DELETE_NOT_TOUCHED: YES');
console.log('G15_R2_SQL_NOT_TOUCHED: YES');
console.log('G15_R2_REMOTE_GOOGLE_NOT_CALLED: YES');
