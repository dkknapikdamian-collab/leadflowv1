const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const APP_INPUT_HEAD_G6 = 'a5578df347aa195c2d7a47647b7899d86305e7c1';
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g6-gcal-first-safe-contract-guard.cjs && node --test tests/lf-prod-sot-g6-gcal-first-safe-contract-guard.test.cjs';

function read(base, file) {
  return fs.readFileSync(path.join(base, file), 'utf8');
}
function git(args, cwd = root) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}
function section(text, start, end) {
  const a = text.indexOf(start);
  const b = text.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `missing section ${start}`);
  return text.slice(a, b);
}

const pkg = JSON.parse(read(root, 'package.json'));
const guard = read(root, 'scripts/guards/verify-lf-prod-sot-g6-gcal-first-safe-contract-guard.cjs');
const report = read(root, '_project/runs/LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD.md');
const task = read(root, 'src/server/task-route-stage124f.ts');
const event = read(root, 'src/server/event-route-stage124f.ts');
const outbound = read(root, 'src/server/google-calendar-outbound.ts');
const inbound = read(root, 'src/server/google-calendar-inbound.ts');
const map = read(vault, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD_MAP.md');
const router = read(vault, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md');

function changedFilesSince(cwd, head) {
  return git(['diff', '--name-only', `${head}..HEAD`], cwd).split(/\r?\n/).filter(Boolean).map((file) => file.replaceAll('\\', '/'));
}

test('G6 executable guard passes', () => {
  const output = execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-g6-gcal-first-safe-contract-guard.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.match(output, /PASS_FIRST_SAFE_CONTRACT_GUARD_WITH_PROVENANCE_CLARIFICATION/);
  assert.match(output, /G7_CREATED: NO/);
});

test('package exposes only the exact G6 alias', () => {
  assert.equal(pkg.scripts['verify:lf-prod-sot-g6'], exactAlias);
  assert.equal(pkg.scripts['verify:lf-prod-sot-g7'], undefined);
});

test('task and event mutation routes remain local-first with no sync-state transition', () => {
  for (const source of [task, event]) {
    for (const token of ['syncGoogleCalendarOutbound', 'createGoogleCalendarEvent', 'updateGoogleCalendarEvent', 'deleteGoogleCalendarEvent', 'google_calendar_sync_status']) {
      assert.equal(source.includes(token), false, token);
    }
    assert.match(source, /created_by_user_id/);
    assert.match(source, /show_in_calendar: true/);
  }
  assert.match(task, /record_type: 'task'/);
  assert.match(event, /record_type: 'event'/);
});

test('real code proves source_provider collision and external type origin marker', () => {
  assert.match(outbound, /source_provider: googleEventId \? 'google_calendar' : null/);
  assert.match(outbound, /source_external_id: googleEventId/);
  assert.match(inbound, /source_provider: 'google_calendar'/);
  assert.match(inbound, /'external_google_event'/);
  for (const text of [report, map]) {
    assert.match(text, /GCAL_PROVENANCE_COLLISION_FOUND: YES/);
    assert.match(text, /SOURCE_PROVIDER_ROLE: REMOTE_ASSOCIATION_NOT_ORIGIN/);
    assert.match(text, /IMPORTED_GOOGLE_EVENT_RUNTIME_PREDICATE: type === external_google_event/);
  }
});

test('PATCH and DELETE snapshot gaps are pinned before runtime adoption', () => {
  const taskPatch = section(task, "if (req.method === 'PATCH')", "if (req.method === 'DELETE')");
  const eventPatch = section(event, "if (req.method === 'PATCH')", "if (req.method === 'DELETE')");
  const taskDelete = section(task, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
  const eventDelete = section(event, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
  assert.match(taskPatch, /work_items\?select=id,scheduled_at,due_at,start_at,time,status,show_in_tasks,show_in_calendar/);
  for (const field of ['source_provider', 'created_by_user_id', 'google_calendar_event_id', 'google_calendar_sync_status']) {
    assert.equal(taskPatch.includes(field), false, field);
  }
  assert.equal(eventPatch.includes('work_items?select='), false);
  for (const block of [taskDelete, eventDelete]) {
    for (const field of ['source_provider', 'created_by_user_id', 'google_calendar_event_id']) assert.equal(block.includes(field), false, field);
    assert.match(block, /selectFirstAvailable\(\[selectPathStage228R23\]\)/);
  }
});

test('minimal workspace-scoped mutation snapshot is complete in the contract', () => {
  const fields = [
    'id', 'workspace_id', 'record_type', 'type', 'status', 'show_in_calendar',
    'scheduled_at', 'due_at', 'start_at', 'created_by_user_id', 'source_provider',
    'source_external_id', 'google_calendar_event_id', 'google_calendar_sync_status',
  ];
  for (const text of [report, map]) {
    for (const field of fields) assert.match(text, new RegExp(`- ${field}(?:\\r?\\n|$)`));
    assert.match(text, /UNSCOPED_ROW_FALLBACK_FOR_GCAL_PENDING_DECISION: FORBIDDEN/);
    assert.match(text, /EXACT_WORKSPACE_ROW_REQUIRED: YES/);
  }
});

test('pure decision facade contract covers all outcomes and no I/O wiring', () => {
  for (const text of [report, map]) {
    for (const outcome of ['pending', 'pending_delete', 'unchanged', 'skip_imported', 'skip_no_owner', 'skip_no_calendar_time']) {
      assert.ok(text.includes(outcome), outcome);
    }
    assert.match(text, /PURE_DECISION_RULE_IMPORTED: type === external_google_event -> skip_imported/);
    assert.match(text, /REMOTE_GOOGLE_CALL_INSIDE_TASK_EVENT_MUTATION: FORBIDDEN/);
    assert.match(text, /G7_FIRST_SAFE_CANDIDATE: PURE_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE/);
    assert.match(text, /G7_CREATED: NO/);
  }
});

test('G6 scope changes no src, API, SQL, Supabase or G7 artifact', () => {
  const files = changedFilesSince(root, APP_INPUT_HEAD_G6);
  const allowed = new Set([
    'package.json',
    'scripts/guards/verify-lf-prod-sot-g6-gcal-first-safe-contract-guard.cjs',
    'tests/lf-prod-sot-g6-gcal-first-safe-contract-guard.test.cjs',
    '_project/runs/LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD.md',
  ]);
  for (const file of files) {
    assert.equal(file.startsWith('src/'), false, file);
    assert.equal(allowed.has(file), true, file);
  }
  assert.equal(files.some((file) => /g7/i.test(file)), false, files.join('\n'));
  assert.match(guard, /STOP_G6_SRC_CHANGE/);
  assert.match(router, /<!-- LF-PROD-SOT-G6 START -->/);
  assert.match(router, /G7_CREATED:\s*NO/);
});
