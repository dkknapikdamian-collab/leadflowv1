const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const fail = (message) => {
  console.error('STAGE226_LOST_LEAD_RESCUE_GUARD_FAIL:', message);
  process.exit(1);
};

const requiredFiles = [
  'src/lib/owner-control/lost-lead-rescue.ts',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/TodayStable.tsx',
  'scripts/check-stage226-lost-lead-rescue.cjs',
  'tests/stage226-lost-lead-rescue.test.cjs',
];

for (const file of requiredFiles) {
  if (!exists(file)) fail('missing required file: ' + file);
}

const bannedCodePoints = [0x00c4, 0x0139, 0x0102, 0x00c2, 0xfffd, 0x0081];
for (const file of requiredFiles) {
  const content = read(file);
  const bad = bannedCodePoints.filter((codePoint) => content.includes(String.fromCharCode(codePoint)));
  if (bad.length) {
    fail('mojibake codepoints in ' + file + ': ' + bad.map((codePoint) => 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0')).join(', '));
  }
}

const helper = read('src/lib/owner-control/lost-lead-rescue.ts');
const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const today = read('src/pages/TodayStable.tsx');
const packageJson = JSON.parse(read('package.json'));

[
  'buildContactCadenceGrid',
  'buildRecordOperationalBadges',
  'LostLeadRescueReasonKey',
  'LostLeadRescueSeverity',
  'LostLeadRescueRow',
  'LostLeadRescueSummary',
  'buildLostLeadRescue',
  'silent_14_plus',
  'silent_7_plus_no_next_move',
  'high_value_no_next_move',
  'high_value_silent',
  'missing_contact_date',
  'missing_next_move',
  'waiting_too_long',
  'Brak daty kontaktu',
  'Brak następnej akcji',
  'Wysoka wartość',
].forEach((token) => {
  if (!helper.includes(token)) fail('helper missing token: ' + token);
});

if (/updatedAt|updated_at|modifiedAt|modified_at|createdAt|created_at/.test(helper)) {
  fail('lost-lead-rescue.ts must not read generic timestamp fields as rescue silence source');
}

if (!helper.includes('records: leads') || !helper.includes('entityType: \'lead\'')) {
  fail('helper must call Contact Cadence Grid for lead records');
}

[
  'buildLostLeadRescue',
  "'rescue'",
  'lostLeadRescueSummary',
  'data-stage226-lost-lead-rescue-filter="true"',
  'data-stage226-lost-lead-rescue-list="true"',
  'Do odzyskania',
  'Ustaw zadanie',
  'Odłóż',
  'Oznacz jako martwy',
  'setCadenceFilter(\'all\')',
].forEach((token) => {
  if (!leads.includes(token)) fail('Leads.tsx missing token: ' + token);
});

const relatedIndex = leads.indexOf('const relatedRecordsByLeadId = useMemo');
const rescueIndex = leads.indexOf('const lostLeadRescueSummary = useMemo');
const filteredIndex = leads.indexOf('const filteredLeads = useMemo');
if (relatedIndex < 0 || rescueIndex < 0 || filteredIndex < 0) {
  fail('Leads.tsx missing Stage226 memo chain');
}
if (!(relatedIndex < rescueIndex && rescueIndex < filteredIndex)) {
  fail('Leads.tsx has TDZ risk: lostLeadRescueSummary must be declared before filteredLeads');
}

if (!leads.includes("quickFilter === 'rescue'")) {
  fail('Leads.tsx does not filter rescue view through quickFilter');
}
if (!leads.includes('new Set(lostLeadRescueSummary.rows.map((row) => row.leadId))')) {
  fail('Leads.tsx missing rescue id set based on Lost Lead Rescue rows');
}
if (!leads.includes("quickFilter === 'rescue' || !activeCadenceIds")) {
  fail('Rescue view must not fight cadence filter');
}

if (clients.includes('klientow')) {
  fail('Clients.tsx still contains klientow without Polish character');
}
if (!clients.includes('Filtruje klientów po dacie ostatniego kontaktu')) {
  fail('Clients.tsx missing corrected klientow copy');
}

if (today.includes('Lost Lead Rescue') || today.includes('data-stage226-lost-lead-rescue-list="today"')) {
  fail('TodayStable.tsx received a big Lost Lead Rescue panel; Stage226 keeps Today light');
}

if (packageJson.scripts['check:stage226-lost-lead-rescue'] !== 'node scripts/check-stage226-lost-lead-rescue.cjs') {
  fail('package.json missing check:stage226-lost-lead-rescue script');
}
if (packageJson.scripts['test:stage226-lost-lead-rescue'] !== 'node --test tests/stage226-lost-lead-rescue.test.cjs') {
  fail('package.json missing test:stage226-lost-lead-rescue script');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE226_LOST_LEAD_RESCUE',
  checkedFiles: requiredFiles.length,
  guard: 'check:stage226-lost-lead-rescue',
}, null, 2));
