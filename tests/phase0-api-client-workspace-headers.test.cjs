const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

function includesAny(source, candidates) {
  return candidates.some((candidate) => source.includes(candidate));
}

test('runtime API client sends workspace and user identity headers', () => {
  const source = read('src/lib/supabase-fallback.ts');

  assert.ok(source.includes('x-workspace-id'), 'API client must send x-workspace-id');
  assert.ok(source.includes('x-user-id'), 'API client must send x-user-id');
  assert.ok(source.includes('x-user-email'), 'API client must send x-user-email');

  assert.ok(
    includesAny(source, [
      "headers['x-user-id'] = authContext.uid",
      'headers["x-user-id"] = authContext.uid',
      "headers['x-user-id'] = authContext.userId",
      'headers["x-user-id"] = authContext.userId',
    ]),
    'x-user-id should be copied from authContext, not hardcoded',
  );

  assert.ok(
    includesAny(source, [
      "headers['x-user-email'] = authContext.email",
      'headers["x-user-email"] = authContext.email',
      "headers['x-user-email'] = authContext.userEmail",
      'headers["x-user-email"] = authContext.userEmail',
    ]),
    'x-user-email should be copied from authContext, not hardcoded',
  );
});

test('server request scope accepts runtime identity headers used by Vercel API routes', () => {
  const source = read('src/server/_request-scope.ts');

  assert.ok(source.includes('x-workspace-id'), 'server scope must read x-workspace-id');
  assert.ok(source.includes('x-user-id'), 'server scope must read x-user-id');
  assert.ok(source.includes('x-user-email'), 'server scope must read x-user-email');
  assert.ok(
    source.includes('resolveRequestWorkspaceId') || source.includes('resolveRequestIdentity'),
    'request scope helper should keep explicit identity/workspace resolution helpers',
  );
});
