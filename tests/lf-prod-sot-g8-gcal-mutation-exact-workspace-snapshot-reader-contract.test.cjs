const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const helperPath = path.join(root, 'src/server/google-calendar-mutation-snapshot.ts');
const source = fs.readFileSync(helperPath, 'utf8');

function loadHelper(selectImpl = async () => ({ query: '', data: [] })) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
    },
    fileName: helperPath,
    reportDiagnostics: true,
  });

  const diagnostics = compiled.diagnostics || [];
  assert.equal(diagnostics.length, 0, diagnostics.map((item) => item.messageText).join('\n'));

  const loaded = new Module(helperPath, module);
  loaded.filename = helperPath;
  loaded.paths = Module._nodeModulePaths(path.dirname(helperPath));
  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (request === './_supabase.js' && parent === loaded) {
      return { selectFirstAvailable: selectImpl };
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    loaded._compile(compiled.outputText, helperPath);
  } finally {
    Module._load = originalLoad;
  }

  return loaded.exports;
}

function baseRow(overrides = {}) {
  return {
    id: 'item-1',
    workspace_id: 'workspace-1',
    record_type: 'task',
    type: 'task',
    status: 'todo',
    show_in_calendar: true,
    start_at: null,
    scheduled_at: '2026-07-12T09:00:00Z',
    due_at: null,
    created_by_user_id: 'user-1',
    google_calendar_event_id: null,
    google_calendar_sync_status: 'synced',
    ...overrides,
  };
}

const helper = loadHelper();

test('empty workItemId is rejected', () => {
  assert.throws(
    () => helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: '', workspaceId: 'workspace-1' }),
    /GCAL_MUTATION_SNAPSHOT_WORK_ITEM_ID_REQUIRED/,
  );
});

test('whitespace workItemId is rejected', () => {
  assert.throws(
    () => helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: '   ', workspaceId: 'workspace-1' }),
    /GCAL_MUTATION_SNAPSHOT_WORK_ITEM_ID_REQUIRED/,
  );
});

test('empty workspaceId is rejected', () => {
  assert.throws(
    () => helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: 'item-1', workspaceId: '' }),
    /GCAL_MUTATION_SNAPSHOT_WORKSPACE_ID_REQUIRED/,
  );
});

test('whitespace workspaceId is rejected', () => {
  assert.throws(
    () => helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: 'item-1', workspaceId: '   ' }),
    /GCAL_MUTATION_SNAPSHOT_WORKSPACE_ID_REQUIRED/,
  );
});

test('query uses the exact explicit select fields', () => {
  assert.equal(
    helper.GOOGLE_CALENDAR_MUTATION_SNAPSHOT_SELECT,
    'id,workspace_id,record_type,type,status,show_in_calendar,start_at,scheduled_at,due_at,created_by_user_id,google_calendar_event_id,google_calendar_sync_status',
  );
});

test('query contains id filter', () => {
  const query = helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: 'item-1', workspaceId: 'workspace-1' });
  assert.match(query, /[?&]id=eq\.item-1(?:&|$)/);
});

test('query contains workspace filter', () => {
  const query = helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: 'item-1', workspaceId: 'workspace-1' });
  assert.match(query, /[?&]workspace_id=eq\.workspace-1(?:&|$)/);
});

test('query contains limit one', () => {
  const query = helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: 'item-1', workspaceId: 'workspace-1' });
  assert.match(query, /[?&]limit=1$/);
});

test('query never uses select star', () => {
  const query = helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: 'item-1', workspaceId: 'workspace-1' });
  assert.equal(query.includes('select=*'), false);
});

test('query excludes source origin columns', () => {
  const query = helper.buildGoogleCalendarMutationSnapshotQuery({ workItemId: 'item-1', workspaceId: 'workspace-1' });
  assert.equal(query.includes('source_provider'), false);
  assert.equal(query.includes('source_external_id'), false);
  assert.equal(query.includes('google_calendar_user_id'), false);
});

test('identifiers are encoded with encodeURIComponent semantics', () => {
  const query = helper.buildGoogleCalendarMutationSnapshotQuery({
    workItemId: 'item /?#&=ą',
    workspaceId: 'workspace /?#&=ę',
  });
  assert.ok(query.includes('id=eq.' + encodeURIComponent('item /?#&=ą')));
  assert.ok(query.includes('workspace_id=eq.' + encodeURIComponent('workspace /?#&=ę')));
});

test('reader passes exactly one query to selector', async () => {
  let received = null;
  const local = loadHelper(async (queries) => {
    received = queries;
    return { query: queries[0], data: [] };
  });
  await local.readGoogleCalendarMutationSnapshotWithSelect(
    { workItemId: 'item-1', workspaceId: 'workspace-1' },
    async (queries) => {
      received = queries;
      return { query: queries[0], data: [] };
    },
  );
  assert.deepEqual(received.length, 1);
});

