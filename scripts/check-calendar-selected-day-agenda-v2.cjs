#!/usr/bin/env node
/* Guard: CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V2_2026_05_13 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const calendarPath = path.join(root, 'src', 'pages', 'Calendar.tsx');
const cssPath = path.join(root, 'src', 'styles', 'closeflow-calendar-selected-day-agenda-actions-v2.css');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}
function ok(message) {
  console.log(`OK: ${message}`);
}
function read(filePath) {
  if (!fs.existsSync(filePath)) fail(`missing ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function findMatchingJsxElement(source, openingStart, tagName) {
  const tagRegex = new RegExp(`<\\/?${tagName}\\b[^>]*?>`, 'g');
  tagRegex.lastIndex = openingStart;
  let depth = 0;
  let match;
  while ((match = tagRegex.exec(source))) {
    const tag = match[0];
    const isClosing = tag.startsWith(`</${tagName}`);
    const isSelfClosing = /\/\s*>$/.test(tag);
    if (!isClosing && !isSelfClosing) depth += 1;
    if (isClosing) depth -= 1;
    if (depth === 0) return source.slice(openingStart, match.index + tag.length);
  }
  return '';
}
function getPanel(source) {
  const attr = 'data-cf-calendar-selected-day="true"';
  const idx = source.indexOf(attr);
  if (idx < 0) fail(`Calendar.tsx has no ${attr}`);
  const openingStart = source.lastIndexOf('<', idx);
  const tagMatch = /^<([A-Za-z][A-Za-z0-9]*)\b/.exec(source.slice(openingStart, openingStart + 120));
  if (!tagMatch) fail('cannot detect selected-day panel tag');
  const panel = findMatchingJsxElement(source, openingStart, tagMatch[1]);
  if (!panel) fail('cannot extract selected-day panel');
  return panel;
}

const calendar = read(calendarPath);
const css = read(cssPath);
const panel = getPanel(calendar);

if (!calendar.includes("import '../styles/closeflow-calendar-selected-day-agenda-actions-v2.css';")) fail('missing v2 selected-day agenda CSS import');
ok('Calendar imports v2 selected-day agenda CSS');

if (!calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V2_2026_05_13')) fail('missing v2 repair marker');
if (!calendar.includes('selectedDayAgendaEntriesV2 = sortCalendarEntriesForDisplay(getEntriesForDay(')) fail('selectedDayAgendaEntriesV2 is not computed from getEntriesForDay(...)');
ok('selectedDayAgendaEntriesV2 is computed from selectedDate');

if (!panel.includes('data-cf-calendar-selected-day-agenda-v2="true"')) fail('selected-day panel is not marked v2');
if (!panel.includes('selectedDayAgendaEntriesV2.map')) fail('selected-day panel does not map selectedDayAgendaEntriesV2');
if (!panel.includes('<ScheduleEntryCard')) fail('selected-day panel does not render ScheduleEntryCard');
for (const prop of ['onEdit={', 'onShift={', 'onShiftHours={', 'onComplete={', 'onDelete={']) {
  if (!panel.includes(prop)) fail(`ScheduleEntryCard in selected-day panel misses ${prop}`);
}
if (panel.includes('cf-calendar-month-text-row') || panel.includes('cf-month-entry-chip-structural')) {
  fail('selected-day panel still uses month mini-row classes');
}
ok('selected-day panel renders full ScheduleEntryCard with actions');

for (const label of ['Edytuj', '+1D', '+1W', '+1H', 'Usu\u0144']) {
  if (!calendar.includes(label)) fail(`missing action label: ${label}`);
}
if (!calendar.includes('data-cf-entry-title="true"')) fail('ScheduleEntryCard has no data-cf-entry-title marker');
ok('entry text marker and action labels are present');

if (!css.includes('[data-cf-calendar-selected-day-agenda-v2="true"]')) fail('CSS is not scoped to selected-day agenda v2');
if (css.includes('[data-cf-page-header-v2="calendar"] ~ *')) fail('CSS uses broad calendar sibling selector');
if (!css.includes('overflow: visible')) fail('CSS does not force visible overflow for selected-day cards');
ok('selected-day agenda CSS is local and readability-focused');

console.log('OK: check-calendar-selected-day-agenda-v2 passed');
