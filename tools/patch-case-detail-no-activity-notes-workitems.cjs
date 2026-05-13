const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.argv[2] || 'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow';

function fail(message) {
  console.error('[CASE_HISTORY_REMOVE_ACTIVITY_NOTES PATCH FAIL] ' + message);
  process.exit(1);
}

function read(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) fail('Brak pliku: ' + relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

function write(relativePath, content) {
  const fullPath = path.join(repoRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function addQuietGateTest(quiet, testPath) {
  const entry = `  '${testPath}',`;
  if (quiet.includes(entry)) return quiet;

  const anchors = [
    "  'tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs',",
    "  'tests/case-detail-v1-command-center.test.cjs',",
  ];

  for (const anchor of anchors) {
    if (quiet.includes(anchor)) return quiet.replace(anchor, `${anchor}\n${entry}`);
  }

  fail('Nie znaleziono anchoru CaseDetail w quiet gate.');
}

const casePath = 'src/pages/CaseDetail.tsx';
const quietPath = 'scripts/closeflow-release-check-quiet.cjs';
const checkPath = 'scripts/check-case-detail-no-activity-notes-workitems-2026-05-13.cjs';
const testPath = 'tests/case-detail-no-activity-notes-workitems-2026-05-13.test.cjs';
const docPath = 'docs/release/CLOSEFLOW_CASE_DETAIL_NO_ACTIVITY_NOTES_WORKITEMS_2026-05-13.md';

let source = read(casePath);

const marker = "CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_IN_WORKITEMS_2026_05_13";
if (!source.includes(marker)) {
  const anchor = "function buildWorkItems(";
  const idx = source.indexOf(anchor);
  if (idx < 0) fail('Nie znaleziono buildWorkItems.');
  const markerBlock = `const ${marker} = 'CaseActivity notes belong only to history rows, never to workItems cards';\nvoid ${marker};\n\n`;
  source = source.slice(0, idx) + markerBlock + source.slice(idx);
}

source = source.replace(
  'function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[], activities: CaseActivity[])',
  'function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[])'
);

const noteStartNeedle = '  const noteItems: WorkItem[] = activities.slice(0, 6).map((activity) => ({';
const noteStart = source.indexOf(noteStartNeedle);
if (noteStart >= 0) {
  const noteEndNeedle = '\n  }));';
  const noteEnd = source.indexOf(noteEndNeedle, noteStart);
  if (noteEnd < 0) fail('Znaleziono noteItems start, ale nie znaleziono końca bloku noteItems.');
  source = source.slice(0, noteStart) + source.slice(noteEnd + noteEndNeedle.length + 1);
}

source = source.replace(
  'return [...taskItems, ...eventItems, ...missingItems, ...noteItems].sort((first, second) => first.sortTime - second.sortTime);',
  'return [...taskItems, ...eventItems, ...missingItems].sort((first, second) => first.sortTime - second.sortTime);'
);

source = source.replace(
  'const workItems = useMemo(() => dedupeCaseWorkItems(buildWorkItems(openTasks, plannedEvents, items, activities)), [activities, items, openTasks, plannedEvents]);',
  'const workItems = useMemo(() => dedupeCaseWorkItems(buildWorkItems(openTasks, plannedEvents, items)), [items, openTasks, plannedEvents]);'
);

if (!source.includes(marker)) fail('Brak markera no activity notes in workitems.');
if (source.includes('const noteItems: WorkItem[] = activities.slice(0, 6)')) fail('noteItems nadal istnieje w buildWorkItems.');
if (source.includes('...noteItems')) fail('return buildWorkItems nadal zawiera noteItems.');
if (source.includes('buildWorkItems(openTasks, plannedEvents, items, activities)')) fail('useMemo nadal przekazuje activities do buildWorkItems.');
if (source.includes('function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[], activities: CaseActivity[])')) fail('buildWorkItems nadal przyjmuje activities.');

write(casePath, source);

write(checkPath, `const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repoRoot, 'src/pages/CaseDetail.tsx'), 'utf8');
const quiet = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');

function fail(message) {
  console.error('FAIL check:case-detail-no-activity-notes-workitems:', message);
  process.exit(1);
}

for (const token of [
  'CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_IN_WORKITEMS_2026_05_13',
  'function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[])',
  'buildWorkItems(openTasks, plannedEvents, items)',
  '<article className="case-history-row"',
  '<article key={activity.id} className="case-detail-history-row"',
]) {
  if (!source.includes(token)) fail('Brak tokenu: ' + token);
}

for (const forbidden of [
  'const noteItems: WorkItem[] = activities.slice(0, 6)',
  '...noteItems',
  'buildWorkItems(openTasks, plannedEvents, items, activities)',
  'function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[], activities: CaseActivity[])',
]) {
  if (source.includes(forbidden)) fail('Zabroniony przeciek aktywnosci do workItems: ' + forbidden);
}

if (!quiet.includes("'tests/case-detail-no-activity-notes-workitems-2026-05-13.test.cjs'")) {
  fail('Quiet gate nie zawiera testu no activity notes workitems.');
}

console.log('OK check:case-detail-no-activity-notes-workitems');
`);

write(testPath, `const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Case activities are not converted to operational work item cards', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_IN_WORKITEMS_2026_05_13'));
  assert.ok(source.includes('function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[])'));
  assert.equal(source.includes('const noteItems: WorkItem[] = activities.slice(0, 6)'), false);
  assert.equal(source.includes('...noteItems'), false);
  assert.equal(source.includes('buildWorkItems(openTasks, plannedEvents, items, activities)'), false);
});

test('CaseDetail still keeps compact history renders for activities', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('<article className="case-history-row"'));
  assert.ok(source.includes('<article key={activity.id} className="case-detail-history-row"'));
  assert.ok(source.includes('activities.map((activity) => ('));
});

test('no activity notes workitems test is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes("'tests/case-detail-no-activity-notes-workitems-2026-05-13.test.cjs'"));
});
`);

let quiet = read(quietPath);
quiet = addQuietGateTest(quiet, testPath);
if (quiet.includes("',\\n  '")) fail('Quiet gate zawiera literalny backslash+n.');
write(quietPath, quiet);

write(docPath, `# CloseFlow - CaseDetail no activity notes in workItems - 2026-05-13

## Problem

Historia sprawy dalej wygladala jak dwa systemy, bo buildWorkItems() doklejal activities jako noteItems i renderowal je przez WorkItemRow / case-detail-work-row.

## Decyzja

CaseActivity nalezy do historii, nie do operacyjnych workItems.

## Naprawa

- buildWorkItems przyjmuje tylko tasks, events, items.
- usunieto noteItems tworzone z activities.
- workItems useMemo nie zalezy juz od activities.
- historia nadal renderuje activities przez case-history-row / case-detail-history-row.
- dodano test do quiet release gate.

## Weryfikacja

- node scripts/check-case-detail-no-activity-notes-workitems-2026-05-13.cjs
- node --test tests/case-detail-no-activity-notes-workitems-2026-05-13.test.cjs
- node --check scripts/closeflow-release-check-quiet.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
`);

console.log('OK patch-case-detail-no-activity-notes-workitems');
