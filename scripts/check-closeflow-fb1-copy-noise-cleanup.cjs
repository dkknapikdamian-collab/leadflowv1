const fs = require('fs');

const failures = [];
const passes = [];

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return exists(file) ? fs.readFileSync(file, 'utf8') : '';
}

function pass(message) {
  passes.push(message);
  console.log(`PASS ${message}`);
}

function fail(message) {
  failures.push(message);
  console.log(`FAIL ${message}`);
}

function assertFile(file) {
  if (exists(file)) pass(`${file}: exists`);
  else fail(`${file}: missing`);
}

function assertIncludes(file, needle, label = needle) {
  const text = read(file);
  if (text.includes(needle)) pass(`${file}: ${label}`);
  else fail(`${file}: missing ${label} [needle=${needle}]`);
}

function assertNotIncludes(file, needle, label = needle) {
  const text = read(file);
  if (!text.includes(needle)) pass(`${file}: ${label} absent`);
  else fail(`${file}: forbidden ${label} [needle=${needle}]`);
}

function extractSection(text, classNeedle) {
  const idx = text.indexOf(classNeedle);
  if (idx < 0) return '';
  const start = text.lastIndexOf('<section', idx);
  if (start < 0) return '';
  const end = text.indexOf('</section>', idx);
  if (end < 0) return text.slice(start);
  return text.slice(start, end + '</section>'.length);
}

const requiredFiles = [
  'src/pages/Settings.tsx',
  'src/pages/SupportCenter.tsx',
  'src/pages/Billing.tsx',
  'src/pages/Calendar.tsx',
  'docs/feedback/CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026-05-09.md',
  'scripts/check-closeflow-fb1-copy-noise-cleanup.cjs',
  'package.json',
];

for (const file of requiredFiles) assertFile(file);

assertNotIncludes('src/pages/Settings.tsx', 'Konto, workspace, powiadomienia i preferencje aplikacji.');
assertIncludes('src/pages/Settings.tsx', 'useWorkspace', 'keeps workspace hook');
assertIncludes('src/pages/Settings.tsx', 'access', 'keeps access state references');
assertIncludes('src/pages/Settings.tsx', 'CLOSEFLOW_FB1_SETTINGS_COPY_NOISE_CLEANUP', 'FB-1 settings marker');

assertNotIncludes('src/pages/SupportCenter.tsx', 'Zg\u0142oszenia, odpowiedzi i kontakt w jednym miejscu.');
assertNotIncludes('src/pages/SupportCenter.tsx', 'Wszystkie Twoje zg\u0142oszenia widoczne w tym workspace.');
assertNotIncludes('src/pages/SupportCenter.tsx', 'Tematy, kt\u00F3re wymagaj\u0105 dalszej obs\u0142ugi.');
assertNotIncludes('src/pages/SupportCenter.tsx', 'Kr\u00F3tkie odpowiedzi bez \u015Bciany tekstu.');
assertNotIncludes('src/pages/SupportCenter.tsx', 'Co sprawdzi\u0107 najpierw');
assertNotIncludes('src/pages/SupportCenter.tsx', 'Najcz\u0119stsze pytania');
assertIncludes('src/pages/SupportCenter.tsx', 'Zapisz zg\u0142oszenie', 'keeps real ticket form');
assertIncludes('src/pages/SupportCenter.tsx', 'Status zg\u0142osze\u0144', 'keeps ticket status');
assertIncludes('src/pages/SupportCenter.tsx', 'fetchSupportRequestsFromSupabase', 'keeps support list data');
assertIncludes('src/pages/SupportCenter.tsx', 'CLOSEFLOW_FB1_SUPPORT_COPY_NOISE_CLEANUP', 'FB-1 support marker');

assertNotIncludes('src/pages/Billing.tsx', 'Plan, dost\u0119p i status subskrypcji w jednym miejscu.');
assertNotIncludes('src/pages/Billing.tsx', 'Masz aktywny dost\u0119p do pracy w aplikacji.');
assertIncludes('src/pages/Billing.tsx', 'getAccessCopy', 'keeps billing truth helper');
assertIncludes('src/pages/Billing.tsx', 'accessCopy', 'keeps access copy logic');
assertIncludes('src/pages/Billing.tsx', 'createBillingCheckoutSessionInSupabase', 'keeps Stripe billing path');
assertIncludes('src/pages/Billing.tsx', 'Podsumowanie rozlicze\u0144', 'keeps billing summary section');
assertIncludes('src/pages/Billing.tsx', 'Nast\u0119pna p\u0142atno\u015B\u0107 / status p\u0142atno\u015Bci', 'simplified payment status card');

const billingMetrics = extractSection(read('src/pages/Billing.tsx'), 'billing-metrics-grid');
if (billingMetrics) {
  const cardCount = (billingMetrics.match(/billing-metric-card/g) || []).length;
  if (cardCount <= 2) pass('Billing summary has max 2 metric cards');
  else fail(`Billing summary still has too many metric cards: ${cardCount}`);

  for (const forbidden of ['<small>Dost\u0119p</small>', '<small>Trial</small>', '<small>Limity</small>', '<small>Blokady</small>']) {
    if (!billingMetrics.includes(forbidden)) pass(`Billing summary removed ${forbidden}`);
    else fail(`Billing summary still contains ${forbidden}`);
  }
} else {
  fail('Billing summary section missing');
}

assertNotIncludes('src/pages/Calendar.tsx', 'O\u015B czasu pokazuje ostatnie dzia\u0142ania w czytelnej kolejno\u015Bci.');
assertIncludes('src/pages/Calendar.tsx', 'fetchCalendarBundleFromSupabase', 'keeps calendar data loading');
assertIncludes('src/pages/Calendar.tsx', 'insertEventToSupabase', 'keeps calendar event creation');
assertIncludes('src/pages/Calendar.tsx', 'CLOSEFLOW_FB1_CALENDAR_COPY_NOISE_CLEANUP', 'FB-1 calendar marker');

if (exists('src/pages/Help.tsx')) {
  assertNotIncludes('src/pages/Help.tsx', 'Zg\u0142oszenia, odpowiedzi i kontakt w jednym miejscu.');
  assertNotIncludes('src/pages/Help.tsx', 'Najcz\u0119stsze pytania');
}

assertIncludes('docs/feedback/CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026-05-09.md', 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09', 'doc marker');
assertIncludes('docs/feedback/CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026-05-09.md', 'Nie zmienia\u0107 access gate', 'doc access safety');
assertIncludes('docs/feedback/CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026-05-09.md', 'Nie zmienia\u0107 billing truth', 'doc billing safety');
assertIncludes('docs/feedback/CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026-05-09.md', 'Nie zmienia\u0107 Google Calendar sync', 'doc calendar safety');

const pkg = JSON.parse(read('package.json').replace(/^\uFEFF/, ''));
if (pkg.scripts && pkg.scripts['check:closeflow-fb1-copy-noise-cleanup']) pass('package.json has FB-1 check script');
else fail('package.json missing FB-1 check script');

console.log('');
console.log(`Summary: ${passes.length} pass, ${failures.length} fail.`);
if (failures.length) {
  console.log('FAIL CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_OK');
