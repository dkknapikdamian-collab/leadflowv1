const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage86K checkout and billing actions use verified scoped workspace resolution', () => {
  const checkout = read('src/server/billing-checkout-handler.ts');
  const actions = read('src/server/billing-actions-handler.ts');

  assert.ok(checkout.includes('BILLING_CHECKOUT_RESOLVES_SCOPED_WORKSPACE_STAGE86K'));
  assert.ok(checkout.includes('resolveRequestWorkspaceId(req, body)'));
  assert.equal(checkout.includes('const workspaceId = asNullableText(authContext.workspaceId)'), false);
  assert.ok(checkout.includes('requestedWorkspaceId && requestedWorkspaceId !== workspaceId'));

  assert.ok(actions.includes('BILLING_ACTIONS_RESOLVE_SCOPED_WORKSPACE_STAGE86K'));
  assert.ok(actions.includes('resolveRequestWorkspaceId(req, body)'));
  assert.equal(actions.includes('const workspaceId = asText(auth.workspaceId)'), false);
});