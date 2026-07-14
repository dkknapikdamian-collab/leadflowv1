const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const eventRoutePath = path.join(root, 'src/server/event-route-stage124f.ts');
const taskRoutePath = path.join(root, 'src/server/task-route-stage124f.ts');
const eventRouteSource = fs.readFileSync(eventRoutePath, 'utf8');
const taskRouteSource = fs.readFileSync(taskRoutePath, 'utf8');
// git show baseline verification protects G7-G10 and exact G11 route scope.
const APP_INPUT_HEAD_G11 = process.env.G11_BASE_COMMIT || '1036e10e6c2ca734d9a9b61c9eaa1315fcef1ad9';

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

function normalizeEventRows(rows) {
  return rows.map((row) => ({
    ...row,
    id: row.id,
    title: row.title,
    type: row.type || row.record_type || 'meeting',
    startAt: row.start_at || row.scheduled_at || '2026-07-12T10:00:00.000Z',
    endAt: row.end_at || '',
    status: row.status || 'scheduled',
    leadId: row.lead_id || undefined,
    caseId: row.case_id || undefined,
    clientId: row.client_id || undefined,
  }));
}

function markerResult(overrides = {}) {
  return {
    found: true,
    wrote: false,
    decision: {
      outcome: 'unchanged',
      nextSyncStatus: null,
      shouldWrite: false,
    },
    confirmation: null,
    ...overrides,
  };
}

function unexpectedDependency(name) {
  const error = new Error(`UNEXPECTED_TEST_DEPENDENCY_CALL:${name}`);
  error.code = 'UNEXPECTED_TEST_DEPENDENCY_CALL';
  throw error;
}

function loadEventRoute(options = {}) {
  const calls = [];
  const markerInputs = [];
  const selectQueue = [...(options.selectResults || [])];
  const insertQueue = [...(options.insertResults || [])];
  const loaded = new Module(eventRoutePath, module);
  loaded.filename = eventRoutePath;
  loaded.paths = Module._nodeModulePaths(path.dirname(eventRoutePath));
  const originalLoad = Module._load;

  const updateByIdScoped = async (table, id, workspaceId, payload) => {
    if (table === 'work_items') {
      calls.push('main-update');
      if (options.mainUpdateError) throw options.mainUpdateError;
      return options.mainUpdateResult || [{
        id,
        workspace_id: workspaceId,
        lead_id: options.body?.leadId || null,
        record_type: 'event',
        type: options.body?.type || 'meeting',
        title: options.body?.title || 'Updated event',
        status: options.body?.status || 'scheduled',
        start_at: options.body?.startAt || '2026-07-12T10:00:00.000Z',
        scheduled_at: options.body?.startAt || '2026-07-12T10:00:00.000Z',
        show_in_tasks: false,
        show_in_calendar: true,
      }];
    }
    if (table === 'leads') {
      calls.push('lead-side-effect');
      if (options.leadSideEffectError) throw options.leadSideEffectError;
      return [{ id, workspace_id: workspaceId, ...payload }];
    }
    return unexpectedDependency(`updateByIdScoped:${table}`);
  };

  const marker = async (input) => {
    calls.push('marker');
    markerInputs.push(input);
    if (options.markerError) throw options.markerError;
    return options.markerResult || markerResult();
  };

  Module._load = function(request, parent, isMain) {
    if (parent === loaded && request === './_supabase.js') {
      return {
        deleteByIdScoped: async () => unexpectedDependency('deleteByIdScoped'),
        insertWithVariants: async () => {
          calls.push('post-insert');
          if (!insertQueue.length) return unexpectedDependency('insertWithVariants');
          return insertQueue.shift();
        },
        selectFirstAvailable: async () => {
          calls.push('select');
          if (!selectQueue.length) return unexpectedDependency('selectFirstAvailable');
          return selectQueue.shift();
        },
        updateByIdScoped,
        updateById: async (table, id, payload) => {
          calls.push(`unscoped-update:${table}`);
          if (!options.allowUnscopedUpdate) return unexpectedDependency(`updateById:${table}`);
          return [{ id, ...payload }];
        },
      };
    }
    if (parent === loaded && request === './_request-scope.js') {
      return {
        requireRequestIdentity: async () => ({ userId: 'user-1' }),
        resolveRequestWorkspaceId: async () => options.workspaceId || 'workspace-1',
        withWorkspaceFilter: (query) => query,
      };
    }
    if (parent === loaded && request === '../lib/data-contract.js') {
      return { normalizeEventListContract: normalizeEventRows };
    }
    if (parent === loaded && request === '../lib/calendar-timezone-contract.js') {
      return {
        normalizeCloseFlowDateTimeToUtcIso: (value) => {
          if (value === null || value === undefined || value === '') return null;
          const text = String(value);
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) return `${text}:00.000Z`;
          return text;
        },
      };
    }
    if (parent === loaded && request === '../lib/google-calendar-create-sync-state-insert-payload.js') {
      return {
        buildGoogleCalendarCreateSyncStateInsertPayload: () => ({
          decision: {
            outcome: 'unchanged',
            nextSyncStatus: null,
            shouldWrite: false,
          },
          insertPayload: {},
        }),
      };
    }
    if (parent === loaded && request === './google-calendar-mutation-sync-state-marker.js') {
      return { markGoogleCalendarMutationSyncState: marker };
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    loaded._compile(transpile(eventRouteSource, eventRoutePath), eventRoutePath);
  } finally {
    Module._load = originalLoad;
  }

  return { handler: loaded.exports.default, calls, markerInputs };
}

