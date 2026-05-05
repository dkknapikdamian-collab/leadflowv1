const { fail, read, has, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE72_ACCESS_BILLING_PLAN_TRUTH_GUARD';
const plans = read(label, 'src/lib/plans.ts');
const billing = read(label, 'src/pages/Billing.tsx');
['TRIAL_DAYS = 21','activeLeads: 5','activeTasks: 5','activeEvents: 5','activeDrafts: 3','googleCalendar: PLAN_IDS.pro','fullAi: PLAN_IDS.ai'].forEach(m => has(label, plans, m, 'plans.ts'));
['Stripe/BLIK','W przygotowaniu','Beta','wymaga konfiguracji','Nie obiecujemy funkcji'].forEach(m => has(label, billing, m, 'Billing.tsx'));
if (!pkg(label).scripts['check:stage72-access-billing-plan-truth-guard']) fail(label, 'package script missing');
console.log('PASS ' + label);
