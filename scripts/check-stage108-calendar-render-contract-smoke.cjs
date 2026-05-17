const { spawnSync } = require('node:child_process');

const result = spawnSync(process.execPath, ['--test', 'tests/stage108-calendar-render-contract-smoke.test.cjs'], {
  stdio: 'inherit',
  shell: false,
});

process.exit(result.status || 0);
