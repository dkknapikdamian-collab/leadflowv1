const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const migrationPath = path.join(root, 'supabase', 'migrations', '20260501_a27_response_templates_supabase.sql');

function fail(message) {
  console.error(`A27C SQL guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(migrationPath)) {
  fail('missing migration file');
}

const sql = fs.readFileSync(migrationPath, 'utf8');

const required = [
  'create or replace function public.a27_jsonb_to_text_array(input_value jsonb)',
  "execute 'alter table public.response_templates alter column tags type text[] using public.a27_jsonb_to_text_array(tags)'",
  "execute 'alter table public.response_templates alter column variables type text[] using public.a27_jsonb_to_text_array(variables)'",
  'create table if not exists public.response_templates',
  'workspace_id uuid',
  'tags text[]',
  'variables text[]',
  'archived_at timestamptz',
  'alter table public.response_templates enable row level security;',
];

for (const marker of required) {
  if (!sql.includes(marker)) {
    fail(`missing marker: ${marker}`);
  }
}

const forbidden = [
  'array(select jsonb_array_elements_text(tags))',
  'array(select jsonb_array_elements_text(variables))',
];

for (const marker of forbidden) {
  if (sql.includes(marker)) {
    fail(`old invalid SQL still exists: ${marker}`);
  }
}

console.log('OK: A27C response templates SQL fix guard passed.');
