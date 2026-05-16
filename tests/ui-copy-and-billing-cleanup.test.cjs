const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();

const forbiddenCopy = [
  /Lead\s+to\s+temat\s+do\s+pozyskania\.\s*Po\s+rozpocz\u0119ciu\s+obs\u0142ugi\s+dalsza\s+praca\s+przechodzi\s+do\s+sprawy\./i,
  /Ten\s+rekord\s+zosta\u0142\s+ju\u017C\s+wpi\u0119ty\s+w\s+spraw\u0119/i,
  /Wsp\u00F3lny\s+rekord\s+klienta\s+w\s+tle:\s*leady,\s*sprawy\s+i\s+rozliczenia\s+w\s+jednym\s+miejscu\./i,
  /Zarz\u0105dzaj\s+codzienn\u0105\s+egzekucj\u0105\s+i\s+powtarzalnymi\s+ruchami\./i,
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

  assert.doesNotMatch(source, /Test p\u0142atno\u015Bci Stripe\/BLIK/);
  assert.doesNotMatch(source, /Sprawd\u017A p\u0142atno\u015Bci/);
  assert.doesNotMatch(source, /Sprawdza konfiguracj\u0119 checkoutu bez tworzenia p\u0142atno\u015Bci/);
  assert.doesNotMatch(source, /handleBillingCheck/);
  assert.doesNotMatch(source, /billingCheckResult/);
  assert.doesNotMatch(source, /billingCheckLoading/);
  assert.doesNotMatch(source, /dryRun:\s*true/);
  assert.match(source, /Przejd\u017A do p\u0142atno\u015Bci/);
});
