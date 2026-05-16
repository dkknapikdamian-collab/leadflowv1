const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE81_TODAY_RISK_REASON_NEXT_ACTION", "src/pages/TodayStable.tsx", ["STAGE81_TODAY_RISK_REASON_NEXT_ACTION", "type TodayLeadRisk", "reason: string", "suggestedAction: string", "Pow\u00F3d:", "Ruch:", "getLeadRisk("]);
requireScript("STAGE81_TODAY_RISK_REASON_NEXT_ACTION", "check:stage81-today-risk-reason-next-action", "node scripts/check-stage81-today-risk-reason-next-action.cjs");
console.log('PASS STAGE81_TODAY_RISK_REASON_NEXT_ACTION');
