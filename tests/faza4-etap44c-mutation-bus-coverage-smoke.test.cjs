const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exactMutationImportCount(content) {
  return (content.match(/^import\s*\{\s*subscribeCloseflowDataMutations\s*\}\s*from\s*['"]\.\.\/lib\/supabase-fallback['"]\s*;$/gm) || []).length;
}

test('Faza 4 Etap 4.4C v3 mutation bus has required surface', () => {
  const fallback = read('src/lib/supabase-fallback.ts');

  assert.match(fallback, /CLOSEFLOW_DATA_MUTATED_EVENT/);
  assert.match(fallback, /emitCloseflowDataMutation\s*\(/);
  assert.match(fallback, /subscribeCloseflowDataMutations\s*\(/);
  assert.doesNotMatch(fallback, /window\.location\.reload\s*\(/);
});

test('Faza 4 Etap 4.4C v3 required screens import and subscribe exactly once', () => {
  const screens = [
    ['src/pages/Tasks.tsx', /refreshSupabaseData\s*\(/],
    ['src/pages/Calendar.tsx', /refreshSupabaseBundle\s*\(/],
    ['src/pages/TodayStable.tsx', /refreshData\s*\(\s*\)/],
  ];

  for (const [relativePath, refreshRegex] of screens) {
    const content = read(relativePath);
    assert.equal(exactMutationImportCount(content), 1, relativePath);
    assert.match(content, /subscribeCloseflowDataMutations\s*\(/);
    assert.match(content, refreshRegex);
    assert.doesNotMatch(content, /window\.location\.reload\s*\(/);
  }
});

test('Faza 4 Etap 4.4C v3 scripts and docs are wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const releaseDoc = read('docs/release/FAZA4_ETAP44C_MUTATION_BUS_COVERAGE_SMOKE_2026-05-04.md');
  const technicalDoc = read('docs/technical/LIVE_REFRESH_MUTATION_BUS_COVERAGE_STAGE44C_2026-05-04.md');

  assert.equal(pkg.scripts['check:faza4-etap44c-mutation-bus-coverage-smoke'], 'node scripts/check-faza4-etap44c-mutation-bus-coverage-smoke.cjs');
  assert.equal(pkg.scripts['test:faza4-etap44c-mutation-bus-coverage-smoke'], 'node --test tests/faza4-etap44c-mutation-bus-coverage-smoke.test.cjs');
  assert.match(quiet, /tests\/faza4-etap44c-mutation-bus-coverage-smoke\.test\.cjs/);
  assert.match(releaseDoc, /manual_live_refresh_evidence_required/);
  assert.match(technicalDoc, /LIVE REFRESH MUTATION BUS COVERAGE STAGE44C v3/);
});
