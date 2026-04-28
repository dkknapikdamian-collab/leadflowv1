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
  const oldHint = 'Jeżeli chcesz, żeby notatka albo kontakt trafiły do Szkiców AI';
  assert.ok(assistant.includes('STAGE35_AI_ASSISTANT_COMPACT_UI'));
  assert.equal(assistant.includes(oldHint), false);
});
