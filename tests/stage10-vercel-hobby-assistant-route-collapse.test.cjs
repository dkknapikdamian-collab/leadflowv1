const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

function apiFunctionFiles() {
  const base = path.join(root, 'api');
  const result = [];
  function walk(current) {
    for (const name of fs.readdirSync(current)) {
      const full = path.join(current, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (/\.(ts|js|mjs)$/.test(name) && !/\.d\.ts$/.test(name)) result.push(path.relative(root, full).replace(/\\/g, '/'));
    }
  }
  walk(base);
  return result.sort();
}

test('Stage10 removes assistant query as standalone Vercel function', () => {
  assert.equal(exists('api/assistant/query.ts'), false);
  const apiFiles = apiFunctionFiles();
  assert.ok(apiFiles.length <= 12, 'api function count should fit Hobby limit, got ' + apiFiles.length + ': ' + apiFiles.join(', '));
});

test('Stage10 keeps public assistant query URL through vercel rewrite', () => {
  const vercel = JSON.parse(read('vercel.json'));
  const rewrites = vercel.rewrites || [];
  const queryRewrite = rewrites.find((entry) => entry.source === '/api/assistant/query');
  assert.equal(queryRewrite.destination, '/api/system?kind=assistant-query');
  assert.ok(rewrites.findIndex((entry) => entry.source === '/api/assistant/query') < rewrites.findIndex((entry) => entry.source === '/api/assistant'));
  assert.match(read('src/lib/assistant-query-client.ts'), /fetch\('\/api\/assistant\/query'/);
});

test('Stage10 wires assistant-query into api/system route dispatcher', () => {
  const system = read('api/system.ts');
  assert.match(system, /assistant-query-handler\.js/);
  assert.match(system, /kind === 'assistant-query'/);
  assert.match(system, /assistantQueryHandler\(req, res, body\)/);
  const handler = read('src/server/assistant-query-handler.ts');
  assert.match(handler, /STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1/);
  assert.match(handler, /MAX_ASSISTANT_QUERY_BODY_BYTES\s*=\s*1024\s*\*\s*1024/);
  assert.match(handler, /emptyPromptApiResult/);
  assert.match(handler, /payload_too_large/);
  assert.match(handler, /dataPolicy:\s*'app_data_only'/);
});

test('Stage10 scripts are registered and package.json stays valid JSON without BOM', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notEqual(buffer[0], 0xef);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['check:stage10-vercel-hobby-assistant-route-collapse-v1'], 'node scripts/check-stage10-vercel-hobby-assistant-route-collapse.cjs');
  assert.equal(pkg.scripts['test:stage10-vercel-hobby-assistant-route-collapse-v1'], 'node --test tests/stage10-vercel-hobby-assistant-route-collapse.test.cjs');
});
