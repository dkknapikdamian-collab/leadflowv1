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

function statusForKey(content, key) {
  const keyIndex = content.indexOf("key: '" + key + "'");
  if (keyIndex < 0) return '';
  const slice = content.slice(keyIndex, keyIndex + 800);
  const match = slice.match(/status:\s*'([^']+)'/);
  return match ? match[1] : '';
}

const truthPath = 'src/lib/product-truth.ts';
assert(exists(truthPath), 'missing src/lib/product-truth.ts');
const truth = exists(truthPath) ? read(truthPath) : '';

const requiredTruth = [
  { key: 'stripe_billing', status: 'requires_config' },
  { key: 'daily_digest_email', status: 'requires_config' },
  { key: 'google_calendar', status: 'coming_soon' },
  { key: 'ai_assistant', status: 'beta' },
  { key: 'ai_admin_settings', status: 'internal_only' },
  { key: 'pwa_install', status: 'active' },
];

for (const item of requiredTruth) {
  assert(truth.includes("key: '" + item.key + "'"), 'product truth missing key: ' + item.key);
  assert(statusForKey(truth, item.key) === item.status, 'product truth key ' + item.key + ' must have status ' + item.status);
}

const billing = exists('src/pages/Billing.tsx') ? read('src/pages/Billing.tsx') : '';
const settings = exists('src/pages/Settings.tsx') ? read('src/pages/Settings.tsx') : '';
const adminAi = exists('src/pages/AdminAiSettings.tsx') ? read('src/pages/AdminAiSettings.tsx') : '';

assert(/Stripe wymaga konfiguracji/i.test(billing), 'Billing must expose Stripe requires config copy');
assert(/Google Calendar/i.test(billing) && /(w przygotowaniu|wymaga konfiguracji|OAuth)/i.test(billing), 'Billing must mark Google Calendar as coming soon/config dependent');
assert(/digest/i.test(billing) && /konfiguracji mail providera/i.test(billing), 'Billing must mark digest as config dependent');
assert(/PeĹ‚ny asystent AI|asystent AI/i.test(billing) && /Beta/i.test(billing) && /(konfiguracji|provider|szkic)/i.test(billing), 'Billing must mark AI as beta/config dependent');

assert(/Digest e-mail/i.test(settings) && /wymaga konfiguracji mail providera/i.test(settings), 'Settings must mark digest as mail provider dependent');
assert(/To nadal aplikacja webowa/i.test(settings), 'Settings must mark PWA as web app');

assert(/szkic/i.test(adminAi) && /(potwierdzenia|potwierdzeniu|zatwierdzenia)/i.test(adminAi), 'Admin AI must say AI does not final-save without confirmation');

if (problems.length) {
  console.error('Integration status copy guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS check-integration-status-copy');
