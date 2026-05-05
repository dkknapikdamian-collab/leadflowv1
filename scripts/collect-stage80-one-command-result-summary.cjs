const { execSync } = require('child_process');
const fs = require('fs');
const STAGE80_ONE_COMMAND_RESULT_SUMMARY = true;
function run(cmd) { try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim(); } catch (e) { return 'FAILED: ' + (e.message || cmd); } }
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
console.log('STAGE80_ONE_COMMAND_RESULT_SUMMARY');
console.log('branch=' + run('git rev-parse --abbrev-ref HEAD'));
console.log('commit=' + run('git rev-parse --short HEAD'));
console.log('status=' + (run('git status --short') || 'clean'));
console.log('has_verify_stage70_82=' + Boolean(pkg.scripts && pkg.scripts['verify:stage70-82-cumulative']));
console.log('next= npm.cmd run verify:stage70-82-cumulative && npm.cmd run build');
