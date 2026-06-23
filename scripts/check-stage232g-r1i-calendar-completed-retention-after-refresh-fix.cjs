const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg) { console.error('STAGE232G_R1I_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX_FAIL'); console.error('- ' + msg); process.exit(1); }
function expect(src, needle, label) { if (!src.includes(needle)) fail(label + ': missing ' + needle); }
function forbid(src, needle, label) { if (src.includes(needle)) fail(label + ': forbidden ' + needle); }

const calendar = read('src/pages/Calendar.tsx');
const runtime = fs.existsSync(path.join(root, 'scripts/check-cf-runtime-00-source-truth.cjs')) ? read('scripts/check-cf-runtime-00-source-truth.cjs') : '';

forbid(calendar, 'STAGE232G_R1G_CALENDAR_COMPLETED_VISIBLE_BOTTOM_HOTFIX', 'R1G false-positive marker must be cleaned from Calendar');
forbid(calendar, 'compareCalendarCompletedEntryLastStage232GR1G', 'R1G false-positive sorter must be cleaned from Calendar');

expect(calendar, 'STAGE232G_R1I_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX', 'R1I marker');
expect(calendar, 'calendarCompletedRetentionRef', 'retention ref');
expect(calendar, 'getCalendarCompletedRetentionStorageKeyStage232GR1I', 'workspace-scoped localStorage key');
expect(calendar, 'window.localStorage.setItem(getCalendarCompletedRetentionStorageKeyStage232GR1I()', 'localStorage write');
expect(calendar, 'window.localStorage.removeItem(getCalendarCompletedRetentionStorageKeyStage232GR1I()', 'localStorage cleanup');
expect(calendar, 'buildCalendarCompletedRetentionRowStage232GR1I', 'retained row builder');
expect(calendar, 'mergeCalendarCompletedRetentionRowsStage232GR1I', 'retention merge helper');
expect(calendar, "setEvents(mergeCalendarCompletedRetentionRowsStage232GR1I('event'", 'events merge during refresh');
expect(calendar, "setTasks(mergeCalendarCompletedRetentionRowsStage232GR1I('task'", 'tasks merge during refresh');
expect(calendar, 'retainCalendarCompletedEntryStage232GR1I(entry);', 'retain on complete');
expect(calendar, 'releaseCalendarCompletedEntryStage232GR1I(entry);', 'release on restore');
expect(calendar, 'isCompletedCalendarEntry(entry)', 'existing completed detection still used');
expect(calendar, 'sortCalendarEntriesForDisplay', 'existing completed-last display sort still used');
expect(calendar, "line-through text-slate-500", 'selected day completed title crossed out');
expect(calendar, "status: entry.kind === 'event' ? 'completed' : 'done'", 'retained row completed status');

if (runtime) expect(runtime, 'check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs', 'CF runtime allowlist marker');

console.log(JSON.stringify({
  stage: 'STAGE232G_R1I_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX',
  ok: true,
  scope: 'Calendar keeps completed event/task visible after refresh via workspace-scoped retention cache and existing completed-last sort',
  nextRecommended: 'manual smoke only; no new stage',
}, null, 2));
