#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const checkout = read('src/server/billing-checkout-handler.ts');
const actions = read('src/server/billing-actions-handler.ts');
const fallback = read('src/lib/supabase-fallback.ts');

expect(checkout.includes('BILLING_CHECKOUT_RESOLVES_SCOPED_WORKSPACE_STAGE86K'), 'checkout marker missing');
expect(checkout.includes("import { requireAuthContext, resolveRequestWorkspaceId } from './_request-scope.js';"), 'checkout must import resolveRequestWorkspaceId');
expect(checkout.includes('resolveRequestWorkspaceId(req, body)'), 'checkout must resolve workspace from verified request scope');
expect(!checkout.includes('const workspaceId = asNullableText(authContext.workspaceId)'), 'checkout must not use authContext.workspaceId as only workspace source');
expect(checkout.includes('requestedWorkspaceId && requestedWorkspaceId !== workspaceId'), 'checkout must reject mismatched body workspace after verified resolution');

expect(actions.includes('BILLING_ACTIONS_RESOLVE_SCOPED_WORKSPACE_STAGE86K'), 'actions marker missing');
expect(actions.includes("import { resolveRequestWorkspaceId } from './_request-scope.js';"), 'actions must import resolveRequestWorkspaceId');
expect(actions.includes('resolveRequestWorkspaceId(req, body)'), 'actions must resolve workspace from verified request scope');
expect(!actions.includes('const workspaceId = asText(auth.workspaceId)'), 'actions must not use auth.workspaceId as only workspace source');

expect(fallback.includes('headers[\\'x-workspace-id\\'] = workspaceId') || fallback.includes('headers["x-workspace-id"] = workspaceId'), 'client must send x-workspace-id when stored');
expect(fallback.includes('body: JSON.stringify(input)'), 'checkout client must send workspaceId in body');

if (fail.length) {
  console.error('Stage86K billing workspace resolution guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS STAGE86K_BILLING_WORKSPACE_RESOLUTION');