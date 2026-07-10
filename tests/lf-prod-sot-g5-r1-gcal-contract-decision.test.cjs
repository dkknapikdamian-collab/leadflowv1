const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync, execFileSync } = require('node:child_process');

const root = process.cwd();
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');

const read = (base, rel) => fs.readFileSync(path.join(base, rel), 'utf8');
const packageJson = JSON.parse(read(root, 'package.json'));
const taskRoute = read(root, 'src/server/task-route-stage124f.ts');
const eventRoute = read(root, 'src/server/event-route-stage124f.ts');
const outbound = read(root, 'src/server/google-calendar-outbound.ts');
const handler = read(root, 'src/server/google-calendar-handler.ts');
const report = read(root, '_project/runs/LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION.md');
const map = read(vault, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION_MAP.md');

function git(args, cwd = root) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function currentStageFiles(cwd) {
  const names = new Set();
  const status = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd, encoding: 'utf8' });
  for (const row of String(status || '').split(/\r?\n/).filter(Boolean)) {
    let file = row.slice(3).trim();
    if (file.includes(' -> ')) file = file.split(' -> ').at(-1);
    if (file) names.add(file.replaceAll('\\', '/'));
  }
  for (const args of [['diff', '--name-only'], ['diff', '--cached', '--name-only']]) {
    const value = git(args, cwd);
    for (const line of value.split(/\r?\n/).filter(Boolean)) names.add(line.replaceAll('\\', '/'));
  }
  if (!names.size) {
    const value = git(['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'], cwd);
    for (const line of value.split(/\r?\n/).filter(Boolean)) names.add(line.replaceAll('\\', '/'));
  }
  return [...names];
}

test('G5-R1 guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-g5-r1-gcal-contract-decision.cjs'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, OBSIDIAN_VAULT_PATH: vault },
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /LF-PROD-SOT-G5-R1 GCAL CONTRACT DECISION: PASS/);
});

test('G5-R1 package alias is exact', () => {
  assert.equal(
    packageJson.scripts['verify:lf-prod-sot-g5-r1'],
    'node scripts/guards/verify-lf-prod-sot-g5-r1-gcal-contract-decision.cjs && node --test tests/lf-prod-sot-g5-r1-gcal-contract-decision.test.cjs',
  );
});

test('task and event mutations remain local-first without automatic outbound or pending transition', () => {
  for (const source of [taskRoute, eventRoute]) {
    assert.doesNotMatch(source, /syncGoogleCalendarOutbound|createGoogleCalendarEvent|updateGoogleCalendarEvent|deleteGoogleCalendarEvent/);
    assert.doesNotMatch(source, /google_calendar_sync_status/);
    assert.match(source, /created_by_user_id/);
  }
});

test('event route still does not persist browser reminder method or minutes', () => {
  assert.doesNotMatch(eventRoute, /googleCalendarReminderMethod|googleCalendarReminderMinutesBefore/);
  assert.doesNotMatch(eventRoute, /google_reminders_use_default|google_reminders_overrides/);
});

test('outbound keeps pending failed all, exact user connection and fail-closed ownership', () => {
  assert.match(outbound, /'pending' \| 'failed' \| 'all'/);
  assert.match(outbound, /status === 'failed' \|\| status === 'not_connected' \|\| status === 'pending'/);
  assert.match(outbound, /getGoogleCalendarUserConnection\(workspaceId, userId\)/);
  assert.match(outbound, /if \(!personalScope\.matched\)/);
  assert.match(outbound, /pending_delete/);
});

test('outbound retains remote-delete status set and already-gone success path', () => {
  for (const status of ['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed']) {
    assert.ok(outbound.includes(`'${status}'`), status);
  }
  assert.match(outbound, /isGoogleAlreadyGoneStage229B/);
  assert.match(outbound, /deleteGoogleCalendarEvent/);
});

test('active handler does not use workspace fallback for outbound sync', () => {
  const active = handler.slice(handler.indexOf("action === 'sync-outbound'"), handler.indexOf("action === 'status'"));
  assert.match(active, /getGoogleCalendarUserConnection\(workspaceId, userId\)/);
  assert.doesNotMatch(active, /getGoogleCalendarLegacyWorkspaceConnection/);
});

test('contract report and Obsidian map carry the selected architecture', () => {
  for (const text of [report, map]) {
    assert.match(text, /OUTBOUND_TRIGGER_ARCHITECTURE: DURABLE_WORK_ITEM_SYNC_STATE/);
    assert.match(text, /LOCAL_WRITE_POLICY: LOCAL_FIRST_NON_BLOCKING/);
    assert.match(text, /OUTBOUND_SOURCE_POLICY: LOCAL_CLOSEFLOW_ROWS_ONLY/);
    assert.match(text, /CONNECTION_SCOPE: EXACT_WORKSPACE_ID_PLUS_USER_ID/);
    assert.match(text, /REMINDER_PERSISTENCE_OWNER: TASK_AND_EVENT_SERVER_ROUTES/);
    assert.match(text, /DONE_COMPLETED_REMOTE_POLICY: REMOTE_DELETE/);
    assert.match(text, /G6_CREATED: NO/);
  }
});

test('G5-R1 changes no src file and creates no G6 artifact', () => {
  const files = [...currentStageFiles(root), ...currentStageFiles(vault)];
  assert.equal(files.some((file) => file.startsWith('src/')), false, files.join('\n'));
  assert.equal(files.some((file) => /(^|\/)LF-PROD-SOT-G6[_-]|(^|\/)lf-prod-sot-g6[_-]/i.test(file)), false, files.join('\n'));
});
