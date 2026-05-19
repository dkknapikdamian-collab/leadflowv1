const fs = require('fs');
const path = require('path');

const STAGE = '2026-05-19_stage124e_calendar_task_event_range_params';
const root = process.cwd();
const backupRoot = path.join(root, '_backup_local', STAGE);

function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function write(file, text) { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), text, 'utf8'); }
function exists(file) { return fs.existsSync(path.join(root, file)); }
function backup(file) {
  if (!exists(file)) return;
  const src = path.join(root, file);
  const dst = path.join(backupRoot, file);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
}
function replaceOnce(text, needle, replacement, label) {
  if (!text.includes(needle)) throw new Error(`Stage124E missing anchor: ${label}`);
  return text.replace(needle, replacement);
}
function appendMarker(file, block) {
  let text = exists(file) ? read(file) : '';
  const firstLine = block.trim().split('\n')[0].trim();
  if (!text.includes(firstLine)) {
    text = text.replace(/\s*$/, '') + '\n\n' + block.trim() + '\n';
    write(file, text);
  }
}

function patchPackageJson() {
  const file = 'package.json';
  backup(file);
  const pkg = JSON.parse(read(file));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:stage124e-calendar-range-params'] = 'node scripts/check-stage124e-calendar-range-params.cjs';
  write(file, JSON.stringify(pkg, null, 2) + '\n');
}

function patchSupabaseFallback() {
  const file = 'src/lib/supabase-fallback.ts';
  backup(file);
  let text = read(file);
  if (!text.includes('STAGE124E_CALENDAR_RANGE_QUERY_PARAMS')) {
    const helper = `\n// STAGE124E_CALENDAR_RANGE_QUERY_PARAMS\ntype TaskEventRangeParamsStage124E = { from?: string; to?: string; limit?: number };\n\nfunction buildTaskEventRangeQueryStage124E(params?: TaskEventRangeParamsStage124E) {\n  const query = new URLSearchParams();\n  if (params?.from) query.set('from', params.from);\n  if (params?.to) query.set('to', params.to);\n  if (params?.limit) query.set('limit', String(params.limit));\n  const serialized = query.toString();\n  return serialized ? '?' + serialized : '';\n}\n`;
    text = text.replace('export async function fetchTasksFromSupabase()', helper + '\nexport async function fetchTasksFromSupabase()');
  }
  text = text.replace('export async function fetchTasksFromSupabase() {', 'export async function fetchTasksFromSupabase(params?: TaskEventRangeParamsStage124E) {');
  text = text.replace("const normalizedTasks = await callApi<Record<string, unknown>[]>('/api/tasks').then(normalizeTaskListContract);", "const normalizedTasks = await callApi<Record<string, unknown>[]>(`/api/tasks${buildTaskEventRangeQueryStage124E(params)}`).then(normalizeTaskListContract);");
  text = text.replace('export async function fetchEventsFromSupabase() {', 'export async function fetchEventsFromSupabase(params?: TaskEventRangeParamsStage124E) {');
  text = text.replace("const normalizedEvents = await callApi<Record<string, unknown>[]>('/api/events').then(normalizeEventListContract);", "const normalizedEvents = await callApi<Record<string, unknown>[]>(`/api/events${buildTaskEventRangeQueryStage124E(params)}`).then(normalizeEventListContract);");
  write(file, text);
}

function patchCalendarItems() {
  const file = 'src/lib/calendar-items.ts';
  backup(file);
  let text = read(file);
  if (!text.includes('export type CalendarBundleRangeOptions')) {
    text = replaceOnce(text, `export type CalendarBundle = {\n  tasks: CalendarTaskItem[];\n  events: CalendarEventItem[];\n  leads: Record<string, unknown>[];\n  cases: Record<string, unknown>[];\n};`, `export type CalendarBundle = {\n  tasks: CalendarTaskItem[];\n  events: CalendarEventItem[];\n  leads: Record<string, unknown>[];\n  cases: Record<string, unknown>[];\n};\n\n// STAGE124E_CALENDAR_RANGE_QUERY_PARAMS\nexport type CalendarBundleRangeOptions = {\n  from?: string;\n  to?: string;\n  limit?: number;\n};`, 'CalendarBundle type');
  }
  text = text.replace('export async function fetchCalendarBundleFromSupabase(): Promise<CalendarBundle> {', 'export async function fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {}): Promise<CalendarBundle> {');
  text = text.replace('readCollection(() => fetchTasksFromSupabase()),', 'readCollection(() => fetchTasksFromSupabase(options)),');
  text = text.replace('readCollection(() => fetchEventsFromSupabase()),', 'readCollection(() => fetchEventsFromSupabase(options)),');
  write(file, text);
}

