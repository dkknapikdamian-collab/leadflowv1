#!/usr/bin/env node
/* CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_2026_05_13
   Cel: usunąć crash parseISO(undefined) w kalendarzu po wejściu w dzień.
   Naprawa idzie w źródło filtrowania/sortowania dat, nie w CSS.
*/
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
function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}
function ensureIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    throw new Error(`Nie znaleziono oczekiwanego fragmentu: ${label}`);
  }
}

function patchScheduling() {
  let src = read(schedulingPath);
  if (src.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1')) {
    console.log('OK: scheduling.ts already patched');
    return;
  }

  const oldBlock = `export function getEntriesForDay(entries: ScheduleEntry[], day: Date) {
  const start = startOfDay(day);
  const end = endOfDay(day);
  return entries.filter((entry) => {
    const date = parseISO(entry.startsAt);
    return (isEqual(date, start) || isAfter(date, start)) && (isEqual(date, end) || isBefore(date, end));
  });
}`;

  const newBlock = `function getSafeScheduleEntryDate(entry: ScheduleEntry | null | undefined) {
  // CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1:
  // Production guard against parseISO(undefined) when legacy/fallback calendar records
  // do not expose a valid startsAt. Invalid entries must disappear from the day bucket,
  // not crash the whole Calendar route.
  const rawStart = typeof entry?.startsAt === 'string' ? entry.startsAt.trim() : '';
  if (!rawStart) return null;

  const date = parseISO(rawStart);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getEntriesForDay(entries: ScheduleEntry[], day: Date) {
  const start = startOfDay(day);
  const end = endOfDay(day);
  if (!Array.isArray(entries)) return [];

  return entries.filter((entry) => {
    const date = getSafeScheduleEntryDate(entry);
    if (!date) return false;

    return (isEqual(date, start) || isAfter(date, start)) && (isEqual(date, end) || isBefore(date, end));
  });
}`;

  ensureIncludes(src, oldBlock, 'stary getEntriesForDay w src/lib/scheduling.ts');
  src = src.replace(oldBlock, newBlock);
  write(schedulingPath, src);
  console.log('OK: patched src/lib/scheduling.ts');
}

function patchCalendarSortAndTimeLabel() {
  let src = read(calendarPath);
  let changed = false;

  if (!src.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_SORT')) {
    const anchor = `function getCalendarEntryStatus(entry: ScheduleEntry) {
  return String(entry.raw?.status || '').toLowerCase();
}`;
    const helper = `function getCalendarEntryStatus(entry: ScheduleEntry) {
  return String(entry.raw?.status || '').toLowerCase();
}

function getCalendarEntrySortTime(entry: ScheduleEntry) {
  // CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_SORT:
  // Never let a malformed legacy calendar entry crash render sorting.
  const rawStart = typeof entry?.startsAt === 'string' ? entry.startsAt.trim() : '';
  if (!rawStart) return Number.POSITIVE_INFINITY;

  const date = parseISO(rawStart);
  const time = date.getTime();
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
}`;
    ensureIncludes(src, anchor, 'getCalendarEntryStatus anchor w Calendar.tsx');
    src = src.replace(anchor, helper);
    changed = true;
  }

  const oldSortLine = `    return parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime();`;
  const newSortLine = `    return getCalendarEntrySortTime(a) - getCalendarEntrySortTime(b);`;
  if (src.includes(oldSortLine)) {
    src = src.replace(oldSortLine, newSortLine);
    changed = true;
  } else if (!src.includes(newSortLine)) {
    throw new Error('Nie znaleziono linii sortowania wpisów kalendarza ani nowej wersji safe sort.');
  }

  if (!src.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_TIME_LABEL')) {
    const oldTimeFunction = `function getCalendarEntryTimeLabel(entry: ScheduleEntry) {
  const rawTime = String(entry.raw?.time || '').trim();
  if (rawTime) return rawTime.slice(0, 5);

  const date = parseISO(entry.startsAt);
  if (Number.isNaN(date.getTime())) return 'bez godziny';

  const formatted = format(date, 'HH:mm');
  const hasExplicitHour = Boolean(
    entry.raw?.scheduledAt ||
    entry.raw?.dueAt ||
    entry.raw?.startAt ||
    entry.raw?.startsAt ||
    entry.startsAt.includes('T')
  );

  if (!hasExplicitHour || formatted === '00:00') return 'bez godziny';
  return formatted;
}`;

    const newTimeFunction = `function getCalendarEntryTimeLabel(entry: ScheduleEntry) {
  const rawTime = String(entry.raw?.time || '').trim();
  if (rawTime) return rawTime.slice(0, 5);

  // CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_TIME_LABEL:
  // A legacy item without startsAt can be ignored by filters, but if it reaches
  // a card renderer, show a safe label instead of throwing parseISO(undefined).
  const rawStart = typeof entry?.startsAt === 'string' ? entry.startsAt.trim() : '';
  if (!rawStart) return 'bez godziny';

  const date = parseISO(rawStart);
  if (Number.isNaN(date.getTime())) return 'bez godziny';

  const formatted = format(date, 'HH:mm');
  const hasExplicitHour = Boolean(
    entry.raw?.scheduledAt ||
    entry.raw?.dueAt ||
    entry.raw?.startAt ||
    entry.raw?.startsAt ||
    rawStart.includes('T')
  );

  if (!hasExplicitHour || formatted === '00:00') return 'bez godziny';
  return formatted;
}`;

    ensureIncludes(src, oldTimeFunction, 'stary getCalendarEntryTimeLabel w Calendar.tsx');
    src = src.replace(oldTimeFunction, newTimeFunction);
    changed = true;
  }

  if (changed) {
    write(calendarPath, src);
    console.log('OK: patched src/pages/Calendar.tsx');
  } else {
    console.log('OK: Calendar.tsx already patched');
  }
}

function patchPackageJson() {
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  if (!pkg.scripts['check:calendar:safe-entry-dates-v1']) {
    pkg.scripts['check:calendar:safe-entry-dates-v1'] = 'node scripts/check-calendar-safe-entry-dates-v1.cjs';
    write(packagePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('OK: package.json script added');
  } else {
    console.log('OK: package.json script already exists');
  }
}

patchScheduling();
patchCalendarSortAndTimeLabel();
patchPackageJson();

console.log('OK: calendar safe entry dates v1 repair applied');
