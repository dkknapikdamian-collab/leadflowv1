const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE77_RUNTIME_EVIDENCE_COLLECTOR", "scripts/collect-stage77-runtime-evidence.cjs", ["STAGE77_RUNTIME_EVIDENCE_COLLECTOR"]);
requireScript("STAGE77_RUNTIME_EVIDENCE_COLLECTOR", "check:stage77-runtime-evidence-collector", "node scripts/check-stage77-runtime-evidence-collector.cjs");
console.log('PASS STAGE77_RUNTIME_EVIDENCE_COLLECTOR');
