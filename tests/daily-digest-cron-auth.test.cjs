const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('daily and weekly digest cron require CRON_SECRET even with a Vercel hint', () => {
  const daily = read('src/server/daily-digest-handler.ts');
  const weekly = read('src/server/weekly-report-handler.ts');
  const authorization = read('src/server/digest-authorization.ts');

  for (const source of [daily, weekly]) {
    assert.match(source, /isDigestCronAuthorized/);
    assert.match(authorization, /CRON_SECRET/);
    assert.doesNotMatch(source, /if \(vercelCron\) return true;/);
    assert.doesNotMatch(source, /req\?\.query\?\.secret/);
    assert.doesNotMatch(source, /body[^\n]*secret/);
  }
});


test('daily digest keeps workspace hour enforcement behind explicit Pro/runtime flag', () => {
  const api = read('api/daily-digest.ts');

  assert.match(api, /DIGEST_ENFORCE_WORKSPACE_HOUR/);
  assert.match(api, /shouldEnforceWorkspaceDigestHour\(\) && !shouldSendDigestNow/);
});
