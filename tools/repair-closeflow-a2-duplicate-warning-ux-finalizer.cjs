const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MARKER = 'CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER';

function file(rel) { return path.join(ROOT, rel); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8'); }
function write(rel, text) { fs.writeFileSync(file(rel), text.replace(/^\uFEFF/, ''), 'utf8'); }
function ensureIncludes(text, needle, insertAtTop = true) {
  if (text.includes(needle)) return text;
  return insertAtTop ? `${needle}\n${text}` : `${text}\n${needle}\n`;
}
function replaceOrThrow(rel, text, from, to, label) {
  if (!text.includes(from)) throw new Error(`${rel}: cannot find ${label || from}`);
  return text.replace(from, to);
}

function patchPackage() {
  const rel = 'package.json';
  const raw = read(rel).replace(/^\uFEFF/, '');
  const pkg = JSON.parse(raw);
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:a2-duplicate-warning-ux-finalizer'] = 'node scripts/check-closeflow-a2-duplicate-warning-ux-finalizer.cjs';
  write(rel, JSON.stringify(pkg, null, 2) + '\n');
  console.log('patched:', rel);
}

function patchEntityConflictDialog() {
  const rel = 'src/components/EntityConflictDialog.tsx';
  let text = read(rel);
  text = ensureIncludes(text, `// ${MARKER}`);
  if (!text.includes('CLOSEFLOW_A2_DUPLICATE_WARNING_ACTIONS')) {
    text = text.replace(
      "// CLOSEFLOW_ENTITY_CONFLICT_DIALOG_V1",
      "// CLOSEFLOW_ENTITY_CONFLICT_DIALOG_V1\n// CLOSEFLOW_A2_DUPLICATE_WARNING_ACTIONS: Pokaż / Przywróć / Dodaj mimo to / Anuluj"
    );
  }
  text = text.replace(
    "description = 'Znaleziono podobny rekord. Sprawdź go przed zapisem, żeby nie tworzyć przypadkowego duplikatu.',",
    "description = 'Znaleziono podobny rekord po e-mailu, telefonie, nazwie albo firmie. Sprawdź go przed zapisem albo świadomie dodaj mimo to.',"
  );
  write(rel, text);
  console.log('patched:', rel);
}

function patchSupabaseFallback() {
  const rel = 'src/lib/supabase-fallback.ts';
  let text = read(rel);
  text = ensureIncludes(text, `// ${MARKER}`);
  text = text.replace(
    "entityType: 'lead' | 'client';",
    "entityType: 'lead' | 'client' | 'case';"
  );
  if (!text.includes("matchFields?: Array<'email' | 'phone' | 'name' | 'company'>;")) {
    text = text.replace(
      "matches: Array<'email' | 'phone' | 'name' | 'company'>;",
      "matches: Array<'email' | 'phone' | 'name' | 'company'>;\n  matchFields?: Array<'email' | 'phone' | 'name' | 'company'>;"
    );
  }
  if (!text.includes('function normalizeDuplicateWriteOverride')) {
    const helper = `
function normalizeDuplicateWriteOverride<T extends Record<string, unknown>>(input: T): T & { allowDuplicate: boolean } {
  // CLOSEFLOW_A2_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP
  const next: Record<string, unknown> = { ...(input || {}) };
  if (next.allowDuplicate === undefined) next.allowDuplicate = Boolean(next.forceDuplicate);
  delete next.forceDuplicate;
  return next as T & { allowDuplicate: boolean };
}
`;
    text = text.replace('export function isSupabaseConfigured()', `${helper}\nexport function isSupabaseConfigured()`);
  }
  text = text.replace(
    "body: JSON.stringify(sanitizeLeadCompanyForNotNull(input))",
    "body: JSON.stringify(sanitizeLeadCompanyForNotNull(normalizeDuplicateWriteOverride(input as unknown as Record<string, unknown>) as unknown as LeadInsertInput))"
  );
  text = text.replace(
    "export async function createClientInSupabase(input: ClientUpsertInput) { return callApi<SupabaseInsertResult>('/api/clients', { method: 'POST', body: JSON.stringify(input) }); }",
    "export async function createClientInSupabase(input: ClientUpsertInput) { return callApi<SupabaseInsertResult>('/api/clients', { method: 'POST', body: JSON.stringify(normalizeDuplicateWriteOverride(input as unknown as Record<string, unknown>)) }); }"
  );
  write(rel, text);
  console.log('patched:', rel);
}

function patchLeads() {
  const rel = 'src/pages/Leads.tsx';
  let text = read(rel);
  text = ensureIncludes(text, `// ${MARKER}`);
  if (!text.includes('CLOSEFLOW_A2_LEAD_DUPLICATE_WARNING_BEFORE_WRITE')) {
    text = text.replace(
      'const createLeadSubmitLockRef = useRef(false);',
      "const CLOSEFLOW_A2_LEAD_DUPLICATE_WARNING_BEFORE_WRITE = 'lead duplicate warning before write';\n  const createLeadSubmitLockRef = useRef(false);"
    );
  }
  if (!text.includes('CLOSEFLOW_A2_LEAD_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP')) {
    text = text.replace(
      'await insertLeadToSupabase({ ...sanitizedPreparedLead, allowDuplicate: Boolean(options?.forceDuplicate), ownerId: workspace?.ownerId, workspaceId: requireWorkspaceId(workspace) });',
      "// CLOSEFLOW_A2_LEAD_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP\n    await insertLeadToSupabase({ ...sanitizedPreparedLead, allowDuplicate: Boolean(options?.forceDuplicate), ownerId: workspace?.ownerId, workspaceId: requireWorkspaceId(workspace) });"
    );
  }
  write(rel, text);
  console.log('patched:', rel);
}

function patchClients() {
  const rel = 'src/pages/Clients.tsx';
  let text = read(rel);
  text = ensureIncludes(text, `// ${MARKER}`);
  if (!text.includes('CLOSEFLOW_A2_CLIENT_DUPLICATE_WARNING_BEFORE_WRITE')) {
    text = text.replace(
      "const CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FULL = 'lead and client duplicate warning modal before write';",
      "const CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FULL = 'lead and client duplicate warning modal before write';\nconst CLOSEFLOW_A2_CLIENT_DUPLICATE_WARNING_BEFORE_WRITE = 'client duplicate warning before write';"
    );
  }
  text = text.replace(
    "await createClientInSupabase({ ...preparedClient, forceDuplicate: Boolean(options?.forceDuplicate), workspaceId: requireWorkspaceId(workspace) });",
    "// CLOSEFLOW_A2_CLIENT_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP\n    await createClientInSupabase({ ...preparedClient, allowDuplicate: Boolean(options?.forceDuplicate), workspaceId: requireWorkspaceId(workspace) });"
  );
  write(rel, text);
  console.log('patched:', rel);
}

function patchEntityConflictsHandler() {
  const rel = 'src/server/entity-conflicts-handler.ts';
  let text = read(rel);
  text = ensureIncludes(text, `// ${MARKER}`);
  if (!text.includes('CLOSEFLOW_A2_ENTITY_CONFLICTS_MATCH_FIELDS')) {
    text = text.replace(
      '// CLOSEFLOW_ENTITY_CONFLICTS_API_V1',
      '// CLOSEFLOW_ENTITY_CONFLICTS_API_V1\n// CLOSEFLOW_A2_ENTITY_CONFLICTS_MATCH_FIELDS: normalizes email/phone/name/company and returns matchFields'
    );
  }
  text = text.replace('matchFields: matches, canRestore:', 'matchFields: matches, matches, canRestore:');
  text = text.replace('matchFields: matches, canRestore:', 'matchFields: matches, matches, canRestore:');
  text = text.replace('res.status(200).json({ ok: true, candidates });', 'res.status(200).json({ ok: true, candidates, conflicts: candidates });');
  write(rel, text);
  console.log('patched:', rel);
}

function patchApiSystem() {
  const rel = 'api/system.ts';
  let text = read(rel);
  text = ensureIncludes(text, `// ${MARKER}`);
  if (!text.includes('CLOSEFLOW_A2_API_SYSTEM_ENTITY_CONFLICTS_FINALIZER')) {
    text = text.replace(
      "import entityConflictsHandler from '../src/server/entity-conflicts-handler.js';",
      "import entityConflictsHandler from '../src/server/entity-conflicts-handler.js';\n// CLOSEFLOW_A2_API_SYSTEM_ENTITY_CONFLICTS_FINALIZER: kind=entity-conflicts delegates to normalized lead/client conflict search."
    );
  }
  write(rel, text);
  console.log('patched:', rel);
}

function patchApiLeadsClients() {
  for (const rel of ['api/leads.ts', 'api/clients.ts']) {
    let text = read(rel);
    text = ensureIncludes(text, `// ${MARKER}`);
    if (!text.includes('CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE')) {
      text = text.replace(/(function asText\(value: unknown\) \{)/, "const CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE = 'allowDuplicate is the API duplicate override flag';\n\n$1");
    }
    write(rel, text);
    console.log('patched:', rel);
  }
}

patchPackage();
patchEntityConflictDialog();
patchSupabaseFallback();
patchLeads();
patchClients();
patchEntityConflictsHandler();
patchApiSystem();
patchApiLeadsClients();
console.log('CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER_PATCH_OK');
