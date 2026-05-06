import type { CalendarBundle } from './calendar-items';
import type { NotificationItem } from './notifications';

const REMINDER_SETTINGS_KEY = 'closeflow:reminders:settings:v1';

export type ReminderSettings = {
  browserNotificationsEnabled: boolean;
  liveNotificationsEnabled: boolean;
  dailyDigestEnabled: boolean;
  defaultReminderMinutes: number;
  defaultSnoozeMinutes: number;
};

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  browserNotificationsEnabled: true,
  liveNotificationsEnabled: true,
  dailyDigestEnabled: true,
  defaultReminderMinutes: 30,
  defaultSnoozeMinutes: 15,
};

function asObject(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asBool(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function getReminderSettings(): ReminderSettings {
  if (!canUseStorage()) return { ...DEFAULT_REMINDER_SETTINGS };

  try {
    const raw = window.localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_REMINDER_SETTINGS };
    const parsed = asObject(JSON.parse(raw));

    return {
      browserNotificationsEnabled: asBool(parsed.browserNotificationsEnabled, DEFAULT_REMINDER_SETTINGS.browserNotificationsEnabled),
      liveNotificationsEnabled: asBool(parsed.liveNotificationsEnabled, DEFAULT_REMINDER_SETTINGS.liveNotificationsEnabled),
      dailyDigestEnabled: asBool(parsed.dailyDigestEnabled, DEFAULT_REMINDER_SETTINGS.dailyDigestEnabled),
      defaultReminderMinutes: Math.max(0, Math.min(24 * 60, asNumber(parsed.defaultReminderMinutes, DEFAULT_REMINDER_SETTINGS.defaultReminderMinutes))),
      defaultSnoozeMinutes: Math.max(5, Math.min(7 * 24 * 60, asNumber(parsed.defaultSnoozeMinutes, DEFAULT_REMINDER_SETTINGS.defaultSnoozeMinutes))),
    };
  } catch {
    return { ...DEFAULT_REMINDER_SETTINGS };
  }
}

export function setReminderSettings(patch: Partial<ReminderSettings>) {
  const next = { ...getReminderSettings(), ...patch };
  if (!canUseStorage()) return next;
  window.localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(next));
  return next;
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseDate(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function itemForNoAction(kind: 'lead' | 'case', id: string, title: string, link: string): NotificationItem {
  return {
    id: `no_action:${kind}:${id}`,
    key: `no_action:${kind}:${id}`,
    kind: kind === 'case' ? 'event' : 'lead',
    title,
    body: kind === 'case' ? 'Sprawa bez zaplanowanej akcji.' : 'Lead bez zaplanowanej akcji.',
    startsAt: new Date().toISOString(),
    sourceId: id,
    severity: 'soon',
    minutesUntil: 0,
    reminderType: 'lead_no_action',
    dedupeWindow: new Date().toISOString().slice(0, 10),
    link,
    leadName: kind === 'lead' ? title : null,
  };
}

export function buildAdditionalReminderItems({
  bundle,
  pendingDraftCount,
  now = new Date(),
}: {
  bundle: CalendarBundle;
  pendingDraftCount: number;
  now?: Date;
}): NotificationItem[] {
  const items: NotificationItem[] = [];

  if (pendingDraftCount > 0) {
    items.push({
      id: 'ai_drafts:pending_review',
      key: `ai_drafts:pending_review:${now.toISOString().slice(0, 10)}`,
      kind: 'lead',
      title: 'Szkice do sprawdzenia',
      body: `Masz ${pendingDraftCount} szkiców do sprawdzenia.`,
      startsAt: now.toISOString(),
      sourceId: 'ai_drafts',
      severity: 'soon',
      minutesUntil: 0,
      reminderType: 'ai_draft_review',
      dedupeWindow: now.toISOString().slice(0, 10),
      link: '/ai-drafts',
      leadName: null,
    });
  }

  const noActionLeads = (bundle.leads || []).filter((lead) => {
    const nextAction = asText((lead as any).nextActionAt || (lead as any).next_action_at || (lead as any).nearestActionAt || (lead as any).nearest_action_at);
    const status = asText((lead as any).status).toLowerCase();
    return !nextAction && !['won', 'lost', 'archived', 'moved_to_service', 'in_service'].includes(status);
  }).slice(0, 4);

  for (const lead of noActionLeads) {
    const id = asText((lead as any).id);
    if (!id) continue;
    const title = asText((lead as any).name || (lead as any).title || (lead as any).company) || 'Lead bez nazwy';
    items.push(itemForNoAction('lead', id, title, `/leads/${id}`));
  }

  const noActionCases = (bundle.cases || []).filter((caseItem) => {
    const nextAction = asText((caseItem as any).nextActionAt || (caseItem as any).next_action_at || (caseItem as any).nearestActionAt || (caseItem as any).nearest_action_at);
    const status = asText((caseItem as any).status).toLowerCase();
    return !nextAction && !['done', 'completed', 'closed', 'archived'].includes(status);
  }).slice(0, 4);

  for (const caseItem of noActionCases) {
    const id = asText((caseItem as any).id);
    if (!id) continue;
    const title = asText((caseItem as any).title || (caseItem as any).name) || 'Sprawa bez nazwy';
    items.push(itemForNoAction('case', id, title, `/case/${id}`));
  }

  return items;
}

export function buildReminderCustomDate(input: string) {
  const parsed = parseDate(input);
  return parsed ? parsed.toISOString() : null;
}
