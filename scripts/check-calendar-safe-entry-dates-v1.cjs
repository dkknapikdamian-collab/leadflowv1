#!/usr/bin/env node
/* CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_CHECK_2026_05_13 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const schedulingPath = path.join(root, 'src/lib/scheduling.ts');
const calendarPath = path.join(root, 'src/pages/Calendar.tsx');
const packagePath = path.join(root, 'package.json');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const scheduling = read(schedulingPath);
const calendar = read(calendarPath);
const pkg = JSON.parse(read(packagePath));

assert(scheduling.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1'), 'Missing safe date marker in scheduling.ts');
assert(scheduling.includes('function getSafeScheduleEntryDate'), 'Missing getSafeScheduleEntryDate helper');
assert(scheduling.includes("typeof entry?.startsAt === 'string' ? entry.startsAt.trim() : ''"), 'Missing startsAt string guard');
assert(scheduling.includes('if (!Array.isArray(entries)) return [];'), 'Missing entries array guard');
assert(!scheduling.includes('const date = parseISO(entry.startsAt);'), 'Unsafe parseISO(entry.startsAt) still exists in scheduling.ts');

assert(calendar.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_SORT'), 'Missing safe sort marker in Calendar.tsx');
assert(calendar.includes('getCalendarEntrySortTime(a) - getCalendarEntrySortTime(b)'), 'Calendar sort still does not use safe helper');
assert(calendar.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_TIME_LABEL'), 'Missing safe time label marker in Calendar.tsx');
assert(!calendar.includes('return parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime();'), 'Unsafe selected-day sort remains');
assert(!calendar.includes('const date = parseISO(entry.startsAt);\n  if (Number.isNaN(date.getTime())) return'), 'Unsafe time label parse remains');

assert(pkg.scripts && pkg.scripts['check:calendar:safe-entry-dates-v1'], 'Missing package.json check:calendar:safe-entry-dates-v1 script');

console.log('OK: calendar safe entry dates v1 guard passed');
