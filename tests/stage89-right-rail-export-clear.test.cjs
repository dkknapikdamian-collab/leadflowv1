const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage89 export clears feedback counters after JSON/Markdown export', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const storage = read('src/components/admin-tools/admin-tools-storage.ts');

  assert.ok(toolbar.includes('ADMIN_EXPORT_CLEARS_COUNTERS_STAGE89'));
  assert.ok(toolbar.includes('clearAdminFeedbackItems'));
  assert.ok(toolbar.includes('refreshAdminFeedbackCounters'));
  assert.ok(toolbar.includes('exportJsonAndClear'));
  assert.ok(toolbar.includes('exportMarkdownAndClear'));
  assert.ok(toolbar.includes('Pobierz JSON i wyczy\u015B\u0107 licznik'));
  assert.ok(toolbar.includes('Pobierz Markdown i wyczy\u015B\u0107 licznik'));

  assert.ok(storage.includes('ADMIN_FEEDBACK_EXPORT_CLEAR_COUNTERS_STAGE89'));
  assert.ok(storage.includes('export function clearAdminFeedbackItems()'));
  assert.ok(storage.includes('writeReviewItems([])'));
  assert.ok(storage.includes('writeBugItems([])'));
  assert.ok(storage.includes('writeCopyItems([])'));
  assert.ok(storage.includes('writeButtonSnapshots([])'));
});

test('Stage89 right rail work center is not cramped into letter-by-letter columns', () => {
  const css = read('src/styles/visual-stage14-lead-detail-vnext.css');

  assert.ok(css.includes('STAGE89_RIGHT_RAIL_WORK_CENTER_UNCRAMP'));
  assert.ok(css.includes('grid-template-columns: minmax(0, 1fr) minmax(400px, 440px)'));
  assert.ok(css.includes('.lead-detail-right-rail .lead-detail-work-center-grid'));
  assert.ok(css.includes('overflow-wrap: normal !important'));
  assert.ok(css.includes('word-break: normal !important'));
  assert.ok(css.includes('hyphens: none !important'));
  assert.ok(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
});
