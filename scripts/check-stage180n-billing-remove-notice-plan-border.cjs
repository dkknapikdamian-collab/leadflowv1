const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const billingPath = path.join(repo, 'src', 'pages', 'Billing.tsx');
const cssPath = path.join(repo, 'src', 'styles', 'visual-stage16-billing-vnext.css');

const billing = fs.readFileSync(billingPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

function fail(message) {
  console.error('STAGE180N_BILLING_REMOVE_NOTICE_PLAN_BORDER_GUARD_FAIL: ' + message);
  process.exit(1);
}

const periodStart = billing.indexOf('<section className="billing-period-card">');
if (periodStart === -1) fail('missing billing-period-card section');
const periodEnd = billing.indexOf('</section>', periodStart);
const periodBlock = billing.slice(periodStart, periodEnd === -1 ? periodStart + 1400 : periodEnd);

for (const forbidden of [
  'Płatność kartą lub BLIK przez Stripe.',
  'Aktywny plan pojawi się dopiero po webhooku Stripe.',
  'Roczny plan daje niższy koszt w skali roku.'
]) {
  if (periodBlock.includes(forbidden)) {
    fail('visible period helper copy still present: ' + forbidden);
  }
}

if (!billing.includes('const statusPlanToneKey =')) {
  fail('missing statusPlanToneKey');
}

if (!billing.includes('billing-status-plan-${statusPlanToneKey}')) {
  fail('billing status card does not include plan tone class');
}

for (const cls of [
  '.billing-status-card.billing-status-plan-free',
  '.billing-status-card.billing-status-plan-basic',
  '.billing-status-card.billing-status-plan-pro',
  '.billing-status-card.billing-status-plan-ai'
]) {
  if (!css.includes(cls)) {
    fail('missing css rule: ' + cls);
  }
}

console.log('STAGE180N_BILLING_REMOVE_NOTICE_PLAN_BORDER_GUARD_PASS');
