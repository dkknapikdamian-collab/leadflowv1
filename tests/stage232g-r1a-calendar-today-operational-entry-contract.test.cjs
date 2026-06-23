const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('STAGE232G R1A operational entry contract exists and defines shared kinds/actions', () => {
  const contract = read('src/lib/calendar-operational-entry-contract.ts');
  assert.match(contract, /STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT/);
  assert.match(contract, /OperationalEntryKind = 'event' \| 'task' \| 'lead'/);
  assert.match(contract, /OperationalEntryAction = 'edit' \| 'shift' \| 'complete' \| 'restore' \| 'delete' \| 'open-related'/);
  assert.match(contract, /CalendarTodayOperationalEntryContract/);
});

test('STAGE232G R1A moment priority covers event task and lead fields', () => {
  const contract = read('src/lib/calendar-operational-entry-contract.ts');
  for (const field of [
    'startAt', 'startsAt', 'dateTime', 'date_time',
    'scheduledAt', 'scheduled_at', 'dueAt', 'due_at',
    'nextActionAt', 'next_action_at', 'followUpAt', 'follow_up_at'
  ]) {
    assert.ok(contract.includes(field), `missing field ${field}`);
  }
});

test('STAGE232G R1A lead shadow actions stay limited before R1C decision', () => {
  const contract = read('src/lib/calendar-operational-entry-contract.ts');
  assert.match(contract, /if \(kind === 'lead'\)/);
  assert.match(contract, /\['edit', 'shift', 'open-related'\]/);
});

test('STAGE232G R1A scheduling exports the shared contract', () => {
  const scheduling = read('src/lib/scheduling.ts');
  assert.match(scheduling, /\.\/calendar-operational-entry-contract/);
  assert.match(scheduling, /buildCalendarTodayParityFingerprint/);
  assert.match(scheduling, /CalendarTodayOperationalEntryContract/);
});

test('STAGE232G R1A guard and reports are present', () => {
  assert.ok(fs.existsSync(path.join(root, 'scripts/check-stage232g-r1a-calendar-today-operational-entry-contract.cjs')));
  const report = read('_project/runs/STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT.md');
  const payload = read('_project/obsidian_updates/2026-06-23_STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT.md');
  assert.match(report, /R0_RESULT: CALENDAR_SOURCE_TRUTH_STATUS == PARTIAL/);
  assert.match(report, /STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT/);
  assert.match(payload, /LOCAL_SYNC_PENDING/);
});
