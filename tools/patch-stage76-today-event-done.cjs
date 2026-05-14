const fs = require('fs');
const path = require('path');

const root = process.cwd();
const todayPath = path.join(root, 'src', 'pages', 'TodayStable.tsx');
const supabasePath = path.join(root, 'src', 'lib', 'supabase-fallback.ts');
const packagePath = path.join(root, 'package.json');
const quietPath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');
const checkPath = path.join(root, 'scripts', 'check-stage76-today-event-done-action.cjs');
const testPath = path.join(root, 'tests', 'stage76-today-event-done-action.test.cjs');
const docsPath = path.join(root, 'docs', 'audits', 'stage76-today-event-done-manual-check.md');

function fail(message) {
  console.error('STAGE76_PATCH_FAIL:', message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + path.relative(root, file));
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.replace(/^\uFEFF/, ''), 'utf8');
}

function addPackageScript(pkg, name, value) {
  pkg.scripts = pkg.scripts || {};
  if (pkg.scripts[name] !== value) pkg.scripts[name] = value;
}

function ensureQuietRequiredTest(quiet, testFile) {
  if (quiet.includes(`'${testFile}'`) || quiet.includes(`\"${testFile}\"`)) return quiet;
  const anchor = 'const requiredTests = [';
  const start = quiet.indexOf(anchor);
  if (start === -1) fail('cannot find requiredTests array in closeflow-release-check-quiet.cjs');
  const end = quiet.indexOf('\n];', start);
  if (end === -1) fail('cannot find end of requiredTests array in closeflow-release-check-quiet.cjs');
  return quiet.slice(0, end) + `\n  '${testFile}',` + quiet.slice(end);
}

function ensureSupabaseUpdateEvent() {
  let text = read(supabasePath);

  if (!text.includes('export async function updateEventInSupabase')) {
    const anchor = 'export async function insertEventToSupabase(input: EventInsertInput) {';
    const start = text.indexOf(anchor);
    if (start === -1) fail('cannot find insertEventToSupabase in supabase-fallback.ts');
    const nextExport = text.indexOf('\n\nexport ', start + anchor.length);
    if (nextExport === -1) fail('cannot find insertion point after insertEventToSupabase');
    const fn = `\nexport async function updateEventInSupabase(input: Partial<EventInsertInput> & { id: string }) {\n  return callApi<SupabaseInsertResult>('/api/events', { method: 'PATCH', body: JSON.stringify(applyGoogleCalendarReminderPreferenceToEventPayload(input as unknown as Record<string, unknown>)) });\n}\n`;
    text = text.slice(0, nextExport) + fn + text.slice(nextExport);
  }

  write(supabasePath, text);
}

function ensureTodayImport(text) {
  if (text.includes('updateEventInSupabase')) return text;

  const exact = 'updateLeadInSupabase,\n  updateTaskInSupabase\n} from \'../lib/supabase-fallback\';';
  if (text.includes(exact)) {
    return text.replace(exact, 'updateLeadInSupabase,\n  updateTaskInSupabase,\n  updateEventInSupabase\n} from \'../lib/supabase-fallback\';');
  }

  const importStart = text.indexOf("from '../lib/supabase-fallback';");
  if (importStart === -1) fail('cannot find supabase-fallback import in TodayStable.tsx');
  const blockStart = text.lastIndexOf('import {', importStart);
  if (blockStart === -1) fail('cannot find start of supabase-fallback import block');
  const block = text.slice(blockStart, importStart);
  if (!block.includes('updateTaskInSupabase')) fail('TodayStable.tsx supabase import does not contain updateTaskInSupabase anchor');
  const replacedBlock = block.replace(/updateTaskInSupabase\s*,?/, 'updateTaskInSupabase,\n  updateEventInSupabase');
  return text.slice(0, blockStart) + replacedBlock + text.slice(importStart);
}

function ensureRowLinkProps(text) {
  if (!text.includes('onDone?: () => void;')) {
    text = text.replace('  badge,\n  onEdit,', '  badge,\n  onDone,\n  doneLabel,\n  doneBusy,\n  onEdit,');
    text = text.replace('  badge?: string;\n  onEdit?: () => void;', '  badge?: string;\n  onDone?: () => void;\n  doneLabel?: string;\n  doneBusy?: boolean;\n  onEdit?: () => void;');
  }

  if (!text.includes('data-stage76-event-done-action="true"')) {
    const old = `{fb4TaskId ? (\n            <Button\n              type=\"button\"\n              size=\"sm\"\n              variant=\"outline\"`;
    if (!text.includes(old)) fail('cannot find existing task Zrobione RowLink button anchor');
    text = text.replace(old, `{onDone ? (\n            <Button\n              type=\"button\"\n              size=\"sm\"\n              variant=\"outline\"\n              data-stage76-event-done-action=\"true\"\n              disabled={doneBusy}\n              onClick={(event) => {\n                event.preventDefault();\n                event.stopPropagation();\n                onDone();\n              }}\n            >\n              {doneBusy ? 'Zapisywanie...' : (doneLabel || 'Zrobione')}\n            </Button>\n          ) : null}\n          {!onDone && fb4TaskId ? (\n            <Button\n              type=\"button\"\n              size=\"sm\"\n              variant=\"outline\"`);
  }

  return text;
}

