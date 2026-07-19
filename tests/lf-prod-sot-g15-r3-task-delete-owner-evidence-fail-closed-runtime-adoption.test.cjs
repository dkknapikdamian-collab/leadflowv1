const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const ts = require('typescript');

const root = __dirname;
const taskPath = path.join(root, 'task-route-stage124f.ts');
const taskSource = fs.readFileSync(taskPath, 'utf8');
let tmp;
let handler;

function transpile(source, target) {
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  });
  if (result.diagnostics?.length) {
    throw new Error(result.diagnostics.map((entry) => String(entry.messageText)).join('\n'));
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, result.outputText);
}

function deleteRegion() {
  return taskSource.slice(
    taskSource.indexOf("if (req.method === 'DELETE')"),
    taskSource.indexOf("if (req.method !== 'POST')"),
  );
}

test.before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'g15-r3-'));
  fs.mkdirSync(path.join(tmp, 'server'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'lib'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}\n');
  transpile(taskSource, path.join(tmp, 'server/task-route-stage124f.js'));

  fs.writeFileSync(path.join(tmp, 'server/_supabase.js'), `
export async function selectFirstAvailable(paths) {
  const capture = globalThis.__g15r3Capture;
  capture.selects.push(paths);
  return { data: capture.selectResponses.length ? capture.selectResponses.shift() : [] };
}
export async function updateByIdScoped(table,id,workspaceId,payload) {
  globalThis.__g15r3Capture.scopedUpdates.push({table,id,workspaceId,payload});
  return [{id,workspace_id:workspaceId,...payload}];
}
export async function updateWhere(path,payload) {
  globalThis.__g15r3Capture.whereUpdates.push({path,payload});
  return [{...payload}];
}
export async function updateById(...args) {
  globalThis.__g15r3Capture.unscopedUpdates.push(args);
  throw new Error('UNSCOPED_UPDATE_FORBIDDEN');
}
export async function insertWithVariants(){ throw new Error('POST_NOT_EXPECTED'); }
export async function deleteByIdScoped(){ throw new Error('HARD_DELETE_NOT_EXPECTED'); }
`);
  fs.writeFileSync(path.join(tmp, 'server/_request-scope.js'), `
export async function resolveRequestWorkspaceId(){ return globalThis.__g15r3Capture.workspaceId; }
export async function requireRequestIdentity(){ return { userId: globalThis.__g15r3Capture.userId, uid: globalThis.__g15r3Capture.userId }; }
export function withWorkspaceFilter(path,workspaceId){ return path + '&workspace_id=eq.' + encodeURIComponent(workspaceId); }
`);
  fs.writeFileSync(path.join(tmp, 'lib/data-contract.js'), 'export function normalizeTaskListContract(rows){return rows;}\n');
  fs.writeFileSync(path.join(tmp, 'lib/calendar-timezone-contract.js'), 'export function normalizeCloseFlowDateTimeToUtcIso(value){return value ? new Date(value).toISOString() : null;}\n');
  fs.writeFileSync(path.join(tmp, 'server/google-calendar-mutation-sync-state-marker.js'), 'export async function markGoogleCalendarMutationSyncState(){globalThis.__g15r3Capture.markerCalls += 1; return {found:true};}\n');
  fs.writeFileSync(path.join(tmp, 'lib/google-calendar-create-sync-state-insert-payload.js'), 'export function buildGoogleCalendarCreateSyncStateInsertPayload(){globalThis.__g15r3Capture.createHelperCalls += 1; return {insertPayload:{}};}\n');
  handler = (await import(pathToFileURL(path.join(tmp, 'server/task-route-stage124f.js')).href)).default;
});

test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

async function runDelete({
  id = 'task-1',
  workspaceId = 'workspace-1',
  userId = 'user-1',
  selectResponses = [],
  headers = {},
  body = {},
  useBodyId = false,
} = {}) {
  const capture = globalThis.__g15r3Capture = {
    workspaceId,
    userId,
    selects: [],
    selectResponses: [...selectResponses],
    scopedUpdates: [],
    whereUpdates: [],
    unscopedUpdates: [],
    markerCalls: 0,
    createHelperCalls: 0,
  };
  let statusCode = 0;
  let responseBody;
  const req = {
    method: 'DELETE',
    query: useBodyId || id === null ? {} : { id },
    body: useBodyId ? { ...body, id } : body,
    headers,
  };
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { responseBody = value; return this; },
  };
  await handler(req, res);
  return { capture, statusCode, responseBody };
}

