const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const markerPath = path.join(root, 'src/server/google-calendar-mutation-sync-state-marker.ts');
const decisionPath = path.join(root, 'src/lib/google-calendar-mutation-sync-state-decision.ts');
const markerSource = fs.readFileSync(markerPath, 'utf8');
const decisionSource = fs.readFileSync(decisionPath, 'utf8');

function transpile(source, fileName) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
    },
    fileName,
    reportDiagnostics: true,
  });
  const diagnostics = compiled.diagnostics || [];
  assert.equal(diagnostics.length, 0, diagnostics.map((item) => String(item.messageText)).join('\n'));
  return compiled.outputText;
}

function compileStandalone(source, fileName) {
  const loaded = new Module(fileName, module);
  loaded.filename = fileName;
  loaded.paths = Module._nodeModulePaths(path.dirname(fileName));
  loaded._compile(transpile(source, fileName), fileName);
  return loaded.exports;
}

const realDecisionModule = compileStandalone(decisionSource, decisionPath);
const realDecide = realDecisionModule.decideGoogleCalendarMutationSyncState;

function loadMarker(production = {}) {
  const loaded = new Module(markerPath, module);
  loaded.filename = markerPath;
  loaded.paths = Module._nodeModulePaths(path.dirname(markerPath));
  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (parent === loaded && request === './_supabase.js') {
      return { updateByIdScoped: production.updateByIdScoped || (async () => []) };
    }
    if (parent === loaded && request === './google-calendar-mutation-snapshot.js') {
      return {
        readGoogleCalendarMutationSnapshot:
          production.readGoogleCalendarMutationSnapshot
          || (async () => ({ found: false, snapshot: null })),
      };
    }
    if (parent === loaded && request === '../lib/google-calendar-mutation-sync-state-decision.js') {
      return { decideGoogleCalendarMutationSyncState: production.decideGoogleCalendarMutationSyncState || realDecide };
    }
    return originalLoad.call(this, request, parent, isMain);
  };
  try {
    loaded._compile(transpile(markerSource, markerPath), markerPath);
  } finally {
    Module._load = originalLoad;
  }
  return loaded.exports;
}

function baseSnapshot(overrides = {}) {
  return {
    id: 'snapshot-item',
    workspaceId: 'snapshot-workspace',
    recordType: 'task',
    type: 'task',
    status: 'todo',
    showInCalendar: true,
    hasCalendarTime: true,
    createdByUserId: 'user-1',
    googleCalendarEventId: null,
    currentGoogleSyncStatus: 'synced',
    ...overrides,
  };
}

function found(snapshot = baseSnapshot()) {
  return { found: true, snapshot };
}

function confirmedRow(status = 'pending', overrides = {}) {
  return [{
    id: 'snapshot-item',
    workspace_id: 'snapshot-workspace',
    google_calendar_sync_status: status,
    ...overrides,
  }];
}

function createHarness(options = {}) {
  const calls = { reads: [], decisions: [], writes: [] };
  const readSnapshot = options.readSnapshot || (async (input) => {
    calls.reads.push(input);
    return Object.prototype.hasOwnProperty.call(options, 'readResult')
      ? options.readResult
      : found();
  });
  const decide = options.decide || ((input) => {
    calls.decisions.push(input);
    return realDecide(input);
  });
  const updateScoped = options.updateScoped || (async (table, id, workspaceId, payload) => {
    calls.writes.push({ table, id, workspaceId, payload });
    if (Object.prototype.hasOwnProperty.call(options, 'writeResult')) return options.writeResult;
    return [{ id, workspace_id: workspaceId, google_calendar_sync_status: payload.google_calendar_sync_status }];
  });
  return { calls, deps: { readSnapshot, decide, updateScoped } };
}

const marker = loadMarker();
const validInput = { mutationKind: 'update', workItemId: 'input-item', workspaceId: 'input-workspace' };

async function run(options = {}, input = validInput) {
  const harness = createHarness(options);
  const result = await marker.markGoogleCalendarMutationSyncStateWithDependencies(input, harness.deps);
  return { ...harness, result };
}

