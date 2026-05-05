const { fail, read, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE77_RUNTIME_EVIDENCE_COLLECTOR';
read(label, 'scripts/collect-stage77-runtime-evidence.cjs');
if (!pkg(label).scripts['collect:stage77-runtime-evidence']) fail(label, 'collect script missing');
if (!pkg(label).scripts['check:stage77-runtime-evidence-collector']) fail(label, 'check script missing');
console.log('PASS ' + label);
