const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error('STAGE225_CONTACT_CADENCE_GRID_GUARD_FAIL:', message);
  process.exit(1);
};

const helperPath = 'src/lib/owner-control/contact-cadence-grid.ts';
if (!fs.existsSync(path.join(root, helperPath))) fail('missing contact-cadence-grid.ts');

const helper = read(helperPath);
const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const todayPath = fs.existsSync(path.join(root, 'src/pages/TodayStable.tsx')) ? 'src/pages/TodayStable.tsx' : null;
const today = todayPath ? read(todayPath) : '';

[
  'buildActivityTruth',
  'SALES_SILENCE_THRESHOLDS_DAYS',
  'CONTACT_CADENCE_BUCKETS',
  'classifyContactCadenceBucket',
  'rescueCandidate',
  'rescueReason',
  'unknown',
  'silent_14_plus',
].forEach((token) => {
  if (!helper.includes(token)) fail(`helper missing ${token}`);
});

if ((helper.match(/SALES_SILENCE_THRESHOLDS_DAYS\s*=\s*\[/g) || []).length) {
  fail('helper redefines SALES_SILENCE_THRESHOLDS_DAYS instead of importing owner-risk-rules source of truth');
}

[
  'buildContactCadenceGrid',
  'CONTACT_CADENCE_BUCKETS',
  'ContactCadenceBucketKey',
  'data-stage225-contact-cadence-grid="leads"',
  'cadenceFilter',
  'setCadenceFilter',
  '14+ dni ciszy',
].forEach((token) => {
  if (!leads.includes(token)) fail(`Leads.tsx missing ${token}`);
});

[
  'buildContactCadenceGrid',
  'CONTACT_CADENCE_BUCKETS',
  'ContactCadenceBucketKey',
  'data-stage225-contact-cadence-grid="clients"',
  'cadenceFilter',
  'setCadenceFilter',
  '14+ dni ciszy',
].forEach((token) => {
  if (!clients.includes(token)) fail(`Clients.tsx missing ${token}`);
});

if (leads.includes('new Date(lead.updatedAt') || clients.includes('new Date(client.updatedAt')) {
  fail('UI appears to calculate cadence from updatedAt');
}

if (today.includes('Kontrola kontaktu') || today.includes('data-stage225-contact-cadence-grid="today"')) {
  fail('Today received a large contact cadence section; Stage225 allows only light links later');
}

const packageJson = JSON.parse(read('package.json'));
if (packageJson.scripts['check:stage225-contact-cadence-grid'] !== 'node scripts/check-stage225-contact-cadence-grid.cjs') {
  fail('package.json missing check:stage225-contact-cadence-grid script');
}
if (packageJson.scripts['test:stage225-contact-cadence-grid'] !== 'node --test tests/stage225-contact-cadence-grid.test.cjs') {
  fail('package.json missing test:stage225-contact-cadence-grid script');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE225_CONTACT_CADENCE_GRID',
  checkedFiles: 5,
  guard: 'check:stage225-contact-cadence-grid',
}, null, 2));
