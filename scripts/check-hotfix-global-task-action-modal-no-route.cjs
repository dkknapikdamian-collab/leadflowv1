#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];
function read(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) { fail(relativePath, 'Missing file'); return ''; }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}
const blockComment = new RegExp('/\\*[\\s\\S]*?\\*/', 'g');
const jsxComment = new RegExp('\\{\/\\*[\\s\\S]*?\\*\/\\}', 'g');
function stripComments(source) { return source.replace(blockComment, '').replace(jsxComment, ''); }
function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function expect(scope, condition, message) { condition ? pass(scope, message) : fail(scope, message); }

const globalRaw = read('src/components/GlobalQuickActions.tsx');
const globalSource = stripComments(globalRaw);
const taskDialog = read('src/components/TaskCreateDialog.tsx');
const tasksStable = stripComments(read('src/pages/TasksStable.tsx'));
const pkgRaw = read('package.json');
const quiet = read('scripts/closeflow-release-check-quiet.cjs');
const taskButton = (globalSource.match(/<Button[^>]*data-global-quick-action="task"[\s\S]*?<\/Button>/) || [''])[0];

expect('src/components/GlobalQuickActions.tsx', /data-global-task-direct-modal-trigger="true"/.test(globalSource), 'Global Zadanie has direct modal trigger');
expect('src/components/GlobalQuickActions.tsx', /setIsTaskCreateOpen\(true\)/.test(taskButton), 'Global Zadanie opens task modal directly');
expect('src/components/GlobalQuickActions.tsx', !/to="\/tasks/.test(taskButton), 'Global Zadanie does not route to /tasks');
expect('src/components/GlobalQuickActions.tsx', !/asChild/.test(taskButton), 'Global Zadanie does not use asChild route wrapper');
expect('src/components/TaskCreateDialog.tsx', /insertTaskToSupabase/.test(taskDialog), 'Shared task dialog writes tasks');
expect('src/components/TaskCreateDialog.tsx', /Przypomnienie/.test(taskDialog), 'Shared task dialog exposes reminder options');
expect('src/pages/TasksStable.tsx', !/onClick=\{openNewTask\}/.test(tasksStable), 'Real TasksStable header add CTA is removed');
expect('src/pages/TasksStable.tsx', !/Stabilny widok Supabase bez bramki Firebase/.test(tasksStable), 'Real TasksStable technical copy is removed');

let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass('package.json', 'package.json parses'); } catch (error) { fail('package.json', 'package.json parse failed: ' + error.message); }
expect('package.json', pkg.scripts && pkg.scripts['verify:global-task-unified-modal'] === 'node scripts/verify-global-task-unified-modal.mjs', 'verify:global-task-unified-modal is wired');
expect('scripts/closeflow-release-check-quiet.cjs', quiet.includes('tests/hotfix-global-task-action-modal-no-route.test.cjs'), 'Quiet gate includes hotfix test file');

for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) { console.error('\nFAIL global task direct modal guard failed.'); process.exit(1); }
console.log('\nPASS global task direct modal guard');
