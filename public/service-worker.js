const CACHE_VERSION = 'closeflow-v1-pwa-stage30-2026-04-30';
const APP_SHELL_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icons/closeflow-icon.svg',
  '/favicon.ico',
];

function isLocalGetRequest(request) {
  if (request.method !== 'GET') return false;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;

  return true;
}

function isApiOrDataRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  return (
    path.startsWith('/api/') ||
    path.startsWith('/supabase/') ||
    path.startsWith('/firebase/') ||
    path.includes('/auth/') ||
    path.includes('/rest/v1/') ||
    path.includes('/storage/v1/') ||
    path.includes('/functions/v1/')
  );
}

function isCacheableAsset(request) {
  if (!isLocalGetRequest(request)) return false;
  if (isApiOrDataRequest(request)) return false;

  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  return (
    path === '/' ||
    path === '/manifest.webmanifest' ||
    path === '/favicon.ico' ||
    path === '/icons/closeflow-icon.svg' ||
    path.startsWith('/assets/')
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION && key.startsWith('closeflow-'))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (!isLocalGetRequest(request)) return;
  if (isApiOrDataRequest(request)) return;
  if (!isCacheableAsset(request)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put('/', copy));
          }
          return response;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
