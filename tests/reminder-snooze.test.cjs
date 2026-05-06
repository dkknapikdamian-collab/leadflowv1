const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const code = fs.readFileSync(path.join(process.cwd(), 'src/lib/notification-snooze.ts'), 'utf8');

test('custom snooze contract exists', () => {
  assert.match(code, /NotificationSnoozeMode = '15m' \| '1h' \| 'tomorrow' \| 'custom'/);
  assert.match(code, /export function setNotificationSnoozeCustom\(/);
  assert.match(code, /mode: 'custom'/);
  assert.match(code, /until.getTime\(\) <= now.getTime\(\)/);
});
