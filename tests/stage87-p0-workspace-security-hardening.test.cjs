const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

test('Stage87 workspace scope uses verified auth context, not header/body/query as source of truth', () => {
  const scope = read('src/server/_request-scope.ts');

  assert.equal(scope.includes('if (headerWorkspaceId) return headerWorkspaceId;'), false);
  assert.equal(scope.includes('const identityWorkspaceId = asText(getRequestIdentity(req, body).workspaceId);'), false);
  assert.match(scope, /const context = await requireSupabaseRequestContext\(req\)/);
  assert.match(scope, /throw new RequestAuthError\(401, 'AUTH_WORKSPACE_REQUIRED'\)/);
  assert.match(scope, /workspace_members\?user_id=eq\./);
  assert.match(scope, /profiles\?workspace_id=eq\./);
});

test('Stage87 payments require write access and relation guards in workspace scope', () => {
  const payments = read('src/server/payments.ts');

  assert.equal(payments.includes('findWorkspaceId(body.workspaceId)'), false);
  assert.match(payments, /assertWorkspaceWriteAccess\(workspaceId, req\)/);
  assert.match(payments, /requireScopedRow\('clients', clientId, finalWorkspaceId, 'CLIENT_NOT_FOUND'\)/);
  assert.match(payments, /requireScopedRow\('leads', leadId, finalWorkspaceId, 'LEAD_NOT_FOUND'\)/);
  assert.match(payments, /requireScopedRow\('cases', caseId, finalWorkspaceId, 'CASE_NOT_FOUND'\)/);
});

test('Stage87 ai drafts mutations require request-bound write access and scoped linked-record guard', () => {
  const drafts = read('src/server/ai-drafts.ts');

  assert.match(drafts, /assertWorkspaceWriteAccess\(workspaceId, req\)/);
  assert.match(drafts, /function getLinkedTable\(/);
  assert.match(drafts, /AI_DRAFT_LINKED_RECORD_NOT_FOUND/);
  assert.match(drafts, /requireScopedRow\(linkedTable, linkedRecordId, workspaceId, 'AI_DRAFT_LINKED_RECORD_NOT_FOUND'\)/);
});
