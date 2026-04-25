const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('daily digest accepts Vercel Cron before enforcing manual CRON_SECRET', () => {
  const api = read('api/daily-digest.ts');

  const vercelCronIndex = api.indexOf("const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);");
  const cronSecretCheckIndex = api.indexOf('if (cronSecret)', vercelCronIndex);

  assert.notEqual(vercelCronIndex, -1, 'x-vercel-cron guard must exist');
  assert.notEqual(cronSecretCheckIndex, -1, 'CRON_SECRET guard must exist');
  assert.ok(vercelCronIndex < cronSecretCheckIndex, 'Vercel Cron guard must run before CRON_SECRET guard');

  assert.match(api, /if \(vercelCron\) return true;/);
  assert.match(api, /providedSecret === cronSecret/);
});


test('daily digest keeps workspace hour enforcement behind explicit Pro/runtime flag', () => {
  const api = read('api/daily-digest.ts');

  assert.match(api, /DIGEST_ENFORCE_WORKSPACE_HOUR/);
  assert.match(api, /shouldEnforceWorkspaceDigestHour\(\) && !shouldSendDigestNow/);
});
