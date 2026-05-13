const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('CaseActivity history entries do not render through WorkItemRow cards', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13'));
  assert.ok(source.includes('function isCaseActivitySourceForWorkRow'));
  assert.ok(source.includes('isCaseActivitySourceForWorkRow(entry.source)'));
  assert.ok(source.includes('return null;'));
});

test('CaseDetail keeps separate compact history row render', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('<article className="case-history-row"'));
  assert.ok(source.includes('<article key={activity.id} className="case-detail-history-row"'));
  assert.ok(source.includes('<article className="case-detail-work-row"'));
});

test('Case history workrow leak fix is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes("'tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs'"));
});
