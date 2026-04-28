const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage27 keeps Stage25 test free from literal mojibake markers', () => {
  const source = read('tests/client-detail-edit-save-and-multi-contact-stage25.test.cjs');
  const forbidden = [0x00c4, 0x00c5, 0x00c3, 0xfffd].map((code) => String.fromCharCode(code));

  for (const marker of forbidden) {
    assert.equal(source.includes(marker), false, 'Stage25 test contains a literal mojibake marker.');
  }

  assert.match(source, /\\u00c4/);
  assert.match(source, /\\u00c5/);
  assert.match(source, /\\u00c3/);
  assert.match(source, /\\ufffd/);
});
