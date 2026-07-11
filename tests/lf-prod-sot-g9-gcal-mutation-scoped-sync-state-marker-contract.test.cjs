const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const markerPath = path.join(root, 'src/server/google-calendar-mutation-sync-state-marker.ts');
const source = fs.readFileSync(markerPath, 'utf8');

function loadMarker(production = {}) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
    },
    fileName: markerPath,
    reportDiagnostics: true,
  });

  const diagnostics = compiled.diagnostics || [];
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((item) => String(item.messageText)).join('\n'),
  );

  const loaded = new Module(markerPath, module);
  loaded.filename = markerPath;
  loaded.paths = Module._nodeModulePaths(path.dirname(markerPath));

  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (parent === loaded && request === './_supabase.js') {
      return {
        updateByIdScoped: production.updateByIdScoped || (async () => []),
      };
    }

    if (parent === loaded && request === './google-calendar-mutation-snapshot.js') {
      return {
        readGoogleCalendarMutationSnapshot:
          production.readGoogleCalendarMutationSnapshot
          || (async () => ({ found: false, snapshot: null })),
      };
    }

    if (
      parent === loaded
      && request === '../lib/google-calendar-mutation-sync-state-decision.js'
    ) {
      return {
        decideGoogleCalendarMutationSyncState:
          production.decideGoogleCalendarMutationSyncState
          || (() => ({
            outcome: 'unchanged',
            nextSyncStatus: null,
            shouldWrite: false,
          })),
      };
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    loaded._compile(compiled.outputText, markerPath);
  } finally {
    Module._load = originalLoad;
  }

  return loaded.exports;
}

function baseSnapshot(overrides = {}) {
  return {
    id: 'item-1',
    workspaceId: 'workspace-1',
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

function decision(overrides = {}) {
  return {
    outcome: 'pending',
    nextSyncStatus: 'pending',
    shouldWrite: true,
    ...overrides,
  };
}

function confirmedRow(overrides = {}) {
  return [{
    id: 'item-1',
    workspace_id: 'workspace-1',
    google_calendar_sync_status: 'pending',
    ...overrides,
  }];
}

function createHarness(options = {}) {
  const calls = {
    reads: [],
    decisions: [],
    writes: [],
  };

  const deps = {
    readSnapshot: options.readSnapshot || (async (input) => {
      calls.reads.push(input);
      return options.readResult || found();
    }),
    decide: options.decide || ((input) => {
      calls.decisions.push(input);
      return options.decisionResult || decision();
    }),
    updateScoped: options.updateScoped || (async (table, id, workspaceId, payload) => {
      calls.writes.push({ table, id, workspaceId, payload });
      if (Object.prototype.hasOwnProperty.call(options, 'writeResult')) {
        return options.writeResult;
      }
      return confirmedRow({
        id,
        workspace_id: workspaceId,
        google_calendar_sync_status: payload.google_calendar_sync_status,
      });
    }),
  };

  return { calls, deps };
}

const marker = loadMarker();
const validInput = {
  mutationKind: 'update',
  workItemId: 'item-1',
  workspaceId: 'workspace-1',
};

test('empty workItemId is rejected', async () => {
  const { deps } = createHarness();
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(
      { ...validInput, workItemId: '' },
      deps,
    ),
    /GCAL_MUTATION_SYNC_STATE_MARKER_WORK_ITEM_ID_REQUIRED/,
  );
});

test('whitespace workItemId is rejected', async () => {
  const { deps } = createHarness();
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(
      { ...validInput, workItemId: '   ' },
      deps,
    ),
    /GCAL_MUTATION_SYNC_STATE_MARKER_WORK_ITEM_ID_REQUIRED/,
  );
});

test('empty workspaceId is rejected', async () => {
  const { deps } = createHarness();
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(
      { ...validInput, workspaceId: '' },
      deps,
    ),
    /GCAL_MUTATION_SYNC_STATE_MARKER_WORKSPACE_ID_REQUIRED/,
  );
});

test('whitespace workspaceId is rejected', async () => {
  const { deps } = createHarness();
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(
      { ...validInput, workspaceId: '   ' },
      deps,
    ),
    /GCAL_MUTATION_SYNC_STATE_MARKER_WORKSPACE_ID_REQUIRED/,
  );
});

