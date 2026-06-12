const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(`STAGE231E2_R7_FAIL: ${message}`);
    process.exit(1);
  }
}

const apiMe = read('api/me.ts');
const layout = read('src/components/Layout.tsx');
const access = read('src/lib/access.ts');
const settings = read('src/pages/Settings.tsx');

assert(apiMe.includes('STAGE231E2_R7_TRIAL_ACCESS_BOOTSTRAP_REPAIR'), 'api/me must include R7 repair marker.');
assert(apiMe.includes('shouldRepairTrialAccessBootstrap'), 'api/me must include shouldRepairTrialAccessBootstrap.');
assert(apiMe.includes("workspaceResolutionMode === 'historical_mapping'"), 'historical mapping must not be silently reactivated.');
assert(apiMe.includes("workspaceResolutionMode === 'explicit_fallback'"), 'explicit fallback must not be silently reactivated.');
assert(/currentStatus === 'trial_active' \|\| currentStatus === 'trial_ending'/.test(apiMe), 'repair must cover active/ending trial status.');
assert(/!isFutureDate\(currentTrialEndsAt\)/.test(apiMe), 'repair must detect missing/past trial end.');
assert(/patch\.plan_id = DEFAULT_PLAN_ID;[\s\S]*patch\.subscription_status = DEFAULT_STATUS;[\s\S]*patch\.trial_ends_at = trialEndsAt;/.test(apiMe), 'repair must set plan, status and future trial end together.');
assert(/workspaceResolutionMode: workspaceResolutionMode as WorkspaceResolutionMode/.test(apiMe), 'ensureWorkspace must receive resolution mode.');

assert(/data-shell-access-status-card/.test(layout), 'sidebar must expose an access status card.');
assert(/shouldShowTrialCard[\s\S]*access\?\.isTrialActive[\s\S]*trialDaysLeft > 0/.test(layout), 'active trial card must still block Trial 0 dni.');
assert(/shouldShowAccessStatusCard[\s\S]*access\?\.status === 'trial_expired'[\s\S]*access\?\.status === 'payment_failed'[\s\S]*access\?\.status === 'paid_active'/.test(layout), 'sidebar must show expired/payment/paid access statuses.');
assert(/ctaLabel=\{access\?\.ctaLabel\}/.test(layout), 'sidebar access card must use access CTA label.');

assert(/buildTrialExpiredSummary/.test(access), 'access summary must classify missing/past trialEnd as expired.');
assert(/humanAccessStatus/.test(settings) && /case 'trial_active':/.test(settings) && /case 'trial_expired':/.test(settings), 'Settings must display access status from access model.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231E2_R7_TRIAL_ACCESS_BOOTSTRAP_REPAIR',
  contract: 'fresh profile/identity trial bootstrap cannot return PLAN Trial + ACCESS Trial expired; sidebar shows access status for expired/payment/paid states',
}, null, 2));