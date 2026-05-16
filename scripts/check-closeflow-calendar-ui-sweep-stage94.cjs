#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendarPath = path.join(repoRoot, 'src/pages/Calendar.tsx');
const skinPath = path.join(repoRoot, 'src/styles/closeflow-calendar-skin-only-v1.css');
const reportPath = path.join(repoRoot, '_project/runs/STAGE94_CALENDAR_UI_SWEEP_LOCAL_REPORT.md');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function lineOf(text, needle) {
  const idx = text.indexOf(needle);
  if (idx === -1) return null;
  return text.slice(0, idx).split(/\r?\n/).length;
}

function sliceBetween(text, startNeedle, endNeedle) {
  const start = text.indexOf(startNeedle);
  if (start === -1) return '';
  const end = text.indexOf(endNeedle, start + startNeedle.length);
  if (end === -1) return text.slice(start);
  return text.slice(start, end);
}

function addFinding(findings, severity, code, title, file, details) {
  findings.push({ severity, code, title, file, details });
}

const calendar = read(calendarPath);
const skin = read(skinPath);
const findings = [];

if (!calendar) {
  addFinding(findings, 'P1', 'CALENDAR-MISSING', 'Calendar.tsx could not be read.', 'calendar:missing', 'Cannot validate Calendar UI without Calendar.tsx.');
}

if (calendar.includes('selectedDayAgendaEntriesV2') || calendar.includes('getEntriesForDay(topicContactOptions')) {
  addFinding(
    findings,
    'P1',
    'CAL-SELECTED-DAY-WRONG-SOURCE',
    'selectedDayAgendaEntriesV2 reads topicContactOptions as schedule entries.',
    'calendar:L' + (lineOf(calendar, 'selectedDayAgendaEntriesV2') || lineOf(calendar, 'getEntriesForDay(topicContactOptions') || '?'),
    'Remove the dead or wrong-source selected day variable. Selected day must read scheduleEntries.'
  );
}

const monthSection = sliceBetween(calendar, "{calendarView === 'month' ? (", "{calendarView === 'week' ? (");
const v9Count = (monthSection.match(/CalendarSelectedDayTileV9/g) || []).length;
const oldSelectedCards = /selectedDayEntries\.map\s*\(\(entry\)\s*=>/.test(monthSection) || monthSection.includes('<ScheduleEntryCard');
if (v9Count !== 1 || oldSelectedCards) {
  addFinding(
    findings,
    'P1',
    'CAL-SELECTED-DAY-DUAL-RENDER',
    'Selected day may render V9 tile and old ScheduleEntryCard list together.',
    'calendar:L' + (lineOf(calendar, 'CalendarSelectedDayTileV9') || '?'),
    'Keep exactly one selected-day render in month view: CalendarSelectedDayTileV9.'
  );
}

const v9Index = monthSection.indexOf('CalendarSelectedDayTileV9');
if (v9Index !== -1) {
  const afterV9 = monthSection.slice(v9Index, v9Index + 900);
  if (afterV9.includes('<Badge')) {
    addFinding(
      findings,
      'P2',
      'CAL-SELECTED-DAY-EXTRA-BADGE',
      'Selected day panel still has a secondary Badge count near V9.',
      'calendar:L' + (lineOf(calendar, '<Badge variant="secondary" className="h-7 px-3"') || '?'),
      'V9 already has its count. Remove secondary Badge noise.'
    );
  }
}

const duplicateCompleted = "${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''}";
if (calendar.includes(duplicateCompleted)) {
  addFinding(
    findings,
    'P2',
    'CAL-MONTH-DUPLICATE-COMPLETED-CLASS',
    'Month entry button repeats completed class expression.',
    'calendar:L' + (lineOf(calendar, duplicateCompleted) || '?'),
    'Remove duplicate completed class expression.'
  );
}

if (skin.includes('cf-html-viewold broad calendar scope') || skin.includes('mainold broad calendar scope')) {
  addFinding(
    findings,
    'P2',
    'CAL-CSS-BROKEN-OLD-BROAD-SELECTOR',
    'Calendar skin has broken old broad scope selector text.',
    'skin:L' + (lineOf(skin, 'old broad calendar scope') || '?'),
    'Remove malformed legacy selector remnants.'
  );
}

const weekRail = sliceBetween(calendar, 'calendar-week-visible-days-v3', '</aside>');
if (weekRail.includes('calendar-week-filter-list hidden') || weekRail.includes('calendar-week-filter-btn') || weekRail.includes('Przysz\u0142y tydzie\u0144')) {
  addFinding(
    findings,
    'P1',
    'CAL-WEEK-LEGACY-FILTER-RENDER',
    'Week rail still contains legacy hidden filter render.',
    'calendar:L' + (lineOf(calendar, 'calendar-week-filter-list hidden') || '?'),
    'Remove hidden legacy list. Keep one visible week rail.'
  );
}

if (/rounded-full[^\n]+formatCalendarItemCount\(dayEntries\.length\)|calendar-week-count-badge/.test(weekRail)) {
  addFinding(
    findings,
    'P2',
    'CAL-WEEK-COUNT-BADGE',
    'Week rail count may still render as badge/plaque.',
    'calendar:L' + (lineOf(calendar, 'formatCalendarItemCount(dayEntries.length)') || '?'),
    'Week rail count should be plain text, not a badge.'
  );
}

if (calendar.includes("'Wyd'") || calendar.includes("'Zad'")) {
  addFinding(
    findings,
    'P3',
    'CAL-SHORT-LABELS-STILL-IN-MONTH-NORMALIZERS',
    'Short labels Wyd/Zad still exist in Calendar.tsx.',
    'calendar:L' + (lineOf(calendar, "'Wyd'") || lineOf(calendar, "'Zad'") || '?'),
    'Allowed only for compact month chips/normalizers. Selected day and week plan must use full labels via ScheduleEntryCard/V9.'
  );
}

const p1 = findings.filter((item) => item.severity === 'P1').length;
const p2 = findings.filter((item) => item.severity === 'P2').length;
const p3 = findings.filter((item) => item.severity === 'P3').length;

const lines = [];
lines.push('# Stage94 Calendar UI Sweep - local report');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- P1: ${p1}`);
lines.push(`- P2: ${p2}`);
lines.push(`- P3: ${p3}`);
lines.push('');
lines.push('## Findings');
lines.push('');
if (!findings.length) {
  lines.push('No findings.');
} else {
  findings.forEach((finding, index) => {
    lines.push(`### ${index + 1}. [${finding.severity}] ${finding.code}`);
    lines.push('');
    lines.push(`- Title: ${finding.title}`);
    lines.push(`- File: ${finding.file}`);
    lines.push(`- Details: ${finding.details}`);
    lines.push('');
  });
}
lines.push('## Operator decision');
lines.push('');
if (p1 || p2) {
  lines.push('Sweep failed: P1/P2 Calendar UI debt remains. Fix before closing Stage94.');
} else {
  lines.push('Sweep passed for P1/P2. P3 findings are documentation-level unless they leak outside month chips/normalizers.');
}
lines.push('');
lines.push('## Scope note');
lines.push('');
lines.push('- Month grid may keep compact Wyd/Zad labels as a documented exception.');
lines.push('- Selected day and week plan must stay readable and must not use hidden legacy renders.');

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, lines.join('\n') + '\n', 'utf8');
console.log(lines.join('\n'));

if (p1 || p2) {
  process.exit(1);
}