function writeGuardAndTest() {
  write('scripts/check-stage124e-calendar-range-params.cjs', `const fs = require('fs');\nconst assert = require('assert');\n\nconst fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');\nconst calendar = fs.readFileSync('src/lib/calendar-items.ts', 'utf8');\n\nassert.ok(fallback.includes('STAGE124E_CALENDAR_RANGE_QUERY_PARAMS'), 'fallback must contain Stage124E marker');\nassert.ok(fallback.includes('type TaskEventRangeParamsStage124E'), 'fallback must define task/event range params type');\nassert.ok(fallback.includes('function buildTaskEventRangeQueryStage124E'), 'fallback must build task/event range query');\nassert.ok(fallback.includes('query.set(\\'from\\', params.from)'), 'fallback must forward from param');\nassert.ok(fallback.includes('query.set(\\'to\\', params.to)'), 'fallback must forward to param');\nassert.ok(fallback.includes('query.set(\\'limit\\', String(params.limit))'), 'fallback must forward limit param');\nassert.ok(fallback.includes('export async function fetchTasksFromSupabase(params?: TaskEventRangeParamsStage124E)'), 'tasks fetcher must accept range params');\nassert.ok(fallback.includes('export async function fetchEventsFromSupabase(params?: TaskEventRangeParamsStage124E)'), 'events fetcher must accept range params');\nassert.ok(fallback.includes('`/api/tasks${buildTaskEventRangeQueryStage124E(params)}`'), 'tasks fetcher must call /api/tasks with range query builder');\nassert.ok(fallback.includes('`/api/events${buildTaskEventRangeQueryStage124E(params)}`'), 'events fetcher must call /api/events with range query builder');\nassert.ok(!fallback.includes("callApi<Record<string, unknown>[]>('/api/tasks')"), 'tasks fetcher must not use bare /api/tasks');\nassert.ok(!fallback.includes("callApi<Record<string, unknown>[]>('/api/events')"), 'events fetcher must not use bare /api/events');\n\nassert.ok(calendar.includes('export type CalendarBundleRangeOptions'), 'calendar bundle must expose range options type');\nassert.ok(calendar.includes('fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})'), 'calendar bundle must accept range options');\nassert.ok(calendar.includes('fetchTasksFromSupabase(options)'), 'calendar bundle must pass options to task fetcher');\nassert.ok(calendar.includes('fetchEventsFromSupabase(options)'), 'calendar bundle must pass options to event fetcher');\nconsole.log('✔ Stage124E calendar task/event range params contract holds');\n`);
  write('tests/stage124e-calendar-range-params.test.cjs', `const fs = require('fs');\nconst assert = require('assert');\nconst test = require('node:test');\n\ntest('Stage124E wires calendar task/event range params through fallback and bundle', () => {\n  const fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');\n  const calendar = fs.readFileSync('src/lib/calendar-items.ts', 'utf8');\n  assert.match(fallback, /buildTaskEventRangeQueryStage124E/);\n  assert.match(fallback, /fetchTasksFromSupabase\\(params\\?: TaskEventRangeParamsStage124E\\)/);\n  assert.match(fallback, /fetchEventsFromSupabase\\(params\\?: TaskEventRangeParamsStage124E\\)/);\n  assert.ok(fallback.includes('`/api/tasks${buildTaskEventRangeQueryStage124E(params)}`'));\n  assert.ok(fallback.includes('`/api/events${buildTaskEventRangeQueryStage124E(params)}`'));\n  assert.doesNotMatch(fallback, /callApi<Record<string, unknown>\\[]>\\('\\/api\\/(tasks|events)'\\)/);\n  assert.match(calendar, /CalendarBundleRangeOptions/);\n  assert.match(calendar, /fetchCalendarBundleFromSupabase\\(options: CalendarBundleRangeOptions = \{\}\)/);\n  assert.match(calendar, /fetchTasksFromSupabase\\(options\\)/);\n  assert.match(calendar, /fetchEventsFromSupabase\\(options\\)/);\n});\n`);
}

