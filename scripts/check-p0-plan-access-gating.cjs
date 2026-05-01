const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

function read(rel) {
  const target = path.join(root, rel);
  if (!fs.existsSync(target)) {
    failures.push(`${rel} nie istnieje`);
    return '';
  }
  return fs.readFileSync(target, 'utf8');
}

function mustInclude(rel, needle, label = needle) {
  const text = read(rel);
  if (!text.includes(needle)) failures.push(`${rel} missing: ${label}`);
}

function mustNotInclude(rel, needle, label = needle) {
  const text = read(rel);
  if (text.includes(needle)) failures.push(`${rel} still contains: ${label}`);
}

const plans = read('src/lib/plans.ts');
['free', 'basic', 'pro', 'ai', 'trial_21d'].forEach((plan) => {
  if (!plans.includes(plan)) failures.push(`src/lib/plans.ts nie definiuje planu ${plan}`);
});
[
  'ai: false',
  'digest: true',
  'googleCalendar: true',
  'fullAi: true',
  'TRIAL_DAYS = 21',
  'activeLeads: 5',
  'activeTasks: 5',
  'activeEvents: 5',
  'activeDrafts: 3',
].forEach((needle) => {
  if (!plans.includes(needle)) failures.push(`src/lib/plans.ts missing model marker: ${needle}`);
});

mustInclude('api/me.ts', 'buildPlanAccessModel', 'api/me uses central plan model');
mustInclude('api/me.ts', 'normalizeAccessPlanId', 'api/me uses shared normalizePlanId');
mustInclude('api/me.ts', 'subscriptionStatus: access.status', 'api/me returns subscriptionStatus in access model');
mustInclude('api/me.ts', 'planId: model.planId', 'api/me returns planId in access model');
mustNotInclude('api/me.ts', 'ai: !isFree', 'old AI gating shortcut');
mustNotInclude('api/me.ts', 'googleCalendar: !isFree', 'old Google Calendar gating shortcut');

mustInclude('src/server/_access-gate.ts', 'assertWorkspaceFeatureAllowed', 'backend feature gate');
mustInclude('src/server/_access-gate.ts', "'ai'", 'AI backend gate key');
mustInclude('src/server/_access-gate.ts', "'googleCalendar'", 'Google Calendar backend gate key');
mustInclude('src/server/_access-gate.ts', 'AI_NOT_AVAILABLE_ON_PLAN', 'AI plan error');
mustInclude('src/server/_access-gate.ts', 'GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN', 'Google Calendar plan error');

mustInclude('src/hooks/useWorkspace.ts', 'features:', 'workspace hook exposes features');
mustInclude('src/hooks/useWorkspace.ts', 'limits:', 'workspace hook exposes limits');
mustInclude('src/hooks/useWorkspace.ts', 'buildPlanAccessModel', 'workspace hook uses central model');

const login = read('src/pages/Login.tsx');
if (!login.includes('21 dni testu')) failures.push('src/pages/Login.tsx nie pokazuje 21 dni testu');
if (login.includes('14 dni testu')) failures.push('src/pages/Login.tsx dalej pokazuje 14 dni testu');

mustInclude('src/pages/Billing.tsx', 'Google Calendar sync', 'Billing shows Google Calendar in Pro/AI');
mustInclude('src/pages/Billing.tsx', 'Pełny asystent AI', 'Billing distinguishes full AI');
mustInclude('src/pages/Billing.tsx', 'Raport tygodniowy', 'Billing shows weekly report on Pro');
mustInclude('src/pages/Billing.tsx', "{ name: 'Google Calendar', basic: 'Nie', pro: 'Dostępne', ai: 'Dostępne' }", 'Billing feature matrix gates Google Calendar');
mustInclude('src/pages/Billing.tsx', "{ name: 'Pełny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dostępne' }", 'Billing feature matrix gates full AI');

mustInclude('src/components/GlobalQuickActions.tsx', 'access?.features?.ai', 'global assistant is gated by plan feature');
mustInclude('src/components/GlobalQuickActions.tsx', 'Asystent AI jest w planie AI', 'locked AI button copy');

if (failures.length) {
  console.error('P0 plan/access gating guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: P0 plan/access gating guard passed.');
