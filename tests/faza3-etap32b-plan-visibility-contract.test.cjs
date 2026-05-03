const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 3 Etap 3.2B plan visibility contract is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const visibilityDoc = read('docs/technical/PLAN_VISIBILITY_CONTRACT_STAGE32B_2026-05-03.md');
  const matrixDoc = read('docs/technical/PLAN_FEATURE_MATRIX_STAGE32_2026-05-03.md');
  const releaseDoc = read('docs/release/FAZA3_ETAP32_PLAN_FEATURE_ACCESS_GATE_2026-05-03.md');

  assert.equal(pkg.scripts['check:faza3-etap32b-plan-visibility-contract'], 'node scripts/check-faza3-etap32b-plan-visibility-contract.cjs');
  assert.equal(pkg.scripts['test:faza3-etap32b-plan-visibility-contract'], 'node --test tests/faza3-etap32b-plan-visibility-contract.test.cjs');
  assert.match(quiet, /tests\/faza3-etap32b-plan-visibility-contract\.test\.cjs/);

  assert.match(visibilityDoc, /Default: hide unavailable higher-plan features/);
  assert.match(visibilityDoc, /Exception: show upsell only in Billing \/ plan comparison \/ blocked direct route/);
  assert.match(visibilityDoc, /Free[\s\S]*Must be hidden in normal workflow:[\s\S]*AI assistant/);
  assert.match(visibilityDoc, /Basic[\s\S]*Must be hidden in normal workflow:[\s\S]*Google Calendar connect\/sync/);
  assert.match(visibilityDoc, /Pro does not unlock full AI/);
  assert.match(visibilityDoc, /AI[\s\S]*Full AI assistant/);

  assert.match(matrixDoc, /PLAN_VISIBILITY_CONTRACT_STAGE32B_2026-05-03\.md/);
  assert.match(releaseDoc, /Lower plans must not see higher-plan operational features/);
});

test('plans.ts exposes minimum-plan and visibility helpers for future UI checks', () => {
  const plans = read('src/lib/plans.ts');

  assert.match(plans, /export const PLAN_FEATURE_MINIMUM_PLANS/);
  assert.match(plans, /googleCalendar:\s*PLAN_IDS\.pro/);
  assert.match(plans, /fullAi:\s*PLAN_IDS\.ai/);
  assert.match(plans, /ai:\s*PLAN_IDS\.ai/);
  assert.doesNotMatch(plans, /fullAi:\s*PLAN_IDS\.pro/);
  assert.doesNotMatch(plans, /ai:\s*PLAN_IDS\.pro/);

  assert.match(plans, /export const PLAN_FEATURE_VISIBILITY_RULES/);
  assert.match(plans, /defaultDeniedVisibility:\s*'hidden_by_plan'/);
  assert.match(plans, /allowedUpsellSurfaces:[\s\S]*'billing'[\s\S]*'plan_comparison'[\s\S]*'blocked_direct_route'/);
  assert.match(plans, /export function getPlanFeatureVisibility/);
  assert.match(plans, /export function shouldExposePlanFeature/);
});
