const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const repoRoot = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(repoRoot, p), 'utf8'); }

test('Billing page hides technical payment diagnostics from customer plan view', () => {
  const source = read('src/pages/Billing.tsx');

  assert.doesNotMatch(source, /Test p\u0142atno\u015Bci Stripe\/BLIK/);
  assert.doesNotMatch(source, /Sprawd\u017A p\u0142atno\u015Bci/);
  assert.doesNotMatch(source, /Sprawdza konfiguracj\u0119 checkoutu bez tworzenia p\u0142atno\u015Bci/);
  assert.doesNotMatch(source, /handleBillingCheck/);
  assert.doesNotMatch(source, /billingCheckResult/);
  assert.doesNotMatch(source, /dryRun:\s*true/);
  assert.match(source, /Przejd\u017A do p\u0142atno\u015Bci/);
});

test('Billing page has corrected Polish user-facing labels', () => {
  const source = read('src/pages/Billing.tsx');
  assert.match(source, /P\u0142atno\u015B\u0107 kart\u0105 lub BLIK/);
  assert.match(source, /Najlepszy wyb\u00F3r/);
  assert.match(source, /Pe\u0142ny workflow/);
  assert.match(source, /Wybierz okres dost\u0119pu/);
  assert.match(source, /Przejd\u017A do p\u0142atno\u015Bci/);
  assert.match(source, /B\u0142\u0105d uruchamiania p\u0142atno\u015Bci Stripe\/BLIK/);
  assert.doesNotMatch(source, /Platnosc/);
  assert.doesNotMatch(source, /Przejdz do platnosci/);
  assert.doesNotMatch(source, /Najlepszy wybor/);
  assert.doesNotMatch(source, /Blad uruchamiania platnosci/);
});
