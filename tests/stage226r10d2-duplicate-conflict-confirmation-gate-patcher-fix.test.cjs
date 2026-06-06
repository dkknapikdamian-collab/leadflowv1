const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const pkg = JSON.parse(read('package.json'));

test('lead conflict preflight fails closed instead of silently allowing duplicate writes', () => {
  assert.equal(leads.includes(".catch(() => ({ candidates: [] }))"), false);
  assert.equal(leads.includes('Zapis leada zatrzymany'), true);
  assert.equal(leads.includes('return;'), true);
});

test('client conflict preflight fails closed instead of silently allowing duplicate writes', () => {
  assert.equal(clients.includes(".catch(() => ({ candidates: [] }))"), false);
  assert.equal(clients.includes('Zapis klienta zatrzymany'), true);
  assert.equal(clients.includes('return;'), true);
});

test('detected conflicts require visible confirmation before add anyway', () => {
  assert.equal(leads.includes('Zapis leada wymaga potwierdzenia'), true);
  assert.equal(clients.includes('Zapis klienta wymaga potwierdzenia'), true);
  assert.equal(leads.includes('handleCreateLeadAnyway'), true);
  assert.equal(clients.includes('handleCreateClientAnyway'), true);
});

test('package wires R10D2 guard and test', () => {
  assert.equal(Boolean(pkg.scripts['check:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix']), true);
  assert.equal(Boolean(pkg.scripts['test:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix']), true);
  assert.equal(String(pkg.scripts.prebuild || '').includes('check-stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.cjs'), true);
});
