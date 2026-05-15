const fs = require('fs');
const path = require('path');
const root = process.cwd();
const required = ['AGENTS.md','_project/00_PROJECT_STATUS.md','_project/01_PROJECT_GOAL.md','_project/02_WORK_RULES.md','_project/03_CURRENT_STAGE.md','_project/04_DECISIONS.md','_project/05_MANUAL_TESTS.md','_project/06_GUARDS_AND_TESTS.md','_project/07_NEXT_STEPS.md','_project/08_CHANGELOG_AI.md','_project/09_CONTEXT_FOR_OBSIDIAN.md','_project/10_PROJECT_TIMELINE.md','_project/11_USER_CONFIRMED_TESTS.md'];
const missing = required.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missing.length) { console.error('Missing project memory files:'); for (const rel of missing) console.error('- ' + rel); process.exit(1); }
const ag = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
for (const marker of ['SCAN-FIRST','FAKT','DECYZJA','HIPOTEZA','DO POTWIERDZENIA']) { if (!ag.includes(marker)) { console.error('AGENTS.md missing marker: ' + marker); process.exit(1); } }
console.log('OK: project memory files are complete for CloseFlow Lead App.');