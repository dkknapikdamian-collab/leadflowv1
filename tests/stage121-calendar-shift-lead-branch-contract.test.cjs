const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function extractBetween(source, startNeedle, endNeedle, label) {
  const start = source.indexOf(startNeedle);
  assert.notEqual(start, -1, 'missing start anchor: ' + label);
  const end = source.indexOf(endNeedle, start);
  assert.notEqual(end, -1, 'missing end anchor: ' + label);
  return source.slice(start, end);
}

function extractFunction(source, signature, label) {
  const start = source.indexOf(signature);
  assert.notEqual(start, -1, 'missing function signature: ' + label);
  const braceStart = source.indexOf('{', start);
  assert.notEqual(braceStart, -1, 'missing function brace: ' + label);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error('missing function end: ' + label);
}

test('Stage121 calendar shift handlers support lead entries instead of no-op success toast', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /updateLeadInSupabase/, 'Calendar must import updateLeadInSupabase.');

  const shiftDays = extractBetween(
    calendar,
    'const handleShiftEntry = async (entry: ScheduleEntry, days: number) => {',
    'const handleShiftEntryHours = async (entry: ScheduleEntry, hours: number) => {',
    'handleShiftEntry',
  );
  const shiftHours = extractBetween(
    calendar,
    'const handleShiftEntryHours = async (entry: ScheduleEntry, hours: number) => {',
    'const handleCompleteEntry = async (entry: ScheduleEntry) => {',
    'handleShiftEntryHours',
  );

  for (const source of [shiftDays, shiftHours]) {
    assert.match(source, /entry\.kind\s*===\s*'lead'/, 'lead branch missing in shift handler.');
    assert.match(source, /await\s+updateLeadInSupabase\(/, 'lead branch must persist nextActionAt.');
    assert.match(source, /nextActionAt:\s*shiftedStartAt/, 'lead branch must write shifted nextActionAt.');
    assert.match(source, /applyCalendarShiftOptimisticState\(entry,\s*shiftedStartAt/, 'shift handler must patch visible local state after persistence.');
    assert.match(source, /toast\.error\('Nie można przesunąć tego typu wpisu\.'\);[\s\S]*return;/, 'unsupported kinds must not show success toast.');
  }
});

test('Stage121 optimistic state also moves lead shadow entries', () => {
  const calendar = read('src/pages/Calendar.tsx');
  const helper = extractFunction(
    calendar,
    'function applyCalendarShiftOptimisticState(entry: ScheduleEntry, nextStartAt: string, nextEndAt?: string | null) {',
    'applyCalendarShiftOptimisticState',
  );
  assert.match(helper, /STAGE121_CALENDAR_SHIFT_LEAD_BRANCH_AND_OPTIMISTIC_STATE/, 'Stage121 helper marker missing.');
  assert.match(helper, /setSelectedDate\(nextDate\)/, 'shift should move selected date to the new date.');
  assert.match(helper, /setCurrentMonth\(nextDate\)/, 'shift should move current month to the new date.');
  assert.match(helper, /setLeads\(/, 'lead shadow entries must be updated locally.');
  assert.match(helper, /nextActionAt:\s*nextStartAt/, 'lead shadow nextActionAt must be moved.');
  assert.match(helper, /next_action_at:\s*nextStartAt/, 'snake_case lead shadow next_action_at must be moved.');
  assert.match(helper, /setTasks\(/, 'task entries must be updated locally.');
  assert.match(helper, /setEvents\(/, 'event entries must be updated locally.');
});

test('Stage121 guard is wired once into package scripts and quiet gate', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const needle = 'tests/stage121-calendar-shift-lead-branch-contract.test.cjs';
  assert.equal(pkg.scripts['test:stage121-calendar-shift-lead-branch'], 'node --test ' + needle);
  assert.equal(quiet.split(needle).length - 1, 1, 'Stage121 guard must be listed once in quiet gate.');
});
