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

const workItems = read('api/work-items.ts');
assert(workItems.includes("type GoogleReminderMethod = 'default' | 'popup' | 'email' | 'popup_email';"), 'api/work-items.ts missing GoogleReminderMethod union');
assert(workItems.includes('function googleReminderMethodFrom(row: any, body: any): GoogleReminderMethod | null'), 'googleReminderMethodFrom must return GoogleReminderMethod | null');
assert(workItems.includes("if (value === 'popup_email' || value === 'popup+email' || value === 'both') return 'popup_email';"), 'aliases must normalize to popup_email');
assert(!workItems.includes("return value;\n  return '';"), 'googleReminderMethodFrom must not return raw string or empty string');
assert(workItems.includes('googleReminderMethod: googleReminderMethodFrom(row, body),'), 'event payload must pass typed googleReminderMethod result');

const stage06 = read('scripts/check-google-calendar-stage06-reminder-method-ui.cjs');
assert(stage06.includes("'googleReminderMethod: googleReminderMethodFrom(row, body)',") || stage06.includes('"googleReminderMethod: googleReminderMethodFrom(row, body)",'), 'Stage 06 guard must accept typed googleReminderMethod contract');
assert(!stage06.includes('googleReminderMethod: googleReminderMethodFrom(row, body) || null'), 'Stage 06 guard must not require old fallback marker');

const sync = read('src/server/google-calendar-sync.ts');
assert(sync.includes("type GoogleReminderMethod = 'default' | 'popup' | 'email' | 'popup_email';"), 'google-calendar-sync.ts must keep GoogleReminderMethod union');
assert(sync.includes('googleReminderMethod?: GoogleReminderMethod | null'), 'CloseFlowCalendarEvent must keep typed googleReminderMethod');

const prodDoc = 'docs/architecture/PRODUCTION_FIRST_INTEGRATION_RULE_2026-05-03.md';
assert(exists(prodDoc), 'missing production-first architecture doc');
const prod = exists(prodDoc) ? read(prodDoc) : '';
for (const marker of [
  'CloseFlow pracuje production-first',
  'Vercel ENV ustawiamy przynajmniej dla `Production`',
  'Redirect URI ustawiamy na produkcyjny publiczny adres aplikacji',
  'Jeżeli dostawca technicznie blokuje publikację produkcyjną do czasu weryfikacji',
  'https://closeflowapp.vercel.app/api/google-calendar?route=callback',
  'Nie używać `/api/system` jako redirect URI',
]) {
  assert(prod.includes(marker), 'production-first doc missing marker: ' + marker);
}

assert(!exists('api/google-calendar.ts'), 'must not recreate standalone api/google-calendar.ts');

const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage07b-ts-contract-production-first']), 'package.json missing Stage 07b guard');

if (problems.length) {
  console.error('Google Calendar Stage 07b TS contract + production-first guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Stage 07b TS contract + production-first guard');
