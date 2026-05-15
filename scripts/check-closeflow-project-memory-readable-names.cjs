const fs = require('fs');
const path = require('path');
const root = process.cwd();
const required = [
  'AGENTS.md',
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
  '_project/12_IMPLEMENTATION_LEDGER.md',
  '_project/13_TEST_HISTORY.md',
  '_project/14_AI_REPORTS_INDEX.md',
  '_project/15_RELEASE_READINESS.md',
  '_project/16_OBSIDIAN_SYNC_LOG.md'
];
const missing = required.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missing.length) {
  console.error('Missing CloseFlow project memory files:');
  for (const rel of missing) console.error('- ' + rel);
  process.exit(1);
}
const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
if (!agents.includes('CLOSEFLOW_PROJECT_MEMORY_RULES_V9_START')) {
  console.error('AGENTS.md does not include CloseFlow V9 project memory rules marker.');
  process.exit(1);
}
const generic = new Set(['INDEX.md', 'STATUS.md', 'ledger.md', 'Ledger.md', 'README.md']);
const bad = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (generic.has(entry.name)) bad.push(path.relative(root, full));
  }
}
walk(path.join(root, '_project'));
if (bad.length) {
  console.error('Generic names found in _project:');
  for (const rel of bad) console.error('- ' + rel);
  process.exit(1);
}
console.log('OK: CloseFlow project memory guard passed.');
