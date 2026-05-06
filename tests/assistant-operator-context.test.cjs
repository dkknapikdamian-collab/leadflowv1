const test = require('node:test');
const assert = require('assert');
const fs = require('fs');

function read(rel) {
  return fs.readFileSync(rel, 'utf8');
}

test('assistant context uses workspace snapshot and does not stop on empty arrays', () => {
  const src = read('src/server/assistant-context.ts');
  assert.match(src, /Array\.isArray\(value\) && value\.length > 0/);
  assert.match(src, /\/api\/leads/);
  assert.match(src, /\/api\/work-items/);
  assert.match(src, /\/api\/clients/);
  assert.match(src, /\/api\/cases/);
  assert.match(src, /\/api\/activities/);
  assert.match(src, /kind=ai-drafts/);
});

test('assistant query handler builds context before answering', () => {
  const src = read('src/server/assistant-query-handler.ts');
  assert.match(src, /buildAssistantContextFromRequest/);
  assert.match(src, /runAssistantQuery/);
  assert.match(src, /normalizeAssistantResult/);
});
