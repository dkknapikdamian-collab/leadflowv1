
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function must(label, condition) { if (!condition) throw new Error(label); }

const outbound = read('src/server/google-calendar-outbound.ts');
const workItems = read('api/work-items.ts');

must('outbound imports deleteGoogleCalendarEvent', outbound.includes('deleteGoogleCalendarEvent'));
must('outbound has pending_delete remote delete candidate helper', outbound.includes('shouldRemoteDeleteGoogleCalendarEventStage229B') && outbound.includes("googleSyncStatusFrom(row) === 'pending_delete'"));
must('outbound deletes Google event before normal visibility skip', outbound.indexOf('shouldRemoteDeleteGoogleCalendarEventStage229B(row)') < outbound.indexOf('!itemId(row) || isDeletedLike(row) || !isCalendarVisible(row)'));
must('outbound clears google_calendar_event_id after remote delete', outbound.includes('google_calendar_event_id: null'));
must('outbound returns deleted counter', outbound.includes('deleted,'));

must('api/work-items has direct remote delete helper', workItems.includes('shouldRemoteDeleteAfterWorkItemMutationStage229B'));
must('api/work-items direct delete helper covers status and show_in_calendar=false', workItems.includes('CLOSED_OR_HIDDEN_GOOGLE_DELETE_STATUSES_STAGE229B') && workItems.includes('isShowInCalendarFalseStage229B'));
must('api/work-items update/delete clears google_calendar_event_id after remote delete', workItems.includes("google_calendar_sync_status: 'deleted'") && workItems.includes('google_calendar_event_id: null'));

console.log('STAGE229B2_GOOGLE_CALENDAR_PENDING_DELETE_REMOTE_WORKER PASS');
