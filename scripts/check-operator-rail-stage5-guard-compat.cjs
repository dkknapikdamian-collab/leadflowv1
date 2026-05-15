const { spawnSync } = require('child_process');

const checks = [
  'scripts/check-clients-leads-only-attention-stage71.cjs',
  'scripts/check-clients-attention-rail-visual-stage72.cjs',
  'scripts/check-stage74-clients-leads-to-link-panel.cjs',
  'scripts/check-right-rail-card-source-of-truth-stage75.cjs',
  'scripts/check-operator-rail-stage5.cjs',
];

for (const script of checks) {
  const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error('OPERATOR_RAIL_STAGE5_GUARD_COMPAT_FAIL:', script);
    console.error(result.stdout);
    console.error(result.stderr);
    process.exit(result.status || 1);
  }
}

console.log('OK operator rail stage5 guard compatibility');