test('valid row returns found true and normalized snapshot', async () => {
  const result = await helper.readGoogleCalendarMutationSnapshotWithSelect(
    { workItemId: 'item-1', workspaceId: 'workspace-1' },
    async (queries) => ({ query: queries[0], data: [baseRow()] }),
  );
  assert.equal(result.found, true);
  assert.equal(result.snapshot.id, 'item-1');
  assert.equal(result.snapshot.workspaceId, 'workspace-1');
});

test('empty array returns found false', async () => {
  const result = await helper.readGoogleCalendarMutationSnapshotWithSelect(
    { workItemId: 'item-1', workspaceId: 'workspace-1' },
    async (queries) => ({ query: queries[0], data: [] }),
  );
  assert.deepEqual(result, { found: false, snapshot: null });
});

test('selector read error is propagated unchanged', async () => {
  const expected = new Error('SUPABASE_READ_FAILED');
  await assert.rejects(
    helper.readGoogleCalendarMutationSnapshotWithSelect(
      { workItemId: 'item-1', workspaceId: 'workspace-1' },
      async () => { throw expected; },
    ),
    (error) => error === expected,
  );
});

test('null response is rejected', async () => {
  await assert.rejects(
    helper.readGoogleCalendarMutationSnapshotWithSelect(
      { workItemId: 'item-1', workspaceId: 'workspace-1' },
      async () => null,
    ),
    /GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE/,
  );
});

test('non-array data response is rejected', async () => {
  await assert.rejects(
    helper.readGoogleCalendarMutationSnapshotWithSelect(
      { workItemId: 'item-1', workspaceId: 'workspace-1' },
      async () => ({ query: 'x', data: {} }),
    ),
    /GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE/,
  );
});

test('mismatched id is rejected', async () => {
  await assert.rejects(
    helper.readGoogleCalendarMutationSnapshotWithSelect(
      { workItemId: 'item-1', workspaceId: 'workspace-1' },
      async (queries) => ({ query: queries[0], data: [baseRow({ id: 'item-2' })] }),
    ),
    /GCAL_MUTATION_SNAPSHOT_ID_MISMATCH/,
  );
});

test('mismatched workspace is rejected', async () => {
  await assert.rejects(
    helper.readGoogleCalendarMutationSnapshotWithSelect(
      { workItemId: 'item-1', workspaceId: 'workspace-1' },
      async (queries) => ({ query: queries[0], data: [baseRow({ workspace_id: 'workspace-2' })] }),
    ),
    /GCAL_MUTATION_SNAPSHOT_WORKSPACE_MISMATCH/,
  );
});

test('start_at produces calendar time', () => {
  const snapshot = helper.normalizeGoogleCalendarMutationSnapshot(baseRow({ start_at: '2026-07-12T08:00:00Z', scheduled_at: null }));
  assert.equal(snapshot.hasCalendarTime, true);
});

test('scheduled_at produces calendar time', () => {
  const snapshot = helper.normalizeGoogleCalendarMutationSnapshot(baseRow({ start_at: null, scheduled_at: '2026-07-12T08:00:00Z' }));
  assert.equal(snapshot.hasCalendarTime, true);
});

test('due_at produces calendar time', () => {
  const snapshot = helper.normalizeGoogleCalendarMutationSnapshot(baseRow({ start_at: null, scheduled_at: null, due_at: '2026-07-12T08:00:00Z' }));
  assert.equal(snapshot.hasCalendarTime, true);
});

test('absence of all three calendar fields produces false', () => {
  const snapshot = helper.normalizeGoogleCalendarMutationSnapshot(baseRow({ start_at: null, scheduled_at: '   ', due_at: null }));
  assert.equal(snapshot.hasCalendarTime, false);
});

test('snapshot contains every G7 decision field', () => {
  const snapshot = helper.normalizeGoogleCalendarMutationSnapshot(baseRow());
  for (const key of [
    'recordType',
    'type',
    'status',
    'showInCalendar',
    'hasCalendarTime',
    'createdByUserId',
    'googleCalendarEventId',
    'currentGoogleSyncStatus',
  ]) {
    assert.equal(Object.prototype.hasOwnProperty.call(snapshot, key), true, key);
  }
});

test('two identical normalization calls are deeply identical', () => {
  const row = baseRow();
  assert.deepEqual(
    helper.normalizeGoogleCalendarMutationSnapshot(row),
    helper.normalizeGoogleCalendarMutationSnapshot(row),
  );
});

test('helper contains no writes, Google API, environment access or unscoped fallback', () => {
  for (const token of [
    'updateById',
    'updateByIdScoped',
    'updateByWorkspaceAndId',
    'insertWithVariants',
    'supabaseRequest',
    'createGoogleCalendarEvent',
    'updateGoogleCalendarEvent',
    'deleteGoogleCalendarEvent',
    'fetch(',
    'process.env',
    'console.',
    '.catch(',
    'select=*',
    'source_provider',
    'source_external_id',
  ]) {
    assert.equal(source.includes(token), false, token);
  }
  assert.match(source, /selectFirstAvailable/);
  assert.match(source, /select\(\[query\]\)/);
});
