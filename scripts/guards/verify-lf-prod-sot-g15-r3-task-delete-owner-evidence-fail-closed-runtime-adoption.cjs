const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const INPUT_HEAD = 'cec7f322d4256d914d08308a21c53c2f88ddebcb';
const STAGE = 'LF-PROD-SOT-G15-R3_TASK_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION';
const PASS_TOKEN = 'PASS_TASK_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION';
const rel = {
  task: 'src/server/task-route-stage124f.ts',
  event: 'src/server/event-route-stage124f.ts',
  guard: 'scripts/guards/verify-lf-prod-sot-g15-r3-task-delete-owner-evidence-fail-closed-runtime-adoption.cjs',
  test: 'tests/lf-prod-sot-g15-r3-task-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs',
  report: `_project/runs/${STAGE}.md`,
};

const allowed = new Set([rel.task, rel.guard, rel.test, rel.report]);

function sh(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
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

const branch = sh(['branch', '--show-current']);
if (!['dev-rollout-freeze', 'g15-r3-task-delete-owner-evidence'].includes(branch)) throw new Error('WRONG_BRANCH');
const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', INPUT_HEAD, 'HEAD'], { cwd: root });
if (ancestor.status !== 0) throw new Error('INPUT_HEAD_NOT_ANCESTOR');
for (const file of changedFiles()) {
  if (!allowed.has(file)) throw new Error(`OUT_OF_SCOPE:${file}`);
  if (/^(supabase\/|migrations\/|sql\/)/i.test(file)) throw new Error(`FORBIDDEN_SQL_SCOPE:${file}`);
}

const task = read(rel.task);
const event = read(rel.event);
const report = read(rel.report);
const taskDelete = section(task, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const taskPost = task.slice(task.indexOf("if (req.method !== 'POST')"));
const eventDelete = section(event, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");

must(task.split('\n')[2], 'updateByIdScoped, updateWhere', 'task import owner-filtered writer');
mustNot(task.split('\n')[2], 'updateById }', 'task unscoped import');
must(taskDelete, 'created_by_user_id', 'task owner select');
must(taskDelete, 'verifiedRequestUserIdStageG15R3', 'verified user comparison');
must(taskDelete, "error: 'TASK_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED'", 'identical legacy 403');
must(taskDelete, "error: 'TASK_DELETE_WORKSPACE_MISMATCH'", 'workspace mismatch 409');
must(taskDelete, 'workspace_id=is.null&created_by_user_id=eq.', 'legacy race-safe filter');
must(taskDelete, 'await updateWhere(legacyOwnerScopedUpdatePathStageG15R3, payloadStage228R23)', 'legacy local writer');
must(taskDelete, "await updateByIdScoped('work_items', id, workspaceId, payloadStage228R23)", 'exact workspace writer');
must(taskDelete, "if (rowWorkspaceIdStage228R23) {\n        await clearLeadNextActionIfMatchingTaskStage228R17", 'lead cleanup exact-workspace only');
must(taskDelete, 'alreadyMissing: true', 'idempotent missing');
mustNot(taskDelete, "updateById('work_items'", 'unscoped writer');
mustNot(taskDelete, 'pending_delete', 'legacy pending delete');
mustNot(taskDelete, 'markGoogleCalendarMutationSyncState({', 'route Google mutation marker');
mustNot(taskDelete, 'fetch(', 'route remote call');

must(taskPost, 'created_by_user_id: requestUserIdStage232GR3 || null', 'G14 task owner stamp preserved');
must(taskPost, 'buildGoogleCalendarCreateSyncStateInsertPayload({', 'G14 create payload preserved');

must(eventDelete, 'verifiedRequestUserIdStageG15R2', 'Event DELETE owner evidence regression');
must(eventDelete, 'workspace_id=is.null&created_by_user_id=eq.', 'Event DELETE legacy filter regression');
mustNot(eventDelete, "updateById('work_items'", 'Event DELETE unscoped writer regression');
mustNot(eventDelete, 'markGoogleCalendarMutationSyncState({', 'Event DELETE remote mutation regression');

must(report, PASS_TOKEN, 'report status');
must(report, 'TASK_DELETE_OWNER_EVIDENCE: VERIFIED_SUPABASE_USER_ID_ONLY');
must(report, 'LEGACY_NULL_OWNER_MATCH: LOCAL_TASK_TOMBSTONE_ONLY');
must(report, 'LEGACY_NULL_OWNER_MISSING_OR_MISMATCH: 403_UNCHANGED');
must(report, 'LEGACY_NULL_LEAD_NEXT_ACTION_MUTATION: NO');
must(report, 'EVENT_DELETE_CHANGED: NO');
must(report, 'SQL_OR_MIGRATIONS_CHANGED: NO');
must(report, 'REMOTE_GOOGLE_DELETE_ADDED: NO');

console.log('G15_R3_GUARD: PASS');
console.log('G15_R3_OWNER_EVIDENCE: VERIFIED_SUPABASE_USER_ID_ONLY');
console.log('G15_R3_LEGACY_OWNER_MATCH: LOCAL_TASK_TOMBSTONE_ONLY');
console.log('G15_R3_LEGACY_OWNER_MISSING_OR_MISMATCH: FAIL_CLOSED_403_UNCHANGED');
console.log('G15_R3_LEGACY_LEAD_NEXT_ACTION_MUTATION: NO');
console.log('G15_R3_EVENT_DELETE_REGRESSION: SAFE');
console.log('G15_R3_SQL_CHANGED: NO');
console.log('G15_R3_REMOTE_GOOGLE_DELETE_ADDED: NO');