test('invalid identifiers stop before reader and writer', async () => {
  const { calls, deps } = createHarness();
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(
      { ...validInput, workItemId: ' ' },
      deps,
    ),
  );
  assert.equal(calls.reads.length, 0);
  assert.equal(calls.decisions.length, 0);
  assert.equal(calls.writes.length, 0);
});

test('reader receives exact trimmed identifiers', async () => {
  const { calls, deps } = createHarness({ readResult: { found: false, snapshot: null } });
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(
    {
      mutationKind: 'update',
      workItemId: '  item-1  ',
      workspaceId: '  workspace-1  ',
    },
    deps,
  );
  assert.deepEqual(calls.reads[0], {
    workItemId: 'item-1',
    workspaceId: 'workspace-1',
  });
});

test('reader is called exactly once', async () => {
  const { calls, deps } = createHarness({ readResult: { found: false, snapshot: null } });
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.equal(calls.reads.length, 1);
});

test('found false returns snapshot_not_found', async () => {
  const { deps } = createHarness({ readResult: { found: false, snapshot: null } });
  const result = await marker.markGoogleCalendarMutationSyncStateWithDependencies(
    validInput,
    deps,
  );
  assert.deepEqual(result, {
    resultKind: 'snapshot_not_found',
    snapshotFound: false,
    decision: null,
    nextSyncStatus: null,
    writeAttempted: false,
    writeConfirmed: false,
  });
});

test('found false does not call decision', async () => {
  const { calls, deps } = createHarness({ readResult: { found: false, snapshot: null } });
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.equal(calls.decisions.length, 0);
});

test('found false does not write', async () => {
  const { calls, deps } = createHarness({ readResult: { found: false, snapshot: null } });
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.equal(calls.writes.length, 0);
});

test('all snapshot fields are passed to G7', async () => {
  const snapshot = baseSnapshot({
    recordType: 'event',
    type: 'meeting',
    status: 'scheduled',
    showInCalendar: false,
    hasCalendarTime: false,
    createdByUserId: 'user-7',
    googleCalendarEventId: 'gcal-7',
    currentGoogleSyncStatus: 'synced',
  });
  const { calls, deps } = createHarness({
    readResult: found(snapshot),
    decisionResult: decision({
      outcome: 'unchanged',
      nextSyncStatus: null,
      shouldWrite: false,
    }),
  });

  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);

  assert.deepEqual(calls.decisions[0], {
    mutationKind: 'update',
    recordType: 'event',
    type: 'meeting',
    status: 'scheduled',
    showInCalendar: false,
    hasCalendarTime: false,
    createdByUserId: 'user-7',
    googleCalendarEventId: 'gcal-7',
    currentGoogleSyncStatus: 'synced',
  });
});

test('mutationKind is passed to G7 unchanged', async () => {
  const { calls, deps } = createHarness({
    decisionResult: decision({
      outcome: 'unchanged',
      nextSyncStatus: null,
      shouldWrite: false,
    }),
  });
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(
    { ...validInput, mutationKind: 'CUSTOM_DELETE_ALIAS' },
    deps,
  );
  assert.equal(calls.decisions[0].mutationKind, 'CUSTOM_DELETE_ALIAS');
});

for (const outcome of [
  'skip_imported',
  'skip_no_owner',
  'skip_no_calendar_time',
  'unchanged',
]) {
  test(outcome + ' does not write status', async () => {
    const { calls, deps } = createHarness({
      decisionResult: decision({
        outcome,
        nextSyncStatus: null,
        shouldWrite: false,
      }),
    });
    const result = await marker.markGoogleCalendarMutationSyncStateWithDependencies(
      validInput,
      deps,
    );
    assert.equal(result.resultKind, 'decision_no_write');
    assert.equal(result.nextSyncStatus, null);
    assert.equal(calls.writes.length, 0);
  });
}

test('already pending decision does not write again', async () => {
  const { calls, deps } = createHarness({
    decisionResult: decision({
      outcome: 'pending',
      nextSyncStatus: 'pending',
      shouldWrite: false,
    }),
  });
  const result = await marker.markGoogleCalendarMutationSyncStateWithDependencies(
    validInput,
    deps,
  );
  assert.equal(result.resultKind, 'decision_no_write');
  assert.equal(result.nextSyncStatus, 'pending');
  assert.equal(calls.writes.length, 0);
});

