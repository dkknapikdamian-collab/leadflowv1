const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('legacy clients relation panel guard retired in favor of stage79/stage81/stage83', () => {
  const root = path.resolve(__dirname, '..');
  const clients = fs.readFileSync(path.join(root, 'src/pages/Clients.tsx'), 'utf8');
  assert.match(clients, /clients-top-value-records-card|TopValueRecordsCard|Najcenniejsi klienci/);
});
