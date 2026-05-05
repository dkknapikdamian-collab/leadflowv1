const { fail, read, has, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE81_TODAY_RISK_REASON_NEXT_ACTION';
const today = read(label, 'src/pages/TodayStable.tsx');
['STAGE81_TODAY_RISK_REASON_NEXT_ACTION','type TodayLeadRisk','getStage81LeadRisk','getStage81LeadRisk(b.lead','reason','suggestedAction','Powód:','Ruch:'].forEach(m => has(label, today, m, 'TodayStable.tsx'));
has(label, today, 'subscribeCloseflowDataMutations', 'TodayStable.tsx');
has(label, today, 'fetchLeadsFromSupabase', 'TodayStable.tsx');
if (!pkg(label).scripts['check:stage81-today-risk-reason-next-action']) fail(label, 'package script missing');
console.log('PASS ' + label);
