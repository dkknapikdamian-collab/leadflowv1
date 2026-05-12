const fs = require('fs');
const path = require('path');

const root = process.cwd();
const billingPath = path.join(root, 'src/pages/Billing.tsx');
const billing = fs.readFileSync(billingPath, 'utf8');

const forbidden = [
  'className="billing-tabs"',
  'aria-label="Zakładki rozliczeń"',
  'billing-metrics-grid',
  'billing-metric-card',
  '<small>Plan</small>',
];

for (const marker of forbidden) {
  if (billing.includes(marker)) {
    throw new Error('Billing duplicate top UI still present: ' + marker);
  }
}

if (!billing.includes('data-billing-top-duplicates-removed="true"')) {
  throw new Error('Billing root missing data-billing-top-duplicates-removed marker.');
}

if (!billing.includes('billing-status-card')) {
  throw new Error('Billing status card was removed accidentally.');
}

if (!billing.includes('billing-plan-grid')) {
  throw new Error('Billing plan comparison grid was removed accidentally.');
}

console.log('OK closeflow-billing-top-duplicates-removed: removed single-tab bar and duplicate plan metric card only.');
