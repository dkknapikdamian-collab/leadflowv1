import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), 'utf8').replace(/^\uFEFF/, '');
}
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
}
function fail(message) {
  console.error('FAIL global task unified modal: ' + message);
  process.exit(1);
}

const globalRaw = read('src/components/GlobalQuickActions.tsx');
const globalSource = stripComments(globalRaw);
const tasksRaw = read('src/pages/Tasks.tsx');
const tasksSource = stripComments(tasksRaw);
const pkg = JSON.parse(read('package.json'));

if (!globalRaw.includes('STAGE45C_GLOBAL_TASK_SINGLE_MODAL')) fail('missing Stage45C marker');
if (!/to="\/tasks\?quick=task"/.test(globalSource)) fail('global Zadanie does not route to /tasks?quick=task');
if (!/rememberGlobalQuickAction\(['"]task['"]\)/.test(globalSource)) fail('global Zadanie does not store task intent');
if (/data-global-task-create-dialog="true"|data-global-task-create-form="true"|openGlobalTaskDialog|insertTaskToSupabase/.test(globalSource)) {
  fail('separate toolbar task modal or direct write path is still present');
}
if (!/consumeGlobalQuickAction/.test(tasksSource) || !/consumeGlobalQuickAction\(\) === ['"]task['"]/.test(tasksSource) || !/setIsNewTaskOpen\(true\)/.test(tasksSource)) {
  fail('Tasks page is not the owner of the global task create modal');
}
if (!/TaskReminderEditor/.test(tasksSource)) fail('Tasks create/edit flow does not keep reminder editor');
if (pkg.scripts?.['verify:global-task-unified-modal'] !== 'node scripts/verify-global-task-unified-modal.mjs') {
  fail('package script verify:global-task-unified-modal missing');
}

console.log('PASS global task unified modal: global Zadanie opens the Tasks page modal and the separate toolbar task modal is removed.');
