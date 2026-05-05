const fs = require('fs');
const { execSync } = require('child_process');
function sh(cmd) { try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim(); } catch(e) { return 'ERR: ' + (e.stderr?.toString() || e.message).trim(); } }
const pkg = fs.existsSync('package.json') ? JSON.parse(fs.readFileSync('package.json','utf8')) : {scripts:{}};
const report = ['# Stage80 one command result summary','branch: ' + sh('git branch --show-current'),'commit: ' + sh('git log -1 --pretty=format:%h'),'working tree:', sh('git status --short') || 'clean','verify script: ' + (pkg.scripts?.['verify:stage70-82-cumulative'] ? 'yes' : 'missing'),'stage82: ' + (fs.existsSync('scripts/check-stage82-today-next-7-days.cjs') ? 'yes' : 'missing')].join('\n');
console.log(report);
