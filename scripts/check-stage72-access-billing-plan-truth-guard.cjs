const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE72_ACCESS_BILLING_PLAN_TRUTH_GUARD", "src/lib/plans.ts", ["TRIAL_DAYS = 21", "activeLeads: 5", "googleCalendar: boolean", "fullAi: boolean"]);
requireIncludes("STAGE72_ACCESS_BILLING_PLAN_TRUTH_GUARD", "src/pages/Billing.tsx", ["Google Calendar sync — w przygotowaniu / wymaga konfiguracji OAuth", "Pełny asystent AI Beta, po konfiguracji providera", "Stripe wymaga konfiguracji"]);
requireScript("STAGE72_ACCESS_BILLING_PLAN_TRUTH_GUARD", "check:stage72-access-billing-plan-truth-guard", "node scripts/check-stage72-access-billing-plan-truth-guard.cjs");
console.log('PASS STAGE72_ACCESS_BILLING_PLAN_TRUTH_GUARD');
