const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Case quick actions header no longer contains noisy helper copy', () => {
  const source = read('src/components/CaseQuickActions.tsx');
  assert.equal(source.includes('Dodaj operacyjny ruch bez starego kafelka formularza.'), false);
  assert.ok(source.includes('<strong>Szybkie akcje</strong>'));
});

test('Case detail history visual source truth forces compact single-style history rows', () => {
  const css = read('src/styles/closeflow-case-history-visual-source-truth.css');
  assert.ok(css.includes('CLOSEFLOW_P1_CASE_DETAIL_HISTORY_VISUAL_UNIFIED_2026_05_13'));
  assert.ok(css.includes('.case-detail-section-card:has([data-case-history-summary="true"])'));
  assert.ok(css.includes('.case-detail-work-icon'));
  assert.ok(css.includes('.case-detail-row-actions'));
  assert.ok(css.includes('grid-template-columns: 7.75rem minmax(0, 1fr)'));
});

test('Case history visual P1 test is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes("'tests/p1-case-detail-history-quick-actions-visual-2026-05-13.test.cjs'"));
});