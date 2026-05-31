const fs = require('fs');
const path = require('path');

const root = process.cwd();
const billingPath = path.join(root, 'src', 'pages', 'Billing.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage16-billing-vnext.css');
const billing = read(billingPath);
const css = read(cssPath);

const forbidden = 'Płatność kartą lub BLIK przez Stripe. Aktywny plan pojawi się dopiero po webhooku Stripe. Roczny plan daje niższy koszt w skali roku.';
if (billing.includes(forbidden)) fail('forbidden billing period notice is still visible in Billing.tsx');
if (!billing.includes('const statusPlanToneKey')) fail('statusPlanToneKey const missing');
if (!billing.includes('billing-status-plan-${statusPlanToneKey}')) fail('top billing status card does not include plan-tone class');

for (const key of ['free', 'basic', 'pro', 'ai']) {
  const selector = `.billing-status-card.billing-status-plan-${key}`;
  if (!css.includes(selector)) fail(`missing plan-tone selector: ${selector}`);
}

for (const token of [
  'border-width: 1px 1px 1px 4px !important;',
  '.billing-status-card.billing-status-plan-pro .billing-status-icon',
  '.billing-status-card.billing-status-plan-ai .billing-status-icon',
  '.billing-right-title svg',
  'display: none !important;',
]) {
  if (!css.includes(token)) fail(`missing CSS token: ${token}`);
}

if (/billing\.includes\(`billing-status-plan-\$\{statusPlanToneKey\}`\)/.test(fs.readFileSync(__filename, 'utf8'))) {
  fail('guard contains unsafe runtime interpolation check');
}

console.log('STAGE180P_BILLING_PLAN_TONE_RIGHT_RAIL_CLEANUP_GUARD_PASS');

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}
function fail(message) {
  console.error(`STAGE180P_BILLING_PLAN_TONE_RIGHT_RAIL_CLEANUP_GUARD_FAIL: ${message}`);
  process.exit(1);
}
