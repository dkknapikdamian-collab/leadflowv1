
// STAGE5_AI_READ_QUERY_HARDENING_V1
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('stage5 fixes duplicate prefixed declaration that would break TypeScript build', () => {
  const assistant = read('src/server/ai-assistant.ts');
  const matches = assistant.match(/const prefixed = prefixedMatches\.find/g) || [];
  assert.equal(matches.length, 1);
});

test('time-window questions use overlap, not only exact start time', () => {
  const assistant = read('src/server/ai-assistant.ts');
  assert.match(assistant, /function itemOverlapsWindow/);
  assert.match(assistant, /range\.start\.getTime\(\) < end\.getTime\(\) && range\.end\.getTime\(\) > start\.getTime\(\)/);
  assert.match(assistant, /relevantTimedItems\(context\)\.filter\(\(item\) => itemOverlapsWindow\(item, window\.start, window\.end\)\)/);
});

test('contact lookup handles Polish inflection for Marka -> Marek', () => {
  const assistant = read('src/server/ai-assistant.ts');
  assert.match(assistant, /NAME_INFLECTIONS/);
  assert.match(assistant, /marka:\s*\["marek"\]/);
  assert.match(assistant, /itemMatchesLookup\(item, wanted\)/);
});
