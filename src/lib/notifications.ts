import { isClosedLeadStatus, normalizeEvent, normalizeLead, normalizeTask } from './record-normalizers';
import { getNearestPlannedActionForLead } from './lead-actions';

export type ReminderType =
  | 'task_overdue'
  | 'event_overdue'
  | 'task_due_soon'
  | 'event_due_soon'
  | 'today_task'
  | 'today_event'
  | 'lead_without_action';

export type ReminderPriority = 'low' | 'medium' | 'high';

export type ReminderSettings = {
  liveNotificationsEnabled: boolean;
  browserNotificationsEnabled: boolean;
  dailyDigestEmailEnabled: boolean;
  dailyDigestHour: string;
  defaultReminderLeadMinutes: number;
  defaultSnoozeMinutes: number;
  leadWithoutActionAlertsEnabled: boolean;
};

export type ReminderItem = {
  key: string;
  type: ReminderType;
  title: string;
  description: string;
  priority: ReminderPriority;
  dueAt: string | null;
  sourceId: string;
  sourceKind: 'task' | 'event' | 'lead';
  href: string;
};

export type ReminderLogEntry = ReminderItem & {
  firstShownAt: string;
  lastShownAt: string;
  shownCount: number;
  snoozedUntil: string | null;
  dismissedAt: string | null;
};

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  liveNotificationsEnabled: true,
  browserNotificationsEnabled: false,
  dailyDigestEmailEnabled: false,
  dailyDigestHour: '08:00',
  defaultReminderLeadMinutes: 30,
  defaultSnoozeMinutes: 60,
  leadWithoutActionAlertsEnabled: true,
};

const SETTINGS_KEY = 'closeflow.reminder.settings.v1';
const LOG_KEY = 'closeflow.reminder.log.v1';
const MAX_LOG_ENTRIES = 80;
const SHOW_REPEAT_WINDOW_MINUTES = 60;

function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadReminderSettings(userId = 'local'): ReminderSettings {
  const storage = getStorage();
  if (!storage) return DEFAULT_REMINDER_SETTINGS;
  const all = safeJsonParse<Record<string, Partial<ReminderSettings>>>(storage.getItem(SETTINGS_KEY), {});
  return { ...DEFAULT_REMINDER_SETTINGS, ...(all[userId] ?? {}) };
}

export function saveReminderSettings(settings: Partial<ReminderSettings>, userId = 'local'): ReminderSettings {
  const next = { ...loadReminderSettings(userId), ...settings };
  const storage = getStorage();
  if (!storage) return next;
  const all = safeJsonParse<Record<string, Partial<ReminderSettings>>>(storage.getItem(SETTINGS_KEY), {});
  all[userId] = next;
  storage.setItem(SETTINGS_KEY, JSON.stringify(all));
  return next;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return startOfLocalDay(a).getTime() === startOfLocalDay(b).getTime();
}

