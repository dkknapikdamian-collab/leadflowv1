const fs = require('fs');
const path = require('path');

const STAGE = 'Stage124E V2 calendar task/event range params';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function appendOnce(file, marker, block) {
  let text = fs.existsSync(file) ? read(file) : '';
  if (!text.includes(marker)) {
    text = text.replace(/\s*$/, '') + '\n\n' + block.trim() + '\n';
    write(file, text);
  }
}

function replaceRequired(file, find, replacement, label) {
  const text = read(file);
  if (!text.includes(find)) {
    throw new Error(label + ' not found in ' + file);
  }
  write(file, text.replace(find, replacement));
}

function ensurePackageScript() {
  const pkg = JSON.parse(read('package.json'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:stage124e-calendar-range-params'] = 'node scripts/check-stage124e-calendar-range-params.cjs';
  write('package.json', JSON.stringify(pkg, null, 2) + '\n');
}

function patchSupabaseFallback() {
  const file = 'src/lib/supabase-fallback.ts';
  let text = read(file);

  const marker = 'STAGE124E_CALENDAR_RANGE_QUERY_PARAMS';
  const helper = `
// STAGE124E_CALENDAR_RANGE_QUERY_PARAMS
export type TaskEventRangeParamsStage124E = {
  from?: string;
  to?: string;
  limit?: number;
};

function buildTaskEventRangeQueryStage124E(params?: TaskEventRangeParamsStage124E) {
  const query = new URLSearchParams();
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  if (typeof params?.limit === 'number' && Number.isFinite(params.limit) && params.limit > 0) {
    query.set('limit', String(Math.min(Math.floor(params.limit), 200)));
  }
  const encoded = query.toString();
  return encoded ? '?' + encoded : '';
}
`;

  if (!text.includes(marker)) {
    const anchor = 'export async function fetchTasksFromSupabase() {';
    if (!text.includes(anchor)) throw new Error('fetchTasksFromSupabase anchor not found');
    text = text.replace(anchor, helper.trim() + '\n' + anchor);
  }

  text = text.replace(
    'export async function fetchTasksFromSupabase() {',
    'export async function fetchTasksFromSupabase(params?: TaskEventRangeParamsStage124E) {',
  );
  text = text.replace(
    "const normalizedTasks = await callApi<Record<string, unknown>[]>('/api/tasks').then(normalizeTaskListContract);",
    "const normalizedTasks = await callApi<Record<string, unknown>[]>('/api/tasks' + buildTaskEventRangeQueryStage124E(params)).then(normalizeTaskListContract);",
  );

  text = text.replace(
    'export async function fetchEventsFromSupabase() {',
    'export async function fetchEventsFromSupabase(params?: TaskEventRangeParamsStage124E) {',
  );
  text = text.replace(
    "const normalizedEvents = await callApi<Record<string, unknown>[]>('/api/events').then(normalizeEventListContract);",
    "const normalizedEvents = await callApi<Record<string, unknown>[]>('/api/events' + buildTaskEventRangeQueryStage124E(params)).then(normalizeEventListContract);",
  );

  write(file, text);
}

function patchCalendarItems() {
  const file = 'src/lib/calendar-items.ts';
  let text = read(file);

  const marker = 'CalendarBundleRangeOptions';
  const typeBlock = `
export type CalendarBundleRangeOptions = {
  from?: string;
  to?: string;
  limit?: number;
};
`;

  if (!text.includes(marker)) {
    const anchor = `export type CalendarBundle = {
  tasks: CalendarTaskItem[];
  events: CalendarEventItem[];
  leads: Record<string, unknown>[];
  cases: Record<string, unknown>[];
};
`;
    if (!text.includes(anchor)) throw new Error('CalendarBundle type anchor not found');
    text = text.replace(anchor, anchor + '\n' + typeBlock.trim() + '\n');
  }

  text = text.replace(
    'export async function fetchCalendarBundleFromSupabase(): Promise<CalendarBundle> {',
    'export async function fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {}): Promise<CalendarBundle> {',
  );

  text = text.replace(
    'readCollection(() => fetchTasksFromSupabase()),',
    'readCollection(() => fetchTasksFromSupabase(options)),',
  );
  text = text.replace(
    'readCollection(() => fetchEventsFromSupabase()),',
    'readCollection(() => fetchEventsFromSupabase(options)),',
  );

  write(file, text);
}

function writeGuardAndTest() {
  const guard = [
    "const fs = require('fs');",
    "const assert = require('assert');",
    "",
    "const fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');",
    "const calendar = fs.readFileSync('src/lib/calendar-items.ts', 'utf8');",
    "",
    "assert.ok(fallback.includes('STAGE124E_CALENDAR_RANGE_QUERY_PARAMS'), 'fallback must contain Stage124E marker');",
    "assert.ok(fallback.includes('type TaskEventRangeParamsStage124E'), 'fallback must define task/event range params type');",
    "assert.ok(fallback.includes('function buildTaskEventRangeQueryStage124E'), 'fallback must build task/event range query');",
    "assert.ok(fallback.includes(\"query.set('from', params.from)\"), 'fallback must forward from param');",
    "assert.ok(fallback.includes(\"query.set('to', params.to)\"), 'fallback must forward to param');",
    "assert.ok(fallback.includes(\"query.set('limit', String(Math.min(Math.floor(params.limit), 200)))\"), 'fallback must cap and forward limit param');",
    "assert.ok(fallback.includes('export async function fetchTasksFromSupabase(params?: TaskEventRangeParamsStage124E)'), 'tasks fetcher must accept range params');",
    "assert.ok(fallback.includes('export async function fetchEventsFromSupabase(params?: TaskEventRangeParamsStage124E)'), 'events fetcher must accept range params');",
    "assert.ok(fallback.includes(\"'/api/tasks' + buildTaskEventRangeQueryStage124E(params)\"), 'tasks fetcher must call /api/tasks with range query builder');",
    "assert.ok(fallback.includes(\"'/api/events' + buildTaskEventRangeQueryStage124E(params)\"), 'events fetcher must call /api/events with range query builder');",
    "assert.ok(!fallback.includes(\"callApi<Record<string, unknown>[]>('/api/tasks').then\"), 'tasks fetcher must not use bare /api/tasks');",
    "assert.ok(!fallback.includes(\"callApi<Record<string, unknown>[]>('/api/events').then\"), 'events fetcher must not use bare /api/events');",
    "",
    "assert.ok(calendar.includes('export type CalendarBundleRangeOptions'), 'calendar bundle must expose range options type');",
    "assert.ok(calendar.includes('fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})'), 'calendar bundle must accept range options');",
    "assert.ok(calendar.includes('fetchTasksFromSupabase(options)'), 'calendar bundle must pass options to task fetcher');",
    "assert.ok(calendar.includes('fetchEventsFromSupabase(options)'), 'calendar bundle must pass options to event fetcher');",
    "",
    "console.log('✔ Stage124E calendar task/event range params contract holds');",
    "",
  ].join('\n');

  write('scripts/check-stage124e-calendar-range-params.cjs', guard);

  const test = [
    "const test = require('node:test');",
    "const assert = require('node:assert/strict');",
    "const fs = require('node:fs');",
    "",
    "test('Stage124E forwards calendar task/event range params', () => {",
    "  const fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');",
    "  const calendar = fs.readFileSync('src/lib/calendar-items.ts', 'utf8');",
    "  assert.match(fallback, /STAGE124E_CALENDAR_RANGE_QUERY_PARAMS/);",
    "  assert.match(fallback, /buildTaskEventRangeQueryStage124E/);",
    "  assert.match(fallback, /fetchTasksFromSupabase\\(params\\?: TaskEventRangeParamsStage124E\\)/);",
    "  assert.match(fallback, /fetchEventsFromSupabase\\(params\\?: TaskEventRangeParamsStage124E\\)/);",
    "  assert.ok(fallback.includes(\"'/api/tasks' + buildTaskEventRangeQueryStage124E(params)\"));",
    "  assert.ok(fallback.includes(\"'/api/events' + buildTaskEventRangeQueryStage124E(params)\"));",
    "  assert.ok(calendar.includes('fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})'));",
    "  assert.ok(calendar.includes('fetchTasksFromSupabase(options)'));",
    "  assert.ok(calendar.includes('fetchEventsFromSupabase(options)'));",
    "});",
    "",
  ].join('\n');

  write('tests/stage124e-calendar-range-params.test.cjs', test);
}

function writeProjectDocs() {
  const run = `# Stage124E V2 - calendar task/event range params

Date: 2026-05-19
Branch: dev-rollout-freeze
Mode: ZIP/local-only, manual commit after green guards.

## FACTS
- Stage124D restored lightweight API routes for /api/tasks and /api/events.
- Stage124E V2 forwards optional calendar range params from frontend fetchers to those routes.
- UI and frozen calendar visuals are not changed.
- The change is backward-compatible because all new params are optional.

## DECISION
Use optional \`from\`, \`to\`, and \`limit\` params instead of changing calendar UI behavior.

## TESTS
- npm run check:stage124e-calendar-range-params
- node --test tests/stage124e-calendar-range-params.test.cjs
- npm run check:stage124d-task-event-routes
- npm run check:stage124-supabase-egress-contract
- npm run build

## RISK
Calendar callers that do not provide a range still behave like before. Full egress reduction requires a following stage to pass visible month/week/day ranges from Calendar UI callers.

## NEXT
Stage124F should wire visible calendar range from Calendar page/sidebar callers into fetchCalendarBundleFromSupabase(options).
`;
  write('_project/runs/2026-05-19_stage124e_v2_calendar_task_event_range_params.md', run);

  appendOnce('_project/06_GUARDS_AND_TESTS.md', 'STAGE124E_CALENDAR_RANGE_QUERY_PARAMS', `## Stage124E - calendar task/event range params

- Guard: \`npm run check:stage124e-calendar-range-params\`
- Test: \`node --test tests/stage124e-calendar-range-params.test.cjs\`
- Contract: task/event frontend fetchers can pass optional \`from\`, \`to\`, \`limit\` params to lightweight /api/tasks and /api/events routes.
- Marker: STAGE124E_CALENDAR_RANGE_QUERY_PARAMS`);

  appendOnce('_project/07_NEXT_STEPS.md', 'Stage124F visible calendar range wiring', `## Stage124F visible calendar range wiring

After Stage124E, wire the visible Calendar page/sidebar month/week/day range into \`fetchCalendarBundleFromSupabase(options)\` so task/event reads are bounded by actual UI range.`);

  appendOnce('_project/08_CHANGELOG_AI.md', 'Stage124E V2 calendar task/event range params', `## 2026-05-19 - Stage124E V2 calendar task/event range params

- Added optional task/event range params in frontend Supabase fetchers.
- Added calendar bundle options forwarding.
- Added guard/test for range param contract.
- No UI or visual calendar changes.`);

  appendOnce('_project/12_IMPLEMENTATION_LEDGER.md', 'Stage124E V2 calendar task/event range params', `## Stage124E V2 calendar task/event range params

- Files: \`src/lib/supabase-fallback.ts\`, \`src/lib/calendar-items.ts\`, \`scripts/check-stage124e-calendar-range-params.cjs\`, \`tests/stage124e-calendar-range-params.test.cjs\`.
- Purpose: prepare frontend for ranged task/event API calls after Stage124D restored lightweight routes.
- Commit mode: manual selective git add only.`);

  appendOnce('_project/14_TEST_HISTORY.md', 'Stage124E V2 calendar task/event range params', `## Stage124E V2 calendar task/event range params

Expected green checks:
- \`npm run check:stage124e-calendar-range-params\`
- \`node --test tests/stage124e-calendar-range-params.test.cjs\`
- \`npm run check:stage124d-task-event-routes\`
- \`npm run check:stage124-supabase-egress-contract\`
- \`npm run build\``);
}

function main() {
  patchSupabaseFallback();
  patchCalendarItems();
  writeGuardAndTest();
  ensurePackageScript();
  writeProjectDocs();

  const changed = [
    'src/lib/supabase-fallback.ts',
    'src/lib/calendar-items.ts',
    'scripts/check-stage124e-calendar-range-params.cjs',
    'tests/stage124e-calendar-range-params.test.cjs',
    'package.json',
    '_project/runs/2026-05-19_stage124e_v2_calendar_task_event_range_params.md',
  ];
  console.log('Stage124E V2 changed files:');
  for (const file of changed) console.log('- ' + file);
}

main();
