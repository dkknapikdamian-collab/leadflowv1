#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function section(title) { console.log('\n== ' + title + ' =='); }
function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}
function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message);
  else fail(scope, message + ' [needle=' + JSON.stringify(needle) + ']');
}
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
}
function findButtonBlocks(content) {
  const blocks = [];
  let index = 0;
  while (true) {
    const start = content.indexOf('<Button', index);
    if (start < 0) break;
    const endRaw = content.indexOf('</Button>', start);
    if (endRaw < 0) break;
    const end = endRaw + '</Button>'.length;
    blocks.push(content.slice(start, end));
    index = end;
  }
  return blocks;
}

const files = {
  globalActions: 'src/components/GlobalQuickActions.tsx',
  tasks: 'src/pages/Tasks.tsx',
  releaseDoc: 'docs/release/HOTFIX_GLOBAL_TASK_ACTION_MODAL_NO_ROUTE_2026-05-04.md',
  technicalDoc: 'docs/technical/GLOBAL_TASK_ACTION_MODAL_NO_ROUTE_HOTFIX_2026-05-04.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
  test: 'tests/hotfix-global-task-action-modal-no-route.test.cjs',
};

const globalActionsRaw = readRequired(files.globalActions);
const globalActions = stripComments(globalActionsRaw);
const tasksRaw = readRequired(files.tasks);
const tasks = stripComments(tasksRaw);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);
readRequired(files.test);

section('Global top task action');
assertIncludes(files.globalActions, globalActionsRaw, 'GLOBAL_TASK_ACTION_MODAL_NO_ROUTE_HOTFIX', 'Hotfix marker exists');
assertIncludes(files.globalActions, globalActions, 'data-global-task-create-dialog-trigger="true"', 'Top Zadanie button is a modal trigger');
assertIncludes(files.globalActions, globalActions, 'data-global-task-create-dialog="true"', 'Global task create dialog exists');
assertIncludes(files.globalActions, globalActions, 'data-global-task-create-form="true"', 'Global task create form exists');
assertIncludes(files.globalActions, globalActions, 'openGlobalTaskDialog', 'Global task button calls openGlobalTaskDialog');
assertIncludes(files.globalActions, globalActions, 'handleGlobalTaskSubmit', 'Global task dialog submits through handler');
assertIncludes(files.globalActions, globalActions, 'insertTaskToSupabase', 'Global task dialog writes task through Supabase fallback');
assertIncludes(files.globalActions, globalActions, 'requireWorkspaceId(workspace)', 'Global task dialog keeps workspace check');

if (/rememberGlobalQuickAction\(['"]task['"]\)/.test(globalActions)) {
  fail(files.globalActions, 'Global task action still dispatches route-open action');
} else {
  pass(files.globalActions, 'Global task action no longer dispatches route-open action');
}

const badTaskButtons = findButtonBlocks(globalActions).filter((block) => (
  /\basChild\b/.test(block) &&
  (
    block.includes('data-global-quick-action="task"') ||
    block.includes("data-global-quick-action='task'") ||
    /to=["']\/tasks\?quick=task["']/.test(block) ||
    /rememberGlobalQuickAction\(['"]task['"]\)/.test(block)
  )
));
if (badTaskButtons.length === 0) pass(files.globalActions, 'Global task action is not an asChild Link wrapper');
else fail(files.globalActions, 'Global task action still has asChild/Link wrapper count=' + badTaskButtons.length);

section('Tasks page green add button');
assertIncludes(files.tasks, tasksRaw, 'TASKS_PAGE_GREEN_ADD_BUTTON_REMOVED_HOTFIX', 'Tasks page removal marker exists');
const remainingGreenAddButtons = findButtonBlocks(tasks).filter((block) => (
  block.includes('setIsNewTaskOpen(true)')
  && /(Dodaj zadanie|Nowe zadanie|Zadanie)/.test(block)
  && /(btn primary|primary|bg-green|bg-emerald|emerald|green)/i.test(block)
));
if (remainingGreenAddButtons.length === 0) pass(files.tasks, 'No green/primary add task button remains in Tasks page');
else fail(files.tasks, 'Green/primary add task button remains count=' + remainingGreenAddButtons.length);

section('Documentation');
for (const marker of [
  'HOTFIX - Global Zadanie opens modal without route change',
  'Zadanie w górnym pasku',
  'nie przenosi do /tasks',
  'zielony przycisk dodawania zadania w /tasks jest usunięty',
]) assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);

for (const marker of [
  'GLOBAL TASK ACTION MODAL NO ROUTE HOTFIX',
  'src/components/GlobalQuickActions.tsx',
  'src/pages/Tasks.tsx',
  'data-global-task-create-dialog',
]) assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }

const scripts = pkg.scripts || {};
if (scripts['check:hotfix-global-task-action-modal-no-route'] === 'node scripts/check-hotfix-global-task-action-modal-no-route.cjs') pass(files.pkg, 'check:hotfix-global-task-action-modal-no-route is wired');
else fail(files.pkg, 'missing check:hotfix-global-task-action-modal-no-route');

if (scripts['test:hotfix-global-task-action-modal-no-route'] === 'node --test tests/hotfix-global-task-action-modal-no-route.test.cjs') pass(files.pkg, 'test:hotfix-global-task-action-modal-no-route is wired');
else fail(files.pkg, 'missing test:hotfix-global-task-action-modal-no-route');

assertIncludes(files.quiet, quiet, 'tests/hotfix-global-task-action-modal-no-route.test.cjs', 'Quiet release gate includes hotfix test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL hotfix global task action modal no-route guard failed.');
  process.exit(1);
}
console.log('\nPASS hotfix global task action modal no-route guard');
