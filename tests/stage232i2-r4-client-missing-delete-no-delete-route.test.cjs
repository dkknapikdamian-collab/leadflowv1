const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');

function deleteButtonBlock() {
  const marker = 'data-stage232i2-delete-source-item="true"';
  const idx = client.indexOf(marker);
  assert.ok(idx >= 0, 'delete source marker missing');
  const start = client.lastIndexOf('<Button', idx);
  const end = client.indexOf('</Button>', idx);
  assert.ok(start >= 0 && end > start, 'button range missing');
  return client.slice(start, end + '</Button>'.length);
}

test('R4 delete button uses no DELETE route', () => {
  const block = deleteButtonBlock();
  assert.match(block, /handleResolveClientMissingItemStage228R13\(item\)/);
  assert.doesNotMatch(block, /handleDeleteClientMissingItemStage228R15\(item\)/);
  assert.doesNotMatch(block, /deleteTaskFromSupabase\s*\(/);
});

test('R4 keeps visible delete marker and R3 fallback marker', () => {
  assert.match(client, /STAGE232I2_R4_CLIENT_MISSING_DELETE_NO_DELETE_ROUTE/);
  assert.match(client, /data-stage232i2-delete-source-item="true"/);
  assert.match(client, /STAGE232I2_R3_CLIENT_MISSING_DELETE_SOFT_DELETE/);
});
