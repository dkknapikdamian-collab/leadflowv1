#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}

function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }

function count(content, needle) {
  return (content.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

function assertCount(scope, content, needle, expected, message) {
  const actual = count(content, needle);
  if (actual === expected) pass(scope, `${message} (${actual})`);
  else fail(scope, `${message} expected ${expected}, got ${actual} [needle=${JSON.stringify(needle)}]`);
}

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing pattern: ' + regex) + ' [regex=' + regex + ']');
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

const files = {
  settings: 'src/pages/Settings.tsx',
  billing: 'src/pages/Billing.tsx',
  releaseDoc: 'docs/release/FAZA3_ETAP32E_SETTINGS_DIGEST_BILLING_VISIBILITY_SMOKE_2026-05-03.md',
  technicalDoc: 'docs/technical/SETTINGS_DIGEST_BILLING_VISIBILITY_SMOKE_STAGE32E_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const settings = readRequired(files.settings);
const billing = readRequired(files.billing);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Settings gate declaration uniqueness');
assertCount(files.settings, settings, 'const canUseGoogleCalendarByPlan', 1, 'Exactly one Google Calendar plan gate declaration');
assertCount(files.settings, settings, 'const canUseDigestByPlan', 1, 'Exactly one digest plan gate declaration');
assertCount(files.settings, settings, 'const digestUiVisibleByPlan', 1, 'Exactly one digest UI gate declaration');

section('Settings Google Calendar visibility');
assertIncludes(files.settings, settings, 'canUseGoogleCalendarByPlan', 'Settings uses Google Calendar plan gate');
assertRegex(files.settings, settings, /canUseGoogleCalendarByPlan\s*=\s*Boolean\(isAdmin \|\| isAppOwner \|\| access\?\.features\?\.googleCalendar\)/, 'Google Calendar gate uses plan feature');
assertIncludes(files.settings, settings, "missing: ['DISABLED_BY_PLAN']", 'Settings records disabled-by-plan status locally');
assertRegex(files.settings, settings, /const loadGoogleCalendarStatus = async \(\) => \{[\s\S]*if \(!canUseGoogleCalendarByPlan\) \{[\s\S]*DISABLED_BY_PLAN[\s\S]*return;[\s\S]*setCheckingGoogleCalendar\(true\)/, 'Settings skips Google Calendar status calls outside plan');
assertRegex(files.settings, settings, /useEffect\(\(\) => \{[\s\S]*if \(!canUseGoogleCalendarByPlan\)[\s\S]*loadGoogleCalendarStatus\(\)[\s\S]*\}, \[workspace\?\.id, activeUserId, activeUserEmail, canUseGoogleCalendarByPlan\]\)/, 'Google Calendar status effect depends on plan gate');
assertRegex(files.settings, settings, /<section hidden=\{!canUseGoogleCalendarByPlan\} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-stage12="outbound-backfill"/, 'Outbound Google Calendar section is hidden by plan');
assertRegex(files.settings, settings, /<section hidden=\{!canUseGoogleCalendarByPlan\} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-reminder-ui="stage06"/, 'Reminder Google Calendar section is hidden by plan');
assertRegex(files.settings, settings, /<section hidden=\{!canUseGoogleCalendarByPlan\} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-sync-v1-stage03="true"/, 'Main Google Calendar connect section is hidden by plan');
assertRegex(files.settings, settings, /handleConnectGoogleCalendar[\s\S]*if \(!canUseGoogleCalendarByPlan\)/, 'Connect handler still guards plan');
assertRegex(files.settings, settings, /handleSyncGoogleCalendarOutbound[\s\S]*if \(!canUseGoogleCalendarByPlan\)/, 'Outbound sync handler still guards plan');

section('Settings digest visibility contract');
assertRegex(files.settings, settings, /canUseDigestByPlan\s*=\s*Boolean\(isAdmin \|\| isAppOwner \|\| access\?\.features\?\.digest\)/, 'Digest gate uses plan feature');
assertRegex(files.settings, settings, /digestUiVisibleByPlan\s*=\s*DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan/, 'Digest UI combines global flag and plan feature');

section('Billing visibility surface');
assertIncludes(files.billing, billing, 'data-plan-visibility-stage32e="billing-plan-comparison"', 'Billing plan comparison marker exists');
assertIncludes(files.billing, billing, 'data-plan-visibility-stage32e="billing-feature-matrix"', 'Billing feature matrix marker exists');
assertIncludes(files.billing, billing, 'Google Calendar sync \u2014 w przygotowaniu / wymaga konfiguracji OAuth', 'Billing keeps Google truth copy');
assertIncludes(files.billing, billing, 'Pe\u0142ny asystent AI Beta, po konfiguracji providera', 'Billing keeps AI truth copy');
assertIncludes(files.billing, billing, 'Poranny digest', 'Billing lists digest as configured feature');
assertIncludes(files.billing, billing, 'Funkcji nieudost\u0119pnionych backendowo nie udajemy.', 'Billing keeps truthful feature matrix note');

section('Documentation');
for (const marker of [
  'FAZA 3 - Etap 3.2E - Settings/Digest/Billing plan visibility smoke',
  'v4 duplicate-declaration cleanup',
  'Google Calendar w Settings jest widoczny tylko dla plan\u00F3w z googleCalendar',
  'Digest jest funkcj\u0105 od Basic',
  'Billing mo\u017Ce pokazywa\u0107 wszystkie plany',
  'FAZA 3 - Etap 3.2F - backend entity limits smoke',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}

for (const marker of [
  'SETTINGS / DIGEST / BILLING VISIBILITY SMOKE',
  'Guard v4 correction',
  'canUseGoogleCalendarByPlan',
  'canUseDigestByPlan',
  'digestUiVisibleByPlan',
  'data-plan-visibility-stage32e="google-calendar"',
  'data-plan-visibility-stage32e="billing-feature-matrix"',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
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
if (scripts['check:faza3-etap32e-settings-digest-billing-visibility-smoke'] === 'node scripts/check-faza3-etap32e-settings-digest-billing-visibility-smoke.cjs') {
  pass(files.pkg, 'check:faza3-etap32e-settings-digest-billing-visibility-smoke is wired');
} else {
  fail(files.pkg, 'missing check:faza3-etap32e-settings-digest-billing-visibility-smoke');
}
if (scripts['test:faza3-etap32e-settings-digest-billing-visibility-smoke'] === 'node --test tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs') {
  pass(files.pkg, 'test:faza3-etap32e-settings-digest-billing-visibility-smoke is wired');
} else {
  fail(files.pkg, 'missing test:faza3-etap32e-settings-digest-billing-visibility-smoke');
}
assertIncludes(files.quiet, quiet, 'tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs', 'Quiet release gate includes Faza3 Etap3.2E test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.2E Settings/Digest/Billing visibility smoke guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 3 - Etap 3.2E Settings/Digest/Billing visibility smoke guard');
