const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function assert(condition, message) {
  if (!condition) problems.push(message);
}

function apiFunctionFiles() {
  const apiDir = path.join(root, 'api');
  if (!fs.existsSync(apiDir)) return [];
  return fs.readdirSync(apiDir)
    .filter((name) => /\.(t|j)s$/.test(name))
    .sort();
}

const files = apiFunctionFiles();
assert(files.length <= 12, 'Vercel Hobby allows max 12 api function files, found ' + files.length + ': ' + files.join(', '));
assert(!exists('api/google-calendar.ts'), 'api/google-calendar.ts must not exist as standalone Vercel function on Hobby plan');
assert(exists('src/server/google-calendar-handler.ts'), 'src/server/google-calendar-handler.ts must exist');

const vercel = JSON.parse(read('vercel.json'));
const googleRewrite = (vercel.rewrites || []).find((item) => item.source === '/api/google-calendar');
assert(Boolean(googleRewrite), 'vercel.json missing /api/google-calendar rewrite');
assert(googleRewrite && googleRewrite.destination === '/api/system?kind=google-calendar', 'vercel.json must route /api/google-calendar to /api/system?kind=google-calendar');

const system = read('api/system.ts');
assert(system.includes("kind === 'google-calendar'"), 'api/system.ts missing kind=google-calendar route');
assert(system.includes('google-calendar-handler.js'), 'api/system.ts missing google-calendar-handler import');

const handler = read('src/server/google-calendar-handler.ts');
for (const marker of [
  'GOOGLE_CALENDAR_SYSTEM_ROUTE_CONSOLIDATION_2026_05_03',
  "action === 'callback'",
  "action === 'connect'",
  "action === 'status'",
  "action === 'disconnect'",
  'assertWorkspaceWriteAccess',
  'resolveRequestWorkspaceId',
]) {
  assert(handler.includes(marker), 'google-calendar-handler missing marker: ' + marker);
}

const foundation = read('scripts/check-google-calendar-sync-v1-foundation.cjs');
assert(!foundation.includes("'api/google-calendar.ts'"), 'foundation guard must not require standalone api/google-calendar.ts');
assert(foundation.includes("'src/server/google-calendar-handler.ts'"), 'foundation guard must require google-calendar-handler.ts');

const settings = read('src/pages/Settings.tsx');
assert(settings.includes('/api/google-calendar?route=status'), 'Settings must keep public /api/google-calendar status URL');
assert(settings.includes('/api/google-calendar?route=connect'), 'Settings must keep public /api/google-calendar connect URL');
assert(settings.includes('/api/google-calendar?route=disconnect'), 'Settings must keep public /api/google-calendar disconnect URL');

if (problems.length) {
  console.error('Vercel Hobby function budget guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Vercel Hobby function budget guard');
