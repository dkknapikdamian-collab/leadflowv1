#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    fail(relativePath, 'Missing required file');
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing pattern: ' + regex) + ' [regex=' + regex + ']');
}

function assertNotRegex(scope, content, regex, message) {
  if (!regex.test(content)) pass(scope, message || 'Forbidden pattern absent: ' + regex);
  else fail(scope, (message || 'Forbidden pattern found: ' + regex) + ' [regex=' + regex + ']');
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

const files = {
  plans: 'src/lib/plans.ts',
  visibilityDoc: 'docs/technical/PLAN_VISIBILITY_CONTRACT_STAGE32B_2026-05-03.md',
  matrixDoc: 'docs/technical/PLAN_FEATURE_MATRIX_STAGE32_2026-05-03.md',
  releaseDoc: 'docs/release/FAZA3_ETAP32_PLAN_FEATURE_ACCESS_GATE_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const plans = readRequired(files.plans);
const visibilityDoc = readRequired(files.visibilityDoc);
const matrixDoc = readRequired(files.matrixDoc);
const releaseDoc = readRequired(files.releaseDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Visibility contract doc');
for (const marker of [
  'Lower plans must not see higher-plan operational features',
  'Default: hide unavailable higher-plan features.',
  'Exception: show upsell only in Billing / plan comparison / blocked direct route.',
  'Free',
  'Basic',
  'Pro',
  'AI',
  'Trial 21 days',
  'Free users see AI buttons everywhere',
  'visible_ai_action_on_non_ai_plan',
  'visible_google_action_on_basic_or_free',
  'Pro does not unlock full AI.',
  'FAZA 3 - Etap 3.2C - Plan-based UI hiding and route blockers',
]) {
  assertIncludes(files.visibilityDoc, visibilityDoc, marker, 'Visibility doc contains: ' + marker);
}

for (const marker of [
  'AI assistant',
  'AI command box',
  'Google Calendar connect/sync',
  'Daily digest e-mail settings',
  'Weekly report',
  'CSV import',
  'Recurring reminders',
  'Browser notifications',
  'Admin-only AI settings',
]) {
  assertIncludes(files.visibilityDoc, visibilityDoc, marker, 'Free/plan hidden feature is documented: ' + marker);
}

section('Source-level visibility helpers');
for (const marker of [
  'export type PlanFeatureVisibility',
  'available',
  'hidden_by_plan',
  'upsell_in_billing',
  'blocked_direct_route',
  'export const PLAN_FEATURE_MINIMUM_PLANS',
  'export const PLAN_FEATURE_VISIBILITY_RULES',
  'export function getMinimumPlanForFeature',
  'export function getPlanFeatureVisibility',
  'export function shouldExposePlanFeature',
]) {
  assertIncludes(files.plans, plans, marker, 'plans.ts contains visibility helper marker: ' + marker);
}

for (const exact of [
  "browserNotifications: PLAN_IDS.basic",
  "digest: PLAN_IDS.basic",
  "lightParser: PLAN_IDS.basic",
  "lightDrafts: PLAN_IDS.basic",
  "googleCalendar: PLAN_IDS.pro",
  "weeklyReport: PLAN_IDS.pro",
  "csvImport: PLAN_IDS.pro",
  "recurringReminders: PLAN_IDS.pro",
  "ai: PLAN_IDS.ai",
  "fullAi: PLAN_IDS.ai",
]) {
  assertIncludes(files.plans, plans, exact, 'Minimum plan mapping contains: ' + exact);
}

assertRegex(files.plans, plans, /allowedUpsellSurfaces:\s*\[[\s\S]*'billing'[\s\S]*'plan_comparison'[\s\S]*'blocked_direct_route'[\s\S]*\]/, 'Upsell surfaces are limited');
assertRegex(files.plans, plans, /defaultDeniedVisibility:\s*'hidden_by_plan'/, 'Default denied visibility is hidden_by_plan');
assertRegex(files.plans, plans, /if\s*\(isPlanFeatureEnabled\(planId,\s*feature,\s*subscriptionStatus\)\)\s*return 'available'/, 'Available feature returns available state');
assertRegex(files.plans, plans, /return PLAN_FEATURE_VISIBILITY_RULES\.defaultDeniedVisibility/, 'Unavailable feature defaults to hidden');
assertNotRegex(files.plans, plans, /fullAi:\s*PLAN_IDS\.pro/, 'fullAi minimum plan is not Pro');
assertNotRegex(files.plans, plans, /ai:\s*PLAN_IDS\.pro/, 'ai minimum plan is not Pro');

section('Docs point to the visibility contract');
assertIncludes(files.matrixDoc, matrixDoc, 'PLAN_VISIBILITY_CONTRACT_STAGE32B_2026-05-03.md', 'Matrix doc links visibility contract');
assertIncludes(files.releaseDoc, releaseDoc, 'PLAN_VISIBILITY_CONTRACT_STAGE32B_2026-05-03.md', 'Release doc links visibility contract');
assertIncludes(files.releaseDoc, releaseDoc, 'Lower plans must not see higher-plan operational features', 'Release doc repeats main visibility rule');

section('Package and quiet gate');
let pkg = {};
try {
  pkg = JSON.parse(pkgRaw);
  pass(files.pkg, 'package.json parses');
} catch (error) {
  fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error)));
}
const scripts = pkg.scripts || {};
if (scripts['check:faza3-etap32b-plan-visibility-contract'] === 'node scripts/check-faza3-etap32b-plan-visibility-contract.cjs') {
  pass(files.pkg, 'check:faza3-etap32b-plan-visibility-contract is wired');
} else {
  fail(files.pkg, 'missing check:faza3-etap32b-plan-visibility-contract');
}
if (scripts['test:faza3-etap32b-plan-visibility-contract'] === 'node --test tests/faza3-etap32b-plan-visibility-contract.test.cjs') {
  pass(files.pkg, 'test:faza3-etap32b-plan-visibility-contract is wired');
} else {
  fail(files.pkg, 'missing test:faza3-etap32b-plan-visibility-contract');
}
assertIncludes(files.quiet, quiet, 'tests/faza3-etap32b-plan-visibility-contract.test.cjs', 'Quiet release gate includes Faza3 Etap3.2B test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.2B plan visibility contract guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 3 - Etap 3.2B plan visibility contract guard');
