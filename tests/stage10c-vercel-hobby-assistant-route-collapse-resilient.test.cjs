const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
function countApiFunctions(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countApiFunctions(full);
    else if (/\.(ts|js|mjs|cjs)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) count += 1;
  }
  return count;
}

test('Stage10C removes the separate assistant query function file', () => {
  assert.equal(exists('api/assistant/query.ts'), false);
  assert.ok(exists('src/server/assistant-query-handler.ts'));
});

test('Stage10C preserves public /api/assistant/query through vercel rewrite', () => {
  const vercel = read('vercel.json');
  assert.match(vercel, /"source"\s*:\s*"\/api\/assistant\/query"/);
  assert.match(vercel, /"destination"\s*:\s*"\/api\/system\?kind=assistant-query"/);
});

test('Stage10C routes assistant-query kind inside api/system.ts', () => {
  const system = read('api/system.ts');
  assert.match(system, /assistant-query-handler\.js/);
  assert.match(system, /STAGE10C_ASSISTANT_QUERY_SYSTEM_KIND_ROUTE/);
  assert.match(system, /__stage10cKind === 'assistant-query'/);
  assert.match(system, /assistantQueryHandler\(req, res\)/);
});

test('Stage10C keeps Vercel Hobby API function count within limit', () => {
  assert.ok(countApiFunctions(path.join(root, 'api')) <= 12);
});

test('Stage10C scripts are registered and package.json has no BOM', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notEqual(buffer[0], 0xef);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['check:stage10c-vercel-hobby-assistant-route-collapse-resilient-v1'], 'node scripts/check-stage10c-vercel-hobby-assistant-route-collapse-resilient.cjs');
  assert.equal(pkg.scripts['test:stage10c-vercel-hobby-assistant-route-collapse-resilient-v1'], 'node --test tests/stage10c-vercel-hobby-assistant-route-collapse-resilient.test.cjs');
});
