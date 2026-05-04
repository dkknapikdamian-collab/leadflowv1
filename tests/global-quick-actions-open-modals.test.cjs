const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const blockComment = new RegExp('/\\*[\\s\\S]*?\\*/', 'g');
const jsxComment = new RegExp('\\{\/\\*[\\s\\S]*?\\*\/\\}', 'g');
const stripComments = (source) => source.replace(blockComment, '').replace(jsxComment, '');

test('global quick actions open the correct creation surfaces', () => {
  const global = stripComments(read('src/components/GlobalQuickActions.tsx'));
  const leads = read('src/pages/Leads.tsx');
  const calendar = read('src/pages/Calendar.tsx');
  const taskButton = (global.match(/<Button[^>]*data-global-quick-action="task"[\s\S]*?<\/Button>/) || [''])[0];

  assert.ok(leads.includes('consumeGlobalQuickAction'));
  assert.ok(leads.includes("consumeGlobalQuickAction() === 'lead'"));
  assert.ok(calendar.includes('consumeGlobalQuickAction'));
  assert.ok(calendar.includes("consumeGlobalQuickAction() === 'event'"));
  assert.match(taskButton, /setIsTaskCreateOpen\(true\)/);
  assert.doesNotMatch(taskButton, /to="\/tasks/);
  assert.doesNotMatch(taskButton, /asChild/);
});

test('global quick task action uses shared direct task dialog', () => {
  const global = stripComments(read('src/components/GlobalQuickActions.tsx'));
  const dialog = read('src/components/TaskCreateDialog.tsx');
  assert.match(global, /TaskCreateDialog/);
  assert.match(dialog, /data-task-create-dialog-stage45m="true"/);
  assert.match(dialog, /insertTaskToSupabase/);
  assert.match(dialog, /Przypomnienie/);
});

test('global quick actions open modals test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(gate.includes('tests/global-quick-actions-open-modals.test.cjs'));
});
