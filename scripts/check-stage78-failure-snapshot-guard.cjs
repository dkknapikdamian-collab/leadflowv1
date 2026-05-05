const { fail, read, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE78_FAILURE_SNAPSHOT_GUARD';
read(label, 'scripts/collect-stage78-failure-snapshot.cjs');
if (!pkg(label).scripts['collect:stage78-failure-snapshot']) fail(label, 'collect script missing');
if (!pkg(label).scripts['check:stage78-failure-snapshot-guard']) fail(label, 'check script missing');
console.log('PASS ' + label);