async function runRoute(options = {}) {
  const method = options.method || 'PATCH';
  const body = Object.prototype.hasOwnProperty.call(options, 'body')
    ? options.body
    : {
        id: 'event-1',
        leadId: 'lead-1',
        title: 'Updated event',
        status: 'scheduled',
        startAt: '2026-07-12T10:00:00.000Z',
      };
  const loaded = loadEventRoute({ ...options, body });
  const response = { statusCode: null, body: undefined };
  const res = {
    status(code) {
      response.statusCode = code;
      loaded.calls.push(`http-${code}`);
      return this;
    },
    json(payload) {
      response.body = payload;
      return this;
    },
  };
  const req = { method, body, query: options.query || {} };
  await loaded.handler(req, res);
  return { ...loaded, response };
}

function indexOf(calls, value) {
  const index = calls.indexOf(value);
  assert.notEqual(index, -1, `${value} missing in ${calls.join(' -> ')}`);
  return index;
}

function gitShow(file) {
  return execFileSync('git', ['show', `${APP_INPUT_HEAD_G11}:${file}`], {
    cwd: root,
    encoding: 'utf8',
  });
}

function normalized(value) {
  return String(value).replace(/\r\n/g, '\n').trimEnd();
}

const exactImport = "import { markGoogleCalendarMutationSyncState } from './google-calendar-mutation-sync-state-marker.js';";
const exactBlock = `      const googleCalendarSyncStateStageG11 =
        await markGoogleCalendarMutationSyncState({
          workItemId: String(body.id),
          workspaceId,
          mutationKind: 'update',
        });

      if (googleCalendarSyncStateStageG11.found === false) {
        throw new Error(
          'EVENT_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND',
        );
      }
`;

function assertUnchanged(rel) {
  assert.equal(normalized(fs.readFileSync(path.join(root, rel), 'utf8')), normalized(gitShow(rel)), rel);
}

function assertHttp200ForDecision(decision, wrote = false, status = null) {
  return runRoute({
    markerResult: markerResult({
      wrote,
      decision,
      confirmation: wrote ? { workItemId: 'event-1', workspaceId: 'workspace-1', googleCalendarSyncStatus: status } : null,
    }),
  }).then(({ response }) => assert.equal(response.statusCode, 200));
}

