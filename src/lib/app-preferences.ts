export const CONFLICT_WARNINGS_STORAGE_KEY = 'closeflow:conflict-warnings-enabled';

export function getConflictWarningsEnabled() {
  if (typeof window === 'undefined') return true;
  const raw = window.localStorage.getItem(CONFLICT_WARNINGS_STORAGE_KEY);
  if (raw === null) return true;
  return raw !== '0';
}

export function setConflictWarningsEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONFLICT_WARNINGS_STORAGE_KEY, enabled ? '1' : '0');
}
