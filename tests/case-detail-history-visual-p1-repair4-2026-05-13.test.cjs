const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('CaseDetail keeps explicit unified visual history scope', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.ok(source.includes('case-detail-history-unified-panel'));
  assert.ok(source.includes('Historia sprawy'));
});

test('Case quick actions helper copy stays removed', () => {
  const source = read('src/components/CaseQuickActions.tsx');
  assert.equal(source.includes('Dodaj operacyjny ruch bez starego kafelka formularza.'), false);
  assert.ok(source.includes('CLOSEFLOW_CASE_QUICK_ACTIONS_NO_HELPER_COPY_P1_2026_05_13'));
});

test('Case history CSS uses explicit unified panel scope and generic work-row fallback', () => {
  const css = read('src/styles/closeflow-case-history-visual-source-truth.css');
  assert.ok(css.includes('CLOSEFLOW_CASE_DETAIL_HISTORY_VISUAL_P1_REPAIR4_2026_05_13'));
  assert.ok(css.includes('.case-detail-history-unified-panel .case-detail-work-row'));
  assert.ok(css.includes('.case-detail-history-unified-panel .case-detail-history-row'));
  assert.ok(css.includes('article[class*="case-detail-work"]'));
});

test('Quiet gate uses stable Vite build runner instead of nested npm build', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes('CLOSEFLOW_QUIET_GATE_VITE_BUILD_RUNNER_2026_05_13'));
  assert.ok(quiet.includes("runQuiet('production build', process.execPath, ['scripts/closeflow-vite-build-runner.mjs']);"));
  assert.equal(quiet.includes("runNpmScript('production build', 'build');"), false);
  assert.ok(fs.existsSync(path.join(repoRoot, 'scripts/closeflow-vite-build-runner.mjs')));
});

test('Case history visual repair4 test is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes("'tests/case-detail-history-visual-p1-repair4-2026-05-13.test.cjs'"));
});
