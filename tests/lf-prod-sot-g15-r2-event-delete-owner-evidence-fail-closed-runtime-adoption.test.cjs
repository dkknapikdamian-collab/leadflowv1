const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const eventPath = path.join(root, 'src/server/event-route-stage124f.ts');
const eventSource = fs.readFileSync(eventPath, 'utf8');
let tmp;
let handler;

function transpile(source, target) {
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
}

function deleteRegion() {
  return eventSource.slice(
    eventSource.indexOf("if (req.method === 'DELETE')"),
    eventSource.indexOf("if (req.method !== 'POST')"),
  );
}

test.before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'g15-r2-'));
  fs.mkdirSync(path.join(tmp, 'server'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'lib'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}\n');
  transpile(eventSource, path.join(tmp, 'server/event-route-stage124f.js'));

  fs.writeFileSync(path.join(tmp, 'server/_supabase.js'), `
export async function selectFirstAvailable(paths) {
  const capture = globalThis.__g15r2Capture;
  capture.selects.push(paths);
  return { data: capture.selectResponses.length ? capture.selectResponses.shift() : [] };
}
export async function updateByIdScoped(table,id,workspaceId,payload) {
  globalThis.__g15r2Capture.scopedUpdates.push({table,id,workspaceId,payload});
  return [{id,workspace_id:workspaceId,...payload}];
}
export async function updateWhere(path,payload) {
  globalThis.__g15r2Capture.whereUpdates.push({path,payload});
  return [{...payload}];
}
export async function updateById(...args) {
  globalThis.__g15r2Capture.unscopedUpdates.push(args);
  throw new Error('UNSCOPED_UPDATE_FORBIDDEN');
}
export async function insertWithVariants(){ throw new Error('POST_NOT_EXPECTED'); }
export async function deleteByIdScoped(){ throw new Error('HARD_DELETE_NOT_EXPECTED'); }
`);
  fs.writeFileSync(path.join(tmp, 'server/_request-scope.js'), `
export async function resolveRequestWorkspaceId(){ return globalThis.__g15r2Capture.workspaceId; }
export async function requireRequestIdentity(){ return { userId: globalThis.__g15r2Capture.userId, uid: globalThis.__g15r2Capture.userId }; }
export function withWorkspaceFilter(path,workspaceId){ return path + '&workspace_id=eq.' + encodeURIComponent(workspaceId); }
`);
  fs.writeFileSync(path.join(tmp, 'lib/data-contract.js'), 'export function normalizeEventListContract(rows){return rows;}\n');
  fs.writeFileSync(path.join(tmp, 'lib/calendar-timezone-contract.js'), 'export function normalizeCloseFlowDateTimeToUtcIso(value){return value ? new Date(value).toISOString() : null;}\n');
  fs.writeFileSync(path.join(tmp, 'server/google-calendar-mutation-sync-state-marker.js'), 'export async function markGoogleCalendarMutationSyncState(){globalThis.__g15r2Capture.markerCalls += 1; return {found:true};}\n');
  fs.writeFileSync(path.join(tmp, 'lib/google-calendar-create-sync-state-insert-payload.js'), 'export function buildGoogleCalendarCreateSyncStateInsertPayload(){globalThis.__g15r2Capture.createHelperCalls += 1; return {insertPayload:{}};}\n');
  handler = (await import(pathToFileURL(path.join(tmp, 'server/event-route-stage124f.js')).href)).default;
});

test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

async function runDelete({
  id = 'event-1',
  workspaceId = 'workspace-1',
  userId = 'user-1',
  selectResponses = [],
  headers = {},
  body = {},
} = {}) {
  const capture = globalThis.__g15r2Capture = {
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
  const req = { method: 'DELETE', query: id === null ? {} : { id }, body, headers };
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { responseBody = value; return this; },
  };
  await handler(req, res);
  return { capture, statusCode, responseBody };
}

const exactRow = (overrides = {}) => ({
  id: 'event-1', workspace_id: 'workspace-1', created_by_user_id: 'user-1',
  status: 'scheduled', show_in_tasks: true, show_in_calendar: true, type: 'meeting',
  ...overrides,
});
const deletedRow = (overrides = {}) => ({
  ...exactRow(), status: 'deleted', show_in_tasks: false, show_in_calendar: false, ...overrides,
});

