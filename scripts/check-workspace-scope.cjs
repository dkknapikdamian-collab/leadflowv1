#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const failures = [];
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) { failures.push(`${rel} missing`); return ''; }
  return fs.readFileSync(full, 'utf8');
}
function expect(cond, msg) { if (!cond) failures.push(msg); }
function hasAll(text, rel, needles) { for (const n of needles) expect(text.includes(n), `${rel} missing ${n}`); }

const supabase = read('src/server/_supabase.ts');
hasAll(supabase, 'src/server/_supabase.ts', ['STAGE15_SCOPED_SERVICE_ROLE_MUTATIONS', 'updateByIdScoped', 'deleteByIdScoped', 'workspace_id=eq.']);

const requestScope = read('src/server/_request-scope.ts');
hasAll(requestScope, 'src/server/_request-scope.ts', ['STAGE15_NO_BODY_WORKSPACE_TRUST', 'WORKSPACE_MEMBERSHIP_REQUIRED', 'workspace_members?user_id=eq.', 'profiles?workspace_id=eq.']);
expect(!requestScope.includes('body.workspaceId'), '_request-scope must not read body.workspaceId');
expect(!requestScope.includes('body.workspace_id'), '_request-scope must not read body.workspace_id');
expect(!requestScope.includes('firstQueryValue(query.workspaceId)'), '_request-scope must not read query.workspaceId');
expect(!requestScope.includes('firstQueryValue(query.workspace_id)'), '_request-scope must not read query.workspace_id');
expect(!requestScope.includes('if (identity.userId || identity.email) return true'), '_request-scope owner/admin fallback is too broad');

const accessGate = read('src/server/_access-gate.ts');
hasAll(accessGate, 'src/server/_access-gate.ts', ['STAGE15_ACCESS_GATE_REQUIRES_WORKSPACE_ID', 'WORKSPACE_ID_REQUIRED_FOR_ACCESS_GATE']);

const endpointFiles = [
  'api/leads.ts',
  'api/work-items.ts',
  'api/cases.ts',
  'api/clients.ts',
  'api/activities.ts',
];
for (const rel of endpointFiles) {
  const text = read(rel);
  hasAll(text, rel, ['resolveRequestWorkspaceId', 'workspaceId']);
  if (rel !== 'api/activities.ts') expect(text.includes('assertWorkspaceWriteAccess'), `${rel} missing write access gate`);
  if (rel !== 'api/leads.ts') expect(text.includes('requireScopedRow'), `${rel} missing requireScopedRow for scoped mutation/read proof`);
  expect(!/deleteById\(\s*['"](?:leads|clients|cases|work_items|activities)['"]/.test(text), `${rel} still uses unscoped deleteById on workspace-owned table`);
  expect(!/updateById\(\s*['"](?:leads|clients|cases|work_items|activities)['"]/.test(text), `${rel} still uses unscoped updateById on workspace-owned table`);
}

const vercel = read('vercel.json');
expect(vercel.includes('"source": "/api/tasks"') && vercel.includes('/api/work-items?kind=tasks'), 'vercel rewrite for /api/tasks -> work-items missing');
expect(vercel.includes('"source": "/api/events"') && vercel.includes('/api/work-items?kind=events'), 'vercel rewrite for /api/events -> work-items missing');

if (failures.length) {
  console.error('Workspace scope guard failed.');
  for (const f of failures.slice(0, 120)) console.error('- ' + f);
  if (failures.length > 120) console.error(`...and ${failures.length - 120} more`);
  process.exit(1);
}
console.log('OK: workspace scope guard passed.');
