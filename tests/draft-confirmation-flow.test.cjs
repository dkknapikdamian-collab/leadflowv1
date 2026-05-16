const test = require('node:test');
const assert = require('assert');
const { execFileSync } = require('child_process');
const path = require('path');

test('draft confirmation flow guard passes', () => {
  const out = execFileSync(process.execPath, [path.resolve('scripts/check-draft-confirmation-flow.cjs')], {
    encoding: 'utf8',
  });
  assert.match(out, /PASS check-draft-confirmation-flow/);
});

test('api/system routes drafts handler', () => {
  const fs = require('fs');
  const content = fs.readFileSync(path.resolve('api/system.ts'), 'utf8');
  assert.match(content, /kind === 'drafts'/);
  assert.match(content, /draftsHandler/);
});

test('server drafts exposes confirm cancel expire actions', () => {
  const fs = require('fs');
  const content = fs.readFileSync(path.resolve('src/server/drafts.ts'), 'utf8');
  assert.match(content, /action === 'confirm'/);
  assert.match(content, /action === 'cancel'/);
  assert.match(content, /action === 'expire'/);
  assert.match(content, /createFinalRecordFromDraft/);
});
