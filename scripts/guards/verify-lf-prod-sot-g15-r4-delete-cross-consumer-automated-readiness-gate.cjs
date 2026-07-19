const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const rel = {
  event: 'src/server/event-route-stage124f.ts',
  task: 'src/server/task-route-stage124f.ts',
  eventTest: 'tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs',
  taskTest: 'tests/lf-prod-sot-g15-r3-task-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs',
  eventReport: '_project/runs/LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md',
  taskReport: '_project/runs/LF-PROD-SOT-G15-R3_TASK_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md',
  portabilityReport: '_project/runs/LF-PROD-SOT-G15-R3-R1_TASK_DELETE_TEST_CLEAN_CHECKOUT_PORTABILITY_REPAIR.md',
};

function read(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) throw new Error(`MISSING_REQUIRED_FILE:${relativePath}`);
  return fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
}

function section(text, start, end) {
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex <= startIndex) throw new Error(`MISSING_SECTION:${start}`);
  return text.slice(startIndex, endIndex);
}

function must(text, token, label = token) {
  if (!text.includes(token)) throw new Error(`MISSING_TOKEN:${label}`);
}

function mustNot(text, token, label = token) {
  if (text.includes(token)) throw new Error(`FORBIDDEN_TOKEN:${label}`);
}

function runMatrix(relativePath, expectedPasses, label) {
  const full = path.join(root, relativePath);
  const run = spawnSync(process.execPath, ['--test', full], {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
  });
  process.stdout.write(run.stdout || '');
  process.stderr.write(run.stderr || '');
  if (run.status !== 0) throw new Error(`${label}_MATRIX_FAILED:${run.status}`);
  const output = `${run.stdout || ''}\n${run.stderr || ''}`;
  if (!new RegExp(`# pass ${expectedPasses}\\b`).test(output)) {
    throw new Error(`${label}_EXPECTED_${expectedPasses}_PASS_NOT_PROVEN`);
  }
  if (!/# fail 0\b/.test(output)) throw new Error(`${label}_ZERO_FAIL_NOT_PROVEN`);
}

const eventSource = read(rel.event);
const taskSource = read(rel.task);
const eventDelete = section(eventSource, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const taskDelete = section(taskSource, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");

for (const [label, source, verifiedToken, ownerError, workspaceError, legacyPath] of [
  [
    'EVENT',
    eventDelete,
    'EVENT_DELETE_VERIFIED_USER_ID_REQUIRED',
    'EVENT_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED',
    'EVENT_DELETE_WORKSPACE_MISMATCH',
    'legacyOwnerScopedUpdatePathStageG15R2',
  ],
  [
    'TASK',
    taskDelete,
    'TASK_DELETE_VERIFIED_USER_ID_REQUIRED',
    'TASK_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED',
    'TASK_DELETE_WORKSPACE_MISMATCH',
    'legacyOwnerScopedUpdatePathStageG15R3',
  ],
]) {
  must(source, verifiedToken, `${label}_VERIFIED_USER_GATE`);
  must(source, 'created_by_user_id', `${label}_OWNER_SELECT`);
  must(source, ownerError, `${label}_LEGACY_FAIL_CLOSED_403`);
  must(source, workspaceError, `${label}_WORKSPACE_MISMATCH_409`);
  must(source, 'workspace_id=is.null&created_by_user_id=eq.', `${label}_OWNER_FILTERED_LEGACY_PATH`);
  must(source, `await updateWhere(${legacyPath}, payloadStage228R23)`, `${label}_OWNER_FILTERED_LEGACY_WRITE`);
  must(source, "await updateByIdScoped('work_items', id, workspaceId, payloadStage228R23)", `${label}_EXACT_WORKSPACE_SCOPED_WRITE`);
  must(source, 'alreadyMissing: true', `${label}_IDEMPOTENT_MISSING`);
  mustNot(source, "updateById('work_items'", `${label}_UNSCOPED_WRITE`);
  mustNot(source, 'pending_delete', `${label}_PENDING_DELETE`);
  mustNot(source, 'markGoogleCalendarMutationSyncState({', `${label}_ROUTE_GOOGLE_MUTATION_MARKER`);
  mustNot(source, 'fetch(', `${label}_REMOTE_CALL`);
}

must(taskDelete, "if (rowWorkspaceIdStage228R23) {\n        await clearLeadNextActionIfMatchingTaskStage228R17", 'TASK_LEAD_CLEANUP_EXACT_WORKSPACE_ONLY');

const eventReport = read(rel.eventReport);
const taskReport = read(rel.taskReport);
const portabilityReport = read(rel.portabilityReport);
must(eventReport, 'PASS_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION', 'EVENT_REPORT_PASS');
must(eventReport, 'G15-R2 runtime matrix: 18 PASS / 0 FAIL', 'EVENT_MATRIX_HISTORY');
must(taskReport, 'PASS_TASK_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION', 'TASK_REPORT_PASS');
must(taskReport, 'Dedicated executable Task DELETE matrix: 20 PASS / 0 FAIL', 'TASK_MATRIX_HISTORY');
must(portabilityReport, 'PASS_TASK_DELETE_TEST_CLEAN_CHECKOUT_PORTABILITY_REPAIR', 'TASK_PORTABILITY_PASS');
must(portabilityReport, 'G15_R3_EXECUTABLE_MATRIX: 20 PASS / 0 FAIL', 'TASK_PORTABILITY_MATRIX');

runMatrix(rel.eventTest, 18, 'EVENT_DELETE');
runMatrix(rel.taskTest, 20, 'TASK_DELETE');

console.log('G15_R4_DELETE_CROSS_CONSUMER_READINESS_GATE: PASS');
console.log('G15_R4_EVENT_DELETE_MATRIX: 18_PASS_0_FAIL');
console.log('G15_R4_TASK_DELETE_MATRIX: 20_PASS_0_FAIL');
console.log('G15_R4_COMBINED_MATRIX: 38_PASS_0_FAIL');
console.log('G15_R4_VERIFIED_OWNER_EVIDENCE: BOTH_CONSUMERS');
console.log('G15_R4_LEGACY_NULL_FAIL_CLOSED: BOTH_CONSUMERS');
console.log('G15_R4_REMOTE_GOOGLE_DELETE: NOT_CALLED');
console.log('G15_R4_RUNTIME_CHANGED: NO');
console.log('G15_R4_MANUAL_SMOKE: DEFERRED_TO_FINAL_ACCEPTANCE');