test('1 route imports the exact G9 marker module once', () => {
  assert.equal((eventRouteSource.match(/import \{ markGoogleCalendarMutationSyncState \} from '\.\/google-calendar-mutation-sync-state-marker\.js';/g) || []).length, 1);
});

test('2 valid PATCH calls marker exactly once', async () => {
  const { calls } = await runRoute();
  assert.equal(calls.filter((call) => call === 'marker').length, 1);
});

test('3 marker receives exact workItemId', async () => {
  const { markerInputs } = await runRoute({ body: { id: 731, title: 'T' } });
  assert.equal(markerInputs[0].workItemId, '731');
});

test('4 marker receives exact workspaceId', async () => {
  const { markerInputs } = await runRoute({ workspaceId: 'workspace-exact' });
  assert.equal(markerInputs[0].workspaceId, 'workspace-exact');
});

test('5 marker receives mutationKind update', async () => {
  const { markerInputs } = await runRoute();
  assert.equal(markerInputs[0].mutationKind, 'update');
});

test('6 main scoped update completes before marker', async () => {
  const { calls } = await runRoute({ body: { id: 'event-1', title: 'T' } });
  assert.ok(indexOf(calls, 'main-update') < indexOf(calls, 'marker'));
});

test('7 existing lead side effect completes before marker', async () => {
  const { calls } = await runRoute();
  assert.ok(indexOf(calls, 'lead-side-effect') < indexOf(calls, 'marker'));
});

test('8 marker completes before HTTP 200', async () => {
  const { calls } = await runRoute();
  assert.ok(indexOf(calls, 'marker') < indexOf(calls, 'http-200'));
});

test('9 missing body.id returns 400 and marker 0', async () => {
  const { calls, response } = await runRoute({ body: { title: 'No id' } });
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error, 'EVENT_ID_REQUIRED');
  assert.equal(calls.includes('marker'), false);
});

test('10 main update error prevents marker call', async () => {
  const { calls, response } = await runRoute({ mainUpdateError: new Error('MAIN_UPDATE_FAILED') });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'MAIN_UPDATE_FAILED');
  assert.equal(calls.includes('marker'), false);
});

test('11 lead side effect error prevents marker call', async () => {
  const { calls, response } = await runRoute({ leadSideEffectError: new Error('LEAD_SIDE_EFFECT_FAILED') });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'LEAD_SIDE_EFFECT_FAILED');
  assert.equal(calls.includes('marker'), false);
});

test('12 found false becomes exact hard snapshot-not-found error', async () => {
  const { response } = await runRoute({ markerResult: { found: false, wrote: false, decision: null, confirmation: null } });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'EVENT_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND');
});

test('13 G8 reader error is propagated through existing sendError', async () => {
  const { response } = await runRoute({ markerError: new Error('GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE') });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE');
});

