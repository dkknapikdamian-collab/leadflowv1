const fs = require('fs');
const path = require('path');

const root = process.cwd();
const manifestPath = path.join(root, 'public', 'manifest.webmanifest');

function stripBom(text) {
  const value = String(text || '');
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

if (!fs.existsSync(manifestPath)) {
  throw new Error('public/manifest.webmanifest not found');
}

const raw = stripBom(fs.readFileSync(manifestPath, 'utf8'));
let manifest;
try {
  manifest = JSON.parse(raw);
} catch (error) {
  throw new Error(`manifest.webmanifest JSON parse failed: ${error.message}`);
}

manifest.name = 'Close Flow';
manifest.short_name = manifest.short_name || 'CloseFlow';
manifest.display = 'standalone';
manifest.start_url = '/';
manifest.scope = '/';
manifest.theme_color = manifest.theme_color || '#0f172a';
manifest.background_color = manifest.background_color || '#0f172a';

if (!Array.isArray(manifest.icons)) manifest.icons = [];
const requiredIcons = [
  { src: '/icons/closeflow-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
  { src: '/icons/closeflow-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
  { src: '/icons/closeflow-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
];
for (const icon of requiredIcons) {
  if (!manifest.icons.some((entry) => entry && entry.src === icon.src)) {
    manifest.icons.push(icon);
  }
}

if (!Array.isArray(manifest.shortcuts)) manifest.shortcuts = [];
if (!manifest.shortcuts.some((shortcut) => shortcut && shortcut.url === '/today')) {
  manifest.shortcuts.unshift({
    name: 'Dzi\u015B',
    short_name: 'Dzi\u015B',
    description: 'Otw\u00F3rz dzisiejszy widok pracy',
    url: '/today',
    icons: [{ src: '/icons/closeflow-icon-192.png', sizes: '192x192' }],
  });
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log('OK: Stage16E PWA manifest name compatibility repaired.');
console.log('- public/manifest.webmanifest name=Close Flow');
