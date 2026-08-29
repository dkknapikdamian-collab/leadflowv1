const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('current clients page keeps the Forteca directory owner and no retired relation rail', () => {
  const root = path.resolve(__dirname, '..');
  const clients = fs.readFileSync(path.join(root, 'src/pages/Clients.tsx'), 'utf8');
  assert.match(clients, /data-forteca-frt-021-runtime="true"/);
  assert.match(clients, /data-forteca-frt-021-table="true"/);
  assert.doesNotMatch(clients, /clients-top-value-records-card|TopValueRecordsCard|Najcenniejsi klienci/);
});
