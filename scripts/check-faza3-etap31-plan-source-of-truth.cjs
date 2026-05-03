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

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
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
  access: 'src/lib/access.ts',
  useWorkspace: 'src/hooks/useWorkspace.ts',
  accessGate: 'src/server/_access-gate.ts',
  meApi: 'api/me.ts',
  doc: 'docs/release/FAZA3_ETAP31_PLAN_SOURCE_OF_TRUTH_2026-05-03.md',
  technical: 'docs/technical/PLAN_SOURCE_OF_TRUTH_STAGE31_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const plans = readRequired(files.plans);
const access = readRequired(files.access);
const useWorkspace = readRequired(files.useWorkspace);
const accessGate = readRequired(files.accessGate);
const meApi = readRequired(files.meApi);
const doc = readRequired(files.doc);
const technical = readRequired(files.technical);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Required files');
for (const file of Object.values(files)) {
  if (exists(file)) pass(file, 'exists');
  else fail(file, 'missing');
}

section('Canonical plans.ts contract');
for (const needle of [
  'export const TRIAL_DAYS = 21',
  'export const PLAN_IDS',
  "free: 'free'",
  "basic: 'basic'",
  "pro: 'pro'",
  "ai: 'ai'",
  "trial: 'trial_21d'",
  'export const ACCESS_STATUSES',
  'trial_active',
  'trial_ending',
  'trial_expired',
  'free_active',
  'paid_active',
  'payment_failed',
  'canceled',
  'inactive',
  'export const FREE_LIMITS',
  'activeLeads: 5',
  'activeTasks: 5',
  'activeEvents: 5',
  'activeDrafts: 3',
  'export const PLAN_DEFINITIONS',
  'export function normalizePlanId',
  'export function buildPlanAccessModel',
  'export function getPlanLimits',
  'export function getPlanFeatures',
  'export function isPlanFeatureEnabled',
]) {
  assertIncludes(files.plans, plans, needle, 'plans.ts contains canonical: ' + needle);
}

for (const feature of [
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
]) {
  assertRegex(files.plans, plans, new RegExp(feature + '\\??:\\s*boolean'), 'PlanFeatures exposes ' + feature);
}

section('Consumers use plans.ts');
assertRegex(files.access, access, /import\s+\{\s*TRIAL_DAYS[^}]*\}\s+from\s+['"]\.\/plans['"]/, 'access.ts imports TRIAL_DAYS from plans.ts');
assertIncludes(files.useWorkspace, useWorkspace, "from '../lib/plans'", 'useWorkspace imports buildPlanAccessModel from plans.ts');
assertIncludes(files.useWorkspace, useWorkspace, 'buildPlanAccessModel', 'useWorkspace uses buildPlanAccessModel');
assertIncludes(files.meApi, meApi, "from '../src/lib/plans.js'", 'api/me imports plans.ts runtime module');
for (const needle of [
  'PLAN_IDS',
  'PLAN_TRIAL_DAYS',
  'PLAN_TRIAL_MS',
  'buildPlanAccessModel',
  'normalizePlanId as normalizeAccessPlanId',
]) {
  assertIncludes(files.meApi, meApi, needle, 'api/me uses plans source: ' + needle);
}

section('_access-gate.ts Free limit source');
assertIncludes(files.accessGate, accessGate, "from '../lib/plans.js'", '_access-gate imports plan source');
assertIncludes(files.accessGate, accessGate, 'PLAN_FREE_LIMITS', '_access-gate aliases canonical FREE_LIMITS');
assertRegex(files.accessGate, accessGate, /export\s+const\s+FREE_LIMITS\s*=\s*PLAN_FREE_LIMITS\s*;/, '_access-gate re-exports canonical FREE_LIMITS');
assertNotRegex(
  files.accessGate,
  accessGate,
  /export\s+const\s+FREE_LIMITS\s*=\s*\{\s*activeLeads:\s*5,\s*activeTasks:\s*5,\s*activeEvents:\s*5,\s*activeDrafts:\s*3,\s*\}\s*as\s+const\s*;/s,
  '_access-gate no longer owns a duplicated FREE_LIMITS object',
);

section('Documentation');
for (const needle of [
  'FAZA 3 - Etap 3.1 - Jedno źródło prawdy dla planów',
  'src/lib/plans.ts',
  'trial_active',
  'free_active',
  'paid_active',
  'payment_failed',
  'activeLeads = 5',
  'FAZA 3 - Etap 3.2 - Backendowe blokady funkcji',
]) {
  assertIncludes(files.doc, doc, needle, 'Release doc contains: ' + needle);
  assertIncludes(files.technical, technical, needle === 'FAZA 3 - Etap 3.1 - Jedno źródło prawdy dla planów' ? 'Plan Source of Truth' : needle, 'Technical doc contains expected contract content');
}

section('Package and quiet gate');
let pkg = {};
try {
  pkg = JSON.parse(pkgRaw);
  pass(files.pkg, 'package.json parses');
} catch (error) {
  fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error)));
}

const scripts = pkg.scripts || {};
if (scripts['check:faza3-etap31-plan-source-of-truth'] === 'node scripts/check-faza3-etap31-plan-source-of-truth.cjs') {
  pass(files.pkg, 'check:faza3-etap31-plan-source-of-truth is wired');
} else {
  fail(files.pkg, 'missing check:faza3-etap31-plan-source-of-truth');
}

if (scripts['test:faza3-etap31-plan-source-of-truth'] === 'node --test tests/faza3-etap31-plan-source-of-truth.test.cjs') {
  pass(files.pkg, 'test:faza3-etap31-plan-source-of-truth is wired');
} else {
  fail(files.pkg, 'missing test:faza3-etap31-plan-source-of-truth');
}

assertIncludes(files.quiet, quiet, 'tests/faza3-etap31-plan-source-of-truth.test.cjs', 'Quiet release gate includes Faza3 Etap3.1 test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.1 plan source-of-truth guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 3 - Etap 3.1 plan source-of-truth guard');
