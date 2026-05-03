#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const results = [];

function rel(p) {
  return path.join(root, p);
}

function readRequired(file) {
  const target = rel(file);
  if (!fs.existsSync(target)) {
    fail(file, `Brak wymaganego pliku: ${file}`);
    return '';
  }
  return fs.readFileSync(target, 'utf8');
}

function pass(scope, message) {
  results.push({ level: 'PASS', scope, message });
}

function warn(scope, message) {
  results.push({ level: 'WARN', scope, message });
}

function fail(scope, message) {
  results.push({ level: 'FAIL', scope, message });
}

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || `Znaleziono: ${needle}`);
  else fail(scope, `${message || `Brak: ${needle}`} [needle=${JSON.stringify(needle)}]`);
}

function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || `Pasuje: ${regex}`);
  else fail(scope, `${message || `Nie pasuje: ${regex}`} [regex=${regex}]`);
}

function assertNotRegex(scope, content, regex, message) {
  if (!regex.test(content)) pass(scope, message || `Brak niedozwolonego wzorca: ${regex}`);
  else fail(scope, `${message || `Znaleziono niedozwolony wzorzec: ${regex}`} [regex=${regex}]`);
}

function section(title) {
  console.log(`\n== ${title} ==`);
}

const requiredFiles = {
  plans: 'src/lib/plans.ts',
  access: 'src/lib/access.ts',
  useWorkspace: 'src/hooks/useWorkspace.ts',
  billing: 'src/pages/Billing.tsx',
  me: 'api/me.ts',
  fallback: 'src/lib/supabase-fallback.ts',
};

const files = Object.fromEntries(
  Object.entries(requiredFiles).map(([key, file]) => [key, readRequired(file)]),
);

const accessStatuses = [
  'trial_active',
  'trial_ending',
  'trial_expired',
  'free_active',
  'paid_active',
  'payment_failed',
  'canceled',
  'inactive',
];

section('Plan/access model');
assertRegex('plans', files.plans, /TRIAL_DAYS\s*=\s*21\b/, 'Trial ma jedno źródło prawdy i trwa 21 dni');
assertIncludes('plans', files.plans, 'FREE_LIMITS', 'Free limity są w src/lib/plans.ts');
assertIncludes('plans', files.plans, 'buildPlanAccessModel', 'Plan access model istnieje');
for (const status of accessStatuses) {
  assertIncludes('plans', files.plans, `'${status}'`, `Status ${status} istnieje w modelu planów`);
}
assertIncludes('plans', files.plans, 'activeLeads: 5', 'Free ogranicza aktywne leady do 5');
assertIncludes('plans', files.plans, 'activeTasks: 5', 'Free ogranicza aktywne zadania do 5');
assertIncludes('plans', files.plans, 'activeEvents: 5', 'Free ogranicza aktywne wydarzenia do 5');
assertIncludes('plans', files.plans, 'activeDrafts: 3', 'Free ogranicza aktywne szkice do 3');

section('src/lib/access.ts');
assertIncludes('access', files.access, 'export function getAccessSummary', 'UI access summary ma centralny helper');
assertIncludes('access', files.access, 'buildTrialExpiredSummary', 'Trial expired ma osobny, czytelny stan');
assertRegex('access', files.access, /status:\s*'trial_expired'[\s\S]*?hasAccess:\s*false/, 'Trial expired blokuje tworzenie nowych danych');
assertRegex('access', files.access, /rawStatus\s*===\s*'paid_active'[\s\S]*?isBillingDateExpired/, 'paid_active sprawdza wygaśnięcie okresu billingowego');
assertRegex('access', files.access, /rawStatus\s*===\s*'free_active'[\s\S]*?hasAccess:\s*true/, 'Free ma jawny stan dostępu');
for (const status of accessStatuses) {
  assertIncludes('access', files.access, `'${status}'`, `Status ${status} jest obsługiwany w access.ts`);
}

section('api/me.ts');
assertIncludes('api/me', files.me, 'PLAN_TRIAL_DAYS', '/api/me używa TRIAL_DAYS z src/lib/plans');
assertIncludes('api/me', files.me, 'buildAccess', '/api/me buduje backendowy access state');
assertIncludes('api/me', files.me, 'enrichAccessModel', '/api/me wzbogaca access o limity i features');
assertIncludes('api/me', files.me, 'buildPlanAccessModel', '/api/me używa tego samego modelu planów co frontend');
assertIncludes('api/me', files.me, 'trial_expired', '/api/me potrafi zwrócić trial_expired');
assertIncludes('api/me', files.me, 'payment_failed', '/api/me potrafi zwrócić payment_failed');
assertIncludes('api/me', files.me, 'free_active', '/api/me potrafi zwrócić free_active');
assertNotRegex('api/me', files.me, /TRIAL_DAYS\s*=\s*14\b/, 'Nie ma starego 14-dniowego triala w api/me');

