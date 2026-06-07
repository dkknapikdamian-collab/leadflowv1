const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227G1_TODAY_RESCHEDULE_ACTIONS: ' + label); }
function contains(text, needle, label) {
  if (text.includes(needle)) pass(label);
  else fail('missing: ' + label + ' [' + needle + ']');
}
function notContains(text, needle, label) {
  if (!text.includes(needle)) pass(label);
  else fail('still contains: ' + label + ' [' + needle + ']');
}

const today = read('src/pages/TodayStable.tsx');
const card = read('src/components/work-item-card.tsx');
const css = read('src/styles/work-item-card.css');
const pkg = read('package.json');

contains(today, 'STAGE227G1_TODAY_RESCHEDULE_ACTION_SOURCE', 'Today marker');
contains(today, 'TODAY_RESCHEDULE_OPTIONS_STAGE227G1', 'reschedule option source');
contains(today, "{ days: 1, label: '+1D' }", '+1D option');
contains(today, "{ days: 3, label: '+3D' }", '+3D option');
contains(today, "{ days: 7, label: '+1W' }", '+1W option');
contains(today, 'handleShiftTodayWorkItemStage227G1', 'shared Today shift handler');
contains(today, 'updateTaskInSupabase({', 'task persistence through existing Supabase update');
contains(today, 'updateEventInSupabase({', 'event persistence through existing Supabase update');
contains(today, "window.dispatchEvent(new CustomEvent('closeflow:data-mutated'", 'mutation bus refresh event');
contains(today, "shiftActions={buildTodayRescheduleActionsStage227G1('task', task)}", 'task cards get shift actions');
contains(today, "shiftActions={buildTodayRescheduleActionsStage227G1('event', event)}", 'event cards get shift actions');
contains(today, "buildTodayRescheduleActionsStage227G1(row.kind, row.raw)", 'next 7 days cards get shift actions');
contains(today, "helper: '',", 'next 7 days helper copy removed');
notContains(today, 'Powód: zaplanowane zadanie w najbliższych dniach', 'task reason copy removed');
notContains(today, 'Powód: wydarzenie w najbliższych 7 dniach', 'event reason copy removed');
contains(card, 'shiftActions?: Array', 'WorkItemCard shift action prop');
contains(card, 'data-stage227g1-today-reschedule-action="true"', 'WorkItemCard shift action marker');
contains(card, 'cf-vst-button cf-selected-day-v9-action cf-work-item-card-shift', 'Calendar action classes reused');
contains(card, 'data-stage227g1-today-calendar-action-source="calendar-selected-day-v9-actions"', 'visual source marker');
contains(css, 'STAGE227G1_TODAY_RESCHEDULE_SOURCE_OF_TRUTH_START', 'CSS marker');
contains(css, '.cf-work-item-card-shift', 'shift action CSS');
contains(css, "data-work-item-kind='event'", 'event icon/tone CSS');
contains(css, "data-work-item-kind='task'", 'task icon/tone CSS');
contains(pkg, 'check:stage227g1-today-reschedule-actions', 'package check script');
contains(pkg, 'test:stage227g1-today-reschedule-actions', 'package test script');

if (failures) {
  console.error('\nStage227G1 guard failures: ' + failures);
  process.exit(1);
}
console.log('PASS STAGE227G1_TODAY_RESCHEDULE_ACTIONS');
