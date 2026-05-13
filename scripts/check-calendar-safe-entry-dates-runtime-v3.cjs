const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
function read(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const scheduling = read('src/lib/scheduling.ts');
const calendar = read('src/pages/Calendar.tsx');

assert(scheduling.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3'), 'Missing runtime V3 marker in scheduling.ts');
assert(scheduling.includes('function getSafeScheduleEntryDate('), 'Missing getSafeScheduleEntryDate helper');
assert(scheduling.includes('const date = getSafeScheduleEntryDate(entry);'), 'getEntriesForDay must use safe helper');
assert(!scheduling.includes('const date = parseISO(entry.startsAt);'), 'Unsafe parseISO(entry.startsAt) still exists');
assert(!/parseISO\(\s*entry\.startsAt\s*\)/.test(scheduling), 'Unsafe parseISO(entry.startsAt) pattern still exists in scheduling.ts');

assert(calendar.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3_CALENDAR_SORT'), 'Missing Calendar safe sort marker');
assert(calendar.includes('function getCalendarEntryDateMs(entry: ScheduleEntry)'), 'Missing Calendar safe sort helper');
assert(calendar.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3_TIME_LABEL'), 'Missing Calendar safe time label marker');
assert(!/return\s+parseISO\(a\.startsAt\)\.getTime\(\)\s*-\s*parseISO\(b\.startsAt\)\.getTime\(\)/.test(calendar), 'Unsafe Calendar sort parseISO(a/b.startsAt) still exists');
assert(!/const date = parseISO\(entry\.startsAt\);/.test(calendar), 'Unsafe Calendar time label parseISO(entry.startsAt) still exists');

console.log('OK: calendar safe entry dates runtime v3 guard passed');
