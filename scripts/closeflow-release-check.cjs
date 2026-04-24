const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

const requiredTests = [
  'tests/closeflow-release-gate.test.cjs',
  'tests/closeflow-release-gate-quiet.test.cjs',
  'tests/lead-next-action-title-not-null.test.cjs',
  'tests/lead-client-path-contract.test.cjs',
  'tests/client-relation-command-center.test.cjs',
  'tests/calendar-completed-event-behavior.test.cjs',
  'tests/calendar-restore-completed-entries.test.cjs',
  'tests/calendar-entry-relation-links.test.cjs',
  'tests/today-completed-entries-behavior.test.cjs',
  'tests/today-restore-completed-label.test.cjs',
  'tests/today-entry-relation-links.test.cjs',
  'tests/today-calendar-activity-logging.test.cjs',
  'tests/activity-command-center.test.cjs',
  'tests/lead-service-mode-v1.test.cjs',
  'tests/panel-delete-actions-v1.test.cjs',
  'tests/case-lifecycle-v1-foundation.test.cjs',
  'tests/today-v1-final-action-board.test.cjs',
  'tests/cases-v1-lifecycle-command-board.test.cjs',
];

function run(label, command, args) {
  console.log('');
  console.log('==> ' + label);

  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error('');
    console.error('FAILED: ' + label);
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error('');
    console.error('FAILED: ' + label);
    process.exit(result.status || 1);
  }
}

function runNpmScript(label, scriptName) {
  if (process.platform === 'win32') {
    const cmd = process.env.ComSpec || 'cmd.exe';
    run(label, cmd, ['/d', '/s', '/c', 'npm.cmd', 'run', scriptName]);
    return;
  }

  run(label, 'npm', ['run', scriptName]);
}

for (const relativePath of requiredTests) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error('Missing required test: ' + relativePath);
    process.exit(1);
  }
}

runNpmScript('production build', 'build');

for (const relativePath of requiredTests) {
  run(relativePath, process.execPath, ['--test', relativePath]);
}

console.log('');
console.log('CloseFlow release gate passed.');

