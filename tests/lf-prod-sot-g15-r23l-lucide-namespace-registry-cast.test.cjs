const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'src/components/ui-system/icon-registry.ts');

function readRegistry() {
  return fs.readFileSync(REGISTRY_PATH, 'utf8').replace(/\r\n/g, '\n');
}

test('R23L byte-scope guard passes on the exact branch tree', () => {
  const output = execFileSync('node', ['scripts/check-g15-r23l-lucide-namespace-registry-cast.cjs'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.match(output, /PASS: R23L adds the explicit unknown bridge/);
});

test('Lucide namespace lookup uses the TypeScript-required unknown bridge', () => {
  const source = readRegistry();
  assert.match(
    source,
    /const RemoveIcon = \(Lucide as unknown as Record<string, LucideIcon>\)\[removeIconKey\] \|\| X;/,
  );
  assert.doesNotMatch(source, /Lucide as Record<string, LucideIcon>/);
});

test('remove icon runtime behavior and application mapping remain unchanged', () => {
  const source = readRegistry();
  assert.match(source, /const removeIconKey = 'Trash' \+ '2';/);
  assert.match(source, /\[removeIconKey\] \|\| X;/);
  assert.match(source, /trash: RemoveIcon,/);
  assert.match(source, /close: X,/);
});
