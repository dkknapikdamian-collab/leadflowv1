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
  accessGate: 'src/server/_access-gate.ts',
  leadsApi: 'api/leads.ts',
  settings: 'src/pages/Settings.tsx',
  doc: 'docs/release/FAZA3_ETAP32_PLAN_FEATURE_ACCESS_GATE_2026-05-03.md',
  technical: 'docs/technical/PLAN_FEATURE_MATRIX_STAGE32_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const plans = readRequired(files.plans);
const accessGate = readRequired(files.accessGate);
const leadsApi = readRequired(files.leadsApi);
const settings = readRequired(files.settings);
const doc = readRequired(files.doc);
const technical = readRequired(files.technical);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Required files');
for (const file of Object.values(files)) {
  if (exists(file)) pass(file, 'exists');
  else fail(file, 'missing');
}

section('Plan matrix');
for (const marker of [
  'const BASIC_FEATURES',
  'digest: true',
  'lightParser: true',
  'lightDrafts: true',
  'browserNotifications: true',
  'const PRO_FEATURES',
  'googleCalendar: true',
  'weeklyReport: true',
  'csvImport: true',
  'recurringReminders: true',
  'const AI_FEATURES',
  'ai: true',
  'fullAi: true',
  'Trial 21 dni',
]) {
  assertIncludes(files.plans, plans, marker, 'plans.ts contains plan matrix marker: ' + marker);
}

assertRegex(files.plans, plans, /\[PLAN_IDS\.free\][\s\S]*features:\s*\{\s*\.\.\.NO_FEATURES\s*\}/, 'Free uses NO_FEATURES');
assertRegex(files.plans, plans, /\[PLAN_IDS\.basic\][\s\S]*features:\s*\{\s*\.\.\.BASIC_FEATURES\s*\}/, 'Basic uses BASIC_FEATURES');
assertRegex(files.plans, plans, /\[PLAN_IDS\.pro\][\s\S]*features:\s*\{\s*\.\.\.PRO_FEATURES\s*\}/, 'Pro uses PRO_FEATURES');
assertRegex(files.plans, plans, /\[PLAN_IDS\.ai\][\s\S]*features:\s*\{\s*\.\.\.AI_FEATURES\s*\}/, 'AI uses AI_FEATURES');
assertRegex(files.plans, plans, /\[PLAN_IDS\.trial\][\s\S]*features:\s*\{\s*\.\.\.AI_FEATURES\s*\}/, 'Trial uses AI_FEATURES');

section('Backend feature gates');
assertIncludes(files.accessGate, accessGate, 'isPlanFeatureEnabled', '_access-gate imports canonical feature evaluator');
assertIncludes(files.accessGate, accessGate, 'export async function assertWorkspaceFeatureAccess', 'Generic feature gate exists');
assertIncludes(files.accessGate, accessGate, 'WORKSPACE_FEATURE_ACCESS_REQUIRED', 'Generic feature error exists');
assertIncludes(files.accessGate, accessGate, 'WORKSPACE_FEATURE_NAME_REQUIRED', 'Feature name required error exists');
assertIncludes(files.accessGate, accessGate, "assertWorkspaceFeatureAccess(workspaceInput, 'fullAi'", 'AI gate delegates to fullAi feature');
assertIncludes(files.accessGate, accessGate, 'WORKSPACE_AI_ACCESS_REQUIRED', 'AI error remains stable');
assertNotRegex(files.accessGate, accessGate, /plan === 'pro'\)\s*return true/, 'Pro does not unlock full AI directly');
assertNotRegex(files.accessGate, accessGate, /plan === 'pro'\s*\|\|\s*plan\.includes\('ai'\)/, 'Old Pro/AI AI gate shortcut removed');

section('Google Calendar plan gate');
assertIncludes(files.leadsApi, leadsApi, 'assertWorkspaceFeatureAccess', 'Leads API imports feature gate');
assertIncludes(files.leadsApi, leadsApi, "assertWorkspaceFeatureAccess(input.workspaceId, 'googleCalendar')", 'Lead Google sync checks googleCalendar feature');
assertIncludes(files.leadsApi, leadsApi, "google_calendar_sync_status: 'disabled_by_plan'", 'Lead Google sync records disabled_by_plan');
assertIncludes(files.leadsApi, leadsApi, 'GOOGLE_CALENDAR_REQUIRES_PRO', 'Lead Google sync has plan error marker');

section('Settings UI feature hook');
assertIncludes(files.settings, settings, 'access?.features?.googleCalendar', 'Settings uses access.features.googleCalendar');
assertIncludes(files.settings, settings, 'canUseGoogleCalendarByPlan', 'Settings keeps Google Calendar plan guard');
assertNotRegex(files.settings, settings, /const\s+canUseGoogleCalendarByPlan\s*=\s*isAdmin\s*\|\|\s*isAppOwner\s*\|\|\s*access\?\.isPaidActive\s*\|\|\s*access\?\.status\s*===\s*'paid_active'/, 'Settings no longer uses paid_active alone for Google visibility');

section('Documentation');
for (const marker of [
  'Free = demo z limitami',
  'Basic = proste CRM bez ciężkich integracji',
  'Pro = integracje i automatyzacje operacyjne',
  'AI = pełny asystent AI',
  'Full AI assistant',
  'assertWorkspaceFeatureAccess',
  'FAZA 3 - Etap 3.2B - Plan-based UI visibility and feature smoke',
]) {
  assertIncludes(files.doc, doc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'PLAN FEATURE MATRIX',
  'Free:',
  'Basic:',
  'Pro:',
  'AI:',
  'Trial 21 dni:',
  'assertWorkspaceFeatureAccess',
  'FAZA 3 - Etap 3.2B - Plan-based UI visibility and feature smoke',
]) {
  assertIncludes(files.technical, technical, marker, 'Technical doc contains: ' + marker);
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
if (scripts['check:faza3-etap32-plan-feature-access-gate'] === 'node scripts/check-faza3-etap32-plan-feature-access-gate.cjs') {
  pass(files.pkg, 'check:faza3-etap32-plan-feature-access-gate is wired');
} else {
  fail(files.pkg, 'missing check:faza3-etap32-plan-feature-access-gate');
}
if (scripts['test:faza3-etap32-plan-feature-access-gate'] === 'node --test tests/faza3-etap32-plan-feature-access-gate.test.cjs') {
  pass(files.pkg, 'test:faza3-etap32-plan-feature-access-gate is wired');
} else {
  fail(files.pkg, 'missing test:faza3-etap32-plan-feature-access-gate');
}
assertIncludes(files.quiet, quiet, 'tests/faza3-etap32-plan-feature-access-gate.test.cjs', 'Quiet release gate includes Faza3 Etap3.2A test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.2A plan feature access gate failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 3 - Etap 3.2A plan feature access gate');
