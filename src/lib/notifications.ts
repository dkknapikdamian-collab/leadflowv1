import { addMinutes, endOfDay, format, parseISO, startOfDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { CalendarBundle } from './calendar-items';
import { isActiveSalesLead } from './lead-health';
import { combineScheduleEntries, type ScheduleEntry } from './scheduling';
import {
  buildNotificationDedupeKey,
  buildNotificationReminderWindow,
  getNotificationDeliveryKey,
  isNotificationSnoozedActive,
  resolveNotificationReminderType,
} from './notification-snooze';
export {
  clearNotificationSnooze,
  getNotificationDeliveryKey,
  getNotificationSnoozedUntilByKey,
  setNotificationSnooze,
  type NotificationSnoozeMode,
} from './notification-snooze';

const BROWSER_PREF_KEY = 'closeflow:notifications:browser-enabled:v1';
const LOG_KEY = 'closeflow:notifications:log:v1';

export type NotificationSeverity = 'overdue' | 'soon';

export type NotificationItem = {
  id: string;
  key: string;
  kind: 'task' | 'event' | 'lead';
  title: string;
  body: string;
  startsAt: string;
  sourceId: string;
  severity: NotificationSeverity;
  minutesUntil: number;
  reminderType: 'overdue' | '30min' | 'today_morning' | 'ai_draft_review' | 'lead_no_action';
  dedupeWindow: string;
  link: string;
  leadName?: string | null;
};

export type NotificationLogItem = NotificationItem & {
  deliveredAt: string;
  read: boolean;
};

function isEntryActionable(entry: ScheduleEntry) {
  if (entry.kind === 'task') return entry.raw?.status !== 'done';
  if (entry.kind === 'event') return entry.raw?.status !== 'completed';
  return isActiveSalesLead(entry.raw);
}

function mapEntryToItem(entry: ScheduleEntry, now: Date): NotificationItem | null {
  if (!isEntryActionable(entry)) return null;

  const startsAtDate = parseISO(entry.startsAt);
  const minutesUntil = Math.round((startsAtDate.getTime() - now.getTime()) / 60_000);
  const severity: NotificationSeverity = minutesUntil < 0 ? 'overdue' : 'soon';
  const reminderType = resolveNotificationReminderType(minutesUntil, entry.kind);
  const dedupeWindow = buildNotificationReminderWindow(entry.startsAt, reminderType);
  const dedupeKey = buildNotificationDedupeKey({
    recordType: entry.kind,
    recordId: entry.sourceId,
    reminderType,
    timeWindow: dedupeWindow,
  });
  const label = entry.kind === 'task' ? 'Zadanie' : entry.kind === 'event' ? 'Wydarzenie' : 'Lead';
  const whenLabel = format(startsAtDate, 'd MMM, HH:mm', { locale: pl });
  const leadLabel = entry.leadName ? ` • ${entry.leadName}` : '';

  return {
    id: dedupeKey,
    key: dedupeKey,
    kind: entry.kind,
    title: entry.title,
    body: `${label}${leadLabel} • ${whenLabel}`,
    startsAt: entry.startsAt,
    sourceId: entry.sourceId,
    severity,
    minutesUntil,
    reminderType,
    dedupeWindow,
    link: entry.link || (entry.kind === 'lead' ? `/leads/${entry.sourceId}` : entry.kind === 'task' ? '/tasks' : '/calendar'),
    leadName: entry.leadName,
  };
}

export function buildRuntimeNotificationItems(bundle: CalendarBundle, now = new Date()) {
  const rangeStart = addMinutes(now, -120);
  const rangeEnd = addMinutes(now, 30);

  return combineScheduleEntries({
    events: bundle.events,
    tasks: bundle.tasks,
    leads: bundle.leads,
    rangeStart,
    rangeEnd,
  })
    .map((entry) => mapEntryToItem(entry, now))
    .filter((item): item is NotificationItem => Boolean(item))
    .filter((item) => item.minutesUntil >= -120 && item.minutesUntil <= 30)
    .filter((item) => !isNotificationSnoozedActive(item.key, now))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export function buildTodayNotificationItems(bundle: CalendarBundle, now = new Date()) {
  const rangeStart = startOfDay(now);
  const rangeEnd = endOfDay(now);

  return combineScheduleEntries({
    events: bundle.events,
    tasks: bundle.tasks,
    leads: bundle.leads,
    rangeStart,
    rangeEnd,
  })
    .map((entry) => mapEntryToItem(entry, now))
    .filter((item): item is NotificationItem => Boolean(item))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export function supportsBrowserNotifications() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!supportsBrowserNotifications()) return 'unsupported';
  return Notification.permission;
}

export function getBrowserNotificationsEnabled() {
  if (typeof window === 'undefined') return false;
  const raw = window.localStorage.getItem(BROWSER_PREF_KEY);
  return raw === null ? true : raw === 'true';
}

export function setBrowserNotificationsEnabled(value: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BROWSER_PREF_KEY, String(value));
}

export function getNotificationLog() {
  if (typeof window === 'undefined') return [] as NotificationLogItem[];

  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    if (!raw) return [] as NotificationLogItem[];
    const parsed = JSON.parse(raw) as NotificationLogItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as NotificationLogItem[];
  }
}

function saveNotificationLog(items: NotificationLogItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOG_KEY, JSON.stringify(items.slice(0, 100)));
}

export function hasDeliveredNotification(key: string) {
  return getNotificationLog().some((item) => item.key === key);
}

export function recordDeliveredNotification(item: NotificationItem, deliveryKey = getNotificationDeliveryKey(item.key)) {
  const existing = getNotificationLog();
  if (existing.some((entry) => entry.key === deliveryKey)) return;

  const next: NotificationLogItem[] = [
    {
      ...item,
      key: deliveryKey,
      deliveredAt: new Date().toISOString(),
      read: false,
    },
    ...existing,
  ];

  saveNotificationLog(next);
}

export function markAllNotificationsRead() {
  const updated = getNotificationLog().map((item) => ({ ...item, read: true }));
  saveNotificationLog(updated);
}

export function clearNotificationLog() {
  saveNotificationLog([]);
}

export function getUnreadNotificationCount() {
  return getNotificationLog().filter((item) => !item.read).length;
}
