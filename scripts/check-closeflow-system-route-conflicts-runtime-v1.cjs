const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
function assert(condition, message) { if (!condition) { throw new Error(message); } }
const system = read('api/system.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const handlerIndex = system.indexOf('export default async function handler');
assert(handlerIndex >= 0, 'Missing api/system.ts default handler');
const handler = system.slice(handlerIndex);
const bodyMatches = handler.match(/const body = parseBody\(req\.body\);/g) || [];
assert(bodyMatches.length === 1, 'api/system.ts handler must declare body exactly once, found ' + bodyMatches.length);
assert(system.includes("entity-conflicts-handler"), 'api/system.ts must import entity-conflicts-handler');
assert(system.includes("kind === 'entity-conflicts'") || system.includes('kind === "entity-conflicts"'), 'api/system.ts must route kind=entity-conflicts');
assert(!fs.existsSync(path.join(root, 'api/entity-conflicts.ts')), 'api/entity-conflicts.ts must not exist as separate Vercel function');
assert(fallback.includes('export async function findEntityConflictsInSupabase'), 'supabase-fallback must export findEntityConflictsInSupabase');
assert(fallback.includes('/api/system?kind=entity-conflicts'), 'conflict lookup must use /api/system?kind=entity-conflicts');
assert(!fallback.includes('/api/entity-conflicts'), 'supabase-fallback must not call removed /api/entity-conflicts endpoint');
console.log('CLOSEFLOW_SYSTEM_ROUTE_CONFLICTS_RUNTIME_REPAIR_V1_CHECK_OK');
