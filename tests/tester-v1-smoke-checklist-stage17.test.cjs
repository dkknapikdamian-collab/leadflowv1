const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const docPath = path.join(process.cwd(), 'docs/STAGE17_TESTER_V1_SMOKE_CHECKLIST_2026-04-28.md');

test('Stage17 tester smoke checklist exists and covers core flow', () => {
  const doc = fs.readFileSync(docPath, 'utf8');
  for (const phrase of ['Logowanie', 'Dziś', 'Lead', 'Klient', 'Szkice AI', 'Billing', 'PWA']) {
    assert.match(doc, new RegExp(phrase));
  }
});

test('Stage17 checklist keeps Polish encoding clean', () => {
  const doc = fs.readFileSync(docPath, 'utf8');
  for (const token of ['\u00c4', '\u00c5', '\u00c3', '\u00c2', '\ufffd']) {
    assert.equal(doc.includes(token), false, 'mojibake: ' + token);
  }
});
