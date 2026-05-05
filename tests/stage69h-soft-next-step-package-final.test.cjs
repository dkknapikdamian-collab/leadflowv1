const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const marker = 'STAGE69H_SOFT_NEXT_STEP_PACKAGE_FINAL';
const tasksPath = path.join(repoRoot, 'src', 'pages', 'Tasks.tsx');
const packagePath = path.join(repoRoot, 'package.json');

function read(file) { return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); }
function getSoftNextStepBlock() {
  const source = read(tasksPath);
  const start = source.indexOf('const handleSoftNextStepAfterTaskCompletion = async');
  const end = source.indexOf('const openEditTask = (task: any) =>', start === -1 ? 0 : start);
  assert.ok(start >= 0, 'missing soft next-step function');
  assert.ok(end > start, 'missing soft next-step end boundary');
  return source.slice(start, end);
}

test(`${marker}: prompts for next step after closing task linked to active lead`, () => {
  const source = read(tasksPath);
  const block = getSoftNextStepBlock();
  assert.match(source, new RegExp(marker));
  assert.match(block, /window\.prompt\(promptText,/);
  assert.match(block, /isActiveSalesLead\(lead\)/);
  assert.match(block, /if \(lead\.nextActionAt\) return;/);
  assert.match(block, /insertTaskToSupabase\(\{/);
  assert.match(block, /updateLeadInSupabase\(\{/);
  assert.match(block, /eventType: 'lead_next_step_created'/);
  assert.match(block, /eventType: 'lead_next_step_skipped'/);
});

test(`${marker}: package.json remains canonical and registers guard`, () => {
  const raw = fs.readFileSync(packagePath, 'utf8');
  assert.notStrictEqual(raw.charCodeAt(0), 0xfeff);
  assert.ok(!raw.includes('\\u0026'));
  const pkg = JSON.parse(raw);
  assert.strictEqual(raw, `${JSON.stringify(pkg, null, 2)}\n`);
  assert.strictEqual(pkg.scripts['check:stage69h-soft-next-step-package-final'], 'node scripts/check-stage69h-soft-next-step-package-final.cjs');
  assert.strictEqual(pkg.scripts['test:stage69h-soft-next-step-package-final'], 'node --test tests/stage69h-soft-next-step-package-final.test.cjs');
  assert.ok(String(pkg.scripts['verify:case-operational-ui']).includes('check:stage69h-soft-next-step-package-final'));
});
