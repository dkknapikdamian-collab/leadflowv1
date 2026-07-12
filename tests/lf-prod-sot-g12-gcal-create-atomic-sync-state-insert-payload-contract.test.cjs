const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'g12-r2-'));

for (const name of [
  'google-calendar-mutation-sync-state-decision',
  'google-calendar-create-sync-state-insert-payload',
]) {
  const source = fs.readFileSync(path.join(root, 'src/lib', `${name}.ts`), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });
  fs.writeFileSync(path.join(tmp, `${name}.js`), output.outputText);
}

fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}\n');

let api;

test.before(async () => {
  api = await import(
    pathToFileURL(
      path.join(tmp, 'google-calendar-create-sync-state-insert-payload.js'),
    ).href
  );
});

test.after(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

const base = () => ({
  recordType: 'task',
  type: 'task',
  status: 'todo',
  showInCalendar: true,
  hasCalendarTime: true,
  createdByUserId: 'u1',
  googleCalendarEventId: null,
  currentGoogleSyncStatus: null,
});

const call = (overrides = {}) =>
  api.buildGoogleCalendarCreateSyncStateInsertPayload({
    ...base(),
    ...overrides,
  });

const withDecision = (decision, inputOverrides = {}) =>
  api.buildGoogleCalendarCreateSyncStateInsertPayloadWithDependencies(
    { ...base(), ...inputOverrides },
    { decide: () => decision },
  );

const rejects = (decision, inputOverrides = {}) =>
  assert.throws(
    () => withDecision(decision, inputOverrides),
    /GCAL_CREATE_SYNC_STATE_INSERT_PAYLOAD_INVALID_DECISION/,
  );

const source = fs.readFileSync(
  path.join(root, 'src/lib/google-calendar-create-sync-state-insert-payload.ts'),
  'utf8',
);

test('01 real G7 import', () => assert.match(source, /mutation-sync-state-decision\.js/));
test('02 no server import', () => assert.doesNotMatch(source, /server\//));
test('03 create hardcoded', () => assert.match(source, /mutationKind:\s*'create'/));
test('04 maps recordType', () => assert.match(source, /recordType: input\.recordType/));
test('05 maps type', () => assert.match(source, /type: input\.type/));
test('06 maps status', () => assert.match(source, /status: input\.status/));
test('07 maps showInCalendar', () => assert.match(source, /showInCalendar: input\.showInCalendar/));
test('08 maps hasCalendarTime', () => assert.match(source, /hasCalendarTime: input\.hasCalendarTime/));
test('09 maps createdByUserId', () => assert.match(source, /createdByUserId: input\.createdByUserId/));
test('10 maps googleCalendarEventId', () => assert.match(source, /googleCalendarEventId: input\.googleCalendarEventId/));
test('11 maps currentGoogleSyncStatus', () => assert.match(source, /currentGoogleSyncStatus: input\.currentGoogleSyncStatus/));
test('12 task pending', () => assert.deepEqual(call().insertPayload, { google_calendar_sync_status: 'pending' }));
test('13 event pending', () => assert.deepEqual(call({ recordType: 'event', type: 'meeting' }).insertPayload, { google_calendar_sync_status: 'pending' }));
test('14 no owner', () => assert.equal(call({ createdByUserId: null }).decision.outcome, 'skip_no_owner'));
test('15 no time', () => assert.equal(call({ hasCalendarTime: false }).decision.outcome, 'skip_no_calendar_time'));
test('16 hidden', () => assert.equal(call({ showInCalendar: false }).decision.outcome, 'unchanged'));
test('17 closed', () => assert.equal(call({ status: 'done' }).decision.outcome, 'unchanged'));
test('18 imported', () => assert.equal(call({ type: 'external_google_event' }).decision.outcome, 'skip_imported'));
test('19 unsupported', () => assert.equal(call({ recordType: 'note' }).decision.outcome, 'unchanged'));
test('20 already pending', () => assert.deepEqual(call({ currentGoogleSyncStatus: 'pending' }).insertPayload, {}));
test('21 exact pending key', () => assert.deepEqual(Object.keys(call().insertPayload), ['google_calendar_sync_status']));
test('22 no-write no key', () => assert.equal('google_calendar_sync_status' in call({ hasCalendarTime: false }).insertPayload, false));
test('23 input immutable', () => { const x = base(); const y = structuredClone(x); api.buildGoogleCalendarCreateSyncStateInsertPayload(x); assert.deepEqual(x, y); });
test('24 new payload', () => assert.notEqual(call().insertPayload, call().insertPayload));
test('25 pending delete error', () => rejects({ outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true }));
test('26 write null error', () => rejects({ outcome: 'pending', nextSyncStatus: null, shouldWrite: true }));
test('27 no-write pending error', () => rejects({ outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: false }));
test('28 unchanged write error', () => rejects({ outcome: 'unchanged', nextSyncStatus: 'pending', shouldWrite: true }));
test('29 null error', () => rejects(null));
test('30 malformed error', () => rejects({ outcome: 'pending' }));
test('31 no fetch', () => assert.doesNotMatch(source, /\bfetch\s*\(/));
test('32 no supabase', () => assert.doesNotMatch(source, /supabase|insertWithVariants|updateById/i));
test('33 no G8', () => assert.doesNotMatch(source, /mutation-snapshot/));
test('34 no G9', () => assert.doesNotMatch(source, /sync-state-marker/));
test('35 no pending delete payload', () => assert.doesNotMatch(source, /google_calendar_sync_status:\s*'pending_delete'/));
test('36 strict outcome set present', () => assert.match(source, /CREATE_NO_WRITE_OUTCOMES/));
test('37 unknown outcome with null false is rejected', () => rejects({ outcome: 'unknown', nextSyncStatus: null, shouldWrite: false }));
test('38 pending with null false is rejected', () => rejects({ outcome: 'pending', nextSyncStatus: null, shouldWrite: false }));
test('39 pending with pending false and non-pending input is rejected', () => rejects({ outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: false }));
test('40 pending with pending false and pending input is accepted', () => assert.deepEqual(withDecision({ outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: false }, { currentGoogleSyncStatus: 'pending' }).insertPayload, {}));
test('41 unchanged with null false is accepted', () => assert.deepEqual(withDecision({ outcome: 'unchanged', nextSyncStatus: null, shouldWrite: false }).insertPayload, {}));
test('42 skip_imported with null false is accepted', () => assert.deepEqual(withDecision({ outcome: 'skip_imported', nextSyncStatus: null, shouldWrite: false }).insertPayload, {}));
test('43 skip_no_owner with null false is accepted', () => assert.deepEqual(withDecision({ outcome: 'skip_no_owner', nextSyncStatus: null, shouldWrite: false }).insertPayload, {}));
test('44 skip_no_calendar_time with null false is accepted', () => assert.deepEqual(withDecision({ outcome: 'skip_no_calendar_time', nextSyncStatus: null, shouldWrite: false }).insertPayload, {}));
test('45 unchanged with null true is rejected', () => rejects({ outcome: 'unchanged', nextSyncStatus: null, shouldWrite: true }));
test('46 skip_no_owner with pending false is rejected', () => rejects({ outcome: 'skip_no_owner', nextSyncStatus: 'pending', shouldWrite: false }));
test('47 primitive string decision is rejected', () => rejects('pending'));
test('48 array decision is rejected', () => rejects([]));
test('49 number decision is rejected', () => rejects(1));
test('50 pending delete null false is rejected', () => rejects({ outcome: 'pending_delete', nextSyncStatus: null, shouldWrite: false }));
test('51 skip_imported null true is rejected', () => rejects({ outcome: 'skip_imported', nextSyncStatus: null, shouldWrite: true }));
test('52 exact pending write is accepted', () => assert.deepEqual(withDecision({ outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true }).insertPayload, { google_calendar_sync_status: 'pending' }));
