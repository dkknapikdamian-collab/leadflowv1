export const STAGE223R3_LAST_CONTACT_INTAKE = 'lead/client create forms store explicit lastContactAt so silence badges do not use createdAt as contact truth';
export const LAST_CONTACT_FUTURE_ERROR = 'Ostatni kontakt nie może być w przyszłości.';

export function getTodayDateInputValue(now: Date = new Date()) {
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function normalizeDateInputValue(value: unknown) {
  const raw = String(value ?? '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : '';
}

export function dateInputToNoonIso(value: unknown) {
  const normalized = normalizeDateInputValue(value);
  if (!normalized) return null;
  const parsed = new Date(`${normalized}T12:00:00`);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

export function isFutureDateInput(value: unknown, now: Date = new Date()) {
  const normalized = normalizeDateInputValue(value);
  if (!normalized) return false;
  return normalized > getTodayDateInputValue(now);
}

export function getLastContactDateInputError(value: unknown, now: Date = new Date()) {
  return isFutureDateInput(value, now) ? LAST_CONTACT_FUTURE_ERROR : null;
}

export function getDefaultLastContactDateInput(now: Date = new Date()) {
  return getTodayDateInputValue(now);
}