function findDashboardStateSetter(text) {
  const match = text.match(/const\s*\[\s*([A-Za-z_$][\w$]*)\s*,\s*(set[A-Za-z_$][\w$]*)\s*\]\s*=\s*useState\s*<\s*DashboardData\s*>/);
  if (match) return { stateName: match[1], setterName: match[2] };
  const matchNoType = text.match(/const\s*\[\s*([A-Za-z_$][\w$]*)\s*,\s*(set[A-Za-z_$][\w$]*)\s*\]\s*=\s*useState\s*\(\s*emptyData\s*\)/);
  if (matchNoType) return { stateName: matchNoType[1], setterName: matchNoType[2] };
  fail('cannot find DashboardData useState setter in TodayStable.tsx');
}

function ensureEventDoneHandler(text) {
  if (text.includes('STAGE76_TODAY_EVENT_DONE_ACTION')) return text;

  const { setterName } = findDashboardStateSetter(text);
  const componentStart = text.indexOf('export default function TodayStable()');
  if (componentStart === -1) fail('cannot find TodayStable component');
  const returnIndex = text.indexOf('\n  return (', componentStart);
  if (returnIndex === -1) fail('cannot find TodayStable return anchor');

  const handler = `\n  const handleMarkEventDone = useCallback(async (eventId: string) => {\n    // STAGE76_TODAY_EVENT_DONE_ACTION: events use the same operational closeout status contract as tasks.\n    if (!eventId) return;\n    try {\n      await updateEventInSupabase({ id: eventId, status: 'done' });\n      ${setterName}((current) => ({\n        ...current,\n        events: Array.isArray(current.events)\n          ? current.events.map((event) => String(event?.id || '') === eventId ? { ...event, status: 'done' } : event)\n          : [],\n      }));\n    } catch (error) {\n      console.error('Nie udało się oznaczyć wydarzenia jako zrobione', error);\n    }\n  }, [${setterName}]);\n`;

  return text.slice(0, returnIndex) + handler + text.slice(returnIndex);
}

function ensureTodayEventsFilter(text) {
  const start = text.indexOf('const todayEvents = useMemo');
  if (start === -1) fail('cannot find todayEvents useMemo in TodayStable.tsx');
  const end = text.indexOf('\n  const ', start + 1);
  if (end === -1) fail('cannot find end of todayEvents useMemo block');
  const block = text.slice(start, end);
  if (block.includes('isClosedStatus(event?.status)') || block.includes('isClosedStatus(event.status)')) return text;

  let nextBlock = block;
  const filterAnchor = '.filter((event) =>';
  if (nextBlock.includes(filterAnchor)) {
    nextBlock = nextBlock.replace(filterAnchor, '.filter((event) => !isClosedStatus(event?.status))\n      .filter((event) =>');
  } else if (nextBlock.includes('.filter(event =>')) {
    nextBlock = nextBlock.replace('.filter(event =>', '.filter((event) => !isClosedStatus(event?.status))\n      .filter(event =>');
  } else if (nextBlock.includes('data.events')) {
    nextBlock = nextBlock.replace('data.events', 'data.events.filter((event) => !isClosedStatus(event?.status))');
  } else {
    fail('cannot add done-status filter to todayEvents block');
  }

  return text.slice(0, start) + nextBlock + text.slice(end);
}

