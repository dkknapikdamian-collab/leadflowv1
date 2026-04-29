const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const tasksPath = path.join(root, 'src/pages/Tasks.tsx');
const cssPath = path.join(root, 'src/styles/visual-stage30-tasks-compact-after-calendar.css');
const tasks = fs.readFileSync(tasksPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const mojibake = ['Ä', 'Å', 'Ĺ', 'Â', '�', 'Ã'];

test('Tasks ma wymagane widoki operacyjne', () => {
  for (const label of ['Aktywne', 'Dziś', 'Ten tydzień', 'Zaległe', 'Zrobione']) {
    assert.match(tasks, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(tasks, /id:\s*'week' as TaskScope/);
});

test('Kompaktowy task row pokazuje typ, tytuł, termin, status i powiązanie', () => {
  for (const needle of [
    'data-task-compact-row="true"',
    'task-type-badge-col',
    'task-title',
    'task-term-col',
    'task-status-col',
    'Lead:',
    'Sprawa:',
    'Klient:',
  ]) {
    assert.ok(tasks.includes(needle), `brak: ${needle}`);
  }
});

test('Akcje taska są krótkie i spójne z kalendarzem', () => {
  for (const label of ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Usuń']) {
    assert.ok(tasks.includes(label), `brak akcji: ${label}`);
  }
  assert.match(tasks, /rescheduleTask\(task, 1, 'hour'\)/);
  assert.match(tasks, /rescheduleTask\(task, 1, 'day'\)/);
  assert.match(tasks, /rescheduleTask\(task, 1, 'week'\)/);
  assert.match(tasks, /toggleTask\(task\.id, task\.status\)/);
  assert.match(tasks, /deleteTask\(task\.id\)/);
});

test('Akcje taska nie mają szerokich full-width buttonów', () => {
  assert.match(css, /\.task-action-col\.task-action-col-compact[\s\S]*flex-wrap:\s*wrap/);
  assert.match(css, /\.task-action-btn[\s\S]*width:\s*auto\s*!important/);
  assert.match(css, /\.task-action-btn[\s\S]*max-width:\s*max-content\s*!important/);
  assert.doesNotMatch(css, /task-action-btn[\s\S]{0,220}width:\s*100%/);
});

test('Stage 7 nie wprowadza mojibake', () => {
  for (const bad of mojibake) {
    assert.ok(!tasks.includes(bad), `Tasks.tsx zawiera podejrzany znak: ${bad}`);
    assert.ok(!css.includes(bad), `CSS zawiera podejrzany znak: ${bad}`);
  }
});
