import assert from 'node:assert/strict';
import { buildReminderItems, DEFAULT_REMINDER_SETTINGS, getVisibleReminderItems } from '../src/lib/notifications.ts';

const now = new Date('2026-04-26T09:30:00+02:00');
const tasks = [
  { id: 't-overdue', title: 'Stare zadanie', status: 'todo', date: '2026-04-25' },
  { id: 't-soon', title: 'Telefon za chwilę', status: 'todo', scheduledAt: '2026-04-26T09:45:00+02:00' },
  { id: 't-done', title: 'Gotowe', status: 'done', date: '2026-04-26' },
];
const events = [
  { id: 'e-today', title: 'Spotkanie', status: 'scheduled', startAt: '2026-04-26T14:00:00+02:00' },
];
const leads = [
  { id: 'l1', name: 'Lead bez akcji', status: 'new', dealValue: 1000 },
];

const items = buildReminderItems({ tasks, events, leads, now, settings: DEFAULT_REMINDER_SETTINGS });
assert.ok(items.some((item) => item.type === 'task_overdue'));
assert.ok(items.some((item) => item.type === 'task_due_soon'));
assert.ok(items.some((item) => item.type === 'today_event'));
assert.ok(items.some((item) => item.type === 'lead_without_action'));
assert.equal(getVisibleReminderItems(items).length, items.length);
console.log('notifications.test.ts OK');
