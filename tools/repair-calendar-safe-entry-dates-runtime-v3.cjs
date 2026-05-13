const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const schedulingPath = path.join(ROOT, 'src', 'lib', 'scheduling.ts');
const calendarPath = path.join(ROOT, 'src', 'pages', 'Calendar.tsx');
const packagePath = path.join(ROOT, 'package.json');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${path.relative(ROOT, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function writeIfChanged(file, before, after) {
  if (before !== after) {
    fs.writeFileSync(file, after, 'utf8');
    console.log(`UPDATED ${path.relative(ROOT, file)}`);
    return true;
  }
  console.log(`UNCHANGED ${path.relative(ROOT, file)}`);
  return false;
}

function replaceBlockBetween(source, startNeedle, nextNeedle, replacement, label) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Patch anchor not found: ${label} start (${startNeedle})`);
  const next = source.indexOf(nextNeedle, start + startNeedle.length);
  if (next < 0) throw new Error(`Patch anchor not found: ${label} next (${nextNeedle})`);
  return source.slice(0, start) + replacement.trimEnd() + '\n' + source.slice(next);
}

function patchScheduling() {
  const before = read(schedulingPath);
  let source = before;

  const helperStart = source.indexOf('function getSafeScheduleEntryDate(');
  const getEntriesStart = source.indexOf('export function getEntriesForDay(');
  if (helperStart >= 0 && helperStart < getEntriesStart) {
    source = source.slice(0, helperStart) + source.slice(getEntriesStart);
  }

  const replacement = `function getSafeScheduleEntryDate(entry: Pick<ScheduleEntry, 'startsAt'> | null | undefined) {
  // CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3: never pass undefined/null into date-fns parseISO.
  const rawStart = typeof entry?.startsAt === 'string' ? entry.startsAt.trim() : '';
  if (!rawStart) return null;

  const date = parseISO(rawStart);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getEntriesForDay(entries: ScheduleEntry[], day: Date) {
  const start = startOfDay(day);
  const end = endOfDay(day);
  return entries.filter((entry) => {
    const date = getSafeScheduleEntryDate(entry);
    if (!date) return false;
    return (isEqual(date, start) || isAfter(date, start)) && (isEqual(date, end) || isBefore(date, end));
  });
}
`;

  source = replaceBlockBetween(
    source,
    'export function getEntriesForDay(',
    '\nexport function getEntryTone',
    replacement,
    'scheduling.getEntriesForDay whole function'
  );

  if (!source.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3')) {
    throw new Error('Runtime marker was not inserted into scheduling.ts');
  }
  if (source.includes('const date = parseISO(entry.startsAt);')) {
    throw new Error('Unsafe parseISO(entry.startsAt) still exists in scheduling.ts');
  }

  return writeIfChanged(schedulingPath, before, source);
}

function patchCalendar() {
  const before = read(calendarPath);
  let source = before;

  const sortStart = source.indexOf('function sortCalendarEntriesForDisplay(entries: ScheduleEntry[]) {');
  const sortNext = sortStart >= 0 ? source.indexOf('\nfunction capitalizeCalendarLabel', sortStart) : -1;
  if (sortStart >= 0 && sortNext >= 0) {
    const replacement = `function getCalendarEntryDateMs(entry: ScheduleEntry) {
  // CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3_CALENDAR_SORT
  const rawStart = typeof entry?.startsAt === 'string' ? entry.startsAt.trim() : '';
  if (!rawStart) return Number.POSITIVE_INFINITY;
  const date = parseISO(rawStart);
  return Number.isNaN(date.getTime()) ? Number.POSITIVE_INFINITY : date.getTime();
}

function sortCalendarEntriesForDisplay(entries: ScheduleEntry[]) {
  return [...entries].sort((a, b) => {
    const aDone = isCompletedCalendarEntry(a);
    const bDone = isCompletedCalendarEntry(b);

    if (aDone !== bDone) {
      return aDone ? 1 : -1;
    }

    return getCalendarEntryDateMs(a) - getCalendarEntryDateMs(b);
  });
}
`;
    source = source.slice(0, sortStart) + replacement.trimEnd() + '\n' + source.slice(sortNext);
  } else {
    console.warn('WARN: Calendar sort function anchor not found. Skipping Calendar sort hardening.');
  }

  const timeStart = source.indexOf('function getCalendarEntryTimeLabel(entry: ScheduleEntry) {');
  const timeNext = timeStart >= 0 ? source.indexOf('\nfunction getCalendarEntryRelationLabel', timeStart) : -1;
  if (timeStart >= 0 && timeNext >= 0) {
    const replacement = `function getCalendarEntryTimeLabel(entry: ScheduleEntry) {
  // CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3_TIME_LABEL
  const rawTime = String(entry.raw?.time || '').trim();
  if (rawTime) return rawTime.slice(0, 5);

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
}
`;
    source = source.slice(0, timeStart) + replacement.trimEnd() + '\n' + source.slice(timeNext);
  } else {
    console.warn('WARN: Calendar time label function anchor not found. Skipping Calendar time-label hardening.');
  }

  if (!source.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3_CALENDAR_SORT')) {
    throw new Error('Calendar sort runtime marker was not inserted. Refusing half-patch.');
  }
  if (!source.includes('CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3_TIME_LABEL')) {
    throw new Error('Calendar time label runtime marker was not inserted. Refusing half-patch.');
  }

  return writeIfChanged(calendarPath, before, source);
}

function patchPackageJson() {
  const before = read(packagePath);
  const pkg = JSON.parse(before);
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:calendar:safe-entry-dates-runtime-v3'] = 'node scripts/check-calendar-safe-entry-dates-runtime-v3.cjs';
  const after = JSON.stringify(pkg, null, 2) + '\n';
  return writeIfChanged(packagePath, before, after);
}

const changed = [patchScheduling(), patchCalendar(), patchPackageJson()].filter(Boolean).length;
console.log(`Runtime V3 patch done. Changed files: ${changed}`);
