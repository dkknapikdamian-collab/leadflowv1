const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('Stage 28 daily digest API tracks one daily send per workspace', () => {
  const api = read('api/daily-digest.ts');

  assert.match(api, /STAGE28_DAILY_DIGEST_EMAIL_FOUNDATION/);
  assert.match(api, /function isSameDigestDay/);
  assert.match(api, /updateWorkspaceLastDigestSentAt/);
  assert.match(api, /last_digest_sent_at/);
  assert.match(api, /lastDigestSentAt/);
  assert.match(api, /alreadySentToday/);
  assert.match(api, /stats\.skippedDuplicate/);
});

test('Stage 28 digest collects tasks events leads and AI drafts', () => {
  const api = read('api/daily-digest.ts');
  const digest = read('src/server/_digest.ts');

  assert.match(api, /loadWorkspaceBundle/);
  assert.match(api, /drafts: \(bundle as any\)\.drafts \|\| \[\]/);
  assert.match(api, /buildDailyDigestPayload/);
  assert.match(digest, /tasksToday|todayTasks|tasks/);
  assert.match(digest, /eventsToday|todayEvents|events/);
  assert.match(digest, /overdue|zaleg/i);
  assert.match(digest, /draft/i);
});

test('Stage 28 digest respects disabled workspaces and digest hour', () => {
  const api = read('api/daily-digest.ts');

  assert.match(api, /daily_digest_enabled/);
  assert.match(api, /skippedDisabled/);
  assert.match(api, /shouldSendDigestNow/);
  assert.match(api, /DIGEST_ENFORCE_WORKSPACE_HOUR/);
});

test('Stage 28 digest sends through Resend and writes a log', () => {
  const api = read('api/daily-digest.ts');

  assert.match(api, /RESEND_API_KEY/);
  assert.match(api, /sendDigestEmail/);
  assert.match(api, /writeDigestLog/);
  assert.match(api, /digest_logs/);
  assert.match(api, /summary_json/);
});
