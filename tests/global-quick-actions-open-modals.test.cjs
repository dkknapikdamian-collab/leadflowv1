const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('global quick actions keep visible links and store creation intent', () => {
  const source = read('src/components/GlobalQuickActions.tsx');
  assert.ok(source.includes('data-global-quick-actions="true"'));
  assert.ok(source.includes('to="/leads"'));
  assert.ok(source.includes('to="/tasks"'));
  assert.ok(source.includes('to="/calendar"'));
  assert.ok(source.includes("rememberGlobalQuickAction('lead')"));
  assert.ok(source.includes("rememberGlobalQuickAction('task')"));
  assert.ok(source.includes("rememberGlobalQuickAction('event')"));
});

test('global quick action targets open creation dialogs on destination pages', () => {
  const leads = read('src/pages/Leads.tsx');
  const tasks = read('src/pages/Tasks.tsx');
  const calendar = read('src/pages/Calendar.tsx');

  assert.ok(leads.includes('consumeGlobalQuickAction'));
  assert.ok(leads.includes("consumeGlobalQuickAction() === 'lead'"));
  assert.ok(leads.includes('setIsNewLeadOpen(true)'));

  assert.ok(tasks.includes('consumeGlobalQuickAction'));
  assert.ok(tasks.includes("consumeGlobalQuickAction() === 'task'"));
  assert.ok(tasks.includes('setIsNewTaskOpen(true)'));

  assert.ok(calendar.includes('consumeGlobalQuickAction'));
  assert.ok(calendar.includes("consumeGlobalQuickAction() === 'event'"));
  assert.ok(calendar.includes('setIsNewEventOpen(true)'));
});

test('global quick action modal test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(gate.includes('tests/global-quick-actions-open-modals.test.cjs'));
});
