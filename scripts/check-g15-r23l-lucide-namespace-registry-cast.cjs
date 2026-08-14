const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BASE_SHA = 'ab0f5c85f6cb3636c483debd13c04c5e29779c81';
const REGISTRY_PATH = 'src/components/ui-system/icon-registry.ts';

function normalize(text) {
  return String(text).replace(/\r\n/g, '\n');
}

function readCurrent(relativePath) {
  return normalize(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function readBase(relativePath) {
  return normalize(execFileSync('git', ['show', `${BASE_SHA}:${relativePath}`], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }));
}

const baseRegistry = readBase(REGISTRY_PATH);
const currentRegistry = readCurrent(REGISTRY_PATH);
const unsafeCast = 'const RemoveIcon = (Lucide as Record<string, LucideIcon>)[removeIconKey] || X;';
const explicitBoundaryCast = 'const RemoveIcon = (Lucide as unknown as Record<string, LucideIcon>)[removeIconKey] || X;';

assert.equal(
  baseRegistry.split(unsafeCast).length - 1,
  1,
  'R23K merge must contain exactly one Lucide namespace cast target',
);
const expectedRegistry = baseRegistry.replace(unsafeCast, explicitBoundaryCast);
assert.equal(
  currentRegistry,
  expectedRegistry,
  'icon-registry.ts must differ from the execution base only by the explicit unknown bridge',
);
assert.ok(currentRegistry.includes("const removeIconKey = 'Trash' + '2';"), 'dynamic remove icon key must remain unchanged');
assert.ok(currentRegistry.includes('[removeIconKey] || X;'), 'RemoveIcon fallback to X must remain unchanged');
assert.ok(currentRegistry.includes('trash: RemoveIcon,'), 'application trash icon mapping must remain unchanged');
assert.ok(currentRegistry.includes('client: UserRound,'), 'entity icon map must remain unchanged');
assert.doesNotMatch(currentRegistry, /Lucide as Record<string, LucideIcon>/, 'unsafe direct namespace cast must be removed');

console.log('PASS: R23L adds the explicit unknown bridge while preserving icon keys, maps, and runtime fallback byte-for-byte.');
