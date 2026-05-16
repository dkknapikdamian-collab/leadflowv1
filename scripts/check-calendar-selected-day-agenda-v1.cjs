#!/usr/bin/env node
/* Guard: CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V1_2026_05_13 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const calendarPath = path.join(root, 'src', 'pages', 'Calendar.tsx');
const cssPath = path.join(root, 'src', 'styles', 'closeflow-calendar-selected-day-agenda-actions-v1.css');

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}
function ok(message) {
  console.log(`OK ${message}`);
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
function getSelectedDayPanel(source) {
  const attrIndex = source.indexOf('data-cf-calendar-selected-day="true"');
  if (attrIndex < 0) fail('Calendar.tsx has no data-cf-calendar-selected-day="true"');
  const openingStart = source.lastIndexOf('<', attrIndex);
  const tagMatch = /^<([A-Za-z][A-Za-z0-9]*)\b/.exec(source.slice(openingStart, openingStart + 80));
  if (!tagMatch) fail('cannot detect selected day panel tag name');
  const panel = findMatchingJsxElement(source, openingStart, tagMatch[1]);
  if (!panel) fail('cannot extract selected day panel JSX');
  return panel;
}

const calendar = read(calendarPath);
const css = read(cssPath);

if (!calendar.includes("import '../styles/closeflow-calendar-selected-day-agenda-actions-v1.css';")) {
  fail('Calendar.tsx does not import closeflow-calendar-selected-day-agenda-actions-v1.css');
}
ok('Calendar imports selected-day agenda CSS');

if (!calendar.includes('selectedDayAgendaEntries = sortCalendarEntriesForDisplay(getEntriesForDay(')) {
  fail('Calendar.tsx does not compute selectedDayAgendaEntries from getEntriesForDay(...)');
}
ok('selectedDayAgendaEntries is computed from schedule entries + selectedDate');

const panel = getSelectedDayPanel(calendar);
if (!panel.includes('data-cf-calendar-selected-day-agenda-v1="true"')) fail('selected-day panel is not marked as agenda v1');
if (!panel.includes('<ScheduleEntryCard')) fail('selected-day panel does not render ScheduleEntryCard');
if (!panel.includes('selectedDayAgendaEntries.map')) fail('selected-day panel does not map selectedDayAgendaEntries');
if (panel.includes('cf-calendar-month-text-row') || panel.includes('cf-month-entry-chip-structural')) {
  fail('selected-day panel still contains month mini-row classes');
}
for (const prop of ['onEdit={', 'onShift={', 'onShiftHours={', 'onComplete={', 'onDelete={']) {
  if (!panel.includes(prop)) fail(`selected-day ScheduleEntryCard misses ${prop}`);
}
ok('selected-day panel uses full ScheduleEntryCard with edit/shift/complete/delete actions');

if (!calendar.includes('data-cf-entry-title="true"')) fail('ScheduleEntryCard does not expose data-cf-entry-title="true"');
for (const label of ['Edytuj', '+1D', '+1W', '+1H', 'Usu\u0144']) {
  if (!calendar.includes(label)) fail(`Calendar action label missing: ${label}`);
}
ok('entry title marker and action labels exist');

if (!css.includes('[data-cf-calendar-selected-day-agenda-v1="true"]')) {
  fail('selected-day agenda CSS is not scoped to data-cf-calendar-selected-day-agenda-v1');
}
if (css.includes('[data-cf-page-header-v2="calendar"] ~ *')) {
  fail('selected-day agenda CSS uses broad calendar sibling selector');
}
ok('selected-day agenda CSS is locally scoped');

console.log('OK check-calendar-selected-day-agenda-v1 passed');
