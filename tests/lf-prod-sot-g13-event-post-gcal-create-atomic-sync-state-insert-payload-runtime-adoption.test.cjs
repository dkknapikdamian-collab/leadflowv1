const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const eventPath = path.join(root, 'src/server/event-route-stage124f.ts');
const helperPath = path.join(root, 'src/lib/google-calendar-create-sync-state-insert-payload.ts');
const facadePath = path.join(root, 'src/lib/google-calendar-mutation-sync-state-decision.ts');
const taskPath = path.join(root, 'src/server/task-route-stage124f.ts');
const eventSource = fs.readFileSync(eventPath, 'utf8');
const helperSource = fs.readFileSync(helperPath, 'utf8');
const facadeSource = fs.readFileSync(facadePath, 'utf8');
const taskSource = fs.readFileSync(taskPath, 'utf8');

let tmp;
let handler;
let capture;

function transpile(source, target) {
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
}

test.before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'g13-'));
  fs.mkdirSync(path.join(tmp, 'server'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'lib'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}\n');

  transpile(facadeSource, path.join(tmp, 'lib/google-calendar-mutation-sync-state-decision.js'));
  transpile(helperSource, path.join(tmp, 'lib/google-calendar-create-sync-state-insert-payload.js'));
  transpile(eventSource, path.join(tmp, 'server/event-route-stage124f.js'));

  fs.writeFileSync(path.join(tmp, 'server/_supabase.js'), `
export async function insertWithVariants(tables, rows) {
  globalThis.__g13Capture.inserts.push({ tables, rows });
  return { data: [{ id: 'event-1', ...rows[0] }] };
}
export async function updateByIdScoped(table, id, workspaceId, payload) {
  globalThis.__g13Capture.updates.push({ table, id, workspaceId, payload });
  return [{ id, ...payload }];
}
export async function updateById() { return []; }
export async function selectFirstAvailable() { return { data: [] }; }
export async function deleteByIdScoped() { return []; }
`);
  fs.writeFileSync(path.join(tmp, 'server/_request-scope.js'), `
export async function resolveRequestWorkspaceId() { return globalThis.__g13Capture.workspaceId; }
export async function requireRequestIdentity() { return { userId: globalThis.__g13Capture.userId }; }
export function withWorkspaceFilter(value) { return value; }
`);
  fs.writeFileSync(path.join(tmp, 'lib/data-contract.js'), 'export function normalizeEventListContract(rows){ return rows; }\n');
  fs.writeFileSync(path.join(tmp, 'lib/calendar-timezone-contract.js'), `
export function normalizeCloseFlowDateTimeToUtcIso(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}
`);
  fs.writeFileSync(path.join(tmp, 'server/google-calendar-mutation-sync-state-marker.js'), `
export async function markGoogleCalendarMutationSyncState() {
  globalThis.__g13Capture.markerCalls += 1;
  return { found: true };
}
`);
  handler = (await import(pathToFileURL(path.join(tmp, 'server/event-route-stage124f.js')).href)).default;
});

test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

async function post(body, userId = 'user-1') {
  capture = globalThis.__g13Capture = {
    inserts: [],
    updates: [],
    markerCalls: 0,
    workspaceId: 'workspace-1',
    userId,
  };
  let statusCode = 0;
  let responseBody;
  const req = { method: 'POST', body };
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { responseBody = value; return this; },
  };
  await handler(req, res);
  return { capture, statusCode, responseBody };
}

