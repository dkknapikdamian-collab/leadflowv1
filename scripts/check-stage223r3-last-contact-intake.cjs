const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function fail(message) {
  console.error('STAGE223R3_LAST_CONTACT_INTAKE_FAIL: ' + message);
  process.exit(1);
}

function assertIncludes(source, token, message) {
  if (!source.includes(token)) fail(message || ('missing token: ' + token));
}

function assertFile(file) {
  if (!exists(file)) fail('missing file: ' + file);
}

for (const file of [
  'src/lib/owner-control/last-contact-intake.ts',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'api/leads.ts',
  'api/clients.ts',
  'src/lib/data-contract.ts',
  'scripts/check-stage223r3-last-contact-intake.cjs',
  'tests/stage223r3-last-contact-intake.test.cjs',
  'supabase/sql/001_stage223r3_add_last_contact_at.sql',
]) {
  assertFile(file);
}

const helper = read('src/lib/owner-control/last-contact-intake.ts');
for (const token of [
  'STAGE223R3_LAST_CONTACT_INTAKE',
  'getTodayDateInputValue',
  'dateInputToNoonIso',
  'getLastContactDateInputError',
  'LAST_CONTACT_FUTURE_ERROR',
  'T12:00:00',
]) {
  assertIncludes(helper, token, 'helper missing ' + token);
}

const leads = read('src/pages/Leads.tsx');
for (const token of [
  "from '../lib/owner-control/last-contact-intake'",
  'lastContactAt: getDefaultLastContactDateInput()',
  'lastContactAt: dateInputToNoonIso(newLead.lastContactAt)',
  'getLastContactDateInputError(newLead.lastContactAt)',
  'Ostatni kontakt',
  'Jeśli dodajesz starszy kontakt, wpisz dzień ostatniej rozmowy. To wpływa na oznaczenia ciszy 7/14 dni.',
  'data-stage223r3-lead-last-contact-input="true"',
  'max={getTodayDateInputValue()}',
]) {
  assertIncludes(leads, token, 'Leads.tsx missing ' + token);
}

const clients = read('src/pages/Clients.tsx');
for (const token of [
  "from '../lib/owner-control/last-contact-intake'",
  'lastContactAt: getDefaultLastContactDateInput()',
  'getLastContactDateInputError(newClient.lastContactAt)',
  'Ostatni kontakt',
  'Jeśli klient wraca po czasie, wpisz dzień ostatniego kontaktu. To wpływa na oznaczenia ciszy 7/14 dni.',
  'data-stage223r3-client-last-contact-input="true"',
  'max={getTodayDateInputValue()}',
]) {
  assertIncludes(clients, token, 'Clients.tsx missing ' + token);
}

// STAGE223R3A_V2_CLIENT_PAYLOAD_SOURCE_ACCEPTS_PREPARED_CLIENT
// The client submit handler trims/copies newClient into preparedClient first, then createClientFromPreparedInput()
// converts preparedClient.lastContactAt to ISO. That is the real source path.
const clientLastContactPayloadOk =
  clients.includes('lastContactAt: dateInputToNoonIso(newClient.lastContactAt)') ||
  (
    clients.includes('lastContactAt: newClient.lastContactAt') &&
    clients.includes('lastContactAt: dateInputToNoonIso(preparedClient.lastContactAt)')
  );

if (!clientLastContactPayloadOk) {
  fail('Clients.tsx missing valid client lastContactAt payload conversion path.');
}

const apiLeads = read('api/leads.ts');
for (const token of [
  "'last_contact_at'",
  'LEAD_LIST_SELECT_STAGE223R3_LAST_CONTACT',
  'fallbackLeadSelect',
  'body.lastContactAt ?? body.last_contact_at',
  'payload.last_contact_at',
  'STAGE223R3_LAST_CONTACT_API',
]) {
  assertIncludes(apiLeads, token, 'api/leads.ts missing ' + token);
}

const apiClients = read('api/clients.ts');
for (const token of [
  "'last_contact_at'",
  'CLIENT_LIST_SELECT_STAGE223R3_LAST_CONTACT',
  'fallbackClientSelect',
  'body.lastContactAt ?? body.last_contact_at',
  'payload.last_contact_at',
  'STAGE223R3_LAST_CONTACT_API',
]) {
  assertIncludes(apiClients, token, 'api/clients.ts missing ' + token);
}

const contract = read('src/lib/data-contract.ts');
for (const token of [
  "lastContactAt: ['lastContactAt', 'last_contact_at', 'contactedAt', 'contacted_at']",
  'lastContactAt: string | null;',
  'lastContactAt: toIsoDateTime(row.lastContactAt) || toIsoDateTime(row.last_contact_at) || toIsoDateTime(row.contactedAt) || toIsoDateTime(row.contacted_at)',
]) {
  assertIncludes(contract, token, 'data-contract missing ' + token);
}

const sql = read('supabase/sql/001_stage223r3_add_last_contact_at.sql');
for (const token of [
  'alter table public.leads',
  'add column if not exists last_contact_at timestamptz',
  'alter table public.clients',
]) {
  assertIncludes(sql, token, 'SQL missing ' + token);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts['check:stage223r3-last-contact-intake'] !== 'node scripts/check-stage223r3-last-contact-intake.cjs') {
  fail('package.json missing check:stage223r3-last-contact-intake');
}
if (pkg.scripts['test:stage223r3-last-contact-intake'] !== 'node --test tests/stage223r3-last-contact-intake.test.cjs') {
  fail('package.json missing test:stage223r3-last-contact-intake');
}

console.log('STAGE223R3_LAST_CONTACT_INTAKE: OK');
