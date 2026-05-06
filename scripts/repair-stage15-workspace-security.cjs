#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const touched = [];

function p(rel) { return path.join(root, rel); }
function exists(rel) { return fs.existsSync(p(rel)); }
function read(rel) {
  if (!exists(rel)) return '';
  return fs.readFileSync(p(rel), 'utf8');
}
function write(rel, text) {
  const full = p(rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, 'utf8');
}
function save(rel, before, after) {
  if (before !== after) {
    write(rel, after);
    touched.push(rel);
  }
}
function addImportNames(text, names) {
  return text.replace(/import \{([^}]+)\} from ['"]\.\.\/src\/server\/_supabase\.js['"];?/m, (match, group) => {
    const current = group.split(',').map((s) => s.trim()).filter(Boolean);
    for (const name of names) if (!current.includes(name)) current.push(name);
    return `import { ${current.join(', ')} } from '../src/server/_supabase.js';`;
  });
}

function patchPackageJson() {
  const rel = 'package.json';
  const before = read(rel);
  if (!before) return;
  let pkg;
  try { pkg = JSON.parse(before); } catch (error) { console.error('package.json parse failed', error.message); process.exit(1); }
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:workspace-scope'] = 'node scripts/check-workspace-scope.cjs';
  pkg.scripts['check:no-body-workspace-trust'] = 'node scripts/check-no-body-workspace-trust.cjs';
  pkg.scripts['test:workspace-isolation'] = 'node --test tests/workspace-isolation.test.cjs';
  const after = JSON.stringify(pkg, null, 2) + '\n';
  save(rel, before, after);
}