function parseMaybeDate(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function minutesUntil(value: string | null, now: Date): number | null {
  const parsed = parseMaybeDate(value);
  if (!parsed) return null;
  return Math.round((parsed.getTime() - now.getTime()) / 60000);
}

function taskReminderDate(rawTask: any): string | null {
  const task = normalizeTask(rawTask);
  return task.reminderAt ?? task.scheduledAt ?? task.dueAt ?? (task.date ? `${task.date}T09:00:00` : null);
}

function eventReminderDate(rawEvent: any): string | null {
  const event = normalizeEvent(rawEvent);
  return event.reminderAt ?? event.startAt;
}

export function buildReminderItems(input: {
  tasks?: any[];
  events?: any[];
  leads?: any[];
  now?: Date;
  settings?: ReminderSettings;
}): ReminderItem[] {
  const now = input.now ?? new Date();
  const settings = input.settings ?? DEFAULT_REMINDER_SETTINGS;
  const reminders: ReminderItem[] = [];

  for (const rawTask of input.tasks ?? []) {
    const task = normalizeTask(rawTask);
    if (task.status !== 'todo') continue;
    const dueAt = taskReminderDate(rawTask);
    const dueDate = parseMaybeDate(dueAt);
    if (!dueDate) continue;
    const min = minutesUntil(dueAt, now);
    const title = task.title;
    const href = task.leadId ? `/leads/${task.leadId}` : '/tasks';

    if (dueDate.getTime() < now.getTime() && !isSameLocalDay(dueDate, now)) {
      reminders.push({
        key: `task:${task.id}:overdue`,
        type: 'task_overdue',
        title: `Zaległe zadanie: ${title}`,
        description: 'Termin minął. Otwórz i zdecyduj: wykonane, przełóż albo usuń.',
        priority: 'high',
        dueAt,
        sourceId: task.id,
        sourceKind: 'task',
        href,
      });
    } else if (min !== null && min >= 0 && min <= settings.defaultReminderLeadMinutes) {
      reminders.push({
        key: `task:${task.id}:due_soon`,
        type: 'task_due_soon',
        title: `Zadanie za chwilę: ${title}`,
        description: `Termin w ciągu ${settings.defaultReminderLeadMinutes} minut.`,
        priority: 'high',
        dueAt,
        sourceId: task.id,
        sourceKind: 'task',
        href,
      });
    } else if (isSameLocalDay(dueDate, now)) {
      reminders.push({
        key: `task:${task.id}:today`,
        type: 'today_task',
        title: `Zadanie na dziś: ${title}`,
        description: 'Masz to zaplanowane na dzisiaj.',
        priority: 'medium',
        dueAt,
        sourceId: task.id,
        sourceKind: 'task',
        href,
      });
    }
  }

  for (const rawEvent of input.events ?? []) {
    const event = normalizeEvent(rawEvent);
    if (event.status !== 'scheduled') continue;
    const dueAt = eventReminderDate(rawEvent);
    const dueDate = parseMaybeDate(dueAt);
    if (!dueDate) continue;
    const min = minutesUntil(dueAt, now);
    const href = event.leadId ? `/leads/${event.leadId}` : '/calendar';

    if (dueDate.getTime() < now.getTime() && !isSameLocalDay(dueDate, now)) {
      reminders.push({
        key: `event:${event.id}:overdue`,
        type: 'event_overdue',
        title: `Zaległe wydarzenie: ${event.title}`,
        description: 'Wydarzenie minęło. Oznacz jako zakończone albo przełóż.',
        priority: 'high',
        dueAt,
        sourceId: event.id,
        sourceKind: 'event',
        href,
      });
    } else if (min !== null && min >= 0 && min <= settings.defaultReminderLeadMinutes) {
      reminders.push({
        key: `event:${event.id}:due_soon`,
        type: 'event_due_soon',
        title: `Wydarzenie za chwilę: ${event.title}`,
        description: `Start w ciągu ${settings.defaultReminderLeadMinutes} minut.`,
        priority: 'high',
        dueAt,
        sourceId: event.id,
        sourceKind: 'event',
        href,
      });
    } else if (isSameLocalDay(dueDate, now)) {
      reminders.push({
        key: `event:${event.id}:today`,
        type: 'today_event',
        title: `Wydarzenie dzisiaj: ${event.title}`,
        description: 'Masz to w dzisiejszym planie.',
        priority: 'medium',
        dueAt,
        sourceId: event.id,
        sourceKind: 'event',
        href,
      });
    }
  }

  if (settings.leadWithoutActionAlertsEnabled) {
    for (const rawLead of input.leads ?? []) {
      const lead = normalizeLead(rawLead);
      if (isClosedLeadStatus(lead.status)) continue;
      const action = getNearestPlannedActionForLead({ lead: rawLead, tasks: input.tasks ?? [], events: input.events ?? [] });
      if (action) continue;
      reminders.push({
        key: `lead:${lead.id}:without_action`,
        type: 'lead_without_action',
        title: `Lead bez zaplanowanej akcji: ${lead.name}`,
        description: 'Brak zadania lub wydarzenia. Ten kontakt może wypaść z procesu.',
        priority: lead.dealValue > 0 || lead.isAtRisk ? 'high' : 'medium',
        dueAt: null,
        sourceId: lead.id,
        sourceKind: 'lead',
        href: `/leads/${lead.id}`,
      });
    }
  }

  const order: Record<ReminderPriority, number> = { high: 0, medium: 1, low: 2 };
  return reminders.sort((a, b) => order[a.priority] - order[b.priority]);
}

function readLog(): ReminderLogEntry[] {
  const storage = getStorage();
  if (!storage) return [];
  return safeJsonParse<ReminderLogEntry[]>(storage.getItem(LOG_KEY), []);
}

function writeLog(entries: ReminderLogEntry[]): ReminderLogEntry[] {
  const storage = getStorage();
  const next = entries.slice(0, MAX_LOG_ENTRIES);
  if (storage) storage.setItem(LOG_KEY, JSON.stringify(next));
  return next;
}

export function listReminderLogs(): ReminderLogEntry[] {
  return readLog().sort((a, b) => new Date(b.lastShownAt).getTime() - new Date(a.lastShownAt).getTime());
}

export function getReminderLog(key: string): ReminderLogEntry | null {
  return readLog().find((entry) => entry.key === key) ?? null;
}

export function isReminderSuppressed(key: string, now = new Date()): boolean {
  const entry = getReminderLog(key);
  if (!entry) return false;
  if (entry.dismissedAt) return true;
  if (entry.snoozedUntil) {
    const snoozedUntil = new Date(entry.snoozedUntil);
    if (Number.isFinite(snoozedUntil.getTime()) && snoozedUntil.getTime() > now.getTime()) return true;
  }
  if (entry.lastShownAt) {
    const lastShownAt = new Date(entry.lastShownAt);
    if (Number.isFinite(lastShownAt.getTime())) {
      return now.getTime() - lastShownAt.getTime() < SHOW_REPEAT_WINDOW_MINUTES * 60000;
    }
  }
  return false;
}

export function markReminderShown(item: ReminderItem, now = new Date()): ReminderLogEntry {
  const nowIso = now.toISOString();
  const existing = readLog();
  const found = existing.find((entry) => entry.key === item.key);
  const entry: ReminderLogEntry = found
    ? { ...found, ...item, lastShownAt: nowIso, shownCount: found.shownCount + 1, dismissedAt: null }
    : { ...item, firstShownAt: nowIso, lastShownAt: nowIso, shownCount: 1, snoozedUntil: null, dismissedAt: null };
  const next = [entry, ...existing.filter((old) => old.key !== item.key)];
  writeLog(next);
  return entry;
}

export function snoozeReminder(key: string, minutes: number, now = new Date()): ReminderLogEntry | null {
  const existing = readLog();
  const found = existing.find((entry) => entry.key === key);
  if (!found) return null;
  const snoozedUntil = new Date(now.getTime() + minutes * 60000).toISOString();
  const entry = { ...found, snoozedUntil, dismissedAt: null, lastShownAt: now.toISOString() };
  writeLog([entry, ...existing.filter((old) => old.key !== key)]);
  return entry;
}

export function dismissReminder(key: string, now = new Date()): ReminderLogEntry | null {
  const existing = readLog();
  const found = existing.find((entry) => entry.key === key);
  if (!found) return null;
  const entry = { ...found, dismissedAt: now.toISOString(), lastShownAt: now.toISOString() };
  writeLog([entry, ...existing.filter((old) => old.key !== key)]);
  return entry;
}

export function clearReminderLog(): void {
  const storage = getStorage();
  if (storage) storage.removeItem(LOG_KEY);
}

export function getVisibleReminderItems(items: ReminderItem[], now = new Date()): ReminderItem[] {
  return items.filter((item) => !isReminderSuppressed(item.key, now));
}

export function getBrowserNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.requestPermission();
}

