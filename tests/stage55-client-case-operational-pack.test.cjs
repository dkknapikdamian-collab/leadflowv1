const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const marker = 'STAGE55_CLIENT_CASE_OPERATIONAL_PACK';

test(marker, () => {
  const tsx = fs.readFileSync(path.join(process.cwd(), 'src/pages/ClientDetail.tsx'), 'utf8');
  const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/visual-stage12-client-detail-vnext.css'), 'utf8');
  const pkg = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
  assert.ok(tsx.includes(marker));
  assert.ok(!tsx.includes('Klient jest rekordem zbiorczym'));
  assert.ok(!tsx.includes('Po wej\u015Bciu w obs\u0142ug\u0119 pracuj na konkretnej sprawie'));
  assert.ok(css.includes(marker));
  assert.ok(css.includes('grid-template-columns: minmax(0, 1.15fr)'));
  assert.ok(css.includes('-webkit-line-clamp: 2 !important;'));
  assert.ok(pkg.includes('verify:client-detail-operational-ui'));
});
