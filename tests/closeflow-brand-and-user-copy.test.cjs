const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('CloseFlow is the single visible brand source for every shell variant', () => {
  const brand = read('src/lib/brand.ts');
  const layout = read('src/components/Layout.tsx');
  const landing = read('src/pages/PublicLanding.tsx');

  assert.match(brand, /name:\s*'CloseFlow'/);
  assert.match(brand, /mark:\s*'CF'/);
  assert.match(layout, /import \{ CLOSEFLOW_BRAND \} from '\.\.\/lib\/brand';/);
  assert.match(layout, /\{CLOSEFLOW_BRAND\.name\}/);
  assert.match(layout, /\{CLOSEFLOW_BRAND\.mark\}/);
  assert.match(landing, /\{CLOSEFLOW_BRAND\.name\}/);
  assert.match(landing, /\{CLOSEFLOW_BRAND\.mark\}/);
  assert.doesNotMatch(layout, /isFortecaShellRoute\s*\?\s*'Forteca'/);
  assert.doesNotMatch(layout, /isFortecaShellRoute\s*\?\s*'F'\s*:/);
});

test('client archive actions use user-facing archive language', () => {
  const clients = read('src/pages/Clients.tsx');

  assert.match(clients, /title: 'Czy na pewno zarchiwizować klienta\?'/);
  assert.match(clients, /Klient zarchiwizowany/);
  assert.match(clients, /confirmLabel=.*'Zarchiwizuj klienta'/);
  assert.ok((clients.match(/Zarchiwizuj klienta/g) || []).length >= 5);
  assert.doesNotMatch(clients, /Przenieść klienta do kosza|Przenieś do kosza|przenieść klienta do kosza|z kosza/);
});

test('emergency case copy does not contain the legacy typo', () => {
  assert.doesNotMatch(read('src/pages/CaseDetail.tsx'), /zrobioneenie/);
  assert.match(read('src/pages/CaseDetail.tsx'), /Normalne zakończenie procesu wykonuj przez „Zamknij sprawę”/);
});
