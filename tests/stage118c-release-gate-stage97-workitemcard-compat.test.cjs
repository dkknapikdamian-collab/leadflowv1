const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const stage97 = fs.readFileSync(path.join(root, 'tests/stage97-today-overdue-task-done-button.test.cjs'), 'utf8');
const today = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');
const card = fs.readFileSync(path.join(root, 'src/components/work-item-card.tsx'), 'utf8');

test('Stage118C updates Stage97 for Stage116 WorkItemCard source-of-truth', () => {
  assert.ok(stage97.includes('Stage97 WorkItemCard exposes a real task done button'), 'Stage97 must check WorkItemCard, not legacy RowLink task rendering.');
  assert.ok(stage97.includes('src/components/work-item-card.tsx'), 'Stage97 must read WorkItemCard source.');
  assert.ok(stage97.includes('<WorkItemCard'), 'Stage97 must validate Today task rows use WorkItemCard.');
  assert.ok(!stage97.includes('taskId={String(task.id ||'), 'Stage97 must not require legacy RowLink taskId prop after Stage116.');
  assert.ok(today.includes('<WorkItemCard') && today.includes('kind="task"') && today.includes('href="/tasks"'), 'Today task rows must keep WorkItemCard task route.');
  assert.ok(card.includes('data-stage116-work-item-done-action="true"'), 'WorkItemCard must expose shared done marker.');
});
