const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Stage35b compatibility file exists after Stage35c repair', () => {
  const assistant = read('src/components/TodayAiAssistant.tsx');
  const oldHint = 'Je\u017Celi chcesz, \u017Ceby notatka albo kontakt trafi\u0142y do Szkic\u00F3w AI';
  assert.ok(assistant.includes('STAGE35_AI_ASSISTANT_COMPACT_UI'));
  assert.equal(assistant.includes(oldHint), false);
});
