const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function reject(file, pattern, message) {
  assert(!pattern.test(read(file)), message);
}

const plans = read('src/lib/plans.ts');
const workspace = read('src/lib/workspace.ts');
const useWorkspace = read('src/hooks/useWorkspace.ts');
const access = read('src/lib/access.ts');
const layout = read('src/components/Layout.tsx');
const billing = read('src/pages/Billing.tsx');
const login = read('src/pages/Login.tsx');
const apiMe = read('api/me.ts');

assert(/export\s+const\s+TRIAL_DAYS\s*=\s*14\s*;/.test(plans), 'plans.ts must define TRIAL_DAYS = 14.');
assert(/export\s+const\s+TRIAL_MS\s*=\s*TRIAL_DAYS\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000\s*;/.test(plans), 'plans.ts must derive TRIAL_MS from TRIAL_DAYS.');
assert(/trial:\s*'trial_14d'/.test(plans), 'PLAN_IDS.trial must be trial_14d.');
assert(/Legacy alias: old workspaces may still store trial_21d/.test(plans) && /trial_21d:\s*PLAN_IDS\.trial/.test(plans), 'plans.ts must keep trial_21d only as legacy alias.');

assert(/PLAN_IDS,\s*TRIAL_DAYS,\s*TRIAL_MS/.test(workspace), 'workspace.ts must import PLAN_IDS, TRIAL_DAYS and TRIAL_MS.');
assert(/buildTrialEndsAtFromPlanContract/.test(workspace), 'workspace.ts must build trial end from central plan contract.');
assert(/planId:\s*adminAccess\s*\?\s*PLAN_IDS\.pro\s*:\s*PLAN_IDS\.trial/.test(workspace), 'workspace.ts must assign new non-admin workspaces to PLAN_IDS.trial.');
assert(/trialEndsAt:\s*adminAccess\s*\?\s*null\s*:\s*buildTrialEndsAtFromPlanContract\(\)/.test(workspace), 'workspace.ts must use central TRIAL_MS for trialEndsAt.');
reject('src/lib/workspace.ts', /trial_21d/, 'workspace.ts must not actively generate trial_21d.');
reject('src/lib/workspace.ts', /21\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/, 'workspace.ts must not contain active 21-day trial literal.');

assert(/buildPlanAccessModel,\s*PLAN_IDS,\s*TRIAL_MS/.test(useWorkspace), 'useWorkspace.ts must import PLAN_IDS and TRIAL_MS.');
assert(/planId:\s*PLAN_IDS\.trial/.test(useWorkspace), 'useWorkspace.ts local fallback must use PLAN_IDS.trial.');
assert(/Date\.now\(\)\s*\+\s*TRIAL_MS/.test(useWorkspace), 'useWorkspace.ts local fallback must use TRIAL_MS.');
reject('src/hooks/useWorkspace.ts', /21\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/, 'useWorkspace.ts must not contain active 21-day trial literal.');

assert(/const\s+rawTrialDaysLeft\s*=/.test(access), 'access.ts must keep rawTrialDaysLeft for database-derived values.');
assert(/const\s+trialDaysLeft\s*=\s*Math\.min\(TRIAL_LENGTH_DAYS,\s*rawTrialDaysLeft\)/.test(access), 'access.ts display trialDaysLeft must be capped to the 14-day contract.');
assert(/trialProgressPercent[\s\S]*TRIAL_LENGTH_DAYS/.test(access), 'access.ts progress must be based on central trial length.');

assert(/access\?\.isTrialActive/.test(layout) && /trialDaysLeft\s*>\s*0/.test(layout), 'Layout.tsx must render trial card from access summary and hide 0-day trial card.');
assert(/TrialCard[\s\S]*trialProgressPercent/.test(layout), 'Layout.tsx must use access trial progress percent.');

assert(/PLAN_IDS,\s*TRIAL_DAYS/.test(billing), 'Billing.tsx must import PLAN_IDS and TRIAL_DAYS.');
assert(/return\s+PLAN_IDS\.trial\s*;/.test(billing), 'Billing.tsx display fallback must not return trial_21d.');
assert(/getTrialContractEndsAtLabel/.test(billing), 'Billing.tsx must display active trial date from 14-day contract days.');
reject('src/pages/Billing.tsx', /return\s+['"]trial_21d['"]/, 'Billing.tsx must not return trial_21d as display fallback.');

assert(/14 dni testu/.test(login), 'Login.tsx must say 14 dni testu.');
assert(/TRIAL_DAYS as PLAN_TRIAL_DAYS/.test(apiMe) && /TRIAL_MS as PLAN_TRIAL_MS/.test(apiMe), 'api/me.ts must source trial length from plans.ts.');
assert(/buildTrialEndsAt\(\)[\s\S]*TRIAL_MS/.test(apiMe), 'api/me.ts must build trial end from TRIAL_MS.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231E2_R5_TRIAL_14D_WORKSPACE_FALLBACK_AND_PLAN_MATRIX',
  contract: 'trial_14d is the only active runtime bootstrap path; trial_21d remains only as legacy alias in plans.ts; UI display is capped to the 14-day contract',
}, null, 2));
