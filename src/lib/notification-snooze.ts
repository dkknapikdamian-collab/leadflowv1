const SNOOZE_KEY = 'closeflow:notifications:snoozed:v1';

export type NotificationSnoozeMode = '15m' | '1h' | 'tomorrow' | 'custom';
export type NotificationReminderType = 'overdue' | '30min' | 'today_morning' | 'ai_draft_review' | 'lead_no_action';

export type NotificationSnoozeEntry = {
  key: string;
  until: string;
  mode: NotificationSnoozeMode;
  createdAt: string;
};

export type NotificationDedupeInput = {
  recordType: string;
  recordId: string;
  reminderType: NotificationReminderType | string;
  timeWindow: string;
};

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function parseDate(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function readSnoozeMap(): Record<string, NotificationSnoozeEntry> {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(SNOOZE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, NotificationSnoozeEntry>;
  } catch {
    return {};
  }
}

function saveSnoozeMap(map: Record<string, NotificationSnoozeEntry>) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SNOOZE_KEY, JSON.stringify(map));
}

function pruneSnoozeMap(map: Record<string, NotificationSnoozeEntry>, now = new Date()) {
  const next: Record<string, NotificationSnoozeEntry> = {};
  for (const [key, entry] of Object.entries(map)) {
    const until = parseDate(entry?.until);
    if (!until) continue;
    if (until.getTime() > now.getTime()) {
      next[key] = entry;
    }
  }
  return next;
}

export function buildNotificationDedupeKey(input: NotificationDedupeInput) {
  const recordType = String(input.recordType || 'record').trim() || 'record';
  const recordId = String(input.recordId || 'unknown').trim() || 'unknown';
  const reminderType = String(input.reminderType || 'reminder').trim() || 'reminder';
  const timeWindow = String(input.timeWindow || 'window').trim() || 'window';
  return [recordType, recordId, reminderType, timeWindow].join(':');
}

export function resolveNotificationReminderType(minutesUntil: number, kind?: string): NotificationReminderType {
  if (kind === 'ai_draft') return 'ai_draft_review';
  if (kind === 'lead' && !Number.isFinite(minutesUntil)) return 'lead_no_action';
  if (minutesUntil < 0) return 'overdue';
  if (minutesUntil <= 30) return '30min';
  return 'today_morning';
}

export function buildNotificationReminderWindow(startsAt: string, reminderType: NotificationReminderType | string) {
  const parsed = parseDate(startsAt);
  if (!parsed) return 'unknown';

  if (reminderType === 'today_morning' || reminderType === 'ai_draft_review' || reminderType === 'lead_no_action') {
    return parsed.toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 16);
}

export function computeNotificationSnoozeUntil(mode: Exclude<NotificationSnoozeMode, 'custom'>, now = new Date()) {
  const next = new Date(now);

  if (mode === '15m') {
    next.setMinutes(next.getMinutes() + 15);
    return next.toISOString();
  }

  if (mode === '1h') {
    next.setHours(next.getHours() + 1);
    return next.toISOString();
  }

  next.setDate(next.getDate() + 1);
  next.setUTCHours(9, 0, 0, 0);
  return next.toISOString();
}

export function getNotificationSnoozes(now = new Date()) {
  const current = readSnoozeMap();
  const pruned = pruneSnoozeMap(current, now);
  if (Object.keys(current).length !== Object.keys(pruned).length) {
    saveSnoozeMap(pruned);
  }
  return pruned;
}

export function getNotificationSnoozedUntilByKey(now = new Date()) {
  const map = getNotificationSnoozes(now);
  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(map)) {
    result[key] = entry.until;
  }
  return result;
}

export function getNotificationSnooze(key: string) {
  const map = readSnoozeMap();
  return map[key] || null;
}

export function setNotificationSnooze(key: string, mode: NotificationSnoozeMode, now = new Date()) {
  const safeKey = String(key || '').trim();
  if (!safeKey) return null;

  if (mode === 'custom') return null;

  const entry: NotificationSnoozeEntry = {
    key: safeKey,
    until: computeNotificationSnoozeUntil(mode, now),
    mode,
    createdAt: now.toISOString(),
  };

  const map = readSnoozeMap();
  map[safeKey] = entry;
  saveSnoozeMap(map);
  return entry;
}

export function setNotificationSnoozeCustom(key: string, untilIso: string, now = new Date()) {
  const safeKey = String(key || '').trim();
  if (!safeKey) return null;
  const until = parseDate(untilIso);
  if (!until) return null;
  if (until.getTime() <= now.getTime()) return null;

  const entry: NotificationSnoozeEntry = {
    key: safeKey,
    until: until.toISOString(),
    mode: 'custom',
    createdAt: now.toISOString(),
  };

  const map = readSnoozeMap();
  map[safeKey] = entry;
  saveSnoozeMap(map);
  return entry;
}

export function clearNotificationSnooze(key: string) {
  const map = readSnoozeMap();
  delete map[key];
  saveSnoozeMap(map);
}

export function isNotificationSnoozedActive(key: string, now = new Date()) {
  const entry = getNotificationSnooze(key);
  const until = parseDate(entry?.until);
  return Boolean(until && until.getTime() > now.getTime());
}

export function getNotificationDeliveryKey(key: string, now = new Date()) {
  const entry = getNotificationSnooze(key);
  const until = parseDate(entry?.until);

  if (until && until.getTime() <= now.getTime()) {
    return key + ':after-snooze:' + entry.until;
  }

  return key;
}
