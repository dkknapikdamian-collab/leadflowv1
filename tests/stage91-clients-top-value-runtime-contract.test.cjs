const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('clients top value rail uses active commission source truth', () => {
  const source = read('src/pages/Clients.tsx');

  assert.ok(source.includes('function formatClientMoney(value: number)'), 'Clients.tsx must define formatClientMoney.');
  assert.equal(source.includes('formatClientValue('), false, 'Clients.tsx must not call undefined formatClientValue.');
  assert.ok(source.includes('const topClientCommissionEntriesStage232C = useMemo(() => {'), 'Missing active commission top entries memo.');
  assert.ok(source.includes('.filter((client) => !client.archivedAt)'), 'Top commission clients must come from active clients.');
  assert.ok(source.includes('clientFinanceByClientId.get(client.id)?.activeCommission'), 'Top commission clients must use activeCommission.');
  assert.ok(source.includes('items={topClientCommissionEntriesStage232C.map'), 'TopValueRecordsCard must render active commission entries.');
  assert.equal(source.includes('items={topClientValueEntries.map'), false, 'Top value card must not render legacy mixed value entries.');
  assert.equal(source.includes('STAGE74_CLIENTS_TOP_VALUE_PANEL'), false, 'Old lead-linking top value comment must be removed.');

  const cardMatches = source.match(/dataTestId="clients-top-value-records-card"/g) || [];
  assert.equal(cardMatches.length, 1, 'Clients page must render exactly one clients top value card.');
});
