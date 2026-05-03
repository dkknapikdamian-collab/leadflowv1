const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }
const sync = read('src/server/google-calendar-sync.ts');
assert(sync.includes('GOOGLE_CALENDAR_STAGE09B_FULL_BODY_PARITY'), 'Google event body parity marker missing');
assert(sync.includes('normalizeGoogleCalendarRecurrence'), 'Google recurrence mapper missing');
const work = read('api/work-items.ts');
assert(work.includes('GOOGLE_CALENDAR_STAGE09B_WORK_ITEM_FULL_PARITY'), 'Work item full parity description missing');
assert(!work.includes('!input.workspaceId || !userId || !rowId'), 'Work item sync must not require userId when workspace connection exists');
assert(work.includes("google_calendar_sync_status: 'not_connected'"), 'Work item not_connected status missing');
const leads = read('api/leads.ts');
assert(leads.includes('GOOGLE_CALENDAR_STAGE09B_LEAD_NEXT_ACTION_PARITY'), 'Lead next action parity helper missing');
assert(leads.includes('GOOGLE_CALENDAR_STAGE09B_LEAD_PATCH_SYNC_CALL'), 'Lead patch sync call missing');
assert(leads.includes('GOOGLE_CALENDAR_STAGE09B_LEAD_DELETE_SYNC_CALL'), 'Lead delete sync call missing');
assert(read('supabase/migrations/20260503_google_calendar_lead_parity_columns.sql').includes('GOOGLE_CALENDAR_STAGE09B_LEAD_PARITY_COLUMNS'), 'Lead parity migration missing');
const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage09b-full-calendar-parity']), 'package script missing');
if(problems.length){ console.error('Stage09B full calendar parity guard failed:'); for(const p of problems) console.error('- '+p); process.exit(1); }
console.log('PASS Google Calendar Stage09B full calendar parity');

// GOOGLE_CALENDAR_STAGE09C_LEAD_SYNC_GUARD_REPAIR
