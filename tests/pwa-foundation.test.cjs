const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('PWA manifest and shell metadata are wired', () => {
  const indexHtml = read('index.html');
  const manifestText = read('public/manifest.webmanifest');
  const manifest = JSON.parse(manifestText);

  assert.match(indexHtml, /<link rel="manifest" href="\/manifest\.webmanifest" \/>/);
  assert.match(indexHtml, /<meta name="theme-color" content="#0f172a" \/>/);
  assert.match(indexHtml, /apple-mobile-web-app-capable/);

  assert.equal(manifest.name, 'Close Flow');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.scope, '/');
  assert.ok(Array.isArray(manifest.icons));
  assert.ok(manifest.icons.some((icon) => icon.src === '/icons/closeflow-icon.svg'));
  assert.ok(Array.isArray(manifest.shortcuts));
  assert.ok(manifest.shortcuts.some((shortcut) => shortcut.url === '/today'));
});

test('service worker is static-only and avoids business data endpoints', () => {
  const worker = read('public/service-worker.js');
  const registration = read('src/pwa/register-service-worker.ts');
  const main = read('src/main.tsx');

  assert.match(worker, /CACHE_VERSION/);
  assert.match(worker, /url\.pathname\.startsWith\('\/api\/'\)/);
  assert.match(worker, /url\.pathname\.startsWith\('\/supabase\/'\)/);
  assert.match(worker, /request\.method !== 'GET'/);
  assert.match(worker, /request\.mode === 'navigate'/);
  assert.doesNotMatch(worker, /indexedDB|localStorage|sessionStorage/i);

  assert.match(registration, /serviceWorker' in navigator/);
  assert.match(registration, /import\.meta\.env\.DEV/);
  assert.match(registration, /register\('\/service-worker\.js'/);
  assert.match(main, /registerCloseFlowServiceWorker\(\)/);
});

test('PWA icon and handoff documentation exist', () => {
  const icon = read('public/icons/closeflow-icon.svg');
  const docs = read('docs/PWA_FOUNDATION_2026-04-25.md');

  assert.match(icon, /<svg/);
  assert.match(icon, /Close Flow/);
  assert.match(docs, /service worker nie cacheuje `\/api\/`/);
  assert.match(docs, /test `tests\/pwa-foundation\.test\.cjs` przechodzi/);
});
