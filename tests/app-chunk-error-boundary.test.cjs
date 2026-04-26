const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('app wraps lazy routes with chunk error boundary', () => {
  const app = read('src/App.tsx');
  const boundary = read('src/components/AppChunkErrorBoundary.tsx');

  assert.match(app, /AppChunkErrorBoundary/);
  assert.match(app, /<AppChunkErrorBoundary>/);
  assert.match(app, /<\/AppChunkErrorBoundary>/);
  assert.ok(app.indexOf('<AppChunkErrorBoundary>') < app.indexOf('<Suspense fallback={<AppRouteFallback />}>'));
  assert.ok(app.indexOf('</Suspense>') < app.indexOf('</AppChunkErrorBoundary>'));
  assert.match(boundary, /declare readonly props/);
  assert.match(boundary, /Failed to fetch dynamically imported module/);
  assert.match(boundary, /window\.caches\.keys/);
  assert.match(boundary, /window\.location\.reload/);
});
