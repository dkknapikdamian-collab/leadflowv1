const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(relativePath) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) {
    console.error('STAGE76_TODAY_EVENT_DONE_ACTION_FAIL: missing file ' + relativePath);
    process.exit(1);
  }
  return fs.readFileSync(file, 'utf8');
}
function fail(message) {
  console.error('STAGE76_TODAY_EVENT_DONE_ACTION_FAIL:', message);
  process.exit(1);
}

const today = read('src/pages/TodayStable.tsx');
const supabase = read('src/lib/supabase-fallback.ts');
const pkg = JSON.parse(read('package.json'));
const quiet = read('scripts/closeflow-release-check-quiet.cjs');

for (const token of [
  'updateEventInSupabase',
  'STAGE76_TODAY_EVENT_DONE_ACTION',
  'const handleMarkEventDone = useCallback',
  "updateEventInSupabase({ id: eventId, status: 'done' })",
  'onDone?: () => void;',
  'data-stage76-event-done-action="true"',
  'doneLabel="Zrobione"',
  'handleMarkEventDone(String(',
]) {
  if (!today.includes(token)) fail('TodayStable.tsx missing token: ' + token);
}

const todayEventsStart = today.indexOf('const todayEvents = useMemo');
if (todayEventsStart === -1) fail('missing todayEvents useMemo');
const todayEventsEnd = today.indexOf('\n  const ', todayEventsStart + 1);
const todayEventsBlock = today.slice(todayEventsStart, todayEventsEnd === -1 ? today.length : todayEventsEnd);
if (!todayEventsBlock.includes('isClosedStatus(event?.status)') && !todayEventsBlock.includes('isClosedStatus(event.status)')) {
  fail('todayEvents block does not filter done/completed event statuses');
}

if (!supabase.includes('export async function updateEventInSupabase')) fail('supabase-fallback.ts missing updateEventInSupabase');
if (!supabase.includes("'/api/events'") || !supabase.includes("method: 'PATCH'")) fail('updateEventInSupabase does not patch /api/events');
if (today.includes('insertEventToSupabase({ id: eventId')) fail('TodayStable tries to close events with insert/create instead of update');

if (pkg.scripts['check:stage76-today-event-done-action'] !== 'node scripts/check-stage76-today-event-done-action.cjs') fail('missing package check script');
if (pkg.scripts['test:stage76-today-event-done-action'] !== 'node --test tests/stage76-today-event-done-action.test.cjs') fail('missing package test script');
if (!quiet.includes("'tests/stage76-today-event-done-action.test.cjs'")) fail('verify:closeflow:quiet does not include Stage76 test');

console.log('OK stage76 today event done action');
