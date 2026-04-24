const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

const requiredTests = [
  'tests/lead-next-action-title-not-null.test.cjs',
  'tests/lead-client-path-contract.test.cjs',
  'tests/client-relation-command-center.test.cjs',
  'tests/calendar-completed-event-behavior.test.cjs',
  'tests/calendar-restore-completed-entries.test.cjs',
  'tests/today-completed-entries-behavior.test.cjs',
  'tests/today-restore-completed-label.test.cjs',
];

function run(label, command, args) {
  console.log('');
  console.log('==> ' + label);
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    console.error('');
    console.error('FAILED: ' + label);
    process.exit(result.status || 1);
  }
}

for (const relativePath of requiredTests) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error('Missing required test: ' + relativePath);
    process.exit(1);
  }
}

run('production build', 'npm.cmd', ['run', 'build']);

for (const relativePath of requiredTests) {
  run(relativePath, 'node', ['--test', relativePath]);
}

console.log('');
console.log('CloseFlow release gate passed.');
