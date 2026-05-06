#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function read(root, rel, failures) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    failures.push(`${rel} missing`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function parseJson(rel, content, failures) {
  try {
    return JSON.parse(content);
  } catch (error) {
    failures.push(`${rel} is not valid JSON: ${error.message}`);
    return null;
  }
}

function expect(failures, condition, message) {
  if (!condition) failures.push(message);
}

function containsAll(failures, content, rel, needles) {
  for (const needle of needles) {
    expect(failures, content.includes(needle), `${rel} missing marker: ${needle}`);
  }
}

function validatePwaSafeCache(root = process.cwd()) {
  const failures = [];

  const manifestText = read(root, 'public/manifest.webmanifest', failures);
  const sw = read(root, 'public/service-worker.js', failures);
  const prompt = read(root, 'src/components/PwaInstallPrompt.tsx', failures);
  const runtime = read(root, 'src/components/NotificationRuntime.tsx', failures);
  const pkgText = read(root, 'package.json', failures);
  const checkSelf = read(root, 'scripts/check-pwa-safe-cache.cjs', failures);
  const testSelf = read(root, 'tests/pwa-safe-cache.test.cjs', failures);

  const manifest = parseJson('public/manifest.webmanifest', manifestText, failures);
  const pkg = parseJson('package.json', pkgText, failures);

  if (manifest) {
    expect(failures, manifest.name === 'CloseFlow', 'manifest name must be CloseFlow');
    expect(failures, manifest.short_name === 'CloseFlow', 'manifest short_name must be CloseFlow');
    expect(failures, manifest.display === 'standalone', 'manifest display must be standalone');
    expect(failures, manifest.scope === '/', 'manifest scope must be /');
    expect(failures, typeof manifest.start_url === 'string' && manifest.start_url.startsWith('/?source=pwa'), 'manifest start_url must start with /?source=pwa');
    expect(failures, manifest.theme_color === '#0f172a', 'manifest theme_color must be #0f172a');
    expect(failures, manifest.background_color === '#f8fafc', 'manifest background_color must be #f8fafc');
    expect(failures, manifest.prefer_related_applications === false, 'manifest must not prefer native apps');
    expect(failures, Array.isArray(manifest.icons), 'manifest icons must be an array');
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
    expect(failures, icons.some((icon) => icon.src === '/icons/closeflow-icon-192.png' && icon.sizes === '192x192' && String(icon.purpose || '').includes('maskable')), 'manifest missing maskable 192 icon');
    expect(failures, icons.some((icon) => icon.src === '/icons/closeflow-icon-512.png' && icon.sizes === '512x512' && String(icon.purpose || '').includes('maskable')), 'manifest missing maskable 512 icon');
    expect(failures, icons.some((icon) => icon.src === '/icons/closeflow-icon.svg' && icon.type === 'image/svg+xml'), 'manifest missing svg icon');
    const shortcuts = Array.isArray(manifest.shortcuts) ? manifest.shortcuts : [];
    expect(failures, shortcuts.some((shortcut) => shortcut.url === '/'), 'manifest missing root Today shortcut');
    expect(failures, shortcuts.filter((shortcut) => shortcut.name === 'Dziś').length === 1, 'manifest must not duplicate Dziś shortcuts');
  }

  containsAll(failures, sw, 'public/service-worker.js', [
    'PWA_STAGE13_MOBILE_SAFE_MODE',
    'PWA_NETWORK_ONLY_PREFIXES',
    'BUSINESS_RUNTIME_PATHS',
    'PWA_SECRET_QUERY_KEYS',
    'P13_API_NETWORK_ONLY',
    "path.startsWith('/api/')",
    "path.startsWith('/api')",
    "path.startsWith('/supabase/')",
    "path.startsWith('/storage/')",
    "path.startsWith('/auth/')",
    "path.includes('/rest/v1/')",
    "path.includes('/storage/v1/')",
    "path.includes('/functions/v1/')",
    "request.headers.has('authorization')",
    "request.headers.has('x-portal-token')",
    "request.mode === 'navigate'",
    "path.startsWith('/assets/')",
    "cache.put('/', copy)",
    "cache.put(request, copy)",
  ]);

  for (const businessPath of ["'/leads'", "'/tasks'", "'/calendar'", "'/cases'", "'/clients'", "'/ai-drafts'", "'/billing'", "'/settings'"]) {
    expect(failures, sw.includes(businessPath), `public/service-worker.js missing business runtime path ${businessPath}`);
  }

  for (const queryKey of ["'access_token'", "'refresh_token'", "'id_token'", "'code'", "'state'", "'workspaceId'", "'portalToken'"]) {
    expect(failures, sw.includes(queryKey), `public/service-worker.js missing sensitive query key ${queryKey}`);
  }

  expect(failures, !/cache\.addAll\([^)]*api/i.test(sw), 'service worker must not precache API URLs');
  const appShellMatch = sw.match(/const APP_SHELL_URLS = \[([\s\S]*?)\];/);
  const appShellBlock = appShellMatch ? appShellMatch[1] : '';
  expect(failures, appShellBlock.includes("'/'"), 'service worker app shell must include root shell');
  expect(failures, !appShellBlock.includes('/api'), 'service worker app shell must not precache API routes');
  expect(failures, !appShellBlock.includes('/leads'), 'service worker app shell must not precache lead routes');
  expect(failures, !appShellBlock.includes('/tasks'), 'service worker app shell must not precache task routes');
  expect(failures, !appShellBlock.includes('/calendar'), 'service worker app shell must not precache calendar routes');

  containsAll(failures, prompt, 'src/components/PwaInstallPrompt.tsx', [
    'STAGE13_PWA_MOBILE_SAFE_MODE',
    'beforeinstallprompt',
    'appinstalled',
    'data-pwa-mobile-safe-mode="true"',
    'Do ekranu początkowego',
    'min-h-10',
    'min-w-10',
    'safe-area-inset-bottom',
    'Dane klientów nie są sejfem offline',
  ]);

  containsAll(failures, runtime, 'src/components/NotificationRuntime.tsx', [
    'PWA_STAGE13_NOTIFICATION_RUNTIME_SAFE',
    'navigator.onLine === false',
    "window.addEventListener('online'",
    "window.removeEventListener('online'",
    'isInternalNotificationLink',
    "link.startsWith('/')",
    "!link.startsWith('//')",
  ]);

  if (pkg) {
    expect(failures, pkg.scripts && pkg.scripts['check:pwa-safe-cache'] === 'node scripts/check-pwa-safe-cache.cjs', 'package.json missing check:pwa-safe-cache script');
    expect(failures, pkg.scripts && pkg.scripts['test:pwa-safe-cache'] === 'node --test tests/pwa-safe-cache.test.cjs', 'package.json missing test:pwa-safe-cache script');
  }

  expect(failures, checkSelf.includes('validatePwaSafeCache'), 'scripts/check-pwa-safe-cache.cjs must expose validatePwaSafeCache');
  expect(failures, testSelf.includes('validatePwaSafeCache'), 'tests/pwa-safe-cache.test.cjs must call validatePwaSafeCache');

  return failures;
}

if (require.main === module) {
  const failures = validatePwaSafeCache(process.cwd());
  if (failures.length) {
    console.error('PWA safe cache guard failed.');
    for (const failure of failures) console.error('- ' + failure);
    process.exit(1);
  }

  console.log('OK: PWA safe cache guard passed.');
}

module.exports = { validatePwaSafeCache };
