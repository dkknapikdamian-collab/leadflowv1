const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

test('Cases page no longer shows long intro helper copy in header', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/pages/Cases.tsx'), 'utf8');

  assert.doesNotMatch(source, /To jest g\u0142\u00F3wne miejsce pracy po rozpocz\u0119ciu obs\u0142ugi/);
  assert.doesNotMatch(source, /kt\u00F3re realizacje stoj\u0105/);
  assert.doesNotMatch(source, /gotowe do startu\./);
  assert.ok(
    /<h1 className="text-3xl font-bold app-text">Sprawy<\/h1>/.test(source) ||
      (source.includes('CloseFlowPageHeaderV2') && source.includes('Sprawy')),
    'Cases page should expose the Sprawy title through legacy h1 or the current header V2',
  );
});
