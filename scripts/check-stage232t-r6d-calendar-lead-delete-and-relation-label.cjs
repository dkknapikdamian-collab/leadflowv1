#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const STAGE = 'STAGE232T_R6D_CALENDAR_LEAD_DELETE_AND_RELATION_LABEL';
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL ' + STAGE + ': ' + label); }
function contains(src, needle, label) { src.includes(needle) ? pass(label) : fail('missing ' + label + ' [' + needle + ']'); }
function notContains(src, needle, label) { !src.includes(needle) ? pass(label) : fail('forbidden ' + label + ' [' + needle + ']'); }
function matches(src, pattern, label) { pattern.test(src) ? pass(label) : fail('missing ' + label + ' [' + pattern + ']'); }
const calendar = read('src/pages/Calendar.tsx');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');

contains(calendar, 'CalendarEntryRelationTargetStage232T_R6', 'relation target helper exists');
contains(calendar, 'getCalendarEntryRelationTargetStage232T_R6', 'relation resolver exists');
contains(calendar, 'enrichCalendarEntryRelationsStage232T_R6', 'entries enriched with lead/client names');
contains(calendar, 'data-stage232t-r6d-calendar-week-relation-name-link="true"', 'week relation name link marker');
contains(calendar, 'data-stage232t-r6d-calendar-selected-relation-name-link="true"', 'selected relation name link marker');
contains(calendar, '<Link to={relationTargetStage232T_R6.href} title={relationLabel}>{relationLabel}</Link>', 'week relation name is the link text');
contains(calendar, '<Link to={relationTargetSelectedStage232T_R6.href} title={relationFallback}>{relationFallback}</Link>', 'selected relation name is the link text');
notContains(calendar, '>Otwórz lead</Link>', 'visible relation link no longer says Otwórz lead');
notContains(calendar, '>Otwórz klienta</Link>', 'visible relation link no longer says Otwórz klienta');
notContains(calendar, '>Otwórz sprawę</Link>', 'visible relation link no longer says Otwórz sprawę');

contains(calendar, 'completedLeadTaskIdStage232T_R6', 'lead delete locates durable completed task');
matches(calendar, /completedLeadTaskIdStage232T_R6[\s\S]{0,500}await deleteTaskFromSupabase\(completedLeadTaskIdStage232T_R6\)/, 'lead delete removes durable completed task');
matches(calendar, /completedLeadTaskIdStage232T_R6[\s\S]{0,700}releaseCalendarCompletedRetentionByKindAndIdStage232GR1I\('task', completedLeadTaskIdStage232T_R6\)/, 'lead delete releases durable task retention');
contains(calendar, 'deletedTaskLeadIdStage232T_R6', 'task delete clears lead shadow retention');
matches(calendar, /deletedTaskLeadIdStage232T_R6[\s\S]{0,220}releaseCompletedLeadShadowEntryStage232T_R5\(deletedTaskLeadIdStage232T_R6\)/, 'task delete releases completed lead shadow state');
contains(calendar, 'calendar_lead_next_action_deleted', 'lead planned action delete remains');
contains(calendar, 'nextActionAt: null', 'lead delete still clears nextActionAt');
notContains(calendar, 'deleteLeadFromSupabase', 'lead is still not deleted');

contains(cfRuntime, 'STAGE232T_R6D_CALENDAR_LEAD_DELETE_AND_RELATION_LABEL_ALLOWLIST', 'CF runtime allowlist includes R6D');
contains(cfRuntime, 'scripts/check-stage232t-r6d-calendar-lead-delete-and-relation-label.cjs', 'CF runtime allowlist includes R6D guard');
contains(cfRuntime, 'tests/stage232t-r6d-calendar-lead-delete-and-relation-label.test.cjs', 'CF runtime allowlist includes R6D test');

if (failures) { console.error('\n' + STAGE + ' guard failures: ' + failures); process.exit(1); }
console.log('PASS ' + STAGE);