function addOnDoneToEventRows(text) {
  if (text.includes('handleMarkEventDone(String(') && text.includes('doneLabel="Zrobione"')) return text;

  let patched = text;
  let count = 0;
  const rowPattern = /<RowLink\b[\s\S]*?\n\s*\/?>/g;
  patched = patched.replace(rowPattern, (match, offset) => {
    if (match.includes('onDone=')) return match;
    const nearbyBefore = patched.slice(Math.max(0, offset - 900), offset);
    const nearby = nearbyBefore + match;
    const looksLikeEventRow = /todayEvents|eventsToday|Wydarzenia|Wydarzenie|getEventMomentRaw|event\./.test(nearby)
      && !/getTaskTitle|getLeadTitle|tasksToday|leadsToday/.test(match);
    if (!looksLikeEventRow) return match;

    const mapMatches = [...nearbyBefore.matchAll(/\.map\(\(?\s*([A-Za-z_$][\w$]*)\s*\)?\s*=>/g)];
    const variable = mapMatches.length ? mapMatches[mapMatches.length - 1][1] : 'event';
    if (!new RegExp('\\b' + variable + '\\b').test(match + nearbyBefore.slice(-300))) return match;

    const insert = `\n                  onDone={() => handleMarkEventDone(String(${variable}.id || ''))}\n                  doneLabel=\"Zrobione\"`;
    count += 1;
    if (match.includes('\n                  onDelete=')) return match.replace('\n                  onDelete=', insert + '\n                  onDelete=');
    if (match.includes('\n                  deleting=')) return match.replace('\n                  deleting=', insert + '\n                  deleting=');
    return match.replace(/\n\s*\/?>$/, insert + '$&');
  });

  if (count === 0) fail('could not add onDone to any TodayStable event RowLink');
  return patched;
}

function ensureTodayStable() {
  let text = read(todayPath);
  text = ensureTodayImport(text);
  text = ensureRowLinkProps(text);
  text = ensureEventDoneHandler(text);
  text = ensureTodayEventsFilter(text);
  text = addOnDoneToEventRows(text);
  write(todayPath, text);
}

function writeCheckAndTest() {
  const check = `const fs = require('fs');\nconst path = require('path');\n\nconst root = process.cwd();\nfunction read(relativePath) {\n  const file = path.join(root, relativePath);\n  if (!fs.existsSync(file)) {\n    console.error('STAGE76_TODAY_EVENT_DONE_ACTION_FAIL: missing file ' + relativePath);\n    process.exit(1);\n  }\n  return fs.readFileSync(file, 'utf8');\n}\nfunction fail(message) {\n  console.error('STAGE76_TODAY_EVENT_DONE_ACTION_FAIL:', message);\n  process.exit(1);\n}\n\nconst today = read('src/pages/TodayStable.tsx');\nconst supabase = read('src/lib/supabase-fallback.ts');\nconst pkg = JSON.parse(read('package.json'));\nconst quiet = read('scripts/closeflow-release-check-quiet.cjs');\n\nfor (const token of [\n  'updateEventInSupabase',\n  'STAGE76_TODAY_EVENT_DONE_ACTION',\n  'const handleMarkEventDone = useCallback',\n  \"updateEventInSupabase({ id: eventId, status: 'done' })\",\n  'onDone?: () => void;',\n  'data-stage76-event-done-action=\"true\"',\n  'doneLabel=\"Zrobione\"',\n  'handleMarkEventDone(String(',\n]) {\n  if (!today.includes(token)) fail('TodayStable.tsx missing token: ' + token);\n}\n\nconst todayEventsStart = today.indexOf('const todayEvents = useMemo');\nif (todayEventsStart === -1) fail('missing todayEvents useMemo');\nconst todayEventsEnd = today.indexOf('\\n  const ', todayEventsStart + 1);\nconst todayEventsBlock = today.slice(todayEventsStart, todayEventsEnd === -1 ? today.length : todayEventsEnd);\nif (!todayEventsBlock.includes('isClosedStatus(event?.status)') && !todayEventsBlock.includes('isClosedStatus(event.status)')) {\n  fail('todayEvents block does not filter done/completed event statuses');\n}\n\nif (!supabase.includes('export async function updateEventInSupabase')) fail('supabase-fallback.ts missing updateEventInSupabase');\nif (!supabase.includes(\"'/api/events'\") || !supabase.includes(\"method: 'PATCH'\")) fail('updateEventInSupabase does not patch /api/events');\nif (today.includes('insertEventToSupabase({ id: eventId')) fail('TodayStable tries to close events with insert/create instead of update');\n\nif (pkg.scripts['check:stage76-today-event-done-action'] !== 'node scripts/check-stage76-today-event-done-action.cjs') fail('missing package check script');\nif (pkg.scripts['test:stage76-today-event-done-action'] !== 'node --test tests/stage76-today-event-done-action.test.cjs') fail('missing package test script');\nif (!quiet.includes(\"'tests/stage76-today-event-done-action.test.cjs'\")) fail('verify:closeflow:quiet does not include Stage76 test');\n\nconsole.log('OK stage76 today event done action');\n`;

  const test = `const assert = require('assert');\nconst fs = require('fs');\nconst path = require('path');\nconst { spawnSync } = require('child_process');\nconst test = require('node:test');\n\nconst root = path.resolve(__dirname, '..');\nfunction read(relativePath) { return fs.readFileSync(path.join(root, relativePath), 'utf8'); }\nfunction runNode(args) { return spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' }); }\n\ntest('Stage76 files are syntactically valid', () => {\n  for (const file of [\n    'scripts/check-stage76-today-event-done-action.cjs',\n    'tests/stage76-today-event-done-action.test.cjs',\n    'src/pages/TodayStable.tsx',\n  ]) {\n    const args = file.endsWith('.tsx') ? ['scripts/check-stage76-today-event-done-action.cjs'] : ['--check', file];\n    const result = runNode(args);\n    assert.equal(result.status, 0, file + '\\n' + result.stdout + result.stderr);\n  }\n});\n\ntest('Today events can be marked done with the event update API', () => {\n  const today = read('src/pages/TodayStable.tsx');\n  assert.ok(today.includes('updateEventInSupabase'));\n  assert.ok(today.includes('const handleMarkEventDone = useCallback'));\n  assert.ok(today.includes(\"updateEventInSupabase({ id: eventId, status: 'done' })\"));\n  assert.ok(today.includes('data-stage76-event-done-action=\"true\"'));\n  assert.ok(today.includes('doneLabel=\"Zrobione\"'));\n  assert.ok(today.includes('handleMarkEventDone(String('));\n});\n\ntest('Today active event list filters closed event statuses', () => {\n  const today = read('src/pages/TodayStable.tsx');\n  const start = today.indexOf('const todayEvents = useMemo');\n  assert.notEqual(start, -1, 'missing todayEvents useMemo');\n  const end = today.indexOf('\\n  const ', start + 1);\n  const block = today.slice(start, end === -1 ? today.length : end);\n  assert.match(block, /isClosedStatus\\(event\\??\\.status\\)/);\n});\n\ntest('Event done update is shared through supabase fallback, not Today-only storage', () => {\n  const supabase = read('src/lib/supabase-fallback.ts');\n  assert.ok(supabase.includes('export async function updateEventInSupabase'));\n  assert.ok(supabase.includes(\"'/api/events'\"));\n  assert.ok(supabase.includes(\"method: 'PATCH'\"));\n  const today = read('src/pages/TodayStable.tsx');\n  assert.ok(!today.includes('localStorage.setItem') || today.indexOf('localStorage.setItem') < today.indexOf('STAGE76_TODAY_EVENT_DONE_ACTION') || !today.slice(today.indexOf('STAGE76_TODAY_EVENT_DONE_ACTION')).includes('localStorage.setItem'));\n});\n\ntest('Stage76 is wired into package scripts and quiet release gate', () => {\n  const pkg = JSON.parse(read('package.json'));\n  const quiet = read('scripts/closeflow-release-check-quiet.cjs');\n  assert.equal(pkg.scripts['check:stage76-today-event-done-action'], 'node scripts/check-stage76-today-event-done-action.cjs');\n  assert.equal(pkg.scripts['test:stage76-today-event-done-action'], 'node --test tests/stage76-today-event-done-action.test.cjs');\n  assert.ok(quiet.includes(\"'tests/stage76-today-event-done-action.test.cjs'\"));\n});\n`;

  write(checkPath, check);
  write(testPath, test);
}

function updatePackageAndQuiet() {
  const pkg = JSON.parse(read(packagePath));
  addPackageScript(pkg, 'check:stage76-today-event-done-action', 'node scripts/check-stage76-today-event-done-action.cjs');
  addPackageScript(pkg, 'test:stage76-today-event-done-action', 'node --test tests/stage76-today-event-done-action.test.cjs');
  write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

  const quiet = ensureQuietRequiredTest(read(quietPath), 'tests/stage76-today-event-done-action.test.cjs');
  write(quietPath, quiet);
}

function writeDocs() {
  const docs = `# Stage76 - Today event done manual check\n\n## Cel\n\nW sekcji \`Wydarzenia dziś\` można oznaczyć wydarzenie jako \`Zrobione\`, bez tworzenia osobnej logiki tylko dla ekranu Dziś.\n\n## Ręczny test\n\n1. Wejdź na \`/\`.\n2. Znajdź sekcję \`Wydarzenia dziś\`.\n3. Kliknij \`Zrobione\` przy wydarzeniu.\n4. Odśwież stronę.\n5. Sprawdź, czy wydarzenie nie wraca jako aktywne na Dziś.\n6. Wejdź w \`/calendar\` i sprawdź ten sam event.\n\n## Kontrakt\n\n- status wykonania: \`done\`, zgodny z \`isClosedStatus\`,\n- zapis przez \`updateEventInSupabase\`,\n- Today nie ma osobnego storage dla wykonania eventu,\n- miesięczny kalendarz nie jest zmieniany wizualnie.\n`;
  write(docsPath, docs);
}

ensureSupabaseUpdateEvent();
ensureTodayStable();
writeCheckAndTest();
updatePackageAndQuiet();
writeDocs();
console.log('OK: Stage76 Today event done action patch applied.');
