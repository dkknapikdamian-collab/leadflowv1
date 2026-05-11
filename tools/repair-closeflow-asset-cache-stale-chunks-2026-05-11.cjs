const fs = require('fs');
const path = require('path');

const HOTFIX_GUARD = 'CLOSEFLOW_ASSET_CACHE_STALE_CHUNK_HOTFIX_2026_05_11';

function repoPath(...parts) {
  return path.join(process.cwd(), ...parts);
}

function read(file) {
  return fs.readFileSync(repoPath(file), 'utf8');
}

function write(file, content) {
  const full = repoPath(file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

function exists(file) {
  return fs.existsSync(repoPath(file));
}

function backupFiles(files) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = repoPath('.closeflow-recovery-backups', `asset-cache-stale-chunks-${stamp}`);
  fs.mkdirSync(backupDir, { recursive: true });
  for (const file of files) {
    if (!exists(file)) continue;
    const target = path.join(backupDir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(repoPath(file), target);
  }
  return path.relative(process.cwd(), backupDir);
}

function upsertPackageScript() {
  const pkgPath = 'package.json';
  const pkg = JSON.parse(read(pkgPath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:hotfix-asset-cache-stale-chunks'] = 'node scripts/check-hotfix-asset-cache-stale-chunks.cjs';
  write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function patchMain() {
  const file = 'src/main.tsx';
  let src = read(file);
  if (!src.includes("./pwa/chunk-asset-reload-guard")) {
    src = src.replace(
      "import { registerCloseFlowServiceWorker } from './pwa/register-service-worker';",
      "import { registerCloseFlowServiceWorker } from './pwa/register-service-worker';\nimport { registerChunkAssetReloadGuard } from './pwa/chunk-asset-reload-guard';"
    );
  }
  if (!src.includes('registerChunkAssetReloadGuard();')) {
    src = src.replace('registerCloseFlowServiceWorker();', 'registerChunkAssetReloadGuard();\nregisterCloseFlowServiceWorker();');
  }
  write(file, src);
}

function writeChunkGuard() {
  write('src/pwa/chunk-asset-reload-guard.ts', `const ${HOTFIX_GUARD} = '${HOTFIX_GUARD}';\nvoid ${HOTFIX_GUARD};\n\nconst CHUNK_RELOAD_MARKER = 'closeflow:asset-cache-stale-chunk-reloaded:v1';\nconst CHUNK_RELOAD_REASON = 'closeflow:asset-cache-stale-chunk-reason:v1';\n\nfunction getErrorMessage(error: unknown) {\n  if (!error) return '';\n  if (error instanceof Error) return error.message || String(error);\n  if (typeof error === 'object' && error && 'message' in error) {\n    return String((error as { message?: unknown }).message || '');\n  }\n  return String(error);\n}\n\nexport function isChunkAssetLoadError(error: unknown) {\n  const message = getErrorMessage(error);\n  return /Unable to preload CSS|Failed to fetch dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk [^ ]+ failed|Failed to load module script|\\/assets\\/[^ ]+\\.(js|css)/i.test(message);\n}\n\nasync function clearCloseFlowRuntimeCaches() {\n  if (typeof window === 'undefined') return;\n\n  try {\n    if ('caches' in window) {\n      const keys = await window.caches.keys();\n      await Promise.all(keys.filter((key) => key.startsWith('closeflow-')).map((key) => window.caches.delete(key)));\n    }\n  } catch (error) {\n    console.warn('CloseFlow stale asset cache cleanup skipped.', error);\n  }\n\n  try {\n    if ('serviceWorker' in navigator) {\n      const registrations = await navigator.serviceWorker.getRegistrations();\n      await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));\n    }\n  } catch (error) {\n    console.warn('CloseFlow service worker update check skipped.', error);\n  }\n}\n\nexport function reloadOnceForChunkAssetFailure(error: unknown, source = 'unknown') {\n  if (typeof window === 'undefined') return false;\n  if (!isChunkAssetLoadError(error)) return false;\n\n  try {\n    const marker = window.sessionStorage.getItem(CHUNK_RELOAD_MARKER);\n    if (marker === '1') return false;\n    window.sessionStorage.setItem(CHUNK_RELOAD_MARKER, '1');\n    window.sessionStorage.setItem(CHUNK_RELOAD_REASON, source);\n  } catch {\n    // If sessionStorage is unavailable, still try a single hard reload in this runtime tick.\n  }\n\n  clearCloseFlowRuntimeCaches().finally(() => {\n    window.location.reload();\n  });\n\n  return true;\n}\n\nexport function registerChunkAssetReloadGuard() {\n  if (typeof window === 'undefined') return;\n\n  window.addEventListener('vite:preloadError', (event) => {\n    event.preventDefault();\n    reloadOnceForChunkAssetFailure((event as CustomEvent).payload || event, 'vite-preload-error');\n  });\n\n  window.addEventListener('unhandledrejection', (event) => {\n    if (reloadOnceForChunkAssetFailure(event.reason, 'unhandledrejection')) {\n      event.preventDefault();\n    }\n  });\n\n  window.addEventListener(\n    'error',\n    (event) => {\n      const target = event.target as HTMLElement | null;\n      const assetUrl =\n        target && ('src' in target || 'href' in target)\n          ? String((target as HTMLScriptElement | HTMLLinkElement).src || (target as HTMLLinkElement).href || '')\n          : '';\n\n      if (assetUrl.includes('/assets/') && /\\.(js|css)(\\?|$)/i.test(assetUrl)) {\n        reloadOnceForChunkAssetFailure(new Error(\`Failed to load runtime asset: \${assetUrl}\`), 'asset-error-event');\n      }\n    },\n    true,\n  );\n}\n`);
}

function patchErrorBoundary() {
  const file = 'src/components/ErrorBoundary.tsx';
  let src = read(file);
  if (!src.includes("../pwa/chunk-asset-reload-guard")) {
    src = src.replace(
      "import React, { Component, ErrorInfo, ReactNode } from 'react';",
      "import React, { Component, ErrorInfo, ReactNode } from 'react';\nimport { reloadOnceForChunkAssetFailure } from '../pwa/chunk-asset-reload-guard';"
    );
  }
  if (!src.includes("reloadOnceForChunkAssetFailure(error, 'react-error-boundary')")) {
    src = src.replace(
      '    console.error("Uncaught error:", error, errorInfo);',
      '    console.error("Uncaught error:", error, errorInfo);\n    reloadOnceForChunkAssetFailure(error, \'react-error-boundary\');'
    );
  }
  write(file, src);
}

function writeServiceWorker() {
  write('public/service-worker.js', `/* PWA_STAGE13_MOBILE_SAFE_MODE\n * ${HOTFIX_GUARD}\n * CloseFlow service worker no longer caches HTML shell or hashed Vite JS/CSS chunks.\n * Reason: after Vercel deploy, stale cached index/chunk maps can request deleted /assets/*.js or /assets/*.css and crash routes.\n * Business data, auth, API, portal, Supabase REST/storage/functions and tokenized URLs stay network-only.\n */\nconst CACHE_VERSION = 'closeflow-v2-asset-cache-hotfix-2026-05-11';\n\nconst STATIC_SAFE_URLS = [\n  '/manifest.webmanifest',\n  '/icons/closeflow-icon.svg',\n  '/icons/closeflow-icon-192.png',\n  '/icons/closeflow-icon-512.png',\n  '/favicon.ico',\n];\n\nconst PWA_NETWORK_ONLY_PREFIXES = [\n  '/api',\n  '/auth',\n  '/supabase',\n  '/storage',\n  '/rest',\n  '/functions',\n  '/portal',\n  '/client-portal',\n  '/assets',\n];\n\nconst BUSINESS_RUNTIME_PATHS = [\n  '/',\n  '/leads',\n  '/tasks',\n  '/calendar',\n  '/cases',\n  '/case',\n  '/clients',\n  '/activity',\n  '/ai-drafts',\n  '/notifications',\n  '/billing',\n  '/settings',\n  '/help',\n  '/support',\n];\n\nconst PWA_NETWORK_ONLY_CONTAINS = [\n  '/auth/v1/',\n  '/rest/v1/',\n  '/storage/v1/',\n  '/functions/v1/',\n  '/oauth',\n  '/callback',\n  '/google-calendar',\n  '/billing',\n  '/assistant',\n  '/workspace',\n];\n\nconst PWA_SECRET_QUERY_KEYS = [\n  'access_token',\n  'refresh_token',\n  'id_token',\n  'code',\n  'state',\n  'token',\n  'workspace',\n  'workspaceId',\n  'workspace_id',\n  'portalToken',\n  'caseToken',\n];\n\nfunction getUrl(request) {\n  try {\n    return new URL(request.url);\n  } catch {\n    return null;\n  }\n}\n\nfunction isLocalGetRequest(request) {\n  if (request.method !== 'GET') return false;\n  const url = getUrl(request);\n  if (!url) return false;\n  return url.origin === self.location.origin;\n}\n\nfunction startsWithAny(path, prefixes) {\n  return prefixes.some((prefix) => path === prefix || path.startsWith(prefix + '/'));\n}\n\nfunction containsAny(value, needles) {\n  return needles.some((needle) => value.includes(needle));\n}\n\nfunction hasSensitiveQueryOrHeaders(request, url) {\n  for (const key of PWA_SECRET_QUERY_KEYS) {\n    if (url.searchParams.has(key)) return true;\n  }\n\n  return (\n    request.headers.has('authorization') ||\n    request.headers.has('x-supabase-auth') ||\n    request.headers.has('x-closeflow-workspace') ||\n    request.headers.has('x-portal-token')\n  );\n}\n\nfunction isApiOrDataRequest(request) {\n  const url = getUrl(request);\n  if (!url) return true;\n\n  const path = url.pathname.toLowerCase();\n  const full = (url.pathname + url.search).toLowerCase();\n\n  return (\n    hasSensitiveQueryOrHeaders(request, url) ||\n    startsWithAny(path, PWA_NETWORK_ONLY_PREFIXES) ||\n    containsAny(full, PWA_NETWORK_ONLY_CONTAINS) ||\n    path.includes('/auth/') ||\n    path.includes('/rest/v1/') ||\n    path.includes('/storage/v1/') ||\n    path.includes('/functions/v1/')\n  );\n}\n\nfunction isBusinessRuntimePath(path) {\n  return startsWithAny(path.toLowerCase(), BUSINESS_RUNTIME_PATHS);\n}\n\nfunction isStaticSafeAsset(request) {\n  if (!isLocalGetRequest(request)) return false;\n  if (isApiOrDataRequest(request)) return false;\n  const url = getUrl(request);\n  if (!url) return false;\n  return STATIC_SAFE_URLS.includes(url.pathname);\n}\n\nself.addEventListener('install', (event) => {\n  event.waitUntil(\n    caches\n      .open(CACHE_VERSION)\n      .then((cache) => cache.addAll(STATIC_SAFE_URLS))\n      .then(() => self.skipWaiting()),\n  );\n});\n\nself.addEventListener('activate', (event) => {\n  event.waitUntil(\n    caches\n      .keys()\n      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('closeflow-')).map((key) => caches.delete(key))))\n      .then(() => self.clients.claim()),\n  );\n});\n\nself.addEventListener('fetch', (event) => {\n  const request = event.request;\n  if (!isLocalGetRequest(request)) return;\n\n  const url = getUrl(request);\n  if (!url) return;\n  const path = url.pathname.toLowerCase();\n\n  if (request.mode === 'navigate') {\n    if (isBusinessRuntimePath(path)) return;\n    return;\n  }\n\n  if (!isStaticSafeAsset(request)) return;\n\n  event.respondWith(\n    fetch(request)\n      .then((response) => {\n        if (response.ok && response.type === 'basic') {\n          const copy = response.clone();\n          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));\n        }\n        return response;\n      })\n      .catch(() => caches.match(request)),\n  );\n});\n`);
}

function patchVercelJson() {
  const file = 'vercel.json';
  const vercel = exists(file) ? JSON.parse(read(file)) : {};
  const headers = Array.isArray(vercel.headers) ? vercel.headers : [];
  const bySource = new Map(headers.map((entry) => [entry.source, entry]));

  const noStore = [
    { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
    { key: 'CDN-Cache-Control', value: 'no-store' },
    { key: 'Vercel-CDN-Cache-Control', value: 'no-store' },
  ];
  const immutableAssets = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];

  bySource.set('/', { source: '/', headers: noStore });
  bySource.set('/index.html', { source: '/index.html', headers: noStore });
  bySource.set('/service-worker.js', { source: '/service-worker.js', headers: noStore });
  bySource.set('/((?!api/|assets/|.*\\..*).*)', { source: '/((?!api/|assets/|.*\\..*).*)', headers: noStore });
  bySource.set('/assets/(.*)', { source: '/assets/(.*)', headers: immutableAssets });

  vercel.headers = Array.from(bySource.values());
  write(file, JSON.stringify(vercel, null, 2) + '\n');
}

function fixInvalidTailwindArbitraryClassSelectors() {
  const roots = ['src', 'public'];
  const cssFiles = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
        walk(full);
      } else if (entry.isFile() && full.endsWith('.css')) {
        cssFiles.push(full);
      }
    }
  }
  for (const root of roots) walk(repoPath(root));

  for (const full of cssFiles) {
    let content = fs.readFileSync(full, 'utf8');
    const next = content.replace(/\.text-\[12px\]/g, '.text-\\[12px\\]');
    if (next !== content) fs.writeFileSync(full, next, 'utf8');
  }
}

function writeCheckScript() {
  write('scripts/check-hotfix-asset-cache-stale-chunks.cjs', `const fs = require('fs');\n\nfunction read(file) {\n  return fs.readFileSync(file, 'utf8');\n}\n\nfunction fail(message) {\n  console.error('FAIL:', message);\n  process.exitCode = 1;\n}\n\nconst guard = '${HOTFIX_GUARD}';\nconst main = read('src/main.tsx');\nconst sw = read('public/service-worker.js');\nconst err = read('src/components/ErrorBoundary.tsx');\nconst chunk = read('src/pwa/chunk-asset-reload-guard.ts');\nconst vercel = JSON.parse(read('vercel.json'));\nconst pkg = JSON.parse(read('package.json'));\n\nif (!main.includes('registerChunkAssetReloadGuard();')) fail('main.tsx nie uruchamia guardu chunków.');\nif (!main.includes("./pwa/chunk-asset-reload-guard")) fail('main.tsx nie importuje chunk-asset-reload-guard.');\nif (!err.includes('reloadOnceForChunkAssetFailure(error')) fail('ErrorBoundary nie próbuje reloadu przy stale chunk/preload CSS.');\nif (!chunk.includes('Unable to preload CSS')) fail('chunk guard nie obsługuje Vite CSS preload error.');\nif (!chunk.includes('Failed to fetch dynamically imported module')) fail('chunk guard nie obsługuje dynamic import failure.');\nif (!chunk.includes('sessionStorage')) fail('chunk guard nie ma zabezpieczenia przed pętlą reloadu.');\nif (!chunk.includes('caches.keys')) fail('chunk guard nie czyści starych cache CloseFlow.');\nif (!sw.includes(guard)) fail('service-worker.js nie ma guardu hotfixa.');\nif (/APP_SHELL_URLS\\s*=\\s*\\[[\\s\\S]*['\"]\\/['\"]/.test(sw)) fail('service worker dalej cacheuje / jako app shell.');\nif (sw.includes("cache.put('/',")) fail('service worker dalej zapisuje / do Cache Storage.');\nif (sw.includes("path.startsWith('/assets/')")) fail('service worker dalej cacheuje /assets/* przez path.startsWith.');\nif (!sw.includes("'/assets'")) fail('service worker nie wymusza network-only dla /assets.');\nif (!sw.includes('keys.filter((key) => key.startsWith(\'closeflow-\'))')) fail('service worker nie czyści starych cache closeflow-.');\nif (!pkg.scripts || pkg.scripts['check:hotfix-asset-cache-stale-chunks'] !== 'node scripts/check-hotfix-asset-cache-stale-chunks.cjs') fail('package.json nie ma check:hotfix-asset-cache-stale-chunks.');\n\nconst headers = Array.isArray(vercel.headers) ? vercel.headers : [];\nfunction hasHeader(source, valuePart) {\n  const entry = headers.find((item) => item.source === source);\n  return Boolean(entry && Array.isArray(entry.headers) && entry.headers.some((header) => String(header.value || '').includes(valuePart)));\n}\nif (!hasHeader('/', 'no-store')) fail('vercel.json nie ustawia no-store dla /.');\nif (!hasHeader('/index.html', 'no-store')) fail('vercel.json nie ustawia no-store dla /index.html.');\nif (!hasHeader('/service-worker.js', 'no-store')) fail('vercel.json nie ustawia no-store dla /service-worker.js.');\nif (!hasHeader('/((?!api/|assets/|.*\\\\..*).*)', 'no-store')) fail('vercel.json nie ustawia no-store dla app routes.');\nif (!hasHeader('/assets/(.*)', 'immutable')) fail('vercel.json nie ustawia immutable dla hashed /assets.');\n\nconst cssFiles = [];\nfunction walk(dir) {\n  if (!fs.existsSync(dir)) return;\n  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {\n    const full = dir + '/' + entry.name;\n    if (entry.isDirectory()) {\n      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;\n      walk(full);\n    } else if (entry.isFile() && full.endsWith('.css')) {\n      cssFiles.push(full);\n    }\n  }\n}\nwalk('src');\nfor (const file of cssFiles) {\n  const content = read(file);\n  if (content.includes('.text-[12px]')) fail(file + ' ma nieucieczony selector .text-[12px].');\n}\n\nif (process.exitCode) {\n  console.error('HOTFIX_ASSET_CACHE_STALE_CHUNKS_CHECK_FAIL');\n  process.exit(process.exitCode);\n}\n\nconsole.log('HOTFIX_ASSET_CACHE_STALE_CHUNKS_CHECK_OK');\n`);
}

function writeDoc() {
  write('docs/release/CLOSEFLOW_HOTFIX_ASSET_CACHE_STALE_CHUNKS_2026-05-11.md', `# CloseFlow hotfix — stale chunk / CSS preload 404 po deployu\n\n## Cel\n\nNaprawić błąd po deployu, gdzie przeglądarka albo service worker trzyma stary frontend i próbuje pobrać nieistniejące już pliki typu:\n\n- /assets/ClientDetail-*.js\n- /assets/ClientDetail-*.css\n\nObjaw w konsoli:\n\n\`\`\`text\nUnable to preload CSS for /assets/ClientDetail-*.css\nFailed to load resource: 404\nAPP_ROUTE_RENDER_FAILED\n\`\`\`\n\n## Przyczyna\n\nVite generuje hashowane nazwy chunków. Po deployu nazwy są inne. Jeżeli użytkownik ma stary index albo starą mapę chunków w cache, aplikacja woła pliki z poprzedniego deployu. Na aktualnym deployment aliasie Vercel ich już nie ma, więc jest 404 i route crash.\n\n## Zmiany\n\n- Service worker nie cacheuje już / ani /assets/*.js / /assets/*.css.\n- Service worker czyści stare cache closeflow-* przy aktywacji.\n- Vercel dostaje no-store dla app shell, route fallbacków i /service-worker.js.\n- Hashowane /assets zostają immutable.\n- Dodano runtime guard, który przy stale chunk / CSS preload error czyści cache i robi jeden reload.\n- ErrorBoundary uruchamia ten sam guard przy błędzie route renderu.\n- Naprawiono nieucieczony CSS selector .text-[12px].\n\n## Kryterium zakończenia\n\nPo deployu użytkownik nie zostaje na białym ekranie / error boundary przez stare chunk IDs. Przy pierwszym trafieniu w stare assety aplikacja wykonuje jednorazowy reload na świeży build.\n`);
}

function main() {
  const backup = backupFiles([
    'package.json',
    'src/main.tsx',
    'src/components/ErrorBoundary.tsx',
    'src/pwa/chunk-asset-reload-guard.ts',
    'public/service-worker.js',
    'vercel.json',
  ]);

  upsertPackageScript();
  patchMain();
  writeChunkGuard();
  patchErrorBoundary();
  writeServiceWorker();
  patchVercelJson();
  fixInvalidTailwindArbitraryClassSelectors();
  writeCheckScript();
  writeDoc();

  console.log('HOTFIX_ASSET_CACHE_STALE_CHUNKS_REPAIR_DONE');
  console.log(`Backup: ${backup}`);
  console.log('- service-worker: HTML i /assets są network-only; stare closeflow-* cache są czyszczone');
  console.log('- runtime: dodano jednorazowy reload po stale chunk / CSS preload error');
  console.log('- ErrorBoundary: odpala reload guard przy route render failure');
  console.log('- vercel: no-store dla app shell i service-worker; immutable dla /assets');
  console.log('- css: naprawiono .text-[12px] jeśli występował');
}

main();
