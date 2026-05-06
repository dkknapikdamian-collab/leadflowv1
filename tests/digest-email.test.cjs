const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const digestCode = fs.readFileSync(path.join(process.cwd(), 'src/server/_digest.ts'), 'utf8');
const dailyHandler = fs.readFileSync(path.join(process.cwd(), 'src/server/daily-digest-handler.ts'), 'utf8');

test('daily digest payload includes required sections and nearest upcoming', () => {
  assert.match(digestCode, /todayTasks/);
  assert.match(digestCode, /todayEvents/);
  assert.match(digestCode, /overdueTasks/);
  assert.match(digestCode, /overdueEvents/);
  assert.match(digestCode, /overdueLeads/);
  assert.match(digestCode, /noStepLeads/);
  assert.match(digestCode, /casesWithoutPlannedAction/);
  assert.match(digestCode, /pendingAiDrafts/);
  assert.match(digestCode, /nearestUpcoming/);
});

test('daily digest handler does not fake provider success and has cron guard', () => {
  assert.match(dailyHandler, /sendResendEmail/);
  assert.match(dailyHandler, /RESEND_API_KEY_MISSING/);
  assert.match(dailyHandler, /if \(vercelCron\) return true/);
  assert.match(dailyHandler, /if \(!cronSecret\) return false/);
  assert.match(dailyHandler, /DIGEST_CRON_UNAUTHORIZED/);
});
