const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('clients top value rail uses defined formatter and client source', () => {
  const source = read('src/pages/Clients.tsx');

  assert.ok(source.includes('function formatClientMoney(value: number)'), 'Clients.tsx must define formatClientMoney.');
  assert.equal(source.includes('formatClientValue('), false, 'Clients.tsx must not call undefined formatClientValue.');
  assert.ok(source.includes('const topClientValueEntries = useMemo(() => {'), 'Missing topClientValueEntries memo.');
  assert.ok(source.includes('.filter((client) => !client.archivedAt)'), 'Top value clients must come from active clients.');
  assert.ok(source.includes('clientValueByClientId.get(client.id)'), 'Top value clients must use clientValueByClientId.');
  assert.equal(source.includes('STAGE74_CLIENTS_TOP_VALUE_PANEL'), false, 'Old lead-linking top value comment must be removed.');

  const cardMatches = source.match(/dataTestId="clients-top-value-records-card"/g) || [];
  assert.equal(cardMatches.length, 1, 'Clients page must render exactly one clients top value card.');
});
