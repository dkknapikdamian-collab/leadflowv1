const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const repo = process.cwd();
const accessPath = path.join(repo, 'src/lib/access.ts');
const billingPath = path.join(repo, 'src/pages/Billing.tsx');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('Stage15 active plan copy is short and does not mention workflow without blocks', () => {
  const source = read(accessPath);
  assert.match(source, /description:\s*'Masz aktywny plan CloseFlow Pro\.'/);
  assert.doesNotMatch(source, /Masz aktywny plan CloseFlow Pro,\s*wi[e\u0119]c ca[l\u0142]y workflow dzia[l\u0142]a bez blokad\./u);
});

test('Stage15 removes dead Jak dzia\u0142a V1 billing explanation block', () => {
  const source = read(billingPath);
  assert.doesNotMatch(source, /Jak dzia\u0142a V1/u);
  assert.doesNotMatch(source, /Prosty model bez myl\u0105cych limit\u00F3w i ukrytych op\u0142at/u);
  assert.doesNotMatch(source, /<strong>Trial:<\/strong> startujesz od 14 dni testu z odblokowanym pe\u0142nym workflow/u);
  assert.doesNotMatch(source, /<strong>Po trialu:<\/strong> p\u0142acisz kart\u0105 albo BLIK przez Stripe i aktywujesz wybrany plan na 30 albo 365 dni/u);
  assert.doesNotMatch(source, /<strong>Statusy:<\/strong> trial, plan aktywny, problem z p\u0142atno\u015Bci\u0105 albo plan anulowany/u);
});

test('Stage15 keeps billing plan cards and payment CTA intact', () => {
  const source = read(billingPath);
  assert.match(source, /BILLING_PLANS/);
  assert.match(source, /Przejd\u017A do p\u0142atno\u015Bci/u);
  assert.match(source, /createBillingCheckoutSessionInSupabase/);
  assert.match(source, /Plan/);
  assert.match(source, /Rozliczenia/);
});
