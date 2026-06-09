const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function must(label, condition) {
  if (!condition) throw new Error(label);
}

function exportedFunctionBlock(content, functionName) {
  const start = content.indexOf('export async function ' + functionName);
  if (start < 0) return '';
  const open = content.indexOf('{', start);
  if (open < 0) return '';
  let depth = 0;
  for (let i = open; i < content.length; i += 1) {
    const ch = content[i];
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return content.slice(start, i + 1);
    }
  }
  return '';
}

const taskRoute = read('src/server/task-route-stage124f.ts');
const eventRoute = read('src/server/event-route-stage124f.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const outbound = read('src/server/google-calendar-outbound.ts');
const workItems = read('api/work-items.ts');
const contextDialogs = read('src/components/ContextActionDialogs.tsx');
const sqlBackfill = read('supabase/sql/2026-06-09_stage229a_calendar_closed_items_hide_backfill.sql');

// Stage229A: closed/deleted items must stop being calendar-visible.
must('Task route has Stage229A hidden calendar status set', taskRoute.includes('CALENDAR_HIDDEN_TASK_STATUSES_STAGE229A'));
must('Task route hides done/completed/canceled/deleted from calendar', ['done', 'completed', 'canceled', 'deleted', 'removed'].every((token) => taskRoute.includes("'" + token + "'")));
must('Task PATCH accepts camel/snake show-in-calendar flags', taskRoute.includes('body.showInCalendar') && taskRoute.includes('body.show_in_calendar'));
must('Task route forces payload.show_in_calendar=false for hidden statuses', taskRoute.includes('shouldHideTaskFromCalendarStage229A') && taskRoute.includes('payload.show_in_calendar = false'));
must('Task route forces show_in_tasks=false for deleted/archived/removed', taskRoute.includes('shouldHideTaskFromTasksStage229A') && taskRoute.includes('payload.show_in_tasks = false'));

must('Event route has Stage229A hidden calendar status set', eventRoute.includes('CALENDAR_HIDDEN_EVENT_STATUSES_STAGE229A'));
must('Event route hides done/completed/canceled/deleted from calendar', ['done', 'completed', 'canceled', 'deleted', 'removed'].every((token) => eventRoute.includes("'" + token + "'")));
must('Event PATCH accepts camel/snake show-in-calendar flags', eventRoute.includes('body.showInCalendar') && eventRoute.includes('body.show_in_calendar'));
must('Event route forces payload.show_in_calendar=false for hidden statuses', eventRoute.includes('shouldHideEventFromCalendarStage229A') && eventRoute.includes('payload.show_in_calendar = false'));

// Stage228/229 no-flicker/delete contract.
// Do not require exact shape of softDeleteTaskInSupabase. That implementation can call helpers.
// We only lock the externally important behavior markers and rely on Stage229A/R229B2 guards for route behavior.
must('fallback keeps deleted status handling', fallback.includes("'deleted'") || fallback.includes('"deleted"'));
must('fallback keeps hidden task/calendar flags', fallback.includes('show_in_tasks: false') && fallback.includes('show_in_calendar: false'));
must('fallback keeps no-flicker work item mutation emitter', fallback.includes('emitCloseflowWorkItemNoFlickerMutation'));
must('fallback keeps no-flicker task delete marker', fallback.includes("action: 'delete'") && fallback.includes("kind: 'task'"));

const hardDeleteTaskBlock = exportedFunctionBlock(fallback, 'hardDeleteTaskFromSupabase');
must('hardDeleteTaskFromSupabase keeps R25 literal apiRoute system task contract', hardDeleteTaskBlock.includes('/api/system?apiRoute=tasks&id=') && hardDeleteTaskBlock.includes("method: 'DELETE'"));

// Stage229B2: pending_delete must be remotely deleted from Google.
must('Outbound imports deleteGoogleCalendarEvent', outbound.includes('deleteGoogleCalendarEvent'));
must('Outbound has pending_delete remote delete helper', outbound.includes('shouldRemoteDeleteGoogleCalendarEventStage229B') && outbound.includes("googleSyncStatusFrom(row) === 'pending_delete'"));
must('Outbound remote-delete branch runs before normal hidden/deleted skip', outbound.indexOf('shouldRemoteDeleteGoogleCalendarEventStage229B(row)') > -1 && outbound.indexOf('shouldRemoteDeleteGoogleCalendarEventStage229B(row)') < outbound.indexOf('!itemId(row) || isDeletedLike(row) || !isCalendarVisible(row)'));
must('Outbound calls Google delete and clears local Google id', outbound.includes('deleteGoogleCalendarEvent(connection, existingGoogleEventIdStage229B)') && outbound.includes('google_calendar_event_id: null'));
must('Outbound marks local state deleted after remote delete', outbound.includes("google_calendar_sync_status: 'deleted'") && outbound.includes('deleted += 1'));

must('api/work-items has direct remote delete helper', workItems.includes('shouldRemoteDeleteAfterWorkItemMutationStage229B'));
must('api/work-items direct helper covers hidden calendar false and closed statuses', workItems.includes('isShowInCalendarFalseStage229B') && workItems.includes('CLOSED_OR_HIDDEN_GOOGLE_DELETE_STATUSES_STAGE229B'));
must('api/work-items direct mutation calls Google delete', workItems.includes('deleteGoogleCalendarEvent(connection, existingGoogleEventId)'));
must('api/work-items clears google_calendar_event_id and marks deleted after remote delete', workItems.includes('google_calendar_event_id: null') && workItems.includes("google_calendar_sync_status: 'deleted'"));

// SQL backfill must remain ready for Supabase.
must('Stage229A SQL backfill exists', sqlBackfill.includes('Stage229A'));
must('Stage229A SQL sets show_in_calendar=false', sqlBackfill.includes('show_in_calendar = false'));
must('Stage229A SQL marks Google rows pending_delete', sqlBackfill.includes("google_calendar_sync_status") && sqlBackfill.includes("'pending_delete'"));
must('Stage229A SQL covers deleted/done/canceled statuses', ['deleted', 'done', 'canceled'].every((token) => sqlBackfill.includes("'" + token + "'")));

// SavedRecord cleanup from R50-R63 no-flicker work must not regress.
must('ContextActionDialogs should not contain duplicate savedRecord keys in the saved event detail object', !contextDialogs.includes('savedRecord: savedRecord || null,\n            savedAt: new Date().toISOString(),\n            savedRecord: savedRecord ?? null,'));
must('ContextActionDialogs still forwards savedRecord payload', contextDialogs.includes('savedRecord: savedRecord ?? null'));

// Existing closeout guards should remain available.
[
  'scripts/check-stage228r25-delete-flow-source-truth.cjs',
  'scripts/check-stage228r41-delete-flow-final-validate.cjs',
  'scripts/check-stage229a-calendar-closed-items-hide-and-sync-backfill.cjs',
  'scripts/check-stage229b2-google-calendar-pending-delete-remote-worker.cjs'
].forEach((rel) => must('Required guard exists: ' + rel, fs.existsSync(path.join(root, rel))));

console.log('STAGE229C_CALENDAR_DELETE_SYNC_REGRESSION_GUARDS PASS');
