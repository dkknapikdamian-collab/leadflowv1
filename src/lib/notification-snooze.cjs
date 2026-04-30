const SNOOZE_KEY = 'closeflow:notifications:snoozed:v1';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function parseDate(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function readSnoozeMap() {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(SNOOZE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveSnoozeMap(map) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SNOOZE_KEY, JSON.stringify(map));
}

function pruneSnoozeMap(map, now = new Date()) {
  const next = {};
  for (const [key, entry] of Object.entries(map)) {
    const until = parseDate(entry && entry.until);
    if (!until) continue;
    if (until.getTime() > now.getTime()) {
      next[key] = entry;
    }
  }
  return next;
}

function buildNotificationDedupeKey(input) {
  const recordType = String(input.recordType || 'record').trim() || 'record';
  const recordId = String(input.recordId || 'unknown').trim() || 'unknown';
  const reminderType = String(input.reminderType || 'reminder').trim() || 'reminder';
  const timeWindow = String(input.timeWindow || 'window').trim() || 'window';
  return [recordType, recordId, reminderType, timeWindow].join(':');
}

function resolveNotificationReminderType(minutesUntil, kind) {
  if (kind === 'ai_draft') return 'ai_draft_review';
  if (kind === 'lead' && !Number.isFinite(minutesUntil)) return 'lead_no_action';
  if (minutesUntil < 0) return 'overdue';
  if (minutesUntil <= 30) return '30min';
  return 'today_morning';
}

function buildNotificationReminderWindow(startsAt, reminderType) {
  const parsed = parseDate(startsAt);
  if (!parsed) return 'unknown';

  if (reminderType === 'today_morning' || reminderType === 'ai_draft_review' || reminderType === 'lead_no_action') {
    return parsed.toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 16);
}

function computeNotificationSnoozeUntil(mode, now = new Date()) {
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

function getNotificationSnoozes(now = new Date()) {
  const current = readSnoozeMap();
  const pruned = pruneSnoozeMap(current, now);
  if (Object.keys(current).length !== Object.keys(pruned).length) {
    saveSnoozeMap(pruned);
  }
  return pruned;
}

function getNotificationSnoozedUntilByKey(now = new Date()) {
  const map = getNotificationSnoozes(now);
  const result = {};
  for (const [key, entry] of Object.entries(map)) {
    result[key] = entry.until;
  }
  return result;
}

function getNotificationSnooze(key) {
  const map = readSnoozeMap();
  return map[key] || null;
}

function setNotificationSnooze(key, mode, now = new Date()) {
  const safeKey = String(key || '').trim();
  if (!safeKey) return null;

  const entry = {
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

function clearNotificationSnooze(key) {
  const map = readSnoozeMap();
  delete map[key];
  saveSnoozeMap(map);
}

function isNotificationSnoozedActive(key, now = new Date()) {
  const entry = getNotificationSnooze(key);
  const until = parseDate(entry && entry.until);
  return Boolean(until && until.getTime() > now.getTime());
}

function getNotificationDeliveryKey(key, now = new Date()) {
  const entry = getNotificationSnooze(key);
  const until = parseDate(entry && entry.until);

  if (until && until.getTime() <= now.getTime()) {
    return key + ':after-snooze:' + entry.until;
  }

  return key;
}

module.exports = {
  SNOOZE_KEY,
  buildNotificationDedupeKey,
  resolveNotificationReminderType,
  buildNotificationReminderWindow,
  computeNotificationSnoozeUntil,
  getNotificationSnoozes,
  getNotificationSnoozedUntilByKey,
  getNotificationSnooze,
  setNotificationSnooze,
  clearNotificationSnooze,
  isNotificationSnoozedActive,
  getNotificationDeliveryKey,
};
