const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

test('runtime API client bypasses browser HTTP cache for workspace-scoped GETs', () => {
  const source = read('src/lib/supabase-fallback.ts');

  assert.match(source, /const requestInit:\s*RequestInit\s*=\s*\{/);
  assert.match(source, /if \(useCache\) requestInit\.cache = ['"]no-store['"];/);
  assert.match(source, /fetch\(path, requestInit\)/);
});

test('clients API responses are explicitly non-cacheable', () => {
  const source = read('api/clients.ts');

  assert.match(source, /res\.setHeader\(['"]Cache-Control['"], ['"]private, no-store, no-cache, must-revalidate, max-age=0['"]\)/);
});
