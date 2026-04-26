const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

test('Cases page no longer shows long intro helper copy in header', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/pages/Cases.tsx'), 'utf8');

  assert.doesNotMatch(source, /To jest główne miejsce pracy po rozpoczęciu obsługi/);
  assert.doesNotMatch(source, /które realizacje stoją/);
  assert.doesNotMatch(source, /gotowe do startu\./);
  assert.match(source, /<h1 className="text-3xl font-bold app-text">Sprawy<\/h1>/);
});
