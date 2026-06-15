const cp = require('node:child_process');

function run(command) {
  return cp.execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const branch = run('git branch --show-current');

if (branch !== 'dev-rollout-freeze') {
  console.error(`CLOSEFLOW_BRANCH_SCOPE_FAIL: current branch is ${branch}, expected dev-rollout-freeze`);
  process.exit(1);
}

const upstream = run('git status --short --branch');

if (!upstream.includes('dev-rollout-freeze')) {
  console.error('CLOSEFLOW_BRANCH_SCOPE_FAIL: status does not confirm dev-rollout-freeze');
  process.exit(1);
}

console.log('CLOSEFLOW_BRANCH_SCOPE_PASS: CloseFlow work is scoped to dev-rollout-freeze. Do not push or merge main.');