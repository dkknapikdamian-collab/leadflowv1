const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const plans = read('src/lib/plans.ts');
const accessGate = read('src/server/_access-gate.ts');
const meApi = read('api/me.ts');
const useWorkspace = read('src/hooks/useWorkspace.ts');
const billing = read('src/pages/Billing.tsx');
const accessGateComponent = read('src/components/AccessGate.tsx');
const workspaceSubscriptionApi = read('api/workspace-subscription.ts');

assert.match(plans, /TRIAL_DAYS\s*=\s*21/);
assert.match(plans, /activeTasksAndEvents:\s*5/);
assert.match(plans, /aiDaily:\s*30/);
assert.match(plans, /aiMonthly:\s*300/);
assert.match(plans, /free/);
assert.match(plans, /basic/);
assert.match(plans, /pro/);
assert.match(plans, /ai/);

assert.match(accessGate, /FREE_LIMIT_ACTIVE_TASKS_EVENTS_REACHED/);
assert.match(accessGate, /countWorkspaceCombinedTasksAndEvents/);

assert.match(meApi, /TRIAL_DAYS/);
assert.match(useWorkspace, /trial_21d/);

assert.match(billing, /21/);
assert.match(billing, /5 aktywnych zada\u0144\/wydarze\u0144/);
assert.match(billing, /30\/dzie\u0144 i 300\/miesi\u0105c/);

assert.match(accessGateComponent, /isPlanFeatureEnabled/);
assert.match(workspaceSubscriptionApi, /workspace-subscription/);

console.log('PASS plan access gating guard');
