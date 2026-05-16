const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Client detail uses simplified card view with tabs and inline contact edit', () => {
  const source = read('src/pages/ClientDetail.tsx');

  assert.match(source, /data-client-detail-simplified-card-view/);
  assert.match(source, /data-client-tab-summary/);
  assert.match(source, /data-client-tab-cases/);
  assert.match(source, /data-client-tab-history/);

  assert.match(source, /Podsumowanie/);
  assert.match(source, /Sprawy/);
  assert.match(source, /Historia/);

  assert.match(source, /\+ Nowa sprawa dla klienta/);
  assert.match(source, /data-client-inline-contact-edit="true"/);
  assert.match(source, /contactEditing \? 'Zapisz' : 'Edytuj'/);
  assert.match(source, /Praca dzieje si\u0119 w sprawie/);

  assert.doesNotMatch(source, /Leady klienta/);
  assert.doesNotMatch(source, /Dodaj follow-up/);
  assert.doesNotMatch(source, /Nast\u0119pny krok klienta/);
});

test('Client detail keeps source lead as history instead of workspace', () => {
  const source = read('src/pages/ClientDetail.tsx');

  assert.match(source, /Lead \u017Ar\u00F3d\u0142owy/);
  assert.match(source, /Historia pozyskania/);
  assert.match(source, /\u0179r\u00F3d\u0142o:/);
  assert.match(source, /Otw\u00F3rz spraw\u0119/);
});
