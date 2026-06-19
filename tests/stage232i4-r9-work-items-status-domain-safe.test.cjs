const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const text = fs.readFileSync(path.join(process.cwd(), 'api', 'work-items.ts'), 'utf8');

test('missing_item creation uses DB-safe status and preserves type/client source', () => {
  const block = text.match(/const isMissingItemStage232I4R8 = isMissingItemTaskStage232I4R8\(\{\}, body\);[\s\S]*?res\.status\(200\)\.json\(normalizeTask\(inserted\)\);/)?.[0] || '';
  assert.match(block, /type: body\.type \|\| \(isMissingItemStage232I4R8 \? 'missing_item' : 'task'\)/);
  assert.match(block, /client_id: asNullableUuid\(body\.clientId\)/);
  assert.match(block, /status: isMissingItemStage232I4R8\s*\? normalizeMissingItemDbStatusStage232I4R9\(body\)\s*: normalizeTaskStatus\(body\.status\)/);
  assert.doesNotMatch(block, /status:[\s\S]{0,220}'blocking_missing_item'/);
});

test('blocking missing signal is not stored in rejected status domain', () => {
  assert.match(text, /const isBlockingMissingItemStage232I4R9/);
  assert.match(text, /priority: isMissingItemStage232I4R8[\s\S]{0,180}isBlockingMissingItemStage232I4R9/);
  assert.match(text, /return normalizeTaskStatus\('todo'\)/);
});

test('R8 source truth contract remains present', () => {
  assert.match(text, /STAGE232I4_R8/);
  assert.match(text, /sourceEntityType/);
  assert.match(text, /sourceEntityId/);
  assert.match(text, /recordId/);
});
