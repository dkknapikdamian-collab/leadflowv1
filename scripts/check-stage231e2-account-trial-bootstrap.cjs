const fs = require('fs');

const plansPath = 'src/lib/plans.ts';
const apiMePath = 'api/me.ts';

function read(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`Missing required file: ${path}`);
  }
  return fs.readFileSync(path, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const plans = read(plansPath);
const apiMe = read(apiMePath);

assert(plans.includes('STAGE231E2_ACCOUNT_TRIAL_BOOTSTRAP_BLOCKER'), 'plans.ts must document the account trial bootstrap blocker.');
assert(/return\s+PLAN_IDS\.free;\s*}\s*\n\s*export function getPlanDefinition/s.test(plans), 'normalizePlanId fallback must fail closed to Free, not Trial.');
assert(!/return\s+PLAN_IDS\.trial;\s*}\s*\n\s*export function getPlanDefinition/s.test(plans), 'normalizePlanId must not silently return trial for unknown states.');
assert(apiMe.includes('buildTrialEndsAt()'), 'api/me.ts must build fresh trial end dates server-side.');
assert(apiMe.includes('shouldRepairFreshTrialBootstrap'), 'api/me.ts must keep fresh broken trial bootstrap repair logic.');
assert(apiMe.includes("authIntent !== 'register'") || apiMe.includes('authIntent !== "register"'), 'api/me.ts must still distinguish register vs login for account bootstrap.');
assert(apiMe.includes('BROKEN_BOOTSTRAP_REPAIR_WINDOW_MS'), 'api/me.ts must keep a bounded repair window for broken fresh bootstrap rows.');
assert(apiMe.includes('trial_expired'), 'api/me.ts must explicitly classify expired trials instead of treating them as active.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231E2_ACCOUNT_TRIAL_BOOTSTRAP_BLOCKER_R1',
  contract: 'unknown plan states fail closed to Free; fresh trial bootstrap repair stays bounded; expired trials remain explicit',
}, null, 2));