function patchProjectDocs() {
  appendMarker('_project/06_GUARDS_AND_TESTS.md', `## Stage124E - calendar task/event range params guard\n\n- Guard: \`npm run check:stage124e-calendar-range-params\`.\n- Chroni przed regresja, w ktorej frontend znowu wola \`/api/tasks\` albo \`/api/events\` bez mozliwosci przekazania \`from/to/limit\`.\n- Stage124D route files zostaja lekkie; Stage124E dopina parametr range na poziomie klienta/fetchera.`);
  appendMarker('_project/07_NEXT_STEPS.md', `## Stage124E follow-up\n\n- Po wdrozeniu Stage124E nastepny etap powinien podac realny zakres widocznego kalendarza z UI do \`fetchCalendarBundleFromSupabase({ from, to })\`.\n- Nie zmieniac zamrozonego wygladu kalendarza. To ma byc tylko data-layer range propagation.`);
  appendMarker('_project/08_CHANGELOG_AI.md', `## 2026-05-19 - Stage124E calendar task/event range params\n\n- Dodano opcjonalne parametry \`from/to/limit\` do fetcherow task/event w \`src/lib/supabase-fallback.ts\`.\n- \`fetchCalendarBundleFromSupabase\` przyjmuje teraz opcjonalny range options object i przekazuje go do task/event fetcherow.\n- Dodano guard i test chroniace przed powrotem bare \`/api/tasks\` / \`/api/events\` calls.`);
  appendMarker('_project/12_IMPLEMENTATION_LEDGER.md', `## Stage124E - calendar task/event range params\n\nFAKTY Z KODU:\n- Stage124D utworzyl lekkie route files \`api/tasks.ts\` i \`api/events.ts\`.\n- Stage124E rozszerza klienta o range params, bez zmiany UI.\n\nDECYZJA:\n- Nie ruszac wizualnego kalendarza.\n- Zmieniac tylko data-layer: range params i guardy.\n\nTESTY:\n- \`npm run check:stage124e-calendar-range-params\`\n- \`node --test tests/stage124e-calendar-range-params.test.cjs\`\n- Stage124D guard\n- Stage124A guard\n- \`npm run build\``);
  appendMarker('_project/14_TEST_HISTORY.md', `## 2026-05-19 - Stage124E tests\n\n- Do uruchomienia po paczce:\n  - \`npm run check:stage124e-calendar-range-params\`\n  - \`node --test tests/stage124e-calendar-range-params.test.cjs\`\n  - \`npm run check:stage124d-task-event-routes\`\n  - \`npm run check:stage124-supabase-egress-contract\`\n  - \`npm run build\`\n\nStatus wpisac po lokalnym wykonaniu.`);
  write('_project/runs/2026-05-19_stage124e_calendar_task_event_range_params.md', `# Stage124E - Calendar task/event range params\n\nDate: 2026-05-19\nMode: ZIP/local-only, no automatic push.\n\n## Goal\n\nContinue Supabase egress reduction after Stage124D by wiring optional \`from/to/limit\` params through the frontend data layer for task/event reads.\n\n## Scope\n\n- \`src/lib/supabase-fallback.ts\`\n- \`src/lib/calendar-items.ts\`\n- Stage124E guard/test\n- _project docs\n\n## Non-goals\n\n- No visual calendar changes.\n- No modification of frozen month UI.\n- No commit/push by script.\n\n## Expected checks\n\n- \`npm run check:stage124e-calendar-range-params\`\n- \`node --test tests/stage124e-calendar-range-params.test.cjs\`\n- \`npm run check:stage124d-task-event-routes\`\n- \`npm run check:stage124-supabase-egress-contract\`\n- \`npm run build\`\n`);
}

patchPackageJson();
patchSupabaseFallback();
patchCalendarItems();
writeGuardAndTest();
patchProjectDocs();

console.log('Stage124E changed files:');
[
  'src/lib/supabase-fallback.ts',
  'src/lib/calendar-items.ts',
  'scripts/check-stage124e-calendar-range-params.cjs',
  'tests/stage124e-calendar-range-params.test.cjs',
  'tools/patch-stage124e-calendar-task-event-range-params.cjs',
  'package.json',
  '_project/runs/2026-05-19_stage124e_calendar_task_event_range_params.md',
].forEach((file) => console.log('- ' + file));
console.log('Backup root: ' + backupRoot);
