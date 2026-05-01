const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredDocs = [
  'docs/SUPABASE_FIRST_ARCHITECTURE.md',
  'docs/DATA_SOURCE_MAP.md',
];

const requiredScreens = [
  'Today',
  'Leads',
  'LeadDetail',
  'Tasks',
  'Calendar',
  'Cases',
  'CaseDetail',
  'Clients',
  'ClientDetail',
  'Templates',
  'AI Drafts',
  'Billing',
  'ClientPortal',
  'Activity',
  'Settings',
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error('ERROR:', message);
    process.exit(1);
  }
}

for (const doc of requiredDocs) {
  assert(fs.existsSync(path.join(root, doc)), doc + ' is missing');
}

const architecture = read('docs/SUPABASE_FIRST_ARCHITECTURE.md');
const map = read('docs/DATA_SOURCE_MAP.md');
const readme = fs.existsSync(path.join(root, 'README.md')) ? read('README.md') : '';
const deployReadmeA = fs.existsSync(path.join(root, 'README-WDROZENIE.md')) ? read('README-WDROZENIE.md') : '';
const deployReadmeB = fs.existsSync(path.join(root, 'README_WDROZENIE.md')) ? read('README_WDROZENIE.md') : '';

assert(architecture.includes('Supabase jest docelowym źródłem prawdy'), 'architecture doc must state Supabase as target source of truth');
assert(architecture.includes('Firebase / Firestore jest warstwą legacy'), 'architecture doc must mark Firebase / Firestore as legacy');
assert(architecture.includes('Nie wolno tworzyć dwóch równoległych źródeł prawdy'), 'architecture doc must forbid two sources of truth');
assert(architecture.includes('AI nie może zapisywać finalnych danych bez potwierdzenia użytkownika'), 'architecture doc must preserve AI confirmation rule');
assert(architecture.includes('x-user-id') && architecture.includes('x-user-email') && architecture.includes('x-workspace-id'), 'architecture doc must forbid trusting frontend identity headers');

for (const screen of requiredScreens) {
  assert(map.includes(screen), 'DATA_SOURCE_MAP.md must include ' + screen);
}

assert(map.includes('Docelowym źródłem prawdy jest Supabase'), 'data source map must state Supabase target');
assert(map.includes('legacy do migracji'), 'data source map must mark legacy paths');
assert(map.includes('Supabase + Stripe'), 'data source map must include Billing as Supabase + Stripe');
assert(map.includes('Supabase + Supabase Storage'), 'data source map must include ClientPortal as Supabase + Supabase Storage');

const combinedDocs = [readme, deployReadmeA, deployReadmeB].join('\n');
assert(combinedDocs.includes('Supabase-first'), 'README/deployment docs must mention Supabase-first');
assert(!combinedDocs.includes('# LeadFlow — wdrożenie (Firebase)'), 'deployment README must not present Firebase as the deployment architecture title');

console.log('OK: Supabase-first architecture docs guard passed.');
