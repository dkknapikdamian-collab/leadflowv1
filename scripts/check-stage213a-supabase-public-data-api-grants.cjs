const fs = require('fs');

function fail(message) {
  console.error('STAGE213A_GUARD_FAIL: ' + message);
  process.exit(1);
}

const migrationPath = 'supabase/migrations/20260531_stage213a_public_data_api_explicit_grants.sql';
if (!fs.existsSync(migrationPath)) fail('missing migration: ' + migrationPath);

const sql = fs.readFileSync(migrationPath, 'utf8');

const required = [
  'STAGE213A_SUPABASE_PUBLIC_DATA_API_GRANTS',
  'grant usage on schema public to anon, authenticated, service_role',
  'grant select, insert, update, delete on all tables in schema public to authenticated',
  'grant select, insert, update, delete on all tables in schema public to service_role',
  'grant usage, select on all sequences in schema public to authenticated',
  'grant usage, select on all sequences in schema public to service_role',
  'grant execute on all functions in schema public to authenticated',
  'grant execute on all functions in schema public to service_role',
  'alter default privileges for role postgres in schema public',
];

for (const marker of required) {
  if (!sql.toLowerCase().includes(marker.toLowerCase())) {
    fail('missing SQL marker: ' + marker);
  }
}

const forbidden = [
  'grant all on all tables in schema public to anon',
  'grant select, insert, update, delete on all tables in schema public to anon',
  'grant delete on all tables in schema public to anon',
  'grant update on all tables in schema public to anon',
];

for (const marker of forbidden) {
  if (sql.toLowerCase().includes(marker.toLowerCase())) {
    fail('dangerous anon grant found: ' + marker);
  }
}

console.log('STAGE213A_SUPABASE_PUBLIC_DATA_API_GRANTS_GUARD_PASS');
