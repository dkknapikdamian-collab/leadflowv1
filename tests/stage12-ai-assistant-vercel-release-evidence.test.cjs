const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const exists = (rel) => fs.existsSync(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function listApiFunctionFiles(dir = path.join(root, 'api')) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listApiFunctionFiles(full));
    } else if (entry.isFile() && ['.ts', '.js', '.mjs', '.cjs'].includes(path.extname(entry.name))) {
      if (!entry.name.endsWith('.d.ts')) result.push(full);
    }
  }
  return result;
}

test('Stage12 evidence printer exists', () => {
  assert.equal(exists('scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs'), true);
  const src = read('scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs');
  assert.ok(src.includes('STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_V1'));
  assert.ok(src.includes('api function count <= 12'));
  assert.ok(src.includes('api/assistant/query.ts removed'));
});

test('Stage12 assistant route stays collapsed under system API', () => {
  assert.equal(exists('api/assistant/query.ts'), false);
  const vercel = read('vercel.json');
  const system = read('api/system.ts');
  assert.ok(vercel.includes('"source": "/api/assistant/query"'));
  assert.ok(vercel.includes('"destination": "/api/system?kind=assistant-query"'));
  assert.ok(system.includes('STAGE10C_ASSISTANT_QUERY_SYSTEM_KIND_ROUTE'));
});

test('Stage12 API function budget stays inside Hobby limit', () => {
  const files = listApiFunctionFiles().map((file) => path.relative(root, file).replace(/\\/g, '/'));
  assert.ok(files.length <= 12, 'API function count must stay <= 12, got ' + files.length + ': ' + files.join(', '));
});
