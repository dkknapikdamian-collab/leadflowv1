const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function fail(message) {
  console.error('FAIL:', message);
  process.exitCode = 1;
}

const guard = 'CLOSEFLOW_ASSET_CACHE_STALE_CHUNK_HOTFIX_2026_05_11';
const main = read('src/main.tsx');
const sw = read('public/service-worker.js');
const err = read('src/components/ErrorBoundary.tsx');
const chunk = read('src/pwa/chunk-asset-reload-guard.ts');
const vercel = JSON.parse(read('vercel.json'));
const pkg = JSON.parse(read('package.json'));

if (!main.includes('registerChunkAssetReloadGuard();')) fail('main.tsx nie uruchamia guardu chunkow.');
if (!main.includes("./pwa/chunk-asset-reload-guard")) fail('main.tsx nie importuje chunk-asset-reload-guard.');
if (!err.includes('reloadOnceForChunkAssetFailure(error')) fail('ErrorBoundary nie probuje reloadu przy stale chunk/preload CSS.');
if (!chunk.includes('Unable to preload CSS')) fail('chunk guard nie obsluguje Vite CSS preload error.');
if (!chunk.includes('Failed to fetch dynamically imported module')) fail('chunk guard nie obsluguje dynamic import failure.');
if (!chunk.includes('sessionStorage')) fail('chunk guard nie ma zabezpieczenia przed petla reloadu.');
if (!chunk.includes('caches.keys')) fail('chunk guard nie czysci starych cache CloseFlow.');
if (!sw.includes(guard)) fail('service-worker.js nie ma guardu hotfixa.');
if (/APP_SHELL_URLS\s*=\s*\[[\s\S]*['"]\/['"]/.test(sw)) fail('service worker dalej cacheuje / jako app shell.');
if (sw.includes("cache.put('/',")) fail('service worker dalej zapisuje / do Cache Storage.');
if (sw.includes("path.startsWith('/assets/')")) fail('service worker dalej cacheuje /assets/* przez path.startsWith.');
if (!sw.includes("'/assets'")) fail('service worker nie wymusza network-only dla /assets.');
if (!sw.includes("key.startsWith('closeflow-')")) fail('service worker nie czysci starych cache closeflow-.');
if (!pkg.scripts || pkg.scripts['check:hotfix-asset-cache-stale-chunks'] !== 'node scripts/check-hotfix-asset-cache-stale-chunks.cjs') fail('package.json nie ma check:hotfix-asset-cache-stale-chunks.');

const headers = Array.isArray(vercel.headers) ? vercel.headers : [];
function hasHeader(source, valuePart) {
  const entry = headers.find((item) => item.source === source);
  return Boolean(entry && Array.isArray(entry.headers) && entry.headers.some((header) => String(header.value || '').includes(valuePart)));
}
if (!hasHeader('/', 'no-store')) fail('vercel.json nie ustawia no-store dla /.');
if (!hasHeader('/index.html', 'no-store')) fail('vercel.json nie ustawia no-store dla /index.html.');
if (!hasHeader('/service-worker.js', 'no-store')) fail('vercel.json nie ustawia no-store dla /service-worker.js.');
if (!hasHeader('/((?!api/|assets/|.*\\..*).*)', 'no-store')) fail('vercel.json nie ustawia no-store dla app routes.');
if (!hasHeader('/assets/(.*)', 'immutable')) fail('vercel.json nie ustawia immutable dla hashed /assets.');

const cssFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && full.endsWith('.css')) {
      cssFiles.push(full);
    }
  }
}
walk('src');
for (const file of cssFiles) {
  const content = read(file);
  if (content.includes('.text-[12px]')) fail(`${file} ma nieucieczony selector .text-[12px].`);
}

if (process.exitCode) {
  console.error('HOTFIX_ASSET_CACHE_STALE_CHUNKS_CHECK_FAIL');
  process.exit(process.exitCode);
}

console.log('HOTFIX_ASSET_CACHE_STALE_CHUNKS_CHECK_OK');
