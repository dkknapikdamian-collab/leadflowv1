const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();

const forbiddenCopy = [
  /Lead\s+to\s+temat\s+do\s+pozyskania\.\s*Po\s+rozpoczęciu\s+obsługi\s+dalsza\s+praca\s+przechodzi\s+do\s+sprawy\./i,
  /Ten\s+rekord\s+został\s+już\s+wpięty\s+w\s+sprawę/i,
  /Wspólny\s+rekord\s+klienta\s+w\s+tle:\s*leady,\s*sprawy\s+i\s+rozliczenia\s+w\s+jednym\s+miejscu\./i,
  /Zarządzaj\s+codzienną\s+egzekucją\s+i\s+powtarzalnymi\s+ruchami\./i,
  /Stan\s+operacyjny/i,
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('requested helper copy is removed from target UI files', () => {
  const files = [
    'src/pages/Leads.tsx',
    'src/pages/CaseDetail.tsx',
    'src/pages/Clients.tsx',
    'src/pages/Tasks.tsx',
    'src/pages/Cases.tsx',
  ];

  const offenders = files.filter((file) => {
    const source = fs.existsSync(path.join(root, file)) ? read(file) : '';
    return forbiddenCopy.some((pattern) => pattern.test(source));
  });

  assert.deepEqual(offenders, []);
});

test('Billing plan page does not expose technical payment diagnostics card', () => {
  const source = read('src/pages/Billing.tsx');

  assert.doesNotMatch(source, /Test płatności Stripe\/BLIK/);
  assert.doesNotMatch(source, /Sprawdź płatności/);
  assert.doesNotMatch(source, /Sprawdza konfigurację checkoutu bez tworzenia płatności/);
  assert.doesNotMatch(source, /handleBillingCheck/);
  assert.doesNotMatch(source, /billingCheckResult/);
  assert.doesNotMatch(source, /billingCheckLoading/);
  assert.doesNotMatch(source, /dryRun:\s*true/);
  assert.match(source, /Przejdź do płatności/);
});
