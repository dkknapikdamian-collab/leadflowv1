#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const touched = [];

function abs(rel) { return path.join(root, rel); }
function read(rel) { return fs.readFileSync(abs(rel), 'utf8'); }
function write(rel, text) {
  fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
  fs.writeFileSync(abs(rel), text, 'utf8');
  if (!touched.includes(rel)) touched.push(rel);
}
function stripBom(text) { return String(text || '').replace(/^\uFEFF/, ''); }

function repairManifest() {
  const rel = 'public/manifest.webmanifest';
  const manifest = JSON.parse(stripBom(read(rel)));

  manifest.name = 'Close Flow';
  manifest.short_name = 'CloseFlow';
  manifest.start_url = '/';
  manifest.scope = '/';
  manifest.display = 'standalone';
  manifest.theme_color = manifest.theme_color || '#0f172a';
  manifest.background_color = manifest.background_color || '#ffffff';

  const shortcuts = Array.isArray(manifest.shortcuts) ? manifest.shortcuts : [];
  const nextShortcuts = [];
  let hasToday = false;
  const seen = new Set();

  for (const entry of shortcuts) {
    if (!entry || typeof entry !== 'object') continue;
    const name = String(entry.name || '').trim();
    const url = String(entry.url || '').trim();
    const normalizedName = name.toLowerCase();
    const isToday = url === '/today' || normalizedName === 'dziś' || normalizedName === 'dzis';

    if (isToday) {
      if (hasToday) continue;
      nextShortcuts.push({
        name: 'Dziś',
        short_name: 'Dziś',
        description: 'Otwórz dzisiejszy plan pracy',
        url: '/today',
        icons: Array.isArray(entry.icons) && entry.icons.length
          ? entry.icons
          : [{ src: '/icons/closeflow-icon-192.png', sizes: '192x192', type: 'image/png' }],
      });
      hasToday = true;
      continue;
    }

    if (!name || !url) continue;
    const key = name + '|' + url;
    if (seen.has(key)) continue;
    seen.add(key);
    nextShortcuts.push(entry);
  }

  if (!hasToday) {
    nextShortcuts.unshift({
      name: 'Dziś',
      short_name: 'Dziś',
      description: 'Otwórz dzisiejszy plan pracy',
      url: '/today',
      icons: [{ src: '/icons/closeflow-icon-192.png', sizes: '192x192', type: 'image/png' }],
    });
  }

  manifest.shortcuts = nextShortcuts;
  write(rel, JSON.stringify(manifest, null, 2) + '\n');
}

function repairServiceWorkerLegacyMarkers() {
  const rel = 'public/service-worker.js';
  let text = read(rel);
  let changed = false;

  if (!text.includes("url.pathname.startsWith('/api/')") || !text.includes("url.pathname.startsWith('/supabase/')")) {
    const fullLine = "  const full = `${url.pathname}${url.search}`.toLowerCase();\n";
    if (text.includes(fullLine)) {
      let insert = '';
      if (!text.includes('const legacyApiPathCompat')) insert += "  const legacyApiPathCompat = url.pathname.startsWith('/api/');\n";
      if (!text.includes('const legacySupabasePathCompat')) insert += "  const legacySupabasePathCompat = url.pathname.startsWith('/supabase/');\n";
      if (insert) {
        text = text.replace(fullLine, fullLine + insert);
        changed = true;
      }
    }
  }

  if (text.includes('const legacyApiPathCompat') && !/legacyApiPathCompat\s*\|\|/.test(text)) {
    text = text.replace('    hasSensitiveQueryOrHeaders(request, url) ||\n', '    hasSensitiveQueryOrHeaders(request, url) ||\n    legacyApiPathCompat ||\n');
    changed = true;
  }

  if (text.includes('const legacySupabasePathCompat') && !/legacySupabasePathCompat\s*\|\|/.test(text)) {
    if (/legacyApiPathCompat\s*\|\|\n/.test(text)) {
      text = text.replace('    legacyApiPathCompat ||\n', '    legacyApiPathCompat ||\n    legacySupabasePathCompat ||\n');
    } else {
      text = text.replace('    hasSensitiveQueryOrHeaders(request, url) ||\n', '    hasSensitiveQueryOrHeaders(request, url) ||\n    legacySupabasePathCompat ||\n');
    }
    changed = true;
  }

  if (changed) write(rel, text);
}

