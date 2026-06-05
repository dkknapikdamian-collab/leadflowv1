const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const fail = (message) => {
  console.error('STAGE225_CONTACT_CADENCE_GRID_GUARD_FAIL:', message);
  process.exit(1);
};

const helperPath = 'src/lib/owner-control/contact-cadence-grid.ts';
if (!exists(helperPath)) fail('missing contact-cadence-grid.ts');

const files = [
  helperPath,
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'scripts/check-stage225-contact-cadence-grid.cjs',
  'tests/stage225-contact-cadence-grid.test.cjs',
];

const bannedCodePoints = [0x00c4, 0x0139, 0x0102, 0x00c2, 0xfffd, 0x0081];
for (const file of files) {
  if (!exists(file)) fail('missing required file: ' + file);
  const content = read(file);
  const bad = bannedCodePoints.filter((codePoint) => content.includes(String.fromCharCode(codePoint)));
  if (bad.length) {
    fail('mojibake codepoints in ' + file + ': ' + bad.map((codePoint) => 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0')).join(', '));
  }
}

const helper = read(helperPath);
const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const today = exists('src/pages/TodayStable.tsx') ? read('src/pages/TodayStable.tsx') : '';

[
  'buildActivityTruth',
  'SALES_SILENCE_THRESHOLDS_DAYS',
  'CONTACT_CADENCE_BUCKETS',
  'classifyContactCadenceBucket',
  'rescueCandidate',
  'rescueReason',
  'unknown',
  'silent_14_plus',
  '14+ dni ciszy',
  'Kontakt dziś',
  'Dziś',
  '1 dzień ciszy',
  'Minął 1 dzień',
  'Minęły 2 dni',
  'Minęło co najmniej 14 dni',
  'następnego ruchu',
  'Wysoka wartość',
].forEach((token) => {
  if (!helper.includes(token)) fail('helper missing ' + token);
});

[
  'Kontakt dzis',
  'Dzis',
  '1 dzien',
  'Minal',
  'Minely',
  'Minelo',
  'nastepnego',
  'wartosc',
].forEach((token) => {
  if (helper.includes(token)) fail('helper still has ASCII placeholder token: ' + token);
});

if (helper.includes('replace(/s+/g')) {
  fail('helper has broken whitespace regex replace(/s+/g instead of replace(/\\s+/g');
}
if (!helper.includes('replace(/\\s+/g')) {
  fail('helper missing whitespace normalization replace(/\\s+/g');
}
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
  if (!leads.includes(token)) fail('Leads.tsx missing ' + token);
});

const relatedIndex = leads.indexOf('const relatedRecordsByLeadId = useMemo');
const cadenceIndex = leads.indexOf('const contactCadenceGrid = useMemo');
const filteredIndex = leads.indexOf('const filteredLeads = useMemo');
if (relatedIndex < 0 || cadenceIndex < 0 || filteredIndex < 0) {
  fail('Leads.tsx missing Stage225 memo declarations');
}
if (!(relatedIndex < cadenceIndex && cadenceIndex < filteredIndex)) {
  fail('Leads.tsx has TDZ risk: relatedRecordsByLeadId and contactCadenceGrid must be declared before filteredLeads');
}
const buildCadenceCall = leads.slice(cadenceIndex, filteredIndex);
if (/^\s*relatedRecordsById,\s*$/m.test(buildCadenceCall)) {
  fail('Leads.tsx passes undefined/shorthand relatedRecordsById instead of relatedRecordsByLeadId');
}
if (!buildCadenceCall.includes('relatedRecordsById: relatedRecordsByLeadId')) {
  fail('Leads.tsx missing explicit relatedRecordsById: relatedRecordsByLeadId mapping');
}

[
  'buildContactCadenceGrid',
  'CONTACT_CADENCE_BUCKETS',
  'ContactCadenceBucketKey',
  'data-stage225-contact-cadence-grid="clients"',
  'cadenceFilter',
  'setCadenceFilter',
  '14+ dni ciszy',
].forEach((token) => {
  if (!clients.includes(token)) fail('Clients.tsx missing ' + token);
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
  stage: 'STAGE225R10_GUARD_SYNTAX_FINAL',
  checkedFiles: files.length,
  guard: 'check:stage225-contact-cadence-grid',
}, null, 2));
