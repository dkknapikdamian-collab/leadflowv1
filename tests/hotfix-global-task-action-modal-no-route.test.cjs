const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const blockComment = new RegExp('/\\*[\\s\\S]*?\\*/', 'g');
const jsxComment = new RegExp('\\{\/\\*[\\s\\S]*?\\*\/\\}', 'g');
const stripComments = (source) => source.replace(blockComment, '').replace(jsxComment, '');

test('global task action opens direct shared modal instead of routing', () => {
  const global = stripComments(read('src/components/GlobalQuickActions.tsx'));
  const taskButton = (global.match(/<Button[^>]*data-global-quick-action="task"[\s\S]*?<\/Button>/) || [''])[0];
  assert.match(taskButton, /type="button"/);
  assert.match(taskButton, /setIsTaskCreateOpen\(true\)/);
  assert.doesNotMatch(taskButton, /to="\/tasks/);
  assert.doesNotMatch(taskButton, /asChild/);
  assert.doesNotMatch(taskButton, /<Link\b/);
});

test('shared task create dialog owns task creation fields', () => {
  const dialog = read('src/components/TaskCreateDialog.tsx');
  assert.match(dialog, /DialogTitle>Nowe zadanie/);
  assert.match(dialog, /insertTaskToSupabase/);
  assert.match(dialog, /REMINDER_MODE_OPTIONS/);
  assert.match(dialog, /REMINDER_OFFSET_OPTIONS/);
  assert.match(dialog, /reminderAt/);
});

test('real tasks route no longer has local header create CTA or technical copy', () => {
  const tasks = stripComments(read('src/pages/TasksStable.tsx'));
  assert.doesNotMatch(tasks, /onClick=\{openNewTask\}/);
  assert.doesNotMatch(tasks, /<Plus[\s\S]{0,120}Nowe zadanie[\s\S]{0,180}<\/Button>/);
  assert.doesNotMatch(tasks, /Stabilny widok Supabase bez bramki Firebase/);
  assert.match(tasks, /data-tasks-refresh-visible-stage45m="true"/);
});

test('hotfix direct task modal test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(gate.includes('tests/hotfix-global-task-action-modal-no-route.test.cjs'));
});
