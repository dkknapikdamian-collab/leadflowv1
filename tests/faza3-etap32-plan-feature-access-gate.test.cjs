const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 3 Etap 3.2A plan feature access gate is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/release/FAZA3_ETAP32_PLAN_FEATURE_ACCESS_GATE_2026-05-03.md');
  const technical = read('docs/technical/PLAN_FEATURE_MATRIX_STAGE32_2026-05-03.md');
  const guard = read('scripts/check-faza3-etap32-plan-feature-access-gate.cjs');

  assert.equal(pkg.scripts['check:faza3-etap32-plan-feature-access-gate'], 'node scripts/check-faza3-etap32-plan-feature-access-gate.cjs');
  assert.equal(pkg.scripts['test:faza3-etap32-plan-feature-access-gate'], 'node --test tests/faza3-etap32-plan-feature-access-gate.test.cjs');
  assert.match(quiet, /tests\/faza3-etap32-plan-feature-access-gate\.test\.cjs/);

  assert.match(doc, /Free = demo z limitami/);
  assert.match(doc, /Basic = proste CRM bez ciężkich integracji/);
  assert.match(doc, /Pro = integracje i automatyzacje operacyjne/);
  assert.match(doc, /AI = pełny asystent AI/);
  assert.match(doc, /FAZA 3 - Etap 3\.2B - Plan-based UI visibility and feature smoke/);

  assert.match(technical, /PLAN FEATURE MATRIX/);
  assert.match(technical, /assertWorkspaceFeatureAccess/);

  assert.match(guard, /PASS FAZA 3 - Etap 3\.2A plan feature access gate/);
});

test('Backend and Settings use canonical plan feature gates', () => {
  const accessGate = read('src/server/_access-gate.ts');
  const leadsApi = read('api/leads.ts');
  const settings = read('src/pages/Settings.tsx');
  const plans = read('src/lib/plans.ts');

  assert.match(plans, /const BASIC_FEATURES/);
  assert.match(plans, /const PRO_FEATURES/);
  assert.match(plans, /const AI_FEATURES/);
  assert.match(plans, /\[PLAN_IDS\.trial\][\s\S]*features:\s*\{\s*\.\.\.AI_FEATURES\s*\}/);

  assert.match(accessGate, /export async function assertWorkspaceFeatureAccess/);
  assert.match(accessGate, /WORKSPACE_FEATURE_ACCESS_REQUIRED/);
  assert.match(accessGate, /assertWorkspaceFeatureAccess\(workspaceInput, 'fullAi'/);
  assert.doesNotMatch(accessGate, /plan === 'pro'\)\s*return true/);

  assert.match(leadsApi, /assertWorkspaceFeatureAccess/);
  assert.match(leadsApi, /assertWorkspaceFeatureAccess\(input\.workspaceId, 'googleCalendar'\)/);
  assert.match(leadsApi, /google_calendar_sync_status:\s*'disabled_by_plan'/);
  assert.match(leadsApi, /GOOGLE_CALENDAR_REQUIRES_PRO/);

  assert.match(settings, /access\?\.features\?\.googleCalendar/);
  assert.doesNotMatch(settings, /const\s+canUseGoogleCalendarByPlan\s*=\s*isAdmin\s*\|\|\s*isAppOwner\s*\|\|\s*access\?\.isPaidActive\s*\|\|\s*access\?\.status\s*===\s*'paid_active'/);
});
