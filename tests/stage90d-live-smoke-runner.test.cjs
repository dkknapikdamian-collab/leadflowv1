const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(file) {
  try {
    return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
  } catch {
    return '';
  }
}

test('Stage90D live smoke runner is safe and non-mutating by default', () => {
  const runner = read('scripts/stage90d-live-smoke.cjs');

  assert.ok(runner.includes('DIGEST_ROUTE_NOT_CALLED_BY_DEFAULT=True'));
  assert.ok(runner.includes('NO_REAL_UPLOAD_PERFORMED=True'));
  assert.ok(runner.includes('NO_AUTH_TOKEN_USED=True'));
  assert.ok(!runner.includes('STRIPE_SECRET_KEY'));
  assert.ok(!runner.includes('SUPABASE_SERVICE_ROLE_KEY'));
});

test('Stage90D live smoke runner covers key public and blocked endpoints', () => {
  const runner = read('scripts/stage90d-live-smoke.cjs');

  assert.ok(runner.includes('/'));
  assert.ok(runner.includes('/manifest.webmanifest'));
  assert.ok(runner.includes('/sw.js'));
  assert.ok(runner.includes('/api/portal?route=session'));
  assert.ok(runner.includes('/api/storage-upload'));
  assert.ok(runner.includes('/api/billing-checkout'));
});

test('Stage90D package scripts are registered', () => {
  const pkg = JSON.parse(read('package.json'));

  assert.ok(pkg.scripts['stage90d:live-smoke']);
  assert.ok(pkg.scripts['check:stage90d-live-smoke-runner']);
  assert.ok(pkg.scripts['test:stage90d-live-smoke-runner']);
  assert.ok(pkg.scripts['verify:stage90d-smoke-runner']);
});


test('Stage90F commands doc contains stable digest safety marker', () => {
  const commands = read('docs/qa/STAGE90D_LIVE_SMOKE_COMMANDS.md');
  const releaseF = read('docs/release/STAGE90F_DIGEST_DOC_GUARD_FIX_2026-05-05.md');

  assert.ok(commands.includes('DIGEST_ROUTE_NOT_CALLED_BY_DEFAULT=True'));
  assert.ok(commands.includes('NO_REAL_UPLOAD_PERFORMED=True'));
  assert.ok(releaseF.includes('DIGEST_SAFETY_GUARD_FIXED'));
});
