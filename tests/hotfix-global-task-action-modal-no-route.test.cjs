const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
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

test('global top Zadanie action opens modal instead of routing to /tasks', () => {
  const raw = read('src/components/GlobalQuickActions.tsx');
  const source = stripComments(raw);

  assert.match(raw, /GLOBAL_TASK_ACTION_MODAL_NO_ROUTE_HOTFIX/);
  assert.match(source, /data-global-task-create-dialog-trigger="true"/);
  assert.match(source, /data-global-task-create-dialog="true"/);
  assert.match(source, /data-global-task-create-form="true"/);
  assert.match(source, /openGlobalTaskDialog/);
  assert.match(source, /insertTaskToSupabase/);
  assert.doesNotMatch(source, /rememberGlobalQuickAction\(['"]task['"]\)/);

  const badButtons = findButtonBlocks(source).filter((block) => (
    /\basChild\b/.test(block) && (
      block.includes('data-global-quick-action="task"') ||
      /to=["']\/tasks\?quick=task["']/.test(block) ||
      /rememberGlobalQuickAction\(['"]task['"]\)/.test(block)
    )
  ));
  assert.equal(badButtons.length, 0);
});

test('Tasks page no longer carries green primary add task button', () => {
  const raw = read('src/pages/Tasks.tsx');
  const source = stripComments(raw);

  assert.match(raw, /TASKS_PAGE_GREEN_ADD_BUTTON_REMOVED_HOTFIX/);

  const remainingGreen = findButtonBlocks(source).filter((block) => (
    block.includes('setIsNewTaskOpen(true)')
    && /(Dodaj zadanie|Nowe zadanie|Zadanie)/.test(block)
    && /(btn primary|primary|bg-green|bg-emerald|emerald|green)/i.test(block)
  ));

  assert.equal(remainingGreen.length, 0);
});

test('hotfix scripts are wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');

  assert.equal(pkg.scripts['check:hotfix-global-task-action-modal-no-route'], 'node scripts/check-hotfix-global-task-action-modal-no-route.cjs');
  assert.equal(pkg.scripts['test:hotfix-global-task-action-modal-no-route'], 'node --test tests/hotfix-global-task-action-modal-no-route.test.cjs');
  assert.match(quiet, /tests\/hotfix-global-task-action-modal-no-route\.test\.cjs/);
});
