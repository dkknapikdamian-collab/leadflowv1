const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

function assertIncludes(content, needle, label) {
  assert.ok(content.includes(needle), `${label} missing: ${needle}`);
}

test('Tasks stat tile blue backplate hotfix is imported globally', () => {
  const indexCss = read('src/index.css');
  assertIncludes(indexCss, '@import "./styles/hotfix-task-stat-tiles-clean.css";', 'src/index.css');
});

test('Tasks stat shortcut cards do not expose active blue backplate', () => {
  const css = read('src/styles/hotfix-task-stat-tiles-clean.css');

  assertIncludes(css, 'HOTFIX_TASK_STAT_TILES_NO_BLUE_BACKPLATE', 'hotfix css');
  assertIncludes(css, '[data-stat-shortcut-card]', 'hotfix css');
  assertIncludes(css, 'background: transparent !important;', 'hotfix css');
  assertIncludes(css, '--tw-ring-color: transparent !important;', 'hotfix css');
  assertIncludes(css, '--tw-ring-shadow: 0 0 #0000 !important;', 'hotfix css');
  assertIncludes(css, 'background: #ffffff !important;', 'hotfix css');
});

test('Tasks page still uses shared stat shortcut cards', () => {
  const tasks = read('src/pages/Tasks.tsx');
  assertIncludes(tasks, 'StatShortcutCard', 'Tasks.tsx');
});
