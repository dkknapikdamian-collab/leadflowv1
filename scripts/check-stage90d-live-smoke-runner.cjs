#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  try {
    return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
  } catch {
    return '';
  }
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const runner = read('scripts/stage90d-live-smoke.cjs');
const commands = read('docs/qa/STAGE90D_LIVE_SMOKE_COMMANDS.md');
const release = read('docs/release/STAGE90D_LIVE_SMOKE_RUNNER_2026-05-05.md');
const releaseF = read('docs/release/STAGE90F_DIGEST_DOC_GUARD_FIX_2026-05-05.md');
const pkg = JSON.parse(read('package.json'));

expect(runner.includes('DIGEST_ROUTE_NOT_CALLED_BY_DEFAULT=True'), 'runner must not call digest route by default');
expect(runner.includes('NO_REAL_UPLOAD_PERFORMED=True'), 'runner must document no real upload');
expect(runner.includes('/api/portal?route=session'), 'runner must check portal no-token session');
expect(runner.includes('/api/storage-upload'), 'runner must check storage upload no-token');
expect(runner.includes('/api/billing-checkout'), 'runner must guard checkout GET no-create behavior');
expect(runner.includes('STAGE90D_LIVE_SMOKE_RESULT.latest.md'), 'runner must write latest result');
expect(runner.includes('RELEASE_PREVIEW_URL'), 'runner must read RELEASE_PREVIEW_URL');
expect(!runner.includes('STRIPE_SECRET_KEY'), 'runner must not read Stripe secret');
expect(!runner.includes('SUPABASE_SERVICE_ROLE_KEY'), 'runner must not read service role secret');

expect(commands.includes('READY_TO_RUN_AFTER_DEPLOY'), 'commands doc must be deploy-run oriented');
expect(commands.includes('npm.cmd run stage90d:live-smoke'), 'commands doc must include live smoke command');
expect(commands.includes('DIGEST_ROUTE_NOT_CALLED_BY_DEFAULT=True') || /digest[\s\S]{0,160}(not|nie|domy\u015Blnie|domyslnie)/i.test(commands), 'commands doc must state digest is not auto-called');
expect(release.includes('LIVE_SMOKE_RUNNER_ADDED'), 'release doc must mark runner added');
expect(releaseF.includes('DIGEST_SAFETY_GUARD_FIXED'), 'Stage90F release doc missing');
expect(release.includes('nie odpala daily digest route domy\u015Blnie'), 'release doc must explain digest safety');

expect(Boolean(pkg.scripts?.['stage90d:live-smoke']), 'package missing stage90d live smoke script');
expect(Boolean(pkg.scripts?.['check:stage90d-live-smoke-runner']), 'package missing Stage90D check');
expect(Boolean(pkg.scripts?.['test:stage90d-live-smoke-runner']), 'package missing Stage90D test');
expect(Boolean(pkg.scripts?.['verify:stage90d-smoke-runner']), 'package missing Stage90D verify');

if (fail.length) {
  console.error('Stage90D live smoke runner guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS STAGE90D_LIVE_SMOKE_RUNNER');
