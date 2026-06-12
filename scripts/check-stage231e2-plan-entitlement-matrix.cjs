const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const matrixPath = '_project/06_STAGE231E2_PLAN_ENTITLEMENT_MATRIX.md';
const matrix = read(matrixPath);
const plans = read('src/lib/plans.ts');
const billing = read('src/pages/Billing.tsx');

const requiredFeatures = [
  'ai',
  'fullAi',
  'digest',
  'lightParser',
  'lightDrafts',
  'googleCalendar',
  'weeklyReport',
  'csvImport',
  'recurringReminders',
  'browserNotifications',
  'activeLeads',
  'activeTasks',
  'activeEvents',
  'activeDrafts',
  'aiDaily',
  'aiMonthly',
];

assert(/PlanFeatures/.test(plans), 'plans.ts must define PlanFeatures.');
assert(/PLAN_FEATURE_MINIMUM_PLANS/.test(plans), 'plans.ts must define feature minimum plans.');
assert(/Funkcja \| Free \| Basic \| Pro \| AI \| Trial \| UI/.test(matrix), 'Plan entitlement matrix must contain the required table header.');

for (const feature of requiredFeatures) {
  assert(matrix.includes(`\`${feature}\``) || matrix.includes(feature), `Plan entitlement matrix missing feature: ${feature}`);
}

for (const verdict of ['OK', 'KONFIG', 'LEGACY_DECISION', 'DO_SPRAWDZENIA']) {
  assert(matrix.includes(verdict), `Plan entitlement matrix must include verdict marker: ${verdict}`);
}

for (const billingText of ['Google Calendar', 'Parser tekstu', 'Poranny digest', 'Raport tygodniowy', 'Asystent AI']) {
  assert(billing.includes(billingText), `Billing.tsx missing expected plan copy: ${billingText}`);
}

assert(/googleCalendar:\s*PLAN_IDS\.pro/.test(plans), 'Google Calendar minimum plan must be Pro in plans.ts.');
assert(/weeklyReport:\s*PLAN_IDS\.pro/.test(plans), 'Weekly report minimum plan must be Pro in plans.ts.');
assert(/lightParser:\s*PLAN_IDS\.basic/.test(plans), 'Light parser minimum plan must be Basic in plans.ts.');
assert(/browserNotifications:\s*PLAN_IDS\.basic/.test(plans), 'Browser notifications minimum plan must be Basic in plans.ts.');
assert(/ai:\s*PLAN_IDS\.ai/.test(plans), 'Full AI minimum plan must be AI in plans.ts.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231E2_R5_PLAN_ENTITLEMENT_MATRIX',
  contract: 'plan entitlement matrix exists, covers PlanFeatures and limits, and matches the current plans.ts minimum-plan contract',
}, null, 2));
