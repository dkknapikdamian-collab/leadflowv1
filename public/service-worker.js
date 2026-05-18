/* STAGE122_RUNTIME_AUTH_API_PWA_HARDENING
 * Runtime-safe service worker: no HTML shell cache, no Vite /assets cache,
 * no API/auth/data interception. It exists only to replace and retire older
 * CloseFlow workers while preserving browser auth data and Supabase sessions.
 */
const STAGE122_RUNTIME_AUTH_API_PWA_HARDENING = 'STAGE122_RUNTIME_AUTH_API_PWA_HARDENING';
const CACHE_VERSION = 'closeflow-stage122-network-only-2026-05-18';

async function clearCloseFlowCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key.startsWith('closeflow-')).map((key) => caches.delete(key)));
}

function getRequestUrl(request) {
  try {
    return new URL(request.url);
  } catch {
    return null;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clearCloseFlowCaches().then(() => self.clients.claim()));
});

self.addEventListener('message', (event) => {
  const type = event && event.data ? event.data.type : '';
  if (type === 'SKIP_WAITING') self.skipWaiting();
  if (type === 'CLEAR_CLOSEFLOW_CACHES') event.waitUntil(clearCloseFlowCaches());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = getRequestUrl(request);
  if (!url) return;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/supabase/')) return;

  // Network-only runtime pass-through for every request.
  void STAGE122_RUNTIME_AUTH_API_PWA_HARDENING;
  void CACHE_VERSION;
});
