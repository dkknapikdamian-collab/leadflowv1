const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('request scope helper exists outside api directory for Vercel function budget', () => {
  assert.equal(fs.existsSync(path.join(repoRoot, 'api', '_request-scope.ts')), false);
  assert.equal(fs.existsSync(path.join(repoRoot, 'src', 'server', '_request-scope.ts')), true);

  const helper = read('src/server/_request-scope.ts');
  assert.match(helper, /export function asText/);
  assert.match(helper, /export function getRequestIdentity/);
  assert.match(helper, /export async function resolveRequestWorkspaceId/);
  assert.match(helper, /export function withWorkspaceFilter/);
  assert.match(helper, /export async function fetchSingleScopedRow/);
  assert.match(helper, /export async function requireScopedRow/);
});

test('API routes import request scope helper from src server', () => {
  const apiDir = path.join(repoRoot, 'api');
  const apiFiles = fs.readdirSync(apiDir).filter((fileName) => fileName.endsWith('.ts'));

  for (const fileName of apiFiles) {
    const content = read(path.join('api', fileName));
    assert.doesNotMatch(content, /from ['"]\.\/_request-scope\.js['"]/);
  }

  const usesRequestScope = apiFiles
    .map((fileName) => read(path.join('api', fileName)))
    .some((content) => content.includes("../src/server/_request-scope.js"));

  assert.equal(usesRequestScope, true);
});
