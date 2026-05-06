const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function write(rel, content) { fs.writeFileSync(path.join(root, rel), content, 'utf8'); touched.add(rel); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
const touched = new Set();

function patchPackageJson() {
  const rel = 'package.json';
  const json = JSON.parse(read(rel));
  json.scripts = json.scripts || {};
  const entries = {
    'check:admin-backend-guard': 'node scripts/check-admin-backend-guard.cjs',
    'check:service-role-scoped-mutations': 'node scripts/check-service-role-scoped-mutations.cjs',
    'test:admin-backend-guard': 'node --test tests/admin-backend-guard.test.cjs',
    'test:service-role-scoped-mutations': 'node --test tests/service-role-scoped-mutations.test.cjs',
  };
  let changed = false;
  for (const [key, value] of Object.entries(entries)) {
    if (json.scripts[key] !== value) {
      json.scripts[key] = value;
      changed = true;
    }
  }
  if (changed) write(rel, JSON.stringify(json, null, 2) + '\n');
}

function ensureAdminBackendMarker() {
  const rel = 'src/server/ai-config.ts';
  if (!exists(rel)) return;
  let src = read(rel);
  let changed = false;
  if (!src.includes('STAGE16_ADMIN_BACKEND_GUARD')) {
    src = src.replace(
      "import { writeAuthErrorResponse } from './_supabase-auth.js';\n",
      "import { writeAuthErrorResponse } from './_supabase-auth.js';\n\nconst STAGE16_ADMIN_BACKEND_GUARD = 'AI diagnostics require requireAdminAuthContext on backend; UI gating is not enough';\n"
    );
    changed = true;
  }
  if (!src.includes('await requireAdminAuthContext(req);')) {
    throw new Error('src/server/ai-config.ts is missing requireAdminAuthContext(req)');
  }
  if (changed) write(rel, src);
}

function ensureAdminUiMarker() {
  const rel = 'src/pages/AdminAiSettings.tsx';
  if (!exists(rel)) return;
  let src = read(rel);
  let changed = false;
  if (!src.includes('STAGE16_ADMIN_UI_API_ME_ONLY')) {
    src = src.replace(
      'export default function AdminAiSettings() {',
      "// STAGE16_ADMIN_UI_API_ME_ONLY: admin visibility is derived from useWorkspace()/api/me, not localStorage or query params.\nexport default function AdminAiSettings() {"
    );
    changed = true;
  }
  if (/(localStorage|sessionStorage)\s*\.\s*getItem\s*\([^)]*(admin|role|isAdmin)/i.test(src)) {
    throw new Error('AdminAiSettings must not derive admin rights from browser storage');
  }
  if (!src.includes('const { isAdmin, loading } = useWorkspace();')) {
    throw new Error('AdminAiSettings must derive isAdmin from useWorkspace/api me path');
  }
  if (changed) write(rel, src);
}

function ensureSupabaseScopedHelpers() {
  const rel = 'src/server/_supabase.ts';
  if (!exists(rel)) return;
  let src = read(rel);
  let changed = false;
  if (!src.includes('STAGE16_SERVICE_ROLE_SCOPED_MUTATION_HELPERS')) {
    src = src.replace(
      'export async function updateById(table: string, id: string, payload: RecordMap) {',
      "// STAGE16_SERVICE_ROLE_SCOPED_MUTATION_HELPERS: service-role writes that touch workspace-owned business rows must prefer the scoped helpers below.\nexport async function updateById(table: string, id: string, payload: RecordMap) {"
    );
    changed = true;
  }
  if (!src.includes('export async function updateByWorkspaceAndId')) {
    const helper = [
      '',
      'export async function updateByWorkspaceAndId(',
      '  table: string,',
      '  id: string,',
      '  workspaceId: string,',
      '  payload: RecordMap,',
      "  idColumn = 'id',",
      "  workspaceColumn = 'workspace_id',",
      ') {',
      '  const encodedId = encodeURIComponent(id);',
      '  const encodedWorkspaceId = encodeURIComponent(workspaceId);',
      '  return supabaseRequest(`${table}?${idColumn}=eq.${encodedId}&${workspaceColumn}=eq.${encodedWorkspaceId}`, {',
      "    method: 'PATCH',",
      '    body: JSON.stringify(payload),',
      '  });',
      '}',
      '',
      'export async function deleteByWorkspaceAndId(',
      '  table: string,',
      '  id: string,',
      '  workspaceId: string,',
      "  idColumn = 'id',",
      "  workspaceColumn = 'workspace_id',",
      ') {',
      '  const encodedId = encodeURIComponent(id);',
      '  const encodedWorkspaceId = encodeURIComponent(workspaceId);',
      '  return supabaseRequest(`${table}?${idColumn}=eq.${encodedId}&${workspaceColumn}=eq.${encodedWorkspaceId}`, {',
      "    method: 'DELETE',",
      '    headers: {',
      "      Prefer: 'return=representation',",
      '    },',
      '  });',
      '}',
      '',
    ].join('\n');
    src = src.replace('export async function updateWhere(path: string, payload: RecordMap) {', helper + 'export async function updateWhere(path: string, payload: RecordMap) {');
    changed = true;
  }
  if (changed) write(rel, src);
}

function addImportName(importLine, name) {
  if (importLine.includes(name)) return importLine;
  return importLine.replace(/import\s+\{([^}]+)\}\s+from/, (m, inner) => {
    const names = inner.split(',').map((x) => x.trim()).filter(Boolean);
    names.push(name);
    return `import { ${names.join(', ')} } from`;
  });
}

