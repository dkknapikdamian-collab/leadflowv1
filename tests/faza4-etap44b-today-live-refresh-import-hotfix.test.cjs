const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nodeTest = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exactMutationImportCount(value) {
  return (value.match(/^import\s*\{\s*subscribeCloseflowDataMutations\s*\}\s*from\s*['"]\.\.\/lib\/supabase-fallback['"]\s*;$/gm) || []).length;
}

function reactImportContainsMutation(value) {
  const reactImports = value.match(/import\s*\{[\s\S]*?\}\s*from\s*['"]react['"]\s*;/g) || [];
  return reactImports.some((block) => /\bsubscribeCloseflowDataMutations\b/.test(block));
}

nodeTest('Faza 4 Etap 4.4B import hotfix v10 has exact import placement', () => {
  const today = read('src/pages/TodayStable.tsx');

  assert.equal(reactImportContainsMutation(today), false);
  assert.equal(exactMutationImportCount(today), 1);
  assert.match(today, /import \{ subscribeCloseflowDataMutations \} from ['"]\.\.\/lib\/supabase-fallback['"];/);
  assert.match(today, /FAZA4_ETAP44B_TODAY_LIVE_REFRESH/);
  assert.match(today, /subscribeCloseflowDataMutations\(\(detail\)/);
});

nodeTest('Faza 4 Etap 4.4B import hotfix v10 data layer and docs are wired', () => {
  const fallback = read('src/lib/supabase-fallback.ts');
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const releaseDoc = read('docs/release/FAZA4_ETAP44B_TODAY_LIVE_REFRESH_IMPORT_HOTFIX_2026-05-04.md');

  assert.match(fallback, /export function subscribeCloseflowDataMutations/);
  assert.equal(pkg.scripts['check:faza4-etap44b-today-live-refresh-import-hotfix'], 'node scripts/check-faza4-etap44b-today-live-refresh-import-hotfix.cjs');
  assert.equal(pkg.scripts['test:faza4-etap44b-today-live-refresh-import-hotfix'], 'node --test tests/faza4-etap44b-today-live-refresh-import-hotfix.test.cjs');
  assert.match(quiet, /tests\/faza4-etap44b-today-live-refresh-import-hotfix\.test\.cjs/);
  assert.match(releaseDoc, /hotfix v10/);
  assert.match(releaseDoc, /TypeError: subscribeCloseflowDataMutations is not a function/);
});
