const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
function listApiFunctionFiles(dir = path.join(root, 'api')) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...listApiFunctionFiles(full));
    else if (/\.(ts|js|mjs|cjs)$/i.test(entry.name) && !/\.d\.ts$/i.test(entry.name)) result.push(full);
  }
  return result;
}

test('Stage11 keeps Vercel Hobby physical API function count within 12', () => {
  const files = listApiFunctionFiles().map((file) => path.relative(root, file).replace(/\\/g, '/'));
  assert.ok(files.length <= 12, 'API function count must stay <= 12, got ' + files.length + ': ' + files.join(', '));
});

test('Stage11 keeps assistant query collapsed under api/system', () => {
  assert.equal(exists('api/assistant/query.ts'), false);
  assert.match(read('vercel.json'), /"source"\s*:\s*"\/api\/assistant\/query"/);
  assert.match(read('vercel.json'), /"destination"\s*:\s*"\/api\/system\?kind=assistant-query"/);
  assert.match(read('api/system.ts'), /STAGE10C_ASSISTANT_QUERY_SYSTEM_KIND_ROUTE/);
  assert.match(read('api/system.ts'), /__stage10cKind\s*===\s*'assistant-query'/);
});

test('Stage11 guard and release doc exist', () => {
  assert.equal(exists('scripts/check-stage11-vercel-hobby-function-budget-guard.cjs'), true);
  const doc = read('docs/release/STAGE11_VERCEL_HOBBY_FUNCTION_BUDGET_GUARD_V1_2026-05-06.md');
  assert.match(doc, /STAGE11_VERCEL_HOBBY_FUNCTION_BUDGET_GUARD_V1/);
  assert.match(doc, /api function count <= 12/);
});
