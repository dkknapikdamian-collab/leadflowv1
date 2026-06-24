const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(msg) {
  console.error('STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX_FAIL');
  console.error('- ' + msg);
  process.exit(1);
}

function expect(src, needle, label) {
  if (!src.includes(needle)) fail(label + ': missing ' + needle);
}

function forbid(src, needle, label) {
  if (src.includes(needle)) fail(label + ': forbidden ' + needle);
}

function expectAny(src, needles, label) {
  if (!needles.some((needle) => src.includes(needle))) {
    fail(label + ': missing one of ' + needles.join(' | '));
  }
}

const calendar = read('src/pages/Calendar.tsx');
const contract = read('src/lib/calendar-operational-entry-contract.ts');
const actionPolicy = read('src/lib/calendar-operational-entry-action-policy.ts');
const scheduling = read('src/lib/scheduling.ts');
const runtime = fs.existsSync(path.join(root, 'scripts/check-cf-runtime-00-source-truth.cjs'))
  ? read('scripts/check-cf-runtime-00-source-truth.cjs')
  : '';
const runReport = read('_project/runs/STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX.md');
const obsidianPayload = read('_project/obsidian_updates/2026-06-23_STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX.md');

forbid(calendar, 'STAGE232G_R1G_CALENDAR_COMPLETED_VISIBLE_BOTTOM_HOTFIX', 'R1G false-positive marker must be cleaned from Calendar');
forbid(calendar, 'compareCalendarCompletedEntryLastStage232GR1G', 'R1G false-positive sorter must be cleaned from Calendar');

expect(calendar, 'STAGE232G_R1I_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX', 'R1I runtime marker');
expect(runReport, 'STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX', 'R1I_R2 run report marker');
expect(obsidianPayload, 'STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX', 'R1I_R2 Obsidian payload marker');

expect(calendar, 'calendarCompletedRetentionRef', 'retention ref');
expect(calendar, 'getCalendarCompletedRetentionStorageKeyStage232GR1I', 'workspace-scoped localStorage key');
expect(calendar, "workspace?.id || 'default'", 'workspace scoped fallback key');
expect(calendar, 'window.localStorage.setItem(getCalendarCompletedRetentionStorageKeyStage232GR1I()', 'localStorage write');
expect(calendar, 'window.localStorage.removeItem(getCalendarCompletedRetentionStorageKeyStage232GR1I()', 'localStorage cleanup');
expect(calendar, 'buildCalendarCompletedRetentionRowStage232GR1I', 'retained row builder');
expect(calendar, "function getCalendarRetentionIdStage232GR1I(kind: 'event' | 'task'", 'retention id restricted to event/task');
expect(calendar, "function getCalendarRetentionKeyStage232GR1I(kind: 'event' | 'task'", 'retention key restricted to event/task');
expect(calendar, "function mergeCalendarCompletedRetentionRowsStage232GR1I(kind: 'event' | 'task'", 'retention merge restricted to event/task');
expect(calendar, "if (entry.kind !== 'event' && entry.kind !== 'task') return;", 'retain/release blocks non task/event entries');
expect(calendar, "setEvents(mergeCalendarCompletedRetentionRowsStage232GR1I('event'", 'events merge during refresh');
expect(calendar, "setTasks(mergeCalendarCompletedRetentionRowsStage232GR1I('task'", 'tasks merge during refresh');
expect(calendar, 'retainCalendarCompletedEntryStage232GR1I(entry);', 'retain on complete');
expect(calendar, 'releaseCalendarCompletedEntryStage232GR1I(entry);', 'release on restore');
expect(calendar, 'delete retention[key];', 'restore removes retained entry');
expect(calendar, 'releaseCalendarCompletedRetentionByKindAndIdStage232GR1I', 'delete release helper');
expect(calendar, "releaseCalendarCompletedRetentionByKindAndIdStage232GR1I('event', sourceId);", 'delete releases retained event');
expect(calendar, "releaseCalendarCompletedRetentionByKindAndIdStage232GR1I('task', sourceId);", 'delete releases retained task');
expect(calendar, 'isCompletedCalendarEntry(entry)', 'completed detection still used');
expect(calendar, 'sortCalendarEntriesForDisplay', 'completed-last display sort still used');
expect(calendar, "return aDone ? 1 : -1;", 'completed entries are sorted below open entries');
expect(calendar, "line-through text-slate-500", 'selected day completed title crossed out');
expect(calendar, "calendar-entry-completed is-completed", 'completed row visual marker');
expect(calendar, "status: entry.kind === 'event' ? 'completed' : 'done'", 'retained row completed status');
expect(calendar, 'existingKeys.add(key);', 'backend returned rows register dedupe keys');
expect(calendar, '!existingKeys.has(getCalendarRetentionKeyStage232GR1I(kind, value.row))', 'retained row is not duplicated when backend returns same row');
expect(calendar, '_calendarCompletedRetentionStage232GR1I: true', 'retained row is explicitly tagged as retention safety net');
expectAny(calendar, ['base.startAt = readCalendarRawText(entry.raw?.startAt, entry.startsAt)', 'base.scheduledAt = startAt'], 'retained rows preserve their original calendar day fields');

expect(contract, "if (kind === 'lead')", 'contract has explicit lead action branch');
expect(contract, "return ['edit', 'shift', 'open-related'];", 'lead shadow cannot complete/restore/delete by contract');
expect(actionPolicy, "reason: allowed ? 'allowed_by_contract' : 'blocked_for_lead_shadow'", 'action policy blocks unsupported lead shadow actions');
expect(calendar, "isOperationalEntryActionAllowed(entry, 'complete')", 'Calendar complete handler uses action policy');
expect(calendar, "isOperationalEntryActionAllowed(entry, 'delete')", 'Calendar delete handler uses action policy');
expect(scheduling, 'applyLeadShadowEntryPolicy(entries)', 'scheduling keeps lead shadow policy/dedup before Calendar render');

forbid(calendar, 'src/lib/owner-control', 'Calendar must not import Owner Control runtime in this stage');
forbid(calendar, 'STAGE-A35B', 'Calendar must not contain A35B runtime marker in this stage');
forbid(calendar, 'create policy', 'No SQL/RLS policy text in Calendar');
forbid(calendar, 'alter table', 'No SQL migration text in Calendar');

if (runtime) {
  expect(runtime, 'check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs', 'CF runtime allowlist marker for R1I/R2 guard');
  expect(runtime, 'tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs', 'CF runtime allowlist marker for R1I/R2 test');
}

console.log(JSON.stringify({
  stage: 'STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX',
  ok: true,
  scope: 'Calendar completed event/task retention is guarded as a local safety-net after refresh; lead shadow is policy-blocked; backend-returned completed rows are not duplicated.',
  nextRecommended: 'run node test, build, verify:closeflow:quiet, then owner manual smoke',
}, null, 2));
