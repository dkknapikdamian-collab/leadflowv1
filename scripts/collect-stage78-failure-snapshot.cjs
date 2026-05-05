const fs = require('fs');
const { execSync } = require('child_process');
const write = process.argv.includes('--write');
function sh(cmd) { try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim(); } catch(e) { return 'ERR: ' + (e.stderr?.toString() || e.message).trim(); } }
const missing = ['src/pages/TodayStable.tsx','package.json','scripts/verify-stage70-82-cumulative.cjs'].filter(f => !fs.existsSync(f));
const report = ['# Stage78 failure snapshot','branch: ' + sh('git branch --show-current'),'commit: ' + sh('git log -1 --pretty=format:%h'),'status:', sh('git status --short') || 'clean','missing: ' + (missing.join(', ') || 'none'),'hint: wklej ostatnie 80 linii terminala od STAGE70_82_APPLY_FAILED'].join('\n');
if (write) fs.writeFileSync('stage78_failure_snapshot.txt', report + '\n');
console.log(report);
