/* PWA_STAGE13_MOBILE_SAFE_MODE
 * CloseFlow service worker caches only app shell and static assets.
 * Business data, auth, API, portal, Supabase REST/storage/functions and tokenized URLs stay network-only.
 */
const CACHE_VERSION = 'closeflow-v1-pwa-stage13-mobile-safe-2026-05-06';

const APP_SHELL_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icons/closeflow-icon.svg',
  '/icons/closeflow-icon-192.png',
  '/icons/closeflow-icon-512.png',
  '/favicon.ico',
];

// PWA_NETWORK_ONLY_PREFIXES: nothing below these paths may be cached by the service worker.
const PWA_NETWORK_ONLY_PREFIXES = [
  '/api',
  '/auth',
  '/supabase',
  '/storage',
  '/rest',
  '/functions',
  '/portal',
  '/client-portal',
];

// BUSINESS_RUNTIME_PATHS: authenticated app screens are never treated as offline data cache.
const BUSINESS_RUNTIME_PATHS = [
  '/leads',
  '/tasks',
  '/calendar',
  '/cases',
  '/case',
  '/clients',
  '/activity',
  '/ai-drafts',
  '/notifications',
  '/billing',
  '/settings',
  '/help',
  '/support',
];

// PWA_AUTH_STORAGE_MARKERS: external provider paths and Supabase-style endpoints stay network-only.
const PWA_NETWORK_ONLY_CONTAINS = [
  '/auth/v1/',
  '/rest/v1/',
  '/storage/v1/',
  '/functions/v1/',
  '/oauth',
  '/callback',
  '/google-calendar',
  '/billing',
  '/assistant',
  '/workspace',
];

// PWA_SECRET_QUERY_KEYS: URLs carrying auth, workspace or portal material must never enter Cache Storage.
const PWA_SECRET_QUERY_KEYS = [
  'access_token',
  'refresh_token',
  'id_token',
  'code',
  'state',
  'token',
  'workspace',
  'workspaceId',
  'workspace_id',
  'portalToken',
  'caseToken',
];

function getUrl(request) {
  try {
    return new URL(request.url);
  } catch {
    return null;
  }
}

function isLocalGetRequest(request) {
  if (request.method !== 'GET') return false;

  const url = getUrl(request);
  if (!url) return false;
  if (url.origin !== self.location.origin) return false;

  return true;
}

function hasSensitiveQueryOrHeaders(request, url) {
  for (const key of PWA_SECRET_QUERY_KEYS) {
    if (url.searchParams.has(key)) return true;
  }

  return (
    request.headers.has('authorization') ||
    request.headers.has('x-supabase-auth') ||
    request.headers.has('x-closeflow-workspace') ||
    request.headers.has('x-portal-token')
  );
}

function startsWithAny(path, prefixes) {
  return prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function containsAny(value, needles) {
  return needles.some((needle) => value.includes(needle));
}

// P13_API_NETWORK_ONLY: API, auth, REST and storage requests are never cached by the PWA service worker.
function isApiOrDataRequest(request) {
  const url = getUrl(request);
  if (!url) return true;

  const path = url.pathname.toLowerCase();
  const full = `${url.pathname}${url.search}`.toLowerCase();
  const legacyApiPathCompat = url.pathname.startsWith('/api/');
  const legacySupabasePathCompat = url.pathname.startsWith('/supabase/');

  return (
    hasSensitiveQueryOrHeaders(request, url) ||
    legacyApiPathCompat ||
    legacySupabasePathCompat ||
    startsWithAny(path, PWA_NETWORK_ONLY_PREFIXES) ||
    containsAny(full, PWA_NETWORK_ONLY_CONTAINS) ||
    path.startsWith('/api/') ||
    path.startsWith('/api') ||
    path.startsWith('/supabase/') ||
    path.startsWith('/storage/') ||
    path.startsWith('/auth/') ||
    path.includes('/auth/') ||
    path.includes('/rest/v1/') ||
    path.includes('/storage/v1/') ||
    path.includes('/functions/v1/')
  );
}

function isBusinessRuntimePath(path) {
  return startsWithAny(path.toLowerCase(), BUSINESS_RUNTIME_PATHS);
}

function isCacheableAsset(request) {
  if (!isLocalGetRequest(request)) return false;
  if (isApiOrDataRequest(request)) return false;

  const url = getUrl(request);
  if (!url) return false;

  const path = url.pathname.toLowerCase();

  if (request.mode === 'navigate') {
    return path === '/' && !url.searchParams.has('token');
  }

  return (
    path === '/manifest.webmanifest' ||
    path === '/favicon.ico' ||
    path === '/icons/closeflow-icon.svg' ||
    path === '/icons/closeflow-icon-192.png' ||
    path === '/icons/closeflow-icon-512.png' ||
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

  const url = getUrl(request);
  if (!url) return;

  const path = url.pathname.toLowerCase();

  if (request.mode === 'navigate') {
    if (isBusinessRuntimePath(path) || path !== '/') return;

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

  if (!isCacheableAsset(request)) return;

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
