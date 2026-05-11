/* PWA_STAGE13_MOBILE_SAFE_MODE
 * CLOSEFLOW_ASSET_CACHE_STALE_CHUNK_HOTFIX_2026_05_11
 * CloseFlow service worker no longer caches HTML shell or hashed Vite JS/CSS chunks.
 * Reason: after Vercel deploy, stale cached index/chunk maps can request deleted /assets/*.js or /assets/*.css and crash routes.
 * Business data, auth, API, portal, Supabase REST/storage/functions and tokenized URLs stay network-only.
 */
const CACHE_VERSION = 'closeflow-v2-asset-cache-hotfix-2026-05-11';

const STATIC_SAFE_URLS = [
  '/manifest.webmanifest',
  '/icons/closeflow-icon.svg',
  '/icons/closeflow-icon-192.png',
  '/icons/closeflow-icon-512.png',
  '/favicon.ico',
];

const PWA_NETWORK_ONLY_PREFIXES = [
  '/api',
  '/auth',
  '/supabase',
  '/storage',
  '/rest',
  '/functions',
  '/portal',
  '/client-portal',
  '/assets',
];

const BUSINESS_RUNTIME_PATHS = [
  '/',
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
  return url.origin === self.location.origin;
}

function startsWithAny(path, prefixes) {
  return prefixes.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
}

function containsAny(value, needles) {
  return needles.some((needle) => value.includes(needle));
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

function isApiOrDataRequest(request) {
  const url = getUrl(request);
  if (!url) return true;

  const path = url.pathname.toLowerCase();
  const full = (url.pathname + url.search).toLowerCase();

  return (
    hasSensitiveQueryOrHeaders(request, url) ||
    startsWithAny(path, PWA_NETWORK_ONLY_PREFIXES) ||
    containsAny(full, PWA_NETWORK_ONLY_CONTAINS) ||
    path.includes('/auth/') ||
    path.includes('/rest/v1/') ||
    path.includes('/storage/v1/') ||
    path.includes('/functions/v1/')
  );
}

function isBusinessRuntimePath(path) {
  return startsWithAny(path.toLowerCase(), BUSINESS_RUNTIME_PATHS);
}

function isStaticSafeAsset(request) {
  if (!isLocalGetRequest(request)) return false;
  if (isApiOrDataRequest(request)) return false;
  const url = getUrl(request);
  if (!url) return false;
  return STATIC_SAFE_URLS.includes(url.pathname);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(STATIC_SAFE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('closeflow-')).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (!isLocalGetRequest(request)) return;

  const url = getUrl(request);
  if (!url) return;
  const path = url.pathname.toLowerCase();

  if (request.mode === 'navigate') {
    if (isBusinessRuntimePath(path)) return;
    return;
  }

  if (!isStaticSafeAsset(request)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
