#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(file) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing required file: ${file}`);
  }
  return fs.readFileSync(target, 'utf8').replace(/^\uFEFF/, '');
}

function expect(file, text, label = text) {
  const body = read(file);
  if (!body.includes(text)) {
    throw new Error(`${file}: missing ${label}`);
  }
  console.log(`OK: ${file} contains ${label}`);
}

expect('api/daily-digest.ts', 'function getDigestEnabledSetting', 'daily digest enabled helper');
expect('api/daily-digest.ts', 'daily_digest_enabled', 'snake case digest enabled support');
expect('api/daily-digest.ts', 'dailyDigestEnabled', 'camel case digest enabled support');
expect('src/pages/NotificationsCenter.tsx', 'getNotificationSnoozedUntilByKey', 'notification snooze getter import');
expect('src/pages/NotificationsCenter.tsx', 'type NotificationSnoozeMode', 'notification snooze mode type import');
expect('src/lib/notifications.ts', 'getNotificationSnoozedUntilByKey', 'notification snooze getter export bridge');
expect('src/lib/notifications.ts', 'type NotificationSnoozeMode', 'notification snooze type export bridge');

console.log('stage30a-ts-continuity: PASS');
