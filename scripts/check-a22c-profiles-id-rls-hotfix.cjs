#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const migration = path.join(root, 'supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql');
const fail = [];
const expect = (condition, message) => { if (!condition) fail.push(message); };

expect(fs.existsSync(migration), 'missing A22 migration');
const sql = fs.existsSync(migration) ? fs.readFileSync(migration, 'utf8') : '';

expect(sql.includes('A22C_PROFILES_ID_SCHEMA_REPAIR'), 'migration must contain A22C profiles id schema repair marker');
expect(sql.includes('alter table if exists public.profiles add column if not exists id uuid'), 'migration must add profiles.id for legacy installs');
expect(sql.includes('update public.profiles set id = gen_random_uuid() where id is null'), 'migration must backfill profiles.id');
expect(sql.includes('create unique index profiles_id_unique_idx on public.profiles(id)'), 'migration must create unique index for profiles.id conflict target');
expect(sql.includes('p.id::text = auth.uid()::text'), 'closeflow_is_admin must cast profiles.id for legacy compatibility');
expect(sql.includes('auth_user_id::text = auth.uid()::text'), 'profile policies must cast auth_user_id for legacy compatibility');
expect(sql.includes('firebase_uid::text = auth.uid()::text'), 'profile policies must cast firebase_uid for legacy compatibility');
expect(sql.includes('external_auth_uid::text = auth.uid()::text'), 'profile policies must cast external_auth_uid for legacy compatibility');

if (fail.length) {
  console.error('A22c profiles id/RLS migration guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: A22c profiles id/RLS migration guard passed.');
