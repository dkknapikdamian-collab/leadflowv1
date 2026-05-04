#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function read(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    fail(relativePath, 'Missing file');
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
}
function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function expect(scope, condition, message) { condition ? pass(scope, message) : fail(scope, message); }

const globalRaw = read('src/components/GlobalQuickActions.tsx');
const globalSource = stripComments(globalRaw);
const tasksRaw = read('src/pages/Tasks.tsx');
const tasksSource = stripComments(tasksRaw);
const pkgRaw = read('package.json');
const quiet = read('scripts/closeflow-release-check-quiet.cjs');

expect('src/components/GlobalQuickActions.tsx', /STAGE45C_GLOBAL_TASK_SINGLE_MODAL/.test(globalRaw), 'Stage45C single modal marker exists');
expect('src/components/GlobalQuickActions.tsx', /to="\/tasks\?quick=task"/.test(globalSource), 'Global Zadanie routes to /tasks?quick=task');
expect('src/components/GlobalQuickActions.tsx', /rememberGlobalQuickAction\(['"]task['"]\)/.test(globalSource), 'Global Zadanie stores task intent');
expect('src/components/GlobalQuickActions.tsx', !/data-global-task-create-dialog="true"/.test(globalSource), 'Separate toolbar task dialog is removed');
expect('src/components/GlobalQuickActions.tsx', !/insertTaskToSupabase/.test(globalSource), 'Global toolbar no longer writes tasks directly');
expect('src/pages/Tasks.tsx', /consumeGlobalQuickAction\(\) === ['"]task['"]/.test(tasksSource), 'Tasks page consumes global task intent');
expect('src/pages/Tasks.tsx', /setIsNewTaskOpen\(true\)/.test(tasksSource), 'Tasks page opens task modal');
expect('src/pages/Tasks.tsx', /TaskReminderEditor/.test(tasksSource), 'Tasks page modal keeps reminder editor');

let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass('package.json', 'package.json parses'); }
catch (error) { fail('package.json', 'package.json parse failed: ' + error.message); }
expect('package.json', pkg.scripts && pkg.scripts['verify:global-task-unified-modal'] === 'node scripts/verify-global-task-unified-modal.mjs', 'verify:global-task-unified-modal is wired');
expect('scripts/closeflow-release-check-quiet.cjs', quiet.includes('tests/hotfix-global-task-action-modal-no-route.test.cjs'), 'Quiet gate includes legacy hotfix test file');

for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL global task unified modal guard failed.');
  process.exit(1);
}
console.log('\nPASS global task unified modal guard');
