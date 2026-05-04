const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const marker = 'STAGE54_CLIENT_CASES_COMPACT_FIT';

test(marker, () => {
  const tsx = fs.readFileSync(path.join(process.cwd(), 'src/pages/ClientDetail.tsx'), 'utf8');
  const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/visual-stage12-client-detail-vnext.css'), 'utf8');
  assert.ok(tsx.includes(marker));
  assert.ok(!tsx.includes('Klient jest rekordem zbiorczym'));
  assert.ok(!tsx.includes('Po wejściu w obsługę pracuj na konkretnej sprawie'));
  assert.ok(css.includes(marker));
  assert.ok(css.includes('.client-detail-case-row-wide'));
  assert.ok(css.includes('-webkit-line-clamp: 2;'));
  assert.ok(css.includes('font-size: 10px !important;'));
});
