const fs = require('fs');

function read(file) { return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); }
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227G1R1_TODAY_REASON_AND_SHIFT_VISIBILITY_REPAIR: ' + label); }
function contains(text, needle, label) { text.includes(needle) ? pass(label) : fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(text, needle, label) { !text.includes(needle) ? pass(label) : fail('still contains: ' + label + ' [' + needle + ']'); }

const today = read('src/pages/TodayStable.tsx');
const card = read('src/components/work-item-card.tsx');
const css = read('src/styles/work-item-card.css');
const pkg = read('package.json');

contains(today, 'STAGE227G1R1_TODAY_REASON_COPY_FINAL_REMOVAL', 'Today R1 marker');
notContains(today, 'Powód:', 'Today runtime Powód copy removed');
contains(today, "shiftActions={buildTodayRescheduleActionsStage227G1('task', task)}", 'today task shift actions visible');
contains(today, "shiftActions={buildTodayRescheduleActionsStage227G1('event', event)}", 'today event shift actions visible');
contains(today, 'buildTodayRescheduleActionsStage227G1(row.kind, row.raw)', 'next 7 day shift actions visible');
contains(card, 'STAGE227G1R1_TODAY_REASON_COPY_FINAL_REMOVAL', 'WorkItemCard R1 marker');
contains(card, 'normalizeWorkItemHelperStage227G1R1', 'WorkItemCard helper sanitizer');
contains(card, 'visibleHelperStage227G1R1', 'WorkItemCard uses sanitized helper');
notContains(card, '{helper ? <p className="cf-work-item-card-helper">{helper}</p> : null}', 'direct helper render removed');
contains(card, 'data-stage227g1-today-reschedule-action="true"', 'WorkItemCard shift action marker');
contains(css, 'STAGE227G1R1_TODAY_SHIFT_VISIBILITY_REPAIR_START', 'R1 shift visibility CSS');
contains(css, '.cf-work-item-card-shift', 'shift button CSS');
contains(pkg, 'check:stage227g1r1-today-reason-and-shift-visibility-repair', 'package check script');
contains(pkg, 'test:stage227g1r1-today-reason-and-shift-visibility-repair', 'package test script');

if (failures) { console.error('Stage227G1R1 guard failures: ' + failures); process.exit(1); }
console.log('PASS STAGE227G1R1_TODAY_REASON_AND_SHIFT_VISIBILITY_REPAIR');
