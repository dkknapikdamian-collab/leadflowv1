const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) problems.push(message);
}

function assertIncludes(file, needle) {
  assert(read(file).includes(needle), file + ' missing: ' + needle);
}

const pkg = JSON.parse(read('package.json'));
const scripts = pkg.scripts || {};

assert(Boolean(scripts['check:faza1-etap11-ui-copy-legal-truth']), 'package.json missing check:faza1-etap11-ui-copy-legal-truth');
assert(exists('src/lib/product-truth.ts'), 'missing src/lib/product-truth.ts');
assert(exists('docs/release/FAZA1_ETAP11_PRODUCT_TRUTH_STATUS_MATRIX_2026-05-03.md'), 'missing product truth status matrix');
assert(exists('docs/release/FAZA1_ETAP11_UI_COPY_LEGAL_TRUTH_2026-05-03.md'), 'missing Etap 1.1 release doc');

const truth = read('src/lib/product-truth.ts');
for (const status of ['active', 'requires_config', 'beta', 'coming_soon', 'disabled_by_plan', 'internal_only']) {
  assert(truth.includes(status), 'product truth registry missing status: ' + status);
}
assert(truth.includes('FAZA1_ETAP11_PRODUCT_TRUTH_REGISTRY_2026_05_03'), 'product truth registry missing marker');

assertIncludes('docs/release/FAZA1_ETAP11_PRODUCT_TRUTH_STATUS_MATRIX_2026-05-03.md', 'FAZA 1 \u2014 Etap 1.1 \u2014 Prawda produktu w UI/copy/legal');
assertIncludes('docs/release/FAZA1_ETAP11_PRODUCT_TRUTH_STATUS_MATRIX_2026-05-03.md', 'Google Calendar connected / sync active');
assertIncludes('docs/release/FAZA1_ETAP11_PRODUCT_TRUTH_STATUS_MATRIX_2026-05-03.md', 'SOC 2 certified / SOC2 certified');

const billing = read('src/pages/Billing.tsx');
assert(billing.includes('Google Calendar sync \u2014 w przygotowaniu / wymaga konfiguracji OAuth'), 'Billing must mark Google Calendar sync as coming soon/config required');
assert(billing.includes('Pe\u0142ny asystent AI Beta, po konfiguracji providera'), 'Billing must mark full AI as beta/config required');
assert(billing.includes('szkice do r\u0119cznego zatwierdzenia'), 'Billing must say AI drafts require manual approval');
assert(billing.toLowerCase().includes('digest po konfiguracji mail providera'), 'Billing must mark digest as config dependent');
assert(!billing.includes("'Google Calendar sync',"), 'Billing still has old unconditional Google Calendar sync feature');
assert(!billing.includes('Pe\u0142ny asystent AI w ca\u0142ej aplikacji'), 'Billing still has old full AI claim');

const settings = read('src/pages/Settings.tsx');
assert(settings.includes('Digest e-mail jest w przygotowaniu i wymaga konfiguracji mail providera'), 'Settings must show digest requires mail provider config');
for (const bad of ['Sprawdz konfiguracje', 'Wyslij test teraz', 'dziala raz dziennie', 'wysylki']) {
  assert(!settings.includes(bad), 'Settings contains untruth/ASCII guard leftover: ' + bad);
}

const adminAi = read('src/pages/AdminAiSettings.tsx');
assert(adminAi.includes('AI przygotowuje szkic. Zapis nast\u0119puje dopiero po potwierdzeniu przez u\u017Cytkownika.'), 'Admin AI must keep draft-only truth copy');

const scanFiles = [
  'src/pages/Billing.tsx',
  'src/pages/Settings.tsx',
  'src/pages/AdminAiSettings.tsx',
  'src/pages/Login.tsx',
  'src/components/Layout.tsx',
];
const bannedClaims = [
  /SOC\s*2\s*certified/i,
  /SOC2\s*certified/i,
  /Google Calendar connected/i,
  /AI saved/i,
  /AI automatycznie zapisa/i,
  /natywna aplikacja z App Store/i,
  /natywna aplikacja z Google Play/i,
];
for (const file of scanFiles) {
  const content = read(file);
  for (const pattern of bannedClaims) {
    assert(!pattern.test(content), file + ' contains banned product truth claim: ' + pattern);
  }
}

if (problems.length) {
  console.error('FAZA 1 / Etap 1.1 UI copy legal truth failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS FAZA 1 \u2014 Etap 1.1 \u2014 Prawda produktu w UI/copy/legal');
