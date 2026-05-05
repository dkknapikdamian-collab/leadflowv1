const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE70_TODAY_DECISION_ENGINE_STARTER", "src/pages/TodayStable.tsx", ["STAGE70_TODAY_DECISION_ENGINE_STARTER", "getLeadValue(", "getLeadFreshnessDays(", "noActionLeads", "highValueAtRiskRows", "waitingLeadRows", "Leady bez następnego kroku", "Wysoka wartość / ryzyko", "Waiting za długo", "data-stage70-today-decision-engine-starter=\"true\""]);
requireScript("STAGE70_TODAY_DECISION_ENGINE_STARTER", "check:stage70-today-decision-engine-starter", "node scripts/check-stage70-today-decision-engine-starter.cjs");
console.log('PASS STAGE70_TODAY_DECISION_ENGINE_STARTER');
