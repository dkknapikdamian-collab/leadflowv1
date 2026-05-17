const { spawnSync } = require('node:child_process');
const result = spawnSync(process.execPath, ['--test', 'tests/stage107-templates-delete-and-visual-contract.test.cjs'], { stdio: 'inherit' });
process.exit(result.status || 0);