function opportunisticPatchScopedMutations() {
  const patches = [
    {
      rel: 'api/clients.ts',
      table: 'clients',
      replacements: [
        ["await updateWithSchemaFallback(id, payload)", "await updateWithSchemaFallback(id, payload, workspaceId)"],
        ["await deleteById('clients', id)", "await deleteByWorkspaceAndId('clients', id, workspaceId)"],
      ],
      updateFallbackSignature: true,
    },
    {
      rel: 'api/activities.ts',
      table: 'activities',
      replacements: [
        ["await updateById('activities', id, patch)", "await updateByWorkspaceAndId('activities', id, workspaceId, patch)"],
        ["await deleteById('activities', id)", "await deleteByWorkspaceAndId('activities', id, workspaceId)"],
      ],
    },
    {
      rel: 'api/cases.ts',
      table: 'cases',
      replacements: [
        ["await updateCaseWithSchemaFallback(String(body.id), payload)", "await updateCaseWithSchemaFallback(String(body.id), payload, workspaceId)"],
        ["await deleteById('cases', id)", "await deleteByWorkspaceAndId('cases', id, workspaceId)"],
      ],
      updateCaseFallbackSignature: true,
    },
    {
      rel: 'api/work-items.ts',
      table: 'work_items',
      replacements: [
        ["await updateById('work_items', String(body.id), payload)", "await updateByWorkspaceAndId('work_items', String(body.id), workspaceId, payload)"],
        ["await deleteById('work_items', id)", "await deleteByWorkspaceAndId('work_items', id, workspaceId)"],
      ],
    },
  ];

  for (const item of patches) {
    if (!exists(item.rel)) continue;
    let src = read(item.rel);
    let changed = false;
    const importMatch = src.match(/import\s+\{[^}]+\}\s+from\s+['"]\.\.\/src\/server\/_supabase\.js['"];?/);
    if (importMatch) {
      let nextImport = addImportName(importMatch[0], 'updateByWorkspaceAndId');
      nextImport = addImportName(nextImport, 'deleteByWorkspaceAndId');
      if (nextImport !== importMatch[0]) {
        src = src.replace(importMatch[0], nextImport);
        changed = true;
      }
    }

    if (item.updateFallbackSignature) {
      src = src.replace(
        'async function updateWithSchemaFallback(id: string, payload: Record<string, unknown>) {',
        'async function updateWithSchemaFallback(id: string, payload: Record<string, unknown>, workspaceId: string) {'
      );
      src = src.replace(
        "return await updateById('clients', id, current);",
        "return await updateByWorkspaceAndId('clients', id, workspaceId, current);"
      );
    }
    if (item.updateCaseFallbackSignature) {
      src = src.replace(
        'async function updateCaseWithSchemaFallback(id: string, payload: Record<string, unknown>) {',
        'async function updateCaseWithSchemaFallback(id: string, payload: Record<string, unknown>, workspaceId: string) {'
      );
      src = src.replace(
        "return await updateById('cases', id, current);",
        "return await updateByWorkspaceAndId('cases', id, workspaceId, current);"
      );
    }

    for (const [from, to] of item.replacements) {
      if (src.includes(from)) {
        src = src.replaceAll(from, to);
        changed = true;
      }
    }
    if (!src.includes('STAGE16_SCOPED_MUTATION_ENDPOINT')) {
      src = '/* STAGE16_SCOPED_MUTATION_ENDPOINT: workspace-owned mutations must scope service-role writes by workspace_id. */\n' + src;
      changed = true;
    }
    if (changed) write(item.rel, src);
  }
}

patchPackageJson();
ensureAdminBackendMarker();
ensureAdminUiMarker();
ensureSupabaseScopedHelpers();
opportunisticPatchScopedMutations();

console.log('OK: Stage16 admin/service-role guard repair completed.');
console.log('Touched files: ' + touched.size);
for (const rel of touched) console.log('- ' + rel);
