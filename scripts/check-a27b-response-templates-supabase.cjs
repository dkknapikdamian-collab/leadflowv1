const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    console.error(`A27B guard failed: missing ${rel}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function requireIncludes(content, marker, file) {
  if (!content.includes(marker)) {
    console.error(`A27B guard failed: ${file} missing marker: ${marker}`);
    process.exit(1);
  }
}

const apiRoute = read('api/response-templates.ts');
requireIncludes(apiRoute, "responseTemplatesHandler", 'api/response-templates.ts');

const handler = read('src/server/response-templates-handler.ts');
for (const marker of [
  "const A27_RESPONSE_TEMPLATES_SUPABASE_CONTRACT_LOCK = 'response_templates are workspace scoped user data with archived_at soft archive';",
  "withWorkspaceFilter(`response_templates?select=*&${filters}order=updated_at.desc.nullslast&limit=${limit}`, workspaceId)",
  "const searchQuery = asText(req.query?.q || req.query?.search);",
  "payload.archived_at = nowIso;",
  "await updateById('response_templates', id, {",
  "archived_at: archivedAt",
  "RESPONSE_TEMPLATE_NAME_BODY_REQUIRED",
]) {
  requireIncludes(handler, marker, 'src/server/response-templates-handler.ts');
}

const migration = read('supabase/migrations/20260501_a27_response_templates_supabase.sql');
for (const marker of [
  'create table if not exists public.response_templates',
  'workspace_id uuid',
  'name text',
  'category text',
  'tags text[]',
  'body text',
  'variables text[]',
  'archived_at timestamptz',
  'response_templates_workspace_active_idx',
  'alter table public.response_templates enable row level security;',
]) {
  requireIncludes(migration, marker, 'supabase/migrations/20260501_a27_response_templates_supabase.sql');
}

const layout = read('src/components/Layout.tsx');
for (const marker of [
  'MessageSquareText',
  "label: 'Odpowiedzi', path: '/response-templates'",
]) {
  requireIncludes(layout, marker, 'src/components/Layout.tsx');
}

const app = read('src/App.tsx');
requireIncludes(app, '<Route path="/response-templates"', 'src/App.tsx');

const page = read('src/pages/ResponseTemplates.tsx');
for (const marker of [
  'fetchResponseTemplatesFromSupabase',
  'createResponseTemplateInSupabase',
  'updateResponseTemplateInSupabase',
  'deleteResponseTemplateFromSupabase',
  'Kopiuj',
]) {
  requireIncludes(page, marker, 'src/pages/ResponseTemplates.tsx');
}

console.log('OK: A27B response templates Supabase guard passed.');
