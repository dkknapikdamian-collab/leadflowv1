const { spawnSync } = require('child_process');
const checks = [
  'check:stage70-today-decision-engine-starter',
  'check:stage71-ai-draft-only-safety-guard',
  'check:stage72-access-billing-plan-truth-guard',
  'check:stage73-cumulative-package-guard',
  'check:stage74-runtime-smoke-contract',
  'check:stage75-source-of-truth-guard',
  'check:stage76-backup-hygiene-guard',
  'check:stage77-runtime-evidence-collector',
  'check:stage78-failure-snapshot-guard',
  'check:stage79-cumulative-manifest-guard',
  'check:stage80-one-command-result-summary',
  'check:stage81-today-risk-reason-next-action',
  'check:stage82-today-next-7-days',
];
for (const script of checks) {
  const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(cmd, ['run', script], { stdio: 'inherit', shell: false });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log('PASS STAGE70_82_CUMULATIVE_VERIFY');
