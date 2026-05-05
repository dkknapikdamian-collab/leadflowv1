const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE78_FAILURE_SNAPSHOT_GUARD", "scripts/collect-stage78-failure-snapshot.cjs", ["STAGE78_FAILURE_SNAPSHOT_GUARD"]);
requireScript("STAGE78_FAILURE_SNAPSHOT_GUARD", "check:stage78-failure-snapshot-guard", "node scripts/check-stage78-failure-snapshot-guard.cjs");
console.log('PASS STAGE78_FAILURE_SNAPSHOT_GUARD');
