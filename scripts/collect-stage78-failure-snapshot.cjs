const { execSync } = require('child_process');
const STAGE78_FAILURE_SNAPSHOT_GUARD = true;
function run(cmd) { try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim(); } catch (e) { return 'FAILED: ' + (e.message || cmd); } }
console.log('STAGE78_FAILURE_SNAPSHOT_GUARD');
console.log('node=' + run('node -v'));
console.log('npm=' + run('npm -v'));
console.log('branch=' + run('git rev-parse --abbrev-ref HEAD'));
console.log('commit=' + run('git rev-parse --short HEAD'));
console.log('status=' + (run('git status --short') || 'clean'));
