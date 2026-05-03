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

function walk(dir, out = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(rel, out);
    } else if (/\.(tsx?|jsx?|mdx?)$/.test(entry.name)) {
      out.push(rel);
    }
  }
  return out;
}

function fail(message) {
  problems.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function containsAll(content, words) {
  const hay = content.toLowerCase();
  return words.every((word) => hay.includes(String(word).toLowerCase()));
}

function hasNear(content, firstPattern, secondPattern, maxDistance = 220) {
  const text = String(content || '');
  const first = text.search(firstPattern);
  if (first < 0) return false;
  const window = text.slice(first, first + maxDistance);
  return secondPattern.test(window);
}

const requiredTruthFiles = [
  'src/lib/product-truth.ts',
  'scripts/check-faza1-etap11-ui-copy-legal-truth.cjs',
  'docs/release/FAZA1_ETAP11_PRODUCT_TRUTH_STATUS_MATRIX_2026-05-03.md',
  'docs/release/FAZA1_ETAP11_UI_COPY_LEGAL_TRUTH_2026-05-03.md',
];

for (const file of requiredTruthFiles) {
  assert(exists(file), 'Etap 1.2 depends on Etap 1.1, missing: ' + file);
}

const truth = exists('src/lib/product-truth.ts') ? read('src/lib/product-truth.ts') : '';
for (const key of [
  'stripe_billing',
  'daily_digest_email',
  'google_calendar',
  'ai_assistant',
  'pwa_install',
  'soc_security_claims',
]) {
  assert(truth.includes("key: '" + key + "'"), 'product truth registry missing key: ' + key);
}

const uiFiles = [
  ...walk('src/pages'),
  ...walk('src/components'),
  ...walk('src/lib'),
].filter((file) => !file.includes('product-truth'));

const bannedClaims = [
  { label: 'SOC 2 certified', pattern: /SOC\s*2\s*certified/i },
  { label: 'SOC2 certified', pattern: /SOC2\s*certified/i },
  { label: 'Google Calendar connected', pattern: /Google Calendar\s+(connected|połączony|podłączony|aktywny|działa)/i },
  { label: 'Google Calendar sync active', pattern: /Google Calendar sync\s*(aktywny|active|działa|gotowy)/i },
  { label: 'AI final auto-save', pattern: /AI\s+(automatycznie\s+)?(zapisuje|zapisało|saved)\s+(rekord|leada|zadanie|event|wydarzenie)/i },
  { label: 'AI saved without approval', pattern: /(AI saved|zapisane przez AI bez potwierdzenia)/i },
  { label: 'Native App Store app', pattern: /natywna aplikacja (z|w) App Store/i },
  { label: 'Native Google Play app', pattern: /natywna aplikacja (z|w) Google Play/i },
  { label: 'Digest sent without config', pattern: /digest (jest )?(wysyłany|wyslany|wysłany|działa) bez konfiguracji/i },
  { label: 'Cancel anytime as guarantee', pattern: /cancel anytime|anuluj kiedy chcesz/i },
];

for (const file of uiFiles) {
  const content = read(file);
  for (const claim of bannedClaims) {
    if (claim.pattern.test(content)) {
      fail(file + ': banned product truth claim found: ' + claim.label);
    }
  }
}

const billing = exists('src/pages/Billing.tsx') ? read('src/pages/Billing.tsx') : '';
assert(/Google Calendar/i.test(billing), 'Billing must mention Google Calendar');
assert(hasNear(billing, /Google Calendar/i, /(w przygotowaniu|wymaga konfiguracji|OAuth)/i, 260), 'Billing must describe Google Calendar as coming soon/config dependent');
assert(/Pełny asystent AI|asystent AI/i.test(billing), 'Billing must mention AI assistant');
assert(/Pełny asystent AI\s*Beta/i.test(billing) || (/asystent AI/i.test(billing) && /Beta/i.test(billing)), 'Billing must describe AI as Beta');
assert(/konfiguracji providera|konfiguracji AI|provider/i.test(billing), 'Billing must describe AI as config/provider dependent');
assert(/szkic/i.test(billing) && /(zatwierdzenia|potwierdzenia)/i.test(billing), 'Billing must keep manual approval copy for AI drafts');
assert(/digest/i.test(billing) && /konfiguracji mail providera/i.test(billing), 'Billing must mark digest as config dependent');
assert(!billing.includes("'Google Calendar sync',"), 'Billing has old unconditional Google Calendar sync copy');
assert(!billing.includes('Pełny asystent AI w całej aplikacji'), 'Billing has old full AI claim');

const settings = exists('src/pages/Settings.tsx') ? read('src/pages/Settings.tsx') : '';
assert(/Digest e-mail/i.test(settings) && /wymaga konfiguracji mail providera/i.test(settings), 'Settings must describe digest as config dependent');
assert(/To nadal aplikacja webowa/i.test(settings), 'Settings must describe PWA as web app, not native app');
for (const bad of ['Sprawdz konfiguracje', 'Wyslij test teraz', 'dziala raz dziennie', 'wysylki']) {
  assert(!settings.includes(bad), 'Settings contains stale ASCII/untruth marker: ' + bad);
}

const adminAi = exists('src/pages/AdminAiSettings.tsx') ? read('src/pages/AdminAiSettings.tsx') : '';
assert(/szkic/i.test(adminAi) && /(potwierdzenia|potwierdzeniu|zatwierdzenia)/i.test(adminAi), 'Admin AI must keep draft-only truth copy');

if (problems.length) {
  console.error('FAZA 1 - Etap 1.2 - Guard UI Truth failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS check-ui-truth-claims');
