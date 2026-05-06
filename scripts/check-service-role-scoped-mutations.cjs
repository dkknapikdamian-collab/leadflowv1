const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), 'utf8') : '';
}
const errors = [];
function assert(condition, message) { if (!condition) errors.push(message); }

const supabase = read('src/server/_supabase.ts');
assert(supabase.includes('SUPABASE_SERVICE_ROLE_KEY'), '_supabase.ts must keep service role server-side only');
assert(!/VITE_SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/.test(supabase), '_supabase.ts must not read public service-role env names');
assert(supabase.includes('updateByWorkspaceAndId'), '_supabase.ts must expose updateByWorkspaceAndId');
assert(supabase.includes('deleteByWorkspaceAndId'), '_supabase.ts must expose deleteByWorkspaceAndId');
assert(/workspaceColumn\s*=\s*['"]workspace_id['"]/.test(supabase), 'scoped helpers must default to workspace_id');

const endpointFiles = ['api/leads.ts', 'api/clients.ts', 'api/cases.ts', 'api/activities.ts', 'api/work-items.ts'];
for (const rel of endpointFiles) {
  const src = read(rel);
  if (!src) {
    errors.push(`${rel} is missing`);
    continue;
  }
  assert(src.includes('resolveRequestWorkspaceId'), `${rel} must resolve workspace through request scope`);
  assert(src.includes('requireScopedRow') || src.includes('withWorkspaceFilter'), `${rel} must use scoped read helpers`);
  if (/await\s+deleteById\s*\(/.test(src)) {
    errors.push(`${rel} still uses await deleteById(...) in a workspace-owned endpoint`);
  }
  const directUpdateMatches = [...src.matchAll(/await\s+updateById\s*\(\s*['"](leads|clients|cases|activities|work_items)['"]/g)];
  for (const match of directUpdateMatches) {
    const line = src.slice(0, match.index).split(/\r?\n/).length;
    errors.push(`${rel}:${line} still uses await updateById('${match[1]}', ...) in a workspace-owned endpoint`);
  }
}

const system = read('api/system.ts');
if (system) {
  assert(system.includes('assertWorkspaceOwnerOrAdmin'), 'api/system.ts workspace settings must require owner/admin checks');
}

if (errors.length) {
  console.error('Service-role scoped mutation guard failed.');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('OK: service-role scoped mutation guard passed.');
