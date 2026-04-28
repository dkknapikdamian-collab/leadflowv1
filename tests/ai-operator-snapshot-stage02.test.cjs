const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

test('AI operator snapshot stage 02 uses existing system endpoint and full app scope', () => {
  const context = read('src/server/assistant-context.ts');
  const system = read('api/system.ts');
  const global = read('src/components/GlobalAiAssistant.tsx');
  const today = read('src/components/TodayAiAssistant.tsx');

  assert.match(context, /AI_OPERATOR_SNAPSHOT_STAGE02/);
  assert.match(context, /leads/);
  assert.match(context, /clients/);
  assert.match(context, /cases/);
  assert.match(context, /tasks/);
  assert.match(context, /events/);
  assert.match(context, /drafts/);
  assert.match(context, /relations/);
  assert.match(context, /searchIndex/);
  assert.match(context, /operatorSnapshot/);
  assert.match(context, /noAutoWrite/);
  assert.match(system, /kind === 'assistant-context'/);
  assert.match(global, /AI_OPERATOR_SNAPSHOT_STAGE02_CONTEXT/);
  assert.match(today, /AI_OPERATOR_SNAPSHOT_STAGE02_PAYLOAD/);
});
