const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Client detail uses simplified card view with four tabs', () => {
  const source = read('src/pages/ClientDetail.tsx');

  assert.match(source, /data-client-detail-simplified-card-view/);
  assert.match(source, /data-client-tab-summary/);
  assert.match(source, /data-client-tab-cases/);
  assert.match(source, /data-client-tab-contact/);
  assert.match(source, /data-client-tab-history/);

  assert.match(source, /Podsumowanie/);
  assert.match(source, /Sprawy/);
  assert.match(source, /Kontakt/);
  assert.match(source, /Historia/);

  assert.match(source, /Tu nie prowadzimy pracy/);
  assert.match(source, /\+ Nowa sprawa dla klienta/);
  assert.match(source, /Edytuj dane kontaktowe/);

  assert.doesNotMatch(source, /Leady klienta/);
  assert.doesNotMatch(source, /Dodaj follow-up/);
  assert.doesNotMatch(source, /Następny krok klienta/);
});

test('Client detail keeps source lead as history instead of workspace', () => {
  const source = read('src/pages/ClientDetail.tsx');

  assert.match(source, /Lead źródłowy/);
  assert.match(source, /Historia pozyskania/);
  assert.match(source, /Źródło:/);
  assert.match(source, /Otwórz sprawę/);
});
