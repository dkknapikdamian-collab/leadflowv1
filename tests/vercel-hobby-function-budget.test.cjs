const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.resolve(__dirname, '..');
const apiDir = path.join(repo, 'api');

function apiTsFiles() {
  return fs.readdirSync(apiDir)
    .filter((name) => name.endsWith('.ts'))
    .sort();
}

test('Vercel Hobby API function count stays within free limit', () => {
  const files = apiTsFiles();
  assert.ok(files.length <= 12, `api/*.ts count is ${files.length}, expected <= 12: ${files.join(', ')}`);
});

test('server helper files are not placed directly in api directory', () => {
  const helperFiles = apiTsFiles().filter((name) => name.startsWith('_'));
  assert.deepEqual(helperFiles, [], `Move helper files out of api/: ${helperFiles.join(', ')}`);
});

test('Stripe helper lives outside api function directory', () => {
  assert.equal(fs.existsSync(path.join(repo, 'api', '_stripe.ts')), false);
  assert.equal(fs.existsSync(path.join(repo, 'src', 'server', '_stripe.ts')), true);
});

test('service profiles endpoint is consolidated through system route when handler exists', () => {
  const serverHandler = path.join(repo, 'src', 'server', 'service-profiles.ts');
  if (!fs.existsSync(serverHandler)) return;

  const vercelJson = JSON.parse(fs.readFileSync(path.join(repo, 'vercel.json'), 'utf8'));
  const rewrite = (vercelJson.rewrites || []).find((item) => item.source === '/api/service-profiles');
  assert.ok(rewrite, 'Missing /api/service-profiles rewrite');
  assert.equal(rewrite.destination, '/api/system?kind=service-profiles');

  const systemSource = fs.readFileSync(path.join(repo, 'api', 'system.ts'), 'utf8');
  assert.match(systemSource, /serviceProfilesHandler/);
  assert.match(systemSource, /kind === 'service-profiles'/);
});
