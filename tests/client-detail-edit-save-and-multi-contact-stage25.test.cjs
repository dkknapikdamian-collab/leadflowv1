const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage25 closes client edit mode after successful save', () => {
  const source = read('src/pages/ClientDetail.tsx');
  assert.match(source, /CLIENT_DETAIL_EDIT_SAVE_CLOSE_STAGE25/);
  assert.match(source, /close client edit after save - stage25/);
  assert.match(source, /set[A-Za-z0-9_]+\(false\);/);
});

test('Stage25 adds plus-based multi email and phone fields in client edit form', () => {
  const source = read('src/pages/ClientDetail.tsx');
  assert.match(source, /CLIENT_DETAIL_MULTI_EMAIL_PHONE_STAGE25/);
  assert.match(source, /function ClientMultiContactField/);
  assert.match(source, /splitClientContactValue/);
  assert.match(source, /joinClientContactValue/);
  assert.match(source, /data-client-contact-repeat=\{kind\}/);
  assert.match(source, /data-client-contact-repeat-add=\{kind\}/);
  assert.match(source, /Dodaj kolejny email klienta/);
  assert.match(source, /Dodaj kolejny telefon klienta/);
});

test('Stage25 docs keep Polish encoding clean', () => {
  const doc = read('docs/STAGE25_CLIENT_EDIT_SAVE_AND_MULTI_CONTACT_2026-04-28.md');
  for (const marker of ['\u00c4', '\u00c5', '\u00c3', '\ufffd']) {
    assert.equal(doc.includes(marker), false, `Possible mojibake detected: ${marker}`);
  }
});
