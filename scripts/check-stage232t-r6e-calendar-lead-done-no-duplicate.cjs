#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const STAGE = 'STAGE232T_R6E_CALENDAR_LEAD_DONE_NO_DUPLICATE';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL ' + STAGE + ': ' + label); }
function contains(src, needle, label) { src.includes(needle) ? pass(label) : fail('missing ' + label + ' [' + needle + ']'); }
function matches(src, pattern, label) { pattern.test(src) ? pass(label) : fail('missing ' + label + ' [' + pattern + ']'); }

const calendar = read('src/pages/Calendar.tsx');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');

contains(calendar, 'dedupeCalendarLeadActionRowsStage232T_R6E', 'lead action dedupe helper exists');
contains(calendar, 'getCalendarLeadActionDedupKeyStage232T_R6E', 'dedupe key helper exists');
contains(calendar, 'getCalendarLeadActionDedupeRankStage232T_R6E', 'dedupe ranking helper exists');
matches(calendar, /if \(completed && entry\.kind === 'task'\) return 30;/, 'completed durable task wins duplicate group');
matches(calendar, /if \(completed\) return 20;/, 'completed shadow wins over active planned duplicate');
matches(calendar, /return entries\.filter\(\(entry\) => \{[\s\S]{0,600}winner !== entry[\s\S]{0,600}emitted\.has\(key\)/, 'dedupe removes non-winning duplicate rows');
matches(calendar, /const scheduleEntries = useMemo\([\s\S]{0,500}dedupeCalendarLeadActionRowsStage232T_R6E\(enrichCalendarEntryRelationsStage232T_R6\(\[/, 'month schedule entries pass through dedupe');
matches(calendar, /const weekEntries = useMemo\([\s\S]{0,500}dedupeCalendarLeadActionRowsStage232T_R6E\(enrichCalendarEntryRelationsStage232T_R6\(\[/, 'week entries pass through dedupe');
contains(calendar, 'completedLeadShadowEntriesStage232T_R5', 'completed lead shadow remains as fallback source');
contains(calendar, 'completedLeadTaskIdStage232T_R6', 'R6D delete durable task fix remains');
contains(cfRuntime, 'STAGE232T_R6E_CALENDAR_LEAD_DONE_NO_DUPLICATE_ALLOWLIST', 'CF runtime allowlist includes R6E');
contains(cfRuntime, 'scripts/check-stage232t-r6e-calendar-lead-done-no-duplicate.cjs', 'CF runtime allowlist includes R6E guard');
contains(cfRuntime, 'tests/stage232t-r6e-calendar-lead-done-no-duplicate.test.cjs', 'CF runtime allowlist includes R6E test');

if (failures) {
  console.error('\n' + STAGE + ' guard failures: ' + failures);
  process.exit(1);
}

console.log('PASS ' + STAGE);
