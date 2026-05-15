const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
const legacyTokens = [
  ['Leady do ', 'spięcia'].join(''),
  ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
  ['data-clients-lead-', 'attention-rail'].join(''),
  ['clients-lead-', 'attention-card'].join(''),
  ['leadsNeedingClientOr', 'CaseLink'].join(''),
];
test('clients page renders top value card instead of legacy rail', () => {
  const src = read('src/pages/Clients.tsx');
  assert.match(src, /TopValueRecordsCard/);
  assert.match(src, /Najcenniejsi klienci/);
  assert.match(src, /clients-top-value-records-card/);
  assert.ok(/buildTopClientValueEntries|mostValuableClients/.test(src), 'Clients page must compute top client value entries.');
  for (const token of legacyTokens) assert.equal(src.includes(token), false, token);
});
