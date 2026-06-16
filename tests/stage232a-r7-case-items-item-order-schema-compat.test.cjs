const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const api = fs.readFileSync('api/case-items.ts', 'utf8');

test('STAGE232A R7 GET case-items has item_order fallback', () => {
  assert.match(api, /selectFirstAvailable\(\[/);
  assert.match(api, /order=item_order\.asc,created_at\.asc/);
  assert.match(api, /order=created_at\.asc&limit=500/);
});

test('STAGE232A R7 POST case-items retries without item_order', () => {
  assert.match(api, /const basePayload = \{/);
  assert.match(api, /const payloadWithItemOrder = \{ \.\.\.basePayload, item_order: Number\(body\.order \|\| 0\) \};/);
  assert.match(api, /const payloadWithoutItemOrder = \{ \.\.\.basePayload \};/);
  assert.match(api, /insertWithVariants\(\['case_items'\], \[payloadWithItemOrder, payloadWithoutItemOrder\]\)/);
});

test('STAGE232A R7 base payload does not require item_order', () => {
  const postStart = api.indexOf('const basePayload = {');
  const postEnd = api.indexOf('const payloadWithItemOrder', postStart);
  assert.ok(postStart > -1 && postEnd > postStart);
  assert.doesNotMatch(api.slice(postStart, postEnd), /item_order/);
});
