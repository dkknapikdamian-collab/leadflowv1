const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('P0 API scope rejects body workspaceId as access source', () => {
  const files = [
    'api/system.ts',
    'api/work-items.ts',
    'api/clients.ts',
    'api/cases.ts',
  ];

  for (const rel of files) {
    const text = read(rel);
    assert.equal(text.includes('workspaceId || await findWorkspaceId(body.workspaceId)'), false, rel);
    assert.equal(text.includes('findWorkspaceId(body.workspaceId)'), false, rel);
    assert.equal(text.includes('findWorkspaceId((body as any).workspaceId)'), false, rel);
    assert.equal(text.includes('asNullableString((body as any).workspaceId)'), false, rel);
  }
});

test('P0 API mutating endpoints keep write access and row scope guards', () => {
  const required = {
    'api/work-items.ts': [
      'assertWorkspaceWriteAccess(workspaceId, req)',
      "requireScopedRow('work_items'",
      'assertWorkspaceEntityLimit(finalWorkspaceId',
    ],
    'api/clients.ts': [
      'assertWorkspaceWriteAccess(workspaceId, req)',
      "requireScopedRow('clients'",
      'const finalWorkspaceId = workspaceId;',
    ],
    'api/cases.ts': [
      'assertWorkspaceWriteAccess(workspaceId, req)',
      "requireScopedRow('cases'",
      'withWorkspaceFilter(`leads?linked_case_id=eq.',
    ],
    'api/leads.ts': [
      'assertWorkspaceWriteAccess(workspaceId, req)',
      "requireScopedRow('leads'",
      'withWorkspaceFilter(',
    ],
  };

  for (const [rel, needles] of Object.entries(required)) {
    const text = read(rel);
    for (const needle of needles) {
      assert.equal(text.includes(needle), true, `${rel} missing ${needle}`);
    }
  }
});

test('P0 workspace settings require owner/admin scope', () => {
  const system = read('api/system.ts');
  const scope = read('src/server/_request-scope.ts');

  assert.equal(scope.includes('assertWorkspaceOwnerOrAdmin'), true);
  assert.equal(system.includes('assertWorkspaceOwnerOrAdmin(workspaceId, req)'), true);
  assert.equal(system.includes('resolveRequestWorkspaceId(req, body)'), true);
});
