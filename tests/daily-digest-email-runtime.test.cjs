const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('daily digest cron is compatible with Vercel Hobby daily cron limit', () => {
  const vercel = JSON.parse(read('vercel.json'));
  const digestCron = vercel.crons.find((cron) => cron.path === '/api/daily-digest');

  assert.ok(digestCron, 'daily digest cron must exist');
  assert.equal(digestCron.schedule, '5 5 * * *');
  assert.notEqual(digestCron.schedule, '5 * * * *', 'Hobby accounts cannot run hourly cron');
});

test('daily digest API supports workspace self-test email send', () => {
  const api = read('api/daily-digest.ts');

  assert.match(api, /selfTestMode === 'workspace-test'/);
  assert.match(api, /send-test-digest/);
  assert.match(api, /REQUESTER_EMAIL_REQUIRED/);
  assert.match(api, /DIGEST_RECIPIENT_EMAIL_REQUIRED/);
  assert.match(api, /CloseFlow - test planu dnia/);
  assert.match(api, /sendDigestEmail/);
  assert.match(api, /RESEND_API_KEY_MISSING/);
});

test('daily digest hour enforcement is optional for free daily cron runtime', () => {
  const api = read('api/daily-digest.ts');

  assert.match(api, /function shouldEnforceWorkspaceDigestHour\(\)/);
  assert.match(api, /DIGEST_ENFORCE_WORKSPACE_HOUR/);
  assert.match(api, /shouldEnforceWorkspaceDigestHour\(\) && !shouldSendDigestNow/);
});

test('settings page exposes digest schedule, hint, and test-send control', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.match(settings, /dailyDigestHour/);
  assert.match(settings, /dailyDigestTimezone/);
  assert.match(settings, /dailyDigestRecipientEmail/);
  assert.match(settings, /handleSaveDigestSettings/);
  assert.match(settings, /handleSendDigestTest/);
  assert.match(settings, /mode: 'workspace-test'/);
  assert.match(settings, /Wyslij test teraz/);
  assert.match(settings, /Na darmowym Vercel cron dziala raz dziennie/);
});

test('release gates include daily digest runtime regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.match(quietGate, /tests\/daily-digest-email-runtime\.test\.cjs/);
  assert.match(fullGate, /tests\/daily-digest-email-runtime\.test\.cjs/);
});
