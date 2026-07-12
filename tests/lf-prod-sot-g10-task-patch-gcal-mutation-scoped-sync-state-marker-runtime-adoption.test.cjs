const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const taskRoutePath = path.join(root, 'src/server/task-route-stage124f.ts');
const eventRoutePath = path.join(root, 'src/server/event-route-stage124f.ts');
const taskRouteSource = fs.readFileSync(taskRoutePath, 'utf8');
const eventRouteSource = fs.readFileSync(eventRoutePath, 'utf8');
// git show baseline verification is used for protected sources.
const APP_INPUT_HEAD_G10 = process.env.G10_BASE_COMMIT || 'abe7a4e8f1833644cf63d72306ce447ba2cee1aa';

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

function normalizeTaskRows(rows) {
  return rows.map((row) => ({
    ...row,
    id: row.id,
    title: row.title,
    type: row.type || row.record_type || 'task',
    scheduledAt: row.scheduled_at || row.due_at || row.start_at || '2026-07-12T09:00:00.000Z',
    status: row.status || 'todo',
    priority: row.priority || 'medium',
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

function loadTaskRoute(options = {}) {
  const calls = [];
  const markerInputs = [];
  const selectQueue = [...(options.selectResults || [])];
  const loaded = new Module(taskRoutePath, module);
  loaded.filename = taskRoutePath;
  loaded.paths = Module._nodeModulePaths(path.dirname(taskRoutePath));
  const originalLoad = Module._load;

  const updateByIdScoped = async (table, id, workspaceId, payload) => {
    if (table === 'work_items') {
      calls.push('main-update');
      if (options.mainUpdateError) throw options.mainUpdateError;
      return options.mainUpdateResult || [{
        id,
        workspace_id: workspaceId,
        lead_id: options.body?.leadId || 'lead-1',
        record_type: 'task',
        type: options.body?.type || 'task',
        title: options.body?.title || 'Updated task',
        status: options.body?.status || 'todo',
        priority: 'medium',
        scheduled_at: options.body?.scheduledAt || '2026-07-12T10:00:00.000Z',
        show_in_tasks: true,
        show_in_calendar: true,
      }];
    }
    if (table === 'leads') {
      calls.push('lead-side-effect');
      if (options.leadSideEffectError) throw options.leadSideEffectError;
      return [{ id, workspace_id: workspaceId, ...payload }];
    }
    calls.push(`scoped-update:${table}`);
    return [{ id, workspace_id: workspaceId, ...payload }];
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
        deleteByIdScoped: async () => [],
        insertWithVariants: async (_tables, payloads) => {
          calls.push('post-insert');
          return { data: [{ id: 'post-task', ...payloads[0] }] };
        },
        selectFirstAvailable: async () => {
          calls.push('select');
          if (selectQueue.length) return selectQueue.shift();
          return { data: [{
            id: 'task-1',
            workspace_id: 'workspace-1',
            scheduled_at: '2026-07-12T09:00:00.000Z',
            status: 'todo',
            show_in_tasks: true,
            show_in_calendar: true,
          }] };
        },
        updateByIdScoped,
        updateById: async (table, id, payload) => {
          calls.push(`unscoped-update:${table}`);
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
      return { normalizeTaskListContract: normalizeTaskRows };
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
    if (parent === loaded && request === './google-calendar-mutation-sync-state-marker.js') {
      return { markGoogleCalendarMutationSyncState: marker };
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    loaded._compile(transpile(taskRouteSource, taskRoutePath), taskRoutePath);
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
        id: 'task-1',
        leadId: 'lead-1',
        title: 'Updated task',
        status: 'todo',
        scheduledAt: '2026-07-12T10:00:00.000Z',
      };
  const loaded = loadTaskRoute({ ...options, body });
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
  return execFileSync('git', ['show', `${APP_INPUT_HEAD_G10}:${file}`], {
    cwd: root,
    encoding: 'utf8',
  });
}

function normalized(value) {
  return String(value).replace(/\r\n/g, '\n').trimEnd();
}

const exactImport = "import { markGoogleCalendarMutationSyncState } from './google-calendar-mutation-sync-state-marker.js';";
const exactBlock = `      const googleCalendarSyncStateStageG10 =
        await markGoogleCalendarMutationSyncState({
          workItemId: String(body.id),
          workspaceId,
          mutationKind: 'update',
        });

      if (googleCalendarSyncStateStageG10.found === false) {
        throw new Error(
          'TASK_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND',
        );
      }
`;

test('1 route imports the exact G9 marker module once', () => {
  assert.equal((taskRouteSource.match(/import \{ markGoogleCalendarMutationSyncState \} from '\.\/google-calendar-mutation-sync-state-marker\.js';/g) || []).length, 1);
});

test('2 valid PATCH calls the marker exactly once', async () => {
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
  const { calls } = await runRoute({ body: { id: 'task-1', title: 'T' } });
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

test('9 missing body.id returns 400 and never calls marker', async () => {
  const { calls, response } = await runRoute({ body: { title: 'No id' } });
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error, 'TASK_ID_REQUIRED');
  assert.equal(calls.includes('marker'), false);
});

test('10 main update error prevents marker call', async () => {
  const { calls, response } = await runRoute({ mainUpdateError: new Error('MAIN_UPDATE_FAILED') });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'MAIN_UPDATE_FAILED');
  assert.equal(calls.includes('marker'), false);
});

test('11 found false becomes hard snapshot-not-found error', async () => {
  const { response } = await runRoute({ markerResult: { found: false, wrote: false, decision: null, confirmation: null } });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'TASK_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND');
});

test('12 G9 reader error is propagated through existing sendError', async () => {
  const { response } = await runRoute({ markerError: new Error('GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE') });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE');
});

test('13 G9 writer error is propagated through existing sendError', async () => {
  const { response } = await runRoute({ markerError: new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED') });
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error, 'GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED');
});

test('14 found true wrote true pending permits HTTP 200', async () => {
  const { response } = await runRoute({ markerResult: markerResult({ wrote: true, decision: { outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true }, confirmation: { workItemId: 'task-1', workspaceId: 'workspace-1', googleCalendarSyncStatus: 'pending' } }) });
  assert.equal(response.statusCode, 200);
});

test('15 found true wrote true pending_delete permits HTTP 200', async () => {
  const { response } = await runRoute({ markerResult: markerResult({ wrote: true, decision: { outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true }, confirmation: { workItemId: 'task-1', workspaceId: 'workspace-1', googleCalendarSyncStatus: 'pending_delete' } }) });
  assert.equal(response.statusCode, 200);
});

test('16 found true wrote false unchanged permits HTTP 200', async () => {
  const { response } = await runRoute({ markerResult: markerResult() });
  assert.equal(response.statusCode, 200);
});

test('17 skip_imported permits HTTP 200', async () => {
  const { response } = await runRoute({ markerResult: markerResult({ decision: { outcome: 'skip_imported', nextSyncStatus: null, shouldWrite: false } }) });
  assert.equal(response.statusCode, 200);
});

test('18 skip_no_owner permits HTTP 200', async () => {
  const { response } = await runRoute({ markerResult: markerResult({ decision: { outcome: 'skip_no_owner', nextSyncStatus: null, shouldWrite: false } }) });
  assert.equal(response.statusCode, 200);
});

test('19 skip_no_calendar_time permits HTTP 200', async () => {
  const { response } = await runRoute({ markerResult: markerResult({ decision: { outcome: 'skip_no_calendar_time', nextSyncStatus: null, shouldWrite: false } }) });
  assert.equal(response.statusCode, 200);
});

test('20 success response does not expose marker result', async () => {
  const result = markerResult({ decision: { outcome: 'skip_imported', nextSyncStatus: null, shouldWrite: false } });
  const { response } = await runRoute({ markerResult: result });
  const text = JSON.stringify(response.body);
  assert.equal(text.includes('skip_imported'), false);
  assert.equal(text.includes('confirmation'), false);
  assert.equal(text.includes('wrote'), false);
});

test('21 GET never calls marker', async () => {
  const { calls, response } = await runRoute({ method: 'GET', body: undefined, selectResults: [{ data: [] }] });
  assert.equal(response.statusCode, 200);
  assert.equal(calls.includes('marker'), false);
});

test('22 POST never calls marker', async () => {
  const { calls, response } = await runRoute({ method: 'POST', body: { title: 'New task', scheduledAt: '2026-07-12T10:00:00.000Z' } });
  assert.equal(response.statusCode, 200);
  assert.equal(calls.includes('marker'), false);
});

test('23 DELETE never calls marker', async () => {
  const { calls, response } = await runRoute({ method: 'DELETE', body: { id: 'task-1' }, query: { id: 'task-1' }, selectResults: [{ data: [] }, { data: [] }] });
  assert.equal(response.statusCode, 200);
  assert.equal(calls.includes('marker'), false);
});

test('24 event route does not import marker', () => {
  assert.equal(eventRouteSource.includes('google-calendar-mutation-sync-state-marker'), false);
});

test('25 event route does not call marker', () => {
  assert.equal(eventRouteSource.includes('markGoogleCalendarMutationSyncState'), false);
});

test('26 G9 marker source is unchanged from G10 base', () => {
  const rel = 'src/server/google-calendar-mutation-sync-state-marker.ts';
  assert.equal(normalized(fs.readFileSync(path.join(root, rel), 'utf8')), normalized(gitShow(rel)));
});

test('27 G8 reader source is unchanged from G10 base', () => {
  const rel = 'src/server/google-calendar-mutation-snapshot.ts';
  assert.equal(normalized(fs.readFileSync(path.join(root, rel), 'utf8')), normalized(gitShow(rel)));
});

test('28 G7 facade source is unchanged from G10 base', () => {
  const rel = 'src/lib/google-calendar-mutation-sync-state-decision.ts';
  assert.equal(normalized(fs.readFileSync(path.join(root, rel), 'utf8')), normalized(gitShow(rel)));
});

test('29 outbound and inbound sources are unchanged from G10 base', () => {
  for (const rel of ['src/server/google-calendar-outbound.ts', 'src/server/google-calendar-inbound.ts']) {
    assert.equal(normalized(fs.readFileSync(path.join(root, rel), 'utf8')), normalized(gitShow(rel)), rel);
  }
});

test('30 event route source is unchanged from G10 base', () => {
  const rel = 'src/server/event-route-stage124f.ts';
  assert.equal(normalized(eventRouteSource), normalized(gitShow(rel)));
});

test('31 task route without exact G10 import and block equals G10 base', () => {
  assert.equal(taskRouteSource.includes(exactImport), true);
  assert.equal(taskRouteSource.includes(exactBlock), true);
  const stripped = taskRouteSource.replace(exactImport + '\n', '').replace(exactBlock, '');
  assert.equal(normalized(stripped), normalized(gitShow('src/server/task-route-stage124f.ts')));
});
