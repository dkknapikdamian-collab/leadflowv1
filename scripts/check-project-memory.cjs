const fs = require('fs');
const path = require('path');

const root = process.cwd();
const required = [
  '_project/00_PROJECT_STATUS.md',
  '_project/01_PROJECT_GOAL.md',
  '_project/02_WORK_RULES.md',
  '_project/03_CURRENT_STAGE.md',
  '_project/04_DECISIONS.md',
  '_project/05_MANUAL_TESTS.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/07_NEXT_STEPS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/09_CONTEXT_FOR_OBSIDIAN.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/11_USER_CONFIRMED_TESTS.md',
];

const missing = [];
for (const rel of required) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8').trim().length < 10) missing.push(rel);
}

const runsDir = path.join(root, '_project', 'runs');
const historyDir = path.join(root, '_project', 'history');
if (!fs.existsSync(runsDir)) missing.push('_project/runs/');
if (!fs.existsSync(historyDir)) missing.push('_project/history/');

if (missing.length) {
  console.error('PROJECT_MEMORY_FAIL: missing or empty files:');
  for (const item of missing) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: project memory files are complete for CloseFlow Lead App.');
