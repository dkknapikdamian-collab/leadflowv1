const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('CaseDetail marks a section with explicit unified visual history scope', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.ok(source.includes('case-detail-history-unified-panel'));
  assert.ok(source.includes('Historia sprawy'));
  assert.ok(source.includes('case-detail-section-card'));
});

test('Case quick actions has no helper subtitle under the title', () => {
  const source = read('src/components/CaseQuickActions.tsx');
  assert.equal(source.includes('Dodaj operacyjny ruch bez starego kafelka formularza.'), false);
  assert.ok(source.includes('CLOSEFLOW_CASE_QUICK_ACTIONS_NO_HELPER_COPY_P1_2026_05_13'));
});

test('Case history CSS uses explicit unified panel scope and generic work-row fallback', () => {
  const css = read('src/styles/closeflow-case-history-visual-source-truth.css');
  assert.ok(css.includes('CLOSEFLOW_CASE_DETAIL_HISTORY_VISUAL_P1_REPAIR3_2026_05_13'));
  assert.ok(css.includes('.case-detail-history-unified-panel .case-detail-work-row'));
  assert.ok(css.includes('.case-detail-history-unified-panel .case-detail-history-row'));
  assert.ok(css.includes('article[class*="case-detail-work"]'));
  assert.ok(css.includes('.case-detail-history-unified-panel .case-detail-row-actions'));
});

test('Case history visual repair3 test is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes("'tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs'"));
});
