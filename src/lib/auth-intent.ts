
export type CloseFlowAuthIntent = 'login' | 'register';
export type CloseFlowAuthNotice = 'register_first_required';

const AUTH_INTENT_SESSION_KEY = 'closeflow:auth-intent';
const AUTH_NOTICE_SESSION_KEY = 'closeflow:auth-notice';
const AUTH_INTENT_QUERY_KEYS = ['authIntent', 'closeflowAuthIntent'];

function canUseSessionStorage() {
  return typeof window !== 'undefined' && Boolean(window.sessionStorage);
}

function canUseBrowserLocation() {
  return typeof window !== 'undefined' && Boolean(window.location);
}

export function normalizeCloseFlowAuthIntent(value: unknown): CloseFlowAuthIntent | null {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'login' || normalized === 'register' ? normalized : null;
}

export function getCloseFlowAuthIntentFromUrl(): CloseFlowAuthIntent | null {
  if (!canUseBrowserLocation()) return null;

  try {
    const params = new URLSearchParams(window.location.search || '');
    for (const key of AUTH_INTENT_QUERY_KEYS) {
      const intent = normalizeCloseFlowAuthIntent(params.get(key));
      if (intent) return intent;
    }
  } catch {
    return null;
  }

  return null;
}

function clearCloseFlowAuthIntentFromUrl() {
  if (!canUseBrowserLocation() || !window.history?.replaceState) return;

  try {
    const url = new URL(window.location.href);
    let changed = false;
    for (const key of AUTH_INTENT_QUERY_KEYS) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }
    if (changed) {
      const nextPath = url.pathname + (url.search ? url.search : '') + (url.hash || '');
      window.history.replaceState(window.history.state, '', nextPath);
    }
  } catch {
    // URL cleanup must never break auth flow.
  }
}

export function setCloseFlowAuthIntent(intent: CloseFlowAuthIntent) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(AUTH_INTENT_SESSION_KEY, intent);
}

export function getCloseFlowAuthIntent(): CloseFlowAuthIntent | null {
  const urlIntent = getCloseFlowAuthIntentFromUrl();
  if (urlIntent) {
    setCloseFlowAuthIntent(urlIntent);
    return urlIntent;
  }

  if (!canUseSessionStorage()) return null;
  return normalizeCloseFlowAuthIntent(window.sessionStorage.getItem(AUTH_INTENT_SESSION_KEY));
}

export function clearCloseFlowAuthIntent() {
  if (canUseSessionStorage()) {
    window.sessionStorage.removeItem(AUTH_INTENT_SESSION_KEY);
  }
  clearCloseFlowAuthIntentFromUrl();
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
