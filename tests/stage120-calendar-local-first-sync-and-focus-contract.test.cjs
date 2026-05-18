const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function extractFunction(source, name) {
  const marker = 'export async function ' + name;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, 'missing function: ' + name);
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error('could not extract function: ' + name);
}

test('Stage120 calendar bundle reads local Supabase first and does not await Google inbound sync', () => {
  const calendarItems = read('src/lib/calendar-items.ts');
  const bundle = extractFunction(calendarItems, 'fetchCalendarBundleFromSupabase');

  assert.match(calendarItems, /STAGE120_CALENDAR_LOCAL_FIRST_READ_GOOGLE_BACKGROUND/, 'Stage120 local-first marker missing.');
  assert.match(calendarItems, /export\s+async\s+function\s+syncGoogleCalendarInboundForCalendar/, 'background Google inbound helper missing.');
  assert.match(calendarItems, /export\s+function\s+shouldRefreshCalendarAfterGoogleInboundSync/, 'sync change detector missing.');
  assert.doesNotMatch(bundle, /syncGoogleCalendarInboundInSupabase/, 'fetchCalendarBundleFromSupabase must not call Google inbound sync.');
  assert.doesNotMatch(bundle, /maybePullGoogleCalendarInboundBeforeBundle/, 'legacy blocking Google pull helper must not be used.');
  assert.match(bundle, /Promise\.all\(\[/, 'local reads should stay batched.');
  assert.match(bundle, /fetchTasksFromSupabase\(\)/, 'tasks local read missing.');
  assert.match(bundle, /fetchEventsFromSupabase\(\)/, 'events local read missing.');
});

test('Stage120 Calendar page triggers Google inbound only after the first local bundle render', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /fetchCalendarBundleFromSupabase,\s*shouldRefreshCalendarAfterGoogleInboundSync,\s*syncGoogleCalendarInboundForCalendar/, 'Calendar must import Stage120 local-first helpers.');
  assert.match(calendar, /await\s+refreshSupabaseBundle\(\);[\s\S]*STAGE120_CALENDAR_LOCAL_FIRST_BACKGROUND_GOOGLE_SYNC[\s\S]*syncGoogleCalendarInboundForCalendar\(\)/, 'Google inbound sync must run after local refreshSupabaseBundle.');
  assert.match(calendar, /shouldRefreshCalendarAfterGoogleInboundSync\(result\)/, 'Calendar should refresh again only if Google sync changed rows.');
  assert.match(calendar, /CALENDAR_STAGE120_GOOGLE_INBOUND_REFRESH_FAILED/, 'background refresh failure must be logged without blocking UI.');
});

test('Stage120 Calendar honors /calendar?focus=YYYY-MM-DD from sidebar mini-calendar', () => {
  const calendar = read('src/pages/Calendar.tsx');
  const mini = read('src/components/sidebar-mini-calendar.tsx');
  assert.match(mini, /navigate\(`\/calendar\?focus=\$\{format\(day, 'yyyy-MM-dd'\)\}`\)/, 'Sidebar mini calendar still emits focus param.');
  assert.match(calendar, /STAGE120_CALENDAR_FOCUS_QUERY_PARAM_CONTRACT/, 'Calendar focus param marker missing.');
  assert.match(calendar, /searchParams\.get\('focus'\)/, 'Calendar must read focus query param.');
  assert.match(calendar, /setSelectedDate\(focusedDate\)/, 'Calendar must set selected date from focus param.');
  assert.match(calendar, /setCurrentMonth\(focusedDate\)/, 'Calendar must set current month from focus param.');
});

test('Stage120 is wired into package scripts and quiet release gate exactly once', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const needle = 'tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs';
  assert.equal(pkg.scripts['test:stage120-calendar-local-first-sync-and-focus'], 'node --test ' + needle);
  assert.equal(quiet.split(needle).length - 1, 1, 'Stage120 test must be listed once in quiet gate.');
});
