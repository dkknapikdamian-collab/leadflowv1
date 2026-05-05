const fs = require('fs');
const { execSync } = require('child_process');
const STAGE77_RUNTIME_EVIDENCE_COLLECTOR = true;
function run(cmd) { try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim(); } catch (e) { return 'FAILED: ' + (e.message || cmd); } }
console.log('STAGE77_RUNTIME_EVIDENCE_COLLECTOR');
console.log('branch=' + run('git rev-parse --abbrev-ref HEAD'));
console.log('commit=' + run('git rev-parse --short HEAD'));
console.log('status=' + (run('git status --short') || 'clean'));
console.log('next= npm.cmd run verify:stage70-82-cumulative && npm.cmd run build');
