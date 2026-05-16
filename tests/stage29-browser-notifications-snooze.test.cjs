const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage 29 snooze helper computes 15m 1h and tomorrow', () => {
  const helper = require('../src/lib/notification-snooze.cjs');
  const now = new Date('2026-04-30T10:00:00.000Z');

  assert.equal(helper.computeNotificationSnoozeUntil('15m', now), '2026-04-30T10:15:00.000Z');
  assert.equal(helper.computeNotificationSnoozeUntil('1h', now), '2026-04-30T11:00:00.000Z');

  const tomorrow = new Date(helper.computeNotificationSnoozeUntil('tomorrow', now));
  assert.equal(tomorrow.getUTCDate(), 1);
  assert.equal(tomorrow.getUTCHours(), 9);
  assert.equal(tomorrow.getUTCMinutes(), 0);
});

test('Stage 29 dedupe key uses record type id reminder type and time window', () => {
  const helper = require('../src/lib/notification-snooze.cjs');
  const key = helper.buildNotificationDedupeKey({
    recordType: 'task',
    recordId: 'task-123',
    reminderType: '30min',
    timeWindow: '2026-04-30T10:00',
  });

  assert.equal(key, 'task:task-123:30min:2026-04-30T10:00');
  assert.equal(helper.resolveNotificationReminderType(-1, 'task'), 'overdue');
  assert.equal(helper.resolveNotificationReminderType(30, 'event'), '30min');
  assert.equal(helper.resolveNotificationReminderType(90, 'lead'), 'today_morning');
  assert.equal(helper.resolveNotificationReminderType(Number.NaN, 'lead'), 'lead_no_action');
});

test('Stage 29 notifications runtime scans up to 30 minutes and skips active snooze', () => {
  const source = read('src/lib/notifications.ts');

  assert.match(source, /STAGE29|notification-snooze|buildNotificationDedupeKey/);
  assert.match(source, /const rangeEnd = addMinutes\(now, 30\);/);
  assert.match(source, /item\.minutesUntil >= -120 && item\.minutesUntil <= 30/);
  assert.match(source, /isNotificationSnoozedActive\(item\.key, now\)/);
  assert.match(source, /reminderType/);
  assert.match(source, /dedupeWindow/);
  assert.match(source, /recordDeliveredNotification\(item: NotificationItem, deliveryKey/);
});

test('Stage 29 NotificationRuntime dedupes by delivery key and keeps browser fallback', () => {
  const source = read('src/components/NotificationRuntime.tsx');

  assert.match(source, /getNotificationDeliveryKey/);
  assert.match(source, /const deliveryKey = getNotificationDeliveryKey\(item\.key\);/);
  assert.match(source, /hasDeliveredNotification\(deliveryKey\)/);
  assert.match(source, /recordDeliveredNotification\(item, deliveryKey\)/);
  assert.match(source, /tag: deliveryKey/);
  assert.match(source, /permission === 'granted'/);
  assert.match(source, /toast\(item\.title/);
});

test('Stage 29 Notifications Center persists snooze and exposes clear states', () => {
  const source = read('src/pages/NotificationsCenter.tsx');

  assert.match(source, /getNotificationSnoozedUntilByKey/);
  assert.match(source, /setNotificationSnooze\(key, mode\)/);
  assert.match(source, /clearNotificationSnooze\(key\)/);
  assert.match(source, /useState<Record<string, string>>\(\(\) => getNotificationSnoozedUntilByKey\(\)\)/);
  assert.match(source, /Od\u0142o\u017Cone/);
  assert.match(source, /Do reakcji/);
  assert.match(source, /Przeczytane/);
  assert.match(source, /W\u0142\u0105cz powiadomienia/);
  assert.match(source, /Powiadomienia s\u0105 zablokowane w przegl\u0105darce/);
  assert.match(source, /Ta przegl\u0105darka mo\u017Ce nie obs\u0142ugiwa\u0107 powiadomie\u0144/);
});

test('Stage 29 does not change tasks/events while snoozing', () => {
  const center = read('src/pages/NotificationsCenter.tsx');
  const helper = read('src/lib/notification-snooze.ts');

  assert.doesNotMatch(center, /updateTaskInSupabase|updateEventInSupabase|insertTaskToSupabase|createTask/i);
  assert.match(helper, /closeflow:notifications:snoozed:v1/);
  assert.match(helper, /localStorage\.setItem\(SNOOZE_KEY/);
});

test('Stage 29 documentation exists', () => {
  const doc = read('docs/STAGE29_BROWSER_NOTIFICATIONS_SNOOZE.md');
  assert.match(doc, /Browser notifications/);
  assert.match(doc, /Snooze nie zmienia terminu zadania/);
});
