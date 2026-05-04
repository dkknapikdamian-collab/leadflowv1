const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const marker = 'STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE';

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8');
}

test('STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE sources are present', () => {
  assert.ok(read('src/pages/ClientDetail.tsx').includes(marker));
  assert.ok(read('src/pages/ClientDetail.tsx').includes('function dedupeTranscriptAppend'));
  assert.ok(read('src/pages/CaseDetail.tsx').includes(marker));
  assert.ok(read('src/styles/visual-stage13-case-detail-vnext.css').includes(marker));
});

test('STAGE56 keeps case quick actions readable', () => {
  const css = read('src/styles/visual-stage13-case-detail-vnext.css');
  assert.ok(css.includes('.case-detail-vnext-page .case-detail-right-actions button'));
  assert.ok(css.includes('-webkit-text-fill-color: #111827 !important;'));
  assert.ok(css.includes('background: #ffffff !important;'));
});