test('14 G9 writer error is propagated through existing sendError', async () => {
  const { response } = await runRoute({ markerError: new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED') });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED');
});

test('15 pending permits HTTP 200', async () => {
  await assertHttp200ForDecision({ outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true }, true, 'pending');
});

test('16 pending_delete permits HTTP 200', async () => {
  await assertHttp200ForDecision({ outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true }, true, 'pending_delete');
});

test('17 unchanged permits HTTP 200', async () => {
  await assertHttp200ForDecision({ outcome: 'unchanged', nextSyncStatus: null, shouldWrite: false });
});

test('18 skip_imported permits HTTP 200', async () => {
  await assertHttp200ForDecision({ outcome: 'skip_imported', nextSyncStatus: null, shouldWrite: false });
});

test('19 skip_no_owner permits HTTP 200', async () => {
  await assertHttp200ForDecision({ outcome: 'skip_no_owner', nextSyncStatus: null, shouldWrite: false });
});

test('20 skip_no_calendar_time permits HTTP 200', async () => {
  await assertHttp200ForDecision({ outcome: 'skip_no_calendar_time', nextSyncStatus: null, shouldWrite: false });
});

test('21 already pending permits HTTP 200', async () => {
  await assertHttp200ForDecision({ outcome: 'unchanged', nextSyncStatus: 'pending', shouldWrite: false });
});

test('22 already pending_delete permits HTTP 200', async () => {
  await assertHttp200ForDecision({ outcome: 'unchanged', nextSyncStatus: 'pending_delete', shouldWrite: false });
});

test('23 success response does not expose marker result', async () => {
  const result = markerResult({ decision: { outcome: 'skip_imported', nextSyncStatus: null, shouldWrite: false } });
  const { response } = await runRoute({ markerResult: result });
  const text = JSON.stringify(response.body);
  assert.equal(text.includes('skip_imported'), false);
  assert.equal(text.includes('confirmation'), false);
  assert.equal(text.includes('wrote'), false);
});

test('24 GET marker 0', async () => {
  const { calls, response } = await runRoute({ method: 'GET', body: undefined, selectResults: [{ data: [] }] });
  assert.equal(response.statusCode, 200);
  assert.equal(calls.includes('marker'), false);
});

test('25 POST marker 0', async () => {
  const payload = { id: 'post-event', record_type: 'event', type: 'meeting', title: 'New event', start_at: '2026-07-12T10:00:00.000Z', status: 'scheduled' };
  const { calls, response } = await runRoute({ method: 'POST', body: { title: 'New event', startAt: '2026-07-12T10:00:00.000Z' }, insertResults: [{ data: [payload] }] });
  assert.equal(response.statusCode, 200);
  assert.equal(calls.includes('marker'), false);
});

test('26 DELETE marker 0', async () => {
  const { calls, response } = await runRoute({ method: 'DELETE', body: {}, query: { id: 'event-1' }, selectResults: [{ data: [] }, { data: [] }] });
  assert.equal(response.statusCode, 200);
  assert.equal(calls.includes('marker'), false);
});

test.skip('27 historical whole-file task route snapshot superseded by G12-G14 POST wiring', () => {
  assertUnchanged('src/server/task-route-stage124f.ts');
});

test('28 task PATCH still has exactly one G9 call', () => {
  assert.equal((taskRouteSource.match(/\bmarkGoogleCalendarMutationSyncState\s*\(/g) || []).length, 1);
});

test('29 G7 facade is unchanged', () => {
  assertUnchanged('src/lib/google-calendar-mutation-sync-state-decision.ts');
});

test('30 G8 snapshot reader is unchanged', () => {
  assertUnchanged('src/server/google-calendar-mutation-snapshot.ts');
});

test('31 G9 marker is unchanged', () => {
  assertUnchanged('src/server/google-calendar-mutation-sync-state-marker.ts');
});

test('32 outbound source is unchanged', () => {
  assertUnchanged('src/server/google-calendar-outbound.ts');
});

test('33 inbound source is unchanged', () => {
  assertUnchanged('src/server/google-calendar-inbound.ts');
});

test.skip('34 historical whole-file event route snapshot superseded by G13 POST wiring', () => {
  const normalizedRoute = eventRouteSource.replace(/\r\n/g, '\n');
  assert.equal(normalizedRoute.includes(exactImport), true);
  assert.equal(normalizedRoute.includes(exactBlock), true);
  const stripped = normalizedRoute.replace(exactImport + '\n', '').replace(exactBlock, '');
  assert.equal(normalized(stripped), normalized(gitShow('src/server/event-route-stage124f.ts')));
});

test('35 event route has no direct Google API calls', () => {
  for (const token of ['fetch(', 'createGoogleCalendarEvent', 'updateGoogleCalendarEvent', 'deleteGoogleCalendarEvent']) {
    assert.equal(eventRouteSource.includes(token), false, token);
  }
});

test('36 event route has no direct sync-status write', () => {
  assert.equal(eventRouteSource.includes('google_calendar_sync_status'), false);
});
