const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendarPath = path.join(repoRoot, 'src/pages/Calendar.tsx');
const cssPath = path.join(repoRoot, 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css');

const source = fs.readFileSync(calendarPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

assert.ok(source.includes("closeflow-calendar-selected-day-new-tile-v9.css"), 'Calendar must import selected-day V9 CSS');
assert.ok(!source.includes("closeflow-calendar-selected-day-agenda-actions-v2.css"), 'Calendar must not import old selected-day agenda V2 CSS');
assert.ok(!source.includes("closeflow-calendar-selected-day-new-tile-v4.css"), 'Calendar must not import stale V4 CSS');

assert.ok(source.includes('data-cf-calendar-selected-day-new-tile-v9="true"'), 'New selected-day V9 tile marker missing');
assert.ok(source.includes('data-cf-calendar-selected-day-entry-v9="true"'), 'New selected-day V9 entry marker missing');
assert.ok(!source.includes('data-cf-calendar-selected-day="true"'), 'Legacy selected-day DOM marker must be removed from Calendar.tsx');
assert.ok(!source.includes('data-cf-calendar-selected-day-new-tile-v4="true"'), 'Stale V4 selected-day marker must be removed from Calendar.tsx');

assert.ok(source.includes('entries={sortCalendarEntriesForDisplay(getEntriesForDay('), 'Selected-day tile must read entries from getEntriesForDay');
assert.ok(source.includes('onEdit={handleEditEntry}'), 'Entry edit action must remain wired');
assert.ok(source.includes('onShift={handleShiftEntry}'), 'Entry day/week shift action must remain wired');
assert.ok(source.includes('onShiftHours={handleShiftEntryHours}'), 'Entry hour shift action must remain wired');
assert.ok(source.includes('onComplete={handleCompleteEntry}'), 'Entry complete action must remain wired');
assert.ok(source.includes('onDelete={handleDeleteEntry}'), 'Entry delete action must remain wired');

assert.ok(source.includes("onDelete(entry)"), 'Entry delete action must remain available');
assert.ok(source.includes("onEdit(entry)"), 'Entry edit action must remain available');
assert.ok(source.includes("onShift(entry, 1)"), 'Entry +1D action must remain available');
assert.ok(source.includes("onShift(entry, 7)"), 'Entry +1W action must remain available');
assert.ok(source.includes("onShiftHours(entry, 1)"), 'Entry +1H action must remain available');
assert.ok(source.includes("isCompletedEntry ? 'Przywr\u00F3\u0107' : 'Zrobione'"), 'Done/restore label contract must remain intact');
assert.ok(source.includes('Otw\u00F3rz lead'), 'Lead relation link label must remain available');
assert.ok(source.includes('Otw\u00F3rz spraw\u0119'), 'Case relation link label must remain available');
assert.ok(source.includes('/leads/${entry.raw.leadId}'), 'Lead route relation contract must remain available');
assert.ok(source.includes('/cases/${entry.raw.caseId}'), 'Case route relation contract must remain available');

assert.ok(css.includes('[data-cf-calendar-selected-day-new-tile-v9="true"]'), 'V9 CSS scope missing');
assert.ok(css.includes('[data-cf-calendar-selected-day="true"]'), 'V9 CSS must explicitly hide legacy selected-day panels');
assert.ok(css.includes('display: none !important'), 'Legacy selected-day panels must be hidden by V9 CSS');
assert.ok(!css.includes('cf-calendar-month-text-row'), 'Selected-day V9 CSS must not target month-grid text rows');
assert.ok(!css.includes('cf-month-entry-chip-structural'), 'Selected-day V9 CSS must not target month-grid structural chips');

console.log('OK: selected-day V9 massfix guard passed');
