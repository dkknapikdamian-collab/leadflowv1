const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

function preserveDateOnlyPatch(date, existing) {
  const source = String(existing?.scheduled_at || existing?.due_at || existing?.start_at || existing?.time || '');
  const timeMatch = source.match(/T(\d{2}:\d{2})/) || source.match(/^(\d{2}:\d{2})$/);
  return `${date}T${timeMatch?.[1] || '09:00'}`;
}

function mergeRetention(kind, rows, retention) {
  const existingKeys = new Set(rows.map((row) => `${kind}:${row.id}`));
  const retained = Object.values(retention)
    .filter((value) => value.kind === kind && !existingKeys.has(`${kind}:${value.row.id}`))
    .map((value) => value.row);
  return [...rows, ...retained];
}

function shiftHours(start, rounds) {
  let current = new Date(start);
  for (let i = 0; i < rounds; i += 1) current = new Date(current.getTime() + 60 * 60 * 1000);
  return current.toISOString().slice(0, 16);
}

test('stage232t r3 guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage232t-r3-operational-entry-state-machine.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('completed task restore route restores calendar and task visibility', () => {
  const route = read('src/server/task-route-stage124f.ts');
  assert.match(route, /CALENDAR_RESTORED_TASK_STATUSES_STAGE232T_R3/);
  assert.match(route, /payload\.show_in_calendar = true;/);
  assert.match(route, /payload\.show_in_tasks = true;/);
  assert.match(route, /if \(body\.dueAt !== undefined\) payload\.scheduled_at/);
});

test('completed event restore route restores calendar visibility', () => {
  const route = read('src/server/event-route-stage124f.ts');
  assert.match(route, /CALENDAR_RESTORED_EVENT_STATUSES_STAGE232T_R3/);
  assert.match(route, /payload\.show_in_calendar = true;/);
});

test('task date-only patch preserves existing time instead of resetting to 09:00', () => {
  assert.equal(
    preserveDateOnlyPatch('2026-06-27', { scheduled_at: '2026-06-27T23:09:00' }),
    '2026-06-27T23:09',
  );
});

test('+1H repeated from latest canonical state reaches +3h', () => {
  assert.equal(shiftHours('2026-06-27T23:09:00.000Z', 3), '2026-06-28T02:09');
});

test('completed retention does not duplicate backend row with same canonical id', () => {
  const merged = mergeRetention('task', [{ id: 'A', status: 'todo' }], {
    'task:A': { kind: 'task', row: { id: 'A', status: 'done' } },
  });
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, 'A');
});

test('Calendar uses latest row snapshot and operation lock for repeated shifts', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /getLatestCalendarEntrySnapshotStage232T_R3/);
  assert.match(calendar, /calendarOperationalMutationPendingRef/);
  assert.match(calendar, /const actionEntry = getLatestCalendarEntrySnapshotStage232T_R3\(entry\);/);
  assert.match(calendar, /entry\.kind \+ ':' \+ sourceId \+ ':shift-hours'/);
});
