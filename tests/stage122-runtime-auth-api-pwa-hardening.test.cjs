const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

function stripJsComments(text) {
  return String(text || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1');
}

test('Stage122 retires stale CloseFlow PWA cache without touching auth storage', () => {
  const register = read('src/pwa/register-service-worker.ts');
  const sw = read('public/service-worker.js');
  assert.match(register, /STAGE122_RUNTIME_AUTH_API_PWA_HARDENING/, 'register-service-worker must carry Stage122 marker.');
  assert.match(register, /getRegistrations\(\)/, 'runtime must inspect existing registrations.');
  assert.match(register, /registration\.unregister\(\)/, 'runtime must unregister old workers.');
  assert.match(register, /caches\.keys\(\)/, 'runtime must clear CacheStorage closeflow caches.');
  assert.doesNotMatch(register, /localStorage\.clear\(\)/, 'must not clear localStorage or log the user out.');

  assert.match(sw, /STAGE122_RUNTIME_AUTH_API_PWA_HARDENING/, 'service worker must carry Stage122 marker.');
  assert.match(sw, /Network-only/, 'service worker must document network-only behavior.');
  assert.doesNotMatch(sw, /cache\.addAll\(/, 'service worker must not precache assets.');
  assert.doesNotMatch(stripJsComments(sw), /event\.respondWith\(/, 'service worker must not intercept runtime requests.');
});

test('Stage122 exposes deployment version through system route without adding a Vercel function', () => {
  assert.equal(exists('api/version.ts'), false, 'api/version.ts must not exist because Hobby function budget is capped.');
  const system = read('api/system.ts');
  const vercel = JSON.parse(read('vercel.json'));
  const main = read('src/main.tsx');
  assert.match(system, /STAGE122_RUNTIME_AUTH_API_PWA_HARDENING_VERSION_ROUTE/, 'system version route marker missing.');
  assert.match(system, /Cache-Control.*no-store/s, '/api/system?kind=version must be no-store.');
  assert.match(system, /VERCEL_GIT_COMMIT_SHA/, 'system version route must expose Vercel commit sha.');
  assert.match(system, /(entityConflictsKind|kind)\s*===\s*'version'/, 'system handler must route kind=version through api/system.');
  assert.ok((vercel.rewrites || []).some((rewrite) => rewrite.source === '/api/version' && rewrite.destination === '/api/system?kind=version'), '/api/version must rewrite to /api/system?kind=version.');
  assert.match(main, /CLOSEFLOW_STAGE122_RUNTIME_MARKER/, 'main runtime marker missing.');
});

test('Stage122 work-items auth errors are not masked as 500', () => {
  const api = read('api/work-items.ts');
  assert.match(api, /RequestAuthError/, 'work-items must import/use RequestAuthError.');
  assert.match(api, /error instanceof RequestAuthError[\s\S]*res\.status\(error\.status\)/, 'RequestAuthError must use its own status.');
  assert.match(api, /AUTHORIZATION_BEARER_REQUIRED/, 'missing bearer auth code classification.');
  assert.match(api, /INVALID_SUPABASE_ACCESS_TOKEN/, 'missing invalid token classification.');
  assert.match(api, /WORKSPACE_MEMBERSHIP_REQUIRED[\s\S]*403/, 'workspace membership errors must be forbidden, not 500.');
});

test('Stage122 guard is wired into package scripts and quiet release gate once', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const needle = 'tests/stage122-runtime-auth-api-pwa-hardening.test.cjs';
  assert.equal(pkg.scripts['test:stage122-runtime-auth-api-pwa-hardening'], 'node --test ' + needle);
  assert.equal(quiet.split(needle).length - 1, 1, 'Stage122 guard must be listed once in quiet gate.');
});