export function showBrowserNotification(item: ReminderItem): boolean {
  if (getBrowserNotificationPermission() !== 'granted') return false;
  try {
    const notification = new Notification(item.title, { body: item.description });
    notification.onclick = () => {
      window.focus();
      window.location.href = item.href;
    };
    return true;
  } catch {
    return false;
  }
}

// Backward-compatible wrappers kept for older imports that may still exist in a local repo
// after copying ZIP contents over an existing working tree. New code should use
// buildReminderItems/getVisibleReminderItems/markReminderShown directly.
export function supportsBrowserNotifications(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationsEnabled(userId = 'local'): boolean {
  return loadReminderSettings(userId).browserNotificationsEnabled;
}

export function buildRuntimeNotificationItems(input: {
  tasks?: any[];
  events?: any[];
  leads?: any[];
  now?: Date;
  settings?: ReminderSettings;
}): ReminderItem[] {
  return getVisibleReminderItems(buildReminderItems(input));
}

export function hasDeliveredNotification(keyOrItem: string | ReminderItem): boolean {
  const key = typeof keyOrItem === 'string' ? keyOrItem : keyOrItem.key;
  return Boolean(getReminderLog(key)?.lastShownAt);
}

export function recordDeliveredNotification(itemOrKey: ReminderItem | string, now = new Date()): ReminderLogEntry | null {
  if (typeof itemOrKey !== 'string') return markReminderShown(itemOrKey, now);
  const existing = getReminderLog(itemOrKey);
  if (!existing) return null;
  return markReminderShown(existing, now);
}
