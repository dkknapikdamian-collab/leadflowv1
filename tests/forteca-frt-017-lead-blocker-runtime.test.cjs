const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const test = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const taskRoutePath = path.join(root, 'src/server/task-route-stage124f.ts');
const caseActionPath = path.join(root, 'src/components/ContextActionDialogs.tsx');
const taskRouteSource = fs.readFileSync(taskRoutePath, 'utf8');
const caseActionSource = fs.readFileSync(caseActionPath, 'utf8');

let tempRoot;
let handler;

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
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'forteca-frt017-runtime-'));
  fs.mkdirSync(path.join(tempRoot, 'server'), { recursive: true });
  fs.mkdirSync(path.join(tempRoot, 'lib'), { recursive: true });
  fs.writeFileSync(path.join(tempRoot, 'package.json'), '{"type":"module"}\n');

  transpile(taskRouteSource, path.join(tempRoot, 'server/task-route-stage124f.js'));
  transpile(
    fs.readFileSync(path.join(root, 'src/lib/google-calendar-mutation-sync-state-decision.ts'), 'utf8'),
    path.join(tempRoot, 'lib/google-calendar-mutation-sync-state-decision.js'),
  );
  transpile(
    fs.readFileSync(path.join(root, 'src/lib/google-calendar-create-sync-state-insert-payload.ts'), 'utf8'),
    path.join(tempRoot, 'lib/google-calendar-create-sync-state-insert-payload.js'),
  );
  transpile(
    fs.readFileSync(path.join(root, 'src/lib/calendar-timezone-contract.ts'), 'utf8'),
    path.join(tempRoot, 'lib/calendar-timezone-contract.js'),
  );

  fs.writeFileSync(path.join(tempRoot, 'lib/data-contract.js'), `
export function normalizeTaskListContract(rows) {
  return rows.map((row) => ({
    ...row,
    workspaceId: row.workspaceId || row.workspace_id || '',
    leadId: row.leadId || row.lead_id || undefined,
    caseId: row.caseId || row.case_id || undefined,
    clientId: row.clientId || row.client_id || undefined,
    scheduledAt: row.scheduledAt || row.scheduled_at || row.due_at || row.date || null,
    dueAt: row.dueAt || row.due_at || row.scheduled_at || row.date || null,
  }));
}
`);
  fs.writeFileSync(path.join(tempRoot, 'server/_request-scope.js'), `
export async function resolveRequestWorkspaceId() { return 'workspace-runtime-017'; }
export async function requireRequestIdentity() { return { userId: globalThis.__fortecaFrt017.userId }; }
export function withWorkspaceFilter(value) { return value; }
`);
  fs.writeFileSync(path.join(tempRoot, 'server/google-calendar-mutation-sync-state-marker.js'), `
export async function markGoogleCalendarMutationSyncState() { return { found: true }; }
`);
  fs.writeFileSync(path.join(tempRoot, 'server/_supabase.js'), `
export async function insertWithVariants(tables, rows) {
  globalThis.__fortecaFrt017.inserts.push({ tables, rows });
  return { data: [{ id: 'work-item-runtime-017', ...rows[0] }] };
}
export async function updateByIdScoped(table, id, workspaceId, payload) {
  globalThis.__fortecaFrt017.updates.push({ table, id, workspaceId, payload });
  return [{ id, ...payload }];
}
export async function updateWhere(path, payload) {
  globalThis.__fortecaFrt017.updates.push({ table: path, payload });
  return [];
}
export async function selectFirstAvailable() { return { data: [] }; }
export async function deleteByIdScoped() { return []; }
`);

  handler = (await import(pathToFileURL(path.join(tempRoot, 'server/task-route-stage124f.js')).href)).default;
});

test.after(() => {
  if (tempRoot) fs.rmSync(tempRoot, { recursive: true, force: true });
});

async function post(body, userId = 'user-runtime-017') {
  const runtimeCapture = globalThis.__fortecaFrt017 = {
    inserts: [],
    updates: [],
    userId,
  };
  let statusCode = 0;
  let responseBody;
  const req = { method: 'POST', body };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      responseBody = value;
      return this;
    },
  };
  await handler(req, res);
  return { capture: runtimeCapture, statusCode, responseBody };
}

function onlyWorkItemInsert(result) {
  assert.equal(result.capture.inserts.length, 1, 'POST must issue exactly one insert');
  assert.deepEqual(result.capture.inserts[0].tables, ['work_items']);
  return result.capture.inserts[0].rows[0];
}