test('already pending_delete decision does not write again', async () => {
  const { calls, deps } = createHarness({
    decisionResult: decision({
      outcome: 'pending_delete',
      nextSyncStatus: 'pending_delete',
      shouldWrite: false,
    }),
  });
  const result = await marker.markGoogleCalendarMutationSyncStateWithDependencies(
    validInput,
    deps,
  );
  assert.equal(result.resultKind, 'decision_no_write');
  assert.equal(result.nextSyncStatus, 'pending_delete');
  assert.equal(calls.writes.length, 0);
});

test('shouldWrite true with null status does not write', async () => {
  const { calls, deps } = createHarness({
    decisionResult: decision({
      outcome: 'unchanged',
      nextSyncStatus: null,
      shouldWrite: true,
    }),
  });
  const result = await marker.markGoogleCalendarMutationSyncStateWithDependencies(
    validInput,
    deps,
  );
  assert.equal(result.resultKind, 'decision_no_write');
  assert.equal(calls.writes.length, 0);
});

test('pending decision performs one write', async () => {
  const { calls, deps } = createHarness();
  const result = await marker.markGoogleCalendarMutationSyncStateWithDependencies(
    validInput,
    deps,
  );
  assert.equal(calls.writes.length, 1);
  assert.equal(result.resultKind, 'status_written');
  assert.equal(result.nextSyncStatus, 'pending');
  assert.equal(result.writeAttempted, true);
  assert.equal(result.writeConfirmed, true);
});

test('pending_delete decision performs one write', async () => {
  const { calls, deps } = createHarness({
    decisionResult: decision({
      outcome: 'pending_delete',
      nextSyncStatus: 'pending_delete',
      shouldWrite: true,
    }),
    writeResult: confirmedRow({
      google_calendar_sync_status: 'pending_delete',
    }),
  });
  const result = await marker.markGoogleCalendarMutationSyncStateWithDependencies(
    { ...validInput, mutationKind: 'delete' },
    deps,
  );
  assert.equal(calls.writes.length, 1);
  assert.equal(result.nextSyncStatus, 'pending_delete');
});

test('write uses work_items table', async () => {
  const { calls, deps } = createHarness();
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.equal(calls.writes[0].table, 'work_items');
});

test('write uses exact workItemId', async () => {
  const { calls, deps } = createHarness();
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.equal(calls.writes[0].id, 'item-1');
});

test('write uses exact workspaceId', async () => {
  const { calls, deps } = createHarness();
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.equal(calls.writes[0].workspaceId, 'workspace-1');
});

test('payload contains exactly one field', async () => {
  const { calls, deps } = createHarness();
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.deepEqual(Object.keys(calls.writes[0].payload), [
    'google_calendar_sync_status',
  ]);
});

test('payload contains no updated_at', async () => {
  const { calls, deps } = createHarness();
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.equal('updated_at' in calls.writes[0].payload, false);
});

test('payload contains no source_provider', async () => {
  const { calls, deps } = createHarness();
  await marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps);
  assert.equal('source_provider' in calls.writes[0].payload, false);
});