test('1 empty workItemId is rejected', async () => {
  const { deps } = createHarness();
  await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies({ ...validInput, workItemId: '' }, deps), /WORK_ITEM_ID_REQUIRED/);
});
test('2 whitespace workItemId is rejected', async () => {
  const { deps } = createHarness();
  await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies({ ...validInput, workItemId: '  ' }, deps), /WORK_ITEM_ID_REQUIRED/);
});
test('3 empty workspaceId is rejected', async () => {
  const { deps } = createHarness();
  await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies({ ...validInput, workspaceId: '' }, deps), /WORKSPACE_ID_REQUIRED/);
});
test('4 whitespace workspaceId is rejected', async () => {
  const { deps } = createHarness();
  await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies({ ...validInput, workspaceId: '  ' }, deps), /WORKSPACE_ID_REQUIRED/);
});
test('5 reader receives exact trimmed identifiers', async () => {
  const { calls } = await run({ readResult: { found: false, snapshot: null } }, { mutationKind: 'update', workItemId: ' input-item ', workspaceId: ' input-workspace ' });
  assert.deepEqual(calls.reads[0], { workItemId: 'input-item', workspaceId: 'input-workspace' });
});
test('6 reader is called exactly once', async () => {
  const { calls } = await run({ readResult: { found: false, snapshot: null } });
  assert.equal(calls.reads.length, 1);
});
test('7 reader error is propagated as same object', async () => {
  const expected = new Error('READ_FAILED');
  const { deps } = createHarness({ readSnapshot: async () => { throw expected; } });
  await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), (error) => error === expected);
});
test('8 found false returns explicit result', async () => {
  const { result } = await run({ readResult: { found: false, snapshot: null } });
  assert.deepEqual(result, { found: false, wrote: false, decision: null, confirmation: null });
});
test('9 found false does not call G7', async () => {
  const { calls } = await run({ readResult: { found: false, snapshot: null } });
  assert.equal(calls.decisions.length, 0);
});
test('10 found false does not call writer', async () => {
  const { calls } = await run({ readResult: { found: false, snapshot: null } });
  assert.equal(calls.writes.length, 0);
});
test('11 found snapshot calls G7 exactly once', async () => {
  const { calls } = await run();
  assert.equal(calls.decisions.length, 1);
});
test('12 mutationKind is mapped exactly', async () => {
  const { calls } = await run({}, { ...validInput, mutationKind: 'create' });
  assert.equal(calls.decisions[0].mutationKind, 'create');
});
test('13 all snapshot decision fields are mapped', async () => {
  const snapshot = baseSnapshot({ recordType: 'event', type: 'meeting', status: 'scheduled', showInCalendar: false, hasCalendarTime: false, createdByUserId: 'u7', googleCalendarEventId: 'g7', currentGoogleSyncStatus: 'synced' });
  const { calls } = await run({ readResult: found(snapshot) });
  assert.deepEqual(calls.decisions[0], { mutationKind: 'update', recordType: 'event', type: 'meeting', status: 'scheduled', showInCalendar: false, hasCalendarTime: false, createdByUserId: 'u7', googleCalendarEventId: 'g7', currentGoogleSyncStatus: 'synced' });
});
test('14 G7 input excludes identity and origin fields', async () => {
  const { calls } = await run();
  assert.deepEqual(Object.keys(calls.decisions[0]).sort(), ['createdByUserId','currentGoogleSyncStatus','googleCalendarEventId','hasCalendarTime','mutationKind','recordType','showInCalendar','status','type'].sort());
});
test('15 skip_imported does not write', async () => {
  const { calls, result } = await run({ readResult: found(baseSnapshot({ type: 'external_google_event' })) });
  assert.equal(result.decision.outcome, 'skip_imported'); assert.equal(result.wrote, false); assert.equal(calls.writes.length, 0);
});
test('16 skip_no_owner does not write', async () => {
  const { calls, result } = await run({ readResult: found(baseSnapshot({ createdByUserId: null })) });
  assert.equal(result.decision.outcome, 'skip_no_owner'); assert.equal(calls.writes.length, 0);
});
test('17 skip_no_calendar_time does not write', async () => {
  const { calls, result } = await run({ readResult: found(baseSnapshot({ hasCalendarTime: false })) });
  assert.equal(result.decision.outcome, 'skip_no_calendar_time'); assert.equal(calls.writes.length, 0);
});
test('18 unsupported record is unchanged and does not write', async () => {
  const { calls, result } = await run({ readResult: found(baseSnapshot({ recordType: 'note' })) });
  assert.equal(result.decision.outcome, 'unchanged'); assert.equal(calls.writes.length, 0);
});
test('19 delete without Google event id does not write', async () => {
  const { calls, result } = await run({}, { ...validInput, mutationKind: 'delete' });
  assert.equal(result.wrote, false); assert.equal(calls.writes.length, 0);
});
test('20 existing pending does not write again', async () => {
  const { calls, result } = await run({ readResult: found(baseSnapshot({ currentGoogleSyncStatus: 'pending' })) });
  assert.equal(result.decision.shouldWrite, false); assert.equal(calls.writes.length, 0);
});
test('21 existing pending_delete does not write again', async () => {
  const snapshot = baseSnapshot({ googleCalendarEventId: 'g1', showInCalendar: false, currentGoogleSyncStatus: 'pending_delete' });
  const { calls, result } = await run({ readResult: found(snapshot) });
  assert.equal(result.decision.shouldWrite, false); assert.equal(calls.writes.length, 0);
});
test('22 pending performs exactly one write', async () => {
  const { calls, result } = await run(); assert.equal(calls.writes.length, 1); assert.equal(result.wrote, true);
});
test('23 pending_delete performs exactly one write', async () => {
  const snapshot = baseSnapshot({ googleCalendarEventId: 'g1', showInCalendar: false });
  const { calls, result } = await run({ readResult: found(snapshot) }); assert.equal(calls.writes.length, 1); assert.equal(result.decision.nextSyncStatus, 'pending_delete');
});
test('24 writer uses work_items table', async () => {
  const { calls } = await run(); assert.equal(calls.writes[0].table, 'work_items');
});
test('25 writer uses snapshot id', async () => {
  const { calls } = await run(); assert.equal(calls.writes[0].id, 'snapshot-item'); assert.notEqual(calls.writes[0].id, validInput.workItemId);
});
test('26 writer uses snapshot workspaceId', async () => {
  const { calls } = await run(); assert.equal(calls.writes[0].workspaceId, 'snapshot-workspace'); assert.notEqual(calls.writes[0].workspaceId, validInput.workspaceId);
});
test('27 payload contains exactly one property', async () => {
  const { calls } = await run(); assert.deepEqual(Object.keys(calls.writes[0].payload), ['google_calendar_sync_status']);
});
test('28 pending payload has exact value', async () => {
  const { calls } = await run(); assert.equal(calls.writes[0].payload.google_calendar_sync_status, 'pending');
});
test('29 pending_delete payload has exact value', async () => {
  const snapshot = baseSnapshot({ googleCalendarEventId: 'g1', showInCalendar: false });
  const { calls } = await run({ readResult: found(snapshot) }); assert.equal(calls.writes[0].payload.google_calendar_sync_status, 'pending_delete');
});
test('30 payload excludes updated_at', async () => {
  const { calls } = await run(); assert.equal('updated_at' in calls.writes[0].payload, false);
});
test('31 shouldWrite true with null status throws invalid decision', async () => {
  const { calls, deps } = createHarness({ decide: (input) => { calls.decisions.push(input); return { outcome: 'unchanged', nextSyncStatus: null, shouldWrite: true }; } });
  await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_DECISION/);
  assert.equal(calls.writes.length, 0);
});
test('32 unsupported status throws invalid decision', async () => {
  const { calls, deps } = createHarness({ decide: (input) => { calls.decisions.push(input); return { outcome: 'pending', nextSyncStatus: 'failed', shouldWrite: true }; } });
  await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_DECISION/);
  assert.equal(calls.writes.length, 0);
});
test('33 writer error is propagated as same object', async () => {
  const expected = new Error('WRITE_FAILED'); const { deps } = createHarness({ updateScoped: async () => { throw expected; } });
  await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), (error) => error === expected);
});
test('34 null response is rejected', async () => {
  const { deps } = createHarness({ writeResult: null }); await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /WRITE_INVALID_RESPONSE/);
});
test('35 non-array response is rejected', async () => {
  const { deps } = createHarness({ writeResult: {} }); await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /WRITE_INVALID_RESPONSE/);
});
test('36 empty array is not confirmed', async () => {
  const { deps } = createHarness({ writeResult: [] }); await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /WRITE_NOT_CONFIRMED/);
});
test('37 multiple rows are not confirmed', async () => {
  const row = confirmedRow()[0]; const { deps } = createHarness({ writeResult: [row, row] }); await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /WRITE_NOT_CONFIRMED/);
});
test('38 non-object row is invalid response', async () => {
  const { deps } = createHarness({ writeResult: ['bad'] }); await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /WRITE_INVALID_RESPONSE/);
});
test('39 mismatched id is rejected', async () => {
  const { deps } = createHarness({ writeResult: confirmedRow('pending', { id: 'other' }) }); await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /WRITE_ID_MISMATCH/);
});
test('40 mismatched workspace is rejected', async () => {
  const { deps } = createHarness({ writeResult: confirmedRow('pending', { workspace_id: 'other' }) }); await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /WRITE_WORKSPACE_MISMATCH/);
});
test('41 mismatched status is rejected', async () => {
  const { deps } = createHarness({ writeResult: confirmedRow('synced') }); await assert.rejects(marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps), /WRITE_STATUS_MISMATCH/);
});
test('42 pending returns confirmed result', async () => {
  const { result } = await run(); assert.deepEqual(result.confirmation, { workItemId: 'snapshot-item', workspaceId: 'snapshot-workspace', googleCalendarSyncStatus: 'pending' });
});
test('43 pending_delete returns confirmed result', async () => {
  const snapshot = baseSnapshot({ googleCalendarEventId: 'g1', showInCalendar: false }); const { result } = await run({ readResult: found(snapshot) }); assert.equal(result.confirmation.googleCalendarSyncStatus, 'pending_delete');
});
test('44 production wrapper uses G8 reader', async () => {
  let reads = 0; const production = loadMarker({ readGoogleCalendarMutationSnapshot: async () => { reads += 1; return { found: false, snapshot: null }; } }); await production.markGoogleCalendarMutationSyncState(validInput); assert.equal(reads, 1);
});
test('45 production wrapper uses real G7 facade', async () => {
  let decisions = 0; const production = loadMarker({ readGoogleCalendarMutationSnapshot: async () => found(), decideGoogleCalendarMutationSyncState: (input) => { decisions += 1; return realDecide(input); }, updateByIdScoped: async (_t, id, workspaceId, payload) => [{ id, workspace_id: workspaceId, google_calendar_sync_status: payload.google_calendar_sync_status }] }); await production.markGoogleCalendarMutationSyncState(validInput); assert.equal(decisions, 1);
});
test('46 production wrapper uses updateByIdScoped', async () => {
  let writes = 0; const production = loadMarker({ readGoogleCalendarMutationSnapshot: async () => found(), updateByIdScoped: async (_t, id, workspaceId, payload) => { writes += 1; return [{ id, workspace_id: workspaceId, google_calendar_sync_status: payload.google_calendar_sync_status }]; } }); await production.markGoogleCalendarMutationSyncState(validInput); assert.equal(writes, 1);
});
test('47 source contains no forbidden runtime integrations', () => {
  for (const token of ['fetch(', 'process.env', 'console.', 'setTimeout', 'setInterval', 'createGoogleCalendarEvent', 'updateGoogleCalendarEvent', 'deleteGoogleCalendarEvent', '.catch(']) assert.equal(markerSource.includes(token), false, token);
});
test('48 real G7 create task yields pending', () => {
  const value = realDecide({ mutationKind: 'create', recordType: 'task', type: 'task', status: 'todo', showInCalendar: true, hasCalendarTime: true, createdByUserId: 'u1', googleCalendarEventId: null, currentGoogleSyncStatus: 'synced' }); assert.deepEqual(value, { outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true });
});
test('49 real G7 delete with event yields pending_delete', () => {
  const value = realDecide({ mutationKind: 'delete', recordType: 'event', type: 'event', status: 'scheduled', showInCalendar: true, hasCalendarTime: true, createdByUserId: 'u1', googleCalendarEventId: 'g1', currentGoogleSyncStatus: 'synced' }); assert.deepEqual(value, { outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true });
});
test('50 source exports all required contract types and functions', () => {
  for (const token of ['GoogleCalendarMutationSyncStateMarkerInput','GoogleCalendarMutationSyncStateMarkerDependencies','GoogleCalendarMutationSyncStateMarkerResult','GoogleCalendarMutationSyncStateWriteConfirmation','markGoogleCalendarMutationSyncStateWithDependencies','markGoogleCalendarMutationSyncState']) assert.equal(markerSource.includes(token), true, token);
});
