const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

const runtime = read('src/components/NotificationRuntime.tsx');
const center = read('src/pages/NotificationsCenter.tsx');
const settings = read('src/pages/Settings.tsx');
const notifications = read('src/lib/notifications.ts');

assert.match(runtime, /getReminderSettings/, 'NotificationRuntime must read reminder settings');
assert.match(runtime, /liveNotificationsEnabled/, 'NotificationRuntime must support live notifications toggle');
assert.match(center, /setNotificationSnoozeCustom/, 'NotificationsCenter must support custom snooze');
assert.match(center, /onSnoozeCustom/, 'NotificationsCenter must expose custom date snooze action');
assert.match(settings, /Powiadomienia in-app/, 'Settings must expose in-app notifications toggle');
assert.match(settings, /Domyślne przypomnienie \(min\)/, 'Settings must expose default reminder minutes');
assert.match(settings, /Domyślne odłożenie \(min\)/, 'Settings must expose default snooze minutes');
assert.match(notifications, /buildAdditionalReminderItems/, 'Notification builder must include reminder extensions');

console.log('PASS check:reminder-runtime');
