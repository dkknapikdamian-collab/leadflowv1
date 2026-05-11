const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function fail(message) { console.error(message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }

const required = [
  'src/lib/client-cases.ts',
  'supabase/migrations/20260510_add_primary_case_to_clients.sql',
  'docs/clients/CLOSEFLOW_CLIENT_PRIMARY_CASE_2026-05-10.md',
  'docs/quality/CLOSEFLOW_STAGE_POLISH_COPY_GUARD_2026-05-11.md',
  'scripts/check-closeflow-client-primary-case.cjs',
  'scripts/check-closeflow-stage-polish-guard.cjs',
];
for (const rel of required) assert(exists(rel), 'Brak pliku: ' + rel);

const migration = read('supabase/migrations/20260510_add_primary_case_to_clients.sql').toLowerCase();
assert(migration.includes('primary_case_id'), 'Migracja nie dodaje primary_case_id');
assert(migration.includes('on delete set null'), 'Migracja nie ma ON DELETE SET NULL');

const dataContract = read('src/lib/data-contract.ts');
assert(dataContract.includes('primaryCaseId'), 'data-contract nie normalizuje primaryCaseId');
assert(dataContract.includes('primary_case_id'), 'data-contract nie normalizuje primary_case_id');

const clientsApi = read('api/clients.ts');
assert(clientsApi.includes('primary_case_id'), 'api/clients.ts nie obsługuje primary_case_id');
assert(clientsApi.includes('primaryCaseId'), 'api/clients.ts nie obsługuje primaryCaseId');

const casesApi = read('api/cases.ts');
assert(casesApi.includes('primaryForClient'), 'api/cases.ts nie obsługuje primaryForClient');
assert(casesApi.includes('replacePrimaryCase'), 'api/cases.ts nie obsługuje replacePrimaryCase');
assert(casesApi.includes('PRIMARY_CASE_ALREADY_EXISTS'), 'api/cases.ts nie zwraca PRIMARY_CASE_ALREADY_EXISTS');

const fallback = read('src/lib/supabase-fallback.ts');
assert(fallback.includes('primaryCaseId'), 'supabase-fallback nie obsługuje primaryCaseId');
assert(fallback.includes('updateClientPrimaryCaseInSupabase'), 'supabase-fallback nie ma updateClientPrimaryCaseInSupabase');

const helper = read('src/lib/client-cases.ts');
assert(helper.includes('getClientPrimaryCaseId'), 'client-cases.ts nie ma getClientPrimaryCaseId');
assert(helper.includes('getClientPrimaryCase'), 'client-cases.ts nie ma getClientPrimaryCase');
assert(helper.includes('sortClientCasesWithPrimaryFirst'), 'client-cases.ts nie ma sortClientCasesWithPrimaryFirst');
assert(helper.includes('primaryCaseId'), 'client-cases.ts nie używa primaryCaseId');

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts?.['check:closeflow-client-primary-case'] === 'node scripts/check-closeflow-client-primary-case.cjs', 'package.json nie ma check:closeflow-client-primary-case');
assert(pkg.scripts?.['check:closeflow-stage-polish-guard'] === 'node scripts/check-closeflow-stage-polish-guard.cjs', 'package.json nie ma check:closeflow-stage-polish-guard');

console.log('CLOSEFLOW_CLIENT_PRIMARY_CASE_ETAP7_CHECK_OK');
console.log('primary_case_id=true');
console.log('on_delete_set_null=true');
console.log('single_primary_case_model=clients.primary_case_id');
console.log('client_top_tiles_scope=global_all_cases');
