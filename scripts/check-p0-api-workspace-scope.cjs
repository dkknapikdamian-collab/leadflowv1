#!/usr/bin/env node
/*
  P0/P1 API workspace scope guard.

  Service role is allowed only behind explicit request scope. This guard blocks
  the most dangerous regressions:
  - body/query workspaceId as access source,
  - mutating endpoints without assertWorkspaceWriteAccess,
  - update/delete endpoints without requireScopedRow,
  - unscoped best-effort case relation patches.
*/

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    failures.push(`${rel} is missing`);
    return '';
  }
  return fs.readFileSync(abs, 'utf8');
}

function mustInclude(rel, needle, label = needle) {
  const text = read(rel);
  if (!text.includes(needle)) failures.push(`${rel} missing: ${label}`);
}

function mustNotInclude(rel, needle, label = needle) {
  const text = read(rel);
  if (text.includes(needle)) failures.push(`${rel} still contains: ${label}`);
}

function mustMatch(rel, pattern, label) {
  const text = read(rel);
  if (!pattern.test(text)) failures.push(`${rel} missing pattern: ${label}`);
}

const requestScope = read('src/server/_request-scope.ts');
if (!requestScope.includes('export async function assertWorkspaceOwnerOrAdmin')) {
  failures.push('src/server/_request-scope.ts missing assertWorkspaceOwnerOrAdmin');
}
if (!requestScope.includes('WORKSPACE_OWNER_REQUIRED')) {
  failures.push('src/server/_request-scope.ts missing WORKSPACE_OWNER_REQUIRED');
}

const system = read('api/system.ts');
[
  'assertWorkspaceOwnerOrAdmin',
  'assertWorkspaceWriteAccess(workspaceId, req)',
  'resolveRequestWorkspaceId(req, body)',
].forEach((needle) => {
  if (!system.includes(needle)) failures.push(`api/system.ts missing: ${needle}`);
});
[
  'findWorkspaceId((body as any).workspaceId)',
  'asNullableString((body as any).workspaceId)',
  'findWorkspaceId(body.workspaceId)',
  'workspaceId || await findWorkspaceId(body.workspaceId)',
].forEach((needle) => {
  if (system.includes(needle)) failures.push(`api/system.ts still contains unsafe workspace source: ${needle}`);
});

const workItems = read('api/work-items.ts');
[
  'assertWorkspaceWriteAccess(workspaceId, req)',
  'assertWorkspaceEntityLimit(finalWorkspaceId, kind === \'events\' ? \'event\' : \'task\')',
  'P0_SERVICE_ROLE_SCOPE_MUTATION_GATE',
  'P0_SERVICE_ROLE_SCOPE_RELATION_GUARD',
  'requireScopedRow(\'work_items\'',
].forEach((needle) => {
  if (!workItems.includes(needle)) failures.push(`api/work-items.ts missing: ${needle}`);
});
[
  'findWorkspaceId(body.workspaceId)',
  'workspaceId || await findWorkspaceId(body.workspaceId)',
  'findWorkspaceId,',
].forEach((needle) => {
  if (workItems.includes(needle)) failures.push(`api/work-items.ts still contains unsafe workspace fallback: ${needle}`);
});

const clients = read('api/clients.ts');
[
  'assertWorkspaceWriteAccess(workspaceId, req)',
  'P0_SERVICE_ROLE_SCOPE_MUTATION_GATE',
  'const finalWorkspaceId = workspaceId;',
  'requireScopedRow(\'clients\'',
].forEach((needle) => {
  if (!clients.includes(needle)) failures.push(`api/clients.ts missing: ${needle}`);
});
[
  'findWorkspaceId(body.workspaceId)',
  'workspaceId || await findWorkspaceId(body.workspaceId)',
  'findWorkspaceId,',
].forEach((needle) => {
  if (clients.includes(needle)) failures.push(`api/clients.ts still contains unsafe workspace fallback: ${needle}`);
});

const cases = read('api/cases.ts');
[
  'assertWorkspaceWriteAccess(workspaceId, req)',
  'P0_SERVICE_ROLE_SCOPE_MUTATION_GATE',
  'P0_SERVICE_ROLE_SCOPE_RELATION_GUARD',
  'withWorkspaceFilter(`leads?linked_case_id=eq.',
  'withWorkspaceFilter(`work_items?case_id=eq.',
  'requireScopedRow(\'cases\'',
].forEach((needle) => {
  if (!cases.includes(needle)) failures.push(`api/cases.ts missing: ${needle}`);
});
[
  'findWorkspaceId(body.workspaceId)',
  'workspaceId || await findWorkspaceId(body.workspaceId)',
].forEach((needle) => {
  if (cases.includes(needle)) failures.push(`api/cases.ts still contains unsafe workspace fallback: ${needle}`);
});

const leads = read('api/leads.ts');
[
  'resolveRequestWorkspaceId(req)',
  'assertWorkspaceWriteAccess(workspaceId, req)',
  'requireScopedRow(\'leads\'',
  'withWorkspaceFilter(',
].forEach((needle) => {
  if (!leads.includes(needle)) failures.push(`api/leads.ts missing expected existing scope marker: ${needle}`);
});

const billingCheckout = read('src/server/billing-checkout-handler.ts');
[
  'const authContext = await requireAuthContext(req)',
  'const workspaceId = asNullableText(authContext.workspaceId)',
  'if (requestedWorkspaceId && requestedWorkspaceId !== workspaceId)',
].forEach((needle) => {
  if (!billingCheckout.includes(needle)) failures.push(`billing-checkout-handler.ts missing safe workspace mismatch marker: ${needle}`);
});

const billingActions = read('src/server/billing-actions-handler.ts');
[
  'const auth = await requireAuthContext(req)',
  'const workspaceId = asText(auth.workspaceId)',
  'updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`',
].forEach((needle) => {
  if (!billingActions.includes(needle)) failures.push(`billing-actions-handler.ts missing scoped billing marker: ${needle}`);
});

// Global body.workspaceId rule. Some handlers may accept it only as a mismatch
// check, never as a fallback access source.
const scanned = [
  'api/system.ts',
  'api/work-items.ts',
  'api/clients.ts',
  'api/cases.ts',
  'api/leads.ts',
  'src/server/billing-checkout-handler.ts',
  'src/server/billing-actions-handler.ts',
];

for (const rel of scanned) {
  const text = read(rel);
  const unsafePatterns = [
    /findWorkspaceId\s*\(\s*body\.workspaceId\s*\)/,
    /findWorkspaceId\s*\(\s*\(body as any\)\.workspaceId\s*\)/,
    /workspaceId\s*\|\|\s*await\s+findWorkspaceId/,
    /workspaceId\s*=\s*.*body\.workspaceId/,
    /workspaceId\s*=\s*.*\(body as any\)\.workspaceId/,
  ];
  for (const pattern of unsafePatterns) {
    if (pattern.test(text)) failures.push(`${rel} has unsafe workspaceId access pattern ${pattern}`);
  }
}

if (failures.length) {
  console.error('P0 API workspace scope guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: P0 API workspace scope guard passed.');
