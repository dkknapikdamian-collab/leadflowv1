const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const repoRoot = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(repoRoot, p), 'utf8'); }

test('Billing page hides technical payment diagnostics from customer plan view', () => {
  const source = read('src/pages/Billing.tsx');

  assert.doesNotMatch(source, /Test płatności Stripe\/BLIK/);
  assert.doesNotMatch(source, /Sprawdź płatności/);
  assert.doesNotMatch(source, /Sprawdza konfigurację checkoutu bez tworzenia płatności/);
  assert.doesNotMatch(source, /handleBillingCheck/);
  assert.doesNotMatch(source, /billingCheckResult/);
  assert.doesNotMatch(source, /dryRun:\s*true/);
  assert.match(source, /Przejdź do płatności/);
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
