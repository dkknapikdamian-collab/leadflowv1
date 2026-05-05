const { fail, read, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE80_ONE_COMMAND_RESULT_SUMMARY';
read(label, 'scripts/collect-stage80-one-command-result-summary.cjs');
if (!pkg(label).scripts['collect:stage80-one-command-result-summary']) fail(label, 'collect script missing');
if (!pkg(label).scripts['check:stage80-one-command-result-summary']) fail(label, 'check script missing');
console.log('PASS ' + label);