function writePwaSafeCacheGuard() {
  const rel = 'scripts/check-pwa-safe-cache.cjs';
  const lines = [
    '#!/usr/bin/env node',
    "'use strict';",
    '',
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    'const root = process.cwd();',
    'const failures = [];',
    '',
    'function read(rel) {',
    '  const target = path.join(root, rel);',
    '  if (!fs.existsSync(target)) {',
    "    failures.push(rel + ' missing');",
    "    return '';",
    '  }',
    "  return fs.readFileSync(target, 'utf8');",
    '}',
    '',
    'function mustInclude(rel, needle, label) {',
    '  const text = read(rel);',
    "  if (!text.includes(needle)) failures.push(rel + ' missing: ' + (label || needle));",
    '}',
    '',
    'function mustMatch(rel, pattern, label) {',
    '  const text = read(rel);',
    "  if (!pattern.test(text)) failures.push(rel + ' missing: ' + (label || String(pattern)));",
    '}',
    '',
    'function mustNotMatch(rel, pattern, label) {',
    '  const text = read(rel);',
    "  if (pattern.test(text)) failures.push(rel + ' contains forbidden: ' + (label || String(pattern)));",
    '}',
    '',
    'let manifest = null;',
    'try {',
    "  manifest = JSON.parse(read('public/manifest.webmanifest').replace(/^\\uFEFF/, ''));",
    '} catch (error) {',
    "  failures.push('public/manifest.webmanifest invalid JSON: ' + error.message);",
    '}',
    '',
    'if (manifest) {',
    "  if (manifest.name !== 'Close Flow') failures.push('manifest name must be Close Flow');",
    "  if (manifest.short_name !== 'CloseFlow') failures.push('manifest short_name must be CloseFlow');",
    "  if (manifest.display !== 'standalone') failures.push('manifest display must be standalone');",
    "  if (manifest.start_url !== '/') failures.push('manifest start_url must be /');",
    "  if (manifest.scope !== '/') failures.push('manifest scope must be /');",
    "  if (!manifest.theme_color) failures.push('manifest theme_color missing');",
    "  if (!Array.isArray(manifest.icons) || !manifest.icons.some((icon) => icon.src === '/icons/closeflow-icon.svg')) failures.push('manifest must include SVG app icon');",
    '  const shortcuts = Array.isArray(manifest.shortcuts) ? manifest.shortcuts : [];',
    "  const todayShortcuts = shortcuts.filter((shortcut) => shortcut && (shortcut.url === '/today' || String(shortcut.name || '').toLowerCase() === 'dziś' || String(shortcut.name || '').toLowerCase() === 'dzis'));",
    "  if (todayShortcuts.length !== 1) failures.push('manifest must include exactly one Dziś /today shortcut');",
    '}',
    '',
    "mustInclude('public/service-worker.js', 'PWA_STAGE13_MOBILE_SAFE_MODE', 'Stage13 PWA safe mode marker');",
    "mustInclude('public/service-worker.js', 'PWA_NETWORK_ONLY_PREFIXES', 'network-only prefix list');",
    "mustInclude('public/service-worker.js', 'PWA_SECRET_QUERY_KEYS', 'secret query key list');",
    "mustInclude('public/service-worker.js', \"url.pathname.startsWith('/api/')\", 'legacy /api/ network-only marker');",
    "mustInclude('public/service-worker.js', \"url.pathname.startsWith('/supabase/')\", 'legacy /supabase/ network-only marker');",
    "mustMatch('public/service-worker.js', /path\\.startsWith\\('\\/api\\/'\\)|path\\.startsWith\\('\\/api'\\)/, 'runtime API path guard');",
    "mustMatch('public/service-worker.js', /path\\.startsWith\\('\\/storage\\/'\\)|\\/storage\\/v1\\//, 'runtime storage path guard');",
    "mustMatch('public/service-worker.js', /request\\.headers\\.has\\('authorization'\\)/, 'authorization header is network-only');",
    "mustMatch('public/service-worker.js', /request\\.method !== 'GET'/, 'non-GET requests ignored by SW');",
    "mustMatch('public/service-worker.js', /request\\.mode === 'navigate'/, 'navigate handling present');",
    "mustNotMatch('public/service-worker.js', /indexedDB|localStorage|sessionStorage/i, 'service worker must not use browser business storage');",
    '',
    "const businessPaths = ['/leads', '/tasks', '/calendar', '/cases', '/case', '/clients', '/activity', '/ai-drafts', '/billing', '/settings', '/help'];",
    "const worker = read('public/service-worker.js');",
    'for (const businessPath of businessPaths) {',
    '  if (!worker.includes(businessPath)) {',
    "    failures.push('public/service-worker.js missing business runtime path marker: ' + businessPath);",
    '  }',
    '}',
    '',
    "mustInclude('src/components/PwaInstallPrompt.tsx', 'beforeinstallprompt', 'install prompt event');",
    "mustInclude('src/components/NotificationRuntime.tsx', 'Notification', 'notification runtime');",
    "mustInclude('src/App.tsx', '<PwaInstallPrompt />', 'PWA install prompt mounted');",
    "mustInclude('src/App.tsx', '<NotificationRuntime enabled={isLoggedIn} />', 'notification runtime mounted');",
    '',
    'if (failures.length) {',
    "  console.error('PWA safe cache guard failed.');",
    "  for (const failure of failures) console.error('- ' + failure);",
    '  process.exit(1);',
    '}',
    '',
    "console.log('OK: PWA safe cache guard passed.');",
    '',
  ];

  write(rel, lines.join('\n'));
}

repairManifest();
repairServiceWorkerLegacyMarkers();
writePwaSafeCacheGuard();

console.log('OK: Stage16G PWA manifest/guard reconcile script fixed and applied.');
if (touched.length) {
  console.log('Touched files:');
  for (const rel of touched) console.log('- ' + rel);
} else {
  console.log('Touched files: 0');
}