const exactRow = (overrides = {}) => ({
  id: 'task-1', workspace_id: 'workspace-1', created_by_user_id: 'user-1', lead_id: 'lead-1',
  status: 'todo', show_in_tasks: true, show_in_calendar: true, type: 'task',
  ...overrides,
});
const deletedRow = (overrides = {}) => ({
  ...exactRow(), status: 'deleted', show_in_tasks: false, show_in_calendar: false, ...overrides,
});

// Static contract checks.
test('01 DELETE imports updateWhere and removes updateById', () => {
  assert.match(taskSource, /updateByIdScoped, updateWhere/);
  assert.doesNotMatch(taskSource.split('\n')[2], /\bupdateById\b/);
});
test('02 DELETE select includes created_by_user_id', () => assert.match(deleteRegion(), /select=id,workspace_id,created_by_user_id,/));
test('03 verified request user ID is the only owner evidence', () => {
  assert.match(deleteRegion(), /verifiedRequestUserIdStageG15R3\s*=\s*requestUserIdStage232GR3\.toLowerCase\(\)/);
  assert.doesNotMatch(deleteRegion(), /body\.(email|userId|uid|created_by_user_id)/);
  assert.doesNotMatch(deleteRegion(), /headers?\[/);
});
test('04 legacy mutation is triple-filtered', () => {
  const source = deleteRegion();
  assert.match(source, /workspace_id=is\.null&created_by_user_id=eq\./);
  assert.match(source, /await updateWhere\(legacyOwnerScopedUpdatePathStageG15R3, payloadStage228R23\)/);
  assert.doesNotMatch(source, /\bupdateById\s*\(/);
});
test('05 DELETE has no Google or remote mutation', () => {
  const source = deleteRegion();
  assert.doesNotMatch(source, /markGoogleCalendarMutationSyncState\s*\(/);
  assert.doesNotMatch(source, /buildGoogleCalendarCreateSyncStateInsertPayload\s*\(/);
  assert.doesNotMatch(source, /pending_delete|google_calendar_event_id\s*:|fetch\s*\(/);
});

test('06 missing id returns 400 without row access', async () => {
  const result = await runDelete({ id: null });
  assert.equal(result.statusCode, 400);
  assert.deepEqual(result.responseBody, { error: 'TASK_ID_REQUIRED' });
  assert.equal(result.capture.selects.length, 0);
});

test('07 body id remains supported', async () => {
  const result = await runDelete({ useBodyId: true, selectResponses: [[], []] });
  assert.equal(result.statusCode, 200);
  assert.equal(result.responseBody.alreadyMissing, true);
});

test('08 missing verified Supabase user ID returns 401 before row access', async () => {
  const result = await runDelete({ userId: '' });
  assert.equal(result.statusCode, 401);
  assert.deepEqual(result.responseBody, { error: 'TASK_DELETE_VERIFIED_USER_ID_REQUIRED' });
  assert.equal(result.capture.selects.length, 0);
});

test('09 safe lookup miss stays idempotent 200 alreadyMissing', async () => {
  const result = await runDelete({ selectResponses: [[], []] });
  assert.equal(result.statusCode, 200);
  assert.equal(result.responseBody.alreadyMissing, true);
  assert.equal(result.capture.scopedUpdates.length + result.capture.whereUpdates.length, 0);
});

test('10 non-null workspace mismatch returns 409 unchanged', async () => {
  const result = await runDelete({ selectResponses: [[], [exactRow({ workspace_id: 'workspace-2' })]] });
  assert.equal(result.statusCode, 409);
  assert.equal(result.responseBody.error, 'TASK_DELETE_WORKSPACE_MISMATCH');
  assert.equal(result.capture.scopedUpdates.length + result.capture.whereUpdates.length, 0);
});

for (const [label, owner] of [['match', 'user-1'], ['missing', null], ['mismatch', 'user-2']]) {
  test(`11 exact workspace owner ${label} gets scoped tombstone and scoped lead cleanup`, async () => {
    const result = await runDelete({
      selectResponses: [
        [exactRow({ created_by_user_id: owner })],
        [deletedRow({ created_by_user_id: owner })],
        [{ id: 'lead-1', next_action_item_id: 'task-1' }],
      ],
    });
    assert.equal(result.statusCode, 200);
    assert.equal(result.capture.whereUpdates.length, 0);
    assert.equal(result.capture.scopedUpdates.length, 2);
    assert.equal(result.capture.scopedUpdates[0].table, 'work_items');
    assert.equal(result.capture.scopedUpdates[1].table, 'leads');
    assert.equal(result.capture.markerCalls, 0);
  });
}

test('12 exact workspace row without matching lead action has no lead write', async () => {
  const result = await runDelete({ selectResponses: [[exactRow()], [deletedRow()], []] });
  assert.equal(result.statusCode, 200);
  assert.equal(result.capture.scopedUpdates.length, 1);
  assert.equal(result.capture.scopedUpdates[0].table, 'work_items');
});

test('13 legacy-null exact owner match gets only owner-filtered task tombstone', async () => {
  const legacy = exactRow({ workspace_id: null, created_by_user_id: 'USER-1' });
  const result = await runDelete({
    selectResponses: [[], [legacy], [deletedRow({ workspace_id: null, created_by_user_id: 'USER-1' })]],
  });
  assert.equal(result.statusCode, 200);
  assert.equal(result.capture.scopedUpdates.length, 0);
  assert.equal(result.capture.whereUpdates.length, 1);
  assert.match(result.capture.whereUpdates[0].path, /^work_items\?id=eq\.task-1&workspace_id=is\.null&created_by_user_id=eq\.USER-1$/);
  assert.equal(result.capture.selects.length, 3, 'legacy tombstone must not read or mutate lead next_action');
});

async function runLegacyForbidden(owner) {
  return runDelete({ selectResponses: [[], [exactRow({ workspace_id: null, created_by_user_id: owner })]] });
}

test('14 legacy-null owner missing fails closed 403 unchanged', async () => {
  const result = await runLegacyForbidden(null);
  assert.equal(result.statusCode, 403);
  assert.deepEqual(result.responseBody, { error: 'TASK_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED' });
  assert.equal(result.capture.scopedUpdates.length + result.capture.whereUpdates.length, 0);
});

test('15 legacy-null owner mismatch has identical 403 and no write', async () => {
  const missing = await runLegacyForbidden(null);
  const mismatch = await runLegacyForbidden('user-2');
  assert.equal(mismatch.statusCode, 403);
  assert.deepEqual(mismatch.responseBody, missing.responseBody);
  assert.equal(mismatch.capture.scopedUpdates.length + mismatch.capture.whereUpdates.length, 0);
});

test('16 body and header spoofing cannot satisfy legacy owner evidence', async () => {
  const result = await runDelete({
    userId: 'verified-user',
    body: { userId: 'row-owner', created_by_user_id: 'row-owner', email: 'owner@example.com' },
    headers: { 'x-user-id': 'row-owner', 'x-user-email': 'owner@example.com' },
    selectResponses: [[], [exactRow({ workspace_id: null, created_by_user_id: 'row-owner' })]],
  });
  assert.equal(result.statusCode, 403);
  assert.equal(result.capture.whereUpdates.length, 0);
});

test('17 verification failure returns 500 and skips lead cleanup', async () => {
  const result = await runDelete({ selectResponses: [[exactRow()], [exactRow()]] });
  assert.equal(result.statusCode, 500);
  assert.equal(result.responseBody.error, 'TASK_DELETE_HIDE_VERIFY_FAILED');
  assert.equal(result.capture.scopedUpdates.length, 1);
  assert.equal(result.capture.selects.length, 2);
});

test('18 all scenarios avoid unscoped update and remote helpers', async () => {
  const result = await runDelete({ selectResponses: [[exactRow()], [deletedRow()], []] });
  assert.equal(result.capture.unscopedUpdates.length, 0);
  assert.equal(result.capture.markerCalls, 0);
  assert.equal(result.capture.createHelperCalls, 0);
});