function patchSupabase() {
  const rel = 'src/server/_supabase.ts';
  const before = read(rel);
  if (!before) return;
  let text = before;
  if (!text.includes('STAGE15_SCOPED_SERVICE_ROLE_MUTATIONS')) {
    const block = [
      '',
      '// STAGE15_SCOPED_SERVICE_ROLE_MUTATIONS',
      '// Service role bypasses RLS, therefore workspace-owned rows must be mutated with an explicit workspace_id filter.',
      "export async function updateByIdScoped(table: string, id: string, workspaceId: string, payload: RecordMap, idColumn = 'id', workspaceColumn = 'workspace_id') {",
      '  const encodedId = encodeURIComponent(id);',
      '  const encodedWorkspaceId = encodeURIComponent(workspaceId);',
      "  return supabaseRequest(table + '?' + idColumn + '=eq.' + encodedId + '&' + workspaceColumn + '=eq.' + encodedWorkspaceId, {",
      "    method: 'PATCH',",
      '    body: JSON.stringify(payload),',
      '  });',
      '}',
      '',
      "export async function deleteByIdScoped(table: string, id: string, workspaceId: string, idColumn = 'id', workspaceColumn = 'workspace_id') {",
      '  const encodedId = encodeURIComponent(id);',
      '  const encodedWorkspaceId = encodeURIComponent(workspaceId);',
      "  return supabaseRequest(table + '?' + idColumn + '=eq.' + encodedId + '&' + workspaceColumn + '=eq.' + encodedWorkspaceId, {",
      "    method: 'DELETE',",
      '    headers: {',
      "      Prefer: 'return=representation',",
      '    },',
      '  });',
      '}',
    ].join('\n');
    text = text.replace(/export function withWorkspaceFilter\(/, block + '\nexport function withWorkspaceFilter(');
  }
  save(rel, before, text);
}

function patchRequestScope() {
  const rel = 'src/server/_request-scope.ts';
  const before = read(rel);
  if (!before) return;
  let text = before;
  text = text.replace(
    /  \/\/ Runtime compatibility guard:[\s\S]*?if \(identity\.userId \|\| identity\.email\) return true;\s*/,
    '  // STAGE15_NO_AUTH_ONLY_WORKSPACE_FALLBACK: authenticated user alone is not enough for another workspace.\n',
  );
  const replacement = `export async function resolveRequestWorkspaceId(req: any, bodyInput?: any) {
  void bodyInput;
  // STAGE15_NO_BODY_WORKSPACE_TRUST
  // workspaceId from request body/query is never trusted as the workspace source.
  // Optional x-workspace-id can only disambiguate an authenticated user that is already a member/profile of that workspace.
  const hintedWorkspaceId = asText(
    requestHeader(req, 'x-workspace-id')
    || requestHeader(req, 'x-closeflow-workspace-id'),
  );

  const context = await requireSupabaseRequestContext(req);
  const contextWorkspaceId = asText(context.workspaceId);
  if (contextWorkspaceId) return contextWorkspaceId;

  const contextUserId = asText(context.userId);
  const contextEmail = asText(context.email).toLowerCase();
  if (!contextUserId && !contextEmail) {
    throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');
  }

  if (hintedWorkspaceId) {
    if (contextUserId) {
      const membershipRows = await selectRows(
        \`workspace_members?user_id=eq.\${encodeURIComponent(contextUserId)}&workspace_id=eq.\${encodeURIComponent(hintedWorkspaceId)}&select=workspace_id&limit=1\`,
      );
      if (membershipRows[0]) return hintedWorkspaceId;
    }

    const profileQueries = [
      contextEmail
        ? \`profiles?workspace_id=eq.\${encodeURIComponent(hintedWorkspaceId)}&email=eq.\${encodeURIComponent(contextEmail)}&select=workspace_id&limit=1\`
        : '',
      contextUserId
        ? \`profiles?workspace_id=eq.\${encodeURIComponent(hintedWorkspaceId)}&auth_uid=eq.\${encodeURIComponent(contextUserId)}&select=workspace_id&limit=1\`
        : '',
      contextUserId
        ? \`profiles?workspace_id=eq.\${encodeURIComponent(hintedWorkspaceId)}&firebase_uid=eq.\${encodeURIComponent(contextUserId)}&select=workspace_id&limit=1\`
        : '',
      isLikelyUuid(contextUserId)
        ? \`profiles?workspace_id=eq.\${encodeURIComponent(hintedWorkspaceId)}&id=eq.\${encodeURIComponent(contextUserId)}&select=workspace_id&limit=1\`
        : '',
    ].filter(Boolean);
    for (const profileQuery of profileQueries) {
      const profileRows = await selectRows(profileQuery);
      if (profileRows[0]) return hintedWorkspaceId;
    }

    throw new RequestAuthError(403, 'WORKSPACE_MEMBERSHIP_REQUIRED');
  }

  if (contextUserId) {
    const membershipRows = await selectRows(
      \`workspace_members?user_id=eq.\${encodeURIComponent(contextUserId)}&select=workspace_id&limit=1\`,
    );
    const membershipWorkspaceId = asText(membershipRows[0]?.workspace_id);
    if (membershipWorkspaceId) return membershipWorkspaceId;
  }

  const profileQueries = [
    contextEmail ? \`profiles?email=eq.\${encodeURIComponent(contextEmail)}&select=workspace_id&limit=1\` : '',
    contextUserId ? \`profiles?auth_uid=eq.\${encodeURIComponent(contextUserId)}&select=workspace_id&limit=1\` : '',
    contextUserId ? \`profiles?firebase_uid=eq.\${encodeURIComponent(contextUserId)}&select=workspace_id&limit=1\` : '',
    isLikelyUuid(contextUserId) ? \`profiles?id=eq.\${encodeURIComponent(contextUserId)}&select=workspace_id&limit=1\` : '',
  ].filter(Boolean);
  for (const profileQuery of profileQueries) {
    const profileRows = await selectRows(profileQuery);
    const profileWorkspaceId = asText(profileRows[0]?.workspace_id);
    if (profileWorkspaceId) return profileWorkspaceId;
  }

  throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');
}
`;
  text = text.replace(/export async function resolveRequestWorkspaceId\([\s\S]*?\n}\n\nexport function withWorkspaceFilter/, replacement + '\nexport function withWorkspaceFilter');
  save(rel, before, text);
}

function patchAccessGate() {
  const rel = 'src/server/_access-gate.ts';
  const before = read(rel);
  if (!before) return;
  let text = before;
  text = text.replace(
    /  if \(isRequestLike\(workspaceInput\)\) \{\s*return \{ access_status: 'trial_active' \};\s*\}/,
    "  if (isRequestLike(workspaceInput)) {\n    throw makeGateError('WORKSPACE_ID_REQUIRED_FOR_ACCESS_GATE', 401);\n  }",
  );
  if (!text.includes('STAGE15_ACCESS_GATE_REQUIRES_WORKSPACE_ID')) {
    text = text.replace('async function resolveWorkspaceAccessInput', '// STAGE15_ACCESS_GATE_REQUIRES_WORKSPACE_ID\nasync function resolveWorkspaceAccessInput');
  }
  save(rel, before, text);
}

function patchClients() {
  const rel = 'api/clients.ts';
  const before = read(rel);
  if (!before) return;
  let text = before;
  text = addImportNames(text, ['updateByIdScoped', 'deleteByIdScoped']);
  text = text.replace(/async function updateWithSchemaFallback\(id: string, payload: Record<string, unknown>\)/, 'async function updateWithSchemaFallback(id: string, workspaceId: string, payload: Record<string, unknown>)');
  text = text.replace(/return await updateById\('clients', id, current\);/g, "return await updateByIdScoped('clients', id, workspaceId, current);");
  text = text.replace(/const data = await updateWithSchemaFallback\(id, payload\);/g, 'const data = await updateWithSchemaFallback(id, workspaceId, payload);');
  text = text.replace(/await deleteById\('clients', id\);/g, "await deleteByIdScoped('clients', id, workspaceId);");
  save(rel, before, text);
}

function patchActivities() {
  const rel = 'api/activities.ts';
  const before = read(rel);
  if (!before) return;
  let text = before;
  text = addImportNames(text, ['updateByIdScoped', 'deleteByIdScoped']);
  text = text.replace(/const updated = await updateById\('activities', id, patch\);/g, "const updated = await updateByIdScoped('activities', id, workspaceId, patch);");
  text = text.replace(/await deleteById\('activities', id\);/g, "await deleteByIdScoped('activities', id, workspaceId);");
  save(rel, before, text);
}

function patchCases() {
  const rel = 'api/cases.ts';
  const before = read(rel);
  if (!before) return;
  let text = before;
  text = addImportNames(text, ['updateByIdScoped', 'deleteByIdScoped']);
  text = text.replace(/async function updateCaseWithSchemaFallback\(id: string, payload: Record<string, unknown>\)/, 'async function updateCaseWithSchemaFallback(id: string, workspaceId: string, payload: Record<string, unknown>)');
  text = text.replace(/return await updateById\('cases', id, current\);/g, "return await updateByIdScoped('cases', id, workspaceId, current);");
  text = text.replace(/const data = await updateCaseWithSchemaFallback\(String\(body\.id\), payload\);/g, 'const data = await updateCaseWithSchemaFallback(String(body.id), workspaceId, payload);');
  text = text.replace(/await deleteById\('cases', id\);/g, "await deleteByIdScoped('cases', id, workspaceId);");
  text = text.replace(/await bestEffortDelete\(`activities\?case_id=eq\.\$\{encodeURIComponent\(id\)\}`\);/g, "await bestEffortDelete(withWorkspaceFilter(`activities?case_id=eq.${encodeURIComponent(id)}`, workspaceId));");
  save(rel, before, text);
}

function patchWorkItems() {
  const rel = 'api/work-items.ts';
  const before = read(rel);
  if (!before) return;
  let text = before;
  text = addImportNames(text, ['updateByIdScoped', 'deleteByIdScoped']);
  text = text.replace(/async function writeGoogleCalendarSyncState\(id: unknown, payload: Record<string, unknown>\)/, 'async function writeGoogleCalendarSyncState(id: unknown, workspaceId: string, payload: Record<string, unknown>)');
  text = text.replace(/await updateById\('work_items', normalizedId, \{/g, "await updateByIdScoped('work_items', normalizedId, workspaceId, {");
  text = text.replace(/await writeGoogleCalendarSyncState\(rowId, \{/g, 'await writeGoogleCalendarSyncState(rowId, input.workspaceId, {');
  text = text.replace(/await updateById\('leads', normalizedLeadId, \{/g, "await updateByIdScoped('leads', normalizedLeadId, workspaceId, {");
  text = text.replace(/const data = await updateById\('work_items', String\(body\.id\), payload\);/g, "const data = await updateByIdScoped('work_items', String(body.id), workspaceId, payload);");
  text = text.replace(/await deleteById\('work_items', id\);/g, "await deleteByIdScoped('work_items', id, workspaceId);");
  save(rel, before, text);
}

function patchLeads() {
  const rel = 'api/leads.ts';
  const before = read(rel);
  if (!before) return;
  let text = before;
  text = addImportNames(text, ['updateByIdScoped', 'deleteByIdScoped']);
  text = text.replace(/async function updateLeadWithSchemaFallback\(id: string, payload: Record<string, unknown>\)/, 'async function updateLeadWithSchemaFallback(id: string, workspaceId: string, payload: Record<string, unknown>)');
  text = text.replace(/return await updateById\('leads', id, currentPayload\);/g, "return await updateByIdScoped('leads', id, workspaceId, currentPayload);");
  text = text.replace(/async function writeLeadGoogleCalendarSyncState\(leadId: string, payload: Record<string, unknown>\)/, 'async function writeLeadGoogleCalendarSyncState(leadId: string, workspaceId: string, payload: Record<string, unknown>)');
  text = text.replace(/await updateLeadWithSchemaFallback\(leadId, \{/g, 'await updateLeadWithSchemaFallback(leadId, workspaceId, {');
  text = text.replace(/await updateLeadWithSchemaFallback\(leadId, leadPayload\);/g, 'await updateLeadWithSchemaFallback(leadId, workspaceId, leadPayload);');
  text = text.replace(/writeLeadGoogleCalendarSyncState\(leadId, \{/g, 'writeLeadGoogleCalendarSyncState(leadId, input.workspaceId, {');
  text = text.replace(/const data = await updateLeadWithSchemaFallback\(String\(body\.id\), payload\);/g, 'const data = await updateLeadWithSchemaFallback(String(body.id), workspaceId, payload);');
  text = text.replace(/await deleteById\('leads', id\);/g, "await deleteByIdScoped('leads', id, workspaceId);");
  save(rel, before, text);
}

patchPackageJson();
patchSupabase();
patchRequestScope();
patchAccessGate();
patchClients();
patchActivities();
patchCases();
patchWorkItems();
patchLeads();

console.log('OK: Stage15 workspace security repair completed.');
console.log('Touched files: ' + touched.length);
for (const rel of touched) console.log('- ' + rel);
