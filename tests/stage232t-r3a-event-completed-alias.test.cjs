const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

test('event route maps completed UI status to persisted done status', () => {
  const route = read('src/server/event-route-stage124f.ts');
  assert.match(route, /normalizeEventStatusForDbStage232T_R3A/);
  assert.match(route, /EVENT_COMPLETED_ALIASES_STAGE232T_R3A/);
  assert.match(route, /return 'done'/);
  assert.match(route, /normalizeEventStatusForDbStage232T_R3A\(body\.status\)/);
  assert.doesNotMatch(route, /payload\.status = body\.status;/);
});