test('FRT-017 POST persists missing_item relation, status fields and description in work_items', { concurrency: false }, async () => {
  const input = {
    title: 'Brak umowy podpisanej przez klienta',
    type: 'missing_item',
    status: 'missing_item',
    priority: 'high',
    date: '2026-09-12',
    scheduledAt: '2026-09-12T09:00:00+02:00',
    leadId: 'lead-runtime-017',
    caseId: 'case-runtime-017',
    clientId: 'client-runtime-017',
    description: 'Potrzebna podpisana umowa przed rozpoczęciem realizacji.',
  };

  const result = await post(input);
  const inserted = onlyWorkItemInsert(result);

  assert.equal(result.statusCode, 200);
  assert.equal(inserted.workspace_id, 'workspace-runtime-017');
  assert.equal(inserted.lead_id, input.leadId);
  assert.equal(inserted.case_id, input.caseId);
  assert.equal(inserted.client_id, input.clientId);
  assert.equal(inserted.type, 'missing_item');
  assert.equal(inserted.status, 'missing_item');
  assert.equal(inserted.priority, 'high');
  assert.equal(inserted.scheduled_at, new Date(input.scheduledAt).toISOString());
  assert.equal(inserted.description, input.description);
  assert.equal(result.capture.updates.length, 0, 'missing_item must not promote Lead next action');
});

test('FRT-017 POST persists blocking_missing_item without duplicate insert and normalizes response', { concurrency: false }, async () => {
  const input = {
    title: 'Brak decyzji zakresowej',
    type: 'missing_item',
    status: 'blocking_missing_item',
    priority: 'medium',
    date: '2026-10-03',
    scheduledAt: '2026-10-03T09:00:00+02:00',
    leadId: 'lead-runtime-017',
    description: 'Start jest zablokowany do czasu potwierdzenia zakresu.',
  };

  const result = await post(input);
  const inserted = onlyWorkItemInsert(result);
  const response = result.responseBody;
  assert.equal(result.statusCode, 200);
  assert.equal(inserted.workspace_id, 'workspace-runtime-017');
  assert.equal(inserted.lead_id, input.leadId);
  assert.equal(inserted.status, 'blocking_missing_item');
  assert.equal(inserted.priority, input.priority);
  assert.equal(inserted.scheduled_at, new Date(input.scheduledAt).toISOString());
  assert.equal(inserted.description, input.description);
  assert.equal(response.id, 'work-item-runtime-017');
  assert.equal(response.workspaceId, 'workspace-runtime-017');
  assert.equal(response.leadId, input.leadId);
  assert.equal(response.status, 'blocking_missing_item');
  assert.equal(response.priority, input.priority);
  assert.equal(response.scheduledAt, new Date(input.scheduledAt).toISOString());
  assert.equal(response.dueAt, new Date(input.scheduledAt).toISOString());
  assert.equal(response.date, input.scheduledAt.slice(0, 10));
  assert.equal(response.description, input.description);
  assert.equal(result.capture.inserts.length, 1, 'blocking_missing_item must not duplicate work_items insert');
  assert.equal(result.capture.updates.length, 0, 'blocking_missing_item must not promote Lead next action');
});

test('FRT-017 active case persistence decision is task/activity, not case_items', () => {
  const caseBranchStart = caseActionSource.indexOf("if (request.recordType === 'case') {");
  const caseBranchEnd = caseActionSource.indexOf('      } else {', caseBranchStart);
  assert.ok(caseBranchStart >= 0, 'active case persistence branch must exist');
  assert.ok(caseBranchEnd > caseBranchStart, 'active case persistence branch boundary must exist');
  const caseBranch = caseActionSource.slice(caseBranchStart, caseBranchEnd);

  assert.match(caseBranch, /insertTaskToSupabase\(\{/);
  assert.match(caseBranch, /insertActivityToSupabase\(\{/);
  assert.match(caseBranch, /persistenceTarget:\s*'task_activity_missing_item'/);
  assert.doesNotMatch(caseBranch, /insertCaseItemToSupabase|case_items/);
  assert.match(
    caseActionSource,
    /STAGE232I1_CONTEXT_ACTION_CASE_MISSING_ITEM_TASK_SOURCE[\s\S]{0,240}case_items remain legacy\/checklist compatibility/,
  );
});

test('FRT-017 route keeps the missing-item lead-next-action exclusion on the real POST path', () => {
  const postStart = taskRouteSource.indexOf("if (req.method !== 'POST') {");
  assert.ok(postStart >= 0, 'task route POST boundary must exist');
  const postSource = taskRouteSource.slice(postStart);
  assert.match(postSource, /insertWithVariants\(\['work_items'\], \[payload\]\)/);
  assert.match(postSource, /!isMissingItemTypeForLeadNextActionStage228R17\(body\.type \|\| payload\.type\)/);
});
