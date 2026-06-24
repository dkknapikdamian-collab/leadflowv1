const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const calendar = () => read('src/pages/Calendar.tsx');
const contract = () => read('src/lib/calendar-operational-entry-contract.ts');
const actionPolicy = () => read('src/lib/calendar-operational-entry-action-policy.ts');
const scheduling = () => read('src/lib/scheduling.ts');
const runReport = () => read('_project/runs/STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX.md');
const obsidianPayload = () => read('_project/obsidian_updates/2026-06-23_STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX.md');

test('R1I_R2 cleans failed R1G false-positive from Calendar runtime', () => {
  const src = calendar();
  assert.equal(src.includes('STAGE232G_R1G_CALENDAR_COMPLETED_VISIBLE_BOTTOM_HOTFIX'), false);
  assert.equal(src.includes('compareCalendarCompletedEntryLastStage232GR1G'), false);
});

test('R1I_R2 retains completed tasks and events after refresh when backend temporarily omits them', () => {
  const src = calendar();
  assert.match(src, /STAGE232G_R1I_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX/);
  assert.match(src, /calendarCompletedRetentionRef/);
  assert.match(src, /mergeCalendarCompletedRetentionRowsStage232GR1I\('event', nextCalendarEventsStage232GR1I\)/);
  assert.match(src, /mergeCalendarCompletedRetentionRowsStage232GR1I\('task', nextCalendarTasksStage232GR1I\)/);
  assert.match(src, /retainCalendarCompletedEntryStage232GR1I\(entry\);/);
  assert.match(src, /status: entry\.kind === 'event' \? 'completed' : 'done'/);
});

test('R1I_R2 persists retention through reload and clears it after restore', () => {
  const src = calendar();
  assert.match(src, /window\.localStorage\.setItem\(getCalendarCompletedRetentionStorageKeyStage232GR1I\(\), JSON\.stringify\(nextRetention\)\)/);
  assert.match(src, /window\.localStorage\.removeItem\(getCalendarCompletedRetentionStorageKeyStage232GR1I\(\)\)/);
  assert.match(src, /workspace\?\.id \|\| 'default'/);
  assert.match(src, /releaseCalendarCompletedEntryStage232GR1I\(entry\);/);
  assert.match(src, /delete retention\[key\];/);
});

test('R1I_R2 keeps completed entries visually completed and sorted below open entries', () => {
  const src = calendar();
  assert.match(src, /function isCompletedCalendarEntry\(entry: ScheduleEntry\)/);
  assert.match(src, /function sortCalendarEntriesForDisplay\(entries: ScheduleEntry\[\]\)/);
  assert.match(src, /return aDone \? 1 : -1;/);
  assert.match(src, /line-through text-slate-500/);
  assert.match(src, /calendar-entry-completed is-completed/);
});

test('R1I_R2 does not duplicate retained rows when backend also returns completed row', () => {
  const src = calendar();
  assert.match(src, /existingKeys\.add\(key\);/);
  assert.match(src, /!existingKeys\.has\(getCalendarRetentionKeyStage232GR1I\(kind, value\.row\)\)/);
  assert.match(src, /return retainedRows\.length \? \[\.\.\.safeRows, \.\.\.retainedRows\] : safeRows;/);
});

test('R1I_R2 retention is restricted to task and event, not lead shadow', () => {
  const src = calendar();
  const contractSrc = contract();
  const policySrc = actionPolicy();
  const schedulingSrc = scheduling();

  assert.match(src, /function getCalendarRetentionIdStage232GR1I\(kind: 'event' \| 'task'/);
  assert.match(src, /function mergeCalendarCompletedRetentionRowsStage232GR1I\(kind: 'event' \| 'task'/);
  assert.match(src, /if \(entry\.kind !== 'event' && entry\.kind !== 'task'\) return;/);
  assert.match(contractSrc, /return \['edit', 'shift', 'open-related'\];/);
  assert.match(policySrc, /blocked_for_lead_shadow/);
  assert.match(src, /isOperationalEntryActionAllowed\(entry, 'complete'\)/);
  assert.match(src, /isOperationalEntryActionAllowed\(entry, 'delete'\)/);
  assert.match(schedulingSrc, /applyLeadShadowEntryPolicy\(entries\)/);
});

test('R1I_R2 retention preserves day fields and does not mix calendar days by synthetic state', () => {
  const src = calendar();
  assert.match(src, /base\.startAt = readCalendarRawText\(entry\.raw\?\.startAt, entry\.startsAt\)/);
  assert.match(src, /base\.scheduledAt = startAt/);
  assert.match(src, /base\.date = readCalendarRawText\(entry\.raw\?\.date, startAt\.slice\(0, 10\)\)/);
  assert.match(src, /const dayKey = getCalendarDayKey\(entryDate\);/);
});

test('R1I_R2 stays inside Calendar retention scope and documents the closeout', () => {
  const src = calendar();
  assert.equal(src.includes('src/lib/owner-control'), false);
  assert.equal(src.includes('STAGE-A35B'), false);
  assert.equal(src.toLowerCase().includes('alter table'), false);
  assert.equal(src.toLowerCase().includes('create policy'), false);
  assert.match(runReport(), /STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX/);
  assert.match(obsidianPayload(), /STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX/);
});
