const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const baseHead = 'ca7a1f0924f7e0d7995cc2cf52a6927c13f758e1';

const rel = {
  "map": "10_PROJEKTY/CloseFlow_Lead_App/STAGES/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP.md",
  "report": "_project/runs/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP.md",
  "task": "src/server/task-route-stage124f.ts",
  "event": "src/server/event-route-stage124f.ts",
  "decision": "src/lib/google-calendar-mutation-sync-state-decision.ts",
  "snapshot": "src/server/google-calendar-mutation-snapshot.ts",
  "marker": "src/server/google-calendar-mutation-sync-state-marker.ts",
  "outbound": "src/server/google-calendar-outbound.ts",
  "inbound": "src/server/google-calendar-inbound.ts"
};

function read(base, file) {
  return fs.readFileSync(path.join(base, file), 'utf8').replace(/\r\n/g, '\n');
}
function sh(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}
function section(text, start, end) {
  const a = text.indexOf(start);
  const b = text.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `missing section ${start}`);
  return text.slice(a, b);
}

const map = read(vault, rel.map);
const report = read(root, rel.report);
const task = read(root, rel.task);
const event = read(root, rel.event);
const decision = read(root, rel.decision);
const snapshot = read(root, rel.snapshot);
const marker = read(root, rel.marker);
const outbound = read(root, rel.outbound);
const inbound = read(root, rel.inbound);
const taskDelete = section(task, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const eventDelete = section(event, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");

test('01 branch is dev-rollout-freeze', () => {
  assert.equal(sh(['branch', '--show-current']), 'dev-rollout-freeze');
});

test('02 base app commit is an ancestor', () => {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', baseHead, 'HEAD'], { cwd: root });
  assert.equal(result.status, 0);
});

test('03 G15 canonical stage contract exists', () => {
  assert.equal(fs.existsSync(path.join(vault, rel.map)), true);
});

test('04 G15 app report exists', () => {
  assert.equal(fs.existsSync(path.join(root, rel.report)), true);
});

test('05 G15 changes no runtime src file', () => {
  const files = new Set();
  for (const args of [
    ['diff', '--name-only', `${baseHead}..HEAD`],
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
  ]) {
    for (const file of sh(args).split(/\r?\n/).filter(Boolean)) files.add(file);
  }
  assert.deepEqual([...files].filter((file) => file.startsWith('src/')), []);
});

test('06 Task DELETE has exact-workspace read', () => {
  assert.match(taskDelete, /withWorkspaceFilter\(selectPathStage228R23, workspaceId\)/);
});

test('07 Task DELETE has legacy id-only fallback', () => {
  assert.match(taskDelete, /selectFirstAvailable\(\[selectPathStage228R23\]\)/);
});

test('08 Event DELETE has exact-workspace read', () => {
  assert.match(eventDelete, /withWorkspaceFilter\(selectPathStage228R23, workspaceId\)/);
});

test('09 Event DELETE has legacy id-only fallback', () => {
  assert.match(eventDelete, /selectFirstAvailable\(\[selectPathStage228R23\]\)/);
});

test('10 both routes reject non-null workspace mismatch', () => {
  assert.match(taskDelete, /TASK_DELETE_WORKSPACE_MISMATCH/);
  assert.match(eventDelete, /EVENT_DELETE_WORKSPACE_MISMATCH/);
});

test('11 both routes perform local soft-delete', () => {
  for (const source of [taskDelete, eventDelete]) {
    assert.match(source, /status:\s*'deleted'/);
    assert.match(source, /show_in_tasks:\s*false/);
    assert.match(source, /show_in_calendar:\s*false/);
  }
});

test('12 Task DELETE does not invoke G9', () => {
  assert.doesNotMatch(taskDelete, /markGoogleCalendarMutationSyncState\s*\(/);
});

test('13 Event DELETE does not invoke G9', () => {
  assert.doesNotMatch(eventDelete, /markGoogleCalendarMutationSyncState\s*\(/);
});

test('14 G7 returns pending_delete for a remote id delete', () => {
  assert.match(decision, /hasGoogleCalendarEventId && requestsRemoteDelete/);
  assert.match(decision, /outcome:\s*'pending_delete'/);
  assert.match(decision, /nextSyncStatus:\s*'pending_delete'/);
});

test('15 G7 returns unchanged for delete without remote id', () => {
  assert.match(decision, /!hasGoogleCalendarEventId && requestsRemoteDelete/);
  assert.match(decision, /return noWrite\('unchanged'\)/);
});

test('16 G7 skips imported external Google rows', () => {
  assert.match(decision, /type === 'external_google_event'/);
  assert.match(decision, /return noWrite\('skip_imported'\)/);
});

test('17 G8 query requires exact workspace', () => {
  assert.match(snapshot, /&workspace_id=eq\./);
  assert.match(snapshot, /GCAL_MUTATION_SNAPSHOT_WORKSPACE_ID_REQUIRED/);
});

test('18 G8 has no unscoped fallback', () => {
  assert.doesNotMatch(snapshot, /updateById\s*\(/);
  assert.doesNotMatch(snapshot, /selectFirstAvailable\(\[.*id=eq.*limit=1.*\]\)/s);
});

test('19 G9 writes through scoped helper only', () => {
  assert.match(marker, /updateByIdScoped/);
  assert.doesNotMatch(marker, /updateById\s*\(/);
});

test('20 outbound reads exact workspace rows', () => {
  assert.match(outbound, /work_items\?workspace_id=eq\./);
});

test('21 outbound personal scope fails closed', () => {
  assert.match(outbound, /if \(!personalScope\.matched\)/);
  assert.match(outbound, /personalScopeSkipped \+= 1/);
});

test('22 outbound treats Google 404 and 410 as already gone success', () => {
  assert.match(outbound, /404\|410/);
  assert.match(outbound, /isGoogleAlreadyGoneStage229B/);
  assert.match(outbound, /writeSyncDeletedStage229B/);
});

test('23 outbound records failed state after other remote delete errors', () => {
  assert.match(outbound, /writeSyncFailure/);
  assert.match(outbound, /google_calendar_sync_status:\s*'failed'/);
  assert.match(outbound, /REMOTE_DELETE_FAILED/);
});

test('24 inbound blocks local tombstone resurrection', () => {
  assert.match(inbound, /isLocalDeletedGoogleCalendarWorkItemStage232GR6/);
  assert.match(inbound, /action:\s*'skipped_local_deleted'/);
  assert.match(inbound, /reason:\s*'local_delete_tombstone'/);
  assert.match(map, /LEGACY_LOCAL_TOMBSTONE_ONLY/);
  assert.match(report, /WORKSPACE_NULL_ROW_CANNOT_BE_SAFELY_CLAIMED_OR_REMOTELY_DELETED_WITH_CURRENT_EVIDENCE/);
});
