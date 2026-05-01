#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    failures.push(rel + ' is missing');
    return '';
  }
  return fs.readFileSync(abs, 'utf8');
}

const sessionHook = read('src/hooks/useSupabaseSession.ts');
const supabaseAuth = read('src/lib/supabase-auth.ts');

for (const marker of [
  'P0_AUTH_BOOTSTRAP_RACE_FIX',
  'setClientAuthSnapshot',
  'clearClientAuthSnapshot',
  'syncClientAuthSnapshotFromSessionUser(nextUser)',
  'onSupabaseSessionChange((session) =>',
]) {
  if (!sessionHook.includes(marker)) failures.push('useSupabaseSession.ts missing marker: ' + marker);
}

for (const marker of [
  'P0_AUTH_HEADERS_WAIT_FOR_SESSION',
  'AUTH_ACCESS_TOKEN_RETRY_DELAYS_MS',
  'sleepForAuthBootstrap',
  'getSupabaseSession()',
]) {
  if (!supabaseAuth.includes(marker)) failures.push('supabase-auth.ts missing marker: ' + marker);
}

if (failures.length) {
  console.error('P0 auth bootstrap race guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: P0 auth bootstrap race guard passed.');
