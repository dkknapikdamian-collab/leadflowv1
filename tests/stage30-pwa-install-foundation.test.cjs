const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  const raw = read(relativePath).replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

test('stage30: manifest exists and has required PWA fields', () => {
  const manifestPath = path.join(root, 'public', 'manifest.webmanifest');
  assert.equal(fs.existsSync(manifestPath), true, 'public/manifest.webmanifest must exist');

  const manifest = readJson('public/manifest.webmanifest');
  assert.equal(manifest.name, 'CloseFlow');
  assert.equal(manifest.short_name, 'CloseFlow');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.scope, '/');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.theme_color, 'manifest must define theme_color');
  assert.ok(manifest.background_color, 'manifest must define background_color');
  assert.ok(Array.isArray(manifest.icons), 'manifest icons must be an array');
  assert.ok(manifest.icons.length >= 1, 'manifest must include at least one icon');
  assert.ok(
    manifest.icons.some((icon) => String(icon.src || '').startsWith('/icons/')),
    'manifest must reference an icon from /icons',
  );
});

test('stage30: index.html points to manifest and PWA metadata', () => {
  const html = read('index.html');

  assert.match(html, /<title>CloseFlow<\/title>/);
  assert.match(html, /<link rel="manifest" href="\/manifest\.webmanifest"\s*\/>/);
  assert.match(html, /<meta name="theme-color" content="#[0-9a-fA-F]{6}"\s*\/>/);
  assert.match(html, /<meta name="mobile-web-app-capable" content="yes"\s*\/>/);
  assert.match(html, /<meta name="apple-mobile-web-app-capable" content="yes"\s*\/>/);
  assert.match(html, /<meta name="apple-mobile-web-app-title" content="CloseFlow"\s*\/>/);
});

test('stage30: service worker is cautious and does not aggressively cache API/data requests', () => {
  const sw = read('public/service-worker.js');

  assert.match(sw, /CACHE_VERSION/);
  assert.match(sw, /self\.addEventListener\('install'/);
  assert.match(sw, /self\.addEventListener\('fetch'/);
  assert.match(sw, /path\.startsWith\('\/api\/'\)/, 'service worker must explicitly skip /api/');
  assert.match(sw, /path\.startsWith\('\/supabase\/'\)/, 'service worker must explicitly skip /supabase/');
  assert.match(sw, /path\.startsWith\('\/firebase\/'\)/, 'service worker must explicitly skip /firebase/');
  assert.match(sw, /isApiOrDataRequest\(request\)/, 'fetch handler must call API/data guard');

  const appShellMatch = sw.match(/const APP_SHELL_URLS = \[([\s\S]*?)\];/);
  assert.ok(appShellMatch, 'APP_SHELL_URLS must be defined');
  assert.doesNotMatch(appShellMatch[1], /\/api\//, 'APP_SHELL_URLS cannot include API routes');
  assert.doesNotMatch(appShellMatch[1], /\/supabase\//, 'APP_SHELL_URLS cannot include Supabase data routes');
});

test('stage30: service worker registration is mounted from the app entry', () => {
  const main = read('src/main.tsx');
  const register = read('src/pwa/register-service-worker.ts');

  assert.match(main, /registerCloseFlowServiceWorker\(\)/);
  assert.match(register, /navigator\.serviceWorker/);
  assert.match(register, /register\('\/service-worker\.js'/);
  assert.match(register, /import\.meta\.env\.DEV/);
});

test('stage30: install prompt component only uses browser install prompt flow', () => {
  const component = read('src/components/PwaInstallPrompt.tsx');
  const app = read('src/App.tsx');

  assert.match(component, /beforeinstallprompt/);
  assert.match(component, /appinstalled/);
  assert.match(component, /Dodaj CloseFlow do ekranu g\u0142\u00F3wnego telefonu/);
  assert.match(component, /Otwieraj aplikacj\u0119 jak zwyk\u0142\u0105 apk\u0119/);
  assert.match(component, /if \(!shouldShow\) return null/);
  assert.match(app, /PwaInstallPrompt/);
  assert.match(app, /<PwaInstallPrompt \/>/);
});

test('stage30: settings include short Android and iPhone add-to-home-screen instructions', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.match(settings, /data-settings-pwa-help="true"/);
  assert.match(settings, /Dodaj CloseFlow do ekranu g\u0142\u00F3wnego telefonu/);
  assert.match(settings, /Android Chrome/);
  assert.match(settings, /iPhone Safari/);
  assert.match(settings, /Do ekranu pocz\u0105tkowego/);
});

test('stage30: Today removes local funnel/noisy global-actions helper copy', () => {
  const today = read('src/pages/Today.tsx');
  const cleanup = read('src/lib/stage30-today-cleanup.ts');

  assert.doesNotMatch(today, /TODAY_FUNNEL_DEDUP_VALUE_STAGE11/);
  assert.doesNotMatch(today, /Globalne akcje s\u0105 tylko w g\u00F3rnym pasku:/);
  assert.match(today, /installTodayStage30VisualCleanup/);
  assert.match(cleanup, /data-today-pipeline-shortcut/);
  assert.match(cleanup, /Globalne akcje s\u0105 tylko w g\u00F3rnym pasku/);
  assert.match(cleanup, /lejek\|funnel/);
});
