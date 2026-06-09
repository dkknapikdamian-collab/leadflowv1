
export type CloseFlowAuthIntent = 'login' | 'register';
export type CloseFlowAuthNotice = 'register_first_required';

const AUTH_INTENT_SESSION_KEY = 'closeflow:auth-intent';
const AUTH_NOTICE_SESSION_KEY = 'closeflow:auth-notice';

function canUseSessionStorage() {
  return typeof window !== 'undefined' && Boolean(window.sessionStorage);
}

export function normalizeCloseFlowAuthIntent(value: unknown): CloseFlowAuthIntent | null {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'login' || normalized === 'register' ? normalized : null;
}

export function setCloseFlowAuthIntent(intent: CloseFlowAuthIntent) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(AUTH_INTENT_SESSION_KEY, intent);
}

export function getCloseFlowAuthIntent(): CloseFlowAuthIntent | null {
  if (!canUseSessionStorage()) return null;
  return normalizeCloseFlowAuthIntent(window.sessionStorage.getItem(AUTH_INTENT_SESSION_KEY));
}

export function clearCloseFlowAuthIntent() {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(AUTH_INTENT_SESSION_KEY);
}

export function setCloseFlowAuthNotice(notice: CloseFlowAuthNotice) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(AUTH_NOTICE_SESSION_KEY, notice);
}

export function consumeCloseFlowAuthNotice(): CloseFlowAuthNotice | null {
  if (!canUseSessionStorage()) return null;
  const raw = window.sessionStorage.getItem(AUTH_NOTICE_SESSION_KEY);
  window.sessionStorage.removeItem(AUTH_NOTICE_SESSION_KEY);
  return raw === 'register_first_required' ? raw : null;
}
