const fs = require('fs');

function fail(message) {
  console.error('STAGE220A20_CALENDAR_STATUS_VST_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-visual-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

requireText(calendar, 'STAGE220A20_CALENDAR_STATUS_VST', 'calendar marker');
requireText(calendar, 'getCalendarEntryVstKindStage220A20', 'calendar type VST helper');
requireText(calendar, 'getCalendarEntryStatusVstKindStage220A20', 'calendar status VST helper');
requireText(calendar, 'getCalendarEntryDueVstKindStage220A20', 'calendar due VST helper');
requireText(calendar, 'data-cf-vst-calendar-status={getCalendarEntryStatusVstKindStage220A20(entry)}', 'calendar status data binding');
requireText(calendar, 'cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card', 'week card VST class');
requireText(calendar, 'cf-vst-card cf-vst-calendar-entry-card cf-selected-day-v9-entry-shell', 'selected day card VST class');
requireText(calendar, 'data-cf-vst-kind={getCalendarEntryVstKindStage220A20(entry)}', 'entry type VST kind binding');
requireText(calendar, 'data-cf-vst-kind={getCalendarEntryStatusVstKindStage220A20(entry)}', 'status VST kind binding');
requireText(calendar, 'cf-vst-button cf-calendar-week-plan-action', 'week action VST button');
requireText(calendar, 'cf-vst-button cf-selected-day-v9-action', 'selected day action VST button');
requireText(calendar, 'cf-vst-button-delete', 'delete action VST button');

for (const token of [
  'STAGE220A20_CALENDAR_STATUS_VST',
  '.cf-vst-kind-success',
  '[data-cf-vst-kind="success"]',
  '[data-cf-vst-kind="warning"]',
  '[data-cf-vst-kind="danger"]',
  '.cf-vst-calendar-entry-card',
  '.cf-calendar-week-plan-action-done',
  '.cf-selected-day-v9-action-danger',
]) {
  requireText(css, token, 'CSS ' + token);
}

requireText(doc, 'STAGE220A20 - kalendarz, wydarzenia i statusy terminów', 'doc A20 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a20-calendar-status-vst.cjs', 'prebuild A20 guard');

console.log('STAGE220A20_CALENDAR_STATUS_VST_GUARD: OK');
