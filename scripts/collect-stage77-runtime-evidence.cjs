const fs = require('fs');
const { execSync } = require('child_process');
function sh(cmd) { try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim(); } catch(e) { return 'ERR: ' + (e.stderr?.toString() || e.message).trim(); } }
const report = [
  '# Stage77 runtime evidence',
  'branch: ' + sh('git branch --show-current'),
  'commit: ' + sh('git log -1 --pretty=format:%h'),
  'status:',
  sh('git status --short') || 'clean',
  'node: ' + sh('node -v'),
  'npm: ' + sh('npm -v'),
  'next: npm.cmd run verify:stage70-82-cumulative && npm.cmd run build'
].join('\n');
console.log(report);