test('reader error is propagated unchanged', async () => {
  const expected = new Error('READ_FAILED');
  const { deps } = createHarness({
    readSnapshot: async () => { throw expected; },
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    (error) => error === expected,
  );
});

test('decision error is propagated unchanged', async () => {
  const expected = new Error('DECISION_FAILED');
  const { deps } = createHarness({
    decide: () => { throw expected; },
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    (error) => error === expected,
  );
});

test('write error is propagated unchanged', async () => {
  const expected = new Error('WRITE_FAILED');
  const { deps } = createHarness({
    updateScoped: async () => { throw expected; },
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    (error) => error === expected,
  );
});

test('null write response is rejected', async () => {
  const { deps } = createHarness({ writeResult: null });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_WRITE_RESPONSE/,
  );
});

test('undefined write response is rejected', async () => {
  const { deps } = createHarness({
    updateScoped: async () => undefined,
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_WRITE_RESPONSE/,
  );
});

test('object write response is rejected', async () => {
  const { deps } = createHarness({ writeResult: { id: 'item-1' } });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_WRITE_RESPONSE/,
  );
});

test('empty array write response is rejected', async () => {
  const { deps } = createHarness({
    updateScoped: async () => [],
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED/,
  );
});

test('multiple updated rows are rejected', async () => {
  const row = confirmedRow()[0];
  const { deps } = createHarness({
    writeResult: [row, row],
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_MULTIPLE_ROWS_UPDATED/,
  );
});

test('non-object updated row is rejected', async () => {
  const { deps } = createHarness({ writeResult: ['bad-row'] });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_UPDATED_ROW/,
  );
});

test('array updated row is rejected', async () => {
  const { deps } = createHarness({ writeResult: [[]] });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_UPDATED_ROW/,
  );
});

test('mismatched returned id is rejected', async () => {
  const { deps } = createHarness({
    writeResult: confirmedRow({ id: 'item-2' }),
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_ID_MISMATCH/,
  );
});

test('mismatched returned workspace is rejected', async () => {
  const { deps } = createHarness({
    writeResult: confirmedRow({ workspace_id: 'workspace-2' }),
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_WORKSPACE_MISMATCH/,
  );
});

test('mismatched returned status is rejected', async () => {
  const { deps } = createHarness({
    writeResult: confirmedRow({ google_calendar_sync_status: 'synced' }),
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_STATUS_MISMATCH/,
  );
});

test('unsupported decision status is rejected before write', async () => {
  const { calls, deps } = createHarness({
    decisionResult: {
      outcome: 'pending',
      nextSyncStatus: 'failed',
      shouldWrite: true,
    },
  });
  await assert.rejects(
    marker.markGoogleCalendarMutationSyncStateWithDependencies(validInput, deps),
    /GCAL_MUTATION_SYNC_STATE_MARKER_UNSUPPORTED_STATUS/,
  );
  assert.equal(calls.writes.length, 0);
});

test('production wrapper uses G8 reader', async () => {
  let reads = 0;
  const productionMarker = loadMarker({
    readGoogleCalendarMutationSnapshot: async () => {
      reads += 1;
      return { found: false, snapshot: null };
    },
  });
  await productionMarker.markGoogleCalendarMutationSyncState(validInput);
  assert.equal(reads, 1);
});

test('production wrapper uses G7 facade', async () => {
  let decisions = 0;
  const productionMarker = loadMarker({
    readGoogleCalendarMutationSnapshot: async () => found(),
    decideGoogleCalendarMutationSyncState: () => {
      decisions += 1;
      return {
        outcome: 'unchanged',
        nextSyncStatus: null,
        shouldWrite: false,
      };
    },
  });
  await productionMarker.markGoogleCalendarMutationSyncState(validInput);
  assert.equal(decisions, 1);
});

test('production wrapper uses updateByIdScoped', async () => {
  let writes = 0;
  const productionMarker = loadMarker({
    readGoogleCalendarMutationSnapshot: async () => found(),
    decideGoogleCalendarMutationSyncState: () => decision(),
    updateByIdScoped: async (table, id, workspaceId, payload) => {
      writes += 1;
      return [{
        id,
        workspace_id: workspaceId,
        google_calendar_sync_status: payload.google_calendar_sync_status,
      }];
    },
  });
  const result = await productionMarker.markGoogleCalendarMutationSyncState(validInput);
  assert.equal(writes, 1);
  assert.equal(result.resultKind, 'status_written');
});

test('source contains no unscoped update call', () => {
  assert.equal(/\bupdateById\s*\(/.test(source), false);
  assert.equal(/\bupdateByWorkspaceAndId\s*\(/.test(source), false);
  assert.equal(/\bsupabaseRequest\s*\(/.test(source), false);
});

test('source contains no Google API or fetch call', () => {
  for (const token of [
    'createGoogleCalendarEvent',
    'updateGoogleCalendarEvent',
    'deleteGoogleCalendarEvent',
    'fetch(',
  ]) {
    assert.equal(source.includes(token), false, token);
  }
});

test('source contains no source origin field or catch', () => {
  for (const token of [
    'source_provider',
    'source_external_id',
    '.catch(',
  ]) {
    assert.equal(source.includes(token), false, token);
  }
});

test('source contains no environment, console or clock access', () => {
  for (const token of [
    'process.env',
    'console.',
    'Date(',
    'new Date',
  ]) {
    assert.equal(source.includes(token), false, token);
  }
});

test('source imports only the required production dependencies', () => {
  assert.match(source, /readGoogleCalendarMutationSnapshot/);
  assert.match(source, /decideGoogleCalendarMutationSyncState/);
  assert.match(source, /updateByIdScoped/);
});
