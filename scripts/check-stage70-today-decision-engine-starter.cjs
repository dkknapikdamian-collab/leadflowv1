const { fail, read, has, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE70_TODAY_DECISION_ENGINE_STARTER';
const today = read(label, 'src/pages/TodayStable.tsx');
const p = pkg(label);
['STAGE70_TODAY_DECISION_ENGINE_STARTER','getLeadValue(','getLeadFreshnessDays(','noActionLeads','highValueAtRiskRows','waitingLeadRows','Leady bez następnego kroku','Wysoka wartość / ryzyko','Waiting za długo','data-stage70-today-decision-engine-starter="true"'].forEach(m => has(label, today, m, 'src/pages/TodayStable.tsx'));
if (p.scripts['check:stage70-today-decision-engine-starter'] !== 'node scripts/check-stage70-today-decision-engine-starter.cjs') fail(label, 'package.json missing stage70 script');
console.log('PASS ' + label);