test('01 DELETE select includes created_by_user_id', () => assert.match(deleteRegion(), /select=id,workspace_id,created_by_user_id,/));
test('02 verified request user ID is the only owner evidence', () => {
  assert.match(deleteRegion(), /verifiedRequestUserIdStageG15R2\s*=\s*requestUserIdStage232GR3\.toLowerCase\(\)/);
  assert.doesNotMatch(deleteRegion(), /body\.(email|userId|uid|created_by_user_id)/);
  assert.doesNotMatch(deleteRegion(), /headers?\[/);
});
test('03 legacy mutation is triple-filtered and never updateById', () => {
  const source = deleteRegion();
  assert.match(source, /workspace_id=is\.null&created_by_user_id=eq\./);
  assert.match(source, /await updateWhere\(legacyOwnerScopedUpdatePathStageG15R2, payloadStage228R23\)/);
  assert.doesNotMatch(source, /\bupdateById\s*\(/);
});
test('04 DELETE does not call Google marker or create helper', () => {
  assert.doesNotMatch(deleteRegion(), /markGoogleCalendarMutationSyncState\s*\(/);
  assert.doesNotMatch(deleteRegion(), /buildGoogleCalendarCreateSyncStateInsertPayload\s*\(/);
});
test('05 no workspace claim, pending delete or remote mutation is introduced', () => {
  const source = deleteRegion();
  assert.doesNotMatch(source, /workspace_id\s*:/);
  assert.doesNotMatch(source, /pending_delete/);
  assert.doesNotMatch(source, /google_calendar_event_id\s*:/);
  assert.doesNotMatch(source, /fetch\s*\(/);
});

test('06 missing id returns 400 without read or write', async () => {
  const result = await runDelete({ id: null });
  assert.equal(result.statusCode, 400);
  assert.deepEqual(result.responseBody, { error: 'EVENT_ID_REQUIRED' });
  assert.equal(result.capture.selects.length, 0);
  assert.equal(result.capture.scopedUpdates.length + result.capture.whereUpdates.length, 0);
});

test('07 missing verified Supabase user ID returns 401 without row access', async () => {
  const result = await runDelete({ userId: '' });
  assert.equal(result.statusCode, 401);
  assert.deepEqual(result.responseBody, { error: 'EVENT_DELETE_VERIFIED_USER_ID_REQUIRED' });
  assert.equal(result.capture.selects.length, 0);
});

test('08 safe lookup miss stays idempotent 200 alreadyMissing', async () => {
  const result = await runDelete({ selectResponses: [[], []] });
  assert.equal(result.statusCode, 200);
  assert.equal(result.responseBody.alreadyMissing, true);
  assert.equal(result.capture.scopedUpdates.length + result.capture.whereUpdates.length, 0);
});

test('09 non-null workspace mismatch returns 409 unchanged', async () => {
  const result = await runDelete({ selectResponses: [[], [exactRow({ workspace_id: 'workspace-2' })]] });
  assert.equal(result.statusCode, 409);
  assert.equal(result.responseBody.error, 'EVENT_DELETE_WORKSPACE_MISMATCH');
  assert.equal(result.capture.scopedUpdates.length + result.capture.whereUpdates.length, 0);
});

for (const [label, owner] of [['match', 'user-1'], ['missing', null], ['mismatch', 'user-2']]) {
  test(`10 exact workspace owner ${label} gets local scoped tombstone only`, async () => {
    const result = await runDelete({ selectResponses: [[exactRow({ created_by_user_id: owner })], [deletedRow({ created_by_user_id: owner })]] });
    assert.equal(result.statusCode, 200);
    assert.equal(result.capture.scopedUpdates.length, 1);
    assert.equal(result.capture.whereUpdates.length, 0);
    assert.deepEqual(result.capture.scopedUpdates[0].payload.status, 'deleted');
    assert.equal(result.capture.markerCalls, 0);
  });
}

test('11 imported exact-workspace Google row is locally tombstoned without remote call', async () => {
  const row = exactRow({ type: 'external_google_event' });
  const result = await runDelete({ selectResponses: [[row], [deletedRow({ type: 'external_google_event' })]] });
  assert.equal(result.statusCode, 200);
  assert.equal(result.capture.scopedUpdates.length, 1);
  assert.equal(result.capture.markerCalls, 0);
});

test('12 legacy-null exact owner match gets only owner-filtered local tombstone', async () => {
  const legacy = exactRow({ workspace_id: null, created_by_user_id: 'USER-1' });
  const result = await runDelete({ selectResponses: [[], [legacy], [deletedRow({ workspace_id: null, created_by_user_id: 'USER-1' })]] });
  assert.equal(result.statusCode, 200);
  assert.equal(result.capture.scopedUpdates.length, 0);
  assert.equal(result.capture.whereUpdates.length, 1);
  assert.match(result.capture.whereUpdates[0].path, /^work_items\?id=eq\.event-1&workspace_id=is\.null&created_by_user_id=eq\.USER-1$/);
  assert.equal(result.capture.whereUpdates[0].payload.status, 'deleted');
  assert.equal(result.capture.markerCalls, 0);
});

async function runLegacyForbidden(owner) {
  return runDelete({ selectResponses: [[], [exactRow({ workspace_id: null, created_by_user_id: owner })]] });
}

test('13 legacy-null owner missing fails closed 403 unchanged', async () => {
  const result = await runLegacyForbidden(null);
  assert.equal(result.statusCode, 403);
  assert.deepEqual(result.responseBody, { error: 'EVENT_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED' });
  assert.equal(result.capture.scopedUpdates.length + result.capture.whereUpdates.length, 0);
});

test('14 legacy-null owner mismatch has identical 403 and no write', async () => {
  const missing = await runLegacyForbidden(null);
  const mismatch = await runLegacyForbidden('user-2');
  assert.equal(mismatch.statusCode, 403);
  assert.deepEqual(mismatch.responseBody, missing.responseBody);
  assert.equal(mismatch.capture.scopedUpdates.length + mismatch.capture.whereUpdates.length, 0);
});

test('15 body and header spoofing cannot satisfy legacy owner evidence', async () => {
  const result = await runDelete({
    userId: 'verified-user',
    body: { userId: 'row-owner', created_by_user_id: 'row-owner', email: 'owner@example.com' },
    headers: { 'x-user-id': 'row-owner', 'x-user-email': 'owner@example.com' },
    selectResponses: [[], [exactRow({ workspace_id: null, created_by_user_id: 'row-owner' })]],
  });
  assert.equal(result.statusCode, 403);
  assert.equal(result.capture.whereUpdates.length, 0);
});

test('16 all DELETE scenarios avoid unscoped update and remote helpers', async () => {
  const result = await runDelete({ selectResponses: [[exactRow()], [deletedRow()]] });
  assert.equal(result.capture.unscopedUpdates.length, 0);
  assert.equal(result.capture.markerCalls, 0);
  assert.equal(result.capture.createHelperCalls, 0);
});
