const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('quiet release gate and self-test use Vite build runner contract', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const quietTest = read('tests/closeflow-release-gate-quiet.test.cjs');

  assert.ok(quiet.includes('CLOSEFLOW_QUIET_GATE_VITE_BUILD_RUNNER_2026_05_13'));
  assert.ok(quiet.includes("runQuiet('production build', process.execPath, ['scripts/closeflow-vite-build-runner.mjs']);"));
  assert.equal(quiet.includes("runNpmScript('production build', 'build');"), false);

  assert.ok(quietTest.includes('CLOSEFLOW_QUIET_GATE_VITE_BUILD_RUNNER_2026_05_13'));
  assert.equal(quietTest.includes("assert.match(source, /runNpmScript\\('production build', 'build'\\)/);"), false);
  assert.ok(fs.existsSync(path.join(repoRoot, 'scripts/closeflow-vite-build-runner.mjs')));
});

test('case history visual scope remains in place after quiet gate repair', () => {
  const caseDetail = read('src/pages/CaseDetail.tsx');
  const css = read('src/styles/closeflow-case-history-visual-source-truth.css');
  const quick = read('src/components/CaseQuickActions.tsx');

  assert.ok(caseDetail.includes('case-detail-history-unified-panel'));
  assert.ok(css.includes('CLOSEFLOW_CASE_DETAIL_HISTORY_VISUAL_P1_REPAIR5_2026_05_13'));
  assert.ok(css.includes('.case-detail-history-unified-panel .case-detail-work-row'));
  assert.equal(quick.includes('Dodaj operacyjny ruch bez starego kafelka formularza.'), false);
});

test('case history visual repair5 test is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes("'tests/case-detail-history-visual-p1-repair5-2026-05-13.test.cjs'"));
});
