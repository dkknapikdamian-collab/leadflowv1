const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const appPath = path.join(repoRoot, 'src/App.tsx');
const source = fs.readFileSync(appPath, 'utf8');

function fail(message) {
  console.error('FAIL check:p1a-no-global-focus-refresh:', message);
  process.exit(1);
}

for (const token of [
  "window.setInterval(() => void syncProfileFromApi(false), 60_000)",
  "window.addEventListener('focus', handleVisibilityRefresh)",
  "document.addEventListener('visibilitychange', handleVisibilityRefresh)",
  "window.removeEventListener('focus', handleVisibilityRefresh)",
  "document.removeEventListener('visibilitychange', handleVisibilityRefresh)",
  "window.clearInterval(interval)",
]) {
  if (source.includes(token)) fail('App.tsx nadal zawiera token globalnego refreshu: ' + token);
}

if (!source.includes('CLOSEFLOW_P1A_NO_GLOBAL_FOCUS_REFRESH_2026_05_13')) fail('Brak markera P1A w App.tsx.');
if (!source.includes('void syncProfileFromApi(true);')) fail('Initial profile sync musi zosta\u0107.');
if (!source.includes('return () => {') || !source.includes('cancelled = true;')) fail('Cleanup cancelled=true musi zosta\u0107.');

console.log('OK check:p1a-no-global-focus-refresh');
