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

const gateDoc = 'docs/release/GOOGLE_CALENDAR_SYNC_V1_STAGE07_OAUTH_SMOKE_EVIDENCE_GATE_2026-05-03.md';
const evidenceDoc = 'docs/release/GOOGLE_CALENDAR_SYNC_V1_STAGE07_MANUAL_SMOKE_EVIDENCE_2026-05-03.md';

assert(exists(gateDoc), 'missing Stage 07 gate doc');
assert(exists(evidenceDoc), 'missing Stage 07 manual evidence doc');

const gate = exists(gateDoc) ? read(gateDoc) : '';
const evidence = exists(evidenceDoc) ? read(evidenceDoc) : '';

for (const marker of [
  'requires_config',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'GOOGLE_TOKEN_ENCRYPTION_KEY',
  'GOOGLE_OAUTH_STATE_SECRET',
  'GCAL STAGE07 SMOKE - CREATE',
  'GCAL STAGE07 SMOKE - UPDATE',
  'google_calendar_connections',
  'google_calendar_reminders',
  'Vercel Hobby function budget',
]) {
  assert(gate.includes(marker), 'Stage 07 gate doc missing marker: ' + marker);
}

for (const marker of [
  'NOT_RUN',
  'FAILED',
  'PASSED',
  'Vercel deployment URL',
  'GOOGLE_CLIENT_ID',
  'Authorized redirect URI',
  'Event CREATE',
  'Event UPDATE',
  'Event DELETE',
  'Disconnect',
  'Czy mozna zmienic Google Calendar z `requires_config` na `active`?',
]) {
  assert(evidence.includes(marker), 'Stage 07 evidence doc missing marker: ' + marker);
}

const truth = read('src/lib/product-truth.ts');
const googleIndex = truth.indexOf("key: 'google_calendar'");
const googleSlice = googleIndex >= 0 ? truth.slice(googleIndex, googleIndex + 900) : '';
assert(googleSlice.includes("status: 'requires_config'"), 'Google Calendar must remain requires_config until manual evidence passes');

const settings = read('src/pages/Settings.tsx');
assert(settings.includes('data-google-calendar-reminder-ui="stage06"'), 'Stage 06 reminder UI must remain present');
assert(settings.includes('/api/google-calendar?route=status'), 'Settings must keep Google Calendar status endpoint');
assert(settings.includes('/api/google-calendar?route=connect'), 'Settings must keep Google Calendar connect endpoint');

const vercel = JSON.parse(read('vercel.json'));
const rewrite = (vercel.rewrites || []).find((item) => item.source === '/api/google-calendar');
assert(Boolean(rewrite), 'vercel.json must keep /api/google-calendar rewrite');
assert(rewrite && rewrite.destination === '/api/system?kind=google-calendar', 'Google Calendar rewrite must still point to api/system');

assert(!exists('api/google-calendar.ts'), 'must not recreate standalone api/google-calendar.ts');

const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage07-oauth-smoke-evidence-gate']), 'package.json missing Stage 07 guard script');

if (problems.length) {
  console.error('Google Calendar Stage 07 OAuth smoke evidence gate guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Stage 07 OAuth smoke evidence gate');
