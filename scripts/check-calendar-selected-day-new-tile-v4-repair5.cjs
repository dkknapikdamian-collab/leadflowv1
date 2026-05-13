#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendarPath = path.join(repoRoot, 'src/pages/Calendar.tsx');
const cssPath = path.join(repoRoot, 'src/styles/closeflow-calendar-selected-day-new-tile-v4.css');
const source = fs.readFileSync(calendarPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

assert.ok(source.includes('CLOSEFLOW_CALENDAR_RELATION_LINKS_SOURCE_CONTRACT_REPAIR5'), 'missing repair5 relation source contract marker');
assert.ok(source.includes('/leads/${entry.raw.leadId}'), 'missing lead route source contract');
assert.ok(source.includes('/cases/${entry.raw.caseId}'), 'missing case route source contract');
assert.ok(source.includes('Otwórz lead'), 'missing Otwórz lead source contract');
assert.ok(source.includes('Otwórz sprawę'), 'missing Otwórz sprawę source contract');
assert.match(source, /isCompletedEntry \? 'Przywróć' : 'Zrobione'/, 'missing exact done/restore label contract');
assert.ok(source.includes('data-cf-calendar-selected-day-new-tile-v4="true"'), 'missing new selected-day tile scope');
assert.ok(source.includes('selectedDayTileEntriesV4'), 'missing selectedDayTileEntriesV4 runtime entries');
assert.ok(source.includes('selectedDayTileEntriesV4.map'), 'selected day tile must map selected entries');
assert.ok(source.includes('<ScheduleEntryCard'), 'selected day tile must render ScheduleEntryCard');
assert.ok(css.includes('data-cf-calendar-selected-day="true"'), 'new CSS must hide legacy selected-day scope');
assert.ok(css.includes('display: none !important'), 'new CSS must hide legacy selected-day panel');
console.log('OK: selected-day V4 repair5 guard passed');
