const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE80_ONE_COMMAND_RESULT_SUMMARY", "scripts/collect-stage80-one-command-result-summary.cjs", ["STAGE80_ONE_COMMAND_RESULT_SUMMARY", "verify:stage70-82-cumulative"]);
requireScript("STAGE80_ONE_COMMAND_RESULT_SUMMARY", "check:stage80-one-command-result-summary", "node scripts/check-stage80-one-command-result-summary.cjs");
console.log('PASS STAGE80_ONE_COMMAND_RESULT_SUMMARY');
