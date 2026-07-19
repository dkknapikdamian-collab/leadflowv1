const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const eventSource = fs.readFileSync(path.join(root, 'src/server/event-route-stage124f.ts'), 'utf8').replace(/\r\n/g, '\n');
const taskSource = fs.readFileSync(path.join(root, 'src/server/task-route-stage124f.ts'), 'utf8').replace(/\r\n/g, '\n');
const guardSource = fs.readFileSync(path.join(root, 'scripts/guards/verify-lf-prod-sot-g15-r4-delete-cross-consumer-automated-readiness-gate.cjs'), 'utf8').replace(/\r\n/g, '\n');

function deleteRegion(source) {
  return source.slice(
    source.indexOf("if (req.method === 'DELETE')"),
    source.indexOf("if (req.method !== 'POST')"),
  );
}

const eventDelete = deleteRegion(eventSource);
const taskDelete = deleteRegion(taskSource);

function assertSafeConsumer(source, {
  verifiedError,
  legacyError,
  workspaceError,
  legacyWriter,
}) {
  assert.match(source, new RegExp(verifiedError));
  assert.match(source, /select=id,workspace_id,created_by_user_id,/);
  assert.match(source, new RegExp(legacyError));
  assert.match(source, new RegExp(workspaceError));
  assert.match(source, /workspace_id=is\.null&created_by_user_id=eq\./);
  assert.match(source, new RegExp(`await updateWhere\\(${legacyWriter}, payloadStage228R23\\)`));
  assert.match(source, /await updateByIdScoped\('work_items', id, workspaceId, payloadStage228R23\)/);
  assert.match(source, /alreadyMissing: true/);
  assert.doesNotMatch(source, /updateById\('work_items'/);
  assert.doesNotMatch(source, /pending_delete|markGoogleCalendarMutationSyncState\s*\(|fetch\s*\(/);
}

test('01 Event DELETE keeps verified owner-evidence fail-closed contract', () => {
  assertSafeConsumer(eventDelete, {
    verifiedError: 'EVENT_DELETE_VERIFIED_USER_ID_REQUIRED',
    legacyError: 'EVENT_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED',
    workspaceError: 'EVENT_DELETE_WORKSPACE_MISMATCH',
    legacyWriter: 'legacyOwnerScopedUpdatePathStageG15R2',
  });
});

test('02 Task DELETE keeps verified owner-evidence fail-closed contract', () => {
  assertSafeConsumer(taskDelete, {
    verifiedError: 'TASK_DELETE_VERIFIED_USER_ID_REQUIRED',
    legacyError: 'TASK_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED',
    workspaceError: 'TASK_DELETE_WORKSPACE_MISMATCH',
    legacyWriter: 'legacyOwnerScopedUpdatePathStageG15R3',
  });
});

test('03 both consumers return the same durable hidden tombstone shape', () => {
  for (const source of [eventDelete, taskDelete]) {
    assert.match(source, /status: 'deleted'/);
    assert.match(source, /show_in_tasks: false/);
    assert.match(source, /show_in_calendar: false/);
    assert.match(source, /deleted: true, hidden: true, verified: true/);
  }
});

test('04 both consumers use externally indistinguishable legacy owner failures', () => {
  assert.match(eventDelete, /res\.status\(403\)\.json\(\{ error: 'EVENT_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED' \}\)/);
  assert.match(taskDelete, /res\.status\(403\)\.json\(\{ error: 'TASK_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED' \}\)/);
});

test('05 non-null workspace mismatch remains write-free before tombstone branch', () => {
  for (const source of [eventDelete, taskDelete]) {
    const mismatchIndex = source.indexOf('rowWorkspaceIdStage228R23 && rowWorkspaceIdStage228R23 !== workspaceId');
    const scopedWriteIndex = source.indexOf("await updateByIdScoped('work_items'");
    assert.ok(mismatchIndex >= 0);
    assert.ok(scopedWriteIndex > mismatchIndex);
  }
});

test('06 Task legacy-null path cannot mutate lead next action', () => {
  const legacyStart = taskDelete.indexOf('} else {');
  const verificationStart = taskDelete.indexOf('const afterStage228R23');
  const legacyPath = taskDelete.slice(legacyStart, verificationStart);
  assert.doesNotMatch(legacyPath, /clearLeadNextActionIfMatchingTaskStage228R17/);
  assert.match(taskDelete, /if \(rowWorkspaceIdStage228R23\) \{\n        await clearLeadNextActionIfMatchingTaskStage228R17/);
});

test('07 neither DELETE path schedules or performs remote Google deletion', () => {
  for (const source of [eventDelete, taskDelete]) {
    assert.doesNotMatch(source, /google_calendar_event_id\s*:|pending_delete|fetch\s*\(|deleteGoogle|googleapis/);
  }
});

test('08 readiness guard executes both dedicated matrices', () => {
  assert.match(guardSource, /runMatrix\(rel\.eventTest, 18, 'EVENT_DELETE'\)/);
  assert.match(guardSource, /runMatrix\(rel\.taskTest, 20, 'TASK_DELETE'\)/);
  assert.match(guardSource, /G15_R4_COMBINED_MATRIX: 38_PASS_0_FAIL/);
});

test('09 readiness gate explicitly keeps runtime and manual-smoke status separate', () => {
  assert.match(guardSource, /G15_R4_RUNTIME_CHANGED: NO/);
  assert.match(guardSource, /G15_R4_MANUAL_SMOKE: DEFERRED_TO_FINAL_ACCEPTANCE/);
});

test('10 readiness gate requires the Task clean-checkout portability closeout', () => {
  assert.match(guardSource, /PASS_TASK_DELETE_TEST_CLEAN_CHECKOUT_PORTABILITY_REPAIR/);
  assert.match(guardSource, /G15_R3_EXECUTABLE_MATRIX: 20 PASS \/ 0 FAIL/);
});