section('useWorkspace');
assertIncludes('useWorkspace', files.useWorkspace, 'fetchMeFromSupabase', 'useWorkspace pobiera /api/me przez fallback');
assertIncludes('useWorkspace', files.useWorkspace, 'setAccessOverride(me.access)', 'useWorkspace ufa backendowemu me.access');
assertIncludes('useWorkspace', files.useWorkspace, 'buildPlanAccessModel', 'useWorkspace nie zgaduje planów ręcznie');
assertIncludes('useWorkspace', files.useWorkspace, 'accessOverridePlanAccess', 'useWorkspace normalizuje accessOverride do modelu planów');
assertRegex('useWorkspace', files.useWorkspace, /hasAccess:\s*finalAccess\.hasAccess\s*\|\|\s*isAppOwner/, 'hasAccess z UI pochodzi z finalAccess, z wyjątkiem właściciela aplikacji');
assertIncludes('useWorkspace', files.useWorkspace, 'const refresh = () => setRefreshToken', 'useWorkspace ma refresh po zmianach billing/workspace');
assertIncludes('useWorkspace', files.useWorkspace, 'WORKSPACE_BOOTSTRAP_FAILED', 'Błąd bootstrapu workspace jest jawny');
assertIncludes('useWorkspace', files.useWorkspace, 'WORKSPACE_CONTEXT_REQUIRED', 'Brak workspace jest jawny');

section('Billing UI truth');
assertIncludes('Billing', files.billing, 'ACCESS_COPY', 'Billing ma mapę prawdy statusów');
for (const status of accessStatuses) {
  assertIncludes('Billing', files.billing, `${status}:`, `Billing copy obsługuje status ${status}`);
}
assertIncludes('Billing', files.billing, 'createBillingCheckoutSessionInSupabase', 'Billing używa realnego endpointu checkout');
assertIncludes('Billing', files.billing, 'billingActionInSupabase', 'Billing używa backendowej akcji cancel/resume');
assertIncludes('Billing', files.billing, "checkoutState === 'success'", 'Billing obsługuje powrót po checkout success');
assertIncludes('Billing', files.billing, 'void refresh()', 'Billing odświeża workspace po checkout/cancel');
assertRegex('Billing', files.billing, /handleBillingAction[\s\S]*?await refresh\(\)/, 'Cancel/resume odświeża access bez ręcznego reloadu');
assertNotRegex('Billing', files.billing, /Symulacj|symulacj/i, 'Billing nie pokazuje już flow jako symulacji');
assertNotRegex('Billing', files.billing, /SOC\s*2\s*Type\s*II\s*certified/i, 'Billing nie zawiera fałszywego claimu SOC 2 certified');

section('Write access gate surface');
const screens = [
  'src/pages/Today.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/CaseDetail.tsx',
];
for (const screen of screens) {
  const content = readRequired(screen);
  const hasWorkspaceHook = /useWorkspace\s*\(/.test(content) || /hasAccess/.test(content) || /Access/.test(content);
  if (hasWorkspaceHook) pass(screen, 'Ekran ma ślad access/workspace gate');
  else warn(screen, 'Nie znaleziono jawnego śladu access gate. Sprawdź ręcznie, czy tworzenie nowych rekordów jest blokowane po trial_expired.');
}

section('Report');
for (const item of results) {
  const icon = item.level === 'PASS' ? 'PASS' : item.level === 'WARN' ? 'WARN' : 'FAIL';
  console.log(`${icon} ${item.scope}: ${item.message}`);
}

const failed = results.filter((item) => item.level === 'FAIL');
const warned = results.filter((item) => item.level === 'WARN');
console.log(`\nSummary: ${results.length - failed.length - warned.length} pass, ${warned.length} warn, ${failed.length} fail.`);

if (failed.length) {
  console.error('\nFAIL Access/Billing Stage02A guard failed. Najpierw napraw powyższe punkty, potem uruchom ponownie.');
  process.exit(1);
}

console.log('\nPASS Access/Billing Stage02A source-of-truth guard');
