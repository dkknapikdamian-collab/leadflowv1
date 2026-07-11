const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const facadePath = path.join(root, 'src/lib/google-calendar-mutation-sync-state-decision.ts');
const source = fs.readFileSync(facadePath, 'utf8');

function loadFacade() {
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
    },
    fileName: facadePath,
    reportDiagnostics: true,
  });

  const diagnostics = compiled.diagnostics || [];
  assert.equal(diagnostics.length, 0, diagnostics.map((item) => item.messageText).join('\n'));

  const loaded = new Module(facadePath, module);
  loaded.filename = facadePath;
  loaded.paths = Module._nodeModulePaths(path.dirname(facadePath));
  loaded._compile(compiled.outputText, facadePath);
  return loaded.exports;
}

const { decideGoogleCalendarMutationSyncState } = loadFacade();

function base(overrides = {}) {
  return {
    mutationKind: 'create',
    recordType: 'task',
    type: 'task',
    status: 'todo',
    showInCalendar: true,
    hasCalendarTime: true,
    createdByUserId: 'user-1',
    googleCalendarEventId: null,
    currentGoogleSyncStatus: null,
    ...overrides,
  };
}

function decision(overrides = {}) {
  return decideGoogleCalendarMutationSyncState(base(overrides));
}

function expectDecision(overrides, expected) {
  assert.deepEqual(decision(overrides), expected);
}

const unchanged = { outcome: 'unchanged', nextSyncStatus: null, shouldWrite: false };
const skipImported = { outcome: 'skip_imported', nextSyncStatus: null, shouldWrite: false };
const skipNoOwner = { outcome: 'skip_no_owner', nextSyncStatus: null, shouldWrite: false };
const skipNoTime = { outcome: 'skip_no_calendar_time', nextSyncStatus: null, shouldWrite: false };

test('external Google event is skipped before every local mutation rule', () => {
  expectDecision({
    mutationKind: 'delete',
    recordType: 'event',
    type: '  EXTERNAL_GOOGLE_EVENT  ',
    createdByUserId: null,
    googleCalendarEventId: 'remote-1',
    status: 'deleted',
    showInCalendar: false,
  }, skipImported);
});

test('source provider is absent from the input contract and decision source', () => {
  assert.doesNotMatch(source, /sourceProvider|source_provider|sourceExternalId|source_external_id/);
  const inputSection = source.slice(
    source.indexOf('export interface GoogleCalendarMutationSyncStateInput'),
    source.indexOf('export interface GoogleCalendarMutationSyncStateDecision'),
  );
  for (const token of ['workspaceId', 'userId', 'connection', 'supabase', 'request', 'response']) {
    assert.doesNotMatch(inputSection, new RegExp(`\\b${token}\\b`), token);
  }
});

test('local task create becomes pending', () => {
  expectDecision({}, { outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true });
});

test('local event update becomes pending', () => {
  expectDecision({ mutationKind: 'update', recordType: 'event', type: 'meeting' }, {
    outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true,
  });
});

test('synced local record is promoted back to pending', () => {
  expectDecision({ currentGoogleSyncStatus: 'synced' }, {
    outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true,
  });
});

test('already pending local record keeps pending outcome without a write', () => {
  expectDecision({ currentGoogleSyncStatus: ' pending ' }, {
    outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: false,
  });
});

test('delete with Google event id becomes pending_delete', () => {
  expectDecision({ mutationKind: 'delete', googleCalendarEventId: 'remote-1' }, {
    outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true,
  });
});

test('calendar hide with Google event id becomes pending_delete', () => {
  expectDecision({ mutationKind: 'update', showInCalendar: false, googleCalendarEventId: 'remote-1' }, {
    outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true,
  });
});

test('every closed or deleted status with a Google event id becomes pending_delete', () => {
  for (const status of ['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed']) {
    expectDecision({ mutationKind: 'update', status, googleCalendarEventId: 'remote-1' }, {
      outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true,
    });
  }
});

test('already pending_delete keeps the outcome without a write', () => {
  expectDecision({ mutationKind: 'delete', googleCalendarEventId: 'remote-1', currentGoogleSyncStatus: ' PENDING_DELETE ' }, {
    outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: false,
  });
});

test('delete without Google event id stays unchanged', () => {
  expectDecision({ mutationKind: 'delete' }, unchanged);
});

test('calendar hide without Google event id stays unchanged', () => {
  expectDecision({ showInCalendar: false }, unchanged);
});

test('closed record without Google event id stays unchanged', () => {
  expectDecision({ mutationKind: 'update', status: 'done' }, unchanged);
});

test('missing owner is skipped for create', () => {
  expectDecision({ createdByUserId: '   ' }, skipNoOwner);
});

test('missing owner is skipped for delete before pending_delete', () => {
  expectDecision({ mutationKind: 'delete', createdByUserId: null, googleCalendarEventId: 'remote-1' }, skipNoOwner);
});

test('missing calendar time is skipped', () => {
  expectDecision({ hasCalendarTime: false }, skipNoTime);
});

test('unsupported record type stays unchanged', () => {
  expectDecision({ recordType: 'note', createdByUserId: null }, unchanged);
});

test('showInCalendar must normalize to explicit true', () => {
  for (const value of [undefined, null, '', 'yes-but-not-valid', {}, []]) {
    expectDecision({ showInCalendar: value }, unchanged);
  }
});

test('supported boolean spellings are normalized', () => {
  expectDecision({ showInCalendar: ' TRUE ' }, {
    outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true,
  });
  expectDecision({ showInCalendar: ' FALSE ', googleCalendarEventId: 'remote-1' }, {
    outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true,
  });
});

test('unsupported mutation stays unchanged', () => {
  expectDecision({ mutationKind: 'archive' }, unchanged);
});

test('text inputs normalize case and surrounding spaces', () => {
  expectDecision({
    mutationKind: ' UPDATE ',
    recordType: ' EVENT ',
    type: ' MEETING ',
    status: ' OPEN ',
    currentGoogleSyncStatus: ' SYNCED ',
  }, { outcome: 'pending', nextSyncStatus: 'pending', shouldWrite: true });
});

test('remote delete takes precedence over missing calendar time', () => {
  expectDecision({ mutationKind: 'update', status: 'done', googleCalendarEventId: 'remote-1', hasCalendarTime: false }, {
    outcome: 'pending_delete', nextSyncStatus: 'pending_delete', shouldWrite: true,
  });
});

test('two identical calls return deeply identical decisions', () => {
  const input = base({ mutationKind: 'update', recordType: 'event', currentGoogleSyncStatus: 'synced' });
  assert.deepEqual(
    decideGoogleCalendarMutationSyncState(input),
    decideGoogleCalendarMutationSyncState(input),
  );
});

test('facade contains no imports or I/O tokens', () => {
  assert.doesNotMatch(source, /^\s*import\s/m);
  for (const token of [
    'fetch(', 'supabaseRequest', 'updateById', 'insert', 'deleteGoogleCalendarEvent',
    'createGoogleCalendarEvent', 'updateGoogleCalendarEvent', 'syncGoogleCalendarOutbound',
    'getGoogleCalendarUserConnection', 'process.env', 'console.', 'Date(', 'new Date',
    'setTimeout', 'setInterval', 'window', 'document',
  ]) {
    assert.equal(source.includes(token), false, token);
  }
});
