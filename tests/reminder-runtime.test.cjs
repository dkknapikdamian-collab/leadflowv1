const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8');
}

test('Notification runtime uses reminder settings and additional reminder builder', () => {
  const runtime = read('src/components/NotificationRuntime.tsx');
  const notifications = read('src/lib/notifications.ts');
  assert.match(runtime, /getReminderSettings/);
  assert.match(runtime, /liveNotificationsEnabled/);
  assert.match(notifications, /buildAdditionalReminderItems/);
  assert.match(notifications, /setNotificationSnoozeCustom/);
});

test('Settings exposes reminder defaults and live notifications controls', () => {
  const settings = read('src/pages/Settings.tsx');
  assert.match(settings, /Powiadomienia in-app/);
  assert.match(settings, /Domyślne przypomnienie \(min\)/);
  assert.match(settings, /Domyślne odłożenie \(min\)/);
});
