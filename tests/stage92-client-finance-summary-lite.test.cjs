const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

test('Stage92 client detail includes compact finance summary card', () => {
  const clientDetail = read('src/pages/ClientDetail.tsx');
  assert.match(clientDetail, /data-client-finance-summary/);
  assert.match(clientDetail, /Podsumowanie finans\u00F3w/);
  assert.match(clientDetail, /Suma warto\u015Bci spraw:/);
  assert.match(clientDetail, /Suma wp\u0142at:/);
  assert.match(clientDetail, /Pozosta\u0142o do zap\u0142aty:/);
  assert.match(clientDetail, /Sprawy aktywne \/ rozliczone:/);
  assert.match(clientDetail, /recentPayments/);
});
