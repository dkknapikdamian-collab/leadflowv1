const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) problems.push(message);
}

const releaseDoc = 'docs/release/GOOGLE_CALENDAR_SYNC_V1_STAGE04_OAUTH_ENV_MANUAL_SMOKE_2026-05-03.md';
const setupDoc = 'docs/integrations/GOOGLE_CALENDAR_OAUTH_SETUP_2026-05-03.md';

assert(exists(releaseDoc), 'missing Stage 04 release doc');
assert(exists(setupDoc), 'missing Google OAuth setup doc');

const release = exists(releaseDoc) ? read(releaseDoc) : '';
const setup = exists(setupDoc) ? read(setupDoc) : '';

for (const marker of [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'GOOGLE_TOKEN_ENCRYPTION_KEY',
  'GOOGLE_OAUTH_STATE_SECRET',
  'https://closeflowapp.vercel.app/api/google-calendar?route=callback',
  'Manual smoke test',
  'GCAL SMOKE TEST - CloseFlow',
  'google_calendar_connections',
  'google_calendar_sync_status',
  'requires_config',
]) {
  assert(release.includes(marker), 'Stage 04 release doc missing marker: ' + marker);
}

for (const marker of [
  '/api/google-calendar -> /api/system?kind=google-calendar',
  'Nie zmieniaj redirect URI na `/api/system`',
  'redirect_uri_mismatch',
  'Nie dodawac Google Client Secret jako `VITE_*`',
]) {
  assert(setup.includes(marker), 'Google OAuth setup doc missing marker: ' + marker);
}

const vercel = JSON.parse(read('vercel.json'));
const googleRewrite = (vercel.rewrites || []).find((item) => item.source === '/api/google-calendar');
assert(Boolean(googleRewrite), 'vercel.json must keep /api/google-calendar rewrite');
assert(googleRewrite && googleRewrite.destination === '/api/system?kind=google-calendar', 'vercel.json must keep google-calendar system rewrite');

const settings = read('src/pages/Settings.tsx');
assert(settings.includes('/api/google-calendar?route=status'), 'Settings must keep public Google Calendar status endpoint');
assert(settings.includes('/api/google-calendar?route=connect'), 'Settings must keep public Google Calendar connect endpoint');
assert(settings.includes('/api/google-calendar?route=disconnect'), 'Settings must keep public Google Calendar disconnect endpoint');

const truth = read('src/lib/product-truth.ts');
const googleIndex = truth.indexOf("key: 'google_calendar'");
const googleSlice = googleIndex >= 0 ? truth.slice(googleIndex, googleIndex + 800) : '';
assert(googleSlice.includes("status: 'requires_config'"), 'Google Calendar must remain requires_config until manual smoke passes');

if (problems.length) {
  console.error('Google Calendar Stage 04 OAuth/ENV manual smoke docs guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Stage 04 OAuth/ENV manual smoke docs guard');
