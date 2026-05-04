const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(path) {
  return fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
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

test('global top Zadanie action uses the single Tasks page create modal', () => {
  const raw = read('src/components/GlobalQuickActions.tsx');
  const source = stripComments(raw);

  assert.match(raw, /STAGE45C_GLOBAL_TASK_SINGLE_MODAL/);
  assert.match(source, /data-global-task-unified-modal-trigger="true"/);
  assert.match(source, /to="\/tasks\?quick=task"/);
  assert.match(source, /rememberGlobalQuickAction\(['"]task['"]\)/);
  assert.doesNotMatch(source, /data-global-task-create-dialog="true"/);
  assert.doesNotMatch(source, /data-global-task-create-form="true"/);
  assert.doesNotMatch(source, /openGlobalTaskDialog/);
  assert.doesNotMatch(source, /insertTaskToSupabase/);

  const taskButtons = findButtonBlocks(source).filter((block) => block.includes('data-global-quick-action="task"'));
  assert.equal(taskButtons.length, 1);
  assert.match(taskButtons[0], /\basChild\b/);
  assert.match(taskButtons[0], /to="\/tasks\?quick=task"/);
});

test('Tasks page remains owner of the task create modal', () => {
  const raw = read('src/pages/Tasks.tsx');
  const source = stripComments(raw);

  assert.match(source, /consumeGlobalQuickAction/);
  assert.match(source, /consumeGlobalQuickAction\(\) === ['"]task['"]/);
  assert.match(source, /setIsNewTaskOpen\(true\)/);
  assert.match(source, /TaskReminderEditor/);
  assert.match(raw, /TASKS_PAGE_GREEN_ADD_BUTTON_REMOVED_HOTFIX|TASKS_HEADER_STAGE45B_CLEANUP/);

  const localHeaderButtons = findButtonBlocks(source).filter((block) => (
    block.includes('setIsNewTaskOpen(true)')
    && /(Dodaj zadanie|Nowe zadanie)/.test(block)
    && /(btn primary|primary|bg-green|bg-emerald|emerald|green)/i.test(block)
  ));
  assert.equal(localHeaderButtons.length, 0);
});

test('global task route bridge is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(gate.includes('tests/hotfix-global-task-action-modal-no-route.test.cjs'));
});
