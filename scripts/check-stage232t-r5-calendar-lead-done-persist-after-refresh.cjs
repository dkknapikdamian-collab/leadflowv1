#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const STAGE = 'STAGE232T_R5_CALENDAR_LEAD_DONE_PERSIST_AFTER_REFRESH';
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL ' + STAGE + ': ' + label); }
function contains(src, needle, label) { src.includes(needle) ? pass(label) : fail('missing ' + label + ' [' + needle + ']'); }
function notContains(src, needle, label) { !src.includes(needle) ? pass(label) : fail('forbidden ' + label + ' [' + needle + ']'); }
function matches(src, pattern, label) { pattern.test(src) ? pass(label) : fail('missing ' + label + ' [' + pattern + ']'); }
const calendar = read('src/pages/Calendar.tsx');
const taskRoute = read('src/server/task-route-stage124f.ts');
const r4Guard = read('scripts/check-stage232t-r4-calendar-lead-shadow-actions.cjs');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');
contains(calendar, 'STAGE232T_R5_CALENDAR_LEAD_DONE_DURABLE_WORK_ITEM_SOURCE', 'Calendar declares durable completed lead action source');
contains(calendar, 'ensureCompletedLeadCalendarActionStage232T_R5', 'Calendar has durable completed lead action helper');
contains(calendar, 'findCompletedLeadCalendarActionTaskIdStage232T_R5', 'Calendar has idempotency lookup for existing completed lead action task');
contains(calendar, 'insertTaskToSupabase({', 'Calendar can create durable completed task/work_item');
contains(calendar, 'updateTaskInSupabase({', 'Calendar can update existing linked completed task/work_item');
contains(calendar, "status: 'done'", 'Calendar durable task is completed');
contains(calendar, 'source: STAGE232T_R5_CALENDAR_LEAD_DONE_DURABLE_WORK_ITEM_SOURCE', 'Calendar tags durable source on task update');
contains(calendar, 'const durableLeadActionStage232T_R5 = await ensureCompletedLeadCalendarActionStage232T_R5(entry, leadId, completedAtStage232T_R4);', 'lead complete persists durable source before clearing lead next action');
matches(calendar, /durableLeadActionStage232T_R5[\s\S]{0,400}await updateLeadInSupabase\(\{[\s\S]{0,260}nextActionAt: null/, 'durable persist happens before lead nextActionAt is cleared');
contains(calendar, 'nextActionAt: null', 'lead complete still clears active nextActionAt');
contains(calendar, "nextActionTitle: ''", 'lead complete still clears active nextActionTitle');
contains(calendar, 'nextActionItemId: null', 'lead complete still clears active nextActionItemId');
contains(calendar, 'durableLeadAction: durableLeadActionStage232T_R5', 'activity log includes durable source evidence');
contains(taskRoute, 'shouldKeepCompletedLeadCalendarActionVisibleStage232T_R5', 'task route has R5 completed visibility helper');
contains(taskRoute, 'calendar_lead_done_persist_after_refresh', 'task route recognizes R5 durable source marker');
matches(taskRoute, /shouldHideTaskFromCalendarStage229A\(nextStatusForCalendarStage229A\)[\s\S]{0,160}payload\.show_in_calendar = false;[\s\S]{0,220}shouldKeepCompletedLeadCalendarActionVisibleStage232T_R5\(body\)[\s\S]{0,120}payload\.show_in_calendar = true;[\s\S]{0,80}payload\.show_in_tasks = true;/, 'task PATCH keeps R5 completed task visible after closed-status hide');
contains(cfRuntime, 'STAGE232T_R5_CALENDAR_LEAD_DONE_PERSIST_AFTER_REFRESH_ALLOWLIST', 'CF runtime allowlist includes R5 stage');
contains(cfRuntime, 'scripts/check-stage232t-r5-calendar-lead-done-persist-after-refresh.cjs', 'CF runtime allowlist includes R5 guard');
contains(cfRuntime, 'tests/stage232t-r5-calendar-lead-done-persist-after-refresh.test.cjs', 'CF runtime allowlist includes R5 test');
contains(r4Guard, 'calendar_lead_next_action_completed', 'R4 guard still checks lead complete action');
contains(r4Guard, 'nextActionAt: null', 'R4 guard still checks lead next action clear');
notContains(calendar, 'STAGE232T_R5_LOCALSTORAGE_FINAL_SOURCE', 'R5 does not introduce localStorage final source marker');
notContains(calendar, 'STAGE232T_R5_SESSIONSTORAGE_FINAL_SOURCE', 'R5 does not introduce sessionStorage final source marker');
notContains(calendar, 'deleteLeadFromSupabase', 'Calendar still does not delete lead for lead action done');
if (failures) { console.error('\n' + STAGE + ' guard failures: ' + failures); process.exit(1); }
console.log('PASS ' + STAGE);
