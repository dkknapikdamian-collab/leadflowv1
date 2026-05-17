const { spawnSync } = require('node:child_process');
const result = spawnSync(process.execPath, ['--test', 'tests/stage104-calendar-loading-performance-contract.test.cjs'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});
process.exit(result.status || 0);
