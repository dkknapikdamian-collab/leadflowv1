const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const repoRoot = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(repoRoot, p), 'utf8'); }

test('Billing page exposes Stripe/BLIK diagnostics button without redirecting', () => {
  const source = read('src/pages/Billing.tsx');
  assert.match(source, /const handleBillingCheck = async \(\) =>/);
  assert.match(source, /dryRun: true/);
  assert.match(source, /Sprawdź płatności/);
  assert.match(source, /Test płatności Stripe\/BLIK/);
  assert.match(source, /Sprawdza konfigurację checkoutu bez tworzenia płatności/);
  assert.match(source, /checkoutConfigured/);
  assert.match(source, /webhookConfigured/);
});

test('Billing page has corrected Polish user-facing labels', () => {
  const source = read('src/pages/Billing.tsx');
  assert.match(source, /Płatność kartą lub BLIK/);
  assert.match(source, /Najlepszy wybór/);
  assert.match(source, /Pełny workflow/);
  assert.match(source, /Wybierz okres dostępu/);
  assert.match(source, /Przejdź do płatności/);
  assert.match(source, /Błąd uruchamiania płatności Stripe\/BLIK/);
  assert.doesNotMatch(source, /Platnosc/);
  assert.doesNotMatch(source, /Przejdz do platnosci/);
  assert.doesNotMatch(source, /Najlepszy wybor/);
  assert.doesNotMatch(source, /Blad uruchamiania platnosci/);
});
