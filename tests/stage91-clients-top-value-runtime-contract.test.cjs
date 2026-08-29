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
  assert.ok(source.includes('const clientFinanceByClientId = useMemo(() => {'), 'Missing client finance source memo.');
  assert.ok(source.includes('const activeCommissionValueStage232C = useMemo('), 'Missing active commission aggregate memo.');
  assert.ok(source.includes('.filter((client) => !client.archivedAt)'), 'Active commission totals must come from active clients.');
  assert.ok(source.includes('clientFinanceByClientId.get(client.id)?.activeCommission'), 'Active commission totals must use activeCommission.');
  assert.ok(source.includes('const activeCommissionRowsStage024 = useMemo'), 'Missing active commission row source.');
  assert.ok(source.includes('activeCommissionRowsStage024.reduce((sum, row) => sum + row.summary.commissionAmount, 0)'), 'Active commission rows must drive the commission aggregate.');
  assert.ok(source.includes('formatClientMoney(activeCommissionValueStage232C)'), 'Clients KPI must render the active commission aggregate.');
  assert.ok(source.includes('formatClientMoney(clientFinance.activeCommission)'), 'Client rows must render active commission values.');
  assert.equal(source.includes('TopValueRecordsCard'), false, 'Retired top value card must not remain in the current Clients view.');
  assert.equal(source.includes('topClientValueEntries'), false, 'Retired mixed value entries must not remain in the current Clients view.');
  assert.equal(source.includes('STAGE74_CLIENTS_TOP_VALUE_PANEL'), false, 'Old lead-linking top value comment must be removed.');
});
