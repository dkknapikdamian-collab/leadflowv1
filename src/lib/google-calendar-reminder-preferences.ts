export type GoogleCalendarReminderPreferenceMethod = 'default' | 'popup' | 'email' | 'popup_email';

export type GoogleCalendarReminderPreference = {
  method: GoogleCalendarReminderPreferenceMethod;
  minutesBefore: number;
};

export const GOOGLE_CALENDAR_REMINDER_METHOD_STORAGE_KEY = 'closeflow:google-calendar:reminder-method:v1';
export const GOOGLE_CALENDAR_REMINDER_MINUTES_STORAGE_KEY = 'closeflow:google-calendar:reminder-minutes:v1';

const VALID_METHODS = new Set(['default', 'popup', 'email', 'popup_email']);

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function normalizeGoogleCalendarReminderMethod(value: unknown): GoogleCalendarReminderPreferenceMethod {
  const raw = String(value || '').trim().toLowerCase();
  if (VALID_METHODS.has(raw)) return raw as GoogleCalendarReminderPreferenceMethod;
  return 'popup';
}

export function normalizeGoogleCalendarReminderMinutes(value: unknown) {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? Number(value)
      : Number.NaN;
  if (!Number.isFinite(parsed)) return 30;
  return Math.max(0, Math.min(40320, Math.round(parsed)));
}

// GOOGLE_CALENDAR_SYNC_V1_STAGE06_REMINDER_METHOD_UI
export function getGoogleCalendarReminderPreference(): GoogleCalendarReminderPreference {
  if (!canUseBrowserStorage()) return { method: 'popup', minutesBefore: 30 };

  return {
    method: normalizeGoogleCalendarReminderMethod(window.localStorage.getItem(GOOGLE_CALENDAR_REMINDER_METHOD_STORAGE_KEY)),
    minutesBefore: normalizeGoogleCalendarReminderMinutes(window.localStorage.getItem(GOOGLE_CALENDAR_REMINDER_MINUTES_STORAGE_KEY)),
  };
}

export function setGoogleCalendarReminderPreference(input: Partial<GoogleCalendarReminderPreference>) {
  if (!canUseBrowserStorage()) return;

  const current = getGoogleCalendarReminderPreference();
  const method = normalizeGoogleCalendarReminderMethod(input.method || current.method);
  const minutesBefore = normalizeGoogleCalendarReminderMinutes(input.minutesBefore ?? current.minutesBefore);

  window.localStorage.setItem(GOOGLE_CALENDAR_REMINDER_METHOD_STORAGE_KEY, method);
  window.localStorage.setItem(GOOGLE_CALENDAR_REMINDER_MINUTES_STORAGE_KEY, String(minutesBefore));
}

export function applyGoogleCalendarReminderPreferenceToEventPayload<T extends Record<string, unknown>>(input: T): T {
  const preference = getGoogleCalendarReminderPreference();
  const existingMethod = input.googleCalendarReminderMethod || input.google_calendar_reminder_method;
  const existingMinutes = input.googleCalendarReminderMinutesBefore || input.google_calendar_reminder_minutes_before;

  return {
    ...input,
    googleCalendarReminderMethod: existingMethod || preference.method,
    googleCalendarReminderMinutesBefore: existingMinutes ?? preference.minutesBefore,
  };
}