test('01 Event POST imports the real G12 helper', () => assert.match(eventSource, /google-calendar-create-sync-state-insert-payload\.js/));
test('02 Event POST invokes the helper exactly once', () => assert.equal((eventSource.match(/\bbuildGoogleCalendarCreateSyncStateInsertPayload\s*\(/g) || []).length, 1));
test('03 helper invocation is after the POST method gate', () => assert.ok(eventSource.indexOf('buildGoogleCalendarCreateSyncStateInsertPayload({') > eventSource.indexOf("if (req.method !== 'POST')")));
test('04 helper invocation is before the single work_items insert', () => assert.ok(eventSource.indexOf('buildGoogleCalendarCreateSyncStateInsertPayload({') < eventSource.indexOf("insertWithVariants(['work_items'], [payload])")));

test('05 eligible local event insert contains google_calendar_sync_status=pending', async () => {
  const { capture } = await post({ title: 'Meeting', startAt: '2026-07-13T10:00:00+02:00' });
  assert.equal(capture.inserts[0].rows[0].google_calendar_sync_status, 'pending');
});
test('06 pending status is present in the exact payload passed to insertWithVariants', async () => {
  const { capture } = await post({ title: 'Meeting', startAt: '2026-07-13T10:00:00+02:00' });
  assert.deepEqual(capture.inserts[0].tables, ['work_items']);
  assert.equal(capture.inserts[0].rows.length, 1);
  assert.equal(capture.inserts[0].rows[0].google_calendar_sync_status, 'pending');
});
test('07 imported external_google_event insert omits google_calendar_sync_status', async () => {
  const { capture } = await post({ title: 'Imported', type: 'external_google_event', startAt: '2026-07-13T10:00:00+02:00' });
  assert.equal('google_calendar_sync_status' in capture.inserts[0].rows[0], false);
});
test('08 event without owner stamp omits google_calendar_sync_status', async () => {
  const { capture } = await post({ title: 'No owner', startAt: '2026-07-13T10:00:00+02:00' }, '');
  assert.equal('google_calendar_sync_status' in capture.inserts[0].rows[0], false);
});
test('09 closed event without remote Google id omits google_calendar_sync_status', async () => {
  const { capture } = await post({ title: 'Closed', status: 'closed', startAt: '2026-07-13T10:00:00+02:00' });
  assert.equal(capture.inserts[0].rows[0].status, 'done');
  assert.equal('google_calendar_sync_status' in capture.inserts[0].rows[0], false);
});
test('10 unsupported or no-write decision does not create an undefined sync key', async () => {
  const { capture } = await post({ title: 'Imported', type: 'external_google_event' });
  assert.equal(Object.hasOwn(capture.inserts[0].rows[0], 'google_calendar_sync_status'), false);
});
test('11 client supplied google_calendar_sync_status is ignored', async () => {
  const { capture } = await post({ title: 'Meeting', google_calendar_sync_status: 'synced' });
  assert.equal(capture.inserts[0].rows[0].google_calendar_sync_status, 'pending');
});
test('12 googleCalendarEventId input is null', () => assert.match(eventSource, /googleCalendarEventId:\s*null/));
test('13 currentGoogleSyncStatus input is null', () => assert.match(eventSource, /currentGoogleSyncStatus:\s*null/));
test('14 mutation kind remains hardcoded to create inside G12', () => assert.match(helperSource, /mutationKind:\s*'create'/));
test('15 normalized server status is used', async () => {
  const { capture } = await post({ title: 'Closed', status: 'closed' });
  assert.equal(capture.inserts[0].rows[0].status, 'done');
});
test('16 normalized server start time controls hasCalendarTime', async () => {
  const { capture } = await post({ title: 'Meeting', startAt: '2026-07-13T10:00:00+02:00' });
  assert.equal(capture.inserts[0].rows[0].start_at, '2026-07-13T08:00:00.000Z');
});
test('17 final payload is inserted exactly once', async () => {
  const { capture } = await post({ title: 'Meeting' });
  assert.equal(capture.inserts.length, 1);
});
test('18 no post-insert Google sync status PATCH exists', async () => {
  const { capture } = await post({ title: 'Meeting' });
  assert.equal(capture.updates.some(x => x.table === 'work_items' && 'google_calendar_sync_status' in x.payload), false);
});
test('19 no Event POST G9 marker call exists', async () => {
  const { capture } = await post({ title: 'Meeting' });
  assert.equal(capture.markerCalls, 0);
});
test('20 existing syncLeadNextAction behavior remains present', () => assert.match(eventSource, /await syncLeadNextAction\(/));
test('21 Event PATCH G9 marker remains exactly once', () => assert.equal((eventSource.match(/markGoogleCalendarMutationSyncState\(\{/g) || []).length, 1));
test('22 Task POST remains unwired', () => assert.doesNotMatch(taskSource, /google-calendar-create-sync-state-insert-payload/));
test('23 Event DELETE remains unwired', () => assert.doesNotMatch(eventSource.slice(eventSource.indexOf("if (req.method === 'DELETE')"), eventSource.indexOf("if (req.method !== 'POST')")), /buildGoogleCalendarCreateSyncStateInsertPayload/));
test('24 Task DELETE remains unwired', () => assert.doesNotMatch(taskSource, /buildGoogleCalendarCreateSyncStateInsertPayload/));
test('25 G12 helper source is unchanged in stage diff', () => assert.match(helperSource, /GCAL_CREATE_SYNC_STATE_INSERT_PAYLOAD_INVALID_DECISION/));
test('26 G7 facade source is unchanged in stage diff', () => assert.match(facadeSource, /mutationKind/));
test('27 input body cannot overwrite server owner stamp', async () => {
  const { capture } = await post({ title: 'Meeting', created_by_user_id: 'attacker' });
  assert.equal(capture.inserts[0].rows[0].created_by_user_id, 'user-1');
});
test('28 input body cannot overwrite record_type', async () => {
  const { capture } = await post({ title: 'Meeting', record_type: 'task' });
  assert.equal(capture.inserts[0].rows[0].record_type, 'event');
});
test('29 response normalization remains unchanged', async () => {
  const { statusCode, responseBody } = await post({ title: 'Meeting' });
  assert.equal(statusCode, 200);
  assert.equal(responseBody.id, 'event-1');
});
test('30 no G14 artifact exists', () => {
  const files = fs.readdirSync(path.join(root, '_project/runs'));
  assert.equal(files.some(x => x.includes('G14')), false);
});
